# Research Sources

本框架于 2026-07-17 使用 AnySearch 检索并交叉核对以下一手资料。

1. [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents): initializer、结构化清单、增量推进、会话恢复和干净结束状态。
2. [OpenAI: Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md): `AGENTS.md` 分层加载，适合仓库规则、命令和 Definition of Done。
3. [Git: git-worktree](https://git-scm.com/docs/git-worktree): 多分支独立工作目录和生命周期管理。
4. [LangChain: Subagents](https://docs.langchain.com/oss/python/langchain/multi-agent/subagents): 中央 supervisor、临时 subagent、上下文隔离和结构化输出。
5. [LangChain: Handoffs](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs): 交接由显式持久状态驱动。
6. [Obsidian: Syncing for teams](https://help.obsidian.md/Teams/Syncing+for+teams): Vault 是纯文本 `.md`，但不提供同文件实时协同编辑。
7. [GitHub: About protected branches](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): PR review、status checks、线性历史与分支保护。
8. [GitHub: Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets): 更新、删除、提交和部署门禁。
9. [Martin Fowler: Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html): 复杂工作先对齐设计，避免实现隐藏架构决定。

## 从基线 Harness 保留

- 结构化任务状态、会话恢复、小步实现、可执行验收、验证和 Git 历史。

## 针对多 Agent 修改

- 共享 `progress.txt` 改为每会话独立 Run。
- `passes: boolean` 改为带门禁的状态机。
- 增加 owner、lease、branch、worktree 和风险等级。
- 实现后增加独立 Review 和 Verification。
- 直接 push 主分支改为任务分支、PR 和 Owner 合并。

