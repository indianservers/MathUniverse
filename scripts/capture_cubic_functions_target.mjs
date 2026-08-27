import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0192-interactive-intermediate-advanced-functions-cubic-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/135-cubic-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 969, height: 1623 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0192");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "a",
  "h",
  "k",
  "inflection",
  "formula",
  "direction",
  "symmetry",
  "samples",
  "actions",
];
const state = () =>
  node.evaluate(
    (element, names) =>
      Object.fromEntries(
        names.map((name) => [name, element.getAttribute(`data-${name}`)]),
      ),
    attrs,
  );
const checks = { initial: await state() };
const dragRange = async (name, from, delta) => {
  const slider = node.getByRole("slider", { name });
  const box = await slider.boundingBox();
  if (!box) throw new Error(`${name} has no box`);
  const x = box.x + box.width * from,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
await dragRange("Cubic bend strength", 0.67, 0.15);
checks.aSlider = await state();
await dragRange("Cubic center shift", 0.5, 0.13);
checks.hSlider = await state();
await dragRange("Cubic vertical shift", 0.5, 0.1);
checks.kSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const graph = node.locator(".cubic135-graph");
const center = node.getByRole("slider", {
  name: "Drag cubic inflection point",
});
const graphBox = await graph.boundingBox(),
  centerBox = await center.boundingBox();
if (!graphBox || !centerBox)
  throw new Error("Cubic graph geometry unavailable");
let x = centerBox.x + centerBox.width / 2,
  y = centerBox.y + centerBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(
  x + graphBox.width * (66 / 448),
  y - graphBox.height * (15 / 500),
  { steps: 8 },
);
await page.mouse.up();
checks.inflectionDrag = await state();
await center.focus();
await center.press("ArrowLeft");
await center.press("ArrowDown");
checks.inflectionKeyboard = await state();
const bend = node.getByRole("slider", { name: "Drag cubic bend point" });
const bendBox = await bend.boundingBox();
if (!bendBox) throw new Error("Cubic bend handle unavailable");
x = bendBox.x + bendBox.width / 2;
y = bendBox.y + bendBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (15 / 500), { steps: 8 });
await page.mouse.up();
checks.bendDrag = await state();
await bend.focus();
await bend.press("ArrowDown");
checks.bendKeyboard = await state();
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
      surface: region(".cubic135-page"),
      intro: region(".cubic135-intro"),
      tabs: region(".cubic135-tabs"),
      lab: region(".cubic135-lab"),
      layout: region(".cubic135-layout"),
      graph: region(".cubic135-layout>main"),
      rail: region(".cubic135-layout>aside"),
      lower: region(".cubic135-lower"),
      navigation: region(".cubic135-adjacent"),
      footer: region(".cubic135-footer"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    h = Number(snapshot.h),
    k = Number(snapshot.k);
  return (
    snapshot.inflection === `${snapshot.h},${snapshot.k}` &&
    snapshot.samples.split(";").every((pair) => {
      const [sx, sy] = pair.split(",").map(Number);
      return Math.abs(sy - (a * (sx - h) ** 3 + k)) < 0.011;
    })
  );
};
const passed =
  checks.initial.a === "1" &&
  checks.initial.h === "0" &&
  checks.initial.k === "0" &&
  checks.initial.inflection === "0,0" &&
  checks.initial.samples === "-2,-8;-1,-1;0,0;1,1;2,8" &&
  checks.initial.direction === "down-left,up-right" &&
  checks.initial.symmetry === "origin" &&
  checks.aSlider.a !== "1" &&
  valid(checks.aSlider) &&
  checks.hSlider.h !== "0" &&
  valid(checks.hSlider) &&
  checks.kSlider.k !== "0" &&
  valid(checks.kSlider) &&
  checks.inflectionDrag.inflection !== "0,0" &&
  valid(checks.inflectionDrag) &&
  checks.inflectionKeyboard.inflection === "0,0" &&
  checks.bendDrag.a !== "1" &&
  valid(checks.bendDrag) &&
  checks.bendKeyboard.a !== checks.bendDrag.a &&
  valid(checks.bendKeyboard) &&
  checks.example.a === "-1" &&
  checks.example.h === "1" &&
  checks.example.k === "2" &&
  checks.example.direction === "up-left,down-right" &&
  checks.reset.inflection === "0,0" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0192-desktop.png") });
await copyFile(reference, path.join(out, "0192-reference.png"));
const report = {
  mockup: "0192",
  lessonId: 135,
  route: "/lessons/graphs-and-functions/135-cubic-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0192-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(report.passed ? 0 : 1);
