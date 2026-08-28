import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0217-interactive-intermediate-function-transformations-reflection-in-x-axis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/160-reflection-in-x-axis";
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
const node = page.getByTestId("graph-mockup-0217");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "scale",
    "shift",
    "sample",
    "parent-output",
    "reflected-output",
    "x-unchanged",
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
    const scale = Number(item.scale),
      shift = Number(item.shift),
      sample = Number(item.sample);
    return (
      Math.abs(Number(item["parent-output"]) - sample ** 2) < 1e-8 &&
      Math.abs(
        Number(item["reflected-output"]) - (-scale * sample ** 2 + shift),
      ) < 1e-8 &&
      item["x-unchanged"] === "true"
    );
  };
const checks = { initial: await state() };
const scaleRange = node.getByRole("slider", {
    name: "Reflection scale",
    exact: true,
  }),
  scaleRangeBox = await scaleRange.boundingBox();
if (!scaleRangeBox) throw new Error("Reflection scale range unavailable");
await page.mouse.click(
  scaleRangeBox.x + scaleRangeBox.width * 0.8,
  scaleRangeBox.y + scaleRangeBox.height / 2,
);
checks.scaleRange = await state();
const shiftRange = node.getByRole("slider", {
    name: "Vertical shift",
    exact: true,
  }),
  shiftRangeBox = await shiftRange.boundingBox();
if (!shiftRangeBox) throw new Error("Vertical shift range unavailable");
await page.mouse.click(
  shiftRangeBox.x + shiftRangeBox.width * 0.7,
  shiftRangeBox.y + shiftRangeBox.height / 2,
);
checks.shiftRange = await state();
await node
  .getByRole("button", { name: "Reset transform controls", exact: true })
  .click();
const reflectedPoint = node.getByRole("slider", {
  name: "Drag reflected point",
  exact: true,
});
let pointBox = await reflectedPoint.boundingBox();
if (!pointBox) throw new Error("Reflected graph point unavailable");
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2 + 55,
  { steps: 12 },
);
await page.mouse.up();
checks.scalePointDrag = await state();
await reflectedPoint.focus();
await reflectedPoint.press("ArrowUp");
checks.pointKeyboard = await state();
await node.getByRole("button", { name: "0", exact: true }).click();
pointBox = await reflectedPoint.boundingBox();
if (!pointBox) throw new Error("Zero-sample graph point unavailable");
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2 - 48,
  { steps: 10 },
);
await page.mouse.up();
checks.zeroPointDrag = await state();
await node.getByRole("button", { name: "2", exact: true }).click();
checks.sampleButton = await state();
await node.locator(".rx160-table tbody tr").first().click();
checks.tableRow = await state();
const previousHref = await page
    .getByRole("link", {
      name: /Previous Horizontal Stretch and Compression/,
    })
    .getAttribute("href"),
  nextHref = await page
    .getByRole("link", { name: /Next Reflection in y-Axis/ })
    .getAttribute("href");
await node
  .getByRole("button", { name: "Reset transform controls", exact: true })
  .click();
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
      page: region(".rx160-page"),
      surface: region(".rx160-surface"),
      header: region(".rx160-header"),
      workspace: region(".rx160-workspace"),
      plot: region(".rx160-plot"),
      controls: region(".rx160-controls"),
      table: region(".rx160-table"),
      rule: region(".rx160-rule"),
      concepts: region(".rx160-concepts"),
      navigation: region(".lesson-adjacent-nav"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.scaleRange,
    checks.shiftRange,
    checks.scalePointDrag,
    checks.pointKeyboard,
    checks.zeroPointDrag,
    checks.sampleButton,
    checks.tableRow,
    checks.reset,
  ],
  passed =
    checks.initial.scale === "1" &&
    checks.initial.shift === "0" &&
    checks.initial.sample === "-2" &&
    checks.initial["parent-output"] === "4" &&
    checks.initial["reflected-output"] === "-4" &&
    Number(checks.scaleRange.scale) > 2 &&
    Number(checks.shiftRange.shift) > 0 &&
    Number(checks.scalePointDrag.scale) > 1 &&
    Math.abs(
      Number(checks.pointKeyboard.scale) -
        Number(checks.scalePointDrag.scale) +
        0.25,
    ) < 1e-8 &&
    checks.zeroPointDrag.sample === "0" &&
    Number(checks.zeroPointDrag.shift) > 0 &&
    checks.sampleButton.sample === "2" &&
    checks.tableRow.sample === "-2" &&
    previousHref ===
      "/lessons/graphs-and-functions/159-horizontal-stretch-and-compression" &&
    nextHref === "/lessons/graphs-and-functions/161-reflection-in-y-axis" &&
    checks.reset.scale === "1" &&
    checks.reset.shift === "0" &&
    checks.reset.sample === "-2" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0217-desktop.png") });
await copyFile(reference, path.join(out, "0217-reference.png"));
const report = {
  mockup: "0217",
  lessonId: 160,
  route: "/lessons/graphs-and-functions/160-reflection-in-x-axis",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0217-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
