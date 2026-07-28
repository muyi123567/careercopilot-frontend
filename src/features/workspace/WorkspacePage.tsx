import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRuntimeConfig } from '../../shared/api/client';
import { parsePdfLocally, isPdfFile, isDocxFile, isSupportedTextFile } from '../../lib/pdf-parser';
import { extractStructuredEvents, type StructuredEvent } from '../../shared/privacy/structured-events';
import { AnonymousChat } from '../console/AnonymousChat';

type Panel = 'input' | 'signals' | 'infer' | 'chat';

interface TemporaryResult {
  status: 'temporary_preview';
  session_id: string;
  retention: 'none';
  event_counts: Record<string, number>;
  next_steps: string[];
  limitations: string[];
}

const PANELS: { id: Panel; num: string; label: string; sub: string }[] = [
  { id: 'input', num: '01', label: '输入', sub: '选择或拖入简历' },
  { id: 'signals', num: '02', label: '信号', sub: '结构化事件提取' },
  { id: 'infer', num: '03', label: '推演', sub: '本地分析与路径' },
  { id: 'chat', num: '04', label: '对话', sub: '匿名多轮探索' },
];

export function WorkspacePage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState<Panel>('input');
  const [events, setEvents] = useState<StructuredEvent[]>([]);
  const [fileName, setFileName] = useState('');
  const [question, setQuestion] = useState('我应该先验证哪项能力？');
  const [consented, setConsented] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TemporaryResult | null>(null);
  const [chatReady, setChatReady] = useState(false);

  const progress = events.length > 0 ? (result ? 3 : 2) : 1;

  async function parseFile(file: File) {
    setError(''); setResult(null);
    if (isDocxFile(file)) { setError('DOCX 支持即将加入。请先导出为 PDF 或 TXT。'); return; }
    let localText: string;
    if (isPdfFile(file)) {
      try {
        const r = await parsePdfLocally(file);
        localText = r.text;
        if (r.truncated) setError(`PDF 共 ${r.pages} 页，已解析前 20 页。`);
      } catch (err) { setError(err instanceof Error ? err.message : 'PDF 解析失败。'); return; }
    } else if (isSupportedTextFile(file)) {
      if (file.size > 1024 * 1024) { setError('文件不超过 1 MB。'); return; }
      localText = await file.text();
    } else { setError('支持：PDF、TXT、MD、CSV、JSON。'); return; }
    const extracted = extractStructuredEvents(localText);
    if (!extracted.length) { setError('没有识别到可安全发送的结构化信号。'); return; }
    setEvents(extracted); setFileName(file.name);
    setActive('signals');
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) void parseFile(f); }
  function onDrop(e: DragEvent<HTMLButtonElement>) { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) void parseFile(f); }

  async function submitTemporary() {
    setError(''); setResult(null);
    if (!consented) { setError('请先勾选授权。'); return; }
    if (!events.length) { setError('请先解析简历。'); return; }
    if (!question.trim()) { setError('请写下问题。'); return; }
    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (!apiBase) { setError('尚未配置后端，无法开始临时推演。'); return; }
    setBusy(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/anonymous-navigation`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_to_temporary_processing: true, events, question: question.trim() }),
      });
      if (res.status === 429) { setError('请求过于频繁。'); return; }
      const payload = (await res.json()) as TemporaryResult | { detail?: string };
      if (res.status === 422) { setError('detail' in payload && typeof payload.detail === 'string' ? payload.detail : '参数有误'); return; }
      if (res.status >= 500) { setError('服务暂不可用。'); return; }
      if (!res.ok || !('status' in payload)) throw new Error('请求失败');
      setResult(payload); setChatReady(true); setActive('chat');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '请求失败');
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">推演工作台</p>
          <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">从简历到下一步行动</h1>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`h-2 rounded-full transition-all duration-500 ${progress >= s ? 'w-8 bg-brand-600 shadow-[0_0_8px_rgba(226,114,91,0.4)]' : 'w-2 bg-ink-900/10'}`} />
          ))}
        </div>
      </div>

      {/* Step tabs (horizontal, one row) */}
      <div className="flex gap-2 overflow-x-auto">
        {PANELS.map((p) => {
          const isActive = active === p.id;
          const isDone = (p.id === 'input' && events.length > 0) || (p.id === 'signals' && events.length > 0) || (p.id === 'infer' && !!result);
          return (
            <button key={p.id} type="button" onClick={() => setActive(p.id)}
              className={`flex flex-1 items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all duration-300 active:scale-[0.97] ${isActive ? 'border-brand-400 bg-brand-50/60 shadow-[0_2px_12px_-4px_rgba(226,114,91,0.2)]' : 'border-line bg-surface hover:border-brand-200 hover:bg-paper hover:shadow-sm'}`}>
              <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-display text-xs font-bold transition-colors ${isActive ? 'bg-brand-600 text-white' : isDone ? 'bg-teal-600 text-white' : 'bg-ink-900/5 text-ink-500'}`}>
                {isDone && !isActive ? '✓' : p.num}
              </span>
              <div className="min-w-0">
                <span className={`block text-sm font-semibold ${isActive ? 'text-brand-800' : 'text-ink-700'}`}>{p.label}</span>
                <span className="block truncate text-[11px] text-ink-400">{p.sub}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active panel content */}
      <div className="card animate-slide-up p-6 sm:p-8" style={{ minHeight: '360px' }}>
        {/* Panel: Input */}
        {active === 'input' && (
          <div className="flex h-full flex-col gap-4">
            <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
              className="group flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed border-line py-14 transition-all duration-300 hover:border-brand-400 hover:bg-brand-50/40 hover:shadow-[0_0_0_4px_rgba(226,114,91,0.08)] active:scale-[0.99]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-brand-500 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
              <strong className="text-sm text-ink-700">{fileName || '拖入或选择简历'}</strong>
              <span className="text-xs text-ink-400">PDF · TXT · MD · CSV · JSON · 本地解析，原始文件不上传</span>
            </button>
            <input ref={inputRef} className="sr-only" type="file" accept=".pdf,.txt,.md,.csv,.json" onChange={onFileChange} />
          </div>
        )}

        {/* Panel: Signals */}
        {active === 'signals' && (
          <div className="flex h-full flex-col gap-3">
            {events.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-ink-300"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 4-5"/></svg>
                <p className="text-sm text-ink-400">还没有提取到信号。请先在「输入」步骤解析简历。</p>
                <button type="button" onClick={() => setActive('input')} className="text-xs text-brand-700 underline">返回输入</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-700">已提取 {events.length} 个可发送信号</span>
                  <button type="button" onClick={() => { setEvents([]); setFileName(''); setActive('input'); }} className="text-xs text-ink-400 underline hover:text-ink-700">清除重来</button>
                </div>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {events.map((ev) => (
                    <li key={`${ev.kind}-${ev.label}`} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-xs transition-all duration-200 hover:border-brand-200 hover:shadow-sm hover:-translate-y-px">
                      <b className="shrink-0 text-brand-700">{ev.kind}</b>
                      <span className="text-ink-600">{ev.label}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setActive('infer')}
                  className="group mt-auto inline-flex items-center justify-center gap-2 self-center rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(181,71,46,0.3)] transition-all duration-300 hover:bg-brand-800 hover:shadow-[0_8px_24px_-6px_rgba(181,71,46,0.35)] hover:-translate-y-px active:scale-[0.97]">
                  信号就绪，开始推演
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-[3px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* Panel: Infer */}
        {active === 'infer' && (
          <div className="flex h-full flex-col gap-4">
            <>
              <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-500" htmlFor="ws-q">你想验证什么？</label>
                  <input id="ws-q" className="field" value={question} maxLength={500} onChange={(e) => setQuestion(e.target.value)} />
              </div>
              <label className="flex items-start gap-2.5 rounded-xl border border-line bg-paper p-3 text-xs leading-relaxed text-ink-600">
                  <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded text-brand-600" />
                  <span>我同意仅为本次临时推演发送结构化事件和问题；不发送原始文件，不保留内容。</span>
              </label>
              <button type="button" disabled={busy} onClick={() => void submitTemporary()}
                  className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-50">
                  {busy ? '推演中…' : '开始推演'}
              </button>
            </>

            {result && (
              <div className="rounded-xl border border-line bg-gradient-to-br from-paper to-brand-50/30 p-5 shadow-sm">
                <p className="eyebrow mb-2">TEMPORARY / RETENTION: NONE</p>
                <h4 className="text-base font-semibold text-ink-800">临时信号已整理</h4>
                <p className="mt-1 text-sm text-ink-500">共 {Object.values(result.event_counts).reduce((s, c) => s + c, 0)} 个事件，原始文件没有离开浏览器。</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink-700">
                  {result.next_steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => navigate('/results')}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-800">
                    查看账户态地图状态
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-[2px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
                  </button>
                  {chatReady && (
                    <button type="button" onClick={() => setActive('chat')}
                      className="rounded-full border border-line px-5 py-2 text-xs font-medium text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700">
                      继续对话深挖
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel: Chat */}
        {active === 'chat' && (
          <div className="flex h-full flex-col">
            {chatReady && result ? (
              <AnonymousChat events={events} initialQuestion={question} onClose={() => setActive('infer')} />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-ink-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p className="text-sm text-ink-400">完成推演后，可在此继续匿名对话（最多 10 轮）。</p>
                <button type="button" onClick={() => setActive('infer')} className="text-xs text-brand-700 underline">返回推演</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}





