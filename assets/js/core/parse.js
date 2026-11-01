/* =====================================================================
   Expression parser for linear-map formulas and polynomial operators.
   - R^n formulas:  "x - 3y + 5z", "(x+y, 2x - z)", "|x|", "x*y", "x^2"
   - Polynomial operators (in p): "p' - 4p", "p'' + p^2", "p(0) + p(1)x",
     "x p' + 2p", "int(0,1)"  (∫_0^1 p(x) dx)
   ===================================================================== */
(function () {
  "use strict";
  const LA = (window.LA = window.LA || {});
  const { Frac, Poly } = LA;

  const FUNCS = ["abs", "sqrt", "sin", "cos", "tan", "exp", "ln", "log", "int"];

  function tokenize(src, vars, opts) {
    opts = opts || {};
    const s = src.replace(/−/g, "-").replace(/·|×/g, "*").replace(/∫/g, "int").replace(/[’′]/g, "'");
    const toks = [];
    let i = 0;
    const isD = (c) => c >= "0" && c <= "9";
    const isA = (c) => /[A-Za-z_]/.test(c);
    while (i < s.length) {
      const c = s[i];
      if (c === " " || c === "\t" || c === "\n") { i++; continue; }
      if (isD(c) || (c === "." && isD(s[i + 1] || ""))) {
        let j = i; while (j < s.length && (isD(s[j]) || s[j] === ".")) j++;
        toks.push({ t: "num", v: s.slice(i, j) }); i = j; continue;
      }
      if (isA(c)) {
        let j = i; while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++;
        let word = s.slice(i, j);
        // split into known names greedily (vars, funcs, p, x)
        const known = (vars || []).concat(FUNCS).concat(opts.polyMode ? ["p", "x"] : []).sort((a, b) => b.length - a.length);
        let k = 0;
        while (k < word.length) {
          const hit = known.find((nm) => word.startsWith(nm, k));
          if (!hit) throw new Error('Unknown symbol "' + word.slice(k) + '"' + (vars && vars.length ? " (variables: " + vars.join(", ") + ")" : ""));
          toks.push({ t: FUNCS.includes(hit) ? "fn" : "id", v: hit });
          k += hit.length;
        }
        i = j; continue;
      }
      if ("+-*/^(),|'".includes(c)) { toks.push({ t: c }); i++; continue; }
      throw new Error('Unexpected character "' + c + '"');
    }
    return toks;
  }

  function parse(src, vars, opts) {
    opts = opts || {};
    const toks = tokenize(src, vars, opts);
    let pos = 0;
    const peek = () => toks[pos];
    const next = () => toks[pos++];
    const expect = (t) => { const k = next(); if (!k || k.t !== t) throw new Error('Expected "' + t + '"'); return k; };

    function parseExpr() {
      let node = parseTerm();
      while (peek() && (peek().t === "+" || peek().t === "-")) {
        const op = next().t; const rhs = parseTerm();
        node = { type: op === "+" ? "add" : "sub", a: node, b: rhs };
      }
      return node;
    }
    function startsFactor(k) { return k && (k.t === "num" || k.t === "id" || k.t === "fn" || k.t === "(" ); }
    function parseTerm() {
      let node = parseUnary();
      for (;;) {
        const k = peek();
        if (k && (k.t === "*" || k.t === "/")) { next(); const rhs = parseUnary(); node = { type: k.t === "*" ? "mul" : "div", a: node, b: rhs }; continue; }
        if (startsFactor(k)) { const rhs = parsePower(); node = { type: "mul", a: node, b: rhs }; continue; } // implicit
        break;
      }
      return node;
    }
    function parseUnary() {
      const k = peek();
      if (k && (k.t === "-" || k.t === "+")) { next(); const a = parseUnary(); return k.t === "-" ? { type: "neg", a } : a; }
      return parsePower();
    }
    function parsePower() {
      let base = parseAtom();
      if (peek() && peek().t === "^") { next(); const e = parseUnary(); base = { type: "pow", a: base, b: e }; }
      return base;
    }
    function parseAtom() {
      const k = next();
      if (!k) throw new Error("Unexpected end of expression");
      if (k.t === "num") return { type: "num", v: Frac.parse(k.v) };
      if (k.t === "(") { const e = parseExpr(); expect(")"); return e; }
      if (k.t === "|") { const e = parseExpr(); expect("|"); return { type: "fn", f: "abs", args: [e] }; }
      if (k.t === "fn") {
        expect("(");
        const args = [parseExpr()];
        while (peek() && peek().t === ",") { next(); args.push(parseExpr()); }
        expect(")");
        return { type: "fn", f: k.v, args };
      }
      if (k.t === "id") {
        if (opts.polyMode && k.v === "p") {
          let order = 0; while (peek() && peek().t === "'") { next(); order++; }
          if (peek() && peek().t === "(") {
            // p(t) evaluation — but "p(x)" just means p
            next();
            if (peek() && peek().t === "id" && peek().v === "x" && toks[pos + 1] && toks[pos + 1].t === ")") { next(); next(); return { type: "p", order }; }
            const at = parseExpr(); expect(")");
            return { type: "peval", order, at };
          }
          return { type: "p", order };
        }
        return { type: "var", v: k.v };
      }
      throw new Error('Unexpected "' + k.t + '"');
    }
    const ast = parseExpr();
    if (pos < toks.length) throw new Error('Unexpected "' + (toks[pos].v || toks[pos].t) + '"');
    return ast;
  }

  /* ---------- Multivariate polynomial evaluation (exact) ---------- */
  class NonPoly extends Error {}
  // MPoly: Map key "e1,e2,..." -> Frac
  function mpConst(n, c) { const m = new Map(); if (!c.isZero()) m.set(new Array(n).fill(0).join(","), c); return m; }
  function mpVar(n, i) { const e = new Array(n).fill(0); e[i] = 1; return new Map([[e.join(","), Frac.ONE]]); }
  function mpAdd(a, b, sgn) { const r = new Map(a); b.forEach((c, k) => { const v = (r.get(k) || Frac.ZERO).add(sgn < 0 ? c.neg() : c); if (v.isZero()) r.delete(k); else r.set(k, v); }); return r; }
  function mpMul(a, b) { const r = new Map(); a.forEach((c1, k1) => b.forEach((c2, k2) => { const e1 = k1.split(",").map(Number), e2 = k2.split(",").map(Number); const k = e1.map((x, i) => x + e2[i]).join(","); const v = (r.get(k) || Frac.ZERO).add(c1.mul(c2)); if (v.isZero()) r.delete(k); else r.set(k, v); })); return r; }
  function mpIsConst(a) { for (const k of a.keys()) if (k.split(",").some((x) => x !== "0")) return false; return true; }
  function mpConstVal(a) { let v = Frac.ZERO; a.forEach((c) => { v = v.add(c); }); return v; }
  function toMPoly(ast, vars) {
    const n = vars.length;
    const rec = (nd) => {
      switch (nd.type) {
        case "num": return mpConst(n, nd.v);
        case "var": { const i = vars.indexOf(nd.v); if (i < 0) throw new Error("Unknown variable " + nd.v); return mpVar(n, i); }
        case "add": return mpAdd(rec(nd.a), rec(nd.b), 1);
        case "sub": return mpAdd(rec(nd.a), rec(nd.b), -1);
        case "neg": return mpAdd(new Map(), rec(nd.a), -1);
        case "mul": return mpMul(rec(nd.a), rec(nd.b));
        case "div": { const d = rec(nd.b); if (!mpIsConst(d)) throw new NonPoly("division by a variable"); const c = mpConstVal(d); if (c.isZero()) throw new Error("Division by zero"); return mpMul(rec(nd.a), mpConst(n, c.inv())); }
        case "pow": { const e = rec(nd.b); if (!mpIsConst(e)) throw new NonPoly("variable exponent"); const k = mpConstVal(e); if (!k.isInt() || k.sign() < 0 || k.n > 12n) throw new NonPoly("non-integer power"); let r = mpConst(n, Frac.ONE); const base = rec(nd.a); for (let i = 0; i < Number(k.n); i++) r = mpMul(r, base); return r; }
        case "fn": throw new NonPoly(nd.f + "(...) is not a polynomial operation");
        default: throw new NonPoly("unsupported");
      }
    };
    return rec(ast);
  }
  function mpEval(mp, point) { // point: Frac[]
    let s = Frac.ZERO;
    mp.forEach((c, k) => { const e = k.split(",").map(Number); let t = c; e.forEach((p, i) => { if (p) t = t.mul(point[i].pow(p)); }); s = s.add(t); });
    return s;
  }
  function mpDegreeInfo(mp) { // returns set of total degrees present
    const degs = new Set(); mp.forEach((_, k) => degs.add(k.split(",").reduce((a, b) => a + Number(b), 0))); return degs;
  }
  // linear coefficients (degree-1 monomials)
  function mpLinearCoeffs(mp, n) {
    const out = new Array(n).fill(Frac.ZERO);
    mp.forEach((c, k) => { const e = k.split(",").map(Number); const tot = e.reduce((a, b) => a + b, 0); if (tot === 1) out[e.indexOf(1)] = c; });
    return out;
  }

  /* ---------- Numeric evaluation ---------- */
  function evalNum(ast, env) {
    const rec = (nd) => {
      switch (nd.type) {
        case "num": return nd.v.toNumber();
        case "var": return env[nd.v];
        case "add": return rec(nd.a) + rec(nd.b);
        case "sub": return rec(nd.a) - rec(nd.b);
        case "neg": return -rec(nd.a);
        case "mul": return rec(nd.a) * rec(nd.b);
        case "div": return rec(nd.a) / rec(nd.b);
        case "pow": return Math.pow(rec(nd.a), rec(nd.b));
        case "fn": {
          const a = nd.args.map(rec);
          switch (nd.f) { case "abs": return Math.abs(a[0]); case "sqrt": return Math.sqrt(a[0]); case "sin": return Math.sin(a[0]); case "cos": return Math.cos(a[0]); case "tan": return Math.tan(a[0]); case "exp": return Math.exp(a[0]); case "ln": case "log": return Math.log(a[0]); }
          throw new Error("Unknown function " + nd.f);
        }
      }
      throw new Error("Cannot evaluate");
    };
    return rec(ast);
  }

  // Evaluate a constant expression exactly (used by Frac.parse for inputs like "1/2+1/3")
  function evalConst(src) {
    const ast = parse(src, []);
    const mp = toMPoly(ast, []);
    return mpConstVal(mp);
  }

  /* ---------- Polynomial-operator evaluation (exact) ---------- */
  function evalPolyOp(ast, p) {
    const rec = (nd) => {
      switch (nd.type) {
        case "num": return new Poly([nd.v]);
        case "var": if (nd.v === "x") return Poly.X(); throw new Error("Unknown symbol " + nd.v);
        case "p": { let q = p; for (let i = 0; i < nd.order; i++) q = q.deriv(); return q; }
        case "peval": { const t = rec(nd.at); if (t.deg() > 0) throw new Error("p(·) must be evaluated at a number"); let q = p; for (let i = 0; i < nd.order; i++) q = q.deriv(); return new Poly([q.at(t.coef(0))]); }
        case "add": return rec(nd.a).add(rec(nd.b));
        case "sub": return rec(nd.a).sub(rec(nd.b));
        case "neg": return rec(nd.a).neg();
        case "mul": return rec(nd.a).mul(rec(nd.b));
        case "div": { const d = rec(nd.b); if (d.deg() > 0) throw new Error("Can only divide by constants"); return rec(nd.a).scale(d.coef(0).inv()); }
        case "pow": { const e = rec(nd.b); if (e.deg() > 0 || !e.coef(0).isInt() || e.coef(0).sign() < 0) throw new Error("Powers must be non-negative integers"); return rec(nd.a).pow(Number(e.coef(0).n)); }
        case "fn": {
          if (nd.f === "int") {
            if (nd.args.length === 2) { const a = rec(nd.args[0]), b = rec(nd.args[1]); return new Poly([p.integrate(a.coef(0), b.coef(0))]); }
            if (nd.args.length === 3) { // int(expr, a, b)
              const f = rec(nd.args[0]); const a = rec(nd.args[1]), b = rec(nd.args[2]); return new Poly([f.integrate(a.coef(0), b.coef(0))]);
            }
            throw new Error("Use int(a,b) for ∫_a^b p(x) dx");
          }
          throw new Error(nd.f + "(...) is not supported for polynomial operators");
        }
      }
      throw new Error("Cannot evaluate");
    };
    return rec(ast);
  }

  // Split "(a, b, c)" or "a, b" at top-level commas
  function splitTuple(src) {
    let s = src.trim();
    if (s.includes("=")) s = s.slice(s.lastIndexOf("=") + 1).trim();
    // strip one outer pair of parentheses if they wrap everything
    const wraps = (str) => { if (!(str.startsWith("(") && str.endsWith(")"))) return false; let d = 0; for (let i = 0; i < str.length; i++) { if (str[i] === "(") d++; else if (str[i] === ")") { d--; if (d === 0 && i < str.length - 1) return false; } } return true; };
    if (wraps(s)) {
      const inner = s.slice(1, -1);
      // only strip if the inner has a top-level comma (so "(x+y)" stays a scalar)
      let d = 0, comma = false; for (const ch of inner) { if (ch === "(") d++; else if (ch === ")") d--; else if (ch === "," && d === 0) comma = true; }
      if (comma) s = inner;
    }
    const parts = []; let d = 0, cur = "";
    for (const ch of s) { if (ch === "(") d++; if (ch === ")") d--; if (ch === "," && d === 0) { parts.push(cur); cur = ""; } else cur += ch; }
    parts.push(cur);
    return parts.map((x) => x.trim()).filter((x) => x.length);
  }
  // detect variables from "T(x,y,z) = ..." if present
  function detectVars(src) {
    const m = src.match(/^\s*[A-Za-z]\w*\s*\(([^)]*)\)\s*=/);
    if (m) return m[1].split(",").map((v) => v.trim()).filter(Boolean);
    return null;
  }

  LA.parse = { tokenize, parse, toMPoly, mpEval, mpDegreeInfo, mpLinearCoeffs, mpIsConst, mpConstVal, evalNum, evalConst, evalPolyOp, splitTuple, detectVars, NonPoly };
})();
