/* Chapter 8 — Quadratic Forms (official MATH2273 syllabus topic; not in the Chapters 1–7 notes). All numbers CAS-verified. */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch8", num: 8, title: "Quadratic Forms & Orthogonal Diagonalization", short: "Quadratic Forms", pages: "syllabus topic (not in the notes)", quiz: "ch8",
    blurb: "Quadratic forms and their symmetric matrices, orthogonal matrices, the spectral (principal axes) theorem, definiteness tests including Sylvester's criterion, conics and level curves, and optimisation with Hessians.",
    labs: [["Quadratic Forms Lab", "#/labs/quadratic"], ["Eigen Lab", "#/labs/eigen"], ["Gram–Schmidt Machine", "#/labs/gram-schmidt"]],
    goals: [
      "Convert between a quadratic expression and its (unique) symmetric matrix — remembering the factor ½ on cross terms.",
      "Prove that real symmetric matrices have real eigenvalues and orthogonal eigenvectors, and orthogonally diagonalize them (including repeated eigenvalues).",
      "Remove cross terms with the Principal Axes Theorem and identify the conic $Q(x,y) = c$.",
      "Classify a form as positive/negative (semi)definite or indefinite with the eigenvalue test and Sylvester's criterion — knowing exactly when each test applies.",
      "Solve constrained max/min problems on the unit sphere and classify critical points with the Hessian.",
    ],
    intro: H`<div class="box note" data-t="Where this chapter comes from" data-level="f">
<p>The official MATH2273 course outline (UWI St. Augustine, Department of Mathematics &amp; Statistics) states that <i>"a treatise on quadratic forms, diagonalization of matrices and the Cayley–Hamilton theorem is included"</i>. Your Chapters 1–7 notes stop before quadratic forms, so this chapter was written from the official outline and standard references (Anton &amp; Rorres, Strang, Axler). Numbering here (8.x.y) is <b>this site's</b>, not your lecturer's — when your lecturer covers the topic, follow their notation in tests.</p></div>
<div class="kicker">The one big idea</div>
<p style="font-size:1.08rem">A <b>quadratic form</b> is a "pure second-degree" function like $5x^2-4xy+8y^2$. Every one of them is secretly $x^TAx$ for a <b>symmetric</b> matrix $A$, and because symmetric matrices can always be diagonalized by a <b>rotation</b>, every quadratic form becomes a simple sum of squares $\lambda_1y_1^2+\dots+\lambda_ny_n^2$ in the right coordinates. The eigenvalues then tell you everything: the shape of the level curves, whether the form is always positive, and its largest and smallest values on the unit circle.</p>`,
    sections: [
      { id: "8.1", title: "Quadratic forms and their symmetric matrices", html: H`
<div class="box def" data-t="8.1.1 · Quadratic form">
<p>A <b>quadratic form</b> on $\R^n$ is a function $Q:\R^n\to\R$ that is a homogeneous polynomial of degree 2:
$$Q(x_1,\dots,x_n) = \sum_{i\le j} c_{ij}\,x_ix_j.$$
Every term has total degree exactly 2 — no constants, no linear terms.</p>
<p>Examples: $Q(x,y) = 3x^2+4xy-y^2$; $\;Q(x,y,z) = x^2+2y^2-z^2+2xy-6yz$. Non-examples: $x^2+3x$ (linear term), $x^2+1$ (constant), $xyz$ (degree 3).</p>
</div>
<div class="box thm" data-t="8.1.2 · Matrix representation">
<p>Every quadratic form can be written uniquely as
$$Q(x) = x^TAx\qquad\text{with } A \text{ symmetric } (A^T = A),$$
where $a_{ii}$ = the coefficient of $x_i^2$, and $a_{ij} = a_{ji} = \tfrac12\times$ the coefficient of $x_ix_j$ ($i\neq j$).</p>
</div>
<div class="box proof" data-t="of Theorem 8.1.2">
<p>For symmetric $A$, expanding the product gives
$$x^TAx = \sum_{i,j}a_{ij}x_ix_j = \sum_i a_{ii}x_i^2 + \sum_{i\lt j}(a_{ij}+a_{ji})x_ix_j = \sum_i a_{ii}x_i^2+\sum_{i\lt j}2a_{ij}x_ix_j.$$
Matching coefficients with $Q$ forces $a_{ii} = c_{ii}$ and $2a_{ij} = c_{ij}$, so $A$ exists and is uniquely determined by $Q$.</p>
<p class="small muted">If $B$ is <i>any</i> square matrix, $x^TBx = x^T\big(\tfrac{B+B^T}{2}\big)x$ (since $x^TBx$ is a $1\times1$ matrix, it equals its transpose $x^TB^Tx$). So we may always replace $B$ by its symmetric part — that is why we insist on symmetric $A$.</p>
</div>
<div class="box ex" data-t="8.1.3 · From expression to matrix (and back)">
$$3x^2+4xy-y^2 = \begin{pmatrix}x&y\end{pmatrix}\begin{pmatrix}3&2\\2&-1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix},\qquad x^2+2y^2-z^2+2xy-6yz \leftrightarrow \begin{pmatrix}1&1&0\\1&2&-3\\0&-3&-1\end{pmatrix}.$$
<p>Back: $A = \begin{pmatrix}4&-1&0\\-1&3&2\\0&2&-2\end{pmatrix}$ gives $Q = 4x^2+3y^2-2z^2-2xy+4yz$ (diagonal entries → squares; each off-diagonal pair doubles up).</p>
</div>
<div class="box trap" data-t="The factor ½ on cross terms">
<p>The most common error: putting the whole cross coefficient in both off-diagonal slots. $4xy$ contributes $2$ to $a_{12}$ <b>and</b> $2$ to $a_{21}$ (total 4), not 4 to each. Check by expanding $x^TAx$ — it takes 20 seconds.</p>
</div>
<div class="box intuition" data-t="Why quadratic forms matter">
<ul><li>They are the <b>second-order part</b> of every smooth function: $f(a+h)\approx f(a)+\nabla f(a)\cdot h+\tfrac12h^THh$, so they decide whether a critical point is a max, min or saddle (§8.5).</li>
<li>Their level sets are the <b>conics</b> (ellipses, hyperbolas) and <b>quadric surfaces</b> of geometry.</li>
<li>Energy ($\tfrac12mv^2$, $\tfrac12kx^2$), variance in statistics ($w^T\Sigma w$) and least-squares error are all quadratic forms.</li></ul>
</div>
<div class="box beyond" data-t="Bilinear forms (connection to Chapter 4)">
<p>$B(x,y) = x^TAy$ is linear in each argument — a <b>bilinear form</b>, and $Q(x) = B(x,x)$. When $A$ is symmetric and positive definite (§8.4), $B$ is exactly an <b>inner product</b> on $\R^n$: the weighted dot products of Chapter 4 ($2u_1v_1+3u_2v_2$ has $A = \diag(2,3)$) are special cases. So "is this an inner product?" on $\R^n$ is the same question as "is this symmetric matrix positive definite?".</p>
</div>` },

      { id: "8.2", title: "Orthogonal matrices and the spectral theorem", html: H`
<div class="box def" data-t="8.2.1 · Orthogonal matrix">
<p>A real $n\times n$ matrix $P$ is <b>orthogonal</b> if $P^TP = I$, i.e. its columns form an <b>orthonormal</b> set (equivalently $P^{-1} = P^T$).</p>
</div>
<div class="box prop" data-t="8.2.2 · Properties of orthogonal matrices">
<p>If $P$ is orthogonal then (i) $(Px)\cdot(Py) = x\cdot y$ (angles preserved); (ii) $\lVert Px\rVert = \lVert x\rVert$ (lengths preserved); (iii) $\det P = \pm1$; (iv) $P^T$ and products of orthogonal matrices are orthogonal.</p>
</div>
<div class="box proof" data-t="of Proposition 8.2.2">
<p>(i) $(Px)\cdot(Py) = (Px)^T(Py) = x^TP^TPy = x^Ty$. (ii) take $y = x$. (iii) $1 = \det I = \det(P^TP) = (\det P)^2$. (iv) $(P^T)^TP^T = PP^T = I$ because $P^T = P^{-1}$; and $(PQ)^T(PQ) = Q^TP^TPQ = Q^TQ = I$.</p>
</div>
<div class="box intuition" data-t="What an orthogonal matrix does">
<p>It is a <b>rigid motion fixing the origin</b>: a rotation ($\det P = 1$) or a reflection ($\det P = -1$). Nothing is stretched — which is why changing coordinates by $P$ never distorts the shape of a conic, it only turns it.</p>
</div>
<div class="box thm" data-t="8.2.3 · Symmetric matrices have real eigenvalues">
<p>Every eigenvalue of a real symmetric matrix is real.</p>
</div>
<div class="box proof" data-t="of Theorem 8.2.3">
<p>Let $Av = \lambda v$ with $v\in\C^n$, $v\neq0$. Write $\bar v$ for the complex conjugate. Since $A$ is real and symmetric, $\bar v^TA = (A\bar v)^T = (\overline{Av})^T = \bar\lambda\,\bar v^T$. Hence
$$\lambda\,\bar v^Tv = \bar v^T(Av) = (\bar v^TA)v = \bar\lambda\,\bar v^Tv.$$
But $\bar v^Tv = |v_1|^2+\dots+|v_n|^2\gt0$, so $\lambda = \bar\lambda$, i.e. $\lambda\in\R$.</p>
</div>
<div class="box thm" data-t="8.2.4 · Eigenvectors for distinct eigenvalues are orthogonal">
<p>If $A$ is symmetric, $Av_1 = \lambda_1v_1$, $Av_2 = \lambda_2v_2$ and $\lambda_1\neq\lambda_2$, then $v_1\cdot v_2 = 0$.</p>
</div>
<div class="box proof" data-t="of Theorem 8.2.4">
$$\lambda_1(v_1\cdot v_2) = (Av_1)\cdot v_2 = v_1^TA^Tv_2 = v_1^TAv_2 = v_1\cdot(Av_2) = \lambda_2(v_1\cdot v_2).$$
<p>So $(\lambda_1-\lambda_2)(v_1\cdot v_2) = 0$, and $\lambda_1\neq\lambda_2$ gives $v_1\cdot v_2 = 0$.</p>
</div>
<div class="box thm" data-t="8.2.5 · The Spectral Theorem (orthogonal diagonalization) ★">
<p>A real $n\times n$ matrix $A$ is <b>orthogonally diagonalizable</b> — there is an orthogonal $P$ with $P^TAP = D$ diagonal — <b>if and only if $A$ is symmetric</b>. The columns of $P$ are orthonormal eigenvectors and $D$ holds the matching eigenvalues.</p>
</div>
<div class="box proof" data-t="of Theorem 8.2.5">
<p><b>(⇐ easy direction, often examined):</b> if $P^TAP = D$ with $P$ orthogonal then $A = PDP^T$, so $A^T = (P^T)^TD^TP^T = PDP^T = A$.</p>
<p><b>(⇒) by induction on $n$</b> <span class="muted">(the full proof is standard Linear Algebra II material; here is the complete argument)</span>. For $n = 1$ there is nothing to prove. Let $A$ be symmetric $n\times n$. By Theorem 8.2.3 it has a real eigenvalue $\lambda_1$ with a unit eigenvector $u_1$. Extend $u_1$ to an orthonormal basis $u_1,\dots,u_n$ of $\R^n$ (Gram–Schmidt) and let $U = (u_1|\cdots|u_n)$. Then $U^TAU$ is symmetric and its first column is $U^TAu_1 = \lambda_1U^Tu_1 = \lambda_1e_1$; by symmetry its first row is $\lambda_1e_1^T$ too:
$$U^TAU = \begin{pmatrix}\lambda_1&0\\0&A_1\end{pmatrix},\quad A_1\ \text{symmetric }(n-1)\times(n-1).$$
By induction $A_1 = Q_1D_1Q_1^T$ with $Q_1$ orthogonal. Then $P = U\begin{pmatrix}1&0\\0&Q_1\end{pmatrix}$ is orthogonal (product of orthogonal matrices) and $P^TAP = \diag(\lambda_1,D_1)$.</p>
</div>
<div class="box recipe" data-t="Orthogonally diagonalize a symmetric matrix">
<ol class="recipe-steps">
<li>Find the eigenvalues (they are real — Theorem 8.2.3).</li>
<li>For each eigenvalue find a basis of its eigenspace $\Null(A-\lambda I)$.</li>
<li><b>Repeated eigenvalue?</b> Apply Gram–Schmidt <i>inside</i> that eigenspace. Different eigenspaces are already orthogonal (Theorem 8.2.4).</li>
<li>Normalise every vector; put them as the columns of $P$, and the matching eigenvalues (same order) on the diagonal of $D$.</li>
<li>Check: $P^TP = I$ and $AP = PD$.</li>
</ol>
</div>
<div class="box ex" data-t="8.2.6 · Distinct eigenvalues">
<p>$A = \begin{pmatrix}3&1\\1&3\end{pmatrix}$: $p(\lambda) = (\lambda-4)(\lambda-2)$. Eigenvectors $(1,1)$ for $4$ and $(1,-1)$ for $2$ — orthogonal, as promised.</p>
$$P = \frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\qquad P^TAP = \begin{pmatrix}4&0\\0&2\end{pmatrix}.$$
</div>
<div class="box ex" data-t="8.2.7 · A repeated eigenvalue (Gram–Schmidt needed)">
<p>$A = \begin{pmatrix}2&1&1\\1&2&1\\1&1&2\end{pmatrix}$: $p(\lambda) = -(\lambda-4)(\lambda-1)^2$.</p>
<div class="stepper">
<div class="step">$\lambda = 4$: eigenspace $\spn\{(1,1,1)\}$. $\;\lambda = 1$: $A-I$ has every row $(1,1,1)$, so the eigenspace is the plane $x+y+z = 0$ with basis $v_1 = (-1,1,0)$, $v_2 = (-1,0,1)$ — <b>not</b> orthogonal ($v_1\cdot v_2 = 1$).</div>
<div class="step">Gram–Schmidt inside the plane: $u_1 = (-1,1,0)$, $u_2 = v_2 - \tfrac{1}{2}u_1 = \big(-\tfrac12,-\tfrac12,1\big)\parallel(-1,-1,2)$.</div>
<div class="step">Normalise: $$P = \begin{pmatrix}\tfrac1{\sqrt3}&-\tfrac1{\sqrt2}&-\tfrac1{\sqrt6}\\ \tfrac1{\sqrt3}&\tfrac1{\sqrt2}&-\tfrac1{\sqrt6}\\ \tfrac1{\sqrt3}&0&\tfrac2{\sqrt6}\end{pmatrix},\qquad P^TAP = \diag(4,1,1).$$ (Verified: $P^TP = I$.)</div>
</div>
</div>
<div class="box trap" data-t="Diagonalizable ≠ orthogonally diagonalizable">
<p>$\begin{pmatrix}1&1\\0&2\end{pmatrix}$ has distinct eigenvalues, so it is diagonalizable (Chapter 7), but its eigenvectors $(1,0)$ and $(1,1)$ are not orthogonal — and it is not symmetric — so no <i>orthogonal</i> $P$ works. Orthogonal diagonalization is a privilege of symmetric matrices.</p>
</div>` },

      { id: "8.3", title: "Principal axes and conics", html: H`
<div class="box thm" data-t="8.3.1 · Principal Axes Theorem ★">
<p>Let $Q(x) = x^TAx$ with $A$ symmetric, and let $P$ be orthogonal with $P^TAP = D = \diag(\lambda_1,\dots,\lambda_n)$. The change of variables $x = Py$ (i.e. $y = P^Tx$) turns $Q$ into a form <b>with no cross terms</b>:
$$Q = \lambda_1y_1^2+\lambda_2y_2^2+\dots+\lambda_ny_n^2.$$
The columns of $P$ (unit eigenvectors) are the <b>principal axes</b> of $Q$.</p>
</div>
<div class="box proof" data-t="of Theorem 8.3.1">
<p>$x^TAx = (Py)^TA(Py) = y^T(P^TAP)y = y^TDy = \sum_i\lambda_iy_i^2$. Because $P$ is orthogonal, $\lVert x\rVert = \lVert y\rVert$: the new coordinates are just the old ones measured along rotated (or reflected) axes.</p>
</div>
<div class="box ex" data-t="8.3.2 · Identify the conic 5x² − 4xy + 8y² = 36">
<div class="stepper">
<div class="step">$A = \begin{pmatrix}5&-2\\-2&8\end{pmatrix}$, $\operatorname{tr}A = 13$, $\det A = 36$, so $p(\lambda) = \lambda^2-13\lambda+36 = (\lambda-4)(\lambda-9)$.</div>
<div class="step">$\lambda = 4$: $A-4I = \begin{pmatrix}1&-2\\-2&4\end{pmatrix}$ ⇒ eigenvector $(2,1)$. $\;\lambda = 9$: $\begin{pmatrix}-4&-2\\-2&-1\end{pmatrix}$ ⇒ eigenvector $(1,-2)$. Orthogonal ✔.</div>
<div class="step">$P = \frac1{\sqrt5}\begin{pmatrix}2&1\\1&-2\end{pmatrix}$ and $x = Py$ give $Q = 4y_1^2+9y_2^2$, so the curve is
$$4y_1^2+9y_2^2 = 36\iff\frac{y_1^2}{9}+\frac{y_2^2}{4} = 1:$$
an <b>ellipse</b> with semi-axis $3$ along $\frac1{\sqrt5}(2,1)$ and semi-axis $2$ along $\frac1{\sqrt5}(1,-2)$. See it in the <a href="#/labs/quadratic">Quadratic Forms Lab</a>.</div>
</div>
</div>
<div class="box recipe" data-t="Classify the conic Q(x,y) = c (c > 0)">
<ol class="recipe-steps">
<li>Eigenvalues $\lambda_1,\lambda_2$ of the symmetric matrix (shortcut: $\lambda_1\lambda_2 = \det A$, $\lambda_1+\lambda_2 = \operatorname{tr}A$).</li>
<li>$\lambda_1,\lambda_2\gt0$: <b>ellipse</b> (circle if equal), semi-axes $\sqrt{c/\lambda_i}$ along the eigenvectors.</li>
<li>$\lambda_1\lambda_2\lt0$: <b>hyperbola</b>, opening along the eigenvector of the positive eigenvalue.</li>
<li>One eigenvalue $0$ (other positive): <b>pair of parallel lines</b>. Both negative: <b>empty</b> (no real points).</li>
</ol>
</div>
<div class="box ex" data-t="8.3.3 · A hyperbola">
<p>$x^2+4xy+y^2 = 3$: $A = \begin{pmatrix}1&2\\2&1\end{pmatrix}$ has eigenvalues $3$ (eigenvector $(1,1)$) and $-1$ (eigenvector $(1,-1)$), so in principal-axis coordinates $3y_1^2-y_2^2 = 3$: a hyperbola whose vertices lie on the line $y = x$ at distance $1$ from the origin.</p>
</div>
<div class="box tip" data-t="Make P a rotation">
<p>If $\det P = -1$, swap the two columns (and the two eigenvalues) or negate one column. Then $P$ is a genuine rotation and you can read off the rotation angle $\theta$ from its first column $(\cos\theta,\sin\theta)$.</p>
</div>` },

      { id: "8.4", title: "Definiteness: eigenvalue test and Sylvester's criterion", html: H`
<div class="box def" data-t="8.4.1 · Definiteness">
<p>A quadratic form $Q(x) = x^TAx$ (and its symmetric matrix $A$) is</p>
<ul><li><b>positive definite</b> if $Q(x)\gt0$ for all $x\neq0$; &nbsp; <b>negative definite</b> if $Q(x)\lt0$ for all $x\neq0$;</li>
<li><b>positive semidefinite</b> if $Q(x)\ge0$ for all $x$; &nbsp; <b>negative semidefinite</b> if $Q(x)\le0$ for all $x$;</li>
<li><b>indefinite</b> if $Q$ takes both positive and negative values.</li></ul>
</div>
<div class="box thm" data-t="8.4.2 · Eigenvalue test ★">
<p>For symmetric $A$ with eigenvalues $\lambda_1,\dots,\lambda_n$:
PD $\iff$ all $\lambda_i\gt0$; ND $\iff$ all $\lambda_i\lt0$; PSD $\iff$ all $\lambda_i\ge0$; NSD $\iff$ all $\lambda_i\le0$; indefinite $\iff$ some $\lambda_i\gt0$ and some $\lambda_j\lt0$.</p>
</div>
<div class="box proof" data-t="of Theorem 8.4.2">
<p>By the Principal Axes Theorem, $Q = \lambda_1y_1^2+\dots+\lambda_ny_n^2$ with $y = P^Tx$, and $x\neq0\iff y\neq0$ ($P$ is invertible). If all $\lambda_i\gt0$ the sum is positive for every $y\neq0$. Conversely, choosing $y = e_i$ (i.e. $x$ = the $i$-th unit eigenvector) gives $Q = \lambda_i$, so positivity of $Q$ forces every $\lambda_i\gt0$. The other cases are identical.</p>
</div>
<div class="box thm" data-t="8.4.3 · Sylvester's criterion ★">
<p>Let $A$ be <b>real symmetric</b> and let $\Delta_k$ be its $k$-th <b>leading principal minor</b> (determinant of the top-left $k\times k$ block). Then</p>
<ul><li>$A$ is positive definite $\iff\Delta_1\gt0,\ \Delta_2\gt0,\ \dots,\ \Delta_n\gt0$;</li>
<li>$A$ is negative definite $\iff\Delta_1\lt0,\ \Delta_2\gt0,\ \Delta_3\lt0,\dots$ (signs alternate, starting negative).</li></ul>
</div>
<div class="box proof" data-t="of Sylvester's criterion (n = 2 in full; general idea)">
<p><b>(⇒, any $n$):</b> if $A$ is PD, so is each top-left block $A_k$ (apply $Q$ to vectors whose last $n-k$ entries are $0$); $A_k$ is symmetric with positive eigenvalues, so $\Delta_k = \det A_k$ = product of eigenvalues $\gt0$.</p>
<p><b>(⇐, $n = 2$):</b> write $Q = ax^2+2bxy+cy^2$ with $a = \Delta_1\gt0$ and $ac-b^2 = \Delta_2\gt0$. Completing the square,
$$Q = a\Big(x+\frac bay\Big)^2+\frac{ac-b^2}{a}\,y^2,$$
a sum of two non-negative terms that vanish together only if $y = 0$ and then $x = 0$. So $Q$ is PD. <span class="muted">The general $n$ case is proved by induction using the same idea (block elimination / $LDL^T$ factorization).</span></p>
<p><b>ND:</b> $A$ is ND $\iff -A$ is PD, and $\det(-A_k) = (-1)^k\Delta_k$.</p>
</div>
<div class="box trap" data-t="Sylvester's criterion has hypotheses — check them!">
<ul>
<li><b>Symmetric only.</b> $B = \begin{pmatrix}1&4\\0&1\end{pmatrix}$ has leading minors $1, 1\gt0$, yet $x^TBx = x^2+4xy+y^2$ is $-2$ at $(1,-1)$. Symmetrize first: $\tfrac{B+B^T}{2} = \begin{pmatrix}1&2\\2&1\end{pmatrix}$, whose minors are $1, -3$ ⇒ indefinite.</li>
<li><b>Not for semidefinite with "≥".</b> $A = \begin{pmatrix}0&0\\0&-1\end{pmatrix}$ has $\Delta_1 = 0\ge0$ and $\Delta_2 = 0\ge0$, but $Q(0,1) = -1$: it is <i>not</i> PSD. For semidefiniteness you need <b>all</b> principal minors (every diagonal sub-block, not just the leading ones) $\ge0$ — or use eigenvalues.</li>
</ul>
</div>
<div class="box tip" data-t="2×2 classification in five seconds">
<p>For $A = \begin{pmatrix}a&b\\b&c\end{pmatrix}$ ($\det A = \lambda_1\lambda_2$, $\operatorname{tr}A = \lambda_1+\lambda_2$):
$\det A\lt0$ ⇒ <b>indefinite</b>; $\det A\gt0$, $a\gt0$ ⇒ <b>PD</b>; $\det A\gt0$, $a\lt0$ ⇒ <b>ND</b>; $\det A = 0$ ⇒ <b>semidefinite</b> (PSD if $\operatorname{tr}A\ge0$, NSD if $\le0$).</p>
</div>
<div class="box ex" data-t="8.4.4 · Classifying forms">
<div class="tbl-wrap"><table class="tbl"><tr><th>Form</th><th>Matrix</th><th>Test</th><th>Verdict</th></tr>
<tr><td>$2x^2+2y^2+2z^2-2xy-2yz$</td><td>$\begin{pmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{pmatrix}$</td><td>$\Delta = 2, 3, 4$</td><td>PD (eigenvalues $2,\,2\pm\sqrt2$)</td></tr>
<tr><td>$x^2+4xy+y^2$</td><td>$\begin{pmatrix}1&2\\2&1\end{pmatrix}$</td><td>$\det = -3\lt0$</td><td>indefinite ($3,-1$)</td></tr>
<tr><td>$-3x^2+2xy-2y^2$</td><td>$\begin{pmatrix}-3&1\\1&-2\end{pmatrix}$</td><td>$\Delta_1 = -3$, $\Delta_2 = 5$</td><td>ND ($\frac{-5\pm\sqrt5}{2}$)</td></tr>
<tr><td>$x^2+2xy+y^2$</td><td>$\begin{pmatrix}1&1\\1&1\end{pmatrix}$</td><td>$\det = 0$, $\operatorname{tr} = 2$</td><td>PSD ($0, 2$): $Q = (x+y)^2$</td></tr>
</table></div>
</div>
<div class="box prop" data-t="8.4.5 · Quick necessary conditions for PD">
<p>If $A$ is positive definite then every diagonal entry $a_{ii} = e_i^TAe_i\gt0$, $\operatorname{tr}A\gt0$, $\det A\gt0$, and $A$ is invertible with $A^{-1}$ also PD (its eigenvalues are $1/\lambda_i\gt0$). A single non-positive diagonal entry proves "not PD" instantly.</p>
</div>
<div class="box beyond" data-t="Gram matrices and Cholesky">
<p>For any $m\times n$ matrix $B$, $B^TB$ is PSD because $x^TB^TBx = \lVert Bx\rVert^2\ge0$, and it is PD exactly when the columns of $B$ are independent. Conversely every PD matrix is $R^TR$ for an invertible (upper-triangular) $R$ — the <b>Cholesky factorization</b> used to solve huge linear systems quickly. Gram matrices $G_{ij} = \langle v_i,v_j\rangle$ are how the <a href="#/labs/inner">Inner Product Lab</a> decides whether a formula is an inner product.</p>
</div>` },

      { id: "8.5", title: "Optimisation, Hessians and applications", html: H`
<div class="box thm" data-t="8.5.1 · Extreme values on the unit sphere (Rayleigh)">
<p>For symmetric $A$ with smallest and largest eigenvalues $\lambda_{\mathrm{min}}$, $\lambda_{\mathrm{max}}$:
$$\lambda_{\mathrm{min}}\le x^TAx\le\lambda_{\mathrm{max}}\quad\text{whenever }\lVert x\rVert = 1,$$
with the maximum (minimum) attained at a unit eigenvector for $\lambda_{\mathrm{max}}$ ($\lambda_{\mathrm{min}}$).</p>
</div>
<div class="box proof" data-t="of Theorem 8.5.1">
<p>With $x = Py$, $\lVert y\rVert = \lVert x\rVert = 1$, so $y_1^2+\dots+y_n^2 = 1$ and $x^TAx = \sum\lambda_iy_i^2$ is a weighted average of the $\lambda_i$ with weights $y_i^2$: it lies between the smallest and largest. Taking $y = e_i$ gives exactly $\lambda_i$.</p>
</div>
<div class="box ex" data-t="8.5.2 · Max and min on the unit circle">
<p>For $Q = 5x^2-4xy+8y^2$ (Example 8.3.2): on $x^2+y^2 = 1$ the maximum is $9$, at $\pm\frac1{\sqrt5}(1,-2)$, and the minimum is $4$, at $\pm\frac1{\sqrt5}(2,1)$ — no calculus needed.</p>
</div>
<div class="box thm" data-t="8.5.3 · Second-derivative test (Hessian)">
<p>Let $f:\R^n\to\R$ have continuous second partial derivatives and a critical point $a$ ($\nabla f(a) = 0$). Its <b>Hessian</b> $H = \big(\frac{\partial^2f}{\partial x_i\partial x_j}(a)\big)$ is symmetric (Clairaut), and near $a$, $f(a+h)\approx f(a)+\tfrac12h^THh$. Hence: $H$ PD ⇒ local minimum; $H$ ND ⇒ local maximum; $H$ indefinite ⇒ saddle point; semidefinite ⇒ the test is inconclusive.</p>
</div>
<div class="box ex" data-t="8.5.4 · Classifying critical points">
<p><b>(a)</b> $f(x,y) = x^2+xy+y^2-3x$: $\nabla f = (2x+y-3,\ x+2y) = 0$ ⇒ $(2,-1)$; $H = \begin{pmatrix}2&1\\1&2\end{pmatrix}$ has $\Delta = 2, 3\gt0$ ⇒ <b>local (in fact global) minimum</b>, $f(2,-1) = -3$.</p>
<p><b>(b)</b> $g(x,y) = x^3-3x+y^2$: critical points $(\pm1,0)$, $H = \begin{pmatrix}6x&0\\0&2\end{pmatrix}$. At $(1,0)$: $\diag(6,2)$ PD ⇒ local minimum. At $(-1,0)$: $\diag(-6,2)$ indefinite ⇒ <b>saddle</b>.</p>
</div>
<div class="box beyond" data-t="Where quadratic forms appear in the wild">
<ul>
<li><b>Statistics &amp; data science:</b> a covariance matrix $\Sigma$ is PSD; the variance of $w^TX$ is the quadratic form $w^T\Sigma w$. <b>Principal component analysis</b> is literally the principal axes theorem applied to $\Sigma$ — the first principal component maximises $w^T\Sigma w$ on $\lVert w\rVert = 1$ (Theorem 8.5.1).</li>
<li><b>Machine learning:</b> a twice-differentiable loss is convex exactly when its Hessian is PSD everywhere — the reason least squares ($\lVert Ax-b\rVert^2$) has a unique minimiser when $A^TA$ is PD.</li>
<li><b>Physics &amp; engineering:</b> kinetic energy $\tfrac12\omega^TI\omega$ (inertia tensor), stress and strain tensors — their principal axes are the directions with no "shear".</li>
<li><b>Computer graphics:</b> ellipses, ellipsoids and their fitting all reduce to symmetric matrices.</li>
</ul>
</div>
<div class="box exam" data-t="Exam checklist for quadratic forms">
<ul><li>Write the symmetric matrix correctly (½ on cross terms) and check by expanding.</li>
<li>State the theorem you use ("By the Principal Axes Theorem…", "By Sylvester's criterion, since $A$ is symmetric…").</li>
<li>Normalise eigenvectors for $P$; use Gram–Schmidt inside repeated eigenspaces.</li>
<li>For definiteness, either list eigenvalue signs or leading minors — and check the test's hypotheses.</li></ul>
</div>` },
    ],
    exercises: H`
<div class="card glow"><div class="kicker">Exercise 8 (this site's exercises — all answers verified with SymPy)</div><p>Attempt each on paper first. Use the <a href="#/labs/quadratic">Quadratic Forms Lab</a> and the <a href="#/labs/eigen">Eigen Lab</a> to check.</p></div>
<div class="box exam" data-t="Q1 · Symmetric matrices of forms" data-level="f">
<p>(a) $Q = 2x^2-6xy+5y^2$ &nbsp; (b) $Q = x^2+y^2+z^2+4xz-2yz$</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>(a) $\begin{pmatrix}2&-3\\-3&5\end{pmatrix}$ (half of $-6$ in each off-diagonal slot). &nbsp; (b) $\begin{pmatrix}1&0&2\\0&1&-1\\2&-1&1\end{pmatrix}$ ($xz$: $4/2 = 2$; $yz$: $-2/2 = -1$; no $xy$ term).</p></details></div>
<div class="box exam" data-t="Q2 · From matrix to form" data-level="f">
<p>Write the quadratic form of $A = \begin{pmatrix}4&-1&0\\-1&3&2\\0&2&-2\end{pmatrix}$.</p>
<details class="reveal sol"><summary>Full solution</summary><p>$Q = 4x^2+3y^2-2z^2-2xy+4yz$ (each off-diagonal pair $a_{ij} = a_{ji}$ contributes $2a_{ij}x_ix_j$).</p></details></div>
<div class="box exam" data-t="Q3 · Orthogonally diagonalize [[6, 2], [2, 3]]">
<details class="reveal sol"><summary>Full solution</summary>
<p>$\operatorname{tr} = 9$, $\det = 14$ ⇒ $p(\lambda) = (\lambda-7)(\lambda-2)$. $\lambda = 7$: $\begin{pmatrix}-1&2\\2&-4\end{pmatrix}$ ⇒ $(2,1)$. $\lambda = 2$: $\begin{pmatrix}4&2\\2&1\end{pmatrix}$ ⇒ $(1,-2)$.</p>
$$P = \frac1{\sqrt5}\begin{pmatrix}2&1\\1&-2\end{pmatrix},\qquad P^TAP = \begin{pmatrix}7&0\\0&2\end{pmatrix}.$$</details></div>
<div class="box exam" data-t="Q4 · Classify each form">
<p>(a) $3x^2+2xy+3y^2$ (b) $x^2-6xy+y^2$ (c) $-x^2-2y^2-3z^2+2xy$ (d) $x^2+4xy+4y^2$</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>(a) $A = \begin{pmatrix}3&1\\1&3\end{pmatrix}$, eigenvalues $4, 2$ ⇒ <b>positive definite</b>.<br>
(b) $A = \begin{pmatrix}1&-3\\-3&1\end{pmatrix}$, $\det = -8\lt0$ (eigenvalues $4,-2$) ⇒ <b>indefinite</b>.<br>
(c) $A = \begin{pmatrix}-1&1&0\\1&-2&0\\0&0&-3\end{pmatrix}$: $\Delta_1 = -1$, $\Delta_2 = 1$, $\Delta_3 = -3$ — alternating starting negative ⇒ <b>negative definite</b> (eigenvalues $-3,\ \frac{-3\pm\sqrt5}{2}$, all negative).<br>
(d) $A = \begin{pmatrix}1&2\\2&4\end{pmatrix}$, eigenvalues $0, 5$ ⇒ <b>positive semidefinite</b>; indeed $Q = (x+2y)^2$, which is $0$ along $x = -2y$.</p></details></div>
<div class="box exam" data-t="Q5 · Principal axes of 3x² + 2xy + 3y² = 8">
<details class="reveal sol"><summary>Full solution</summary>
<p>Eigenvalues $4$ (eigenvector $(1,1)$) and $2$ (eigenvector $(1,-1)$). With $P = \frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$: $4y_1^2+2y_2^2 = 8\iff\frac{y_1^2}{2}+\frac{y_2^2}{4} = 1$ — an ellipse with semi-axis $\sqrt2$ along $\frac1{\sqrt2}(1,1)$ and semi-axis $2$ along $\frac1{\sqrt2}(1,-1)$.</p></details></div>
<div class="box exam" data-t="Q6 · Extremes on the unit circle">
<p>Find the maximum and minimum of $3x^2+2xy+3y^2$ subject to $x^2+y^2 = 1$.</p>
<details class="reveal sol"><summary>Full solution</summary><p>By Theorem 8.5.1: max $= 4$ at $\pm\frac1{\sqrt2}(1,1)$; min $= 2$ at $\pm\frac1{\sqrt2}(1,-1)$.</p></details></div>
<div class="box exam" data-t="Q7 · A parameter">
<p>For which $k$ is $x^2+2kxy+4y^2$ positive definite?</p>
<details class="reveal sol"><summary>Full solution</summary><p>$A = \begin{pmatrix}1&k\\k&4\end{pmatrix}$ is symmetric, so Sylvester applies: $\Delta_1 = 1\gt0$ and $\Delta_2 = 4-k^2\gt0\iff -2\lt k\lt2$.</p></details></div>
<div class="box exam" data-t="Q8 · Proof: inverse of a PD matrix">
<p>Prove that if $A$ is symmetric positive definite then $A$ is invertible and $A^{-1}$ is positive definite.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>All eigenvalues $\lambda_i$ of $A$ are positive (Theorem 8.4.2), so $\det A = \prod\lambda_i\neq0$ and $A$ is invertible. $A^{-1}$ is symmetric because $(A^{-1})^T = (A^T)^{-1} = A^{-1}$. If $Av = \lambda v$ with $v\neq0$ then $A^{-1}v = \frac1\lambda v$, so the eigenvalues of $A^{-1}$ are $1/\lambda_i\gt0$. By Theorem 8.4.2, $A^{-1}$ is positive definite. $\square$</p></details></div>
<div class="box exam" data-t="Q9 · Proof: BᵀB is positive semidefinite">
<p>Let $B$ be any $m\times n$ real matrix. Prove $B^TB$ is PSD, and PD iff the columns of $B$ are linearly independent.</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>$B^TB$ is symmetric. For any $x$, $x^T(B^TB)x = (Bx)^T(Bx) = \lVert Bx\rVert^2\ge0$ ⇒ PSD. It equals $0$ iff $Bx = 0$. So $B^TB$ is PD iff $Bx = 0$ only for $x = 0$, i.e. iff $\Null(B) = \{0\}$, i.e. iff the columns of $B$ are independent. $\square$</p></details></div>
<div class="box exam" data-t="Q10 · Classify a critical point">
<p>Find and classify the critical point of $f(x,y) = x^2+xy+y^2-3x$.</p>
<details class="reveal sol"><summary>Full solution</summary><p>See Example 8.5.4(a): critical point $(2,-1)$; $H = \begin{pmatrix}2&1\\1&2\end{pmatrix}$ is PD ⇒ local minimum, value $-3$.</p></details></div>
<div class="box exam" data-t="Q11 · Repeated eigenvalue (challenge)" data-level="a">
<p>Orthogonally diagonalize $A = \begin{pmatrix}2&1&1\\1&2&1\\1&1&2\end{pmatrix}$ and hence write $Q = x^TAx$ without cross terms.</p>
<details class="reveal sol"><summary>Full solution</summary><p>See Example 8.2.7: $P = \big(\tfrac1{\sqrt3}(1,1,1)\,|\,\tfrac1{\sqrt2}(-1,1,0)\,|\,\tfrac1{\sqrt6}(-1,-1,2)\big)$, $D = \diag(4,1,1)$, so $Q = 4y_1^2+y_2^2+y_3^2$ — positive definite.</p></details></div>`,
    summary: H`
<div class="card glow"><div class="kicker">Chapter 8 on one page</div><div class="tbl-wrap"><table class="tbl">
<tr><th>Concept</th><th>Key fact</th><th>How to use it</th></tr>
<tr><td>Quadratic form</td><td>$Q(x) = x^TAx$, $A$ symmetric, unique</td><td>$a_{ii}$ = coeff of $x_i^2$; $a_{ij} = \frac12$ coeff of $x_ix_j$</td></tr>
<tr><td>Orthogonal matrix</td><td>$P^TP = I$, $P^{-1} = P^T$, $\det P = \pm1$</td><td>Columns orthonormal; preserves lengths & angles</td></tr>
<tr><td>Symmetric ⇒</td><td>real eigenvalues; orthogonal eigenvectors (distinct $\lambda$)</td><td>Spectral theorem: $P^TAP = D$</td></tr>
<tr><td>Principal axes</td><td>$x = Py$ ⇒ $Q = \sum\lambda_iy_i^2$</td><td>Classify conics by eigenvalue signs</td></tr>
<tr><td>Eigenvalue test</td><td>PD ⇔ all $\lambda\gt0$, indefinite ⇔ mixed signs</td><td>Works for any symmetric $A$</td></tr>
<tr><td>Sylvester</td><td>PD ⇔ all leading minors $\gt0$; ND ⇔ alternating</td><td>Symmetric only; not for semidefinite</td></tr>
<tr><td>Rayleigh</td><td>$\lambda_{\mathrm{min}}\le x^TAx\le\lambda_{\mathrm{max}}$ on $\lVert x\rVert = 1$</td><td>Extremes at unit eigenvectors</td></tr>
<tr><td>Hessian test</td><td>PD min, ND max, indefinite saddle</td><td>Semidefinite: inconclusive</td></tr>
</table></div></div>`,
  });
})();
