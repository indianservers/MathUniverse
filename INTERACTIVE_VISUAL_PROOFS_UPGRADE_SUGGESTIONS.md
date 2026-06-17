# Interactive Visual Proofs Upgrade Suggestions

Generated from `src/visual-proofs/data/visualProofsIndex.ts` and `visualProofCategories.ts`. Coverage: 95 available proof routes plus 11 coming-soon starter proof routes, 106 total.

## Common Upgrades For All Interactive Proofs

1. Standardize every proof into a three-panel learning surface: visual canvas, step timeline, and formula/insight panel.
2. Add a universal Manipulate -> Predict -> Reveal -> Practice loop so each proof becomes an active learning unit.
3. Add draggable handles plus keyboard steppers for all sliders, points, angles, terms, and parameters.
4. Add misconception checks after key steps, with targeted feedback instead of generic correct/incorrect messaging.
5. Add a proof-state inspector showing live values, invariants, assumptions, and approximation warnings.
6. Add linked Olympyard practice exits for each proof category and proof-level follow-up questions.
7. Add teacher controls: freeze state, reveal one layer at a time, export snapshot, and copy lesson link.
8. Add mobile-first canvas constraints so labels, controls, and formula blocks never overlap on small screens.
9. Add reduced-motion and high-contrast modes for animated rearrangements, graph traces, and 3D/volume scenes.
10. Add route-level visual regression checks for nonblank canvas, no error overlay, and visible primary controls.

## Per-Proof Upgrade Suggestions

### Geometry Proofs (geometry)

#### Pythagorean Theorem by Area Rearrangement

- Route: `/visual-proofs/geometry/pythagorean-theorem-area-rearrangement`
- Status: `available`; Component: `PythagoreanAreaRearrangementProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Pythagorean, Theorem, Area, Rearrangement with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Pythagorean Theorem by Area Rearrangement.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area of Triangle as Half of a Rectangle

- Route: `/visual-proofs/geometry/triangle-area-half-rectangle`
- Status: `available`; Component: `TriangleAreaHalfRectangleProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Triangle, Half, Rectangle with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area of Triangle as Half of a Rectangle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Angle Sum of a Triangle

- Route: `/visual-proofs/geometry/triangle-angle-sum`
- Status: `available`; Component: `TriangleAngleSumProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Angle, Triangle with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Angle Sum of a Triangle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Exterior Angle Theorem

- Route: `/visual-proofs/geometry/exterior-angle-theorem`
- Status: `available`; Component: `ExteriorAngleTheoremProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Exterior, Angle, Theorem with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Exterior Angle Theorem.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Similar Triangles and Proportional Sides

- Route: `/visual-proofs/geometry/similar-triangles-proportional-sides`
- Status: `available`; Component: `SimilarTrianglesProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Similar, Triangles, Proportional, Sides with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Similar Triangles and Proportional Sides.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Circle Circumference by Rolling/Unwrapping

- Route: `/visual-proofs/geometry/circle-circumference-unwrapping`
- Status: `available`; Component: `CircleCircumferenceUnwrappingProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Circle, Circumference, Rolling, Unwrapping with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Circle Circumference by Rolling/Unwrapping.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sector Area Formula

- Route: `/visual-proofs/geometry/sector-area-formula`
- Status: `available`; Component: `SectorAreaFormulaProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Sector, Area, Formula with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sector Area Formula.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area of Parallelogram by Shearing

- Route: `/visual-proofs/geometry/parallelogram-area-shearing`
- Status: `available`; Component: `ParallelogramAreaShearingProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Parallelogram, Shearing with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area of Parallelogram by Shearing.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area of Trapezoid / Trapezium by Duplication

- Route: `/visual-proofs/geometry/trapezoid-area-duplication`
- Status: `available`; Component: `TrapezoidAreaDuplicationProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Trapezoid, Trapezium, Duplication with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area of Trapezoid / Trapezium by Duplication.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum of Interior Angles of a Polygon

- Route: `/visual-proofs/geometry/polygon-interior-angle-sum`
- Status: `available`; Component: `PolygonInteriorAngleSumProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Interior, Angles, Polygon with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum of Interior Angles of a Polygon.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area of Circle by Unrolling Circumference

- Route: `/visual-proofs/geometry/area-of-circle-by-unrolling`
- Status: `available`; Component: `CircleAreaUnrollingProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Circle, Unrolling, Circumference with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area of Circle by Unrolling Circumference.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Algebraic Identities (algebraic-identities)

#### Square of a Sum: (a + b)^2

- Route: `/visual-proofs/algebraic-identities/square-of-sum`
- Status: `available`; Component: `SquareOfSumProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Square with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Square of a Sum: (a + b)^2.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Square of a Difference: (a - b)^2

- Route: `/visual-proofs/algebraic-identities/square-of-difference`
- Status: `available`; Component: `SquareOfDifferenceProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Square, Difference with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Square of a Difference: (a - b)^2.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Difference of Squares: a^2 - b^2

- Route: `/visual-proofs/algebraic-identities/difference-of-squares`
- Status: `available`; Component: `DifferenceOfSquaresProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Difference, Squares with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Difference of Squares: a^2 - b^2.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Product of Binomials: (x + a)(x + b)

- Route: `/visual-proofs/algebraic-identities/product-of-binomials`
- Status: `available`; Component: `ProductOfBinomialsProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Product, Binomials with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Product of Binomials: (x + a)(x + b).
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Distributive Law Area Model: (a + b)(c + d)

- Route: `/visual-proofs/algebraic-identities/distributive-law-area-model`
- Status: `available`; Component: `DistributiveLawAreaModelProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Distributive, Area, Model with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Distributive Law Area Model: (a + b)(c + d).
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Three-Term Square: (a + b + c)^2

- Route: `/visual-proofs/algebraic-identities/three-term-square`
- Status: `available`; Component: `ThreeTermSquareProof`; Difficulty: `Intermediate`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Three, Term, Square with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Three-Term Square: (a + b + c)^2.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Completing the Square

- Route: `/visual-proofs/algebraic-identities/completing-the-square`
- Status: `available`; Component: `CompletingTheSquareProof`; Difficulty: `Intermediate`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Completing, Square with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Completing the Square.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Factorization of x^2 + px + q

- Route: `/visual-proofs/algebraic-identities/quadratic-factorization-area-model`
- Status: `available`; Component: `QuadraticFactorizationAreaModelProof`; Difficulty: `Intermediate`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Factorization with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Factorization of x^2 + px + q.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Perfect Square Trinomial Recognition

- Route: `/visual-proofs/algebraic-identities/perfect-square-trinomial-recognition`
- Status: `available`; Component: `PerfectSquareTrinomialRecognitionProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Perfect, Square, Trinomial, Recognition with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Perfect Square Trinomial Recognition.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Cube of a Sum: (a + b)^3

- Route: `/visual-proofs/algebraic-identities/cube-of-sum`
- Status: `available`; Component: `CubeOfSumProof`; Difficulty: `Intermediate`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Cube with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Cube of a Sum: (a + b)^3.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Cube of a Difference: (a - b)^3

- Route: `/visual-proofs/algebraic-identities/cube-of-difference`
- Status: `available`; Component: `CubeOfDifferenceProof`; Difficulty: `Intermediate`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Cube, Difference with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Cube of a Difference: (a - b)^3.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum and Difference Product: (a + b)(a - b)

- Route: `/visual-proofs/algebraic-identities/sum-and-difference-product`
- Status: `available`; Component: `SumAndDifferenceProductProof`; Difficulty: `Beginner`
1. Add a learner-controlled tile model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Difference, Product with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum and Difference Product: (a + b)(a - b).
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Trigonometry Proofs (trigonometry)

#### Sine, Cosine, and Tangent from a Right Triangle

- Route: `/visual-proofs/trigonometry/right-triangle-trig-ratios`
- Status: `available`; Component: `RightTriangleTrigRatiosProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Sine,, Cosine,, Tangent, from with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sine, Cosine, and Tangent from a Right Triangle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sine and Cosine on the Unit Circle

- Route: `/visual-proofs/trigonometry/unit-circle-sine-cosine`
- Status: `available`; Component: `UnitCircleSineCosineProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Sine, Cosine, Unit, Circle with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sine and Cosine on the Unit Circle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Pythagorean Identity: sin^2 theta + cos^2 theta = 1

- Route: `/visual-proofs/trigonometry/pythagorean-trig-identity`
- Status: `available`; Component: `PythagoreanTrigIdentityProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Pythagorean, Identity, theta, theta with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Pythagorean Identity: sin^2 theta + cos^2 theta = 1.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Tangent Identity: tan theta = sin theta / cos theta

- Route: `/visual-proofs/trigonometry/tangent-ratio-identity`
- Status: `available`; Component: `TangentRatioIdentityProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Tangent, Identity, theta, theta with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Tangent Identity: tan theta = sin theta / cos theta.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Radians as Arc Length over Radius

- Route: `/visual-proofs/trigonometry/radians-arc-radius`
- Status: `available`; Component: `RadiansArcRadiusProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Radians, Length, over, Radius with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Radians as Arc Length over Radius.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Arc Length Formula: s = r theta

- Route: `/visual-proofs/trigonometry/arc-length-formula`
- Status: `available`; Component: `ArcLengthFormulaProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Length, Formula, theta with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Arc Length Formula: s = r theta.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Trigonometric Graphs from the Unit Circle

- Route: `/visual-proofs/trigonometry/trig-graphs-from-unit-circle`
- Status: `available`; Component: `TrigGraphsFromUnitCircleProof`; Difficulty: `Intermediate`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Trigonometric, Graphs, from, Unit with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Trigonometric Graphs from the Unit Circle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Angle Addition Formula for Cosine

- Route: `/visual-proofs/trigonometry/cosine-angle-addition`
- Status: `available`; Component: `CosineAngleAdditionProof`; Difficulty: `Advanced`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Angle, Addition, Formula, Cosine with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Angle Addition Formula for Cosine.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Angle Addition Formula for Sine

- Route: `/visual-proofs/trigonometry/sine-angle-addition`
- Status: `available`; Component: `SineAngleAdditionProof`; Difficulty: `Advanced`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Angle, Addition, Formula, Sine with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Angle Addition Formula for Sine.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Double Angle Identities

- Route: `/visual-proofs/trigonometry/double-angle-identities`
- Status: `available`; Component: `DoubleAngleIdentitiesProof`; Difficulty: `Intermediate`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Double, Angle, Identities with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Double Angle Identities.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sine Rule / Law of Sines

- Route: `/visual-proofs/trigonometry/sine-rule-proof`
- Status: `available`; Component: `SineRuleProof`; Difficulty: `Advanced`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Sine, Rule, Sines with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sine Rule / Law of Sines.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Cosine Rule / Law of Cosines

- Route: `/visual-proofs/trigonometry/cosine-rule-proof`
- Status: `available`; Component: `CosineRuleProof`; Difficulty: `Advanced`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Cosine, Rule, Cosines with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Cosine Rule / Law of Cosines.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Complementary Angle Identities

- Route: `/visual-proofs/trigonometry/complementary-angle-identities`
- Status: `available`; Component: `ComplementaryAngleIdentitiesProof`; Difficulty: `Beginner`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Complementary, Angle, Identities with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Complementary Angle Identities.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area of a Triangle Using Sine: A = 1/2 ab sin C

- Route: `/visual-proofs/trigonometry/triangle-area-sine-formula`
- Status: `available`; Component: `TriangleAreaSineFormulaProof`; Difficulty: `Intermediate`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Triangle, Using, Sine with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area of a Triangle Using Sine: A = 1/2 ab sin C.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Small Angle Approximation: sin theta is approximately theta

- Route: `/visual-proofs/trigonometry/small-angle-approximation`
- Status: `available`; Component: `SmallAngleApproximationProof`; Difficulty: `Intermediate`
1. Add a learner-controlled angle model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Small, Angle, Approximation, theta with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Small Angle Approximation: sin theta is approximately theta.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Coordinate Geometry (coordinate-geometry)

#### Distance Formula

- Route: `/visual-proofs/coordinate-geometry/distance-formula`
- Status: `available`; Component: `DistanceFormulaProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Distance, Formula with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Distance Formula.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Midpoint Formula

- Route: `/visual-proofs/coordinate-geometry/midpoint-formula`
- Status: `available`; Component: `MidpointFormulaProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Midpoint, Formula with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Midpoint Formula.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Section Formula / Internal Division Formula

- Route: `/visual-proofs/coordinate-geometry/section-formula`
- Status: `available`; Component: `SectionFormulaProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Section, Formula, Internal, Division with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Section Formula / Internal Division Formula.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Slope Formula

- Route: `/visual-proofs/coordinate-geometry/slope-formula`
- Status: `available`; Component: `SlopeFormulaProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Slope, Formula with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Slope Formula.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Equation of a Line: y = mx + c

- Route: `/visual-proofs/coordinate-geometry/slope-intercept-line-equation`
- Status: `available`; Component: `SlopeInterceptLineEquationProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Equation, Line with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Equation of a Line: y = mx + c.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Point-Slope Form of a Line

- Route: `/visual-proofs/coordinate-geometry/point-slope-line-equation`
- Status: `available`; Component: `PointSlopeLineEquationProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Point, Slope, Form, Line with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Point-Slope Form of a Line.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Parallel Lines Have Equal Slopes

- Route: `/visual-proofs/coordinate-geometry/parallel-lines-slope`
- Status: `available`; Component: `ParallelLinesSlopeProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Parallel, Lines, Have, Equal with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Parallel Lines Have Equal Slopes.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Perpendicular Lines Have Slopes with Product -1

- Route: `/visual-proofs/coordinate-geometry/perpendicular-lines-slope`
- Status: `available`; Component: `PerpendicularLinesSlopeProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Perpendicular, Lines, Have, Slopes with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Perpendicular Lines Have Slopes with Product -1.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area of Triangle Using Coordinates

- Route: `/visual-proofs/coordinate-geometry/triangle-area-coordinates`
- Status: `available`; Component: `TriangleAreaCoordinatesProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Triangle, Using, Coordinates with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area of Triangle Using Coordinates.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Equation of a Circle

- Route: `/visual-proofs/coordinate-geometry/circle-equation`
- Status: `available`; Component: `CircleEquationProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Equation, Circle with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Equation of a Circle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Translation of Points

- Route: `/visual-proofs/coordinate-geometry/translation-of-points`
- Status: `available`; Component: `TranslationOfPointsProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Translation, Points with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Translation of Points.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Reflection Across Axes

- Route: `/visual-proofs/coordinate-geometry/reflection-across-axes`
- Status: `available`; Component: `ReflectionAcrossAxesProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Reflection, Across, Axes with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Reflection Across Axes.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Rotation About Origin

- Route: `/visual-proofs/coordinate-geometry/rotation-about-origin`
- Status: `available`; Component: `RotationAboutOriginProof`; Difficulty: `Intermediate`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Rotation, About, Origin with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Rotation About Origin.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Scaling / Dilation from Origin

- Route: `/visual-proofs/coordinate-geometry/scaling-dilation-origin`
- Status: `available`; Component: `ScalingDilationOriginProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Scaling, Dilation, from, Origin with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Scaling / Dilation from Origin.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Coordinate Proof of Pythagorean Theorem

- Route: `/visual-proofs/coordinate-geometry/coordinate-proof-pythagorean-theorem`
- Status: `available`; Component: `CoordinateProofPythagoreanProof`; Difficulty: `Beginner`
1. Add a learner-controlled diagram replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Coordinate, Proof, Pythagorean, Theorem with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Coordinate Proof of Pythagorean Theorem.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Calculus Visual Proofs (calculus)

#### Limit as x Approaches a Point

- Route: `/visual-proofs/calculus/limit-approaches-point`
- Status: `available`; Component: `LimitApproachesPointProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Limit, Approaches, Point with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Limit as x Approaches a Point.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Derivative as Slope of Tangent

- Route: `/visual-proofs/calculus/derivative-slope-of-tangent`
- Status: `available`; Component: `DerivativeSlopeOfTangentProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Derivative, Slope, Tangent with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Derivative as Slope of Tangent.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Secant Line Becoming Tangent Line

- Route: `/visual-proofs/calculus/secant-becomes-tangent`
- Status: `available`; Component: `SecantBecomesTangentProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Secant, Line, Becoming, Tangent with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Secant Line Becoming Tangent Line.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Power Rule for Derivatives

- Route: `/visual-proofs/calculus/derivative-power-rule`
- Status: `available`; Component: `DerivativePowerRuleProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Power, Rule, Derivatives with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Power Rule for Derivatives.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Product Rule Visual Intuition

- Route: `/visual-proofs/calculus/product-rule-visual-proof`
- Status: `available`; Component: `ProductRuleVisualProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Product, Rule, Visual, Intuition with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Product Rule Visual Intuition.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Chain Rule Visual Intuition

- Route: `/visual-proofs/calculus/chain-rule-visual-proof`
- Status: `available`; Component: `ChainRuleVisualProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Chain, Rule, Visual, Intuition with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Chain Rule Visual Intuition.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Mean Value Theorem

- Route: `/visual-proofs/calculus/mean-value-theorem`
- Status: `available`; Component: `MeanValueTheoremProof`; Difficulty: `Advanced`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Mean, Value, Theorem with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Mean Value Theorem.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Area Under a Curve by Riemann Sums

- Route: `/visual-proofs/calculus/riemann-sums-area-under-curve`
- Status: `available`; Component: `RiemannSumsAreaUnderCurveProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Area, Under, Curve, Riemann with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Area Under a Curve by Riemann Sums.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Definite Integral as Accumulated Area

- Route: `/visual-proofs/calculus/definite-integral-accumulated-area`
- Status: `available`; Component: `DefiniteIntegralAccumulatedAreaProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Definite, Integral, Accumulated, Area with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Definite Integral as Accumulated Area.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Fundamental Theorem of Calculus

- Route: `/visual-proofs/calculus/fundamental-theorem-of-calculus`
- Status: `available`; Component: `FundamentalTheoremCalculusProof`; Difficulty: `Advanced`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Fundamental, Theorem, Calculus with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Fundamental Theorem of Calculus.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Integration by Parts

- Route: `/visual-proofs/calculus/integration-by-parts-visual-proof`
- Status: `available`; Component: `IntegrationByPartsVisualProof`; Difficulty: `Advanced`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Integration, Parts with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Integration by Parts.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Derivative of sin x

- Route: `/visual-proofs/calculus/derivative-of-sine`
- Status: `available`; Component: `DerivativeOfSineProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Derivative with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Derivative of sin x.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Derivative of e^x

- Route: `/visual-proofs/calculus/derivative-of-exponential`
- Status: `available`; Component: `DerivativeOfExponentialProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Derivative with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Derivative of e^x.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Taylor Series Approximation

- Route: `/visual-proofs/calculus/taylor-series-approximation`
- Status: `available`; Component: `TaylorSeriesApproximationProof`; Difficulty: `Advanced`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Taylor, Series, Approximation with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Taylor Series Approximation.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Optimization: Maximum and Minimum from Derivative

- Route: `/visual-proofs/calculus/optimization-derivative-max-min`
- Status: `available`; Component: `OptimizationDerivativeMaxMinProof`; Difficulty: `Intermediate`
1. Add a learner-controlled graph-and-limit scene replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Optimization, Maximum, Minimum, from with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Optimization: Maximum and Minimum from Derivative.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Number Theory (number-theory)

#### Even and Odd Numbers as Pairing Patterns

- Route: `/visual-proofs/number-theory/even-odd-pairing`
- Status: `available`; Component: `EvenOddPairingProof`; Difficulty: `Beginner`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Even, Numbers, Pairing, Patterns with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Even and Odd Numbers as Pairing Patterns.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Divisibility as Equal Grouping

- Route: `/visual-proofs/number-theory/divisibility-equal-grouping`
- Status: `available`; Component: `DivisibilityEqualGroupingProof`; Difficulty: `Beginner`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Divisibility, Equal, Grouping with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Divisibility as Equal Grouping.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Prime Numbers as Non-Rectangular Arrays

- Route: `/visual-proofs/number-theory/primes-non-rectangular-arrays`
- Status: `available`; Component: `PrimesNonRectangularArraysProof`; Difficulty: `Beginner`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Prime, Numbers, Rectangular, Arrays with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Prime Numbers as Non-Rectangular Arrays.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Composite Numbers as Rectangular Arrays

- Route: `/visual-proofs/number-theory/composites-rectangular-arrays`
- Status: `available`; Component: `CompositesRectangularArraysProof`; Difficulty: `Beginner`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Composite, Numbers, Rectangular, Arrays with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Composite Numbers as Rectangular Arrays.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Fundamental Theorem of Arithmetic through Factor Trees

- Route: `/visual-proofs/number-theory/fundamental-theorem-arithmetic-factor-trees`
- Status: `available`; Component: `FundamentalTheoremArithmeticProof`; Difficulty: `Intermediate`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Fundamental, Theorem, Arithmetic, through with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Fundamental Theorem of Arithmetic through Factor Trees.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Euclid's Proof of Infinitely Many Primes

- Route: `/visual-proofs/number-theory/euclid-infinitely-many-primes`
- Status: `available`; Component: `EuclidInfinitelyManyPrimesProof`; Difficulty: `Intermediate`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Euclid's, Proof, Infinitely, Many with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Euclid's Proof of Infinitely Many Primes.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### GCD by Euclidean Algorithm

- Route: `/visual-proofs/number-theory/gcd-euclidean-algorithm`
- Status: `available`; Component: `GcdEuclideanAlgorithmProof`; Difficulty: `Intermediate`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Euclidean, Algorithm with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to GCD by Euclidean Algorithm.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### LCM by Grid Alignment

- Route: `/visual-proofs/number-theory/lcm-grid-alignment`
- Status: `available`; Component: `LcmGridAlignmentProof`; Difficulty: `Beginner`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Grid, Alignment with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to LCM by Grid Alignment.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Modular Arithmetic as Clock Arithmetic

- Route: `/visual-proofs/number-theory/modular-arithmetic-clock`
- Status: `available`; Component: `ModularArithmeticClockProof`; Difficulty: `Beginner`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Modular, Arithmetic, Clock, Arithmetic with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Modular Arithmetic as Clock Arithmetic.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Remainder Pattern Cycles

- Route: `/visual-proofs/number-theory/remainder-pattern-cycles`
- Status: `available`; Component: `RemainderPatternCyclesProof`; Difficulty: `Intermediate`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Remainder, Pattern, Cycles with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Remainder Pattern Cycles.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Divisibility by 3 and 9 using Digit Sum

- Route: `/visual-proofs/number-theory/divisibility-by-3-and-9-digit-sum`
- Status: `available`; Component: `DivisibilityBy3And9Proof`; Difficulty: `Intermediate`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Divisibility, using, Digit with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Divisibility by 3 and 9 using Digit Sum.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Why sqrt(2) is Irrational

- Route: `/visual-proofs/number-theory/irrationality-of-square-root-2`
- Status: `available`; Component: `IrrationalitySqrt2Proof`; Difficulty: `Intermediate`
1. Add a learner-controlled number model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for sqrt, Irrational with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Why sqrt(2) is Irrational.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Sequences and Series (sequences-and-series)

#### Arithmetic Progression as Equal Steps

- Route: `/visual-proofs/sequences-and-series/arithmetic-progression-equal-steps`
- Status: `available`; Component: `ArithmeticProgressionEqualStepsProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Arithmetic, Progression, Equal, Steps with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Arithmetic Progression as Equal Steps.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum of First n Natural Numbers

- Route: `/visual-proofs/sequences-and-series/sum-first-n-natural-numbers`
- Status: `available`; Component: `SumFirstNNaturalNumbersProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for First, Natural, Numbers with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum of First n Natural Numbers.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum of First n Odd Numbers

- Route: `/visual-proofs/sequences-and-series/sum-first-n-odd-numbers`
- Status: `available`; Component: `SumFirstNOddNumbersProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for First, Numbers with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum of First n Odd Numbers.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum of Arithmetic Progression

- Route: `/visual-proofs/sequences-and-series/sum-arithmetic-progression`
- Status: `available`; Component: `SumArithmeticProgressionProof`; Difficulty: `Intermediate`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Arithmetic, Progression with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum of Arithmetic Progression.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Geometric Progression as Repeated Scaling

- Route: `/visual-proofs/sequences-and-series/geometric-progression-repeated-scaling`
- Status: `available`; Component: `GeometricProgressionScalingProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Geometric, Progression, Repeated, Scaling with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Geometric Progression as Repeated Scaling.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum of Finite Geometric Series

- Route: `/visual-proofs/sequences-and-series/finite-geometric-series-sum`
- Status: `available`; Component: `FiniteGeometricSeriesSumProof`; Difficulty: `Intermediate`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Finite, Geometric, Series with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum of Finite Geometric Series.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Infinite Geometric Series Convergence

- Route: `/visual-proofs/sequences-and-series/infinite-geometric-series-convergence`
- Status: `available`; Component: `InfiniteGeometricSeriesConvergenceProof`; Difficulty: `Advanced`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Infinite, Geometric, Series, Convergence with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Infinite Geometric Series Convergence.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Triangular Numbers

- Route: `/visual-proofs/sequences-and-series/triangular-numbers`
- Status: `available`; Component: `TriangularNumbersProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Triangular, Numbers with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Triangular Numbers.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Square Numbers from Odd Number Layers

- Route: `/visual-proofs/sequences-and-series/square-numbers-odd-layers`
- Status: `available`; Component: `SquareNumbersOddLayersProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Square, Numbers, from, Number with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Square Numbers from Odd Number Layers.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Fibonacci Sequence by Tiling

- Route: `/visual-proofs/sequences-and-series/fibonacci-sequence-tiling`
- Status: `available`; Component: `FibonacciSequenceTilingProof`; Difficulty: `Intermediate`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Fibonacci, Sequence, Tiling with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Fibonacci Sequence by Tiling.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Fibonacci Spiral Approximation

- Route: `/visual-proofs/sequences-and-series/fibonacci-spiral-approximation`
- Status: `available`; Component: `FibonacciSpiralApproximationProof`; Difficulty: `Intermediate`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Fibonacci, Spiral, Approximation with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Fibonacci Spiral Approximation.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Sum of Fibonacci Numbers

- Route: `/visual-proofs/sequences-and-series/sum-of-fibonacci-numbers`
- Status: `available`; Component: `SumOfFibonacciNumbersProof`; Difficulty: `Intermediate`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Fibonacci, Numbers with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Sum of Fibonacci Numbers.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Binomial Coefficients and Pascal's Triangle

- Route: `/visual-proofs/sequences-and-series/pascal-triangle-binomial-coefficients`
- Status: `available`; Component: `PascalTriangleBinomialCoefficientsProof`; Difficulty: `Intermediate`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Binomial, Coefficients, Pascal's, Triangle with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Binomial Coefficients and Pascal's Triangle.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Visual Induction: Domino Growth

- Route: `/visual-proofs/sequences-and-series/visual-induction-domino-growth`
- Status: `available`; Component: `VisualInductionDominoGrowthProof`; Difficulty: `Beginner`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Visual, Induction, Domino, Growth with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Visual Induction: Domino Growth.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

#### Harmonic Series Growth Intuition

- Route: `/visual-proofs/sequences-and-series/harmonic-series-growth-intuition`
- Status: `available`; Component: `HarmonicSeriesGrowthIntuitionProof`; Difficulty: `Advanced`
1. Add a learner-controlled pattern model replay that can scrub the proof from setup to conclusion.
2. Expose live parameters for Harmonic, Series, Growth, Intuition with exact values and rounded display kept separate.
3. Add a Before/After comparison state so the invariant or transformed quantity is obvious.
4. Add draggable/clickable hotspots directly on the visual, with keyboard fallback controls.
5. Add one misconception checkpoint specific to Harmonic Series Growth Intuition.
6. Add a challenge mode that hides the next step and asks the learner to predict it.
7. Add a formula derivation trail that highlights the exact visual region or graph feature used by each symbol.
8. Add a resettable random example generator within safe bounds for repeated practice.
9. Add exportable snapshot/teacher mode with the current proof step, labels, and formula visible.
10. Add an Olympyard follow-up CTA using this proof as the visual explanation for a practice item.

### Probability Proofs (probability)

#### Probability Proofs Starter Visual Proof

- Route: `/visual-proofs/probability/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real simulation board instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Probability, Proofs, Starter, Visual visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Statistics Proofs (statistics)

#### Statistics Proofs Starter Visual Proof

- Route: `/visual-proofs/statistics/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real data display instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Statistics, Proofs, Starter, Visual visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Matrices and Linear Algebra (matrices-linear-algebra)

#### Matrices and Linear Algebra Starter Visual Proof

- Route: `/visual-proofs/matrices-linear-algebra/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real tile model instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Matrices, Linear, Algebra, Starter visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Vectors (vectors)

#### Vectors Starter Visual Proof

- Route: `/visual-proofs/vectors/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real vector field instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Vectors, Starter, Visual, Proof visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Complex Numbers (complex-numbers)

#### Complex Numbers Starter Visual Proof

- Route: `/visual-proofs/complex-numbers/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real number model instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Complex, Numbers, Starter, Visual visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Mensuration (mensuration)

#### Mensuration Starter Visual Proof

- Route: `/visual-proofs/mensuration/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real measurement scene instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Mensuration, Starter, Visual, Proof visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Conic Sections (conic-sections)

#### Conic Sections Starter Visual Proof

- Route: `/visual-proofs/conic-sections/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real conic construction instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Conic, Sections, Starter, Visual visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Inequalities (inequalities)

#### Inequalities Starter Visual Proof

- Route: `/visual-proofs/inequalities/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real comparison model instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Inequalities, Starter, Visual, Proof visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Logarithms and Exponents (logarithms-exponents)

#### Logarithms and Exponents Starter Visual Proof

- Route: `/visual-proofs/logarithms-exponents/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real growth scale instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Logarithms, Exponents, Starter, Visual visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Transformations and Symmetry (transformations-symmetry)

#### Transformations and Symmetry Starter Visual Proof

- Route: `/visual-proofs/transformations-symmetry/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real transformation grid instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Transformations, Symmetry, Starter, Visual visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

### Engineering Mathematics Proofs (engineering-mathematics)

#### Engineering Mathematics Proofs Starter Visual Proof

- Route: `/visual-proofs/engineering-mathematics/starter-visual-proof`
- Status: `coming-soon`; Component: `ComingSoonProof`; Difficulty: `Intermediate`
1. Create the first real applied system instead of leaving only the generic coming-soon card.
2. Define 5 to 7 proof steps with titles, focus labels, and learner-facing misconceptions.
3. Add at least two manipulable parameters that make Engineering, Mathematics, Proofs, Starter visible through change.
4. Include a live formula panel that updates when the learner changes the construction.
5. Add a prediction prompt before the final conclusion is revealed.
6. Add one visual check question and one numeric/symbolic check question.
7. Link the proof to the closest Olympyard practice lane for follow-up mastery.
8. Provide a teacher snapshot state for classroom projection.
9. Add keyboard alternatives for every interaction before launch.
10. Add focused tests for metadata, route load, and nonblank primary visual.

