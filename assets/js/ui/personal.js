/* Personal layer: bookmarks, notes, highlights & annotations, focus mode, reading/motion settings,
   keyboard shortcuts help, accessibility helpers, expanded search index and print sheets.
   Everything is stored locally under la2273:* (included in Export / Import). */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const BM = "bookmarks", NOTES = "notes", HL = "highlights", SET = "uiSettings";
  const get = (k, d) => LA.store.get(k, d), put = (k, v) => LA.store.set(k, v);

  /* ---------------- settings: focus mode, motion, font size, line spacing ---------------- */
  const settings = () => Object.assign({ focus: false, motion: "system", font: 100, spacing: "normal" }, get(SET, {}));
  LA.uiSettings = settings;
  LA.applyUI = function () {
    const s = settings(), html = document.documentElement;
    html.classList.toggle("focus-mode", !!s.focus);
    html.classList.toggle("reduce-motion", s.motion === "reduce" || (s.motion === "system" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches));
    html.classList.toggle("calm", s.motion === "reduce" || get("calm", false));
    html.style.setProperty("--fs-scale", (s.font / 100).toFixed(2));
    html.classList.toggle("airy", s.spacing === "airy");
    const fb = $("#focusBtn"); if (fb) { fb.setAttribute("aria-pressed", String(!!s.focus)); fb.title = s.focus ? "Leave focus mode (F)" : "Focus mode (F)"; }
  };
  LA.setUI = (patch) => { put(SET, Object.assign(settings(), patch)); LA.applyUI(); };

  /* ---------------- bookmarks ---------------- */
  LA.bookmarks = () => get(BM, []);
  const isBM = (id) => LA.bookmarks().some((b) => b.id === id);
  LA.toggleBookmark = (b) => { let L = LA.bookmarks(); if (L.some((x) => x.id === b.id)) L = L.filter((x) => x.id !== b.id); else L.push(Object.assign({ t: Date.now() }, b)); put(BM, L); return L.some((x) => x.id === b.id); };

  /* ---------------- highlights ---------------- */
  function applyHighlights(root, key) {
    get(HL, []).filter((h) => h.key === key).forEach((h) => {
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest(".katex, mark.hl, script, textarea, button") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
      let n; while ((n = tw.nextNode())) { const i = n.nodeValue.indexOf(h.text); if (i < 0) continue; const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + h.text.length); const m = document.createElement("mark"); m.className = "hl"; m.dataset.hid = h.id; if (h.note) m.title = h.note; r.surroundContents(m); break; }
    });
  }
  function selectionKey() {
    const sel = window.getSelection(); if (!sel || sel.isCollapsed) return null;
    const node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    const sec = node && node.closest("section[id^='sec-']"); const lesson = node && node.closest(".lesson");
    if (!sec || !lesson) return null;
    return { sec, text: sel.toString().trim(), sel };
  }
  let hlBtn = null;
  function hideHL() { if (hlBtn) { hlBtn.remove(); hlBtn = null; } }
  document.addEventListener("mouseup", (e) => {
    if (e.target.closest && e.target.closest(".hl-pop")) return;
    setTimeout(() => {
      hideHL(); const s = selectionKey(); if (!s || s.text.length < 3 || s.text.length > 400) return;
      const r = s.sel.getRangeAt(0).getBoundingClientRect();
      hlBtn = LA.h('<div class="hl-pop" role="toolbar" aria-label="Highlight"><button class="btn btn-sm" data-h="1">🖍 Highlight</button><button class="btn btn-sm" data-h="2">🖍 + note</button></div>');
      hlBtn.style.top = (window.scrollY + r.top - 44) + "px"; hlBtn.style.left = (window.scrollX + r.left) + "px";
      document.body.appendChild(hlBtn);
      // keep the toolbar on screen when the selection is near the right edge (narrow windows)
      const maxLeft = window.scrollX + document.documentElement.clientWidth - hlBtn.offsetWidth - 8;
      hlBtn.style.left = Math.max(window.scrollX + 8, Math.min(window.scrollX + r.left, maxLeft)) + "px";
      $$("[data-h]", hlBtn).forEach((b) => b.addEventListener("click", () => {
        const { path } = LA.parseHash(); const key = path + "#" + s.sec.id;
        if (s.text.includes("\n") || s.sel.getRangeAt(0).cloneContents().querySelector(".katex")) { LA.toast("Highlight plain text", "Select text within one paragraph (formulas can't be highlighted — bookmark the box instead)."); hideHL(); return; }
        const note = b.dataset.h === "2" ? (prompt("Note for this highlight:") || "") : "";
        const L = get(HL, []); L.push({ id: "h" + Date.now().toString(36), key, path, sec: s.sec.id, text: s.text, note, t: Date.now() }); put(HL, L);
        window.getSelection().removeAllRanges(); hideHL(); applyHighlights(s.sec, key); LA.toast("Highlighted", note ? "Note saved." : "Find all highlights under My Notes.");
      }));
    }, 10);
  });
  document.addEventListener("mousedown", (e) => { if (!(e.target.closest && e.target.closest(".hl-pop"))) hideHL(); });

  /* ---------------- per-page decoration (runs after every route) ---------------- */
  const noteBox = (key, label, href) => { const n = (get(NOTES, {})[key] || {}).text || ""; return '<details class="note-box no-print"' + (n ? " open" : "") + '><summary>📝 ' + label + (n ? " · saved" : "") + '</summary><textarea class="note-ta mono-in" data-note="' + esc(key) + '" data-href="' + esc(href || "") + '" rows="3" placeholder="Your own notes (saved in this browser)" aria-label="' + esc(label) + '">' + esc(n) + "</textarea></details>"; };
  function wireNotes(root) {
    $$("textarea[data-note]", root).forEach((ta) => { let tm; ta.addEventListener("input", () => { clearTimeout(tm); tm = setTimeout(() => { const all = get(NOTES, {}); const { path } = LA.parseHash(); if (ta.value.trim()) all[ta.dataset.note] = { text: ta.value, t: Date.now(), href: ta.dataset.href || "#" + path }; else delete all[ta.dataset.note]; put(NOTES, all); }, 300); }); });
  }
  (LA.afterRoute = LA.afterRoute || []).push(function (view, m, q) {
    const { path } = LA.parseHash();
    // bookmark stars on every titled box inside lessons / theorem pages / topic studio
    $$(".lesson .box[id] > .box-h, .page .box.thm[id] > .box-h", view).forEach((h) => {
      if (h.querySelector(".bm-btn")) return; const box = h.parentElement, id = box.id;
      const btn = document.createElement("button"); btn.className = "bm-btn no-print"; btn.type = "button";
      const set = (on) => { btn.textContent = on ? "★" : "☆"; btn.setAttribute("aria-pressed", String(on)); btn.setAttribute("aria-label", on ? "Remove bookmark" : "Bookmark this"); btn.title = btn.getAttribute("aria-label"); };
      set(isBM(id)); btn.addEventListener("click", () => set(LA.toggleBookmark({ id, title: (box.getAttribute("data-t") || "").replace(/\$/g, ""), tag: LA.boxTag(box), href: "#" + path + "?go=" + id })));
      h.appendChild(btn);
    });
    // notes at the end of each lesson section; highlights re-applied
    if (/^\/ch\//.test(path) && (!q.tab || q.tab === "lesson")) {
      $$(".lesson section[id^='sec-']", view).forEach((sec) => { const key = path.slice(1) + "/" + sec.id.replace(/^sec-/, ""); const done = sec.querySelector(".sec-done"); if (!sec.querySelector(".note-box")) (done || sec).insertAdjacentHTML(done ? "beforebegin" : "beforeend", noteBox(key, "My notes on this section", "#" + path + "?go=" + sec.id)); applyHighlights(sec, path + "#" + sec.id); });
      wireNotes(view);
    }
    if (/^\/learn\/[^/]+$/.test(path)) { const head = $(".studio-head", view); if (head && !head.querySelector(".note-box")) { head.insertAdjacentHTML("beforeend", noteBox("topic:" + path.split("/")[2], "My notes on this topic")); wireNotes(head); } }
    if (/^\/theorem\//.test(path)) { const pg = $(".page", view); if (pg && !pg.querySelector(".note-box")) { pg.insertAdjacentHTML("beforeend", noteBox("thm:" + path.split("/")[2], "My notes on this theorem")); wireNotes(pg); } }
    // move focus to the main region for screen readers (without scrolling)
    const main = $("#view"); if (main && document.activeElement && document.activeElement.closest && document.activeElement.closest("#sidebar")) main.focus({ preventScroll: true });
  });

  /* ---------------- My Notes page ---------------- */
  LA.page("/notes", {
    title: "My Notes", searchTitle: "My notes, bookmarks & highlights", searchDesc: "Everything you saved: bookmarks, section notes, highlights with annotations",
    render() {
      const bm = LA.bookmarks(), notes = get(NOTES, {}), hl = get(HL, []);
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Personal</div><h1>My notes, bookmarks &amp; highlights</h1><p class="lead">Star any definition or theorem (☆ in its header), select text in a lesson to highlight it, and write notes under each section or topic. All saved in this browser and included in your export.</p><div class="row no-print"><button class="btn" onclick="window.print()">🖨️ Print my notes</button><a class="btn" href="#/print">Print sheets</a></div></div></div>' +
        LA.sectionTitle("Bookmarks (" + bm.length + ")") + (bm.length ? '<div class="grid grid-2">' + bm.slice().reverse().map((b) => '<div class="card"><a href="' + b.href + '"><b>' + esc(b.tag ? b.tag + " · " : "") + esc(b.title || b.id) + '</b></a><div class="row small" style="margin-top:6px"><span class="muted">' + new Date(b.t).toLocaleDateString() + '</span><button class="btn btn-sm btn-ghost no-print" data-unbm="' + esc(b.id) + '">Remove</button></div></div>').join("") + "</div>" : '<p class="muted">No bookmarks yet — click ☆ on any box in a lesson.</p>') +
        LA.sectionTitle("Notes (" + Object.keys(notes).length + ")") + (Object.keys(notes).length ? Object.entries(notes).sort((a, b) => b[1].t - a[1].t).map(([k, n]) => '<div class="box note" data-t="' + esc(k.replace(/^topic:/, "Topic · ").replace(/^thm:/, "Theorem · ")) + '"><p style="white-space:pre-wrap">' + esc(n.text) + '</p><p class="small"><a href="' + esc(n.href || "#/") + '">Open ▸</a></p></div>').join("") : '<p class="muted">No notes yet.</p>') +
        LA.sectionTitle("Highlights (" + hl.length + ")") + (hl.length ? hl.slice().reverse().map((h) => '<div class="card hl-card"><mark class="hl">' + esc(h.text) + "</mark>" + (h.note ? '<p class="small">📝 ' + esc(h.note) + "</p>" : "") + '<div class="row small"><a href="#' + h.path + "?go=" + h.sec + '">Open in lesson ▸</a><button class="btn btn-sm btn-ghost no-print" data-unhl="' + h.id + '">Remove</button></div></div>').join("") : '<p class="muted">No highlights yet — select text in any lesson.</p>') + "</div>";
    },
    after(view) {
      $$("[data-unbm]", view).forEach((b) => b.addEventListener("click", () => { put(BM, LA.bookmarks().filter((x) => x.id !== b.dataset.unbm)); LA.route(); }));
      $$("[data-unhl]", view).forEach((b) => b.addEventListener("click", () => { put(HL, get(HL, []).filter((x) => x.id !== b.dataset.unhl)); LA.route(); }));
    },
  });

  /* ---------------- Settings page ---------------- */
  LA.page("/settings", {
    title: "Settings", searchTitle: "Settings & accessibility", searchDesc: "Focus mode, motion, font size, line spacing, theme, data export/import",
    render() {
      const s = settings();
      const seg = (name, val, opts) => '<div class="seg" role="group" aria-label="' + name + '">' + opts.map(([v, l]) => '<button type="button" data-set="' + name + '" data-val="' + v + '" aria-pressed="' + (String(val) === String(v)) + '">' + l + "</button>").join("") + "</div>";
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Personal</div><h1>Settings &amp; accessibility</h1></div></div>' +
        '<div class="card" style="margin-top:14px"><div class="grid grid-2"><div><div class="kicker">Focus mode</div>' + seg("focus", s.focus, [[true, "On"], [false, "Off"]]) + '<p class="small muted">Hides the sidebar and background effects. Shortcut: <kbd>F</kbd>.</p></div>' +
        "<div><div class=\"kicker\">Motion &amp; animation</div>" + seg("motion", s.motion, [["system", "Follow system"], ["reduce", "Reduced"], ["full", "Full"]]) + '<p class="small muted">Reduced turns off confetti, moving backgrounds and transitions (labs jump straight to the end state).</p></div>' +
        "<div><div class=\"kicker\">Text size</div>" + seg("font", s.font, [[90, "90%"], [100, "100%"], [112, "112%"], [125, "125%"]]) + "</div><div><div class=\"kicker\">Line spacing</div>" + seg("spacing", s.spacing, [["normal", "Normal"], ["airy", "Airy"]]) + "</div>" +
        '<div><div class="kicker">Theme</div><button class="btn" id="thToggle">Toggle light / dark</button></div><div><div class="kicker">Lesson depth default</div>' + seg("depth", LA.store.get("depth", "a"), [["f", "Foundation"], ["s", "Standard"], ["a", "Everything"]]) + "</div></div></div>" +
        '<div class="card" style="margin-top:14px"><div class="kicker">Keyboard shortcuts</div>' + shortcutsHTML() + "</div>" +
        '<div class="card" style="margin-top:14px"><div class="kicker">Your data</div><p class="small">No account is needed: everything stays in this browser. Use export/import to back up or move to another device. <a href="#/progress">Progress page ▸</a></p></div></div>';
    },
    after(view) {
      $$("[data-set]", view).forEach((b) => b.addEventListener("click", () => {
        const k = b.dataset.set; let v = b.dataset.val; if (v === "true") v = true; else if (v === "false") v = false; else if (/^\d+$/.test(v)) v = +v;
        if (k === "depth") LA.store.set("depth", v); else LA.setUI({ [k]: v });
        $$('[data-set="' + k + '"]', view).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      }));
      $("#thToggle", view).onclick = () => LA.setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    },
  });
  function shortcutsHTML() { return '<table class="tbl small"><tr><td><kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd> or <kbd>/</kbd></td><td>Search</td></tr><tr><td><kbd>F</kbd></td><td>Toggle focus mode</td></tr><tr><td><kbd>?</kbd></td><td>Show shortcuts</td></tr><tr><td><kbd>←</kbd> <kbd>→</kbd></td><td>Switch Topic Studio modes (when a mode tab is focused)</td></tr><tr><td><kbd>Enter</kbd></td><td>Check an answer</td></tr><tr><td><kbd>1</kbd>–<kbd>4</kbd></td><td>Rate a flashcard</td></tr><tr><td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td><td>Move between controls; the first Tab offers "Skip to content"</td></tr></table>'; }
  document.addEventListener("keydown", (e) => {
    if (/input|textarea|select/i.test((document.activeElement || {}).tagName || "") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "f" || e.key === "F") { if (document.querySelector(".modal-back")) return; LA.setUI({ focus: !settings().focus }); LA.toast(settings().focus ? "Focus mode on" : "Focus mode off", "Press F to toggle."); }
    else if (e.key === "?") { LA.dialog("<h3>Keyboard shortcuts</h3>" + shortcutsHTML()); }
  });

  /* ---------------- print sheets ---------------- */
  LA.page("/print", {
    title: "Print sheets", searchTitle: "Print sheets", searchDesc: "Printable formula sheet, proof sheet, topic sheets and your notes",
    render() {
      return '<div class="page"><div class="hero"><div class="hero-content"><div class="kicker">Print-friendly</div><h1>Print sheets</h1><p class="lead">Clean black-on-white layouts for revision on paper (use your browser\'s Print → Save as PDF).</p></div></div><div class="grid grid-2" style="margin-top:14px">' +
        '<a class="card hover" href="#/formulas"><b>📜 Formula &amp; theorem sheet</b><p class="small muted">Everything on one page.</p></a><a class="card hover" href="#/print/proofs"><b>✍️ Proof sheet</b><p class="small muted">' + (LA.THEOREMS || []).length + ' key theorems with their proofs.</p></a><a class="card hover" href="#/notes"><b>📝 My notes &amp; highlights</b><p class="small muted">Your own annotations.</p></a><div class="card"><b>📘 Topic sheet</b><p class="small muted">Summary, key facts and the lesson extract for one topic.</p><select id="ptSel">' + LA.TOPICS.map((t) => '<option value="' + t.id + '">Ch ' + t.ch + " · " + esc(t.title) + "</option>").join("") + '</select> <button class="btn btn-sm" id="ptGo">Open</button></div></div></div>';
    },
    after(view) { $("#ptGo", view).onclick = () => LA.go("#/print/topic/" + $("#ptSel", view).value); },
  });
  LA.page("/print/proofs", {
    title: "Proof sheet", render() {
      const X = (LA.THEOREMS || []).map((t) => { const tmp = document.createElement("template"); let stmt = "", proof = t.proof ? '<div class="box proof" data-t="Proof">' + t.proof + "</div>" : ""; Object.values(LA.chapters).forEach((c) => c.sections.forEach((s) => { tmp.innerHTML = s.html; const kids = Array.from(tmp.content.children); kids.forEach((el, i) => { const ti = el.getAttribute("data-t") || ""; if (stmt || !(t.num ? ti.startsWith(t.num) : ti.toLowerCase().includes((t.find || "@@").toLowerCase()))) return; stmt = el.outerHTML; for (let j = i + 1; j < kids.length && j < i + 5; j++) if (kids[j].classList.contains("proof")) { proof = kids[j].outerHTML; break; } }); })); return { t, stmt, proof }; });
      return '<div class="page print-sheet"><div class="row spread no-print"><a href="#/print">◂ Print sheets</a><button class="btn btn-primary" onclick="window.print()">🖨️ Print</button></div><h1>MATH2273 — Proof sheet</h1>' + X.map((x) => '<section class="ps-item"><h3>' + esc(x.t.name) + "</h3>" + (x.stmt || "<p>" + x.t.plain + "</p>") + (x.proof || (x.t.proofNote ? '<p class="small">' + x.t.proofNote + "</p>" : "")) + "</section>").join("") + "</div>";
    },
  });
  LA.page("/print/topic/:id", {
    title: "Topic sheet", render(p) {
      const tp = LA.topic(p.id); if (!tp) return '<div class="page"><div class="card">Unknown topic.</div></div>';
      return '<div class="page print-sheet"><div class="row spread no-print"><a href="#/print">◂ Print sheets</a><button class="btn btn-primary" onclick="window.print()">🖨️ Print</button></div><h1>' + esc(tp.title) + '</h1><p class="lead">Chapter ' + tp.ch + " · " + tp.summary + '</p><div class="box thm" data-t="Key facts"><ul>' + tp.key.map((k) => "<li>" + k + "</li>").join("") + '</ul></div><article class="lesson" data-depth="s">' + LA.topicHTML(tp) + "</article></div>";
    },
  });

  /* ---------------- search index additions (built lazily on first search) ---------------- */
  const SX = LA.searchExtra;
  const WORDS = { det: "det", ker: "ker", dim: "dim", Rank: "rank", Nullity: "nullity", Null: "null", Ran: "ran", spn: "span", span: "span", tr: "tr", diag: "diag", lambda: "lambda", perp: "perp", langle: "<", rangle: ">", sqrt: "sqrt", R: "R", P: "P", Lin: "L" };
  const strip = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/\$/g, "").replace(/\\([a-zA-Z]+)/g, (m0, w) => (WORDS[w] ? " " + WORDS[w] + " " : " ")).replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
  LA.TOPICS.forEach((t) => SX.push({ t: "Topic · " + t.title, m: strip(t.summary), href: "#/learn/" + t.id, k: "topic" }));
  (LA.THEOREMS || []).forEach((t) => SX.push({ t: "Theorem · " + t.name, m: strip(t.plain), href: "#/theorem/" + t.id, k: "theorem" }));
  LA.bank.list().forEach((g) => SX.push({ t: "Practice · " + g.title, m: "Chapter " + LA.topic(g.topic).ch + " · " + LA.topic(g.topic).title, href: "#/practice?g=" + g.id + "&d=standard", k: "practice" }));
  (LA.EXAM_QUESTIONS || []).forEach((q) => SX.push({ t: "Exam question · " + q.title, m: q.marks + " marks · " + q.topics.map((x) => LA.topic(x).title).join(", "), href: "#/exams?topic=" + q.topics[0], k: "exam" }));
  (LA.PROOF_TASKS || []).forEach((t) => SX.push({ t: "Prove · " + t.title, m: strip(t.stmt), href: "#/proofs/examiner/" + t.id, k: "proof" }));
  (LA.CLAIMS || []).forEach((c) => SX.push({ t: "Counterexample · " + strip(c.claim).slice(0, 70), m: strip(c.truth), href: "#/counterexamples?id=" + c.id, k: "ce" }));
  (LA.MISTAKES || []).forEach((m) => SX.push({ t: "Mistake · " + strip(m.m), m: strip(m.fix), href: "#/encyclopedia?tab=mistakes&topic=" + m.topic, k: "mistake" }));
  (LA.DRILLS || []).forEach((d) => SX.push({ t: "Drill · " + strip(d.title || d.stmt || d.line).slice(0, 70), m: d.type, href: "#/proofs/drills?type=" + d.type + "&id=" + d.id, k: "drill" }));

  /* ---------------- header buttons & skip link ---------------- */
  function chrome() {
    const hdr = $(".header");
    if (hdr && !$("#focusBtn")) { const b = LA.h('<button class="icon-btn" id="focusBtn" aria-label="Toggle focus mode" title="Focus mode (F)">🎯</button>'); hdr.insertBefore(b, $("#themeBtn")); b.onclick = () => LA.setUI({ focus: !settings().focus }); const s = LA.h('<a class="icon-btn" id="settingsBtn" href="#/settings" aria-label="Settings and accessibility" title="Settings">⚙️</a>'); hdr.insertBefore(s, $("#themeBtn")); }
    LA.applyUI();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", chrome); else chrome();
  if (window.matchMedia) { const mq = window.matchMedia("(prefers-reduced-motion: reduce)"); if (mq.addEventListener) mq.addEventListener("change", LA.applyUI); }
})();
