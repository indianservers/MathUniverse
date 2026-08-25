import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0034-interactive-foundational-advanced-algebra-and-dynamic-variables-sequences-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/34-sequences";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1217, height: 1292 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0034");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-first",
        "data-difference",
        "data-selected",
        "data-selected-value",
        "data-terms",
        "data-next",
        "data-tab",
        "data-workspace",
        "data-preset",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("First term", { exact: true }).fill("5");
await page.getByLabel("Common difference", { exact: true }).fill("4");
checks.parameters = await state();
await page.locator(".sequence-controls nav button").nth(2).click();
checks.selectThree = await state();
await page.locator(".term-table button").nth(5).click();
checks.tableSix = await state();
await page.getByRole("button", { name: /New values/ }).click();
checks.presetOne = await state();
await page.getByRole("button", { name: /New values/ }).click();
checks.presetTwo = await state();
await page.getByRole("button", { name: /Restart/ }).click();
checks.restart = await state();
await page.locator(".sequence-tabs button").nth(3).click();
checks.tab = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /Share/ }).click();
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
    surface: region(".sequences-page"),
    regions: {
      header: region(".sequences-header"),
      tabs: region(".sequence-tabs"),
      layout: region(".sequence-layout"),
      work: region(".sequence-work"),
      terms: region(".term-cards"),
      jumps: region(".jump-model"),
      bottom: region(".sequence-bottom"),
      challenge: region(".next-challenge"),
      side: region(".sequence-side"),
    },
  };
});
const passed =
  checks.initial.first === "2" &&
  checks.initial.difference === "3" &&
  checks.initial.terms === "2,5,8,11,14,17" &&
  checks.initial.selected === "5" &&
  checks.initial["selected-value"] === "14" &&
  checks.initial.next === "17" &&
  checks.parameters.terms === "5,9,13,17,21,25" &&
  checks.parameters["selected-value"] === "21" &&
  checks.selectThree.selected === "3" &&
  checks.selectThree["selected-value"] === "13" &&
  checks.tableSix.selected === "6" &&
  checks.tableSix["selected-value"] === "25" &&
  checks.presetOne.preset === "1" &&
  checks.presetOne.terms === "3,7,11,15,19,23" &&
  checks.presetTwo.preset === "2" &&
  checks.presetTwo.terms === "-2,3,8,13,18,23" &&
  checks.restart.terms === "2,5,8,11,14,17" &&
  checks.tab.tab === "3" &&
  checks.workspace.workspace === "true" &&
  Number(checks.share.actions) >= 10 &&
  checks.reset.tab === "0" &&
  checks.reset.workspace === "false" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0034-desktop.png") });
await copyFile(reference, path.join(out, "0034-reference.png"));
const report = {
  mockup: "0034",
  lessonId: 34,
  route: "/lessons/core-workspaces/34-sequences",
  objectModel:
    "arithmetic-sequence-first-term-common-difference-index-explicit-rule-jump-table-prediction-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0034-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
