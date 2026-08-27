import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0209-interactive-intermediate-advanced-functions-even-and-odd-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/152-even-and-odd-functions";
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
const node = page.getByTestId("graph-mockup-0209");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "family",
    "x",
    "fx",
    "negative-fx",
    "mirror",
    "rotate",
    "verdict",
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
  const x = Number(item.x),
    expected =
      item.family === "even"
        ? x * x
        : item.family === "odd"
          ? x ** 3
          : x * x + x,
    negative =
      item.family === "even"
        ? x * x
        : item.family === "odd"
          ? -(x ** 3)
          : x * x - x;
  return (
    Math.abs(Number(item.fx) - expected) < 1e-8 &&
    Math.abs(Number(item["negative-fx"]) - negative) < 1e-8 &&
    item.verdict === item.family
  );
};
const checks = { initial: await state() };
const range = node.getByRole("slider", {
    name: "Symmetry test x",
    exact: true,
  }),
  rangeBox = await range.boundingBox();
if (!rangeBox) throw new Error("Symmetry x range unavailable");
await page.mouse.move(
  rangeBox.x + rangeBox.width / 2,
  rangeBox.y + rangeBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  rangeBox.x + rangeBox.width * 0.18,
  rangeBox.y + rangeBox.height / 2,
  { steps: 10 },
);
await page.mouse.up();
checks.xRange = await state();
await reload();
const probe = node.getByRole("slider", {
    name: "Drag symmetry test point",
    exact: true,
  }),
  probeBox = await probe.boundingBox();
if (!probeBox) throw new Error("Symmetry graph point unavailable");
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
await reload();
await node.getByRole("tab", { name: "Odd", exact: true }).click();
checks.oddTab = await state();
checks.oddRotationVisible = await node
  .getByTestId("odd-rotation-overlay")
  .isVisible();
const rotateSwitch = node.getByRole("switch", { name: /Rotate around origin/ });
await rotateSwitch.click();
checks.rotationOff = {
  state: await state(),
  count: await node.getByTestId("odd-rotation-overlay").count(),
};
await rotateSwitch.click();
checks.rotationRestored = {
  state: await state(),
  visible: await node.getByTestId("odd-rotation-overlay").isVisible(),
};
await node
  .getByRole("combobox", { name: "Symmetry function family" })
  .selectOption("neither");
checks.neitherSelect = await state();
await node.getByRole("switch", { name: /Mirror over y-axis/ }).click();
checks.mirrorOff = {
  state: await state(),
  count: await node.getByTestId("even-mirror-overlay").count(),
};
await node.getByRole("button", { name: /Test x and -x/ }).click();
checks.swapX = await state();
await node
  .getByRole("button", { name: /Even: f\(-x\) = f\(x\).*Mirror over y-axis/ })
  .first()
  .click();
checks.evenSummary = await state();
await reload();
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
      page: region(".eo152-page"),
      surface: region(".eo152-surface"),
      header: region(".eo152-header"),
      left: region(".eo152-left"),
      graph: region(".eo152-graph"),
      concepts: region(".eo152-concepts"),
      rail: region(".eo152-rail"),
      neighbors: region(".eo152-neighbors"),
    },
  };
});
const passed =
  checks.initial.family === "even" &&
  checks.initial.x === "2" &&
  checks.initial.fx === "4" &&
  checks.initial["negative-fx"] === "4" &&
  checks.initial.mirror === "true" &&
  checks.initial.rotate === "true" &&
  [
    checks.xRange,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.oddTab,
    checks.neitherSelect,
    checks.swapX,
    checks.evenSummary,
  ].every(valid) &&
  checks.xRange.x !== "2" &&
  checks.probeDrag.x !== "2" &&
  Number(checks.probeKeyboard.x) > Number(checks.probeDrag.x) &&
  checks.oddTab.fx === "8" &&
  checks.oddTab["negative-fx"] === "-8" &&
  checks.oddRotationVisible &&
  checks.rotationOff.state.rotate === "false" &&
  checks.rotationOff.count === 0 &&
  checks.rotationRestored.state.rotate === "true" &&
  checks.rotationRestored.visible &&
  checks.neitherSelect.fx === "6" &&
  checks.neitherSelect["negative-fx"] === "2" &&
  checks.mirrorOff.state.mirror === "false" &&
  checks.mirrorOff.count === 0 &&
  checks.swapX.x === "-2" &&
  checks.evenSummary.family === "even" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0209-desktop.png") });
await copyFile(reference, path.join(out, "0209-reference.png"));
const report = {
  mockup: "0209",
  lessonId: 152,
  route: "/lessons/graphs-and-functions/152-even-and-odd-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0209-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
