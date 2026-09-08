# Lesson 0875: Feasible Region

Status: in progress; no visual acceptance.

Latest verification: six tests pass across the geometry model and initial server-rendered surface. The surface test checks area 250, optimum 1100 at (10,15), four shading switches, two graphs, test-point and sweep controls, four draggable practice vertices and adjacent navigation. This is not browser event or screenshot evidence.

Reference: `D:/Math App Screenshots for UI Update/Updated UI/0875-school-class-12-linear-programming-feasible-region-redesigned.png`.

Dedicated surface 10201 now includes constraint toggles, calculated half-plane intersection, a pointer/keyboard test point, grid/snap/zoom, vertex and objective tables, an animated objective sweep, bounded/unbounded/empty presets, vertex reorder practice and independently graded quick checks.

The model uses D3 polygon hull and area routines. Three tests verify the default vertices/optimum, positive-quadrant unboundedness and an empty intersection.

Zoom refinement: polygon clipping and boundary endpoints now use the visible world bounds. A fourth passing test verifies that unbounded-region shading reaches the requested viewport limits without incorrectly changing the mathematical classification to bounded. Browser rendering remains unverified.

## Reference Corrections

- The displayed default polygon has area 250, not the mockup's 150.
- Removing only x+2y≤40 does not make the region unbounded. The unbounded preset removes both resource limits.
- The empty preset uses x+2y≤-1 together with non-negativity, giving a genuinely empty intersection.

## Outstanding

- Verify all interactions, responsive bounds and rendered graphs through authorized browser access.
- Compare full-page screenshots against the target; no visual evidence exists yet.
- Match constraint settings, graph annotations, region-type illustrations, footer and detailed section dimensions.
- Added four independent shading switches. Each controls its half-plane fill without disabling the mathematical constraint; a fifth passing model test verifies shading cannot change feasibility or optimization. Component lint passes. Visual/interaction verification is still pending.
- The reminder now resets the live test point to (0,0), and adjacent-lesson links use catalog-verified routes. Component lint passes; rendered placement remains unverified.
- Verify vertex practice drag/drop and keyboard reordering. This was added after the initial model tests.
