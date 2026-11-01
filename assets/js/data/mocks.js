/* Mock coursework tests (Chapters 3 & 4). Original UWI-style questions with marking schemes; all answers CAS-verified. */
(function () {
  const H = String.raw;
  LA.MOCKS = [
    {
      id: "A", title: "Mock Test A — Core skills", level: "Standard", minutes: 60, marks: 50,
      intro: "Answer ALL questions. Show all working. Marks are shown in brackets.",
      questions: [
        { n: 1, title: "Linear transformations", parts: [
          { l: "(a)", m: 2, q: H`Define a <b>linear transformation</b> $T:V\to W$, where $V,W$ are vector spaces over a field $\FF$.`,
            s: [[1, "States $T(\\alpha u) = \\alpha T(u)$ for all $\\alpha\\in\\FF$, $u\\in V$"], [1, "States $T(u+v) = T(u)+T(v)$ for all $u,v\\in V$ (or the combined condition)"]],
            a: H`$T$ is linear if for all $\alpha\in\FF$ and all $u,v\in V$: $T(\alpha u) = \alpha T(u)$ and $T(u+v) = T(u)+T(v)$.` },
          { l: "(b)", m: 4, q: H`Prove that $T:\R^3\to\R^2$, $T(x,y,z) = (2x-y,\;y+3z)$ is a linear transformation.`,
            s: [[1, "Introduces general $u=(u_1,u_2,u_3)$, $v=(v_1,v_2,v_3)$ and scalars"], [1, "Correctly computes $T(\\alpha u+\\beta v)$ componentwise"], [1, "Regroups into $\\alpha(\\ldots)+\\beta(\\ldots)$"], [1, "Concludes $=\\alpha T(u)+\\beta T(v)$, so $T$ is linear"]],
            a: H`Let $\alpha,\beta\in\R$, $u = (u_1,u_2,u_3)$, $v = (v_1,v_2,v_3)$. Then
$$\begin{aligned}T(\alpha u+\beta v) &= \big(2(\alpha u_1+\beta v_1)-(\alpha u_2+\beta v_2),\;(\alpha u_2+\beta v_2)+3(\alpha u_3+\beta v_3)\big)\\&= \alpha(2u_1-u_2,\;u_2+3u_3)+\beta(2v_1-v_2,\;v_2+3v_3) = \alpha T(u)+\beta T(v).\end{aligned}$$
Hence $T$ is linear (Theorem 3.1.3).` },
          { l: "(c)", m: 2, q: H`Show that $S:\R^2\to\R^2$, $S(x,y) = (x+1,\;y)$ is <b>not</b> linear.`,
            s: [[1, "Computes $S(0,0) = (1,0)$ (or another valid counterexample)"], [1, "Concludes using $T(0)=0$ for linear maps (Prop 3.1.4)"]],
            a: H`$S(0,0) = (1,0)\neq(0,0)$. Every linear map sends $0$ to $0$ (Proposition 3.1.4), so $S$ is not linear.` },
          { l: "(d)", m: 4, q: H`$T\in\Lin(\R^2,\R^3)$ satisfies $T(1,1) = (1,0,2)$ and $T(1,-1) = (3,2,0)$. Find $T(x,y)$.`,
            s: [[1, "Writes $(x,y) = a(1,1)+b(1,-1)$"], [1, "Solves $a = \\frac{x+y}{2}$, $b = \\frac{x-y}{2}$"], [1, "Applies linearity $T(x,y) = aT(1,1)+bT(1,-1)$"], [1, "Correct answer $(2x-y,\\;x-y,\\;x+y)$"]],
            a: H`$(x,y) = a(1,1)+b(1,-1)$ gives $a+b = x$, $a-b = y$, so $a = \frac{x+y}{2}$, $b = \frac{x-y}{2}$. Then
$$T(x,y) = \tfrac{x+y}{2}(1,0,2)+\tfrac{x-y}{2}(3,2,0) = (2x-y,\;x-y,\;x+y).$$
Check: $T(1,1) = (1,0,2)$ ✔, $T(1,-1) = (3,2,0)$ ✔.` },
        ] },
        { n: 2, title: "Kernel, range and Rank–Nullity", parts: [
          { l: "", m: 0, q: H`Let $T:\R^4\to\R^3$, $\;T(x,y,z,w) = (x+y-z,\;2x+y+w,\;x+z+w)$.` },
          { l: "(a)", m: 5, q: H`Find a basis for $\ker T$ and state $\Nullity(T)$.`,
            s: [[1, "Sets up $T(v) = 0$ / coefficient matrix"], [2, "Correct row reduction to echelon form"], [1, "Correct parametric solution / basis $\\{(-1,2,1,0),(-1,1,0,1)\\}$"], [1, "$\\Nullity(T) = 2$"]],
            a: H`$$\begin{pmatrix}1&1&-1&0\\2&1&0&1\\1&0&1&1\end{pmatrix}\to\begin{pmatrix}1&1&-1&0\\0&-1&2&1\\0&0&0&0\end{pmatrix}.$$ Free: $z = s$, $w = t$; then $y = 2s+t$, $x = -s-t$. $\ker T = \spn\{(-1,2,1,0),(-1,1,0,1)\}$, $\Nullity = 2$.` },
          { l: "(b)", m: 4, q: H`Find a basis for $\Ran T$ and state $\Rank(T)$.`,
            s: [[1, "Uses $\\Ran T = \\spn\\{T(e_i)\\}$ / column space"], [2, "Correct basis, e.g. $\\{(1,2,1),(1,1,0)\\}$"], [1, "$\\Rank(T) = 2$"]],
            a: H`$\Ran T$ is spanned by the columns of the matrix; the pivot columns (1 and 2) give the basis $\{(1,2,1),(1,1,0)\}$. $\Rank T = 2$.` },
          { l: "(c)", m: 1, q: H`Verify the Rank–Nullity Theorem for $T$.`, s: [[1, "$2+2 = 4 = \\dim\\R^4$"]], a: H`$\Rank+\Nullity = 2+2 = 4 = \dim\R^4$ ✔.` },
          { l: "(d)", m: 4, q: H`Is $T$ injective? Is $T$ surjective? Justify.`,
            s: [[2, "Not injective because $\\ker T\\neq\\{0\\}$ (Thm 3.2.6)"], [2, "Not surjective because $\\Rank T = 2\\lt3 = \\dim\\R^3$"]],
            a: H`Not injective: $\ker T\neq\{0\}$. Not surjective: $\dim\Ran T = 2\lt3$, so $\Ran T\neq\R^3$.` },
        ] },
        { n: 3, title: "The matrix of a linear map", parts: [
          { l: "", m: 0, q: H`Let $T:\P_2\to\P_1$ be defined by $T(p) = p'(x)+p(1)$.` },
          { l: "(a)", m: 3, q: H`Show that $T$ is linear.`,
            s: [[1, "General $p,q$, scalars"], [1, "Uses linearity of derivative and evaluation"], [1, "Conclusion"]],
            a: H`$T(\alpha p+\beta q) = (\alpha p+\beta q)' + (\alpha p+\beta q)(1) = \alpha(p'+p(1))+\beta(q'+q(1)) = \alpha T(p)+\beta T(q)$.` },
          { l: "(b)", m: 5, q: H`Find $[T]^{C}_{B}$ for $B = \{1,\;1+x,\;x^2\}$ and $C = \{1,\;1-x\}$.`,
            s: [[1, "$T(1) = 1$, $T(1+x) = 3$"], [1, "$T(x^2) = 1+2x$"], [2, "Correct $C$-coordinates $(1,0),(3,0),(3,-2)$"], [1, "Assembled as columns"]],
            a: H`$T(1) = 1$, $T(1+x) = 1+2 = 3$, $T(x^2) = 2x+1$. With $a+b(1-x) = (a+b)-bx$: $1\to(1,0)$, $3\to(3,0)$, $1+2x\to(3,-2)$.
$$[T]^C_B = \begin{pmatrix}1&3&3\\0&0&-2\end{pmatrix}.$$` },
          { l: "(c)", m: 4, q: H`Use $[T]^C_B$ to compute $T(2-x+3x^2)$.`,
            s: [[1, "$[p]_B = (3,-1,3)^T$"], [1, "Matrix product $(9,-6)^T$"], [1, "Converts back: $9-6(1-x)$"], [1, "$T(p) = 3+6x$"]],
            a: H`$2-x+3x^2 = 3\cdot1-1(1+x)+3x^2$, so $[p]_B = (3,-1,3)^T$, and $[T(p)]_C = (3-3+9,\;-6)^T = (9,-6)^T$. Hence $T(p) = 9-6(1-x) = 3+6x$ (check: $p' = -1+6x$, $p(1) = 4$ ✔).` },
        ] },
        { n: 4, title: "Inner products and Gram–Schmidt", parts: [
          { l: "(a)", m: 4, q: H`Show that $\langle u,v\rangle = 2u_1v_1+3u_2v_2$ is an inner product on $\R^2$.`,
            s: [[1, "Non-negativity"], [1, "Coincidence (both directions)"], [1, "Symmetry"], [1, "Linearity"]],
            a: H`$\langle u,u\rangle = 2u_1^2+3u_2^2\ge0$; $= 0\iff u_1 = u_2 = 0$; symmetric since real multiplication commutes; $\langle au+bv,w\rangle = 2(au_1+bv_1)w_1+3(au_2+bv_2)w_2 = a\langle u,w\rangle+b\langle v,w\rangle$.` },
          { l: "(b)", m: 3, q: H`With the dot product on $\R^3$, find $S^\perp$ for $S = \{(1,2,-1),(2,0,1)\}$.`,
            s: [[1, "Equations $x+2y-z = 0$, $2x+z = 0$"], [1, "Solves correctly"], [1, "$S^\\perp = \\spn\\{(2,-3,-4)\\}$"]],
            a: H`$z = -2x$ and $x+2y+2x = 0\Rightarrow y = -\frac32x$. So $S^\perp = \{x(1,-\frac32,-2)\} = \spn\{(2,-3,-4)\}$.` },
          { l: "(c)", m: 5, q: H`Apply the Gram–Schmidt process to $\{(1,1,0),(1,0,1),(0,1,1)\}$.`,
            s: [[1, "$w_1 = \\frac1{\\sqrt2}(1,1,0)$"], [1, "$u_2 = (\\frac12,-\\frac12,1)$"], [1, "$w_2 = \\frac1{\\sqrt6}(1,-1,2)$"], [1, "$u_3 = (-\\frac23,\\frac23,\\frac23)$"], [1, "$w_3 = \\frac1{\\sqrt3}(-1,1,1)$"]],
            a: H`$u_1 = (1,1,0)$, $\lVert u_1\rVert^2 = 2$. $u_2 = (1,0,1)-\frac12(1,1,0) = (\frac12,-\frac12,1)\parallel(1,-1,2)$, norm² 6. $u_3 = (0,1,1)-\frac12(1,1,0)-\frac16(1,-1,2) = (-\frac23,\frac23,\frac23)\parallel(-1,1,1)$.
$$\Big\{\tfrac1{\sqrt2}(1,1,0),\;\tfrac1{\sqrt6}(1,-1,2),\;\tfrac1{\sqrt3}(-1,1,1)\Big\}.$$` },
        ] },
      ],
    },
    {
      id: "B", title: "Mock Test B — Proof-heavy", level: "Standard+", minutes: 60, marks: 50,
      intro: "Answer ALL questions. Proofs must be complete and justified.",
      questions: [
        { n: 1, title: "Rank–Nullity", parts: [
          { l: "(a)", m: 2, q: H`State the Rank–Nullity Theorem.`, s: [[1, "Hypotheses: $T\\in\\Lin(V,W)$, $\\dim V$ finite"], [1, "$\\Rank T+\\Nullity T = \\dim V$"]], a: H`If $T\in\Lin(V,W)$ and $V$ is finite-dimensional then $\Rank(T)+\Nullity(T) = \dim V$.` },
          { l: "(b)", m: 6, q: H`$T:\P_2\to\R$, $T(p) = \int_{-1}^1p(x)\,dx$. Find a basis for $\ker T$, and state $\Nullity(T)$ and $\Rank(T)$.`,
            s: [[1, "General $p = a+bx+cx^2$"], [1, "$T(p) = 2a+\\frac{2c}{3}$"], [1, "Condition $c = -3a$"], [1, "Basis $\\{1-3x^2,\\;x\\}$"], [1, "$\\Nullity = 2$"], [1, "$\\Rank = 1$ via Rank–Nullity"]],
            a: H`$T(a+bx+cx^2) = 2a+\frac{2c}{3}$; $= 0\iff c = -3a$. $\ker T = \{a(1-3x^2)+bx\} = \spn\{1-3x^2,x\}$. $\Nullity = 2$, $\Rank = 3-2 = 1$.` },
          { l: "(c)", m: 4, q: H`Prove that for any $T\in\Lin(V,W)$, $\ker T$ is a subspace of $V$.`,
            s: [[1, "$0\\in\\ker T$ since $T(0) = 0$"], [2, "For $u,v\\in\\ker T$: $T(au+bv) = aT(u)+bT(v) = 0$"], [1, "Conclusion via subspace test"]],
            a: H`$T(0) = 0$ so $0\in\ker T$. If $u,v\in\ker T$ and $a,b\in\FF$, $T(au+bv) = aT(u)+bT(v) = 0$, so $au+bv\in\ker T$. By Theorem 2.2.3, $\ker T$ is a subspace.` },
        ] },
        { n: 2, title: "Injectivity and singular maps", parts: [
          { l: "(a)", m: 6, q: H`Prove that a linear map $T$ is injective if and only if $\ker T = \{0\}$.`,
            s: [[1, "(⇒) $u\\in\\ker T\\Rightarrow T(u) = 0 = T(0)$"], [1, "Injectivity gives $u = 0$"], [1, "Hence $\\ker T = \\{0\\}$ (noting $0\\in\\ker T$)"], [1, "(⇐) $T(u) = T(v)\\Rightarrow T(u-v) = 0$"], [1, "$u-v\\in\\ker T = \\{0\\}$"], [1, "$u = v$, so injective"]],
            a: H`(⇒) If $T(u) = 0 = T(0)$, injectivity gives $u = 0$; so $\ker T = \{0\}$. (⇐) If $T(u) = T(v)$ then $T(u-v) = 0$, so $u-v\in\ker T = \{0\}$, i.e. $u = v$.` },
          { l: "(b)", m: 4, q: H`$T:\R^3\to\R^3$, $T(x,y,z) = (x+2y,\;y-z,\;x+3y-z)$. Find $v\neq0$ with $T(v) = 0$. Is $T$ an isomorphism?`,
            s: [[1, "Solves $x+2y = 0$, $y-z = 0$"], [1, "$v = (-2,1,1)$ (or multiple)"], [1, "Verifies third component"], [1, "Not an isomorphism (singular ⇒ not injective)"]],
            a: H`$y = z$, $x = -2z$: $v = (-2,1,1)$ gives $T(v) = (0,0,-2+3-1) = (0,0,0)$. $T$ is singular, so not injective — not an isomorphism.` },
          { l: "(c)", m: 2, q: H`State $\dim\Lin(\R^3,\P_2)$.`, s: [[2, "$3\\times3 = 9$"]], a: H`$\dim\R^3\cdot\dim\P_2 = 3\cdot3 = 9$.` },
        ] },
        { n: 3, title: "A polynomial inner product", parts: [
          { l: "", m: 0, q: H`On $\P_1$ let $\langle p,q\rangle = \int_0^1 p(x)q(x)\,dx$.` },
          { l: "(a)", m: 3, q: H`Verify the coincidence axiom.`, s: [[1, "$\\langle0,0\\rangle = 0$"], [1, "$\\int_0^1p^2 = 0\\Rightarrow p\\equiv0$ on $[0,1]$ (continuous, non-negative)"], [1, "Infinitely many roots ⇒ zero polynomial"]], a: H`$\langle0,0\rangle = 0$. If $\int_0^1p^2 = 0$, since $p^2\ge0$ is continuous, $p(x) = 0$ on $[0,1]$; a polynomial with infinitely many roots is $0$.` },
          { l: "(b)", m: 2, q: H`Compute $\lVert1+x\rVert$.`, s: [[1, "$\\int_0^1(1+x)^2 = \\frac73$"], [1, "$\\sqrt{7/3}$"]], a: H`$\int_0^1(1+2x+x^2)dx = \frac73$, so $\lVert1+x\rVert = \sqrt{7/3}$.` },
          { l: "(c)", m: 4, q: H`Find $\{1+x\}^\perp$.`, s: [[1, "General $a+bx$"], [1, "$\\frac{3a}{2}+\\frac{5b}{6} = 0$"], [1, "$9a+5b = 0$"], [1, "$\\spn\\{5-9x\\}$"]], a: H`$\langle a+bx,1+x\rangle = \frac{3a}{2}+\frac{5b}{6} = 0\iff 9a+5b = 0$. So $\{1+x\}^\perp = \spn\{5-9x\}$.` },
          { l: "(d)", m: 5, q: H`Apply Gram–Schmidt to $\{1,x\}$.`, s: [[1, "$\\lVert1\\rVert = 1\\Rightarrow w_1 = 1$"], [1, "$\\langle x,1\\rangle = \\frac12$"], [1, "$u_2 = x-\\frac12$"], [1, "$\\lVert u_2\\rVert^2 = \\frac1{12}$"], [1, "$w_2 = \\sqrt3(2x-1)$"]], a: H`$w_1 = 1$. $u_2 = x-\frac12$, $\lVert u_2\rVert^2 = \int_0^1(x-\frac12)^2 = \frac1{12}$, so $w_2 = \sqrt{12}(x-\frac12) = \sqrt3(2x-1)$.` },
        ] },
        { n: 4, title: "Orthogonality proofs", parts: [
          { l: "(a)", m: 4, q: H`Prove the Pythagorean Theorem: if $u\perp v$ then $\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2$.`, s: [[1, "Writes $\\langle u+v,u+v\\rangle$"], [2, "Expands correctly using linearity & symmetry"], [1, "Uses $\\langle u,v\\rangle = 0$"]], a: H`$\lVert u+v\rVert^2 = \langle u,u\rangle+2\langle u,v\rangle+\langle v,v\rangle = \lVert u\rVert^2+\lVert v\rVert^2$ since $\langle u,v\rangle = 0$.` },
          { l: "(b)", m: 5, q: H`Prove that a set of mutually orthogonal non-zero vectors is linearly independent.`, s: [[1, "Starts from $\\sum a_iu_i = 0$"], [1, "Takes inner product with $u_j$"], [1, "Orthogonality kills other terms"], [1, "$a_j\\langle u_j,u_j\\rangle = 0$ with $\\langle u_j,u_j\\rangle\\neq0$"], [1, "All $a_j = 0$"]], a: H`See Theorem 4.2.11.` },
          { l: "(c)", m: 3, q: H`Let $W\neq\emptyset$ be a subset of an IPS $V$. Prove that $W^\perp$ is a subspace of $V$.`, s: [[1, "$0\\in W^\\perp$"], [1, "Linearity computation"], [1, "Conclusion"]], a: H`See Proposition 4.2.5(ii).` },
        ] },
      ],
    },
    {
      id: "C", title: "Mock Test C — Challenge paper", level: "Hard", minutes: 60, marks: 50,
      intro: "A tougher paper mixing computation and proof. Aim for 35+.",
      questions: [
        { n: 1, title: "Compositions", parts: [
          { l: "", m: 0, q: H`Let $T\in\Lin(V,W)$ and $S\in\Lin(W,U)$.` },
          { l: "(a)", m: 3, q: H`Prove that $S\circ T\in\Lin(V,U)$.`, s: [[1, "Applies linearity of $T$"], [1, "Applies linearity of $S$"], [1, "Conclusion"]], a: H`$(S\circ T)(\alpha u+\beta v) = S(\alpha T(u)+\beta T(v)) = \alpha S(T(u))+\beta S(T(v))$.` },
          { l: "(b)", m: 3, q: H`Prove that $\ker T\subseteq\ker(S\circ T)$.`, s: [[1, "Let $v\\in\\ker T$"], [1, "$(S\\circ T)(v) = S(0)$"], [1, "$= 0$, so $v\\in\\ker(S\\circ T)$"]], a: H`If $T(v) = 0$ then $(S\circ T)(v) = S(0) = 0$.` },
          { l: "(c)", m: 2, q: H`Deduce that if $T$ is singular then $S\circ T$ is singular.`, s: [[2, "Non-zero $v\\in\\ker T\\subseteq\\ker(S\\circ T)$"]], a: H`A non-zero $v\in\ker T$ lies in $\ker(S\circ T)$ by (b).` },
          { l: "(d)", m: 4, q: H`Give an example where $S\circ T$ is singular but $T$ is non-singular.`, s: [[2, "Valid injective $T$ (e.g. $T(x) = (x,0)$)"], [1, "Valid $S$ (e.g. $S(x,y) = y$)"], [1, "Verifies $S\\circ T = 0$ is singular"]], a: H`$T:\R\to\R^2$, $T(x) = (x,0)$ (injective) and $S:\R^2\to\R$, $S(x,y) = y$. Then $(S\circ T)(x) = 0$ for all $x$ — singular.` },
        ] },
        { n: 2, title: "An isomorphism", parts: [
          { l: "", m: 0, q: H`Let $f:\R^2\to\R^2$, $f(x,y) = (2x-y,\;x+y)$.` },
          { l: "(a)", m: 6, q: H`Show that $f$ is an isomorphism.`, s: [[2, "Linearity shown"], [2, "$\\ker f = \\{0\\}$ shown"], [2, "Surjective via Rank–Nullity / equal dimensions"]], a: H`Linear (componentwise linear formulas). $f(x,y) = 0\Rightarrow 2x-y = 0 = x+y\Rightarrow x = y = 0$. Rank $= 2-0 = 2 = \dim\R^2$, so onto. Hence bijective.` },
          { l: "(b)", m: 3, q: H`Find $f^{-1}$.`, s: [[1, "Solves for $x$"], [1, "Solves for $y$"], [1, "$f^{-1}(u,v) = (\\frac{u+v}{3},\\frac{2v-u}{3})$"]], a: H`$f^{-1}(u,v) = \big(\frac{u+v}{3},\;\frac{2v-u}{3}\big)$.` },
          { l: "(c)", m: 3, q: H`Find $[f]_B$ for $B = \{(1,1),(1,-1)\}$.`, s: [[1, "$f(1,1) = (1,2)$, $f(1,-1) = (3,0)$"], [1, "Coordinates $(\\frac32,-\\frac12)$ and $(\\frac32,\\frac32)$"], [1, "Matrix assembled"]], a: H`$(1,2) = \frac32(1,1)-\frac12(1,-1)$ and $(3,0) = \frac32(1,1)+\frac32(1,-1)$, so $[f]_B = \begin{pmatrix}\frac32&\frac32\\-\frac12&\frac32\end{pmatrix}$.` },
        ] },
        { n: 3, title: "A diagonalizing basis", parts: [
          { l: "", m: 0, q: H`$T(x,y) = (3x+y,\;x+3y)$ and $B = \{(1,1),(1,-1)\}$.` },
          { l: "(a)", m: 5, q: H`Find $[T]_B$ and show that $B$ diagonalizes $T$.`, s: [[2, "$T(1,1) = 4(1,1)$"], [2, "$T(1,-1) = 2(1,-1)$"], [1, "$[T]_B = \\diag(4,2)$, diagonal"]], a: H`$T(1,1) = (4,4) = 4(1,1)$, $T(1,-1) = (2,-2) = 2(1,-1)$, so $[T]_B = \begin{pmatrix}4&0\\0&2\end{pmatrix}$.` },
          { l: "(b)", m: 4, q: H`Write down the standard matrix $A$ and an invertible $P$ with $P^{-1}AP = \diag(4,2)$.`, s: [[2, "$A = \\begin{pmatrix}3&1\\\\1&3\\end{pmatrix}$"], [2, "$P = \\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$ (basis vectors as columns)"]], a: H`$A = \begin{pmatrix}3&1\\1&3\end{pmatrix}$, $P = \begin{pmatrix}1&1\\1&-1\end{pmatrix}$.` },
          { l: "(c)", m: 3, q: H`Are $A$ and $\diag(4,2)$ similar? Justify.`, s: [[3, "Yes — by definition, $P$ invertible with $P^{-1}AP = D$"]], a: H`Yes: $P$ is invertible ($\det P = -2$) and $P^{-1}AP = D$ (Definition 3.4.7).` },
        ] },
        { n: 4, title: "Matrix inner products & Cauchy–Schwarz", parts: [
          { l: "", m: 0, q: H`On $\R^{2\times2}$ let $\langle A,B\rangle = a_{11}b_{11}+2a_{12}b_{12}+2a_{21}b_{21}+a_{22}b_{22}$.` },
          { l: "(a)", m: 4, q: H`Prove non-negativity and coincidence for this inner product.`, s: [[2, "$\\langle A,A\\rangle = a_{11}^2+2a_{12}^2+2a_{21}^2+a_{22}^2\\ge0$"], [2, "$=0$ iff all entries $0$ (positive weights)"]], a: H`Sum of squares with positive weights; it vanishes iff each entry is $0$.` },
          { l: "(b)", m: 6, q: H`Apply Gram–Schmidt to $\Big\{\begin{pmatrix}1&1\\0&0\end{pmatrix},\begin{pmatrix}1&0\\1&1\end{pmatrix}\Big\}$.`, s: [[1, "$\\lVert A_1\\rVert^2 = 3$"], [1, "$\\langle A_2,A_1\\rangle = 1$"], [2, "$u_2 = \\begin{pmatrix}\\frac23&-\\frac13\\\\1&1\\end{pmatrix}$"], [1, "$\\lVert u_2\\rVert^2 = \\frac{11}{3}$"], [1, "Normalised $w_1,w_2$"]], a: H`$w_1 = \frac1{\sqrt3}\begin{pmatrix}1&1\\0&0\end{pmatrix}$; $u_2 = A_2-\frac13A_1 = \begin{pmatrix}\frac23&-\frac13\\1&1\end{pmatrix}$, $\lVert3u_2\rVert^2 = 4+2+18+9 = 33$, so $w_2 = \frac1{\sqrt{33}}\begin{pmatrix}2&-1\\3&3\end{pmatrix}$.` },
          { l: "(c)", m: 4, q: H`Use Cauchy–Schwarz to prove $(a+b+c)^2\le3(a^2+b^2+c^2)$.`, s: [[2, "Chooses $u = (a,b,c)$, $v = (1,1,1)$"], [1, "Applies C–S"], [1, "Squares to conclude"]], a: H`$|(a,b,c)\cdot(1,1,1)|\le\sqrt{a^2+b^2+c^2}\sqrt3$; square both sides.` },
        ] },
      ],
    },
  ];
})();
