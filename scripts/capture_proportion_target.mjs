import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0066-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-proportion-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/84-proportion";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1496, height: 1051 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0066");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-known-first", "data-known-second", "data-target-first", "data-target-second", "data-scale", "data-cross-left", "data-cross-right", "data-tab", "data-copy-state", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Known ratio first term" }).fill("3");
checks.firstEdited = await state();
await page.getByRole("spinbutton", { name: "Known ratio second term" }).fill("5");
checks.secondEdited = await state();
await page.getByRole("spinbutton", { name: "Target ratio first term" }).fill("9");
checks.targetEdited = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("targetFirst tape unit 9").dragTo(page.getByLabel("targetFirst tape unit 3"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await page.getByLabel("Copy proportion").click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0066"]')?.getAttribute("data-copy-state") !== "Copy");
checks.copied = await state();
await node.getByRole("button", { name: /Try this next/ }).click();
checks.practice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor({ timeout: 600000 });
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".proportion84-page"), regions: { header: region(".proportion84-header"), tabs: region(".proportion84-tabs"), workspace: region(".proportion84-workspace"), lab: region(".proportion84-lab"), scale: region(".proportion84-scale"), tapes: region(".proportion84-tapes"), cross: region(".proportion84-cross"), side: region(".proportion84-side"), summary: region(".proportion84-summary"), steps: region(".proportion84-steps"), answer: region(".proportion84-answer"), misconception: region(".proportion84-misconception"), practice: region(".proportion84-practice"), navigation: region(".proportion84-navigation") },
  };
});
const passed =
  checks.initial["known-first"] === "2" && checks.initial["known-second"] === "9" && checks.initial["target-first"] === "6" && checks.initial["target-second"] === "27" && checks.initial.scale === "3" && checks.initial["cross-left"] === "54" && checks.initial["cross-right"] === "54" &&
  checks.firstEdited["known-first"] === "3" && checks.firstEdited.scale === "2" && checks.firstEdited["target-second"] === "18" && checks.secondEdited["known-second"] === "5" && checks.secondEdited["target-second"] === "10" &&
  checks.targetEdited["target-first"] === "9" && checks.targetEdited.scale === "3" && checks.targetEdited["target-second"] === "15" && checks.targetEdited["cross-left"] === "45" && checks.targetEdited["cross-right"] === "45" &&
  checks.dragged["target-first"] === "3" && checks.dragged.scale === "1" && checks.dragged["target-second"] === "5" && checks.dragRecorded && checks.explain.tab === "Explain" && ["Copied", "Ready"].includes(checks.copied["copy-state"]) &&
  checks.practice["known-first"] === "4" && checks.practice["known-second"] === "7" && checks.practice["target-first"] === "12" && checks.practice["target-second"] === "21" && checks.practice.scale === "3" && checks.practice["cross-left"] === "84" && checks.practice["cross-right"] === "84" && checks.practice["practice-loaded"] === "true" &&
  checks.restored["known-first"] === "2" && checks.restored["known-second"] === "9" && checks.restored["target-first"] === "6" && checks.restored["target-second"] === "27" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0066-desktop.png") });
await copyFile(reference, path.join(out, "0066-reference.png"));
const report = { mockup: "0066", lessonId: 84, route: "/lessons/numbers-and-arithmetic/84-proportion", objectModel: "editable-known-target-ratio-shared-scale-factor-draggable-tape-units-cross-product-step-summary-solved-value-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0066-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
