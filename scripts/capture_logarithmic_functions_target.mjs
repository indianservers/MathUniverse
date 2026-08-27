import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0200-interactive-intermediate-advanced-functions-logarithmic-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/143-logarithmic-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0200");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "a",
  "b",
  "h",
  "k",
  "equation",
  "domain",
  "asymptote",
  "target-matched",
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

const dragRange = async (name, delta) => {
  const slider = node.getByRole("slider", { name, exact: true });
  const box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
for (const [name, key] of [
  ["Base b", "baseSlider"],
  ["Stretch a", "scaleSlider"],
  ["Shift h", "hSlider"],
  ["Shift k", "kSlider"],
]) {
  await dragRange(name, 0.12);
  checks[key] = await state();
}

const reload = async () => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await node.waitFor();
};
const dragHandle = async (name, dx, dy) => {
  const handle = node.getByRole("slider", { name, exact: true });
  const box = await handle.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 9 });
  await page.mouse.up();
  return handle;
};
await reload();
const asymptote = await dragHandle(
  "Drag logarithmic vertical asymptote",
  60,
  0,
);
checks.asymptoteDrag = await state();
await asymptote.press("ArrowLeft");
checks.asymptoteKeyboard = await state();
await reload();
const anchor = await dragHandle("Drag logarithmic anchor point", 0, -40);
checks.anchorDrag = await state();
await anchor.press("ArrowDown");
checks.anchorKeyboard = await state();
await reload();
const scale = await dragHandle("Drag logarithmic scale point", 0, -40);
checks.scaleDrag = await state();
await scale.press("ArrowDown");
checks.scaleKeyboard = await state();
await node
  .getByRole("button", { name: "Hide inverse exponential", exact: true })
  .click();
checks.inverseHidden = await node.locator(".inverse-curve").count();
await node.getByRole("button", { name: "Show Solution", exact: true }).click();
await node.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.challenge = await state();
checks.solutionVisible = await node
  .getByText("Solution loaded into the live graph.", { exact: true })
  .isVisible();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
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
    regions: {
      page: region(".log143-page"),
      title: region(".log143-titlebar"),
      tabs: region(".log143-tabs"),
      graph: region(".log143-graph"),
      table: region(".log143-table"),
      rail: region(".log143-rail"),
      challenge: region(".log143-challenge"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.a),
    b = Number(snapshot.b),
    h = Number(snapshot.h),
    k = Number(snapshot.k);
  const samples = snapshot.samples
    .split(";")
    .map((pair) => pair.split(",").map(Number));
  return (
    snapshot.domain === `x>${snapshot.h}` &&
    snapshot.asymptote === `x=${snapshot.h}` &&
    samples.every(
      ([x, y]) =>
        x > h &&
        Math.abs(y - (k + (a * Math.log(x - h)) / Math.log(b))) < 0.02,
    )
  );
};
const passed =
  checks.initial.a === "2" &&
  checks.initial.b === "2" &&
  checks.initial.h === "1" &&
  checks.initial.k === "1" &&
  valid(checks.initial) &&
  [
    "baseSlider",
    "scaleSlider",
    "hSlider",
    "kSlider",
    "asymptoteDrag",
    "asymptoteKeyboard",
    "anchorDrag",
    "anchorKeyboard",
    "scaleDrag",
    "scaleKeyboard",
  ].every((key) => valid(checks[key])) &&
  checks.inverseHidden === 0 &&
  checks.challenge["target-matched"] === "true" &&
  checks.solutionVisible &&
  checks.reset.equation === checks.initial.equation &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0200-desktop.png") });
await copyFile(reference, path.join(out, "0200-reference.png"));
const report = {
  mockup: "0200",
  lessonId: 143,
  route: "/lessons/graphs-and-functions/143-logarithmic-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0200-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
