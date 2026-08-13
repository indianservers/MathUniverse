# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\geometryCommandBoundary.e2e.ts >> Geometry command-boundary regression >> delete and transform commands fail safely with no geometry selection
- Location: tests\workspace\geometryCommandBoundary.e2e.ts:55:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('workspace-safety-status')
Expected substring: "Delete selection is not supported"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for getByTestId('workspace-safety-status')

```

```yaml
- progressbar "Loading page"
- main:
  - link "Math Workspaces home":
    - /url: /workspace
    - img
    - strong: Math Workspaces
    - text: Six connected studios
  - navigation "Workspace tools":
    - link "Home":
      - /url: /workspace
      - img
      - text: Home
    - link "CAS":
      - /url: /workspace/data
      - img
      - text: CAS
    - link "2D Geometry":
      - /url: /workspace/geometry
      - img
      - text: 2D Geometry
    - link "3D Geometry":
      - /url: /workspace/3d
      - img
      - text: 3D Geometry
    - link "Graphs":
      - /url: /workspace/graph
      - img
      - text: Graphs
    - link "3D Graphs":
      - /url: /math-lab/3d-graphing
      - img
      - text: 3D Graphs
    - link "Shapes Explorer":
      - /url: /shapes
      - img
      - text: Shapes Explorer
  - navigation "Studio navigation":
    - link "Math Universe home":
      - /url: /
      - text: mu
    - link "Home":
      - /url: /
      - img
      - text: Home
    - link "Workspace":
      - /url: /workspace
      - img
      - text: Workspace
    - link "Geometry":
      - /url: /workspace/geometry
      - img
      - text: Geometry
    - link "2D Graphs":
      - /url: /workspace/graph
      - img
      - text: 2D Graphs
    - link "3D Studio":
      - /url: /workspace/3d
      - img
      - text: 3D Studio
    - link "CAS":
      - /url: /workspace/data
      - img
      - text: CAS
    - link "More":
      - /url: /sitemap
      - img
      - text: More
  - heading "Dynamic Geometry Studio" [level=1]
  - button "Rename project":
    - img
  - paragraph: Circle Theorem Exploration
  - button "Construct"
  - button "Analyze"
  - button "Measure"
  - button "Animate"
  - button "Learn"
  - button "Undo":
    - img
  - button "Redo":
    - img
  - button "Save":
    - img
  - button "Load saved construction":
    - img
  - button "Export":
    - img
  - button "Workspace settings":
    - img
  - button "Open workspace panels":
    - img
  - complementary:
    - heading "Geometry Tools" [level=2]
    - paragraph: Move tool ready
    - text: Find a tool
    - textbox "Find a tool":
      - /placeholder: Find a tool or task
    - complementary:
      - button "Favorites" [expanded]
      - button "Move":
        - img
        - text: Move
        - img
      - button "Point":
        - img
        - text: Point
        - img
      - button "Line":
        - img
        - text: Line
        - img
      - button "Circle":
        - img
        - text: Circle
        - img
      - button "Polygon":
        - img
        - text: Polygon
        - img
      - button "Basic Tools" [expanded]:
        - text: Basic Tools
        - img
      - button "Move":
        - img
        - text: Move
        - img
      - button "Point":
        - img
        - text: Point
        - img
      - button "Segment":
        - img
        - text: Segment
      - button "Line":
        - img
        - text: Line
        - img
      - button "Ray":
        - img
        - text: Ray
      - button "Vector":
        - img
        - text: Vector
      - button "Circle":
        - img
        - text: Circle
        - img
      - button "Polygon":
        - img
        - text: Polygon
        - img
      - button "Angle":
        - img
        - text: Angle
      - button "Edit" [expanded]:
        - text: Edit
        - img
      - button "Freehand":
        - img
        - text: Freehand
      - button "Text":
        - img
        - text: Text
      - button "Image":
        - img
        - text: Image
      - button "Move Canvas":
        - img
        - text: Move Canvas
      - button "Zoom":
        - img
        - text: Zoom
      - button "Construct" [expanded]:
        - text: Construct
        - img
      - button "Parallel":
        - img
        - text: Parallel
      - button "Perp.":
        - img
        - text: Perp.
      - button "Perp. Bisector":
        - img
        - text: Perp. Bisector
      - button "Angle Bisector":
        - img
        - text: Angle Bisector
      - button "Midpoint":
        - img
        - text: Midpoint
      - button "Intersect":
        - img
        - text: Intersect
      - button "Fixed Length":
        - img
        - text: Fixed Length
      - button "Point on Circle":
        - img
        - text: Point on Circle
      - button "Circle Radius":
        - img
        - text: Circle Radius
      - button "Circle 3 Points":
        - img
        - text: Circle 3 Points
      - button "Shapes" [expanded]:
        - text: Shapes
        - img
      - button "Triangle":
        - img
        - text: Triangle
      - button "Rectangle":
        - img
        - text: Rectangle
      - button "Circle Shape":
        - img
        - text: Circle Shape
      - button "Parabola":
        - img
        - text: Parabola
      - button "Ellipse":
        - img
        - text: Ellipse
      - button "Hyperbola":
        - img
        - text: Hyperbola
      - button "Curves" [expanded]:
        - text: Curves
        - img
      - button "Tangent":
        - img
        - text: Tangent
      - button "Polar":
        - img
        - text: Polar
      - button "Locus":
        - img
        - text: Locus
      - button "Regular Polygon":
        - img
        - text: Regular Polygon
      - button "Arc":
        - img
        - text: Arc
      - button "Sector":
        - img
        - text: Sector
      - button "Compass":
        - img
        - text: Compass
      - button "Transform" [expanded]:
        - text: Transform
        - img
      - button "Mirror":
        - img
        - text: Mirror
      - button "Rotate 45":
        - img
        - text: Rotate 45
      - button "Dilate 1.5x":
        - img
        - text: Dilate 1.5x
      - button "Translate":
        - img
        - text: Translate
      - button "Selection" [expanded]:
        - text: Selection
        - img
      - button "Select All Points":
        - img
        - text: Select All Points
      - button "Move Selected":
        - img
        - text: Move Selected
      - button "Rotate Selected":
        - img
        - text: Rotate Selected
      - button "Dilate Selected":
        - img
        - text: Dilate Selected
      - button "Size -":
        - img
        - text: Size -
      - button "Size +":
        - img
        - text: Size +
      - button "Show / Hide":
        - img
        - text: Show / Hide
      - button "Lock":
        - img
        - text: Lock
      - button "Reflect":
        - img
        - text: Reflect
      - button "Trace":
        - img
        - text: Trace
      - button "Stop Trace":
        - img
        - text: Stop Trace
      - button "Clear Trace":
        - img
        - text: Clear Trace
      - button "File / Image" [expanded]:
        - text: File / Image
        - img
      - button "Delete":
        - img
        - text: Delete
      - button "Undo":
        - img
        - text: Undo
      - button "Redo":
        - img
        - text: Redo
      - button "Reset":
        - img
        - text: Reset
      - button "Save":
        - img
        - text: Save
      - button "Load":
        - img
        - text: Load
      - button "Add Image":
        - img
        - text: Add Image
  - main:
    - text: 1 unit = 40 grid pixels, origin at board center
    - button "Grid" [pressed]
    - button "Axes"
    - button "Numbers"
    - button "Labels" [pressed]
    - button "Measures" [pressed]
    - button "Grid snap" [pressed]
    - button "Object snap" [pressed]
    - button "Contrast"
    - paragraph: Construction Accuracy
    - paragraph: Geometry accuracy certified.
    - text: 100% max residual 0
    - button "Select":
      - img
      - text: Select
    - button "Pan":
      - img
      - text: Pan
    - button "Zoom":
      - img
      - text: Zoom
    - button "Fit view":
      - img
      - text: Fit
    - application "Geometry constructor. Select a point and use arrow keys to nudge it. Press Escape to return to select mode."
    - text: Drag points to explore · Shift for multi-select · Esc to clear Touch mode supports direct manipulation with 44 pixel controls.
    - region "Selected object actions":
      - text: "Selected:"
      - strong: None
      - button "Move":
        - img
        - text: Move
      - button "Size" [disabled]:
        - img
        - text: Size
      - button "Size" [disabled]:
        - img
        - text: Size
      - button "Trace":
        - img
        - text: Trace
      - button "Lock":
        - img
        - text: Lock
      - button "Hide":
        - img
        - text: Hide
      - button "Delete":
        - img
        - text: Delete
    - button "Construction Protocol"
    - button "Measurements"
    - button "Animation"
    - heading "Construction Protocol" [level=3]
    - text: 0 steps
    - paragraph: Create or edit objects to build a replayable construction history.
    - img
    - strong: Pinned measurements
    - text: 0 pinned
    - paragraph: Create a line or circle to pin live measurements.
    - heading "Live Measurements" [level=3]
    - paragraph: Create lines, circles, or polygons to see measurements.
    - heading "Constraint Engine" [level=3]
    - paragraph: "Draggable points now recompute dependent objects: parallel, perpendicular, midpoint, fixed length, point-on-circle, and line intersections."
    - paragraph: Add a constraint tool to see live dependencies here.
  - complementary:
    - heading "Objects & Algebra" [level=2]
    - text: 0 objects
    - tablist "Geometry object views":
      - tab "Objects" [selected]
      - tab "Algebra"
      - tab "Layers"
    - img
    - textbox:
      - /placeholder: Search objects
    - combobox "Filter geometry objects":
      - option "All objects" [selected]
      - option "Points"
      - option "Lines"
      - option "Circles"
      - option "Polygons"
      - option "Visible"
      - option "Hidden"
    - paragraph: Create geometry objects to populate the registry.
    - button "Unified Dynamic Workspace Graph, geometry, CAS, tables, spreadsheet, and 3D registry 18 objects" [expanded]:
      - text: Unified Dynamic Workspace Graph, geometry, CAS, tables, spreadsheet, and 3D registry 18 objects
      - img
    - heading "Objects" [level=2]
    - text: 18/18 0 selected
    - button "All"
    - button "Clear"
    - text: Search objects
    - textbox "Search objects":
      - /placeholder: label, value, kind, view...
    - button "All 18"
    - button "Algebra 3"
    - button "2D 0"
    - button "3D 13"
    - button "Measure 2"
    - button "Shown 10"
    - button "Hidden 8"
    - button "Selected 0"
    - checkbox "Select polyhedron"
    - button "Solid polyhedron":
      - text: Solid polyhedron
      - paragraph:
        - math: p o s = ( 0 , 1.2 , 2.8 ) , r o t = ( 20 , 20 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select sin(x) table"
    - button "Table sin(x) table":
      - text: Table sin(x) table
      - paragraph:
        - math: T a b l e [ sin ⁡ ( x ) , − 4 , 4 , 1 ]
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select Spreadsheet grid"
    - button "Data Spreadsheet grid":
      - text: Data Spreadsheet grid
      - paragraph:
        - math: 6 r o w s x 4 c o l u m n s
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select cone"
    - button "Solid cone":
      - text: Solid cone
      - paragraph:
        - math: p o s = ( 2.4 , 1 , − 1.8 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select cylinder"
    - button "Solid cylinder":
      - text: Solid cylinder
      - paragraph:
        - math: p o s = ( 0 , 1 , − 2.4 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select f"
    - button "Func f":
      - text: Func f
      - paragraph:
        - math: f ( x ) = sin ⁡ ( x )
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select l"
    - button "Line l":
      - text: Line l
      - paragraph:
        - math: p o s = ( − 1.8 , 0.4 , 1.8 ) , r o t = ( 0 , 35 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select P"
    - button "Point P":
      - text: Point P
      - paragraph:
        - math: p o s = ( 2.2 , 1.4 , 1.8 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select plane"
    - button "Plane plane":
      - text: Plane plane
      - paragraph:
        - math: p o s = ( 0 , 0.8 , 0 ) , r o t = ( − 20 , 0 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select prism"
    - button "Solid prism":
      - text: Solid prism
      - paragraph:
        - math: p o s = ( − 2.6 , 0.9 , 1 ) , r o t = ( 0 , 20 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select pyramid"
    - button "Solid pyramid":
      - text: Solid pyramid
      - paragraph:
        - math: p o s = ( 2.6 , 0.9 , 1 ) , r o t = ( 0 , − 20 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select slice"
    - button "Plane slice":
      - text: Plane slice
      - paragraph:
        - math: p o s = ( 0 , 0 , 0 ) , r o t = ( − 90 , 0 , 0 ) , s c a l e = 1
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select solid"
    - button "Solid solid":
      - text: Solid solid
      - paragraph:
        - math: p o s = ( 3 , 0 , 2.6 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select sphere"
    - button "Solid sphere":
      - text: Solid sphere
      - paragraph:
        - math: p o s = ( − 2.4 , 1.2 , − 1.8 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Show object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select surface"
    - button "Surf surface":
      - text: Surf surface
      - paragraph:
        - math: p o s = ( 0 , 0 , 0 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select v"
    - button "Vec v":
      - text: Vec v
      - paragraph:
        - math: p o s = ( 0 , 0 , 0 ) , r o t = ( 0 , 0 , 0 ) , s c a l e = 1
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select plane plane"
    - button "Result plane plane":
      - text: Result plane plane
      - paragraph:
        - math: 0 x + 0 y + 1 z = 0 e q u a t i o n
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - checkbox "Select plane slice"
    - button "Result plane slice":
      - text: Result plane slice
      - paragraph:
        - math: 0 x + 0 y + 1 z = 0 e q u a t i o n
    - button "Hide object":
      - img
    - button "Duplicate object":
      - img
    - button "Restore object defaults":
      - img
    - button "Remove object from workspace registry":
      - img
    - heading "Inspector" [level=2]
    - paragraph: Select a workspace object to inspect its value, linked views, dependencies, and metadata.
    - heading "Object Inspector" [level=2]
    - text: No selection
    - tablist "Geometry inspector views":
      - tab "Properties" [selected]
      - tab "Style"
      - tab "Relations"
    - heading "Object Properties" [level=3]
    - paragraph: Select a point, line, circle, or polygon to modify x/y, size, color, visibility, lock, duplicate, restore, or delete.
    - heading "Image Layer" [level=3]
    - paragraph: Use Add Image to place a picture on the geometry board. Click an image to edit size, opacity, and lock state.
  - text: Offline 60 FPS 0 constraints Geometry accuracy certified.
  - button "Snap on":
    - img
    - text: Snap on
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import {
  3   |   expectNonblankSvgSurface,
  4   |   failOnFatalConsoleErrors,
  5   |   gotoWorkspaceRoute,
  6   | } from "./workspaceBrowserAssertions";
  7   | 
  8   | async function geometryBoardState(page: import("@playwright/test").Page) {
  9   |   return page.getByTestId("workspace-geometry-board").evaluate((board) => ({
  10  |     points: board.querySelectorAll("[data-point-id]").length,
  11  |     lines: board.querySelectorAll("[data-object-type='line']").length,
  12  |     circles: board.querySelectorAll("[data-object-type='circle']").length,
  13  |     polygons: board.querySelectorAll("[data-object-type='polygon']").length,
  14  |     measurementText: board.querySelector("[data-testid='workspace-geometry-measurements']")?.textContent?.trim() ?? "",
  15  |   }));
  16  | }
  17  | 
  18  | async function clickBoardPoint(page: import("@playwright/test").Page, x: number, y: number) {
  19  |   await page.getByTestId("workspace-geometry-board").click({ position: { x, y } });
  20  | }
  21  | 
  22  | async function clickRenderedPoint(page: import("@playwright/test").Page, index: number) {
  23  |   const point = page.getByTestId("workspace-geometry-board").locator("[data-point-id]").nth(index);
  24  |   await expect(point).toBeVisible();
  25  |   const box = await point.boundingBox();
  26  |   expect(box).not.toBeNull();
  27  |   if (!box) return;
  28  |   await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  29  | }
  30  | 
  31  | test.describe("Geometry command-boundary regression", () => {
  32  |   test("selects and deletes a geometry point through the extracted panel boundary", async ({ page }) => {
  33  |     const assertNoFatalErrors = failOnFatalConsoleErrors(page);
  34  |     await gotoWorkspaceRoute(page, "/workspace/geometry");
  35  | 
  36  |     const board = page.getByTestId("workspace-geometry-board");
  37  |     await expectNonblankSvgSurface(board, 8, { requirePath: false });
  38  |     const beforeCreate = await geometryBoardState(page);
  39  |     await page.getByTestId("workspace-geometry-tool-point").click();
  40  |     await clickBoardPoint(page, 280, 120);
  41  | 
  42  |     const afterCreate = await geometryBoardState(page);
  43  |     expect(afterCreate.points).toBe(beforeCreate.points + 1);
  44  | 
  45  |     await page.getByRole("button", { name: "Move", exact: true }).click();
  46  |     await clickRenderedPoint(page, afterCreate.points - 1);
  47  |     await page.keyboard.press("Delete");
  48  | 
  49  |     const afterDelete = await geometryBoardState(page);
  50  |     expect(afterDelete.points).toBe(beforeCreate.points);
  51  |     await expectNonblankSvgSurface(board, 8, { requirePath: false });
  52  |     await assertNoFatalErrors();
  53  |   });
  54  | 
  55  |   test("delete and transform commands fail safely with no geometry selection", async ({ page }) => {
  56  |     const assertNoFatalErrors = failOnFatalConsoleErrors(page);
  57  |     await gotoWorkspaceRoute(page, "/workspace/geometry");
  58  | 
  59  |     const board = page.getByTestId("workspace-geometry-board");
  60  |     const before = await geometryBoardState(page);
  61  |     await page.keyboard.press("Escape");
  62  |     await page.keyboard.press("Delete");
  63  | 
> 64  |     await expect(page.getByTestId("workspace-safety-status")).toContainText("Delete selection is not supported");
      |                                                               ^ Error: expect(locator).toContainText(expected) failed
  65  |     expect(await geometryBoardState(page)).toEqual(before);
  66  | 
  67  |     await page.getByRole("button", { name: "Move Selected", exact: true }).click();
  68  |     await expect(page.getByTestId("workspace-safety-status")).toContainText("Geometry transform is not supported");
  69  |     expect(await geometryBoardState(page)).toEqual(before);
  70  |     await expectNonblankSvgSurface(board, 8, { requirePath: false });
  71  |     await assertNoFatalErrors();
  72  |   });
  73  | 
  74  |   test("measurement overlays remain visible after point drag", async ({ page }) => {
  75  |     const assertNoFatalErrors = failOnFatalConsoleErrors(page);
  76  |     await gotoWorkspaceRoute(page, "/workspace/geometry");
  77  | 
  78  |     const board = page.getByTestId("workspace-geometry-board");
  79  |     await expect(board.getByTestId("workspace-geometry-measurements")).toBeAttached();
  80  |     const box = await board.boundingBox();
  81  |     expect(box).not.toBeNull();
  82  |     if (!box) return;
  83  |     await page.getByTestId("workspace-geometry-tool-point").click();
  84  |     await clickBoardPoint(page, 220, 300);
  85  |     await clickBoardPoint(page, 360, 260);
  86  |     await page.getByTestId("workspace-geometry-tool-line").click();
  87  |     await clickRenderedPoint(page, 0);
  88  |     await clickRenderedPoint(page, 1);
  89  | 
  90  |     const before = await geometryBoardState(page);
  91  |     expect(before.lines).toBeGreaterThan(0);
  92  |     expect(before.measurementText.length).toBeGreaterThan(0);
  93  | 
  94  |     await page.getByRole("button", { name: "Move", exact: true }).click();
  95  |     await page.mouse.move(box.x + 220, box.y + 300);
  96  |     await page.mouse.down();
  97  |     await page.mouse.move(box.x + 250, box.y + 280, { steps: 4 });
  98  |     await page.mouse.up();
  99  | 
  100 |     const after = await geometryBoardState(page);
  101 |     expect(after.measurementText.length).toBeGreaterThan(0);
  102 |     await expect(board.getByTestId("workspace-geometry-measurements")).toBeAttached();
  103 |     await assertNoFatalErrors();
  104 |   });
  105 | 
  106 |   test("geometry tool switching preserves existing construction state", async ({ page }) => {
  107 |     const assertNoFatalErrors = failOnFatalConsoleErrors(page);
  108 |     await gotoWorkspaceRoute(page, "/workspace/geometry");
  109 | 
  110 |     const before = await geometryBoardState(page);
  111 |     await page.getByTestId("workspace-geometry-tool-line").click();
  112 |     await page.getByTestId("workspace-geometry-tool-circle").click();
  113 |     await page.getByTestId("workspace-geometry-tool-point").click();
  114 |     await page.getByRole("button", { name: "Move", exact: true }).click();
  115 | 
  116 |     expect(await geometryBoardState(page)).toEqual(before);
  117 |     await assertNoFatalErrors();
  118 |   });
  119 | });
  120 | 
```