/* Topic registry: the backbone that connects lessons, labs, proofs, practice generators, exams,
   counterexamples, flashcards, mastery and the concept map.
   nums: box-number ranges (from the lesson's data-t numbering) used to extract the topic's part of a section. */
(function () {
  "use strict";
  const LA = window.LA;
  const T = (id, ch, title, sec, nums, prereq, summary, key, extra) => Object.assign({ id, ch, title, sec, nums, prereq, summary, key, labs: [], recipes: [], parsons: [] }, extra || {});
  LA.TOPICS = [
    // ---------------- Chapter 1
    T("sets", 1, "Sets and set algebra", ["1.1"], ["1.1.1-1.1.99"], [],
      "Sets are collections; the algebra of $\\cup,\\cap,\\setminus$ and complements obeys identities (De Morgan, distributive laws) that you prove by double inclusion.",
      ["$A = B\\iff A\\subseteq B$ and $B\\subseteq A$", "$(A\\cup B)^c = A^c\\cap B^c$, $(A\\cap B)^c = A^c\\cup B^c$", "$|A\\times B| = |A|\\,|B|$"], { proofs: true }),
    T("relations", 1, "Relations and equivalence relations", ["1.2"], ["1.2.1-1.2.6"], ["sets"],
      "A relation is a set of ordered pairs. An equivalence relation (reflexive, symmetric, transitive) splits a set into disjoint equivalence classes.",
      ["Reflexive: $xRx$; symmetric: $xRy\\Rightarrow yRx$; transitive: $xRy, yRz\\Rightarrow xRz$", "Equivalence relations ⇔ partitions"]),
    T("functions", 1, "Functions: injective, surjective, bijective", ["1.2"], ["1.2.7-1.2.23"], ["sets"],
      "Injective: different inputs give different outputs. Surjective: every element of the codomain is hit. Bijective: both, so an inverse exists.",
      ["Injective: $f(x_1) = f(x_2)\\Rightarrow x_1 = x_2$", "Surjective: $\\forall y\\,\\exists x: f(x) = y$", "$g\\circ f$ injective ⇒ $f$ injective; $g\\circ f$ surjective ⇒ $g$ surjective"]),
    T("binary-ops", 1, "Binary operations", ["1.2"], ["1.2.24-1.2.99"], ["functions"],
      "A binary operation on $S$ is a function $S\\times S\\to S$: it must be defined for every pair and land back in $S$ (closure).",
      ["$*: S\\times S\\to S$ — check closure and well-definedness"]),
    // ---------------- Chapter 2
    T("vector-spaces", 2, "Fields and vector spaces", ["2.1"], ["2.1.1-2.1.99"], ["binary-ops"],
      "A vector space is a set with addition and scalar multiplication satisfying the axioms. $\\R^n$, $\\P_n$, matrices and function spaces are all vector spaces.",
      ["Closure under $+$ and scalar multiplication, plus the 8 axioms", "$0\\cdot v = 0$, $(-1)v = -v$"]),
    T("subspaces", 2, "Subspaces and the subspace test", ["2.2"], ["2.2.1-2.2.99"], ["vector-spaces"],
      "A subspace is a subset that is itself a vector space. Test: contains $0$ and closed under linear combinations.",
      ["$W\\le V\\iff 0\\in W$ and $au+bv\\in W$ for all $u,v\\in W$", "Subspaces of $\\R^3$: $\\{0\\}$, lines and planes through $0$, $\\R^3$"], { parsons: ["subtest"], recipes: ["r-subspace"] }),
    T("span", 2, "Linear combinations and span", ["2.3"], ["2.3.1-2.3.99"], ["subspaces"],
      "The span of a set is everything you can build from it with linear combinations; it is the smallest subspace containing the set.",
      ["$\\spn\\{v_1,\\dots,v_k\\} = \\{a_1v_1+\\dots+a_kv_k\\}$", "$v\\in\\spn S\\iff$ the system with columns $S$ and right side $v$ is consistent"]),
    T("independence", 2, "Linear independence", ["2.4"], ["2.4.1-2.4.4"], ["span"],
      "Vectors are independent when the only combination giving $0$ is the trivial one — no vector is redundant.",
      ["Independent ⇔ $a_1v_1+\\dots+a_kv_k = 0\\Rightarrow$ all $a_i = 0$", "$n$ vectors in $\\R^n$: independent ⇔ $\\det\\neq0$", "Any set containing $0$ is dependent"], { recipes: ["r-li"] }),
    T("basis-dimension", 2, "Basis, coordinates and dimension", ["2.4"], ["2.4.5-2.4.99"], ["independence"],
      "A basis is an independent spanning set; every vector has unique coordinates in it. All bases have the same size: the dimension.",
      ["$\\dim\\R^n = n$, $\\dim\\P_n = n+1$, $\\dim\\R^{m\\times n} = mn$", "In dimension $n$: $n$ independent vectors ⇔ $n$ spanning vectors ⇔ basis"], { recipes: ["r-basis-images"] }),
    T("sums", 2, "Sums and direct sums", ["2.5"], ["2.5.1-2.5.99"], ["basis-dimension"],
      "$U+W$ is the smallest subspace containing both; it is direct ($U\\oplus W$) when $U\\cap W = \\{0\\}$.",
      ["$\\dim(U+W) = \\dim U+\\dim W-\\dim(U\\cap W)$", "$V = U\\oplus W\\iff V = U+W$ and $U\\cap W = \\{0\\}$"]),
    // ---------------- Chapter 3
    T("linear-maps", 3, "Linear transformations", ["3.1"], ["3.1.1-3.1.99"], ["vector-spaces", "functions"],
      "A linear map preserves addition and scalar multiplication: $T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)$. It is determined by the images of a basis.",
      ["$T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)$", "Linear ⇒ $T(0) = 0$ (use it to DISPROVE linearity)", "Standard matrix: columns $T(e_1),\\dots,T(e_n)$"], { labs: [["Linearity Checker", "#/labs/linearity"], ["2D Transformation Visualizer", "#/labs/transform"]], parsons: ["t0"], recipes: ["r-linear", "r-notlinear"] }),
    T("kernel-range", 3, "Kernel, range and Rank–Nullity", ["3.2"], ["3.2.1-3.2.99"], ["linear-maps", "subspaces", "basis-dimension"],
      "The kernel is what $T$ sends to $0$; the range is everything $T$ can reach. Rank–Nullity: $\\dim\\ker T+\\dim\\Ran T = \\dim V$.",
      ["$\\ker T = \\{v: T(v) = 0\\}\\le V$", "$\\Ran T = \\spn\\{T(v_1),\\dots,T(v_n)\\}\\le W$", "$\\Rank T+\\Nullity T = \\dim V$", "$T$ injective $\\iff\\ker T = \\{0\\}$"], { labs: [["Kernel · Range · Rank–Nullity", "#/labs/kernel"], ["2D Transformation Visualizer", "#/labs/transform"]], parsons: ["kertest", "kersub"], recipes: ["r-kernel", "r-inj"] }),
    T("isomorphisms", 3, "Inverses, isomorphisms and the algebra of maps", ["3.3"], ["3.3.1-3.3.99"], ["kernel-range"],
      "Linear maps can be added, scaled and composed. A bijective linear map has a linear inverse; isomorphic spaces are 'the same' as vector spaces.",
      ["$\\dim\\Lin(V,W) = \\dim V\\cdot\\dim W$", "$T$ bijective ⇒ $T^{-1}$ linear", "$\\dim V = \\dim W$ ⇒ injective ⇔ surjective ⇔ bijective", "$V\\cong\\FF^{\\dim V}$"], { parsons: ["inverse", "injLI", "composition"], recipes: ["r-inverse", "r-dimL"] }),
    T("matrix-of-map", 3, "The matrix of a linear map", ["3.4"], ["3.4.1-3.4.4"], ["linear-maps", "basis-dimension"],
      "Choosing bases turns any linear map into a matrix: column $j$ holds the coordinates of $T(v_j)$. Then $[T(v)]_{\\Cc} = [T]^{\\Cc}_{\\B}[v]_{\\B}$.",
      ["$[T]^{\\Cc}_{\\B} = \\big([T(v_1)]_{\\Cc}\\cdots[T(v_n)]_{\\Cc}\\big)$", "$[T(v)]_{\\Cc} = [T]^{\\Cc}_{\\B}[v]_{\\B}$", "$(C\\,|\\,T(v_1)\\cdots T(v_n))\\to(I\\,|\\,[T]^{\\Cc}_{\\B})$"], { labs: [["Matrix of T w.r.t. Bases", "#/labs/matrix"]], recipes: ["r-matrix"] }),
    T("change-of-basis", 3, "Change of basis and similarity", ["3.4"], ["3.4.5-3.4.99"], ["matrix-of-map"],
      "The same operator has different matrices in different bases; they are related by $B = P^{-1}AP$ (similar matrices), where the columns of $P$ are the new basis vectors in old coordinates.",
      ["$[v]_{\\text{std}} = P[v]_{\\B}$, $[v]_{\\B} = P^{-1}[v]_{\\text{std}}$", "$[T]_{\\B} = P^{-1}[T]_{\\text{std}}P$", "Similar matrices share $\\det$, trace, rank, eigenvalues"], { labs: [["Change-of-Basis Lab", "#/labs/change-of-basis"]] }),
    // ---------------- Chapter 4
    T("inner-products", 4, "Inner products", ["4.1"], ["4.1.1-4.1.3"], ["vector-spaces"],
      "An inner product generalises the dot product: it is positive, coincident (only $0$ has $\\langle u,u\\rangle = 0$), symmetric and linear.",
      ["$\\langle u,u\\rangle\\ge0$, $=0\\iff u = 0$", "$\\langle u,v\\rangle = \\langle v,u\\rangle$", "$\\langle au+bv,w\\rangle = a\\langle u,w\\rangle+b\\langle v,w\\rangle$"], { labs: [["Inner Product Lab", "#/labs/inner"]], recipes: ["r-ip", "r-notip"] }),
    T("norms-angles", 4, "Norms, angles and the big inequalities", ["4.1", "4.2"], ["4.1.4-4.1.99", "4.2.1-4.2.2", "4.2.6-4.2.8"], ["inner-products"],
      "The norm $\\lVert u\\rVert = \\sqrt{\\langle u,u\\rangle}$ measures length; Cauchy–Schwarz makes angles possible; the triangle inequality makes distance behave.",
      ["$\\cos\\theta = \\frac{\\langle u,v\\rangle}{\\lVert u\\rVert\\lVert v\\rVert}$", "$|\\langle u,v\\rangle|\\le\\lVert u\\rVert\\lVert v\\rVert$", "$\\lVert u+v\\rVert\\le\\lVert u\\rVert+\\lVert v\\rVert$", "$u\\perp v\\Rightarrow\\lVert u+v\\rVert^2 = \\lVert u\\rVert^2+\\lVert v\\rVert^2$"], { parsons: ["pyth", "cs"], recipes: ["r-norm", "r-ineq"] }),
    T("orthogonality", 4, "Orthogonality and orthogonal complements", ["4.2"], ["4.2.3-4.2.5", "4.2.9-4.2.99"], ["norms-angles", "subspaces"],
      "Orthogonal vectors have inner product $0$. $S^\\perp$ collects everything orthogonal to $S$ and is always a subspace. Orthogonal non-zero vectors are independent.",
      ["$S^\\perp = \\{u: \\langle u,s\\rangle = 0\\ \\forall s\\in S\\}\\le V$", "$S\\cap S^\\perp = \\{0\\}$; in $\\R^n$: $\\dim S+\\dim S^\\perp = n$", "Orthonormal: $\\langle w_i,w_j\\rangle = \\delta_{ij}$"], { labs: [["3D Orthogonality", "#/labs/gs3d"]], parsons: ["wperp", "orthLI"], recipes: ["r-perp", "r-perpprop", "r-onset"] }),
    T("gram-schmidt", 4, "The Gram–Schmidt process", ["4.2.14"], ["4.2.12-4.2.99"], ["orthogonality", "basis-dimension"],
      "Gram–Schmidt turns any basis into an orthonormal one: subtract the projections onto the earlier vectors, then normalise.",
      ["$u_k = v_k-\\sum_{j\\lt k}\\frac{\\langle v_k,u_j\\rangle}{\\langle u_j,u_j\\rangle}u_j$", "$w_k = u_k/\\lVert u_k\\rVert$", "$\\spn\\{v_1..v_k\\} = \\spn\\{w_1..w_k\\}$ for each $k$"], { labs: [["Gram–Schmidt Machine", "#/labs/gram-schmidt"], ["3D Orthogonality", "#/labs/gs3d"]], parsons: ["sints"], recipes: ["r-gs"] }),
    T("projections", 4, "Projections and best approximation", ["4.D"], [], ["gram-schmidt"],
      "The orthogonal projection of $v$ onto a subspace is the closest point of the subspace to $v$; least squares is projection onto a column space.",
      ["$\\mathrm{proj}_u v = \\frac{\\langle v,u\\rangle}{\\langle u,u\\rangle}u$", "$\\mathrm{proj}_S v = \\sum\\langle v,w_i\\rangle w_i$ (orthonormal $w_i$)", "Least squares: $A^TA\\hat x = A^Tb$"], { titles: ["Best approximation", "Projection onto a plane", "Least-squares line"] }),
    // ---------------- Chapter 5
    T("systems-rref", 5, "Linear systems and row reduction", ["5.1"], ["5.1.1-5.1.99"], ["span"],
      "Row operations change a system into a simpler one with the same solutions. Reduced row echelon form reveals pivots, free variables and consistency.",
      ["Row ops: swap, scale by $c\\neq0$, add a multiple", "Inconsistent ⇔ a row $(0\\cdots0\\,|\\,c\\neq0)$", "$[A\\,|\\,I]\\to[I\\,|\\,A^{-1}]$"], { labs: [["Row Reduction Stepper", "#/labs/rref"]], recipes: ["r-rref"] }),
    T("rank-spaces", 5, "Rank, row space, column space, null space", ["5.2"], ["5.2.1-5.2.99"], ["systems-rref", "basis-dimension"],
      "Rank = number of pivots = dimension of the row space = dimension of the column space. The null space has dimension $n-\\text{rank}$.",
      ["$\\Rank A = \\dim\\RS(A) = \\dim\\CS(A)$", "$\\Nullity A = n-\\Rank A$", "Pivot columns of $A$ (original!) form a basis of $\\CS(A)$"], { labs: [["Row Reduction Stepper", "#/labs/rref"]] }),
    T("equivalence", 5, "Rank and equivalence", ["5.3"], ["5.3.1-5.3.99"], ["rank-spaces"],
      "Allowing row AND column operations, every matrix reduces to a normal form $N_r$; two matrices are equivalent exactly when they have the same size and rank.",
      ["$A\\sim B\\iff B = PAQ$ ($P,Q$ invertible)", "$A\\sim B\\iff$ same size and same rank", "$\\Rank A^T = \\Rank A$"]),
    // ---------------- Chapter 6
    T("permutations-det", 6, "Permutations and the determinant", ["6.1"], ["6.1.1-6.1.5"], ["functions"],
      "The determinant is a signed sum over permutations: $\\det A = \\sum_\\sigma\\sign(\\sigma)a_{1\\sigma(1)}\\cdots a_{n\\sigma(n)}$.",
      ["$\\sign\\sigma = (-1)^{\\#\\text{transpositions}}$; a $k$-cycle has sign $(-1)^{k-1}$", "$2\\times2$: $ad-bc$; $3\\times3$: cofactor expansion"], { labs: [["Determinant Lab", "#/labs/det"]], recipes: ["r-det"] }),
    T("det-properties", 6, "Properties of the determinant", ["6.1", "6.2"], ["6.1.7-6.1.99", "6.2.1-6.2.99"], ["permutations-det", "systems-rref"],
      "Row operations change the determinant predictably; $\\det$ is multiplicative and detects invertibility.",
      ["Swap: $\\times(-1)$; scale a row by $c$: $\\times c$; add a multiple: no change", "$\\det AB = \\det A\\det B$, $\\det A^T = \\det A$, $\\det A^{-1} = 1/\\det A$", "$\\det(cA) = c^n\\det A$", "$A$ invertible $\\iff\\det A\\neq0$"], { labs: [["Determinant Lab", "#/labs/det"]] }),
    // ---------------- Chapter 7
    T("eigen", 7, "Eigenvalues and eigenvectors", ["7.1"], ["7.1.1-7.1.99"], ["det-properties", "rank-spaces"],
      "An eigenvector keeps its direction under $A$: $Av = \\lambda v$, $v\\neq0$. Eigenvalues solve $\\det(A-\\lambda I) = 0$; eigenvectors span $\\Null(A-\\lambda I)$.",
      ["$\\det(A-\\lambda I) = 0$", "$2\\times2$: $\\lambda^2-(\\tr A)\\lambda+\\det A = 0$", "$\\sum\\lambda_i = \\tr A$, $\\prod\\lambda_i = \\det A$"], { labs: [["Eigen Lab", "#/labs/eigen"]], recipes: ["r-eig"] }),
    T("multiplicity", 7, "Spectrum and multiplicities", ["7.2"], ["7.2.1-7.2.99"], ["eigen"],
      "Algebraic multiplicity counts a root of the characteristic polynomial; geometric multiplicity is the dimension of the eigenspace. Always geometric ≤ algebraic.",
      ["$1\\le\\text{geo}(\\lambda)\\le\\text{alg}(\\lambda)$", "Similar matrices have the same characteristic polynomial"], { labs: [["Eigen Lab", "#/labs/eigen"]] }),
    T("diagonalization", 7, "Diagonalization", ["7.3"], ["7.3.1-7.3.4"], ["multiplicity", "change-of-basis"],
      "$A$ is diagonalizable when it has a basis of eigenvectors: $A = PDP^{-1}$. Then powers are easy: $A^k = PD^kP^{-1}$.",
      ["Diagonalizable ⇔ geo = alg for every eigenvalue", "$n$ distinct eigenvalues ⇒ diagonalizable (not conversely)", "$A^k = PD^kP^{-1}$"], { labs: [["Eigen Lab", "#/labs/eigen"]] }),
    T("cayley-hamilton", 7, "The Cayley–Hamilton theorem", ["7.3"], ["7.3.5-7.3.99"], ["eigen"],
      "Every square matrix satisfies its own characteristic equation: $p_A(A) = 0$. Use it to find inverses and reduce powers.",
      ["$p_A(A) = 0$", "$2\\times2$: $A^2 = (\\tr A)A-(\\det A)I$", "$A^{-1} = \\frac{1}{\\det A}\\big((\\tr A)I-A\\big)$ for $2\\times2$"]),
    // ---------------- Chapter 8
    T("quadratic-forms", 8, "Quadratic forms and their matrices", ["8.1"], ["8.1.1-8.1.99"], ["eigen"],
      "A quadratic form is $Q(x) = x^TAx$ with $A$ symmetric. Diagonal entries are the square coefficients; each cross coefficient is split in half.",
      ["$Q(x) = x^TAx = \\sum a_{ij}x_ix_j$", "Cross term $c\\,x_ix_j$ ⇒ $a_{ij} = a_{ji} = c/2$"], { labs: [["Quadratic Forms Lab", "#/labs/quadratic"]] }),
    T("spectral", 8, "Orthogonal matrices and the Spectral Theorem", ["8.2"], ["8.2.1-8.2.99"], ["quadratic-forms", "gram-schmidt", "diagonalization"],
      "Real symmetric matrices have real eigenvalues and orthogonal eigenvectors, so $A = PDP^T$ with $P$ orthogonal.",
      ["$P^TP = I\\iff P^{-1} = P^T$", "$A = A^T\\Rightarrow A = PDP^T$", "Distinct eigenvalues of symmetric $A$ ⇒ orthogonal eigenvectors"], { labs: [["Quadratic Forms Lab", "#/labs/quadratic"], ["Eigen Lab", "#/labs/eigen"]] }),
    T("principal-axes", 8, "Principal axes and conics", ["8.3"], ["8.3.1-8.3.99"], ["spectral"],
      "Rotating to the eigenvector axes removes the cross term: $Q = \\lambda_1y_1^2+\\dots+\\lambda_ny_n^2$, which identifies ellipses and hyperbolas.",
      ["$x = Py$ ⇒ $Q = \\lambda_1y_1^2+\\lambda_2y_2^2$", "Both $\\lambda>0$ (and $d>0$): ellipse; opposite signs: hyperbola"], { labs: [["Quadratic Forms Lab", "#/labs/quadratic"]] }),
    T("definiteness", 8, "Definiteness and Sylvester's criterion", ["8.4"], ["8.4.1-8.4.99"], ["principal-axes", "det-properties"],
      "The signs of the eigenvalues decide whether $Q$ is positive definite, negative definite or indefinite; Sylvester's criterion does it with leading minors.",
      ["PD ⇔ all $\\lambda>0$ ⇔ all $\\Delta_k>0$", "ND ⇔ $(-1)^k\\Delta_k>0$", "Semidefinite: use eigenvalues, not leading minors"], { labs: [["Quadratic Forms Lab", "#/labs/quadratic"]] }),
    T("optimisation", 8, "Optimisation and the Hessian test", ["8.5"], ["8.5.1-8.5.99"], ["definiteness"],
      "On the unit sphere $x^TAx$ ranges exactly between the smallest and largest eigenvalues; the definiteness of the Hessian classifies critical points.",
      ["$\\lambda_{\\mathrm{min}}\\le x^TAx\\le\\lambda_{\\mathrm{max}}$ for $\\lVert x\\rVert = 1$", "Hessian PD ⇒ min, ND ⇒ max, indefinite ⇒ saddle"], { labs: [["Quadratic Forms Lab", "#/labs/quadratic"]] }),
  ];
  LA.topic = (id) => LA.TOPICS.find((t) => t.id === id);
  LA.topicsOf = (ch) => LA.TOPICS.filter((t) => t.ch === ch);

  /* Extract the part of a chapter section that belongs to a topic (by box-number ranges).
     Unnumbered boxes (proofs, tips, traps…) travel with the numbered box before them. */
  const numKey = (s) => s.split(".").map((x) => parseInt(x, 10) || 0);
  const cmp = (a, b) => { for (let i = 0; i < 3; i++) { const d = (a[i] || 0) - (b[i] || 0); if (d) return d; } return 0; };
  LA.topicHTML = function (tp) {
    const out = [];
    tp.sec.forEach((sid) => {
      const ch = LA.chapters["ch" + tp.ch]; if (!ch) return;
      const sec = ch.sections.find((s) => s.id === sid); if (!sec) return;
      const tpl = document.createElement("template"); tpl.innerHTML = sec.html;
      if (tp.titles) { // pick boxes whose title mentions one of the given phrases
        const want = tp.titles.map((x) => x.toLowerCase());
        Array.from(tpl.content.children).forEach((nd) => { const t = (nd.getAttribute("data-t") || "").toLowerCase(); if (t && want.some((w) => t.includes(w))) out.push(nd.outerHTML); });
        return;
      }
      if (!tp.nums || !tp.nums.length) { out.push(sec.html); return; }
      let cur = null, first = true, take = false;
      const ranges = tp.nums.map((r) => r.split("-").map(numKey));
      Array.from(tpl.content.childNodes).forEach((nd) => {
        const t = nd.nodeType === 1 ? nd.getAttribute("data-t") || "" : "";
        const m = t.match(/^(\d+\.\d+\.\d+)/);
        if (m) { cur = numKey(m[1]); take = ranges.some(([a, b]) => cmp(cur, a) >= 0 && cmp(cur, b || a) <= 0); first = false; }
        else if (first) take = ranges.some(([a]) => a[2] <= 1); // section intro goes with the first topic of the section
        if (take) out.push(nd.nodeType === 1 ? nd.outerHTML : nd.nodeType === 3 ? nd.textContent : "");
      });
    });
    return out.join("");
  };
})();
