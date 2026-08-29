import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0336-interactive-intermediate-advanced-cas-workspace-expand-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2255/lessons/symbolic-mathematics/430-expand";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1022, height: 1539 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("symbolic-cas-mockup-0336");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((node) => Object.fromEntries(["expression", "valid", "products", "coefficients", "result", "view", "stage", "collected", "feedback"].map((key) => [key, node.getAttribute(`data-${key}`)])));
const checks = { initial: await state() };

await lesson.getByLabel("Expression to expand").fill("(3x+2)*(2x-5)");
checks.edited = await state();
await lesson.getByRole("button", { name: "Reset expansion expression" }).click();
checks.expressionReset = await state();
await lesson.getByRole("button", { name: "Symbolic view" }).click();
checks.symbolic = await state();
await lesson.getByRole("button", { name: "Tiles view" }).click();
await lesson.getByRole("button", { name: /Reverse step/ }).click();
checks.reversed = await state();
const dropzone = lesson.locator('[data-lesson-control="expand-collect-dropzone"]');
await lesson.getByRole("button", { name: "Collect product x²" }).dragTo(dropzone);
checks.dragged = await state();
for (const name of ["Collect product -3x", "Collect product 2x", "Collect product -6"]) {
  await lesson.getByRole("button", { name }).click();
}
checks.collected = await state();
await lesson.getByRole("button", { name: "Show steps as algebra" }).click();
checks.algebraVisible = await lesson.getByText(/1 \+ -3 \+ 2 \+ -6/).isVisible();

const practice = lesson.locator(".exp430-practice");
await practice.getByLabel("Expanded answer").fill("2x^2+8x-4");
await practice.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await practice.getByLabel("Expanded answer").fill("2x^2+7x-4");
await practice.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await practice.getByRole("button", { name: "Show hint" }).click();
checks.hintVisible = await practice.getByText(/Multiply first, outside/).isVisible();
await practice.getByRole("button", { name: "Show steps" }).click();
checks.practiceStepsVisible = await practice.getByText(/2 \+ 8 \+ -1 \+ -4/).isVisible();
await page.getByTitle("Reset lesson progress").click();
checks.reset = await state();

const navigation = {
  previousHref: await lesson.getByRole("link", { name: /Previous/ }).getAttribute("href"),
  nextHref: await lesson.getByRole("link", { name: /Next/ }).getAttribute("href"),
};
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = globalThis.document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { top: Math.round(box.top), left: Math.round(box.left), width: Math.round(box.width), height: Math.round(box.height), bottom: Math.round(box.bottom) };
  };
  return {
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    overflow: globalThis.document.documentElement.scrollWidth > globalThis.window.innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect(".lesson-shell-header"),
    guide: rect(".exp430-guide"),
    tabs: rect('nav[role="tablist"]'),
    workspace: rect(".exp430-workspace"),
    result: rect(".exp430-result"),
    learning: rect(".exp430-learning"),
    practice: rect(".exp430-practice"),
    adjacent: rect(".exp430-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed = checks.initial.valid === "true"
  && checks.initial.products === "1,-3,2,-6"
  && checks.initial.coefficients === "1,-1,-6"
  && checks.initial.result === "x^2 - x - 6"
  && checks.edited.products === "6,-15,4,-10"
  && checks.edited.coefficients === "6,-11,-10"
  && checks.edited.result === "6x^2 - 11x - 10"
  && checks.symbolic.view === "symbolic"
  && checks.reversed.stage === "2"
  && checks.reversed.collected === ""
  && checks.dragged.collected === "0"
  && checks.collected.stage === "3"
  && checks.collected.collected === "0,1,2,3"
  && checks.algebraVisible
  && checks.rejected.feedback === "incorrect"
  && checks.accepted.feedback === "correct"
  && checks.hintVisible
  && checks.practiceStepsVisible
  && checks.reset.expression === checks.initial.expression
  && checks.reset.feedback === "idle"
  && navigation.previousHref === "/lessons/symbolic-mathematics/429-simplify"
  && navigation.nextHref === "/lessons/symbolic-mathematics/431-factor"
  && metrics.document.width === 1022
  && metrics.document.height === 1539
  && metrics.sidebar?.width === 207
  && metrics.header?.top === 107
  && metrics.workspace?.top === 437
  && metrics.footer?.top === 1408
  && !metrics.overflow
  && consoleMessages.length === 0;
const report = { mockup: "0336", lessonId: 430, checks, navigation, metrics, consoleMessages, passed };
await page.screenshot({ path: path.join(evidence, "0336-desktop.png"), fullPage: true });
await copyFile(reference, path.join(evidence, "0336-reference.png"));
await writeFile(path.join(evidence, "0336-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
