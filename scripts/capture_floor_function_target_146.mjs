import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0203-interactive-intermediate-advanced-functions-floor-function-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/146-floor-function";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
  permissions: ["clipboard-write"],
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0203");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "x",
  "input-shift",
  "output-shift",
  "result",
  "interval",
  "active-tab",
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
    { steps: 12 },
  );
  await page.mouse.up();
};
const checks = { initial: await state() };
await dragRange("Floor input x", -0.25);
checks.inputRange = await state();
await dragRange("Input shift", 0.2);
checks.inputShift = await state();
await dragRange("Output shift", 0.2);
checks.outputShift = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const handle = node.getByRole("slider", {
  name: "Drag floor input probe",
  exact: true,
});
let box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 170, box.y + box.height / 2, {
  steps: 12,
});
await page.mouse.up();
checks.probeDrag = await state();
await handle.focus();
await handle.press("ArrowRight");
checks.probeKeyboard = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const input = node.getByRole("slider", { name: "Floor input x", exact: true });
await input.focus();
await input.press("Home");
for (let i = 0; i < 199; i++) await input.press("ArrowRight");
checks.negativeInput = await state();
checks.negativeChallengeVisible = await node
  .getByText("x = -3.001", { exact: false })
  .isVisible();
await node.getByRole("button", { name: "New Challenge", exact: false }).click();
checks.newChallenge = await state();
await node.getByRole("button", { name: "Check", exact: true }).first().click();
checks.checkedMarkCount = await node.locator(".floor146-challenge svg").count();
await node.getByRole("button", { name: "DEFINITION", exact: true }).click();
checks.definitionTab = await state();
await node.getByRole("button", { name: "Help", exact: true }).click();
checks.helpVisible = await node
  .getByText("every step is [left, right)", { exact: false })
  .isVisible();
await node.getByRole("button", { name: "Reset Lab", exact: true }).click();
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
      page: region(".floor146-page"),
      header: region(".floor146-header"),
      graph: region(".floor146-graph"),
      numberLine: region(".floor146-number"),
      lower: region(".floor146-bottom"),
      rail: region(".floor146-rail"),
    },
  };
});
const exactModel = (snapshot) =>
  Number(snapshot.result) ===
  Math.floor(Number(snapshot.x) + Number(snapshot["input-shift"])) +
    Number(snapshot["output-shift"]);
const passed =
  checks.initial.x === "2.73" &&
  checks.initial.result === "2" &&
  checks.initial.interval === "2,3" &&
  [
    checks.inputRange,
    checks.inputShift,
    checks.outputShift,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.negativeInput,
  ].every(exactModel) &&
  checks.inputRange.x !== checks.initial.x &&
  checks.inputShift["input-shift"] !== "0" &&
  checks.outputShift["output-shift"] !== "0" &&
  checks.probeDrag.x !== checks.initial.x &&
  Number(checks.probeKeyboard.x) > Number(checks.probeDrag.x) &&
  Number(checks.negativeInput.x) < 0 &&
  checks.negativeInput.result === "-4" &&
  checks.negativeChallengeVisible &&
  checks.newChallenge.x === "-0.8" &&
  checks.checkedMarkCount === 1 &&
  checks.definitionTab["active-tab"] === "DEFINITION" &&
  checks.helpVisible &&
  checks.reset.x === checks.initial.x &&
  checks.reset.result === checks.initial.result &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0203-desktop.png") });
await copyFile(reference, path.join(out, "0203-reference.png"));
const report = {
  mockup: "0203",
  lessonId: 146,
  route: "/lessons/graphs-and-functions/146-floor-function",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0203-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
