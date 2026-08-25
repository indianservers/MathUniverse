import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0033-interactive-foundational-advanced-algebra-and-dynamic-variables-matrices-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/33-matrices";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1575, height: 999 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0033");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-matrix",
        "data-rows",
        "data-columns",
        "data-selected-row",
        "data-selected-column",
        "data-selected-value",
        "data-draft",
        "data-determinant",
        "data-trace",
        "data-vector",
        "data-workspace",
        "data-tab",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() },
  value = page.getByLabel("Selected matrix cell value");
await value.fill("6");
checks.draft = await state();
await page.getByRole("button", { name: "Apply" }).click();
checks.apply = await state();
await page.getByLabel("Selected matrix cell", { exact: true }).selectOption("0,1");
await value.fill("5");
await page.getByRole("button", { name: "Apply" }).click();
checks.secondCell = await state();
const sizeButtons = page.locator(".matrix-size button");
await sizeButtons.nth(1).click();
checks.threeByTwo = await state();
await sizeButtons.nth(3).click();
checks.threeByThree = await state();
await page.getByLabel("Selected matrix cell", { exact: true }).selectOption("2,2");
await value.fill("2");
await page.getByRole("button", { name: "Apply" }).click();
checks.threeByThreeEdit = await state();
await page.locator(".matrix-tabs button").nth(3).click();
checks.tab = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await page.getByRole("button", { name: /Share/ }).click();
await page.waitForTimeout(100);
checks.share = await state();
await page.getByRole("button", { name: "Reset" }).click();
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
    surface: region(".matrices-page"),
    regions: {
      header: region(".matrices-header"),
      surface: region(".matrices-surface"),
      tabs: region(".matrix-tabs"),
      main: region(".matrix-main"),
      editor: region(".matrix-editor"),
      facts: region(".matrix-facts"),
      action: region(".matrix-action"),
      transform: region(".matrix-transform"),
      side: region(".matrix-side"),
    },
  };
});
const passed =
  checks.initial.matrix === "1,2,3,4" &&
  checks.initial.determinant === "-2" &&
  checks.initial.trace === "5" &&
  checks.initial.vector === "3,7" &&
  checks.draft.draft === "6" &&
  checks.draft.matrix === "1,2,3,4" &&
  checks.apply.matrix === "1,2,3,6" &&
  checks.apply.trace === "7" &&
  checks.apply.vector === "3,9" &&
  checks.secondCell.matrix === "1,5,3,6" &&
  checks.secondCell.determinant === "-9" &&
  checks.secondCell.vector === "6,9" &&
  checks.threeByTwo.rows === "3" &&
  checks.threeByTwo.columns === "2" &&
  checks.threeByTwo.determinant === "undefined" &&
  checks.threeByThree.rows === "3" &&
  checks.threeByThree.columns === "3" &&
  checks.threeByThree.determinant === "-9" &&
  checks.threeByThree.trace === "8" &&
  checks.threeByThreeEdit.determinant === "-18" &&
  checks.threeByThreeEdit.trace === "9" &&
  checks.tab.tab === "3" &&
  checks.workspace.workspace === "true" &&
  Number(checks.share.actions) >= 11 &&
  checks.reset.matrix === "1,2,3,4" &&
  checks.reset.determinant === "-2" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0033-desktop.png") });
await copyFile(reference, path.join(out, "0033-reference.png"));
const report = {
  mockup: "0033",
  lessonId: 33,
  route: "/lessons/core-workspaces/33-matrices",
  objectModel:
    "editable-resizable-matrix-selected-cell-row-column-determinant-trace-vector-action-geometric-transform-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0033-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
