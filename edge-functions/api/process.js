// Makers Edge Function: 同源代理到 CareerCopilot 后端 /process
// 作用：① 服务端注入 API Key（不进前端代码）② 解决跨域 CORS
// 后端未部署/不可达时回退演示报告，保证 Hero-shot 界面始终可演示。
// 运行环境：V8（非 Node.js），不可用 npm 包 / Node 内置。

const DEMO_REPORT = `职业推演报告

推荐: 建议优先投递产品助理/产品策划类岗位，并以"土地资源管理+武大测绘"复合背景切入空间数据产品方向。

置信度分析:
  技能匹配度: 68%
  市场需求度: 62%
  时机合适度: 55%
  综合评分:   62%

证据支撑 (2 条):
  1. [onboard/profile] 用户具备土地资源管理本科 + 武大测绘硕士复合背景，契合空间/地理数据产品岗。
  2. [project/intern] 大三参与需求分析实习，输出过 PRD 与竞品分析，具备产品基础素养。

风险因素:
  - 无互联网大厂产品实习，简历竞争力偏弱（置信低）。
  - 数据分析样本仅 1 段，量化能力待补强。

下一步建议:
  - 补 1 段数据分析/SQL 项目，强化量化证据。
  - 先投中厂产品培训生，再冲大厂暑期实习。`;

function demoResponse() {
  const payload = {
    output: [{ role: "assistant", content: [{ type: "text", text: DEMO_REPORT }] }],
  };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-demo": "1",
      "cache-control": "no-store",
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const backend = env.BACKEND_URL;
  const key = env.PROCESS_API_KEY || "";

  if (!backend) return demoResponse();

  try {
    const body = await request.json();
    const upstream = await fetch(`${backend.replace(/\/$/, "")}/process`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "x-user-id": body.user_id || "demo-user",
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    return demoResponse();
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}
