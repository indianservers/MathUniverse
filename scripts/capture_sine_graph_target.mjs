import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/261-sine-graph";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0318-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0318-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 878, height: 1792 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`); });
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='261']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  theta: Number(element.dataset.theta), currentY: Number(element.dataset.currentY), amplitude: Number(element.dataset.amplitude),
  period: Number(element.dataset.period), phaseShift: Number(element.dataset.phaseShift), verticalShift: Number(element.dataset.verticalShift),
  playing: element.dataset.playing === "true", practiceResult: element.dataset.practiceResult,
}));
const checks = { initial: await state() };
if (Math.abs(checks.initial.theta - Math.PI / 3) > 1e-5 || Math.abs(checks.initial.currentY - Math.sqrt(3) / 2) > 1e-5 || checks.initial.amplitude !== 1 || Math.abs(checks.initial.period - Math.PI * 2) > 1e-5) throw new Error(`Initial sine model failed: ${JSON.stringify(checks.initial)}`);

async function drag(testId, dx, dy) {
  const locator = page.getByTestId(testId), box = await locator.boundingBox();
  if (!box) throw new Error(`${testId} has no box`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 8 });
  await page.mouse.up();
}
await drag("sine-unit-circle-handle", -52, -14);
checks.circleDrag = await state();
if (Math.abs(checks.circleDrag.theta - Math.PI / 2) > .08 || Math.abs(checks.circleDrag.currentY - 1) > .01) throw new Error(`Circle-to-wave drag failed: ${JSON.stringify(checks.circleDrag)}`);
const beforeGraph = await state();
await drag("sine-main-graph-handle", 42, 0);
checks.graphDrag = await state();
if (Math.abs(checks.graphDrag.theta - beforeGraph.theta) < .25 || Math.abs(checks.graphDrag.currentY - Math.sin(checks.graphDrag.theta)) > 1e-5) throw new Error("Wave-to-circle drag failed");

await page.getByRole("slider", { name: "Amplitude A" }).fill("2");
await page.getByRole("slider", { name: "Period factor B" }).fill("2");
const phaseSlider = page.getByRole("slider", { name: "Phase shift C" });
await phaseSlider.focus();
for (let index = 0; index < 4; index += 1) await phaseSlider.press("ArrowRight");
await page.getByRole("slider", { name: "Vertical shift D" }).fill("1");
checks.transformed = await state();
if (checks.transformed.amplitude !== 2 || Math.abs(checks.transformed.period - Math.PI) > 1e-5 || Math.abs(checks.transformed.phaseShift - Math.PI / 3) > .01 || checks.transformed.verticalShift !== 1) throw new Error(`Transform controls failed: ${JSON.stringify(checks.transformed)}`);

await page.getByRole("button", { name: "Play animation", exact: true }).click();
const beforePlay = await state();
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Pause animation", exact: true }).click();
checks.animation = await state();
if (checks.animation.playing || Math.abs(checks.animation.theta - beforePlay.theta) < .03) throw new Error("Animation controls failed");

for (const key of ["A", "B", "C", "D"]) await page.getByLabel(`Practice ${key}`).fill("1");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.incorrect = await state();
if (checks.incorrect.practiceResult !== "incorrect") throw new Error("Incorrect practice path failed");
await page.getByLabel("Practice A").fill("1.5"); await page.getByLabel("Practice B").fill("2"); await page.getByLabel("Practice C").fill("-pi/4"); await page.getByLabel("Practice D").fill("-0.5");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
if (checks.correct.practiceResult !== "correct") throw new Error("Correct symbolic practice path failed");
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (Math.abs(checks.reset.theta - Math.PI / 3) > 1e-5 || checks.reset.amplitude !== 1 || checks.reset.practiceResult !== "correct") throw new Error("Reset failed");

const metrics = await page.evaluate(() => {
  const element = globalThis.document.querySelector("[data-dedicated-lesson='261']")?.getBoundingClientRect();
  const sync = globalThis.document.querySelector(".target-sine-sync")?.getBoundingClientRect();
  const transform = globalThis.document.querySelector(".target-sine-transform")?.getBoundingClientRect();
  const practice = globalThis.document.querySelector(".target-sine-practice")?.getBoundingClientRect();
  const nav = globalThis.document.querySelector(".target-sine-nav")?.getBoundingClientRect();
  return { viewport:{width:globalThis.innerWidth,height:globalThis.innerHeight}, document:{width:globalThis.document.documentElement.scrollWidth,height:globalThis.document.documentElement.scrollHeight}, horizontalOverflow:globalThis.document.documentElement.scrollWidth>globalThis.innerWidth, surfaceTop:element?.top??null,surfaceBottom:element?.bottom??null,syncTop:sync?.top??null,syncBottom:sync?.bottom??null,transformTop:transform?.top??null,transformBottom:transform?.bottom??null,practiceTop:practice?.top??null,practiceBottom:practice?.bottom??null,navTop:nav?.top??null,navBottom:nav?.bottom??null };
});
await page.screenshot({ path:path.join(out,"0318-desktop.png"), fullPage:false });
const validation={mockup:"0318",lessonId:261,route,reference:reference??null,objectModel:await surface.getAttribute("data-object-model"),checks,metrics,consoleMessages:messages,passed:!metrics.horizontalOverflow&&messages.length===0};
await writeFile(path.join(out,"0318-dedicated-target-validation.json"),JSON.stringify(validation,null,2));
console.log(JSON.stringify(validation,null,2));
await browser.close();
