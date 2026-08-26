import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0068-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-inverse-proportion-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/86-inverse-proportion";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1509, height: 1042 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0068");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-product", "data-workers", "data-days", "data-share-state", "data-workspace-state", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Current workers x" }).fill("6");
checks.workersEdited = await state();
await page.getByRole("spinbutton", { name: "Current days y" }).fill("6");
checks.daysEdited = await state();
await page.getByRole("spinbutton", { name: "Constant product" }).fill("36");
checks.productEdited = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
const actionsBeforeGraphDrag = Number((await state()).actions);
await page.getByLabel("Inverse graph point 2").dragTo(page.getByLabel("Inverse graph point 4"));
checks.graphDragged = await state();
checks.graphDragRecorded = Number(checks.graphDragged.actions) > actionsBeforeGraphDrag;
const actionsBeforeTaskDrag = Number((await state()).actions);
await page.getByLabel("3-worker task 1", { exact: true }).dragTo(page.getByLabel("8-worker task 1", { exact: true }));
checks.taskDragged = await state();
checks.taskDragRecorded = Number(checks.taskDragged.actions) > actionsBeforeTaskDrag;
await node.getByRole("button", { name: /^Share$/ }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0068"]')?.getAttribute("data-share-state") !== "Share");
checks.shared = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /^Try this/ }).click();
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
    surface: region(".inverse86-page"), regions: { header: region(".inverse86-header"), banner: region(".inverse86-banner"), workspace: region(".inverse86-workspace"), table: region(".inverse86-table"), graph: region(".inverse86-graph"), visual: region(".inverse86-visual"), side: region(".inverse86-side"), quick: region(".inverse86-quick"), formula: region(".inverse86-formula"), practice: region(".inverse86-try"), navigation: region(".inverse86-navigation") },
  };
});
const passed =
  checks.initial.product === "24" && checks.initial.workers === "8" && checks.initial.days === "3" &&
  checks.workersEdited.workers === "6" && checks.workersEdited.days === "4" &&
  checks.daysEdited.workers === "4" && checks.daysEdited.days === "6" &&
  checks.productEdited.product === "36" && checks.productEdited.workers === "4" && checks.productEdited.days === "9" &&
  checks.graphDragged.product === "24" && checks.graphDragged.workers === "4" && checks.graphDragged.days === "6" && checks.graphDragRecorded &&
  checks.taskDragged.workers === "8" && checks.taskDragged.days === "3" && checks.taskDragRecorded &&
  ["Copied", "Ready"].includes(checks.shared["share-state"]) && checks.workspace["workspace-state"] === "open" &&
  checks.practice.product === "36" && checks.practice.workers === "9" && checks.practice.days === "4" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.product === "24" && checks.restored.workers === "8" && checks.restored.days === "3" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0068-desktop.png") });
await copyFile(reference, path.join(out, "0068-reference.png"));
const report = { mockup: "0068", lessonId: 86, route: "/lessons/numbers-and-arithmetic/86-inverse-proportion", objectModel: "editable-constant-product-reciprocal-table-draggable-curve-points-work-sharing-task-arrays-formula-quick-check-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0068-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
