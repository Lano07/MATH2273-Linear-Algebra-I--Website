/* Labs for Chapter 3: Linearity checker, Kernel/Range/Rank–Nullity, Matrix of T relative to bases */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc, Frac, Poly, M, V } = LA;
  const P = LA.parse, ALG = LA.alg, FMT = LA.fmt;

  /* ---------------- shared helpers ---------------- */
  LA.stepsHTML = function (steps, startM, opts) {
    opts = opts || {};
    let html = '<div class="log-step"><div class="op">Start</div>$$' + M.tex(startM, { aug: opts.aug }) + "$$</div>";
    steps.forEach((s) => { html += '<div class="log-step"><div class="op">' + s.ops.map((o) => "$" + o + "$").join(", &nbsp; ") + "</div>$$\\cong " + M.tex(s.M, { aug: opts.aug }) + "$$</div>"; });
    return html;
  };
  const DEFAULT_VARS = { 1: ["x"], 2: ["x", "y"], 3: ["x", "y", "z"], 4: ["x", "y", "z", "w"] };
  function guessVars(src) {
    const d = P.detectVars(src); if (d && d.length) return d;
    const rhs = src.includes("=") ? src.slice(src.lastIndexOf("=") + 1) : src;
    const idx = new Set((rhs.match(/x(\d)/g) || []).map((s) => Number(s.slice(1))));
    if (idx.size) { const n = Math.max.apply(null, Array.from(idx)); return Array.from({ length: n }, (_, i) => "x" + (i + 1)); }
    const order = ["x", "y", "z", "w"]; let n = 0; order.forEach((v, i) => { if (new RegExp("(^|[^a-z])" + v + "(?![a-z])").test(rhs)) n = i + 1; });
    return DEFAULT_VARS[Math.max(1, n)];
  }
  // Parse "T(x,y) = (…, …)" → { vars, comps:[{src, ast, mp|null}] }
  LA.parseMap = function (src) {
    const vars = guessVars(src);
    const parts = P.splitTuple(src);
    if (!parts.length) throw new Error("Enter a formula, e.g. T(x,y,z) = (x - y, x + z)");
    const comps = parts.map((p) => { const ast = P.parse(p, vars); let mp = null; try { mp = P.toMPoly(ast, vars); } catch (e) { if (!(e instanceof P.NonPoly)) throw e; } return { src: p, ast, mp }; });
    return { vars, comps };
  };
  function evalMapExact(map, pt) { return map.comps.map((c) => P.mpEval(c.mp, pt)); }
  function evalMapNum(map, pt) { const env = {}; map.vars.forEach((v, i) => { env[v] = pt[i]; }); return map.comps.map((c) => P.evalNum(c.ast, env)); }
  const numTex = (x) => { if (!Number.isFinite(x)) return "\\text{undefined}"; const r = Math.round(x * 10000) / 10000; return Object.is(r, -0) ? "0" : String(r); };
  const tupTex = (arr) => (arr.length === 1 ? (arr[0].tex ? arr[0].tex() : numTex(arr[0])) : "(" + arr.map((x) => (x.tex ? x.tex() : numTex(x))).join(",\\,") + ")");

  /** Analyse linearity. Returns {linear: true|false|null, A?, reason, html} */
  LA.analyseLinearity = function (map) {
    const n = map.vars.length; const allPoly = map.comps.every((c) => c.mp);
    const zero = new Array(n).fill(0);
    const cands = [];
    for (let i = 0; i < n; i++) { const e = zero.slice(); e[i] = 1; cands.push(e); }
    cands.push(new Array(n).fill(1));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const e = zero.slice(); e[i] = 1; e[j] = 1; cands.push(e); }
    cands.push(Array.from({ length: n }, (_, i) => i + 1)); cands.push(Array.from({ length: n }, (_, i) => (i % 2 ? -1 : 2)));
    const scalars = [2, -1, 3, 0.5];
    const ptTex = (p) => tupTex(p.map((x) => Frac.of(x)));
    if (allPoly) {
      const consts = map.comps.map((c) => P.mpEval(c.mp, zero.map(() => Frac.ZERO)));
      if (consts.some((c) => !c.isZero())) return { linear: false, reason: "zero", html: "<p><b class=\"err\">Not linear.</b> $T(" + ptTex(zero) + ") = " + tupTex(consts) + "\\neq 0$, but every linear map satisfies $T(0) = 0$ (Proposition 3.1.4).</p>" };
      const degs = map.comps.map((c) => P.mpDegreeInfo(c.mp));
      const isLin = degs.every((s) => Array.from(s).every((d) => d === 1));
      if (isLin) { const A = map.comps.map((c) => P.mpLinearCoeffs(c.mp, n)); return { linear: true, A, reason: "poly" }; }
      for (const a of scalars) for (const u of cands) {
        const U = u.map((x) => Frac.of(x)), al = Frac.of(a);
        const lhs = evalMapExact(map, U.map((x) => x.mul(al))), rhs = evalMapExact(map, U).map((x) => x.mul(al));
        if (lhs.some((x, k) => !x.eq(rhs[k]))) return { linear: false, reason: "hom", html: "<p><b class=\"err\">Not linear</b> (homogeneity fails). Take $\\alpha = " + al.tex() + "$ and $u = " + ptTex(u) + "$:</p>$$T(\\alpha u) = T" + (n === 1 ? "(" + U.map((x) => x.mul(al))[0].tex() + ")" : tupTex(U.map((x) => x.mul(al)))) + " = " + tupTex(lhs) + ",\\qquad \\alpha T(u) = " + al.tex() + "\\cdot" + tupTex(evalMapExact(map, U)) + " = " + tupTex(rhs) + ".$$<p>Since $T(\\alpha u)\\neq\\alpha T(u)$, $T$ is not a linear transformation.</p>" };
      }
      for (const u of cands) for (const v of cands) {
        const U = u.map((x) => Frac.of(x)), Vv = v.map((x) => Frac.of(x));
        const lhs = evalMapExact(map, U.map((x, k) => x.add(Vv[k]))), rhs = evalMapExact(map, U).map((x, k) => x.add(evalMapExact(map, Vv)[k]));
        if (lhs.some((x, k) => !x.eq(rhs[k]))) return { linear: false, reason: "add", html: "<p><b class=\"err\">Not linear</b> (additivity fails). Take $u = " + ptTex(u) + "$, $v = " + ptTex(v) + "$: $T(u+v) = " + tupTex(lhs) + "$ but $T(u)+T(v) = " + tupTex(rhs) + "$.</p>" };
      }
      return { linear: null, html: "<p>Could not decide automatically.</p>" };
    }
    // non-polynomial: numeric testing
    const z = evalMapNum(map, zero);
    if (z.some((x) => Math.abs(x) > 1e-9 || !Number.isFinite(x))) return { linear: false, reason: "zero", html: "<p><b class=\"err\">Not linear.</b> $T(" + ptTex(zero) + ") = " + tupTex(z) + "\\neq0$ (Proposition 3.1.4).</p>" };
    for (const a of scalars) for (const u of cands) {
      const lhs = evalMapNum(map, u.map((x) => x * a)), rhs = evalMapNum(map, u).map((x) => x * a);
      if (lhs.some((x, k) => Math.abs(x - rhs[k]) > 1e-7 * (1 + Math.abs(x)))) return { linear: false, reason: "hom", html: "<p><b class=\"err\">Not linear</b> (homogeneity fails). Take $\\alpha = " + numTex(a) + "$, $u = " + ptTex(u) + "$: $T(\\alpha u) = " + tupTex(lhs) + "$ but $\\alpha T(u) = " + tupTex(rhs) + "$.</p>" };
    }
    for (const u of cands) for (const v of cands) {
      const lhs = evalMapNum(map, u.map((x, k) => x + v[k])), tu = evalMapNum(map, u), tv = evalMapNum(map, v), rhs = tu.map((x, k) => x + tv[k]);
      if (lhs.some((x, k) => Math.abs(x - rhs[k]) > 1e-7 * (1 + Math.abs(x)))) return { linear: false, reason: "add", html: "<p><b class=\"err\">Not linear</b> (additivity fails). $u = " + ptTex(u) + "$, $v = " + ptTex(v) + "$: $T(u+v) = " + tupTex(lhs) + "$, $T(u)+T(v) = " + tupTex(rhs) + "$.</p>" };
    }
    return { linear: null, html: "<p>No counterexample found among test vectors — it behaves linearly on every test, but a formal proof is needed (functions like abs/sqrt/sin are usually <b>not</b> linear).</p>" };
  };

  // Generated proof of linearity from the coefficient matrix A (Frac[][])
  LA.linearityProof = function (A, vars) {
    const n = vars.length, m = A.length;
    const U = Array.from({ length: n }, (_, j) => "u_{" + (j + 1) + "}"), Vt = Array.from({ length: n }, (_, j) => "v_{" + (j + 1) + "}");
    const W = Array.from({ length: n }, (_, j) => "(\\alpha u_{" + (j + 1) + "}+\\beta v_{" + (j + 1) + "})");
    const comp = (terms) => A.map((row) => FMT.lincomb(row, terms));
    const wrap = (arr) => (m === 1 ? arr[0] : "\\big(" + arr.join(",\\;") + "\\big)");
    const domTup = n === 1 ? "\\alpha u+\\beta v" : Array.from({ length: n }, (_, j) => "\\alpha u_{" + (j + 1) + "}+\\beta v_{" + (j + 1) + "}").join(",\\,");
    return "<p><b>Proof.</b> Let $\\alpha,\\beta\\in\\R$ and $u = " + (n === 1 ? "u" : "(" + U.join(",") + ")") + "$, $v = " + (n === 1 ? "v" : "(" + Vt.join(",") + ")") + "$ " + (n === 1 ? "in $\\R$" : "in $\\R^{" + n + "}$") + ". Then</p>" +
      "$$\\begin{aligned}T(\\alpha u+\\beta v) &= T(" + domTup + ")\\\\ &= " + wrap(comp(n === 1 ? ["(\\alpha u+\\beta v)"] : W)) + "\\\\ &= \\alpha" + wrap(comp(n === 1 ? ["u"] : U)) + " + \\beta" + wrap(comp(n === 1 ? ["v"] : Vt)) + "\\\\ &= \\alpha T(u)+\\beta T(v).\\end{aligned}$$" +
      "<p>Hence, by Theorem 3.1.3, $T$ is a linear transformation. $\\square$</p>";
  };
  function mapTex(map) { return "T(" + map.vars.join(",") + ") = " + (map.comps.length === 1 ? map.comps[0].src : "(" + map.comps.map((c) => c.src).join(",\\; ") + ")"); }
  function prettyMap(A, vars) { const comps = A.map((r) => FMT.lincomb(r, vars)); return "T(" + vars.join(",") + ") = " + (comps.length === 1 ? comps[0] : "(" + comps.join(",\\;") + ")"); }

  /* ---------------- Linearity Checker ---------------- */
  const LIN_EX = ["T(x,y) = (x+y, x-y)", "T(x,y,z) = (2x-y, y+3z)", "T(x) = 1 - x", "T(x,y) = (xy, 0)", "f(x) = |x|", "g(x) = (x, 2x+1)", "T(x,y,z) = x - 3y + 5z", "T(x,y) = (x^2, y)", "h(x,y,z,w) = x + 2y + 3z + 4w", "T(x,y) = (sqrt(x^2+y^2), 0)"];
  LA.page("/labs/linearity", {
    title: "Linearity Checker", lab: "linearity", searchTitle: "Lab · Linearity Checker", searchDesc: "Decide if a map is linear: proof or counterexample",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 3</div><h1 style="margin:.1em 0 .3em">Linearity Checker</h1><p class="muted">Type any map $\\R^n\\to\\R^m$. You get either a <b>full written proof</b> that it is linear (in the format markers want) or a <b>concrete numerical counterexample</b>.</p>' +
        '<div class="card"><label class="field">Map (use x, y, z, w or x1, x2, …; functions: abs, sqrt, sin, cos, exp; |x| also works)<input type="text" id="lin" class="mono-in" value="T(x,y,z) = (2x-y, y+3z)"></label><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Check linearity</button></div><div class="presets" style="margin-top:10px">' + LIN_EX.map((e) => '<button class="chip" data-e="' + esc(e) + '">' + esc(e) + "</button>").join("") + '</div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const run = () => {
        const out = $("#out", view);
        try {
          const map = LA.parseMap($("#lin", view).value);
          const r = LA.analyseLinearity(map);
          let html = '<div class="card glow"><div class="kicker">Input</div>$$' + mapTex(map) + "$$";
          if (r.linear === true) {
            html += '<p><b class="okc">✓ Linear.</b> Every component is a combination of the variables with no constant term.</p>' + '<div class="box template" data-t="Model proof (copy this layout)">' + LA.linearityProof(r.A, map.vars) + "</div>" +
              '<div class="box tip" data-t="Bonus: the standard matrix">$$A = ' + M.tex(r.A) + ",\\qquad T(x) = Ax.$$</div>";
          } else html += r.html;
          html += "</div>";
          out.innerHTML = html; LA.enhance(out); LA.renderMath(out);
          LA.stat("practiceByType", 1, "linearity");
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; }
      };
      $("#go", view).onclick = run; $("#lin", view).addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
      $$("[data-e]", view).forEach((b) => b.onclick = () => { $("#lin", view).value = b.dataset.e; run(); });
      run();
    },
  });

  /* ---------------- Kernel / Range / Rank–Nullity ---------------- */
  LA.kernelRangeHTML = function (A, vars, opts) {
    opts = opts || {};
    const m = A.length, n = A[0].length;
    const red = ALG.rowReduce(A, { mode: "rref" });
    const pc = red.pivotCols; const free = []; for (let j = 0; j < n; j++) if (!pc.includes(j)) free.push(j);
    // general solution expressed with free variable names
    const gen = new Array(n).fill(null);
    free.forEach((f) => { gen[f] = vars[f]; });
    red.pivots.forEach(({ row, col }) => { const coeffs = free.map((f) => red.R[row][f].neg()); gen[col] = FMT.lincomb(coeffs, free.map((f) => vars[f])); });
    const ns = ALG.nullspace(A).basis.map((v) => V.integerize(v, true).vec);
    const pivCols = pc.map((j) => A.map((r) => r[j]));
    const rank = pc.length, nullity = n - rank;
    const dom = "\\R^{" + n + "}", cod = "\\R^{" + m + "}";
    const tup = (arr) => (arr.length === 1 ? arr[0] : "(" + arr.join(",\\,") + ")");
    let html = "";
    html += '<div class="box ex" data-t="Step 1 · Kernel: solve T(v) = 0">';
    html += "<p>$\\ker T = \\{" + tup(vars) + "\\in" + dom + " : T" + (n === 1 ? "(" + vars[0] + ")" : tup(vars)) + " = 0\\}$. Row-reduce the coefficient matrix:</p>";
    html += '<details class="reveal"><summary>Show every row operation</summary>' + LA.stepsHTML(red.steps, A) + "</details>";
    html += "$$" + M.tex(A) + "\\;\\longrightarrow\\;" + M.tex(red.R) + "\\quad(\\text{RREF})$$";
    if (!free.length) html += "<p>Every column has a pivot, so the only solution is $v = 0$:</p>$$\\ker T = \\{0\\},\\qquad\\Nullity(T) = 0.$$";
    else html += "<p>Pivot variables: " + pc.map((j) => "$" + vars[j] + "$").join(", ") + "; free variables: " + free.map((j) => "$" + vars[j] + "$").join(", ") + ". So</p>$$\\ker T = \\{" + tup(gen) + " : " + free.map((f) => vars[f]).join(",") + "\\in\\R\\} = \\spn\\{" + ns.map((v) => V.tex(v)).join(",\\;") + "\\},$$<p>a basis has " + nullity + " vector" + (nullity > 1 ? "s" : "") + ", so $\\Nullity(T) = " + nullity + "$.</p>";
    html += "</div>";
    html += '<div class="box ex" data-t="Step 2 · Range: span of the images of a basis">';
    html += "<p>$\\Ran T = \\spn\\{T(e_1),\\dots,T(e_{" + n + "})\\}$ = span of the columns of the matrix. The pivot columns (" + pc.map((j) => j + 1).join(", ") + ") of the <b>original</b> matrix are independent and span it:</p>";
    html += "$$\\Ran T = " + (pivCols.length ? "\\spn\\{" + pivCols.map((v) => V.tex(v)).join(",\\;") + "\\}" : "\\{0\\}") + (rank === m ? " = " + cod : "") + ",\\qquad\\Rank(T) = " + rank + ".$$</div>";
    html += '<div class="box ' + (rank + nullity === n ? "tip" : "trap") + '" data-t="Step 3 · Check with Rank–Nullity">$$\\Rank(T)+\\Nullity(T) = ' + rank + " + " + nullity + " = " + n + " = \\dim" + dom + "\\;\\checkmark$$</div>";
    html += '<div class="box exam" data-t="Step 4 · Conclusions">' +
      "<p><b>Injective?</b> " + (nullity === 0 ? '<span class="okc">Yes</span> — $\\ker T = \\{0\\}$ (Theorem 3.2.6), i.e. $T$ is non-singular.' : '<span class="err">No</span> — $\\ker T\\neq\\{0\\}$ (e.g. $T' + (n === 1 ? "(" + ns[0][0].tex() + ")" : V.tex(ns[0])) + " = 0$); $T$ is singular.") + "</p>" +
      "<p><b>Surjective?</b> " + (rank === m ? '<span class="okc">Yes</span> — $\\Rank T = ' + m + " = \\dim" + cod + "$." : '<span class="err">No</span> — $\\Rank T = ' + rank + "\\lt " + m + " = \\dim" + cod + "$.") + "</p>" +
      "<p><b>Isomorphism?</b> " + (nullity === 0 && rank === m ? '<span class="okc">Yes</span> — bijective.' : '<span class="err">No</span>.') + "</p></div>";
    return html;
  };
  const KER_EX = ["T(x,y,z) = x - 3y + 5z", "T(x,y,z,w) = (x+y-z, 2x+y+w, x+z+w)", "T(x,y) = (x, x)", "T(x) = (2x, 0, -x, 0)", "T(x,y,z) = (x+2y, y-z, x+3y-z)", "T(x,y) = (x+y, x-y)"];
  LA.page("/labs/kernel", {
    title: "Kernel · Range · Rank–Nullity", lab: "kernel", searchTitle: "Lab · Kernel, Range & Rank–Nullity", searchDesc: "Bases & dimensions of ker T and Ran T with full working",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 3</div><h1 style="margin:.1em 0 .3em">Kernel · Range · Rank–Nullity</h1><p class="muted">Enter a linear map $\\R^n\\to\\R^m$ by formula. You get the kernel and range with bases, the dimensions, the Rank–Nullity check and the injective/surjective verdicts — all with exact fractions.</p>' +
        '<div class="card"><label class="field">Linear map<input type="text" id="kin" class="mono-in" value="T(x,y,z,w) = (x+y-z, 2x+y+w, x+z+w)"></label><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Analyse</button></div><div class="presets" style="margin-top:10px">' + KER_EX.map((e) => '<button class="chip" data-e="' + esc(e) + '">' + esc(e) + "</button>").join("") + '</div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const run = () => {
        const out = $("#out", view);
        try {
          const map = LA.parseMap($("#kin", view).value); const r = LA.analyseLinearity(map);
          if (r.linear !== true) { out.innerHTML = '<div class="card">' + (r.html || "") + '<p class="muted">Kernel/range analysis needs a linear map.</p></div>'; LA.renderMath(out); return; }
          out.innerHTML = '<div class="card glow">$$' + prettyMap(r.A, map.vars) + "$$" + LA.kernelRangeHTML(r.A, map.vars) + "</div>";
          LA.enhance(out); LA.renderMath(out);
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; }
      };
      $("#go", view).onclick = run; $("#kin", view).addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
      $$("[data-e]", view).forEach((b) => b.onclick = () => { $("#kin", view).value = b.dataset.e; run(); });
      run();
    },
  });

  /* ---------------- Matrix of T relative to bases ---------------- */
  function parseVecList(src) {
    return src.split(/;|\n/).map((s) => s.trim()).filter(Boolean).map((s) => { const parts = P.splitTuple(s.startsWith("(") ? s : "(" + s + ")"); return (parts.length ? parts : [s]).map((x) => Frac.of(P.evalConst(x))); });
  }
  function parsePoly(src) { const ast = P.parse(src, ["x"]); const mp = P.toMPoly(ast, ["x"]); const c = []; mp.forEach((v, k) => { c[Number(k)] = v; }); for (let i = 0; i < c.length; i++) if (!c[i]) c[i] = Frac.ZERO; return new Poly(c); }
  LA.parsePoly = parsePoly;
  function parsePolyList(src) { return src.split(/;|\n/).map((s) => s.trim()).filter(Boolean).map(parsePoly); }

  const MAT_EX = [
    { name: "Ex 3.4.2(i) · ℝ³→ℝ²", mode: "rn", T: "T(x1,x2,x3) = (x2 - 3x1 + x3, x1 + x2)", B: "(1,0,-2); (0,0,1); (0,1,0)", C: "(0,1); (1,0)", v: "(2,1,3)" },
    { name: "Ex 3.4.4(ii) · ℝ²", mode: "rn", T: "T(x,y) = (x+y, x-y)", B: "(1,0); (0,1)", C: "(1,1); (-1,1)", v: "" },
    { name: "Ex 3.4.4(iii) · ℙ₂", mode: "poly", T: "p' - 4p", n: 2, m: 2, B: "1 - x; x; x^2", C: "1; x; x^2 - 1", v: "3 - 2x - x^2" },
    { name: "Exercise 3.4 Q1(i)", mode: "rn", T: "T(x,y,z) = (x - y, x + z)", B: "(1,0,1); (0,1,1); (0,0,-1)", C: "(1,-1); (0,2)", v: "" },
    { name: "Exercise 3.4 Q2 · d²/dx²", mode: "poly", T: "p''", n: 3, m: 1, B: "1; x; x^2; x^3 - x", C: "1; x", v: "28x^3 + 15x^2 - 2x - 1" },
    { name: "Mock A Q3 · ℙ₂→ℙ₁", mode: "poly", T: "p' + p(1)", n: 2, m: 1, B: "1; 1 + x; x^2", C: "1; 1 - x", v: "2 - x + 3x^2" },
    { name: "Ex 3.4.2(ii) (not linear!)", mode: "poly", T: "p(0) p' + 4x p", n: 2, m: 3, B: "1 - x; x + x^2; x^2", C: "1; x^3; x^2; 2x", v: "" },
  ];
  LA.page("/labs/matrix", {
    title: "Matrix of T w.r.t. Bases", lab: "matrix", searchTitle: "Lab · Matrix of T relative to bases", searchDesc: "Build [T]_B^C step by step for ℝⁿ or polynomial spaces",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 3.4</div><h1 style="margin:.1em 0 .3em">Matrix of T relative to bases</h1><p class="muted">Builds $[T]^{\\Cc}_{\\B}$ column by column — images, coordinates (one row reduction for all columns), the matrix — and optionally uses $[T(v)]_{\\Cc} = [T]^{\\Cc}_{\\B}[v]_{\\B}$.</p>' +
        '<div class="card"><div class="presets" style="margin-bottom:10px">' + MAT_EX.map((e, i) => '<button class="chip" data-x="' + i + '">' + e.name + "</button>").join("") + '</div>' +
        '<div class="row"><label class="toggle"><input type="radio" name="mode" value="rn" checked> ℝⁿ → ℝᵐ</label><label class="toggle"><input type="radio" name="mode" value="poly"> ℙₙ → ℙₘ (T in terms of p, p\', p\'\', p(a), int(a,b), x)</label></div>' +
        '<label class="field" style="margin-top:10px">T<input type="text" id="mT" class="mono-in"></label>' +
        '<div class="field-row hidden" id="degRow" style="margin-top:10px"><label class="field">domain ℙₙ: n =<input type="number" id="mn" min="0" max="6" value="2" style="width:80px"></label><label class="field">codomain ℙₘ: m =<input type="number" id="mm" min="0" max="8" value="2" style="width:80px"></label></div>' +
        '<div class="grid grid-2" style="margin-top:10px"><label class="field">Domain basis B (separate with ;)<input type="text" id="mB" class="mono-in"></label><label class="field">Codomain basis C (separate with ;)<input type="text" id="mC" class="mono-in"></label></div>' +
        '<label class="field" style="margin-top:10px">Optional: vector/polynomial v to evaluate via the matrix<input type="text" id="mv" class="mono-in"></label>' +
        '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Build the matrix</button></div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const load = (e) => { $$("input[name=mode]", view).forEach((r) => { r.checked = r.value === e.mode; }); $("#mT", view).value = e.T; $("#mB", view).value = e.B; $("#mC", view).value = e.C; $("#mv", view).value = e.v || ""; if (e.mode === "poly") { $("#mn", view).value = e.n; $("#mm", view).value = e.m; } $("#degRow", view).classList.toggle("hidden", e.mode !== "poly"); };
      $$("input[name=mode]", view).forEach((r) => r.onchange = () => $("#degRow", view).classList.toggle("hidden", r.value !== "poly" || !r.checked));
      $$("[data-x]", view).forEach((b) => b.onclick = () => { load(MAT_EX[Number(b.dataset.x)]); run(); });
      const run = () => {
        const out = $("#out", view);
        try {
          const mode = $$("input[name=mode]", view).find((r) => r.checked).value;
          out.innerHTML = '<div class="card glow">' + (mode === "rn" ? runRn() : runPoly()) + "</div>";
          LA.enhance(out); LA.renderMath(out);
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; }
      };
      const runRn = () => {
        const map = LA.parseMap($("#mT", view).value); const r = LA.analyseLinearity(map);
        if (r.linear !== true) return (r.html || "") + '<p class="muted">The matrix of a map is only defined for linear maps.</p>';
        const A = r.A, n = A[0].length, m = A.length;
        const B = parseVecList($("#mB", view).value), C = parseVecList($("#mC", view).value);
        if (B.length !== n || B.some((b) => b.length !== n)) throw new Error("B must contain " + n + " vectors with " + n + " entries each.");
        if (C.length !== m || C.some((c) => c.length !== m)) throw new Error("C must contain " + m + " vectors with " + m + " entries each.");
        if (ALG.det(M.fromCols(B)).isZero()) throw new Error("B is not a basis (its vectors are dependent).");
        if (ALG.det(M.fromCols(C)).isZero()) throw new Error("C is not a basis (its vectors are dependent).");
        const imgs = B.map((b) => M.mulVec(A, b));
        const res = ALG.coordsMany(C, imgs);
        let h = "$$" + prettyMap(A, map.vars) + "$$";
        h += '<div class="box ex" data-t="Step 1 · Images of the domain basis B">$$\\begin{aligned}' + B.map((b, i) => "T" + V.tex(b) + " &= " + (imgs[i].length === 1 ? imgs[i][0].tex() : V.tex(imgs[i]))).join("\\\\") + "\\end{aligned}$$</div>";
        h += '<div class="box ex" data-t="Step 2 · Coordinates in C (one row reduction for all columns)"><p>Row-reduce $\\big(\\,C\\;\\big|\\;T(v_1)\\cdots T(v_' + n + ")\\,\\big)$ — the right block becomes the answer:</p>" + '<details class="reveal"><summary>Show every row operation</summary>' + LA.stepsHTML(res.red.steps, res.aug, { aug: m }) + "</details>$$" + M.tex(res.aug, { aug: m }) + "\\;\\longrightarrow\\;" + M.tex(res.red.R, { aug: m }) + "$$" +
          "$$\\begin{aligned}" + imgs.map((im, i) => (im.length === 1 ? im[0].tex() : V.tex(im)) + " &= " + FMT.combTex(res.coords[i], C.map((c) => V.tex(c)))).join("\\\\") + "\\end{aligned}$$</div>";
        const Mat = M.fromCols(res.coords);
        h += '<div class="box thm" data-t="Step 3 · The matrix (coordinates as columns)">$$[T]^{\\Cc}_{\\B} = ' + M.tex(Mat) + "$$</div>";
        const vs = $("#mv", view).value.trim();
        if (vs) {
          const v = parseVecList(vs)[0]; if (v.length !== n) throw new Error("v must have " + n + " entries.");
          const cv = ALG.coordsMany(B, [v]).coords[0]; const out = M.mulVec(Mat, cv); const back = C[0].map((_, k) => out.reduce((s, c, i) => s.add(c.mul(C[i][k])), Frac.ZERO));
          h += '<div class="box tip" data-t="Step 4 · Use the matrix: [T(v)]_C = [T]_B^C [v]_B">$$[v]_{\\B} = ' + V.tex(cv, { col: true }) + ",\\qquad [T(v)]_{\\Cc} = " + M.tex(Mat) + V.tex(cv, { col: true }) + " = " + V.tex(out, { col: true }) + "$$$$T(v) = " + FMT.combTex(out, C.map((c) => V.tex(c))) + " = " + (back.length === 1 ? back[0].tex() : V.tex(back)) + "\\quad\\checkmark\\;(\\text{direct: } " + (back.length === 1 ? M.mulVec(A, v)[0].tex() : V.tex(M.mulVec(A, v))) + ")$$</div>";
        }
        return h;
      };
      const runPoly = () => {
        const n = Number($("#mn", view).value), m = Number($("#mm", view).value);
        const ast = P.parse($("#mT", view).value, [], { polyMode: true });
        const T = (p) => P.evalPolyOp(ast, p);
        const B = parsePolyList($("#mB", view).value), C = parsePolyList($("#mC", view).value);
        if (B.length !== n + 1) throw new Error("B must contain " + (n + 1) + " polynomials (dim ℙ" + n + " = " + (n + 1) + ").");
        if (C.length !== m + 1) throw new Error("C must contain " + (m + 1) + " polynomials (dim ℙ" + m + " = " + (m + 1) + ").");
        if (B.some((b) => b.deg() > n)) throw new Error("A vector of B has degree > " + n + ".");
        if (C.some((c) => c.deg() > m)) throw new Error("A vector of C has degree > " + m + ".");
        const Bv = B.map((b) => b.coeffVec(n)), Cv = C.map((c) => c.coeffVec(m));
        if (ALG.det(M.fromCols(Bv)).isZero()) throw new Error("B is not a basis of ℙ" + n + ".");
        if (ALG.det(M.fromCols(Cv)).isZero()) throw new Error("C is not a basis of ℙ" + m + ".");
        // linearity test
        const tests = [[new Poly([1]), Poly.X()], [new Poly([1, 1]), new Poly([0, 0, 1])], [new Poly([2, -1, 1]), new Poly([-1, 3])]];
        let nonlin = null;
        for (const [p, q] of tests) { const l = T(p.add(q)), r = T(p).add(T(q)); if (!l.eq(r)) { nonlin = { p, q, l, r }; break; } const l2 = T(p.scale(2)), r2 = T(p).scale(2); if (!l2.eq(r2)) { nonlin = { p, q: null, l: l2, r: r2 }; break; } }
        let h = "$$T(p) = " + esc($("#mT", view).value) + "$$";
        if (nonlin) h += '<div class="box trap" data-t="Warning: this T is NOT linear">' + (nonlin.q ? "<p>$T(" + nonlin.p.tex() + " + " + nonlin.q.tex() + ") = " + nonlin.l.tex() + "$ but $T(" + nonlin.p.tex() + ")+T(" + nonlin.q.tex() + ") = " + nonlin.r.tex() + "$.</p>" : "<p>$T(2(" + nonlin.p.tex() + ")) = " + nonlin.l.tex() + "\\neq" + nonlin.r.tex() + " = 2T(" + nonlin.p.tex() + ")$.</p>") + "<p>The computation below follows the method, but strictly a matrix only represents a linear map.</p></div>";
        const imgs = B.map((b) => T(b));
        imgs.forEach((im) => { if (im.deg() > m) throw new Error("T(" + "…) = " + im.toString() + " has degree > " + m + "; choose a larger codomain ℙₘ."); });
        const res = ALG.coordsMany(Cv, imgs.map((p) => p.coeffVec(m)));
        h += '<div class="box ex" data-t="Step 1 · Images of the domain basis">$$\\begin{aligned}' + B.map((b, i) => "T(" + b.tex() + ") &= " + imgs[i].tex()).join("\\\\") + "\\end{aligned}$$</div>";
        h += '<div class="box ex" data-t="Step 2 · Write each image in the basis C">$$\\begin{aligned}' + imgs.map((im, i) => im.tex() + " &= " + FMT.combTex(res.coords[i], C.map((c) => "(" + c.tex() + ")"))).join("\\\\") + "\\end{aligned}$$" + '<details class="reveal"><summary>How the coordinates were found (coefficient matching)</summary><p>Using coefficient vectors (constant term first), row-reduce $\\big(C\\,|\\,T(v_1)\\cdots\\big)$:</p>$$' + M.tex(res.aug, { aug: m + 1 }) + "\\;\\longrightarrow\\;" + M.tex(res.red.R, { aug: m + 1 }) + "$$</details></div>";
        const Mat = M.fromCols(res.coords);
        h += '<div class="box thm" data-t="Step 3 · The matrix">$$[T]^{\\Cc}_{\\B} = ' + M.tex(Mat) + "$$</div>";
        const vs = $("#mv", view).value.trim();
        if (vs) {
          const p = parsePoly(vs); if (p.deg() > n) throw new Error("v has degree > " + n);
          const cp = ALG.coordsMany(Bv, [p.coeffVec(n)]).coords[0]; const outc = M.mulVec(Mat, cp);
          const back = outc.reduce((s, c, i) => s.add(C[i].scale(c)), new Poly([]));
          h += '<div class="box tip" data-t="Step 4 · Use the matrix">$$p = ' + p.tex() + " = " + FMT.combTex(cp, B.map((b) => "(" + b.tex() + ")")) + "\\;\\Rightarrow\\;[p]_{\\B} = " + V.tex(cp, { col: true }) + "$$$$[T(p)]_{\\Cc} = " + M.tex(Mat) + V.tex(cp, { col: true }) + " = " + V.tex(outc, { col: true }) + "\\;\\Rightarrow\\;T(p) = " + FMT.combTex(outc, C.map((c) => "(" + c.tex() + ")")) + " = " + back.tex() + "$$<p>Direct check: $T(p) = " + T(p).tex() + "$ " + (T(p).eq(back) ? "✔" : "(differs — T is not linear)") + "</p></div>";
        }
        return h;
      };
      load(MAT_EX[0]); run();
      $("#go", view).onclick = run;
    },
  });
})();
