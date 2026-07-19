import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 沙箱预览用 127.0.0.1 访问；dev server 默认只信任 localhost，需显式放行
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
