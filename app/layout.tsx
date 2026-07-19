import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerCopilot · AI 职业推演助手",
  description:
    "输入职业方向问题，获得三维置信度推演报告（技能 / 市场 / 时机）+ 证据 + 风险 + 建议。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
