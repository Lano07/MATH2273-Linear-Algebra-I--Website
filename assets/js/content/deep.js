/* Deep-dive sections (one per chapter): why it matters, geometric picture, counterexample gallery,
   connections & applications, levelled practice (Foundation / Standard / Enrichment), key takeaways.
   Every numerical answer verified with SymPy. data-level: f = Foundation, s = University Standard, a = Advanced Enrichment. */
(function () {
  const H = String.raw;
  const T = "Deep dive: intuition, counterexamples, connections & levelled practice";
  const add = (id, html) => { const ch = LA.chapters[id]; ch.sections.push({ id: ch.num + ".D", title: T, html }); };
  const q = (lvl, tag, title, body, sol) => '<div class="box exam" data-level="' + lvl + '" data-tag="' + tag + '" data-t="' + title + '">' + body + '<details class="reveal sol"><summary>Full solution</summary>' + sol + "</details></div>";

  /* ------------------------------ Chapter 1 ------------------------------ */
  add("ch1", H`
<div class="box intuition" data-level="f" data-t="Why this chapter matters">
<p>Linear algebra is written in the language of sets and functions. A <b>vector space</b> is a set with operations; a <b>linear map</b> is a function; "$\ker T = \{0\}\iff T$ is injective" is a statement about functions; "similar matrices" is an equivalence relation. Every proof in Chapters 2–8 uses the moves practised here: <i>let $x\in A$…</i>, double inclusion, contrapositive.</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery: what breaks without the assumptions">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>If $g\circ f$ is injective then $g$ is injective</td><td>$f:\{1\}\to\{1,2\}$, $f(1) = 1$; $g:\{1,2\}\to\{1\}$. $g\circ f$ is injective, $g$ is not.</td><td>$g\circ f$ injective ⇒ <b>$f$</b> injective</td></tr>
<tr><td>If $g\circ f$ is surjective then $f$ is surjective</td><td>Same $f,g$: $g\circ f$ is onto $\{1\}$, $f$ misses $2$.</td><td>$g\circ f$ surjective ⇒ <b>$g$</b> surjective</td></tr>
<tr><td>$f(A_1\cap A_2) = f(A_1)\cap f(A_2)$</td><td>$f(x) = x^2$, $A_1 = \{-1\}$, $A_2 = \{1\}$</td><td>"$\subseteq$" always; "$=$" if $f$ is injective</td></tr>
<tr><td>A relation that is symmetric and transitive is reflexive</td><td>$R = \emptyset$ on $\{1\}$ (vacuously symmetric and transitive)</td><td>Reflexivity must be checked separately</td></tr>
<tr><td>The union of two equivalence relations is one</td><td>On $\{1,2,3\}$: $\{(1,2),(2,1)\}$ and $\{(2,3),(3,2)\}$ (plus the diagonal); their union has $(1,2),(2,3)$ but not $(1,3)$</td><td>The <b>intersection</b> of equivalence relations is one</td></tr>
</table></div></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Equivalence relations everywhere:</b> row-equivalence (5.1.12), similarity (3.4.8), matrix equivalence (§5.3), isomorphism of vector spaces ($\cong$). Each one partitions a set into classes, and theorems classify the classes (e.g. matrices up to equivalence are classified by rank).</li>
<li><b>Quotient spaces</b> (Linear Algebra II): the classes $v+W$ of "$u\sim v\iff u-v\in W$" form a vector space $V/W$ with $\dim V/W = \dim V-\dim W$ — Rank–Nullity in disguise.</li>
<li><b>Computing:</b> injective = lossless encoding; bijective = invertible encryption; hash functions are deliberately non-injective.</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · Cartesian products", "<p>List $A\\times B$ for $A = \\{a,b\\}$, $B = \\{0,1\\}$. How many elements does $A\\times B$ have if $|A| = m$, $|B| = n$?</p>", "<p>$\\{(a,0),(a,1),(b,0),(b,1)\\}$; in general $mn$ elements (choose the first coordinate, then the second).</p>")}
${q("f", "Foundation", "F2 · A bijection and its inverse", "<p>Show $f:\\R\\to\\R$, $f(x) = 2x+3$ is bijective and find $f^{-1}$.</p>", "<p>Injective: $2x_1+3 = 2x_2+3\\Rightarrow x_1 = x_2$. Surjective: for $y\\in\\R$, $x = \\frac{y-3}{2}$ gives $f(x) = y$. So $f^{-1}(y) = \\frac{y-3}{2}$; check $f(f^{-1}(y)) = y$.</p>")}
${q("s", "Standard", "S1 · Composition and injectivity", "<p>Prove: if $g\\circ f$ is injective then $f$ is injective.</p>", "<p>Let $f(x_1) = f(x_2)$. Applying $g$: $(g\\circ f)(x_1) = (g\\circ f)(x_2)$, and injectivity of $g\\circ f$ gives $x_1 = x_2$. $\\square$ (The gallery above shows $g$ need not be injective.)</p>")}
${q("s", "Standard", "S2 · Congruence mod 3", "<p>Show $xRy\\iff3\\mid(x-y)$ is an equivalence relation on $\\Z$ and describe its classes.</p>", "<p>Reflexive: $x-x = 3\\cdot0$. Symmetric: $x-y = 3k\\Rightarrow y-x = 3(-k)$. Transitive: $x-y = 3k$, $y-z = 3l\\Rightarrow x-z = 3(k+l)$. Classes: $[0] = \\{3k\\}$, $[1] = \\{3k+1\\}$, $[2] = \\{3k+2\\}$ — three disjoint classes covering $\\Z$.</p>")}
${q("a", "Enrichment", "A1 · Counting equivalence relations", "<p>How many equivalence relations are there on $\\{1,2,3\\}$?</p>", "<p>Equivalence relations correspond exactly to partitions (Remark 1.2.5). The partitions of $\\{1,2,3\\}$ are $\\{\\{1,2,3\\}\\}$, $\\{\\{1\\},\\{2,3\\}\\}$, $\\{\\{2\\},\\{1,3\\}\\}$, $\\{\\{3\\},\\{1,2\\}\\}$, $\\{\\{1\\},\\{2\\},\\{3\\}\\}$: <b>5</b> (the Bell number $B_3$).</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>Set equality = two inclusions; injective = "equal outputs force equal inputs"; surjective = "every target is hit".</li>
<li>One concrete counterexample disproves a "for all" claim.</li>
<li>Equivalence relations ⇔ partitions into disjoint classes.</li></ul></div>`);

  /* ------------------------------ Chapter 2 ------------------------------ */
  add("ch2", H`
<div class="box intuition" data-level="f" data-t="Why this chapter matters — and the picture">
<p>Vector spaces let one theory handle arrows in $\R^3$, polynomials, matrices, functions and solutions of differential equations at once. In $\R^3$ the only subspaces are: $\{0\}$, lines through the origin, planes through the origin, and $\R^3$ itself — every subspace must pass through $0$ and be "flat". <b>Span</b> = everything you can reach; <b>independent</b> = no wasted vectors; <b>basis</b> = a minimal complete set of directions; <b>dimension</b> = how many directions.</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>A union of subspaces is a subspace</td><td>$x$-axis $\cup$ $y$-axis in $\R^2$: $(1,0)+(0,1) = (1,1)$ is in neither</td><td>Intersections and sums $U+W$ are subspaces</td></tr>
<tr><td>Every spanning set is a basis</td><td>$\{(1,0),(0,1),(1,1)\}$ spans $\R^2$ but is dependent</td><td>A spanning set <i>contains</i> a basis (2.4.13)</td></tr>
<tr><td>Pairwise independent ⇒ independent</td><td>$(1,0),(0,1),(1,1)$: any two are independent, all three are not</td><td>Independence is a property of the whole set</td></tr>
<tr><td>Any 3 vectors in $\R^3$ form a basis</td><td>$(1,0,0),(0,1,0),(1,1,0)$ (all in the $xy$-plane)</td><td>3 <b>independent</b> vectors in $\R^3$ form a basis</td></tr>
<tr><td>$\{x\ge0\}$ is a subspace of $\R$</td><td>$-1\cdot1\notin$ it (not closed under scaling)</td><td>Subspaces are closed under all scalars, including negatives</td></tr>
</table></div></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Function spaces:</b> Fourier analysis writes a signal in the "basis" $1,\cos x,\sin x,\cos2x,\dots$ (an infinite-dimensional space).</li>
<li><b>Differential equations:</b> solutions of $y''+4y = 0$ form a 2-dimensional subspace (Exercise 2.3 Q4) — so two independent solutions give all of them.</li>
<li><b>Coding theory:</b> vector spaces over the field $\mathbb F_2 = \{0,1\}$ give error-correcting codes (QR codes, deep-space communication).</li>
<li><b>Data science:</b> a dataset's "intrinsic dimension" is the dimension of the subspace (approximately) spanned by the data.</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · In the span?", "<p>Is $(1,2,3)\\in\\spn\\{(1,0,1),(0,1,1)\\}$?</p>", "<p>$a(1,0,1)+b(0,1,1) = (a,b,a+b)$. Matching: $a = 1$, $b = 2$, and then $a+b = 3$ ✔. <b>Yes</b>: $(1,2,3) = (1,0,1)+2(0,1,1)$.</p>")}
${q("f", "Foundation", "F2 · Dimension of a plane", "<p>Find a basis and the dimension of $W = \\{(x,y,z): x+y+z = 0\\}$.</p>", "<p>$x = -y-z$, so $(x,y,z) = y(-1,1,0)+z(-1,0,1)$. Basis $\\{(-1,1,0),(-1,0,1)\\}$ (two non-parallel vectors), $\\dim W = 2$.</p>")}
${q("s", "Standard", "S1 · Symmetric matrices", "<p>Prove that the symmetric $2\\times2$ matrices form a subspace of $\\R^{2\\times2}$ and find its dimension.</p>", "<p>$O^T = O$. If $A^T = A$, $B^T = B$ then $(aA+bB)^T = aA^T+bB^T = aA+bB$. So it is a subspace (Theorem 2.2.3). Every symmetric matrix is $\\begin{pmatrix}p&q\\\\q&r\\end{pmatrix} = pE_{11}+rE_{22}+q(E_{12}+E_{21})$, and these three are independent: dimension <b>3</b>.</p>")}
${q("s", "Standard", "S2 · A basis of ℙ₂?", "<p>Is $\\{1+x,\\;x+x^2,\\;1+x^2\\}$ a basis of $\\P_2$?</p>", "<p>Coefficient vectors (constant, $x$, $x^2$): $(1,1,0)$, $(0,1,1)$, $(1,0,1)$. $\\det\\begin{pmatrix}1&0&1\\\\1&1&0\\\\0&1&1\\end{pmatrix} = 2\\neq0$, so they are independent; three independent vectors in the 3-dimensional $\\P_2$ form a basis. <b>Yes.</b></p>")}
${q("a", "Enrichment", "A1 · Sum and intersection of polynomial subspaces", "<p>In $\\P_3$ let $U = \\{p: p(1) = 0\\}$ and $W = \\{p: p(-1) = 0\\}$. Find $\\dim U$, $\\dim W$, $\\dim(U\\cap W)$ and $\\dim(U+W)$.</p>", "<p>$p\\mapsto p(1)$ is a non-zero linear map $\\P_3\\to\\R$, so by Rank–Nullity $\\dim U = 4-1 = 3$; likewise $\\dim W = 3$. $U\\cap W$ = cubics divisible by $(x-1)(x+1)$: $\\{(x^2-1)(a+bx)\\}$, dimension 2. Then $\\dim(U+W) = 3+3-2 = 4$, so $U+W = \\P_3$.</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>Subspace test: $0\in W$ and closed under combinations — check $0$ first.</li><li>Span ≠ independence; a basis needs both.</li><li>In $n$ dimensions, $n$ vectors: independent ⇔ spanning ⇔ basis (use a determinant).</li><li>$\dim(U+W) = \dim U+\dim W-\dim(U\cap W)$.</li></ul></div>`);

  /* ------------------------------ Chapter 3 ------------------------------ */
  add("ch3", H`
<div class="box intuition" data-level="f" data-t="The picture in one paragraph">
<p>A linear map keeps the origin, keeps lines straight and keeps grid lines parallel and evenly spaced. Its <b>kernel</b> is what gets flattened to $0$; its <b>range</b> is the "shadow" it casts in the codomain. Rank–Nullity says the dimensions lost plus the dimensions kept add up to the dimensions you started with.</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>$T(0) = 0$ ⇒ $T$ linear</td><td>$T(x,y) = (xy,0)$</td><td>Linear ⇒ $T(0) = 0$ (only one direction)</td></tr>
<tr><td>$T$ injective ⇒ $T$ surjective</td><td>$T:\R\to\R^2$, $T(x) = (x,0)$</td><td>True when $\dim V = \dim W$ (finite)</td></tr>
<tr><td>$\dim V\ge\dim W$ ⇒ $T$ onto</td><td>the zero map $\R^2\to\R$</td><td>$T$ onto ⇒ $\dim V\ge\dim W$</td></tr>
<tr><td>Linear maps preserve independence</td><td>the zero map</td><td>Injective linear maps do (Thm 3.3.6)</td></tr>
<tr><td>$[T]^{\Cc}_{\B}$ does not depend on the bases</td><td>$T(x,y) = (x+y,x-y)$: standard basis gives $\begin{pmatrix}1&1\\1&-1\end{pmatrix}$, Example 3.4.4(ii) gives $\diag(1,-1)$</td><td>Matrices in different bases are related by change of basis</td></tr>
</table></div></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Calculus is linear:</b> $\frac{d}{dx}$ and $\int_a^b$ are linear maps; on $\P_n$ the derivative has a nilpotent matrix ($D^{n+1} = 0$).</li>
<li><b>Computer graphics:</b> every rotation, scaling, shear and projection on screen is a matrix; composing transformations = multiplying matrices.</li>
<li><b>Neural networks:</b> each layer is a linear map followed by a non-linearity — without the non-linearity, a deep network collapses to a single matrix.</li>
<li><b>Quantum mechanics:</b> observables are linear operators; their eigenvectors are measurable states (Chapter 7).</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · A reflection", "<p>Is $T(x,y) = (y,x)$ linear? What does it do geometrically?</p>", "<p>Yes: $T(\\alpha u+\\beta v) = (\\alpha u_2+\\beta v_2,\\,\\alpha u_1+\\beta v_1) = \\alpha T(u)+\\beta T(v)$. It reflects the plane in the line $y = x$ (standard matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$).</p>")}
${q("f", "Foundation", "F2 · Standard matrix", "<p>Write the standard matrix of $T(x,y,z) = (x+z,\\;2y)$.</p>", "<p>Columns are $T(e_1) = (1,0)$, $T(e_2) = (0,2)$, $T(e_3) = (1,0)$: $\\begin{pmatrix}1&0&1\\\\0&2&0\\end{pmatrix}$.</p>")}
${q("s", "Standard", "S1 · x times the derivative", "<p>$T:\\P_2\\to\\P_2$, $T(p) = x\\,p'(x)$. Find $\\ker T$, $\\Ran T$ and $[T]$ in the basis $\\{1,x,x^2\\}$.</p>", "<p>$T(a+bx+cx^2) = bx+2cx^2$. Kernel: $b = c = 0$ ⇒ constants, $\\ker T = \\spn\\{1\\}$ (nullity 1). Range $= \\spn\\{x,x^2\\}$ (rank 2); $1+2 = 3$ ✔. $T(1) = 0$, $T(x) = x$, $T(x^2) = 2x^2$, so $[T] = \\diag(0,1,2)$ — the basis $\\{1,x,x^2\\}$ diagonalizes $T$.</p>")}
${q("s", "Standard", "S2 · T∘T = 0", "<p>Let $T\\in\\Lin(V)$ with $\\dim V = n$ and $T\\circ T = 0$. Prove $\\Ran T\\subseteq\\ker T$ and deduce $\\Rank T\\le n/2$.</p>", "<p>If $w = T(v)\\in\\Ran T$ then $T(w) = T(T(v)) = 0$, so $w\\in\\ker T$. Hence $\\Rank T\\le\\Nullity T$, and with $\\Rank T+\\Nullity T = n$: $2\\Rank T\\le n$. $\\square$</p>")}
${q("a", "Enrichment", "A1 · The derivative is nilpotent", "<p>Find the matrix $D$ of $\\frac{d}{dx}$ on $\\P_3$ in the basis $\\{1,x,x^2,x^3\\}$ and show $D^4 = 0$.</p>", "<p>$\\frac{d}{dx}x^k = kx^{k-1}$, so $D = \\begin{pmatrix}0&1&0&0\\\\0&0&2&0\\\\0&0&0&3\\\\0&0&0&0\\end{pmatrix}$ (superdiagonal $1,2,3$). Differentiating any cubic four times gives $0$, so $D^4 = 0$; its only eigenvalue is $0$ and it is not diagonalizable (geometric multiplicity 1, algebraic 4).</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>Prove linearity with general vectors; disprove with one numeric counterexample.</li><li>Kernel ⊆ domain, range ⊆ codomain; Rank + Nullity = dim(domain).</li><li>$[T]^{\Cc}_{\B}$: images of the domain basis, in codomain coordinates, as columns.</li></ul></div>`);

  /* ------------------------------ Chapter 4 ------------------------------ */
  add("ch4", H`
<div class="box intuition" data-level="f" data-t="The picture in one paragraph">
<p>An inner product turns "algebra" into "geometry": once you can measure angles, you can talk about perpendicular directions, shadows (projections) and closest points. Gram–Schmidt is just "subtract the shadows, then shrink to length 1".</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>Orthogonal ⇒ orthonormal</td><td>$\{(1,1),(1,-1)\}$ (norms $\sqrt2$)</td><td>Normalise to get orthonormal</td></tr>
<tr><td>Orthogonal sets are independent</td><td>$\{(1,0),(0,0)\}$</td><td>…if all vectors are <b>non-zero</b></td></tr>
<tr><td>$u\perp v$, $v\perp w$ ⇒ $u\perp w$</td><td>$u = w = (1,0,0)$, $v = (0,1,0)$</td><td>Orthogonality is not transitive</td></tr>
<tr><td>"Orthogonal" doesn't depend on the inner product</td><td>$(1,1)\cdot(1,-1) = 0$ but $2u_1v_1+3u_2v_2$ gives $-1$</td><td>Always use the given inner product</td></tr>
<tr><td>Triangle equality ⇔ dependent</td><td>$u = (1,0)$, $v = (-1,0)$</td><td>Equality ⇔ one is a non-negative multiple of the other</td></tr>
</table></div></div>
<div class="box thm" data-level="s" data-t="Best approximation (projection) theorem">
<p>If $\{w_1,\dots,w_k\}$ is an orthonormal basis of a subspace $S$ and $p = \sum_i\langle v,w_i\rangle w_i$, then $v-p\in S^\perp$ and $\lVert v-p\rVert\le\lVert v-s\rVert$ for every $s\in S$ — $p$ is the closest point of $S$ to $v$.</p></div>
<div class="box proof" data-level="s" data-t="of the best approximation theorem">
<p>$\langle v-p,w_j\rangle = \langle v,w_j\rangle-\langle v,w_j\rangle = 0$ for each $j$, so $v-p\perp S$. For $s\in S$, $p-s\in S$, so by Pythagoras $\lVert v-s\rVert^2 = \lVert(v-p)+(p-s)\rVert^2 = \lVert v-p\rVert^2+\lVert p-s\rVert^2\ge\lVert v-p\rVert^2$.</p></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Least squares:</b> fitting a line to data = projecting the data vector onto a column space (see A1 below).</li>
<li><b>Signal processing &amp; JPEG:</b> coordinates in orthonormal bases (Fourier/cosine bases) — just inner products, no systems to solve.</li>
<li><b>Machine learning:</b> cosine similarity $\cos\theta = \frac{u\cdot v}{\lVert u\rVert\lVert v\rVert}$ compares documents and embeddings.</li>
<li><b>Numerical linear algebra:</b> Gram–Schmidt gives the $QR$ factorization; orthonormal bases keep rounding errors small.</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · A norm and unit vector", "<p>Find $\\lVert(2,-1,2)\\rVert$ and the unit vector in its direction.</p>", "<p>$\\sqrt{4+1+4} = 3$; unit vector $\\frac13(2,-1,2)$.</p>")}
${q("f", "Foundation", "F2 · Orthogonal?", "<p>Are $(1,2,-1)$ and $(3,0,3)$ orthogonal?</p>", "<p>$3+0-3 = 0$: <b>yes</b>.</p>")}
${q("s", "Standard", "S1 · Projection onto a plane", "<p>With $w_1 = (1,0,0)$, $w_2 = \\frac1{\\sqrt2}(0,1,1)$ (orthonormal), find the projection of $v = (1,2,3)$ onto $S = \\spn\\{w_1,w_2\\}$ and the distance from $v$ to $S$.</p>", "<p>$\\langle v,w_1\\rangle = 1$, $\\langle v,w_2\\rangle = \\frac5{\\sqrt2}$, so $p = (1,0,0)+\\frac52(0,1,1) = (1,\\tfrac52,\\tfrac52)$. Distance $\\lVert v-p\\rVert = \\lVert(0,-\\tfrac12,\\tfrac12)\\rVert = \\frac1{\\sqrt2}$.</p>")}
${q("s", "Standard", "S2 · Polarization identity", "<p>Prove $\\langle u,v\\rangle = \\tfrac14\\big(\\lVert u+v\\rVert^2-\\lVert u-v\\rVert^2\\big)$ in any real inner product space.</p>", "<p>$\\lVert u\\pm v\\rVert^2 = \\lVert u\\rVert^2\\pm2\\langle u,v\\rangle+\\lVert v\\rVert^2$; subtracting gives $4\\langle u,v\\rangle$. $\\square$ (So the norm determines the inner product.)</p>")}
${q("a", "Enrichment", "A1 · Least-squares line", "<p>Find the least-squares line $y = a+bx$ through $(0,1)$, $(1,3)$, $(2,4)$.</p>", "<p>With $A = \\begin{pmatrix}1&0\\\\1&1\\\\1&2\\end{pmatrix}$, $y = (1,3,4)^T$, solve the normal equations $A^TA\\binom ab = A^Ty$: $\\begin{pmatrix}3&3\\\\3&5\\end{pmatrix}\\binom ab = \\binom8{11}$, giving $b = \\frac32$, $a = \\frac76$. Best line $y = \\frac76+\\frac32x$ (the residual is orthogonal to the column space of $A$).</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>Four axioms; coincidence is the one to check hardest.</li><li>$S^\perp$ is always a subspace; $0$ is orthogonal to everything.</li><li>Gram–Schmidt: subtract projections onto the <i>new</i> vectors; check orthogonality each step; normalise last.</li></ul></div>`);

  /* ------------------------------ Chapter 5 ------------------------------ */
  add("ch5", H`
<div class="box intuition" data-level="f" data-t="The picture: intersecting planes">
<p>Each equation in three unknowns is a plane in $\R^3$; solving the system means intersecting the planes. Two planes usually meet in a line; three usually meet in a point; parallel planes never meet (inconsistent). Row operations replace the planes by different planes with the <b>same intersection</b>.</p></div>
<div class="box thm" data-level="s" data-t="Structure of the solution set of Ax = b">
<p>If $x_p$ is one solution of $Ax = b$, then the full solution set is $\{x_p+h : h\in\Null(A)\}$ — "one particular solution plus all homogeneous solutions".</p></div>
<div class="box proof" data-level="s" data-t="of the solution-structure theorem">
<p>If $Ah = 0$ then $A(x_p+h) = b+0 = b$. Conversely if $Ax = b$ then $A(x-x_p) = b-b = 0$, so $h = x-x_p\in\Null(A)$ and $x = x_p+h$. $\square$ Consequently a consistent system has a unique solution iff $\Null(A) = \{0\}$.</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>Row operations preserve the column space</td><td>$\begin{pmatrix}1&1\\1&1\end{pmatrix}\to\begin{pmatrix}1&1\\0&0\end{pmatrix}$: $\CS$ changes from $\spn\{(1,1)^T\}$ to $\spn\{(1,0)^T\}$</td><td>They preserve the <b>row</b> space and the null space</td></tr>
<tr><td>More equations than unknowns ⇒ no solution</td><td>$x = 1$, $2x = 2$, $3x = 3$</td><td>Consistency depends on $\Rank A$ vs $\Rank[A|b]$</td></tr>
<tr><td>A homogeneous system has infinitely many solutions</td><td>$x = 0$, $y = 0$</td><td>Only the trivial one when $\Rank A = n$</td></tr>
<tr><td>Column operations are fine when solving $Ax = b$</td><td>Swapping columns renames unknowns; scaling a column rescales an unknown</td><td>Use row operations only</td></tr>
</table></div></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Cost:</b> Gaussian elimination on an $n\times n$ system takes about $\tfrac23n^3$ operations; computers use pivoting and the $LU$ factorization for speed and stability.</li>
<li><b>Applications:</b> electrical circuits (Kirchhoff's laws), traffic and network flow, chemical equations (A1 below), polynomial interpolation, computer tomography (huge sparse systems).</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · A 2×2 system", "<p>Solve $x+y = 3$, $2x-y = 0$.</p>", "<p>Adding: $3x = 3$, so $x = 1$, $y = 2$.</p>")}
${q("f", "Foundation", "F2 · Rank", "<p>Find the rank of $\\begin{pmatrix}1&2\\\\2&4\\end{pmatrix}$.</p>", "<p>$R_2\\to R_2-2R_1$ gives a zero row: rank $1$.</p>")}
${q("s", "Standard", "S1 · A parameter", "<p>For which $k$ does $x+y+z = 1$, $x+2y+kz = 2$, $x+4y+k^2z = 4$ have (a) a unique solution, (b) infinitely many, (c) none?</p>", "<p>$\\det\\begin{pmatrix}1&1&1\\\\1&2&k\\\\1&4&k^2\\end{pmatrix} = (k-1)(k-2)$. (a) Unique iff $k\\neq1,2$. For $k = 1$: $y = 1$ and $x+z = 0$ — consistent, rank 2 ⇒ infinitely many. For $k = 2$: $y+z = 1$ twice — consistent, rank 2 ⇒ infinitely many. So (b) $k\\in\\{1,2\\}$ and (c) never: the system is always consistent.</p>")}
${q("s", "Standard", "S2 · General solution", "<p>Find all solutions of $x+2y-z = 3$, $2x+4y-z = 7$.</p>", "<p>$R_2\\to R_2-2R_1$: $z = 1$. Then $x = 4-2y$. Solutions $(4-2y,\\,y,\\,1) = (4,0,1)+y(-2,1,0)$ — a particular solution plus $\\Null(A) = \\spn\\{(-2,1,0)\\}$.</p>")}
${q("a", "Enrichment", "A1 · Balancing a chemical equation", "<p>Balance $a\\,\\mathrm{C_3H_8}+b\\,\\mathrm{O_2}\\to c\\,\\mathrm{CO_2}+d\\,\\mathrm{H_2O}$ using a null space.</p>", "<p>Atoms: C: $3a = c$; H: $8a = 2d$; O: $2b = 2c+d$. The null space of $\\begin{pmatrix}3&0&-1&0\\\\8&0&0&-2\\\\0&2&-2&-1\\end{pmatrix}$ is spanned by $(\\tfrac14,\\tfrac54,\\tfrac34,1)$; scaling by 4: $\\mathrm{C_3H_8}+5\\mathrm{O_2}\\to3\\mathrm{CO_2}+4\\mathrm{H_2O}$.</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>Row operations keep the solution set, row space and null space — not the column space.</li><li>Solutions = particular + null space. Nullity = $n-$rank.</li><li>Inconsistent iff a row $(0\cdots0\,|\,c\neq0)$ appears.</li></ul></div>`);

  /* ------------------------------ Chapter 6 ------------------------------ */
  add("ch6", H`
<div class="box intuition" data-level="f" data-t="The picture: signed volume">
<p>$|\det A|$ is the factor by which $x\mapsto Ax$ scales areas ($2\times2$) or volumes ($3\times3$); the sign records whether orientation flips. Row operations are easy to track in this picture: a shear ($R_i\to R_i+cR_j$) keeps volume, scaling a row scales volume, and a swap is a reflection.</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>$\det(A+B) = \det A+\det B$</td><td>$A = \diag(1,0)$, $B = \diag(0,1)$: $0+0\neq1 = \det I$</td><td>$\det(AB) = \det A\det B$</td></tr>
<tr><td>$\det(cA) = c\det A$</td><td>$\det(2I_3) = 8$</td><td>$\det(cA) = c^n\det A$</td></tr>
<tr><td>$\det A = 0$ ⇒ a row of zeros</td><td>$\begin{pmatrix}1&2\\2&4\end{pmatrix}$</td><td>$\det A = 0$ ⇔ rows (columns) dependent</td></tr>
<tr><td>$\det(A^{-1}) = -\det A$</td><td>$A = 2I_2$: $\det A^{-1} = \det(\tfrac12I_2) = \tfrac14$, but $-\det A = -4$</td><td>$\det A^{-1} = 1/\det A$</td></tr>
</table></div></div>
<div class="box ex" data-level="s" data-t="Cramer's rule in action">
<p>Solve $2x+y = 5$, $x+3y = 10$. $\det A = 5$; $x = \frac{\det\begin{pmatrix}5&1\\10&3\end{pmatrix}}{5} = \frac{5}{5} = 1$, $y = \frac{\det\begin{pmatrix}2&5\\1&10\end{pmatrix}}{5} = \frac{15}{5} = 3$. Check: $2+3 = 5$ ✔, $1+9 = 10$ ✔.</p></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Change of variables in integrals:</b> the Jacobian determinant is the local volume factor ($dx\,dy = r\,dr\,d\theta$).</li>
<li><b>Eigenvalues:</b> $\det(A-\lambda I) = 0$ (Chapter 7); $\det A = \prod\lambda_i$.</li>
<li><b>Geometry:</b> the area of a triangle with vertices $(x_i,y_i)$ is $\tfrac12|\det|$ of a $3\times3$ matrix; the cross product is a formal determinant.</li>
<li><b>Vandermonde:</b> $\det\begin{pmatrix}1&a&a^2\\1&b&b^2\\1&c&c^2\end{pmatrix} = (b-a)(c-a)(c-b)$ — why a polynomial through distinct points is unique.</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · A 2×2 determinant", "<p>Compute $\\det\\begin{pmatrix}3&1\\\\4&2\\end{pmatrix}$.</p>", "<p>$3\\cdot2-1\\cdot4 = 2$.</p>")}
${q("f", "Foundation", "F2 · Properties", "<p>If $A$ is $3\\times3$ with $\\det A = 3$, find $\\det(2A)$, $\\det(A^{-1})$, $\\det(A^T)$.</p>", "<p>$2^3\\cdot3 = 24$; $\\frac13$; $3$.</p>")}
${q("s", "Standard", "S1 · When is it invertible?", "<p>For which $t$ is $\\begin{pmatrix}1&t&0\\\\t&1&0\\\\0&0&t\\end{pmatrix}$ invertible?</p>", "<p>Expanding along row 3: $\\det = t(1-t^2) = -t(t-1)(t+1)$. Invertible iff $t\\notin\\{-1,0,1\\}$.</p>")}
${q("s", "Standard", "S2 · Skew-symmetric matrices of odd size", "<p>Prove: if $A$ is $n\\times n$ with $n$ odd and $A^T = -A$, then $\\det A = 0$.</p>", "<p>$\\det A = \\det A^T = \\det(-A) = (-1)^n\\det A = -\\det A$, so $2\\det A = 0$ and $\\det A = 0$. $\\square$</p>")}
${q("a", "Enrichment", "A1 · Vandermonde determinant", "<p>Prove $\\det\\begin{pmatrix}1&a&a^2\\\\1&b&b^2\\\\1&c&c^2\\end{pmatrix} = (b-a)(c-a)(c-b)$.</p>", "<p>$R_2\\to R_2-R_1$, $R_3\\to R_3-R_1$ (no change) give rows $(0,\\,b-a,\\,b^2-a^2)$, $(0,\\,c-a,\\,c^2-a^2)$. Expand along column 1 and factor: $(b-a)(c-a)\\det\\begin{pmatrix}1&b+a\\\\1&c+a\\end{pmatrix} = (b-a)(c-a)(c-b)$. $\\square$</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>Swap ⇒ sign change; scale a row by $c$ ⇒ $\times c$; add a multiple ⇒ no change.</li><li>Invertible ⇔ $\det\neq0$ ⇔ independent columns.</li><li>Expand along the row/column with the most zeros.</li></ul></div>`);

  /* ------------------------------ Chapter 7 ------------------------------ */
  add("ch7", H`
<div class="box intuition" data-level="f" data-t="Why eigenvectors matter">
<p>Repeatedly applying a matrix ($x_{k+1} = Ax_k$) is how populations, Markov chains, vibrations and Google's PageRank evolve. In an eigenvector basis each coordinate just gets multiplied by its eigenvalue: $A^k$ becomes $PD^kP^{-1}$, so the largest eigenvalue dominates the long-run behaviour.</p></div>
<div class="box trap" data-level="s" data-t="Counterexample gallery">
<div class="tbl-wrap"><table class="tbl"><tr><th>Tempting claim</th><th>Counterexample</th><th>What is true</th></tr>
<tr><td>Every real matrix has a real eigenvalue</td><td>Rotation by $90^\circ$: $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$, $\lambda = \pm i$</td><td>Symmetric real matrices do (Thm 8.2.3)</td></tr>
<tr><td>Repeated eigenvalue ⇒ not diagonalizable</td><td>$I_2$</td><td>Need geometric = algebraic multiplicity</td></tr>
<tr><td>Same eigenvalues ⇒ similar</td><td>$\begin{pmatrix}1&1\\0&1\end{pmatrix}$ and $I_2$</td><td>Similar ⇒ same eigenvalues (not conversely)</td></tr>
<tr><td>Eigenvalues of $A+B$ are sums of eigenvalues</td><td>$A = \begin{pmatrix}0&1\\0&0\end{pmatrix}$, $B = \begin{pmatrix}0&0\\1&0\end{pmatrix}$: all eigenvalues $0$, but $A+B$ has $\pm1$</td><td>Only $\operatorname{tr}(A+B) = \operatorname{tr}A+\operatorname{tr}B$</td></tr>
<tr><td>Invertible ⇒ diagonalizable</td><td>$\begin{pmatrix}1&1\\0&1\end{pmatrix}$</td><td>The two properties are independent</td></tr>
</table></div></div>
<div class="box ex" data-level="s" data-t="Matrix powers by diagonalization">
<p>$A = \begin{pmatrix}4&1\\2&3\end{pmatrix}$: eigenvalues $5$ (eigenvector $(1,1)$) and $2$ (eigenvector $(-1,2)$). With $P = \begin{pmatrix}-1&1\\2&1\end{pmatrix}$, $D = \diag(2,5)$:
$$A^n = PD^nP^{-1} = \frac13\begin{pmatrix}2\cdot5^n+2^n & 5^n-2^n\\ 2\cdot5^n-2\cdot2^n & 5^n+2\cdot2^n\end{pmatrix},\qquad A^5 = \begin{pmatrix}2094&1031\\2062&1063\end{pmatrix}.$$</p></div>
<div class="box ex" data-level="a" data-t="A Markov chain's steady state">
<p>Transition matrix $M = \begin{pmatrix}9/10&1/2\\1/10&1/2\end{pmatrix}$ (columns sum to 1). Eigenvalues $1$ and $\frac25$. The eigenvector for $\lambda = 1$ is $(5,1)$; normalised to probabilities, the long-run distribution is $\big(\frac56,\frac16\big)$, because the $\frac25$-component decays like $(\frac25)^k$.</p></div>
<div class="box beyond" data-level="a" data-t="Connections & applications">
<ul><li><b>Differential equations:</b> $x' = Ax$ has solutions $e^{\lambda t}v$ for each eigenpair.</li>
<li><b>Fibonacci:</b> $\binom{F_{n+1}}{F_n} = \begin{pmatrix}1&1\\1&0\end{pmatrix}^n\binom10$; the eigenvalues $\frac{1\pm\sqrt5}{2}$ give Binet's formula.</li>
<li><b>Data science:</b> PCA = eigenvectors of the covariance matrix (Chapter 8); spectral clustering uses eigenvectors of graph Laplacians.</li></ul></div>
<h3>Levelled practice</h3>
${q("f", "Foundation", "F1 · Diagonal matrix", "<p>Eigenvalues and eigenvectors of $\\begin{pmatrix}2&0\\\\0&5\\end{pmatrix}$?</p>", "<p>$2$ with $(1,0)$, and $5$ with $(0,1)$ (diagonal matrices: read them off).</p>")}
${q("f", "Foundation", "F2 · Check an eigenvector", "<p>Is $(1,1)$ an eigenvector of $\\begin{pmatrix}3&1\\\\1&3\\end{pmatrix}$?</p>", "<p>$A(1,1)^T = (4,4)^T = 4(1,1)^T$: yes, with eigenvalue $4$.</p>")}
${q("s", "Standard", "S1 · A and Aᵀ", "<p>Prove that $A$ and $A^T$ have the same eigenvalues.</p>", "<p>$\\det(A^T-\\lambda I) = \\det\\big((A-\\lambda I)^T\\big) = \\det(A-\\lambda I)$ (Theorem 6.2.1), so they have the same characteristic polynomial. (Their eigenvectors can differ.) $\\square$</p>")}
${q("s", "Standard", "S2 · Idempotent matrices", "<p>If $A^2 = A$, show every eigenvalue of $A$ is $0$ or $1$.</p>", "<p>If $Av = \\lambda v$ with $v\\neq0$ then $\\lambda v = Av = A^2v = \\lambda^2v$, so $(\\lambda^2-\\lambda)v = 0$ and $\\lambda\\in\\{0,1\\}$. (Example: projection matrices.)</p>")}
${q("a", "Enrichment", "A1 · Powers", "<p>Use diagonalization to compute $A^5$ for $A = \\begin{pmatrix}4&1\\\\2&3\\end{pmatrix}$.</p>", "<p>See the worked example above: $A^5 = \\frac13\\begin{pmatrix}2\\cdot3125+32&3125-32\\\\2\\cdot3125-64&3125+64\\end{pmatrix} = \\begin{pmatrix}2094&1031\\\\2062&1063\\end{pmatrix}$.</p>")}
<div class="box tip" data-level="f" data-t="Key takeaways">
<ul><li>$\det(A-\lambda I) = 0$ gives eigenvalues; null spaces give eigenvectors.</li><li>Diagonalizable ⇔ enough independent eigenvectors (geo = alg for each $\lambda$).</li><li>$\sum\lambda = \operatorname{tr}A$, $\prod\lambda = \det A$ — use them to check.</li></ul></div>`);
})();
