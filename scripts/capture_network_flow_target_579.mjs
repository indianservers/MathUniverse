/* global document, innerWidth, MouseEvent, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0636-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-network-flow-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/579-network-flow";

const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0636");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(400);

const keys = [
    "flowValue",
    "maxFlow",
    "valid",
    "conserved",
    "maximum",
    "selectedEdge",
    "selectedFlow",
    "residualPath",
    "highlightedPath",
    "variant",
    "positions",
    "graded",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };

await lesson.getByTestId("flow-edge-ac").click();
await lesson.getByLabel("Selected edge flow").fill("1");
checks.unbalanced = await state();

await lesson.getByRole("button", { name: /Reset/ }).click();
for (const edge of ["sa", "sb", "ab", "ac", "ad", "bd", "cd", "ct", "dt"]) {
  await lesson
    .getByTestId(`flow-edge-${edge}`)
    .evaluate((node) => node.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  await page.waitForFunction(
    (selected) =>
      document.querySelector('[data-testid="discrete-mockup-0636"]')?.dataset
        .selectedEdge === selected,
    edge,
  );
  await lesson.getByLabel("Selected edge flow").fill("0");
}
checks.zero = await state();
await lesson.getByRole("button", { name: /Find augmenting path/ }).click();
checks.found = await state();
await lesson.getByRole("button", { name: /Auto augment/ }).click();
checks.auto = await state();

const beforeDrag = checks.auto.positions,
  vertexC = lesson.getByTestId("flow-vertex-C"),
  box = await vertexC.boundingBox();
if (!box) throw new Error("Flow vertex C was not rendered");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 65, box.y + box.height / 2 + 75, {
  steps: 10,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== beforeDrag;

await lesson.getByLabel("Show labels").uncheck();
checks.labelsOff = !(await lesson.getByLabel("Show labels").isChecked());
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".nf579-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();

await lesson.getByLabel("Maximum flow challenge answer").fill("5");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Maximum flow challenge answer").fill("6");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();

await lesson.getByRole("button", { name: /New network/ }).click();
checks.variant = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(300);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));

const rect = async (selector) => {
  const box = selector
    ? await lesson.locator(selector).boundingBox()
    : await lesson.boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        left: Math.round(box.x),
        width: Math.round(box.width),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  surface: await rect(null),
  hero: await rect(".nf579-hero"),
  tabs: await rect(".nf579-tabs"),
  lab: await rect(".nf579-lab"),
  theory: await rect(".nf579-theory"),
  worked: await rect(".nf579-worked"),
  practice: await rect(".nf579-practice"),
  adjacent: await rect(".nf579-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0636-desktop.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`mobile ${message.type()}: ${message.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0636").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(300);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0636-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial.flowValue === "5" &&
  checks.initial.maxFlow === "5" &&
  checks.initial.valid === "true" &&
  checks.initial.conserved === "true" &&
  checks.initial.maximum === "true" &&
  checks.unbalanced.conserved === "false" &&
  checks.unbalanced.maximum === "false" &&
  checks.zero.flowValue === "0" &&
  checks.zero.valid === "true" &&
  checks.zero.residualPath.startsWith("S,") &&
  checks.found.highlightedPath === checks.zero.residualPath &&
  checks.auto.flowValue === checks.auto.maxFlow &&
  checks.auto.maximum === "true" &&
  checks.dragChanged &&
  checks.labelsOff &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.variant.variant === "1" &&
  checks.variant.maximum === "true" &&
  checks.final.flowValue === "5" &&
  checks.final.maximum === "true" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0636-reference.png"));
await writeFile(
  path.join(evidence, "0636-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    { passed, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
