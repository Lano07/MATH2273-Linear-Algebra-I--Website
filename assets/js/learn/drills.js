/* Proof drills: fill-in-the-blank, missing assumption, missing justification, strategy identification and
   proof debugging (find the first wrong line). Line-ordering puzzles reuse the Parsons engine (Proof Studio).
   All answers are deterministic (exact choices or normalised expressions). */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const STRATS = ["Direct proof", "Contrapositive", "Contradiction", "Induction", "Double inclusion (⊆ both ways)", "Subspace test", "One counterexample"];
  const D = [];
  const add = (type, topic, o) => D.push(Object.assign({ id: type + "-" + (D.filter((x) => x.type === type).length + 1), type, topic }, o));

  /* ---------- fill in the blank: [[...]] marks a blank; accept = list of acceptable answers per blank ---------- */
  add("blank", "linear-maps", { title: "Linear maps send 0 to 0", text: "$T(0) = T(0+0) =$ [[1]] $+\\,T(0)$ by linearity. Adding $-T(0)$ to both sides gives [[2]] $= T(0)$.", accept: [["T(0)"], ["0"]] });
  add("blank", "kernel-range", { title: "Closure of the kernel", text: "Let $u,v\\in\\ker T$. Then $T(u+v) = T(u)+T(v) =$ [[1]] $= 0$, so $u+v\\in\\ker T$.", accept: [["0+0", "0 + 0"]] });
  add("blank", "kernel-range", { title: "Rank–Nullity", text: "For linear $T:V\\to W$ with $V$ finite-dimensional, $\\dim\\ker T+\\dim\\Ran T =$ [[1]].", accept: [["dim V", "\\dim V", "dim(V)"]] });
  add("blank", "norms-angles", { title: "Pythagoras", text: "$\\lVert u+v\\rVert^2 = \\langle u,u\\rangle+2\\,$[[1]]$\\,+\\langle v,v\\rangle$, and $u\\perp v$ makes the middle term vanish.", accept: [["<u,v>", "\\langle u,v\\rangle", "<v,u>"]] });
  add("blank", "gram-schmidt", { title: "Gram–Schmidt step", text: "$u_2 = v_2-\\dfrac{\\langle v_2,u_1\\rangle}{\\square}\\,u_1$, where $\\square =$ [[1]].", accept: [["<u1,u1>", "<u_1,u_1>", "\\langle u_1,u_1\\rangle", "||u1||^2", "‖u_1‖^2", "\\lVert u_1\\rVert^2"]] });
  add("blank", "eigen", { title: "Eigenvalue condition", text: "$\\lambda$ is an eigenvalue of $A$ $\\iff$ $(A-\\lambda I)v = 0$ has a non-zero solution $\\iff$ [[1]] $= 0$.", accept: [["det(A-λI)", "det(A - \\lambda I)", "\\det(A-\\lambda I)", "det(A-lambda I)", "|A-λI|"]] });
  add("blank", "det-properties", { title: "Scaling a matrix", text: "For an $n\\times n$ matrix, $\\det(cA) =$ [[1]] $\\cdot\\det A$, because each of the $n$ rows is multiplied by $c$.", accept: [["c^n", "c^{n}"]] });
  add("blank", "cayley-hamilton", { title: "Inverse by Cayley–Hamilton", text: "For $2\\times2$ $A$: $A^2-(\\operatorname{tr}A)A+(\\det A)I = O$, so $A^{-1} = \\dfrac{1}{\\det A}\\,\\square$ where $\\square =$ [[1]].", accept: [["(trA)I-A", "tr(A)I-A", "(\\tr A)I-A", "\\operatorname{tr}(A)I-A", "(tr A)I - A", "tr A I - A"]] });
  add("blank", "orthogonality", { title: "S ∩ S⊥", text: "If $v\\in S\\cap S^\\perp$ then $v$ is orthogonal to itself: [[1]] $= 0$, so $v = 0$ by the coincidence axiom.", accept: [["<v,v>", "\\langle v,v\\rangle", "||v||^2", "‖v‖^2"]] });

  /* ---------- missing assumption ---------- */
  add("assume", "independence", { stmt: "If $S$ is linearly independent, then $S\\cup\\{v\\}$ is dependent $\\iff v\\in\\spn S$.", opts: ["$v\\notin S$", "$S$ is finite", "$v\\neq0$", "$S$ spans $V$"], answer: 0, why: "If $v\\in S$ then $S\\cup\\{v\\} = S$ is independent although $v\\in\\spn S$ (see the corrections page)." });
  add("assume", "orthogonality", { stmt: "Orthogonal vectors $u_1,\\dots,u_k$ are linearly independent.", opts: ["the vectors are non-zero", "the space is finite-dimensional", "the vectors are unit vectors", "the inner product is the dot product"], answer: 0, why: "$\\{(1,0),(0,0)\\}$ is orthogonal but dependent. The proof divides by $\\langle u_j,u_j\\rangle$, which needs $u_j\\neq0$." });
  add("assume", "isomorphisms", { stmt: "If $\\dim V = \\dim W$, every injective linear map $T:V\\to W$ is surjective.", opts: ["$V$ and $W$ are finite-dimensional", "$T$ is invertible", "$V = W$", "$\\ker T\\neq\\{0\\}$"], answer: 0, why: "On the infinite-dimensional space of all polynomials, $p\\mapsto xp$ is injective but not surjective." });
  add("assume", "definiteness", { stmt: "Sylvester: $A$ is positive definite $\\iff$ all leading principal minors of $A$ are positive.", opts: ["$A$ is symmetric", "$A$ is invertible", "$A$ is diagonalizable", "$A$ has integer entries"], answer: 0, why: "$B = \\begin{pmatrix}1&4\\\\0&1\\end{pmatrix}$ has minors $1,1$ but $x^TBx = x^2+4xy+y^2$ takes the value $-2$ at $(1,-1)$." });
  add("assume", "spectral", { stmt: "A real $n\\times n$ matrix has an orthonormal basis of eigenvectors.", opts: ["$A$ is symmetric", "$A$ is invertible", "$A$ has $n$ eigenvalues counted with multiplicity", "$\\det A\\gt0$"], answer: 0, why: "$\\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}$ has eigenvectors $(1,0)$, $(1,1)$ which are not orthogonal. The Spectral Theorem needs $A = A^T$." });
  add("assume", "diagonalization", { stmt: "If $Av_1 = \\lambda_1v_1$ and $Av_2 = \\lambda_2v_2$ with $v_1,v_2\\neq0$, then $\\{v_1,v_2\\}$ is independent.", opts: ["$\\lambda_1\\neq\\lambda_2$", "$A$ is invertible", "$A$ is symmetric", "$\\lambda_1,\\lambda_2\\neq0$"], answer: 0, why: "Take $v_2 = 2v_1$: both are eigenvectors for the same eigenvalue but dependent." });
  add("assume", "systems-rref", { stmt: "If $AB = AC$ then $B = C$.", opts: ["$A$ is invertible", "$A\\neq O$", "$B$ and $C$ are square", "$A$ is symmetric"], answer: 0, why: "$A = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$, $B = O$, $C = \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}$ give $AB = AC = O$ with $B\\neq C$. Multiply by $A^{-1}$ only when it exists." });
  add("assume", "inner-products", { stmt: "$\\langle u,v\\rangle = u^TMv$ defines an inner product on $\\R^n$.", opts: ["$M$ is symmetric positive definite", "$M$ is invertible", "$M$ is diagonal", "$M$ has positive entries"], answer: 0, why: "Symmetry needs $M = M^T$; positivity and coincidence need $u^TMu\\gt0$ for $u\\neq0$. $M = \\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$ (positive entries) fails at $u = (1,-1)$." });

  /* ---------- missing justification ---------- */
  add("justify", "kernel-range", { line: "$T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)$", opts: ["$T$ is linear", "$u,v\\in\\ker T$", "$T$ is injective", "the subspace test"], answer: 0, why: "This is exactly the definition of linearity." });
  add("justify", "kernel-range", { line: "$\\alpha T(u)+\\beta T(v) = \\alpha\\cdot0+\\beta\\cdot0$", opts: ["$u,v\\in\\ker T$", "$T$ is linear", "$T(0) = 0$", "$\\alpha,\\beta$ are scalars"], answer: 0, why: "Being in the kernel means $T(u) = T(v) = 0$." });
  add("justify", "orthogonality", { line: "$a_j\\langle u_j,u_j\\rangle = 0\\Rightarrow a_j = 0$", opts: ["$u_j\\neq0$, so $\\langle u_j,u_j\\rangle\\gt0$", "the $u_i$ are orthogonal", "Cauchy–Schwarz", "symmetry of the inner product"], answer: 0, why: "Coincidence: $\\langle u_j,u_j\\rangle = 0$ only for $u_j = 0$." });
  add("justify", "norms-angles", { line: "$\\langle u+tv,u+tv\\rangle\\ge0$ for every real $t$ (start of the Cauchy–Schwarz proof)", opts: ["the positivity axiom", "linearity", "Pythagoras", "the triangle inequality"], answer: 0, why: "$\\langle w,w\\rangle\\ge0$ for every vector $w$, in particular $w = u+tv$." });
  add("justify", "kernel-range", { line: "For linear $T:\\R^3\\to\\R^2$, $\\dim\\ker T\\ge1$", opts: ["$\\Rank T\\le2$ and Rank–Nullity", "$T(0) = 0$", "$\\R^2$ is a subspace of $\\R^3$", "$T$ is surjective"], answer: 0, why: "$\\dim\\ker T = 3-\\Rank T\\ge3-2 = 1$." });
  add("justify", "det-properties", { line: "$\\det(A)\\det(A^{-1}) = 1$", opts: ["$\\det(AB) = \\det A\\det B$ and $\\det I = 1$", "$\\det A^T = \\det A$", "Cramer's rule", "row operations preserve the determinant"], answer: 0, why: "$\\det(A)\\det(A^{-1}) = \\det(AA^{-1}) = \\det I = 1$." });
  add("justify", "spectral", { line: "$\\langle Au,v\\rangle = \\langle u,Av\\rangle$", opts: ["$A = A^T$", "$A$ is orthogonal", "$u\\perp v$", "$A$ is invertible"], answer: 0, why: "$\\langle Au,v\\rangle = u^TA^Tv = u^TAv$ when $A^T = A$." });
  add("justify", "gram-schmidt", { line: "$\\langle u_2,u_1\\rangle = 0$ after $u_2 = v_2-\\frac{\\langle v_2,u_1\\rangle}{\\langle u_1,u_1\\rangle}u_1$", opts: ["the component of $v_2$ along $u_1$ was subtracted", "$v_1$ and $v_2$ are independent", "$u_1$ is a unit vector", "Pythagoras"], answer: 0, why: "$\\langle u_2,u_1\\rangle = \\langle v_2,u_1\\rangle-\\frac{\\langle v_2,u_1\\rangle}{\\langle u_1,u_1\\rangle}\\langle u_1,u_1\\rangle = 0$." });

  /* ---------- strategy identification ---------- */
  add("strategy", "kernel-range", { stmt: "$\\ker T$ is a subspace of $V$.", answer: 5, why: "Show $0\\in\\ker T$ and closure under linear combinations." });
  add("strategy", "sets", { stmt: "$(A\\cup B)^c = A^c\\cap B^c$.", answer: 4, why: "Set equality: show each side is contained in the other." });
  add("strategy", "independence", { stmt: "If $T(v_1),\\dots,T(v_k)$ are independent then $v_1,\\dots,v_k$ are independent.", answer: 1, why: "Contrapositive: a dependence relation among the $v_i$ maps (by linearity) to one among the $T(v_i)$." });
  add("strategy", "det-properties", { stmt: "$\\det(A^n) = (\\det A)^n$ for every integer $n\\ge1$.", answer: 3, why: "Base case $n = 1$; step: $\\det(A^{n+1}) = \\det(A^n)\\det A$." });
  add("strategy", "linear-maps", { stmt: "$T(x,y) = (x+1,y)$ is linear.", answer: 6, why: "It's false: $T(0,0) = (1,0)\\neq(0,0)$ — one counterexample settles it." });
  add("strategy", "eigen", { stmt: "Every eigenvalue of a matrix with $A^2 = A$ is $0$ or $1$.", answer: 0, why: "Directly: $\\lambda v = Av = A^2v = \\lambda^2v$." });
  add("strategy", "orthogonality", { stmt: "$S\\cap S^\\perp = \\{0\\}$ for a subspace $S$.", answer: 4, why: "$\\{0\\}\\subseteq S\\cap S^\\perp$ since $0$ is in both; conversely $v\\in S\\cap S^\\perp\\Rightarrow\\langle v,v\\rangle = 0\\Rightarrow v = 0$." });
  add("strategy", "isomorphisms", { stmt: "There is no injective linear map $\\R^3\\to\\R^2$.", answer: 2, why: "Suppose there were one; Rank–Nullity gives $\\Rank T = 3\\gt\\dim\\R^2$, a contradiction. (A direct Rank–Nullity argument is equally fine.)" });

  /* ---------- proof debugging: find the FIRST wrong line ---------- */
  add("debug", "linear-maps", { stmt: "$T(x,y) = (x+y,\\ xy)$ is linear.", lines: ["Let $u = (x_1,y_1)$, $v = (x_2,y_2)$.", "$T(u+v) = (x_1+x_2+y_1+y_2,\\ (x_1+x_2)(y_1+y_2))$.", "$(x_1+x_2)(y_1+y_2) = x_1y_1+x_2y_2$.", "Hence $T(u+v) = T(u)+T(v)$, and similarly for scalars."], bad: 2, why: "The cross terms $x_1y_2+x_2y_1$ were dropped. In fact $T$ is not linear: $T(2(1,1)) = (4,4)\\neq2T(1,1) = (4,2)$." });
  add("debug", "systems-rref", { stmt: "If $A^2 = A$ then $A = O$ or $A = I$.", lines: ["$A^2 = A$.", "So $A^2-A = O$.", "So $A(A-I) = O$.", "Hence $A = O$ or $A-I = O$."], bad: 3, why: "Matrices have zero divisors: $AB = O$ does not force $A = O$ or $B = O$. Counterexample: $A = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$." });
  add("debug", "orthogonality", { stmt: "Every orthogonal set is linearly independent.", lines: ["Suppose $\\sum a_iu_i = 0$.", "Taking $\\langle\\cdot,u_j\\rangle$: $a_j\\langle u_j,u_j\\rangle = 0$.", "Dividing by $\\langle u_j,u_j\\rangle$ gives $a_j = 0$.", "So the set is independent."], bad: 2, why: "If $u_j = 0$ then $\\langle u_j,u_j\\rangle = 0$ and you cannot divide. The statement needs non-zero vectors." });
  add("debug", "det-properties", { stmt: "$\\det(A+B) = \\det A+\\det B$.", lines: ["The determinant is linear.", "So $\\det(A+B) = \\det A+\\det B$.", "This holds for all square $A,B$."], bad: 0, why: "$\\det$ is linear in EACH ROW separately, not in the whole matrix. $\\det(I+I) = 4\\neq2$ for $2\\times2$." });
  add("debug", "span", { stmt: "If $v\\in\\spn\\{u,w\\}$ then $u\\in\\spn\\{v,w\\}$.", lines: ["Write $v = au+bw$.", "Then $au = v-bw$.", "So $u = \\frac1a(v-bw)\\in\\spn\\{v,w\\}$."], bad: 2, why: "This divides by $a$, which may be $0$. Counterexample: $u = (1,0)$, $w = (0,1)$, $v = w$." });
  add("debug", "eigen", { stmt: "$0$ is never an eigenvalue of a square matrix.", lines: ["Suppose $Av = 0v$ with $v\\neq0$.", "Then $Av = 0$.", "Since $A$ is invertible, $v = A^{-1}0 = 0$.", "Contradiction, so $0$ is not an eigenvalue."], bad: 2, why: "Nothing said $A$ is invertible. In fact $0$ is an eigenvalue exactly when $A$ is singular." });
  add("debug", "sets", { stmt: "$(A\\cup B)^c = A^c\\cup B^c$.", lines: ["Let $x\\in(A\\cup B)^c$.", "Then $x\\notin A\\cup B$, i.e. $x\\notin A$ or $x\\notin B$.", "So $x\\in A^c\\cup B^c$."], bad: 1, why: "$x\\notin A\\cup B$ means $x\\notin A$ <b>and</b> $x\\notin B$ — the correct identity is $A^c\\cap B^c$." });
  add("debug", "kernel-range", { stmt: "If $T:\\R^2\\to\\R^3$ is linear with $\\ker T = \\{0\\}$, then $T$ is surjective.", lines: ["$\\Nullity T = 0$.", "By Rank–Nullity, $\\Rank T = 2-0 = 2$.", "$2 = \\dim\\R^3$, so $\\Ran T = \\R^3$."], bad: 2, why: "$\\dim\\R^3 = 3\\neq2$. An injective map from a 2-dimensional space can never be onto a 3-dimensional one." });
  LA.DRILLS = D;
  LA.DRILL_STRATS = STRATS;

  const normBlank = (s) => (LA.normProof ? LA.normProof(s).compact : String(s).replace(/\s+/g, "").toLowerCase()).replace(/[()]/g, "");
  LA.checkBlank = (accepts, input) => accepts.some((a) => normBlank(a) === normBlank(input));

  /* ---------- player ---------- */
  LA.mountDrill = function (host, d, onDone) {
    const rec = (ok) => { if (d._rec) return; d._rec = true; LA.ev.record({ topic: d.topic, src: "drill", score: ok ? 1 : 0, gen: "drill:" + d.id }); if (!ok) LA.mist.add({ topic: d.topic, gen: "drill:" + d.id, title: "Drill: " + (d.title || d.stmt || d.line || "").replace(/\$/g, "").slice(0, 60), msg: "", src: "drill" }); if (ok) LA.addXP(6, "Proof drill"); if (onDone) onDone(ok); };
    const head = { blank: "Fill in the blanks", assume: "Which hypothesis is missing?", justify: "Which reason justifies this step?", strategy: "Which proof strategy fits best?", debug: "Find the first incorrect line" }[d.type];
    let body = "";
    if (d.type === "blank") {
      let k = 0; const txt = d.text.replace(/\[\[(\d)\]\]/g, () => '<input type="text" class="blank-in mono-in" data-b="' + k++ + '" size="10" aria-label="blank ' + k + '">');
      body = "<p><b>" + esc(d.title) + ":</b> " + txt + '</p><div class="row"><button class="btn btn-primary" data-act="chk">Check</button><button class="btn btn-ghost" data-act="show">Show answer</button></div>';
    } else if (d.type === "debug") {
      body = "<p><b>Claimed:</b> " + d.stmt + '</p><ol class="debug-lines">' + d.lines.map((l, i) => '<li><button class="quiz-opt" data-o="' + i + '"><span class="lt">' + (i + 1) + "</span><span>" + l + "</span></button></li>").join("") + "</ol>";
    } else {
      const opts = d.type === "strategy" ? STRATS : d.opts;
      const order = d._order || (d._order = LA.shuffle(opts.map((_, i) => i)));
      const q = d.type === "assume" ? "<p><b>Statement:</b> " + d.stmt + "</p><p>As stated it is false. Which assumption must be added?</p>" : d.type === "justify" ? "<p><b>Proof step:</b> " + d.line + "</p>" : "<p><b>Prove:</b> " + d.stmt + "</p>";
      body = q + '<div class="quiz-opts">' + order.map((i, k) => '<button class="quiz-opt" data-o="' + i + '"><span class="lt">' + "ABCDEFG"[k] + "</span><span>" + opts[i] + "</span></button>").join("") + "</div>";
    }
    host.innerHTML = '<div class="card drill"><div class="row spread"><span class="kicker" style="margin:0">' + head + '</span><a class="chip violet" href="#/learn/' + d.topic + '">' + esc(LA.topic(d.topic).title) + '</a></div>' + body + '<div class="drill-fb" aria-live="polite"></div></div>';
    const fb = $(".drill-fb", host);
    const explain = (ok, extra) => { fb.innerHTML = '<div class="verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓ Correct" : "✗ Not quite") + "</div>" + (d.why ? '<div class="box tip" data-t="Why">' + "<p>" + d.why + "</p></div>" : "") + (extra || ""); LA.enhance(fb); LA.renderMath(fb); };
    if (d.type === "blank") {
      $('[data-act="chk"]', host).onclick = () => {
        const ins = $$(".blank-in", host); const res = ins.map((el, i) => LA.checkBlank(d.accept[i], el.value));
        ins.forEach((el, i) => { el.classList.toggle("ok-in", res[i]); el.classList.toggle("bad-in", !res[i]); });
        const ok = res.every(Boolean); rec(ok); explain(ok, ok ? "" : '<p class="small muted">Accepted answers: ' + d.accept.map((a) => "$" + a[0].replace(/\|\|/g, "\\lVert ") + "$").join(", ") + "</p>");
      };
      $('[data-act="show"]', host).onclick = () => { rec(false); $$(".blank-in", host).forEach((el, i) => { el.value = d.accept[i][0]; }); explain(false, '<p class="small muted">Answer shown — no credit this time.</p>'); };
    } else {
      $$("[data-o]", host).forEach((b) => b.addEventListener("click", () => {
        const k = +b.dataset.o, ok = d.type === "debug" ? k === d.bad : k === d.answer;
        $$("[data-o]", host).forEach((x) => { x.disabled = true; const v = +x.dataset.o; if (v === (d.type === "debug" ? d.bad : d.answer)) x.classList.add("correct"); else if (v === k) x.classList.add("wrong"); });
        rec(ok); explain(ok);
      }));
    }
    LA.renderMath(host);
  };

  LA.page("/proofs/drills", {
    title: "Proof Drills", searchTitle: "Proof Drills", searchDesc: "Fill-in-the-blank, missing assumptions, justifications, strategies and proof debugging",
    render(p, q) {
      const types = [["all", "All"], ["blank", "Fill the blanks"], ["assume", "Missing assumption"], ["justify", "Justify the step"], ["strategy", "Choose a strategy"], ["debug", "Debug a proof"], ["order", "Order the lines"]];
      const cur = q.type || "all";
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Advanced Proof Studio</div><h1>Proof Drills</h1><p class="lead">Short, focused exercises on the skills proofs are built from. Each one is instantly checked and explained; your first answer counts towards the topic\'s mastery.</p><div class="row"><a class="btn" href="#/proofs/examiner">🔎 Proof Examiner</a><a class="btn" href="#/counterexamples">🧪 Counterexample Lab</a><a class="btn" href="#/proofs">✍️ Proof Studio</a></div></div></div>' +
        '<div class="tabs" role="tablist">' + types.map((t) => '<a class="tab ' + (t[0] === cur ? "active" : "") + '" href="#/proofs/drills?type=' + t[0] + '">' + t[1] + "</a>").join("") + "</div>" +
        (cur === "order" ? '<div id="pzHost"></div>' : '<div id="drillList" class="grid grid-2"></div>') + "</div>";
    },
    after(view, p, q) {
      const cur = q.type || "all";
      if (cur === "order") { LA.mountParsons($("#pzHost", view)); return; }
      const list = D.filter((d) => cur === "all" || d.type === cur).filter((d) => !q.id || d.id === q.id);
      const host = $("#drillList", view);
      host.innerHTML = list.map((d, i) => '<div data-di="' + i + '"></div>').join("");
      list.forEach((d, i) => LA.mountDrill($('[data-di="' + i + '"]', host), d));
    },
  });
})();
