# MATH2273 Linear Algebra I — The Ultimate Study Hub

An interactive study website for **MATH 2273 Linear Algebra I** (The University of the West Indies, St. Augustine). It is built line by line from the course notes (*Chapters 1–7*, V. Job) and the *Gram–Schmidt* handout, and extended to the full official course outline. Static, offline-capable and free: no accounts, no paid services, no build step.

> Unofficial study aid — not affiliated with or endorsed by The University of the West Indies. Your lecture notes and your lecturer remain the authority on what is examinable.

**Live site:** <https://lano07.github.io/MATH2273-Linear-Algebra-I--Website/>

## What's inside (v2)

| Area | What you get |
|---|---|
| **Lessons (Ch 1–8)** | Every definition, theorem and example from the notes (same numbering), plus intuition, tips, exam traps, proof templates and 21 extra proofs. Each chapter ends with a **deep dive** (why it matters, the geometric picture, a counterexample gallery, connections and levelled practice). A **depth filter** shows *Foundation*, *University Standard* or *Everything*; enrichment is clearly labelled. |
| **Syllabus additions** | **Chapter 8 – Quadratic forms & orthogonal diagonalization** and **§5.3 Rank and equivalence** fill the two syllabus topics the notes don't cover. The **Syllabus Coverage** page quotes the official course description and shows where every topic lives. |
| **Topic Studio** | 34 topics, each in five connected modes — **Understand · Visualise · Prove · Practise · Exam** — with split view, prerequisites and "leads to" links. Your place in each mode is kept when you switch. |
| **Adaptive Practice Arena** | 68 seeded question generators covering every topic, 4 difficulty levels, answers checked for **mathematical equivalence** (exact fractions and surds, any correct basis, any eigenvector multiple, polynomial identity…), 4-step progressive hints, full worked solutions, a mistake log with a **retry queue**, permanent links to every problem, and a math symbol keyboard. The original practice page remains as *Classic*. |
| **Proof Studio** | Proof templates and puzzles (v1), plus the **Proof Examiner** (write a proof in LaTeX or plain text; a transparent rubric checklist flags missing steps, conclusion-only answers and proof-by-example; compare with the model proof and self-mark), 41 **proof drills** (fill the blank, missing assumption, justify the step, choose the strategy, debug the proof) and the **Counterexample Lab** (21 false claims with exact verifiers). |
| **Exam Centre** | 2-hour ~100-mark **final exam simulation** (the official format is one 2-hour written paper), Ch 3 & 4 coursework simulation, chapter tests, proof-heavy papers, computational sprints and a custom builder. Timed runner, component-based marking (method, accuracy, justification, proof structure, notation, completeness, final answer), reports by component/topic/question, history and trends. The three original mocks are unchanged. |
| **Flashcards** | Spaced repetition (SM-2) with real due dates, daily queue, new-card limit, weak-chapter priority, recall history, proof-reconstruction cards (write an outline before revealing), and your own cards. Only honest ratings count — opening a card never does. |
| **Labs (14)** | 2D transformations, linearity checker, kernel/range, matrix of T, Gram–Schmidt machine and **Gram–Schmidt Studio** (animated, 2D/3D, prediction challenges), 3D orthogonality, inner products, row reduction, determinants, eigen lab, **Change-of-Basis Lab**, **Quadratic Forms Lab** (level curves, principal axes, definiteness, 3D surface) and a **Matrix Calculator** with elementary matrices. Every lab shows its formulas and links to the lesson. All algebra is exact. |
| **Encyclopedia** | Definitions, theorem library, proof library, formulas, counterexamples, 32 common mistakes, notation and recipes; **50 theorem pages** (statement and proof from the lessons, plain English, assumptions, what breaks without them, mistakes, applications); an interactive **concept map** coloured by your mastery. |
| **Smart dashboard** | Mastery (from answered questions only) shown separately from activity (XP, sections read): practice accuracy, proof self-marks, exams, flashcard recall, open mistakes, weekly improvement, a revision heatmap, weak concepts and recommendations. XP, levels and badges are kept. |
| **Personal tools** | Bookmarks (☆ on any box), notes under every section/topic/theorem, text highlights with annotations, *My Notes* page, focus mode, text size / line spacing / motion settings, keyboard shortcuts (<kbd>?</kbd>), print sheets (formulas, proofs, topics, notes). |
| **Reference** | Formula & theorem sheet, glossary & notation, past-paper hub with a detailed log (year, semester, question, topics, difficulty, attempts, marks, mistakes, revision notes), corrections to the notes. |

## Using it

* **Online (GitHub Pages):** *Settings → Pages → Build and deployment → Deploy from a branch*, choose `main` and `/ (root)`. The site is served at `https://<user>.github.io/<repository>/`.
* **Offline:** clone or download the repository and open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari from 2021 on — exact arithmetic uses `BigInt`). Fonts and KaTeX are bundled.
* **Keyboard:** <kbd>Ctrl</kbd>+<kbd>K</kbd> or <kbd>/</kbd> search · <kbd>F</kbd> focus mode · <kbd>?</kbd> shortcuts · <kbd>Enter</kbd> check an answer · <kbd>1</kbd>–<kbd>4</kbd> rate a flashcard · first <kbd>Tab</kbd> offers *Skip to content*.

## Your data

Everything (progress, answers, mastery evidence, mistakes, flashcard schedules, exam history, notes, highlights, past-paper log, settings) is stored in your browser's `localStorage` under `la2273:*` keys. Nothing is sent anywhere. Use **Progress, Badges & Data → Export** to back up or move to another device, and **Import** to restore. Data saved by version 1 (sections completed, flashcard boxes, past-paper log, quiz scores, XP) is migrated automatically.

There is no AI tutor and no API key in this project: every feature works offline with deterministic, exact mathematics.

## Past papers

Official MATH 2273 past papers are held by The Alma Jordan Library (UWI St. Augustine): <https://libraries.sta.uwi.edu/apps/pastpapers>. Access requires accepting the library's Appropriate Use Policy (personal, non-commercial study). This site does **not** re-publish the papers; it links to the archive and lets you keep your own log.

## Tests

```bash
node tests/run-unit.js          # unit + mathematical regression tests (no browser needed)
npm install && npx playwright install chromium
node tests/e2e.js               # every route, responsive checks (390/820/1440 px), user flows
BROWSER=firefox node tests/e2e.js   # or webkit (after: npx playwright install firefox webkit)
```

GitHub Actions (`.github/workflows/tests.yml`) runs the unit suite and the end-to-end suite in Chromium, Firefox and WebKit on every push and pull request. In Firefox and WebKit each check runs in a fresh tab (`ISOLATE=1` does the same in Chromium); an overflow failure names the elements that stick out.

The unit suite runs every generator at every difficulty over many seeds (the model answer must pass its own checker, every formula must compile in KaTeX), tests the answer-equivalence engine, the Proof Examiner heuristics, the counterexample verifiers, the exam bank (marks add up; exams hit their mark targets and are reproducible) and the spaced-repetition scheduler. The end-to-end suite renders all ~340 routes and checks for console errors, KaTeX errors, unrendered maths and horizontal overflow.

## Project structure

```
index.html                     app shell (hash routing; works from file:// and GitHub Pages)
assets/css/main.css            design system (dark "neon glass" + light theme, print, focus mode)
assets/js/core/                math.js (exact fractions, surds, polynomials, matrices), parse.js, rng.js (seeded),
                               answers.js (answer equivalence), app.js (router, search, XP), mastery.js, topics.js
assets/js/content/             lessons ch1.js … ch8.js, additions.js (§5.3), deep.js (deep dives)
assets/js/data/                quizzes, flashcards, mocks, proof puzzles
assets/js/practice/            bank-*.js (68 generators), arena.js (Practice Arena), generators.js (classic)
assets/js/learn/               studio.js (Topic Studio), proofexam.js, drills.js, counter.js
assets/js/exam/                bank.js (written questions + schemes), exams.js (Exam Centre)
assets/js/study/srs.js         spaced-repetition flashcards
assets/js/pages/               home, chapter, dashboard, encyclopedia, concept map, past papers, syllabus, reference…
assets/js/tools/               labs (+ plane.js canvas helper)
assets/js/ui/                  keyboard.js (math keys), labmeta.js, personal.js (notes, bookmarks, settings, search)
tests/                         run-unit.js + unit/*.test.js, e2e.js, serve.js, harness.js
docs/ARCHITECTURE.md           how the pieces fit together and how to add content
```

See [CHANGELOG.md](CHANGELOG.md) for what changed in v2 and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the internals.

## Known limitations

* The automatic proof checker is a keyword/structure checklist — it cannot verify logical validity; your self-mark against the rubric is what counts.
* Written exam answers are self-marked against the marking schemes; only computational answers are auto-checked.
* Chapter 8 and §5.3 were written for this site from standard textbooks (Anton & Rorres, Strang, Axler); their numbering is the site's own.
* Progress is per browser/device unless you export and import it; there are no accounts or cloud sync.
* Automated browser tests run in Chromium; other modern browsers are expected to work but are not in the automated suite.

## Credits & licences

* [KaTeX](https://katex.org) — MIT licence (`assets/vendor/katex/LICENSE`).
* [canvas-confetti](https://github.com/catdad/canvas-confetti) — ISC licence (`assets/vendor/confetti.LICENSE`).
* Fonts: Inter, Space Grotesk, JetBrains Mono — SIL Open Font License 1.1 (`assets/fonts/*-OFL.txt`).
* Course content © its authors. This site is a personal, non-commercial study companion.
