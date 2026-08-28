import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0215-interactive-intermediate-function-transformations-vertical-stretch-and-compression-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/158-vertical-stretch-and-compression";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1322, height: 1190 },
    permissions: ["clipboard-read", "clipboard-write"],
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0215");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "a",
    "mode",
    "samples",
    "tab",
    "language",
    "x-fixed",
    "output-x2",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    ),
  valid = (item) =>
    Math.abs(Number(item["output-x2"]) - 4 * Number(item.a)) < 1e-8 &&
    item["x-fixed"] === "true" &&
    item.mode === (Number(item.a) > 1 ? "stretch" : "compression");
const checks = { initial: await state() };
const range = node.getByRole("slider", {
    name: "Vertical scale factor",
    exact: true,
  }),
  rangeBox = await range.boundingBox();
if (!rangeBox) throw new Error("Vertical scale range unavailable");
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.59,
  rangeBox.y + rangeBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.2,
  rangeBox.y + rangeBox.height / 2,
  { steps: 12 },
);
await page.mouse.up();
checks.range = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const scalePoint = node.getByRole("slider", {
    name: "Drag vertical scale point",
    exact: true,
  }),
  pointBox = await scalePoint.boundingBox();
if (!pointBox) throw new Error("Vertical scale point unavailable");
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2 + 65,
  { steps: 12 },
);
await page.mouse.up();
checks.pointDrag = await state();
await scalePoint.focus();
await scalePoint.press("ArrowUp");
checks.pointKeyboard = await state();
await node
  .getByRole("button", { name: "Compression (0 < a < 1)", exact: true })
  .click();
checks.compressionMode = await state();
await node
  .getByRole("button", { name: "Stretch (a > 1)", exact: true })
  .click();
checks.stretchMode = await state();
await node.getByRole("checkbox", { name: "Show sample x -2" }).uncheck();
checks.sampleToggle = await state();
await node.locator(".vs158-table tbody tr").nth(1).click();
checks.tableToggle = await state();
await node.getByRole("button", { name: /Examples/, exact: true }).click();
checks.tab = await state();
await node
  .getByRole("combobox", { name: "Vertical scale lesson language" })
  .selectOption({ label: "Spanish (Español)" });
checks.language = await state();
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareStatus = await node
  .locator(".vs158-header footer > output")
  .textContent();
await node.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspaceStatus = await node
  .locator(".vs158-header footer > output")
  .textContent();
const previousHref = await page
    .getByRole("link", { name: /Previous Horizontal Translation/ })
    .getAttribute("href"),
  nextHref = await page
    .getByRole("link", {
      name: /Next Horizontal Stretch and Compression/,
    })
    .getAttribute("href");
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
      page: region(".vs158-page"),
      header: region(".vs158-header"),
      tabs: region(".vs158-tabs"),
      workspace: region(".vs158-workspace"),
      graph: region(".vs158-main"),
      controls: region(".vs158-controls"),
      table: region(".vs158-table"),
      concepts: region(".vs158-concepts"),
      navigation: region(".lesson-adjacent-nav"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.range,
    checks.pointDrag,
    checks.pointKeyboard,
    checks.compressionMode,
    checks.stretchMode,
    checks.sampleToggle,
    checks.tableToggle,
    checks.tab,
    checks.language,
    checks.reset,
  ],
  passed =
    checks.initial.a === "1.8" &&
    checks.initial.mode === "stretch" &&
    checks.initial.samples === "-2,-1,1,2" &&
    checks.initial["output-x2"] === "7.2" &&
    Number(checks.range.a) < 1 &&
    checks.range.mode === "compression" &&
    checks.pointDrag.a !== "1.8" &&
    Math.abs(
      Number(checks.pointKeyboard.a) - Number(checks.pointDrag.a) - 0.1,
    ) < 1e-8 &&
    checks.compressionMode.a === "0.5" &&
    checks.compressionMode.mode === "compression" &&
    checks.stretchMode.a === "1.8" &&
    !checks.sampleToggle.samples.includes("-2") &&
    !checks.tableToggle.samples.includes("-1") &&
    checks.tab.tab === "Examples" &&
    checks.language.language === "Spanish (Español)" &&
    checks.shareStatus === "Scale state copied" &&
    checks.workspaceStatus === "Workspace linked" &&
    previousHref ===
      "/lessons/graphs-and-functions/157-horizontal-translation" &&
    nextHref ===
      "/lessons/graphs-and-functions/159-horizontal-stretch-and-compression" &&
    checks.reset.a === "1.8" &&
    checks.reset.samples === "-2,-1,1,2" &&
    checks.reset.tab === "Interaction + visualization" &&
    checks.reset.language === "English (English)" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0215-desktop.png") });
await copyFile(reference, path.join(out, "0215-reference.png"));
const report = {
  mockup: "0215",
  lessonId: 158,
  route: "/lessons/graphs-and-functions/158-vertical-stretch-and-compression",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0215-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
