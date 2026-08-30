/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0381-interactive-advanced-limits-and-differential-calculus-related-rates-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/302-related-rates";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0381");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "t",
        "h",
        "distance",
        "rate",
        "finite-rate",
        "playing",
        "checked",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByRole("button", { name: "Try another value" }).click();
checks.cleared = await state();
await lesson.getByLabel("Related rates time").fill("-1");
checks.timeDriven = await state();
await lesson.getByLabel("Related rates h").fill("0.2");
checks.hDriven = await state();
const point = lesson.locator('[data-drag="related-rate-point"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Related-rates drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 50, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Play animation").click();
await page.waitForTimeout(220);
checks.playing = await state();
await lesson.getByLabel("Pause animation").click();
checks.paused = await state();
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.checked = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0381"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0381").waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const e = document.querySelector(s),
      b = e?.getBoundingClientRect();
    return (
      b &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((k) => [
          k,
          Math.round(b[k]),
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
    hero: rect(".rel302-hero"),
    tabs: rect(".rel302-tabs"),
    flow: rect(".rel302-flow"),
    lab: rect(".rel302-lab"),
    info: rect(".rel302-info"),
    result: rect(".rel302-result"),
    adjacent: rect(".rel302-adjacent"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.t === "2" &&
  checks.initial.h === "0.05" &&
  checks.initial.distance === "3" &&
  Math.abs(Number(checks.initial.rate) - 4 / 3) < 0.001 &&
  checks.initial.rate === checks.initial["finite-rate"] &&
  checks.initial.checked === "true" &&
  checks.cleared.checked === "false" &&
  checks.timeDriven.distance === "3" &&
  Math.abs(Number(checks.timeDriven.rate) + 4 / 3) < 0.001 &&
  checks.hDriven.rate === checks.hDriven["finite-rate"] &&
  checks.dragged.t !== checks.hDriven.t &&
  checks.playing.playing === "true" &&
  checks.playing.t !== checks.dragged.t &&
  checks.paused.playing === "false" &&
  checks.checked.checked === "true" &&
  checks.localReset.t === "2" &&
  checks.localReset.checked === "true" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0381",
  lessonId: 302,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0381-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0381-reference.png"));
await writeFile(
  path.join(evidence, "0381-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
