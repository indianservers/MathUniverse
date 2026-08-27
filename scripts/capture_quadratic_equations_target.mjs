import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0171-interactive-intermediate-advanced-equations-and-inequalities-quadratic-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/114-quadratic-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 862, height: 1824 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0171");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      ["equation", "roots", "factorable", "practice-correct", "actions"].map(
        (name) => [name, element.getAttribute(`data-${name}`)],
      ),
    ),
  );
const checks = { initial: await state() };

await page.getByLabel("Quadratic coefficient b").fill("-7");
await page.getByLabel("Quadratic coefficient c").fill("12");
checks.coefficients = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.locator(".quad114-toggle").filter({ hasText: "Show factors" }).click();
checks.factorsHidden = await state();
await page.locator(".quad114-toggle").filter({ hasText: "Show factors" }).click();
const graph = page
  .getByRole("img", { name: "Graph of y equals x² − 5x + 6" })
  .first();
const box = await graph.boundingBox();
if (box) {
  const root = page.getByRole("slider", { name: "Drag root 1" });
  const rootBox = await root.boundingBox();
  if (rootBox) {
    await page.mouse.move(
      rootBox.x + rootBox.width / 2,
      rootBox.y + rootBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      rootBox.x - box.width / 16,
      rootBox.y + rootBox.height / 2,
      { steps: 6 },
    );
    await page.mouse.up();
  }
}
checks.draggedRoot = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByLabel("Practice root 1").fill("2");
await page.getByRole("button", { name: "Check Answer" }).click();
checks.practiceWrong = await state();
await page.getByLabel("Practice root 1").fill("3");
await page.getByRole("button", { name: "Check Answer" }).click();
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "New equation" }).click();
checks.newEquation = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    regions: {
      surface: region(".quad114-page"),
      intro: region(".quad114-intro"),
      controls: region(".quad114-controls"),
      lab: region(".quad114-lab"),
      practice: region(".quad114-practice"),
      navigation: region(".quad114-adjacent"),
      footer: region(".quad114-footer"),
    },
  };
});
const passed =
  checks.initial.equation === "1,-5,6" &&
  checks.initial.roots === "2,3" &&
  checks.initial.factorable === "true" &&
  checks.coefficients.equation === "1,-7,12" &&
  checks.coefficients.roots === "3,4" &&
  checks.draggedRoot.roots !== "2,3" &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.newEquation.equation === "1,-7,12" &&
  checks.reset.equation === "1,-5,6" &&
  checks.reset.roots === "2,3" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(out, "0171-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0171-reference.png"));
const report = {
  mockup: "0171",
  lessonId: 114,
  route: "/lessons/algebra/114-quadratic-equations",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0171-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
