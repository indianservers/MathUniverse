import { expect, test } from "@playwright/test";

const representativeRoutes = [
  { kind: "core", route: "/lessons/discrete-and-applied-mathematics/591-simple-interest", minimumTries: 5 },
  { kind: "school", route: "/lessons/school/class-10/class-10-coordinate-geometry-midpoint-formula", minimumTries: 5 },
  { kind: "advanced", route: "/lessons/advanced-concepts/2001-partial-quotients", minimumTries: 3 },
];

for (const entry of representativeRoutes) {
  test(`${entry.kind} lessons expose step-by-step examples and answer-supported Try these`, async ({ page }) => {
    await page.goto(entry.route);

    await page.getByRole("tab", { name: "Examples", exact: true }).click();
    const examples = page.locator('[data-testid="step-by-step-examples"]:visible').locator("article");
    await expect(examples).toHaveCount(3);
    await expect(examples.first()).toContainText("1");
    await expect(examples.first()).toContainText("Answer:");

    await page.getByRole("tab", { name: "Know more", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Try these", exact: true })).toBeVisible();
    const answerButtons = page.getByRole("button", { name: "Show answer", exact: true });
    expect(await answerButtons.count()).toBeGreaterThanOrEqual(entry.minimumTries);

    await answerButtons.first().click();
    await expect(page.getByRole("region", { name: "Answer to try 1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hide answer", exact: true }).first()).toBeVisible();
  });
}
