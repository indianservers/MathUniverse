import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0032-interactive-foundational-advanced-algebra-and-dynamic-variables-lists-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/32-lists";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1487, height: 1058 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0032");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-list",
        "data-selected-index",
        "data-selected-value",
        "data-length",
        "data-sum",
        "data-mean",
        "data-final-list",
        "data-final-sum",
        "data-final-mean",
        "data-view",
        "data-descending",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("List value 1").fill("3");
checks.edit = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const items = page.locator(".list-item");
await items.nth(0).dragTo(items.nth(3));
checks.drag = await state();
await page.getByRole("button", { name: /Dot plot/ }).click();
checks.dot = await state();
await page.getByRole("button", { name: /Reset list/ }).click();
checks.reset = await state();
await page.getByLabel("Append next list value").click();
checks.append = await state();
await page.locator(".list-operations button").nth(1).click();
checks.remove = await state();
await page.locator(".list-operations button").nth(2).click();
checks.map = await state();
await page.locator(".list-operations button").nth(3).click();
checks.sortAscending = await state();
await page.locator(".list-operations button").nth(3).click();
checks.sortDescending = await state();
await page.getByRole("button", { name: /Reset list/ }).click();
await page.getByRole("button", { name: /Start over/ }).click();
checks.startOver = await state();
await page.getByRole("button", { name: /Reset list/ }).click();
checks.finalReset = await state();
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
    surface: region(".lists-page"),
    regions: {
      shell: region(".lists-shell"),
      header: region(".lists-header"),
      tabs: region(".lists-tabs"),
      layout: region(".lists-layout"),
      workspace: region(".lists-workspace"),
      editor: region(".list-editor"),
      pipeline: region(".pipeline"),
      visuals: region(".lists-visuals"),
      side: region(".lists-side"),
      concepts: region(".lists-concepts"),
    },
  };
});
const passed =
  checks.initial.list === "2,4,6,8" &&
  checks.initial["selected-index"] === "2" &&
  checks.initial["selected-value"] === "6" &&
  checks.initial.sum === "20" &&
  checks.initial.mean === "5" &&
  checks.initial["final-list"] === "4,12,16,20" &&
  checks.initial["final-sum"] === "52" &&
  checks.initial["final-mean"] === "13" &&
  checks.edit.list === "3,4,6,8" &&
  checks.edit.sum === "21" &&
  checks.drag.list === "4,6,8,2" &&
  checks.drag["selected-index"] === "3" &&
  checks.dot.view === "dot" &&
  checks.reset.list === "2,4,6,8" &&
  checks.append.list === "2,4,6,8,10" &&
  checks.append["selected-index"] === "4" &&
  checks.remove.list === "2,4,6,8" &&
  checks.map.list === "4,8,12,16" &&
  checks.sortAscending.descending === "true" &&
  checks.sortDescending.list === "16,12,8,4" &&
  checks.startOver.list === "" &&
  checks.startOver.length === "0" &&
  checks.finalReset.list === "2,4,6,8" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0032-desktop.png") });
await copyFile(reference, path.join(out, "0032-reference.png"));
const report = {
  mockup: "0032",
  lessonId: 32,
  route: "/lessons/core-workspaces/32-lists",
  objectModel:
    "editable-draggable-ordered-list-index-selection-operation-pipeline-statistics-bar-dot-result-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0032-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
