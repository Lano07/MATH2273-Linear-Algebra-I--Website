/* Question Recipes — algorithms for every testable question type */
(function () {
  "use strict";
  const H = String.raw;
  const R = [
    { ch: 3, id: "r-linear", t: "Prove that T is linear", when: "“Show that T is a linear transformation.”", steps: [
      "Write general vectors $u = (u_1,\\dots,u_n)$, $v = (v_1,\\dots,v_n)$ (or polynomials $p, q$) and scalars $\\alpha,\\beta$ — never specific numbers.",
      "Compute $\\alpha u+\\beta v$ componentwise, then substitute into the formula for $T$.",
      "Expand and regroup into $\\alpha(\\text{formula at }u)+\\beta(\\text{formula at }v)$.",
      "Conclude: $T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)$, so $T$ is linear (Theorem 3.1.3)." ],
      ex: H`$T(x,y) = (x+y,x-y)$: $T(\alpha u+\beta v) = \big((\alpha u_1+\beta v_1)+(\alpha u_2+\beta v_2),\,\ldots\big) = \alpha(u_1+u_2,u_1-u_2)+\beta(v_1+v_2,v_1-v_2)$.`,
      trap: "Checking only T(0) = 0, or checking with numbers. Neither proves linearity.", lab: ["Linearity Checker", "#/labs/linearity"] },
    { ch: 3, id: "r-notlinear", t: "Show that T is NOT linear", when: "“Determine whether…” and the formula has a constant, square, product, |·|, √ …", steps: [
      "Compute $T(0)$. If $T(0)\\ne0$: done (Prop 3.1.4).",
      "Otherwise pick a scalar ($\\alpha = 2$ or $-1$) and a simple vector ($e_1$, $(1,1)$, $p = 1$…) and compare $T(\\alpha u)$ with $\\alpha T(u)$.",
      "Or pick two simple vectors and compare $T(u+v)$ with $T(u)+T(v)$.",
      "State the specific numbers and conclude the condition fails." ],
      ex: H`$K(p) = p''+p^2$: $K(2) = 4$ but $2K(1) = 2$.`, trap: "Saying “it is not linear because of the square” without a numerical counterexample loses marks.", lab: ["Linearity Checker", "#/labs/linearity"] },
    { ch: 3, id: "r-basis-images", t: "Find T from its values on a basis", when: "“T(1,1) = …, T(−1,2) = … . Find T(x,y).”", steps: [
      "Write $(x,y,\\dots) = a_1b_1+\\dots+a_nb_n$.",
      "Solve for each $a_i$ in terms of $x,y,\\dots$.",
      "$T(x,y,\\dots) = a_1T(b_1)+\\dots+a_nT(b_n)$ — substitute and simplify.",
      "Check by plugging each $b_i$ back in." ],
      ex: H`Example 3.1.7 gives $T(x,y,z) = -5x+4y-6z$.`, trap: "Forgetting the final check — it catches sign errors instantly.", lab: ["Practice Arena", "#/practice"] },
    { ch: 3, id: "r-kernel", t: "Kernel & range: bases, dimensions, Rank–Nullity", when: "“Find a basis and the dimension of ker T and Ran T.”", steps: [
      "Kernel: solve $T(v) = 0$ (row-reduce the coefficient matrix). Parametrise the free variables; the vectors multiplying the parameters are a basis.",
      "Range: $\\Ran T = \\spn\\{T(e_1),\\dots,T(e_n)\\}$; keep the independent ones (pivot columns of the original matrix).",
      "Check: $\\Rank+\\Nullity = \\dim V$ (domain).",
      "Injective iff $\\Nullity = 0$; surjective iff $\\Rank = \\dim W$." ],
      ex: H`$T(x,y,z) = x-3y+5z$: $\ker T = \spn\{(3,1,0),(-5,0,1)\}$, $\Rank = 1$, $1+2 = 3$ ✔.`, trap: "Using dim W in Rank–Nullity; giving 0 as a basis vector.", lab: ["Kernel · Range lab", "#/labs/kernel"] },
    { ch: 3, id: "r-inj", t: "Injective / surjective / isomorphism / singular", when: "“Is T one-one? onto? an isomorphism? Show T is non-singular.”", steps: [
      "Injective ⇔ non-singular ⇔ $\\ker T = \\{0\\}$: solve $T(v) = 0$ and show only $v = 0$ works.",
      "Surjective ⇔ $\\Rank T = \\dim W$ (use Rank–Nullity).",
      "Isomorphism = linear + bijective. If $\\dim V = \\dim W$ (finite), injective alone suffices.",
      "Quick “no”s: $\\dim V>\\dim W$ ⇒ not injective; $\\dim V\\lt\\dim W$ ⇒ not surjective." ],
      ex: H`$f(x,y) = (x+y,x-y)$: $f(x,y) = 0\Rightarrow x = y = 0$ ⇒ non-singular ⇒ isomorphism of $\R^2$.`, trap: "Proving injectivity from the definition when the kernel test is one line.", lab: ["Kernel · Range lab", "#/labs/kernel"] },
    { ch: 3, id: "r-inverse", t: "Find T⁻¹ (and show it is linear)", when: "“Show T is invertible and find T⁻¹.”", steps: [
      "Show $T$ is bijective (recipe above).",
      "Set $T(x,y) = (u,v)$ and solve for $x,y$ in terms of $u,v$.",
      "Write $T^{-1}(u,v) = (\\ldots)$ and verify $T(T^{-1}(u,v)) = (u,v)$.",
      "Linearity of $T^{-1}$ is automatic (Theorem 3.3.4) — quote it or prove it." ],
      ex: H`$f(x,y) = (2x-y,x+y)\Rightarrow f^{-1}(u,v) = \big(\frac{u+v}{3},\frac{2v-u}{3}\big)$.`, trap: "Mixing up the roles of input and output variables.", lab: ["Practice Arena", "#/practice"] },
    { ch: 3, id: "r-matrix", t: "Matrix of T relative to bases B and C", when: "“Find [T]_B^C” / “use the matrix to compute T(p)”.", steps: [
      "Compute $T(v_i)$ for each vector of $\\B$, in order.",
      "Express each $T(v_i)$ in the basis $\\Cc$ (in order!) — for $\\R^m$, row-reduce $[\\,\\Cc\\,|\\,T(v_1)\\cdots T(v_n)]$ once.",
      "The coordinate vectors are the <b>columns</b> of $[T]^{\\Cc}_{\\B}$ (size $\\dim W\\times\\dim V$).",
      "To use it: $[v]_{\\B}$ → multiply → $[T(v)]_{\\Cc}$ → convert back to a vector/polynomial." ],
      ex: H`Example 3.4.4(iii): $[F]^{\B_2}_{\B_1} = \begin{pmatrix}-5&1&-4\\4&-4&2\\0&0&-4\end{pmatrix}$, $F(3-2x-x^2) = 4x^2+6x-14$.`, trap: "Rows instead of columns; coordinates in the wrong basis; ignoring basis order.", lab: ["Matrix of T lab", "#/labs/matrix"] },
    { ch: 3, id: "r-dimL", t: "Dimension of ℒ(V,W); isomorphic spaces", when: "“Find dim ℒ(ℙ₂, ℝ³).” / “Show V ≅ W.”", steps: [
      "$\\dim\\Lin(V,W) = \\dim V\\cdot\\dim W$; recall $\\dim\\P_n = n+1$, $\\dim\\R^{m\\times n} = mn$.",
      "Spaces of equal finite dimension are isomorphic; exhibit the coordinate map as the isomorphism." ],
      ex: H`$\dim\Lin(\P_2,\R^{2\times2}) = 3\cdot4 = 12$.`, trap: "Using dim ℙₙ = n.", lab: null },
    { ch: 4, id: "r-ip", t: "Prove a formula is an inner product", when: "“Show that ⟨·,·⟩ defines an inner product on V.”", steps: [
      "Non-negativity: $\\langle u,u\\rangle$ is a sum of squares with positive weights / integral of a square.",
      "Coincidence: show $\\langle u,u\\rangle = 0$ forces $u = 0$ (each square is 0; for integrals use continuity + infinitely many roots; for evaluation terms count roots).",
      "Symmetry: swap the factors.",
      "Linearity: expand $\\langle au+bv,w\\rangle$ using linearity of sums/integrals/derivatives/evaluation." ],
      ex: H`$2u_1v_1+3u_2v_2$ on $\R^2$ ✔; $\int_{-1}^1p'q'$ on $\P_2$ ✘ (constants).`, trap: "Skipping the ⇒ direction of coincidence — it's where most proofs fail.", lab: ["Inner Product Lab", "#/labs/inner"] },
    { ch: 4, id: "r-notip", t: "Show a formula is NOT an inner product", when: "Negative weights, missing terms, derivatives only, too few evaluation points.", steps: [
      "Guess which axiom fails (usually non-negativity or coincidence).",
      "Produce one explicit vector $u$ with $\\langle u,u\\rangle\\lt0$, or $u\\ne0$ with $\\langle u,u\\rangle = 0$.",
      "State the axiom that fails." ],
      ex: H`$p(0)q(0)+p(1)q(1)$ on $\P_2$: $p = x^2-x\neq0$ has $\langle p,p\rangle = 0$.`, trap: "Claiming failure without an explicit vector.", lab: ["Inner Product Lab", "#/labs/inner"] },
    { ch: 4, id: "r-norm", t: "Norm, unit vector, distance, angle", when: "“Find ‖f‖, the unit vector in the direction of …, the angle between …”", steps: [
      "Compute $\\langle u,u\\rangle$ with the given inner product (integrals: expand then integrate).",
      "$\\lVert u\\rVert = \\sqrt{\\langle u,u\\rangle}$; $\\hat u = u/\\lVert u\\rVert$.",
      "Distance $= \\lVert u-v\\rVert$; angle: $\\cos\\theta = \\frac{\\langle u,v\\rangle}{\\lVert u\\rVert\\lVert v\\rVert}$, $\\theta\\in[0,\\pi]$." ],
      ex: H`$\lVert1-2x\rVert = \frac1{\sqrt3}$ under $\int_0^1$, so $\hat f = \sqrt3(1-2x)$.`, trap: "Using the dot product when a different inner product is given.", lab: ["Inner Product Lab", "#/labs/inner"] },
    { ch: 4, id: "r-perp", t: "Find the orthogonal complement S⊥", when: "“Find S⊥.”", steps: [
      "General vector $u$ (e.g. $(x,y,z)$ or $a+bx$).",
      "Equations $\\langle u,s\\rangle = 0$ for each vector $s$ in (a spanning set of) $S$.",
      "Solve the homogeneous system; write $S^\\perp = \\spn\\{\\ldots\\}$.",
      "Check each answer vector against each $s$." ],
      ex: H`$S = \{(0,1,1),(3,2,1)\}$: $S^\perp = \spn\{(1,-3,3)\}$.`, trap: "Forgetting that S⊥ is a set of vectors (give a span, not one vector without ‘span’).", lab: ["Practice Arena", "#/practice"] },
    { ch: 4, id: "r-perpprop", t: "Prove a property of S⊥", when: "“Show that W⊥ is a subspace / S ⊆ S⊥⊥ / S ∩ S⊥ = {0} / …”", steps: [
      "Write down the definition of membership: $u\\in S^\\perp\\iff\\langle u,s\\rangle = 0$ for all $s\\in S$.",
      "Subspace: $0\\in W^\\perp$ and linearity gives closure.",
      "Containments: take an arbitrary element, use symmetry/definitions.",
      "Anything forced to be orthogonal to itself is $0$ (coincidence)." ],
      ex: H`See the full proofs of Prop 4.2.5 in §4.2.`, trap: "Proving only one inclusion of an equality.", lab: ["Proof Studio", "#/proofs"] },
    { ch: 4, id: "r-onset", t: "Check orthogonal / orthonormal; coordinates", when: "“Show S is orthonormal” / “Express v in the orthonormal basis …”", steps: [
      "Compute every pairwise inner product ($i\\neq j$) — all must be 0.",
      "Compute each norm — all must be 1 for orthonormal.",
      "Coordinates in an orthonormal basis: $c_i = \\langle v,w_i\\rangle$ (no system to solve)." ],
      ex: H`$\{\frac1{\sqrt2}(1,1),\frac1{\sqrt2}(1,-1)\}$ is orthonormal.`, trap: "Concluding orthonormal from orthogonal alone.", lab: null },
    { ch: 4, id: "r-gs", t: "Gram–Schmidt (any inner product)", when: "“Use the Gram–Schmidt process to find an orthonormal basis for span(S).”", steps: [
      "$u_1 = v_1$.",
      "$u_k = v_k-\\sum_{j\\lt k}\\frac{\\langle v_k,u_j\\rangle}{\\langle u_j,u_j\\rangle}u_j$ — with the GIVEN inner product.",
      "After each step check $\\langle u_k,u_j\\rangle = 0$. Optionally rescale $u_k$ to clear fractions.",
      "Normalise: $w_k = u_k/\\lVert u_k\\rVert$; present $\\{w_1,\\dots,w_n\\}$." ],
      ex: H`$\{(1,0,0),(1,1,2),(0,1,1)\}\to\{(1,0,0),\frac1{\sqrt5}(0,1,2),\frac1{\sqrt5}(0,2,-1)\}$.`, trap: "Projecting onto the original v’s; forgetting to normalise.", lab: ["Gram–Schmidt Machine", "#/labs/gram-schmidt"] },
    { ch: 4, id: "r-ineq", t: "Use Cauchy–Schwarz / triangle / Pythagoras", when: "“Prove the inequality …” / “Show ‖u+v‖² = …”", steps: [
      "Identify the inner product space and choose $u,v$ cleverly (often one is $(1,1,\\dots,1)$ or the constant function 1).",
      "Apply the inequality and simplify; square if needed.",
      "For equality cases use the dependence condition." ],
      ex: H`$u = (a,b,c)$, $v = (1,1,1)$ ⇒ $(a+b+c)^2\le3(a^2+b^2+c^2)$.`, trap: "Forgetting absolute values in Cauchy–Schwarz.", lab: null },
    { ch: 2, id: "r-subspace", t: "Subspace test", when: "“Show W is a subspace of V.”", steps: ["Show $0\\in W$.", "Take $u,v\\in W$, scalars $a,b$; show $au+bv\\in W$ by checking the defining condition.", "Conclude by Theorem 2.2.3."], ex: H`$\{f: f(0) = f(1) = 0\}$ is a subspace of $C[0,1]$.`, trap: "Checking the condition only for specific vectors.", lab: null },
    { ch: 2, id: "r-li", t: "Independence / span / basis", when: "“Is S a basis of V?”", steps: ["Independence: $\\sum a_iu_i = 0$ ⇒ solve ⇒ all $a_i = 0$?", "Span: can every vector be written as a combination?", "Count: $n$ vectors in $n$-dim space ⇒ check one property (e.g. $\\det\\ne0$)."], ex: H`$\{(1,1),(2,3)\}$ is a basis of $\R^2$.`, trap: "More vectors than the dimension are always dependent.", lab: null },
    { ch: 5, id: "r-rref", t: "Row reduction, rank, null space", when: "“Find the rank / a basis of the null space / solve Ax = b.”", steps: ["Row-reduce, writing each operation.", "Rank = number of pivots; nullity = columns − rank.", "Null space: parametrise free variables."], ex: H`See Exercise 5.`, trap: "Arithmetic slips — check by substituting a basis vector back.", lab: ["Row Reduction Stepper", "#/labs/rref"] },
    { ch: 6, id: "r-det", t: "Determinant efficiently", when: "“Compute det A.”", steps: ["Use $R_i\\to R_i+cR_j$ (free) to create zeros.", "Expand along the row/column with most zeros.", "Track swaps (×−1) and scalings (×c)."], ex: H`Exercise 6(c): expand along row 2 → 216.`, trap: "det(cA) = cⁿ det A.", lab: ["Determinant Lab", "#/labs/det"] },
    { ch: 7, id: "r-eig", t: "Eigenvalues, eigenvectors, diagonalization", when: "“Find eigenvalues/eigenspaces; find P with P⁻¹AP diagonal.”", steps: ["Solve $\\det(A-\\lambda I) = 0$.", "For each $\\lambda$: $\\Null(A-\\lambda I)$.", "Diagonalizable iff geometric = algebraic multiplicities; P = eigenvectors as columns."], ex: H`7.1.5(i): $\lambda = 2,-3$, $P = \begin{pmatrix}2&1\\1&-2\end{pmatrix}$.`, trap: "‘Repeated eigenvalue ⇒ not diagonalizable’ is false in general.", lab: ["Eigen Lab", "#/labs/eigen"] },
  ];

  LA.RECIPES = R;
  R.forEach((r) => LA.searchExtra.push({ t: "Recipe · " + r.t, m: r.when, href: "#/recipes?go=" + r.id, k: "recipe" }));

  LA.page("/recipes", {
    title: "Question Recipes", searchTitle: "Question Recipes", searchDesc: "Step-by-step algorithms for every question type",
    render() {
      const card = (r) => '<div class="box recipe" id="' + r.id + '" data-tag="Chapter ' + r.ch + ' recipe" data-t="' + LA.esc(r.t) + '"><p class="small muted" style="margin:.2em 0 .4em">When you see: <i>' + r.when + "</i></p><ol class=\"recipe-steps\">" + r.steps.map((s) => "<li>" + s + "</li>").join("") + '</ol><div class="grid grid-2"><div><div class="kicker">Mini-example</div><div>' + r.ex + '</div></div><div><div class="kicker" style="color:var(--red)">Trap</div><div class="small">' + r.trap + "</div></div></div>" + (r.lab ? '<div class="row" style="margin-top:8px"><a class="chip violet" href="' + r.lab[1] + '">🔬 ' + r.lab[0] + "</a></div>" : "") + "</div>";
      const grp = (title, f) => LA.sectionTitle(title) + R.filter(f).map(card).join("");
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Coursework weapon</div><h1>Question Recipes</h1><p class="lead">Every question type you can meet, reduced to a short, reliable algorithm — plus a mini-example and the trap that costs marks. Learn the recipe, then drill it in the <a href="#/practice">Practice Arena</a>.</p>' +
        '<div class="row">' + R.filter((r) => r.ch === 3 || r.ch === 4).map((r) => '<a class="chip ' + (r.ch === 3 ? "violet" : "cyan") + '" href="#/recipes?go=' + r.id + '">' + r.t + "</a>").join("") + "</div></div></div>" +
        grp("Chapter 3 · Linear transformations", (r) => r.ch === 3) + grp("Chapter 4 · Inner products & orthogonality", (r) => r.ch === 4) + grp("Supporting skills (Chapters 2, 5, 6, 7)", (r) => r.ch !== 3 && r.ch !== 4) + "</div>";
    },
  });
})();
