/**
 * 匿名多轮对话组件（暖色设计系统适配）。
 * 对话历史仅存浏览器内存，关闭页面即消失。
 */
import { useState, useRef, useEffect } from 'react';
import { getRuntimeConfig } from '../../shared/api/client';
import type { StructuredEvent } from '../../shared/privacy/structured-events';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  status: 'temporary_chat';
  session_id: string;
  turn: number;
  retention: 'none';
  reply: string;
  suggestions: string[];
  is_final_turn: boolean;
  limitations: string[];
}

interface AnonymousChatProps {
  events: StructuredEvent[];
  initialQuestion: string;
  onClose: () => void;
}

const MAX_TURNS = 10;

export function AnonymousChat({ events, initialQuestion, onClose }: AnonymousChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFinal, setIsFinal] = useState(false);
  const [turn, setTurn] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const sendMessageRef = useRef<((text: string, history: ChatMessage[]) => Promise<void>) | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!initialized.current && initialQuestion && sendMessageRef.current) {
      initialized.current = true;
      void sendMessageRef.current(initialQuestion, []);
    }
  }, [initialQuestion]);

  async function sendMessage(text: string, history: ChatMessage[]) {
    if (!text.trim() || busy) return;
    setError(''); setBusy(true);
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...history, userMsg];
    setMessages(newMessages); setInput('');
    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (apiBase === undefined || apiBase === null || apiBase === 'null') { setError('尚未配置后端地址。'); setBusy(false); return; }
    const currentTurn = Math.floor(newMessages.filter(m => m.role === 'user').length);
    try {
      const response = await fetch(`${apiBase}/api/v1/anonymous-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent_to_temporary_processing: true,
          events: events.map(e => ({ kind: e.kind, label: e.label, confidence: e.confidence })),
          message: text.trim(),
          history: history.map(m => ({ role: m.role, content: m.content })),
          turn: currentTurn,
        }),
      });
      if (response.status === 429) { setError('请求过于频繁，请稍后再试。'); setBusy(false); return; }
      if (response.status === 422) {
        const data = await response.json();
        setError(typeof data.detail === 'string' ? data.detail : '输入内容有误，请检查是否包含个人信息。');
        setBusy(false);
        return;
      }
      if (!response.ok) { setError('服务暂时不可用，请稍后再试。'); setBusy(false); return; }
      const data: ChatResponse = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setSuggestions(data.suggestions); setIsFinal(data.is_final_turn); setTurn(data.turn);
    } catch { setError('网络连接失败，请检查网络后重试。'); }
    finally { setBusy(false); }
  }
  sendMessageRef.current = sendMessage;

  function handleSend() { if (input.trim() && !isFinal) void sendMessage(input, messages); }
  function handleSuggestion(s: string) { if (!busy && !isFinal) void sendMessage(s, messages); }
  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }

  return (
    <div className="card animate-slide-up overflow-hidden shadow-[0_4px_24px_-8px_rgba(33,29,26,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-gradient-to-r from-paper to-brand-50/30 px-5 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-800"><span className="h-2 w-2 rounded-full bg-teal-500 pulse-dot" />临时探索对话</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400">{turn}/{MAX_TURNS} 轮</span>
          <button type="button" onClick={onClose} aria-label="关闭对话" className="flex h-7 w-7 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-700">✕</button>
        </div>
      </div>

      {/* Messages */}
      <div className="max-h-[400px] space-y-3 overflow-y-auto px-5 py-4" role="log" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'rounded-br-[5px] bg-brand-600 text-white shadow-[0_2px_8px_-2px_rgba(181,71,46,0.3)]'
                : 'rounded-bl-[5px] border border-line bg-surface text-ink-700 shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-[5px] border border-line bg-surface px-4 py-3 text-sm text-ink-400"><span className="inline-flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:0ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:150ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:300ms]" /></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && <p className="mx-5 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{error}</p>}

      {/* Suggestions */}
      {suggestions.length > 0 && !isFinal && !busy && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => handleSuggestion(s)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-600 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-700 hover:shadow-sm hover:-translate-y-px active:scale-[0.95]">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input or Final */}
      {isFinal ? (
        <div className="border-t border-line bg-paper px-5 py-4 text-center">
          <p className="text-sm text-ink-500">对话已结束。以上内容不会被保存，关闭页面即消失。</p>
          <button type="button" onClick={onClose} className="mt-3 rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800">返回</button>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t border-line px-5 py-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题…"
            maxLength={500}
            disabled={busy}
            aria-label="对话输入"
            className="field flex-1"
          />
          <button type="button" onClick={handleSend} disabled={busy || !input.trim()}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_2px_8px_-2px_rgba(181,71,46,0.4)] transition-all duration-200 hover:bg-brand-800 hover:shadow-[0_4px_12px_-2px_rgba(181,71,46,0.5)] hover:scale-105 active:scale-90 disabled:opacity-40 disabled:hover:scale-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      )}

      {/* Privacy note */}
      <p className="border-t border-line px-5 py-2.5 text-center text-[11px] text-ink-400">
        隐私：对话仅存浏览器内存，不上传原始文件，不保存任何内容。
      </p>
    </div>
  );
}

