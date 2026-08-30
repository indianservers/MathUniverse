/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0378-interactive-advanced-limits-and-differential-calculus-concavity-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/299-concavity";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 967, height: 1627 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0378");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "model",
        "x",
        "h",
        "f",
        "fp",
        "fpp",
        "approx",
        "concavity",
        "roots",
        "result",
        "solution",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Concavity x").fill("0.1");
checks.xDriven = await state();
await lesson.getByLabel("Concavity h").fill("0.1");
checks.step = await state();
await lesson.getByLabel("Concavity function").selectOption("2");
checks.model = await state();
const point = lesson.locator('[data-drag="concavity-point"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Concavity point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 40, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByText("A", { exact: true }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByText("C", { exact: true }).click();
await lesson.getByRole("button", { name: "Show solution" }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0378"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0378").waitFor({ timeout: 600000 });
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((k) => [
        k,
        Math.round(b[k]),
      ]),
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".con299-hero"),
    tabs: rect(".con299-tabs"),
    main: rect(".con299-main"),
    workspace: rect(".con299-main .workspace"),
    flow: rect(".con299-flow"),
    info: rect(".con299-info"),
    practice: rect(".con299-practice"),
    adjacent: rect(".con299-adjacent"),
  };
});
const passed =
  checks.initial.model === "0" &&
  checks.initial.x === "-1.2" &&
  checks.initial.h === "0.2" &&
  checks.initial.f === "-23.5008" &&
  checks.initial.fp === "72.576" &&
  checks.initial.fpp === "-167.04" &&
  checks.initial.approx === "-167.68" &&
  checks.initial.concavity === "Concave down" &&
  checks.initial.roots === "0,0.25" &&
  checks.xDriven.fpp === "1.44" &&
  checks.xDriven.concavity === "Concave up" &&
  Math.abs(Number(checks.step.approx) - Number(checks.step.fpp)) <
    Math.abs(Number(checks.xDriven.approx) - Number(checks.xDriven.fpp)) &&
  checks.model.model === "2" &&
  checks.model.roots === "0" &&
  checks.dragged.x !== checks.model.x &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.solution === "true" &&
  checks.reset.model === "0" &&
  checks.reset.x === "-1.2" &&
  checks.reset.h === "0.2" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 967 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0378",
  lessonId: 299,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0378-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0378-reference.png"));
await writeFile(
  path.join(evidence, "0378-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
