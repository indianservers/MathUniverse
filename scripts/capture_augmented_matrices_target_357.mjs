/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0542-interactive-advanced-matrices-and-linear-algebra-augmented-matrices-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/357-augmented-matrices";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0542");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "rows",
  "augmented",
  "determinant",
  "status",
  "solution",
  "variable-count",
  "selected",
  "tab",
  "details",
  "challenge",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attributes) =>
      Object.fromEntries(
        attributes.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByLabel("Equation 2 value 1").fill("2");
await lesson.getByLabel("Equation 2 value 2").fill("1");
await lesson.getByLabel("Equation 2 value 3").fill("5");
checks.infinite = await state();
await lesson.getByLabel("Equation 2 value 3").fill("6");
checks.none = await state();
await lesson.getByRole("button", { name: "Add equation" }).click();
checks.added = await state();
await lesson.getByRole("button", { name: "Return to 2 equations" }).click();
await lesson.getByRole("button", { name: "Add variable" }).click();
checks.thirdVariable = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0542"]')
      ?.getAttribute("data-actions") === "0",
);

await lesson.getByLabel("Challenge entry 1").fill("9");
await lesson.getByRole("button", { name: "Check matrix" }).click();
checks.rejected = await state();
for (let index = 0; index < 6; index++)
  await lesson
    .getByLabel(`Challenge entry ${index + 1}`)
    .fill(["2", "1", "5", "1", "-1", "1"][index]);
await lesson.getByRole("button", { name: "Hint" }).click();
await lesson.getByRole("button", { name: "Check matrix" }).click();
await lesson.getByRole("button", { name: "Show details" }).click();
await lesson.getByRole("button", { name: "Examples", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0542"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();

await page.evaluate(() => {
  scrollTo(0, 0);
  document.querySelectorAll("*").forEach((node) => {
    if (node.scrollLeft) node.scrollLeft = 0;
  });
});
const rect = async (selector) => {
  const box = await page.locator(selector).first().boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        left: Math.round(box.x),
        width: Math.round(box.width),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".mat357-hero"),
  tabs: await rect(".mat357-tabs"),
  workspace: await rect(".mat357-workspace"),
  lower: await rect(".mat357-lower"),
  tools: await rect(".mat357-tools"),
  adjacent: await rect(".lesson-adjacent-nav"),
};
const passed =
  checks.initial.augmented === "[2,1,5,1,-1,1]" &&
  checks.initial.determinant === "-3" &&
  checks.initial.status === "one" &&
  checks.initial.solution === "[2,1]" &&
  checks.infinite.status === "infinite" &&
  checks.infinite.determinant === "0" &&
  checks.none.status === "none" &&
  checks.added.rows === "[[2,1,5],[2,1,6],[1,1,3]]" &&
  checks.thirdVariable["variable-count"] === "3" &&
  checks.thirdVariable.augmented === "[2,1,0,5,1,-1,0,1]" &&
  checks.thirdVariable.status === "infinite" &&
  checks.rejected.challenge === "incorrect" &&
  checks.accepted.challenge === "correct" &&
  checks.accepted.details === "true" &&
  checks.accepted.tab === "Examples" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0542-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0542-reference.png"));
await writeFile(
  path.join(evidence, "0542-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0542", lessonId: 357, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
