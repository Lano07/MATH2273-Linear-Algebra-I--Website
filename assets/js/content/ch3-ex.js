/* Chapter 3 — Exercises with complete model solutions (every answer verified with a CAS) */
(function () {
  const H = String.raw;
  LA.chapters.ch3.exercises = H`
<div class="card glow"><div class="kicker">How to use this page</div>
<p>Each question is from the notes (Exercises 3.1–3.4), followed by extra exam-style questions. <b>Attempt on paper first</b>, then open the hint, then the full solution. The solutions are written the way you should write them in the coursework — every step justified.</p></div>

<h2>Exercise 3.1</h2>
<div class="box exam" data-t="Q1 · Linear or not?">
<p>Determine whether or not the following are linear transformations.</p>
<p>(i) $f:\R\to\R$, $f(x) = |x|$ &nbsp; (ii) $g:\R^2\to\R^2$, $g(x,y) = (x+y,x-y)$ &nbsp; (iii) $h:\R^{2\times2}\to\R$, $h\begin{pmatrix}a&b\\c&d\end{pmatrix} = a+d$ &nbsp; (iv) $T:\P_n\to\P_n$, $T(p) = \frac{dp}{dx}+4p$.</p>
<details class="reveal hint"><summary>Hint</summary><p>Check $T(0)$ first; absolute values usually fail with $\alpha = -1$; derivatives, traces and "linear formulas" are linear.</p></details>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i) Not linear.</b> Take $\alpha=-1$, $x=1$: $f(\alpha x) = f(-1) = 1$ but $\alpha f(x) = -1$. Since $f(\alpha x)\ne\alpha f(x)$, $f\notin\Lin(\R)$.</p>
<p><b>(ii) Linear.</b> Let $\alpha,\beta\in\R$, $u = (u_1,u_2)$, $v = (v_1,v_2)$. Then
$$\begin{aligned}g(\alpha u+\beta v) &= g(\alpha u_1+\beta v_1,\;\alpha u_2+\beta v_2)\\ &= \big((\alpha u_1+\beta v_1)+(\alpha u_2+\beta v_2),\;(\alpha u_1+\beta v_1)-(\alpha u_2+\beta v_2)\big)\\ &= \alpha(u_1+u_2,\,u_1-u_2)+\beta(v_1+v_2,\,v_1-v_2) = \alpha g(u)+\beta g(v).\end{aligned}$$</p>
<p><b>(iii) Linear</b> ($h$ is the <i>trace</i>). For $A = \begin{pmatrix}a_1&b_1\\c_1&d_1\end{pmatrix}$, $B = \begin{pmatrix}a_2&b_2\\c_2&d_2\end{pmatrix}$:
$$h(\alpha A+\beta B) = (\alpha a_1+\beta a_2)+(\alpha d_1+\beta d_2) = \alpha(a_1+d_1)+\beta(a_2+d_2) = \alpha h(A)+\beta h(B).$$</p>
<p><b>(iv) Linear.</b> Differentiation is linear: $(\alpha p+\beta q)' = \alpha p'+\beta q'$. So
$$T(\alpha p+\beta q) = (\alpha p+\beta q)' + 4(\alpha p+\beta q) = \alpha(p'+4p)+\beta(q'+4q) = \alpha T(p)+\beta T(q).$$</p>
</details></div>

<div class="box exam" data-t="Q2 · Find T from given values">
<p>(i) $T\in\Lin(\R^2,\R^3)$ with $T(1,1) = (1,0,0)$, $T(-1,2) = (0,0,1)$. &nbsp; (ii) $T\in\Lin(\R^3,\P_3)$ with $T(1,0,0) = 1-x+x^3$, $T(0,1,0) = x^2+2x^3$, $T(0,0,1) = x-x^2$. &nbsp; (iii) $T\in\Lin(\R,\R^{2\times2})$ with $T(-1) = \begin{pmatrix}1&0\\0&-1\end{pmatrix}$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> Write $(x,y) = a(1,1)+b(-1,2) = (a-b,\;a+2b)$. Then $a-b = x$ and $a+2b = y$; subtracting, $3b = y-x$, so
$$b = \tfrac{y-x}{3},\qquad a = x+b = \tfrac{2x+y}{3}.$$
By linearity,
$$T(x,y) = a(1,0,0)+b(0,0,1) = \Big(\frac{2x+y}{3},\;0,\;\frac{y-x}{3}\Big).$$
<i>Check:</i> $T(1,1) = (1,0,0)$ ✔, $T(-1,2) = (0,0,1)$ ✔.</p>
<p><b>(ii)</b> Standard basis, so $(a,b,c) = a e_1+be_2+ce_3$ directly:
$$T(a,b,c) = a(1-x+x^3)+b(x^2+2x^3)+c(x-x^2) = a + (c-a)x + (b-c)x^2 + (a+2b)x^3.$$</p>
<p><b>(iii)</b> $\{-1\}$ is a basis of $\R$ and $x = (-x)\cdot(-1)$, so
$$T(x) = -x\,T(-1) = \begin{pmatrix}-x&0\\0&x\end{pmatrix}.$$</p>
</details></div>

<h2>Exercise 3.2</h2>
<div class="box exam" data-t="Q1 · Linear or not? (round 2)">
<p>(i) $\alpha:\R^2\to\P_2$, $\alpha(a_1,a_2) = a_1+x+a_2x^2$ &nbsp; (ii) $\beta:V\to V$, $\beta(f) = \frac13 f$, $V = \spn\{e^x,e^{-x}\}$ &nbsp; (iii) $g:\R\to\R^2$, $g(x) = (x,2x+1)$ &nbsp; (iv) $h:\R^4\to\R$, $h(x,y,z,w) = x+2y+3z+4z$ &nbsp; (v) $K:\P_2\to\P_4$, $K(p) = \frac{d^2p}{dx^2}+p^2$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i) Not linear:</b> $\alpha(0,0) = 0 + x + 0 = x\ne0$ (the zero polynomial), contradicting Proposition 3.1.4.</p>
<p><b>(ii) Linear:</b> $\beta(af+bg) = \frac13(af+bg) = a\big(\frac13f\big)+b\big(\frac13g\big) = a\beta(f)+b\beta(g)$, and $\beta$ maps $V$ into $V$ since $V$ is closed under scaling.</p>
<p><b>(iii) Not linear:</b> $g(0) = (0,1)\ne(0,0)$.</p>
<p><b>(iv) Linear</b> (as printed it is $x+2y+7z$; if "$4z$" was meant to be "$4w$" it is still linear). For $u,v\in\R^4$: $h(\alpha u+\beta v) = \alpha h(u)+\beta h(v)$ because each term is a constant times one coordinate.</p>
<p><b>(v) Not linear:</b> take $p = 1$ and scalar $2$. $K(2\cdot1) = 0 + 4 = 4$, but $2K(1) = 2(0+1) = 2$. The square $p^2$ breaks homogeneity.</p>
</details></div>

<div class="box exam" data-t="Q2 · Bases and dimensions of Ran(T) and ker(T)">
<p>(i) $T(x,y) = (x,x)$ on $\R^2$ &nbsp; (ii) $T:\R\to\R^4$, $T(x) = (2x,0,-x,0)$ &nbsp; (iii) $T:\P_2\to\P_2$, $T(p) = \frac{dp}{dx}-3p$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> $\ker T = \{(x,y) : (x,x) = (0,0)\} = \{(0,y): y\in\R\} = \spn\{(0,1)\}$ — basis $\{(0,1)\}$, $\Nullity = 1$.<br>
$\Ran T = \{(x,x): x\in\R\} = \spn\{(1,1)\}$ — basis $\{(1,1)\}$, $\Rank = 1$. Check: $1+1 = 2 = \dim\R^2$ ✔.</p>
<p><b>(ii)</b> $\ker T = \{x: (2x,0,-x,0) = 0\} = \{0\}$ — basis $\emptyset$, $\Nullity = 0$.<br>
$\Ran T = \{x(2,0,-1,0)\} = \spn\{(2,0,-1,0)\}$ — basis $\{(2,0,-1,0)\}$, $\Rank = 1$. Check: $1+0 = 1 = \dim\R$ ✔.</p>
<p><b>(iii)</b> For $p = a_0+a_1x+a_2x^2$: $T(p) = (a_1+2a_2x) - 3(a_0+a_1x+a_2x^2) = (a_1-3a_0) + (2a_2-3a_1)x - 3a_2x^2$.<br>
$T(p) = 0 \Rightarrow -3a_2 = 0,\; 2a_2-3a_1 = 0,\; a_1-3a_0 = 0 \Rightarrow a_2 = a_1 = a_0 = 0$. So $\ker T = \{0\}$, $\Nullity = 0$, and $\Rank = 3-0 = 3$; $\Ran T$ is a 3-dimensional subspace of $\P_2$, so $\Ran T = \P_2$ with basis $\{1,x,x^2\}$.</p>
</details></div>

<h2>Exercise 3.3</h2>
<div class="box exam" data-t="Q1 · Dimension and onto/one-one (corrected statement)">
<p>As printed, the statements are false (see the <a href="#/errata">corrections page</a>). Prove the corrected versions: for $T\in\Lin(V,W)$ with $\dim V$ finite, (i) if $T$ is onto then $\dim V\ge\dim W$; (ii) if $T$ is one-one then $\dim V\le\dim W$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>Counterexample to the printed version:</b> the zero map $\theta:\R^2\to\R$ has $\dim V = 2\ge 1 = \dim W$ but is not onto; $\theta:\R\to\R^2$ has $1\le 2$ but is not one-one.</p>
<p><b>(i)</b> If $T$ is onto, $\Ran T = W$, so $\Rank T = \dim W$. By Rank–Nullity, $\dim W = \Rank T = \dim V - \Nullity T\le\dim V$.</p>
<p><b>(ii)</b> If $T$ is one-one, $\ker T = \{0\}$ (Theorem 3.2.6), so $\Nullity T = 0$ and $\Rank T = \dim V$. Since $\Ran T$ is a subspace of $W$, $\dim V = \dim\Ran T\le\dim W$.</p>
</details></div>
<div class="box exam" data-t="Q2 · Show f(x,y) = (x+y, x−y) is non-singular">
<details class="reveal sol"><summary>Full solution</summary>
<p>Suppose $f(x,y) = (0,0)$. Then $x+y = 0$ and $x-y = 0$; adding gives $2x = 0$, so $x = 0$, and then $y = 0$. Hence the only vector sent to $0$ is $(0,0)$: $\ker f = \{0\}$, so $f$ is non-singular (Definition 3.3.5). <span class="muted">(Bonus: by Theorem 3.3.6 it is injective; since $\dim$ domain = $\dim$ codomain it is an isomorphism, with $f^{-1}(u,v) = (\frac{u+v}{2},\frac{u-v}{2})$.)</span></p>
</details></div>
<div class="box exam" data-t="Q3 · Compositions">
<p>$f\in\Lin(U,V)$, $g\in\Lin(V,W)$. (i) Prove $g\circ f\in\Lin(U,W)$. (ii) Show that if $f$ and $g$ are singular then $g\circ f$ is singular.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> Let $\alpha,\beta\in\FF$ and $u,v\in U$. Using linearity of $f$, then of $g$:
$$(g\circ f)(\alpha u+\beta v) = g(\alpha f(u)+\beta f(v)) = \alpha\,g(f(u))+\beta\,g(f(v)) = \alpha(g\circ f)(u)+\beta(g\circ f)(v).$$</p>
<p><b>(ii)</b> Since $f$ is singular, there is $u\ne0$ in $U$ with $f(u) = 0$. Then $(g\circ f)(u) = g(0) = 0$ (Prop. 3.1.4) with $u\ne0$, so $g\circ f$ is singular. <span class="muted">Only the singularity of $f$ was needed.</span></p>
</details></div>

<h2>Exercise 3.4</h2>
<div class="box exam" data-t="Q1 · Find [T]_{B₁}^{B₂}">
<p>(i) $T(x,y,z) = (x-y,\;x+z)$, $B_1 = \{(1,0,1),(0,1,1),(0,0,-1)\}$, $B_2 = \{(1,-1),(0,2)\}$.<br>(ii) $T(x,y) = x+3y$, $B_1 = \{(1,-1),(1,1)\}$, $B_2 = \{1\}$.<br>(iii) $T(p) = \int_{-1}^1 p(x)\,dx$ on $\P_1$, $B_1 = \{1,\;x-2\}$, $B_2 = \{2\}$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> Images: $T(1,0,1) = (1,2)$, $T(0,1,1) = (-1,1)$, $T(0,0,-1) = (0,-1)$.<br>
In $B_2$: $a(1,-1)+b(0,2) = (a,\;2b-a)$. So for a target $(s,t)$: $a = s$ and $b = \frac{t+s}{2}$.
$$(1,2): a=1,\;b=\tfrac32;\qquad (-1,1): a=-1,\;b=0;\qquad (0,-1): a = 0,\;b = -\tfrac12.$$
$$[T]^{B_2}_{B_1} = \begin{pmatrix}1&-1&0\\ \frac32&0&-\frac12\end{pmatrix}.$$</p>
<p><b>(ii)</b> $T(1,-1) = -2 = -2\cdot1$ and $T(1,1) = 4 = 4\cdot1$, so $[T]^{B_2}_{B_1} = \begin{pmatrix}-2&4\end{pmatrix}$ (a $1\times2$ matrix).</p>
<p><b>(iii)</b> $T(1) = \int_{-1}^1 1\,dx = 2 = 1\cdot 2$; $\;T(x-2) = \big[\frac{x^2}{2}-2x\big]_{-1}^{1} = -4 = -2\cdot2$. So $[T]^{B_2}_{B_1} = \begin{pmatrix}1&-2\end{pmatrix}$. <span class="muted">(Coordinates are w.r.t. the basis vector $2$, not $1$!)</span></p>
</details></div>
<div class="box exam" data-t="Q2 · Second derivative as a matrix">
<p>$\alpha:\P_3\to\P_1$, $\alpha(p) = \frac{d^2p}{dx^2}$, $M = \{1,\;x,\;x^2,\;x^3-x\}$, $N = \{1,\;x\}$. (i) Find $A = [\alpha]^N_M$. (ii) For $u(x) = 28x^3+15x^2-2x-1$, use $A$ to find $\frac{d^2u}{dx^2}$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> $\alpha(1) = 0 = 0\cdot1+0x$; $\alpha(x) = 0$; $\alpha(x^2) = 2 = 2\cdot1+0x$; $\alpha(x^3-x) = 6x = 0\cdot1+6x$.
$$A = \begin{pmatrix}0&0&2&0\\0&0&0&6\end{pmatrix}.$$</p>
<p><b>(ii)</b> Coordinates of $u$ in $M$: $u = c_1 + c_2x + c_3x^2 + c_4(x^3-x)$. Matching $x^3$: $c_4 = 28$; $x^2$: $c_3 = 15$; $x$: $c_2 - c_4 = -2\Rightarrow c_2 = 26$; constant: $c_1 = -1$. So $[u]_M = (-1,26,15,28)^T$ and
$$[\alpha(u)]_N = A[u]_M = \begin{pmatrix}2\cdot15\\6\cdot28\end{pmatrix} = \begin{pmatrix}30\\168\end{pmatrix}\;\Rightarrow\;\frac{d^2u}{dx^2} = 30 + 168x.$$
<i>Check:</i> $u' = 84x^2+30x-2$, $u'' = 168x+30$ ✔.</p>
</details></div>

<h2>Extra exam-style questions</h2>
<div class="box exam" data-t="X1 · Kernel, range, rank–nullity (ℝ⁴ → ℝ³)">
<p>$T(x,y,z,w) = (x+y-z,\;2x+y+w,\;x+z+w)$. Find bases for $\ker T$ and $\Ran T$, verify Rank–Nullity, and decide whether $T$ is injective or surjective.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Coefficient matrix and reduction:
$$A = \begin{pmatrix}1&1&-1&0\\2&1&0&1\\1&0&1&1\end{pmatrix}\xrightarrow[R_3\to R_3-R_1]{R_2\to R_2-2R_1}\begin{pmatrix}1&1&-1&0\\0&-1&2&1\\0&-1&2&1\end{pmatrix}\xrightarrow{R_3\to R_3-R_2}\begin{pmatrix}1&1&-1&0\\0&-1&2&1\\0&0&0&0\end{pmatrix}.$$
Pivots in columns 1, 2; free variables $z = s$, $w = t$. From row 2: $y = 2s+t$; row 1: $x = -y+z = -s-t$.
$$\ker T = \{(-s-t,\;2s+t,\;s,\;t)\} = \spn\{(-1,2,1,0),\,(-1,1,0,1)\},\quad\Nullity = 2.$$
Range = span of the pivot columns of the <i>original</i> $A$: $\Ran T = \spn\{(1,2,1),(1,1,0)\}$, $\Rank = 2$.<br>
Check: $2+2 = 4 = \dim\R^4$ ✔. Not injective ($\Nullity\ne0$); not surjective ($\Rank = 2\lt3$).</p>
</details></div>
<div class="box exam" data-t="X2 · Matrix of a polynomial map, then use it">
<p>$T:\P_2\to\P_1$, $T(p) = p'(x)+p(1)$. Find $[T]^{C}_{B}$ for $B = \{1,\;1+x,\;x^2\}$, $C = \{1,\;1-x\}$, and use it to compute $T(2-x+3x^2)$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>$T(1) = 0+1 = 1$; $T(1+x) = 1+2 = 3$; $T(x^2) = 2x+1$. In $C$: $a\cdot1+b(1-x) = (a+b)-bx$.
$1 \to (1,0)$; $3\to(3,0)$; $1+2x$: $-b = 2\Rightarrow b=-2$, $a = 3$ $\to(3,-2)$.
$$[T]^C_B = \begin{pmatrix}1&3&3\\0&0&-2\end{pmatrix}.$$
$p = 2-x+3x^2 = 3\cdot1 + (-1)(1+x) + 3x^2$, so $[p]_B = (3,-1,3)^T$ and $[T(p)]_C = (3-3+9,\;-6)^T = (9,-6)^T$. Hence $T(p) = 9 - 6(1-x) = 3+6x$. <i>Check:</i> $p' = -1+6x$, $p(1) = 4$, sum $= 3+6x$ ✔.</p>
</details></div>
<div class="box exam" data-t="X3 · Prove: T injective and S independent ⇒ T(S) independent">
<details class="reveal sol"><summary>Full solution</summary>
<p>Let $S = \{u_1,\dots,u_n\}$ be independent and suppose $a_1T(u_1)+\dots+a_nT(u_n) = 0$. By linearity $T(a_1u_1+\dots+a_nu_n) = 0 = T(0)$. Since $T$ is injective, $a_1u_1+\dots+a_nu_n = 0$, and since $S$ is independent, $a_1=\dots=a_n = 0$. Hence $T(S)$ is independent. $\square$</p>
</details></div>
<div class="box exam" data-t="X4 · Show an isomorphism and find its inverse">
<p>$f:\R^2\to\R^2$, $f(x,y) = (2x-y,\;x+y)$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>Linear:</b> $f(\alpha u+\beta v) = \alpha f(u)+\beta f(v)$ (each component is a linear formula — write it out as in Q1(ii)).<br>
<b>Injective:</b> $f(x,y) = 0\Rightarrow 2x - y = 0,\ x+y = 0\Rightarrow 3x = 0\Rightarrow x = y = 0$, so $\ker f = \{0\}$.<br>
<b>Surjective:</b> $\dim$ domain $=\dim$ codomain $= 2$, so by Rank–Nullity $\Rank f = 2 - 0 = 2$, i.e. $\Ran f = \R^2$. Hence $f$ is an isomorphism.<br>
<b>Inverse:</b> solve $u = 2x-y$, $v = x+y$: adding, $3x = u+v$; so $x = \frac{u+v}{3}$, $y = v - x = \frac{2v-u}{3}$:
$$f^{-1}(u,v) = \Big(\frac{u+v}{3},\;\frac{2v-u}{3}\Big).$$</p>
</details></div>
<div class="box exam" data-t="X5 · Integral map on ℙ₂">
<p>$T:\P_2\to\R$, $T(p) = \int_{-1}^1 p(x)\,dx$. Find a basis of $\ker T$, the nullity and the rank.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>For $p = a+bx+cx^2$: $T(p) = 2a + 0 + \frac{2c}{3}$. $T(p) = 0\iff c = -3a$, so
$$\ker T = \{a(1-3x^2)+bx : a,b\in\R\} = \spn\{1-3x^2,\;x\},$$
a basis (two non-multiples). $\Nullity = 2$, $\Rank = 3-2 = 1$ (indeed $\Ran T = \R$ since $T(\tfrac{y}{2}) = y$).</p>
</details></div>
<div class="box exam" data-t="X6 · True or false? Justify.">
<p>(a) There is a linear injective $T:\R^4\to\R^3$. (b) Every linear $T:\P_2\to\R^3$ with $\ker T=\{0\}$ is an isomorphism. (c) $\dim\Lin(\P_2,\R^{2\times2}) = 12$. (d) If $T(1,0) = (2,3)$ and $T(2,0) = (4,5)$ then $T$ can be linear.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>(a) <b>False:</b> $\Nullity = 4-\Rank\ge4-3 = 1$. (b) <b>True:</b> $\dim\P_2 = 3 = \dim\R^3$ and injective ⇒ surjective. (c) <b>True:</b> $3\times4 = 12$. (d) <b>False:</b> linearity forces $T(2,0) = 2T(1,0) = (4,6)\ne(4,5)$.</p>
</details></div>
`;
})();
