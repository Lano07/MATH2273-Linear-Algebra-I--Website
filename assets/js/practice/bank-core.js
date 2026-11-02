/* Question-generator bank: registry, helpers, and Chapters 1–2 generators.
   Every generator is deterministic in (id, difficulty, seed) and returns
   { q, ans | parts, model, hints[4], sol, opts? } where `model` is an input string that must pass `ans`
   (this invariant is unit-tested for every generator, difficulty and many seeds). */
(function () {
  "use strict";
  const LA = window.LA;
  const { Frac, Poly } = LA;
  const DIFFS = ["beginner", "standard", "advanced", "challenge"];
  LA.DIFFS = DIFFS;
  LA.DIFF_LABEL = { beginner: "Beginner", standard: "Standard", advanced: "Advanced", challenge: "Challenge" };
  LA.BANK = LA.BANK || {};
  LA.bank = {
    def(d) { LA.BANK[d.id] = d; },
    list() { return Object.values(LA.BANK); },
    forTopic(t) { return Object.values(LA.BANK).filter((d) => d.topic === t); },
    make(id, seed, diff) {
      const d = LA.BANK[id]; if (!d) throw new Error("Unknown generator " + id);
      diff = DIFFS.includes(diff) ? diff : "standard";
      seed = Number(seed) >>> 0;
      const r = LA.RNG(LA.hashStr(id + "|" + diff + "|" + seed));
      const p = d.gen(r, diff);
      return Object.assign({ id, seed, diff, topic: d.topic, title: d.title }, p);
    },
  };

  /* ---------------- helpers shared by all generator files ---------------- */
  const fr = (x) => Frac.of(x);
  const T = (x) => (x instanceof Frac ? x.tex() : typeof x === "number" || typeof x === "bigint" ? String(x) : x && x.tex ? x.tex() : String(x));
  const S = (x) => (x instanceof Frac ? x.toString() : String(x)); // plain-text scalar for model answers
  const H = {
    fr, T, S,
    FR: (A) => A.map((r) => r.map(fr)),
    mt: (A, env) => "\\begin{" + (env || "pmatrix") + "}" + A.map((r) => r.map(T).join(" & ")).join(" \\\\ ") + "\\end{" + (env || "pmatrix") + "}",
    vt: (v) => "(" + v.map(T).join(", ") + ")",
    ct: (v) => "\\begin{pmatrix}" + v.map(T).join(" \\\\ ") + "\\end{pmatrix}",
    vs: (v) => "(" + v.map(S).join(", ") + ")",
    ms: (A) => A.map((r) => r.map(S).join(" ")).join("; "),
    ls: (L) => (L.length ? L.map((v) => "(" + v.map(S).join(", ") + ")").join(", ") : "0"),
    setS: (L) => (L.length ? "{" + L.join(", ") + "}" : "∅"),
    setT: (L) => (L.length ? "\\{" + L.join(", ") + "\\}" : "\\emptyset"),
    pt: (c, v) => new Poly(c).tex({ v: v || "x", desc: true }),
    ps: (c, v) => { // plain-text polynomial, descending
      const p = c instanceof Poly ? c : new Poly(c); v = v || "x";
      if (p.isZero()) return "0";
      const out = [];
      for (let i = p.deg(); i >= 0; i--) {
        const a = p.coef(i); if (a.isZero()) continue;
        const neg = a.sign() < 0, aa = a.abs();
        const mon = i === 0 ? "" : i === 1 ? v : v + "^" + i;
        const coef = i === 0 ? aa.toString() : aa.isOne() ? "" : aa.isInt() ? aa.toString() : "(" + aa.toString() + ")*";
        out.push((out.length ? (neg ? " - " : " + ") : neg ? "-" : "") + coef + mon);
      }
      return out.join("");
    },
    aff: (a, b, v) => { // tex of a·v + b (handles 0, ±1)
      a = fr(a); b = fr(b); v = v || "x";
      let s = a.isZero() ? "" : (a.sign() < 0 ? "-" : "") + (a.abs().isOne() ? "" : a.abs().tex()) + v;
      if (!b.isZero()) s += (s ? (b.sign() < 0 ? " - " : " + ") : b.sign() < 0 ? "-" : "") + b.abs().tex();
      return s || "0";
    },
    lin: (coeffs, vars) => { // linear form tex: 2x - y + 3z
      let s = ""; coeffs.forEach((c, i) => { c = fr(c); if (c.isZero()) return; const neg = c.sign() < 0, a = c.abs(); s += (s ? (neg ? " - " : " + ") : neg ? "-" : "") + (a.isOne() ? "" : a.tex()) + vars[i]; });
      return s || "0";
    },
    det: (A) => LA.alg.det(H.FR(A)),
    rank: (A) => LA.alg.rank(H.FR(A)),
    mul: (A, B) => LA.M.mul(H.FR(A), H.FR(B)),
    inv: (A) => LA.alg.inverse(H.FR(A)),
    rref: (A) => LA.alg.rowReduce(H.FR(A), { mode: "rref" }),
    steps: (A, red, aug) => '<div class="log">' + LA.stepsHTML(red.steps, H.FR(A), { aug }) + "</div>",
    null: (A) => LA.alg.nullspace(H.FR(A)).basis.map((v) => LA.V.integerize(v, true).vec),
    // integer matrix with det = ±1 built from elementary operations (nice inverses / nice coordinates)
    unimod(r, n, steps, range) {
      let A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
      for (let k = 0; k < (steps || n * 2); k++) {
        const i = r.int(0, n - 1); let j = r.int(0, n - 2); if (j >= i) j++;
        const c = r.nz(-(range || 2), range || 2);
        A = A.map((row, a) => (a === i ? row.map((x, b) => x + c * A[j][b]) : row));
      }
      return r.shuffle(A);
    },
    // integer m×n matrix of a given rank (product of random integer factors), entries kept small
    rankMat(r, m, n, k, lim) {
      for (let tries = 0; tries < 200; tries++) {
        const L = r.intMat(m, k, -2, 2), R = r.intMat(k, n, -2, 2);
        const A = L.map((row) => R[0].map((_, j) => row.reduce((s, x, t) => s + x * R[t][j], 0)));
        if (A.flat().every((x) => Math.abs(x) <= (lim || 6)) && H.rank(A) === k && A.every((row) => row.some((x) => x !== 0))) return A;
      }
      return Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => (i === j && i < k ? 1 : 0)));
    },
    nonsingular(r, n, a, b) { for (let t = 0; t < 200; t++) { const A = r.intMat(n, n, a, b); if (!H.det(A).isZero()) return A; } return H.unimod(r, n); },
    mcq(r, correct, wrongs, n) { // returns { opts, answer }
      const opts = r.shuffle([correct].concat(r.sample(wrongs, Math.min(wrongs.length, (n || 4) - 1))));
      return { opts, answer: opts.indexOf(correct) };
    },
    hint: (...h) => h,
  };
  LA.bankH = H;
  const def = LA.bank.def;
  const { vt, ct, mt, vs, ms, setS, setT } = H;

  /* ======================= Chapter 1 ======================= */
  def({ id: "set-ops", topic: "sets", title: "Set operations", gen(r, diff) {
    const N = diff === "beginner" ? 8 : 10, U = Array.from({ length: N }, (_, i) => i + 1);
    const rnd = () => U.filter(() => r.bool(0.45));
    const A = rnd(), B = rnd(), C = rnd();
    const has = (X, x) => X.includes(x);
    const ops = {
      beginner: [["A\\cup B", (x) => has(A, x) || has(B, x)], ["A\\cap B", (x) => has(A, x) && has(B, x)]],
      standard: [["A\\setminus B", (x) => has(A, x) && !has(B, x)], ["A^c", (x) => !has(A, x)], ["(A\\cup B)^c", (x) => !(has(A, x) || has(B, x))]],
      advanced: [["A^c\\cap B^c", (x) => !has(A, x) && !has(B, x)], ["(A\\cap B)\\cup C", (x) => (has(A, x) && has(B, x)) || has(C, x)], ["A\\setminus(B\\cup C)", (x) => has(A, x) && !has(B, x) && !has(C, x)]],
      challenge: [["A\\,\\triangle\\,B = (A\\setminus B)\\cup(B\\setminus A)", (x) => has(A, x) !== has(B, x)], ["(A\\cup B)\\setminus(B\\cap C)", (x) => (has(A, x) || has(B, x)) && !(has(B, x) && has(C, x))]],
    }[diff];
    const [name, f] = r.pick(ops);
    const ans = U.filter(f);
    const usesC = /C/.test(name);
    return {
      q: "<p>Universe $U = \\{1,\\dots," + N + "\\}$, $A = " + setT(A) + "$, $B = " + setT(B) + "$" + (usesC ? ", $C = " + setT(C) + "$" : "") + ".</p><p>List the elements of $" + name + "$.</p>",
      ans: { type: "set", answer: ans, multiplicity: false }, model: setS(ans), ph: "e.g. {1, 4, 7} or ∅",
      hints: ["Recall: $x\\in A\\cup B$ iff $x\\in A$ <b>or</b> $x\\in B$; $x\\in A\\cap B$ iff in both; $A\\setminus B$ = in $A$ but not $B$; $A^c = U\\setminus A$.", "Go through $1,2,\\dots," + N + "$ one at a time and test membership.", "Work from the inside of the brackets outwards.", "The answer has " + ans.length + " element" + (ans.length === 1 ? "" : "s") + "."],
      sol: "<p>Checking each element of $U$ against the definition gives $" + name + " = " + setT(ans) + "$.</p>",
    };
  } });

  def({ id: "set-identity", topic: "sets", title: "Set identities", gen(r, diff) {
    const pools = {
      beginner: [["(A\\cup B)^c", "A^c\\cap B^c", ["A^c\\cup B^c", "A\\cap B", "(A\\cap B)^c"], "De Morgan's law."], ["(A\\cap B)^c", "A^c\\cup B^c", ["A^c\\cap B^c", "A\\cup B", "A^c\\cap B"], "De Morgan's law."]],
      standard: [["A\\cap(B\\cup C)", "(A\\cap B)\\cup(A\\cap C)", ["(A\\cap B)\\cup C", "A\\cup(B\\cap C)", "(A\\cup B)\\cap(A\\cup C)"], "Distributive law."], ["A\\cup(B\\cap C)", "(A\\cup B)\\cap(A\\cup C)", ["(A\\cup B)\\cap C", "(A\\cap B)\\cup(A\\cap C)", "A\\cap(B\\cup C)"], "Distributive law."], ["A\\setminus B", "A\\cap B^c", ["A^c\\cap B", "A\\cup B^c", "B\\setminus A"], "Definition of difference."]],
      advanced: [["A\\setminus(B\\cup C)", "(A\\setminus B)\\cap(A\\setminus C)", ["(A\\setminus B)\\cup(A\\setminus C)", "A\\setminus B\\setminus C^c", "(A\\setminus B)\\cup C"], "De Morgan inside a difference."], ["A\\setminus(B\\cap C)", "(A\\setminus B)\\cup(A\\setminus C)", ["(A\\setminus B)\\cap(A\\setminus C)", "A\\cap B\\cap C", "(A\\cup B)\\setminus C"], "De Morgan inside a difference."]],
      challenge: [["A\\times(B\\cap C)", "(A\\times B)\\cap(A\\times C)", ["(A\\times B)\\cup(A\\times C)", "(A\\cap B)\\times C", "A\\times B\\times C"], "Products distribute over intersections."], ["(A\\times B)\\cap(C\\times D)", "(A\\cap C)\\times(B\\cap D)", ["(A\\cap B)\\times(C\\cap D)", "(A\\cup C)\\times(B\\cup D)", "(A\\times C)\\cap(B\\times D)"], "A pair lies in both products iff each coordinate lies in both sets."]],
    }[diff];
    const [lhs, rhs, wrong, why] = r.pick(pools);
    const m = H.mcq(r, "$" + rhs + "$", wrong.map((w) => "$" + w + "$"));
    return {
      q: "<p>Which set is always equal to $" + lhs + "$?</p>", opts: m.opts, ans: { type: "mcq", answer: m.answer }, model: String(m.answer),
      hints: ["Use the element method: take $x$ in the left side and see which conditions it satisfies.", "Translate each operation into logic: $\\cup$ = or, $\\cap$ = and, $^c$ = not.", "Test the options with small examples (a Venn diagram helps).", "The correct identity is a standard law: " + why],
      sol: "<p>$" + lhs + " = " + rhs + "$. " + why + " Prove it by double inclusion: show every element of the left side is in the right side and vice versa.</p>",
    };
  } });

  def({ id: "rel-props", topic: "relations", title: "Properties of a relation", gen(r, diff) {
    const n = diff === "beginner" ? 3 : diff === "challenge" ? 4 : r.pick([3, 4]);
    const X = Array.from({ length: n }, (_, i) => i + 1);
    let R = [];
    X.forEach((a) => X.forEach((b) => { if (a !== b && r.bool(diff === "beginner" ? 0.3 : 0.35)) R.push([a, b]); }));
    if (r.bool(0.6)) X.forEach((a) => R.push([a, a])); else X.forEach((a) => { if (r.bool(0.5)) R.push([a, a]); });
    if (r.bool(0.4)) R.slice().forEach(([a, b]) => { if (!R.some(([c, d]) => c === b && d === a)) R.push([b, a]); });
    if (r.bool(diff === "challenge" ? 0.5 : 0.3)) { // transitive closure sometimes
      let changed = true; while (changed) { changed = false; R.slice().forEach(([a, b]) => R.slice().forEach(([c, d]) => { if (b === c && !R.some(([e, f]) => e === a && f === d)) { R.push([a, d]); changed = true; } })); }
    }
    R = R.filter((p, i) => R.findIndex((q) => q[0] === p[0] && q[1] === p[1]) === i).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const has = (a, b) => R.some(([c, d]) => c === a && d === b);
    const refl = X.every((a) => has(a, a));
    const sym = R.every(([a, b]) => has(b, a));
    let trans = true, tw = null; R.forEach(([a, b]) => R.forEach(([c, d]) => { if (b === c && !has(a, d) && trans) { trans = false; tw = [a, b, d]; } }));
    const label = (x, y, z) => (x ? "R" : "") + (y ? "S" : "") + (z ? "T" : "");
    const names = { RST: "reflexive, symmetric and transitive (an equivalence relation)", RS: "reflexive and symmetric only", RT: "reflexive and transitive only", ST: "symmetric and transitive only", R: "reflexive only", S: "symmetric only", T: "transitive only", "": "none of the three" };
    const correct = names[label(refl, sym, trans)];
    const opts = Object.values(names);
    const why = [];
    why.push(refl ? "Reflexive: every $(a,a)$ is present." : "Not reflexive: $(" + X.find((a) => !has(a, a)) + "," + X.find((a) => !has(a, a)) + ")\\notin R$.");
    const sb = R.find(([a, b]) => !has(b, a));
    why.push(sym ? "Symmetric: each pair's reverse is present." : "Not symmetric: $(" + sb[0] + "," + sb[1] + ")\\in R$ but $(" + sb[1] + "," + sb[0] + ")\\notin R$.");
    why.push(trans ? "Transitive: whenever $(a,b),(b,c)\\in R$, also $(a,c)\\in R$." : "Not transitive: $(" + tw[0] + "," + tw[1] + "),(" + tw[1] + "," + tw[2] + ")\\in R$ but $(" + tw[0] + "," + tw[2] + ")\\notin R$.");
    return {
      q: "<p>On $X = \\{" + X.join(",") + "\\}$ let $R = \\{" + R.map(([a, b]) => "(" + a + "," + b + ")").join(", ") + "\\}$. Which properties does $R$ have?</p>",
      opts, ans: { type: "mcq", answer: opts.indexOf(correct) }, model: String(opts.indexOf(correct)),
      hints: ["Reflexive: $(a,a)\\in R$ for EVERY $a\\in X$. Symmetric: $(a,b)\\in R\\Rightarrow(b,a)\\in R$. Transitive: $(a,b),(b,c)\\in R\\Rightarrow(a,c)\\in R$.", "Check reflexivity first: look for all of $" + X.map((a) => "(" + a + "," + a + ")").join(",") + "$.", "For symmetry, flip each pair. For transitivity, chain pairs $(a,b),(b,c)$ — including pairs like $(a,a)$.", why[0]],
      sol: "<ul><li>" + why.join("</li><li>") + "</li></ul><p>So $R$ is " + correct + ".</p>",
    };
  } });

  def({ id: "eq-classes", topic: "relations", title: "Equivalence classes", gen(r, diff) {
    if (diff === "beginner" || diff === "standard") {
      const m = r.int(2, 5), N = r.int(10, 16), k = r.int(1, N);
      if (diff === "beginner") return {
        q: "<p>On $X = \\{1,2,\\dots," + N + "\\}$ define $xRy\\iff " + m + "\\mid(x-y)$. How many equivalence classes are there?</p>", ans: { type: "num", answer: m }, model: String(m),
        hints: ["$x$ and $y$ are related exactly when they leave the same remainder on division by $" + m + "$.", "Possible remainders: $0,1,\\dots," + (m - 1) + "$.", "Each remainder that actually occurs in $X$ gives one class.", "Since $" + N + "\\ge" + m + "$, every remainder occurs."],
        sol: "<p>Classes correspond to remainders mod $" + m + "$: there are <b>" + m + "</b>.</p>" };
      const cls = Array.from({ length: N }, (_, i) => i + 1).filter((x) => (x - k) % m === 0);
      return { q: "<p>On $X = \\{1,\\dots," + N + "\\}$ define $xRy\\iff " + m + "\\mid(x-y)$. List the equivalence class $[" + k + "]$.</p>", ans: { type: "set", answer: cls, multiplicity: false }, model: setS(cls),
        hints: ["$[" + k + "] = \\{x\\in X: xR" + k + "\\}$.", "$x\\in[" + k + "]$ iff $x-" + k + "$ is a multiple of $" + m + "$.", "Start at $" + k + "$ and add/subtract $" + m + "$ while staying in $X$.", "It contains " + cls.length + " elements."],
        sol: "<p>$[" + k + "] = " + setT(cls) + "$ (all $x\\equiv" + k + "\\pmod{" + m + "}$ in $X$).</p>" };
    }
    if (diff === "advanced") {
      const n = r.int(2, 4);
      return { q: "<p>On $X = \\{1,\\dots," + n + "\\}\\times\\{1,\\dots," + n + "\\}$ define $(a,b)R(c,d)\\iff a+d = b+c$. How many equivalence classes are there?</p>", ans: { type: "num", answer: 2 * n - 1 }, model: String(2 * n - 1),
        hints: ["Rewrite: $a+d = b+c\\iff a-b = c-d$.", "So two pairs are related iff they have the same difference $a-b$.", "Which values can $a-b$ take when $1\\le a,b\\le" + n + "$?", "$a-b\\in\\{-" + (n - 1) + ",\\dots," + (n - 1) + "\\}$."],
        sol: "<p>$(a,b)R(c,d)\\iff a-b = c-d$, so classes ↔ values of $a-b\\in\\{" + (1 - n) + ",\\dots," + (n - 1) + "\\}$: <b>" + (2 * n - 1) + "</b> classes.</p>" };
    }
    const n = r.int(2, 5);
    return { q: "<p>On $X = \\{-" + n + ",\\dots," + n + "\\}$ define $xRy\\iff x^2 = y^2$. How many equivalence classes are there?</p>", ans: { type: "num", answer: n + 1 }, model: String(n + 1),
      hints: ["$x^2 = y^2\\iff y = \\pm x$.", "So each class is $\\{x,-x\\}$.", "Be careful with $0$.", "$\\{0\\}$ is a class on its own."],
      sol: "<p>Classes: $\\{0\\}, \\{\\pm1\\},\\dots,\\{\\pm" + n + "\\}$ — <b>" + (n + 1) + "</b> classes.</p>" };
  } });

  const FN_POOL = [
    ["f:\\R\\to\\R,\\ f(x) = 2x+3", 2, "Injective ($2x_1+3 = 2x_2+3\\Rightarrow x_1 = x_2$) and surjective ($x = \\frac{y-3}2$)."],
    ["f:\\R\\to\\R,\\ f(x) = x^2", 3, "Not injective ($f(1) = f(-1)$); not surjective ($-1$ is never hit)."],
    ["f:[0,\\infty)\\to\\R,\\ f(x) = x^2", 0, "Injective on $[0,\\infty)$ (square roots are unique there) but $-1$ is not hit."],
    ["f:\\R\\to[0,\\infty),\\ f(x) = x^2", 1, "Every $y\\ge0$ is $(\\sqrt y)^2$, but $f(1) = f(-1)$."],
    ["f:[0,\\infty)\\to[0,\\infty),\\ f(x) = x^2", 2, "Injective and surjective: inverse $\\sqrt y$."],
    ["f:\\R\\to\\R,\\ f(x) = e^x", 0, "Strictly increasing ⇒ injective; but $f(x)\\gt0$, so $0$ is not hit."],
    ["f:\\R\\to(0,\\infty),\\ f(x) = e^x", 2, "Bijective with inverse $\\ln y$."],
    ["f:\\Z\\to\\Z,\\ f(n) = 2n", 0, "Injective; odd numbers are not hit."],
    ["f:\\Z\\to\\Z,\\ f(n) = n+1", 2, "Bijective with inverse $n-1$."],
    ["f:\\R\\to\\R,\\ f(x) = x^3-x", 1, "Surjective (odd-degree polynomial), but $f(0) = f(1) = 0$."],
    ["f:\\R\\to\\R,\\ f(x) = x^3", 2, "Bijective with inverse $\\sqrt[3]y$."],
    ["f:\\R^2\\to\\R,\\ f(x,y) = x+y", 1, "Every $t = f(t,0)$; but $f(1,0) = f(0,1)$."],
    ["f:\\R\\to\\R^2,\\ f(x) = (x,0)", 0, "Injective; $(0,1)$ is not hit."],
    ["f:\\Z\\to\\Z,\\ f(n) = n^2", 3, "$f(1) = f(-1)$ and $2$ is not a square."],
  ];
  def({ id: "fn-props", topic: "functions", title: "Injective / surjective / bijective", gen(r, diff) {
    const pool = diff === "beginner" ? FN_POOL.slice(0, 4).concat([FN_POOL[8]]) : diff === "standard" ? FN_POOL.slice(0, 9) : FN_POOL.slice(4);
    const [f, k, why] = r.pick(pool);
    const opts = ["injective but not surjective", "surjective but not injective", "bijective", "neither injective nor surjective"];
    return { q: "<p>Classify $" + f + "$.</p>", opts, ans: { type: "mcq", answer: k }, model: String(k),
      hints: ["Domain and codomain matter as much as the formula.", "Injective: does $f(x_1) = f(x_2)$ force $x_1 = x_2$? Look for two inputs with the same output.", "Surjective: can you solve $f(x) = y$ for EVERY $y$ in the codomain?", "Try a specific awkward $y$ (negative, zero, odd…)."],
      sol: "<p>" + why + " So $f$ is <b>" + opts[k] + "</b>.</p>" };
  } });

  def({ id: "fn-inverse", topic: "functions", title: "Find the inverse function", gen(r, diff) {
    const aff = H.aff;
    if (diff === "beginner" || diff === "standard") {
      const a = r.nz(-5, 5), b = r.int(-9, 9), c = diff === "standard" ? r.pick([2, 3, 4, 5]) : 1;
      const f = c === 1 ? aff(a, b) : "\\frac{" + aff(a, b) + "}{" + c + "}";
      const model = "(" + c + "x - (" + b + "))/(" + a + ")";
      const inv = "\\frac{" + aff(c, -b) + "}{" + a + "}";
      return { q: "<p>$f:\\R\\to\\R$, $f(x) = " + f + "$. Find $f^{-1}(x)$.</p>", ans: { type: "expr", answer: model, vars: ["x"] }, model, ph: "e.g. (x - 3)/2",
        hints: ["Write $y = f(x)$.", "Solve for $x$ in terms of $y$.", "Then swap the names: $f^{-1}(x)$ is that expression with $y$ replaced by $x$.", "Check: $f(f^{-1}(x))$ should simplify to $x$."],
        sol: "<p>$y = " + f + "\\Rightarrow " + (c === 1 ? "" : c + "y = " + aff(a, b) + "\\Rightarrow ") + "x = \\frac{" + aff(c, -b, "y") + "}{" + a + "}$, so $f^{-1}(x) = " + inv + "$.</p>" };
    }
    let a, b, c, d; do { a = r.nz(-4, 4); b = r.int(-5, 5); c = r.nz(-3, 3); d = r.int(-5, 5); } while (a * d - b * c === 0);
    const model = "(" + d + "x - (" + b + "))/(" + (-c) + "x + (" + a + "))";
    const note = diff === "challenge" ? "<p class=\"small muted\">Domain $\\R\\setminus\\{" + fr(-d).div(c).tex() + "\\}$, codomain $\\R\\setminus\\{" + fr(a).div(c).tex() + "\\}$ — on these sets $f$ is a bijection.</p>" : "";
    return { q: "<p>$f(x) = \\dfrac{" + aff(a, b) + "}{" + aff(c, d) + "}$. Find $f^{-1}(x)$.</p>" + note,
      ans: { type: "expr", answer: model, vars: ["x"] }, model, ph: "e.g. (2x + 1)/(x - 3)",
      hints: ["Set $y = f(x)$ and clear the denominator: $y(" + aff(c, d) + ") = " + aff(a, b) + "$.", "Collect all the $x$ terms on one side.", "Factor out $x$ and divide.", "You should get $x = \\dfrac{" + aff(d, -b, "y") + "}{" + aff(-c, a, "y") + "}$."],
      sol: "<p>$y(" + aff(c, d) + ") = " + aff(a, b) + "\;\\Rightarrow\; x(" + aff(c, -a, "y") + ") = " + aff(-d, b, "y") + "\;\\Rightarrow\; x = \\dfrac{" + aff(d, -b, "y") + "}{" + aff(-c, a, "y") + "}$. Hence $f^{-1}(x) = \\dfrac{" + aff(d, -b) + "}{" + aff(-c, a) + "}$.</p>" };
  } });

  const BINOP = [
    ["a*b = a-b", "\\N = \\{1,2,3,\\dots\\}", false, "$1*2 = -1\\notin\\N$ (not closed)."], ["a*b = a-b", "\\Z", true, "The difference of integers is an integer."],
    ["a*b = a/b", "\\Q", false, "$a*0$ is undefined."], ["a*b = a/b", "\\Q\\setminus\\{0\\}", true, "Non-zero rationals are closed under division."],
    ["a*b = \\sqrt{ab}", "(0,\\infty)", true, "$ab\\gt0$ so $\\sqrt{ab}$ is a positive real."], ["a*b = \\sqrt{ab}", "\\R", false, "$(-1)*1 = \\sqrt{-1}\\notin\\R$."],
    ["a*b = a+b+1", "\\Z", true, "Integers are closed under $+$."], ["a*b = \\frac{a+b}{2}", "\\Z", false, "$1*2 = \\frac32\\notin\\Z$."],
    ["a*b = \\frac{a+b}{2}", "\\Q", true, "Averages of rationals are rational."], ["A*B = AB", "\\text{invertible } 2\\times2 \\text{ matrices}", true, "$(AB)^{-1} = B^{-1}A^{-1}$ exists."],
    ["A*B = A+B", "\\text{invertible } 2\\times2 \\text{ matrices}", false, "$I+(-I) = O$ is not invertible."], ["a*b = \\max(a,b)", "\\{1,2,3\\}", true, "The max of two elements of the set is in the set."],
  ];
  def({ id: "binop", topic: "binary-ops", title: "Binary operation or not?", gen(r, diff) {
    const [op, S0, yes, why] = r.pick(diff === "beginner" ? BINOP.slice(0, 6) : BINOP);
    return { q: "<p>Is $" + op + "$ a binary operation on $" + S0 + "$?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Yes", "No"],
      hints: ["A binary operation on $S$ is a function $S\\times S\\to S$.", "Two things to check: defined for EVERY pair, and the result lies in $S$ (closure).", "Try awkward inputs: $0$, negatives, equal elements, fractions.", yes ? "No counterexample exists here." : "There IS a pair that breaks it."],
      sol: "<p><b>" + (yes ? "Yes" : "No") + ".</b> " + why + "</p>" };
  } });

  /* ======================= Chapter 2 ======================= */
  const NOT_VS = [["$\\{(x,y)\\in\\R^2: x\\ge0\\}$", "not closed under multiplication by $-1$"], ["$\\{p\\in\\P_2: p(0) = 1\\}$", "does not contain the zero polynomial"], ["the invertible $2\\times2$ matrices", "does not contain $O$ (and $I+(-I) = O$)"], ["the polynomials of degree exactly $2$", "$x^2+(-x^2) = 0$ has no degree 2"], ["$\\{(x,y): xy = 0\\}$", "$(1,0)+(0,1) = (1,1)$ is not in it"], ["$\\{(x,y): y = x+1\\}$", "does not contain $(0,0)$"], ["$\\{(x,y): x,y\\in\\Z\\}$ (over $\\R$)", "$\\tfrac12(1,0)$ is not in it"]];
  const IS_VS = ["$\\{(x,y): y = 2x\\}$", "the symmetric $2\\times2$ matrices", "$\\{f:\\R\\to\\R \\mid f(1) = 0\\}$", "$\\{p\\in\\P_3: p(2) = 0\\}$", "$\\{(x,y,z): x+y+z = 0\\}$", "the $2\\times2$ matrices with trace $0$", "$\\{A\\in\\R^{2\\times2}: A^T = -A\\}$", "the solutions of $y''+y = 0$"];
  def({ id: "vs-axioms", topic: "vector-spaces", title: "Which is not a vector space?", gen(r) {
    const [bad, why] = r.pick(NOT_VS);
    const m = H.mcq(r, bad, IS_VS);
    return { q: "<p>With the usual addition and scalar multiplication, which of these is <b>not</b> a (real) vector space?</p>", opts: m.opts, ans: { type: "mcq", answer: m.answer }, model: String(m.answer),
      hints: ["Fastest checks: does it contain the zero vector? Is it closed under addition and scaling?", "Each candidate sits inside a known vector space, so it is enough to run the subspace test.", "Look for a missing zero vector or a sum/scalar multiple that escapes.", "Try multiplying by $-1$ or adding two simple elements."],
      sol: "<p>" + bad + " fails: it " + why + ". The others are subspaces of familiar spaces (they contain $0$ and are closed under linear combinations).</p>" };
  } });

  def({ id: "subspace-test", topic: "subspaces", title: "Subspace or not?", gen(r, diff) {
    const a = r.nz(-4, 4), b = r.nz(-4, 4), c = r.int(-4, 4), d = r.nz(-5, 5), k = r.pick([2, 3]);
    const pools = {
      beginner: [[H.lin([a, b, c], ["x", "y", "z"]) + " = 0", true, "it is the null space of $(" + a + "\\;" + b + "\\;" + c + ")$: contains $0$ and is closed under combinations."], [H.lin([a, b, c], ["x", "y", "z"]) + " = " + d, false, "$(0,0,0)$ does not satisfy it (the right side is $" + d + "\\neq0$)."], ["x\\ge0", false, "$(1,0,0)$ is in it but $-1\\cdot(1,0,0)$ is not."], ["x = " + k + "y \\text{ and } z = 0", true, "it is $\\spn\\{(" + k + ",1,0)\\}$, a line through $0$."]],
      standard: [["xy = 0", false, "$(1,0,0)+(0,1,0) = (1,1,0)$ is not in it."], ["x = y^2", false, "$(1,1,0)$ is in it, $2(1,1,0) = (2,2,0)$ is not."], [H.lin([a, b], ["x", "y"]) + " = 0 \\text{ and } z = " + k + "x", true, "it is the solution set of a homogeneous system."], ["x+y+z = 0 \\text{ or } x = 0", false, "a union of two planes: $(1,-1,0)+(0,1,0) = (1,0,0)$ escapes."], [H.lin([a, b, c], ["x", "y", "z"]) + " = 0", true, "homogeneous linear equation."]],
      advanced: [["\\{p\\in\\P_2: p(" + k + ") = 0\\}", true, "$p\\mapsto p(" + k + ")$ is linear and this is its kernel."], ["\\{p\\in\\P_2: p(0) = " + Math.abs(d) + "\\}", false, "the zero polynomial has $p(0) = 0$."], ["\\{p\\in\\P_3: p'(0) = 0\\}", true, "kernel of the linear map $p\\mapsto p'(0)$."], ["\\{A\\in\\R^{2\\times2}: A^T = A\\}", true, "$(\\alpha A+\\beta B)^T = \\alpha A+\\beta B$."], ["\\{A\\in\\R^{2\\times2}: \\operatorname{tr}A = 0\\}", true, "trace is linear; this is its kernel."]],
      challenge: [["\\{A\\in\\R^{2\\times2}: \\det A = 0\\}", false, "$\\diag(1,0)+\\diag(0,1) = I$ has determinant $1$."], ["\\{(x,y,z): x^2+y^2 = z^2\\}", false, "$(1,0,1)+(0,1,1) = (1,1,2)$ but $1+1\\neq4$."], ["\\{A\\in\\R^{2\\times2}: A^2 = O\\}", false, "$\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}$ squares to $I$."], ["\\{f\\in C(\\R): f(x+1) = f(x)\\ \\forall x\\}", true, "contains $0$; sums and multiples of 1-periodic functions are 1-periodic."]],
    }[diff];
    const [W, yes, why] = r.pick(pools);
    const inR3 = !/P_|R\^\{2|C\(/.test(W);
    return { q: "<p>Is " + (inR3 ? "$W = \\{(x,y,z)\\in\\R^3: " + W + "\\}$" : "$W = " + W + "$") + " a subspace?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Yes, a subspace", "No"],
      hints: ["Subspace test: (1) $0\\in W$; (2) $u,v\\in W$, $\\alpha,\\beta$ scalars ⇒ $\\alpha u+\\beta v\\in W$.", "Check the zero vector first — it is the quickest way to rule a set out.", "Equations that are linear and homogeneous (right side $0$) define subspaces; products, squares, inequalities, 'or' and non-zero constants usually break closure.", yes ? "It passes both tests." : "Find a specific sum or scalar multiple that leaves $W$."],
      sol: "<p><b>" + (yes ? "Yes" : "No") + "</b> — " + why + "</p>" };
  } });

  def({ id: "span-coeffs", topic: "span", title: "Write a vector as a combination", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3, k = diff === "advanced" || diff === "challenge" ? 3 : 2;
    let U; do { U = Array.from({ length: k }, () => r.intVec(n, -3, 3)); } while (H.rank(U) < k || U.some((u) => u.every((x) => x === 0)));
    const co = r.intVec(k, -3, 3);
    if (co.every((x) => x === 0)) co[0] = 1;
    const v = Array.from({ length: n }, (_, i) => U.reduce((s, u, j) => s + co[j] * u[i], 0));
    const names = ["a", "b", "c"].slice(0, k);
    if (diff === "challenge") { // polynomials in P2
      return { q: "<p>In $\\P_2$, write $p = " + H.pt([v[0], v[1], v[2]]) + "$ as $a\\,p_1+b\\,p_2+c\\,p_3$ where $p_1 = " + H.pt(U[0]) + "$, $p_2 = " + H.pt(U[1]) + "$, $p_3 = " + H.pt(U[2]) + "$. Give $(a,b,c)$.</p>",
        ans: { type: "vec", answer: co }, model: vs(co), ph: "(a, b, c)",
        hints: ["Compare coefficients of $1$, $x$ and $x^2$.", "That gives a $3\\times3$ linear system in $a,b,c$.", "Row-reduce the augmented matrix whose columns are the coefficient vectors of $p_1,p_2,p_3$ and $p$.", "One of the coefficients is $" + co[0] + "$."],
        sol: "<p>Matching coefficients gives a $3\\times3$ system with unique solution $(a,b,c) = " + vt(co) + "$. Check: $" + co.map((c0, j) => "(" + c0 + ")(" + H.pt(U[j]) + ")").join("+") + " = " + H.pt(v) + "$.</p>" };
    }
    return { q: "<p>Find scalars " + names.map((x) => "$" + x + "$").join(", ") + " with $" + vt(v) + " = " + names.map((x, j) => x + vt(U[j])).join(" + ") + "$.</p>",
      ans: { type: "vec", answer: co }, model: vs(co), ph: "(" + names.join(", ") + ")",
      hints: ["Compare components to get " + n + " equations in " + k + " unknowns.", "Write the augmented matrix with the vectors as COLUMNS and $v$ as the last column.", "Row-reduce; the solution is unique because the vectors are independent.", "$" + names[0] + " = " + co[0] + "$."],
      sol: "<p>Solving the system gives $(" + names.join(",") + ") = " + vt(co) + "$. Check: $" + co.map((c0, j) => c0 + vt(U[j])).join(" + ") + " = " + vt(v) + "$.</p>" };
  } });

  def({ id: "in-span", topic: "span", title: "Is it in the span?", gen(r, diff) {
    const n = diff === "beginner" ? 2 : diff === "challenge" ? 4 : 3;
    const k = diff === "beginner" ? 1 : diff === "challenge" ? 3 : 2;
    let U; do { U = Array.from({ length: k }, () => r.intVec(n, -3, 3)); } while (H.rank(U) < k);
    const co = r.intVec(k, -2, 2); let v = Array.from({ length: n }, (_, i) => U.reduce((s, u, j) => s + co[j] * u[i], 0));
    const yes = r.bool(0.5);
    if (!yes) { let t = 0; do { v = v.slice(); v[r.int(0, n - 1)] += r.nz(-2, 2); t++; } while (H.rank(U.concat([v])) === k && t < 20); }
    const truth = H.rank(U.concat([v])) === k;
    return { q: "<p>Is $v = " + vt(v) + "$ in $\\spn\\{" + U.map(vt).join(", ") + "\\}$?</p>", ans: { type: "tf", answer: truth }, model: String(truth), tf: ["Yes", "No"],
      hints: ["$v\\in\\spn S$ iff the system $\\sum a_iu_i = v$ is consistent.", "Row-reduce the augmented matrix $(u_1\\cdots u_k\\,|\\,v)$.", "Inconsistent ⇔ a row $(0\\cdots0\\,|\\,c)$ with $c\\neq0$; equivalently $\\Rank(U\\,|\\,v)\\gt\\Rank U$.", "$\\Rank(U) = " + k + "$ here."],
      sol: "<p>$\\Rank(u_1\\cdots u_k) = " + k + "$ and $\\Rank(u_1\\cdots u_k\\,|\\,v) = " + H.rank(U.concat([v])) + "$, so <b>" + (truth ? "yes" : "no") + "</b>." + (truth ? " Indeed $v = " + co.map((c0, j) => c0 + vt(U[j])).join(" + ") + "$." : " The augmented system is inconsistent.") + "</p>" };
  } });

  def({ id: "indep-test", topic: "independence", title: "Independent or dependent?", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3, k = diff === "beginner" ? 2 : diff === "advanced" ? 3 : 3;
    const dim = diff === "advanced" ? 4 : n;
    let U = Array.from({ length: k }, () => r.intVec(dim, -3, 3));
    if (r.bool(0.5)) { const a = r.nz(-2, 2), b = r.int(-2, 2); U[k - 1] = U[0].map((x, i) => a * x + (k > 2 ? b * U[1][i] : 0)); }
    const indep = H.rank(U) === k;
    const poly = diff === "challenge";
    const show = (u) => (poly ? H.pt(u) : vt(u));
    return { q: "<p>Are " + (poly ? "the polynomials " : "the vectors ") + U.map((u) => "$" + show(u) + "$").join(", ") + " linearly independent" + (poly ? " in $\\P_2$" : "") + "?</p>", ans: { type: "tf", answer: indep }, model: String(indep), tf: ["Independent", "Dependent"],
      hints: ["Independent ⇔ the only solution of $a_1v_1+\\dots+a_kv_k = 0$ is trivial.", (dim === k ? "Square case: compute the determinant of the matrix with these vectors as columns." : "Row-reduce the matrix with these vectors as columns and count pivots."), "Independent ⇔ " + (dim === k ? "$\\det\\neq0$" : "rank $= " + k + "$") + ".", "The rank is " + H.rank(U) + "."],
      sol: "<p>The matrix with these " + (poly ? "coefficient vectors" : "vectors") + " as columns has rank $" + H.rank(U) + "$" + (dim === k ? " (determinant $" + H.det(U).tex() + "$)" : "") + ", so they are <b>" + (indep ? "independent" : "dependent") + "</b>.</p>" };
  } });

  def({ id: "indep-param", topic: "independence", title: "Find k making vectors dependent", gen(r, diff) {
    if (diff === "advanced" || diff === "challenge") {
      let a, b; do { a = r.int(-4, 4); b = r.int(-4, 4); } while (a === b);
      return { q: "<p>For which values of $k$ are $(1," + a + "," + a * a + ")$, $(1," + b + "," + b * b + ")$, $(1,k,k^2)$ linearly dependent?</p>", ans: { type: "set", answer: [a, b], multiplicity: false }, model: a + ", " + b, ph: "list the values, e.g. 2, -3",
        hints: ["Three vectors in $\\R^3$ are dependent iff the determinant of the matrix they form is $0$.", "This is a Vandermonde determinant.", "$\\det = (" + b + "-" + a + ")(k-" + a + ")(k-" + b + ")$ up to sign.", "Set each factor to zero."],
        sol: "<p>$\\det\\begin{pmatrix}1&" + a + "&" + a * a + "\\\\1&" + b + "&" + b * b + "\\\\1&k&k^2\\end{pmatrix} = (" + b + "-(" + a + "))(k-(" + a + "))(k-(" + b + "))$, zero iff $k = " + a + "$ or $k = " + b + "$.</p>" };
    }
    let v2, v3, p, q0, alpha, beta;
    for (let t = 0; t < 100; t++) {
      v2 = r.intVec(3, -3, 3); v3 = r.intVec(3, -3, 3); p = r.int(-3, 3); q0 = r.int(-3, 3);
      const d0 = H.det([[p, q0, 0], v2, v3]), d1 = H.det([[p, q0, 1], v2, v3]);
      alpha = d1.sub(d0); beta = d0; if (!alpha.isZero() && (diff !== "beginner" || beta.div(alpha).isInt())) break;
    }
    if (alpha.isZero()) { v2 = [0, 1, 1]; v3 = [2, 1, 1]; p = 1; q0 = 2; beta = fr(4); alpha = fr(-2); }
    const k = beta.div(alpha).neg();
    return { q: "<p>Find $k$ such that $(" + p + "," + q0 + ",k)$, $" + vt(v2) + "$, $" + vt(v3) + "$ are linearly dependent.</p>", ans: { type: "num", answer: k }, model: k.toString(),
      hints: ["Dependent ⇔ the determinant of the $3\\times3$ matrix (vectors as rows) is $0$.", "Expand along the first row — the determinant is linear in $k$.", "You get an equation $\\alpha k+\\beta = 0$ with $\\alpha = " + alpha.tex() + "$.", "$\\beta = " + beta.tex() + "$."],
      sol: "<p>$\\det = " + alpha.tex() + "k" + (beta.sign() < 0 ? "" : "+") + beta.tex() + " = 0\\Rightarrow k = " + k.tex() + "$.</p>" };
  } });

  def({ id: "basis-sub", topic: "basis-dimension", title: "Basis of a subspace", gen(r, diff) {
    if (diff === "beginner") {
      let a; do { a = r.intVec(3, -4, 4); } while (a.every((x) => x === 0));
      const B = H.null([a]);
      return { q: "<p>Find a basis for $W = \\{(x,y,z)\\in\\R^3: " + H.lin(a, ["x", "y", "z"]) + " = 0\\}$.</p>", ans: { type: "span", answer: B }, model: H.ls(B), ph: "(1,0,-1), (0,1,-1)",
        hints: ["$W$ is the null space of the $1\\times3$ matrix $(" + a.join("\\;") + ")$.", "Solve for one variable with a non-zero coefficient; the other two are free.", "Each free variable gives one basis vector (set it to 1, the other free one to 0).", "$\\dim W = 2$."],
        sol: "<p>One equation in three unknowns ⇒ two free variables, $\\dim W = 2$. A basis: $" + B.map(vt).join(", ") + "$ (any two independent solutions work).</p>" };
    }
    if (diff === "standard") {
      const A = H.rankMat(r, 2, 4, 2, 5); const B = H.null(A);
      return { q: "<p>Find a basis for the solution space of $" + A.map((row) => H.lin(row, ["x_1", "x_2", "x_3", "x_4"]) + " = 0").join(",\\quad ") + "$.</p>", ans: { type: "span", answer: B }, model: H.ls(B), ph: "(…), (…)",
        hints: ["This is $\\Null(A)$ for the $2\\times4$ coefficient matrix.", "Row-reduce to RREF and identify the free variables.", "Write the general solution as a combination of vectors, one per free variable.", "$\\dim = 4-\\Rank A = 2$."],
        sol: "<p>RREF:" + H.steps(A, H.rref(A)) + "</p><p>Two free variables; a basis: $" + B.map(vt).join(", ") + "$.</p>" };
    }
    // polynomials: {p in P_n : p(a) = 0} or p(a) = p(b) = 0
    const n = diff === "advanced" ? 2 : 3; const pts = diff === "advanced" ? [r.int(-3, 3)] : (() => { let a, b; do { a = r.int(-3, 3); b = r.int(-3, 3); } while (a === b); return [a, b]; })();
    const A = pts.map((t) => Array.from({ length: n + 1 }, (_, i) => Math.pow(t, i)));
    const B = H.null(A);
    return { q: "<p>Find a basis for $W = \\{p\\in\\P_" + n + ": " + pts.map((t) => "p(" + t + ") = 0").join(",\\ ") + "\\}$.</p>", ans: { type: "polyspan", answer: B, n: n + 1 }, model: B.map((c) => H.ps(c)).join(", "), ph: "e.g. x - 1, x^2 - 1",
      hints: ["Write $p = a_0+a_1x+\\dots+a_" + n + "x^" + n + "$; each condition $p(t) = 0$ is ONE linear equation in the coefficients.", "So $W$ is the null space of a " + pts.length + "×" + (n + 1) + " matrix.", "Alternatively: $p(t) = 0\\iff(x-t)$ divides $p$.", "$\\dim W = " + (n + 1 - pts.length) + "$."],
      sol: "<p>$\\dim W = " + (n + 1) + "-" + pts.length + " = " + (n + 1 - pts.length) + "$. A basis: $" + B.map((c) => H.pt(c)).join(",\\ ") + "$ (e.g. multiples of $" + pts.map((t) => "(x" + (t > 0 ? "-" + t : t < 0 ? "+" + -t : "") + ")").join("") + "$).</p>" };
  } });

  def({ id: "dim-span", topic: "basis-dimension", title: "Dimension of a span", gen(r, diff) {
    const n = diff === "beginner" ? 3 : 4, k = diff === "beginner" ? 3 : 4, rk = r.int(1, Math.min(n, k) - (diff === "challenge" ? 0 : 1));
    const A = H.rankMat(r, k, n, Math.max(1, rk), 6);
    return { q: "<p>Find $\\dim\\spn\\{" + A.map(vt).join(", ") + "\\}$.</p>", ans: { type: "num", answer: H.rank(A) }, model: String(H.rank(A)),
      hints: ["The dimension of a span = the number of independent vectors among them = the rank.", "Put the vectors as ROWS of a matrix and row-reduce.", "Count the non-zero rows of the echelon form.", "Look for vectors that are combinations of others."],
      sol: "<p>Row-reducing the matrix with these rows gives rank $" + H.rank(A) + "$:" + H.steps(A, LA.alg.rowReduce(H.FR(A), { mode: "ref" })) + "so the dimension is <b>" + H.rank(A) + "</b>.</p>" };
  } });

  def({ id: "coords", topic: "basis-dimension", title: "Coordinates in a basis", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3;
    const P0 = diff === "advanced" || diff === "challenge" ? H.nonsingular(r, n, -2, 3) : H.unimod(r, n, n + 1, 1);
    const B = LA.M.cols(H.FR(P0));
    const c = diff === "advanced" || diff === "challenge" ? r.intVec(n, -3, 3).map((x, i) => fr(x).div(i === 0 && diff === "challenge" ? 2 : 1)) : r.intVec(n, -3, 3).map(fr);
    const v = LA.M.mulVec(H.FR(P0), c);
    const poly = diff === "challenge";
    const show = (u) => (poly ? H.pt(u) : vt(u));
    return { q: "<p>Find the coordinate vector $[v]_{\\B}$ of $v = " + show(v) + "$ relative to the basis $\\B = \\{" + B.map(show).join(",\\ ") + "\\}$" + (poly ? " of $\\P_2$ (coefficients listed as $1, x, x^2$)" : "") + ".</p>",
      ans: { type: "vec", answer: c }, model: vs(c), ph: "(c1, c2" + (n > 2 ? ", c3" : "") + ")",
      hints: ["$[v]_{\\B} = (c_1,\\dots,c_n)$ means $v = c_1b_1+\\dots+c_nb_n$.", "Solve $P c = v$ where the columns of $P$ are the basis vectors.", "Row-reduce $(P\\,|\\,v)$.", "$c_1 = " + c[0].tex() + "$."],
      sol: "<p>Solving $(b_1\\cdots b_n\\,|\\,v)$ gives $[v]_{\\B} = " + vt(c) + "$. Check: $" + c.map((x, i) => "(" + x.tex() + ")" + show(B[i])).join(" + ") + " = " + show(v) + "$.</p>" };
  } });

  def({ id: "dim-sum", topic: "sums", title: "Dimension of U + W and U ∩ W", gen(r, diff) {
    if (diff === "beginner") {
      const n = r.int(4, 7), du = r.int(2, n - 1), dw = r.int(2, n - 1), ds = r.int(Math.max(du, dw), Math.min(n, du + dw));
      return { q: "<p>$U,W$ are subspaces of $\\R^" + n + "$ with $\\dim U = " + du + "$, $\\dim W = " + dw + "$ and $\\dim(U+W) = " + ds + "$. Find $\\dim(U\\cap W)$.</p>", ans: { type: "num", answer: du + dw - ds }, model: String(du + dw - ds),
        hints: ["Use $\\dim(U+W) = \\dim U+\\dim W-\\dim(U\\cap W)$.", "Rearrange for $\\dim(U\\cap W)$.", "$\\dim(U\\cap W) = " + du + "+" + dw + "-" + ds + "$.", "Compute."], sol: "<p>$\\dim(U\\cap W) = " + du + "+" + dw + "-" + ds + " = " + (du + dw - ds) + "$.</p>" };
    }
    const n = diff === "standard" ? 3 : 4, ku = 2, kw = 2;
    let Uv, Wv; do { Uv = Array.from({ length: ku }, () => r.intVec(n, -2, 2)); Wv = Array.from({ length: kw }, () => r.intVec(n, -2, 2)); if (diff !== "standard" && r.bool(0.6)) Wv[0] = Uv[0].map((x, i) => x + Uv[1][i] * r.int(-1, 1)); } while (H.rank(Uv) < ku || H.rank(Wv) < kw);
    const dsum = H.rank(Uv.concat(Wv)), dint = ku + kw - dsum;
    if (diff === "challenge") return { q: "<p>$U = \\spn\\{" + Uv.map(vt).join(",") + "\\}$, $W = \\spn\\{" + Wv.map(vt).join(",") + "\\}$ in $\\R^4$. Is the sum $U+W$ direct?</p>", ans: { type: "tf", answer: dint === 0 }, model: String(dint === 0), tf: ["Yes, direct", "No"],
      hints: ["$U+W$ is direct iff $U\\cap W = \\{0\\}$.", "Equivalently $\\dim(U+W) = \\dim U+\\dim W$.", "Compute the rank of all four vectors together.", "$\\dim U = \\dim W = 2$."], sol: "<p>$\\dim(U+W) = \\Rank = " + dsum + "$, so $\\dim(U\\cap W) = 4-" + dsum + " = " + dint + "$: the sum is <b>" + (dint === 0 ? "direct" : "not direct") + "</b>.</p>" };
    return { q: "<p>$U = \\spn\\{" + Uv.map(vt).join(",") + "\\}$ and $W = \\spn\\{" + Wv.map(vt).join(",") + "\\}$ in $\\R^" + n + "$. Find $\\dim(U\\cap W)$.</p>", ans: { type: "num", answer: dint }, model: String(dint),
      hints: ["Both spanning sets are independent, so $\\dim U = \\dim W = 2$.", "$\\dim(U+W)$ = rank of all four vectors together.", "Then use $\\dim(U\\cap W) = \\dim U+\\dim W-\\dim(U+W)$.", "$\\dim(U+W) = " + dsum + "$."], sol: "<p>$\\dim(U+W) = " + dsum + "$, hence $\\dim(U\\cap W) = 2+2-" + dsum + " = " + dint + "$.</p>" };
  } });
})();
