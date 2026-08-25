import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/257-angle-measurement";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0314-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0314-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1005, height: 1565 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='257']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  angle: Number(element.dataset.angleDegrees),
  normalized: Number(element.dataset.normalizedDegrees),
  radians: Number(element.dataset.angleRadians),
  cos: Number(element.dataset.cos),
  sin: Number(element.dataset.sin),
  tan: element.dataset.tan === "undefined" ? null : Number(element.dataset.tan),
  quadrant: element.dataset.quadrant,
}));
const checks = {};
checks.initial = await state();

const ray = page.getByTestId("angle-ray-handle");
const rayBox = await ray.boundingBox();
if (!rayBox) throw new Error("Ray handle has no bounding box");
await page.mouse.move(rayBox.x + rayBox.width / 2, rayBox.y + rayBox.height / 2);
await page.mouse.down();
await page.mouse.move(rayBox.x - 66, rayBox.y - 52, { steps: 8 });
await page.mouse.up();
checks.rayDrag = await state();
if (Math.abs(checks.rayDrag.angle - checks.initial.angle) < 5) throw new Error("Ray drag did not change angle");

const degreeSlider = page.getByLabel("Angle in degrees", { exact: true });
await degreeSlider.fill("135");
checks.degree135 = await state();
if (checks.degree135.quadrant !== "II" || Math.abs(checks.degree135.cos + Math.SQRT1_2) > 1e-4 || Math.abs(checks.degree135.sin - Math.SQRT1_2) > 1e-4) throw new Error("135-degree model is inconsistent");

await page.getByRole("button", { name: "Radians", exact: true }).click();
const radianSlider = page.getByLabel("Angle in radians", { exact: true });
await radianSlider.fill("1571");
checks.radianHalfPi = await state();
if (Math.abs(checks.radianHalfPi.angle - 90) > .2 || checks.radianHalfPi.tan !== null) throw new Error("Radian mode did not reach pi/2");

const protractor = page.getByLabel("Interactive semicircular protractor");
const protractorBox = await protractor.boundingBox();
if (!protractorBox) throw new Error("Protractor has no bounding box");
await page.mouse.move(protractorBox.x + protractorBox.width * .5, protractorBox.y + protractorBox.height * .88);
await page.mouse.down();
await page.mouse.move(protractorBox.x + protractorBox.width * .25, protractorBox.y + protractorBox.height * .42, { steps: 8 });
await page.mouse.up();
checks.protractorDrag = await state();
if (Math.abs(checks.protractorDrag.angle - checks.radianHalfPi.angle) < 5) throw new Error("Protractor drag did not change angle");

await page.getByRole("button", { name: /^45°/ }).click();
checks.snap45 = await state();
if (checks.snap45.angle !== 45 || Math.abs(checks.snap45.radians - Math.PI / 4) > 1e-5) throw new Error("45-degree snap is inconsistent");

await surface.focus();
await surface.press("ArrowRight");
checks.keyboard = await state();
if (checks.keyboard.angle !== 46) throw new Error("Keyboard fine adjustment failed");
await surface.press("s");
checks.keyboardSnap = await state();
if (checks.keyboardSnap.angle !== 45) throw new Error("Keyboard snap failed");

const practiceChoices = page.locator(".target-angle-measurement-practice article > div button");
await practiceChoices.nth(0).click();
checks.incorrectFeedback = await page.getByRole("status").innerText();
if (!checks.incorrectFeedback.includes("Try again")) throw new Error("Incorrect practice path failed");
await practiceChoices.nth(2).click();
checks.correctFeedback = await page.getByRole("status").innerText();
if (!checks.correctFeedback.includes("Correct")) throw new Error("Correct practice path failed");

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (checks.reset.angle !== 60) throw new Error("Reset failed");

const metrics = await page.evaluate(() => {
  const surfaceElement = globalThis.document.querySelector("[data-dedicated-lesson='257']");
  const rect = surfaceElement?.getBoundingClientRect();
  const bottomElements = [...globalThis.document.querySelectorAll("body *")]
    .map((element) => ({
      tag: element.tagName,
      className: typeof element.className === "string" ? element.className : "",
      bottom: element.getBoundingClientRect().bottom,
    }))
    .filter((item) => item.bottom > globalThis.innerHeight)
    .sort((a, b) => b.bottom - a.bottom)
    .slice(0, 5);
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    contentFitsViewport: (rect?.bottom ?? Infinity) <= globalThis.innerHeight,
    surfaceTop: rect?.top ?? null,
    surfaceBottom: rect?.bottom ?? null,
    bottomElements,
  };
});
await page.screenshot({ path: path.join(out, "0314-desktop.png"), fullPage: false });
const validation = {
  mockup: "0314",
  lessonId: 257,
  route,
  reference: reference ?? null,
  objectModel: await surface.getAttribute("data-object-model"),
  checks,
  metrics,
  consoleMessages: messages,
  passed: !metrics.horizontalOverflow && metrics.contentFitsViewport && messages.length === 0,
};
await writeFile(path.join(out, "0314-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();
