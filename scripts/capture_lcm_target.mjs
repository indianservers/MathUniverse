import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0052-interactive-foundational-intermediate-numbers-and-number-theory-lcm-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/70-lcm";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1073, height: 1466 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0052");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-first", "data-second", "data-lcm", "data-line-maximum", "data-first-multiples", "data-second-multiples",
  "data-first-primes", "data-second-primes", "data-lcm-primes", "data-lcm-power-form", "data-candidate",
  "data-candidate-shared", "data-candidate-correct", "data-drag-multiple", "data-tab", "data-language",
  "data-workspace", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("First number", { exact: true }).fill("4");
await page.getByLabel("Second number", { exact: true }).fill("10");
checks.fourTen = await state();
await node.locator(".lcm70-list.purple").getByRole("button", { name: "40", exact: true }).dragTo(page.getByLabel("First shared landing drop zone"));
checks.draggedLaterShared = await state();
await node.locator(".lcm70-list.cyan").getByRole("button", { name: "20", exact: true }).dragTo(page.getByLabel("First shared landing drop zone"));
checks.draggedLeast = await state();
await page.getByLabel("First number", { exact: true }).fill("7");
await page.getByLabel("Second number", { exact: true }).fill("9");
checks.coprime = await state();
await node.getByRole("button", { name: /Examples/ }).click();
checks.tab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /Find the LCM of 4 and 10/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".lcm70-page"), regions: {
      hero: region(".lcm70-hero"), tabs: region(".lcm70-tabs"), main: region(".lcm70-main"), work: region(".lcm70-work"),
      lines: region(".lcm70-lines"), lists: region(".lcm70-lists"), side: region(".lcm70-side"), controls: region(".lcm70-controls"),
      landing: region(".lcm70-landing"), result: region(".lcm70-result"), ladder: region(".lcm70-ladder"),
      misconception: region(".lcm70-misconception"), tryNext: region(".lcm70-try"), navigation: region(".lcm70-navigation"), footer: region(".lcm70-footer"),
    },
  };
});
const passed =
  checks.initial.first === "6" && checks.initial.second === "8" && checks.initial.lcm === "24" &&
  checks.initial["line-maximum"] === "48" && checks.initial["first-multiples"] === "6,12,18,24,30" &&
  checks.initial["second-multiples"] === "8,16,24,32,40" && checks.initial["lcm-primes"] === "2,2,2,3" &&
  checks.initial["lcm-power-form"] === "2^3 × 3" && checks.fourTen.lcm === "20" &&
  checks.fourTen["first-primes"] === "2,2" && checks.fourTen["second-primes"] === "2,5" &&
  checks.draggedLaterShared.candidate === "40" && checks.draggedLaterShared["candidate-shared"] === "true" &&
  checks.draggedLaterShared["candidate-correct"] === "false" && checks.draggedLeast.candidate === "20" &&
  checks.draggedLeast["candidate-correct"] === "true" && checks.coprime.lcm === "63" &&
  checks.coprime["lcm-primes"] === "3,3,7" && checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") && checks.workspace.workspace === "true" &&
  checks.practice.first === "4" && checks.practice.second === "10" && checks.practice.lcm === "20" &&
  checks.reset.first === "6" && checks.reset.second === "8" && checks.reset.lcm === "24" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0052-desktop.png") });
await copyFile(reference, path.join(out, "0052-reference.png"));
const report = {
  mockup: "0052", lessonId: 70, route: "/lessons/numbers-and-arithmetic/70-lcm",
  objectModel: "editable-number-pair-synchronized-multiple-jump-lines-generated-lists-draggable-shared-landing-prime-power-ladder-least-common-multiple-practice-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0052-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
