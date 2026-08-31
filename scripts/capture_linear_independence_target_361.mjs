/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0546-interactive-advanced-matrices-and-linear-algebra-linear-independence-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/361-linear-independence";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1535 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0546");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "v1",
    "v2",
    "det",
    "area",
    "rank",
    "independent",
    "relation",
    "combination",
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
await lesson.getByLabel("v₂ component 1").fill("4");
await lesson.getByLabel("v₂ component 2").fill("2");
checks.dependent = await state();
await lesson.getByLabel("Coefficient c1").fill("4");
await lesson.getByLabel("Coefficient c2").fill("-2");
checks.relation = await state();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.failedChallenge = await state();
await lesson.getByLabel("v₂ component 2").fill("3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.passedChallenge = await state();
await lesson.getByRole("button", { name: "Reset vectors" }).click();
const circle = lesson.locator(".ind361-plot svg circle").first(),
  box = await circle.boundingBox();
await page.mouse.move(box.x + 3, box.y + 3);
await page.mouse.down();
await page.mouse.move(box.x + 38, box.y - 24);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Show steps").check();
await lesson.getByRole("button", { name: "Concept", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0546"]')
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
    hero: await rect(".ind361-hero"),
    tabs: await rect(".ind361-tabs"),
    lab: await rect(".ind361-lab"),
    metrics: await rect(".ind361-metrics"),
    relation: await rect(".ind361-relation"),
    examples: await rect(".ind361-examples"),
    challenge: await rect(".ind361-challenge"),
    adjacent: await rect(".lesson-adjacent-nav"),
  };
const passed =
  checks.initial.det === "5" &&
  checks.initial.area === "5" &&
  checks.initial.rank === "2" &&
  checks.initial.independent === "true" &&
  checks.dependent.det === "0" &&
  checks.dependent.rank === "1" &&
  checks.dependent.relation === "[4,-2]" &&
  checks.relation.combination === "[0,0]" &&
  checks.failedChallenge.challenge === "incorrect" &&
  checks.passedChallenge.challenge === "correct" &&
  checks.dragged.v1 !== "[2,1]" &&
  checks.tabbed.tab === "Concept" &&
  checks.reset.actions === "0" &&
  metrics.document.height === 1535 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0546-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0546-reference.png"));
await writeFile(
  path.join(evidence, "0546-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0546", lessonId: 361, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
