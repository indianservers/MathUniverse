import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0334-interactive-intermediate-advanced-cas-workspace-symbolic-evaluation-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2255/lessons/symbolic-mathematics/428-symbolic-evaluation";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 995, height: 1581 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("symbolic-cas-mockup-0334");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((node) => Object.fromEntries(["expression","coefficient","constant","result","valid","evaluated","substitution","substitution-value","substitution-checked","domain","practice-result","solution","copy-count"].map((key) => [key, node.getAttribute(`data-${key}`)])));
const checks = { initial: await state() };

await lesson.getByRole("button", { name: "Evaluate" }).click(); checks.evaluated = await state();
await lesson.getByLabel("Symbolic expression").fill("7*x-2*x+9-4"); checks.edited = await state();
await lesson.getByRole("button", { name: "Evaluate" }).click();
await lesson.getByLabel("Substitution value").fill("2");
await lesson.getByRole("button", { name: "Check", exact: true }).first().click(); checks.substituted = await state();

await lesson.getByRole("button", { name: "Edit assumptions" }).click();
await lesson.getByLabel("Variable domain").selectOption("Z (integers)"); checks.assumption = await state();
await lesson.getByRole("button", { name: "Clear" }).click(); checks.cleared = await state();

await page.getByRole("tab", { name: "Explain" }).click();
checks.explainVisible = await page.getByRole("tabpanel").isVisible();
await page.getByRole("tab", { name: "Interaction + visualization" }).click();
lesson = page.getByTestId("symbolic-cas-mockup-0334"); await lesson.waitFor();

const practice = lesson.locator(".sym428-practice");
await practice.getByLabel("Symbolic practice result").fill("3y + 2");
await practice.getByRole("button", { name: "Check", exact: true }).click(); checks.practiceRejected = await state();
await practice.getByLabel("Symbolic practice result").fill("3y - 2");
await practice.getByRole("button", { name: "Check", exact: true }).click(); checks.practiceAccepted = await state();
await practice.getByRole("button", { name: "Show Solution" }).click(); checks.solution = await state();
await practice.getByRole("button", { name: "Copy practice result" }).click();
await page.waitForFunction(() => globalThis.document.querySelector('[data-testid="symbolic-cas-mockup-0334"]')?.getAttribute("data-copy-count") === "1"); checks.copied = await state();

await page.getByTitle("Reset lesson progress").click(); checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 }); lesson = page.getByTestId("symbolic-cas-mockup-0334"); await lesson.waitFor();

const navigation = { nextHref: await page.getByRole("link", { name: /Next/ }).getAttribute("href") };
const metrics = await page.evaluate(() => {
  const rect = (selector) => { const element = globalThis.document.querySelector(selector); if (!element) return null; const box = element.getBoundingClientRect(); return { top: box.top, left: box.left, width: box.width, height: box.height, bottom: box.bottom }; };
  return { document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight }, overflow: globalThis.document.documentElement.scrollWidth > globalThis.window.innerWidth, sidebar: rect('[data-testid="desktop-sidebar"]'), header: rect(".lesson-shell-header"), tabs: rect('nav[role="tablist"]'), flow: rect(".sym428-flow"), lab: rect(".sym428-lab"), tags: rect(".sym428-tags"), adjacent: rect(".lesson-adjacent-nav"), footer: rect('footer[aria-label="Site footer"]') };
});
const passed = checks.initial.coefficient === "4" && checks.initial.constant === "2" && checks.initial.result === "4x + 2" && checks.evaluated.evaluated === "true" && checks.edited.result === "5x + 5" && checks.substituted["substitution-value"] === "15" && checks.substituted["substitution-checked"] === "true" && checks.assumption.domain === "Z (integers)" && checks.cleared.valid === "false" && checks.explainVisible && checks.practiceRejected["practice-result"] === "incorrect" && checks.practiceAccepted["practice-result"] === "correct" && checks.solution.solution === "true" && checks.copied["copy-count"] === "1" && checks.reset.expression === checks.initial.expression && checks.reset["practice-result"] === "idle" && navigation.nextHref === "/lessons/symbolic-mathematics/429-simplify" && metrics.document.width === 995 && metrics.document.height === 1581 && metrics.sidebar?.width === 212 && metrics.header?.top === 89 && metrics.flow?.top === 372 && metrics.lab?.top === 490 && metrics.lab?.bottom === 1407 && metrics.tags?.bottom === 1440 && !metrics.overflow && consoleMessages.length === 0;
const report = { mockup: "0334", lessonId: 428, checks, navigation, metrics, consoleMessages, note: "The mockup incorrectly simplifies 2x+3x-x+4-2 to 5x+2. The dedicated parser correctly derives 4x+2 and verifies it numerically.", passed };
await page.screenshot({ path: path.join(evidence, "0334-desktop.png"), fullPage: true });
await copyFile(reference, path.join(evidence, "0334-reference.png"));
await writeFile(path.join(evidence, "0334-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
await browser.close(); console.log(JSON.stringify(report, null, 2)); if (!passed) process.exitCode = 1;
