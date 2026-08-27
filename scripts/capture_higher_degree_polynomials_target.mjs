import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0193-interactive-intermediate-advanced-functions-higher-degree-polynomials-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/136-higher-degree-polynomials";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 966, height: 1629 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0193");
await node.waitFor({ timeout: 600000 });
const names = [
  "moving-root",
  "shift",
  "degree",
  "formula",
  "roots",
  "factor-roots",
  "multiplicities",
  "turns",
  "behavior",
  "signs",
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
  const slider = node.getByRole("slider", { name });
  const box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width * from,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
await dragRange("Higher-degree moving root", 0.5, 0.25);
checks.rootSlider = await state();
await dragRange("Higher-degree vertical shift", 0.5, 0.1);
checks.shiftSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const graph = node.locator(".poly136-graph");
const handle = node.getByRole("slider", {
  name: "Drag moving polynomial root",
});
const graphBox = await graph.boundingBox(),
  handleBox = await handle.boundingBox();
if (!graphBox || !handleBox)
  throw new Error("Polynomial graph geometry unavailable");
let x = handleBox.x + handleBox.width / 2,
  y = handleBox.y + handleBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x + graphBox.width * (38.5 / 430), y, { steps: 8 });
await page.mouse.up();
checks.rootDrag = await state();
await handle.focus();
await handle.press("ArrowLeft");
checks.rootKeyboard = await state();
for (let index = 0; index < 5; index += 1) await handle.press("ArrowLeft");
checks.doubleRoot = await state();
await node.getByRole("button", { name: "Open Practice" }).click();
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
      surface: region(".poly136-page"),
      intro: region(".poly136-intro"),
      tabs: region(".poly136-tabs"),
      lab: region(".poly136-lab"),
      workspace: region(".poly136-workspace"),
      graph: region(".poly136-graph"),
      rail: region(".poly136-workspace>aside"),
      labFooter: region(".poly136-lab>footer"),
      navigation: region(".poly136-adjacent"),
      footer: region(".poly136-footer"),
    },
  };
});
const sampleValid = (snapshot) => {
  const roots = snapshot["factor-roots"].split(",").map(Number),
    shift = Number(snapshot.shift),
    scale = Number(snapshot.degree) === 3 ? 0.2 : 0.08;
  return snapshot.samples.split(";").every((pair) => {
    const [sx, sy] = pair.split(",").map(Number);
    const expected =
      roots.reduce((value, root) => value * (sx - root), scale) + shift;
    return Math.abs(expected - sy) < 0.011;
  });
};
const passed =
  checks.initial["moving-root"] === "4" &&
  checks.initial.shift === "0" &&
  checks.initial.degree === "4" &&
  checks.initial["factor-roots"] === "-2,1,3,4" &&
  checks.initial.multiplicities === "-2:1,1:1,3:1,4:1" &&
  checks.initial.behavior === "both-rise" &&
  checks.initial.samples === "-2,0;0,-1.92;2,0.64" &&
  sampleValid(checks.initial) &&
  checks.rootSlider["moving-root"] !== "4" &&
  sampleValid(checks.rootSlider) &&
  checks.shiftSlider.shift !== "0" &&
  checks.shiftSlider.roots !== checks.rootSlider.roots &&
  sampleValid(checks.shiftSlider) &&
  Number(checks.rootDrag["moving-root"]) > 4 &&
  sampleValid(checks.rootDrag) &&
  Number(checks.rootKeyboard["moving-root"]) ===
    Number(checks.rootDrag["moving-root"]) - 0.25 &&
  checks.doubleRoot.multiplicities.includes("3:2") &&
  checks.practice.practice === "true" &&
  checks.practice.degree === "3" &&
  checks.practice["factor-roots"] === "-2,1,1" &&
  checks.practice.multiplicities === "-2:1,1:2" &&
  checks.practice.behavior === "left-down,right-up" &&
  sampleValid(checks.practice) &&
  checks.reset["moving-root"] === "4" &&
  checks.reset.practice === "false" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0193-desktop.png") });
await copyFile(reference, path.join(out, "0193-reference.png"));
const report = {
  mockup: "0193",
  lessonId: 136,
  route: "/lessons/graphs-and-functions/136-higher-degree-polynomials",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0193-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
