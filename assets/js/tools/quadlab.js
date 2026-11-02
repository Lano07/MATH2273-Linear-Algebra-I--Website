/* Quadratic Forms Lab: level curves, principal axes, eigen-directions, definiteness (eigenvalues + Sylvester),
   Rayleigh max/min on the unit circle, the rotation to principal axes, and the 3D surface z = Q(x,y).
   Exact arithmetic for matrices, minors and eigenvalues (surds); plots use floating point. Also a 3-variable mode. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;
  const { Frac } = LA;
  const PRE = [["5x² − 4xy + 8y² (Ex 8.3.2)", "5x^2 - 4xy + 8y^2"], ["x² + y² (circle)", "x^2 + y^2"], ["x² − y² (saddle)", "x^2 - y^2"], ["2xy (rotated saddle)", "2xy"], ["3x² + 2xy + 3y²", "3x^2 + 2xy + 3y^2"], ["x² + 2xy + y² (semidefinite)", "x^2 + 2xy + y^2"], ["−2x² + 2xy − 2y² (neg. definite)", "-2x^2 + 2xy - 2y^2"], ["3 variables: 2x²+2y²+2z²+2xy+2yz+2xz", "2x^2+2y^2+2z^2+2xy+2yz+2xz"]];
  const CLS = ["positive definite", "negative definite", "positive semidefinite", "negative semidefinite", "indefinite", "zero form"];
  function parseQ(src) {
    const vars = /z/.test(src) ? ["x", "y", "z"] : ["x", "y"], n = vars.length;
    const mp = LA.parse.toMPoly(LA.parse.parse(LA.ans.norm(src), vars), vars);
    const A = LA.M.zeros(n, n);
    for (const [k, c] of mp) {
      const e = k.split(",").map(Number); const deg = e.reduce((s, x) => s + x, 0);
      if (deg !== 2) throw new Error("every term must have degree exactly 2 (a quadratic FORM has no linear or constant terms)");
      const idx = []; e.forEach((p, i) => { for (let t = 0; t < p; t++) idx.push(i); });
      if (idx[0] === idx[1]) A[idx[0]][idx[0]] = A[idx[0]][idx[0]].add(c);
      else { const h = c.div(2); A[idx[0]][idx[1]] = A[idx[0]][idx[1]].add(h); A[idx[1]][idx[0]] = A[idx[1]][idx[0]].add(h); }
    }
    return { A, vars };
  }
  function jacobi(S) { // symmetric eigen-decomposition (numeric)
    const n = S.length, A = S.map((r) => r.slice()), V = S.map((_, i) => S.map((__, j) => (i === j ? 1 : 0)));
    for (let sweep = 0; sweep < 60; sweep++) {
      let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
      if (off < 1e-22) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-15) continue;
        const th = 0.5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]), c = Math.cos(th), s = Math.sin(th);
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    return { vals: A.map((r, i) => r[i]), vecs: V };
  }
  const classify = (ev) => { const pos = ev.some((x) => x > 1e-12), neg = ev.some((x) => x < -1e-12), zero = ev.some((x) => Math.abs(x) <= 1e-12); return !pos && !neg ? 5 : pos && neg ? 4 : pos ? (zero ? 2 : 0) : zero ? 3 : 1; };
  function eigTex2(A) { // exact eigenvalues of symmetric 2x2: (tr ± sqrt(D))/2, D = (a-c)^2 + 4b^2
    const a = A[0][0], b = A[0][1], c = A[1][1], tr = a.add(c), D = a.sub(c).mul(a.sub(c)).add(b.mul(b).mul(4));
    const sd = LA.num.sqrtFrac(D), half = tr.div(2);
    if (sd.rad === 1n) { const r = sd.coef.div(2); return [half.add(r).tex(), half.sub(r).tex()]; }
    const k = sd.coef.div(2), rt = (k.isOne() ? "" : k.tex()) + "\\sqrt{" + sd.rad + "}";
    return [(half.isZero() ? "" : half.tex() + " + ") + rt, (half.isZero() ? "-" : half.tex() + " - ") + rt];
  }

  LA.page("/labs/quadratic", {
    title: "Quadratic Forms Lab", lab: "quadratic", searchTitle: "Lab · Quadratic Forms", searchDesc: "Level curves, principal axes, definiteness, Sylvester, Rayleigh, Hessian-style surfaces",
    render() {
      return '<div class="page wide"><div class="row spread"><div><div class="kicker">Interactive lab · Chapter 8</div><h1 style="margin:.1em 0 .3em">Quadratic Forms Lab</h1></div><div class="row"><a class="btn btn-sm" href="#/ch/8">📖 Chapter 8</a><a class="btn btn-sm" href="#/learn/definiteness">🎛️ Topic Studio</a></div></div>' +
        '<p class="muted">Type a quadratic form in $x,y$ (or $x,y,z$). The lab builds its symmetric matrix exactly, finds the principal axes and decides definiteness two ways. In 2D you see the level curves $Q = k$ rotate into standard position along the eigenvectors.</p>' +
        '<div class="tool-grid"><div class="card"><label class="field">$Q(x,y) =$<input type="text" id="qIn" class="mono-in" value="5x^2 - 4xy + 8y^2" spellcheck="false"></label><div class="presets" style="margin-top:8px">' + PRE.map((p, i) => '<button class="chip" data-p="' + i + '">' + p[0] + "</button>").join("") + "</div>" +
        '<div class="row" style="margin-top:10px"><label class="toggle"><input type="checkbox" id="qAxes" checked> principal axes</label><label class="toggle"><input type="checkbox" id="qCircle" checked> unit circle &amp; Rayleigh points</label><label class="toggle"><input type="checkbox" id="q3d"> 3D surface</label></div>' +
        '<label class="field" style="margin-top:10px">Highlighted level $k$: <span id="kVal">36</span><input type="range" id="qK" min="-50" max="50" step="1" value="36"></label><div class="out" id="qOut"></div></div>' +
        '<div><canvas class="viz" id="qCv" aria-label="Level curves of the quadratic form"></canvas><canvas class="viz wide" id="q3" hidden aria-label="Surface z = Q(x, y); drag to rotate"></canvas><div class="legend"><span><i style="background:#a78bfa"></i>$Q = k\\gt0$</span><span><i style="background:#22d3ee"></i>$Q = k\\lt0$</span><span><i style="background:#fbbf24"></i>highlighted level</span><span><i style="background:#a3e635"></i>eigenvectors</span><span><i style="background:#f472b6"></i>max / min on unit circle</span></div></div></div></div>';
    },
    after(view) {
      const inp = $("#qIn", view), out = $("#qOut", view), cv = $("#qCv", view), c3 = $("#q3", view);
      const P = LA.plane(cv, { range: 5 });
      let cur = null, yaw = 0.8, pitch = 0.9;
      const kEl = $("#qK", view);
      function update() {
        try { cur = parseQ(inp.value); } catch (e) { out.innerHTML = '<p class="err">' + LA.esc(e.message) + "</p>"; cur = null; P.clear(); return; }
        const A = cur.A, n = A.length, An = A.map((r) => r.map((x) => x.toNumber())), J = jacobi(An), cls = classify(J.vals);
        const minors = A.map((_, k) => LA.alg.det(A.slice(0, k + 1).map((r) => r.slice(0, k + 1))));
        let html = "$$A = " + LA.M.tex(A) + "\\qquad Q = x^TAx$$<p><b>Leading minors:</b> " + minors.map((m, i) => "$\\Delta_" + (i + 1) + " = " + m.tex() + "$").join(", ") + "</p>";
        if (n === 2) { const ev = eigTex2(A); html += "<p><b>Eigenvalues:</b> $\\lambda_1 = " + ev[0] + "$, $\\lambda_2 = " + ev[1] + "$ (≈ " + J.vals.map((x) => LA.nice(x)).join(", ") + ")</p>"; }
        else html += "<p><b>Eigenvalues</b> (numerical): " + J.vals.map((x) => "$" + LA.nice(x) + "$").join(", ") + "</p>";
        const sylv = minors.every((m) => m.sign() > 0) ? "all $\\Delta_k\\gt0$ ⇒ positive definite" : minors.every((m, i) => m.sign() === (i % 2 ? 1 : -1)) ? "signs alternate $-,+,\\dots$ ⇒ negative definite" : "not PD/ND by Sylvester" + (minors.some((m) => m.isZero()) ? " (a zero minor: Sylvester is silent about semidefiniteness — use the eigenvalues)" : "");
        html += '<div class="box thm" data-t="Classification"><p><b>' + CLS[cls] + "</b> — eigenvalue test. Sylvester: " + sylv + ".</p></div>";
        if (n === 2) {
          const [a, b, c] = [An[0][0], An[0][1], An[1][1]], th = 0.5 * Math.atan2(2 * b, a - c) * 180 / Math.PI;
          const l = J.vals, k = +kEl.value;
          const shape = (l[0] > 0 && l[1] > 0) ? (k > 0 ? "an ellipse" : k === 0 ? "the single point 0" : "empty") : (l[0] < 0 && l[1] < 0) ? (k < 0 ? "an ellipse" : k === 0 ? "the single point 0" : "empty") : (l[0] * l[1] < 0) ? (k === 0 ? "two lines through 0 (the asymptotes)" : "a hyperbola") : (k === 0 ? "a line (double)" : (l[0] + l[1]) * k > 0 ? "two parallel lines" : "empty");
          html += "<p><b>Principal axes:</b> rotate by $\\theta \\approx " + LA.nice(th) + "^\\circ$ (eigenvector directions). In those coordinates $Q = " + LA.nice(l[0]) + "X^2 " + (l[1] < 0 ? "- " + LA.nice(-l[1]) : "+ " + LA.nice(l[1])) + "Y^2$, so $Q = " + k + "$ is <b>" + shape + "</b>.</p><p><b>Rayleigh:</b> on $\\lVert x\\rVert = 1$, $Q$ ranges over $[" + LA.nice(Math.min(...l)) + ", " + LA.nice(Math.max(...l)) + "]$.</p>";
        }
        html += '<p class="small muted">Formulas: $Q = x^TAx$, cross term $c\\,x_ix_j\\Rightarrow a_{ij} = a_{ji} = c/2$; PD ⇔ all $\\lambda\\gt0$ ⇔ all $\\Delta_k\\gt0$; $\\lambda_{\\mathrm{min}}\\le x^TAx\\le\\lambda_{\\mathrm{max}}$ on the unit sphere. <a href="#/ch/8?go=sec-8-4">§8.4</a> · <a href="#/ch/8?go=sec-8-3">§8.3</a></p>';
        out.innerHTML = html; LA.enhance(out); LA.renderMath(out);
        draw(J);
      }
      function draw(J) {
        P.clear(); P.grid([1, 0], [0, 1], P.css("--border"), 1); P.axes();
        if (!cur || cur.A.length !== 2) { P.text("3-variable form: see the classification on the left", -4.6, 0, P.css("--muted")); c3.hidden = true; return; }
        const An = cur.A.map((r) => r.map((x) => x.toNumber())), f = (x, y) => An[0][0] * x * x + 2 * An[0][1] * x * y + An[1][1] * y * y;
        const scale = Math.max(1, Math.max(...J.vals.map(Math.abs)));
        [-16, -9, -4, -1, 1, 4, 9, 16].map((t) => t * scale / 4).forEach((lev) => P.contour(f, lev, 100).forEach((s) => P.seg(s[0], s[1], s[2], s[3], lev > 0 ? "rgba(167,139,250,.75)" : "rgba(34,211,238,.75)", 1.4)));
        const k = +kEl.value; P.contour(f, k, 140).forEach((s) => P.seg(s[0], s[1], s[2], s[3], "#fbbf24", 2.8));
        if ($("#qAxes", view).checked) J.vecs[0].forEach((_, j) => { const v = [J.vecs[0][j], J.vecs[1][j]]; P.line(v[0], v[1], "rgba(163,230,53,.6)", 1.5, [6, 5]); P.arrow(2 * v[0], 2 * v[1], "#a3e635", 3); P.text("λ=" + LA.nice(J.vals[j]), 2 * v[0], 2 * v[1], "#a3e635"); });
        if ($("#qCircle", view).checked) { const pts = []; for (let t = 0; t <= 64; t++) pts.push([Math.cos(t * Math.PI / 32), Math.sin(t * Math.PI / 32)]); P.poly(pts, P.css("--text-2"), 1.5, [3, 4]); const iMax = J.vals[0] >= J.vals[1] ? 0 : 1; [iMax, 1 - iMax].forEach((j, r) => { const v = [J.vecs[0][j], J.vecs[1][j]]; P.dot(v[0], v[1], "#f472b6", 5); P.dot(-v[0], -v[1], "#f472b6", 5); P.text((r ? "min " : "max ") + LA.nice(J.vals[j]), v[0], v[1], "#f472b6"); }); }
        c3.hidden = !$("#q3d", view).checked; if (!c3.hidden) surface(f);
      }
      function surface(f) {
        const ctx = c3.getContext("2d"), r = c3.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); c3.width = r.width * dpr; c3.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const W = r.width, Hh = r.height, N = 24, R = 2;
        let zmax = 1e-9; for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) zmax = Math.max(zmax, Math.abs(f(-R + 2 * R * i / N, -R + 2 * R * j / N)));
        const proj = (x, y, z) => { const cx = Math.cos(yaw), sx = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const X = cx * x - sx * y, Y = sx * x + cx * y; const zz = (z / zmax) * 1.6; return [W / 2 + X * W / 7, Hh / 2 + (Y * cp * 0.6 - zz * sp) * Hh / 4.2]; };
        ctx.clearRect(0, 0, W, Hh); ctx.lineWidth = 1;
        for (let i = 0; i <= N; i++) for (let dir = 0; dir < 2; dir++) {
          ctx.beginPath();
          for (let j = 0; j <= N; j++) { const x = -R + 2 * R * (dir ? j : i) / N, y = -R + 2 * R * (dir ? i : j) / N, z = f(x, y); const [px, py] = proj(x, y, z); if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
          const z0 = f(-R + 2 * R * i / N, 0); ctx.strokeStyle = z0 >= 0 ? "rgba(167,139,250,.65)" : "rgba(34,211,238,.65)"; ctx.stroke();
        }
        const o = proj(0, 0, 0); ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(o[0], o[1], 4, 0, 7); ctx.fill();
      }
      let drag = null;
      c3.addEventListener("mousedown", (e) => { drag = [e.clientX, e.clientY, yaw, pitch]; });
      const qUp = () => { drag = null; };
      window.addEventListener("mouseup", qUp);
      LA.onLeave(() => { window.removeEventListener("mouseup", qUp); window.removeEventListener("mousemove", qMove); });
      window.addEventListener("mousemove", qMove);
      function qMove(e) { if (!drag || c3.hidden) return; yaw = drag[2] + (e.clientX - drag[0]) / 120; pitch = Math.max(0.2, Math.min(1.45, drag[3] + (e.clientY - drag[1]) / 160)); if (cur) surface((x, y) => { const A = cur.A.map((r) => r.map((v) => v.toNumber())); return A[0][0] * x * x + 2 * A[0][1] * x * y + A[1][1] * y * y; }); }
      inp.addEventListener("input", update);
      kEl.addEventListener("input", () => { $("#kVal", view).textContent = kEl.value; update(); });
      ["qAxes", "qCircle", "q3d"].forEach((id) => $("#" + id, view).addEventListener("change", update));
      $$("[data-p]", view).forEach((b) => b.addEventListener("click", () => { inp.value = PRE[+b.dataset.p][1]; update(); }));
      LA.setResize(() => { P.resize(); update(); });
      update();
    },
  });
  LA.quadParse = parseQ; LA.jacobiEig = jacobi;
})();
