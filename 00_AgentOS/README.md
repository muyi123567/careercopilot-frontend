# Obsidian Agent OS

面向独立开发者和 OPC 团队的 Obsidian-first 多 Agent 协作框架。

## 从这里开始

1. 阅读 `OPC-Agent-Operating-System.md`。
2. 将 `vault/` 作为新 Obsidian Vault，或合并到现有 Vault。
3. 将 `AGENTS.md` 放到每个代码仓库根目录，并替换其中的项目命令。
4. 从 Vault 的 `_templates/` 创建第一个项目、Spec 和任务。
5. 每个编码任务使用独立 branch 和 worktree。
6. 用 `scripts/session-check.ps1` 恢复会话上下文。
7. 用 `Agent-Launch-Prompts.md` 启动不同职责的 Agent 会话。

## 核心原则

- 人是唯一的产品负责人、架构批准人和发布批准人。
- Agent 是临时角色，不是长期拥有项目方向的成员。
- 一个任务、一个负责人、一个分支、一个 worktree、一个交付物。
- 规划、实现、审查分离；实现者不能批准自己的任务。
- 所有“完成”都必须附带可复现的验证证据。
- 不让多个 Agent 同时编辑同一个日志或任务文件。

## 目录

- `OPC-Agent-Operating-System.md`: 完整运行手册
- `AGENTS.md`: 代码仓库的 Agent 行为契约
- `vault/`: 可直接使用的 Obsidian Vault 骨架
- `schemas/task.schema.json`: 任务属性的机器校验模型
- `scripts/session-check.ps1`: 会话启动与状态检查
- `Agent-Launch-Prompts.md`: Planner、Builder、Reviewer、Verifier 启动提示词
- `CareerCopilot-Migration.md`: CareerCopilot 的迁移步骤
- `Research-Sources.md`: AnySearch 调研依据
