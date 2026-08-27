import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const TAU = Math.PI * 2;
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0201-interactive-intermediate-advanced-functions-trigonometric-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/144-trigonometric-functions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
  acceptDownloads: true,
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0201");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "amplitude",
  "period",
  "phase",
  "midline",
  "theta",
  "sine",
  "cosine",
  "transformed-sine",
  "transformed-cosine",
  "sine-formula",
  "cosine-formula",
  "choice",
  "correct",
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
  const slider = node.getByRole("slider", { name, exact: true }),
    box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 8 });
  await page.mouse.up();
};
for (const [name, key, delta] of [
  ["Amplitude", "amplitudeSlider", 0.18],
  ["Period", "periodSlider", 0.12],
  ["Phase shift", "phaseSlider", 0.12],
  ["Midline y", "midlineSlider", 0.18],
]) {
  await dragRange(name, delta);
  checks[key] = await state();
}

const reload = async () => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await node.waitFor();
};
const dragHandle = async (name, dx, dy) => {
  const handle = node.getByRole("slider", { name, exact: true }),
    box = await handle.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 10 });
  await page.mouse.up();
  return handle;
};
await reload();
const angle = await dragHandle("Drag unit-circle angle", -60, -10);
checks.angleDrag = await state();
await angle.focus();
await angle.press("ArrowLeft");
checks.angleKeyboard = await state();
await reload();
const amplitude = await dragHandle("Drag trigonometric amplitude", 0, -35);
checks.amplitudeDrag = await state();
await amplitude.focus();
await amplitude.press("ArrowDown");
checks.amplitudeKeyboard = await state();
await reload();
const period = await dragHandle("Drag trigonometric period", 55, 0);
checks.periodDrag = await state();
await period.focus();
await period.press("ArrowLeft");
checks.periodKeyboard = await state();
await reload();
const trace = await dragHandle("Drag graph angle trace", 55, 0);
checks.traceDrag = await state();
await trace.focus();
await trace.press("ArrowLeft");
checks.traceKeyboard = await state();

const cosineToggle = node
  .getByText("Trace cosine", { exact: true })
  .locator("input");
await cosineToggle.uncheck();
checks.cosineHidden = await node.locator(".trig144-graph .cosine").count();
await cosineToggle.check();
await node.locator(".trig144-challenge > div button").nth(2).click();
await node.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrongChallenge = await state();
await node.locator(".trig144-challenge > div button").nth(1).click();
await node.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correctChallenge = await state();
const thetaBefore = Number((await state()).theta);
await node.getByRole("button", { name: "Play animation", exact: true }).click();
await page.waitForTimeout(350);
await node
  .getByRole("button", { name: "Pause animation", exact: true })
  .click();
const thetaAfter = Number((await state()).theta);
checks.animation = { thetaBefore, thetaAfter };
const exportLink = node.getByRole("link", { name: "Export", exact: true });
checks.export = {
  filename: await exportLink.getAttribute("download"),
  payload: (await exportLink.getAttribute("href"))?.startsWith(
    "data:text/csv;charset=utf-8,theta%20radians",
  ),
};
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await reload();

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
      page: region(".trig144-page"),
      hero: region(".trig144-hero"),
      tabs: region(".trig144-tabs"),
      visuals: region(".trig144-visuals"),
      circle: region(".trig144-circle"),
      graph: region(".trig144-graph"),
      lower: region(".trig144-lower"),
      rail: region(".trig144-rail"),
      player: region(".trig144-player"),
    },
  };
});
const valid = (snapshot) => {
  const a = Number(snapshot.amplitude),
    p = Number(snapshot.period),
    ph = Number(snapshot.phase),
    k = Number(snapshot.midline),
    t = Number(snapshot.theta),
    omega = TAU / p;
  return (
    Math.abs(Number(snapshot.sine) - Math.sin(t)) < 1e-9 &&
    Math.abs(Number(snapshot.cosine) - Math.cos(t)) < 1e-9 &&
    Math.abs(
      Number(snapshot["transformed-sine"]) -
        (k + a * Math.sin(omega * (t + ph))),
    ) < 1e-8 &&
    Math.abs(
      Number(snapshot["transformed-cosine"]) -
        (k + a * Math.cos(omega * (t + ph))),
    ) < 1e-8
  );
};
const linkedKeys = [
  "initial",
  "amplitudeSlider",
  "periodSlider",
  "phaseSlider",
  "midlineSlider",
  "angleDrag",
  "angleKeyboard",
  "amplitudeDrag",
  "amplitudeKeyboard",
  "periodDrag",
  "periodKeyboard",
  "traceDrag",
  "traceKeyboard",
];
const passed =
  checks.initial.amplitude === "2" &&
  Math.abs(Number(checks.initial.period) - TAU) < 1e-9 &&
  Math.abs(Number(checks.initial.phase) - Math.PI / 4) < 1e-9 &&
  checks.initial.midline === "0" &&
  linkedKeys.every((key) => valid(checks[key])) &&
  checks.amplitudeSlider.amplitude !== checks.initial.amplitude &&
  checks.periodSlider.period !== checks.amplitudeSlider.period &&
  checks.phaseSlider.phase !== checks.periodSlider.phase &&
  checks.midlineSlider.midline !== checks.phaseSlider.midline &&
  checks.angleDrag.theta !== checks.initial.theta &&
  checks.amplitudeDrag.amplitude !== checks.initial.amplitude &&
  checks.periodDrag.period !== checks.initial.period &&
  checks.traceDrag.theta !== checks.initial.theta &&
  checks.cosineHidden === 0 &&
  checks.wrongChallenge.correct === "false" &&
  checks.correctChallenge.correct === "true" &&
  thetaAfter !== thetaBefore &&
  checks.export.filename === "trigonometric-functions.csv" &&
  checks.export.payload === true &&
  checks.reset.amplitude === checks.initial.amplitude &&
  checks.reset.theta === checks.initial.theta &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0201-desktop.png") });
await copyFile(reference, path.join(out, "0201-reference.png"));
const report = {
  mockup: "0201",
  lessonId: 144,
  route: "/lessons/graphs-and-functions/144-trigonometric-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0201-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
