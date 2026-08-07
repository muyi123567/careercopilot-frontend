# 2026-08 前端视觉美化记录

本文记录 2026-08-07 完成的一轮全站视觉美化工作，涉及三个提交（已合入 `main`）。

## 提交清单

| 提交 | 类型 | 内容 |
|------|------|------|
| `394261f` | polish(ui) | 后台功能页视觉打磨：决策记录死按钮修复、记忆网格、签到成功页、错误页、积分记录、订阅套餐卡、导航问答、路径分析、market-radar 清理 |
| `35bc2fc` | chore(deps) | 补齐 `@alicloud/*` 与 `jszip` 的 lock 条目，对齐 package.json（保证 CI `npm ci` 不失败） |
| `9041aac` | polish(ui) | 全站 hover 语言统一 + 三态引导补漏（由 codex exec 执行，人工审查后提交） |

## 改动范围

- **9 个页面文件**（提交一）：决策记录、记忆管理、签到、错误页、积分记录、订阅、导航问答、路径分析 + 删除未挂载的 market-radar 副本
- **19 个文件**（提交三）：Actions/CareerMap/Dashboard/Decisions/Documents/Evidence/History/Memory/Occupations/Paths/Radar/Results/Settings/Subscription/Workspace + CommandPalette/FactCandidateCard

## 设计决策

统一按既有 terracotta 设计系统 token（brand/accent/ink/paper/surface/line）执行，不引入新设计语言：

- **列表行 hover** 统一为 `hover:bg-ink-50/40`；无品牌语义卡片阴影统一为 `hover:shadow-card`；品牌强调卡保留各自品牌色阴影
- **空态三件套**：EmptyStates 插画 + 标题 + 引导 CTA（复用 `src/shared/components/illustrations/EmptyStates.tsx`）
- **错误态**：品牌渐变重试按钮（`bg-gradient-to-r from-brand-500 to-brand-600`）
- **主 CTA**：品牌渐变 + hover 阴影 + active 缩放

## 审查记录

codex 执行（提交三）后由人工逐文件 diff 审查，修正两处过度执行：

1. LandingPage 暗色页白色按钮的白色发光阴影被宽泛规则误替换为深色 `shadow-card` → 恢复原暗色发光语言
2. Evidence 空态误用 `role="status"`（aria-live 不应包静态内容）→ 移除

## 验证

- `npm run typecheck` 通过
- `npm test`（18 用例）全绿
- 浏览器 mock 登录态抽查：Dashboard 行动趋势空态、Actions/Decisions 空态、Subscription、Results 均通过，无 JS 错误
