# Ruhi Intelligence Engine v5.2

Implemented local mathematical algorithms and native integration for supported classes. The broader master specification remains partially implemented; unsupported classes are listed below. App version remains 1.0.2.

## Architecture and supported operations

Restricted notation and typed AST → assumptions/domain checks → bounded local worker dispatch → independent class-specific verification → structured result/status → conversation explanation and native workspace commit verification.

BigInt rational algebra is mathematical truth; Nerdamer proposes selected symbolic forms; Three.js renders; TensorFlow classifies language only.

Native dependency graphs recompute parent-derived incircles, planes, perpendicular lines and marked intersections; undo/redo preserves definitions.

The kernel adds bounded Unicode/basic LaTeX input, typed structured ASTs, exact substitution and numerical status handling; rational polynomial division/GCD/factoring and pole-aware solutions; exact affine systems/rank/nullspace; rational-root sign charts; assumption-aware simplification and independently checked selected calculus; robust linear 2D predicates, triangle/tangent/conic/affine-constraint operations; separate mathematical 3D vector/line/plane/rotation/section/solid operations. Native planes, perpendicular lines, intersections and incircles update with parents. Coordinate-frame conversion is separate from mathematical truth.

See [kernel API and limits](../../src/math-robo/kernel/README.md) and [solver registry](../../src/math-robo/intelligence/engineRegistryCore.ts).

## Verification

- 600 dedicated new cases: 150 for each required engine; 1,206 total kernel assertions. Four property tests additionally run 200 random trials each.
- 7341/7341 Ruhi/workspace regression tests, 34 files. The rerun uses a 30-second timeout; initial failures and fixes remain recorded.
- Original frozen conversations: 100/100; unchanged source fixture and geometric oracle. All original cases are 2D.
- Browser: 170/170 across four workspaces, 0 page errors. Remote hosts blocked; software WebGL.
- Held-out mathematical fixtures: 20/20, no training. Initial run 19/20 because a LaTeX backslash became a form-feed escape; corrected with String.raw. A subsequent type-only fixture annotation changed the source hash without changing assertions. Both corrections/hashes are retained.
- Student production build: passed; production browser tests: 3/3 passed. Scoped types and lint pass. Global types retain 219 diagnostics (baseline 218). Last full lint retains 432 errors/133 warnings (baseline 433/133). Repository-wide checks are not clean.
- Existing model weights SHA-256 unchanged: 315d8161f4ff311db2e7850ef5e6d0f5362fa2f53cede767e2a12f2b2907ce3d. No model retraining.

## Measured browser performance

Milliseconds, ten requests per operation (one cold, nine warm); these are local machine measurements, not physical low-end device guarantees.

| Operation | Cold | Warm mean | Warm p95 |
|---|---:|---:|---:|
| evaluate | 8.80 | 2.86 | 11.60 |
| simplify | 132.50 | 28.59 | 177.30 |
| solve | 14.40 | 13.09 | 17.30 |
| geometry2d / triangle | 21.40 | 19.56 | 78.30 |
| geometry3d / rotate | 4.50 | 18.36 | 68.50 |
| geometry3d / plane | 1.20 | 1.73 | 13.80 |

Cancellation returned “Calculation cancelled.”. Main-page heap observation: 97400000 bytes used; worker heaps not measured. Four-workspace UI measurements use synthetic 4× CPU throttling and include automation overhead. Incremental dependency move latencies are recorded in final-report.json and include inference/render/commit/verification, so they are not isolated mathematical update timings.

## Remaining limitations

- General irreducible higher-degree/parameterized/nonlinear systems are unsupported; complete equation classes are explicitly bounded. Real rational inequalities require rational critical roots. Certified general function analysis is limited to degree-two polynomials.
- Structured AST parsing supports bounded intervals, sets, vectors, matrices, derivatives, integrals and piecewise expressions. Parsing is not proof; only selected structured operations are executed and verified.
- Exact affine point constraints cover four points and sixteen constraints. A general nonlinear geometric constraint optimizer and full conic intersection/tangent/degeneracy classification are not implemented.
- Exact linear geometry predicates use exact IEEE-754 input coordinates. Rounded rendering is approximate. Existing triangle-center routines and irrational circle-line parameter boundaries can reject ill-conditioned cases; residual checks are not universal conditioning certificates.
- 3D covers selected line/plane/vector incidence, skew supporting lines, sphere-plane sections and analytic solid measurements. Arbitrary solid booleans/polyhedron cross-sections and closest bounded skew ray/segment endpoints are unsupported.
- Detailed explanations use recorded verified steps; universal mistake diagnosis and alternative-method generation are not implemented for every problem class.
- Worker pools have cancellation, time/job/queue limits and recycling. Main-page heap observations do not include all worker heaps, physical low-memory hardware or a hard heap quota. Local asset serving is still required for a disconnected cold reload.
- TensorFlow classifier weights are unchanged. No new training, classifier accuracy improvement or 100K-row training throughput is claimed. Synthetic mathematical cases do not measure open-ended language accuracy.

## Evidence

Detailed results, source hashes, phase gates, original-conversation state, measurements and screenshots are saved in this directory. Existing content and previous uncommitted work are preserved. No commit or push was requested for this upgrade.
