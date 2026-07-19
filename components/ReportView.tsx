"use client";

import { TuiyanReport } from "@/lib/parseReport";
import ConfidenceBars from "./ConfidenceBars";

function List({
  items,
  icon,
  color,
}: {
  items: string[];
  icon: string;
  color: string;
}) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2 text-gray-700">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={color} style={{ marginTop: "0.125rem" }}>
            {icon}
          </span>
          <span className="text-sm">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ReportView({ report }: { report: TuiyanReport }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">推演结论</h2>
        <p className="text-gray-700 leading-relaxed">{report.recommendation}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">置信度分析</h2>
        <ConfidenceBars confidence={report.confidence} />
      </div>

      {report.evidence.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">证据支撑</h2>
          <List items={report.evidence} icon="●" color="text-blue-500" />
        </div>
      )}

      {report.risks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">风险因素</h2>
          <List items={report.risks} icon="⚠" color="text-yellow-500" />
        </div>
      )}

      {report.nextSteps.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">下一步建议</h2>
          <List items={report.nextSteps} icon="→" color="text-green-500" />
        </div>
      )}
    </div>
  );
}
