import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/260-exact-trig-values";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0317-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0317-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 993, height: 1584 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`); });
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='260']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  angle: Number(element.dataset.angle), radians: element.dataset.radians,
  sin: element.dataset.sin, cos: element.dataset.cos, tan: element.dataset.tan, cot: element.dataset.cot,
  view: element.dataset.view, challenge: Number(element.dataset.challenge), practiceResult: element.dataset.practiceResult,
}));
const checks = { initial: await state() };
if (checks.initial.angle !== 60 || checks.initial.radians !== "π/3" || checks.initial.sin !== "√3/2" || checks.initial.cos !== "1/2" || checks.initial.tan !== "√3") throw new Error(`Initial exact model failed: ${JSON.stringify(checks.initial)}`);

const handle = page.getByTestId("exact-unit-circle-handle");
const handleBox = await handle.boundingBox();
if (!handleBox) throw new Error("Unit-circle handle has no bounding box");
await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
await page.mouse.down();
await page.mouse.move(handleBox.x + handleBox.width / 2 + 20, handleBox.y + handleBox.height / 2 + 18, { steps: 8 });
await page.mouse.up();
checks.drag45 = await state();
if (checks.drag45.angle !== 45 || checks.drag45.sin !== "√2/2" || checks.drag45.cos !== "√2/2" || checks.drag45.tan !== "1") throw new Error(`Linked drag failed: ${JSON.stringify(checks.drag45)}`);

await page.getByLabel("Special angle").selectOption("30");
checks.select30 = await state();
if (checks.select30.radians !== "π/6" || checks.select30.sin !== "1/2" || checks.select30.cos !== "√3/2" || checks.select30.cot !== "√3") throw new Error("30-degree select failed");
await page.getByRole("button", { name: "Linked Triangle", exact: true }).click();
checks.triangleView = await state();
if (checks.triangleView.view !== "triangle") throw new Error("Linked-triangle tab failed");
await page.getByRole("button", { name: "Unit Circle", exact: true }).click();

const fields = [page.getByLabel("sin 45 degrees"), page.getByLabel("cos 45 degrees"), page.getByLabel("tan 45 degrees")];
for (const field of fields) await field.fill("0.7");
await page.getByRole("button", { name: "Check Values", exact: true }).click();
checks.incorrect = await state();
if (checks.incorrect.practiceResult !== "incorrect") throw new Error("Decimal rejection failed");
await fields[0].fill("sqrt(2)/2"); await fields[1].fill("√2/2"); await fields[2].fill("1");
await page.getByRole("button", { name: "Check Values", exact: true }).click();
checks.correct = await state();
if (checks.correct.practiceResult !== "correct") throw new Error("Equivalent exact-form grading failed");
await page.getByRole("button", { name: "Next Challenge", exact: true }).click();
checks.nextChallenge = await state();
if (checks.nextChallenge.challenge !== 2 || checks.nextChallenge.practiceResult !== "idle") throw new Error("Challenge carousel failed");
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (checks.reset.angle !== 60 || checks.reset.challenge !== 1 || checks.reset.view !== "circle") throw new Error("Reset failed");

const metrics = await page.evaluate(() => {
  const element = globalThis.document.querySelector("[data-dedicated-lesson='260']")?.getBoundingClientRect();
  const referenceSection = globalThis.document.querySelector(".target-exact-reference")?.getBoundingClientRect();
  return { viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight }, document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight }, horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth, surfaceTop: element?.top ?? null, surfaceBottom: element?.bottom ?? null, referenceTop: referenceSection?.top ?? null, referenceBottom: referenceSection?.bottom ?? null };
});
await page.screenshot({ path: path.join(out, "0317-desktop.png"), fullPage: false });
const validation = { mockup: "0317", lessonId: 260, route, reference: reference ?? null, objectModel: await surface.getAttribute("data-object-model"), checks, metrics, consoleMessages: messages, passed: !metrics.horizontalOverflow && messages.length === 0 };
await writeFile(path.join(out, "0317-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();
