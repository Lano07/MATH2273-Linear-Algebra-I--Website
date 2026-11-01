/* Chapter 6 — Determinants */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch6", num: 6, title: "Determinants", short: "Determinants", pages: "69–75", quiz: "ch6",
    blurb: "Permutations and their signs, the permutation definition of the determinant, row operations and determinants, transpose and product rules, and determinants as an invertibility / independence test.",
    labs: [["Determinant Lab", "#/labs/det"], ["2D Visualizer (area!)", "#/labs/transform"]],
    goals: [
      "Write permutations in cycle notation and compute their signs.",
      "Compute determinants by the formula, by cofactor expansion, and by row reduction (tracking the effect of each operation).",
      "Use det to test invertibility and linear independence; apply det(AB) = det A det B and det(A⁻¹) = 1/det A.",
    ],
    intro: H`<div class="kicker">The picture</div><p>For a $2\times2$ matrix, $|\det A|$ is the <b>area scale factor</b> of the map $x\mapsto Ax$ (the unit square becomes a parallelogram of area $|\det A|$); the sign says whether orientation flips. $\det A = 0$ means space is squashed flat — the map is not invertible. See it in the <a href="#/labs/transform">2D Visualizer</a>.</p>`,
    sections: [
      { id: "6.1", title: "Permutations and the determinant", html: H`
<div class="box def" data-t="6.1.1 · Permutations, Sₙ and cycles">
<p>A <b>permutation</b> of $S$ is a bijection $S\to S$ (a reshuffle). $S_n$ = all permutations of $\{1,\dots,n\}$; it has $n!$ elements, is closed under $\circ$, contains the identity $e$, has inverses, and $\circ$ is associative but <b>not</b> commutative (the <b>symmetric group</b>). A <b>cycle</b> $(a_1\,a_2\,\dots\,a_k)$ sends $a_1\to a_2\to\dots\to a_k\to a_1$ and fixes everything else.</p>
</div>
<div class="box ex" data-t="6.1.2–6.1.3 · Cycle notation">
<p>$\sigma(1) = 2$, $\sigma(2) = 3$, $\sigma(3) = 1$ is $\sigma = (1\,2\,3)\in S_3$. In $S_6$, $\sigma = (2\,6\,4)(1\,3)$ means $2\to6\to4\to2$, $1\to3\to1$, and $5\to5$ (omitted 1-cycle). This is a <b>disjoint</b> cycle form; $(2\,4)(2\,6)(1\,3)$ is the same permutation but not disjoint.</p>
</div>
<div class="box def" data-t="Sign of a permutation">
<p>Write $\sigma\in S_n$ as a product of $k$ <b>disjoint</b> cycles <b>including 1-cycles</b>; then $\sign(\sigma) = (-1)^{n-k}$.</p>
<p>Example: $\sigma = (2\,6\,4)(1\,3)(5)\in S_6$ has $k = 3$, so $\sign\sigma = (-1)^{3} = -1$. The identity $e = (1)(2)\cdots(n)$ has $k = n$, so $\sign e = 1$.</p>
<p class="small muted">Shortcut: a $k$-cycle has sign $(-1)^{k-1}$ (transpositions are odd, 3-cycles even), and signs multiply.</p>
</div>
<div class="box def" data-t="6.1.4 · Determinant (permutation formula)">
$$\det(A) = |A| = \sum_{\sigma\in S_n}\sign(\sigma)\,a_{1\sigma(1)}a_{2\sigma(2)}\cdots a_{n\sigma(n)}.$$
<p>Each term picks <b>one entry from each row and each column</b>; the sign depends on the permutation of columns.</p>
</div>
<div class="box ex" data-t="6.1.5 · 2×2, 3×3 and the identity">
<p>(i) $S_2 = \{e,(1\,2)\}$: $\det A = a_{11}a_{22} - a_{12}a_{21}$.</p>
<p>(ii) $S_3$: $e,(1\,2\,3),(1\,3\,2)$ have sign $+1$; $(1\,2),(1\,3),(2\,3)$ have sign $-1$:
$$\det A = a_{11}a_{22}a_{33}-a_{12}a_{21}a_{33}-a_{13}a_{22}a_{31}-a_{11}a_{23}a_{32}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}$$
$$= a_{11}\begin{vmatrix}a_{22}&a_{23}\\a_{32}&a_{33}\end{vmatrix} - a_{12}\begin{vmatrix}a_{21}&a_{23}\\a_{31}&a_{33}\end{vmatrix} + a_{13}\begin{vmatrix}a_{21}&a_{22}\\a_{31}&a_{32}\end{vmatrix}.$$</p>
<p>(iii) $\det I_n = 1$: only $\sigma = e$ avoids a zero factor.</p>
</div>
<div class="box tip" data-t="Cofactor (Laplace) expansion — along ANY row or column">
<p>$\det A = \sum_j(-1)^{i+j}a_{ij}M_{ij}$ (row $i$) where $M_{ij}$ is the minor (delete row $i$, column $j$). Signs follow the chessboard $\begin{smallmatrix}+&-&+\\-&+&-\\+&-&+\end{smallmatrix}$. <b>Expand along the row/column with the most zeros.</b></p>
</div>
<div class="box thm" data-t="6.1.7 · Row operations and the determinant ★">
<p>(i) Swap two rows: $\det B = -\det A$. (ii) Multiply a row by $c$: $\det B = c\det A$. (iii) $R_i\to R_i+cR_j$: $\det B = \det A$ (unchanged!). (iv) Two equal columns (or rows) ⇒ $\det A = 0$. (v) Triangular ⇒ $\det A$ = product of diagonal entries.</p>
</div>
<div class="box recipe" data-t="Determinant by row reduction (6.1.8)">
<ol class="recipe-steps"><li>Use $R_i\to R_i+cR_j$ freely (no change) to create zeros below the diagonal.</li><li>Every swap: multiply by $-1$. Every $R_i\to cR_i$: the new determinant is $c$ times the old, so <b>divide by $c$</b> to compensate (the notes write the factor $\frac1c$ in front).</li><li>At triangular form: multiply the diagonal, times the compensating factors.</li></ol>
</div>
<div class="box ex" data-t="6.1.9 · A 4×4 determinant">
<p>$A = \begin{pmatrix}1&3&6&2\\0&4&1&3\\1&6&4&4\\-1&1&2&3\end{pmatrix}$. Clear column 1 ($R_3\to R_3-R_1$, $R_4\to R_4+R_1$), then $R_4\to R_4-R_2$:</p>
$$|A| = \begin{vmatrix}1&3&6&2\\0&4&1&3\\0&3&-2&2\\0&0&7&2\end{vmatrix}\quad\text{then expand along column 1:}\quad = 1\cdot\begin{vmatrix}4&1&3\\3&-2&2\\0&7&2\end{vmatrix} = 4(-4-14) - 1(6-0) + 3(21-0) = -72-6+63 = -15.$$
<p class="small muted">The notes reach the same $-15$ by scaling rows ($R_2\to3R_2$, $R_3\to4R_3$, …) and dividing by the factors $3\cdot4\cdot7\cdot11 = 924$ at the end.</p>
</div>` },
      { id: "6.2", title: "Properties of the determinant", html: H`
<div class="box thm" data-t="6.2.1 · det(Aᵀ) = det(A)">
<p>Reason: $\sigma\mapsto\sigma^{-1}$ is a bijection of $S_n$ and $\sign(\sigma^{-1}) = \sign(\sigma)$, so the sum for $A^T$ is a reordering of the sum for $A$. <b>Consequence:</b> every row rule in 6.1.7 also holds for columns.</p>
</div>
<div class="box def" data-t="6.2.2–6.2.3 · Singular matrices">
<p>$A$ is <b>singular</b> if $\det A = 0$, otherwise non-singular. <b>Theorem 6.2.3:</b> $A$ is non-singular ⇔ $A$ is invertible.</p>
</div>
<div class="box thm" data-t="6.2.4 · det tests independence">
<p>$\det A\ne0$ ⇔ the columns (equivalently rows) of $A$ are linearly independent.</p>
</div>
<div class="box ex" data-t="6.2.5 · Are (1,1,4), (2,5,3), (6,1,1) independent?">
$$\begin{vmatrix}1&2&6\\1&5&1\\4&3&1\end{vmatrix} = 1(5-3)-2(1-4)+6(3-20) = 2+6-102 = -94\ne0,$$
<p>so yes — they are independent (and form a basis of $\R^3$).</p>
</div>
<div class="box thm" data-t="6.2.6–6.2.7 · Product rule and inverses">
<p>$\det(AB) = \det(A)\det(B)$, and if $A$ is invertible, $\det(A^{-1}) = \dfrac{1}{\det A}$ (from $\det(A^{-1})\det(A) = \det(I) = 1$).</p>
</div>
<div class="box trap" data-t="Determinant myths">
<ul><li>$\det(A+B)\ne\det A+\det B$ in general.</li>
<li>$\det(cA) = c^n\det A$ for an $n\times n$ matrix — <b>not</b> $c\det A$.</li>
<li>Scaling a row by $c$ multiplies the determinant by $c$; don't forget to compensate when you use $R_i\to cR_i$ during elimination.</li></ul>
</div>
<div class="box beyond" data-t="Two classic uses the notes mention: inverses and solving systems">
<ul><li><b>Adjugate formula:</b> $A^{-1} = \frac{1}{\det A}\operatorname{adj}(A)$, where $\operatorname{adj}(A)$ is the transpose of the cofactor matrix. For $2\times2$: $\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1} = \frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$.</li>
<li><b>Cramer's rule:</b> if $\det A\ne0$, the solution of $Ax = b$ is $x_i = \dfrac{\det A_i}{\det A}$, where $A_i$ is $A$ with column $i$ replaced by $b$.</li>
<li>Geometry: $|\det A|$ = volume scale factor; $\det(A) \lt 0$ means orientation is reversed.</li></ul>
</div>` },
    ],
    exercises: H`
<h2>Exercise 6 — full solutions</h2>
<div class="box exam" data-t="(a) det of a 3×3">
<p>$\begin{pmatrix}1&-6&5\\4&3&3\\3&4&1\end{pmatrix}$</p>
<details class="reveal sol"><summary>Full solution</summary>
$$\det = 1(3\cdot1-3\cdot4) - (-6)(4\cdot1-3\cdot3) + 5(4\cdot4-3\cdot3) = -9 + 6(-5) + 5(7) = -9-30+35 = -4.$$
</details></div>
<div class="box exam" data-t="(b) det of a 4×4">
<p>$\begin{pmatrix}1&4&3&3\\2&5&3&4\\1&2&3&4\\1&1&1&1\end{pmatrix}$</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>$R_2\to R_2-2R_1$, $R_3\to R_3-R_1$, $R_4\to R_4-R_1$ (no change to det), then expand along column 1:
$$\begin{vmatrix}1&4&3&3\\0&-3&-3&-2\\0&-2&0&1\\0&-3&-2&-2\end{vmatrix} = \begin{vmatrix}-3&-3&-2\\-2&0&1\\-3&-2&-2\end{vmatrix} = -3(0+2) + 3(4+3) - 2(4-0) = -6+21-8 = 7.$$</p>
</details></div>
<div class="box exam" data-t="(c) det of a 4×4 (expand along the row with zeros)">
<p>$\begin{pmatrix}5&4&0&2\\0&0&2&3\\1&2&4&3\\8&1&-1&-1\end{pmatrix}$</p>
<details class="reveal sol"><summary>Full solution</summary>
<p>Row 2 is $(0,0,2,3)$, so $\det = 2C_{23}+3C_{24}$ with $C_{ij} = (-1)^{i+j}M_{ij}$:
$$M_{23} = \begin{vmatrix}5&4&2\\1&2&3\\8&1&-1\end{vmatrix} = 5(-5)-4(-25)+2(-15) = 45,\qquad M_{24} = \begin{vmatrix}5&4&0\\1&2&4\\8&1&-1\end{vmatrix} = 5(-6)-4(-33) = 102.$$
$$\det = 2(-1)^{5}(45) + 3(-1)^{6}(102) = -90+306 = 216.$$</p>
</details></div>`,
    summary: H`<div class="card glow"><div class="kicker">Chapter 6 on one page</div><div class="tbl-wrap"><table class="tbl">
<tr><th>Idea</th><th>Key fact</th></tr>
<tr><td>Sign</td><td>$(-1)^{n-k}$ with $k$ disjoint cycles (incl. 1-cycles)</td></tr>
<tr><td>Formula</td><td>$\det A = \sum_\sigma\sign\sigma\prod_i a_{i\sigma(i)}$</td></tr>
<tr><td>$2\times2$</td><td>$ad-bc$</td></tr>
<tr><td>Row ops</td><td>swap: $\times(-1)$; scale row by $c$: $\times c$; add multiple: no change</td></tr>
<tr><td>Triangular</td><td>product of diagonal</td></tr>
<tr><td>Transpose</td><td>$\det A^T = \det A$</td></tr>
<tr><td>Product / inverse</td><td>$\det(AB) = \det A\det B$, $\det A^{-1} = 1/\det A$</td></tr>
<tr><td>Invertible</td><td>$\iff\det A\ne0\iff$ columns independent</td></tr>
<tr><td>Scaling</td><td>$\det(cA) = c^n\det A$</td></tr></table></div></div>`,
  });
})();
