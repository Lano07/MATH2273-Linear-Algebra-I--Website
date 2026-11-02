/* Runs all unit + mathematical regression tests in tests/unit/*.test.js.
   Usage: node tests/run-unit.js [filter]   — exits with code 1 on any failure. */
"use strict";
const fs = require("fs"), path = require("path");
const { load } = require("./harness");

// Scripts every test needs, in the same order as index.html (only those that don't need a real DOM).
const CORE = ["core/math.js", "core/parse.js", "core/rng.js", "core/answers.js"];
const filter = process.argv[2] || "";
let pass = 0, fail = 0; const failures = [];
const t = {
  ok(cond, name) { if (cond) pass++; else { fail++; failures.push(name); } },
  eq(a, b, name) { const ok = a === b || JSON.stringify(a) === JSON.stringify(b); if (ok) pass++; else { fail++; failures.push(name + "  (got " + JSON.stringify(a) + ", expected " + JSON.stringify(b) + ")"); } },
  throws(fn, name) { try { fn(); fail++; failures.push(name + " (did not throw)"); } catch (e) { pass++; } },
};
const dir = path.join(__dirname, "unit");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".test.js") && f.includes(filter)).sort();
for (const f of files) {
  const mod = require(path.join(dir, f));
  const before = pass + fail, fb = fail;
  try {
    const LA = load(CORE.concat(mod.needs || []));
    mod(t, LA);
  } catch (e) { fail++; failures.push(f + " crashed: " + (e.stack || e.message)); }
  console.log((fail > fb ? "✗ " : "✓ ") + f.padEnd(34) + (pass + fail - before) + " checks" + (fail > fb ? ", " + (fail - fb) + " failed" : ""));
}
console.log("\n" + pass + " passed, " + fail + " failed");
if (failures.length) { console.log("\nFailures:\n - " + failures.slice(0, 80).join("\n - ")); process.exit(1); }
