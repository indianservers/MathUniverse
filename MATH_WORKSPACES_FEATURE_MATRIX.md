# Math Workspaces Feature Matrix

Status values: `Verified`, `Partial`, or `Unavailable`.

| Workspace | Feature | Status | Phase 1 evidence / next action |
| --- | --- | --- | --- |
| CAS | Symbolic notebook is primary | Verified | Four editable evaluated cells occupy the center at `/workspace/data`. |
| CAS | Exact result and selected-cell inspector | Verified | Result/Steps/Properties/Assumptions/Related are selected-cell backed. |
| CAS | Optional graph preview | Verified | Opens and closes without unmounting the notebook. |
| CAS | Voice capability detection | Verified | Standard and prefixed Web Speech constructors tested. |
| CAS | Review spoken math before use | Verified | Editable recognition draft requires **Use input**. |
| CAS | Equation OCR | Unavailable | No OCR engine is installed; control is disabled truthfully. |
| CAS | Notes workspace | Unavailable | Unsupported module reference removed; complete authoring workflow deferred. |
| CAS | Expanded algebra/calculus/linear-algebra coverage | Verified | Advanced engine-backed operations and representative tests pass. Unsupported commands remain omitted and documented. |
| CAS | Progressive structured steps | Partial | Required fields plus Next/Show all are implemented; exact intermediate expressions depend on engine output. |
| CAS | Calculation persistence and export | Verified | Notebook local persistence; JSON calculation and Markdown notebook export; copy LaTeX/MathML. |
| Graphs | Three-area desktop studio | Verified | 300 / 565.6 / 300px panes at 1280x720. |
| Graphs | Permanently visible canvas while editing | Verified | Canvas is 565.6x384px; side panes scroll internally. |
| Graphs | Explicit/implicit/parametric/polar/inequality sampling | Partial | Existing sampler tests pass; complete analysis tool audit is Phase 2. |
| Graphs | Mobile graph layout and touch controls | Verified | Responsive matrix covers seven mobile/tablet viewports; bounded layout, visible controls, and no horizontal overflow. |
| Spreadsheet | Formula/dependency/regression suite | Verified | Engine tests and default Dataset/Regression/Residual workbook pass. |
| Spreadsheet | XLSX import/export | Verified | ExcelJS round-trip preserves sheets, headers, and formulas; file is non-empty. |
| Geometry | Construction/dependency workflow | Verified | Dependency recomputation, measures, transforms, loci, serialization, undo/redo tests pass. |
| 3D Geometry | Object/property workflow | Verified | Kernel/workspace tests cover measures, intersections, sections, transforms, and loci. |
| 3D Graphs | Surface and cross-workspace workflow | Verified | Multi-surface controls and CAS/3D Geometry transfers are implemented; three repeated lifecycle cycles retain zero canvases. |
| Shapes | Formula/net/cross-section workflow | Partial | Responsive and WebGL lifecycle gates pass; exhaustive formula-by-formula shape verification remains future product work. |
| Shared | Persistent workspace transfers | Verified | Target-safe single-use transfers and notebook persistence tested. |
| Shared | Linked parameters | Partial | `a`/`b` persist and map to URL query values; reactive all-workspace graph remains open. |
| Shared | Export system | Partial | CAS, Spreadsheet, Graphs, Geometry, and 3D formats exist; one universal dialog is not complete. |
| Shared | Complete responsive matrix | Verified | 98/98 route/viewport combinations pass from 320x568 through 3840x2160. |
| Shared | Complete accessibility matrix | Verified | Seven routes pass keyboard focus and WCAG 2 A/AA axe scans with zero violations. |
| Shared | Large-construction performance | Verified | 499, 999, and 1,999-object evaluate/protocol/export scenarios all meet explicit budgets. |
| Shared | Full repository regression suite | Verified | 518 suites and 1,463 tests pass with zero failures and zero timed-out batches. |
