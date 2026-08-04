# EvidWay 前端接口说明

后端地址：同源模式（`/api/*` 由 Vercel 重写到后端，不直接暴露 FC 地址）

认证方式：HttpOnly Cookie 会话（服务端设置，前端不存 token）

---

## 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/v1/auth/register | 注册（email + password） | 否 |
| POST | /api/v1/auth/login | 登录（email + password） | 否 |
| POST | /api/v1/auth/logout | 退出登录 | 是 |
| GET | /api/v1/auth/me | 获取当前用户信息 | 是 |
| GET | /api/v1/auth/csrf | 获取 CSRF token | 是 |

### 用户信息响应 (GET /api/v1/auth/me)

```json
{
  "user_id": "uuid",
  "status": "active",
  "display_name": "用户名"
}
```

---

## 职业导航接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/public/occupations?locale=zh-CN | 公共职业列表（ESCO） | 否 |
| POST | /api/v2/navigation | 生成职业导航路径 | 是 |
| POST | /api/v1/anonymous-navigation | 匿名临时推演 | 否 |

### 职业列表响应 (GET /api/v1/public/occupations)

```json
[
  {
    "slug": "software-developer",
    "title": "软件开发工程师",
    "group": "信息技术",
    "description": "设计、开发和测试软件应用",
    "esco_code": "2512.1"
  }
]
```

---

## 证据与文档接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/evidence/documents | 获取证据文档列表 | 是 |
| POST | /api/v1/evidence/documents | 上传文档（multipart） | 是 |

### 文档列表响应 (GET /api/v1/evidence/documents)

```json
[
  {
    "id": "uuid",
    "filename": "resume-2026.pdf",
    "doc_type": "pdf",
    "status": "processed",
    "uploaded_at": "2026-07-30T10:00:00Z",
    "size_bytes": 102400
  }
]
```

status 取值：`uploaded` | `pending` | `processed` | `failed`

---

## GPS 推荐接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/gps/notifications | 获取推荐行动列表 | 是 |

### 推荐行动响应

```json
[
  {
    "id": "uuid",
    "type": "action_suggestion",
    "title": "完成分布式系统设计面试准备",
    "body": "基于你的目标职业，建议本周完成...",
    "action_url": "/app/actions",
    "created_at": "2026-07-31T08:00:00Z"
  }
]
```

---

## 计费接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/v1/billing/credits | 获取积分余额 | 是 |

### 积分响应

```json
{
  "balance": 128,
  "plan": "free"
}
```

---

## 待实现接口（前端已预留，后端未就绪）

| 路径 | 用途 | 前端降级策略 |
|------|------|-------------|
| GET /api/v1/profile | 用户档案 | 不显示进度模块 |
| GET /api/v1/profile/goal | 目标职业 | 显示引导卡 |
| GET /api/v1/navigation/paths | 个性化路径 | 仅显示公共职业列表 |
| GET /api/v1/actions | 行动实验列表 | 使用 gps/notifications 替代 |
| GET /api/v1/decisions | 决策记录 | 显示空状态 |
| GET /api/v1/radar/signals | 市场雷达信号 | 显示"即将上线" |

---

## 前端请求规范

- 所有认证请求携带 `credentials: 'include'`
- 401 响应触发全局事件 `auth:unauthorized`，路由自动跳转 /login
- CSRF token 通过 `X-CSRF-Token` header 传递（仅存内存，不入 localStorage）
- 网络异常统一提示："网络连接失败，请检查网络后重试"
- 密钥通过 `.env.production` 的 `VITE_API_BASE_URL` 注入，不入代码

---

## 前端路由表

| 路由 | 页面 | 认证 |
|------|------|------|
| / | Landing Page | 否 |
| /login | 登录/注册 | 否 |
| /app | 工作台 Dashboard | 是 |
| /app/career-map | 职业地图 | 是 |
| /app/profile | 我的档案 | 是 |
| /app/profile/evidence | 证据台账 | 是 |
| /app/documents | 文档管理 | 是 |
| /app/actions | 行动实验 | 是 |
| /app/decisions | 决策记录 | 是 |
| /app/radar | 市场雷达 | 是 |
| /app/settings | 设置 | 是 |
