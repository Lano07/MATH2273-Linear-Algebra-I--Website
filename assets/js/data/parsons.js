/* Proof puzzles (Parsons problems). "## id | title | chapter", "S:" statement, "+ " correct line (in order), "x " distractor. */
(function () {
  const RAW = String.raw`
## t0 | Linear maps send 0 to 0 (Prop 3.1.4) | ch3
S: If $T\in\Lin(V,W)$ then $T(0_V) = 0_W$.
+ Since $0_V = 0_V+0_V$, apply $T$ to both sides.
+ By additivity, $T(0_V) = T(0_V+0_V) = T(0_V)+T(0_V)$.
+ $T(0_V)\in W$, so we may add $-T(0_V)$ to both sides.
+ This gives $0_W = T(0_V)$.
x Since $T(0_V) = 0_V$, the result follows immediately.

## kertest | Kernel test: ker T = {0} ⇒ T injective (Thm 3.2.6) | ch3
S: If $\ker T = \{0\}$ then $T$ is injective.
+ Suppose $\ker T = \{0\}$ and let $u,v\in V$ with $T(u) = T(v)$.
+ By linearity, $T(u-v) = T(u)-T(v) = 0$.
+ Hence $u-v\in\ker T = \{0\}$.
+ So $u-v = 0$, i.e. $u = v$; therefore $T$ is injective.
x Since $T(0) = 0$, every vector has exactly one preimage.

## kersub | The kernel is a subspace (Thm 3.2.4(ii)) | ch3
S: $\ker T$ is a subspace of $V$.
+ $T(0) = 0$, so $0\in\ker T$ and $\ker T\neq\emptyset$.
+ Let $\alpha,\beta\in\FF$ and $u,v\in\ker T$, so $T(u) = T(v) = 0$.
+ Then $T(\alpha u+\beta v) = \alpha T(u)+\beta T(v) = \alpha0+\beta0 = 0$.
+ So $\alpha u+\beta v\in\ker T$; by Theorem 2.2.3, $\ker T$ is a subspace of $V$.
x So $\alpha u+\beta v\in\Ran T$, which is a subspace of $W$.

## inverse | The inverse of a bijective linear map is linear (Thm 3.3.4) | ch3
S: If $T\in\Lin(V,W)$ is bijective then $T^{-1}\in\Lin(W,V)$.
+ Let $w_1,w_2\in W$ and $\alpha_1,\alpha_2\in\FF$.
+ Since $T$ is bijective there are unique $v_1,v_2\in V$ with $T(v_1) = w_1$ and $T(v_2) = w_2$.
+ By linearity of $T$: $T(\alpha_1v_1+\alpha_2v_2) = \alpha_1w_1+\alpha_2w_2$.
+ Hence $T^{-1}(\alpha_1w_1+\alpha_2w_2) = \alpha_1v_1+\alpha_2v_2 = \alpha_1T^{-1}(w_1)+\alpha_2T^{-1}(w_2)$.
x Hence $T^{-1}$ is injective, so it is linear.

## injLI | Injective maps preserve independence (Thm 3.3.6) | ch3
S: If $T$ is injective and $S = \{u_1,\dots,u_n\}$ is linearly independent, then $T(S)$ is linearly independent.
+ Suppose $a_1T(u_1)+\dots+a_nT(u_n) = 0$.
+ By linearity, $T(a_1u_1+\dots+a_nu_n) = 0 = T(0)$.
+ Since $T$ is injective, $a_1u_1+\dots+a_nu_n = 0$.
+ Since $S$ is independent, $a_1 = \dots = a_n = 0$; so $T(S)$ is independent.
x Since $T(S)$ spans $W$, it is independent.

## composition | A composition of linear maps is linear | ch3
S: If $f\in\Lin(U,V)$ and $g\in\Lin(V,W)$ then $g\circ f\in\Lin(U,W)$.
+ Let $\alpha,\beta\in\FF$ and $u,v\in U$.
+ $(g\circ f)(\alpha u+\beta v) = g\big(f(\alpha u+\beta v)\big)$ by definition of composition.
+ $= g\big(\alpha f(u)+\beta f(v)\big)$ since $f$ is linear.
+ $= \alpha g(f(u))+\beta g(f(v)) = \alpha(g\circ f)(u)+\beta(g\circ f)(v)$ since $g$ is linear.
x $= f(g(\alpha u))+f(g(\beta v))$ since composition is commutative.

## wperp | W⊥ is a subspace (Prop 4.2.5(ii)) | ch4
S: If $W\neq\emptyset$ then $W^\perp$ is a subspace of $V$.
+ For every $w\in W$, $\langle0,w\rangle = 0$; so $0\in W^\perp$.
+ Let $u_1,u_2\in W^\perp$, $a,b\in\R$ and let $w\in W$.
+ By linearity, $\langle au_1+bu_2,w\rangle = a\langle u_1,w\rangle+b\langle u_2,w\rangle$.
+ $= a\cdot0+b\cdot0 = 0$, so $au_1+bu_2\in W^\perp$.
+ By Theorem 2.2.3, $W^\perp$ is a subspace of $V$.
x $\langle au_1+bu_2,w\rangle = \langle u_1,w\rangle\langle u_2,w\rangle = 0$.

## pyth | Pythagorean Theorem (Prop 4.2.6) | ch4
S: If $\langle u,v\rangle = 0$ then $\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2$.
+ $\lVert u+v\rVert^2 = \langle u+v,\,u+v\rangle$ by definition of the norm.
+ $= \langle u,u\rangle+\langle u,v\rangle+\langle v,u\rangle+\langle v,v\rangle$ by linearity and symmetry.
+ $= \lVert u\rVert^2+2\langle u,v\rangle+\lVert v\rVert^2$.
+ $= \lVert u\rVert^2+\lVert v\rVert^2$ since $\langle u,v\rangle = 0$.
x $= (\lVert u\rVert+\lVert v\rVert)^2$ by the triangle inequality.

## orthLI | Orthogonal non-zero vectors are independent (Thm 4.2.11) | ch4
S: Mutually orthogonal non-zero vectors $u_1,\dots,u_n$ are linearly independent.
+ Suppose $a_1u_1+\dots+a_nu_n = 0$.
+ Take the inner product with $u_i$: $a_1\langle u_1,u_i\rangle+\dots+a_n\langle u_n,u_i\rangle = \langle0,u_i\rangle = 0$.
+ Orthogonality kills every term with $j\neq i$, leaving $a_i\langle u_i,u_i\rangle = 0$.
+ Since $u_i\neq0$, $\langle u_i,u_i\rangle\neq0$, so $a_i = 0$.
+ This holds for each $i$, so $\{u_1,\dots,u_n\}$ is linearly independent.
x Since each $\lVert u_i\rVert = 1$, the vectors form a basis.

## cs | Cauchy–Schwarz (Thm 4.2.7) | ch4
S: $|\langle u,v\rangle|\le\lVert u\rVert\,\lVert v\rVert$.
+ If $v = 0$ both sides are $0$, so assume $v\neq0$.
+ For every $t\in\R$: $0\le\lVert u-tv\rVert^2 = \lVert u\rVert^2-2t\langle u,v\rangle+t^2\lVert v\rVert^2$.
+ Choose $t = \dfrac{\langle u,v\rangle}{\lVert v\rVert^2}$.
+ Then $0\le\lVert u\rVert^2-\dfrac{\langle u,v\rangle^2}{\lVert v\rVert^2}$.
+ Hence $\langle u,v\rangle^2\le\lVert u\rVert^2\lVert v\rVert^2$; taking square roots gives the result.
x Choose $t = 1$; then $\lVert u-v\rVert\ge0$ gives the result.

## sints | S ∩ S⊥ = {0} for a subspace S (Prop 4.2.5(iv)) | ch4
S: If $S$ is a subspace then $S\cap S^\perp = \{0\}$.
+ $0\in S$ (a subspace) and $0\in S^\perp$, so $\{0\}\subseteq S\cap S^\perp$.
+ Let $u\in S\cap S^\perp$.
+ Since $u\in S^\perp$, $u$ is orthogonal to every vector of $S$ — including $u$ itself, as $u\in S$.
+ So $\langle u,u\rangle = 0$, and by the coincidence axiom $u = 0$.
+ Therefore $S\cap S^\perp = \{0\}$.
x So $S\cap S^\perp = \emptyset$.

## subtest | One-step subspace test (Thm 2.2.3, ⇐) | ch2
S: If $W\neq\emptyset$ and $au+bv\in W$ for all scalars $a,b$ and $u,v\in W$, then $W$ is a subspace.
+ Pick any $u\in W$ (possible since $W\neq\emptyset$).
+ Taking $a = b = 0$: $0u+0v = 0\in W$.
+ Taking $a = b = 1$: $u+v\in W$, so $W$ is closed under addition.
+ Taking $b = 0$: $au\in W$, so $W$ is closed under scalar multiplication. Hence $W$ is a subspace.
x Since $W\subseteq V$ and $V$ is a vector space, $W$ is automatically a subspace.
`;
  const out = []; let cur = null;
  RAW.split("\n").forEach((l) => {
    if (l.startsWith("## ")) { const [id, title, ch] = l.slice(3).split("|").map((s) => s.trim()); cur = { id, title, ch, s: "", lines: [], dis: [] }; out.push(cur); }
    else if (l.startsWith("S: ") && cur) cur.s = l.slice(3);
    else if (l.startsWith("+ ") && cur) cur.lines.push(l.slice(2));
    else if (l.startsWith("x ") && cur) cur.dis.push(l.slice(2));
  });
  LA.PARSONS = out;
})();
