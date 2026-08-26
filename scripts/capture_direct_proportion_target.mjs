import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0067-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-direct-proportion-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/85-direct-proportion";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1068, height: 1472 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0067");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-quantity", "data-rate", "data-cost", "data-ratio", "data-tab", "data-share-state", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Current quantity x" }).fill("4");
checks.quantityEdited = await state();
await page.getByRole("spinbutton", { name: "Constant of proportion k" }).fill("20");
checks.rateEdited = await state();
await node.getByRole("button", { name: /Reset/ }).click();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("Graph point 4").dragTo(page.getByLabel("Graph point 2"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByLabel("Proportion table quantity 1").click();
checks.tableSelected = await state();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: /^Share$/ }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0067"]')?.getAttribute("data-share-state") !== "Share");
checks.shared = await state();
await node.getByRole("button", { name: /Check your answer/ }).click();
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
    surface: region(".direct85-page"), regions: { header: region(".direct85-header"), tabs: region(".direct85-tabs"), workspace: region(".direct85-workspace"), lab: region(".direct85-lab"), table: region(".direct85-table"), graph: region(".direct85-graph"), side: region(".direct85-side"), values: region(".direct85-values"), unit: region(".direct85-unit"), equation: region(".direct85-equation"), ideas: region(".direct85-ideas"), practice: region(".direct85-try"), navigation: region(".direct85-navigation") },
  };
});
const passed =
  checks.initial.quantity === "3" && checks.initial.rate === "30" && checks.initial.cost === "90" && checks.initial.ratio === "30" &&
  checks.quantityEdited.quantity === "4" && checks.quantityEdited.cost === "120" &&
  checks.rateEdited.rate === "20" && checks.rateEdited.quantity === "4" && checks.rateEdited.cost === "80" &&
  checks.dragged.quantity === "2" && checks.dragged.rate === "30" && checks.dragged.cost === "60" && checks.dragRecorded &&
  checks.tableSelected.quantity === "1" && checks.tableSelected.cost === "30" && checks.explain.tab === "Explain" &&
  ["Copied", "Ready"].includes(checks.shared["share-state"]) &&
  checks.practice.quantity === "5" && checks.practice.rate === "12" && checks.practice.cost === "60" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.quantity === "3" && checks.restored.rate === "30" && checks.restored.cost === "90" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0067-desktop.png") });
await copyFile(reference, path.join(out, "0067-reference.png"));
const report = { mockup: "0067", lessonId: 85, route: "/lessons/numbers-and-arithmetic/85-direct-proportion", objectModel: "editable-constant-multiplier-linked-table-draggable-coordinate-points-origin-line-unit-rate-equation-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0067-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
