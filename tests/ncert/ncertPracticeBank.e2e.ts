import { expect, test } from "@playwright/test";

test.describe("NCERT Phase 11 practice bank", () => {
  test("answers a Grade 7 checked practice question", async ({ page }) => {
    await page.goto("/ncert/class-7-large-numbers-around-us", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "Practice" }).click();
    await page.getByRole("button", { name: "4 crore" }).click();
    await page.getByRole("button", { name: "Check answer" }).click();
    await expect(page.getByText(/Correct/i).first()).toBeVisible();
  });

  test("answers a Class 10 checked practice question", async ({ page }) => {
    await page.goto("/ncert/class-10-real-numbers", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "Practice" }).click();
    await page.getByLabel("Practice answer").fill("12");
    await page.getByRole("button", { name: "Check answer" }).click();
    await expect(page.getByText(/Correct/i).first()).toBeVisible();
  });

  test("answers a Class 12 checked practice question", async ({ page }) => {
    await page.goto("/ncert/class-12-determinants", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "Practice" }).click();
    await page.getByLabel("Practice answer").fill("5");
    await page.getByRole("button", { name: "Check answer" }).click();
    await expect(page.getByText(/Correct/i).first()).toBeVisible();
  });
});
