/* Gram–Schmidt Studio: animated projections in 2D/3D, exact arithmetic for every coefficient,
   and a prediction challenge (predict each projection coefficient and each u_k before it is revealed). */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const { Frac } = LA;
  const dot = (a, b) => a.reduce((s, x, i) => s.add(x.mul(b[i])), Frac.ZERO);
  const vt = (v) => "(" + v.map((x) => x.tex()).join(", ") + ")";
  const num = (v) => v.map((x) => x.toNumber());
  function gs(vs) {
    const us = [], steps = [];
    vs.forEach((v, k) => {
      const coefs = us.map((u) => dot(v, u).div(dot(u, u)));
      let u = v.slice(); us.forEach((w, j) => { u = u.map((x, i) => x.sub(coefs[j].mul(w[i]))); });
      if (u.every((x) => x.isZero())) throw new Error("v" + (k + 1) + " is a combination of the earlier vectors — the set is dependent");
      steps.push({ v, coefs, u, n2: dot(u, u) }); us.push(u);
    });
    return steps;
  }
  const PRE = [["(1,1,0), (1,0,1), (0,1,1)", "R³ · exam classic"], ["(3,1), (2,2)", "R² · two vectors"], ["(1,2,2), (-2,0,2), (1,1,1)", "R³ · mixed signs"], ["(1,0,0), (1,1,0), (1,1,1)", "R³ · staircase"], ["(2,1), (1,3)", "R² · skewed"]];

  LA.page("/labs/gs-studio", {
    title: "Gram–Schmidt Studio", lab: "gs-studio", searchTitle: "Lab · Gram–Schmidt Studio", searchDesc: "Animated Gram–Schmidt in 2D/3D with prediction challenges",
    render() {
      return '<div class="page wide"><div class="row spread"><div><div class="kicker">Interactive lab · Chapter 4</div><h1 style="margin:.1em 0 .3em">Gram–Schmidt Studio</h1></div><div class="row"><a class="btn btn-sm" href="#/labs/gram-schmidt">Classic machine</a><a class="btn btn-sm" href="#/learn/gram-schmidt">📖 Topic Studio</a></div></div>' +
        '<p class="muted">Watch each vector lose its shadows on the earlier directions, or switch to <b>Predict</b> and compute each coefficient yourself before it is revealed. All arithmetic is exact.</p>' +
        '<div class="tool-grid"><div class="card"><label class="field">Vectors (in order, dot product)<input type="text" id="gsIn" class="mono-in" value="(1,1,0), (1,0,1), (0,1,1)"></label><div class="presets" style="margin-top:8px">' + PRE.map((p, i) => '<button class="chip" data-p="' + i + '">' + p[1] + "</button>").join("") + "</div>" +
        '<div class="seg" style="margin-top:12px" role="group" aria-label="Mode"><button type="button" data-mode="watch" aria-pressed="true">▶ Watch</button><button type="button" data-mode="predict" aria-pressed="false">🎯 Predict</button></div>' +
        '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="gsPlay">▶ Play</button><button class="btn" id="gsStep">Step ▸</button><button class="btn btn-ghost" id="gsReset">Reset</button><label class="toggle"><input type="checkbox" id="gsSlow"> slow</label></div>' +
        '<div id="gsPanel" class="out"></div></div><div><canvas class="viz" id="gsCv" aria-label="Gram–Schmidt animation; drag to rotate in 3D"></canvas><div class="legend"><span><i style="background:#94a3b8"></i>original $v_k$</span><span><i style="background:#fbbf24"></i>projection being removed</span><span><i style="background:#22d3ee"></i>$u_1$</span><span><i style="background:#f472b6"></i>$u_2$</span><span><i style="background:#a3e635"></i>$u_3$</span></div></div></div></div>';
    },
    after(view) {
      const cv = $("#gsCv", view), ctx = cv.getContext("2d"), panel = $("#gsPanel", view);
      const COLS = ["#22d3ee", "#f472b6", "#a3e635"];
      let steps = [], dim = 3, phase = 0, t = 1, anim = null, mode = "watch", yaw = 0.7, pitch = 0.45, W = 600, Hh = 600, scale = 60, pred = {}, score = [0, 0];
      const reduce = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("calm");
      function load() {
        try { const L = LA.ans.vectorList($("#gsIn", view).value).map((v) => v.map((x) => { if (!x.exRe) throw new Error("use exact numbers"); return x.exRe; })); if (L.length < 2 || L.length > 3) throw new Error("enter 2 or 3 vectors"); dim = L[0].length; if (dim < 2 || dim > 3 || L.some((v) => v.length !== dim)) throw new Error("vectors must all be in R² or all in R³"); if (L.length > dim) throw new Error("more vectors than the dimension — they must be dependent"); steps = gs(L); }
        catch (e) { steps = []; panel.innerHTML = '<p class="err">' + esc(e.message) + "</p>"; draw(); return; }
        phase = 0; t = 1; pred = {}; score = [0, 0]; const m = Math.max(...steps.flatMap((s) => num(s.v).map(Math.abs)), 1); scale = (Math.min(W, Hh) / 2) / (m * 1.6); render(); draw();
      }
      const resize = () => { const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; Hh = r.height; cv.width = W * dpr; cv.height = Hh * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      const P3 = (p) => { const [x, y, z] = dim === 2 ? [p[0], p[1], 0] : p; if (dim === 2) return [W / 2 + x * scale, Hh / 2 - y * scale]; const cx = Math.cos(yaw), sx = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const x1 = cx * x - sx * y, y1 = sx * x + cx * y; const z2 = sp * y1 + cp * z; return [W / 2 + x1 * scale, Hh / 2 - z2 * scale]; };
      const arrow = (a, b, col, w, dash) => { const [x0, y0] = P3(a), [x1, y1] = P3(b); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]); const ang = Math.atan2(y1 - y0, x1 - x0); if (Math.hypot(x1 - x0, y1 - y0) > 6) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 11 * Math.cos(ang - 0.4), y1 - 11 * Math.sin(ang - 0.4)); ctx.lineTo(x1 - 11 * Math.cos(ang + 0.4), y1 - 11 * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill(); } ctx.restore(); };
      const O = [0, 0, 0].slice(0, 3);
      function draw() {
        ctx.clearRect(0, 0, W, Hh);
        const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
        // axes
        const L = (Math.min(W, Hh) / 2) / scale * 0.95;
        [[L, 0, 0], [0, L, 0], [0, 0, L]].slice(0, dim === 2 ? 2 : 3).forEach((e, i) => { arrow(e.map((x) => -x), e, css("--border-strong"), 1); const [px, py] = P3(e); ctx.fillStyle = css("--muted"); ctx.font = "12px sans-serif"; ctx.fillText(["x", "y", "z"][i], px + 4, py - 4); });
        if (!steps.length) return;
        const z3 = (v) => (dim === 2 ? [v[0], v[1], 0] : v);
        steps.forEach((s, k) => {
          const v = z3(num(s.v)), u = z3(num(s.u));
          if (k < phase) { arrow(O, u, COLS[k], 3.2); return; }
          if (k > phase) { arrow(O, v, "rgba(148,163,184,.55)", 2, [5, 5]); return; }
          // current step: animate v -> u, showing the projection
          arrow(O, v, "#94a3b8", 2.5);
          const pr = v.map((x, i) => x - u[i]);
          if (k > 0) { arrow(O, pr, "#fbbf24", 2.5, [6, 4]); arrow(pr, v, "rgba(251,191,36,.45)", 1.5, [3, 4]); }
          const cur = v.map((x, i) => x + (u[i] - x) * t);
          arrow(O, cur, COLS[k], 3.4);
          if (k === 2 && dim === 3) { // shade the plane span{u1,u2}
            const a = z3(num(steps[0].u)), b = z3(num(steps[1].u)); const pts = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([p, q]) => P3(a.map((x, i) => p * x * 0.9 + q * b[i] * 0.9)));
            ctx.save(); ctx.fillStyle = "rgba(167,139,250,.10)"; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore();
          }
        });
      }
      function render() {
        if (!steps.length) return;
        const rows = steps.map((s, k) => {
          const done = k < phase || (k === phase && t >= 1);
          const head = "<b>Step " + (k + 1) + ".</b> ";
          if (k === 0) return '<div class="log-step">' + head + "$u_1 = v_1 = " + vt(s.v) + "$, $\\lVert u_1\\rVert^2 = " + s.n2.tex() + "$</div>";
          if (mode === "predict" && !done && k === phase && !pred[k]) {
            return '<div class="log-step">' + head + "$v_" + (k + 1) + " = " + vt(s.v) + "$. Predict:" + s.coefs.map((c, j) => '<div class="row" style="gap:6px;margin-top:6px">$c_{' + (j + 1) + "} = \\dfrac{\\langle v_" + (k + 1) + ",u_" + (j + 1) + "\\rangle}{\\langle u_" + (j + 1) + ",u_" + (j + 1) + '\\rangle} =$ <input class="mono-in sm-in" data-c="' + j + '"></div>').join("") +
              '<div class="row" style="gap:6px;margin-top:6px">$u_' + (k + 1) + ' =$ <input class="mono-in" data-u style="width:180px" placeholder="(…, …)"></div><button class="btn btn-sm btn-primary" data-check style="margin-top:8px">Check prediction</button><div data-fb></div></div>';
          }
          if (k > phase) return '<div class="log-step muted">' + head + "waiting…</div>";
          return '<div class="log-step">' + head + "$u_" + (k + 1) + " = v_" + (k + 1) + s.coefs.map((c, j) => " - " + (c.sign() < 0 ? "(" + c.tex() + ")" : c.tex()) + "u_" + (j + 1)).join("") + " = " + vt(s.u) + "$ &nbsp; ($\\lVert u_" + (k + 1) + "\\rVert^2 = " + s.n2.tex() + "$)" + (pred[k] ? ' <span class="' + (pred[k].ok ? "okc" : "err") + '">' + (pred[k].ok ? "✓ predicted" : "✗ prediction was off") + "</span>" : "") + "</div>";
        });
        const fin = phase >= steps.length - 1 && t >= 1;
        panel.innerHTML = rows.join("") + (fin ? '<div class="box ex" data-t="Orthonormal basis"><p>$' + steps.map((s, k) => "w_" + (k + 1) + " = \\frac{1}{" + LA.num.sqrtTex(s.n2) + "}" + vt(s.u)).join(",\\quad ") + "$</p><p class=\"small\">Check: $\\langle u_i,u_j\\rangle = 0$ for $i\\neq j$ — " + (steps.every((a, i) => steps.every((b, j) => i === j || dot(a.u, b.u).isZero())) ? "✓ verified exactly" : "✗") + ".</p></div>" + (mode === "predict" ? '<p><b>Prediction score:</b> ' + score[0] + " / " + score[1] + "</p>" : "") : "");
        LA.enhance(panel); LA.renderMath(panel);
        const chk = $("[data-check]", panel);
        if (chk) chk.onclick = () => {
          const k = phase, s = steps[k]; let ok = true, msgs = [];
          s.coefs.forEach((c, j) => { const r = LA.ans.check({ type: "num", answer: c }, $('[data-c="' + j + '"]', panel).value); if (!r.ok) { ok = false; msgs.push("c" + (j + 1) + ": " + r.msg); } });
          const ru = LA.ans.check({ type: "vec", answer: s.u, multiple: true }, $("[data-u]", panel).value); if (!ru.ok) { ok = false; msgs.push("u: " + ru.msg); }
          pred[k] = { ok }; score[1]++; if (ok) score[0]++;
          LA.ev.record({ topic: "gram-schmidt", src: "drill", score: ok ? 1 : 0, gen: "gs-predict" });
          if (!ok) LA.toast("Not quite", msgs.join(" · "));
          run();
        };
      }
      function run() { // animate the current phase from t = 0 to 1
        cancelAnimationFrame(anim); t = 0; const dur = reduce() ? 1 : $("#gsSlow", view).checked ? 2600 : 1200, t0 = performance.now();
        const fr = (now) => { t = Math.min(1, (now - t0) / dur); draw(); if (t < 1) anim = requestAnimationFrame(fr); else render(); };
        anim = requestAnimationFrame(fr);
      }
      const stepOnce = () => { if (!steps.length) return; if (t < 1) return; if (phase < steps.length - 1) { phase++; t = 0; if (mode === "predict" && !pred[phase]) { draw(); render(); return; } run(); } };
      $("#gsStep", view).onclick = stepOnce;
      $("#gsPlay", view).onclick = () => { if (mode === "predict") { stepOnce(); return; } phase = 0; t = 0; run(); let k = 0; const nxt = () => { if (++k < steps.length) setTimeout(() => { if (!document.body.contains(cv)) return; phase = k; run(); nxt(); }, reduce() ? 300 : $("#gsSlow", view).checked ? 3000 : 1500); }; nxt(); };
      $("#gsReset", view).onclick = load;
      $("#gsIn", view).addEventListener("change", load);
      $$("[data-p]", view).forEach((b) => b.addEventListener("click", () => { $("#gsIn", view).value = PRE[+b.dataset.p][0]; load(); }));
      $$("[data-mode]", view).forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; $$("[data-mode]", view).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); load(); }));
      let drag = null;
      cv.addEventListener("mousedown", (e) => { drag = [e.clientX, e.clientY, yaw, pitch]; });
      const gUp = () => { drag = null; };
      window.addEventListener("mouseup", gUp);
      LA.onLeave(() => { window.removeEventListener("mouseup", gUp); window.removeEventListener("mousemove", gMove); });
      window.addEventListener("mousemove", gMove);
      function gMove(e) { if (!drag || dim === 2 || !document.body.contains(cv)) return; yaw = drag[2] + (e.clientX - drag[0]) / 140; pitch = Math.max(-1.2, Math.min(1.4, drag[3] + (e.clientY - drag[1]) / 160)); draw(); }
      LA.setResize(() => { resize(); draw(); });
      resize(); load();
    },
  });
  LA.gsSteps = gs;
})();
