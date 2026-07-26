// CareerCopilot demo — zero-dependency Node proxy + static server
// 运行: node server.js  (可选) DASHSCOPE_API_KEY=xxx node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const KEY = process.env.DASHSCOPE_API_KEY || '';
const BAILIAN_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const MODEL = process.env.BAILIAN_MODEL || 'qwen-plus';
const ROOT = __dirname;

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let d = '';
    req.on('data', (c) => (d += c));
    req.on('end', () => resolve(d));
  });
}
function extractJson(text) {
  const s = text.indexOf('{');
  const e = text.lastIndexOf('}');
  if (s === -1 || e === -1) throw new Error('no json in model output');
  return JSON.parse(text.slice(s, e + 1));
}
async function bailian(system, user) {
  const r = await fetch(BAILIAN_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
    }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || 'bailian error');
  return j.choices[0].message.content;
}

// ---- mock 数据 (未配置 key 时演示用) ----
const MOCK_EVENTS = [
  { seq: 1, stage: '大二', event_time: '2021', type: '社团', title: '校学生会新媒体部副部长', org: '某高校学生会', role: '副部长', duration: '2021.09-2022.06', skills: ['内容策划', '团队协作', '公众号运营'], outcomes: ['独立策划 12 篇阅读量过万推文', '带教 5 名部员'], evidence_refs: ['学生会考核表'], confidence: 0.85 },
  { seq: 2, stage: '大三', event_time: '2022', type: '实习', title: '市场调研实习生', org: '某互联网公司', role: '实习生', duration: '2022.07-2022.10', skills: ['问卷调查', '数据分析', '报告撰写'], outcomes: ['完成 3 份行业洞察报告', '支撑产品决策'], evidence_refs: ['实习证明'], confidence: 0.8 },
  { seq: 3, stage: '大四', event_time: '2023', type: '项目', title: '乡村振兴规划竞赛队长', org: '国家级大创', role: '队长', duration: '2023.03-2023.11', skills: ['项目管理', 'GIS 空间分析', '路演'], outcomes: ['获省级金奖', '产出 1 份落地规划方案'], evidence_refs: ['获奖证书'], confidence: 0.9 },
  { seq: 4, stage: '工作', event_time: '2024', type: '全职', title: '产品经理', org: '某科技公司', role: '产品经理', duration: '2024.07-至今', skills: ['需求分析', '原型设计', '跨部门协作'], outcomes: ['负责 2 条业务线', '上线 3 个核心功能'], evidence_refs: ['绩效评估'], confidence: 0.82 },
];

function mockReason(events, question) {
  const sorted = [...events].sort((a, b) => (a.seq || 0) - (b.seq || 0));
  const distinct = [...new Set(sorted.map((e) => e.stage))];
  const pick = distinct.length > 1
    ? sorted.filter((e) => e.stage === distinct[0] || e.stage === distinct[1]).slice(0, 2)
    : sorted.slice(0, 2);
  const c1 = pick[0] || sorted[0] || {};
  const c2 = pick[1] || c1;
  const answer =
    `基于你的经历链，从「${c1.stage || '早期'}」到「${c2.stage || '近期'}」呈现一条清晰的能力演进路径：` +
    `早期在${c1.org || '校园'}积累的${((c1.skills || [])[0] || '执行')}能力，逐步在${c2.org || '职场'}升级为${((c2.skills || [])[0] || '综合')}能力。` +
    `针对你的问题「${question || '职业方向'}」，建议以这两段真实经历作为核心证据，向目标岗位证明你的连贯性与成长性。`;
  const citations = [
    { seq: c1.seq, quote: ((c1.outcomes && c1.outcomes[0]) || c1.title || '相关经历') },
    { seq: c2.seq, quote: ((c2.outcomes && c2.outcomes[0]) || c2.title || '相关经历') },
  ];
  return {
    mode: 'mock',
    answer,
    citations,
    confidence: 0.72,
    directions: [
      { label: '深耕当前方向', score: 0.78 },
      { label: '横向拓展相关领域', score: 0.61 },
      { label: '探索跨界机会', score: 0.43 },
    ],
  };
}

const EXTRACT_SYS =
  '你是简历经历抽取器。从给定简历文本中抽取个人经历事件，输出严格 JSON：' +
  '{"events":[{"seq":int,"stage":string,"event_time":string,"type":string,"title":string,"org":string,"role":string,"duration":string,"skills":[string],"outcomes":[string],"evidence_refs":[string],"confidence":float}]}。' +
  'stage 从[高中,大一,大二,大三,大四,在读研究生,工作]选择；event_time 用 YYYY 或 YYYY-MM；confidence 为 0-1。只输出 JSON，不要解释。';
const REASON_SYS =
  '你是职业导航推演引擎。给定用户经历事件链(events)与一个职业问题(question)，生成推演报告，输出严格 JSON：' +
  '{"answer":string,"citations":[{"seq":int,"quote":string}],"confidence":float,"directions":[{"label":string,"score":float}]}。' +
  '必须从 events 中跨阶段调取≥2段经历作为证据(citations 引用其 seq 与原文片段)；confidence 为 0-1 表示整体推演置信度；directions 给出 2-3 个方向及分数。只输出 JSON。';

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }
  if (req.method === 'GET' && req.url.startsWith('/assets/')) {
    const fp = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!fp.startsWith(ROOT)) return json(res, 403, { error: 'forbidden' });
    if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) return json(res, 404, { error: 'not found' });
    const ext = path.extname(fp).toLowerCase();
    const types = { '.css': 'text/css', '.js': 'application/javascript', '.mjs': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(fp));
    return;
  }
  if (req.method === 'POST' && req.url === '/api/extract') {
    const raw = await readBody(req);
    let p = {};
    try { p = JSON.parse(raw || '{}'); } catch {}
    if (!KEY) return json(res, 200, { mode: 'mock', events: MOCK_EVENTS });
    try {
      const out = await bailian(EXTRACT_SYS, p.text || '');
      const parsed = extractJson(out);
      return json(res, 200, { mode: 'real', events: parsed.events || [] });
    } catch (e) {
      return json(res, 200, { mode: 'real-error', error: String(e.message || e), events: MOCK_EVENTS });
    }
  }
  if (req.method === 'POST' && req.url === '/api/reason') {
    const raw = await readBody(req);
    let p = {};
    try { p = JSON.parse(raw || '{}'); } catch {}
    if (!KEY) return json(res, 200, mockReason(p.events || MOCK_EVENTS, p.question || ''));
    try {
      const user = JSON.stringify({ events: p.events || [], question: p.question || '' });
      const out = await bailian(REASON_SYS, user);
      const parsed = extractJson(out);
      return json(res, 200, { mode: 'real', ...parsed });
    } catch (e) {
      return json(res, 200, { mode: 'real-error', error: String(e.message || e), ...mockReason(p.events || MOCK_EVENTS, p.question || '') });
    }
  }
  json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log('CareerCopilot demo → http://localhost:' + PORT + (KEY ? '  (真实百炼模式)' : '  (MOCK 演示模式)'));
});
