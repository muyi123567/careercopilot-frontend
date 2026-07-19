# CareerCopilot Migration

目标仓库：`muyi123567/careercopilot-backend`

## Phase 0: 安全处理

此前 Git remote URL 曾包含个人访问令牌。开始迁移前：

1. 在 GitHub 立即撤销并轮换该令牌。
2. 将 remote 改为不含凭证的 URL：

```powershell
git remote set-url origin https://github.com/muyi123567/careercopilot-backend.git
```

3. 使用 Git Credential Manager 或 `gh auth login` 保存认证。
4. 检查 Git 历史、日志和配置中是否仍有令牌，不要把令牌写入 Vault。

## Phase 1: 代码仓库

将本包中的 `AGENTS.md` 放到后端仓库根目录，并根据现有 FastAPI、Alembic、tests 结构填写：Python 安装、FastAPI 启动、快速/全量测试、lint、format、typecheck、Alembic revision 和迁移验证命令。

仓库只保存代码专属规则和可执行检查。产品 Spec、任务和 ADR 留在 Vault。

## Phase 2: Vault 项目

1. 从 `_templates/Project.md` 创建 `01_Projects/CareerCopilot.md`。
2. 建立当前版本 Spec，明确目标用户、范围、API 行为和验收。
3. 把待办转换为独立任务，每个使用 `CC-###` ID。
4. 先设为 `backlog`，信息完整后再进入 `ready`。
5. 认证、数据库模型、迁移和外部服务变更设为 L2 或 L3。

## Phase 3: GitHub 门禁

对 `master` 设置 Require pull request、required status checks、conversation resolution、禁止 force push/删除，并优先 squash merge。若私人仓套餐不支持某项规则，用 Owner 手动门禁代替，但保留 PR、Review 和 CI 证据。

## Phase 4: 第一个试运行任务

选择一个 1 到 2 小时可完成的 L1 真实任务：Planner 补齐 Spec/Task，Owner 改为 `ready`，Builder 创建 `agent/CC-001-<slug>` worktree，完成后提交 `review`，新 Reviewer 会话复查，Owner 合并并改为 `done`，最后清理 worktree。

先稳定单 Builder 流程，再扩到 2 到 3 个并行 Builder。

