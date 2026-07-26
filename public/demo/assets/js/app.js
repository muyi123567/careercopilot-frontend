// CareerCopilot demo — 前端交互（自写，零框架）
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---------- 主题 ----------
  const root = document.documentElement;
  const saved = localStorage.getItem("cc-theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "dark");
  $("#themeToggle").addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cc-theme", next);
  });

  // ---------- 背景：数据树生长 + 数字雨 ----------
  (function bgFx() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tree = document.getElementById("dataTree");
    if (tree) {
      buildTree(tree, reduce);
      if (reduce) tree.classList.add("grow");
      else requestAnimationFrame(function () { requestAnimationFrame(function () { tree.classList.add("grow"); }); });
    }

    const c = document.getElementById("digitalEarth");
    if (c) {
      const ctx = c.getContext("2d");
      const green = (getComputedStyle(document.documentElement).getPropertyValue("--green") || "#2BFF88").trim();
      const blue = (getComputedStyle(document.documentElement).getPropertyValue("--blue") || "#3A8DFF").trim();
      let stars = [];
      function makeStars() {
        const area = c.width * c.height;
        const count = Math.min(280, Math.max(60, Math.floor(area / 8500)));
        const arr = [];
        for (let i = 0; i < count; i++) {
          const ground = Math.random() < 0.7;
          const y = ground ? c.height * (0.45 + Math.random() * 0.55) : c.height * (Math.random() * 0.42);
          arr.push({
            x: Math.random() * c.width,
            y: y,
            r: ground ? 0.8 + Math.random() * 1.0 : 0.4 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 1.4,
            base: ground ? 0.35 + Math.random() * 0.25 : 0.15 + Math.random() * 0.2,
            color: ground ? green : blue,
            flash: 0
          });
        }
        return arr;
      }
      function resize() {
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
        stars = makeStars();
      }
      resize();
      window.addEventListener("resize", resize);
      function drawGround() {
        const gx = c.width / 2, gy = c.height * 0.98, gr = c.width * 0.5;
        const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grd.addColorStop(0, "rgba(43,255,136,0.10)");
        grd.addColorStop(0.5, "rgba(43,255,136,0.04)");
        grd.addColorStop(1, "rgba(43,255,136,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      function paintStatic() {
        ctx.clearRect(0, 0, c.width, c.height);
        drawGround();
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          ctx.globalAlpha = s.base;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      function frame(t) {
        ctx.clearRect(0, 0, c.width, c.height);
        drawGround();
        const ts = t * 0.001;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          if (s.flash > 0) s.flash -= 0.04;
          else if (Math.random() < 0.0008) s.flash = 1;
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ts * s.speed + s.phase));
          const a = Math.min(1, s.base * tw + s.flash * 0.6);
          ctx.globalAlpha = a;
          ctx.fillStyle = s.color;
          ctx.shadowBlur = a > 0.55 ? 6 : 0;
          ctx.shadowColor = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        requestAnimationFrame(frame);
      }
      if (reduce) paintStatic();
      else requestAnimationFrame(frame);
    }
  })();

  // ---------- 程序化数据树（饱满发光冠层：分形递归 + 三次贝塞尔 + 簇状叶点） ----------
  function buildTree(svg, reduce) {
    if (!svg) return;
    const W = 480, H = 600, MAXD = 6;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    const NS = "http://www.w3.org/2000/svg";
    const branches = [], leaves = [];
    const up = -Math.PI / 2;
    function clampAngle(a) {
      if (a > up + 1.25) a = up + 1.25;
      if (a < up - 1.25) a = up - 1.25;
      return a;
    }
    function grow(x, y, angle, len, depth) {
      if (depth > MAXD || len < 12 || branches.length > 130) return;
      const x2 = x + Math.cos(angle) * len;
      const y2 = y + Math.sin(angle) * len;
      const nx = -Math.sin(angle), ny = Math.cos(angle);
      const wob = len * 0.28;
      const c1x = x + (x2 - x) * 0.33 + nx * (Math.random() - 0.5) * wob;
      const c1y = y + (y2 - y) * 0.33 + ny * (Math.random() - 0.5) * wob;
      const c2x = x + (x2 - x) * 0.66 + nx * (Math.random() - 0.5) * wob;
      const c2y = y + (y2 - y) * 0.66 + ny * (Math.random() - 0.5) * wob;
      branches.push({ x: x, y: y, c1x: c1x, c1y: c1y, c2x: c2x, c2y: c2y, x2: x2, y2: y2, depth: depth, len: len });
      const tip = depth >= MAXD - 1 || len < 16;
      if (tip) {
        const n = 3 + ((Math.random() * 4) | 0);
        for (let i = 0; i < n; i++) {
          leaves.push({ x: x2 + (Math.random() - 0.5) * 15, y: y2 + (Math.random() - 0.5) * 15, r: 0.9 + Math.random() * 1.5, depth: depth });
        }
      } else if (depth >= 2 && Math.random() < 0.35) {
        leaves.push({ x: x2 + (Math.random() - 0.5) * 7, y: y2 + (Math.random() - 0.5) * 7, r: 0.8 + Math.random() * 0.8, depth: depth });
      }
      const n = depth === 0 ? 1 : (Math.random() < 0.72 ? 2 : (Math.random() < 0.5 ? 3 : 1));
      for (let i = 0; i < n; i++) {
        let a;
        if (n === 1) a = angle + (Math.random() - 0.5) * 0.25;
        else a = angle + (i / (n - 1) - 0.5) * 1.4 + (Math.random() - 0.5) * 0.2;
        grow(x2, y2, clampAngle(a), len * (0.70 + Math.random() * 0.10), depth + 1);
      }
      if (depth >= 1 && depth <= 3 && Math.random() < 0.35) {
        const a = clampAngle(angle + (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.4));
        grow(x2, y2, a, len * 0.5, depth + 1);
      }
    }
    grow(W / 2, H - 18, up, 158, 0);

    const g = document.createElementNS(NS, "ellipse");
    g.setAttribute("class", "ground");
    g.setAttribute("cx", W / 2);
    g.setAttribute("cy", H - 14);
    g.setAttribute("rx", 178);
    g.setAttribute("ry", 28);
    g.setAttribute("fill", "url(#groundGlow)");
    svg.appendChild(g);

    branches.forEach(function (b) {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", "M" + b.x.toFixed(1) + " " + b.y.toFixed(1) + " C " + b.c1x.toFixed(1) + " " + b.c1y.toFixed(1) + " " + b.c2x.toFixed(1) + " " + b.c2y.toFixed(1) + " " + b.x2.toFixed(1) + " " + b.y2.toFixed(1));
      p.setAttribute("stroke-width", Math.max(0.9, (MAXD - b.depth + 1) * 0.95).toFixed(2));
      svg.appendChild(p);
      if (!reduce) {
        p.style.animationDelay = (b.depth * 0.24).toFixed(2) + "s";
        p.style.animationDuration = Math.min(1.5, Math.max(0.45, b.len * 0.012)).toFixed(2) + "s";
      }
    });
    leaves.forEach(function (lf) {
      const cEl = document.createElementNS(NS, "circle");
      cEl.setAttribute("cx", lf.x.toFixed(1));
      cEl.setAttribute("cy", lf.y.toFixed(1));
      cEl.setAttribute("r", lf.r.toFixed(2));
      cEl.setAttribute("fill", "url(#leafGrad)");
      svg.appendChild(cEl);
      if (!reduce) cEl.style.animationDelay = (lf.depth * 0.26 + 0.5).toFixed(2) + "s";
    });
  }

  // ---------- 导航：滚动出细发丝线 ----------
  const nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- 滚动揭示 ----------
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- 步骤指示 ----------
  function markFlow(activeStep) {
    $$("#stepper li").forEach(function (el) {
      const s = Number(el.dataset.step);
      el.classList.remove("active", "done");
      if (s < activeStep) el.classList.add("done");
      else if (s === activeStep) el.classList.add("active");
    });
  }
  markFlow(1);

  // ---------- 提示 ----------
  function setHint(msg, isErr) {
    const h = $("#parseHint");
    h.textContent = msg || "";
    h.classList.toggle("err", !!isErr);
  }

  // ---------- 解析库初始化 ----------
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  }

  async function parsePDF(file) {
    const buf = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      text += tc.items.map(function (i) { return i.str; }).join(" ") + "\n";
    }
    if (text.trim().length < 30 && typeof Tesseract !== "undefined") {
      text = await ocrPDF(doc);
    }
    return text;
  }

  async function ocrPDF(doc) {
    setHint("识别为扫描件，正在本地 OCR…");
    const worker = await Tesseract.createWorker("chi_sim+eng", 1, {
      logger: function (m) {
        if (m.status === "recognizing text") {
          setHint("OCR 识别中 " + Math.round(m.progress * 100) + "%");
        }
      },
    });
    let out = "";
    const max = Math.min(doc.numPages, 4);
    for (let p = 1; p <= max; p++) {
      const page = await doc.getPage(p);
      const vp = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      const r = await worker.recognize(canvas);
      out += r.data.text + "\n";
    }
    await worker.terminate();
    return out;
  }

  async function parseDOCX(file) {
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return res.value;
  }

  async function handleFile(file) {
    if (!file) return;
    setHint("正在本地解析 " + file.name + " …");
    markFlow(2);
    try {
      const ext = file.name.toLowerCase().split(".").pop();
      let text = "";
      if (ext === "pdf") text = await parsePDF(file);
      else if (ext === "docx") text = await parseDOCX(file);
      else if (ext === "txt") text = await file.text();
      else { setHint("不支持的文件类型：" + ext, true); markFlow(1); return; }
      await runExtract(text);
    } catch (e) {
      setHint("解析失败：" + (e && e.message ? e.message : e), true);
      markFlow(1);
    }
  }

  let events = [];

  async function runExtract(text) {
    setHint("正在抽取经历事件…");
    const res = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text || "" }),
    });
    const data = await res.json();
    events = data.events || [];
    renderTimeline(events);
    markFlow(3);
    setHint(data.mode === "mock" ? "（演示模式：返回结构化示例数据）" : "已解析 " + events.length + " 段经历");
    $("#timelineWrap").hidden = false;
    $("#reasonWrap").hidden = false;
    $("#timelineWrap").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderTimeline(evs) {
    const tl = $("#timeline");
    tl.innerHTML = "";
    const stages = new Set(evs.map(function (e) { return e.stage; }));
    $("#timelineMeta").textContent = evs.length + " 段经历 · " + stages.size + " 个阶段";
    evs.forEach(function (e) {
      const item = document.createElement("div");
      item.className = "tl-item";
      const skills = (e.skills || []).map(function (s) { return "<i>" + esc(s) + "</i>"; }).join("");
      const outs = (e.outcomes || []).map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("");
      const conf = Math.round((e.confidence || 0) * 100);
      item.innerHTML =
        '<div class="tl-stage">' + esc(e.stage || "—") + "</div>" +
        '<div class="tl-card">' +
          '<div class="tl-top">' +
            "<div>" +
              '<div class="tl-title">' + esc(e.title || "未命名经历") + "</div>" +
              '<div class="tl-org">' + esc(e.org || "") + (e.duration ? " · " + esc(e.duration) : "") + "</div>" +
            "</div>" +
            '<span class="tl-type">' + esc(e.type || "经历") + "</span>" +
          "</div>" +
          (skills ? '<div class="tl-skills">' + skills + "</div>" : "") +
          (outs ? '<ul class="tl-outcomes">' + outs + "</ul>" : "") +
          '<div class="tl-conf">' +
            '<span class="tl-conf-label">置信度</span>' +
            '<span class="meter"><span style="width:' + conf + '%"></span></span>' +
            '<span class="tl-conf-val">' + conf + "%</span>" +
          "</div>" +
        "</div>";
      tl.appendChild(item);
    });
  }

  async function runReason() {
    const q = $("#question").value.trim();
    if (!q) { setHint("请输入一个问题", true); return; }
    setHint("正在生成推演报告…");
    const res = await fetch("/api/reason", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: events, question: q }),
    });
    const data = await res.json();
    renderReport(data);
    markFlow(4);
    setHint("");
    $("#report").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderReport(d) {
    const r = $("#report");
    const cites = (d.citations || []).map(function (c) {
      return '<div class="rp-cite"><span class="seq">经历 #' + esc(c.seq) + '</span><div class="quote">' + esc(c.quote || "") + "</div></div>";
    }).join("");
    const conf = Math.round((d.confidence || 0) * 100);
    const dirs = (d.directions || []).map(function (x) {
      const s = Math.round((x.score || 0) * 100);
      return '<div class="rp-dir"><div class="rp-dir-top"><span>' + esc(x.label || "") + '</span><span class="score">' + s + "%</span></div>" +
        '<div class="meter"><span style="width:' + s + '%"></span></div></div>';
    }).join("");
    r.innerHTML =
      '<div class="rp-answer">' + esc(d.answer || "") + "</div>" +
      (cites ? '<div><div class="rp-section-label">证据引用</div><div class="rp-cites">' + cites + "</div></div>" : "") +
      '<div class="rp-confidence"><div class="rp-section-label">整体推演置信度</div><div class="meter"><span style="width:' + conf + '%"></span></div><div style="font-size:12px;color:var(--tx3);margin-top:8px;">' + conf + "%</div></div>" +
      (dirs ? '<div><div class="rp-section-label">方向建议</div><div class="rp-dirs">' + dirs + "</div></div>" : "");
  }

  // ---------- 事件绑定 ----------
  const dropArea = $("#dropArea");
  const fileInput = $("#fileInput");

  dropArea.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function (e) { handleFile(e.target.files[0]); });

  ["dragenter", "dragover"].forEach(function (ev) {
    dropArea.addEventListener(ev, function (e) { e.preventDefault(); dropArea.classList.add("drag"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropArea.addEventListener(ev, function (e) { e.preventDefault(); dropArea.classList.remove("drag"); });
  });
  dropArea.addEventListener("drop", function (e) {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  });

  $("#pasteToggle").addEventListener("click", function () {
    const box = $("#pasteBox");
    box.hidden = !box.hidden;
  });
  $("#pasteRun").addEventListener("click", function () {
    const t = $("#pasteText").value.trim();
    if (!t) { setHint("请先粘贴文本", true); return; }
    runExtract(t);
  });

  $("#demoBtn").addEventListener("click", function () {
    const sample =
      "2021.09-2022.06 校学生会新媒体部副部长，负责公众号内容策划，独立策划12篇阅读量过万推文，带教5名部员。\n" +
      "2022.07-2022.10 某互联网公司市场调研实习生，完成3份行业洞察报告，支撑产品决策。\n" +
      "2023.03-2023.11 国家级大创乡村振兴规划竞赛队长，获省级金奖，产出1份落地规划方案。\n" +
      "2024.07-至今 某科技公司产品经理，负责2条业务线，上线3个核心功能。";
    runExtract(sample);
    $("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#reasonBtn").addEventListener("click", runReason);
  $("#question").addEventListener("keydown", function (e) {
    if (e.key === "Enter") runReason();
  });
})();
