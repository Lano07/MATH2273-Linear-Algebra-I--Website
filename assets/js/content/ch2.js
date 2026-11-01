/* Chapter 2 — Vector Spaces */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch2", num: 2, title: "Vector Spaces", short: "Vector Spaces", pages: "10–28", quiz: "ch2",
    blurb: "Fields and vector spaces, subspaces, linear combinations and span, linear independence, bases, coordinates, dimension, and sums & direct sums.",
    goals: [
      "Check the vector-space axioms — and spot the one that fails for strange operations.",
      "Prove (or disprove) that a subset is a subspace using the subspace test.",
      "Decide whether vectors span / are independent / form a basis, and find coordinates.",
      "Compute dimensions and work with sums and direct sums.",
    ],
    intro: H`<div class="kicker">Why this chapter matters</div><p>Chapters 3 and 4 live inside vector spaces. You will constantly need: <b>the subspace test</b> (kernels, ranges and $S^\perp$ are subspaces), <b>independence/span/basis</b> (bases of kernels and ranges, Gram–Schmidt inputs) and <b>dimension</b> (Rank–Nullity).</p>`,
    sections: [
      { id: "2.1", title: "Fields and vector spaces", html: H`
<div class="box def" data-t="2.1.1 · Field">
<p>A non-empty set $\FF$ with two binary operations $+,\cdot$ is a <b>field</b> if: (i) closure; (ii) identities $0\ne1$ with $x+0 = x$, $x\cdot1 = x$; (iii) additive inverses $-x$; (iv) multiplicative inverses $x^{-1}$ for $x\ne0$; (v) associativity; (vi) commutativity; (vii) distributivity $x(y+z) = xy+xz$.</p>
</div>
<div class="box ex" data-t="2.1.2 · Fields and non-fields">
<p>$\Q,\R,\C$ are fields. $\N$ is not ($-2\notin\N$). $\Z$ is not ($3^{-1} = \frac13\notin\Z$).</p>
</div>
<div class="box def" data-t="2.1.3 · Vector space (10 axioms)">
<p>A non-empty set $V$ with vector addition $\oplus$ and scalar multiplication $\odot$ over a field $\FF$ is a <b>vector space</b> if for all $u,v,w\in V$, $a,b\in\FF$:</p>
<div class="tbl-wrap"><table class="tbl">
<tr><th>#</th><th>Axiom</th><th>#</th><th>Axiom</th></tr>
<tr><td>(i)</td><td>$u\oplus v\in V$ (closure under +)</td><td>(vi)</td><td>$a\odot u\in V$ (closure under scaling)</td></tr>
<tr><td>(ii)</td><td>$u\oplus(v\oplus w) = (u\oplus v)\oplus w$</td><td>(vii)</td><td>$a\odot(u\oplus v) = a\odot u\oplus a\odot v$</td></tr>
<tr><td>(iii)</td><td>$\exists\,0$: $u\oplus0 = u$</td><td>(viii)</td><td>$(a+b)\odot u = a\odot u\oplus b\odot u$</td></tr>
<tr><td>(iv)</td><td>$\exists\,-u$: $u\oplus(-u) = 0$</td><td>(ix)</td><td>$(ab)\odot u = a\odot(b\odot u)$</td></tr>
<tr><td>(v)</td><td>$u\oplus v = v\oplus u$</td><td>(x)</td><td>$1\odot u = u$</td></tr></table></div>
<p class="small muted">Note 2.1.4: elements of $V$ are vectors, elements of $\FF$ scalars; $\FF = \R$ gives a real vector space, $\FF = \C$ a complex one. Note 2.1.6: we usually write $+$ and juxtaposition, use the standard operations unless told otherwise, and take $\FF = \R$ if no field is given.</p>
</div>
<div class="box ex" data-t="2.1.5 · Standard vector spaces">
<ol type="i"><li>$\FF^n$ with componentwise operations; $0 = (0,\dots,0)$, $-u = (-u_1,\dots,-u_n)$.</li>
<li>$\R^{2\times2}$ (all $2\times2$ real matrices) with entrywise operations; zero = zero matrix.</li>
<li>All functions $[0,1]\to\R$ with $(f+g)(x) = f(x)+g(x)$, $(af)(x) = af(x)$; zero = zero function $\theta$.</li>
<li>$\P_n$ — real polynomials of degree at most $n$.</li>
<li><b>Weird addition</b> on $\R^2$: $x\oplus y = (x_1+y_1+2,\;x_2+y_2-1)$. The zero vector solves $x\oplus0 = x$: $0 = (-2,1)$! And $x\oplus(-x) = (-2,1)$ gives $-x = (-x_1-4,\;2-x_2)$.</li></ol>
</div>
<div class="box trap" data-t="With strange operations, the zero vector may not be (0,0)">
<p>Always <b>solve</b> for the identity using the given operation (Example 2.1.5(v)). Also: $\R^n$ is not a vector space over $\C$ — $(1+i)(1,\dots,1)\notin\R^n$ (closure fails). The field matters.</p>
</div>
<div class="box thm" data-t="2.1.7 · Basic consequences of the axioms">
<p>(i) $u+v = u\Rightarrow v = 0$. (ii) $au = 0\iff a = 0$ or $u = 0$. (iii) $(-1)u = -u$. (iv) The zero vector is unique. (v) Additive inverses are unique.</p>
</div>
<div class="box proof" data-t="of 2.1.7 (i), (ii) from the notes; (iii)–(v) completed">
<p><b>(i)</b> Add $-u$ to both sides of $u+v = u$: $(-u+u)+v = -u+u$, so $0+v = 0$, i.e. $v = 0$.</p>
<p><b>(ii)</b> If $u = 0$: $a0 = a(0+0) = a0+a0$, so $a0 = 0$ by (i). If $a = 0$: $0u = (0+0)u = 0u+0u$, so $0u = 0$. Conversely if $au = 0$ and $a\ne0$, multiply by $a^{-1}$: $u = 1u = (a^{-1}a)u = a^{-1}(au) = a^{-1}0 = 0$.</p>
<p><b>(iii)</b> $u+(-1)u = 1u+(-1)u = (1+(-1))u = 0u = 0$, so $(-1)u$ is an additive inverse of $u$; by (v) it equals $-u$.</p>
<p><b>(iv)</b> If $0$ and $0'$ are both identities, $0 = 0+0' = 0'$.</p>
<p><b>(v)</b> If $u+w = 0$ and $u+w' = 0$ then $w = w+0 = w+(u+w') = (w+u)+w' = 0+w' = w'$.</p>
</div>` },
      { id: "2.2", title: "Subspaces", html: H`
<div class="box def" data-t="2.2.1 · Subspace & the subspace test">
<p>A non-empty $W\subseteq V$ is a <b>subspace</b> if it is a vector space under the operations of $V$; equivalently: (i) $0\in W$; (ii) $u,v\in W\Rightarrow u+v\in W$; (iii) $a\in\FF$, $u\in W\Rightarrow au\in W$.</p>
</div>
<div class="box thm" data-t="2.2.3 · One-step subspace test">
<p>For non-empty $W\subseteq V$: $W$ is a subspace $\iff au+bv\in W$ for all $a,b\in\FF$, $u,v\in W$.</p>
<p class="small"><b>Proof.</b> (⇒) $au, bv\in W$ by closure under scaling, so their sum is in $W$. (⇐) $a = b = 0$ gives $0\in W$; $a = b = 1$ gives closure under $+$; $b = 0$ gives closure under scaling. $\square$</p>
</div>
<div class="box ex" data-t="2.2.2 · Subspace proofs">
<p>(i) $W = \{(x,0)\}\subset\R^2$: $(0,0)\in W$; $(x,0)+(y,0) = (x+y,0)\in W$; $a(x,0) = (ax,0)\in W$. ✔<br>
(ii) $W = \{f\in C[0,1]: f(0) = f(1) = 0\}$: $\theta\in W$; $(f+g)(0) = 0+0$, $(f+g)(1) = 0$; $(af)(0) = a\cdot0 = 0$, $(af)(1) = 0$. ✔<br>
(iii) $\{0\}$ and $V$ are the trivial subspaces. (iv) $\N$, $\Z$, $(0,\infty)$ are <b>not</b> subspaces of $\R$ (e.g. $-1\cdot1\notin\N$).</p>
</div>
<div class="box template" data-t="Subspace proof layout">
<p><b>(1) Zero:</b> show $0\in W$ explicitly (check the defining condition). <b>(2) Closure:</b> "Let $u,v\in W$ and $a,b\in\FF$. Then $u = \ldots$, $v = \ldots$ satisfy [condition]. So $au+bv = \ldots$ satisfies [condition], hence $au+bv\in W$." <b>Conclude</b> by Theorem 2.2.3.</p>
</div>
<div class="box tip" data-t="Quick disproof: is 0 in W?">
<p>If $0\notin W$, it is not a subspace — instantly. Exercise 2.2 Q1: $W = \Big\{\begin{pmatrix}x&0\\2x+1&0\end{pmatrix}\Big\}$ would need $x = 0$ and $2x+1 = 0$ simultaneously — impossible. Other giveaways: constants added (+1), squares, absolute values, products of coordinates, inequalities ($x\ge0$).</p>
</div>` },
      { id: "2.3", title: "Linear combinations and span", html: H`
<div class="box def" data-t="2.3.1 · Linear combination">
<p>$u$ is a <b>linear combination</b> of $u_1,\dots,u_n$ if $u = a_1u_1+\dots+a_nu_n$ for some scalars $a_i$.</p>
</div>
<div class="box ex" data-t="2.3.2 · Is it a combination?">
<p>(i) $(1,-1,3) = (1,-1,0)+3(0,0,1)$ ✔. (ii) $(2,-3) = a_1(1,1)+a_2(2,2)$ would need $a_1+2a_2 = 2$ and $a_1+2a_2 = -3$ — contradiction ✘. (iii) $x^2+4x+1$ is not a combination of $x^2+5$, $x-3$ (forces $-7 = 1$), but with $p_3 = x^2-2x$ added: $p = \frac{19}{11}p_1+\frac{28}{11}p_2-\frac{8}{11}p_3$.</p>
</div>
<div class="box def" data-t="2.3.3 · Span">
<p>$\spn(S)$ = the set of all (finite) linear combinations of elements of $S$. If $\spn(S) = V$, $S$ <b>spans</b> $V$.</p>
</div>
<div class="box ex" data-t="2.3.4 · Computing spans">
<p>(i) $\spn\{(1,2),(2,4)\} = \spn\{(1,2)\} = \{(x,2x)\}$ (a line — $(2,4)$ adds nothing). (ii) $\spn\{(1,0),(1,1)\} = \R^2$: $(x_1,x_2) = (x_1-x_2)(1,0)+x_2(1,1)$. (iii) $\{1,\,1-x,\,3x\}$ spans $\P_1$, with infinitely many ways to write each $p$ (the set is dependent).</p>
</div>
<div class="box thm" data-t="2.3.5–2.3.7 · Span is the smallest subspace containing S">
<p>$\spn(S)$ is a subspace of $V$ (proof: $0 = 0u$; sums and multiples of combinations are combinations), it is the <b>smallest</b> subspace containing $S$ (2.3.6), and $\spn(\emptyset) = \{0\}$ (2.3.7).</p>
</div>
<div class="box recipe" data-t="Does S span V? / Is v in span(S)?">
<ol class="recipe-steps"><li>Write a general (or the given) vector as $a_1s_1+\dots+a_ks_k$.</li><li>Compare components → linear system in the $a_i$.</li><li>Consistent for <b>every</b> right-hand side ⇒ spans; inconsistent for some ⇒ doesn't. In $\R^n$: $n$ vectors span iff the matrix with them as columns has non-zero determinant.</li></ol>
</div>` },
      { id: "2.4", title: "Linear independence, basis and dimension", html: H`
<div class="box def" data-t="2.4.1 · Linear (in)dependence">
<p>$u_1,\dots,u_n$ are <b>linearly dependent</b> if $a_1u_1+\dots+a_nu_n = 0$ for some scalars <b>not all zero</b>; otherwise they are <b>independent</b>:
$$a_1u_1+\dots+a_nu_n = 0\;\Rightarrow\;a_1 = \dots = a_n = 0.$$</p>
</div>
<div class="box ex" data-t="2.4.2 · Testing independence">
<p>(i) $\{(1,0,0),(2,1,1),(0,1,1)\}$: dependent — $-2(1,0,0)+(2,1,1)-(0,1,1) = 0$. (ii) $\{(1,0,0),(2,1,1),(0,0,1)\}$: independent. (iii) $\{1,x,x^2\}$: independent. (iv) $\{e^x,e^{-x}\}$: independent (differentiate the relation and add). (v) $\{1-x,1,2x\}\subset\P_1$: dependent (3 vectors in a 2-dim space).</p>
</div>
<div class="box prop" data-t="2.4.3 · Subsets, supersets and the zero vector">
<p>(i) Subsets of independent sets are independent. (ii) Supersets of dependent sets are dependent. (iii) Any set containing $0$ is dependent ($1\cdot0 = 0$ is a non-trivial relation).</p>
<p class="small"><b>Proof of (ii):</b> if $\sum a_iu_i = 0$ non-trivially for $u_i\in S\subseteq T$, the same relation (with zero coefficients on the extra vectors) is non-trivial in $T$.</p>
</div>
<div class="box thm" data-t="2.4.4 · Adding a vector to an independent set">
<p>If $S$ is independent, then $S\cup\{v\}$ is dependent iff $v\in\spn(S)$.</p>
</div>
<div class="box def" data-t="2.4.5 · Basis and coordinates">
<p>A <b>basis</b> is an independent spanning set. If $S = \{u_1,\dots,u_n\}$ is a basis and $u = a_1u_1+\dots+a_nu_n$, then $[u]_S = (a_1,\dots,a_n)^T$ is the <b>coordinate vector</b> of $u$.</p>
</div>
<div class="box ex" data-t="2.4.6 · Basis or not?">
<p>(i) $\{(1,1),(2,3),(1,4)\}$ spans $\R^2$ but is dependent — not a basis. (ii) $\{(1,1),(2,3)\}$ is a basis of $\R^2$ with $[(u_1,u_2)]_S = (3u_1-2u_2,\;u_2-u_1)^T$. (iii) $\{\cos x,\sin x\}$ is a basis of its span. (iv) The standard basis $\{e_1,\dots,e_n\}$ of $\R^n$: $[u]_S = u^T$.</p>
</div>
<div class="box thm" data-t="2.4.7 · Three equivalent descriptions of a basis">
<p>For $V\ne\{0\}$: $S$ is a basis ⇔ $S$ is a <b>minimal spanning set</b> (no proper subset spans) ⇔ $S$ is a <b>maximal independent set</b> (any strict superset is dependent).</p>
</div>
<div class="box prop" data-t="2.4.8 · Coordinates are unique">
<p>Each $u\in V$ is a combination of basis vectors in exactly one way.</p>
<p class="small"><b>Proof.</b> If $u = \sum a_iu_i = \sum b_iu_i$ then $\sum(a_i-b_i)u_i = 0$; independence gives $a_i = b_i$ for all $i$. $\square$</p>
</div>
<div class="box def" data-t="2.4.9 · Dimension">
<p>$\dim V$ = number of vectors in a basis (all bases have the same size); $\dim\{0\} = 0$. Finite basis ⇒ finite-dimensional (the only kind in this course, Remark 2.4.10).</p>
</div>
<div class="box ex" data-t="2.4.11 · Dimensions to memorise">
<p>$\dim\R^n = n$; $\;\dim\P_n = n+1$ (basis $\{1,x,\dots,x^n\}$); $\;\dim\R^{2\times2} = 4$ (basis $E_{11},E_{12},E_{21},E_{22}$); $\dim\R^{m\times n} = mn$.</p>
</div>
<div class="box thm" data-t="2.4.12–2.4.13 · Pruning and extending">
<p>If $\{v_1,\dots,v_m\}$ is dependent with $v_1\ne0$, some $v_j$ is in the span of the earlier ones and can be removed without changing the span. Consequently, in a finite-dimensional $V$: every subspace is finite-dimensional; every spanning set <b>contains</b> a basis; every independent set <b>extends</b> to a basis.</p>
</div>
<div class="box tip" data-t="The n-vectors-in-n-dimensions shortcut">
<p>If $\dim V = n$ and you have exactly $n$ vectors, then <b>independent ⇔ spanning ⇔ basis</b> — check just one. In $\R^n$: put them as columns of a matrix $A$; basis iff $\det A\ne0$ (Chapter 6).</p>
</div>` },
      { id: "2.5", title: "Sums and direct sums", html: H`
<div class="box def" data-t="2.5.1 · Sum and direct sum">
<p>$U+W = \{u+w : u\in U, w\in W\}$ (a subspace when $U,W$ are). $V = U\oplus W$ (direct sum) if every $v\in V$ is $u+w$ for <b>unique</b> $u\in U$, $w\in W$.</p>
</div>
<div class="box thm" data-t="2.5.2 · The direct-sum test">
<p>If $U+W = V$ and $U\cap W = \{0\}$, then $V = U\oplus W$.</p>
<p class="small"><b>Proof.</b> Existence is $U+W = V$. If $u+w = u'+w'$ then $u-u' = w'-w\in U\cap W = \{0\}$, so $u = u'$ and $w = w'$. $\square$</p>
</div>
<div class="box thm" data-t="2.5.3 · Dimension of a sum">
<p>$\dim(U+W) = \dim U+\dim W-\dim(U\cap W)$; for a direct sum $\dim V = \dim U+\dim W$.</p>
</div>
<div class="box ex" data-t="2.5.4 · Direct sums in ℝ² and ℝ³">
<p>(i) $\R^2 = \{(x,0)\}\oplus\{(0,y)\}$, each of dimension 1. <span class="small muted">(The notes write "dim(U) + dim(V)" — read "dim(U) + dim(W)".)</span><br>
(ii) $\R^3 = \spn\{(1,1,1)\}\oplus\spn\{(0,1,1),(1,-1,0)\}$: every $(a,b,c)$ decomposes (solve for $x,y,z$) and the intersection is $\{0\}$.</p>
</div>
<div class="box thm" data-t="2.5.5 · Complements exist">
<p>Every subspace $U$ of a finite-dimensional $V$ has a complement $W$ with $V = U\oplus W$ (extend a basis of $U$ to a basis of $V$; the new vectors span $W$). In an inner product space, $W = U^\perp$ works (Chapter 4).</p>
</div>` },
    ],
    exercises: H`
<h2>Exercises 2.1 – 2.5 — full solutions</h2>
<div class="box exam" data-t="2.1 Q1 · (x₁y₁, x₂+y₂) is not a valid addition">
<details class="reveal sol"><summary>Full solution</summary>
<p>Distributivity (viii) fails: with $u = (1,0)$, $a = b = 1$: $(a+b)u = 2(1,0) = (2,0)$, but $au + bu = (1,0)+(1,0) = (1\cdot1,\;0+0) = (1,0)$. Since $(2,0)\ne(1,0)$, $\R^2$ is not a vector space with these operations. <span class="muted">(Also: the identity would need $x_1\theta_1 = x_1$, so $\theta_1 = 1$, and then $(0,0)$ has no inverse since $0\cdot y_1 = 1$ is impossible.)</span></p>
</details></div>
<div class="box exam" data-t="2.1 Q2 · {0} is a vector space over ℝ and over ℂ">
<details class="reveal sol"><summary>Full solution</summary>
<p>The only vector is $0 = (0,0)$. $0+0 = 0\in V$ and $a0 = 0\in V$ for any real or complex $a$ (closure). Every remaining axiom is an equation whose two sides both equal $0$ (e.g. $a(0+0) = 0 = a0+a0$, $1\cdot0 = 0$); the identity is $0$ and $-0 = 0$. So all ten axioms hold over $\R$ and over $\C$.</p>
</details></div>
<div class="box exam" data-t="2.1 Q3 · x ⊕ y = x + y + 1, a ⊙ x = −ax on ℝ">
<details class="reveal sol"><summary>Full solution</summary>
<p><b>Not a vector space:</b> axiom (x) fails — $1\odot x = -x\ne x$ for $x = 1$. <span class="muted">(The addition part is fine: identity $-1$, inverse $-x-2$.)</span></p>
</details></div>
<div class="box exam" data-t="2.2 Q1 · W = {[[x, 0], [2x+1, 0]]}">
<details class="reveal sol"><summary>Full solution</summary>
<p>Not a subspace: the zero matrix would need $x = 0$ and $2x+1 = 0$ simultaneously, which is impossible, so $O\notin W$.</p>
</details></div>
<div class="box exam" data-t="2.2 Q2 · Functions with zero integral form a subspace">
<details class="reveal sol"><summary>Full solution</summary>
<p>$\theta\in W$ since $\int_a^b0\,dx = 0$. For $f,g\in W$ and $\alpha,\beta\in\R$: $\alpha f+\beta g$ is continuous and $\int_a^b(\alpha f+\beta g) = \alpha\int_a^bf+\beta\int_a^bg = 0$. So $\alpha f+\beta g\in W$; by Theorem 2.2.3 $W$ is a subspace of $C[a,b]$.</p>
</details></div>
<div class="box exam" data-t="2.2 Q3 · Intersection of subspaces is a subspace">
<details class="reveal sol"><summary>Full solution</summary>
<p>$0\in U$ and $0\in W$, so $0\in U\cap W$. If $u,v\in U\cap W$ and $a,b\in\FF$, then $au+bv\in U$ (as $U$ is a subspace) and $au+bv\in W$ (as $W$ is), so $au+bv\in U\cap W$. (Note: $U\cup W$ is usually <b>not</b> a subspace.)</p>
</details></div>
<div class="box exam" data-t="2.3 Q1 · Are (6,2,−5) and (5,4,3) combinations of (1,0,−1), (1,1,0)?">
<details class="reveal sol"><summary>Full solution</summary>
<p>$a(1,0,-1)+b(1,1,0) = (a+b,\;b,\;-a)$.<br>(6,2,−5): $b = 2$, $a = 5$, but then $a+b = 7\ne6$ — <b>no</b>.<br>(5,4,3): $b = 4$, $a = -3$, but $a+b = 1\ne5$ — <b>no</b>.</p>
</details></div>
<div class="box exam" data-t="2.3 Q2 · Spans in ℝ³">
<details class="reveal sol"><summary>Full solution</summary>
<p>(i) $\spn\{(0,1,2),(0,-1,1)\} = \{(0,y,z): y,z\in\R\}$ (the $yz$-plane): both vectors have first entry 0, and $a(0,1,2)+b(0,-1,1) = (0,\,a-b,\,2a+b) = (0,y,z)$ is solvable for any $y,z$: $a = \frac{y+z}{3}$, $b = \frac{z-2y}{3}$.<br>
(ii) $\R^3$ (three independent vectors: determinant $= 1\ne0$). (iii) $\R^3$ (standard basis). (iv) $\R^3$ (rank 3; four vectors in $\R^3$ are dependent, but they still span).</p>
</details></div>
<div class="box exam" data-t="2.3 Q3 · Spans of polynomials and matrices">
<details class="reveal sol"><summary>Full solution</summary>
<p>(i) $\spn\{1-x^2,x\} = \{a+bx-ax^2\} = \{c_0+c_1x+c_2x^2\in\P_2 : c_2 = -c_0\}$.<br>
(ii) $\spn\Big\{\begin{pmatrix}0&1\\1&0\end{pmatrix},\begin{pmatrix}1&0\\0&1\end{pmatrix}\Big\} = \Big\{\begin{pmatrix}b&a\\a&b\end{pmatrix}: a,b\in\R\Big\}$ (symmetric with equal diagonal entries).</p>
</details></div>
<div class="box exam" data-t="2.3 Q4 · {y : y″ + 4y = 0} = span{cos 2x, sin 2x}">
<details class="reveal sol"><summary>Full solution</summary>
<p>(⊇) $(\cos2x)'' = -4\cos2x$ and $(\sin2x)'' = -4\sin2x$, so both (and all their combinations, by linearity of differentiation) satisfy $y''+4y = 0$.</p>
<p>(⊆) Let $y\in A$ and set $z = y - y(0)\cos2x - \frac{y'(0)}{2}\sin2x$. Then $z''+4z = 0$, $z(0) = 0$, $z'(0) = 0$. Let $E = (z')^2+4z^2$; then $E' = 2z'z''+8zz' = 2z'(z''+4z) = 0$, so $E$ is constant $= E(0) = 0$. Hence $z\equiv0$ and $y = y(0)\cos2x+\frac{y'(0)}{2}\sin2x\in\spn\{\cos2x,\sin2x\}$.</p>
</details></div>
<div class="box exam" data-t="2.4 Q1 · {e^{2x}, e^{−2x}} is a basis of {y : y″ − 4y = 0}">
<details class="reveal sol"><summary>Full solution</summary>
<p><b>In $V$:</b> $(e^{\pm2x})'' = 4e^{\pm2x}$ ✔. <b>Independent:</b> if $ae^{2x}+be^{-2x} = 0$ for all $x$, differentiate: $2ae^{2x}-2be^{-2x} = 0$; adding $2\times$(first) gives $4ae^{2x} = 0\Rightarrow a = 0$, then $b = 0$.</p>
<p><b>Spanning:</b> for $y\in V$ let $u = y'+2y$ and $v = y'-2y$. Then $u' = y''+2y' = 4y+2y' = 2u$ and $v' = -2v$, so $u = Ce^{2x}$, $v = De^{-2x}$ (e.g. $(ue^{-2x})' = 0$). Hence $y = \frac{u-v}{4} = \frac C4e^{2x}-\frac D4e^{-2x}$.</p>
</details></div>
<div class="box exam" data-t="2.4 Q2 · W = {(x, 0, 2x, −x)}">
<details class="reveal sol"><summary>Full solution</summary>
<p>$W = \{x(1,0,2,-1)\} = \spn\{(1,0,2,-1)\}$, so it is a subspace (span, Thm 2.3.5). $\{(1,0,2,-1)\}$ spans $W$ and is independent (one non-zero vector), hence a basis; $\dim W = 1$.</p>
</details></div>
<div class="box exam" data-t="2.4 Q3 · {1 − 2x, 2x} is a basis of ℙ₁; coordinates of 3x − 8">
<details class="reveal sol"><summary>Full solution</summary>
<p>$c_1(1-2x)+c_2(2x) = c_1 + (2c_2-2c_1)x$. Setting equal to $a_0+a_1x$: $c_1 = a_0$, $c_2 = \frac{a_1+2a_0}{2}$ — unique solution for every $p$, so the set spans and is independent (take $p = 0$). For $3x-8$: $c_1 = -8$, $c_2 = \frac{3-16}{2} = -\frac{13}{2}$, so $[3x-8]_S = (-8,-\tfrac{13}{2})^T$. Check: $-8+16x-13x = 3x-8$ ✔.</p>
</details></div>
<div class="box exam" data-t="2.4 Q4 · Basis of span{(1,0,1), (0,1,1), (6,1,2)}">
<details class="reveal sol"><summary>Full solution</summary>
<p>$\det\begin{pmatrix}1&0&6\\0&1&1\\1&1&2\end{pmatrix} = 1(2-1)-0+6(0-1) = -5\ne0$, so the three vectors are independent: they form a basis of $V$, $\dim V = 3$, and $V = \R^3$.</p>
</details></div>
<div class="box exam" data-t="2.4 Q5 · W₁ ⊆ W₂: W₁ = W₂ iff dim W₁ = dim W₂">
<details class="reveal sol"><summary>Full solution</summary>
<p>(⇒) trivial. (⇐) Let $\dim W_1 = \dim W_2 = k$ and $B$ a basis of $W_1$. $B$ is an independent set of $k$ vectors in $W_2$; extend it to a basis of $W_2$ (Thm 2.4.13) — it already has $k = \dim W_2$ elements, so nothing is added: $B$ is a basis of $W_2$. Hence $W_2 = \spn B = W_1$.</p>
</details></div>
<div class="box exam" data-t="2.5 Q1 · U ⊕ W = ℝ³">
<details class="reveal sol"><summary>Full solution</summary>
<p>$\det\begin{pmatrix}1&2&0\\0&3&1\\1&1&0\end{pmatrix} = 1(0-1)-2(0-1)+0 = 1\ne0$, so $(1,0,1),(2,3,1),(0,1,0)$ form a basis of $\R^3$. Hence $U+W = \R^3$, and $\dim(U\cap W) = 2+1-3 = 0$, i.e. $U\cap W = \{0\}$. By Theorem 2.5.2, $\R^3 = U\oplus W$.</p>
</details></div>
<div class="box exam" data-t="2.5 Q2 · span(U ∪ W) = U + W">
<details class="reveal sol"><summary>Full solution</summary>
<p>(⊇) $u+w$ is a linear combination of elements of $U\cup W$. (⊆) A combination of elements of $U\cup W$ splits as (combination of $U$-elements) + (combination of $W$-elements) $= u+w$ with $u\in U$, $w\in W$ (subspaces are closed under combinations).</p>
</details></div>
<div class="box exam" data-t="2.5 Q3 · span(A) + span(B) = ℝ², intersection {0}">
<details class="reveal sol"><summary>Full solution</summary>
<p>$\spn(A) = \{(x,0)\}$ (both vectors lie on the $x$-axis), $\spn(B) = \{(0,y)\}$. Every $(x,y) = (x,0)+(0,y)$, so the sum is $\R^2$; a vector on both axes is $(0,0)$.</p>
</details></div>`,
    summary: H`<div class="card glow"><div class="kicker">Chapter 2 on one page</div><div class="tbl-wrap"><table class="tbl">
<tr><th>Idea</th><th>Key fact</th></tr>
<tr><td>Subspace test</td><td>$0\in W$ and $au+bv\in W$</td></tr>
<tr><td>Span</td><td>all combinations; smallest subspace containing $S$</td></tr>
<tr><td>Independent</td><td>$\sum a_iu_i = 0\Rightarrow$ all $a_i = 0$</td></tr>
<tr><td>Basis</td><td>independent + spanning; coordinates unique</td></tr>
<tr><td>Dimension</td><td>$\dim\R^n = n$, $\dim\P_n = n+1$, $\dim\R^{m\times n} = mn$</td></tr>
<tr><td>$n$ vectors, $\dim = n$</td><td>independent ⇔ spanning ⇔ basis</td></tr>
<tr><td>Sum formula</td><td>$\dim(U+W) = \dim U+\dim W-\dim(U\cap W)$</td></tr>
<tr><td>Direct sum</td><td>$U+W = V$ and $U\cap W = \{0\}$</td></tr></table></div></div>`,
  });
})();
