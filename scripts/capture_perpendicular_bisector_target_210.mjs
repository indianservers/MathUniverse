import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0267-interactive-foundational-advanced-dynamic-geometry-constructions-perpendicular-bisector-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/210-perpendicular-bisector",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0267");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) =>
      Object.fromEntries(
        [
          "a",
          "b",
          "midpoint",
          "radius",
          "mode",
          "visibility",
          "stage",
          "practice-point",
          "practice",
        ].map((k) => [k, n.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
const drag = async (id, dx, dy) => {
  const b = await lesson.getByTestId(id).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + dx, b.y + b.height / 2 + dy, {
    steps: 6,
  });
  await page.mouse.up();
};
await drag("bisector-point-a", 30, -20);
checks.aDrag = await state();
await drag("bisector-point-b", -20, 25);
checks.bDrag = await state();
await lesson.getByRole("button", { name: "Custom", exact: true }).click();
await lesson.getByLabel("Arc radius").fill("7");
checks.custom = await state();
await lesson.getByText("Show arcs", { exact: true }).last().click();
checks.visibility = await state();
for (const name of ["Manipulate", "Notice", "Understand", "Try", "Observe"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.stages = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.share = await lesson.getByRole("status").first().textContent();
await drag("bisector-practice-c", 55, 0);
checks.practiceMoved = await state();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await lesson.getByText(/equal distances CA and CB/).textContent();
const previousHref = await lesson
    .locator('a[href="/lessons/geometry/209-parallel-line"]')
    .getAttribute("href"),
  nextHref = await lesson
    .locator('a[href="/lessons/geometry/211-angle-bisector"]')
    .getAttribute("href");
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const r = (s) => {
    const b = globalThis.document.querySelector(s)?.getBoundingClientRect();
    return b
      ? {
          top: b.top,
          left: b.left,
          width: b.width,
          height: b.height,
          bottom: b.bottom,
        }
      : null;
  };
  return {
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    overflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    sidebar: r('[data-testid="desktop-sidebar"]'),
    header: r('[data-testid="dynamic-geometry-mockup-0267"] > header'),
    stages: r(
      '[data-testid="dynamic-geometry-mockup-0267"] > nav:first-of-type',
    ),
    workspace: r(
      '[data-testid="dynamic-geometry-mockup-0267"] > nav:first-of-type + section',
    ),
    cards: r("#bisector-insight"),
    footer: r('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.a === "-4:0" &&
  checks.initial.b === "4:0" &&
  checks.aDrag.a !== checks.initial.a &&
  checks.bDrag.b !== checks.initial.b &&
  checks.custom.mode === "custom" &&
  checks.custom.radius === "7.0000" &&
  checks.visibility.visibility.startsWith("0:") &&
  checks.stages.stage === "0" &&
  checks.share?.length > 0 &&
  checks.practiceMoved["practice-point"] !== checks.initial["practice-point"] &&
  checks.rejected.practice === "incorrect" &&
  checks.accepted.practice === "correct" &&
  checks.hint?.length > 0 &&
  previousHref === "/lessons/geometry/209-parallel-line" &&
  nextHref === "/lessons/geometry/211-angle-bisector" &&
  metrics.sidebar?.width === 208 &&
  metrics.header?.top === 99 &&
  metrics.header?.left === 223 &&
  metrics.workspace?.top === 390 &&
  metrics.cards?.top === 970 &&
  metrics.footer?.top === 1401 &&
  !metrics.overflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0267-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0267-reference.png"));
const report = {
  mockup: "0267",
  lessonId: 210,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0267-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
