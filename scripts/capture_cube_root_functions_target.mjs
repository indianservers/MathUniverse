import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0197-interactive-intermediate-advanced-functions-cube-root-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/140-cube-root-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 955, height: 1647 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0197");
await node.waitFor({ timeout: 600000 });
const names = [
  "a",
  "b",
  "k",
  "formula",
  "center",
  "domain",
  "range",
  "samples",
  "practice",
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
  const x = box.x + box.width * from;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
await dragRange("Cube-root vertical scale", 0.75, -0.1);
checks.scaleSlider = await state();
await dragRange("Cube-root center shift", 0.5, 0.1);
checks.centerSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const graph = node.locator(".cube140-graph");
const center = node.getByRole("slider", { name: "Drag cube-root center" });
const graphBox = await graph.boundingBox();
const centerBox = await center.boundingBox();
if (!graphBox || !centerBox)
  throw new Error("Cube-root graph geometry unavailable");
let x = centerBox.x + centerBox.width / 2;
let y = centerBox.y + centerBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(
  x + graphBox.width * (23 / 480),
  y - graphBox.height * (23 / 500),
  { steps: 8 },
);
await page.mouse.up();
checks.centerDrag = await state();
await center.focus();
await center.press("ArrowLeft");
await center.press("ArrowDown");
checks.centerKeyboard = await state();
const scale = node.getByRole("slider", { name: "Drag cube-root scale point" });
const scaleBox = await scale.boundingBox();
if (!scaleBox) throw new Error("Cube-root scale point unavailable");
x = scaleBox.x + scaleBox.width / 2;
y = scaleBox.y + scaleBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (23 / 500), { steps: 8 });
await page.mouse.up();
checks.scaleDrag = await state();
await scale.focus();
await scale.press("ArrowDown");
checks.scaleKeyboard = await state();
await node
  .getByRole("button", { name: "Practice shifted cube-root example" })
  .click();
checks.practice = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
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
      surface: region(".cube140-page"),
      intro: region(".cube140-intro"),
      tabs: region(".cube140-tabs"),
      lab: region(".cube140-lab"),
      layout: region(".cube140-layout"),
      graphPanel: region(".cube140-graph-panel"),
      graph: region(".cube140-graph"),
      rail: region(".cube140-layout>aside"),
      understand: region(".cube140-understand"),
      bottom: region(".cube140-bottom"),
      navigation: region(".cube140-adjacent"),
      footer: region(".cube140-footer"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    b = Number(snapshot.b),
    k = Number(snapshot.k);
  const offsets = [-8, -1, 0, 1, 2, 8];
  return (
    snapshot.center === `${snapshot.b},${snapshot.k}` &&
    snapshot.domain === "all-real" &&
    snapshot.range === (a === 0 ? `y=${snapshot.k}` : "all-real") &&
    snapshot.samples.split(";").every((pair, index) => {
      const [sx, sy] = pair.split(",").map(Number);
      return (
        Math.abs(sx - (b + offsets[index])) < 0.001 &&
        Math.abs(sy - (k + a * Math.cbrt(offsets[index]))) < 0.011
      );
    })
  );
};
const passed =
  checks.initial.a === "2" &&
  checks.initial.b === "0" &&
  checks.initial.k === "0" &&
  checks.initial.formula === "f(x) = 2∛(x)" &&
  checks.initial.samples === "-8,-4;-1,-2;0,0;1,2;2,2.52;8,4" &&
  valid(checks.initial) &&
  checks.scaleSlider.a !== "2" &&
  valid(checks.scaleSlider) &&
  checks.centerSlider.b !== "0" &&
  valid(checks.centerSlider) &&
  checks.centerDrag.b === "1" &&
  checks.centerDrag.k === "1" &&
  valid(checks.centerDrag) &&
  checks.centerKeyboard.b === "0.75" &&
  checks.centerKeyboard.k === "0.75" &&
  valid(checks.centerKeyboard) &&
  checks.scaleDrag.a !== "2" &&
  valid(checks.scaleDrag) &&
  Number(checks.scaleKeyboard.a) === Number(checks.scaleDrag.a) - 0.25 &&
  checks.practice.a === "1" &&
  checks.practice.b === "3" &&
  checks.practice.k === "1" &&
  checks.practice.formula === "f(x) = ∛(x − 3) + 1" &&
  checks.practice.practice === "true" &&
  valid(checks.practice) &&
  checks.reset.a === "2" &&
  checks.reset.b === "0" &&
  checks.reset.k === "0" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0197-desktop.png") });
await copyFile(reference, path.join(out, "0197-reference.png"));
const report = {
  mockup: "0197",
  lessonId: 140,
  route: "/lessons/graphs-and-functions/140-cube-root-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0197-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
