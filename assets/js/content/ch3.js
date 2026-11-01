/* Chapter 3 — Linear Transformations (coursework chapter: full depth) */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch3", num: 3, title: "Linear Transformations", short: "Linear Transformations", test: true, pages: "29–45", quiz: "ch3",
    blurb: "Functions between vector spaces that respect addition and scaling — plus kernels, ranges, the Rank–Nullity Theorem, isomorphisms and the matrix of a linear map.",
    labs: [["Visualizer", "#/labs/transform"], ["Linearity checker", "#/labs/linearity"], ["Kernel & Range", "#/labs/kernel"], ["Matrix of T", "#/labs/matrix"]],
    goals: [
      "Prove (or disprove) that a given function is a linear transformation — in the exact format markers want.",
      "Reconstruct a linear map from its values on a basis.",
      "Find the kernel and range (with bases and dimensions) and use the Rank–Nullity Theorem.",
      "Decide injective / surjective / non-singular / isomorphism, and prove the key theorems (kernel test, inverse is linear, …).",
      "Build the matrix $[T]_{\\B}^{\\Cc}$ of a linear map relative to any bases and use $[T(v)]_{\\Cc} = [T]_{\\B}^{\\Cc}[v]_{\\B}$.",
    ],
    intro: H`<div class="kicker">The one big idea</div>
<p style="font-size:1.08rem">A <b>linear transformation</b> is a function between vector spaces that <b>respects the two vector-space operations</b>: it does not care whether you add/scale <i>before</i> or <i>after</i> applying it. Everything else in this chapter — kernels, ranges, Rank–Nullity, isomorphisms, matrices — is just a way of understanding such functions.</p>
<p class="muted" style="margin-bottom:0">Read each section once for the idea, then again with a pen. The <b>Recipe</b>, <b>Proof template</b> and <b>Exam trap</b> boxes are the ones that win marks.</p>`,
    sections: [
      /* ------------------------------------------------------------- 3.1 */
      { id: "3.1", title: "Introduction: what makes a map linear", html: H`
<div class="box def" data-t="3.1.1 · Linear transformation">
<p>Let $V$ and $W$ be vector spaces over a field $\FF$. A function $T: V \to W$ is a <b>linear transformation</b> if for all $\alpha \in \FF$ and all $u, v \in V$:</p>
$$T(\alpha u) = \alpha T(u) \qquad\text{and}\qquad T(u+v) = T(u) + T(v).$$
<p>The set of all linear transformations from $V$ to $W$ is written $\Lin(V,W)$. If $V = W$, $T$ is called a <b>linear operator</b> and we write $\Lin(V)$.</p>
</div>

<div class="box intuition" data-t="Read it in plain English">
<ul>
<li><b>Homogeneity</b> $T(\alpha u) = \alpha T(u)$: "scale first, then apply $T$" gives the same as "apply $T$, then scale". Scalars <i>pull out</i>.</li>
<li><b>Additivity</b> $T(u+v) = T(u)+T(v)$: "add first, then apply" equals "apply to each, then add". Sums <i>split</i>.</li>
<li>Geometrically (in $\R^2$): a linear map keeps the origin fixed, sends straight lines to straight lines (or to a single point), and keeps grid lines <b>parallel and evenly spaced</b>. Try it live in the <a href="#/labs/transform">2D Transformation Visualizer</a>.</li>
</ul>
</div>

<div class="box ex" data-t="3.1.2 · The classic examples (from the notes)">
<ol type="i">
<li><b>Identity operator</b> $I: V\to V$, $I(u) = u$: $\;I(\alpha u) = \alpha u = \alpha I(u)$ and $I(u+v) = u+v = I(u)+I(v)$. ✔</li>
<li><b>Zero transformation</b> $\theta: V\to W$, $\theta(u) = 0_W$: $\;\theta(\alpha u) = 0_W = \alpha 0_W = \alpha\theta(u)$ and $\theta(u+v) = 0_W = 0_W+0_W = \theta(u)+\theta(v)$. ✔</li>
<li>$T:\R\to\R$, $T(x) = 4x$: $\;T(\alpha x) = 4\alpha x = \alpha(4x)=\alpha T(x)$, $\;T(x+y) = 4x+4y = T(x)+T(y)$. ✔</li>
<li>$T:\R^2\to\R$, $T(x_1,x_2) = x_1+3x_2$: with $x=(x_1,x_2)$, $y=(y_1,y_2)$,
$$T(\alpha x) = \alpha x_1 + 3\alpha x_2 = \alpha(x_1+3x_2) = \alpha T(x),\quad T(x+y) = (x_1+y_1)+3(x_2+y_2) = T(x)+T(y).\;\checkmark$$</li>
<li>$T:\P_n\to\R$, $T(p) = \int_a^b p(x)\,dx$: integrals pull out constants and split sums, so $T(\alpha p) = \alpha T(p)$ and $T(p+q) = T(p)+T(q)$. ✔</li>
<li>$T:\R\to\R$, $T(x) = 1-x$ is <b>not</b> linear: $T(\alpha x) = 1-\alpha x \ne \alpha(1-x) = \alpha T(x)$ in general (e.g. $\alpha = 0$: $T(0) = 1 \ne 0$). ✘</li>
</ol>
<p class="small muted">Notation: we write $T(x_1,x_2)$ instead of $T((x_1,x_2))$ — one pair of brackets is dropped.</p>
</div>

<div class="box thm" data-t="3.1.3 · The one-line linearity test">
<p>$T \in \Lin(V,W)$ <b>if and only if</b> for all $\alpha,\beta\in\FF$ and $u,v\in V$:
$$T(\alpha u + \beta v) = \alpha T(u) + \beta T(v).$$</p>
</div>
<div class="box proof" data-t="of Theorem 3.1.3 (left as an exercise in the notes — learn this!)">
<p><b>(⇒)</b> Suppose $T$ is linear and let $\alpha,\beta\in\FF$, $u,v\in V$. Then</p>
<div class="pf"><div>$T(\alpha u+\beta v) = T(\alpha u) + T(\beta v)$</div><div class="j">additivity</div>
<div>$\phantom{T(\alpha u+\beta v)} = \alpha T(u) + \beta T(v)$</div><div class="j">homogeneity (twice)</div></div>
<p><b>(⇐)</b> Suppose $T(\alpha u + \beta v) = \alpha T(u) + \beta T(v)$ for all $\alpha,\beta,u,v$.</p>
<ul><li>Take $\alpha=\beta=1$: $T(u+v) = T(u)+T(v)$ — additivity.</li>
<li>Take $\beta = 0$: $T(\alpha u) = T(\alpha u + 0v) = \alpha T(u) + 0\,T(v) = \alpha T(u)$ — homogeneity.</li></ul>
<p>Hence $T$ is linear.</p>
</div>

<div class="box template" data-t="How to PROVE a map is linear (copy this layout)">
<p><b>Claim.</b> $T: V\to W$, $T(\ldots) = \ldots$ is a linear transformation.</p>
<p><b>Proof.</b> Let $\alpha,\beta\in\R$ and $u = (u_1,\dots,u_n),\; v = (v_1,\dots,v_n) \in V$. <i>(Name general elements — never use specific numbers to prove linearity.)</i></p>
<p>Then $\alpha u + \beta v = (\alpha u_1+\beta v_1, \dots, \alpha u_n + \beta v_n)$, so</p>
$$\begin{aligned} T(\alpha u+\beta v) &= \text{(substitute the components into the formula)}\\ &= \text{(expand and regroup into an $\alpha$-part and a $\beta$-part)}\\ &= \alpha\,(\text{formula at } u) + \beta\,(\text{formula at } v)\\ &= \alpha T(u) + \beta T(v).\end{aligned}$$
<p>Therefore, by Theorem 3.1.3, $T\in\Lin(V,W)$. $\square$</p>
<p class="small muted">Two-condition version: prove $T(\alpha u) = \alpha T(u)$ and $T(u+v)=T(u)+T(v)$ separately using the same layout. Both versions earn full marks — the one-line test is shorter.</p>
</div>

<div class="box prop" data-t="3.1.4 · Linear maps send 0 to 0">
<p>If $T\in\Lin(V,W)$, then $T(0_V) = 0_W$.</p>
</div>
<div class="box proof" data-t="of Proposition 3.1.4">
<p>Since $0_V = 0_V + 0_V$, we get $T(0_V) = T(0_V+0_V) = T(0_V) + T(0_V)$. Adding $-T(0_V)$ to both sides (it exists since $T(0_V)\in W$) gives $T(0_V) = 0_W$.</p>
<p class="small muted">Even faster: $T(0_V) = T(0\cdot 0_V) = 0\cdot T(0_V) = 0_W$, using homogeneity with $\alpha=0$ and Theorem 2.1.7(ii).</p>
</div>
<p class="small muted">Remark 3.1.5: by convention we just write $0$ for the zero vector of both the domain and the codomain.</p>

<div class="box tip" data-t="The 2-second disproof: check T(0) first">
<p>Before anything else, compute $T(0)$. If $T(0)\neq 0$, the map is <b>not</b> linear — done, by Proposition 3.1.4. Examples: $T(x) = 1-x$ gives $T(0)=1$; $g(x) = (x,2x+1)$ gives $g(0) = (0,1)$; $\alpha(a_1,a_2) = a_1 + x + a_2x^2$ gives $\alpha(0,0) = x \ne 0$.</p>
</div>
<div class="box trap" data-t="T(0) = 0 does NOT prove linearity">
<p>$T(0) = 0$ is <b>necessary but not sufficient</b>. For example $T(x,y) = (xy, 0)$ has $T(0,0) = (0,0)$, yet</p>
$$T\big(2(1,1)\big) = T(2,2) = (4,0) \;\ne\; (2,0) = 2\,T(1,1).$$
<p>Likewise $f(x)=|x|$ and $f(x) = x^2$ fix $0$ but are not linear. To <b>disprove</b> linearity you need <b>one specific counterexample with actual numbers</b>.</p>
</div>

<div class="box template" data-t="How to DISPROVE linearity (full-marks format)">
<p><b>Claim.</b> $f:\R\to\R$, $f(x) = |x|$ is not linear.</p>
<p><b>Proof.</b> Take $\alpha = -1$ and $x = 1$. Then $f(\alpha x) = f(-1) = |-1| = 1$, but $\alpha f(x) = -1\cdot|1| = -1$. Since $f(\alpha x)\neq\alpha f(x)$, $f$ is not a linear transformation. $\square$</p>
<p class="small muted">Good counterexample hunting: try $\alpha=-1$ or $\alpha = 2$ with a simple vector like $(1,0)$ or $(1,1)$; for squares/products, $\alpha=2$ almost always works; for absolute values, $\alpha = -1$. The <a href="#/labs/linearity">Linearity Checker</a> finds counterexamples automatically.</p>
</div>

<div class="box thm" data-t="3.1.6 · A linear map is determined by its values on a basis">
<p>Let $V$ be finite-dimensional with basis $\{u_1,\dots,u_n\}$ and $T\in\Lin(V,W)$. If $T(u_1),\dots,T(u_n)$ are known, then $T$ is known.</p>
</div>
<div class="box proof" data-t="of Theorem 3.1.6">
<p>Let $u\in V$. Since $\{u_1,\dots,u_n\}$ is a basis, there are scalars $a_1,\dots,a_n$ with $u = a_1u_1+\dots+a_nu_n$. By linearity,
$$T(u) = T(a_1u_1+\dots+a_nu_n) = a_1T(u_1)+\dots+a_nT(u_n),$$
which is known because each $T(u_i)$ is known.</p>
</div>
<div class="box intuition" data-t="Why this is powerful">
<p>A basis is a complete list of "ingredients". Once you know what $T$ does to each ingredient, linearity tells you what it does to every mixture of them. So a linear map on an $n$-dimensional space is pinned down by just $n$ vectors.</p>
</div>

<div class="box ex" data-t="3.1.7 · Reconstructing T from a basis (worked)">
<p>$\{(1,0,-1),(1,1,0),(0,1,0)\}$ is a basis of $\R^3$ and $T:\R^3\to\R$ is linear with $T(1,0,-1)=1$, $T(1,1,0)=-1$, $T(0,1,0)=4$. Find $T(x,y,z)$.</p>
<div class="stepper">
<div class="step"><b>Step 1 — write a general vector in the basis.</b> Let $(x,y,z) = a_1(1,0,-1)+a_2(1,1,0)+a_3(0,1,0) = (a_1+a_2,\; a_2+a_3,\; -a_1)$.</div>
<div class="step"><b>Step 2 — solve for the coefficients.</b> Comparing components: $x = a_1+a_2$, $y = a_2+a_3$, $z=-a_1$. So
$$a_1 = -z,\qquad a_2 = x - a_1 = x+z,\qquad a_3 = y - a_2 = y-x-z.$$</div>
<div class="step"><b>Step 3 — apply linearity.</b>
$$\begin{aligned}T(x,y,z) &= a_1T(1,0,-1)+a_2T(1,1,0)+a_3T(0,1,0)\\ &= (-z)(1) + (x+z)(-1) + (y-x-z)(4)\\ &= -z - x - z + 4y - 4x - 4z\\ &= -5x+4y-6z.\end{aligned}$$</div>
<div class="step"><b>Step 4 — check (10 seconds, saves marks).</b> $T(1,0,-1) = -5+6 = 1$ ✔, $\;T(1,1,0) = -5+4 = -1$ ✔, $\;T(0,1,0) = 4$ ✔. So $\boxed{T(x,y,z) = -5x+4y-6z}$.</div>
</div>
</div>

<div class="box recipe" data-t="Find T from its values on a basis">
<ol class="recipe-steps">
<li>Write a general vector as a combination of the given basis: $v = a_1b_1+\dots+a_nb_n$.</li>
<li>Solve for $a_1,\dots,a_n$ in terms of the coordinates of $v$ (row-reduce if needed).</li>
<li>Use linearity: $T(v) = a_1T(b_1)+\dots+a_nT(b_n)$; substitute and simplify.</li>
<li>Check by plugging each basis vector back in.</li>
</ol>
<p class="small muted">Special case: if the basis is the <b>standard</b> basis, step 2 is free ($a_i$ = coordinates). E.g. Exercise 3.1 Q2(ii): $T(a,b,c) = aT(e_1)+bT(e_2)+cT(e_3)$ immediately.</p>
</div>

<div class="box beyond" data-t="Matrix shortcut for maps ℝⁿ → ℝᵐ">
<p>Put the basis vectors as columns of $B$ and their images as columns of $Y$. Then the standard matrix of $T$ is $A = YB^{-1}$, and $T(v) = Av$. For Example 3.1.7, $Y = (1\;\;{-1}\;\;4)$ and you get $A = (-5\;\;4\;\;{-6})$ — the same answer. Use it to <b>check</b> your hand computation.</p>
</div>
` },

      /* ------------------------------------------------------------- 3.2 */
      { id: "3.2", title: "Kernel, range and the Rank–Nullity Theorem", html: H`
<div class="box thm" data-t="3.2.1 · Linear maps preserve dependence">
<p>If $S = \{u_1,\dots,u_n\}\subseteq V$ is linearly dependent and $T\in\Lin(V,W)$, then $T(S) = \{T(u_1),\dots,T(u_n)\}$ is linearly dependent.</p>
</div>
<div class="box proof" data-t="of Theorem 3.2.1">
<p>Since $S$ is dependent, there are $a_1,\dots,a_n$, <b>not all zero</b>, with $a_1u_1+\dots+a_nu_n = 0$. Apply $T$:</p>
$$a_1T(u_1)+\dots+a_nT(u_n) = T(a_1u_1+\dots+a_nu_n) = T(0) = 0.$$
<p>The same not-all-zero scalars give a non-trivial combination of the $T(u_i)$ equal to $0$, so $T(S)$ is dependent.</p>
</div>
<div class="box cor" data-t="3.2.2 · Independent images force independent originals">
<p>If $T(S)$ is linearly independent, then $S$ is linearly independent.</p>
<p class="small"><b>Proof.</b> This is the <b>contrapositive</b> of Theorem 3.2.1: "$S$ dependent ⇒ $T(S)$ dependent" is logically equivalent to "$T(S)$ independent ⇒ $S$ independent". $\square$</p>
</div>
<div class="box trap" data-t="The converse is FALSE">
<p>Linear maps can <b>destroy</b> independence: the zero map sends the independent set $\{(1,0),(0,1)\}$ to $\{0\}$, which is dependent. Independence is preserved exactly when $T$ is injective (Theorem 3.3.6).</p>
</div>

<div class="box def" data-t="3.2.3 · Range and kernel">
<p>For $T\in\Lin(V,W)$:</p>
<ul><li>the <b>range</b> (image) of $T$ is $\;T(V) = \Ran(T) = \{T(u) : u\in V\}\subseteq W$;</li>
<li>the <b>kernel</b> (null space) of $T$ is $\;\ker(T) = \Null(T) = \{u\in V : T(u) = 0\}\subseteq V$.</li></ul>
</div>
<div class="box intuition" data-t="Picture it">
<p>The <b>kernel</b> is everything $T$ <i>crushes to zero</i> — it lives in the <b>domain</b>. The <b>range</b> is everything $T$ <i>can reach</i> — it lives in the <b>codomain</b>. A big kernel means $T$ loses a lot of information; a big range means $T$ covers a lot of $W$.</p>
</div>

<div class="box thm" data-t="3.2.4 · Kernel and range are subspaces">
<p>(i) $T(V)$ is a subspace of $W$. &nbsp; (ii) $\ker(T)$ is a subspace of $V$.</p>
</div>
<div class="box proof" data-t="of Theorem 3.2.4">
<p><b>(i)</b> $T(0) = 0$, so $0\in T(V)$ and $T(V)\ne\emptyset$. Let $\alpha,\beta\in\FF$ and $x,y\in T(V)$. Then $x = T(u)$, $y = T(v)$ for some $u,v\in V$, and $\alpha u+\beta v\in V$ because $V$ is a vector space. Hence
$$\alpha x + \beta y = \alpha T(u)+\beta T(v) = T(\alpha u+\beta v)\in T(V).$$
By Theorem 2.2.3, $T(V)$ is a subspace of $W$.</p>
<p><b>(ii)</b> <i>(Exercise in the notes.)</i> $T(0) = 0$, so $0\in\ker(T)$ and $\ker(T)\neq\emptyset$. Let $\alpha,\beta\in\FF$ and $u,v\in\ker(T)$, so $T(u) = T(v) = 0$. Then
$$T(\alpha u + \beta v) = \alpha T(u)+\beta T(v) = \alpha 0 + \beta 0 = 0,$$
so $\alpha u+\beta v\in\ker(T)$. By Theorem 2.2.3, $\ker(T)$ is a subspace of $V$.</p>
</div>

<div class="box ex" data-t="3.2.5 · Kernels and ranges in action">
<ol type="i">
<li>$T:\R\to\R$, $T(x) = 3x$: $\Ran(T) = \{3x : x\in\R\} = \R$ (every $y$ is $T(y/3)$); $\ker(T) = \{x : 3x = 0\} = \{0\}$.</li>
<li>$T:\R\to\R^2$, $T(x) = (x,4x)$: $\Ran(T) = \{(x,4x):x\in\R\}$ (a line through the origin); $\ker(T) = \{x : (x,4x) = (0,0)\} = \{0\}$.</li>
<li>$T:\R^2\to\R$, $T(x,y) = x+y$: $\Ran(T) = \R$; $\ker(T) = \{(x,y): x+y=0\} = \{(x,-x) : x\in\R\}$.</li>
</ol>
</div>

<div class="box thm" data-t="3.2.6 · The kernel test for injectivity">
<p>$\ker(T) = \{0\}$ <b>if and only if</b> $T$ is injective (one-to-one).</p>
</div>
<div class="box proof" data-t="of Theorem 3.2.6 (a favourite exam proof)">
<p><b>(⇒)</b> Suppose $\ker(T) = \{0\}$ and let $u,v\in V$ with $T(u) = T(v)$. Then
$$T(u-v) = T(u)-T(v) = 0 \;\Rightarrow\; u-v\in\ker(T) = \{0\} \;\Rightarrow\; u = v.$$
So $T$ is injective.</p>
<p><b>(⇐)</b> Suppose $T$ is injective and let $u\in\ker(T)$. Then $T(u) = 0 = T(0)$, and injectivity gives $u = 0$. So $\ker(T)\subseteq\{0\}$; and $0\in\ker(T)$ always. Hence $\ker(T) = \{0\}$.</p>
</div>
<div class="box tip" data-t="Use the kernel test instead of the definition">
<p>To show a linear map is injective, <b>don't</b> chase $T(u)=T(v)\Rightarrow u=v$. Just solve $T(v) = 0$ and show the only solution is $v=0$. It is shorter and it is exactly what markers expect.</p>
</div>

<div class="box thm" data-t="3.2.7 · Size limits on kernel and range">
<p>If $V$ is finite-dimensional, then (i) $\dim\ker(T)\le\dim V$; (ii) $\dim\Ran(T)$ is finite, and if $\dim W$ is finite then $\dim\Ran(T)\le\dim W$, with $\Ran(T) = W$ when equality holds.</p>
</div>
<div class="box proof" data-t="of Theorem 3.2.7 (exercise in the notes)">
<p>(i) $\ker(T)$ is a subspace of $V$, and a subspace of a finite-dimensional space has dimension at most that of the space (a basis of the subspace is an independent set in $V$, so it extends to a basis of $V$ — Theorem 2.4.13).</p>
<p>(ii) If $\{v_1,\dots,v_n\}$ is a basis of $V$, then every $T(v) = T(\sum a_iv_i) = \sum a_iT(v_i)$, so $\Ran(T) = \spn\{T(v_1),\dots,T(v_n)\}$ — spanned by $n$ vectors, hence $\dim\Ran(T)\le n$ is finite. As a subspace of $W$, $\dim\Ran(T)\le\dim W$. If $\dim\Ran(T) = \dim W$, a basis of $\Ran(T)$ is $\dim W$ independent vectors in $W$, hence a basis of $W$, so $\Ran(T) = W$ (Exercise 2.4 Q5).</p>
</div>

<div class="box def" data-t="3.2.8 · Rank and nullity">
<p>$\Rank(T) = \dim(\Ran(T))$ and $\Nullity(T) = \dim(\Null(T))$.</p>
</div>
<div class="box thm" data-t="3.2.9 · The Rank–Nullity Theorem ★">
<p>If $T\in\Lin(V,W)$ and $\dim V$ is finite, then
$$\boxed{\;\Rank(T) + \Nullity(T) = \dim(V)\;}$$</p>
<p class="small muted">Note: it is the dimension of the <b>domain</b> $V$ — never the codomain.</p>
</div>
<div class="box beyond" data-t="Why Rank–Nullity is true (proof omitted in the notes)">
<p>Take a basis $\{k_1,\dots,k_r\}$ of $\ker T$ and extend it to a basis $\{k_1,\dots,k_r,v_1,\dots,v_s\}$ of $V$ (so $r+s = \dim V$). Then:</p>
<ul><li>$\Ran T = \spn\{T(k_i),T(v_j)\} = \spn\{T(v_1),\dots,T(v_s)\}$ since every $T(k_i)=0$.</li>
<li>$\{T(v_1),\dots,T(v_s)\}$ is independent: if $\sum c_jT(v_j) = 0$ then $\sum c_jv_j\in\ker T$, so $\sum c_jv_j = \sum d_ik_i$; independence of the big basis forces all $c_j = 0$.</li></ul>
<p>So $\Rank T = s$ and $\Nullity T = r$, giving $r+s=\dim V$. <b>Moral:</b> every dimension of the domain either gets crushed (kernel) or survives into the range.</p>
</div>

<div class="box ex" data-t="3.2.10 · Rank–Nullity worked examples">
<p><b>(i)</b> $T:\R^3\to\R$, $T(x,y,z) = x-3y+5z$.</p>
<p>$\Null(T) = \{(x,y,z): x-3y+5z = 0\} = \{(3y-5z,\,y,\,z): y,z\in\R\} = \spn\{(3,1,0),(-5,0,1)\}$.<br>
$\Ran(T) = \{x-3y+5z : x,y,z\in\R\} = \R$, so $\Rank(T) = 1$ and Rank–Nullity gives $\Nullity(T) = 3-1 = 2$ — matching the two basis vectors above.</p>
<p><b>(ii)</b> $T:\P_1\to\R$, $T(p) = \int_0^1 p(x)\,dx$. For $p(x) = a_0 + a_1x$:
$$T(p) = \Big[a_0x + \tfrac{a_1x^2}{2}\Big]_0^1 = a_0 + \tfrac{a_1}{2}.$$
$\Null(T) = \{a_0+a_1x : a_1 = -2a_0\} = \{a_0(1-2x): a_0\in\R\} = \spn\{1-2x\}$, and $\Ran(T) = \R$. So $\Rank = 1$, $\Nullity = \dim\P_1 - 1 = 2-1 = 1$. ✔</p>
<p><b>(iii)</b> $T:\P_2\to\P_2$, $T(p) = p'' - p' + p$. For $p = a_0+a_1x+a_2x^2$:
$$T(p) = 2a_2 - (a_1+2a_2x) + (a_0+a_1x+a_2x^2) = (a_0 - a_1 + 2a_2) + (a_1 - 2a_2)x + a_2x^2.$$
<p class="small muted">⚠ The notes print the $x$-coefficient as $(2a_2+a_1)$; it should be $(a_1-2a_2)$. The conclusion is unaffected.</p>
$T(p) = 0$ forces $a_2 = 0$, then $a_1 = 0$, then $a_0 = 0$. So $\Null(T) = \{0\}$, $\Nullity = 0$, and $\Rank = 3 - 0 = 3$. Since $\Ran(T)$ is a subspace of $\P_2$ with the same dimension, $\Ran(T) = \P_2$.</p>
</div>

<div class="box recipe" data-t="Kernel, range, bases, dimensions — the full routine">
<ol class="recipe-steps">
<li><b>Kernel:</b> set $T(v) = 0$, write the resulting homogeneous equations, solve (row-reduce). Express the solution with free parameters: $\ker T = \{s\,u_1 + t\,u_2 : s,t\in\R\} = \spn\{u_1,u_2\}$. The vectors multiplying the parameters form a <b>basis</b> (they are automatically independent). $\Nullity$ = number of free parameters.</li>
<li><b>Range:</b> $\Ran T = \spn\{T(b_1),\dots,T(b_n)\}$ for any basis $\{b_i\}$ of $V$ (use the standard basis). Remove dependent vectors (row-reduce) to get a basis. $\Rank$ = number left.</li>
<li><b>Check with Rank–Nullity:</b> $\Rank + \Nullity = \dim V$. If it fails, you made an arithmetic error.</li>
<li><b>Conclude</b> injective ($\Nullity = 0$) / surjective ($\Rank = \dim W$) as asked.</li>
</ol>
<p class="small muted">Shortcut: if you only need dimensions, find whichever is easier and get the other from Rank–Nullity — like Example 3.2.10(i) where $\Rank = 1$ is obvious.</p>
</div>
<div class="box tip" data-t="Matrix method for maps ℝⁿ → ℝᵐ">
<p>Write the coefficients of $T$ as a matrix $A$ (one row per output component). Then $\ker T = \Null(A)$, $\Ran T = \CS(A)$ (column space) and $\Rank T = \Rank A$. Row-reduce $A$ <b>once</b>: the free columns give the kernel; the pivot columns of the <b>original</b> $A$ give a basis of the range. Try it in the <a href="#/labs/kernel">Kernel · Range lab</a>.</p>
</div>

<div class="box exam" data-t="Dimension facts you can quote instantly">
<div class="tbl-wrap"><table class="tbl"><tr><th>Situation</th><th>Conclusion</th><th>Why</th></tr>
<tr><td>$\dim V > \dim W$</td><td>$T$ is <b>not injective</b></td><td>$\Nullity = \dim V - \Rank \ge \dim V-\dim W > 0$</td></tr>
<tr><td>$\dim V \lt \dim W$</td><td>$T$ is <b>not surjective</b></td><td>$\Rank \le \dim V \lt \dim W$</td></tr>
<tr><td>$\dim V = \dim W$</td><td>injective ⇔ surjective ⇔ bijective</td><td>$\Nullity = 0 \iff \Rank = \dim V = \dim W$</td></tr>
</table></div>
</div>
<div class="box trap" data-t="Common mark-losers here">
<ul><li>Writing $\ker T$ as a subset of $W$ — it is a subset of the <b>domain</b> $V$.</li>
<li>Giving a "basis" of the kernel that includes $0$, or giving $\{0\}$ a basis — $\{0\}$ has dimension 0 and its basis is $\emptyset$.</li>
<li>Saying "$\Ran T = \R$" without justification — show it, e.g. "$T(y,0,0) = y$ for every $y$".</li>
<li>Using $\dim W$ in Rank–Nullity instead of $\dim V$.</li></ul>
</div>
` },

      /* ------------------------------------------------------------- 3.3 */
      { id: "3.3", title: "Algebra of linear maps, inverses and isomorphisms", html: H`
<div class="box def" data-t="3.3.1 · Adding and scaling linear maps">
<p>For $S,T\in\Lin(V,W)$ and $\alpha\in\FF$: $\;(S+T)(u) = S(u)+T(u)\;$ and $\;(\alpha T)(u) = \alpha T(u)$ for all $u\in V$.</p>
</div>
<div class="box thm" data-t="3.3.2 · ℒ(V,W) is itself a vector space">
<p>With these operations $\Lin(V,W)$ is a vector space over $\FF$, and
$$\dim\Lin(V,W) = \dim(V)\cdot\dim(W).$$</p>
</div>
<div class="box intuition" data-t="Why the dimension multiplies">
<p>Once bases are fixed, each $T\in\Lin(V,W)$ corresponds to exactly one $m\times n$ matrix ($n=\dim V$, $m=\dim W$) — see §3.4. The space of $m\times n$ matrices has $mn$ entries to choose, so dimension $mn$.</p>
</div>
<div class="box ex" data-t="3.3.3 · Dimension counts">
<p>(i) $\dim\Lin(\R^m,\R^n) = mn$. &nbsp; (ii) $\dim\Lin(\P_m,\P_n) = (m+1)(n+1)$. &nbsp; (iii) $\dim\Lin(\spn\{\sin x,\cos x\},\R^2) = 2\cdot 2 = 4$.</p>
<p class="small muted">Trap: $\dim\P_n = n+1$, not $n$.</p>
</div>

<div class="box thm" data-t="3.3.4 · The inverse of a bijective linear map is linear">
<p>Let $T\in\Lin(V,W)$ be bijective. (i) For each $w\in W$, exactly one $v\in V$ satisfies $T(v) = w$. (ii) $T^{-1}\in\Lin(W,V)$, where $T^{-1}(w) = v$ whenever $T(v) = w$.</p>
</div>
<div class="box proof" data-t="of Theorem 3.3.4">
<p><b>(i)</b> Let $w\in W$. Since $T$ is onto, some $v\in V$ has $T(v) = w$. If also $T(v_2) = w$, then $T(v) = T(v_2)$ and injectivity gives $v = v_2$. So exactly one vector maps to $w$.</p>
<p><b>(ii)</b> Let $w_1,w_2\in W$ and $\alpha_1,\alpha_2\in\FF$. By (i) there are unique $v_1,v_2$ with $T(v_1) = w_1$, $T(v_2) = w_2$, i.e. $T^{-1}(w_i) = v_i$. By linearity of $T$,
$$T(\alpha_1v_1+\alpha_2v_2) = \alpha_1w_1+\alpha_2w_2 \;\Rightarrow\; T^{-1}(\alpha_1w_1+\alpha_2w_2) = \alpha_1v_1+\alpha_2v_2 = \alpha_1T^{-1}(w_1)+\alpha_2T^{-1}(w_2).$$
So $T^{-1}$ is linear.</p>
</div>
<div class="box tip" data-t="Finding T⁻¹ explicitly">
<p>Set $T(x,y) = (u,v)$ and solve for $x,y$ in terms of $u,v$. Example: $f(x,y) = (x+y,\,x-y)$. From $u = x+y$, $v=x-y$: $x = \frac{u+v}{2}$, $y = \frac{u-v}{2}$, so $f^{-1}(u,v) = \big(\frac{u+v}{2},\frac{u-v}{2}\big)$. Check: $f(f^{-1}(u,v)) = (u,v)$ ✔.</p>
</div>

<div class="box def" data-t="3.3.5 · Singular and non-singular maps">
<p>$T\in\Lin(V,W)$ is <b>singular</b> if some $v\neq0$ has $T(v) = 0$ (i.e. $\ker T\ne\{0\}$). Otherwise $T$ is <b>non-singular</b> ($\ker T = \{0\}$).</p>
</div>
<div class="box thm" data-t="3.3.6 · Non-singular ⇔ injective ⇔ preserves independence">
<p>For $T\in\Lin(V,W)$ the following are equivalent: (i) $T$ is non-singular; (ii) $T$ is injective; (iii) if $S = \{u_1,\dots,u_n\}\subseteq V$ is linearly independent then $T(S)$ is linearly independent.</p>
</div>
<div class="box proof" data-t="of Theorem 3.3.6 (cycle of implications)">
<p><b>(i)⇒(ii)</b> Let $T(v_1) = T(v_2)$. Then $T(v_1-v_2) = 0$. Non-singular means $v\ne0\Rightarrow T(v)\ne0$, so $v_1-v_2 = 0$, i.e. $v_1=v_2$.</p>
<p><b>(ii)⇒(iii)</b> Let $S$ be independent and suppose $a_1T(u_1)+\dots+a_nT(u_n) = 0$. Then $T(a_1u_1+\dots+a_nu_n) = 0 = T(0)$; injectivity gives $a_1u_1+\dots+a_nu_n = 0$, and independence of $S$ gives all $a_i = 0$. So $T(S)$ is independent.</p>
<p><b>(iii)⇒(i)</b> (contradiction) Suppose (iii) holds but $T$ is singular: some $v\ne 0$ has $T(v) = 0$. Then $S = \{v\}$ is independent but $T(S) = \{0\}$ is dependent — contradicting (iii).</p>
<p class="small muted">Structure tip: to prove "(i), (ii), (iii) are equivalent" you only need the cycle (i)⇒(ii)⇒(iii)⇒(i).</p>
</div>

<div class="box def" data-t="3.3.7 · Isomorphism">
<p>$T\in\Lin(V,W)$ is an <b>isomorphism</b> if $T$ is bijective. $V$ and $W$ are <b>isomorphic</b>, $V\cong W$, if an isomorphism $V\to W$ exists.</p>
</div>
<div class="box thm" data-t="3.3.8 · Every n-dimensional space is a copy of 𝔽ⁿ">
<p>If $\dim V = n$ then $V\cong\FF^n$.</p>
</div>
<div class="box proof" data-t="of Theorem 3.3.8 (exercise in the notes)">
<p>Fix a basis $\B = \{v_1,\dots,v_n\}$ of $V$ and define the <b>coordinate map</b> $\varphi: V\to\FF^n$, $\varphi(v) = [v]_{\B}$, i.e. $\varphi(a_1v_1+\dots+a_nv_n) = (a_1,\dots,a_n)$. It is well defined because coordinates are unique (Prop. 2.4.8).</p>
<ul><li><b>Linear:</b> if $v = \sum a_iv_i$ and $w = \sum b_iv_i$ then $\alpha v+\beta w = \sum(\alpha a_i+\beta b_i)v_i$, so $\varphi(\alpha v+\beta w) = \alpha\varphi(v)+\beta\varphi(w)$.</li>
<li><b>Injective:</b> $\varphi(v) = 0 \Rightarrow$ all $a_i = 0 \Rightarrow v = 0$, so $\ker\varphi = \{0\}$.</li>
<li><b>Surjective:</b> any $(a_1,\dots,a_n)$ equals $\varphi(a_1v_1+\dots+a_nv_n)$.</li></ul>
<p>Hence $\varphi$ is an isomorphism and $V\cong\FF^n$.</p>
</div>
<div class="box ex" data-t="3.3.9 · Isomorphic pairs (with the actual isomorphisms)">
<ol type="i">
<li>$\P_n\cong\R^{n+1}$ via $a_0+a_1x+\dots+a_nx^n\mapsto(a_0,a_1,\dots,a_n)$.</li>
<li>$\R^{n\times n}\cong\R^{n^2}$ via "read the entries row by row".</li>
<li>$\spn\{\sin x,\cos x\}\cong\P_1$ via $a\sin x + b\cos x\mapsto a + bx$ (both have dimension 2).</li>
</ol>
<p>Moral: <b>all real $n$-dimensional spaces are "essentially $\R^n$"</b> — this is why matrix methods work for polynomials, matrices and functions too.</p>
</div>
<div class="box tip" data-t="Fastest way to prove an isomorphism">
<p>If $\dim V = \dim W$ is finite, an injective linear map is automatically surjective (Rank–Nullity). So: <b>show it is linear, show $\ker T = \{0\}$, quote $\dim V = \dim W$ — done.</b></p>
</div>

<div class="box thm" data-t="Composition of linear maps is linear (Exercise 3.3 Q3)">
<p>If $f\in\Lin(U,V)$ and $g\in\Lin(V,W)$ then $g\circ f\in\Lin(U,W)$. Moreover, if $f$ is singular then $g\circ f$ is singular.</p>
</div>
<div class="box proof" data-t="of the composition facts">
<p>For $\alpha,\beta\in\FF$, $u,v\in U$:
$$(g\circ f)(\alpha u+\beta v) = g\big(f(\alpha u + \beta v)\big) = g\big(\alpha f(u)+\beta f(v)\big) = \alpha g(f(u)) + \beta g(f(v)) = \alpha(g\circ f)(u)+\beta(g\circ f)(v).$$
If $f$ is singular, pick $u\ne0$ with $f(u) = 0$. Then $(g\circ f)(u) = g(0) = 0$ with $u\ne 0$, so $g\circ f$ is singular. (Only $f$ needs to be singular!)</p>
</div>

<div class="box trap" data-t="Exercise 3.3 Q1 is mis-stated in the notes">
<p>As printed — "if $\dim V\ge\dim W$ then $T$ is onto" and "if $\dim V\le\dim W$ then $T$ is one-one" — both are <b>false</b>: the zero map $\theta:\R^2\to\R$ is not onto, and $\theta:\R\to\R^2$ is not one-one. The <b>true</b> statements (the converses) are:</p>
<ul><li>If $T$ is <b>onto</b>, then $\dim V\ge\dim W$. <i>Proof:</i> onto means $\Rank T = \dim W$; by Rank–Nullity $\Rank T = \dim V - \Nullity T\le\dim V$.</li>
<li>If $T$ is <b>one-one</b>, then $\dim V\le\dim W$. <i>Proof:</i> one-one means $\Nullity T = 0$, so $\dim V = \Rank T = \dim\Ran T\le\dim W$ since $\Ran T\subseteq W$.</li></ul>
<p>If a question like this appears, prove the correct version and briefly note the counterexample.</p>
</div>
` },

      /* ------------------------------------------------------------- 3.4 */
      { id: "3.4", title: "The matrix of a linear transformation", html: H`
<div class="box def" data-t="3.4.1 · The matrix of T relative to ordered bases">
<p>Let $\B = \{v_1,\dots,v_n\}$ and $\Cc = \{w_1,\dots,w_m\}$ be ordered bases of $V$ and $W$, and $T\in\Lin(V,W)$. The matrix $[T]^{\Cc}_{\B}$ is the $m\times n$ matrix whose $i$-th <b>column</b> is the coordinate vector $[T(v_i)]_{\Cc}$:
$$[T]^{\Cc}_{\B} = \Big(\,[T(v_1)]_{\Cc}\;\Big|\;[T(v_2)]_{\Cc}\;\Big|\;\cdots\;\Big|\;[T(v_n)]_{\Cc}\,\Big).$$
If $V = W$ and $\B = \Cc$ we write $[T]_{\B}$.</p>
</div>
<div class="box intuition" data-t="Mnemonic: “images of the domain basis, in codomain coordinates, become the columns”">
<ul><li><b>Columns ↔ domain basis</b> ($n = \dim V$ columns). <b>Rows ↔ codomain coordinates</b> ($m = \dim W$ rows).</li>
<li>Bottom index $\B$ = where you <b>start</b>; top index $\Cc$ = where you <b>land</b>.</li>
<li>Order matters: reordering a basis permutes columns (or rows) — always keep the order given.</li></ul>
</div>

<div class="box ex" data-t="3.4.2(i) · ℝ³ → ℝ² with non-standard bases">
<p>$\B = \{(1,0,-2),(0,0,1),(0,1,0)\}$, $\Cc = \{(0,1),(1,0)\}$, $T(x_1,x_2,x_3) = (x_2-3x_1+x_3,\;x_1+x_2)$.</p>
<div class="stepper">
<div class="step"><b>Image of each domain basis vector:</b>
$$T(1,0,-2) = (-5,1),\quad T(0,0,1) = (1,0),\quad T(0,1,0) = (1,1).$$</div>
<div class="step"><b>Write each image in the codomain basis</b> $\Cc = \{(0,1),(1,0)\}$ — careful, $(0,1)$ comes first:
$$(-5,1) = 1(0,1) - 5(1,0),\quad (1,0) = 0(0,1)+1(1,0),\quad (1,1) = 1(0,1)+1(1,0).$$</div>
<div class="step"><b>Coordinates become columns:</b> $[T(1,0,-2)]_{\Cc} = (1,-5)^T$, $[T(0,0,1)]_{\Cc} = (0,1)^T$, $[T(0,1,0)]_{\Cc} = (1,1)^T$, so
$$[T]^{\Cc}_{\B} = \begin{pmatrix}1&0&1\\-5&1&1\end{pmatrix}.$$</div>
</div>
</div>

<div class="box ex" data-t="3.4.2(ii) · Polynomial spaces ℙ₂ → ℙ₃">
<p>$B_1 = \{1-x,\;x+x^2,\;x^2\}$, $B_2 = \{1,\;x^3,\;x^2,\;2x\}$ (note the unusual order!), $f(p) = p(0)\,\frac{dp}{dx} + 4xp$.</p>
$$\begin{aligned} f(1-x) &= 1\cdot(-1) + 4x(1-x) = -1+4x-4x^2 = -1\cdot1 + 0x^3 - 4x^2 + 2(2x)\\ f(x+x^2) &= 0 + 4x(x+x^2) = 4x^2+4x^3 = 0\cdot 1 + 4x^3 + 4x^2 + 0(2x)\\ f(x^2) &= 0 + 4x^3 = 0\cdot1 + 4x^3 + 0x^2 + 0(2x)\end{aligned}$$
$$[f]^{B_2}_{B_1} = \begin{pmatrix}-1&0&0\\0&4&4\\-4&4&0\\2&0&0\end{pmatrix}.$$
<div class="box errata" data-t="Heads-up: this f is not actually linear" style="margin-bottom:4px">
<p class="small">Because of the product $p(0)\cdot p'$, $f$ fails additivity: $f(1+x) = 1+4x+4x^2$ but $f(1)+f(x) = 4x+4x^2$. A matrix only represents a <b>linear</b> map, so treat this example purely as practice of the column-by-column <i>method</i>. In an exam, the map will be linear (e.g. $f(p) = p'(0) + 4xp$ or $f(p) = p' + 4xp$).</p></div>
</div>

<div class="box ex" data-t="3.4.2(iii) · Into a matrix space ℝ² → ℝ^{2×2}">
<p>$B = \{(1,2),(2,1)\}$, $C = \{E_{11}, E_{21}, E_{12}, E_{22}\}$ in the order $\begin{pmatrix}1&0\\0&0\end{pmatrix},\begin{pmatrix}0&0\\1&0\end{pmatrix},\begin{pmatrix}0&1\\0&0\end{pmatrix},\begin{pmatrix}0&0\\0&1\end{pmatrix}$, and $g(x,y) = \begin{pmatrix}x+y & x-y\\ y-x & x\end{pmatrix}$.</p>
$$g(1,2) = \begin{pmatrix}3&-1\\1&1\end{pmatrix} = 3E_{11}+1E_{21}-1E_{12}+1E_{22},\qquad g(2,1) = \begin{pmatrix}3&1\\-1&2\end{pmatrix} = 3E_{11}-1E_{21}+1E_{12}+2E_{22}$$
$$[g]^{C}_{B} = \begin{pmatrix}3&3\\1&-1\\-1&1\\1&2\end{pmatrix}.$$
</div>

<div class="box thm" data-t="3.4.3 · The matrix does the work: [T(v)]_C = [T]_B^C [v]_B ★">
<p>If $A = [T]^{\Cc}_{\B}$ then for every $v\in V$:
$$[T(v)]_{\Cc} = A\,[v]_{\B}.$$</p>
</div>
<div class="box proof" data-t="of Theorem 3.4.3 (cleaned-up version of the notes' proof)">
<p>Let $v = b_1v_1+\dots+b_nv_n$, so $[v]_{\B} = (b_1,\dots,b_n)^T$. By linearity $T(v) = b_1T(v_1)+\dots+b_nT(v_n)$. Taking $\Cc$-coordinates (the coordinate map is linear, Theorem 3.3.8):
$$[T(v)]_{\Cc} = b_1[T(v_1)]_{\Cc}+\dots+b_n[T(v_n)]_{\Cc}.$$
A linear combination of columns with weights $b_i$ is exactly the matrix–vector product: $\big([T(v_1)]_{\Cc}\,|\cdots|\,[T(v_n)]_{\Cc}\big)(b_1,\dots,b_n)^T = [T]^{\Cc}_{\B}[v]_{\B}$.</p>
</div>

<div class="box ex" data-t="3.4.4 · Using the matrix">
<p><b>(i)</b> $T:\R\to\R^2$, $T(x) = (x,-2x)$, standard bases $\B = \{1\}$, $\Cc = \{(1,0),(0,1)\}$: $T(1) = (1,-2)$, so $A = \begin{pmatrix}1\\-2\end{pmatrix}$ and $[T(x)]_{\Cc} = A[x]_{\B} = \begin{pmatrix}x\\-2x\end{pmatrix}$.</p>
<p><b>(ii)</b> $T(x,y) = (x+y,\;x-y)$ on $\R^2$, $\B_1$ standard, $\B_2 = \{(1,1),(-1,1)\}$.</p>
<ul><li>$[T]_{\B_1}$: $T(1,0) = (1,1)$, $T(0,1) = (1,-1)$ ⇒ $[T]_{\B_1} = \begin{pmatrix}1&1\\1&-1\end{pmatrix}$.</li>
<li>$[T]^{\B_2}_{\B_1}$: $(1,1) = 1(1,1)+0(-1,1)$ and $(1,-1) = 0(1,1)-1(-1,1)$ ⇒ $[T]^{\B_2}_{\B_1} = \begin{pmatrix}1&0\\0&-1\end{pmatrix}$.</li></ul>
<p class="small muted">Same map, different bases ⇒ different matrices. Choosing bases cleverly can make the matrix very simple (even diagonal — see 3.4.5).</p>
<p><b>(iii)</b> $F(p) = p' - 4p$ on $\P_2$, $\B_1 = \{1-x,\,x,\,x^2\}$, $\B_2 = \{1,\,x,\,x^2-1\}$. Find $[F]^{\B_2}_{\B_1}$, then $F(p)$ for $p = 3-2x-x^2$.</p>
<div class="stepper">
<div class="step">$F(1-x) = -1-4+4x = -5\cdot1 + 4x + 0(x^2-1)$<br>$F(x) = 1-4x = 1\cdot 1 - 4x + 0(x^2-1)$<br>$F(x^2) = 2x-4x^2 = -4\cdot1 + 2x - 4(x^2-1)$ &nbsp; <span class="small muted">(since $-4x^2 = -4(x^2-1) - 4$)</span></div>
<div class="step">$$A = [F]^{\B_2}_{\B_1} = \begin{pmatrix}-5&1&-4\\4&-4&2\\0&0&-4\end{pmatrix}.$$</div>
<div class="step">$p = 3-2x-x^2 = 3(1-x) + 1\cdot x - 1\cdot x^2$, so $[p]_{\B_1} = (3,1,-1)^T$ <span class="small muted">(match $x^2$: $-1$; constants: $3$; then $x$: $-3 + c_2 = -2 \Rightarrow c_2 = 1$)</span>.</div>
<div class="step">$$[F(p)]_{\B_2} = A[p]_{\B_1} = \begin{pmatrix}-5&1&-4\\4&-4&2\\0&0&-4\end{pmatrix}\begin{pmatrix}3\\1\\-1\end{pmatrix} = \begin{pmatrix}-10\\6\\4\end{pmatrix}.$$</div>
<div class="step">$F(p) = -10(1) + 6x + 4(x^2-1) = 4x^2+6x-14$. <b>Check directly:</b> $p' - 4p = (-2-2x) - 4(3-2x-x^2) = 4x^2+6x-14$ ✔</div>
</div>
</div>

<div class="box recipe" data-t="Build [T]_B^C in four moves">
<ol class="recipe-steps">
<li>List the domain basis $\B = \{v_1,\dots,v_n\}$ <b>in order</b> and compute each image $T(v_i)$.</li>
<li>Write each $T(v_i)$ as a combination of the codomain basis $\Cc$ (solve for coefficients).</li>
<li>Put the coefficient vector of $T(v_i)$ in column $i$. The result is $m\times n$.</li>
<li>Sanity-check one column, and if asked, use $[T(v)]_{\Cc} = A[v]_{\B}$ then convert back: $T(v) = \sum c_iw_i$.</li>
</ol>
</div>
<div class="box tip" data-t="The augmented-matrix power move ⚡">
<p>When $W = \R^m$ and $\Cc$ is not standard, step 2 means solving $n$ systems with the <b>same</b> coefficient matrix. Do them all at once:
$$\Big(\,w_1\;\cdots\;w_m\;\Big|\;T(v_1)\;\cdots\;T(v_n)\,\Big)\;\xrightarrow{\text{RREF}}\;\Big(\,I_m\;\Big|\;[T]^{\Cc}_{\B}\,\Big).$$
The right-hand block <b>is</b> the answer. The <a href="#/labs/matrix">Matrix-of-T lab</a> shows every row operation.</p>
</div>
<div class="box trap" data-t="Classic errors with [T]_B^C">
<ul><li>Writing coordinates as <b>rows</b> instead of columns (gives the transpose — wrong).</li>
<li>Using the <b>domain</b> basis to take coordinates of the images — coordinates must be in the <b>codomain</b> basis $\Cc$.</li>
<li>Ignoring the given order (e.g. $\Cc = \{(0,1),(1,0)\}$ or $B_2 = \{1,x^3,x^2,2x\}$).</li>
<li>Forgetting to convert back: $[T(v)]_{\Cc}$ is a column of numbers, $T(v)$ is the actual vector/polynomial.</li></ul>
</div>

<div class="box def" data-t="3.4.5 · Diagonalizing a linear operator">
<p>A basis $\B$ of $V$ <b>diagonalizes</b> $T\in\Lin(V)$ if $[T]_{\B}$ is diagonal. If such a basis exists, $T$ (or its matrix) is <b>diagonalizable</b>.</p>
</div>
<div class="box thm" data-t="3.4.6 · Diagonalizable ⇔ similar to a diagonal matrix">
<p>With $A = [T]_{\B}$: $T$ is diagonalizable iff there is an invertible $P$ with $P^{-1}AP$ diagonal.</p>
</div>
<div class="box def" data-t="3.4.7 · Similar matrices">
<p>$A$ and $B$ are <b>similar</b> if $P^{-1}AP = B$ for some invertible $P$.</p>
</div>
<div class="box thm" data-t="3.4.8 · Similarity is an equivalence relation">
<p>Similarity is reflexive, symmetric and transitive.</p>
</div>
<div class="box proof" data-t="of Theorem 3.4.8 (exercise in the notes)">
<ul><li><b>Reflexive:</b> $A = I^{-1}AI$, so $A$ is similar to $A$.</li>
<li><b>Symmetric:</b> if $B = P^{-1}AP$ then $A = PBP^{-1} = (P^{-1})^{-1}B(P^{-1})$ with $P^{-1}$ invertible, so $B$ is similar to $A$.</li>
<li><b>Transitive:</b> if $B = P^{-1}AP$ and $C = Q^{-1}BQ$ then $C = Q^{-1}P^{-1}APQ = (PQ)^{-1}A(PQ)$ with $PQ$ invertible.</li></ul>
</div>
<div class="box ex" data-t="A basis that diagonalizes (exam-style)">
<p>$T(x,y) = (3x+y,\;x+3y)$ and $\B = \{(1,1),(1,-1)\}$: $T(1,1) = (4,4) = 4(1,1)+0(1,-1)$ and $T(1,-1) = (2,-2) = 0(1,1)+2(1,-1)$, so
$$[T]_{\B} = \begin{pmatrix}4&0\\0&2\end{pmatrix}\quad\text{— diagonal, so }\B\text{ diagonalizes }T.$$
The basis vectors are <b>eigenvectors</b> (Chapter 7): $T$ just stretches them.</p>
</div>
<div class="box beyond" data-t="Change of basis & composition — the two formulas that connect everything">
<ul><li><b>Composition ↔ product:</b> $[S\circ T]^{\mathcal D}_{\B} = [S]^{\mathcal D}_{\Cc}\,[T]^{\Cc}_{\B}$ (indices "cancel" like fractions).</li>
<li><b>Change of basis:</b> if $P = [I]^{\B}_{\B'}$ (columns = the new basis vectors written in old coordinates) then $[T]_{\B'} = P^{-1}[T]_{\B}P$. That is why "similar matrices = same map, different basis".</li>
<li>For $\R^n$ with standard basis $\mathcal E$: $[T]^{\Cc}_{\B} = C^{-1}A\,B$ where $A$ is the standard matrix and $B, C$ have the basis vectors as columns.</li></ul>
</div>
` },
    ],

    summary: H`
<div class="card glow"><div class="kicker">Chapter 3 on one page</div>
<div class="tbl-wrap"><table class="tbl">
<tr><th>Concept</th><th>Key fact / formula</th><th>How to use it</th></tr>
<tr><td>Linear map</td><td>$T(\alpha u+\beta v) = \alpha T(u)+\beta T(v)$</td><td>Prove with general $u,v,\alpha,\beta$; disprove with one numeric counterexample.</td></tr>
<tr><td>Quick disproof</td><td>$T(0)\ne0\Rightarrow$ not linear</td><td>Always check first. $T(0)=0$ proves nothing.</td></tr>
<tr><td>Basis determines $T$</td><td>$T(\sum a_iv_i) = \sum a_iT(v_i)$</td><td>Solve for $a_i$, substitute, check.</td></tr>
<tr><td>Kernel</td><td>$\{v\in V: T(v) = 0\}$, subspace of $V$</td><td>Solve homogeneous system; parameters → basis.</td></tr>
<tr><td>Range</td><td>$\spn\{T(v_1),\dots,T(v_n)\}$, subspace of $W$</td><td>Images of a basis; remove dependent ones.</td></tr>
<tr><td>Rank–Nullity</td><td>$\Rank T + \Nullity T = \dim V$</td><td>Find one, get the other. Check answers.</td></tr>
<tr><td>Injective</td><td>$\iff \ker T = \{0\}\iff$ non-singular</td><td>Solve $T(v) = 0$.</td></tr>
<tr><td>Surjective</td><td>$\iff \Rank T = \dim W$</td><td>Use Rank–Nullity.</td></tr>
<tr><td>Isomorphism</td><td>bijective linear; $V\cong\FF^{\dim V}$</td><td>Equal finite dims: injective suffices.</td></tr>
<tr><td>$\dim\Lin(V,W)$</td><td>$\dim V\cdot\dim W$</td><td>Remember $\dim\P_n = n+1$.</td></tr>
<tr><td>Inverse map</td><td>$T^{-1}$ linear if $T$ bijective</td><td>Solve $T(x) = y$ for $x$.</td></tr>
<tr><td>Matrix of $T$</td><td>column $i$ = $[T(v_i)]_{\Cc}$</td><td>$[T(v)]_{\Cc} = [T]^{\Cc}_{\B}[v]_{\B}$.</td></tr>
<tr><td>Similar</td><td>$B = P^{-1}AP$</td><td>Same map in a different basis; equivalence relation.</td></tr>
</table></div></div>`,
  });
})();
