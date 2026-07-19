"use client";

import { Confidence } from "@/lib/parseReport";

const ITEMS: { key: keyof Confidence; label: string; color: string }[] = [
  { key: "skill", label: "技能匹配度", color: "bg-blue-600" },
  { key: "market", label: "市场需求度", color: "bg-green-600" },
  { key: "timing", label: "时机合适度", color: "bg-purple-600" },
];

export default function ConfidenceBars({
  confidence,
}: {
  confidence: Confidence;
}) {
  return (
    <div className="space-y-3">
      {ITEMS.map((it) => (
        <div key={it.key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{it.label}</span>
            <span className="font-medium">{confidence[it.key]}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`confidence-bar ${it.color} h-2.5 rounded-full`}
              style={{ width: `${confidence[it.key]}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-2 border-t">
        <div className="flex justify-between">
          <span className="font-medium text-gray-800">综合评分</span>
          <span className="font-bold text-lg text-blue-600">
            {confidence.overall}%
          </span>
        </div>
      </div>
    </div>
  );
}
