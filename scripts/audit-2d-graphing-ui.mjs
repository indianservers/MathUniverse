import { mkdir, copyFile, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";

const lessons = [
  ["0131", 39, "cartesian-graphing"],
  ["0132", 40, "function-plotter"],
  ["0133", 41, "equation-grapher"],
  ["0134", 42, "inequality-grapher"],
  ["0135", 43, "parametric-curves"],
  ["0136", 44, "polar-graphs"],
  ["0137", 45, "point-plotter"],
  ["0138", 46, "data-plotter"],
  ["0139", 47, "table-of-values"],
  ["0140", 48, "trace-mode"],
  ["0141", 49, "zoom-and-pan"],
  ["0142", 50, "axis-controls"],
  ["0143", 51, "grid-controls"],
  ["0144", 52, "multiple-graphics-views"],
  ["0145", 53, "special-points"],
  ["0146", 54, "graph-inspector"],
  ["0147", 55, "dynamic-parameters"],
  ["0148", 56, "export-graph"],
];

await mkdir(out, { recursive: true });
const refNames = await readdir(refs);
const browser = await chromium.launch();
const results = [];

for (const [mockup, lessonId, slug] of lessons) {
  const reference = refNames.find((name) => name.startsWith(`${mockup}-`));
  if (reference) await copyFile(path.join(refs, reference), path.join(out, `${mockup}-reference.png`));

  const route = `/lessons/graphs-and-functions/${lessonId}-${slug}`;
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
  });

  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.screenshot({ path: path.join(out, `${mockup}-desktop.png`), fullPage: true });

  const present = await page.locator("[data-testid^='2d-graphing-mockup-']").count();
  const controls = await page.locator("input[type=range],button").count();
  await page.locator("input[type=range]").first().evaluate((element) => {
    element.value = "4";
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.screenshot({ path: path.join(out, `${mockup}-interacted.png`), fullPage: true });

  await page.setViewportSize({ width: 900, height: 1100 });
  await page.screenshot({ path: path.join(out, `${mockup}-tablet.png`), fullPage: true });

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.screenshot({ path: path.join(out, `${mockup}-mobile.png`), fullPage: true });

  const audit = {
    mockup,
    lessonId,
    route,
    reference: reference ?? null,
    present: present > 0,
    interactiveControls: controls,
    consoleMessages,
  };
  await writeFile(path.join(out, `${mockup}-control-audit.json`), JSON.stringify(audit, null, 2));
  results.push({
    mockup,
    lessonId,
    route,
    status: present > 0 && consoleMessages.length === 0 ? "Passed" : "Review",
    screenshots: [`${mockup}-reference.png`, `${mockup}-desktop.png`, `${mockup}-tablet.png`, `${mockup}-mobile.png`, `${mockup}-interacted.png`],
    controlAudit: `${mockup}-control-audit.json`,
    consoleMessages: consoleMessages.length,
  });
  await page.close();
}

await browser.close();
const status = results.every((result) => result.status === "Passed") ? "Passed" : "Review";
await writeFile(path.join(out, "0131-0148-2d-graphing-validation-summary.json"), JSON.stringify({ family: "2D Graphing Calculator", lessons: results.length, status, results }, null, 2));
console.log(JSON.stringify({ family: "2D Graphing Calculator", lessons: results.length, status }, null, 2));
