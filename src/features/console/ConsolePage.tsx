import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { getRuntimeConfig } from '../../shared/api/client';
import { parsePdfLocally, isPdfFile, isDocxFile, isSupportedTextFile } from '../../lib/pdf-parser';
import { AnonymousChat } from './AnonymousChat';
import { extractStructuredEvents, type StructuredEvent } from '../matrix/MatrixLandingPage';

type Mode = 'demo' | 'anonymous';

interface TemporaryResult {
  status: 'temporary_preview';
  session_id: string;
  retention: 'none';
  event_counts: Record<string, number>;
  next_steps: string[];
  limitations: string[];
}

const DEMO_RESULT = {
  title: '演示信号已就绪',
  detail: '这是合成样例：从数据分析基础出发，比较本行业深化、邻近迁移与探索性路径。',
  steps: ['选择一个想验证的目标岗位。', '用一周完成一个可展示的小作品。', '记录真实反馈，而不是追逐单一成功率。'],
};

export function ConsolePage() {
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
    if (isDocxFile(file)) { setError('DOCX 支持即将加入。请先将简历导出为 PDF 或 TXT 格式。'); return; }
    let localText: string;
    if (isPdfFile(file)) {
      try {
        const result = await parsePdfLocally(file);
        localText = result.text;
        if (result.truncated) setError(`PDF 共 ${result.pages} 页，已解析前 20 页。`);
      } catch (err) { setError(err instanceof Error ? err.message : 'PDF 解析失败，请尝试使用 TXT 格式。'); return; }
    } else if (isSupportedTextFile(file)) {
      if (file.size > 1024 * 1024) { setError('为保护浏览器性能，请选择不超过 1 MB 的文本版简历。'); return; }
      localText = await file.text();
    } else { setError('支持的文件格式：PDF、TXT、MD、CSV、JSON。所有解析均在浏览器本地完成。'); return; }
    const extracted = extractStructuredEvents(localText);
    if (!extracted.length) { setError('没有识别到可安全发送的结构化信号。请使用条目化的简历，或手动补充后再试。'); return; }
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
    setError(''); setTemporaryResult(null);
    if (!consented) { setError('请先确认本次临时处理授权；未确认前不会发送任何结构化信号。'); return; }
    if (!events.length) { setError('请先在浏览器本地选择并解析一份文本版简历。'); return; }
    if (!question.trim()) { setError('请写下你希望验证的问题。'); return; }
    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (!apiBase) { setError('尚未配置正式后端地址；你仍可先使用合成演示模式。'); return; }
    setBusy(true);
    try {
      const response = await fetch(`${apiBase}/api/v1/anonymous-navigation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_to_temporary_processing: true, events, question: question.trim() }),
      });
      if (response.status === 429) { setError(`请求过于频繁，请在 ${response.headers.get('Retry-After') || '60'} 秒后再试。`); return; }
      const payload = (await response.json()) as TemporaryResult | { detail?: string };
      if (response.status === 422) {
        const detail = 'detail' in payload ? payload.detail : '';
        if (typeof detail === 'string' && detail.includes('personal identifiers')) setError('检测到可能的个人信息（邮箱/手机/身份证），请移除后重试。');
        else if (typeof detail === 'string' && detail.includes('consent')) setError('请先勾选同意临时处理授权。');
        else setError(`请求参数有误：${typeof detail === 'string' ? detail : '请检查输入内容'}`);
        return;
      }
      if (response.status >= 500) { setError('服务暂时不可用，请稍后再试。'); return; }
      if (!response.ok || !('status' in payload)) throw new Error('detail' in payload && payload.detail ? payload.detail : `临时推演请求失败（HTTP ${response.status}）`);
      setTemporaryResult(payload);
    } catch (caught) {
      if (caught instanceof TypeError && caught.message.includes('fetch')) setError('网络连接失败，请检查网络后重试。');
      else setError(caught instanceof Error ? caught.message : '临时推演请求失败，请稍后再试。');
    } finally { setBusy(false); }
  }

  return (
    <div className="stagger space-y-8">
      {/* Header */}
      <div>
        <p className="eyebrow">推演控制台</p>
        <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">把经历交给推演，不交给服务器</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
          合成演示使用固定样例；临时推演由浏览器先在本地提取少量结构化事件，再在你明确授权后发送。原始文件始终留在设备上。
        </p>
      </div>

      {/* Mode Switch */}
      <div className="flex gap-2" role="tablist" aria-label="推演模式">
        <button role="tab" aria-selected={mode === 'demo'} type="button" onClick={() => setMode('demo')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === 'demo' ? 'bg-brand-700 text-white shadow-sm' : 'border border-line bg-surface text-ink-600 hover:border-brand-400 hover:text-brand-700'}`}>
          合成演示
        </button>
        <button role="tab" aria-selected={mode === 'anonymous'} type="button" onClick={() => setMode('anonymous')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === 'anonymous' ? 'bg-brand-700 text-white shadow-sm' : 'border border-line bg-surface text-ink-600 hover:border-brand-400 hover:text-brand-700'}`}>
          临时推演
        </button>
      </div>

      {/* Demo Panel */}
      {mode === 'demo' && (
        <div className="card animate-slide-up p-6 sm:p-8">
          <p className="eyebrow mb-4">SYNTHETIC DATASET / READ ONLY</p>
          <h3 className="text-lg font-semibold">从信号到可验证的下一步</h3>
          <p className="mt-2 text-sm text-ink-600">查看三类合成路径如何同时呈现收益、成本、数据覆盖与反证。</p>
          <button type="button" onClick={() => setDemoVisible(true)}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-brand-800 hover:shadow-md">
            运行合成样例
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-[3px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      )}

      {/* Anonymous Panel */}
      {mode === 'anonymous' && (
        <div className="card animate-slide-up space-y-5 p-6 sm:p-8">
          <p className="eyebrow">EPHEMERAL / CONSENT REQUIRED</p>
          {/* Drop zone */}
          <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
            className="w-full rounded-xl border-[1.5px] border-dashed border-line py-10 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/50">
            <span className="mb-2 block text-brand-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto h-8 w-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
            </span>
            <strong className="block text-sm font-semibold text-ink-800">{fileName || '选择或拖入简历文件'}</strong>
            <small className="mt-1 block text-xs text-ink-500">PDF · TXT · MD · CSV · JSON，浏览器本地解析，原始文件不上传</small>
          </button>
          <input ref={inputRef} className="sr-only" type="file" accept=".pdf,.txt,.md,.csv,.json,application/pdf,text/plain,text/markdown,text/csv,application/json" onChange={onFileChange} />

          {/* Events tray */}
          {events.length > 0 && (
            <div className="rounded-xl border border-line bg-paper p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-ink-700">已提取 {events.length} 个可发送信号</span>
                <button type="button" onClick={() => { setEvents([]); setFileName(''); }} className="text-xs text-ink-400 underline hover:text-ink-700">清除</button>
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {events.map((ev) => (
                  <li key={`${ev.kind}-${ev.label}`} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs">
                    <b className="text-brand-700">{ev.kind}</b>
                    <span className="text-ink-600">{ev.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Question */}
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="console-question">你想验证什么？</label>
            <input id="console-question" className="field" value={question} maxLength={500} onChange={(e) => setQuestion(e.target.value)} />
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 rounded-xl border border-line bg-paper p-4 text-[13px] leading-relaxed text-ink-600">
            <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500" />
            <span>我同意仅为本次临时推演发送以上结构化事件和问题；不发送原始文件，也不保留此次内容。</span>
          </label>

          {/* Submit */}
          <button type="button" disabled={busy} onClick={() => void submitTemporary()}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-brand-800 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0">
            {busy ? '正在请求临时结果…' : '开始临时推演'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-[3px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

      {/* Results */}
      {(demoVisible || temporaryResult) && (
        <div className="card animate-slide-up p-6 sm:p-8">
          <p className="eyebrow mb-3">{temporaryResult ? 'TEMPORARY PREVIEW / RETENTION: NONE' : 'SYNTHETIC PREVIEW / READ ONLY'}</p>
          <h2 className="text-xl font-semibold">{temporaryResult ? '本次临时信号已整理。' : DEMO_RESULT.title}</h2>
          <p className="mt-2 text-sm text-ink-600">
            {temporaryResult
              ? `本次共收到 ${Object.values(temporaryResult.event_counts).reduce((s, c) => s + c, 0)} 个经授权结构化事件；原始文件没有离开浏览器。`
              : DEMO_RESULT.detail}
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-700">
            {(temporaryResult?.next_steps ?? DEMO_RESULT.steps).map((step) => <li key={step}>{step}</li>)}
          </ol>
          {temporaryResult && !chatVisible && (
            <button type="button" onClick={() => setChatVisible(true)}
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-brand-800">
              继续探索对话（最多 10 轮）
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-[3px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
            </button>
          )}
        </div>
      )}

      {/* Chat */}
      {chatVisible && temporaryResult && (
        <AnonymousChat events={events} initialQuestion={question} onClose={() => setChatVisible(false)} />
      )}
    </div>
  );
}

