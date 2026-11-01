/* Chapter 4 — Exercises with complete model solutions (every answer verified with a CAS) */
(function () {
  const H = String.raw;
  LA.chapters.ch4.exercises = H`
<div class="card glow"><div class="kicker">How to use this page</div>
<p>Exercise 4 from the notes, fully solved, followed by extra exam-style questions. Attempt first → hint → full solution. For Gram–Schmidt, use the <a href="#/labs/gram-schmidt">Gram–Schmidt Machine</a> to check every intermediate vector.</p></div>

<h2>Exercise 4</h2>
<div class="box exam" data-t="Q1 · An inner product built from derivatives">
<p>Let $V$ be the space of quadratic functions $p:[-1,1]\to\R$ with $p(-1) = p(1) = 0$. Show that $\langle f,g\rangle = \int_{-1}^1 f'(x)g'(x)\,dx$ is an inner product on $V$. Hence compute $\langle 1-x^2,\;5x^2-5\rangle$.</p>
<details class="reveal hint"><summary>Hint</summary><p>Linearity and symmetry are routine. For coincidence: $\int (f')^2 = 0$ forces $f'\equiv0$, so $f$ is constant — then use $f(1) = 0$.</p></details>
<details class="reveal sol"><summary>Full solution</summary>
<p>Let $f,g,h\in V$ and $a,b\in\R$.</p>
<p><b>Non-negativity:</b> $\langle f,f\rangle = \int_{-1}^1(f'(x))^2dx\ge0$ since the integrand is a square.</p>
<p><b>Coincidence:</b> If $f = 0$ then $f' = 0$ and $\langle f,f\rangle = 0$. Conversely, if $\int_{-1}^1(f')^2 = 0$, then since $(f')^2$ is continuous and non-negative, $f'(x) = 0$ for all $x\in[-1,1]$. So $f$ is constant, $f(x) = c$. But $f(1) = 0$, so $c = 0$ and $f = 0$. <span class="muted">(This is exactly why the condition $p(\pm1) = 0$ is there — without it, non-zero constants would have "length" 0.)</span></p>
<p><b>Symmetry:</b> $\int_{-1}^1f'g' = \int_{-1}^1g'f'$.</p>
<p><b>Linearity:</b> $(af+bg)' = af'+bg'$, so $\langle af+bg,h\rangle = \int(af'+bg')h' = a\int f'h' + b\int g'h' = a\langle f,h\rangle + b\langle g,h\rangle$.</p>
<p>Hence $\langle\cdot,\cdot\rangle$ is an inner product on $V$. Finally, with $f' = -2x$ and $g' = 10x$:
$$\langle1-x^2,\,5x^2-5\rangle = \int_{-1}^1(-2x)(10x)\,dx = -20\Big[\frac{x^3}{3}\Big]_{-1}^1 = -\frac{40}{3}.$$
<span class="muted">Check: $5x^2-5 = -5(1-x^2)$, so the answer is $-5\lVert1-x^2\rVert^2 = -5\cdot\frac83$ ✔.</span></p>
</details></div>

<div class="box exam" data-t="Q2 · Find S⊥">
<p>(a) $S = \{(0,1),(2,0)\}\subset\R^2$. &nbsp; (b) $S = \{(1,0,2),(3,2,1)\}\subset\R^3$. (Dot product.)</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(a)</b> $(x,y)\cdot(0,1) = y = 0$ and $(x,y)\cdot(2,0) = 2x = 0$. So $S^\perp = \{(0,0)\}$. <span class="muted">(S spans $\R^2$, and $(\R^2)^\perp = \{0\}$.)</span></p>
<p><b>(b)</b> $(x,y,z)\cdot(1,0,2) = x+2z = 0$ and $(x,y,z)\cdot(3,2,1) = 3x+2y+z = 0$. From the first, $x = -2z$; substituting, $-6z+2y+z = 0\Rightarrow y = \frac52z$. So
$$S^\perp = \Big\{\Big(-2z,\tfrac52z,z\Big): z\in\R\Big\} = \spn\{(-4,5,2)\}.$$
Check: $(-4,5,2)\cdot(1,0,2) = 0$ ✔ and $(-4,5,2)\cdot(3,2,1) = -12+10+2 = 0$ ✔.</p>
</details></div>

<div class="box exam" data-t="Q3 · Gram–Schmidt in ℝ⁴, ℝ³, ℝ²">
<p>(i) $S = \{(1,0,0,1),(0,1,1,0),(-1,1,0,1)\}$ &nbsp; (ii) $S = \{(1,1,0),(-1,1,0),(0,0,1)\}$ &nbsp; (iii) $S = \{(2,3),(-1,2)\}$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> $u_1 = (1,0,0,1)$, $\lVert u_1\rVert^2 = 2$.<br>
$v_2\cdot u_1 = 0$, so $u_2 = v_2 = (0,1,1,0)$, $\lVert u_2\rVert^2 = 2$.<br>
$v_3\cdot u_1 = -1+1 = 0$ and $v_3\cdot u_2 = 1$, so $u_3 = (-1,1,0,1) - \frac12(0,1,1,0) = \big(-1,\frac12,-\frac12,1\big)\parallel(-2,1,-1,2)$, with $\lVert(-2,1,-1,2)\rVert^2 = 10$.
$$\Big\{\tfrac{1}{\sqrt2}(1,0,0,1),\;\tfrac{1}{\sqrt2}(0,1,1,0),\;\tfrac{1}{\sqrt{10}}(-2,1,-1,2)\Big\}.$$</p>
<p><b>(ii)</b> The vectors are already mutually orthogonal ($(1,1,0)\cdot(-1,1,0) = 0$, and $(0,0,1)$ is orthogonal to both), so Gram–Schmidt only normalises:
$$\Big\{\tfrac{1}{\sqrt2}(1,1,0),\;\tfrac{1}{\sqrt2}(-1,1,0),\;(0,0,1)\Big\}.$$</p>
<p><b>(iii)</b> $u_1 = (2,3)$, $\lVert u_1\rVert^2 = 13$. $u_2 = (-1,2) - \frac{-2+6}{13}(2,3) = \big(-\frac{21}{13},\frac{14}{13}\big) = \frac{7}{13}(-3,2)$.
$$\Big\{\tfrac{1}{\sqrt{13}}(2,3),\;\tfrac{1}{\sqrt{13}}(-3,2)\Big\}.$$</p>
</details></div>

<div class="box exam" data-t="Q4 · Gram–Schmidt on {2 − 5x, 1 − x²} ⊂ ℙ₂ with three inner products">
<p>(a) $\langle p_1,p_2\rangle = \int_{-1}^1p_1'p_2'\,dx + 3p_1(0)p_2(0)$ &nbsp; (b) $\int_0^1p_1p_2\,dx$ &nbsp; (c) $2\int_0^1p_1p_2\,dx + 5\int_0^1p_1'p_2'\,dx$.</p>
<details class="reveal hint"><summary>Hint</summary><p>Use the fraction-friendly formula $u_2 = q - \frac{\langle q,p\rangle}{\langle p,p\rangle}p$, then scale $u_2$ to integer coefficients before normalising. Expect ugly numbers in (c) — that's normal.</p></details>
<details class="reveal sol"><summary>Full solution</summary>
<p>Let $p = 2-5x$ ($p' = -5$, $p(0) = 2$) and $q = 1-x^2$ ($q' = -2x$, $q(0) = 1$).</p>
<p><b>(a)</b> $\langle p,p\rangle = \int_{-1}^1 25\,dx + 3(2)(2) = 50+12 = 62$, so $w_1 = \frac{1}{\sqrt{62}}(2-5x)$.<br>
$\langle q,p\rangle = \int_{-1}^1(-2x)(-5)\,dx + 3(1)(2) = 0+6 = 6$.<br>
$u_2 = (1-x^2) - \frac{6}{62}(2-5x) = \frac{1}{31}\big(25+15x-31x^2\big)$. Let $\tilde u_2 = 25+15x-31x^2$:
$$\lVert\tilde u_2\rVert^2 = \int_{-1}^1(15-62x)^2dx + 3(25)^2 = \tfrac{9038}{3} + 1875 = \tfrac{14663}{3},\qquad w_2 = \sqrt{\tfrac{3}{14663}}\,\big(25+15x-31x^2\big).$$</p>
<p><b>(b)</b> $\langle p,p\rangle = \int_0^1(2-5x)^2dx = 4-10+\frac{25}{3} = \frac73$, so $w_1 = \sqrt{\tfrac37}\,(2-5x)$.<br>
$\langle q,p\rangle = \int_0^1(1-x^2)(2-5x)\,dx = 2-\frac52-\frac23+\frac54 = \frac1{12}$.<br>
$u_2 = (1-x^2) - \frac{1/12}{7/3}(2-5x) = (1-x^2)-\frac{1}{28}(2-5x) = \frac{1}{28}\big(26+5x-28x^2\big)$. With $\tilde u_2 = 26+5x-28x^2$:
$$\lVert\tilde u_2\rVert^2 = \int_0^1(26+5x-28x^2)^2dx = \tfrac{2079}{5},\qquad w_2 = \sqrt{\tfrac{5}{2079}}\,\big(26+5x-28x^2\big).$$</p>
<p><b>(c)</b> $\langle p,p\rangle = 2\cdot\frac73 + 5\int_0^125\,dx = \frac{14}{3}+125 = \frac{389}{3}$, so $w_1 = \sqrt{\tfrac{3}{389}}\,(2-5x)$.<br>
$\langle q,p\rangle = 2\cdot\frac1{12} + 5\int_0^1(-2x)(-5)\,dx = \frac16 + 25 = \frac{151}{6}$, and $\frac{\langle q,p\rangle}{\langle p,p\rangle} = \frac{151}{778}$.<br>
$u_2 = (1-x^2) - \frac{151}{778}(2-5x) = \frac{1}{778}\big(476+755x-778x^2\big)$, with $\lVert u_2\rVert^2 = \langle q,q\rangle - \frac{\langle q,p\rangle^2}{\langle p,p\rangle} = \frac{116}{15} - \frac{22801}{4668} = \frac{66491}{23340}$.
$$w_2 = \frac{u_2}{\lVert u_2\rVert} = \sqrt{\tfrac{15}{25864999}}\,\big(476+755x-778x^2\big).$$
<span class="muted">Shortcut used: $\lVert u_2\rVert^2 = \lVert q\rVert^2 - \frac{\langle q,p\rangle^2}{\lVert p\rVert^2}$ (Pythagoras, since $u_2\perp p$). All three answers verified by computer algebra.</span></p>
</details></div>

<h2>Extra exam-style questions</h2>
<div class="box exam" data-t="E1 · A weighted inner product and an angle">
<p>Show $\langle u,v\rangle = 2u_1v_1+3u_2v_2$ is an inner product on $\R^2$, and find the angle between $(1,1)$ and $(1,-1)$ under it.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>Non-neg:</b> $\langle u,u\rangle = 2u_1^2+3u_2^2\ge0$. <b>Coincidence:</b> $2u_1^2+3u_2^2 = 0\iff u_1 = u_2 = 0$ (positive weights). <b>Symmetry:</b> $2u_1v_1+3u_2v_2 = 2v_1u_1+3v_2u_2$. <b>Linearity:</b> $\langle au+bv,w\rangle = 2(au_1+bv_1)w_1+3(au_2+bv_2)w_2 = a\langle u,w\rangle + b\langle v,w\rangle$.</p>
<p>$\langle(1,1),(1,-1)\rangle = 2-3 = -1$, $\lVert(1,1)\rVert^2 = \lVert(1,-1)\rVert^2 = 5$, so $\cos\theta = -\frac15$ and $\theta = \arccos(-\tfrac15)\approx1.772$ rad ($\approx101.5^\circ$). <span class="muted">Moral: "orthogonal" depends on the inner product — these two are perpendicular for the dot product but not here.</span></p>
</details></div>
<div class="box exam" data-t="E2 · Evaluation inner products: ℙ₁ vs ℙ₂">
<p>Is $\langle p,q\rangle = p(0)q(0)+p(1)q(1)$ an inner product on (a) $\P_1$, (b) $\P_2$?</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Non-negativity, symmetry and linearity hold on both (sums of products of evaluations). The issue is coincidence.</p>
<p><b>(a) Yes.</b> If $\langle p,p\rangle = p(0)^2+p(1)^2 = 0$ then $p(0) = p(1) = 0$. A polynomial of degree $\le1$ with two distinct roots is the zero polynomial. So $p = 0$.</p>
<p><b>(b) No.</b> $p(x) = x(x-1) = x^2 - x\ne0$ but $\langle p,p\rangle = 0^2+0^2 = 0$, violating coincidence.</p>
</details></div>
<div class="box exam" data-t="E3 · Orthogonal complement in ℙ₁">
<p>With $\langle f,g\rangle = \int_0^1 fg\,dx$ on $\P_1$, find $\{1+x\}^\perp$ and $\lVert1+x\rVert$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>$\lVert1+x\rVert^2 = \int_0^1(1+2x+x^2)dx = 1+1+\frac13 = \frac73$, so $\lVert1+x\rVert = \sqrt{7/3}$.<br>
For $f = a+bx$: $\langle f,1+x\rangle = \int_0^1(a + (a+b)x + bx^2)dx = a + \frac{a+b}{2} + \frac b3 = \frac{3a}{2}+\frac{5b}{6}$. Setting this to $0$: $9a+5b = 0$, so $b = -\frac95a$ and
$$\{1+x\}^\perp = \{a(1-\tfrac95x)\} = \spn\{5-9x\}.$$
Check: $\int_0^1(5-9x)(1+x)dx = 5 - 2 - 3 = 0$ ✔.</p>
</details></div>
<div class="box exam" data-t="E4 · Gram–Schmidt on {1, x, x²} with ∫₋₁¹ (Legendre!)">
<details class="reveal sol"><summary>Full solution</summary>
<p>$\lVert1\rVert^2 = 2\Rightarrow w_1 = \frac{1}{\sqrt2}$. $\;\langle x,1\rangle = \int_{-1}^1x = 0$, so $u_2 = x$, $\lVert x\rVert^2 = \frac23\Rightarrow w_2 = \sqrt{\tfrac32}\,x$.<br>
$\langle x^2,1\rangle = \frac23$, $\langle x^2,x\rangle = 0$, so $u_3 = x^2 - \frac{2/3}{2}\cdot1 = x^2-\frac13$, and $\lVert u_3\rVert^2 = \int_{-1}^1(x^4-\tfrac23x^2+\tfrac19)dx = \frac25-\frac49+\frac29 = \frac{8}{45}$.
$$w_3 = \sqrt{\tfrac{45}{8}}\Big(x^2-\tfrac13\Big) = \sqrt{\tfrac58}\,(3x^2-1).$$
These are the normalised <b>Legendre polynomials</b>.</p>
</details></div>
<div class="box exam" data-t="E5 · Prove two identities">
<p>(a) If $u\perp v$ then $\lVert u-v\rVert = \lVert u+v\rVert$. (b) Parallelogram law: $\lVert u+v\rVert^2+\lVert u-v\rVert^2 = 2\lVert u\rVert^2+2\lVert v\rVert^2$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Expanding with linearity and symmetry: $\lVert u\pm v\rVert^2 = \lVert u\rVert^2\pm2\langle u,v\rangle+\lVert v\rVert^2$.</p>
<p>(a) If $\langle u,v\rangle = 0$, both equal $\lVert u\rVert^2+\lVert v\rVert^2$; norms are non-negative, so $\lVert u-v\rVert = \lVert u+v\rVert$.<br>(b) Add the two expansions: the $\pm2\langle u,v\rangle$ terms cancel, leaving $2\lVert u\rVert^2+2\lVert v\rVert^2$.</p>
</details></div>
<div class="box exam" data-t="E6 · Cauchy–Schwarz application">
<p>Prove that $(a+b+c)^2\le3(a^2+b^2+c^2)$ for all real $a,b,c$. When does equality hold?</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Apply Cauchy–Schwarz with the dot product to $u = (a,b,c)$, $v = (1,1,1)$: $|u\cdot v|\le\lVert u\rVert\lVert v\rVert$, i.e. $|a+b+c|\le\sqrt{a^2+b^2+c^2}\,\sqrt3$. Squaring gives the result. Equality iff $u,v$ dependent iff $a = b = c$.</p>
</details></div>
<div class="box exam" data-t="E7 · W⊥ in ℝ⁴ and the dimension count">
<p>$W = \spn\{(1,1,0,0),(0,1,1,0)\}$. Find $W^\perp$ and verify $\dim W+\dim W^\perp = 4$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>$(x,y,z,w)\in W^\perp\iff x+y = 0$ and $y+z = 0\iff x = -y$, $z = -y$, $w$ free. So
$$W^\perp = \{(-y,y,-y,w)\} = \spn\{(-1,1,-1,0),(0,0,0,1)\},$$ dimension 2. $W$ has dimension 2 (two non-parallel vectors). $2+2 = 4$ ✔.</p>
</details></div>
<div class="box exam" data-t="E8 · Coordinates in an orthonormal basis">
<p>Show $\{u_1,u_2,u_3\} = \big\{\tfrac{1}{\sqrt3}(1,1,1),\tfrac{1}{\sqrt2}(1,-1,0),\tfrac{1}{\sqrt6}(1,1,-2)\big\}$ is an orthonormal basis of $\R^3$ and express $(3,1,2)$ in it.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Pairwise dot products: $(1,1,1)\cdot(1,-1,0) = 0$, $(1,1,1)\cdot(1,1,-2) = 0$, $(1,-1,0)\cdot(1,1,-2) = 0$; norms: $\frac{3}{3} = \frac22 = \frac66 = 1$. Orthonormal ⇒ independent (Thm 4.2.11); three independent vectors in $\R^3$ ⇒ basis.</p>
<p>Coordinates are inner products: $\langle v,u_1\rangle = \frac{6}{\sqrt3} = 2\sqrt3$, $\langle v,u_2\rangle = \frac{2}{\sqrt2} = \sqrt2$, $\langle v,u_3\rangle = \frac{3+1-4}{\sqrt6} = 0$. So $(3,1,2) = 2\sqrt3\,u_1+\sqrt2\,u_2+0\,u_3$. Check: $(2,2,2)+(1,-1,0) = (3,1,2)$ ✔.</p>
</details></div>
<div class="box exam" data-t="E9 · Not an inner product — find the failing axiom">
<p>(a) $\langle x,y\rangle = x_1y_1 + x_1y_2 + x_2y_1$ on $\R^2$. (b) $\langle A,B\rangle = \operatorname{tr}(A)\operatorname{tr}(B)$ on $\R^{2\times2}$. (c) $\langle p,q\rangle = \int_0^1 p(x)q(x)\,dx$ on $\P_2$.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>(a) Fails non-negativity: $x = (1,-1)$ gives $1-1-1 = -1\lt0$. &nbsp; (b) Fails coincidence: $A = \begin{pmatrix}1&0\\0&-1\end{pmatrix}\neq0$ but $\operatorname{tr}(A)^2 = 0$. &nbsp; (c) <b>It is</b> an inner product (trick question!): $\int_0^1p^2 = 0$ forces $p\equiv0$ on $[0,1]$, so $p$ has infinitely many roots and is the zero polynomial.</p>
</details></div>
`;
})();
