/* Chapter 5 — Systems of Linear Equations */
(function () {
  const H = String.raw;
  LA.chapter({
    id: "ch5", num: 5, title: "Systems of Linear Equations", short: "Linear Systems & RREF", pages: "58–68", quiz: "ch5",
    blurb: "Writing systems as Ax = b, elementary row operations and elementary matrices, row echelon forms (Gauss and Gauss–Jordan), rank, row/column spaces and null spaces.",
    labs: [["Row Reduction Stepper", "#/labs/rref"]],
    goals: [
      "Row-reduce any matrix to REF and RREF, recording each operation in the notes’ notation.",
      "Use elementary matrices and understand why row operations don’t change the solution set.",
      "Find rank, nullity, and bases for the row space, column space and null space.",
      "Classify a system as having a unique solution, infinitely many, or none.",
    ],
    intro: H`<div class="kicker">Why this chapter matters</div><p>Row reduction is the <b>engine</b> behind almost every computation in Chapters 3, 4 and 7: kernels (null spaces), ranges (column spaces), coordinates, matrices of linear maps, eigenvectors. Do it accurately and fast.</p>`,
    sections: [
      { id: "5.1", title: "Systems, row operations and echelon forms", html: H`
<div class="box def" data-t="5.1.1 · Linear system in matrix form">
<p>$m$ equations in $n$ unknowns, $\;a_{i1}x_1+\dots+a_{in}x_n = b_i$, are written $Ax = b$ with $A\in\FF^{m\times n}$, $x\in\FF^{n\times1}$, $b\in\FF^{m\times1}$. <b>Homogeneous</b> if $b = 0$.</p>
</div>
<div class="box def" data-t="5.1.2 · Consistent / inconsistent">
<p>Consistent = has at least one solution; the set of all solutions is the <b>solution set</b>.</p>
</div>
<div class="box ex" data-t="5.1.3 · Two homogeneous systems">
<p>(i) $\begin{pmatrix}1&2\\-1&1\end{pmatrix}x = 0$ has only $x = 0$: solution set $\{(0,0)^T\}$. (ii) $\begin{pmatrix}1&2\\2&4\end{pmatrix}x = 0$ is really one equation $x_1 = -2x_2$: solution set $\{a(-2,1)^T: a\in\R\}$.</p>
</div>
<div class="box def" data-t="5.1.4 · Elementary row operations">
<p>(i) $R_i\leftrightarrow R_j$ (swap); (ii) $R_i\to cR_i$ with $c\ne0$ (scale); (iii) $R_i\to R_i+cR_j$ (add a multiple of another row).</p>
</div>
<div class="box def" data-t="5.1.5 · Equivalent matrices and systems">
<p>$A\cong C$ if $C$ comes from $A$ by finitely many row operations. $[A,b]$ is the <b>augmented matrix</b>; systems are equivalent if their augmented matrices are.</p>
</div>
<div class="box def" data-t="5.1.7 · Elementary matrix">
<p>An $n\times n$ matrix obtained from $I_n$ by <b>exactly one</b> row operation, e.g. $R_1\leftrightarrow R_3$, $R_2\to3R_2$, $R_2\to R_2-2R_1$ give
$$E_1 = \begin{pmatrix}0&0&1\\0&1&0\\1&0&0\end{pmatrix},\;E_2 = \begin{pmatrix}1&0&0\\0&3&0\\0&0&1\end{pmatrix},\;E_3 = \begin{pmatrix}1&0&0\\-2&1&0\\0&0&1\end{pmatrix}.$$</p>
</div>
<div class="box rem" data-t="5.1.9 · Facts about elementary matrices">
<p>(i) Each is invertible, with an elementary inverse (undo the operation: swap again, scale by $\frac1c$, subtract instead of add). (ii) $(E_n\cdots E_1)^{-1} = E_1^{-1}\cdots E_n^{-1}$. (iii) Doing a row operation to $A$ = multiplying <b>on the left</b> by the corresponding elementary matrix (Example 5.1.10).</p>
</div>
<div class="box thm" data-t="5.1.11–5.1.13 · Row operations don’t change solutions">
<p>If $A\cong B$ then $E_n\cdots E_1A = B$ (5.1.11); $\cong$ is an equivalence relation (5.1.12); equivalent systems have the same solution set (5.1.13).</p>
<p class="small"><b>Proof idea of 5.1.13:</b> with $P = E_n\cdots E_1$ invertible, $C = PA$, $d = Pb$. If $Au = b$ then $Cu = PAu = Pb = d$; if $Cu = d$ then $Au = P^{-1}Cu = P^{-1}d = b$.</p>
<p class="small"><b>Proof of 5.1.12:</b> reflexive ($A = IA$); symmetric (undo each operation in reverse order with the inverse elementary matrices); transitive (do one sequence then the other).</p>
</div>
<div class="box def" data-t="REF and RREF">
<p><b>Pivot</b> = leftmost non-zero entry of a non-zero row. <b>Row echelon form (REF):</b> zero rows at the bottom, and each pivot is strictly to the right of the pivot above. <b>Reduced REF (RREF):</b> REF + every pivot equals 1 and is the only non-zero entry in its column. The RREF of a matrix is <b>unique</b> (5.1.15); computing REF is <b>Gauss elimination</b>, RREF is <b>Gauss–Jordan</b> (5.1.16).</p>
</div>
<div class="box proof" data-t="of Theorem 5.1.15 (the RREF is unique)" data-level="a">
<p>Row operations do not change the solutions of $Ax = 0$ (Theorem 5.1.13), so the columns of $A$ and of any RREF $R$ of $A$ satisfy <b>exactly the same linear relations</b> ($\sum x_jc_j = 0$ holds for the columns of $A$ iff it holds for the columns of $R$). In an RREF, column $j$ is a pivot column iff it is <i>not</i> a combination of the earlier columns, and then it equals the next standard basis vector; a non-pivot column lists the coefficients that express it in terms of the earlier pivot columns. Both descriptions depend only on the linear relations among the columns of $A$. Hence two RREFs of $A$ have the same pivot columns and the same non-pivot columns: they are equal.</p></div>
<div class="box ex" data-t="5.1.17(i) · Gauss–Jordan to the identity">
$$\begin{pmatrix}1&2&4\\2&6&-4\\1&1&1\end{pmatrix}\xrightarrow[R_3\to R_3-R_1]{R_2\to R_2-2R_1}\begin{pmatrix}1&2&4\\0&2&-12\\0&-1&-3\end{pmatrix}\xrightarrow{R_3\to R_3+\frac12R_2}\begin{pmatrix}1&2&4\\0&2&-12\\0&0&-9\end{pmatrix}\xrightarrow{R_3\to-\frac19R_3}\begin{pmatrix}1&2&4\\0&2&-12\\0&0&1\end{pmatrix}$$
$$\xrightarrow[R_1\to R_1-4R_3]{R_2\to R_2+12R_3}\begin{pmatrix}1&2&0\\0&2&0\\0&0&1\end{pmatrix}\xrightarrow{R_2\to\frac12R_2}\begin{pmatrix}1&2&0\\0&1&0\\0&0&1\end{pmatrix}\xrightarrow{R_1\to R_1-2R_2}I_3.$$
<p>Since $E_8\cdots E_1A = I_3$, we get $A^{-1} = E_8\cdots E_1$ — i.e. <b>the same operations applied to $I$ produce $A^{-1}$</b>.</p>
</div>
<div class="box ex" data-t="5.1.17(ii) · A 3×4 RREF">
<p>$\begin{pmatrix}0&-1&0&3\\6&5&1&5\\5&4&1&2\end{pmatrix}\cong\begin{pmatrix}1&0&0&6\\0&1&0&-3\\0&0&1&-16\end{pmatrix}$ (verify with the <a href="#/labs/rref">Row Reduction Stepper</a>).</p>
</div>
<div class="box tip" data-t="Row-reduction habits that prevent errors">
<ul><li>Get a <b>1</b> (or $-1$) in the pivot position first (swap a row with a 1 up, or scale) — fewer fractions.</li>
<li>Clear the column <b>below</b> each pivot (REF), then <b>above</b> (RREF), working left to right.</li>
<li>Write every operation next to the arrow — markers award method marks for it.</li>
<li>To avoid fractions you may use $R_i\to pR_i - aR_j$ (scale then add — two legal operations combined).</li>
<li><b>Inverse:</b> row-reduce $[A\,|\,I]$; if you reach $[I\,|\,B]$ then $B = A^{-1}$; if a zero row appears on the left, $A$ is not invertible.</li></ul>
</div>
<div class="box beyond" data-t="How many solutions? (reading the RREF of [A | b])">
<ul><li>A row $(0\;\cdots\;0\,|\,c)$ with $c\neq0$ ⇒ <b>no solution</b> (inconsistent). Equivalently $\Rank A\lt\Rank[A|b]$.</li>
<li>Otherwise, if every column of $A$ has a pivot ⇒ <b>unique</b> solution ($\Rank A = n$).</li>
<li>Otherwise ⇒ <b>infinitely many</b>: one free parameter per non-pivot column ($n - \Rank A$ of them).</li></ul>
<p>Homogeneous systems are always consistent ($x = 0$ works); they have non-trivial solutions iff $\Rank A\lt n$ — guaranteed when there are more unknowns than equations.</p>
</div>` },
      { id: "5.2", title: "Rank, row space, column space and null space", html: H`
<div class="box def" data-t="5.2.1 · Rank of a matrix">
<p>$\Rank(A)$ = number of non-zero rows in an REF (or the RREF) of $A$. E.g. $\Rank(I_n) = n$, $\Rank(O) = 0$.</p>
</div>
<div class="box ex" data-t="5.2.2 · Computing rank">
<p>$\begin{pmatrix}1&2&1&1&1\\2&3&1&2&2\\1&1&0&1&1\end{pmatrix}\cong\begin{pmatrix}1&2&1&1&1\\0&-1&-1&0&0\\0&0&0&0&0\end{pmatrix}$: rank 2. &nbsp; $\begin{pmatrix}2&2&1&1\\1&-1&4&0\\2&1&3&1\end{pmatrix}$: rank 3.</p>
</div>
<div class="box def" data-t="5.2.3 · Row space and column space">
<p>$\RS(A)$ = span of the rows (subspace of $\R^n$); $\CS(A)$ = span of the columns (subspace of $\R^{m\times1}$).</p>
</div>
<div class="box rem" data-t="5.2.4 · Bases for RS and CS">
<p>(i) Rows/columns themselves may be dependent. (ii) The non-zero rows of an REF of $A$ form a basis of $\RS(A)$, so $\dim\RS(A) = \Rank A$. (iii) $\CS(A)$ corresponds to $\RS(A^T)$, and $\dim\CS(A) = \dim\RS(A) = \Rank A$.</p>
</div>
<div class="box proof" data-t="of Remark 5.2.4(ii) (row operations preserve the row space)">
<p>Each elementary operation replaces rows by linear combinations of the old rows, so $\RS(B)\subseteq\RS(A)$ when $B$ comes from $A$. Every operation can be undone by another elementary operation, so also $\RS(A)\subseteq\RS(B)$: the row space never changes. In an echelon form, the non-zero rows are independent: in a relation $\sum c_ir_i = 0$, look at the first pivot column — only $r_1$ is non-zero there, so $c_1 = 0$; then the second pivot column gives $c_2 = 0$, and so on. Hence the non-zero rows form a basis of $\RS(A)$.</p></div>
<div class="box tip" data-t="Column space without transposing">
<p>The notes reduce $A^T$. Faster alternative: row-reduce $A$ once; the columns of the <b>original</b> $A$ that contain pivots form a basis of $\CS(A)$. (Row operations preserve the dependence relations among columns.)</p>
</div>
<div class="box proof" data-t="Why the pivot columns of A give a basis of CS(A)">
<p>$Ax = 0$ and $Rx = 0$ have the same solutions, so a linear relation $\sum x_jc_j = 0$ among the columns of $A$ holds iff the same relation holds among the columns of $R$. In $R$ the pivot columns are distinct standard basis vectors (independent) and every other column is a combination of them. The same is therefore true for the corresponding columns of $A$: the pivot columns of $A$ are independent and span $\CS(A)$. (Row operations <i>do</i> change the column space itself, which is why we must take the columns from the <b>original</b> $A$.)</p></div>
<div class="box ex" data-t="5.2.5 · Row and column space bases">
<p>$A = \begin{pmatrix}1&5&2&1\\4&3&2&1\\1&4&2&1\end{pmatrix}\cong\begin{pmatrix}1&5&2&1\\0&-1&0&0\\0&0&-6&-3\end{pmatrix}$, so $\{(1,5,2,1),(0,-1,0,0),(0,0,-6,-3)\}$ is a basis of $\RS(A)$. Reducing $A^T$ gives the basis $\{(1,4,1)^T,(0,-6,0)^T,(0,0,-1)^T\}$ of $\CS(A)$. $\Rank A = 3$.</p>
</div>
<div class="box def" data-t="5.2.6 · Null space and nullity">
<p>$\Null(A) = \{x\in\R^{n\times1}: Ax = 0\}$, $\;\Nullity(A) = \dim\Null(A)$. By Rank–Nullity (Remark 5.2.7): $\Nullity(A) = n - \Rank(A)$.</p>
</div>
<div class="box ex" data-t="5.2.8 · Null spaces">
<p>(i) $\begin{pmatrix}1&3\\3&2\\2&4\end{pmatrix}$: $x_2 = 0$ then $x_1 = 0$; $\Null(A) = \{0\}$, nullity 0. (ii) $\begin{pmatrix}1&-3\\-3&9\end{pmatrix}\cong\begin{pmatrix}1&-3\\0&0\end{pmatrix}$: $x_1 = 3x_2$, $\Null(A) = \spn\{(3,1)^T\}$, nullity 1.</p>
</div>
<div class="box recipe" data-t="Null space basis from the RREF">
<ol class="recipe-steps"><li>Row-reduce $A$ (no need to augment with zeros — they never change).</li><li>Pivot columns ↔ leading variables; other columns ↔ <b>free</b> variables $s,t,\dots$</li><li>Solve each leading variable in terms of the free ones.</li><li>Write $x = s\,v_1 + t\,v_2+\cdots$; the $v_i$ form a basis. Nullity = number of free variables.</li></ol>
</div>` },
    ],
    exercises: H`
<h2>Exercise 5 — full solutions</h2>
<div class="box exam" data-t="Q1 · Row & column space bases, rank, nullity">
<p>(i) $\begin{pmatrix}1&1&1\\7&6&1\\5&4&1\end{pmatrix}$ (ii) $\begin{pmatrix}1&5&2&6\\3&2&2&-1\\4&-2&1&1\end{pmatrix}$ (iii) $\begin{pmatrix}4&4&2\\1&1&3\\4&5&4\\1&2&1\end{pmatrix}$</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> $R_2\to R_2-7R_1$, $R_3\to R_3-5R_1$: $(0,-1,-6)$, $(0,-1,-4)$; $R_3\to R_3-R_2$: $(0,0,2)$. REF rows $\{(1,1,1),(0,-1,-6),(0,0,2)\}$ — basis of $\RS(A)$. Every column has a pivot, so the columns $\{(1,7,5)^T,(1,6,4)^T,(1,1,1)^T\}$ form a basis of $\CS(A) = \R^3$. $\Rank = 3$, $\Nullity = 3-3 = 0$.</p>
<p><b>(ii)</b> $R_2\to R_2-3R_1$: $(0,-13,-4,-19)$; $R_3\to R_3-4R_1$: $(0,-22,-7,-23)$; $R_3\to13R_3$ then $R_3\to R_3-22R_2$: $(0,0,-3,119)$. REF rows $\{(1,5,2,6),(0,-13,-4,-19),(0,0,-3,119)\}$ — basis of $\RS(A)$. Pivots in columns 1–3, so $\{(1,3,4)^T,(5,2,-2)^T,(2,2,1)^T\}$ is a basis of $\CS(A) = \R^3$. $\Rank = 3$, $\Nullity = 4-3 = 1$; indeed $\Null(A) = \spn\{(-51,-41,119,3)^T\}$.</p>
<p><b>(iii)</b> $R_1\leftrightarrow R_2$; $R_2\to R_2-4R_1$: $(0,0,-10)$; $R_3\to R_3-4R_1$: $(0,1,-8)$; $R_4\to R_4-R_1$: $(0,1,-2)$; $R_2\leftrightarrow R_3$; $R_4\to R_4-R_2$: $(0,0,6)$; $R_4\to R_4+\frac{6}{10}R_3$: $0$. REF rows $\{(1,1,3),(0,1,-8),(0,0,-10)\}$ — basis of $\RS(A) = \R^3$. All three columns are pivot columns: $\CS(A) = \spn\{(4,1,4,1)^T,(4,1,5,2)^T,(2,3,4,1)^T\}$, a 3-dim subspace of $\R^4$. $\Rank = 3$, $\Nullity = 0$.</p>
</details></div>
<div class="box exam" data-t="Q2 · Elementary matrices reaching the RREF">
<p>(i) $A = \begin{pmatrix}0&1&1&0\\1&4&1&1\\4&3&2&1\end{pmatrix}$ (ii) $A = \begin{pmatrix}1&4&3\\2&5&4\\3&6&4\\4&7&4\end{pmatrix}$</p>
<details class="reveal sol"><summary>Full solution</summary>
<p><b>(i)</b> One valid sequence (each $E_k$ = that operation applied to $I_3$):</p>
<ol><li>$E_1$: $R_1\leftrightarrow R_2$</li><li>$E_2$: $R_3\to R_3-4R_1$ → row 3 $= (0,-13,-2,-3)$</li><li>$E_3$: $R_3\to R_3+13R_2$ → $(0,0,11,-3)$</li><li>$E_4$: $R_3\to\frac1{11}R_3$ → $(0,0,1,-\frac3{11})$</li><li>$E_5$: $R_2\to R_2-R_3$ → $(0,1,0,\frac3{11})$</li><li>$E_6$: $R_1\to R_1-R_3$ → $(1,4,0,\frac{14}{11})$</li><li>$E_7$: $R_1\to R_1-4R_2$ → $(1,0,0,\frac2{11})$</li></ol>
$$E_7\cdots E_1A = \begin{pmatrix}1&0&0&\frac{2}{11}\\0&1&0&\frac{3}{11}\\0&0&1&-\frac{3}{11}\end{pmatrix},\qquad\Rank = 3,\;\Nullity = 4-3 = 1.$$
<p><b>(ii)</b> ($4\times4$ elementary matrices) $R_2\to R_2-2R_1$, $R_3\to R_3-3R_1$, $R_4\to R_4-4R_1$, $R_3\to R_3-2R_2$, $R_4\to R_4-3R_2$, $R_4\to R_4-2R_3$, $R_2\to-\frac13R_2$, $R_3\to-R_3$, $R_2\to R_2-\frac23R_3$, $R_1\to R_1-3R_3$, $R_1\to R_1-4R_2$:
$$E_{11}\cdots E_1A = \begin{pmatrix}1&0&0\\0&1&0\\0&0&1\\0&0&0\end{pmatrix},\qquad\Rank = 3,\;\Nullity = 3-3 = 0.$$
<span class="muted">Any correct sequence earns full marks; the RREF itself is unique.</span></p>
</details></div>`,
    summary: H`<div class="card glow"><div class="kicker">Chapter 5 on one page</div><div class="tbl-wrap"><table class="tbl">
<tr><th>Idea</th><th>Key fact</th></tr>
<tr><td>Row operations</td><td>swap, scale ($c\ne0$), add a multiple; = left-multiplication by elementary matrices</td></tr>
<tr><td>Equivalent systems</td><td>same solution set</td></tr>
<tr><td>REF / RREF</td><td>staircase pivots / pivots 1 and alone in their columns; RREF unique</td></tr>
<tr><td>Rank</td><td># non-zero rows of REF $=\dim\RS = \dim\CS$</td></tr>
<tr><td>Null space</td><td>solutions of $Ax = 0$; $\Nullity = n-\Rank$</td></tr>
<tr><td>Bases</td><td>RS: non-zero REF rows; CS: pivot columns of original $A$</td></tr>
<tr><td>Inverse</td><td>$[A|I]\to[I|A^{-1}]$</td></tr>
<tr><td>Solutions of $Ax = b$</td><td>none if $\Rank A\lt\Rank[A|b]$; unique if $\Rank A = n$; else infinite</td></tr></table></div></div>`,
  });
})();
