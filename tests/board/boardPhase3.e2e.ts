import { expect, test } from "@playwright/test";

test("checks multi-line work, highlights the first error, and keeps tutor degraded safely", async ({ page }) => {
  const now = new Date().toISOString();
  await page.addInitScript(({ now }) => {
    localStorage.clear();
    localStorage.setItem("math-universe-board-draft", JSON.stringify({
      schemaVersion: 1,
      document: {
        id: "phase-3-board",
        title: "Guided equation solving",
        createdAt: now,
        updatedAt: now,
        viewport: { x: 0, y: 0, zoom: 1 },
        background: "grid",
        snapToGrid: false,
        elements: [
          { id: "line-1", type: "math-expression", latex: "3x+7=22", sourceStrokeIds: [], bounds: { x: 40, y: 40, width: 170, height: 54 }, createdAt: now, recognitionConfidence: 0.95 },
          { id: "line-2", type: "math-expression", latex: "3x=15", sourceStrokeIds: [], bounds: { x: 40, y: 120, width: 170, height: 54 }, createdAt: now, recognitionConfidence: 0.95 },
          { id: "line-3", type: "math-expression", latex: "x=6", sourceStrokeIds: [], bounds: { x: 40, y: 200, width: 170, height: 54 }, createdAt: now, recognitionConfidence: 0.95 },
        ],
        relationships: [],
        actionHistory: [],
        solutionSequences: [],
        tutorMessages: [],
        automaticRecognition: { mode: "manual", pauseMs: 1500, minimumStrokeCount: 2, disabledForSession: false },
      },
    }));
  }, { now });

  await page.goto(`/board?phase3=${Date.now()}`);
  await expect(page.getByRole("button", { name: "Tutor" })).toBeVisible();
  await page.getByRole("button", { name: "Select (V)" }).click();
  const canvas = page.getByTestId("board-canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Board canvas unavailable");
  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 260, box.y + 290);
  await page.mouse.up();

  await page.getByRole("button", { name: "Check my work" }).click();
  await expect(page.getByRole("region", { name: "Work verification result" })).toContainText("incorrect");
  await expect(page.getByRole("region", { name: "Work verification result" })).toContainText("Step 3: invalid");

  await page.getByRole("button", { name: "Tutor" }).click();
  await expect(page.getByTestId("board-tutor")).toContainText("Offline verified mode");

  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Board command palette" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Board" })).toBeEnabled();
  await page.getByRole("dialog", { name: "Board command palette" }).getByRole("button", { name: "Close command palette" }).click();

  await page.getByRole("button", { name: "Export" }).click();
  await expect(page.getByRole("button", { name: "Board JSON" })).toBeVisible();
  await expect(page.getByText("Account sharing is unavailable")).toBeVisible();
});
