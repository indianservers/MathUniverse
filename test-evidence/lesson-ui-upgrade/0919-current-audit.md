# Lesson 0919: Bessel Function

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0919-advanced-advanced-special-functions-bessel-function-redesigned.png`.
Advanced concept: 2025. Route: `/lessons/advanced-concepts/2025-bessel-function`.

## Comparison

| Target area | Implementation | Difference / remaining verification |
| --- | --- | --- |
| Dedicated Bessel evaluation | Integer-order Bessel integral evaluated with existing Simpson integrator; roots bracketed and refined numerically | Orders 0..4, first three positive roots, graph x=0..20; not a sine-like surrogate |
| Bessel graph | Actual J0/J1/J2 and selected order, working zero/envelope toggles, order stepper/input | Corrects reference root/curve positions. Envelope is explicitly asymptotic, not a strict all-x bound |
| Zero selector | Correct first three roots; buttons select radial mode index m | Actual root values shared with membrane and boundary model |
| Membrane | Canvas pixel buffer from Jn(j_nm r/R) cos(n theta) cos(phase); fixed rim; phase/sign coloring | Corrects target's multiple rings for mode (0,1). Fundamental has no interior ring; decorative image bands not reproduced |
| Views and presets | Working mode-shape/nodal-line views and six coupled (n,m) presets | Nodal view reflects spatial zeros, not a uniformly zero instant of the animation |
| Animation | Play/pause, phase scrubber, speed selector; frequency j_nm for R=c=1 | Frame cleanup on pause/unmount; actual browser playback/canvas presentation unverified |
| Radial section | Actual current-phase Jn profile, interior nodes and rim, pointer/range probe and live value | Corrects target's negative lobe/interior zero for default (0,1); no interior radial ring in that mode |
| Boundary equations | k=j_nm/R and omega=ck; actual selected eigenvalue | Physical scale R=1, c=1 explicitly fixed, not dummy parameters |
| Node counts | m-1 interior nodal rings and n nodal diameters | Removes ambiguity between order n and radial index m |
| Practice | Root multiple choice, fixed fundamental-mode boundary question, reveal solution and numeric/range placement check | Blank/ungraded initially; correct first positive radial zero for (0,1) is r/R=1, not reference's .3827 |
| Supporting content | Regular-at-origin normalization, sine comparison, physical examples and actionable higher-mode preset | Further-study links are real primary references; no invented next lesson route for Hankel functions |
| Layout / artwork | Dedicated paired graph/membrane surfaces, boundary and radial section, lower teaching/practice panels | Exact shell/footer, typography, metal rim artwork, responsive geometry and pixel parity unverified. Real displacement visualization differs from mathematically incorrect reference bands |

## Verification

- Seven focused Vitest tests passed: six model tests plus one initial-markup test.
- J0(1), origin values and first three J0 roots checked against known constants.
- Integral evaluator compared with an independent power-series evaluation for all supported orders at selected x values.
- Numerical Bessel ODE residual checked away from origin.
- Root order and near-zero residuals checked for all five orders.
- Node counts, fundamental-mode positivity/no interior ring, first (0,2) ring radius and fixed boundary checked for every supported (n,m).
- Pure rendering buffer verified nonblank, transparent outside disk, varied in color, and changed by phase and nodal view.
- Pixel-buffer tests do NOT prove that the browser canvas is painted, correctly sized, nonblank or animated. Those checks remain pending.
- Initial markup confirms calculated roots, canvas element, real control markup, corrected fundamental-mode text, no pregraded answer and no KaTeX errors.
- Targeted strict TypeScript and focused ESLint passed.
- One dedicated route test passed; 234 unrelated cases skipped.
- Captured desktop evidence: `artifacts/studio-control-audit/0919-current.png`.
- One-by-one browser acceptance: opened the advanced route, changed the first Bessel parameter range input from 0 to 1, and verified the live studio remained rendered with the updated control state.
- Focused surface/model tests pass: `BesselSurface.test.tsx` and `besselLessonModel.test.ts` (7 tests).

## References and Remaining Scope

- NIST DLMF 10.9: https://dlmf.nist.gov/10.9 (integer-order Bessel integral).
- NIST DLMF 10.21: https://dlmf.nist.gov/10.21 (zeros).
- Current target-directory PNG inventory ends at 0919. This is the end of the numbered batch, not evidence that every earlier lesson is complete.
All lessons in the one-by-one pending queue are now individually browser-checked with captured visual evidence and focused tests.
- Previous aggregate completion counts have not been re-audited.
