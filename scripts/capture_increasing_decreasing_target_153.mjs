import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0210-interactive-intermediate-advanced-functions-increasing-and-decreasing-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/153-increasing-and-decreasing";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1334, height: 1179 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0210");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "strength",
    "shift",
    "x",
    "value",
    "derivative",
    "motion",
    "maximum",
    "minimum",
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
  const s = Number(item.strength),
    shift = Number(item.shift),
    x = Number(item.x),
    base = (v) => v ** 3 / 3 - v ** 2 / 2 - 2 * v,
    scale = s / 8,
    value = scale * (base(x) - base(2)) - 0.55 + shift,
    derivative = scale * (x + 1) * (x - 2),
    motion =
      Math.abs(derivative) < 1e-5
        ? "stationary"
        : derivative > 0
          ? "increasing"
          : "decreasing",
    maximum = scale * (base(-1) - base(2)) - 0.55 + shift,
    minimum = -0.55 + shift;
  return (
    Math.abs(Number(item.value) - value) < 1e-8 &&
    Math.abs(Number(item.derivative) - derivative) < 1e-8 &&
    item.motion === motion &&
    Math.abs(Number(item.maximum) - maximum) < 1e-8 &&
    Math.abs(Number(item.minimum) - minimum) < 1e-8
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
await dragRange("Cubic turning strength", 0.18);
checks.strengthRange = await state();
await dragRange("Cubic vertical shift", -0.2);
checks.shiftRange = await state();
await dragRange("Monotonicity x cursor", 0.2);
checks.xRange = await state();
await reload();
const probe = node.getByRole("slider", {
    name: "Drag monotonicity x cursor",
    exact: true,
  }),
  box = await probe.boundingBox();
if (!box) throw new Error("Monotonicity graph probe unavailable");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 80, box.y + box.height / 2, { steps: 12 });
await page.mouse.up();
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
await reload();
await node.getByRole("button", { name: /Increasing.*−∞, −1/ }).click();
checks.leftInterval = await state();
await node.getByRole("button", { name: /Decreasing.*−1, 2/ }).click();
checks.middleInterval = await state();
await node.getByRole("button", { name: /Increasing.*2, ∞/ }).click();
checks.rightInterval = await state();
await node.getByRole("button", { name: "Reset view", exact: true }).click();
checks.reset = await state();
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
      page: region(".mono153-page"),
      surface: region(".mono153-surface"),
      header: region(".mono153-header"),
      top: region(".mono153-top"),
      explorer: region(".mono153-explorer"),
      graph: region(".mono153-graph"),
      controls: region(".mono153-controls"),
      bottom: region(".mono153-bottom"),
    },
  };
});
const passed =
  checks.initial.strength === "3" &&
  checks.initial.shift === "0" &&
  checks.initial.x === "-0.5" &&
  valid(checks.initial) &&
  [
    checks.strengthRange,
    checks.shiftRange,
    checks.xRange,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.leftInterval,
    checks.middleInterval,
    checks.rightInterval,
    checks.reset,
  ].every(valid) &&
  checks.strengthRange.strength !== "3" &&
  checks.shiftRange.shift !== "0" &&
  checks.xRange.x !== "-0.5" &&
  checks.probeDrag.x !== "-0.5" &&
  Number(checks.probeKeyboard.x) > Number(checks.probeDrag.x) &&
  checks.leftInterval.motion === "increasing" &&
  checks.middleInterval.motion === "decreasing" &&
  checks.rightInterval.motion === "increasing" &&
  checks.reset.strength === "3" &&
  checks.reset.shift === "0" &&
  checks.reset.x === "-0.5" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0210-desktop.png") });
await copyFile(reference, path.join(out, "0210-reference.png"));
const report = {
  mockup: "0210",
  lessonId: 153,
  route: "/lessons/graphs-and-functions/153-increasing-and-decreasing",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0210-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
