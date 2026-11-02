/* Exam Centre: build → sit (timed) → mark (component-based) → report → history.
   Written questions are self-marked against their marking schemes; computational questions are auto-checked
   (final answer) with self-assessed method marks. The official final is "one 2-hour written paper" (course outline). */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const CUR = "examCurrent", HIST = "examHistory";
  const COMP_MARKS = { beginner: 4, standard: 6, advanced: 8, challenge: 10 };
  const fmtT = (s) => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : String(m)) + ":" + String(x).padStart(2, "0"); };
  const QB = () => LA.EXAM_QUESTIONS || [];
  const qById = (id) => QB().find((q) => q.id === id);

  /* ---------------- building ---------------- */
  const PRESETS = {
    final: { title: "Final exam simulation", desc: "One 2-hour written paper, about 100 marks, every chapter — the format in the official course outline.", minutes: 120, icon: "🎓" },
    cw34: { title: "Coursework test simulation (Ch 3 & 4)", desc: "60 minutes, about 50 marks on linear transformations and inner product spaces.", minutes: 60, icon: "🎯" },
    chapter: { title: "Chapter test", desc: "45 minutes, about 40 marks on one chapter.", minutes: 45, icon: "📘" },
    proof: { title: "Proof-heavy paper", desc: "60 minutes of proof questions marked for structure and justification.", minutes: 60, icon: "✍️" },
    comp: { title: "Computational sprint", desc: "30 minutes, 8 auto-checked problems from the generator bank.", minutes: 30, icon: "⚡" },
  };
  function pickWritten(rng, filter, used) { const pool = QB().filter((q) => !used.has(q.id) && filter(q)); if (!pool.length) return null; const q = rng.pick(pool); used.add(q.id); return { kind: "written", qid: q.id, marks: q.marks }; }
  function pickComp(rng, topics, diff) { const gens = LA.bank.list().filter((g) => !topics || topics.includes(g.topic)); const g = rng.pick(gens); const d = diff === "mixed" ? rng.pick(["standard", "standard", "advanced", "challenge"]) : diff; return { kind: "comp", gen: g.id, seed: rng.int(1, 999999), diff: d, topic: g.topic, marks: COMP_MARKS[d] }; }
  LA.buildExam = function (cfg) {
    const seed = cfg.seed || LA.newSeed(), rng = LA.RNG(seed), used = new Set(), items = [];
    const chOf = (q) => q.ch, total = () => items.reduce((s, it) => s + it.marks, 0);
    const fill = (target, topics, diff) => { let guard = 0; while (total() < target - 3 && guard++ < 40) items.push(pickComp(rng, topics, diff || "mixed")); };
    if (cfg.preset === "final") {
      [[1, 2], [2], [3], [3], [4], [4], [5, 6], [7], [8]].forEach((chs) => { if (total() < 92) { const it = pickWritten(rng, (q) => chs.includes(chOf(q)) && !q.mock, used); if (it && total() + it.marks <= 104) items.push(it); } });
      fill(100);
    } else if (cfg.preset === "cw34") {
      for (let i = 0; i < 3; i++) { const it = pickWritten(rng, (q) => (q.ch === 3 || q.ch === 4) && total() + q.marks <= 50, used); if (it) items.push(it); }
      fill(50, LA.TOPICS.filter((t) => t.ch === 3 || t.ch === 4).map((t) => t.id));
    } else if (cfg.preset === "chapter") {
      const ch = +cfg.ch || 3, tps = LA.topicsOf(ch).map((t) => t.id);
      for (let i = 0; i < 3; i++) { const it = pickWritten(rng, (q) => q.ch === ch && total() + q.marks <= 40, used); if (it) items.push(it); }
      fill(40, tps);
    } else if (cfg.preset === "proof") {
      for (let i = 0; i < 6 && total() < 48; i++) { const it = pickWritten(rng, (q) => q.kind === "proof" && total() + q.marks <= 54, used); if (it) items.push(it); }
    } else if (cfg.preset === "comp") {
      const tps = cfg.chapters ? LA.TOPICS.filter((t) => cfg.chapters.includes(t.ch)).map((t) => t.id) : null;
      for (let i = 0; i < (cfg.n || 8); i++) items.push(pickComp(rng, tps, cfg.diff || "mixed"));
    } else { // custom
      const chs = cfg.chapters && cfg.chapters.length ? cfg.chapters : [1, 2, 3, 4, 5, 6, 7, 8];
      const tps = cfg.topics && cfg.topics.length ? cfg.topics : LA.TOPICS.filter((t) => chs.includes(t.ch)).map((t) => t.id);
      const kinds = cfg.kinds || { written: true, proof: true, comp: true };
      const n = Math.max(1, Math.min(20, cfg.n || 6));
      for (let i = 0; i < n; i++) {
        const wantW = (kinds.written || kinds.proof) && (!kinds.comp || rng.bool(0.5));
        let it = null;
        if (wantW) it = pickWritten(rng, (q) => q.topics.some((t) => tps.includes(t)) && ((kinds.written && q.kind === "written") || (kinds.proof && q.kind === "proof")) && (cfg.diff === "mixed" || !cfg.diff || q.diff === cfg.diff || cfg.diff === "advanced"), used);
        if (!it && kinds.comp) it = pickComp(rng, tps, cfg.diff || "mixed");
        if (it) items.push(it);
      }
    }
    const P0 = PRESETS[cfg.preset] || { title: "Custom exam" };
    return { id: "ex" + Date.now().toString(36), seed, preset: cfg.preset || "custom", title: cfg.title || P0.title + (cfg.preset === "chapter" ? " — Chapter " + (cfg.ch || 3) : ""), minutes: +cfg.minutes || P0.minutes || 60, created: Date.now(), items, answers: {}, flags: {}, timeOn: {}, status: "running", startedAt: Date.now(), marking: {} };
  };
  const totalMarks = (ex) => ex.items.reduce((s, it) => s + it.marks, 0);
  const problemOf = (it) => LA.bank.make(it.gen, it.seed, it.diff);

  /* ---------------- Exam Centre ---------------- */
  LA.page("/exams", {
    title: "Exam Centre", searchTitle: "Exam Centre", searchDesc: "2-hour final simulation, coursework test, chapter, proof and custom exams with marking schemes and reports",
    render(p, q) {
      const cur = LA.store.get(CUR, null), hist = LA.store.get(HIST, []);
      const chs = Object.values(LA.chapters).sort((a, b) => a.num - b.num);
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Assessment</div><h1>Exam Centre</h1><p class="lead">Sit realistic timed papers, mark them against component-based marking schemes (method, accuracy, justification, proof structure, notation, completeness, final answer), and get a report that tells you exactly what to revise.</p>' +
        (cur && cur.status !== "done" ? '<div class="row"><a class="btn btn-primary btn-lg" href="#/exams/' + (cur.status === "running" ? "run" : "mark") + '">▶ Resume: ' + esc(cur.title) + "</a></div>" : "") + "</div></div>" +
        LA.sectionTitle("Presets") + '<div class="grid grid-3">' + Object.entries(PRESETS).map(([k, v]) => '<div class="card"><div class="feature-ico">' + v.icon + '</div><h3 style="margin:.2em 0">' + v.title + '</h3><p class="small muted">' + v.desc + "</p>" + (k === "chapter" ? '<select id="chSel" aria-label="Chapter">' + chs.map((c) => '<option value="' + c.num + '">Chapter ' + c.num + " · " + esc(c.short || c.title) + "</option>").join("") + "</select> " : "") + '<button class="btn btn-primary" data-preset="' + k + '">Start</button></div>').join("") +
        '<div class="card"><div class="feature-ico">📜</div><h3 style="margin:.2em 0">Original mock tests</h3><p class="small muted">The three 60-minute coursework mocks with their marking schemes (unchanged).</p><a class="btn" href="#/mock">Open mocks</a></div></div>' +
        LA.sectionTitle("Build your own") + '<div class="card"><div class="grid grid-2"><div><div class="kicker">Chapters</div><div class="row" style="gap:4px">' + chs.map((c) => '<label class="toggle"><input type="checkbox" class="cbCh" value="' + c.num + '"' + (c.num === 3 || c.num === 4 ? " checked" : "") + "> " + c.num + "</label>").join("") + '</div><div class="kicker" style="margin-top:10px">Question types</div><div class="row"><label class="toggle"><input type="checkbox" id="kW" checked> Written</label><label class="toggle"><input type="checkbox" id="kP" checked> Proof</label><label class="toggle"><input type="checkbox" id="kC" checked> Computational (auto-checked)</label></div></div>' +
        '<div class="grid grid-3"><label class="field">Questions<input type="number" id="cN" min="1" max="20" value="6"></label><label class="field">Time (minutes)<input type="number" id="cT" min="5" max="240" value="60"></label><label class="field">Difficulty<select id="cD"><option value="mixed">Mixed</option><option value="beginner">Beginner</option><option value="standard">Standard</option><option value="advanced">Advanced</option><option value="challenge">Challenge</option></select></label></div></div>' +
        '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="cGo">Build & start</button><span class="small muted">Questions are drawn from ' + QB().length + " written/proof questions and " + LA.bank.list().length + " generators.</span></div></div>" +
        LA.sectionTitle("History") + (hist.length ? '<div class="tbl-wrap"><table class="tbl"><tr><th>Date</th><th>Exam</th><th>Score</th><th>Time</th><th></th></tr>' + hist.slice().reverse().map((h) => "<tr><td>" + new Date(h.created).toLocaleDateString() + "</td><td>" + esc(h.title) + "</td><td><b>" + h.result.got + "/" + h.result.total + "</b> (" + Math.round(h.result.pct) + "%)</td><td>" + fmtT(h.result.time) + '</td><td><a href="#/exams/report/' + h.id + '">Report ▸</a></td></tr>').join("") + "</table></div>" + '<div class="card" style="margin-top:12px"><div class="kicker">Score trend</div>' + trend(hist) + "</div>" : '<p class="muted">No exams taken yet.</p>') + "</div>";
    },
    after(view, p, q) {
      const start = (cfg) => {
        const cur = LA.store.get(CUR, null);
        if (cur && cur.status !== "done" && !confirm("Abandon the exam in progress (" + cur.title + ")?")) return;
        const ex = LA.buildExam(cfg);
        if (!ex.items.length) { LA.toast("No questions match", "Widen the chapters or question types."); return; }
        LA.store.set(CUR, ex); LA.go("#/exams/run");
      };
      $$("[data-preset]", view).forEach((b) => b.addEventListener("click", () => start({ preset: b.dataset.preset, ch: ($("#chSel", view) || {}).value })));
      $("#cGo", view).onclick = () => start({ preset: "custom", chapters: $$(".cbCh:checked", view).map((c) => +c.value), kinds: { written: $("#kW", view).checked, proof: $("#kP", view).checked, comp: $("#kC", view).checked }, n: +$("#cN", view).value, minutes: +$("#cT", view).value, diff: $("#cD", view).value });
      if (q.topic) { // from Topic Studio: custom exam on one topic
        const tp = LA.topic(q.topic); if (tp) start({ preset: "custom", title: "Topic exam — " + tp.title, topics: [tp.id], chapters: [tp.ch], n: 4, minutes: 30, kinds: { written: true, proof: true, comp: true } });
      }
    },
  });
  LA.page("/exams/new", { title: "New exam", render() { return '<div class="page"><div class="card">Preparing your exam…</div></div>'; }, after(v, p, q) { setTimeout(() => LA.go("#/exams" + (q.topic ? "?topic=" + q.topic : "")), 0); } });
  function trend(hist) {
    const pts = hist.slice(-12), W = 520, Hh = 120, n = pts.length;
    if (n < 2) return '<p class="small muted">Take another exam to see your trend.</p>';
    const xy = pts.map((h, i) => [20 + (i * (W - 40)) / (n - 1), Hh - 15 - (h.result.pct / 100) * (Hh - 30)]);
    return '<svg viewBox="0 0 ' + W + " " + Hh + '" class="trend" role="img" aria-label="Exam score trend"><line x1="20" x2="' + (W - 20) + '" y1="' + (Hh - 15 - 0.5 * (Hh - 30)) + '" y2="' + (Hh - 15 - 0.5 * (Hh - 30)) + '" class="t50"/><polyline points="' + xy.map((p) => p.join(",")).join(" ") + '" class="tline"/>' + xy.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" class="tdot"><title>' + Math.round(pts[i].result.pct) + "% · " + esc(pts[i].title) + "</title></circle>").join("") + '<text x="' + (W - 18) + '" y="' + (Hh - 15 - 0.5 * (Hh - 30) - 4) + '" class="tlab" text-anchor="end">50%</text></svg>';
  }

  /* ---------------- sitting the exam ---------------- */
  LA.page("/exams/run", {
    title: "Exam in progress",
    render() {
      const ex = LA.store.get(CUR, null);
      if (!ex || ex.status !== "running") return '<div class="page"><div class="card">No exam in progress. <a href="#/exams">Exam Centre</a></div></div>';
      return '<div class="page wide exam-run"><div class="exam-bar card"><div><div class="kicker" style="margin:0">' + esc(ex.title) + '</div><div class="small muted">' + ex.items.length + " questions · " + totalMarks(ex) + ' marks</div></div><div class="timer big" id="exTimer" aria-live="off">--:--</div><div class="row"><span class="small muted" id="exProg"></span><button class="btn btn-primary" id="exFinish">Finish &amp; mark ▸</button></div></div>' +
        '<div class="exam-grid"><nav class="exam-nav card" aria-label="Questions">' + ex.items.map((it, i) => '<button class="qnav" data-qi="' + i + '">Q' + (i + 1) + "<small>" + it.marks + "m</small></button>").join("") + '</nav><div id="exQ"></div></div></div>';
    },
    after(view) {
      const ex = LA.store.get(CUR, null); if (!ex || ex.status !== "running") return;
      let cur = 0, shownAt = Date.now();
      const save = () => LA.store.set(CUR, ex);
      const end = ex.startedAt + ex.minutes * 60000;
      const timerEl = $("#exTimer", view);
      const tick = () => {
        if (!document.body.contains(timerEl)) return clearInterval(iv);
        const left = (end - Date.now()) / 1000;
        timerEl.textContent = left >= 0 ? fmtT(left) : "+" + fmtT(-left);
        timerEl.classList.toggle("warn", left < 600 && left >= 300); timerEl.classList.toggle("danger", left < 300);
        if (left < 0 && !ex.overtimeWarned) { ex.overtimeWarned = true; save(); LA.dialog('<h3>Time is up</h3><p>In the real exam you would stop writing now. Finish and mark, or keep going (your report will show the overtime).</p><div class="row"><button class="btn btn-primary" id="dlgMark">Finish &amp; mark</button><button class="btn" id="dlgKeep">Keep going</button></div>', (d, close) => { $("#dlgMark", d).onclick = () => { close(); finish(); }; $("#dlgKeep", d).onclick = close; }); }
      };
      const iv = setInterval(tick, 1000); tick();
      const accTime = () => { ex.timeOn[cur] = (ex.timeOn[cur] || 0) + (Date.now() - shownAt) / 1000; shownAt = Date.now(); };
      const prog = () => { const n = ex.items.filter((_, i) => ex.answers[i] && Object.values(ex.answers[i]).some((v) => v !== "" && v !== null)).length; $("#exProg", view).textContent = n + "/" + ex.items.length + " answered"; $$(".qnav", view).forEach((b, i) => { b.classList.toggle("on", i === cur); b.classList.toggle("done", !!(ex.answers[i] && Object.values(ex.answers[i]).some((v) => v !== "" && v !== null))); b.classList.toggle("flag", !!ex.flags[i]); }); };
      const show = (i) => {
        accTime(); cur = i; const it = ex.items[i], host = $("#exQ", view), ans = ex.answers[i] || (ex.answers[i] = {});
        let body = "";
        if (it.kind === "written") {
          const qq = qById(it.qid);
          body = '<div class="row" style="gap:6px">' + qq.topics.map((t) => '<span class="chip">' + esc((LA.topic(t) || {}).title || t) + "</span>").join("") + '<span class="chip ' + (qq.kind === "proof" ? "pink" : "cyan") + '">' + (qq.kind === "proof" ? "Proof" : "Written") + "</span></div><h2 style=\"margin:.4em 0\">" + esc(qq.title) + "</h2>" +
            qq.parts.map((pp, k) => '<div class="exam-part"><div class="row spread"><b>' + pp.l + '</b><span class="chip">' + pp.m + " mark" + (pp.m > 1 ? "s" : "") + "</span></div><div>" + pp.q + '</div><textarea class="ex-work mono-in" data-k="' + k + '" rows="4" placeholder="Work on paper as in the real exam; jot your key steps / final answer here (optional — you will mark yourself against the scheme).">' + esc(ans[k] || "") + "</textarea></div>").join("");
        } else {
          const pr = problemOf(it), parts = pr.parts || [{ ans: pr.ans, opts: pr.opts, tf: pr.tf, input: pr.input, ph: pr.ph }];
          body = '<div class="row" style="gap:6px"><span class="chip">' + esc(LA.topic(it.topic).title) + '</span><span class="chip violet">Computational · auto-checked</span><span class="chip">' + LA.DIFF_LABEL[it.diff] + "</span></div><h2 style=\"margin:.4em 0\">" + esc(pr.title) + '</h2><div class="prob-q">' + pr.q + "</div>" +
            parts.map((pt, k) => { const lab = parts.length > 1 ? "<b>(" + "abcdef"[k] + ")</b> " + (pt.label || "") + "<br>" : ""; const v = ans[k]; if (pt.ans.type === "mcq") return '<div class="exam-part">' + lab + (pt.opts || pr.opts).map((o, j) => '<label class="check-item"><input type="radio" name="mc' + k + '" data-k="' + k + '" value="' + j + '"' + (String(v) === String(j) ? " checked" : "") + "> <span>" + o + "</span></label>").join("") + "</div>"; if (pt.ans.type === "tf") { const L = pt.tf || pr.tf || ["True", "False"]; return '<div class="exam-part">' + lab + ["true", "false"].map((tv, j) => '<label class="toggle"><input type="radio" name="tf' + k + '" data-k="' + k + '" value="' + tv + '"' + (v === tv ? " checked" : "") + "> " + L[j] + "</label>").join(" ") + "</div>"; } const area = (pt.input || pr.input) === "area"; return '<div class="exam-part">' + lab + (area ? '<textarea class="ex-ans mono-in" data-k="' + k + '" rows="3" placeholder="' + esc(pt.ph || pr.ph || "") + '">' + esc(v || "") + "</textarea>" : '<input type="text" class="ex-ans mono-in" data-k="' + k + '" value="' + esc(v || "") + '" placeholder="' + esc(pt.ph || pr.ph || "") + '">') + '<div class="readas small muted" data-ra="' + k + '"></div></div>'; }).join("");
        }
        host.innerHTML = '<div class="card"><div class="row spread"><span class="kicker" style="margin:0">Question ' + (i + 1) + " of " + ex.items.length + " · " + it.marks + ' marks</span><label class="toggle"><input type="checkbox" id="exFlag"' + (ex.flags[i] ? " checked" : "") + "> Flag for review</label></div>" + body +
          '<div class="row spread" style="margin-top:14px"><button class="btn" id="exPrev"' + (i === 0 ? " disabled" : "") + '>◂ Previous</button><button class="btn btn-primary" id="exNext">' + (i === ex.items.length - 1 ? "Review & finish" : "Next ▸") + "</button></div></div>";
        if (it.kind === "comp") host.querySelector(".card").appendChild(LA.mathKeys(host, "answer"));
        LA.renderMath(host);
        $$("textarea.ex-work, .ex-ans", host).forEach((el) => el.addEventListener("input", () => { ans[el.dataset.k] = el.value; save(); prog(); if (el.classList.contains("ex-ans")) { const pr = problemOf(it); const pt = (pr.parts || [{ ans: pr.ans }])[+el.dataset.k]; const t = LA.previewAnswer(pt.ans.type, el.value); const ra = $('[data-ra="' + el.dataset.k + '"]', host); if (ra) ra.innerHTML = t ? "Read as: " + LA.tex(t) : ""; } }));
        $$('input[type="radio"]', host).forEach((el) => el.addEventListener("change", () => { ans[el.dataset.k] = el.value; save(); prog(); }));
        $("#exFlag", host).onchange = (e) => { ex.flags[i] = e.target.checked; save(); prog(); };
        $("#exPrev", host).onclick = () => show(i - 1);
        $("#exNext", host).onclick = () => (i === ex.items.length - 1 ? finish() : show(i + 1));
        prog(); save();
      };
      function finish() {
        accTime();
        const unanswered = ex.items.filter((_, i) => !(ex.answers[i] && Object.values(ex.answers[i]).some((v) => v !== "" && v !== null))).length;
        if (unanswered && !confirm(unanswered + " question(s) have nothing recorded. Finish anyway? (Fine if you worked on paper.)")) return;
        clearInterval(iv); ex.status = "marking"; ex.finishedAt = Date.now(); save(); LA.go("#/exams/mark");
      }
      $("#exFinish", view).onclick = finish;
      $$(".qnav", view).forEach((b) => b.addEventListener("click", () => show(+b.dataset.qi)));
      show(0);
    },
    leave() { /* timer stops itself when the view is gone */ },
  });

  /* ---------------- marking ---------------- */
  LA.page("/exams/mark", {
    title: "Mark your exam",
    render() {
      const ex = LA.store.get(CUR, null);
      if (!ex || ex.status !== "marking") return '<div class="page"><div class="card">Nothing to mark. <a href="#/exams">Exam Centre</a></div></div>';
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Marking · ' + esc(ex.title) + '</div><h1>Mark your paper</h1><p class="lead">Computational answers are checked automatically. For written answers, compare with the model answer and tick each scheme point your work <b>clearly</b> shows — be the strict examiner you\'ll face.</p></div></div><div id="mkList"></div><div class="card" style="position:sticky;bottom:10px;margin-top:16px"><div class="row spread"><b id="mkTot"></b><button class="btn btn-primary btn-lg" id="mkDone">Finish marking → report</button></div></div></div>';
    },
    after(view) {
      const ex = LA.store.get(CUR, null); if (!ex || ex.status !== "marking") return;
      const host = $("#mkList", view);
      const save = () => LA.store.set(CUR, ex);
      host.innerHTML = ex.items.map((it, i) => '<div class="card mk-item" data-i="' + i + '" style="margin-bottom:14px"></div>').join("");
      ex.items.forEach((it, i) => {
        const el = $('[data-i="' + i + '"]', host), mk = ex.marking[i] || (ex.marking[i] = {}), ans = ex.answers[i] || {};
        if (it.kind === "written") {
          const qq = qById(it.qid);
          el.innerHTML = '<div class="row spread"><h3 style="margin:0">Q' + (i + 1) + ". " + esc(qq.title) + '</h3><span class="chip" data-sub>' + "</span></div>" +
            qq.parts.map((pp, k) => '<div class="exam-part"><div class="row spread"><b>' + pp.l + "</b><span>" + pp.m + " marks</span></div><div>" + pp.q + "</div>" + (ans[k] ? '<div class="small" style="margin:6px 0"><b>Your notes:</b> <span class="mono">' + esc(ans[k]) + "</span></div>" : "") + '<details class="reveal"><summary>Model answer</summary>' + (pp.a || "") + "</details>" +
              '<div class="scheme">' + pp.s.map((sl, j) => '<label class="check-item"><input type="checkbox" data-k="' + k + '" data-j="' + j + '"' + ((mk[k] || [])[j] ? " checked" : "") + '> <span class="chip comp-' + sl[1] + '" title="' + LA.COMPONENTS[sl[1]] + '">' + sl[1] + "</span> <span>[" + sl[0] + "] " + sl[2] + "</span></label>").join("") + "</div></div>").join("");
        } else {
          const pr = problemOf(it), parts = pr.parts || [{ ans: pr.ans, model: pr.model }];
          const res = parts.map((pt, k) => LA.ans.check(pt.ans, ans[k] === undefined ? "" : pt.ans.type === "mcq" ? +ans[k] : pt.ans.type === "tf" ? ans[k] === "true" : ans[k]));
          let ok = res.every((r) => r.ok); if (ok && pr.joint) ok = pr.joint(parts.map((_, k) => ans[k])).ok;
          const fm = Math.floor(it.marks / 2), mm = it.marks - fm;
          mk.auto = { ok, fm, mm }; mk.F = ok ? fm : 0;
          el.innerHTML = '<div class="row spread"><h3 style="margin:0">Q' + (i + 1) + ". " + esc(pr.title) + '</h3><span class="chip" data-sub></span></div><div class="prob-q">' + pr.q + "</div>" + parts.map((pt, k) => '<div class="small">' + (parts.length > 1 ? "(" + "abcdef"[k] + ") " : "") + "Your answer: <span class=\"mono\">" + esc(ans[k] === undefined ? "—" : String(ans[k])) + '</span> <span class="' + (res[k].ok ? "okc" : "err") + '">' + (res[k].ok ? "✓" : "✗ " + esc(res[k].msg || "")) + "</span></div>").join("") +
            '<details class="reveal"><summary>Worked solution</summary>' + pr.sol + "</details>" +
            '<div class="scheme"><label class="check-item"><input type="checkbox" disabled' + (ok ? " checked" : "") + '> <span class="chip comp-F">F</span> <span>[' + fm + "] Final answer (auto-checked)</span></label><label class=\"check-item\"><input type=\"checkbox\" data-meth" + (mk.M ? " checked" : "") + '> <span class="chip comp-M">M</span> <span>[' + mm + "] Method: my working shows the correct method (tick only if your written steps match the solution)</span></label></div>";
        }
        LA.enhance(el); LA.renderMath(el);
      });
      const score = () => {
        let got = 0;
        ex.items.forEach((it, i) => {
          const mk = ex.marking[i]; let g = 0;
          if (it.kind === "written") { const qq = qById(it.qid); qq.parts.forEach((pp, k) => pp.s.forEach((sl, j) => { if ((mk[k] || [])[j]) g += sl[0]; })); }
          else g = (mk.F || 0) + (mk.M ? mk.auto.mm : 0);
          mk.got = g; got += g;
          const sub = $('[data-i="' + i + '"] [data-sub]', host); if (sub) sub.textContent = g + " / " + it.marks;
        });
        $("#mkTot", view).textContent = "Total: " + got + " / " + totalMarks(ex);
        save(); return got;
      };
      $$('input[data-k][data-j]', host).forEach((c) => c.addEventListener("change", () => { const i = +c.closest(".mk-item").dataset.i, mk = ex.marking[i]; (mk[c.dataset.k] = mk[c.dataset.k] || [])[+c.dataset.j] = c.checked; score(); }));
      $$("input[data-meth]", host).forEach((c) => c.addEventListener("change", () => { const i = +c.closest(".mk-item").dataset.i; ex.marking[i].M = c.checked; score(); }));
      score();
      $("#mkDone", view).onclick = () => { score(); finalize(ex); LA.go("#/exams/report/" + ex.id); };
    },
  });

  function finalize(ex) {
    const comp = {}; Object.keys(LA.COMPONENTS).forEach((c) => { comp[c] = [0, 0]; });
    const byTopic = {}, perQ = [];
    ex.items.forEach((it, i) => {
      const mk = ex.marking[i] || {}; let got = mk.got || 0;
      if (it.kind === "written") {
        const qq = qById(it.qid);
        qq.parts.forEach((pp, k) => pp.s.forEach((sl, j) => { comp[sl[1]][1] += sl[0]; if ((mk[k] || [])[j]) comp[sl[1]][0] += sl[0]; }));
        qq.topics.forEach((t) => { const b = byTopic[t] || (byTopic[t] = [0, 0]); b[0] += got / qq.topics.length; b[1] += it.marks / qq.topics.length; });
        LA.ev.record({ topic: qq.topics[0], src: "exam", score: got / it.marks, gen: "exam:" + qq.id });
        perQ.push({ title: qq.title, got, marks: it.marks, time: ex.timeOn[i] || 0, kind: qq.kind });
      } else {
        comp.F[1] += mk.auto.fm; comp.M[1] += mk.auto.mm; comp.F[0] += mk.F || 0; comp.M[0] += mk.M ? mk.auto.mm : 0;
        const b = byTopic[it.topic] || (byTopic[it.topic] = [0, 0]); b[0] += got; b[1] += it.marks;
        LA.ev.record({ topic: it.topic, src: "exam", score: mk.auto.ok ? 1 : 0, gen: it.gen, seed: it.seed, diff: it.diff });
        if (!mk.auto.ok) LA.mist.add({ topic: it.topic, gen: it.gen, seed: it.seed, diff: it.diff, title: LA.BANK[it.gen].title, msg: "Missed in exam: " + ex.title, src: "exam" });
        perQ.push({ title: LA.BANK[it.gen].title, got, marks: it.marks, time: ex.timeOn[i] || 0, kind: "comp" });
      }
    });
    const got = perQ.reduce((s, x) => s + x.got, 0), total = totalMarks(ex);
    ex.result = { got: Math.round(got * 10) / 10, total, pct: total ? (100 * got) / total : 0, time: ((ex.finishedAt || Date.now()) - ex.startedAt) / 1000, overtime: Math.max(0, ((ex.finishedAt || Date.now()) - ex.startedAt) / 1000 - ex.minutes * 60), comp, byTopic, perQ };
    ex.status = "done";
    const hist = LA.store.get(HIST, []); hist.push(ex); if (hist.length > 40) hist.splice(0, hist.length - 40); LA.store.set(HIST, hist);
    LA.store.del(CUR);
    LA.stat("exams"); LA.addXP(Math.round(20 + ex.result.pct / 4), "Exam completed");
  }

  /* ---------------- report ---------------- */
  LA.page("/exams/report/:id", {
    title: "Exam report",
    render(params) {
      const ex = LA.store.get(HIST, []).find((h) => h.id === params.id);
      if (!ex) return '<div class="page"><div class="card">Report not found. <a href="#/exams">Exam Centre</a></div></div>';
      const R = ex.result, bar = (a, b) => '<div class="bar" style="min-width:120px"><i style="width:' + (b ? Math.round((100 * a) / b) : 0) + '%"></i></div>';
      const topics = Object.entries(R.byTopic).map(([t, v]) => ({ t, tp: LA.topic(t), got: v[0], tot: v[1], pct: v[1] ? v[0] / v[1] : 0 })).sort((a, b) => a.pct - b.pct);
      const weak = topics.filter((x) => x.pct < 0.6).slice(0, 4);
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Exam report · ' + new Date(ex.created).toLocaleString() + '</div><h1>' + esc(ex.title) + '</h1><div class="grid grid-4" style="margin-top:12px"><div class="stat"><b>' + R.got + "/" + R.total + '</b><span>marks</span></div><div class="stat"><b>' + Math.round(R.pct) + '%</b><span>score</span></div><div class="stat"><b>' + fmtT(R.time) + "</b><span>time used (of " + ex.minutes + ' min)</span></div><div class="stat"><b>' + ex.items.length + "</b><span>questions</span></div></div>" + (R.overtime > 0 ? '<p class="small err">Overtime: ' + fmtT(R.overtime) + " beyond the time limit.</p>" : "") + "</div></div>" +
        '<div class="grid grid-2" style="margin-top:16px"><div class="card"><div class="kicker">By marking component</div><table class="tbl">' + Object.entries(R.comp).filter(([, v]) => v[1]).map(([c, v]) => "<tr><td><span class=\"chip comp-" + c + '">' + c + "</span> " + LA.COMPONENTS[c] + "</td><td>" + Math.round(v[0] * 10) / 10 + "/" + v[1] + "</td><td>" + bar(v[0], v[1]) + "</td></tr>").join("") + '</table><p class="small muted">Low <b>Justification</b> or <b>Proof structure</b>? Use the Proof Examiner. Low <b>Accuracy/Final answer</b>? Drill the Practice Arena.</p></div>' +
        '<div class="card"><div class="kicker">By topic (weakest first)</div><table class="tbl">' + topics.map((x) => '<tr><td><a href="#/learn/' + x.t + '">' + esc(x.tp ? x.tp.title : x.t) + "</a></td><td>" + Math.round(x.pct * 100) + "%</td><td>" + bar(x.got, x.tot) + "</td></tr>").join("") + "</table></div></div>" +
        '<div class="card" style="margin-top:16px"><div class="kicker">By question</div><table class="tbl"><tr><th>#</th><th>Question</th><th>Marks</th><th>Time</th></tr>' + R.perQ.map((x, i) => "<tr><td>" + (i + 1) + "</td><td>" + esc(x.title) + ' <span class="small muted">(' + (x.kind === "comp" ? "auto-checked" : x.kind) + ")</span></td><td>" + Math.round(x.got * 10) / 10 + "/" + x.marks + "</td><td>" + fmtT(x.time) + "</td></tr>").join("") + "</table></div>" +
        (weak.length ? LA.sectionTitle("What to do next") + '<div class="grid grid-2">' + weak.map((x) => '<div class="card"><b>' + esc(x.tp ? x.tp.title : x.t) + '</b> — ' + Math.round(x.pct * 100) + '% <div class="row" style="margin-top:8px"><a class="btn btn-sm" href="#/learn/' + x.t + '">📖 Re-learn</a><a class="btn btn-sm" href="#/practice?mode=topic&topic=' + x.t + '">♾️ Practise</a></div></div>').join("") + "</div>" : "") +
        '<div class="row" style="margin-top:16px"><a class="btn btn-primary" href="#/exams">Exam Centre</a><a class="btn" href="#/practice?mode=retry">🔁 Retry missed problems</a><button class="btn" onclick="window.print()">🖨️ Print report</button></div></div>';
    },
  });
})();
