/* Syllabus gap-fills added after the curriculum audit (official outline: "The concepts of rank and equivalence are introduced").
   §5.3 Rank and equivalence (column operations, equivalent matrices, normal form). All numbers CAS-verified. */
(function () {
  const H = String.raw;
  const ch5 = LA.chapters.ch5;
  ch5.sections.push({ id: "5.3", title: "Rank and equivalence (column operations & normal form)", html: H`
<div class="box note" data-t="Why this section was added" data-level="f">
<p>The official course outline says <i>"the concepts of rank and equivalence are introduced"</i>, and the introduction to your Chapter 5 notes mentions "elementary row <b>and column</b> transformations", but the notes only develop row operations. This section fills that gap with the standard theory. Your notes use "equivalent" (Definition 5.1.5) for <b>row</b>-equivalent; below, <b>equivalent</b> allows row <i>and</i> column operations — check which meaning your lecturer uses in a question.</p></div>
<div class="box def" data-t="5.3.1 · Elementary column operations">
<p>(i) $C_i\leftrightarrow C_j$; (ii) $C_i\to cC_i$ with $c\neq0$; (iii) $C_i\to C_i+cC_j$. Performing a column operation on $A$ is the same as multiplying <b>on the right</b> by the corresponding elementary matrix: $A\mapsto AE$ (compare Remark 5.1.9(iii), where row operations multiply on the left).</p>
</div>
<div class="box def" data-t="5.3.2 · Equivalent matrices">
<p>Two $m\times n$ matrices are <b>equivalent</b>, $A\sim B$, if $B$ can be obtained from $A$ by a finite sequence of elementary row and column operations. Equivalently, $B = PAQ$ for some invertible $P$ ($m\times m$) and invertible $Q$ ($n\times n$) — $P$ collects the row operations and $Q$ the column operations.</p>
</div>
<div class="box intuition" data-t="What equivalence keeps and what it forgets">
<p>Row operations change the basis of the <i>codomain</i>, column operations change the basis of the <i>domain</i> of the map $x\mapsto Ax$. Allowing both, you can simplify a matrix so much that only <b>one number</b> survives: its rank. Contrast <b>similarity</b> ($P^{-1}AP$, same basis change on both sides), which preserves far more (eigenvalues, trace, determinant).</p>
</div>
<div class="box thm" data-t="5.3.3 · Normal form theorem ★">
<p>Every $m\times n$ matrix $A$ of rank $r$ is equivalent to the <b>normal form</b>
$$N_r = \begin{pmatrix}I_r&0\\0&0\end{pmatrix}\qquad(m\times n).$$</p>
</div>
<div class="box proof" data-t="of Theorem 5.3.3">
<p>Row-reduce $A$ to its RREF $R$; it has $r$ pivots, each a $1$ that is the only non-zero entry of its column. Swap columns ($C_i\leftrightarrow C_j$) to move the pivot columns to positions $1,\dots,r$: the matrix becomes $\begin{pmatrix}I_r&F\\0&0\end{pmatrix}$. Finally clear each entry $f_{ij}$ of $F$ with the column operation $C_{r+j}\to C_{r+j}-f_{ij}C_i$ (this does not disturb $I_r$). The result is $N_r$.</p>
</div>
<div class="box thm" data-t="5.3.4 · Rank is the complete invariant of equivalence">
<p>(i) Elementary row and column operations do not change the rank. (ii) Two $m\times n$ matrices are equivalent if and only if they have the same rank. (iii) In particular $\Rank(A^T) = \Rank(A)$ and $\Rank(PAQ) = \Rank(A)$ for invertible $P,Q$.</p>
</div>
<div class="box proof" data-t="of Theorem 5.3.4">
<p><b>(i)</b> Row operations preserve the row space (Remark 5.2.4), so they preserve $\dim\RS = \Rank$. Column operations preserve the column space (each new column is a combination of old columns, and the operation is reversible), so they preserve $\dim\CS$, which equals the rank (Remark 5.2.4(iii)).</p>
<p><b>(ii)</b> (⇒) by (i). (⇐) If $\Rank A = \Rank B = r$ then $A\sim N_r$ and $B\sim N_r$ (Theorem 5.3.3); equivalence is reflexive, symmetric and transitive (undo operations in reverse; concatenate sequences), so $A\sim B$.</p>
<p><b>(iii)</b> $A = P_0^{-1}N_rQ_0^{-1}$ gives $A^T = (Q_0^{-1})^TN_r^T(P_0^{-1})^T$, and $N_r^T$ (the $n\times m$ normal form) has rank $r$. Multiplying by invertible matrices is a sequence of elementary operations.</p>
</div>
<div class="box ex" data-t="5.3.5 · Reducing to normal form">
<p>$A = \begin{pmatrix}1&2&1\\2&4&3\\3&6&4\end{pmatrix}$ has rank 2.</p>
$$A\xrightarrow[R_3\to R_3-3R_1]{R_2\to R_2-2R_1}\begin{pmatrix}1&2&1\\0&0&1\\0&0&1\end{pmatrix}\xrightarrow[R_1\to R_1-R_2]{R_3\to R_3-R_2}\begin{pmatrix}1&2&0\\0&0&1\\0&0&0\end{pmatrix}\xrightarrow{C_2\to C_2-2C_1}\begin{pmatrix}1&0&0\\0&0&1\\0&0&0\end{pmatrix}\xrightarrow{C_2\leftrightarrow C_3}\begin{pmatrix}1&0&0\\0&1&0\\0&0&0\end{pmatrix} = N_2.$$
</div>
<div class="box recipe" data-t="Are A and B equivalent?">
<ol class="recipe-steps"><li>Check they have the same size (otherwise: no).</li><li>Compute both ranks (row-reduce each).</li><li>Same rank ⇒ equivalent (Theorem 5.3.4); different ⇒ not. To exhibit $P,Q$, reduce both to $N_r$ and compose.</li></ol>
</div>
<div class="box cor" data-t="5.3.6 · Invertibility via equivalence">
<p>An $n\times n$ matrix $A$ is invertible $\iff A\sim I_n\iff\Rank A = n\iff A$ is a product of elementary matrices.</p>
</div>
<div class="box trap" data-t="Equivalent ≠ similar ≠ row-equivalent">
<ul><li>$\begin{pmatrix}1&0\\0&2\end{pmatrix}$ and $I_2$ are <b>equivalent</b> (both rank 2) but <b>not similar</b> (different eigenvalues).</li>
<li>Column operations can change the solution set of $Ax = b$ (they mix the unknowns) — only <b>row</b> operations are allowed when solving systems.</li></ul>
</div>` });

  ch5.exercises += H`
<h2>Extra exercises · §5.3 Rank and equivalence</h2>
<div class="box exam" data-t="E5.3.1 · Normal form">
<p>Find the normal form of $A = \begin{pmatrix}1&-1&2\\2&-2&4\end{pmatrix}$.</p>
<details class="reveal sol"><summary>Full solution</summary><p>$R_2\to R_2-2R_1$ gives $\begin{pmatrix}1&-1&2\\0&0&0\end{pmatrix}$ (rank 1). Then $C_2\to C_2+C_1$ and $C_3\to C_3-2C_1$ give $N_1 = \begin{pmatrix}1&0&0\\0&0&0\end{pmatrix}$.</p></details></div>
<div class="box exam" data-t="E5.3.2 · Equivalent or not?">
<p>Are $A = \begin{pmatrix}1&2\\3&4\end{pmatrix}$ and $B = \begin{pmatrix}0&5\\-7&1\end{pmatrix}$ equivalent? Are they similar?</p>
<details class="reveal sol"><summary>Full solution</summary><p>$\det A = -2\neq0$ and $\det B = 35\neq0$, so both have rank 2: they <b>are equivalent</b> (both $\sim I_2$). They are <b>not similar</b>: similar matrices have equal determinants ($\det(P^{-1}AP) = \det A$), but $-2\neq35$.</p></details></div>
<div class="box exam" data-t="E5.3.3 · Proof: rank(Aᵀ) = rank(A)">
<details class="reveal sol"><summary>Full solution</summary><p>By Theorem 5.3.3, $A = PN_rQ$ with $P,Q$ invertible (inverses of the operation matrices), $r = \Rank A$. Then $A^T = Q^TN_r^TP^T$ with $Q^T,P^T$ invertible, so $A^T\sim N_r^T$. $N_r^T$ is the $n\times m$ matrix with $I_r$ in the corner, of rank $r$. By Theorem 5.3.4(i), $\Rank A^T = r$. $\square$</p></details></div>`;

  ch5.summary = ch5.summary.replace("</table></div></div>", '<tr><td>Equivalence</td><td>$A\\sim B\\iff B = PAQ\\iff$ same size and same rank; normal form $N_r$</td></tr></table></div></div>');
  ch5.blurb += " Includes the syllabus topic \"rank and equivalence\" (column operations and the normal form).";
})();
