import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0194-interactive-intermediate-advanced-functions-reciprocal-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/137-reciprocal-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 955, height: 1647 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0194");
await node.waitFor({ timeout: 600000 });
const names = [
    "a",
    "h",
    "formula",
    "vertical-asymptote",
    "horizontal-asymptote",
    "domain",
    "range",
    "samples",
    "center",
    "span",
    "tool",
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
await dragRange("Reciprocal scale", 0.5, 0.25);
checks.scaleSlider = await state();
await node
  .getByRole("button", { name: "Increase excluded reciprocal input" })
  .click();
checks.excludedStepper = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const graph = node.locator(".recip137-graph"),
  asymptote = node.getByRole("slider", {
    name: "Drag excluded reciprocal input",
  }),
  graphBox = await graph.boundingBox(),
  asymptoteBox = await asymptote.boundingBox();
if (!graphBox || !asymptoteBox)
  throw new Error("Reciprocal graph geometry unavailable");
let x = asymptoteBox.x + asymptoteBox.width / 2,
  y = asymptoteBox.y + asymptoteBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x + graphBox.width / 14, y, { steps: 8 });
await page.mouse.up();
checks.asymptoteDrag = await state();
await asymptote.focus();
await asymptote.press("ArrowLeft");
checks.asymptoteKeyboard = await state();
const scale = node.getByRole("slider", { name: "Drag reciprocal scale point" }),
  scaleBox = await scale.boundingBox();
if (!scaleBox) throw new Error("Reciprocal scale handle unavailable");
x = scaleBox.x + scaleBox.width / 2;
y = scaleBox.y + scaleBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (35 / 510), { steps: 8 });
await page.mouse.up();
checks.scaleDrag = await state();
await scale.focus();
await scale.press("ArrowDown");
checks.scaleKeyboard = await state();
await node.getByRole("button", { name: "Pan reciprocal graph" }).click();
const beforePan = await state();
x = graphBox.x + graphBox.width * 0.35;
y = graphBox.y + graphBox.height * 0.35;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x + graphBox.width / 7, y, { steps: 8 });
await page.mouse.up();
checks.pan = { before: beforePan, after: await state() };
await node.getByRole("button", { name: "Zoom in reciprocal graph" }).click();
checks.zoomIn = await state();
await node.getByRole("button", { name: "Zoom out reciprocal graph" }).click();
checks.zoomOut = await state();
await node.getByRole("button", { name: "Open practice" }).click();
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
      surface: region(".recip137-page"),
      intro: region(".recip137-intro"),
      tabs: region(".recip137-tabs"),
      body: region(".recip137-body"),
      lab: region(".recip137-lab"),
      graph: region(".recip137-graph"),
      rail: region(".recip137-rail"),
      navigation: region(".recip137-adjacent"),
      footer: region(".recip137-footer"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    h = Number(snapshot.h);
  return (
    snapshot.samples.split(";").every((pair) => {
      const [sx, sy] = pair.split(",").map(Number);
      return Math.abs(sy - a / (sx - h)) < 0.011;
    }) &&
    snapshot["vertical-asymptote"] === `x=${snapshot.h}` &&
    snapshot.domain === `x!=${snapshot.h}`
  );
};
const passed =
  checks.initial.a === "3" &&
  checks.initial.h === "1" &&
  checks.initial.formula === "f(x) = 3/(x − 1)" &&
  checks.initial.samples === "-2,-1;0,-3;2,3;4,1" &&
  valid(checks.initial) &&
  checks.scaleSlider.a !== "3" &&
  valid(checks.scaleSlider) &&
  checks.excludedStepper.h === "2" &&
  valid(checks.excludedStepper) &&
  checks.asymptoteDrag.h === "2" &&
  valid(checks.asymptoteDrag) &&
  checks.asymptoteKeyboard.h === "1" &&
  checks.scaleDrag.a !== "3" &&
  valid(checks.scaleDrag) &&
  Number(checks.scaleKeyboard.a) === Number(checks.scaleDrag.a) - 0.25 &&
  checks.pan.before.center !== checks.pan.after.center &&
  checks.pan.after.tool === "pan" &&
  Number(checks.zoomIn.span) === Number(checks.pan.after.span) - 1 &&
  checks.zoomOut.span === checks.pan.after.span &&
  checks.practice.a === "2" &&
  checks.practice.h === "-3" &&
  checks.practice.practice === "true" &&
  checks.practice.formula === "f(x) = 2/(x + 3)" &&
  valid(checks.practice) &&
  checks.reset.a === "3" &&
  checks.reset.h === "1" &&
  checks.reset.span === "7" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0194-desktop.png") });
await copyFile(reference, path.join(out, "0194-reference.png"));
const report = {
  mockup: "0194",
  lessonId: 137,
  route: "/lessons/graphs-and-functions/137-reciprocal-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0194-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
