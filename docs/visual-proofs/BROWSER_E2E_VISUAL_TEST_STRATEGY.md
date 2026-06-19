# Browser E2E Visual Test Strategy

## Why Browser Testing Is Needed

Metadata tests confirm that routes are registered, but they do not prove that visuals render nonblank, controls are clickable, labels fit on mobile, or SVG export works in a real browser. Visual Proofs now has 183 phase-upgraded routes, so browser smoke and visual checks are the next reliability layer.

## Current Limitation

- No Playwright or Cypress dependency is configured.
- `hasVisualRegressionTest` remains false for all routes.
- Prior browser connector attempts reported unavailable browser targets, so current verification has used production preview HTTP 200 smoke checks.

## Recommended E2E Framework Options

- Playwright is preferred if the project accepts a new dev dependency. It supports Chromium/WebKit/Firefox, mobile viewports, screenshots, trace capture, and robust locator APIs.
- Cypress is a reasonable alternative for interactive app flows, but Playwright is better suited for broad route matrices and visual smoke.

## Minimum Route Smoke Suite

- `/visual-proofs`
- every category page
- every phase-upgraded proof route from `visualProofsRouteSmokeManifest`
- one representative route per category for deeper interaction checks

## Minimum Assertions

- no application error boundary
- no Vite/runtime error overlay
- `VisualProofShell` visible
- primary visual visible
- SVG/canvas nonblank
- controls visible
- formula panel visible
- state inspector region visible
- snapshot button visible when teacher mode is enabled

## Visual Checks

- SVG contains a minimum number of shape/path/text elements.
- Canvas pixel sample is nonblank where canvas routes exist.
- No horizontal overflow at mobile widths.
- Key controls are not clipped.
- Formula token list is present.
- Primary visual selector matches `expectedPrimarySelector`.

## Mobile Viewport Matrix

- 320 px
- 375 px
- 390 px
- 430 px
- tablet width

## CI Integration Proposal

1. Add Playwright as a dev dependency.
2. Add a `visual-proof-smoke.spec.ts` that imports or consumes generated route lists.
3. Run route smoke on pull requests.
4. Run screenshot/nonblank checks nightly or on Visual Proofs changes.
5. Store screenshots only for failures at first to keep CI artifacts manageable.

## Acceptance Criteria For `hasVisualRegressionTest = true`

- A real browser test source exists in the repo.
- CI runs the test or documents a required manual command.
- The test covers at least route loading, primary visual visibility, and nonblank SVG/canvas checks.
- The route smoke manifest and proof metadata are tied to that test.
- The route has passed the browser visual test in CI or a documented local run.
