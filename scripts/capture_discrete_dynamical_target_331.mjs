/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0410-interactive-advanced-integral-calculus-and-differential-equations-discrete-dynamical-systems-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/calculus/331-discrete-dynamical-systems";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0410");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "rule",
        "x0",
        "n",
        "r",
        "step",
        "current",
        "last",
        "roots",
        "behavior",
        "playing",
        "animate",
        "trail",
        "tab",
        "checked",
        "hint",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Discrete initial value").fill("0.4");
await lesson.getByLabel("Discrete iterations").fill("30");
await lesson.getByLabel("Discrete parameter r").fill("3");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.controls = await state();
await lesson.getByRole("button", { name: "0.5x+0.2", exact: true }).click();
checks.linear = await state();
await lesson.getByRole("switch", { name: "Discrete Trail" }).click();
await lesson.getByRole("switch", { name: "Discrete Animate" }).click();
checks.layers = await state();
const graph = lesson.locator(".dds331-cobweb"),
  box = await graph.boundingBox();
if (!box) throw new Error("Cobweb graph missing");
await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5, {
  steps: 8,
});
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Play discrete animation").click();
await page.waitForTimeout(350);
checks.playing = await state();
await lesson.getByLabel("Play discrete animation").click();
await lesson.getByLabel("Discrete practice 1").fill("0.8");
await lesson
  .getByRole("button", { name: "Check answers", exact: true })
  .click();
checks.rejected = await state();
await lesson.getByLabel("Discrete practice 1").fill("0.7000");
await lesson
  .getByRole("button", { name: "Check answers", exact: true })
  .click();
await lesson.getByRole("button", { name: "Show hint", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0410"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
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
await page.waitForTimeout(150);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const b = document.querySelector(s)?.getBoundingClientRect();
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
    hero: rect(".dds331-hero"),
    tabs: rect(".dds331-tabs"),
    lab: rect(".dds331-lab"),
    theory: rect(".dds331-theory"),
    bottom: rect(".dds331-bottom"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (v, e, t = 1e-5) => Math.abs(Number(v) - e) <= t,
  negative = (1 - Math.sqrt(3)) / 2;
const passed =
  close(checks.initial.x0, 0.2) &&
  checks.initial.rule === "quadratic" &&
  close(checks.initial.r, 2) &&
  close(checks.initial.last, negative, 1e-3) &&
  checks.initial.roots.split(",").length === 2 &&
  close(checks.controls.x0, 0.4) &&
  checks.controls.n === "30" &&
  checks.controls.r === "3" &&
  checks.controls.tab === "Formula" &&
  checks.linear.rule === "linear" &&
  close(checks.linear.last, 0.4, 1e-5) &&
  checks.layers.trail === "false" &&
  checks.layers.animate === "false" &&
  checks.drag.x0 !== checks.layers.x0 &&
  checks.playing.playing === "true" &&
  checks.playing.step !== checks.drag.step &&
  checks.rejected.checked === "false" &&
  checks.accepted.checked === "true" &&
  checks.accepted.hint === "true" &&
  checks.shellReset.x0 === "0.2" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar.width === 205 &&
  metrics.tabs.top === 226 &&
  metrics.lab.top === 278 &&
  metrics.theory.top === 886 &&
  metrics.bottom.top === 1116 &&
  metrics.adjacent.top === 1386 &&
  metrics.footer.top === 1449 &&
  metrics.footer.bottom === 1535 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0410",
  lessonId: 331,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0410-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0410-reference.png"));
await writeFile(
  path.join(evidence, "0410-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
