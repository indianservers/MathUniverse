import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0220-interactive-intermediate-function-transformations-transformation-order-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/163-transformation-order";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1023, height: 1537 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0220");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "a-vertex",
    "b-vertex",
    "a-equation",
    "b-equation",
    "a-enabled",
    "b-enabled",
    "stage",
    "work-tab",
    "different",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    ),
  valid = (item) => {
    const aVertex = Number(item["a-vertex"]),
      bVertex = Number(item["b-vertex"]);
    return (
      item["different"] === String(Math.abs(aVertex - bVertex) > 1e-8) &&
      item["a-equation"].startsWith("y = ") &&
      item["b-equation"].startsWith("y = ")
    );
  };
const checks = { initial: await state() };
await node
  .getByRole("switch", { name: "Pipeline A step 2", exact: true })
  .click();
checks.toggleAShift = await state();
await node
  .getByRole("switch", { name: "Pipeline B step 1", exact: true })
  .click();
checks.toggleBShift = await state();
await node.getByRole("button", { name: "Reset all", exact: true }).click();
const vertex = node.getByRole("slider", {
    name: "Drag Pipeline A vertex",
    exact: true,
  }),
  vertexBox = await vertex.boundingBox();
if (!vertexBox) throw new Error("Pipeline A graph vertex unavailable");
await page.mouse.move(
  vertexBox.x + vertexBox.width / 2,
  vertexBox.y + vertexBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  vertexBox.x + vertexBox.width / 2 - 28,
  vertexBox.y + vertexBox.height / 2,
  { steps: 10 },
);
await page.mouse.up();
checks.vertexDrag = await state();
await vertex.focus();
await vertex.press("ArrowRight");
checks.vertexKeyboard = await state();
for (const stage of ["Manipulate", "Notice", "Understand", "Try", "Observe"])
  await node.getByRole("button", { name: stage, exact: true }).click();
checks.stages = await state();
await node
  .getByRole("combobox", { name: "Try Pipeline A step 2" })
  .selectOption("shift2");
await node
  .getByRole("combobox", { name: "Try Pipeline B step 1" })
  .selectOption("shift3");
await node
  .getByRole("button", { name: "Apply & Compare", exact: true })
  .click();
checks.customPipelines = await state();
checks.applyStatus = await node.locator(".to163-try output").textContent();
await node.getByRole("button", { name: "Notes", exact: true }).click();
await node
  .getByRole("textbox", { name: "Transformation order notes" })
  .fill(
    "Reflect and shift do not commute because the input sign changes first.",
  );
checks.notes = await node
  .getByRole("textbox", { name: "Transformation order notes" })
  .inputValue();
checks.notesTab = await state();
await node.getByRole("button", { name: "Graph", exact: true }).click();
checks.graphTab = await state();
const previousHref = await node
    .getByRole("link", { name: /Previous Combined Transformations/ })
    .getAttribute("href"),
  nextHref = await node
    .getByRole("link", { name: /Next Parameter Explorer/ })
    .getAttribute("href");
await node.getByRole("button", { name: "Reset all", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll("*").forEach((element) => {
    if (element.scrollTop) element.scrollTop = 0;
  });
});
await page.waitForTimeout(75);
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const r = document.querySelector(selector)?.getBoundingClientRect();
    return r
      ? {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          right: r.right,
          width: r.width,
          height: r.height,
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
    regions: {
      page: region(".to163-page"),
      header: region(".to163-header"),
      stages: region(".to163-stages"),
      compare: region(".to163-compare"),
      pipelineA: region(".to163-pipeline.a"),
      graph: region(".to163-live"),
      pipelineB: region(".to163-pipeline.b"),
      insights: region(".to163-insights"),
      cards: region(".to163-cards"),
      practice: region(".to163-practice"),
      navigation: region(".to163-nav"),
    },
  };
});
const checkedStates = [
    checks.initial,
    checks.toggleAShift,
    checks.toggleBShift,
    checks.vertexDrag,
    checks.vertexKeyboard,
    checks.stages,
    checks.customPipelines,
    checks.notesTab,
    checks.graphTab,
    checks.reset,
  ],
  passed =
    checks.initial["a-vertex"] === "-1" &&
    checks.initial["b-vertex"] === "1" &&
    checks.initial["a-equation"] === "y = x² + 2x" &&
    checks.initial["b-equation"] === "y = x² - 2x" &&
    checks.initial["a-enabled"] === "true,true" &&
    checks.toggleAShift["a-enabled"] === "true,false" &&
    checks.toggleAShift["a-vertex"] === "0" &&
    checks.toggleBShift["b-enabled"] === "false,true" &&
    checks.toggleBShift["b-vertex"] === "0" &&
    checks.vertexDrag["a-vertex"] === "-2" &&
    checks.vertexDrag["b-vertex"] === "2" &&
    checks.vertexKeyboard["a-vertex"] === "-1.5" &&
    checks.stages.stage === "Observe" &&
    checks.customPipelines["a-vertex"] === "-2" &&
    checks.customPipelines["b-vertex"] === "3" &&
    checks.applyStatus === "Comparison applied" &&
    checks.notes.includes("do not commute") &&
    checks.notesTab["work-tab"] === "Notes" &&
    checks.graphTab["work-tab"] === "Graph" &&
    previousHref ===
      "/lessons/graphs-and-functions/162-combined-transformations" &&
    nextHref === "/lessons/graphs-and-functions/164-parameter-explorer" &&
    checks.reset["a-vertex"] === "-1" &&
    checks.reset["b-vertex"] === "1" &&
    checks.reset.stage === "Observe" &&
    checkedStates.every(valid) &&
    !metrics.horizontalOverflow &&
    consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0220-desktop.png") });
await copyFile(reference, path.join(out, "0220-reference.png"));
const report = {
  mockup: "0220",
  lessonId: 163,
  route: "/lessons/graphs-and-functions/163-transformation-order",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0220-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
