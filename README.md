# CareerCopilot Frontend

OPC 参赛前端：职业推演 AI 助手的用户界面（Phase 3 Hero-shot）。

## 技术栈

- **Next.js 16**（App Router）+ **React 19** + **TypeScript**
- **Tailwind CSS v4**（PostCSS 接入，生产化构建，无运行时 CDN）
- 后端 API：A仓 `careercopilot-backend` 的 `/process`（百炼 Agent API Protocol）
- 部署：**双目标** —— EdgeOne Makers（同源 Edge Function 代理）/ 阿里云 ESA Pages（直连）

## 目录

```
app/                     # Next.js 页面（Hero-shot UI）
components/              # 报告视图 / 置信度柱状图
lib/                     # API 客户端 + 报告解析
edge-functions/api/process.js  # Makers Edge Function 代理（隐藏 Key + 解决 CORS）
docs/CORS-联调.md        # 前端↔后端 CORS 与联调说明
DEPLOY.md                # 双平台部署指南
```

## 本地开发

```bash
npm install
npm run dev          # http://localhost:3000
```

> 沙箱预览用 `127.0.0.1` 访问（next.config.ts 已配 allowedDevOrigins）。

## 数据流

```
浏览器 ──POST /api/process──> [Edge Function 代理] ──> 阿里云后端 /process
        (Makers 同源)          服务端注入 Key + 解决 CORS
```

- Makers：前端调同源 `/api/process`，密钥在 Makers 控制台配 `BACKEND_URL` / `PROCESS_API_KEY`。
- ESA Pages / 直连：设 `NEXT_PUBLIC_API_BASE` 指向后端，需后端 `CORS_ALLOW_ORIGINS` 含前端域名（见 `docs/CORS-联调.md`）。
- 后端未部署时，代理返回演示报告，界面照常可演示。

详见 [DEPLOY.md](./DEPLOY.md)。
