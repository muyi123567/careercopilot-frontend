import { useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent } from 'react';
import { getRuntimeConfig } from '../../shared/api/client';
import { parsePdfLocally, isPdfFile, isDocxFile, isSupportedTextFile } from '../../lib/pdf-parser';
import { AnonymousChat } from './AnonymousChat';

type Mode = 'demo' | 'anonymous';
type EventKind = 'skill' | 'experience' | 'education' | 'preference' | 'constraint';

export interface StructuredEvent {
  kind: EventKind;
  label: string;
  confidence?: number;
}

interface TemporaryResult {
  status: 'temporary_preview';
  session_id: string;
  retention: 'none';
  event_counts: Record<string, number>;
  next_steps: string[];
  limitations: string[];
}

const PII = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?<!\d)1[3-9]\d{9}(?!\d)|(?<!\d)\d{17}[\dXx](?![\dXx])/i;

const GLYPHS = Array.from({ length: 44 }, (_, index) => ({
  id: index,
  glyph: '01アイ職路証'.charAt((index * 7 + 3) % 8),
  left: `${(index * 17) % 101}%`,
  delay: `${-((index * 19) % 31)}s`,
  duration: `${16 + ((index * 11) % 17)}s`,
}));

const DEMO_RESULT = {
  title: '演示信号已就绪',
  detail: '这是合成样例：从数据分析基础出发，比较本行业深化、邻近迁移与探索性路径。',
  steps: ['选择一个想验证的目标岗位。', '用一周完成一个可展示的小作品。', '记录真实反馈，而不是追逐单一成功率。'],
};

function trimSignal(line: string): string {
  return line
    .replace(/^(技能|能力|经历|项目|教育|偏好|约束|期望)\s*[:：-]?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function classify(line: string): EventKind {
  if (/(学历|专业|大学|本科|硕士|课程|证书)/.test(line)) return 'education';
  if (/(偏好|希望|喜欢|远程|城市|薪资|通勤)/.test(line)) return 'preference';
  if (/(限制|不能|不可|家庭|时间|地点)/.test(line)) return 'constraint';
  if (/(项目|负责|实习|工作|经历|完成|搭建|管理)/.test(line)) return 'experience';
  return 'skill';
}

/** Derive a deliberately small, PII-screened event set; raw local text never leaves this function. */
export function extractStructuredEvents(rawText: string): StructuredEvent[] {
  const seen = new Set<string>();
  const events: StructuredEvent[] = [];
  for (const rawLine of rawText.split(/\r?\n|[；;]/)) {
    const label = trimSignal(rawLine);
    if (label.length < 2 || PII.test(label) || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    events.push({ kind: classify(rawLine), label, confidence: 0.72 });
    if (events.length === 12) break;
  }
  return events;
}

function glyphStyle(item: (typeof GLYPHS)[number]): CSSProperties {
  return {
    left: item.left,
    animationDelay: item.delay,
    animationDuration: item.duration,
  };
}

export function MatrixLandingPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>('demo');
  const [events, setEvents] = useState<StructuredEvent[]>([]);
  const [fileName, setFileName] = useState('');
  const [question, setQuestion] = useState('我应该先验证哪项能力？');
  const [consented, setConsented] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [demoVisible, setDemoVisible] = useState(false);
  const [temporaryResult, setTemporaryResult] = useState<TemporaryResult | null>(null);
  const [chatVisible, setChatVisible] = useState(false);

  async function parseFile(file: File) {
    setError('');
    setTemporaryResult(null);

    // DOCX 暂不支持
    if (isDocxFile(file)) {
      setError('DOCX 支持即将加入。请先将简历导出为 PDF 或 TXT 格式。');
      return;
    }

    let localText: string;

    // PDF 解析
    if (isPdfFile(file)) {
      try {
        const result = await parsePdfLocally(file);
        localText = result.text;
        if (result.truncated) {
          setError(`PDF 共 ${result.pages} 页，已解析前 20 页。`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'PDF 解析失败，请尝试使用 TXT 格式。');
        return;
      }
    }
    // 文本文件解析
    else if (isSupportedTextFile(file)) {
      if (file.size > 1024 * 1024) {
        setError('为保护浏览器性能，请选择不超过 1 MB 的文本版简历。');
        return;
      }
      localText = await file.text();
    }
    else {
      setError('支持的文件格式：PDF、TXT、MD、CSV、JSON。所有解析均在浏览器本地完成。');
      return;
    }

    const extracted = extractStructuredEvents(localText);
    if (!extracted.length) {
      setError('没有识别到可安全发送的结构化信号。请使用条目化的简历，或手动补充后再试。');
      return;
    }
    setEvents(extracted);
    setFileName(file.name);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void parseFile(file);
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void parseFile(file);
  }

  async function submitTemporary() {
    setError('');
    setTemporaryResult(null);
    if (!consented) {
      setError('请先确认本次临时处理授权；未确认前不会发送任何结构化信号。');
      return;
    }
    if (!events.length) {
      setError('请先在浏览器本地选择并解析一份文本版简历。');
      return;
    }
    if (!question.trim()) {
      setError('请写下你希望验证的问题。');
      return;
    }
    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (!apiBase) {
      setError('尚未配置正式后端地址；你仍可先使用合成演示模式。');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${apiBase}/api/v1/anonymous-navigation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_to_temporary_processing: true, events, question: question.trim() }),
      });

      // 处理限流 (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60';
        setError(`请求过于频繁，请在 ${retryAfter} 秒后再试。`);
        return;
      }

      const payload = (await response.json()) as TemporaryResult | { detail?: string };

      // 处理参数校验错误 (422)
      if (response.status === 422) {
        const detail = 'detail' in payload ? payload.detail : '';
        if (typeof detail === 'string' && detail.includes('personal identifiers')) {
          setError('检测到可能的个人信息（邮箱/手机/身份证），请移除后重试。我们不会发送包含直接标识符的内容。');
        } else if (typeof detail === 'string' && detail.includes('consent')) {
          setError('请先勾选同意临时处理授权。');
        } else {
          setError(`请求参数有误：${typeof detail === 'string' ? detail : '请检查输入内容'}`);
        }
        return;
      }

      // 处理服务器错误 (500)
      if (response.status >= 500) {
        setError('服务暂时不可用，请稍后再试。如果问题持续，请联系我们。');
        return;
      }

      if (!response.ok || !('status' in payload)) {
        throw new Error('detail' in payload && payload.detail ? payload.detail : `临时推演请求失败（HTTP ${response.status}）`);
      }
      setTemporaryResult(payload);
    } catch (caught) {
      if (caught instanceof TypeError && caught.message.includes('fetch')) {
        setError('网络连接失败，请检查网络后重试。');
      } else {
        setError(caught instanceof Error ? caught.message : '临时推演请求失败，请稍后再试。');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="matrix-page">
      <div className="matrix-grid" aria-hidden="true" />
      <div className="matrix-rain" aria-hidden="true">
        {GLYPHS.map((item) => <span key={item.id} style={glyphStyle(item)}>{item.glyph}</span>)}
      </div>

      <header className="matrix-header">
        <a className="matrix-brand" href="#top" aria-label="CareerCopilot 首页">
          <span className="brand-mark">CC</span>
          <span>CareerCopilot</span>
        </a>
        <nav aria-label="页面导航">
          <a href="#privacy">隐私边界</a>
          <a href="#how">如何工作</a>
          <button type="button" onClick={() => setMode('demo')}>合成演示</button>
        </nav>
      </header>

      <section id="top" className="matrix-hero" aria-labelledby="hero-title">
        <div className="matrix-kicker"><span /> EVIDENCE-LED CAREER NAVIGATION</div>
        <h1 id="hero-title">你的职业信号，<br /><em>值得被看清。</em></h1>
        <p className="matrix-lead">不把人生压缩成一个成功率。CareerCopilot 用可核对的信号、缺口与小验证，帮你看见下一步。</p>
        <div className="matrix-actions">
          <a className="matrix-primary" href="#navigator">开始探索 <span aria-hidden="true">↘</span></a>
          <button className="matrix-secondary" type="button" onClick={() => { setMode('demo'); setDemoVisible(true); }}>查看合成演示</button>
        </div>
        <div className="matrix-proof" aria-label="产品原则">
          <span>LOCAL FIRST</span><span>NO RAW FILE UPLOAD</span><span>NO SUCCESS SCORE</span>
        </div>
      </section>

      <section id="navigator" className="matrix-navigator" aria-labelledby="navigator-title">
        <div className="navigator-copy">
          <p className="matrix-kicker"><span /> NAVIGATION CONSOLE</p>
          <h2 id="navigator-title">选择你的观察方式。</h2>
          <p>合成演示使用固定样例；临时推演由浏览器先在本地提取少量结构化事件，再在你明确授权后发送。原始文件始终留在设备上。</p>
          <div className="mode-switch" role="tablist" aria-label="探索模式">
            <button role="tab" aria-selected={mode === 'demo'} className={mode === 'demo' ? 'active' : ''} type="button" onClick={() => setMode('demo')}>01 合成演示</button>
            <button role="tab" aria-selected={mode === 'anonymous'} className={mode === 'anonymous' ? 'active' : ''} type="button" onClick={() => setMode('anonymous')}>02 临时推演</button>
          </div>
        </div>

        <div className="matrix-console">
          {mode === 'demo' ? (
            <div className="console-panel demo-panel">
              <p className="console-label">SYNTHETIC DATASET / READ ONLY</p>
              <div className="signal-map" aria-hidden="true"><i /><i /><i /><b>DATA</b><b>PRODUCT</b><b>RESEARCH</b></div>
              <h3>从信号到可验证的下一步</h3>
              <p>查看三类合成路径如何同时呈现收益、成本、数据覆盖与反证。</p>
              <button className="matrix-primary wide" type="button" onClick={() => setDemoVisible(true)}>运行合成样例 <span aria-hidden="true">↘</span></button>
            </div>
          ) : (
            <div className="console-panel anonymous-panel">
              <p className="console-label">EPHEMERAL / CONSENT REQUIRED</p>
              <button className="drop-zone" type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
                <span className="drop-icon">⇩</span>
                <strong>{fileName || '选择或拖入简历文件'}</strong>
                <small>PDF · TXT · MD · CSV · JSON，浏览器本地解析，原始文件不上传</small>
              </button>
              <input ref={inputRef} className="sr-only" type="file" accept=".pdf,.txt,.md,.csv,.json,application/pdf,text/plain,text/markdown,text/csv,application/json" onChange={onFileChange} />
              {events.length > 0 && (
                <div className="event-tray">
                  <div><span>已提取 {events.length} 个可发送信号</span><button type="button" onClick={() => { setEvents([]); setFileName(''); }}>清除</button></div>
                  <ul>{events.map((event) => <li key={`${event.kind}-${event.label}`}><b>{event.kind}</b>{event.label}</li>)}</ul>
                </div>
              )}
              <label className="question-label" htmlFor="anonymous-question">你想验证什么？</label>
              <input id="anonymous-question" className="matrix-input" value={question} maxLength={500} onChange={(event) => setQuestion(event.target.value)} />
              <label className="consent-row"><input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} /><span>我同意仅为本次临时推演发送以上结构化事件和问题；不发送原始文件，也不保留此次内容。</span></label>
              <button className="matrix-primary wide" type="button" disabled={busy} onClick={() => void submitTemporary()}>{busy ? '正在请求临时结果…' : '开始临时推演'} <span aria-hidden="true">↘</span></button>
            </div>
          )}
          <p className="matrix-status" aria-live="polite">{error || (temporaryResult ? `临时会话 ${temporaryResult.session_id.slice(0, 13)}… 已完成，服务端保留：无。` : '')}</p>
        </div>
      </section>

      {(demoVisible || temporaryResult) && (
        <section className="matrix-result" aria-live="polite">
          <div><p className="console-label">{temporaryResult ? 'TEMPORARY PREVIEW / RETENTION: NONE' : 'SYNTHETIC PREVIEW / READ ONLY'}</p><h2>{temporaryResult ? '本次临时信号已整理。' : DEMO_RESULT.title}</h2><p>{temporaryResult ? `本次共收到 ${Object.values(temporaryResult.event_counts).reduce((sum, count) => sum + count, 0)} 个经授权结构化事件；原始文件没有离开浏览器。` : DEMO_RESULT.detail}</p></div>
          <ol>{(temporaryResult?.next_steps ?? DEMO_RESULT.steps).map((step) => <li key={step}>{step}</li>)}</ol>
          {temporaryResult && !chatVisible && (
            <button className="matrix-primary" type="button" onClick={() => setChatVisible(true)} style={{ marginTop: '1.5rem' }}>继续探索对话（最多 10 轮） <span aria-hidden="true">↘</span></button>
          )}
        </section>
      )}

      {chatVisible && temporaryResult && (
        <section className="matrix-navigator" style={{ paddingBottom: '3rem' }}>
          <AnonymousChat
            events={events}
            initialQuestion={question}
            onClose={() => setChatVisible(false)}
          />
        </section>
      )}

      <section id="privacy" className="matrix-principles" aria-labelledby="privacy-title">
        <p className="matrix-kicker"><span /> PRIVACY BY DESIGN</p>
        <h2 id="privacy-title">把边界写进产品，而不是藏在条款里。</h2>
        <div>
          <article><b>01</b><h3>本地解析</h3><p>文本版简历在浏览器读取。接口没有上传文件或原始简历字段。</p></article>
          <article><b>02</b><h3>一次一同意</h3><p>只有勾选授权后，才发送可见、可清除的结构化事件和问题。</p></article>
          <article><b>03</b><h3>不伪造确定性</h3><p>结果强调数据范围、缺口和下一步验证，不给出单一成功率。</p></article>
        </div>
      </section>

      <section id="how" className="matrix-how" aria-labelledby="how-title">
        <p className="matrix-kicker"><span /> FROM SIGNAL TO ACTION</p>
        <h2 id="how-title">先读懂现状，再用行动改变它。</h2>
        <div className="how-steps"><span><b>01</b>识别信号</span><span><b>02</b>呈现证据与缺口</span><span><b>03</b>设计最小验证</span></div>
      </section>

      <footer className="matrix-footer"><span>CAREERCOPILOT / 2026</span><span>LOCAL · EXPLICIT · EVIDENCE</span></footer>
    </main>
  );
}
