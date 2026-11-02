/* Practice Arena — random problem generators with full worked solutions (exact arithmetic) */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc, Frac, Poly, V, M } = LA;
  const ALG = LA.alg, FMT = LA.fmt, N = LA.num;
  const ri = (a, b) => LA.rand(a, b);
  const nz = (a, b) => { let x = 0; while (x === 0) x = ri(a, b); return x; };
  const F = (x) => Frac.of(x);
  const VARS = { 1: ["x"], 2: ["x", "y"], 3: ["x", "y", "z"], 4: ["x", "y", "z", "w"] };

  // integer matrix with det ±1 (random elementary operations on I)
  function unimodular(n) {
    let A = M.eye(n);
    for (let t = 0; t < n + 2; t++) { const i = ri(0, n - 1); let j = ri(0, n - 1); if (i === j) j = (i + 1) % n; const k = nz(-2, 2); A[i] = A[i].map((x, c) => x.add(A[j][c].mul(k))); }
    if (Math.random() < 0.5) { const i = ri(0, n - 1), j = (i + 1) % n; const t = A[i]; A[i] = A[j]; A[j] = t; }
    if (A.some((r) => r.some((x) => Math.abs(x.toNumber()) > 4))) return unimodular(n);
    return A;
  }
  const mapStr = (A, vars) => { const comps = A.map((r) => FMT.lincomb(r, vars)); return "T(" + vars.join(",") + ") = " + (comps.length === 1 ? comps[0] : "(" + comps.join(",\\; ") + ")"); };
  const randMat = (m, n, lo, hi) => Array.from({ length: m }, () => Array.from({ length: n }, () => F(ri(lo, hi))));
  const tupTex = (v) => (v.length === 1 ? v[0].tex() : V.tex(v));

  /* ------------------------------ generators ------------------------------ */
  const G = {};

  G.lin = { t: "Linear or not?", ch: 3, gen() {
    const kind = LA.pick(["lin2", "lin3", "affine", "square", "product", "abs", "linR1"]);
    let src, n;
    const c = () => nz(-4, 4);
    const lf = (vars) => { const co = vars.map(() => ri(-3, 3)); if (co.every((x) => x === 0)) co[0] = 1; return FMT.lincomb(co.map(F), vars); };
    if (kind === "lin2") { n = 2; src = "T(x,y) = (" + lf(["x", "y"]) + ", " + lf(["x", "y"]) + ")"; }
    else if (kind === "lin3") { n = 3; src = "T(x,y,z) = (" + lf(["x", "y", "z"]) + ", " + lf(["x", "y", "z"]) + ")"; }
    else if (kind === "affine") { n = 2; const k = c(); src = "T(x,y) = (" + lf(["x", "y"]) + (k > 0 ? " + " : " - ") + Math.abs(k) + ", " + lf(["x", "y"]) + ")"; }
    else if (kind === "square") { n = 2; src = "T(x,y) = (" + LA.pick(["x^2", "y^2", "x + y^2"]) + ", " + lf(["x", "y"]) + ")"; }
    else if (kind === "product") { n = 2; src = "T(x,y) = (" + LA.pick(["xy", "2xy", "x y + x"]) + ", " + lf(["x", "y"]) + ")"; }
    else if (kind === "abs") { n = 2; src = "T(x,y) = (|" + LA.pick(["x", "x - y", "y"]) + "|, " + lf(["x", "y"]) + ")"; }
    else { n = 1; const k = c(); src = "T(x) = (" + c() + "x, " + c() + "x" + (Math.random() < 0.5 ? (k > 0 ? " + " : " - ") + Math.abs(k) : "") + ")"; }
    const map = LA.parseMap(src.replace(/\\;/g, "")); const r = LA.analyseLinearity(map);
    const isLin = r.linear === true;
    const sol = isLin ? '<p><b class="okc">Linear.</b></p>' + LA.linearityProof(r.A, map.vars) : r.html;
    return { q: "Determine whether $" + src + "$ is a linear transformation $\\R^{" + n + "}\\to\\R^{" + map.comps.length + "}$.", kind: "mcq", opts: ["Linear", "Not linear"], ans: isLin ? 0 : 1, sol };
  } };

  G.basis = { t: "Find T from a basis", ch: 3, gen() {
    const n = LA.pick([2, 2, 3]); const m = n === 2 ? LA.pick([1, 2, 3]) : LA.pick([1, 2]);
    const B = unimodular(n); const bs = M.cols(B); const Y = randMat(m, n, -3, 3);
    const Binv = ALG.inverse(B); const A = M.mul(Y, Binv); const vars = VARS[n];
    const ys = M.cols(Y);
    const coefForms = Binv.map((row) => FMT.lincomb(row, vars));
    const names = ["a", "b", "c"].slice(0, n);
    const q = "$T\\in\\Lin(\\R^{" + n + "},\\R^{" + m + "})$ satisfies " + bs.map((b, i) => "$T" + V.tex(b) + " = " + tupTex(ys[i]) + "$").join(", ") + ". Given that these vectors form a basis of $\\R^{" + n + "}$, find $T(" + vars.join(",") + ")$.";
    const sol = "<p><b>1.</b> Write $(" + vars.join(",") + ") = " + names.map((a, i) => a + V.tex(bs[i])).join(" + ") + "$. Comparing components gives a linear system; solving it:</p>$$" + names.map((a, i) => a + " = " + coefForms[i]).join(",\\qquad ") + "$$" +
      "<p><b>2.</b> By linearity, $T(" + vars.join(",") + ") = " + names.map((a, i) => a + "\\,T" + V.tex(bs[i])).join(" + ") + " = " + names.map((a, i) => "(" + coefForms[i] + ")" + tupTex(ys[i])).join(" + ") + "$.</p>" +
      "<p><b>3.</b> Simplify:</p>$$\\boxed{" + mapStr(A, vars) + "}$$<p><b>4. Check:</b> " + bs.map((b, i) => "$T" + V.tex(b) + " = " + tupTex(M.mulVec(A, b)) + "$ ✔").join(", ") + ".</p>";
    return { q, kind: "self", sol };
  } };

  G.ker = { t: "Kernel, range & Rank–Nullity", ch: 3, gen() {
    const n = LA.pick([2, 3, 3, 4]); const m = LA.pick([2, 3]); const rmax = Math.min(m, n); const r = ri(1, rmax);
    let rows = [];
    while (rows.length < r) { const cand = Array.from({ length: n }, () => F(ri(-2, 3))); if (V.isZero(cand)) continue; if (ALG.rank(rows.concat([cand])) === rows.length + 1) rows.push(cand); }
    while (rows.length < m) { const co = rows.map(() => ri(-1, 2)); if (co.every((x) => x === 0)) co[0] = 1; rows.push(rows.slice(0, r).reduce((s, row, i) => V.add(s, V.scale(F(co[i] || 0), row)), new Array(n).fill(Frac.ZERO))); }
    rows = LA.shuffle(rows);
    const vars = VARS[n];
    return { q: "Let $" + mapStr(rows, vars) + "$. Find a basis and the dimension of $\\ker T$ and of $\\Ran T$, verify the Rank–Nullity Theorem, and decide whether $T$ is injective and/or surjective.", kind: "self", sol: LA.kernelRangeHTML(rows, vars) };
  } };

  G.mat = { t: "Matrix of T w.r.t. bases", ch: 3, gen() {
    const n = LA.pick([2, 2, 3]), m = 2; const A = randMat(m, n, -3, 3); if (A.every((r) => r.every((x) => x.isZero()))) A[0][0] = F(1);
    const B = M.cols(unimodular(n)), C = M.cols(unimodular(m)); const vars = VARS[n];
    const imgs = B.map((b) => M.mulVec(A, b)); const res = ALG.coordsMany(C, imgs); const Mat = M.fromCols(res.coords);
    const v = Array.from({ length: n }, () => F(ri(-2, 3)));
    const cv = ALG.coordsMany(B, [v]).coords[0]; const tv = M.mulVec(Mat, cv);
    const q = "Let $" + mapStr(A, vars) + "$, with ordered bases $\\B = \\{" + B.map((b) => V.tex(b)).join(",") + "\\}$ and $\\Cc = \\{" + C.map((c) => V.tex(c)).join(",") + "\\}$. Find $[T]^{\\Cc}_{\\B}$ and use it to compute $T" + V.tex(v) + "$.";
    const sol = "<p><b>Images:</b> " + B.map((b, i) => "$T" + V.tex(b) + " = " + V.tex(imgs[i]) + "$").join(", ") + ".</p><p><b>Coordinates in $\\Cc$</b> (row-reduce $(\\Cc\\,|\\,T(v_1)\\cdots)$):</p>$$" + M.tex(res.aug, { aug: m }) + "\\to" + M.tex(res.red.R, { aug: m }) + "$$" +
      "$$\\begin{aligned}" + imgs.map((im, i) => V.tex(im) + " &= " + FMT.combTex(res.coords[i], C.map((c) => V.tex(c)))).join("\\\\") + "\\end{aligned}$$$$[T]^{\\Cc}_{\\B} = " + M.tex(Mat) + "$$" +
      "<p><b>Use it:</b> $[v]_{\\B} = " + V.tex(cv, { col: true }) + "$ (solve $v = \\sum c_iv_i$), so $[T(v)]_{\\Cc} = " + M.tex(Mat) + V.tex(cv, { col: true }) + " = " + V.tex(tv, { col: true }) + "$ and $T(v) = " + FMT.combTex(tv, C.map((c) => V.tex(c))) + " = " + V.tex(M.mulVec(A, v)) + "$ ✔ (matches direct substitution).</p>";
    return { q, kind: "self", sol };
  } };

  G.inv = { t: "Isomorphism & inverse", ch: 3, gen() {
    let A; do { A = randMat(2, 2, -3, 3); } while (ALG.det(A).isZero() || Math.abs(ALG.det(A).toNumber()) > 6);
    const d = ALG.det(A); const inv = ALG.inverse(A);
    const [a, b] = A[0], [c, dd] = A[1];
    const q = "Show that $" + mapStr(A, ["x", "y"]) + "$ is an isomorphism of $\\R^2$ and find $T^{-1}$.";
    const sol = "<p><b>Linear:</b> each component is a linear combination of $x,y$ (prove with the one-line test).</p><p><b>Injective:</b> $T(x,y) = (0,0)$ means $" + FMT.lincomb([a, b], ["x", "y"]) + " = 0$ and $" + FMT.lincomb([c, dd], ["x", "y"]) + " = 0$. The coefficient determinant is $" + d.tex() + "\\neq0$, so the only solution is $x = y = 0$: $\\ker T = \\{0\\}$.</p><p><b>Surjective:</b> $\\dim\\R^2 = \\dim\\R^2$ and $T$ is injective, so by Rank–Nullity $\\Rank T = 2$; hence $T$ is an isomorphism.</p>" +
      "<p><b>Inverse:</b> solve $T(x,y) = (u,v)$ for $x,y$:</p>$$T^{-1}(u,v) = \\big(" + FMT.lincomb(inv[0], ["u", "v"]) + ",\\;" + FMT.lincomb(inv[1], ["u", "v"]) + "\\big).$$<p>Check: $T(T^{-1}(u,v)) = (u,v)$ ✔.</p>";
    return { q, kind: "self", sol };
  } };

  G.rn = { t: "Rank–Nullity & dimensions (quick)", ch: 3, gen() {
    const t = LA.pick(["null", "rank", "dimL", "inj", "surj"]);
    if (t === "null" || t === "rank") { const n = ri(3, 7), m = ri(2, 6), r = ri(1, Math.min(n, m)); if (t === "null") return { q: "A linear map $T:\\R^{" + n + "}\\to\\R^{" + m + "}$ has $\\Rank(T) = " + r + "$. What is $\\Nullity(T)$?", kind: "num", ans: n - r, sol: "<p>Rank–Nullity uses the <b>domain</b>: $\\Nullity(T) = " + n + " - " + r + " = " + (n - r) + "$.</p>" }; return { q: "A linear map $T:\\R^{" + n + "}\\to\\R^{" + m + "}$ has $\\Nullity(T) = " + (n - r) + "$. What is $\\Rank(T)$?", kind: "num", ans: r, sol: "<p>$\\Rank = \\dim\\R^{" + n + "} - \\Nullity = " + n + " - " + (n - r) + " = " + r + "$.</p>" }; }
    if (t === "dimL") { const sp = [["\\P_{1}", 2], ["\\P_{2}", 3], ["\\P_{3}", 4], ["\\R^{2}", 2], ["\\R^{3}", 3], ["\\R^{2\\times2}", 4], ["\\R^{2\\times3}", 6]]; const a = LA.pick(sp), b = LA.pick(sp); return { q: "What is $\\dim\\Lin(" + a[0] + "," + b[0] + ")$?", kind: "num", ans: a[1] * b[1], sol: "<p>$\\dim\\Lin(V,W) = \\dim V\\cdot\\dim W = " + a[1] + "\\cdot" + b[1] + " = " + a[1] * b[1] + "$.</p>" }; }
    const n = ri(2, 6), m = ri(2, 6);
    if (t === "inj") return { q: "Can a linear map $T:\\R^{" + n + "}\\to\\R^{" + m + "}$ be injective?", kind: "mcq", opts: ["Yes, it is possible", "No, never"], ans: n <= m ? 0 : 1, sol: n <= m ? "<p>Yes — e.g. $T(x) = (x,0,\\dots,0)$ (pad with zeros). Injective needs $\\Nullity = 0$, i.e. $\\Rank = " + n + "\\le" + m + "$, which is possible.</p>" : "<p>No: $\\Nullity = " + n + " - \\Rank\\ge" + n + "-" + m + "\\gt0$, so the kernel is never $\\{0\\}$.</p>" };
    return { q: "Can a linear map $T:\\R^{" + n + "}\\to\\R^{" + m + "}$ be surjective?", kind: "mcq", opts: ["Yes, it is possible", "No, never"], ans: n >= m ? 0 : 1, sol: n >= m ? "<p>Yes — e.g. keep the first " + m + " coordinates. We need $\\Rank = " + m + "\\le" + n + "$.</p>" : "<p>No: $\\Rank T\\le\\dim\\R^{" + n + "} = " + n + "\\lt" + m + "$.</p>" };
  } };

  G.gs = { t: "Gram–Schmidt in ℝⁿ", ch: 4, gen() {
    const n = LA.pick([3, 3, 4]); const k = n === 4 ? LA.pick([2, 3]) : LA.pick([2, 3]);
    let vs; do { vs = Array.from({ length: k }, () => Array.from({ length: n }, () => F(ri(-1, 2)))); } while (ALG.rank(vs) < k || vs.some((v) => V.isZero(v)));
    const res = LA.runGS(vs, (a, b) => V.dot(a, b), "rn");
    LA.stat("gs");
    return { q: "Use the Gram–Schmidt process (dot product) to find an orthonormal basis for $\\spn\\{" + vs.map((v) => V.tex(v)).join(",\\;") + "\\}$.", kind: "self", sol: LA.gsHTML(res) };
  } };

  G.gsp = { t: "Gram–Schmidt for polynomials", ch: 4, gen() {
    const ipsrc = LA.pick(["int(0,1)", "int(-1,1)", "int(0,1)"]);
    const terms = LA.parseIP(ipsrc); const ip = LA.polyIP(terms);
    let p, q;
    do { p = new Poly([ri(-2, 3), ri(-2, 2)]); q = new Poly([ri(-2, 2), ri(-2, 2), LA.pick([0, 1, -1])]); } while (p.isZero() || q.isZero() || ALG.rank([p.coeffVec(2), q.coeffVec(2)]) < 2);
    const res = LA.runGS([p, q], ip, "poly");
    LA.stat("gs");
    return { q: "With $\\langle p,q\\rangle = " + LA.ipTex(terms) + "$ on $\\P_2$, apply Gram–Schmidt to $\\{" + p.tex() + ",\\;" + q.tex() + "\\}$.", kind: "self", sol: LA.gsHTML(res) };
  } };

  G.perp = { t: "Orthogonal complement S⊥", ch: 4, gen() {
    const n = LA.pick([3, 3, 4]); const k = n === 3 ? LA.pick([1, 2]) : LA.pick([1, 2, 3]);
    let S; do { S = Array.from({ length: k }, () => Array.from({ length: n }, () => F(ri(-2, 3)))); } while (ALG.rank(S) < k);
    const vars = VARS[n]; const red = ALG.rowReduce(S, { mode: "rref" }); const ns = ALG.nullspace(S).basis.map((v) => V.integerize(v, true).vec);
    const sol = "<p>$" + "(" + vars.join(",") + ")\\in S^\\perp$ iff it is orthogonal to each vector of $S$:</p>$$" + S.map((s) => FMT.lincomb(s, vars) + " = 0").join(",\\qquad ") + "$$<p>Row-reduce the coefficient matrix (rows = vectors of $S$):</p>$$" + M.tex(S) + "\\to" + M.tex(red.R) + "$$<p>Solving (free variables = parameters):</p>$$S^\\perp = \\spn\\{" + ns.map((v) => V.tex(v)).join(",\\;") + "\\},\\qquad\\dim S^\\perp = " + n + " - " + k + " = " + ns.length + ".$$<p>Check: " + ns.map((v) => S.map((s) => "$" + V.tex(v) + "\\cdot" + V.tex(s) + " = " + V.dot(v, s).tex() + "$").join(", ")).join("; ") + " ✔</p>";
    return { q: "Find $S^\\perp$ (dot product) for $S = \\{" + S.map((s) => V.tex(s)).join(",\\;") + "\\}\\subset\\R^{" + n + "}$.", kind: "self", sol };
  } };

  G.norm = { t: "Norms, angles, distance", ch: 4, gen() {
    if (Math.random() < 0.6) {
      const n = LA.pick([2, 3]); let u, v; do { u = Array.from({ length: n }, () => F(ri(-3, 4))); v = Array.from({ length: n }, () => F(ri(-3, 4))); } while (V.isZero(u) || V.isZero(v));
      const uu = V.dot(u, u), vv = V.dot(v, v), uv = V.dot(u, v), d = V.sub(u, v), dd = V.dot(d, d);
      const cos = uv.toNumber() / Math.sqrt(uu.toNumber() * vv.toNumber());
      return { q: "For $u = " + V.tex(u) + "$ and $v = " + V.tex(v) + "$ (dot product) find $\\lVert u\\rVert$, the unit vector $\\hat u$, $d(u,v)$ and the angle between $u$ and $v$.", kind: "self",
        sol: "$$\\lVert u\\rVert = \\sqrt{" + uu.tex() + "} = " + N.sqrtTex(uu) + ",\\qquad \\hat u = \\frac{1}{" + N.sqrtTex(uu) + "}" + V.tex(u) + "$$$$d(u,v) = \\lVert u-v\\rVert = \\lVert" + V.tex(d) + "\\rVert = " + N.sqrtTex(dd) + "$$$$\\cos\\theta = \\frac{u\\cdot v}{\\lVert u\\rVert\\lVert v\\rVert} = \\frac{" + uv.tex() + "}{" + N.sqrtTex(uu) + "\\cdot" + N.sqrtTex(vv) + "}\\approx" + cos.toFixed(4) + "\\;\\Rightarrow\\;\\theta\\approx" + Math.acos(cos).toFixed(4) + "\\text{ rad}" + (uv.isZero() ? "\\;(\\perp)" : "") + "$$" };
    }
    const terms = LA.parseIP("int(0,1)"); const ip = LA.polyIP(terms); let p, q; do { p = new Poly([ri(-2, 3), ri(-3, 3)]); q = new Poly([ri(-2, 3), ri(-3, 3)]); } while (p.isZero() || q.isZero());
    const pp = ip(p, p), qq = ip(q, q), pq = ip(p, q);
    return { q: "With $\\langle f,g\\rangle = \\int_0^1 f(x)g(x)\\,dx$, find $\\langle p,q\\rangle$, $\\lVert p\\rVert$ and $\\hat p$ for $p = " + p.tex() + "$, $q = " + q.tex() + "$. Are they orthogonal?", kind: "self",
      sol: "$$\\langle p,q\\rangle = \\int_0^1(" + p.tex() + ")(" + q.tex() + ")\\,dx = \\int_0^1 \\big(" + p.mul(q).tex() + "\\big)dx = " + pq.tex() + "$$$$\\lVert p\\rVert^2 = \\int_0^1\\big(" + p.mul(p).tex() + "\\big)dx = " + pp.tex() + "\\;\\Rightarrow\\;\\lVert p\\rVert = " + N.sqrtTex(pp) + ",\\quad\\hat p = \\frac{1}{" + N.sqrtTex(pp) + "}\\big(" + p.tex() + "\\big)$$<p>" + (pq.isZero() ? "Since $\\langle p,q\\rangle = 0$, they <b>are</b> orthogonal." : "Since $\\langle p,q\\rangle\\neq0$, they are <b>not</b> orthogonal.") + "</p>" };
  } };

  const IPLIST = [
    ["\\langle x,y\\rangle = 3x_1y_1 + 5x_2y_2 \\text{ on } \\R^2", true, "Positive weights: a weighted dot product. All four axioms hold."],
    ["\\langle x,y\\rangle = x_1y_1 - x_2y_2 \\text{ on } \\R^2", false, "Non-negativity fails: $\\langle(0,1),(0,1)\\rangle = -1$."],
    ["\\langle x,y\\rangle = x_1y_1 \\text{ on } \\R^2", false, "Coincidence fails: $(0,1)\\neq0$ but $\\langle(0,1),(0,1)\\rangle = 0$."],
    ["\\langle x,y\\rangle = x_1y_2 + x_2y_1 \\text{ on } \\R^2", false, "Non-negativity fails: $\\langle(1,-1),(1,-1)\\rangle = -2$."],
    ["\\langle p,q\\rangle = \\int_0^1 p(x)q(x)\\,dx \\text{ on } \\P_3", true, "$\\int_0^1p^2 = 0$ forces $p\\equiv0$ on $[0,1]$, hence $p = 0$."],
    ["\\langle p,q\\rangle = \\int_{-1}^1 p'(x)q'(x)\\,dx \\text{ on } \\P_2", false, "Coincidence fails: the constant $p = 1$ has $\\langle p,p\\rangle = 0$."],
    ["\\langle p,q\\rangle = \\int_{-1}^1 p'q'\\,dx + p(0)q(0) \\text{ on } \\P_2", true, "If $\\langle p,p\\rangle = 0$ then $p' \\equiv 0$ so $p$ is constant, and $p(0) = 0$ makes it $0$."],
    ["\\langle p,q\\rangle = p(0)q(0) + p(1)q(1) \\text{ on } \\P_1", true, "Two roots force a degree-$\\le1$ polynomial to be $0$."],
    ["\\langle p,q\\rangle = p(0)q(0) + p(1)q(1) \\text{ on } \\P_2", false, "Coincidence fails: $p = x^2 - x\\neq0$ has $\\langle p,p\\rangle = 0$."],
    ["\\langle p,q\\rangle = p(0)q(0)+p(1)q(1)+p(2)q(2) \\text{ on } \\P_2", true, "Three roots force a degree-$\\le2$ polynomial to be $0$."],
    ["\\langle A,B\\rangle = \\operatorname{tr}(A)\\operatorname{tr}(B) \\text{ on } \\R^{2\\times2}", false, "Coincidence fails: $\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}\\neq0$ has trace $0$."],
    ["\\langle A,B\\rangle = a_{11}b_{11}+2a_{12}b_{12}+a_{21}b_{21}+4a_{22}b_{22} \\text{ on } \\R^{2\\times2}", true, "A weighted sum of products of entries with positive weights."],
    ["\\langle x,y\\rangle = (x_1+x_2)(y_1+y_2) \\text{ on } \\R^2", false, "Coincidence fails: $(1,-1)\\neq0$ gives $0$."],
    ["\\langle x,y\\rangle = x_1y_1 + x_1y_2 + x_2y_1 + 2x_2y_2 \\text{ on } \\R^2", true, "$\\langle x,x\\rangle = (x_1+x_2)^2 + x_2^2\\ge0$, zero only if $x_2 = 0$ and $x_1 = 0$."],
  ];
  G.ipcheck = { t: "Inner product or not?", ch: 4, gen() {
    const e = LA.pick(IPLIST);
    return { q: "Is $" + e[0] + "$ an inner product?", kind: "mcq", opts: ["Yes, it is an inner product", "No, an axiom fails"], ans: e[1] ? 0 : 1, sol: "<p>" + e[2] + "</p>" };
  } };

  G.orth = { t: "Orthogonal / orthonormal check", ch: 4, gen() {
    const sets = [
      [[[1, 1, 0], [1, -1, 0], [0, 0, 1]], "orthogonal (not orthonormal)"],
      [[[1, 2, 2], [2, 1, -2], [2, -2, 1]], "orthogonal (not orthonormal)"],
      [[[1, 0, 1], [0, 1, 0], [1, 0, -1]], "orthogonal (not orthonormal)"],
      [[[1, 1, 1], [1, -1, 0], [1, 1, -1]], "neither"],
      [[[3, 4], [-4, 3]], "orthogonal (not orthonormal)"],
      [[[1, 2], [2, 1]], "neither"],
    ];
    const s = LA.pick(sets); const vs = s[0].map((v) => v.map(F));
    const dots = []; vs.forEach((a, i) => vs.forEach((b, j) => { if (i < j) dots.push("$v_" + (i + 1) + "\\cdot v_" + (j + 1) + " = " + V.dot(a, b).tex() + "$"); }));
    const norms = vs.map((v, i) => "$\\lVert v_" + (i + 1) + "\\rVert = " + N.sqrtTex(V.dot(v, v)) + "$");
    const isOrth = dots.every((d) => / = 0\$$/.test(d));
    return { q: "Is $\\{" + vs.map((v) => V.tex(v)).join(",\\;") + "\\}$ orthogonal, orthonormal, or neither (dot product)?", kind: "mcq", opts: ["Orthonormal", "Orthogonal but not orthonormal", "Neither"], ans: isOrth ? 1 : 2,
      sol: "<p>Pairwise: " + dots.join(", ") + ". Norms: " + norms.join(", ") + ".</p><p>" + (isOrth ? "All pairs are orthogonal but the norms are not all 1 ⇒ <b>orthogonal, not orthonormal</b>. Normalise each vector to get an orthonormal set: " + vs.map((v) => "$\\frac{1}{" + N.sqrtTex(V.dot(v, v)) + "}" + V.tex(v) + "$").join(", ") + "." : "Some inner product is non-zero ⇒ <b>neither</b>.") + "</p>" };
  } };

  LA.GENERATORS = G;

  /* ------------------------------ page ------------------------------ */
  const GROUPS = [["mix", "🎯 Mixed Ch 3 & 4", Object.keys(G)], ["ch3", "Chapter 3 only", Object.keys(G).filter((k) => G[k].ch === 3)], ["ch4", "Chapter 4 only", Object.keys(G).filter((k) => G[k].ch === 4)]].concat(Object.keys(G).map((k) => [k, G[k].t, [k]]));
  LA.page("/practice/classic", {
    title: "Classic Practice", searchTitle: "Classic Practice (v1)", searchDesc: "The original Chapter 3 & 4 practice generators",
    render(p, q) {
      const sel = q.t || "mix"; const st = LA.state.stats.practiceByType || {};
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Infinite practice · Chapters 3 & 4</div><h1>Practice Arena</h1><p class="lead">Every click makes a brand-new problem with a complete worked solution, computed exactly. Attempt it on paper first, then reveal the solution and mark yourself honestly.</p><div class="row"><span class="chip lime">Solved: ' + (LA.state.stats.practice || 0) + "</span></div></div></div>" +
        '<div class="row" style="margin:16px 0">' + GROUPS.map((g) => '<a class="chip ' + (g[0] === sel ? "violet" : "") + '" href="#/practice/classic?t=' + g[0] + '">' + g[1] + (st[g[0]] ? " · " + st[g[0]] : "") + "</a>").join("") + "</div>" +
        '<div id="prob"></div></div>';
    },
    after(view, p, q) {
      const sel = q.t || "mix"; const grp = GROUPS.find((g) => g[0] === sel) || GROUPS[0];
      const host = $("#prob", view);
      const next = () => {
        const key = LA.pick(grp[2]); let pr;
        try { pr = G[key].gen(); } catch (e) { console.error(e); return next(); }
        const head = '<div class="card glow"><div class="row spread"><span class="chip ' + (G[key].ch === 3 ? "violet" : "cyan") + '">Ch ' + G[key].ch + " · " + G[key].t + '</span><button class="btn btn-sm" id="skip">↻ New problem</button></div><div style="font-size:1.08rem;margin:14px 0">' + pr.q + "</div>";
        let body = "";
        if (pr.kind === "mcq") body = '<div class="quiz-opts">' + pr.opts.map((o, i) => '<button class="quiz-opt" data-o="' + i + '"><span class="lt">' + "ABC"[i] + "</span><span>" + o + "</span></button>").join("") + "</div>";
        else if (pr.kind === "num") body = '<div class="row"><input type="text" id="numAns" class="mono-in" placeholder="Your answer" style="width:140px"><button class="btn btn-primary" id="numChk">Check</button></div>';
        else body = '<p class="muted small">Work it out fully on paper (the coursework will ask for the working), then reveal the model solution.</p><button class="btn btn-primary" id="reveal">Reveal full solution</button>';
        host.innerHTML = head + body + '<div id="solHost"></div></div>';
        LA.renderMath(host);
        const showSol = (verdict) => {
          const sh = $("#solHost", host);
          sh.innerHTML = (verdict === undefined ? "" : '<p style="margin-top:12px"><b class="' + (verdict ? "okc" : "err") + '">' + (verdict ? "✓ Correct!" : "✗ Not quite.") + "</b></p>") + '<div class="box ex" data-t="Worked solution" style="margin-top:12px">' + pr.sol + "</div>" +
            (pr.kind === "self" ? '<div class="row" style="margin-top:10px"><span class="muted small">How did you do?</span><button class="btn btn-ok" id="gotIt">✓ I got it</button><button class="btn btn-bad" id="review">✗ Need review</button></div>' : '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="again">Next problem ▸</button></div>');
          LA.enhance(sh); LA.renderMath(sh);
          const done = (ok) => { LA.stat("practice"); LA.stat("practiceByType", 1, key); LA.stat("practiceByType", 1, sel === key ? "_x" : sel); if (ok) LA.addXP(8, "Practice problem"); next(); };
          if ($("#gotIt", sh)) { $("#gotIt", sh).onclick = () => done(true); $("#review", sh).onclick = () => { LA.toast("Logged for review", "Re-read the matching recipe, then try another."); done(false); }; }
          if ($("#again", sh)) $("#again", sh).onclick = next;
        };
        $("#skip", host).onclick = next;
        if (pr.kind === "mcq") $$("[data-o]", host).forEach((b) => b.onclick = () => { const k = Number(b.dataset.o); $$("[data-o]", host).forEach((x, i) => { x.disabled = true; if (i === pr.ans) x.classList.add("correct"); else if (i === k) x.classList.add("wrong"); }); const ok = k === pr.ans; if (ok) { LA.stat("practice"); LA.stat("practiceByType", 1, key); LA.addXP(4, "Correct!"); } showSol(ok); });
        else if (pr.kind === "num") { const chk = () => { const v = Number($("#numAns", host).value); const ok = v === pr.ans; if (ok) { LA.stat("practice"); LA.stat("practiceByType", 1, key); LA.addXP(4, "Correct!"); } showSol(ok); }; $("#numChk", host).onclick = chk; $("#numAns", host).addEventListener("keydown", (e) => { if (e.key === "Enter") chk(); }); }
        else $("#reveal", host).onclick = () => { $("#reveal", host).remove(); showSol(); };
      };
      next();
    },
  });
})();
