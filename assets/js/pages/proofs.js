/* Proof Studio: proof-writing guide, templates, logic toolkit, interactive proof puzzles */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;
  const H = String.raw;

  const GUIDE = H`
<div class="grid grid-2">
<div class="box tip" data-t="The 8 golden rules of proof writing">
<ol>
<li><b>State the goal.</b> "We must show that …" — markers reward knowing what is to be proved.</li>
<li><b>Name arbitrary elements.</b> "Let $u,v\in V$ and $\alpha\in\R$ be arbitrary." A proof about "all" vectors must work for an unnamed, general one.</li>
<li><b>Unpack definitions.</b> Replace every key word ("in the kernel", "orthogonal", "injective") by its definition.</li>
<li><b>One step per line, each justified</b> — "(by linearity)", "(Theorem 3.2.6)", "(coincidence axiom)".</li>
<li><b>Never assume what you are proving.</b> Start from the hypotheses and move toward the conclusion.</li>
<li><b>"If and only if" = two proofs.</b> Label them (⇒) and (⇐).</li>
<li><b>Set equality = two inclusions</b> (or a chain of ⇔ that is genuinely reversible).</li>
<li><b>Finish with a sentence</b>: "Hence $T$ is injective. □"</li>
</ol></div>
<div class="box trap" data-t="Things that silently lose marks">
<ul>
<li>Proving a "for all" statement with an example.</li>
<li>Disproving with words ("because of the square") instead of numbers.</li>
<li>Writing $\Rightarrow$ between things that are not statements (e.g. "$T(u) \Rightarrow \ldots$").</li>
<li>Dividing by something that could be $0$ (e.g. $\lVert v\rVert$ when $v$ might be $0$) — treat that case separately.</li>
<li>Using the result you are asked to prove (circular reasoning).</li>
<li>Forgetting to show $0\in W$ (or $W\neq\emptyset$) in subspace proofs.</li>
<li>"Coincidence" proved in only one direction.</li>
</ul></div></div>
<div class="box beyond" data-t="Logic toolkit (makes every proof easier)">
<div class="tbl-wrap"><table class="tbl">
<tr><th>Statement</th><th>Negation (what a counterexample shows)</th></tr>
<tr><td>$\forall x,\;P(x)$</td><td>$\exists x$ with $\lnot P(x)$ — <i>one</i> counterexample suffices</td></tr>
<tr><td>$\exists x,\;P(x)$</td><td>$\forall x,\;\lnot P(x)$</td></tr>
<tr><td>$P\Rightarrow Q$</td><td>$P$ and not $Q$</td></tr>
<tr><td>$P\land Q$</td><td>$\lnot P\lor\lnot Q$</td></tr>
</table></div>
<p><b>Contrapositive</b> ($\lnot Q\Rightarrow\lnot P$) is equivalent to $P\Rightarrow Q$ — e.g. Corollary 3.2.2. <b>Converse</b> ($Q\Rightarrow P$) is a different statement — e.g. Exercise 3.3 Q1 is false while its converse is true. <b>Contradiction:</b> assume $\lnot$(goal), derive something impossible — e.g. Theorem 3.3.6 (iii)⇒(i). <b>TFAE (i)–(iii):</b> prove a cycle (i)⇒(ii)⇒(iii)⇒(i).</p>
</div>`;

  const TEMPLATES = [
    ["Subspace", H`<p><b>To show:</b> $W$ is a subspace of $V$.</p><p>(1) $0\in W$ because … . (2) Let $u,v\in W$ and $a,b\in\FF$. Then [use the defining property of $W$ for $u$ and $v$] … so $au+bv$ satisfies the defining property, i.e. $au+bv\in W$. Hence, by Theorem 2.2.3, $W$ is a subspace of $V$. $\square$</p>`],
    ["Linear transformation", H`<p>Let $\alpha,\beta\in\FF$ and $u,v\in V$. Then $T(\alpha u+\beta v) = \;[\text{substitute}]\; = \;[\text{regroup}]\; = \alpha T(u)+\beta T(v)$. Hence $T\in\Lin(V,W)$ by Theorem 3.1.3. $\square$</p>`],
    ["Not linear", H`<p>Take [specific $\alpha$ and $u$]. Then $T(\alpha u) = \ldots$ while $\alpha T(u) = \ldots$. Since these differ, $T$ is not linear. <i>(Or: $T(0) = \ldots\neq0$, contradicting Proposition 3.1.4.)</i> $\square$</p>`],
    ["Kernel / range is a subspace", H`<p>$T(0) = 0$, so $0\in\ker T$. For $u,v\in\ker T$ and scalars $a,b$: $T(au+bv) = aT(u)+bT(v) = 0$. So $au+bv\in\ker T$ and $\ker T$ is a subspace of $V$. <i>(Range: $x = T(u)$, $y = T(v)$ ⇒ $ax+by = T(au+bv)\in\Ran T$.)</i> $\square$</p>`],
    ["Injective via the kernel", H`<p>Let $v\in V$ with $T(v) = 0$. Then [solve] … so $v = 0$. Hence $\ker T = \{0\}$ and $T$ is injective by Theorem 3.2.6. $\square$</p>`],
    ["Surjective", H`<p>Let $w\in W$ be arbitrary. [Construct $v$, often by solving $T(v) = w$.] Then $T(v) = \ldots = w$. Hence $T$ is surjective. <i>(Finite dimensions: alternatively show $\Rank T = \dim W$.)</i> $\square$</p>`],
    ["Isomorphism", H`<p>$T$ is linear (…). $\ker T = \{0\}$ (…), so $T$ is injective. Since $\dim V = \dim W = n$, Rank–Nullity gives $\Rank T = n - 0 = \dim W$, so $T$ is surjective. Hence $T$ is an isomorphism and $V\cong W$. $\square$</p>`],
    ["Inner product (4 axioms)", H`<p>Let $u,v,w\in V$, $a,b\in\R$. <b>Non-negativity:</b> $\langle u,u\rangle = \ldots\ge0$. <b>Coincidence:</b> $\langle 0,0\rangle = 0$; if $\langle u,u\rangle = 0$ then … so $u = 0$. <b>Symmetry:</b> $\langle u,v\rangle = \ldots = \langle v,u\rangle$. <b>Linearity:</b> $\langle au+bv,w\rangle = \ldots = a\langle u,w\rangle+b\langle v,w\rangle$. Hence $\langle\cdot,\cdot\rangle$ is an inner product. $\square$</p>`],
    ["S⊥-type containment", H`<p>Let $u\in A$. Then [definition: $\langle u,s\rangle = 0$ for all $s\in\ldots$]. [Use hypothesis / symmetry] … so $u\in B$. Hence $A\subseteq B$. $\square$</p>`],
    ["Orthogonal ⇒ independent", H`<p>Suppose $\sum_j a_ju_j = 0$. Taking $\langle\cdot,u_i\rangle$: $\sum_j a_j\langle u_j,u_i\rangle = 0$, so $a_i\lVert u_i\rVert^2 = 0$, and $u_i\neq0$ gives $a_i = 0$ for each $i$. $\square$</p>`],
    ["Equivalence relation", H`<p><b>Reflexive:</b> let $x\in A$; … so $xRx$. <b>Symmetric:</b> let $xRy$; … so $yRx$. <b>Transitive:</b> let $xRy$ and $yRz$; … so $xRz$. Hence $R$ is an equivalence relation. $\square$</p>`],
    ["Set equality", H`<p>($\subseteq$) Let $x\in A$. … so $x\in B$. ($\supseteq$) Let $x\in B$. … so $x\in A$. Hence $A = B$. $\square$</p>`],
  ];

  function mountParsons(host) {
    const list = LA.PARSONS;
    const solved = LA.store.get("parsonsSolved", {});
    host.innerHTML = '<div class="row" style="margin-bottom:12px">' + list.map((p, i) => '<button class="chip ' + (solved[p.id] ? "lime" : "") + '" data-pi="' + i + '">' + (solved[p.id] ? "✓ " : "") + p.title + "</button>").join("") + '</div><div id="pz"></div>';
    $$("[data-pi]", host).forEach((b) => b.onclick = () => { $$("[data-pi]", host).forEach((x) => x.classList.toggle("on", x === b)); load(list[Number(b.dataset.pi)]); });
    const load = (p) => {
      const pool = LA.shuffle(p.lines.map((t) => ({ t, ok: true })).concat(p.dis.map((t) => ({ t, ok: false }))));
      const ans = [];
      const pz = $("#pz", host);
      const draw = (checked) => {
        pz.innerHTML = '<div class="card glow"><div class="kicker">' + p.ch.replace("ch", "Chapter ") + ' · proof puzzle</div><h3 style="margin:.2em 0 .5em">' + p.title + '</h3><p><b>Prove:</b> ' + p.s + '</p><p class="small muted">Click lines in the pool to add them to your proof in order; click a line in your proof to send it back. One line in the pool is a <b>decoy</b> — leave it out.</p>' +
          '<div class="parsons"><div class="parsons-col"><h4>Pool</h4>' + pool.map((x, i) => (ans.includes(i) ? "" : '<div class="pline" data-pool="' + i + '">' + x.t + "</div>")).join("") + '</div><div class="parsons-col"><h4>Your proof</h4>' + ans.map((i, k) => '<div class="pline ' + (checked ? (pool[i].ok && p.lines.indexOf(pool[i].t) === k ? "ok" : "no") : "") + '" data-ans="' + k + '"><span class="num">' + (k + 1) + "</span>" + pool[i].t + "</div>").join("") + "</div></div>" +
          '<div class="row" style="margin-top:12px"><button class="btn btn-primary" id="pzCheck">Check proof</button><button class="btn" id="pzReset">Reset</button><button class="btn btn-ghost" id="pzShow">Show answer</button></div><div id="pzMsg" style="margin-top:10px"></div></div>';
        LA.renderMath(pz);
        $$("[data-pool]", pz).forEach((el) => el.onclick = () => { ans.push(Number(el.dataset.pool)); draw(); });
        $$("[data-ans]", pz).forEach((el) => el.onclick = () => { ans.splice(Number(el.dataset.ans), 1); draw(); });
        $("#pzReset", pz).onclick = () => { ans.length = 0; draw(); };
        $("#pzShow", pz).onclick = () => { ans.length = 0; p.lines.forEach((t) => ans.push(pool.findIndex((x) => x.t === t))); draw(true); $("#pzMsg", pz).innerHTML = '<span class="muted">Here is the correct order. The decoy was: <i>' + p.dis.join(" / ") + "</i></span>"; LA.renderMath($("#pzMsg", pz)); };
        $("#pzCheck", pz).onclick = () => {
          const correct = ans.length === p.lines.length && ans.every((i, k) => pool[i].ok && pool[i].t === p.lines[k]);
          draw(true);
          const msg = $("#pzMsg", pz);
          if (correct) {
            msg.innerHTML = '<b class="okc">✓ Perfect proof!</b> Every step is in a valid order.';
            if (!solved[p.id]) { solved[p.id] = Date.now(); LA.store.set("parsonsSolved", solved); LA.state.stats.parsons = (LA.state.stats.parsons || 0) + 1; LA.save(); LA.addXP(20, "Proof puzzle solved"); LA.confetti({ particleCount: 100 }); }
          } else {
            const hasDecoy = ans.some((i) => !pool[i].ok);
            msg.innerHTML = '<b class="err">Not yet.</b> ' + (hasDecoy ? "Your proof contains the decoy line — find the step that doesn't follow logically. " : "") + (ans.length < p.lines.length ? "Some steps are missing. " : "") + "Green lines are in the right position.";
          }
        };
      };
      draw();
    };
    load(list[0]); $$("[data-pi]", host)[0].classList.add("on");
  }

  LA.page("/proofs", {
    title: "Proof Studio", searchTitle: "Proof Studio", searchDesc: "Proof writing rules, templates and proof puzzles",
    render() {
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Coursework weapon</div><h1>Proof Studio</h1><p class="lead">Proofs are just definitions, arranged in a careful order. Learn the rules, copy the templates, then rebuild the important proofs yourself in the puzzles below.</p></div></div>' +
        LA.sectionTitle("1 · How to write a proof that gets full marks") + GUIDE +
        LA.sectionTitle("2 · Proof templates (fill in the blanks)") + '<div class="grid grid-2">' + TEMPLATES.map((t) => '<div class="box template" data-t="' + LA.esc(t[0]) + '">' + t[1] + "</div>").join("") + "</div>" +
        LA.sectionTitle("3 · Proof puzzles") + '<p class="muted">Rebuild each proof by putting its lines in the correct order (and leaving out the decoy). Puzzles cover the proofs most likely to appear on your coursework.</p><div id="parsonsHost"></div>' +
        LA.sectionTitle("4 · The proofs to know cold for Chapters 3 & 4") +
        '<div class="tbl-wrap"><table class="tbl"><tr><th>Result</th><th>Where</th></tr>' + [
          ["$T(0) = 0$", 3, "3.1.4 · Linear maps send 0 to 0", "Prop 3.1.4"], ["One-line linearity test", 3, "3.1.3 · The one-line linearity test", "Thm 3.1.3"], ["Kernel and range are subspaces", 3, "3.2.4 · Kernel and range are subspaces", "Thm 3.2.4"], ["$\\ker T = \\{0\\}\\iff$ injective", 3, "3.2.6 · The kernel test for injectivity", "Thm 3.2.6"], ["Inverse map is linear", 3, "3.3.4 · The inverse of a bijective linear map is linear", "Thm 3.3.4"], ["Non-singular ⇔ injective ⇔ preserves independence", 3, "3.3.6 · Non-singular ⇔ injective ⇔ preserves independence", "Thm 3.3.6"], ["$V\\cong\\FF^n$", 3, "3.3.8 · Every n-dimensional space is a copy of 𝔽ⁿ", "Thm 3.3.8"], ["Similarity is an equivalence relation", 3, "3.4.8 · Similarity is an equivalence relation", "Thm 3.4.8"], ["Properties of $S^\\perp$", 4, "4.2.5 · Properties of orthogonal complements ★", "Prop 4.2.5"], ["Pythagoras", 4, "4.2.6 · Pythagorean Theorem", "Prop 4.2.6"], ["Cauchy–Schwarz", 4, "4.2.7 · Cauchy–Schwarz Inequality ★", "Thm 4.2.7"], ["Triangle inequality", 4, "4.2.8 · Triangle Inequality", "Thm 4.2.8"], ["Orthogonal ⇒ independent", 4, "4.2.11 · Orthogonal sets are independent", "Thm 4.2.11"],
        ].map((r) => '<tr><td><a href="#/ch/' + r[1] + '?go=b-' + LA.slug(r[2]) + '">' + r[0] + "</a></td><td>" + r[3] + "</td></tr>").join("") + "</table></div></div>";
    },
    after(view) { mountParsons($("#parsonsHost", view)); },
  });
})();
