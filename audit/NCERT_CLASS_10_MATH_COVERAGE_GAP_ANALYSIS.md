# NCERT Class 10 Mathematics Coverage Gap Analysis

Audit date: 2026-07-09

PDF source folder checked: `C:\Users\saisa\Downloads\jemh1dd`

PDFs inspected: `jemh101.pdf` through `jemh114.pdf`, plus `jemh1ps.pdf`, `jemh1a1.pdf`, `jemh1a2.pdf`, and `jemh1an.pdf`.

Primary NCERT structure source: extracted contents from `jemh1ps.pdf`, pages 11-13. The current 2026-27 textbook contains 14 chapters:

1. Real Numbers
2. Polynomials
3. Pair of Linear Equations in Two Variables
4. Quadratic Equations
5. Arithmetic Progressions
6. Triangles
7. Coordinate Geometry
8. Introduction to Trigonometry
9. Some Applications of Trigonometry
10. Circles
11. Areas Related to Circles
12. Surface Areas and Volumes
13. Statistics
14. Probability

App sources checked:

- `src/data/ncertConcepts.ts`
- `src/data/ncertGapAnalysis.ts`
- `src/data/formulaLibrary.ts`
- `src/data/theoremLibrary.ts`
- `src/data/mathLabTools.ts`
- `src/visual-proofs/data/visualProofsIndex.ts`
- `src/visual-proofs/proofs/**`
- `src/visualizations/**`
- selected route pages under `src/pages/**`

Legend:

- Yes: clearly present as a route, visual proof, formula, theorem, or interactive tool.
- Partial: broad coverage exists, but the exact NCERT Class 10 concept needs a more direct student-facing visual, stepper, or exercise mode.
- Missing: no clear dedicated coverage found.

| Concept name | Chapter name | Visual proofs | Theorems | Interactive tools | Formulas | Make or not / status | Gap / recommended build |
|---|---|---:|---:|---:|---:|---|---|
| Fundamental theorem of arithmetic | Real Numbers | Yes | Yes | Partial | Yes | Partial | Add a Class 10 prime-factor-tree visual that explicitly proves uniqueness and then connects HCF/LCM. |
| Euclid's division lemma / algorithm for HCF | Real Numbers | Yes | Yes | Yes | Yes | Yes | Existing `/ncert/class-10-real-numbers` and number-theory proofs cover this well; add NCERT exercise presets. |
| HCF and LCM relation | Real Numbers | Partial | Partial | Yes | Yes | Partial | Add a side-by-side prime factorization grid showing `HCF(a,b) * LCM(a,b) = a*b`. |
| Revisiting irrational numbers | Real Numbers | Partial | Partial | Partial | Yes | Partial | App has irrationality-style number-theory support, but needs a direct Class 10 proof set for `sqrt(2)`, `sqrt(3)`, `sqrt(5)` and decimal expansion reminders. |
| Geometrical meaning of zeroes of a polynomial | Polynomials | Partial | Partial | Yes | Yes | Yes | Existing polynomial graphing covers x-intercepts; improve with Class 10 examples for linear, quadratic, and cubic zero counts. |
| Relationship between zeroes and coefficients of quadratic polynomial | Polynomials | Partial | Partial | Partial | Yes | Partial | Add an interactive root-sum/product visual: move roots, watch `x^2 - (alpha+beta)x + alpha beta`. |
| Pair of linear equations: graphical solution | Pair of Linear Equations in Two Variables | Partial | Partial | Yes | Yes | Yes | Existing simultaneous-equations visual handles intersections; add Class 10 cases: intersecting, parallel, coincident. |
| Pair of linear equations: consistency conditions | Pair of Linear Equations in Two Variables | Partial | Partial | Partial | Yes | Partial | Add ratio condition cards for `a1/a2`, `b1/b2`, `c1/c2` tied to the graph state. |
| Substitution method | Pair of Linear Equations in Two Variables | Missing | Partial | Partial | Partial | Partial | Build a step-by-step substitution method panel with line-by-line algebra and graph verification. |
| Elimination method | Pair of Linear Equations in Two Variables | Missing | Partial | Partial | Partial | Partial | Build a row/scale/eliminate stepper for two-variable linear equations. |
| Quadratic equation definition and standard form | Quadratic Equations | Partial | Partial | Yes | Yes | Yes | Current quadratic tools cover this; add standard-form cleanup examples from NCERT. |
| Solution of quadratic equation by factorisation | Quadratic Equations | Yes | Partial | Yes | Yes | Yes | Existing factorization/area models help; add exact Class 10 factor-pair stepper. |
| Nature of roots using discriminant | Quadratic Equations | Partial | Partial | Yes | Yes | Yes | Existing quadratic root visual covers `D > 0`, `D = 0`, `D < 0`; add a dedicated theorem/proof card. |
| Arithmetic progression recognition | Arithmetic Progressions | Yes | Yes | Yes | Yes | Yes | Existing AP visual and sequence proofs cover equal differences; add NCERT pattern examples. |
| nth term of an AP | Arithmetic Progressions | Yes | Yes | Yes | Yes | Yes | Good coverage; add practice mode for finding `a`, `d`, `n`, or `a_n` from partial data. |
| Sum of first n terms of an AP | Arithmetic Progressions | Yes | Yes | Yes | Yes | Yes | Good visual proof coverage; add Gauss-pair animation in the NCERT route. |
| Similar figures | Triangles | Partial | Partial | Partial | Partial | Partial | Add visual sorting for same shape vs same size, scale factor, and corresponding sides. |
| Similarity of triangles | Triangles | Yes | Yes | Yes | Yes | Yes | Similar-triangles proofs exist; add NCERT theorem sequencing. |
| Basic proportionality theorem / Thales theorem | Triangles | Partial | Yes | Partial | Yes | Partial | Theorem draft exists, but needs a direct draggable triangle visual with `DE || BC` and side ratios. |
| Converse of basic proportionality theorem | Triangles | Missing | Partial | Missing | Partial | Partial | Add converse visual: adjust side division ratios until the inner segment becomes parallel. |
| Criteria for similarity: AA, SSS, SAS | Triangles | Partial | Yes | Partial | Partial | Partial | Add a three-tab interactive proof: AA, SSS, SAS with ratio/equal-angle checklist. |
| Areas of similar triangles | Triangles | Partial | Partial | Partial | Partial | Partial | Add visual showing area ratio equals square of corresponding side ratio. |
| Pythagoras theorem and converse | Triangles | Yes | Yes | Yes | Yes | Yes | Strong visual-proof coverage. Add direct Class 10 exercise presets. |
| Distance formula | Coordinate Geometry | Yes | Yes | Yes | Yes | Yes | Strong coverage through coordinate visual proofs and formula library. |
| Section formula | Coordinate Geometry | Yes | Yes | Yes | Yes | Yes | Strong coverage through `/ncert/class-10-section-formula` and coordinate proofs. |
| Trigonometric ratios in right triangles | Introduction to Trigonometry | Yes | Yes | Yes | Yes | Yes | Strong coverage through trigonometry lab and visual proofs. |
| Trigonometric ratios of specific angles | Introduction to Trigonometry | Partial | Partial | Partial | Yes | Partial | Formula library has special angles; add a 30-60-90 and 45-45-90 triangle builder with exact-value table. |
| Trigonometric identities | Introduction to Trigonometry | Yes | Yes | Yes | Yes | Yes | Strong broad coverage; add a Class 10 identity practice/checker mode. |
| Heights and distances | Some Applications of Trigonometry | Partial | Partial | Yes | Yes | Partial | `/ncert/class-10-heights-distances` exists; add two-angle and shadow/object presets from NCERT examples. |
| Tangent to a circle | Circles | Partial | Yes | Partial | Yes | Partial | Theorem drafts exist for tangent-radius; add a dedicated Class 10 draggable circle/tangent proof. |
| Number of tangents from a point on a circle | Circles | Missing | Partial | Partial | Partial | Partial | Add external-point tangent construction showing 0, 1, or 2 tangents based on point position. |
| Lengths of tangents from an external point are equal | Circles | Missing | Partial | Missing | Partial | Partial | Add a proof visual with two tangent segments, equal radii, RHS congruence, and live lengths. |
| Areas of sector of a circle | Areas Related to Circles | Yes | Partial | Yes | Yes | Yes | Sector area formula and proof exist; add degree/radian switch and NCERT examples. |
| Areas of segment of a circle | Areas Related to Circles | Partial | Partial | Partial | Yes | Partial | Formula exists, but a direct segment-area visual is needed: sector minus triangle. |
| Combination of plane figures involving circles | Areas Related to Circles | Missing | Missing | Partial | Partial | Partial | Add composite shaded-region tool for ring, sector, segment, and rectangle/circle combinations. |
| Surface area of a combination of solids | Surface Areas and Volumes | Yes | Partial | Yes | Yes | Partial | Mensuration proofs and 3D workspace exist; add a Class 10 combined-solids shell with exposed/hidden faces. |
| Volume of a combination of solids | Surface Areas and Volumes | Yes | Partial | Yes | Yes | Partial | Add explicit add/subtract volume visual for cylinder+cone, cube+hemisphere, etc. |
| Conversion of solids / recasting | Surface Areas and Volumes | Partial | Missing | Partial | Partial | Partial | Add invariant-volume recasting simulator: melt/recast one solid into another. |
| Frustum of a cone | Surface Areas and Volumes | Partial | Missing | Partial | Yes | Partial | Formula exists, but add direct frustum visual with slant height, curved surface area, total surface area, and volume. |
| Mean of grouped data: direct method | Statistics | Partial | Partial | Partial | Yes | Partial | Statistics dashboard exists; add grouped-frequency table stepper with `sum f_i x_i / sum f_i`. |
| Mean of grouped data: assumed mean method | Statistics | Missing | Missing | Missing | Yes | Partial | Formula exists; build assumed-mean table with deviations `d_i`. |
| Mean of grouped data: step-deviation method | Statistics | Missing | Missing | Missing | Partial | Missing | Add step-deviation table with `u_i = (x_i - A)/h`. |
| Mode of grouped data | Statistics | Partial | Partial | Partial | Partial | Partial | Add modal-class detector and formula stepper. |
| Median of grouped data | Statistics | Partial | Partial | Partial | Partial | Partial | Add cumulative-frequency ogive/median-class visual with formula substitution. |
| Theoretical probability | Probability | Yes | Yes | Yes | Yes | Yes | Strong coverage via probability simulator/proofs; add exact NCERT examples as presets. |
| Complement of an event | Probability | Yes | Yes | Yes | Yes | Yes | Already covered in probability visual proofs/formulas. |
| Elementary equally likely outcomes | Probability | Yes | Partial | Yes | Yes | Yes | Add NCERT cards/coins/dice examples with sample-space listing. |
| Proofs in mathematics: statement, theorem, proof | Appendix A1 | Partial | Yes | Partial | Partial | Partial | Theorem pages scaffold proofs; add a proof-language mini-course for Class 10 students. |
| Deductive reasoning | Appendix A1 | Partial | Yes | Partial | Partial | Partial | Logic module exists but is advanced; add a simpler NCERT proof reasoning path. |
| Negation, converse, contradiction | Appendix A1 | Partial | Yes | Yes | Yes | Partial | Mathematical logic module covers this; add school-level examples and visual proof links. |
| Mathematical modelling stages | Appendix A2 | Partial | Missing | Partial | Missing | Partial | Add modelling workflow page: real situation -> assumptions -> variables -> model -> solve -> interpret. |

## Summary

| Metric | Count |
|---|---:|
| NCERT Class 10 chapter sections/concepts audited | 49 |
| Strongly covered | 18 |
| Partially covered | 30 |
| Clearly missing | 1 |

The app has broad coverage for almost every Class 10 chapter, but several topics are only covered as advanced tools or generic formulas. The most important next step is to convert those into direct NCERT-style guided visuals.

## Top Missing Or Weak Concepts

1. Grouped-data statistics steppers: direct mean, assumed mean, step-deviation, mode, median.
2. Circle tangent theorem visuals: tangent-radius, two tangents from an external point, equal tangent lengths.
3. Segment area and composite circle-region visual tools.
4. Linear-equation algebraic methods: substitution and elimination steppers.
5. Triangle similarity details: BPT converse, AA/SSS/SAS tabs, areas of similar triangles.
6. Recasting/conversion of solids and frustum of cone as direct 3D visuals.
7. Specific-angle trigonometry builder for exact values.
8. Polynomial zero-coefficient relationship as a root-dragging visual.
9. Real-number irrationality proof set beyond a single `sqrt(2)` style proof.
10. Mathematical modelling appendix workflow.

## Recommended Build Priority

### Priority 0 - Board Exam Critical

- Grouped statistics mean/mode/median steppers.
- Circle tangent theorem visual proofs.
- Triangle BPT/converse and similarity criteria visuals.
- Substitution/elimination method steppers.

### Priority 1 - High Learning Value

- Segment area and composite circle-region tool.
- Recasting solids and frustum 3D visual.
- Polynomial zeroes/coefficient relationship visual.
- Special-angle trigonometry exact-value lab.

### Priority 2 - Completeness And Practice

- NCERT exercise presets for real numbers, AP, probability, coordinate geometry, and heights/distances.
- Class 10 theorem/practice cards linked from each chapter.
- Proof-language mini-course from Appendix A1.

### Priority 3 - Polish

- Chapter-wise NCERT dashboard with coverage badges.
- Printable teacher mode for each concept.
- Student checkpoints after every guided visual.

## Limitations

- This audit checked the PDFs and source files, but did not manually open every route in the browser.
- Status is based on source-level evidence and existing route/data names; some generic workspace functionality may solve a concept without being a dedicated NCERT learning experience.
- The table separates “formula exists” from “student-facing visual exists”; a formula alone is not considered complete visual coverage.
