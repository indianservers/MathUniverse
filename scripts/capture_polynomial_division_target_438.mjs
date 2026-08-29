import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0344-interactive-intermediate-advanced-cas-workspace-polynomial-division-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/symbolic-mathematics/438-polynomial-division";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1016, height: 1548 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0344");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      ["mode", "quotient", "remainder", "identity", "feedback"].map((key) => [
        key,
        node.getAttribute(`data-${key}`),
      ]),
    ),
  );
const checks = { initial: await state() };

await lesson.getByLabel("dividend coefficient 1").fill("3");
checks.edited = await state();
await lesson.locator('[data-lesson-control="division-synthetic-mode"]').click();
checks.synthetic = await state();
await lesson.getByLabel("divisor coefficient 1").fill("0");
checks.invalidVisible = await lesson
  .getByText("Enter a non-zero leading divisor coefficient.")
  .isVisible();
await page.getByTitle("Reset lesson progress").click();
await page.waitForFunction(
  () =>
    globalThis.document
      .querySelector('[data-testid="symbolic-cas-mockup-0344"]')
      ?.getAttribute("data-quotient") === "1,3.5,6.5,15",
);
checks.reset = await state();

for (const [label, value] of [
  ["Practice x squared coefficient", "3"],
  ["Practice x coefficient", "8"],
  ["Practice constant", "10"],
  ["Practice remainder", "23"],
])
  await lesson.getByLabel(label).fill(value);
await lesson.locator('[data-lesson-control="division-practice-check"]').click();
checks.rejected = await state();
await lesson.getByLabel("Practice constant").fill("11");
await lesson.locator('[data-lesson-control="division-practice-check"]').click();
checks.accepted = await state();
await lesson.locator('[data-lesson-control="division-show-answer"]').click();
checks.answerVisible = await lesson
  .getByText("Q(x) = 3x² + 8x + 11, R = 23")
  .isVisible();

const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson
    .getByRole("link", { name: /Next/ })
    .getAttribute("href"),
};
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = globalThis.document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return {
      top: Math.round(box.top),
      left: Math.round(box.left),
      width: Math.round(box.width),
      height: Math.round(box.height),
      bottom: Math.round(box.bottom),
    };
  };
  return {
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    overflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect(".lesson-shell-header"),
    tabs: rect(".pd438-tabs"),
    flow: rect(".pd438-flow"),
    workspace: rect(".pd438-workspace"),
    learning: rect(".pd438-learning"),
    practice: rect(".pd438-practice"),
    adjacent: rect(".pd438-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
await page.getByTitle("Reset lesson progress").click();
await page.waitForFunction(
  () =>
    globalThis.document
      .querySelector('[data-testid="symbolic-cas-mockup-0344"]')
      ?.getAttribute("data-feedback") === "idle",
);
const passed =
  checks.initial.quotient === "1,3.5,6.5,15" &&
  checks.initial.remainder === "58" &&
  checks.initial.identity === "2,3,-1,4,-2" &&
  checks.edited.identity === "3,3,-1,4,-2" &&
  checks.synthetic.mode === "synthetic" &&
  checks.invalidVisible &&
  checks.reset.mode === "long" &&
  checks.reset.quotient === "1,3.5,6.5,15" &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.answerVisible &&
  navigation.previousHref ===
    "/lessons/symbolic-mathematics/437-partial-fractions" &&
  navigation.nextHref === "/lessons/symbolic-mathematics/439-derivatives" &&
  metrics.document.width === 1016 &&
  metrics.document.height === 1548 &&
  metrics.header?.top === 91 &&
  metrics.tabs?.top === 325 &&
  metrics.workspace?.top === 473 &&
  metrics.footer?.bottom === 1548 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0344",
  lessonId: 438,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0344-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0344-reference.png"));
await writeFile(
  path.join(evidence, "0344-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
