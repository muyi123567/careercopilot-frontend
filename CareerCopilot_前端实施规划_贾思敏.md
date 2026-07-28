# CareerCopilot 前端实施规划 · 贾思敏（前端工程师）

> 范围声明：本文件为**实施规划/方案**，不改动任何仓库代码、不修复 B1–B17 已知 bug、不提交 GitHub。
> 目标：把 Web H5（careercopilot-frontend，React18+Vite+TS+Tailwind 契约驱动 SPA，当前深靛蓝 oklch）与微信小程序（careercopilot-miniapp，Taro3+React+TS，当前浅色 + TDesign 蓝 #0052D9）统一迁移到新设计系统「隐 / Privacy-First」——**light-first oklch**（架构师锁定体系：暖纸面为底、墨色文字、深靛蓝 brand、teal 承载隐私语义），仅推演/对话/PDF 深度工作页用 canvas-dark 暗色画布子集。
> 消费依据：总监裁决 1（修订版：light-first oklch）、架构师锁 lucide-react ^0.454.0、PM MVP 三件套、核实版《接口交接文档》、C 仓前端现状（`client.ts` / `MatrixLandingPage.tsx`）、小程序现状（`app.config.ts` / `ConfidenceBar` / `PrivacyModal`）、设计师 `design-tokens.json` v0.2（当前终值）。

---

## 0. 裁决修订记录（原 blocking 已解除）

初版规划基于早期「隐暗色 + Ember」裁决，曾把设计师 `design-tokens.json` v0.2（light-first oklch 深靛蓝）与之矛盾标记为阻塞。经 team-lead 澄清：该暗色裁决已作废，**总监裁决 1 修订为——全产品统一 light-first oklch**（暖纸面为底、墨色文字、深靛蓝 brand、teal 承载隐私语义），仅推演/对话/PDF 深度工作页用 canvas-dark 暗色画布子集。因此设计师 v0.2 即为当前终值，不与任何有效裁决矛盾，原 blocking 解除。

本修订版 §1 已改为 light-first oklch 终值；涉及暗色画布的范围收窄为「深度工作页子集」。页面/契约/图标章节原则不变，仅把"全产品暗色"相关表述收敛为"light-first 默认 + canvas-dark 仅深度工作页"。

---

## 1. 一、Token 迁移方案（统一到 light-first oklch）

### 1.1 目标 Token（总监裁决 1 修订版终值 = 设计师 v0.2 = 架构师锁 oklch）

| Token | 值（oklch） | 用途 / 纪律 |
|---|---|---|
| `paper` | `oklch(98% 0.008 85)` | 暖纸面，**默认背景**（light-first 基底） |
| `surface` | `oklch(100% 0 0)` | 浅色卡片/面板 |
| `ink` | `900 oklch(24% 0.02 264)` … `400 oklch(70% 0.02 264)` | 墨色文字（一~四级） |
| `brand` | `600 oklch(48% 0.14 264)` … `300 oklch(75% 0.11 264)` | 深靛蓝动作色，**每屏 ≤2 处**，仅主 CTA |
| `teal` / `secure` | `600 oklch(50% 0.09 200)` | 隐私/已验证/本地处理语义（teal = secure） |
| `canvas-dark` | `oklch(22% 0.015 264)` | **仅**推演/对话/PDF 深度工作页暗色画布 |
| `canvas-panel` | `oklch(27% 0.015 264)` | 暗画布上的面板 |
| `line` | `oklch(24% 0.02 264 / 0.09)` | 发丝分隔线 |
| `scrim` | `oklch(24% 0.02 264 / 0.45)` | 遮罩 |

**四层调色板纪律**：纸面/墨色中性 70–90% · 深靛蓝 brand 5–10%（动作色）· teal/Secure 隐私语义 0–5% · 效果（光晕/高亮）<1%。**禁紫粉渐变、禁纯黑纯白、禁 Tailwind 默认靛蓝 `#6366f1`（允许自有深靛蓝 oklch(264)）**。

### 1.2 H5（Tailwind）token 状态：基本已对齐，迁移量极小

现有 `repos/frontend/tailwind.config.js` **已是 light-first oklch 深靛蓝体系**，与总监裁决 1 修订版终值一致，无需反相。

| 现有 tailwind token | 终值 | 动作 |
|---|---|---|
| `paper/surface/ink/brand/teal/line/scrim` | 同上表 | **保持**（已对齐） |
| `canvas-dark` `oklch(22% 0.015 264)` | 同上 | **降级使用**：仅推演/对话/PDF 深度工作页，不得作全局壳 |
| `fontFamily.sans` `Plus Jakarta Sans` / `display` `Fraunces` | `Inter` + `Noto Sans SC` | **替换**（P0 已锁定） |
| 任何 `#E2745B` / `Ember` 残留 | 删除 | 暗色裁决作废，Ember 不再使用 |

**字体迁移**：`fontFamily.sans` → `'Inter','Noto Sans SC',system-ui,sans-serif`；删除 `display: Fraunces`（P1 违例）。
**阴影迁移**：`boxShadow.card/lift` 已是 oklch token（设计师 v0.2 已修正），浅底优先用 `line` 发丝线而非投影（避免 AI 幽灵卡）。

### 1.3 小程序（Taro / WXSS）等效变量：legacy #0052D9 → light-first oklch

现有 `app.config.ts`：导航栏 `#0052D9`、tabBar `bg #FFFFFF / color #8A8F99 / selectedColor #0052D9`；`ConfidenceBar` 默认 `color="#0052D9"`（硬编码）。迁移为**浅色壳 + 深靛蓝选中**：

在 `src/styles/theme.scss` 定义 CSS 变量（小程序 1px≈2rpx，发丝线用 1rpx 或 rgba）：

```scss
:root, page {
  --cc-paper: oklch(98% 0.008 85);
  --cc-surface: oklch(100% 0 0);
  --cc-ink-900: oklch(24% 0.02 264);  --cc-ink-600: oklch(52% 0.02 264);
  --cc-brand: oklch(48% 0.14 264);     --cc-secure: oklch(50% 0.09 200);
  --cc-canvas-dark: oklch(22% 0.015 264);
  --cc-line: oklch(24% 0.02 264 / 0.09);
  --cc-scrim: oklch(24% 0.02 264 / 0.45);
}
```

> 注：若目标微信基础库版本不支持 oklch，提供 sRGB 回退（paper `#F7F5F0`、ink-900 `#2E2F33`、brand `#3B4FB0`、secure `#2E8C7E`、canvas-dark `#1F2024`），经 `postcss` 或构建期变量注入。

`app.config.ts` 改写（**浅色壳**，非暗色）：

| 字段 | legacy | 新值 |
|---|---|---|
| `window.navigationBarBackgroundColor` | `#0052D9` | `oklch(98% 0.008 85)`（paper，浅色壳） |
| `window.navigationBarTextStyle` | `white` | `black`（浅底深字） |
| `tabBar.backgroundColor` | `#FFFFFF` | `oklch(98% 0.008 85)`（paper） |
| `tabBar.color` | `#8A8F99` | `oklch(52% 0.02 264)`（ink-600） |
| `tabBar.selectedColor` | `#0052D9` | `oklch(48% 0.14 264)`（brand 深靛蓝，非 Ember） |
| `tabBar.borderStyle` | `black` | 微信仅支持 black/white；用 `black` 占位，真发丝线靠页面自定义 tab 或 `list` 图标描边实现（见 §4.1） |

`ConfidenceBar` 删除 `color="#0052D9"` 硬编码，改为消费 `tuiyan` 三维置信（§3.3），按维度引用 token（如 skill→brand、market→secure、timing→ink-600），**不渲染总置信度**。

### 1.4 派生 Token（来自设计师 v0.2 终值，已锁定）

| Token | 值（oklch） | 说明 |
|---|---|---|
| `ink-600` | `oklch(52% 0.02 264)` | 二级文本 / 图标 |
| `ink-400` | `oklch(70% 0.02 264)` | 三级/元信息 / 禁用态 |
| `success` | `oklch(58% 0.12 150)` | 成功/达成 |
| `warn` | `oklch(70% 0.12 75)` | 数据不足 / 覆盖缺口 |
| `danger` | `oklch(55% 0.18 25)` | PII 命中 / 服务失败 |

---

## 2. 二、页面落地规划（组件拆分 + 状态处理）

页面集（对齐 PM MVP 三件套 + 现有路由）：落地页 / 匿名推演 / 匿名对话 / 隐私页 / 画像（纸张态）。

### 2.1 落地页 `LandingPage`（H5 即 `MatrixLandingPage` 改造；小程序首页 `pages/index`）

| 组件 | 职责 | 消费 |
|---|---|---|
| `PrivacyTrustBadge` | 显式"不登录 · 不留数据"标识（PM 三件套①），Secure 青 + lucide `ShieldCheck` | 链接隐私页 |
| `ResumeLocalParser` | 浏览器/小程序本地解析简历 → 结构化 events（**绝不**上传原文/文件字节） | `src/lib/pdf-parser`（H5 已有） |
| `AnonymousEventInput` | 事件 chips（skill/experience/constraint），PII 实时屏蔽 | POST `/api/v1/anonymous-navigation` |
| `AnonymousPreviewCard` | 展示 `next_steps` / `limitations` / `retention:"none"` | 匿名推演结果 |

### 2.2 匿名推演 `AnonymousDeduction`（PM 三件套②：匿名临时推演 UI）

与已登录 `tuiyan` 页区分：本页消费 `anonymous-navigation` 的 `next_steps`，是**无记忆检索的临时探索**。

| 组件 | 状态要点 |
|---|---|
| `DeductionShell` | canvas-dark 暗色画布（深度工作页子集）+ 顶部 `TemporarySessionBanner`（"临时探索，关闭页面即消失"） |
| `EventSummaryChips` | 回显本次输入信号 |
| `ProvenanceUnknownBadge` | **一等 UI 状态**："来源 = 本次输入信号，非检索记忆"，`Unknown` 芯片，禁伪造总置信度%（PM 三件套③） |
| `NextStepsList` | `next_steps[]`；`limitations[]` 以次级文本常驻 |

### 2.3 匿名对话 `AnonymousChat`（消费 `/api/v1/anonymous-chat`，≤10 轮）

| 组件 | 状态要点 |
|---|---|
| `ChatMessageList` / `ChatBubble` | 用户/助手气泡，无通用 emoji 气泡；助手首条显式声明"基于你提供的结构化信号" |
| `SuggestionChips` | 渲染 `suggestions[]`，点击回填 composer |
| `ChatComposer` | 输入框 + 发送；轮次计数"第 N/10 轮"；`turn>=10` 或 `is_final_turn` → 禁用并提示"本轮为最后一轮" |
| `TemporarySessionBanner` | `retention:"none"`，离开即清空（不在 storage 持久化） |

### 2.4 隐私页 `PrivacyPage`（小程序 `pages/privacy` 已有，H5 新增）

| 组件 | 职责 |
|---|---|
| `PrivacyPrincipleList` | 本地解析 / 零存储 / 可溯源 / 可撤回 四原则（lucide 图标） |
| `DataFlowDiagram` | 简历→本地解析→结构化 events→匿名端点；强调"文件字节不出设备" |
| `ConsentToggle` | 绑定 `consent_to_temporary_processing`（匿名端点必填，缺则 422） |

### 2.5 画像（纸张态）`ProfilePaper`（GET/PUT `/api/v1/profile`）

**纸面文档画布（light-first 默认）**：`paper` 暖纸面为底，与全局 light-first 一致；canvas-dark 仅用于推演/对话/PDF 深度工作页。

| 组件 | 职责 |
|---|---|
| `ProfilePaperCanvas` | `bg: var(--cc-paper)`（paper 暖纸面，light-first 默认）；标题用 Noto Sans SC 590 字重（按 Inter+Noto Sans SC 落地，不做 serif） |
| `CoreDriversSection` / `AbilityTagsSection` / `PreferencesSection` | 画像三段，标签用纸面中性芯片 |
| `ProfileEditDrawer` | PUT 写回；保存态/校验失败态 |

### 2.6 统一状态矩阵（每个交互组件须覆盖）

- **交互态**：Default / Hover / Focus(`--cc-line` 或 brand 深靛蓝 focus-ring) / Active / Disabled / Loading。
- **数据态**：Populated / Empty / Error / Edge（轮次上限、PII 命中、契约校验失败）。
- **契约态（PM 三件套核心）**：`Unknown`（维度未知，显示"未知"芯片，**不为 0**）/ `Data-Insufficient`（占位接口，显示覆盖缺口）/ `Service-Failure`（显示 `request_id` + 重试，**绝不伪造或自动降级 Demo**）。

---

## 3. 三、契约消费（三态 API + 占位接口优雅降级）

### 3.1 接口三态清单（来源：核实版接口文档）

| 端点 | 状态 | 前端动作 |
|---|---|---|
| `POST /api/v1/anonymous-navigation` | **已实现**（零 DB/LLM 兜底，retention:none） | 落地页/匿名推演主链路 |
| `POST /api/v1/anonymous-chat` | **已实现**（≤10 轮，有 key 走 LLM 否则兜底） | 匿名对话 |
| `GET/PUT /api/v1/profile` | **已实现**（Bearer） | 画像纸张态 |
| `POST /api/v1/tuiyan` | **已实现**（Bearer，三维置信+证据护栏） | 已登录推演页 |
| `POST /api/v2/navigation` | **占位 stub**（`status:"data_insufficient"`，F12/F22 未接入） | 诚实空态，禁伪造 |
| `POST /api/v1/auth/wx-login` | **规划**（后端 P1-1 未实现） | 小程序 prod 门控 |
| 路径引擎 / scoring / market-radar | **规划**（F12/F22/F32，passes:false） | 路由守卫 + "敬请期待" |

### 3.2 消费原则（不可违反边界，来自 V2 评估 §三）

1. **只消费版本化 JSON，绝不正则解析 LLM 文本**：`tuiyan` 直接渲染 `confidence{skill,market,timing}` + `evidence[]`，不解析自由文本。
2. **契约校验前置**：v2 用 **AJV** 加载 vendored `career-navigation-v2.0.0.schema.json`；匿名端点用轻量 TS validator。校验失败 → 抛 `ContractViolationError` → 渲染 `Service-Failure`（带 `request_id`+重试），**不允许降级成 Demo/成功**。
3. **占位接口优雅降级矩阵**：

| 响应信号 | 渲染 |
|---|---|
| `status:"data_insufficient"` + `coverage_gaps[]` | `FeedbackStates` 空态："数据不足 / 敬请期待" + 列出 `coverage_gaps`（如 `trajectory_path_engine_not_available`） |
| `error.code` 且 `retryable:true` | 重试按钮 + 文案 |
| HTTP 503 / `detail:"AI 服务暂时不可用"` | "AI 服务暂时不可用，请稍后重试" |
| HTTP 401（缺/错 token） | H5 补 `session.tsx` 静默重登；小程序已 401 静默重登（保持） |
| HTTP 422（PII 命中 / 缺 consent） | 内联错误："请勿填写邮箱/手机/身份证" / "需勾选临时处理同意" |

4. **规划中接口门控**：未实现路由（路径地图/比较/市场雷达/wx-login）不暴露死链；用 feature-flag 渲染"敬请期待"占位；wx-login 缺失时小程序显示"登录即将开放"而非崩溃。
5. **身份只来自服务端**：token 从登录响应取，**绝不**从请求体/session_id 派生 uid（防越权）。
6. **隐私红线**：匿名端点显式 PII 屏蔽；`retention:"none"` 常驻可见；文件解析**仅本地**。

### 3.3 置信度与来源可信度（PM 三件套③落地）

- `tuiyan.confidence` 三维（skill/market/timing）**独立**渲染，各自进度条引用 token，**禁止求总/显示"总成功率%"**。
- `evidence[]` 每条 `episode_id`+`quote` 必须可溯源：展示 来源 / 范围 / 时间 / 方法 / 覆盖 五维；等级 A–D/Unknown 并显示"为何是该等级"。
- 匿名链路无记忆检索 → `ProvenanceUnknownBadge` 一等 UI 状态（来源=本次输入，未知维度显"未知"）。

---

## 4. 四、图标 / 动效 / 无障碍规范

### 4.1 图标（lucide-react ^0.454.0，禁 emoji、禁混用）

- 尺寸三级：**16px(xs) / 20px(sm) / 24px(md)**；`strokeWidth=1.5`；`color="currentColor"`；纯装饰加 `aria-hidden`。
- 语义映射（统一双端）：

| UI 含义 | lucide 名 |
|---|---|
| 隐私/已验证/本地处理 | `ShieldCheck` / `Lock` |
| 推演 / 路径 | `Compass` / `Route` |
| 匿名对话 | `MessageSquare` |
| 画像 / 文档态 | `FileText` |
| 我的 | `User` |
| 设置 | `Settings` |
| 来源未知 | `HelpCircle`（配 `Unknown` 芯片） |
| 数据不足 | `Inbox` |

- **小程序 tabBar 图标约束**：微信 tabBar 只接受 PNG 图片（非 SVG 组件）。须将对应 lucide 字形**栅格化导出**（选中态染 brand 深靛蓝 `oklch(48% 0.14 264)`、未选态染 `ink-600 oklch(52% 0.02 264)`，约 81×81px@3x）。现有 `app.config.ts` 为纯文字 tabBar（缺图标资源）——迁移同时补齐 4 套（路径/推演/画像/我的）lucide PNG。

### 4.2 动效

- 缓动：**标准** `cubic-bezier(.2,0,0,1)`、**入场 expo** `cubic-bezier(.16,1,.3,1)`；时长 150 / 200 / 300ms。
- 只动 `transform` / `opacity`；列表入场用交错（stagger 80ms）；避免 `top/left/width/height` 动画。
- **`prefers-reduced-motion`**：提供 `useReducedMotion` 钩子；该模式下关闭位移/缩放，仅保留 opacity 或瞬时切换。light-first 默认 ↔ canvas-dark 深度工作页切换、对话气泡、banner 入场均须遵守。

### 4.3 无障碍

- 触摸目标 ≥ 44×44px，间距 ≥ 8px（小程序 `hover-class` 提供点击态）。
- `:focus-visible` 焦点环用 brand 深靛蓝或 secure 描边；图标按钮带 `aria-label`。
- 浅底对比：ink-900 `oklch(24% 0.02 264)` on paper `oklch(98% 0.008 85)` 过 WCAG AA；canvas-dark 深度工作页用浅 fg `oklch(98% 0.008 85)` on `canvas-dark` 过 AA；`ink-600` 用于大文本，四级文本仅作辅助。
- 语义化 landmark（H5 `header/nav/main/footer`）；小程序用 `View role="..."` + `aria-*`。
- 文案真实具体（如"关闭页面即消失""不登录也能探索"），禁 Lorem ipsum / "Welcome" 占位。

---

## 5. 落地顺序与验收门禁（建议 PR 顺序）

1. **PR-1 设计 Token 单一真相源**：设计师 v0.2 即终值（无需 v0.3）；H5 `tailwind.config.js` 仅字体替换 + 确认 canvas-dark 子集；小程序 `theme.scss` + `app.config.ts` 改 light-first oklch；emoji 扫描 0 命中；全站 0 硬编码 hex（仅 token 定义处）。
2. **PR-2 light-first 壳 + 字体 + 焦点环**：落地页/首页先全浅，验证对比度与 reduced-motion；深度工作页单独验证 canvas-dark 对比。
3. **PR-3 匿名三件套 UI**：落地页隐私信任标识、匿名推演、匿名对话（含轮次上限/临时会话 banner/ProvenanceUnknown）。
4. **PR-4 契约消费加固**：AJV 校验 + 占位降级矩阵 + 401 重登（H5 补齐）；禁伪造。
5. **PR-5 画像纸面 + 隐私页**：paper 文档画布（light-first 默认）；PUT 写回。
6. **PR-6 小程序 tabBar 图标 + ConfidenceBar 重构**：lucide PNG；三维独立置信、无总%。

**验收门禁**：emoji 0 命中 · 无紫粉渐变 · 颜色全走 token · 占位接口如实显示（无伪造成功）· reduced-motion 全页覆盖 · 触摸目标达标。

---

## 6. 待团队确认 / 拍板

1. 原 blocker 已解除：设计师 v0.2 即终值（总监裁决 1 修订为 light-first oklch），无需 v0.3；§1 已据此重写。
2. 字体已定：Inter + Noto Sans SC（team-lead 确认替换 Plus Jakarta Sans/Fraunces），不做思源宋体大标题。
3. 小程序 Noto Sans SC 体积：建议 `wx.loadFontFace` 仅载 Inter，中文走系统字体（PingFang SC / 苹方）；是否接受？
4. wx-login 未实现：小程序 prod 登录门控文案与时序（dev-login 演示期 → prod "敬请期待"）。
5. 匿名对话 `anonymous-chat` 为一次性 `reply`（非 SSE）；若后续要流式，需后端改异步，前端预留 `isStreaming` 态。
