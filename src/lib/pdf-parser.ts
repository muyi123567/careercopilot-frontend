/**
 * 浏览器本地 PDF 解析工具。
 * 使用 pdf.js 在浏览器端提取文本，原始文件不离开设备。
 */
import * as pdfjsLib from 'pdfjs-dist';

// 配置 worker（Vite 兼容）
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface PdfParseResult {
  text: string;
  pages: number;
  truncated: boolean;
}

const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PAGES = 20; // 最多解析 20 页
const MAX_TEXT_LENGTH = 50000; // 最多提取 50000 字符

/**
 * 在浏览器本地解析 PDF 文件，提取纯文本。
 * 原始文件不上传、不存储。
 */
export async function parsePdfLocally(file: File): Promise<PdfParseResult> {
  if (file.size > MAX_PDF_SIZE) {
    throw new Error(`PDF 文件过大（最大 ${MAX_PDF_SIZE / 1024 / 1024}MB），请选择更小的文件。`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pagesToParse = Math.min(totalPages, MAX_PAGES);

  let fullText = '';
  let truncated = false;

  for (let i = 1; i <= pagesToParse; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';

    if (fullText.length > MAX_TEXT_LENGTH) {
      fullText = fullText.slice(0, MAX_TEXT_LENGTH);
      truncated = true;
      break;
    }
  }

  if (totalPages > MAX_PAGES) {
    truncated = true;
  }

  // 清理多余空白
  fullText = fullText
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return {
    text: fullText,
    pages: totalPages,
    truncated,
  };
}

/**
 * 判断文件是否为支持的文本格式。
 */
export function isSupportedTextFile(file: File): boolean {
  return /\.(txt|md|csv|json)$/i.test(file.name);
}

/**
 * 判断文件是否为 PDF。
 */
export function isPdfFile(file: File): boolean {
  return /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
}

/**
 * 判断文件是否为 DOCX（暂不支持，给出提示）。
 */
export function isDocxFile(file: File): boolean {
  return /\.docx?$/i.test(file.name);
}
