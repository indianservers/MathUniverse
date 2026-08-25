import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0046-interactive-foundational-intermediate-numbers-and-number-theory-place-value-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/64-place-value";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1060, height: 1484 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0046");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-number",
        "data-selected-index",
        "data-selected-digit",
        "data-selected-place",
        "data-selected-value",
        "data-expanded",
        "data-block-counts",
        "data-drag-index",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-practice-index",
        "data-practice-value",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const blockCounts = () =>
  page.evaluate(() =>
    Object.fromEntries(
      ["thousands", "hundreds", "tens", "ones"].map((place) => [
        place,
        document.querySelectorAll(`.place64-blocks.${place} .base-block`).length,
      ]),
    ),
  );
const checks = {
  initial: await state(),
  initialBlocks: await blockCounts(),
};

await node.getByRole("button", { name: "8 in the tens place" }).click();
checks.selectedTens = await state();
await page.getByLabel("Four digit number").fill("9074");
checks.edited = await state();
checks.editedBlocks = await blockCounts();

await node
  .getByRole("button", { name: "9 in the thousands place" })
  .dragTo(page.locator('.place64-column[data-place="ones"]'));
checks.dragged = await state();
checks.draggedBlocks = await blockCounts();

await node.getByRole("button", { name: "Reset", exact: true }).click();
await node.locator(".place64-practice").click();
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
    surface: region(".place64-page"),
    regions: {
      hero: region(".place64-hero"),
      tabs: region(".place64-tabs"),
      layout: region(".place64-layout"),
      work: region(".place64-work"),
      columns: region(".place64-columns"),
      side: region(".place64-side"),
      navigation: region(".place64-navigation"),
      footer: region(".place64-footer"),
    },
  };
});
const passed =
  checks.initial.number === "5381" &&
  checks.initial["selected-place"] === "thousands" &&
  checks.initial["selected-value"] === "5000" &&
  checks.initial.expanded === "5000+300+80+1" &&
  checks.initial["block-counts"] === "5,3,8,1" &&
  checks.initialBlocks.thousands === 5 &&
  checks.initialBlocks.hundreds === 3 &&
  checks.initialBlocks.tens === 8 &&
  checks.initialBlocks.ones === 1 &&
  checks.selectedTens["selected-index"] === "2" &&
  checks.selectedTens["selected-digit"] === "8" &&
  checks.selectedTens["selected-value"] === "80" &&
  checks.edited.number === "9074" &&
  checks.edited.expanded === "9000+0+70+4" &&
  checks.editedBlocks.thousands === 9 &&
  checks.editedBlocks.hundreds === 0 &&
  checks.editedBlocks.tens === 7 &&
  checks.editedBlocks.ones === 4 &&
  checks.dragged.number === "4079" &&
  checks.dragged["selected-place"] === "ones" &&
  checks.dragged["selected-digit"] === "9" &&
  checks.dragged["selected-value"] === "9" &&
  checks.dragged.expanded === "4000+0+70+9" &&
  checks.draggedBlocks.thousands === 4 &&
  checks.draggedBlocks.ones === 9 &&
  checks.practice["practice-index"] === "1" &&
  checks.practice["practice-value"] === "300" &&
  checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.reset.number === "5381" &&
  checks.reset["selected-place"] === "thousands" &&
  checks.reset["practice-index"] === "0" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0046-desktop.png") });
await copyFile(reference, path.join(out, "0046-reference.png"));
const report = {
  mockup: "0046",
  lessonId: 64,
  route: "/lessons/numbers-and-arithmetic/64-place-value",
  objectModel:
    "editable-four-digit-place-columns-draggable-digit-swap-exact-base-ten-block-expanded-form-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0046-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
