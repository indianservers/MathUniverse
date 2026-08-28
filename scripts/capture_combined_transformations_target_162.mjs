import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0219-interactive-intermediate-function-transformations-combined-transformations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/162-combined-transformations";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1034, height: 1521 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0219");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "h",
    "a",
    "k",
    "effective-k",
    "order",
    "point-x",
    "final-point-x",
    "final-point-y",
    "tab",
    "zoom",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    ),
  expected = (item) => {
    let x = Number(item["point-x"]),
      y = x ** 2,
      effectiveK = 0,
      yScale = 1;
    const h = Number(item.h),
      a = Number(item.a),
      k = Number(item.k);
    item.order.split(",").forEach((key) => {
      if (key === "h") x += h;
      if (key === "a") {
        y *= a;
        yScale *= a;
        effectiveK *= a;
      }
      if (key === "k") {
        y += k;
        effectiveK += k;
      }
    });
    return { x, y, effectiveK, yScale };
  },
  valid = (item) => {
    const result = expected(item);
    return (
      Math.abs(Number(item["effective-k"]) - result.effectiveK) < 1e-8 &&
      Math.abs(Number(item["final-point-x"]) - result.x) < 1e-8 &&
      Math.abs(Number(item["final-point-y"]) - result.y) < 1e-8
    );
  };
const checks = { initial: await state() };
const setRange = async (name, fraction) => {
  const range = node.getByRole("slider", { name, exact: true }),
    box = await range.boundingBox();
  if (!box) throw new Error(`${name} range unavailable`);
  await page.mouse.click(box.x + box.width * fraction, box.y + box.height / 2);
};
await setRange("Horizontal shift h", 0.75);
checks.hRange = await state();
await setRange("Vertical scale a", 0.75);
checks.aRange = await state();
await setRange("Vertical shift k", 0.75);
checks.kRange = await state();
await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 });
await node.waitFor({ timeout: 600000 });
const vertex = node.getByRole("slider", {
    name: "Drag final vertex",
    exact: true,
  }),
  vertexBox = await vertex.boundingBox();
if (!vertexBox) throw new Error("Final vertex unavailable");
await page.mouse.move(
  vertexBox.x + vertexBox.width / 2,
  vertexBox.y + vertexBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  vertexBox.x + vertexBox.width / 2 + 32,
  vertexBox.y + vertexBox.height / 2 - 32,
  { steps: 12 },
);
await page.mouse.up();
checks.vertexDrag = await state();
await vertex.focus();
await vertex.press("ArrowRight");
checks.vertexKeyboardX = await state();
await vertex.press("ArrowDown");
checks.vertexKeyboardY = await state();
await node.getByRole("button", { name: "See why →", exact: true }).click();
checks.reorderPreset = await state();
const firstOrderButton = node.getByRole("button", {
  name: /Shift up\/down by k, position 1/,
});
await firstOrderButton.focus();
await firstOrderButton.press("ArrowRight");
checks.reorderKeyboard = await state();
await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 });
await node.waitFor({ timeout: 600000 });
const shiftButton = node.getByRole("button", {
    name: /Shift right by h, position 1/,
  }),
  kButton = node.getByRole("button", {
    name: /Shift up\/down by k, position 3/,
  });
await shiftButton.dragTo(kButton);
checks.reorderDrag = await state();
await node.getByRole("checkbox", { name: "Show points" }).uncheck();
checks.pointsHidden = await node
  .getByRole("checkbox", { name: "Show points" })
  .isChecked();
await node.getByRole("checkbox", { name: "Show grid" }).uncheck();
checks.gridHidden = await node
  .getByRole("checkbox", { name: "Show grid" })
  .isChecked();
await node.getByRole("button", { name: "Zoom in", exact: true }).click();
checks.zoomIn = await state();
await node.getByRole("button", { name: "Zoom out", exact: true }).click();
checks.zoomOut = await state();
await node
  .getByRole("button", { name: "Reset graph view", exact: true })
  .click();
checks.zoomReset = await state();
await node
  .getByRole("combobox", { name: "Tracked parent point" })
  .selectOption("1");
checks.pointSelect = await state();
for (const tab of ["Explain", "Examples", "Practice", "Summary", "Explore"])
  await node.getByRole("button", { name: new RegExp(`^${tab}`) }).click();
checks.tabs = await state();
const answer = node.getByRole("textbox", { name: "Try-it vertex equation" });
await answer.fill("y = (x - 1)^2 + 2");
await node.getByRole("button", { name: "Check", exact: true }).click();
checks.incorrectFeedback = await node
  .locator(".ct162-practice output")
  .textContent();
await answer.fill("y = 3(x - 2)^2 - 1");
await node.getByRole("button", { name: "Check", exact: true }).click();
checks.correctFeedback = await node
  .locator(".ct162-practice output")
  .textContent();
await node.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await node.locator(".hint-text").textContent();
const previousHref = await page
    .getByRole("link", { name: /Previous Reflection in y-Axis/ })
    .getAttribute("href"),
  nextHref = await page
    .getByRole("link", { name: /Next Transformation Order/ })
    .getAttribute("href");
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
      page: region(".ct162-page"),
      primary: region(".ct162-primary"),
      header: region(".ct162-header"),
      tabs: region(".ct162-tabs"),
      workspace: region(".ct162-workspace"),
      graph: region(".ct162-explorer"),
      builder: region(".ct162-builder"),
      lower: region(".ct162-lower"),
      practice: region(".ct162-practice"),
      navigation: region(".ct162-nav"),
      footer: region(".ct162-footer"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.hRange,
    checks.aRange,
    checks.kRange,
    checks.vertexDrag,
    checks.vertexKeyboardX,
    checks.vertexKeyboardY,
    checks.reorderPreset,
    checks.reorderKeyboard,
    checks.reorderDrag,
    checks.zoomIn,
    checks.zoomOut,
    checks.zoomReset,
    checks.pointSelect,
    checks.tabs,
    checks.reloadReset,
  ],
  passed =
    checks.initial.h === "1" &&
    checks.initial.a === "2" &&
    checks.initial.k === "-2" &&
    checks.initial["effective-k"] === "-2" &&
    checks.initial.order === "h,a,k" &&
    checks.initial["final-point-x"] === "0" &&
    checks.initial["final-point-y"] === "0" &&
    Number(checks.hRange.h) > 1 &&
    Number(checks.aRange.a) > 1 &&
    Number(checks.kRange.k) > 0 &&
    checks.vertexDrag.h === "2" &&
    checks.vertexDrag.k === "-1" &&
    checks.vertexKeyboardX.h === "3" &&
    checks.vertexKeyboardY.k === "-2" &&
    checks.reorderPreset.order === "k,a,h" &&
    checks.reorderPreset["effective-k"] === "-4" &&
    checks.reorderKeyboard.order === "a,k,h" &&
    checks.reorderDrag.order !== "h,a,k" &&
    checks.pointsHidden === false &&
    checks.gridHidden === false &&
    Number(checks.zoomIn.zoom) > 1 &&
    Number(checks.zoomOut.zoom) === 1 &&
    checks.zoomReset.zoom === "1" &&
    checks.pointSelect["point-x"] === "1" &&
    checks.tabs.tab === "Explore" &&
    checks.incorrectFeedback?.startsWith("Not yet") &&
    checks.correctFeedback === "Correct: vertex (2, -1)." &&
    checks.hint?.includes("h = 2") &&
    previousHref === "/lessons/graphs-and-functions/161-reflection-in-y-axis" &&
    nextHref === "/lessons/graphs-and-functions/163-transformation-order" &&
    checks.reloadReset.h === "1" &&
    checks.reloadReset.a === "2" &&
    checks.reloadReset.k === "-2" &&
    checks.reloadReset.order === "h,a,k" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0219-desktop.png") });
await copyFile(reference, path.join(out, "0219-reference.png"));
const report = {
  mockup: "0219",
  lessonId: 162,
  route: "/lessons/graphs-and-functions/162-combined-transformations",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0219-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
