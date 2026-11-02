/* Matrix Calculator (exact): sums, products, transpose, inverse, determinant, rank, powers, null/column space,
   characteristic polynomial, rational eigenvalues — and Gauss–Jordan with the ELEMENTARY MATRIX of every row operation,
   so you can see E_k ⋯ E_1 A = RREF(A) (and E_k ⋯ E_1 = A⁻¹ when A is invertible). */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const { Frac, M } = LA;
  const mt = (A) => M.tex(A);
  const readM = (s) => LA.ans.matrix(s).map((r) => r.map((x) => { if (!x.exRe || !x.exIm.isZero()) throw new Error("use exact rational entries"); return x.exRe; }));
  const sq = (A, w) => { if (A.length !== A[0].length) throw new Error(w + " must be square"); };
  // Gauss–Jordan recording elementary operations
  function gaussJordan(A0) {
    const A = A0.map((r) => r.slice()), m = A.length, n = A[0].length, ops = [];
    const E = (fn) => { const I = M.eye(m); fn(I); return I; };
    let row = 0;
    for (let col = 0; col < n && row < m; col++) {
      let p = -1; for (let i = row; i < m; i++) if (!A[i][col].isZero()) { p = i; if (A[i][col].isOne() || A[i][col].neg().isOne()) break; }
      if (p < 0) continue;
      if (p !== row) { [A[p], A[row]] = [A[row], A[p]]; const r1 = p, r2 = row; ops.push({ tex: "R_{" + (row + 1) + "}\\leftrightarrow R_{" + (p + 1) + "}", E: E((I) => { [I[r1], I[r2]] = [I[r2], I[r1]]; }), M: A.map((r) => r.slice()) }); }
      const pv = A[row][col];
      if (!pv.isOne()) { const c = pv.inv(), rr = row; A[row] = A[row].map((x) => x.mul(c)); ops.push({ tex: "R_{" + (row + 1) + "}\\to " + c.tex() + "R_{" + (row + 1) + "}", E: E((I) => { I[rr][rr] = c; }), M: A.map((r) => r.slice()) }); }
      for (let i = 0; i < m; i++) {
        if (i === row || A[i][col].isZero()) continue;
        const c = A[i][col].neg(), rr = row, ii = i;
        A[i] = A[i].map((x, j) => x.add(A[row][j].mul(c)));
        ops.push({ tex: "R_{" + (i + 1) + "}\\to R_{" + (i + 1) + "}" + (c.sign() < 0 ? "-" : "+") + (c.abs().isOne() ? "" : c.abs().tex()) + "R_{" + (row + 1) + "}", E: E((I) => { I[ii][rr] = c; }), M: A.map((r) => r.slice()) });
      }
      row++;
    }
    return { R: A, ops, rank: row };
  }
  LA.gaussJordanE = gaussJordan;

  LA.page("/labs/calculator", {
    title: "Matrix Calculator", lab: "calculator", searchTitle: "Lab · Matrix Calculator", searchDesc: "Exact matrix operations with elementary matrices for every row operation",
    render() {
      const ops = [["add", "A + B"], ["sub", "A − B"], ["mul", "AB"], ["bmul", "BA"], ["scale", "kA"], ["T", "Aᵀ"], ["inv", "A⁻¹"], ["det", "det A"], ["rank", "rank A"], ["rref", "RREF + elementary matrices"], ["pow", "Aⁿ"], ["null", "Null(A)"], ["col", "Col(A)"], ["char", "char. polynomial"], ["eig", "eigenvalues"], ["tr", "trace"]];
      return '<div class="page wide"><div class="row spread"><div><div class="kicker">Interactive lab · Chapters 5–7</div><h1 style="margin:.1em 0 .3em">Matrix Calculator</h1></div><a class="btn btn-sm" href="#/ch/5">📖 Chapter 5</a></div>' +
        '<p class="muted">Everything is computed with exact fractions. Enter matrices as rows separated by <code>;</code> or new lines, e.g. <code>1 2; 3 4</code> or <code>1/2, -3; 0, 1</code>.</p>' +
        '<div class="grid grid-2"><div class="card"><label class="field">Matrix $A$<textarea id="mA" class="mono-in" rows="4">2 1 0; 1 3 1; 0 1 2</textarea></label><div class="readas small muted" id="pA"></div></div><div class="card"><label class="field">Matrix $B$<textarea id="mB" class="mono-in" rows="4">1 0 1; 0 1 0; 1 0 -1</textarea></label><div class="readas small muted" id="pB"></div><div class="row" style="margin-top:8px"><label class="field" style="flex-direction:row;align-items:center;gap:6px">$k =$ <input id="sk" class="mono-in sm-in" value="2"></label><label class="field" style="flex-direction:row;align-items:center;gap:6px">$n =$ <input id="sn" class="mono-in sm-in" value="3"></label></div></div></div>' +
        '<div class="card" style="margin-top:14px"><div class="presets">' + ops.map((o) => '<button class="btn btn-sm" data-op="' + o[0] + '">' + o[1] + "</button>").join("") + '</div></div><div class="out card" id="cOut" style="margin-top:14px"><p class="muted">Choose an operation.</p></div>' +
        '<div class="box note" data-t="Formulas used" style="margin-top:14px"><p>$(AB)_{ij} = \\sum_k a_{ik}b_{kj}$; $(AB)^T = B^TA^T$; $[A\\,|\\,I]\\to[I\\,|\\,A^{-1}]$; each row operation is left-multiplication by an elementary matrix $E$, so $E_k\\cdots E_1A = R$; $\\Rank A$ = number of pivots; $\\Nullity A = n-\\Rank A$; $p_A(\\lambda) = \\det(A-\\lambda I)$. See <a href="#/ch/5?go=sec-5-1">§5.1</a>, <a href="#/ch/6">Chapter 6</a>, <a href="#/ch/7">Chapter 7</a>.</p></div></div>';
    },
    after(view) {
      const out = $("#cOut", view);
      const prev = (id, pid) => { const el = $("#" + id, view); const f = () => { try { $("#" + pid, view).innerHTML = "Read as: " + LA.tex(mt(readM(el.value))); } catch (e) { $("#" + pid, view).textContent = "Can't read: " + e.message; } }; el.addEventListener("input", f); f(); };
      prev("mA", "pA"); prev("mB", "pB");
      const show = (html) => { out.innerHTML = html; LA.enhance(out); LA.renderMath(out); };
      $$("[data-op]", view).forEach((b) => b.addEventListener("click", () => {
        try {
          const A = readM($("#mA", view).value); const needB = ["add", "sub", "mul", "bmul"].includes(b.dataset.op); const B = needB ? readM($("#mB", view).value) : null;
          const op = b.dataset.op; let html;
          if (op === "add" || op === "sub") { if (A.length !== B.length || A[0].length !== B[0].length) throw new Error("A and B must have the same size"); html = "$$" + mt(A) + (op === "add" ? "+" : "-") + mt(B) + " = " + mt(op === "add" ? M.add(A, B) : M.sub(A, B)) + "$$"; }
          else if (op === "mul" || op === "bmul") { const [X, Y] = op === "mul" ? [A, B] : [B, A]; if (X[0].length !== Y.length) throw new Error("columns of the first must equal rows of the second (" + X[0].length + " ≠ " + Y.length + ")"); html = "$$" + mt(X) + mt(Y) + " = " + mt(M.mul(X, Y)) + "$$" + (op === "mul" && A.length === A[0].length && B.length === B[0].length && A.length === B.length ? "<p class=\"small muted\">" + (M.eq(M.mul(A, B), M.mul(B, A)) ? "Here $AB = BA$." : "Note $AB\\neq BA$ in general — compare with $BA$.") + "</p>" : ""); }
          else if (op === "scale") { const k = Frac.parse($("#sk", view).value); html = "$$" + k.tex() + mt(A) + " = " + mt(M.scale(k, A)) + "$$"; }
          else if (op === "T") html = "$$A^T = " + mt(M.T(A)) + "$$";
          else if (op === "inv") { sq(A, "A"); const I = LA.alg.inverse(A); html = I ? "$$A^{-1} = " + mt(I) + "$$<p>Check: $AA^{-1} = I$ ✓ (" + (M.eq(M.mul(A, I), M.eye(A.length)) ? "verified" : "?") + ")</p>" : '<p class="err">$\\det A = 0$: $A$ is not invertible.</p>'; }
          else if (op === "det") { sq(A, "A"); html = "$$\\det A = " + LA.alg.det(A).tex() + "$$"; }
          else if (op === "rank") { const r = LA.alg.rank(A); html = "<p>$\\Rank A = " + r + "$, $\\Nullity A = " + (A[0].length - r) + "$ (Rank–Nullity: $" + r + "+" + (A[0].length - r) + " = " + A[0].length + "$ columns).</p>"; }
          else if (op === "tr") { sq(A, "A"); html = "<p>$\\operatorname{tr}A = " + A.reduce((s, r, i) => s.add(r[i]), Frac.ZERO).tex() + "$</p>"; }
          else if (op === "pow") { sq(A, "A"); const n = Math.max(0, Math.min(50, parseInt($("#sn", view).value, 10) || 0)); let P = M.eye(A.length); for (let i = 0; i < n; i++) P = M.mul(P, A); html = "$$A^{" + n + "} = " + mt(P) + "$$"; }
          else if (op === "null") { const ns = LA.alg.nullspace(A).basis.map((v) => LA.V.integerize(v, true).vec); html = "<p>$\\Null(A) = " + (ns.length ? "\\spn\\{" + ns.map((v) => LA.V.tex(v)).join(",\\ ") + "\\}" : "\\{0\\}") + "$ (dimension " + ns.length + ").</p>"; }
          else if (op === "col") { const red = LA.alg.rowReduce(A, { mode: "rref" }); html = "<p>Pivot columns: " + red.pivotCols.map((j) => j + 1).join(", ") + ". Basis of $\\operatorname{Col}(A)$ (original columns!): $" + red.pivotCols.map((j) => LA.V.tex(A.map((r) => r[j]))).join(",\\ ") + "$.</p>"; }
          else if (op === "char") { sq(A, "A"); html = "$$p_A(\\lambda) = \\det(A-\\lambda I) = " + LA.alg.charPoly(A).tex({ v: "\\lambda", desc: true }) + "$$"; }
          else if (op === "eig") { sq(A, "A"); const cp = LA.alg.charPoly(A), rr = LA.alg.rationalRoots(cp); html = "<p>$p_A(\\lambda) = " + cp.tex({ v: "\\lambda", desc: true }) + "$.</p><p>Rational eigenvalues: " + (rr.roots.length ? "$" + rr.roots.map((x) => x.tex()).join(",\\ ") + "$" : "none") + (rr.rest.deg() > 0 ? ". Remaining factor $" + rr.rest.tex({ v: "\\lambda", desc: true }) + "$ has irrational or complex roots — see the <a href=\"#/labs/eigen\">Eigen Lab</a>." : ".") + "</p>"; }
          else if (op === "rref") {
            const g = gaussJordan(A), m = A.length;
            let prod = M.eye(m); g.ops.forEach((o) => { prod = M.mul(o.E, prod); });
            html = "<p>Each row operation $=$ left-multiplication by an elementary matrix $E_k$:</p>" + (g.ops.length ? g.ops.map((o, k) => '<div class="log-step"><div class="op">$' + o.tex + "$ &nbsp; with &nbsp; $E_{" + (k + 1) + "} = " + mt(o.E) + "$</div>$$\\cong " + mt(o.M) + "$$</div>").join("") : "<p>$A$ is already in RREF.</p>") +
              "<p>So $E_{" + g.ops.length + "}\\cdots E_1A = " + mt(g.R) + "$ with $E_{" + g.ops.length + "}\\cdots E_1 = " + mt(prod) + "$" + (g.rank === m && A.length === A[0].length ? " — since RREF $= I$, this product is $A^{-1}$." : ".") + "</p>";
          }
          show(html);
        } catch (e) { show('<p class="err">' + esc(e.message) + "</p>"); }
      }));
    },
  });
})();
