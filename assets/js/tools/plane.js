/* Shared 2D canvas helper for labs: world↔pixel mapping, grids (including skewed basis grids), arrows,
   dragging with snapping, and marching-squares contours. */
(function () {
  "use strict";
  const LA = window.LA;
  LA.plane = function (cv, opts) {
    opts = opts || {};
    const ctx = cv.getContext("2d");
    const P = { cv, ctx, range: opts.range || 5, W: 600, H: 600, S: 60 };
    P.css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#888";
    P.resize = () => { const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); P.W = r.width || 600; P.H = r.height || P.W; cv.width = P.W * dpr; cv.height = P.H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); P.S = Math.min(P.W, P.H) / (2 * P.range); };
    P.toPx = (x, y) => [P.W / 2 + x * P.S, P.H / 2 - y * P.S];
    P.toW = (px, py) => [(px - P.W / 2) / P.S, (P.H / 2 - py) / P.S];
    P.clear = () => ctx.clearRect(0, 0, P.W, P.H);
    P.seg = (x0, y0, x1, y1, col, w, dash) => { const [a, b] = P.toPx(x0, y0), [c, d] = P.toPx(x1, y1); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); ctx.restore(); };
    P.line = (dx, dy, col, w, dash, ox, oy) => { const n = Math.hypot(dx, dy); if (n < 1e-12) return; const k = 4 * P.range / n; P.seg((ox || 0) - k * dx, (oy || 0) - k * dy, (ox || 0) + k * dx, (oy || 0) + k * dy, col, w, dash); };
    P.grid = (b1, b2, col, w, alpha) => { // lattice lines for basis b1, b2 (default standard basis)
      b1 = b1 || [1, 0]; b2 = b2 || [0, 1]; const N = Math.ceil(P.range * 3);
      ctx.save(); ctx.globalAlpha = alpha === undefined ? 1 : alpha;
      for (let i = -N; i <= N; i++) { P.line(b2[0], b2[1], col, w, null, i * b1[0], i * b1[1]); P.line(b1[0], b1[1], col, w, null, i * b2[0], i * b2[1]); }
      ctx.restore();
    };
    P.axes = (col) => { P.seg(-P.range * 2, 0, P.range * 2, 0, col || P.css("--border-strong"), 1.5); P.seg(0, -P.range * 2, 0, P.range * 2, col || P.css("--border-strong"), 1.5); };
    P.arrow = (x, y, col, w, x0, y0) => {
      x0 = x0 || 0; y0 = y0 || 0; const [ax, ay] = P.toPx(x0, y0), [bx, by] = P.toPx(x, y);
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      const ang = Math.atan2(by - ay, bx - ax), L = 11; if (Math.hypot(bx - ax, by - ay) > 4) { ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - L * Math.cos(ang - 0.4), by - L * Math.sin(ang - 0.4)); ctx.lineTo(bx - L * Math.cos(ang + 0.4), by - L * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    };
    P.dot = (x, y, col, r) => { const [a, b] = P.toPx(x, y); ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(a, b, r || 5, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); };
    P.text = (s, x, y, col, dx, dy) => { const [a, b] = P.toPx(x, y); ctx.save(); ctx.fillStyle = col || P.css("--text"); ctx.font = "600 13px " + (P.css("--font-body") || "sans-serif"); ctx.fillText(s, a + (dx || 6), b + (dy || -6)); ctx.restore(); };
    P.poly = (pts, col, w, dash, fill) => { if (pts.length < 2) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(([x, y], i) => { const [a, b] = P.toPx(x, y); if (i) ctx.lineTo(a, b); else ctx.moveTo(a, b); }); if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.stroke(); ctx.restore(); };
    // marching squares: returns list of segments [[x0,y0,x1,y1],...] for f(x,y) = level
    P.contour = (f, level, n) => {
      n = n || 90; const R = P.range * 1.05, h = (2 * R) / n, out = [], val = [];
      for (let i = 0; i <= n; i++) { val.push([]); for (let j = 0; j <= n; j++) val[i].push(f(-R + i * h, -R + j * h) - level); }
      const lerp = (a, b, va, vb) => a + (b - a) * (va / (va - vb));
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = -R + i * h, y = -R + j * h, v0 = val[i][j], v1 = val[i + 1][j], v2 = val[i + 1][j + 1], v3 = val[i][j + 1];
        const pts = [];
        if ((v0 > 0) !== (v1 > 0)) pts.push([lerp(x, x + h, v0, v1), y]);
        if ((v1 > 0) !== (v2 > 0)) pts.push([x + h, lerp(y, y + h, v1, v2)]);
        if ((v2 > 0) !== (v3 > 0)) pts.push([lerp(x + h, x, v2, v3), y + h]);
        if ((v3 > 0) !== (v0 > 0)) pts.push([x, lerp(y + h, y, v3, v0)]);
        if (pts.length >= 2) out.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
        if (pts.length === 4) out.push([pts[2][0], pts[2][1], pts[3][0], pts[3][1]]);
      }
      return out;
    };
    // dragging: handles = () => [{x, y, set(x,y)}]
    P.draggable = (handles, onChange, snap) => {
      let active = null;
      const pos = (e) => { const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return P.toW(t.clientX - r.left, t.clientY - r.top); };
      const down = (e) => { const [x, y] = pos(e); let best = null, bd = 0.45 * (5 / P.range) * (P.range / 5) * 1.0; handles().forEach((h) => { const d = Math.hypot(h.x - x, h.y - y); if (d < bd + 0.25) { bd = d; best = h; } }); if (best) { active = best; e.preventDefault(); } };
      const move = (e) => { if (!active) return; let [x, y] = pos(e); const s = snap ? snap() : 0; if (s) { x = Math.round(x / s) * s; y = Math.round(y / s) * s; } active.set(x, y); onChange(); e.preventDefault(); };
      const up = () => { active = null; };
      cv.addEventListener("mousedown", down); cv.addEventListener("touchstart", down, { passive: false });
      window.addEventListener("mousemove", move); window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("mouseup", up); window.addEventListener("touchend", up);
      const off = () => { window.removeEventListener("mousemove", move); window.removeEventListener("touchmove", move); window.removeEventListener("mouseup", up); window.removeEventListener("touchend", up); };
      if (LA.onLeave) LA.onLeave(off);
      return off;
    };
    P.resize();
    return P;
  };
  // tidy number for display (snapped drags are multiples of 1/2)
  LA.nice = (x) => { const r = Math.round(x * 1000) / 1000; return Object.is(r, -0) ? "0" : String(r); };
  LA.fracOf = (x) => { try { return LA.Frac.parse(LA.nice(x)); } catch (e) { return LA.Frac.of(0); } };
})();
