import { useNavigate } from 'react-router';
import { AnonymousChat } from '../console/AnonymousChat';

const CAPABILITIES = [
  {
    title: '基于证据回答',
    desc: '围绕你的技能、经历与职业目标，不编造确定性。',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    title: '对话不留存',
    desc: '历史仅存浏览器内存，关闭页面即消失，不上传原始文件。',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2h-5l-5 5v-5z',
  },
  {
    title: '推荐下一步',
    desc: '把大问题拆成小实验，给你的路径规划一个可验证的起点。',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

export function AssistantPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">导航问答</h1>
        <p className="mt-1 text-sm text-ink-500">围绕你的档案和证据进行受控问答，对话不留存</p>
      </section>

      {/* Capability guide */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CAPABILITIES.map((cap) => (
          <div key={cap.title} className="rounded-xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-brand-600" aria-hidden="true">
                <path d={cap.icon} />
              </svg>
            </span>
            <p className="mt-2.5 text-sm font-semibold text-ink-800">{cap.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{cap.desc}</p>
          </div>
        ))}
      </div>

      <AnonymousChat
        events={[]}
        initialQuestion="你好，我想聊聊我的职业方向"
        onClose={() => navigate('/app')}
      />
    </div>
  );
}
