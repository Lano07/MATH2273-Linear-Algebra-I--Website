/* Topic Studio: every topic in five connected modes — Understand · Visualise · Prove · Practise · Exam.
   Panes are rendered once (lazily) and kept alive, so switching modes never loses your place, inputs or scroll.
   Split view shows the lesson beside any other mode. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const MODES = [["understand", "📖", "Understand"], ["visualise", "👁️", "Visualise"], ["prove", "✍️", "Prove"], ["practise", "♾️", "Practise"], ["exam", "🎓", "Exam"]];

  const boxesOf = (html, sel) => { const t = document.createElement("template"); t.innerHTML = html; return Array.from(t.content.querySelectorAll(sel)); };
  // theorem-like boxes with the proof box(es) that follow them
  function theoremPairs(html) {
    const t = document.createElement("template"); t.innerHTML = html; const out = []; let cur = null;
    Array.from(t.content.children).forEach((el) => {
      if (!el.classList.contains("box")) return;
      if (/\b(thm|prop|lem|cor)\b/.test(el.className)) { cur = { thm: el.outerHTML, proofs: [] }; out.push(cur); }
      else if (el.classList.contains("proof") && cur) cur.proofs.push(el.outerHTML);
      else if (!el.classList.contains("proof")) cur = cur && cur.proofs.length ? null : cur;
    });
    return out;
  }
  function mountLab(host, href) {
    const path = href.replace(/^#/, "").split("?")[0];
    const pg = LA.pages.find((p) => p.pattern === path);
    if (!pg) { host.innerHTML = '<p class="muted">Lab not found.</p>'; return; }
    let html = ""; try { html = pg.render({}, {}); } catch (e) { html = '<div class="card err">Couldn\'t load this lab here — <a href="' + href + '">open it in full</a>.</div>'; }
    host.innerHTML = '<div class="embedded-lab">' + html + "</div>";
    LA.enhance(host);
    try { if (pg.after) pg.after(host, {}, {}); } catch (e) { console.error(e); }
    LA.renderMath(host);
    if (pg.lab && LA.state.stats.labs) { LA.state.stats.labs[pg.lab] = 1; LA.save(); }
  }

  /* ---------------- pane renderers ---------------- */
  const P = {};
  P.understand = (pane, tp) => {
    const depth = LA.store.get("depth", "a");
    const ch = LA.chapters["ch" + tp.ch];
    pane.innerHTML = '<div class="card glow"><div class="kicker">In one breath</div><p style="margin:.3em 0 .6em">' + tp.summary + '</p><div class="kicker">Key facts</div><ul style="margin:.3em 0 0">' + tp.key.map((k) => "<li>" + k + "</li>").join("") + "</ul></div>" +
      '<div class="card depth-bar no-print" style="margin-top:12px"><span class="kicker" style="margin:0">Depth</span><div class="seg">' + ["f", "s", "a"].map((k) => '<button type="button" data-depth="' + k + '" aria-pressed="' + (k === depth) + '" title="' + esc(LA.DEPTH[k].desc) + '">' + (k === "a" ? "Everything" : LA.DEPTH[k].name) + "</button>").join("") + "</div></div>" +
      '<article class="lesson" data-depth="' + depth + '">' + (LA.topicHTML(tp) || '<p class="muted">This topic draws on the chapter deep-dive; open the chapter for the full lesson.</p>') + "</article>" +
      '<div class="row" style="margin-top:14px">' + tp.sec.map((s) => '<a class="btn btn-sm" href="#/ch/' + tp.ch + "?go=sec-" + LA.slug(s) + '">Full section ' + s + " in Chapter " + tp.ch + " ▸</a>").join("") + '<button class="btn btn-sm btn-ghost" data-act="studied">✓ Mark as studied</button></div>' +
      '<p class="small muted">Marking as studied is logged as <i>activity</i>; mastery only comes from answering questions (Practise, Exam, Prove).</p>';
    LA.enhance(pane);
    $$("button[data-depth]", pane).forEach((b) => b.addEventListener("click", () => { $("article.lesson", pane).dataset.depth = b.dataset.depth; LA.store.set("depth", b.dataset.depth); $$("button[data-depth]", pane).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
    $('[data-act="studied"]', pane).onclick = (e) => { const st = LA.store.get("studied", {}); st[tp.id] = Date.now(); LA.store.set("studied", st); LA.stat("studied"); e.target.textContent = "✓ Studied " + new Date().toLocaleDateString(); };
    void ch;
  };
  P.visualise = (pane, tp) => {
    const html = LA.topicHTML(tp);
    const intu = boxesOf(html, ".box.intuition").map((b) => b.outerHTML).join("");
    const exs = boxesOf(html, ".box.ex").slice(0, 2).map((b) => b.outerHTML).join("");
    const deep = LA.chapters["ch" + tp.ch].sections.find((s) => /\.D$/.test(s.id));
    const pic = deep ? boxesOf(deep.html, ".box.intuition").map((b) => b.outerHTML).join("") : "";
    pane.innerHTML = (intu ? intu : "") + (pic ? '<details class="reveal"><summary>The chapter picture</summary>' + pic + "</details>" : "") +
      (tp.labs.length ? '<div class="card" style="margin-top:12px"><div class="row spread"><div class="kicker" style="margin:0">Interactive lab</div><div class="row">' + (tp.labs.length > 1 ? '<select id="labSel" aria-label="Choose a lab">' + tp.labs.map((l, i) => '<option value="' + i + '">' + esc(l[0]) + "</option>").join("") + "</select>" : "<b>" + esc(tp.labs[0][0]) + "</b>") + '<a class="btn btn-sm" id="labOpen" href="' + tp.labs[0][1] + '">Open full page ↗</a></div></div><div id="labHost" style="margin-top:10px"></div></div>'
        : '<div class="card" style="margin-top:12px"><p class="muted" style="margin:0">This topic has no dedicated lab; the worked examples below show it step by step.</p></div>' + exs);
    LA.enhance(pane); LA.renderMath(pane);
    if (tp.labs.length) {
      const host = $("#labHost", pane), sel = $("#labSel", pane), open = $("#labOpen", pane);
      const load = (i) => { mountLab(host, tp.labs[i][1]); open.href = tp.labs[i][1]; };
      if (sel) sel.addEventListener("change", () => load(+sel.value));
      load(0);
    }
  };
  P.prove = (pane, tp) => {
    const pairs = theoremPairs(LA.topicHTML(tp));
    const tasks = (LA.PROOF_TASKS || []).filter((t) => t.topic === tp.id);
    const drills = (LA.DRILLS || []).filter((d) => d.topic === tp.id);
    const claims = (LA.CLAIMS || []).filter((c) => c.topic === tp.id);
    pane.innerHTML =
      (tasks.length ? '<h3>Write it yourself — Proof Examiner</h3><div class="grid grid-2">' + tasks.map((t) => '<a class="card hover" href="#/proofs/examiner/' + t.id + '"><div class="kicker">Proof task</div><b>' + esc(t.title) + '</b><p class="small muted" style="margin:.3em 0 0">' + t.stmt + "</p></a>").join("") + "</div>" : "") +
      (pairs.length ? '<h3>Theorems and proofs</h3><p class="small muted">Read each statement, try to prove it, then open the proof.</p>' + pairs.map((p) => p.thm + (p.proofs.length ? '<details class="reveal"><summary>Show the proof</summary>' + p.proofs.join("") + "</details>" : "")).join("") : "") +
      (tp.parsons.length ? '<h3>Order the proof</h3><div id="pzHost"></div>' : "") +
      (drills.length ? "<h3>Proof drills</h3>" + drills.map((d, i) => '<div data-dr="' + i + '"></div>').join("") : "") +
      (claims.length ? "<h3>Break a false claim</h3>" + claims.map((c, i) => '<div data-cl="' + i + '"></div>').join("") : "") +
      (!tasks.length && !pairs.length && !drills.length && !claims.length && !tp.parsons.length ? '<div class="card"><p class="muted" style="margin:0">This topic is mostly computational; the Proof Studio has general templates.</p><a class="btn btn-sm" href="#/proofs" style="margin-top:8px">Proof Studio ▸</a></div>' : "") +
      '<div class="row" style="margin-top:14px"><a class="btn btn-sm" href="#/proofs">✍️ Proof templates</a><a class="btn btn-sm" href="#/proofs/drills">🧩 All drills</a><a class="btn btn-sm" href="#/counterexamples">🧪 Counterexample Lab</a></div>';
    LA.enhance(pane);
    if (tp.parsons.length) LA.mountParsons($("#pzHost", pane), tp.parsons);
    drills.forEach((d, i) => LA.mountDrill($('[data-dr="' + i + '"]', pane), d));
    claims.forEach((c, i) => LA.mountClaim($('[data-cl="' + i + '"]', pane), c));
    LA.renderMath(pane);
  };
  P.practise = (pane, tp) => {
    const gens = LA.bank.forTopic(tp.id);
    let diff = "auto", k = 0;
    pane.innerHTML = '<div class="card"><div class="row" style="gap:12px"><span class="small muted">Difficulty</span><div class="seg">' + ["auto"].concat(LA.DIFFS).map((d) => '<button type="button" data-d="' + d + '" aria-pressed="' + (d === "auto") + '">' + (d === "auto" ? "Auto" : LA.DIFF_LABEL[d]) + "</button>").join("") + '</div><span class="small muted">' + gens.length + ' question type' + (gens.length > 1 ? "s" : "") + ': ' + gens.map((g) => esc(g.title)).join(" · ") + '</span><a class="btn btn-sm" href="#/practice?mode=topic&topic=' + tp.id + '" style="margin-left:auto">Open in Practice Arena ↗</a></div></div><div class="ts-prob" style="margin-top:12px"></div>';
    const host = $(".ts-prob", pane);
    const next = () => { const g = gens[k++ % gens.length]; const m = LA.mastery(tp.id); const d = diff === "auto" ? ["beginner", "beginner", "standard", "advanced", "challenge"][m.level] : diff; LA.mountProblem(host, LA.bank.make(g.id, LA.newSeed(), d), { src: "practice", onNext: next, onResult: () => refreshChip() }); };
    $$("[data-d]", pane).forEach((b) => b.addEventListener("click", () => { diff = b.dataset.d; $$("[data-d]", pane).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); next(); }));
    next();
  };
  P.exam = (pane, tp) => {
    const gens = LA.bank.forTopic(tp.id);
    const written = boxesOf(LA.topicHTML(tp) + (((LA.chapters["ch" + tp.ch].sections.find((s) => /\.D$/.test(s.id)) || {}).html) || ""), ".box.exam").filter((b) => b.querySelector("details")).slice(0, 4).map((b) => b.outerHTML).join("");
    const bankQs = (LA.EXAM_QUESTIONS || []).filter((q) => (q.topics || []).includes(tp.id));
    pane.innerHTML = '<div class="card glow"><div class="kicker">Exam conditions</div><h3 style="margin:.2em 0">Timed question — no hints</h3><p class="small muted" style="margin:.2em 0 .6em">An advanced-level problem with the clock running. Hints are off; the solution appears after you answer. Results count as exam evidence for this topic.</p><div class="row"><button class="btn btn-primary" data-act="go">Start a timed question</button><span class="timer" id="tsTimer" hidden>00:00</span></div><div class="ts-exam" style="margin-top:10px"></div></div>' +
      (bankQs.length ? '<div class="card" style="margin-top:12px"><div class="kicker">From the exam bank</div><p class="small muted">' + bankQs.length + ' exam-style question' + (bankQs.length > 1 ? "s" : "") + ' with marking schemes cover this topic.</p><a class="btn btn-sm btn-primary" href="#/exams/new?topic=' + tp.id + '">Build an exam on this topic ▸</a></div>' : "") +
      (written ? "<h3>Written exam-style questions</h3>" + written : "") +
      '<div class="row" style="margin-top:12px"><a class="btn btn-sm" href="#/exams">🎓 Exam centre</a><a class="btn btn-sm" href="#/ch/' + tp.ch + '?tab=exercises">📝 Chapter ' + tp.ch + " exercises</a></div>";
    LA.enhance(pane); LA.renderMath(pane);
    let tmr = null;
    $('[data-act="go"]', pane).onclick = () => {
      const g = LA.pick(gens), d = LA.pick(["advanced", "challenge"]);
      const host = $(".ts-exam", pane), clock = $("#tsTimer", pane); clock.hidden = false;
      const t0 = Date.now(); clearInterval(tmr); tmr = setInterval(() => { if (!document.body.contains(clock)) return clearInterval(tmr); const s = Math.floor((Date.now() - t0) / 1000); clock.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }, 500);
      const pr = LA.bank.make(g.id, LA.newSeed(), d); pr.hints = ["Hints are disabled in exam mode.", "—", "—", "—"];
      const ui = LA.mountProblem(host, pr, { src: "exam", noNext: true, onResult: () => { clearInterval(tmr); refreshChip(); } });
      const hb = $('[data-act="hint"]', ui.card); if (hb) hb.remove();
    };
  };
  let refreshChip = () => {};

  /* ---------------- index & topic pages ---------------- */
  LA.page("/learn", {
    title: "Topic Studio", searchTitle: "Topic Studio", searchDesc: "Every topic in five modes: Understand, Visualise, Prove, Practise, Exam",
    render() {
      const chs = Object.values(LA.chapters).sort((a, b) => a.num - b.num);
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">' + LA.TOPICS.length + ' topics · 5 modes each</div><h1>Topic Studio</h1><p class="lead">Pick a topic and move freely between <b>Understand</b>, <b>Visualise</b>, <b>Prove</b>, <b>Practise</b> and <b>Exam</b> — your place in each mode is kept. Mastery chips reflect answered questions only.</p><div class="row"><a class="btn" href="#/map">🗺️ Concept map</a><a class="btn" href="#/practice">♾️ Practice Arena</a></div></div></div>' +
        chs.map((c) => LA.sectionTitle("Chapter " + c.num + " · " + c.title) + '<div class="grid grid-3">' + LA.topicsOf(c.num).map((t) => '<a class="card hover topic-card" href="#/learn/' + t.id + '"><div class="row spread"><b>' + esc(t.title) + "</b></div><div style=\"margin:.4em 0\">" + LA.masteryChip(t.id) + '</div><p class="small muted" style="margin:0">' + t.summary + "</p></a>").join("") + "</div>").join("") + "</div>";
    },
  });

  LA.page("/learn/:topic", {
    title: (p) => { const t = LA.topic(p.topic); return t ? t.title : "Topic"; },
    render(params, q) {
      const tp = LA.topic(params.topic);
      if (!tp) return '<div class="page"><div class="card">Unknown topic. <a href="#/learn">All topics</a></div></div>';
      const saved = LA.store.get("studio:" + tp.id, {});
      const mode = MODES.some((m) => m[0] === q.mode) ? q.mode : saved.mode || "understand";
      const split = saved.split && window.innerWidth >= 1100;
      const pre = tp.prereq.map(LA.topic).filter(Boolean), nxt = LA.TOPICS.filter((t) => t.prereq.includes(tp.id));
      const i = LA.TOPICS.indexOf(tp), prev = LA.TOPICS[i - 1], next = LA.TOPICS[i + 1];
      return '<div class="page wide studio" data-topic="' + tp.id + '"><div class="studio-head card"><div class="row spread"><div><div class="kicker">Chapter ' + tp.ch + ' · <a href="#/learn">Topic Studio</a></div><h1 style="margin:.15em 0">' + esc(tp.title) + '</h1></div><div id="tsChip">' + LA.masteryChip(tp.id) + "</div></div>" +
        '<div class="row small" style="gap:6px;margin-top:6px"><span class="muted">Builds on:</span>' + (pre.length ? pre.map((t) => '<a class="chip" href="#/learn/' + t.id + '">' + esc(t.title) + "</a>").join("") : '<span class="muted">—</span>') + '<span class="muted" style="margin-left:10px">Leads to:</span>' + (nxt.length ? nxt.map((t) => '<a class="chip" href="#/learn/' + t.id + '">' + esc(t.title) + "</a>").join("") : '<span class="muted">—</span>') + "</div>" +
        '<div class="studio-modes" role="tablist" aria-label="Learning mode">' + MODES.map((m) => '<button role="tab" type="button" class="mode-btn' + (m[0] === mode ? " active" : "") + '" data-mode="' + m[0] + '" aria-selected="' + (m[0] === mode) + '"><span aria-hidden="true">' + m[1] + "</span> " + m[2] + "</button>").join("") + '<button type="button" class="mode-btn split-btn" data-split aria-pressed="' + !!split + '" title="Lesson on the left, current mode on the right">⧉ Split view</button></div></div>' +
        '<div class="studio-panes' + (split ? " split" : "") + '">' + MODES.map((m) => '<section class="studio-pane" data-pane="' + m[0] + '" role="tabpanel" aria-label="' + m[2] + '" hidden></section>').join("") + "</div>" +
        '<div class="row spread" style="margin-top:24px">' + (prev ? '<a class="btn" href="#/learn/' + prev.id + '">◂ ' + esc(prev.title) + "</a>" : "<span></span>") + (next ? '<a class="btn" href="#/learn/' + next.id + '">' + esc(next.title) + " ▸</a>" : "<span></span>") + "</div></div>";
    },
    after(view, params, q) {
      const tp = LA.topic(params.topic); if (!tp) return;
      const root = $(".studio", view);
      const saved = LA.store.get("studio:" + tp.id, {});
      let mode = MODES.some((m) => m[0] === q.mode) ? q.mode : saved.mode || "understand";
      let split = saved.split && window.innerWidth >= 1100;
      const scrolls = {};
      const rendered = {};
      refreshChip = () => { const c = $("#tsChip", view); if (c) c.innerHTML = LA.masteryChip(tp.id); };
      const ensure = (m) => { if (rendered[m]) return; rendered[m] = true; const pane = $('[data-pane="' + m + '"]', root); try { P[m](pane, tp); } catch (e) { console.error(e); pane.innerHTML = '<div class="card err">Something went wrong in this mode: ' + esc(e.message) + "</div>"; } };
      const show = (m, keepScroll) => {
        if (!split) scrolls[mode] = window.scrollY;
        mode = m;
        const right = split && m === "understand" ? "practise" : m;
        MODES.forEach(([k]) => { const pane = $('[data-pane="' + k + '"]', root); pane.hidden = !(split ? k === "understand" || k === right : k === m); pane.classList.toggle("left", split && k === "understand"); });
        ensure(split ? "understand" : m); if (split) ensure(right);
        $$(".mode-btn[data-mode]", root).forEach((b) => { const on = b.dataset.mode === m; b.classList.toggle("active", on); b.setAttribute("aria-selected", String(on)); });
        $(".studio-panes", root).classList.toggle("split", !!split);
        LA.store.set("studio:" + tp.id, { mode: m, split: !!split });
        try { history.replaceState(null, "", "#/learn/" + tp.id + "?mode=" + m); } catch (e) { /* file:// */ }
        if (!split && keepScroll) window.scrollTo(0, scrolls[m] || $(".studio-modes", root).getBoundingClientRect().top + window.scrollY - 80);
      };
      $$(".mode-btn[data-mode]", root).forEach((b) => b.addEventListener("click", () => show(b.dataset.mode, true)));
      $("[data-split]", root).addEventListener("click", (e) => { split = !split; e.currentTarget.setAttribute("aria-pressed", String(split)); show(mode, false); });
      // keyboard: arrow keys move between mode tabs
      $(".studio-modes", root).addEventListener("keydown", (e) => { if (!/Arrow(Left|Right)/.test(e.key)) return; const i = MODES.findIndex((m) => m[0] === mode); const j = (i + (e.key === "ArrowRight" ? 1 : MODES.length - 1)) % MODES.length; show(MODES[j][0], true); $('.mode-btn[data-mode="' + MODES[j][0] + '"]', root).focus(); });
      show(mode, false);
    },
  });
})();
