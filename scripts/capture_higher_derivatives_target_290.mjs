/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0369-interactive-advanced-limits-and-differential-calculus-higher-derivatives-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/290-higher-derivatives",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 986, height: 1596 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0369");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["x", "domain", "model", "f", "d1", "d2", "d3", "result", "actions"].map(
        (k) => [k, n.getAttribute(`data-${k}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Higher derivative cursor").fill("1");
checks.xOne = await state();
await lesson.getByLabel("Domain maximum").fill("4");
checks.domain = await state();
await lesson.getByRole("button", { name: "Random example" }).click();
checks.random = await state();
const handle = lesson.locator('[data-drag="higher-point-2"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Higher-derivative drag point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 30, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
const toggles = lesson.getByRole("checkbox");
await toggles.nth(0).uncheck();
await toggles.nth(1).uncheck();
checks.toggles = await state();
await lesson.getByLabel("Practice derivative 2").fill("0");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Practice derivative 2").fill("6");
await lesson.getByLabel("Practice derivative 3").fill("48");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0369"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /*SVG*/
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((k) => [
        k,
        Math.round(b[k]),
      ]),
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".hdr290-hero"),
    tabs: rect(".hdr290-tabs"),
    lab: rect(".hdr290-lab"),
    meaning: rect(".hdr290-meaning"),
    info: rect(".hdr290-info"),
    bottom: rect(".hdr290-bottom"),
    adjacent: rect(".hdr290-adjacent"),
    footer: rect(".hdr290-footer"),
  };
});
const passed =
  checks.initial.x === "0" &&
  checks.initial.f === "3" &&
  checks.initial.d1 === "0" &&
  checks.initial.d2 === "-12" &&
  checks.initial.d3 === "0" &&
  checks.xOne.f === "-2" &&
  checks.xOne.d1 === "-8" &&
  checks.xOne.d2 === "0" &&
  checks.xOne.d3 === "24" &&
  checks.domain.domain === "4" &&
  checks.random.model !== checks.initial.model &&
  checks.dragged.x !== "1" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "0" &&
  checks.reset.domain === "3.5" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 986 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 210 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0369",
  lessonId: 290,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0369-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0369-reference.png"));
await writeFile(
  path.join(evidence, "0369-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
