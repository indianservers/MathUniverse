import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0214-interactive-intermediate-function-transformations-horizontal-translation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/157-horizontal-translation";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1386, height: 1135 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0214");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "h",
    "level",
    "parent-visible",
    "vertex-x",
    "parent-input",
    "shifted-input",
    "output",
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
    const h = Number(item.h),
      level = Number(item.level),
      root = Math.sqrt(level);
    return (
      Number(item["vertex-x"]) === h &&
      Math.abs(Number(item["parent-input"]) - root) < 1e-8 &&
      Math.abs(Number(item["shifted-input"]) - (h + root)) < 1e-8 &&
      Number(item.output) === level &&
      Math.abs((Number(item["shifted-input"]) - h) ** 2 - level) < 1e-8
    );
  };
const checks = { initial: await state() };
const range = node.getByRole("slider", {
    name: "Horizontal translation amount",
    exact: true,
  }),
  rangeBox = await range.boundingBox();
if (!rangeBox) throw new Error("Horizontal translation range unavailable");
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.7,
  rangeBox.y + rangeBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.25,
  rangeBox.y + rangeBox.height / 2,
  { steps: 12 },
);
await page.mouse.up();
checks.range = await state();
await reload();
const vertex = node.getByRole("slider", {
    name: "Drag horizontal translation vertex",
    exact: true,
  }),
  vertexBox = await vertex.boundingBox();
if (!vertexBox) throw new Error("Horizontal vertex unavailable");
await page.mouse.move(
  vertexBox.x + vertexBox.width / 2,
  vertexBox.y + vertexBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  vertexBox.x + vertexBox.width / 2 - 120,
  vertexBox.y + vertexBox.height / 2,
  { steps: 12 },
);
await page.mouse.up();
checks.vertexDrag = await state();
await vertex.focus();
await vertex.press("ArrowRight");
checks.vertexKeyboard = await state();
await reload();
const levelProbe = node.getByRole("slider", {
    name: "Drag horizontal comparison level",
    exact: true,
  }),
  levelBox = await levelProbe.boundingBox();
if (!levelBox) throw new Error("Horizontal comparison level unavailable");
await page.mouse.move(
  levelBox.x + levelBox.width / 2,
  levelBox.y + levelBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  levelBox.x + levelBox.width / 2,
  levelBox.y + levelBox.height / 2 - 120,
  { steps: 12 },
);
await page.mouse.up();
checks.levelDrag = await state();
await levelProbe.focus();
await levelProbe.press("ArrowDown");
checks.levelKeyboard = await state();
await node
  .getByRole("combobox", { name: "Horizontal comparison y level" })
  .selectOption("1");
checks.levelSelect = await state();
await node.locator(".ht157-inputs tbody tr").first().click();
checks.tableRow = await state();
await node
  .getByRole("checkbox", { name: "Show horizontal parent function" })
  .uncheck();
checks.parentToggle = await state();
const previousHref = await page
    .getByRole("link", { name: /Previous Vertical Translation/ })
    .getAttribute("href"),
  nextHref = await page
    .getByRole("link", { name: /Next Vertical Stretch and Compression/ })
    .getAttribute("href");
await reload();
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
      page: region(".ht157-page"),
      header: region(".ht157-header"),
      workspace: region(".ht157-workspace"),
      graph: region(".ht157-graph-card"),
      controls: region(".ht157-controls"),
      inputs: region(".ht157-inputs"),
      concepts: region(".ht157-concepts"),
      navigation: region(".lesson-adjacent-nav"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.range,
    checks.vertexDrag,
    checks.vertexKeyboard,
    checks.levelDrag,
    checks.levelKeyboard,
    checks.levelSelect,
    checks.tableRow,
    checks.parentToggle,
    checks.reset,
  ],
  passed =
    checks.initial.h === "2" &&
    checks.initial.level === "2" &&
    Math.abs(Number(checks.initial["parent-input"]) - Math.sqrt(2)) < 1e-8 &&
    Math.abs(Number(checks.initial["shifted-input"]) - (2 + Math.sqrt(2))) <
      1e-8 &&
    checks.range.h !== "2" &&
    checks.vertexDrag.h !== "2" &&
    Number(checks.vertexKeyboard.h) === Number(checks.vertexDrag.h) + 1 &&
    checks.levelDrag.level !== "2" &&
    Number(checks.levelKeyboard.level) < Number(checks.levelDrag.level) &&
    checks.levelSelect.level === "1" &&
    checks.tableRow.level === "4" &&
    checks.parentToggle["parent-visible"] === "false" &&
    previousHref === "/lessons/graphs-and-functions/156-vertical-translation" &&
    nextHref ===
      "/lessons/graphs-and-functions/158-vertical-stretch-and-compression" &&
    checks.reset.h === "2" &&
    checks.reset.level === "2" &&
    checks.reset["parent-visible"] === "true" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0214-desktop.png") });
await copyFile(reference, path.join(out, "0214-reference.png"));
const report = {
  mockup: "0214",
  lessonId: 157,
  route: "/lessons/graphs-and-functions/157-horizontal-translation",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0214-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
