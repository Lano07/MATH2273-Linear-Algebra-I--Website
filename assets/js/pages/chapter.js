/* Chapter page: hero, tabs (lesson / exercises / quiz / summary), TOC, completion tracking */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, slug } = LA;

  function findCh(n) { return Object.values(LA.chapters).find((c) => String(c.num) === String(n)); }

  LA.page("/ch/:n", {
    title: (p) => { const c = findCh(p.n); return c ? "Ch " + c.num + " " + c.title : "Chapter"; },
    render(params, q) {
      const ch = findCh(params.n);
      if (!ch) return '<div class="page"><div class="card"><h2>Chapter not found</h2><a href="#/">Back to dashboard</a></div></div>';
      const tab = q.tab || "lesson";
      const prog = LA.chapterProgress(ch.id);
      const prev = findCh(ch.num - 1), next = findCh(ch.num + 1);
      const tabs = [["lesson", "📖 Lesson"], ["exercises", "📝 Exercises + Full Solutions"], ["quiz", "⚡ Chapter Quiz"], ["summary", "🧾 1-Page Summary"]];
      let body = "";
      if (tab === "lesson") {
        const toc = '<aside class="toc"><b>On this page</b>' + ch.sections.map((s) => '<a href="#/ch/' + ch.num + "?go=sec-" + slug(s.id) + '" class="' + (LA.state.done[ch.id + "/" + s.id] ? "done" : "") + '"><span class="muted">' + s.id + "</span> " + s.title + "</a>").join("") + '<a href="#/ch/' + ch.num + '?tab=exercises">📝 Exercises</a><a href="#/ch/' + ch.num + '?tab=quiz">⚡ Quiz</a></aside>';
        const depth = LA.store.get("depth", "a");
        const depthBar = '<div class="card depth-bar no-print"><span class="kicker" style="margin:0">Depth</span><div class="seg" role="group" aria-label="Lesson depth">' +
          ["f", "s", "a"].map((k) => '<button type="button" data-depth="' + k + '" aria-pressed="' + (k === depth) + '" title="' + LA.esc(LA.DEPTH[k].desc) + '">' + (k === "a" ? "Everything (incl. enrichment)" : LA.DEPTH[k].name) + "</button>").join("") +
          '</div><span class="small muted" id="depthInfo" style="flex:1 1 240px"></span></div>';
        body = depthBar + '<div class="with-toc"><article class="lesson" data-depth="' + depth + '">' +
          (ch.intro ? '<div class="card glow" style="margin-bottom:10px">' + ch.intro + "</div>" : "") +
          ch.sections.map((s) => {
            const key = ch.id + "/" + s.id; const done = !!LA.state.done[key];
            return '<section id="sec-' + slug(s.id) + '"><h2><span class="sec-num">' + s.id + "</span>" + s.title + "</h2>" + s.html +
              '<div class="sec-done"><button class="btn btn-sm ' + (done ? "is-done" : "") + '" data-done="' + key + '">' + (done ? "✓ Section completed" : "Mark section " + s.id + " complete (+15 XP)") + "</button></div></section>";
          }).join("") +
          '<div class="row spread" style="margin-top:30px">' + (prev ? '<a class="btn" href="#/ch/' + prev.num + '">◂ Chapter ' + prev.num + "</a>" : "<span></span>") + '<a class="btn btn-primary" href="#/ch/' + ch.num + '?tab=exercises">Next: Exercises + Solutions ▸</a>' + (next ? '<a class="btn" href="#/ch/' + next.num + '">Chapter ' + next.num + " ▸</a>" : "<span></span>") + "</div>" +
          "</article>" + toc + "</div>";
      } else if (tab === "exercises") {
        body = '<article class="lesson">' + (ch.exercises || '<div class="card">Exercises coming soon.</div>') + "</article>";
      } else if (tab === "quiz") {
        body = '<div id="chQuiz"></div>';
      } else if (tab === "summary") {
        body = '<article class="lesson">' + (ch.summary || '<div class="card">Summary coming soon.</div>') + '<div class="row no-print" style="margin-top:16px"><button class="btn" onclick="window.print()">🖨️ Print / save as PDF</button></div></article>';
      }
      return '<div class="page wide">' +
        '<div class="hero"><canvas class="hero-canvas" data-hero></canvas><div class="hero-content"><div class="chapter-hero"><div class="chapter-num">' + ch.num + '</div><div style="flex:1;min-width:0">' +
        '<div class="kicker">Chapter ' + ch.num + (ch.pages ? " · notes pp. " + ch.pages : "") + "</div><h1 style=\"margin:.15em 0 .25em\">" + ch.title + "</h1>" +
        '<p class="lead" style="margin:.2em 0 .8em">' + (ch.blurb || "") + "</p>" +
        '<div class="row">' + (ch.test ? '<span class="chip pink">🎯 On your coursework test</span>' : "") + '<span class="chip">' + ch.sections.length + " sections</span>" + '<span class="chip cyan">' + prog.done + "/" + prog.total + " complete</span>" + (ch.labs ? ch.labs.map((l) => '<a class="chip violet" href="' + l[1] + '">🔬 ' + l[0] + "</a>").join("") : "") + "</div>" +
        '<div class="bar" style="margin-top:14px;max-width:520px"><i style="width:' + prog.pct + '%"></i></div>' +
        "</div></div></div></div>" +
        '<div class="tabs" role="tablist">' + tabs.map((t) => '<a class="tab ' + (t[0] === tab ? "active" : "") + '" href="#/ch/' + ch.num + (t[0] === "lesson" ? "" : "?tab=" + t[0]) + '" role="tab">' + t[1] + "</a>").join("") + "</div>" +
        (ch.goals && tab === "lesson" ? '<div class="card" style="margin-bottom:18px"><div class="kicker">What you will master</div><ul style="margin:.5em 0 0">' + ch.goals.map((g) => "<li>" + g + "</li>").join("") + "</ul></div>" : "") +
        body + "</div>";
    },
    after(view, params, q) {
      const ch = findCh(params.n); if (!ch) return;
      $$("[data-done]", view).forEach((b) => b.addEventListener("click", () => {
        const on = LA.toggleDone(b.dataset.done);
        b.classList.toggle("is-done", on);
        b.textContent = on ? "✓ Section completed" : "Mark section " + b.dataset.done.split("/")[1] + " complete (+15 XP)";
        const a = $$(".toc a", view).find((x) => x.href.includes("sec-" + slug(b.dataset.done.split("/")[1]))); if (a) a.classList.toggle("done", on);
        if (on && LA.chapterProgress(ch.id).pct === 100) { LA.confetti({ particleCount: 220, spread: 120 }); LA.toast("🏁 Chapter " + ch.num + " complete!", "Now try the chapter quiz and exercises."); }
      }));
      const art = $("article.lesson[data-depth]", view);
      if (art) {
        const info = $("#depthInfo", view);
        const apply = (k) => {
          art.dataset.depth = k; LA.store.set("depth", k);
          $$("[data-depth]", view).forEach((b) => { if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.dataset.depth === k)); });
          const allow = { f: "f", s: "fs", a: "fsa" }[k] || "fsa";
          const boxes = $$(".box", art), shown = boxes.filter((b) => allow.includes(b.dataset.level || "f")).length;
          if (info) info.textContent = LA.DEPTH[k].desc + " · Showing " + shown + " of " + boxes.length + " boxes.";
        };
        $$("button[data-depth]", view).forEach((b) => b.addEventListener("click", () => apply(b.dataset.depth)));
        apply(art.dataset.depth);
      }
      if ((q.tab || "lesson") === "quiz" && LA.mountQuiz) LA.mountQuiz($("#chQuiz", view), ch.quiz || ch.id);
      const cv = $("canvas[data-hero]", view); if (cv && LA.heroCanvas) LA.heroCanvas(cv, ch.num);
    },
  });

  // Animated hero canvas: a slowly morphing grid under a linear map (pure decoration)
  LA.heroCanvas = function (cv, seed) {
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = 420, H = 320; cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t0 = performance.now(); let raf;
    const draw = (now) => {
      if (!cv.isConnected) { cancelAnimationFrame(raf); return; }
      const t = reduce ? 1.2 : (now - t0) / 2600 + (seed || 0);
      ctx.clearRect(0, 0, W, H);
      const a = 1 + 0.35 * Math.sin(t), b = 0.45 * Math.sin(t * 0.7), c = 0.35 * Math.cos(t * 0.9), d = 1 + 0.3 * Math.cos(t * 1.1);
      const cx = W * 0.55, cy = H * 0.5, s = 26;
      const P = (x, y) => [cx + s * (a * x + b * y), cy - s * (c * x + d * y)];
      ctx.lineWidth = 1;
      for (let i = -8; i <= 8; i++) {
        const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "rgba(34,211,238,.55)"); g.addColorStop(1, "rgba(244,114,182,.55)");
        ctx.strokeStyle = i === 0 ? "rgba(167,139,250,.95)" : g; ctx.globalAlpha = i === 0 ? 1 : 0.35;
        ctx.beginPath(); let p = P(i, -8); ctx.moveTo(p[0], p[1]); p = P(i, 8); ctx.lineTo(p[0], p[1]); ctx.stroke();
        ctx.beginPath(); p = P(-8, i); ctx.moveTo(p[0], p[1]); p = P(8, i); ctx.lineTo(p[0], p[1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const arrow = (x, y, col) => { const o = P(0, 0), e = P(x, y); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); const ang = Math.atan2(e[1] - o[1], e[0] - o[0]); ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] - 10 * Math.cos(ang - 0.4), e[1] - 10 * Math.sin(ang - 0.4)); ctx.lineTo(e[0] - 10 * Math.cos(ang + 0.4), e[1] - 10 * Math.sin(ang + 0.4)); ctx.fill(); };
      arrow(2, 0, "#22d3ee"); arrow(0, 2, "#f472b6");
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
  };
})();
