import { expect, test } from "@playwright/test";
import { getProofLearningCertificationJourneys } from "../../src/proof-explanations/proofLearningLinks";
import { expectNoBrowserErrorSurface, expectNonblankPrimaryVisual, expectProofShell, gotoOk } from "../visual-proofs/visualProofsBrowserAssertions";

const certifiedJourneys = getProofLearningCertificationJourneys();

test.describe("proof explanation learning journeys", () => {
  test("connects formula, theorem, and Visual Proof pages across the certification matrix", async ({ page }) => {
    test.setTimeout(180_000);

    for (const journey of certifiedJourneys) {
      await gotoOk(page, journey.formulaRoute);
      await expectNoBrowserErrorSurface(page);
      await expect(page.locator(`a[href="${journey.theoremRoute}"]`).first(), journey.label).toBeVisible();
      await expect(page.locator(`a[href="${journey.visualProofRoute}"]`).first(), journey.label).toBeVisible();

      await gotoOk(page, journey.theoremRoute);
      await expectNoBrowserErrorSurface(page);
      await expect(page.locator("h1", { hasText: journey.theoremTitle }), journey.label).toBeVisible();
      await expect(page.getByText("Connected learning").first(), journey.label).toBeVisible();
      await expect(page.locator(`a[href="${journey.formulaRoute}"]`).first(), journey.label).toBeVisible();
      await expect(page.locator(`a[href="${journey.visualProofRoute}"]`).first(), journey.label).toBeVisible();

      await gotoOk(page, journey.visualProofRoute);
      await expectNoBrowserErrorSurface(page);
      await expectProofShell(page);
      await expectNonblankPrimaryVisual(page);
      await expect(page.getByText("Connected learning").first(), journey.label).toBeVisible();
      await expect(page.locator(`a[href="${journey.formulaRoute}"]`).first(), journey.label).toBeVisible();
      await expect(page.locator(`a[href="${journey.theoremRoute}"]`).first(), journey.label).toBeVisible();
    }
  });

  test("keeps proof explanation journey pages readable on narrow mobile", async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 360, height: 900 });

    for (const journey of certifiedJourneys) {
      for (const route of [journey.formulaRoute, journey.theoremRoute, journey.visualProofRoute]) {
        await gotoOk(page, route);
        await expectNoBrowserErrorSurface(page);

        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(horizontalOverflow, `${journey.label}: ${route}`).toBeLessThanOrEqual(4);
      }
    }
  });
});
