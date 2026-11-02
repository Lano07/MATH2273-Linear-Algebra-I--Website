/* Quiz bank. Format: "## id | title" starts a set; "Q:" question; "* " correct option; "- " wrong option; "E:" explanation. */
(function () {
  const RAW = String.raw`
## ch3 | Chapter 3 — Linear Transformations
Q: Which map $T:\R^2\to\R^2$ is linear?
- $T(x,y) = (x+1,\;y)$
- $T(x,y) = (xy,\;x)$
* $T(x,y) = (2x-y,\;3y)$
- $T(x,y) = (|x|,\;y)$
E: Each component of $(2x-y,3y)$ is a linear combination of $x,y$ with no constant term. The others fail: $T(0)\ne0$ for the first; products and absolute values break homogeneity.

Q: If $T\in\Lin(V,W)$, then $T(0_V)$ equals
- $0_V$
* $0_W$
- $T(1)$
- it depends on $T$
E: Proposition 3.1.4: $T(0_V) = T(0_V+0_V) = T(0_V)+T(0_V)$, so $T(0_V) = 0_W$.

Q: $f:\R\to\R$, $f(x) = x^2$ satisfies $f(0) = 0$. Is $f$ linear?
- Yes, because $f(0) = 0$
* No: $f(2\cdot1) = 4 \ne 2 = 2f(1)$
- Yes, it is additive
- No, because $f(1)\ne 1$
E: $T(0) = 0$ is necessary, not sufficient. One numeric counterexample disproves linearity.

Q: $T:\R^5\to\R^3$ is linear with $\Rank(T) = 3$. Then $\Nullity(T) = $
- $0$
- $3$
* $2$
- $5$
E: Rank–Nullity uses the domain: $\Nullity = \dim\R^5 - \Rank = 5-3 = 2$.

Q: Can a linear map $T:\R^4\to\R^6$ be surjective?
- Yes, if $\ker T = \{0\}$
* No — $\Rank T\le 4\lt 6$
- Yes, always
- Only if $T$ is the zero map
E: $\Rank T = \dim\Ran T\le\dim(\text{domain}) = 4$, so $\Ran T$ can never be all of $\R^6$.

Q: $T:\R^3\to\R^3$ is linear with $\ker T = \{0\}$. Then $T$ is
- injective but maybe not surjective
- surjective but maybe not injective
* an isomorphism
- singular
E: Injective ⇒ $\Rank = 3 = \dim$ codomain ⇒ surjective. Equal finite dimensions make injective ⇔ surjective ⇔ bijective.

Q: $\dim\Lin(\P_2,\R^3) = $
- $6$
* $9$
- $5$
- $8$
E: $\dim\Lin(V,W) = \dim V\cdot\dim W = 3\cdot3 = 9$ (remember $\dim\P_2 = 3$).

Q: The kernel of $T\in\Lin(V,W)$ is a subspace of
* $V$ (the domain)
- $W$ (the codomain)
- both $V$ and $W$
- neither
E: $\ker T = \{v\in V : T(v) = 0\}$ consists of domain vectors. The range lives in $W$.

Q: The $i$-th column of $[T]^{\Cc}_{\B}$ is
- $[v_i]_{\Cc}$
- $T(w_i)$
* $[T(v_i)]_{\Cc}$, the $\Cc$-coordinates of the image of the $i$-th vector of $\B$
- the $i$-th row of the standard matrix
E: Definition 3.4.1: images of the domain basis, written in codomain coordinates, become the columns.

Q: For $T:\P_3\to\R^2$ linear, the matrix $[T]^{\Cc}_{\B}$ has size
- $4\times2$
* $2\times4$
- $3\times2$
- $2\times3$
E: Rows = $\dim$ codomain $= 2$; columns = $\dim$ domain $= \dim\P_3 = 4$.

Q: $T:\R^3\to\R$, $T(x,y,z) = x-3y+5z$. $\Nullity(T) = $
- $1$
* $2$
- $3$
- $0$
E: $\Ran T = \R$ so $\Rank = 1$; Rank–Nullity gives $3-1 = 2$ (Example 3.2.10(i)).

Q: $T$ is injective if and only if
- $\Ran T = W$
* $\ker T = \{0\}$
- $\Rank T = \dim W$
- $T(0) = 0$
E: Theorem 3.2.6 — the kernel test. It is the standard way to prove injectivity.

Q: If $T$ is linear and $\{T(v_1),T(v_2)\}$ is linearly independent, then $\{v_1,v_2\}$ is
* linearly independent
- linearly dependent
- could be either
- a basis of $V$
E: Corollary 3.2.2 (contrapositive of Theorem 3.2.1: dependent sets map to dependent sets).

Q: True or false: if $\{v_1,v_2\}$ is independent then $\{T(v_1),T(v_2)\}$ is independent for every linear $T$.
- True
* False
E: The zero map sends everything to $0$. Independence is preserved exactly when $T$ is injective (Theorem 3.3.6).

Q: $\P_n$ is isomorphic to
- $\R^n$
* $\R^{n+1}$
- $\R^{n-1}$
- $\R^{n\times n}$
E: $\dim\P_n = n+1$ and every $(n+1)$-dimensional real space is isomorphic to $\R^{n+1}$ (Theorem 3.3.8).

Q: $T(1,0) = (2,3)$ and $T(0,1) = (-1,4)$ for a linear $T$. Then $T(3,-2) = $
- $(4,17)$
* $(8,1)$
- $(6,-8)$
- $(1,8)$
E: $T(3,-2) = 3T(1,0)-2T(0,1) = (6,9)-(-2,8) = (8,1)$.

Q: Similar matrices $A$ and $B$ satisfy
- $B = PAP$
* $B = P^{-1}AP$ for some invertible $P$
- $B = A^T$
- $AB = BA$
E: Definition 3.4.7. Similar matrices represent the same linear map in different bases.

Q: The inverse of a bijective linear map is
* always linear
- linear only on $\R^n$
- never linear
- linear only if $V = W$
E: Theorem 3.3.4(ii).

Q: $T:\R^3\to\R^2$, $T(x,y,z) = (x+y,\;2x+2y)$. $\Rank(T) = $
* $1$
- $2$
- $3$
- $0$
E: The second component is twice the first, so $\Ran T = \spn\{(1,2)\}$, dimension 1.

Q: $T\in\Lin(V,W)$ is called singular when
- $T$ is not surjective
* some $v\ne0$ has $T(v) = 0$
- $\dim V\ne\dim W$
- $T(0)\ne0$
E: Definition 3.3.5. Singular ⇔ $\ker T\ne\{0\}$ ⇔ not injective.

Q: If $f$ is singular and $g$ is any linear map with $g\circ f$ defined, then $g\circ f$ is
* singular
- non-singular
- an isomorphism
- undefined
E: $f(u) = 0$ with $u\ne0$ gives $(g\circ f)(u) = g(0) = 0$.

Q: To prove $T:V\to W$ (with $\dim V = \dim W$ finite) is an isomorphism, it is enough to show
- $T(0) = 0$
* $T$ is linear and $\ker T = \{0\}$
- $T$ is linear
- $\Ran T\ne\{0\}$
E: Injective + equal dimensions ⇒ surjective by Rank–Nullity.

## ch4 | Chapter 4 — Inner Product Spaces & Orthogonality
Q: Which axiom fails for $\langle x,y\rangle = x_1y_1 - x_2y_2$ on $\R^2$?
* non-negativity
- symmetry
- linearity
- none — it is an inner product
E: $\langle(0,1),(0,1)\rangle = -1\lt0$.

Q: $\lVert(-1,5,3)\rVert = $
- $7$
* $\sqrt{35}$
- $35$
- $\sqrt{7}$
E: $\sqrt{1+25+9} = \sqrt{35}$ (Example 4.1.5).

Q: The angle between $(1,0)$ and $(1,1)$ is
- $\pi/2$
* $\pi/4$
- $\pi/3$
- $0$
E: $\cos\theta = \frac{1}{1\cdot\sqrt2}$, so $\theta = \pi/4$.

Q: For any subset $S\ne\emptyset$ of an IPS, $S^\perp$ is
* always a subspace
- a subspace only if $S$ is a subspace
- never a subspace
- equal to $S$
E: Proposition 4.2.5(ii) — linearity of the inner product makes $S^\perp$ closed under combinations.

Q: $\{0\}^\perp = $
- $\{0\}$
* $V$
- $\emptyset$
- undefined
E: Every vector is orthogonal to $0$.

Q: If $S$ is a subspace, then $S\cap S^\perp = $
* $\{0\}$
- $S$
- $\emptyset$
- $V$
E: $u\in S\cap S^\perp\Rightarrow\langle u,u\rangle = 0\Rightarrow u = 0$. (It is never empty: $0$ is in both.)

Q: If $S\subseteq W$, then
- $S^\perp\subseteq W^\perp$
* $W^\perp\subseteq S^\perp$
- $S^\perp = W^\perp$
- $S^\perp\cap W^\perp = \{0\}$
E: Being orthogonal to everything in the bigger set $W$ is a stronger condition (Prop 4.2.5(v)).

Q: Equality holds in Cauchy–Schwarz, $|\langle u,v\rangle| = \lVert u\rVert\lVert v\rVert$, exactly when
- $u\perp v$
* $u,v$ are linearly dependent
- $\lVert u\rVert = \lVert v\rVert$
- $u = v$
E: Theorem 4.2.7.

Q: $\langle p,q\rangle = \int_{-1}^1 p'(x)q'(x)\,dx$ on $\P_2$ fails which axiom?
- non-negativity
* coincidence
- symmetry
- linearity
E: The constant $p = 1\ne0$ has $\langle p,p\rangle = 0$. (Exercise 4 Q1 avoids this by requiring $p(\pm1) = 0$.)

Q: $\langle p,q\rangle = p(0)q(0)+p(1)q(1)$ is an inner product on
* $\P_1$ but not $\P_2$
- $\P_2$ but not $\P_1$
- both
- neither
E: On $\P_2$, $p = x(x-1)\ne0$ has $\langle p,p\rangle = 0$. On $\P_1$ two roots force $p = 0$.

Q: The unit vector in the direction of $(3,4)$ is
- $(3,4)$
* $\left(\tfrac35,\tfrac45\right)$
- $\left(\tfrac34,1\right)$
- $\left(\tfrac17,\tfrac17\right)$
E: Divide by $\lVert(3,4)\rVert = 5$.

Q: $\lVert u\rVert = 3$, $\lVert v\rVert = 4$ and $u\perp v$. Then $\lVert u+v\rVert = $
- $7$
* $5$
- $1$
- $25$
E: Pythagoras: $\lVert u+v\rVert^2 = 9+16 = 25$.

Q: In Gram–Schmidt, $u_2 = v_2 - \frac{\langle v_2,u_1\rangle}{\langle u_1,u_1\rangle}u_1$. Then $\langle u_2,u_1\rangle = $
* $0$
- $1$
- $\lVert v_2\rVert$
- $\langle v_2,u_1\rangle$
E: Expand: $\langle v_2,u_1\rangle - \frac{\langle v_2,u_1\rangle}{\langle u_1,u_1\rangle}\langle u_1,u_1\rangle = 0$. That is the whole point.

Q: If $\{w_1,\dots,w_n\}$ is an orthonormal basis, the coordinates of $v$ are
- found by row reduction only
* $\langle v,w_1\rangle,\dots,\langle v,w_n\rangle$
- $\lVert v\rVert/n$ each
- $\langle w_i,w_i\rangle$
E: $v = \sum\langle v,w_i\rangle w_i$ — the main reason orthonormal bases are so useful.

Q: With $\langle f,g\rangle = \int_0^1 fg\,dx$, $\langle 1, x\rangle = $
- $0$
- $1$
* $\tfrac12$
- $\tfrac13$
E: $\int_0^1 x\,dx = \tfrac12$. So $1$ and $x$ are not orthogonal on $[0,1]$.

Q: Applying Gram–Schmidt to a set that is already orthogonal
* just normalises each vector
- changes every vector
- produces the zero vector
- fails
E: All projections $\langle v_k,u_j\rangle$ are $0$, so $u_k = v_k$.

Q: $S = \{(1,1,1)\}\subset\R^3$. $\dim S^\perp = $
- $1$
* $2$
- $3$
- $0$
E: One equation $x+y+z = 0$ in three unknowns: a plane. $\dim S^\perp = 3 - 1$.

Q: Gram–Schmidt produces $u_3 = 0$. This means
- you made an arithmetic error, always
* $v_3\in\spn\{v_1,v_2\}$ (the input set was dependent)
- $v_3$ is orthogonal to $v_1,v_2$
- $v_3 = 0$
E: $u_3$ is the part of $v_3$ not explained by $v_1,v_2$; it is $0$ exactly when $v_3$ lies in their span.

Q: The distance between $(1,2)$ and $(4,6)$ is
- $7$
* $5$
- $\sqrt7$
- $25$
E: $\lVert(-3,-4)\rVert = 5$.

Q: Mutually orthogonal vectors are linearly independent provided
- there are at most 3 of them
* none of them is the zero vector
- they are unit vectors
- the space is $\R^n$
E: Theorem 4.2.11 needs $\langle u_i,u_i\rangle\ne0$. $\{(1,0),(0,0)\}$ is orthogonal but dependent.

Q: Linearity in the second slot, $\langle w,au+bv\rangle = a\langle w,u\rangle+b\langle w,v\rangle$, follows from
- coincidence
* symmetry + linearity in the first slot
- non-negativity
- Cauchy–Schwarz
E: Swap the arguments with symmetry, use first-slot linearity, swap back.

## ch1 | Chapter 1 — Sets, Relations & Functions
Q: To prove $A = B$ for sets, you show
- $A\cap B\ne\emptyset$
* $A\subseteq B$ and $B\subseteq A$
- $|A| = |B|$
- $A\cup B = A$
E: Remark 1.1.8 — double inclusion.

Q: $(A\cup B)^c = $
- $A^c\cup B^c$
* $A^c\cap B^c$
- $A\cap B$
- $(A\cap B)^c$
E: De Morgan's law.

Q: "$\ge$" on $\Q$ is NOT an equivalence relation because it fails
- reflexivity
* symmetry
- transitivity
- closure
E: $2\ge1$ but $1\not\ge2$.

Q: $f:\R\to\R$, $f(x) = x^2$ is
- injective
- surjective
- bijective
* neither injective nor surjective
E: $f(1) = f(-1)$, and negatives are never hit.

Q: Subtraction is not a binary operation on $\N$ because
* $2-4\notin\N$ (closure fails)
- it is not commutative
- it is not associative
- $0\in\N$
E: A binary operation must land back in the set.

Q: $\{1,2\}\times\{a\}$ has how many elements?
* $2$
- $1$
- $3$
- $4$
E: $\{(1,a),(2,a)\}$.

Q: $(g\circ f)^{-1} = $
- $g^{-1}\circ f^{-1}$
* $f^{-1}\circ g^{-1}$
- $f\circ g$
- $g\circ f$
E: Undo in reverse order ("socks and shoes").

## ch2 | Chapter 2 — Vector Spaces
Q: $\dim\P_3 = $
- $3$
* $4$
- $6$
- $9$
E: Basis $\{1,x,x^2,x^3\}$.

Q: Fastest way to show $W$ is NOT a subspace:
* show $0\notin W$ (when true)
- show $W$ is infinite
- show $W\ne V$
- find two vectors in $W$
E: Every subspace contains $0$.

Q: Any set containing the zero vector is
- independent
* dependent
- a basis
- a spanning set
E: $1\cdot0 = 0$ is a non-trivial dependence relation.

Q: Three vectors in $\R^2$ are always
- independent
* dependent
- a basis
- orthogonal
E: At most 2 independent vectors fit in a 2-dimensional space.

Q: With $x\oplus y = (x_1+y_1+2,\,x_2+y_2-1)$ on $\R^2$, the zero vector is
- $(0,0)$
* $(-2,1)$
- $(2,-1)$
- $(1,-2)$
E: Solve $x\oplus0 = x$: $\theta_1+2 = 0$, $\theta_2-1 = 0$.

Q: $V = U\oplus W$ requires
- $U\cup W = V$
* $U+W = V$ and $U\cap W = \{0\}$
- $U\perp W$
- $\dim U = \dim W$
E: Theorem 2.5.2.

Q: $n$ vectors in an $n$-dimensional space: if they are independent, they
* form a basis
- may not span
- are orthogonal
- include $0$
E: In $n$ dimensions, independent ⇔ spanning ⇔ basis for exactly $n$ vectors.

## ch5 | Chapter 5 — Systems of Linear Equations
Q: Which is NOT an elementary row operation?
- $R_1\leftrightarrow R_2$
- $R_2\to5R_2$
- $R_3\to R_3-4R_1$
* $R_2\to0\cdot R_2$
E: Scaling must be by a non-zero constant.

Q: Rank of a matrix = number of
* non-zero rows in an REF
- rows
- columns
- zero rows
E: Definition 5.2.1.

Q: $A$ is $3\times5$ with rank 3. $\Nullity(A) = $
- $3$
* $2$
- $0$
- $5$
E: Nullity $= n-\Rank = 5-3$.

Q: The RREF of a matrix is
* unique
- not unique
- always the identity
- only defined for square matrices
E: Theorem 5.1.15.

Q: A row $(0\;0\;0\,|\,5)$ in the RREF of $[A|b]$ means
- infinitely many solutions
- a unique solution
* no solution
- $b = 0$
E: It says $0 = 5$: inconsistent.

Q: A homogeneous system with more unknowns than equations has
- only the trivial solution
* infinitely many solutions
- no solutions
- exactly two solutions
E: $\Rank\le$ #equations $\lt n$, so there is at least one free variable.

Q: A basis of the column space of $A$ is given by
- the non-zero rows of the RREF
* the pivot columns of the original $A$
- the pivot columns of the RREF
- all columns of $A$
E: Row operations preserve column dependencies but change the column space itself.

## ch6 | Chapter 6 — Determinants
Q: Swapping two rows multiplies the determinant by
- $0$
- $1$
* $-1$
- $2$
E: Theorem 6.1.7(i).

Q: $R_2\to R_2+7R_1$ changes the determinant by
* nothing
- a factor 7
- a factor $-1$
- adding 7
E: Theorem 6.1.7(iii).

Q: For a $3\times3$ matrix, $\det(2A) = $
- $2\det A$
- $6\det A$
* $8\det A$
- $\det A$
E: $\det(cA) = c^n\det A = 2^3\det A$.

Q: $\sign\big((1\,2\,3)\big)$ in $S_3$ is
* $+1$
- $-1$
- $0$
- $3$
E: One cycle, $k = 1$: $(-1)^{3-1} = 1$.

Q: $\det A = 0$ if and only if
- $A$ is triangular
* the columns of $A$ are dependent
- $A$ is symmetric
- $A = 0$
E: Theorem 6.2.4.

Q: If $\det A = 4$ then $\det(A^{-1}) = $
- $4$
- $-4$
* $\tfrac14$
- $16$
E: Corollary 6.2.7.

Q: Determinant of an upper triangular matrix:
* product of the diagonal entries
- sum of the diagonal entries
- always 0
- always 1
E: Theorem 6.1.7(v).

## ch7 | Chapter 7 — Eigenvalues & Eigenvectors
Q: The eigenvalues of $\begin{pmatrix}2&5\\0&-3\end{pmatrix}$ are
* $2,-3$
- $2,5$
- $5,-3$
- $0,2$
E: Triangular ⇒ diagonal entries.

Q: For a $2\times2$ matrix, $p_A(\lambda) = $
* $\lambda^2-\operatorname{tr}(A)\lambda+\det A$
- $\lambda^2+\operatorname{tr}(A)\lambda+\det A$
- $\lambda^2-\det A$
- $\det A-\lambda$
E: Expand $\det(A-\lambda I)$.

Q: An eigenvector must be
- a unit vector
* non-zero
- real
- orthogonal to the others
E: $Ax = \lambda x$ holds trivially for $x = 0$, so $0$ is excluded.

Q: $A$ has eigenvalue $1$ with algebraic multiplicity 2 and geometric multiplicity 1. Then $A$ ($2\times2$) is
- diagonalizable
* not diagonalizable
- singular
- the identity
E: Only one independent eigenvector; we need 2.

Q: True or false: if $A$ is diagonalizable then all its eigenvalues are distinct.
- True
* False
E: $I_2$ is diagonal with eigenvalue $1$ repeated. (Distinct eigenvalues are sufficient, not necessary — see the corrections page.)

Q: If $0$ is an eigenvalue of $A$, then
* $A$ is not invertible
- $A = 0$
- $A$ is diagonalizable
- $\det A = 1$
E: $\det A = $ product of eigenvalues $= 0$.

Q: Cayley–Hamilton says that
- $\det A = p_A(0)$
* $p_A(A) = 0$
- $A$ is diagonalizable
- $A^{-1} = A^T$
E: Theorem 7.3.5.

## ch8 | Chapter 8 — Quadratic Forms & Orthogonal Diagonalization
Q: The symmetric matrix of $Q(x,y) = 3x^2+4xy-y^2$ is
* $\begin{pmatrix}3&2\\2&-1\end{pmatrix}$
- $\begin{pmatrix}3&4\\0&-1\end{pmatrix}$
- $\begin{pmatrix}3&4\\4&-1\end{pmatrix}$
- $\begin{pmatrix}3&-2\\-2&-1\end{pmatrix}$
E: Split the cross term equally: $a_{12} = a_{21} = \tfrac42 = 2$ (Theorem 8.1.2). The matrix $\begin{pmatrix}3&4\\4&-1\end{pmatrix}$ would give $8xy$.

Q: Every real symmetric matrix
* has real eigenvalues and an orthonormal basis of eigenvectors
- is invertible
- has distinct eigenvalues
- is positive definite
E: The Spectral Theorem 8.2.5. ($O$ and $I$ are symmetric but not invertible / not with distinct eigenvalues respectively.)

Q: A square matrix $P$ is orthogonal when
* $P^{-1} = P^T$
- $P^{-1} = P$
- $\det P = 0$
- $P^T = -P$
E: Definition 8.2.1: $P^TP = I$, i.e. the columns form an orthonormal set.

Q: Eigenvectors of a real symmetric matrix belonging to different eigenvalues are always
* orthogonal
- parallel
- equal in length
- linearly dependent
E: Theorem 8.2.4: $\lambda_1\langle u,v\rangle = \langle Au,v\rangle = \langle u,Av\rangle = \lambda_2\langle u,v\rangle$ forces $\langle u,v\rangle = 0$.

Q: The quadratic form with matrix $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ is
* positive definite
- negative definite
- indefinite
- positive semidefinite but not definite
E: Eigenvalues $1$ and $3$ are both positive (or: $a = 2>0$ and $\det = 3>0$).

Q: The quadratic form with matrix $\begin{pmatrix}1&3\\3&1\end{pmatrix}$ is
* indefinite
- positive definite
- negative definite
- positive semidefinite
E: $\det = 1-9 = -8<0$, so the eigenvalues ($4$ and $-2$) have opposite signs.

Q: Sylvester's criterion: a real symmetric matrix $A$ is positive definite if and only if
* all its leading principal minors are positive
- all its diagonal entries are positive
- $\det A>0$
- all its entries are positive
E: Theorem 8.4.3. Positive diagonal entries are necessary but not sufficient: $\begin{pmatrix}1&2\\2&1\end{pmatrix}$ is indefinite.

Q: Which statement about positive SEMIdefiniteness of a symmetric matrix is FALSE?
* It holds whenever all leading principal minors are $\ge0$
- It holds iff all eigenvalues are $\ge0$
- It holds iff $x^TAx\ge0$ for every $x$
- It holds iff $A = B^TB$ for some matrix $B$
E: $\diag(0,-1)$ has leading minors $0,0$ but $x^TAx = -y^2$ can be negative. (For semidefiniteness ALL principal minors must be checked.)

Q: The curve $5x^2-4xy+8y^2 = 36$ is
* an ellipse
- a hyperbola
- a parabola
- a pair of intersecting lines
E: Eigenvalues $4$ and $9$ are both positive: in principal axes $4X^2+9Y^2 = 36$ (Example 8.3.2).

Q: For a real symmetric $A$, the maximum of $x^TAx$ over unit vectors $x$ equals
* the largest eigenvalue of $A$
- $\det A$
- the trace of $A$
- the largest entry of $A$
E: Rayleigh's theorem 8.5.1; the maximum is attained at a unit eigenvector for $\lambda_{\max}$.

Q: At a critical point of $f(x,y)$ the Hessian has eigenvalues $3$ and $-2$. The point is
* a saddle point
- a local minimum
- a local maximum
- impossible to classify
E: An indefinite Hessian gives a saddle point (Theorem 8.5.3).

Q: A symmetric $A$ has eigenvalues $0$ and $5$. Then $x^TAx$ is
* positive semidefinite but not positive definite
- positive definite
- indefinite
- negative semidefinite
E: All eigenvalues are $\ge0$ and one equals $0$, so $Q(v) = 0$ for an eigenvector $v\neq0$ of $0$.

Q: Substituting $x = Py$ ($P$ orthogonal) into $x^TAx$ gives
* $y^T(P^TAP)y$
- $y^T(PAP^T)y$
- $y^TAy$
- $y^T(P^{-1}AP^{-1})y$
E: $(Py)^TA(Py) = y^TP^TAPy$. With $P$ = orthonormal eigenvectors, $P^TAP = D$ (Theorem 8.3.1).

## ch5 | Chapter 5 — Systems of Linear Equations
Q: Two $m\times n$ matrices are equivalent ($B = PAQ$ with $P,Q$ invertible) if and only if
* they have the same rank
- they have the same determinant
- they have the same eigenvalues
- they have the same reduced row echelon form
E: Theorem 5.3.4: rank is the only invariant of equivalence. (Same RREF characterises ROW-equivalence.)

Q: An elementary column operation on $A$ is the same as
* multiplying $A$ on the right by an elementary matrix
- multiplying $A$ on the left by an elementary matrix
- transposing $A$
- adding a multiple of $I$ to $A$
E: Definition 5.3.1. Row operations multiply on the left.

Q: The normal form of a $3\times4$ matrix of rank $2$ is
* $\begin{pmatrix}I_2&0\\0&0\end{pmatrix}$ of size $3\times4$
- $I_3$
- $I_2$
- the RREF of the matrix
E: Theorem 5.3.3: $N_r$ has the same size as $A$ with $I_r$ in the top-left corner.
`;

  function parse(raw) {
    const sets = {}; let cur = null, q = null;
    const flush = () => { if (q && cur) cur.qs.push(q); q = null; };
    raw.split("\n").forEach((line) => {
      const l = line.replace(/\s+$/, "");
      if (l.startsWith("## ")) { flush(); const [id, title] = l.slice(3).split("|").map((s) => s.trim()); cur = sets[id] = sets[id] || { id, title, qs: [] }; }
      else if (l.startsWith("Q: ")) { flush(); q = { q: l.slice(3), o: [], a: -1, e: "" }; }
      else if (l.startsWith("* ")) { q.a = q.o.length; q.o.push(l.slice(2)); }
      else if (l.startsWith("- ")) { q.o.push(l.slice(2)); }
      else if (l.startsWith("E: ")) { q.e = l.slice(3); }
    });
    flush();
    return sets;
  }
  LA.QUIZ = parse(RAW);
  LA.QUIZ.mix34 = { id: "mix34", title: "Coursework Mix — Chapters 3 & 4", qs: LA.QUIZ.ch3.qs.concat(LA.QUIZ.ch4.qs) };
  LA.QUIZ.all = { id: "all", title: "Everything — all chapters", qs: Object.keys(LA.QUIZ).filter((k) => /^ch\d$/.test(k)).reduce((a, k) => a.concat(LA.QUIZ[k].qs), []) };
})();
