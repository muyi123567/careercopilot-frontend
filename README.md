# CareerCopilot Frontend

CareerCopilot V2 是面向中文职业市场的个人职业导航系统。前端核心流程是：

`群体职业轨迹 → 三路径比较 → 证据确认 → 最小验证行动 → 检查点与结果`

完整页面、状态、契约和旧分支迁移规则见 `ARCHITECTURE-V2.md`。跨仓产品语义、JSON Schema、功能依赖与验收状态以 B 仓 `product-library` 为准。

## 当前基线

`main` 原是静态 H5 原型（`public/index.html`），已在本迁移 PR 中归档移除——它不代表最终组件架构，也不得继续增加固定 Demo 身份、LLM 文本解析或未经校准的置信百分比。

本仓库前端实现已迁移为 **React 18 + TypeScript + Vite** 的契约驱动单页应用（见 `src/`）。详见下方「V2 React 实现」。

## V2 React 实现（契约驱动 / 证据优先）

### 技术栈
- React 18 + TypeScript + Vite（静态产物，可挂任意静态托管）
- Tailwind CSS（编辑式设计系统 + 响应式 + 无障碍）
- React Router（HashRouter，便于静态托管）
- TanStack Query（服务端状态：缓存/重试/错误，契合 5 状态机）
- Vitest（契约 / 消费者测试）
- 标准 PWA（manifest + 自写 service worker）

### 契约脱钩
- 类型真相源由 B 仓策展的 `contracts/career-navigation/career-navigation-v2.0.0.schema.json`（JSON Schema draft 2020-12）经 `npm run codegen`（`scripts/codegen-contract.mjs`）生成 `src/shared/api/contract.generated.ts`。
- 后端换语言 / 换云 / 换数据库，只要 schema 不变，前端类型一行不改；schema 变了，TS 直接报错。
- **刻意不用 FastAPI OpenAPI 自动生成**：策展 schema 编码了「证据完整性」语义（status 一等公民、A-D/U 证据等级、明文「绝不表达为成功率」），ORM 自动推导会漏掉这些约束。

### 运行
```bash
npm install
npm run dev        # 本地开发
npm run build      # 产物到 dist/
npm run preview    # 预览构建产物
npm run typecheck  # tsc 类型检查
npm test           # 契约测试
npm run codegen    # 从契约重新生成 TS 类型
```

### 目录
```
src/
  shared/
    api/        contract 类型、运行时校验、客户端、mock、labels
    auth/       会话（demo/authenticated，随机 sessionId）
    state/      导航请求状态（loading/ok/data_insufficient/error）
    analytics/  仅枚举事件，无简历/问题全文
    components/ ui / layout / states / provenance / Placeholder
  features/
    home/ career-map/ path-compare/ evidence/ actions/ market-radar/ decisions/ privacy/
```

### 当前状态
- 核心流程（首页 → 地图 → 比较 → 证据 → 行动）已实现，使用契约形状 mock 数据演示。
- 雷达 / 决策 / 隐私为规划骨架，等待后端 F31/F40/F60 就绪后接入。
- 接真实后端：在 `window.CAREERCOPILOT_CONFIG = { apiBase: 'https://你的域名' }` 注入地址即可切换（demo 模式仍走 mock）。

## V2 实施顺序

1. F00：真实身份、匿名 session 与 Demo 隔离。
2. F01：版本化 JSON Schema 与运行时校验。
3. F13：群体职业轨迹地图。
4. F23：三路径比较工作台。
5. F32：中文市场雷达。
6. F41：行动与检查点。
7. F60/F61：隐私、失败显式化与可观测。

引入 TypeScript/构建系统时，必须在同一 PR 增加锁文件、install/build/test/lint/typecheck 命令和 CI。

## 安全红线

- 生产 uid 不来自客户端可编辑字段。
- 不共享 `demo-user` 或 `web-session`。
- 生产失败不返回 Demo 成功对象。
- 分析事件不包含简历正文、问题全文或个人身份信息。
- 所有事实数字都能打开来源、范围、时间、方法和覆盖说明。
