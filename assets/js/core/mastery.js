/* Evidence-based mastery model, mistake log and retry queue.
   MASTERY comes only from answering questions (practice, exams, proof drills, counterexamples, quizzes, flashcard recall).
   ACTIVITY (opening lessons, marking sections, viewing solutions, visiting labs) is tracked separately and never counts as mastery. */
(function () {
  "use strict";
  const LA = window.LA;
  const KEY = "ev", MKEY = "mistakes", CAP = 4000, MCAP = 600;
  const SRC_W = { practice: 1, exam: 1.2, drill: 0.9, proof: 1, ce: 0.9, quiz: 0.6, flash: 0.25 };
  const DIFF_W = { beginner: 0.6, standard: 1, advanced: 1.3, challenge: 1.5 };
  const LABELS = ["Not started", "Learning", "Developing", "Proficient", "Mastered"];
  LA.MASTERY_LABELS = LABELS;

  let cache = null;
  const all = () => (cache || (cache = LA.store.get(KEY, [])));
  const save = () => LA.store.set(KEY, all());

  LA.ev = {
    /* rec: { topic, src, score (0..1) or ok, hints, sol (solution seen BEFORE answering), gen, seed, diff, tag, q } */
    record(rec) {
      const e = Object.assign({ t: Date.now(), hints: 0, sol: false }, rec);
      if (e.score === undefined) e.score = e.ok ? 1 : 0;
      e.score = Math.max(0, Math.min(1, +e.score || 0));
      delete e.ok;
      all().push(e);
      if (all().length > CAP) all().splice(0, all().length - CAP);
      save();
      LA.stat && LA.stat("attempts", 1);
      return e;
    },
    list(f) { f = f || {}; return all().filter((e) => (!f.topic || e.topic === f.topic) && (!f.src || e.src === f.src) && (!f.since || e.t >= f.since)); },
    clear() { cache = []; save(); },
    importAll(arr) { if (Array.isArray(arr)) { cache = arr.slice(-CAP); save(); } },
    raw: () => all(),
  };

  function credit(e) {
    if (e.sol) return 0; // solution viewed before answering: no mastery credit
    const hintPenalty = Math.max(0.4, 1 - 0.15 * (e.hints || 0));
    return e.score * hintPenalty;
  }
  LA.mastery = function (topic) {
    const ev = all().filter((e) => e.topic === topic && SRC_W[e.src]);
    const n = ev.length;
    if (!n) return { level: 0, label: LABELS[0], pct: 0, n: 0, correct: 0 };
    let sw = 0, sc = 0;
    ev.forEach((e, i) => {
      const age = n - 1 - i; // 0 = most recent
      const w = SRC_W[e.src] * (DIFF_W[e.diff] || 1) * Math.pow(0.5, age / 12);
      sw += w; sc += w * credit(e);
    });
    const pct = sw ? sc / sw : 0;
    const clean = ev.filter((e) => e.score >= 0.99 && !e.sol && SRC_W[e.src] >= 0.6);
    const solidStd = clean.filter((e) => (DIFF_W[e.diff] || 1) >= 1).length;
    const solidAdv = clean.filter((e) => (DIFF_W[e.diff] || 1) >= 1.3).length;
    const days = new Set(ev.map((e) => new Date(e.t).toDateString())).size;
    let level = 1;
    if (n >= 3 && pct >= 0.5) level = 2;
    if (n >= 5 && pct >= 0.75 && solidStd >= 2) level = 3;
    if (n >= 8 && pct >= 0.9 && solidAdv >= 1 && days >= 2) level = 4;
    return { level, label: LABELS[level], pct, n, correct: clean.length, days };
  };
  LA.masteryChip = function (topic) {
    const m = LA.mastery(topic);
    const col = ["", "red", "amber", "cyan", "lime"][m.level];
    return '<span class="chip ' + col + '" title="' + (m.n ? Math.round(m.pct * 100) + "% weighted accuracy over " + m.n + " attempt(s)" : "No answered questions yet — reading alone doesn't count") + '">' + ["○", "◔", "◑", "◕", "●"][m.level] + " " + m.label + "</span>";
  };

  /* ---------------- mistakes & retry queue ---------------- */
  let mcache = null;
  const mall = () => (mcache || (mcache = LA.store.get(MKEY, [])));
  const msave = () => LA.store.set(MKEY, mall());
  LA.mist = {
    add(m) {
      // one open entry per (gen, seed); repeated failures increment the counter
      const ex = mall().find((x) => !x.resolved && x.gen && x.gen === m.gen && x.seed === m.seed);
      if (ex) { ex.fails = (ex.fails || 1) + 1; ex.t = Date.now(); if (m.tag) ex.tag = m.tag; msave(); return ex; }
      const e = Object.assign({ id: "m" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), t: Date.now(), fails: 1, resolved: false }, m);
      mall().push(e);
      if (mall().length > MCAP) mall().splice(0, mall().length - MCAP);
      msave(); return e;
    },
    resolveBySeed(gen, seed) { let n = 0; mall().forEach((x) => { if (!x.resolved && x.gen === gen && x.seed === seed) { x.resolved = Date.now(); n++; } }); if (n) msave(); return n; },
    resolve(id) { const x = mall().find((m) => m.id === id); if (x) { x.resolved = Date.now(); msave(); } },
    remove(id) { const i = mall().findIndex((m) => m.id === id); if (i >= 0) { mall().splice(i, 1); msave(); } },
    note(id, text) { const x = mall().find((m) => m.id === id); if (x) { x.note = text; msave(); } },
    list(f) { f = f || {}; return mall().filter((m) => (f.open === undefined || !m.resolved === f.open) && (!f.topic || m.topic === f.topic)); },
    importAll(arr) { if (Array.isArray(arr)) { mcache = arr; msave(); } },
    raw: () => mall(),
  };

  /* ---------------- recommendations ---------------- */
  LA.recommend = function (limit) {
    const out = [];
    const topics = LA.TOPICS || [];
    const open = LA.mist.list({ open: true });
    if (open.length) out.push({ ico: "🔁", t: "Retry " + open.length + " problem" + (open.length > 1 ? "s" : "") + " you got wrong", d: "Exact same problems, regenerated from their seeds.", href: "#/practice?mode=retry", w: 100 + open.length });
    if (LA.srsDueCount) { const due = LA.srsDueCount(); if (due) out.push({ ico: "🃏", t: due + " flashcard" + (due > 1 ? "s" : "") + " due for review", d: "Spaced repetition keeps definitions and theorems in long-term memory.", href: "#/flashcards", w: 60 + due }); }
    const scored = topics.map((tp) => ({ tp, m: LA.mastery(tp.id) }));
    scored.filter((x) => x.m.n && x.m.level < 3).sort((a, b) => a.m.pct - b.m.pct).slice(0, 3).forEach((x) =>
      out.push({ ico: "🎯", t: "Strengthen: " + x.tp.title, d: Math.round(x.m.pct * 100) + "% weighted accuracy over " + x.m.n + " attempt(s) — practise, then re-read the lesson.", href: "#/learn/" + x.tp.id + "?mode=practise", w: 80 - x.m.pct * 40 }));
    const focus = (LA.store.get("focusChapters", null) || [3, 4]);
    const fresh = scored.filter((x) => !x.m.n).sort((a, b) => (focus.includes(b.tp.ch) ? 1 : 0) - (focus.includes(a.tp.ch) ? 1 : 0) || a.tp.ch - b.tp.ch);
    fresh.slice(0, 2).forEach((x) => out.push({ ico: "🌱", t: "Start: " + x.tp.title, d: "Chapter " + x.tp.ch + " · no answered questions yet.", href: "#/learn/" + x.tp.id, w: focus.includes(x.tp.ch) ? 50 : 30 }));
    return out.sort((a, b) => b.w - a.w).slice(0, limit || 6);
  };
})();
