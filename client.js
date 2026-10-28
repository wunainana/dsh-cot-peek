window.__ModuleLoader__.load({
  id: 'dsh-cot-peek',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'cotPeek';

    // ------------------------------------------------------------------
    // Copy
    // ------------------------------------------------------------------
    const en = {
      title: 'Thinking Peek',
      thinking: 'Thinking',
      idle: 'No reasoning in this turn yet',
      collapse: 'Collapse',
      expand: 'Expand',
      original: 'Original',
      translated: 'Translated',
      showOriginal: "Show the model's original reasoning",
      showTranslated: 'Show the Chinese translation',
      translating: 'Translating…',
      translationOff: 'Translation off',
      hintInstall: 'install the bundle or set an endpoint',
      translationFailed: 'Translation failed — showing original',
      translate: 'Translate',
      retranslate: 'Translate again',
      translateHint: 'Translate the reasoning shown in this window',
      auto: 'Auto',
      autoOn: 'Auto translation on — checks for new text every few seconds',
      autoOff: 'Auto translation off — click to translate new text automatically',
      off_remote: 'Translation bundle not mounted',
      off_contribution: 'Translation plugin not enabled',
      off_limits: 'Translation settings unavailable',
      off_error: 'Translation service error',
      settings: 'Translation source',
      settingsOpen: 'Configure translation endpoint',
      oaUrl: 'OpenAI-compatible base URL (e.g. http://127.0.0.1:1234/v1)',
      oaModel: 'Model (optional)',
      oaKey: 'API key (optional)',
      oaSave: 'Save',
      oaClear: 'Use official',
      oaNote: 'Stored in local storage. Code, URLs and terms stay shielded before sending.',
      oaBadge: 'OA',
      smooth: 'Smooth reveal',
      smoothRate: 'Reveal speed',
      smoothSlow: 'Slow',
      smoothMid: 'Normal',
      smoothFast: 'Fast',
      scrollBottom: 'Back to bottom',
      followingPaused: 'Follow paused — scroll up to read',
      accumulate: 'Accumulate every step of the turn',
      fetchModels: 'Fetch models',
      testConnection: 'Test connection',
      modelsFound: 'Models found:',
      modelsEmpty: 'Endpoint returned no models',
      oaModelPick: 'Pick a model from the fetched list',
      probeOk: 'Connected · sample translation: ',
      probeFailed: 'Failed: ',
      needModel: 'This endpoint requires a model name — press "Fetch models" and pick one',
      modelsSaved: 'Saved · models: ',
      hostMissing: 'Host route missing — restart DSH once so the proxy loads',
      settingsTitle: 'Thinking Peek · translation',
      settingsDesc: 'Pick the engine that translates the reasoning text.',
      engineOfficial: 'Official (Bing / Google / DeepSeek)',
      engineCustom: 'Custom OpenAI-compatible endpoint',
      oaUrlLabel: 'Endpoint base URL',
      oaModelLabel: 'Model (optional)',
      oaKeyLabel: 'API key (optional)',
      oaSaved: 'Saved. The window picks this up immediately.',
      oaNeedUrl: 'Fill in the endpoint URL first.',
      oaCorsNote: 'Loopback / private endpoints are forwarded by the DSH Host proxy, so no CORS is needed (this also covers gateways like dsh-our-free-model on 127.0.0.1:8326). Public https endpoints are still called by the browser and must allow CORS. Code, URLs and terms are shielded before sending.',
    };
    const zh = {
      title: '思考小窗',
      thinking: '思考中',
      idle: '这一轮还没有思考内容',
      collapse: '收起',
      expand: '展开',
      original: '原文',
      translated: '译文',
      showOriginal: '看模型原文',
      showTranslated: '看中文译文',
      translating: '翻译中…',
      translationOff: '翻译未启用',
      hintInstall: '装官方翻译包或配端点',
      translationFailed: '翻译失败，显示原文',
      translate: '翻译',
      retranslate: '再译',
      translateHint: '把这扇窗里的思考翻成中文',
      auto: '自动',
      autoOn: '自动翻译已开启：每隔几秒检查有没有新思考',
      autoOff: '自动翻译已关闭：点击开启，新内容会自动翻',
      off_remote: '翻译服务未挂载',
      off_contribution: '翻译插件未启用',
      off_limits: '翻译设置不可用',
      off_error: '翻译服务报错',
      settings: '翻译通道',
      settingsOpen: '配置翻译端点',
      oaUrl: 'OpenAI 兼容地址（如 http://127.0.0.1:1234/v1）',
      oaModel: '模型（可选）',
      oaKey: 'API Key（可选）',
      oaSave: '保存',
      oaClear: '改用官方',
      oaNote: '存在本地浏览器。发送前会先对代码、URL 和术语做占位保护。',
      oaBadge: '本地',
      smooth: '平滑显示',
      smoothRate: '显示速度',
      smoothSlow: '慢',
      smoothMid: '正常',
      smoothFast: '快',
      scrollBottom: '回到底部',
      followingPaused: '已暂停跟随，可自由回看',
      accumulate: '累积整轮思考（跨工具步骤）',
      fetchModels: '拉取模型列表',
      testConnection: '测试连接',
      modelsFound: '找到模型：',
      modelsEmpty: '端点没有返回模型',
      oaModelPick: '从拉取的列表里选模型',
      probeOk: '连接成功 · 试翻：',
      probeFailed: '失败：',
      needModel: '这个端点必须填模型名 —— 点「拉取模型列表」选一个',
      modelsSaved: '已保存 · 模型数：',
      hostMissing: '宿主路由未加载 —— 重启一次 DSH 才会挂上代理',
      settingsTitle: '思考小窗 · 翻译设置',
      settingsDesc: '选择翻译思考内容所用的引擎。',
      engineOfficial: '官方（Bing / Google / DeepSeek）',
      engineCustom: '自定义 OpenAI 兼容端点',
      oaUrlLabel: '端点地址',
      oaModelLabel: '模型（可选）',
      oaKeyLabel: 'API Key（可选）',
      oaSaved: '已保存，小窗会立刻生效。',
      oaNeedUrl: '先填端点地址。',
      oaCorsNote: '本地 / 内网地址会走 DSH 宿时代理转发，不受 CORS 限制（比如 our-free-model 的 127.0.0.1:8326 也能直接接）；公网 https 地址仍由浏览器直连，需要它允许跨域。发送前会先对代码、URL 和术语做占位保护。',
    };

    // ------------------------------------------------------------------
    // Term and code shielding.
    //
    // The trick that keeps machine translation from mangling technical
    // vocabulary: swap code, paths, URLs and known terms for opaque tokens
    // BEFORE the text leaves the browser, then put the exact originals back.
    // The translation engine never sees them, so it cannot mistranslate them.
    // ------------------------------------------------------------------
    const KEEP_TERMS = [
      'DSH',
      'DeepSeek Harness',
      'DeepSeek',
      'MCP',
      'LLM',
      'API',
      'SDK',
      'CLI',
      'JSON',
      'YAML',
      'HTTP',
      'HTTPS',
      'SSE',
      'URL',
      'URI',
      'UI',
      'UX',
      'DOM',
      'CSS',
      'HTML',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'React',
      'Vue',
      'Git',
      'GitHub',
      'npm',
      'pnpm',
      'Agent',
      'Session',
      'Token',
      'Prompt',
      'Context',
      'Slot',
      'Plugin',
      'Bundle',
      'Hook',
      'Tool',
      'Stream',
      'Markdown',
      'OpenAI',
      'Claude',
      'Copilot',
    ];

    function escapeRegExp(value) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const TERM_PATTERN = new RegExp('\\b(?:' + KEEP_TERMS.map(escapeRegExp).join('|') + ')\\b', 'g');
    const TOKEN_OPEN = '\u27E6';
    const TOKEN_CLOSE = '\u27E7';
    const TOKEN_PATTERN = /[\u27E6\u3010\[\u3014]\s*(\d+)\s*[\u27E7\u3011\]\u3015]/g;

    function protectText(source) {
      const tokens = [];
      const hold = (match) => {
        tokens.push(match);
        return TOKEN_OPEN + tokens.length + TOKEN_CLOSE;
      };
      const text = source
        .replace(/```[\s\S]*?```/g, hold)
        .replace(/`[^`\n]*`/g, hold)
        .replace(/https?:\/\/[^\s)\]}>]+/g, hold)
        .replace(
          /\b[\w./\\-]+\.(?:[cm]?[jt]sx?|json|md|css|html?|ya?ml|toml|py|rs|go|java|sh|ps1|txt|svg|png|gif)\b/gi,
          hold,
        )
        .replace(TERM_PATTERN, hold);
      return { text, tokens };
    }

    function restoreText(text, tokens) {
      return text.replace(TOKEN_PATTERN, (match, index) => {
        const token = tokens[Number(index) - 1];
        return token === undefined ? match : token;
      });
    }

    // ------------------------------------------------------------------
    // Sentence splitting: translate only finished sentences, keep the
    // unfinished tail verbatim so streaming never waits on the network.
    // ------------------------------------------------------------------
    const SENTENCE_END = /[.!?。！？\n]/;

    function completedPrefix(text) {
      for (let index = text.length - 1; index >= 0; index -= 1) {
        if (SENTENCE_END.test(text[index])) return index + 1;
      }
      return 0;
    }

    function chunkSentences(text) {
      const chunks = [];
      let buffer = '';
      let start = 0;
      for (let index = 0; index < text.length; index += 1) {
        if (!SENTENCE_END.test(text[index])) continue;
        buffer += text.slice(start, index + 1);
        start = index + 1;
        if (buffer.trim().length >= 28) {
          chunks.push(buffer);
          buffer = '';
        }
      }
      buffer += text.slice(start);
      if (buffer.trim()) chunks.push(buffer);
      return chunks;
    }

    // ------------------------------------------------------------------
    // Incremental translation engine: serial requests (no provider burst),
    // per-fragment cache, graceful fall back to the source text on failure.
    // ------------------------------------------------------------------
    const CACHE_LIMIT = 400;
    const fragmentCache = new Map();

    class PeekTranslation {
      constructor(translate, notify) {
        this.translate = translate;
        this.notify = notify;
        this.sourceDone = '';
        this.output = '';
        this.tail = '';
        this.queue = [];
        this.busy = false;
        this.failed = false;
        this.disposed = false;
        this.controller = new AbortController();
        this.seen = '';
        this.publish();
      }

      update(text) {
        if (this.disposed) return;
        if (!text.startsWith(this.seen)) {
          // The source jumped instead of growing (switch of turn/step, or a
          // rewritten step). Staying on the old prefix would make every later
          // pass look "already translated" and the window would freeze.
          this.sourceDone = '';
          this.output = '';
          this.tail = '';
          this.queue = [];
          this.failed = false;
        }
        this.seen = text;
        const cut = completedPrefix(text);
        this.tail = text.slice(cut);
        if (cut > 0) {
          const done = text.slice(0, cut);
          if (done.length > this.sourceDone.length) {
            const fresh = done.slice(this.sourceDone.length);
            this.sourceDone = done;
            for (const chunk of chunkSentences(fresh)) this.queue.push(chunk);
          }
        }
        this.publish();
        this.pump();
      }

      // Manual mode: translate every chunk of the text the user is looking at
      // right now, including the unfinished tail, on an explicit button press.
      translateAll(text) {
        if (this.disposed) return;
        this.seen = text;
        this.output = '';
        this.tail = '';
        this.sourceDone = text;
        this.queue = chunkSentences(text);
        this.failed = false;
        this.publish();
        this.pump();
      }

      publish() {
        if (this.disposed) return;
        this.notify({
          output: this.output,
          tail: this.tail,
          pending: this.busy || this.queue.length > 0,
          failed: this.failed,
        });
      }

      async pump() {
        if (this.busy || this.disposed) return;
        this.busy = true;
        this.publish();
        try {
          while (this.queue.length > 0 && !this.disposed) {
            const source = this.queue.shift();
            let output = fragmentCache.get(source);
            if (output === undefined) {
              try {
                output = await this.translate(source, this.controller.signal);
              } catch (error) {
                if (this.controller.signal.aborted || this.disposed) return;
                this.failed = true;
                output = source;
              }
              if (typeof output !== 'string' || output.trim() === '') output = source;
              fragmentCache.set(source, output);
              if (fragmentCache.size > CACHE_LIMIT) {
                const oldest = fragmentCache.keys().next();
                if (!oldest.done) fragmentCache.delete(oldest.value);
              }
            }
            if (this.disposed) return;
            this.output += output;
            this.publish();
          }
        } finally {
          this.busy = false;
          this.publish();
        }
      }

      dispose() {
        this.disposed = true;
        this.controller.abort();
      }
    }

    // ------------------------------------------------------------------
    // Read the live reasoning out of the Chat snapshot passed to the slot.
    // ------------------------------------------------------------------
    function latestAssistantNode(snapshot) {
      if (snapshot === undefined || snapshot === null) return null;
      const order = snapshot.order;
      const nodes = snapshot.nodes;
      if (!Array.isArray(order) || order.length === 0) return null;
      if (nodes === undefined || nodes === null || typeof nodes.get !== 'function') return null;
      // The newest assistant-step is the live one. Preferring an earlier node
      // merely because it was still marked "running" froze the window on the
      // first reasoning segment while later steps streamed into newer nodes.
      for (let index = order.length - 1; index >= 0; index -= 1) {
        const node = nodes.get(order[index]);
        if (node === undefined || node === null || node.kind !== 'assistant-step') continue;
        return node;
      }
      return null;
    }

    function reasoningOfNode(node) {
      const blocks = node === null || node === undefined || node.data === undefined ? undefined : node.data.blocks;
      if (!Array.isArray(blocks)) return '';
      let text = '';
      for (const block of blocks) {
        if (
          block !== undefined &&
          block !== null &&
          block.kind === 'reasoning' &&
          typeof block.text === 'string' &&
          block.text.trim() !== ''
        ) {
          text = block.text;
        }
      }
      return text;
    }

    const MAX_ACCUMULATED_CHARS = 20000;

    function selectReasoningText(snapshot) {
      const latest = latestAssistantNode(snapshot);
      if (latest === null) return '';
      if (readAccumulate() !== true) return reasoningOfNode(latest);
      // A turn can be thinking -> tool -> thinking -> ...; showing only the last
      // step makes earlier thinking vanish mid-read. Accumulate every step that
      // belongs to the same turn (data.turn), in order.
      const order = snapshot === undefined || snapshot === null ? undefined : snapshot.order;
      const nodes = snapshot === undefined || snapshot === null ? undefined : snapshot.nodes;
      const turn = latest.data === undefined || latest.data === null ? undefined : latest.data.turn;
      if (!Array.isArray(order) || nodes === undefined || nodes === null || typeof nodes.get !== 'function' || turn === undefined || turn === null) {
        return reasoningOfNode(latest);
      }
      const parts = [];
      for (const id of order) {
        const node = nodes.get(id);
        if (node === undefined || node === null || node.kind !== 'assistant-step') continue;
        if (node.data === undefined || node.data === null || node.data.turn !== turn) continue;
        const text = reasoningOfNode(node);
        if (text !== '') parts.push(text);
      }
      if (parts.length === 0) return reasoningOfNode(latest);
      const joined = parts.join('\n\n');
      return joined.length > MAX_ACCUMULATED_CHARS ? joined.slice(-MAX_ACCUMULATED_CHARS) : joined;
    }

    function selectReasoningRunning(snapshot) {
      const node = latestAssistantNode(snapshot);
      return node !== null && node.data !== undefined && node.data !== null && node.data.status === 'running';
    }

    // ------------------------------------------------------------------
    // Optional OpenAI-compatible translation endpoint (LM Studio / Ollama /
    // any gateway). When configured it takes priority over the official
    // cot-translation bundle, so a local model can do the translating.
    // ------------------------------------------------------------------
    const OA_KEY = 'dsh-cot-peek:oa';

    function readOA() {
      try {
        const raw = window.localStorage.getItem(OA_KEY);
        if (raw === null) return null;
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object') return null;
        const baseUrl = typeof parsed.baseUrl === 'string' ? parsed.baseUrl.trim() : '';
        if (baseUrl === '') return null;
        return {
          baseUrl: baseUrl.replace(/\/+$/, ''),
          model: typeof parsed.model === 'string' ? parsed.model.trim() : '',
          apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : '',
        };
      } catch (error) {
        return null;
      }
    }

    function writeOA(value) {
      try {
        if (value === null || value === undefined) {
          window.localStorage.removeItem(OA_KEY);
          return;
        }
        window.localStorage.setItem(OA_KEY, JSON.stringify(value));
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    const OA_SYSTEM_PROMPT =
      'You are a translation engine. Translate the user text into Simplified Chinese. ' +
      'Keep code, URLs, file paths, identifiers and placeholder tokens like ⟦1⟧ unchanged. ' +
      'Output only the translation, no explanations.';

    // ------------------------------------------------------------------
    // Bridge between the composer-dock data seat (the only place that owns
    // the session snapshot) and the frame-wide floating window.
    // ------------------------------------------------------------------
    const bridge = (() => {
      let value = { sessionId: null, text: '', running: false, bounds: null };
      const listeners = new Set();
      return {
        get: () => value,
        subscribe: (listener) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        set(next) {
          if (
            next.sessionId === value.sessionId &&
            next.text === value.text &&
            next.running === value.running &&
            next.bounds === value.bounds
          ) {
            return;
          }
          value = next;
          for (const listener of listeners) listener();
        },
      };
    })();

    // The window lives in shell.overlay (frame-wide), so staying "inside the
    // conversation" means measuring the composer column from the data seat and
    // publishing those horizontal bounds to the floating window.
    function measureColumnHost(node) {
      let element = node;
      for (let depth = 0; depth < 8 && element !== null; depth += 1) {
        if (
          typeof element.querySelector === 'function' &&
          element.querySelector('textarea, [contenteditable="true"]') !== null
        ) {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    }

    function columnBounds(host) {
      if (host === null) return null;
      const rect = host.getBoundingClientRect();
      if (!(rect.width > 1)) return null;
      return { left: Math.round(rect.left), right: Math.round(rect.right) };
    }

    function PeekSource(props) {
      const { sessionId, useChat } = props;
      const text = useChat(selectReasoningText);
      const running = useChat(selectReasoningRunning);
      const seat = React.useRef(null);
      const [bounds, setBounds] = React.useState(null);

      // Track the conversation column: a sidebar opening shrinks it, and the
      // floating window has to follow.
      React.useLayoutEffect(() => {
        const node = seat.current;
        if (node === null) return undefined;
        const host = measureColumnHost(node);
        let frame = null;
        const update = () => {
          frame = null;
          setBounds(columnBounds(host));
        };
        const schedule = () => {
          if (frame !== null) return;
          frame = window.requestAnimationFrame(update);
        };
        update();
        let observer = null;
        if (host !== null && typeof ResizeObserver === 'function') {
          observer = new ResizeObserver(schedule);
          observer.observe(host);
        }
        window.addEventListener('resize', schedule);
        return () => {
          if (frame !== null) window.cancelAnimationFrame(frame);
          if (observer !== null) observer.disconnect();
          window.removeEventListener('resize', schedule);
        };
      }, []);

      React.useEffect(() => {
        bridge.set({
          sessionId: typeof sessionId === 'string' ? sessionId : null,
          text: typeof text === 'string' ? text : '',
          running: running === true,
          bounds,
        });
      }, [sessionId, text, running, bounds]);

      React.useEffect(
        () => () => {
          bridge.set({ sessionId: null, text: '', running: false, bounds: null });
        },
        [],
      );

      return h('span', {
        ref: seat,
        'aria-hidden': 'true',
        style: { display: 'none' },
      });
    }

    // ------------------------------------------------------------------
    // Translation through the official experimental reasoning translator.
    // Optional: when that bundle is absent the window still shows the raw
    // reasoning and simply reports that translation is off.
    // ------------------------------------------------------------------
    function createTranslationService(ctx) {
      let limits;
      let loading = null;
      let reason = 'pending';
      let detailText = '';
      let reported = '';
      let mounted = false;
      let timer = null;
      let injected = null;
      const listeners = new Set();

      const log = (message, detail) => {
        try {
          console.info('[dsh-cot-peek] ' + message, detail === undefined ? '' : detail);
        } catch (error) {
          /* console may be missing in some runtimes */
        }
      };

      const setReason = (code, detail) => {
        reason = code;
        detailText = detail === undefined || detail === null ? '' : String(detail);
        const stamp = code + '|' + detailText;
        if (stamp !== reported) {
          reported = stamp;
          log('translation unavailable: ' + code, detail);
        }
      };

      // Preferred path: declare the dependency so cordis hands us the service
      // once the translator bundle mounts. Reading a service through ctx.get
      // without declaring it is what silently produced `undefined` before.
      const bindInjected = () => {
        if (injected !== null) return;
        if (typeof ctx.inject !== 'function') {
          log('ctx.inject is unavailable; falling back to ctx.get("remote")');
          return;
        }
        try {
          ctx.inject(['remote.cotTranslation'], (child) => {
            injected = child;
            log('remote.cotTranslation injected');
            probe().then(
              () => undefined,
              () => undefined,
            );
            return () => {
              injected = null;
            };
          });
        } catch (error) {
          log('ctx.inject(["remote.cotTranslation"]) threw', error);
        }
      };

      const fromInjected = () => {
        if (injected === null) return undefined;
        try {
          const remote = injected.remote;
          if (remote === undefined || remote === null) return undefined;
          const controller = remote.cotTranslation;
          return controller === undefined || controller === null ? undefined : controller;
        } catch (error) {
          return undefined;
        }
      };

      const gateway = () => {
        let remote;
        try {
          remote = typeof ctx.get === 'function' ? ctx.get('remote') : undefined;
        } catch (error) {
          remote = undefined;
        }
        if (remote === undefined || remote === null) {
          try {
            remote = ctx.remote;
          } catch (error) {
            remote = undefined;
          }
        }
        return remote;
      };

      // cordis' ctx.get(name) reads a service straight from the store and
      // bypasses the inject requirement, so a dotted Remote namespace can be
      // probed before any child fiber has declared it.
      const fromStore = () => {
        if (typeof ctx.get !== 'function') return undefined;
        try {
          const direct = ctx.get('remote.cotTranslation');
          return direct === undefined || direct === null ? undefined : direct;
        } catch (error) {
          return undefined;
        }
      };

      const controllerOf = () => {
        const viaStore = fromStore();
        if (viaStore !== undefined) return viaStore;
        const viaInject = fromInjected();
        if (viaInject !== undefined) return viaInject;
        const remote = gateway();
        if (remote === undefined || remote === null) {
          setReason('remote');
          return undefined;
        }
        try {
          const controller = remote.cotTranslation;
          if (controller === undefined || controller === null) {
            setReason('contribution');
            return undefined;
          }
          return controller;
        } catch (error) {
          setReason('contribution', error);
          return undefined;
        }
      };

      const loadLimits = async () => {
        if (limits !== undefined) return limits;
        if (loading !== null) return loading;
        const controller = controllerOf();
        if (controller === undefined) return null;
        loading = (async () => {
          try {
            const result = await controller.limits(new AbortController().signal);
            if (result === undefined || result === null || result.ok !== true) {
              const failure = result === undefined || result === null ? undefined : result.error;
              setReason('limits', failure);
              return null;
            }
            limits = result.value;
            reason = 'ok';
            reported = 'ok|';
            log('translation service ready');
            return limits;
          } catch (error) {
            setReason('error', error);
            return null;
          } finally {
            loading = null;
          }
        })();
        return loading;
      };

      const notify = () => {
        for (const listener of listeners) {
          try {
            listener(mounted);
          } catch (error) {
            /* a broken listener must not stop the probe loop */
          }
        }
      };

      // Reads text through the configured OpenAI-compatible endpoint. The
      // placeholder shield runs before the request, so code/URLs/terms survive.
      //
      // Two transports:
      //  - the Host proxy (`/api/dsh-cot-peek/translate`) for loopback/private
      //    endpoints, which removes the CORS requirement entirely;
      //  - plain browser fetch for anything else (public https gateways that
      //    already allow CORS).
      const PROXY_URL = '/api/dsh-cot-peek/translate';
      let proxyState = null; // null = unknown, true = works, false = absent

      const chatCompletionsUrl = (baseUrl) => {
        const trimmed = baseUrl.replace(/\/+$/, '');
        if (/\/chat\/completions$/.test(trimmed)) return trimmed;
        return trimmed + '/chat/completions';
      };

      const translateViaProxy = async (config, shielded, signal) => {
        const response = await fetch(PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseUrl: config.baseUrl,
            model: config.model,
            apiKey: config.apiKey,
            text: shielded.text,
          }),
          signal,
        });
        if (response.status === 401 || response.status === 404 || response.status === 405) {
          // No Host half in this composition (or it was not reloaded yet): the
          // DSH /api bridge answers "unauthorized" here. Fall back to a direct
          // browser fetch instead of surfacing it as a translation failure.
          proxyState = false;
          return null;
        }
        proxyState = true;
        let payload = null;
        try {
          payload = await response.json();
        } catch (error) {
          payload = null;
        }
        if (payload === null || typeof payload !== 'object') {
          // Something other than our proxy answered (the /api bridge, a proxy
          // in front of DSH, ...). Treat the proxy as absent.
          proxyState = false;
          return null;
        }
        if (payload.skip === true) {
          // The Host proxy exists but will not forward this target (public URL).
          return null;
        }
        if (!response.ok || payload.ok !== true) {
          const message = typeof payload.error === 'string' ? payload.error : 'proxy ' + response.status;
          throw new Error(message);
        }
        if (typeof payload.text !== 'string' || payload.text.trim() === '') {
          throw new Error('endpoint returned an empty translation');
        }
        return payload.text.trim();
      };

      const translateViaOA = async (source, signal) => {
        const config = readOA();
        if (config === null) throw new Error('no translation endpoint configured');
        const shielded = protectText(source);

        if (proxyState !== false) {
          try {
            const viaProxy = await translateViaProxy(config, shielded, signal);
            if (viaProxy !== null) return restoreText(viaProxy, shielded.tokens);
          } catch (error) {
            // An aborted request must stay aborted; everything else falls back
            // to the direct fetch, which is the only path for public gateways.
            if (error instanceof Error && error.name === 'AbortError') throw error;
            if (proxyState !== true) proxyState = false;
            else throw error;
          }
        }

        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey !== '') headers.Authorization = 'Bearer ' + config.apiKey;
        const payload = {
          messages: [
            { role: 'system', content: OA_SYSTEM_PROMPT },
            { role: 'user', content: shielded.text },
          ],
          temperature: 0.2,
          stream: false,
        };
        if (config.model !== '') payload.model = config.model;
        const response = await fetch(chatCompletionsUrl(config.baseUrl), {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal,
        });
        if (!response.ok) {
          let detail = '';
          try {
            detail = await response.text();
          } catch (error) {
            detail = '';
          }
          throw new Error(
            'endpoint ' + response.status + (detail === '' ? '' : ': ' + detail.slice(0, 160)),
          );
        }
        const json = await response.json();
        const choice =
          json !== null && json !== undefined && Array.isArray(json.choices) ? json.choices[0] : undefined;
        const message = choice === undefined || choice === null ? undefined : choice.message;
        const text = message === undefined || message === null ? undefined : message.content;
        if (typeof text !== 'string' || text.trim() === '') {
          throw new Error('endpoint returned an empty translation');
        }
        return restoreText(text.trim(), shielded.tokens);
      };

      const probe = async () => {
        let next;
        if (readOA() !== null) {
          reason = 'ok';
          next = true;
        } else {
          const value = await loadLimits();
          next = value !== undefined && value !== null;
        }
        if (next !== mounted) {
          mounted = next;
          notify();
        }
        return mounted;
      };

      // The translator bundle mounts asynchronously, so keep re-probing in the
      // background instead of settling on "off" after a few short attempts.
      const schedule = (attempt) => {
        if (mounted || timer !== null) return;
        timer = window.setTimeout(() => {
          timer = null;
          probe().then(
            () => schedule(Math.min(attempt + 1, 60)),
            () => schedule(Math.min(attempt + 1, 60)),
          );
        }, attempt < 6 ? 1000 : 5000);
      };

      const activeLocale = () => {
        try {
          const snapshot = ctx.locale.getSnapshot();
          if (snapshot !== undefined && snapshot !== null) {
            if (typeof snapshot.active === 'string' && snapshot.active !== '') return snapshot.active;
            if (typeof snapshot.locale === 'string' && snapshot.locale !== '') return snapshot.locale;
          }
        } catch (error) {
          /* fall through */
        }
        return 'zh-CN';
      };

      return {
        reason: () => reason,
        available: () => mounted,
        mode: () => (readOA() !== null ? 'oa' : mounted ? 'official' : 'none'),
        refresh() {
          probe().then(
            () => undefined,
            () => undefined,
          );
        },
        subscribe(listener) {
          listeners.add(listener);
          try {
            listener(mounted);
          } catch (error) {
            /* ignore */
          }
          return () => listeners.delete(listener);
        },
        start() {
          bindInjected();
          probe().then(
            () => schedule(1),
            () => schedule(1),
          );
        },
        detail: () => detailText,
        async ready() {
          return probe();
        },
        async translate(source, sessionId, signal) {
          const endpoint = readOA();
          if (endpoint !== null) return translateViaOA(source, signal);
          const controller = controllerOf();
          if (controller === undefined) throw new Error('cotTranslation unavailable');
          const value = await loadLimits();
          if (value === undefined || value === null) throw new Error('translation preferences unavailable');
          const preferences = value.preferences;
          const shielded = protectText(source);
          const maxChars = typeof value.maxTextChars === 'number' ? value.maxTextChars : 4000;
          if (shielded.text.length > maxChars) throw new Error('fragment too long');
          const targetLanguage =
            preferences.targetLanguage === 'auto' ? activeLocale() : preferences.targetLanguage;
          const result = await controller.translate(
            {
              text: shielded.text,
              targetLanguage,
              provider: preferences.provider,
              sessionId,
            },
            signal,
          );
          if (result === undefined || result === null || result.ok !== true) {
            const failure = result === undefined || result === null ? undefined : result.error;
            throw failure instanceof Error ? failure : new Error('translation failed');
          }
          return restoreText(String(result.value), shielded.tokens);
        },
      };
    }

    // ------------------------------------------------------------------
    // Floating window (rendered in shell.overlay, pinned to the top).
    // ------------------------------------------------------------------
    const COLLAPSE_KEY = 'dsh-cot-peek:collapsed';
    const RECT_KEY = 'dsh-cot-peek:rect';
    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 140;
    const MAX_WIDTH = 960;
    const MAX_HEIGHT = 800;

    function clamp(value, low, high) {
      return Math.max(low, Math.min(value, high));
    }

    // The Windows desktop shell paints a native window-drag strip across the top
    // of the frame (the caption row). A floating window that overlaps it moves
    // the whole app when grabbed instead of itself, so keep the peek below it.
    // The shell publishes the strip height and clears it again in fullscreen.
    function chromeTopInset() {
      const root = typeof document === 'undefined' ? null : document.documentElement;
      if (root === null || root === undefined || typeof root.hasAttribute !== 'function') return 0;
      if (!root.hasAttribute('data-windows-titlebar')) return 0;
      if (root.hasAttribute('data-fullscreen')) return 0;
      const raw =
        root.style !== undefined && typeof root.style.getPropertyValue === 'function'
          ? Number.parseFloat(root.style.getPropertyValue('--dsh-windows-titlebar-height'))
          : Number.NaN;
      return Number.isFinite(raw) && raw > 0 ? raw : 40;
    }

    /** Smallest top offset that keeps the window clear of the app caption. */
    function minimumTop() {
      return Math.max(8, Math.round(chromeTopInset()) + 8);
    }

    // Horizontal area the window is allowed to occupy: the conversation column
    // when it has been measured, the whole viewport otherwise.
    function horizontalArea(bounds) {
      const viewportWidth = window.innerWidth;
      if (bounds === null || bounds === undefined) {
        return { left: 8, right: viewportWidth - 8 };
      }
      const left = clamp(Math.round(bounds.left) + 8, 8, Math.max(8, viewportWidth - MIN_WIDTH - 8));
      const right = clamp(Math.round(bounds.right) - 8, left + MIN_WIDTH, viewportWidth - 8);
      return { left, right };
    }

    // A sidebar on that side means the conversation column does not touch the
    // window edge; the peek has to dock to the column edge instead so it never
    // covers the sidebar.
    function sidebarOnLeft(bounds) {
      return (
        bounds !== null && bounds !== undefined && Number.isFinite(bounds.left) && Math.round(bounds.left) > 16
      );
    }

    function sidebarOnRight(bounds) {
      return (
        bounds !== null &&
        bounds !== undefined &&
        Number.isFinite(bounds.right) &&
        Math.round(bounds.right) < window.innerWidth - 16
      );
    }

    /** Horizontal position of a docked window: column edge, else screen edge. */
    function dockLeft(side, bounds, width) {
      const area = horizontalArea(bounds);
      if (side === 'left') return sidebarOnLeft(bounds) ? area.left : 0;
      return sidebarOnRight(bounds)
        ? Math.max(area.left, area.right - width)
        : Math.max(0, window.innerWidth - width);
    }

    /** True when the docked edge is the conversation column, not the screen. */
    function dockedToColumn(side, bounds) {
      if (side === 'left') return sidebarOnLeft(bounds);
      if (side === 'right') return sidebarOnRight(bounds);
      return false;
    }

    function normalizeRect(rect, bounds) {
      const viewportHeight = window.innerHeight;
      const area = horizontalArea(bounds);
      const maxWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, area.right - area.left));
      const maxHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, viewportHeight - 80));
      const width = clamp(Number(rect.w) || 680, MIN_WIDTH, maxWidth);
      const height = clamp(Number(rect.h) || 260, MIN_HEIGHT, maxHeight);
      const maxX = Math.max(area.left, area.right - width);
      const x = clamp(Number(rect.x) || area.left, area.left, maxX);
      const top = minimumTop();
      const y = clamp(Number(rect.y) || 92, top, Math.max(top, viewportHeight - height - 8));
      return { x, y, w: width, h: height };
    }

    function defaultRect(bounds) {
      const area = horizontalArea(bounds);
      const width = clamp(Math.min(680, area.right - area.left), MIN_WIDTH, MAX_WIDTH);
      const x = Math.round(area.left + Math.max(0, (area.right - area.left - width) / 2));
      return normalizeRect({ x, y: 92, w: width, h: 260 }, bounds);
    }

    function readRect(bounds) {
      try {
        const raw = window.localStorage.getItem(RECT_KEY);
        if (raw === null) return defaultRect(bounds);
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object') return defaultRect(bounds);
        return normalizeRect(parsed, bounds);
      } catch (error) {
        return defaultRect(bounds);
      }
    }

    function saveRect(rect) {
      try {
        window.localStorage.setItem(RECT_KEY, JSON.stringify(rect));
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    // Opening the in-window ⚙ panel grows a short window so the panel fits;
    // remember the previous height and put it back when the panel closes.
    function settingsPanelHeight(viewportHeight) {
      return Math.min(460, Math.max(360, viewportHeight - 80));
    }

    /**
     * Rect to restore when the ⚙ panel closes. Returns null when nothing should
     * change: the panel never grew the window, or the user resized it while the
     * panel was open. A window the user dragged keeps its new position; one that
     * only moved because growing it near the bottom pushed it up goes back.
     */
    function settingsRestoreRect(current, saved) {
      if (saved === null || saved === undefined || saved.grownTo === null) return null;
      if (current.h !== saved.grownTo) return null;
      const grown = saved.grownRect;
      const unmoved =
        grown !== null && grown !== undefined && current.x === grown.x && current.y === grown.y;
      return {
        x: unmoved ? saved.rect.x : current.x,
        y: unmoved ? saved.rect.y : current.y,
        w: current.w,
        h: saved.rect.h,
      };
    }

    // Inline presentation for the model listbox: a plain <select size> keeps
    // the choices in the page (no native popup to theme) and the explicit
    // colours do not depend on the surrounding CSS rules landing.
    const MODEL_BOX_STYLE = {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      margin: 0,
      padding: '4px',
      border: '1px solid var(--dsw-alias-border-l2, #2c3a5a)',
      borderRadius: '8px',
      background: 'var(--dsw-alias-bg-base, #14161c)',
      color: 'var(--dsw-alias-label-primary, #e8ecf4)',
      fontFamily: 'inherit',
      fontSize: '12px',
      lineHeight: '1.6',
      outline: 'none',
      overflowY: 'auto',
    };

    const MODEL_OPTION_STYLE = {
      background: 'var(--dsw-alias-bg-base, #14161c)',
      color: 'var(--dsw-alias-label-primary, #e8ecf4)',
      fontFamily: 'inherit',
      fontSize: '12px',
    };

    /**
     * Browsable model list used by both settings surfaces. A native <select>
     * popup ignored our theme (light-grey text on a light-grey list) and a
     * hand-drawn button list came out blank on one machine, so the fetched
     * models live in an in-page listbox that renders with explicit colours.
     */
    function modelPickerNode(t, models, current, open, onToggle, onPick) {
      const ids = models.filter((id) => typeof id === 'string' && id !== '');
      if (ids.length === 0) return null;
      return h(
        'div',
        { className: 'dsh-cot-peek__picker' },
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-cot-peek__modelToggle',
            'aria-expanded': open ? 'true' : 'false',
            onClick: onToggle,
          },
          (current !== '' ? current : t('oaModelPick')) + ' · ' + ids.length + ' ▾',
        ),
        open
          ? h(
              'select',
              {
                className: 'dsh-cot-peek__modelBox',
                size: Math.min(10, ids.length),
                value: ids.includes(current) ? current : '',
                style: MODEL_BOX_STYLE,
                'aria-label': t('oaModelPick'),
                onChange: (event) => {
                  if (event.target.value !== '') onPick(event.target.value);
                },
              },
              ids.map((id) =>
                h('option', { key: id, value: id, style: MODEL_OPTION_STYLE }, id),
              ),
            )
          : null,
      );
    }

    /** Slow / normal / fast as three buttons instead of a popping <select>. */
    function rateButtonsNode(t, rate, smooth, onPick) {
      return h(
        'span',
        { className: 'dsh-cot-peek__seg', role: 'group', 'aria-label': t('smoothRate') },
        SMOOTH_RATES.map((value) =>
          h(
            'button',
            {
              key: value,
              type: 'button',
              className: 'dsh-cot-peek__segBtn',
              disabled: !smooth,
              'aria-pressed': rate === value ? 'true' : 'false',
              'data-selected': rate === value ? 'true' : undefined,
              onClick: () => onPick(value),
            },
            t(smoothRateLabel(value)),
          ),
        ),
      );
    }

    function readCollapsed() {
      try {
        return window.localStorage.getItem(COLLAPSE_KEY) === '1';
      } catch (error) {
        return false;
      }
    }

    function writeCollapsed(value) {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    // Auto mode: every AUTO_INTERVAL_MS, translate whatever finished reasoning
    // arrived since the last pass. The tail of an unfinished sentence stays in
    // the source language, so streaming never waits on the network.
    const AUTO_KEY = 'dsh-cot-peek:auto';
    const AUTO_INTERVAL_MS = 2500;
    // Collapse the window this long after a run finishes (a new run cancels it).
    const AUTO_COLLAPSE_MS = 3000;
    // Edge tab: only this sliver of the window stays on screen while docked.
    const ARROW_WIDTH = 26;
    const ARROW_HEIGHT = 64;
    // Gap between the window body and the arrow tab sitting outside it.
    const ARROW_GAP = 6;
    const HIDE_DELAY_MS = 1500;
    const SNAP_DISTANCE = 64;
    const SLIDE_MS = 380;

    function readAuto() {
      try {
        return window.localStorage.getItem(AUTO_KEY) !== '0';
      } catch (error) {
        return true;
      }
    }

    function writeAuto(value) {
      try {
        window.localStorage.setItem(AUTO_KEY, value ? '1' : '0');
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    // Which viewport edge the window docks to; null means free-floating.
    const DOCK_KEY = 'dsh-cot-peek:dock';

    function readDock() {
      try {
        const raw = window.localStorage.getItem(DOCK_KEY);
        return raw === 'left' || raw === 'right' ? raw : null;
      } catch (error) {
        return null;
      }
    }

    function writeDock(value) {
      try {
        if (value === 'left' || value === 'right') window.localStorage.setItem(DOCK_KEY, value);
        else window.localStorage.removeItem(DOCK_KEY);
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    function oneLine(text) {
      const line = String(text).replace(/\s+/g, ' ').trim();
      return line.length > 72 ? line.slice(0, 72) + '…' : line;
    }

    // ------------------------------------------------------------------
    // Smooth reveal: the snapshot arrives in bursts (sometimes thousands of
    // characters in a second), which is unreadable. Reveal the text at a
    // reading pace instead of jumping, and only stick to the bottom when the
    // user has not scrolled up.
    // ------------------------------------------------------------------
    const SMOOTH_KEY = 'dsh-cot-peek:smooth';
    const SMOOTH_RATE_KEY = 'dsh-cot-peek:smoothRate';
    const SMOOTH_RATES = [40, 80, 160];
    // Labels are keyed by position, not by value: the rate list changed from
    // 60/110/160 to 40/80/160 and the old value comparisons left every option
    // reading "Fast", so nobody could pick a slower reveal.
    const SMOOTH_RATE_LABEL_KEYS = ['smoothSlow', 'smoothMid', 'smoothFast'];
    const ACCUMULATE_KEY = 'dsh-cot-peek:accumulate';

    function smoothRateLabel(value) {
      const index = SMOOTH_RATES.indexOf(Number(value));
      return SMOOTH_RATE_LABEL_KEYS[index < 0 ? SMOOTH_RATE_LABEL_KEYS.length - 1 : index];
    }

    function readSmoothEnabled() {
      try {
        const raw = window.localStorage.getItem(SMOOTH_KEY);
        return raw === null ? true : raw !== 'off';
      } catch (error) {
        return true;
      }
    }

    function writeSmoothEnabled(enabled) {
      try {
        window.localStorage.setItem(SMOOTH_KEY, enabled ? 'on' : 'off');
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    function readSmoothRate() {
      try {
        const value = Number(window.localStorage.getItem(SMOOTH_RATE_KEY));
        return SMOOTH_RATES.includes(value) ? value : 40;
      } catch (error) {
        return 40;
      }
    }

    function writeSmoothRate(rate) {
      try {
        window.localStorage.setItem(SMOOTH_RATE_KEY, String(rate));
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    function readAccumulate() {
      try {
        const raw = window.localStorage.getItem(ACCUMULATE_KEY);
        return raw === null ? true : raw !== 'off';
      } catch (error) {
        return true;
      }
    }

    function writeAccumulate(enabled) {
      try {
        window.localStorage.setItem(ACCUMULATE_KEY, enabled ? 'on' : 'off');
      } catch (error) {
        /* storage may be unavailable */
      }
    }

    /** How many characters to show after `elapsed` seconds at `rate` chars/s. */
    function nextRevealCount(shownLength, targetLength, elapsedSeconds, rate) {
      if (!(targetLength > shownLength)) return targetLength;
      const step = Math.max(1, Math.round(rate * Math.max(0, elapsedSeconds)));
      return Math.min(targetLength, shownLength + step);
    }

    // Reading speed should smooth the scroll, not turn into lag: once the
    // stream is this far ahead, reveal faster until it has caught up again.
    const REVEAL_CATCHUP_CHARS = 240;

    /** Chars per second used to reveal the current backlog. */
    function revealSpeed(rate, running, backlog) {
      if (!running) return rate * 5;
      return backlog > REVEAL_CATCHUP_CHARS ? rate * 4 : rate;
    }

    function PeekWindow(props) {
      const { t, service } = props;
      const state = React.useSyncExternalStore(bridge.subscribe, bridge.get);
      const sessionId = state.sessionId;
      const reasoning = state.text;
      const running = state.running === true;
      const bounds = state.bounds === undefined ? null : state.bounds;

      const [collapsed, setCollapsed] = React.useState(readCollapsed);
      const [view, setView] = React.useState('translated');
      const [available, setAvailable] = React.useState(false);
      const [translation, setTranslation] = React.useState({
        output: '',
        tail: '',
        pending: false,
        failed: false,
      });
      const [translatedText, setTranslatedText] = React.useState('');
      const [auto, setAuto] = React.useState(readAuto);
      const [notice, setNotice] = React.useState('');
      const [settingsOpen, setSettingsOpen] = React.useState(false);
      const [modelMenuOpen, setModelMenuOpen] = React.useState(false);
      const [oaDraft, setOaDraft] = React.useState(
        () => readOA() ?? { baseUrl: '', model: '', apiKey: '' },
      );
      const [oaModels, setOaModels] = React.useState([]);
      const [oaProbe, setOaProbe] = React.useState('');
      const [oaBusy, setOaBusy] = React.useState(false);
      const [smooth, setSmooth] = React.useState(readSmoothEnabled);
      const [rate, setRate] = React.useState(readSmoothRate);
      const [accumulate, setAccumulate] = React.useState(readAccumulate);
      const [revealed, setRevealed] = React.useState(0);
      const [atBottom, setAtBottom] = React.useState(true);
      // `desired` keeps what the user actually asked for, so a sidebar closing
      // can widen the window back instead of leaving it permanently shrunk.
      const desired = React.useRef(null);
      if (desired.current === null) desired.current = readRect(null);
      const [rect, setRect] = React.useState(() => normalizeRect(desired.current, null));
      const [docked, setDocked] = React.useState(() => readDock() ?? (readCollapsed() ? 'right' : null));
      const [peek, setPeek] = React.useState(false);
      const [dragging, setDragging] = React.useState(false);
      const [resizing, setResizing] = React.useState(false);
      const engine = React.useRef(null);
      const autoState = React.useRef({ auto: true, available: false, sessionId: null, reasoning: '' });
      const autoDone = React.useRef(0);
      const autoPrev = React.useRef('');
      const body = React.useRef(null);
      const drag = React.useRef(null);
      const resize = React.useRef(null);
      const wasRunning = React.useRef(false);
      const autoCollapsed = React.useRef(false);
      const firstSession = React.useRef(true);
      const boundsRef = React.useRef(bounds);
      boundsRef.current = bounds;
      const rectRef = React.useRef(rect);
      rectRef.current = rect;
      const dockedRef = React.useRef(docked);
      dockedRef.current = docked;
      const collapsedRef = React.useRef(collapsed);
      collapsedRef.current = collapsed;
      const hideTimer = React.useRef(null);
      const hoverRef = React.useRef(false);
      // Rect before the ⚙ panel grew the window; used to put the size back.
      const settingsRestore = React.useRef(null);
      const settingsOpenRef = React.useRef(settingsOpen);
      settingsOpenRef.current = settingsOpen;

      // Keep the interval's view of the world fresh without restarting it on
      // every streamed token.
      autoState.current = { auto, available, sessionId, reasoning };

      function clearHideTimer() {
        if (hideTimer.current !== null) {
          window.clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
      }

      function nearestDock(targetRect) {
        const area = horizontalArea(boundsRef.current);
        if (targetRect.x <= area.left + SNAP_DISTANCE) return 'left';
        if (targetRect.x + targetRect.w >= area.right - SNAP_DISTANCE) return 'right';
        return targetRect.x + targetRect.w / 2 >= (area.left + area.right) / 2 ? 'right' : 'left';
      }

      // Retract into the edge tab (the drawer). `automatic` collapses reopen on
      // the next run; a manual collapse keeps the tab closed.
      function collapseToEdge(automatic) {
        clearHideTimer();
        const side = dockedRef.current === null ? nearestDock(rectRef.current) : dockedRef.current;
        if (dockedRef.current !== side) {
          setDocked(side);
          writeDock(side);
        }
        autoCollapsed.current = automatic === true;
        setPeek(false);
        setCollapsed(true);
        writeCollapsed(true);
      }

      function expandWindow() {
        clearHideTimer();
        autoCollapsed.current = false;
        setPeek(false);
        setCollapsed(false);
        writeCollapsed(false);
      }

      const handleWindowEnter = () => {
        hoverRef.current = true;
        clearHideTimer();
        if (collapsed) setPeek(true);
      };

      const handleWindowLeave = () => {
        hoverRef.current = false;
        if (!collapsed) return;
        clearHideTimer();
        hideTimer.current = window.setTimeout(() => {
          hideTimer.current = null;
          if (collapsedRef.current) setPeek(false);
        }, HIDE_DELAY_MS);
      };

      // Follow the conversation column: clamp the visible rect whenever the
      // measured bounds change (window resize, sidebar opening/closing).
      React.useEffect(() => {
        if (dockedRef.current === null) setRect(normalizeRect(desired.current, bounds));
      }, [bounds]);

      // Collapse three seconds after a run finishes; a new run cancels it and
      // slides the window back in if the collapse was automatic.
      React.useEffect(() => {
        if (running) {
          wasRunning.current = true;
          if (autoCollapsed.current) expandWindow();
          return undefined;
        }
        if (!wasRunning.current) return undefined;
        wasRunning.current = false;
        const id = window.setTimeout(() => {
          // Don't yank the window away while the pointer is still on it, or
          // while the settings panel is open.
          if (!hoverRef.current && !settingsOpenRef.current) collapseToEdge(true);
        }, AUTO_COLLAPSE_MS);
        return () => window.clearTimeout(id);
      }, [running]);

      // The translator bundle mounts asynchronously; the service keeps probing
      // in the background and pushes the moment it becomes usable.
      React.useEffect(() => {
        const unsubscribe = service.subscribe((value) => {
          setAvailable(value);
          if (value) setNotice('');
        });
        service.start();
        return unsubscribe;
      }, [service]);

      // Auto mode: translate only what finished since the previous pass.
      React.useEffect(() => {
        const tick = () => {
          const current = autoState.current;
          if (!current.auto || !current.available || current.sessionId === null) return;
          const text = current.reasoning;
          if (text === autoPrev.current) return;
          if (!text.startsWith(autoPrev.current)) {
            // New turn / different stream: a length-based watermark would sit
            // above the new text and silently skip it. Start a fresh engine.
            if (engine.current !== null) {
              engine.current.dispose();
              engine.current = null;
            }
            autoDone.current = 0;
          }
          autoPrev.current = text;
          if (text.length <= autoDone.current) return;
          autoDone.current = text.length;
          if (engine.current === null) {
            engine.current = new PeekTranslation(
              (source, signal) => service.translate(source, current.sessionId, signal),
              setTranslation,
            );
          }
          engine.current.update(text);
        };
        const id = window.setInterval(tick, AUTO_INTERVAL_MS);
        return () => window.clearInterval(id);
      }, [service]);

      React.useEffect(() => {
        setTranslation({ output: '', tail: '', pending: false, failed: false });
        setTranslatedText('');
        // Never machine-translate the history that loads with a conversation:
        // only text that arrives from now on counts as new.
        autoDone.current = typeof reasoning === 'string' ? reasoning.length : 0;
        autoPrev.current = typeof reasoning === 'string' ? reasoning : '';
        if (firstSession.current) {
          firstSession.current = false;
          return;
        }
        // Switching conversations retracts the drawer; a new run slides it back.
        if (running) return;
        collapseToEdge(true);
      }, [sessionId]);

      React.useEffect(
        () => () => {
          if (engine.current !== null) {
            engine.current.dispose();
            engine.current = null;
          }
        },
        [available, sessionId],
      );

      const handleBodyScroll = () => {
        const element = body.current;
        if (element === null) return;
        const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
        setAtBottom(distance < 48);
      };

      const jumpToBottom = () => {
        const element = body.current;
        if (element === null) return;
        element.scrollTop = element.scrollHeight;
        setAtBottom(true);
      };

      React.useEffect(() => {
        const handle = () => {
          if (dockedRef.current === null) {
            setRect(normalizeRect(desired.current, boundsRef.current));
            return;
          }
          setRect((previous) => {
            const top = minimumTop();
            return {
              ...previous,
              y: clamp(previous.y, top, Math.max(top, window.innerHeight - 48)),
            };
          });
        };
        window.addEventListener('resize', handle);
        return () => window.removeEventListener('resize', handle);
      }, []);

      // Drag with edge snapping: release near a viewport edge docks the window
      // there; release in the middle makes it free-floating again.
      const beginDrag = (event) => {
        if (event.button !== 0) return;
        const target = event.target;
        if (target !== null && typeof target.closest === 'function' && target.closest('button') !== null) return;
        clearHideTimer();
        const side = dockedRef.current;
        const current = rectRef.current;
        const startX =
          side === null ? current.x : dockLeft(side, boundsRef.current, current.w);
        desired.current = { ...desired.current, x: startX, y: current.y, w: current.w, h: current.h };
        if (side !== null) {
          setDocked(null);
          writeDock(null);
        }
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          baseX: startX,
          baseY: current.y,
          width: current.w,
        };
        setDragging(true);
        if (typeof event.currentTarget.setPointerCapture === 'function') {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      };

      const moveDrag = (event) => {
        const session = drag.current;
        if (session === null || session.pointerId !== event.pointerId) return;
        const width = session.width;
        const top = minimumTop();
        // Stay inside the conversation column: dragging over the sidebar would
        // cover it (the old clamp used the whole viewport).
        const area = horizontalArea(boundsRef.current);
        const x = clamp(
          session.baseX + event.clientX - session.startX,
          area.left,
          Math.max(area.left, area.right - width),
        );
        const y = clamp(
          session.baseY + event.clientY - session.startY,
          top,
          Math.max(top, window.innerHeight - 48),
        );
        desired.current = { ...desired.current, x, y };
        setRect({ x, y, w: width, h: desired.current.h });
      };

      const endDrag = (event) => {
        if (drag.current === null) return;
        drag.current = null;
        setDragging(false);
        if (typeof event.currentTarget.releasePointerCapture === 'function') {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        const current = desired.current;
        const bounds = boundsRef.current;
        const area = horizontalArea(bounds);
        let side = null;
        if (current.x <= area.left + SNAP_DISTANCE) side = 'left';
        else if (current.x + current.w >= area.right - SNAP_DISTANCE) side = 'right';
        setDocked(side);
        writeDock(side);
        if (side === null) {
          setRect(normalizeRect(desired.current, bounds));
        } else {
          const top = minimumTop();
          setRect({
            x: dockLeft(side, bounds, current.w),
            y: clamp(current.y, top, Math.max(top, window.innerHeight - 48)),
            w: current.w,
            h: current.h,
          });
        }
        saveRect(desired.current);
      };

      const beginResize = (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        clearHideTimer();
        resize.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          baseW: rectRef.current.w,
          baseH: rectRef.current.h,
        };
        desired.current = { ...desired.current, w: rectRef.current.w, h: rectRef.current.h };
        setResizing(true);
        if (typeof event.currentTarget.setPointerCapture === 'function') {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      };

      const moveResize = (event) => {
        const session = resize.current;
        if (session === null || session.pointerId !== event.pointerId) return;
        const maxWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, window.innerWidth - 16));
        const maxHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, window.innerHeight - 80));
        const w = clamp(session.baseW + event.clientX - session.startX, MIN_WIDTH, maxWidth);
        const h = clamp(session.baseH + event.clientY - session.startY, MIN_HEIGHT, maxHeight);
        desired.current = { ...desired.current, w, h };
        setRect((previous) => ({ ...previous, w, h }));
      };

      const endResize = (event) => {
        if (resize.current === null) return;
        resize.current = null;
        setResizing(false);
        if (typeof event.currentTarget.releasePointerCapture === 'function') {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        saveRect(desired.current);
      };

      const original = typeof reasoning === 'string' ? reasoning : '';
      const hasTranslation = translation.output !== '' || translation.tail !== '';
      const showTranslated = hasTranslation && view === 'translated';
      const shown = showTranslated ? translation.output + translation.tail : original;
      // Pace both views: the translation arrives in 2.5s chunks, and dropping a
      // whole paragraph in at once is what readers report as "too fast to
      // follow". Revealing at the configured reading speed keeps the scroll
      // smooth; the 0.4.9 stall fix is what made translation feel slow, not
      // pacing.
      const visibleCount = smooth ? Math.min(revealed, shown.length) : shown.length;
      const displayed = shown.slice(0, Math.max(0, visibleCount));

      React.useEffect(() => {
        if (!smooth) {
          setRevealed(shown.length);
          return undefined;
        }
        let raf = null;
        let last = 0;
        const tick = (now) => {
          raf = null;
          const delta = last === 0 ? 1 / 60 : Math.min(0.25, (now - last) / 1000);
          last = now;
          let reached = true;
          setRevealed((current) => {
            const target = shown.length;
            if (!(target > current)) {
              reached = true;
              return target;
            }
            reached = false;
            const speed = revealSpeed(rate, running, target - current);
            return nextRevealCount(current, target, delta, speed);
          });
          if (!reached) raf = window.requestAnimationFrame(tick);
        };
        raf = window.requestAnimationFrame(tick);
        return () => {
          if (raf !== null) window.cancelAnimationFrame(raf);
        };
      }, [smooth, shown, running, rate]);

      // Wheel scrolling always wins: only follow the stream while the view is
      // already at the bottom, so reading older text never gets yanked down.
      React.useLayoutEffect(() => {
        const element = body.current;
        if (element === null) return;
        if (!atBottom) return;
        element.scrollTop = element.scrollHeight;
      }, [displayed, collapsed, view, atBottom]);

      if (sessionId === null) return null;
      const content =
        displayed.trim() === ''
          ? translatedText !== '' && translation.pending
            ? t('translating')
            : t('idle')
          : displayed;
      const summarySource = showTranslated
        ? translation.output !== ''
          ? translation.output
          : translation.tail
        : original;
      const summary = oneLine(summarySource);

      // In manual mode, streaming keeps growing after a translate, so tell the
      // user the translation is one step behind. Auto mode catches up by itself.
      const stale = !auto && translatedText !== '' && original.length > translatedText.length;

      const describeReason = () => {
        const code = typeof service.reason === 'function' ? service.reason() : 'remote';
        const key = 'off_' + String(code === undefined || code === null ? 'remote' : code);
        let text = '';
        try {
          text = t(key);
        } catch (error) {
          text = '';
        }
        const label =
          typeof text === 'string' && text !== '' && text !== key ? text : t('translationOff');
        const detail = typeof service.detail === 'function' ? service.detail() : '';
        return detail === '' ? label : label + ' · ' + detail;
      };

      let flag = '';
      let flagError = false;
      let flagTitle = '';
      if (!available) {
        // Tell people what to do instead of just "translation off": this is the
        // single most common support question.
        const hint = describeReason();
        flag = notice !== '' ? notice : t('translationOff') + ' · ' + t('hintInstall');
        flagError = notice !== '';
        flagTitle = hint;
      } else if (translation.failed) {
        flag = t('translationFailed');
        flagError = true;
      } else if (translation.pending) flag = t('translating');
      else if (stale) flag = t('retranslate');

      const translateNow = async () => {
        if (translation.pending) return;
        const text = original;
        if (text.trim() === '') return;
        let usable = available;
        if (!usable) usable = await service.ready();
        if (!usable) {
          const why = describeReason();
          try {
            console.warn('[dsh-cot-peek] translate pressed, service unavailable:', why);
          } catch (error) {
            /* ignore */
          }
          setNotice(why);
          return;
        }
        setNotice('');
        if (engine.current === null) {
          engine.current = new PeekTranslation(
            (source, signal) => service.translate(source, sessionId, signal),
            setTranslation,
          );
        }
        setTranslatedText(text);
        autoDone.current = text.length;
        setView('translated');
        engine.current.translateAll(text);
      };

      const toggleAuto = () => {
        const next = !auto;
        setAuto(next);
        writeAuto(next);
        // Switching back on lets the next tick pick up everything new.
        if (next) autoDone.current = 0;
      };

      const translateLabel = translation.pending
        ? t('translating')
        : stale
          ? t('retranslate')
          : t('translate');
      const translateTitle = available ? t('translateHint') : describeReason();

      const toggleCollapsed = () => {
        if (collapsed && peek !== true) expandWindow();
        else collapseToEdge(false);
      };

      // The panel needs ~420px; a window the user shrank would otherwise render
      // the lower controls outside its background. Remember the old height so
      // closing the panel puts the window back how it was.
      const closeSettings = () => {
        setSettingsOpen(false);
        const saved = settingsRestore.current;
        settingsRestore.current = null;
        const target = settingsRestoreRect(rectRef.current, saved);
        if (target === null) return;
        const next = normalizeRect(target, boundsRef.current);
        desired.current = { ...desired.current, ...next };
        setRect(next);
        saveRect(desired.current);
      };

      const openSettings = () => {
        if (settingsOpen) {
          closeSettings();
          return;
        }
        setOaDraft(readOA() ?? { baseUrl: '', model: '', apiKey: '' });
        const current = rectRef.current;
        const needed = settingsPanelHeight(window.innerHeight);
        settingsRestore.current = { rect: { ...current }, grownTo: null, grownRect: null };
        if (current.h < needed) {
          const grown = normalizeRect({ ...desired.current, h: needed }, boundsRef.current);
          settingsRestore.current.grownTo = grown.h;
          settingsRestore.current.grownRect = grown;
          desired.current = { ...desired.current, ...grown };
          setRect(grown);
          saveRect(desired.current);
        }
        setSettingsOpen(true);
      };

      const saveEndpoint = () => {
        const baseUrl = oaDraft.baseUrl.trim();
        if (baseUrl === '') writeOA(null);
        else writeOA({ baseUrl, model: oaDraft.model.trim(), apiKey: oaDraft.apiKey.trim() });
        closeSettings();
        service.refresh();
      };

      const clearEndpoint = () => {
        writeOA(null);
        setOaDraft({ baseUrl: '', model: '', apiKey: '' });
        closeSettings();
        service.refresh();
      };

      const hostRequest = async (path, payload) => {
        const response = await fetch('/api/dsh-cot-peek' + path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        let data = null;
        try {
          data = await response.json();
        } catch (error) {
          data = null;
        }
        if (data === null || typeof data !== 'object') throw new Error(t('hostMissing'));
        if (!response.ok || data.ok !== true) {
          throw new Error(typeof data.error === 'string' ? data.error : 'HTTP ' + response.status);
        }
        return data;
      };

      const fetchWindowModels = async () => {
        setOaBusy(true);
        setOaProbe('');
        try {
          const data = await hostRequest('/models', {
            baseUrl: oaDraft.baseUrl.trim(),
            apiKey: oaDraft.apiKey.trim(),
          });
          const ids = Array.isArray(data.models) ? data.models : [];
          setOaModels(ids);
          let next = oaDraft;
          if (ids.length > 0 && oaDraft.model.trim() === '') {
            next = { ...oaDraft, model: ids[0] };
            setOaDraft(next);
          }
          if (next.baseUrl.trim() !== '') {
            writeOA({ baseUrl: next.baseUrl.trim(), model: next.model.trim(), apiKey: next.apiKey.trim() });
            service.refresh();
          }
          setOaProbe(ids.length === 0 ? t('modelsEmpty') : t('modelsSaved') + ids.length);
        } catch (error) {
          const message = String(error.message ?? error);
          const needsModel = message.includes('model must be a string') || message.includes('model is required');
          setOaProbe(needsModel ? t('needModel') : t('probeFailed') + message);
        } finally {
          setOaBusy(false);
        }
      };

      // Pick from the fetched list. The old candidate input filtered by whatever is
      // already typed, so a saved model id left people with a one-row dropdown;
      // this select always shows every fetched model.
      const pickWindowModel = (model) => {
        const next = { ...oaDraft, model };
        setOaDraft(next);
        const baseUrl = next.baseUrl.trim();
        if (baseUrl !== '') {
          writeOA({ baseUrl, model: next.model.trim(), apiKey: next.apiKey.trim() });
          service.refresh();
        }
      };

      const testWindowConnection = async () => {
        setOaBusy(true);
        setOaProbe('');
        try {
          const data = await hostRequest('/translate', {
            baseUrl: oaDraft.baseUrl.trim(),
            model: oaDraft.model.trim(),
            apiKey: oaDraft.apiKey.trim(),
            text: 'Hello',
          });
          const sample = typeof data.text === 'string' ? data.text.slice(0, 40) : '';
          setOaProbe(t('probeOk') + sample);
        } catch (error) {
          const message = String(error.message ?? error);
          const needsModel = message.includes('model must be a string') || message.includes('model is required');
          setOaProbe(needsModel ? t('needModel') : t('probeFailed') + message);
        } finally {
          setOaBusy(false);
        }
      };

      // When the docked edge is the conversation column (a sidebar owns that
      // screen edge) the body is hidden in place instead of sliding out: sliding
      // it left/right would drag it across the sidebar.
      const columnEdge = dockedToColumn(docked, bounds);
      const windowStyle = (() => {
        const hidden = collapsed && peek !== true;
        // The arrow tab lives OUTSIDE the window, so hiding pushes the whole
        // body past the viewport edge and leaves exactly the tab on screen.
        const park = rect.w + ARROW_GAP;
        let left = rect.x;
        let offset = 0;
        if (docked !== null) {
          left = dockLeft(docked, bounds, rect.w);
          if (hidden && !columnEdge) offset = docked === 'left' ? -park : park;
        }
        return {
          left: left + 'px',
          top: rect.y + 'px',
          width: rect.w + 'px',
          height: rect.h + 'px',
          transform: 'translateX(' + offset + 'px)',
          transition:
            dragging || resizing ? 'none' : 'transform ' + SLIDE_MS + 'ms cubic-bezier(.4,.0,.2,1)',
        };
      })();

      const arrowStyle =
        docked === 'left'
          ? { left: (columnEdge ? 4 : rect.w + ARROW_GAP) + 'px' }
          : docked === 'right'
            ? { left: (columnEdge ? rect.w - ARROW_WIDTH - 4 : -(ARROW_WIDTH + ARROW_GAP)) + 'px' }
            : undefined;

      const edgeArrow =
        docked === null || !collapsed || (columnEdge && peek === true)
          ? null
          : h(
              'button',
              {
                type: 'button',
                className: 'dsh-cot-peek__edge',
                'data-side': docked,
                style: arrowStyle,
                'aria-label': t('expand'),
                title: summary !== '' ? summary : t('expand'),
                onClick: (event) => {
                  event.stopPropagation();
                  clearHideTimer();
                  setPeek(true);
                },
              },
              h(
                'span',
                { className: 'dsh-cot-peek__edgeGlyph', 'aria-hidden': 'true' },
                docked === 'left' ? '›' : '‹',
              ),
            );

      const autoButton = available
        ? h(
            'button',
            {
              type: 'button',
              className: 'dsh-cot-peek__toggle',
              'data-active': auto ? 'true' : undefined,
              'aria-pressed': auto ? 'true' : 'false',
              title: auto ? t('autoOn') : t('autoOff'),
              onClick: toggleAuto,
            },
            t('auto'),
          )
        : null;
      const translateButton =
        original.trim() !== ''
          ? h(
              'button',
              {
                type: 'button',
                className: 'dsh-cot-peek__toggle',
                'data-primary': 'true',
                disabled: translation.pending,
                title: translateTitle,
                onClick: translateNow,
              },
              translateLabel,
            )
          : null;
      const viewButton = hasTranslation
        ? h(
            'button',
            {
              type: 'button',
              className: 'dsh-cot-peek__toggle',
              title: view === 'translated' ? t('showOriginal') : t('showTranslated'),
              onClick: () => setView(view === 'translated' ? 'original' : 'translated'),
            },
            view === 'translated' ? t('original') : t('translated'),
          )
        : null;
      const flagNode =
        flag !== ''
          ? h(
              'span',
              {
                className: 'dsh-cot-peek__flag',
                'data-error': flagError ? 'true' : undefined,
                title: flagTitle !== '' ? flagTitle : undefined,
              },
              flag,
            )
          : null;
      const visuallyCollapsed = collapsed && peek !== true;
      const collapseButton = h(
        'button',
        {
          type: 'button',
          className: 'dsh-cot-peek__toggle',
          'aria-expanded': visuallyCollapsed ? 'false' : 'true',
          onClick: toggleCollapsed,
        },
        visuallyCollapsed ? t('expand') : t('collapse'),
      );
      const oaActive = service.mode() === 'oa';
      const oaBadge = oaActive
        ? h('span', { className: 'dsh-cot-peek__badge', title: t('settings') }, t('oaBadge'))
        : null;
      const settingsButton = h(
        'button',
        {
          type: 'button',
          className: 'dsh-cot-peek__toggle',
          'aria-pressed': settingsOpen ? 'true' : 'false',
          title: t('settingsOpen'),
          onClick: openSettings,
        },
        '⚙',
      );
      const settingsPanel = settingsOpen
        ? h(
            'div',
            { className: 'dsh-cot-peek__settings' },
            h('div', { className: 'dsh-cot-peek__settings-title' }, t('settings')),
            h('input', {
              className: 'dsh-cot-peek__input',
              type: 'text',
              spellCheck: false,
              placeholder: t('oaUrl'),
              value: oaDraft.baseUrl,
              onChange: (event) => setOaDraft({ ...oaDraft, baseUrl: event.target.value }),
            }),
            h(
              'div',
              { className: 'dsh-cot-peek__settings-row' },
              h('input', {
                className: 'dsh-cot-peek__input',
                type: 'text',
                spellCheck: false,
                placeholder: t('oaModel'),
                value: oaDraft.model,
                onChange: (event) => setOaDraft({ ...oaDraft, model: event.target.value }),
              }),
              h('input', {
                className: 'dsh-cot-peek__input',
                type: 'password',
                spellCheck: false,
                placeholder: t('oaKey'),
                value: oaDraft.apiKey,
                onChange: (event) => setOaDraft({ ...oaDraft, apiKey: event.target.value }),
              }),
            ),
            oaModels.length > 0
              ? modelPickerNode(
                  t,
                  oaModels,
                  oaDraft.model,
                  modelMenuOpen,
                  () => setModelMenuOpen(!modelMenuOpen),
                  (id) => {
                    pickWindowModel(id);
                    setModelMenuOpen(false);
                  },
                )
              : null,
            h(
              'div',
              { className: 'dsh-cot-peek__settings-row' },
              h(
                'button',
                { type: 'button', className: 'dsh-cot-peek__toggle', disabled: oaBusy, onClick: fetchWindowModels },
                t('fetchModels'),
              ),
              h(
                'button',
                { type: 'button', className: 'dsh-cot-peek__toggle', disabled: oaBusy, onClick: testWindowConnection },
                t('testConnection'),
              ),
            ),
            oaProbe !== '' ? h('div', { className: 'dsh-cot-peek__settings-note' }, oaProbe) : null,
            h(
              'div',
              { className: 'dsh-cot-peek__settings-row' },
              h(
                'label',
                { className: 'dsh-cot-peek__checkLabel' },
                h('input', {
                  type: 'checkbox',
                  checked: smooth,
                  onChange: (event) => {
                    const next = event.target.checked;
                    setSmooth(next);
                    writeSmoothEnabled(next);
                  },
                }),
                h('span', { className: 'dsh-cot-peek__settings-note' }, t('smooth')),
              ),
              rateButtonsNode(t, rate, smooth, (value) => {
                setRate(value);
                writeSmoothRate(value);
              }),
            ),
            h(
              'label',
              { className: 'dsh-cot-peek__settings-row' },
              h('input', {
                type: 'checkbox',
                checked: accumulate,
                onChange: (event) => {
                  const next = event.target.checked;
                  setAccumulate(next);
                  writeAccumulate(next);
                },
              }),
              h('span', { className: 'dsh-cot-peek__settings-note' }, t('accumulate')),
            ),
            h('div', { className: 'dsh-cot-peek__settings-note' }, t('oaNote')),
            h(
              'div',
              { className: 'dsh-cot-peek__settings-actions' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-cot-peek__toggle',
                  'data-primary': 'true',
                  onClick: saveEndpoint,
                },
                t('oaSave'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-cot-peek__toggle',
                  onClick: clearEndpoint,
                },
                t('oaClear'),
              ),
            ),
          )
        : null;
      const dragHandlers = {
        onPointerDown: beginDrag,
        onPointerMove: moveDrag,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
      };
      const resizeHandlers = {
        onPointerDown: beginResize,
        onPointerMove: moveResize,
        onPointerUp: endResize,
        onPointerCancel: endResize,
      };

      // The window always renders the same tree; while docked and closed it is
      // translated off-screen so only the breathing edge arrow stays visible.
      return h(
        'section',
        {
          className: 'dsh-cot-peek',
          style: windowStyle,
          'data-collapsed': collapsed ? 'true' : undefined,
          'data-hidden': collapsed && peek !== true ? 'true' : undefined,
          'data-column': columnEdge ? 'true' : undefined,
          'data-docked': docked === null ? undefined : docked,
          'data-running': running ? 'true' : undefined,
          role: 'region',
          'aria-label': t('title'),
          onMouseEnter: handleWindowEnter,
          onMouseLeave: handleWindowLeave,
        },
        h(
          'header',
          { className: 'dsh-cot-peek__head', ...dragHandlers },
          h('span', { className: 'dsh-cot-peek__glyph', 'aria-hidden': 'true' }, '✳'),
          h('span', { className: 'dsh-cot-peek__title' }, t('title')),
          running ? h('span', { className: 'dsh-cot-peek__pulse', 'aria-hidden': 'true' }) : null,
          running ? h('span', { className: 'dsh-cot-peek__state' }, t('thinking')) : null,
          flagNode,
          oaBadge,
          h('span', { className: 'dsh-cot-peek__spacer' }),
          autoButton,
          translateButton,
          viewButton,
          settingsButton,
          collapseButton,
        ),
        h(
          'div',
          {
            className: 'dsh-cot-peek__body',
            ref: body,
            onScroll: handleBodyScroll,
            'data-view': showTranslated ? 'translated' : 'original',
            role: 'log',
            'aria-live': running ? 'polite' : 'off',
          },
          content,
        ),
        !atBottom && !collapsed
          ? h(
              'button',
              {
                type: 'button',
                className: 'dsh-cot-peek__toBottom',
                title: t('scrollBottom'),
                'aria-label': t('scrollBottom'),
                onClick: jumpToBottom,
              },
              '↓',
            )
          : null,
        h('div', { className: 'dsh-cot-peek__resize', 'aria-hidden': 'true', ...resizeHandlers }),
        settingsPanel,
        edgeArrow,
      );
    }

    // ------------------------------------------------------------------
    // Styles: theme tokens only, local classes only. The window floats above
    // the conversation (fixed, top-centered) and opts back into pointer
    // events because shell.overlay itself is click-through.
    // ------------------------------------------------------------------
    const CSS = [
      '.dsh-cot-peek{position:fixed;z-index:900;box-sizing:border-box;display:flex;flex-direction:column;min-width:320px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-elevation-prominent,0 12px 36px rgba(0,0,0,.28));backdrop-filter:blur(12px);color:var(--dsw-alias-label-primary);overflow:visible;pointer-events:auto;font-size:13px;line-height:1.55;-webkit-app-region:no-drag}',
      '.dsh-cot-peek[data-collapsed="true"]{min-width:0}',
      '.dsh-cot-peek[data-column="true"][data-hidden="true"]{visibility:hidden}',
      '.dsh-cot-peek[data-column="true"][data-hidden="true"] .dsh-cot-peek__edge{visibility:visible}',
      '.dsh-cot-peek[data-running="true"]{border-color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__head{display:flex;align-items:center;gap:8px;min-height:34px;padding:5px 10px;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none}',
      '.dsh-cot-peek__head:active{cursor:grabbing}',
      '.dsh-cot-peek__edge{position:absolute;top:50%;transform:translateY(-50%);width:26px;height:64px;display:flex;align-items:center;justify-content:center;border:.5px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-brand-primary);font-size:16px;line-height:1;cursor:pointer;padding:0;box-shadow:0 2px 10px rgba(0,0,0,.25);animation:dsh-cot-peek-breathe 2.6s ease-in-out infinite;pointer-events:auto;backdrop-filter:blur(8px);-webkit-app-region:no-drag}',
      '.dsh-cot-peek__edge:hover,.dsh-cot-peek__edge:focus-visible{color:var(--dsw-alias-brand-primary);animation-play-state:paused;opacity:1}',
      '.dsh-cot-peek__edge:focus-visible{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '@keyframes dsh-cot-peek-breathe{0%,100%{opacity:.45}50%{opacity:1}}',
      '.dsh-cot-peek__glyph{flex:none;color:var(--dsw-alias-brand-primary);font-size:12px;line-height:1}',
      '.dsh-cot-peek__title{flex:none;font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary);letter-spacing:.02em}',
      '.dsh-cot-peek__pulse{flex:none;width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-brand-primary);animation:dsh-cot-peek-pulse 1.2s ease-in-out infinite}',
      '.dsh-cot-peek__state{flex:none;font-size:11px;color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__summary{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dsh-cot-peek__flag{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary);opacity:.85}',
      '.dsh-cot-peek__flag[data-error="true"]{color:var(--dsw-alias-state-error-primary)}',
      '.dsh-cot-peek__spacer{flex:1}',
      '.dsh-cot-peek__toggle{flex:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:18px;cursor:pointer;padding:2px 6px;border-radius:6px}',
      '.dsh-cot-peek__toggle:hover,.dsh-cot-peek__toggle:focus-visible{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}',
      '.dsh-cot-peek__toggle:focus-visible{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-cot-peek__toggle[data-primary="true"]{color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__toggle[data-active="true"]{color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}',
      '.dsh-cot-peek__toggle[disabled]{opacity:.55;cursor:default}',
      '.dsh-cot-peek__badge{flex:none;font-size:10px;line-height:16px;padding:0 6px;border-radius:8px;color:var(--dsw-alias-brand-primary);border:.5px solid var(--dsw-alias-brand-primary);opacity:.85}',
      '.dsh-cot-peek__settings{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border-radius:inherit;background:var(--dsw-alias-bg-overlay);backdrop-filter:blur(14px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain}',
      '.dsh-cot-peek__settings::-webkit-scrollbar{width:6px}',
      '.dsh-cot-peek__settings::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2);border-radius:3px}',
      '.dsh-cot-peek__settings-actions{position:sticky;bottom:-14px;margin-top:auto;padding:8px 0 0;background:var(--dsw-alias-bg-overlay);}',
      '.dsh-cot-peek__settings-title{font-size:12px;color:var(--dsw-alias-label-secondary);letter-spacing:.04em}',
      '.dsh-cot-peek__settings-row{display:flex;gap:8px}',
      '.dsh-cot-peek__input{flex:1;min-width:0;box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;padding:6px 8px;outline:none}',
      '.dsh-cot-peek__input:focus{border-color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__settings-note{font-size:10.5px;line-height:1.5;color:var(--dsw-alias-label-secondary);opacity:.95}',
      '.dsh-cot-peek__checkLabel{display:flex;align-items:center;gap:8px;cursor:pointer}',
      '.dsh-cot-peek__picker{display:flex;flex-direction:column;gap:6px}',
      '.dsh-cot-peek__modelToggle{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;padding:6px 8px;text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-cot-peek__modelToggle:hover,.dsh-cot-peek__modelToggle:focus-visible{border-color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__modelToggle:focus-visible{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.dsh-cot-peek__modelBox{display:block;width:100%;max-height:238px}',
      '.dsh-cot-peek__seg{display:flex;gap:2px;margin-left:auto}',
      '.dsh-cot-peek__segBtn{border:.5px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:18px;padding:2px 10px;border-radius:6px;cursor:pointer}',
      '.dsh-cot-peek__segBtn:hover,.dsh-cot-peek__segBtn:focus-visible{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}',
      '.dsh-cot-peek__segBtn[data-selected="true"]{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__segBtn[disabled]{opacity:.55;cursor:default}',
      '.dsh-cot-peek-settings__row{display:flex;align-items:center;gap:8px}',
      '.dsh-cot-peek__settings-actions{display:flex;gap:8px;margin-top:auto;justify-content:flex-end}',
      '.dsh-cot-peek__body{flex:1;min-height:0;overflow-y:auto;padding:0 12px 12px;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.6}',
      '.dsh-cot-peek__body[data-view="original"]{opacity:.82}',
      '.dsh-cot-peek__resize{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;touch-action:none}',
      '.dsh-cot-peek__toBottom{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:4;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:.5px solid var(--dsw-alias-border-l2);border-radius:50%;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-brand-primary);font-size:14px;line-height:1;cursor:pointer;padding:0;box-shadow:0 2px 10px rgba(0,0,0,.28);backdrop-filter:blur(8px)}',
      '.dsh-cot-peek__toBottom:hover,.dsh-cot-peek__toBottom:focus-visible{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.16));outline:none}',
      '.dsh-cot-peek__resize::after{content:"";position:absolute;right:3px;bottom:3px;width:7px;height:7px;border-right:2px solid var(--dsw-alias-label-secondary);border-bottom:2px solid var(--dsw-alias-label-secondary);opacity:.45;border-bottom-right-radius:2px}',
      '@keyframes dsh-cot-peek-pulse{0%,100%{opacity:1}50%{opacity:.25}}',
      '@media (prefers-reduced-motion:reduce){.dsh-cot-peek__pulse{animation:none}}',
      '@media (prefers-reduced-motion:reduce){.dsh-cot-peek__edge{animation:none;opacity:1}}',
      '.dsh-cot-peek-settings{display:flex;flex-direction:column;gap:10px;padding:4px 2px;font-size:13px;line-height:1.55}',
      '.dsh-cot-peek-settings__title{font-size:14px;font-weight:600}',
      '.dsh-cot-peek-settings__desc{font-size:12px;opacity:.85}',
      '.dsh-cot-peek-settings__engines{display:flex;flex-direction:column;gap:6px;margin-top:2px}',
      '.dsh-cot-peek-settings__radio{display:flex;align-items:center;gap:8px;cursor:pointer}',
      '.dsh-cot-peek-settings__fields{display:flex;flex-direction:column;gap:8px}',
      '.dsh-cot-peek-settings__field{display:flex;flex-direction:column;gap:4px}',
      '.dsh-cot-peek-settings__label{font-size:12px;opacity:.85}',
      '.dsh-cot-peek-settings__note{font-size:11px;line-height:1.5;opacity:.8}',
      '.dsh-cot-peek-settings__actions{display:flex;align-items:center;gap:8px;margin-top:4px}',
      '.dsh-cot-peek-settings__button{border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-brand-primary);color:#fff;border-radius:8px;font:inherit;font-size:12px;padding:5px 12px;cursor:pointer}',
      '.dsh-cot-peek-settings__button--ghost{background:transparent;color:var(--dsw-alias-label-primary)}',
      '.dsh-cot-peek-settings__status{font-size:11px;opacity:.85}',
      '.dsh-cot-peek-settings__probe{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.dsh-cot-peek-settings__button[disabled]{opacity:.55;cursor:default}',
    ].join('');

    // ------------------------------------------------------------------
    // Client plugin: a hidden data seat inside the composer dock plus the
    // pinned window in the frame-wide overlay layer.
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------
    // Settings page: registered into the plugin settings slot
    // (plugins.bundle.config) so the engine choice lives in DSH's settings UI.
    // ------------------------------------------------------------------
    function SettingsPage(props) {
      const { t, service } = props;
      const existing = readOA();
      const [engine, setEngine] = React.useState(existing === null ? 'official' : 'custom');
      const [draft, setDraft] = React.useState(existing ?? { baseUrl: '', model: '', apiKey: '' });
      const [status, setStatus] = React.useState('');
      const [models, setModels] = React.useState([]);
      const [probe, setProbe] = React.useState('');
      const [smooth, setSmooth] = React.useState(readSmoothEnabled);
      const [rate, setRate] = React.useState(readSmoothRate);
      const [accumulate, setAccumulate] = React.useState(readAccumulate);
      const [busy, setBusy] = React.useState(false);
      const [modelMenuOpen, setModelMenuOpen] = React.useState(false);

      const refresh = () => {
        if (service !== undefined && service !== null && typeof service.refresh === 'function') {
          service.refresh();
        }
      };

      const save = () => {
        if (engine === 'custom') {
          const baseUrl = draft.baseUrl.trim();
          if (baseUrl === '') {
            setStatus(t('oaNeedUrl'));
            return;
          }
          writeOA({ baseUrl, model: draft.model.trim(), apiKey: draft.apiKey.trim() });
        } else {
          writeOA(null);
        }
        setStatus(t('oaSaved'));
        refresh();
      };

      const useOfficial = () => {
        writeOA(null);
        setEngine('official');
        setDraft({ baseUrl: '', model: '', apiKey: '' });
        setStatus(t('oaSaved'));
        refresh();
      };

      const hostCall = async (path, payload) => {
        const response = await fetch('/api/dsh-cot-peek' + path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        let data = null;
        try {
          data = await response.json();
        } catch (error) {
          data = null;
        }
        if (data === null || typeof data !== 'object') throw new Error(t('hostMissing'));
        if (!response.ok || data.ok !== true) {
          throw new Error(typeof data.error === 'string' ? data.error : 'HTTP ' + response.status);
        }
        return data;
      };

      const fetchModels = async () => {
        setBusy(true);
        setProbe('');
        try {
          const data = await hostCall('/models', {
            baseUrl: draft.baseUrl.trim(),
            apiKey: draft.apiKey.trim(),
          });
          const ids = Array.isArray(data.models) ? data.models : [];
          setModels(ids);
          const picked = ids.length > 0 && draft.model.trim() === '' ? ids[0] : draft.model.trim();
          if (ids.length > 0 && draft.model.trim() === '') {
            setDraft({ ...draft, model: picked });
          }
          // Persist right away: users read "返回去小窗没保存" as a bug otherwise.
          if (draft.baseUrl.trim() !== '') {
            writeOA({ baseUrl: draft.baseUrl.trim(), model: picked, apiKey: draft.apiKey.trim() });
            refresh();
          }
          setProbe(ids.length === 0 ? t('modelsEmpty') : t('modelsSaved') + ids.length);
        } catch (error) {
          setProbe(t('probeFailed') + String(error.message ?? error));
        } finally {
          setBusy(false);
        }
      };

      const testConnection = async () => {
        setBusy(true);
        setProbe('');
        try {
          const data = await hostCall('/translate', {
            baseUrl: draft.baseUrl.trim(),
            model: draft.model.trim(),
            apiKey: draft.apiKey.trim(),
            text: 'Hello',
          });
          const sample = typeof data.text === 'string' ? data.text.slice(0, 40) : '';
          setProbe(t('probeOk') + sample);
        } catch (error) {
          const message = String(error.message ?? error);
          const needsModel = message.includes('model must be a string') || message.includes('model is required') || message.includes('`model`');
          setProbe(needsModel ? t('needModel') : t('probeFailed') + message);
        } finally {
          setBusy(false);
        }
      };

      // Same reason as the window panel: the old candidate list filtered by the current
      // value, so the fetched models get their own browsable select.
      const pickModel = (model) => {
        const next = { ...draft, model };
        setDraft(next);
        const baseUrl = next.baseUrl.trim();
        if (engine === 'custom' && baseUrl !== '') {
          writeOA({ baseUrl, model: next.model.trim(), apiKey: next.apiKey.trim() });
          setStatus(t('oaSaved'));
          refresh();
        }
      };

      const field = (label, inputProps) =>
        h(
          'label',
          { className: 'dsh-cot-peek-settings__field' },
          h('span', { className: 'dsh-cot-peek-settings__label' }, label),
          h('input', { className: 'dsh-cot-peek__input', spellCheck: false, ...inputProps }),
        );

      return h(
        'div',
        { className: 'dsh-cot-peek-settings' },
        h('div', { className: 'dsh-cot-peek-settings__title' }, t('settingsTitle')),
        h('div', { className: 'dsh-cot-peek-settings__desc' }, t('settingsDesc')),
        h(
          'div',
          { className: 'dsh-cot-peek-settings__engines' },
          h(
            'label',
            { className: 'dsh-cot-peek-settings__radio' },
            h('input', {
              type: 'radio',
              name: 'dsh-cot-peek-engine',
              checked: engine === 'official',
              onChange: () => setEngine('official'),
            }),
            h('span', null, t('engineOfficial')),
          ),
          h(
            'label',
            { className: 'dsh-cot-peek-settings__radio' },
            h('input', {
              type: 'radio',
              name: 'dsh-cot-peek-engine',
              checked: engine === 'custom',
              onChange: () => setEngine('custom'),
            }),
            h('span', null, t('engineCustom')),
          ),
        ),
        engine === 'custom'
          ? h(
              'div',
              { className: 'dsh-cot-peek-settings__fields' },
              field(t('oaUrlLabel'), {
                type: 'text',
                placeholder: 'http://127.0.0.1:1234/v1',
                value: draft.baseUrl,
                onChange: (event) => setDraft({ ...draft, baseUrl: event.target.value }),
              }),
              h(
                'label',
                { className: 'dsh-cot-peek-settings__field' },
                h('span', { className: 'dsh-cot-peek-settings__label' }, t('oaModelLabel')),
                h('input', {
                  className: 'dsh-cot-peek__input',
                  spellCheck: false,
                  placeholder: 'qwen2.5-7b-instruct',
                  value: draft.model,
                  onChange: (event) => setDraft({ ...draft, model: event.target.value }),
                }),
              ),
              models.length > 0
                ? modelPickerNode(
                    t,
                    models,
                    draft.model,
                    modelMenuOpen,
                    () => setModelMenuOpen(!modelMenuOpen),
                    (id) => {
                      pickModel(id);
                      setModelMenuOpen(false);
                    },
                  )
                : null,
              field(t('oaKeyLabel'), {
                type: 'password',
                value: draft.apiKey,
                onChange: (event) => setDraft({ ...draft, apiKey: event.target.value }),
              }),
              h('div', { className: 'dsh-cot-peek-settings__note' }, t('oaCorsNote')),
              h(
                'div',
                { className: 'dsh-cot-peek-settings__probe' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-cot-peek-settings__button dsh-cot-peek-settings__button--ghost',
                    disabled: busy,
                    onClick: fetchModels,
                  },
                  t('fetchModels'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-cot-peek-settings__button dsh-cot-peek-settings__button--ghost',
                    disabled: busy,
                    onClick: testConnection,
                  },
                  t('testConnection'),
                ),
                probe !== '' ? h('span', { className: 'dsh-cot-peek-settings__status' }, probe) : null,
              ),
            )
          : null,
        h(
          'div',
          { className: 'dsh-cot-peek-settings__row' },
          h('input', {
            type: 'checkbox',
            checked: smooth,
            onChange: (event) => {
              const next = event.target.checked;
              setSmooth(next);
              writeSmoothEnabled(next);
            },
          }),
          h('span', { className: 'dsh-cot-peek-settings__label' }, t('smooth')),
          rateButtonsNode(t, rate, smooth, (value) => {
            setRate(value);
            writeSmoothRate(value);
          }),
        ),
        h(
          'div',
          { className: 'dsh-cot-peek-settings__row' },
          h('input', {
            type: 'checkbox',
            checked: accumulate,
            onChange: (event) => {
              const next = event.target.checked;
              setAccumulate(next);
              writeAccumulate(next);
            },
          }),
          h('span', { className: 'dsh-cot-peek-settings__label' }, t('accumulate')),
        ),
        h(
          'div',
          { className: 'dsh-cot-peek-settings__actions' },
          h(
            'button',
            { type: 'button', className: 'dsh-cot-peek-settings__button', onClick: save },
            t('oaSave'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-cot-peek-settings__button dsh-cot-peek-settings__button--ghost',
              onClick: useOfficial,
            },
            t('oaClear'),
          ),
          status !== '' ? h('span', { className: 'dsh-cot-peek-settings__status' }, status) : null,
        ),
      );
    }

    // Same service set the official cot-translation client uses: `remote` is
    // what exposes the `remote.cotTranslation` namespace we consume.
    const inject = ['slots', 'locale', 'remote'];

    function apply(ctx) {
      const service = createTranslationService(ctx);
      service.start();

      ctx.effect(() => {
        const style = document.createElement('style');
        style.setAttribute('data-plugin-css', 'dsh-cot-peek');
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
      }, 'dsh-cot-peek: styles');

      ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-cot-peek: copy');

      const SourceDock = (props) => h(PeekSource, props);
      const Window = (props) => h(PeekWindow, Object.assign({}, props, { service }));
      const Settings = (props) => h(SettingsPage, Object.assign({}, props, { service }));

      ctx.slots.inject('conversation.input.dock', () =>
        ctx.slots.register(
          {
            name: 'conversation.input.dock',
            id: 'cot-peek-source',
            order: 90,
            locale: NS,
          },
          SourceDock,
        ),
      );

      ctx.slots.inject('plugins.bundle.config', () =>
        ctx.slots.register(
          {
            name: 'plugins.bundle.config',
            key: 'dsh-cot-peek',
            locale: NS,
          },
          Settings,
        ),
      );

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'cot-peek-window',
            order: 50,
            locale: NS,
          },
          Window,
        ),
      );
    }

    return { inject, apply };
  },
});
