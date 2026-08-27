import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0195-interactive-intermediate-advanced-functions-rational-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/138-rational-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 925, height: 1700 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0195");
await node.waitFor({ timeout: 600000 });
const names = [
    "a",
    "h",
    "root",
    "formula",
    "feature",
    "restriction",
    "vertical-asymptote",
    "hole",
    "long-run",
    "samples",
    "practice",
    "actions",
  ],
  state = () =>
    node.evaluate(
      (element, attrs) =>
        Object.fromEntries(
          attrs.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      names,
    ),
  checks = { initial: await state() };
const dragRange = async (name, from, delta) => {
  const slider = node.getByRole("slider", { name, exact: true }),
    box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width * from,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
await dragRange("Rational numerator scale", 0.6, 0.1);
checks.scaleSlider = await state();
await dragRange("Rational restricted input", 0.55, 0.1);
checks.restrictionSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const graph = node.locator(".rational138-graph"),
  restriction = node.getByRole("slider", {
    name: "Drag rational restricted input",
  }),
  graphBox = await graph.boundingBox(),
  restrictionBox = await restriction.boundingBox();
if (!graphBox || !restrictionBox)
  throw new Error("Rational graph geometry unavailable");
let x = restrictionBox.x + restrictionBox.width / 2,
  y = restrictionBox.y + restrictionBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x + graphBox.width * (27 / 350), y, { steps: 8 });
await page.mouse.up();
checks.restrictionDrag = await state();
await restriction.focus();
await restriction.press("ArrowLeft");
checks.restrictionKeyboard = await state();
const scale = node.getByRole("slider", {
    name: "Drag rational numerator scale point",
  }),
  scaleBox = await scale.boundingBox();
if (!scaleBox) throw new Error("Rational scale point unavailable");
x = scaleBox.x + scaleBox.width / 2;
y = scaleBox.y + scaleBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (42 / 540), { steps: 8 });
await page.mouse.up();
checks.scaleDrag = await state();
await scale.focus();
await scale.press("ArrowDown");
checks.scaleKeyboard = await state();
await restriction.focus();
for (let index = 0; index < 3; index += 1) await restriction.press("ArrowLeft");
checks.hole = await state();
await node
  .getByRole("button", { name: /Practice Try another example/ })
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
      surface: region(".rational138-page"),
      intro: region(".rational138-intro"),
      tabs: region(".rational138-tabs"),
      lab: region(".rational138-lab"),
      layout: region(".rational138-layout"),
      graphPanel: region(".rational138-graph-panel"),
      graph: region(".rational138-graph"),
      rail: region(".rational138-layout>aside"),
      navigation: region(".rational138-adjacent"),
      footer: region(".rational138-footer"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    h = Number(snapshot.h),
    r = Number(snapshot.root),
    hole = snapshot.feature === "hole";
  return (
    snapshot.samples.split(";").every((pair) => {
      const [sx, text] = pair.split(",");
      if (Number(sx) === h) return text === "undefined";
      const expected = hole ? a : (a * (Number(sx) - r)) / (Number(sx) - h);
      return Math.abs(Number(text) - expected) < 0.011;
    }) && snapshot["long-run"] === `y=${snapshot.a}`
  );
};
const passed =
  checks.initial.a === "1" &&
  checks.initial.h === "1" &&
  checks.initial.root === "-2" &&
  checks.initial.formula === "f(x) = (x + 2)/(x − 1)" &&
  checks.initial.feature === "vertical-asymptote" &&
  checks.initial.samples === "-2,0;0,-2;2,4" &&
  valid(checks.initial) &&
  checks.scaleSlider.a !== "1" &&
  valid(checks.scaleSlider) &&
  checks.restrictionSlider.h !== "1" &&
  valid(checks.restrictionSlider) &&
  checks.restrictionDrag.h === "2" &&
  valid(checks.restrictionDrag) &&
  checks.restrictionKeyboard.h === "1" &&
  checks.scaleDrag.a !== "1" &&
  valid(checks.scaleDrag) &&
  Number(checks.scaleKeyboard.a) === Number(checks.scaleDrag.a) - 0.25 &&
  checks.hole.h === "-2" &&
  checks.hole.feature === "hole" &&
  checks.hole["vertical-asymptote"] === "none" &&
  checks.hole.hole === `-2,${checks.hole.a}` &&
  valid(checks.hole) &&
  checks.practice.a === "1" &&
  checks.practice.root === "3" &&
  checks.practice.h === "-2" &&
  checks.practice.formula === "f(x) = (x − 3)/(x + 2)" &&
  checks.practice.practice === "true" &&
  valid(checks.practice) &&
  checks.reset.a === "1" &&
  checks.reset.h === "1" &&
  checks.reset.root === "-2" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0195-desktop.png") });
await copyFile(reference, path.join(out, "0195-reference.png"));
const report = {
  mockup: "0195",
  lessonId: 138,
  route: "/lessons/graphs-and-functions/138-rational-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0195-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
