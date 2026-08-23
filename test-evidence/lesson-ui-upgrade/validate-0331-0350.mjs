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
  [331, "/lessons/trigonometry/274-elevation-and-depression", "Elevation and Depression", "Elevation and depression", "trig"],
  [332, "/lessons/trigonometry/275-harmonic-motion", "Harmonic Motion", "Harmonic motion", "trig"],
  [333, "/lessons/trigonometry/276-polar-trigonometry", "Polar Trigonometry", "Polar trigonometry", "trig"],
  [334, "/lessons/symbolic-mathematics/428-symbolic-evaluation", "Symbolic Evaluation", "Symbolic Evaluation - reusable CAS engine", "cas"],
  [335, "/lessons/symbolic-mathematics/429-simplify", "Simplify", "Simplify - reusable CAS engine", "cas"],
  [336, "/lessons/symbolic-mathematics/430-expand", "Expand", "Expand - reusable CAS engine", "cas"],
  [337, "/lessons/symbolic-mathematics/431-factor", "Factor", "Factor - reusable CAS engine", "cas"],
  [338, "/lessons/symbolic-mathematics/432-substitute", "Substitute", "Substitute - reusable CAS engine", "cas"],
  [339, "/lessons/symbolic-mathematics/433-solve", "Solve", "Solve - reusable CAS engine", "cas"],
  [340, "/lessons/symbolic-mathematics/434-numerical-solve", "Numerical Solve", "Numerical Solve - reusable CAS engine", "cas"],
  [341, "/lessons/symbolic-mathematics/435-solve-systems", "Solve Systems", "Solve Systems - reusable CAS engine", "cas"],
  [342, "/lessons/symbolic-mathematics/436-eliminate-variables", "Eliminate Variables", "Eliminate Variables - reusable CAS engine", "cas"],
  [343, "/lessons/symbolic-mathematics/437-partial-fractions", "Partial Fractions", "Partial Fractions - reusable CAS engine", "cas"],
  [344, "/lessons/symbolic-mathematics/438-polynomial-division", "Polynomial Division", "Polynomial Division - reusable CAS engine", "cas"],
  [345, "/lessons/symbolic-mathematics/439-derivatives", "Derivatives", "Derivatives - reusable CAS engine", "cas"],
  [346, "/lessons/symbolic-mathematics/440-integrals", "Integrals", "Integrals - reusable CAS engine", "cas"],
  [347, "/lessons/symbolic-mathematics/441-limits", "Limits", "Limits - reusable CAS engine", "cas"],
  [348, "/lessons/symbolic-mathematics/442-series-expansions", "Series Expansions", "Series Expansions - reusable CAS engine", "cas"],
  [349, "/lessons/symbolic-mathematics/443-differential-equations", "Differential Equations", "Differential Equations - differential-equation lab", "cas"],
  [350, "/lessons/symbolic-mathematics/444-matrix-operations", "Matrix Operations", "Matrix Operations - reusable CAS engine", "cas"],
];

function mustContain(text, needle, context) {
  if (!text.includes(needle)) {
    throw new Error(`${context} missing text: ${needle}`);
  }
}

async function exerciseVisibleControl(page) {
  const range = page.locator('input[type="range"]').first();
  if ((await range.count()) > 0) {
    await range.focus();
    await page.keyboard.press("ArrowRight");
    return;
  }

  const button = page.getByRole("button", { name: /next symbolic step|reveal next step|calculate|run/i }).first();
  if ((await button.count()) > 0) {
    await button.click();
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
        await exerciseVisibleControl(page);

        const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
        mustContain(bodyText, title, `${mockupId} ${viewportName}`);
        mustContain(bodyText, snippet, `${mockupId} ${viewportName}`);

        if (family === "trig") {
          const lowerText = bodyText.toLowerCase();
          mustContain(lowerText, "drag the point", `${mockupId} ${viewportName}`);
          mustContain(lowerText, "drag graph marker", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "Angle theta", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "sin theta", `${mockupId} ${viewportName}`);
          if ((await page.locator('[data-direct-interaction="true"]').count()) === 0) {
            throw new Error(`${mockupId} ${viewportName} missing direct trigonometry interaction surface`);
          }
        } else {
          mustContain(bodyText, "CAS Lab", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "CAS Calculator", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "expression", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "CAS result", `${mockupId} ${viewportName}`);
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
    path.join(evidenceDir, "0331-0350-validation-summary.json"),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8",
  );
  console.log(`Validated ${lessons.length} lessons across ${viewports.length} viewports each.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
