/* Question generators — Chapter 3 (linear transformations) and Chapter 4 (inner product spaces). */
(function () {
  "use strict";
  const LA = window.LA;
  const { Frac, Poly } = LA;
  const H = LA.bankH, def = LA.bank.def;
  const { fr, vt, ct, mt, vs, ms, ls } = H;
  const XY = ["x", "y"], XYZ = ["x", "y", "z"];
  const mapTex = (A, vars) => "(" + A.map((row) => H.lin(row, vars)).join(",\\ ") + ")";
  const colsOf = (A) => LA.M.cols(H.FR(A));
  // "2p' - xp' + 3p" from [[coef, body], ...] (zero terms dropped, ±1 coefficients hidden)
  const sumT = (terms) => terms.filter(([c0]) => c0).map(([c0, body], k) => (c0 < 0 ? (k ? " - " : "-") : k ? " + " : "") + (Math.abs(c0) === 1 ? "" : Math.abs(c0)) + body).join("").replace(/^ \+ /, "") || "0";

  /* ======================= Chapter 3 ======================= */
  def({ id: "lin-check", topic: "linear-maps", title: "Is T linear?", gen(r, diff) {
    const a = r.nz(-4, 4), b = r.int(-4, 4), c = r.int(-4, 4), d = r.nz(-4, 4), e = r.nz(-3, 3), k = r.pick([2, 3, -1]);
    let pool;
    if (diff === "beginner" || diff === "standard") pool = [
      ["T(x,y) = " + mapTex([[a, b], [c, d]], XY), true, ""],
      ["T(x,y) = (" + H.aff(a, e, "x") + ",\\ " + H.lin([c, d], XY) + ")", false, "$T(0,0) = (" + e + ",0)\\neq(0,0)$, but every linear map sends $0$ to $0$."],
      ["T(x,y) = (xy,\\ x)", false, "$T(2(1,1)) = T(2,2) = (4,2)$ but $2T(1,1) = (2,2)$."],
      ["T(x,y) = (x^2,\\ y)", false, "$T(-(1,0)) = (1,0)$ but $-T(1,0) = (-1,0)$."],
      ["T(x,y) = (|x|,\\ " + H.lin([c, d], XY) + ")", false, "$T(-(1,0)) = (1," + -c + ")$ but $-T(1,0) = (-1," + -c + ")$."],
      ["T(x,y,z) = " + mapTex([[a, 0, b], [0, d, c]], XYZ), true, ""],
    ];
    else if (diff === "advanced") pool = [
      ["T:\\P_2\\to\\P_2,\\ T(p) = " + (a === 1 ? "" : a) + "p'+" + "xp", true, ""], ["T:\\P_2\\to\\R,\\ T(p) = p(" + k + ")", true, ""],
      ["T:\\P_2\\to\\P_2,\\ T(p) = p+1", false, "$T(0) = 1\\neq0$."], ["T:\\P_2\\to\\P_2,\\ T(p) = p(0)\\,p", false, "$T(2) = 2\\cdot2 = 4$ but $2T(1) = 2$."],
      ["T:\\P_2\\to\\P_2,\\ T(p) = (p')^2", false, "$T(2x) = 4$ but $2T(x) = 2$."], ["T:\\P_2\\to\\R^2,\\ T(p) = (p(0),\\ p'(1))", true, ""],
    ];
    else pool = [
      ["T:\\R^{2\\times2}\\to\\R^{2\\times2},\\ T(A) = A^T", true, ""], ["T:\\R^{2\\times2}\\to\\R,\\ T(A) = \\operatorname{tr}A", true, ""],
      ["T:\\R^{2\\times2}\\to\\R,\\ T(A) = \\det A", false, "$\\det(2I) = 4$ but $2\\det I = 2$."], ["T:\\R^{2\\times2}\\to\\R^{2\\times2},\\ T(A) = A^2", false, "$T(2I) = 4I$ but $2T(I) = 2I$."],
      ["T:\\R^{2\\times2}\\to\\R^{2\\times2},\\ T(A) = A+I", false, "$T(O) = I\\neq O$."], ["T:\\R^{2\\times2}\\to\\R^{2\\times2},\\ T(A) = BA \\text{ for a fixed } B", true, ""],
      ["T:\\R^{2\\times2}\\to\\R^{2\\times2},\\ T(A) = A-A^T", true, ""],
    ];
    const [Ts, yes, why] = r.pick(pool);
    return { q: "<p>Is $" + Ts + "$ linear?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Linear", "Not linear"],
      hints: ["Linear ⇔ $T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)$ for all vectors and scalars.", "Quick screen: if $T(0)\\neq0$, $T$ is NOT linear (but $T(0) = 0$ alone proves nothing).", "Constants added on, products of variables, powers, absolute values and determinants usually break linearity; derivatives, evaluations, transposes, traces and matrix products don't.", yes ? "Try to prove it with general $u$, $v$, $\\alpha$, $\\beta$." : "Look for a specific numerical counterexample."],
      sol: yes ? "<p><b>Linear.</b> For all $u,v$ and scalars $\\alpha,\\beta$, each part of $T$ is built from operations that respect sums and scalar multiples, so $T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)$ (write it out component by component in your answer).</p>" : "<p><b>Not linear.</b> " + why + " One concrete counterexample is a complete disproof.</p>" };
  } });

  def({ id: "std-matrix", topic: "linear-maps", title: "Standard matrix of T", gen(r, diff) {
    if (diff === "challenge") {
      const B = H.unimod(r, 2, 3, 1), W = r.intMat(2, 2, -4, 4);
      const A = H.mul(LA.M.fromCols(W.map((w) => w)), H.inv(B)); // A = [T(b1) T(b2)] B^{-1}
      const b = colsOf(B);
      return { q: "<p>$T:\\R^2\\to\\R^2$ is linear with $T" + vt(b[0]) + " = " + vt(W[0]) + "$ and $T" + vt(b[1]) + " = " + vt(W[1]) + "$. Find the standard matrix of $T$.</p>", ans: { type: "mat", answer: A }, model: ms(A), input: "area",
        hints: ["The standard matrix has columns $T(e_1)$, $T(e_2)$.", "Write $e_1$ and $e_2$ as combinations of the given basis vectors.", "Equivalently $A\\,(b_1\\;b_2) = (T(b_1)\\;T(b_2))$, so $A = (T(b_1)\\;T(b_2))(b_1\\;b_2)^{-1}$.", "$(b_1\\;b_2)^{-1} = " + mt(H.inv(B)) + "$."],
        sol: "<p>$A = " + mt(LA.M.fromCols(W.map((w) => w.map(fr)))) + mt(B) + "^{-1} = " + mt(LA.M.fromCols(W.map((w) => w.map(fr)))) + mt(H.inv(B)) + " = " + mt(A) + "$.</p>" };
    }
    const [m, n] = diff === "beginner" ? [2, 2] : diff === "standard" ? [2, 3] : [3, 2];
    const vars = n === 2 ? XY : XYZ;
    let A; do { A = r.intMat(m, n, -5, 5); } while (A.some((row) => row.every((x) => x === 0)));
    return { q: "<p>Find the standard matrix of $T:\\R^" + n + "\\to\\R^" + m + "$, $T(" + vars.join(",") + ") = " + mapTex(A, vars) + "$.</p>", ans: { type: "mat", answer: A }, model: ms(A), input: "area",
      hints: ["Column $j$ of the standard matrix is $T(e_j)$.", "Compute $T(1,0" + (n === 3 ? ",0" : "") + ")$ first.", "Equivalently: row $i$ holds the coefficients of " + vars.join(", ") + " in component $i$.", "The matrix is " + m + "×" + n + "."],
      sol: "<p>$T(e_j)$ gives the columns: $[T] = " + mt(A) + "$. Check: $" + mt(A) + ct(vars) + " = " + ct(A.map((row) => H.lin(row, vars))) + "$.</p>" };
  } });

  def({ id: "ker-basis", topic: "kernel-range", title: "Basis of the kernel", gen(r, diff) {
    if (diff === "challenge") {
      const a = r.int(-2, 2), b = r.int(-2, 2);
      const A = [[1, a, a * a], [0, 1, 2 * b]];
      const B = H.null(A);
      return { q: "<p>$T:\\P_2\\to\\R^2$, $T(p) = (p(" + a + "),\\ p'(" + b + "))$. Find a basis for $\\ker T$.</p>", ans: { type: "polyspan", answer: B, n: 3 }, model: B.map((c) => H.ps(c)).join(", "), ph: "e.g. x^2 - 2x + 1",
        hints: ["Write $p = c_0+c_1x+c_2x^2$.", "$p(" + a + ") = c_0" + (a ? "+" + a + "c_1+" + a * a + "c_2" : "") + "$ and $p'(" + b + ") = c_1+" + 2 * b + "c_2$; set both to $0$.", "Solve the $2\\times3$ homogeneous system: one free variable.", "Rank–Nullity: $\\dim\\ker T = 3-2 = 1$."],
        sol: "<p>$\\ker T$ is the null space of $" + mt(A) + "$ acting on $(c_0,c_1,c_2)$: one free variable, so $\\ker T = \\spn\\{" + B.map((c) => H.pt(c)).join(",") + "\\}$, nullity $1$, and $\\Rank T = 2$ (onto $\\R^2$).</p>" };
    }
    const [m, n, k] = diff === "beginner" ? [2, 3, 2] : diff === "standard" ? [3, 4, 2] : r.pick([[3, 3, 2], [3, 4, 1], [4, 4, 2]]);
    const A = H.rankMat(r, m, n, k, 6), B = H.null(A), vars = n === 3 ? XYZ : ["x_1", "x_2", "x_3", "x_4"];
    return { q: "<p>$T:\\R^" + n + "\\to\\R^" + m + "$, $T(x) = Ax$ with $A = " + mt(A) + "$. Find a basis for $\\ker T$.</p>", ans: { type: "span", answer: B }, model: ls(B), ph: "(…), (…)",
      hints: ["$\\ker T = \\{x: Ax = 0\\} = \\Null(A)$.", "Row-reduce $A$ to RREF.", "Free variables ↔ columns without pivots; set each free variable to 1 (others 0) in turn.", "Rank–Nullity: $\\dim\\ker T = " + n + "-\\Rank A = " + (n - k) + "$."],
      sol: "<p>Row-reduce:" + H.steps(A, H.rref(A)) + "</p><p>Rank $" + k + "$, so $" + (n - k) + "$ free variable" + (n - k > 1 ? "s" : "") + ". Basis of $\\ker T$: $" + B.map(vt).join(",\\ ") + "$. (Rank–Nullity: $" + k + "+" + (n - k) + " = " + n + "$ ✓)</p>" };
  } });

  def({ id: "range-basis", topic: "kernel-range", title: "Basis of the range", gen(r, diff) {
    if (diff === "challenge") {
      const pool = [["p'", [[0, 1, 0], [0, 0, 2], [0, 0, 0]], [[1, 0, 0], [0, 1, 0]], "the derivative of a quadratic is any linear polynomial"], ["p(x)-p(0)", [[0, 0, 0], [0, 1, 0], [0, 0, 1]], [[0, 1, 0], [0, 0, 1]], "it removes the constant term"], ["xp'", [[0, 0, 0], [0, 1, 0], [0, 0, 2]], [[0, 1, 0], [0, 0, 1]], "$T(1) = 0$, $T(x) = x$, $T(x^2) = 2x^2$"], ["p'+p''", [[0, 1, 2], [0, 0, 2], [0, 0, 0]], [[1, 0, 0], [0, 1, 0]], "$T(x) = 1$, $T(x^2) = 2x+2$"]];
      const [f, , B, why] = r.pick(pool);
      return { q: "<p>$T:\\P_2\\to\\P_2$, $T(p) = " + f + "$. Find a basis for $\\Ran T$.</p>", ans: { type: "polyspan", answer: B, n: 3 }, model: B.map((c) => H.ps(c)).join(", "),
        hints: ["$\\Ran T = \\spn\\{T(1),T(x),T(x^2)\\}$.", "Compute the three images.", "Remove dependent ones (or row-reduce their coefficient vectors).", "Check with Rank–Nullity."],
        sol: "<p>$\\Ran T = \\spn\\{T(1),T(x),T(x^2)\\}$; here " + why + ", so a basis is $" + B.map((c) => H.pt(c)).join(",\\ ") + "$ (rank $" + B.length + "$).</p>" };
    }
    const [m, n, k] = diff === "beginner" ? [3, 2, r.pick([1, 2])] : diff === "standard" ? [3, 3, 2] : [3, 4, 2];
    const A = H.rankMat(r, m, n, k, 6), red = H.rref(A), B = red.pivotCols.map((j) => A.map((row) => row[j]));
    return { q: "<p>$T(x) = Ax$ with $A = " + mt(A) + "$. Find a basis for $\\Ran T$ (the column space of $A$).</p>", ans: { type: "span", answer: B }, model: ls(B),
      hints: ["$\\Ran T = \\spn$ of the columns of $A$.", "Row-reduce $A$ and locate the pivot columns.", "The pivot columns OF THE ORIGINAL $A$ form a basis (not the columns of the RREF!).", "$\\Rank A = " + k + "$."],
      sol: "<p>RREF:" + H.steps(A, red) + "</p><p>Pivots in columns " + red.pivotCols.map((j) => j + 1).join(", ") + ", so a basis of $\\Ran T$ is $" + B.map(vt).join(",\\ ") + "$ (any " + k + " independent vectors spanning the column space are also correct).</p>" };
  } });

  def({ id: "rank-nullity", topic: "kernel-range", title: "Rank–Nullity", gen(r, diff) {
    const sp = (d) => r.pick([["\\R^{" + d + "}", d], ["\\P_{" + (d - 1) + "}", d]]);
    const n = r.int(3, 8), m = r.int(2, 7);
    let q, ans, sol;
    if (diff === "beginner") { const k = r.int(0, n - 1); q = "$T:\\R^{" + n + "}\\to\\R^{" + m + "}$ is linear with $\\Nullity T = " + k + "$" + (n - k > m ? "" : "") + ". Find $\\Rank T$."; ans = n - k; if (ans > m) { q = "$T:\\R^{" + n + "}\\to\\R^{" + (n - k) + "}$ is linear with $\\Nullity T = " + k + "$. Find $\\Rank T$."; } sol = "$\\Rank T = " + n + "-" + k + " = " + ans + "$."; }
    else if (diff === "standard") { const rr = r.int(1, Math.min(m, 6)), nn = Math.max(rr, r.int(3, 8)); q = "$A$ is a $" + m + "\\times" + nn + "$ matrix of rank " + rr + ". Find $\\dim\\Null(A)$."; ans = nn - rr; if (rr > m) { ans = nn - m; } sol = "$\\dim\\Null A = n-\\Rank A = " + nn + "-" + rr + " = " + (nn - rr) + "$."; ans = nn - rr; }
    else if (diff === "advanced") { const [V, dv] = sp(r.int(3, 7)); const w = r.int(2, dv); q = "$T:" + V + "\\to\\R^{" + w + "}$ is linear and surjective. Find $\\dim\\ker T$."; ans = dv - w; sol = "Surjective ⇒ $\\Rank T = " + w + "$, so $\\dim\\ker T = " + dv + "-" + w + " = " + ans + "$."; }
    else { const a = r.int(2, 3), b = r.int(2, 3); const dv = a * b, w = r.int(2, dv); q = "$T:\\R^{" + a + "\\times" + b + "}\\to\\P_{" + (w - 1) + "}$ is linear and onto. Find $\\Nullity T$."; ans = dv - w; sol = "$\\dim\\R^{" + a + "\\times" + b + "} = " + dv + "$ and $\\dim\\P_{" + (w - 1) + "} = " + w + "$; onto ⇒ rank $" + w + "$, so nullity $= " + dv + "-" + w + " = " + ans + "$."; }
    return { q: "<p>" + q + "</p>", ans: { type: "num", answer: ans }, model: String(ans),
      hints: ["Rank–Nullity: $\\Rank T+\\Nullity T = \\dim(\\text{domain})$.", "Identify the dimension of the DOMAIN.", "Injective ⇔ nullity 0; surjective ⇔ rank $=\\dim$(codomain).", "Remember $\\dim\\P_n = n+1$ and $\\dim\\R^{m\\times n} = mn$."],
      sol: "<p>" + sol + "</p>" };
  } });

  def({ id: "inj-surj", topic: "isomorphisms", title: "Injective / surjective linear map", gen(r, diff) {
    const opts = ["injective only", "surjective only", "bijective (an isomorphism)", "neither"];
    if (diff === "challenge") {
      const pool = [["T:\\P_2\\to\\P_2,\\ T(p) = p'", 3, "$\\ker T = $ constants (not injective) and $\\Ran T = \\P_1\\neq\\P_2$."], ["T:\\P_2\\to\\P_2,\\ T(p) = p+p'", 2, "$\\ker T = \\{0\\}$ (degree argument), and injective + equal dimensions ⇒ bijective."], ["T:\\P_2\\to\\P_3,\\ T(p) = xp", 0, "$xp = 0\\Rightarrow p = 0$, but $1\\notin\\Ran T$."], ["T:\\P_3\\to\\P_2,\\ T(p) = p'", 1, "Every quadratic is a derivative of a cubic, but $T(1) = 0$."], ["T:\\R^{2\\times2}\\to\\R^{2\\times2},\\ T(A) = A^T", 2, "$T\\circ T = \\mathrm{id}$, so $T$ is its own inverse."], ["T:\\R^{2\\times2}\\to\\R,\\ T(A) = \\operatorname{tr}A", 1, "$\\operatorname{tr}(tE_{11}) = t$ hits everything; $\\operatorname{tr}E_{12} = 0$."]];
      const [Ts, k, why] = r.pick(pool);
      return { q: "<p>Classify $" + Ts + "$.</p>", opts, ans: { type: "mcq", answer: k }, model: String(k), hints: ["Injective ⇔ $\\ker T = \\{0\\}$.", "Surjective ⇔ $\\Rank T = \\dim W$.", "Compare dimensions: $\\dim V\\lt\\dim W$ ⇒ not onto; $\\dim V\\gt\\dim W$ ⇒ not one-to-one.", "Rank–Nullity links the two."], sol: "<p><b>" + opts[k] + "</b>: " + why + "</p>" };
    }
    const [m, n] = diff === "beginner" ? r.pick([[2, 2], [2, 3], [3, 2]]) : diff === "standard" ? [3, 3] : r.pick([[3, 4], [4, 3], [3, 3]]);
    const k = r.int(1, Math.min(m, n)), A = H.rankMat(r, m, n, k, 6);
    const inj = k === n, sur = k === m, ans = inj && sur ? 2 : inj ? 0 : sur ? 1 : 3;
    return { q: "<p>$T:\\R^" + n + "\\to\\R^" + m + "$, $T(x) = Ax$ with $A = " + mt(A) + "$. Classify $T$.</p>", opts, ans: { type: "mcq", answer: ans }, model: String(ans),
      hints: ["Find $\\Rank A$ by row reduction.", "Injective ⇔ $\\Rank A = n = " + n + "$ (no free variables).", "Surjective ⇔ $\\Rank A = m = " + m + "$ (a pivot in every row).", "$\\Rank A = " + k + "$."],
      sol: "<p>$\\Rank A = " + k + "$. Injective iff rank $= " + n + "$: " + (inj ? "yes" : "no") + ". Surjective iff rank $= " + m + "$: " + (sur ? "yes" : "no") + ". So $T$ is <b>" + opts[ans] + "</b>.</p>" };
  } });

  def({ id: "inverse-map", topic: "isomorphisms", title: "Inverse of a linear map", gen(r, diff) {
    const n = diff === "advanced" ? 3 : 2;
    const A = diff === "beginner" || diff === "advanced" ? H.unimod(r, n, n + 1, diff === "advanced" ? 1 : 2) : H.nonsingular(r, 2, -4, 4);
    const Ai = H.inv(A), vars = n === 2 ? XY : XYZ;
    return { q: "<p>$T:\\R^" + n + "\\to\\R^" + n + "$, $T(" + vars.join(",") + ") = " + mapTex(A, vars) + "$ is invertible. Find the standard matrix of $T^{-1}$" + (diff === "challenge" ? " and hence a formula for $T^{-1}(x,y)$" : "") + ".</p>", ans: { type: "mat", answer: Ai }, model: ms(Ai), input: "area",
      hints: ["$[T^{-1}] = [T]^{-1}$.", n === 2 ? "For $\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ the inverse is $\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$." : "Row-reduce $[A\\,|\\,I]$ to $[I\\,|\\,A^{-1}]$.", "$\\det[T] = " + H.det(A).tex() + "$.", "Check: $[T][T^{-1}] = I$."],
      sol: "<p>$[T] = " + mt(A) + "$, $\\det = " + H.det(A).tex() + "$, so $[T^{-1}] = " + mt(Ai) + "$" + (n === 2 ? ", i.e. $T^{-1}(x,y) = " + mapTex(Ai, XY) + "$" : "") + ".</p>" };
  } });

  def({ id: "dim-L", topic: "isomorphisms", title: "Dimension of L(V, W)", gen(r) {
    const sp = () => r.pick([() => { const n = r.int(1, 5); return ["\\R^{" + n + "}", n]; }, () => { const n = r.int(1, 4); return ["\\P_{" + n + "}", n + 1]; }, () => { const a = r.int(1, 3), b = r.int(2, 3); return ["\\R^{" + a + "\\times" + b + "}", a * b]; }])();
    const [V, dv] = sp(), [W, dw] = sp();
    return { q: "<p>Find $\\dim\\Lin(" + V + "," + W + ")$.</p>", ans: { type: "num", answer: dv * dw }, model: String(dv * dw),
      hints: ["$\\dim\\Lin(V,W) = \\dim V\\cdot\\dim W$ (Theorem 3.3.2).", "$\\dim\\P_n = n+1$, $\\dim\\R^{a\\times b} = ab$.", "$\\dim " + V + " = " + dv + "$.", "$\\dim " + W + " = " + dw + "$."],
      sol: "<p>$\\dim\\Lin(" + V + "," + W + ") = " + dv + "\\cdot" + dw + " = " + dv * dw + "$ — a linear map is a $" + dw + "\\times" + dv + "$ matrix once bases are fixed.</p>" };
  } });

  def({ id: "mat-bases", topic: "matrix-of-map", title: "Matrix of T relative to bases", gen(r, diff) {
    if (diff === "challenge") {
      const Bm = [[1, 1, 1], [0, 1, 1], [0, 0, 1]].map((row, i) => row), Cm = [[1, 1], [0, 1]]; // columns: B = {1, 1+x, 1+x+x^2}, C = {1, 1+x}
      const sh = r.int(1, 3);
      const D = [[0, 1, 0], [0, 0, 2]].map((row, i) => row.map((x, j) => x * (i === 0 && j === 0 ? 1 : 1))); // derivative P2->P1
      const Dm = sh === 1 ? D : [[0, sh, 0], [0, 0, 2 * sh]];
      const A = H.mul(H.inv(Cm), H.mul(Dm, Bm));
      return { q: "<p>$T:\\P_2\\to\\P_1$, $T(p) = " + (sh === 1 ? "" : sh) + "p'$. Find $[T]^{\\Cc}_{\\B}$ for $\\B = \\{1,\\ 1+x,\\ 1+x+x^2\\}$ and $\\Cc = \\{1,\\ 1+x\\}$.</p>", ans: { type: "mat", answer: A }, model: ms(A), input: "area",
        hints: ["Column $j$ = $[T(b_j)]_{\\Cc}$.", "$T(1) = 0$, $T(1+x) = " + sh + "$, $T(1+x+x^2) = " + H.aff(2 * sh, sh) + "$.", "Write each image as $\\alpha\\cdot1+\\beta(1+x)$.", "$" + H.aff(2 * sh, sh) + " = " + (sh - 2 * sh) + "\\cdot1+" + 2 * sh + "(1+x)$."],
        sol: "<p>Images: $0$, $" + sh + " = " + sh + "\\cdot1+0(1+x)$, $" + H.aff(2 * sh, sh) + " = " + -sh + "\\cdot1+" + 2 * sh + "(1+x)$. Hence $[T]^{\\Cc}_{\\B} = " + mt(A) + "$.</p>" };
    }
    const n = diff === "advanced" ? 3 : 2, m = 2;
    const A0 = r.intMat(m, n, -3, 3);
    const Bm = diff === "beginner" ? H.unimod(r, n, 2, 1) : H.unimod(r, n, n + 1, 1);
    const Cm = diff === "beginner" ? [[1, 0], [0, 1]] : H.unimod(r, m, 2, 1);
    const A = H.mul(H.inv(Cm), H.mul(A0, Bm));
    const b = colsOf(Bm), c = colsOf(Cm), vars = n === 2 ? XY : XYZ;
    const imgs = b.map((v) => LA.M.mulVec(H.FR(A0), v));
    return { q: "<p>$T:\\R^" + n + "\\to\\R^2$, $T(" + vars.join(",") + ") = " + mapTex(A0, vars) + "$. Find $[T]^{\\Cc}_{\\B}$ for $\\B = \\{" + b.map(vt).join(",") + "\\}$ and $\\Cc = \\{" + c.map(vt).join(",") + "\\}$" + (diff === "beginner" ? " (the standard basis)" : "") + ".</p>", ans: { type: "mat", answer: A }, model: ms(A), input: "area",
      hints: ["Column $j$ of $[T]^{\\Cc}_{\\B}$ is the coordinate vector $[T(b_j)]_{\\Cc}$.", "Compute $T(b_1),\\dots$: " + imgs.map((w, j) => "$T(b_" + (j + 1) + ") = " + vt(w) + "$").join(", ") + ".", diff === "beginner" ? "In the standard basis, coordinates are just the components." : "Solve all at once: row-reduce $(c_1\\;c_2\\,|\\,T(b_1)\\cdots T(b_" + n + "))$.", "The answer is a $2\\times" + n + "$ matrix."],
      sol: "<p>$T(b_j)$: " + imgs.map(vt).join(", ") + ". Row-reducing $(c_1\\;c_2\\,|\\,T(b_1)\\cdots)$ to $(I\\,|\\,\\ast)$ gives $[T]^{\\Cc}_{\\B} = " + mt(A) + "$.</p>" };
  } });

  def({ id: "mat-poly", topic: "matrix-of-map", title: "Matrix of an operator on polynomials", gen(r, diff) {
    const a = r.int(-3, 3), b = r.int(-2, 2), c = r.nz(-3, 3), s = r.nz(-2, 2);
    const ops = {
      beginner: [["p'", (p) => p.deriv()], [c + "p", (p) => p.scale(c)]],
      standard: [[sumT([[a, "p'"], [b, "xp'"], [c, "p"]]), (p) => p.deriv().scale(a).add(Poly.X().mul(p.deriv()).scale(b)).add(p.scale(c))], [sumT([[1, "p'"], [c, "xp''"]]), (p) => p.deriv().add(Poly.X().mul(p.deriv().deriv()).scale(c))]],
      advanced: [["p(x" + (s > 0 ? "+" : "") + s + ")", (p) => { let out = new Poly([]); p.c.forEach((co, i) => { out = out.add(new Poly([s, 1]).pow(i).scale(co)); }); return out; }]],
      challenge: [["\\int_0^x p(t)\\,dt", (p) => p.antideriv(), 4], ["(x" + (s > 0 ? "+" : "") + s + ")\\,p(x)", (p) => new Poly([s, 1]).mul(p), 4], ["\\int_0^x p(t)\\,dt+" + (c === 1 ? "" : c) + "p'", (p) => p.antideriv().add(p.deriv().scale(c)), 4]],
    }[diff];
    const [f, op, rows] = r.pick(ops);
    const m = rows || 3;
    const basis = [new Poly([1]), Poly.X(), Poly.mono(2)];
    const cols = basis.map((bp) => { const q = op(bp); return Array.from({ length: m }, (_, i) => q.coef(i)); });
    const A = LA.M.fromCols(cols);
    return { q: "<p>$T:\\P_2\\to\\P_" + (m - 1) + "$, $T(p) = " + f + "$. Find the matrix of $T$ relative to the standard bases $\\{1,x" + (m === 4 ? ",x^2,x^3" : ",x^2") + "\\}$.</p>", ans: { type: "mat", answer: A }, model: ms(A), input: "area",
      hints: ["Apply $T$ to each basis polynomial $1$, $x$, $x^2$.", "Column $j$ = coefficients of $T(\\text{basis}_j)$ in the order $1, x, x^2" + (m === 4 ? ", x^3" : "") + "$.", "$T(1) = " + H.pt(cols[0]) + "$.", "$T(x^2) = " + H.pt(cols[2]) + "$."],
      sol: "<p>$T(1) = " + H.pt(cols[0]) + "$, $T(x) = " + H.pt(cols[1]) + "$, $T(x^2) = " + H.pt(cols[2]) + "$, so $[T] = " + mt(A) + "$.</p>" };
  } });

  def({ id: "use-matrix", topic: "matrix-of-map", title: "Use [T] to compute T(v)", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3;
    const A = r.intMat(n, n, -3, 3), vb = r.intVec(n, -3, 3);
    if (diff === "beginner" || diff === "standard") {
      const w = LA.M.mulVec(H.FR(A), vb.map(fr));
      return { q: "<p>$[T]^{\\Cc}_{\\B} = " + mt(A) + "$ and $[v]_{\\B} = " + ct(vb) + "$. Find $[T(v)]_{\\Cc}$.</p>", ans: { type: "vec", answer: w }, model: vs(w),
        hints: ["Theorem 3.4.3: $[T(v)]_{\\Cc} = [T]^{\\Cc}_{\\B}[v]_{\\B}$.", "Multiply the matrix by the column vector.", "Entry $i$ = row $i$ · $[v]_{\\B}$.", "First entry: $" + w[0].tex() + "$."], sol: "<p>$[T(v)]_{\\Cc} = " + mt(A) + ct(vb) + " = " + ct(w) + "$.</p>" };
    }
    const Bm = H.unimod(r, 2, 2, 1), Cm = H.unimod(r, 2, 2, 1), A2 = r.intMat(2, 2, -3, 3), v = r.intVec(2, -4, 4);
    const vB = LA.M.mulVec(H.inv(Bm), v.map(fr)), tC = LA.M.mulVec(H.FR(A2), vB), Tv = LA.M.mulVec(H.FR(Cm), tC);
    const b = colsOf(Bm), c = colsOf(Cm);
    return { q: "<p>$T:\\R^2\\to\\R^2$ has $[T]^{\\Cc}_{\\B} = " + mt(A2) + "$ where $\\B = \\{" + b.map(vt).join(",") + "\\}$, $\\Cc = \\{" + c.map(vt).join(",") + "\\}$. Find $T" + vt(v) + "$ (standard coordinates).</p>", ans: { type: "vec", answer: Tv }, model: vs(Tv),
      hints: ["Three moves: $v\\to[v]_{\\B}\\to[T(v)]_{\\Cc}\\to T(v)$.", "$[v]_{\\B} = " + vt(vB) + "$.", "$[T(v)]_{\\Cc} = A[v]_{\\B} = " + vt(tC) + "$.", "$T(v) = " + tC[0].tex() + "c_1+" + tC[1].tex() + "c_2$."],
      sol: "<p>$[v]_{\\B} = " + vt(vB) + "$, $[T(v)]_{\\Cc} = " + mt(A2) + ct(vB) + " = " + ct(tC) + "$, so $T(v) = (" + tC[0].tex() + ")" + vt(c[0]) + "+(" + tC[1].tex() + ")" + vt(c[1]) + " = " + vt(Tv) + "$.</p>" };
  } });

  def({ id: "cob", topic: "change-of-basis", title: "Change of basis", gen(r, diff) {
    const n = diff === "advanced" ? 3 : 2;
    const P = H.unimod(r, n, n + 1, 1), b = colsOf(P);
    if (diff === "beginner") {
      const v = r.intVec(2, -5, 5), c = LA.M.mulVec(H.inv(P), v.map(fr));
      return { q: "<p>$\\B = \\{" + b.map(vt).join(",") + "\\}$. The transition matrix from $\\B$-coordinates to standard coordinates is $P = " + mt(P) + "$. Find $[v]_{\\B}$ for $v = " + vt(v) + "$.</p>", ans: { type: "vec", answer: c }, model: vs(c),
        hints: ["$v = P[v]_{\\B}$, so $[v]_{\\B} = P^{-1}v$.", "$P^{-1} = " + mt(H.inv(P)) + "$.", "Or solve $c_1b_1+c_2b_2 = v$ directly.", "$c_1 = " + c[0].tex() + "$."], sol: "<p>$[v]_{\\B} = P^{-1}v = " + mt(H.inv(P)) + ct(v) + " = " + ct(c) + "$.</p>" };
    }
    if (diff === "challenge") {
      const Q = H.unimod(r, 2, 3, 1), cc = colsOf(Q), M0 = H.mul(H.inv(Q), P);
      return { q: "<p>$\\B = \\{" + b.map(vt).join(",") + "\\}$ and $\\Cc = \\{" + cc.map(vt).join(",") + "\\}$ are bases of $\\R^2$. Find the transition matrix $P_{\\Cc\\leftarrow\\B}$ with $[v]_{\\Cc} = P_{\\Cc\\leftarrow\\B}[v]_{\\B}$.</p>", ans: { type: "mat", answer: M0 }, model: ms(M0), input: "area",
        hints: ["Column $j$ of $P_{\\Cc\\leftarrow\\B}$ is $[b_j]_{\\Cc}$.", "Route through standard coordinates: $P_{\\Cc\\leftarrow\\B} = C^{-1}B$.", "$C^{-1} = " + mt(H.inv(Q)) + "$.", "Multiply $C^{-1}B$."], sol: "<p>$P_{\\Cc\\leftarrow\\B} = C^{-1}B = " + mt(H.inv(Q)) + mt(P) + " = " + mt(M0) + "$.</p>" };
    }
    const A = r.intMat(n, n, -3, 3), TB = H.mul(H.inv(P), H.mul(A, P));
    return { q: "<p>$T(x) = Ax$ with $A = " + mt(A) + "$. Find $[T]_{\\B}$ for $\\B = \\{" + b.map(vt).join(",") + "\\}$.</p>", ans: { type: "mat", answer: TB }, model: ms(TB), input: "area",
      hints: ["$[T]_{\\B} = P^{-1}AP$ where the columns of $P$ are the $\\B$ vectors.", "$P = " + mt(P) + "$, $P^{-1} = " + mt(H.inv(P)) + "$.", "Compute $AP$ first, then multiply by $P^{-1}$ on the left.", "$AP = " + mt(H.mul(A, P)) + "$."],
      sol: "<p>$[T]_{\\B} = P^{-1}AP = " + mt(H.inv(P)) + mt(H.mul(A, P)) + " = " + mt(TB) + "$. (Column $j$ is $[T(b_j)]_{\\B}$.) Note $\\operatorname{tr}$ and $\\det$ are unchanged: $" + (A.reduce((s, row, i) => s + row[i], 0)) + "$ and $" + H.det(A).tex() + "$.</p>" };
  } });

  def({ id: "similar", topic: "change-of-basis", title: "Could A and B be similar?", gen(r, diff) {
    const A = r.intMat(2, 2, -3, 3), P = H.unimod(r, 2, 3, 1);
    const tr = (M) => M[0][0].add ? M[0][0].add(M[1][1]) : fr(M[0][0] + M[1][1]);
    let B, yes, why;
    const kind = diff === "challenge" ? r.pick(["trap", "sim"]) : r.pick(["sim", "trace", "det"]);
    if (kind === "sim") { B = H.mul(H.inv(P), H.mul(A, P)); yes = true; why = "Indeed $B = P^{-1}AP$ with $P = " + mt(P) + "$."; }
    else if (kind === "trace") { B = H.mul(H.inv(P), H.mul(A, P)); B[0][0] = B[0][0].add(r.nz(-2, 2)); yes = false; why = "$\\operatorname{tr}A = " + tr(H.FR(A)).tex() + "\\neq" + tr(B).tex() + " = \\operatorname{tr}B$, but similar matrices have equal traces."; }
    else if (kind === "det") { B = H.mul(H.inv(P), H.mul(A, P)); const t = B[0][1]; B[0][1] = B[1][0]; B[1][0] = t.add(1); yes = H.det(B).eq(H.det(A)) && tr(B).eq(tr(H.FR(A))) ? null : false; if (yes === null) { B = H.mul(H.inv(P), H.mul(A, P)); yes = true; why = "Indeed $B = P^{-1}AP$ with $P = " + mt(P) + "$."; } else why = "$\\det A = " + H.det(A).tex() + "$ but $\\det B = " + LA.alg.det(B).tex() + "$; similar matrices have equal determinants."; }
    else { const l = r.int(-3, 3); return { q: "<p>Can $A = " + mt([[l, 0], [0, l]]) + "$ and $B = " + mt([[l, 1], [0, l]]) + "$ be similar?</p>", ans: { type: "tf", answer: false }, model: "false", tf: ["Yes", "No"],
      hints: ["Compare trace, determinant and eigenvalues — they all agree here!", "So invariants can't settle it. Think about what $P^{-1}AP$ is when $A = " + l + "I$.", "$P^{-1}(" + l + "I)P = " + l + "I$ for every $P$.", "The only matrix similar to a scalar matrix is itself."],
      sol: "<p><b>No.</b> $P^{-1}(" + l + "I)P = " + l + "I\\neq B$ for every invertible $P$. Equal trace, determinant and eigenvalues are necessary for similarity but NOT sufficient.</p>" }; }
    return { q: "<p>Can $A = " + mt(A) + "$ and $B = " + mt(B) + "$ be similar?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Yes", "No"],
      hints: ["Similar matrices share trace, determinant, rank, characteristic polynomial and eigenvalues.", "Compare the traces first.", "Then compare the determinants.", "If all invariants match, look for $P$ with $AP = PB$."],
      sol: "<p><b>" + (yes ? "Yes" : "No") + ".</b> " + why + "</p>" };
  } });

  /* ======================= Chapter 4 ======================= */
  const wdot = (u, v, w) => u.reduce((s, x, i) => s.add(fr(x).mul(fr(v[i])).mul(fr(w ? w[i] : 1))), Frac.ZERO);
  const wTex = (w, n) => Array.from({ length: n }, (_, i) => (w[i] === 1 ? "" : w[i]) + "u_" + (i + 1) + "v_" + (i + 1)).join("+");
  const sq = (f) => LA.num.sqrtTex(fr(f)), sqS = (f) => "sqrt(" + fr(f).toString() + ")";
  const ipPoly = (p, q, a, b) => new Poly(p).mul(new Poly(q)).integrate(fr(a), fr(b));

  def({ id: "ip-eval", topic: "inner-products", title: "Evaluate an inner product", gen(r, diff) {
    if (diff === "beginner" || diff === "standard") {
      const n = 3, u = r.intVec(n, -4, 4), v = r.intVec(n, -4, 4), w = diff === "beginner" ? [1, 1, 1] : r.intVec(n, 1, 4);
      const val = wdot(u, v, w);
      return { q: "<p>On $\\R^3$ let $\\langle u,v\\rangle = " + wTex(w, 3) + "$. Compute $\\langle " + vt(u) + "," + vt(v) + "\\rangle$.</p>", ans: { type: "num", answer: val }, model: val.toString(),
        hints: ["Substitute the components into the formula.", "$u_1 = " + u[0] + "$, $v_1 = " + v[0] + "$, …", "Multiply the weights in.", "Add the three products."], sol: "<p>$" + u.map((x, i) => (w[i] === 1 ? "" : w[i] + "\\cdot") + "(" + x + ")(" + v[i] + ")").join("+") + " = " + val.tex() + "$.</p>" };
    }
    const [a, b] = diff === "advanced" ? [0, 1] : [-1, 1];
    const deg = diff === "advanced" ? 1 : 2;
    const p = r.intVec(deg + 1, -3, 3), q = r.intVec(deg + 1, -3, 3);
    const val = ipPoly(p, q, a, b);
    return { q: "<p>On $\\P_" + deg + "$ let $\\langle p,q\\rangle = \\int_{" + a + "}^{" + b + "}p(x)q(x)\\,dx$. Compute $\\langle " + H.pt(p) + ",\\ " + H.pt(q) + "\\rangle$.</p>", ans: { type: "num", answer: val }, model: val.toString(),
      hints: ["Multiply the polynomials first.", "$p q = " + H.pt(new Poly(p).mul(new Poly(q)).c) + "$.", "Integrate term by term: $\\int x^k dx = \\frac{x^{k+1}}{k+1}$.", a === -1 ? "On $[-1,1]$ odd powers integrate to $0$." : "Evaluate at $1$ minus at $0$."],
      sol: "<p>$\\int_{" + a + "}^{" + b + "}(" + H.pt(new Poly(p).mul(new Poly(q)).c) + ")\\,dx = " + val.tex() + "$.</p>" };
  } });

  def({ id: "ip-check", topic: "inner-products", title: "Is it an inner product?", gen(r, diff) {
    if (diff === "challenge" && r.bool(0.5)) {
      const pool = [["|u_1v_1|+u_2v_2", "not linear: $\\langle -u,v\\rangle = \\langle u,v\\rangle\\neq-\\langle u,v\\rangle$ in general (e.g. $u = v = (1,0)$)."], ["u_1v_1+u_2v_2+1", "$\\langle 0,0\\rangle = 1\\neq0$, so it is not linear (and coincidence fails)."], ["u_1^2v_1^2+u_2v_2", "not linear: $\\langle 2u,v\\rangle = 4\\langle u,v\\rangle$ in the first term."], ["u_1v_2", "not symmetric: $\\langle(1,0),(0,1)\\rangle = 1$ but $\\langle(0,1),(1,0)\\rangle = 0$."]];
      const [f, why] = r.pick(pool);
      return { q: "<p>Is $\\langle u,v\\rangle = " + f + "$ an inner product on $\\R^2$?</p>", ans: { type: "tf", answer: false }, model: "false", tf: ["Yes", "No"], hints: ["Check the four axioms: positivity, coincidence, symmetry, linearity.", "Try $u = 0$ or scaling $u$ by $2$ or $-1$.", "Swap $u$ and $v$ for symmetry.", "One axiom fails badly."], sol: "<p><b>No</b> — " + why + "</p>" };
    }
    let a, b, c;
    if (diff === "beginner") { a = r.int(-1, 3); b = 0; c = r.int(-1, 3); }
    else { a = r.int(-2, 4); b = r.int(-3, 3); c = r.int(-2, 4); }
    const yes = a > 0 && a * c - b * b > 0;
    const f = H.lin([a, 2 * b, c], ["u_1v_1", "(u_1v_2+u_2v_1)/2\\cdot", "u_2v_2"]).replace(/(\d*)\(u_1v_2\+u_2v_1\)\/2\\cdot/, (m0, k) => (k === "" ? "" : k === "2" ? "" : String(+k / 2)) + "(u_1v_2+u_2v_1)");
    const form = (a === 0 ? "" : (a === 1 ? "" : a === -1 ? "-" : a) + "u_1v_1") + (b === 0 ? "" : (b > 0 ? (a !== 0 ? "+" : "") : "-") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "(u_1v_2+u_2v_1)") + (c === 0 ? "" : (c > 0 ? (a !== 0 || b !== 0 ? "+" : "") : "-") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + "u_2v_2") || "0";
    void f;
    const why = yes ? "Symmetric and bilinear automatically; positivity: $\\langle u,u\\rangle = u^T\\begin{pmatrix}" + a + "&" + b + "\\\\" + b + "&" + c + "\\end{pmatrix}u$ and this matrix is positive definite ($" + a + "\\gt0$, $\\det = " + (a * c - b * b) + "\\gt0$), so $\\langle u,u\\rangle\\gt0$ for $u\\neq0$."
      : "It is symmetric and bilinear, but the matrix $\\begin{pmatrix}" + a + "&" + b + "\\\\" + b + "&" + c + "\\end{pmatrix}$ is not positive definite" + (a <= 0 ? " ($a_{11} = " + a + "\\le0$: try $u = (1,0)$, giving $\\langle u,u\\rangle = " + a + "$)" : " ($\\det = " + (a * c - b * b) + "\\le0$)") + ", so positivity or coincidence fails.";
    return { q: "<p>Is $\\langle u,v\\rangle = " + form + "$ an inner product on $\\R^2$?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Yes", "No"],
      hints: ["Forms $u^TMv$ with $M$ symmetric are automatically symmetric and linear.", "So everything hinges on positivity + coincidence: $\\langle u,u\\rangle\\gt0$ for $u\\neq0$.", "That means $M$ must be positive definite: for $2\\times2$, $m_{11}\\gt0$ and $\\det M\\gt0$.", "Here $M = \\begin{pmatrix}" + a + "&" + b + "\\\\" + b + "&" + c + "\\end{pmatrix}$."],
      sol: "<p><b>" + (yes ? "Yes" : "No") + ".</b> " + why + "</p>" };
  } });

  def({ id: "norm", topic: "norms-angles", title: "Norm / distance", gen(r, diff) {
    if (diff === "advanced") {
      const p = r.intVec(2, -3, 3); if (p.every((x) => !x)) p[0] = 1;
      const v = ipPoly(p, p, 0, 1);
      return { q: "<p>With $\\langle p,q\\rangle = \\int_0^1p(x)q(x)\\,dx$ on $\\P_1$, find $\\lVert " + H.pt(p) + "\\rVert$.</p>", ans: { type: "num", answer: sqS(v) }, model: sqS(v),
        hints: ["$\\lVert p\\rVert = \\sqrt{\\langle p,p\\rangle}$.", "Square the polynomial: $" + H.pt(new Poly(p).mul(new Poly(p)).c) + "$.", "Integrate from 0 to 1.", "$\\langle p,p\\rangle = " + v.tex() + "$."], sol: "<p>$\\lVert p\\rVert^2 = \\int_0^1(" + H.pt(new Poly(p).mul(new Poly(p)).c) + ")dx = " + v.tex() + "$, so $\\lVert p\\rVert = " + sq(v) + "$.</p>" };
    }
    const n = diff === "beginner" ? 3 : 3;
    const w = diff === "beginner" ? [1, 1, 1] : r.intVec(n, 1, 3);
    const u = r.intVec(n, -4, 4), v0 = r.intVec(n, -4, 4);
    const isDist = diff === "challenge";
    const d = isDist ? u.map((x, i) => x - v0[i]) : u;
    if (d.every((x) => !x)) d[0] = 1;
    const val = wdot(d, d, w);
    return { q: "<p>" + (w.every((x) => x === 1) ? "With the dot product on $\\R^3$" : "With $\\langle u,v\\rangle = " + wTex(w, 3) + "$ on $\\R^3$") + ", find " + (isDist ? "the distance $d(u,v)$ between $u = " + vt(u) + "$ and $v = " + vt(v0) + "$" : "$\\lVert " + vt(d) + "\\rVert$") + ".</p>", ans: { type: "num", answer: sqS(val) }, model: sqS(val), ph: "e.g. sqrt(14) or 3",
      hints: [isDist ? "$d(u,v) = \\lVert u-v\\rVert$; first compute $u-v = " + vt(d) + "$." : "$\\lVert v\\rVert = \\sqrt{\\langle v,v\\rangle}$.", "Use the GIVEN inner product (weights matter!).", "$\\langle v,v\\rangle = " + d.map((x, i) => (w[i] === 1 ? "" : w[i] + "\\cdot") + "(" + x + ")^2").join("+") + "$.", "$= " + val.tex() + "$; now take the square root."],
      sol: "<p>$" + (isDist ? "d(u,v)^2 = \\lVert u-v\\rVert^2" : "\\lVert v\\rVert^2") + " = " + d.map((x, i) => (w[i] === 1 ? "" : w[i] + "\\cdot") + "(" + x + ")^2").join("+") + " = " + val.tex() + "$, so the answer is $" + sq(val) + "$.</p>" };
  } });

  def({ id: "angle", topic: "norms-angles", title: "Angle between vectors", gen(r, diff) {
    let u, v; do { u = r.intVec(diff === "beginner" ? 2 : 3, -3, 3); v = r.intVec(u.length, -3, 3); } while (u.every((x) => !x) || v.every((x) => !x));
    const w = diff === "advanced" || diff === "challenge" ? r.intVec(u.length, 1, 3) : u.map(() => 1);
    const d = wdot(u, v, w), nu = wdot(u, u, w), nv = wdot(v, v, w), prod = nu.mul(nv);
    const sd = LA.num.sqrtFrac(prod); // √(nu nv) = coef √rad
    const cosT = sd.rad === 1n ? d.div(sd.coef).tex() : (d.isZero() ? "0" : (d.sign() < 0 ? "-" : "") + "\\frac{" + d.abs().div(sd.coef).tex() + "}{\\sqrt{" + sd.rad + "}}");
    const model = d.toString() + "/sqrt(" + prod.toString() + ")";
    return { q: "<p>" + (w.every((x) => x === 1) ? "Using the dot product" : "Using $\\langle u,v\\rangle = " + wTex(w, u.length) + "$") + ", find $\\cos\\theta$ for the angle $\\theta$ between $u = " + vt(u) + "$ and $v = " + vt(v) + "$.</p>", ans: { type: "num", answer: d.toNumber() / Math.sqrt(prod.toNumber()) }, model, ph: "e.g. 3/sqrt(14)",
      hints: ["$\\cos\\theta = \\dfrac{\\langle u,v\\rangle}{\\lVert u\\rVert\\,\\lVert v\\rVert}$.", "$\\langle u,v\\rangle = " + d.tex() + "$.", "$\\lVert u\\rVert^2 = " + nu.tex() + "$, $\\lVert v\\rVert^2 = " + nv.tex() + "$.", "Divide; simplify the surd."],
      sol: "<p>$\\cos\\theta = \\dfrac{" + d.tex() + "}{\\sqrt{" + nu.tex() + "}\\sqrt{" + nv.tex() + "}} = " + cosT + "$" + (d.isZero() ? " — the vectors are orthogonal ($\\theta = \\pi/2$)" : "") + ".</p>" };
  } });

  def({ id: "orth-k", topic: "orthogonality", title: "Make two vectors orthogonal", gen(r, diff) {
    if (diff === "advanced" || diff === "challenge") {
      let a, b, den; do { a = r.int(-3, 3); b = r.int(-3, 3); den = fr(a).add(fr(b).div(2)); } while (den.isZero());
      const k = fr(a).div(2).add(fr(b).div(3)).div(den).neg();
      return { q: "<p>With $\\langle p,q\\rangle = \\int_0^1 pq\\,dx$, find $k$ such that $x+k$ is orthogonal to $" + H.pt([a, b]) + "$.</p>", ans: { type: "num", answer: k }, model: k.toString(),
        hints: ["Orthogonal ⇔ inner product $= 0$.", "$\\int_0^1(x+k)(" + H.pt([a, b]) + ")dx$ is linear in $k$.", "$\\int_0^1x(" + H.pt([a, b]) + ")dx = " + fr(a).div(2).add(fr(b).div(3)).tex() + "$ and $\\int_0^1(" + H.pt([a, b]) + ")dx = " + den.tex() + "$.", "Solve $" + fr(a).div(2).add(fr(b).div(3)).tex() + "+" + den.tex() + "k = 0$."],
        sol: "<p>$\\langle x+k,q\\rangle = " + fr(a).div(2).add(fr(b).div(3)).tex() + "+(" + den.tex() + ")k = 0\\Rightarrow k = " + k.tex() + "$.</p>" };
    }
    const n = diff === "beginner" ? 2 : 3;
    let v; do { v = r.intVec(n, -4, 4); } while (v[n - 1] === 0);
    const u0 = r.intVec(n - 1, -4, 4), w = diff === "standard" ? r.intVec(n, 1, 3) : v.map(() => 1);
    const partial = u0.reduce((s, x, i) => s.add(fr(x).mul(v[i]).mul(w[i])), Frac.ZERO);
    const k = partial.div(fr(v[n - 1]).mul(w[n - 1])).neg();
    return { q: "<p>" + (w.every((x) => x === 1) ? "With the dot product" : "With $\\langle u,v\\rangle = " + wTex(w, n) + "$") + ", find $k$ so that $(" + u0.join(",") + ",k)\\perp" + vt(v) + "$.</p>", ans: { type: "num", answer: k }, model: k.toString(),
      hints: ["$u\\perp v\\iff\\langle u,v\\rangle = 0$.", "Write $\\langle u,v\\rangle$ as a linear expression in $k$.", "$\\langle u,v\\rangle = " + partial.tex() + "+" + (w[n - 1] * v[n - 1]) + "k$.", "Solve for $k$."], sol: "<p>$" + partial.tex() + "+(" + w[n - 1] * v[n - 1] + ")k = 0\\Rightarrow k = " + k.tex() + "$.</p>" };
  } });

  def({ id: "perp-basis", topic: "orthogonality", title: "Basis of an orthogonal complement", gen(r, diff) {
    if (diff === "challenge") {
      // S = span{1} in P2 with <p,q> = ∫_0^1 pq: S⊥ = {c0 + c1 x + c2 x^2 : c0 + c1/2 + c2/3 = 0}
      const k = r.pick([[1, 0, 0], [0, 1, 0]]);
      const row = [0, 1, 2].map((i) => ipPoly(k, Array.from({ length: 3 }, (_, j) => (j === i ? 1 : 0)), 0, 1));
      const B = LA.alg.nullspace([row]).basis.map((v) => LA.V.integerize(v, true).vec);
      return { q: "<p>In $\\P_2$ with $\\langle p,q\\rangle = \\int_0^1pq\\,dx$, let $S = \\spn\\{" + H.pt(k) + "\\}$. Find a basis for $S^\\perp$.</p>", ans: { type: "polyspan", answer: B, n: 3 }, model: B.map((c) => H.ps(c)).join(", "),
        hints: ["$q = c_0+c_1x+c_2x^2\\in S^\\perp\\iff\\langle " + H.pt(k) + ",q\\rangle = 0$.", "That is ONE linear equation in $c_0,c_1,c_2$: $" + row.map((x, i) => "(" + x.tex() + ")c_" + i).join("+") + " = 0$.", "Two free coefficients ⇒ $\\dim S^\\perp = 2$.", "Solve and read off two independent polynomials."],
        sol: "<p>The condition is $" + row.map((x, i) => "(" + x.tex() + ")c_" + i).join("+") + " = 0$, so $S^\\perp = \\spn\\{" + B.map((c) => H.pt(c)).join(",\\ ") + "\\}$ ($\\dim = 3-1 = 2$).</p>" };
    }
    const [n, k] = diff === "beginner" ? [3, 1] : diff === "standard" ? [3, 2] : [4, 2];
    let S; do { S = Array.from({ length: k }, () => r.intVec(n, -3, 3)); } while (H.rank(S) < k);
    const B = H.null(S);
    return { q: "<p>With the dot product on $\\R^" + n + "$, let $S = \\spn\\{" + S.map(vt).join(",") + "\\}$. Find a basis for $S^\\perp$.</p>", ans: { type: "span", answer: B }, model: ls(B),
      hints: ["$x\\in S^\\perp\\iff x\\cdot s = 0$ for each SPANNING vector $s$ (enough to check the spanning set).", "Put the spanning vectors as ROWS of a matrix $M$: $S^\\perp = \\Null(M)$.", "Row-reduce $M$ and solve.", "$\\dim S^\\perp = " + n + "-" + k + " = " + (n - k) + "$."],
      sol: "<p>$S^\\perp = \\Null" + mt(S) + "$." + H.steps(S, H.rref(S)) + "Basis: $" + B.map(vt).join(",\\ ") + "$ (check: each is orthogonal to every spanning vector).</p>" };
  } });

  // Gram–Schmidt (exact). ip: (u,v) => Frac
  function gsExact(vs, ip) {
    const us = [];
    vs.forEach((v) => {
      let u = v.map(fr);
      us.forEach((w) => { const c = ip(v, w).div(ip(w, w)); u = u.map((x, i) => x.sub(c.mul(w[i]))); });
      us.push(LA.V.integerize(u, true).vec);
    });
    return us;
  }
  def({ id: "gs", topic: "gram-schmidt", title: "Gram–Schmidt (orthogonal basis)", gen(r, diff) {
    const poly = diff === "challenge";
    const [n, k] = diff === "beginner" ? [2, 2] : diff === "standard" ? [3, 2] : poly ? [3, 3] : [3, 3];
    let V0;
    if (poly) V0 = [[1, 0, 0], [0, 1, 0], [r.int(-1, 1), r.int(-1, 1), 1]];
    else do { V0 = Array.from({ length: k }, () => r.intVec(n, -2, 3)); } while (H.rank(V0) < k);
    const ip = poly ? (u, v) => ipPoly(u, v, 0, 1) : (u, v) => wdot(u, v);
    const U = gsExact(V0, ip);
    const show = (u) => (poly ? H.pt(u) : vt(u));
    const check = (input) => {
      let L;
      try { L = poly ? LA.ans.polyList(input).map((p) => Array.from({ length: n }, (_, i) => p.coef(i))) : LA.ans.vectorList(input).map((v) => v.map((x) => { if (!x.exRe) throw new Error("use exact numbers (fractions)"); return x.exRe; })); }
      catch (e) { return { ok: false, score: 0, msg: "Couldn't read your answer: " + e.message, parseError: true }; }
      if (L.length !== k) return { ok: false, score: 0, msg: "Give exactly " + k + " " + (poly ? "polynomials" : "vectors") + "." };
      if (L.some((v) => v.length !== n)) return { ok: false, score: 0, msg: "Each vector needs " + n + " components." };
      if (L.some((v) => v.every((x) => x.isZero()))) return { ok: false, score: 0, msg: "A zero vector can't be in a basis." };
      for (let i = 0; i < k; i++) for (let j = 0; j < i; j++) if (!ip(L[i], L[j]).isZero()) return { ok: false, score: 0.3, msg: "Your vectors " + (j + 1) + " and " + (i + 1) + " are not orthogonal (inner product " + ip(L[i], L[j]).toString() + ")." };
      for (let i = 1; i <= k; i++) { const A = V0.slice(0, i).map((v) => v.map(fr)), B = L.slice(0, i); if (LA.alg.rank(A.concat(B)) !== i) return { ok: false, score: 0.5, msg: "Orthogonal, but not the Gram–Schmidt output: span of your first " + i + " vector(s) must equal span{v₁,…,v" + i + "} (keep the order!)." }; }
      return { ok: true, score: 1, msg: "Correct — orthogonal, and each partial span matches (any non-zero rescaling of the $u_i$ is fine)." };
    };
    const ipName = poly ? "\\langle p,q\\rangle = \\int_0^1pq\\,dx" : "the dot product";
    const steps = U.map((u, i) => "$u_" + (i + 1) + " = " + (i === 0 ? show(V0[0]) : "v_" + (i + 1) + " - " + U.slice(0, i).map((w, j) => "\\frac{\\langle v_" + (i + 1) + ",u_" + (j + 1) + "\\rangle}{\\langle u_" + (j + 1) + ",u_" + (j + 1) + "\\rangle}u_" + (j + 1)).join(" - ") + "\\;\\propto\\;" + show(u)) + "$").join("<br>");
    return { q: "<p>Apply Gram–Schmidt (with " + (poly ? "$" + ipName + "$" : ipName) + ") to $\\{" + V0.map(show).join(",\\ ") + "\\}$ in that order. Give the ORTHOGONAL basis $u_1,\\dots,u_" + k + "$ (rescaling each $u_i$ is allowed; don't normalise).</p>",
      ans: { type: "custom", fn: check }, model: poly ? U.map((c) => H.ps(c)).join(", ") : ls(U), ph: poly ? "e.g. 1, x - 1/2" : "(…), (…)",
      hints: ["$u_1 = v_1$.", "$u_2 = v_2-\\frac{\\langle v_2,u_1\\rangle}{\\langle u_1,u_1\\rangle}u_1$" + (k > 2 ? "; $u_3$ subtracts the components along $u_1$ AND $u_2$." : "."), "After each step check $\\langle u_i,u_j\\rangle = 0$; scaling by a positive number to clear fractions is fine.", "$u_2\\propto " + show(U[1]) + "$."],
      sol: "<p>" + steps + "</p><p>Orthogonal basis: $" + U.map(show).join(",\\ ") + "$ (scaled to clear fractions). Normalise each to get an orthonormal basis.</p>" };
  } });

  def({ id: "gs-onb", topic: "gram-schmidt", title: "Orthonormal basis (normalised)", gen(r, diff) {
    const [n, k] = diff === "beginner" ? [2, 2] : diff === "standard" ? [3, 2] : diff === "advanced" ? [3, 3] : [4, 3];
    let V0; do { V0 = Array.from({ length: k }, () => r.intVec(n, -2, 2)); } while (H.rank(V0) < k);
    const U = gsExact(V0, (u, v) => wdot(u, v));
    const norms = U.map((u) => wdot(u, u));
    const W = U.map((u, i) => u.map((x) => x.toNumber() / Math.sqrt(norms[i].toNumber())));
    const check = (input) => {
      let L; try { L = LA.ans.vectorList(input).map((v) => v.map((x) => x.re)); } catch (e) { return { ok: false, score: 0, msg: "Couldn't read your answer: " + e.message, parseError: true }; }
      if (L.length !== k || L.some((v) => v.length !== n)) return { ok: false, score: 0, msg: "Give " + k + " vectors with " + n + " components." };
      const close = (a, b) => Math.abs(a - b) < 1e-7;
      for (let i = 0; i < k; i++) {
        const nn = L[i].reduce((s, x) => s + x * x, 0);
        if (!close(nn, 1)) return { ok: false, score: 0.3, msg: "Vector " + (i + 1) + " is not a unit vector (length² ≈ " + nn.toFixed(4) + ")." };
        const same = L[i].every((x, j) => close(x, W[i][j])) || L[i].every((x, j) => close(x, -W[i][j]));
        if (!same) return { ok: false, score: 0.4, msg: "Vector " + (i + 1) + " doesn't match the Gram–Schmidt direction (it must be ±u" + (i + 1) + "/‖u" + (i + 1) + "‖, in the given order)." };
      }
      return { ok: true, score: 1, msg: "Correct orthonormal basis." };
    };
    const wt = (u, nn) => { const s = LA.num.sqrtFrac(nn); return "\\frac{1}{" + LA.num.surdTex(s) + "}" + vt(u); };
    const wsS = (u, nn) => "(" + u.map((x) => x.toString() + "/sqrt(" + nn.toString() + ")").join(", ") + ")";
    return { q: "<p>Find the orthonormal basis obtained by applying Gram–Schmidt (dot product) to $\\{" + V0.map(vt).join(",\\ ") + "\\}$ and normalising.</p>", ans: { type: "custom", fn: check }, model: U.map((u, i) => wsS(u, norms[i])).join(", "), ph: "e.g. (1/sqrt(2), 1/sqrt(2)), (…)",
      hints: ["First find the orthogonal vectors $u_i$, then divide each by its norm.", "$u_1 = v_1$, $\\lVert u_1\\rVert = " + sq(norms[0]) + "$.", "$u_2\\propto" + vt(U[1]) + "$.", "Type surds like 1/sqrt(6)."],
      sol: "<p>Orthogonal: $" + U.map(vt).join(",\\ ") + "$ with squared norms $" + norms.map((x) => x.tex()).join(", ") + "$. Orthonormal basis: $" + U.map((u, i) => wt(u, norms[i])).join(",\\ ") + "$.</p>" };
  } });

  def({ id: "proj", topic: "projections", title: "Orthogonal projection", gen(r, diff) {
    if (diff === "challenge") { // least-squares line
      const xs = r.sample([-2, -1, 0, 1, 2, 3], r.pick([3, 4])).sort((a, b) => a - b), ys = xs.map(() => r.int(-3, 5));
      const A = xs.map((x) => [1, x]), At = LA.M.T(H.FR(A)), ATA = LA.M.mul(At, H.FR(A)), ATy = LA.M.mulVec(At, ys.map(fr));
      const sol = LA.M.mulVec(LA.alg.inverse(ATA), ATy);
      return { q: "<p>Find the least-squares line $y = a+bx$ for the points " + xs.map((x, i) => "$(" + x + "," + ys[i] + ")$").join(", ") + ". Give $(a,b)$.</p>", ans: { type: "vec", answer: sol }, model: vs(sol),
        hints: ["Least squares = projecting $y$ onto the column space of $A = (1\\;\\;x)$.", "Solve the normal equations $A^TA\\binom ab = A^Ty$.", "$A^TA = " + mt(ATA) + "$, $A^Ty = " + ct(ATy) + "$.", "Solve the $2\\times2$ system."],
        sol: "<p>$A^TA = " + mt(ATA) + "$, $A^Ty = " + ct(ATy) + "$, so $\\binom ab = " + ct(sol) + "$: $y = " + H.aff(sol[1], sol[0]) + "$.</p>" };
    }
    if (diff === "advanced") {
      let u1, u2; do { u1 = r.intVec(3, -2, 2); const t = r.intVec(3, -2, 2); const c = wdot(t, u1).div(wdot(u1, u1).isZero() ? fr(1) : wdot(u1, u1)); u2 = LA.V.integerize(t.map((x, i) => fr(x).sub(c.mul(u1[i]))), true).vec.map((x) => Number(x.n)); } while (u1.every((x) => !x) || u2.every((x) => !x) || !wdot(u1, u2).isZero());
      const v = r.intVec(3, -4, 4);
      const p = [u1, u2].reduce((acc, u) => { const c = wdot(v, u).div(wdot(u, u)); return acc.map((x, i) => x.add(c.mul(u[i]))); }, [0, 0, 0].map(fr));
      return { q: "<p>$u_1 = " + vt(u1) + "$ and $u_2 = " + vt(u2) + "$ are orthogonal. Find the orthogonal projection of $v = " + vt(v) + "$ onto $W = \\spn\\{u_1,u_2\\}$.</p>", ans: { type: "vec", answer: p }, model: vs(p),
        hints: ["For an ORTHOGONAL basis: $\\mathrm{proj}_Wv = \\frac{\\langle v,u_1\\rangle}{\\langle u_1,u_1\\rangle}u_1+\\frac{\\langle v,u_2\\rangle}{\\langle u_2,u_2\\rangle}u_2$.", "$\\langle v,u_1\\rangle = " + wdot(v, u1).tex() + "$, $\\langle u_1,u_1\\rangle = " + wdot(u1, u1).tex() + "$.", "$\\langle v,u_2\\rangle = " + wdot(v, u2).tex() + "$, $\\langle u_2,u_2\\rangle = " + wdot(u2, u2).tex() + "$.", "Check: $v-\\mathrm{proj}$ is orthogonal to $u_1$ and $u_2$."],
        sol: "<p>$\\mathrm{proj}_Wv = \\frac{" + wdot(v, u1).tex() + "}{" + wdot(u1, u1).tex() + "}" + vt(u1) + "+\\frac{" + wdot(v, u2).tex() + "}{" + wdot(u2, u2).tex() + "}" + vt(u2) + " = " + vt(p) + "$.</p>" };
    }
    const n = diff === "beginner" ? 2 : 3;
    let u; do { u = r.intVec(n, -3, 3); } while (u.every((x) => !x));
    const v = r.intVec(n, -4, 4), c = wdot(v, u).div(wdot(u, u)), p = u.map((x) => c.mul(x));
    return { q: "<p>Find the orthogonal projection of $v = " + vt(v) + "$ onto the line spanned by $u = " + vt(u) + "$ (dot product).</p>", ans: { type: "vec", answer: p }, model: vs(p),
      hints: ["$\\mathrm{proj}_uv = \\dfrac{\\langle v,u\\rangle}{\\langle u,u\\rangle}u$.", "$\\langle v,u\\rangle = " + wdot(v, u).tex() + "$.", "$\\langle u,u\\rangle = " + wdot(u, u).tex() + "$.", "Multiply $u$ by $" + c.tex() + "$."],
      sol: "<p>$\\mathrm{proj}_uv = \\frac{" + wdot(v, u).tex() + "}{" + wdot(u, u).tex() + "}" + vt(u) + " = " + vt(p) + "$. Check: $v-\\mathrm{proj}_uv\\perp u$.</p>" };
  } });

  def({ id: "dist-sub", topic: "projections", title: "Distance to a line or plane", gen(r, diff) {
    if (diff === "beginner" || diff === "standard") {
      let u; do { u = r.intVec(diff === "beginner" ? 2 : 3, -3, 3); } while (u.every((x) => !x));
      const v = r.intVec(u.length, -4, 4), c = wdot(v, u).div(wdot(u, u)), e = v.map((x, i) => fr(x).sub(c.mul(u[i]))), d2 = wdot(e, e);
      return { q: "<p>Find the distance from $v = " + vt(v) + "$ to the line $\\spn\\{" + vt(u) + "\\}$.</p>", ans: { type: "num", answer: sqS(d2) }, model: sqS(d2),
        hints: ["Distance = $\\lVert v-\\mathrm{proj}_uv\\rVert$.", "$\\mathrm{proj}_uv = " + vt(u.map((x) => c.mul(x))) + "$.", "$v-\\mathrm{proj}_uv = " + vt(e) + "$.", "Take its norm."], sol: "<p>$v-\\mathrm{proj}_uv = " + vt(e) + "$, so the distance is $\\sqrt{" + d2.tex() + "} = " + sq(d2) + "$.</p>" };
    }
    let nv; do { nv = r.intVec(3, -3, 3); } while (nv.every((x) => !x));
    const v = r.intVec(3, -4, 4), d = wdot(nv, v), nn = wdot(nv, nv), d2 = d.mul(d).div(nn);
    return { q: "<p>Find the distance from $v = " + vt(v) + "$ to the plane $" + H.lin(nv, XYZ) + " = 0$ in $\\R^3$.</p>", ans: { type: "num", answer: sqS(d2) }, model: sqS(d2),
      hints: ["The plane is $\\{n\\}^\\perp$ with normal $n = " + vt(nv) + "$.", "The distance is the length of the projection of $v$ onto $n$.", "$= \\dfrac{|\\langle v,n\\rangle|}{\\lVert n\\rVert}$.", "$\\langle v,n\\rangle = " + d.tex() + "$, $\\lVert n\\rVert^2 = " + nn.tex() + "$."],
      sol: "<p>Distance $= \\dfrac{|" + d.tex() + "|}{\\sqrt{" + nn.tex() + "}} = " + sq(d2) + "$.</p>" };
  } });
})();
