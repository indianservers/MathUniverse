import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0039-interactive-foundational-intermediate-numbers-and-number-theory-natural-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/57-natural-numbers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1487, height: 1058 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0039");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-selected",
        "data-next",
        "data-natural",
        "data-excluded",
        "data-classification-correct",
        "data-status",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Selected natural number drag control").fill("8");
checks.slider = await state();
checks.trayCount = await page
  .locator(".count-content > div > nav button")
  .count();
await page.locator(".natural-range button").filter({ hasText: /^3$/ }).click();
checks.tick = await state();
const bank = page.locator(".membership-card > nav");
await bank
  .getByRole("button", { name: "0", exact: true })
  .dragTo(page.locator(".natural-zone"));
checks.zeroWrong = await state();
await page
  .locator(".natural-zone > div")
  .getByRole("button", { name: "0", exact: true })
  .dragTo(page.locator(".excluded-zone"));
checks.zeroFixed = await state();
await page
  .locator(".natural-zone > div")
  .getByRole("button", { name: "1", exact: true })
  .dragTo(page.locator(".excluded-zone"));
checks.oneWrong = await state();
await page
  .locator(".excluded-zone > div")
  .getByRole("button", { name: "1", exact: true })
  .dragTo(page.locator(".natural-zone"));
checks.oneFixed = await state();
await node.getByRole("button", { name: "Share" }).click();
await page.waitForTimeout(100);
checks.share = await state();
await node.getByRole("button", { name: "Reset" }).click();
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
    surface: region(".natural-page"),
    regions: {
      shell: region(".natural-shell"),
      header: region(".natural-header"),
      layout: region(".natural-layout"),
      count: region(".count-card"),
      membership: region(".membership-card"),
      compare: region(".compare-card"),
      side: region(".natural-side"),
    },
  };
});
const passed =
  checks.initial.selected === "5" &&
  checks.initial.next === "6" &&
  checks.initial.natural === "1,5,6" &&
  checks.initial.excluded === "0,1/2,-3" &&
  checks.initial["classification-correct"] === "true" &&
  checks.slider.selected === "8" &&
  checks.slider.next === "9" &&
  checks.trayCount === 8 &&
  checks.tick.selected === "3" &&
  checks.tick.next === "4" &&
  checks.zeroWrong["classification-correct"] === "false" &&
  checks.zeroWrong.natural.includes("0") &&
  checks.zeroFixed["classification-correct"] === "true" &&
  checks.zeroFixed.excluded.includes("0") &&
  checks.oneWrong["classification-correct"] === "false" &&
  checks.oneWrong.excluded.includes("1") &&
  checks.oneFixed["classification-correct"] === "true" &&
  checks.oneFixed.natural.includes("1") &&
  Number(checks.share.actions) >= 7 &&
  checks.reset.selected === "5" &&
  checks.reset["classification-correct"] === "true" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0039-desktop.png") });
await copyFile(reference, path.join(out, "0039-reference.png"));
const report = {
  mockup: "0039",
  lessonId: 57,
  route: "/lessons/numbers-and-arithmetic/57-natural-numbers",
  objectModel:
    "selected-natural-counting-tray-number-line-one-more-membership-drag-classification-comparison-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0039-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
