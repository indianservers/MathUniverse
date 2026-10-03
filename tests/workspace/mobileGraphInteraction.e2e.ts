import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

test("2D graph keeps a usable canvas through creation, gestures, deletion, and resize", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/workspace/graph");
  const root = page.locator(".graph-studio-2d-shell");
  await expect(root).toBeVisible();
  const graph = page.getByRole("img", { name: /Interactive function graph/ });
  await expect(graph).toBeVisible();
  const dimensions = await graph.evaluate((svg: SVGSVGElement) => {
    const box = svg.getBoundingClientRect();
    const view = svg.viewBox.baseVal;
    return { box: { width: box.width, height: box.height }, view: { width: view.width, height: view.height } };
  });
  expect(dimensions.box.width).toBeGreaterThan(300);
  expect(dimensions.box.height).toBeGreaterThan(500);
  expect(dimensions.view.width).toBeCloseTo(dimensions.box.width, 0);
  expect(dimensions.view.height).toBeCloseTo(dimensions.box.height, 0);

  await page.getByRole("button", { name: "Expressions menu" }).click();
  await expect(page.getByRole("complementary", { name: "Expressions and layers" })).toBeVisible();
  await page.getByRole("textbox", { name: "Function 1", exact: true }).fill("x");
  await page.getByRole("textbox", { name: "Function 2", exact: true }).fill("-x");
  await page.getByRole("button", { name: "Collapse Expressions & Layers" }).click();
  await expect(root).toHaveAttribute("data-mws-overlay", "");
  await expect(graph).toBeVisible();
  await expect.poll(() => graph.evaluate((svg: SVGSVGElement) => svg.viewBox.baseVal.height)).toBeGreaterThan(500);

  const before = await graph.locator("polyline").first().getAttribute("points");
  const box = await graph.boundingBox();
  expect(box).toBeTruthy();
  await page.mouse.move(box!.x + box!.width * 0.5, box!.y + box!.height * 0.35);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.65, box!.y + box!.height * 0.45, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => graph.locator("polyline").first().getAttribute("points")).not.toBe(before);

  const beforePinch = await graph.locator("polyline").first().getAttribute("points");
  const cdp = await page.context().newCDPSession(page);
  const y = box!.y + box!.height * 0.3;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 120, y, id: 1 }, { x: 240, y, id: 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 80, y, id: 1 }, { x: 280, y, id: 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => graph.locator("polyline").first().getAttribute("points")).not.toBe(beforePinch);

  await page.getByRole("button", { name: "Expressions menu" }).click();
  await page.getByRole("button", { name: "Expression options" }).nth(1).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Function 2", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Expression options" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.locator(".gs2d-expression")).toHaveCount(0);
  await expect(graph).toBeVisible();
  await page.getByRole("button", { name: "Add expression" }).first().click();
  await expect(page.getByRole("textbox", { name: "Function 1", exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Function 1", exact: true }).fill("x^2");
  await page.getByRole("button", { name: "Clear all graphs" }).first().click();
  await expect(page.locator(".gs2d-expression")).toHaveCount(0);
  await page.getByRole("button", { name: "Collapse Expressions & Layers" }).click();
  const toolbar = page.getByRole("navigation", { name: "Graph workspace tools" });
  await toolbar.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).last().click();
  await expect(page.locator(".gs2d-expression")).toHaveCount(1);
  await toolbar.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Redo", exact: true }).last().click();
  await expect(page.locator(".gs2d-expression")).toHaveCount(0);
  await page.getByRole("button", { name: "Expressions menu" }).click();
  await page.getByRole("button", { name: "Add expression" }).first().click();
  await page.getByRole("textbox", { name: "Function 1", exact: true }).fill("sin(x)");
  await expect(page.locator(".gs2d-expression")).toHaveCount(1);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(() => graph.evaluate((svg: SVGSVGElement) => svg.viewBox.baseVal.width)).toBeGreaterThan(700);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => graph.evaluate((svg: SVGSVGElement) => svg.viewBox.baseVal.height)).toBeGreaterThan(500);
});

test("2D graph intersections update when expressions change or are removed", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/workspace/graph");
  const graph = page.getByRole("img", { name: /Interactive function graph/ });
  await expect(graph).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Expressions menu" }).click();
  await page.getByRole("textbox", { name: "Function 1", exact: true }).fill("x");
  await page.getByRole("textbox", { name: "Function 2", exact: true }).fill("-x");
  await expect(graph.locator('g[aria-label^="intersection at"]')).toHaveCount(1);
  await expect(graph.locator('g[aria-label^="intersection at"]')).toHaveAttribute("aria-label", /intersection at 0, 0/);
  await page.getByRole("textbox", { name: "Function 1", exact: true }).fill("x^2");
  await page.getByRole("textbox", { name: "Function 2", exact: true }).fill("4");
  await expect(graph.locator('g[aria-label^="intersection at"]')).toHaveCount(2);
  const labels = await graph.locator('g[aria-label^="intersection at"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label")));
  expect(labels).toContain("intersection at -2, 4");
  expect(labels).toContain("intersection at 2, 4");
  const leftIntersection = graph.getByRole("button", { name: "intersection at -2, 4" });
  const rightIntersection = graph.getByRole("button", { name: "intersection at 2, 4" });
  expect((await leftIntersection.boundingBox())!.width).toBeGreaterThanOrEqual(42);
  await leftIntersection.tap();
  await expect(leftIntersection).toHaveAttribute("aria-pressed", "true");
  await rightIntersection.tap();
  await expect(rightIntersection).toHaveAttribute("aria-pressed", "true");
  await expect(leftIntersection).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Expressions menu" }).click();
  await page.getByRole("button", { name: "Expression options" }).nth(1).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(graph.locator('g[aria-label^="intersection at"]')).toHaveCount(0);
});


test("touch editing accepts y powers without uncaught exceptions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/workspace/graph");
  await page.getByRole("button", { name: "Expressions menu" }).click();
  const input = page.getByRole("textbox", { name: "Function 1", exact: true });
  await input.tap();
  await input.fill("Y^2");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await input.fill("Y^2=X");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await input.fill("Y^");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.fill("x=Y\u00b2");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await page.getByRole("button", { name: "Collapse Expressions & Layers" }).tap();
  await expect(page.getByRole("img", { name: /Interactive function graph/ })).toBeVisible();
  expect(errors).toEqual([]);
});


test("mobile built-in functions and unfinished input recover without sliders", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/workspace/graph");
  await page.getByRole("button", { name: "Expressions menu" }).tap();
  const input = page.getByRole("textbox", { name: "Function 1", exact: true });
  for (const expression of ["exp(x)", "sec(x)", "sinc(x)", "x=2y", "-x^2"]) {
    await input.fill(expression);
    await expect(input).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator(".gs3d-variable")).toHaveCount(0);
  }
  await input.fill("sin()");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.fill("exp(-x^2)");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  expect(errors).toEqual([]);
});
