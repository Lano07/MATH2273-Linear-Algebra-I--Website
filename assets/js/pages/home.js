/* Dashboard */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;

  const TIPS = [
    "Before proving a map is linear, compute T(0). If T(0) ≠ 0 you are done — it is not linear.",
    "Rank–Nullity uses the dimension of the DOMAIN: Rank(T) + Nullity(T) = dim V.",
    "Range = span of the images of a basis. That is the fastest way to find Ran(T).",
    "Gram–Schmidt: keep everything rational until the last line, and scale u_k to integers before normalising.",
    "Columns of [T]_B^C are the C-coordinates of T(v₁), …, T(vₙ) — columns, not rows!",
    "S⊥ is ALWAYS a subspace, even when S is not.",
    "To prove an isomorphism between spaces of equal finite dimension, just prove ker T = {0}.",
    "Orthogonal + non-zero ⇒ linearly independent (Theorem 4.2.11).",
    "Coincidence (⟨u,u⟩ = 0 ⇒ u = 0) is the axiom that most often fails — test constants and special polynomials.",
    "dim ℒ(V, W) = dim V · dim W, and dim ℙₙ = n + 1.",
    "Cauchy–Schwarz proof: expand ‖u − tv‖² ≥ 0 and choose t = ⟨u,v⟩/‖v‖².",
    "Check Gram–Schmidt after every step: ⟨u_k, u_j⟩ must be 0.",
    "If dim V > dim W, no linear map V → W is injective. If dim V < dim W, none is surjective.",
    "Eigenvalues of a triangular matrix are its diagonal entries.",
    "det(cA) = cⁿ det(A) — not c·det(A).",
  ];

  function countdownHTML() {
    const d = LA.store.get("cwDate", null);
    if (!d) {
      return '<div class="kicker">Coursework countdown</div><h3 style="margin:.3em 0">When is your Chapters 3 & 4 coursework?</h3><p class="muted small">Set the date to unlock a live countdown and a day-by-day battle plan.</p><div class="field-row"><label class="field">Date<input type="date" id="cwDateIn"></label><label class="field">Time<input type="text" id="cwTimeIn" value="09:00" size="6" class="mono-in"></label><button class="btn btn-primary" id="cwSet">Set countdown</button></div>';
    }
    return '<div class="row spread"><div class="kicker">Coursework countdown · Chapters 3 & 4</div><button class="btn btn-sm btn-ghost" id="cwReset">Change date</button></div><div class="countdown" id="cdown" style="margin-top:10px"></div><p class="small muted" id="cdMsg" style="margin-bottom:0"></p>';
  }
  function tickCountdown() {
    const el = $("#cdown"); if (!el) return;
    const d = LA.store.get("cwDate", null); if (!d) return;
    const target = new Date(d).getTime();
    const ms = target - Date.now();
    const msg = $("#cdMsg");
    if (ms <= 0) { el.innerHTML = '<div class="unit"><b>🎯</b><span>Test day</span></div>'; if (msg) msg.textContent = "It's time. Read every question first, start with what you know, and write definitions word-for-word. You've got this."; return; }
    const D = Math.floor(ms / 864e5), Hh = Math.floor((ms % 864e5) / 36e5), Mm = Math.floor((ms % 36e5) / 6e4), S = Math.floor((ms % 6e4) / 1e3);
    el.innerHTML = [[D, "days"], [Hh, "hours"], [Mm, "min"], [S, "sec"]].map((u) => '<div class="unit"><b>' + String(u[0]).padStart(2, "0") + "</b><span>" + u[1] + "</span></div>").join("");
    if (msg) msg.innerHTML = D >= 6 ? "Plenty of time — follow the <a href=\"#/plan\">7-day battle plan</a> and you will walk in ready." : D >= 2 ? "Final stretch: drill the <a href=\"#/practice\">Practice Arena</a> and take a <a href=\"#/mock\">mock test</a>." : "Last day(s): review the <a href=\"#/formulas\">formula sheet</a>, redo weak recipes, sleep well.";
  }

  function nextSection() {
    const order = ["ch3", "ch4", "ch1", "ch2", "ch5", "ch6", "ch7"];
    for (const id of order) { const ch = LA.chapters[id]; if (!ch) continue; const s = ch.sections.find((x) => !LA.state.done[id + "/" + x.id]); if (s) return { ch, s }; }
    return null;
  }

  LA.page("/", {
    title: "Dashboard", searchTitle: "Dashboard", searchDesc: "Home, countdown, progress",
    render() {
      const lvl = LA.level();
      const doneCount = Object.keys(LA.state.done).length;
      const totalSecs = Object.values(LA.chapters).reduce((s, c) => s + c.sections.length, 0);
      const nx = nextSection();
      const chs = Object.values(LA.chapters).sort((a, b) => a.num - b.num);
      const tip = LA.pick(TIPS);
      return '<div class="page wide">' +
        '<div class="hero"><canvas class="hero-canvas" data-hero></canvas><div class="hero-content">' +
        '<div class="kicker">MATH2273 · Linear Algebra I · The University of the West Indies</div>' +
        '<h1>Master Linear Algebra I.<br><span class="grad-text">Every chapter. Every proof. Every trick.</span></h1>' +
        '<p class="lead">Lessons built line-by-line from your lecture notes, model solutions to every exercise, proof templates, step-by-step solvers, infinite practice, quizzes and timed mock tests — with Chapters 3 &amp; 4 covered in maximum depth for your coursework.</p>' +
        '<div class="row" style="margin-top:16px"><a class="btn btn-primary btn-lg" href="' + (nx ? "#/ch/" + nx.ch.num + "?go=sec-" + LA.slug(nx.s.id) : "#/mock") + '">' + (nx ? "▶ Continue: " + nx.s.id + " " + nx.s.title : "▶ Take a mock test") + '</a><a class="btn btn-lg" href="#/plan">🎯 Battle plan</a><a class="btn btn-lg" href="#/practice">♾️ Practice Arena</a></div>' +
        "</div></div>" +

        '<div class="grid grid-2" style="margin-top:18px"><div class="card glow">' + countdownHTML() + '</div>' +
        '<div class="card"><div class="kicker">Your stats</div><div class="grid grid-4" style="margin-top:10px">' +
        '<div class="stat"><b>' + lvl.lvl + '</b><span>Level · ' + lvl.name + "</span></div>" +
        '<div class="stat"><b>' + LA.state.xp + "</b><span>XP</span></div>" +
        '<div class="stat"><b>' + doneCount + "/" + totalSecs + "</b><span>Sections</span></div>" +
        '<div class="stat"><b>' + (LA.state.stats.practice || 0) + "</b><span>Problems solved</span></div></div>" +
        '<div class="bar" style="margin-top:14px"><i style="width:' + Math.round((100 * lvl.into) / lvl.need) + '%"></i></div><p class="small muted" style="margin-bottom:0">' + (lvl.need - lvl.into) + " XP to level " + (lvl.lvl + 1) + ' · <a href="#/progress">badges &amp; progress</a></p></div></div>' +

        '<div class="card" style="margin-top:16px;display:flex;gap:14px;align-items:center"><div class="feature-ico" style="margin:0;flex:none">💡</div><div><div class="kicker">Tip of the visit</div><div id="tipText">' + tip + '</div></div><button class="btn btn-sm btn-ghost" id="newTip" style="margin-left:auto">Another ↻</button></div>' +

        LA.sectionTitle("Chapters") +
        '<div class="grid grid-3">' + chs.map((c) => { const p = LA.chapterProgress(c.id); return '<a class="card hover" href="#/ch/' + c.num + '" style="position:relative">' + (c.test ? '<span class="chip pink tag-test">🎯 TEST</span>' : "") + '<div class="ch-card">' + LA.ring(p.pct) + '<div><div class="kicker">Chapter ' + c.num + "</div><h3>" + c.title + "</h3><p>" + p.done + "/" + p.total + " sections · notes pp. " + (c.pages || "") + "</p></div></div></a>"; }).join("") + "</div>" +

        LA.sectionTitle("Coursework weapons (Chapters 3 & 4)") +
        '<div class="grid grid-3">' + [
          ["🧪", "Question Recipes", "Step-by-step algorithms for every Ch 3 & 4 question type.", "#/recipes"],
          ["✍️", "Proof Studio", "Proof templates + interactive proof puzzles for the theorems most likely to be tested.", "#/proofs"],
          ["♾️", "Practice Arena", "Infinite randomly-generated problems with complete worked solutions.", "#/practice"],
          ["⚡", "Quizzes", "Concept checks with instant explanations — find your blind spots fast.", "#/quiz"],
          ["⏱️", "Mock Tests", "Timed coursework-style papers with marking schemes. Score yourself.", "#/mock"],
          ["🃏", "Flashcards", "Every definition and theorem, with spaced repetition.", "#/flashcards"],
        ].map((f) => '<a class="card hover" href="' + f[3] + '"><div class="feature-ico">' + f[0] + "</div><h3 style=\"margin:.2em 0\">" + f[1] + '</h3><p class="muted small" style="margin:0">' + f[2] + "</p></a>").join("") + "</div>" +

        LA.sectionTitle("Interactive labs") +
        '<div class="grid grid-4">' + [
          ["🌀", "2D Transformation Visualizer", "#/labs/transform"], ["🔍", "Linearity Checker", "#/labs/linearity"], ["🕳️", "Kernel · Range · Rank–Nullity", "#/labs/kernel"], ["🧮", "Matrix of T w.r.t. Bases", "#/labs/matrix"],
          ["🪄", "Gram–Schmidt Machine", "#/labs/gram-schmidt"], ["🧊", "3D Orthogonality", "#/labs/gs3d"], ["〈〉", "Inner Product Lab", "#/labs/inner"], ["🪜", "Row Reduction Stepper", "#/labs/rref"],
        ].map((f) => '<a class="card hover" href="' + f[2] + '" style="padding:16px"><div class="feature-ico">' + f[0] + '</div><b>' + f[1] + "</b></a>").join("") + "</div>" +

        LA.sectionTitle("Reference") +
        '<div class="grid grid-4">' + [["📜", "Formula & Theorem Sheet", "#/formulas"], ["🔤", "Glossary & Notation", "#/glossary"], ["🗂️", "Past Papers", "#/pastpapers"], ["🩹", "Notes Corrections", "#/errata"]].map((f) => '<a class="card hover" href="' + f[2] + '" style="padding:16px"><div class="feature-ico">' + f[0] + '</div><b>' + f[1] + "</b></a>").join("") + "</div>" +
        '<div class="footer">Built from <i>MATH 2273 Chapters 1–7</i> (V. Job) and the Gram–Schmidt handout. All worked answers were cross-checked with a computer algebra system. Progress is saved in this browser only. · <a href="#/about">About</a></div>' +
        "</div>";
    },
    after(view) {
      const cv = $("canvas[data-hero]", view); if (cv) LA.heroCanvas(cv, 0.3);
      const set = $("#cwSet", view);
      if (set) set.onclick = () => {
        const d = $("#cwDateIn", view).value; const t = ($("#cwTimeIn", view).value || "09:00").trim();
        if (!d) { LA.toast("Pick a date first", ""); return; }
        LA.store.set("cwDate", d + "T" + (/^\d{1,2}:\d{2}$/.test(t) ? t.padStart(5, "0") : "09:00") + ":00");
        LA.toast("⏳ Countdown set", "Your battle plan is now date-aware."); LA.route();
      };
      const rs = $("#cwReset", view); if (rs) rs.onclick = () => { LA.store.del("cwDate"); LA.route(); };
      tickCountdown(); clearInterval(LA._cdTimer); LA._cdTimer = setInterval(() => { if (!$("#cdown")) { clearInterval(LA._cdTimer); return; } tickCountdown(); }, 1000);
      const nt = $("#newTip", view); if (nt) nt.onclick = () => { $("#tipText", view).textContent = LA.pick(TIPS); };
    },
  });
  LA.TIPS = TIPS;
})();
