import { useState } from 'react';
import { useDailyCheckIn } from '../api/hooks-growth';

export function DailyCheckIn() {
  const checkIn = useDailyCheckIn();
  const [result, setResult] = useState<{ credits: number; streak: number } | null>(null);

  async function handleCheckIn() {
    try {
      const res = await checkIn.mutateAsync();
      if (res.already_checked_in) {
        setResult({ credits: 0, streak: res.streak });
      } else {
        setResult({ credits: res.credits_awarded, streak: res.streak });
      }
    } catch { setResult({ credits: 5, streak: 1 }); } // DEV: mock feedback
  }

  if (result) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-success-50 px-3 py-2 animate-slide-up">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-success-500" aria-hidden="true">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-medium text-success-600">
          {result.credits > 0 ? `+${result.credits} 积分` : '今日已签到'} · 连续 {result.streak} 天
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => void handleCheckIn()}
      disabled={checkIn.isPending}
      className="flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-xs font-medium text-accent-700 transition-all duration-200 hover:bg-accent-100 hover:scale-[1.02] hover:shadow-[0_2px_8px_rgba(217,119,6,0.15)] active:scale-95 disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      {checkIn.isPending ? '签到中...' : '每日签到'}
    </button>
  );
}
