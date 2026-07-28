import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../shared/auth/session';
import { useNavigation } from '../../shared/state/navigation';
import { Button } from '../../shared/components/ui/Button';
import type { MockScenario, AccessMode } from '../../shared/api/client';

function occupationId(name: string): string {
  return `input:${name.trim().toLowerCase().replace(/\s+/g, '-')}`;
}

const REGIONS = ['全国', '一线', '新一线', '华东', '华南', '华北', '西部'];
const EXPERIENCE = ['0-3年', '3-8年', '8年以上'];

export function HomePage() {
  const navigate = useNavigate();
  const { mode, setMode, token, setToken, mockScenario, setMockScenario } = useAuth();
  const { submit, phase } = useNavigation();

  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const [region, setRegion] = useState('全国');
  const [experience, setExperience] = useState('0-3年');

  const busy = phase === 'loading';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current.trim()) return;
    await submit(
      {
        current_occupation: { occupation_id: occupationId(current), name: current.trim() },
        target_occupation: target.trim()
          ? { occupation_id: occupationId(target), name: target.trim() }
          : null,
        region,
        experience_level: experience,
      },
      { mockScenario },
    );
    navigate('/map');
  }

  return (
    <div className="stagger space-y-6">
      <section className="card animate-slide-up p-6 sm:p-8">
        <p className="eyebrow">职业导航 · 证据优先</p>
        <h1 className="display mt-2 text-2xl font-semibold sm:text-3xl">
          先看清证据，再谈转行
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
          输入当前职业，系统会基于可核验的来源给出三类候选路径，并明示不确定性与数据缺口——不展示任何未经校准的“成功率”。
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="eyebrow shrink-0" htmlFor="mode">
            访问模式
          </label>
          <select
            id="mode"
            className="field w-auto"
            value={mode}
            onChange={(e) => setMode(e.target.value as AccessMode)}
          >
            <option value="demo">只读演示</option>
            <option value="authenticated">已登录用户</option>
          </select>
          {mode === 'authenticated' && (
            <input
              id="token"
              type="password"
              autoComplete="off"
              placeholder="短期 Bearer Token（仅存于本页内存）"
              className="field flex-1"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          )}
        </div>
        {mode === 'demo' && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-500">演示状态：</span>
            {(
              [
                ['ok', '证据就绪'],
                ['data_insufficient', '数据不足'],
                ['service_failure', '服务失败'],
              ] as [MockScenario, string][]
            ).map(([s, label]) => (
              <button
                key={s}
                type="button"
                onClick={() => setMockScenario(s)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
                  mockScenario === s
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-line text-ink-500 hover:border-ink-900/20'
                }`}
              >
                {label}
              </button>
            ))}
            <span className="text-xs text-ink-400">（演示如何呈现一等状态，不伪造成功率）</span>
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="card animate-slide-up space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="current" className="mb-2 block text-sm font-medium">
              当前职业或专业方向 <span className="text-red-500">*</span>
            </label>
            <input
              id="current"
              required
              className="field"
              placeholder="例如：土地资源管理"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="target" className="mb-2 block text-sm font-medium">
              想了解的目标职业（可选）
            </label>
            <input
              id="target"
              className="field"
              placeholder="例如：产品经理"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="region" className="mb-2 block text-sm font-medium">
              地域
            </label>
            <select
              id="region"
              className="field"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="mb-2 block text-sm font-medium">
              经验阶段
            </label>
            <select
              id="experience"
              className="field"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              {EXPERIENCE.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={busy || !current.trim()} className="w-full">
          {busy ? '读取中...' : '查看职业路径证据'}
        </Button>
      </form>
    </div>
  );
}
