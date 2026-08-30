/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0411-interactive-advanced-integral-calculus-and-differential-equations-cobweb-diagrams-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/calculus/332-cobweb-diagrams";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0411");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "function",
        "x0",
        "r",
        "iterations",
        "step",
        "last",
        "fixed",
        "nearest",
        "stable",
        "status",
        "playing",
        "path",
        "points",
        "labels",
        "animate",
        "speed",
        "tab",
        "challenge",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Cobweb function").selectOption("logistic");
await lesson.getByLabel("Cobweb logistic parameter").fill("3.5");
await lesson.getByLabel("Cobweb initial value").fill("0.2");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.controls = await state();
await lesson.getByLabel("Show cobweb path").uncheck();
await lesson.getByLabel("Show fixed points").uncheck();
await lesson.getByLabel("Show axes labels").uncheck();
await lesson.getByLabel("Animate iterates").check();
await lesson.getByLabel("Cobweb animation speed").fill("80");
checks.layers = await state();
const graph = lesson.locator(".cob332-graph"),
  box = await graph.boundingBox();
if (!box) throw new Error("Cobweb graph missing");
const handle = lesson.locator('[data-drag="cobweb-seed"]'),
  hbox = await handle.boundingBox();
if (!hbox) throw new Error("Cobweb seed missing");
await page.mouse.move(hbox.x + hbox.width / 2, hbox.y + hbox.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5, {
  steps: 8,
});
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Cobweb iteration depth").fill("0");
await lesson.getByLabel("Play cobweb animation").click();
await page.waitForTimeout(260);
checks.playing = await state();
await lesson.getByLabel("Play cobweb animation").click();
await lesson
  .getByRole("button", { name: "Start challenge", exact: true })
  .click();
checks.challenge = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0411"]')
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
    hero: rect(".cob332-hero"),
    tabs: rect(".cob332-tabs"),
    explorer: rect(".cob332-explorer"),
    challenge: rect(".cob332-challenge"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (v, e, t = 1e-5) => Math.abs(Number(v) - e) <= t;
const passed =
  checks.initial.function === "cos" &&
  close(checks.initial.x0, 0.5) &&
  checks.initial.fixed.split(",").length === 1 &&
  close(checks.initial.fixed, 0.73908513, 1e-5) &&
  checks.initial.stable === "true" &&
  checks.initial.status === "Convergent (Stable)" &&
  checks.controls.function === "logistic" &&
  close(checks.controls.r, 3.5) &&
  checks.controls.tab === "Formula" &&
  checks.layers.path === "false" &&
  checks.layers.points === "false" &&
  checks.layers.labels === "false" &&
  checks.layers.animate === "true" &&
  checks.layers.speed === "80" &&
  checks.drag.x0 !== checks.layers.x0 &&
  checks.playing.playing === "true" &&
  Number(checks.playing.step) > 0 &&
  checks.challenge.function === "affine" &&
  checks.challenge.x0 === "0.2" &&
  checks.challenge.challenge === "true" &&
  checks.challenge.status === "Divergent" &&
  checks.shellReset.function === "cos" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar.width === 203 &&
  metrics.hero.top === 103 &&
  metrics.tabs.top === 307 &&
  metrics.explorer.top === 366 &&
  metrics.challenge.top === 1260 &&
  metrics.adjacent.top === 1378 &&
  metrics.footer.top === 1447 &&
  metrics.footer.bottom === 1536 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0411",
  lessonId: 332,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0411-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0411-reference.png"));
await writeFile(
  path.join(evidence, "0411-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
