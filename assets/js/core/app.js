/* =====================================================================
   App core: storage, gamification, router, layout, search, UI helpers
   ===================================================================== */
(function () {
  "use strict";
  const LA = (window.LA = window.LA || {});
  LA.chapters = LA.chapters || {};
  LA.pages = LA.pages || [];
  LA.searchExtra = LA.searchExtra || [];

  /* ---------------- Storage ---------------- */
  const NS = "la2273:";
  const store = {
    get(k, d) { try { const v = localStorage.getItem(NS + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem(NS + k); } catch (e) { /* ignore */ } },
  };
  LA.store = store;

  /* ---------------- Small DOM helpers ---------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/\$[^$]*\$/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  LA.$ = $; LA.$$ = $$; LA.esc = esc; LA.slug = slug;
  LA.h = function (html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  LA.rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  LA.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  LA.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------------- Math rendering ---------------- */
  LA.KATEX_MACROS = {
    "\\R": "\\mathbb{R}", "\\C": "\\mathbb{C}", "\\N": "\\mathbb{N}", "\\Z": "\\mathbb{Z}", "\\Q": "\\mathbb{Q}", "\\FF": "\\mathbb{F}",
    "\\P": "\\mathbb{P}", "\\Lin": "\\mathcal{L}", "\\B": "\\mathcal{B}", "\\Cc": "\\mathcal{C}",
    "\\ip": "\\langle #1,#2\\rangle", "\\norm": "\\lVert #1\\rVert", "\\Ran": "\\operatorname{Ran}", "\\Null": "\\operatorname{Null}",
    "\\Rank": "\\operatorname{Rank}", "\\Nullity": "\\operatorname{Nullity}", "\\spn": "\\operatorname{span}", "\\sign": "\\operatorname{sign}",
    "\\tr": "\\operatorname{tr}", "\\diag": "\\operatorname{diag}", "\\RS": "\\operatorname{RS}", "\\CS": "\\operatorname{CS}",
  };
  LA.renderMath = function (el) {
    if (!window.renderMathInElement || !el) return;
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
        strict: "ignore",
        trust: false,
        macros: Object.assign({}, LA.KATEX_MACROS),
      });
    } catch (e) { console.warn("KaTeX render error", e); }
  };
  LA.tex = function (s, display) {
    if (!window.katex) return esc(s);
    try { return window.katex.renderToString(s, { displayMode: !!display, throwOnError: false, strict: "ignore", macros: Object.assign({}, LA.KATEX_MACROS) }); }
    catch (e) { return '<span class="err">' + esc(s) + "</span>"; }
  };

  /* ---------------- Toasts & confetti ---------------- */
  LA.toast = function (title, msg, ms) {
    let host = $(".toasts");
    if (!host) { host = document.createElement("div"); host.className = "toasts"; document.body.appendChild(host); }
    const t = document.createElement("div"); t.className = "toast";
    t.innerHTML = "<b>" + title + "</b>" + (msg ? '<span class="muted small">' + msg + "</span>" : "");
    host.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 320); }, ms || 2600);
  };
  LA.confetti = function (opts) {
    if (!window.confetti || store.get("calm", false)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.confetti(Object.assign({ particleCount: 120, spread: 75, origin: { y: 0.7 }, colors: ["#22d3ee", "#a78bfa", "#f472b6", "#a3e635", "#fbbf24"] }, opts || {}));
  };

  /* ---------------- Gamification ---------------- */
  const LEVELS = ["Scalar", "Vector", "Span", "Subspace", "Basis", "Dimension", "Kernel Hunter", "Rank Ranger", "Isomorphism", "Inner Product", "Orthonormal", "Gram–Schmidt Sage", "Eigen-Master", "Linear Legend"];
  const XP_PER_LEVEL = 150;
  LA.state = {
    xp: store.get("xp", 0),
    streak: store.get("streak", { n: 0, last: null, best: 0 }),
    done: store.get("done", {}), // section completions "ch3/3.1": timestamp
    stats: store.get("stats", { quizCorrect: 0, quizPerfect: 0, practice: 0, practiceByType: {}, mocks: 0, mockBest: 0, flash: 0, parsons: 0, labs: {}, gs: 0 }),
    badges: store.get("badges", {}),
  };
  LA.save = function () { const s = LA.state; store.set("xp", s.xp); store.set("streak", s.streak); store.set("done", s.done); store.set("stats", s.stats); store.set("badges", s.badges); };
  LA.level = function () { const xp = LA.state.xp; const lvl = Math.floor(xp / XP_PER_LEVEL); return { lvl: lvl + 1, name: LEVELS[Math.min(lvl, LEVELS.length - 1)], into: xp % XP_PER_LEVEL, need: XP_PER_LEVEL }; };
  LA.addXP = function (n, why) {
    const before = LA.level().lvl;
    LA.state.xp += n; LA.save(); LA.updateHeader();
    if (why) LA.toast("+" + n + " XP", why, 1800);
    const after = LA.level();
    if (after.lvl > before) { setTimeout(() => { LA.toast("🎉 Level up! Level " + after.lvl, "You are now: " + after.name, 3600); LA.confetti({ particleCount: 180 }); }, 400); }
    LA.checkBadges();
  };
  LA.stat = function (key, inc, sub) {
    const st = LA.state.stats;
    if (sub) { st[key] = st[key] || {}; st[key][sub] = (st[key][sub] || 0) + (inc || 1); }
    else st[key] = (st[key] || 0) + (inc || 1);
    LA.save(); LA.checkBadges();
  };
  LA.touchStreak = function () {
    const today = new Date(); const key = today.toISOString().slice(0, 10);
    const s = LA.state.streak;
    if (s.last === key) return;
    const y = new Date(today.getTime() - 864e5).toISOString().slice(0, 10);
    s.n = s.last === y ? s.n + 1 : 1; s.last = key; s.best = Math.max(s.best || 0, s.n);
    LA.save();
  };

  LA.BADGES = [
    { id: "first", ico: "🌱", name: "First Steps", desc: "Complete your first lesson section", test: (s) => Object.keys(s.done).length >= 1 },
    { id: "ch3", ico: "🔁", name: "Transformer", desc: "Complete every section of Chapter 3", test: () => LA.chapterProgress("ch3").pct === 100 },
    { id: "ch4", ico: "📐", name: "Orthogonal Mind", desc: "Complete every section of Chapter 4", test: () => LA.chapterProgress("ch4").pct === 100 },
    { id: "all", ico: "👑", name: "Course Complete", desc: "Complete every section of every chapter", test: () => Object.keys(LA.chapters).every((k) => LA.chapterProgress(k).pct === 100) },
    { id: "quiz10", ico: "⚡", name: "Quick Thinker", desc: "Answer 10 quiz questions correctly", test: (s) => s.stats.quizCorrect >= 10 },
    { id: "quiz50", ico: "🧠", name: "Big Brain", desc: "Answer 50 quiz questions correctly", test: (s) => s.stats.quizCorrect >= 50 },
    { id: "perfect", ico: "💯", name: "Flawless", desc: "Score 100% on a quiz", test: (s) => s.stats.quizPerfect >= 1 },
    { id: "prac10", ico: "♾️", name: "Grinder", desc: "Solve 10 practice-arena problems", test: (s) => s.stats.practice >= 10 },
    { id: "prac40", ico: "🏋️", name: "Unstoppable", desc: "Solve 40 practice-arena problems", test: (s) => s.stats.practice >= 40 },
    { id: "gs", ico: "🪄", name: "Gram–Schmidt Wizard", desc: "Run 5 Gram–Schmidt computations (lab or practice)", test: (s) => s.stats.gs >= 5 },
    { id: "mock", ico: "⏱️", name: "Exam Simulation", desc: "Finish a mock coursework test", test: (s) => s.stats.mocks >= 1 },
    { id: "mock80", ico: "🏅", name: "Ready for It", desc: "Score 80%+ on a mock test", test: (s) => s.stats.mockBest >= 80 },
    { id: "flash50", ico: "🃏", name: "Card Shark", desc: "Review 50 flashcards", test: (s) => s.stats.flash >= 50 },
    { id: "proof5", ico: "✍️", name: "Proof Smith", desc: "Solve 5 proof puzzles", test: (s) => s.stats.parsons >= 5 },
    { id: "labs", ico: "🔬", name: "Lab Rat", desc: "Open 6 different interactive labs", test: (s) => Object.keys(s.stats.labs || {}).length >= 6 },
    { id: "streak3", ico: "🔥", name: "On Fire", desc: "Study 3 days in a row", test: (s) => (s.streak.best || 0) >= 3 },
    { id: "streak7", ico: "☄️", name: "Unbreakable", desc: "Study 7 days in a row", test: (s) => (s.streak.best || 0) >= 7 },
    { id: "lvl5", ico: "🚀", name: "Level 5", desc: "Reach level 5", test: () => LA.level().lvl >= 5 },
  ];
  LA.checkBadges = function () {
    const s = LA.state;
    LA.BADGES.forEach((b) => {
      if (s.badges[b.id]) return;
      let ok = false; try { ok = b.test(s); } catch (e) { ok = false; }
      if (ok) { s.badges[b.id] = Date.now(); LA.save(); setTimeout(() => { LA.toast(b.ico + " Badge unlocked: " + b.name, b.desc, 3800); LA.confetti({ particleCount: 90, spread: 100 }); }, 600); }
    });
  };

  /* ---------------- Chapters & progress ---------------- */
  LA.chapter = function (def) { LA.chapters[def.id] = def; };
  LA.chapterProgress = function (id) {
    const ch = LA.chapters[id]; if (!ch) return { done: 0, total: 0, pct: 0 };
    const total = ch.sections.length;
    const done = ch.sections.filter((s) => LA.state.done[id + "/" + s.id]).length;
    return { done, total, pct: total ? Math.round((100 * done) / total) : 0 };
  };
  LA.toggleDone = function (key) {
    if (LA.state.done[key]) { delete LA.state.done[key]; LA.save(); LA.updateNav(); return false; }
    LA.state.done[key] = Date.now(); LA.save(); LA.addXP(15, "Section completed"); LA.updateNav(); return true;
  };

  /* ---------------- Router ---------------- */
  // register a cleanup to run when the user navigates away (window listeners, timers…)
  LA.onLeave = function (fn) { (LA._leave = LA._leave || []).push(fn); };
  LA.page = function (pattern, def) { LA.pages.push(Object.assign({ pattern }, def)); };
  function matchRoute(path) {
    for (const p of LA.pages) {
      const a = p.pattern.split("/").filter(Boolean), b = path.split("/").filter(Boolean);
      if (a.length !== b.length) continue;
      const params = {}; let ok = true;
      for (let i = 0; i < a.length; i++) { if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]); else if (a[i] !== b[i]) { ok = false; break; } }
      if (ok) return { page: p, params };
    }
    return null;
  }
  LA.parseHash = function () {
    const h = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = h.split("?");
    const q = {}; if (qs) qs.split("&").forEach((kv) => { const [k, v] = kv.split("="); q[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
    return { path: path || "/", q };
  };
  LA.go = function (hash) { if (location.hash === hash) LA.route(); else location.hash = hash; };
  LA.current = null;
  LA.route = function () {
    const { path, q } = LA.parseHash();
    const m = matchRoute(path) || matchRoute("/404");
    const view = $("#view");
    if (LA.current && LA.current.page.leave) { try { LA.current.page.leave(); } catch (e) { /* noop */ } }
    LA.setResize(null);
    (LA._leave || []).splice(0).forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
    LA.current = m;
    let html;
    try { html = m.page.render(m.params, q); } catch (e) { console.error(e); html = '<div class="page"><div class="card"><h2>Something went wrong</h2><pre class="err">' + esc(e.stack || e.message) + "</pre></div></div>"; }
    view.innerHTML = "";
    if (typeof html === "string") view.innerHTML = html; else if (html) view.appendChild(html);
    document.title = (m.page.title ? (typeof m.page.title === "function" ? m.page.title(m.params) : m.page.title) + " · " : "") + "MATH2273 Linear Algebra I";
    LA.enhance(view);
    if (m.page.after) { try { m.page.after(view, m.params, q); } catch (e) { console.error(e); } }
    (LA.afterRoute || []).forEach((fn) => { try { fn(view, m, q); } catch (e) { console.error(e); } });
    LA.renderMath(view);
    LA.updateNav();
    document.body.classList.remove("nav-open");
    if (q.go) { const t = document.getElementById(q.go); if (t) { setTimeout(() => { t.scrollIntoView({ behavior: "smooth", block: "start" }); t.animate([{ boxShadow: "0 0 0 3px rgba(251,191,36,.9)" }, { boxShadow: "0 0 0 0 rgba(251,191,36,0)" }], { duration: 1800 }); }, 60); } }
    else window.scrollTo(0, 0);
    if (m.page.lab) { LA.state.stats.labs[m.page.lab] = 1; LA.save(); LA.checkBadges(); }
  };

  /* ---------------- Enhancers (boxes, steppers, etc.) ---------------- */
  const TAGS = { def: "Definition", thm: "Theorem", prop: "Proposition", lem: "Lemma", cor: "Corollary", rem: "Remark", note: "Note", ex: "Example", proof: "Proof", tip: "Tip · Trick", trap: "Exam trap", exam: "Exam focus", intuition: "Intuition", recipe: "Recipe", beyond: "Beyond the notes", template: "Proof template", errata: "Correction" };
  LA.TAGS = TAGS;
  LA.boxTag = function (el) { for (const c of el.classList) if (TAGS[c]) return TAGS[c]; return ""; };
  /* Depth levels: every box gets data-level f (Foundation), s (University Standard) or a (Advanced Enrichment).
     Content can set data-level explicitly; otherwise the default depends on the box type. */
  LA.DEPTH = {
    f: { name: "Foundation", desc: "Core definitions, statements, examples, intuition, tips and traps — what you need to follow the course." },
    s: { name: "University Standard", desc: "Everything examinable at university level: adds full proofs, exam-style questions and proof templates." },
    a: { name: "Advanced Enrichment", desc: "Goes deeper than the notes require (clearly labelled). Great for understanding — check with your lecturer before relying on it in an exam." },
  };
  const LVL_DEFAULT = { proof: "s", template: "s", exam: "s", beyond: "a" };
  LA.boxLevel = function (b) { if (b.dataset.level) return b.dataset.level; for (const c of b.classList) if (LVL_DEFAULT[c]) return LVL_DEFAULT[c]; return "f"; };
  LA.enhance = function (root) {
    $$(".box", root).forEach((b) => {
      if (b.dataset.enh) return; b.dataset.enh = "1";
      b.dataset.level = LA.boxLevel(b);
      const t = b.getAttribute("data-t");
      const tag = b.getAttribute("data-tag") || LA.boxTag(b);
      if (t || tag) {
        const h = document.createElement("div"); h.className = "box-h";
        h.innerHTML = (tag ? '<span class="box-tag">' + tag + "</span>" : "") + (t ? '<span class="box-title">' + t + "</span>" : "") +
          (b.dataset.level === "a" && !/enrich/i.test(tag) ? '<span class="lvl-chip" title="' + LA.DEPTH.a.desc + '">★ Enrichment</span>' : "");
        b.insertBefore(h, b.firstChild);
        if (t && !b.id) b.id = "b-" + slug(t);
      }
      if (b.classList.contains("proof") && !b.querySelector(".qed")) { const q = document.createElement("span"); q.className = "qed"; q.textContent = "□"; b.appendChild(q); }
    });
    $$("details.reveal", root).forEach((d) => {
      if (d.dataset.enh) return; d.dataset.enh = "1";
      const sum = d.querySelector("summary");
      if (!sum) { const s = document.createElement("summary"); s.textContent = d.classList.contains("hint") ? "Hint" : "Show solution"; d.insertBefore(s, d.firstChild); }
      if (!d.querySelector(".reveal-body")) { const body = document.createElement("div"); body.className = "reveal-body"; Array.from(d.childNodes).forEach((n) => { if (n.nodeName !== "SUMMARY") body.appendChild(n); }); d.appendChild(body); }
    });
    $$(".stepper", root).forEach((s) => {
      if (s.dataset.enh) return; s.dataset.enh = "1";
      const steps = $$(".step", s); if (!steps.length) return;
      let shown = 1; steps[0].classList.add("shown");
      const ctl = document.createElement("div"); ctl.className = "step-ctl";
      ctl.innerHTML = '<button class="btn btn-sm btn-primary nx">Next step ▸</button><button class="btn btn-sm all">Show all</button><button class="btn btn-sm btn-ghost rs">Reset</button><span class="step-count"></span>';
      s.appendChild(ctl);
      const upd = () => { steps.forEach((st, i) => st.classList.toggle("shown", i < shown)); $(".step-count", ctl).textContent = "Step " + shown + " / " + steps.length; $(".nx", ctl).disabled = shown >= steps.length; };
      $(".nx", ctl).onclick = () => { shown = Math.min(steps.length, shown + 1); upd(); };
      $(".all", ctl).onclick = () => { shown = steps.length; upd(); };
      $(".rs", ctl).onclick = () => { shown = 1; upd(); };
      upd();
    });
  };

  /* ---------------- Layout & nav ---------------- */
  LA.NAV = [
    { title: "Start", items: [
      { href: "#/", ico: "🏠", label: "Home" },
      { href: "#/dashboard", ico: "📊", label: "Smart Dashboard" },
      { href: "#/notes", ico: "📝", label: "My Notes & Bookmarks" },
      { href: "#/plan", ico: "🎯", label: "Coursework Battle Plan", badge: "CH 3·4" },
    ] },
    { title: "Learn — Chapters", items: "CHAPTERS" },
    { title: "Master It", items: [
      { href: "#/learn", ico: "🎛️", label: "Topic Studio (5 modes)" },
      { href: "#/practice", ico: "♾️", label: "Adaptive Practice Arena" },
      { href: "#/proofs/examiner", ico: "🔎", label: "Proof Examiner" },
      { href: "#/proofs/drills", ico: "🧩", label: "Proof Drills" },
      { href: "#/counterexamples", ico: "🧪", label: "Counterexample Lab" },
      { href: "#/exams", ico: "🎓", label: "Exam Centre" },
    ] },
    { title: "Coursework Prep", items: [
      { href: "#/recipes", ico: "📋", label: "Question Recipes" },
      { href: "#/proofs", ico: "✍️", label: "Proof Studio" },
      { href: "#/quiz", ico: "⚡", label: "Quizzes" },
      { href: "#/mock", ico: "⏱️", label: "Mock Tests" },
      { href: "#/flashcards", ico: "🃏", label: "Flashcards" },
    ] },
    { title: "Interactive Labs", items: [
      { href: "#/labs/transform", ico: "🌀", label: "2D Transformation Visualizer" },
      { href: "#/labs/linearity", ico: "🔍", label: "Linearity Checker" },
      { href: "#/labs/kernel", ico: "🕳️", label: "Kernel · Range · Rank–Nullity" },
      { href: "#/labs/matrix", ico: "🧮", label: "Matrix of T w.r.t. Bases" },
      { href: "#/labs/gram-schmidt", ico: "🪄", label: "Gram–Schmidt Machine" },
      { href: "#/labs/gs3d", ico: "🧊", label: "3D Orthogonality Visualizer" },
      { href: "#/labs/inner", ico: "〈〉", label: "Inner Product Lab" },
      { href: "#/labs/rref", ico: "🪜", label: "Row Reduction Stepper" },
      { href: "#/labs/det", ico: "🔢", label: "Determinant Lab" },
      { href: "#/labs/eigen", ico: "🧿", label: "Eigen Lab" },
      { href: "#/labs/change-of-basis", ico: "🧭", label: "Change-of-Basis Lab" },
      { href: "#/labs/quadratic", ico: "🥚", label: "Quadratic Forms Lab" },
      { href: "#/labs/gs-studio", ico: "🎬", label: "Gram–Schmidt Studio" },
      { href: "#/labs/calculator", ico: "🧮", label: "Matrix Calculator" },
    ] },
    { title: "Reference", items: [
      { href: "#/encyclopedia", ico: "📚", label: "Encyclopedia & Theorems" },
      { href: "#/map", ico: "🗺️", label: "Concept Map" },
      { href: "#/formulas", ico: "📜", label: "Formula & Theorem Sheet" },
      { href: "#/glossary", ico: "🔤", label: "Glossary & Notation" },
      { href: "#/pastpapers", ico: "🗂️", label: "Past Papers" },
      { href: "#/beyond", ico: "🚀", label: "Beyond the Notes" },
      { href: "#/syllabus", ico: "🧭", label: "Syllabus Coverage" },
      { href: "#/errata", ico: "🩹", label: "Notes Corrections" },
      { href: "#/print", ico: "🖨️", label: "Print Sheets" },
      { href: "#/progress", ico: "🏆", label: "Progress, Badges & Data" },
      { href: "#/settings", ico: "⚙️", label: "Settings & Accessibility" },
    ] },
  ];
  function chapterNavItems() {
    return Object.values(LA.chapters).sort((a, b) => a.num - b.num).map((c) => ({ href: "#/ch/" + c.num, ico: "<b class=\"grad-text\">" + c.num + "</b>", label: c.short || c.title, chId: c.id, badge: c.test ? "TEST" : null }));
  }
  LA.renderNav = function () {
    const nav = $("#sidebar"); if (!nav) return;
    nav.innerHTML = LA.NAV.map((g) => {
      const items = g.items === "CHAPTERS" ? chapterNavItems() : g.items;
      return '<div class="nav-group"><div class="nav-group-title">' + g.title + "</div>" + items.map((it) => {
        const extra = it.chId ? '<span class="nav-prog" data-prog="' + it.chId + '"></span>' : "";
        const badge = it.badge ? '<span class="nav-badge">' + it.badge + "</span>" : "";
        return '<a class="nav-link" href="' + it.href + '"><span class="nav-ico">' + it.ico + "</span><span>" + it.label + "</span>" + (badge || extra) + "</a>";
      }).join("") + "</div>";
    }).join("") + '<div class="nav-group small muted" style="padding:0 10px">Built from the MATH2273 notes (V. Job) · <a href="#/about">About this site</a></div>';
  };
  LA.updateNav = function () {
    const { path } = LA.parseHash();
    $$("#sidebar .nav-link").forEach((a) => {
      const href = a.getAttribute("href").replace(/^#/, "");
      const active = href === path || (href !== "/" && path.startsWith(href + "/")) || (href !== "/" && path === href);
      a.classList.toggle("active", active);
    });
    $$("#sidebar [data-prog]").forEach((s) => { const p = LA.chapterProgress(s.dataset.prog); if (!s.parentElement.querySelector(".nav-badge")) s.textContent = p.done ? p.pct + "%" : ""; });
  };
  LA.updateHeader = function () {
    const l = LA.level();
    const c = $("#xpchip"); if (!c) return;
    c.innerHTML = '<span class="lvl">' + l.lvl + '</span><span class="xp-info"><b>' + l.name + "</b>" + LA.state.xp + " XP<span class=\"xp-bar\"><i style=\"width:" + Math.round((100 * l.into) / l.need) + '%"></i></span></span>';
    const s = $("#streak"); if (s) s.innerHTML = "🔥 " + (LA.state.streak.n || 0);
  };
  LA.setTheme = function (t) { document.documentElement.setAttribute("data-theme", t); store.set("theme", t); const b = $("#themeBtn"); if (b) b.textContent = t === "light" ? "🌙" : "☀️"; };

  /* ---------------- Search palette ---------------- */
  let INDEX = null;
  const KEEP = { det: 1, ker: 1, dim: 1, Rank: 1, Nullity: 1, Null: 1, Ran: 1, spn: "span", span: 1, tr: 1, diag: 1, lambda: 1, perp: 1, sqrt: 1 };
  function stripTex(s) { return s.replace(/\\([a-zA-Z]+)/g, (m0, w) => (KEEP[w] ? " " + (KEEP[w] === 1 ? w : KEEP[w]) + " " : " ")).replace(/[{}$^_\\]/g, " ").replace(/\s+/g, " ").trim(); }
  function buildIndex() {
    const idx = [];
    const tmp = document.createElement("div");
    Object.values(LA.chapters).forEach((ch) => {
      idx.push({ t: "Chapter " + ch.num + " — " + ch.title, m: ch.blurb || "", href: "#/ch/" + ch.num, k: "chapter" });
      ch.sections.forEach((sec) => {
        idx.push({ t: sec.id + " " + sec.title, m: "Chapter " + ch.num + " section", href: "#/ch/" + ch.num + "?go=sec-" + slug(sec.id), k: "section" });
        tmp.innerHTML = sec.html;
        $$(".box[data-t]", tmp).forEach((b) => {
          const t = b.getAttribute("data-t"); const tag = b.getAttribute("data-tag") || LA.boxTag(b);
          idx.push({ t: (tag ? tag + " · " : "") + stripTex(t), m: stripTex(b.textContent).slice(0, 140), href: "#/ch/" + ch.num + "?go=b-" + slug(t), k: "box" });
        });
      });
    });
    LA.searchExtra.forEach((e) => idx.push(e));
    LA.pages.forEach((p) => { if (p.searchTitle) idx.push({ t: p.searchTitle, m: p.searchDesc || "", href: "#" + p.pattern, k: "page" }); });
    return idx;
  }
  LA.openSearch = function () {
    if (!INDEX) INDEX = buildIndex();
    const back = LA.h('<div class="modal-back"><div class="modal" role="dialog" aria-label="Search"><div class="modal-head">🔎<input type="search" placeholder="Search definitions, theorems, labs, recipes…  (e.g. kernel, Gram, isomorphism)" aria-label="Search"><kbd>Esc</kbd></div><div class="modal-body"></div></div></div>');
    document.body.appendChild(back);
    const input = $("input", back), body = $(".modal-body", back);
    let sel = 0, results = [];
    const close = () => back.remove();
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { results = INDEX.filter((e) => e.k === "page" || e.k === "chapter").slice(0, 30); }
      else {
        const words = q.split(/\s+/);
        results = INDEX.map((e) => { const T = e.t.toLowerCase(), Mm = (e.m || "").toLowerCase(); let sc = 0; for (const w of words) { if (T.includes(w)) sc += 3; else if (Mm.includes(w)) sc += 1; else return null; } if (T.startsWith(words[0])) sc += 2; if (e.k === "box") sc += 0.5; return { e, sc }; }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 40).map((x) => x.e);
      }
      sel = Math.min(sel, Math.max(0, results.length - 1));
      const hl = (s) => { let out = esc(s); if (q) q.split(/\s+/).forEach((w) => { if (w.length > 1) out = out.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return out; };
      body.innerHTML = results.length ? results.map((e, i) => '<a class="s-item' + (i === sel ? " sel" : "") + '" href="' + e.href + '"><div class="s-t">' + hl(e.t) + '</div><div class="s-m">' + hl(e.m || "") + "</div></a>").join("") : '<div class="muted" style="padding:14px">No matches. Try a different word (e.g. "orthogonal", "nullity", "basis").</div>';
      $$(".s-item", body).forEach((a) => a.addEventListener("click", close));
    };
    input.addEventListener("input", () => { sel = 0; draw(); });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") { sel = Math.min(results.length - 1, sel + 1); draw(); ev.preventDefault(); }
      else if (ev.key === "ArrowUp") { sel = Math.max(0, sel - 1); draw(); ev.preventDefault(); }
      else if (ev.key === "Enter") { const r = results[sel]; if (r) { location.hash = r.href; close(); } }
      else if (ev.key === "Escape") close();
    });
    back.addEventListener("click", (ev) => { if (ev.target === back) close(); });
    draw(); input.focus();
  };

  /* ---------------- Dialog helper ---------------- */
  LA.dialog = function (html, onMount) {
    const back = LA.h('<div class="modal-back"><div class="modal dialog" role="dialog">' + html + '<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-sm close-dlg">Close</button></div></div></div>');
    document.body.appendChild(back);
    const close = () => back.remove();
    back.addEventListener("click", (ev) => { if (ev.target === back) close(); });
    $(".close-dlg", back).onclick = close;
    LA.renderMath(back);
    if (onMount) onMount(back, close);
    return close;
  };

  /* ---------------- Shared UI snippets ---------------- */
  // one resize handler per page (replaced on navigation, so listeners never pile up)
  LA.setResize = function (fn) { if (LA._rs) window.removeEventListener("resize", LA._rs); LA._rs = fn; if (fn) window.addEventListener("resize", fn, { passive: true }); };
  LA.ring = (pct, label) => '<div class="ring" style="--p:' + pct + '"><span>' + (label === undefined ? pct + "%" : label) + "</span></div>";
  LA.sectionTitle = (t) => '<div class="section-title"><h2>' + t + "</h2></div>";

  /* ---------------- Boot ---------------- */
  LA.boot = function () {
    LA.setTheme(store.get("theme", "dark"));
    if (store.get("calm", false)) document.documentElement.classList.add("calm");
    LA.touchStreak();
    LA.renderNav();
    LA.updateHeader();
    $("#themeBtn").onclick = () => LA.setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    $("#searchBtn").onclick = LA.openSearch;
    $("#menuBtn").onclick = () => document.body.classList.toggle("nav-open");
    $(".scrim").onclick = () => document.body.classList.remove("nav-open");
    $("#xpchip").onclick = () => LA.go("#/progress");
    document.addEventListener("keydown", (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); LA.openSearch(); }
      else if (ev.key === "/" && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "")) { ev.preventDefault(); LA.openSearch(); }
    });
    window.addEventListener("hashchange", LA.route);
    LA.route();
    setTimeout(LA.checkBadges, 1200);
  };
})();
