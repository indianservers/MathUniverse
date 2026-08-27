import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0213-interactive-intermediate-function-transformations-vertical-translation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/156-vertical-translation";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1205, height: 1305 },
    permissions: ["clipboard-read", "clipboard-write"],
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0213");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "k",
    "selected-x",
    "parent-visible",
    "transformed-visible",
    "selected-parent",
    "selected-output",
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
  },
  valid = (item) => {
    const x = Number(item["selected-x"]),
      k = Number(item.k);
    return (
      Number(item["selected-parent"]) === x * x &&
      Number(item["selected-output"]) === x * x + k
    );
  };
const checks = { initial: await state() };
const range = node.getByRole("slider", {
    name: "Vertical translation amount",
    exact: true,
  }),
  rangeBox = await range.boundingBox();
if (!rangeBox) throw new Error("Vertical translation range unavailable");
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.7,
  rangeBox.y + rangeBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.3,
  rangeBox.y + rangeBox.height / 2,
  { steps: 12 },
);
await page.mouse.up();
checks.range = await state();
await reload();
const shiftHandle = node.getByRole("slider", {
    name: "Drag translated parabola vertically",
    exact: true,
  }),
  shiftBox = await shiftHandle.boundingBox();
if (!shiftBox) throw new Error("Translated parabola drag handle unavailable");
await page.mouse.move(
  shiftBox.x + shiftBox.width / 2,
  shiftBox.y + shiftBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  shiftBox.x + shiftBox.width / 2,
  shiftBox.y + shiftBox.height / 2 + 75,
  { steps: 12 },
);
await page.mouse.up();
checks.shiftDrag = await state();
await shiftHandle.focus();
await shiftHandle.press("ArrowUp");
checks.shiftKeyboard = await state();
await reload();
const sampleHandle = node.getByRole("slider", {
    name: "Drag vertical translation sample point",
    exact: true,
  }),
  sampleBox = await sampleHandle.boundingBox();
if (!sampleBox) throw new Error("Translation sample point unavailable");
await page.mouse.move(
  sampleBox.x + sampleBox.width / 2,
  sampleBox.y + sampleBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  sampleBox.x + sampleBox.width / 2 - 130,
  sampleBox.y + sampleBox.height / 2,
  { steps: 12 },
);
await page.mouse.up();
checks.sampleDrag = await state();
await sampleHandle.focus();
await sampleHandle.press("ArrowRight");
checks.sampleKeyboard = await state();
await node.getByRole("button", { name: "-1", exact: true }).click();
checks.sampleButton = await state();
await node.locator(".vt156-values tbody tr").nth(2).click();
checks.tableRow = await state();
await node.getByRole("checkbox", { name: "Show parent parabola" }).uncheck();
checks.parentToggle = await state();
await node
  .getByRole("checkbox", { name: "Show translated parabola" })
  .uncheck();
checks.transformedToggle = await state();
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareStatus = await node
  .locator(".vt156-command > output")
  .textContent();
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
      page: region(".vt156-page"),
      surface: region(".vt156-surface"),
      header: region(".vt156-header"),
      command: region(".vt156-command"),
      workspace: region(".vt156-workspace"),
      graph: region(".vt156-graph-card"),
      controls: region(".vt156-controls"),
      values: region(".vt156-values"),
      explain: region(".vt156-explain"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.range,
    checks.shiftDrag,
    checks.shiftKeyboard,
    checks.sampleDrag,
    checks.sampleKeyboard,
    checks.sampleButton,
    checks.tableRow,
    checks.parentToggle,
    checks.transformedToggle,
    checks.reset,
  ],
  passed =
    checks.initial.k === "2" &&
    checks.initial["selected-x"] === "2" &&
    checks.initial["selected-output"] === "6" &&
    checks.range.k !== "2" &&
    checks.shiftDrag.k !== "2" &&
    Number(checks.shiftKeyboard.k) === Number(checks.shiftDrag.k) + 1 &&
    checks.sampleDrag["selected-x"] !== "2" &&
    Number(checks.sampleKeyboard["selected-x"]) ===
      Number(checks.sampleDrag["selected-x"]) + 1 &&
    checks.sampleButton["selected-x"] === "-1" &&
    checks.tableRow["selected-x"] === "0" &&
    checks.parentToggle["parent-visible"] === "false" &&
    checks.transformedToggle["transformed-visible"] === "false" &&
    checks.shareStatus === "Translation state copied" &&
    checks.reset.k === "2" &&
    checks.reset["selected-x"] === "2" &&
    checks.reset["parent-visible"] === "true" &&
    checks.reset["transformed-visible"] === "true" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0213-desktop.png") });
await copyFile(reference, path.join(out, "0213-reference.png"));
const report = {
  mockup: "0213",
  lessonId: 156,
  route: "/lessons/graphs-and-functions/156-vertical-translation",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0213-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
