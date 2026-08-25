import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0017-interactive-foundational-advanced-scientific-calculator-calculation-history-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/core-workspaces/17-calculation-history";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
page.setDefaultTimeout(600000);
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 600000 });
const node = page.getByTestId("calculator-mockup-0017");
try {
  await node.waitFor();
} catch (error) {
  console.error("Page body:", await page.locator("body").innerText().catch(() => "<unavailable>"));
  console.error("Console:", consoleMessages);
  await page.screenshot({ path: path.join(out, "0017-mount-failure.png") }).catch(() => undefined);
  throw error;
}
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-selected-row", "data-last-action", "data-copied-result", "data-reused-expression",
  "data-pinned-rows", "data-practice-correct", "data-view",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };
await page.getByRole("button", { name: "Inspect source for row 2" }).click();
checks.inspect = await state();
await page.getByRole("button", { name: "Reuse input from row 3" }).click();
checks.reuse = await state();
await page.getByRole("button", { name: "Copy result from row 4" }).click();
checks.copy = await state();
await page.getByRole("button", { name: "Pin note for row 2" }).click();
checks.pin = await state();
await page.getByRole("button", { name: /Examples/ }).click();
checks.view = await state();
await page.locator(".history-choices button").filter({ hasText: "Row 3" }).click();
checks.incorrect = await state();
await page.locator(".history-choices button").filter({ hasText: "Row 1" }).click();
checks.correct = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    surface: region(".target-history-page"),
    regions: {
      header: region(".history-header"), tabs: region(".history-tabs"), main: region(".history-main"),
      lab: region(".history-lab"), table: region(".history-table"), side: region(".history-side"),
      practice: region(".history-practice"), neighbors: region(".history-neighbors"),
    },
  };
});
const passed = checks.initial["selected-row"] === "1"
  && checks.inspect["selected-row"] === "2" && checks.inspect["last-action"] === "inspect"
  && checks.reuse["reused-expression"] === "12 + 5"
  && checks.copy["copied-result"] === "68"
  && checks.pin["pinned-rows"] === "2"
  && checks.view.view === "2"
  && checks.incorrect["practice-correct"] === "false"
  && checks.correct["practice-correct"] === "true"
  && checks.reset["selected-row"] === "1" && checks.reset.view === "0"
  && !metrics.horizontalOverflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0017-desktop.png") });
await copyFile(reference, path.join(out, "0017-reference.png"));
const report = {
  mockup: "0017", lessonId: 17, route: "/lessons/core-workspaces/17-calculation-history",
  objectModel: "selectable-provenance-history-row-reuse-copy-pin-inspection-dependency-chain-graded-practice-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0017-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
