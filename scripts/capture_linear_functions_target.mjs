import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0190-interactive-intermediate-advanced-functions-linear-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/133-linear-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 937, height: 1678 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0190");
await node.waitFor({ timeout: 600000 });
const names = ["slope", "intercept", "formula", "rise", "samples", "actions"],
  state = () =>
    node.evaluate(
      (element, attrs) =>
        Object.fromEntries(
          attrs.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      names,
    ),
  checks = { initial: await state() };
const dragRange = async (locator, startFraction, delta) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Range has no box");
  const x = box.x + box.width * startFraction,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
await dragRange(
  node.getByRole("slider", { name: "Linear slope", exact: true }),
  0.65,
  0.15,
);
checks.slopeSlider = await state();
await dragRange(
  node.getByRole("slider", { name: "Linear intercept", exact: true }),
  0.6,
  0.1,
);
checks.interceptSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.dragBaseline = await state();
const graph = node.locator(".lin133-graph"),
  intercept = node.getByRole("slider", { name: "Drag linear intercept" }),
  graphBox = await graph.boundingBox(),
  interceptBox = await intercept.boundingBox();
if (!graphBox || !interceptBox)
  throw new Error("Linear graph geometry unavailable");
let x = interceptBox.x + interceptBox.width / 2,
  y = interceptBox.y + interceptBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (43 / 520), { steps: 8 });
await page.mouse.up();
checks.interceptDrag = await state();
await intercept.focus();
await intercept.press("ArrowDown");
checks.interceptKeyboard = await state();
const slopePoint = node.getByRole("slider", {
    name: "Drag linear slope point",
  }),
  slopeBox = await slopePoint.boundingBox();
if (!slopeBox) throw new Error("Slope handle unavailable");
x = slopeBox.x + slopeBox.width / 2;
y = slopeBox.y + slopeBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (21.5 / 520), { steps: 8 });
await page.mouse.up();
checks.slopeDrag = await state();
await slopePoint.focus();
await slopePoint.press("ArrowUp");
checks.slopeKeyboard = await state();
await node.getByRole("button", { name: "Examples", exact: true }).click();
checks.example = await state();
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
      surface: region(".lin133-page"),
      intro: region(".lin133-intro"),
      tabs: region(".lin133-tabs"),
      lab: region(".lin133-lab"),
      layout: region(".lin133-layout"),
      graph: region(".lin133-layout>main"),
      rail: region(".lin133-layout>aside"),
      understand: region(".lin133-understand"),
      lower: region(".lin133-lower"),
      navigation: region(".lin133-adjacent"),
      footer: region(".lin133-footer"),
    },
  };
});
const valid = (snapshot) =>
  Number(snapshot.rise) === Number(snapshot.slope) * 2 &&
  snapshot.samples.split(";").every((pair) => {
    const [x, y] = pair.split(",").map(Number);
    return (
      Math.abs(y - (Number(snapshot.slope) * x + Number(snapshot.intercept))) <
      0.001
    );
  });
const passed =
  checks.initial.slope === "1.5" &&
  checks.initial.intercept === "1" &&
  checks.initial.formula === "y = 1.5x + 1" &&
  checks.initial.rise === "3" &&
  checks.initial.samples === "-2,-2;0,1;2,4" &&
  checks.slopeSlider.slope !== checks.initial.slope &&
  valid(checks.slopeSlider) &&
  checks.interceptSlider.intercept !== checks.slopeSlider.intercept &&
  valid(checks.interceptSlider) &&
  checks.dragBaseline.slope === "1.5" &&
  checks.interceptDrag.intercept !== "1" &&
  valid(checks.interceptDrag) &&
  Number(checks.interceptKeyboard.intercept) ===
    Number(checks.interceptDrag.intercept) - 0.5 &&
  valid(checks.interceptKeyboard) &&
  checks.slopeDrag.slope !== "1.5" &&
  valid(checks.slopeDrag) &&
  Number(checks.slopeKeyboard.slope) ===
    Number(checks.slopeDrag.slope) + 0.25 &&
  checks.example.slope === "-2" &&
  checks.example.intercept === "3" &&
  checks.example.samples === "-2,7;0,3;2,-1" &&
  checks.reset.slope === "1.5" &&
  checks.reset.intercept === "1" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0190-desktop.png") });
await copyFile(reference, path.join(out, "0190-reference.png"));
const report = {
  mockup: "0190",
  lessonId: 133,
  route: "/lessons/graphs-and-functions/133-linear-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0190-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(report.passed ? 0 : 1);
