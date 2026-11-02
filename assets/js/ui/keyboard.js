/* Math symbol keyboard: inserts text at the cursor of the last-focused input/textarea inside a scope.
   Two layouts: "answer" (plain syntax understood by the answer checker) and "latex" (for the proof editor). */
(function () {
  "use strict";
  const LA = window.LA;
  const LAYOUTS = {
    answer: [["√", "sqrt()", -1], ["x²", "^2"], ["^", "^"], ["/", "/"], ["(", "("], [")", ")"], [",", ", "], [";", "; "], ["−", "-"], ["λ", "λ"], ["i", "i"], ["∅", "∅"], ["( , , )", "(, , )", -5]],
    latex: [["∀", "\\forall "], ["∃", "\\exists "], ["∈", "\\in "], ["∉", "\\notin "], ["⊆", "\\subseteq "], ["⇒", "\\Rightarrow "], ["⇔", "\\iff "], ["≠", "\\neq "], ["≤", "\\le "], ["≥", "\\ge "], ["⟨,⟩", "\\langle u,v\\rangle"], ["‖v‖", "\\lVert v\\rVert"], ["λ", "\\lambda "], ["α", "\\alpha "], ["β", "\\beta "], ["ℝ", "\\R"], ["ℙₙ", "\\P_n"], ["ker", "\\ker "], ["Ran", "\\Ran "], ["span", "\\spn"], ["⊥", "\\perp "], ["∪", "\\cup "], ["∩", "\\cap "], ["∅", "\\emptyset"], ["Σ", "\\sum_{i=1}^{n} "], ["a/b", "\\frac{}{}", -3], ["√", "\\sqrt{}", -1], ["xⁿ", "^{}", -1], ["xᵢ", "_{}", -1], ["matrix", "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"], ["□", "\\square"], ["$…$", "$$", -1]],
  };
  LA.mathKeys = function (scope, layout) {
    const keys = LAYOUTS[layout || "answer"];
    const bar = document.createElement("div");
    bar.className = "mathkeys"; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Math symbols");
    bar.innerHTML = keys.map((k, i) => '<button type="button" class="mk" data-k="' + i + '" title="Insert ' + LA.esc(k[1]) + '">' + LA.esc(k[0]) + "</button>").join("");
    let last = null;
    scope.addEventListener("focusin", (e) => { if (e.target.matches("input[type=text], textarea")) last = e.target; });
    bar.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the field
    bar.addEventListener("click", (e) => {
      const b = e.target.closest(".mk"); if (!b) return;
      const [, text, back] = keys[+b.dataset.k];
      const el = last && document.body.contains(last) ? last : scope.querySelector("input[type=text], textarea"); if (!el) return;
      const s = el.selectionStart == null ? el.value.length : el.selectionStart, t = el.selectionEnd == null ? s : el.selectionEnd;
      el.value = el.value.slice(0, s) + text + el.value.slice(t);
      const pos = s + text.length + (back || 0);
      el.focus(); try { el.setSelectionRange(pos, pos); } catch (err) { /* ignore */ }
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    return bar;
  };
})();
