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
  [371, "/lessons/calculus/292-quotient-rule", "Quotient Rule", "A rational quotient highlights numerator change"],
  [372, "/lessons/calculus/293-chain-rule", "Chain Rule", "A nested sine curve changes through both"],
  [373, "/lessons/calculus/294-implicit-differentiation", "Implicit Differentiation", "The upper semicircle represents x^2+y^2=9"],
  [374, "/lessons/calculus/295-parametric-differentiation", "Parametric Differentiation", "The curve stands in for a parametric path"],
  [375, "/lessons/calculus/296-critical-points", "Critical Points", "The cubic has flat tangent candidates"],
  [376, "/lessons/calculus/297-increasing-decreasing", "Increasing / Decreasing", "Derivative sign partitions the cubic"],
  [377, "/lessons/calculus/298-local-and-global-extrema", "Local and Global Extrema", "A downward parabola has a global maximum"],
  [378, "/lessons/calculus/299-concavity", "Concavity", "The quartic bends up and down"],
  [379, "/lessons/calculus/300-inflection-points", "Inflection Points", "The cubic changes concavity"],
  [380, "/lessons/calculus/301-optimisation", "Optimisation", "A concave-down model lets students compare"],
  [381, "/lessons/calculus/302-related-rates", "Related Rates", "A distance curve links horizontal motion"],
  [382, "/lessons/calculus/303-motion-analysis", "Motion Analysis", "A projectile-style position curve connects slope"],
  [383, "/lessons/calculus/304-newton-s-method", "Newton's Method", "A tangent from the current guess points"],
  [384, "/lessons/calculus/305-taylor-polynomial", "Taylor Polynomial", "A sine curve near the center"],
  [385, "/lessons/calculus/306-area-by-rectangles", "Area by Rectangles", "Rectangles approximate the area under a positive curve"],
  [386, "/lessons/calculus/307-riemann-sums", "Riemann Sums", "A shifted sine curve makes left"],
  [387, "/lessons/calculus/308-definite-integral", "Definite Integral", "A definite integral accumulates signed area"],
  [388, "/lessons/calculus/309-indefinite-integral", "Indefinite Integral", "The antiderivative family has the same derivative"],
  [389, "/lessons/calculus/310-fundamental-theorem", "Fundamental Theorem", "Changing the upper endpoint changes accumulated area"],
  [390, "/lessons/calculus/311-area-between-curves", "Area Between Curves", "The highlighted accumulation represents top minus bottom"],
  [391, "/lessons/calculus/312-substitution", "Substitution", "The factor 2x matches the derivative"],
  [392, "/lessons/calculus/313-integration-by-parts", "Integration by Parts", "A product integrand is split into u and dv"],
  [393, "/lessons/calculus/314-partial-fractions", "Partial Fractions", "Factored denominators reveal simple reciprocal pieces"],
  [394, "/lessons/calculus/315-improper-integrals", "Improper Integrals", "A decaying tail asks whether"],
  [395, "/lessons/calculus/316-numerical-integration", "Numerical Integration", "Numerical integration compares sampled rectangle area"],
  [396, "/lessons/calculus/317-volume-by-slicing", "Volume by Slicing", "Each vertical slice becomes a cross-section area"],
  [397, "/lessons/calculus/318-disc-and-washer-methods", "Disc and Washer Methods", "Washer volume squares radii"],
  [398, "/lessons/calculus/319-shell-method", "Shell Method", "A shell uses radius times height"],
  [399, "/lessons/calculus/320-arc-length", "Arc Length", "Arc length adds tiny slanted pieces"],
  [400, "/lessons/calculus/321-surface-area-of-revolution", "Surface Area of Revolution", "A rotating arc strip creates surface area"],
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
    return "range";
  }

  const button = page.getByRole("button", { name: /calculate|run|next|reveal/i }).first();
  if ((await button.count()) > 0) {
    await button.click();
    return "button";
  }

  return "none";
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
        const exercised = await exerciseVisibleControl(page);

        const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
        mustContain(bodyText, title, `${mockupId} ${viewportName}`);
        mustContain(bodyText, snippet, `${mockupId} ${viewportName}`);
        if (!bodyText.includes("Calculus Lab") && !bodyText.includes("Integral / ODE / CAS")) {
          throw new Error(`${mockupId} ${viewportName} missing calculus/integral lab label`);
        }
        mustContain(bodyText, "graph + CAS", `${mockupId} ${viewportName}`);
        mustContain(bodyText, "Linked controls", `${mockupId} ${viewportName}`);
        if (!bodyText.includes("CAS derivative") && !bodyText.includes("CAS integral")) {
          throw new Error(`${mockupId} ${viewportName} missing CAS derivative/integral readout`);
        }
        if ((await page.locator("svg").count()) === 0) {
          throw new Error(`${mockupId} ${viewportName} missing calculus graph surface`);
        }

        const screenshotPath = path.join(evidenceDir, `${String(mockupId).padStart(4, "0")}-${viewportName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        results.push({ mockupId, route, viewport: viewportName, screenshotPath, exercised, status: "passed" });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    path.join(evidenceDir, "0371-0400-validation-summary.json"),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8",
  );
  console.log(`Validated ${lessons.length} lessons across ${viewports.length} viewports each.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
