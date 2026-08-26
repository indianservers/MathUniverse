import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0065-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-ratio-models-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/83-ratio-models";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1054, height: 1492 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0065");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-blue", "data-red", "data-total", "data-scale", "data-scaled-blue", "data-scaled-red", "data-tab", "data-share-state", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "First blue ratio part" }).fill("3");
checks.blueEdited = await state();
await page.getByRole("spinbutton", { name: "Second red ratio part" }).fill("4");
checks.redEdited = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("blue ratio token 3").dragTo(page.getByLabel("blue ratio token 1"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: /Reset/ }).click();
await page.getByLabel("Ratio scale factor").click();
checks.scaled = await state();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0065"]')?.getAttribute("data-share-state") !== "Share");
checks.shared = await state();
await node.getByRole("button", { name: /Try: Model 3:5/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: /Reset/ }).click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".ratio83-page"), regions: { lesson: region(".ratio83-surface"), header: region(".ratio83-surface>header"), tabs: region(".ratio83-tabs"), workspace: region(".ratio83-workspace"), lab: region(".ratio83-lab"), tokens: region(".ratio83-tokens"), tape: region(".ratio83-tape"), scaled: region(".ratio83-scaled"), lines: region(".ratio83-lines"), preserved: region(".ratio83-preserved"), practice: region(".ratio83-practice"), side: region(".ratio83-side"), navigation: region(".ratio83-navigation"), footer: region(".ratio83-footer") },
  };
});
const passed =
  checks.initial.blue === "2" && checks.initial.red === "3" && checks.initial.total === "5" && checks.initial.scale === "2" && checks.initial["scaled-blue"] === "4" && checks.initial["scaled-red"] === "6" &&
  checks.blueEdited.blue === "3" && checks.blueEdited.total === "6" && checks.blueEdited["scaled-blue"] === "6" && checks.redEdited.red === "4" && checks.redEdited.total === "7" && checks.redEdited["scaled-red"] === "8" &&
  checks.dragged.blue === "1" && checks.dragged.red === "4" && checks.dragged.total === "5" && checks.dragRecorded &&
  checks.scaled.blue === "2" && checks.scaled.red === "3" && checks.scaled.scale === "3" && checks.scaled["scaled-blue"] === "6" && checks.scaled["scaled-red"] === "9" &&
  checks.explain.tab === "Explain" && ["Copied", "Ready"].includes(checks.shared["share-state"]) &&
  checks.practice.blue === "3" && checks.practice.red === "5" && checks.practice.total === "8" && checks.practice.scale === "2" && checks.practice["scaled-blue"] === "6" && checks.practice["scaled-red"] === "10" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.blue === "2" && checks.restored.red === "3" && checks.restored.scale === "2" && checks.restored.tab === "Interaction + visualization" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0065-desktop.png") });
await copyFile(reference, path.join(out, "0065-reference.png"));
const report = { mockup: "0065", lessonId: 83, route: "/lessons/numbers-and-arithmetic/83-ratio-models", objectModel: "dual-editable-part-count-draggable-token-tape-diagram-scaled-batch-double-number-line-preserved-relationship-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0065-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
