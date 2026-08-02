import { useNavigate } from 'react-router-dom';
import { AnonymousChat } from '../console/AnonymousChat';

export function AssistantPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">导航问答</h1>
        <p className="mt-1 text-sm text-ink-500">围绕你的档案和证据进行受控问答，对话不留存</p>
      </section>
      <div className="rounded-xl border border-line bg-surface">
        <AnonymousChat
          events={[]}
          initialQuestion="你好，我想聊聊我的职业方向"
          onClose={() => navigate('/app')}
        />
      </div>
    </div>
  );
}
