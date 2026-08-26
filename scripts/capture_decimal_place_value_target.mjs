import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0061-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-decimal-place-value-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/79-decimal-place-value";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1065, height: 1477 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0061");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-first", "data-second", "data-first-count", "data-second-count", "data-first-digits", "data-second-digits", "data-deciding-place", "data-comparison", "data-difference", "data-line-min", "data-line-max", "data-tab", "data-language", "data-share-state", "data-workspace-open", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("textbox", { name: "Second decimal", exact: true }).fill("0.55");
checks.hundredthsDecision = await state();
await page.getByRole("textbox", { name: "First decimal", exact: true }).fill("0.55");
checks.equal = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("First hundred grid cell 50").dragTo(page.getByLabel("First hundred grid cell 48"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByLabel("First hundred grid cell 60").click();
checks.sixty = await state();
await page.getByLabel("Decimal number line 0.55").click();
checks.numberLine = await state();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0061"]')?.getAttribute("data-share-state") !== "Share");
checks.shared = await state();
await node.locator(".decimal79-workspace").click();
checks.workspace = await state();
await node.getByRole("button", { name: /Try it!/ }).click();
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
    surface: region(".decimal79-page"), regions: {
      hero: region(".decimal79-hero"), tabs: region(".decimal79-tabs"), main: region(".decimal79-main"), lab: region(".decimal79-lab"), side: region(".decimal79-side"),
      chart: region(".decimal79-chart"), decision: region(".decimal79-decision-callout"), grids: region(".decimal79-grids"), zeroNote: region(".decimal79-zero-note"), numberLine: region(".decimal79-line"), result: region(".decimal79-lab>footer"),
      navigation: region(".decimal79-navigation"), footer: region(".decimal79-footer"),
    },
  };
});
const passed =
  checks.initial.first === "0.50" && checks.initial.second === "0.47" && checks.initial["first-count"] === "50" && checks.initial["second-count"] === "47" && checks.initial["first-digits"] === "0,5,0" && checks.initial["second-digits"] === "0,4,7" && checks.initial["deciding-place"] === "Tenths" && checks.initial.comparison === ">" && checks.initial.difference === "3" &&
  checks.hundredthsDecision.second === "0.55" && checks.hundredthsDecision["deciding-place"] === "Hundredths" && checks.hundredthsDecision.comparison === "<" &&
  checks.equal.first === "0.55" && checks.equal["deciding-place"] === "Equal" && checks.equal.comparison === "=" &&
  checks.dragged.first === "0.48" && checks.dragged["first-count"] === "48" && checks.dragged.comparison === "<" && checks.dragRecorded &&
  checks.sixty.first === "0.60" && checks.sixty["first-digits"] === "0,6,0" && checks.sixty.comparison === ">" && checks.numberLine.first === "0.55" && checks.numberLine.comparison === "=" &&
  checks.explain.tab === "Explain" && checks.language.language.startsWith("Hindi") && ["Copied", "Ready"].includes(checks.shared["share-state"]) && checks.workspace["workspace-open"] === "true" &&
  checks.practice.first === "0.60" && checks.practice.second === "0.58" && checks.practice["first-count"] === "60" && checks.practice["second-count"] === "58" && checks.practice["deciding-place"] === "Tenths" && checks.practice.comparison === ">" && checks.practice.difference === "2" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.first === "0.50" && checks.restored.second === "0.47" && checks.restored.tab === "Interaction + visualization" && checks.restored.comparison === ">" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0061-desktop.png") });
await copyFile(reference, path.join(out, "0061-reference.png"));
const report = { mockup: "0061", lessonId: 79, route: "/lessons/numbers-and-arithmetic/79-decimal-place-value", objectModel: "exact-hundredths-dual-editable-decimals-place-chart-draggable-hundred-grids-deciding-digit-number-line-trailing-zero-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0061-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
