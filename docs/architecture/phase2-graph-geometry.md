# Phase 2: 2D graphing and dynamic geometry

Status: implemented foundation with explicitly scoped partial capabilities. Date: 2026-08-20. This document describes shipped behavior; it does not certify curriculum coverage or claim symbolic proofs where only numerical evidence exists.

## Architecture and shared truth

Phase 2 extends the Phase 1 `MathDependencyGraph`. Definitions, sliders, function tables, graph samples, geometry points, analysis features, narration, save/open, undo/redo, and capability evidence consume stable mathematical node IDs. The established `/workspace/graph` and `/workspace/geometry` surfaces remain the broad authoring tools. `/math-document` is the integrated proof that a definition such as `a=2`, `f(x)=x^2+a`, and `P=(a,f(a))` drives result, adaptive plot, parameter animation, feature list, table, and geometry without copied values.

The principal modules are:

| Module | Responsibility | Evidence |
|---|---|---|
| `adaptiveGraph.ts` | Screen-error adaptive subdivision, discontinuity separation, quality profiles, cancellation and resource ceilings | `adaptiveGraph.test.ts` |
| `analysis2d.ts` | Roots, intercepts, extrema candidates, holes, asymptote candidates, sampled domain/range and monotonic intervals | `analysis2d.test.ts` |
| `geometryPhase2.ts` | Robust orientation, typed degeneracy/intersection outcomes, circumcircles, affine composition/inversion | `geometryPhase2.test.ts` |
| `phase2Objects.ts` | Ordered/styled object registry, selection and batch edits, dependency-backed definitions, rational sliders | `phase2Objects.test.ts` |
| `audioTrace.ts` | Semantic graph summaries and optional bounded pitch/stereo trace | `audioTrace.test.ts` |
| `benchmarks/phase2Corpus.ts` | Versioned 200-case graph/geometry/accessibility acceptance corpus | `phase2Corpus.test.ts` |

## Mathematical object and style model

`Phase2Object` covers scalar, constant, variable, function, equation, inequality, point, point list, sequence, table, explicit/implicit/parametric/polar/piecewise curves, regions, geometry, measurements, transformations, sliders, actions, notes, and folders. Each object has a stable ID, optional mathematical node ID, type, definition, visibility, lock state, folder, order, diagnostics, timestamps, and a complete style object. Style fields include stroke/fill color, opacity, width, line style, point size/shape, label and position, region pattern, layer, trace, and auxiliary status.

`Phase2ObjectRegistry` supports add, update, duplicate, remove, reorder, multi-selection, batch visibility/locking/style changes, search, error/warning filtering, density, reverse dependency inspection, and serialization. Mathematical definitions are submitted to the shared DAG; notes, folders, and actions are intentionally non-mathematical.

## Graph modes and numerical methods

The existing Graph Workspace provides explicit, implicit, parametric, polar, piecewise, inequality, and point/list workflows. The universal adapter currently supports explicit one-variable functions plus scalar dependencies. That boundary is registered as a capability limitation rather than hidden.

Adaptive explicit sampling begins with a profile-dependent interval grid and recursively subdivides where midpoint screen error or curvature exceeds the declared threshold. Profiles are Performance (2.5 px, depth 8), Balanced (1.25 px, depth 11), and High accuracy (0.55 px, depth 14). Every result records algorithm, profile, tolerance, maximum depth, evaluation count, convergence, and estimated screen error. Undefined evaluations, overflow, and asymptote evidence split segments. Stale work accepts a cancellation token; evaluation ceilings prevent runaway work.

Function analysis uses 1,600 safe interval samples, bracketed bisection (up to 80 iterations), neighborhood derivative estimates, denominator-root probes, and symmetric limit probes. A point of interest stores source IDs, kind, coordinates, formatted approximation, precision, residual, method, tolerance, verification status, assumptions, and warnings. Sampled domain/range and monotonicity are descriptions, not global proofs.

## Dynamic geometry and degeneracy

The established geometry kernel owns points, lines, segments, rays, vectors, circles, conics, intersections, relations, polygon measures, construction builders, locus tracing, animation, import/export, and construction protocol. The Phase 2 wrapper adds robust scale-aware orientation and typed outcomes: exact, approximate, no solution, multiple, infinite, degenerate, or unsupported.

Circumcircles are defined by three input points and expose center, radius, circle object, two perpendicular bisectors, an algebraic equation, method, tolerance, and residual. Coincident or collinear points return deterministic diagnostics. Parallel and coincident lines and circles are distinguished. General conic-conic intersection remains a declared numerical scan.

Affine transforms use a six-number matrix. Translation, rotation about a point, reflection across a line, and dilation about a point compose in order and can be inverted when the determinant is nonzero. Tests verify round-trip and invariant behavior.

## Sliders, animation, and accessibility

Slider steps are stored as numerator/denominator rather than binary-float increments. Playback supports direction, forward loop, ping-pong or once, speed, duration, and linear/ease-in-out timing. Applying a slider value redefines its shared scalar node, so all downstream consumers recompute together. Native range input supplies arrow-key control. Reduced-motion preference disables automatic playback.

The graph has four synchronized alternatives: SVG with a meaningful accessible label, semantic viewport/curve/feature narration, structured point-of-interest list, and exact/approximate value table. Optional audio maps y to a user-bounded logarithmic pitch range and x to bounded stereo pan, with feature and axis-crossing cues. Volume is capped at 0.2 and audio requires a user gesture; stopping closes the audio context. Audio is experimental and never the only representation.

## Document schema and migration

Native document schema version 2 adds `phase2`, containing object-registry version, object and slider payloads, selection, graph viewport/quality, and geometry view settings. Phase 1 documents migrate to version 2 with safe empty Phase 2 defaults. Schema-zero documents migrate through version 1 to version 2. Stable mathematical node IDs, source definitions, extensions, and existing timestamps are preserved. Newer unknown schema versions and corrupt files are quarantined rather than partially loaded.

## Performance and responsiveness

Adaptive sampling is bounded by profile-specific maximum depth and evaluation count. Sampling evidence makes quality/performance decisions inspectable. Calculations can be cancelled when stale. The UI keeps animation changes small, uses the dependency graph's transactional recomputation, honors reduced motion, and separates graph paths at discontinuities. A future worker implementation can use the same cancellation/result contract without changing document semantics.

## Benchmark corpus and verification

Corpus version 2.0.0 contains exactly 200 unique cases: 30 explicit, 15 discontinuous, 15 implicit, 15 parametric, 15 polar, 15 regions, 20 points of interest, 20 school constructions, 10 conics, 15 degeneracies, 10 transformations, 10 loci, and 10 accessibility workflows. Every case declares input, supported domain, expected behavior, exact/numeric/interaction expectation, tolerance, diagnostics, interaction, and accessibility expectation.

Run `npm run verify:phase2`. It executes Phase 1 core/curriculum/document checks, all Phase 2 unit and benchmark-schema tests, type checking, and a production build. Capability statuses cite concrete test IDs. `SUPPORTED` means the stated input/domain contract is implemented and tested; `PARTIAL` and `EXPERIMENTAL` limitations remain visible.

## Known limitations and next work

- Universal-document graph adaptation is explicit-only; the established Graph Workspace carries the broader modes.
- Extrema, monotonic intervals, range, asymptotes, and holes are interval-based numerical evidence, not symbolic global proofs.
- Boolean region combinations and strict/open boundary semantics require consolidation into the universal AST.
- General conic-conic intersection and loci are numerical; symbolic locus elimination is not implemented.
- The visual object manager in the established workspace and the universal Phase 2 registry need a single persisted UI surface.
- Audio trace needs user research and assistive-technology certification before a higher capability status.
- Worker-backed recomputation, pan/zoom gesture polish, print/export formatting, and large-object stress baselines remain future performance work.
