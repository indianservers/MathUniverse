import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0049-interactive-foundational-intermediate-numbers-and-number-theory-prime-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/67-prime-numbers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0049");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-number",
        "data-selected-divisor",
        "data-factors",
        "data-factor-count",
        "data-is-prime",
        "data-selected-quotient",
        "data-selected-remainder",
        "data-drag-counter",
        "data-saved",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };

await node.getByRole("button", { name: "2", exact: true }).first().click();
checks.divisorTwo = await state();
await page.getByLabel("Number to test").fill("12");
checks.composite = await state();
await node
  .getByLabel("Group counters by divisor 1", { exact: true })
  .getByLabel("Counter 1", { exact: true })
  .dragTo(node.getByLabel("Group counters by divisor 3", { exact: true }));
checks.dragged = await state();
await node.getByRole("button", { name: /Try: Is 18 prime/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: "Save progress", exact: true }).click();
checks.saved = await state();
await node.getByRole("button", { name: "Share", exact: true }).click();
await page.waitForTimeout(100);
checks.shared = await state();
await node.getByRole("button", { name: "Reset counters", exact: true }).click();
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
    surface: region(".prime67-page"),
    regions: {
      hero: region(".prime67-hero"),
      layout: region(".prime67-layout"),
      lab: region(".prime67-lab"),
      scanner: region(".prime67-scanner"),
      groups: region(".prime67-groups"),
      side: region(".prime67-side"),
      navigation: region(".prime67-navigation"),
    },
  };
});
const passed =
  checks.initial.number === "17" &&
  checks.initial.factors === "1,17" &&
  checks.initial["factor-count"] === "2" &&
  checks.initial["is-prime"] === "true" &&
  checks.initial["selected-divisor"] === "17" &&
  checks.divisorTwo["selected-divisor"] === "2" &&
  checks.divisorTwo["selected-quotient"] === "8" &&
  checks.divisorTwo["selected-remainder"] === "1" &&
  checks.composite.number === "12" &&
  checks.composite.factors === "1,2,3,4,6,12" &&
  checks.composite["factor-count"] === "6" &&
  checks.composite["is-prime"] === "false" &&
  checks.dragged["selected-divisor"] === "3" &&
  checks.dragged["selected-remainder"] === "0" &&
  checks.practice.number === "18" &&
  checks.practice.factors === "1,2,3,6,9,18" &&
  checks.saved.saved === "true" &&
  Number(checks.shared.actions) > Number(checks.saved.actions) &&
  checks.reset.number === "17" &&
  checks.reset.factors === "1,17" &&
  checks.reset["is-prime"] === "true" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0049-desktop.png") });
await copyFile(reference, path.join(out, "0049-reference.png"));
const report = {
  mockup: "0049",
  lessonId: 67,
  route: "/lessons/numbers-and-arithmetic/67-prime-numbers",
  objectModel:
    "editable-number-divisor-scanner-exact-factor-count-draggable-counter-equal-group-quotient-remainder-prime-composite-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0049-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
