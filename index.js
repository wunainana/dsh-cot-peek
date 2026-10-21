/**
 * Host half of the dsh-cot-peek bundle.
 *
 * The window itself lives in the browser, but browsers refuse cross-origin
 * requests to servers that do not send CORS headers (LM Studio's server does,
 * Ollama needs OLLAMA_ORIGINS, and many local gateways such as
 * dsh-our-free-model's 127.0.0.1:8326 send none at all). This Host route is the
 * way around that: the Client posts the translation request to the Host on the
 * same origin, and the Host forwards it to the configured endpoint.
 *
 * Security notes:
 * - only loopback / RFC1918 targets are allowed, so this cannot be used as an
 *   open relay to arbitrary internet hosts;
 * - Origin / Referer must match the Host the request arrived on, so another
 *   website cannot drive the proxy through the user's browser;
 * - bodies and upstream replies are size limited, and the upstream call has a
 *   hard timeout.
 */

const PREFIX = '/api/dsh-cot-peek'
const MAX_BODY_BYTES = 256 * 1024
const MAX_TEXT_CHARS = 24000
const MAX_UPSTREAM_BYTES = 512 * 1024
const UPSTREAM_TIMEOUT_MS = 60000

const SYSTEM_PROMPT =
  'You are a translation engine. Translate the user text into Simplified Chinese. ' +
  'Keep code, URLs, file paths, identifiers and placeholder tokens like ⟦1⟧ unchanged. ' +
  'Output only the translation, no explanations.'

function json(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(body)
}

/** Loopback and private-network only: the proxy must not become an open relay. */
function isPrivateHost(hostname) {
  const host = String(hostname).toLowerCase()
  if (host === 'localhost' || host === '::1' || host === '[::1]') return true
  if (host === '0.0.0.0') return true
  if (/^127\.\d+\.\d+\.\d+$/.test(host)) return true
  if (/^10\.\d+\.\d+\.\d+$/.test(host)) return true
  if (/^192\.168\.\d+\.\d+$/.test(host)) return true
  const match = /^172\.(\d+)\.\d+\.\d+$/.exec(host)
  if (match !== null) {
    const second = Number(match[1])
    if (second >= 16 && second <= 31) return true
  }
  return false
}

/** Same-origin check: non-browser callers (curl, DSH itself) send no Origin. */
function sameOrigin(req) {
  const host = typeof req.headers.host === 'string' ? req.headers.host : ''
  if (host === '') return false
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : ''
  if (origin !== '') {
    try {
      return new URL(origin).host === host
    } catch (error) {
      return false
    }
  }
  const referer = typeof req.headers.referer === 'string' ? req.headers.referer : ''
  if (referer !== '') {
    try {
      return new URL(referer).host === host
    } catch (error) {
      return false
    }
  }
  return true
}

async function readJson(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('request body too large')
    chunks.push(chunk)
  }
  if (chunks.length === 0) return {}
  const text = Buffer.concat(chunks).toString('utf8')
  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error('invalid JSON body')
  }
}

function chatCompletionsUrl(baseUrl) {
  const trimmed = baseUrl.replace(/\/+$/, '')
  if (/\/chat\/completions$/.test(trimmed)) return trimmed
  return trimmed + '/chat/completions'
}

function createHandler(logger) {
  return async function handler(req, res) {
    let route = '/'
    try {
      route = new URL(req.url ?? '/', 'http://localhost').pathname.slice(PREFIX.length).replace(/\/+$/, '') || '/'
    } catch (error) {
      route = '/'
    }

    if (route === '/health' && (req.method === 'GET' || req.method === 'HEAD')) {
      json(res, 200, { ok: true, proxy: 'dsh-cot-peek' })
      return
    }
    if (route !== '/translate' || req.method !== 'POST') {
      json(res, 404, { ok: false, error: 'not found' })
      return
    }
    if (!sameOrigin(req)) {
      json(res, 403, { ok: false, error: 'cross-origin request rejected' })
      return
    }

    let body
    try {
      body = await readJson(req)
    } catch (error) {
      json(res, 400, { ok: false, error: error.message })
      return
    }

    const baseUrl = typeof body.baseUrl === 'string' ? body.baseUrl.trim() : ''
    if (baseUrl === '') {
      json(res, 400, { ok: false, error: 'baseUrl is required' })
      return
    }
    let parsed
    try {
      parsed = new URL(baseUrl)
    } catch (error) {
      json(res, 400, { ok: false, error: 'baseUrl is not a valid URL' })
      return
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      json(res, 400, { ok: false, error: 'baseUrl must be http(s)' })
      return
    }
    if (parsed.username !== '' || parsed.password !== '') {
      json(res, 400, { ok: false, error: 'credentials in the URL are not supported' })
      return
    }
    if (!isPrivateHost(parsed.hostname)) {
      json(res, 403, { ok: false, error: 'the Host proxy only forwards to loopback or private endpoints' })
      return
    }

    const text = typeof body.text === 'string' ? body.text : ''
    if (text === '' || text.length > MAX_TEXT_CHARS) {
      json(res, 400, { ok: false, error: 'text is empty or too long' })
      return
    }

    const headers = { 'content-type': 'application/json' }
    if (typeof body.apiKey === 'string' && body.apiKey !== '') {
      headers.authorization = 'Bearer ' + body.apiKey
    }
    const payload = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
      stream: false,
    }
    if (typeof body.model === 'string' && body.model !== '') payload.model = body.model

    const endpoint = chatCompletionsUrl(baseUrl)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
    let response
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch (error) {
      clearTimeout(timer)
      const message = error instanceof Error ? error.message : String(error)
      logger?.warn?.('dsh-cot-peek proxy: upstream unreachable: ' + message)
      json(res, 502, { ok: false, error: 'endpoint unreachable: ' + message })
      return
    }
    clearTimeout(timer)

    let raw = ''
    try {
      raw = await response.text()
    } catch (error) {
      raw = ''
    }
    if (raw.length > MAX_UPSTREAM_BYTES) raw = raw.slice(0, MAX_UPSTREAM_BYTES)
    if (!response.ok) {
      json(res, 502, { ok: false, error: 'endpoint ' + response.status + ': ' + raw.slice(0, 200) })
      return
    }
    let data
    try {
      data = JSON.parse(raw)
    } catch (error) {
      json(res, 502, { ok: false, error: 'endpoint returned non-JSON' })
      return
    }
    const choice = data !== null && typeof data === 'object' && Array.isArray(data.choices) ? data.choices[0] : undefined
    const message = choice !== undefined && choice !== null ? choice.message : undefined
    const content = message !== undefined && message !== null ? message.content : undefined
    if (typeof content !== 'string' || content.trim() === '') {
      json(res, 502, { ok: false, error: 'endpoint returned an empty translation' })
      return
    }
    json(res, 200, { ok: true, text: content })
  }
}

export function apply(ctx) {
  const logger = ctx.logger
  // `webServer` may load after plugins do, so wait for it instead of reading
  // `ctx.get('webServer')` once (that returns undefined in the real composition).
  ctx.inject(['webServer'], (scoped) => {
    const server = scoped.webServer
    scoped.effect(
      () => server.register({ kind: 'prefix', path: PREFIX, handler: createHandler(logger) }),
      'dsh-cot-peek: translation proxy',
    )
    logger?.info?.('dsh-cot-peek: translation proxy mounted at ' + PREFIX)
  })
}
