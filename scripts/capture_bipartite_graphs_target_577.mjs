/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0634-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-bipartite-graphs-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/577-bipartite-graphs";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1040, height: 1512 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0634");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(400);
const keys = [
    "variant",
    "setA",
    "setB",
    "edgeCount",
    "conflictCount",
    "bipartite",
    "step",
    "auto",
    "positions",
    "answer",
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
await lesson.getByRole("button", { name: /Example: Odd Cycle/ }).click();
checks.odd = await state();
await lesson.getByRole("button", { name: /Example: Bipartite/ }).click();
checks.base = await state();
await lesson.getByRole("button", { name: "Clear", exact: true }).click();
checks.clear = await state();
await lesson.getByRole("button", { name: /Step/ }).click();
checks.step = await state();
await lesson.getByRole("button", { name: /Auto/ }).click();
await page.waitForTimeout(2500);
checks.auto = await state();
await lesson.getByRole("button", { name: /Example: Bipartite/ }).click();
const beforeDrag = checks.base.positions,
  vertex = await lesson.getByTestId("bipartite-vertex-A").boundingBox(),
  canvas = await lesson.locator(".bp577-canvas svg").boundingBox();
if (!vertex || !canvas) throw new Error("Bipartite drag surface missing");
await page.mouse.move(
  vertex.x + vertex.width / 2,
  vertex.y + vertex.height / 2,
);
await page.mouse.down();
await page.mouse.move(canvas.x + canvas.width - 65, canvas.y + 150, {
  steps: 10,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== beforeDrag;
await lesson.getByLabel("Edge labels").uncheck();
await lesson.getByLabel("Show numbers").uncheck();
checks.toggles = {
  labels: await lesson.getByLabel("Edge labels").isChecked(),
  numbers: await lesson.getByLabel("Show numbers").isChecked(),
};
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".bp577-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("B  Not bipartite").check();
await lesson.getByRole("button", { name: /Check answer/ }).click();
checks.wrong = await state();
await lesson.getByLabel("A  Bipartite").check();
await lesson.getByRole("button", { name: /Check answer/ }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(300);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const b = selector
    ? await lesson.locator(selector).boundingBox()
    : await lesson.boundingBox();
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
  surface: await rect(null),
  hero: await rect(".bp577-hero"),
  tabs: await rect(".bp577-tabs"),
  lab: await rect(".bp577-lab"),
  theory: await rect(".bp577-theory"),
  examples: await rect(".bp577-examples"),
  practice: await rect(".bp577-practice"),
  adjacent: await rect(".bp577-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0634-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0634").waitFor({ timeout: 600000 });
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
  path: path.join(evidence, "0634-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.variant === "base" &&
  checks.initial.setA === "2" &&
  checks.initial.setB === "3" &&
  checks.initial.edgeCount === "4" &&
  checks.initial.conflictCount === "0" &&
  checks.initial.bipartite === "true" &&
  checks.odd.variant === "odd" &&
  checks.odd.conflictCount === "1" &&
  checks.odd.bipartite === "false" &&
  checks.base.variant === "base" &&
  checks.clear.setA === "0" &&
  checks.clear.setB === "0" &&
  checks.step.step === "1" &&
  checks.auto.step === "5" &&
  checks.auto.auto === "false" &&
  checks.dragChanged &&
  Number(checks.dragged.conflictCount) > 0 &&
  !checks.toggles.labels &&
  !checks.toggles.numbers &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.variant === "base" &&
  metrics.document.width === 1040 &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1512 &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0634-reference.png"));
await writeFile(
  path.join(evidence, "0634-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
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
