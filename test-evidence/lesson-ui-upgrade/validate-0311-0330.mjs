/* global console, process */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 768, height: 1024 }],
  ["mobile", { width: 390, height: 844 }],
];

const lessons = [
  [311, "/lessons/geometry/254-collinearity-test", "Collinearity Test", "Collinearity test", "geometry"],
  [312, "/lessons/geometry/255-concurrency-test", "Concurrency Test", "Concurrency test", "geometry"],
  [313, "/lessons/geometry/256-concyclicity-test", "Concyclicity Test", "Concyclicity test", "geometry"],
  [314, "/lessons/trigonometry/257-angle-measurement", "Angle Measurement", "Angle measurement", "trig"],
  [315, "/lessons/trigonometry/258-unit-circle", "Unit Circle", "Unit circle", "trig"],
  [316, "/lessons/trigonometry/259-right-triangle-ratios", "Right-Triangle Ratios", "Right-triangle ratios", "trig"],
  [317, "/lessons/trigonometry/260-exact-trig-values", "Exact Trig Values", "Exact trig values", "trig"],
  [318, "/lessons/trigonometry/261-sine-graph", "Sine Graph", "Sine graph", "trig"],
  [319, "/lessons/trigonometry/262-cosine-graph", "Cosine Graph", "Cosine graph", "trig"],
  [320, "/lessons/trigonometry/263-tangent-graph", "Tangent Graph", "Tangent graph", "trig"],
  [321, "/lessons/trigonometry/264-reciprocal-trig-functions", "Reciprocal Trig Functions", "Reciprocal trig", "trig"],
  [322, "/lessons/trigonometry/265-inverse-trig-functions", "Inverse Trig Functions", "Inverse trig", "trig"],
  [323, "/lessons/trigonometry/266-trig-identities", "Trig Identities", "Trig identities", "trig"],
  [324, "/lessons/trigonometry/267-compound-angle-formulae", "Compound-Angle Formulae", "Compound-angle formulae", "trig"],
  [325, "/lessons/trigonometry/268-double-and-half-angle-formulae", "Double- and Half-Angle Formulae", "Double and half angle", "trig"],
  [326, "/lessons/trigonometry/269-trig-equations", "Trig Equations", "Trig equations", "trig"],
  [327, "/lessons/trigonometry/270-sine-rule", "Sine Rule", "Sine rule", "trig"],
  [328, "/lessons/trigonometry/271-cosine-rule", "Cosine Rule", "Cosine rule", "trig"],
  [329, "/lessons/trigonometry/272-triangle-area-formula", "Triangle Area Formula", "Triangle area formula", "trig"],
  [330, "/lessons/trigonometry/273-bearings", "Bearings", "Bearings", "trig"],
];

function mustContain(text, needle, context) {
  if (!text.includes(needle)) {
    throw new Error(`${context} missing text: ${needle}`);
  }
}

async function main() {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const [mockupId, route, title, snippet, family] of lessons) {
      for (const [viewportName, viewport] of viewports) {
        const page = await browser.newPage({ viewport });
        const url = `${baseUrl}${route}`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
        await page.locator("main, body").first().waitFor({ state: "visible", timeout: 15_000 });

        const range = page.locator('input[type="range"]').first();
        if ((await range.count()) > 0) {
          await range.focus();
          await page.keyboard.press("ArrowRight");
        }

        const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
        mustContain(bodyText, title, `${mockupId} ${viewportName}`);
        mustContain(bodyText, snippet, `${mockupId} ${viewportName}`);
        if ((await page.locator('[data-direct-interaction="true"]').count()) === 0) {
          throw new Error(`${mockupId} ${viewportName} missing direct interaction surface`);
        }

        if (family === "geometry") {
          mustContain(bodyText, "Worked:", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "Avoid:", `${mockupId} ${viewportName}`);
          mustContain(bodyText.toLowerCase(), "drag points", `${mockupId} ${viewportName}`);
        } else {
          const lowerText = bodyText.toLowerCase();
          mustContain(lowerText, "drag the point", `${mockupId} ${viewportName}`);
          mustContain(lowerText, "drag graph marker", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "Angle theta", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "sin theta", `${mockupId} ${viewportName}`);
        }

        const screenshotPath = path.join(evidenceDir, `${String(mockupId).padStart(4, "0")}-${viewportName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        results.push({ mockupId, route, viewport: viewportName, screenshotPath, status: "passed" });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    path.join(evidenceDir, "0311-0330-validation-summary.json"),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8",
  );
  console.log(`Validated ${lessons.length} lessons across ${viewports.length} viewports each.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
