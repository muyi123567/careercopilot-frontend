# CareerCopilot V2 全阿里云部署与前端构建方案（终版 v2）

## 一、现状摘要

| 仓库 | 当前状态 | 就绪度 |
|------|---------|--------|
| **A 仓 (后端)** | 17 个 API 端点（16 个完整实现），FastAPI + SQLAlchemy + pgvector，Docker 化，JWT 认证，DashScope LLM 编排 | **高** — V2 导航端点为桩，缺少用户注册/OAuth，仅 dev/prod 双模式 |
| **B 仓 (治理)** | V2 规范完备，25 功能清单，API Schema 冻结，ADR 已决策，商业化路线清晰 | **完备** — Phase 0 (F00-F03) 已通过 |
| **C 仓 (前端)** | 349 行静态 HTML 原型，无构建系统/TypeScript/框架，契约体系成熟 | **低** — 需从零搭建 SPA |

**关键约束**（B 仓 AGENTS.md 硬性规则）：
- 跨仓变更顺序：B 冻结语义 → A 实现 → C 消费，不可逆序
- 禁止 force push、直接改默认分支
- 前端只消费版本化 JSON Schema，不解析 LLM 文本
- 引入构建系统的 PR 必须同时补充锁文件 + install/build/test/lint/typecheck + CI
- **V2 §9.4**：API 响应校验必须用 AJV（JSON Schema 2020-12），不另建 Zod 语义
- **V2 §8.3**：必须三环境（dev / staging / prod），staging 与 prod 不同凭据不同数据
- **V2 §5.2**：Demo 是产品模式（mode=demo / mode=real），不是环境 — 任何环境都需同时支持两种模式

## 二、推荐技术架构（全阿里云，零成本启动）

```
用户浏览器
    |
    v
[阿里云 ESA Pages] ─── 前端 SPA 托管（永久免费）
  - Vite + React 19 + TypeScript
  - Tailwind CSS v4 + shadcn/ui
  - Git 自动构建部署
    |
    | API 请求
    v
[阿里云 SAE 2.0 轻量版] ─── 后端容器（缩容到0，3个月免费）
  - FastAPI Docker 镜像（阿里云 ACR 免费镜像仓库）
  - 三环境隔离：dev / staging / prod
    |
    v
[阿里云 RDS PostgreSQL Serverless] ─── 数据库 + Supabase 平台层
  - 三套独立数据库实例（dev/staging/prod 不同数据、不同凭据）
  - Supabase 平台免费（Dashboard / Auto REST / GoTrue Auth / Realtime / Storage）
  - pgvector 原生支持
    |
    v
[DashScope API] ─── LLM 服务（按量 + 免费额度）
  - qwen-plus（对话）
  - text-embedding-v3（嵌入）
```

### 三环境架构（V2 §8.3 强制要求）

| 环境 | 数据 | 凭据 | 用途 | 阿里云配置 |
|------|------|------|------|-----------|
| **dev** | 本地合成/SQLite 或本地 PostgreSQL | 开发默认 | 本地开发调试 | 本地 Docker Compose |
| **staging** | 独立匿名/合成数据、独立 RDS | 独立凭据（与 prod 完全不同） | 集成测试、Alpha 验证 | 独立 RDS Serverless 实例 + SAE 独立应用 |
| **prod** | 经授权真实数据 | 生产凭据 | 面向真实用户 | 独立 RDS Serverless 实例 + SAE 独立应用 |

**Demo 是产品模式，不是环境**（V2 §5.1 明确定义）：
- 任何环境（dev/staging/prod）都同时支持 `mode=demo` 和 `mode=real`
- `mode=demo`：不分配 uid，响应含 `mode=demo` + `data_scope=synthetic_read_only`，只读独立合成数据集
- `mode=real`：JWT 认证，访问用户真实数据
- 前端 UI 提供模式切换入口，两种模式共存

### 成本估算

| 阶段 | 月成本 | 说明 |
|------|--------|------|
| **前 3 个月（开发期）** | **0 元** | RDS Serverless 免费 + SAE 免费额度 + ESA 免费 + DashScope 免费额度 |
| **3-6 个月（Alpha/staging 期）** | **55-100 元** | SAE 缩容到0(5-30) + RDS Serverless 5折(30-60) + DashScope(10-20) |
| **6 个月+（prod 公测期）** | **150-300 元** | 需 staging + prod 两套环境，成本翻倍 |

### 开源程度评估

| 层级 | 开源协议 | 厂商锁定 |
|------|---------|---------|
| 代码层（FastAPI/React/Vite/Tailwind/shadcn/ui/Supabase） | 全部 MIT/Apache 2.0 | **零锁定** |
| 数据库层（PostgreSQL + pgvector） | PostgreSQL License + Apache 2.0 | **零锁定** |
| BaaS 层（Supabase） | Apache 2.0，可自托管 | **极低** |
| 基础设施层（阿里云 RDS/SAE/ESA） | 闭源云服务，遵循开放标准 | **低** |
| LLM 层（DashScope） | 闭源 API，OpenAI 兼容接口 | **中低**（A 仓已有 provider 抽象层） |

## 三、开源 AI 工具 / BaaS 评估结论

### AI 平台（全部不推荐替代核心后端）

| 工具 | 评分 | 结论 |
|------|------|------|
| Coze（扣子） | 2/5 | 绑定字节生态，不能替代后端 |
| Dify | 3/5 | 增加架构复杂度，单人开发者 ROI 低 |
| FastGPT | 3/5 | F10 职业词典开发时可评估 |
| RAGFlow | 2/5 | 文档解析能力过剩 |
| Flowise/LangFlow | 1-2/5 | 原型工具，生产级不足 |

### BaaS

| 方案 | 评分 | 结论 |
|------|------|------|
| **阿里云 RDS Supabase（推荐）** | **5/5** | 官方托管，平台免费，pgvector 原生，2-3 天迁移 |
| Supabase 自部署 | 3/5 | 10+ 容器运维成本高 |
| Appwrite / Nhost / PocketBase | 1-2/5 | 不支持 PostgreSQL/pgvector |

## 四、前端技术栈选型

### 校验层分工（审查修正：V2 §9.4 合规）

| 层级 | 工具 | 职责 | V2 依据 |
|------|------|------|---------|
| **API 响应校验** | **AJV**（ajv-validator/ajv） | 加载 B 仓 canonical schema（career-navigation-v2.0.0.schema.json），运行时校验后端返回的 JSON | V2 §9.4 强制："JSON Schema 2020-12 运行时校验，不另建一套 Zod 语义" |
| **表单层校验** | **Zod** | React Hook Form 表单字段校验（职业输入、筛选条件等） | V2 未涉及表单层，Zod 是 React Hook Form 生态标准 |
| **API 类型生成** | **Orval** | 从 FastAPI OpenAPI spec 生成 TypeScript 类型 | — |

**AJV 和 Zod 不冲突**：AJV 守 API 契约边界（加载 B 仓 canonical schema），Zod 守表单输入边界（用户填写的数据）。两者分工明确。

### 完整技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| 构建 | **Vite** | V2 规范要求 |
| 框架 | **React 19 + TypeScript** | AI 编码工具训练数据最丰富 |
| 样式 | **Tailwind CSS v4 + shadcn/ui** | vibecoding/opencode/v0 默认生成 |
| API 响应校验 | **AJV** | V2 §9.4 强制，加载 canonical JSON Schema 2020-12 |
| 表单校验 | **Zod** | React Hook Form 生态 |
| 服务端状态 | **TanStack Query** | 缓存/重试/失效管理 |
| 客户端状态 | **Zustand** | 轻量 |
| 表单 | **React Hook Form** | — |
| API 契约 | **Orval** | 从 FastAPI OpenAPI spec 生成 TS 类型 |
| 图可视化 | **Cytoscape.js / AntV G6** | 职业关系网络图 |
| 图表 | **Recharts / ECharts** | 市场雷达 |
| PWA | **vite-plugin-pwa** | 离线/安装/推送 |
| 认证 | **Supabase GoTrue** | 替代自建注册/登录/OAuth |
| 部署 | **阿里云 ESA Pages** | 永久免费 + 国内加速 |

### v1→v2 API 适配策略（审查补充：V2 §5.2 合规）

A 仓当前有 v1 端点（/api/v1/...），V2 定义的是 /api/v2/ 格式（统一信封、cursor 分页、Idempotency-Key）。前端 `shared/api/` 按以下方式分层：

```
shared/api/
  ├── v1/                    # 当前可用的 v1 端点
  │   ├── generated/         # Orval 从 A 仓 OpenAPI spec 自动生成
  │   ├── client.ts          # v1 API 客户端
  │   └── hooks.ts           # v1 React Query Hooks
  ├── v2/                    # V2 端点（逐步迁移）
  │   ├── generated/         # Orval 从 V2 OpenAPI spec 自动生成
  │   ├── client.ts          # v2 API 客户端（统一信封、cursor 分页）
  │   ├── hooks.ts           # v2 React Query Hooks
  │   └── schema-validator.ts # AJV 运行时校验（加载 B 仓 canonical schema）
  ├── common/                # 版本无关的公共层
  │   ├── errors.ts          # 统一错误处理
  │   ├── types.ts           # 公共类型
  │   └── config.ts          # API 基地址、超时配置
  └── index.ts               # 统一导出
```

**核心原则**：
- 业务组件（features/）**不直接耦合 API 版本**，通过 hooks 层调用
- v1 端点逐步迁移到 v2，前端只需改 hook 调用，不改组件
- v2 响应必须经 AJV 校验，校验失败抛 `ContractViolationError`
- CI 中增加 schema hash 校验（与 B 仓 canonical SHA-256 比对）

## 五、X/Twitter 数据接入方案

| 方案 | 可行性 | 说明 |
|------|--------|------|
| X API 按量付费 | **不推荐** | $0.005/条，1000用户约$500，中文覆盖差 |
| **用户上传 Twitter Archive（推荐）** | **推荐** | 免费，合规，作为 F20 证据账本个人证据来源 |
| ESCO/O*NET 开放标准 | **推荐** | F10 职业词典主数据源，免费权威 |

## 六、执行计划

### Phase 0：基础设施准备（利用免费额度，三环境并行）

| 步骤 | 任务 | 耗时 | 免费资源 |
|------|------|------|---------|
| 0.1 | 注册/准备域名 | 1 天 | — |
| 0.2 | 提交 ICP 备案（与开发并行） | 2-4 周 | 免费 |
| 0.3 | **领取** SAE 免费额度（4320000 CU，3个月） | 30 分钟 | 免费 |
| 0.4 | **领取** RDS PostgreSQL Serverless 免费试用（3个月） | 1 小时 | 免费 |
| 0.5 | 在 RDS Serverless 上开通 Supabase 平台层 | 30 分钟 | 平台免费 |
| 0.6 | 开通 ESA Pages 免费版 + ACR 容器镜像服务 | 1 小时 | 永久免费 |
| 0.7 | 构建 A 仓 Docker 镜像 → ACR → SAE 部署（dev 环境） | 2 小时 | — |
| 0.8 | 数据库迁移 + 验证端点可用 | 1 小时 | — |
| 0.9 | 搭建 staging 环境（独立 RDS 实例 + 独立 SAE 应用 + 合成数据） | 2 小时 | 免费期内 |

### Phase 1：C 仓前端从零搭建（F00/F01 门禁）

| 步骤 | 任务 | 依赖 |
|------|------|------|
| 1.1 | C 仓初始化 Vite + React 19 + TypeScript | 无 |
| 1.2 | 配置 Tailwind CSS v4 + shadcn/ui | 1.1 |
| 1.3 | 配置 Orval + AJV（加载 B 仓 canonical schema） | 1.1 |
| 1.4 | 配置 Supabase JS SDK + GoTrue Auth | 1.1 |
| 1.5 | 搭建 shared/api/ 分层结构（v1/ + v2/ + common/） | 1.3 |
| 1.6 | 实现 8 路由骨架 + Demo/Real 模式切换 | 1.2 |
| 1.7 | 实现 shared/auth 层（GoTrue 登录/注册、路由守卫、Demo 模式） | 1.4 |
| 1.8 | 实现 B 仓定义的 9 个可信组件 | 1.2 |
| 1.9 | 配置 vite-plugin-pwa + CI | 1.1 |
| 1.10 | 对接 A 仓端点，验证端到端（dev + staging） | 0.8, 0.9, 1.7 |
| 1.11 | F00 门禁：两用户并发无串线、Demo 不分配 uid、**mode=demo 和 mode=real 共存** | 1.10 |
| 1.12 | F01 门禁：后端故障显错误不伪 Demo、**AJV Schema 校验生效** | 1.10 |
| 1.13 | ESA Pages 部署 + 首次发布 | 1.9 |

### Phase 2：核心功能开发（F10-F23）

| 步骤 | 任务 | 对应功能 |
|------|------|---------|
| 2.1 | A 仓实现 F10（职业词典，优先 ESCO/O*NET） | F10 |
| 2.2 | A 仓实现 F11（轨迹聚合） | F11 |
| 2.3 | A 仓实现 F12（路径服务），V2 导航开始返回 ok | F12 |
| 2.4 | C 仓实现 `/map` 职业轨迹地图 | F13 |
| 2.5 | A 仓实现 F20+F21（证据账本+评分）；支持 Twitter Archive | F20, F21 |
| 2.6 | C 仓实现 `/evidence` 证据账本 | F20, F21 |
| 2.7 | A 仓实现 F22（三路径决策） | F22 |
| 2.8 | C 仓实现 `/compare` 三路径比较工作台 | F23 |

### Phase 3：市场与行动闭环（F32-F60）

| 步骤 | 任务 |
|------|------|
| 3.1 | 市场雷达（F32） |
| 3.2 | 行动/检查点（F41） |
| 3.3 | 决策事件与产品事件（F50） |
| 3.4 | 隐私中心：数据导出/删除（F60） |

### Phase 4：上线与商业化验证

| 步骤 | 任务 |
|------|------|
| 4.1 | prod 环境搭建（独立 RDS + 独立 SAE + 真实数据） |
| 4.2 | B 仓 Go/No-Go 11 项硬性门禁逐项检查 |
| 4.3 | 合规检查（ICP、AI 生成标记、隐私政策） |
| 4.4 | 封闭 Alpha（staging 环境，10-20 名真实用户） |
| 4.5 | 付费验证（F52） |

## 七、风险与缓解

| 风险 | 缓解措施 |
|------|---------|
| ICP 备案 2-4 周 | 立即启动，ESA Pages 先用默认域名 |
| V2 导航端点为桩 | 前端 Demo 模式 + data_insufficient 状态开发 |
| 免费额度 3 个月到期 | 免费期内完成开发和 Alpha 验证 |
| 三环境成本（staging + prod） | 免费期用一套，公测期再拆分为两套 |
| AJV Schema hash 不一致 | CI 强制校验 canonical SHA-256 |
| Orval CVE-2026-24132 | 使用修复版本 |

## 八、拒绝的替代方案

| 方案 | 拒绝理由 |
|------|---------|
| Next.js 全栈 | 与三仓分离架构冲突 |
| Supabase 全量替代 FastAPI | ~80% 核心代码无法迁移 |
| Zod 替代 AJV 做 API 校验 | 违反 V2 §9.4 强制要求 |
| X API 按量付费 | 成本$500+，中文覆盖差 |
| Coze/Dify 替代 LLM 编排 | 无法满足核心合规要求 |
| Vercel 部署前端 | 国内访问不稳定 |

## 九、立即行动项

1. **今天**：领取 SAE 免费额度 + RDS Serverless 免费试用
2. **今天**：开通 ESA Pages + ACR 容器镜像服务
3. **今天**：启动 ICP 备案
4. **本周**：构建 A 仓 Docker 镜像 → ACR → SAE 部署（dev）→ 验证端点
5. **本周**：C 仓初始化 Vite + React + TS 骨架（含 shared/api/ v1+v2 分层 + AJV + Orval）