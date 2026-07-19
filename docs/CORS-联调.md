# CORS 与联调说明（前端 ↔ 阿里云后端）

> 适用：careercopilot-frontend 联调 A仓 `careercopilot-backend` 的 `/process` 端点。
> 后端 CORS 实现见 `app/config.py`：`CORS_ALLOW_ORIGINS` 从环境变量读取，dev 模式默认 `*`，prod 模式必须显式配置否则启动失败。

## 两种调用方式对应的 CORS 需求

| 前端部署 | 调用方式 | CORS 是否必需 | 说明 |
|---|---|---|---|
| EdgeOne Makers | 同源 `/api/process`（Edge Function 代理） | ❌ 不需要 | 代理在服务端转发，浏览器只访问同源，无跨域 |
| 阿里云 ESA Pages / 本地 | 直连后端 `https://<后端域名>/process` | ✅ 需要 | 跨域，后端 `CORS_ALLOW_ORIGINS` 必须含前端域名 |

## 后端需要做的配置（仅 ESA Pages / 直连场景）

在后端运行环境（FC 环境变量 / `.env`）设置：

```bash
# 多个域名用逗号分隔；务必含前端实际访问域名
CORS_ALLOW_ORIGINS=https://<esa-pages-domain>,https://<your-makers-domain>
```

- 设置该变量后 `CORS_ALLOW_CREDENTIALS` 自动为 `True`（见 config.py）。
- dev 模式无需设置（默认 `*`），但禁用 credentials，仅本地调试用。
- prod 未设置会启动失败（故意的安全设计），属正常。

> 注意：本前端在 Makers 上走 Edge Function 代理，**默认不依赖后端 CORS**；仅当你切换为 `NEXT_PUBLIC_API_BASE` 直连时才需要上面的配置。

## 本地联调脚本

```bash
#!/usr/bin/env bash
# 联调后端 /process（百炼 Agent API Protocol）
set -e
BACKEND="${BACKEND_URL:-http://localhost:8000}"
QUESTION="${1:-我是土地资源管理专业应届生，想转产品经理方向，该不该投腾讯的产品经理岗位？}"

curl -s -X POST "${BACKEND}/process" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-process-key-change-in-prod" \
  -H "X-User-Id: demo-user" \
  -d "$(jq -n --arg q "$QUESTION" '{
    input: [{role:"user", content:[{type:"text", text:$q}]}],
    session_id:"local-debug",
    user_id:"demo-user"
  }')" | jq '.output[0].content[0].text'
```

前置：`jq` 已装；后端在本地 `uvicorn app.main:app --port 8000` 或已部署到 FC。

## 验证清单

- [ ] Makers 预览：输入问题 → 看到演示报告（未配 BACKEND_URL 时）或真实报告（已配）。
- [ ] ESA Pages：设 `NEXT_PUBLIC_API_BASE` + 后端 `CORS_ALLOW_ORIGINS` 含 ESA 域名 → 跨域调通。
- [ ] 后端 `/api/v1/health` 返回 `{"status":"ok",...}`。
