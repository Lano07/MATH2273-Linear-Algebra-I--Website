/* Written exam-question bank with component-tagged marking schemes.
   Components: M = method, A = accuracy, J = justification, P = proof structure, N = notation, C = completeness, F = final answer.
   Every numerical answer verified with SymPy. The three existing mock tests are converted into bank items too. */
(function () {
  "use strict";
  const LA = window.LA;
  const H = String.raw;
  LA.COMPONENTS = { M: "Method", A: "Accuracy", J: "Justification", P: "Proof structure", N: "Notation", C: "Completeness", F: "Final answer" };
  const Q = [];
  const q = (id, ch, topics, kind, diff, title, parts) => Q.push({ id, ch, topics, kind, diff, title, parts, marks: parts.reduce((s, p) => s + p.m, 0) });
  const p = (l, m, qq, s, a) => ({ l, m, q: qq, s, a });

  /* ---------------- Chapter 1 ---------------- */
  q("w-rel", 1, ["relations"], "proof", "standard", "An equivalence relation on ℤ", [
    p("(a)", 7, H`Define $R$ on $\Z$ by $aRb\iff 5\mid(2a+3b)$. Prove that $R$ is an equivalence relation.`, [[1, "P", "States the three properties to be checked"], [1, "J", "Reflexive: $2a+3a = 5a$"], [2, "J", "Symmetric: $2b+3a = 5(a+b)-(2a+3b)$ is a multiple of 5"], [2, "J", "Transitive: adds $2a+3b = 5k$ and $2b+3c = 5l$ to get $2a+3c = 5(k+l-b)$"], [1, "P", "Concludes $R$ is an equivalence relation"]],
      H`<p>Reflexive: $2a+3a = 5a$. Symmetric: if $2a+3b = 5k$ then $2b+3a = 5(a+b)-5k$. Transitive: if $2a+3b = 5k$ and $2b+3c = 5l$, adding gives $2a+5b+3c = 5(k+l)$, so $2a+3c = 5(k+l-b)$. Hence $R$ is an equivalence relation.</p>`),
    p("(b)", 3, H`Describe $[0]$ and find the number of equivalence classes.`, [[1, "M", "Shows $aRb\\iff a\\equiv b\\pmod 5$ (or tests elements)"], [1, "F", "$[0] = 5\\Z$"], [1, "F", "Exactly 5 classes"]],
      H`<p>$2a+3b\equiv2a-2b\pmod5$, and $2$ is invertible mod $5$, so $aRb\iff a\equiv b\pmod 5$. Thus $[0] = \{5n: n\in\Z\}$ and there are $5$ classes.</p>`)]);
  q("w-fn", 1, ["functions"], "written", "standard", "Bijections and compositions", [
    p("(a)", 4, H`$f:\R\to\R$, $f(x) = 3x-7$. Show $f$ is a bijection and find $f^{-1}$.`, [[1, "J", "Injective: $3x_1-7 = 3x_2-7\\Rightarrow x_1 = x_2$"], [1, "J", "Surjective: $x = \\frac{y+7}{3}$"], [2, "F", "$f^{-1}(y) = \\frac{y+7}{3}$"]], H`<p>Injective and surjective as shown; $f^{-1}(y) = \frac{y+7}{3}$.</p>`),
    p("(b)", 4, H`With $g(x) = x^2$, is $g\circ f$ injective? Surjective? Justify.`, [[1, "M", "$(g\\circ f)(x) = (3x-7)^2$"], [2, "J", "Not injective: e.g. $x = 2$ and $x = \\frac83$ both give $1$"], [1, "J", "Not surjective: $-1$ is never attained"]], H`<p>$(g\circ f)(x) = (3x-7)^2$. $x = 2$ and $x = \tfrac83$ both give $1$ (not injective); outputs are $\ge0$ (not surjective).</p>`),
    p("(c)", 2, H`Prove: if $g\circ f$ is injective then $f$ is injective.`, [[1, "P", "Starts from $f(x_1) = f(x_2)$ and applies $g$"], [1, "J", "Uses injectivity of $g\\circ f$"]], H`<p>$f(x_1) = f(x_2)\Rightarrow g(f(x_1)) = g(f(x_2))\Rightarrow x_1 = x_2$.</p>`)]);
  q("w-sets", 1, ["sets"], "proof", "standard", "A set identity", [
    p("(a)", 6, H`Prove $A\setminus(B\cup C) = (A\setminus B)\cap(A\setminus C)$.`, [[1, "P", "Double inclusion set up"], [2, "J", "(⊆) $x\\in A$, $x\\notin B\\cup C$ ⇒ $x\\notin B$ and $x\\notin C$"], [2, "J", "(⊇) converse direction"], [1, "P", "Conclusion"]], H`<p>($\subseteq$) If $x\in A$ and $x\notin B\cup C$ then $x\notin B$ and $x\notin C$, so $x\in(A\setminus B)\cap(A\setminus C)$. ($\supseteq$) If $x\in A$, $x\notin B$, $x\notin C$ then $x\notin B\cup C$. Hence equal.</p>`),
    p("(b)", 2, H`Show by example that $A\setminus(B\cap C)\neq(A\setminus B)\cap(A\setminus C)$ in general.`, [[2, "F", "Valid counterexample, e.g. $A = \\{1,2\\}$, $B = \\{1\\}$, $C = \\{2\\}$"]], H`<p>$A = \{1,2\}$, $B = \{1\}$, $C = \{2\}$: left side $\{1,2\}$, right side $\emptyset$.</p>`)]);

  /* ---------------- Chapter 2 ---------------- */
  q("w-sub", 2, ["subspaces", "basis-dimension"], "written", "standard", "A plane through the origin", [
    p("(a)", 5, H`Prove that $W = \{(x,y,z)\in\R^3: x-2y+z = 0\}$ is a subspace of $\R^3$.`, [[1, "J", "$0\\in W$"], [1, "P", "Takes general $u,v\\in W$ and scalars"], [2, "J", "Shows $\\alpha u+\\beta v$ satisfies the equation"], [1, "P", "Conclusion via the subspace test"]], H`<p>$0-0+0 = 0$. If $u,v\in W$ then $(\alpha u_1+\beta v_1)-2(\alpha u_2+\beta v_2)+(\alpha u_3+\beta v_3) = \alpha\cdot0+\beta\cdot0 = 0$. So $W$ is a subspace.</p>`),
    p("(b)", 3, H`Find a basis for $W$ and $\dim W$.`, [[1, "M", "Solves $x = 2y-z$"], [1, "F", "Basis $(2,1,0),(-1,0,1)$ (or equivalent)"], [1, "F", "$\\dim W = 2$"]], H`<p>$(x,y,z) = y(2,1,0)+z(-1,0,1)$: basis $\{(2,1,0),(-1,0,1)\}$, $\dim W = 2$.</p>`),
    p("(c)", 2, H`Is $U = \{(x,y,z): x-2y+z = 1\}$ a subspace? Justify.`, [[2, "J", "No: $0\\notin U$"]], H`<p>No — $(0,0,0)\notin U$.</p>`)]);
  q("w-indep", 2, ["independence", "basis-dimension"], "written", "standard", "Polynomials: independence and extension", [
    p("(a)", 4, H`In $\P_2$ let $p_1 = 1+x$, $p_2 = x+x^2$, $p_3 = 1+2x+x^2$. Are they linearly independent?`, [[2, "M", "Sets up $a p_1+bp_2+cp_3 = 0$ or a coefficient matrix"], [2, "F", "Dependent: $p_3 = p_1+p_2$"]], H`<p>$p_3 = p_1+p_2$, so they are dependent.</p>`),
    p("(b)", 4, H`Find $\dim\spn\{p_1,p_2,p_3\}$ and a basis.`, [[2, "J", "$p_1,p_2$ independent (not multiples)"], [2, "F", "Basis $\\{p_1,p_2\\}$, dimension 2"]], H`<p>$\{1+x,\,x+x^2\}$ is independent and spans the same space: dimension $2$.</p>`),
    p("(c)", 4, H`Extend your basis to a basis of $\P_2$.`, [[2, "M", "Adds a suitable polynomial (e.g. $1$)"], [2, "J", "Checks independence (determinant $\\neq0$) and uses $\\dim\\P_2 = 3$"]], H`<p>Add $1$: coefficient matrix $\begin{pmatrix}1&1&0\\0&1&1\\1&0&0\end{pmatrix}$ has determinant $1\neq0$; three independent vectors in the 3-dimensional $\P_2$ form a basis.</p>`)]);
  q("w-sums", 2, ["sums"], "written", "advanced", "Sum and intersection in ℝ⁴", [
    p("(a)", 4, H`$U = \spn\{(1,0,1,0),(0,1,0,1)\}$, $W = \spn\{(1,1,1,1),(1,0,0,0)\}$. Find $\dim(U+W)$.`, [[2, "M", "Row-reduces the four spanning vectors"], [1, "J", "Notes $(1,1,1,1)\\in U$"], [1, "F", "$\\dim(U+W) = 3$"]], H`<p>$(1,1,1,1) = (1,0,1,0)+(0,1,0,1)$ and $(1,0,0,0)\notin U$, so $\dim(U+W) = 3$.</p>`),
    p("(b)", 4, H`Find $\dim(U\cap W)$ and a basis for $U\cap W$.`, [[1, "M", "Uses $\\dim(U+W) = \\dim U+\\dim W-\\dim(U\\cap W)$"], [1, "F", "$\\dim = 1$"], [2, "F", "Basis $\\{(1,1,1,1)\\}$"]], H`<p>$\dim(U\cap W) = 2+2-3 = 1$, and $(1,1,1,1)$ lies in both: basis $\{(1,1,1,1)\}$.</p>`)]);
  q("w-cap", 2, ["subspaces"], "proof", "standard", "Intersections and unions of subspaces", [
    p("(a)", 5, H`Prove that if $U,W$ are subspaces of $V$ then $U\cap W$ is a subspace.`, [[1, "J", "$0\\in U\\cap W$"], [1, "P", "General elements"], [2, "J", "Closure inside $U$ and inside $W$"], [1, "P", "Conclusion"]], H`<p>$0$ is in both. For $x,y\in U\cap W$, $\alpha x+\beta y\in U$ and $\in W$ since both are subspaces. Hence a subspace.</p>`),
    p("(b)", 3, H`Show that the union of the $x$-axis and the $y$-axis in $\R^2$ is not a subspace.`, [[3, "J", "$(1,0)+(0,1) = (1,1)$ is in neither axis"]], H`<p>$(1,0)+(0,1) = (1,1)$ is not in the union.</p>`)]);

  /* ---------------- Chapter 3 ---------------- */
  q("w-lin", 3, ["linear-maps", "kernel-range"], "written", "standard", "A map ℝ³ → ℝ²", [
    p("(a)", 4, H`Prove that $T(x,y,z) = (x+y-z,\ 2x-y+z)$ is linear.`, [[1, "P", "General vectors and scalars"], [2, "M", "Expands $T(\\alpha u+\\beta v)$ componentwise"], [1, "J", "Regroups into $\\alpha T(u)+\\beta T(v)$"]], H`<p>Each component is a linear expression, so $T(\alpha u+\beta v) = \alpha T(u)+\beta T(v)$ after regrouping.</p>`),
    p("(b)", 4, H`Find a basis for $\ker T$.`, [[2, "M", "Solves the homogeneous system"], [2, "F", "$\\ker T = \\spn\\{(0,1,1)\\}$"]], H`<p>Adding the equations: $3x = 0$, so $x = 0$, $y = z$: $\ker T = \spn\{(0,1,1)\}$.</p>`),
    p("(c)", 3, H`Find $\Rank T$ and decide whether $T$ is onto.`, [[1, "M", "Rank–Nullity"], [1, "F", "$\\Rank T = 2$"], [1, "J", "Onto since $\\Rank T = \\dim\\R^2$"]], H`<p>$\Rank T = 3-1 = 2 = \dim\R^2$: onto.</p>`),
    p("(d)", 2, H`Is $T$ one-to-one?`, [[2, "J", "No: $\\ker T\\neq\\{0\\}$"]], H`<p>No, the kernel is non-trivial.</p>`),
    p("(e)", 2, H`Write down the standard matrix of $T$.`, [[2, "F", "$\\begin{pmatrix}1&1&-1\\\\2&-1&1\\end{pmatrix}$"]], H`<p>$\begin{pmatrix}1&1&-1\\2&-1&1\end{pmatrix}$.</p>`)]);
  q("w-pmat", 3, ["matrix-of-map", "isomorphisms"], "written", "standard", "An operator on ℙ₂", [
    p("(a)", 3, H`Show that $T:\P_2\to\P_2$, $T(p) = p+xp'$ is linear.`, [[3, "J", "Uses linearity of differentiation and multiplication by $x$"]], H`<p>$T(\alpha p+\beta q) = \alpha p+\beta q+x(\alpha p'+\beta q') = \alpha T(p)+\beta T(q)$.</p>`),
    p("(b)", 3, H`Find $[T]$ relative to $\{1,x,x^2\}$.`, [[2, "M", "Computes $T(1) = 1$, $T(x) = 2x$, $T(x^2) = 3x^2$"], [1, "F", "$\\diag(1,2,3)$"]], H`<p>$[T] = \diag(1,2,3)$.</p>`),
    p("(c)", 3, H`Show $T$ is an isomorphism.`, [[2, "J", "$\\det[T] = 6\\neq0$ (or $\\ker T = \\{0\\}$)"], [1, "J", "Equal dimensions ⇒ bijective"]], H`<p>$\det = 6\neq0$, so $T$ is invertible.</p>`),
    p("(d)", 3, H`Find $T^{-1}(1+x+x^2)$.`, [[2, "M", "Inverts the diagonal matrix"], [1, "F", "$1+\\frac x2+\\frac{x^2}3$"]], H`<p>$T^{-1}(1+x+x^2) = 1+\tfrac12x+\tfrac13x^2$ (check: $T$ of this is $1+x+x^2$).</p>`)]);
  q("w-iso", 3, ["isomorphisms"], "written", "standard", "An invertible map of the plane", [
    p("(a)", 3, H`Show that $T(x,y) = (2x+y,\ x+y)$ is injective using its kernel.`, [[2, "M", "Solves $2x+y = 0$, $x+y = 0$"], [1, "J", "Only the zero solution ⇒ injective"]], H`<p>Subtracting: $x = 0$, then $y = 0$. $\ker T = \{0\}$.</p>`),
    p("(b)", 3, H`Deduce that $T$ is an isomorphism.`, [[3, "J", "Rank–Nullity: rank 2 = dim ℝ², so surjective"]], H`<p>$\Rank T = 2-0 = 2$: surjective, hence bijective.</p>`),
    p("(c)", 4, H`Find $T^{-1}(x,y)$.`, [[2, "M", "Inverts $\\begin{pmatrix}2&1\\\\1&1\\end{pmatrix}$"], [2, "F", "$T^{-1}(x,y) = (x-y,\\ -x+2y)$"]], H`<p>$T^{-1}(x,y) = (x-y,\,-x+2y)$.</p>`)]);
  q("w-cob", 3, ["change-of-basis", "diagonalization"], "written", "advanced", "A diagonalizing basis", [
    p("(a)", 5, H`$T(x) = Ax$ with $A = \begin{pmatrix}3&1\\1&3\end{pmatrix}$ and $\B = \{(1,1),(1,-1)\}$. Find $[T]_{\B}$.`, [[2, "M", "Uses $P^{-1}AP$ or computes $T(b_j)$ in $\\B$-coordinates"], [3, "F", "$[T]_{\\B} = \\diag(4,2)$"]], H`<p>$T(1,1) = 4(1,1)$, $T(1,-1) = 2(1,-1)$: $[T]_{\B} = \diag(4,2)$.</p>`),
    p("(b)", 2, H`Interpret your answer geometrically.`, [[2, "J", "Stretches by 4 along $(1,1)$ and by 2 along $(1,-1)$"]], H`<p>$T$ stretches by $4$ along $y = x$ and by $2$ along $y = -x$.</p>`),
    p("(c)", 3, H`Hence compute $T^5(1,0)$.`, [[1, "M", "Writes $(1,0) = \\frac12(1,1)+\\frac12(1,-1)$"], [2, "F", "$(528,496)$"]], H`<p>$T^5(1,0) = \tfrac12\cdot4^5(1,1)+\tfrac12\cdot2^5(1,-1) = (528,496)$.</p>`)]);

  /* ---------------- Chapter 4 ---------------- */
  q("w-ip", 4, ["inner-products", "norms-angles"], "written", "standard", "A non-standard inner product", [
    p("(a)", 6, H`Prove that $\langle u,v\rangle = 2u_1v_1+u_1v_2+u_2v_1+u_2v_2$ is an inner product on $\R^2$.`, [[1, "J", "Symmetry"], [1, "J", "Linearity in the first argument"], [2, "M", "Writes $\\langle u,u\\rangle = u_1^2+(u_1+u_2)^2$ (or uses a PD matrix)"], [1, "J", "Positivity"], [1, "J", "Coincidence: $=0\\Rightarrow u = 0$"]], H`<p>Symmetric and bilinear by inspection. $\langle u,u\rangle = 2u_1^2+2u_1u_2+u_2^2 = u_1^2+(u_1+u_2)^2\ge0$, with equality iff $u_1 = 0$ and $u_1+u_2 = 0$, i.e. $u = 0$.</p>`),
    p("(b)", 2, H`Find $\lVert(1,-1)\rVert$.`, [[2, "F", "$1$"]], H`<p>$2-1-1+1 = 1$, so the norm is $1$.</p>`),
    p("(c)", 4, H`Find a unit vector orthogonal to $(1,0)$.`, [[2, "M", "$\\langle(1,0),(a,b)\\rangle = 2a+b = 0$"], [2, "F", "$\\frac1{\\sqrt2}(1,-2)$ (or its negative)"]], H`<p>$(1,-2)$ works and $\lVert(1,-2)\rVert^2 = 2$, so $\tfrac{1}{\sqrt2}(1,-2)$.</p>`)]);
  q("w-gs", 4, ["gram-schmidt", "projections"], "written", "standard", "Gram–Schmidt and a projection", [
    p("(a)", 8, H`Apply Gram–Schmidt to $v_1 = (1,1,0)$, $v_2 = (1,0,1)$, $v_3 = (0,1,1)$ (dot product) to obtain an orthonormal basis of $\R^3$.`, [[1, "M", "$u_1 = v_1$"], [2, "A", "$u_2\\propto(1,-1,2)$"], [3, "A", "$u_3\\propto(-1,1,1)$"], [1, "M", "Normalises"], [1, "F", "$\\frac1{\\sqrt2}(1,1,0),\\frac1{\\sqrt6}(1,-1,2),\\frac1{\\sqrt3}(-1,1,1)$"]], H`<p>$u_1 = (1,1,0)$; $u_2 = v_2-\tfrac12u_1 = \tfrac12(1,-1,2)$; $u_3 = v_3-\tfrac12u_1-\tfrac16(1,-1,2) = \tfrac23(-1,1,1)$. Orthonormal: $\tfrac1{\sqrt2}(1,1,0)$, $\tfrac1{\sqrt6}(1,-1,2)$, $\tfrac1{\sqrt3}(-1,1,1)$.</p>`),
    p("(b)", 6, H`Find the orthogonal projection of $(1,2,3)$ onto $\spn\{v_1,v_2\}$.`, [[2, "M", "Uses the orthogonal basis $u_1,u_2$"], [2, "A", "Coefficients $\\frac32$ and $\\frac56$"], [2, "F", "$(\\frac73,\\frac23,\\frac53)$"]], H`<p>$\tfrac32(1,1,0)+\tfrac56(1,-1,2) = (\tfrac73,\tfrac23,\tfrac53)$; the residual $(-\tfrac43,\tfrac43,\tfrac43)$ is orthogonal to the plane.</p>`)]);
  q("w-perp", 4, ["orthogonality"], "proof", "standard", "Orthogonal complements", [
    p("(a)", 4, H`Prove that $S^\perp$ is a subspace for any subset $S$.`, [[1, "J", "$0\\in S^\\perp$"], [2, "J", "Closure using linearity of the inner product"], [1, "P", "Conclusion"]], H`<p>$\langle0,s\rangle = 0$; $\langle\alpha u+\beta v,s\rangle = \alpha\langle u,s\rangle+\beta\langle v,s\rangle = 0$.</p>`),
    p("(b)", 3, H`Prove $S\cap S^\perp = \{0\}$ for a subspace $S$.`, [[1, "J", "$0$ lies in both"], [2, "J", "$v\\in S\\cap S^\\perp\\Rightarrow\\langle v,v\\rangle = 0\\Rightarrow v = 0$"]], H`<p>If $v$ is in both, $\langle v,v\rangle = 0$, so $v = 0$.</p>`),
    p("(c)", 3, H`Find a basis for $S^\perp$ when $S = \spn\{(1,2,-1)\}\subseteq\R^3$.`, [[1, "M", "Solves $x+2y-z = 0$"], [2, "F", "e.g. $(2,-1,0),(1,0,1)$"]], H`<p>$S^\perp = \{x+2y-z = 0\} = \spn\{(2,-1,0),(1,0,1)\}$.</p>`)]);
  q("w-par", 4, ["norms-angles"], "proof", "standard", "Parallelogram law and Cauchy–Schwarz", [
    p("(a)", 5, H`Prove $\lVert u+v\rVert^2+\lVert u-v\rVert^2 = 2\lVert u\rVert^2+2\lVert v\rVert^2$.`, [[2, "M", "Expands both norms via the inner product"], [2, "J", "Cross terms cancel"], [1, "P", "Conclusion"]], H`<p>$\lVert u\pm v\rVert^2 = \lVert u\rVert^2\pm2\langle u,v\rangle+\lVert v\rVert^2$; add.</p>`),
    p("(b)", 3, H`Verify Cauchy–Schwarz for $u = (1,2,2)$, $v = (3,0,4)$.`, [[1, "A", "$u\\cdot v = 11$"], [1, "A", "$\\lVert u\\rVert = 3$, $\\lVert v\\rVert = 5$"], [1, "F", "$11\\le15$"]], H`<p>$|11|\le3\cdot5 = 15$.</p>`)]);

  /* ---------------- Chapter 5 ---------------- */
  q("w-sys", 5, ["systems-rref"], "written", "standard", "A system with two parameters", [
    p("(a)", 8, H`For the system $x+2y+z = 4$, $2x+5y+3z = 9$, $x+3y+kz = m$, find all $k,m$ for which there is (i) a unique solution, (ii) no solution, (iii) infinitely many solutions.`, [[3, "M", "Reduces to $(0\\;0\\;k-2\\,|\\,m-5)$"], [2, "F", "Unique iff $k\\neq2$"], [1, "F", "None iff $k = 2$, $m\\neq5$"], [2, "F", "Infinitely many iff $k = 2$, $m = 5$"]], H`<p>Row reduction gives last row $(0\;0\;k-2\,|\,m-5)$. Unique: $k\neq2$. None: $k = 2$, $m\neq5$. Infinitely many: $k = 2$, $m = 5$.</p>`),
    p("(b)", 4, H`Solve the system when $k = 3$, $m = 5$.`, [[2, "M", "Back-substitution"], [2, "F", "$(x,y,z) = (2,1,0)$"]], H`<p>$z = 0$, $y = 1$, $x = 2$.</p>`)]);
  q("w-rank", 5, ["rank-spaces"], "written", "standard", "Rank and the fundamental subspaces", [
    p("(a)", 4, H`Find the RREF of $A = \begin{pmatrix}1&2&0&1\\2&4&1&4\\3&6&1&5\end{pmatrix}$.`, [[2, "M", "Correct row operations"], [2, "F", "$\\begin{pmatrix}1&2&0&1\\\\0&0&1&2\\\\0&0&0&0\\end{pmatrix}$"]], H`<p>$\begin{pmatrix}1&2&0&1\\0&0&1&2\\0&0&0&0\end{pmatrix}$.</p>`),
    p("(b)", 2, H`State $\Rank A$ and $\Nullity A$.`, [[1, "F", "Rank 2"], [1, "F", "Nullity 2"]], H`<p>Rank $2$, nullity $2$.</p>`),
    p("(c)", 6, H`Find bases for $\RS(A)$, $\CS(A)$ and $\Null(A)$.`, [[2, "F", "$\\RS$: $(1,2,0,1),(0,0,1,2)$"], [2, "F", "$\\CS$: columns 1 and 3 of $A$"], [2, "F", "$\\Null$: $(-2,1,0,0),(-1,0,-2,1)$"]], H`<p>$\RS$: non-zero RREF rows. $\CS$: $(1,2,3)^T,(0,1,1)^T$ (pivot columns of $A$). $\Null$: $(-2,1,0,0),(-1,0,-2,1)$.</p>`)]);
  q("w-equiv", 5, ["equivalence"], "written", "standard", "Equivalent matrices", [
    p("(a)", 2, H`Define what it means for two $m\times n$ matrices to be equivalent.`, [[2, "N", "$B = PAQ$ with $P,Q$ invertible (or: related by row and column operations)"]], H`<p>$B = PAQ$ for invertible $P$ ($m\times m$) and $Q$ ($n\times n$).</p>`),
    p("(b)", 3, H`Find the normal form of $A = \begin{pmatrix}1&-1&2\\2&-2&4\\0&1&1\end{pmatrix}$.`, [[2, "M", "Finds rank 2"], [1, "F", "$N_2 = \\diag(1,1,0)$"]], H`<p>Row 2 is twice row 1, so rank $2$ and $A\sim N_2 = \diag(1,1,0)$.</p>`),
    p("(c)", 3, H`Is $A$ equivalent to $I_3$?`, [[3, "J", "No: equivalent matrices have equal rank, $2\\neq3$"]], H`<p>No — rank is an invariant.</p>`)]);

  /* ---------------- Chapter 6 ---------------- */
  q("w-perm", 6, ["permutations-det", "det-properties"], "written", "standard", "Permutations and determinants", [
    p("(a)", 3, H`Find $\sign\sigma$ for $\sigma = (1\,3\,4)(2\,5)\in S_5$.`, [[2, "M", "3-cycle = 2 transpositions, plus 1"], [1, "F", "$-1$"]], H`<p>$(-1)^{2+1} = -1$.</p>`),
    p("(b)", 4, H`Write $\det\begin{pmatrix}a&b&c\\d&e&f\\g&h&i\end{pmatrix}$ using the permutation formula.`, [[2, "N", "Six terms, one per permutation"], [2, "A", "Correct signs: $aei+bfg+cdh-ceg-bdi-afh$"]], H`<p>$aei+bfg+cdh-ceg-bdi-afh$.</p>`),
    p("(c)", 3, H`Compute $\det\begin{pmatrix}2&1&3\\1&0&1\\4&2&5\end{pmatrix}$.`, [[2, "M", "Expansion or row operations"], [1, "F", "$1$"]], H`<p>$2(0-2)-1(5-4)+3(2-0) = 1$.</p>`)]);
  q("w-detp", 6, ["det-properties"], "written", "standard", "Determinant rules", [
    p("(a)", 5, H`$A,B$ are $3\times3$ with $\det A = 2$, $\det B = -3$. Find $\det(2A)$, $\det(A^TB^{-1})$ and $\det(A^3B)$.`, [[1, "F", "$16$"], [2, "F", "$-\\frac23$"], [2, "F", "$-24$"]], H`<p>$2^3\cdot2 = 16$; $2\cdot(-\tfrac13) = -\tfrac23$; $8\cdot(-3) = -24$.</p>`),
    p("(b)", 3, H`Prove that $\det(A^{-1}) = 1/\det A$ for invertible $A$.`, [[2, "J", "$\\det A\\det A^{-1} = \\det I = 1$"], [1, "P", "Conclusion"]], H`<p>$\det(A)\det(A^{-1}) = \det(AA^{-1}) = 1$.</p>`),
    p("(c)", 2, H`Show that a $3\times3$ skew-symmetric matrix ($A^T = -A$) has determinant $0$.`, [[2, "J", "$\\det A = \\det A^T = (-1)^3\\det A$"]], H`<p>$\det A = \det(-A) = -\det A$, so $\det A = 0$.</p>`)]);
  q("w-cram", 6, ["det-properties"], "written", "beginner", "Invertibility and Cramer's rule", [
    p("(a)", 4, H`For which $t$ is $\begin{pmatrix}1&t&0\\t&1&0\\0&0&t\end{pmatrix}$ invertible?`, [[2, "M", "Expands: $t(1-t^2)$"], [2, "F", "$t\\notin\\{-1,0,1\\}$"]], H`<p>$\det = t(1-t^2)$: invertible iff $t\neq0,\pm1$.</p>`),
    p("(b)", 6, H`Use Cramer's rule to solve $2x+y = 5$, $x+3y = 10$.`, [[2, "M", "$\\det A = 5$"], [2, "A", "$\\det A_1 = 5$, $\\det A_2 = 15$"], [2, "F", "$(x,y) = (1,3)$"]], H`<p>$x = 5/5 = 1$, $y = 15/5 = 3$.</p>`)]);

  /* ---------------- Chapter 7 ---------------- */
  q("w-eig", 7, ["eigen", "diagonalization"], "written", "standard", "Diagonalize and take powers", [
    p("(a)", 4, H`Find the characteristic polynomial and eigenvalues of $A = \begin{pmatrix}4&1\\2&3\end{pmatrix}$.`, [[2, "M", "$\\lambda^2-7\\lambda+10$"], [2, "F", "$\\lambda = 5, 2$"]], H`<p>$\lambda^2-7\lambda+10 = (\lambda-5)(\lambda-2)$.</p>`),
    p("(b)", 4, H`Find an eigenvector for each eigenvalue.`, [[2, "F", "$(1,1)$ for $5$"], [2, "F", "$(-1,2)$ for $2$"]], H`<p>$\lambda = 5$: $(1,1)$; $\lambda = 2$: $(-1,2)$.</p>`),
    p("(c)", 3, H`Write $A = PDP^{-1}$.`, [[2, "N", "Columns of $P$ match the order in $D$"], [1, "F", "Correct $P$, $D$"]], H`<p>$P = \begin{pmatrix}1&-1\\1&2\end{pmatrix}$, $D = \diag(5,2)$.</p>`),
    p("(d)", 4, H`Compute $A^5$.`, [[2, "M", "$A^5 = PD^5P^{-1}$"], [2, "F", "$\\begin{pmatrix}2094&1031\\\\2062&1063\\end{pmatrix}$"]], H`<p>$A^5 = \begin{pmatrix}2094&1031\\2062&1063\end{pmatrix}$.</p>`)]);
  q("w-mult", 7, ["multiplicity", "diagonalization"], "written", "standard", "A defective matrix", [
    p("(a)", 3, H`Find the eigenvalues of $A = \begin{pmatrix}2&1&0\\0&2&0\\0&0&3\end{pmatrix}$ with algebraic multiplicities.`, [[1, "J", "Triangular ⇒ diagonal entries"], [2, "F", "$2$ (twice), $3$ (once)"]], H`<p>$2$ with multiplicity $2$, $3$ with multiplicity $1$.</p>`),
    p("(b)", 4, H`Find the geometric multiplicity of $\lambda = 2$.`, [[2, "M", "$\\Rank(A-2I) = 2$"], [2, "F", "Geometric multiplicity $1$"]], H`<p>$\Null(A-2I) = \spn\{(1,0,0)\}$: geometric multiplicity $1$.</p>`),
    p("(c)", 3, H`Is $A$ diagonalizable?`, [[3, "J", "No: geometric $1\\lt$ algebraic $2$"]], H`<p>No.</p>`),
    p("(d)", 2, H`Give a diagonalizable matrix with the same eigenvalues.`, [[2, "F", "e.g. $\\diag(2,2,3)$"]], H`<p>$\diag(2,2,3)$.</p>`)]);
  q("w-ch", 7, ["cayley-hamilton"], "written", "standard", "Cayley–Hamilton in action", [
    p("(a)", 2, H`State the Cayley–Hamilton theorem.`, [[2, "N", "Every square matrix satisfies $p_A(A) = 0$"]], H`<p>$p_A(A) = O$ where $p_A$ is the characteristic polynomial.</p>`),
    p("(b)", 3, H`Verify it for $A = \begin{pmatrix}1&2\\3&4\end{pmatrix}$.`, [[1, "A", "$p_A(\\lambda) = \\lambda^2-5\\lambda-2$"], [2, "M", "$A^2-5A-2I = O$ computed"]], H`<p>$A^2 = \begin{pmatrix}7&10\\15&22\end{pmatrix}$ and $A^2-5A-2I = O$.</p>`),
    p("(c)", 3, H`Use it to find $A^{-1}$.`, [[2, "M", "$A^{-1} = \\frac12(A-5I)$"], [1, "F", "$\\begin{pmatrix}-2&1\\\\\\frac32&-\\frac12\\end{pmatrix}$"]], H`<p>$A^{-1} = \tfrac12(A-5I) = \begin{pmatrix}-2&1\\\tfrac32&-\tfrac12\end{pmatrix}$.</p>`),
    p("(d)", 2, H`Express $A^3$ as $aA+bI$.`, [[2, "F", "$A^3 = 27A+10I$"]], H`<p>$A^3 = 5A^2+2A = 27A+10I$.</p>`)]);
  q("w-eigp", 7, ["eigen"], "proof", "standard", "Two eigenvalue proofs", [
    p("(a)", 3, H`Prove that if $Av = \lambda v$ then $A^kv = \lambda^kv$ for all $k\ge1$.`, [[1, "P", "Induction set up"], [2, "J", "Inductive step $A^{k+1}v = A(\\lambda^kv) = \\lambda^{k+1}v$"]], H`<p>Induction: $A^{k+1}v = A(A^kv) = \lambda^kAv = \lambda^{k+1}v$.</p>`),
    p("(b)", 5, H`Prove that $A$ is invertible if and only if $0$ is not an eigenvalue of $A$.`, [[2, "J", "$0$ eigenvalue ⇔ $Av = 0$ for some $v\\neq0$"], [2, "J", "⇔ $\\Null A\\neq\\{0\\}$ ⇔ $\\det A = 0$"], [1, "P", "Both directions addressed"]], H`<p>$0$ is an eigenvalue $\iff\det(A-0I) = 0\iff A$ singular.</p>`)]);

  /* ---------------- Chapter 8 ---------------- */
  q("w-qf", 8, ["quadratic-forms", "definiteness", "optimisation"], "written", "standard", "A positive definite form", [
    p("(a)", 2, H`Find the symmetric matrix of $Q = 2x^2+2y^2+2z^2+2xy+2yz+2xz$.`, [[2, "F", "$\\begin{pmatrix}2&1&1\\\\1&2&1\\\\1&1&2\\end{pmatrix}$"]], H`<p>$\begin{pmatrix}2&1&1\\1&2&1\\1&1&2\end{pmatrix}$.</p>`),
    p("(b)", 4, H`Use Sylvester's criterion to show $Q$ is positive definite.`, [[3, "A", "$\\Delta_1 = 2$, $\\Delta_2 = 3$, $\\Delta_3 = 4$"], [1, "J", "All positive ⇒ PD (A symmetric)"]], H`<p>Leading minors $2, 3, 4\gt0$.</p>`),
    p("(c)", 3, H`Find the eigenvalues of the matrix.`, [[3, "F", "$4$ (once), $1$ (twice)"]], H`<p>$4$ with eigenvector $(1,1,1)$; $1$ twice (the plane $x+y+z = 0$).</p>`),
    p("(d)", 3, H`Find the minimum of $Q$ on the unit sphere.`, [[1, "J", "Rayleigh: min = smallest eigenvalue"], [2, "F", "$1$"]], H`<p>$\lambda_{\min} = 1$.</p>`)]);
  q("w-conic", 8, ["spectral", "principal-axes"], "written", "standard", "Principal axes of a conic", [
    p("(a)", 2, H`Write $5x^2-4xy+8y^2 = 36$ as $x^TAx = 36$.`, [[2, "F", "$A = \\begin{pmatrix}5&-2\\\\-2&8\\end{pmatrix}$"]], H`<p>$A = \begin{pmatrix}5&-2\\-2&8\end{pmatrix}$.</p>`),
    p("(b)", 6, H`Orthogonally diagonalize $A$.`, [[2, "A", "Eigenvalues $4, 9$"], [2, "A", "Unit eigenvectors $\\frac1{\\sqrt5}(2,1)$, $\\frac1{\\sqrt5}(1,-2)$"], [2, "N", "$P$ orthogonal with columns in the order of $D$"]], H`<p>$P = \tfrac1{\sqrt5}\begin{pmatrix}2&1\\1&-2\end{pmatrix}$, $D = \diag(4,9)$.</p>`),
    p("(c)", 3, H`Identify the curve.`, [[2, "M", "$4X^2+9Y^2 = 36$"], [1, "F", "Ellipse $\\frac{X^2}{9}+\\frac{Y^2}{4} = 1$"]], H`<p>An ellipse.</p>`),
    p("(d)", 3, H`State the lengths and directions of its semi-axes.`, [[2, "F", "3 along $(2,1)$, 2 along $(1,-2)$"], [1, "C", "Directions given as unit vectors or lines"]], H`<p>Semi-axis $3$ along $(2,1)/\sqrt5$, $2$ along $(1,-2)/\sqrt5$.</p>`)]);
  q("w-hess", 8, ["optimisation"], "written", "standard", "A critical point", [
    p("(a)", 4, H`Find the critical point of $f(x,y) = x^2+xy+y^2-3x$.`, [[2, "M", "Solves $2x+y = 3$, $x+2y = 0$"], [2, "F", "$(2,-1)$"]], H`<p>$(2,-1)$.</p>`),
    p("(b)", 4, H`Classify it using the Hessian.`, [[2, "A", "$H = \\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$"], [2, "J", "PD ⇒ local minimum"]], H`<p>$H$ is positive definite: minimum.</p>`),
    p("(c)", 2, H`Find the minimum value.`, [[2, "F", "$-3$"]], H`<p>$f(2,-1) = -3$.</p>`)]);
  q("w-symo", 8, ["spectral"], "proof", "standard", "Symmetric matrices", [
    p("(a)", 5, H`Prove that eigenvectors of a real symmetric matrix belonging to distinct eigenvalues are orthogonal.`, [[2, "M", "$\\lambda\\langle u,v\\rangle = \\langle Au,v\\rangle = \\langle u,Av\\rangle = \\mu\\langle u,v\\rangle$"], [2, "J", "Uses $A^T = A$"], [1, "P", "Concludes using $\\lambda\\neq\\mu$"]], H`<p>$\lambda\langle u,v\rangle = \langle Au,v\rangle = \langle u,A^Tv\rangle = \langle u,Av\rangle = \mu\langle u,v\rangle$, so $(\lambda-\mu)\langle u,v\rangle = 0$.</p>`),
    p("(b)", 3, H`Verify it for $A = \begin{pmatrix}3&1\\1&3\end{pmatrix}$.`, [[2, "A", "Eigenvectors $(1,1)$, $(1,-1)$"], [1, "F", "Dot product $0$"]], H`<p>$(1,1)\cdot(1,-1) = 0$.</p>`)]);

  /* ---------------- convert the three mock tests ---------------- */
  const MT = { A1: ["linear-maps"], A2: ["kernel-range"], A3: ["matrix-of-map"], A4: ["inner-products", "gram-schmidt"], B1: ["kernel-range"], B2: ["isomorphisms"], B3: ["inner-products"], B4: ["orthogonality"], C1: ["isomorphisms"], C2: ["isomorphisms"], C3: ["change-of-basis"], C4: ["norms-angles"] };
  const comp = (t) => (/prove|show|hence|deduce|justify|conclu|since|because/i.test(t) ? "J" : /final|answer|correct|=|basis is|equals/i.test(t) ? "F" : "M");
  (LA.MOCKS || []).forEach((mk) => mk.questions.forEach((qq) => {
    const key = mk.id + qq.n;
    const parts = qq.parts.map((pp) => ({ l: pp.l, m: pp.m, q: pp.q, s: (pp.s || []).map((x) => [x[0], comp(x[1]), x[1]]), a: pp.a }));
    Q.push({ id: "mock-" + key, ch: /gram|inner|orthog|norm|cauchy/i.test(qq.title) ? 4 : 3, topics: MT[key] || ["linear-maps"], kind: /proof/i.test(mk.title) ? "proof" : "written", diff: mk.level === "Hard" ? "advanced" : "standard", title: qq.title + " (Mock " + mk.id + ")", parts, marks: parts.reduce((s, x) => s + x.m, 0), mock: mk.id });
  }));
  LA.EXAM_QUESTIONS = Q;
})();
