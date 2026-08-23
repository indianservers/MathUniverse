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
  [261, "/lessons/geometry/204-segment", "Segment", "Segment: finite part from A to B"],
  [262, "/lessons/geometry/205-segment-with-given-length", "Segment with Given Length", "Fixed length segment"],
  [263, "/lessons/geometry/206-ray", "Ray", "Ray: starts at A"],
  [264, "/lessons/geometry/207-polyline", "Polyline", "Polyline: A-B-C"],
  [265, "/lessons/geometry/208-perpendicular-line", "Perpendicular Line", "Perpendicular line"],
  [266, "/lessons/geometry/209-parallel-line", "Parallel Line", "Parallel line"],
  [267, "/lessons/geometry/210-perpendicular-bisector", "Perpendicular Bisector", "Perpendicular bisector"],
  [268, "/lessons/geometry/211-angle-bisector", "Angle Bisector", "Angle bisector"],
  [269, "/lessons/geometry/212-tangent", "Tangent", "Tangent: radius is perpendicular"],
  [270, "/lessons/geometry/213-best-fit-line", "Best-Fit Line", "Best-fit line"],
  [271, "/lessons/geometry/214-triangle-constructor", "Triangle Constructor", "Triangle constructor"],
  [272, "/lessons/geometry/215-regular-polygon", "Regular Polygon", "Regular polygon"],
  [273, "/lessons/geometry/216-rigid-polygon", "Rigid Polygon", "Rigid polygon"],
  [274, "/lessons/geometry/217-general-polygon", "General Polygon", "General polygon"],
  [275, "/lessons/geometry/218-circle-centre-and-point", "Circle: Centre and Point", "Centre and point circle"],
  [276, "/lessons/geometry/219-circle-centre-and-radius", "Circle: Centre and Radius", "Centre and radius circle"],
  [277, "/lessons/geometry/220-circle-through-three-points", "Circle Through Three Points", "Circle through three points"],
  [278, "/lessons/geometry/221-compass", "Compass", "Compass: copy a distance"],
  [279, "/lessons/geometry/222-semicircle", "Semicircle", "Semicircle: arc over a diameter"],
  [280, "/lessons/geometry/223-circular-arc", "Circular Arc", "Circular arc"],
  [281, "/lessons/geometry/224-circumcircular-arc", "Circumcircular Arc", "Circumcircular arc"],
  [282, "/lessons/geometry/225-circular-sector", "Circular Sector", "Circular sector"],
  [283, "/lessons/geometry/226-conic-through-five-points", "Conic Through Five Points", "Conic through five points"],
  [284, "/lessons/geometry/227-ellipse", "Ellipse", "Ellipse: sum of distances"],
  [285, "/lessons/geometry/228-hyperbola", "Hyperbola", "Hyperbola: difference"],
  [286, "/lessons/geometry/229-parabola", "Parabola", "Parabola: distance"],
  [287, "/lessons/geometry/230-distance-length", "Distance / Length", "Distance or length"],
  [288, "/lessons/geometry/231-area", "Area", "Area: count square units"],
  [289, "/lessons/geometry/232-angle", "Angle", "Angle: measure a turn"],
  [290, "/lessons/geometry/233-fixed-angle", "Fixed Angle", "Fixed angle"],
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
    path.join(evidenceDir, "0261-0290-validation-summary.json"),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8",
  );
  console.log(`Validated ${lessons.length} lessons across ${viewports.length} viewports each.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
