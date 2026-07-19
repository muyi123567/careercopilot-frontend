export interface Confidence {
  skill: number;
  market: number;
  timing: number;
  overall: number;
}

export interface TuiyanReport {
  recommendation: string;
  confidence: Confidence;
  evidence: string[];
  risks: string[];
  nextSteps: string[];
  raw: string;
}

function parsePercent(line: string): number {
  const m = line.match(/(\d+(?:\.\d+)?)\s*%/);
  return m ? parseFloat(m[1]) : 0;
}

// 解析后端 /process 返回的文本报告（格式见 A仓 routes_bailian._format_tuiyan_report）
export function parseReport(text: string): TuiyanReport {
  const lines = text.split(/\r?\n/);
  let section = "";
  const rec: string[] = [];
  const confidence: Confidence = { skill: 0, market: 0, timing: 0, overall: 0 };
  const evidence: string[] = [];
  const risks: string[] = [];
  const nextSteps: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (/^推荐[:：]/.test(line)) {
      rec.push(line.replace(/^推荐[:：]\s*/, ""));
      section = "recommendation";
      continue;
    }
    if (/技能匹配度/.test(line)) {
      confidence.skill = parsePercent(line);
      section = "confidence";
      continue;
    }
    if (/市场需求度/.test(line)) {
      confidence.market = parsePercent(line);
      section = "confidence";
      continue;
    }
    if (/时机合适度/.test(line)) {
      confidence.timing = parsePercent(line);
      section = "confidence";
      continue;
    }
    if (/综合评分/.test(line)) {
      confidence.overall = parsePercent(line);
      section = "confidence";
      continue;
    }
    if (/证据支撑/.test(line)) {
      section = "evidence";
      continue;
    }
    if (/风险因素/.test(line)) {
      section = "risk";
      continue;
    }
    if (/下一步建议/.test(line)) {
      section = "steps";
      continue;
    }
    if (/置信度分析/.test(line)) {
      section = "confidence";
      continue;
    }

    if (section === "recommendation") {
      rec.push(line);
    } else if (section === "evidence") {
      const m = line.match(/^\d+[.、]\s*(.*)$/);
      if (m) evidence.push(m[1]);
    } else if (section === "risk") {
      const m = line.replace(/^[-*]\s*/, "");
      if (m) risks.push(m);
    } else if (section === "steps") {
      const m = line.replace(/^[-*]\s*/, "");
      if (m) nextSteps.push(m);
    }
  }

  return {
    recommendation: rec.join(" ").trim() || text.slice(0, 200),
    confidence,
    evidence,
    risks,
    nextSteps,
    raw: text,
  };
}
