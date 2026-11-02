/* SM-2 scheduler properties and deck integrity. */
"use strict";
module.exports = function (t, LA) {
  const DAY = 864e5, now = Date.UTC(2026, 10, 2, 12);
  let s = LA.srsSchedule(null, 2, now);
  t.eq(s.int, 1, "new card rated Good → 1 day"); t.eq(s.due, now + DAY, "due date is a real timestamp");
  s = LA.srsSchedule(s, 2, s.due); t.eq(s.int, 3, "second Good → 3 days");
  const s3 = LA.srsSchedule(s, 2, s.due); t.ok(s3.int >= 7 && s3.int <= 8, "third Good ≈ ef × 3 days (" + s3.int + ")");
  const easy = LA.srsSchedule(s, 3, s.due), hard = LA.srsSchedule(s, 1, s.due);
  t.ok(easy.int > s3.int && hard.int < s3.int && hard.int > s.int, "Easy > Good > Hard > previous interval");
  const again = LA.srsSchedule(s3, 0, s3.due);
  t.ok(again.reps === 0 && again.lapses === 1 && again.due - s3.due === 10 * 6e4, "Again resets, counts a lapse, returns in 10 minutes");
  let e = { ef: 2.5 }; for (let i = 0; i < 30; i++) e = LA.srsSchedule(e, 0, now); t.ok(e.ef >= 1.3, "ease never below 1.3");
  let f = { ef: 2.5 }; for (let i = 0; i < 30; i++) f = LA.srsSchedule(f, 3, now); t.ok(f.ef <= 3.0, "ease never above 3.0");
  t.ok(LA.srsSchedule(s, 2, now).hist.length <= 20, "recall history kept (bounded)");
  const deck = LA.srsDeck();
  t.ok(deck.length >= LA.CARDS.length + LA.PROOF_TASKS.length, "deck = built-in cards + proof-reconstruction cards (+ custom)");
  t.ok(new Set(deck.map((c) => c.id)).size === deck.length, "card ids unique");
  t.ok(deck.every((c) => ["definition", "theorem", "formula", "proof", "custom"].includes(c.type)), "every card has a type");
  t.ok(deck.filter((c) => c.topic).length >= deck.length * 0.95, "cards are mapped to topics for mastery evidence");
  t.ok(LA.CARDS.every((c, i) => c.id === c.ch + "-" + i), "built-in card ids unchanged (saved progress keeps working)");
};
module.exports.needs = ["core/app.js", "core/mastery.js", "core/topics.js", "data/flashcards.js", "ui/keyboard.js", "learn/proofexam.js", "study/srs.js"];
