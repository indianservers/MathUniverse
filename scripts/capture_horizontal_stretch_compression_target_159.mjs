import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0216-interactive-intermediate-function-transformations-horizontal-stretch-and-compression-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/159-horizontal-stretch-and-compression";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1350, height: 1165 },
    permissions: ["clipboard-read", "clipboard-write"],
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0216");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "b",
    "mode",
    "levels",
    "width-ratio",
    "parent-x-at-4",
    "scaled-x-at-4",
    "output-at-scaled-x",
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
    const b = Number(item.b),
      scaledX = Number(item["scaled-x-at-4"]);
    return (
      Math.abs(Number(item["width-ratio"]) - 1 / b) < 1e-8 &&
      Math.abs(scaledX - 2 / b) < 1e-8 &&
      Math.abs((b * scaledX) ** 2 - 4) < 1e-8 &&
      Math.abs(Number(item["output-at-scaled-x"]) - 4) < 1e-8 &&
      item.mode === (b < 1 ? "stretch" : "compression")
    );
  };
const checks = { initial: await state() };
const range = node.getByRole("slider", {
    name: "Horizontal inside scale",
    exact: true,
  }),
  rangeBox = await range.boundingBox();
if (!rangeBox) throw new Error("Horizontal scale range unavailable");
await page.mouse.click(
  rangeBox.x + rangeBox.width * 0.58,
  rangeBox.y + rangeBox.height / 2,
);
checks.range = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
const scalePoint = node.getByRole("slider", {
    name: "Drag horizontal scale point",
    exact: true,
  }),
  pointBox = await scalePoint.boundingBox();
if (!pointBox) throw new Error("Horizontal scale point unavailable");
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2 - 75,
  pointBox.y + pointBox.height / 2,
  { steps: 12 },
);
await page.mouse.up();
checks.pointDrag = await state();
await scalePoint.focus();
await scalePoint.press("ArrowRight");
checks.pointKeyboard = await state();
await node
  .getByRole("button", { name: "Compression (|b| > 1)", exact: true })
  .click();
checks.compressionMode = await state();
await node
  .getByRole("button", { name: "Stretch (|b| < 1)", exact: true })
  .click();
checks.stretchMode = await state();
await node
  .getByRole("button", { name: "Decrease inside scale", exact: true })
  .click();
checks.minus = await state();
await node
  .getByRole("button", { name: "Increase inside scale", exact: true })
  .click();
checks.plus = await state();
await node.getByRole("button", { name: "2", exact: true }).click();
await node.getByRole("button", { name: "1", exact: true }).click();
checks.levelButtons = await state();
await node.locator(".hs159-table tbody tr").nth(2).click();
checks.tableToggle = await state();
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareStatus = await node.locator(".hs159-header output").textContent();
await node.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspaceStatus = await node
  .locator(".hs159-header output")
  .textContent();
const previousHref = await page
    .getByRole("link", { name: /Previous Vertical Stretch and Compression/ })
    .getAttribute("href"),
  nextHref = await page
    .getByRole("link", { name: /Next Reflection in x-Axis/ })
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
      page: region(".hs159-page"),
      header: region(".hs159-header"),
      workspace: region(".hs159-workspace"),
      graph: region(".hs159-main"),
      controls: region(".hs159-controls"),
      table: region(".hs159-table"),
      preview: region(".hs159-preview"),
      concepts: region(".hs159-concepts"),
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
    checks.minus,
    checks.plus,
    checks.levelButtons,
    checks.tableToggle,
    checks.reset,
  ],
  passed =
    checks.initial.b === "0.7" &&
    checks.initial.mode === "stretch" &&
    checks.initial.levels === "1,4" &&
    Number(checks.range.b) > 1 &&
    checks.range.mode === "compression" &&
    checks.pointDrag.b !== "0.7" &&
    Math.abs(
      Number(checks.pointKeyboard.b) - Number(checks.pointDrag.b) + 0.1,
    ) < 1e-8 &&
    checks.compressionMode.b === "1.8" &&
    checks.compressionMode.mode === "compression" &&
    checks.stretchMode.b === "0.7" &&
    checks.minus.b === "0.6" &&
    checks.plus.b === "0.7" &&
    checks.levelButtons.levels === "2,4" &&
    checks.tableToggle.levels === "2,4,6" &&
    checks.shareStatus === "Scale state copied" &&
    checks.workspaceStatus === "Workspace linked" &&
    previousHref ===
      "/lessons/graphs-and-functions/158-vertical-stretch-and-compression" &&
    nextHref === "/lessons/graphs-and-functions/160-reflection-in-x-axis" &&
    checks.reset.b === "0.7" &&
    checks.reset.levels === "1,4" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0216-desktop.png") });
await copyFile(reference, path.join(out, "0216-reference.png"));
const report = {
  mockup: "0216",
  lessonId: 159,
  route: "/lessons/graphs-and-functions/159-horizontal-stretch-and-compression",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0216-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
