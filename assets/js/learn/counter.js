/* Counterexample Laboratory: false-but-tempting claims. You construct a counterexample; a DETERMINISTIC exact
   verifier (rational arithmetic) checks it and explains the computation. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const { Frac } = LA;
  const fr = (x) => Frac.of(x);
  const exact = (vals) => vals.map((x) => { if (!x.exRe || (x.exIm && !x.exIm.isZero())) throw new Error("use exact real numbers (fractions are fine)"); return x.exRe; });
  const M = (s) => LA.ans.matrix(s).map(exact);
  const Vv = (s) => exact(LA.ans.vector(s));
  const N = (s) => exact([LA.ans.scalar(s)])[0];
  const mt = (A) => "\\begin{pmatrix}" + A.map((r) => r.map((x) => x.tex()).join("&")).join("\\\\") + "\\end{pmatrix}";
  const vt = (v) => "(" + v.map((x) => x.tex()).join(", ") + ")";
  const det = (A) => LA.alg.det(A), mul = LA.M.mul, add = LA.M.add, eq = LA.M.eq, rank = (A) => LA.alg.rank(A);
  const isZero = (A) => A.every((r) => r.every((x) => x.isZero()));
  const eye = (n) => LA.M.eye(n);
  const sq = (A) => { if (A.length !== A[0].length) throw new Error("the matrix must be square"); return A; };
  const same = (A, B) => { if (A.length !== B.length || A[0].length !== B[0].length) throw new Error("A and B must have the same size"); };
  const isSym = (A) => A.every((r, i) => r.every((x, j) => x.eq(A[j][i])));
  const tr = (A) => A.reduce((s, r, i) => s.add(r[i]), Frac.ZERO);
  const disc2 = (A) => tr(A).mul(tr(A)).sub(det(A).mul(4));
  const lead = (A) => A.map((_, k) => det(A.slice(0, k + 1).map((r) => r.slice(0, k + 1))));
  const principal = (A) => { const n = A.length, out = []; for (let m = 1; m < 1 << n; m++) { const idx = []; for (let i = 0; i < n; i++) if (m & (1 << i)) idx.push(i); out.push(det(idx.map((i) => idx.map((j) => A[i][j])))); } return out; };
  const OK = (msg) => ({ ok: true, msg }), NO = (msg) => ({ ok: false, msg });
  const ph2 = "e.g. 1 2; 3 4";

  const C = [
    { id: "det-add", topic: "det-properties", claim: "$\\det(A+B) = \\det A+\\det B$ for all $2\\times2$ matrices $A,B$.", tempt: "The determinant is linear in each row, so it 'feels' additive.", inputs: [["A", ph2], ["B", ph2]],
      verify: ([a, b]) => { const A = sq(M(a)), B = sq(M(b)); same(A, B); const l = det(add(A, B)), r = det(A).add(det(B)); return l.eq(r) ? NO("Here $\\det(A+B) = " + l.tex() + " = \\det A+\\det B$. Try again.") : OK("$\\det(A+B) = " + l.tex() + "$ but $\\det A+\\det B = " + r.tex() + "$."); },
      hint: "Try two diagonal matrices.", example: "$A = \\diag(1,0)$, $B = \\diag(0,1)$: $\\det(A+B) = 1$, $\\det A+\\det B = 0$.", truth: "$\\det(AB) = \\det A\\det B$ (multiplicative, not additive)." },
    { id: "comm", topic: "systems-rref", claim: "$AB = BA$ for all square matrices $A,B$.", tempt: "Numbers commute, so why not matrices?", inputs: [["A", ph2], ["B", ph2]],
      verify: ([a, b]) => { const A = sq(M(a)), B = sq(M(b)); same(A, B); const P = mul(A, B), Q = mul(B, A); return eq(P, Q) ? NO("These commute ($AB = BA = " + mt(P) + "$).") : OK("$AB = " + mt(P) + "\\neq" + mt(Q) + " = BA$."); },
      hint: "Use matrices with a single 1, like $E_{12}$ and $E_{21}$.", example: "$A = \\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$, $B = \\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}$.", truth: "Matrix multiplication is associative but not commutative; $AB = BA$ holds e.g. when $B$ is a polynomial in $A$." },
    { id: "zero-div", topic: "systems-rref", claim: "If $AB = O$ then $A = O$ or $B = O$.", tempt: "It's true for real numbers.", inputs: [["A", ph2], ["B", ph2]],
      verify: ([a, b]) => { const A = M(a), B = M(b); if (A[0].length !== B.length) throw new Error("AB must be defined"); if (isZero(A) || isZero(B)) return NO("One of your matrices is the zero matrix."); const P = mul(A, B); return isZero(P) ? OK("$A\\neq O$, $B\\neq O$ but $AB = O$.") : NO("$AB = " + mt(P) + "\\neq O$."); },
      hint: "Make the columns of $B$ lie in the null space of $A$.", example: "$A = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$, $B = \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}$.", truth: "If $A$ is invertible, $AB = O\\Rightarrow B = O$." },
    { id: "idem", topic: "eigen", claim: "If $A^2 = A$ then $A = O$ or $A = I$.", tempt: "$x^2 = x$ only has solutions $0, 1$ for numbers.", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (!eq(mul(A, A), A)) return NO("$A^2 = " + mt(mul(A, A)) + "\\neq A$."); if (isZero(A) || eq(A, eye(A.length))) return NO("That's $O$ or $I$."); return OK("$A^2 = A$ yet $A\\neq O, I$ — a projection."); },
      hint: "Think of a projection onto the $x$-axis.", example: "$A = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$.", truth: "Idempotent matrices are projections; their eigenvalues are $0$ or $1$." },
    { id: "nilp", topic: "eigen", claim: "If $A^2 = O$ then $A = O$.", tempt: "$x^2 = 0\\Rightarrow x = 0$ for numbers.", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (isZero(A)) return NO("That's the zero matrix."); return isZero(mul(A, A)) ? OK("$A\\neq O$ but $A^2 = O$ (nilpotent).") : NO("$A^2 = " + mt(mul(A, A)) + "\\neq O$."); },
      hint: "A strictly upper triangular matrix.", example: "$\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$.", truth: "$A^2 = O$ forces every eigenvalue to be $0$, but not $A = O$." },
    { id: "inv-sum", topic: "det-properties", claim: "If $A$ and $B$ are invertible then so is $A+B$.", tempt: "Invertibility seems robust.", inputs: [["A", ph2], ["B", ph2]],
      verify: ([a, b]) => { const A = sq(M(a)), B = sq(M(b)); same(A, B); if (det(A).isZero() || det(B).isZero()) return NO("Both must be invertible ($\\det A = " + det(A).tex() + "$, $\\det B = " + det(B).tex() + "$)."); return det(add(A, B)).isZero() ? OK("$\\det A, \\det B\\neq0$ but $\\det(A+B) = 0$.") : NO("$\\det(A+B) = " + det(add(A, B)).tex() + "\\neq0$."); },
      hint: "Try $B = -A$.", example: "$A = I$, $B = -I$.", truth: "Invertible matrices form a group under multiplication, not addition." },
    { id: "det-scale", topic: "det-properties", claim: "$\\det(cA) = c\\det A$ for $2\\times2$ matrices.", tempt: "Scalars usually come straight out.", inputs: [["c", "e.g. 2"], ["A", ph2]],
      verify: ([c, a]) => { const k = N(c), A = sq(M(a)); const l = det(A.map((r) => r.map((x) => x.mul(k)))), r = k.mul(det(A)); return l.eq(r) ? NO("Equal here ($" + l.tex() + "$). Try $c\\neq0,1$ and $\\det A\\neq0$.") : OK("$\\det(cA) = " + l.tex() + "$ but $c\\det A = " + r.tex() + "$."); },
      hint: "Take $A = I$ and $c = 2$.", example: "$c = 2$, $A = I_2$: $\\det(2I) = 4\\neq2$.", truth: "$\\det(cA) = c^n\\det A$." },
    { id: "real-eig", topic: "eigen", claim: "Every real $2\\times2$ matrix has a real eigenvalue.", tempt: "Every real polynomial has roots... complex ones!", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (A.length !== 2) throw new Error("use a 2×2 matrix"); const d = disc2(A); return d.sign() < 0 ? OK("$(\\operatorname{tr}A)^2-4\\det A = " + d.tex() + "\\lt0$: no real eigenvalues.") : NO("Discriminant $" + d.tex() + "\\ge0$, so it has real eigenvalues."); },
      hint: "A rotation moves every direction.", example: "$\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$ (rotation by $90^\\circ$).", truth: "Real SYMMETRIC matrices always have real eigenvalues (Theorem 8.2.3)." },
    { id: "rep-diag", topic: "diagonalization", claim: "A $2\\times2$ matrix with a repeated eigenvalue is never diagonalizable.", tempt: "Repeated eigenvalues often cause trouble.", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (A.length !== 2) throw new Error("use a 2×2 matrix"); if (!disc2(A).isZero()) return NO("The eigenvalues are distinct."); const l = tr(A).div(2); return eq(A, eye(2).map((r) => r.map((x) => x.mul(l)))) ? OK("Repeated eigenvalue $" + l.tex() + "$ and $A = " + l.tex() + "I$ is already diagonal.") : NO("Repeated eigenvalue, but $A\\neq\\lambda I$, so it is NOT diagonalizable."); },
      hint: "What is the simplest matrix with eigenvalue $3$ twice?", example: "$A = 3I$.", truth: "Diagonalizable ⇔ geometric = algebraic multiplicity; a $2\\times2$ matrix with a repeated eigenvalue $\\lambda$ is diagonalizable iff $A = \\lambda I$." },
    { id: "same-eig", topic: "change-of-basis", claim: "Two $2\\times2$ matrices with the same eigenvalues are similar.", tempt: "Similar ⇒ same eigenvalues, so surely the converse…", inputs: [["A", ph2], ["B", ph2]],
      verify: ([a, b]) => { const A = sq(M(a)), B = sq(M(b)); if (A.length !== 2 || B.length !== 2) throw new Error("use 2×2 matrices"); if (!tr(A).eq(tr(B)) || !det(A).eq(det(B))) return NO("Different characteristic polynomials (trace or determinant differ)."); if (!disc2(A).isZero()) return NO("Same eigenvalues, but they are " + (disc2(A).sign() > 0 ? "distinct" : "complex") + " — then the matrices ARE similar."); const l = tr(A).div(2), L = eye(2).map((r) => r.map((x) => x.mul(l))); return eq(A, L) !== eq(B, L) ? OK("Both have eigenvalue $" + l.tex() + "$ twice, but only one equals $" + l.tex() + "I$, and $P^{-1}(\\lambda I)P = \\lambda I$ for every $P$.") : NO("Both are $\\lambda I$ or both are not — those ARE similar."); },
      hint: "Compare $I$ with $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$.", example: "$I$ and $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$.", truth: "Similar ⇒ same characteristic polynomial (not conversely)." },
    { id: "union", topic: "subspaces", claim: "The union of two subspaces of $\\R^2$ is a subspace.", tempt: "Intersections of subspaces ARE subspaces.", inputs: [["u (spans the line U)", "e.g. (1,0)"], ["w (spans the line W)", "e.g. (0,1)"]],
      verify: ([a, b]) => { const u = Vv(a), w = Vv(b); if (u.length !== 2 || w.length !== 2) throw new Error("use vectors in R²"); if (u.every((x) => x.isZero()) || w.every((x) => x.isZero())) return NO("Use non-zero vectors so that $U$, $W$ are lines."); if (rank([u, w]) < 2) return NO("Your lines coincide, so the union is just that line (a subspace)."); const s = u.map((x, i) => x.add(w[i])); return OK("$u,w\\in U\\cup W$ but $u+w = " + vt(s) + "$ lies on neither line (it is not a multiple of $u$ or of $w$)."); },
      hint: "Two different lines through the origin.", example: "$x$-axis and $y$-axis: $(1,0)+(0,1) = (1,1)$.", truth: "$U\\cup W$ is a subspace iff $U\\subseteq W$ or $W\\subseteq U$. Use $U+W$ instead." },
    { id: "perp-trans", topic: "orthogonality", claim: "If $u\\perp v$ and $v\\perp w$ then $u\\perp w$ (in $\\R^3$).", tempt: "'Perpendicular' feels transitive in pictures.", inputs: [["u", "(1,0,0)"], ["v", "(0,1,0)"], ["w", "(…)"]],
      verify: ([a, b, c]) => { const u = Vv(a), v = Vv(b), w = Vv(c); const d = LA.V.dot; if (!d(u, v).isZero() || !d(v, w).isZero()) return NO("Need $u\\cdot v = 0$ and $v\\cdot w = 0$ (you have " + d(u, v).tex() + " and " + d(v, w).tex() + ")."); return d(u, w).isZero() ? NO("$u\\cdot w = 0$ too.") : OK("$u\\cdot v = v\\cdot w = 0$ but $u\\cdot w = " + d(u, w).tex() + "\\neq0$."); },
      hint: "Take $u = w$.", example: "$u = w = (1,0,0)$, $v = (0,1,0)$.", truth: "Orthogonality is symmetric but not transitive." },
    { id: "t0", topic: "linear-maps", claim: "If $T(0) = 0$ then $T$ is linear.", tempt: "It's the first thing we check…", inputs: [["T(x,y) =", "e.g. (x*y, x)"]],
      verify: ([s]) => { const src = /=/.test(s) ? s : "T(x,y) = " + s; const map = LA.parseMap(src); const n = map.vars.length; const zero = new Array(n).fill(0); const allPoly = map.comps.every((c) => c.mp); const t0 = allPoly ? map.comps.map((c) => LA.parse.mpEval(c.mp, zero.map(() => Frac.ZERO))) : null; const t0zero = allPoly ? t0.every((x) => x.isZero()) : map.comps.every((c) => { const env = {}; map.vars.forEach((v) => { env[v] = 0; }); return Math.abs(LA.parse.evalNum(c.ast, env)) < 1e-12; }); if (!t0zero) return NO("$T(0)\\neq0$ — that map is non-linear for the obvious reason; find one with $T(0) = 0$."); const a = LA.analyseLinearity(map); return a.linear === false ? OK("$T(0) = 0$, yet $T$ is not linear:</p>" + a.html + "<p>") : a.linear ? NO("That map is linear.") : NO("Couldn't decide — try a polynomial formula."); },
      hint: "Use a product of variables or a square.", example: "$T(x,y) = (xy, x)$: $T(0) = 0$ but $T(2(1,1)) = (4,2)\\neq2T(1,1)$.", truth: "Linear ⇒ $T(0) = 0$; the converse fails." },
    { id: "pairwise", topic: "independence", claim: "If every pair of vectors from a set is independent, the set is independent.", tempt: "No two vectors are parallel…", inputs: [["three vectors", "(1,0), (0,1), (1,1)"]],
      verify: ([s]) => { const L = LA.ans.vectorList(s).map(exact); if (L.length !== 3) throw new Error("enter exactly three vectors"); for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (rank([L[i], L[j]]) < 2) return NO("Vectors " + (i + 1) + " and " + (j + 1) + " are dependent."); return rank(L) < 3 ? OK("Every pair is independent but the three are dependent (rank " + rank(L) + ").") : NO("These three are independent."); },
      hint: "Three vectors in $\\R^2$.", example: "$(1,0), (0,1), (1,1)$.", truth: "Independence is a property of the whole set." },
    { id: "tri-eq", topic: "norms-angles", claim: "If $u$ and $v$ are linearly dependent then $\\lVert u+v\\rVert = \\lVert u\\rVert+\\lVert v\\rVert$.", tempt: "The notes' Theorem 4.2.8 says 'dependent'.", inputs: [["u", "(1,0)"], ["v", "(…)"]],
      verify: ([a, b]) => { const u = Vv(a), v = Vv(b); if (rank([u, v]) > 1) return NO("$u$ and $v$ must be dependent (parallel)."); const d = LA.V.dot(u, v); return d.sign() < 0 ? OK("Dependent, but $u\\cdot v = " + d.tex() + "\\lt0$, so $\\lVert u+v\\rVert\\lt\\lVert u\\rVert+\\lVert v\\rVert$ (they point in opposite directions).") : NO("Here $u\\cdot v\\ge0$, so equality holds."); },
      hint: "Opposite directions.", example: "$u = (1,0)$, $v = (-1,0)$: $\\lVert u+v\\rVert = 0\\neq2$.", truth: "Equality iff one vector is a NON-NEGATIVE multiple of the other (see the corrections page)." },
    { id: "rank-add", topic: "rank-spaces", claim: "$\\Rank(A+B) = \\Rank A+\\Rank B$.", tempt: "Ranks count pivots; pivots add up?", inputs: [["A", ph2], ["B", ph2]],
      verify: ([a, b]) => { const A = M(a), B = M(b); same(A, B); const l = rank(add(A, B)), r = rank(A) + rank(B); return l !== r ? OK("$\\Rank(A+B) = " + l + "$ but $\\Rank A+\\Rank B = " + r + "$.") : NO("Equal here (" + l + ")."); },
      hint: "Take $B = A$, or $B = -A$.", example: "$A = I$, $B = I$: $\\Rank 2I = 2\\neq4$.", truth: "Only $\\Rank(A+B)\\le\\Rank A+\\Rank B$ holds." },
    { id: "eigvec-T", topic: "eigen", claim: "$A$ and $A^T$ have the same eigenvectors.", tempt: "They do have the same eigenvalues!", inputs: [["A", ph2], ["v (eigenvector of A)", "(1,0)"]],
      verify: ([a, b]) => { const A = sq(M(a)), v = Vv(b); if (v.length !== A.length) throw new Error("size mismatch"); if (v.every((x) => x.isZero())) return NO("$v$ must be non-zero."); const isEig = (B) => { const w = LA.M.mulVec(B, v); const k = v.findIndex((x) => !x.isZero()); const l = w[k].div(v[k]); return w.every((x, i) => x.eq(v[i].mul(l))); }; if (!isEig(A)) return NO("$v$ is not an eigenvector of $A$."); return isEig(LA.M.T(A)) ? NO("$v$ is also an eigenvector of $A^T$.") : OK("$Av$ is a multiple of $v$ but $A^Tv = " + vt(LA.M.mulVec(LA.M.T(A), v)) + "$ is not."); },
      hint: "A triangular matrix and its first standard basis vector.", example: "$A = \\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}$, $v = (1,0)$.", truth: "$A$ and $A^T$ share eigenvalues (same characteristic polynomial), not eigenvectors — unless $A$ is symmetric." },
    { id: "sym-inv", topic: "spectral", claim: "Every symmetric matrix is invertible.", tempt: "Symmetric matrices are so well behaved…", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (!isSym(A)) return NO("$A$ is not symmetric."); return det(A).isZero() ? OK("$A = A^T$ and $\\det A = 0$.") : NO("$\\det A = " + det(A).tex() + "\\neq0$."); },
      hint: "Zero is symmetric…", example: "$\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$.", truth: "Symmetric ⇒ orthogonally diagonalizable; invertible iff no eigenvalue is $0$." },
    { id: "pos-pd", topic: "definiteness", claim: "A symmetric matrix with all entries positive is positive definite.", tempt: "Positive entries, positive form?", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (!isSym(A)) return NO("$A$ must be symmetric."); if (!A.every((r) => r.every((x) => x.sign() > 0))) return NO("All entries must be positive."); const L = lead(A); return L.every((x) => x.sign() > 0) ? NO("All leading minors are positive (" + L.map((x) => x.tex()).join(", ") + "): it IS positive definite.") : OK("Leading minors $" + L.map((x) => x.tex()).join(", ") + "$ — not all positive, so by Sylvester $A$ is not positive definite."); },
      hint: "Make the off-diagonal entries large.", example: "$\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$: $Q(1,-1) = -2$.", truth: "Symmetric $A$ is PD iff all leading principal minors are positive (Sylvester)." },
    { id: "minors-psd", topic: "definiteness", claim: "If all leading principal minors of a symmetric matrix are $\\ge0$, it is positive semidefinite.", tempt: "Sylvester works for definite… so for semidefinite?", inputs: [["A", ph2]],
      verify: ([a]) => { const A = sq(M(a)); if (!isSym(A)) return NO("$A$ must be symmetric."); const L = lead(A); if (!L.every((x) => x.sign() >= 0)) return NO("Some leading minor is negative."); const P0 = principal(A); return P0.some((x) => x.sign() < 0) ? OK("Leading minors $" + L.map((x) => x.tex()).join(", ") + "\\ge0$, but some principal minor is negative, so $A$ is not PSD.") : NO("All principal minors are $\\ge0$: it IS positive semidefinite."); },
      hint: "Put a $0$ in the top-left corner.", example: "$\\diag(0,-1)$: minors $0, 0$ but $Q(0,1) = -1$.", truth: "PSD ⇔ ALL principal minors $\\ge0$ ⇔ all eigenvalues $\\ge0$." },
    { id: "sym-trans", topic: "relations", claim: "A symmetric and transitive relation on $\\{1,2,3\\}$ is reflexive.", tempt: "'$xRy\\Rightarrow yRx\\Rightarrow xRx$' looks like a proof.", inputs: [["R (pairs)", "e.g. (1,2), (2,1), (1,1), (2,2)"]],
      verify: ([s]) => { const L = LA.ans.vectorList(s.trim() ? s : "∅").map(exact).map((p) => p.map((x) => Number(x.n))); if (L.some((p) => p.length !== 2 || p.some((x) => x < 1 || x > 3))) throw new Error("pairs of numbers from {1,2,3}"); const has = (a, b) => L.some((p) => p[0] === a && p[1] === b); const sym = L.every(([a, b]) => has(b, a)); let trans = true; L.forEach(([a, b]) => L.forEach(([c, d]) => { if (b === c && !has(a, d)) trans = false; })); const refl = [1, 2, 3].every((a) => has(a, a)); if (!sym) return NO("Not symmetric."); if (!trans) return NO("Not transitive."); return refl ? NO("It is reflexive.") : OK("Symmetric and transitive, but $(" + [1, 2, 3].find((a) => !has(a, a)) + "," + [1, 2, 3].find((a) => !has(a, a)) + ")\\notin R$."); },
      hint: "The 'proof' needs some $y$ with $xRy$ — what if $x$ is related to nothing?", example: "$R = \\{(1,1)\\}$ (3 is related to nothing), or even $R = \\emptyset$.", truth: "Symmetric + transitive ⇒ $xRx$ for every $x$ that is related to SOMETHING." },
  ];
  LA.CLAIMS = C;

  LA.page("/counterexamples", {
    title: "Counterexample Lab", searchTitle: "Counterexample Laboratory", searchDesc: "Break tempting false claims with your own counterexamples, checked exactly",
    render(p, q) {
      const solved = LA.store.get("ceSolved", {});
      const chs = Array.from(new Set(C.map((c) => LA.topic(c.topic).ch))).sort();
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Advanced Proof Studio</div><h1>Counterexample Laboratory</h1><p class="lead">Every claim below is <b>false</b> but tempting. Build a counterexample; an exact verifier (rational arithmetic, no rounding) checks it and shows the computation. One valid counterexample is a complete disproof.</p>' +
        '<div class="row"><span class="chip lime">' + Object.keys(solved).length + " / " + C.length + ' broken</span><a class="btn" href="#/proofs/drills">🧩 Proof drills</a><a class="btn" href="#/proofs/examiner">🔎 Proof Examiner</a></div></div></div>' +
        chs.map((ch) => LA.sectionTitle("Chapter " + ch) + '<div class="grid grid-2">' + C.filter((c) => LA.topic(c.topic).ch === ch && (!q.id || c.id === q.id)).map((c) => '<div data-cid="' + c.id + '"></div>').join("") + "</div>").join("") + "</div>";
    },
    after(view) { C.forEach((c) => { const h = $('[data-cid="' + c.id + '"]', view); if (h) LA.mountClaim(h, c); }); },
  });

  LA.mountClaim = function (host, c) {
    const solved = LA.store.get("ceSolved", {});
    host.innerHTML = '<div class="card ce-card' + (solved[c.id] ? " solved" : "") + '"><div class="row spread"><span class="chip ' + (solved[c.id] ? "lime" : "red") + '">' + (solved[c.id] ? "✓ Broken" : "False claim") + '</span><a class="small" href="#/learn/' + c.topic + '">' + esc(LA.topic(c.topic).title) + "</a></div>" +
      '<p class="ce-claim"><b>Claim:</b> ' + c.claim + '</p><p class="small muted">Why it\'s tempting: ' + c.tempt + "</p>" +
      c.inputs.map((inp, i) => '<label class="ce-in"><span>' + esc(inp[0]) + '</span><input type="text" class="mono-in" data-ci="' + i + '" placeholder="' + esc(inp[1]) + '" spellcheck="false"></label>').join("") +
      '<div class="row" style="margin-top:8px"><button class="btn btn-primary" data-act="test">Test my counterexample</button><button class="btn btn-ghost" data-act="hint">Hint</button><button class="btn btn-ghost" data-act="show">Show one</button></div><div class="ce-out" aria-live="polite"></div></div>';
    const out = $(".ce-out", host);
    let tries = 0, shown = false, done = false;
    const finish = (score) => { if (done) return; done = true; LA.ev.record({ topic: c.topic, src: "ce", score, gen: "ce:" + c.id, sol: shown }); if (score > 0) { const s = LA.store.get("ceSolved", {}); s[c.id] = Date.now(); LA.store.set("ceSolved", s); LA.addXP(12, "Counterexample found"); } };
    $('[data-act="test"]', host).onclick = () => {
      const vals = $$("[data-ci]", host).map((x) => x.value);
      if (vals.some((v, i) => !v.trim() && c.id !== "sym-trans")) { out.innerHTML = '<p class="small muted">Fill in every field.</p>'; return; }
      tries++;
      let r; try { r = c.verify(vals); } catch (e) { r = { ok: false, msg: "Couldn't read your input: " + esc(e.message) }; }
      out.innerHTML = '<div class="verdict ' + (r.ok ? "ok" : "bad") + '">' + (r.ok ? "✓ Valid counterexample — claim disproved" : "✗ Not a counterexample") + '</div><p class="small">' + r.msg + "</p>" + (r.ok ? '<div class="box thm" data-t="What IS true"><p>' + c.truth + "</p></div>" : "");
      if (r.ok) { finish(shown ? 0 : tries <= 3 ? 1 : 0.6); host.querySelector(".chip").className = "chip lime"; host.querySelector(".chip").textContent = "✓ Broken"; }
      LA.enhance(out); LA.renderMath(out);
    };
    $('[data-act="hint"]', host).onclick = () => { out.innerHTML = '<div class="box tip" data-t="Hint"><p>' + c.hint + "</p></div>"; LA.enhance(out); LA.renderMath(out); };
    $('[data-act="show"]', host).onclick = () => { shown = true; if (!done) finish(0); out.innerHTML = '<div class="box ex" data-t="A counterexample"><p>' + c.example + '</p></div><div class="box thm" data-t="What IS true"><p>' + c.truth + "</p></div>"; LA.enhance(out); LA.renderMath(out); };
    LA.renderMath(host);
  };
})();
