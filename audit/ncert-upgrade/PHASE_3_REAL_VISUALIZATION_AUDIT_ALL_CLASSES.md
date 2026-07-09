# Phase 3 Real Visualization Audit - All Requested NCERT Classes

Date: 2026-07-09  
Scope: source-level audit of NCERT-facing coverage across Grade 7, Class 10, and Class 12 after Phase 2.

## Audit Standard

A page is counted as a real visualization only when students can manipulate, calculate, compare, construct, verify, or practice the concept visually. Explanation cards, teacher notes, and student prompts are useful, but they do not make a concept complete by themselves.

## Coverage Table

| Class | Chapter / Concept | Route | Current status | Issue | Required real visualization | Priority |
|---|---|---|---|---|---|---|
| Class 7 | Large Numbers Around Us | `/ncert/class-7-large-numbers-around-us` | Real visualization | Phase 2 page has place-value chart, number names, expanded form, rounding, comparison, and estimation challenge. | Add larger real-world data presets and more estimation drills. | P2 |
| Class 7 | Arithmetic Expressions | `/ncert/class-7-arithmetic-expressions` | Real visualization | Has safe parser and BODMAS steps; expression tree can be made richer. | Add draggable expression tree and more wrong-order simulations. | P1 |
| Class 7 | Decimal Operations | `/ncert/class-7-decimal-operations` | Real visualization | Has decimal alignment and operations; animation is still simple. | Add stronger base-10 block animation and word-problem deck. | P1 |
| Class 7 | Fraction Operations | `/ncert/class-7-fraction-operations` | Real visualization | Has fraction bars, LCM, comparison, simplification, and operations; division model can be clearer. | Add "how many groups?" division animation and number-line drag. | P1 |
| Class 7 | Constructions and Tilings | `/ncert/class-7-constructions-and-tilings` | Partial visualization | SVG construction board exists, but compass/ruler points are not directly draggable. | Add draggable compass arcs, ruler line placement, and construction validation. | P1 |
| Class 7 | Lines and Triangles | `/ncert/class-7-lines-and-triangles` | Real visualization | Has sliders and highlighted angle relationships; practice bank still limited. | Add angle-pair quiz mode and printable checks. | P2 |
| Class 7 | Integers | `/ncert/class-7-integers` | Partial visualization | Number-line movement exists, but integer multiplication/division sign rules are underbuilt. | Counter model, repeated jumps, sign-rule practice. | P1 |
| Class 7 | Fractions and Decimals | `/ncert/class-7-fractions-decimals` | Partial visualization | Strong concept page, but operations are now better handled in newer routes. | Link to fraction/decimal operation routes and add practice checking. | P2 |
| Class 7 | Comparing Quantities | `/ncert/class-7-comparing-quantities` | Real visualization | Percent/simple-interest lab exists; needs more NCERT context. | Discount, profit/loss, tax, simple-interest practice mode. | P2 |
| Class 7 | Rational Numbers | `/ncert/class-7-rational-numbers` | Partial visualization | Number-line placement exists; arithmetic operations need stronger guided practice. | Rational operation number-line and comparison drill. | P2 |
| Class 7 | Exponents and Powers | `/ncert/class-7-exponents` | Real visualization | Exponent blocks exist; standard-form practice is light. | Standard-form slider and law checker. | P2 |
| Class 7 | Simple Equations | `/ncert/class-7-simple-equations` | Real visualization | Balance equation lab exists; practice set is limited. | Add generated equation practice with inverse-operation feedback. | P1 |
| Class 7 | Algebraic Expressions | `/algebra` | Partial visualization | Generic algebra tools exist but not an NCERT Grade 7 expression-tiles route. | Like/unlike terms, substitution table, expression-tile simplifier. | P1 |
| Class 7 | Data Handling | `/probability-statistics` | Needs browser QA | Strong generic statistics page, but not a direct Grade 7 chapter route. | NCERT datasets, pictograph/bar graph builder, mean/median/mode checks. | P2 |
| Class 10 | Real Numbers | `/ncert/class-10-real-numbers` | Real visualization | Euclid/HCF/LCM lab exists; prime factor uniqueness needs more proof practice. | Factor tree uniqueness and HCF-LCM relation grid. | P1 |
| Class 10 | Polynomials | `/ncert/class-10-polynomials` | Real visualization | Graphical zeroes exist. | Add cubic presets and division algorithm stepper. | P2 |
| Class 10 | Zeroes and Coefficients | `/ncert/class-10-polynomial-zero-coefficients` | Real visualization | Root dragging and coefficient relation exists. | Add factor-to-standard-form practice mode. | P2 |
| Class 10 | Pair of Linear Equations | `/ncert/class-10-pair-linear` | Real visualization | Graph classification exists. | Add answer checking for no/unique/infinite solution cases. | P2 |
| Class 10 | Substitution and Elimination | `/ncert/class-10-linear-substitution-elimination` | Partial visualization | Stepper exists, but algebra line-by-line interaction is still limited. | Row operations, substitution replacement, and wrong-step detection. | P1 |
| Class 10 | Linear Consistency | `/ncert/class-10-linear-consistency` | Partial visualization | Ratio cards need clearer equation-coefficient view. | Ratio table tied to graph state. | P1 |
| Class 10 | Quadratic Equations | `/ncert/class-10-quadratic` | Real visualization | Quadratic roots and discriminant visual exists. | Add factorization and completing-square practice checks. | P2 |
| Class 10 | Arithmetic Progressions | `/ncert/class-10-arithmetic-progressions` | Real visualization | AP term and sum blocks exist. | Add derivation animation and word-problem presets. | P2 |
| Class 10 | BPT and Converse | `/ncert/class-10-triangle-bpt-converse` | Partial visualization | Triangle similarity lab exists but not a full theorem proof sequence. | Draggable DE parallel BC with live side ratios and converse check. | P1 |
| Class 10 | Similarity Criteria | `/ncert/class-10-similarity-criteria` | Partial visualization | Uses shared triangle lab; tabs can be stronger. | AA, SSS, SAS tabs with condition checklist. | P1 |
| Class 10 | Areas of Similar Triangles | `/ncert/class-10-areas-similar-triangles` | Partial visualization | Area ratio visual exists but needs proof/practice mode. | Area square-ratio animation and exercise checker. | P1 |
| Class 10 | Coordinate Geometry Section Formula | `/ncert/class-10-section-formula` | Real visualization | Section formula visual exists. | Add midpoint shortcut and triangle-area formula route. | P2 |
| Class 10 | Heights and Distances | `/ncert/class-10-heights-distances` | Real visualization | Single-angle tangent visual exists. | Add two-angle/two-position NCERT problems. | P1 |
| Class 10 | Circle Tangent Radius | `/ncert/class-10-circle-tangent-radius` | Partial visualization | Tangent visual exists; proof animation is thin. | Radius perpendicular tangent construction and proof steps. | P1 |
| Class 10 | Two Tangents | `/ncert/class-10-two-tangents` | Partial visualization | Cases and lengths exist, but RHS congruence proof needs stronger sequence. | Inside/on/outside cases, equal tangent proof, live measurements. | P1 |
| Class 10 | Sector and Segment Area | `/ncert/class-10-sector-segment-area` | Real visualization | Sector/segment model exists. | Add more shaded-region presets. | P2 |
| Class 10 | Composite Circle Regions | `/ncert/class-10-composite-circle-regions` | Partial visualization | Shared circle-area lab exists; builder is not yet full. | Ring, quadrant, semicircle, rectangle-circle composer. | P1 |
| Class 10 | Combination of Solids | `/ncert/class-10-combination-solids` | Partial visualization | Shared solids lab exists; true 3D manipulation is limited. | Exposed/hidden face stepper and object decomposition. | P1 |
| Class 10 | Recasting Solids | `/ncert/class-10-recasting-solids` | Partial visualization | Volume conservation shown; animation is limited. | Melt/recast animation and missing-dimension solver. | P1 |
| Class 10 | Frustum of Cone | `/ncert/class-10-frustum-cone` | Partial visualization | Frustum formulas shown; slicing visual can be stronger. | Cone slicing, slant height, CSA/TSA/volume panels. | P1 |
| Class 10 | Grouped Mean | `/ncert/class-10-grouped-mean-methods` | Real visualization | Grouped statistics lab exists. | Add editable table and answer-checking mode. | P1 |
| Class 10 | Grouped Mode | `/ncert/class-10-grouped-mode` | Real visualization | Modal-class detection exists. | Add editable table and NCERT problems. | P1 |
| Class 10 | Grouped Median | `/ncert/class-10-grouped-median` | Real visualization | Cumulative frequency and median class exists. | Add ogive and editable data table. | P1 |
| Class 10 | Special Trig Angles | `/ncert/class-10-special-trig-angles` | Real visualization | Special triangle builder exists. | Add flash-practice mode. | P2 |
| Class 10 | Probability | `/math-lab/probability` | Needs practice | Generic simulator exists. | NCERT sample-space cards and checkable event questions. | P2 |
| Class 12 | Relations and Functions | `/ncert/class-12-relations-functions` | Real visualization | New guided mapping, arrow, and matrix lab added in Phase 3. | Add deeper composition/inverse exercises. | P1 |
| Class 12 | Determinants | `/ncert/class-12-determinants` | Real visualization | New determinant area-scale/invertibility lab added in Phase 3. | Add 3 by 3 expansion, minors/cofactors table, and Cramer's rule details. | P1 |
| Class 12 | Continuity and Differentiability | `/ncert/class-12-continuity-differentiability` | Real visualization | New continuity/differentiability classifier added in Phase 3. | Add derivative-rule steppers. | P1 |
| Class 12 | Integration Methods | `/ncert/class-12-integration-methods` | Real visualization | New method chooser and shaded-area model added in Phase 3. | Add symbolic validation for each method. | P1 |
| Class 12 | Differential Equations | `/ncert/class-12-differential-equations` | Real visualization | New slope-field and solution-family lab added in Phase 3. | Add separable/linear DE algebra stepper. | P1 |
| Class 12 | Vectors and 3D Geometry | `/ncert/class-12-vectors-3d-geometry` | Real visualization | New dot/cross/projection guided lab added in Phase 3. | Add true 3D skew-line shortest distance scene. | P1 |
| Class 12 | Linear Programming | `/ncert/class-12-linear-programming` | Real visualization | Upgraded from generic feasible region to guided corner optimizer. | Add editable constraints and min/max toggle. | P1 |
| Class 12 | Bayes' Theorem | `/ncert/class-12-bayes-theorem` | Real visualization | New tree and posterior calculator added in Phase 3. | Add table mode and more context presets. | P1 |
| Class 12 | Inverse Trigonometric Functions | `/ncert/class-12-inverse-trig` | Real visualization | Upgraded to guided principal-value lab. | Add inverse-trig identity cards. | P2 |

## Scaffold-Heavy Or Partial Pages Found

- Grade 7 Constructions and Tilings: visual, but not yet a full draggable compass-straightedge tool.
- Grade 7 Algebraic Expressions: generic `/algebra` support exists, but no dedicated Grade 7 expression-tiles route.
- Class 10 triangle similarity routes: usable visual lab, but theorem-specific tabs/proof practice need strengthening.
- Class 10 circle tangent routes: usable visual lab, but proof animation and case handling should be stronger.
- Class 10 composite circles and solids: visual panels exist, but builder-style manipulation is still limited.
- Class 12 method chapters were previously mostly generic-tool coverage; Phase 3 adds direct NCERT guided visual pages.

## Highest-Value Implementation Chosen

The largest remaining gap after Grade 7 Phase 2 was Class 12 textbook-facing coverage. The app already had powerful general tools for calculus, matrices, vectors, probability, and 3D work, but students lacked direct NCERT routes with guided visual reasoning. Phase 3 therefore converts the Class 12 missing/partial routes into direct guided visualizations first.

## Remaining Risks

- Browser QA was not performed route-by-route in this audit pass.
- Several new Class 12 visuals are 2D guided approximations of advanced ideas; future phases should deepen them with full symbolic steppers and true 3D scenes where appropriate.
- Some Class 10 routes still need practice/checking even when their visual model exists.
