export type StructuredEventKind = 'skill' | 'experience' | 'education' | 'preference' | 'constraint';

export interface StructuredEvent {
  kind: StructuredEventKind;
  label: string;
  confidence?: number;
}

const PII = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?<!\d)1[3-9]\d{9}(?!\d)|(?<!\d)\d{17}[\dXx](?![\dXx])/i;

function trimSignal(line: string): string {
  return line
    .replace(/^(技能|能力|经历|项目|教育|偏好|约束|期望)\s*[:：-]?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function classify(line: string): StructuredEventKind {
  if (/(学历|专业|大学|本科|硕士|课程|证书)/.test(line)) return 'education';
  if (/(偏好|希望|喜欢|远程|城市|薪资|通勤)/.test(line)) return 'preference';
  if (/(限制|不能|不可|家庭|时间|地点)/.test(line)) return 'constraint';
  if (/(项目|负责|实习|工作|经历|完成|搭建|管理)/.test(line)) return 'experience';
  return 'skill';
}

/** Derive a small PII-screened envelope; raw local text never leaves this function. */
export function extractStructuredEvents(rawText: string): StructuredEvent[] {
  const seen = new Set<string>();
  const events: StructuredEvent[] = [];
  for (const rawLine of rawText.split(/\r?\n|[；;]/)) {
    const label = trimSignal(rawLine);
    if (label.length < 2 || PII.test(label) || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    events.push({ kind: classify(rawLine), label, confidence: 0.72 });
    if (events.length === 12) break;
  }
  return events;
}
