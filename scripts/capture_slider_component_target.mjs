import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0074-interactive-all-levels-interactive-authoring-slider-component-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/authoring-and-learning-system/618-slider-component";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1504, height: 1045 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("authoring-mockup-0074");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-label", "data-minimum", "data-maximum", "data-step", "data-default", "data-value", "data-show-value", "data-tab", "data-share-state", "data-workspace-state", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

const range = page.getByRole("slider", { name: "Parameter slider a" });
const rangeBox = await range.boundingBox();
if (!rangeBox) throw new Error("Parameter slider is unavailable");
await page.mouse.move(rangeBox.x + rangeBox.width * .6, rangeBox.y + rangeBox.height / 2);
await page.mouse.down();
await page.mouse.move(rangeBox.x + rangeBox.width * .8, rangeBox.y + rangeBox.height / 2, { steps: 10 });
await page.mouse.up();
checks.dragged = await state();

await page.getByLabel("Slider label").fill("k");
await page.getByLabel("Slider maximum").fill("4");
await page.getByLabel("Slider step").fill("0.5");
await page.getByLabel("Slider default value").fill("2");
checks.schemaEdited = await state();
await page.getByLabel("Show value").uncheck();
checks.hiddenValue = await state();
await node.getByRole("button", { name: "Advanced", exact: true }).click();
checks.advancedVisible = await page.getByText("Arrow keys move by 0.5").isVisible();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: "Share" }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="authoring-mockup-0074"]')?.getAttribute("data-share-state") !== "Share");
checks.share = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: "Reset" }).click();
checks.reset = await state();
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
    surface: region(".slider618-page"), regions: { header: region(".slider618-header"), tabs: region(".slider618-tabs"), workspace: region(".slider618-workspace"), settings: region(".slider618-settings"), live: region(".slider618-live"), graph: region(".slider618-graph"), range: region(".slider618-range"), linked: region(".slider618-linked"), checklist: region(".slider618-linked>section") },
  };
});
const passed =
  checks.initial.label === "a" && checks.initial.minimum === "0" && checks.initial.maximum === "2" && checks.initial.step === "0.1" && checks.initial.default === "1.2" && checks.initial.value === "1.2" &&
  Number(checks.dragged.value) >= 1.5 && Number(checks.dragged.value) <= 1.7 && Number(checks.dragged.actions) > 0 &&
  checks.schemaEdited.label === "k" && checks.schemaEdited.maximum === "4" && checks.schemaEdited.step === "0.5" && checks.schemaEdited.default === "2" && checks.schemaEdited.value === "2" &&
  checks.hiddenValue["show-value"] === "false" && checks.advancedVisible && checks.explain.tab === "Explain" && checks.share["share-state"] !== "Share" && checks.workspace["workspace-state"] === "open" &&
  checks.reset.label === "a" && checks.reset.maximum === "2" && checks.reset.value === "1.2" && checks.reset.tab === "Interaction + visualization" &&
  checks.restored.label === "a" && checks.restored.value === "1.2" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0074-desktop.png") });
await copyFile(reference, path.join(out, "0074-reference.png"));
const report = { mockup: "0074", lessonId: 618, route: "/lessons/authoring-and-learning-system/618-slider-component", objectModel: "editable-slider-schema-draggable-range-live-parabola-equation-linked-preview-authoring-checklist-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0074-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
