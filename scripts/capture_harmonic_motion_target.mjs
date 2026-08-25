import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0332-interactive-intermediate-advanced-trigonometry-harmonic-motion-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2246/lessons/trigonometry/275-harmonic-motion";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 991, height: 1587 },
  deviceScaleFactor: 1,
});
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});

await page.goto(url, { waitUntil: "domcontentloaded" });
await page.getByTestId("trigonometry-mockup-0332").waitFor();
const rootNode = page.getByTestId("trigonometry-mockup-0332");
const state = async () =>
  rootNode.evaluate((element) =>
    Object.fromEntries(
      [
        "data-angle",
        "data-displacement",
        "data-velocity",
        "data-radius-identity",
        "data-active-view",
        "data-animating",
        "data-practice-state",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );

const checks = { initial: await state() };
const handle = page.getByTestId("harmonic-circle-handle");
const box = await handle.boundingBox();
if (!box) throw new Error("Harmonic handle is not visible");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 35, box.y - 34, { steps: 8 });
await page.mouse.up();
checks.drag = await state();

await page.getByLabel("Harmonic angle", { exact: true }).fill("180");
checks.angle180 = await state();
await page.getByLabel("Toggle harmonic animation").click();
await page.waitForTimeout(350);
checks.animation = await state();
await page.getByLabel("Toggle harmonic animation").click();
await page.locator(".target-harmonic-tabs button").nth(3).click();
checks.formulas = await state();
await page.getByLabel("Harmonic practice angle").selectOption("225");
await page.getByLabel("Harmonic practice displacement").fill("0");
await page.getByLabel("Harmonic practice velocity").fill("0");
await page.locator(".hm-answer button").click();
checks.practiceWrong = await state();
await page.getByLabel("Harmonic practice displacement").fill("-0.707");
await page.getByLabel("Harmonic practice velocity").fill("0.707");
await page.locator(".hm-answer button").click();
checks.practiceCorrect = await state();
await page.locator(".target-harmonic-actions button").first().click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = globalThis.document
      .querySelector(selector)
      ?.getBoundingClientRect();
    return rect
      ? { top: rect.top, bottom: rect.bottom, height: rect.height }
      : null;
  };
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    horizontalOverflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surface: region(".target-harmonic-page"),
    regions: {
      header: region(".target-harmonic-header"),
      tabs: region(".target-harmonic-tabs"),
      flow: region(".target-harmonic-flow"),
      lab: region(".target-harmonic-lab"),
      learning: region(".target-harmonic-learning"),
      examples: region(".target-harmonic-examples"),
      practice: region(".target-harmonic-practice"),
      nav: region(".target-harmonic-nav"),
    },
  };
});

const near = (actual, expected, tolerance = 0.05) =>
  Math.abs(Number(actual) - expected) <= tolerance;
const passed =
  checks.initial.angle === "60.000000" &&
  near(checks.initial.displacement, 0.5) &&
  near(checks.initial.velocity, -Math.sqrt(3) / 2) &&
  near(checks.initial["radius-identity"], 1) &&
  checks.drag.angle !== checks.initial.angle &&
  near(checks.drag["radius-identity"], 1) &&
  checks.angle180.angle === "180.000000" &&
  near(checks.angle180.displacement, -1) &&
  near(checks.angle180.velocity, 0) &&
  checks.animation.angle !== checks.angle180.angle &&
  checks.formulas["active-view"] === "formulas" &&
  checks.practiceWrong["practice-state"] === "incorrect" &&
  checks.practiceCorrect["practice-state"] === "correct" &&
  checks.reset.angle === "60.000000" &&
  checks.reset["active-view"] === "interaction" &&
  metrics.document.width === 991 &&
  metrics.document.height === 1587 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(out, "0332-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0332-reference.png"));
const report = {
  mockup: "0332",
  lessonId: 275,
  route: "/lessons/trigonometry/275-harmonic-motion",
  objectModel:
    "draggable-unit-circle-horizontal-projection-displacement-velocity-shm-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0332-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
