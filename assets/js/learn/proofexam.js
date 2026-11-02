/* Advanced Proof Studio: the Proof Examiner.
   HONESTY RULE: the automatic examiner is a transparent, pattern-based checklist. It looks for the steps a marker
   expects to see (zero vector, closure, use of linearity, conclusion…) and flags common structural problems
   (conclusion-only answers, proof by example, missing "let"). It does NOT verify logical validity.
   The student then compares with the model proof and self-marks against the rubric; the self-mark is what is recorded. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const H = String.raw;

  /* ---------------- text normalisation (LaTeX or plain text → comparable string) ---------------- */
  function normProof(src) {
    let s = String(src || "").replace(/\$/g, " ");
    const rep = [[/\\left|\\right|\\,|\\;|\\!|\\quad|\\qquad/g, " "], [/\\mathbf\{0\}|\\vec\{0\}|\\mathbf 0|\\boldsymbol\{0\}|0_\{?[vwVW]\}?|\\theta_\{?[vwVW]\}?|\\underline\{0\}/g, "0"], [/\\in\b/g, "∈"], [/\\notin/g, "∉"], [/\\subseteq|\\subset/g, "⊆"], [/\\alpha/g, "α"], [/\\beta/g, "β"], [/\\lambda/g, "λ"], [/\\mu/g, "μ"], [/\\langle/g, "<"], [/\\rangle/g, ">"], [/\\cdot|\\times/g, ""], [/\\neq|\\ne\b/g, "≠"], [/\\Rightarrow|\\implies|=>/g, "⇒"], [/\\iff|\\Leftrightarrow|<=>/g, "⇔"], [/\\forall/g, "∀"], [/\\exists/g, "∃"], [/\\ker/g, "ker"], [/\\operatorname\{(\w+)\}/g, "$1"], [/\\(Ran|Null|Rank|spn|span)\b/g, "$1"], [/\\perp/g, "⊥"], [/\\lVert|\\rVert|\\\|/g, "‖"], [/\\\{/g, "{"], [/\\\}/g, "}"], [/\\square|\\blacksquare|∎|□/g, " qed "], [/\\[a-zA-Z]+/g, " "], [/[{}]/g, ""], [/−/g, "-"], [/·/g, ""]];
    rep.forEach(([a, b]) => { s = s.replace(a, b); });
    const words = " " + s.toLowerCase().replace(/\s+/g, " ").trim() + " ";
    const compact = words.replace(/\s+/g, "");
    return { words, compact };
  }
  const V = "[a-z](?:_?\\d)?", S = "(?:α|β|λ|μ|a|b|c|k|r|s)";
  const re = (x, f) => new RegExp(x, f || "");
  // common detectors
  const D = {
    zeroT: { c: [re("t\\(0\\)=0"), re("0=t\\(0\\)"), re("t\\(0\\+0\\)")] },
    letUV: { w: [/\blet\b/, /\bsuppose\b/, /\btake\b/, /\bfor (all|any|every|arbitrary)\b/, /\bgiven\b/], c: [re("∀" + V)] },
    addT: { c: [re("t\\(" + V + "\\+" + V + "\\)=t\\(" + V + "\\)\\+t\\(" + V + "\\)"), re("t\\(" + S + V + "\\+" + S + V + "\\)=" + S + "t\\(" + V + "\\)\\+" + S + "t\\(" + V + "\\)")] },
    scalT: { c: [re("t\\(" + S + V + "\\)=" + S + "t\\(" + V + "\\)"), re("t\\(" + S + V + "\\+" + S + V + "\\)=" + S + "t\\(" + V + "\\)\\+" + S + "t\\(" + V + "\\)")] },
    linear: { w: [/linear/, /linearity/] },
  };
  function hit(det, N) { return (det.c || []).some((r) => r.test(N.compact)) || (det.w || []).some((r) => r.test(N.words)); }
  const any = (...ds) => ({ c: ds.flatMap((d) => d.c || []), w: ds.flatMap((d) => d.w || []) });

  /* ---------------- tasks ---------------- */
  // rubric item: { label, marks, det (detector) | self: true, tip }
  const TASKS = [
    { id: "ker-sub", topic: "kernel-range", title: "The kernel is a subspace", stmt: "If $T:V\\to W$ is linear, then $\\ker T$ is a subspace of $V$.", concl: /subspace/,
      rubric: [
        { label: "States $\\ker T\\subseteq V$ (correct domain)", det: { c: [re("kert⊆v"), re("kert(is)?asubsetofv"), re("kert=.{0,60}⊆v")], w: [/subset of v/, /kernel is contained in v/, /elements of v/] }, tip: "By definition $\\ker T = \\{v\\in V: T(v) = 0\\}$, so it is a subset of $V$ (not of $W$)." },
        { label: "Zero vector: $T(0) = 0$, so $0\\in\\ker T$", det: D.zeroT, tip: "Use Proposition 3.1.4: $T(0_V) = 0_W$." },
        { label: "Takes GENERAL elements: 'Let $u,v\\in\\ker T$' (and scalars)", det: D.letUV, tip: "Start closure with arbitrary elements, never specific numbers." },
        { label: "Closure under addition: $T(u+v) = T(u)+T(v) = 0$", det: D.addT, tip: "$T(u+v) = T(u)+T(v) = 0+0 = 0$." },
        { label: "Closure under scalar multiplication: $T(\\alpha u) = \\alpha T(u) = 0$", det: D.scalT, tip: "$T(\\alpha u) = \\alpha T(u) = \\alpha 0 = 0$ (or do both at once with $T(\\alpha u+\\beta v)$)." },
        { label: "Justifies each step by the linearity of $T$", det: D.linear, tip: "Say WHY $T(u+v) = T(u)+T(v)$: because $T$ is linear." },
        { label: "Valid reasoning throughout (each line follows from the previous)", self: true, tip: "Only you can judge this — compare line by line with the model proof." },
        { label: "Conclusion: '$\\ker T$ is a subspace of $V$'", det: { w: [/(therefore|hence|thus|so|∴|we conclude|it follows).{0,80}subspace/] }, tip: "End by stating what you proved and which test you used." },
      ],
      model: H`<p>By definition $\ker T = \{v\in V: T(v) = 0\}\subseteq V$.</p><p><b>(1) Zero vector.</b> Since $T$ is linear, $T(0) = 0$ (Prop. 3.1.4), so $0\in\ker T$.</p><p><b>(2) Closure.</b> Let $u,v\in\ker T$ and $\alpha,\beta\in\FF$. Then $T(u) = T(v) = 0$ and, by linearity,
$$T(\alpha u+\beta v) = \alpha T(u)+\beta T(v) = \alpha 0+\beta 0 = 0,$$
so $\alpha u+\beta v\in\ker T$.</p><p>Hence, by the subspace test (Theorem 2.2.3), $\ker T$ is a subspace of $V$. $\square$</p>` },
    { id: "ran-sub", topic: "kernel-range", title: "The range is a subspace", stmt: "If $T:V\\to W$ is linear, then $\\Ran T$ is a subspace of $W$.", concl: /subspace/,
      rubric: [
        { label: "States $\\Ran T\\subseteq W$", det: { c: [re("ran(t)?⊆w"), re("t\\(v\\)⊆w")], w: [/subset of w/, /contained in w/] }, tip: "$\\Ran T = \\{T(v): v\\in V\\}\\subseteq W$." },
        { label: "Zero vector: $0 = T(0)\\in\\Ran T$", det: D.zeroT, tip: "$0_W = T(0_V)$ is an image." },
        { label: "Takes general elements $w_1 = T(v_1)$, $w_2 = T(v_2)$", det: { w: [/let/, /suppose/], c: [re("w_?1=t\\(v_?1\\)"), re("=t\\(v_?1\\)"), re("w=t\\(v\\)")] }, tip: "Elements of the range are images: write them as $T(v_1), T(v_2)$." },
        { label: "Closure: $\\alpha w_1+\\beta w_2 = T(\\alpha v_1+\\beta v_2)$", det: { c: [re("t\\(" + S + "v_?1\\+" + S + "v_?2\\)"), re("t\\(v_?1\\+v_?2\\)"), re("=t\\(" + S + V + "\\+" + S + V + "\\)"), re(S + "t\\(" + V + "\\)=t\\(" + S + V + "\\)")] }, tip: "Linearity lets you pull the combination inside $T$." },
        { label: "Uses linearity of $T$", det: D.linear, tip: "Name the property you use." },
        { label: "Valid reasoning throughout", self: true, tip: "Compare with the model." },
        { label: "Conclusion: $\\Ran T$ is a subspace of $W$", det: { w: [/(therefore|hence|thus|so|∴|conclude).{0,80}subspace/] }, tip: "State the conclusion." },
      ],
      model: H`<p>$\Ran T = \{T(v): v\in V\}\subseteq W$. <b>(1)</b> $0_W = T(0_V)\in\Ran T$. <b>(2)</b> Let $w_1,w_2\in\Ran T$ and $\alpha,\beta\in\FF$; write $w_1 = T(v_1)$, $w_2 = T(v_2)$. By linearity $\alpha w_1+\beta w_2 = \alpha T(v_1)+\beta T(v_2) = T(\alpha v_1+\beta v_2)\in\Ran T$, since $\alpha v_1+\beta v_2\in V$. Hence $\Ran T$ is a subspace of $W$. $\square$</p>` },
    { id: "inj-ker", topic: "kernel-range", title: "Injective ⇔ trivial kernel", stmt: "A linear map $T$ is injective if and only if $\\ker T = \\{0\\}$.", concl: /injective|one-to-one|1-1/,
      rubric: [
        { label: "Proves BOTH directions (⇒ and ⇐), clearly labelled", det: { c: [/⇒.*⇐|⇐.*⇒|\(⇒\).*\(⇐\)/], w: [/conversely/, /(⇒|forward).{0,400}(⇐|backward|reverse|converse)/, /only if/] }, tip: "An 'if and only if' needs two separate proofs." },
        { label: "(⇒) $T(v) = 0 = T(0)$, so injectivity gives $v = 0$", det: { c: [re("t\\(" + V + "\\)=0=t\\(0\\)"), re("t\\(" + V + "\\)=t\\(0\\)")] }, tip: "Compare $T(v)$ with $T(0)$." },
        { label: "(⇐) $T(u) = T(v)\\Rightarrow T(u-v) = 0$", det: { c: [re("t\\(" + V + "-" + V + "\\)=0"), re("t\\(" + V + "\\)-t\\(" + V + "\\)=t\\(" + V + "-" + V + "\\)"), re("t\\(" + V + "-" + V + "\\)=t\\(" + V + "\\)-t\\(" + V + "\\)")] }, tip: "Subtract and use linearity." },
        { label: "Concludes $u-v\\in\\ker T = \\{0\\}$ so $u = v$", det: { c: [re(V + "-" + V + "∈kert"), re(V + "-" + V + "=0"), re(V + "=" + V)] }, tip: "That is exactly injectivity." },
        { label: "Uses linearity", det: D.linear, tip: "Say where linearity is used." },
        { label: "Valid reasoning throughout", self: true, tip: "" },
      ],
      model: H`<p><b>(⇒)</b> Suppose $T$ is injective and $T(v) = 0$. Since $T(0) = 0$, we have $T(v) = T(0)$, so $v = 0$. Thus $\ker T = \{0\}$.</p><p><b>(⇐)</b> Suppose $\ker T = \{0\}$ and $T(u) = T(v)$. By linearity $T(u-v) = T(u)-T(v) = 0$, so $u-v\in\ker T = \{0\}$, i.e. $u = v$. Hence $T$ is injective. $\square$</p>` },
    { id: "t0", topic: "linear-maps", title: "Linear maps send 0 to 0", stmt: "If $T$ is linear then $T(0) = 0$.", concl: /t\(0\)=0/,
      rubric: [
        { label: "Uses a valid trick: $T(0) = T(0+0)$ or $T(0\\cdot v) = 0\\cdot T(v)$", det: { c: [re("t\\(0\\)=t\\(0\\+0\\)"), re("t\\(0" + V + "\\)=0t\\(" + V + "\\)"), re("t\\(0\\)=t\\(00\\)")] }, tip: "Write $0$ in a clever way and apply linearity." },
        { label: "Applies linearity", det: D.linear, tip: "" },
        { label: "Cancels correctly (adds $-T(0)$ to both sides)", det: { w: [/subtract/, /add.{0,20}-\s?t\(0\)/, /cancel/, /additive inverse/], c: [re("t\\(0\\)\\+t\\(0\\)=t\\(0\\)"), re("0t\\(" + V + "\\)=0")] }, tip: "From $T(0) = T(0)+T(0)$ subtract $T(0)$." },
        { label: "Conclusion $T(0) = 0$", det: { c: [/t\(0\)=0/] }, tip: "" },
      ],
      model: H`<p>By linearity $T(0) = T(0+0) = T(0)+T(0)$. Adding $-T(0)$ to both sides gives $0 = T(0)$. $\square$ <span class="small muted">(Alternatively: $T(0) = T(0\cdot v) = 0\cdot T(v) = 0$.)</span></p>` },
    { id: "perp-sub", topic: "orthogonality", title: "S⊥ is a subspace", stmt: "For any subset $S$ of an inner product space $V$, $S^\\perp$ is a subspace of $V$.", concl: /subspace/,
      rubric: [
        { label: "Zero vector: $\\langle 0,s\\rangle = 0$ for all $s$, so $0\\in S^\\perp$", det: { c: [re("<0,s>=0"), re("<s,0>=0"), re("0∈s⊥")] }, tip: "$\\langle 0,s\\rangle = \\langle 0\\cdot0,s\\rangle = 0\\langle0,s\\rangle = 0$." },
        { label: "General elements: let $u,v\\in S^\\perp$, $s\\in S$", det: D.letUV, tip: "" },
        { label: "Closure: $\\langle \\alpha u+\\beta v,s\\rangle = \\alpha\\langle u,s\\rangle+\\beta\\langle v,s\\rangle = 0$", det: { c: [re("<" + S + V + "\\+" + S + V + ",s>=" + S + "<" + V + ",s>\\+" + S + "<" + V + ",s>"), re("<" + V + "\\+" + V + ",s>=<" + V + ",s>\\+<" + V + ",s>"), re("<" + S + V + ",s>=" + S + "<" + V + ",s>")] }, tip: "Linearity of the inner product in the first argument." },
        { label: "Names the property used (linearity of the inner product)", det: { w: [/linear/] }, tip: "" },
        { label: "Valid reasoning throughout", self: true, tip: "" },
        { label: "Conclusion: $S^\\perp$ is a subspace", det: { w: [/(therefore|hence|thus|so|∴).{0,80}subspace/] }, tip: "" },
      ],
      model: H`<p><b>(1)</b> For every $s\in S$, $\langle 0,s\rangle = 0$, so $0\in S^\perp$. <b>(2)</b> Let $u,v\in S^\perp$, $\alpha,\beta\in\R$ and $s\in S$. By linearity in the first argument, $\langle\alpha u+\beta v,s\rangle = \alpha\langle u,s\rangle+\beta\langle v,s\rangle = 0$. So $\alpha u+\beta v\in S^\perp$, and $S^\perp$ is a subspace of $V$. $\square$</p>` },
    { id: "orth-indep", topic: "orthogonality", title: "Orthogonal non-zero vectors are independent", stmt: "If $u_1,\\dots,u_k$ are non-zero and pairwise orthogonal, they are linearly independent.", concl: /independent/,
      rubric: [
        { label: "Starts from a general relation $\\sum a_iu_i = 0$", det: { w: [/suppose|let|assume/], c: [/a_?1u_?1\+/, /∑a_?(i|j)u_?(i|j)=0/, /sum/] }, tip: "Independence proofs always start with an arbitrary linear relation." },
        { label: "Takes the inner product with $u_j$", det: { c: [re("<∑"), re("<a_?1u_?1"), re(",u_?j>"), re(",u_?i>")] , w: [/inner product with/] }, tip: "" },
        { label: "Uses orthogonality: $\\langle u_i,u_j\\rangle = 0$ for $i\\neq j$", det: { w: [/orthogonal/], c: [re("<u_?i,u_?j>=0")] }, tip: "" },
        { label: "Uses $u_j\\neq0$ so $\\langle u_j,u_j\\rangle\\gt0$", det: { c: [re("u_?j≠0"), re("u_?i≠0"), re("‖u_?(i|j)‖(\\^2)?(≠|>)0"), re("<u_?(i|j),u_?(i|j)>(≠|>)0")], w: [/non-?zero/] }, tip: "This is where the hypothesis 'non-zero' is needed." },
        { label: "Concludes every $a_j = 0$", det: { c: [/a_?(j|i)=0/], w: [/all.{0,20}(coefficients|a).{0,20}zero/] }, tip: "" },
        { label: "Valid reasoning throughout", self: true, tip: "" },
      ],
      model: H`<p>Suppose $a_1u_1+\dots+a_ku_k = 0$. Fix $j$ and take the inner product with $u_j$: $\sum_i a_i\langle u_i,u_j\rangle = \langle 0,u_j\rangle = 0$. By orthogonality every term with $i\neq j$ vanishes, leaving $a_j\langle u_j,u_j\rangle = 0$. Since $u_j\neq0$, $\langle u_j,u_j\rangle\gt0$, so $a_j = 0$. This holds for every $j$, so the vectors are independent. $\square$</p>` },
    { id: "pyth", topic: "norms-angles", title: "Pythagoras", stmt: "If $u\\perp v$ then $\\lVert u+v\\rVert^2 = \\lVert u\\rVert^2+\\lVert v\\rVert^2$.", concl: /‖/,
      rubric: [
        { label: "Writes $\\lVert u+v\\rVert^2 = \\langle u+v,u+v\\rangle$", det: { c: [re("‖u\\+v‖\\^?2=<u\\+v,u\\+v>")] }, tip: "Always start from the definition of the norm." },
        { label: "Expands using linearity and symmetry", det: { c: [re("<u,u>\\+2<u,v>\\+<v,v>"), re("<u,u>\\+<u,v>\\+<v,u>\\+<v,v>")] }, tip: "" },
        { label: "Uses $\\langle u,v\\rangle = 0$", det: { c: [re("<u,v>=0")] }, tip: "This is where orthogonality enters." },
        { label: "Concludes", det: { c: [re("=‖u‖\\^?2\\+‖v‖\\^?2")] }, tip: "" },
      ],
      model: H`<p>$\lVert u+v\rVert^2 = \langle u+v,u+v\rangle = \langle u,u\rangle+2\langle u,v\rangle+\langle v,v\rangle$ (linearity and symmetry) $= \lVert u\rVert^2+0+\lVert v\rVert^2$ since $\langle u,v\rangle = 0$. $\square$</p>` },
    { id: "cap-sub", topic: "subspaces", title: "An intersection of subspaces is a subspace", stmt: "If $U,W$ are subspaces of $V$ then $U\\cap W$ is a subspace of $V$.", concl: /subspace/,
      rubric: [
        { label: "Zero vector in both, so in $U\\cap W$", det: { c: [re("0∈u∩w"), re("0∈u.{0,20}0∈w"), re("0∈uand.{0,10}w")], w: [/zero vector/] }, tip: "" },
        { label: "General elements: let $x,y\\in U\\cap W$", det: D.letUV, tip: "" },
        { label: "Closure in $U$ AND in $W$ separately", det: { w: [/(since|as|because) u is a subspace/, /since w is a subspace/, /closed/], c: [re("∈u.{0,40}∈w"), re("∈uand∈w")] }, tip: "Each of $U$, $W$ is closed, so the combination lies in both." },
        { label: "Valid reasoning throughout", self: true, tip: "" },
        { label: "Conclusion", det: { w: [/(therefore|hence|thus|so|∴).{0,80}subspace/] }, tip: "" },
      ],
      model: H`<p>$0\in U$ and $0\in W$, so $0\in U\cap W$. Let $x,y\in U\cap W$ and $\alpha,\beta$ scalars. Since $U$ is a subspace, $\alpha x+\beta y\in U$; since $W$ is a subspace, $\alpha x+\beta y\in W$. Hence $\alpha x+\beta y\in U\cap W$, and $U\cap W$ is a subspace. $\square$</p>` },
    { id: "eig-indep", topic: "diagonalization", title: "Eigenvectors for distinct eigenvalues are independent (two vectors)", stmt: "If $Av_1 = \\lambda_1v_1$, $Av_2 = \\lambda_2v_2$ with $v_1,v_2\\neq0$ and $\\lambda_1\\neq\\lambda_2$, then $\\{v_1,v_2\\}$ is independent.", concl: /independent/,
      rubric: [
        { label: "Starts from $av_1+bv_2 = 0$", det: { c: [re(S + "v_?1\\+" + S + "v_?2=0")] }, tip: "" },
        { label: "Applies $A$: $a\\lambda_1v_1+b\\lambda_2v_2 = 0$", det: { c: [re(S + "λ_?1v_?1\\+" + S + "λ_?2v_?2=0"), re("a\\(" + S + "v_?1\\+" + S + "v_?2\\)")] }, tip: "" },
        { label: "Eliminates to get $b(\\lambda_2-\\lambda_1)v_2 = 0$", det: { c: [re("\\(λ_?2-λ_?1\\)"), re("\\(λ_?1-λ_?2\\)")] }, tip: "Multiply the first equation by $\\lambda_1$ and subtract." },
        { label: "Uses $\\lambda_1\\neq\\lambda_2$ and $v_2\\neq0$", det: { c: [re("λ_?1≠λ_?2"), re("v_?2≠0")], w: [/distinct/, /non-?zero/] }, tip: "" },
        { label: "Concludes $a = b = 0$", det: { c: [/a=b=0/, /b=0.{0,60}a=0/] }, tip: "" },
        { label: "Valid reasoning throughout", self: true, tip: "" },
      ],
      model: H`<p>Suppose $av_1+bv_2 = 0$. Applying $A$: $a\lambda_1v_1+b\lambda_2v_2 = 0$. Subtract $\lambda_1$ times the first equation: $b(\lambda_2-\lambda_1)v_2 = 0$. Since $\lambda_2\neq\lambda_1$ and $v_2\neq0$, $b = 0$. Then $av_1 = 0$ with $v_1\neq0$ gives $a = 0$. Hence $\{v_1,v_2\}$ is independent. $\square$</p>` },
    { id: "sym-orth", topic: "spectral", title: "Symmetric matrices: eigenvectors for different eigenvalues are orthogonal", stmt: "If $A = A^T$, $Au = \\lambda u$, $Av = \\mu v$ and $\\lambda\\neq\\mu$, then $u\\perp v$.", concl: /⊥|orthogonal|=0/,
      rubric: [
        { label: "Computes $\\lambda\\langle u,v\\rangle = \\langle Au,v\\rangle$", det: { c: [re("λ<u,v>=<au,v>"), re("<au,v>=λ<u,v>"), re("<λu,v>")] }, tip: "" },
        { label: "Moves $A$ across using $A^T = A$", det: { c: [re("<au,v>=<u,a\\^?tv>"), re("<u,a\\^tv>"), re("\\(au\\)\\^tv=u\\^ta\\^tv"), re("u\\^ta\\^t")], w: [/symmetric/] }, tip: "$\\langle Au,v\\rangle = (Au)^Tv = u^TA^Tv = u^TAv = \\langle u,Av\\rangle$." },
        { label: "Gets $\\mu\\langle u,v\\rangle$ on the other side", det: { c: [re("<u,av>=μ<u,v>"), re("μ<u,v>")] }, tip: "" },
        { label: "Concludes $(\\lambda-\\mu)\\langle u,v\\rangle = 0\\Rightarrow\\langle u,v\\rangle = 0$", det: { c: [re("\\(λ-μ\\)<u,v>=0"), re("<u,v>=0")] }, tip: "Use $\\lambda\\neq\\mu$." },
        { label: "Valid reasoning throughout", self: true, tip: "" },
      ],
      model: H`<p>$\lambda\langle u,v\rangle = \langle Au,v\rangle = (Au)^Tv = u^TA^Tv = u^TAv = \langle u,Av\rangle = \mu\langle u,v\rangle$. Hence $(\lambda-\mu)\langle u,v\rangle = 0$, and since $\lambda\neq\mu$, $\langle u,v\rangle = 0$. $\square$</p>` },
    { id: "comp-inj", topic: "functions", title: "g∘f injective ⇒ f injective", stmt: "If $g\\circ f$ is injective then $f$ is injective.", concl: /injective|=x/,
      rubric: [
        { label: "Starts with $f(x_1) = f(x_2)$", det: { c: [re("f\\(x_?1\\)=f\\(x_?2\\)"), re("f\\(a\\)=f\\(b\\)"), re("f\\(x\\)=f\\(y\\)")] }, tip: "Injectivity proofs start from equal outputs." },
        { label: "Applies $g$ to both sides", det: { c: [re("g\\(f\\(x_?1\\)\\)=g\\(f\\(x_?2\\)\\)"), re("\\(g∘f\\)\\(x_?1\\)=\\(g∘f\\)\\(x_?2\\)"), re("g\\(f\\(a\\)\\)=g\\(f\\(b\\)\\)"), re("g\\(f\\(x\\)\\)=g\\(f\\(y\\)\\)")], w: [/apply(ing)? g/] }, tip: "" },
        { label: "Uses injectivity of $g\\circ f$ to get $x_1 = x_2$", det: { c: [re("x_?1=x_?2"), /a=b/, /x=y/] }, tip: "" },
        { label: "Valid reasoning throughout", self: true, tip: "" },
      ],
      model: H`<p>Let $f(x_1) = f(x_2)$. Applying $g$: $(g\circ f)(x_1) = (g\circ f)(x_2)$. Since $g\circ f$ is injective, $x_1 = x_2$. Hence $f$ is injective. $\square$</p>` },
    { id: "inv-lin", topic: "isomorphisms", title: "The inverse of a bijective linear map is linear", stmt: "If $T:V\\to W$ is linear and bijective then $T^{-1}$ is linear.", concl: /linear/,
      rubric: [
        { label: "Takes $w_1,w_2\\in W$ and writes $w_i = T(v_i)$ (surjectivity)", det: { c: [re("w_?(1|i)=t\\(v_?(1|i)\\)"), re("v_?(1|i)=t\\^?-1\\(w_?(1|i)\\)"), re("t\\^-1\\(w_?(1|i)\\)=v_?(1|i)"), re("t\\(v_?(1|i)\\)=w_?(1|i)")] }, tip: "" },
        { label: "Uses linearity: $T(\\alpha v_1+\\beta v_2) = \\alpha w_1+\\beta w_2$", det: { c: [re("t\\(" + S + "v_?1\\+" + S + "v_?2\\)=" + S + "w_?1\\+" + S + "w_?2")] }, tip: "" },
        { label: "Applies $T^{-1}$ to conclude $T^{-1}(\\alpha w_1+\\beta w_2) = \\alpha T^{-1}(w_1)+\\beta T^{-1}(w_2)$", det: { c: [re("t\\^-1\\(" + S + "w_?1\\+" + S + "w_?2\\)=")] }, tip: "" },
        { label: "Valid reasoning throughout", self: true, tip: "" },
      ],
      model: H`<p>Let $w_1,w_2\in W$, $\alpha,\beta\in\FF$, and put $v_i = T^{-1}(w_i)$, so $T(v_i) = w_i$. By linearity $T(\alpha v_1+\beta v_2) = \alpha w_1+\beta w_2$. Applying $T^{-1}$: $T^{-1}(\alpha w_1+\beta w_2) = \alpha v_1+\beta v_2 = \alpha T^{-1}(w_1)+\beta T^{-1}(w_2)$. $\square$</p>` },
  ];
  LA.PROOF_TASKS = TASKS;
  const TMPL = { "ker-sub": "Kernel / range is a subspace", "ran-sub": "Kernel / range is a subspace", "perp-sub": "Subspace", "cap-sub": "Subspace", "orth-indep": "Orthogonal ⇒ independent", "inj-ker": "Injective via the kernel" };
  const tmplFor = (id) => (LA.PROOF_TEMPLATES || []).find((x) => x[0] === TMPL[id]);

  /* ---------------- examiner ---------------- */
  LA.examineProof = function (task, text) {
    const N = normProof(text);
    const items = task.rubric.map((it) => ({ label: it.label, tip: it.tip, self: !!it.self, found: it.self ? null : hit(it.det, N) }));
    const auto = items.filter((x) => !x.self), found = auto.filter((x) => x.found).length;
    const warn = [];
    const len = N.compact.length;
    const hasConcl = task.concl.test(N.compact) || task.concl.test(N.words);
    if (len < 15) warn.push({ k: "empty", m: "There is almost nothing to examine yet." });
    else if (hasConcl && found <= Math.max(1, Math.floor(auto.length / 3))) warn.push({ k: "conclusion-only", m: "This reads like a <b>conclusion without justification</b>. Markers give little or no credit for stating the result — show each step and the reason for it." });
    if (/\(\s*-?\d+\s*,\s*-?\d+/.test(text) && !/counter/.test(N.words)) warn.push({ k: "example", m: "You used <b>specific numbers</b>. An example can illustrate, but it cannot prove a statement about ALL vectors (it can only DISprove one)." });
    if (!hit(D.letUV, N) && task.rubric.some((it) => it.det === D.letUV)) warn.push({ k: "no-let", m: "No arbitrary elements were introduced ('Let $u,v\\in\\ldots$'). Without them, closure has not been shown in general." });
    if (/\b(obvious|clearly|trivial)\b/.test(N.words) && found < auto.length) warn.push({ k: "obvious", m: "Words like 'clearly' or 'obviously' don't replace a step. Make sure each claim is justified." });
    return { items, found, total: auto.length, warn };
  };
  LA.normProof = normProof;

  function renderPreview(el, text) {
    const html = esc(text).replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>");
    el.innerHTML = text.trim() ? "<p>" + html + "</p>" : '<p class="muted">Your proof will be rendered here (LaTeX between $…$).</p>';
    LA.renderMath(el);
  }

  /* ---------------- pages ---------------- */
  LA.page("/proofs/examiner", {
    title: "Proof Examiner", searchTitle: "Proof Examiner", searchDesc: "Write a proof, get a rubric-based structure check, compare with the model and self-mark",
    render() {
      const hist = LA.store.get("proofAttempts", {});
      const byCh = {}; TASKS.forEach((t) => { const ch = LA.topic(t.topic).ch; (byCh[ch] = byCh[ch] || []).push(t); });
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Advanced Proof Studio</div><h1>Proof Examiner</h1><p class="lead">Write a full proof in LaTeX or plain text. The examiner checks it against a marking rubric, flags structural problems (conclusion-only answers, proof by example, no arbitrary elements), then you compare with the model proof and mark yourself.</p>' +
        '<div class="row"><a class="btn" href="#/proofs">✍️ Proof Studio home</a><a class="btn" href="#/proofs/drills">🧩 Proof drills</a><a class="btn" href="#/counterexamples">🧪 Counterexample Lab</a></div></div></div>' +
        '<div class="box note" data-t="What the automatic examiner can and cannot do" style="margin-top:16px"><p>It is a <b>transparent checklist</b>: it searches your text for the steps a marker expects (e.g. "$T(0) = 0$", "Let $u,v\\in\\ker T$", "$T(u+v) = T(u)+T(v)$") and for common structural mistakes. It <b>cannot</b> verify that your logic is correct, and it can miss a correct step written in an unusual way. Treat it as a second pair of eyes, not as a verdict — your recorded score is your own honest self-mark against the rubric after reading the model proof.</p></div>' +
        Object.keys(byCh).sort().map((ch) => LA.sectionTitle("Chapter " + ch) + '<div class="grid grid-3">' + byCh[ch].map((t) => { const h = hist[t.id]; return '<a class="card hover" href="#/proofs/examiner/' + t.id + '"><div class="kicker">' + esc(LA.topic(t.topic).title) + '</div><h3 style="margin:.2em 0">' + esc(t.title) + '</h3><p class="small muted" style="margin:0">' + t.stmt + "</p>" + (h ? '<p class="small" style="margin:.5em 0 0">Best self-mark: <b>' + h.best + "/" + h.total + "</b> · " + h.n + " attempt" + (h.n > 1 ? "s" : "") + "</p>" : "") + "</a>"; }).join("") + "</div>").join("") + "</div>";
    },
  });

  LA.page("/proofs/examiner/:id", {
    title: (p) => { const t = TASKS.find((x) => x.id === p.id); return t ? "Prove: " + t.title : "Proof Examiner"; },
    render(params) {
      const t = TASKS.find((x) => x.id === params.id);
      if (!t) return '<div class="page"><div class="card">Unknown proof task. <a href="#/proofs/examiner">All tasks</a></div></div>';
      const draft = LA.store.get("proofDraft:" + t.id, "");
      const tmpl = tmplFor(t.id);
      return '<div class="page wide"><div class="row spread"><a class="small" href="#/proofs/examiner">◂ All proof tasks</a>' + LA.masteryChip(t.topic) + "</div>" +
        '<div class="box thm" data-t="' + esc(t.title) + '" style="margin-top:10px"><p><b>Prove:</b> ' + t.stmt + "</p></div>" +
        '<div class="grid grid-2 pe-grid"><div class="card"><div class="row spread"><b>Your proof</b><span class="small muted">LaTeX between $…$ or plain text (T(u+v)=T(u)+T(v))</span></div>' +
        '<textarea id="peText" class="mono-in" rows="12" spellcheck="false" style="width:100%;margin-top:8px" placeholder="Let u, v ∈ ker T ...">' + esc(draft) + "</textarea>" +
        '<div id="peKeys"></div><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="peExam">🔎 Examine my proof</button>' + (tmpl ? '<button class="btn" id="peTmpl">Insert proof skeleton</button>' : "") + '<button class="btn btn-ghost" id="peClear">Clear</button></div></div>' +
        '<div class="card"><b>Live preview</b><div id="pePrev" class="proof-preview"></div></div></div>' +
        '<div id="peOut"></div></div>';
    },
    after(view, params) {
      const t = TASKS.find((x) => x.id === params.id); if (!t) return;
      const ta = $("#peText", view), prev = $("#pePrev", view), out = $("#peOut", view);
      $("#peKeys", view).appendChild(LA.mathKeys(view, "latex"));
      let tm; const upd = () => { clearTimeout(tm); tm = setTimeout(() => { renderPreview(prev, ta.value); LA.store.set("proofDraft:" + t.id, ta.value); }, 250); };
      ta.addEventListener("input", upd); renderPreview(prev, ta.value);
      $("#peClear", view).onclick = () => { ta.value = ""; upd(); out.innerHTML = ""; };
      const tb = $("#peTmpl", view);
      if (tb) tb.onclick = () => { const tmpl = tmplFor(t.id); const tmpEl = document.createElement("div"); tmpEl.innerHTML = tmpl[1]; ta.value = (ta.value ? ta.value + "\n\n" : "") + tmpEl.textContent.replace(/\s+/g, " ").trim(); upd(); };
      $("#peExam", view).onclick = () => {
        const R = LA.examineProof(t, ta.value);
        out.innerHTML = '<div class="grid grid-2 pe-grid" style="margin-top:16px"><div class="card"><div class="kicker">Automatic structure check (heuristic)</div><h3 style="margin:.2em 0">' + R.found + " of " + R.total + " expected steps detected</h3>" +
          (R.warn.length ? R.warn.map((w) => '<div class="box trap" data-t="' + ({ "conclusion-only": "Conclusion-only answer", example: "Proof by example?", "no-let": "No arbitrary elements", obvious: "Unjustified 'clearly'", empty: "Empty" }[w.k]) + '"><p>' + w.m + "</p></div>").join("") : "") +
          '<ul class="rubric">' + R.items.map((it) => '<li class="' + (it.self ? "self" : it.found ? "ok" : "miss") + '"><span class="ri">' + (it.self ? "?" : it.found ? "✓" : "○") + "</span><div>" + it.label + (it.self ? ' <span class="small muted">(you judge this one)</span>' : it.found ? "" : '<div class="small muted">' + (it.tip || "Not detected — if you did write it, check it is stated explicitly.") + "</div>") + "</div></li>").join("") + "</ul>" +
          '<p class="small muted">Pattern-based: ✓ means the step <i>appears</i> in your text, not that it is logically correct; ○ may also mean it is written in a form the checker doesn\'t recognise.</p></div>' +
          '<div class="card"><div class="kicker">Side by side</div><h3 style="margin:.2em 0">Model proof</h3><div class="box proof" data-t="Model proof">' + t.model + "</div>" +
          '<h3>Self-mark against the rubric</h3><p class="small muted">Tick only what your proof genuinely does. This honest self-mark is what counts towards your mastery.</p><div id="peSelf">' + t.rubric.map((it, i) => '<label class="check-item"><input type="checkbox" data-ri="' + i + '"' + (it.self ? "" : "") + "> <span>" + it.label + "</span></label>").join("") + '</div><div class="row" style="margin-top:10px"><button class="btn btn-primary" id="peSave">Save self-mark</button><span id="peScore" class="small"></span></div></div></div>';
        LA.enhance(out); LA.renderMath(out);
        $("#peSave", out).onclick = () => {
          const got = $$("[data-ri]", out).filter((c) => c.checked).length, total = t.rubric.length;
          LA.ev.record({ topic: t.topic, src: "proof", score: got / total, gen: "proof:" + t.id });
          const hist = LA.store.get("proofAttempts", {}); const h = hist[t.id] || { n: 0, best: 0, total }; h.n++; h.best = Math.max(h.best, got); h.total = total; h.last = { t: Date.now(), self: got, auto: R.found, autoTotal: R.total }; hist[t.id] = h; LA.store.set("proofAttempts", hist);
          if (got / total < 0.75) LA.mist.add({ topic: t.topic, gen: null, title: "Proof: " + t.title, msg: "Self-marked " + got + "/" + total, src: "proof" });
          LA.addXP(Math.round(15 * got / total), "Proof self-marked");
          $("#peScore", out).innerHTML = "Saved: <b>" + got + "/" + total + "</b>" + (got === total ? " — excellent. Try writing it again tomorrow from memory." : " — rewrite the missing steps, then examine again.");
        };
      };
    },
  });
})();
