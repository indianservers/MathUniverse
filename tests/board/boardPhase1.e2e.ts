import { expect, test } from "@playwright/test";

test("draw, recognize, correct, insert, save, and recover a Board", async ({ page }) => {
  await page.goto("/board");
  const canvas = page.getByTestId("board-canvas");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Board canvas has no bounds");
  await page.mouse.move(box.x + 80, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 150, { steps: 8 });
  await page.mouse.up();
  await expect(canvas).toHaveAttribute("data-stroke-count", "1");
  await page.getByRole("button", { name: /select \(v\)/i }).click();
  await page.mouse.move(box.x + 60, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 180, box.y + 180, { steps: 4 });
  await page.mouse.up();
  await page.getByRole("button", { name: /^recognize/i }).click();
  await expect(page.getByText(/recognition ready/i)).toBeVisible();
  const editor = page.getByLabel("Editable recognized LaTeX");
  await editor.fill("x+2=4");
  await page.getByRole("button", { name: /apply correction/i }).click();
  await page.getByRole("button", { name: /insert into board/i }).click();
  await page.getByRole("button", { name: /save/i }).click();
  await page.reload();
  await expect(page.getByText(/2 elements/)).toBeVisible();
});

test("pen draws a visible stroke on the dark Smart Board canvas", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/board");
  const canvas = page.getByTestId("board-canvas");
  await expect(canvas).toHaveAttribute("data-active-tool", "pen");
  await expect(canvas).toHaveAttribute("data-ink-color", "#f8fafc");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Board canvas has no bounds");

  await page.mouse.move(box.x + 90, box.y + 110);
  await page.mouse.down();
  await page.mouse.move(box.x + 210, box.y + 170, { steps: 12 });
  await page.mouse.up();

  await expect(canvas).toHaveAttribute("data-stroke-count", "1");
  await expect.poll(async () => canvas.evaluate((node) => {
    const canvasElement = node as HTMLCanvasElement;
    const context = canvasElement.getContext("2d");
    if (!context) return 0;
    const data = context.getImageData(0, 0, canvasElement.width, canvasElement.height).data;
    let count = 0;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index] > 220 && data[index + 1] > 220 && data[index + 2] > 220 && data[index + 3] > 180) count += 1;
    }
    return count;
  })).toBeGreaterThan(20);
});
