/* Chapter 4 — Inner Product Spaces and Orthogonality (coursework chapter: full depth) */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch4", num: 4, title: "Inner Product Spaces & Orthogonality", short: "Inner Products & Orthogonality", test: true, pages: "46–57 + Gram–Schmidt handout", quiz: "ch4",
    blurb: "Lengths, angles and perpendicularity in any vector space — inner products, norms, orthogonal complements, the big inequalities, and the Gram–Schmidt process for building orthonormal bases.",
    labs: [["Gram–Schmidt Machine", "#/labs/gram-schmidt"], ["3D Orthogonality", "#/labs/gs3d"], ["Inner Product Lab", "#/labs/inner"]],
    goals: [
      "Prove that a given formula is (or is not) an inner product by checking the four axioms — including the tricky ‘coincidence’ axiom.",
      "Compute norms, unit vectors, distances and angles for vectors, polynomials and matrices.",
      "Find orthogonal complements $S^{\\perp}$ and prove the standard properties (Prop. 4.2.5).",
      "Prove and apply the Pythagorean Theorem, Cauchy–Schwarz and the Triangle Inequality.",
      "Run the Gram–Schmidt process flawlessly in $\\R^n$, in $\\P_n$ with integral inner products, and in matrix spaces.",
    ],
    intro: H`<div class="kicker">The one big idea</div>
<p style="font-size:1.08rem">An <b>inner product</b> is a rule $\langle u,v\rangle$ that generalizes the dot product. Once you have it, you automatically get <b>length</b> $\lVert u\rVert = \sqrt{\langle u,u\rangle}$, <b>angle</b> and <b>perpendicularity</b> — even for polynomials and matrices. <b>Gram–Schmidt</b> then turns any independent list into a perfectly perpendicular, unit-length (orthonormal) one.</p>
<p class="muted" style="margin-bottom:0">Coursework favourites: verify an inner product, find $S^\perp$, prove a property of $S^\perp$, and run Gram–Schmidt (often with an integral inner product).</p>`,
    sections: [
      /* ------------------------------------------------------------- 4.1 */
      { id: "4.1", title: "Inner products and norms", html: H`
<div class="box def" data-t="4.1.1 · Inner product">
<p>Let $V$ be a vector space over $\R$. An <b>inner product</b> on $V$ is a function $\langle\cdot,\cdot\rangle: V\times V\to\R$ such that for all $u,v,w\in V$ and $a,b\in\R$:</p>
<ol type="i">
<li>$\langle u,u\rangle\ge0$ &nbsp; <span class="chip">non-negativity</span></li>
<li>$\langle u,u\rangle = 0 \iff u = 0$ &nbsp; <span class="chip">coincidence</span></li>
<li>$\langle u,v\rangle = \langle v,u\rangle$ &nbsp; <span class="chip">symmetry</span></li>
<li>$\langle au+bv,\,w\rangle = a\langle u,w\rangle + b\langle v,w\rangle$ &nbsp; <span class="chip">linearity</span></li>
</ol>
</div>
<div class="box def" data-t="4.1.2 · Inner product space">
<p>A vector space with an inner product, $(V,\langle\cdot,\cdot\rangle)$, is an <b>inner product space</b> (IPS).</p>
</div>
<div class="box intuition" data-t="What each axiom protects">
<ul><li><b>Non-negativity + coincidence:</b> "length²" $\langle u,u\rangle$ is never negative, and only the zero vector has length 0.</li>
<li><b>Symmetry:</b> the angle between $u$ and $v$ is the same as between $v$ and $u$.</li>
<li><b>Linearity:</b> the inner product behaves like multiplication — you can expand brackets. By symmetry it is linear in the <b>second</b> slot too: $\langle w, au+bv\rangle = a\langle w,u\rangle + b\langle w,v\rangle$.</li></ul>
</div>

<div class="box ex" data-t="4.1.3(i) · The dot product on ℝⁿ">
<p>$\langle x,y\rangle = x\cdot y = x_1y_1+\dots+x_ny_n$. Verification:</p>
<ul><li><b>Non-neg:</b> $x\cdot x = x_1^2+\dots+x_n^2\ge0$.</li>
<li><b>Coincidence:</b> $x\cdot x = 0 \iff x_1^2+\dots+x_n^2 = 0 \iff$ each $x_i^2 = 0 \iff x = 0$.</li>
<li><b>Symmetry:</b> $x\cdot y = \sum x_iy_i = \sum y_ix_i = y\cdot x$.</li>
<li><b>Linearity:</b> $(ax+by)\cdot z = \sum(ax_i+by_i)z_i = a\sum x_iz_i + b\sum y_iz_i = a\,x\cdot z + b\,y\cdot z$.</li></ul>
<p class="small muted">Note: on $\R^n$, if no inner product is stated, assume the dot product.</p>
</div>

<div class="box ex" data-t="4.1.3(ii) · An integral inner product on linear polynomials">
<p>$V$ = linear polynomials on $[0,1]$, $\langle f,g\rangle = \int_0^1 f(x)g(x)\,dx$. Write $f = a_0+a_1x$.</p>
<p><b>Non-negativity</b> (complete the square):
$$\langle f,f\rangle = \int_0^1(a_0+a_1x)^2dx = a_0^2 + a_0a_1 + \frac{a_1^2}{3} = \frac13\Big[\Big(a_1+\frac32a_0\Big)^2 + \frac34a_0^2\Big]\ge0.$$
<b>Coincidence:</b> $\langle f,f\rangle = 0\iff \big(a_1+\frac32a_0\big)^2 = 0$ and $a_0^2 = 0 \iff a_0 = a_1 = 0\iff f = \theta$ (zero polynomial).<br>
<b>Symmetry:</b> $\int_0^1 fg = \int_0^1 gf$. &nbsp; <b>Linearity:</b> $\int_0^1(af+bg)h = a\int_0^1 fh + b\int_0^1 gh$.</p>
<p class="small muted">Slicker coincidence argument: $\int_0^1 f^2 = 0$ with $f^2\ge0$ continuous forces $f(x) = 0$ for all $x\in[0,1]$; a polynomial with infinitely many roots is the zero polynomial.</p>
</div>

<div class="box template" data-t="How to PROVE ⟨·,·⟩ is an inner product (4 labelled checks)">
<p>Let $u,v,w\in V$ and $a,b\in\R$ be arbitrary. <i>(Write $u = (u_1,\ldots)$ or $p = a_0+a_1x+\dots$ if needed.)</i></p>
<ol><li><b>Non-negativity.</b> $\langle u,u\rangle = \;\cdots\; \ge 0$ because it is a sum of squares / integral of a square / … (with positive weights).</li>
<li><b>Coincidence.</b> ($\Leftarrow$) $\langle 0,0\rangle = 0$. ($\Rightarrow$) If $\langle u,u\rangle = 0$ then each square term is $0$, so … $\Rightarrow u = 0$. <i>This is the step markers look at hardest.</i></li>
<li><b>Symmetry.</b> $\langle u,v\rangle = \cdots = \langle v,u\rangle$ (commutativity of real multiplication).</li>
<li><b>Linearity.</b> $\langle au+bv,w\rangle = \cdots = a\langle u,w\rangle+b\langle v,w\rangle$ (expand; linearity of sums/integrals/derivatives).</li></ol>
<p>Since all four axioms hold, $\langle\cdot,\cdot\rangle$ is an inner product on $V$. $\square$</p>
<p class="small muted">To show something is <b>not</b> an inner product: give one specific vector (or pair) where an axiom fails, e.g. $\langle u,u\rangle\lt0$ or $\langle u,u\rangle = 0$ with $u\ne0$.</p>
</div>

<div class="box trap" data-t="Where inner-product proofs go wrong">
<ul>
<li><b>Negative or zero weights:</b> $\langle x,y\rangle = x_1y_1 - x_2y_2$ fails non-negativity: $\langle(0,1),(0,1)\rangle = -1$. $\;\langle x,y\rangle = x_1y_1$ on $\R^2$ fails coincidence: $\langle(0,1),(0,1)\rangle = 0$.</li>
<li><b>Derivative-only inner products</b> like $\int_{-1}^1 p'q'\,dx$ fail coincidence on $\P_n$: the constant $p = 1\ne0$ has $\langle p,p\rangle = 0$. That is <i>exactly</i> why Exercise 4 Q1 restricts to $p(-1) = p(1) = 0$ (which kills constants), and why Exercise 4 Q4(a) adds $3p(0)q(0)$.</li>
<li><b>Too few evaluation points:</b> $\langle p,q\rangle = p(0)q(0)+p(1)q(1)$ is an inner product on $\P_1$ but <b>not</b> on $\P_2$: $p = x(x-1)\ne0$ gives $\langle p,p\rangle = 0$. (Rule: you need at least $n+1$ points for $\P_n$.)</li>
<li><b>Cross terms:</b> $\langle x,y\rangle = x_1y_2+x_2y_1$ is symmetric and linear but $\langle(1,-1),(1,-1)\rangle = -2\lt0$.</li>
</ul>
</div>
<div class="box tip" data-t="Spot the design of fancy inner products">
<p>In Example 4.2.15(iii), $\langle p,q\rangle = \int_0^1p''q''\,dx + 2p(0)q(0)+p(1)q(1)$ on $\P_3$: the integral term vanishes only if $p''\equiv0$, i.e. $p = a+bx$; then $p(0) = 0$ forces $a = 0$ and $p(1) = 0$ forces $b=0$. Each extra term "plugs a hole" left by the derivative. Recognising this makes the coincidence proof a two-line argument.</p>
</div>

<div class="box def" data-t="4.1.4 · Norm, unit vector, normalisation, distance">
<ol type="i"><li><b>Norm (length):</b> $\lVert u\rVert = \sqrt{\langle u,u\rangle}$.</li>
<li><b>Unit vector:</b> $\lVert u\rVert = 1$.</li>
<li><b>Unit vector in the direction of $u\ne0$:</b> $\hat u = \dfrac{u}{\lVert u\rVert}$ ("normalising").</li>
<li><b>Distance:</b> $d(u,v) = \lVert u-v\rVert$.</li></ol>
<p class="small muted">This is "the norm induced by the inner product"; a vector space with a norm is a <i>normed linear space</i>.</p>
</div>
<div class="box ex" data-t="4.1.5 · Computing norms">
<p><b>(i)</b> $u = (-1,5,3)$: $\lVert u\rVert = \sqrt{1+25+9} = \sqrt{35}$, so $\hat u = \frac{1}{\sqrt{35}}(-1,5,3)$. In general $\lVert x\rVert = \sqrt{x_1^2+\dots+x_n^2}$ — Pythagoras in $n$ dimensions.</p>
<p><b>(ii)</b> $\langle f,g\rangle = \int_0^1 fg$, $f(x) = 1-2x$:
$$\lVert f\rVert^2 = \int_0^1(1-4x+4x^2)\,dx = \Big[x - 2x^2 + \tfrac{4x^3}{3}\Big]_0^1 = \tfrac13 \;\Rightarrow\;\lVert f\rVert = \tfrac{1}{\sqrt3},\quad \hat f(x) = \sqrt3\,(1-2x).$$</p>
</div>
<div class="box tip" data-t="Norm habits that save time">
<ul><li>Work with $\lVert u\rVert^2$ (no square roots) and only take the root at the end.</li>
<li>$\lVert\alpha u\rVert = |\alpha|\,\lVert u\rVert$ — so you may scale a vector to clear fractions before normalising: $\widehat{\alpha u} = \hat u$ for $\alpha\gt0$.</li>
<li>Expand like algebra: $\lVert u\pm v\rVert^2 = \lVert u\rVert^2 \pm 2\langle u,v\rangle + \lVert v\rVert^2$.</li></ul>
</div>
` },

      /* ------------------------------------------------------------- 4.2 */
      { id: "4.2", title: "Orthogonality, complements and the big inequalities", html: H`
<div class="box def" data-t="4.2.1 · Angle between vectors">
<p>For non-zero $u,v$ in a real IPS, the angle $\theta\in[0,\pi]$ between them is given by
$$\cos\theta = \frac{\langle u,v\rangle}{\lVert u\rVert\,\lVert v\rVert}.$$
<span class="small muted">(Cauchy–Schwarz below guarantees this fraction lies in $[-1,1]$.)</span></p>
</div>
<div class="box ex" data-t="4.2.2 · An angle in ℝ²">
<p>$u = (0,3)$, $v = (4,-1)$: $u\cdot v = -3$, $\lVert u\rVert = 3$, $\lVert v\rVert = \sqrt{17}$, so $\cos\theta = -\frac{1}{\sqrt{17}}$ and $\theta = \arccos\!\big(-\tfrac{1}{\sqrt{17}}\big)\approx 1.82$ rad (obtuse, since the dot product is negative).</p>
</div>

<div class="box def" data-t="4.2.3 · Orthogonal vectors and orthogonal complement">
<p>(i) $u\perp v$ ("orthogonal") if $\langle u,v\rangle = 0$.<br>
(ii) The <b>orthogonal complement</b> of $S\subseteq V$ is $\;S^\perp = \{u\in V : \langle u,v\rangle = 0\text{ for all }v\in S\}$ — every vector perpendicular to <b>everything</b> in $S$.</p>
</div>
<div class="box lem" data-t="The zero vector is orthogonal to everything (notes: “try to prove this”)">
<p>For every $u\in V$: $\langle u,0\rangle = \langle 0,u\rangle = 0$.</p>
<p><b>Proof.</b> By linearity, $\langle 0,u\rangle = \langle 0\cdot0,\,u\rangle = 0\,\langle 0,u\rangle = 0$; by symmetry $\langle u,0\rangle = 0$ too. $\square$</p>
</div>
<div class="box ex" data-t="4.2.4 · Orthogonal complements">
<ol type="i">
<li>$\{0\}^\perp = V$ and $V^\perp = \{0\}$ (see Prop. 4.2.5(i)).</li>
<li>$S = \{(0,1),(1,1)\}\subset\R^2$: need $y = 0$ and $x+y = 0$, so $S^\perp = \{(0,0)\}$.</li>
<li>$S = \{(x,2x):x\in\R\}$ (a line): $(w,z)\cdot(x,2x) = x(w+2z) = 0$ for <i>all</i> $x$ forces $w = -2z$, so $S^\perp = \{(-2z,z): z\in\R\}$ — the perpendicular line.</li>
<li>$S = \{(0,1,1),(3,2,1)\}\subset\R^3$: $y+z = 0$ and $3x+2y+z = 0$ give $z = -y$, $y = -3x$, so $S^\perp = \{(x,-3x,3x)\} = \spn\{(1,-3,3)\}$.</li>
<li>Linear polynomials on $[0,1]$ with $\langle f,g\rangle = \int_0^1fg$, $S = \{1-x\}$: for $f = a_0+a_1x$,
$$\langle f,1-x\rangle = \int_0^1(a_0+a_1x)(1-x)\,dx = \frac{a_0}{2}+\frac{a_1}{6} = 0\iff a_1 = -3a_0,$$ so $S^\perp = \{a_0(1-3x): a_0\in\R\} = \spn\{1-3x\}$.</li>
</ol>
</div>
<div class="box recipe" data-t="Finding S⊥">
<ol class="recipe-steps">
<li>Take a general vector $u$ of $V$ (e.g. $(x,y,z)$ or $a_0+a_1x+a_2x^2$).</li>
<li>Impose $\langle u,s\rangle = 0$ for each $s$ in $S$ — if $S$ is a subspace, it is enough to use a <b>spanning set</b> of $S$.</li>
<li>Solve the homogeneous system; write the solution with parameters.</li>
<li>State $S^\perp = \spn\{\ldots\}$ (and its dimension if asked).</li>
</ol>
<p class="small muted">In $\R^n$ with the dot product: put the vectors of $S$ as the <b>rows</b> of a matrix $A$; then $S^\perp = \Null(A)$ and $\dim S^\perp = n - \Rank A$.</p>
</div>

<div class="box prop" data-t="4.2.5 · Properties of orthogonal complements ★">
<p>Let $S, W$ be subsets of an IPS $V$.</p>
<ol type="i"><li>$V^\perp = \{0\}$ and $\{0\}^\perp = V$.</li>
<li>If $W\ne\emptyset$ then $W^\perp$ is a subspace of $V$.</li>
<li>$S\subseteq (S^\perp)^\perp = S^{\perp\perp}$.</li>
<li>If $S$ is a subspace then $S\cap S^\perp = \{0\}$.</li>
<li>If $S\subseteq W$ then $W^\perp\subseteq S^\perp$.</li></ol>
</div>
<div class="box proof" data-t="of Proposition 4.2.5 (all parts — the notes leave these as exercises)">
<p><b>(i)</b> $0\in V^\perp$ by the Lemma. If $u\in V^\perp$, then $\langle u,v\rangle = 0$ for every $v\in V$, in particular $v = u$: $\langle u,u\rangle = 0$, so $u = 0$ by coincidence. Hence $V^\perp = \{0\}$. Also every $u\in V$ satisfies $\langle u,0\rangle = 0$, so $\{0\}^\perp = V$.</p>
<p><b>(ii)</b> $0\in W^\perp$ (Lemma), so $W^\perp\ne\emptyset$. Let $u_1,u_2\in W^\perp$, $a,b\in\R$ and $w\in W$. Then
$$\langle au_1+bu_2,\,w\rangle = a\langle u_1,w\rangle + b\langle u_2,w\rangle = a\cdot 0 + b\cdot 0 = 0,$$
so $au_1+bu_2\in W^\perp$. By Theorem 2.2.3, $W^\perp$ is a subspace.</p>
<p><b>(iii)</b> Let $s\in S$. For every $u\in S^\perp$ we have $\langle u,s\rangle = 0$, hence $\langle s,u\rangle = 0$ (symmetry). So $s$ is orthogonal to every vector of $S^\perp$, i.e. $s\in(S^\perp)^\perp$.</p>
<p><b>(iv)</b> $0\in S$ (subspace) and $0\in S^\perp$, so $\{0\}\subseteq S\cap S^\perp$. If $u\in S\cap S^\perp$, then $u\in S^\perp$ is orthogonal to every element of $S$, including $u$ itself: $\langle u,u\rangle = 0\Rightarrow u = 0$.</p>
<p><b>(v)</b> Let $u\in W^\perp$, so $\langle u,w\rangle = 0$ for all $w\in W$. Since $S\subseteq W$, in particular $\langle u,s\rangle = 0$ for all $s\in S$, so $u\in S^\perp$.</p>
</div>

<div class="box prop" data-t="4.2.6 · Pythagorean Theorem">
<p>If $u\perp v$ then $\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2$.</p>
</div>
<div class="box proof" data-t="of the Pythagorean Theorem (exercise in the notes)">
<div class="pf"><div>$\lVert u+v\rVert^2 = \langle u+v,\,u+v\rangle$</div><div class="j">definition of norm</div>
<div>$= \langle u,u+v\rangle + \langle v,u+v\rangle$</div><div class="j">linearity (1st slot)</div>
<div>$= \langle u,u\rangle + \langle u,v\rangle + \langle v,u\rangle + \langle v,v\rangle$</div><div class="j">symmetry + linearity</div>
<div>$= \lVert u\rVert^2 + 2\langle u,v\rangle + \lVert v\rVert^2$</div><div class="j">symmetry</div>
<div>$= \lVert u\rVert^2 + \lVert v\rVert^2$</div><div class="j">since $\langle u,v\rangle = 0$</div></div>
<p class="small muted">The middle line shows the converse too: in a real IPS, $\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2 \iff \langle u,v\rangle = 0$.</p>
</div>

<div class="box thm" data-t="4.2.7 · Cauchy–Schwarz Inequality ★">
<p>For all $u,v$ in a real IPS:
$$|\langle u,v\rangle|\le\lVert u\rVert\,\lVert v\rVert,$$
with equality <b>iff</b> $u$ and $v$ are linearly dependent.</p>
</div>
<div class="box proof" data-t="of Cauchy–Schwarz (exercise in the notes) — the 'best t' method">
<p>If $v = 0$ both sides are $0$ (and $\{u,0\}$ is dependent). So let $v\ne0$. For any $t\in\R$,
$$0\le\lVert u - tv\rVert^2 = \lVert u\rVert^2 - 2t\langle u,v\rangle + t^2\lVert v\rVert^2.$$
Choose $t = \dfrac{\langle u,v\rangle}{\lVert v\rVert^2}$ (the value that minimises the right side):
$$0\le \lVert u\rVert^2 - 2\frac{\langle u,v\rangle^2}{\lVert v\rVert^2} + \frac{\langle u,v\rangle^2}{\lVert v\rVert^2} = \lVert u\rVert^2 - \frac{\langle u,v\rangle^2}{\lVert v\rVert^2}.$$
Multiply by $\lVert v\rVert^2\gt0$: $\langle u,v\rangle^2\le\lVert u\rVert^2\lVert v\rVert^2$; take square roots.</p>
<p><b>Equality:</b> equality holds iff $\lVert u-tv\rVert = 0$ iff $u = tv$, i.e. iff $u,v$ are dependent. (If $u = cv$, direct substitution gives equality.)</p>
<p class="small muted">Alternative (handout): $q(t) = \lVert u+tv\rVert^2 = \lVert v\rVert^2t^2 + 2t\langle u,v\rangle + \lVert u\rVert^2\ge0$ for all $t$, so its discriminant is $\le0$: $4\langle u,v\rangle^2 - 4\lVert v\rVert^2\lVert u\rVert^2\le0$.</p>
</div>
<div class="box tip" data-t="Cauchy–Schwarz as a problem-solving weapon">
<p>Choose clever vectors. With $u = (a,b,c)$ and $v = (1,1,1)$ in $\R^3$: $(a+b+c)^2\le3(a^2+b^2+c^2)$. With $\langle f,g\rangle = \int_0^1fg$: $\Big(\int_0^1 f g\Big)^2\le\int_0^1f^2\int_0^1 g^2$ (handout).</p>
</div>

<div class="box thm" data-t="4.2.8 · Triangle Inequality">
<p>For all $u,v$: $\lVert u+v\rVert\le\lVert u\rVert+\lVert v\rVert$.</p>
</div>
<div class="box proof" data-t="of the Triangle Inequality (exercise in the notes)">
$$\lVert u+v\rVert^2 = \lVert u\rVert^2+2\langle u,v\rangle+\lVert v\rVert^2\le\lVert u\rVert^2+2|\langle u,v\rangle|+\lVert v\rVert^2\le\lVert u\rVert^2+2\lVert u\rVert\lVert v\rVert+\lVert v\rVert^2 = (\lVert u\rVert+\lVert v\rVert)^2,$$
<p>using Cauchy–Schwarz in the second step. Both sides are non-negative, so take square roots.</p>
</div>
<div class="box errata" data-t="Equality in the triangle inequality">
<p>The notes say equality holds "iff $u,v$ are linearly dependent". That is not quite right: $u = (1,0)$, $v = (-1,0)$ are dependent but $\lVert u+v\rVert = 0\ne2$. From the proof, equality needs <b>both</b> $\langle u,v\rangle = |\langle u,v\rangle|$ <b>and</b> Cauchy–Schwarz equality, i.e. <b>one vector is a non-negative multiple of the other</b> (they point the same way).</p>
</div>

<div class="box def" data-t="4.2.9 · Orthonormal set and orthonormal basis">
<p>$S = \{u_1,\dots,u_n\}$ is <b>orthonormal</b> if (i) $\langle u_i,u_j\rangle = 0$ for $i\ne j$ and (ii) $\lVert u_i\rVert = 1$ for each $i$. In one line: $\langle u_i,u_j\rangle = \delta_{ij}$ ($1$ if $i=j$, $0$ otherwise). If $S$ is also a basis, it is an <b>orthonormal basis</b>.</p>
</div>
<div class="box ex" data-t="4.2.10 · Checking orthonormality">
<p>(i) The standard basis $\{e_1,\dots,e_n\}$ of $\R^n$ is orthonormal: $e_i\cdot e_j = 0$ for $i\ne j$ and $e_i\cdot e_i = 1$.</p>
<p>(ii) $\big\{\frac{1}{\sqrt2}(1,1),\;\frac{1}{\sqrt2}(1,-1)\big\}$: dot product $\frac12-\frac12 = 0$, and each norm is $\sqrt{\frac12+\frac12} = 1$. Orthonormal ✔.</p>
<p>(iii) $p = 1-x$, $q = 1-3x$ with $\int_0^1$: $\langle p,q\rangle = \int_0^1(1-4x+3x^2)dx = 1-2+1 = 0$ (orthogonal), but $\lVert p\rVert^2 = \frac13$, so $\lVert p\rVert = \frac1{\sqrt3}\ne1$ — <b>orthogonal but not orthonormal</b>.</p>
</div>

<div class="box thm" data-t="4.2.11 · Orthogonal sets are independent">
<p>If $S = \{u_1,\dots,u_n\}$ consists of mutually orthogonal <b>non-zero</b> vectors, then $S$ is linearly independent.</p>
</div>
<div class="box proof" data-t="of Theorem 4.2.11">
<p>Suppose $a_1u_1+\dots+a_nu_n = 0$. Take the inner product of both sides with $u_i$:
$$a_1\langle u_1,u_i\rangle+\dots+a_n\langle u_n,u_i\rangle = \langle 0,u_i\rangle = 0.$$
Every term with $j\ne i$ vanishes (orthogonality), leaving $a_i\langle u_i,u_i\rangle = 0$. Since $u_i\neq0$, $\langle u_i,u_i\rangle\ne0$, so $a_i = 0$. This holds for each $i$, so $S$ is independent.</p>
<p class="small muted">⚠ The notes omit "non-zero", but the proof needs it: $\{(1,0),(0,0)\}$ is mutually orthogonal yet dependent.</p>
</div>
<div class="box tip" data-t="Why orthonormal bases are amazing (from the handout)">
<p>If $\{w_1,\dots,w_n\}$ is an orthonormal basis, coordinates are just inner products — no equations to solve:
$$v = \langle v,w_1\rangle w_1+\dots+\langle v,w_n\rangle w_n,\qquad \lVert v\rVert^2 = \langle v,w_1\rangle^2+\dots+\langle v,w_n\rangle^2.$$
Example: $\big\{(\tfrac23,\tfrac23,\tfrac13),(\tfrac13,-\tfrac23,\tfrac23),(-\tfrac23,\tfrac13,\tfrac23)\big\}$ is orthonormal, and $(1,2,1)$ has coordinates $\big(\tfrac73,-\tfrac13,\tfrac23\big)$ — check: $\tfrac{49}{9}+\tfrac19+\tfrac49 = 6 = \lVert(1,2,1)\rVert^2$ ✔.</p>
</div>
` },

      /* ------------------------------------------------------------- 4.2.14 */
      { id: "4.2.14", title: "The Gram–Schmidt process", html: H`
<div class="box thm" data-t="4.2.12 · Gram–Schmidt">
<p>If $\{v_1,\dots,v_n\}$ is linearly independent in an IPS $V$, there is an orthonormal set $\{w_1,\dots,w_n\}$ with
$$\spn\{v_1,\dots,v_i\} = \spn\{w_1,\dots,w_i\}\quad\text{for each } 1\le i\le n.$$</p>
<p class="small muted">Remark 4.2.13: the construction below is the <b>Gram–Schmidt orthogonalization process</b>; it converts any independent set into an orthonormal basis of its span. (The notes' remark cites "Theorem 4.2.8" — it means 4.2.12.)</p>
</div>

<div class="box recipe" data-t="4.2.14 · The process exactly as in your notes">
<ol class="recipe-steps">
<li><b>Step 1:</b> $u_1 = v_1$ and $w_1 = \hat u_1 = \dfrac{u_1}{\lVert u_1\rVert}$.</li>
<li><b>Step $k$</b> ($k = 2,\dots,n$): subtract from $v_k$ its components along all previous $w$'s,
$$u_k = v_k - \sum_{j=1}^{k-1}\langle v_k,w_j\rangle\,w_j,\qquad w_k = \hat u_k.$$</li>
<li>$\{w_1,\dots,w_n\}$ is an orthonormal basis of $\spn\{v_1,\dots,v_n\}$.</li>
</ol>
<p class="small muted">Reordering the $v$'s gives a (generally) different orthonormal basis.</p>
</div>

<div class="box tip" data-t="The fraction-friendly version (same answer, far less surd arithmetic) ⚡">
<p>Because $\langle v,w_j\rangle w_j = \Big\langle v,\frac{u_j}{\lVert u_j\rVert}\Big\rangle\frac{u_j}{\lVert u_j\rVert} = \dfrac{\langle v,u_j\rangle}{\langle u_j,u_j\rangle}\,u_j$, you can work with the <b>un-normalised</b> $u_j$ throughout:
$$\boxed{\,u_k = v_k - \sum_{j=1}^{k-1}\frac{\langle v_k,u_j\rangle}{\langle u_j,u_j\rangle}\,u_j\,}\qquad\text{and normalise only at the very end: } w_k = \frac{u_k}{\lVert u_k\rVert}.$$
<p>Everything stays rational until the last line. Plus the <b>scaling trick</b>: you may replace any $u_k$ by a positive multiple (e.g. clear denominators: $(\tfrac{73}{30},-\tfrac56,\tfrac{13}{15})\to(73,-25,26)$) before using it later — directions are all that matter, and normalising removes the scale.</p>
</div>
<div class="box intuition" data-t="What Gram–Schmidt is doing geometrically">
<p>$\dfrac{\langle v,u\rangle}{\langle u,u\rangle}u$ is the <b>shadow</b> (orthogonal projection) of $v$ on the line through $u$. Subtracting every shadow on the previous directions leaves only the part of $v_k$ that is <b>perpendicular</b> to all of them. Then normalising makes it length 1. Watch it happen in 3D in the <a href="#/labs/gs3d">3D Orthogonality Visualizer</a>.</p>
</div>

<div class="box ex" data-t="4.2.15(i) · Gram–Schmidt in ℝ³ (two vectors)">
<p>$A = \{(1,5,2),(3,2,2)\}$, dot product.</p>
<div class="stepper">
<div class="step">$u_1 = v_1 = (1,5,2)$, $\lVert u_1\rVert^2 = 1+25+4 = 30$, so $w_1 = \frac{1}{\sqrt{30}}(1,5,2)$.</div>
<div class="step">$\langle v_2,w_1\rangle w_1 = \frac{1}{30}\big[(3,2,2)\cdot(1,5,2)\big](1,5,2) = \frac{17}{30}(1,5,2)$.</div>
<div class="step">$u_2 = (3,2,2) - \frac{17}{30}(1,5,2) = \big(\frac{73}{30},\,-\frac56,\,\frac{13}{15}\big)$. <b>Check:</b> $\cdot(1,5,2) = \frac{73 - 125 + 52}{30} = 0$ ✔</div>
<div class="step">$\lVert u_2\rVert^2 = \frac{73^2+25^2+26^2}{900} = \frac{6630}{900} = \frac{221}{30}$, so
$$w_2 = \sqrt{\tfrac{30}{221}}\Big(\tfrac{73}{30},-\tfrac56,\tfrac{13}{15}\Big) = \frac{1}{\sqrt{6630}}(73,-25,26).$$</div>
<div class="step">Orthonormal basis of $\spn(A)$: $\Big\{\frac{1}{\sqrt{30}}(1,5,2),\;\frac{1}{\sqrt{6630}}(73,-25,26)\Big\}$. <span class="muted">(Scaling trick: $u_2\parallel(73,-25,26)$, whose norm² is 6630.)</span></div>
</div>
</div>

<div class="box ex" data-t="4.2.15(ii) · Three vectors in ℝ³">
<p>$A = \{(1,0,0),(1,1,2),(0,1,1)\}$.</p>
<div class="stepper">
<div class="step">$u_1 = (1,0,0)$, $w_1 = (1,0,0)$.</div>
<div class="step">$u_2 = (1,1,2) - [(1,1,2)\cdot(1,0,0)](1,0,0) = (0,1,2)$, $\;w_2 = \frac{1}{\sqrt5}(0,1,2)$.</div>
<div class="step">$u_3 = (0,1,1) - 0\cdot w_1 - \frac{1}{5}\big[(0,1,1)\cdot(0,1,2)\big](0,1,2) = (0,1,1) - \frac35(0,1,2) = \big(0,\frac25,-\frac15\big)$.</div>
<div class="step">$\lVert u_3\rVert^2 = \frac{4}{25}+\frac1{25} = \frac15$, so $w_3 = \sqrt5\,(0,\tfrac25,-\tfrac15) = \frac{1}{\sqrt5}(0,2,-1)$. Three orthonormal vectors in $\R^3$ ⇒ $\spn(A) = \R^3$.</div>
</div>
</div>

<div class="box ex" data-t="4.2.15(iii) · Polynomials with a fancy inner product (ℙ₃)">
<p>$\langle p,q\rangle = \int_0^1 p''q''\,dx + 2p(0)q(0) + p(1)q(1)$, $\;p_1 = 1-x^2$, $p_2 = x+x^3$.</p>
<div class="stepper">
<div class="step">$p_1'' = -2$, $p_1(0) = 1$, $p_1(1) = 0$: $\lVert p_1\rVert^2 = \int_0^14\,dx + 2(1)^2 + 0^2 = 6$, so $w_1 = \frac1{\sqrt6}(1-x^2)$.</div>
<div class="step">$p_2'' = 6x$, $p_2(0) = 0$, $p_2(1) = 2$: $\langle p_2,w_1\rangle = \frac{1}{\sqrt6}\Big[\int_0^1(6x)(-2)\,dx + 2(0)(1) + (2)(0)\Big] = \frac{-6}{\sqrt6} = -\sqrt6$.</div>
<div class="step">$u_2 = p_2 - (-\sqrt6)\,w_1 = x+x^3 + (1-x^2) = 1+x-x^2+x^3$.</div>
<div class="step">$u_2'' = 6x-2$, $u_2(0) = 1$, $u_2(1) = 2$: $\lVert u_2\rVert^2 = \int_0^1(6x-2)^2dx + 2(1)^2 + 2^2 = 4 + 6 = 10$, so $w_2 = \frac{1}{\sqrt{10}}(1+x-x^2+x^3)$.</div>
</div>
</div>

<div class="box ex" data-t="4.2.15(iv) · Matrices with a weighted inner product (ℝ^{2×3})">
<p>$\langle A,B\rangle = a_{11}b_{11}+2a_{12}b_{12}+a_{13}b_{13}+3a_{21}b_{21}+a_{22}b_{22}+a_{23}b_{23}$ (weights $\begin{smallmatrix}1&2&1\\3&1&1\end{smallmatrix}$), $\;S = \Big\{\begin{pmatrix}1&0&2\\-1&0&0\end{pmatrix},\begin{pmatrix}0&1&1\\2&0&-2\end{pmatrix}\Big\}$.</p>
<div class="stepper">
<div class="step">$\lVert u_1\rVert^2 = 1^2 + 2(0)^2 + 2^2 + 3(-1)^2 + 0 + 0 = 8$, so $w_1 = \frac{1}{\sqrt8}\begin{pmatrix}1&0&2\\-1&0&0\end{pmatrix}$.</div>
<div class="step">$\langle v_2,u_1\rangle = 0(1) + 2(1)(0) + 1(2) + 3(2)(-1) + 0 + (-2)(0) = -4$.</div>
<div class="step">$u_2 = v_2 - \frac{-4}{8}u_1 = \begin{pmatrix}0&1&1\\2&0&-2\end{pmatrix} + \frac12\begin{pmatrix}1&0&2\\-1&0&0\end{pmatrix} = \frac12\begin{pmatrix}1&2&4\\3&0&-4\end{pmatrix}$.</div>
<div class="step">$\lVert u_2\rVert^2 = \frac14\big[1 + 2(4) + 16 + 3(9) + 0 + 16\big] = \frac{68}{4} = 17$, so $w_2 = \frac{1}{2\sqrt{17}}\begin{pmatrix}1&2&4\\3&0&-4\end{pmatrix}$.</div>
</div>
<p class="small muted">Trick: treat a matrix as a long vector of its entries, with the same weights. The <a href="#/labs/gram-schmidt">Gram–Schmidt Machine</a> supports weights.</p>
</div>

<div class="box ex" data-t="Handout Example 3 · ℝ⁴ (with the corrected final vector)">
<p>$v_1 = (1,1,0,1)$, $v_2 = (0,1,-1,0)$, $v_3 = (0,0,0,1)$ (fraction-friendly version).</p>
<ul><li>$y_1 = (1,1,0,1)$, $\lVert y_1\rVert^2 = 3$.</li>
<li>$y_2 = v_2 - \frac{1}{3}y_1 = \big(-\frac13,\frac23,-1,-\frac13\big)$, $\lVert y_2\rVert^2 = \frac53$.</li>
<li>$y_3 = v_3 - \frac13y_1 - \frac{-1/3}{5/3}y_2 = \big(-\frac25,-\frac15,-\frac15,\frac35\big) = \frac15(-2,-1,-1,3)$, $\lVert y_3\rVert^2 = \frac35$.</li></ul>
$$u_1 = \tfrac{1}{\sqrt3}(1,1,0,1),\quad u_2 = \sqrt{\tfrac35}\big(-\tfrac13,\tfrac23,-1,-\tfrac13\big) = \tfrac{1}{\sqrt{15}}(-1,2,-3,-1),\quad u_3 = \tfrac{1}{\sqrt{15}}(-2,-1,-1,3).$$
<p class="small muted">⚠ The handout's final $u_3$ has norm $\frac13$ (it dropped a factor of 3 when computing $\lVert y_3\rVert$). Always check $\lVert w\rVert = 1$ at the end!</p>
</div>
<div class="box ex" data-t="Handout Example 4 · A plane in ℝ³ (corrected)">
<p>$P = \{(x,y,z): 3x+4y+3z = 0\}$. Basis: $v_1 = (-\frac43,1,0)$, $v_2 = (-1,0,1)$.</p>
<ul><li>$u_1 = \frac{v_1}{\lVert v_1\rVert} = \frac35(-\frac43,1,0) = (-\frac45,\frac35,0)$.</li>
<li>$y_2 = (-1,0,1) - \frac{4/3}{25/9}(-\frac43,1,0) = (-1,0,1) - \frac{12}{25}(-\frac43,1,0) = \big(-\frac{9}{25},-\frac{12}{25},1\big) = \frac{1}{25}(-9,-12,25)$.</li>
<li>$\lVert(-9,-12,25)\rVert^2 = 81+144+625 = 850$, so $u_2 = \frac{1}{\sqrt{850}}(-9,-12,25) = \frac{1}{5\sqrt{34}}(-9,-12,25)$.</li></ul>
<p class="small muted">⚠ The handout writes $\sqrt{81+144+25}$ and ends with $\frac{1}{5\sqrt{10}}(-9,-12,1)$, which is not even in $P$ ($3(-9)+4(-12)+3(1)\ne0$). Sanity check: every $w$ must satisfy the plane's equation.</p>
</div>

<div class="box trap" data-t="Gram–Schmidt mistakes that cost marks">
<ul><li>Projecting onto the <b>original</b> $v_j$ instead of the new $u_j$/$w_j$.</li>
<li>Using $\langle v_k,w_j\rangle w_j$ but forgetting to normalise $w_j$ first (or dividing by $\lVert u_j\rVert$ instead of $\lVert u_j\rVert^2$ in the fraction-friendly formula).</li>
<li>Using the dot product when the question gives a different inner product (weights, integrals!).</li>
<li>Stopping at the orthogonal $u$'s when the question asks for an <b>orthonormal</b> basis.</li></ul>
</div>
<div class="box tip" data-t="Built-in error detectors">
<ul><li>After each step, check $\langle u_k,u_j\rangle = 0$ for all earlier $j$ — it takes seconds and catches 90% of errors.</li>
<li>If some $u_k = 0$, then $v_k$ was a combination of the earlier vectors (the set was dependent).</li>
<li>$w_1$ always points the same way as $v_1$.</li>
<li>Final check: each $\lVert w_k\rVert = 1$.</li></ul>
</div>
<div class="box beyond" data-t="Where Gram–Schmidt leads">
<ul><li><b>Best approximation:</b> if $\{w_1,\dots,w_k\}$ is an orthonormal basis of a subspace $S$, the closest vector in $S$ to $v$ is the projection $\mathrm{proj}_S v = \sum\langle v,w_i\rangle w_i$, and $v - \mathrm{proj}_S v\in S^\perp$ (handout Prop. 4).</li>
<li>Consequently $V = S\oplus S^\perp$ and $\dim S + \dim S^\perp = \dim V$ (links back to direct sums, §2.5).</li>
<li>Gram–Schmidt on the columns of a matrix gives the <b>QR factorisation</b> $A = QR$ — the engine of least-squares data fitting.</li>
<li>Gram–Schmidt on $\{1,x,x^2,\ldots\}$ with $\int_{-1}^1pq$ produces the <b>Legendre polynomials</b> used in physics and numerical integration.</li></ul>
</div>
` },
    ],
    summary: H`
<div class="card glow"><div class="kicker">Chapter 4 on one page</div>
<div class="tbl-wrap"><table class="tbl">
<tr><th>Concept</th><th>Key fact / formula</th><th>How to use it</th></tr>
<tr><td>Inner product</td><td>non-neg · coincidence · symmetry · linearity</td><td>Check all four with general vectors; coincidence is the hard one.</td></tr>
<tr><td>Norm</td><td>$\lVert u\rVert = \sqrt{\langle u,u\rangle}$, $\hat u = u/\lVert u\rVert$</td><td>Work with $\lVert u\rVert^2$; root at the end.</td></tr>
<tr><td>Distance</td><td>$d(u,v) = \lVert u-v\rVert$</td><td>Subtract first, then take the norm.</td></tr>
<tr><td>Angle</td><td>$\cos\theta = \frac{\langle u,v\rangle}{\lVert u\rVert\lVert v\rVert}$</td><td>$\theta\in[0,\pi]$; negative inner product ⇒ obtuse.</td></tr>
<tr><td>Orthogonal</td><td>$\langle u,v\rangle = 0$</td><td>$0$ is orthogonal to everything.</td></tr>
<tr><td>$S^\perp$</td><td>$\{u: \langle u,s\rangle = 0\ \forall s\in S\}$ — always a subspace</td><td>Impose $\langle u,s_i\rangle = 0$ for spanning $s_i$; solve.</td></tr>
<tr><td>Prop 4.2.5</td><td>$V^\perp=\{0\}$, $\{0\}^\perp = V$, $S\subseteq S^{\perp\perp}$, $S\cap S^\perp=\{0\}$, $S\subseteq W\Rightarrow W^\perp\subseteq S^\perp$</td><td>Each proof is 2–3 lines: use coincidence or symmetry.</td></tr>
<tr><td>Pythagoras</td><td>$u\perp v\Rightarrow\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2$</td><td>Expand $\langle u+v,u+v\rangle$.</td></tr>
<tr><td>Cauchy–Schwarz</td><td>$|\langle u,v\rangle|\le\lVert u\rVert\lVert v\rVert$; equality iff dependent</td><td>Expand $\lVert u-tv\rVert^2\ge0$, pick $t = \frac{\langle u,v\rangle}{\lVert v\rVert^2}$.</td></tr>
<tr><td>Triangle</td><td>$\lVert u+v\rVert\le\lVert u\rVert+\lVert v\rVert$</td><td>Square, use C–S.</td></tr>
<tr><td>Orthonormal</td><td>$\langle u_i,u_j\rangle = \delta_{ij}$</td><td>Orthogonal non-zero ⇒ independent. Coordinates $=\langle v,w_i\rangle$.</td></tr>
<tr><td>Gram–Schmidt</td><td>$u_k = v_k - \sum_{j\lt k}\frac{\langle v_k,u_j\rangle}{\langle u_j,u_j\rangle}u_j$, $w_k = \frac{u_k}{\lVert u_k\rVert}$</td><td>Stay rational; scale freely; check orthogonality each step.</td></tr>
</table></div></div>`,
  });
})();
