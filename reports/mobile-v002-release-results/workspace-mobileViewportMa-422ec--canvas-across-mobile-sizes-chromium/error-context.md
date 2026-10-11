# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileViewportMatrix.e2e.ts >> /workspace/3d keeps a bounded, usable canvas across mobile sizes
- Location: tests\workspace\mobileViewportMatrix.e2e.ts:14:3

# Error details

```
Error: Timeout 10000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - progressbar "Loading page"
  - complementary "Offline math assistant" [ref=e3]:
    - button "Ask Math · Offline" [ref=e4] [cursor=pointer]:
      - generic: Hi! I’m Ruhi
      - img [ref=e5]
  - generic "Loading" [ref=e61]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const portraits = [[320, 568], [360, 640], [375, 667], [390, 844], [393, 873], [412, 915], [430, 932]] as const;
  4  | const routes = [
  5  |   ["/workspace/graph", ".gs2d-scene-host > svg"],
  6  |   ["/math-lab/3d-graphing", ".gs3d-scene-host canvas"],
  7  |   ["/workspace/geometry", "[data-testid='workspace-geometry-board']"],
  8  |   ["/workspace/3d", ".os-canvas-zone canvas"],
  9  | ] as const;
  10 | 
  11 | test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  12 | 
  13 | for (const [route, canvasSelector] of routes) {
  14 |   test(`${route} keeps a bounded, usable canvas across mobile sizes`, async ({ page }) => {
  15 |     test.setTimeout(180_000);
  16 |     await page.goto(route);
  17 |     const canvas = page.locator(canvasSelector).first();
  18 |     await expect(canvas).toBeVisible({ timeout: 30_000 });
  19 |     for (const [width, height] of portraits) {
  20 |       for (const [w, h] of [[width, height], [height, width]]) {
  21 |         await page.setViewportSize({ width: w, height: h });
  22 |         await expect.poll(() => canvas.evaluate((element) => {
  23 |           const rect = element.getBoundingClientRect();
  24 |           return {
  25 |             width: rect.width,
  26 |             height: rect.height,
  27 |             overflow: document.documentElement.scrollWidth - innerWidth,
  28 |             visible: rect.right > 0 && rect.left < innerWidth && rect.bottom > 0 && rect.top < innerHeight,
  29 |           };
> 30 |         })).toMatchObject({ visible: true });
     |             ^ Error: Timeout 10000ms exceeded while waiting on the predicate
  31 |         const state = await canvas.evaluate((element) => {
  32 |           const rect = element.getBoundingClientRect();
  33 |           return { width: rect.width, height: rect.height, overflow: document.documentElement.scrollWidth - innerWidth };
  34 |         });
  35 |         const toolbar = page.locator('.mws-toolbar:visible, .geometry-mobile-tools:visible').first();
  36 |         await expect(toolbar).toBeVisible();
  37 |         const bounds = await toolbar.getByRole('button').evaluateAll(buttons => buttons.map(button => {
  38 |           const r = button.getBoundingClientRect();
  39 |           return { label: button.textContent, fits: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight, touchSize: r.width >= 44 && r.height >= 44 };
  40 |         }));
  41 |         for (const button of bounds) {
  42 |           expect(button.fits, `${route} ${button.label} at ${w}x${h}`).toBe(true);
  43 |           expect(button.touchSize, `${route} ${button.label} at ${w}x${h}`).toBe(true);
  44 |         }
  45 |         expect(state.overflow, `${route} at ${w}x${h}`).toBeLessThanOrEqual(4);
  46 |         expect(state.width, `${route} at ${w}x${h}`).toBeGreaterThan(200);
  47 |         expect(state.height, `${route} at ${w}x${h}`).toBeGreaterThan(180);
  48 |       }
  49 |     }
  50 |   });
  51 | }
  52 | 
```