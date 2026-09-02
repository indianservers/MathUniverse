/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0641-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-complement-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/584-complement";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0641");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(300);
const keys = [
    "universe",
    "a",
    "complement",
    "cardinality",
    "seed",
    "choice",
    "graded",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.locator(".co584-lab main svg g").filter({ hasText: "2" }).click();
checks.clicked = await state();
const itemOne = lesson
    .locator(".co584-lab main svg g")
    .filter({ hasText: "1" }),
  ellipse = lesson.locator(".co584-lab main ellipse"),
  oneBox = await itemOne.boundingBox(),
  ellipseBox = await ellipse.boundingBox();
if (!oneBox || !ellipseBox) throw new Error("Complement drag targets missing");
await page.mouse.move(
  oneBox.x + oneBox.width / 2,
  oneBox.y + oneBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  ellipseBox.x + ellipseBox.width / 2,
  ellipseBox.y + ellipseBox.height / 2,
  { steps: 10 },
);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: /Randomize/ }).click();
checks.random = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".co584-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson
  .locator(".co584-practice nav button")
  .filter({ hasText: /^A/ })
  .click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson
  .locator(".co584-practice nav button")
  .filter({ hasText: /^B/ })
  .click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const b = selector
    ? await lesson.locator(selector).boundingBox()
    : await lesson.boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        left: Math.round(b.x),
        width: Math.round(b.width),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  surface: await rect(null),
  hero: await rect(".co584-hero"),
  tabs: await rect(".co584-tabs"),
  lab: await rect(".co584-lab"),
  theory: await rect(".co584-theory"),
  worked: await rect(".co584-worked"),
  practice: await rect(".co584-practice"),
  adjacent: await rect(".co584-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0641-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0641").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0641-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.universe === "1,2,3,4,5,6" &&
  checks.initial.a === "2,4,6" &&
  checks.initial.complement === "1,3,5" &&
  checks.initial.cardinality === "6,3,3" &&
  checks.clicked.a === "4,6" &&
  checks.clicked.complement === "1,2,3,5" &&
  checks.clicked.cardinality === "6,2,4" &&
  checks.dragged.a === "1,4,6" &&
  checks.dragged.complement === "2,3,5" &&
  checks.random.universe === "1,2,3,4,5,6,7,8" &&
  checks.random.a === "2,5,8" &&
  checks.random.cardinality === "8,3,5" &&
  checks.reset.a === "2,4,6" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.correct.choice === "B" &&
  checks.final.complement === "1,3,5" &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0641-reference.png"));
await writeFile(
  path.join(evidence, "0641-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    { passed, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
