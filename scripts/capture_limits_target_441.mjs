import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0347-interactive-intermediate-advanced-cas-workspace-limits-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/symbolic-mathematics/441-limits";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1042, height: 1509 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0347");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "point",
        "expression",
        "limit",
        "direction",
        "step",
        "places",
        "actions",
        "feedback",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.locator('[data-lesson-control="limit-direction-left"]').click();
await lesson.locator('[data-lesson-control="limit-step"]').selectOption("0.01");
await lesson.locator('[data-lesson-control="limit-places"]').selectOption("3");
checks.controls = await state();
await lesson.getByRole("spinbutton", { name: "Limit point" }).fill("3");
checks.mismatch = await state();
await lesson.getByLabel("Limit expression").fill("(x^2-9)/(x-3)");
checks.edited = await state();
await lesson.locator('[data-lesson-control="limit-random"]').click();
checks.random = await state();
await page.getByTitle("Reset lesson progress").click();
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0347"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
const hole = lesson.locator('[data-lesson-control="limit-hole"]'),
  box = await hole.boundingBox();
if (!box) throw Error("Hole drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 32, box.y + box.height / 2, {
  steps: 8,
});
await page.mouse.up();
checks.dragged = await state();
await page.getByTitle("Reset lesson progress").click();
await lesson.getByLabel("Your answer").fill("5");
await lesson.locator('[data-lesson-control="limit-practice-check"]').click();
checks.rejected = await state();
await lesson.getByLabel("Your answer").fill("6");
await lesson.locator('[data-lesson-control="limit-practice-check"]').click();
checks.accepted = await state();
await lesson.locator('[data-lesson-control="limit-new-challenge"]').click();
checks.challengeReset = await state();
await page.getByTitle("Reset lesson progress").click();
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
    tabs: rect(".lm441-tabs"),
    workspace: rect(".lm441-work"),
    info: rect(".lm441-info"),
    practice: rect(".lm441-practice"),
    adjacent: rect(".lm441-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.point === "2" &&
  checks.initial.limit === "4" &&
  checks.controls.direction === "left" &&
  checks.controls.step === "0.01" &&
  checks.controls.places === "3" &&
  checks.mismatch.limit === "DNE" &&
  checks.edited.limit === "6" &&
  checks.random.point === "4" &&
  checks.random.expression === "(x^2-16)/(x-4)" &&
  checks.reset.actions === "0" &&
  checks.dragged.point !== "2" &&
  checks.dragged.expression !== "(x^2-4)/(x-2)" &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.challengeReset.feedback === "idle" &&
  navigation.previousHref === "/lessons/symbolic-mathematics/440-integrals" &&
  navigation.nextHref ===
    "/lessons/symbolic-mathematics/442-series-expansions" &&
  metrics.document.width === 1042 &&
  !metrics.overflow &&
  metrics.footer?.height === 0 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0347",
  lessonId: 441,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0347-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0347-reference.png"));
await writeFile(
  path.join(evidence, "0347-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
