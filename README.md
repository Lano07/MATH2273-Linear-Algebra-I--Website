# MATH2273 Linear Algebra I — The Ultimate Study Hub

An interactive study website for **MATH 2273 Linear Algebra I** (The University of the West Indies), built line-by-line from the course notes (*Chapters 1–7*, V. Job) and the *Gram–Schmidt* handout. **Chapters 3 (Linear Transformations) and 4 (Inner Product Spaces & Orthogonality) are covered in maximum depth** for coursework preparation.

> Unofficial study aid — not affiliated with or endorsed by The University of the West Indies.

## What's inside

| Area | What you get |
|---|---|
| **Lessons (Ch 1–7)** | Every definition, theorem and example from the notes (same numbering), plus plain-English intuition, *Tip*, *Exam trap*, *Proof template* and *Beyond the notes* boxes, step-by-step reveals, and proofs of the results the notes leave as exercises. |
| **Exercises + full solutions** | Model solutions to **every** exercise in the notes, plus extra exam-style questions. All answers were cross-checked with a computer algebra system (SymPy). |
| **Coursework Battle Plan** | 7-day plan for Chapters 3 & 4, topic-confidence tracker, live countdown, and exam-room strategy. |
| **Question Recipes** | A short, reliable algorithm for every question type, with a mini-example and the trap that costs marks. |
| **Proof Studio** | Golden rules of proof writing, a logic toolkit, fill-in-the-blank templates, and interactive proof puzzles (put the lines in order and leave out the decoy). |
| **Practice Arena** | 12 random problem generators (linearity, basis images, kernel/range, matrix of T, inverses, Gram–Schmidt in ℝⁿ and ℙₙ, S⊥, norms/angles, inner-product checks, …) with complete worked solutions computed exactly. |
| **Quizzes · Flashcards · Mock tests** | ~90 concept questions with explanations, ~70 spaced-repetition flashcards, and 3 timed mock coursework papers with marking schemes for self-marking. |
| **Interactive labs** | 2D transformation visualizer, linearity checker (auto-proof or counterexample), kernel/range/rank–nullity analyzer, matrix-of-T builder (ℝⁿ and polynomial spaces), Gram–Schmidt machine (any weighted or integral inner product), 3D orthogonality visualizer, inner product lab (Gram-matrix test), row-reduction stepper, determinant lab, eigen lab (incl. complex eigenvalues and Cayley–Hamilton inverses). All computations use exact fractions. |
| **Reference** | Printable formula & theorem sheet, glossary & notation decoder, past-paper hub with a personal question log, "Beyond the notes", and a corrections page listing slips found in the notes. |
| **Motivation** | XP, levels, badges, daily streaks, confetti — progress saved locally in your browser. Dark and light themes. |

## Using it

* **Online (GitHub Pages):** in the repository settings choose *Settings → Pages → Build and deployment → Deploy from a branch*, pick the branch (e.g. `main`) and folder `/ (root)`. The site is then served at `https://<your-username>.github.io/<repository-name>/`.
* **Offline:** download/clone the repository and open `index.html` in any modern browser. Fonts and the maths renderer (KaTeX) are bundled, so no internet connection is needed.
* Keyboard: <kbd>Ctrl</kbd>+<kbd>K</kbd> or <kbd>/</kbd> opens search; flashcards use <kbd>Space</kbd> and <kbd>1</kbd>–<kbd>4</kbd>.
* Progress (XP, completed sections, scores, flashcard boxes, past-paper log) lives in `localStorage`. Use *Progress & Badges → Export* to back it up or move it to another device.

## Past papers

Official MATH 2273 past papers are held by The Alma Jordan Library (UWI St. Augustine): <https://libraries.sta.uwi.edu/apps/pastpapers>. Access requires accepting the library's Appropriate Use Policy (personal, non-commercial study). This site links to the archive rather than re-publishing the papers; use the **Past Papers → My past-paper log** page to record questions and track which topics appear most.

## Project structure

```
index.html                 single-page app shell (hash routing, works from file://)
assets/css/main.css        design system (dark "neon glass" + light theme, print styles)
assets/js/core/            math.js (exact fractions, surds, polynomials, matrices, row reduction),
                           parse.js (formula parser), app.js (router, search, XP/badges, UI)
assets/js/content/         chapter lessons, exercises and summaries (ch1.js … ch7.js)
assets/js/data/            quiz bank, flashcards, mock tests, proof puzzles
assets/js/pages/           dashboard, plan, recipes, proof studio, study engines, reference pages
assets/js/tools/           interactive labs
assets/js/practice/        practice-arena generators
assets/vendor/, assets/fonts/   KaTeX, canvas-confetti, Inter, Space Grotesk, JetBrains Mono
```

No build step: edit the JavaScript files directly. Maths is written in LaTeX inside `String.raw` templates and rendered by KaTeX.

## Credits & licences

* [KaTeX](https://katex.org) — MIT licence (`assets/vendor/katex/LICENSE`).
* [canvas-confetti](https://github.com/catdad/canvas-confetti) — ISC licence (`assets/vendor/confetti.LICENSE`).
* Fonts: Inter, Space Grotesk, JetBrains Mono — SIL Open Font License 1.1 (`assets/fonts/*-OFL.txt`).
* Course content © its authors. This site is a personal, non-commercial study companion.
