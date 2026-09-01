/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0581-interactive-intermediate-advanced-3d-geometry-and-solids-regular-polyhedra-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/396-regular-polyhedra";
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
const lesson = page.getByTestId("geometry3d-mockup-0581");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);

const keys = [
  "solid",
  "index",
  "faces",
  "edges",
  "vertices",
  "euler",
  "face",
  "symbol",
  "dual",
  "dual-mode",
  "view",
  "hover",
  "tab",
  "answer",
  "graded",
  "hint",
  "solution",
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

for (const name of ["Cube", "Octahedron", "Dodecahedron", "Icosahedron"]) {
  await lesson.locator(".rp396-cards button").filter({ hasText: name }).click();
  checks[name.toLowerCase()] = await state();
}
await lesson.locator(".rp396-cards button").filter({ hasText: "Cube" }).click();
await lesson.getByLabel("Show dual solid").check();
checks.cubeDual = await state();
await lesson.getByLabel("Show dual solid").uncheck();

for (const name of ["Pan", "Zoom", "Orbit"]) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks[`view${name}`] = await state();
}
const canvas = lesson
  .getByTestId("geometry3d-polyhedra-canvas")
  .locator("canvas");
const box = await canvas.boundingBox();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.52);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.39, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByRole("button", { name: "Reset", exact: true }).click();

await lesson.getByLabel("Cube", { exact: true }).check();
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.wrongAnswer = await state();
await lesson.getByLabel("Octahedron", { exact: true }).check();
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.correctAnswer = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.assistance = await state();
await lesson.getByRole("button", { name: "Data", exact: true }).click();
checks.dataTab = await state();
await lesson.getByRole("button", { name: /Back to Lesson/ }).click();
checks.backToLesson = await state();

await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0581"]')
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
  hero: await rect(".rp396-hero"),
  explorer: await rect(".rp396-explorer"),
  scene: await rect(".rp396-scene"),
  data: await rect(".rp396-data"),
  challenge: await rect(".rp396-challenge"),
  navigation: await rect(".rp396-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0581-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0581-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0581").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1000);
const mobileCanvas = mobile
  .getByTestId("geometry3d-polyhedra-canvas")
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
  path: path.join(evidence, "0581-mobile.png"),
  fullPage: true,
});

const expected = {
  initial: ["Tetrahedron", "4", "6", "4", "{3, 3}"],
  cube: ["Cube", "6", "12", "8", "{4, 3}"],
  octahedron: ["Octahedron", "8", "12", "6", "{3, 4}"],
  dodecahedron: ["Dodecahedron", "12", "30", "20", "{5, 3}"],
  icosahedron: ["Icosahedron", "20", "30", "12", "{3, 5}"],
};
const matches = (name, values) =>
  [
    checks[name].solid,
    checks[name].faces,
    checks[name].edges,
    checks[name].vertices,
    checks[name].symbol,
  ].every((value, index) => value === values[index]);
const passed =
  Object.entries(expected).every(([name, values]) => matches(name, values)) &&
  checks.cubeDual.solid === "Octahedron" &&
  checks.cubeDual["dual-mode"] === "true" &&
  checks.viewPan.view === "Pan" &&
  checks.viewZoom.view === "Zoom" &&
  checks.viewOrbit.view === "Orbit" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.wrongAnswer.answer === "Cube" &&
  checks.wrongAnswer.graded === "true" &&
  checks.correctAnswer.answer === "Octahedron" &&
  checks.correctAnswer.graded === "true" &&
  checks.assistance.hint === "true" &&
  checks.assistance.solution === "true" &&
  checks.dataTab.tab === "Data" &&
  checks.backToLesson.tab === "Explore" &&
  checks.reset.solid === "Tetrahedron" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0581-reference.png"));
await writeFile(
  path.join(evidence, "0581-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0581",
      lessonId: 396,
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
