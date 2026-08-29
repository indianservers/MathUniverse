import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0346-interactive-intermediate-advanced-cas-workspace-integrals-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/symbolic-mathematics/440-integrals";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 983, height: 1601 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0346");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      ["input", "valid", "antiderivative", "auto", "challenge", "feedback"].map(
        (key) => [key, node.getAttribute(`data-${key}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Integrand").fill("4*x^3-2*x");
await lesson.locator('[data-lesson-control="integral-run"]').click();
checks.edited = await state();
await lesson.getByLabel("Integrand").fill("sin(x)");
checks.invalid = await state();
await lesson.locator('[data-lesson-control="integral-auto-check"]').uncheck();
checks.autoOff = await state();
await page.getByTitle("Reset lesson progress").click();
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0346"]')
      ?.getAttribute("data-input") === "3*x^2+2",
);
checks.reset = await state();
await lesson.getByLabel("Challenge antiderivative").fill("x^5-1.5*x^2+7*x+C");
await lesson.locator('[data-lesson-control="integral-check"]').click();
checks.acceptedDecimal = await state();
await lesson.getByLabel("Challenge antiderivative").fill("x^5-3/2*x^2+7*x+C");
await lesson.locator('[data-lesson-control="integral-check"]').click();
checks.acceptedFraction = await state();
await lesson.getByLabel("Challenge antiderivative").fill("x^5-3*x^2+7*x+C");
await lesson.locator('[data-lesson-control="integral-check"]').click();
checks.rejected = await state();
await lesson.locator('[data-lesson-control="integral-practice-run"]').click();
await lesson.locator('[data-lesson-control="integral-check"]').click();
checks.generated = await state();
await lesson.locator('[data-lesson-control="integral-new-challenge"]').click();
checks.nextChallenge = await state();
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
    tabs: rect(".in440-tabs"),
    flow: rect(".in440-flow"),
    workspace: rect(".in440-work"),
    cards: rect(".in440-cards"),
    practice: rect(".in440-practice"),
    adjacent: rect(".in440-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.antiderivative === "x^3 +2x + C" &&
  checks.initial.valid === "true" &&
  checks.edited.antiderivative === "x^4 -x^2 + C" &&
  checks.invalid.valid === "false" &&
  checks.autoOff.auto === "false" &&
  checks.reset.auto === "true" &&
  checks.acceptedDecimal.feedback === "correct" &&
  checks.acceptedFraction.feedback === "correct" &&
  checks.rejected.feedback === "incorrect" &&
  checks.generated.feedback === "correct" &&
  checks.nextChallenge.challenge === "4*x^3+6*x-5" &&
  navigation.previousHref === "/lessons/symbolic-mathematics/439-derivatives" &&
  navigation.nextHref === "/lessons/symbolic-mathematics/441-limits" &&
  metrics.document.width === 983 &&
  !metrics.overflow &&
  metrics.footer?.height === 0 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0346",
  lessonId: 440,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0346-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0346-reference.png"));
await writeFile(
  path.join(evidence, "0346-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
