import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/265-inverse-trig-functions";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0322-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0322-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 976, height: 1612 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='265']");
await surface.waitFor();

const state = async () => surface.evaluate((element) => ({
  functionKey: element.dataset.function,
  angle: Number(element.dataset.angle),
  inputValue: Number(element.dataset.inputValue),
  inverseValue: Number(element.dataset.inverseValue),
  stage: element.dataset.stage,
  practiceRatio: Number(element.dataset.practiceRatio),
  practiceExpected: Number(element.dataset.practiceExpected),
  practiceResult: element.dataset.practiceResult,
  hintShown: element.dataset.hintShown === "true",
}));
const checks = { initial: await state() };
if (checks.initial.functionKey !== "asin" || Math.abs(checks.initial.angle - 45) > 1e-5 || Math.abs(checks.initial.inputValue - Math.SQRT1_2) > 1e-5 || Math.abs(checks.initial.inverseValue - 45) > 1e-5) throw new Error(`Initial inverse model failed: ${JSON.stringify(checks.initial)}`);

async function drag(testId, dx, dy) {
  const locator = page.getByTestId(testId);
  const box = await locator.boundingBox();
  if (!box) throw new Error(`${testId} has no box`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 8 });
  await page.mouse.up();
}

await drag("inverse-input-handle", -22, 12);
checks.inputDrag = await state();
if (Math.abs(checks.inputDrag.angle - checks.initial.angle) < 5 || Math.abs(checks.inputDrag.inputValue - Math.sin(checks.inputDrag.angle * Math.PI / 180)) > 1e-5) throw new Error(`Restricted input drag failed: ${JSON.stringify(checks.inputDrag)}`);
const beforeOutput = await state();
await drag("inverse-output-handle", 22, -12);
checks.outputDrag = await state();
if (Math.abs(checks.outputDrag.angle - beforeOutput.angle) < 5 || Math.abs(checks.outputDrag.inverseValue - checks.outputDrag.angle) > 1e-5) throw new Error(`Reflected output drag failed: ${JSON.stringify(checks.outputDrag)}`);

await page.getByRole("button", { name: "cos⁻¹ range", exact: true }).click();
await page.getByRole("slider", { name: "Restricted branch angle", exact: true }).fill("120");
checks.acos120 = await state();
if (checks.acos120.functionKey !== "acos" || Math.abs(checks.acos120.inputValue + .5) > 1e-5 || Math.abs(checks.acos120.inverseValue - 120) > 1e-5) throw new Error("Arccos branch failed");
await page.getByRole("button", { name: "tan⁻¹ range", exact: true }).click();
await page.getByRole("slider", { name: "Inverse output angle", exact: true }).fill("45");
checks.atan45 = await state();
if (checks.atan45.functionKey !== "atan" || Math.abs(checks.atan45.inputValue - 1) > 1e-5 || Math.abs(checks.atan45.inverseValue - 45) > 1e-5) throw new Error("Arctangent branch failed");
await page.getByRole("button", { name: "sin⁻¹ range", exact: true }).click();
await page.getByRole("spinbutton", { name: "Restricted branch angle numeric", exact: true }).fill("-30");
checks.asinMinus30 = await state();
if (checks.asinMinus30.functionKey !== "asin" || Math.abs(checks.asinMinus30.inputValue + .5) > 1e-5 || Math.abs(checks.asinMinus30.inverseValue + 30) > 1e-5) throw new Error("Arcsine branch failed");

await page.getByRole("button", { name: /Explain Concept/, exact: false }).click();
checks.explainStage = await state();
if (checks.explainStage.stage !== "explain") throw new Error("Explain stage failed");
await page.getByRole("button", { name: /Explore Interact/, exact: false }).click();

const beforePracticeDrag = await state();
await drag("inverse-practice-handle", -14, -8);
checks.practiceDrag = await state();
if (Math.abs(checks.practiceDrag.practiceRatio - beforePracticeDrag.practiceRatio) < .04 || Math.abs(checks.practiceDrag.practiceExpected - Math.asin(checks.practiceDrag.practiceRatio) * 180 / Math.PI) > 1e-3) throw new Error(`Practice construction drag failed: ${JSON.stringify({ before: beforePracticeDrag, after: checks.practiceDrag })}`);
await page.getByRole("spinbutton", { name: "Practice inverse answer numeric", exact: true }).fill("0");
await page.locator(".target-inverse-practice").getByRole("button", { name: "Check", exact: true }).click();
checks.practiceWrong = await state();
if (checks.practiceWrong.practiceResult !== "incorrect") throw new Error("Incorrect practice path failed");
await page.locator(".target-inverse-practice").getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await state();
if (!checks.hint.hintShown) throw new Error("Practice hint failed");
await page.getByRole("spinbutton", { name: "Practice inverse answer numeric", exact: true }).fill(checks.practiceWrong.practiceExpected.toFixed(2));
await page.locator(".target-inverse-practice").getByRole("button", { name: "Check", exact: true }).click();
checks.practiceCorrect = await state();
if (checks.practiceCorrect.practiceResult !== "correct") throw new Error("Correct practice path failed");
await page.locator(".target-inverse-practice").getByRole("button", { name: "Reset", exact: true }).click();
checks.practiceReset = await state();
if (Math.abs(checks.practiceReset.practiceRatio - .75) > 1e-5 || checks.practiceReset.practiceResult !== "idle") throw new Error("Practice reset failed");
await page.locator(".target-inverse-header").getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (checks.reset.functionKey !== "asin" || Math.abs(checks.reset.angle - 45) > 1e-5 || Math.abs(checks.reset.practiceRatio - .75) > 1e-5 || checks.reset.practiceResult !== "correct") throw new Error("Lesson reset failed");
await page.evaluate(() => {
  globalThis.scrollTo(0, 0);
  globalThis.document.querySelectorAll("*").forEach((element) => {
    if (element.scrollTop) element.scrollTop = 0;
    if (element.scrollLeft) element.scrollLeft = 0;
  });
});
await page.waitForTimeout(250);

const metrics = await page.evaluate(() => {
  const bounds = (selector) => globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBounds = bounds("[data-dedicated-lesson='265']");
  const header = bounds(".target-inverse-header"), tabs = bounds(".target-inverse-tabs"), flow = bounds(".target-inverse-flow"), workspace = bounds(".target-inverse-workspace"), rule = bounds(".target-inverse-rule"), example = bounds(".target-inverse-example"), misconception = bounds(".target-inverse-misconception"), practice = bounds(".target-inverse-practice"), nav = bounds(".target-inverse-nav");
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surfaceTop: surfaceBounds?.top ?? null, surfaceBottom: surfaceBounds?.bottom ?? null,
    headerTop: header?.top ?? null, headerBottom: header?.bottom ?? null,
    tabsTop: tabs?.top ?? null, tabsBottom: tabs?.bottom ?? null,
    flowTop: flow?.top ?? null, flowBottom: flow?.bottom ?? null,
    workspaceTop: workspace?.top ?? null, workspaceBottom: workspace?.bottom ?? null,
    ruleTop: rule?.top ?? null, ruleBottom: rule?.bottom ?? null,
    exampleTop: example?.top ?? null, exampleBottom: example?.bottom ?? null,
    misconceptionTop: misconception?.top ?? null, misconceptionBottom: misconception?.bottom ?? null,
    practiceTop: practice?.top ?? null, practiceBottom: practice?.bottom ?? null,
    navTop: nav?.top ?? null, navBottom: nav?.bottom ?? null,
  };
});
await page.screenshot({ path: path.join(out, "0322-desktop.png"), fullPage: false });
const validation = { mockup: "0322", lessonId: 265, route, reference: reference ?? null, objectModel: await surface.getAttribute("data-object-model"), checks, metrics, consoleMessages: messages, passed: !metrics.horizontalOverflow && messages.length === 0 };
await writeFile(path.join(out, "0322-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();
