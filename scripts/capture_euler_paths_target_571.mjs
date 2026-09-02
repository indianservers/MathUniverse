/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0628-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-euler-paths-and-circuits-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/571-euler-paths-and-circuits";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 977, height: 1610 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0628");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "edgeCount",
    "usedCount",
    "walk",
    "eulerKind",
    "oddCount",
    "complete",
    "variant",
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
for (const id of ["B", "C", "E", "D", "A"])
  await lesson.getByTestId(`euler-vertex-${id}`).first().click();
checks.circuit = await state();
await lesson.getByTestId("euler-vertex-D").first().click();
checks.reusedRejected = await state();
checks.reusedMessage = await lesson.getByText(/already been used/).isVisible();
await lesson.getByRole("button", { name: /Reset Path/ }).click();
checks.resetPath = await state();
await lesson.getByRole("button", { name: /New Graph/ }).click();
checks.openGraph = await state();
for (const id of ["B", "C", "E", "D", "A", "C"])
  await lesson.getByTestId(`euler-vertex-${id}`).first().click();
checks.openTrail = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.getByText(/exactly 2/).isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Euler practice answer").fill("A-B-C");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Euler practice answer").fill("none");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show Hint/ }).click();
checks.hintVisible = await lesson.getByText(/A=3, B=3/).isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const box = await lesson.locator(selector).boundingBox();
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
  hero: await rect(".eu571-hero"),
  tabs: await rect(".eu571-tabs"),
  lab: await rect(".eu571-lab"),
  sequence: await rect(".eu571-sequence"),
  theory: await rect(".eu571-theory"),
  practice: await rect(".eu571-practice"),
  adjacent: await rect(".eu571-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0628-desktop.png"),
  fullPage: false,
});
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`mobile ${message.type()}: ${message.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0628").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0628-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.eulerKind === "circuit" &&
  checks.initial.oddCount === "0" &&
  checks.initial.usedCount === "0" &&
  checks.circuit.walk === "A,B,C,E,D,A" &&
  checks.circuit.usedCount === "5" &&
  checks.circuit.complete === "true" &&
  checks.reusedRejected.walk === checks.circuit.walk &&
  checks.reusedMessage &&
  checks.resetPath.usedCount === "0" &&
  checks.openGraph.variant === "path" &&
  checks.openGraph.eulerKind === "path" &&
  checks.openGraph.oddCount === "2" &&
  checks.openTrail.walk === "A,B,C,E,D,A,C" &&
  checks.openTrail.usedCount === "6" &&
  checks.openTrail.complete === "true" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.hintVisible &&
  checks.final.eulerKind === "circuit" &&
  checks.final.usedCount === "0" &&
  metrics.document.width === 977 &&
  metrics.document.height === 1610 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0628-reference.png"));
await writeFile(
  path.join(evidence, "0628-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
