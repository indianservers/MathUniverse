import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/258-unit-circle";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0315-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0315-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 981, height: 1603 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='258']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  angle: Number(element.dataset.angleDegrees),
  normalized: Number(element.dataset.normalizedDegrees),
  cos: Number(element.dataset.cos),
  sin: Number(element.dataset.sin),
  identity: Number(element.dataset.identity),
  quadrant: element.dataset.quadrant,
  tab: element.dataset.activeTab,
}));
const checks = { initial: await state() };
if (Math.abs(checks.initial.cos - Math.sqrt(3) / 2) > 1e-5 || Math.abs(checks.initial.sin - .5) > 1e-5 || checks.initial.identity !== 1) throw new Error("Initial 30-degree model is inconsistent");

const point = page.getByTestId("unit-circle-point");
const pointBox = await point.boundingBox();
if (!pointBox) throw new Error("Unit-circle point has no bounding box");
await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y + pointBox.height / 2);
await page.mouse.down();
await page.mouse.move(pointBox.x - 85, pointBox.y - 35, { steps: 9 });
await page.mouse.up();
checks.pointDrag = await state();
if (Math.abs(checks.pointDrag.angle - checks.initial.angle) < 5 || Math.abs(checks.pointDrag.identity - 1) > 1e-5) throw new Error("Point drag failed or broke the unit-circle identity");

const exact = page.getByLabel("Exact unit circle angle");
await exact.fill("135");
checks.angle135 = await state();
if (checks.angle135.quadrant !== "II" || Math.abs(checks.angle135.cos + Math.SQRT1_2) > 1e-5 || Math.abs(checks.angle135.sin - Math.SQRT1_2) > 1e-5) throw new Error("135-degree quadrant model is inconsistent");

const slider = page.getByLabel("Unit circle angle", { exact: true });
await slider.fill("-60");
checks.sliderMinus60 = await state();
if (checks.sliderMinus60.quadrant !== "IV" || Math.abs(checks.sliderMinus60.cos - .5) > 1e-5 || Math.abs(checks.sliderMinus60.sin + Math.sqrt(3) / 2) > 1e-5) throw new Error("Principal slider failed at -60 degrees");

await page.getByRole("button", { name: "270°", exact: true }).click();
checks.quick270 = await state();
if (checks.quick270.angle !== 270 || checks.quick270.sin !== -1 || checks.quick270.cos !== 0) throw new Error("270-degree quick angle failed");
await page.getByRole("button", { name: "Rad", exact: true }).click();
checks.radianDisplay = await page.locator(".target-unit-circle-workspace > header strong").innerText();
if (!checks.radianDisplay.includes("3π/2")) throw new Error("Radian display did not update");

await page.getByRole("button", { name: "Explain", exact: true }).click();
checks.tabExplain = await state();
if (checks.tabExplain.tab !== "Explain") throw new Error("Lesson tab did not update");
await page.getByRole("button", { name: "Interactive Lab", exact: true }).click();

const answers = page.locator(".target-unit-circle-practice label");
await answers.nth(2).click();
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.incorrect = await page.getByRole("status").innerText();
if (!checks.incorrect.includes("Check the sign")) throw new Error("Incorrect grading path failed");
await answers.nth(0).click();
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await page.getByRole("status").innerText();
checks.practiceState = await state();
if (!checks.correct.includes("Correct") || checks.practiceState.angle !== -60) throw new Error("Correct grading path or requested angle failed");

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (checks.reset.angle !== 30 || checks.reset.tab !== "Interactive Lab") throw new Error("Reset failed");

const metrics = await page.evaluate(() => {
  const element = globalThis.document.querySelector("[data-dedicated-lesson='258']");
  const rect = element?.getBoundingClientRect();
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    contentFitsViewport: (rect?.bottom ?? Infinity) <= globalThis.innerHeight,
    surfaceTop: rect?.top ?? null,
    surfaceBottom: rect?.bottom ?? null,
  };
});
await page.screenshot({ path: path.join(out, "0315-desktop.png"), fullPage: false });
const validation = {
  mockup: "0315",
  lessonId: 258,
  route,
  reference: reference ?? null,
  objectModel: await surface.getAttribute("data-object-model"),
  checks,
  metrics,
  consoleMessages: messages,
  passed: !metrics.horizontalOverflow && metrics.contentFitsViewport && messages.length === 0,
};
await writeFile(path.join(out, "0315-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();
