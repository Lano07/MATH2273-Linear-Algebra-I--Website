/* Study engines: quizzes, flashcards, mock tests, progress */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;

  /* =================== QUIZ ENGINE =================== */
  LA.mountQuiz = function (host, setId, opts) {
    opts = opts || {};
    const set = LA.QUIZ[setId]; if (!host) return;
    if (!set) { host.innerHTML = '<div class="card">Quiz not found.</div>'; return; }
    let qs = LA.shuffle(set.qs);
    if (opts.limit || set.qs.length > 25) qs = qs.slice(0, opts.limit || 20);
    qs = qs.map((q) => { const idx = LA.shuffle(q.o.map((_, i) => i)); return { q: q.q, o: idx.map((i) => q.o[i]), a: idx.indexOf(q.a), e: q.e }; });
    let i = 0, score = 0; const results = [];
    const draw = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      host.innerHTML = '<div class="card glow"><div class="quiz-top"><div><div class="kicker">' + esc(set.title) + '</div><b>Question ' + (i + 1) + " of " + qs.length + '</b></div><div class="pill-progress">' + qs.map((_, k) => '<i class="' + (k < i ? (results[k] ? "ok" : "no") : k === i ? "cur" : "") + '"></i>').join("") + '</div><span class="chip lime">Score ' + score + "</span></div>" +
        '<div class="quiz-q" style="font-size:1.08rem">' + q.q + '</div><div class="quiz-opts">' + q.o.map((o, k) => '<button class="quiz-opt" data-k="' + k + '"><span class="lt">' + "ABCDEF"[k] + "</span><span>" + o + "</span></button>").join("") + '</div><div class="quiz-feedback"></div></div>';
      LA.renderMath(host);
      $$(".quiz-opt", host).forEach((b) => b.addEventListener("click", () => answer(Number(b.dataset.k))));
    };
    const answer = (k) => {
      const q = qs[i]; const ok = k === q.a; results[i] = ok; if (ok) score++;
      $$(".quiz-opt", host).forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add("correct"); else if (j === k) b.classList.add("wrong"); });
      const fb = $(".quiz-feedback", host);
      fb.innerHTML = '<div class="quiz-expl"><b class="' + (ok ? "okc" : "err") + '">' + (ok ? "✓ Correct!" : "✗ Not quite.") + "</b> " + (q.e || "") + '</div><div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn btn-primary nextq">' + (i + 1 < qs.length ? "Next question ▸" : "See results ▸") + "</button></div>";
      LA.renderMath(fb);
      if (ok) { LA.state.stats.quizCorrect = (LA.state.stats.quizCorrect || 0) + 1; LA.save(); }
      $(".nextq", fb).onclick = () => { i++; draw(); };
      $(".nextq", fb).focus();
    };
    const finish = () => {
      const pct = Math.round((100 * score) / qs.length);
      const best = LA.store.get("quizBest", {}); const prev = best[setId] || 0; if (pct > prev) { best[setId] = pct; LA.store.set("quizBest", best); }
      LA.addXP(score * 3 + (pct === 100 ? 20 : 0), "Quiz: " + score + "/" + qs.length);
      if (pct === 100) { LA.state.stats.quizPerfect = (LA.state.stats.quizPerfect || 0) + 1; LA.save(); }
      if (pct >= 80) LA.confetti({ particleCount: 160 });
      LA.checkBadges();
      const wrong = qs.map((q, k) => ({ q, k })).filter((x) => !results[x.k]);
      host.innerHTML = '<div class="card glow center"><div class="kicker">' + esc(set.title) + '</div><div style="font-family:var(--font-head);font-size:3.4rem;font-weight:700" class="grad-text">' + pct + '%</div><p>' + score + " / " + qs.length + " correct" + (prev ? " · previous best " + prev + "%" : "") + "</p><p class=\"muted\">" + (pct >= 90 ? "Outstanding — you own this material." : pct >= 70 ? "Solid. Review the misses below and retake." : "Good start. Re-read the linked chapter sections, then try again.") + '</p><div class="row" style="justify-content:center"><button class="btn btn-primary retake">↻ Retake (new order)</button><a class="btn" href="#/quiz">All quizzes</a></div></div>' +
        (wrong.length ? '<h3>Review your misses</h3>' + wrong.map((x) => '<div class="box trap"><p><b>Q:</b> ' + x.q.q + '</p><p><b>Answer:</b> ' + x.q.o[x.q.a] + '</p><p class="small">' + (x.q.e || "") + "</p></div>").join("") : "");
      LA.renderMath(host);
      $(".retake", host).onclick = () => LA.mountQuiz(host, setId, opts);
    };
    draw();
  };

  LA.page("/quiz", {
    title: "Quizzes", searchTitle: "Quizzes", searchDesc: "Multiple-choice concept checks with explanations",
    render() {
      const best = LA.store.get("quizBest", {});
      const sets = [["mix34", "🎯", "Coursework mix (Ch 3 & 4)"], ["ch3", "3", ""], ["ch4", "4", ""], ["ch1", "1", ""], ["ch2", "2", ""], ["ch5", "5", ""], ["ch6", "6", ""], ["ch7", "7", ""], ["ch8", "8", ""], ["all", "∞", "Everything (random 20)"]];
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Concept checks</div><h1>Quizzes</h1><p class="lead">Every answer comes with an explanation. Wrong answers are where the learning happens — read each explanation, then retake until you score 90%+.</p></div></div>' +
        '<div class="grid grid-3" style="margin-top:18px">' + sets.map((s) => { const set = LA.QUIZ[s[0]]; if (!set) return ""; const b = best[s[0]]; return '<a class="card hover" href="#/quiz/' + s[0] + '"><div class="ch-card">' + LA.ring(b || 0, b ? b + "%" : "—") + '<div><div class="kicker">' + (s[0] === "mix34" ? "Coursework" : s[0] === "all" ? "All chapters" : "Chapter " + s[1]) + "</div><h3>" + (s[2] || set.title.replace(/^Chapter \d — /, "")) + "</h3><p>" + Math.min(set.qs.length, 20) + " questions" + (b ? " · best " + b + "%" : "") + "</p></div></div></a>"; }).join("") + "</div></div>";
    },
  });
  LA.page("/quiz/:set", {
    title: "Quiz",
    render(p) { return '<div class="page"><div class="row" style="margin-bottom:12px"><a class="btn btn-sm" href="#/quiz">◂ All quizzes</a></div><div id="quizHost"></div></div>'; },
    after(view, p) { LA.mountQuiz($("#quizHost", view), p.set, { limit: p.set === "mix34" ? 20 : undefined }); },
  });

  /* =================== FLASHCARDS =================== */
  LA.page("/flashcards/classic", {
    title: "Classic Flashcards", searchTitle: "Classic Flashcards (v1 Leitner boxes)", searchDesc: "Definitions & theorems with spaced repetition",
    render(p, q) {
      const filter = q.ch || "34";
      const chips = [["34", "Ch 3 + 4 (coursework)"], ["all", "All"], ["ch3", "Ch 3"], ["ch4", "Ch 4"], ["ch1", "Ch 1"], ["ch2", "Ch 2"], ["ch5", "Ch 5"], ["ch6", "Ch 6"], ["ch7", "Ch 7"], ["ch8", "Ch 8"]];
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Spaced repetition</div><h1>Flashcards</h1><p class="lead">Say the answer out loud (or write it), then flip. Rate yourself honestly — cards you miss come back sooner. <span class="key-hint">Keys: <kbd>Space</kbd> flip · <kbd>1</kbd> again · <kbd>2</kbd> hard · <kbd>3</kbd> good · <kbd>4</kbd> easy</span></p></div></div>' +
        '<div class="row" style="margin:16px 0">' + chips.map((c) => '<a class="chip ' + (c[0] === filter ? "violet" : "") + '" href="#/flashcards/classic?ch=' + c[0] + '">' + c[1] + "</a>").join("") + "</div>" +
        '<div id="boxes" class="card" style="margin-bottom:14px"></div><div class="flash-wrap"><div class="flashcard" id="fc"><div class="flash-face front"></div><div class="flash-face back"></div></div></div>' +
        '<div class="row" style="justify-content:center;margin-top:16px" id="fcBtns"><button class="btn btn-primary" data-flip>Flip (Space)</button></div></div>';
    },
    after(view, p, q) {
      const filter = q.ch || "34";
      const cards = LA.CARDS.filter((c) => filter === "all" || (filter === "34" ? c.ch === "ch3" || c.ch === "ch4" : c.ch === filter));
      const boxes = LA.store.get("flash", {});
      let cur = null, flipped = false, last = null;
      const fc = $("#fc", view);
      const drawBoxes = () => {
        const cnt = [0, 0, 0, 0, 0, 0]; cards.forEach((c) => cnt[boxes[c.id] || 0]++);
        $("#boxes", view).innerHTML = '<div class="row spread"><b>' + cards.length + ' cards</b><span class="small muted">Box 0 = new · Box 5 = mastered</span></div><div class="row" style="margin-top:8px">' + cnt.map((n, k) => '<span class="chip ' + (k >= 4 ? "lime" : k >= 2 ? "cyan" : k === 1 ? "amber" : "") + '">Box ' + k + ": " + n + "</span>").join("") + '</div><div class="bar" style="margin-top:10px"><i style="width:' + Math.round((100 * cards.reduce((s, c) => s + (boxes[c.id] || 0), 0)) / (5 * cards.length || 1)) + '%"></i></div>';
      };
      const pick = () => {
        const minBox = Math.min.apply(null, cards.map((c) => boxes[c.id] || 0));
        let pool = cards.filter((c) => (boxes[c.id] || 0) <= minBox + 1 && c !== last);
        if (!pool.length) pool = cards;
        // weight lower boxes more
        const w = pool.map((c) => 6 - (boxes[c.id] || 0)); const tot = w.reduce((a, b) => a + b, 0); let r = Math.random() * tot;
        for (let k = 0; k < pool.length; k++) { r -= w[k]; if (r <= 0) return pool[k]; }
        return pool[0];
      };
      const show = () => {
        cur = pick(); last = cur; flipped = false; fc.classList.remove("flipped");
        $(".front", fc).innerHTML = '<span class="ftag">' + cur.ch.replace("ch", "Chapter ") + " · box " + (boxes[cur.id] || 0) + '</span><h3>' + cur.f + '</h3><p class="muted small" style="margin-top:14px">Recall it, then flip ↻</p>';
        $(".back", fc).innerHTML = '<span class="ftag">Answer</span><div style="margin-top:18px">' + cur.b + "</div>";
        LA.renderMath(fc);
        $("#fcBtns", view).innerHTML = '<button class="btn btn-primary" data-flip>Flip (Space)</button>';
        $("[data-flip]", view).onclick = flip;
      };
      const flip = () => {
        flipped = !flipped; fc.classList.toggle("flipped", flipped);
        if (flipped) {
          $("#fcBtns", view).innerHTML = '<button class="btn btn-bad" data-r="0">1 · Again</button><button class="btn" data-r="1">2 · Hard</button><button class="btn btn-ok" data-r="2">3 · Good</button><button class="btn btn-primary" data-r="3">4 · Easy</button>';
          $$("[data-r]", view).forEach((b) => b.onclick = () => rate(Number(b.dataset.r)));
        }
      };
      const rate = (r) => {
        const b = boxes[cur.id] || 0;
        boxes[cur.id] = r === 0 ? 1 : r === 1 ? Math.max(1, b) : Math.min(5, b + (r === 2 ? 1 : 2));
        LA.store.set("flash", boxes);
        LA.state.stats.flash = (LA.state.stats.flash || 0) + 1; LA.state.xp += 1; LA.save(); LA.updateHeader(); LA.checkBadges();
        drawBoxes(); show();
      };
      fc.onclick = flip;
      const onKey = (ev) => {
        if (!document.body.contains(fc)) { document.removeEventListener("keydown", onKey); return; }
        if (/input|textarea/i.test((document.activeElement || {}).tagName || "")) return;
        if (ev.code === "Space") { ev.preventDefault(); flip(); }
        else if (flipped && ["1", "2", "3", "4"].includes(ev.key)) rate(Number(ev.key) - 1);
      };
      document.addEventListener("keydown", onKey);
      drawBoxes(); show();
    },
  });

  /* =================== MOCK TESTS =================== */
  LA.page("/mock", {
    title: "Mock Tests", searchTitle: "Mock Tests", searchDesc: "Timed coursework-style papers with marking schemes",
    render() {
      const res = LA.store.get("mockResults", []);
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Exam simulation · Chapters 3 & 4</div><h1>Mock Coursework Tests</h1><p class="lead">Original papers written in the style of a UWI coursework test, each with a detailed marking scheme. Sit them under timed conditions on paper, then mark yourself point by point — exactly how a marker would.</p></div></div>' +
        '<div class="grid grid-3" style="margin-top:18px">' + LA.MOCKS.map((m) => { const best = res.filter((r) => r.id === m.id).reduce((a, r) => Math.max(a, r.pct), 0); return '<a class="card hover" href="#/mock/' + m.id + '"><div class="kicker">' + m.level + '</div><h3 style="margin:.2em 0">' + m.title + '</h3><p class="muted small">' + m.minutes + " minutes · " + m.marks + " marks · " + m.questions.length + " questions</p>" + (best ? '<span class="chip lime">Best ' + best + "%</span>" : '<span class="chip">Not attempted</span>') + "</a>"; }).join("") + "</div>" +
        (res.length ? LA.sectionTitle("Your attempts") + '<div class="tbl-wrap"><table class="tbl"><tr><th>Date</th><th>Paper</th><th>Score</th><th>%</th></tr>' + res.slice().reverse().map((r) => "<tr><td>" + new Date(r.date).toLocaleString() + "</td><td>Mock " + r.id + "</td><td>" + r.score + " / " + r.marks + "</td><td><b>" + r.pct + "%</b></td></tr>").join("") + "</table></div>" : "") +
        '<div class="box tip" data-t="How to get the most from a mock">' + "<ol><li>Clear your desk, set the timer, no notes.</li><li>Write full solutions on paper.</li><li>Press <b>Finish &amp; mark</b>, open each marking scheme and tick only the marks you truly earned.</li><li>For every lost mark, re-read the linked recipe/proof and redo the part.</li></ol></div>" +
        '<p class="small muted">These are original practice papers (not official UWI papers). For official past papers see <a href="#/pastpapers">Past Papers</a>.</p></div>';
    },
  });
  LA.page("/mock/:id", {
    title: (p) => "Mock Test " + p.id,
    render(p) {
      const m = LA.MOCKS.find((x) => x.id === p.id); if (!m) return '<div class="page"><div class="card">Mock not found.</div></div>';
      return '<div class="page"><div class="card glow" style="position:sticky;top:calc(var(--header-h) + 8px);z-index:20"><div class="row spread"><div><div class="kicker">' + m.level + " · " + m.marks + ' marks</div><b>' + m.title + '</b></div><div class="row"><span class="timer" id="timer">' + String(m.minutes).padStart(2, "0") + ':00</span><button class="btn btn-sm" id="tStart">▶ Start</button><button class="btn btn-sm btn-primary" id="tFinish">Finish &amp; mark</button></div></div><div class="row spread" style="margin-top:6px"><span class="small muted">' + m.intro + '</span><b id="scoreLive" class="hidden"></b></div></div>' +
        m.questions.map((qq) => '<div class="card" style="margin-top:16px"><h3 style="margin-top:0">Question ' + qq.n + " · " + qq.title + " <span class=\"chip pink\">" + qq.parts.reduce((s, x) => s + x.m, 0) + " marks</span></h3>" +
          qq.parts.map((pt, pi) => '<div style="margin:12px 0"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><b style="min-width:2em">' + pt.l + '</b><div style="flex:1">' + pt.q + "</div>" + (pt.m ? '<span class="chip">[' + pt.m + "]</span>" : "") + "</div>" +
            (pt.s ? '<details class="reveal sol mock-sol hidden"><summary>Marking scheme &amp; model answer</summary><div class="kicker" style="margin-top:6px">Tick the marks you earned</div>' + pt.s.map((s, si) => '<label class="mark-pt"><input type="checkbox" data-mk="' + s[0] + '" data-id="' + qq.n + "-" + pi + "-" + si + '"><span>' + s[1] + '</span><span class="mk">' + s[0] + "</span></label>").join("") + '<div class="box ex" data-t="Model answer" style="margin-top:8px">' + pt.a + "</div></details>" : "") + "</div>").join("") + "</div>").join("") +
        '<div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary hidden" id="saveRes">💾 Save my score</button></div></div>';
    },
    after(view, p) {
      const m = LA.MOCKS.find((x) => x.id === p.id); if (!m) return;
      let left = m.minutes * 60, running = false, tm = null, marking = false;
      const tEl = $("#timer", view);
      const fmt = () => { tEl.textContent = String(Math.floor(left / 60)).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0"); tEl.classList.toggle("low", left <= 300); };
      const tick = () => { if (!document.body.contains(tEl)) { clearInterval(tm); return; } if (!running) return; left = Math.max(0, left - 1); fmt(); if (left === 0) { running = false; LA.toast("⏰ Time is up!", "Pens down — now mark your answers."); startMarking(); } };
      tm = setInterval(tick, 1000);
      $("#tStart", view).onclick = () => { running = !running; $("#tStart", view).textContent = running ? "⏸ Pause" : "▶ Resume"; };
      const live = () => { const got = $$("input[data-mk]:checked", view).reduce((s, c) => s + Number(c.dataset.mk), 0); $("#scoreLive", view).textContent = "Score: " + got + " / " + m.marks + " (" + Math.round((100 * got) / m.marks) + "%)"; return got; };
      const startMarking = () => {
        if (marking) return; marking = true; running = false;
        $$(".mock-sol", view).forEach((d) => d.classList.remove("hidden"));
        $("#scoreLive", view).classList.remove("hidden"); $("#saveRes", view).classList.remove("hidden");
        $("#tStart", view).disabled = true; live();
        LA.toast("📝 Marking mode", "Open each marking scheme and tick the marks you earned.");
      };
      $("#tFinish", view).onclick = startMarking;
      $$("input[data-mk]", view).forEach((c) => c.addEventListener("change", live));
      $("#saveRes", view).onclick = () => {
        const got = live(); const pct = Math.round((100 * got) / m.marks);
        const res = LA.store.get("mockResults", []); res.push({ id: m.id, score: got, marks: m.marks, pct, date: Date.now() }); LA.store.set("mockResults", res);
        LA.state.stats.mocks = (LA.state.stats.mocks || 0) + 1; LA.state.stats.mockBest = Math.max(LA.state.stats.mockBest || 0, pct); LA.save();
        LA.addXP(50, "Mock test completed"); if (pct >= 80) LA.confetti({ particleCount: 220, spread: 120 });
        LA.toast("Saved: " + got + "/" + m.marks + " (" + pct + "%)", pct >= 80 ? "Exam-ready performance!" : "Redo every lost mark — that's where the improvement is.", 4000);
        $("#saveRes", view).disabled = true;
      };
    },
  });

  /* =================== PROGRESS =================== */
  LA.page("/progress", {
    title: "Progress & Badges", searchTitle: "Progress & Badges", searchDesc: "XP, level, badges, chapter progress, reset",
    render() {
      const l = LA.level(); const st = LA.state.stats; const best = LA.store.get("quizBest", {});
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Your journey</div><h1>Level ' + l.lvl + ' · <span class="grad-text">' + l.name + "</span></h1><p class=\"lead\">" + LA.state.xp + " XP · " + (LA.state.streak.n || 0) + "-day streak (best " + (LA.state.streak.best || 0) + ')</p><div class="bar" style="max-width:520px"><i style="width:' + Math.round((100 * l.into) / l.need) + '%"></i></div></div></div>' +
        LA.sectionTitle("Badges") + '<div class="badge-grid">' + LA.BADGES.map((b) => '<div class="badge ' + (LA.state.badges[b.id] ? "got" : "") + '"><div class="bi">' + b.ico + "</div><b>" + b.name + "</b><span>" + b.desc + "</span></div>").join("") + "</div>" +
        LA.sectionTitle("Chapters") + '<div class="grid grid-4">' + Object.values(LA.chapters).sort((a, b) => a.num - b.num).map((c) => { const p = LA.chapterProgress(c.id); return '<a class="card hover" href="#/ch/' + c.num + '"><div class="ch-card">' + LA.ring(p.pct) + "<div><b>Ch " + c.num + '</b><p class="small muted" style="margin:0">' + c.short + "<br>quiz best: " + (best[c.id] ? best[c.id] + "%" : "—") + "</p></div></div></a>"; }).join("") + "</div>" +
        LA.sectionTitle("Stats") + '<div class="grid grid-4">' + [["Quiz answers correct", st.quizCorrect || 0], ["Practice problems", st.practice || 0], ["Flashcard reviews", st.flash || 0], ["Mock tests", st.mocks || 0], ["Best mock", (st.mockBest || 0) + "%"], ["Proof puzzles solved", st.parsons || 0], ["Gram–Schmidt runs", st.gs || 0], ["Labs explored", Object.keys(st.labs || {}).length]].map((s) => '<div class="card"><div class="stat"><b>' + s[1] + "</b><span>" + s[0] + "</span></div></div>").join("") + "</div>" +
        LA.sectionTitle("Settings") + '<div class="card"><label class="toggle"><input type="checkbox" id="calmT"' + (LA.store.get("calm", false) ? " checked" : "") + '> Calm mode (no confetti, still background)</label><hr><div class="row"><button class="btn" id="exp">⬇ Export progress</button><label class="btn" style="cursor:pointer">⬆ Import progress<input type="file" id="imp" accept="application/json" class="hidden"></label><button class="btn btn-bad" id="rst">Reset all progress</button></div><p class="small muted">Progress is stored only in this browser (localStorage). Export it to move to another device.</p></div></div>';
    },
    after(view) {
      $("#calmT", view).onchange = (e) => { LA.store.set("calm", e.target.checked); document.documentElement.classList.toggle("calm", e.target.checked); };
      $("#rst", view).onclick = () => { if (confirm("Reset ALL progress (XP, badges, completions, scores)? This cannot be undone.")) { Object.keys(localStorage).filter((k) => k.startsWith("la2273:")).forEach((k) => localStorage.removeItem(k)); location.reload(); } };
      $("#exp", view).onclick = () => { const data = {}; Object.keys(localStorage).filter((k) => k.startsWith("la2273:")).forEach((k) => { data[k] = localStorage.getItem(k); }); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" })); a.download = "math2273-progress.json"; a.click(); };
      $("#imp", view).onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { const d = JSON.parse(t); Object.keys(d).forEach((k) => { if (k.startsWith("la2273:")) localStorage.setItem(k, d[k]); }); location.reload(); } catch (err) { LA.toast("Import failed", "Not a valid progress file."); } }); };
    },
  });
})();
