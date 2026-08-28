import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, getComputedStyle, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0221-interactive-intermediate-function-transformations-parameter-explorer-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/164-parameter-explorer";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 999, height: 1575 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0221");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((el) =>
    Object.fromEntries(
      ["a", "h", "k", "equation", "stage"].map((n) => [
        n,
        el.getAttribute(`data-${n}`),
      ]),
    ),
  );
const checks = { initial: await state() };
for (const [name, value] of [
  ["a Vertical stretch/compression & reflection", "-2"],
  ["h Horizontal shift", "-3"],
  ["k Vertical shift", "1"],
]) {
  await node.getByRole("slider", { name }).fill(value);
}
checks.ranges = await state();
const vertex = node.getByRole("slider", { name: "Drag transformed vertex" }),
  box = await vertex.boundingBox();
if (!box) throw new Error("vertex missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 29, box.y + box.height / 2 - 29, {
  steps: 8,
});
await page.mouse.up();
checks.pointer = await state();
await vertex.focus();
await vertex.press("ArrowLeft");
await vertex.press("ArrowDown");
checks.keyboard = await state();
for (const stage of ["Observe", "Understand", "Example", "Practice", "Explore"])
  await node.getByRole("button", { name: stage }).click();
checks.stages = await state();
await node.getByRole("button", { name: "Fit" }).click();
checks.reset = await state();
const practiceA = node.getByRole("slider", { name: "Practice a" });
await practiceA.scrollIntoViewIfNeeded();
checks.practiceGeometry = await practiceA.evaluate((element) => {
  const rect = element.getBoundingClientRect(),
    style = getComputedStyle(element);
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    display: style.display,
    visibility: style.visibility,
  };
});
await practiceA.fill("2");
await node.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await node.getByRole("status").textContent();
await practiceA.fill("1");
await node.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await node.getByRole("status").textContent();
await node.getByRole("button", { name: "Need help?" }).click();
checks.hint = await node.getByText("Use a = 1, h = -2, k = -1.").isVisible();
const previousHref = await node
    .getByRole("link", { name: /Previous Transformation Order/ })
    .getAttribute("href"),
  nextHref = await node
    .getByRole("link", { name: /Next Parent-Function Library/ })
    .getAttribute("href");
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll("*").forEach((el) => {
    if (el.scrollTop) el.scrollTop = 0;
  });
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const region = (s) => {
    const r = document.querySelector(s)?.getBoundingClientRect();
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
      page: region(".pe164-page"),
      header: region(".pe164-header"),
      tabs: region(".pe164-tabs"),
      lab: region(".pe164-lab"),
      graph: region(".pe164-live"),
      controls: region(".pe164-controls"),
      observe: region(".pe164-observe"),
      rules: region(".pe164-rule-row"),
      practice: region(".pe164-practice"),
      navigation: region(".pe164-nav"),
      footer: region(".pe164-footer"),
    },
  };
});
const passed =
  checks.initial.a === "1.5" &&
  checks.initial.h === "1" &&
  checks.initial.k === "2" &&
  checks.ranges.a === "-2" &&
  checks.ranges.h === "-3" &&
  checks.ranges.k === "1" &&
  checks.pointer.h === "-2" &&
  checks.pointer.k === "2" &&
  checks.keyboard.h === "-2.5" &&
  checks.keyboard.k === "1.5" &&
  checks.stages.stage === "Explore" &&
  checks.reset.a === "1.5" &&
  checks.correct?.startsWith("Correct") &&
  checks.wrong?.startsWith("Not yet") &&
  checks.hint &&
  previousHref === "/lessons/graphs-and-functions/163-transformation-order" &&
  nextHref === "/lessons/graphs-and-functions/165-parent-function-library" &&
  metrics.document.width === 999 &&
  metrics.document.height === 1575 &&
  metrics.regions.page?.top === 99 &&
  metrics.regions.page?.left === 226 &&
  metrics.regions.navigation?.bottom === 1460 &&
  metrics.regions.footer?.top === 1479 &&
  metrics.regions.footer?.left === 12 &&
  metrics.regions.footer?.right === 987 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0221-desktop.png") });
await copyFile(reference, path.join(out, "0221-reference.png"));
const report = {
  mockup: "0221",
  lessonId: 164,
  route: "/lessons/graphs-and-functions/164-parameter-explorer",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0221-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
