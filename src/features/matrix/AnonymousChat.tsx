/**
 * 匿名多轮对话组件。
 * 对话历史仅存浏览器内存，关闭页面即消失。
 */
import { useState, useRef, useEffect } from 'react';
import { getRuntimeConfig } from '../../shared/api/client';
import type { StructuredEvent } from './MatrixLandingPage';

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
  const sendMessageRef = useRef<(text: string, history: ChatMessage[]) => Promise<void>>();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化：发送第一条消息（仅一次）
  useEffect(() => {
    if (!initialized.current && initialQuestion && sendMessageRef.current) {
      initialized.current = true;
      void sendMessageRef.current(initialQuestion, []);
    }
  }, [initialQuestion]);

  async function sendMessage(text: string, history: ChatMessage[]) {
    if (!text.trim() || busy) return;

    setError('');
    setBusy(true);
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...history, userMsg];
    setMessages(newMessages);
    setInput('');

    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (!apiBase) {
      setError('尚未配置后端地址。');
      setBusy(false);
      return;
    }

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

      if (response.status === 429) {
        setError('请求过于频繁，请稍后再试。');
        setBusy(false);
        return;
      }

      if (response.status === 422) {
        const data = await response.json();
        setError(data.detail || '输入内容有误，请检查是否包含个人信息。');
        setBusy(false);
        return;
      }

      if (!response.ok) {
        setError('服务暂时不可用，请稍后再试。');
        setBusy(false);
        return;
      }

      const data: ChatResponse = await response.json();
      const assistantMsg: ChatMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);
      setSuggestions(data.suggestions);
      setIsFinal(data.is_final_turn);
      setTurn(data.turn);
    } catch {
      setError('网络连接失败，请检查网络后重试。');
    } finally {
      setBusy(false);
    }
  }
  // 保持 ref 最新，供初始化 useEffect 调用
  sendMessageRef.current = sendMessage;

  function handleSend() {
    if (input.trim() && !isFinal) {
      void sendMessage(input, messages);
    }
  }

  function handleSuggestion(s: string) {
    if (!busy && !isFinal) {
      void sendMessage(s, messages);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>临时探索对话</span>
        <span className="chat-turn">{turn}/{MAX_TURNS} 轮</span>
        <button type="button" onClick={onClose} aria-label="关闭对话">✕</button>
      </div>

      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
        {busy && (
          <div className="chat-bubble assistant thinking">
            <p>正在思考…</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="chat-error" role="alert">{error}</p>}

      {suggestions.length > 0 && !isFinal && !busy && (
        <div className="chat-suggestions">
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => handleSuggestion(s)}>{s}</button>
          ))}
        </div>
      )}

      {isFinal ? (
        <div className="chat-final">
          <p>对话已结束。以上内容不会被保存，关闭页面即消失。</p>
          <button type="button" onClick={onClose}>返回</button>
        </div>
      ) : (
        <div className="chat-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题…"
            maxLength={500}
            disabled={busy}
            aria-label="对话输入"
          />
          <button type="button" onClick={handleSend} disabled={busy || !input.trim()}>
            发送
          </button>
        </div>
      )}

      <p className="chat-privacy">
        隐私：对话仅存浏览器内存，不上传原始文件，不保存任何内容。
      </p>
    </div>
  );
}
