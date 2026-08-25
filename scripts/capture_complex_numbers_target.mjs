import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0045-interactive-foundational-intermediate-numbers-and-number-theory-complex-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/63-complex-numbers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1060, height: 1484 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0045");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-real",
        "data-imaginary",
        "data-complex",
        "data-conjugate",
        "data-modulus",
        "data-argument",
        "data-dragging",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-answer-visible",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };

await page.getByLabel("Real part").evaluate((input) => {
  const range = input;
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  setter.call(range, "-2");
  range.dispatchEvent(new Event("input", { bubbles: true }));
  range.dispatchEvent(new Event("change", { bubbles: true }));
});
checks.realSlider = await state();
await page.getByLabel("Imaginary part").evaluate((input) => {
  const range = input;
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  ).set;
  setter.call(range, "4");
  range.dispatchEvent(new Event("input", { bubbles: true }));
  range.dispatchEvent(new Event("change", { bubbles: true }));
});
checks.imaginarySlider = await state();

await node.getByRole("button", { name: "Reset", exact: true }).click();
const plane = page.locator(".complex63-plane");
const box = await plane.boundingBox();
if (!box) throw new Error("Complex plane did not render");
const from = {
  x: box.x + (434 / 530) * box.width,
  y: box.y + (180 / 600) * box.height,
};
const to = {
  x: box.x + (511 / 530) * box.width,
  y: box.y + (378 / 600) * box.height,
};
await page.mouse.move(from.x, from.y);
await page.mouse.down();
await page.mouse.move(to.x, to.y, { steps: 8 });
await page.mouse.up();
checks.pointDrag = await state();

await node.getByRole("button", { name: /Reveal answer/ }).click();
checks.answer = await state();
await node.getByRole("button", { name: /Properties/ }).click();
checks.tab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
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
    surface: region(".complex63-page"),
    regions: {
      hero: region(".complex63-hero"),
      tabs: region(".complex63-tabs"),
      layout: region(".complex63-layout"),
      work: region(".complex63-work"),
      plane: region(".complex63-plane"),
      legend: region(".complex63-legend"),
      side: region(".complex63-side"),
      navigation: region(".complex63-navigation"),
      footer: region(".complex63-footer"),
    },
  };
});
const passed =
  checks.initial.real === "3" &&
  checks.initial.imaginary === "2" &&
  checks.initial.complex === "3 + 2i" &&
  checks.initial.conjugate === "3 - 2i" &&
  checks.initial.modulus === "3.606" &&
  checks.initial.argument === "33.69" &&
  checks.realSlider.real === "-2" &&
  checks.realSlider.complex === "-2 + 2i" &&
  checks.imaginarySlider.imaginary === "4" &&
  checks.imaginarySlider.conjugate === "-2 - 4i" &&
  checks.imaginarySlider.modulus === "4.472" &&
  checks.pointDrag.real === "4" &&
  checks.pointDrag.imaginary === "-1" &&
  checks.pointDrag.complex === "4 - 1i" &&
  checks.pointDrag.conjugate === "4 + 1i" &&
  checks.answer["answer-visible"] === "true" &&
  checks.tab.tab === "Properties" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.reset.real === "3" &&
  checks.reset.imaginary === "2" &&
  checks.reset["answer-visible"] === "false" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0045-desktop.png") });
await copyFile(reference, path.join(out, "0045-reference.png"));
const report = {
  mockup: "0045",
  lessonId: 63,
  route: "/lessons/numbers-and-arithmetic/63-complex-numbers",
  objectModel:
    "complex-coefficients-draggable-plane-point-conjugate-vector-modulus-argument-projection-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0045-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
