# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileEnhancements.e2e.ts >> mobile graph math keyboard, templates, panel resizing and searchable locked objects
- Location: tests\workspace\mobileEnhancements.e2e.ts:31:1

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.tap: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Mobile controls', exact: true }).locator('.mws-object-row').getByRole('button', { name: /Lock / })
    - locator resolved to <button type="button" aria-label="Lock sin(x^2)">…</button>
  - attempting tap action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg aria-hidden="true" viewBox="0 0 140 160" data-action="pointGraph" data-expression="teaching" class="math-robo articulated-robo">…</svg> from <aside class="offline-assistant " aria-label="Offline math assistant">…</aside> subtree intercepts pointer events
    - retrying tap action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg aria-hidden="true" viewBox="0 0 140 160" data-action="pointGraph" data-expression="teaching" class="math-robo articulated-robo">…</svg> from <aside class="offline-assistant " aria-label="Offline math assistant">…</aside> subtree intercepts pointer events
    - retrying tap action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <svg aria-hidden="true" viewBox="0 0 140 160" data-action="pointGraph" data-expression="teaching" class="math-robo articulated-robo">…</svg> from <aside class="offline-assistant " aria-label="Offline math assistant">…</aside> subtree intercepts pointer events
  5 × retrying tap action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg aria-hidden="true" data-action="idle" viewBox="0 0 140 160" data-expression="listening" class="math-robo articulated-robo">…</svg> from <aside class="offline-assistant " aria-label="Offline math assistant">…</aside> subtree intercepts pointer events
  - retrying tap action
    - waiting 500ms
  - element was detached from the DOM, retrying

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
    - region "Scrollable graph workspace" [ref=e62]:
      - generic [ref=e64]:
        - generic [ref=e65]:
          - generic [ref=e67]: MU
          - button "My Function Study" [ref=e69] [cursor=pointer]:
            - generic [ref=e70]: My Function Study
            - img [ref=e71]
          - generic [ref=e74]:
            - generic [ref=e75]:
              - button "AR" [ref=e76] [cursor=pointer]:
                - img [ref=e77]
              - button "Hand Gestures" [ref=e82] [cursor=pointer]:
                - img [ref=e83]
            - generic "Graph view controls" [ref=e88]:
              - generic [ref=e89]: Cartesian
              - button "Zoom in" [ref=e90] [cursor=pointer]:
                - img [ref=e91]
              - button "Zoom out" [ref=e94] [cursor=pointer]:
                - img [ref=e95]
              - button "Fit visible graphs" [ref=e98] [cursor=pointer]:
                - img [ref=e99]
              - button "Reset to default window" [ref=e105] [cursor=pointer]:
                - img [ref=e106]
              - button "View graph full screen" [ref=e109] [cursor=pointer]:
                - img [ref=e110]
            - 'button "Theme: Dark" [ref=e115] [cursor=pointer]':
              - img [ref=e116]
          - button "Expressions menu" [ref=e118] [cursor=pointer]:
            - img [ref=e119]
        - main [ref=e120]:
          - img "Interactive function graph. Trace point x -0.044, y -3.998" [ref=e122]:
            - generic [ref=e124]: x
            - generic [ref=e125]: "y"
            - generic [ref=e126]:
              - generic [ref=e127]: "-10"
              - generic [ref=e128]: "-9"
              - generic [ref=e129]: "-8"
              - generic [ref=e130]: "-7"
              - generic [ref=e131]: "-6"
              - generic [ref=e132]: "-5"
              - generic [ref=e133]: "-4"
              - generic [ref=e134]: "-3"
              - generic [ref=e135]: "-2"
              - generic [ref=e136]: "-1"
              - generic [ref=e137]: "1"
              - generic [ref=e138]: "2"
              - generic [ref=e139]: "3"
              - generic [ref=e140]: "4"
              - generic [ref=e141]: "5"
              - generic [ref=e142]: "6"
              - generic [ref=e143]: "7"
              - generic [ref=e144]: "8"
              - generic [ref=e145]: "9"
              - generic [ref=e146]: "10"
              - generic [ref=e147]: "-10"
              - generic [ref=e148]: "-8"
              - generic [ref=e149]: "-6"
              - generic [ref=e150]: "-4"
              - generic [ref=e151]: "-2"
              - generic [ref=e152]: "2"
              - generic [ref=e153]: "4"
              - generic [ref=e154]: "6"
              - generic [ref=e155]: "8"
              - generic [ref=e156]: "10"
            - button "root at -2, 0" [ref=e162] [cursor=pointer]
            - button "root at 2, 0" [ref=e164] [cursor=pointer]
            - button "intercept at 0, -4" [ref=e166] [cursor=pointer]
            - button "minimum at -0.044, -3.998" [ref=e168] [cursor=pointer]
            - button "intersection at -1.736, -0.986" [ref=e170] [cursor=pointer]
            - button "intersection at 2.193, 0.812" [ref=e172] [cursor=pointer]
            - generic [ref=e176]:
              - generic [ref=e178]: x^2 - 4
              - generic [ref=e179]: x=-0.044444, y=-3.998025
          - generic [ref=e180]:
            - generic [ref=e181]:
              - strong [ref=e182]: f • Function
              - text: x^2 - 4
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - term [ref=e185]: x min
                  - definition [ref=e186]: "-10"
                - generic [ref=e187]:
                  - term [ref=e188]: x max
                  - definition [ref=e189]: "10"
            - generic [ref=e190]:
              - button "Style" [ref=e191] [cursor=pointer]
              - button "Lock" [ref=e192] [cursor=pointer]
              - button "More" [ref=e193] [cursor=pointer]
        - generic [ref=e194]:
          - button "Mobile controls" [ref=e195] [cursor=pointer]:
            - img [ref=e196]
            - generic [ref=e197]: Objects & tools
          - button "Undo mobile change" [disabled] [ref=e198]:
            - img [ref=e199]
          - button "Redo mobile change" [disabled] [ref=e202]:
            - img [ref=e203]
        - navigation "Graph workspace tools" [ref=e206]:
          - button "Delete" [ref=e207] [cursor=pointer]:
            - img [ref=e209]
            - generic [ref=e212]: Delete
          - button "Zoom in" [ref=e213] [cursor=pointer]:
            - img [ref=e215]
            - generic [ref=e218]: Zoom in
          - button "Zoom out" [ref=e219] [cursor=pointer]:
            - img [ref=e221]
            - generic [ref=e224]: Zoom out
          - button "Reset view" [ref=e225] [cursor=pointer]:
            - img [ref=e227]
            - generic [ref=e230]: Reset view
          - button "Expression" [ref=e231] [cursor=pointer]:
            - img [ref=e233]
            - generic [ref=e234]: Expression
          - button "Point" [ref=e235] [cursor=pointer]:
            - img [ref=e237]
            - generic [ref=e239]: Point
          - button "Trace" [pressed] [ref=e240] [cursor=pointer]:
            - img [ref=e242]
            - generic [ref=e244]: Trace
          - button "Zoom" [ref=e245] [cursor=pointer]:
            - img [ref=e247]
            - generic [ref=e250]: Zoom
          - button "More" [ref=e251] [cursor=pointer]:
            - img [ref=e253]
            - generic [ref=e257]: More
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
  28 |   await expect(board.locator("[data-point-id]")).toHaveCount(0);await page.getByRole("button", { name: "Undo deletion", exact: true }).tap();await expect(board.locator("[data-point-id]")).toHaveCount(2);
  29 | });
  30 | 
  31 | test("mobile graph math keyboard, templates, panel resizing and searchable locked objects", async ({ page }) => {
  32 |   await page.goto("/workspace/graph", { waitUntil: "domcontentloaded" });
  33 |   const panel = await controls(page, "Add");
  34 |   await panel.getByRole("button", { name: /Sine of x²/ }).tap();
  35 |   await expect(page.getByRole("textbox", { name: "Function 1", exact: true, includeHidden: true })).toHaveValue("sin(x^2)");
  36 |   await panel.getByRole("button", { name: "Expand panel" }).tap();await expect(panel).toHaveAttribute("data-expanded", "true");
  37 |   await panel.getByRole("navigation").getByRole("button", { name: "Objects", exact: true }).tap();
  38 |   await panel.getByRole("searchbox", { name: "Search objects" }).fill("sin(x^2)");await expect(panel.locator(".mws-object-row")).toHaveCount(1);
> 39 |   await panel.locator(".mws-object-row").getByRole("button", { name: /Lock / }).tap();await expect(panel.locator(".mws-object-row").getByRole("button", { name: /Unlock / })).toBeVisible();
     |                                                                                 ^ Error: locator.tap: Test timeout of 120000ms exceeded.
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
  67 | test("mobile background rendering can be cancelled and rebuilt", async ({page}) => {
  68 |   await page.route("**/mobileGraphSampling.worker.ts*",async route=>{await new Promise(resolve=>setTimeout(resolve,2000));await route.continue().catch(()=>{});});
  69 |   await page.goto("/math-lab/3d-graphing",{waitUntil:"domcontentloaded"});
  70 |   await page.getByRole("button",{name:"Cancel rendering",exact:true}).tap();
  71 |   await expect(page.locator(".mws-progress")).toContainText("Rendering cancelled");
  72 |   await expect(page.locator("canvas").first()).toBeVisible();
  73 |   await page.unroute("**/mobileGraphSampling.worker.ts*");await page.getByRole("button",{name:"Retry rendering",exact:true}).tap();
  74 |   await expect(page.locator(".graph-studio-3d-shell")).toHaveAttribute("data-mobile-rendering","ready",{timeout:60000});
  75 |   await expect(page.locator(".mws-progress")).toHaveCount(0);
  76 | });
  77 | 
  78 | for (const route of ["/workspace/geometry", "/workspace/3d", "/workspace/graph", "/math-lab/3d-graphing"]) {
  79 |   test(`desktop ${route} does not render mobile enhancement controls`, async ({ page }) => {
  80 |     await page.setViewportSize({ width: 1440, height: 900 });await page.goto(route, { waitUntil: "domcontentloaded" });
  81 |     await expect(page.locator('.mws-root[data-mws-mobile="false"]')).toBeVisible();
  82 |     await expect(page.getByRole("button", { name: "Mobile controls", exact: true })).toHaveCount(0);
  83 |     await expect(page.locator(".mws-toolbar:visible,.geometry-mobile-tools:visible")).toHaveCount(0);
  84 |   });
  85 | }
  86 | 
```