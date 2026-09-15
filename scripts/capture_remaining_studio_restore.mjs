import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const baseUrl = process.env.STUDIO_BASE_URL ?? "http://127.0.0.1:5173";
const out = process.env.STUDIO_CAPTURE_DIR ?? "/opt/cursor/artifacts/remaining-studio-restore";
await mkdir(out, { recursive: true });

const routes = [
  "/algebra",
  "/algebra/expressions",
  "/algebra/equations",
  "/algebra/functions",
  "/algebra/polynomials",
  "/algebra/systems",
  "/algebra/exponents-logs",
  "/algebra/sequences",
  "/algebra/proof",
  "/algebra/cas",
  "/calculus",
  "/calculus/limits",
  "/calculus/derivatives",
  "/calculus/derivative-applications",
  "/calculus/integration",
  "/calculus/integration-techniques",
  "/calculus/integral-applications",
  "/calculus/differential-equations",
  "/calculus/series-parametric-polar",
  "/calculus/multivariable-vector",
  "/linear-algebra",
  "/linear-algebra/vectors",
  "/linear-algebra/matrices",
  "/linear-algebra/row-reduction",
  "/linear-algebra/linear-transforms",
  "/linear-algebra/determinants",
  "/linear-algebra/vector-spaces",
  "/linear-algebra/eigenvectors",
  "/linear-algebra/orthogonality",
  "/linear-algebra/least-squares",
  "/linear-algebra/playground",
  "/complex-numbers",
  "/complex-numbers/argand-plane",
  "/complex-numbers/arithmetic",
  "/complex-numbers/polar-forms",
  "/complex-numbers/rotation",
  "/complex-numbers/roots",
  "/complex-numbers/euler",
  "/complex-numbers/loci",
  "/complex-numbers/fractals",
  "/complex-numbers/waves-circuits",
  "/mathematical-modelling",
  "/mathematical-modelling/motion",
  "/mathematical-modelling/population",
  "/mathematical-modelling/epidemics",
  "/mathematical-modelling/finance",
  "/mathematical-modelling/optimization",
  "/mathematical-modelling/networks",
  "/mathematical-modelling/regression",
  "/mathematical-modelling/periodic",
  "/mathematical-modelling/numerical",
  "/mathematical-modelling/comparison",
  "/discrete-world",
  "/discrete-world/number-sense",
  "/discrete-world/primes",
  "/discrete-world/modular-arithmetic",
  "/discrete-world/number-patterns",
  "/discrete-world/combinatorics",
  "/discrete-world/logic",
  "/discrete-world/sets",
  "/discrete-world/graphs",
  "/discrete-world/algorithms",
  "/discrete-world/cryptography",
];

const protectedRoutes = [
  "/geometry",
  "/geometry/triangles",
  "/geometry/circles",
  "/trigonometry",
  "/trigonometry/unit-circle",
  "/trigonometry/right-triangle",
];

const slug = (route) => route.replace(/^\//, "").replaceAll("/", "_") || "root";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
const report = { routes: [], protected: [], interactions: {}, errors: [] };

page.on("pageerror", (error) => report.errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") report.errors.push(message.text());
});

async function capture(route, dest) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator("h1").first().waitFor({ state: "attached", timeout: 20_000 });
  await page.waitForTimeout(450);
  const title = await page.locator("h1").first().innerText().catch(() => "");
  const labMode = await page.locator("[data-lab-mode]").first().getAttribute("data-lab-mode").catch(() => null);
  const canvasMode = await page.locator("[data-mode-canvas]").first().getAttribute("data-mode-canvas").catch(() => null);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 8);
  await page.screenshot({ path: path.join(out, `${dest}.png`), fullPage: true });
  return { route, title, labMode, canvasMode, overflow };
}

for (const route of routes) {
  report.routes.push(await capture(route, slug(route)));
}

for (const route of protectedRoutes) {
  report.protected.push(await capture(route, `protected_${slug(route)}`));
}

await page.goto(`${baseUrl}/mathematical-modelling/motion`, { waitUntil: "domcontentloaded" });
await page.locator("h1").first().waitFor();
const slider = page.locator('input[type="range"]').first();
const before = await slider.inputValue();
await slider.fill("40");
const after = await slider.inputValue();
report.interactions.motionSlider = { before, after, changed: before !== after };

await page.locator("nav.msk-tabs button", { hasText: "Vehicle" }).click();
await page.waitForTimeout(200);
report.interactions.vehicleMode = await page.locator("[data-lab-mode]").first().getAttribute("data-lab-mode");
await page.screenshot({ path: path.join(out, "modelling_motion_vehicle.png"), fullPage: true });

await page.goto(`${baseUrl}/linear-algebra/vectors`, { waitUntil: "domcontentloaded" });
await page.locator("h1").first().waitFor();
const tabs = page.locator("nav.msk-tabs button");
if (await tabs.count() > 1) {
  await tabs.nth(1).click();
  await page.waitForTimeout(200);
}
report.interactions.vectorSecondMode = await page.locator("[data-lab-mode]").first().getAttribute("data-lab-mode");
await page.screenshot({ path: path.join(out, "linear_algebra_vectors_mode2.png"), fullPage: true });

await page.goto(`${baseUrl}/algebra/functions`, { waitUntil: "domcontentloaded" });
await page.locator("h1").first().waitFor();
const zoomIn = page.getByRole("button", { name: "Zoom in" }).first();
const graph = page.locator("[data-mode-canvas], .cs-graph, .msk-graph, svg").first();
const beforeBox = await graph.boundingBox();
if (await zoomIn.count()) await zoomIn.click();
await page.waitForTimeout(200);
const afterBox = await graph.boundingBox();
report.interactions.zoomDoesNotResizeElement = Boolean(
  beforeBox && afterBox && Math.abs(beforeBox.width - afterBox.width) < 2 && Math.abs(beforeBox.height - afterBox.height) < 2,
);

await page.goto(`${baseUrl}/complex-numbers/argand-plane`, { waitUntil: "domcontentloaded" });
await page.locator("h1").first().waitFor();
const canvas = page.locator("[data-mode-canvas]").first();
const box = await canvas.boundingBox();
if (box) {
  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 80, box.y + 40, { steps: 6 });
  await page.mouse.up();
}
report.interactions.noTextSelectionOnCanvas = await page.evaluate(() => (window.getSelection()?.toString() ?? "") === "");
await page.screenshot({ path: path.join(out, "complex_argand_after_drag.png"), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/discrete-world/number-sense`, { waitUntil: "domcontentloaded" });
await page.locator("h1").first().waitFor();
await page.screenshot({ path: path.join(out, "discrete_number_sense_mobile.png"), fullPage: true });
report.interactions.mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 8);

await writeFile(path.join(out, "capture-report.json"), JSON.stringify(report, null, 2));
await browser.close();

const missingTitles = report.routes.filter((item) => !item.title);
const overflowRoutes = [...report.routes, ...report.protected].filter((item) => item.overflow);
if (missingTitles.length) throw new Error(`Missing titles: ${missingTitles.map((item) => item.route).join(", ")}`);
if (!report.interactions.motionSlider.changed) throw new Error("Motion slider did not change");
if (!report.interactions.vehicleMode) throw new Error("Vehicle mode did not stamp data-lab-mode");
if (!report.interactions.zoomDoesNotResizeElement) throw new Error("Zoom resized the graph element");
if (!report.interactions.noTextSelectionOnCanvas) throw new Error("Canvas drag selected text");
if (report.interactions.mobileOverflow) throw new Error("Number Sense overflows on mobile");
console.log(JSON.stringify({ captured: report.routes.length, protected: report.protected.length, overflowRoutes, errors: report.errors.length, interactions: report.interactions }, null, 2));
