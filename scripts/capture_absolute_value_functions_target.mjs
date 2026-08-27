import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0198-interactive-intermediate-advanced-functions-absolute-value-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/141-absolute-value-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1205, height: 1305 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0198");
await node.waitFor({ timeout: 600000 });
const names = [
  "a",
  "h",
  "k",
  "reflection",
  "effective-a",
  "effective-h",
  "effective-k",
  "formula",
  "vertex",
  "probe",
  "distance",
  "probe-output",
  "range",
  "piecewise",
  "actions",
];
const state = () =>
  node.evaluate(
    (element, attrs) =>
      Object.fromEntries(
        attrs.map((name) => [name, element.getAttribute(`data-${name}`)]),
      ),
    names,
  );
const checks = { initial: await state() };
const dragRange = async (name, from, delta) => {
  const slider = node.getByRole("slider", { name, exact: true });
  const box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width * from,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
await dragRange("Absolute-value opening scale", 0.65, 0.08);
checks.scaleSlider = await state();
await dragRange("Absolute-value vertex x", 0.58, 0.08);
checks.hSlider = await state();
await dragRange("Absolute-value vertical shift", 0.33, 0.08);
checks.kSlider = await state();
await page.getByRole("button", { name: "Explore", exact: true }).click();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const graph = node.locator(".abs141-graph"),
  vertex = node.getByRole("slider", { name: "Drag absolute-value vertex" });
const graphBox = await graph.boundingBox(),
  vertexBox = await vertex.boundingBox();
if (!graphBox || !vertexBox)
  throw new Error("Absolute-value graph geometry unavailable");
let x = vertexBox.x + vertexBox.width / 2,
  y = vertexBox.y + vertexBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(
  x + graphBox.width * (43 / 580),
  y - graphBox.height * (43 / 520),
  { steps: 8 },
);
await page.mouse.up();
checks.vertexDrag = await state();
await vertex.focus();
await vertex.press("ArrowLeft");
await vertex.press("ArrowDown");
checks.vertexKeyboard = await state();
const opening = node.getByRole("slider", {
    name: "Drag absolute-value opening point",
  }),
  openingBox = await opening.boundingBox();
if (!openingBox) throw new Error("Absolute-value opening point unavailable");
x = openingBox.x + openingBox.width / 2;
y = openingBox.y + openingBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (43 / 520), { steps: 8 });
await page.mouse.up();
checks.openingDrag = await state();
await opening.focus();
await opening.press("ArrowDown");
checks.openingKeyboard = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const probe = node.getByRole("slider", { name: "Drag distance probe" }),
  line = node.locator(".abs141-number-line"),
  probeBox = await probe.boundingBox(),
  lineBox = await line.boundingBox();
if (!probeBox || !lineBox)
  throw new Error("Absolute-value number line unavailable");
x = probeBox.x + probeBox.width / 2;
y = probeBox.y + probeBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x - lineBox.width * (42 / 500), y, { steps: 8 });
await page.mouse.up();
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
await node
  .getByRole("button", { name: "Reflect over x-axis", exact: true })
  .click();
checks.reflectX = await state();
await node
  .getByRole("button", { name: "Reflect over y-axis", exact: true })
  .click();
checks.reflectY = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practice = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
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
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    regions: {
      page: region(".abs141-page"),
      surface: region(".abs141-surface"),
      header: region(".abs141-surface>header"),
      tabs: region(".abs141-tabs"),
      layout: region(".abs141-layout"),
      graphPanel: region(".abs141-graph-panel"),
      graph: region(".abs141-graph"),
      controls: region(".abs141-controls"),
      lower: region(".abs141-lower"),
      distance: region(".abs141-distance"),
      sides: region(".abs141-sides"),
      footer: region(".abs141-surface>footer"),
    },
  };
});
const valid = (snapshot) => {
  const ea = Number(snapshot["effective-a"]),
    eh = Number(snapshot["effective-h"]),
    ek = Number(snapshot["effective-k"]),
    probe = Number(snapshot.probe);
  return (
    snapshot.vertex ===
      `${snapshot["effective-h"]},${snapshot["effective-k"]}` &&
    Math.abs(Number(snapshot.distance) - Math.abs(probe - eh)) < 0.001 &&
    Math.abs(
      Number(snapshot["probe-output"]) - (ea * Math.abs(probe - eh) + ek),
    ) < 0.011 &&
    snapshot.range ===
      (ea > 0
        ? `y>=${snapshot["effective-k"]}`
        : ea < 0
          ? `y<=${snapshot["effective-k"]}`
          : `y=${snapshot["effective-k"]}`)
  );
};
const passed =
  checks.initial.a === "1.25" &&
  checks.initial.h === "1" &&
  checks.initial.k === "-2" &&
  checks.initial.formula === "f(x) = 1.25|x − 1| − 2" &&
  checks.initial.vertex === "1,-2" &&
  checks.initial.piecewise === "-1.25x − 0.75@x<1;1.25x − 3.25@x>=1" &&
  valid(checks.initial) &&
  checks.scaleSlider.a !== "1.25" &&
  valid(checks.scaleSlider) &&
  checks.hSlider.h !== "1" &&
  valid(checks.hSlider) &&
  checks.kSlider.k !== "-2" &&
  valid(checks.kSlider) &&
  checks.vertexDrag["effective-h"] === "2" &&
  checks.vertexDrag["effective-k"] === "-1" &&
  valid(checks.vertexDrag) &&
  checks.vertexKeyboard["effective-h"] === "1.75" &&
  checks.vertexKeyboard["effective-k"] === "-1.25" &&
  checks.openingDrag["effective-a"] !== "1.25" &&
  valid(checks.openingDrag) &&
  Number(checks.openingKeyboard["effective-a"]) ===
    Number(checks.openingDrag["effective-a"]) - 0.25 &&
  checks.probeDrag.probe === "4" &&
  checks.probeDrag.distance === "3" &&
  checks.probeKeyboard.probe === "4.25" &&
  valid(checks.probeKeyboard) &&
  checks.reflectX.reflection === "x" &&
  checks.reflectX["effective-a"] === "-1.25" &&
  checks.reflectX["effective-k"] === "2" &&
  checks.reflectX.range === "y<=2" &&
  valid(checks.reflectX) &&
  checks.reflectY.reflection === "y" &&
  checks.reflectY["effective-h"] === "-1" &&
  checks.reflectY["effective-k"] === "-2" &&
  valid(checks.reflectY) &&
  checks.practice.a === "0.75" &&
  checks.practice.h === "2" &&
  checks.practice.k === "-1" &&
  valid(checks.practice) &&
  checks.reset.a === "1.25" &&
  checks.reset.h === "1" &&
  checks.reset.k === "-2" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0198-desktop.png") });
await copyFile(reference, path.join(out, "0198-reference.png"));
const report = {
  mockup: "0198",
  lessonId: 141,
  route: "/lessons/graphs-and-functions/141-absolute-value-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0198-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
