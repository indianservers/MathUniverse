import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0212-interactive-intermediate-advanced-functions-recursive-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/155-recursive-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1477, height: 1065 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0212");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "m",
    "seed",
    "add-on",
    "steps",
    "selected",
    "current",
    "next",
    "fixed",
    "sequence",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    ),
  reload = async () => {
    await page.reload({ waitUntil: "domcontentloaded" });
    await node.waitFor();
  };
const valid = (item) => {
  const m = Number(item.m),
    seed = Number(item.seed),
    b = Number(item["add-on"]),
    steps = Number(item.steps),
    selected = Number(item.selected),
    values = [seed];
  for (let index = 0; index < steps; index += 1)
    values.push(m * values[index] + b);
  const next = m * values[steps] + b,
    fixed = Math.abs(1 - m) < 1e-5 ? "none" : String(b / (1 - m)),
    reported = item.sequence.split(",").map(Number);
  return (
    reported.length === values.length &&
    reported.every((value, index) => Math.abs(value - values[index]) < 1e-8) &&
    Math.abs(Number(item.current) - values[selected]) < 1e-8 &&
    Math.abs(Number(item.next) - next) < 1e-8 &&
    (fixed === "none"
      ? item.fixed === "none"
      : Math.abs(Number(item.fixed) - Number(fixed)) < 1e-8)
  );
};
const dragRange = async (name, delta) => {
  const slider = node.getByRole("slider", { name, exact: true }),
    box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width * (0.5 + delta),
    box.y + box.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
};
const checks = { initial: await state() };
await dragRange("Recursive growth factor", 0.16);
checks.growthRange = await state();
await dragRange("Recursive starting value", -0.2);
checks.seedRange = await state();
await dragRange("Recursive add on", 0.2);
checks.addOnRange = await state();
const stepsSlider = node.getByRole("slider", {
  name: "Recursive number of steps",
  exact: true,
});
await stepsSlider.focus();
await stepsSlider.press("ArrowRight");
checks.stepsRange = await state();
await reload();
const probe = node.getByRole("slider", {
    name: "Drag recursive term probe",
    exact: true,
  }),
  box = await probe.boundingBox();
if (!box) throw new Error("Recursive term probe unavailable");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 110, box.y + box.height / 2, { steps: 12 });
await page.mouse.up();
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
await node.getByRole("button", { name: /2 3\.16000/ }).click();
checks.tableRow = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll("*").forEach((element) => {
    if (element.scrollTop) element.scrollTop = 0;
  });
});
await page.waitForTimeout(50);
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const r = document.querySelector(selector)?.getBoundingClientRect();
    return r
      ? {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          right: r.right,
          width: r.width,
          height: r.height,
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
      page: region(".rec155-page"),
      surface: region(".rec155-surface"),
      header: region(".rec155-header"),
      top: region(".rec155-top"),
      pipeline: region(".rec155-pipeline"),
      iteration: region(".rec155-iteration"),
      graph: region(".rec155-sequence-graph"),
      controls: region(".rec155-controls"),
      bottom: region(".rec155-bottom"),
    },
  };
});
const expected = [1, 1.9, 3.16, 4.924, 7.3936, 10.85104, 15.691456],
  passed =
    checks.initial.m === "1.4" &&
    checks.initial.seed === "1" &&
    checks.initial["add-on"] === "0.5" &&
    checks.initial.steps === "6" &&
    checks.initial.selected === "6" &&
    checks.initial.sequence
      .split(",")
      .map(Number)
      .every((value, index) => Math.abs(value - expected[index]) < 1e-8) &&
    Math.abs(Number(checks.initial.next) - 22.4680384) < 1e-8 &&
    Math.abs(Number(checks.initial.fixed) + 1.25) < 1e-8 &&
    [
      checks.initial,
      checks.growthRange,
      checks.seedRange,
      checks.addOnRange,
      checks.stepsRange,
      checks.probeDrag,
      checks.probeKeyboard,
      checks.tableRow,
      checks.reset,
    ].every(valid) &&
    checks.growthRange.m !== "1.4" &&
    checks.seedRange.seed !== "1" &&
    checks.addOnRange["add-on"] !== "0.5" &&
    checks.stepsRange.steps !== "6" &&
    checks.probeDrag.selected !== "6" &&
    Number(checks.probeKeyboard.selected) ===
      Number(checks.probeDrag.selected) + 1 &&
    checks.tableRow.selected === "2" &&
    checks.reset.m === "1.4" &&
    checks.reset.seed === "1" &&
    checks.reset["add-on"] === "0.5" &&
    checks.reset.steps === "6" &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0212-desktop.png") });
await copyFile(reference, path.join(out, "0212-reference.png"));
const report = {
  mockup: "0212",
  lessonId: 155,
  route: "/lessons/graphs-and-functions/155-recursive-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0212-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
