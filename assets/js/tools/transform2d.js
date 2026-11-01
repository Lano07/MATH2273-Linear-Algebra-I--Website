/* 2D Linear Transformation Visualizer */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;

  const PRESETS = [
    ["Identity", [1, 0, 0, 1]], ["Rotate 90°", [0, -1, 1, 0]], ["Rotate 30°", [0.866, -0.5, 0.5, 0.866]], ["Reflect in x-axis", [1, 0, 0, -1]],
    ["Reflect in y = x", [0, 1, 1, 0]], ["Shear", [1, 1, 0, 1]], ["Stretch", [2, 0, 0, 0.5]], ["Project onto x-axis (singular)", [1, 0, 0, 0]],
    ["(x+y, x−y)  · Ex 3.4.4(ii)", [1, 1, 1, -1]], ["[[1,2],[2,−2]] · Ex 7.1.5(i)", [1, 2, 2, -2]], ["(3x+y, x+3y) · eigen-basis", [3, 1, 1, 3]], ["Rank 1: [[1,2],[2,4]]", [1, 2, 2, 4]],
  ];
  const fmt = (x) => { const r = Math.round(x * 100) / 100; return Object.is(r, -0) ? "0" : String(r); };
  // "ax + by" with tidy coefficients: 1x → x, 0 terms dropped, signs merged
  const lin = (p, q) => { const parts = []; [[p, "x"], [q, "y"]].forEach(([c, v]) => { const r = Math.round(c * 100) / 100; if (r === 0) return; const mag = Math.abs(r) === 1 ? "" : fmt(Math.abs(r)); parts.push({ neg: r < 0, s: mag + v }); }); if (!parts.length) return "0"; return parts.map((t, i) => (i === 0 ? (t.neg ? "-" : "") : t.neg ? " - " : " + ") + t.s).join(""); };

  LA.page("/labs/transform", {
    title: "2D Transformation Visualizer", lab: "transform", searchTitle: "Lab · 2D Transformation Visualizer", searchDesc: "See linear maps, determinants, eigenvectors and kernels",
    render() {
      return '<div class="page wide"><div class="row spread"><div><div class="kicker">Interactive lab · Chapters 3, 6, 7</div><h1 style="margin:.1em 0 .3em">2D Transformation Visualizer</h1></div><a class="btn btn-sm" href="#/ch/3">📖 Chapter 3</a></div>' +
        '<p class="muted">A $2\\times2$ matrix $A = \\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ sends $e_1\\mapsto(a,c)$ and $e_2\\mapsto(b,d)$ — its <b>columns</b>. <b>Drag the cyan and pink arrow tips</b> to change the map, or drag the lime vector $v$.</p>' +
        '<div class="tool-grid"><div class="card"><div class="kicker">Matrix A</div><div class="matrix-input" style="grid-template-columns:repeat(2,auto);margin:8px 0"><input id="ma" type="text"><input id="mb" type="text"><input id="mc" type="text"><input id="md" type="text"></div>' +
        '<div class="row"><button class="btn btn-sm btn-primary" id="play">▶ Animate from I</button><label class="toggle"><input type="checkbox" id="snap" checked> snap</label></div>' +
        '<div class="kicker" style="margin-top:14px">Show</div><div class="row"><label class="toggle"><input type="checkbox" id="sGrid" checked> grid</label><label class="toggle"><input type="checkbox" id="sSq" checked> unit square</label><label class="toggle"><input type="checkbox" id="sEig" checked> eigenvectors</label><label class="toggle"><input type="checkbox" id="sV" checked> vector v</label></div>' +
        '<div class="kicker" style="margin-top:14px">Presets</div><div class="presets">' + PRESETS.map((p, i) => '<button class="chip" data-p="' + i + '">' + p[0] + "</button>").join("") + "</div>" +
        '<div class="out" id="info"></div></div>' +
        '<div><canvas class="viz" id="cv"></canvas><div class="legend"><span><i style="background:#22d3ee"></i>T(e₁) = column 1</span><span><i style="background:#f472b6"></i>T(e₂) = column 2</span><span><i style="background:#a3e635"></i>v</span><span><i style="background:#a78bfa"></i>T(v)</span><span><i style="background:#fbbf24"></i>eigenvector lines</span><span><i style="background:#fb7185"></i>kernel</span></div></div></div></div>';
    },
    after(view) {
      const cv = $("#cv", view), ctx = cv.getContext("2d");
      let A = [1, 1, 0, 1], v = [2, 1], anim = null, cur = A.slice();
      const ins = ["ma", "mb", "mc", "md"].map((id) => $("#" + id, view));
      const setInputs = () => ins.forEach((el, i) => { if (document.activeElement !== el) el.value = fmt(A[i]); });
      let W = 600, S = 60;
      const resize = () => { const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); S = W / 10; draw(); };
      const toPx = (x, y) => [W / 2 + x * S, W / 2 - y * S];
      const toW = (px, py) => [(px - W / 2) / S, (W / 2 - py) / S];
      const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      function arrow(x, y, col, w, x0, y0) {
        x0 = x0 || 0; y0 = y0 || 0;
        const [ax, ay] = toPx(x0, y0), [bx, by] = toPx(x, y);
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        const ang = Math.atan2(by - ay, bx - ax), L = 12;
        if (Math.hypot(bx - ax, by - ay) > 4) { ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - L * Math.cos(ang - 0.4), by - L * Math.sin(ang - 0.4)); ctx.lineTo(bx - L * Math.cos(ang + 0.4), by - L * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill(); }
      }
      function line(dx, dy, col, dash, width) {
        const n = Math.hypot(dx, dy); if (n < 1e-9) return; dx /= n; dy /= n;
        const [ax, ay] = toPx(-20 * dx, -20 * dy), [bx, by] = toPx(20 * dx, 20 * dy);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = width || 2; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
      }
      function eig(M) {
        const [a, b, c, d] = M; const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
        if (disc < -1e-12) return { real: false, tr, det, disc };
        const s = Math.sqrt(Math.max(0, disc)); const ls = [(tr + s) / 2, (tr - s) / 2];
        const vecs = ls.map((l) => (Math.abs(b) > 1e-9 ? [b, l - a] : Math.abs(c) > 1e-9 ? [l - d, c] : null));
        if (Math.abs(b) < 1e-9 && Math.abs(c) < 1e-9) { return { real: true, ls, vecs: [[1, 0], [0, 1]], diag: true, tr, det, disc }; }
        return { real: true, ls, vecs, tr, det, disc };
      }
      function draw() {
        const M = cur; const [a, b, c, d] = M;
        ctx.clearRect(0, 0, W, W);
        const dark = document.documentElement.getAttribute("data-theme") !== "light";
        // base grid
        ctx.lineWidth = 1; ctx.strokeStyle = dark ? "rgba(148,163,255,.10)" : "rgba(40,52,110,.10)";
        for (let i = -6; i <= 6; i++) { let p = toPx(i, -6), q = toPx(i, 6); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); p = toPx(-6, i); q = toPx(6, i); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
        // axes
        ctx.strokeStyle = dark ? "rgba(231,234,246,.35)" : "rgba(20,26,51,.4)"; ctx.lineWidth = 1.2;
        let p = toPx(-6, 0), q = toPx(6, 0); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); p = toPx(0, -6); q = toPx(0, 6); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        // transformed grid
        if ($("#sGrid", view).checked) {
          for (let i = -8; i <= 8; i++) {
            ctx.strokeStyle = i === 0 ? "rgba(167,139,250,.9)" : "rgba(34,211,238,.32)"; ctx.lineWidth = i === 0 ? 2 : 1;
            const T = (x, y) => toPx(a * x + b * y, c * x + d * y);
            let s1 = T(i, -8), s2 = T(i, 8); ctx.beginPath(); ctx.moveTo(s1[0], s1[1]); ctx.lineTo(s2[0], s2[1]); ctx.stroke();
            ctx.strokeStyle = i === 0 ? "rgba(167,139,250,.9)" : "rgba(244,114,182,.28)";
            s1 = T(-8, i); s2 = T(8, i); ctx.beginPath(); ctx.moveTo(s1[0], s1[1]); ctx.lineTo(s2[0], s2[1]); ctx.stroke();
          }
        }
        // unit square image
        if ($("#sSq", view).checked) {
          const pts = [[0, 0], [a, c], [a + b, c + d], [b, d]].map((x) => toPx(x[0], x[1]));
          ctx.fillStyle = (a * d - b * c) >= 0 ? "rgba(167,139,250,.22)" : "rgba(251,113,133,.22)";
          ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach((x) => ctx.lineTo(x[0], x[1])); ctx.closePath(); ctx.fill();
        }
        const E = eig(M);
        if ($("#sEig", view).checked && E.real && E.vecs) E.vecs.forEach((ev) => ev && line(ev[0], ev[1], "rgba(251,191,36,.85)", [6, 6], 2));
        // kernel
        const det = a * d - b * c;
        if (Math.abs(det) < 1e-9) {
          if (Math.abs(a) + Math.abs(b) > 1e-9) line(-b, a, "rgba(251,113,133,.95)", null, 3);
          else if (Math.abs(c) + Math.abs(d) > 1e-9) line(-d, c, "rgba(251,113,133,.95)", null, 3);
        }
        arrow(a, c, "#22d3ee", 3.5); arrow(b, d, "#f472b6", 3.5);
        if ($("#sV", view).checked) { arrow(v[0], v[1], "#a3e635", 2.5); arrow(a * v[0] + b * v[1], c * v[0] + d * v[1], "#a78bfa", 2.5); }
        // handles
        [[a, c, "#22d3ee"], [b, d, "#f472b6"]].concat($("#sV", view).checked ? [[v[0], v[1], "#a3e635"]] : []).forEach((h) => { const [x, y] = toPx(h[0], h[1]); ctx.fillStyle = h[2]; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.strokeStyle = dark ? "#05070f" : "#fff"; ctx.lineWidth = 2; ctx.stroke(); });
      }
      function info() {
        const [a, b, c, d] = A; const det = a * d - b * c; const E = eig(A); const Tv = [a * v[0] + b * v[1], c * v[0] + d * v[1]];
        const rank = Math.abs(det) > 1e-9 ? 2 : (Math.abs(a) + Math.abs(b) + Math.abs(c) + Math.abs(d) > 1e-9 ? 1 : 0);
        let eigTxt;
        if (!E.real) { const re = E.tr / 2, im = Math.sqrt(-E.disc) / 2; eigTxt = "$\\lambda = " + fmt(re) + "\\pm" + fmt(im) + "i$ (complex — no real eigenvector lines; the map rotates every direction)"; }
        else eigTxt = "$\\lambda_1 = " + fmt(E.ls[0]) + ",\\;\\lambda_2 = " + fmt(E.ls[1]) + "$" + (E.vecs && E.vecs[0] ? " &nbsp; eigenvectors $\\parallel(" + fmt(E.vecs[0][0]) + "," + fmt(E.vecs[0][1]) + ")$" + (E.vecs[1] ? ", $(" + fmt(E.vecs[1][0]) + "," + fmt(E.vecs[1][1]) + ")$" : "") : "");
        $("#info", view).innerHTML = '<div class="tbl-wrap"><table class="tbl">' +
          "<tr><td>Map</td><td>$T(x,y) = (" + lin(a, b) + ",\\; " + lin(c, d) + ")$</td></tr>" +
          "<tr><td>$\\det A$</td><td><b>" + fmt(det) + "</b> — the unit square's area is scaled by " + fmt(Math.abs(det)) + (det < 0 ? " and orientation flips (red square)" : "") + "</td></tr>" +
          "<tr><td>Rank / nullity</td><td>" + rank + " / " + (2 - rank) + (rank < 2 ? ' — <span class="err">singular</span>: the plane collapses' + (rank === 1 ? " onto a line; the red line is the kernel" : " to a point") : ' — <span class="okc">invertible</span> (an isomorphism of ℝ²)') + "</td></tr>" +
          "<tr><td>Eigen</td><td>" + eigTxt + "</td></tr>" +
          "<tr><td>$T(v)$</td><td>$T(" + fmt(v[0]) + "," + fmt(v[1]) + ") = (" + fmt(Tv[0]) + "," + fmt(Tv[1]) + ")$</td></tr></table></div>";
        LA.renderMath($("#info", view));
      }
      const commit = () => { cur = A.slice(); setInputs(); draw(); info(); };
      ins.forEach((el, i) => el.addEventListener("change", () => { const x = Number(el.value); if (Number.isFinite(x)) { A[i] = x; commit(); } else el.value = fmt(A[i]); }));
      $$("[data-p]", view).forEach((b) => b.onclick = () => { A = PRESETS[Number(b.dataset.p)][1].slice(); animate(); });
      ["sGrid", "sSq", "sEig", "sV"].forEach((id) => $("#" + id, view).onchange = draw);
      function animate() {
        cancelAnimationFrame(anim); const t0 = performance.now(), dur = 1100; setInputs(); info();
        const step = (now) => { if (!cv.isConnected) return; const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; cur = [1 + (A[0] - 1) * e, A[1] * e, A[2] * e, 1 + (A[3] - 1) * e]; draw(); if (t < 1) anim = requestAnimationFrame(step); else cur = A.slice(); };
        anim = requestAnimationFrame(step);
      }
      $("#play", view).onclick = animate;
      // dragging
      let drag = null;
      const snapV = (x) => ($("#snap", view).checked ? Math.round(x * 2) / 2 : Math.round(x * 100) / 100);
      cv.addEventListener("pointerdown", (ev) => {
        const r = cv.getBoundingClientRect(); const [x, y] = toW(ev.clientX - r.left, ev.clientY - r.top);
        const hs = [["e1", A[0], A[2]], ["e2", A[1], A[3]]].concat($("#sV", view).checked ? [["v", v[0], v[1]]] : []);
        let best = null, bd = 0.6; hs.forEach((h) => { const dd = Math.hypot(h[1] - x, h[2] - y); if (dd < bd) { bd = dd; best = h[0]; } });
        if (best) { drag = best; cv.setPointerCapture(ev.pointerId); ev.preventDefault(); }
      });
      cv.addEventListener("pointermove", (ev) => {
        if (!drag) return; const r = cv.getBoundingClientRect(); let [x, y] = toW(ev.clientX - r.left, ev.clientY - r.top); x = snapV(x); y = snapV(y);
        if (drag === "e1") { A[0] = x; A[2] = y; } else if (drag === "e2") { A[1] = x; A[3] = y; } else { v = [x, y]; }
        commit();
      });
      cv.addEventListener("pointerup", () => { drag = null; });
      LA.setResize(resize);
      setInputs(); resize(); info(); animate();
    },
  });
})();
