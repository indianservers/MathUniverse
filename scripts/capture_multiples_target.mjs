import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0048-interactive-foundational-intermediate-numbers-and-number-theory-multiples-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/66-multiples";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1060, height: 1484 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0048");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-base",
        "data-candidate",
        "data-quotient",
        "data-remainder",
        "data-is-multiple",
        "data-products",
        "data-drag-multiple",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };

await page.getByLabel("Base number").fill("7");
checks.baseSeven = await state();
await page.getByLabel("Candidate number").fill("38");
checks.nonMultiple = await state();
await node
  .getByRole("button", { name: /7 × 5/ })
  .dragTo(page.getByLabel("Multiple number line drop zone"));
checks.draggedProduct = await state();
await page.getByLabel("Candidate multiple drag control").fill("21");
checks.range = await state();
await node.getByRole("button", { name: /Try: Is 38 a multiple/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: /Examples/ }).click();
checks.tab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    surface: region(".multiples66-page"),
    regions: {
      hero: region(".multiples66-hero"), tabs: region(".multiples66-tabs"), main: region(".multiples66-main"),
      work: region(".multiples66-work"), line: region(".multiples66-line"), products: region(".multiples66-products"),
      addition: region(".multiples66-addition"), side: region(".multiples66-side"),
      navigation: region(".multiples66-navigation"), footer: region(".multiples66-footer"),
    },
  };
});
const passed =
  checks.initial.base === "9" && checks.initial.candidate === "36" && checks.initial.quotient === "4" &&
  checks.initial.remainder === "0" && checks.initial["is-multiple"] === "true" &&
  checks.initial.products === "9,18,27,36,45" && checks.baseSeven.products === "7,14,21,28,35" &&
  checks.nonMultiple.candidate === "38" && checks.nonMultiple.quotient === "5" && checks.nonMultiple.remainder === "3" &&
  checks.nonMultiple["is-multiple"] === "false" && checks.draggedProduct.candidate === "35" &&
  checks.draggedProduct.remainder === "0" && checks.range.candidate === "21" && checks.range.quotient === "3" &&
  checks.practice.candidate === "38" && checks.practice.remainder === "3" && checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") && checks.workspace.workspace === "true" &&
  checks.reset.base === "9" && checks.reset.candidate === "36" && checks.reset.remainder === "0" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0048-desktop.png") });
await copyFile(reference, path.join(out, "0048-reference.png"));
const report = {
  mockup: "0048", lessonId: 66, route: "/lessons/numbers-and-arithmetic/66-multiples",
  objectModel: "editable-base-candidate-exact-skip-count-number-line-draggable-product-repeated-addition-quotient-remainder-non-example-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0048-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
