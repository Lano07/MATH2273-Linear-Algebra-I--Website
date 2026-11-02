# Changelog

## 2.0.0 — November 2026 · "Ultimate" upgrade

An upgrade of the existing site (not a rebuild): every v1 page, lab and saved-progress key still works; v1 practice, flashcards and past-paper pages remain available as *Classic* versions.

### Phase 1 — Academic completeness
* **Syllabus audit** page quoting the official UWI course description, mapping each sentence to the notes and the site.
* **Chapter 8 · Quadratic forms & orthogonal diagonalization** (new): symmetric matrices of forms, orthogonal matrices, real eigenvalues and orthogonal eigenvectors of symmetric matrices, the Spectral Theorem (with proof), principal axes and conics, definiteness (eigenvalue test, Sylvester's criterion with its assumptions and limits), Rayleigh bounds, the Hessian test; exercises with full solutions, summary, quiz and flashcards.
* **§5.3 Rank and equivalence** (new): column operations, equivalent matrices $B = PAQ$, normal form, rank as the complete invariant, $\operatorname{rank}A^T = \operatorname{rank}A$.
* **21 additional proofs** in Chapters 1–7; a **deep-dive section** per chapter (intuition, counterexample gallery, connections, levelled practice with solutions).
* **Depth levels** — Foundation / University Standard / Advanced Enrichment, with enrichment clearly labelled.
* Corrections page: Theorem 2.4.4 needs $v\notin S$. All new numerical content verified with SymPy.

### Phase 2 — Interactive teaching
* **Answer-equivalence engine** (exact fractions, surds, complex numbers, vectors, matrices, polynomials, expressions, any basis of a subspace, multisets, transparent keyword rubric).
* **Seeded generators**: 68 question types for all 34 topics, 4 difficulty levels, 4-step hints, full solutions, permanent problem links.
* **Adaptive Practice Arena** with mastery-based topic selection, mistake log and retry queue; mastery counts first attempts only, hints reduce credit and viewing the solution first gives none.
* **Topic Studio**: Understand · Visualise · Prove · Practise · Exam for every topic, split view, state kept across modes.
* **Proof Examiner** (12 theorems; rubric checklist clearly labelled as heuristic; model proof side by side; honest self-marking), **41 proof drills**, **Counterexample Lab** (21 claims, exact verifiers).

### Phase 3 — Adaptive assessment
* **Exam Centre**: 2-hour final simulation (~100 marks, ≥5 chapters), coursework simulation, chapter tests, proof-heavy and computational papers, custom builder; timed runner with navigator, flags and autosave; component-based marking; reports, history and trends; reproducible from a seed. 29 new written questions with marking schemes; the 3 mocks converted into the bank.
* **Spaced-repetition flashcards** (SM-2) with real dates, due queue, recall history, maturity, proof-reconstruction and custom cards; v1 Leitner boxes migrated.
* **Past-paper log v2** (year, semester, question, topics, difficulty, attempt history, marks, mistakes, revision notes, links); v1 entries migrated.

### Phase 4 — Visual mathematics
* New labs: **Change-of-Basis**, **Quadratic Forms** (level curves, principal axes, definiteness, Rayleigh, 3D surface), **Matrix Calculator** (elementary matrices for each row operation), **Gram–Schmidt Studio** (animation, 2D/3D, prediction challenges).
* Formulas-and-lessons panel on every lab.
* **Encyclopedia** (definitions, theorems, proofs, formulas, counterexamples, common mistakes, notation, recipes), **50 theorem pages**, **concept dependency map**.

### Phase 5 — Refinement
* **Smart dashboard** separating mastery from activity, with trends, heatmap, weak concepts and recommendations.
* **Bookmarks, notes, highlights with annotations**, *My Notes* page; **focus mode**, text size, line spacing and motion settings; skip link, visible focus styles, keyboard shortcuts; expanded search (topics, theorems, generators, exam questions, drills, counterexamples, mistakes); print sheets.
* Responsive fixes for phones and tablets (no horizontal overflow at 390 / 820 / 1440 px).
* **Tests**: Node unit + mathematical regression suite (~79,000 checks) and a Playwright end-to-end suite (~1,500 checks).
* Fix: constant expressions such as `1/2` are now parsed exactly (they were silently compared as decimals).

## 1.0.0 — November 2026
First release: lessons for Chapters 1–7 following the notes, full exercise solutions, coursework battle plan for Chapters 3–4, recipes, proof studio with templates and puzzles, 12 practice generators, quizzes, flashcards, 3 mock tests, 10 interactive labs, formula sheet, glossary, past-paper hub, corrections page, XP/badges.
