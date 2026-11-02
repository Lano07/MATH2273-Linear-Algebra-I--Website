/* Concept dependency map: every topic as a node (coloured by mastery), arrows from prerequisites.
   Hover/focus a node to light up what it builds on (violet) and what depends on it (pink).
   A text "learning path" (topological order) is provided as an accessible alternative. */
(function () {
  "use strict";
  const LA = window.LA;
  const { $, $$, esc } = LA;
  const COLW = 196, ROWH = 66, NW = 160, NH = 46, PAD = 26;
  const FILL = ["rgba(148,163,184,.10)", "rgba(251,113,133,.16)", "rgba(251,191,36,.18)", "rgba(34,211,238,.18)", "rgba(163,230,53,.22)"];
  const STROKE = ["var(--border-strong)", "var(--red)", "var(--amber)", "var(--cyan)", "var(--lime)"];
  function layout() {
    const pos = {}; let maxRows = 0;
    for (let ch = 1; ch <= 8; ch++) { const tps = LA.topicsOf(ch); tps.forEach((t, i) => { pos[t.id] = { x: PAD + (ch - 1) * COLW, y: PAD + 30 + i * ROWH, t }; }); maxRows = Math.max(maxRows, tps.length); }
    return { pos, W: PAD * 2 + 7 * COLW + NW, H: PAD * 2 + 30 + maxRows * ROWH };
  }
  function wrap(s, n) { const w = s.split(" "), out = [""]; w.forEach((x) => { if ((out[out.length - 1] + " " + x).trim().length > n && out[out.length - 1]) out.push(x); else out[out.length - 1] = (out[out.length - 1] + " " + x).trim(); }); return out.slice(0, 2); }
  function topo() { const seen = new Set(), out = []; const visit = (t) => { if (seen.has(t.id)) return; seen.add(t.id); t.prereq.map(LA.topic).filter(Boolean).forEach(visit); out.push(t); }; LA.TOPICS.forEach(visit); return out; }
  LA.page("/map", {
    title: "Concept Map", searchTitle: "Concept dependency map", searchDesc: "How every topic builds on the others, coloured by your mastery",
    render() {
      const { pos, W, H } = layout();
      const edges = [];
      LA.TOPICS.forEach((t) => t.prereq.forEach((p) => { const a = pos[p], b = pos[t.id]; if (!a || !b) return; let d; if (a.x === b.x) { const x = a.x - 18; d = "M" + a.x + "," + (a.y + NH / 2) + " C" + x + "," + (a.y + NH / 2) + " " + x + "," + (b.y + NH / 2) + " " + b.x + "," + (b.y + NH / 2); } else { const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2, mx = (x1 + x2) / 2; d = "M" + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + (x2 - 6) + "," + y2; } edges.push('<path class="cm-edge" data-from="' + p + '" data-to="' + t.id + '" d="' + d + '" marker-end="url(#cmArrow)"/>'); }));
      const nodes = LA.TOPICS.map((t) => { const p = pos[t.id], m = LA.mastery(t.id); const lines = wrap(t.title, 22); return '<a href="#/learn/' + t.id + '" class="cm-node" data-id="' + t.id + '" aria-label="' + esc(t.title) + ": " + m.label + '"><rect x="' + p.x + '" y="' + p.y + '" width="' + NW + '" height="' + NH + '" rx="10" fill="' + FILL[m.level] + '" stroke="' + STROKE[m.level] + '"/>' + lines.map((l, i) => '<text x="' + (p.x + NW / 2) + '" y="' + (p.y + (lines.length === 1 ? 27 : 19 + i * 15)) + '" text-anchor="middle" class="cm-t">' + esc(l) + "</text>").join("") + "</a>"; }).join("");
      const heads = [1, 2, 3, 4, 5, 6, 7, 8].map((ch) => '<text x="' + (PAD + (ch - 1) * COLW + NW / 2) + '" y="' + (PAD + 10) + '" text-anchor="middle" class="cm-h">Ch ' + ch + " · " + esc((LA.chapters["ch" + ch] || {}).short || "") + "</text>").join("");
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Reference</div><h1>Concept Map</h1><p class="lead">Arrows point from a topic to the topics that build on it. Hover or focus a topic to see its prerequisites (violet) and what depends on it (pink); click to open it in the Topic Studio. Colours show your mastery.</p><div class="row">' + LA.MASTERY_LABELS.map((l, i) => '<span class="chip" style="border-color:' + STROKE[i] + ';background:' + FILL[i] + '">' + l + "</span>").join("") + "</div></div></div>" +
        '<div class="card cm-wrap" style="margin-top:14px"><svg class="cm" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="Topic dependency graph"><defs><marker id="cmArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="cm-ah"/></marker></defs>' + heads + edges.join("") + nodes + "</svg></div>" +
        LA.sectionTitle("Learning path (prerequisites first)") + '<ol class="cm-path">' + topo().map((t) => "<li><a href=\"#/learn/" + t.id + '">' + esc(t.title) + "</a> " + LA.masteryChip(t.id) + (t.prereq.length ? ' <span class="small muted">needs ' + t.prereq.map((p) => esc((LA.topic(p) || {}).title || p)).join(", ") + "</span>" : "") + "</li>").join("") + "</ol></div>";
    },
    after(view) {
      const anc = (id, acc) => { (LA.topic(id).prereq || []).forEach((p) => { if (!acc.has(p)) { acc.add(p); anc(p, acc); } }); return acc; };
      const desc = (id, acc) => { LA.TOPICS.filter((t) => t.prereq.includes(id)).forEach((t) => { if (!acc.has(t.id)) { acc.add(t.id); desc(t.id, acc); } }); return acc; };
      const svg = $("svg.cm", view);
      const on = (id) => { const A = anc(id, new Set()), Dd = desc(id, new Set()); svg.classList.add("focus"); $$(".cm-node", svg).forEach((n) => { const k = n.dataset.id; n.classList.toggle("is-self", k === id); n.classList.toggle("is-anc", A.has(k)); n.classList.toggle("is-desc", Dd.has(k)); }); $$(".cm-edge", svg).forEach((e) => { e.classList.toggle("e-anc", A.has(e.dataset.from) && (A.has(e.dataset.to) || e.dataset.to === id)); e.classList.toggle("e-desc", (Dd.has(e.dataset.to)) && (Dd.has(e.dataset.from) || e.dataset.from === id)); }); };
      const off = () => { svg.classList.remove("focus"); $$(".cm-node, .cm-edge", svg).forEach((n) => n.classList.remove("is-self", "is-anc", "is-desc", "e-anc", "e-desc")); };
      $$(".cm-node", svg).forEach((n) => { n.addEventListener("mouseenter", () => on(n.dataset.id)); n.addEventListener("focus", () => on(n.dataset.id)); n.addEventListener("mouseleave", off); n.addEventListener("blur", off); });
    },
  });
})();
