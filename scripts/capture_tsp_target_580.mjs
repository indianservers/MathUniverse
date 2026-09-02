/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0637-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-travelling-salesperson-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/580-travelling-salesperson";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0637");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(300);
const keys = [
    "route",
    "closed",
    "complete",
    "distance",
    "optimum",
    "suggestion",
    "suggestionDistance",
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
await lesson.getByRole("button", { name: "Clear order" }).click();
checks.cleared = await state();
for (const city of ["A", "B", "C", "E", "D"])
  await lesson.getByTestId(`tsp-city-${city}`).click();
checks.open = await state();
await lesson.getByRole("button", { name: /Close tour/ }).click();
checks.closed = await state();
await lesson.getByRole("button", { name: "Use this tour" }).click();
checks.suggested = await state();
const before = checks.suggested.positions,
  cityC = lesson.getByTestId("tsp-city-C"),
  box = await cityC.boundingBox();
if (!box) throw new Error("City C missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 55, box.y + box.height / 2 + 65, {
  steps: 10,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = before !== checks.dragged.positions;
await lesson.getByLabel("Edge weights").uncheck();
checks.labelsOff = !(await lesson.getByLabel("Edge weights").isChecked());
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".tsp580-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("TSP challenge route").fill("A-B-D-C-E-A");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("TSP challenge route").fill("A-B-C-E-D-A");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((node) => {
    node.scrollTop = 0;
    node.scrollLeft = 0;
  });
});
await page.waitForTimeout(100);
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
  hero: await rect(".tsp580-hero"),
  tabs: await rect(".tsp580-tabs"),
  lab: await rect(".tsp580-lab"),
  theory: await rect(".tsp580-theory"),
  practice: await rect(".tsp580-practice"),
  adjacent: await rect(".tsp580-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0637-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`mobile ${message.type()}: ${message.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0637").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0637-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.route === "A,B,C,E,D" &&
  checks.initial.closed === "true" &&
  checks.initial.distance === "15" &&
  checks.initial.optimum === "15" &&
  checks.cleared.route === "" &&
  checks.cleared.distance === "0" &&
  checks.open.route === "A,B,C,E,D" &&
  checks.open.closed === "false" &&
  checks.open.distance === "14" &&
  checks.closed.closed === "true" &&
  checks.closed.distance === "15" &&
  checks.suggested.route === checks.initial.suggestion &&
  checks.suggested.distance === checks.initial.suggestionDistance &&
  Number(checks.suggested.distance) > 15 &&
  checks.dragChanged &&
  checks.labelsOff &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.distance === "15" &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0637-reference.png"));
await writeFile(
  path.join(evidence, "0637-validation.json"),
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
