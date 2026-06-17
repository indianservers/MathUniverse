# Visual Proofs Phase 7 QA Results

## Routes Upgraded

- `/visual-proofs/trigonometry/arc-length-formula`
- `/visual-proofs/trigonometry/small-angle-approximation`

## Remaining Trigonometry Route Scan

- Found one remaining legacy route in addition to small-angle approximation: `/visual-proofs/trigonometry/arc-length-formula`.
- Both remaining routes were upgraded to `VisualProofShell`.
- All 15 available trigonometry routes are now expected to be `phase-upgraded`.

## Trigonometry Consistency Pass

- Metadata normalized across all 15 trigonometry routes.
- `trig-graphs-from-unit-circle` remains mapped to supported `graph-limit`.
- `small-angle-approximation` and `arc-length-formula` are mapped to `measurement-scene`.
- Tangent near-zero warnings remain covered by Phase 5 config tests.
- Radian warnings are explicit in small-angle and arc-length configs.

## Interaction Coverage

- Angle dragging: added for small-angle approximation and arc length formula.
- Radius dragging: added for arc length formula.
- Keyboard fallback: both Phase 7 configs expose sliders/steppers through the shell, and SVG handles reuse keyboard-capable `DraggableHandle`.
- Formula highlighting: both Phase 7 configs expose formula tokens tied to arc, radius, sine segment, approximation gap, and radians warning.
- Prediction prompts: both Phase 7 configs include targeted prompts.
- Misconception checks: both Phase 7 configs include targeted misconception cards.
- Approximation warning: small-angle approximation shows a visible radian-only warning and live approximation status.
- Snapshot copy: inherited from `PhaseTwoProofExperience` teacher-mode JSON snapshot export.

## Mobile Label Resilience

- Phase 7 SVG labels are compact and keep long formulas in shell panels.
- Dense text is kept in side formula/state panels rather than over the diagram.
- Touch handles remain the shared large `DraggableHandle` targets.
- Existing dense Phase 5/6 trig diagrams continue to use compact labels and formula panels.

## Browser Smoke-Test Status

- No Playwright, Cypress, or equivalent browser E2E framework is present in `package.json`.
- No new browser dependency was introduced.
- Added metadata smoke foundation instead:
  - `src/visual-proofs/data/visualProofsRouteSmokeManifest.ts`
  - `src/visual-proofs/data/visualProofsPhaseSeven.test.tsx`

## Automated QA

Commands run for this phase should include:

- `npm run typecheck`
- `npm run build`
- `npm run test -- src/visual-proofs/data/visualProofsPhaseSeven.test.tsx`
- `npm run test -- src/visual-proofs/data/visualProofsPhaseSix.test.tsx`
- `npm run test -- src/visual-proofs/data/visualProofsPhaseFive.test.tsx`
- `npm run test -- src/visual-proofs/data/visualProofsPhaseFour.test.tsx`
- `npm run test -- src/visual-proofs/data/visualProofsPhaseThree.test.tsx`
- `npm run test -- src/visual-proofs/data/visualProofsPhaseOne.test.tsx`
- focused ESLint on Phase 7 touched files
- route smoke checks on port 3953

## Known Limitations

- No real browser visual regression suite exists yet.
- Snapshot export remains JSON copy/fallback, not PNG/SVG.
- Mobile label resilience is structural; there is still no automated overlap detector.
- Arc and small-angle visuals are schematic SVG models, not physics animations.
- Full repo lint/test may still report unrelated existing debt outside Visual Proofs Phase 7.

## Recommended Phase 8 Focus

- Start the coordinate geometry proof upgrade cluster.
- Add real browser smoke tests once an E2E framework is chosen.
- Add nonblank SVG/canvas checks and mobile overflow checks.
- Add PNG/SVG teacher snapshot export.
