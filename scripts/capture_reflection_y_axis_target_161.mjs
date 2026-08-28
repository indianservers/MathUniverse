import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0218-interactive-intermediate-function-transformations-reflection-in-y-axis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/161-reflection-in-y-axis";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1205, height: 1306 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0218");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "pre-shift",
    "scale",
    "y-level",
    "left-x",
    "right-x",
    "left-output",
    "right-output",
    "view",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    ),
  valid = (item) => {
    const shift = Number(item["pre-shift"]),
      scale = Number(item.scale),
      y = Number(item["y-level"]),
      left = Number(item["left-x"]),
      right = Number(item["right-x"]);
    return (
      Math.abs(left ** 3 + shift - y) < 1e-8 &&
      Math.abs((-scale * right) ** 3 + shift - y) < 1e-8 &&
      Math.abs(right + left / scale) < 1e-8 &&
      Math.abs(Number(item["left-output"]) - y) < 1e-8 &&
      Math.abs(Number(item["right-output"]) - y) < 1e-8
    );
  };
const checks = { initial: await state() };
const shiftRange = node.getByRole("slider", {
    name: "Vertical pre-shift",
    exact: true,
  }),
  shiftBox = await shiftRange.boundingBox();
if (!shiftBox) throw new Error("Pre-shift range unavailable");
await page.mouse.click(
  shiftBox.x + shiftBox.width * 0.7,
  shiftBox.y + shiftBox.height / 2,
);
checks.preShiftRange = await state();
const scaleRange = node.getByRole("slider", {
    name: "Horizontal reflection scale",
    exact: true,
  }),
  scaleBox = await scaleRange.boundingBox();
if (!scaleBox) throw new Error("Horizontal scale range unavailable");
await page.mouse.click(
  scaleBox.x + scaleBox.width * 0.8,
  scaleBox.y + scaleBox.height / 2,
);
checks.scaleRange = await state();
const yRange = node.getByRole("slider", {
    name: "Sample y-level",
    exact: true,
  }),
  yBox = await yRange.boundingBox();
if (!yBox) throw new Error("Sample y-level range unavailable");
await page.mouse.click(yBox.x + yBox.width * 0.7, yBox.y + yBox.height / 2);
checks.yRange = await state();
await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 });
await node.waitFor({ timeout: 600000 });
const point = node.getByRole("slider", {
    name: "Drag reflected same-y point",
    exact: true,
  }),
  pointBox = await point.boundingBox();
if (!pointBox) throw new Error("Same-y reflected point unavailable");
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2 + 35,
  pointBox.y + pointBox.height / 2 - 20,
  { steps: 12 },
);
await page.mouse.up();
checks.pointDrag = await state();
await point.focus();
await point.press("ArrowUp");
checks.pointKeyboardY = await state();
await point.press("ArrowLeft");
checks.pointKeyboardScale = await state();
await node.locator(".ry161-rail tbody tr").nth(1).click();
checks.tableRow = await state();
await node.getByRole("button", { name: "Table View", exact: true }).click();
checks.tableView = await state();
await node.getByRole("button", { name: "Step View", exact: true }).click();
checks.stepView = await state();
await node.getByRole("button", { name: "Graph View", exact: true }).click();
checks.graphView = await state();
const adjacentLinks = node
  .locator("xpath=../following-sibling::*")
  .locator("a");
const previousHref = await page
    .locator('.lesson-adjacent-nav a[href*="160-reflection-in-x-axis"]')
    .getAttribute("href"),
  nextHref = await page
    .locator('.lesson-adjacent-nav a[href*="162-combined-transformations"]')
    .getAttribute("href");
void adjacentLinks;
await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 });
await node.waitFor({ timeout: 600000 });
checks.reloadReset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll("*").forEach((element) => {
    if (element.scrollTop) element.scrollTop = 0;
  });
});
await page.waitForTimeout(75);
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
      page: region(".ry161-page"),
      surface: region(".ry161-surface"),
      header: region(".ry161-header"),
      views: region(".ry161-viewbar"),
      workspace: region(".ry161-workspace"),
      plot: region(".ry161-plot"),
      controls: region(".ry161-rail"),
      concepts: region(".ry161-concepts"),
      rule: region(".ry161-rule"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.preShiftRange,
    checks.scaleRange,
    checks.yRange,
    checks.pointDrag,
    checks.pointKeyboardY,
    checks.pointKeyboardScale,
    checks.tableRow,
    checks.tableView,
    checks.stepView,
    checks.graphView,
    checks.reloadReset,
  ],
  passed =
    checks.initial["pre-shift"] === "0" &&
    checks.initial.scale === "1" &&
    checks.initial["y-level"] === "-8" &&
    checks.initial["left-x"] === "-2" &&
    checks.initial["right-x"] === "2" &&
    Number(checks.preShiftRange["pre-shift"]) > 0 &&
    Number(checks.scaleRange.scale) > 2 &&
    Number(checks.yRange["y-level"]) > 0 &&
    checks.pointDrag.scale !== "1" &&
    Number(checks.pointKeyboardY["y-level"]) ===
      Number(checks.pointDrag["y-level"]) + 1 &&
    Math.abs(
      Number(checks.pointKeyboardScale.scale) -
        Number(checks.pointKeyboardY.scale) -
        0.25,
    ) < 1e-8 &&
    checks.tableRow["y-level"] === "-1" &&
    checks.tableView.view === "Table View" &&
    checks.stepView.view === "Step View" &&
    checks.graphView.view === "Graph View" &&
    previousHref === "/lessons/graphs-and-functions/160-reflection-in-x-axis" &&
    nextHref === "/lessons/graphs-and-functions/162-combined-transformations" &&
    checks.reloadReset["pre-shift"] === "0" &&
    checks.reloadReset.scale === "1" &&
    checks.reloadReset["y-level"] === "-8" &&
    checks.reloadReset.view === "Graph View" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0218-desktop.png") });
await copyFile(reference, path.join(out, "0218-reference.png"));
const report = {
  mockup: "0218",
  lessonId: 161,
  route: "/lessons/graphs-and-functions/161-reflection-in-y-axis",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0218-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
