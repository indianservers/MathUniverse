# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileEnhancements.e2e.ts >> mobile geometry numeric editing, duplicate placement, confirmed clear and undo
- Location: tests\workspace\mobileEnhancements.e2e.ts:11:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('workspace-geometry-board').locator('[data-point-id]')
Expected: 2
Received: 1
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" with timeout 10000ms
  - waiting for getByTestId('workspace-geometry-board').locator('[data-point-id]')
    23 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - progressbar "Loading page"
  - complementary "Offline math assistant" [ref=e3]:
    - button "Ask Math · Offline" [ref=e4] [cursor=pointer]:
      - generic: Hi! I’m Ruhi
      - img [ref=e5]
  - main [ref=e60]:
    - generic [ref=e65]:
      - generic [ref=e66]:
        - generic [ref=e67]:
          - generic [ref=e68]:
            - link "Home page" [ref=e69] [cursor=pointer]:
              - /url: /
              - img [ref=e70]
            - heading "2D Geometry Workspace" [level=1]
            - button "Rename project" [ref=e73] [cursor=pointer]:
              - img
          - paragraph [ref=e76]: Circle Theorem Exploration
        - generic [ref=e77]:
          - generic [ref=e78]:
            - button "AR" [ref=e79] [cursor=pointer]:
              - img [ref=e80]
            - button "Hand Gestures" [ref=e85] [cursor=pointer]:
              - img [ref=e86]
          - generic "Pane controls" [ref=e91]:
            - button "Reduce active pane" [ref=e92] [cursor=pointer]:
              - img [ref=e93]
            - button "Enlarge active pane" [ref=e94] [cursor=pointer]:
              - img [ref=e95]
            - button "Expand active pane" [ref=e96] [cursor=pointer]:
              - img [ref=e97]
          - button "Undo" [ref=e102] [cursor=pointer]:
            - img [ref=e103]
          - button "Redo" [ref=e106] [cursor=pointer]:
            - img [ref=e107]
          - button "Save" [ref=e110] [cursor=pointer]:
            - img [ref=e111]
          - button "Restore saved construction" [ref=e115] [cursor=pointer]:
            - img [ref=e116]
          - button "Load or import workspace file" [ref=e119] [cursor=pointer]:
            - img [ref=e120]
          - button "Export" [ref=e123] [cursor=pointer]:
            - img [ref=e124]
          - button "Workspace settings" [ref=e130] [cursor=pointer]:
            - img [ref=e131]
          - button "Share or export" [ref=e135] [cursor=pointer]:
            - img [ref=e136]
          - 'button "Theme: Light" [ref=e142] [cursor=pointer]':
            - img [ref=e143]
          - button "Open workspace panels" [ref=e149] [cursor=pointer]:
            - img [ref=e150]
      - main [ref=e151]:
        - generic [ref=e153]:
          - generic "Canvas navigation tools" [ref=e154]:
            - button "Select" [ref=e155] [cursor=pointer]:
              - img [ref=e156]
            - button "Pan" [ref=e158] [cursor=pointer]:
              - img [ref=e159]
          - generic "Canvas zoom controls" [ref=e164]:
            - button "Zoom in" [ref=e165] [cursor=pointer]:
              - img [ref=e166]
            - button "Zoom out" [ref=e169] [cursor=pointer]:
              - img [ref=e170]
            - button "Fit all objects" [ref=e173] [cursor=pointer]:
              - img [ref=e174]
            - button "Reset view" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
          - application "Geometry constructor. Select a point and use arrow keys to nudge it. Press Escape to return to select mode." [ref=e183]:
            - generic [ref=e185]:
              - generic [ref=e186]: "-7"
              - generic [ref=e187]: "-6"
              - generic [ref=e188]: "-5"
              - generic [ref=e189]: "-4"
              - generic [ref=e190]: "-3"
              - generic [ref=e191]: "-2"
              - generic [ref=e192]: "-1"
              - generic [ref=e193]: "1"
              - generic [ref=e194]: "2"
              - generic [ref=e195]: "3"
              - generic [ref=e196]: "4"
              - generic [ref=e197]: "5"
              - generic [ref=e198]: "6"
              - generic [ref=e199]: "7"
              - generic [ref=e200]: "5"
              - generic [ref=e201]: "4"
              - generic [ref=e202]: "3"
              - generic [ref=e203]: "2"
              - generic [ref=e204]: "1"
              - generic [ref=e205]: "-1"
              - generic [ref=e206]: "-2"
              - generic [ref=e207]: "-3"
              - generic [ref=e208]: "-4"
              - generic [ref=e209]: "0"
              - generic [ref=e210]: x
              - generic [ref=e211]: "y"
            - generic [ref=e212]:
              - generic: A
          - generic [ref=e214]: Drag points to explore · Shift for multi-select · Esc to clear
          - generic [ref=e215]: Touch mode supports direct manipulation with 44 pixel controls.
        - region "Selected object actions" [ref=e216]:
          - button "Move" [ref=e217] [cursor=pointer]:
            - img
            - text: Move
          - button "Size" [disabled] [ref=e222]:
            - img
            - text: Size
          - button "Size" [disabled] [ref=e223]:
            - img
            - text: Size
          - button "Trace" [ref=e224] [cursor=pointer]:
            - img
            - text: Trace
          - button "Lock" [ref=e227] [cursor=pointer]:
            - img
            - text: Lock
          - button "Hide" [ref=e230] [cursor=pointer]:
            - img
            - text: Hide
          - button "Delete" [ref=e235] [cursor=pointer]:
            - img
            - text: Delete
      - generic [ref=e238]:
        - button "Mobile controls" [ref=e239] [cursor=pointer]:
          - img [ref=e240]
          - generic [ref=e241]: Objects & tools
        - button "Undo mobile change" [ref=e242] [cursor=pointer]:
          - img [ref=e243]
        - button "Redo mobile change" [ref=e246] [cursor=pointer]:
          - img [ref=e247]
      - dialog "Mobile controls" [ref=e250]:
        - button "Expand panel" [ref=e251]
        - generic [ref=e252]:
          - heading "Mobile controls" [level=2] [ref=e253]
          - button "Close panel" [ref=e254] [cursor=pointer]: Close
        - generic [ref=e255]:
          - navigation "Mobile control sections" [ref=e256]:
            - button "Objects" [ref=e257] [cursor=pointer]
            - button "Add" [ref=e258] [cursor=pointer]
            - button "Edit" [pressed] [ref=e259] [cursor=pointer]
            - button "View" [ref=e260] [cursor=pointer]
            - button "Help" [ref=e261] [cursor=pointer]
          - generic [ref=e262]:
            - heading "Select an object" [level=3] [ref=e263]
            - generic [ref=e264]:
              - button "Move selected" [ref=e265] [cursor=pointer]
              - button "Resize larger" [ref=e266] [cursor=pointer]
              - button "Resize smaller" [ref=e267] [cursor=pointer]
              - button "Duplicate and place" [ref=e268] [cursor=pointer]
              - button "Delete selected" [ref=e269] [cursor=pointer]
            - generic [ref=e270] [cursor=pointer]:
              - text: Rotation angle degrees
              - spinbutton "Rotation angle degrees" [ref=e271]: "15"
            - button "Rotate selected by angle" [ref=e272] [cursor=pointer]
            - paragraph [ref=e273]: For constrained lengths and angles, choose Fixed length or Angle from construction tools.
            - generic [ref=e274]:
              - heading "Object Properties" [level=3] [ref=e276]
              - paragraph [ref=e277]: Select a point, line, circle, or polygon to modify x/y, size, color, visibility, lock, duplicate, restore, or delete.
      - navigation "Essential geometry tools" [ref=e278]:
        - button "Select" [pressed] [ref=e279] [cursor=pointer]:
          - img [ref=e280]
          - generic [ref=e282]: Select
        - button "Point" [ref=e283] [cursor=pointer]:
          - img [ref=e284]
          - generic [ref=e285]: Point
        - button "Line" [ref=e286] [cursor=pointer]:
          - img [ref=e287]
          - generic [ref=e289]: Line
        - button "Shape" [ref=e290] [cursor=pointer]:
          - img [ref=e291]
          - generic [ref=e293]: Shape
        - button "Measure" [ref=e294] [cursor=pointer]:
          - img [ref=e295]
          - generic [ref=e301]: Measure
        - button "Delete" [disabled] [ref=e302]:
          - img [ref=e303]
          - generic [ref=e306]: Delete
        - button "Undo geometry change" [ref=e307] [cursor=pointer]:
          - img [ref=e308]
          - generic [ref=e311]: Undo
        - button "Redo geometry change" [ref=e312] [cursor=pointer]:
          - img [ref=e313]
          - generic [ref=e316]: Redo
        - button "More" [ref=e317] [cursor=pointer]:
          - img [ref=e318]
          - generic [ref=e319]: More
      - generic [ref=e320]:
        - text: Offline
        - generic [ref=e322]: 60 FPS
        - generic [ref=e323]: 0 constraints
        - generic [ref=e324]: 1 points
        - button "Snap on" [ref=e325] [cursor=pointer]:
          - img [ref=e326]
          - text: Snap on
```

# Test source

```ts
  1  | import { expect, test, type Page } from "@playwright/test";
  2  | test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  3  | test.setTimeout(120000);
  4  | async function controls(page: Page, tab: string) {
  5  |   await page.getByRole("button", { name: "Mobile controls", exact: true }).tap();
  6  |   const panel = page.getByRole("dialog", { name: "Mobile controls", exact: true });
  7  |   await panel.getByRole("navigation", { name: "Mobile control sections" }).getByRole("button", { name: tab, exact: true }).tap();
  8  |   return panel;
  9  | }
  10 | 
  11 | test("mobile geometry numeric editing, duplicate placement, confirmed clear and undo", async ({ page }) => {
  12 |   await page.goto("/workspace/geometry", { waitUntil: "domcontentloaded" });
  13 |   const board = page.getByTestId("workspace-geometry-board");await expect(board).toBeVisible();
  14 |   await page.getByRole("navigation", { name: "Essential geometry tools" }).getByRole("button", { name: "Point", exact: true }).tap();
  15 |   const b = (await board.boundingBox())!;await page.touchscreen.tap(b.x + b.width * .5, b.y + b.height * .6);
  16 |   await expect(board.locator("[data-point-id]")).toHaveCount(1);
  17 |   const panel = await controls(page, "Objects");
  18 |   await panel.locator(".mws-object-row").first().getByRole("button").first().tap();
  19 |   const x = panel.getByRole("spinbutton", { name: "Point x coordinate", exact: true });await x.fill("2");await x.press("Tab");
  20 |   await expect(board.locator("[data-point-id]")).toHaveAttribute("cx", "400");
  21 |   await panel.getByRole("button", { name: "Duplicate and place", exact: true }).tap();
  22 |   await expect(board.locator("[data-point-id]")).toHaveCount(2);
  23 |   await page.touchscreen.tap(b.x + b.width * .7, b.y + b.height * .6);
  24 |   const again = await controls(page, "Objects");await again.getByRole("button", { name: "Clear all (2)", exact: true }).tap();
  25 |   const confirmation = page.getByRole("dialog", { name: "Clear workspace?" });await expect(confirmation).toContainText("2 objects");
  26 |   await confirmation.getByRole("button", { name: "Keep objects" }).tap();await expect(board.locator("[data-point-id]")).toHaveCount(2);
  27 |   await again.getByRole("button", { name: "Clear all (2)", exact: true }).tap();await confirmation.getByRole("button", { name: "Clear all objects", exact: true }).tap();
> 28 |   await expect(board.locator("[data-point-id]")).toHaveCount(0);await page.getByRole("button", { name: "Undo deletion", exact: true }).tap();await expect(board.locator("[data-point-id]")).toHaveCount(2);
     |                                                                                                                                                                                             ^ Error: expect(locator).toHaveCount(expected) failed
  29 | });
  30 | 
  31 | test("mobile graph math keyboard, templates, panel resizing and searchable locked objects", async ({ page }) => {
  32 |   await page.goto("/workspace/graph", { waitUntil: "domcontentloaded" });
  33 |   const panel = await controls(page, "Add");
  34 |   await panel.getByRole("button", { name: /Sine of x²/ }).tap();
  35 |   await expect(page.getByRole("textbox", { name: "Function 1", exact: true })).toHaveValue("sin(x^2)");
  36 |   await panel.getByRole("button", { name: "Expand panel" }).tap();await expect(panel).toHaveAttribute("data-expanded", "true");
  37 |   await panel.getByRole("navigation").getByRole("button", { name: "Objects", exact: true }).tap();
  38 |   await panel.getByRole("searchbox", { name: "Search objects" }).fill("sin(x^2)");await expect(panel.locator(".mws-object-row")).toHaveCount(1);
  39 |   await panel.locator(".mws-object-row").getByRole("button", { name: /Lock / }).tap();await expect(panel.locator(".mws-object-row").getByRole("button", { name: /Unlock / })).toBeVisible();
  40 |   await panel.locator(".mws-object-row").getByRole("button").first().tap();await expect(panel.getByRole("textbox", { name: "Mobile expression", exact: true })).toBeDisabled();
  41 | });
  42 | 
  43 | test("mobile solids preview, dimensions, axis controls, isolate and show all", async ({ page }) => {
  44 |   await page.goto("/workspace/3d", { waitUntil: "domcontentloaded" });
  45 |   const panel = await controls(page, "Add");await panel.getByRole("textbox", { name: "Mobile solid search" }).fill("cube");
  46 |   await panel.getByRole("button", { name: "Preview Cube", exact: true }).tap();await expect(panel.getByRole("button", { name: "Place previewed object" })).toBeVisible();
  47 |   const initial = await page.locator(".os-object-list > div").count();await panel.getByRole("button", { name: "Place previewed object" }).tap();await expect(page.locator(".os-object-list > div")).toHaveCount(initial + 1);
  48 |   const edit = page.getByRole("dialog", { name: "Mobile controls", exact: true });await edit.getByRole("navigation").getByRole("button", { name: "Edit", exact: true }).tap();
  49 |   const dimension = edit.getByRole("spinbutton", { name: "X dimension", exact: true });await dimension.fill("2");await dimension.press("Tab");await expect(dimension).toHaveValue("2");
  50 |   await edit.getByRole("button", { name: "Z axis", exact: true }).tap();await expect(edit.getByRole("button", { name: "Z axis", exact: true })).toHaveAttribute("aria-pressed", "true");
  51 |   await edit.getByRole("navigation").getByRole("button", { name: "View", exact: true }).tap();await edit.getByRole("button", { name: "Isolate selected" }).tap();
  52 |   await edit.getByRole("button", { name: "Show all", exact: true }).tap();await edit.getByRole("button", { name: "Fit selection", exact: true }).tap();
  53 |   await expect(page.locator("canvas").first()).toBeVisible();
  54 | });
  55 | 
  56 | test("mobile 3D graph quality, slices, style and multi-object deletion", async ({ page }) => {
  57 |   await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
  58 |   const panel = await controls(page, "View");await panel.getByRole("combobox", { name: "Mobile rendering quality" }).selectOption("fast");
  59 |   await panel.getByRole("button", { name: "Z slice", exact: true }).tap();await panel.getByRole("spinbutton", { name: "Slice coordinate", exact: true }).fill("1");await panel.getByRole("spinbutton", { name: "Slice coordinate", exact: true }).press("Tab");
  60 |   await expect(panel.getByRole("button", { name: "Z slice", exact: true })).toHaveAttribute("aria-pressed", "true");
  61 |   await panel.getByRole("navigation").getByRole("button", { name: "Add", exact: true }).tap();await panel.getByRole("button", { name: "Add explicit", exact: true }).tap();
  62 |   await expect(page.locator(".gs3d-expression")).toHaveCount(2);
  63 |   await panel.getByRole("navigation").getByRole("button", { name: "Objects", exact: true }).tap();await panel.getByRole("button", { name: "Mark all results" }).tap();await panel.getByRole("button", { name: "Delete marked" }).tap();
  64 |   await expect(page.locator(".gs3d-expression")).toHaveCount(0);await page.getByRole("button", { name: "Undo deletion", exact: true }).tap();await expect(page.locator(".gs3d-expression")).toHaveCount(2);
  65 | });
  66 | 
  67 | for (const route of ["/workspace/geometry", "/workspace/3d", "/workspace/graph", "/math-lab/3d-graphing"]) {
  68 |   test(`desktop ${route} does not render mobile enhancement controls`, async ({ page }) => {
  69 |     await page.setViewportSize({ width: 1440, height: 900 });await page.goto(route, { waitUntil: "domcontentloaded" });
  70 |     await expect(page.locator('.mws-root[data-mws-mobile="false"]')).toBeVisible();
  71 |     await expect(page.getByRole("button", { name: "Mobile controls", exact: true })).toHaveCount(0);
  72 |     await expect(page.locator(".mws-toolbar:visible,.geometry-mobile-tools:visible")).toHaveCount(0);
  73 |   });
  74 | }
  75 | 
```