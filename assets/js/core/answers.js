/* Answer-equivalence engine.
   Answers are compared MATHEMATICALLY, never as text:
   - numbers/fractions/surds: exact rational comparison when both sides are rational, otherwise numeric (1e-9 relative)
   - complex numbers a+bi: exact Gaussian-rational comparison
   - vectors / matrices: component-wise; optional "any non-zero multiple" (eigenvectors, directions)
   - polynomials and multivariate expressions: exact polynomial identity (expanded), numeric sampling as a fallback
   - bases/spanning sets: SAME SUBSPACE test (independence + mutual containment), so any correct basis is accepted
   - multisets (e.g. eigenvalues with multiplicity), multiple choice, true/false
   - written reasoning: transparent keyword/structure rubric (clearly reported as heuristic)
   Every checker returns { ok: true|false, score: 0..1, msg: string }. */
(function () {
  "use strict";
  const LA = (window.LA = window.LA || {});
  const { Frac, QNum, Poly } = LA;
  const P = LA.parse;

  /* ---------------- input normalisation ---------------- */
  function unbrace(s, cmd, nargs, fmt) { // replace \cmd{a}{b} (no nested braces inside args), repeated until stable
    const re = nargs === 2 ? new RegExp("\\\\" + cmd + "\\s*\\{([^{}]*)\\}\\s*\\{([^{}]*)\\}", "g") : new RegExp("\\\\" + cmd + "\\s*\\{([^{}]*)\\}", "g");
    let prev; do { prev = s; s = s.replace(re, fmt); } while (s !== prev);
    return s;
  }
  function norm(src) {
    let s = String(src == null ? "" : src);
    s = s.replace(/\$/g, " ").replace(/\\left|\\right|\\,|\\;|\\!|\\:|\\quad/g, " ")
      .replace(/\\[dt]frac/g, "\\frac").replace(/\\cdot|\\times|[×·⋅∙]/g, "*").replace(/÷/g, "/")
      .replace(/[−–—]/g, "-").replace(/\\lambda|λ/g, "lambda").replace(/\\pi|π/g, "pi")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/⁻¹/g, "^(-1)");
    let prev; do { prev = s; s = unbrace(s, "sqrt", 1, "sqrt($1)"); s = unbrace(s, "frac", 2, "(($1)/($2))"); } while (s !== prev);
    s = s.replace(/√\s*\(/g, "sqrt(").replace(/√\s*([0-9.]+|[a-zA-Z])/g, "sqrt($1)");
    s = s.replace(/\\begin\{[a-zA-Z]*matrix\}|\\end\{[a-zA-Z]*matrix\}/g, " ").replace(/\\\\/g, ";").replace(/&/g, ",");
    s = s.replace(/[{}]/g, (c) => (c === "{" ? "(" : ")")).replace(/⟨/g, "(").replace(/⟩/g, ")");
    return s.replace(/\s+/g, " ").trim();
  }

  /* ---------------- scalars (real or complex) ---------------- */
  // value: { re: number, im: number, exRe: Frac|null, exIm: Frac|null }
  function mk(exRe, exIm, re, im) {
    return { exRe: exRe || null, exIm: exIm === undefined ? Frac.ZERO : exIm, re: exRe ? exRe.toNumber() : re, im: exIm ? exIm.toNumber() : im || 0 };
  }
  function scalar(src) {
    const s = norm(src);
    if (!s) throw new Error("Empty answer");
    if (/[a-hj-z]/i.test(s.replace(/sqrt|abs|sin|cos|tan|exp|ln|log|pi/g, ""))) throw new Error('Unexpected letters in a number: "' + src + '"');
    const hasI = /(^|[^a-z])i($|[^a-z])/.test(s);
    if (/pi/.test(s)) { const ast = P.parse(s.replace(/pi/g, "(" + Math.PI + ")"), []); const x = P.evalNum(ast, {}); if (!isFinite(x)) throw new Error("Not a finite number"); return mk(null, null, x, 0); }
    const ast = P.parse(s, hasI ? ["i"] : []);
    try {
      const mp = P.toMPoly(ast, hasI ? ["i"] : []);
      if (!hasI) return mk(P.mpConstVal(mp), Frac.ZERO);
      let re = Frac.ZERO, im = Frac.ZERO;
      mp.forEach((c, k) => { const e = Number(k) % 4; if (e === 0) re = re.add(c); else if (e === 1) im = im.add(c); else if (e === 2) re = re.sub(c); else im = im.sub(c); });
      return mk(re, im);
    } catch (e) {
      if (!(e instanceof P.NonPoly)) throw e;
      if (hasI) throw new Error("Write complex numbers as a + bi with exact numbers");
      const x = P.evalNum(ast, {});
      if (!isFinite(x)) throw new Error("Not a finite number");
      return mk(null, null, x, 0);
    }
  }
  function toVal(x) {
    if (x && x.re !== undefined && x.im !== undefined) return x;
    if (x instanceof Frac) return mk(x, Frac.ZERO);
    if (x instanceof QNum) {
      if (x.b.isZero()) return mk(x.a, Frac.ZERO);
      if (x.D === -1n) return mk(x.a, x.b);
      if (x.D < 0n) return mk(x.a, null, x.a.toNumber(), x.b.toNumber() * Math.sqrt(Number(-x.D)));
      return mk(null, Frac.ZERO, x.toNumber(), 0);
    }
    if (typeof x === "number") return Number.isInteger(x) ? mk(Frac.of(x), Frac.ZERO) : mk(null, Frac.ZERO, x, 0);
    if (typeof x === "bigint") return mk(Frac.of(x), Frac.ZERO);
    return scalar(String(x));
  }
  const close = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  function valEq(a, b) {
    a = toVal(a); b = toVal(b);
    const reOk = a.exRe && b.exRe ? a.exRe.eq(b.exRe) : close(a.re, b.re);
    const imOk = a.exIm && b.exIm ? a.exIm.eq(b.exIm) : close(a.im, b.im);
    return reOk && imOk;
  }
  function valIsZero(a) { a = toVal(a); return (a.exRe ? a.exRe.isZero() : Math.abs(a.re) < 1e-12) && (a.exIm ? a.exIm.isZero() : Math.abs(a.im) < 1e-12); }
  function valTex(a) {
    a = toVal(a);
    const r = a.exRe ? a.exRe.tex() : String(+a.re.toFixed(6));
    if (a.exIm ? a.exIm.isZero() : Math.abs(a.im) < 1e-12) return r;
    const im = a.exIm ? a.exIm : null; const ia = im ? im.abs() : Math.abs(a.im); const neg = im ? im.sign() < 0 : a.im < 0;
    const ib = (im ? (ia.isOne() ? "" : ia.tex()) : String(+ia.toFixed(6))) + "i";
    return ((a.exRe ? a.exRe.isZero() : Math.abs(a.re) < 1e-12) ? (neg ? "-" : "") + ib : r + (neg ? " - " : " + ") + ib);
  }

  /* ---------------- splitting helpers ---------------- */
  function splitTop(s, seps) {
    const out = []; let d = 0, cur = "";
    for (const ch of s) {
      if ("([".includes(ch)) d++; else if (")]".includes(ch)) d--;
      if (d === 0 && seps.includes(ch)) { out.push(cur); cur = ""; } else cur += ch;
    }
    out.push(cur);
    return out.map((x) => x.trim()).filter((x) => x.length);
  }
  function wraps(s) {
    if (!/^[([]/.test(s) || !/[)\]]$/.test(s)) return false;
    let d = 0; for (let i = 0; i < s.length; i++) { if ("([".includes(s[i])) d++; else if (")]".includes(s[i])) { d--; if (d === 0 && i < s.length - 1) return false; } }
    return true;
  }
  function stripT(s) { return s.replace(/\^\s*\(?\s*T\s*\)?\s*$/, "").trim(); }

  /* ---------------- vectors & matrices ---------------- */
  function vector(src) {
    let s = stripT(norm(src));
    if (wraps(s)) s = s.slice(1, -1).trim();
    let parts = splitTop(s, ",;");
    if (parts.length === 1 && / /.test(parts[0])) { // "1 -2 3/4": whitespace-separated entries (but not "1 - 2")
      const toks = parts[0].split(" ");
      if (toks.every((k) => !/^[+\-*/^]$/.test(k) && !/^[+*/^]/.test(k) && !/[+\-*/^]$/.test(k))) parts = toks;
    }
    if (!parts.length) throw new Error("Empty vector");
    return parts.map(scalar);
  }
  function matrix(src) {
    let s = norm(src);
    let rows;
    if (/^\[\s*\[/.test(s) || /^\(\s*\(/.test(s)) { s = s.slice(1, -1); rows = splitTop(s, ",;").map(vector); }
    else {
      if (wraps(s) && s.includes(";")) s = s.slice(1, -1);
      rows = String(src).includes("\n") && !s.includes(";") ? String(src).split("\n").map((r) => r.trim()).filter(Boolean).map(vector) : splitTop(s, ";").map(vector);
    }
    if (!rows.length) throw new Error("Empty matrix");
    const n = rows[0].length;
    if (rows.some((r) => r.length !== n)) throw new Error("Rows have different lengths");
    return rows;
  }
  function vectorList(src) {
    let s = norm(src);
    if (/^(\(\s*\)|∅|\\emptyset|none|empty|\(0\)|0)$/i.test(s)) return [];
    if (wraps(s) && /^[([]\s*[([]/.test(s)) s = s.slice(1, -1).trim();
    const parts = splitTop(s, ",;\n");
    if (!parts.some((p) => /^[([]/.test(p))) return [vector(s)];
    return parts.map(vector);
  }

  /* ---------------- polynomials & expressions ---------------- */
  function poly(src, v) {
    v = v || "x";
    let s = norm(src); if (v !== "lambda") s = s.replace(/lambda/g, v);
    const ast = P.parse(s, [v]);
    const mp = P.toMPoly(ast, [v]);
    const c = []; mp.forEach((val, k) => { const e = Number(k); while (c.length <= e) c.push(Frac.ZERO); c[e] = c[e].add(val); });
    return new Poly(c);
  }
  function polyList(src, v) {
    const s = norm(src);
    if (/^(\(\s*\)|none|empty|0)$/i.test(s)) return [];
    let t = s; if (wraps(t) && splitTop(t.slice(1, -1), ",;").length > 1) t = t.slice(1, -1);
    return splitTop(t, ",;").map((p) => poly(p, v));
  }
  function exprEq(userSrc, expectedSrc, vars) {
    const u = norm(userSrc), e = norm(expectedSrc);
    const au = P.parse(u, vars), ae = P.parse(e, vars);
    try {
      const mu = P.toMPoly(au, vars), me = P.toMPoly(ae, vars);
      const keys = new Set([...mu.keys(), ...me.keys()]);
      for (const k of keys) { const a = mu.get(k) || Frac.ZERO, b = me.get(k) || Frac.ZERO; if (!a.eq(b)) return false; }
      return true;
    } catch (err) {
      if (!(err instanceof P.NonPoly)) throw err;
      const rng = LA.RNG ? LA.RNG(LA.hashStr(u + "|" + e)) : { next: Math.random };
      for (let t = 0; t < 7; t++) {
        const env = {}; vars.forEach((v) => { env[v] = 0.3 + 2.4 * rng.next(); });
        const x = P.evalNum(au, env), y = P.evalNum(ae, env);
        if (!(isFinite(x) && isFinite(y)) || Math.abs(x - y) > 1e-7 * Math.max(1, Math.abs(x), Math.abs(y))) return false;
      }
      return true;
    }
  }

  /* ---------------- exact linear algebra on parsed values ---------------- */
  function asFracVec(vals) { return vals.map((v) => { v = toVal(v); if (!v.exRe || !v.exIm || !v.exIm.isZero()) throw new Error("Use exact rational entries here (fractions, not decimals with rounding)."); return v.exRe; }); }
  function rankOf(vecs) { if (!vecs.length) return 0; return LA.alg.rank(vecs.map((v) => v.slice())); }
  function inSpan(basis, v) { if (!basis.length) return v.every((x) => x.isZero()); return rankOf(basis.concat([v])) === rankOf(basis); }

  /* ---------------- checkers ---------------- */
  const OK = (msg) => ({ ok: true, score: 1, msg: msg || "Correct." });
  const NO = (msg, score) => ({ ok: false, score: score || 0, msg: msg || "Not correct." });

  const C = {};
  C.num = (spec, input) => {
    const u = scalar(input);
    if (valEq(u, spec.answer)) return OK();
    if (spec.tol && Math.abs(u.re - toVal(spec.answer).re) <= spec.tol) return OK("Accepted (within tolerance).");
    const A = toVal(spec.answer);
    if (/\d\.\d/.test(String(input)) && Math.abs(u.re - A.re) <= 1e-3 * Math.max(1, Math.abs(A.re)) && Math.abs(u.im - A.im) < 1e-3) return NO("Close, but that looks rounded — give the exact value (a fraction or a surd such as sqrt(2)/2).", 0.5);
    if (valEq(u, A.exRe ? mk(A.exRe.neg(), A.exIm ? A.exIm.neg() : null, -A.re, -A.im) : mk(null, null, -A.re, -A.im)) && !valIsZero(A)) return NO("Check your sign.");
    return NO();
  };
  C.vec = (spec, input) => {
    const u = vector(input), a = spec.answer.map(toVal);
    if (u.length !== a.length) return NO("Expected " + a.length + " components, you gave " + u.length + ".");
    if (spec.multiple) {
      if (u.every(valIsZero)) return NO("The zero vector is never accepted here (eigenvectors/directions must be non-zero).");
      // u = c a for some non-zero c: find pivot
      const k = a.findIndex((x) => !valIsZero(x));
      const ur = asFracVec(u), ar = asFracVec(a);
      const c = ur[k].div(ar[k]);
      if (!c.isZero() && ur.every((x, i) => x.eq(ar[i].mul(c)))) return OK(c.isOne() ? "Correct." : "Correct — any non-zero multiple works (yours is " + c.toString() + "× the model answer).");
      return NO("Not a multiple of a correct answer.");
    }
    const wrong = u.map((x, i) => !valEq(x, a[i]));
    if (!wrong.some(Boolean)) return OK();
    const n = wrong.filter(Boolean).length;
    return NO(n + " of " + a.length + " components incorrect (component" + (n > 1 ? "s " : " ") + wrong.map((w, i) => (w ? i + 1 : null)).filter((x) => x).join(", ") + ").", (a.length - n) / a.length * 0.5);
  };
  C.mat = (spec, input) => {
    const u = matrix(input), a = spec.answer;
    if (u.length !== a.length || u[0].length !== a[0].length) return NO("Expected a " + a.length + "×" + a[0].length + " matrix, you gave " + u.length + "×" + u[0].length + ".");
    let bad = 0, tot = 0; const where = [];
    a.forEach((row, i) => row.forEach((x, j) => { tot++; if (!valEq(u[i][j], x)) { bad++; if (where.length < 4) where.push("(" + (i + 1) + "," + (j + 1) + ")"); } }));
    if (!bad) return OK();
    return NO(bad + " entr" + (bad > 1 ? "ies" : "y") + " incorrect, e.g. " + where.join(", ") + ".", ((tot - bad) / tot) * 0.5);
  };
  C.poly = (spec, input) => {
    const u = poly(input, spec.v || "x"); const a = spec.answer instanceof Poly ? spec.answer : new Poly(spec.answer);
    if (u.sub(a).isZero()) return OK();
    if (spec.monicUpToSign && u.add(a).isZero()) return OK("Correct up to sign (both conventions det(A−λI) and det(λI−A) are accepted).");
    return NO("Not the same polynomial (expanded forms differ).");
  };
  C.expr = (spec, input) => (exprEq(input, spec.answer, spec.vars || []) ? OK() : NO("Not equivalent to the expected expression."));
  C.span = (spec, input) => {
    const basis = spec.answer.map((v) => asFracVec(v.map(toVal)));
    const dim = rankOf(basis);
    const u = vectorList(input).map(asFracVec);
    const n = spec.n || (basis[0] ? basis[0].length : u[0] ? u[0].length : 0);
    if (u.some((v) => v.length !== n)) return NO("Each vector should have " + n + " components.");
    if (dim === 0) return u.every((v) => v.every((x) => x.isZero())) ? OK("Correct — the subspace is {0}; its basis is the empty set ∅ (dimension 0).") : NO("This subspace is just {0}: its basis is the empty set ∅.");
    const r = rankOf(u);
    for (const v of u) if (!inSpan(basis, v)) return NO("(" + v.map((x) => x.toString()).join(", ") + ") is not in the subspace.");
    if (spec.basis !== false && r < u.length) return NO("Your vectors are linearly dependent, so they are not a basis.", 0.3);
    if (r < dim) return NO("Your vectors lie in the subspace but do not span it: it has dimension " + dim + ", yours span dimension " + r + ".", 0.4);
    return OK(u.length === basis.length ? "Correct — this is a basis of the subspace." : "Correct.");
  };
  C.polyspan = (spec, input) => { // spec.answer: list of coefficient arrays (ascending), spec.n = number of coefficients
    const n = spec.n; const toVec = (p) => Array.from({ length: n }, (_, i) => p.coef(i));
    const u = polyList(input, spec.v || "x");
    if (u.some((p) => p.deg() >= n)) return NO("Degree too high for this space.");
    const vecs = u.map((p) => toVec(p).map((x) => x.toString())).map((v) => "(" + v.join(",") + ")").join(",") || "0";
    return C.span({ answer: spec.answer, n, basis: spec.basis }, vecs);
  };
  C.set = (spec, input) => {
    let s = norm(input); if (wraps(s)) s = s.slice(1, -1).trim();
    const u = /^(∅|\\emptyset|none|empty|)$/i.test(s) ? [] : splitTop(s, ",;").map(scalar), a = spec.answer.map(toVal);
    if (!a.length) return u.length ? NO("This set is empty (∅).") : OK();
    if (spec.multiplicity === false) {
      const uniq = (L) => L.filter((x, i) => L.findIndex((y) => valEq(x, y)) === i);
      const U = uniq(u), A = uniq(a);
      const missing = A.filter((x) => !U.some((y) => valEq(x, y))), extra = U.filter((x) => !A.some((y) => valEq(x, y)));
      if (!missing.length && !extra.length) return OK();
      return NO((missing.length ? missing.length + " missing" : "") + (missing.length && extra.length ? ", " : "") + (extra.length ? extra.length + " wrong" : "") + ".", Math.max(0, (A.length - missing.length - extra.length) / A.length) * 0.5);
    }
    const left = a.slice(); let extra = 0;
    u.forEach((x) => { const i = left.findIndex((y) => valEq(x, y)); if (i >= 0) left.splice(i, 1); else extra++; });
    if (!left.length && !extra) return OK();
    return NO((left.length ? left.length + " value(s) missing" : "") + (left.length && extra ? ", " : "") + (extra ? extra + " value(s) wrong" : "") + " (list repeated values as many times as their multiplicity).", Math.max(0, (a.length - left.length - extra) / a.length) * 0.5);
  };
  C.custom = (spec, input) => spec.fn(input);
  C.mcq = (spec, input) => (Number(input) === spec.answer ? OK() : NO(spec.why ? spec.why[Number(input)] || "" : ""));
  C.tf = (spec, input) => { const v = typeof input === "boolean" ? input : /^(t|true|yes|y|1)$/i.test(String(input).trim()); return v === spec.answer ? OK() : NO(); };
  // Written reasoning: transparent keyword/structure rubric. NEVER presented as verification of correctness.
  C.text = (spec, input) => {
    const r = rubric(input, spec.rubric);
    const pass = r.score >= (spec.pass || 0.7);
    return { ok: pass, score: r.score, msg: (pass ? "Your answer mentions the key ideas. " : "Some key ideas seem to be missing. ") + "(Automatic keyword check — compare with the model answer to be sure.)", items: r.items, heuristic: true };
  };
  function rubric(text, items) {
    const t = " " + String(text || "").toLowerCase().replace(/\s+/g, " ") + " ";
    let got = 0, tot = 0;
    const res = items.map((it) => {
      const w = it.w || 1; tot += w;
      const ok = (it.all || []).every((re) => re.test(t)) && (!it.any || it.any.some((re) => re.test(t)));
      if (ok) got += w;
      return { label: it.label, ok, hint: it.hint || "" };
    });
    return { score: tot ? got / tot : 0, items: res };
  }

  function check(spec, input) {
    if (input === undefined || input === null || (typeof input === "string" && !input.trim())) return { ok: false, score: 0, msg: "Enter an answer first.", empty: true };
    const fn = C[spec.type];
    if (!fn) return { ok: false, score: 0, msg: "Unknown answer type " + spec.type };
    try { return fn(spec, input); }
    catch (e) { return { ok: false, score: 0, msg: "Couldn't read your answer: " + e.message + ". " + (FORMAT[spec.type] || ""), parseError: true }; }
  }
  const FORMAT = {
    num: "Examples: 3, -2/5, 0.25, sqrt(2)/2, 1+i.",
    vec: "Examples: (1, -2, 3) or 1, -2, 3.",
    mat: "Examples: [[1,2],[3,4]] or 1 2; 3 4 (rows separated by ;).",
    poly: "Example: 3x^2 - x + 2.",
    expr: "Use * for multiplication and ^ for powers, e.g. 2*x*y - y^2.",
    span: "List vectors: (1,0,1), (0,1,-1). For the zero subspace type 0.",
    polyspan: "List polynomials: 1+x, x^2.",
    set: "List values separated by commas, e.g. 2, 2, 5.",
  };

  LA.ans = { norm, scalar, toVal, valEq, valTex, vector, matrix, vectorList, poly, polyList, exprEq, check, rubric, FORMAT, splitTop };
})();
