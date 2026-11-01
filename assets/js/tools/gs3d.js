/* 3D Gram–Schmidt / orthogonality visualizer (drag to rotate) */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$ } = LA;
  const PRE = [["Ex 4.2.15(ii)", [[1, 0, 0], [1, 1, 2], [0, 1, 1]]], ["Mock A Q4(c)", [[1, 1, 0], [1, 0, 1], [0, 1, 1]]], ["Nearly parallel", [[2, 0.3, 0], [2, 1, 0.2], [1, 1, 2]]], ["Already orthogonal", [[1, 1, 0], [-1, 1, 0], [0, 0, 1]]]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const sc = (k, a) => [k * a[0], k * a[1], k * a[2]];
  const nrm = (a) => Math.sqrt(dot(a, a));
  const f2 = (x) => (Math.round(x * 100) / 100).toString();
  const vt = (a) => "(" + a.map(f2).join(", ") + ")";

  LA.page("/labs/gs3d", {
    title: "3D Orthogonality Visualizer", lab: "gs3d", searchTitle: "Lab · 3D Gram–Schmidt Visualizer", searchDesc: "Watch projections and orthonormalisation in 3D",
    render() {
      return '<div class="page wide"><div class="kicker">Interactive lab · Chapter 4</div><h1 style="margin:.1em 0 .3em">3D Orthogonality Visualizer</h1><p class="muted">Gram–Schmidt as geometry: subtract the <span style="color:#fbbf24">shadows</span> (projections) of each vector on the previous directions, keep the perpendicular part, then shrink it to length 1. <b>Drag to rotate.</b></p>' +
        '<div class="tool-grid"><div class="card"><div class="kicker">Vectors</div>' + [1, 2, 3].map((i) => '<label class="field" style="margin-top:6px">v' + i + '<input type="text" id="v' + i + '" class="mono-in"></label>').join("") +
        '<div class="presets" style="margin-top:10px">' + PRE.map((p, i) => '<button class="chip" data-p="' + i + '">' + p[0] + "</button>").join("") + "</div>" +
        '<div class="row" style="margin-top:12px"><button class="btn btn-sm" id="prev">◂</button><b id="stLbl" style="min-width:150px;text-align:center"></b><button class="btn btn-sm btn-primary" id="next">▸</button><label class="toggle"><input type="checkbox" id="spin" checked> auto-rotate</label></div>' +
        '<div class="out" id="info"></div></div><div><canvas class="viz" id="cv"></canvas><div class="legend"><span><i style="background:#64748b"></i>original vᵢ</span><span><i style="background:#fbbf24"></i>projections (shadows)</span><span><i style="background:#a78bfa"></i>uᵢ (perpendicular part)</span><span><i style="background:#22d3ee"></i>w₁</span><span><i style="background:#f472b6"></i>w₂</span><span><i style="background:#a3e635"></i>w₃</span></div></div></div></div>';
    },
    after(view) {
      const cv = $("#cv", view), ctx = cv.getContext("2d");
      let vs = PRE[0][1].map((v) => v.slice()), step = 0, yaw = 0.7, pitch = 0.45, W = 600, raf, dragging = null;
      const set = () => [1, 2, 3].forEach((i) => { $("#v" + i, view).value = vs[i - 1].join(", "); });
      const compute = () => {
        const [v1, v2, v3] = vs;
        const u1 = v1, w1 = sc(1 / nrm(u1), u1);
        const p21 = sc(dot(v2, w1), w1), u2 = sub(v2, p21), w2 = nrm(u2) > 1e-9 ? sc(1 / nrm(u2), u2) : null;
        const p31 = sc(dot(v3, w1), w1), p32 = w2 ? sc(dot(v3, w2), w2) : [0, 0, 0], u3 = sub(sub(v3, p31), p32), w3 = nrm(u3) > 1e-9 ? sc(1 / nrm(u3), u3) : null;
        return { u1, w1, p21, u2, w2, p31, p32, u3, w3 };
      };
      const resize = () => { const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      const proj = (p) => { // rotate (z up) then perspective
        const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        const x1 = p[0] * cy - p[1] * sy, y1 = p[0] * sy + p[1] * cy, z1 = p[2];
        const y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp;
        const d = 9, s = (W / 7) * (d / (d + y2));
        return [W / 2 + x1 * s, W / 2 - z2 * s];
      };
      const seg = (a, b, col, w, dash) => { const A = proj(a), B = proj(b); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.restore(); };
      const arrow = (a, b, col, w, label, dash) => { seg(a, b, col, w, dash); const A = proj(a), B = proj(b); const ang = Math.atan2(B[1] - A[1], B[0] - A[0]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(B[0] - 11 * Math.cos(ang - 0.4), B[1] - 11 * Math.sin(ang - 0.4)); ctx.lineTo(B[0] - 11 * Math.cos(ang + 0.4), B[1] - 11 * Math.sin(ang + 0.4)); ctx.fill(); if (label) { ctx.font = "600 13px Inter, sans-serif"; ctx.fillText(label, B[0] + 6, B[1] - 6); } };
      const O = [0, 0, 0];
      function draw() {
        ctx.clearRect(0, 0, W, W);
        const dark = document.documentElement.getAttribute("data-theme") !== "light";
        const faint = dark ? "rgba(148,163,255,.14)" : "rgba(40,52,110,.14)";
        for (let i = -3; i <= 3; i++) { seg([i, -3, 0], [i, 3, 0], faint, 1); seg([-3, i, 0], [3, i, 0], faint, 1); }
        const axc = dark ? "rgba(231,234,246,.55)" : "rgba(20,26,51,.55)";
        [[[3.3, 0, 0], "x"], [[0, 3.3, 0], "y"], [[0, 0, 3.3], "z"]].forEach((a) => arrow(O, a[0], axc, 1.2, a[1]));
        const c = compute();
        // unit circle in plane of w1,w2 (step >= 2)
        if (step >= 2 && c.w2) { ctx.save(); ctx.fillStyle = "rgba(167,139,250,.10)"; ctx.beginPath(); for (let t = 0; t <= 64; t++) { const a = (t / 64) * Math.PI * 2; const p = proj([0, 1, 2].map((k) => 2.2 * (Math.cos(a) * c.w1[k] + Math.sin(a) * c.w2[k]))); t ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.fill(); ctx.restore(); }
        const grey = dark ? "#64748b" : "#94a3b8";
        vs.forEach((v, i) => { if (step <= i + 1 || step === 0) arrow(O, v, grey, 2, "v" + (i + 1)); });
        if (step >= 1) arrow(O, c.w1, "#22d3ee", 4, "w₁");
        if (step === 2) { arrow(O, c.p21, "#fbbf24", 3, "proj"); seg(c.p21, vs[1], "#fbbf24", 1.5, [5, 5]); arrow(O, c.u2, "#a78bfa", 3, "u₂"); }
        if (step >= 2 && c.w2) arrow(O, c.w2, "#f472b6", 4, "w₂");
        if (step === 3) { const pp = [0, 1, 2].map((k) => c.p31[k] + c.p32[k]); arrow(O, pp, "#fbbf24", 3, "proj"); seg(pp, vs[2], "#fbbf24", 1.5, [5, 5]); arrow(O, c.u3, "#a78bfa", 3, "u₃"); }
        if (step >= 3 && c.w3) arrow(O, c.w3, "#a3e635", 4, "w₃");
      }
      function info() {
        const c = compute();
        const lbl = ["Step 0 · the input vectors", "Step 1 · normalise v₁", "Step 2 · remove v₂'s shadow on w₁", "Step 3 · remove v₃'s shadows on w₁, w₂"][step];
        $("#stLbl", view).textContent = lbl;
        const rows = [
          "<p>Start with $v_1 = " + vt(vs[0]) + "$, $v_2 = " + vt(vs[1]) + "$, $v_3 = " + vt(vs[2]) + "$.</p>",
          "<p>$w_1 = \\dfrac{v_1}{\\lVert v_1\\rVert} = " + vt(c.w1) + "$ — same direction as $v_1$, length 1.</p>",
          "<p>Shadow: $\\langle v_2,w_1\\rangle w_1 = " + vt(c.p21) + "$. Perpendicular part: $u_2 = v_2 - \\langle v_2,w_1\\rangle w_1 = " + vt(c.u2) + "$.</p><p>Check $u_2\\cdot w_1 = " + f2(dot(c.u2, c.w1)) + "$ ✔. Normalise: $w_2 = " + (c.w2 ? vt(c.w2) : "\\text{undefined } (v_2\\parallel v_1)") + "$.</p>",
          "<p>Shadows: $\\langle v_3,w_1\\rangle w_1 + \\langle v_3,w_2\\rangle w_2 = " + vt([0, 1, 2].map((k) => c.p31[k] + c.p32[k])) + "$ (the projection onto the purple plane).</p><p>$u_3 = " + vt(c.u3) + "$, perpendicular to the plane: $u_3\\cdot w_1 = " + f2(dot(c.u3, c.w1)) + "$, $u_3\\cdot w_2 = " + f2(c.w2 ? dot(c.u3, c.w2) : 0) + "$. $w_3 = " + (c.w3 ? vt(c.w3) : "\\text{undefined (dependent set)}") + "$.</p>",
        ];
        $("#info", view).innerHTML = '<div class="box ex" data-t="' + lbl + '">' + rows[step] + "</div>";
        LA.enhance($("#info", view)); LA.renderMath($("#info", view));
      }
      const loop = () => { if (!cv.isConnected) return; if ($("#spin", view).checked && !dragging) yaw += 0.004; draw(); raf = requestAnimationFrame(loop); };
      const readVs = () => { try { vs = [1, 2, 3].map((i) => { const a = $("#v" + i, view).value.split(",").map(Number); if (a.length !== 3 || a.some((x) => !Number.isFinite(x))) throw 0; return a; }); if (nrm(vs[0]) < 1e-9) throw 0; info(); } catch (e) { LA.toast("Enter three numbers per vector", "e.g. 1, 0, 2 (v₁ must be non-zero)"); } };
      [1, 2, 3].forEach((i) => $("#v" + i, view).addEventListener("change", readVs));
      $$("[data-p]", view).forEach((b) => b.onclick = () => { vs = PRE[Number(b.dataset.p)][1].map((v) => v.slice()); set(); step = 0; info(); });
      $("#next", view).onclick = () => { step = Math.min(3, step + 1); info(); };
      $("#prev", view).onclick = () => { step = Math.max(0, step - 1); info(); };
      cv.addEventListener("pointerdown", (e) => { dragging = { x: e.clientX, y: e.clientY, yaw, pitch }; cv.setPointerCapture(e.pointerId); });
      cv.addEventListener("pointermove", (e) => { if (!dragging) return; yaw = dragging.yaw - (e.clientX - dragging.x) * 0.01; pitch = Math.max(-1.2, Math.min(1.2, dragging.pitch + (e.clientY - dragging.y) * 0.01)); });
      cv.addEventListener("pointerup", () => { dragging = null; });
      LA.setResize(resize);
      set(); resize(); info(); loop(); LA.stat("gs");
    },
  });
})();
