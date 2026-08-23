/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";
const route = "/lessons/3d-mathematics/395-tetrahedron";

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["tablet", { width: 900, height: 1100 }],
  ["mobile", { width: 390, height: 1100 }],
];

function assertIncludes(text, expected, label) {
  if (!text.toLowerCase().includes(expected.toLowerCase())) throw new Error(`${label}: missing "${expected}"`);
}

function volumeFrom(text) {
  const match = text.match(/Volume\s+([0-9]+(?:\.[0-9]+)?)/i);
  if (!match) throw new Error("Could not read Volume metric");
  return Number(match[1]);
}

async function setRange(locator, value) {
  const next = await locator.evaluate((input, requested) => {
    const min = Number(input.min);
    const max = Number(input.max);
    const step = Number(input.step) || 1;
    const clamped = Math.min(max, Math.max(min, Number(requested)));
    const snapped = min + Math.round((clamped - min) / step) * step;
    return Number(snapped.toFixed(6));
  }, value);
  await locator.fill(String(next));
}

const browser = await chromium.launch();
const results = [];

try {
  for (const [viewportName, viewport] of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Tetrahedron" }).first().waitFor({ timeout: 15_000 });

    const initialText = await page.locator("body").innerText();
    assertIncludes(initialText, "Tetrahedron - reusable spatial engine", viewportName);
    assertIncludes(initialText, "tetrahedron", viewportName);
    assertIncludes(initialText, "Drag solid", viewportName);
    assertIncludes(initialText, "Tetrahedron: use x, y, and z axes", viewportName);
    assertIncludes(initialText, "V = Bh / 3", viewportName);
    assertIncludes(initialText, "Volume", viewportName);
    assertIncludes(initialText, "Surface", viewportName);

    const svgCount = await page.locator("svg").count();
    if (svgCount < 1) throw new Error(`${viewportName}: expected SVG scene`);

    const sliders = page.locator('input[type="range"]');
    if ((await sliders.count()) < 3) throw new Error(`${viewportName}: expected size, height, and orbit sliders`);

    const beforeVolume = volumeFrom(initialText);
    await setRange(sliders.nth(0), 7);
    await setRange(sliders.nth(1), 8);
    await setRange(sliders.nth(2), 135);

    const updatedText = await page.locator("body").innerText();
    const afterVolume = volumeFrom(updatedText);
    if (!Number.isFinite(afterVolume) || afterVolume === beforeVolume) throw new Error(`${viewportName}: volume did not react to size/height controls`);
    assertIncludes(updatedText, "apex", viewportName);
    assertIncludes(updatedText, "base B", viewportName);

    if (consoleErrors.length) throw new Error(`${viewportName}: console errors: ${consoleErrors.join(" | ")}`);
    await page.screenshot({ path: `${evidenceDir}/0580-${viewportName}.png`, fullPage: true });
    results.push({ id: 580, route, viewport: viewportName, status: "passed", beforeVolume, afterVolume });
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0580-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log("Validated lesson 0580 across desktop, tablet, and mobile.");
