import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const titles = [
  "Area by Rectangles",
  "Riemann Sums",
  "Definite Integral",
  "Indefinite Integral",
  "Fundamental Theorem",
  "Area Between Curves",
  "Substitution",
  "Integration by Parts",
  "Partial Fractions",
  "Improper Integrals",
  "Numerical Integration",
  "Volume by Slicing",
  "Disc and Washer Methods",
  "Shell Method",
  "Arc Length",
  "Surface Area of Revolution",
  "Accumulation Functions",
  "Direction Fields",
  "Euler's Method",
  "Separable Equations",
  "First-Order Linear Equations",
  "Logistic Growth",
  "Second-Order Equations",
  "Phase Plane",
  "Equilibrium and Stability",
  "Discrete Dynamical Systems",
  "Cobweb Diagrams",
  "Chaos and Bifurcation",
];
const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

await mkdir(out, { recursive: true });
const refNames = await readdir(refs);
const browser = await chromium.launch();
const results = [];
let cursor = 0;

async function worker() {
  while (cursor < titles.length) {
    const index = cursor++;
    const lessonId = 306 + index;
    const mockup = String(385 + index).padStart(4, "0");
    const route = `/lessons/calculus/${lessonId}-${slug(titles[index])}`;
    const reference = refNames.find((name) => name.startsWith(`${mockup}-`));
    if (reference) {
      await copyFile(
        path.join(refs, reference),
        path.join(out, `${mockup}-reference.png`),
      );
    }
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
      deviceScaleFactor: 1,
    });
    const consoleMessages = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      }
    });
    await page.goto(`${baseUrl}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    const marker = page.locator(
      `[data-testid='integral-differential-mockup-${mockup}']`,
    );
    await marker.waitFor({ state: "attached", timeout: 180_000 });
    await page.screenshot({
      path: path.join(out, `${mockup}-desktop.png`),
      fullPage: true,
    });
    const present = await marker.count();
    const controls = await marker.locator("input, button").count();
    const range = marker.locator("input[type=range]").first();
    if (await range.count()) {
      await range.evaluate((element) => {
        element.value = element.max;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
    await page.screenshot({
      path: path.join(out, `${mockup}-interacted.png`),
      fullPage: true,
    });
    await page.setViewportSize({ width: 900, height: 1100 });
    await page.screenshot({
      path: path.join(out, `${mockup}-tablet.png`),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.screenshot({
      path: path.join(out, `${mockup}-mobile.png`),
      fullPage: true,
    });
    const audit = {
      mockup,
      lessonId,
      route,
      reference: reference ?? null,
      present: present > 0,
      interactiveControls: controls,
      consoleMessages,
    };
    await writeFile(
      path.join(out, `${mockup}-control-audit.json`),
      JSON.stringify(audit, null, 2),
    );
    results.push({
      mockup,
      lessonId,
      route,
      status:
        present > 0 && controls >= 8 && consoleMessages.length === 0
          ? "Passed"
          : "Review",
      screenshots: [
        `${mockup}-reference.png`,
        `${mockup}-desktop.png`,
        `${mockup}-tablet.png`,
        `${mockup}-mobile.png`,
        `${mockup}-interacted.png`,
      ],
      controlAudit: `${mockup}-control-audit.json`,
      consoleMessages: consoleMessages.length,
    });
    await page.close();
  }
}

await Promise.all([worker(), worker(), worker()]);
await browser.close();
results.sort((a, b) => Number(a.mockup) - Number(b.mockup));
const status =
  results.length === 28 && results.every((result) => result.status === "Passed")
    ? "Passed"
    : "Review";
await writeFile(
  path.join(out, "0385-0412-integral-differential-validation-summary.json"),
  JSON.stringify(
    {
      family: "Integral Calculus and Differential Equations",
      lessons: results.length,
      status,
      results,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    {
      family: "Integral Calculus and Differential Equations",
      lessons: results.length,
      status,
    },
    null,
    2,
  ),
);
