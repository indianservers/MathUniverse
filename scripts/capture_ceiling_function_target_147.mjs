import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0204-interactive-intermediate-advanced-functions-ceiling-function-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/147-ceiling-function";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1392, height: 1130 },
  permissions: ["clipboard-write"],
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0204");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "x",
  "input-shift",
  "output-shift",
  "result",
  "interval",
  "snap",
];
const state = () =>
  node.evaluate(
    (element, names) =>
      Object.fromEntries(
        names.map((name) => [name, element.getAttribute(`data-${name}`)]),
      ),
    attrs,
  );
const dragRange = async (name, delta) => {
  const slider = node.getByRole("slider", { name, exact: true });
  const box = await slider.boundingBox();
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
const reload = async () => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await node.waitFor();
};
const checks = { initial: await state() };
await dragRange("Ceiling input shift", 0.2);
checks.inputShift = await state();
await dragRange("Ceiling output shift", -0.2);
checks.outputShift = await state();
await reload();
const handle = node.getByRole("slider", {
  name: "Drag ceiling input probe",
  exact: true,
});
const box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 150, box.y + box.height / 2, {
  steps: 12,
});
await page.mouse.up();
checks.probeDrag = await state();
await handle.focus();
await handle.press("ArrowRight");
checks.probeKeyboardSnapped = await state();
await node
  .getByRole("switch", { name: "Snap ceiling input to tenths", exact: true })
  .click();
await handle.press("ArrowRight");
checks.probeKeyboardFine = await state();
await reload();
await node.getByText("-1.2", { exact: true }).click();
checks.negativeRow = await state();
await node.locator(".ceil147-table tbody tr").nth(6).click();
checks.integerRow = await state();
await node
  .getByRole("button", { name: "Toggle controls", exact: true })
  .click();
checks.controlsCollapsed =
  (await node.getByText("Input shift (a)", { exact: true }).count()) === 0;
await node
  .getByRole("button", { name: "Toggle controls", exact: true })
  .click();
await node
  .getByRole("button", { name: "Toggle evaluation table", exact: true })
  .click();
checks.tableCollapsed =
  (await node.getByText("Click on any x value", { exact: false }).count()) ===
  0;
await node
  .getByRole("button", { name: "Toggle evaluation table", exact: true })
  .click();
await node.getByRole("button", { name: /English \(English\)/ }).click();
checks.languageChanged = await node
  .getByRole("button", { name: /Hindi/ })
  .isVisible();
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareNotice = await node
  .getByText("Lesson link copied", { exact: true })
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
      page: region(".ceil147-page"),
      header: region(".ceil147-header"),
      plot: region(".ceil147-plot"),
      graph: region(".ceil147-graph"),
      rail: region(".ceil147-rail"),
      comparison: region(".ceil147-comparison"),
    },
  };
});
const modelValid = (snapshot) => {
  const x = Number(snapshot.x),
    a = Number(snapshot["input-shift"]),
    b = Number(snapshot["output-shift"]),
    result = Math.ceil(x + a) + b,
    n = result - b,
    [left, right] = snapshot.interval.split(",").map(Number);
  return (
    Number(snapshot.result) === result &&
    Math.abs(left - (n - 1 - a)) < 1e-9 &&
    Math.abs(right - (n - a)) < 1e-9
  );
};
const snappedDelta =
  Number(checks.probeKeyboardSnapped.x) - Number(checks.probeDrag.x);
const fineDelta =
  Number(checks.probeKeyboardFine.x) - Number(checks.probeKeyboardSnapped.x);
const passed =
  checks.initial.x === "2.3" &&
  checks.initial.result === "3" &&
  checks.initial.interval === "2,3" &&
  [
    checks.inputShift,
    checks.outputShift,
    checks.probeDrag,
    checks.probeKeyboardSnapped,
    checks.probeKeyboardFine,
    checks.negativeRow,
    checks.integerRow,
  ].every(modelValid) &&
  checks.inputShift["input-shift"] !== "0" &&
  checks.outputShift["output-shift"] !== "0" &&
  checks.probeDrag.x !== checks.initial.x &&
  Math.abs(snappedDelta - 0.1) < 1e-9 &&
  Math.abs(fineDelta - 0.01) < 1e-9 &&
  checks.negativeRow.x === "-1.2" &&
  checks.negativeRow.result === "-1" &&
  checks.integerRow.x === "3" &&
  checks.integerRow.result === "3" &&
  checks.controlsCollapsed &&
  checks.tableCollapsed &&
  checks.languageChanged &&
  checks.shareNotice &&
  checks.reset.x === checks.initial.x &&
  checks.reset.snap === "true" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0204-desktop.png") });
await copyFile(reference, path.join(out, "0204-reference.png"));
const report = {
  mockup: "0204",
  lessonId: 147,
  route: "/lessons/graphs-and-functions/147-ceiling-function",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0204-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
