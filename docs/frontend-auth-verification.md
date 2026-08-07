# 前端端到端 Cookie 认证验证报告（task-14-frontend-verify）

- 任务ID: `task-14-frontend-verify`（对应 GitHub issue #100）
- 仓库: careercopilot-frontend（Vite / React 19 / react-router v8 / TanStack Query）
- 分支: `ao/task-14-frontend-verify`
- 审查范围: 前端 Cookie 会话认证链路 —— 注册/登录、Cookie 携带、加载空态、错误码处理（401/403/429/503）、登出
- 审查日期: 2026-08-07
- 审查方式: 静态代码审查（无法访问真实后端 / 浏览器，真实验证项见文末「需真实环境验证」清单）

---

## 摘要

前端 Cookie 认证实现整体结构正确：认证上下文（`CookieAuthProvider`）完全基于 HttpOnly Cookie 会话，
所有受保护 API 统一走 `apiFetch` 封装（`credentials: 'include'` + 内存 CSRF token），401 有全局跳转登录的
事件链路，登出逻辑完整，Dashboard / Workspace 均具备加载与空态 UI。

审查中发现 **2 处代码层面缺口**（已顺手修复并提交）：

1. `api:error` 事件（403/429/503）在 `fetch.ts` 中被派发，但**没有任何监听方**消费它，导致 403/429/503
   无任何面向用户的提示；预建的 `/403`、`/429`、`/503` 错误页路由从未被触发。
2. 401（会话过期）时全局仅 `navigate('/login')`，**没有清除 AuthContext 内存态**（user / CSRF token），
   被重定向到登录页后 `isAuthenticated` 仍为 true，存在状态残留与重复 401 跳转风险。

---

## 逐项检查结论

### 1. 注册 / 登录（调用后端 auth 端点，凭证 Cookie 是否正确保存） — ✅ 通过

| 位置 | 结论 |
| --- | --- |
| `src/shared/auth/AuthContext.tsx:71-87` | `login` / `register` 通过 `fetchCreds`（`credentials: 'include'`）POST `/api/v1/auth/login`、`/api/v1/auth/register`，成功后 `setUser(await res.json())`，再 `refreshCsrf()` 拉取 `/api/v1/auth/csrf` 并写入内存 token。 |
| `src/shared/auth/AuthContext.tsx:36-52` | `fetchCreds`/`fetchCsrf`/`refreshCsrf` 均带 `credentials: 'include'`。 |
| `src/features/auth/LoginForm.tsx` / `LoginPage.tsx` / `AuthPage.tsx` | UI 侧登录/注册表单 + 校验 + 错误回显；成功后 `navigate('/app')`。 |
| `src/shared/auth/useAuth.ts` | `useAuth` 复用同一 Cookie 会话（backward-compat 别名，`token: null`）。 |

说明：Session Cookie 由后端经 `Set-Cookie` 下发，前端不落 localStorage（符合 HttpOnly 会话设计）。
登录失败（如密码错误）时后端返回 401，但此处用的是裸 `fetch`（非 `apiFetch`），**不会**触发全局
`auth:unauthorized` 跳转，行为正确。
需真实环境确认：后端 login/register 响应头 `Set-Cookie` 的 `Domain` / `Secure` / `SameSite` 配置能被
浏览器接受并作用于 Vercel 同源域（见文末清单）。

### 2. Cookie 携带（所有 API 请求是否带 credentials / 同源自动带 Cookie） — ✅ 通过（注意匿名端点）

| 位置 | 结论 |
| --- | --- |
| `src/shared/api/fetch.ts:127-166`（`apiFetch`） | 所有请求 `credentials: 'include'`，不安全方法自动附 `X-CSRF-Token`（内存 token，`fetch.ts:134-138`）。 |
| `src/shared/api/fetch.ts:171-184`（`publicFetch`） | 同样 `credentials: 'include'`（用于 locale session）。 |
| `src/shared/api/client.ts:49-58` | `postNavigation` 统一走 `apiFetch`，跨域带 Cookie + CSRF。 |
| `src/shared/api/fetch.ts:114-120` / `AuthContext.tsx:29-34` | `apiBase` 未配置时默认同源 `''`；生产 `.env.production` 为 `VITE_API_BASE_URL=`（空），配合 `vercel.json` 将 `/api/*` 重写到后端 FC —— Cookie 一方化，避免三方 Cookie 被拦截。 |
| `src/features/workspace/WorkspacePage.tsx:106`、`src/features/console/AnonymousChat.tsx:66` | 匿名端点使用裸 `fetch`，**未带** `credentials: 'include'`。属匿名功能（无需登录会话），同源生产模式下 Cookie 会自动携带，故不影响认证链路；但跨域开发模式下不会带 locale Cookie。**低风险，建议后续统一走封装。** |

### 3. 加载空态（无登录态时的 UI 空状态） — ✅ 通过

| 位置 | 结论 |
| --- | --- |
| `src/features/dashboard/DashboardPage.tsx:85-138` | 加载态用骨架屏；无证据文档 → 引导「上传简历开始」；无推荐任务 → 提示语。 |
| `src/features/workspace/WorkspacePage.tsx:174-201, 297-320` | 无提取信号、无可导航职业均有无数据空态。 |
| `src/features/workspace/WorkspacePage.tsx:271-284` | 未登录时账户态导航区显示「需登录」并给出「去登录」入口，是「无登录态」的正确空态。 |
| `src/shared/components/illustrations/EmptyStates.tsx` | 提供 `EmptyEvidence/EmptyAction/EmptyMap/EmptyDecision` 空态插画供页面复用。 |
| `src/shared/auth/RequireAuth.tsx` | 路由守卫：认证检查期间显示加载态，未登录重定向 `/login`。 |

### 4. 错误码处理 — 部分通过 / **需修复（已修复）**

| 状态码 | 行为要求 | 修复前实现 | 结论 |
| --- | --- | --- | --- |
| 401 未登录 | 跳转登录 | `fetch.ts:149-152` 派发 `auth:unauthorized`；`App.tsx` 监听并 `navigate('/login')`。 | ✅ 跳转已实现；但内存态未清除（见「发现的问题」#1，已修复）。 |
| 403 无权限 | 提示 | `fetch.ts:153-156` 派发 `api:error {status:403}`，**无监听方**；`/403` 页（`HttpErrorPage.tsx:14-20`）从未被触发。 | ❌ **缺口（已修复）**：`App.tsx` 新增 `api:error` 监听 → `navigate('/403')`。 |
| 429 限流 | 提示重试 | `fetch.ts:157-160` 派发 `api:error {status:429}`，**无监听方**；`/429` 页（`HttpErrorPage.tsx:22-28`，含「重试」按钮）从未被触发。 | ❌ **缺口（已修复）**：`App.tsx` 新增监听 → `navigate('/429')`。 |
| 503 服务不可用 | 友好提示 | `fetch.ts:161-164` 派发 `api:error {status:503}`，**无监听方**；`/503` 页（`HttpErrorPage.tsx:30-36`，含「重试」按钮）从未被触发。 | ❌ **缺口（已修复）**：`App.tsx` 新增监听 → `navigate('/503')`。 |

修复内容：
- `src/App.tsx`：新增 `useEffect` 监听 `api:error`，按 `detail.status` 跳转到 `/403` `/429` `/503`。
- `src/shared/auth/AuthContext.tsx`：新增 `useEffect` 监听 `auth:unauthorized`，清除 `user` 与 CSRF token。

补充说明：
- 安全读取（GET/HEAD/OPTIONS）在 `fetch.ts:90-112` 已对 502/503/504 做有界重试（最多 2 次退避），
  因此瞬时 503 的 GET 不会立刻把用户踢到错误页；POST 等写请求不重放、直接走错误页，符合安全语义。
- 匿名端点（WorkspacePage / AnonymousChat）对 429/422/5xx 已做**局部**提示（如「请求过于频繁，请稍后再试」），
  不走全局错误页，行为合理。

### 5. 登出（调用登出端点 + 清除本地状态） — ✅ 通过（1 处次要 UX 缺口）

| 位置 | 结论 |
| --- | --- |
| `src/shared/auth/AuthContext.tsx:89-93` | `logout()` POST `/api/v1/auth/logout`（`fetchCsrf`，带 `X-CSRF-Token`），成功后 `setUser(null)` + `clearCsrfToken()`。 |
| `src/shared/components/layout/AppShell.tsx:66-139` | 桌面端用户菜单含「退出登录」+ `AlertDialog` 二次确认。 |
| 登出后行为 | `setUser(null)` → `isAuthenticated=false` → `RequireAuth` 自动重定向 `/login`。 |
| 次要缺口 | **移动端抽屉导航没有登出入口**（只有桌面 `UserMenu` 有）。不影响后端认证正确性，属 UX 缺口。 |

注意点：若内存 CSRF token 为空（`refreshCsrf` 静默失败）且后端强制校验 CSRF，登出 POST 可能失败并被
`catch` 静默吞掉 —— 本地状态仍被清空，但服务端 Cookie 仍有效，刷新后会重新登录。需真实环境确认后端
登出端点是否强制 CSRF。

---

## 发现的问题

| # | 级别 | 问题 | 状态 |
| --- | --- | --- | --- |
| 1 | 高 | `api:error`（403/429/503）事件被派发但无人监听，预建错误页 /403 /429 /503 从未触发，用户得不到任何提示。 | **已修复**（App.tsx 新增监听并跳转） |
| 2 | 高 | 401 会话过期只跳转 /login，AuthContext 内存态（user + CSRF token）未清除，`isAuthenticated` 残留，可能造成重复 401 跳转 / 过期会话继续展示已登录壳层。 | **已修复**（AuthContext 监听 `auth:unauthorized` 清态） |
| 3 | 低 | 匿名端点（WorkspacePage / AnonymousChat）裸 `fetch` 未带 `credentials: 'include'`，跨域开发模式下不携带 locale Cookie。 | 未改（非认证链路；建议后续统一走 publicFetch） |
| 4 | 低 | 移动端抽屉导航无登出入口（仅桌面用户菜单有）。 | 未改（UX，非本次范围） |
| 5 | 低 | 初始加载时 `/me` 若遇 5xx（后端故障）也会 `setUser(null)` 并把用户导向登录页，无「服务不可用」区分。 | 未改（需结合错误页策略，谨慎处理） |

---

## 改动文件列表

| 文件 | 改动 |
| --- | --- |
| `src/App.tsx` | 新增 `api:error` 全局监听，按状态码跳转 /403 /429 /503 |
| `src/shared/auth/AuthContext.tsx` | 新增 `auth:unauthorized` 监听，401 时清除 user 与 CSRF token |
| `docs/frontend-auth-verification.md` | 本报告 |

---

## 需真实环境（Vercel 部署 + 浏览器）验证的清单

以下项无法在静态代码审查中确认，需部署后人工/端到端验证：

1. **登录 Cookie 落地**：后端 login 响应 `Set-Cookie`（`HttpOnly`、`Secure`、`SameSite`、`Path`、`Domain` 是否省略以落到 Vercel 同源域）能否被浏览器接受，并在页面刷新后经 `/api/v1/auth/me` 恢复会话。
2. **Vercel rewrite 的 Cookie 透传**：`vercel.json` 将 `/api/*` 代理到 FC 后端时，后端 `Set-Cookie` / 请求 Cookie 是否正确透传（首方 Cookie 场景）。
3. **CORS 与凭证**：若以跨域 `VITE_API_BASE_URL` 部署，需验证后端 `Access-Control-Allow-Credentials: true` + `Access-Control-Allow-Origin` 精确回显；且注意 `vercel.json` 的 CSP `connect-src 'self'` 会拦截跨域后端，**必须**同步放开。当前生产为同源模式，不受影响。
4. **401 → 跳转登录**：手动让会话过期（如清 Cookie 或等过期），确认自动跳转 /login 且无重复 401 循环、不残留已登录壳层（修复 #2 后验证）。
5. **403 / 429 / 503 错误页**：触发后端返回对应状态码，确认分别进入 /403 /429 /503 页面且「重试」按钮可用（修复 #1 后验证）。
6. **登出端到端**：确认登出后服务端 Cookie 被清除、刷新不再自动登录；移动端需人工确认登出入口缺失的影响。
7. **CSRF 全链路**：登录后内存 token 注入 `X-CSRF-Token`，写操作（导航/档案/上传）在后端校验通过。

---

## 阻塞 / 遗留问题

- 无阻塞。代码层面缺口已修复，`npm run build`（如环境允许）结果见提交说明。
- 遗留：问题 #3（匿名端点统一封装）、#4（移动端登出入口）、#5（初始 `/me` 5xx 处理）为后续优化项，
  建议作为独立任务跟进。
