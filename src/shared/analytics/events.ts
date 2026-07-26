/**
 * 简单事件追踪函数（占位实现）。
 * 后续可对接真实 analytics 服务。
 */
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
): void {
  console.log(`[analytics] ${name}`, properties ?? {})
}
