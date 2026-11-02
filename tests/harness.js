/* Loads the site's classic scripts into a Node vm context (no browser needed) for unit tests.
   Usage: const { load } = require("./harness"); const LA = load(["core/math.js", ...]); */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const JS = path.resolve(__dirname, "..", "assets", "js");

function makeContext() {
  const store = new Map();
  const localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
  const noop = () => {};
  const el = () => ({ appendChild: noop, setAttribute: noop, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, style: {}, addEventListener: noop, querySelector: () => null, querySelectorAll: () => [] });
  const document = { createElement: el, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, addEventListener: noop, documentElement: el(), body: el(), createTreeWalker: () => ({ nextNode: () => null }) };
  const ctx = { console, Math, Date, JSON, BigInt, Number, String, Array, Object, Map, Set, Error, TypeError, RegExp, Uint32Array, Promise, setTimeout, clearTimeout, isFinite, parseInt, parseFloat, localStorage, document, crypto: require("crypto").webcrypto, location: { hash: "" }, history: { replaceState: noop }, matchMedia: () => ({ matches: false, addEventListener: noop }), requestAnimationFrame: noop, performance: { now: () => Date.now() } };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  return vm.createContext(ctx);
}
function load(files, ctx) {
  ctx = ctx || makeContext();
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx, { filename: f });
  return ctx.LA;
}
module.exports = { load, makeContext, JS };
