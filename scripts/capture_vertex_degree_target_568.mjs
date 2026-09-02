/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0625-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-degree-of-a-vertex-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/568-degree-of-a-vertex";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1031, height: 1526 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0625");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "selected",
    "selectedDegree",
    "edgeCount",
    "degreeSum",
    "loops",
    "verified",
    "showLoops",
    "positions",
    "graded",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByTestId("degree-vertex-C").click();
checks.selectedC = await state();
await lesson.getByLabel("Show loops").uncheck();
checks.hiddenLoops = await state();
await lesson
  .locator(".vd568-vertices")
  .getByRole("button", { name: "A", exact: true })
  .click();
await lesson.getByRole("button", { name: "Add loop", exact: true }).click();
checks.loopAdded = await state();
await lesson.getByLabel("Select edge pair").selectOption("AC");
await lesson.getByRole("button", { name: "Add", exact: true }).click();
checks.edgeAdded = await state();
await lesson.getByRole("button", { name: "Remove", exact: true }).click();
checks.edgeRemoved = await state();
const before = checks.edgeRemoved.positions,
  d = await lesson.getByTestId("degree-vertex-D").boundingBox();
if (!d) throw new Error("D missing");
await page.mouse.move(d.x + d.width / 2, d.y + d.height / 2);
await page.mouse.down();
await page.mouse.move(d.x + d.width / 2 + 42, d.y + d.height / 2 - 25, {
  steps: 8,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== before;
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/Handshake Lemma: Σdeg/)
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
for (const [i, value] of [2, 4, 2, 3].entries())
  await lesson
    .getByLabel(`Degree ${["W", "X", "Y", "Z"][i]}`)
    .fill(String(value));
await lesson.getByRole("button", { name: "Check Answers" }).click();
checks.wrong = await state();
await lesson.getByLabel("Degree X").fill("5");
await lesson.getByRole("button", { name: "Check Answers" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hintVisible = await lesson.getByText(/loop adds 2/).isVisible();
await lesson.getByRole("button", { name: /Reset graph/ }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
  const b = await lesson.locator(s).boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        left: Math.round(b.x),
        width: Math.round(b.width),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
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
  hero: await rect(".vd568-hero"),
  tabs: await rect(".vd568-tabs"),
  lab: await rect(".vd568-lab"),
  summary: await rect(".vd568-summary"),
  pattern: await rect(".vd568-pattern"),
  worked: await rect(".vd568-worked"),
  challenge: await rect(".vd568-challenge"),
  adjacent: await rect(".vd568-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0625-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0625-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.selected === "B" &&
  checks.initial.selectedDegree === "13" &&
  checks.initial.edgeCount === "19" &&
  checks.initial.degreeSum === "38" &&
  checks.initial.verified === "true" &&
  checks.selectedC.selectedDegree === "4" &&
  checks.hiddenLoops.showLoops === "false" &&
  checks.hiddenLoops.edgeCount === "19" &&
  checks.loopAdded.loops === "2" &&
  checks.loopAdded.edgeCount === "20" &&
  checks.loopAdded.degreeSum === "40" &&
  checks.edgeAdded.edgeCount === "21" &&
  checks.edgeAdded.degreeSum === "42" &&
  checks.edgeRemoved.edgeCount === "20" &&
  checks.dragChanged &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.hintVisible &&
  checks.reset.edgeCount === "19" &&
  checks.final.degreeSum === "38" &&
  metrics.document.width === 1031 &&
  metrics.document.height === 1526 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0625-reference.png"));
await writeFile(
  path.join(evidence, "0625-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
