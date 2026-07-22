# CareerCopilot Frontend V2

> 上位规范：B 仓 `CareerCopilot-V2-职业导航主路线与跨仓架构-2026-07-22.md`。  
> 本文定义 C 仓前端载体、页面状态和后端契约边界。

## 1. 产品载体

首发为响应式 Web/PWA，核心不是聊天，而是“职业地图 + 三路径比较 + 行动闭环”。小程序/App 只有在检查点和提醒证明有持续价值后再增加。

## 2. 页面

| 页面 | 核心任务 | 必要状态 |
|---|---|---|
| `/` | 选择当前职业并进入地图 | production/demo 明确选择、匿名入口 |
| `/map` | 看群体轨迹并选择候选 | loading/ready/limited/unknown/error |
| `/compare` | 比较深化/邻近/探索三类路径 | 四层证据、数据覆盖、来源抽屉 |
| `/evidence` | 确认系统对个人事实的理解 | candidate/confirmed/rejected/conflict |
| `/actions` | 创建最小验证行动 | draft/active/done/abandoned |
| `/radar` | 看中文市场变化 | fresh/stale/limited/unknown |
| `/decisions/:id` | 复盘不可变决策快照 | original snapshot + later checkins |
| `/settings/privacy` | 导出、撤回、删除 | job status 与明确 SLA |

## 3. 首条端到端体验

1. 用户输入“当前/最近职业 + 地域 + 经验阶段”。
2. 前端展示 1-2 跳局部职业轨迹，每条边显示来源、时间、范围和样本。
3. 用户把最多三条路径加入比较。
4. 用户补充简历/经历与约束；抽取内容先在证据页确认。
5. 比较页并排展示历史轨迹、中文市场、个人证据、偏好约束和覆盖度。
6. 用户选择、暂缓或替换路径，并记录理由。
7. 系统生成一个低成本、可观察、带停止条件的行动。
8. 7/30/90 天回填新证据和结果。

## 4. 契约边界

- 前端只消费版本化 JSON，不解析 LLM Markdown/文本。
- 所有事实性字段包含来源引用，点击数字必须能打开来源抽屉。
- `uid` 来自服务端认证，不在请求体发送可覆盖身份的 user_id。
- session 使用随机 id，并由后端验证用户归属；禁止固定 `web-session`。
- Demo 由用户主动进入，后端返回 `mode=demo`；生产失败绝不静默显示 Demo。
- Unknown 是一等状态，不用 0%、灰色低分或默认值替代。

## 5. 组件边界

```text
features/
  career-map/          CareerGraph, PathEdge, ScopeFilters
  path-compare/        PathColumn, EvidenceMatrix, TradeoffList
  evidence/            EvidenceLedger, ClaimEditor, ConflictCard
  provenance/          SourceChip, ProvenanceDrawer, CoverageBadge
  actions/             ExperimentCard, CheckinForm, OutcomeTimeline
  market-radar/        DemandSeries, SkillDelta, RegionCompare
  privacy/             DataInventory, ExportJob, DeletionJob
shared/
  api/                 generated types, runtime validation, errors
  auth/                token/session; no identity defaults
  analytics/           typed decision events; no free-form content
```

框架迁移到 TypeScript 时先建契约、状态和测试，再迁移样式。不要把一份 2,000 行 HTML 当作最终组件架构。

## 6. 展示规则

- 不显示“总置信度 78%”“你有 82% 成功率”。
- 使用五个独立维度：历史可达性、中文市场、个人证据、偏好约束、数据覆盖。
- 使用 A-D/Unknown 证据等级，并显示为何是该等级。
- 事实、推断、建议分别标识。
- 比较表默认展示成本、收益、风险、反证和最小验证行动。
- 图谱默认 1-2 跳；复杂关系通过逐步展开，不一次铺满。

## 7. 身份、隐私和失败

- 匿名用户可浏览公共地图；保存个人证据才要求登录。
- 上传前说明用途；原文、脱敏内容和抽取候选分开显示。
- 用户能拒绝候选证据，拒绝不能被下一次 LLM 调用悄悄恢复。
- 错误页展示 request id、保存草稿、重试与返回；不伪造结果。
- Analytics 仅发送枚举事件与对象 id，不发送问题全文或简历文本。

## 8. 可复用旧分支

- `agent/038-hero-shot`：应用壳、技能树和证据卡可作视觉素材；删除置信百分比与旧单推演流程。
- `agent/039-event-tracking`：仅参考批量/keepalive，上报改成有类型的决策事件。
- `agent/040-ocr-upload`：上传拖拽可迁移；Token、身份和待确认流程重写。
- `agent/041-aesthetic-upgrade`：契约和关键流程稳定后再移植美化。
- `agent/phase3-heroshot-ui`：不继续；固定身份、文本解析和伪 Demo 降级是阻断项。

## 9. 测试门槛

- API 运行时 Schema 校验与生产者/消费者契约测试。
- 组件状态覆盖 loading/limited/unknown/error，不只 happy path。
- 键盘导航、焦点、颜色对比、屏幕阅读器标签。
- 360/768/1440 三视口视觉回归。
- 两个用户并发会话无串线。
- 后端故障时显示错误且没有 Demo 报告。
- 5 人理解测试：能正确说出历史频率不等于成功概率。

第一张实现 PR 对应 B 仓 F00；第二张是 F01。地图 UI 在这两张通过前不进入主分支。
