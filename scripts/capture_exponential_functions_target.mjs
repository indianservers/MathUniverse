import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0199-interactive-intermediate-advanced-functions-exponential-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/142-exponential-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1387, height: 1134 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0199");
await node.waitFor({ timeout: 600000 });
const names = [
  "a",
  "b",
  "k",
  "mode",
  "formula",
  "growth-formula",
  "decay-formula",
  "asymptote",
  "ratio",
  "growth-samples",
  "decay-samples",
  "active-samples",
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
await dragRange("Exponential base", 0.32, 0.12);
checks.baseSlider = await state();
await dragRange("Exponential initial value", 0.4, 0.12);
checks.initialSlider = await state();
await dragRange("Exponential asymptote", 0.5, 0.12);
checks.asymptoteSlider = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const graph = node.locator(".exp142-graph"),
  graphBox = await graph.boundingBox();
if (!graphBox) throw new Error("Exponential graph unavailable");
const dragPoint = async (name, deltaY) => {
  const point = node.getByRole("slider", { name }),
    box = await point.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + deltaY, { steps: 8 });
  await page.mouse.up();
  return point;
};
const initial = await dragPoint(
  "Drag exponential initial value",
  -graphBox.height * (44 / 380),
);
checks.initialDrag = await state();
await initial.focus();
await initial.press("ArrowDown");
checks.initialKeyboard = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const base = await dragPoint(
  "Drag exponential base point",
  -graphBox.height * (44 / 380),
);
checks.baseDrag = await state();
await base.focus();
await base.press("ArrowDown");
checks.baseKeyboard = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const asymptote = await dragPoint(
  "Drag exponential asymptote",
  -graphBox.height * (44 / 380),
);
checks.asymptoteDrag = await state();
await asymptote.focus();
await asymptote.press("ArrowDown");
checks.asymptoteKeyboard = await state();
await node.getByRole("button", { name: "Decay", exact: true }).click();
checks.decayMode = await state();
await node.getByRole("button", { name: "Examples", exact: true }).click();
checks.example = await state();
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
      page: region(".exp142-page"),
      intro: region(".exp142-intro"),
      tabs: region(".exp142-tabs"),
      lab: region(".exp142-lab"),
      main: region(".exp142-main"),
      graph: region(".exp142-graph"),
      outputTable: region(".exp142-output-table"),
      rail: region(".exp142-lab>aside"),
      controls: region(".exp142-controls"),
      concepts: region(".exp142-concepts"),
    },
  };
});
const parse = (value) =>
  value.split(";").map((pair) => pair.split(",").map(Number));
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    b = Number(snapshot.b),
    k = Number(snapshot.k),
    xs = [-2, -1, 0, 1, 2],
    growth = parse(snapshot["growth-samples"]),
    decay = parse(snapshot["decay-samples"]);
  return (
    growth.every(
      ([x, y], i) => x === xs[i] && Math.abs(y - (k + a * b ** x)) < 0.001,
    ) &&
    decay.every(
      ([x, y], i) =>
        x === xs[i] && Math.abs(y - (k + a * (1 / b) ** x)) < 0.001,
    ) &&
    snapshot.asymptote === `y=${snapshot.k}` &&
    Math.abs(
      Number(snapshot.ratio) - (snapshot.mode === "growth" ? b : 1 / b),
    ) < 0.001
  );
};
const passed =
  checks.initial.a === "1.5" &&
  checks.initial.b === "2" &&
  checks.initial.k === "0" &&
  checks.initial.formula === "f(x) = 1.5·2^x" &&
  checks.initial["growth-samples"] === "-2,0.375;-1,0.75;0,1.5;1,3;2,6" &&
  checks.initial["decay-samples"] === "-2,6;-1,3;0,1.5;1,0.75;2,0.375" &&
  valid(checks.initial) &&
  checks.baseSlider.b !== "2" &&
  valid(checks.baseSlider) &&
  checks.initialSlider.a !== "1.5" &&
  valid(checks.initialSlider) &&
  checks.asymptoteSlider.k !== "0" &&
  valid(checks.asymptoteSlider) &&
  checks.initialDrag.a === "2.5" &&
  valid(checks.initialDrag) &&
  checks.initialKeyboard.a === "2.25" &&
  checks.baseDrag.b !== "2" &&
  valid(checks.baseDrag) &&
  Number(checks.baseKeyboard.b) === Number(checks.baseDrag.b) - 0.1 &&
  checks.asymptoteDrag.k === "1" &&
  valid(checks.asymptoteDrag) &&
  checks.asymptoteKeyboard.k === "0.75" &&
  checks.decayMode.mode === "decay" &&
  checks.decayMode.ratio === String(1 / 2) &&
  checks.decayMode["active-samples"] === checks.decayMode["decay-samples"] &&
  valid(checks.decayMode) &&
  checks.example.a === "1" &&
  checks.example.b === "3" &&
  checks.example.k === "1" &&
  valid(checks.example) &&
  checks.reset.a === "1.5" &&
  checks.reset.b === "2" &&
  checks.reset.k === "0" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0199-desktop.png") });
await copyFile(reference, path.join(out, "0199-reference.png"));
const report = {
  mockup: "0199",
  lessonId: 142,
  route: "/lessons/graphs-and-functions/142-exponential-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0199-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
