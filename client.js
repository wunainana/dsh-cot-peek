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
      translationFailed: 'Translation failed — showing original',
      translate: 'Translate',
      retranslate: 'Translate again',
      translateHint: 'Translate the reasoning shown in this window',
      off_remote: 'Translation bundle not mounted',
      off_contribution: 'Translation plugin not enabled',
      off_limits: 'Translation settings unavailable',
      off_error: 'Translation service error',
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
      translationFailed: '翻译失败，显示原文',
      translate: '翻译',
      retranslate: '再译',
      translateHint: '把这扇窗里的思考翻成中文',
      off_remote: '翻译服务未挂载',
      off_contribution: '翻译插件未启用',
      off_limits: '翻译设置不可用',
      off_error: '翻译服务报错',
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
        this.publish();
      }

      update(text) {
        if (this.disposed) return;
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
      let fallback = null;
      for (let index = order.length - 1; index >= 0; index -= 1) {
        const node = nodes.get(order[index]);
        if (node === undefined || node === null || node.kind !== 'assistant-step') continue;
        if (node.data !== undefined && node.data !== null && node.data.status === 'running') return node;
        if (fallback === null) fallback = node;
      }
      return fallback;
    }

    function selectReasoningText(snapshot) {
      const node = latestAssistantNode(snapshot);
      const blocks = node === null || node.data === undefined ? undefined : node.data.blocks;
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

    function selectReasoningRunning(snapshot) {
      const node = latestAssistantNode(snapshot);
      return node !== null && node.data !== undefined && node.data !== null && node.data.status === 'running';
    }

    // ------------------------------------------------------------------
    // Bridge between the composer-dock data seat (the only place that owns
    // the session snapshot) and the frame-wide floating window.
    // ------------------------------------------------------------------
    const bridge = (() => {
      let value = { sessionId: null, text: '', running: false };
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
            next.running === value.running
          ) {
            return;
          }
          value = next;
          for (const listener of listeners) listener();
        },
      };
    })();

    function PeekSource(props) {
      const { sessionId, useChat } = props;
      const text = useChat(selectReasoningText);
      const running = useChat(selectReasoningRunning);

      React.useEffect(() => {
        bridge.set({
          sessionId: typeof sessionId === 'string' ? sessionId : null,
          text: typeof text === 'string' ? text : '',
          running: running === true,
        });
      }, [sessionId, text, running]);

      React.useEffect(
        () => () => {
          bridge.set({ sessionId: null, text: '', running: false });
        },
        [],
      );

      return null;
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

      const probe = async () => {
        const value = await loadLimits();
        const next = value !== undefined && value !== null;
        if (next !== mounted) {
          mounted = next;
          for (const listener of listeners) {
            try {
              listener(mounted);
            } catch (error) {
              /* a broken listener must not stop the probe loop */
            }
          }
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

    function normalizeRect(rect) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, viewportWidth - 16));
      const maxHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, viewportHeight - 80));
      const width = clamp(Number(rect.w) || 680, MIN_WIDTH, maxWidth);
      const height = clamp(Number(rect.h) || 260, MIN_HEIGHT, maxHeight);
      const x = clamp(Number(rect.x) || 0, 8, Math.max(8, viewportWidth - width - 8));
      const y = clamp(Number(rect.y) || 92, 8, Math.max(8, viewportHeight - 48));
      return { x, y, w: width, h: height };
    }

    function defaultRect() {
      const viewportWidth = window.innerWidth;
      const width = clamp(Math.min(680, viewportWidth - 48), MIN_WIDTH, MAX_WIDTH);
      return normalizeRect({ x: Math.round((viewportWidth - width) / 2), y: 92, w: width, h: 260 });
    }

    function readRect() {
      try {
        const raw = window.localStorage.getItem(RECT_KEY);
        if (raw === null) return defaultRect();
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object') return defaultRect();
        return normalizeRect(parsed);
      } catch (error) {
        return defaultRect();
      }
    }

    function saveRect(rect) {
      try {
        window.localStorage.setItem(RECT_KEY, JSON.stringify(rect));
      } catch (error) {
        /* storage may be unavailable */
      }
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

    function oneLine(text) {
      const line = String(text).replace(/\s+/g, ' ').trim();
      return line.length > 72 ? line.slice(0, 72) + '…' : line;
    }

    function PeekWindow(props) {
      const { t, service } = props;
      const state = React.useSyncExternalStore(bridge.subscribe, bridge.get);
      const sessionId = state.sessionId;
      const reasoning = state.text;
      const running = state.running === true;

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
      const [notice, setNotice] = React.useState('');
      const [rect, setRect] = React.useState(readRect);
      const engine = React.useRef(null);
      const body = React.useRef(null);
      const drag = React.useRef(null);
      const resize = React.useRef(null);

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

      React.useEffect(() => {
        setTranslation({ output: '', tail: '', pending: false, failed: false });
        setTranslatedText('');
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

      React.useLayoutEffect(() => {
        const element = body.current;
        if (element !== null) element.scrollTop = element.scrollHeight;
      }, [translation.output, translation.tail, reasoning, collapsed]);

      React.useEffect(() => {
        const handle = () => setRect((previous) => normalizeRect(previous));
        window.addEventListener('resize', handle);
        return () => window.removeEventListener('resize', handle);
      }, []);

      const beginDrag = (event) => {
        if (event.button !== 0) return;
        const target = event.target;
        if (target !== null && typeof target.closest === 'function' && target.closest('button') !== null) return;
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          baseX: rect.x,
          baseY: rect.y,
        };
        if (typeof event.currentTarget.setPointerCapture === 'function') {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      };

      const moveDrag = (event) => {
        const session = drag.current;
        if (session === null || session.pointerId !== event.pointerId) return;
        setRect((previous) => ({
          ...previous,
          x: clamp(
            session.baseX + event.clientX - session.startX,
            8,
            Math.max(8, window.innerWidth - previous.w - 8),
          ),
          y: clamp(
            session.baseY + event.clientY - session.startY,
            8,
            Math.max(8, window.innerHeight - 48),
          ),
        }));
      };

      const endDrag = (event) => {
        if (drag.current === null) return;
        drag.current = null;
        if (typeof event.currentTarget.releasePointerCapture === 'function') {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setRect((previous) => {
          saveRect(previous);
          return previous;
        });
      };

      const beginResize = (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        resize.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          baseW: rect.w,
          baseH: rect.h,
        };
        if (typeof event.currentTarget.setPointerCapture === 'function') {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      };

      const moveResize = (event) => {
        const session = resize.current;
        if (session === null || session.pointerId !== event.pointerId) return;
        setRect((previous) => {
          const maxWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, window.innerWidth - 16));
          const maxHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, window.innerHeight - 80));
          return {
            ...previous,
            w: clamp(session.baseW + event.clientX - session.startX, MIN_WIDTH, maxWidth),
            h: clamp(session.baseH + event.clientY - session.startY, MIN_HEIGHT, maxHeight),
          };
        });
      };

      const endResize = (event) => {
        if (resize.current === null) return;
        resize.current = null;
        if (typeof event.currentTarget.releasePointerCapture === 'function') {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setRect((previous) => {
          saveRect(previous);
          return previous;
        });
      };

      if (sessionId === null) return null;

      const original = typeof reasoning === 'string' ? reasoning : '';
      const hasTranslation = translation.output !== '' || translation.tail !== '';
      const showTranslated = hasTranslation && view === 'translated';
      const shown = showTranslated ? translation.output + translation.tail : original;
      const content =
        shown.trim() === ''
          ? translatedText !== '' && translation.pending
            ? t('translating')
            : t('idle')
          : shown;
      const summarySource = showTranslated
        ? translation.output !== ''
          ? translation.output
          : translation.tail
        : original;
      const summary = oneLine(summarySource);

      // Streaming continues after a manual translate, so tell the user that the
      // translation is one step behind instead of silently showing stale text.
      const stale = translatedText !== '' && original.length > translatedText.length;

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
        flag = notice !== '' ? notice : t('translationOff');
        flagError = notice !== '';
        flagTitle = describeReason();
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
        setView('translated');
        engine.current.translateAll(text);
      };

      const translateLabel = translation.pending
        ? t('translating')
        : stale
          ? t('retranslate')
          : t('translate');
      const translateTitle = available ? t('translateHint') : describeReason();

      const toggleCollapsed = () => {
        const next = !collapsed;
        setCollapsed(next);
        writeCollapsed(next);
      };

      const windowStyle = collapsed
        ? { left: rect.x + 'px', top: rect.y + 'px' }
        : { left: rect.x + 'px', top: rect.y + 'px', width: rect.w + 'px', height: rect.h + 'px' };

      return h(
        'section',
        {
          className: 'dsh-cot-peek',
          style: windowStyle,
          'data-collapsed': collapsed ? 'true' : undefined,
          'data-running': running ? 'true' : undefined,
          role: 'region',
          'aria-label': t('title'),
        },
        h(
          'header',
          {
            className: 'dsh-cot-peek__head',
            onPointerDown: beginDrag,
            onPointerMove: moveDrag,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
          },
          h('span', { className: 'dsh-cot-peek__glyph', 'aria-hidden': 'true' }, '✳'),
          h('span', { className: 'dsh-cot-peek__title' }, t('title')),
          running ? h('span', { className: 'dsh-cot-peek__pulse', 'aria-hidden': 'true' }) : null,
          running ? h('span', { className: 'dsh-cot-peek__state' }, t('thinking')) : null,
          collapsed && summary !== '' ? h('span', { className: 'dsh-cot-peek__summary' }, summary) : null,
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
            : null,
          h('span', { className: 'dsh-cot-peek__spacer' }),
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
            : null,
          hasTranslation
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
            : null,
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-cot-peek__toggle',
              'aria-expanded': collapsed ? 'false' : 'true',
              onClick: toggleCollapsed,
            },
            collapsed ? t('expand') : t('collapse'),
          ),
        ),
        collapsed
          ? null
          : h(
              'div',
              {
                className: 'dsh-cot-peek__body',
                ref: body,
                'data-view': showTranslated ? 'translated' : 'original',
                role: 'log',
                'aria-live': running ? 'polite' : 'off',
              },
              content,
            ),
        collapsed
          ? null
          : h('div', {
              className: 'dsh-cot-peek__resize',
              'aria-hidden': 'true',
              onPointerDown: beginResize,
              onPointerMove: moveResize,
              onPointerUp: endResize,
              onPointerCancel: endResize,
            }),
      );
    }

    // ------------------------------------------------------------------
    // Styles: theme tokens only, local classes only. The window floats above
    // the conversation (fixed, top-centered) and opts back into pointer
    // events because shell.overlay itself is click-through.
    // ------------------------------------------------------------------
    const CSS = [
      '.dsh-cot-peek{position:fixed;z-index:900;box-sizing:border-box;display:flex;flex-direction:column;min-width:320px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-elevation-prominent,0 12px 36px rgba(0,0,0,.28));backdrop-filter:blur(12px);color:var(--dsw-alias-label-primary);overflow:hidden;pointer-events:auto;font-size:13px;line-height:1.55}',
      '.dsh-cot-peek[data-collapsed="true"]{min-width:0}',
      '.dsh-cot-peek[data-running="true"]{border-color:var(--dsw-alias-brand-primary)}',
      '.dsh-cot-peek__head{display:flex;align-items:center;gap:8px;min-height:34px;padding:5px 10px;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none}',
      '.dsh-cot-peek__head:active{cursor:grabbing}',
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
      '.dsh-cot-peek__toggle[disabled]{opacity:.55;cursor:default}',
      '.dsh-cot-peek__body{flex:1;min-height:0;overflow-y:auto;padding:0 12px 12px;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.6}',
      '.dsh-cot-peek__body[data-view="original"]{opacity:.82}',
      '.dsh-cot-peek__resize{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;touch-action:none}',
      '.dsh-cot-peek__resize::after{content:"";position:absolute;right:3px;bottom:3px;width:7px;height:7px;border-right:2px solid var(--dsw-alias-label-secondary);border-bottom:2px solid var(--dsw-alias-label-secondary);opacity:.45;border-bottom-right-radius:2px}',
      '@keyframes dsh-cot-peek-pulse{0%,100%{opacity:1}50%{opacity:.25}}',
      '@media (prefers-reduced-motion:reduce){.dsh-cot-peek__pulse{animation:none}}',
    ].join('');

    // ------------------------------------------------------------------
    // Client plugin: a hidden data seat inside the composer dock plus the
    // pinned window in the frame-wide overlay layer.
    // ------------------------------------------------------------------
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
