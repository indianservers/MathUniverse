# Phase 04 Workspace Architecture Safety Audit

Date: 2026-06-19

## Scope

Phase 04 focused on reducing route-mode coupling inside the workspace, adding explicit unsupported-action safety contracts, and creating browser coverage for commands that must fail safely without mutating workspace state.

This audit covers:

- `src/pages/MathWorkspace.tsx`
- `src/workspace/types/workspaceMode.ts`
- `src/workspace/workspaceModeConfig.ts`
- `src/workspace/types/graphValidation.ts`
- `src/workspace/graphValidation.ts`
- `src/workspace/workspaceModeConfig.test.ts`
- `tests/workspace/workspaceUnsupportedActions.e2e.ts`

## Current Architecture Finding

`MathWorkspace.tsx` is still the dominant workspace module. It owns shell layout, graphing, CAS result cards, geometry construction, 3D controls, data/CAS views, teacher controls, keyboard handlers, export actions, command interpretation, object registry wiring, and route-specific panels.

Phase 04 did not perform a risky deep extraction. Instead, it introduced a shared route/mode contract and moved navigation metadata out of the static in-page menu. This creates a typed path for future extraction while keeping Phase 1-3 behavior stable.

## Shared Mode Contract

Created `WorkspaceMode` and `WorkspaceModeConfig` in `src/workspace/types/workspaceMode.ts`.

Created `workspaceModeConfigs`, `workspaceModeNavigation`, and `resolveWorkspaceModeFromPath` in `src/workspace/workspaceModeConfig.ts`.

Resolved routes:

- `/workspace` -> `home`
- `/workspace/graph` -> `graph`
- `/workspace/geometry` -> `geometry`
- `/workspace/3d` -> `three-d`
- `/workspace/data` and nested data paths -> `data`
- `/workspace/teach` -> `teacher`
- unknown workspace paths -> `null`

`WorkspaceMainMenu` now consumes the shared navigation contract instead of maintaining a separate static module list.

## Unsupported-Action Safety

Phase 04 wired `createUnsupportedWorkspaceAction` through major workspace paths where silent failure or ambiguous status messages could reduce trust:

- Unknown command-bar commands now produce an explicit `Unsupported workspace action` result card.
- Invalid graph expressions are blocked before plot mutation.
- CAS-linked graph expressions are validated before plot insertion.
- Delete/Backspace with no selected object reports a safe unsupported status.
- Geometry transform actions with no selected object report a safe unsupported status.
- 3D transform presets with no selected object report a safe unsupported status.

The visible safety status uses `role="status"`, `aria-live="polite"`, and `data-testid="workspace-safety-status"`.

## Graph Validation Contract

Created `GraphValidationResult` in `src/workspace/types/graphValidation.ts`.

Created `validateGraphExpression` in `src/workspace/graphValidation.ts`.

The validator blocks unsupported or unsafe browser fragments before plotting:

- `window`
- `document`
- `globalThis`
- `fetch`
- `import`
- `eval`
- `function`
- `=>`
- `;`

Invalid or unsupported expressions show a visible graph validation message with suggestions and preserve existing plots.

## Browser Coverage Added

Created `tests/workspace/workspaceUnsupportedActions.e2e.ts`.

Coverage:

- Invalid graph expression shows validation and preserves an existing plot.
- Unsupported command-bar command shows a safe result card.
- Geometry transform with no selection reports unsupported-action status.
- 3D delete with no selection reports unsupported-action status and preserves the 3D canvas.

## Architecture Risk Register

| Risk | Status | Notes |
| --- | --- | --- |
| Oversized `MathWorkspace.tsx` | Open | Shared mode config is the first split. Graph, geometry, 3D, data, and teacher panels still need dedicated route panel modules. |
| Unsupported command safety gaps | Improved | Major command paths now use the shared unsupported-action helper, but secondary controls should continue to be audited. |
| Invalid graph expressions mutating state | Mitigated | Graph panel and command/CAS graph insertion now validate before mutation. |
| Browser visual regression depth | Improved | Phase 3 smoke remains green and Phase 4 unsupported-action smoke was added. Screenshot baselines are still not present. |
| Repo-wide lint debt | Open | Full lint remains blocked by pre-existing unrelated errors and warnings. Focused Phase 4 lint passes. |
| Full test health | Open outside workspace | Full Vitest is currently blocked by Visual Proofs Phase 11 assertions unrelated to Phase 4. |

## Recommended Phase 05 Extraction

Create route-specific panel modules under `src/workspace/panels/`:

- `GraphWorkspacePanel.tsx`
- `GeometryWorkspacePanel.tsx`
- `ThreeDWorkspacePanel.tsx`
- `DataWorkspacePanel.tsx`
- `TeacherWorkspacePanel.tsx`

Move panel-only helpers beside the panels after each extraction and keep `MathWorkspace.tsx` as orchestration until the state model can be split safely.

