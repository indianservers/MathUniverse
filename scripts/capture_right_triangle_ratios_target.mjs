import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/259-right-triangle-ratios";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0316-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0316-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 997, height: 1578 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`); });
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='259']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  originX: Number(element.dataset.originX), originY: Number(element.dataset.originY),
  adjacent: Number(element.dataset.adjacent), opposite: Number(element.dataset.opposite), hypotenuse: Number(element.dataset.hypotenuse),
  angle: Number(element.dataset.angle), sin: Number(element.dataset.sin), cos: Number(element.dataset.cos), tan: Number(element.dataset.tan),
  rightAngle: element.dataset.rightAngle === "true", solutionShown: element.dataset.solutionShown === "true",
}));
const checks = { initial: await state() };
if (!checks.initial.rightAngle || Math.abs(checks.initial.angle - 45) > 1e-5 || Math.abs(checks.initial.hypotenuse - Math.sqrt(18)) > 1e-5) throw new Error("Initial right triangle is inconsistent");

async function drag(testId, dx, dy) {
  const locator = page.getByTestId(testId), box = await locator.boundingBox();
  if (!box) throw new Error(`${testId} has no bounding box`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 9 });
  await page.mouse.up();
}
await drag("right-triangle-point-c", -35, -42);
checks.dragC = await state();
if (Math.abs(checks.dragC.adjacent - checks.initial.adjacent) < .1 || Math.abs(checks.dragC.opposite - checks.initial.opposite) < .1 || !checks.dragC.rightAngle) throw new Error("C drag did not update both dependent legs");
if (Math.abs(checks.dragC.sin ** 2 + checks.dragC.cos ** 2 - 1) > 1e-5) throw new Error("C drag broke trig identity");

const beforeB = await state();
await drag("right-triangle-point-b", 45, 0);
checks.dragB = await state();
if (Math.abs(checks.dragB.adjacent - beforeB.adjacent) < .1 || Math.abs(checks.dragB.opposite - beforeB.opposite) > .001) throw new Error("B drag did not isolate adjacent leg");

const beforeO = await state();
await drag("right-triangle-point-o", 32, -18);
checks.dragO = await state();
if (Math.abs(checks.dragO.originX - beforeO.originX) < .1 || Math.abs(checks.dragO.originY - beforeO.originY) < .1) throw new Error("O drag did not translate the construction");
if (Math.abs(checks.dragO.adjacent - beforeO.adjacent) > .001 || Math.abs(checks.dragO.opposite - beforeO.opposite) > .001) throw new Error("O drag changed side lengths");

await page.getByLabel("Angle theta").fill("60");
checks.slider60 = await state();
if (Math.abs(checks.slider60.angle - 60) > .05 || Math.abs(checks.slider60.tan - Math.sqrt(3)) > .001) throw new Error(`60-degree slider calculation failed: ${JSON.stringify(checks.slider60)}`);
await page.getByRole("checkbox").uncheck();
await page.getByLabel("Angle theta").fill("37");
checks.unsnapped37 = await state();
if (Math.abs(checks.unsnapped37.angle - 37) > .05) throw new Error("Snap-off slider did not preserve 37 degrees");

const practice = {
  opposite: page.getByLabel("Opposite"), hypotenuse: page.getByLabel("Hypotenuse"), sin: page.getByLabel("sin 60°"), cos: page.getByLabel("cos 60°"), tan: page.getByLabel("tan 60°"),
};
for (const locator of Object.values(practice)) await locator.fill("1");
await page.getByRole("button", { name: /Check Answer/ }).click();
checks.incorrect = await page.locator("p[role='status']").innerText();
if (!checks.incorrect.includes("Check each value")) throw new Error("Incorrect practice path failed");
await practice.opposite.fill("10.3923"); await practice.hypotenuse.fill("12"); await practice.sin.fill("0.866"); await practice.cos.fill("0.5"); await practice.tan.fill("1.7321");
await page.getByRole("button", { name: /Check Answer/ }).click();
checks.correct = await page.locator("p[role='status']").innerText();
if (!checks.correct.includes("Correct")) throw new Error("Correct practice path failed");

await page.getByRole("button", { name: "Show Solution", exact: true }).click();
checks.solution = await state();
if (!checks.solution.solutionShown || await practice.opposite.inputValue() !== "10.3923") throw new Error("Show Solution failed");
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (Math.abs(checks.reset.angle - 45) > 1e-5 || checks.reset.originX !== 0 || checks.reset.originY !== 0) throw new Error("Reset failed");

const metrics = await page.evaluate(() => {
  const element = globalThis.document.querySelector("[data-dedicated-lesson='259']"), rect = element?.getBoundingClientRect();
  const footer = globalThis.document.querySelector("footer[aria-label='Site footer']")?.getBoundingClientRect();
  return { viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight }, document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight }, horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth, surfaceTop: rect?.top ?? null, surfaceBottom: rect?.bottom ?? null, footerTop: footer?.top ?? null, footerBottom: footer?.bottom ?? null };
});
await page.screenshot({ path: path.join(out, "0316-desktop.png"), fullPage: false });
const validation = { mockup: "0316", lessonId: 259, route, reference: reference ?? null, objectModel: await surface.getAttribute("data-object-model"), checks, metrics, consoleMessages: messages, passed: !metrics.horizontalOverflow && messages.length === 0 };
await writeFile(path.join(out, "0316-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();
