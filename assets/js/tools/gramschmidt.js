/* Gram–Schmidt Machine + Inner Product Lab (exact arithmetic, step-by-step) */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc, Frac, Poly, V, M } = LA;
  const N = LA.num, ALG = LA.alg, FMT = LA.fmt, P = LA.parse;

  /* ---------- polynomial inner products from a tiny DSL ----------
     terms separated by +/-, each: [coef] int'''(a,b)  or  [coef] at''(t)  */
  LA.parseIP = function (src) {
    const terms = []; const re = /([+-]?)\s*([\d./]*)\s*\*?\s*(int|at)('*)\s*\(([^)]*)\)/g; let m, used = "";
    while ((m = re.exec(src))) {
      used += m[0];
      let c = m[2] ? Frac.parse(m[2]) : Frac.ONE; if (m[1] === "-") c = c.neg();
      const k = m[4].length; const args = m[5].split(",").map((s) => Frac.of(P.evalConst(s.trim())));
      if (m[3] === "int") { if (args.length !== 2) throw new Error("int needs two limits: int(a,b)"); terms.push({ c, type: "int", k, a: args[0], b: args[1] }); }
      else { if (args.length !== 1) throw new Error("at needs one point: at(t)"); terms.push({ c, type: "at", k, t: args[0] }); }
    }
    if (!terms.length) throw new Error('Could not read the inner product. Examples: "int(0,1)", "int\'\'(0,1) + 2 at(0) + at(1)"');
    if (src.replace(/\s/g, "").length > used.replace(/\s/g, "").length + 2) throw new Error("Part of the inner product was not understood. Use terms like 2 int'(0,1) or 3 at(0).");
    return terms;
  };
  const dk = (p, k) => { for (let i = 0; i < k; i++) p = p.deriv(); return p; };
  LA.polyIP = (terms) => (p, q) => terms.reduce((s, t) => {
    const P1 = dk(p, t.k), Q1 = dk(q, t.k);
    const v = t.type === "int" ? P1.mul(Q1).integrate(t.a, t.b) : P1.at(t.t).mul(Q1.at(t.t));
    return s.add(t.c.mul(v));
  }, Frac.ZERO);
  LA.ipTex = function (terms) {
    const pr = (k) => "'".repeat(k);
    return terms.map((t, i) => {
      const neg = t.c.sign() < 0, a = t.c.abs(); const cf = a.isOne() ? "" : a.tex();
      const body = t.type === "int" ? "\\int_{" + t.a.tex() + "}^{" + t.b.tex() + "}p" + pr(t.k) + "(x)q" + pr(t.k) + "(x)\\,dx" : "p" + pr(t.k) + "(" + t.t.tex() + ")q" + pr(t.k) + "(" + t.t.tex() + ")";
      return (i === 0 ? (neg ? "-" : "") : neg ? " - " : " + ") + cf + body;
    }).join("");
  };
  function intPoly(p) { // integer-coefficient positive multiple
    let L = 1n; p.c.forEach((x) => { L = N.blcm(L, x.d); }); let g = 0n; const ints = p.c.map((x) => x.n * (L / x.d)); ints.forEach((k) => { g = N.bgcd(g, k); });
    if (g === 0n) return { p, f: Frac.ONE };
    // keep the sign: Gram–Schmidt vectors must only be scaled by POSITIVE factors
    return { p: new Poly(ints.map((k) => new Frac(k / g, 1n))), f: new Frac(L, g) };
  }
  function normTex(n2) { // tex of 1/sqrt(n2)  (n2 Frac > 0)
    if (n2.isInt()) { const { s, r } = N.squareSplit(n2.n); if (r === 1n) return s === 1n ? "" : "\\frac{1}{" + s + "}"; return "\\frac{1}{" + (s === 1n ? "" : s) + "\\sqrt{" + r + "}}"; }
    return "\\sqrt{\\tfrac{" + n2.d + "}{" + n2.n + "}}";
  }

  /* ---------- core GS with step log ---------- */
  function runGS(vs, ip, kind, shape) {
    const show = (x) => (kind === "poly" ? x.tex() : shape ? M.tex(chunk(x, shape)) : V.tex(x));
    const add = (x, y) => (kind === "poly" ? x.add(y) : V.add(x, y));
    const scale = (c, x) => (kind === "poly" ? x.scale(c) : V.scale(c, x));
    const isZero = (x) => (kind === "poly" ? x.isZero() : V.isZero(x));
    const integ = (x) => (kind === "poly" ? intPoly(x) : V.integerize(x, true));
    const us = [], log = []; const out = [];
    vs.forEach((v, k) => {
      let u = v; const parts = [];
      us.forEach((uj, j) => { const num = ip(v, uj.u), den = uj.n2; const c = num.div(den); parts.push({ j, num, den, c }); u = add(u, scale(c.neg(), uj.u)); });
      const n2 = isZero(u) ? Frac.ZERO : ip(u, u);
      const step = { k, v, parts, u, n2 };
      if (isZero(u)) { step.dep = true; log.push(step); return; }
      if (n2.sign() <= 0) { step.bad = true; log.push(step); throw Object.assign(new Error("not an inner product"), { step, log, show }); }
      const it = integ(u); const tilde = kind === "poly" ? it.p : it.vec; const f = kind === "poly" ? it.f : it.factor; const n2t = ip(tilde, tilde);
      Object.assign(step, { tilde, f, n2t, checks: us.map((uj) => ip(u, uj.u)) });
      us.push({ u, n2 }); out.push({ tilde, n2t }); log.push(step);
    });
    return { log, out, show };
  }
  LA.runGS = runGS; LA.gsHTML = (res) => gsHTML(res, (a, b) => "\\langle " + a + "," + b + "\\rangle");
  function chunk(vec, shape) { const [r, c] = shape; return Array.from({ length: r }, (_, i) => vec.slice(i * c, i * c + c)); }

  function gsHTML(res, ipName) {
    const { log, show } = res; let h = "";
    log.forEach((s) => {
      const k = s.k + 1;
      h += '<div class="box ex" data-t="Step ' + k + (k === 1 ? " · start" : k === 2 ? " · subtract the component along $u_1$" : " · subtract the components along $u_1,\\dots,u_{" + (k - 1) + "}$") + '">';
      if (s.k === 0) h += "<p>$u_1 = v_1 = " + show(s.v) + "$</p>";
      else {
        h += "<p>$u_" + k + " = v_" + k + " - " + s.parts.map((pp) => "\\dfrac{" + ipName("v_" + k, "u_" + (pp.j + 1)) + "}{" + ipName("u_" + (pp.j + 1), "u_" + (pp.j + 1)) + "}u_" + (pp.j + 1)).join(" - ") + "$, where</p>";
        h += "<p>" + s.parts.map((pp) => "$" + ipName("v_" + k, "u_" + (pp.j + 1)) + " = " + pp.num.tex() + "$, $\\;" + ipName("u_" + (pp.j + 1), "u_" + (pp.j + 1)) + " = " + pp.den.tex() + "$ ⇒ coefficient $" + pp.c.tex() + "$").join("<br>") + "</p>";
        h += "$$u_" + k + " = " + show(s.v) + s.parts.map((pp) => FMT.signedTerm(pp.c.neg(), "u_" + (pp.j + 1), false)).join("") + " = " + show(s.u) + "$$";
      }
      if (s.dep) { h += '<p class="err">$u_' + k + " = 0$: $v_" + k + "$ lies in the span of the previous vectors (the set is dependent), so it adds no new direction and is skipped.</p></div>"; return; }
      if (s.checks && s.checks.length) h += '<p class="small okc">Check: ' + s.checks.map((c, j) => "$" + ipName("u_" + k, "u_" + (j + 1)) + " = " + c.tex() + "$").join(", ") + " ✔</p>";
      const scaled = !s.f.isOne();
      h += "<p>" + (scaled ? "Scale to clear fractions: $\\tilde u_" + k + " = " + s.f.tex() + "\\,u_" + k + " = " + show(s.tilde) + "$ (same direction). " : "") + "$\\lVert " + (scaled ? "\\tilde u" : "u") + "_" + k + "\\rVert^2 = " + s.n2t.tex() + "$, so</p>";
      h += "$$w_" + k + " = \\frac{" + (scaled ? "\\tilde u" : "u") + "_" + k + "}{\\lVert " + (scaled ? "\\tilde u" : "u") + "_" + k + "\\rVert} = " + normTex(s.n2t) + (/^\(/.test(show(s.tilde)) || /pmatrix/.test(show(s.tilde)) ? "" : "\\big(") + show(s.tilde) + (/^\(/.test(show(s.tilde)) || /pmatrix/.test(show(s.tilde)) ? "" : "\\big)") + "$$</div>";
    });
    const good = res.out;
    h += '<div class="box thm" data-t="Result · orthonormal basis of span(S)">$$\\Big\\{' + good.map((o) => normTex(o.n2t) + (/^\(/.test(show(o.tilde)) || /pmatrix/.test(show(o.tilde)) ? "" : "\\big(") + show(o.tilde) + (/^\(/.test(show(o.tilde)) || /pmatrix/.test(show(o.tilde)) ? "" : "\\big)")).join(",\\;\\; ") + "\\Big\\}$$<p class=\"small muted\">dim span(S) = " + good.length + ".</p></div>";
    return h;
  }

  const GS_EX = [
    { name: "Ex 4.2.15(i)", mode: "rn", vecs: "(1,5,2); (3,2,2)", w: "" },
    { name: "Ex 4.2.15(ii)", mode: "rn", vecs: "(1,0,0); (1,1,2); (0,1,1)", w: "" },
    { name: "Exercise 4 Q3(i) · ℝ⁴", mode: "rn", vecs: "(1,0,0,1); (0,1,1,0); (-1,1,0,1)", w: "" },
    { name: "Handout Ex 3 · ℝ⁴", mode: "rn", vecs: "(1,1,0,1); (0,1,-1,0); (0,0,0,1)", w: "" },
    { name: "Ex 4.2.15(iv) · matrices (weights)", mode: "rn", vecs: "(1,0,2,-1,0,0); (0,1,1,2,0,-2)", w: "1,2,1,3,1,1", shape: "2x3" },
    { name: "Ex 4.2.15(iii) · ℙ₃", mode: "poly", vecs: "1 - x^2; x + x^3", ip: "int''(0,1) + 2 at(0) + at(1)" },
    { name: "Exercise 4 Q4(a)", mode: "poly", vecs: "2 - 5x; 1 - x^2", ip: "int'(-1,1) + 3 at(0)" },
    { name: "Exercise 4 Q4(b)", mode: "poly", vecs: "2 - 5x; 1 - x^2", ip: "int(0,1)" },
    { name: "Exercise 4 Q4(c)", mode: "poly", vecs: "2 - 5x; 1 - x^2", ip: "2 int(0,1) + 5 int'(0,1)" },
    { name: "Legendre {1, x, x²}", mode: "poly", vecs: "1; x; x^2", ip: "int(-1,1)" },
  ];
  function parseVecs(src) { return src.split(/;|\n/).map((s) => s.trim()).filter(Boolean).map((s) => P.splitTuple(s.startsWith("(") ? s : "(" + s + ")").map((x) => Frac.of(P.evalConst(x)))); }

  LA.page("/labs/gram-schmidt", {
    title: "Gram–Schmidt Machine", lab: "gs", searchTitle: "Lab · Gram–Schmidt Machine", searchDesc: "Exact step-by-step Gram–Schmidt for vectors, matrices and polynomials",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 4.2.14</div><h1 style="margin:.1em 0 .3em">Gram–Schmidt Machine</h1><p class="muted">Exact, step-by-step Gram–Schmidt using the fraction-friendly formula $u_k = v_k - \\sum_{j\\lt k}\\frac{\\langle v_k,u_j\\rangle}{\\langle u_j,u_j\\rangle}u_j$, with orthogonality checks after every step. Works for $\\R^n$ (optionally weighted — use this for matrix spaces) and for polynomials with <b>any</b> inner product made of integrals and point evaluations.</p>' +
        '<div class="card"><div class="presets" style="margin-bottom:10px">' + GS_EX.map((e, i) => '<button class="chip" data-x="' + i + '">' + e.name + "</button>").join("") + "</div>" +
        '<div class="row"><label class="toggle"><input type="radio" name="gsm" value="rn" checked> Vectors in ℝⁿ</label><label class="toggle"><input type="radio" name="gsm" value="poly"> Polynomials</label></div>' +
        '<label class="field" style="margin-top:10px">Vectors / polynomials (separate with ;)<input type="text" id="gV" class="mono-in"></label>' +
        '<div class="grid grid-2" id="rnRow" style="margin-top:10px"><label class="field">Weights (blank = dot product), e.g. 2,3 for ⟨u,v⟩ = 2u₁v₁ + 3u₂v₂<input type="text" id="gW" class="mono-in"></label><label class="field">Display as matrices (optional), e.g. 2x3<input type="text" id="gS" class="mono-in" placeholder=""></label></div>' +
        '<label class="field hidden" id="ipRow" style="margin-top:10px">Inner product ⟨p,q⟩ — terms like int(a,b), int\'(a,b), at(t), at\'(t) with coefficients<input type="text" id="gIP" class="mono-in" value="int(0,1)"></label>' +
        '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Run Gram–Schmidt</button></div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const mode = () => $$("input[name=gsm]", view).find((r) => r.checked).value;
      const sync = () => { const m = mode(); $("#rnRow", view).classList.toggle("hidden", m !== "rn"); $("#ipRow", view).classList.toggle("hidden", m !== "poly"); };
      $$("input[name=gsm]", view).forEach((r) => r.onchange = sync);
      const load = (e) => { $$("input[name=gsm]", view).forEach((r) => { r.checked = r.value === e.mode; }); $("#gV", view).value = e.vecs; $("#gW", view).value = e.w || ""; $("#gS", view).value = e.shape || ""; if (e.ip) $("#gIP", view).value = e.ip; sync(); };
      const run = () => {
        const out = $("#out", view);
        try {
          let res, title;
          if (mode() === "rn") {
            const vs = parseVecs($("#gV", view).value); if (!vs.length) throw new Error("Enter at least one vector.");
            const n = vs[0].length; if (vs.some((v) => v.length !== n)) throw new Error("All vectors must have the same number of entries.");
            const wsrc = $("#gW", view).value.trim(); const w = wsrc ? wsrc.split(",").map((s) => Frac.of(P.evalConst(s.trim()))) : null;
            if (w && w.length !== n) throw new Error("Give exactly " + n + " weights.");
            if (w && w.some((x) => x.sign() <= 0)) throw new Error("Weights must be positive, otherwise ⟨·,·⟩ is not an inner product (non-negativity/coincidence fails).");
            let shape = null; const ss = $("#gS", view).value.trim(); if (ss) { const mm = ss.match(/^(\d+)\s*[x×]\s*(\d+)$/); if (!mm || Number(mm[1]) * Number(mm[2]) !== n) throw new Error("Shape must multiply to " + n + " (e.g. 2x3)."); shape = [Number(mm[1]), Number(mm[2])]; }
            const ip = (a, b) => V.dot(a, b, w);
            res = runGS(vs, ip, "rn", shape);
            title = "$$\\langle u,v\\rangle = " + (w ? w.map((x, i) => (x.isOne() ? "" : x.tex()) + "u_{" + (i + 1) + "}v_{" + (i + 1) + "}").join("+") : "u\\cdot v") + "$$";
          } else {
            const ps = $("#gV", view).value.split(/;|\n/).map((s) => s.trim()).filter(Boolean).map(LA.parsePoly);
            const terms = LA.parseIP($("#gIP", view).value);
            res = runGS(ps, LA.polyIP(terms), "poly");
            title = "$$\\langle p,q\\rangle = " + LA.ipTex(terms) + "$$";
          }
          const ipName = (a, b) => "\\langle " + a + "," + b + "\\rangle";
          out.innerHTML = '<div class="card glow">' + title + gsHTML(res, ipName) + "</div>";
          LA.enhance(out); LA.renderMath(out); LA.stat("gs");
        } catch (e) {
          if (e.step) out.innerHTML = '<div class="card"><p class="err">⚠ Not an inner product: a non-zero vector $' + e.show(e.step.u) + "$ has $\\langle u,u\\rangle = " + e.step.n2.tex() + "\\le0$, so " + (e.step.n2.isZero() ? "the <b>coincidence</b>" : "the <b>non-negativity</b>") + " axiom fails.</p></div>";
          else out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>";
          LA.renderMath(out);
        }
      };
      $$("[data-x]", view).forEach((b) => b.onclick = () => { load(GS_EX[Number(b.dataset.x)]); run(); });
      $("#go", view).onclick = run;
      load(GS_EX[0]); run();
    },
  });

  /* ================= Inner Product Lab ================= */
  function gram(basis, ip) { return basis.map((a) => basis.map((b) => ip(a, b))); }
  function pdCheck(G) { // Sylvester; returns {pd, minors}
    const minors = []; for (let k = 1; k <= G.length; k++) minors.push(ALG.det(G.slice(0, k).map((r) => r.slice(0, k))));
    return { pd: minors.every((m) => m.sign() > 0), minors };
  }
  const IP_EX = [
    { name: "∫₀¹ pq on ℙ₁", ip: "int(0,1)", n: 1, p: "1 - 2x", q: "1 - x" },
    { name: "∫₀¹ pq on ℙ₂", ip: "int(0,1)", n: 2, p: "1 + x", q: "x^2" },
    { name: "Ex 4.2.15(iii) on ℙ₃", ip: "int''(0,1) + 2 at(0) + at(1)", n: 3, p: "1 - x^2", q: "x + x^3" },
    { name: "∫₋₁¹ p′q′ on ℙ₂ (fails!)", ip: "int'(-1,1)", n: 2, p: "x", q: "x^2" },
    { name: "p(0)q(0)+p(1)q(1) on ℙ₁", ip: "at(0) + at(1)", n: 1, p: "1 + x", q: "1 - x" },
    { name: "p(0)q(0)+p(1)q(1) on ℙ₂ (fails!)", ip: "at(0) + at(1)", n: 2, p: "1", q: "x" },
    { name: "Exercise 4 Q4(a)", ip: "int'(-1,1) + 3 at(0)", n: 2, p: "2 - 5x", q: "1 - x^2" },
  ];
  LA.page("/labs/inner", {
    title: "Inner Product Lab", lab: "inner", searchTitle: "Lab · Inner Product Lab", searchDesc: "Is it an inner product? Norms, angles, orthogonal complements of polynomials",
    render() {
      return '<div class="page"><div class="kicker">Interactive lab · Chapter 4</div><h1 style="margin:.1em 0 .3em">Inner Product Lab (polynomials)</h1><p class="muted">Build an inner product on $\\P_n$ from integrals and point evaluations. The lab decides rigorously whether it really <b>is</b> an inner product (via its Gram matrix), and computes norms, distance, angle, projection and the orthogonal complement $\\{p\\}^\\perp$.</p>' +
        '<div class="card"><div class="presets" style="margin-bottom:10px">' + IP_EX.map((e, i) => '<button class="chip" data-x="' + i + '">' + e.name + "</button>").join("") + "</div>" +
        '<div class="grid grid-2"><label class="field">Inner product terms<input type="text" id="iIP" class="mono-in"></label><label class="field">Space ℙₙ, n =<input type="number" id="iN" min="0" max="6" style="width:90px"></label></div>' +
        '<div class="grid grid-2" style="margin-top:10px"><label class="field">p<input type="text" id="iP" class="mono-in"></label><label class="field">q<input type="text" id="iQ" class="mono-in"></label></div>' +
        '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="go">Compute</button></div></div><div class="out" id="out"></div></div>';
    },
    after(view) {
      const load = (e) => { $("#iIP", view).value = e.ip; $("#iN", view).value = e.n; $("#iP", view).value = e.p; $("#iQ", view).value = e.q; };
      const run = () => {
        const out = $("#out", view);
        try {
          const terms = LA.parseIP($("#iIP", view).value); const ip = LA.polyIP(terms); const n = Number($("#iN", view).value);
          const p = LA.parsePoly($("#iP", view).value), q = LA.parsePoly($("#iQ", view).value);
          if (p.deg() > n || q.deg() > n) throw new Error("p and q must lie in ℙ" + n + ".");
          const basis = Array.from({ length: n + 1 }, (_, k) => Poly.mono(k));
          const G = gram(basis, ip); const chk = pdCheck(G);
          let h = '<div class="card glow">$$\\langle p,q\\rangle = ' + LA.ipTex(terms) + "\\quad\\text{on }\\P_{" + n + "}$$";
          h += '<div class="box ' + (chk.pd ? "tip" : "trap") + '" data-t="Is it an inner product on $\\P_{' + n + '}$?">';
          h += "<p>Gram matrix on the basis $\\{1,x,\\dots,x^{" + n + "}\\}$: $G_{ij} = \\langle x^i,x^j\\rangle$,</p>$$G = " + M.tex(G) + "$$";
          h += "<p>Leading principal minors: " + chk.minors.map((m) => "$" + m.tex() + "$").join(", ") + ".</p>";
          if (chk.pd) h += '<p><b class="okc">✓ Yes.</b> All minors are positive (Sylvester’s criterion), so $\\langle c,c\\rangle\\gt0$ for every non-zero coefficient vector: non-negativity and coincidence hold; symmetry and linearity are automatic for this kind of formula.</p>';
          else {
            const ns = ALG.nullspace(G).basis;
            if (ns.length) { const v = V.integerize(ns[0]).vec; const bad = new Poly(v); h += '<p><b class="err">✗ No — coincidence fails.</b> The non-zero polynomial $p = ' + bad.tex() + "$ has $\\langle p,p\\rangle = " + ip(bad, bad).tex() + "$.</p>"; }
            else { let found = null; for (let i = 0; i <= n && !found; i++) for (let j = i; j <= n && !found; j++) for (const s of [1, -1]) { const t = i === j ? basis[i] : basis[i].add(basis[j].scale(s)); if (ip(t, t).sign() < 0) { found = t; break; } } h += '<p><b class="err">✗ No — non-negativity fails.</b>' + (found ? " E.g. $p = " + found.tex() + "$ gives $\\langle p,p\\rangle = " + ip(found, found).tex() + "\\lt0$." : "") + "</p>"; }
          }
          h += "</div>";
          if (chk.pd) {
            const pp = ip(p, p), qq = ip(q, q), pq = ip(p, q), d = p.sub(q), dd = ip(d, d);
            h += '<div class="box ex" data-t="Computations">$$\\langle p,q\\rangle = ' + pq.tex() + ",\\qquad \\lVert p\\rVert^2 = " + pp.tex() + ",\\qquad\\lVert q\\rVert^2 = " + qq.tex() + "$$";
            h += "$$\\lVert p\\rVert = " + N.sqrtTex(pp) + ",\\quad\\lVert q\\rVert = " + N.sqrtTex(qq) + ",\\quad d(p,q) = \\lVert p-q\\rVert = " + N.sqrtTex(dd) + "$$";
            if (!pp.isZero() && !qq.isZero()) { const cos = pq.toNumber() / Math.sqrt(pp.toNumber() * qq.toNumber()); h += "$$\\cos\\theta = \\frac{" + pq.tex() + "}{\\sqrt{" + pp.tex() + "}\\sqrt{" + qq.tex() + "}}\\approx" + cos.toFixed(4) + ",\\qquad\\theta\\approx" + Math.acos(Math.max(-1, Math.min(1, cos))).toFixed(4) + "\\text{ rad}" + (pq.isZero() ? "\\;(\\text{orthogonal!})" : "") + "$$"; }
            if (!pp.isZero()) {
              const ip2 = intPoly(p); h += "$$\\hat p = \\frac{p}{\\lVert p\\rVert} = " + normTex(ip(ip2.p, ip2.p)) + "\\big(" + ip2.p.tex() + "\\big),\\qquad \\mathrm{proj}_p q = \\frac{\\langle q,p\\rangle}{\\langle p,p\\rangle}p = " + p.scale(pq.div(pp)).tex() + "$$";
              // {p}^perp in P_n : coefficient vector c with sum c_k <x^k,p> = 0
              const row = basis.map((b) => ip(b, p)); const nsb = ALG.nullspace([row]).basis.map((v) => new Poly(V.integerize(v, true).vec));
              h += "<p>Orthogonal complement in $\\P_{" + n + "}$: $a_0+a_1x+\\dots$ is orthogonal to $p$ iff $" + FMT.lincomb(row, basis.map((_, k) => "a_{" + k + "}")) + " = 0$, so</p>$$\\{p\\}^\\perp = \\spn\\{" + nsb.map((r) => r.tex()).join(",\\;") + "\\}\\quad(\\dim = " + nsb.length + ")$$";
            }
            h += "</div>";
          }
          h += "</div>";
          out.innerHTML = h; LA.enhance(out); LA.renderMath(out);
        } catch (e) { out.innerHTML = '<div class="card"><p class="err">' + esc(e.message) + "</p></div>"; }
      };
      $$("[data-x]", view).forEach((b) => b.onclick = () => { load(IP_EX[Number(b.dataset.x)]); run(); });
      $("#go", view).onclick = run; load(IP_EX[0]); run();
    },
  });
})();
