import { expect, test } from "@playwright/test";

const expectedLinks = [
  ["Overview + Formula Atlas", "/calculus"],
  ["Limits", "/math/limits-continuity"],
  ["Derivatives", "/math/derivatives"],
  ["Derivative Formula Atlas", "/math/derivatives/formula-visualizer"],
  ["Integration", "/math/integration"],
  ["Integration Formula Atlas", "/math/integration/formula-visualizer"],
  ["Slope Fields", "/math/slope-fields"],
] as const;

test("limits uses the exact calculus-only navigation with working routes", async ({ page }) => {
  await page.goto("/math/limits-continuity?v_limit_point_a=0&v_approach_distance=1.2");

  const sidebar = page.getByRole("complementary", { name: "Calculus navigation" });
  await expect(sidebar).toBeVisible();
  await expect(sidebar.getByText("Calculus", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Core Calculus", { exact: true })).toBeVisible();

  for (const [label, href] of expectedLinks) {
    await expect(sidebar.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }

  await expect(sidebar.getByRole("link", { name: "Limits", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(sidebar).not.toContainText("AR Geometry");
  await expect(sidebar).not.toContainText("Algebra");
  await expect(sidebar).not.toContainText("Engineering Mathematics");

  await sidebar.getByRole("link", { name: "Derivatives", exact: true }).click();
  await expect(page).toHaveURL(/\/math\/derivatives(?:\?|$)/);
  await expect(page.getByRole("complementary", { name: "Calculus navigation" }).getByRole("link", { name: "Derivatives", exact: true })).toHaveAttribute("aria-current", "page");
});

test("calculus navigation becomes an accessible mobile drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/math/limits-continuity?v_limit_point_a=0&v_approach_distance=1.2");

  const sidebar = page.getByRole("complementary", { name: "Calculus navigation" });
  await expect(sidebar).not.toBeInViewport();
  await page.getByRole("button", { name: "Open Calculus navigation" }).click();
  await expect(sidebar).toBeInViewport();
  await sidebar.getByRole("button", { name: "Close navigation" }).click();
  await expect(sidebar).not.toBeInViewport();
});
