import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0072-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-compound-change-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/90-compound-change";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1501, height: 1048 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0072");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-start", "data-rate", "data-stages", "data-multiplier", "data-final", "data-compound", "data-tab", "data-share-state", "data-workspace-state", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Compound starting amount" }).fill("200");
checks.startEdited = await state();
await page.getByRole("combobox", { name: "Compound rate per stage" }).selectOption("20");
checks.rateEdited = await state();
await page.getByRole("combobox", { name: "Compound number of stages" }).selectOption("3");
checks.threeStages = await state();
await page.getByRole("spinbutton", { name: "Compound starting amount" }).fill("100");
await page.getByRole("combobox", { name: "Compound rate per stage" }).selectOption("-10");
await page.getByRole("combobox", { name: "Compound number of stages" }).selectOption("2");
checks.decrease = await state();
await node.getByRole("button", { name: "Reset" }).click();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByRole("button", { name: "Compound stage 3 amount bar" }).dragTo(page.getByRole("button", { name: "Compound stage 1 amount bar" }));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: "Reset" }).click();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: "Share" }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0072"]')?.getAttribute("data-share-state") !== "Share");
checks.share = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
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
    surface: region(".compound90-page"), regions: { header: region(".compound90-header"), tabs: region(".compound90-tabs"), workspace: region(".compound90-workspace"), lab: region(".compound90-lab"), stages: region(".compound90-stages"), stage1: region(".compound90-stage:nth-child(1)"), stage2: region(".compound90-stage:nth-child(2)"), stage3: region(".compound90-stage:nth-child(3)"), insight: region(".compound90-insight"), side: region(".compound90-side"), setup: region(".compound90-setup"), result: region(".compound90-result"), total: region(".compound90-total"), warning: region(".compound90-warning") },
  };
});
const passed =
  checks.initial.start === "100" && checks.initial.rate === "10" && checks.initial.stages === "2" && checks.initial.multiplier === "1.1" && checks.initial.final === "121" && checks.initial.compound === "21" &&
  checks.startEdited.start === "200" && checks.startEdited.final === "242" && checks.startEdited.compound === "21" &&
  checks.rateEdited.rate === "20" && checks.rateEdited.multiplier === "1.2" && checks.rateEdited.final === "288" && checks.rateEdited.compound === "44" &&
  checks.threeStages.stages === "3" && checks.threeStages.final === "345.6" && checks.threeStages.compound === "72.8" &&
  checks.decrease.start === "100" && checks.decrease.rate === "-10" && checks.decrease.stages === "2" && checks.decrease.final === "81" && checks.decrease.compound === "-19" &&
  checks.dragged.stages === "1" && checks.dragged.final === "110" && checks.dragged.compound === "10" && checks.dragRecorded &&
  checks.explain.tab === "Explain" && checks.share["share-state"] !== "Share" && checks.workspace["workspace-state"] === "open" &&
  checks.restored.start === "100" && checks.restored.rate === "10" && checks.restored.stages === "2" && checks.restored.final === "121" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0072-desktop.png") });
await copyFile(reference, path.join(out, "0072-reference.png"));
const report = { mockup: "0072", lessonId: 90, route: "/lessons/numbers-and-arithmetic/90-compound-change", objectModel: "editable-start-rate-stage-count-draggable-compound-bars-sequential-latest-base-formula-result-misconception-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0072-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
