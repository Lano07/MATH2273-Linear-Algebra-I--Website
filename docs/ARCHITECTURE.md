# Architecture

A static single-page app: plain HTML, CSS and classic `<script>` files that register themselves on a global `window.LA` object. No bundler, no framework, no server. It runs from `file://` and from GitHub Pages.

## Load order (index.html)

1. **Vendor** — KaTeX + auto-render, canvas-confetti.
2. **Core** — `math.js` (exact `Frac`/`QNum`/`Poly`, vectors, matrices, row reduction with step logs, nullspace, characteristic polynomial, rational roots) → `parse.js` (expression parser, exact multivariate polynomials) → `rng.js` (seeded mulberry32) → `answers.js` (answer equivalence) → `app.js` (storage, router, search, XP/badges, UI helpers, `LA.KATEX_MACROS`) → `mastery.js` (evidence, mastery, mistakes, recommendations) → `topics.js` (34-topic registry) → `ui/keyboard.js`.
3. **Content** — `content/ch1.js … ch8.js`, `additions.js` (§5.3), `deep.js` (deep dives), then `data/` (quizzes, flashcards, mocks, puzzles).
4. **Pages** — chapter, home, plan, recipes, proofs, study (quiz, classic flashcards, mocks, progress), reference, syllabus, past papers.
5. **Tools** — v1 labs, `plane.js` (canvas helper), new labs.
6. **Practice / learning / exams / study** — generator bank, Practice Arena, Proof Examiner, drills, Counterexample Lab, Topic Studio, exam bank + Exam Centre, spaced repetition, encyclopedia, concept map, lab panels, personal layer, dashboard.
7. `LA.boot()` — theme, header, navigation, first route.

## Routing

`LA.page(pattern, { title, render(params, query) → html, after(view, params, query), lab, searchTitle, searchDesc })`. Hash URLs (`#/learn/spectral?mode=prove`). The first registered pattern wins, so replaced v1 pages were moved to `/…/classic` routes. After every route: `LA.enhance` (box headers, depth levels, reveals, steppers), `page.after`, every function in `LA.afterRoute` (lab panels, bookmarks/notes, dashboard block), then KaTeX rendering.

## Content conventions

* Lesson HTML lives in `String.raw` templates; maths is `$…$` / `$$…$$`. Use `\lt`/`\gt` instead of `<`/`>`; never put `${` or backticks inside content.
* Boxes: `<div class="box thm|def|prop|lem|cor|ex|proof|tip|trap|exam|intuition|recipe|beyond|template|errata|note" data-t="Title" data-level="f|s|a">`. Titles starting with a number (`3.2.6 · …`) are used by the topic registry, the encyclopedia and theorem pages.
* `data-level`: f = Foundation, s = University Standard, a = Advanced Enrichment (defaults: proofs/templates/exam → s, beyond → a, else f).

## Engines

| Engine | API | Notes |
|---|---|---|
| Answers | `LA.ans.check(spec, input) → {ok, score, msg}` | types `num vec(multiple) mat poly expr span polyspan set mcq tf text custom`; exact where possible, numeric (1e-9) for surds; `text` is a transparent rubric flagged `heuristic` |
| Generators | `LA.bank.def({id, topic, title, gen(rng, diff)})`, `LA.bank.make(id, seed, diff)` | each problem: `q, ans|parts, model, hints[4], sol, opts?, joint?`; `model` must pass `ans` (unit-tested) |
| Mastery | `LA.ev.record({topic, src, score, hints, sol, gen, seed, diff})`, `LA.mastery(topic)` | levels: Not started · Learning · Developing · Proficient · Mastered; only answered questions count |
| Mistakes | `LA.mist.add/list/resolveBySeed` | retry queue regenerates the exact problem from `(gen, seed, diff)` |
| Exams | `LA.buildExam(cfg)`, `LA.EXAM_QUESTIONS` | scheme lines `[marks, component, text]`, components M A J P N C F |
| Flashcards | `LA.srsSchedule(state, rating)`, `LA.srsQueue()` | SM-2 style, real timestamps |

## Storage (`localStorage`, prefix `la2273:`)

v1: `xp streak done stats badges theme calm cwDate planChecks conf quizBest flash mockResults parsonsSolved ppLog`.
v2: `ev mistakes depth studio:<topic> srs srsLog srsSettings customCards examCurrent examHistory proofAttempts proofDraft:<id> ceSolved bookmarks notes highlights uiSettings focusChapters`.
Export/import on the Progress page copies every `la2273:*` key.

## Adding content

* **Lesson section** — push `{id, title, html}` onto `LA.chapters.chN.sections` (see `content/additions.js`).
* **Topic** — add an entry in `core/topics.js` (`id, ch, title, sec, nums, prereq, summary, key, labs`); every topic needs at least one generator (unit test enforces it).
* **Generator** — `LA.bank.def` in `practice/bank-*.js`; run `node tests/run-unit.js bank`.
* **Exam question** — `q(id, ch, topics, kind, diff, title, parts)` in `exam/bank.js`; scheme marks must add up to part marks (tested).
* **Theorem page** — add to `TH` in `pages/encyclopedia.js` with `num` (lesson box number) so statement and proof are pulled from the lesson.
* **Drill / counterexample** — `learn/drills.js`, `learn/counter.js` (verifiers must be exact; add test inputs in `tests/unit/counter-drills.test.js`).

## Tests

* `node tests/run-unit.js [filter]` — loads the scripts in a Node `vm` context (`tests/harness.js`), compiles every formula with KaTeX.
* `node tests/e2e.js` — Playwright against `tests/serve.js` (`BROWSER=chromium|firefox|webkit`): all routes (console errors, KaTeX errors, unrendered `$`, MathML validity), responsive overflow at 390/820/1440 px with the offending elements named, and user flows including data migrations. Each responsive check and flow is a guarded step with a time limit, so one stall is reported and the run continues; Firefox/WebKit (or `ISOLATE=1`) use a fresh tab per check.
* Page modules must not leave listeners or timers behind: register cleanups with `LA.onLeave(fn)` (run before the next route renders).
