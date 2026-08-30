/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0388-interactive-advanced-integral-calculus-and-differential-equations-indefinite-integral-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/309-indefinite-integral";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0388");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["c", "tab", "compare", "result", "hint", "actions"].map((k) => [
        k,
        n.getAttribute(`data-${k}`),
      ]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Antiderivative constant C").fill("2");
checks.slider = await state();
await lesson.getByLabel("Antiderivative constant value").fill("-1.5");
checks.number = await state();
const handle = lesson.locator('[data-drag="indefinite-c"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Constant drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 40, { steps: 6 });
await page.mouse.up();
checks.graphDrag = await state();
await lesson.getByRole("button", { name: "3", exact: true }).click();
await lesson.getByRole("button", { name: "Compare a point" }).click();
await lesson.getByRole("button", { name: "Formulas & rules" }).click();
checks.explore = await state();
await lesson.getByLabel("Indefinite integral practice answer").fill("x^2");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Indefinite integral practice answer").fill("x^2 + C");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
await lesson.getByRole("button", { name: "Hint" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0388"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0388").waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const b = document.querySelector(s)?.getBoundingClientRect();
    return (
      b &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((k) => [
          k,
          Math.round(b[k]),
        ]),
      )
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".ind309-hero"),
    tabs: rect(".ind309-tabs"),
    flow: rect(".ind309-flow"),
    lab: rect(".ind309-lab"),
    cards: rect(".ind309-cards"),
    adjacent: rect(".ind309-adjacent"),
    footer: rect(".ind309-footer"),
  };
});
const passed =
  checks.initial.c === "0" &&
  checks.slider.c === "2" &&
  checks.number.c === "-1.5" &&
  checks.graphDrag.c !== checks.number.c &&
  checks.explore.c === "3" &&
  checks.explore.compare === "true" &&
  checks.explore.tab === "Formulas & rules" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.hint === "true" &&
  checks.localReset.c === "0" &&
  checks.localReset.tab === "Explore" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0388",
  lessonId: 309,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0388-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0388-reference.png"));
await writeFile(
  path.join(evidence, "0388-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
