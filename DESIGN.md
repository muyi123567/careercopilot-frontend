# EvidWay 前端设计方案

## 设计理念

- **证据优先**：界面传达可信度，不编造确定性，所有数据标注来源
- **克制而温暖**：赤陶色(brand)为主色调，墨色(ink)为文字色，大面积留白
- **渐进披露**：信息分层展示，hover/滚动时逐步呈现细节
- **物理感交互**：spring 缓动、微缩放、呼吸光效，让界面有"重量"

## 设计参考

| 参考站点 | 借鉴要素 |
|---------|---------|
| Vercel Dashboard | 侧边栏布局、卡片分区、进度圆环、hover 展开 |
| AnySearch Console | Plan 用量面板、配额进度条、设置页绑定卡片网格 |
| Linear.app | 暗色 Hero + 产品 mockup、Kanban 展示面板 |
| AnySearch Home | scroll-reveal 动效、SVG 流程示意图、虚线连接动画 |

## 色彩系统 (Tailwind 自定义)

- paper: #FAF7F2 (页面底色)
- ink: 9级灰阶 (文字/边框)
- brand: 赤陶色 9级 (主交互色, CTA, 高亮)
- accent: 琥珀色 (辅助强调, 签到, 积分)
- teal/gold: 数据可视化辅助

## 动效规范

- breathe: 呼吸光效 (opacity 0.4-1, scale 1-1.08, 6s)
- dash: SVG 虚线流动 (strokeDashoffset 14-0, 2s linear)
- slide-up: 入场动画 (translateY 8px-0 + opacity)
- scroll-reveal: IntersectionObserver + cubic-bezier(0.16,1,0.3,1) 900ms + scale 0.98-1
- nav items: hover:scale-[1.02] + active:scale-[0.98]

## 路由结构

- / -> LandingPage (暗色营销页)
- /login -> LoginPage (玻璃拟态卡片)
- /occupations -> 职业库 (公开)
- /app -> AppShell (RequireAuth 守卫)
  - /app -> DashboardPage (Plan面板+图表)
  - /app/career-map -> 职业地图
  - /app/profile -> 我的档案
  - /app/profile/evidence -> 证据台账
  - /app/documents -> 文档管理
  - /app/actions -> 行动实验
  - /app/decisions -> 决策记录
  - /app/radar -> 市场雷达
  - /app/paths/new -> 路径分析
  - /app/assistant -> 导航问答
  - /app/memory -> 记忆管理
  - /app/settings -> 设置
  - /app/subscription -> 订阅管理
  - /app/credits/history -> 积分记录

## 组件架构

- src/features/ (页面级组件, 按路由拆分)
  - landing/ 营销首页
  - auth/ 登录/注册
  - dashboard/ 工作台
  - settings/ 设置
  - paths/ 路径分析
  - assistant/ AI 问答
  - credits/ 积分
  - subscription/ 订阅
  - memory/ 记忆管理
- src/shared/
  - api/ fetch 封装 + React Query hooks
  - auth/ AuthContext + RequireAuth
  - components/ 通用组件
    - layout/ AppShell (侧边栏+顶栏)
    - charts/ ECharts 封装 (Donut/Trend)
    - ui/ AlertDialog 等基础 UI
    - CommandPalette.tsx
    - DailyCheckIn.tsx
    - OnboardingGuide.tsx

## API 接口 (后端 base: /api/v1)

- POST /auth/login - 邮箱密码登录 (Cookie 会话)
- GET /auth/me - 当前用户信息
- POST /auth/logout - 退出
- GET /credits - 积分余额+套餐
- GET /credits/history - 消费记录
- GET /evidence/documents - 证据文档列表
- GET /notifications - 推荐行动
- POST /checkin - 每日签到
- GET /occupations - 职业库
- POST /paths/analyze - 路径分析

## 认证方案

- Cookie-based session (httpOnly)
- 前端 AuthContext 调用 /auth/me 判断登录态
- RequireAuth 路由守卫，未登录重定向 /login
- 支持：邮箱密码 / 微信 / QQ (后两者待后端对接)

## 构建配置

- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3 (自定义主题)
- ECharts (按需引入, 独立 vendor chunk)
- React.lazy 路由懒加载
- manualChunks: echarts / pdfjs 独立分包
