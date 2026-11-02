/* Exam bank integrity (marks add up, components valid, TeX compiles) and exam builder targets. */
"use strict";
const path = require("path");
const katex = require(path.resolve(__dirname, "../../assets/vendor/katex/katex.min.js"));
module.exports = function (t, LA) {
  const texOK = (html, where) => { const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m; while ((m = re.exec(String(html)))) { if (/[_^]\{?\\(min|max|det|ker|dim|lim|log|sup|inf|tr)\b/.test(m[1] || m[2])) { t.ok(false, where + " operator name in a sub/superscript"); return; } try { katex.renderToString(m[1] || m[2], { displayMode: !!m[1], throwOnError: true, strict: "ignore", macros: Object.assign({}, LA.KATEX_MACROS) }); } catch (e) { t.ok(false, where + " TeX: " + e.message.slice(0, 100)); return; } } t.ok(true, where); };
  const Q = LA.EXAM_QUESTIONS;
  t.ok(Q.length >= 40, "exam bank has " + Q.length + " questions (incl. converted mocks)");
  Q.forEach((q) => {
    t.ok(q.topics.length && q.topics.every((x) => LA.topic(x)), q.id + " topics valid");
    q.parts.forEach((p, k) => {
      const sum = p.s.reduce((s, x) => s + x[0], 0);
      t.eq(sum, p.m, q.id + " part " + k + " scheme marks sum to part marks");
      t.ok(p.s.every((x) => LA.COMPONENTS[x[1]]), q.id + " part " + k + " components valid");
      texOK(p.q, q.id + "/" + k + " q"); texOK(p.a, q.id + "/" + k + " a"); p.s.forEach((x, j) => texOK(x[2], q.id + "/" + k + " s" + j));
    });
  });
  for (const ch of [1, 2, 3, 4, 5, 6, 7, 8]) t.ok(Q.some((q) => q.ch === ch), "written questions exist for chapter " + ch);
  const tot = (ex) => ex.items.reduce((s, it) => s + it.marks, 0);
  for (let s = 1; s <= 25; s++) {
    const f = LA.buildExam({ preset: "final", seed: s }); t.ok(tot(f) >= 92 && tot(f) <= 110, "final seed " + s + " ≈ 100 marks (" + tot(f) + ")"); t.eq(f.minutes, 120, "final is 2 hours");
    t.ok(new Set(f.items.filter((i) => i.kind === "written").map((i) => LA.EXAM_QUESTIONS.find((q) => q.id === i.qid).ch)).size >= 5, "final seed " + s + " spans at least 5 chapters");
    const c = LA.buildExam({ preset: "cw34", seed: s }); t.ok(tot(c) >= 44 && tot(c) <= 58, "cw34 seed " + s + " ≈ 50 marks (" + tot(c) + ")");
    t.ok(c.items.every((it) => (it.kind === "written" ? [3, 4].includes(LA.EXAM_QUESTIONS.find((q) => q.id === it.qid).ch) : [3, 4].includes(LA.topic(it.topic).ch))), "cw34 seed " + s + " only Ch 3–4");
    const ch = LA.buildExam({ preset: "chapter", ch: (s % 8) + 1, seed: s }); t.ok(tot(ch) >= 34 && tot(ch) <= 48, "chapter test seed " + s + " ≈ 40 marks (" + tot(ch) + ")");
    const pr = LA.buildExam({ preset: "proof", seed: s }); t.ok(pr.items.length >= 3 && pr.items.every((it) => it.kind === "written"), "proof paper seed " + s);
    const cp = LA.buildExam({ preset: "comp", seed: s }); t.eq(cp.items.length, 8, "computational sprint has 8 items");
  }
  const a = LA.buildExam({ preset: "final", seed: 77 }), b = LA.buildExam({ preset: "final", seed: 77 });
  t.eq(JSON.stringify(a.items), JSON.stringify(b.items), "exam generation is reproducible from its seed");
};
module.exports.needs = ["core/app.js", "core/mastery.js", "core/topics.js", "tools/maps.js", "data/mocks.js", "practice/bank-core.js", "practice/bank-34.js", "practice/bank-58.js", "exam/bank.js", "exam/exams.js"];
