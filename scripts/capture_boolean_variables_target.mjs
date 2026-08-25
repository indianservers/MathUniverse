import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0036-interactive-foundational-advanced-algebra-and-dynamic-variables-boolean-variables-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/core-workspaces/36-boolean-variables";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1217, height: 1292 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0036");
await node.waitFor({ timeout: 180000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-a", "data-b", "data-and", "data-or", "data-not", "data-operation", "data-focused-result", "data-visible", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));

const checks = { initial: await state() };
await page.getByLabel("Control B").click();
checks.bothTrue = await state();
checks.visibleCopy = await page.locator(".visibility-card .object h2").textContent();
checks.activeRowBothTrue = await page.locator(".truth-card tr.active").textContent();
await page.getByLabel("Toggle A").click();
checks.aFalse = await state();
checks.activeRowAFalse = await page.locator(".truth-card tr.active").textContent();
await page.locator(".operation-card nav button").filter({ hasText: "OR" }).click();
checks.orFocus = await state();
await page.locator(".operation-card nav button").filter({ hasText: "NOT" }).click();
checks.notFocus = await state();
await page.getByLabel("Control B").click();
checks.bothFalse = await state();
await page.getByLabel("Control A").click();
checks.initialLogicAgain = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForTimeout(100);
checks.share = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
checks.reload = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    surface: region(".boolean-page"),
    regions: {
      shell: region(".boolean-shell"), header: region(".boolean-shell > header"), main: region(".boolean-shell > main"),
      states: region(".state-card"), logic: region(".logic-card"), truth: region(".truth-card"), visibility: region(".visibility-card"),
      side: region(".boolean-side"), controls: region(".control-card"), operation: region(".operation-card"),
      misconception: region(".misconception-card"), key: region(".boolean-key"), navigation: region(".boolean-navigation"),
    },
  };
});

const passed = checks.initial.a === "true" && checks.initial.b === "false" && checks.initial.and === "false" && checks.initial.or === "true" && checks.initial.not === "false" &&
  checks.bothTrue.a === "true" && checks.bothTrue.b === "true" && checks.bothTrue.and === "true" && checks.bothTrue.visible === "true" && checks.visibleCopy === "Object P is visible" && checks.activeRowBothTrue?.includes("truetruetruetrue") &&
  checks.aFalse.a === "false" && checks.aFalse.b === "true" && checks.aFalse.and === "false" && checks.aFalse.or === "true" && checks.aFalse.not === "true" && checks.activeRowAFalse?.includes("falsetruefalsetrue") &&
  checks.orFocus.operation === "OR" && checks.orFocus["focused-result"] === "true" && checks.notFocus.operation === "NOT" && checks.notFocus["focused-result"] === "true" &&
  checks.bothFalse.a === "false" && checks.bothFalse.b === "false" && checks.bothFalse.or === "false" && checks.bothFalse.not === "true" &&
  checks.initialLogicAgain.a === "true" && checks.initialLogicAgain.b === "false" && checks.initialLogicAgain.not === "false" && Number(checks.share.actions) >= 7 &&
  checks.reload.a === "true" && checks.reload.b === "false" && checks.reload.operation === "AND" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0036-desktop.png") });
await copyFile(reference, path.join(out, "0036-reference.png"));
const report = { mockup: "0036", lessonId: 36, route: "/lessons/core-workspaces/36-boolean-variables", objectModel: "dual-boolean-switch-logic-gates-truth-table-operation-focus-conditional-visibility-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0036-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
