/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0405-interactive-advanced-integral-calculus-and-differential-equations-first-order-linear-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/326-first-order-linear-equations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  acceptDownloads: true,
});
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0405");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "p",
        "y0",
        "scale",
        "a",
        "c",
        "residual",
        "preset",
        "solution-layer",
        "forcing-layer",
        "transient-layer",
        "verified",
        "tab",
        "copied",
        "exported",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
const pSlider = lesson.getByLabel("Linear p(x)");
const pBox = await pSlider.boundingBox();
if (!pBox) throw new Error("Linear p slider missing");
await page.mouse.click(
  pBox.x + pBox.width * ((1.5 + 1) / 6),
  pBox.y + pBox.height / 2,
);
await lesson.getByLabel("Linear Initial condition y(0)").fill("-1");
await lesson.getByLabel("Linear Forcing strength").fill("2");
await lesson.getByLabel("Show forcing term").uncheck();
await lesson.getByRole("button", { name: "Examples", exact: true }).click();
await lesson.getByRole("button", { name: /Verify by substitution/ }).click();
checks.controls = await state();
await lesson.getByLabel("Linear equation example").selectOption("gentle");
checks.preset = await state();
await lesson.getByRole("button", { name: "Copy steps" }).click();
checks.copied = await state();
const downloadPromise = page.waitForEvent("download");
await lesson.getByRole("button", { name: "Export derivation" }).click();
const download = await downloadPromise;
checks.exported = {
  ...(await state()),
  filename: download.suggestedFilename(),
};
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0405"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(150);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const bounds = document.querySelector(selector)?.getBoundingClientRect();
    return (
      bounds &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(bounds[key]),
        ]),
      )
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".lin326-hero"),
    tabs: rect(".lin326-tabs"),
    lab: rect(".lin326-lab"),
    adjacent: rect(".lin326-adjacent"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (value, expected, tolerance = 1e-6) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  close(checks.initial.p, 2) &&
  close(checks.initial.y0, 1) &&
  close(checks.initial.scale, 1) &&
  close(checks.initial.a, 1 / 3) &&
  close(checks.initial.c, 2 / 3) &&
  close(checks.initial.residual, 0) &&
  checks.controls.p !== "2" &&
  close(checks.controls.y0, -1) &&
  close(checks.controls.scale, 2) &&
  checks.controls["forcing-layer"] === "false" &&
  checks.controls.tab === "Examples" &&
  checks.controls.verified === "true" &&
  close(checks.controls.residual, 0) &&
  checks.preset.preset === "gentle" &&
  close(checks.preset.p, 1) &&
  close(checks.preset.y0, 2) &&
  close(checks.preset.scale, 0.75) &&
  checks.copied.copied === "true" &&
  checks.exported.exported === "true" &&
  checks.exported.filename === "first-order-linear-equation-derivation.txt" &&
  checks.shellReset.preset === "reference" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1536 &&
  metrics.document.height === 1024 &&
  !metrics.overflow &&
  metrics.sidebar.width === 240 &&
  metrics.hero.top === 104 &&
  metrics.tabs.top === 217 &&
  metrics.lab.top === 261 &&
  metrics.adjacent.top === 873 &&
  metrics.footer.bottom === 1024 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0405",
  lessonId: 326,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0405-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0405-reference.png"));
await writeFile(
  path.join(evidence, "0405-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
