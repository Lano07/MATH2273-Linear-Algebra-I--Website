/* Syllabus coverage audit: official UWI course description vs the lecture notes vs this site.
   Source (checked 2 Nov 2026): https://sta.uwi.edu/fst/dms/math-2273-linear-algebra-i — quoted verbatim below. */
(function () {
  "use strict";
  const LA = window.LA;
  const SRC = "https://sta.uwi.edu/fst/dms/math-2273-linear-algebra-i";

  // [official sentence, where the notes cover it, links on this site, status, comment]
  const ROWS = [
    ["Students who take this course will require a solid grounding in set theory and basic logic.", "Chapter 1", [["Chapter 1", "#/ch/1"], ["Proof Studio", "#/proofs"]], "ok", "Sets, relations, functions and proof techniques."],
    ["The course begins with a study of abstract linear algebra which involves vector spaces and linear transformations.", "Chapters 2 and 3", [["Chapter 2", "#/ch/2"], ["Chapter 3", "#/ch/3"], ["Linearity Checker", "#/labs/linearity"], ["Kernel & Range Lab", "#/labs/kernel"]], "ok", "Chapter 3 is covered in extra depth for the coursework test."],
    ["Formulating such an approach leads to a study of linear equations and the technique of elementary row transformations used for solving them.", "Chapter 5 (§5.1–5.2)", [["Chapter 5", "#/ch/5"], ["Row Reduction Stepper", "#/labs/rref"]], "ok", ""],
    ["The concepts of rank and equivalence are introduced.", "Chapter 5: rank (§5.2) and row-equivalence (Definition 5.1.5). Column operations, equivalent matrices ($B = PAQ$) and the normal form are not developed.", [["§5.3 Rank and equivalence", "#/ch/5?go=sec-5-3"]], "added", "Gap filled by this site: §5.3 adds column operations, equivalence, the normal form and “rank is the complete invariant”, with proofs."],
    ["Determinants are discussed in terms of permutations.", "Chapter 6", [["Chapter 6", "#/ch/6"], ["Determinant Lab", "#/labs/det"]], "ok", ""],
    ["The important concepts of orthogonality, eigenvalues, eigenvectors are studied.", "Chapter 4 (inner products, orthogonality, Gram–Schmidt handout) and Chapter 7", [["Chapter 4", "#/ch/4"], ["Chapter 7", "#/ch/7"], ["Gram–Schmidt Machine", "#/labs/gram-schmidt"], ["Eigen Lab", "#/labs/eigen"]], "ok", ""],
    ["A treatise on quadratic forms, diagonalization of matrices and the Cayley – Hamilton theorem is included.", "Diagonalization and Cayley–Hamilton: Chapter 7 (§7.3). Quadratic forms: <b>not in the notes provided</b>.", [["Chapter 7", "#/ch/7"], ["Chapter 8 · Quadratic forms", "#/ch/8"]], "added", "Gap filled by this site: Chapter 8 (quadratic forms, symmetric matrices, the Spectral Theorem, principal axes, definiteness, Sylvester's criterion, optimisation)."],
    ["The writing of detailed proofs is incorporated throughout.", "Throughout", [["Proof Studio", "#/proofs"]], "ok", "This site adds full proofs for results the notes leave as exercises or state without proof (marked as proofs in each chapter)."],
  ];

  LA.page("/syllabus", {
    title: "Syllabus Coverage", searchTitle: "Syllabus Coverage Audit", searchDesc: "Official UWI course outline vs your notes vs this site",
    render() {
      const chip = (s) => s === "ok" ? '<span class="chip lime">✓ In your notes</span>' : '<span class="chip amber">＋ Added by this site</span>';
      return '<div class="page wide"><div class="hero"><div class="hero-content"><div class="kicker">Reference</div><h1>Syllabus Coverage Audit</h1>' +
        '<p class="lead">Every sentence of the official course description, matched to your lecture notes and to this site. Two syllabus topics are missing from the notes you have — both are now covered here, and clearly marked as additions.</p></div></div>' +
        '<div class="grid grid-4" style="margin-top:16px">' +
        '<div class="card stat"><b>MATH 2273</b><span>Level II · Semester 1 · 3 credits</span></div>' +
        '<div class="card stat"><b>MATH 1141 / 1140</b><span>Prerequisite</span></div>' +
        '<div class="card stat"><b>50%</b><span>Coursework</span></div>' +
        '<div class="card stat"><b>50%</b><span>Final exam · one 2-hour written paper</span></div></div>' +
        LA.sectionTitle("Official description vs coverage") +
        '<div class="tbl-wrap"><table class="tbl"><tr><th style="width:34%">Official course description (verbatim)</th><th>In your notes</th><th>On this site</th><th>Status</th></tr>' +
        ROWS.map((r) => "<tr><td><i>“" + r[0] + "”</i></td><td>" + r[1] + "</td><td>" + r[2].map((l) => '<a href="' + l[1] + '">' + l[0] + "</a>").join("<br>") + (r[4] ? '<div class="small muted" style="margin-top:4px">' + r[4] + "</div>" : "") + "</td><td>" + chip(r[3]) + "</td></tr>").join("") +
        "</table></div>" +
        '<p class="small muted">Source: the official UWI St. Augustine course page, <a href="' + SRC + '" target="_blank" rel="noopener">' + SRC.replace("https://", "") + "</a> (checked 2 November 2026; the page has a typo, “vector spacers”, corrected above).</p>" +
        LA.sectionTitle("What this audit can and cannot tell you") +
        '<div class="grid grid-2">' +
        '<div class="box note" data-t="What it confirms"><ul><li>Quadratic forms, rank &amp; equivalence, determinants via permutations, orthogonality, eigen-theory, diagonalization and Cayley–Hamilton are <b>official syllabus topics</b>.</li><li>The final exam is <b>one 2-hour written paper worth 50%</b>; coursework is the other 50%.</li><li>Proof-writing is part of the course throughout.</li></ul></div>' +
        '<div class="box trap" data-t="What it does NOT tell you"><ul><li>Which topics your lecturer will emphasise this semester, or which proofs are examinable.</li><li>The notation and numbering your lecturer uses for Chapter 8 and §5.3 — those sections were written for this site from standard textbooks (Anton &amp; Rorres, Strang, Axler) and use this site\'s own numbering.</li><li>Coursework dates and coverage: the “Chapters 3 &amp; 4 coursework test” comes from your class announcement, not from this page.</li></ul><p class="small">When in doubt, ask your lecturer — and keep the notes as the primary reference.</p></div></div>' +
        LA.sectionTitle("Related") +
        '<div class="row"><a class="btn" href="#/errata">🩹 Corrections to the notes</a><a class="btn" href="#/pastpapers">🗂️ Past-paper log</a><a class="btn" href="#/formulas">📜 Formula sheet</a><a class="btn" href="#/ch/8">8 · Quadratic forms</a><a class="btn" href="#/ch/5?go=sec-5-3">§5.3 Rank &amp; equivalence</a></div>' +
        "</div>";
    },
  });
})();
