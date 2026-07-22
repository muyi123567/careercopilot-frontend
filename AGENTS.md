# CareerCopilot Frontend Agent Contract

## 产品与规范

- 当前主路线：面向中文职业市场的个人职业导航系统。
- 本仓实现前端载体；上位产品、Schema 和任务状态在 B 仓。
- 新功能先读 `ARCHITECTURE-V2.md`；旧单次推演、固定 Demo 身份和置信百分比不再扩展。

## 工作流

- 一次只做 B 仓 `feature_list.json` 中一个依赖已满足的任务。
- 分支使用 `codex/<task-id>-<slug>` 或 `agent/<task-id>-<slug>`。
- 不直接推 `main`，不自行合并 PR，不修改无关文件。
- 提交前运行任务声明的组件、契约、可访问性与视觉验证，并记录证据。
- Builder 不批准自己的实现；Owner 决定合并和发布。

## 不可违反的前端边界

- 不信任客户端 user_id；不使用共享 `demo-user` / `web-session` 作为生产回退。
- 不在后端错误时伪造成功报告或自动降级 Demo。
- 不正则解析 LLM 自由文本；只消费版本化 JSON Schema。
- 不展示未经校准的成功率/总置信百分比。
- 不发送问题全文、简历正文或个人信息到分析事件。
- 每个数字必须能追到来源、范围、时间、方法与覆盖。
- `Unknown`、数据有限和错误必须有独立 UI 状态。

## 当前命令

当前 `main` 是静态页面：直接打开 `public/index.html` 做基线冒烟。引入构建系统的 PR 必须同时补充锁文件、install/build/test/lint/typecheck 命令与 CI，不能只更新本文。
