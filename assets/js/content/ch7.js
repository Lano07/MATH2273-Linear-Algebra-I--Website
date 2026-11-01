/* Chapter 7 — Eigenvalues and Eigenvectors */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch7", num: 7, title: "Eigenvalues & Eigenvectors", short: "Eigenvalues & Eigenvectors", pages: "76–84", quiz: "ch7",
    blurb: "Eigenvalues, eigenvectors and eigenspaces, the characteristic polynomial, algebraic vs geometric multiplicity, diagonalization, and the Cayley–Hamilton Theorem (with matrix inverses).",
    labs: [["Eigen Lab", "#/labs/eigen"], ["2D Visualizer (eigenvectors)", "#/labs/transform"]],
    goals: [
      "Find the characteristic polynomial, eigenvalues and eigenspaces (over ℝ or ℂ).",
      "Compute algebraic and geometric multiplicities and decide diagonalizability correctly.",
      "Build P and D with P⁻¹AP = D.",
      "Use Cayley–Hamilton to compute inverses (and powers).",
    ],
    intro: H`<div class="kicker">The picture</div><p>Most vectors get knocked off their line by $A$. <b>Eigenvectors</b> are the special directions that stay on their own line: $Ax = \lambda x$ — $A$ only stretches them by the factor $\lambda$. In the <a href="#/labs/transform">2D Visualizer</a>, turn on "eigenvectors" and watch those lines stay put while everything else rotates.</p>`,
    sections: [
      { id: "7.1", title: "Eigenvalues, eigenvectors, characteristic polynomial", html: H`
<div class="box def" data-t="7.1.1 · Eigenvalue, eigenvector, eigenspace">
<p>$\lambda\in\FF$ is an <b>eigenvalue</b> of $A\in\FF^{n\times n}$ if $Ax = \lambda x$ for some <b>non-zero</b> $x$, called an <b>eigenvector</b>. The <b>eigenspace</b> of $\lambda$ is $\Null(A-\lambda I) = \{x : Ax = \lambda x\}$ (all eigenvectors for $\lambda$, plus $0$).</p>
</div>
<div class="box thm" data-t="7.1.2 · λ is an eigenvalue ⇔ det(A − λI) = 0">
<p>$\lambda$ eigenvalue ⇔ $(A-\lambda I)x = 0$ has a non-trivial solution ⇔ $A-\lambda I$ is singular ⇔ $\det(A-\lambda I) = 0$.</p>
</div>
<div class="box def" data-t="7.1.3 · Characteristic polynomial and equation">
<p>$p_A(\lambda) = \det(A-\lambda I)$ (degree $n$); $p_A(\lambda) = 0$ is the characteristic equation.</p>
</div>
<div class="box recipe" data-t="7.1.4 · Eigen-routine">
<ol class="recipe-steps"><li>Compute $p_A(\lambda) = \det(A-\lambda I)$ and factor it.</li><li>Roots = eigenvalues (in the given field!).</li><li>For each $\lambda$: row-reduce $A-\lambda I$, solve $(A-\lambda I)x = 0$, write the eigenspace as a span.</li><li>Check one eigenvector: $Ax = \lambda x$.</li></ol>
</div>
<div class="box tip" data-t="Characteristic-polynomial shortcuts">
<ul><li>$2\times2$: $p_A(\lambda) = \lambda^2 - (\operatorname{tr}A)\lambda + \det A$.</li>
<li>$3\times3$: $p_A(\lambda) = -\lambda^3 + (\operatorname{tr}A)\lambda^2 - (M_{11}+M_{22}+M_{33})\lambda + \det A$ (sum of principal $2\times2$ minors).</li>
<li>Sum of eigenvalues = trace; product = determinant (with multiplicity, over $\C$). Great for checking.</li>
<li>Triangular matrix: eigenvalues are the diagonal entries.</li>
<li>The matrix $A - \lambda I$ must be singular — if your row reduction gives full rank, your $\lambda$ is wrong.</li></ul>
</div>
<div class="box ex" data-t="7.1.5(i) · Two real eigenvalues">
<p>$A = \begin{pmatrix}1&2\\2&-2\end{pmatrix}$: $p(\lambda) = (1-\lambda)(-2-\lambda)-4 = \lambda^2+\lambda-6 = (\lambda-2)(\lambda+3)$, so $\lambda = 2, -3$.</p>
<p>$\lambda = 2$: $A-2I = \begin{pmatrix}-1&2\\2&-4\end{pmatrix}\cong\begin{pmatrix}-1&2\\0&0\end{pmatrix}$ ⇒ $x_1 = 2x_2$; eigenspace $\spn\{(2,1)^T\}$.<br>
$\lambda = -3$: $A+3I = \begin{pmatrix}4&2\\2&1\end{pmatrix}\cong\begin{pmatrix}4&2\\0&0\end{pmatrix}$ ⇒ $x_2 = -2x_1$; eigenspace $\spn\{(1,-2)^T\}$. Each nullity is $2-1 = 1$.</p>
</div>
<div class="box ex" data-t="7.1.5(ii) · A repeated eigenvalue">
<p>$A = \begin{pmatrix}2&0\\-1&2\end{pmatrix}$: $p(\lambda) = (\lambda-2)^2$, so $\lambda = 2,2$. $A-2I = \begin{pmatrix}0&0\\-1&0\end{pmatrix}$ ⇒ $x_1 = 0$; eigenspace $\spn\{(0,1)^T\}$ — only <b>one</b> dimension despite the double root.</p>
</div>
<div class="box ex" data-t="7.1.5(iii) · Complex eigenvalues (over ℂ)">
<p>$A = \begin{pmatrix}3&0&0\\4&0&1\\3&-1&0\end{pmatrix}$: expand along row 1: $p(\lambda) = (3-\lambda)(\lambda^2+1)$, so $\lambda = 3, i, -i$.</p>
<ul><li>$\lambda = 3$: eigenspace $\spn\{(2,3,1)^T\}$ (check: $A(2,3,1)^T = (6,9,3)^T$ ✔).</li>
<li>$\lambda = i$: $x_1 = 0$, $x_3 = ix_2$; eigenspace $\spn\{(0,1,i)^T\}$.</li>
<li>$\lambda = -i$: eigenspace $\spn\{(0,1,-i)^T\}$ (complex conjugate — always happens for real $A$).</li></ul>
<p class="small muted">Remark 7.1.6: over $\R$, only $\lambda = 3$ is an eigenvalue. The field matters. <span class="muted">(The notes write the eigenspaces with "$x_2\in\R$"; over $\C$ the parameter should range over $\C$.)</span></p>
</div>` },
      { id: "7.2", title: "Spectrum and multiplicities", html: H`
<div class="box def" data-t="7.2.1 · Spectrum, algebraic and geometric multiplicity">
<p><b>Spectrum</b> $\sigma(A)$ = list of eigenvalues with repetition. <b>Algebraic multiplicity</b> of $\lambda$ = how many times it appears (its multiplicity as a root of $p_A$). <b>Geometric multiplicity</b> = $\dim\Null(A-\lambda I)$ = $n - \Rank(A-\lambda I)$.</p>
</div>
<div class="box ex" data-t="7.2.2 · Multiplicities">
<p>(i) $\begin{pmatrix}0&2\\-2&0\end{pmatrix}$: $\lambda^2+4 = 0$, $\sigma = \{2i,-2i\}$; each has algebraic and geometric multiplicity 1.<br>
(ii) $\begin{pmatrix}1&0\\-1&1\end{pmatrix}$: $\sigma = \{1,1\}$; algebraic multiplicity 2, but $\Rank(A-I) = 1$ so geometric multiplicity $2-1 = 1$.</p>
</div>
<div class="box thm" data-t="7.2.3 · Similar matrices have the same spectrum">
<p>If $B = P^{-1}AP$ then $p_B(\lambda) = \det(P^{-1}(A-\lambda I)P) = \det(P^{-1})\det(A-\lambda I)\det(P) = p_A(\lambda)$.</p>
</div>
<div class="box thm" data-t="7.2.4 · Geometric ≤ algebraic">
<p>For every eigenvalue: $1\le$ geometric multiplicity $\le$ algebraic multiplicity.</p>
</div>` },
      { id: "7.3", title: "Diagonalization and Cayley–Hamilton", html: H`
<div class="box def" data-t="7.3.1 · Diagonalizable">
<p>$A$ is diagonalizable if $P^{-1}AP = D$ for some invertible $P$ and diagonal $D$.</p>
</div>
<div class="box thm" data-t="7.3.2 · How to diagonalize">
<p>(i) $P^{-1}AP = \diag(d_1,\dots,d_n)$ ⇔ column $i$ of $P$ is an eigenvector for $d_i$. (ii) $A$ is diagonalizable ⇔ $A$ has $n$ linearly independent eigenvectors.</p>
</div>
<div class="box thm" data-t="7.3.3 · Distinct eigenvalues ⇒ diagonalizable (corrected statement)">
<p>If $A\in\FF^{n\times n}$ has $n$ <b>distinct</b> eigenvalues in $\FF$, then $A$ is diagonalizable (eigenvectors for distinct eigenvalues are independent).</p>
<div class="box errata" data-t="The notes state this as “if and only if” — the converse is false">
<p>$I_2 = \begin{pmatrix}1&0\\0&1\end{pmatrix}$ is already diagonal (so diagonalizable) but has the repeated eigenvalue $1,1$. <b>The correct test:</b> $A$ is diagonalizable over $\FF$ iff $p_A$ splits over $\FF$ and, for every eigenvalue, <b>geometric multiplicity = algebraic multiplicity</b>. Example 7.3.4(i) is still right — because the geometric multiplicity of $\lambda = 1$ there is 1 &lt; 2.</p></div>
</div>
<div class="box ex" data-t="7.3.4 · Diagonalizable or not?">
<p>(i) $\begin{pmatrix}1&1\\0&1\end{pmatrix}$: $\lambda = 1,1$; $A-I = \begin{pmatrix}0&1\\0&0\end{pmatrix}$ has rank 1, so only one independent eigenvector ⇒ <b>not diagonalizable</b>.</p>
<p>(ii) $A = \begin{pmatrix}3&0&0\\4&0&1\\3&-1&0\end{pmatrix}$ has distinct eigenvalues $3,i,-i$ ⇒ diagonalizable over $\C$:
$$P = \begin{pmatrix}2&0&0\\3&1&1\\1&i&-i\end{pmatrix},\qquad P^{-1}AP = D = \begin{pmatrix}3&0&0\\0&i&0\\0&0&-i\end{pmatrix}.$$
The order of eigenvalues in $D$ matches the order of eigenvectors in $P$.</p>
</div>
<div class="box thm" data-t="7.3.5 · Cayley–Hamilton">
<p>Every $A\in\C^{n\times n}$ satisfies its own characteristic equation: $p_A(A) = 0$ (the zero matrix).</p>
</div>
<div class="box recipe" data-t="7.3.6 · Inverse via Cayley–Hamilton">
<ol class="recipe-steps"><li>Compute $p_A(\lambda)$; check its constant term $= \det A\ne0$.</li><li>Replace $\lambda$ by $A$ and constants $c$ by $cI$: $p_A(A) = 0$.</li><li>Multiply by $A^{-1}$ (every power drops by one; $cI\mapsto cA^{-1}$).</li><li>Solve for $A^{-1}$ and compute.</li></ol>
</div>
<div class="box ex" data-t="7.3.7 · Inverses with Cayley–Hamilton">
<p><b>(i)</b> $A = \begin{pmatrix}1&-1\\2&2\end{pmatrix}$, $\det A = 4$. $p_A(\lambda) = \lambda^2-3\lambda+4$, so $A^2-3A+4I = 0$ ⇒ $A-3I+4A^{-1} = 0$ ⇒
$$A^{-1} = \tfrac14(3I-A) = \tfrac14\begin{pmatrix}2&1\\-2&1\end{pmatrix}.$$</p>
<p><b>(ii)</b> $A = \begin{pmatrix}1&2&-1\\2&4&3\\-1&1&1\end{pmatrix}$, $\det A = -15$. $p_A(\lambda) = -\lambda^3+6\lambda^2-\lambda-15$, so $-A^3+6A^2-A-15I = 0$ ⇒ $A^{-1} = \frac1{15}(-A^2+6A-I)$. With $A^2 = \begin{pmatrix}6&9&4\\7&23&13\\0&3&5\end{pmatrix}$:
$$A^{-1} = \frac{1}{15}\begin{pmatrix}-1&3&-10\\5&0&5\\-6&3&0\end{pmatrix}.$$</p>
</div>
<div class="box ex" data-t="7.3.8 · The 2×2 inverse formula from Cayley–Hamilton">
<p>For $A = \begin{pmatrix}a&b\\c&d\end{pmatrix}$: $p(\lambda) = \lambda^2-(a+d)\lambda+(ad-bc)$, so $A^2-(a+d)A+(ad-bc)I = 0$. Multiply by $A^{-1}$: $A-(a+d)I+(ad-bc)A^{-1} = 0$, hence
$$A^{-1} = \frac{(a+d)I - A}{ad-bc} = \frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}.$$
<p class="small muted">(The notes print the (2,1) entry of $A-\lambda I$ as $b$; it should be $c$.)</p>
</div>
<div class="box beyond" data-t="Why diagonalization is worth it">
<p>If $A = PDP^{-1}$ then $A^k = PD^kP^{-1}$ and $D^k$ is trivial to compute — that is how matrix powers, recurrences (Fibonacci!) and systems of differential equations are solved. Cayley–Hamilton also reduces any power $A^k$ to a combination of $I, A,\dots,A^{n-1}$.</p>
</div>` },
    ],
    exercises: H`
<h2>Exercise 7 — full solutions</h2>
<p class="muted">For each matrix: eigenvalues & eigenspaces over $\C$; an invertible $P$ with $P^{-1}AP$ diagonal (if possible); and the inverse via Cayley–Hamilton (if it exists).</p>
<div class="box exam" data-t="(a) A = [[1, 3], [−3, 1]]">
<details class="reveal sol"><summary>Full solution</summary>
<p>$p(\lambda) = \lambda^2-2\lambda+10$ ⇒ $\lambda = 1\pm3i$.<br>
$\lambda = 1+3i$: $A-\lambda I = \begin{pmatrix}-3i&3\\-3&-3i\end{pmatrix}$ ⇒ $-3ix_1+3x_2 = 0$ ⇒ $x_2 = ix_1$: eigenspace $\spn\{(1,i)^T\}$. $\lambda = 1-3i$: $\spn\{(1,-i)^T\}$.<br>
$P = \begin{pmatrix}1&1\\i&-i\end{pmatrix}$, $D = \diag(1+3i,\,1-3i)$ (distinct eigenvalues ⇒ diagonalizable over $\C$; not over $\R$).<br>
Cayley–Hamilton: $A^2-2A+10I = 0$ ⇒ $A^{-1} = \frac{1}{10}(2I-A) = \frac{1}{10}\begin{pmatrix}1&-3\\3&1\end{pmatrix}$.</p>
</details></div>
<div class="box exam" data-t="(b) A = [[4, −2], [−3, 4]]">
<details class="reveal sol"><summary>Full solution</summary>
<p>$p(\lambda) = \lambda^2-8\lambda+10$ ⇒ $\lambda = 4\pm\sqrt6$.<br>
$\lambda = 4+\sqrt6$: $-\sqrt6x_1-2x_2 = 0$ ⇒ eigenspace $\spn\{(2,-\sqrt6)^T\}$. $\lambda = 4-\sqrt6$: $\spn\{(2,\sqrt6)^T\}$.<br>
$P = \begin{pmatrix}2&2\\-\sqrt6&\sqrt6\end{pmatrix}$, $D = \diag(4+\sqrt6,\,4-\sqrt6)$.<br>
$A^2-8A+10I = 0$ ⇒ $A^{-1} = \frac{1}{10}(8I-A) = \frac1{10}\begin{pmatrix}4&2\\3&4\end{pmatrix}$.</p>
</details></div>
<div class="box exam" data-t="(c) A = [[2, 1], [6, 3]]">
<details class="reveal sol"><summary>Full solution</summary>
<p>$p(\lambda) = \lambda^2-5\lambda = \lambda(\lambda-5)$ ⇒ $\lambda = 0,5$.<br>
$\lambda = 0$: $2x_1+x_2 = 0$ ⇒ $\spn\{(1,-2)^T\}$. $\lambda = 5$: $-3x_1+x_2 = 0$ ⇒ $\spn\{(1,3)^T\}$.<br>
$P = \begin{pmatrix}1&1\\-2&3\end{pmatrix}$, $D = \diag(0,5)$.<br>
<b>No inverse:</b> $\det A = 0$ (the constant term of $p$ is 0, and $0$ is an eigenvalue), so Cayley–Hamilton cannot be solved for $A^{-1}$.</p>
</details></div>
<div class="box exam" data-t="(d) A = [[1, 4, 2], [0, 0, 4], [0, 0, 9]]">
<details class="reveal sol"><summary>Full solution</summary>
<p>Upper triangular ⇒ eigenvalues $1, 0, 9$ (diagonal entries); $p(\lambda) = -\lambda(\lambda-1)(\lambda-9)$.<br>
$\lambda = 1$: $\spn\{(1,0,0)^T\}$. $\lambda = 0$: $x_3 = 0$, $x_1+4x_2 = 0$ ⇒ $\spn\{(-4,1,0)^T\}$. $\lambda = 9$: from $-9x_2+4x_3 = 0$ and $-8x_1+4x_2+2x_3 = 0$ ⇒ $\spn\{(17,16,36)^T\}$ (check: $A(17,16,36)^T = (153,144,324)^T = 9(17,16,36)^T$ ✔).<br>
$P = \begin{pmatrix}1&-4&17\\0&1&16\\0&0&36\end{pmatrix}$, $D = \diag(1,0,9)$.<br>
<b>No inverse:</b> $\det A = 1\cdot0\cdot9 = 0$.</p>
</details></div>`,
    summary: H`<div class="card glow"><div class="kicker">Chapter 7 on one page</div><div class="tbl-wrap"><table class="tbl">
<tr><th>Idea</th><th>Key fact</th></tr>
<tr><td>Eigen-equation</td><td>$Ax = \lambda x$, $x\ne0$ ⇔ $\det(A-\lambda I) = 0$</td></tr>
<tr><td>Eigenspace</td><td>$\Null(A-\lambda I)$</td></tr>
<tr><td>$2\times2$ char. poly</td><td>$\lambda^2-\operatorname{tr}(A)\lambda+\det A$</td></tr>
<tr><td>Checks</td><td>$\sum\lambda_i = \operatorname{tr}A$, $\prod\lambda_i = \det A$</td></tr>
<tr><td>Multiplicities</td><td>$1\le$ geometric $\le$ algebraic</td></tr>
<tr><td>Diagonalizable</td><td>$n$ independent eigenvectors ⇔ geo = alg for all $\lambda$; distinct eigenvalues suffice</td></tr>
<tr><td>$P$, $D$</td><td>columns of $P$ = eigenvectors, $D$ = matching eigenvalues</td></tr>
<tr><td>Similar</td><td>same characteristic polynomial and spectrum</td></tr>
<tr><td>Cayley–Hamilton</td><td>$p_A(A) = 0$; multiply by $A^{-1}$ to get the inverse</td></tr></table></div></div>`,
  });
})();
