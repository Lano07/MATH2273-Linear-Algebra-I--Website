/* Adaptive Practice Arena (v2) + reusable problem player (LA.mountProblem) used by the Arena, Topic Studio and exams.
   Evidence is recorded once per problem (first check); hints and early solution views reduce mastery credit. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const XP = { beginner: 6, standard: 10, advanced: 14, challenge: 18 };
  // v1 practice keys → v2 generators (old links keep working; the v1 page lives on at #/practice/classic)
  const V1 = { lin: "lin-check", basis: "std-matrix", ker: "ker-basis", mat: "mat-bases", inv: "inverse-map", rn: "rank-nullity", gs: "gs", gsp: "gs", perp: "perp-basis", norm: "norm", ipcheck: "ip-check", orth: "orth-k" };

  /* ---------------- "Read as" preview of what the checker understood ---------------- */
  function preview(type, input) {
    const A = LA.ans; if (!String(input || "").trim()) return "";
    try {
      if (type === "num") return A.valTex(A.scalar(input));
      if (type === "vec") return "(" + A.vector(input).map(A.valTex).join(", ") + ")";
      if (type === "mat") return "\\begin{pmatrix}" + A.matrix(input).map((r) => r.map(A.valTex).join("&")).join("\\\\") + "\\end{pmatrix}";
      if (type === "span" || type === "vecs") { const L = A.vectorList(input); return L.length ? "\\{" + L.map((v) => "(" + v.map(A.valTex).join(", ") + ")").join(",\\ ") + "\\}" : "\\{0\\}\\ (\\text{basis } \\emptyset)"; }
      if (type === "poly") return A.poly(input, /λ|lambda/.test(input) ? "lambda" : "x").tex({ v: /λ|lambda/.test(input) ? "\\lambda" : "x", desc: true });
      if (type === "polyspan" || type === "polys") return A.polyList(input).map((p) => p.tex({ desc: true })).join(",\\ ");
      if (type === "set") { const s = A.norm(input).replace(/^\(|\)$/g, ""); if (/^(∅|none|empty|)$/i.test(s)) return "\\emptyset"; return "\\{" + A.splitTop(s, ",;").map((x) => A.valTex(A.scalar(x))).join(", ") + "\\}"; }
      if (type === "expr") return null;
    } catch (e) { return "\\text{(can't read yet)}"; }
    return null;
  }
  const typeOf = (ans) => (ans.type === "custom" ? ans.view || null : ans.type);

  /* ---------------- reusable problem player ---------------- */
  // opts: { src: "practice"|"exam"|..., onNext(), onResult(res), retryOf, compact, noNext, record:true }
  LA.mountProblem = function (host, p, opts) {
    opts = opts || {};
    const parts = p.parts || [{ ans: p.ans, model: p.model, opts: p.opts, tf: p.tf, input: p.input, ph: p.ph }];
    const tp = LA.topic(p.topic);
    const st = { hints: 0, sol: false, checked: false, done: false };
    const link = "#/practice?g=" + p.id + "&d=" + p.diff + "&s=" + p.seed;
    host.innerHTML =
      '<div class="card problem glow">' +
      '<div class="row spread prob-head"><div class="row" style="gap:6px">' + (tp ? '<a class="chip violet" href="#/learn/' + tp.id + '">Ch ' + tp.ch + " · " + esc(tp.title) + "</a>" : "") + '<span class="chip">' + esc(p.title) + '</span><span class="chip ' + { beginner: "lime", standard: "cyan", advanced: "amber", challenge: "pink" }[p.diff] + '">' + LA.DIFF_LABEL[p.diff] + "</span>" + (opts.retryOf ? '<span class="chip red">🔁 Retry</span>' : "") + "</div>" +
      '<a class="seed-link small muted" href="' + link + '" title="Permanent link to exactly this problem (generator · difficulty · seed)">#' + p.id + "·" + p.seed + "</a></div>" +
      '<div class="prob-q">' + p.q + "</div>" +
      parts.map((pt, i) => {
        const lab = parts.length > 1 ? '<div class="part-label"><b>(' + "abcdef"[i] + ")</b> " + (pt.label || "") + "</div>" : "";
        let ui;
        if (pt.ans.type === "mcq") ui = '<div class="quiz-opts">' + (pt.opts || p.opts).map((o, k) => '<button class="quiz-opt" data-part="' + i + '" data-o="' + k + '"><span class="lt">' + "ABCDEFGH"[k] + "</span><span>" + o + "</span></button>").join("") + "</div>";
        else if (pt.ans.type === "tf") { const L = pt.tf || p.tf || ["True", "False"]; ui = '<div class="row tf-row"><button class="btn tf" data-part="' + i + '" data-tf="true">' + L[0] + '</button><button class="btn tf" data-part="' + i + '" data-tf="false">' + L[1] + "</button></div>"; }
        else {
          const area = (pt.input || p.input) === "area";
          const ph = pt.ph || p.ph || (LA.ans.FORMAT[pt.ans.type] || "").replace(/^Examples?: /, "");
          ui = '<div class="ans-row">' + (area ? '<textarea class="ans-in mono-in" data-part="' + i + '" rows="3" placeholder="' + esc(ph) + '" spellcheck="false"></textarea>' : '<input type="text" class="ans-in mono-in" data-part="' + i + '" placeholder="' + esc(ph) + '" autocomplete="off" spellcheck="false">') + '</div><div class="readas small muted" data-ra="' + i + '"></div>';
        }
        return '<div class="part" data-pi="' + i + '">' + lab + ui + '<div class="part-fb" data-fb="' + i + '"></div></div>';
      }).join("") +
      '<div class="row prob-actions">' + (parts.some((pt) => !["mcq", "tf"].includes(pt.ans.type)) ? '<button class="btn btn-primary" data-act="check">Check answer</button>' : "") +
      '<button class="btn" data-act="hint">💡 Hint 1/4</button><button class="btn btn-ghost" data-act="sol">Show solution</button>' + (parts.some((pt) => !["mcq", "tf"].includes(pt.ans.type)) ? '<button class="btn btn-ghost" data-act="keys" aria-pressed="false">⌨ Symbols</button>' : "") +
      (opts.noNext ? "" : '<button class="btn" data-act="next" style="margin-left:auto">New problem ▸</button>') + "</div>" +
      '<div class="keys-host" hidden></div><div class="fb-main" aria-live="polite"></div><div class="hints"></div><div class="sol-host"></div></div>';
    const card = $(".problem", host);
    const fbMain = $(".fb-main", card), hintsEl = $(".hints", card), solEl = $(".sol-host", card);
    const keysHost = $(".keys-host", card); keysHost.appendChild(LA.mathKeys(card, "answer"));
    const values = parts.map(() => null);

    // live "read as" preview
    $$(".ans-in", card).forEach((inp) => {
      const i = +inp.dataset.part, ra = $('[data-ra="' + i + '"]', card), ty = typeOf(parts[i].ans);
      let tmr;
      inp.addEventListener("input", () => { clearTimeout(tmr); tmr = setTimeout(() => { const t = ty ? preview(ty, inp.value) : null; ra.innerHTML = t ? "Read as: " + LA.tex(t) : ""; }, 180); });
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && inp.tagName === "INPUT") { e.preventDefault(); doCheck(); } });
    });
    const showFB = (i, res) => { const el = $('[data-fb="' + i + '"]', card); el.innerHTML = '<span class="' + (res.ok ? "okc" : "err") + '">' + (res.ok ? "✓ " : "✗ ") + esc(res.msg || "") + "</span>" + (res.items ? '<ul class="small">' + res.items.map((it) => "<li>" + (it.ok ? "✓" : "○") + " " + esc(it.label) + "</li>").join("") + "</ul>" : ""); LA.renderMath(el); };
    function evaluate() {
      const res = parts.map((pt, i) => { const v = values[i]; return v === null || v === undefined || v === "" ? { ok: false, score: 0, msg: "No answer yet.", empty: true } : LA.ans.check(pt.ans, v); });
      let joint = null;
      if (p.joint && res.every((x) => x.ok)) joint = p.joint(values);
      const ok = res.every((x) => x.ok) && (!joint || joint.ok);
      const score = res.reduce((s, x) => s + (x.ok ? 1 : x.score || 0), 0) / parts.length * (joint && !joint.ok ? 0.75 : 1);
      return { res, joint, ok, score };
    }
    function finish(r) {
      res2ui(r);
      const first = !st.checked; st.checked = true;
      if (first && opts.record !== false) {
        const tag = r.ok ? null : (r.res.find((x) => !x.ok) || r.joint || {}).msg;
        LA.ev.record({ topic: p.topic, src: opts.src || "practice", score: r.ok ? 1 : r.score, hints: st.hints, sol: st.sol, gen: p.id, seed: p.seed, diff: p.diff });
        if (!r.ok) LA.mist.add({ topic: p.topic, gen: p.id, seed: p.seed, diff: p.diff, title: p.title, msg: tag || "", src: opts.src || "practice" });
        else { LA.mist.resolveBySeed(p.id, p.seed); if (!st.sol) { const xp = Math.max(2, XP[p.diff] - 2 * st.hints); LA.addXP(xp, "Correct" + (st.hints ? " (with hints)" : " first try")); } LA.stat("practice"); }
        if (opts.onResult) opts.onResult(r, st);
      } else if (r.ok && !st.done) { fbMain.insertAdjacentHTML("beforeend", '<div class="small muted">Corrected ✓ — the first attempt is what counts for mastery; this problem stays in your retry queue until you get it right first time.</div>'); }
      if (r.ok) { st.done = true; if (!st.sol) revealSol(false); }
    }
    function res2ui(r) {
      r.res.forEach((x, i) => { if (!x.empty || parts.length === 1) showFB(i, x); });
      fbMain.innerHTML = r.ok ? '<div class="verdict ok">✓ Correct' + (st.hints ? " (" + st.hints + " hint" + (st.hints > 1 ? "s" : "") + " used)" : "") + "</div>" + (r.joint ? '<div class="small">' + esc(r.joint.msg) + "</div>" : "")
        : '<div class="verdict bad">' + (r.res.some((x) => x.parseError) ? "Couldn't read part of your answer — check the format." : "Not yet. Read the feedback, then try again or take a hint.") + "</div>" + (r.joint && !r.joint.ok ? '<div class="small err">' + esc(r.joint.msg) + "</div>" : "");
      LA.renderMath(fbMain);
    }
    function doCheck() {
      parts.forEach((pt, i) => { const inp = $('.ans-in[data-part="' + i + '"]', card); if (inp) values[i] = inp.value; });
      if (parts.some((pt, i) => values[i] === null || values[i] === undefined || values[i] === "")) { fbMain.innerHTML = '<div class="small muted">Answer every part first.</div>'; return; }
      const r = evaluate(); if (r.ok || st.checked) lockChoices(r); finish(r);
    }
    const pureChoice = parts.every((pt) => ["mcq", "tf"].includes(pt.ans.type));
    const lockChoices = (r) => {
      parts.forEach((pt, i) => {
        if (pt.ans.type === "mcq") $$('[data-o][data-part="' + i + '"]', card).forEach((x, kk) => { x.disabled = true; if (kk === pt.ans.answer) x.classList.add("correct"); else if (kk === values[i]) x.classList.add("wrong"); });
        if (pt.ans.type === "tf") $$('[data-tf][data-part="' + i + '"]', card).forEach((x) => { x.disabled = true; const v = x.dataset.tf === "true"; if (v === pt.ans.answer) x.classList.add("btn-ok"); else if (v === values[i]) x.classList.add("btn-bad"); });
      });
    };
    const choose = (i, v, b, sel) => {
      values[i] = v;
      $$(sel + '[data-part="' + i + '"]', card).forEach((x) => x.classList.toggle("sel", x === b));
      if (pureChoice && values.every((x) => x !== null)) { const r = evaluate(); lockChoices(r); finish(r); }
    };
    $$("[data-o]", card).forEach((b) => b.addEventListener("click", () => choose(+b.dataset.part, +b.dataset.o, b, "[data-o]")));
    $$("[data-tf]", card).forEach((b) => b.addEventListener("click", () => choose(+b.dataset.part, b.dataset.tf === "true", b, "[data-tf]")));
    const btn = (a) => $('[data-act="' + a + '"]', card);
    if (btn("check")) btn("check").onclick = doCheck;
    btn("hint").onclick = () => {
      if (st.hints < p.hints.length) {
        st.hints++;
        hintsEl.insertAdjacentHTML("beforeend", '<div class="box tip hint-box" data-t="Hint ' + st.hints + " of " + p.hints.length + '">' + ["<b>Idea / theorem:</b> ", "<b>First move:</b> ", "<b>Next step:</b> ", "<b>Partial answer:</b> "][st.hints - 1] + p.hints[st.hints - 1] + "</div>");
        LA.enhance(hintsEl); LA.renderMath(hintsEl);
        btn("hint").textContent = st.hints < p.hints.length ? "💡 Hint " + (st.hints + 1) + "/4" : "📖 Full solution";
      } else revealSol(true);
    };
    function revealSol(early) {
      if (solEl.innerHTML) return;
      if (early && !st.checked) st.sol = true;
      solEl.innerHTML = '<div class="box ex" data-t="Full worked solution">' + p.sol + "</div>" + (early && !st.checked ? '<p class="small muted">Solution viewed before answering — fine for learning, but this problem won\'t count towards mastery. Try a fresh one of the same type next.</p>' : "");
      LA.enhance(solEl); LA.renderMath(solEl);
      btn("sol").disabled = true; btn("hint").disabled = true;
    }
    btn("sol").onclick = () => revealSol(true);
    if (btn("keys")) btn("keys").onclick = () => { keysHost.hidden = !keysHost.hidden; btn("keys").setAttribute("aria-pressed", String(!keysHost.hidden)); };
    if (btn("next")) btn("next").onclick = () => opts.onNext && opts.onNext();
    LA.renderMath(card);
    return { state: st, card };
  };

  /* ---------------- choosing the next problem ---------------- */
  const autoDiff = (topic) => { const m = LA.mastery(topic); return ["beginner", "beginner", "standard", "advanced", "challenge"][m.level]; };
  function pickAdaptive(rng) {
    const focus = LA.store.get("focusChapters", [3, 4]);
    const scored = LA.TOPICS.map((t) => { const m = LA.mastery(t.id); let w = m.n ? 1.2 - m.pct : 0.6; if (focus.includes(t.ch)) w *= 1.6; if (LA.mist.list({ open: true, topic: t.id }).length) w *= 1.4; if (m.level >= 4) w *= 0.25; return { t, w: Math.max(0.05, w) }; });
    const tot = scored.reduce((s, x) => s + x.w, 0); let u = rng.next() * tot;
    for (const x of scored) { u -= x.w; if (u <= 0) return x.t; }
    return scored[0].t;
  }
  function nextFor(q) {
    const rng = LA.RNG(LA.newSeed());
    const mode = q.mode || (q.topic ? "topic" : q.ch ? "mixed" : "adaptive");
    let gen, topic;
    if (mode === "topic" && q.topic) { const g = LA.bank.forTopic(q.topic); gen = rng.pick(g); topic = q.topic; }
    else if (mode === "mixed") { const chs = String(q.ch || "3,4").split(",").map(Number); const g = LA.bank.list().filter((d) => chs.includes(LA.topic(d.topic).ch)); gen = rng.pick(g); topic = gen.topic; }
    else { topic = pickAdaptive(rng).id; gen = rng.pick(LA.bank.forTopic(topic)); }
    const d = q.d && q.d !== "auto" ? q.d : autoDiff(topic);
    return LA.bank.make(gen.id, LA.newSeed(), d);
  }

  /* ---------------- page ---------------- */
  LA.page("/practice", {
    title: "Practice Arena", searchTitle: "Adaptive Practice Arena", searchDesc: "Unlimited problems on every topic: 4 difficulty levels, exact answer checking, hints, mistake tracking",
    render(params, q) {
      if (q.t && V1[q.t]) { q.g = V1[q.t]; } else if (q.t) { setTimeout(() => LA.go("#/practice/classic?t=" + q.t), 0); }
      const mode = q.g ? "link" : q.mode || (q.topic ? "topic" : q.ch ? "mixed" : "adaptive");
      const open = LA.mist.list({ open: true });
      const tabs = [["adaptive", "🧠 Adaptive"], ["topic", "🎯 By topic"], ["mixed", "🔀 Mixed chapters"], ["retry", "🔁 Retry mistakes" + (open.length ? " (" + open.length + ")" : "")]];
      const diffs = ["auto"].concat(LA.DIFFS);
      const chs = Object.values(LA.chapters).sort((a, b) => a.num - b.num);
      const curD = q.d || "auto";
      const topicSel = '<select id="topicSel" aria-label="Topic">' + chs.map((c) => '<optgroup label="Chapter ' + c.num + " · " + esc(c.short || c.title) + '">' + LA.topicsOf(c.num).map((t) => '<option value="' + t.id + '"' + (q.topic === t.id ? " selected" : "") + ">" + esc(t.title) + "</option>").join("") + "</optgroup>").join("") + "</select>";
      const chSel = String(q.ch || "3,4").split(",");
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Every chapter · ' + LA.bank.list().length + ' question types · 4 difficulty levels</div><h1>Adaptive Practice Arena</h1>' +
        '<p class="lead">Fresh problems every time, checked for <b>mathematical equivalence</b> (any correct basis, any eigenvector multiple, any equivalent fraction). Hints come in four steps; mistakes go into a retry queue; every problem has a permanent link.</p></div></div>' +
        '<div class="card" style="margin-top:16px"><div class="tabs" role="tablist" style="margin:0 0 12px">' + tabs.map((t) => '<a class="tab ' + (mode === t[0] ? "active" : "") + '" href="#/practice?mode=' + t[0] + (q.d ? "&d=" + q.d : "") + '">' + t[1] + "</a>").join("") + '<a class="tab" href="#/practice/classic">Classic (v1)</a></div>' +
        '<div class="row" style="gap:14px;align-items:center">' +
        '<span class="small muted">Difficulty</span><div class="seg" role="group" aria-label="Difficulty">' + diffs.map((d) => '<button type="button" data-diff="' + d + '" aria-pressed="' + (d === curD) + '">' + (d === "auto" ? "Auto (from mastery)" : LA.DIFF_LABEL[d]) + "</button>").join("") + "</div>" +
        (mode === "topic" ? '<span class="small muted">Topic</span>' + topicSel : "") +
        (mode === "mixed" ? '<span class="small muted">Chapters</span><div class="row" style="gap:4px">' + chs.map((c) => '<button type="button" class="chip ' + (chSel.includes(String(c.num)) ? "violet" : "") + '" data-ch="' + c.num + '">' + c.num + "</button>").join("") + "</div>" : "") +
        "</div></div>" +
        '<div class="grid arena-grid" style="margin-top:16px"><div id="probHost"></div><aside class="arena-side">' +
        '<div class="card"><div class="kicker">This session</div><div class="grid grid-3" style="margin-top:8px"><div class="stat"><b id="sAtt">0</b><span>answered</span></div><div class="stat"><b id="sOk">0</b><span>first-try correct</span></div><div class="stat"><b id="sStreak">0</b><span>streak</span></div></div></div>' +
        '<div class="card" style="margin-top:12px" id="sideTopic"></div>' +
        '<div class="card" style="margin-top:12px"><div class="kicker">How checking works</div><ul class="small" style="margin:.4em 0 0;padding-left:1.1em"><li>Numbers: exact (fractions, surds like <code>sqrt(2)/2</code>, complex <code>1+2i</code>).</li><li>Vectors <code>(1,-2,3)</code>; matrices <code>1 2; 3 4</code>.</li><li>Bases: any basis of the right subspace is accepted.</li><li>Mastery counts your <b>first</b> attempt; hints reduce credit; viewing the solution first gives none.</li></ul></div>' +
        "</aside></div></div>";
    },
    after(view, params, q) {
      const host = $("#probHost", view);
      const sess = { att: 0, ok: 0, streak: 0 };
      const upd = () => { $("#sAtt", view).textContent = sess.att; $("#sOk", view).textContent = sess.ok; $("#sStreak", view).textContent = sess.streak; };
      const side = (p) => { const tp = LA.topic(p.topic); const el = $("#sideTopic", view); if (!tp) return; el.innerHTML = '<div class="kicker">Topic</div><h3 style="margin:.2em 0">' + esc(tp.title) + "</h3>" + LA.masteryChip(tp.id) + '<p class="small muted" style="margin:.6em 0">' + tp.summary + '</p><div class="row"><a class="btn btn-sm" href="#/learn/' + tp.id + '">📖 Learn it</a>' + (tp.labs[0] ? '<a class="btn btn-sm" href="' + tp.labs[0][1] + '">🔬 Lab</a>' : "") + "</div>"; LA.renderMath(el); };
      const mode = q.g ? "link" : q.mode || (q.topic ? "topic" : q.ch ? "mixed" : "adaptive");
      const qq = Object.assign({}, q);
      const onResult = (r) => { sess.att++; if (r.ok) { sess.ok++; sess.streak++; } else sess.streak = 0; upd(); side(cur); };
      let cur;
      const show = (p, extra) => { cur = p; LA.mountProblem(host, p, Object.assign({ src: "practice", onNext: next, onResult }, extra || {})); side(p); };
      function next() {
        if (mode === "retry") {
          const open = LA.mist.list({ open: true }).sort((a, b) => a.t - b.t);
          if (!open.length) { host.innerHTML = '<div class="card center"><h2>No open mistakes 🎉</h2><p class="muted">Everything you got wrong has since been answered correctly first time. Keep going in Adaptive mode.</p><a class="btn btn-primary" href="#/practice?mode=adaptive">Adaptive practice ▸</a></div>'; return; }
          const m = open.find((x) => LA.BANK[x.gen]) || null;
          if (!m) { host.innerHTML = '<div class="card">Your open mistakes come from exams or drills; review them on the <a href="#/progress">progress page</a>.</div>'; return; }
          show(LA.bank.make(m.gen, m.seed, m.diff), { retryOf: m.id });
          host.insertAdjacentHTML("afterbegin", '<div class="card small" style="margin-bottom:10px">🔁 Retry queue: ' + open.length + " open · you missed this on " + new Date(m.t).toLocaleDateString() + (m.fails > 1 ? " (" + m.fails + " times)" : "") + (m.msg ? ' · feedback was: <i>' + esc(m.msg) + "</i>" : "") + "</div>");
          return;
        }
        show(nextFor(Object.assign({}, qq, { mode })));
      }
      const ts = $("#topicSel", view); if (ts) { if (!qq.topic) qq.topic = ts.value; ts.addEventListener("change", () => { qq.topic = ts.value; next(); }); }
      if (mode === "link") { try { show(LA.bank.make(q.g, q.s || LA.newSeed(), q.d || "standard")); } catch (e) { host.innerHTML = '<div class="card">Unknown problem link.</div>'; } }
      else next();
      upd();
      $$("[data-diff]", view).forEach((b) => b.addEventListener("click", () => { qq.d = b.dataset.diff; $$("[data-diff]", view).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); if (mode !== "retry") next(); }));
      $$("[data-ch]", view).forEach((b) => b.addEventListener("click", () => { b.classList.toggle("violet"); const sel = $$("[data-ch]", view).filter((x) => x.classList.contains("violet")).map((x) => x.dataset.ch); qq.ch = sel.length ? sel.join(",") : "3,4"; next(); }));
    },
  });
})();
