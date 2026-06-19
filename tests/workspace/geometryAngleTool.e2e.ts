import { expect, test } from "@playwright/test";

test.describe("Geometry workspace angle tool", () => {
  test("shows premium angle guidance on the geometry workspace", async ({ page }) => {
    await page.goto("/workspace/geometry?v_size_stroke=9&v_opacity=1", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: /^Angle$/ }).click();

    await expect(page.getByTestId("geometry-pick-panel")).toContainText("1 side point");
    await expect(page.getByTestId("geometry-pick-panel")).toContainText("2 vertex");
    await expect(page.getByTestId("geometry-pick-panel")).toContainText("3 side point");
    await expect(page.getByTestId("angle-tool-geogebra-plus-help")).toContainText("vertex second");
  });
});
