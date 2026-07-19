# 部署指南（双目标：EdgeOne Makers + 阿里云 ESA Pages）

同一套前端代码可部署到两个边缘平台。代码本身云无关，区别仅在「API 怎么调」。

## 数据流

```
浏览器 ──POST /api/process──> [Edge Function 代理] ──> 阿里云后端 /process
        (Makers 同源)          服务端注入 Key + 解决 CORS
```

- **Makers**：前端调同源 `/api/process`，由 `edge-functions/api/process.js` 转发到后端，密钥在 Makers 控制台配置（`BACKEND_URL` / `PROCESS_API_KEY`），不进代码。
- **ESA Pages / 直连**：设 `NEXT_PUBLIC_API_BASE=https://<后端域名>`，前端直连后端；需后端 `CORS_ALLOW_ORIGINS` 含 ESA Pages 域名（见 `docs/CORS-联调.md`）。

## 一、EdgeOne Makers（方案1，推荐，可端到端验证）

```bash
npm install -g edgeone@latest
export PAGES_SOURCE=skills
edgeone login --site china        # 或 --site global
edgeone makers deploy -n careercopilot-frontend --json
```

部署后在 Makers 控制台 → 环境变量，设置：
- `BACKEND_URL` = 你的阿里云 FC `/process` 基址，如 `https://xxx.fc.aliyuncs.com`
- `PROCESS_API_KEY` = 后端 PROCESS_API_KEY（dev 模式可为空）

未设置 `BACKEND_URL` 时，代理返回演示报告，界面照常可演示。

## 二、阿里云 ESA Pages（方案2，OPC 比赛要求阿里云 MaaS）

ESA Pages 为静态边缘托管。两种姿势：

1. **框架构建（推荐）**：ESA Pages 绑定本 Git 仓，选择 Next.js 框架构建（自动 `next build`）。
2. **静态导出**：在 `next.config.ts` 加 `output: "export"`（会禁用 API 路由，但本前端未用 Route Handler，可导出），`next build` 后 `out/` 即为纯静态，上传 ESA Pages。

不论哪种，前端需设 `NEXT_PUBLIC_API_BASE` 指向后端，并确保后端 CORS 放行 ESA Pages 域名。
可用 `alibabacloud-esa-pages-deploy` skill 执行上传。
