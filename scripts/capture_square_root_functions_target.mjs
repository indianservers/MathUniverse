import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0196-interactive-intermediate-advanced-functions-square-root-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/139-square-root-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 910, height: 1728 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0196");
await node.waitFor({ timeout: 600000 });
const names = [
  "a",
  "h",
  "formula",
  "endpoint",
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
await dragRange("Square-root vertical scale", 0.75, -0.1);
checks.scaleSlider = await state();
await dragRange("Square-root domain start", 0.5, 0.1);
checks.domainSlider = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const graph = node.locator(".root139-graph");
const endpoint = node.getByRole("slider", {
  name: "Drag square-root endpoint",
});
const graphBox = await graph.boundingBox();
const endpointBox = await endpoint.boundingBox();
if (!graphBox || !endpointBox)
  throw new Error("Square-root graph geometry unavailable");
let x = endpointBox.x + endpointBox.width / 2;
let y = endpointBox.y + endpointBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x + graphBox.width * (46 / 430), y, { steps: 8 });
await page.mouse.up();
checks.endpointDrag = await state();
await endpoint.focus();
await endpoint.press("ArrowLeft");
checks.endpointKeyboard = await state();
const scale = node.getByRole("slider", {
  name: "Drag square-root scale point",
});
const scaleBox = await scale.boundingBox();
if (!scaleBox) throw new Error("Square-root scale point unavailable");
x = scaleBox.x + scaleBox.width / 2;
y = scaleBox.y + scaleBox.height / 2;
await page.mouse.move(x, y);
await page.mouse.down();
await page.mouse.move(x, y - graphBox.height * (27.5 / 455), { steps: 8 });
await page.mouse.up();
checks.scaleDrag = await state();
await scale.focus();
await scale.press("ArrowDown");
checks.scaleKeyboard = await state();
await node
  .getByRole("button", { name: "Practice Try another example" })
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
      surface: region(".root139-page"),
      intro: region(".root139-intro"),
      tabs: region(".root139-tabs"),
      lab: region(".root139-lab"),
      explorer: region(".root139-explorer"),
      graph: region(".root139-graph"),
      why: region(".root139-why"),
      bottom: region(".root139-bottom"),
      navigation: region(".root139-adjacent"),
      footer: region(".root139-footer"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    h = Number(snapshot.h);
  return (
    snapshot.endpoint === `${snapshot.h},0` &&
    snapshot.domain === `x>=${snapshot.h}` &&
    snapshot.range === (a >= 0 ? "y>=0" : "y<=0") &&
    snapshot.samples.split(";").every((pair, index) => {
      const [sx, sy] = pair.split(",").map(Number);
      const offset = [0, 1, 4][index];
      return (
        Math.abs(sx - (h + offset)) < 0.001 &&
        Math.abs(sy - a * Math.sqrt(offset)) < 0.011
      );
    })
  );
};
const passed =
  checks.initial.a === "1.5" &&
  checks.initial.h === "1" &&
  checks.initial.formula === "f(x) = 1.5√(x − 1)" &&
  checks.initial.samples === "1,0;2,1.5;5,3" &&
  valid(checks.initial) &&
  checks.scaleSlider.a !== "1.5" &&
  valid(checks.scaleSlider) &&
  checks.domainSlider.h !== "1" &&
  valid(checks.domainSlider) &&
  checks.endpointDrag.h === "2" &&
  valid(checks.endpointDrag) &&
  checks.endpointKeyboard.h === "1.75" &&
  checks.scaleDrag.a !== "1.5" &&
  valid(checks.scaleDrag) &&
  Number(checks.scaleKeyboard.a) === Number(checks.scaleDrag.a) - 0.25 &&
  checks.practice.a === "2" &&
  checks.practice.h === "-3" &&
  checks.practice.formula === "f(x) = 2√(x + 3)" &&
  checks.practice.practice === "true" &&
  valid(checks.practice) &&
  checks.reset.a === "1.5" &&
  checks.reset.h === "1" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0196-desktop.png") });
await copyFile(reference, path.join(out, "0196-reference.png"));
const report = {
  mockup: "0196",
  lessonId: 139,
  route: "/lessons/graphs-and-functions/139-square-root-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0196-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
