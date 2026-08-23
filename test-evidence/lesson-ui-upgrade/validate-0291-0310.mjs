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
  [291, "/lessons/geometry/234-relation-checker", "Relation Checker", "Relation checker"],
  [292, "/lessons/geometry/235-construction-steps", "Construction Steps", "Construction steps"],
  [293, "/lessons/geometry/236-translation-by-vector", "Translation by Vector", "Translation by vector"],
  [294, "/lessons/geometry/237-reflection-in-line", "Reflection in Line", "Reflection in line"],
  [295, "/lessons/geometry/238-reflection-in-point", "Reflection in Point", "Reflection in point"],
  [296, "/lessons/geometry/239-reflection-in-circle", "Reflection in Circle", "Reflection in circle"],
  [297, "/lessons/geometry/240-rotation-around-point", "Rotation Around Point", "Rotation around point"],
  [298, "/lessons/geometry/241-dilation-from-point", "Dilation from Point", "Dilation from point"],
  [299, "/lessons/geometry/242-matrix-transformation", "Matrix Transformation", "Matrix transformation"],
  [300, "/lessons/geometry/243-composite-transformations", "Composite Transformations", "Composite transformations"],
  [301, "/lessons/geometry/244-transformation-mapping", "Transformation Mapping", "Transformation mapping"],
  [302, "/lessons/geometry/245-invariants", "Invariants", "Invariants"],
  [303, "/lessons/geometry/246-symmetry-explorer", "Symmetry Explorer", "Symmetry explorer"],
  [304, "/lessons/geometry/247-locus-generator", "Locus Generator", "Locus generator"],
  [305, "/lessons/geometry/248-equidistant-loci", "Equidistant Loci", "Equidistant loci"],
  [306, "/lessons/geometry/249-moving-linkage-loci", "Moving-Linkage Loci", "Moving-linkage loci"],
  [307, "/lessons/geometry/250-envelope-of-lines", "Envelope of Lines", "Envelope of lines"],
  [308, "/lessons/geometry/251-dynamic-trace", "Dynamic Trace", "Dynamic trace"],
  [309, "/lessons/geometry/252-conjecture-testing", "Conjecture Testing", "Conjecture testing"],
  [310, "/lessons/geometry/253-exact-proof", "Exact Proof", "Exact proof"],
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
    for (const [mockupId, route, title, snippet] of lessons) {
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
        mustContain(bodyText, "Worked:", `${mockupId} ${viewportName}`);
        mustContain(bodyText, "Avoid:", `${mockupId} ${viewportName}`);

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
    path.join(evidenceDir, "0291-0310-validation-summary.json"),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8",
  );
  console.log(`Validated ${lessons.length} lessons across ${viewports.length} viewports each.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
