import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0028-interactive-foundational-advanced-algebra-and-dynamic-variables-algebraic-input-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/28-algebraic-input";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1227, height: 1294 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0028");
await node.waitFor({ timeout: 180000 });
const field = page.getByLabel("Algebra function input");
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-valid",
        "data-name",
        "data-variable",
        "data-expression",
        "data-graph-count",
        "data-editing",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );

const checks = { initial: await state() };
await field.fill("g(x) = 2*x + 1");
checks.linear = await state();
await field.fill("g(x) = 2**");
checks.invalid = await state();
await page.getByLabel("Clear algebra input").click();
checks.clear = await state();
await field.fill("h(t) = t^2 + 1");
checks.variable = await state();
await page.getByRole("button", { name: /Create graph/ }).click();
checks.created = await state();
await page.getByRole("button", { name: /Edit input/ }).click();
checks.editing = await state();
await page.getByRole("button", { name: /Share/ }).click();
await page.waitForTimeout(100);
checks.shared = await state();
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
    surface: region(".algebraic-input-page"),
    regions: {
      card: region(".input-surface"),
      header: region(".input-header"),
      entry: region(".input-entry"),
      main: region(".input-main"),
      graph: region(".function-preview"),
      side: region(".input-side"),
      neighbors: region(".input-neighbors"),
      footer: region(".input-footer"),
    },
  };
});

const passed =
  checks.initial.valid === "true" &&
  checks.initial.name === "f" &&
  checks.initial.variable === "x" &&
  checks.linear.valid === "true" &&
  checks.linear.name === "g" &&
  checks.linear.expression === "2*x + 1" &&
  checks.invalid.valid === "false" &&
  checks.clear.valid === "false" &&
  checks.variable.valid === "true" &&
  checks.variable.name === "h" &&
  checks.variable.variable === "t" &&
  checks.created["graph-count"] === "1" &&
  checks.created.editing === "false" &&
  checks.editing.editing === "true" &&
  Number(checks.shared.actions) >= 7 &&
  checks.reset.expression === "x^2 - 4" &&
  checks.reset["graph-count"] === "0" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0028-desktop.png") });
await copyFile(reference, path.join(out, "0028-reference.png"));
const report = {
  mockup: "0028",
  lessonId: 28,
  route: "/lessons/core-workspaces/28-algebraic-input",
  objectModel:
    "parsed-function-syntax-validation-sampled-graph-root-vertex-key-point-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0028-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
