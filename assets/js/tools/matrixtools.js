/* Matrix labs: Row Reduction Stepper, Determinant Lab, Eigen Lab (exact arithmetic) */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc, Frac, QNum, Poly, V, M } = LA;
  const N = LA.num, ALG = LA.alg, FMT = LA.fmt, P = LA.parse;

  LA.parseMatrix = function (src) {
    const rows = src.trim().split(/\n|;/).map((r) => r.trim()).filter(Boolean).map((r) => r.replace(/^[[(]|[\])]$/g, "").split(/[\s,]+/).filter(Boolean).map((x) => Frac.of(P.evalConst(x))));
    if (!rows.length) throw new Error("Enter a matrix: one row per line, entries separated by spaces or commas.");
    const n = rows[0].length; if (rows.some((r) => r.length !== n)) throw new Error("All rows must have the same number of entries.");
    return rows;
  };
  const matArea = (id, val, rows) => '<textarea id="' + id + '" class="mono-in" rows="' + (rows || 4) + '" spellcheck="false">' + val + "</textarea>";

  /* ================= Row Reduction Stepper ================= */
  const RREF_EX = [["Ex 5.1.17(i)", "1 2 4\n2 6 -4\n1 1 1", ""], ["Ex 5.1.17(ii)", "0 -1 0 3\n6 5 1 5\n5 4 1 2", ""], ["Ex 5.2.5", "1 5 2 1\n4 3 2 1\n1 4 2 1", ""], ["Exercise 5 Q1(ii)", "1 5 2 6\n3 2 2 -1\n4 -2 1 1", ""], ["System (augmented)", "1 1 1 6\n2 -1 1 3\n1 2 -1 2", "3"], ["Inconsistent system", "1 2 3\n2 4 7", "2"]];
  LA.page("/labs/rref", {
    title: "Row Reduction Stepper", lab: "rref", searchTitle: "Lab · Row Reduction Stepper", searchDesc: "REF/RREF with every row operation, rank, nullity, bases, inverse",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 5</div><h1 style="margin:.1em 0 .3em">Row Reduction Stepper</h1><p class="muted">Every row operation written in the notes\' notation ($R_2\\to R_2-2R_1$), with exact fractions. Also gives rank, nullity, bases for the row/column/null spaces, solutions of augmented systems and inverses.</p>' +
        '<div class="card"><div class="presets" style="margin-bottom:10px">' + RREF_EX.map((e, i) => '<button class="chip" data-x="' + i + '">' + e[0] + "</button>").join("") + '</div><div class="grid grid-2"><label class="field">Matrix (one row per line)' + matArea("rIn", RREF_EX[0][1], 5) + '</label><div class="stack"><label class="field">Augmented? bar after column (blank = no)<input type="text" id="rAug" class="mono-in" style="width:120px"></label><div class="row"><label class="toggle"><input type="radio" name="rmode" value="rref" checked> RREF (Gauss–Jordan)</label><label class="toggle"><input type="radio" name="rmode" value="ref"> REF (Gauss)</label></div><label class="toggle"><input type="checkbox" id="rInv"> Also find the inverse (square matrices)</label></div></div><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Row-reduce</button></div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const run = () => {
        const out = $("#out", view);
        try {
          const A = LA.parseMatrix($("#rIn", view).value); const m = A.length, n = A[0].length;
          const augS = $("#rAug", view).value.trim(); const aug = augS ? Number(augS) : null;
          if (aug !== null && !(aug >= 1 && aug < n)) throw new Error("Bar position must be between 1 and " + (n - 1));
          const mode = $$("input[name=rmode]", view).find((r) => r.checked).value;
          const red = ALG.rowReduce(A, { mode, stopCol: aug || n });
          let h = '<div class="card glow"><div class="kicker">' + (mode === "rref" ? "Gauss–Jordan elimination" : "Gauss elimination") + "</div>" + LA.stepsHTML(red.steps, A, { aug });
          const coeffN = aug || n; const rank = red.rank;
          h += '<div class="box thm" data-t="Summary">';
          if (aug) {
            const inconsistent = red.R.some((r) => r.slice(0, coeffN).every((x) => x.isZero()) && r.slice(coeffN).some((x) => !x.isZero()));
            if (inconsistent) h += '<p><b class="err">Inconsistent</b> — a row reads $0 = c$ with $c\\neq0$. No solution.</p>';
            else if (rank === coeffN && mode === "rref") { h += '<p><b class="okc">Unique solution:</b> $' + red.pivots.map((p) => "x_{" + (p.col + 1) + "} = " + red.R[p.row][coeffN].tex()).join(",\\; ") + "$</p>"; }
            else if (rank === coeffN) h += "<p>Unique solution (switch to RREF to read it off).</p>";
            else h += "<p><b>Infinitely many solutions</b> — " + (coeffN - rank) + " free variable(s).</p>";
          }
          const Acoef = A.map((r) => r.slice(0, coeffN));
          const ns = ALG.nullspace(Acoef).basis.map((v) => V.integerize(v, true).vec);
          const rref = ALG.rowReduce(Acoef, { mode: "rref" });
          h += "<p>$\\Rank = " + rank + "$, $\\;\\Nullity = " + coeffN + " - " + rank + " = " + (coeffN - rank) + "$.</p>";
          h += "<p>Basis of the row space (non-zero rows of the echelon form): $\\{" + red.R.filter((r) => r.slice(0, coeffN).some((x) => !x.isZero())).map((r) => V.tex(r.slice(0, coeffN))).join(",\\;") + "\\}$</p>";
          h += "<p>Basis of the column space (pivot columns of the original): $\\{" + rref.pivotCols.map((j) => V.tex(Acoef.map((r) => r[j]), { T: true })).join(",\\;") + "\\}$</p>";
          h += "<p>Basis of the null space: " + (ns.length ? "$\\{" + ns.map((v) => V.tex(v, { T: true })).join(",\\;") + "\\}$" : "$\\emptyset$ (null space $=\\{0\\}$)") + "</p></div>";
          if ($("#rInv", view).checked) {
            if (m !== n || aug) h += '<p class="muted">Inverse: needs a square, non-augmented matrix.</p>';
            else {
              const big = A.map((r, i) => r.concat(M.eye(n)[i])); const r2 = ALG.rowReduce(big, { mode: "rref", stopCol: n });
              h += '<div class="box ex" data-t="Inverse via [A | I] → [I | A⁻¹]">' + '<details class="reveal"><summary>Show every step</summary>' + LA.stepsHTML(r2.steps, big, { aug: n }) + "</details>";
              h += r2.rank < n ? '<p class="err">A zero row appeared on the left: $A$ is not invertible.</p>' : "$$A^{-1} = " + M.tex(r2.R.map((r) => r.slice(n))) + "$$";
              h += "</div>";
            }
          }
          out.innerHTML = h + "</div>"; LA.enhance(out); LA.renderMath(out);
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; }
      };
      $$("[data-x]", view).forEach((b) => b.onclick = () => { const e = RREF_EX[Number(b.dataset.x)]; $("#rIn", view).value = e[1]; $("#rAug", view).value = e[2]; run(); });
      $("#go", view).onclick = run; run();
    },
  });

  /* ================= Determinant Lab ================= */
  function cofactorTex(A, depth) {
    const n = A.length;
    if (n === 1) return { val: A[0][0], tex: A[0][0].tex() };
    if (n === 2) { const v = A[0][0].mul(A[1][1]).sub(A[0][1].mul(A[1][0])); return { val: v, tex: "(" + A[0][0].tex() + ")(" + A[1][1].tex() + ") - (" + A[0][1].tex() + ")(" + A[1][0].tex() + ") = " + v.tex() }; }
    // choose row/col with most zeros
    let best = { type: "row", i: 0, z: -1 };
    for (let i = 0; i < n; i++) { const zr = A[i].filter((x) => x.isZero()).length; if (zr > best.z) best = { type: "row", i, z: zr }; const zc = A.map((r) => r[i]).filter((x) => x.isZero()).length; if (zc > best.z) best = { type: "col", i, z: zc }; }
    const terms = []; let val = Frac.ZERO; const sub = [];
    for (let k = 0; k < n; k++) {
      const [r, c] = best.type === "row" ? [best.i, k] : [k, best.i];
      const a = A[r][c]; if (a.isZero()) continue;
      const minor = A.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
      const sign = (r + c) % 2 === 0 ? 1 : -1;
      const md = ALG.det(minor);
      val = val.add(a.mul(md).mul(sign));
      terms.push((sign > 0 ? "+" : "-") + "(" + a.tex() + ")" + M.tex(minor, { env: "vmatrix" }));
      sub.push({ a, sign, md, minor, r, c });
    }
    return { val, best, terms, sub };
  }
  const DET_EX = [["Ex 6.1.9 (4×4)", "1 3 6 2\n0 4 1 3\n1 6 4 4\n-1 1 2 3"], ["Ex 6.2.5", "1 2 6\n1 5 1\n4 3 1"], ["Exercise 6(a)", "1 -6 5\n4 3 3\n3 4 1"], ["Exercise 6(b)", "1 4 3 3\n2 5 3 4\n1 2 3 4\n1 1 1 1"], ["Exercise 6(c)", "5 4 0 2\n0 0 2 3\n1 2 4 3\n8 1 -1 -1"], ["Singular", "1 2 3\n4 5 6\n7 8 9"]];
  LA.page("/labs/det", {
    title: "Determinant Lab", lab: "det", searchTitle: "Lab · Determinant Lab", searchDesc: "Cofactor expansion and row reduction, step by step",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 6</div><h1 style="margin:.1em 0 .3em">Determinant Lab</h1><p class="muted">Two methods side by side: <b>cofactor expansion</b> along the row/column with the most zeros, and <b>row reduction</b> to triangular form (tracking swaps). For $3\\times3$ you also get the 6-term permutation formula.</p>' +
        '<div class="card"><div class="presets" style="margin-bottom:10px">' + DET_EX.map((e, i) => '<button class="chip" data-x="' + i + '">' + e[0] + "</button>").join("") + '</div><label class="field">Square matrix' + matArea("dIn", DET_EX[0][1], 5) + '</label><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Compute det</button></div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const run = () => {
        const out = $("#out", view);
        try {
          const A = LA.parseMatrix($("#dIn", view).value); const n = A.length; if (A[0].length !== n) throw new Error("The matrix must be square.");
          if (n > 6) throw new Error("Up to 6×6, please.");
          const d = ALG.det(A);
          let h = '<div class="card glow"><div class="row spread"><div>$$\\det' + M.tex(A) + " = " + d.tex() + "$$</div><span class=\"chip " + (d.isZero() ? "red" : "lime") + '">' + (d.isZero() ? "singular — not invertible, columns dependent" : "non-singular — invertible, columns independent") + "</span></div>";
          if (n >= 3) {
            const cf = cofactorTex(A);
            h += '<div class="box ex" data-t="Method 1 · Cofactor expansion along ' + cf.best.type + " " + (cf.best.i + 1) + ' (most zeros)">$$\\det A = ' + cf.terms.join(" ") + "$$<p>" + cf.sub.map((s) => "$M_{" + (s.r + 1) + (s.c + 1) + "} = " + s.md.tex() + "$").join(", ") + "</p>$$\\det A = " + cf.sub.map((s) => (s.sign > 0 ? "+" : "-") + "(" + s.a.tex() + ")(" + s.md.tex() + ")").join(" ") + " = " + cf.val.tex() + "$$</div>";
          } else h += '<div class="box ex" data-t="2×2 formula">$$\\det A = ' + cofactorTex(A).tex + "$$</div>";
          // Method 2: elimination with swaps only (no scaling)
          const B = A.map((r) => r.slice()); let sign = 1; const steps = [];
          for (let c = 0; c < n; c++) {
            let p = -1; for (let i = c; i < n; i++) if (!B[i][c].isZero()) { p = i; break; }
            if (p === -1) { steps.push({ ops: ["\\text{column } " + (c + 1) + "\\text{ has no pivot} \\Rightarrow \\det = 0"], M: B.map((r) => r.slice()) }); break; }
            if (p !== c) { const t = B[p]; B[p] = B[c]; B[c] = t; sign = -sign; steps.push({ ops: [ALG.opSwap(c, p) + "\\;(\\times -1)"], M: B.map((r) => r.slice()) }); }
            const ops = [];
            for (let i = c + 1; i < n; i++) { if (B[i][c].isZero()) continue; const f = B[i][c].div(B[c][c]).neg(); B[i] = B[i].map((x, j) => x.add(B[c][j].mul(f))); ops.push(ALG.opAdd(i, f, c)); }
            if (ops.length) steps.push({ ops, M: B.map((r) => r.slice()) });
          }
          const diag = B.map((r, i) => r[i]);
          h += '<div class="box ex" data-t="Method 2 · Row reduction (only swaps and Rᵢ → Rᵢ + cRⱼ)">' + LA.stepsHTML(steps, A) + "$$\\det A = " + (sign < 0 ? "-" : "") + diag.map((x) => "(" + x.tex() + ")").join("") + " = " + d.tex() + "$$</div>";
          if (n === 3) {
            const perms = [[[0, 1, 2], 1, "e"], [[1, 2, 0], 1, "(1\\,2\\,3)"], [[2, 0, 1], 1, "(1\\,3\\,2)"], [[1, 0, 2], -1, "(1\\,2)"], [[2, 1, 0], -1, "(1\\,3)"], [[0, 2, 1], -1, "(2\\,3)"]];
            h += '<div class="box beyond" data-t="Permutation formula (Definition 6.1.4)"><div class="tbl-wrap"><table class="tbl"><tr><th>σ</th><th>sign</th><th>term</th></tr>' + perms.map((p) => { const v = A[0][p[0][0]].mul(A[1][p[0][1]]).mul(A[2][p[0][2]]); return "<tr><td>$" + p[2] + "$</td><td>$" + (p[1] > 0 ? "+1" : "-1") + "$</td><td>$a_{1" + (p[0][0] + 1) + "}a_{2" + (p[0][1] + 1) + "}a_{3" + (p[0][2] + 1) + "} = " + v.tex() + "$</td></tr>"; }).join("") + "</table></div></div>";
          }
          out.innerHTML = h + "</div>"; LA.enhance(out); LA.renderMath(out);
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; }
      };
      $$("[data-x]", view).forEach((b) => b.onclick = () => { $("#dIn", view).value = DET_EX[Number(b.dataset.x)][1]; run(); });
      $("#go", view).onclick = run; run();
    },
  });

  /* ================= Eigen Lab ================= */
  function quadRoots(q) { // q: Poly degree 2 → [QNum, QNum]
    const a = q.coef(2), b = q.coef(1), c = q.coef(0);
    const disc = b.mul(b).sub(a.mul(c).mul(4));
    const neg = disc.sign() < 0; const ad = disc.abs();
    const { s, r } = N.squareSplit(ad.n * ad.d); // √(n/d) = √(n d)/d = s√r/d
    const re = b.neg().div(a.mul(2)); const im = new Frac(s, ad.d).div(a.mul(2).abs());
    const D = neg ? -r : r;
    if (!neg && r === 1n) return [re.add(im), re.sub(im)].map((x) => QNum.of(x, 1));
    return [new QNum(re, im, D), new QNum(re, im.neg(), D)];
  }
  const EIG_EX = [["Ex 7.1.5(i)", "1 2\n2 -2"], ["Ex 7.1.5(ii) (repeated)", "2 0\n-1 2"], ["Ex 7.1.5(iii) (complex)", "3 0 0\n4 0 1\n3 -1 0"], ["Ex 7.3.4(i) (not diag.)", "1 1\n0 1"], ["Ex 7.3.7(ii) (inverse)", "1 2 -1\n2 4 3\n-1 1 1"], ["Exercise 7(a)", "1 3\n-3 1"], ["Exercise 7(b)", "4 -2\n-3 4"], ["Exercise 7(d)", "1 4 2\n0 0 4\n0 0 9"], ["Symmetric", "3 1\n1 3"]];
  LA.page("/labs/eigen", {
    title: "Eigen Lab", lab: "eigen", searchTitle: "Lab · Eigen Lab", searchDesc: "Characteristic polynomial, eigenvalues, eigenspaces, diagonalization, Cayley–Hamilton",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 7</div><h1 style="margin:.1em 0 .3em">Eigen Lab</h1><p class="muted">Characteristic polynomial, exact eigenvalues (including surds and complex numbers), eigenspaces with algebraic & geometric multiplicities, $P$ and $D$, and the inverse via Cayley–Hamilton.</p>' +
        '<div class="card"><div class="presets" style="margin-bottom:10px">' + EIG_EX.map((e, i) => '<button class="chip" data-x="' + i + '">' + e[0] + "</button>").join("") + '</div><label class="field">2×2 or 3×3 matrix' + matArea("eIn", EIG_EX[0][1], 3) + '</label><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Analyse</button></div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const run = () => {
        const out = $("#out", view);
        try {
          const A = LA.parseMatrix($("#eIn", view).value); const n = A.length; if (A[0].length !== n || n < 2 || n > 3) throw new Error("Enter a 2×2 or 3×3 matrix.");
          const p = ALG.charPoly(A); const lam = (poly) => poly.tex({ v: "\\lambda", desc: true });
          let h = '<div class="card glow">$$A = ' + M.tex(A) + "$$";
          const tr = A.reduce((s, r, i) => s.add(r[i]), Frac.ZERO), d = ALG.det(A);
          h += '<div class="box ex" data-t="Step 1 · Characteristic polynomial">$$p_A(\\lambda) = \\det(A-\\lambda I) = ' + M.tex(A.map((r, i) => r.map((x, j) => (i === j ? { tex: () => x.tex() + "-\\lambda" } : x))), { env: "vmatrix" }) + " = " + lam(p) + "$$";
          h += "<p class=\"small muted\">Check: " + (n === 2 ? "$\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det A$ with $\\operatorname{tr}A = " + tr.tex() + "$, $\\det A = " + d.tex() + "$." : "$-\\lambda^3 + \\operatorname{tr}(A)\\lambda^2 - (M_{11}+M_{22}+M_{33})\\lambda + \\det A$ with $\\operatorname{tr}A = " + tr.tex() + "$, $\\det A = " + d.tex() + "$.") + "</p></div>";
          // roots
          const rr = ALG.rationalRoots(p); const eig = []; // {val: Frac|QNum, alg}
          rr.roots.forEach((r) => { const e = eig.find((x) => x.val instanceof Frac && x.val.eq(r)); if (e) e.alg++; else eig.push({ val: r, alg: 1 }); });
          let numeric = null;
          if (rr.rest.deg() === 2) quadRoots(rr.rest).forEach((q) => { if (q.D === 1n || q.b.isZero()) { const r = q.a; const e = eig.find((x) => x.val instanceof Frac && x.val.eq(r)); if (e) e.alg++; else eig.push({ val: r, alg: 1 }); } else eig.push({ val: q, alg: 1 }); });
          else if (rr.rest.deg() === 3) { // numeric fallback
            const c = rr.rest.c.map((x) => x.toNumber()); numeric = [];
            const f = (x) => ((c[3] * x + c[2]) * x + c[1]) * x + c[0];
            for (let x0 = -50; x0 < 50; x0 += 0.25) { let a = x0, b = x0 + 0.25; if (f(a) === 0) numeric.push(a); else if (f(a) * f(b) < 0) { for (let k = 0; k < 80; k++) { const mm = (a + b) / 2; if (f(a) * f(mm) <= 0) b = mm; else a = mm; } numeric.push((a + b) / 2); } }
          }
          const factorTex = (() => {
            let s = (p.coef(p.deg()).sign() < 0 ? "-" : "");
            const fr = eig.filter((e) => e.val instanceof Frac).map((e) => (e.val.isZero() ? "\\lambda" : "(\\lambda" + (e.val.sign() < 0 ? "+" + e.val.neg().tex() : "-" + e.val.tex()) + ")") + (e.alg > 1 ? "^{" + e.alg + "}" : ""));
            const rest = rr.rest.deg() >= 2 ? "(" + lam(rr.rest.scale(rr.rest.coef(rr.rest.deg()).inv())) + ")" : "";
            return s + fr.join("") + rest;
          })();
          h += '<div class="box ex" data-t="Step 2 · Eigenvalues">$$p_A(\\lambda) = ' + factorTex + " = 0\\;\\Rightarrow\\;" + (eig.length ? eig.map((e) => "\\lambda = " + e.val.tex() + (e.alg > 1 ? "\\;(\\times" + e.alg + ")" : "")).join(",\\quad ") : "") + (numeric ? (eig.length ? ",\\quad " : "") + numeric.map((x) => "\\lambda\\approx" + x.toFixed(4)).join(",\\;") : "") + "$$" +
            '<p class="small muted">Checks: sum $= \\operatorname{tr}A = ' + tr.tex() + "$, product $= \\det A = " + d.tex() + "$.</p></div>";
          // eigenspaces
          let allGeoEq = true, realOnly = true; const Pcols = [], Dvals = [];
          eig.forEach((e) => {
            const isQ = e.val instanceof QNum; if (isQ && e.val.D < 0n) realOnly = false;
            const Dd = isQ ? e.val.D : 1n;
            const Ash = A.map((r, i) => r.map((x, j) => { const q = isQ ? QNum.of(x, Dd) : x; return i === j ? q.sub(e.val) : q; }));
            const ns = ALG.nullspace(Ash);
            const basis = ns.basis.map((v) => (isQ ? v : V.integerize(v, true).vec));
            const geo = basis.length; if (geo !== e.alg) allGeoEq = false;
            basis.forEach((b) => { Pcols.push(b); Dvals.push(e.val); });
            h += '<div class="box ex" data-t="Eigenspace for $\\lambda = ' + e.val.tex() + '$">$$A - (' + e.val.tex() + ")I = " + M.tex(Ash) + "\\;\\longrightarrow\\;" + M.tex(ns.red.R) + "$$" +
              "$$\\Null(A-\\lambda I) = \\spn\\{" + basis.map((b) => "(" + b.map((x) => x.tex()).join(",\\,") + ")^T").join(",\\;") + "\\}$$<p>Algebraic multiplicity " + e.alg + ", geometric multiplicity " + geo + (geo < e.alg ? ' — <b class="err">deficient</b>' : "") + ".</p></div>";
          });
          if (numeric) h += '<div class="box note" data-t="Irrational eigenvalues">Eigenvalues are roots of an irreducible cubic; they are shown numerically. They are distinct, so $A$ is diagonalizable over $\\C$.</div>';
          if (!numeric) {
            const diagC = allGeoEq, diagR = allGeoEq && realOnly;
            h += '<div class="box thm" data-t="Step 3 · Diagonalization">' + "<p>Over $\\R$: " + (diagR ? '<b class="okc">diagonalizable</b>' : '<b class="err">not diagonalizable</b>' + (!realOnly ? " (complex eigenvalues)" : " (an eigenvalue is deficient)")) + ". &nbsp; Over $\\C$: " + (diagC ? '<b class="okc">diagonalizable</b>' : '<b class="err">not diagonalizable</b>') + ".</p>" +
              (diagC ? "$$P = " + M.tex(M.fromCols(Pcols)) + ",\\qquad D = P^{-1}AP = " + M.tex(Dvals.map((v, i) => Dvals.map((_, j) => (i === j ? v : Frac.ZERO)))) + "$$" : "<p>There are fewer than " + n + " independent eigenvectors, so no invertible $P$ makes $P^{-1}AP$ diagonal (Theorem 7.3.2).</p>") + "</div>";
          }
          // Cayley–Hamilton inverse
          if (!d.isZero()) {
            const c = p.c; // p(λ) = Σ c_k λ^k, c0 = det A
            let S = M.zeros(n, n), Ak = M.eye(n);
            for (let k = 1; k <= n; k++) { S = M.add(S, M.scale(c[k] || Frac.ZERO, Ak)); Ak = M.mul(Ak, A); }
            const inv = M.scale(c[0].inv().neg(), S);
            const polyTerms = []; for (let k = n; k >= 1; k--) if (c[k] && !c[k].isZero()) polyTerms.push({ c: c[k], k });
            h += '<div class="box recipe" data-t="Step 4 · Inverse via Cayley–Hamilton">$$p_A(A) = ' + lam(p).replace(/\\lambda/g, "A").replace(/(\d)$/, "$1I") + " = 0$$" +
              "$$\\Rightarrow\\;A^{-1} = -\\frac{1}{" + c[0].tex() + "}\\Big(" + FMT.lincomb(polyTerms.map((t) => t.c), polyTerms.map((t) => (t.k - 1 === 0 ? "I" : t.k - 1 === 1 ? "A" : "A^{" + (t.k - 1) + "}"))) + "\\Big) = " + M.tex(inv) + "$$" +
              '<p class="small muted">Check: $AA^{-1} = I$ ' + (M.eq(M.mul(A, inv), M.eye(n)) ? "✔" : "✘") + "</p></div>";
          } else h += '<div class="box trap" data-t="No inverse">$\\det A = 0$ (the constant term of $p_A$ is $0$; $0$ is an eigenvalue), so $A$ is not invertible.</div>';
          out.innerHTML = h + "</div>"; LA.enhance(out); LA.renderMath(out);
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; console.error(e); }
      };
      $$("[data-x]", view).forEach((b) => b.onclick = () => { $("#eIn", view).value = EIG_EX[Number(b.dataset.x)][1]; run(); });
      $("#go", view).onclick = run; run();
    },
  });
})();
