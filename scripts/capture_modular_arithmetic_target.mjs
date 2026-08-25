import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0054-interactive-foundational-intermediate-numbers-and-number-theory-modular-arithmetic-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/72-modular-arithmetic";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1072, height: 1466 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0054");
await node.waitFor({ timeout: 600000 });

const state = () => node.evaluate((element) => Object.fromEntries([
  "data-dividend", "data-modulus", "data-quotient", "data-remainder", "data-equation", "data-drag-remainder",
  "data-tab", "data-language", "data-workspace", "data-expanded", "data-practice-loaded", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Dividend").fill("31");
checks.dividend31 = await state();
await page.getByLabel("Modulus").fill("5");
checks.modulus5 = await state();
await page.getByLabel("Remainder position 4").click();
checks.clickedRemainder = await state();
await page.getByLabel("Remainder position 4").dragTo(page.getByLabel("Remainder position 2"));
checks.draggedRemainder = await state();
await node.getByRole("button", { name: "Explain" }).click();
checks.explainTab = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await page.getByLabel("Expand lesson surface").click();
checks.expanded = await state();
await node.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await node.getByRole("button", { name: /Try: What is 31 mod 5/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: /Reset/ }).click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".modular72-page"),
    regions: {
      hero: region(".modular72-hero"), tabs: region(".modular72-tabs"), main: region(".modular72-main"),
      work: region(".modular72-work"), clock: region(".modular72-clock"), equations: region(".modular72-equations"),
      grouping: region(".modular72-grouping"), side: region(".modular72-side"), inputs: region(".modular72-inputs"),
      results: region(".modular72-results"), tip: region(".modular72-tip"), misconception: region(".modular72-misconception"),
      practice: region(".modular72-practice"), navigation: region(".modular72-navigation"), footer: region(".modular72-footer"),
    },
  };
});

const passed =
  checks.initial.dividend === "23" && checks.initial.modulus === "7" && checks.initial.quotient === "3" && checks.initial.remainder === "2" &&
  checks.dividend31.dividend === "31" && checks.dividend31.modulus === "7" && checks.dividend31.quotient === "4" && checks.dividend31.remainder === "3" &&
  checks.modulus5.dividend === "31" && checks.modulus5.modulus === "5" && checks.modulus5.quotient === "6" && checks.modulus5.remainder === "1" &&
  checks.clickedRemainder.dividend === "34" && checks.clickedRemainder.remainder === "4" &&
  checks.draggedRemainder.dividend === "32" && checks.draggedRemainder.remainder === "2" &&
  checks.explainTab.tab === "Explain" && checks.workspace.workspace === "true" && checks.expanded.expanded === "true" &&
  checks.reset.dividend === "23" && checks.reset.modulus === "7" && checks.reset.expanded === "false" &&
  checks.practice.dividend === "31" && checks.practice.modulus === "5" && checks.practice.quotient === "6" && checks.practice.remainder === "1" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.dividend === "23" && checks.restored.modulus === "7" && checks.restored.quotient === "3" && checks.restored.remainder === "2" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0054-desktop.png") });
await copyFile(reference, path.join(out, "0054-reference.png"));
const report = {
  mockup: "0054", lessonId: 72, route: "/lessons/numbers-and-arithmetic/72-modular-arithmetic",
  objectModel: "editable-dividend-modulus-remainder-clock-draggable-cycle-position-quotient-remainder-decomposition-grouped-cycles-misconception-practice-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0054-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
