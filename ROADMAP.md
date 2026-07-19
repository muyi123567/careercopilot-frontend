# CareerCopilot 开发路线图（带负责人标记 / Ownership View）

> 主理人：齐活林（Delivery Director / Lead）｜日期：2026-07-20
> 用途：交其他 Agent 执行的派发视图。每阶段已标注「负责 Agent」与「00_AgentOS 角色」。
> 白话：百炼=阿里云跑 AI 应用的平台；FC=函数计算（云上跑代码）；PG/pgvector=PostgreSQL+向量插件（存/搜"记忆/语义"）；OPC=约 8/10-15 的提交节点；/process=后端给百炼调的统一接口。

---

## 角色映射（RACI 基线）

| 00_AgentOS 角色 | 本团队对应 | 在本路线图中的职责 |
|---|---|---|
| Owner（你，黄海桓） | 你 | 优先级、架构批准、合并、发布、密钥、破坏性操作、两矛盾拍板 |
| Lead（主理人） | 齐活林 | 协调、中转、合稿、派发任务、跟踪 handoff |
| Planner | 许清楚（PM）/ 高见远（架构师） | 需求→Spec/ADR、任务拆分与依赖、接口契约 |
| Builder | 寇豆码（工程师） | 实现已认领的 `ready` 任务，独立分支/worktree |
| Reviewer / Verifier | 严过关（QA） | 独立审查、测试复跑；高风险任务升 Verifier |

> 风险等级（§12）：L0 文档 / L1 局部功能 / L2 API合约·认证·数据迁移·依赖升级 / L3 生产发布·密钥·权限·删数据。代码类必须 PR+squash，禁直推默认分支；评估类(B类)只出 .md 直推 master。

---

## 现状速览（真实进度）

| 层 | 状态 | 说明 |
|---|---|---|
| 战略（v4） | 🟢 冻结 | 单推演引擎 + 记忆贯通（证据+置信区间）；部署=阿里百炼高代码（方案Y，冻结） |
| 后端代码 | 🟡 骨架成型 | 本地 SQLite+MockLLM 下 14/14 e2e + 13 单测全绿；P0-1/2/3 + P1-2 已合 |
| 真实环境 | 🔴 零验证 | 没跑过真 Qwen + 真 RDS PG+pgvector（Gate 1 未做） |
| 前端 | 🔴 空壳 | `src/` 空、无 package.json，仅 1 个 H5 骨架，未联调 |
| Git 卫生 | 🟡 待收 | 后端 master 领先 origin 9 commit 未推；已合 feature 分支未清理 |

**端到端完成度约 50–55%。**

---

## 三个卡点（按风险排序）

| # | 卡点 | 负责 Agent（角色） | 风险 | 处理方式 |
|---|---|---|---|---|
| 1 | 真实环境零验证（Gate 1） | 寇豆码(Builder) + 严过关(Reviewer) | L2 | 纳入 Phase 1 首要动作 |
| 2 | `/process` 身份模型与百炼契约错位 | 高见远(架构师/Planner) 定契约 + 寇豆码(Builder) 实现 | L2 | 先于 Phase 2 部署完成 |
| 3 | 两处矛盾（部署 FC vs ECS；embedding v4 vs v3+1024） | **Owner(你) 拍板** + 齐活林(Lead) 整理决策清单 | L3 决策 | Phase 0 必须关闭 |

---

## 路线图（按 ~25 天倒排到 OPC）

### Phase 0 — 决策冻结（1–2 天）
- **目标**：关闭卡点 3，冻结技术方案。
- **负责 Agent**：**Owner（你）拍板** + 齐活林（Lead）整理成一页决策清单（ADR 候选）。
- **00_AgentOS 角色**：Owner（不可委托的架构批准权）。
- **风险**：L3（决策本身），产出文档 L0。
- **关键动作**：①定部署=FC（百炼高代码）；②定 embedding=`text-embedding-v3` + `EMBED_DIM=1024`；③更新 README/AGENTS 对齐两矛盾。
- **交付物**：`决策冻结 v1.md`（ADR，B类直推 master）。
- **依赖**：无（最先做）。

### Phase 1 — Gate 1 真实环境（3–5 天，最高优先级）
- **目标**：用真 Qwen + 真 RDS PG+pgvector 跑通 14/14 e2e，消除"零验证"风险。
- **负责 Agent**：寇豆码（Builder）+ 严过关（Reviewer/Verifier）。
- **00_AgentOS 角色**：Builder 实现 + Reviewer 独立复跑（真实环境=数据迁移/L2，需 Verifier 复验）。
- **风险**：L2（真实 DB / API 合约 / 密钥）。
- **关键动作**：实名+开百炼拿 `DASHSCOPE_API_KEY`；开 RDS PG+pgvector，`alembic upgrade head`；改 `/process` 身份模型对齐百炼契约（卡点 2，与高见远对齐）；替换 MockLLM/SQLite 跑真环境绿测；钉死 embedding 维度。
- **交付物**：真实环境绿测报告 + 可复现启动命令；任务分支 `agent/phase1-gate1-realenv` → PR。
- **依赖**：Phase 0 完成（尤其 embedding 维度）。

### Phase 2 — 百炼 FC 部署（3–5 天）
- **目标**：后端上线百炼高代码 FC，云端 `/health`+`/process` 可用。
- **负责 Agent**：寇豆码（Builder）+ **Owner（Verifier，生产发布 L3）**。
- **00_AgentOS 角色**：Builder 实现 + Owner 作为 Verifier 批准发布。
- **风险**：L3（生产发布、密钥、权限）。
- **关键动作**：收尾 `feat/fc-deploy-config` → PR → merge；打包/部署 FC；联调 `/health`+`/process`；接真 KMS/RAM（P1-2 已合需接真）；开 SLS 日志。
- **交付物**：云端可访问 `/process` 端点；PR + 发布记录。
- **依赖**：Phase 1（真环境跑通）+ 卡点 2 关闭。

### Phase 3 — 前端 Hero-shot 联调（5–7 天，差异化卖点）
- **目标**：实现前端 `src/`，调 /process 渲染三维置信度柱状图 + 证据 + 风险 + 建议，ESA Pages 部署。
- **负责 Agent**：寇豆码（Builder，前端）+ 高见远（架构师，接口对齐）+ 严过关（Reviewer）。
- **00_AgentOS 角色**：Builder 实现 + Planner 提供接口契约 + Reviewer 审查。
- **风险**：L1–L2（UI + API 对接）。
- **关键动作**：实现 `src/`；`API_BASE` 先联 dev 后端、再切 FC；ESA Pages 部署；Hero-shot 演示 E2E 跑通。
- **交付物**：可演示 Hero-shot 流程；任务分支 `agent/phase3-heroshot-ui` → PR。
- **依赖**：可与 Phase 1 后半段并行（前端先用 mock /process 联调 UI）。Phase 2 完成后切真 FC。

### Phase 4 — 记忆贯通 M1 真验（2–3 天）
- **目标**：真实 PG 下验证记忆读写 + NER 脱敏 + 跨阶段 `stage` 标签 + L1–L3 检索。
- **负责 Agent**：寇豆码（Builder）+ 严过关（Reviewer）。
- **00_AgentOS 角色**：Builder + Reviewer。
- **风险**：L1–L2（数据层）。
- **关键动作**：真实 PG 下记忆 CRUD 与脱敏验证；检索精度验证。
- **交付物**：记忆贯通演示（v4 差异化锚点证据）；PR。
- **依赖**：Phase 1（真 PG 可用）。

### Phase 5 — OPC 提交 + 生产加固（赛前）
- **目标**：提交 OPC 冲 Token 补贴；清理与加固。
- **负责 Agent**：**Owner（提交）** + 寇豆码（加固 Builder）。
- **00_AgentOS 角色**：Owner 发布 + Builder 收尾。
- **风险**：L3（发布）。
- **关键动作**：提交 OPC；清理已合分支、补 README 部署章节、更新 `static/demo.html`。
- **交付物**：可演示 + 可提交状态。
- **依赖**：Phase 2–4。

---

## 跨切面对策（负责人）

| 事项 | 负责 Agent | 说明 |
|---|---|---|
| Git 卫生 | 寇豆码（Builder） | 推后端 master(ahead 9)；清理已合 `agent/p0*`/`p1*` 分支；`feat/fc-deploy-config` 走 PR。遵守 §18 禁直推。 |
| 测试补强 | 严过关（QA）+ 寇豆码 | 加真环境冒烟、前端联调、NER/脱敏单测。当前 14/14 e2e 仅 dev 假环境。 |
| N=1 风险 | **Owner（你）** | OPC 前拉 1–2 个真实用户跑推演，留"记忆跨会话生效"截图证据。 |

---

## 经验视角最关键 3 条
1. **Gate 1（真环境验证）提前到第一顺位**，别等前端做完才碰真 Qwen/PG。
2. **前端别留最后**——Hero-shot 是 OPC 胜负手，`src/` 还空；Phase 1 后半段用 mock /process 并行联调。
3. **两矛盾现在拍板**（尤其 embedding 维度灌数据前钉死 1024），否则向量表建错整库重建。

---

## 派发说明（给其他 Agent）
- 本路线图已落入 B仓（careercopilot-frontend）`ROADMAP.md`；共享基层在 `00_AgentOS/`（读 `00_AgentOS/AGENTS.md` + `OPC-Agent-Operating-System.md` §18）。
- 认领任务：从某 Phase 拆出 `ready` 任务 → 建 `agent/<task-id>-<slug>` 分支 + worktree → 实现 → 测试证据 → PR（代码类严格 PR）。
- 评估/文档类（B类）：只出 .md，直推 master，不提 PR。
- 冲突/不可逆决策：stop 并建 blocker / ADR，交 Owner 拍板。
