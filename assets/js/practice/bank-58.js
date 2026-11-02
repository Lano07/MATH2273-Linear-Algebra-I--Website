/* Question generators — Chapters 5 (systems), 6 (determinants), 7 (eigen-theory), 8 (quadratic forms). */
(function () {
  "use strict";
  const LA = window.LA;
  const { Frac, Poly } = LA;
  const H = LA.bankH, def = LA.bank.def;
  const { fr, vt, ct, mt, vs, ms, ls } = H;
  const XYZ = ["x", "y", "z"], X4 = ["x_1", "x_2", "x_3", "x_4"];
  const eqs = (A, b, vars) => "\\begin{aligned}" + A.map((row, i) => H.lin(row, vars) + " &= " + H.T(fr(b[i]))).join("\\\\") + "\\end{aligned}";
  const tr = (A) => A.reduce((s, row, i) => s.add(fr(row[i])), Frac.ZERO);
  const fromEig = (r, D) => { const n = D.length, P = H.unimod(r, n, n + 2, 1); return { A: H.mul(P, H.mul(D, H.inv(P))), P }; };
  const diagM = (d) => d.map((x, i) => d.map((_, j) => (i === j ? x : 0)));
  const asInt = (A) => A.map((row) => row.map((x) => Number(fr(x).n) / Number(fr(x).d)));
  const lam = (p) => H.pt(p.c, "\\lambda");

  /* ======================= Chapter 5 ======================= */
  def({ id: "solve-system", topic: "systems-rref", title: "Solve a linear system", gen(r, diff) {
    if (diff === "advanced" || diff === "challenge") {
      let a, b, c, d, e, f; do { [a, b, c, d, e, f] = r.intVec(6, -3, 3); } while (a * e - b * d === 0);
      const p = r.int(-4, 4), q = r.int(-4, 4), s = diff === "challenge" ? p + q : p + q + r.nz(-3, 3), k = c + f;
      const A = [[a, b, c], [d, e, f], [a + d, b + e, "k"]];
      const rowT = (row) => H.lin(row.slice(0, 2), ["x", "y"]) + (row[2] === "k" ? " + kz" : (row[2] ? (row[2] > 0 ? " + " : " - ") + (Math.abs(row[2]) === 1 ? "" : Math.abs(row[2])) + "z" : ""));
      return { q: "<p>For which value of $k$ does the system $$\\begin{aligned}" + [rowT(A[0]) + " &= " + p, rowT(A[1]) + " &= " + q, rowT(A[2]) + " &= " + s].join("\\\\") + "\\end{aligned}$$ have " + (diff === "challenge" ? "<b>infinitely many</b> solutions" : "<b>no</b> solution") + "?</p>", ans: { type: "num", answer: k }, model: String(k),
        hints: ["Row 3 looks like Row 1 + Row 2. Try $R_3\\to R_3-R_1-R_2$.", "That gives $0x+0y+(k-" + (k < 0 ? "(" + k + ")" : k) + ")z = " + (s - p - q) + "$.", "If $k\\neq" + k + "$ you can solve for $z$: a unique solution. So the special value is $k = " + k + "$.", "At $k = " + k + "$ the last row reads $0 = " + (s - p - q) + "$ — " + (s - p - q === 0 ? "always true (a free variable appears)." : "a contradiction.")],
        sol: "<p>$R_3\\to R_3-R_1-R_2$ gives $(k-" + (k < 0 ? "(" + k + ")" : k) + ")z = " + (s - p - q) + "$. For $k\\neq" + k + "$ there is a unique solution (the first two rows have independent $x,y$ parts since $" + a + "\\cdot" + e + "-" + b + "\\cdot" + d + "\\neq0$). For $k = " + k + "$: $0 = " + (s - p - q) + "$, so " + (s - p - q === 0 ? "the system has infinitely many solutions" : "there is no solution") + ". Answer: $k = " + k + "$.</p>" };
    }
    const n = diff === "beginner" ? 2 : 3;
    const A = H.nonsingular(r, n, -3, 3), x = r.intVec(n, -4, 4), b = LA.M.mulVec(H.FR(A), x.map(fr));
    const vars = n === 2 ? ["x", "y"] : XYZ;
    const aug = A.map((row, i) => row.map(fr).concat([b[i]]));
    return { q: "<p>Solve $$" + eqs(A, b, vars) + "$$ Give $(" + vars.join(",") + ")$.</p>", ans: { type: "vec", answer: x }, model: vs(x),
      hints: ["Write the augmented matrix $(A\\,|\\,b)$.", "Row-reduce to reduced row echelon form.", "With a pivot in every column of $A$, the solution is unique: read it off the last column.", "$" + vars[0] + " = " + x[0] + "$."],
      sol: "<p>" + LA.stepsHTML(LA.alg.rowReduce(aug, { mode: "rref", stopCol: n }).steps, aug, { aug: n }) + "</p><p>So $(" + vars.join(",") + ") = " + vt(x) + "$. Check in each equation.</p>" };
  } });

  def({ id: "rref", topic: "systems-rref", title: "Reduced row echelon form", gen(r, diff) {
    const [m, n, k] = diff === "beginner" ? [2, 3, 2] : diff === "standard" ? [3, 4, 2] : diff === "advanced" ? [3, 4, 3] : [4, 5, 3];
    const A = H.rankMat(r, m, n, k, 6), red = H.rref(A);
    return { q: "<p>Find the reduced row echelon form of $" + mt(A) + "$.</p>", ans: { type: "mat", answer: red.R }, model: ms(red.R), input: "area",
      hints: ["RREF: leading 1s, zeros above AND below each leading 1, zero rows at the bottom.", "Pick a pivot in column 1 (a row starting with ±1 is easiest) and clear the column.", "Move to the next column that still has a non-zero entry below the current row.", "The rank is " + k + ", so there are " + k + " non-zero rows."],
      sol: "<p>" + H.steps(A, red) + "</p><p>RREF $= " + mt(red.R) + "$ (unique for every matrix).</p>" };
  } });

  def({ id: "inverse-matrix", topic: "systems-rref", title: "Inverse of a matrix", gen(r, diff) {
    const A = diff === "beginner" ? H.nonsingular(r, 2, -4, 4) : diff === "standard" ? H.unimod(r, 3, 4, 1) : diff === "advanced" ? H.nonsingular(r, 3, -2, 3) : H.unimod(r, 4, 5, 1);
    const n = A.length, Ai = H.inv(A), aug = A.map((row, i) => row.map(fr).concat(LA.M.eye(n)[i]));
    return { q: "<p>Find $A^{-1}$ for $A = " + mt(A) + "$.</p>", ans: { type: "mat", answer: Ai }, model: ms(Ai), input: "area",
      hints: [n === 2 ? "$\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}^{-1} = \\frac1{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$." : "Row-reduce $[A\\,|\\,I]$ until the left block is $I$.", "$\\det A = " + H.det(A).tex() + "\\neq0$, so $A$ is invertible.", "Every row operation is applied to BOTH halves.", "Check your answer: $AA^{-1} = I$."],
      sol: "<p>" + (n === 2 ? "$A^{-1} = \\frac{1}{" + H.det(A).tex() + "}" + mt([[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]]) + " = " + mt(Ai) + "$." : LA.stepsHTML(LA.alg.rowReduce(aug, { mode: "rref", stopCol: n }).steps, aug, { aug: n }) + "$A^{-1} = " + mt(Ai) + "$.") + "</p>" };
  } });

  def({ id: "rank", topic: "rank-spaces", title: "Rank of a matrix", gen(r, diff) {
    const [m, n] = diff === "beginner" ? [2, 3] : diff === "standard" ? [3, 3] : diff === "advanced" ? [3, 4] : [4, 4];
    const k = r.int(1, Math.min(m, n)), A = H.rankMat(r, m, n, k, 7);
    return { q: "<p>Find $\\Rank A$ for $A = " + mt(A) + "$" + (diff === "challenge" ? ", and hence $\\dim\\Null(A)$ — give the rank" : "") + ".</p>", ans: { type: "num", answer: k }, model: String(k),
      hints: ["Rank = number of pivots in an echelon form.", "Row-reduce (an echelon form is enough — you don't need the full RREF).", "Count the non-zero rows.", "Look for rows that are combinations of others."],
      sol: "<p>" + H.steps(A, LA.alg.rowReduce(H.FR(A), { mode: "ref" })) + "</p><p>$\\Rank A = " + k + "$ (and $\\dim\\Null A = " + (n - k) + "$).</p>" };
  } });

  def({ id: "space-basis", topic: "rank-spaces", title: "Bases for row, column and null spaces", gen(r, diff) {
    const [m, n, k] = diff === "beginner" ? [3, 3, 2] : [3, 4, 2];
    const A = H.rankMat(r, m, n, k, 6), red = H.rref(A);
    const which = diff === "beginner" ? "row" : diff === "standard" ? "null" : diff === "advanced" ? "col" : r.pick(["row", "col", "null"]);
    const B = which === "row" ? red.R.slice(0, k) : which === "col" ? red.pivotCols.map((j) => A.map((row) => row[j])) : H.null(A);
    const name = { row: "the row space $\\RS(A)$", col: "the column space $\\CS(A)$", null: "the null space $\\Null(A)$" }[which];
    return { q: "<p>Find a basis for " + name + " where $A = " + mt(A) + "$.</p>", ans: { type: "span", answer: B }, model: ls(B),
      hints: ["Row-reduce $A$ to RREF.", which === "row" ? "The non-zero rows of the RREF form a basis of $\\RS(A)$ (row operations don't change the row space)." : which === "col" ? "Row operations DO change the column space: use the pivot columns of the ORIGINAL $A$." : "Solve $Ax = 0$: one basis vector per free variable.", "$\\Rank A = " + k + "$, so $\\dim\\RS = \\dim\\CS = " + k + "$ and $\\dim\\Null = " + (n - k) + "$.", "Any basis of the same subspace is accepted."],
      sol: "<p>" + H.steps(A, red) + "</p><p>A basis for " + name + ": $" + B.map(vt).join(",\\ ") + "$.</p>" };
  } });

  def({ id: "equiv", topic: "equivalence", title: "Equivalent matrices & normal form", gen(r, diff) {
    const [m, n] = diff === "beginner" ? [2, 3] : [3, 3 + (diff === "challenge" ? 1 : 0)];
    if (diff === "advanced" || diff === "challenge") {
      const k = r.int(1, Math.min(m, n)), A = H.rankMat(r, m, n, k, 6);
      const N = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => (i === j && i < k ? 1 : 0)));
      return { q: "<p>Find the normal form $N_r$ (allowing row AND column operations) of $A = " + mt(A) + "$.</p>", ans: { type: "mat", answer: N }, model: ms(N), input: "area",
        hints: ["Theorem 5.3.3: every rank-$r$ matrix is equivalent to $\\begin{pmatrix}I_r&0\\\\0&0\\end{pmatrix}$ of the same size.", "So you only need the rank!", "Row-reduce to find the number of pivots.", "$N_r$ is $" + m + "\\times" + n + "$."],
        sol: "<p>$\\Rank A = " + k + "$, so $A\\sim N_{" + k + "} = " + mt(N) + "$.</p>" };
    }
    const kA = r.int(1, Math.min(m, n)), kB = r.bool(0.5) ? kA : Math.max(1, Math.min(m, n) - kA + (kA === Math.min(m, n) ? 0 : 1));
    const A = H.rankMat(r, m, n, kA, 6), B = H.rankMat(r, m, n, kB, 6), yes = kA === kB;
    return { q: "<p>Are $A = " + mt(A) + "$ and $B = " + mt(B) + "$ equivalent (i.e. $B = PAQ$ for invertible $P,Q$)?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Equivalent", "Not equivalent"],
      hints: ["Theorem 5.3.4: same-size matrices are equivalent iff they have the same rank.", "Find $\\Rank A$.", "Find $\\Rank B$.", "$\\Rank A = " + kA + "$."],
      sol: "<p>$\\Rank A = " + kA + "$, $\\Rank B = " + kB + "$, so they are <b>" + (yes ? "equivalent" : "not equivalent") + "</b>.</p>" };
  } });

  /* ======================= Chapter 6 ======================= */
  def({ id: "perm-sign", topic: "permutations-det", title: "Sign of a permutation", gen(r, diff) {
    const n = diff === "beginner" ? 3 : diff === "standard" ? 4 : diff === "advanced" ? 5 : 6;
    const s = r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
    let inv = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (s[i] > s[j]) inv++;
    const seen = new Array(n + 1).fill(false), cyc = [];
    for (let i = 1; i <= n; i++) { if (seen[i]) continue; const c = []; let j = i; while (!seen[j]) { seen[j] = true; c.push(j); j = s[j - 1]; } if (c.length > 1) cyc.push(c); }
    const sign = inv % 2 ? -1 : 1, cycT = cyc.length ? cyc.map((c) => "(" + c.join("\\,") + ")").join("") : "\\mathrm{id}";
    const askInv = diff === "challenge" && r.bool(0.5);
    return { q: "<p>$\\sigma = \\begin{pmatrix}" + s.map((_, i) => i + 1).join("&") + "\\\\" + s.join("&") + "\\end{pmatrix}\\in S_" + n + "$. Find " + (askInv ? "the number of inversions of $\\sigma$" : "$\\sign\\sigma$ ($1$ or $-1$)") + ".</p>", ans: { type: "num", answer: askInv ? inv : sign }, model: String(askInv ? inv : sign),
      hints: ["Write $\\sigma$ in cycle notation.", "$\\sigma = " + cycT + "$.", "A $k$-cycle is a product of $k-1$ transpositions, so its sign is $(-1)^{k-1}$.", "Alternatively count inversions (pairs $i\\lt j$ with $\\sigma(i)\\gt\\sigma(j)$): there are " + inv + "."],
      sol: "<p>$\\sigma = " + cycT + "$, a product of $" + cyc.reduce((t, c) => t + c.length - 1, 0) + "$ transpositions; it has " + inv + " inversions, so $\\sign\\sigma = " + sign + "$.</p>" };
  } });

  def({ id: "det", topic: "permutations-det", title: "Compute a determinant", gen(r, diff) {
    const n = diff === "beginner" ? 2 : diff === "standard" ? 3 : 4;
    let A = r.intMat(n, n, -4, 4);
    if (n === 4) { A = A.map((row) => row.map((x) => (r.bool(diff === "advanced" ? 0.45 : 0.3) ? 0 : x))); }
    const d = H.det(A);
    return { q: "<p>Compute $\\det" + mt(A) + "$.</p>", ans: { type: "num", answer: d }, model: d.toString(),
      hints: [n === 2 ? "$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad-bc$." : "Expand along the row or column with the most zeros (cofactor expansion), or row-reduce.", "Cofactor signs follow the checkerboard $\\begin{pmatrix}+&-&+\\\\-&+&-\\\\+&-&+\\end{pmatrix}$.", "Adding a multiple of one row to another doesn't change the determinant — use it to create zeros.", "The answer is " + (d.sign() < 0 ? "negative" : d.isZero() ? "zero" : "positive") + "."],
      sol: "<p>" + (n === 2 ? "$" + A[0][0] + "\\cdot" + (A[1][1] < 0 ? "(" + A[1][1] + ")" : A[1][1]) + "-" + (A[0][1] < 0 ? "(" + A[0][1] + ")" : A[0][1]) + "\\cdot" + (A[1][0] < 0 ? "(" + A[1][0] + ")" : A[1][0]) + " = " + d.tex() + "$." : "Row reduction (tracking swaps and scalings) or cofactor expansion gives $\\det = " + d.tex() + "$.") + "</p>" };
  } });

  def({ id: "det-props", topic: "det-properties", title: "Determinant properties", gen(r, diff) {
    const n = r.int(2, 4), d = r.nz(-5, 5), c = r.pick([2, 3, -1, -2]), k = r.int(2, 3), e = r.nz(-4, 4);
    const pool = {
      beginner: [["\\det(A^T)", fr(d), "$\\det A^T = \\det A$."], ["\\det(" + c + "A)", fr(c).pow(n).mul(d), "$\\det(cA) = c^n\\det A$ — every one of the $n$ rows is scaled."]],
      standard: [["\\det(A^{-1})", fr(1).div(d), "$\\det A^{-1} = 1/\\det A$."], ["\\det(A^" + k + ")", fr(d).pow(k), "$\\det(A^k) = (\\det A)^k$."], ["\\det(" + c + "A^T)", fr(c).pow(n).mul(d), "Combine $\\det(cA) = c^n\\det A$ and $\\det A^T = \\det A$."]],
      advanced: [["\\det(AB)\\text{ where }\\det B = " + e, fr(d * e), "$\\det(AB) = \\det A\\det B$."], ["\\det(" + c + "A^{-1})", fr(c).pow(n).div(d), "$c^n/\\det A$."], ["\\det(B^{-1}AB)\\text{ for invertible } B", fr(d), "$\\det(B^{-1})\\det A\\det B = \\det A$."]],
      challenge: [["\\text{the determinant after } R_1\\leftrightarrow R_2 \\text{ then } R_2\\to" + c + "R_2", fr(-c * d), "Swap: $\\times(-1)$; scale a row by $" + c + "$: $\\times" + c + "$."], ["\\text{the determinant after } R_2\\to R_2+" + e + "R_1 \\text{ then } R_1\\to" + c + "R_1", fr(c * d), "Adding a multiple of a row changes nothing; scaling multiplies by $" + c + "$."], ["\\det(\\operatorname{adj}A) \\;(\\text{using } A\\operatorname{adj}A = (\\det A)I)", fr(d).pow(n - 1), "$\\det A\\cdot\\det(\\operatorname{adj}A) = (\\det A)^n$, so $\\det\\operatorname{adj}A = (\\det A)^{n-1}$."]],
    }[diff];
    const [what, val, why] = r.pick(pool);
    return { q: "<p>$A$ is a $" + n + "\\times" + n + "$ matrix with $\\det A = " + d + "$. Find $" + what + "$.</p>", ans: { type: "num", answer: val }, model: val.toString(),
      hints: ["Key rules: $\\det A^T = \\det A$, $\\det(AB) = \\det A\\det B$, $\\det A^{-1} = 1/\\det A$, $\\det(cA) = c^n\\det A$.", "Row swaps flip the sign; scaling a row scales the determinant; adding a multiple of a row changes nothing.", "Here $n = " + n + "$.", why],
      sol: "<p>" + why + " So the answer is $" + val.tex() + "$.</p>" };
  } });

  def({ id: "det-param", topic: "det-properties", title: "When is A singular?", gen(r, diff) {
    const n = diff === "beginner" || diff === "standard" ? 2 : 3;
    let ev; do { ev = r.intVec(n, -4, 4); } while (diff !== "challenge" && new Set(ev).size < n);
    const { A: M } = fromEig(r, diagM(ev));
    const Mi = asInt(M);
    const cell = (i, j) => (i === j ? H.aff(1, -Mi[i][j], "t") : String(-Mi[i][j]));
    const roots = Array.from(new Set(ev)).sort((a, b) => a - b);
    return { q: "<p>For which values of $t$ is $A = \\begin{pmatrix}" + Mi.map((row, i) => row.map((_, j) => cell(i, j)).join("&")).join("\\\\") + "\\end{pmatrix}$ <b>not</b> invertible?</p>", ans: { type: "set", answer: roots, multiplicity: false }, model: roots.join(", "), ph: "list values, e.g. -1, 3",
      hints: ["$A$ is singular $\\iff\\det A = 0$.", "Expand $\\det A$ as a polynomial in $t$ (degree " + n + ").", "Notice $A = tI-M$ with $M = " + mt(Mi) + "$, so the roots are the eigenvalues of $M$.", "One root is $t = " + roots[0] + "$."],
      sol: "<p>$\\det A = " + ev.map((x) => "(t" + (x > 0 ? "-" + x : x < 0 ? "+" + -x : "") + ")").join("") + "$, so $A$ is singular exactly for $t\\in\\{" + roots.join(",") + "\\}$.</p>" };
  } });

  def({ id: "cramer", topic: "det-properties", title: "Cramer's rule", gen(r, diff) {
    const n = diff === "beginner" || diff === "standard" ? 2 : 3;
    const A = H.nonsingular(r, n, -4, 4), x = r.intVec(n, -4, 4).map((v, i) => (diff === "standard" || diff === "challenge" ? fr(v).div(i === 0 ? 1 : 1) : fr(v)));
    const b = LA.M.mulVec(H.FR(A), x), vars = n === 2 ? ["x", "y"] : XYZ, j = r.int(0, n - 1);
    const Aj = H.FR(A).map((row, i) => row.map((v, k) => (k === j ? b[i] : v)));
    const dA = H.det(A), dj = LA.alg.det(Aj), val = dj.div(dA);
    return { q: "<p>Use Cramer's rule to find $" + vars[j] + "$ in $$" + eqs(A, b, vars) + "$$</p>", ans: { type: "num", answer: val }, model: val.toString(),
      hints: ["$" + vars[j] + " = \\dfrac{\\det A_" + (j + 1) + "}{\\det A}$ where $A_" + (j + 1) + "$ replaces column " + (j + 1) + " of $A$ by $b$.", "$\\det A = " + dA.tex() + "$.", "$A_" + (j + 1) + " = " + mt(Aj) + "$.", "$\\det A_" + (j + 1) + " = " + dj.tex() + "$."],
      sol: "<p>$" + vars[j] + " = \\dfrac{" + dj.tex() + "}{" + dA.tex() + "} = " + val.tex() + "$.</p>" };
  } });

  /* ======================= Chapter 7 ======================= */
  def({ id: "eigvals", topic: "eigen", title: "Find the eigenvalues", gen(r, diff) {
    if (diff === "challenge") {
      const a = r.int(-3, 3), b = r.nz(1, 3), P = H.unimod(r, 2, 2, 1);
      const A = H.mul(H.inv(P), H.mul([[a, -b], [b, a]], P));
      const ev = [new LA.QNum(a, b, -1), new LA.QNum(a, -b, -1)];
      return { q: "<p>Find the (complex) eigenvalues of $A = " + mt(A) + "$.</p>", ans: { type: "set", answer: ev }, model: a + "+" + b + "i, " + a + "-" + b + "i", ph: "e.g. 1+2i, 1-2i",
        hints: ["$\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A = 0$.", "$\\operatorname{tr}A = " + tr(A).tex() + "$, $\\det A = " + LA.alg.det(A).tex() + "$.", "The discriminant is negative ⇒ complex conjugate roots.", "Use the quadratic formula."],
        sol: "<p>$p(\\lambda) = \\lambda^2-" + tr(A).tex() + "\\lambda+" + LA.alg.det(A).tex() + "$, roots $" + a + "\\pm " + (b === 1 ? "" : b) + "i$.</p>" };
    }
    const n = diff === "advanced" ? 3 : 2;
    const ev = r.intVec(n, -4, 5);
    let A;
    if (diff === "beginner") { A = [[ev[0], r.int(-4, 4)], [0, ev[1]]]; if (r.bool(0.5)) A = [[A[0][0], 0], [r.int(-4, 4), A[1][1]]]; }
    else A = asInt(fromEig(r, diagM(ev)).A);
    return { q: "<p>Find all eigenvalues of $A = " + mt(A) + "$ (list repeated ones as often as they repeat).</p>", ans: { type: "set", answer: ev }, model: ev.join(", "),
      hints: [diff === "beginner" ? "For a triangular matrix the eigenvalues are the diagonal entries." : "Solve $\\det(A-\\lambda I) = 0$.", n === 2 ? "$2\\times2$: $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A = 0$ with $\\operatorname{tr}A = " + tr(A).tex() + "$, $\\det A = " + H.det(A).tex() + "$." : "Expand the $3\\times3$ determinant; look for an integer root among divisors of the constant term.", "Check: the eigenvalues sum to $\\operatorname{tr}A = " + tr(A).tex() + "$ and multiply to $\\det A = " + H.det(A).tex() + "$.", "One eigenvalue is $" + ev[0] + "$."],
      sol: "<p>$\\det(A-\\lambda I) = " + lam(LA.alg.charPoly(H.FR(A))) + " = " + (n % 2 ? "-" : "") + ev.map((x) => "(\\lambda" + (x > 0 ? "-" + x : x < 0 ? "+" + -x : "") + ")").join("") + "$, so the eigenvalues are $" + ev.join(",\\ ") + "$.</p>" };
  } });

  def({ id: "charpoly", topic: "eigen", title: "Characteristic polynomial", gen(r, diff) {
    const n = diff === "beginner" || diff === "standard" ? 2 : 3;
    const A = diff === "challenge" ? asInt(fromEig(r, diagM(r.intVec(3, -3, 3))).A) : r.intMat(n, n, -4, 4);
    const p = LA.alg.charPoly(H.FR(A));
    return { q: "<p>Find the characteristic polynomial $p_A(\\lambda) = \\det(A-\\lambda I)$ of $A = " + mt(A) + "$.</p>", ans: { type: "poly", answer: p, v: "lambda", monicUpToSign: true }, model: H.ps(p, "lambda"), ph: "e.g. λ^2 - 5λ + 6",
      hints: ["Subtract $\\lambda$ from each diagonal entry and take the determinant.", n === 2 ? "Shortcut: $\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$." : "Shortcut check: $-\\lambda^3+(\\operatorname{tr}A)\\lambda^2-\\dots+\\det A$.", "$\\operatorname{tr}A = " + tr(A).tex() + "$, $\\det A = " + H.det(A).tex() + "$.", "Expand and collect powers of $\\lambda$."],
      sol: "<p>$p_A(\\lambda) = " + lam(p) + "$ (the sign convention $\\det(\\lambda I-A)$ gives the negative for odd $n$; both are accepted).</p>" };
  } });

  def({ id: "eigvec", topic: "eigen", title: "Find an eigenvector", gen(r, diff) {
    if (diff === "advanced") {
      const l = r.int(-3, 3); let m; do { m = r.int(-3, 3); } while (m === l);
      const { A, P } = fromEig(r, diagM([l, l, m]));
      const B = H.null(LA.M.sub(A, LA.M.scale(fr(l), LA.M.eye(3))));
      return { q: "<p>$\\lambda = " + l + "$ is an eigenvalue of $A = " + mt(A) + "$. Find a basis for its eigenspace.</p>", ans: { type: "span", answer: B }, model: ls(B),
        hints: ["The eigenspace is $\\Null(A-" + l + "I)$.", "$A-" + l + "I = " + mt(LA.M.sub(A, LA.M.scale(fr(l), LA.M.eye(3)))) + "$.", "Row-reduce: it has rank 1, so the eigenspace is 2-dimensional.", "Any two independent solutions form a basis."],
        sol: "<p>$\\Null(A-" + l + "I) = \\spn\\{" + B.map(vt).join(",") + "\\}$ — geometric multiplicity 2.</p>" };
    }
    const n = diff === "challenge" ? 3 : 2;
    const ev = r.intVec(n, -4, 4); while (new Set(ev).size < n) ev[r.int(0, n - 1)] = r.int(-5, 5);
    const { A, P } = fromEig(r, diagM(ev)), j = r.int(0, n - 1);
    const v = LA.V.integerize(LA.M.cols(H.FR(P))[j], true).vec;
    const Ml = LA.M.sub(A, LA.M.scale(fr(ev[j]), LA.M.eye(n)));
    return { q: "<p>$\\lambda = " + ev[j] + "$ is an eigenvalue of $A = " + mt(A) + "$. Find an eigenvector for it.</p>", ans: { type: "vec", answer: v, multiple: true }, model: vs(v),
      hints: ["Eigenvectors for $\\lambda$ are the non-zero solutions of $(A-\\lambda I)v = 0$.", "$A-" + (ev[j] < 0 ? "(" + ev[j] + ")" : ev[j]) + "I = " + mt(Ml) + "$.", "Row-reduce; there is one free variable.", "Any non-zero multiple of an eigenvector is also an eigenvector."],
      sol: "<p>$\\Null" + mt(Ml) + " = \\spn\\{" + vt(v) + "\\}$. Check: $A" + ct(v) + " = " + ct(LA.M.mulVec(A, v)) + " = " + ev[j] + ct(v) + "$.</p>" };
  } });

  def({ id: "geo-mult", topic: "multiplicity", title: "Algebraic vs geometric multiplicity", gen(r, diff) {
    const l = r.int(-3, 3); let m; do { m = r.int(-3, 3); } while (m === l);
    const defective = r.bool(0.5);
    const J = defective ? [[l, 1, 0], [0, l, 0], [0, 0, m]] : [[l, 0, 0], [0, l, 0], [0, 0, m]];
    const { A } = fromEig(r, J);
    const geo = defective ? 1 : 2, askAlg = diff === "beginner";
    return { q: "<p>$A = " + mt(A) + "$ has characteristic polynomial $-(\\lambda" + (l > 0 ? "-" + l : l < 0 ? "+" + -l : "") + ")^2(\\lambda" + (m > 0 ? "-" + m : m < 0 ? "+" + -m : "") + ")$. Find the " + (askAlg ? "algebraic" : "geometric") + " multiplicity of $\\lambda = " + l + "$.</p>", ans: { type: "num", answer: askAlg ? 2 : geo }, model: String(askAlg ? 2 : geo),
      hints: ["Algebraic multiplicity = power of $(\\lambda-" + l + ")$ in $p_A$.", "Geometric multiplicity = $\\dim\\Null(A-" + l + "I) = 3-\\Rank(A-" + l + "I)$.", "$\\Rank(A-" + l + "I) = " + H.rank(LA.M.sub(A, LA.M.scale(fr(l), LA.M.eye(3)))) + "$.", "Always $1\\le$ geometric $\\le$ algebraic."],
      sol: "<p>Algebraic multiplicity $2$; $\\Rank(A-" + l + "I) = " + (3 - geo) + "$ so geometric multiplicity $= " + geo + "$" + (defective ? " — $A$ is <b>not</b> diagonalizable." : " — this eigenvalue causes no obstruction to diagonalization.") + "</p>" };
  } });

  def({ id: "diag-tf", topic: "diagonalization", title: "Diagonalizable or not?", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3;
    const l = r.int(-3, 3); let m; do { m = r.int(-3, 3); } while (m === l);
    const kind = r.pick(diff === "beginner" ? ["distinct", "jordan", "scalar"] : ["distinct", "jordan", "repeat-ok"]);
    let J;
    if (n === 2) J = kind === "distinct" ? [[l, 0], [0, m]] : kind === "jordan" ? [[l, 1], [0, l]] : [[l, 0], [0, l]];
    else J = kind === "distinct" ? [[l, 0, 0], [0, m, 0], [0, 0, l + m + 1 === l || l + m + 1 === m ? l - 4 : l + m + 1]] : kind === "jordan" ? [[l, 1, 0], [0, l, 0], [0, 0, m]] : [[l, 0, 0], [0, l, 0], [0, 0, m]];
    const A = asInt(fromEig(r, J).A), yes = kind !== "jordan";
    return { q: "<p>Is $A = " + mt(A) + "$ diagonalizable (over $\\R$)?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Diagonalizable", "Not diagonalizable"],
      hints: ["Find the eigenvalues first (characteristic polynomial).", "Distinct eigenvalues ⇒ diagonalizable.", "For a repeated eigenvalue $\\lambda$ compare its algebraic multiplicity with $\\dim\\Null(A-\\lambda I)$.", "Diagonalizable ⇔ geometric = algebraic for every eigenvalue."],
      sol: "<p>Eigenvalues: $" + J.map((row, i) => row[i]).join(", ") + "$. " + (kind === "distinct" ? "They are distinct, so $A$ is diagonalizable." : kind === "jordan" ? "The repeated eigenvalue $" + l + "$ has geometric multiplicity $1\\lt2$, so $A$ is <b>not</b> diagonalizable." : "The repeated eigenvalue $" + l + "$ has a 2-dimensional eigenspace (geometric = algebraic), so $A$ <b>is</b> diagonalizable.") + "</p>" };
  } });

  def({ id: "diag-pd", topic: "diagonalization", title: "Diagonalize: find P and D", gen(r, diff) {
    const n = diff === "beginner" || diff === "standard" ? 2 : 3;
    let ev; do { ev = r.intVec(n, -4, 5); } while (new Set(ev).size < (diff === "challenge" ? n - 1 : n) || (diff === "challenge" && new Set(ev).size === n));
    const { A, P } = fromEig(r, diagM(ev));
    const evs = ev.map(fr);
    const pCheck = (input) => {
      let M0; try { M0 = LA.ans.matrix(input).map((row) => row.map((x) => { if (!x.exRe) throw new Error("use exact entries"); return x.exRe; })); } catch (e) { return { ok: false, score: 0, msg: "Couldn't read P: " + e.message, parseError: true }; }
      if (M0.length !== n || M0[0].length !== n) return { ok: false, score: 0, msg: "P must be " + n + "×" + n + "." };
      if (LA.alg.det(M0).isZero()) return { ok: false, score: 0, msg: "P must be invertible (its columns must be independent eigenvectors)." };
      const cols = LA.M.cols(M0);
      for (let j = 0; j < n; j++) { const Av = LA.M.mulVec(A, cols[j]); const k = cols[j].findIndex((x) => !x.isZero()); const l = Av[k].div(cols[j][k]); if (!Av.every((x, i) => x.eq(cols[j][i].mul(l)))) return { ok: false, score: 0.3, msg: "Column " + (j + 1) + " of P is not an eigenvector of A." }; }
      return { ok: true, score: 1, msg: "P is invertible and its columns are eigenvectors." };
    };
    const dCheck = (input) => {
      let M0; try { M0 = LA.ans.matrix(input).map((row) => row.map((x) => x.exRe || fr(0))); } catch (e) { return { ok: false, score: 0, msg: "Couldn't read D: " + e.message, parseError: true }; }
      if (M0.length !== n || M0[0].length !== n) return { ok: false, score: 0, msg: "D must be " + n + "×" + n + "." };
      if (M0.some((row, i) => row.some((x, j) => i !== j && !x.isZero()))) return { ok: false, score: 0, msg: "D must be diagonal." };
      return LA.ans.check({ type: "set", answer: evs }, M0.map((row, i) => row[i].toString()).join(","));
    };
    const joint = (inputs) => {
      try {
        const Pm = LA.ans.matrix(inputs[0]).map((row) => row.map((x) => x.exRe)), Dm = LA.ans.matrix(inputs[1]).map((row) => row.map((x) => x.exRe));
        return LA.M.eq(LA.M.mul(A, Pm), LA.M.mul(Pm, Dm)) ? { ok: true, msg: "AP = PD ✓ — the order of D matches the columns of P." } : { ok: false, msg: "Each diagonal entry of D must be the eigenvalue of the matching column of P (AP = PD fails)." };
      } catch (e) { return { ok: false, msg: "Couldn't check AP = PD." }; }
    };
    const Pint = LA.M.fromCols(LA.M.cols(H.FR(P)).map((c) => LA.V.integerize(c, true).vec));
    return { q: "<p>Diagonalize $A = " + mt(A) + "$: find an invertible $P$ and a diagonal $D$ with $A = PDP^{-1}$.</p>",
      parts: [{ label: "$P$ (eigenvectors as columns)", ans: { type: "custom", fn: pCheck }, model: ms(Pint), input: "area" }, { label: "$D$ (matching eigenvalues on the diagonal)", ans: { type: "custom", fn: dCheck }, model: ms(diagM(ev)), input: "area" }],
      joint, model: ms(Pint),
      hints: ["Step 1: eigenvalues from $\\det(A-\\lambda I) = 0$.", "Step 2: for each eigenvalue, a basis of $\\Null(A-\\lambda I)$.", "Step 3: eigenvectors become the columns of $P$; put the matching eigenvalues on the diagonal of $D$ IN THE SAME ORDER.", "Eigenvalues: $" + ev.join(", ") + "$."],
      sol: "<p>Eigenvalues $" + ev.join(", ") + "$ with eigenvectors given by the columns of $P = " + mt(Pint) + "$; $D = " + mt(diagM(ev)) + "$. Check: $AP = PD = " + mt(LA.M.mul(A, H.FR(Pint))) + "$. (Any other choice of eigenvectors, or another order, also works.)</p>" };
  } });

  def({ id: "mat-power", topic: "diagonalization", title: "Matrix powers via diagonalization", gen(r, diff) {
    let a, b; do { a = r.int(-3, 3); b = r.int(-3, 3); } while (a === b || (a === 0 && b === 0));
    const { A, P } = fromEig(r, diagM([a, b]));
    const k = diff === "beginner" ? 3 : diff === "standard" ? 5 : diff === "advanced" ? 8 : 12;
    let Ak = LA.M.eye(2); for (let i = 0; i < k; i++) Ak = LA.M.mul(Ak, A);
    const Pi = H.inv(P);
    return { q: "<p>Use diagonalization to compute $A^{" + k + "}$ for $A = " + mt(A) + "$.</p>", ans: { type: "mat", answer: Ak }, model: ms(Ak), input: "area",
      hints: ["$A = PDP^{-1}\\Rightarrow A^k = PD^kP^{-1}$.", "Eigenvalues: $" + a + ", " + b + "$.", "$P = " + mt(P) + "$, $P^{-1} = " + mt(Pi) + "$.", "$D^{" + k + "} = \\diag(" + a + "^{" + k + "}, " + (b < 0 ? "(" + b + ")" : b) + "^{" + k + "})$."],
      sol: "<p>$A^{" + k + "} = " + mt(P) + "\\begin{pmatrix}" + fr(a).pow(k).tex() + "&0\\\\0&" + fr(b).pow(k).tex() + "\\end{pmatrix}" + mt(Pi) + " = " + mt(Ak) + "$.</p>" };
  } });

  def({ id: "cayley-ham", topic: "cayley-hamilton", title: "Cayley–Hamilton", gen(r, diff) {
    if (diff === "beginner" || diff === "standard") {
      const A = H.nonsingular(r, 2, -4, 4), t = tr(A), d = H.det(A);
      if (diff === "beginner") return { q: "<p>By Cayley–Hamilton, $A^2 = pA+qI$ for $A = " + mt(A) + "$. Find $(p,q)$.</p>", ans: { type: "vec", answer: [t, d.neg()] }, model: vs([t, d.neg()]),
        hints: ["$p_A(\\lambda) = \\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A$.", "Cayley–Hamilton: $A^2-(\\operatorname{tr}A)A+(\\det A)I = O$.", "$\\operatorname{tr}A = " + t.tex() + "$, $\\det A = " + d.tex() + "$.", "Rearrange for $A^2$."], sol: "<p>$A^2 = " + t.tex() + "A" + (d.neg().sign() < 0 ? "" : "+") + d.neg().tex() + "I$, so $(p,q) = (" + t.tex() + "," + d.neg().tex() + ")$.</p>" };
      const Ai = H.inv(A);
      return { q: "<p>Use Cayley–Hamilton to find $A^{-1}$ for $A = " + mt(A) + "$.</p>", ans: { type: "mat", answer: Ai }, model: ms(Ai), input: "area",
        hints: ["$A^2-(\\operatorname{tr}A)A+(\\det A)I = O$.", "Multiply by $A^{-1}$: $A-(\\operatorname{tr}A)I+(\\det A)A^{-1} = O$.", "So $A^{-1} = \\frac{1}{\\det A}\\big((\\operatorname{tr}A)I-A\\big)$.", "$\\operatorname{tr}A = " + t.tex() + "$, $\\det A = " + d.tex() + "$."],
        sol: "<p>$A^{-1} = \\frac{1}{" + d.tex() + "}\\left(" + t.tex() + "I-A\\right) = " + mt(Ai) + "$.</p>" };
    }
    const A = diff === "advanced" ? r.intMat(3, 3, -3, 3) : H.nonsingular(r, 3, -2, 3);
    const p = LA.alg.charPoly(H.FR(A)); // det(A - λI) = -λ^3 + c2 λ^2 + c1 λ + c0
    const c2 = p.coef(2), c1 = p.coef(1), c0 = p.coef(0); // -A^3 + c2 A^2 + c1 A + c0 I = 0  =>  A^3 = c2 A^2 + c1 A + c0 I
    if (diff === "advanced") return { q: "<p>Write $A^3 = aA^2+bA+cI$ for $A = " + mt(A) + "$. Find $(a,b,c)$.</p>", ans: { type: "vec", answer: [c2, c1, c0] }, model: vs([c2, c1, c0]),
      hints: ["Find $p_A(\\lambda) = \\det(A-\\lambda I)$.", "$p_A(\\lambda) = " + lam(p) + "$.", "Cayley–Hamilton: $p_A(A) = O$.", "Solve $p_A(A) = O$ for $A^3$."], sol: "<p>$p_A(\\lambda) = " + lam(p) + "$, so $-A^3" + "+(" + c2.tex() + ")A^2+(" + c1.tex() + ")A+(" + c0.tex() + ")I = O$, i.e. $(a,b,c) = (" + c2.tex() + "," + c1.tex() + "," + c0.tex() + ")$.</p>" };
    const Ai = H.inv(A);
    return { q: "<p>Use Cayley–Hamilton to find $A^{-1}$ for $A = " + mt(A) + "$.</p>", ans: { type: "mat", answer: Ai }, model: ms(Ai), input: "area",
      hints: ["$p_A(\\lambda) = " + lam(p) + "$.", "$p_A(A) = O$ gives $-A^3+(" + c2.tex() + ")A^2+(" + c1.tex() + ")A+(" + c0.tex() + ")I = O$.", "Multiply by $A^{-1}$ and solve: $A^{-1} = \\frac{1}{" + c0.tex() + "}\\big(A^2-(" + c2.tex() + ")A-(" + c1.tex() + ")I\\big)$.", "$c_0 = \\det A = " + c0.tex() + "\\neq0$."],
      sol: "<p>$A^{-1} = \\frac{1}{" + c0.tex() + "}\\big(A^2-(" + c2.tex() + ")A-(" + c1.tex() + ")I\\big) = " + mt(Ai) + "$.</p>" };
  } });

  /* ======================= Chapter 8 ======================= */
  const qfTex = (A, vars) => { // x^T A x as a polynomial
    const n = A.length, terms = [];
    for (let i = 0; i < n; i++) for (let j = i; j < n; j++) { const c = i === j ? fr(A[i][i]) : fr(A[i][j]).mul(2); if (!c.isZero()) terms.push([c, vars[i] + (i === j ? "^2" : vars[j])]); }
    return terms.map(([c, m0], k) => (c.sign() < 0 ? (k ? " - " : "-") : k ? " + " : "") + (c.abs().isOne() ? "" : c.abs().tex()) + m0).join("") || "0";
  };
  const qfStr = (A, vars) => { const n = A.length, out = []; for (let i = 0; i < n; i++) for (let j = i; j < n; j++) { const c = i === j ? fr(A[i][i]) : fr(A[i][j]).mul(2); if (!c.isZero()) out.push("(" + c.toString() + ")*" + vars[i] + "*" + (i === j ? vars[i] : vars[j])); } return out.join(" + ") || "0"; };
  const symM = (r, n, lo, hi) => { const A = r.intMat(n, n, lo, hi); for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) A[i][j] = A[j][i]; return A; };
  // 2x2 symmetric with integer eigenvalues (Pythagorean trick): eigen-directions (p,q),(−q,p)
  const PYT = [[1, 0], [0, 1], [1, 1], [1, -1], [1, 2], [2, 1], [2, -1], [1, -2], [1, 3], [3, 1]];
  const sym2 = (r) => {
    const [p, q] = r.pick(PYT.slice(2)); const nn = p * p + q * q;
    let l1, l2; do { l1 = r.int(-4, 6); l2 = r.int(-4, 6); } while (l1 === l2);
    // A = (l1 vv^T + l2 ww^T)/nn with v=(p,q), w=(-q,p); require integer entries
    for (let t = 0; t < 50; t++) {
      const A = [[l1 * p * p + l2 * q * q, (l1 - l2) * p * q], [(l1 - l2) * p * q, l1 * q * q + l2 * p * p]].map((row) => row.map((x) => x / nn));
      if (A.flat().every(Number.isInteger)) return { A, l: [l1, l2], v: [p, q], w: [-q, p], nn };
      l2 = l1 + nn * r.nz(-1, 1);
    }
    return { A: [[l1, 0], [0, l2]], l: [l1, l2], v: [1, 0], w: [0, 1], nn: 1 };
  };
  const Q3 = [[1, 2, 2], [2, 1, -2], [2, -2, 1]]; // (1/3)·Q3 is orthogonal
  const sym3 = (r, D) => { const perm = r.shuffle([0, 1, 2]), sg = [r.sign(), r.sign(), r.sign()]; const M = Q3.map((row) => perm.map((j, k) => row[j] * sg[k])); const A = H.mul(M, H.mul(diagM(D), LA.M.T(H.FR(M)))).map((row) => row.map((x) => x.div(9))); return { A, M }; };
  const CLASSES = ["positive definite", "negative definite", "positive semidefinite (not definite)", "negative semidefinite (not definite)", "indefinite"];
  const classify = (ev) => { const pos = ev.some((x) => x > 0), neg = ev.some((x) => x < 0), zero = ev.some((x) => x === 0); return pos && neg ? 4 : pos && !zero ? 0 : neg && !zero ? 1 : pos ? 2 : 3; };

  def({ id: "qf-matrix", topic: "quadratic-forms", title: "Matrix of a quadratic form", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3, vars = n === 2 ? ["x", "y"] : XYZ;
    let A; do { A = symM(r, n, -4, 4); } while (A.flat().every((x) => x === 0));
    if (diff === "advanced") return { q: "<p>Write the quadratic form $Q(x) = x^TAx$ for $A = " + mt(A) + "$ as a polynomial in $x,y,z$.</p>", ans: { type: "expr", answer: qfStr(A, vars), vars }, model: qfStr(A, vars), ph: "e.g. 2x^2 - 4xy + z^2",
      hints: ["$x^TAx = \\sum_{i,j}a_{ij}x_ix_j$.", "Diagonal entries give the square terms.", "Each off-diagonal pair $a_{ij} = a_{ji}$ contributes $2a_{ij}x_ix_j$.", "Coefficient of $xy$: $2\\cdot" + A[0][1] + "$."], sol: "<p>$Q = " + qfTex(A, vars) + "$.</p>" };
    if (diff === "challenge") {
      const B = r.intMat(3, 3, -4, 4), S = H.FR(B).map((row, i) => row.map((x, j) => x.add(fr(B[j][i])).div(2)));
      return { q: "<p>$Q(x) = x^TBx$ with the NON-symmetric $B = " + mt(B) + "$. Find the symmetric matrix $A$ with $Q(x) = x^TAx$.</p>", ans: { type: "mat", answer: S }, model: ms(S), input: "area",
        hints: ["$x^TBx$ is a number, so it equals its transpose $x^TB^Tx$.", "Hence $x^TBx = x^T\\frac{B+B^T}{2}x$.", "$A = \\frac12(B+B^T)$ is symmetric.", "Entry $a_{12} = \\frac{b_{12}+b_{21}}{2} = " + S[0][1].tex() + "$."], sol: "<p>$A = \\tfrac12(B+B^T) = " + mt(S) + "$.</p>" };
    }
    return { q: "<p>Find the symmetric matrix $A$ with $Q = x^TAx$ for $Q(" + vars.join(",") + ") = " + qfTex(A, vars) + "$.</p>", ans: { type: "mat", answer: A }, model: ms(A), input: "area",
      hints: ["Coefficients of squares go on the diagonal.", "A cross term $c\\,x_ix_j$ is split equally: $a_{ij} = a_{ji} = c/2$.", "So the matrix is symmetric by construction.", "$a_{11} = " + A[0][0] + "$."], sol: "<p>$A = " + mt(A) + "$ (check: $x^TAx$ expands back to $Q$).</p>" };
  } });

  def({ id: "qf-eval", topic: "quadratic-forms", title: "Evaluate a quadratic form", gen(r, diff) {
    const n = diff === "beginner" ? 2 : 3, vars = n === 2 ? ["x", "y"] : XYZ, A = symM(r, n, -4, 4), v = r.intVec(n, -3, 3);
    const val = LA.V.dot(v.map(fr), LA.M.mulVec(H.FR(A), v.map(fr)));
    const shown = diff === "advanced" || diff === "challenge" ? "$Q(x) = x^TAx$ with $A = " + mt(A) + "$" : "$Q(" + vars.join(",") + ") = " + qfTex(A, vars) + "$";
    return { q: "<p>" + shown + ". Compute $Q" + vt(v) + "$.</p>", ans: { type: "num", answer: val }, model: val.toString(),
      hints: ["Substitute the components.", "Or compute $Av$ first, then $v\\cdot(Av)$.", "$Av = " + vt(LA.M.mulVec(H.FR(A), v.map(fr))) + "$.", "Take the dot product with $v$."], sol: "<p>$Q(v) = v^T(Av) = " + vt(v) + "\\cdot" + vt(LA.M.mulVec(H.FR(A), v.map(fr))) + " = " + val.tex() + "$.</p>" };
  } });

  def({ id: "orth-check", topic: "spectral", title: "Is P orthogonal?", gen(r) {
    const pool = [["\\tfrac15\\begin{pmatrix}3&4\\\\-4&3\\end{pmatrix}", true], ["\\begin{pmatrix}3&4\\\\-4&3\\end{pmatrix}", false], ["\\tfrac1{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}", true], ["\\tfrac12\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}", false], ["\\tfrac13\\begin{pmatrix}1&2&2\\\\2&1&-2\\\\2&-2&1\\end{pmatrix}", true], ["\\tfrac13\\begin{pmatrix}1&2&2\\\\2&1&2\\\\2&2&1\\end{pmatrix}", false], ["\\tfrac17\\begin{pmatrix}2&3&6\\\\3&-6&2\\\\6&2&-3\\end{pmatrix}", true], ["\\begin{pmatrix}0&1&0\\\\0&0&1\\\\1&0&0\\end{pmatrix}", true], ["\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}", false], ["\\tfrac1{\\sqrt5}\\begin{pmatrix}1&2\\\\-2&1\\end{pmatrix}", true]];
    const [P, yes] = r.pick(pool);
    return { q: "<p>Is $P = " + P + "$ an orthogonal matrix?</p>", ans: { type: "tf", answer: yes }, model: String(yes), tf: ["Orthogonal", "Not orthogonal"],
      hints: ["Orthogonal ⇔ $P^TP = I$ ⇔ the columns are orthonormal.", "Check each column has length 1 (include the scalar factor!).", "Check different columns have dot product 0.", "Determinant must be $\\pm1$ — a quick necessary test."],
      sol: "<p><b>" + (yes ? "Yes" : "No") + "</b>: " + (yes ? "the columns are pairwise orthogonal unit vectors, so $P^TP = I$." : "the columns are not orthonormal (check lengths and dot products), so $P^TP\\neq I$.") + "</p>" };
  } });

  def({ id: "orth-diag", topic: "spectral", title: "Orthogonally diagonalize", gen(r, diff) {
    let A, ev;
    if (diff === "beginner" || diff === "standard") { const s = sym2(r); A = H.FR(s.A); ev = s.l; }
    else { const base = r.int(-2, 3), a = r.nz(-1, 1), b = diff === "challenge" ? 0 : r.nz(-1, 1); ev = [base, base + 9 * a, base + 9 * b]; if (new Set(ev).size < 3 && diff === "advanced") ev[2] = base - 9 * a; A = sym3(r, ev).A; }
    const n = A.length, An = A.map((row) => row.map((x) => x.toNumber()));
    const pCheck = (input) => {
      let M0; try { M0 = LA.ans.matrix(input).map((row) => row.map((x) => x.re)); } catch (e) { return { ok: false, score: 0, msg: "Couldn't read P: " + e.message, parseError: true }; }
      if (M0.length !== n || M0[0].length !== n) return { ok: false, score: 0, msg: "P must be " + n + "×" + n + "." };
      const close = (x, y) => Math.abs(x - y) < 1e-7;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const d = M0.reduce((s, row) => s + row[i] * row[j], 0); if (!close(d, i === j ? 1 : 0)) return { ok: false, score: 0.3, msg: i === j ? "Column " + (i + 1) + " is not a unit vector — normalise it." : "Columns " + (j + 1) + " and " + (i + 1) + " are not orthogonal." }; }
      for (let j = 0; j < n; j++) { const c = M0.map((row) => row[j]), Ac = An.map((row) => row.reduce((s, x, k) => s + x * c[k], 0)); const k = c.findIndex((x) => Math.abs(x) > 1e-9); const l = Ac[k] / c[k]; if (!Ac.every((x, i) => close(x, l * c[i]))) return { ok: false, score: 0.4, msg: "Column " + (j + 1) + " is not an eigenvector of A." }; }
      return { ok: true, score: 1, msg: "P is orthogonal and its columns are eigenvectors." };
    };
    const dCheck = (input) => { let M0; try { M0 = LA.ans.matrix(input); } catch (e) { return { ok: false, score: 0, msg: "Couldn't read D: " + e.message, parseError: true }; } if (M0.length !== n || M0[0].length !== n) return { ok: false, score: 0, msg: "D must be " + n + "×" + n + "." }; if (M0.some((row, i) => row.some((x, j) => i !== j && Math.abs(x.re) > 1e-12))) return { ok: false, score: 0, msg: "D must be diagonal." }; return LA.ans.check({ type: "set", answer: ev }, M0.map((row, i) => (row[i].exRe ? row[i].exRe.toString() : String(row[i].re))).join(",")); };
    const joint = (inputs) => { try { const Pm = LA.ans.matrix(inputs[0]).map((row) => row.map((x) => x.re)), Dm = LA.ans.matrix(inputs[1]).map((row) => row.map((x) => x.re)); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const lhs = An[i].reduce((s, x, k) => s + x * Pm[k][j], 0), rhs = Pm[i][j] * Dm[j][j]; if (Math.abs(lhs - rhs) > 1e-7) return { ok: false, msg: "The order of eigenvalues in D must match the columns of P (AP ≠ PD)." }; } return { ok: true, msg: "AP = PD ✓" }; } catch (e) { return { ok: false, msg: "Couldn't check AP = PD." }; } };
    // model: orthonormal eigenvectors (numeric strings)
    let cols;
    if (n === 2) { const s = [1, 0].map(() => 0); void s; const v = H.null(LA.M.sub(A, LA.M.scale(fr(ev[0]), LA.M.eye(2))))[0], w = H.null(LA.M.sub(A, LA.M.scale(fr(ev[1]), LA.M.eye(2))))[0]; cols = [v, w]; }
    else { cols = []; Array.from(new Set(ev)).forEach((l) => { const B = H.null(LA.M.sub(A, LA.M.scale(fr(l), LA.M.eye(3)))); let prev = []; B.forEach((b) => { let u = b.map(fr); prev.forEach((p0) => { const c = LA.V.dot(u, p0).div(LA.V.dot(p0, p0)); u = u.map((x, i) => x.sub(c.mul(p0[i]))); }); u = LA.V.integerize(u, true).vec; prev.push(u); cols.push(u); }); }); }
    const evOrder = n === 2 ? ev : (() => { const out = []; Array.from(new Set(ev)).forEach((l) => { const mult = ev.filter((x) => x === l).length; for (let i = 0; i < mult; i++) out.push(l); }); return out; })();
    const nrm = cols.map((c) => LA.V.dot(c, c));
    const Pmodel = Array.from({ length: n }, (_, i) => cols.map((c, j) => c[i].toString() + "/sqrt(" + nrm[j].toString() + ")").join(" ")).join("; ");
    const Ptex = "\\begin{pmatrix}" + Array.from({ length: n }, (_, i) => cols.map((c, j) => (c[i].isZero() ? "0" : (c[i].sign() < 0 ? "-" : "") + "\\frac{" + c[i].abs().tex() + "}{" + LA.num.sqrtTex(nrm[j]) + "}")).join("&")).join("\\\\") + "\\end{pmatrix}";
    return { q: "<p>Orthogonally diagonalize the symmetric matrix $A = " + mt(A) + "$: find an orthogonal $P$ and diagonal $D$ with $P^TAP = D$.</p>",
      parts: [{ label: "$P$ (orthonormal eigenvectors as columns; surds like 1/sqrt(5) are fine)", ans: { type: "custom", fn: pCheck }, model: Pmodel, input: "area" }, { label: "$D$", ans: { type: "custom", fn: dCheck }, model: ms(diagM(evOrder)), input: "area" }],
      joint, model: Pmodel,
      hints: ["Eigenvalues first: $\\det(A-\\lambda I) = 0$.", "Eigenvectors of a symmetric matrix for different eigenvalues are automatically orthogonal.", n === 3 && new Set(ev).size < 3 ? "For the repeated eigenvalue, choose an ORTHOGONAL basis of its eigenspace (Gram–Schmidt)." : "Normalise each eigenvector to length 1.", "Eigenvalues: $" + ev.join(", ") + "$."],
      sol: "<p>Eigenvalues $" + evOrder.join(", ") + "$; orthonormal eigenvectors give $P = " + Ptex + "$ and $D = " + mt(diagM(evOrder)) + "$ (Spectral Theorem 8.2.5).</p>" };
  } });

  def({ id: "conic", topic: "principal-axes", title: "Classify a conic", gen(r, diff) {
    const s = sym2(r), [l1, l2] = s.l, d = r.int(1, 9);
    const opts = ["an ellipse", "a hyperbola", "a pair of parallel lines", "the empty set"];
    const k = l1 > 0 && l2 > 0 ? 0 : l1 * l2 < 0 ? 1 : (l1 === 0 && l2 > 0) || (l2 === 0 && l1 > 0) ? 2 : 3;
    const eq = qfTex(s.A, ["x", "y"]) + " = " + d;
    if (diff === "advanced" || diff === "challenge") {
      return { q: "<p>Rotate $" + eq + "$ to principal axes: it becomes $\\lambda_1X^2+\\lambda_2Y^2 = " + d + "$. Find $\\lambda_1,\\lambda_2$.</p>", ans: { type: "set", answer: [l1, l2] }, model: l1 + ", " + l2,
        hints: ["$\\lambda_1,\\lambda_2$ are the eigenvalues of the symmetric matrix of the form.", "Matrix: $" + mt(s.A) + "$ (split the $xy$ coefficient in half).", "$\\lambda_1+\\lambda_2 = " + (s.A[0][0] + s.A[1][1]) + "$, $\\lambda_1\\lambda_2 = " + (s.A[0][0] * s.A[1][1] - s.A[0][1] * s.A[0][1]) + "$.", "Solve the quadratic."],
        sol: "<p>Eigenvalues of $" + mt(s.A) + "$: $" + l1 + ", " + l2 + "$, along $" + vt(s.v) + "$ and $" + vt(s.w) + "$. So the curve is $" + l1 + "X^2" + (l2 < 0 ? "" : "+") + l2 + "Y^2 = " + d + "$: " + opts[k] + ".</p>" };
    }
    return { q: "<p>The curve $" + eq + "$ in the plane is</p>", opts, ans: { type: "mcq", answer: k }, model: String(k),
      hints: ["Write the form as $x^TAx$ with $A = " + mt(s.A) + "$.", "In principal axes it becomes $\\lambda_1X^2+\\lambda_2Y^2 = " + d + "$.", "Signs of the eigenvalues decide: both $+$ ⇒ ellipse; opposite ⇒ hyperbola.", "$\\det A = " + (s.A[0][0] * s.A[1][1] - s.A[0][1] * s.A[0][1]) + "$ (= $\\lambda_1\\lambda_2$)."],
      sol: "<p>Eigenvalues $" + l1 + ", " + l2 + "$: $" + l1 + "X^2" + (l2 < 0 ? "" : "+") + l2 + "Y^2 = " + d + "$, which is <b>" + opts[k] + "</b>.</p>" };
  } });

  def({ id: "definiteness", topic: "definiteness", title: "Classify definiteness", gen(r, diff) {
    let A, ev;
    if (diff === "beginner" || diff === "standard") { const s = sym2(r); A = H.FR(s.A); ev = s.l; if (diff === "beginner" && r.bool(0.4)) { ev = [r.int(-4, 4), r.int(-4, 4)]; A = H.FR(diagM(ev)); } }
    else { const D = r.pick([[1, 1, 10], [-1, -1, -10], [1, 10, -8], [0, 9, 9], [0, -9, -9], [0, 9, -9], [2, 2, 11], [-2, 7, 7], [3, 3, -6], [-3, -3, 6], [0, 0, 9]]); ev = D; A = sym3(r, D).A; }
    const k = classify(ev);
    return { q: "<p>Classify the quadratic form $x^TAx$ for $A = " + mt(A) + "$.</p>", opts: CLASSES, ans: { type: "mcq", answer: k }, model: String(k),
      hints: ["Eigenvalue test: all $\\gt0$ ⇒ PD; all $\\ge0$ with a $0$ ⇒ PSD; mixed signs ⇒ indefinite.", "Sylvester (definite cases only): leading minors $\\Delta_1,\\dots,\\Delta_n$.", "$\\Delta_1 = " + A[0][0].tex() + "$, $\\Delta_2 = " + LA.alg.det(A.slice(0, 2).map((row) => row.slice(0, 2))).tex() + "$" + (A.length === 3 ? ", $\\Delta_3 = \\det A = " + LA.alg.det(A).tex() + "$" : "") + ".", "Careful: leading minors cannot detect SEMIdefinite forms."],
      sol: "<p>Eigenvalues: $" + ev.join(", ") + "$ ⇒ <b>" + CLASSES[k] + "</b>.</p>" };
  } });

  def({ id: "sylvester-k", topic: "definiteness", title: "Sylvester's criterion with a parameter", gen(r, diff) {
    if (diff === "challenge") {
      const a = r.int(1, 4), lo = fr(-a).div(2);
      return { q: "<p>For which $k$ is $A = \\begin{pmatrix}" + a + "&k&k\\\\k&" + a + "&k\\\\k&k&" + a + "\\end{pmatrix}$ positive definite? It is PD exactly for $p\\lt k\\lt q$; give $(p,q)$.</p>", ans: { type: "vec", answer: [lo, a] }, model: "(" + lo.toString() + ", " + a + ")",
        hints: ["Sylvester: $\\Delta_1 = " + a + "$, $\\Delta_2 = " + a * a + "-k^2$, $\\Delta_3 = \\det A$.", "$\\det A = (" + a + "-k)^2(" + a + "+2k)$ (or: eigenvalues $" + a + "+2k$ once and $" + a + "-k$ twice).", "Need $" + a * a + "-k^2\\gt0$ and $(" + a + "-k)^2(" + a + "+2k)\\gt0$.", "Intersect $|k|\\lt" + a + "$ with $k\\gt" + lo.tex() + "$."],
        sol: "<p>Eigenvalues $" + a + "+2k$ (eigenvector $(1,1,1)$) and $" + a + "-k$ (twice, on the plane $x+y+z = 0$). PD $\\iff " + a + "+2k\\gt0$ and $" + a + "-k\\gt0\\iff " + lo.tex() + "\\lt k\\lt" + a + "$.</p>" };
    }
    const a = r.int(1, 6), c = r.int(1, 6), b0 = diff === "advanced" ? r.int(1, 5) : null;
    const lim = fr(a * c), M = diff === "advanced" ? "\\begin{pmatrix}" + a + "&k&0\\\\k&" + c + "&0\\\\0&0&" + b0 + "\\end{pmatrix}" : "\\begin{pmatrix}" + a + "&k\\\\k&" + c + "\\end{pmatrix}";
    return { q: "<p>$A = " + M + "$ is positive definite exactly when $|k|\\lt c_0$. Find $c_0$.</p>", ans: { type: "num", answer: "sqrt(" + a * c + ")" }, model: "sqrt(" + a * c + ")",
      hints: ["Sylvester's criterion: all leading principal minors must be positive.", "$\\Delta_1 = " + a + "\\gt0$ always.", "$\\Delta_2 = " + a * c + "-k^2$" + (diff === "advanced" ? " and $\\Delta_3 = " + b0 + "\\Delta_2$" : "") + ".", "$" + a * c + "-k^2\\gt0\\iff|k|\\lt\\sqrt{" + a * c + "}$."],
      sol: "<p>PD $\\iff " + a * c + "-k^2\\gt0\\iff|k|\\lt" + LA.num.sqrtTex(lim) + "$, so $c_0 = " + LA.num.sqrtTex(lim) + "$.</p>" };
  } });

  def({ id: "rayleigh", topic: "optimisation", title: "Max/min on the unit circle", gen(r, diff) {
    let A, ev;
    if (diff === "advanced" || diff === "challenge") { const D = r.pick([[1, 1, 10], [-1, 8, 8], [2, 2, -7], [0, 9, 9], [3, 12, -6]]); ev = D; A = sym3(r, D).A; }
    else { const s = sym2(r); A = H.FR(s.A); ev = s.l; }
    const isMax = r.bool(0.5), val = isMax ? Math.max(...ev) : Math.min(...ev), n = A.length;
    return { q: "<p>Find the " + (isMax ? "maximum" : "minimum") + " of $Q(x) = x^TAx$ subject to $\\lVert x\\rVert = 1$, where $A = " + mt(A) + "$.</p>", ans: { type: "num", answer: val }, model: String(val),
      hints: ["Rayleigh: on the unit " + (n === 2 ? "circle" : "sphere") + ", $\\lambda_{\\mathrm{min}}\\le x^TAx\\le\\lambda_{\\mathrm{max}}$.", "The extremes are attained at unit eigenvectors.", "So find the eigenvalues of $A$.", "Eigenvalues: $" + ev.join(", ") + "$."],
      sol: "<p>The eigenvalues are $" + ev.join(", ") + "$, so the " + (isMax ? "maximum" : "minimum") + " is $" + val + "$, attained at a unit eigenvector for $\\lambda = " + val + "$ (Theorem 8.5.1).</p>" };
  } });

  def({ id: "hessian", topic: "optimisation", title: "Classify a critical point", gen(r, diff) {
    const opts = ["a local minimum", "a local maximum", "a saddle point", "the test is inconclusive"];
    if (diff === "challenge") {
      const a = r.int(1, 3), c = r.nz(-3, 3), x0 = r.pick([a, -a]);
      const k = x0 > 0 ? (c > 0 ? 0 : 2) : c < 0 ? 1 : 2;
      return { q: "<p>$f(x,y) = x^3-" + 3 * a * a + "x" + (c > 0 ? "+" : "-") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + "y^2$ has a critical point at $(" + x0 + ",0)$. Classify it.</p>", opts, ans: { type: "mcq", answer: k }, model: String(k),
        hints: ["Hessian $\\begin{pmatrix}f_{xx}&f_{xy}\\\\f_{xy}&f_{yy}\\end{pmatrix} = \\begin{pmatrix}6x&0\\\\0&" + 2 * c + "\\end{pmatrix}$.", "At $(" + x0 + ",0)$: $\\diag(" + 6 * x0 + "," + 2 * c + ")$.", "Diagonal ⇒ eigenvalues are the diagonal entries.", "PD ⇒ min, ND ⇒ max, mixed signs ⇒ saddle."],
        sol: "<p>$H(" + x0 + ",0) = \\diag(" + 6 * x0 + "," + 2 * c + ")$: " + (k === 0 ? "positive definite ⇒ local minimum." : k === 1 ? "negative definite ⇒ local maximum." : "indefinite ⇒ saddle point.") + "</p>" };
    }
    let a, b, c; do { a = r.nz(-3, 3); b = r.int(-4, 4); c = r.nz(-3, 3); } while (4 * a * c - b * b === 0);
    const x0 = r.int(-3, 3), y0 = r.int(-3, 3);
    // f = a x^2 + b xy + c y^2 + d x + e y with gradient zero at (x0,y0): d = -(2a x0 + b y0), e = -(b x0 + 2c y0)
    const d = -(2 * a * x0 + b * y0), e = -(b * x0 + 2 * c * y0);
    const det = 4 * a * c - b * b, k = det > 0 ? (a > 0 ? 0 : 1) : 2;
    const fT = H.lin([a, b, c, d, e], ["x^2", "xy", "y^2", "x", "y"]);
    const parts = [{ label: "Critical point $(x,y)$", ans: { type: "vec", answer: [x0, y0] }, model: vs([x0, y0]) }, { label: "Type", ans: { type: "mcq", answer: k }, model: String(k), opts }];
    return { q: "<p>$f(x,y) = " + fT + "$. Find its critical point and classify it.</p>", parts, model: vs([x0, y0]),
      hints: ["Solve $f_x = 0$, $f_y = 0$: $" + H.lin([2 * a, b], ["x", "y"]) + (d ? (d > 0 ? "+" : "") + d : "") + " = 0$ and $" + H.lin([b, 2 * c], ["x", "y"]) + (e ? (e > 0 ? "+" : "") + e : "") + " = 0$.", "Hessian $H = " + mt([[2 * a, b], [b, 2 * c]]) + "$ (constant here).", "$\\det H = " + det + "$, $f_{xx} = " + 2 * a + "$.", "$\\det H\\lt0$ ⇒ saddle; $\\det H\\gt0$ and $f_{xx}\\gt0$ ⇒ min; $\\det H\\gt0$ and $f_{xx}\\lt0$ ⇒ max."],
      sol: "<p>Critical point $(" + x0 + "," + y0 + ")$. $H = " + mt([[2 * a, b], [b, 2 * c]]) + "$ with $\\det H = " + det + "$" + (det > 0 ? " and $f_{xx} = " + 2 * a + "$" : "") + " ⇒ <b>" + opts[k] + "</b>.</p>" };
  } });
})();
