/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0544-interactive-advanced-matrices-and-linear-algebra-eigenvalues-and-eigenvectors-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/359-eigenvalues-and-eigenvectors";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0544");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "matrix",
    "roots",
    "vectors",
    "vector",
    "av",
    "lambda",
    "eigen",
    "tab",
    "challenge",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, a) =>
        Object.fromEntries(a.map((k) => [k, n.getAttribute(`data-${k}`)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Matrix entry 1").fill("3");
checks.edited = await state();
await lesson
  .getByRole("button", { name: "Reset", exact: true })
  .first()
  .click();
const circle = lesson.locator(".eig359-graph > svg > circle"),
  box = await circle.boundingBox();
await page.mouse.move(box.x + 4, box.y + 4);
await page.mouse.down();
await page.mouse.move(box.x + 70, box.y + 45);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Check eigenpair" }).click();
checks.rejectedPair = await state();
await lesson.getByRole("button", { name: "Use preset" }).click();
await lesson.getByRole("button", { name: "Check eigenpair" }).click();
checks.acceptedPair = await state();
await lesson.getByLabel("Challenge x").fill("1");
await lesson.getByLabel("Challenge y").fill("1");
await lesson.getByRole("button", { name: "Check direction" }).click();
checks.rejectedChallenge = await state();
await lesson.getByLabel("Challenge y").fill("-1");
await lesson.getByRole("button", { name: "Check direction" }).click();
await lesson.getByRole("button", { name: "Theory", exact: true }).click();
checks.acceptedChallenge = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0544"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
    const b = await page.locator(s).first().boundingBox();
    return b
      ? {
          top: Math.round(b.y),
          left: Math.round(b.x),
          width: Math.round(b.width),
          height: Math.round(b.height),
          bottom: Math.round(b.y + b.height),
        }
      : null;
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await rect(".eig359-hero"),
    setup: await rect(".eig359-setup"),
    graph: await rect(".eig359-graph"),
    analysis: await rect(".eig359-analysis"),
    challenge: await rect(".eig359-challenge"),
    adjacent: await rect(".lesson-adjacent-nav"),
  };
const passed =
  checks.initial.roots === "[3,1]" &&
  checks.initial.vectors === "[[1,1],[1,-1]]" &&
  checks.initial.av === "[3,3]" &&
  checks.initial.lambda === "3" &&
  checks.initial.eigen === "true" &&
  checks.edited.roots === "[3.618,1.382]" &&
  checks.dragged.vector !== "[1,-1]" &&
  checks.rejectedPair.eigen === "false" &&
  checks.acceptedPair.eigen === "true" &&
  checks.rejectedChallenge.challenge === "incorrect" &&
  checks.acceptedChallenge.challenge === "correct" &&
  checks.acceptedChallenge.tab === "Theory" &&
  checks.reset.actions === "0" &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0544-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0544-reference.png"));
await writeFile(
  path.join(evidence, "0544-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0544", lessonId: 359, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
