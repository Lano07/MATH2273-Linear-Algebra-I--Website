/* Unit tests: seeded RNG + answer-equivalence engine */
"use strict";
module.exports = function (t, LA) {
  const { Frac, QNum, Poly } = LA;
  const ck = (spec, input) => LA.ans.check(spec, input);
  const yes = (name, spec, input) => t.ok(ck(spec, input).ok, name + " — accepts " + JSON.stringify(input) + " (" + ck(spec, input).msg + ")");
  const no = (name, spec, input) => t.ok(!ck(spec, input).ok, name + " — rejects " + JSON.stringify(input));

  // --- RNG reproducibility
  const a = LA.RNG(12345), b = LA.RNG(12345), c = LA.RNG(54321);
  const sa = Array.from({ length: 20 }, () => a.int(-9, 9)), sb = Array.from({ length: 20 }, () => b.int(-9, 9)), sc = Array.from({ length: 20 }, () => c.int(-9, 9));
  t.eq(sa.join(), sb.join(), "RNG: same seed ⇒ same sequence");
  t.ok(sa.join() !== sc.join(), "RNG: different seed ⇒ different sequence");
  t.ok(Array.from({ length: 200 }, () => LA.RNG(7).nz(-3, 3)).every((x) => x !== 0), "RNG: nz never returns 0");
  t.eq(LA.RNG("gen:1").int(0, 1e6), LA.RNG("gen:1").int(0, 1e6), "RNG: string seeds hash deterministically");

  // --- numbers
  const half = { type: "num", answer: new Frac(1n, 2n) };
  yes("num 1/2", half, "1/2"); yes("num 1/2", half, "0.5"); yes("num 1/2", half, "2/4"); yes("num 1/2", half, "\\frac{1}{2}"); yes("num 1/2", half, " 3/6 "); yes("num 1/2", half, "1 - 1/2");
  no("num 1/2", half, "0.49"); no("num 1/2", half, "-1/2");
  t.ok(/sign/i.test(ck(half, "-1/2").msg), "num: sign hint");
  const third = { type: "num", answer: new Frac(1n, 3n) };
  no("num 1/3", third, "0.333"); t.ok(/rounded/.test(ck(third, "0.333").msg), "num: rounded-decimal hint");
  const r2 = { type: "num", answer: new QNum(0, new Frac(1n, 2n), 2) }; // √2/2
  yes("surd √2/2", r2, "sqrt(2)/2"); yes("surd √2/2", r2, "1/sqrt(2)"); yes("surd √2/2", r2, "√2/2"); yes("surd √2/2", r2, "\\frac{\\sqrt{2}}{2}"); no("surd √2/2", r2, "0.7071");
  const cpx = { type: "num", answer: new QNum(1, 2, -1) }; // 1+2i
  yes("complex 1+2i", cpx, "1+2i"); yes("complex 1+2i", cpx, "2i + 1"); yes("complex 1+2i", cpx, "1 + 2*i"); no("complex 1+2i", cpx, "1-2i"); no("complex 1+2i", cpx, "1+2");
  t.ok(ck(half, "abc").parseError, "num: garbage gives a parse error, not a crash");
  t.ok(ck(half, "").empty, "num: empty input flagged");

  // --- vectors
  const v = { type: "vec", answer: [1, -2, new Frac(3n, 4n)] };
  yes("vec", v, "(1, -2, 3/4)"); yes("vec", v, "1,-2,0.75"); yes("vec", v, "[1 -2 3/4]"); yes("vec", v, "(1,-2,3/4)^T");
  no("vec", v, "(1,2,3/4)"); no("vec", v, "(1,-2)");
  t.ok(/3 components/.test(ck(v, "(1,-2)").msg), "vec: length message");
  const ev = { type: "vec", answer: [1, 2], multiple: true };
  yes("eigvec multiple", ev, "(2,4)"); yes("eigvec multiple", ev, "(-1,-2)"); yes("eigvec multiple", ev, "(1/2, 1)"); no("eigvec multiple", ev, "(0,0)"); no("eigvec multiple", ev, "(2,1)");
  const ev2 = { type: "vec", answer: [0, 1, -1], multiple: true };
  yes("eigvec multiple with zero entry", ev2, "(0,-3,3)"); no("eigvec multiple with zero entry", ev2, "(1,-3,3)");

  // --- matrices
  const m = { type: "mat", answer: [[1, 2], [3, new Frac(-1n, 2n)]] };
  yes("mat", m, "[[1,2],[3,-1/2]]"); yes("mat", m, "1 2; 3 -1/2"); yes("mat", m, "1,2;3,-0.5"); yes("mat", m, "1 2\n3 -1/2"); yes("mat", m, "\\begin{pmatrix}1&2\\\\3&-\\frac12\\end{pmatrix}".replace("\\frac12", "\\frac{1}{2}"));
  no("mat", m, "1 2; 3 1/2"); no("mat", m, "1 2 3; 4 5 6");

  // --- polynomials
  const p = { type: "poly", answer: new Poly([2, -3, 1]) }; // x^2 - 3x + 2
  yes("poly", p, "x^2-3x+2"); yes("poly", p, "(x-1)(x-2)"); yes("poly", p, "2 - 3*x + x²"); no("poly", p, "x^2+3x+2");
  const cp = { type: "poly", answer: new Poly([2, -3, 1]), v: "lambda", monicUpToSign: true };
  yes("char poly λ", cp, "λ^2 - 3λ + 2"); yes("char poly λ", cp, "(lambda-1)(lambda-2)"); yes("char poly up to sign", cp, "-λ^2+3λ-2");

  // --- expressions
  const e = { type: "expr", answer: "(x+y)^2", vars: ["x", "y"] };
  yes("expr", e, "x^2+2xy+y^2"); yes("expr", e, "y^2 + 2*x*y + x^2"); no("expr", e, "x^2+y^2");
  const e2 = { type: "expr", answer: "sqrt(x^2)", vars: ["x"] };
  yes("expr numeric fallback", e2, "abs(x)");

  // --- spans / bases (any correct basis accepted)
  const sp = { type: "span", answer: [[1, 0, -1], [0, 1, -1]] }; // plane x+y+z=0
  yes("span", sp, "(1,0,-1),(0,1,-1)"); yes("span", sp, "(1,-1,0), (1,1,-2)"); yes("span", sp, "{(2,0,-2),(0,3,-3)}");
  no("span", sp, "(1,0,-1)"); no("span", sp, "(1,0,-1),(2,0,-2)"); no("span", sp, "(1,0,0),(0,1,-1)");
  t.ok(/not in the subspace/.test(ck(sp, "(1,0,0),(0,1,-1)").msg), "span: names the vector outside the subspace");
  t.ok(/dependent/.test(ck(sp, "(1,0,-1),(0,1,-1),(1,1,-2)").msg), "span: rejects dependent sets as bases");
  const z = { type: "span", answer: [], n: 3 };
  yes("zero subspace", z, "0"); yes("zero subspace", z, "{0}"); yes("zero subspace", z, "∅"); yes("zero subspace", z, "(0,0,0)"); no("zero subspace", z, "(1,0,0)");
  const ps = { type: "polyspan", answer: [[-1, 1, 0], [-1, 0, 1]], n: 3 }; // {p in P2 : p(1)=0}
  yes("polyspan", ps, "x-1, x^2-1"); yes("polyspan", ps, "(x-1), x^2 - x"); no("polyspan", ps, "x, x^2");

  // --- multisets
  const ms = { type: "set", answer: [2, 2, 5] };
  yes("multiset", ms, "2,2,5"); yes("multiset", ms, "5, 2, 2"); no("multiset", ms, "2,5"); no("multiset", ms, "2,2,5,5");
  const st = { type: "set", answer: [2, 5], multiplicity: false };
  yes("set", st, "5,2"); yes("set", st, "{2, 5}"); no("set", st, "2");

  // --- mcq / tf
  t.ok(ck({ type: "mcq", answer: 2 }, 2).ok && !ck({ type: "mcq", answer: 2 }, 1).ok, "mcq");
  t.ok(ck({ type: "tf", answer: false }, false).ok && !ck({ type: "tf", answer: false }, "true").ok, "true/false");

  // --- written reasoning rubric (heuristic, reported as such)
  const tx = { type: "text", rubric: [{ label: "zero vector", any: [/t\(0\)\s*=\s*0/, /zero/] }, { label: "linearity", any: [/linear/] }], pass: 1 };
  const r = ck(tx, "Since T is linear, T(0) = 0.");
  t.ok(r.ok && r.heuristic, "text rubric passes and is flagged heuristic");
  t.ok(!ck(tx, "It is obvious.").ok, "text rubric fails a contentless answer");
};
