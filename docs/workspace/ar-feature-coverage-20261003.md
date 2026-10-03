# AR feature expansion and coverage — 2026-10-03

## Scope and separation

The changes belong to the dedicated `/modules/ar-math-lab` route, `src/pages/ARMathLab.tsx`, and `src/ar-math-lab/`. They do not merge AR with regular 2D or 3D graph studios. Only mathematical evaluation, 2D sampling/root analysis, and numerical implicit meshing reuse shared engines. No regular graph page or workspace component is imported by the AR tools.

## New capabilities

| Area | Implemented capability | Practical limit |
| --- | --- | --- |
| AR 2D | Explicit functions, sideways functions including bare `Y^2`, implicit relations, inequality regions | Bounds clip explicit curves; contour sampling is approximate |
| AR 2D | Polar graphs and planar parametric curves | Polar sweep is 0–2π; parametric sweep uses the graph settings |
| AR 2D | Separate branches at undefined domains and poles | Numerical sampling cannot resolve every very small feature |
| AR 2D | Parameter controls, presets, range controls, vertical/floor placement | Parameters apply when adding the graph |
| AR 2D | Trace value, tangent slope and a tangent object in the AR scene | Explicit functions only; finite differences are approximate |
| AR 2D | Signed definite integral, roots, value table and CSV export | Simpson quadrature is numerical, not a symbolic or improper-integral solver; root display remains limited to 12 |
| AR 3D | Existing explicit/parametric surfaces and space curves retained | Mobile sampling budgets remain bounded |
| AR 3D | General implicit equations and coefficient-prefixed parametric coordinates | Numerical meshing in a symmetric bounded cube; small or degenerate zero sets may be missed |
| AR 3D | Surface sections along x, y or z, retained as separate scene curves | Coordinates refer to the displayed mesh, including display scaling |
| AR 3D | OBJ surface export | Displayed vertex coordinates; object/world transforms are not baked into the export |
| Geometry | Editable triangle/polygon vertices; regular 3–32-gons | Current polygon construction requires convex, non-degenerate, non-crossing vertices |
| Geometry | Area, perimeter, vertex angles and centroid | Graph units; not camera measurements |
| Geometry | Rotation, translation, dilation, reflection, undo and redo | Undo history covers polygon edits, not the entire AR scene |
| Geometry | Convex polygon extrusion and prism volume | Positive extrusion height, graph-unit dimensions |
| Geometry | Circle intersections, triangle incircle/circumcircle, incenter/circumcenter/orthocenter | Coincident circles are reported as infinitely many intersections |
| Geometry | Construction JSON export; existing scene JSON save/load retains new graph geometry | Dependency-based regeneration of arbitrary named constructions is not included |
| Rendering | Batched disconnected lines and inequality point regions; computed surface normals | Dense scenes can still exceed a phone’s rendering budget |
| Coordinates | 2D objects carry their own transformed x/y axes; 3D scene labels use z for height | Source graph units and tracked-world metres are different frames |
| Tracked AR | WebXR immersive-AR entry, hit-test reticle, tap placement, repositioning, display scale and exit | Requires compatible secure-context hardware; not tested on a physical phone here |
| Tracked AR | Permission/support failure messages and session/source cleanup | Positions last for the current XR session; persistent XR anchors, depth occlusion and light estimation are not implemented |

Existing AR features retained include real-dimension solid builders (cube, cuboid, cylinder, cone, sphere, hemisphere, prism, pyramid, frustum and torus), unit conversion, measurements, animations, solid cross-section controls, comparison, learning/practice, teacher mode, camera sketch tools and scene management. Their presence is not a claim of exhaustive numerical verification of every existing feature.

## Parser fixes in the AR engine

- Scientific notation is tokenized as a number, rather than Euler-constant multiplication.
- Implicit multiplication is inserted between tokens without corrupting function names.
- Power/unary-minus precedence follows mathematical convention.
- Missing operands and malformed numbers are rejected before mesh generation.
- Odd-denominator rational powers support real negative-base results; more hyperbolic/reciprocal functions are available.
- Parametric coordinates with coefficients are recognized; invalid curve intervals remain disconnected.
- Graph bounds must be finite and increasing.

## Verification

- 119 AR and route tests passed across 11 test files, including the prior AR tests and new independent mathematical checks.
- ESLint passed for changed AR code.
- Manual 390 × 844 browser checks covered explicit/sideways/implicit/polar/parametric/inequality 2D graphs, malformed input, implicit/explicit/parametric 3D objects, sections, triangle/circle constructions, transformations, undo/redo, extrusion and function/tangent analysis.
- No horizontal overflow was observed in those mobile checks.
- The desktop browser correctly disabled immersive AR and presented fallback guidance. The real XR camera/reticle/placement lifecycle remains a physical-device acceptance item.
- Production build: successful; existing unrelated CSS-minification and bundle-size warnings remain.
- Full repository typecheck has existing errors outside AR. A scoped AR check reports only the pre-existing event-listener typing errors at `src/hooks/useCanvasZoomLock.ts:24` and `:28`; no changed AR file errors remain. The shared hook was left unchanged.

## GeoGebra comparison and remaining work

GeoGebra documents surfaces, solids, intersections/cross-sections, sliders, AR placement, learning resources, and saving/sharing in its [3D Calculator listing](https://apps.apple.com/us/app/geogebra-3d-calculator/id1445871976), and its [tutorial](https://www.geogebra.org/m/aWhYSpvy) covers rotations and sections. Those are comparison categories, not evidence that this app is already superior.

The new AR studio adds a combined planar-graph/geometry construction workflow, analytical readouts, explicit graph-unit versus camera-unit disclosure, and OBJ/CSV/construction export. Full GeoGebra parity is **not complete**. The remaining major categories are symbolic CAS and exact calculus, a general dependent-construction system with constraints/loci, arbitrary line/plane/conic intersections, non-convex polygon triangulation, solid nets and unfolding, persistent anchors, depth occlusion/light estimation, collaboration/library publishing, and physical Android/iOS compatibility/performance validation.

WebXR session and hit-test APIs follow the [requestSession documentation](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession) and [hit-test documentation](https://developer.mozilla.org/en-US/docs/Web/API/XRSession/requestHitTestSource). Availability varies by browser/device and requires a secure context.

## Evidence

- [Manual browser observations](ar-enhancement-evidence/manual-checks.json)
- [2D studio](ar-enhancement-evidence/ar-2d-studio.jpg)
- [Geometry editor and prism](ar-enhancement-evidence/ar-geometry-studio.jpg)
