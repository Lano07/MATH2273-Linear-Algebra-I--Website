/* "Formulas & lessons" panel added to the top of every lab: the formulas the lab uses, the lesson sections,
   the topics it belongs to (with mastery) and a one-click link to practise them. */
(function () {
  "use strict";
  const LA = window.LA;
  const H = String.raw;
  const META = {
    "/labs/transform": { topics: ["linear-maps", "kernel-range", "eigen"], lessons: [["§3.1 Linear maps", "#/ch/3?go=sec-3-1"], ["Ch 6 Determinants", "#/ch/6"], ["Ch 7 Eigenvalues", "#/ch/7"]], f: [H`$A = \big(T(e_1)\;\;T(e_2)\big)$ — the columns are the images of $e_1,e_2$`, H`$|\det A|$ = area scale factor; $\det A\lt0$ flips orientation`, H`$Av = \lambda v$: eigen-directions stay on their own line`, H`$\ker A = \{v: Av = 0\}$ (the line squashed to $0$ when $\det A = 0$)`] },
    "/labs/linearity": { topics: ["linear-maps"], lessons: [["§3.1 What makes a map linear", "#/ch/3?go=sec-3-1"]], f: [H`$T(\alpha u+\beta v) = \alpha T(u)+\beta T(v)$`, H`Linear $\Rightarrow T(0) = 0$ — use it to disprove`, "One numerical counterexample disproves linearity"] },
    "/labs/kernel": { topics: ["kernel-range"], lessons: [["§3.2 Kernel & range", "#/ch/3?go=sec-3-2"]], f: [H`$\ker T = \{v: T(v) = 0\}\le V$`, H`$\Ran T = \spn\{T(v_1),\dots,T(v_n)\}\le W$`, H`$\Rank T+\Nullity T = \dim V$`, H`Injective $\iff\ker T = \{0\}$`] },
    "/labs/matrix": { topics: ["matrix-of-map", "change-of-basis"], lessons: [["§3.4 The matrix of T", "#/ch/3?go=sec-3-4"]], f: [H`$[T]^{\Cc}_{\B} = \big([T(v_1)]_{\Cc}\cdots[T(v_n)]_{\Cc}\big)$`, H`$[T(v)]_{\Cc} = [T]^{\Cc}_{\B}[v]_{\B}$`, H`$(C\,|\,T(v_1)\cdots T(v_n))\to(I\,|\,[T]^{\Cc}_{\B})$`] },
    "/labs/gram-schmidt": { topics: ["gram-schmidt", "inner-products"], lessons: [["Gram–Schmidt (Ch 4)", "#/ch/4?go=sec-4-2-14"]], f: [H`$u_k = v_k-\sum_{j\lt k}\frac{\langle v_k,u_j\rangle}{\langle u_j,u_j\rangle}u_j$`, H`$w_k = u_k/\lVert u_k\rVert$`, H`$\spn\{v_1,\dots,v_k\} = \spn\{u_1,\dots,u_k\}$`] },
    "/labs/gs-studio": { topics: ["gram-schmidt", "projections"], lessons: [["Gram–Schmidt (Ch 4)", "#/ch/4?go=sec-4-2-14"], ["Projections (Ch 4 deep dive)", "#/ch/4?go=sec-4-d"]], f: [H`$\mathrm{proj}_uv = \frac{\langle v,u\rangle}{\langle u,u\rangle}u$`, H`$u_k = v_k-\sum_{j\lt k}\mathrm{proj}_{u_j}v_k$`, H`Orthonormal: $\langle w_i,w_j\rangle = \delta_{ij}$`] },
    "/labs/gs3d": { topics: ["orthogonality", "gram-schmidt"], lessons: [["§4.2 Orthogonality", "#/ch/4?go=sec-4-2"]], f: [H`$S^\perp = \{x: \langle x,s\rangle = 0\ \forall s\in S\}$`, H`In $\R^n$: $\dim S+\dim S^\perp = n$`, H`$S\cap S^\perp = \{0\}$`] },
    "/labs/inner": { topics: ["inner-products", "norms-angles"], lessons: [["§4.1 Inner products", "#/ch/4?go=sec-4-1"]], f: [H`Positivity, coincidence, symmetry, linearity`, H`$\langle u,v\rangle = u^TMv$ is an inner product $\iff M$ symmetric positive definite`, H`$\lVert v\rVert = \sqrt{\langle v,v\rangle}$, $\cos\theta = \frac{\langle u,v\rangle}{\lVert u\rVert\lVert v\rVert}$`] },
    "/labs/rref": { topics: ["systems-rref", "rank-spaces"], lessons: [["§5.1 Row reduction", "#/ch/5?go=sec-5-1"], ["§5.2 Rank", "#/ch/5?go=sec-5-2"]], f: [H`Row operations don't change the solution set, row space or null space`, H`Inconsistent $\iff$ a row $(0\cdots0\,|\,c\neq0)$`, H`$\Rank$ = number of pivots; $\Nullity = n-\Rank$`] },
    "/labs/det": { topics: ["permutations-det", "det-properties"], lessons: [["Ch 6 Determinants", "#/ch/6"]], f: [H`Swap: $\times(-1)$; scale a row by $c$: $\times c$; add a multiple: no change`, H`$\det AB = \det A\det B$, $\det A^T = \det A$`, H`$A$ invertible $\iff\det A\neq0$`] },
    "/labs/eigen": { topics: ["eigen", "multiplicity", "diagonalization"], lessons: [["Ch 7 Eigenvalues", "#/ch/7"]], f: [H`$\det(A-\lambda I) = 0$; eigenspace $\Null(A-\lambda I)$`, H`$\sum\lambda_i = \operatorname{tr}A$, $\prod\lambda_i = \det A$`, H`Diagonalizable $\iff$ geometric = algebraic multiplicity for each $\lambda$`] },
    "/labs/change-of-basis": { topics: ["change-of-basis", "diagonalization"], lessons: [["§3.4 Similarity", "#/ch/3?go=sec-3-4"]], f: [H`$v = P[v]_{\B}$, $[v]_{\B} = P^{-1}v$ with $P = (b_1\;b_2)$`, H`$[T]_{\B} = P^{-1}AP$`, H`Eigenvector basis ⇒ $[T]_{\B}$ diagonal`] },
    "/labs/quadratic": { topics: ["quadratic-forms", "principal-axes", "definiteness", "optimisation"], lessons: [["Ch 8 Quadratic forms", "#/ch/8"]], f: [H`$Q = x^TAx$, $A = A^T$`, H`$x = Py$ ⇒ $Q = \lambda_1y_1^2+\lambda_2y_2^2$`, H`PD $\iff$ all $\lambda\gt0\iff$ all $\Delta_k\gt0$`] },
    "/labs/calculator": { topics: ["systems-rref", "rank-spaces", "det-properties", "eigen"], lessons: [["Ch 5", "#/ch/5"], ["Ch 6", "#/ch/6"], ["Ch 7", "#/ch/7"]], f: [H`$E_k\cdots E_1A = \operatorname{RREF}(A)$`, H`$[A\,|\,I]\to[I\,|\,A^{-1}]$`] },
  };
  LA.LAB_META = META;
  (LA.afterRoute = LA.afterRoute || []).push(function (view, m) {
    const meta = META[m.page.pattern]; if (!meta) return;
    const page = view.querySelector(".page"); if (!page || page.querySelector(".lab-meta")) return;
    const tps = meta.topics.map(LA.topic).filter(Boolean);
    const el = document.createElement("details");
    el.className = "card lab-meta"; el.open = false;
    el.innerHTML = '<summary><b>📐 Formulas &amp; lessons for this lab</b> <span class="small muted">· ' + tps.map((t) => t.title).join(" · ") + "</span></summary>" +
      '<div class="grid grid-2" style="margin-top:10px"><div><div class="kicker">Formulas used here</div><ul>' + meta.f.map((x) => "<li>" + x + "</li>").join("") + '</ul></div><div><div class="kicker">Read · practise</div><div class="row" style="gap:6px">' + meta.lessons.map((l) => '<a class="chip" href="' + l[1] + '">📖 ' + l[0] + "</a>").join("") + "</div>" +
      '<div style="margin-top:8px">' + tps.map((t) => '<div class="row" style="gap:6px;margin:4px 0"><a href="#/learn/' + t.id + '">' + LA.esc(t.title) + "</a>" + LA.masteryChip(t.id) + '<a class="small" href="#/practice?mode=topic&topic=' + t.id + '">practise ▸</a></div>').join("") + "</div></div></div>";
    const head = Array.from(page.children).find((c) => c.matches(".row.spread, .hero"));
    if (head) head.insertAdjacentElement("afterend", el); else page.insertBefore(el, page.firstChild);
    LA.renderMath(el);
  });
})();
