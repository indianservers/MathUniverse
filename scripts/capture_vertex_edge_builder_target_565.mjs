/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0622-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-vertex-and-edge-builder-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/565-vertex-and-edge-builder";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1028, height: 1530 } });
const consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0622");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(700);

const keys = [
  "vertices",
  "edges",
  "degreeSum",
  "handshake",
  "mode",
  "directed",
  "selected",
  "positions",
  "challenge",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByTestId("graph-vertex-A").click();
await lesson.getByTestId("graph-vertex-C").click();
checks.edgeAdded = await state();
const addedEdgeLine = lesson.locator(".graph565-edge line").last();
const edgeBox = await addedEdgeLine.boundingBox();
if (!edgeBox) throw new Error("Added edge did not render");
await page.mouse.click(
  edgeBox.x + edgeBox.width / 2,
  edgeBox.y + edgeBox.height / 2,
);
checks.edgeRemoved = await state();

await lesson.getByRole("button", { name: "Add Vertex" }).click();
const canvas = lesson.locator(".graph565-canvas > svg");
const canvasBox = await canvas.boundingBox();
if (!canvasBox) throw new Error("Graph canvas did not render");
await page.mouse.click(canvasBox.x + canvasBox.width * 0.88, canvasBox.y + 245);
checks.vertexAdded = await state();

await lesson.getByRole("button", { name: "Add Edge", exact: true }).click();
await lesson.getByTestId("graph-vertex-F").click();
await lesson.getByTestId("graph-vertex-A").click();
checks.vertexConnected = await state();

await lesson.locator(".graph565-canvas > aside button").nth(1).click();
const beforeDrag = (await state()).positions;
const vertexA = lesson.getByTestId("graph-vertex-A");
const aBox = await vertexA.boundingBox();
if (!aBox) throw new Error("Vertex A did not render");
await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
await page.mouse.down();
await page.mouse.move(aBox.x + 45, aBox.y + 28, { steps: 8 });
await page.mouse.up();
checks.dragged = await state();
checks.dragChangedPosition = checks.dragged.positions !== beforeDrag;

await lesson.getByRole("button", { name: "Directed", exact: true }).click();
checks.directed = await state();
checks.arrows = await lesson
  .locator('line[marker-end="url(#arrow565)"]')
  .count();
const zoomBefore = await lesson
  .getByTestId("graph-zoom-layer")
  .getAttribute("transform");
await lesson.locator(".graph565-zoom button").last().click();
checks.zoomLabel = await lesson.locator(".graph565-zoom output").textContent();
checks.zoomTransformChanged =
  (await lesson.getByTestId("graph-zoom-layer").getAttribute("transform")) !==
  zoomBefore;

await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/Handshake Lemma: the sum/)
  .isVisible();
await lesson.getByRole("button", { name: /New challenge/ }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Need a hint?" }).click();
checks.hintVisible = await lesson
  .getByText(/Add one vertex and connect/)
  .isVisible();

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
  hero: await rect(".graph565-hero"),
  tabs: await rect(".graph565-tabs"),
  workspace: await rect(".graph565-workspace"),
  canvas: await rect(".graph565-canvas"),
  bottom: await rect(".graph565-bottom"),
  adjacent: await rect(".graph565-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0622-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0622-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.vertices === "5" &&
  checks.initial.edges === "7" &&
  checks.initial.degreeSum === "14" &&
  checks.initial.handshake === "true" &&
  checks.edgeAdded.edges === "8" &&
  checks.edgeAdded.degreeSum === "16" &&
  checks.edgeRemoved.edges === "7" &&
  checks.vertexAdded.vertices === "6" &&
  checks.vertexConnected.edges === "8" &&
  checks.dragChangedPosition &&
  checks.directed.directed === "true" &&
  checks.arrows === 8 &&
  checks.zoomLabel === "110%" &&
  checks.zoomTransformChanged &&
  checks.formulaVisible &&
  checks.challenge.vertices === "6" &&
  checks.challenge.edges === "8" &&
  checks.challenge.degreeSum === "16" &&
  checks.hintVisible &&
  checks.final.vertices === "5" &&
  checks.final.edges === "7" &&
  metrics.document.width === 1028 &&
  metrics.document.height === 1530 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0622-reference.png"));
await writeFile(
  path.join(evidence, "0622-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
