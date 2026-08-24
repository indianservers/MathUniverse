import { mkdir, copyFile, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";

const lessons = [
  ["0255", 198, "free-point"],
  ["0256", 199, "point-on-object"],
  ["0257", 200, "intersection-point"],
  ["0258", 201, "midpoint-or-centre"],
  ["0259", 202, "attach-detach-point"],
  ["0260", 203, "line-through-two-points"],
  ["0261", 204, "segment"],
  ["0262", 205, "segment-with-given-length"],
  ["0263", 206, "ray"],
  ["0264", 207, "polyline"],
  ["0265", 208, "perpendicular-line"],
  ["0266", 209, "parallel-line"],
  ["0267", 210, "perpendicular-bisector"],
  ["0268", 211, "angle-bisector"],
  ["0269", 212, "tangent"],
  ["0270", 213, "best-fit-line"],
  ["0271", 214, "triangle-constructor"],
  ["0272", 215, "regular-polygon"],
  ["0273", 216, "rigid-polygon"],
  ["0274", 217, "general-polygon"],
  ["0275", 218, "circle-centre-and-point"],
  ["0276", 219, "circle-centre-and-radius"],
  ["0277", 220, "circle-through-three-points"],
  ["0278", 221, "compass"],
  ["0279", 222, "semicircle"],
  ["0280", 223, "circular-arc"],
  ["0281", 224, "circumcircular-arc"],
  ["0282", 225, "circular-sector"],
  ["0283", 226, "conic-through-five-points"],
  ["0284", 227, "ellipse"],
  ["0285", 228, "hyperbola"],
  ["0286", 229, "parabola"],
  ["0287", 230, "distance-length"],
  ["0288", 231, "area"],
  ["0289", 232, "angle"],
  ["0290", 233, "fixed-angle"],
  ["0291", 234, "relation-checker"],
  ["0292", 235, "construction-steps"],
];

await mkdir(out, { recursive: true });
const refNames = await readdir(refs);
const browser = await chromium.launch();
const results = [];

for (const [mockup, lessonId, slug] of lessons) {
  const reference = refNames.find((name) => name.startsWith(`${mockup}-`));
  if (reference) await copyFile(path.join(refs, reference), path.join(out, `${mockup}-reference.png`));

  const route = `/lessons/geometry/${lessonId}-${slug}`;
  const page = await browser.newPage({ viewport: { width: 1440, height: 1150 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
  });

  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.screenshot({ path: path.join(out, `${mockup}-desktop.png`), fullPage: true });

  const present = await page.locator("[data-testid^='dynamic-geometry-mockup-']").count();
  const controls = await page.locator("input,button,select").count();
  const firstNumber = page.locator("input[type=number]").first();
  if (await firstNumber.count()) {
    await firstNumber.fill("4");
    await firstNumber.press("Tab");
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
await writeFile(path.join(out, "0255-0292-dynamic-geometry-validation-summary.json"), JSON.stringify({ family: "Dynamic Geometry Constructions", lessons: results.length, status, results }, null, 2));
console.log(JSON.stringify({ family: "Dynamic Geometry Constructions", lessons: results.length, status }, null, 2));
