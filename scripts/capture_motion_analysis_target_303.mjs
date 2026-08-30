/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0382-interactive-advanced-limits-and-differential-calculus-motion-analysis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/303-motion-analysis";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1016, height: 1548 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0382");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["t", "s", "v", "a", "result", "guidance", "actions"].map((k) => [
        k,
        n.getAttribute(`data-${k}`),
      ]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Motion time").fill("2");
checks.timeDriven = await state();
const point = lesson.locator('[data-drag="motion-v-point"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Motion velocity drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 55, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Show guidance" }).click();
checks.guidance = await state();
await lesson.getByLabel("Motion velocity answer").fill("4");
await lesson.getByLabel("Motion acceleration answer").fill("0");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Motion velocity answer").fill("5");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0382"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0382").waitFor();
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
    hero: rect(".mot303-hero"),
    tabs: rect(".mot303-tabs"),
    main: rect(".mot303-main"),
    work: rect(".motion-work"),
    connection: rect(".connection"),
    info: rect(".mot303-info"),
    adjacent: rect(".mot303-adjacent"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.t === "2.5" &&
  checks.initial.s === "9.125" &&
  checks.initial.v === "-1.75" &&
  checks.initial.a === "-9" &&
  checks.timeDriven.s === "9" &&
  checks.timeDriven.v === "2" &&
  checks.timeDriven.a === "-6" &&
  checks.dragged.t !== checks.timeDriven.t &&
  checks.dragged.s !== checks.timeDriven.s &&
  checks.guidance.guidance === "true" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.localReset.t === "2.5" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1016 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0382",
  lessonId: 303,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0382-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0382-reference.png"));
await writeFile(
  path.join(evidence, "0382-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
