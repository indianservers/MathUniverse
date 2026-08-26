import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0069-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-unit-rates-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/87-unit-rates";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1068, height: 1473 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0069");
await node.waitFor({ timeout: 600000 });
await page.waitForFunction(() => [...document.querySelectorAll('.unit87-bags img')].every((image) => image.complete && image.naturalWidth > 0));
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-total", "data-units", "data-unit-rate", "data-tab", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Total cost rupees" }).fill("360");
checks.totalEdited = await state();
await page.getByRole("spinbutton", { name: "Number of kilograms" }).fill("6");
checks.unitsEdited = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("Rice bag 6", { exact: true }).dragTo(page.getByLabel("Rice bag 3", { exact: true }));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: /^Try:/ }).click();
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
    surface: region(".unit87-page"), regions: { header: region(".unit87-header"), tabs: region(".unit87-tabs"), workspace: region(".unit87-workspace"), lab: region(".unit87-lab"), bags: region(".unit87-bags"), shares: region(".unit87-shares"), equation: region(".unit87-equation"), result: region(".unit87-result"), table: region(".unit87-table"), line: region(".unit87-line"), side: region(".unit87-side"), navigation: region(".unit87-navigation"), footer: region(".unit87-footer") },
  };
});
const passed =
  checks.initial.total === "300" && checks.initial.units === "5" && checks.initial["unit-rate"] === "60" &&
  checks.totalEdited.total === "360" && checks.totalEdited.units === "5" && checks.totalEdited["unit-rate"] === "72" &&
  checks.unitsEdited.total === "360" && checks.unitsEdited.units === "6" && checks.unitsEdited["unit-rate"] === "60" &&
  checks.dragged.units === "3" && checks.dragged["unit-rate"] === "120" && checks.dragRecorded &&
  checks.explain.tab === "Explain" && checks.practice.total === "450" && checks.practice.units === "9" && checks.practice["unit-rate"] === "50" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.total === "300" && checks.restored.units === "5" && checks.restored["unit-rate"] === "60" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0069-desktop.png") });
await copyFile(reference, path.join(out, "0069-reference.png"));
const report = { mockup: "0069", lessonId: 87, route: "/lessons/numbers-and-arithmetic/87-unit-rates", objectModel: "editable-total-unit-count-draggable-rice-bags-equal-sharing-cards-unit-rate-table-double-number-line-practice-model", asset: "public/assets/lessons/unit-rates-rice-bag.png", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0069-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
