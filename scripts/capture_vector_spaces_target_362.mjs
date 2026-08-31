/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0547-interactive-advanced-matrices-and-linear-algebra-vector-spaces-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/362-vector-spaces";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0547");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "candidate",
    "u",
    "v",
    "combination",
    "u-inside",
    "v-inside",
    "combination-inside",
    "zero",
    "addition",
    "scalar",
    "subspace",
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
await lesson.getByRole("button", { name: /Shifted plane/ }).click();
checks.shifted = await state();
await lesson.getByRole("button", { name: /Line through origin/ }).click();
checks.line = await state();
await lesson.getByRole("button", { name: /Curved surface/ }).click();
checks.curved = await state();
await lesson.getByRole("button", { name: /Plane through origin/ }).click();
await lesson.getByLabel("u coordinate 3").fill("1");
checks.outside = await state();
await lesson.getByRole("button", { name: "Test this set" }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Axioms", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0547"]')
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
    hero: await rect(".vs362-hero"),
    tabs: await rect(".vs362-tabs"),
    lab: await rect(".vs362-lab"),
    verdict: await rect(".vs362-verdict"),
    notes: await rect(".vs362-notes"),
    bottom: await rect(".vs362-bottom"),
    adjacent: await rect(".lesson-adjacent-nav"),
  };
const passed =
  checks.initial.combination === "[3,3,0]" &&
  checks.initial["combination-inside"] === "true" &&
  checks.initial.subspace === "true" &&
  checks.shifted.zero === "false" &&
  checks.shifted.addition === "false" &&
  checks.shifted.scalar === "false" &&
  checks.shifted.subspace === "false" &&
  checks.line.subspace === "true" &&
  checks.line["u-inside"] === "false" &&
  checks.curved.zero === "true" &&
  checks.curved.addition === "false" &&
  checks.curved.scalar === "false" &&
  checks.outside["u-inside"] === "false" &&
  checks.outside["combination-inside"] === "false" &&
  checks.challenge.candidate === "shifted" &&
  checks.challenge.challenge === "correct" &&
  checks.tabbed.tab === "Axioms" &&
  checks.reset.actions === "0" &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0547-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0547-reference.png"));
await writeFile(
  path.join(evidence, "0547-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0547", lessonId: 362, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
