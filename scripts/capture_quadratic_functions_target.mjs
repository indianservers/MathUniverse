import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0191-interactive-intermediate-advanced-functions-quadratic-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/134-quadratic-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 948, height: 1659 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0191");
await node.waitFor({ timeout: 600000 });
const names = [
    "a",
    "h",
    "k",
    "vertex",
    "formula",
    "direction",
    "samples",
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
  node.getByRole("slider", { name: "Quadratic opening scale" }),
  0.23,
  0.2,
);
checks.aSlider = await state();
await dragRange(
  node.getByRole("slider", { name: "Quadratic vertex x" }),
  0.6,
  0.1,
);
checks.hSlider = await state();
await dragRange(
  node.getByRole("slider", { name: "Quadratic vertical shift" }),
  0.3,
  0.1,
);
checks.kSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.dragBaseline = await state();
const graph = node.locator(".quad134-graph"),
  vertex = node.getByRole("slider", { name: "Drag quadratic vertex" }),
  graphBox = await graph.boundingBox(),
  vertexBox = await vertex.boundingBox();
if (!graphBox || !vertexBox)
  throw new Error("Quadratic graph geometry unavailable");
let x = vertexBox.x + vertexBox.width / 2,
  y = vertexBox.y + vertexBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(
  x + graphBox.width * (42 / 430),
  y - graphBox.height * (48 / 470),
  { steps: 8 },
);
await page.mouse.up();
checks.vertexDrag = await state();
await vertex.focus();
await vertex.press("ArrowLeft");
await vertex.press("ArrowDown");
checks.vertexKeyboard = await state();
const opening = node.getByRole("slider", {
    name: "Drag quadratic opening point",
  }),
  openingBox = await opening.boundingBox();
if (!openingBox) throw new Error("Quadratic opening handle unavailable");
x = openingBox.x + openingBox.width / 2;
y = openingBox.y + openingBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (48 / 470), { steps: 8 });
await page.mouse.up();
checks.openingDrag = await state();
await opening.focus();
await opening.press("ArrowDown");
checks.openingKeyboard = await state();
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
      surface: region(".quad134-page"),
      intro: region(".quad134-intro"),
      tabs: region(".quad134-tabs"),
      lab: region(".quad134-lab"),
      layout: region(".quad134-layout"),
      graph: region(".quad134-layout>main"),
      rail: region(".quad134-layout>aside"),
      lower: region(".quad134-lower"),
      reason: region(".quad134-reason"),
      tip: region(".quad134-lab>footer"),
      navigation: region(".quad134-adjacent"),
      footer: region(".quad134-footer"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    h = Number(snapshot.h),
    k = Number(snapshot.k);
  return (
    snapshot.vertex === `${snapshot.h},${snapshot.k}` &&
    snapshot.samples.split(";").every((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return Math.abs(y - (a * (x - h) ** 2 + k)) < 0.011;
    })
  );
};
const passed =
  checks.initial.a === "0.75" &&
  checks.initial.h === "1" &&
  checks.initial.k === "-2" &&
  checks.initial.vertex === "1,-2" &&
  checks.initial.formula === "f(x) = 0.75(x − 1)² − 2" &&
  checks.initial.samples === "-2,4.75;0,-1.25;1,-2;2,-1.25" &&
  checks.aSlider.a !== "0.75" &&
  valid(checks.aSlider) &&
  checks.hSlider.h !== "1" &&
  valid(checks.hSlider) &&
  checks.kSlider.k !== "-2" &&
  valid(checks.kSlider) &&
  checks.vertexDrag.vertex !== "1,-2" &&
  valid(checks.vertexDrag) &&
  checks.vertexKeyboard.h !== checks.vertexDrag.h &&
  checks.vertexKeyboard.k !== checks.vertexDrag.k &&
  valid(checks.vertexKeyboard) &&
  checks.openingDrag.a !== checks.vertexKeyboard.a &&
  valid(checks.openingDrag) &&
  Number(checks.openingKeyboard.a) === Number(checks.openingDrag.a) - 0.25 &&
  checks.example.a === "2" &&
  checks.example.h === "-1" &&
  checks.example.k === "3" &&
  checks.example.vertex === "-1,3" &&
  checks.reset.vertex === "1,-2" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0191-desktop.png") });
await copyFile(reference, path.join(out, "0191-reference.png"));
const report = {
  mockup: "0191",
  lessonId: 134,
  route: "/lessons/graphs-and-functions/134-quadratic-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0191-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(report.passed ? 0 : 1);
