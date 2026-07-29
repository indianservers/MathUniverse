import { expect, test } from "@playwright/test";

test("classify algebra, run CAS actions, graph, and persist relationships", async ({ page }) => {
  await page.goto("/board");
  const canvas = page.getByTestId("board-canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Board canvas has no bounds");
  await page.mouse.move(box.x + 70, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 130, { steps: 8 });
  await page.mouse.up();
  await page.getByRole("button", { name: /^Recognize/ }).click();
  await expect(page.getByText("Recognition ready for review")).toBeVisible();
  await page.getByLabel("Editable recognized LaTeX").fill("x^2-5x+6");
  await page.getByRole("button", { name: "Apply correction", exact: true }).click();
  await page.getByRole("button", { name: "Insert into board", exact: true }).click();

  await expect(page.getByRole("button", { name: "Factor", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Find roots", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Draw graph", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Factor", exact: true }).click();
  const results = page.locator("[data-testid^='board-result-']");
  await expect(results).toHaveCount(1);
  await expect(results).toContainText(/x\s*-\s*2|x\s*-\s*3/);
  await results.nth(0).getByText("Factor", { exact: true }).click();

  await page.getByRole("button", { name: "Find roots", exact: true }).click();
  await expect(results).toHaveCount(2);
  await results.nth(1).getByText("Find roots", { exact: true }).click();
  await page.getByRole("button", { name: "Draw graph", exact: true }).click();
  await expect(results).toHaveCount(3);
  await expect(page.getByRole("img", { name: "Interactive function graph" })).toBeVisible();

  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.reload();
  await expect(results).toHaveCount(3);
});
