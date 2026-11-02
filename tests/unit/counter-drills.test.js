/* Counterexample Lab verifiers (exact) and proof drills data integrity. */
"use strict";
module.exports = function (t, LA) {
  const C = (id) => LA.CLAIMS.find((c) => c.id === id);
  const yes = (id, inp) => { let r; try { r = C(id).verify(inp); } catch (e) { r = { ok: false, msg: e.message }; } t.ok(r.ok, id + " accepts valid counterexample " + JSON.stringify(inp) + " (" + r.msg + ")"); };
  const no = (id, inp) => { let r; try { r = C(id).verify(inp); } catch (e) { r = { ok: false }; } t.ok(!r.ok, id + " rejects non-counterexample " + JSON.stringify(inp)); };
  yes("det-add", ["1 0; 0 0", "0 0; 0 1"]); no("det-add", ["1 0; 0 0", "0 0; 0 0"]);
  yes("comm", ["0 1; 0 0", "0 0; 1 0"]); no("comm", ["1 0; 0 1", "2 3; 4 5"]);
  yes("zero-div", ["1 0; 0 0", "0 0; 0 1"]); no("zero-div", ["1 0; 0 1", "0 0; 0 0"]);
  yes("idem", ["1 0; 0 0"]); no("idem", ["1 0; 0 1"]); no("idem", ["1 1; 0 1"]);
  yes("nilp", ["0 1; 0 0"]); no("nilp", ["0 0; 0 0"]);
  yes("inv-sum", ["1 0; 0 1", "-1 0; 0 -1"]); no("inv-sum", ["1 0; 0 1", "1 0; 0 1"]);
  yes("det-scale", ["2", "1 0; 0 1"]); no("det-scale", ["1", "1 2; 3 4"]);
  yes("real-eig", ["0 -1; 1 0"]); no("real-eig", ["2 1; 1 2"]);
  yes("rep-diag", ["3 0; 0 3"]); no("rep-diag", ["1 1; 0 1"]); no("rep-diag", ["1 0; 0 2"]);
  yes("same-eig", ["1 0; 0 1", "1 1; 0 1"]); no("same-eig", ["1 0; 0 2", "2 0; 0 1"]); no("same-eig", ["1 0; 0 1", "2 0; 0 2"]);
  yes("union", ["(1,0)", "(0,1)"]); no("union", ["(1,2)", "(2,4)"]);
  yes("perp-trans", ["(1,0,0)", "(0,1,0)", "(1,0,0)"]); no("perp-trans", ["(1,0,0)", "(0,1,0)", "(0,0,1)"]);
  yes("t0", ["(x*y, x)"]); yes("t0", ["T(x,y) = (x^2, y)"]); no("t0", ["(x + 1, y)"]); no("t0", ["(2x - y, x)"]);
  yes("pairwise", ["(1,0), (0,1), (1,1)"]); no("pairwise", ["(1,0,0), (0,1,0), (0,0,1)"]); no("pairwise", ["(1,0), (2,0), (0,1)"]);
  yes("tri-eq", ["(1,0)", "(-1,0)"]); no("tri-eq", ["(1,0)", "(2,0)"]); no("tri-eq", ["(1,0)", "(0,1)"]);
  yes("rank-add", ["1 0; 0 1", "1 0; 0 1"]); no("rank-add", ["1 0; 0 0", "0 0; 0 1"]);
  yes("eigvec-T", ["1 1; 0 2", "(1,0)"]); no("eigvec-T", ["2 1; 1 2", "(1,1)"]);
  yes("sym-inv", ["1 1; 1 1"]); no("sym-inv", ["2 1; 1 2"]); no("sym-inv", ["0 1; 0 0"]);
  yes("pos-pd", ["1 2; 2 1"]); no("pos-pd", ["2 1; 1 2"]);
  yes("minors-psd", ["0 0; 0 -1"]); no("minors-psd", ["1 0; 0 0"]); no("minors-psd", ["-1 0; 0 0"]);
  yes("sym-trans", ["(1,1)"]); yes("sym-trans", ["(1,2), (2,1), (1,1), (2,2)"]); no("sym-trans", ["(1,1), (2,2), (3,3)"]); no("sym-trans", ["(1,2)"]);
  t.ok(LA.CLAIMS.every((c) => LA.topic(c.topic) && c.example && c.truth && c.hint), "every claim has topic, hint, example and truth");
  // drills
  t.ok(LA.DRILLS.length >= 30, "at least 30 drills (" + LA.DRILLS.length + ")");
  LA.DRILLS.forEach((d) => {
    t.ok(!!LA.topic(d.topic), d.id + " topic exists");
    if (d.type === "blank") { const n = (d.text.match(/\[\[\d\]\]/g) || []).length; t.eq(n, d.accept.length, d.id + " blank count matches accepted answers"); d.accept.forEach((a) => t.ok(LA.checkBlank(a, a[0]), d.id + " first accepted answer passes")); }
    if (d.type === "assume" || d.type === "justify") t.ok(d.answer >= 0 && d.answer < d.opts.length, d.id + " answer index valid");
    if (d.type === "strategy") t.ok(d.answer >= 0 && d.answer < LA.DRILL_STRATS.length, d.id + " strategy index valid");
    if (d.type === "debug") t.ok(d.bad >= 0 && d.bad < d.lines.length, d.id + " bad line index valid");
  });
  // blank checker tolerance
  const g = LA.DRILLS.find((d) => d.id === "blank-5");
  t.ok(LA.checkBlank(g.accept[0], "\\langle u_1, u_1 \\rangle") && LA.checkBlank(g.accept[0], "||u1||^2") && !LA.checkBlank(g.accept[0], "<v2,u1>"), "blank checker normalises LaTeX/plain forms");
};
module.exports.needs = ["core/app.js", "core/mastery.js", "core/topics.js", "tools/maps.js", "ui/keyboard.js", "learn/proofexam.js", "learn/drills.js", "learn/counter.js"];
