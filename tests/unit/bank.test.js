/* Generator bank tests: for every generator × difficulty × seed
   - generation succeeds and is deterministic (same seed ⇒ same problem)
   - the model answer passes the problem's own checker (and every part of multi-part problems)
   - question, hints and solution contain only valid TeX (compiled with KaTeX, throwOnError)
   - generators produce variety across seeds */
"use strict";
const path = require("path");
const katex = require(path.resolve(__dirname, "../../assets/vendor/katex/katex.min.js"));
const SEEDS = +(process.env.SEEDS || 40);

function mathSegments(html) {
  const out = []; const s = String(html || "");
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m;
  while ((m = re.exec(s))) out.push({ tex: (m[1] || m[2]).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"), display: !!m[1] });
  return out;
}
module.exports = function (t, LA) {
  const macros = LA.KATEX_MACROS;
  const texOK = (html, where) => {
    for (const seg of mathSegments(html)) {
      try { katex.renderToString(seg.tex, { displayMode: seg.display, throwOnError: true, strict: "ignore", macros: Object.assign({}, macros) }); }
      catch (e) { t.ok(false, where + " TeX error: " + e.message.slice(0, 120) + " in «" + seg.tex.slice(0, 80) + "»"); return; }
    }
    t.ok(true, where);
  };
  const ids = Object.keys(LA.BANK);
  t.ok(ids.length > 0, "bank has generators");
  // every topic has at least one generator
  LA.TOPICS.forEach((tp) => t.ok(ids.some((id) => LA.BANK[id].topic === tp.id), "topic " + tp.id + " has a generator"));
  for (const id of ids) {
    for (const diff of LA.DIFFS) {
      const seen = new Set(); let failed = false;
      for (let seed = 1; seed <= SEEDS && !failed; seed++) {
        const where = id + "/" + diff + "/" + seed;
        let p;
        try { p = LA.bank.make(id, seed, diff); } catch (e) { t.ok(false, where + " threw: " + e.message); failed = true; break; }
        const p2 = LA.bank.make(id, seed, diff);
        t.ok(p.q === p2.q && p.model === p2.model, where + " deterministic");
        t.ok(typeof p.q === "string" && p.q.length > 10, where + " has question");
        t.ok(Array.isArray(p.hints) && p.hints.length === 4 && p.hints.every((h) => typeof h === "string" && h.length), where + " has 4 hints");
        t.ok(typeof p.sol === "string" && p.sol.length > 10, where + " has solution");
        const parts = p.parts || [{ ans: p.ans, model: p.model }];
        parts.forEach((pt, i) => {
          const res = LA.ans.check(pt.ans, pt.model);
          if (!res.ok) { failed = true; t.ok(false, where + " part " + i + " model answer rejected: " + JSON.stringify(pt.model) + " → " + res.msg); }
          else t.ok(true, where);
        });
        if (p.joint) { const j = p.joint(parts.map((x) => x.model)); t.ok(j.ok, where + " joint check accepts model: " + (j.msg || "")); }
        if (p.opts) t.ok(p.opts.length >= 2 && p.ans.answer >= 0 && p.ans.answer < p.opts.length, where + " mcq options valid");
        if (seed <= 12) { texOK(p.q, where + " q"); texOK(p.sol, where + " sol"); p.hints.forEach((h, i) => texOK(h, where + " hint" + i)); (p.opts || []).forEach((o, i) => texOK(o, where + " opt" + i)); }
        seen.add(p.q + JSON.stringify(p.opts || []));
      }
      t.ok(seen.size >= 2, id + "/" + diff + " produces variety (" + seen.size + " distinct)");
    }
  }
};
module.exports.needs = ["core/app.js", "core/mastery.js", "core/topics.js", "tools/maps.js", "practice/bank-core.js", "practice/bank-34.js", "practice/bank-58.js"];
