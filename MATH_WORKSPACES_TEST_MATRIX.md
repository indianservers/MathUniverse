# Math Workspaces Test Matrix

## Phase 1 Automated Tests

| Test area | File | Result | Coverage |
| --- | --- | --- | --- |
| Browser speech capability | `src/workspace/browserSpeechInput.test.ts` | Pass | Standard/prefixed detection and phrase normalization |
| Graph panel | `src/components/workspace/panels/GraphWorkspacePanel.test.tsx` | Pass | Rendering, expression safety, graph marks, units, validation, add/remove |
| Shared layout | `src/components/workspace/MathWorkspaceLayout.test.tsx` | Pass | Shared controls for all six registered workspaces |
| Route smoke | `src/workspace/workspaceRouteSmoke.test.tsx` | Pass | Current Graph, Geometry, 3D, CAS, and Teacher route contracts |

Focused total: **24 passed, 0 failed**.

## Phase 1 Live Tests

| Route | Viewport | Action | Expected | Observed |
| --- | --- | --- | --- | --- |
| `/workspace/data` | 1280x720 | Initial load | Notebook primary; graph closed | Pass |
| `/workspace/data` | 1280x720 | Open graph preview | Preview appears over notebook | Pass |
| `/workspace/data` | 1280x720 | Close graph preview | Preview removed; notebook retained | Pass |
| `/workspace/data` | 1280x720 | Inspect module bar | No unsupported Notes item | Pass |
| `/workspace/data` | 1280x720 | Inspect camera state | Disabled with missing OCR dependency | Pass |
| `/workspace/data` | 1280x720 | Inspect voice state | Enabled only when browser constructor exists | Pass |
| `/workspace/graph?v_a=1&v_b=0` | 1280x720 | Initial load | No stage scroll; three panes visible | Pass |
| `/workspace/graph?v_a=1&v_b=0` | 1280x720 | Inspect editor overflow | Internal editor scrolling | Pass |
| `/workspace/graph?v_a=1&v_b=0` | 1280x720 | Inspect graph | Nonzero 565.6x384 canvas | Pass |

## Build Gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint -- --max-warnings=0` | Pass |
| `npm run build` | Pass |
| Focused Phase 1 tests | Pass, 24/24 |
| Full repository summary | Pending reliable Phase 3 capture |

## Phase 2 Automated Tests

| Test area | Result | Evidence |
| --- | --- | --- |
| CAS operation matrix | Pass | Advanced algebra, calculus, and matrix operations in `casNotebookEngine.test.ts` |
| Structured CAS steps | Pass | Required structured fields and final verification asserted |
| CAS persistence | Pass | Notebook save/restore regression |
| Workspace transfers | Pass | Target rejection, one-time delivery, and expiry tests |
| Spreadsheet workbook | Pass | Formula/dependency/regression engine suite |
| XLSX import/export | Pass | Multi-sheet non-empty ExcelJS round trip with formulas |
| Geometry 2D/3D kernels | Pass | 25/25 combined geometry, route, and render tests |
| Graph parameter persistence | Pass | Graph panel suite passes after query/local linked state integration |

Focused Phase 2 totals recorded in separate runs: **17/17**, **25/25**, and **12/12**. Test overlap is intentional; these are not summed as unique repository tests.

## Phase 2 Evidence Gaps

- Full repository JSON summary was not produced by the current runner invocation.
- The in-app browser webview failed to attach twice, so no new live Phase 2 screenshot or click trace is claimed.
- PDF binary parsing, complete Shapes live workflow, and cross-tab reactive slider propagation remain unverified.

## Phase 3 Automated Matrix

| Test area | Result | Evidence |
| --- | --- | --- |
| Responsive routes | Pass, 98/98 | 7 routes x 14 viewports from 320x568 through 3840x2160; `responsive.json` |
| Layout bounds | Pass | Maximum horizontal overflow 0px; maximum clipped controls 0 |
| Runtime console | Pass | 0 route/viewport entries with non-WebGL console errors |
| Route loading | Pass | Maximum measured load 2,192ms |
| Accessibility | Pass, 7/7 | Keyboard focus plus WCAG 2 A/AA axe scan; 0 violations |
| WebGL lifecycle | Pass, 9/9 | Three cycles each for 3D Geometry, 3D Graphs, and Shapes; 0 retained canvases |
| Performance | Pass, 3/3 | 499 objects: 100.04ms; 999: 686.52ms; 1,999: 4,335.67ms |
| Full repository suite | Pass | 518 suites, 1,463 tests, 0 failures, 0 timed-out batches |
| TypeScript, lint, build | Pass | Strict lint and production TypeScript/Vite build |

Artifacts are stored in `artifacts/math-workspaces-phase3/` and `artifacts/phase3-full-tests.json`. Representative screenshots cover phone, tablet, desktop, full-HD, and 4K states for CAS, Graphs, 3D Graphs, and Shapes.
