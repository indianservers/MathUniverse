/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0352-interactive-intermediate-advanced-cas-workspace-assumptions-redesigned.png",
  url = process.env.LESSON_URL ?? "http://127.0.0.1:2255/lessons/symbolic-mathematics/446-assumptions";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1205, height: 1305 } }),
  consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0352");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((node) => Object.fromEntries(["expression", "coefficient", "constant", "result", "assumptions", "feedback", "actions"].map((key) => [key, node.getAttribute(`data-${key}`)])));
const checks = { initial: await state() };
await lesson.getByLabel("Assumptions expression").fill("5*x-2*x+7-3");
checks.edited = await state();
checks.editedSteps = await lesson.locator(".as446-steps p").allTextContents();
await lesson.locator('[data-lesson-control="assumption-positive"]').click();
await lesson.locator('[data-lesson-control="assumption-negative"]').click();
await lesson.locator('[data-lesson-control="assumption-add"]').click();
checks.assumptions = await state();
await lesson.locator('[data-lesson-control="assumptions-steps"]').click();
checks.stepsCollapsed = !(await lesson.locator(".as446-steps > div").isVisible());
await lesson.getByLabel("Practice simplified form").fill("x+3");
await lesson.locator('[data-lesson-control="assumptions-check"]').click();
checks.rejected = await state();
await lesson.getByLabel("Practice simplified form").fill("x+2");
await lesson.locator('[data-lesson-control="assumptions-check"]').click();
checks.optionalAccepted = await state();
await lesson.getByLabel("Practice conditional value").fill("2");
await lesson.locator('[data-lesson-control="assumptions-check"]').click();
checks.badCondition = await state();
await lesson.getByLabel("Practice conditional value").fill("undefined");
await lesson.locator('[data-lesson-control="assumptions-check"]').click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(() => document.querySelector('[data-testid="symbolic-cas-mockup-0352"]')?.getAttribute("data-actions") === "0");
checks.reset = await state();
await page.evaluate(() => { document.querySelectorAll("*").forEach((element) => { element.scrollLeft = 0; element.scrollTop = 0; }); scrollTo(0, 0); });
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (selector) => { const element = document.querySelector(selector); if (!element) return null; const box = element.getBoundingClientRect(); return Object.fromEntries(["top", "left", "width", "height", "bottom"].map((key) => [key, Math.round(box[key])])) };
  return { document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, overflow: document.documentElement.scrollWidth > innerWidth, sidebar: rect('[data-testid="desktop-sidebar"]'), shellHeader: rect(".lesson-shell-header"), hero: rect(".as446-hero"), workspace: rect(".as446-grid"), practice: rect(".as446-practice"), adjacent: rect(".lesson-adjacent-nav"), footer: rect('footer[aria-label="Site footer"]') };
});
const passed = checks.initial.expression === "2*x+3*x-x+4-2" && checks.initial.coefficient === "4" && checks.initial.constant === "2" && checks.initial.result === "2+4*x" && checks.edited.coefficient === "3" && checks.edited.constant === "4" && checks.edited.result === "4+3*x" && checks.editedSteps.some((step) => step.includes("canonical form")) && checks.assumptions.assumptions.includes("negative") && checks.assumptions.assumptions.includes("integer") && !checks.assumptions.assumptions.includes("positive") && checks.stepsCollapsed && checks.rejected.feedback === "incorrect" && checks.optionalAccepted.feedback === "correct" && checks.badCondition.feedback === "incorrect" && checks.accepted.feedback === "correct" && checks.reset.result === "2+4*x" && checks.reset.actions === "0" && metrics.document.width === 1205 && Math.abs(metrics.document.height - 1305) <= 2 && !metrics.overflow && metrics.sidebar?.width === 239 && metrics.shellHeader?.height === 0 && metrics.adjacent?.height === 0 && metrics.footer?.height === 0 && consoleMessages.length === 0;
const report = { mockup: "0352", lessonId: 446, checks, metrics, consoleMessages, passed };
await page.screenshot({ path: path.join(evidence, "0352-desktop.png"), fullPage: true });
await copyFile(reference, path.join(evidence, "0352-reference.png"));
await writeFile(path.join(evidence, "0352-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
