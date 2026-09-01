/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0582-interactive-intermediate-advanced-3d-geometry-and-solids-cylinder-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/397-cylinder";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0582");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1600);

const keys = [
  "radius",
  "height",
  "fill",
  "volume",
  "curved",
  "surface",
  "mode",
  "view",
  "animating",
  "section",
  "section-area",
  "tab",
  "answer",
  "challenge",
  "graded",
  "correct",
  "shared",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attrs) =>
      Object.fromEntries(
        attrs.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByLabel("Radius value").fill("4");
await lesson.getByLabel("Height value").fill("6");
await lesson.getByLabel("Fill value").fill("55");
checks.edited = await state();
for (const name of ["Unfold net", "Cross-section", "Fill"]) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks[`mode${name.replace(/\W/g, "")}`] = await state();
}
for (const name of ["Top", "Front", "Right", "Rotate"]) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks[`view${name}`] = await state();
}

const canvas = lesson
  .getByTestId("geometry3d-cylinder-canvas")
  .locator("canvas");
const box = await canvas.boundingBox();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.43, box.y + box.height * 0.48);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.36, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);

await lesson.getByLabel("Animate fill", { exact: true }).click();
const animatedStart = Number((await state()).fill);
await page.waitForTimeout(420);
await lesson.getByLabel("Animate fill", { exact: true }).click();
checks.animation = {
  before: animatedStart,
  after: Number((await state()).fill),
  state: await state(),
};
await lesson.getByLabel("Restart fill animation").click();
checks.restarted = await state();

await lesson.getByLabel("Cross-section type").selectOption("Axial slice");
checks.axial = await state();
await lesson.getByLabel("Cross-section type").selectOption("Half axial slice");
checks.halfAxial = await state();

await lesson.getByLabel("B", { exact: true }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("A", { exact: true }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "New challenge" }).click();
checks.newChallenge = await state();
await lesson.getByRole("button", { name: /Share|Shared/ }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();

await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0582"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));

const rect = async (selector) => {
  const bounds = await page.locator(selector).first().boundingBox();
  return bounds
    ? {
        top: Math.round(bounds.y),
        left: Math.round(bounds.x),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
        bottom: Math.round(bounds.y + bounds.height),
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
  hero: await rect(".cyl397-hero"),
  tabs: await rect(".cyl397-tabs"),
  lab: await rect(".cyl397-lab"),
  canvas: await rect(".cyl397-scene"),
  diagrams: await rect(".cyl397-diagrams"),
  bottom: await rect(".cyl397-bottom"),
  navigation: await rect(".cyl397-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0582-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0582-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0582").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1000);
const mobileCanvas = mobile
  .getByTestId("geometry3d-cylinder-canvas")
  .locator("canvas");
const mobileImage = await mobileCanvas.screenshot();
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  canvas: await mobileCanvas.boundingBox(),
  nonblank: mobileImage.length > 1000,
};
await mobile.screenshot({
  path: path.join(evidence, "0582-mobile.png"),
  fullPage: true,
});

const near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.01;
const passed =
  checks.initial.radius === "3" &&
  checks.initial.height === "5" &&
  checks.initial.fill === "72" &&
  near(checks.initial.volume, 141.372) &&
  near(checks.initial.curved, 94.248) &&
  near(checks.initial.surface, 150.796) &&
  near(checks.initial["section-area"], 28.274) &&
  checks.edited.radius === "4" &&
  checks.edited.height === "6" &&
  checks.edited.fill === "55" &&
  near(checks.edited.volume, 301.593) &&
  near(checks.edited.curved, 150.796) &&
  near(checks.edited.surface, 251.327) &&
  checks.modeUnfoldnet.mode === "Unfold net" &&
  checks.modeCrosssection.mode === "Cross-section" &&
  checks.modeFill.mode === "Fill" &&
  checks.viewTop.view === "Top" &&
  checks.viewFront.view === "Front" &&
  checks.viewRight.view === "Right" &&
  checks.viewRotate.view === "Rotate" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.animation.after !== checks.animation.before &&
  checks.animation.state.animating === "false" &&
  checks.restarted.fill === "0" &&
  checks.axial.section === "Axial slice" &&
  near(checks.axial["section-area"], 48) &&
  checks.halfAxial.section === "Half axial slice" &&
  near(checks.halfAxial["section-area"], 24) &&
  checks.wrong.answer === "B" &&
  checks.wrong.graded === "true" &&
  checks.wrong.correct === "false" &&
  checks.correct.answer === "A" &&
  checks.correct.correct === "true" &&
  checks.newChallenge.challenge === "1" &&
  checks.newChallenge.answer === "C" &&
  checks.shared.shared === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.radius === "3" &&
  checks.reset.height === "5" &&
  checks.reset.fill === "72" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0582-reference.png"));
await writeFile(
  path.join(evidence, "0582-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0582",
      lessonId: 397,
      checks,
      metrics,
      mobileMetrics,
      consoleMessages,
      passed,
    },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;

async function pixelStats(targetPage, imageBuffer) {
  return targetPage.evaluate(
    async (dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const sample = document.createElement("canvas");
      const context = sample.getContext("2d");
      sample.width = 160;
      sample.height = 160;
      context.drawImage(image, 0, 0, 160, 160);
      const pixels = context.getImageData(0, 0, 160, 160).data;
      const colors = new Set();
      let colored = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const spread =
          Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) -
          Math.min(pixels[index], pixels[index + 1], pixels[index + 2]);
        if (spread > 12) colored++;
        colors.add(
          `${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`,
        );
      }
      return {
        colored,
        unique: colors.size,
        width: image.width,
        height: image.height,
      };
    },
    `data:image/png;base64,${imageBuffer.toString("base64")}`,
  );
}
