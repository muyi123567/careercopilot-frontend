# 前端设计 SKILL / 插件清单

## 核心设计 SKILL

| # | SKILL 名称 | 核心功能 | 适用场景 |
|---|---|---|---|
| 1 | **Impeccable** | 全能型 UI 设计工具。提供 `critique`（审查评分）、`polish`（精修）、`bolder`（加强）、`quieter`（减弱）、`animate`（动效）、`delight`（趣味）、`harden`（生产加固）、`adapt`（响应式）、`audit`（a11y/性能）、`extract`（提取设计系统）等 20+ 命令 | 任何 UI 改进：从审查到精修到动效到无障碍 |
| 2 | **Hallmark** | 反 AI 套路设计。57 条 slop-test 门禁 + 20 个主题 + 结构多样性强制。提供 `audit`（打分）、`redesign`（重构视觉层）、`study`（从截图/URL 提取设计 DNA） | 新建页面时防止"AI 味"、审查现有页面是否像模板 |
| 3 | **design-taste-frontend** (v2) | Anti-slop 前端设计。读取 brief 后推断设计方向，输出不像模板的界面。含设计系统生成、audit-first 重设计流程 | 着陆页、作品集、品牌重设计 |
| 4 | **design-taste-frontend-v1** | v1 原版 Taste Skill，行为与 v2 不同，保留向后兼容 | 需要 v1 精确行为的项目 |
| 5 | **frontend-design** | 视觉设计方向指导。帮助做排版、色彩、布局决策，避免"默认模板感" | 新建 UI 或重塑现有 UI 时的方向选择 |
| 6 | **design-system** | 设计令牌架构。三层 token（primitive→semantic→component）、CSS 变量、间距/排版比例、组件规格、幻灯片生成 | 构建系统化设计体系、品牌合规演示文稿 |
| 7 | **create-skill-ui** | 为 SKILL 创建自定义 HTML Widget UI。用 `show_widget` 做实时预览 | 给 SKILL 添加交互表单、数据展示、确认对话框 |

## 辅助工具

| # | 工具名称 | 功能 |
|---|---|---|
| 8 | **shadcn/ui** (组件系统) | 12 个已安装组件（button/card/dialog/tabs/tooltip/toast/select/separator/skeleton/progress/dropdown-menu/badge），按需 `npx shadcn@latest add` 扩展 |
| 9 | **SkillSpector** (安全扫描) | NVIDIA 开源，`skillspector scan` 对 SKILL 做安全检查 |
| 10 | **improve-codebase-architecture** | 扫描代码架构改进机会，输出可视化 HTML 报告 |

## 协作关系

```
设计决策层：Hallmark（结构） + design-taste（方向） + frontend-design（审美）
     ↓
组件实现层：shadcn/ui（积木块） + design-system（令牌）
     ↓
质量保障层：Impeccable（审查/精修/动效/加固） + Hallmark audit（反 AI 检测）
     ↓
安全层：SkillSpector（SKILL 安全扫描）
```

## 项目当前状态

- shadcn/ui 已初始化，12 个组件在 `src/shared/components/ui/`
- Impeccable 已用于 7 轮 Apple-level polish（全部页面 0 findings）
- Hallmark 已安装，可用于新页面设计和审查
- 品牌色系统：Terracotta（陶土）hex 色阶，华为浏览器兼容
- 三档响应式断点：mobile / tablet / desktop

## 后续开发工作流

```
1. Hallmark 决定宏观结构（避免 AI 套路）
   → hallmark study <参考设计> 提取 DNA
   → 或直接用 default 模式生成结构

2. shadcn 提供组件积木
   → npx shadcn@latest add [需要的组件]
   → import 使用

3. 品牌系统定制外观
   → Tailwind class 引用 brand/teal/gold/ink
   → 动效用 cubic-bezier(0.16, 1, 0.3, 1)

4. Impeccable + Hallmark 质量检查
   → impeccable polish / critique
   → hallmark audit 确认无 AI 套路
```
