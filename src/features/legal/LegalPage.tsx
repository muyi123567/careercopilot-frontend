import { Link } from 'react-router-dom';

export function LegalPage({ type }: { type: 'terms' | 'privacy' }) {
  const isTerms = type === 'terms';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,85,59,0.06),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-brand-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          返回登录
        </Link>

        <div className="rounded-2xl border border-line bg-white/85 p-8 shadow-[0_4px_24px_-8px_rgba(33,29,26,0.08)] backdrop-blur-sm sm:p-12">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                {isTerms ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></> : <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>}
              </svg>
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{isTerms ? '用户协议' : '隐私政策'}</h1>
              <p className="text-xs text-ink-400">最后更新：2026 年 7 月 28 日</p>
            </div>
          </div>

          {isTerms ? (
            <div className="space-y-6 text-sm leading-relaxed text-ink-600">
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">1. 服务说明</h2><p>CareerCopilot 是一款证据优先的职业导航工具，通过结构化推演帮助用户理解职业路径。本服务不构成职业建议、就业担保或任何形式的承诺。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">2. 使用条件</h2><p>使用本服务即表示你同意：(a) 提供真实、准确的个人信息；(b) 不将推演结果作为唯一决策依据；(c) 理解所有推演均基于有限数据，存在不确定性。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">3. 匿名使用</h2><p>你可以无需注册即可使用核心推演功能。匿名会话数据仅存在于浏览器内存中，关闭页面后即消失。我们不会追踪匿名用户的身份。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">4. 注册账户</h2><p>注册账户后，你可以保存推演历史、创建行动计划、设置检查点提醒。账户数据加密存储，你可以随时导出或删除。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">5. 免责声明</h2><p>所有推演结果均标注数据来源和不确定性等级。我们明确标注「Unknown」状态，绝不伪造确定性。市场数据存在滞后性，不保证实时准确。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">6. 协议变更</h2><p>我们可能更新本协议。重大变更将通过应用内通知告知你。继续使用即表示接受更新后的协议。</p></section>
            </div>
          ) : (
            <div className="space-y-6 text-sm leading-relaxed text-ink-600">
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">1. 数据收集原则</h2><p>我们遵循「最小必要」原则。原始简历文件始终在你的浏览器本地解析，绝不上传到服务器。仅在你明确授权后，经筛选的结构化信号才会被发送。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">2. 匿名会话</h2><p>匿名推演不创建任何持久化数据。对话历史、推演结果仅存在于浏览器内存中。关闭标签页后，所有数据立即消失。我们不使用 Cookie 追踪匿名用户。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">3. 注册数据</h2><p>注册后我们存储：邮箱地址（用于登录）、推演历史、行动计划、检查点记录。所有数据加密存储（AES-256），传输使用 TLS 1.3。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">4. 你的权利</h2><p>你可以随时：(a) 导出所有个人数据（JSON 格式）；(b) 删除单条或全部数据；(c) 注销账户（永久删除，不可恢复）；(d) 撤回已授予的同意。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">5. 数据保留</h2><p>匿名会话：零保留。注册账户：数据保留至你主动删除或注销。我们不会将你的数据出售、出租或分享给第三方用于营销目的。</p></section>
              <section><h2 className="mb-2 text-base font-semibold text-ink-800">6. 安全措施</h2><p>JWT 令牌 2 小时过期、PBKDF2-SHA256 密码哈希（100,000 次迭代）、传输层 TLS 1.3、存储层 AES-256 加密。生产环境密钥通过 KMS 管理。</p></section>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">CareerCopilot · 证据优先 · 不展示未经校准的成功率</p>
      </div>
    </div>
  );
}
