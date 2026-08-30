/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0409-interactive-advanced-integral-calculus-and-differential-equations-equilibrium-and-stability-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/330-equilibrium-and-stability";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0409");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x0",
        "tmax",
        "dt",
        "limit",
        "basin",
        "trajectory",
        "direction",
        "tab",
        "checked",
        "hint",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Equilibrium initial value").fill("0.5");
await lesson.getByLabel("Equilibrium time window").fill("15");
await lesson.getByLabel("Equilibrium step size").fill("0.05");
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.controls = await state();
await lesson
  .getByRole("switch", { name: "Equilibrium Show trajectory" })
  .click();
await lesson
  .getByRole("switch", { name: "Equilibrium Show direction field" })
  .click();
checks.layers = await state();
const graph = lesson.locator(".eq330-potential"),
  box = await graph.boundingBox();
if (!box) throw new Error("Potential graph missing");
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5, {
  steps: 8,
});
await page.mouse.up();
checks.drag = await state();
await lesson
  .getByRole("button", { name: "New random x₀", exact: true })
  .click();
checks.random = await state();
await lesson
  .getByRole("button", { name: "Check my answer", exact: true })
  .click();
await lesson.getByRole("button", { name: "Need a hint?", exact: true }).click();
checks.practice = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0409"]')
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
    hero: rect(".eq330-hero"),
    tabs: rect(".eq330-tabs"),
    lab: rect(".eq330-lab"),
    classify: rect(".eq330-classify"),
    theory: rect(".eq330-theory"),
    practice: rect(".eq330-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (v, e, t = 1e-4) => Math.abs(Number(v) - e) <= t;
const passed =
  close(checks.initial.x0, -1.4) &&
  checks.initial.basin === "-1" &&
  close(checks.initial.limit, -1, 1e-3) &&
  close(checks.controls.x0, 0.5) &&
  checks.controls.basin === "2" &&
  close(checks.controls.limit, 2, 1e-3) &&
  checks.controls.tmax === "15" &&
  checks.controls.dt === "0.05" &&
  checks.controls.tab === "Formula" &&
  checks.layers.trajectory === "false" &&
  checks.layers.direction === "true" &&
  checks.drag.x0 !== checks.layers.x0 &&
  checks.random.x0 !== checks.drag.x0 &&
  checks.practice.checked === "true" &&
  checks.practice.hint === "true" &&
  checks.shellReset.x0 === "-1.4" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar.width === 211 &&
  metrics.hero.top === 102 &&
  metrics.tabs.top === 192 &&
  metrics.lab.top === 260 &&
  metrics.classify.top === 834 &&
  metrics.theory.top === 977 &&
  metrics.practice.top === 1253 &&
  metrics.adjacent.top === 1373 &&
  metrics.footer.top === 1434 &&
  metrics.footer.bottom === 1523 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0409",
  lessonId: 330,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0409-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0409-reference.png"));
await writeFile(
  path.join(evidence, "0409-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
