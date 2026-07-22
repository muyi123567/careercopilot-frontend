# CareerCopilot Frontend

CareerCopilot V2 是面向中文职业市场的个人职业导航系统。前端核心流程是：

`群体职业轨迹 → 三路径比较 → 证据确认 → 最小验证行动 → 检查点与结果`

完整页面、状态、契约和旧分支迁移规则见 `ARCHITECTURE-V2.md`。跨仓产品语义、JSON Schema、功能依赖与验收状态以 B 仓 `product-library` 为准。

## 当前基线

`main` 仍是静态 H5 原型：

```text
public/index.html
```

可直接在浏览器打开进行基线冒烟。它不代表最终组件架构，也不得继续增加固定 Demo 身份、LLM 文本解析或未经校准的置信百分比。

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
