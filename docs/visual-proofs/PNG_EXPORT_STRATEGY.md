# PNG Export Strategy

## Current Status

- JSON snapshot export works through the shared snapshot system.
- SVG export works for SVG-backed visuals.
- PNG export works for SVG-backed Visual Proof visuals through browser-native SVG serialization and canvas export.
- PNG export is intentionally browser-only and does not add server code or new dependencies.

## Why PNG Export Is Useful

- teacher slides
- worksheets
- LMS uploads
- printable handouts
- offline class notes

## Possible Approaches

- Implemented: serialize the primary SVG and draw it to a browser canvas.
- Deferred: use an `html-to-image` style library for full shell capture.
- Kept: browser-only export by serializing the current visual without server code.

## Risks

- web fonts may not render identically
- external styles may not inline cleanly
- CORS can taint canvas if external images are introduced
- dark mode colors need deterministic export mode
- high-resolution scaling can blur text or create huge memory usage
- SVGs with embedded `foreignObject` content may fail browser image decoding if exported directly

## Implemented Minimal Path

Phase 32 starts with SVG-backed proofs only:

1. Locate the primary SVG through `expectedPrimarySelector`.
2. Clone and serialize the SVG.
3. Ensure XML namespace is present.
4. Create an object URL or data URL.
5. Draw it to a canvas at 2x scale.
6. Export `canvas.toBlob("image/png")`.
7. Revoke object URLs after download.

The PNG path removes `foreignObject` nodes from the cloned SVG before canvas decoding. This keeps the export reliable for current Visual Proof SVGs that embed HTML controls, while leaving SVG export unchanged.

## Supported Scope

- SVG-backed Visual Proof primary visuals.
- Current phase-upgraded Visual Proof routes that render an SVG inside `visual-proof-primary-visual`.
- Browser environments with `Image`, `document`, `canvas`, and `canvas.toBlob`.

## Unsupported Scope

- Full shell screenshots.
- Non-SVG HTML visual export.
- Canvas-backed proof PNG export.
- Pixel-diff visual regression baselines.
- Server-side or headless export outside a browser runtime.

## Test Plan

- Unit test route slug, filename, SVG namespace, SVG blob, and browser API guard behavior.
- Browser test PNG button on representative SVG-backed proofs.
- Validate downloaded filename extension for SVG and PNG.
- Validate export status feedback for JSON, SVG, and PNG.
- Reuse existing browser nonblank DOM checks before export actions.
- Keep pixel-sampled PNG nonblank validation as future work.
- Keep dark mode and light mode export comparisons as future work.

## Acceptance Criteria

- PNG export works for SVG-backed Visual Proofs.
- Export controls preserve JSON snapshot and SVG export behavior.
- Exported PNG download is produced from the current primary SVG.
- No external dependency is required unless approved.
- PNG export gracefully hides or disables for unsupported visuals.
- `hasVisualRegressionTest` remains false until screenshot-baseline or pixel-sampled visual regression coverage exists.

## Phase 32 Result

- Implemented in `src/visual-proofs/utils/visualProofExportUtils.ts`.
- Wired through `src/visual-proofs/components/SnapshotExportButton.tsx`.
- Covered by `src/visual-proofs/utils/visualProofExportUtils.test.ts`.
- Covered in browser by `tests/visual-proofs/visualProofsExport.e2e.ts`.
