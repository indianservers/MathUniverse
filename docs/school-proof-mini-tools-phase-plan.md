# School Proof Mini Tools Phase Plan

Date: 2026-07-28  
Source: `docs/lesson-audit-report.md` and `tmp/school-proof-lessons.json`

## Goal

Upgrade theorem/proof-heavy school lessons from family-generic labs to lesson-specific mini tools with exact theorem statements, visual proof steps, formula/theorem cards, misconception checks, and board-style assessment prompts.

Target backlog: 51 school lessons.

## Phase 1: Foundation Proof Tools

Status: implemented.

Purpose: build reusable proof-tool infrastructure and cover the highest-impact Class 9 geometry/polynomial lessons.

### Build

- Add a `SchoolProofMiniTool` router inside `SchoolLessonInteractiveLab`.
- Add a lightweight registry keyed by lesson title/concept family.
- Add reusable proof UI primitives:
  - theorem statement card
  - given/to-prove panel
  - diagram/state controls
  - proof-step sorter
  - reason matcher
  - invalid-step detector
  - exact formula/theorem card
- Keep fallback to current family lab for lessons not yet registered.

### Lessons Covered

Polynomials:

- Remainder Theorem
- Factor Theorem
- Polynomial Factorisation Practice

Euclidean Geometry foundations:

- Definitions Axioms and Postulates
- Euclid's Five Postulates
- Equivalent Forms of the Fifth Postulate
- Axiom versus Theorem
- Proof Structure and Logical Statements
- Vertically Opposite Angles
- Linear Pair Axiom and Converse
- Corresponding Angles
- Alternate Interior Angles
- Interior Angles on the Same Side
- Parallel Line Converse Theorems
- Triangle Angle Sum Theorem
- Exterior Angle Theorem

Early reasoning:

- Remainder Reasoning
- Scale Factor in Maps and Recipes

### Mini Tools

- Polynomial division/remainder evaluator: show `p(x)=(x-a)q(x)+r`, then verify `r=p(a)`.
- Factor theorem toggle: show `p(a)=0 <=> (x-a)` is a factor.
- Parallel-lines angle lab: drag transversal, highlight corresponding/alternate/interior angles, sort proof reasons.
- Euclid/postulate classifier: classify statement as definition, axiom/postulate, theorem, converse, or invalid inference.
- Triangle angle sum proof: dynamic triangle with parallel line construction and angle transfer.
- Exterior angle proof: show exterior angle equals sum of two opposite interior angles.

### Acceptance

- At least 18 lessons route to exact mini tools.
- Every Phase 1 mini tool has exact theorem/formula text.
- Existing 220 school lesson tests remain green.
- New tests assert registered title-to-tool mapping and exact theorem cards.

Implementation notes:

- Added `SchoolProofMiniTool` with exact registry coverage for all 18 Phase 1 lessons.
- Added four reusable modes: polynomial theorem, Euclid/proof classifier, parallel-line angle proof, and triangle angle proof.
- `SchoolLessonInteractiveLab` now routes Phase 1 proof-heavy lessons to exact mini tools and keeps the older family lab as fallback.

## Phase 2: Congruence, Quadrilaterals, Circles

Status: implemented.

Purpose: cover the proof-heavy geometry core that students repeatedly use in board exams.

### Build

- Extend registry with geometry proof modes.
- Add triangle congruence diagram engine.
- Add quadrilateral/parallelogram invariant engine.
- Add circle theorem diagram engine.
- Add construction-independent proof-step checks.

### Lessons Covered

Triangle Proofs:

- SAS Congruence
- ASA Congruence
- AAS Congruence
- SSS Congruence
- RHS Congruence
- Equal Sides and Equal Angles

Quadrilateral Proofs:

- Parallelogram Opposite Sides
- Parallelogram Opposite Angles
- Parallelogram Diagonals
- Conditions for a Quadrilateral to Be a Parallelogram
- Midpoint Theorem
- Converse of Midpoint Theorem

Mensuration:

- Heron's Formula Derivation

Circle Proofs:

- Equal Chords and Equal Angles
- Angles in the Same Segment
- Cyclic Quadrilateral
- Opposite Angles of a Cyclic Quadrilateral
- Tangent Perpendicular to Radius
- Tangent Lengths from an External Point

### Mini Tools

- Congruence matcher: learners select matching sides/angles, then choose SAS/ASA/AAS/SSS/RHS.
- Isosceles proof lab: toggle equal sides/equal angles and identify converse.
- Parallelogram invariants: drag vertices while tracking opposite sides, opposite angles, and bisecting diagonals.
- Midpoint theorem lab: midpoint markers, parallel segment, half-length relation.
- Heron derivation explainer: side lengths, semiperimeter, altitude connection, final `sqrt(s(s-a)(s-b)(s-c))`.
- Circle theorem lab: chord/arc/angle relationships, tangent-radius perpendicular, equal tangent lengths.

### Acceptance

- At least 19 additional lessons route to exact mini tools.
- Congruence lessons must reject wrong criterion choices.
- Circle lessons must display exact theorem statement and diagram labels.
- Add visual/unit tests for registry coverage and formula/theorem cards.

Implementation notes:

- Extended `SchoolProofMiniTool` with Phase 2 registry coverage for all 19 target lessons.
- Added four reusable modes: congruence matcher, quadrilateral invariant/midpoint tool, Heron's formula tool, and circle theorem tool.
- Phase 1 + Phase 2 exact proof coverage is now 37/51 lessons.

## Phase 3: Senior Proofs and Exam-Grade Reasoning

Status: implemented.

Purpose: cover Class 11-12 proof/theorem topics and add polish for assessment quality.

### Build

- Add induction proof builder.
- Add conic tangent symbolic/graph mini tools.
- Add calculus theorem condition checker.
- Add probability theorem tree/table visualizer.
- Add determinant cofactor expansion mini tool.
- Add progress/reporting for proof mastery.

### Lessons Covered

Mathematical Induction:

- Logic of Mathematical Induction
- Sum Formula by Induction
- Divisibility by Induction
- Inequality by Induction
- Strong Induction Introduction

Conic Sections:

- Tangent to a Parabola
- Tangent to an Ellipse
- Tangent to a Hyperbola

Formal Calculus:

- Rolle's Theorem
- Lagrange Mean Value Theorem
- Tangents and Normals

Matrices and Determinants:

- Minors and Cofactors

Probability:

- Total Probability Theorem
- Bayes' Theorem

### Mini Tools

- Induction proof builder: base case, induction hypothesis, induction step, conclusion; reject circular reasoning.
- Conic tangent visualizer: point parameter, tangent equation, normal/tangent relation.
- Rolle/MVT condition checker: continuity, differentiability, endpoint values, secant slope, guaranteed `c`.
- Tangents/normals tool: derivative slope and normal slope `-1/m`.
- Cofactor expansion lab: choose row/column, compute minors, signs, cofactors, determinant.
- Probability partition tree: total probability and Bayes numerator/denominator highlighting.

### Acceptance

- Remaining 14 lessons route to exact mini tools.
- Class 12 theorem tools must explicitly show conditions before result.
- Bayes and total probability tools must show both tree and formula forms.
- Add final audit assertion: all 51 target lessons have non-generic proof mini tool coverage.

Implementation notes:

- Extended `SchoolProofMiniTool` with Phase 3 registry coverage for all 14 senior target lessons.
- Added five reusable modes: induction proof builder, conic tangent visualizer, calculus theorem condition checker, cofactor expansion lab, and probability theorem tree.
- Final exact proof mini-tool coverage is now 51/51 target lessons.

## Implementation Order

1. Add the registry and proof shell without changing generated lesson data.
2. Implement Phase 1 tools and tests.
3. Implement Phase 2 tools and tests.
4. Implement Phase 3 tools and tests.
5. Update `docs/lesson-audit-report.md` with before/after coverage.

## Final Coverage Target

| Phase | New exact mini-tool lessons | Cumulative |
| --- | ---: | ---: |
| Phase 1 | 18 | 18/51 |
| Phase 2 | 19 | 37/51 |
| Phase 3 | 14 | 51/51 |
