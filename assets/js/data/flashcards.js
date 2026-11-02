/* Flashcards. Format: "## chapterId" then pairs of "F: front" / "B: back". */
(function () {
  const RAW = String.raw`
## ch3
F: Linear transformation (Def 3.1.1)
B: $T:V\to W$ with $T(\alpha u) = \alpha T(u)$ and $T(u+v) = T(u)+T(v)$ for all $\alpha\in\FF$, $u,v\in V$. Equivalently (Thm 3.1.3) $T(\alpha u+\beta v) = \alpha T(u)+\beta T(v)$.
F: $\Lin(V,W)$ and $\Lin(V)$
B: The set of all linear maps $V\to W$; $\Lin(V) = \Lin(V,V)$, the linear <b>operators</b> on $V$.
F: What is $T(0)$ for a linear $T$? How is it used?
B: $T(0_V) = 0_W$ (Prop 3.1.4). If $T(0)\ne0$, $T$ is not linear — instant disproof. ($T(0) = 0$ alone proves nothing.)
F: Theorem 3.1.6 (basis determines $T$)
B: If $\{u_1,\dots,u_n\}$ is a basis of $V$, then $T$ is determined by $T(u_1),\dots,T(u_n)$: $T(\sum a_iu_i) = \sum a_iT(u_i)$.
F: Kernel and range (Def 3.2.3)
B: $\ker T = \{v\in V: T(v) = 0\}\subseteq V$; $\;\Ran T = \{T(v): v\in V\}\subseteq W$. Both are subspaces (Thm 3.2.4).
F: Kernel test (Thm 3.2.6)
B: $T$ is injective $\iff\ker T = \{0\}$.
F: Rank and nullity (Def 3.2.8)
B: $\Rank T = \dim\Ran T$, $\;\Nullity T = \dim\ker T$.
F: Rank–Nullity Theorem (3.2.9)
B: If $\dim V$ is finite: $\Rank T+\Nullity T = \dim V$ (the <b>domain</b>).
F: Linear maps and dependent sets (Thm 3.2.1 / Cor 3.2.2)
B: $S$ dependent ⇒ $T(S)$ dependent. Equivalently: $T(S)$ independent ⇒ $S$ independent.
F: $\dim\Lin(V,W)$ (Thm 3.3.2)
B: $\dim V\cdot\dim W$. E.g. $\dim\Lin(\P_m,\P_n) = (m+1)(n+1)$.
F: Inverse of a bijective linear map (Thm 3.3.4)
B: $T^{-1}$ exists and is linear: $T^{-1}\in\Lin(W,V)$.
F: Singular / non-singular (Def 3.3.5)
B: Singular: some $v\ne0$ with $T(v) = 0$. Non-singular: $\ker T = \{0\}$.
F: Theorem 3.3.6 (three equivalent statements)
B: $T$ non-singular $\iff$ $T$ injective $\iff$ $T$ maps independent sets to independent sets.
F: Isomorphism; $V\cong W$ (Def 3.3.7)
B: A bijective linear map. $V\cong W$ if one exists. Every $n$-dim space over $\FF$ is $\cong\FF^n$ (Thm 3.3.8).
F: Matrix of $T$ relative to $\B$ and $\Cc$ (Def 3.4.1)
B: The $m\times n$ matrix whose $i$-th column is $[T(v_i)]_{\Cc}$, where $\B = \{v_1,\dots,v_n\}$.
F: Theorem 3.4.3
B: $[T(v)]_{\Cc} = [T]^{\Cc}_{\B}\,[v]_{\B}$ for every $v\in V$.
F: Diagonalizing basis (Def 3.4.5)
B: A basis $\B$ with $[T]_{\B}$ diagonal. $T$ is diagonalizable iff such a basis exists (iff $P^{-1}AP$ is diagonal for some invertible $P$).
F: Similar matrices (Def 3.4.7)
B: $B = P^{-1}AP$ for some invertible $P$. An equivalence relation (Thm 3.4.8).
F: Dimension constraints on linear maps $V\to W$
B: $\dim V\gt\dim W$ ⇒ not injective. $\dim V\lt\dim W$ ⇒ not surjective. $\dim V = \dim W$ ⇒ injective ⇔ surjective.
## ch4
F: Inner product — the 4 axioms (Def 4.1.1)
B: (i) $\langle u,u\rangle\ge0$; (ii) $\langle u,u\rangle = 0\iff u = 0$; (iii) $\langle u,v\rangle = \langle v,u\rangle$; (iv) $\langle au+bv,w\rangle = a\langle u,w\rangle+b\langle v,w\rangle$.
F: Norm, unit vector, normalisation, distance (Def 4.1.4)
B: $\lVert u\rVert = \sqrt{\langle u,u\rangle}$; unit if $\lVert u\rVert = 1$; $\hat u = u/\lVert u\rVert$; $d(u,v) = \lVert u-v\rVert$.
F: Angle between $u,v$ (Def 4.2.1)
B: $\cos\theta = \dfrac{\langle u,v\rangle}{\lVert u\rVert\lVert v\rVert}$, $\theta\in[0,\pi]$.
F: Orthogonal complement (Def 4.2.3)
B: $S^\perp = \{u\in V: \langle u,v\rangle = 0\;\forall v\in S\}$.
F: Proposition 4.2.5 (five facts)
B: $V^\perp = \{0\}$, $\{0\}^\perp = V$; $W^\perp$ is a subspace; $S\subseteq S^{\perp\perp}$; $S$ subspace ⇒ $S\cap S^\perp = \{0\}$; $S\subseteq W$ ⇒ $W^\perp\subseteq S^\perp$.
F: Pythagorean Theorem (4.2.6)
B: If $u\perp v$: $\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2$.
F: Cauchy–Schwarz (4.2.7)
B: $|\langle u,v\rangle|\le\lVert u\rVert\lVert v\rVert$, with equality iff $u,v$ are linearly dependent.
F: Triangle Inequality (4.2.8)
B: $\lVert u+v\rVert\le\lVert u\rVert+\lVert v\rVert$ (equality iff one is a non-negative multiple of the other).
F: Orthonormal set (Def 4.2.9)
B: $\langle u_i,u_j\rangle = 0$ for $i\ne j$ and $\lVert u_i\rVert = 1$; i.e. $\langle u_i,u_j\rangle = \delta_{ij}$.
F: Theorem 4.2.11
B: Mutually orthogonal <b>non-zero</b> vectors are linearly independent.
F: Gram–Schmidt formula (fraction-friendly)
B: $u_k = v_k-\sum_{j\lt k}\frac{\langle v_k,u_j\rangle}{\langle u_j,u_j\rangle}u_j$, then $w_k = u_k/\lVert u_k\rVert$.
F: Gram–Schmidt formula (notes' version)
B: $u_1 = v_1$, $w_1 = \hat u_1$; $u_k = v_k-\sum_{j=1}^{k-1}\langle v_k,w_j\rangle w_j$, $w_k = \hat u_k$.
F: Coordinates in an orthonormal basis
B: $v = \sum_i\langle v,w_i\rangle w_i$ and $\lVert v\rVert^2 = \sum_i\langle v,w_i\rangle^2$.
F: $\lVert u\pm v\rVert^2$ expansion
B: $\lVert u\rVert^2\pm2\langle u,v\rangle+\lVert v\rVert^2$.
F: Most common way an "inner product" fails
B: Coincidence: some non-zero vector has $\langle u,u\rangle = 0$ (e.g. constants under $\int p'q'$).
## ch2
F: Subspace test (Def 2.2.1 / Thm 2.2.3)
B: $W\ne\emptyset$ is a subspace iff $au+bv\in W$ for all $a,b$ and $u,v\in W$ (in particular $0\in W$).
F: Span (Def 2.3.3)
B: All finite linear combinations of elements of $S$; the smallest subspace containing $S$.
F: Linear independence (Def 2.4.1)
B: $a_1u_1+\dots+a_nu_n = 0\Rightarrow a_1 = \dots = a_n = 0$.
F: Basis (Def 2.4.5)
B: A linearly independent spanning set. Coordinates relative to a basis are unique.
F: Dimension facts
B: $\dim\R^n = n$, $\dim\P_n = n+1$, $\dim\R^{m\times n} = mn$, $\dim\{0\} = 0$.
F: Direct sum $V = U\oplus W$
B: Every $v$ is uniquely $u+w$. Holds iff $U+W = V$ and $U\cap W = \{0\}$.
F: $\dim(U+W)$
B: $\dim U+\dim W-\dim(U\cap W)$.
## ch1
F: Equivalence relation
B: Reflexive ($xRx$), symmetric ($xRy\Rightarrow yRx$), transitive ($xRy, yRz\Rightarrow xRz$).
F: Injective / surjective / bijective
B: Injective: $f(x_1) = f(x_2)\Rightarrow x_1 = x_2$. Surjective: every $y$ is some $f(x)$. Bijective: both.
F: De Morgan's laws
B: $(A\cup B)^c = A^c\cap B^c$ and $(A\cap B)^c = A^c\cup B^c$.
F: Binary operation
B: A function $A\times A\to A$ (closure!).
## ch5
F: Elementary row operations
B: $R_i\leftrightarrow R_j$; $R_i\to cR_i$ ($c\ne0$); $R_i\to R_i+cR_j$.
F: Rank of a matrix
B: Number of non-zero rows in an REF; $=\dim\RS(A) = \dim\CS(A)$.
F: Nullity of an $m\times n$ matrix
B: $\dim\Null(A) = n-\Rank A$.
F: RREF
B: REF where each pivot is 1 and is the only non-zero entry in its column. Unique.
## ch6
F: Determinant & row operations (Thm 6.1.7)
B: Swap: $\times(-1)$. Scale a row by $c$: $\times c$. Add a multiple of a row: unchanged.
F: $\det(AB)$, $\det(A^T)$, $\det(A^{-1})$
B: $\det A\det B$; $\det A$; $1/\det A$.
F: Sign of a permutation
B: $(-1)^{n-k}$ where $k$ = number of disjoint cycles including 1-cycles.
## ch7
F: Eigenvalue / eigenvector
B: $Ax = \lambda x$ with $x\ne0$; equivalently $\det(A-\lambda I) = 0$.
F: Algebraic vs geometric multiplicity
B: Algebraic: multiplicity as a root of $p_A$. Geometric: $\dim\Null(A-\lambda I)$. Always geometric $\le$ algebraic.
F: Diagonalizable (correct criterion)
B: $n$ independent eigenvectors ⇔ geometric = algebraic multiplicity for every eigenvalue. $n$ distinct eigenvalues is sufficient.
F: Cayley–Hamilton
B: $p_A(A) = 0$. Multiply by $A^{-1}$ to express $A^{-1}$ as a polynomial in $A$.

## ch8
F: Quadratic form on $\R^n$
B: $Q(x) = x^TAx = \sum_{i,j}a_{ij}x_ix_j$ with $A$ symmetric (unique). A cross term $c\,x_ix_j$ gives $a_{ij} = a_{ji} = c/2$.
F: Orthogonal matrix
B: $P^TP = I$, i.e. $P^{-1} = P^T$. Columns form an orthonormal basis; $P$ preserves lengths and angles; $\det P = \pm1$.
F: Spectral Theorem (real symmetric matrices)
B: $A = A^T$ ⇒ all eigenvalues are real and $A = PDP^T$ with $P$ orthogonal (orthonormal eigenvector columns) and $D$ diagonal.
F: Eigenvectors of a symmetric matrix
B: Eigenvectors for distinct eigenvalues are orthogonal. Normalise them for the columns of $P$; use Gram–Schmidt inside a repeated eigenspace.
F: Principal Axes Theorem
B: $x = Py$ with $P$ orthogonal (columns = orthonormal eigenvectors of $A$) turns $x^TAx$ into $\lambda_1y_1^2+\dots+\lambda_ny_n^2$ — no cross terms.
F: Positive definite, semidefinite, indefinite
B: PD: $Q(x)>0$ for all $x\neq0$. PSD: $Q(x)\ge0$ for all $x$. ND / NSD: the reverse inequalities. Indefinite: $Q$ takes both signs.
F: Eigenvalue test for definiteness
B: Symmetric $A$: PD ⇔ all $\lambda>0$; PSD ⇔ all $\lambda\ge0$; ND ⇔ all $\lambda<0$; NSD ⇔ all $\lambda\le0$; indefinite ⇔ eigenvalues of both signs.
F: Sylvester's criterion
B: Symmetric $A$ is PD ⇔ every leading principal minor $\Delta_1,\dots,\Delta_n$ is $>0$. ND ⇔ the signs alternate $-,+,-,\dots$ It does NOT test semidefiniteness: $\diag(0,-1)$.
F: $2\times2$ definiteness shortcut
B: $A = \begin{pmatrix}a&b\\b&c\end{pmatrix}$: $\det A<0$ ⇒ indefinite; $\det A>0,\ a>0$ ⇒ PD; $\det A>0,\ a<0$ ⇒ ND; $\det A = 0$ ⇒ semidefinite.
F: Classifying $ax^2+2bxy+cy^2 = d$ (with $d>0$)
B: Eigenvalues of $\begin{pmatrix}a&b\\b&c\end{pmatrix}$: both $>0$ ⇒ ellipse; opposite signs ⇒ hyperbola; both $<0$ ⇒ empty; one $0$ ⇒ degenerate (parallel lines or empty).
F: Rayleigh bounds
B: Symmetric $A$, $\norm{x} = 1$: $\lambda_{\mathrm{min}}\le x^TAx\le\lambda_{\mathrm{max}}$, with equality at the corresponding unit eigenvectors.
F: Hessian (second-derivative) test
B: At a critical point: Hessian PD ⇒ local minimum; ND ⇒ local maximum; indefinite ⇒ saddle point; only semidefinite ⇒ the test is inconclusive.
## ch5
F: Equivalent matrices (§5.3)
B: $A\sim B$ ⇔ $B = PAQ$ with $P,Q$ invertible ⇔ same size and same rank. Every rank-$r$ matrix $\sim N_r = \begin{pmatrix}I_r&0\\0&0\end{pmatrix}$.
F: Elementary column operations (§5.3)
B: A column operation is right-multiplication $A\mapsto AE$. Preserves rank and column space, but mixes the unknowns of $Ax = b$ — never use it to solve systems.
`;
  const cards = []; let ch = null, cur = null;
  RAW.split("\n").forEach((l) => {
    if (l.startsWith("## ")) ch = l.slice(3).trim();
    else if (l.startsWith("F: ")) { cur = { ch, f: l.slice(3).trim(), b: "" }; cards.push(cur); }
    else if (l.startsWith("B: ") && cur) cur.b = l.slice(3).trim();
  });
  cards.forEach((c, i) => { c.id = c.ch + "-" + i; });
  LA.CARDS = cards;
})();
