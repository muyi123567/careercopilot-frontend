import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';

interface CommandItem {
  label: string;
  to: string;
  group: string;
}

const COMMANDS: CommandItem[] = [
  { label: '工作台', to: '/app', group: '页面' },
  { label: '职业地图', to: '/app/career-map', group: '页面' },
  { label: '证据台账', to: '/app/profile/evidence', group: '页面' },
  { label: '行动实验', to: '/app/actions', group: '页面' },
  { label: '决策记录', to: '/app/decisions', group: '页面' },
  { label: '市场雷达', to: '/app/radar', group: '页面' },
  { label: '导航问答', to: '/app/assistant', group: '页面' },
  { label: '记忆管理', to: '/app/memory', group: '页面' },
  { label: '路径分析', to: '/app/paths/new', group: '页面' },
  { label: '文档管理', to: '/app/documents', group: '管理' },
  { label: '我的档案', to: '/app/profile', group: '管理' },
  { label: '积分记录', to: '/app/credits/history', group: '管理' },
  { label: '订阅管理', to: '/app/subscription', group: '管理' },
  { label: '设置', to: '/app/settings', group: '管理' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [query]);

  function handleSelect(item: CommandItem) {
    navigate(item.to);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) { handleSelect(filtered[selected]); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true" aria-label="快速导航">
      <div className="absolute inset-0 bg-scrim" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-xl border border-line bg-surface shadow-lift">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-ink-400" aria-hidden="true">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="搜索页面..."
            className="flex-1 bg-transparent text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-400">ESC</kbd>
        </div>
        <ul className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-4 text-center text-sm text-ink-400">无匹配结果</li>}
          {filtered.map((item, i) => (
            <li key={item.to}>
              <button
                onClick={() => handleSelect(item)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${i === selected ? 'bg-accent-50 text-accent-700' : 'text-ink-700 hover:bg-ink-50/40'}`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-ink-400">{item.group}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
