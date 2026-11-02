/* Reproducible randomness: every generated problem is identified by (generator id, seed),
   so the exact same problem can be regenerated later (retry queue, exam review, sharing). */
(function () {
  "use strict";
  const LA = (window.LA = window.LA || {});

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Hash any string (e.g. "gen-id:1234") to a 32-bit seed
  function hashStr(s) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }

  LA.RNG = function (seed) {
    const s = typeof seed === "string" ? hashStr(seed) : seed >>> 0;
    const next = mulberry32(s);
    const r = {
      seed: s,
      next,
      int(a, b) { return a + Math.floor(next() * (b - a + 1)); },
      nz(a, b) { let x = 0, guard = 0; while (x === 0 && guard++ < 100) x = r.int(a, b); return x || 1; }, // non-zero integer in [a,b]
      pick(arr) { return arr[Math.floor(next() * arr.length)]; },
      sign() { return next() < 0.5 ? -1 : 1; },
      bool(p) { return next() < (p === undefined ? 0.5 : p); },
      shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
      sample(arr, k) { return r.shuffle(arr).slice(0, k); },
      intVec(n, a, b) { return Array.from({ length: n }, () => r.int(a, b)); },
      intMat(m, n, a, b) { return Array.from({ length: m }, () => r.intVec(n, a, b)); },
    };
    return r;
  };
  LA.newSeed = function () {
    try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % 1000000; } catch (e) { return Math.floor(Math.random() * 1000000); }
  };
  LA.hashStr = hashStr;
})();
