"use client";

import { useState } from "react";
import { runTuiyan } from "@/lib/api";
import { TuiyanReport } from "@/lib/parseReport";
import ReportView from "@/components/ReportView";

const PLACEHOLDER =
  "例如：我是土地资源管理专业应届生，想转产品经理方向，该不该投腾讯的产品经理岗位？";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TuiyanReport | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setReport(null);
    setIsDemo(false);
    try {
      const res = await runTuiyan(q);
      setReport(res.report);
      setIsDemo(res.isDemo);
    } catch (e) {
      setError("请求失败：" + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">CareerCopilot</h1>
        <p className="text-sm text-gray-500">AI 职业推演助手 · OPC 参赛项目</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          你的职业方向问题
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder={PLACEHOLDER}
        />
        <button
          onClick={submit}
          disabled={loading}
          className="mt-3 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "推演中..." : "开始推演"}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-3 text-gray-500">推演引擎分析中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error}
        </div>
      )}

      {report && (
        <div className="animate-fade-in space-y-4">
          {isDemo && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              当前为演示数据：后端尚未部署或不可达。在 Makers 控制台配置
              BACKEND_URL + PROCESS_API_KEY 后即切换为真实推演。
            </div>
          )}
          <ReportView report={report} />
        </div>
      )}

      <footer className="text-center text-xs text-gray-400 py-6">
        CareerCopilot · 吉林大学 × 武汉大学 · OPC 先锋创新挑战赛
      </footer>
    </main>
  );
}
