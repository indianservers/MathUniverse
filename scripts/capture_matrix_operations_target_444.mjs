/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0350-interactive-intermediate-advanced-cas-workspace-matrix-operations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/symbolic-mathematics/444-matrix-operations";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1014, height: 1551 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0350");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "matrix",
        "determinant",
        "orientation",
        "feedback",
        "challenge",
        "answer",
        "active-tab",
        "view",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
for (const [index, value] of ["1", "2", "3", "4"].entries())
  await lesson.getByLabel(`Matrix entry ${index + 1}`, { exact: true }).fill(value);
checks.edited = await state();
checks.editedVertices = await lesson
  .getByRole("img", { name: /Unit square transformed/ })
  .locator("text")
  .allTextContents();
await lesson.getByLabel("Workspace view").selectOption("table");
checks.table = {
  state: await state(),
  visible: await lesson.getByText("det(A) = -2").isVisible(),
  transformed: await lesson.getByRole("cell", { name: "(3,7)" }).isVisible(),
};
await lesson
  .locator('[data-lesson-control="matrix-tab-explain"]')
  .click();
checks.tab = await state();
await page.evaluate(() => scrollTo(0, 0));
await lesson.getByLabel("Practice x coordinate").fill("4");
await lesson.locator('[data-lesson-control="matrix-check"]').click();
checks.rejected = await state();
await lesson.getByLabel("Practice x coordinate").fill("5");
await lesson.locator('[data-lesson-control="matrix-check"]').click();
checks.accepted = await state();
await lesson.getByLabel("Practice matrix entry 1").fill("2");
await lesson.locator('[data-lesson-control="matrix-check"]').click();
checks.recalculatedReject = await state();
await lesson.getByLabel("Practice x coordinate").fill("6");
await lesson.locator('[data-lesson-control="matrix-check"]').click();
checks.recalculatedAccept = await state();
await lesson.locator('[data-lesson-control="matrix-new-challenge"]').click();
await lesson.locator('[data-lesson-control="matrix-check"]').click();
checks.newChallenge = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0350"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson.getByRole("link", { name: /Next/ }).getAttribute("href"),
};
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    element.scrollLeft = 0;
    element.scrollTop = 0;
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((key) => [
        key,
        Math.round(box[key]),
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
    header: rect(".lesson-shell-header"),
    tabs: rect(".mo444-tabs"),
    flow: rect(".mo444-flow"),
    workspace: rect(".mo444-workspace"),
    learning: rect(".mo444-learning"),
    practice: rect(".mo444-practice"),
    adjacent: rect(".mo444-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.matrix === "2,3,-1,4" &&
  checks.initial.determinant === "11" &&
  checks.initial.orientation === "orientation preserved" &&
  checks.edited.matrix === "1,2,3,4" &&
  checks.edited.determinant === "-2" &&
  checks.edited.orientation === "orientation reversed" &&
  checks.editedVertices.some((text) => text.includes("C′(3,7)")) &&
  checks.table.state.view === "table" &&
  checks.table.visible &&
  checks.table.transformed &&
  checks.tab["active-tab"] === "Explain" &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.recalculatedReject.challenge === "2,2,-2,1" &&
  checks.recalculatedReject.feedback === "incorrect" &&
  checks.recalculatedAccept.feedback === "correct" &&
  checks.newChallenge.challenge === "2,-1,1,3" &&
  checks.newChallenge.answer === "0,7" &&
  checks.newChallenge.feedback === "correct" &&
  checks.reset.matrix === "2,3,-1,4" &&
  checks.reset.view === "graph" &&
  checks.reset["active-tab"] === "Interaction + visualization" &&
  checks.reset.actions === "0" &&
  navigation.previousHref ===
    "/lessons/symbolic-mathematics/443-differential-equations" &&
  navigation.nextHref ===
    "/lessons/symbolic-mathematics/445-complex-calculations" &&
  metrics.document.width === 1014 &&
  Math.abs(metrics.document.height - 1551) <= 3 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 203 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0350",
  lessonId: 444,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({ path: path.join(evidence, "0350-desktop.png"), fullPage: true });
await copyFile(reference, path.join(evidence, "0350-reference.png"));
await writeFile(
  path.join(evidence, "0350-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
