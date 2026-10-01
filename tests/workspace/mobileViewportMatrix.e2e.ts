import { expect, test } from "@playwright/test";

const portraits = [[320, 568], [360, 640], [375, 667], [390, 844], [393, 873], [412, 915], [430, 932]] as const;
const routes = [
  ["/workspace/graph", ".gs2d-scene-host > svg"],
  ["/math-lab/3d-graphing", ".gs3d-scene-host canvas"],
  ["/workspace/geometry", "[data-testid='workspace-geometry-board']"],
  ["/workspace/3d", ".os-canvas-zone canvas"],
] as const;

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

for (const [route, canvasSelector] of routes) {
  test(`${route} keeps a bounded, usable canvas across mobile sizes`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto(route);
    const canvas = page.locator(canvasSelector).first();
    await expect(canvas).toBeVisible({ timeout: 30_000 });
    for (const [width, height] of portraits) {
      for (const [w, h] of [[width, height], [height, width]]) {
        await page.setViewportSize({ width: w, height: h });
        await expect.poll(() => canvas.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            overflow: document.documentElement.scrollWidth - innerWidth,
            visible: rect.right > 0 && rect.left < innerWidth && rect.bottom > 0 && rect.top < innerHeight,
          };
        })).toMatchObject({ visible: true });
        const state = await canvas.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return { width: rect.width, height: rect.height, overflow: document.documentElement.scrollWidth - innerWidth };
        });
        expect(state.overflow, `${route} at ${w}x${h}`).toBeLessThanOrEqual(4);
        expect(state.width, `${route} at ${w}x${h}`).toBeGreaterThan(200);
        expect(state.height, `${route} at ${w}x${h}`).toBeGreaterThan(180);
      }
    }
  });
}
