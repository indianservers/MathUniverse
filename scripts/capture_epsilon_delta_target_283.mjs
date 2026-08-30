/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0362-interactive-advanced-limits-and-differential-calculus-epsilon-delta-visualiser-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/283-epsilondelta-visualiser",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 935, height: 1683 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0362");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "epsilon",
        "delta",
        "a",
        "limit",
        "pass",
        "practice-epsilon",
        "practice-delta",
        "practice-pass",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByRole("slider", { name: "Adjust δ (input interval)" }).fill("1.5");
checks.failed = await state();
await lesson.getByRole("slider", { name: "Adjust ε (output band)" }).fill("3");
checks.recovered = await state();
await lesson.getByRole("slider", { name: "Delta interval around a" }).fill("2");
checks.movedA = await state();
const handle = lesson.locator('[data-drag="delta-right"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Delta drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 90, box.y, { steps: 7 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Practice delta").fill("1");
checks.practiceFailed = await state();
await lesson.getByLabel("Practice delta").fill("0.8");
checks.practicePassed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0362"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson
    .getByRole("link", { name: /Next/ })
    .getAttribute("href"),
};
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
  const r = (s) => {
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
    sidebar: r('[data-testid="desktop-sidebar"]'),
    hero: r(".ed283-hero"),
    tabs: r(".ed283-tabs"),
    lab: r(".ed283-lab"),
    how: r(".ed283-how"),
    learning: r(".ed283-learning"),
    practice: r(".ed283-practice"),
    adjacent: r(".ed283-nav"),
    footer: r('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.epsilon === "2" &&
  checks.initial.delta === "1" &&
  checks.initial.a === "1" &&
  checks.initial.limit === "2" &&
  checks.initial.pass === "true" &&
  checks.failed.pass === "false" &&
  checks.recovered.pass === "true" &&
  checks.movedA.limit === "4" &&
  checks.dragged.delta !== checks.recovered.delta &&
  checks.practiceFailed["practice-pass"] === "false" &&
  checks.practicePassed["practice-pass"] === "true" &&
  checks.reset.epsilon === "2" &&
  checks.reset.delta === "1" &&
  checks.reset.a === "1" &&
  checks.reset.actions === "0" &&
  navigation.previousHref === "/lessons/calculus/282-types-of-discontinuity" &&
  navigation.nextHref === "/lessons/calculus/284-average-rate-of-change" &&
  metrics.document.width === 935 &&
  metrics.document.height === 1683 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 205 &&
  metrics.footer?.height === 103 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0362",
  lessonId: 283,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0362-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0362-reference.png"));
await writeFile(
  path.join(evidence, "0362-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
