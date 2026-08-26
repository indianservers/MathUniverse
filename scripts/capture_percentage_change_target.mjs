import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0071-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-percentage-change-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/89-percentage-change";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1495, height: 1052 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0071");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-original", "data-new", "data-change", "data-percent", "data-direction", "data-tab", "data-share-state", "data-workspace-state", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "New amount" }).fill("120");
checks.newEdited = await state();
await page.getByRole("spinbutton", { name: "Original amount" }).fill("100");
checks.originalEdited = await state();
await page.getByRole("spinbutton", { name: "New amount" }).fill("75");
checks.decrease = await state();
await node.getByRole("button", { name: "Reset" }).click();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByRole("button", { name: "New amount bar" }).dragTo(page.getByRole("button", { name: "Original amount bar" }));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Percentage change number line 60", { exact: true }).click();
checks.numberLine = await state();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: "Share" }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0071"]')?.getAttribute("data-share-state") !== "Share");
checks.share = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /Try: From 50 to 65/ }).click();
checks.practice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".change89-page"), regions: { header: region(".change89-header"), tabs: region(".change89-tabs"), workspace: region(".change89-workspace"), lab: region(".change89-lab"), bars: region(".change89-bars"), breakdown: region(".change89-breakdown"), line: region(".change89-line"), side: region(".change89-side"), original: region(".change89-value.original"), changed: region(".change89-change"), formula: region(".change89-formula"), warning: region(".change89-warning"), practice: region(".change89-try"), navigation: region(".change89-navigation") },
  };
});
const passed =
  checks.initial.original === "80" && checks.initial.new === "100" && checks.initial.change === "20" && checks.initial.percent === "25" && checks.initial.direction === "increase" &&
  checks.newEdited.original === "80" && checks.newEdited.new === "120" && checks.newEdited.change === "40" && checks.newEdited.percent === "50" &&
  checks.originalEdited.original === "100" && checks.originalEdited.new === "120" && checks.originalEdited.change === "20" && checks.originalEdited.percent === "20" &&
  checks.decrease.original === "100" && checks.decrease.new === "75" && checks.decrease.change === "25" && checks.decrease.percent === "25" && checks.decrease.direction === "decrease" &&
  checks.dragged.original === "100" && checks.dragged.new === "100" && checks.dragged.percent === "0" && checks.dragRecorded &&
  checks.numberLine.original === "80" && checks.numberLine.new === "60" && checks.numberLine.change === "20" && checks.numberLine.percent === "25" && checks.numberLine.direction === "decrease" &&
  checks.explain.tab === "Explain" && checks.share["share-state"] !== "Share" && checks.workspace["workspace-state"] === "open" &&
  checks.practice.original === "50" && checks.practice.new === "65" && checks.practice.change === "15" && checks.practice.percent === "30" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.original === "80" && checks.restored.new === "100" && checks.restored.percent === "25" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0071-desktop.png") });
await copyFile(reference, path.join(out, "0071-reference.png"));
const report = { mockup: "0071", lessonId: 89, route: "/lessons/numbers-and-arithmetic/89-percentage-change", objectModel: "dual-editable-original-new-draggable-before-after-bars-percentage-change-breakdown-number-line-baseline-warning-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0071-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
