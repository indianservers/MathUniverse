import { expect, test, type Page } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
test.setTimeout(120000);
async function controls(page: Page, tab: string) {
  await page.getByRole("button", { name: "Mobile controls", exact: true }).tap();
  const panel = page.getByRole("dialog", { name: "Mobile controls", exact: true });
  await panel.getByRole("navigation", { name: "Mobile control sections" }).getByRole("button", { name: tab, exact: true }).tap();
  return panel;
}

test("mobile geometry numeric editing, duplicate placement, confirmed clear and undo", async ({ page }) => {
  await page.goto("/workspace/geometry", { waitUntil: "domcontentloaded" });
  const board = page.getByTestId("workspace-geometry-board");await expect(board).toBeVisible();
  await page.getByRole("navigation", { name: "Essential geometry tools" }).getByRole("button", { name: "Point", exact: true }).tap();
  const b = (await board.boundingBox())!;await page.touchscreen.tap(b.x + b.width * .5, b.y + b.height * .6);
  await expect(board.locator("[data-point-id]")).toHaveCount(1);
  const panel = await controls(page, "Objects");
  await panel.locator(".mws-object-row").first().getByRole("button").first().tap();
  const x = panel.getByRole("spinbutton", { name: "Point x coordinate", exact: true });await x.fill("2");await x.press("Tab");
  await expect(board.locator("[data-point-id]")).toHaveAttribute("cx", "400");
  await panel.getByRole("button", { name: "Duplicate and place", exact: true }).tap();
  await expect(board.locator("[data-point-id]")).toHaveCount(2);
  await page.touchscreen.tap(b.x + b.width * .7, b.y + b.height * .6);
  const again = await controls(page, "Objects");await again.getByRole("button", { name: "Clear all (2)", exact: true }).tap();
  const confirmation = page.getByRole("dialog", { name: "Clear workspace?" });await expect(confirmation).toContainText("2 objects");
  await confirmation.getByRole("button", { name: "Keep objects" }).tap();await expect(board.locator("[data-point-id]")).toHaveCount(2);
  await again.getByRole("button", { name: "Clear all (2)", exact: true }).tap();await confirmation.getByRole("button", { name: "Clear all objects", exact: true }).tap();
  await expect(board.locator("[data-point-id]")).toHaveCount(0);await page.getByRole("button", { name: "Undo deletion", exact: true }).tap();await expect(board.locator("[data-point-id]")).toHaveCount(2);
});

test("mobile graph math keyboard, templates, panel resizing and searchable locked objects", async ({ page }) => {
  await page.goto("/workspace/graph", { waitUntil: "domcontentloaded" });
  const panel = await controls(page, "Add");
  await panel.getByRole("button", { name: /Sine of x²/ }).tap();
  await expect(page.locator('input[aria-label="Function 1"]')).toHaveValue("sin(x^2)");
  await panel.getByRole("button", { name: "Expand panel" }).tap();await expect(panel).toHaveAttribute("data-expanded", "true");
  await panel.getByRole("navigation").getByRole("button", { name: "Objects", exact: true }).tap();
  await panel.getByRole("searchbox", { name: "Search objects" }).fill("sin(x^2)");await expect(panel.locator(".mws-object-row")).toHaveCount(1);
  await panel.locator(".mws-object-row").getByRole("button", { name: /Lock / }).tap();await expect(panel.locator(".mws-object-row").getByRole("button", { name: /Unlock / })).toBeVisible();
  await panel.locator(".mws-object-row").getByRole("button").first().tap();await expect(panel.getByRole("textbox", { name: "Mobile expression", exact: true })).toBeDisabled();
});

test("mobile solids preview, dimensions, axis controls, isolate and show all", async ({ page }) => {
  await page.goto("/workspace/3d", { waitUntil: "domcontentloaded" });
  const panel = await controls(page, "Add");await panel.getByRole("textbox", { name: "Mobile solid search" }).fill("cube");
  await panel.getByRole("button", { name: "Preview Cube", exact: true }).tap();await expect(panel.getByRole("button", { name: "Place previewed object" })).toBeVisible();
  const initial = await page.locator(".os-object-list > div").count();await panel.getByRole("button", { name: "Place previewed object" }).tap();await expect(page.locator(".os-object-list > div")).toHaveCount(initial + 1);
  const edit = page.getByRole("dialog", { name: "Mobile controls", exact: true });await edit.getByRole("navigation").getByRole("button", { name: "Edit", exact: true }).tap();
  const dimension = edit.getByRole("spinbutton", { name: "X dimension", exact: true });await dimension.fill("2");await dimension.press("Tab");await expect(dimension).toHaveValue("2");
  await edit.getByRole("button", { name: "Z axis", exact: true }).tap();await expect(edit.getByRole("button", { name: "Z axis", exact: true })).toHaveAttribute("aria-pressed", "true");
  await edit.getByRole("navigation").getByRole("button", { name: "View", exact: true }).tap();await edit.getByRole("button", { name: "Isolate selected" }).tap();
  await edit.getByRole("button", { name: "Show all", exact: true }).tap();await edit.getByRole("button", { name: "Fit selection", exact: true }).tap();
  await expect(page.locator("canvas").first()).toBeVisible();
});

test("mobile 3D graph quality, slices, style and multi-object deletion", async ({ page }) => {
  await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
  const panel = await controls(page, "View");await panel.getByRole("combobox", { name: "Mobile rendering quality" }).selectOption("fast");
  await panel.getByRole("button", { name: "Z slice", exact: true }).tap();await panel.getByRole("spinbutton", { name: "Slice coordinate", exact: true }).fill("1");await panel.getByRole("spinbutton", { name: "Slice coordinate", exact: true }).press("Tab");
  await expect(panel.getByRole("button", { name: "Z slice", exact: true })).toHaveAttribute("aria-pressed", "true");
  await panel.getByRole("navigation").getByRole("button", { name: "Add", exact: true }).tap();await panel.getByRole("button", { name: "Add explicit", exact: true }).tap();
  await expect(page.locator(".gs3d-expression")).toHaveCount(2);
  await panel.getByRole("navigation").getByRole("button", { name: "Objects", exact: true }).tap();await panel.getByRole("button", { name: "Mark all results" }).tap();await panel.getByRole("button", { name: "Delete marked" }).tap();
  await expect(page.locator(".gs3d-expression")).toHaveCount(0);await page.getByRole("button", { name: "Undo deletion", exact: true }).tap();await expect(page.locator(".gs3d-expression")).toHaveCount(2);
});

test("mobile background rendering can be cancelled and rebuilt", async ({page}) => {
  await page.route("**/mobileGraphSampling.worker.ts*",async route=>{await new Promise(resolve=>setTimeout(resolve,2000));await route.continue().catch(()=>{});});
  await page.goto("/math-lab/3d-graphing",{waitUntil:"domcontentloaded"});
  await page.getByRole("button",{name:"Cancel rendering",exact:true}).tap();
  await expect(page.locator(".mws-progress")).toContainText("Rendering cancelled");
  await expect(page.locator("canvas").first()).toBeVisible();
  await page.unroute("**/mobileGraphSampling.worker.ts*");await page.getByRole("button",{name:"Retry rendering",exact:true}).tap();
  await expect(page.locator(".graph-studio-3d-shell")).toHaveAttribute("data-mobile-rendering","ready",{timeout:60000});
  await expect(page.locator(".mws-progress")).toHaveCount(0);
});

for (const route of ["/workspace/geometry", "/workspace/3d", "/workspace/graph", "/math-lab/3d-graphing"]) {
  test(`desktop ${route} does not render mobile enhancement controls`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator('.mws-root[data-mws-mobile="false"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Mobile controls", exact: true })).toHaveCount(0);
    await expect(page.locator(".mws-toolbar:visible,.geometry-mobile-tools:visible")).toHaveCount(0);
  });
}
