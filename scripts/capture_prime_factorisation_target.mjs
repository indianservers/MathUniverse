import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0050-interactive-foundational-intermediate-numbers-and-number-theory-prime-factorisation-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/68-prime-factorisation";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0050");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-number",
        "data-prime-factors",
        "data-exponent-form",
        "data-split-steps",
        "data-candidate",
        "data-candidate-count",
        "data-rebuild-count",
        "data-rebuilt-product",
        "data-expanded",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };

await page.getByLabel("Rebuild prime factors").fill("2");
checks.partialRebuild = await state();
await page.getByLabel("Candidate prime divisor").selectOption("2");
checks.candidateTwo = await state();
await page.getByLabel("Number to factorise").fill("36");
checks.thirtySix = await state();
await node.getByRole("button", { name: /prime factorisation of 18/ }).click();
checks.practice = await state();
await page.getByLabel("Expand factor tree").click();
checks.expanded = await state();
await node
  .getByRole("button", { name: "Reset factor tree", exact: true })
  .evaluate((button) => button.click());
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".factorisation68-page"),
    regions: {
      title: region(".factorisation68-title"),
      grid: region(".factorisation68-grid"),
      treeCard: region(".factorisation68-tree-card"),
      tree: region(".factorisation68-tree-card > svg"),
      exponent: region(".factorisation68-exponent"),
      rebuild: region(".factorisation68-rebuild"),
      practice: region(".factorisation68-practice"),
      side: region(".factorisation68-side"),
      steps: region(".factorisation68-steps"),
      primes: region(".factorisation68-primes"),
      formula: region(".factorisation68-formula"),
      insight: region(".factorisation68-insight"),
    },
  };
});
const passed =
  checks.initial.number === "24" &&
  checks.initial["prime-factors"] === "2,2,2,3" &&
  checks.initial["exponent-form"] === "2^3 × 3" &&
  checks.initial["split-steps"] === "24x6x4,6x2x3,4x2x2" &&
  checks.initial["rebuilt-product"] === "24" &&
  checks.initial["candidate-count"] === "1" &&
  checks.partialRebuild["rebuild-count"] === "2" &&
  checks.partialRebuild["rebuilt-product"] === "4" &&
  checks.candidateTwo.candidate === "2" &&
  checks.candidateTwo["candidate-count"] === "3" &&
  checks.thirtySix.number === "36" &&
  checks.thirtySix["prime-factors"] === "2,2,3,3" &&
  checks.thirtySix["exponent-form"] === "2^2 × 3^2" &&
  checks.practice.number === "18" &&
  checks.practice["prime-factors"] === "2,3,3" &&
  checks.practice["rebuilt-product"] === "18" &&
  checks.expanded.expanded === "true" &&
  checks.reset.number === "24" &&
  checks.reset["prime-factors"] === "2,2,2,3" &&
  checks.reset["candidate"] === "3" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0050-desktop.png") });
await copyFile(reference, path.join(out, "0050-reference.png"));
const report = {
  mockup: "0050",
  lessonId: 68,
  route: "/lessons/numbers-and-arithmetic/68-prime-factorisation",
  objectModel:
    "editable-composite-recursive-binary-factor-tree-prime-leaves-split-steps-exponent-compression-rebuild-slider-candidate-frequency-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0050-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
