import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0029-interactive-foundational-advanced-algebra-and-dynamic-variables-object-redefinition-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/29-object-redefinition";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1227, height: 1294 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0029");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-name",
        "data-old-rule",
        "data-rule",
        "data-draft",
        "data-valid",
        "data-a",
        "data-b",
        "data-revision",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
const definition = page.getByLabel("New object definition");
await definition.fill("2*x + 3");
await page.getByLabel("Object name").fill("g");
checks.edited = await state();
await page.getByRole("button", { name: "Redefine g" }).click();
checks.redefined = await state();
await definition.fill("(x + 1");
checks.invalid = await state();
checks.disabled = await page
  .getByRole("button", { name: "Redefine g" })
  .isDisabled();
await page.getByLabel("Clear object definition").click();
checks.clear = await state();
await definition.fill("x^3");
await page.getByRole("button", { name: "Redefine g" }).click();
checks.secondRedefinition = await state();
await page.getByRole("button", { name: "View as table" }).click();
checks.tableAction = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
checks.resetByReload = await state();
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
    surface: region(".redefinition-page"),
    regions: {
      card: region(".redefinition-surface"),
      header: region(".redefinition-header"),
      main: region(".redefinition-main"),
      definition: region(".definition-card"),
      graphs: region(".graph-comparison"),
      table: region(".dependent-table"),
      tree: region(".dependency-tree"),
      side: region(".redefinition-side"),
      neighbors: region(".redefinition-neighbors"),
      footer: region(".redefinition-footer"),
    },
  };
});
const passed =
  checks.initial.valid === "true" &&
  checks.initial["old-rule"] === "x + 1" &&
  checks.initial.rule === "x^2 - 1" &&
  checks.initial.a === "3" &&
  checks.initial.b === "-1" &&
  checks.edited.name === "g" &&
  checks.redefined["old-rule"] === "x^2 - 1" &&
  checks.redefined.rule === "2*x + 3" &&
  checks.redefined.a === "7" &&
  checks.redefined.b === "3" &&
  checks.redefined.revision === "2" &&
  checks.invalid.valid === "false" &&
  checks.disabled &&
  checks.clear.valid === "false" &&
  checks.secondRedefinition.rule === "x^3" &&
  checks.secondRedefinition.a === "8" &&
  checks.secondRedefinition.b === "0" &&
  Number(checks.tableAction.actions) >= 7 &&
  checks.resetByReload.name === "f" &&
  checks.resetByReload.rule === "x^2 - 1" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0029-desktop.png") });
await copyFile(reference, path.join(out, "0029-reference.png"));
const report = {
  mockup: "0029",
  lessonId: 29,
  route: "/lessons/core-workspaces/29-object-redefinition",
  objectModel:
    "preserved-object-identity-executable-old-new-rule-dependent-output-dual-graph-dependency-tree-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0029-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
