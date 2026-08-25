import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0051-interactive-foundational-intermediate-numbers-and-number-theory-hcf-gcd-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/69-hcf-gcd";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1470, height: 1070 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0051");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-first", "data-second", "data-first-factors", "data-second-factors", "data-shared-factors", "data-hcf",
  "data-first-primes", "data-second-primes", "data-overlap-primes", "data-candidate", "data-candidate-correct",
  "data-drag-factor", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("First number", { exact: true }).fill("30");
await page.getByLabel("Second number", { exact: true }).fill("45");
checks.thirtyFortyFive = await state();
await node.locator(".hcf69-venn .shared").getByRole("button", { name: "5", exact: true }).dragTo(page.getByLabel("HCF candidate drop zone"));
checks.draggedNonGreatest = await state();
await node.locator(".hcf69-venn .shared").getByRole("button", { name: "15", exact: true }).dragTo(page.getByLabel("HCF candidate drop zone"));
checks.draggedGreatest = await state();
await page.getByLabel("Increase Second number").click();
checks.incremented = await state();
await node.getByRole("button", { name: /Find the HCF of 12 and 20/ }).click();
checks.practice = await state();
await page.getByLabel("First number", { exact: true }).fill("18");
await page.getByLabel("Second number", { exact: true }).fill("24");
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".hcf69-page"), regions: {
      hero: region(".hcf69-hero"), layout: region(".hcf69-layout"), venn: region(".hcf69-venn-card"), overlap: region(".hcf69-overlap-card"),
      groups: region(".hcf69-groups"), side: region(".hcf69-side"), inputs: region(".hcf69-inputs"), summary: region(".hcf69-summary"),
      greatest: region(".hcf69-greatest"), warning: region(".hcf69-warning"), practice: region(".hcf69-try"), navigation: region(".hcf69-navigation"),
    },
  };
});
const passed =
  checks.initial.first === "18" && checks.initial.second === "24" && checks.initial["shared-factors"] === "1,2,3,6" &&
  checks.initial.hcf === "6" && checks.initial["first-primes"] === "2,3,3" && checks.initial["second-primes"] === "2,2,2,3" &&
  checks.initial["overlap-primes"] === "2,3" && checks.thirtyFortyFive["shared-factors"] === "1,3,5,15" &&
  checks.thirtyFortyFive.hcf === "15" && checks.thirtyFortyFive["overlap-primes"] === "3,5" &&
  checks.draggedNonGreatest.candidate === "5" && checks.draggedNonGreatest["candidate-correct"] === "false" &&
  checks.draggedGreatest.candidate === "15" && checks.draggedGreatest["candidate-correct"] === "true" &&
  checks.incremented.second === "46" && checks.incremented.hcf === "2" && checks.practice.first === "12" &&
  checks.practice.second === "20" && checks.practice.hcf === "4" && checks.restored.first === "18" &&
  checks.restored.second === "24" && checks.restored.hcf === "6" && !metrics.horizontalOverflow &&
  !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0051-desktop.png") });
await copyFile(reference, path.join(out, "0051-reference.png"));
const report = {
  mockup: "0051", lessonId: 69, route: "/lessons/numbers-and-arithmetic/69-hcf-gcd",
  objectModel: "editable-number-pair-factor-set-venn-intersection-prime-exponent-overlap-draggable-shared-candidate-equal-group-greatest-divisor-practice-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0051-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
