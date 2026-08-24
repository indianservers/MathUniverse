import { mkdir, copyFile, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";

const lessons = [
  ["0314", 257, "angle-measurement"],
  ["0315", 258, "unit-circle"],
  ["0316", 259, "right-triangle-ratios"],
  ["0317", 260, "exact-trig-values"],
  ["0318", 261, "sine-graph"],
  ["0319", 262, "cosine-graph"],
  ["0320", 263, "tangent-graph"],
  ["0321", 264, "reciprocal-trig-functions"],
  ["0322", 265, "inverse-trig-functions"],
  ["0323", 266, "trig-identities"],
  ["0324", 267, "compound-angle-formulae"],
  ["0325", 268, "double-and-half-angle-formulae"],
  ["0326", 269, "trig-equations"],
  ["0327", 270, "sine-rule"],
  ["0328", 271, "cosine-rule"],
  ["0329", 272, "triangle-area-formula"],
  ["0330", 273, "bearings"],
  ["0331", 274, "elevation-and-depression"],
  ["0332", 275, "harmonic-motion"],
  ["0333", 276, "polar-trigonometry"],
];

await mkdir(out, { recursive: true });
const refNames = await readdir(refs);
const browser = await chromium.launch();
const results = [];

for (const [mockup, lessonId, slug] of lessons) {
  const reference = refNames.find((name) => name.startsWith(`${mockup}-`));
  if (reference) await copyFile(path.join(refs, reference), path.join(out, `${mockup}-reference.png`));

  const route = `/lessons/trigonometry/${lessonId}-${slug}`;
  const page = await browser.newPage({ viewport: { width: 1440, height: 1150 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
  });

  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.screenshot({ path: path.join(out, `${mockup}-desktop.png`), fullPage: true });

  const present = await page.locator(`[data-testid='trigonometry-mockup-${mockup}']`).count();
  const controls = await page.locator("input,button,select").count();
  const slider = page.locator("input[type=range]").first();
  if (await slider.count()) {
    await slider.focus();
    await slider.press("ArrowRight");
    await slider.press("ArrowRight");
  }
  await page.screenshot({ path: path.join(out, `${mockup}-interacted.png`), fullPage: true });

  await page.setViewportSize({ width: 900, height: 1150 });
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
await writeFile(path.join(out, "0314-0333-trigonometry-validation-summary.json"), JSON.stringify({ family: "Trigonometry", lessons: results.length, status, results }, null, 2));
console.log(JSON.stringify({ family: "Trigonometry", lessons: results.length, status }, null, 2));
