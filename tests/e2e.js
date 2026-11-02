/* End-to-end, regression and responsive tests in headless Chromium (Playwright).
   Usage: node tests/e2e.js            (needs `playwright` with Chromium installed: npm i -D playwright && npx playwright install chromium)
   Checks: every route renders without console errors, KaTeX errors or unrendered "$"; no horizontal page overflow at
   390 / 820 / 1440 px; key user flows (practice, retry queue, exams, flashcards, notes, counterexamples, examiner,
   export data, saved-progress migration). Exit code 1 on any failure. */
"use strict";
const { chromium } = require("playwright");
const { start } = require("./serve");

let pass = 0, fail = 0; const failures = [];
const ok = (cond, name) => { if (cond) pass++; else { fail++; failures.push(name); } };

async function audit(page) {
  return page.evaluate(() => {
    const v = document.getElementById("view");
    const kerr = v.querySelectorAll(".katex-error").length;
    const tw = document.createTreeWalker(v, NodeFilter.SHOW_TEXT); let raw = 0, n;
    while ((n = tw.nextNode())) if (/\$/.test(n.nodeValue) && !n.parentElement.closest("code,pre,textarea,input,script,.katex,.mono,.mono-in")) raw++;
    const over = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return { kerr, raw, over, text: v.innerText.length };
  });
}

(async () => {
  const srv = await start(0);
  const base = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  page.on("dialog", (d) => d.accept("note"));
  const go = async (h, wait) => { errs.length = 0; await page.goto(base + "#" + h); await page.waitForTimeout(wait || 220); };

  /* 1. every route */
  await go("/");
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
  for (const r of routes) {
    await go(r, /visualise|labs|quadratic/.test(r) ? 380 : 200);
    const a = await audit(page);
    ok(!errs.length, "no console errors on " + r + (errs.length ? ": " + errs[0].slice(0, 120) : ""));
    ok(a.kerr === 0, "no KaTeX errors on " + r);
    ok(a.raw === 0, "no unrendered $ on " + r);
    ok(a.text > 40, "content rendered on " + r);
  }
  console.log("routes checked: " + routes.length);

  /* 2. responsive: no horizontal overflow on key pages */
  const keyPages = ["/", "/dashboard", "/ch/3", "/ch/8", "/learn/kernel-range?mode=understand", "/learn/gram-schmidt?mode=practise", "/practice?g=diag-pd&d=standard&s=4", "/exams", "/flashcards", "/proofs/examiner/ker-sub", "/counterexamples", "/encyclopedia", "/theorem/spectral", "/map", "/labs/quadratic", "/labs/change-of-basis", "/labs/calculator", "/labs/gs-studio", "/labs/transform", "/pastpapers", "/notes", "/settings", "/syllabus", "/formulas", "/mock/A"];
  for (const w of [390, 820, 1440]) {
    await page.setViewportSize({ width: w, height: 860 }); await page.waitForTimeout(600); // let header transitions settle after the resize
    for (const r of keyPages) { await go(r, 260); const a = await audit(page); ok(!a.over, "no horizontal overflow at " + w + "px on " + r); }
  }
  // phone sweep over every chapter, lab and topic page
  await page.setViewportSize({ width: 390, height: 860 }); await page.waitForTimeout(600);
  const phone = dyn.chapters.map((n) => "/ch/" + n).concat(dyn.pages.filter((p) => p.startsWith("/labs/")), dyn.topics.map((t) => "/learn/" + t + "?mode=understand"), dyn.topics.map((t) => "/learn/" + t + "?mode=practise"));
  for (const r of phone) { await go(r, 260); const a = await audit(page); ok(!a.over, "no horizontal overflow at 390px on " + r); }
  await page.setViewportSize({ width: 1280, height: 900 });
  console.log("responsive checks: " + (keyPages.length * 3 + phone.length));

  /* 3. flows */
  await page.evaluate(() => { Object.keys(localStorage).filter((k) => k.startsWith("la2273:")).forEach((k) => localStorage.removeItem(k)); localStorage.setItem("la2273:flash", JSON.stringify({ "ch3-0": 3 })); localStorage.setItem("la2273:ppLog", JSON.stringify([{ paper: "2021/22 Sem 1", q: "Q1", text: "x", tags: ["Gram–Schmidt"], done: false, at: 1 }])); });
  await page.reload(); await page.waitForTimeout(400); // migrations run on page load, as after a real upgrade
  // practice: wrong then retry-correct resolves the mistake
  await go("/practice?g=ker-basis&d=standard&s=42", 350);
  const model = await page.evaluate(() => LA.bank.make("ker-basis", 42, "standard").model);
  await page.fill(".ans-in", "(1,0,0,0)"); await page.click('[data-act="check"]'); await page.waitForTimeout(120);
  ok(await page.evaluate(() => LA.mist.list({ open: true }).length === 1), "wrong answer enters the retry queue");
  await go("/practice?mode=retry", 350); await page.fill(".ans-in", model); await page.click('[data-act="check"]'); await page.waitForTimeout(120);
  ok(await page.evaluate(() => LA.mist.list({ open: true }).length === 0), "correct retry resolves the mistake");
  ok(await page.evaluate(() => LA.mastery("kernel-range").n === 2), "mastery evidence recorded once per problem");
  // solution viewed first gives no mastery credit
  await go("/practice?g=norm&d=standard&s=3", 300); await page.click('[data-act="sol"]'); const m2 = await page.evaluate(() => LA.bank.make("norm", 3, "standard").model); await page.fill(".ans-in", m2); await page.click('[data-act="check"]'); await page.waitForTimeout(120);
  ok(await page.evaluate(() => { const e = LA.ev.list({ topic: "norms-angles" }).slice(-1)[0]; return e && e.sol === true && LA.mastery("norms-angles").level <= 1; }), "viewing the solution first gives no mastery credit");
  // exam sprint end-to-end
  await go("/exams", 300); await page.click('[data-preset="comp"]'); await page.waitForTimeout(400);
  ok(/Exam in progress/.test(await page.title()), "exam runner opens");
  await page.click("#exFinish"); await page.waitForTimeout(350); await page.click("#mkDone"); await page.waitForTimeout(350);
  ok(await page.evaluate(() => JSON.parse(localStorage.getItem("la2273:examHistory") || "[]").length === 1), "exam saved to history with a report");
  ok(await page.locator("text=By marking component").count() === 1, "exam report shows component breakdown");
  // flashcards: migrated Leitner box + rating schedules a real due date
  await go("/flashcards?set=ch3", 350);
  ok(await page.evaluate(() => !!JSON.parse(localStorage.getItem("la2273:srs"))["ch3-0"]), "Leitner progress migrated to spaced repetition");
  await page.click("#srsShow"); await page.click('[data-r="2"]'); await page.waitForTimeout(120);
  ok(await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem("la2273:srs"))).some((s) => s && s.due > Date.now() + 3600e3)), "flashcard rating schedules a future review");
  // past paper migration
  await go("/pastpapers", 300);
  ok(await page.evaluate(() => { const e = JSON.parse(localStorage.getItem("la2273:ppLog"))[0]; return e.id && e.year === "2021/22" && e.topics.includes("gram-schmidt"); }), "v1 past-paper entries migrated");
  // counterexample lab exact verifier
  await go("/counterexamples", 300); const c = page.locator('[data-cid="nilp"]'); await c.locator('[data-ci="0"]').fill("0 1; 0 0"); await c.locator('[data-act="test"]').click(); await page.waitForTimeout(100);
  ok(/Valid counterexample/.test(await c.locator(".ce-out").textContent()), "counterexample verified exactly");
  // proof examiner flags conclusion-only
  await go("/proofs/examiner/ker-sub", 300); await page.fill("#peText", "Clearly ker T is a subspace."); await page.click("#peExam"); await page.waitForTimeout(150);
  ok(await page.locator("text=Conclusion-only answer").count() === 1, "examiner flags conclusion-only answers");
  // notes & bookmarks persist
  await go("/ch/4", 400); await page.locator(".bm-btn").first().click(); await page.locator(".note-box summary").first().click(); await page.locator(".note-box textarea").first().fill("test note"); await page.waitForTimeout(450);
  await go("/notes", 300); ok((await page.locator("[data-unbm]").count()) === 1 && (await page.locator(".box.note").count()) === 1, "bookmark and note listed on My Notes");
  // topic studio keeps state between modes
  await go("/learn/kernel-range?mode=practise", 400); const inp = page.locator('[data-pane="practise"] .ans-in').first();
  if (await inp.count()) { await inp.fill("(9,9,9)"); await page.click('.mode-btn[data-mode="prove"]'); await page.click('.mode-btn[data-mode="practise"]'); ok((await inp.inputValue()) === "(9,9,9)", "Topic Studio keeps inputs when switching modes"); }
  // export contains all data
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("la2273:")));
  ["ev", "mistakes", "srs", "examHistory", "ppLog", "notes", "bookmarks"].forEach((k) => ok(keys.includes("la2273:" + k), "export includes " + k));

  await browser.close(); srv.close();
  console.log("\n" + pass + " passed, " + fail + " failed");
  if (fail) { console.log("Failures:\n - " + failures.slice(0, 60).join("\n - ")); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
