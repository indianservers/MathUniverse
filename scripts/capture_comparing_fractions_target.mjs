import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0059-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-comparing-fractions-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/77-comparing-fractions";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1072, height: 1467 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0059");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-fraction-a", "data-fraction-b", "data-common-denominator", "data-common-a", "data-common-b", "data-value-a", "data-value-b", "data-comparison", "data-tab", "data-language", "data-share-state", "data-workspace-open", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Fraction B denominator").fill("8");
await page.getByLabel("Fraction B numerator").fill("6");
checks.equivalent = await state();
await page.getByLabel("Fraction A numerator").fill("2");
checks.lessThan = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("Fraction A bar part 2").dragTo(page.getByLabel("Fraction A bar part 3"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByLabel("Fraction B bar part 4").click();
checks.greaterThan = await state();
await node.getByRole("button", { name: "4 Number line", exact: true }).click();
checks.numberLineTab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0059"]')?.getAttribute("data-share-state") !== "Share");
checks.shared = await state();
await node.locator(".compare77-workspace").click();
checks.workspace = await state();
await node.getByRole("button", { name: /Try: Compare 3\/4 and 7\/9/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: /Reset/ }).click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".compare77-page"), regions: {
      hero: region(".compare77-hero"), tabs: region(".compare77-tabs"), layout: region(".compare77-layout"), proof: region(".compare77-proof"), side: region(".compare77-side"),
      understand: region(".compare77-understand"), convert: region(".compare77-convert"), compare: region(".compare77-compare"), numberLine: region(".compare77-number-line"), practice: region(".compare77-practice"),
      glance: region(".compare77-glance"), navigation: region(".compare77-navigation"), footer: region(".compare77-footer"),
    },
  };
});
const passed =
  checks.initial["fraction-a"] === "3/4" && checks.initial["fraction-b"] === "4/7" && checks.initial["common-denominator"] === "28" && checks.initial["common-a"] === "21" && checks.initial["common-b"] === "16" && checks.initial.comparison === ">" &&
  checks.equivalent["fraction-b"] === "6/8" && checks.equivalent["common-denominator"] === "8" && checks.equivalent["common-a"] === "6" && checks.equivalent["common-b"] === "6" && checks.equivalent.comparison === "=" &&
  checks.lessThan["fraction-a"] === "2/4" && checks.lessThan.comparison === "<" && checks.dragged["fraction-a"] === "3/4" && checks.dragged.comparison === "=" && checks.dragRecorded &&
  checks.greaterThan["fraction-b"] === "3/8" && checks.greaterThan.comparison === ">" && checks.numberLineTab.tab === "Number line" && checks.language.language.startsWith("Hindi") && ["Copied", "Ready"].includes(checks.shared["share-state"]) && checks.workspace["workspace-open"] === "true" &&
  checks.practice["fraction-a"] === "3/4" && checks.practice["fraction-b"] === "7/9" && checks.practice["common-denominator"] === "36" && checks.practice["common-a"] === "27" && checks.practice["common-b"] === "28" && checks.practice.comparison === "<" && checks.practice["practice-loaded"] === "true" &&
  checks.restored["fraction-a"] === "3/4" && checks.restored["fraction-b"] === "4/7" && checks.restored["common-denominator"] === "28" && checks.restored.comparison === ">" && checks.restored.tab === "Understand" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0059-desktop.png") });
await copyFile(reference, path.join(out, "0059-reference.png"));
const report = { mockup: "0059", lessonId: 77, route: "/lessons/numbers-and-arithmetic/77-comparing-fractions", objectModel: "dual-editable-fractions-draggable-unit-bars-lcm-common-units-cross-product-ordering-shared-number-line-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0059-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
