/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0633-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-graph-colouring-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/576-graph-colouring";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0633");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(400);

const keys = [
  "conflictCount",
  "colourCount",
  "valid",
  "order",
  "edgeCount",
  "edgeVariant",
  "positions",
  "chromaticNumber",
  "challengeValid",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByRole("button", { name: "Compare orders" }).click();
checks.compared = await state();
await lesson.getByLabel("Select colour 1").first().click();
await lesson.getByTestId("colour-vertex-A").click();
checks.conflict = await state();
await lesson.getByRole("button", { name: "Reset colours" }).click();
checks.cleared = await state();
await lesson.getByLabel("Select colour 3").first().click();
await lesson.getByTestId("colour-vertex-A").press("Enter");
checks.keyboard = await state();
await lesson.getByRole("button", { name: /New graph/ }).click();
checks.alternate = await state();
await lesson.getByLabel("Greedy colouring order").selectOption({ index: 4 });
checks.unluckyOrder = await state();

const positionBefore = checks.unluckyOrder.positions;
const vertex = await lesson.getByTestId("colour-vertex-A").boundingBox();
if (!vertex) throw new Error("Main graph vertex A is missing");
await page.mouse.move(
  vertex.x + vertex.width / 2,
  vertex.y + vertex.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  vertex.x + vertex.width / 2 + 45,
  vertex.y + vertex.height / 2 + 30,
  { steps: 8 },
);
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== positionBefore;

await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/minimum number of colours in any proper colouring/)
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();

const challenge = lesson.locator(".gc576-practice");
await challenge.getByLabel("Select colour 1").click();
await challenge.getByTestId("challenge-vertex-A").click();
await challenge.getByLabel("Select colour 2").click();
await challenge.getByTestId("challenge-vertex-B").click();
await challenge.getByLabel("Select colour 3").click();
await challenge.getByTestId("challenge-vertex-C").click();
await challenge.getByLabel("Select colour 1").click();
await challenge.getByTestId("challenge-vertex-D").click();
checks.challenge = await state();
await challenge.getByRole("button", { name: "Check my answer" }).click();
checks.challengeOutput = await challenge.locator("output").textContent();

await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(300);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const box = selector
    ? await lesson.locator(selector).boundingBox()
    : await lesson.boundingBox();
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
  surface: await rect(null),
  hero: await rect(".gc576-hero"),
  tabs: await rect(".gc576-tabs"),
  lab: await rect(".gc576-lab"),
  learning: await rect(".gc576-learning"),
  practice: await rect(".gc576-practice"),
  adjacent: await rect(".gc576-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0633-desktop.png"),
  fullPage: false,
});

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`mobile ${message.type()}: ${message.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const mobileLesson = mobile.getByTestId("discrete-mockup-0633");
await mobileLesson.waitFor({ timeout: 600000 });
await mobile.waitForTimeout(300);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0633-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial.conflictCount === "0" &&
  checks.initial.colourCount === "3" &&
  checks.initial.valid === "true" &&
  checks.initial.chromaticNumber === "3" &&
  checks.initial.edgeCount === "7" &&
  checks.compared.order === "B,A,C,E,D" &&
  checks.compared.actions === "1" &&
  Number(checks.conflict.conflictCount) > 0 &&
  checks.conflict.valid === "false" &&
  checks.cleared.colourCount === "0" &&
  checks.cleared.valid === "false" &&
  checks.keyboard.colourCount === "1" &&
  checks.alternate.edgeVariant === "alternate" &&
  checks.alternate.edgeCount === "7" &&
  checks.unluckyOrder.order === "A,C,B,E,D" &&
  checks.unluckyOrder.conflictCount === "0" &&
  checks.dragChanged &&
  checks.formulaVisible &&
  checks.challenge.challengeValid === "true" &&
  checks.challengeOutput?.includes("Correct") &&
  checks.final.conflictCount === "0" &&
  checks.final.colourCount === "3" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.surface?.top === 106 &&
  metrics.surface?.bottom <= 1536 &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0633-reference.png"));
await writeFile(
  path.join(evidence, "0633-validation.json"),
  `${JSON.stringify(
    { passed, url, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  )}\n`,
);
console.log(
  JSON.stringify(
    { passed, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
