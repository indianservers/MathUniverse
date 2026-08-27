import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0208-interactive-intermediate-advanced-functions-inverse-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/151-inverse-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1195, height: 1316 },
    permissions: ["clipboard-write"],
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0208");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "slope",
    "intercept",
    "probe",
    "output",
    "inverse-output",
    "domain",
    "domain-label",
    "shared",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    );
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
const reload = async () => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await node.waitFor();
};
const checks = { initial: await state() };
await dragRange("Inverse function slope", 0.22);
checks.slopeRange = await state();
await dragRange("Inverse function y intercept", -0.2);
checks.interceptRange = await state();
await node
  .getByRole("combobox", { name: "Inverse function domain restriction" })
  .selectOption("positive");
checks.positiveDomain = await state();
await node
  .getByRole("combobox", { name: "Inverse function domain restriction" })
  .selectOption("interval");
checks.intervalDomain = await state();
await reload();
const probe = node.getByRole("slider", {
    name: "Drag original function point",
    exact: true,
  }),
  probeBox = await probe.boundingBox();
if (!probeBox) throw new Error("Inverse graph probe unavailable");
await page.mouse.move(
  probeBox.x + probeBox.width / 2,
  probeBox.y + probeBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(probeBox.x - 75, probeBox.y + probeBox.height / 2, {
  steps: 12,
});
await page.mouse.up();
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
await node.getByRole("button", { name: /x = -1.*y = -1/ }).click();
checks.mappingSelection = await state();
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareNotice = await node
  .getByText("Lesson link copied", { exact: true })
  .isVisible();
await node.getByText("Lesson link copied", { exact: true }).click();
checks.shareClosed = (await state()).shared === "false";
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rectangle = document.querySelector(selector)?.getBoundingClientRect();
    return rectangle
      ? {
          top: rectangle.top,
          bottom: rectangle.bottom,
          left: rectangle.left,
          right: rectangle.right,
          width: rectangle.width,
          height: rectangle.height,
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
      page: region(".inv151-page"),
      breadcrumb: region(".inv151-breadcrumb"),
      surface: region(".inv151-surface"),
      header: region(".inv151-header"),
      graphCard: region(".inv151-graph-card"),
      graph: region(".inv151-graph"),
      mapping: region(".inv151-mapping-card"),
      rail: region(".inv151-rail"),
      neighbors: region(".inv151-neighbors"),
    },
  };
});
const valid = (item) => {
  const m = Number(item.slope),
    b = Number(item.intercept),
    x = Number(item.probe),
    y = m * x + b;
  return (
    Math.abs(Number(item.output) - y) < 1e-8 &&
    Math.abs(Number(item["inverse-output"]) - x) < 1e-8 &&
    Math.abs(m) >= 0.5
  );
};
const passed =
  checks.initial.slope === "2" &&
  checks.initial.intercept === "1" &&
  checks.initial.probe === "2" &&
  checks.initial.output === "5" &&
  checks.initial["inverse-output"] === "2" &&
  checks.initial.domain === "all" &&
  [
    checks.slopeRange,
    checks.interceptRange,
    checks.positiveDomain,
    checks.intervalDomain,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.mappingSelection,
  ].every(valid) &&
  checks.slopeRange.slope !== checks.initial.slope &&
  checks.interceptRange.intercept !== checks.initial.intercept &&
  checks.positiveDomain.domain === "positive" &&
  checks.intervalDomain.domain === "interval" &&
  checks.probeDrag.probe !== checks.initial.probe &&
  Number(checks.probeKeyboard.probe) > Number(checks.probeDrag.probe) &&
  checks.mappingSelection.probe === "-1" &&
  checks.mappingSelection.output === "-1" &&
  checks.shareNotice &&
  checks.shareClosed &&
  checks.reset.slope === "2" &&
  checks.reset.intercept === "1" &&
  checks.reset.probe === "2" &&
  checks.reset.output === "5" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0208-desktop.png") });
await copyFile(reference, path.join(out, "0208-reference.png"));
const report = {
  mockup: "0208",
  lessonId: 151,
  route: "/lessons/graphs-and-functions/151-inverse-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0208-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
