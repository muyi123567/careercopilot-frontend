import { parseReport, TuiyanReport } from "./parseReport";

// 留空 -> 走同源 Makers Edge Function 代理 (/api/process)
// 填阿里云后端地址 -> 直连（ESA Pages / 本地调试用），需后端已配 CORS
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export async function runTuiyan(
  question: string,
  userId = "demo-user"
): Promise<{ report: TuiyanReport; isDemo: boolean }> {
  const endpoint = API_BASE ? `${API_BASE}/process` : "/api/process";

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: [{ role: "user", content: [{ type: "text", text: question }] }],
      session_id: "web-session",
      user_id: userId,
    }),
  });

  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  const text = data?.output?.[0]?.content?.[0]?.text ?? "";
  if (!text) throw new Error("empty response");

  const isDemo = resp.headers.get("x-demo") === "1";
  return { report: parseReport(text), isDemo };
}
