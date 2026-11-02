/* End-to-end, regression and responsive tests in a headless browser (Playwright).
   Usage: node tests/e2e.js            (needs `playwright`: npm i -D playwright && npx playwright install chromium)
          BROWSER=firefox node tests/e2e.js   (or webkit) for cross-browser runs; ISOLATE=1 = fresh tab per check
   Checks: every route renders without console errors, KaTeX errors, unrendered "$" or invalid MathML; no horizontal
   page overflow at 390 / 820 / 1440 px (failures name the elements that stick out); key user flows (practice, retry
   queue, exams, flashcards, notes, counterexamples, examiner, export data, saved-progress migration), each a guarded
   step with a time limit. Exit code 1 on any failure. */
"use strict";
const pw = require("playwright");
const ENGINE = process.env.BROWSER || "chromium"; // chromium | firefox | webkit
// Firefox/WebKit: a fresh tab per check, so one slow page can't cascade (Chromium also exercises live navigation
// and resizing in one long-lived tab). ISOLATE=1 forces isolation in Chromium too.
const ISOLATE = ENGINE !== "chromium" || process.env.ISOLATE === "1";
const { start } = require("./serve");

let pass = 0, fail = 0; const failures = [];
// never let a hung page stall the run (page.evaluate has no timeout of its own)
const within = (p, ms, what) => { let t; return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej(new Error("timed out: " + what)), ms); })]).finally(() => clearTimeout(t)); }; // cleared, so node exits as soon as the run ends
const ok = (cond, name) => { if (cond) pass++; else { fail++; failures.push(name); console.log("FAIL: " + name); } };

async function audit(page) {
  return page.evaluate(() => {
    const v = document.getElementById("view");
    const kerr = v.querySelectorAll(".katex-error").length;
    // one pass; skip whole subtrees of rendered maths / code (fast even on very large pages)
    const SKIP = ".katex, code, pre, textarea, input, script, .mono, .mono-in";
    const tw = document.createTreeWalker(v, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode: (x) => (x.nodeType === 1 ? (x.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP) : x.nodeValue.indexOf("$") >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP) });
    let raw = 0; while (tw.nextNode()) raw++;
    const de = document.documentElement, cw = de.clientWidth;
    const over = de.scrollWidth > cw + 1;
    // on overflow, name the outermost unclipped elements that stick out, so a CI log says what to fix
    let why = "";
    if (over) {
      const desc = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
      const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).overflowX !== "visible") return true; return false; };
      const list = [], hidden = [];
      for (const el of document.body.querySelectorAll("*")) {
        const b = el.getBoundingClientRect(); if (!b.width || b.right <= cw + 1) continue;
        const par = el.parentElement; if (par && par !== document.body && par.getBoundingClientRect().right > cw + 1) continue;
        const s = getComputedStyle(el), d = desc(el) + " [" + s.position + (s.whiteSpace === "nowrap" ? ", nowrap" : "") + "] x " + Math.round(b.left) + ".." + Math.round(b.right);
        if (clipped(el)) { if (hidden.length < 4) hidden.push(d); continue; }
        list.push(d); if (list.length >= 4) break;
      }
      why = "scrollWidth " + de.scrollWidth + " > clientWidth " + cw + " (innerWidth " + innerWidth + ", body " + document.body.scrollWidth + "); sticking out: " + (list.join("; ") || "nothing unclipped; inside overflow:hidden: " + (hidden.join("; ") || "none"));
    }
    // MathML validity (Firefox/Safari reject e.g. an <msub> with 3 children; screen readers read the MathML)
    const need = { msub: 2, msup: 2, msubsup: 3, munder: 2, mover: 2, munderover: 3, mfrac: 2, mroot: 2 }; const badML = [];
    v.querySelectorAll(Object.keys(need).map((t) => "math " + t).join(",")).forEach((el) => { if (el.children.length !== need[el.localName]) { const a = el.closest("math").querySelector("annotation"); badML.push(el.localName + ": " + (a ? a.textContent : "").slice(0, 60)); } });
    return { kerr, raw, over, why, text: v.innerText.length, badML };
  });
}

(async () => {
  const srv = await start(0);
  const base = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const browser = await pw[ENGINE].launch();
  console.log("browser: " + ENGINE);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const errs = []; let page, current = "";
  const fresh = async () => {
    page = await ctx.newPage();
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("dialog", (d) => d.accept("note"));
    page.on("crash", () => { ok(false, "page crashed on " + current); console.log("CRASH on " + current); });
  };
  await fresh();
  // hash navigation inside the already-loaded app (WebKit never fires "load" for same-document page.goto)
  const go = async (h, wait) => { errs.length = 0; current = h; if (page.isClosed()) await fresh(); if (page.url().startsWith(base)) await within(page.evaluate((x) => LA.go("#" + x), h), 15000, "navigate to " + h); else await page.goto(base + "#" + h); await page.waitForTimeout(wait || 220); };

  /* 1. every route */
  await page.goto(base + "#/"); await page.waitForTimeout(300);
  const dyn = await page.evaluate(() => ({
    pages: LA.pages.map((p) => p.pattern).filter((p) => !p.includes(":") && !/^\/exams\/(run|mark|new)$/.test(p)),
    chapters: Object.values(LA.chapters).map((c) => c.num),
    topics: LA.TOPICS.map((t) => t.id), theorems: LA.THEOREMS.map((t) => t.id), tasks: LA.PROOF_TASKS.map((t) => t.id),
    quiz: Object.keys(LA.QUIZ), mocks: LA.MOCKS.map((m) => m.id),
  }));
  const routes = dyn.pages.slice();
  dyn.chapters.forEach((n) => ["", "?tab=exercises", "?tab=quiz", "?tab=summary"].forEach((t) => routes.push("/ch/" + n + t)));
  dyn.topics.forEach((t) => ["understand", "visualise", "prove", "practise", "exam"].forEach((m) => routes.push("/learn/" + t + "?mode=" + m)));
  dyn.theorems.forEach((t) => routes.push("/theorem/" + t));
  dyn.tasks.forEach((t) => routes.push("/proofs/examiner/" + t));
  dyn.quiz.forEach((q) => routes.push("/quiz/" + q));
  dyn.mocks.forEach((m) => routes.push("/mock/" + m));
  dyn.topics.slice(0, 6).forEach((t) => routes.push("/print/topic/" + t));
  ["theorems", "definitions", "proofs", "formulas", "counterexamples", "mistakes", "notation", "recipes"].forEach((t) => routes.push("/encyclopedia?tab=" + t));
  let k = 0;
  for (const r of routes) {
    if (++k % 50 === 0) console.log("… " + k + " routes (" + r + ")");
    let a;
    if (ISOLATE) { try { await page.close(); } catch (e) { /* ignore */ } await fresh(); }
    try { await go(r, /visualise|labs|quadratic/.test(r) ? 380 : 200); a = await within(audit(page), 15000, "audit " + r); }
    catch (e) { ok(false, "route " + r + " failed: " + e.message.split("\n")[0]); try { await page.close(); } catch (e2) { /* already gone */ } await fresh(); await page.goto(base + "#/"); await page.waitForTimeout(300); continue; }
    ok(!errs.length, "no console errors on " + r + (errs.length ? ": " + errs[0].slice(0, 120) : ""));
    ok(a.kerr === 0, "no KaTeX errors on " + r);
    ok(a.raw === 0, "no unrendered $ on " + r);
    ok(a.text > 40, "content rendered on " + r);
    ok(!a.badML.length, "valid MathML on " + r + (a.badML.length ? ": " + a.badML[0] : ""));
  }
  console.log("routes checked: " + routes.length);

  // one guarded step: any error or stall is recorded as a failure and the run continues on a fresh page
  const step = async (name, fn, ms) => {
    try { await within(fn(), ms || 60000, name); }
    catch (e) {
      const lines = String(e.message).split("\n").map((l) => l.trim()).filter(Boolean);
      ok(false, name + " failed: " + lines[0] + (lines.length > 1 ? " | " + lines.slice(-4).join(" | ") : "")); // Playwright's call log says why
      try { await page.close(); } catch (e2) { /* already gone */ } await fresh();
    }
  };

  /* 2. responsive: no horizontal overflow on key pages */
  const keyPages = ["/", "/dashboard", "/ch/3", "/ch/8", "/learn/kernel-range?mode=understand", "/learn/gram-schmidt?mode=practise", "/practice?g=diag-pd&d=standard&s=4", "/exams", "/flashcards", "/proofs/examiner/ker-sub", "/counterexamples", "/encyclopedia", "/theorem/spectral", "/map", "/labs/quadratic", "/labs/change-of-basis", "/labs/calculator", "/labs/gs-studio", "/labs/transform", "/pastpapers", "/notes", "/settings", "/syllabus", "/formulas", "/mock/A"];
  const fits = (w, r) => step("overflow check at " + w + "px on " + r, async () => {
    if (ISOLATE) { try { await page.close(); } catch (e) { /* ignore */ } await fresh(); }
    const vs = page.viewportSize();
    if (!vs || vs.width !== w) { await page.setViewportSize({ width: w, height: 860 }); if (!ISOLATE) await page.waitForTimeout(600); } // let header transitions settle after a live resize
    await go(r, 260);
    const a = await within(audit(page), 15000, "audit " + r);
    ok(!a.over, "no horizontal overflow at " + w + "px on " + r + (a.over ? " — " + a.why : ""));
  });
  for (const w of [390, 820, 1440]) for (const r of keyPages) await fits(w, r);
  // phone sweep over every chapter, lab and topic page
  const phone = dyn.chapters.map((n) => "/ch/" + n).concat(dyn.pages.filter((p) => p.startsWith("/labs/")), dyn.topics.map((t) => "/learn/" + t + "?mode=understand"), dyn.topics.map((t) => "/learn/" + t + "?mode=practise"));
  for (const r of phone) await fits(390, r);
  // live resize: load wide, then shrink to phone width (rotating a phone to portrait, narrowing a desktop window)
  const shrinkPages = ["/", "/ch/3", "/labs/quadratic", "/settings"];
  for (const r of shrinkPages) await step("live resize 1280→390 on " + r, async () => {
    if (ISOLATE) { try { await page.close(); } catch (e) { /* ignore */ } await fresh(); }
    await page.setViewportSize({ width: 1280, height: 860 }); await go(r, 500);
    await page.setViewportSize({ width: 390, height: 860 }); await page.waitForTimeout(900);
    const a = await within(audit(page), 15000, "audit " + r);
    ok(!a.over, "no horizontal overflow after shrinking 1280→390 on " + r + (a.over ? " — " + a.why : ""));
    await go("/notes", 300); const b = await within(audit(page), 15000, "audit /notes");
    ok(!b.over, "no horizontal overflow on the next page after shrinking (" + r + " → /notes)" + (b.over ? " — " + b.why : ""));
  });
  console.log("responsive checks: " + (keyPages.length * 3 + phone.length + shrinkPages.length * 2));
  if (ISOLATE) { try { await page.close(); } catch (e) { /* ignore */ } await fresh(); }
  await page.setViewportSize({ width: 1280, height: 900 });

  /* 3. flows (each guarded; later flows still run if an earlier one fails) */
  let model = "";
  await step("seed v1 saved data and reload", async () => {
    await go("/settings", 300);
    await page.evaluate(() => { Object.keys(localStorage).filter((k) => k.startsWith("la2273:")).forEach((k) => localStorage.removeItem(k)); localStorage.setItem("la2273:flash", JSON.stringify({ "ch3-0": 3 })); localStorage.setItem("la2273:ppLog", JSON.stringify([{ paper: "2021/22 Sem 1", q: "Q1", text: "x", tags: ["Gram–Schmidt"], done: false, at: 1 }])); });
    await page.reload(); await page.waitForTimeout(400); // migrations run on page load, as after a real upgrade
  });
  await step("practice retry flow", async () => {
    // wrong then retry-correct resolves the mistake
    await go("/practice?g=ker-basis&d=standard&s=42", 350);
    model = await page.evaluate(() => LA.bank.make("ker-basis", 42, "standard").model);
    await page.fill(".ans-in", "(1,0,0,0)"); await page.click('[data-act="check"]'); await page.waitForTimeout(120);
    ok(await page.evaluate(() => LA.mist.list({ open: true }).length === 1), "wrong answer enters the retry queue");
    await go("/practice?mode=retry", 350); await page.fill(".ans-in", model); await page.click('[data-act="check"]'); await page.waitForTimeout(120);
    ok(await page.evaluate(() => LA.mist.list({ open: true }).length === 0), "correct retry resolves the mistake");
    ok(await page.evaluate(() => LA.mastery("kernel-range").n === 2), "mastery evidence recorded once per problem");
  });
  await step("solution-first flow", async () => {
    await go("/practice?g=norm&d=standard&s=3", 300); await page.click('[data-act="sol"]'); const m2 = await page.evaluate(() => LA.bank.make("norm", 3, "standard").model); await page.fill(".ans-in", m2); await page.click('[data-act="check"]'); await page.waitForTimeout(120);
    ok(await page.evaluate(() => { const e = LA.ev.list({ topic: "norms-angles" }).slice(-1)[0]; return e && e.sol === true && LA.mastery("norms-angles").level <= 1; }), "viewing the solution first gives no mastery credit");
  });
  await step("exam sprint flow", async () => {
    await go("/exams", 300); await page.click('[data-preset="comp"]'); await page.waitForTimeout(400);
    ok(/Exam in progress/.test(await page.title()), "exam runner opens");
    await page.click("#exFinish"); await page.waitForTimeout(350); await page.click("#mkDone"); await page.waitForTimeout(350);
    ok(await page.evaluate(() => JSON.parse(localStorage.getItem("la2273:examHistory") || "[]").length === 1), "exam saved to history with a report");
    ok(await page.locator("text=By marking component").count() === 1, "exam report shows component breakdown");
  });
  await step("flashcard flow", async () => {
    // migrated Leitner box + rating schedules a real due date
    await go("/flashcards?set=ch3", 350);
    ok(await page.evaluate(() => !!JSON.parse(localStorage.getItem("la2273:srs"))["ch3-0"]), "Leitner progress migrated to spaced repetition");
    await page.click("#srsShow"); await page.click('[data-r="2"]'); await page.waitForTimeout(120);
    ok(await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem("la2273:srs"))).some((s) => s && s.due > Date.now() + 3600e3)), "flashcard rating schedules a future review");
    // keyboard rating rates exactly one card, however many cards were shown before
    const reviews = () => page.evaluate(() => Object.values(JSON.parse(localStorage.getItem("la2273:srsLog") || "{}")).reduce((n, d) => n + (d.reviews || 0), 0));
    const before = await reviews();
    await page.fill("#srsTry", "Outline: take two vectors in the set, show closure under addition and scaling."); // proof cards need an outline first
    await page.click("#srsShow"); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await page.keyboard.press("3"); await page.waitForTimeout(150);
    ok((await reviews()) === before + 1, "a keyboard rating rates exactly one card");
  });
  await step("past-paper migration", async () => {
    await go("/pastpapers", 300);
    ok(await page.evaluate(() => { const e = JSON.parse(localStorage.getItem("la2273:ppLog"))[0]; return e.id && e.year === "2021/22" && e.topics.includes("gram-schmidt"); }), "v1 past-paper entries migrated");
  });
  await step("counterexample flow", async () => {
    await go("/counterexamples", 300); const c = page.locator('[data-cid="nilp"]'); await c.locator('[data-ci="0"]').fill("0 1; 0 0"); await c.locator('[data-act="test"]').click(); await page.waitForTimeout(100);
    ok(/Valid counterexample/.test(await c.locator(".ce-out").textContent()), "counterexample verified exactly");
  });
  await step("proof examiner flow", async () => {
    await go("/proofs/examiner/ker-sub", 300); await page.fill("#peText", "Clearly ker T is a subspace."); await page.click("#peExam"); await page.waitForTimeout(150);
    ok(await page.locator("text=Conclusion-only answer").count() === 1, "examiner flags conclusion-only answers");
  });
  await step("notes and bookmarks flow", async () => {
    await go("/ch/4", 400); await page.locator(".bm-btn").first().click(); await page.locator(".note-box summary").first().click(); await page.locator(".note-box textarea").first().fill("test note"); await page.waitForTimeout(450);
    await go("/notes", 300); ok((await page.locator("[data-unbm]").count()) === 1 && (await page.locator(".box.note").count()) === 1, "bookmark and note listed on My Notes");
  });
  await step("topic studio flow", async () => {
    await go("/learn/kernel-range?mode=practise", 400); const inp = page.locator('[data-pane="practise"] .ans-in').first();
    ok(await inp.count() > 0, "Topic Studio practise pane has an answer box");
    if (await inp.count()) { await inp.fill("(9,9,9)"); await page.click('.mode-btn[data-mode="prove"]'); await page.click('.mode-btn[data-mode="practise"]'); ok((await inp.inputValue()) === "(9,9,9)", "Topic Studio keeps inputs when switching modes"); }
  });
  await step("export data", async () => {
    if (!page.url().startsWith(base)) await go("/settings", 300);
    const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("la2273:")));
    ["ev", "mistakes", "srs", "examHistory", "ppLog", "notes", "bookmarks"].forEach((k) => ok(keys.includes("la2273:" + k), "export includes " + k));
  });

  await browser.close(); srv.close();
  console.log("\n" + pass + " passed, " + fail + " failed");
  if (fail) { console.log("Failures:\n - " + failures.slice(0, 60).join("\n - ")); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
