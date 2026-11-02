/* Proof Examiner heuristics: a complete proof is recognised, conclusion-only and proof-by-example answers are flagged. */
"use strict";
module.exports = function (t, LA) {
  const task = (id) => LA.PROOF_TASKS.find((x) => x.id === id);
  const ex = (id, txt) => LA.examineProof(task(id), txt);
  // a complete LaTeX proof of "ker T is a subspace"
  const good = String.raw`By definition $\ker T = \{v\in V: T(v)=0\}\subseteq V$. Since $T$ is linear, $T(0) = 0$, so $0\in\ker T$.
Let $u,v\in\ker T$ and $\alpha,\beta\in\R$. By linearity $T(\alpha u+\beta v) = \alpha T(u)+\beta T(v) = 0$. Hence $\ker T$ is a subspace of $V$. $\square$`;
  let R = ex("ker-sub", good);
  t.eq(R.found, R.total, "ker-sub: complete LaTeX proof — all automatic rubric items detected");
  t.ok(!R.warn.some((w) => w.k === "conclusion-only"), "ker-sub: complete proof not flagged as conclusion-only");
  // plain-text version with separate closure steps
  R = ex("ker-sub", "ker T is a subset of V. T(0) = 0 since T is linear. Let u, v in ker T and c a scalar. T(u + v) = T(u) + T(v) = 0 + 0 = 0 and T(cu) = cT(u) = 0. Therefore ker T is a subspace.");
  t.eq(R.found, R.total, "ker-sub: plain-text proof — all items detected");
  // conclusion only
  R = ex("ker-sub", "Clearly ker T is a subspace of V.");
  t.ok(R.warn.some((w) => w.k === "conclusion-only"), "ker-sub: conclusion-only answer flagged");
  t.ok(R.found <= 1, "ker-sub: conclusion-only answer detects at most the conclusion");
  // proof by example
  R = ex("ker-sub", "Take T(x,y) = (x,0). Then (0,1) and (0,2) are in ker T and (0,1)+(0,2) = (0,3) is in ker T, so ker T is a subspace.");
  t.ok(R.warn.some((w) => w.k === "example"), "ker-sub: proof by example flagged");
  // other tasks: model proofs should score highly against their own rubric
  LA.PROOF_TASKS.forEach((tk) => {
    const txt = tk.model.replace(/<[^>]+>/g, " ");
    const r = ex(tk.id, txt);
    t.ok(r.found >= Math.ceil(r.total * 0.75), tk.id + ": model proof detected " + r.found + "/" + r.total);
    t.ok(!r.warn.some((w) => w.k === "conclusion-only"), tk.id + ": model proof not flagged as conclusion-only");
  });
  t.ok(LA.PROOF_TASKS.every((tk) => LA.topic(tk.topic)), "every proof task maps to a topic");
};
module.exports.needs = ["core/app.js", "core/mastery.js", "core/topics.js", "ui/keyboard.js", "learn/proofexam.js"];
