/* Reference pages: formula sheet, glossary/notation, past papers, beyond, errata, about, 404 */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const H = String.raw;

  /* ---------------- Formula & theorem sheet ---------------- */
  const SHEET = H`
<div class="formula-grid">
<div class="box thm" data-tag="Ch 3" data-t="Linearity"><p>$T(\alpha u+\beta v) = \alpha T(u)+\beta T(v)$; &nbsp;$T(0) = 0$; &nbsp;$T(\sum a_iv_i) = \sum a_iT(v_i)$.</p></div>
<div class="box thm" data-tag="Ch 3" data-t="Kernel, range, Rank–Nullity"><p>$\ker T = \{v: T(v) = 0\}\le V$, $\;\Ran T = \spn\{T(v_1),\dots,T(v_n)\}\le W$.<br>$\Rank T+\Nullity T = \dim V$.<br>Injective $\iff\ker T = \{0\}$; surjective $\iff\Rank T = \dim W$.</p></div>
<div class="box thm" data-tag="Ch 3" data-t="Dimension constraints"><p>$\dim V\gt\dim W\Rightarrow$ not injective; $\dim V\lt\dim W\Rightarrow$ not surjective; $\dim V=\dim W\Rightarrow$ (inj ⇔ surj ⇔ bij).<br>$\dim\Lin(V,W) = \dim V\cdot\dim W$; $\;V\cong\FF^{\dim V}$.</p></div>
<div class="box thm" data-tag="Ch 3" data-t="Matrix of a linear map"><p>$[T]^{\Cc}_{\B} = \big([T(v_1)]_{\Cc}\cdots[T(v_n)]_{\Cc}\big)$ ($\dim W\times\dim V$).<br>$[T(v)]_{\Cc} = [T]^{\Cc}_{\B}[v]_{\B}$; $\;[S\circ T]^{\mathcal D}_{\B} = [S]^{\mathcal D}_{\Cc}[T]^{\Cc}_{\B}$.<br>Shortcut: $(C\,|\,T(v_1)\cdots T(v_n))\xrightarrow{\text{RREF}}(I\,|\,[T]^{\Cc}_{\B})$.</p></div>
<div class="box thm" data-tag="Ch 3" data-t="Similarity & inverses"><p>$B = P^{-1}AP$ (equivalence relation; same char. poly). Bijective linear $T$ ⇒ $T^{-1}$ linear. $(S\circ T)^{-1} = T^{-1}\circ S^{-1}$.</p></div>
<div class="box thm" data-tag="Ch 4" data-t="Inner product axioms"><p>$\langle u,u\rangle\ge0$; $\;\langle u,u\rangle = 0\iff u = 0$; $\;\langle u,v\rangle = \langle v,u\rangle$; $\;\langle au+bv,w\rangle = a\langle u,w\rangle+b\langle v,w\rangle$.</p></div>
<div class="box thm" data-tag="Ch 4" data-t="Norm, distance, angle"><p>$\lVert u\rVert = \sqrt{\langle u,u\rangle}$, $\hat u = \frac{u}{\lVert u\rVert}$, $d(u,v) = \lVert u-v\rVert$, $\cos\theta = \frac{\langle u,v\rangle}{\lVert u\rVert\lVert v\rVert}$.<br>$\lVert u\pm v\rVert^2 = \lVert u\rVert^2\pm2\langle u,v\rangle+\lVert v\rVert^2$; $\;\lVert\alpha u\rVert = |\alpha|\lVert u\rVert$.</p></div>
<div class="box thm" data-tag="Ch 4" data-t="The three inequalities/identities"><p>Pythagoras: $u\perp v\Rightarrow\lVert u+v\rVert^2 = \lVert u\rVert^2+\lVert v\rVert^2$.<br>Cauchy–Schwarz: $|\langle u,v\rangle|\le\lVert u\rVert\lVert v\rVert$ (= iff dependent).<br>Triangle: $\lVert u+v\rVert\le\lVert u\rVert+\lVert v\rVert$.</p></div>
<div class="box thm" data-tag="Ch 4" data-t="Orthogonal complements"><p>$S^\perp = \{u: \langle u,s\rangle = 0\;\forall s\in S\}$, always a subspace. $V^\perp = \{0\}$, $\{0\}^\perp = V$, $S\subseteq S^{\perp\perp}$, $S\cap S^\perp = \{0\}$ (subspace $S$), $S\subseteq W\Rightarrow W^\perp\subseteq S^\perp$. In $\R^n$: $\dim S+\dim S^\perp = n$.</p></div>
<div class="box thm" data-tag="Ch 4" data-t="Gram–Schmidt"><p>$u_1 = v_1$, $\;u_k = v_k-\sum_{j\lt k}\frac{\langle v_k,u_j\rangle}{\langle u_j,u_j\rangle}u_j$, $\;w_k = \frac{u_k}{\lVert u_k\rVert}$.<br>Orthonormal basis ⇒ $v = \sum\langle v,w_i\rangle w_i$, $\lVert v\rVert^2 = \sum\langle v,w_i\rangle^2$, $\mathrm{proj}_S v = \sum\langle v,w_i\rangle w_i$.</p></div>
<div class="box thm" data-tag="Ch 2" data-t="Vector space toolkit"><p>Subspace: $0\in W$, $au+bv\in W$. $\dim\R^n = n$, $\dim\P_n = n+1$, $\dim\R^{m\times n} = mn$. $\dim(U+W) = \dim U+\dim W-\dim(U\cap W)$. $V = U\oplus W\iff U+W = V,\ U\cap W = \{0\}$.</p></div>
<div class="box thm" data-tag="Ch 5" data-t="Systems & rank"><p>Rank = # pivots $=\dim\RS = \dim\CS$; $\Nullity(A) = n-\Rank A$. $Ax = b$: none if $\Rank A\lt\Rank[A|b]$; unique if $\Rank A = n$; else infinitely many. $[A|I]\to[I|A^{-1}]$.</p></div>
<div class="box thm" data-tag="Ch 5 · §5.3" data-t="Rank & equivalence"><p>Column operation = right-multiplication $A\mapsto AE$. $A\sim B\iff B = PAQ$ ($P,Q$ invertible) $\iff$ same size and same rank. Normal form $N_r = \begin{pmatrix}I_r&0\\0&0\end{pmatrix}$. $\Rank A^T = \Rank A$.</p></div>
<div class="box thm" data-tag="Ch 6" data-t="Determinants"><p>$\begin{vmatrix}a&b\\c&d\end{vmatrix} = ad-bc$. Swap: $-$; scale row by $c$: $\times c$; add multiple: same. Triangular: product of diagonal. $\det A^T = \det A$, $\det AB = \det A\det B$, $\det A^{-1} = \frac1{\det A}$, $\det(cA) = c^n\det A$. $\sign\sigma = (-1)^{n-k}$.</p></div>
<div class="box thm" data-tag="Ch 7" data-t="Eigen-theory"><p>$\det(A-\lambda I) = 0$; eigenspace $\Null(A-\lambda I)$. $2\times2$: $\lambda^2-\operatorname{tr}A\,\lambda+\det A$. $\sum\lambda = \operatorname{tr}A$, $\prod\lambda = \det A$. Diagonalizable ⇔ geo = alg mult. for all $\lambda$. $P^{-1}AP = D$ with eigenvector columns. Cayley–Hamilton $p_A(A) = 0$.</p></div>
<div class="box thm" data-tag="Ch 8" data-t="Quadratic forms & the Spectral Theorem"><p>$Q(x) = x^TAx$, $A = A^T$; a cross term $c\,x_ix_j$ gives $a_{ij} = a_{ji} = \frac c2$. Orthogonal: $P^TP = I$. Symmetric $A$ ⇒ real eigenvalues, orthogonal eigenvectors, $A = PDP^T$. Principal axes: $x = Py\Rightarrow Q = \lambda_1y_1^2+\dots+\lambda_ny_n^2$.</p></div>
<div class="box thm" data-tag="Ch 8" data-t="Definiteness tests"><p>PD ⇔ all $\lambda_i>0$ ⇔ all leading minors $\Delta_k>0$ (Sylvester). ND ⇔ all $\lambda_i<0$ ⇔ $(-1)^k\Delta_k>0$. Indefinite ⇔ eigenvalues of both signs; $2\times2$: $\det A<0$ ⇒ indefinite. Semidefinite: use eigenvalues (not leading minors). $\lambda_{\min}\le x^TAx\le\lambda_{\max}$ for $\lVert x\rVert = 1$. Hessian PD/ND/indefinite ⇒ min/max/saddle.</p></div>
<div class="box thm" data-tag="Ch 1" data-t="Sets & functions"><p>$(A\cup B)^c = A^c\cap B^c$; $A\cup(B\cap C) = (A\cup B)\cap(A\cup C)$. Equivalence: reflexive, symmetric, transitive. Injective: $f(x_1) = f(x_2)\Rightarrow x_1 = x_2$. $(g\circ f)^{-1} = f^{-1}\circ g^{-1}$.</p></div>
<div class="box beyond" data-t="Invertible Matrix Theorem (n×n) — all equivalent"><p>$A$ invertible ⇔ $\det A\ne0$ ⇔ $\Rank A = n$ ⇔ $\Nullity A = 0$ ⇔ RREF $= I$ ⇔ columns (rows) independent ⇔ columns span $\R^n$ ⇔ $Ax = 0$ only trivially ⇔ $Ax = b$ uniquely solvable ⇔ $0$ not an eigenvalue ⇔ $x\mapsto Ax$ is an isomorphism ⇔ $A$ is a product of elementary matrices.</p></div>
</div>`;

  LA.page("/formulas", {
    title: "Formula & Theorem Sheet", searchTitle: "Formula & Theorem Sheet", searchDesc: "Every key formula and theorem on one printable page",
    render() { return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Reference</div><h1>Formula & Theorem Sheet</h1><p class="lead">Everything you must know, on one page. Print it (or save as PDF) and read it the night before.</p><div class="row no-print"><button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save PDF</button><a class="btn" href="#/glossary">Glossary & notation</a></div></div></div><div style="margin-top:18px">' + SHEET + "</div></div>"; },
  });

  /* ---------------- Glossary & notation ---------------- */
  const NOTATION = [
    ["$\\forall$, $\\exists$", "for all, there exists"], ["$\\in$, $\\notin$", "is / is not an element of"], ["$\\subseteq$, $\\subset$", "subset, proper subset"], ["$\\emptyset$", "empty set"], ["$A\\setminus B$, $A^c$", "difference, complement"], ["$A\\times B$", "Cartesian product"],
    ["$\\FF$", "a field (usually $\\R$ or $\\C$)"], ["$\\P_n$", "polynomials of degree $\\le n$"], ["$\\R^{m\\times n}$", "$m\\times n$ real matrices"], ["$\\spn(S)$", "all linear combinations of $S$"], ["$[v]_{\\B}$", "coordinate vector of $v$ in basis $\\B$"], ["$U\\oplus W$", "direct sum"],
    ["$\\Lin(V,W)$, $\\Lin(V)$", "linear maps $V\\to W$; operators on $V$"], ["$\\ker T$, $\\Null(T)$", "kernel / null space"], ["$\\Ran T$, $T(V)$", "range / image"], ["$\\Rank$, $\\Nullity$", "dimension of range / kernel"], ["$[T]^{\\Cc}_{\\B}$", "matrix of $T$ from basis $\\B$ to basis $\\Cc$"], ["$V\\cong W$", "$V$ is isomorphic to $W$"],
    ["$\\langle u,v\\rangle$", "inner product of $u$ and $v$"], ["$\\lVert u\\rVert$", "norm (length) of $u$"], ["$\\hat u$", "unit vector in the direction of $u$"], ["$u\\perp v$", "$u$ orthogonal to $v$"], ["$S^\\perp$", "orthogonal complement of $S$"], ["$\\delta_{ij}$", "Kronecker delta: 1 if $i=j$, else 0"],
    ["$\\RS(A)$, $\\CS(A)$", "row space, column space"], ["$E_{ij}$", "matrix with 1 in position $(i,j)$, 0 elsewhere"], ["$S_n$, $\\sign\\sigma$", "permutations of $\\{1..n\\}$, their sign"], ["$|A|$, $\\det A$", "determinant"], ["$p_A(\\lambda)$", "characteristic polynomial $\\det(A-\\lambda I)$"], ["$\\sigma(A)$", "spectrum (eigenvalues with repetition)"],
    ["$x^TAx$", "quadratic form with symmetric matrix $A$"], ["$A\\sim B$", "equivalent matrices ($B = PAQ$); in Ch 5 of the notes, row-equivalent"], ["$\\Delta_k$", "$k$-th leading principal minor"], ["$P^TP = I$", "$P$ is an orthogonal matrix"],
  ];
  const GLOSS = [
    ["Basis", "A linearly independent spanning set.", 2], ["Coincidence (axiom)", "$\\langle u,u\\rangle = 0$ only for $u = 0$.", 4], ["Coordinate vector", "The (unique) coefficients of a vector in a basis, as a column.", 2], ["Diagonalizable", "Similar to a diagonal matrix; has a basis of eigenvectors.", 7], ["Dimension", "Number of vectors in any basis.", 2], ["Eigenspace", "$\\Null(A-\\lambda I)$.", 7], ["Equivalence relation", "Reflexive, symmetric and transitive relation.", 1], ["Gram–Schmidt", "Algorithm turning an independent set into an orthonormal one with the same span.", 4], ["Injective (one-to-one)", "Different inputs give different outputs.", 1], ["Inner product space", "A real vector space with an inner product.", 4], ["Isomorphism", "Bijective linear map.", 3], ["Kernel", "Vectors mapped to $0$.", 3], ["Linear combination", "$a_1u_1+\\dots+a_nu_n$.", 2], ["Linear transformation", "Map preserving addition and scalar multiplication.", 3], ["Linearly independent", "Only the trivial combination gives $0$.", 2], ["Non-singular (map)", "Kernel is $\\{0\\}$.", 3], ["Norm", "$\\sqrt{\\langle u,u\\rangle}$ — length.", 4], ["Nullity", "Dimension of the kernel / null space.", 3], ["Orthogonal complement", "All vectors orthogonal to every vector of $S$.", 4], ["Orthonormal", "Mutually orthogonal unit vectors.", 4], ["Range", "Set of all outputs $T(v)$.", 3], ["Rank", "Dimension of the range (or # pivots).", 3], ["RREF", "Reduced row echelon form.", 5], ["Similar matrices", "$B = P^{-1}AP$.", 3], ["Singular (map)", "Some non-zero vector maps to $0$.", 3], ["Span", "Set of all linear combinations.", 2], ["Subspace", "Subset that is a vector space under the same operations.", 2], ["Surjective (onto)", "Every element of the codomain is hit.", 1], ["Unit vector", "Vector of norm 1.", 4],
  ];
  GLOSS.push(
    ["Quadratic form", "$Q(x) = x^TAx$ with $A$ symmetric — a homogeneous polynomial of degree 2.", 8],
    ["Orthogonal matrix", "$P^TP = I$: the columns are orthonormal and $P^{-1} = P^T$.", 8],
    ["Orthogonally diagonalizable", "$A = PDP^T$ with $P$ orthogonal and $D$ diagonal — exactly the real symmetric matrices (Spectral Theorem).", 8],
    ["Positive definite", "$x^TAx\\gt0$ for every $x\\neq0$; equivalently all eigenvalues are positive.", 8],
    ["Positive semidefinite", "$x^TAx\\ge0$ for every $x$; equivalently all eigenvalues are $\\ge0$.", 8],
    ["Indefinite", "The quadratic form takes both positive and negative values.", 8],
    ["Leading principal minor", "$\\Delta_k$ = determinant of the top-left $k\\times k$ submatrix.", 8],
    ["Principal axes", "Orthonormal eigenvector directions in which a quadratic form has no cross terms.", 8],
    ["Hessian", "The symmetric matrix of second partial derivatives; its definiteness classifies critical points.", 8],
    ["Equivalent matrices", "$B = PAQ$ with $P,Q$ invertible (row and column operations); same size and same rank.", 5],
    ["Normal form", "$N_r$: the $m\\times n$ matrix with $I_r$ in the top-left corner and zeros elsewhere.", 5]
  );
  GLOSS.sort((a, b) => a[0].localeCompare(b[0]));
  LA.NOTATION = NOTATION; LA.GLOSS = GLOSS;
  LA.page("/glossary", {
    title: "Glossary & Notation", searchTitle: "Glossary & Notation", searchDesc: "Every symbol decoded; every term defined",
    render() {
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Reference</div><h1>Glossary & Notation Decoder</h1><p class="lead">If a symbol slows you down, look it up here. Being able to <b>read</b> notation fluently is half of understanding a proof.</p></div></div>' +
        LA.sectionTitle("Notation") + '<div class="tbl-wrap"><table class="tbl"><tr><th>Symbol</th><th>Meaning</th></tr>' + NOTATION.map((n) => "<tr><td>" + n[0] + "</td><td>" + n[1] + "</td></tr>").join("") + "</table></div>" +
        LA.sectionTitle("Glossary") + '<div class="tbl-wrap"><table class="tbl"><tr><th>Term</th><th>Meaning</th><th>Chapter</th></tr>' + GLOSS.map((g) => "<tr><td><b>" + g[0] + "</b></td><td>" + g[1] + '</td><td><a href="#/ch/' + g[2] + '">Ch ' + g[2] + "</a></td></tr>").join("") + "</table></div></div>";
    },
  });
  GLOSS.forEach((g) => LA.searchExtra.push({ t: "Glossary · " + g[0], m: g[1].replace(/\$/g, ""), href: "#/glossary", k: "gloss" }));

  /* ---------------- Past papers ---------------- */
  LA.page("/pastpapers/classic", {
    title: "Past Papers (classic)", searchTitle: "Past Papers (classic log)", searchDesc: "Official UWI archive, how to use past papers, your past-paper log",
    render() {
      const log = LA.store.get("ppLog", []);
      const tags = {}; log.forEach((e) => (e.tags || []).forEach((t) => { tags[t] = (tags[t] || 0) + 1; }));
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Exam archive</div><h1>Past Papers</h1><p class="lead">Official MATH 2273 past papers are held by The Alma Jordan Library (UWI St. Augustine). Use them alongside the practice material here.</p></div></div>' +
        '<div class="grid grid-2" style="margin-top:18px"><div class="card glow"><div class="kicker">Step 1 · Get the official papers</div><ol>' +
        '<li>Open <a href="https://libraries.sta.uwi.edu/apps/pastpapers" target="_blank" rel="noopener">libraries.sta.uwi.edu/apps/pastpapers ↗</a> (also linked from the Alma Jordan Library site under <i>Research → Past Exam Papers</i>).</li>' +
        "<li>Read and accept the library's <b>Appropriate Use Policy</b> (papers are copyright of The UWI — personal, non-commercial study only).</li>" +
        "<li>Search <code>MATH2273</code> or <code>MATH 2273</code>. To target a sitting use <code>course code|semester|year</code>, e.g. <code>MATH 2273|1|2023</code>.</li>" +
        "<li>Download the papers to your device (log in with your UWI credentials if prompted, e.g. off-campus).</li></ol>" +
        '<p class="small muted">This site deliberately does not re-publish the official papers. Log the questions below for your own study instead.</p></div>' +
        '<div class="card"><div class="kicker">Step 2 · Use them like a pro</div><ol><li><b>Sort by topic first</b> — do every Chapter 3 & 4 question across all years before anything else.</li><li><b>Attempt cold</b>, timed, on paper. Then check against the matching <a href="#/recipes">recipe</a> and the chapter solutions.</li><li><b>Log</b> every question you couldn\'t finish (below) and redo it 2 days later.</li><li><b>Spot patterns</b>: the topic counter below shows which skills keep appearing.</li><li>Finish with a full <a href="#/mock">mock test</a> under exam conditions.</li></ol></div></div>' +
        LA.sectionTitle("My past-paper log") +
        '<div class="card"><div class="grid grid-2"><label class="field">Paper (e.g. 2022/23 Sem 1, Coursework 1)<input type="text" id="ppPaper"></label><label class="field">Question (e.g. Q2(b))<input type="text" id="ppQ"></label></div>' +
        '<label class="field" style="margin-top:10px">Question text — you can type maths with $...$, e.g. $T(x,y) = (x+y, x-y)$<textarea id="ppText" placeholder="Paste or type the question here"></textarea></label>' +
        '<label class="field" style="margin-top:10px">My notes / solution outline<textarea id="ppNotes" placeholder="Key steps, mistakes to avoid…"></textarea></label>' +
        '<div class="row" style="margin-top:10px"><span class="small muted">Topics:</span>' + ["Linearity", "Basis images", "Kernel/Range", "Rank–Nullity", "Isomorphism", "Matrix of T", "Inner product", "Norm/Angle", "S⊥", "C–S/Triangle", "Gram–Schmidt", "Proof"].map((t) => '<label class="toggle"><input type="checkbox" class="ppTag" value="' + t + '"> ' + t + "</label>").join("") + '</div><div class="row" style="margin-top:10px"><label class="toggle"><input type="checkbox" id="ppDone"> Solved confidently</label><button class="btn btn-primary" id="ppAdd">➕ Add to log</button></div></div>' +
        (Object.keys(tags).length ? '<div class="card" style="margin-top:14px"><div class="kicker">Topic frequency in your log</div><div class="row" style="margin-top:8px">' + Object.entries(tags).sort((a, b) => b[1] - a[1]).map((t) => '<span class="chip violet">' + t[0] + " × " + t[1] + "</span>").join("") + "</div></div>" : "") +
        '<div id="ppList">' + (log.length ? log.slice().reverse().map((e, k) => { const idx = log.length - 1 - k; return '<div class="box ' + (e.done ? "ex" : "trap") + '" data-tag="' + (e.done ? "Solved" : "Needs review") + '" data-t="' + esc(e.paper || "Paper") + " · " + esc(e.q || "") + '"><div>' + esc(e.text).replace(/\n/g, "<br>") + "</div>" + (e.notes ? '<p class="small muted" style="margin-top:8px"><b>Notes:</b> ' + esc(e.notes).replace(/\n/g, "<br>") + "</p>" : "") + '<div class="row">' + (e.tags || []).map((t) => '<span class="chip">' + t + "</span>").join("") + '<button class="btn btn-sm btn-ghost" data-tog="' + idx + '">' + (e.done ? "Mark for review" : "Mark solved") + '</button><button class="btn btn-sm btn-ghost" data-del="' + idx + '">Delete</button></div></div>'; }).join("") : '<p class="muted">Your log is empty. Add the first question you practise from a past paper.</p>') + "</div>" +
        '<div class="box tip" data-t="No papers yet? Start here">These follow the same style and topics: <a href="#/mock">3 mock tests</a>, the extra exam-style questions in <a href="#/ch/3?tab=exercises">Chapter 3</a> and <a href="#/ch/4?tab=exercises">Chapter 4</a>, and the infinite <a href="#/practice">Practice Arena</a>.</div></div>';
    },
    after(view) {
      $("#ppAdd", view).onclick = () => {
        const text = $("#ppText", view).value.trim(); if (!text) { LA.toast("Add the question text first", ""); return; }
        const log = LA.store.get("ppLog", []);
        log.push({ paper: $("#ppPaper", view).value.trim(), q: $("#ppQ", view).value.trim(), text, notes: $("#ppNotes", view).value.trim(), tags: $$(".ppTag:checked", view).map((c) => c.value), done: $("#ppDone", view).checked, at: Date.now() });
        LA.store.set("ppLog", log); LA.addXP(5, "Past-paper question logged"); LA.route();
      };
      $$("[data-del]", view).forEach((b) => b.onclick = () => { const log = LA.store.get("ppLog", []); log.splice(Number(b.dataset.del), 1); LA.store.set("ppLog", log); LA.route(); });
      $$("[data-tog]", view).forEach((b) => b.onclick = () => { const log = LA.store.get("ppLog", []); const e = log[Number(b.dataset.tog)]; e.done = !e.done; LA.store.set("ppLog", log); LA.route(); });
    },
  });

  /* ---------------- Beyond the notes ---------------- */
  LA.page("/beyond", {
    title: "Beyond the Notes", searchTitle: "Beyond the Notes", searchDesc: "Big-picture connections, applications, study science, further references",
    render() {
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Level up</div><h1>Beyond the Notes</h1><p class="lead">Ideas that tie the whole course together. They make the core material easier to remember and give you an edge in proofs.</p></div></div>' + H`
<div class="box beyond" data-t="1 · The big picture in one sentence">
<p>A matrix <b>is</b> a linear map once you choose bases (Ch 3); row reduction (Ch 5) computes its kernel and range; the determinant (Ch 6) tests whether it is invertible; eigenvectors (Ch 7) are the bases that make it diagonal; and inner products (Ch 4) add geometry — length, angle, perpendicularity.</p></div>
<div class="box beyond" data-t="2 · The four fundamental subspaces of A (m×n)">
<p>$\Null(A)\subseteq\R^n$ and $\RS(A)\subseteq\R^n$ are orthogonal complements: $\Null(A) = \RS(A)^\perp$ (each row dotted with $x$ gives an entry of $Ax$). Likewise $\Null(A^T) = \CS(A)^\perp$ in $\R^m$. Rank–Nullity is then just $\dim\RS(A)+\dim\RS(A)^\perp = n$. This is why "find $S^\perp$" = "find a null space".</p></div>
<div class="box beyond" data-t="3 · Orthogonal projection and least squares">
<p>The closest point of a subspace $S$ to $v$ is $\mathrm{proj}_Sv = \sum\langle v,w_i\rangle w_i$ (orthonormal $w_i$), and the error $v-\mathrm{proj}_Sv$ lies in $S^\perp$. When $Ax = b$ has no solution, the "best" $x$ solves $A^TA\,x = A^Tb$ — the method behind every line of best fit.</p></div>
<div class="box beyond" data-t="4 · Orthogonal matrices and QR">
<p>Put an orthonormal basis as columns of $Q$: then $Q^TQ = I$, so $Q^{-1} = Q^T$ and $Q$ preserves lengths and angles (rotations/reflections). Gram–Schmidt on the columns of $A$ gives $A = QR$ with $R$ upper triangular.</p></div>
<div class="box beyond" data-t="5 · The spectral theorem (a preview)">
<p>A real <b>symmetric</b> matrix always has real eigenvalues and an <b>orthonormal</b> basis of eigenvectors: $A = QDQ^T$. Example: $\begin{pmatrix}3&1\\1&3\end{pmatrix}$ has eigenvectors $(1,1),(1,-1)$ — orthogonal, exactly as in the Chapter 3 mock question.</p></div>
<div class="box beyond" data-t="6 · Where this is used">
<ul><li><b>Computer graphics:</b> every rotation, scaling and projection on screen is a matrix.</li><li><b>Google PageRank:</b> an eigenvector of a giant link matrix.</li><li><b>Data science:</b> least squares, PCA (eigenvectors of a covariance matrix).</li><li><b>Signal processing:</b> Fourier series are coordinates in an orthonormal basis of functions.</li><li><b>Quantum mechanics:</b> states live in an inner product space; observables are symmetric (Hermitian) operators.</li></ul></div>
<div class="box tip" data-t="7 · How to study (the science)">
<ul><li><b>Active recall beats re-reading.</b> Close the notes and write the definition/proof from memory, then check — that is what the flashcards and proof puzzles train.</li><li><b>Spaced repetition.</b> Short reviews over several days beat one long session (the flashcard boxes do this for you).</li><li><b>Interleave.</b> Mix question types (Practice Arena "mixed" mode) so you learn to <i>recognise</i> which recipe to use — exactly the skill an exam tests.</li><li><b>Explain it.</b> If you can teach a proof to a friend in plain words, you own it.</li></ul></div>
<div class="box note" data-t="8 · References (optional deep-dives)">
<ul><li>Your course notes: <i>MATH 2273 Chapters 1–7</i> (V. Job) and the Gram–Schmidt handout — this site follows their numbering.</li><li>H. Anton &amp; C. Rorres, <i>Elementary Linear Algebra</i> — very close to this course's computational style.</li><li>S. Axler, <i>Linear Algebra Done Right</i> — proof-based, excellent for Chapters 2–4 and 7.</li><li>G. Strang, <i>Introduction to Linear Algebra</i> (and MIT OpenCourseWare 18.06).</li><li>3Blue1Brown, <i>Essence of Linear Algebra</i> (video series) — geometric intuition for Chapters 3, 6 and 7.</li></ul></div>` + "</div>";
    },
  });

  /* ---------------- Errata ---------------- */
  const ERR = [
    ["High", "Ch 3, Example 3.4.2(ii)", "$f(p) = p(0)\\frac{dp}{dx}+4xp$ is used as a linear map, but it is not additive: $f(1+x) = 1+4x+4x^2\\neq4x+4x^2 = f(1)+f(x)$. The column-by-column method shown is still correct practice.", "#/ch/3?go=sec-3-4"],
    ["High", "Ch 3, Exercise 3.3 Q1", "“dim V ≥ dim W ⇒ T onto” and “dim V ≤ dim W ⇒ T one-one” are false (zero map). True versions: T onto ⇒ dim V ≥ dim W; T one-one ⇒ dim V ≤ dim W. Proofs given.", "#/ch/3?tab=exercises"],
    ["High", "Ch 7, Theorem 7.3.3", "Stated as “diagonalizable iff n distinct eigenvalues”. Only “if” is true: $I_2$ is diagonalizable with a repeated eigenvalue. Correct criterion: geometric = algebraic multiplicity for every eigenvalue.", "#/ch/7?go=sec-7-3"],
    ["High", "Gram–Schmidt handout, Example 3", "Final $u_3$ has norm $\\frac13$. Correct: $u_3 = \\frac1{\\sqrt{15}}(-2,-1,-1,3)$.", "#/ch/4?go=sec-4-2-14"],
    ["High", "Gram–Schmidt handout, Example 4", "Norm computed as $\\sqrt{81+144+25}$ (should be $+625$); final vector $\\frac1{5\\sqrt{10}}(-9,-12,1)$ is not in the plane. Correct: $\\frac1{5\\sqrt{34}}(-9,-12,25)$.", "#/ch/4?go=sec-4-2-14"],
    ["Medium", "Ch 3, Example 3.2.10(iii)", "The $x$-coefficient of $T(p)$ should be $(a_1-2a_2)$, not $(2a_2+a_1)$. The conclusion ($\\ker T = \\{0\\}$) is unaffected.", "#/ch/3?go=sec-3-2"],
    ["Medium", "Ch 2, Theorem 2.4.4", "“If $S$ is independent, $S\\cup\\{v\\}$ is dependent iff $v\\in\\spn S$” needs $v\\notin S$: for $v\\in S$, $S\\cup\\{v\\} = S$ is independent although $v\\in\\spn S$. The proof on this site states the assumption.", "#/ch/2?go=sec-2-4"],
    ["Medium", "Ch 4, Theorem 4.2.11", "Needs the vectors to be non-zero: $\\{(1,0),(0,0)\\}$ is orthogonal but dependent.", "#/ch/4?go=sec-4-2"],
    ["Medium", "Ch 4, Theorem 4.2.8", "Equality in the triangle inequality holds iff one vector is a non-negative multiple of the other (not merely “dependent”).", "#/ch/4?go=sec-4-2"],
    ["Medium", "Ch 1, Exercise 1 Q4", "$(a,b)R(c,d)\\iff ad = bc$ is not transitive on all of $\\R^2$ because of $(0,0)$; it is an equivalence relation on $\\R^2\\setminus\\{(0,0)\\}$.", "#/ch/1?tab=exercises"],
    ["Low", "Ch 4, Theorem 4.2.12", "Should read $\\spn\\{v_1,\\dots,v_i\\} = \\spn\\{w_1,\\dots,w_i\\}$ for each $i$ (indices up to $i$, not $n$).", "#/ch/4?go=sec-4-2-14"],
    ["Low", "Ch 4, Remark 4.2.13", "Refers to “Theorem 4.2.8”; it means Theorem 4.2.12.", "#/ch/4?go=sec-4-2-14"],
    ["Low", "Ch 7, Example 7.3.8", "In $\\det(A-\\lambda I)$ the (2,1) entry should be $c$, not $b$.", "#/ch/7?go=sec-7-3"],
    ["Low", "Ch 7, Example 7.3.4(ii)", "Refers to “example 7.1.4(iii)”; it means Example 7.1.5(iii). Also, eigenspaces over $\\C$ should use a complex parameter.", "#/ch/7"],
    ["Low", "Ch 2, Example 2.5.4(i)", "“dim(U) + dim(V)” should be “dim(U) + dim(W)”.", "#/ch/2?go=sec-2-5"],
    ["Low", "Ch 3, Example 3.1.2", "The last example is labelled (iv) twice; it is the sixth example.", "#/ch/3"],
    ["Low", "Ch 3, Exercise 3.4 Q2", "The map is named $\\alpha$ but the formula is written with $T$.", "#/ch/3?tab=exercises"],
    ["Low", "Ch 3, Exercise 3.2 Q1(iv)", "“$4z$” is probably “$4w$”; either way the map is linear.", "#/ch/3?tab=exercises"],
    ["Low", "Gram–Schmidt handout, Props 3–4", "$(w\\cdot v_1)\\cdot v_1$ uses “·” for scalar multiplication; read it as $(w\\cdot v_1)\\,v_1$.", "#/ch/4?go=sec-4-2"],
  ];
  LA.page("/errata", {
    title: "Notes Corrections", searchTitle: "Notes Corrections (errata)", searchDesc: "Slips found in the lecture notes, with corrections",
    render() {
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Accuracy check</div><h1>Notes Corrections</h1><p class="lead">While building this site every example and exercise was re-computed with a computer algebra system. These are the slips found — knowing them protects you from copying an error into your answers. (All notes have typos; these don\'t diminish them!)</p></div></div>' +
        '<div class="tbl-wrap" style="margin-top:18px"><table class="tbl"><tr><th>Impact</th><th>Where</th><th>Correction</th></tr>' + ERR.map((e) => '<tr><td><span class="chip ' + (e[0] === "High" ? "red" : e[0] === "Medium" ? "amber" : "") + '">' + e[0] + '</span></td><td><a href="' + e[3] + '">' + e[1] + "</a></td><td>" + e[2] + "</td></tr>").join("") + "</table></div>" +
        '<div class="box tip" data-t="If a correction contradicts your lecturer">Follow your lecturer\'s instructions in class and on the test, but it is worth asking them about the items marked <b>High</b> — they change answers.</div></div>';
    },
  });

  /* ---------------- About & 404 ---------------- */
  LA.page("/about", {
    title: "About", searchTitle: "About this site", searchDesc: "How it was built, offline use, privacy, credits",
    render() {
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">About</div><h1>About this study hub</h1><p class="lead">A personal, interactive study companion for MATH 2273 Linear Algebra I, built from the course notes.</p></div></div><div class="card" style="margin-top:18px">' +
        "<h3>What's inside</h3><ul><li>Lessons for Chapters 1–7 following the notes' numbering, plus Chapter 8 (quadratic forms) and §5.3 (rank and equivalence) from the official course outline; intuition, tips, traps, proof templates, deep dives and three depth levels.</li><li>Complete model solutions to every exercise in the notes, plus extra exam-style questions (all verified with a computer algebra system).</li><li>The Topic Studio (Understand · Visualise · Prove · Practise · Exam), an adaptive Practice Arena with exact answer checking, the Proof Examiner, proof drills and a Counterexample Lab.</li><li>An Exam Centre with 2-hour final simulations and component-based marking, spaced-repetition flashcards, 14 labs, an encyclopedia with theorem pages and a concept map.</li><li>Your progress, notes and highlights stay in this browser; export them from the Progress page.</li></ul><p class=\"small muted\">Version 2.0 · see the CHANGELOG in the repository.</p>" +
        "<h3>Privacy</h3><p>No accounts, no tracking. Progress, XP and notes are stored only in your browser's localStorage. Use <a href=\"#/progress\">Progress → Export</a> to back them up.</p>" +
        "<h3>Offline &amp; hosting</h3><p>Everything (fonts, maths renderer) is bundled, so the site works offline: open <code>index.html</code> directly, or host the folder on GitHub Pages (Settings → Pages → deploy from branch).</p>" +
        "<h3>Credits</h3><p>Maths typesetting: KaTeX (MIT). Fonts: Inter, Space Grotesk, JetBrains Mono (SIL OFL). Confetti: canvas-confetti (ISC). Course content © its authors; this is an unofficial study aid and is not affiliated with or endorsed by The University of the West Indies.</p></div></div>";
    },
  });
  LA.page("/404", { title: "Not found", render() { return '<div class="page"><div class="card center"><h2>Page not found</h2><p class="muted">That link doesn\'t exist (yet).</p><a class="btn btn-primary" href="#/">Back to dashboard</a></div></div>'; } });
})();
