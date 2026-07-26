import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * shadcn/ui 标准工具函数 — 合并 Tailwind CSS 类名。
 * clsx 处理条件类名，twMerge 解决 Tailwind 类冲突。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
