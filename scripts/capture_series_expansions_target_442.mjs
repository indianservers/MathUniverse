import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0348-interactive-intermediate-advanced-cas-workspace-series-expansions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/symbolic-mathematics/442-series-expansions";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1017, height: 1546 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0348");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "function",
        "center",
        "degree",
        "value",
        "error",
        "actions",
        "feedback",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Function f(x)").selectOption("sin");
await lesson.getByLabel("Center a").fill("1");
await lesson.getByLabel("Degree n").click();
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("ArrowLeft");
checks.edited = await state();
await lesson.locator('[data-lesson-control="series-tab-2"]').click();
checks.tabActions = (await state()).actions;
await lesson.getByLabel("Enter numeric answer").fill("2");
await lesson.locator('[data-lesson-control="series-practice-check"]').click();
checks.rejected = await state();
await lesson.getByLabel("Enter numeric answer").fill("2.0135714");
await lesson.locator('[data-lesson-control="series-practice-check"]').click();
checks.accepted = await state();
await lesson.locator('[data-lesson-control="series-solution"]').click();
checks.solutionVisible = await lesson
  .getByText(/T₅\(0\.7\)=2\.0135714/)
  .isVisible();
await page.getByTitle("Reset lesson progress").click();
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0348"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson
    .getByRole("link", { name: /Next/ })
    .getAttribute("href"),
};
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return {
      top: Math.round(b.top),
      left: Math.round(b.left),
      width: Math.round(b.width),
      height: Math.round(b.height),
      bottom: Math.round(b.bottom),
    };
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect(".lesson-shell-header"),
    flow: rect(".se442-flow"),
    tabs: rect(".se442-tabs"),
    builder: rect(".se442-builder"),
    learn: rect(".se442-learn"),
    practice: rect(".se442-practice"),
    adjacent: rect(".se442-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.function === "exp" &&
  checks.initial.center === "0" &&
  checks.initial.degree === "6" &&
  Math.abs(Number(checks.initial.value) - 2.7180555556) < 1e-8 &&
  checks.edited.function === "sin" &&
  checks.edited.center === "1" &&
  checks.edited.degree === "4" &&
  Math.abs(Number(checks.edited.value) - Math.sin(1)) < 1e-8 &&
  Number(checks.tabActions) > 0 &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.solutionVisible &&
  checks.reset.function === "exp" &&
  checks.reset.degree === "6" &&
  checks.reset.actions === "0" &&
  navigation.previousHref === "/lessons/symbolic-mathematics/441-limits" &&
  navigation.nextHref ===
    "/lessons/symbolic-mathematics/443-differential-equations" &&
  metrics.document.width === 1017 &&
  !metrics.overflow &&
  metrics.footer?.height === 0 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0348",
  lessonId: 442,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0348-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0348-reference.png"));
await writeFile(
  path.join(evidence, "0348-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
