# Phase 2 — 3D Geometry Evidence Log

Tested 2026-08-20 in the shipped browser UI at `http://127.0.0.1:5173/workspace/3d`, build 1.0.1, commit `2662c27` (dirty working tree preserved).

## UI evidence

- Launch: the module rendered the 3D canvas, X/Y/Z orientation indicator, grid/axes scene, Shape Library, Scene Objects, Object Inspector, Undo/Redo/Save/Export, Fit view, and 5 initially visible objects. Initial reported frame rate was 137–144 FPS.
- Camera: Perspective/Top/Front/Right/Free were selected through the visible menu. Searches and the menu confirmed Back, Left, and Bottom presets are absent.
- Exact point/object coordinates: a created point and cube accepted negative, zero, decimal, and large coordinate values. The rendered inspector showed X `-3.5`, Y `0`, Z `12.25`. Number inputs rejected non-numeric text at the HTML-control level without a friendly validation message.
- Shape coverage: UI creation succeeded for Cube, Cuboid, Sphere, Hemisphere, Cylinder, Cone, Frustum, Torus, Triangular prism, Pyramid, Tetrahedron, Octahedron, Dodecahedron, Wedge, and Icosahedron.
- Missing-feature searches: `segment`, `ray`, `plane equation`, `parallel plane`, `perpendicular plane`, `intersection`, `point distance`, `angle`, `oblique cylinder`, `net`, `compound`, `reflect`, `pentagonal prism`, and `hexagonal pyramid` each produced `No supported shapes match this search.` No alternative construction tool appeared.
- Measurement samples at displayed dimensions 2.50 × 2.50 × 2.50: Cube 15.63/37.50; Sphere 8.18/19.63; Hemisphere 4.09/14.73; Cylinder 12.27/29.45; Cone 4.09/15.89; Frustum 7.86/22.44; Torus 1.51/10.07; triangular prism 5.07/20.30; pyramid 2.60/12.50; tetrahedron 1.56/9.71; octahedron 4.06/14.57; dodecahedron 5.44/16.43; icosahedron 4.95/14.96 (volume/surface area).
- Cuboid defect: the inspector reported 2.50 × 2.50 × 2.50, volume 15.63, and surface area 37.50, while the rendered mesh applies additional 1.45 × 0.78 × 1 geometry factors. The numerical measurement therefore does not describe the visible cuboid.
- Scaling: changing a cube's uniform scale from 1 to 2 updated dimensions to 5.00 and volume/area to 125.00/150.00, correctly following k³/k². Entering scale 0 silently changed it to 0.1; negative scale was likewise unsupported without explanatory validation.
- Editing: exact rotation, translation, colour, opacity, material, duplicate, hide, delete, Undo, and Redo controls were exercised. A 90° X rotation was restored by Redo after Undo.
- Persistence: Save displayed `Workspace saved in this browser.` A page reload opened the default 5-object scene, not the saved scene. The scene was restored only after opening Settings and clicking `Load saved scene`, which displayed `Saved workspace loaded.`
- Export: Export was clicked for a populated scene. The implementation offers a workspace JSON download only; no image/model/document format chooser or success/error feedback was exposed.
- Stress: 100+ mixed objects were created through repeated visible Shape Library buttons. The UI reported 106 visible objects, 75 FPS immediately after creation, no crash, and 126 FPS after save/reload/explicit load. Duplicate/delete/Undo/Redo and save/reopen remained responsive. The operation took about 32.1 seconds through browser automation.
- Responsive: at 768×1024 and 390×844 the canvas, Shape Library, and Inspector remained in the accessibility tree with no document-level horizontal overflow. Touch gestures were not physically available; this is viewport emulation only.
- Automated regression: `geometry3dWorkspaceEngine.test.ts` and `geometry3dKernel.test.ts`: 2 files, 8 tests passed.

## Mathematical cross-checks

- Distance (0,0,0) to (3,4,12) = sqrt(9+16+144) = 13, but the UI has no endpoint-defined segment/vector magnitude workflow to verify it.
- Cube at side 2.5: V = 15.625 and SA = 37.5, matching displayed 15.63 and 37.50.
- Cylinder at r=1.25, h=2.5: V = 12.2718 and total SA = 29.4524, matching 12.27 and 29.45.
- Cone at r=1.25, h=2.5: V = 4.0906 and total SA = 15.8907, matching 4.09 and 15.89.
- Sphere at r=1.25: V = 8.1812 and SA = 19.6350, matching 8.18 and 19.63 within rounding.
- The UI does not expose dot/cross products, plane classifications, topology counts, diagonal measurements, or section measurements; those mandatory checks are release gaps, not passes.

## Evidence limitation

The in-app browser returned screenshot buffers but could not persist them to requested workspace paths in this environment. No screenshot filenames are fabricated. This textual evidence records exact UI labels, values, outcomes, viewport sizes, and reproduction observations.
