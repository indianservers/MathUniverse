# Math Workspace Responsive Layout

`MathWorkspaceLayout` is the shared viewport shell for the six connected Math Workspaces:

- CAS: `/workspace/data`
- Geometry: `/workspace/geometry`
- 3D Geometry: `/workspace/3d`
- Graphs: `/workspace/graph`
- 3D Graphs: `/math-lab/3d-graphing`
- Shapes Explorer: `/shapes`

## Ownership

The shared shell owns the safe-area-aware header, bounded primary stage, mobile global dock, fullscreen state, focus mode, presentation mode, workspace switching, keyboard help and the More controls sheet. Workspace components continue to own mathematical state, undo history, graph cameras, selected objects, sliders and domain-specific tools.

The stage is always a `minmax(0, 1fr)` grid track. Studio roots use `height: 100%` inside it instead of creating nested viewport-height surfaces. Document-style Graphs content scrolls inside the stage rather than at page level.

## Layout Ranges

- Below 768px: single primary stage, compact header, global bottom dock and bottom sheets.
- 768px to 1023px: bounded stage with a floating global dock; workspace drawers and optional split panels remain available.
- 1024px and above: full workspace stage and desktop-owned side panels; the global dock is hidden.
- 1920px and above with a coarse pointer: presentation controls, larger targets and stronger focus rings are enabled.

Portrait and landscape phone rules are distinct. Landscape moves shared sheets to an edge drawer and shortens the header/dock to preserve canvas height.

## Workspace Adaptations

- CAS uses Notebook, History and Result panel controls. History and Result become state-preserving drawers on phones, while tablets retain notebook/result split view.
- Geometry exposes Select, Point, Line, Circle and Shape in a 48px touch dock whenever the desktop toolbox is hidden.
- 3D Geometry and 3D Graphs retain their existing viewport gestures, panel drawers and render controls inside the bounded stage.
- Graphs uses an internal scroll surface so commands, results and expression tools remain reachable without horizontal page overflow.
- Shapes Explorer opens the searchable library and properties inspector as mobile bottom sheets. Selecting a shape closes the library without resetting the active shape.

## Input And Accessibility

Canvas and SVG interaction surfaces use contained touch behavior on coarse pointers. Shared controls have keyboard focus, Escape closes sheets, `Ctrl+F` toggles workspace fullscreen, and `?` opens keyboard help. Reduced-motion preferences disable workspace transitions and sheet animation. Smart TV focus styling combines large viewport rules with coarse-pointer detection rather than width alone.

Responsive changes never remount workspace engines, so expressions, constructions, cameras, selected objects and sliders remain in component state during resize and orientation changes.
