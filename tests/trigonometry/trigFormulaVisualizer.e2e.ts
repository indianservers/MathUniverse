import { expect, test } from "@playwright/test";

const route = "/trigonometry/formula-visualizer";

test.describe("Trigonometric Formula Visualizer", () => {
  test("renders formula gallery groups and updates the proof panel for every formula", async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Trigonometric Formula Visualizer" })).toBeVisible();
    await expect(page.getByTestId("formula-unit-circle-svg")).toBeVisible();

    for (const groupId of [
      "basic-ratios",
      "quotient-identities",
      "pythagorean-identities",
      "even-odd-identities",
      "complementary-angle-identities",
    ]) {
      await expect(page.getByTestId(`formula-group-${groupId}`)).toBeVisible();
    }

    for (const formulaId of [
      "sin",
      "cos",
      "tan",
      "cot",
      "sec",
      "cosec",
      "tan-ratio",
      "cot-ratio",
      "pythagorean",
      "pythagorean-tan",
      "pythagorean-cot",
      "even-sin",
      "even-cos",
      "even-tan",
      "comp-sin",
      "comp-cos",
      "comp-tan",
    ]) {
      await page.getByTestId(`visualize-${formulaId}`).click();
      await expect(page.getByTestId("identity-proof-panel"), formulaId).toBeVisible();
      await expect(page.getByTestId("selected-formula-live-value"), formulaId).not.toBeEmpty();
    }
  });

  test("angle controls, unit toggle, snap mode, and compare modes work", async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    await setSliderValue(page, 60);
    await expect(page.getByTestId("theta-live-value")).toContainText("60 deg");
    await expect(page.getByTestId("selected-formula-live-value")).toContainText("0.866");

    await page.getByTestId("angle-unit-toggle").click();
    await expect(page.getByTestId("theta-live-value")).toContainText("1.047 rad");

    await page.getByTestId("snap-toggle").click();
    await setSliderValue(page, 58);
    await expect(page.getByTestId("theta-live-value")).toContainText("pi / 3");

    await page.getByTestId("even-odd-compare-toggle").click();
    await expect(page.getByTestId("even-odd-proof-visual")).toHaveCount(1);

    await page.getByTestId("even-odd-compare-toggle").click();
    await page.getByTestId("complementary-compare-toggle").click();
    await expect(page.getByTestId("complementary-proof-visual")).toHaveCount(1);

    await page.getByTestId("reset-angle-button").click();
    await expect(page.getByTestId("theta-live-value")).toContainText("0.785 rad");
  });

  test("explanation levels switch student-facing text", async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    await page.getByTestId("visualize-pythagorean").click();
    await page.getByTestId("explanation-level-simple").click();
    await expect(page.getByTestId("selected-formula-explanation")).toContainText("hypotenuse 1");

    await page.getByTestId("explanation-level-detailed").click();
    await expect(page.getByTestId("selected-formula-explanation")).toContainText("x^2 + y^2");

    await page.getByTestId("explanation-level-memory").click();
    await expect(page.getByTestId("selected-formula-explanation")).toContainText("unit circle triangle");
  });

  test("journey mode, practice mode, misconception alerts, and graph interactions work", async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("journey-step-title")).toContainText("What is sin");
    await page.getByTestId("journey-next").click();
    await expect(page.getByTestId("journey-step-title")).toContainText("What is cos");
    await expect(page.getByTestId("journey-progress")).toContainText("Step 2 of 6");
    await page.getByTestId("journey-prev").click();
    await expect(page.getByTestId("journey-step-title")).toContainText("What is sin");

    await page.getByTestId("practice-answer-vertical-height").click();
    await expect(page.getByTestId("practice-feedback")).toContainText("Correct");
    await expect(page.getByTestId("practice-score")).toContainText("1/5");
    await page.getByTestId("practice-next").click();
    await page.getByTestId("practice-answer-tan-theta").click();
    await expect(page.getByTestId("practice-feedback")).toContainText("Try again");
    await page.getByTestId("practice-retry").click();
    await expect(page.getByTestId("practice-score")).toContainText("0/5");

    await expect(page.getByTestId("misconception-alert")).toHaveCount(4);
    await expect(page.getByText("sin^2 theta means")).toBeVisible();
    await expect(page.getByTestId("comparison-graph-svg")).toBeVisible();

    await page.getByTestId("comparison-toggle-sin").click();
    await page.getByTestId("comparison-toggle-cos").click();
    await page.getByTestId("comparison-toggle-pythagorean").click();
    await expect(page.getByTestId("comparison-empty-state")).toBeVisible();
    await page.getByTestId("comparison-toggle-tan").click();
    await expect(page.getByTestId("comparison-graph-svg")).toBeVisible();
  });

  test("keyboard slider input and mobile layout stay usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const slider = page.getByTestId("theta-slider");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("theta-live-value")).toContainText("46 deg");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("existing trigonometry page still links to the visualizer", async ({ page }) => {
    await page.goto("/trigonometry", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Open Formula Visualizer" })).toBeVisible();
  });
});

async function setSliderValue(page: import("@playwright/test").Page, value: number) {
  await page.getByTestId("theta-slider").fill(String(value));
}
