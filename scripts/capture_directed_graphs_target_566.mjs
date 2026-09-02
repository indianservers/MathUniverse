/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0623-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-directed-graphs-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/566-directed-graphs";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 966, height: 1628 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0623");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "source",
    "sink",
    "edgeCount",
    "selected",
    "mode",
    "path",
    "history",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByRole("button", { name: /Add vertex/ }).click();
checks.added = await state();
await lesson.getByRole("button", { name: /Undo/ }).click();
checks.undo = await state();
await lesson.getByRole("button", { name: /Redo/ }).click();
checks.redo = await state();
await lesson.getByRole("button", { name: /Add edge/ }).click();
await lesson.getByTestId("directed-vertex-E").click();
await lesson.getByTestId("directed-vertex-F").click();
checks.edgeAdded = await state();
await lesson
  .locator(".dg566-tools")
  .getByRole("button", { name: "C", exact: true })
  .click();
checks.selected = await state();
await lesson.locator(".dg566-tools select").first().selectOption("E");
await lesson.locator(".dg566-tools select").last().selectOption("A");
await lesson.getByRole("button", { name: "Go", exact: true }).click();
checks.noReversePath = await state();
await lesson.getByRole("button", { name: "Check my answers" }).click();
checks.challengeVisible = await lesson.getByText(/P is the source/).isVisible();
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
  hero: await rect(".dg566-hero"),
  tabs: await rect(".dg566-tabs"),
  lab: await rect(".dg566-lab"),
  analysis: await rect(".dg566-analysis"),
  theory: await rect(".dg566-theory"),
  worked: await rect(".dg566-worked"),
  challenge: await rect(".dg566-challenge"),
  adjacent: await rect(".dg566-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0623-desktop.png"),
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
  path: path.join(evidence, "0623-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.source === "A" &&
  checks.initial.sink === "E" &&
  checks.initial.edgeCount === "7" &&
  checks.initial.path === "A,B,E" &&
  checks.added.history === "1" &&
  checks.undo.edgeCount === "7" &&
  checks.redo.history === "1" &&
  checks.edgeAdded.edgeCount === "8" &&
  checks.selected.selected === "C" &&
  checks.noReversePath.path === "" &&
  checks.challengeVisible &&
  checks.reset.edgeCount === "7" &&
  checks.final.edgeCount === "7" &&
  metrics.document.width === 966 &&
  metrics.document.height === 1628 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0623-reference.png"));
await writeFile(
  path.join(evidence, "0623-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
