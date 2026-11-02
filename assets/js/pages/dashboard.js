/* Smart dashboard. MASTERY (from answered questions) is shown separately from ACTIVITY (XP, sections marked,
   lessons opened, labs visited) — activity never makes a topic "proficient". A compact version is added to the
   home page; the full version lives at #/dashboard. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, esc } = LA;
  const DAY = 864e5;
  const pct = (x) => (x === null || x === undefined || isNaN(x) ? "—" : Math.round(x * 100) + "%");
  const LVL_COL = ["var(--border-strong)", "var(--red)", "var(--amber)", "var(--cyan)", "var(--lime)"];
  function metrics() {
    const ev = LA.ev.raw(), now = Date.now();
    const scored = ev.filter((e) => e.src !== "flash");
    const prac = ev.filter((e) => e.src === "practice").slice(-50);
    const proofs = ev.filter((e) => e.src === "proof");
    const hist = LA.store.get("examHistory", []);
    const srsLog = LA.store.get("srsLog", {});
    let rev30 = 0, ok30 = 0; const st = LA.store.get("srs", {}); Object.values(st).forEach((s) => (s && s.hist || []).forEach(([t, r]) => { if (now - t < 30 * DAY) { rev30++; if (r > 0) ok30++; } }));
    const week = (k) => { const a = scored.filter((e) => e.t > now - (k + 1) * 7 * DAY && e.t <= now - k * 7 * DAY); return a.length ? { n: a.length, acc: a.reduce((s, e) => s + e.score, 0) / a.length } : { n: 0, acc: null }; };
    const weeks = Array.from({ length: 8 }, (_, k) => week(7 - k));
    const days = {}; ev.forEach((e) => { const d = new Date(e.t).toISOString().slice(0, 10); days[d] = (days[d] || 0) + 1; }); Object.entries(srsLog).forEach(([d, v]) => { days[d] = (days[d] || 0) + (v.reviews || 0); });
    const levels = [0, 0, 0, 0, 0]; const ms = LA.TOPICS.map((t) => { const m = LA.mastery(t.id); levels[m.level]++; return { t, m }; });
    const weak = ms.filter((x) => x.m.n && x.m.level < 3).sort((a, b) => a.m.pct - b.m.pct).slice(0, 5);
    const byCh = {}; for (let c = 1; c <= 8; c++) { const L = ms.filter((x) => x.t.ch === c), seen = L.filter((x) => x.m.n); byCh[c] = { pct: seen.length ? seen.reduce((s, x) => s + x.m.pct, 0) / seen.length : null, prof: L.filter((x) => x.m.level >= 3).length, n: L.length, comp: LA.chapterProgress("ch" + c) }; }
    return { ev, prac, practiceAcc: prac.length ? prac.reduce((s, e) => s + e.score, 0) / prac.length : null, proofAvg: proofs.length ? proofs.reduce((s, e) => s + e.score, 0) / proofs.length : null, proofN: proofs.length, hist, lastExam: hist.length ? hist[hist.length - 1] : null, bestExam: hist.length ? Math.max(...hist.map((h) => h.result.pct)) : null, recall: rev30 ? ok30 / rev30 : null, rev30, mistakes: LA.mist.list({ open: true }).length, resolved: LA.mist.list({ open: false }).length, weeks, days, levels, weak, byCh, attempts: scored.length };
  }
  const levelBar = (levels) => { const tot = levels.reduce((s, x) => s + x, 0) || 1; return '<div class="lvlbar" role="img" aria-label="' + levels.map((n, i) => n + " " + LA.MASTERY_LABELS[i]).join(", ") + '">' + levels.map((n, i) => (n ? '<i style="width:' + (100 * n) / tot + "%;background:" + LVL_COL[i] + '" title="' + n + " × " + LA.MASTERY_LABELS[i] + '"></i>' : "")).join("") + '</div><div class="row small" style="gap:10px;margin-top:6px">' + levels.map((n, i) => '<span><b style="color:' + LVL_COL[i] + '">●</b> ' + LA.MASTERY_LABELS[i] + ": " + n + "</span>").join("") + "</div>"; };
  function heatmap(days, weeksBack) {
    weeksBack = weeksBack || 12; const cells = [], today = new Date(); today.setHours(12, 0, 0, 0);
    const start = new Date(today.getTime() - today.getDay() * DAY - 7 * (weeksBack - 1) * DAY);
    for (let i = 0; i < 7 * weeksBack; i++) { const d = new Date(start.getTime() + i * DAY); if (d > today) break; const k = d.toISOString().slice(0, 10), n = days[k] || 0; cells.push('<i class="hm' + (n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4) + '" title="' + k + ": " + n + ' activities" style="grid-row:' + (d.getDay() + 1) + '"></i>'); }
    return '<div class="heatmap" role="img" aria-label="Revision activity over the last ' + weeksBack + ' weeks">' + cells.join("") + '</div><div class="small muted">Answered questions + flashcard reviews per day (last ' + weeksBack + " weeks).</div>";
  }
  function weekChart(weeks) {
    const W = 520, Hh = 140, pts = weeks.map((w, i) => (w.acc === null ? null : [30 + i * ((W - 50) / 7), Hh - 20 - w.acc * (Hh - 40)]));
    const seg = []; let cur = []; pts.forEach((p) => { if (p) cur.push(p); else if (cur.length) { seg.push(cur); cur = []; } }); if (cur.length) seg.push(cur);
    return '<svg viewBox="0 0 ' + W + " " + Hh + '" class="trend" role="img" aria-label="Weekly accuracy over 8 weeks"><line x1="30" x2="' + (W - 20) + '" y1="' + (Hh - 20 - 0.75 * (Hh - 40)) + '" y2="' + (Hh - 20 - 0.75 * (Hh - 40)) + '" class="t50"/><text x="' + (W - 18) + '" y="' + (Hh - 24 - 0.75 * (Hh - 40)) + '" class="tlab" text-anchor="end">75%</text>' + seg.map((s) => '<polyline class="tline" points="' + s.map((p) => p.join(",")).join(" ") + '"/>').join("") + pts.map((p, i) => (p ? '<circle class="tdot" r="4" cx="' + p[0] + '" cy="' + p[1] + '"><title>' + pct(weeks[i].acc) + " over " + weeks[i].n + " answers</title></circle>" : "")).join("") + weeks.map((w, i) => '<text class="tlab" x="' + (30 + i * ((W - 50) / 7)) + '" y="' + (Hh - 4) + '" text-anchor="middle">' + (i === 7 ? "this wk" : "−" + (7 - i) + "w") + "</text>").join("") + "</svg>";
  }
  function cards(M, full) {
    const st = LA.state, lvl = LA.level();
    const imp = (() => { const a = M.weeks[7].acc, b = M.weeks[6].acc; return a === null || b === null ? null : a - b; })();
    const rec = LA.recommend(full ? 6 : 4);
    return '<div class="grid grid-2 dash">' +
      '<div class="card glow"><div class="kicker">Recommended next</div>' + (rec.length ? '<ul class="rec-list">' + rec.map((r) => '<li><a href="' + r.href + '"><span class="rec-ico">' + r.ico + "</span><b>" + esc(r.t) + '</b></a><div class="small muted">' + esc(r.d) + "</div></li>").join("") + "</ul>" : '<p class="muted">Answer a few questions to get personalised recommendations.</p>') + "</div>" +
      '<div class="card"><div class="kicker">Mastery — from answered questions</div><h3 style="margin:.2em 0">' + (M.levels[3] + M.levels[4]) + " of " + LA.TOPICS.length + " topics proficient or mastered</h3>" + levelBar(M.levels) +
      '<div class="grid grid-3" style="margin-top:12px"><div class="stat"><b>' + pct(M.practiceAcc) + '</b><span>practice accuracy (last ' + M.prac.length + ')</span></div><div class="stat"><b>' + pct(M.proofAvg) + '</b><span>proof self-marks (' + M.proofN + ')</span></div><div class="stat"><b>' + (M.lastExam ? Math.round(M.lastExam.result.pct) + "%" : "—") + '</b><span>last exam' + (M.bestExam !== null ? " (best " + Math.round(M.bestExam) + "%)" : "") + '</span></div><div class="stat"><b>' + pct(M.recall) + '</b><span>flashcard recall (30 d)</span></div><div class="stat"><b>' + M.mistakes + '</b><span>open mistakes (' + M.resolved + ' fixed)</span></div><div class="stat"><b>' + (imp === null ? "—" : (imp >= 0 ? "+" : "") + Math.round(imp * 100) + " pts") + '</b><span>accuracy vs last week</span></div></div></div>' +
      '<div class="card"><div class="kicker">Activity — effort, not proof of understanding</div><div class="grid grid-3" style="margin-top:8px"><div class="stat"><b>' + lvl.lvl + '</b><span>level · ' + esc(lvl.name) + '</span></div><div class="stat"><b>' + st.xp + '</b><span>XP</span></div><div class="stat"><b>' + (st.streak.n || 0) + '</b><span>day streak</span></div><div class="stat"><b>' + Object.keys(st.done).length + '</b><span>sections marked read</span></div><div class="stat"><b>' + Object.keys(st.stats.labs || {}).length + '</b><span>labs visited</span></div><div class="stat"><b>' + M.attempts + '</b><span>questions answered</span></div></div><p class="small muted" style="margin:.6em 0 0">XP and badges reward effort. Mastery levels above move only when you answer questions correctly on the first try without the solution. <a href="#/progress">Badges ▸</a></p></div>' +
      '<div class="card"><div class="kicker">Revision history</div>' + heatmap(M.days, full ? 16 : 12) + (M.weak.length ? '<div class="kicker" style="margin-top:12px">Weak concepts</div><ul class="small" style="margin:.3em 0 0">' + M.weak.map((x) => '<li><a href="#/learn/' + x.t.id + '">' + esc(x.t.title) + "</a> — " + pct(x.m.pct) + " over " + x.m.n + " answers</li>").join("") + "</ul>" : "") + "</div>" +
      (full ? '<div class="card"><div class="kicker">Improvement over time (weekly accuracy)</div>' + weekChart(M.weeks) + '</div><div class="card"><div class="kicker">By chapter</div><div class="tbl-wrap"><table class="tbl small"><tr><th>Chapter</th><th>Sections read</th><th>Topics proficient</th><th>Accuracy</th></tr>' + Object.entries(M.byCh).map(([c, v]) => '<tr><td><a href="#/ch/' + c + '">Ch ' + c + "</a></td><td>" + v.comp.done + "/" + v.comp.total + "</td><td>" + v.prof + "/" + v.n + "</td><td>" + pct(v.pct) + "</td></tr>").join("") + "</table></div></div>" : "") +
      "</div>";
  }
  LA.page("/dashboard", {
    title: "Dashboard", searchTitle: "Smart dashboard", searchDesc: "Mastery vs activity, accuracy trends, exams, flashcards, mistakes, weak concepts, recommendations",
    render() {
      const M = metrics();
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Your learning, measured honestly</div><h1>Smart dashboard</h1><p class="lead">Mastery comes only from answering questions; activity shows effort. Everything below is computed from what you have done on this device.</p><div class="row"><a class="btn" href="#/map">🗺️ Concept map</a><a class="btn" href="#/progress">🏆 Badges &amp; data export</a></div></div></div>' + cards(M, true) +
        LA.sectionTitle("Topic mastery") + '<div class="grid grid-3">' + LA.TOPICS.map((t) => '<a class="card hover" href="#/learn/' + t.id + '"><div class="row spread"><b class="small">' + esc(t.title) + "</b><span class=\"small muted\">Ch " + t.ch + "</span></div><div style=\"margin-top:6px\">" + LA.masteryChip(t.id) + "</div></a>").join("") + "</div></div>";
    },
  });
  (LA.afterRoute = LA.afterRoute || []).push(function (view, m) {
    if (m.page.pattern !== "/") return;
    const hero = view.querySelector(".hero"); if (!hero || view.querySelector(".dash")) return;
    const wrap = document.createElement("div"); wrap.innerHTML = LA.sectionTitle("Smart dashboard") + cards(metrics(), false) + '<p class="small" style="margin-top:8px"><a href="#/dashboard">Full dashboard: trends, chapters and every topic ▸</a></p>';
    hero.insertAdjacentElement("afterend", wrap);
    LA.renderMath(wrap);
  });
  LA.dashMetrics = metrics;
})();
