# Graphing Calculator Competitive Upgrade

## Phase 1 — Authoring, parameters, data, and rendering

Reach targets:

- Piecewise functions and chained domain restrictions evaluate through the safe parser.
- Active expressions expose quick-entry templates and actionable inline errors.
- Undefined parameters automatically become sliders with loop or ping-pong animation, speed, bounds, and step controls.
- Users can type or paste editable x/y data, plot it, calculate a linear regression and R², and show residuals.
- Implicit equations use marching-segment boundaries instead of disconnected point clouds.
- Strict inequalities use dashed boundaries, inclusive inequalities use solid boundaries, and regions use translucent fills.
- Phase-specific unit tests, lint checks, and desktop/mobile browser acceptance checks pass.

## Phase 2 — Dynamic objects and advanced graph families

Status: implemented and acceptance-tested.

Supported quick syntax:

- `seq(n^2, 0, 12)` and `recur(1, 1.25*prev, 18)` for discrete layers.
- `contour(x^2+y^2, 1;4;9)` for multiple contour levels.
- `r=2*sin(3*theta),theta=0..pi` for bounded polar plots.
- `vector(-y,x)` and `slope(x-y)` for vector and slope fields.
- Build → Properties → Dynamic constructions for linked points, lines, tangents, normals, and conics.

Reach targets:

- Draggable points, lines, tangents, normals, conics, and linked measurements update expressions bidirectionally.
- Users can directly manipulate supported curves while equations and tables remain synchronized.
- Sequence, recurrence, logarithmic-scale, contour, polar-range, vector-field, and slope-field plots are supported.
- Layers gain ordering, grouping, locking, opacity, labels, notes, and images.
- Performance remains interactive at the documented data and expression limits.

## Phase 3 — CAS, accessibility, sharing, and assessment

Reach targets:

- Exact CAS operations, limits, Taylor series, equation systems, and symbolic transformations create linked graph layers.
- Every core workflow is keyboard accessible and screen-reader described; audio trace and accessible math speech are available.
- Projects support share links, embeds, version history, classroom templates, and privacy controls.
- Exam mode visibly restricts networking, sharing, CAS, and saved resources according to a declared policy.
- Cross-browser, offline, accessibility, performance, and assessment-mode certification suites pass.
