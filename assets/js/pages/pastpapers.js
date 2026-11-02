/* Past-paper log v2: year, semester, question number, topics, difficulty, attempt history (marks, time, mistakes),
   revision notes — each entry linked to the Topic Studio, practice, proofs and the theorem library.
   Copyright: no exam papers are hosted here; the log stores only your own notes. Old v1 entries are migrated in place. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const OLD_TAGS = { "Linearity": "linear-maps", "Basis images": "linear-maps", "Kernel/Range": "kernel-range", "Rank–Nullity": "kernel-range", "Isomorphism": "isomorphisms", "Matrix of T": "matrix-of-map", "Inner product": "inner-products", "Norm/Angle": "norms-angles", "S⊥": "orthogonality", "C–S/Triangle": "norms-angles", "Gram–Schmidt": "gram-schmidt", "Proof": null };
  function load() {
    const log = LA.store.get("ppLog", []); let changed = false;
    log.forEach((e, i) => {
      if (e.id) return; changed = true;
      e.id = "pp" + (e.at || Date.now()).toString(36) + i;
      const m = String(e.paper || "").match(/(\d{4}(?:\s*\/\s*\d{2,4})?)/); e.year = e.year || (m ? m[1].replace(/\s/g, "") : "");
      const s = String(e.paper || "").match(/sem(?:ester)?\s*(\d)/i); e.sem = e.sem || (s ? s[1] : "");
      e.topics = e.topics || Array.from(new Set((e.tags || []).map((t) => OLD_TAGS[t]).filter(Boolean)));
      e.attempts = e.attempts || (e.done ? [{ t: e.at || Date.now(), marks: null, outOf: null, minutes: null, mistakes: "", migrated: true }] : []);
      e.revision = e.revision || e.notes || ""; e.diff = e.diff || 3;
    });
    if (changed) LA.store.set("ppLog", log);
    return log;
  }
  const save = (log) => LA.store.set("ppLog", log);
  const topicOpts = (sel) => Object.values(LA.chapters).sort((a, b) => a.num - b.num).map((c) => '<optgroup label="Chapter ' + c.num + '">' + LA.topicsOf(c.num).map((t) => '<option value="' + t.id + '"' + ((sel || []).includes(t.id) ? " selected" : "") + ">" + esc(t.title) + "</option>").join("") + "</optgroup>").join("");
  const stars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

  LA.page("/pastpapers", {
    title: "Past Papers", searchTitle: "Past Papers & log", searchDesc: "Official UWI archive, how to use past papers, your past-paper log with attempts and revision notes",
    render(p, q) {
      const log = load(), ft = q.topic || "", fy = q.year || "";
      const freq = {}; log.forEach((e) => (e.topics || []).forEach((t) => { freq[t] = (freq[t] || 0) + 1; }));
      const years = Array.from(new Set(log.map((e) => e.year).filter(Boolean))).sort();
      const shown = log.filter((e) => (!ft || (e.topics || []).includes(ft)) && (!fy || e.year === fy));
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Exam archive</div><h1>Past Papers</h1><p class="lead">Official MATH 2273 past papers are held by The Alma Jordan Library (UWI St. Augustine). Use them alongside the practice material here, and log every question you attempt.</p></div></div>' +
        '<div class="grid grid-2" style="margin-top:18px"><div class="card glow"><div class="kicker">Step 1 · Get the official papers</div><ol><li>Open <a href="https://libraries.sta.uwi.edu/apps/pastpapers" target="_blank" rel="noopener">libraries.sta.uwi.edu/apps/pastpapers ↗</a> (also linked from the Alma Jordan Library site under <i>Research → Past Exam Papers</i>).</li><li>Read and accept the library\'s <b>Appropriate Use Policy</b> (papers are copyright of The UWI — personal, non-commercial study only).</li><li>Search <code>MATH2273</code> or <code>MATH 2273</code>; for a specific sitting use <code>course code|semester|year</code>, e.g. <code>MATH 2273|1|2023</code>.</li><li>Download the papers to your device (log in with your UWI credentials if prompted, e.g. off-campus).</li></ol><p class="small muted">This site deliberately does not re-publish the official papers. Your log below stays in this browser (and in your exports).</p></div>' +
        '<div class="card"><div class="kicker">Step 2 · Use them like a pro</div><ol><li><b>Sort by topic first</b> — tag each question below, then do all questions on one topic across years.</li><li><b>Attempt cold</b>, timed, on paper. Mark yourself against the matching scheme style in the <a href="#/exams">Exam Centre</a>.</li><li><b>Log every attempt</b> with marks and mistakes; redo weak ones a week later.</li><li>Use the topic links to jump to the lesson, practice generator or proof drills for that topic.</li></ol></div></div>' +
        LA.sectionTitle("Log a question") +
        '<div class="card"><div class="grid grid-4"><label class="field">Year<input type="text" id="ppYear" placeholder="e.g. 2023/24"></label><label class="field">Semester<select id="ppSem"><option value="1">1</option><option value="2">2</option><option value="S">Summer</option><option value="">—</option></select></label><label class="field">Question<input type="text" id="ppQ" placeholder="e.g. 2(b)"></label><label class="field">Difficulty<select id="ppDiff">' + [1, 2, 3, 4, 5].map((n) => '<option value="' + n + '"' + (n === 3 ? " selected" : "") + ">" + stars(n) + "</option>").join("") + "</select></label></div>" +
        '<div class="grid grid-2" style="margin-top:10px"><label class="field">Topics (Ctrl/⌘-click for several)<select id="ppTopics" multiple size="6">' + topicOpts([]) + '</select></label><label class="field">Your paraphrase / reference (keep it short; $…$ for maths)<textarea id="ppText" rows="5" placeholder="e.g. Show T(p) = p\' + p is an isomorphism on P2"></textarea></label></div>' +
        '<label class="field" style="margin-top:10px">Revision notes<textarea id="ppRev" rows="2" placeholder="Key idea, trap, which theorem to quote…"></textarea></label><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="ppAdd">Add to log</button></div></div>' +
        (Object.keys(freq).length ? '<div class="card" style="margin-top:14px"><div class="kicker">Topic frequency in your log</div><div class="row" style="margin-top:8px">' + Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([t, n]) => '<a class="chip ' + (t === ft ? "violet" : "") + '" href="#/pastpapers?topic=' + (t === ft ? "" : t) + '">' + esc((LA.topic(t) || {}).title || t) + " × " + n + "</a>").join("") + "</div></div>" : "") +
        LA.sectionTitle("My log (" + shown.length + (shown.length !== log.length ? " of " + log.length : "") + ")") +
        (years.length > 1 ? '<div class="row" style="margin-bottom:10px">' + ['<a class="chip ' + (!fy ? "violet" : "") + '" href="#/pastpapers">All years</a>'].concat(years.map((y) => '<a class="chip ' + (y === fy ? "violet" : "") + '" href="#/pastpapers?year=' + encodeURIComponent(y) + '">' + esc(y) + "</a>")).join("") + "</div>" : "") +
        (shown.length ? shown.slice().reverse().map((e) => entryHTML(e)).join("") : '<div class="box tip" data-t="No questions logged yet">Start with the official papers above — or warm up with the <a href="#/exams">Exam Centre</a> (2-hour final simulations) and the <a href="#/mock">mock tests</a>.</div>') + "</div>";
    },
    after(view) {
      $("#ppAdd", view).onclick = () => {
        const text = $("#ppText", view).value.trim(), qn = $("#ppQ", view).value.trim();
        if (!text && !qn) { LA.toast("Add a question number or a short description", ""); return; }
        const log = load();
        const topics = Array.from($("#ppTopics", view).selectedOptions).map((o) => o.value);
        const year = $("#ppYear", view).value.trim(), sem = $("#ppSem", view).value;
        log.push({ id: "pp" + Date.now().toString(36), year, sem, q: qn, paper: (year ? year + " " : "") + (sem ? "Sem " + sem : ""), text, topics, tags: [], diff: +$("#ppDiff", view).value, attempts: [], revision: $("#ppRev", view).value.trim(), notes: "", done: false, at: Date.now() });
        save(log); LA.addXP(5, "Past-paper question logged"); LA.route();
      };
      $$("[data-pp]", view).forEach((box) => {
        const id = box.dataset.pp;
        const get = () => { const log = load(); return { log, e: log.find((x) => x.id === id) }; };
        const add = $("[data-att]", box);
        if (add) add.onclick = () => { const { log, e } = get(); const marks = $("[data-m]", box).value, out = $("[data-o]", box).value; e.attempts.push({ t: Date.now(), marks: marks === "" ? null : +marks, outOf: out === "" ? null : +out, minutes: +$("[data-min]", box).value || null, mistakes: $("[data-mis]", box).value.trim() }); e.done = out !== "" && marks !== "" && +marks >= 0.8 * +out; save(log); if (e.topics && e.topics[0] && out !== "" && marks !== "") LA.ev.record({ topic: e.topics[0], src: "exam", score: Math.max(0, Math.min(1, +marks / +out)), gen: "pp:" + id }); LA.addXP(8, "Past-paper attempt logged"); LA.route(); };
        const rv = $("[data-rev]", box); if (rv) rv.addEventListener("change", () => { const { log, e } = get(); e.revision = rv.value; save(log); LA.toast("Notes saved", ""); });
        const del = $("[data-delpp]", box); if (del) del.onclick = () => { if (!confirm("Delete this entry?")) return; const { log } = get(); save(log.filter((x) => x.id !== id)); LA.route(); };
      });
    },
  });
  function entryHTML(e) {
    const tps = (e.topics || []).map(LA.topic).filter(Boolean);
    const last = (e.attempts || []).filter((a) => a.outOf).slice(-1)[0];
    const status = !e.attempts.length ? ["trap", "Not attempted"] : last && last.marks / last.outOf >= 0.8 ? ["ex", "Secure"] : ["recipe", "Needs another go"];
    return '<div class="box ' + status[0] + '" data-tag="' + status[1] + '" data-t="' + esc([e.year, e.sem ? "Sem " + e.sem : "", e.q ? "Q" + e.q.replace(/^q/i, "") : ""].filter(Boolean).join(" · ") || e.paper || "Question") + " · " + stars(e.diff || 3) + '" data-pp="' + e.id + '">' +
      (e.text ? "<div>" + esc(e.text).replace(/\n/g, "<br>") + "</div>" : "") +
      (tps.length ? '<div class="row" style="margin-top:6px">' + tps.map((t) => '<a class="chip violet" href="#/learn/' + t.id + '">📖 ' + esc(t.title) + '</a><a class="chip" href="#/practice?mode=topic&topic=' + t.id + '">♾️ practise</a>' + ((LA.PROOF_TASKS || []).some((x) => x.topic === t.id) ? '<a class="chip" href="#/learn/' + t.id + '?mode=prove">✍️ proofs</a>' : "") + '<a class="chip" href="#/encyclopedia?topic=' + t.id + '">📚 theorems</a>').join("") + "</div>" : '<p class="small muted">No topics tagged.</p>') +
      (e.attempts.length ? '<table class="tbl small" style="margin-top:8px"><tr><th>Attempt</th><th>Marks</th><th>Time</th><th>Mistakes</th></tr>' + e.attempts.map((a) => "<tr><td>" + new Date(a.t).toLocaleDateString() + "</td><td>" + (a.outOf ? a.marks + "/" + a.outOf : a.migrated ? "solved (v1)" : "—") + "</td><td>" + (a.minutes ? a.minutes + " min" : "—") + "</td><td>" + esc(a.mistakes || "") + "</td></tr>").join("") + "</table>" : "") +
      '<details class="reveal"><summary>Log an attempt / edit notes</summary><div class="grid grid-4"><label class="field">Marks<input type="number" data-m min="0"></label><label class="field">Out of<input type="number" data-o min="1"></label><label class="field">Minutes<input type="number" data-min min="0"></label><label class="field">Mistakes<input type="text" data-mis placeholder="e.g. forgot to check 0 ∈ W"></label></div><div class="row" style="margin-top:6px"><button class="btn btn-sm btn-primary" data-att>Save attempt</button></div>' +
      '<label class="field" style="margin-top:8px">Revision notes<textarea data-rev rows="2">' + esc(e.revision || "") + '</textarea></label><div class="row" style="margin-top:6px"><button class="btn btn-sm btn-bad" data-delpp>Delete entry</button></div></details></div>';
  }
})();
