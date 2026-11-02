/* Spaced-repetition flashcards (SM-2 style scheduling with real dates).
   - A card only counts after an ACTIVE recall attempt and an honest rating (Again / Hard / Good / Easy);
     opening or flipping a card never counts as understanding.
   - Proof-reconstruction cards require writing an outline before the model proof can be revealed.
   - Daily due queue, new-card limit, weak-chapter prioritisation, recall history, custom cards,
     maturity buckets and retention. The previous Leitner boxes are migrated (classic page kept at #/flashcards/classic). */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const DAY = 864e5, MIN = 6e4;
  const KEY = "srs", LOG = "srsLog", CUSTOM = "customCards", SET = "srsSettings";

  /* ---------------- deck ---------------- */
  function typeOf(c) { if (c.type) return c.type; const f = c.f.replace(/\$[^$]*\$/g, ""); return /theorem|lemma|criterion|inequality|law|rule|test|cayley|spectral|rank–nullity|rank-nullity|pythag/i.test(f) ? "theorem" : /formula|shortcut|det|norm|projection|=/.test(c.f) ? "formula" : "definition"; }
  function topicFor(c) {
    const ch = +String(c.ch).replace("ch", ""); const tps = LA.topicsOf(ch); if (!tps.length) return null;
    const words = (c.f + " " + c.b).toLowerCase();
    let best = tps[0], score = -1;
    tps.forEach((t) => { const keys = (t.title + " " + t.id.replace(/-/g, " ")).toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3); const s = keys.reduce((n, w) => n + (words.includes(w) ? 1 : 0), 0); if (s > score) { score = s; best = t; } });
    return best.id;
  }
  LA.srsDeck = function () {
    const base = (LA.CARDS || []).map((c) => Object.assign({}, c, { type: typeOf(c) }));
    const proofs = (LA.PROOF_TASKS || []).map((t) => ({ id: "proof-" + t.id, ch: "ch" + LA.topic(t.topic).ch, f: "Reconstruct the proof: " + t.title, stmt: t.stmt, b: t.model, type: "proof", topic: t.topic }));
    const custom = LA.store.get(CUSTOM, []).map((c) => Object.assign({ type: "custom" }, c));
    return base.concat(proofs, custom).map((c) => Object.assign(c, { topic: c.topic || topicFor(c) }));
  };
  const states = () => LA.store.get(KEY, {});
  const saveStates = (s) => LA.store.set(KEY, s);

  /* migrate Leitner boxes once (box → interval days), spreading the first reviews */
  (function migrate() {
    const st = states(); if (st.__migrated) return;
    const boxes = LA.store.get("flash", {}); const ivl = [0, 1, 3, 7, 14, 30]; const now = Date.now();
    Object.entries(boxes).forEach(([id, b]) => { if (!st[id] && b > 0) st[id] = { ef: 2.5, int: ivl[b] || 1, reps: b, lapses: 0, due: now + Math.floor((ivl[b] || 1) / 2) * DAY, hist: [], migrated: true }; });
    st.__migrated = Date.now(); saveStates(st);
  })();

  /* ---------------- scheduler ---------------- */
  LA.srsSchedule = function (s, rating, now) { // rating: 0 Again, 1 Hard, 2 Good, 3 Easy
    now = now || Date.now();
    s = Object.assign({ ef: 2.5, int: 0, reps: 0, lapses: 0, hist: [] }, s || {});
    s.ef = Math.min(3.0, Math.max(1.3, s.ef + [-0.2, -0.15, 0, 0.15][rating]));
    let days;
    if (rating === 0) { if (s.reps > 0) s.lapses++; s.reps = 0; s.int = 0; s.due = now + 10 * MIN; }
    else {
      if (s.reps === 0) days = rating === 1 ? 1 : rating === 2 ? 1 : 4;
      else if (s.reps === 1 && rating >= 2) days = rating === 3 ? 6 : 3;
      else days = rating === 1 ? Math.max(s.int + 1, Math.round(s.int * 1.2)) : rating === 2 ? Math.max(s.int + 1, Math.round(s.int * s.ef)) : Math.max(s.int + 2, Math.round(s.int * s.ef * 1.3));
      s.reps++; s.int = days; s.due = now + days * DAY;
    }
    s.last = now; s.hist = (s.hist || []).concat([[now, rating]]).slice(-20);
    return s;
  };
  const isNew = (st, c) => !st[c.id];
  const settings = () => Object.assign({ newPerDay: 15 }, LA.store.get(SET, {}));
  const todayKey = (t) => new Date(t || Date.now()).toISOString().slice(0, 10);
  function newDoneToday() { const lg = LA.store.get(LOG, {}); return (lg[todayKey()] || {}).new || 0; }
  function chapterWeakness() { const w = {}; for (let ch = 1; ch <= 8; ch++) { const ms = LA.topicsOf(ch).map((t) => LA.mastery(t.id)); const seen = ms.filter((m) => m.n); w[ch] = seen.length ? 1 - seen.reduce((s, m) => s + m.pct, 0) / seen.length : 0.5; } return w; }
  LA.srsQueue = function (filter) {
    const deck = LA.srsDeck().filter(filter || (() => true)), st = states(), now = Date.now(), weak = chapterWeakness();
    const due = deck.filter((c) => st[c.id] && st[c.id].due <= now).sort((a, b) => { const oa = (now - st[a.id].due) / DAY / Math.max(1, st[a.id].int), ob = (now - st[b.id].due) / DAY / Math.max(1, st[b.id].int); const wa = weak[+String(a.ch).replace("ch", "")] || 0.5, wb = weak[+String(b.ch).replace("ch", "")] || 0.5; return ob + wb - (oa + wa); });
    const room = Math.max(0, settings().newPerDay - newDoneToday());
    // new cards: weakest chapters first, interleaving card types (definition / theorem / formula / proof / custom)
    const pool = deck.filter((c) => isNew(st, c)).sort((a, b) => (weak[+String(b.ch).replace("ch", "")] || 0) - (weak[+String(a.ch).replace("ch", "")] || 0));
    const byType = {}; pool.forEach((c) => (byType[c.type] = byType[c.type] || []).push(c));
    const fresh = []; const types = Object.keys(byType);
    while (fresh.length < Math.min(room, pool.length)) types.forEach((ty) => { if (fresh.length < room && byType[ty].length) fresh.push(byType[ty].shift()); });
    return { due, fresh, deck, st };
  };
  LA.srsDueCount = function () { const q = LA.srsQueue(); return q.due.length + q.fresh.length; };
  function logReview(isNewCard, rating) { const lg = LA.store.get(LOG, {}), k = todayKey(); const d = lg[k] || (lg[k] = { reviews: 0, again: 0, new: 0 }); d.reviews++; if (rating === 0) d.again++; if (isNewCard) d.new++; LA.store.set(LOG, lg); }
  function stats(deck, st) {
    const now = Date.now(), b = { new: 0, learning: 0, young: 0, mature: 0 };
    deck.forEach((c) => { const s = st[c.id]; if (!s) b.new++; else if (s.int < 1) b.learning++; else if (s.int < 21) b.young++; else b.mature++; });
    let rev = 0, ok = 0; deck.forEach((c) => { const s = st[c.id]; if (!s) return; (s.hist || []).forEach(([t, r]) => { if (now - t < 30 * DAY) { rev++; if (r > 0) ok++; } }); });
    const lg = LA.store.get(LOG, {}); let streak = 0; for (let d = 0; d < 400; d++) { const k = todayKey(now - d * DAY); if (lg[k] && lg[k].reviews) streak++; else if (d > 0) break; }
    return { b, retention: rev ? ok / rev : null, rev30: rev, streak };
  }

  /* ---------------- page ---------------- */
  const CH_CHIPS = [["due", "Due now"], ["34", "Ch 3 + 4"], ["all", "Everything"]].concat([1, 2, 3, 4, 5, 6, 7, 8].map((n) => ["ch" + n, "Ch " + n]));
  const filterFor = (k) => (k === "34" ? (c) => c.ch === "ch3" || c.ch === "ch4" : /^ch\d$/.test(k) ? (c) => c.ch === k : () => true);
  LA.page("/flashcards", {
    title: "Flashcards", searchTitle: "Flashcards (spaced repetition)", searchDesc: "Scheduled reviews with real dates: definitions, theorems, formulas, proof reconstruction, your own cards",
    render(p, q) {
      const sel = q.set || "due";
      const { due, fresh, deck, st } = LA.srsQueue(filterFor(sel)), S = stats(LA.srsDeck(), states());
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Spaced repetition · SM-2 scheduling</div><h1>Flashcards</h1><p class="lead">Recall first, then reveal and rate honestly. Cards you know drift weeks into the future; cards you miss come back in 10 minutes. Opening a card never counts — only your rating does.</p>' +
        '<div class="grid grid-4" style="margin-top:12px"><div class="stat"><b>' + (due.length + fresh.length) + '</b><span>to review now</span></div><div class="stat"><b>' + (S.retention === null ? "—" : Math.round(S.retention * 100) + "%") + '</b><span>30-day recall</span></div><div class="stat"><b>' + S.b.mature + '</b><span>mature cards (≥21 days)</span></div><div class="stat"><b>' + S.streak + "</b><span>day streak</span></div></div></div></div>" +
        '<div class="row" style="margin:14px 0">' + CH_CHIPS.map((c) => '<a class="chip ' + (c[0] === sel ? "violet" : "") + '" href="#/flashcards?set=' + c[0] + '">' + c[1] + "</a>").join("") + '<a class="chip" href="#/flashcards/manage">✎ My cards & settings</a><a class="chip" href="#/flashcards/classic">Classic (v1)</a></div>' +
        '<div id="srsHost"></div>' +
        '<div class="card" style="margin-top:16px"><div class="kicker">Long-term memory</div><div class="row" style="margin-top:6px">' + Object.entries(S.b).map(([k, v]) => '<span class="chip ' + { new: "", learning: "red", young: "amber", mature: "lime" }[k] + '">' + k + ": " + v + "</span>").join("") + '</div><p class="small muted" style="margin:.6em 0 0">' + deck.length + " cards in this set · " + due.length + " due · " + fresh.length + " new allowed today (limit " + settings().newPerDay + "/day). Weak chapters (from your practice results) are shown first.</p></div></div>";
    },
    after(view, p, q) {
      const sel = q.set || "due";
      const host = $("#srsHost", view);
      let queue = [], idx = 0;
      const load = () => { const Q0 = LA.srsQueue(filterFor(sel)); queue = Q0.due.concat(Q0.fresh); idx = 0; };
      const next = () => {
        if (idx >= queue.length) { load(); if (!queue.length) { const st = states(); const nxt = LA.srsDeck().filter((c) => st[c.id]).map((c) => st[c.id].due).filter((d) => d > Date.now()).sort((a, b) => a - b)[0]; host.innerHTML = '<div class="card center"><h2>All caught up 🎉</h2><p class="muted">' + (nxt ? "Next card due " + new Date(nxt).toLocaleString() + "." : "Add more cards or pick another set.") + '</p><div class="row" style="justify-content:center"><a class="btn" href="#/flashcards?set=all">Browse everything</a><a class="btn btn-primary" href="#/practice">Practise instead ▸</a></div></div>'; return; } }
        const c = queue[idx++], st = states(), s = st[c.id];
        const proof = c.type === "proof";
        host.innerHTML = '<div class="card srs-card"><div class="row spread"><span class="chip">' + c.ch.replace("ch", "Chapter ") + " · " + c.type + "</span><span class=\"small muted\">" + (s ? "Interval " + (s.int < 1 ? "<1 day" : s.int + " day" + (s.int > 1 ? "s" : "")) + (s.lapses ? " · " + s.lapses + " lapse" + (s.lapses > 1 ? "s" : "") : "") : "New card") + " · " + (queue.length - idx) + ' left</span></div><h2 class="srs-front">' + c.f + "</h2>" + (proof ? "<p>" + c.stmt + "</p>" : "") +
          '<label class="field">' + (proof ? "Write the proof outline from memory (required before revealing)" : "Recall it — type it if you like (optional), then reveal") + '<textarea id="srsTry" class="mono-in" rows="' + (proof ? 5 : 2) + '" spellcheck="false"></textarea></label><div class="row" style="margin-top:8px"><button class="btn btn-primary" id="srsShow">Reveal answer</button>' + (proof ? '<button class="btn btn-ghost" id="srsBlank">I can\'t recall it</button>' : "") + '</div><div id="srsBack"></div></div>';
        LA.renderMath(host);
        const reveal = (forced) => {
          const back = $("#srsBack", host);
          back.innerHTML = '<div class="box ex" data-t="Answer">' + (c.type === "proof" ? c.b : "<p>" + c.b + "</p>") + "</div>" + ($("#srsTry", host).value.trim() ? '<p class="small muted">Compare with what you wrote above — rate the RECALL, not the reading.</p>' : "") +
            '<div class="row" style="margin-top:8px"><button class="btn btn-bad" data-r="0">1 · Again <small>(10 min)</small></button>' + (forced ? "" : '<button class="btn" data-r="1">2 · Hard</button><button class="btn btn-ok" data-r="2">3 · Good</button><button class="btn btn-primary" data-r="3">4 · Easy</button>') + "</div>";
          LA.enhance(back); LA.renderMath(back);
          $$("[data-r]", back).forEach((b) => b.addEventListener("click", () => rate(+b.dataset.r)));
          $("#srsShow", host).disabled = true;
        };
        const rate = (r) => {
          const all = states(), was = all[c.id]; all[c.id] = LA.srsSchedule(was, r); saveStates(all); logReview(!was, r);
          if (c.topic) LA.ev.record({ topic: c.topic, src: "flash", score: [0, 0.6, 1, 1][r], gen: "card:" + c.id });
          LA.state.stats.flash = (LA.state.stats.flash || 0) + 1; LA.addXP(r ? 2 : 1, "Flashcard review");
          if (r === 0) queue.push(c); // see it again this session
          next();
        };
        $("#srsShow", host).onclick = () => { if (proof && $("#srsTry", host).value.trim().length < 20) { LA.toast("Write your outline first", "At least a sentence or two — or press \"I can't recall it\"."); return; } reveal(false); };
        if (proof) $("#srsBlank", host).onclick = () => reveal(true);
        const onKey = (ev) => { if (!document.body.contains(host)) return document.removeEventListener("keydown", onKey); if (/input|textarea/i.test((document.activeElement || {}).tagName || "")) return; const btns = $$("[data-r]", host); if (!btns.length) return; const k = { 1: 0, 2: 1, 3: 2, 4: 3 }[ev.key]; const b = btns.find((x) => +x.dataset.r === k); if (b) b.click(); };
        document.addEventListener("keydown", onKey);
      };
      load(); next();
    },
  });

  LA.page("/flashcards/manage", {
    title: "My cards", render() {
      const cards = LA.store.get(CUSTOM, []), s = settings(), st = states();
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker"><a href="#/flashcards">Flashcards</a></div><h1>My cards &amp; settings</h1></div></div>' +
        '<div class="card" style="margin-top:14px"><div class="kicker">Add a card</div><div class="grid grid-2"><label class="field">Front (question) — $…$ for maths<textarea id="cF" rows="2"></textarea></label><label class="field">Back (answer)<textarea id="cB" rows="2"></textarea></label></div><div class="row" style="margin-top:8px"><label class="field" style="flex-direction:row;align-items:center;gap:8px">Chapter <select id="cCh">' + [1, 2, 3, 4, 5, 6, 7, 8].map((n) => '<option value="ch' + n + '">' + n + "</option>").join("") + '</select></label><button class="btn btn-primary" id="cAdd">Add card</button></div></div>' +
        '<div class="card" style="margin-top:14px"><div class="kicker">Settings</div><label class="field" style="max-width:260px">New cards per day<input type="number" id="nPer" min="0" max="100" value="' + s.newPerDay + '"></label><div class="row" style="margin-top:8px"><button class="btn" id="sSave">Save</button></div></div>' +
        LA.sectionTitle("Your cards (" + cards.length + ")") + (cards.length ? cards.map((c, i) => '<div class="box note" data-t="' + esc(c.ch.replace("ch", "Chapter ")) + (st[c.id] ? " · next review " + new Date(st[c.id].due).toLocaleDateString() : " · new") + '"><p><b>' + c.f + "</b></p><p>" + c.b + '</p><button class="btn btn-sm btn-bad" data-del="' + i + '">Delete</button></div>').join("") : '<p class="muted">No custom cards yet.</p>') + "</div>";
    },
    after(view) {
      $("#cAdd", view).onclick = () => { const f = $("#cF", view).value.trim(), b = $("#cB", view).value.trim(); if (!f || !b) { LA.toast("Fill in both sides", ""); return; } const cards = LA.store.get(CUSTOM, []); cards.push({ id: "u-" + Date.now().toString(36), ch: $("#cCh", view).value, f: esc(f), b: esc(b) }); LA.store.set(CUSTOM, cards); LA.toast("Card added", "It will appear as a new card."); LA.route(); };
      $("#sSave", view).onclick = () => { LA.store.set(SET, Object.assign(settings(), { newPerDay: Math.max(0, Math.min(100, +$("#nPer", view).value || 0)) })); LA.toast("Saved", ""); };
      $$("[data-del]", view).forEach((b) => b.addEventListener("click", () => { const cards = LA.store.get(CUSTOM, []); cards.splice(+b.dataset.del, 1); LA.store.set(CUSTOM, cards); LA.route(); }));
    },
  });
})();
