/* =====================================================================
   Exact arithmetic engine: Frac (BigInt rationals), QNum (a + b√D),
   Surd helpers, Poly (rational polynomials), matrix routines with
   step-by-step logs written in the same notation as the MATH2273 notes.
   ===================================================================== */
(function () {
  "use strict";
  const LA = (window.LA = window.LA || {});

  /* ---------------- BigInt helpers ---------------- */
  const babs = (a) => (a < 0n ? -a : a);
  function bgcd(a, b) { a = babs(a); b = babs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
  function blcm(a, b) { if (a === 0n || b === 0n) return 0n; return babs(a / bgcd(a, b) * b); }
  function bsqrt(n) { // floor sqrt for BigInt >= 0
    if (n < 0n) throw new Error("sqrt of negative");
    if (n < 2n) return n;
    let x = BigInt(Math.floor(Math.sqrt(Number(n))));
    while (x * x > n) x--;
    while ((x + 1n) * (x + 1n) <= n) x++;
    return x;
  }
  // n = s^2 * r with r squarefree (trial division, fine for course-sized numbers)
  function squareSplit(n) {
    n = babs(n);
    if (n === 0n) return { s: 0n, r: 1n };
    let s = 1n, r = 1n, m = n;
    for (let p = 2n; p * p <= m; p++) {
      let e = 0;
      while (m % p === 0n) { m /= p; e++; }
      if (e) { s *= p ** BigInt(Math.floor(e / 2)); if (e % 2) r *= p; }
      if (p > 100000n) break;
    }
    r *= m;
    return { s, r };
  }

  /* ---------------- Frac ---------------- */
  class Frac {
    constructor(n, d) {
      n = BigInt(n); d = d === undefined ? 1n : BigInt(d);
      if (d === 0n) throw new Error("Division by zero");
      if (d < 0n) { n = -n; d = -d; }
      const g = bgcd(n, d) || 1n;
      this.n = n / g; this.d = d / g;
    }
    static of(x) {
      if (x instanceof Frac) return x;
      if (typeof x === "bigint") return new Frac(x, 1n);
      if (typeof x === "number") {
        if (Number.isInteger(x)) return new Frac(BigInt(x), 1n);
        return Frac.parse(String(x));
      }
      if (typeof x === "string") return Frac.parse(x);
      throw new Error("Cannot convert to fraction: " + x);
    }
    static parse(s) {
      s = String(s).trim().replace(/\s+/g, "").replace(/−/g, "-");
      if (s === "") throw new Error("Empty number");
      let m = s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
      if (m) return new Frac(BigInt(m[1]), BigInt(m[2]));
      m = s.match(/^([+-]?)(\d*)\.(\d+)$/);
      if (m) { const den = 10n ** BigInt(m[3].length); const num = BigInt((m[2] || "0") + m[3]); return new Frac(m[1] === "-" ? -num : num, den); }
      m = s.match(/^([+-]?\d+)$/);
      if (m) return new Frac(BigInt(m[1]), 1n);
      // allow simple expressions like 1/2+1/3 via the parser if available
      if (LA.parse && LA.parse.evalConst) return LA.parse.evalConst(s);
      throw new Error('Not a number: "' + s + '"');
    }
    add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { o = Frac.of(o); if (o.n === 0n) throw new Error("Division by zero"); return new Frac(this.n * o.d, this.d * o.n); }
    neg() { return new Frac(-this.n, this.d); }
    inv() { return new Frac(this.d, this.n); }
    pow(k) { let r = Frac.ONE; for (let i = 0; i < k; i++) r = r.mul(this); return r; }
    abs() { return this.n < 0n ? this.neg() : this; }
    isZero() { return this.n === 0n; }
    isOne() { return this.n === 1n && this.d === 1n; }
    isInt() { return this.d === 1n; }
    sign() { return this.n > 0n ? 1 : this.n < 0n ? -1 : 0; }
    eq(o) { o = Frac.of(o); return this.n === o.n && this.d === o.d; }
    cmp(o) { o = Frac.of(o); const a = this.n * o.d, b = o.n * this.d; return a < b ? -1 : a > b ? 1 : 0; }
    toNumber() { return Number(this.n) / Number(this.d); }
    toString() { return this.d === 1n ? String(this.n) : this.n + "/" + this.d; }
    tex(opts) {
      const small = opts && opts.small;
      if (this.d === 1n) return String(this.n);
      const f = small ? "\\tfrac" : "\\frac";
      return (this.n < 0n ? "-" : "") + f + "{" + babs(this.n) + "}{" + this.d + "}";
    }
  }
  Frac.ZERO = new Frac(0n, 1n);
  Frac.ONE = new Frac(1n, 1n);
  Frac.MINUS_ONE = new Frac(-1n, 1n);
  const F = (x, y) => (y === undefined ? Frac.of(x) : new Frac(BigInt(x), BigInt(y)));

  /* ---------------- Quadratic-field numbers a + b√D (D squarefree, may be -1) ---------------- */
  class QNum {
    constructor(a, b, D) { this.a = Frac.of(a); this.b = Frac.of(b || 0); this.D = BigInt(D === undefined ? 1 : D); if (this.D === 1n) { this.a = this.a.add(this.b); this.b = Frac.ZERO; } }
    static of(x, D) { if (x instanceof QNum) return x; return new QNum(Frac.of(x), Frac.ZERO, D); }
    _c(o) { if (!(o instanceof QNum)) o = new QNum(Frac.of(o), Frac.ZERO, this.D); return o; }
    add(o) { o = this._c(o); return new QNum(this.a.add(o.a), this.b.add(o.b), this.D === 1n ? o.D : this.D); }
    sub(o) { o = this._c(o); return new QNum(this.a.sub(o.a), this.b.sub(o.b), this.D === 1n ? o.D : this.D); }
    mul(o) { o = this._c(o); const D = this.D === 1n ? o.D : this.D; const Df = new Frac(D, 1n); return new QNum(this.a.mul(o.a).add(this.b.mul(o.b).mul(Df)), this.a.mul(o.b).add(this.b.mul(o.a)), D); }
    conj() { return new QNum(this.a, this.b.neg(), this.D); }
    norm() { return this.a.mul(this.a).sub(this.b.mul(this.b).mul(new Frac(this.D, 1n))); }
    inv() { const n = this.norm(); if (n.isZero()) throw new Error("Division by zero"); const c = this.conj(); return new QNum(c.a.div(n), c.b.div(n), this.D); }
    div(o) { o = this._c(o); return this.mul(o.inv()); }
    neg() { return new QNum(this.a.neg(), this.b.neg(), this.D); }
    isZero() { return this.a.isZero() && this.b.isZero(); }
    isOne() { return this.a.isOne() && this.b.isZero(); }
    sign() { return this.b.isZero() ? this.a.sign() : 1; }
    toNumber() { return this.D > 0n ? this.a.toNumber() + this.b.toNumber() * Math.sqrt(Number(this.D)) : NaN; }
    radTex() { if (this.D === -1n) return "i"; if (this.D < 0n) return "\\sqrt{" + babs(this.D) + "}\\,i"; return "\\sqrt{" + this.D + "}"; }
    tex() {
      if (this.b.isZero()) return this.a.tex();
      const r = this.radTex();
      let bpart;
      const bb = this.b.abs();
      if (bb.isOne()) bpart = r;
      else if (bb.isInt()) bpart = bb.tex() + r;
      else bpart = "\\frac{" + bb.n + (r === "i" ? "i" : r) + "}{" + bb.d + "}";
      if (this.a.isZero()) return (this.b.sign() < 0 ? "-" : "") + bpart;
      return this.a.tex() + (this.b.sign() < 0 ? " - " : " + ") + bpart;
    }
    toString() { return this.tex(); }
  }

  /* ---------------- Surds ---------------- */
  // sqrt of a non-negative Frac → { coef: Frac, rad: BigInt } meaning coef·√rad (rad squarefree)
  function sqrtFrac(f) {
    f = Frac.of(f);
    if (f.sign() < 0) throw new Error("sqrt of negative");
    if (f.isZero()) return { coef: Frac.ZERO, rad: 1n };
    // √(n/d) = √(n d)/d
    const { s, r } = squareSplit(f.n * f.d);
    return { coef: new Frac(s, f.d), rad: r };
  }
  function surdTex(sd) {
    if (sd.coef.isZero()) return "0";
    if (sd.rad === 1n) return sd.coef.tex();
    const c = sd.coef;
    const root = "\\sqrt{" + sd.rad + "}";
    if (c.isOne()) return root;
    if (c.isInt()) return c.tex() + root;
    if (c.n === 1n) return "\\frac{" + root + "}{" + c.d + "}";
    return "\\frac{" + c.n + root + "}{" + c.d + "}";
  }
  // tex for 1/√f, e.g. 1/√30 or √3/2
  function invSqrtTex(f) {
    f = Frac.of(f);
    if (f.isInt() && squareSplit(f.n).r === f.n && f.n !== 1n) return "\\frac{1}{\\sqrt{" + f.n + "}}";
    return surdTex(sqrtFrac(f.inv()));
  }
  function sqrtTex(f) { return surdTex(sqrtFrac(f)); }
  function isPerfectSquare(f) { f = Frac.of(f); if (f.sign() < 0) return false; const a = bsqrt(f.n), b = bsqrt(f.d); return a * a === f.n && b * b === f.d; }

  /* ---------------- Vectors ---------------- */
  const V = {
    of: (arr) => arr.map((x) => Frac.of(x)),
    add: (u, v) => u.map((x, i) => x.add(v[i])),
    sub: (u, v) => u.map((x, i) => x.sub(v[i])),
    scale: (c, u) => u.map((x) => x.mul(c)),
    dot: (u, v, w) => u.reduce((s, x, i) => s.add(x.mul(v[i]).mul(w ? w[i] : Frac.ONE)), Frac.ZERO),
    isZero: (u) => u.every((x) => x.isZero()),
    // smallest positive integer multiple direction (clear denominators, divide gcd); keeps sign of first nonzero entry positive if flip=true
    integerize(u, keepSign) {
      let L = 1n; u.forEach((x) => { L = blcm(L, x.d); });
      let ints = u.map((x) => x.n * (L / x.d));
      let g = 0n; ints.forEach((k) => { g = bgcd(g, k); });
      if (g === 0n) return { vec: u, factor: Frac.ONE };
      ints = ints.map((k) => k / g);
      // vec = factor * u  where factor = L/g
      let factor = new Frac(L, g);
      if (!keepSign) {
        const first = ints.find((k) => k !== 0n);
        if (first !== undefined && first < 0n) { ints = ints.map((k) => -k); factor = factor.neg(); }
      }
      return { vec: ints.map((k) => new Frac(k, 1n)), factor };
    },
    tex(u, opts) {
      opts = opts || {};
      if (opts.col) return "\\begin{pmatrix}" + u.map((x) => x.tex()).join("\\\\") + "\\end{pmatrix}";
      return "(" + u.map((x) => x.tex()).join(", ") + ")" + (opts.T ? "^T" : "");
    },
  };

  /* ---------------- Polynomials (ascending coefficients) ---------------- */
  class Poly {
    constructor(coeffs) { this.c = (coeffs || []).map((x) => Frac.of(x)); this._trim(); }
    _trim() { while (this.c.length && this.c[this.c.length - 1].isZero()) this.c.pop(); return this; }
    static of(x) { if (x instanceof Poly) return x; if (Array.isArray(x)) return new Poly(x); return new Poly([Frac.of(x)]); }
    static X() { return new Poly([0, 1]); }
    static mono(k, coef) { const a = new Array(k + 1).fill(Frac.ZERO); a[k] = Frac.of(coef === undefined ? 1 : coef); return new Poly(a); }
    deg() { return this.c.length - 1; }
    coef(k) { return this.c[k] || Frac.ZERO; }
    isZero() { return this.c.length === 0; }
    add(o) { o = Poly.of(o); const n = Math.max(this.c.length, o.c.length); const r = []; for (let i = 0; i < n; i++) r.push(this.coef(i).add(o.coef(i))); return new Poly(r); }
    sub(o) { o = Poly.of(o); return this.add(o.scale(Frac.MINUS_ONE)); }
    scale(k) { k = Frac.of(k); return new Poly(this.c.map((x) => x.mul(k))); }
    neg() { return this.scale(Frac.MINUS_ONE); }
    mul(o) { o = Poly.of(o); if (this.isZero() || o.isZero()) return new Poly([]); const r = new Array(this.c.length + o.c.length - 1).fill(Frac.ZERO); this.c.forEach((a, i) => o.c.forEach((b, j) => { r[i + j] = r[i + j].add(a.mul(b)); })); return new Poly(r); }
    pow(k) { let r = new Poly([1]); for (let i = 0; i < k; i++) r = r.mul(this); return r; }
    deriv() { return new Poly(this.c.slice(1).map((x, i) => x.mul(i + 1))); }
    antideriv() { return new Poly([Frac.ZERO].concat(this.c.map((x, i) => x.div(i + 1)))); }
    at(t) { t = Frac.of(t); let r = Frac.ZERO; for (let i = this.c.length - 1; i >= 0; i--) r = r.mul(t).add(this.c[i]); return r; }
    integrate(a, b) { const A = this.antideriv(); return A.at(b).sub(A.at(a)); }
    eq(o) { o = Poly.of(o); const n = Math.max(this.c.length, o.c.length); for (let i = 0; i < n; i++) if (!this.coef(i).eq(o.coef(i))) return false; return true; }
    coeffVec(n) { const r = []; for (let i = 0; i <= n; i++) r.push(this.coef(i)); return r; }
    tex(opts) {
      opts = opts || {}; const x = opts.v || "x"; const desc = !!opts.desc;
      if (this.isZero()) return "0";
      const terms = [];
      const idx = this.c.map((_, i) => i); if (desc) idx.reverse();
      idx.forEach((i) => {
        const a = this.c[i]; if (a.isZero()) return;
        const mon = i === 0 ? "" : i === 1 ? x : x + "^{" + i + "}";
        let body;
        const aa = a.abs();
        if (i === 0) body = aa.tex();
        else if (aa.isOne()) body = mon;
        else body = aa.tex() + mon;
        terms.push({ neg: a.sign() < 0, body });
      });
      return terms.map((t, k) => (k === 0 ? (t.neg ? "-" : "") + t.body : (t.neg ? " - " : " + ") + t.body)).join("");
    }
    toString() { return this.tex(); }
  }

  /* ---------------- Formatting helpers ---------------- */
  // Linear combination: coeffs (Frac[]) with term strings (tex). Returns "2x - y + \frac12 z"
  function lincomb(coeffs, terms, opts) {
    opts = opts || {};
    const parts = [];
    coeffs.forEach((c0, i) => {
      const c = Frac.of(c0);
      if (c.isZero()) return;
      const t = terms[i];
      const aa = c.abs();
      let body;
      if (t === "" || t === "1") body = aa.tex();
      else if (aa.isOne()) body = t;
      else body = (opts.paren ? aa.tex() + "\\," : aa.tex()) + t;
      parts.push({ neg: c.sign() < 0, body });
    });
    if (!parts.length) return "0";
    return parts.map((p, k) => (k === 0 ? (p.neg ? "-" : "") + p.body : (p.neg ? " - " : " + ") + p.body)).join("");
  }
  // coefficient times something with explicit multiplication when needed e.g. "-5(1,0)" or "+\frac{1}{2}(0,1)"
  function signedTerm(c, body, first) {
    c = Frac.of(c);
    const neg = c.sign() < 0; const aa = c.abs();
    const coef = aa.isOne() ? "" : aa.tex();
    const s = (first ? (neg ? "-" : "") : neg ? " - " : " + ") + coef + body;
    return s;
  }
  function combTex(coeffs, bodies) { // e.g. 1(0,1) - 5(1,0): always shows coefficient (even 1), like the notes
    let out = ""; let first = true;
    coeffs.forEach((c0, i) => {
      const c = Frac.of(c0);
      const neg = c.sign() < 0;
      const aa = c.abs();
      out += (first ? (neg ? "-" : "") : neg ? " - " : " + ") + aa.tex() + bodies[i];
      first = false;
    });
    return out || "0";
  }

  /* ---------------- Matrices ---------------- */
  const M = {
    of: (rows) => rows.map((r) => r.map((x) => Frac.of(x))),
    clone: (A) => A.map((r) => r.slice()),
    zeros: (m, n) => Array.from({ length: m }, () => Array.from({ length: n }, () => Frac.ZERO)),
    eye: (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? Frac.ONE : Frac.ZERO))),
    T: (A) => A[0].map((_, j) => A.map((r) => r[j])),
    mul: (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s.add(x.mul(B[k][j])), Frac.ZERO))),
    mulVec: (A, v) => A.map((r) => r.reduce((s, x, k) => s.add(x.mul(v[k])), Frac.ZERO)),
    add: (A, B) => A.map((r, i) => r.map((x, j) => x.add(B[i][j]))),
    sub: (A, B) => A.map((r, i) => r.map((x, j) => x.sub(B[i][j]))),
    scale: (c, A) => A.map((r) => r.map((x) => x.mul(c))),
    eq: (A, B) => A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((x, j) => x.eq(B[i][j]))),
    cols: (A) => A[0].map((_, j) => A.map((r) => r[j])),
    fromCols: (cols) => cols[0].map((_, i) => cols.map((c) => c[i])),
    tex(A, opts) {
      opts = opts || {};
      const env = opts.env || "pmatrix";
      const body = A.map((r) => r.map((x) => (x.tex ? x.tex() : String(x))).join(" & ")).join(" \\\\ ");
      if (opts.aug !== undefined && opts.aug !== null) {
        const n = A[0].length; const k = opts.aug; // bar before column k
        const spec = "c".repeat(k) + "|" + "c".repeat(n - k);
        return "\\left(\\begin{array}{" + spec + "}" + body + "\\end{array}\\right)";
      }
      return "\\begin{" + env + "}" + body + "\\end{" + env + "}";
    },
  };

  // Row label helper
  const R = (i) => "R_{" + (i + 1) + "}";
  // sign + magnitude display for a coefficient (works for Frac and for QNum a + b√D)
  function coefTex(c) {
    if (c instanceof Frac) return { neg: c.sign() < 0, body: c.abs().isOne() ? "" : c.abs().tex() };
    if (c && c.b && c.b.isZero && c.b.isZero()) return coefTex(c.a);
    return { neg: false, body: "(" + c.tex() + ")" };
  }
  function opScale(i, c) { const t = coefTex(c); return R(i) + " \\to " + (t.neg ? "-" : "") + (t.body ? t.body + "\\," : "") + R(i); }
  function opAdd(i, c, j) { // R_i → R_i + c R_j
    const t = coefTex(c);
    return R(i) + " \\to " + R(i) + (t.neg ? " - " : " + ") + t.body + R(j);
  }
  function opSwap(i, j) { return R(i) + " \\leftrightarrow " + R(j); }

  /**
   * Generic row reduction with a log of steps.
   * field: elements must support add/sub/mul/div/neg/isZero/isOne/tex
   * opts: { mode: 'rref'|'ref', aug: k (bar position, for display), stopCol: number of columns to pivot on }
   */
  function rowReduce(A0, opts) {
    opts = opts || {};
    const mode = opts.mode || "rref";
    const A = A0.map((r) => r.slice());
    const m = A.length, n = A[0].length;
    const ncols = opts.stopCol === undefined ? n : opts.stopCol;
    const steps = [];
    const snap = (ops) => steps.push({ ops, M: A.map((r) => r.slice()) });
    const pivots = [];
    let row = 0;
    const score = (x) => { // prefer ±1, then small integers, then anything
      if (x.isZero()) return Infinity;
      if (x.isOne() || (x.neg && x.neg().isOne && x.neg().isOne())) return 0;
      if (x instanceof Frac) { if (x.isInt()) return Number(babs(x.n)); return 1000 + Number(babs(x.n) + x.d); }
      return 5000;
    };
    for (let col = 0; col < ncols && row < m; col++) {
      // choose pivot
      let best = -1, bestS = Infinity;
      for (let i = row; i < m; i++) { const s = score(A[i][col]); if (s < bestS) { bestS = s; best = i; } }
      if (best === -1 || bestS === Infinity) continue;
      const ops = [];
      if (best !== row) { const t = A[best]; A[best] = A[row]; A[row] = t; snap([opSwap(row, best)]); }
      if (mode === "rref" && !A[row][col].isOne()) {
        const c = A[row][col].inv ? A[row][col].inv() : Frac.ONE.div(A[row][col]);
        A[row] = A[row].map((x) => x.mul(c));
        snap([opScale(row, c)]);
      }
      // eliminate below
      const p = A[row][col];
      for (let i = row + 1; i < m; i++) {
        if (A[i][col].isZero()) continue;
        const c = A[i][col].div(p).neg();
        A[i] = A[i].map((x, j) => x.add(A[row][j].mul(c)));
        ops.push(opAdd(i, c, row));
      }
      if (ops.length) snap(ops);
      pivots.push({ row, col });
      row++;
    }
    if (mode === "rref") {
      for (let k = pivots.length - 1; k >= 0; k--) {
        const { row: pr, col: pc } = pivots[k];
        const ops = [];
        for (let i = 0; i < pr; i++) {
          if (A[i][pc].isZero()) continue;
          const c = A[i][pc].neg();
          A[i] = A[i].map((x, j) => x.add(A[pr][j].mul(c)));
          ops.push(opAdd(i, c, pr));
        }
        if (ops.length) snap(ops);
      }
    }
    return { R: A, pivots, pivotCols: pivots.map((p) => p.col), rank: pivots.length, steps };
  }

  function rank(A) { return rowReduce(A, { mode: "ref" }).rank; }

  // Null space basis from RREF (Frac matrices). Returns {basis: [vec], free: [colIdx], param: tex}
  function nullspace(A, opts) {
    opts = opts || {};
    const n = A[0].length;
    const red = rowReduce(A, { mode: "rref" });
    const pc = red.pivotCols;
    const free = []; for (let j = 0; j < n; j++) if (!pc.includes(j)) free.push(j);
    const basis = free.map((f) => {
      const v = new Array(n).fill(null).map(() => (A[0][0] instanceof QNum ? QNum.of(0, A[0][0].D) : Frac.ZERO));
      v[f] = A[0][0] instanceof QNum ? QNum.of(1, A[0][0].D) : Frac.ONE;
      red.pivots.forEach(({ row, col }) => { v[col] = red.R[row][f].neg(); });
      return v;
    });
    return { basis, free, red };
  }

  function det(A) { // via elimination (exact)
    const n = A.length; const B = A.map((r) => r.slice()); let d = Frac.ONE;
    for (let c = 0; c < n; c++) {
      let p = -1; for (let i = c; i < n; i++) if (!B[i][c].isZero()) { p = i; break; }
      if (p === -1) return Frac.ZERO;
      if (p !== c) { const t = B[p]; B[p] = B[c]; B[c] = t; d = d.neg(); }
      d = d.mul(B[c][c]);
      for (let i = c + 1; i < n; i++) { const f = B[i][c].div(B[c][c]); if (!f.isZero()) B[i] = B[i].map((x, j) => x.sub(B[c][j].mul(f))); }
    }
    return d;
  }

  function inverse(A) {
    const n = A.length;
    const aug = A.map((r, i) => r.concat(M.eye(n)[i]));
    const red = rowReduce(aug, { mode: "rref", stopCol: n });
    if (red.rank < n) return null;
    return red.R.map((r) => r.slice(n));
  }

  // Solve A x = b. returns {type:'unique'|'inf'|'none', x, red}
  function solve(A, b) {
    const n = A[0].length;
    const aug = A.map((r, i) => r.concat([b[i]]));
    const red = rowReduce(aug, { mode: "rref", stopCol: n });
    // inconsistent?
    for (let i = red.rank; i < aug.length; i++) if (!red.R[i][n].isZero()) return { type: "none", red };
    if (red.rank < n) return { type: "inf", red };
    const x = new Array(n).fill(Frac.ZERO);
    red.pivots.forEach(({ row, col }) => { x[col] = red.R[row][n]; });
    return { type: "unique", x, red };
  }

  // Coordinates of several target vectors w.r.t. basis (columns) — one RREF of [B | t1 ... tk]
  function coordsMany(basisVecs, targets) {
    const n = basisVecs.length; const m = basisVecs[0].length;
    const aug = Array.from({ length: m }, (_, i) => basisVecs.map((b) => b[i]).concat(targets.map((t) => t[i])));
    const red = rowReduce(aug, { mode: "rref", stopCol: n });
    if (red.rank < n) return { ok: false, red, aug };
    const coords = targets.map((_, k) => red.pivots.map(({ row }) => red.R[row][n + k]));
    return { ok: true, coords, red, aug };
  }

  /* ---------------- Polynomials in λ for characteristic polynomials ---------------- */
  function polyDet(P) { // P: matrix of Poly entries (n <= 5), cofactor expansion
    const n = P.length;
    if (n === 1) return P[0][0];
    if (n === 2) return P[0][0].mul(P[1][1]).sub(P[0][1].mul(P[1][0]));
    let s = new Poly([]);
    for (let j = 0; j < n; j++) {
      if (P[0][j].isZero()) continue;
      const minor = P.slice(1).map((r) => r.filter((_, k) => k !== j));
      const term = P[0][j].mul(polyDet(minor));
      s = j % 2 === 0 ? s.add(term) : s.sub(term);
    }
    return s;
  }
  function charPoly(A) { // det(A - λI) as Poly in λ
    const n = A.length;
    const P = A.map((r, i) => r.map((x, j) => (i === j ? new Poly([x, Frac.MINUS_ONE]) : new Poly([x]))));
    return polyDet(P);
  }
  // rational roots of Poly (with multiplicity), returns {roots:[Frac...], rest: Poly}
  function divisors(n) { n = babs(n); const ds = []; if (n === 0n) return [1n]; for (let d = 1n; d * d <= n; d++) if (n % d === 0n) { ds.push(d); if (d * d !== n) ds.push(n / d); } return ds; }
  function polyDivLinear(p, r) { // divide by (λ - r), synthetic
    const c = p.c.slice(); const n = c.length - 1; const q = new Array(n).fill(Frac.ZERO);
    let acc = Frac.ZERO;
    for (let i = n; i >= 1; i--) { acc = c[i].add(acc.mul(r)); q[i - 1] = acc; }
    return new Poly(q);
  }
  function rationalRoots(p) {
    const roots = []; let rest = p;
    let guard = 0;
    while (rest.deg() >= 1 && guard++ < 20) {
      if (rest.coef(0).isZero()) { roots.push(Frac.ZERO); rest = new Poly(rest.c.slice(1)); continue; }
      // clear denominators
      let L = 1n; rest.c.forEach((x) => { L = blcm(L, x.d); });
      const ints = rest.c.map((x) => x.n * (L / x.d));
      const a0 = ints[0], an = ints[ints.length - 1];
      let found = null;
      outer: for (const pnum of divisors(a0)) for (const q of divisors(an)) for (const sgn of [1n, -1n]) {
        const r = new Frac(sgn * pnum, q);
        if (rest.at(r).isZero()) { found = r; break outer; }
      }
      if (!found) break;
      roots.push(found); rest = polyDivLinear(rest, found);
    }
    return { roots, rest };
  }

  LA.Frac = Frac; LA.F = F; LA.QNum = QNum; LA.Poly = Poly; LA.V = V; LA.M = M;
  LA.num = { bgcd, blcm, bsqrt, squareSplit, sqrtFrac, surdTex, invSqrtTex, sqrtTex, isPerfectSquare };
  LA.alg = { rowReduce, rank, nullspace, det, inverse, solve, coordsMany, charPoly, rationalRoots, polyDet, R, opAdd, opScale, opSwap };
  LA.fmt = { lincomb, signedTerm, combTex };
})();
