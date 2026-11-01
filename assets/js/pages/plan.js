/* Coursework Battle Plan (Chapters 3 & 4) */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;

  const DAYS = [
    { t: "Linear maps: prove it or break it", tasks: [
      ["Read §3.1 (definition, T(0) = 0, basis determines T)", "#/ch/3?go=sec-3-1"],
      ["Learn the 'prove linear' and 'disprove linear' templates", "#/proofs"],
      ["Exercise 3.1 Q1–Q2 on paper, then check solutions", "#/ch/3?tab=exercises"],
      ["Practice Arena: 5 × 'Linear or not?' + 3 × 'Find T from a basis'", "#/practice"],
    ] },
    { t: "Kernel, range, Rank–Nullity", tasks: [
      ["Read §3.2 and the kernel/range recipe", "#/ch/3?go=sec-3-2"],
      ["Learn proofs: ker & range are subspaces; ker T = {0} ⇔ injective", "#/proofs"],
      ["Exercise 3.2 Q1–Q2", "#/ch/3?tab=exercises"],
      ["Practice Arena: 5 × kernel & range problems", "#/practice"],
    ] },
    { t: "Isomorphisms & the matrix of T", tasks: [
      ["Read §3.3 (singular, isomorphism, T⁻¹ linear) and §3.4", "#/ch/3?go=sec-3-3"],
      ["Exercise 3.3 and 3.4 (all questions)", "#/ch/3?tab=exercises"],
      ["Matrix-of-T lab: rebuild Examples 3.4.2 and 3.4.4", "#/labs/matrix"],
      ["Practice Arena: 4 × matrix of T", "#/practice"],
      ["Chapter 3 quiz (aim ≥ 80%)", "#/ch/3?tab=quiz"],
    ] },
    { t: "Inner products and norms", tasks: [
      ["Read §4.1; memorise the 4 axioms by name", "#/ch/4?go=sec-4-1"],
      ["Learn the inner-product proof template + the coincidence traps", "#/proofs"],
      ["Exercise 4 Q1 + extra E1, E2, E9", "#/ch/4?tab=exercises"],
      ["Inner Product Lab: compute norms/angles of polynomials", "#/labs/inner"],
    ] },
    { t: "Orthogonality, complements, inequalities", tasks: [
      ["Read §4.2; learn proofs of Prop 4.2.5, Pythagoras, Cauchy–Schwarz", "#/ch/4?go=sec-4-2"],
      ["Proof puzzles for Chapter 4", "#/proofs"],
      ["Exercise 4 Q2 + extra E3, E5–E8", "#/ch/4?tab=exercises"],
      ["Practice Arena: 4 × S⊥, 3 × norms/angles", "#/practice"],
    ] },
    { t: "Gram–Schmidt mastery", tasks: [
      ["Read §4.2.14 incl. the fraction-friendly version", "#/ch/4?go=sec-4-2-14"],
      ["Watch it in 3D", "#/labs/gs3d"],
      ["Exercise 4 Q3–Q4 (check each step with the GS Machine)", "#/labs/gram-schmidt"],
      ["Practice Arena: 5 × Gram–Schmidt (ℝⁿ and polynomials)", "#/practice"],
      ["Chapter 4 quiz (aim ≥ 80%)", "#/ch/4?tab=quiz"],
    ] },
    { t: "Simulation & polish", tasks: [
      ["Mock Test A under timed conditions", "#/mock"],
      ["Mark it honestly; redo every lost mark", "#/mock"],
      ["Flashcards: Chapters 3 & 4 until all are in box 3+", "#/flashcards"],
      ["Read the formula sheet and the corrections page", "#/formulas"],
      ["Mock Test B (or C if feeling strong) · early night", "#/mock"],
    ] },
  ];

  // [chapter, label, chapterNum, exact box title (data-t)] — links are computed with LA.slug so they always match
  const TOPICS_RAW = [
    ["ch3", "Prove a map is linear (one-line test)", 3, "3.1.3 · The one-line linearity test"],
    ["ch3", "Disprove linearity with a counterexample / T(0) ≠ 0", 3, "How to DISPROVE linearity (full-marks format)"],
    ["ch3", "Find T from its values on a basis", 3, "Find T from its values on a basis"],
    ["ch3", "Kernel & range: bases and dimensions", 3, "Kernel, range, bases, dimensions — the full routine"],
    ["ch3", "Rank–Nullity Theorem (state + apply)", 3, "3.2.9 · The Rank–Nullity Theorem ★"],
    ["ch3", "Prove ker T / Ran T are subspaces", 3, "3.2.4 · Kernel and range are subspaces"],
    ["ch3", "Prove ker T = {0} ⇔ injective", 3, "3.2.6 · The kernel test for injectivity"],
    ["ch3", "Singular / non-singular, Theorem 3.3.6", 3, "3.3.6 · Non-singular ⇔ injective ⇔ preserves independence"],
    ["ch3", "Isomorphisms; inverse map is linear; find T⁻¹", 3, "3.3.4 · The inverse of a bijective linear map is linear"],
    ["ch3", "dim ℒ(V, W) and isomorphic spaces", 3, "3.3.2 · ℒ(V,W) is itself a vector space"],
    ["ch3", "Matrix [T]_B^C relative to bases", 3, "Build [T]_B^C in four moves"],
    ["ch3", "Use [T(v)]_C = A[v]_B", 3, "3.4.3 · The matrix does the work: [T(v)]_C = [T]_B^C [v]_B ★"],
    ["ch3", "Similar matrices; diagonalizing basis", 3, "3.4.7 · Similar matrices"],
    ["ch4", "Prove (or disprove) an inner product", 4, "How to PROVE ⟨·,·⟩ is an inner product (4 labelled checks)"],
    ["ch4", "Norms, unit vectors, distance, angle", 4, "4.1.4 · Norm, unit vector, normalisation, distance"],
    ["ch4", "Find S⊥", 4, "Finding S⊥"],
    ["ch4", "Prove properties of S⊥ (Prop 4.2.5)", 4, "4.2.5 · Properties of orthogonal complements ★"],
    ["ch4", "Pythagoras, Cauchy–Schwarz, Triangle inequality", 4, "4.2.7 · Cauchy–Schwarz Inequality ★"],
    ["ch4", "Orthonormal sets; orthogonal ⇒ independent", 4, "4.2.11 · Orthogonal sets are independent"],
    ["ch4", "Gram–Schmidt in ℝⁿ", 4, "4.2.15(i) · Gram–Schmidt in ℝ³ (two vectors)"],
    ["ch4", "Gram–Schmidt with polynomial / matrix inner products", 4, "4.2.15(iii) · Polynomials with a fancy inner product (ℙ₃)"],
  ];
  const TOPICS = TOPICS_RAW.map((t) => [t[0], t[1], "#/ch/" + t[2] + "?go=b-" + LA.slug(t[3])]);

  function dayDates() {
    const d = LA.store.get("cwDate", null); if (!d) return null;
    const test = new Date(d); test.setHours(0, 0, 0, 0);
    return DAYS.map((_, i) => new Date(test.getTime() - (DAYS.length - i) * 864e5));
  }

  LA.page("/plan", {
    title: "Battle Plan", searchTitle: "Coursework Battle Plan (Ch 3 & 4)", searchDesc: "7-day study plan, topic confidence checklist, exam strategy",
    render() {
      const checks = LA.store.get("planChecks", {});
      const conf = LA.store.get("conf", {});
      const dates = dayDates();
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const total = DAYS.reduce((s, d) => s + d.tasks.length, 0);
      const done = Object.keys(checks).filter((k) => checks[k]).length;
      const weak = TOPICS.filter((t) => (conf[t[1]] || 0) === 1);
      return '<div class="page">' +
        '<div class="hero"><div class="hero-content"><div class="kicker">Coursework · Chapters 3 &amp; 4</div><h1>The 7-Day Battle Plan</h1><p class="lead">Seven focused sessions (60–90 min each) that cover every testable skill, in the order that builds understanding fastest. Tick tasks as you go — progress is saved.</p>' +
        '<div class="row"><span class="chip cyan">' + done + "/" + total + ' tasks done</span>' + (dates ? '<span class="chip pink">Test: ' + new Date(LA.store.get("cwDate")).toDateString() + "</span>" : '<a class="chip amber" href="#/">⏳ Set your test date on the dashboard</a>') + '</div><div class="bar" style="margin-top:12px"><i style="width:' + Math.round((100 * done) / total) + '%"></i></div></div></div>' +
        LA.sectionTitle("Day by day") +
        DAYS.map((d, i) => {
          const dt = dates ? dates[i] : null; const isToday = dt && dt.getTime() === today.getTime();
          return '<div class="card' + (isToday ? " glow" : "") + '" style="margin-bottom:14px"><div class="row spread"><h3 style="margin:0">Day ' + (i + 1) + " · " + d.t + "</h3>" + (dt ? '<span class="chip ' + (isToday ? "pink" : "") + '">' + (isToday ? "TODAY · " : "") + dt.toDateString().slice(0, 10) + "</span>" : "") + "</div>" +
            d.tasks.map((t, j) => { const k = i + ":" + j; return '<label class="check-item' + (checks[k] ? " done" : "") + '"><input type="checkbox" data-k="' + k + '"' + (checks[k] ? " checked" : "") + '><span class="ci-text">' + t[0] + ' · <a href="' + t[1] + '">open ▸</a></span></label>'; }).join("") + "</div>";
        }).join("") +
        LA.sectionTitle("Topic confidence check") +
        '<p class="muted">Rate each skill honestly: <b class="err">1</b> = shaky, <b style="color:var(--amber)">2</b> = okay, <b class="okc">3</b> = could teach it. Re-rate after each study day.</p>' +
        (weak.length ? '<div class="box trap" data-t="Your weakest topics right now">' + weak.map((t) => '<a class="chip red" style="margin:3px" href="' + t[2] + '">' + t[1] + "</a>").join("") + "</div>" : "") +
        TOPICS.map((t) => { const c = conf[t[1]] || 0; return '<div class="check-item" style="cursor:default"><span class="chip ' + (t[0] === "ch3" ? "violet" : "cyan") + '">' + (t[0] === "ch3" ? "Ch 3" : "Ch 4") + '</span><span class="ci-text"><a href="' + t[2] + '">' + t[1] + '</a></span><span class="conf" data-topic="' + LA.esc(t[1]) + '">' + [1, 2, 3].map((n) => '<button class="c' + n + (c === n ? " on" : "") + '" data-n="' + n + '">' + n + "</button>").join("") + "</span></div>"; }).join("") +
        LA.sectionTitle("In the exam room") +
        '<div class="grid grid-2"><div class="box tip" data-t="Strategy that earns marks"><ol>' +
        "<li><b>Read the whole paper first</b> (2 min). Mark the questions you can do fast.</li>" +
        "<li><b>Budget time by marks</b>: roughly (minutes available ÷ total marks) per mark.</li>" +
        "<li><b>Definitions word-for-word</b> — they are free marks. Quote theorem names when you use them (\"by Rank–Nullity…\").</li>" +
        "<li><b>Show the method</b>: write row operations, the formula you use, and the substitution. Method marks survive arithmetic slips.</li>" +
        "<li><b>Check with built-in tests</b>: T(0) = 0; Rank + Nullity = dim V; ⟨u_k, u_j⟩ = 0; ‖w‖ = 1; plug basis vectors back in.</li>" +
        "<li><b>Stuck on a proof?</b> Write the definition of what you must prove, then the definition of what you're given. The gap is usually one line.</li></ol></div>" +
        '<div class="box exam" data-t="Night-before checklist"><ul>' +
        '<li>☐ Can state: linear map, kernel, range, rank, nullity, isomorphism, inner product (4 axioms), norm, orthogonal complement, orthonormal set.</li>' +
        "<li>☐ Can state Rank–Nullity, Cauchy–Schwarz, Triangle inequality, Pythagoras, Gram–Schmidt formula.</li>" +
        "<li>☐ Can prove: ker/range are subspaces, ker = {0} ⇔ injective, S⊥ is a subspace, orthogonal ⇒ independent, Pythagoras.</li>" +
        "<li>☐ Can compute: [T]_B^C, kernel/range bases, S⊥, Gram–Schmidt (3 vectors), polynomial inner products.</li>" +
        '<li>☐ Pens, calculator (if allowed), ID, water. Sleep ≥ 7 hours.</li></ul></div></div>' +
        "</div>";
    },
    after(view) {
      $$("input[data-k]", view).forEach((cb) => cb.addEventListener("change", () => {
        const checks = LA.store.get("planChecks", {}); checks[cb.dataset.k] = cb.checked; LA.store.set("planChecks", checks);
        cb.closest(".check-item").classList.toggle("done", cb.checked);
        if (cb.checked) LA.addXP(5, "Plan task done");
      }));
      $$(".conf", view).forEach((g) => $$("button", g).forEach((b) => b.addEventListener("click", () => {
        const conf = LA.store.get("conf", {}); conf[g.dataset.topic] = Number(b.dataset.n); LA.store.set("conf", conf);
        $$("button", g).forEach((x) => x.classList.toggle("on", x === b));
      })));
    },
  });
})();
