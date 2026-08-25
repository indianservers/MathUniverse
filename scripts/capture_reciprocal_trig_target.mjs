import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/264-reciprocal-trig-functions";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0321-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0321-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='264']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  functionKey: element.dataset.function,
  theta: Number(element.dataset.theta),
  baseValue: element.dataset.baseValue === "undefined" ? null : Number(element.dataset.baseValue),
  reciprocalValue: element.dataset.reciprocalValue === "undefined" ? null : Number(element.dataset.reciprocalValue),
  defined: element.dataset.defined === "true",
  stage: Number(element.dataset.stage),
  view: Number(element.dataset.view),
  showAsymptotes: element.dataset.showAsymptotes === "true",
  practiceResult: element.dataset.practiceResult,
  solutionShown: element.dataset.solutionShown === "true",
}));
const checks = { initial: await state() };
if (Math.abs(checks.initial.baseValue - Math.sqrt(3) / 2) > 1e-5 || Math.abs(checks.initial.reciprocalValue - 2 / Math.sqrt(3)) > 1e-5) throw new Error(`Initial reciprocal model failed: ${JSON.stringify(checks.initial)}`);

async function drag(testId, dx) {
  const locator = page.getByTestId(testId);
  const box = await locator.boundingBox();
  if (!box) throw new Error(`${testId} has no box`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
}
await drag("reciprocal-base-handle", 20);
checks.baseDrag = await state();
if (Math.abs(checks.baseDrag.theta - checks.initial.theta) < .15 || Math.abs(checks.baseDrag.reciprocalValue - 1 / Math.cos(checks.baseDrag.theta)) > 1e-4) throw new Error(`Base graph drag did not update the shared reciprocal model: ${JSON.stringify({ initial: checks.initial, dragged: checks.baseDrag })}`);
const beforeReciprocal = await state();
await drag("reciprocal-function-handle", -20);
checks.reciprocalDrag = await state();
if (Math.abs(checks.reciprocalDrag.theta - beforeReciprocal.theta) < .15 || Math.abs(checks.reciprocalDrag.baseValue - Math.cos(checks.reciprocalDrag.theta)) > 1e-5) throw new Error("Reciprocal graph drag did not update the shared base model");

const radios = page.getByRole("radio");
await radios.nth(1).check();
await page.getByLabel("Reciprocal angle").fill("30");
checks.cosec30 = await state();
if (checks.cosec30.functionKey !== "csc" || Math.abs(checks.cosec30.reciprocalValue - 2) > 1e-5) throw new Error("Cosecant branch failed");
await radios.nth(2).check();
await page.getByLabel("Reciprocal angle").fill("45");
checks.cot45 = await state();
if (checks.cot45.functionKey !== "cot" || Math.abs(checks.cot45.reciprocalValue - 1) > 1e-5) throw new Error("Cotangent branch failed");
await radios.nth(0).check();
await page.getByLabel("Reciprocal angle").fill("90");
checks.undefined90 = await state();
if (checks.undefined90.defined || checks.undefined90.reciprocalValue !== null) throw new Error("Secant undefined guard failed");
await page.getByLabel("Reciprocal angle").fill("30");

await page.getByRole("button", { name: "Settings", exact: true }).click();
checks.asymptotesOff = await state();
if (checks.asymptotesOff.showAsymptotes) throw new Error("Asymptote setting failed");
await page.getByRole("button", { name: "Settings", exact: true }).click();
await page.getByLabel("Graph view window").selectOption("180");
checks.view180 = await state();
if (checks.view180.view !== 180 || !checks.view180.showAsymptotes) throw new Error("Graph controls failed");
await page.getByRole("button", { name: /Understand/, exact: true }).click();
checks.stage2 = await state();
if (checks.stage2.stage !== 2) throw new Error("Stage navigation failed");
await page.getByRole("button", { name: /Explore & Visualize/, exact: true }).click();

await page.getByLabel("Secant answer a").fill("1");
await page.getByRole("button", { name: "Check Answers", exact: true }).click();
checks.incorrect = await state();
if (checks.incorrect.practiceResult !== "incorrect") throw new Error("Incorrect practice path failed");
await page.getByLabel("Secant answer a").fill("2");
await page.getByRole("button", { name: "Check Answers", exact: true }).click();
checks.correct = await state();
if (checks.correct.practiceResult !== "correct") throw new Error("Exact reciprocal answers failed");
await page.getByLabel("Secant answer d").fill("0");
await page.getByRole("button", { name: "Show solution", exact: true }).click();
checks.solution = await state();
if (!checks.solution.solutionShown || checks.solution.practiceResult !== "correct") throw new Error("Solution reveal failed");
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (checks.reset.functionKey !== "sec" || Math.abs(checks.reset.theta - Math.PI / 6) > 1e-5 || checks.reset.view !== 360 || checks.reset.practiceResult !== "correct") throw new Error("Reset failed");
await page.evaluate(() => globalThis.scrollTo(0, 0));
await page.waitForTimeout(250);

const metrics = await page.evaluate(() => {
  const bounds = (selector) => globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBounds = bounds("[data-dedicated-lesson='264']");
  const header = bounds(".target-reciprocal-header");
  const stages = bounds(".target-reciprocal-stages");
  const lab = bounds(".target-reciprocal-lab");
  const rules = bounds(".target-reciprocal-rules");
  const examples = bounds(".target-reciprocal-examples");
  const practice = bounds(".target-reciprocal-practice");
  const nav = bounds(".target-reciprocal-nav");
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surfaceTop: surfaceBounds?.top ?? null,
    surfaceBottom: surfaceBounds?.bottom ?? null,
    headerTop: header?.top ?? null, headerBottom: header?.bottom ?? null,
    stagesTop: stages?.top ?? null, stagesBottom: stages?.bottom ?? null,
    labTop: lab?.top ?? null, labBottom: lab?.bottom ?? null,
    rulesTop: rules?.top ?? null, rulesBottom: rules?.bottom ?? null,
    examplesTop: examples?.top ?? null, examplesBottom: examples?.bottom ?? null,
    practiceTop: practice?.top ?? null, practiceBottom: practice?.bottom ?? null,
    navTop: nav?.top ?? null, navBottom: nav?.bottom ?? null,
  };
});
await page.screenshot({ path: path.join(out, "0321-desktop.png"), fullPage: false });
const validation = { mockup: "0321", lessonId: 264, route, reference: reference ?? null, objectModel: await surface.getAttribute("data-object-model"), checks, metrics, consoleMessages: messages, passed: !metrics.horizontalOverflow && messages.length === 0 };
await writeFile(path.join(out, "0321-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();
