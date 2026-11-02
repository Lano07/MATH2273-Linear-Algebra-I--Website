/* Change-of-Basis Lab: see a vector in two coordinate systems, the transition matrix, and how an operator's
   matrix changes ([T]_B = P^{-1} A P). Exact arithmetic for every displayed number. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;
  const { Frac } = LA;
  const F = (s) => { try { return Frac.parse(String(s).trim() || "0"); } catch (e) { return null; } };
  const mt = (A) => LA.M.tex(A), vt = (v) => "(" + v.map((x) => x.tex()).join(", ") + ")";
  const PRE = [["Standard basis", ["1", "0", "0", "1"]], ["Rotated 45° (unnormalised)", ["1", "1", "-1", "1"]], ["Skewed", ["2", "1", "1", "1"]], ["Eigenbasis of [[3,1],[1,3]]", ["1", "1", "1", "-1"]], ["Eigenbasis of [[4,1],[2,3]]", ["1", "1", "-1", "2"]], ["Long & short", ["3", "0", "0", "1/2"]]];

  LA.page("/labs/change-of-basis", {
    title: "Change-of-Basis Lab", lab: "cob", searchTitle: "Lab · Change of Basis", searchDesc: "Coordinates in two bases, transition matrices, and [T]_B = P⁻¹AP",
    render() {
      return '<div class="page wide"><div class="row spread"><div><div class="kicker">Interactive lab · Chapter 3 (§3.4) &amp; Chapter 7</div><h1 style="margin:.1em 0 .3em">Change-of-Basis Lab</h1></div><a class="btn btn-sm" href="#/learn/change-of-basis">📖 Topic: change of basis</a></div>' +
        '<p class="muted">The same arrow $v$ has different coordinates in different bases. <b>Drag</b> the tips of $b_1$ (cyan), $b_2$ (pink) and $v$ (lime) — or type exact values. The violet grid is the $\\B$-grid: count along it to read $[v]_{\\B}$.</p>' +
        '<div class="tool-grid"><div class="card"><div class="kicker">Basis $\\B = \\{b_1,b_2\\}$</div><div class="row" style="gap:6px;margin:8px 0">$b_1 =$ (<input id="b11" class="mono-in sm-in">, <input id="b12" class="mono-in sm-in">) &nbsp; $b_2 =$ (<input id="b21" class="mono-in sm-in">, <input id="b22" class="mono-in sm-in">)</div>' +
        '<div class="kicker">Vector $v$ (standard coordinates)</div><div class="row" style="gap:6px;margin:8px 0">$v =$ (<input id="v1" class="mono-in sm-in">, <input id="v2" class="mono-in sm-in">)</div>' +
        '<div class="kicker">Operator $T(x) = Ax$ (optional)</div><div class="matrix-input" style="grid-template-columns:repeat(2,auto);margin:8px 0"><input id="a11" value="3"><input id="a12" value="1"><input id="a21" value="1"><input id="a22" value="3"></div><div class="row"><button class="btn btn-sm" id="useEig">Use eigenvectors of $A$ as $\\B$</button><label class="toggle"><input type="checkbox" id="showT"> show $T(v)$</label></div>' +
        '<div class="kicker" style="margin-top:12px">Presets</div><div class="presets">' + PRE.map((p, i) => '<button class="chip" data-p="' + i + '">' + p[0] + "</button>").join("") + '</div><div class="out" id="cobOut"></div></div>' +
        '<div><canvas class="viz" id="cobCv" aria-label="Standard grid and B-grid with basis vectors and v"></canvas><div class="legend"><span><i style="background:#22d3ee"></i>$b_1$</span><span><i style="background:#f472b6"></i>$b_2$</span><span><i style="background:#a3e635"></i>$v$</span><span><i style="background:#a78bfa"></i>$\\B$-grid</span><span><i style="background:#fbbf24"></i>$T(v)$</span></div></div></div></div>';
    },
    after(view) {
      const ids = ["b11", "b12", "b21", "b22", "v1", "v2"], ins = {}; ids.forEach((k) => { ins[k] = $("#" + k, view); });
      const st = { b1: [1, 1], b2: [-1, 1], v: [2, 3] };
      const put = () => { ins.b11.value = LA.nice(st.b1[0]); ins.b12.value = LA.nice(st.b1[1]); ins.b21.value = LA.nice(st.b2[0]); ins.b22.value = LA.nice(st.b2[1]); ins.v1.value = LA.nice(st.v[0]); ins.v2.value = LA.nice(st.v[1]); };
      const cv = $("#cobCv", view), P = LA.plane(cv, { range: 5 });
      const exact = () => { const g = (k) => F(ins[k].value); const vals = ids.map(g); return vals.some((x) => x === null) ? null : { b1: [vals[0], vals[1]], b2: [vals[2], vals[3]], v: [vals[4], vals[5]] }; };
      const Aex = () => { const v = ["a11", "a12", "a21", "a22"].map((k) => F($("#" + k, view).value)); return v.some((x) => x === null) ? null : [[v[0], v[1]], [v[2], v[3]]]; };
      function draw() {
        P.clear(); P.grid([1, 0], [0, 1], P.css("--border"), 1); P.axes();
        P.grid(st.b1, st.b2, "rgba(167,139,250,.55)", 1.2);
        const E = exact(); const det = st.b1[0] * st.b2[1] - st.b1[1] * st.b2[0];
        if (Math.abs(det) > 1e-9) { const c1 = (st.v[0] * st.b2[1] - st.v[1] * st.b2[0]) / det, c2 = (st.b1[0] * st.v[1] - st.b1[1] * st.v[0]) / det; const p1 = [c1 * st.b1[0], c1 * st.b1[1]]; P.seg(0, 0, p1[0], p1[1], "rgba(34,211,238,.8)", 2, [6, 5]); P.seg(p1[0], p1[1], st.v[0], st.v[1], "rgba(244,114,182,.8)", 2, [6, 5]); }
        if ($("#showT", view).checked) { const A = Aex(); if (A) { const n = A.map((r) => r.map((x) => x.toNumber())); P.arrow(n[0][0] * st.v[0] + n[0][1] * st.v[1], n[1][0] * st.v[0] + n[1][1] * st.v[1], "#fbbf24", 3); } }
        P.arrow(st.b1[0], st.b1[1], "#22d3ee", 4); P.arrow(st.b2[0], st.b2[1], "#f472b6", 4); P.arrow(st.v[0], st.v[1], "#a3e635", 3.5);
        P.text("b₁", st.b1[0], st.b1[1], "#22d3ee"); P.text("b₂", st.b2[0], st.b2[1], "#f472b6"); P.text("v", st.v[0], st.v[1], "#a3e635");
        info(E);
      }
      function info(E) {
        const out = $("#cobOut", view);
        if (!E) { out.innerHTML = '<p class="err">Enter numbers or fractions in every box.</p>'; return; }
        const Pm = [[E.b1[0], E.b2[0]], [E.b1[1], E.b2[1]]], d = LA.alg.det(Pm);
        if (d.isZero()) { out.innerHTML = '<div class="box trap" data-t="Not a basis"><p>$\\det P = 0$: $b_1$ and $b_2$ are parallel, so they don\'t span $\\R^2$ and coordinates are not defined.</p></div>'; LA.enhance(out); LA.renderMath(out); return; }
        const Pi = LA.alg.inverse(Pm), c = LA.M.mulVec(Pi, E.v);
        let html = "$$P = (b_1\\;b_2) = " + mt(Pm) + ",\\quad \\det P = " + d.tex() + ",\\quad P^{-1} = " + mt(Pi) + "$$" +
          "$$[v]_{\\B} = P^{-1}v = " + mt(Pi) + LA.V.tex(E.v, { col: true }) + " = " + LA.V.tex(c, { col: true }) + "$$" +
          "<p>Check: $" + c[0].tex() + "\\,b_1 + " + (c[1].sign() < 0 ? "(" + c[1].tex() + ")" : c[1].tex()) + "\\,b_2 = " + vt(E.v) + "$ ✓</p>";
        const A = Aex();
        if (A) {
          const TB = LA.M.mul(Pi, LA.M.mul(A, Pm)), diag = TB[0][1].isZero() && TB[1][0].isZero();
          html += "<p><b>Operator:</b> $[T]_{\\B} = P^{-1}AP = " + mt(TB) + "$" + (diag ? ' — <span class="okc">diagonal: $\\B$ is an eigenbasis of $A$</span>' : "") + ". Trace $" + A[0][0].add(A[1][1]).tex() + "$ and determinant $" + LA.alg.det(A).tex() + "$ are unchanged (similar matrices).</p>";
          if ($("#showT", view).checked) { const Tv = LA.M.mulVec(A, E.v), TvB = LA.M.mulVec(TB, c); html += "<p>$T(v) = " + vt(Tv) + "$ and $[T(v)]_{\\B} = [T]_{\\B}[v]_{\\B} = " + vt(TvB) + "$.</p>"; }
        }
        out.innerHTML = '<div class="box ex" data-t="Coordinates">' + html + "</div>";
        LA.enhance(out); LA.renderMath(out);
      }
      ids.forEach((k) => ins[k].addEventListener("input", () => { const E = exact(); if (E) { st.b1 = E.b1.map((x) => x.toNumber()); st.b2 = E.b2.map((x) => x.toNumber()); st.v = E.v.map((x) => x.toNumber()); } draw(); }));
      ["a11", "a12", "a21", "a22"].forEach((k) => $("#" + k, view).addEventListener("input", draw));
      $("#showT", view).addEventListener("change", draw);
      $$("[data-p]", view).forEach((b) => b.addEventListener("click", () => { const p = PRE[+b.dataset.p][1].map((s) => F(s).toNumber()); st.b1 = [p[0], p[1]]; st.b2 = [p[2], p[3]]; put(); PRE[+b.dataset.p][1].forEach((s, i) => { ins[ids[i]].value = s; }); draw(); }));
      $("#useEig", view).onclick = () => {
        const A = Aex(); if (!A) return;
        const cp = LA.alg.charPoly(A), rr = LA.alg.rationalRoots(cp);
        if (rr.roots.length < 2 || rr.roots[0].eq(rr.roots[1])) { LA.toast("No rational eigenbasis", "This A needs irrational or complex eigenvalues (or is a repeated-eigenvalue case) — try the Eigen Lab."); return; }
        const vecs = rr.roots.map((l) => LA.alg.nullspace(LA.M.sub(A, LA.M.scale(l, LA.M.eye(2)))).basis[0]).map((v) => LA.V.integerize(v, true).vec);
        st.b1 = vecs[0].map((x) => x.toNumber()); st.b2 = vecs[1].map((x) => x.toNumber()); put(); draw();
        LA.toast("Eigenbasis loaded", "Now [T]_B is diagonal with the eigenvalues " + rr.roots.map((x) => x.toString()).join(", ") + ".");
      };
      P.draggable(() => [{ x: st.b1[0], y: st.b1[1], set: (x, y) => { st.b1 = [x, y]; } }, { x: st.b2[0], y: st.b2[1], set: (x, y) => { st.b2 = [x, y]; } }, { x: st.v[0], y: st.v[1], set: (x, y) => { st.v = [x, y]; } }], () => { put(); draw(); }, () => 0.5);
      LA.setResize(() => { P.resize(); draw(); });
      put(); draw();
    },
  });
})();
