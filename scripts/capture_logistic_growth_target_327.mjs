/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0406-interactive-advanced-integral-calculus-and-differential-equations-logistic-growth-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/327-logistic-growth";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 935, height: 1683 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0406");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "k",
        "r",
        "p0",
        "time",
        "population",
        "rate",
        "a",
        "inflection",
        "tab",
        "result1",
        "result2",
        "reveal",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
const kSlider = lesson.getByLabel("Logistic Carrying capacity K");
const kBox = await kSlider.boundingBox();
if (!kBox) throw new Error("Logistic K slider missing");
await page.mouse.click(
  kBox.x + kBox.width * ((3200 - 500) / 4500),
  kBox.y + kBox.height / 2,
);
await lesson.getByLabel("Logistic Growth rate r").fill("1");
await lesson.getByLabel("Logistic Initial population P₀").fill("600");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.controls = await state();
const graph = lesson.locator(".log327-graph");
const graphBox = await graph.boundingBox();
if (!graphBox) throw new Error("Logistic graph missing");
await page.mouse.click(
  graphBox.x + graphBox.width * 0.6,
  graphBox.y + graphBox.height * 0.55,
);
checks.time = await state();
const handle = lesson.locator('[data-drag="logistic-initial"]');
const handleBox = await handle.boundingBox();
if (!handleBox) throw new Error("Logistic initial handle missing");
await page.mouse.move(
  handleBox.x + handleBox.width / 2,
  handleBox.y + handleBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(handleBox.x, handleBox.y - 42, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
const practiceP5 = 3000 / (1 + 9 * Math.exp(-2));
const practiceHalf = Math.log(9) / 0.4;
await lesson.getByLabel("Logistic practice population").fill("2056.3");
await lesson.getByLabel("Logistic practice time").fill("4.33");
await lesson
  .getByRole("button", { name: "Check", exact: true })
  .first()
  .click();
await lesson.getByRole("button", { name: "Check", exact: true }).nth(1).click();
checks.rejected = await state();
await lesson
  .getByLabel("Logistic practice population")
  .fill(practiceP5.toFixed(1));
await lesson.getByLabel("Logistic practice time").fill(practiceHalf.toFixed(2));
await lesson
  .getByRole("button", { name: "Check", exact: true })
  .first()
  .click();
await lesson.getByRole("button", { name: "Check", exact: true }).nth(1).click();
await lesson.getByRole("button", { name: "Reveal", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0406"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(150);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const bounds = document.querySelector(selector)?.getBoundingClientRect();
    return (
      bounds &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(bounds[key]),
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
    hero: rect(".log327-hero"),
    tabs: rect(".log327-tabs"),
    lab: rect(".log327-lab"),
    theory: rect(".log327-theory"),
    worked: rect(".log327-worked"),
    practice: rect(".log327-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (value, expected, tolerance = 1e-5) =>
  Math.abs(Number(value) - expected) <= tolerance;
const initialExpected = 2000 / (1 + 4 * Math.exp(-0.6 * 2.4));
const passed =
  close(checks.initial.k, 2000) &&
  close(checks.initial.r, 0.6) &&
  close(checks.initial.p0, 400) &&
  close(checks.initial.population, initialExpected) &&
  close(
    checks.initial.rate,
    0.6 * initialExpected * (1 - initialExpected / 2000),
  ) &&
  close(checks.initial.inflection, Math.log(4) / 0.6) &&
  checks.controls.k !== "2000" &&
  close(checks.controls.r, 1) &&
  close(checks.controls.p0, 600) &&
  checks.controls.tab === "Formula" &&
  checks.time.time !== checks.controls.time &&
  checks.drag.p0 !== checks.controls.p0 &&
  checks.rejected.result1 === "incorrect" &&
  checks.rejected.result2 === "incorrect" &&
  checks.accepted.result1 === "correct" &&
  checks.accepted.result2 === "correct" &&
  checks.accepted.reveal === "true" &&
  checks.shellReset.k === "2000" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 935 &&
  metrics.document.height === 1683 &&
  !metrics.overflow &&
  metrics.sidebar.width === 207 &&
  metrics.hero.top === 95 &&
  metrics.lab.top === 264 &&
  metrics.theory.top === 803 &&
  metrics.adjacent.top === 1534 &&
  metrics.footer.bottom === 1683 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0406",
  lessonId: 327,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0406-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0406-reference.png"));
await writeFile(
  path.join(evidence, "0406-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
