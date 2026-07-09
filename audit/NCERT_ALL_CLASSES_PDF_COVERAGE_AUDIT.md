# NCERT Mathematics PDF Coverage Audit

Date: 2026-07-09  
PDF folder audited: `C:\Users\saisa\Downloads\All`  
App audited: Math Universe Visualizations  
Audit type: Source-level curriculum coverage audit only. No application source code was modified for this audit.

## Scope

This audit compares the NCERT mathematics PDFs found in `C:\Users\saisa\Downloads\All` against the current app coverage in:

- `src/data/ncertConcepts.ts`
- `src/data/formulaLibrary.ts`
- `src/data/theoremLibrary.ts`
- `src/data/mathLabTools.ts`
- `src/visual-proofs/data/visualProofsIndex.ts`
- existing visual proof, theorem, formula, workspace, graphing, geometry, statistics, trigonometry, calculus, matrix, vector, and 3D routes

The folder contains PDF sets for:

| PDF prefix | Interpreted book | PDFs found | Audit status |
|---|---:|---:|---|
| `gegp1xx`, `gegp2xx` | Grade 7 Mathematics, Parts 1 and 2 | 17 PDFs plus one PNG | Audited |
| `jemh1xx` | Class 10 Mathematics | 18 PDFs | Audited |
| `lemh1xx`, `lemh2xx` | Class 12 Mathematics, Parts 1 and 2 | 19 PDFs | Audited |

## Coverage Legend

| Status | Meaning |
|---|---|
| Strong | Dedicated or clearly aligned formula/theorem/visualization/interactive coverage exists. |
| Partial | Generic support exists, but textbook-specific guided activity, theorem treatment, or exercise workflow is incomplete. |
| Weak | Only indirect support exists. Students would not easily find or practice the concept from the NCERT chapter. |
| Missing | No clear app coverage found in source-level audit. |
| N/A | A visual proof or formula is not naturally required for that item. |

## Executive Summary

| Class / Book | Chapters audited | Strong coverage | Partial coverage | Weak or missing coverage | Main conclusion |
|---|---:|---:|---:|---:|---|
| Grade 7, Parts 1 and 2 | 15 | 2 | 10 | 3 | Core tools exist, but new NCERT Grade 7 chapter-specific guided pages are mostly missing. |
| Class 10 | 14 plus 2 appendices | 11 | 5 | 0 | Best-covered syllabus. Recent NCERT concept pages close many gaps; still needs richer textbook exercise presets. |
| Class 12, Parts 1 and 2 | 13 plus appendices | 4 | 7 | 4 | Advanced generic tools exist, but several Class 12 chapters need dedicated NCERT workflows and theorem/proof pages. |

## High Priority Missing / Partial Areas

| Priority | Class | Area | Why it matters | Recommended build |
|---:|---|---|---|---|
| 1 | Grade 7 | Large Numbers Around Us | New NCERT chapter has no dedicated place-value experience. | Place-value grid for Indian/international systems, estimation, rounding, and large-number comparison. |
| 2 | Grade 7 | Arithmetic Expressions | Students need order-of-operations practice, not just a CAS. | Expression tree and bracket-order visualizer with step-by-step evaluation. |
| 3 | Grade 7 | Decimal operations | Existing fraction/decimal coverage is conceptual, not operation-focused. | Decimal grid and number-line operations for addition, subtraction, multiplication, and division. |
| 4 | Grade 7 | Constructions and Tilings | Generic geometry workspace is too open-ended for Grade 7. | Guided construction and tessellation/tiling tool. |
| 5 | Class 12 | Relations and Functions | No strong dedicated NCERT visual for relation types, composition, and invertibility. | Mapping-diagram lab for reflexive, symmetric, transitive, one-one, onto, composition, inverse. |
| 6 | Class 12 | Determinants | Formulas exist, but minors/cofactors/adjoint/inverse workflow is not textbook-guided. | Determinant operations and adjoint/inverse stepper. |
| 7 | Class 12 | Continuity and Differentiability | Calculus tools exist, but not enough theorem-level guided continuity/differentiability checks. | Continuity/differentiability classifier with corners, jumps, holes, chain/product/quotient rule panels. |
| 8 | Class 12 | Integration methods | Riemann/FTC coverage exists; method-specific integration practice is incomplete. | Substitution, partial fractions, integration by parts, and definite-integral properties stepper. |
| 9 | Class 12 | Differential Equations | Slope fields exist, but solving first-order first-degree equations is incomplete. | Separable and linear differential equation guided solver with slope-field verification. |
| 10 | Class 12 | 3D Geometry | Generic 3D workspace exists, but line equations, direction cosines, angles, and shortest distance need directed tools. | NCERT 3D line-and-distance visualizer with controls and worked presets. |

## Detailed Grade 7 Audit

Grade 7 PDFs identified from `gegp1xx` and `gegp2xx`.

| Book / PDF set | Chapter | Concept / theorem / formula | Formula coverage | Visual proof coverage | Visualization tool coverage | Interactive tool coverage | Status | Missing / recommended build |
|---|---|---|---|---|---|---|---|---|
| Grade 7 Part 1 | Large Numbers Around Us | Place value, number naming, estimation, comparison of large numbers | Partial through number-system formulas | N/A | Weak | Weak | Weak | Add a dedicated large-number place-value lab with Indian/international systems, commas, rounding, and estimation challenges. |
| Grade 7 Part 1 | Large Numbers Around Us | Addition/subtraction/multiplication/division with large numbers in contexts | Partial | N/A | Weak | Partial through general solver/workspace | Partial | Add word-problem presets with visual decomposition and unit labels. |
| Grade 7 Part 1 | Arithmetic Expressions | BODMAS/order of operations, brackets, expression value | Partial | N/A | Weak | Partial through CAS/algebra solver | Partial | Add expression tree visualizer, bracket animation, and step-by-step arithmetic evaluator. |
| Grade 7 Part 1 | Arithmetic Expressions | Arithmetic properties: commutative, associative, distributive | Partial | Partial via distributive area models | Partial | Partial | Partial | Add Grade 7 property cards with numeric examples before variables. |
| Grade 7 Part 1 | A Peek Beyond the Point | Decimal place value, tenths/hundredths/thousandths | Partial | N/A | Partial via fraction-decimal concept page | Partial | Partial | Add decimal grid/place-value board and compare-decimals activities. |
| Grade 7 Part 1 | A Peek Beyond the Point | Decimal addition/subtraction | Partial | N/A | Weak | Weak | Weak | Add base-10 block and number-line operation visualizer. |
| Grade 7 Part 1 | Expressions Using Letter-Numbers | Variables, constants, algebraic expressions, substitution | Partial | Partial via algebraic identities | Partial | Partial through simple equations/CAS | Partial | Add expression-building tiles and substitution table for Grade 7 language. |
| Grade 7 Part 1 | Parallel and Intersecting Lines | Parallel lines, intersecting lines, transversal angle relationships | Strong formulas/theorems in geometry library | Partial visual proofs for angle/line ideas | Strong via geometry constructor | Partial | Partial | Add simple angle explorer focused on Grade 7 terms and draggable transversal. |
| Grade 7 Part 1 | Number Play | Patterns, divisibility, number puzzles | Partial | Strong for divisibility, primes, remainders | Partial | Partial through Magic Maths | Partial | Add chapter-level number puzzle lab with divisibility and cryptarithm-style activities. |
| Grade 7 Part 1 | A Tale of Three Intersecting Lines | Triangle angle sum, exterior angle, side-angle reasoning | Strong | Strong visual proofs exist | Strong via geometry routes | Partial | Strong | Add NCERT Grade 7 route that points directly to triangle angle proof and simple exercises. |
| Grade 7 Part 1 | Working with Fractions | Equivalent fractions, comparison, operations | Partial | N/A | Partial via fraction-decimal page | Partial | Partial | Add fraction operations lab for add/subtract/multiply/divide with area and number-line models. |
| Grade 7 Part 2 | Geometric Twins | Congruence, matching shapes, transformations | Partial | Partial through geometry/transform proofs | Partial | Partial | Partial | Add drag-overlay congruence lab with reflection/rotation/translation matching. |
| Grade 7 Part 2 | Operations with Integers | Integer addition, subtraction, multiplication, division, sign rules | Partial | Partial | Partial via integer-line page | Partial | Partial | Add sign-rule model with counters/number line for multiplication and division. |
| Grade 7 Part 2 | Finding Common Ground | Factors, multiples, common factors, HCF, LCM | Strong | Strong via factor trees, GCD, LCM visual proofs | Strong | Partial | Strong | Add Grade 7 story presets and simpler language in the existing HCF/LCM tools. |
| Grade 7 Part 2 | Another Peek Beyond the Point | Decimal multiplication/division and scaling | Partial | N/A | Weak | Weak | Weak | Add decimal area model for multiplication and scale-shift model for division by powers of 10. |
| Grade 7 Part 2 | Connecting the Dots | Data handling, tables, averages, charts | Strong formulas | Strong statistics visual proofs | Strong statistics tools | Partial | Partial | Add Grade 7 datasets, pictograph/bar graph tasks, and mean/median/mode presets. |
| Grade 7 Part 2 | Constructions and Tilings | Compass-straightedge constructions, tilings, symmetry | Partial | Partial through geometry proofs | Partial through geometry constructor | Weak | Partial | Add guided construction mode and tiling/tessellation builder. |
| Grade 7 Part 2 | Finding the Unknown | Simple equations and unknown values | Strong for simple equations | Partial | Strong through balance equation concept page | Partial | Strong | Add more Grade 7 word-problem templates and instant answer-checking. |

### Grade 7 Overall Finding

The app has the mathematical foundations, but the Grade 7 NCERT PDF set needs more textbook-facing guided routes. The largest missing layer is not formulas; it is age-appropriate interactive scaffolding for the new chapter names.

## Detailed Class 10 Audit

Class 10 PDFs identified from `jemh1xx`.

| Book / PDF set | Chapter | Concept / theorem / formula | Formula coverage | Visual proof coverage | Visualization tool coverage | Interactive tool coverage | Status | Missing / recommended build |
|---|---|---|---|---|---|---|---|---|
| Class 10 | Real Numbers | Euclid's division algorithm | Strong | Strong via GCD Euclidean visual proof | Strong | Strong through NCERT concept page | Strong | Add more NCERT exercise presets. |
| Class 10 | Real Numbers | Fundamental theorem of arithmetic, prime factorization | Strong | Strong via factor tree proof | Strong | Strong | Strong | Add proof narration and practice checks. |
| Class 10 | Real Numbers | HCF-LCM relation | Strong | Strong via LCM/GCD visuals | Strong | Strong | Strong | Add mixed word-problem mode. |
| Class 10 | Real Numbers | Irrational numbers and proof of irrationality | Partial/Strong | Strong for sqrt(2), partial for general roots | Partial | Strong via new concept page | Strong | Add proofs for sqrt(3), sqrt(5), and general prime-root theorem. |
| Class 10 | Polynomials | Geometrical meaning of zeroes | Strong | Partial | Strong graphing | Strong via concept page | Strong | Add cubic/quadratic preset gallery matching NCERT examples. |
| Class 10 | Polynomials | Relationship between zeroes and coefficients | Strong | Partial | Strong | Strong via new concept page | Strong | Add visual derivation for alpha + beta and alpha beta from expanded factors. |
| Class 10 | Pair of Linear Equations | Graphical method, intersecting/parallel/coincident lines | Strong | Partial | Strong graphing | Strong | Strong | Add NCERT exercise presets and consistency summary table. |
| Class 10 | Pair of Linear Equations | Substitution and elimination methods | Partial | N/A | Partial | Strong via new linear-method stepper | Partial/Strong | Improve algebra step-by-step verification and method comparison. |
| Class 10 | Quadratic Equations | Standard form, factorization, quadratic formula | Strong | Strong for completing square/factorization | Strong | Strong concept page | Strong | Add factorization practice with hints. |
| Class 10 | Quadratic Equations | Nature of roots and discriminant | Strong | Partial | Strong | Strong | Strong | Add complex-root explanation, while marking beyond NCERT core. |
| Class 10 | Arithmetic Progressions | AP definition, nth term, sum of first n terms | Strong | Strong/Partial | Strong | Strong concept page | Strong | Add daily-life AP word problems. |
| Class 10 | Triangles | Similar figures and similar triangles | Strong | Strong via similar triangles proof | Strong | Strong through similarity lab pages | Strong | Add direct NCERT proof step pages for each criterion. |
| Class 10 | Triangles | BPT/converse, AA/SSS/SAS, areas of similar triangles | Strong | Partial/Strong | Strong | Strong through new concept pages | Strong | Add theorem-specific browser-tested routes. |
| Class 10 | Coordinate Geometry | Distance formula | Strong | Strong | Strong | Strong | Strong | Add coordinate worksheet generator. |
| Class 10 | Coordinate Geometry | Section formula | Strong | Strong | Strong | Strong concept page | Strong | Add midpoint as special-case callout. |
| Class 10 | Trigonometry | Ratios, reciprocal relations, identities | Strong | Strong | Strong trig lab | Strong | Strong | Add NCERT problem set mode for identities. |
| Class 10 | Trigonometry | Specific angles 0, 30, 45, 60, 90 | Strong | Partial | Strong | Strong new concept page | Strong | Add memorization/practice flash mode. |
| Class 10 | Applications of Trigonometry | Heights and distances | Strong | Partial | Strong | Strong concept page | Partial/Strong | Add two-angle/two-position problems and diagram labels. |
| Class 10 | Circles | Tangent at point of contact perpendicular to radius | Strong | Partial | Strong | Strong concept page | Partial/Strong | Add formal visual proof with congruent right-triangle reasoning. |
| Class 10 | Circles | Number and length of tangents from a point | Strong | Partial | Strong | Strong concept page | Partial/Strong | Add inside/on/outside point cases and theorem proof sequence. |
| Class 10 | Areas Related to Circles | Sector, segment, composite circular regions | Strong | Strong sector/circle proofs | Strong | Strong concept pages | Strong | Add NCERT shaded-area problem library. |
| Class 10 | Surface Areas and Volumes | Combination of solids | Strong | Partial | Strong 3D solids/workspace | Strong concept page | Partial/Strong | Add clearer hidden-face explanation and guided object decomposition. |
| Class 10 | Surface Areas and Volumes | Recasting solids, frustum of cone | Strong | Partial | Strong 3D solids/workspace | Strong concept pages | Partial/Strong | Add volume-conservation animation and frustum slicing proof. |
| Class 10 | Statistics | Mean, mode, median of grouped data | Strong | Strong statistics proofs | Strong | Strong new grouped-data pages | Strong | Add table-entry exercise mode. |
| Class 10 | Probability | Theoretical probability | Strong | Strong probability visual proofs | Strong simulator | Strong | Strong | Add NCERT event-card practice. |
| Class 10 Appendix | Proofs in Mathematics | Direct proof, converse, contradiction, reasoning structure | Partial | Partial | Partial | Strong new proof reasoning page | Partial | Add proof-builder with draggable statements and reasons. |
| Class 10 Appendix | Mathematical Modelling | Assumptions, variables, equations, interpretation | Partial | N/A | Partial | Strong new modelling page | Partial | Add modelling case studies from NCERT-style contexts. |

### Class 10 Overall Finding

Class 10 is the most complete NCERT match. The app now has direct concept pages for nearly every chapter, plus strong formula, theorem, visual proof, and interactive coverage. Remaining work is mostly polish: NCERT exercise presets, guided proofs for a few geometry theorems, and clearer problem-mode workflows.

## Detailed Class 12 Audit

Class 12 PDFs identified from `lemh1xx` and `lemh2xx`.

| Book / PDF set | Chapter | Concept / theorem / formula | Formula coverage | Visual proof coverage | Visualization tool coverage | Interactive tool coverage | Status | Missing / recommended build |
|---|---|---|---|---|---|---|---|---|
| Class 12 Part 1 | Relations and Functions | Types of relations: reflexive, symmetric, transitive, equivalence | Partial | Weak | Partial through set theory/logic tools | Partial | Weak/Partial | Add relation matrix and directed graph lab with property checkboxes. |
| Class 12 Part 1 | Relations and Functions | Types of functions: one-one, onto, bijective | Partial | Weak | Partial | Partial | Partial | Add mapping-diagram and graph-based function classifier. |
| Class 12 Part 1 | Relations and Functions | Composition and invertible functions | Partial | Weak | Partial | Weak | Weak/Partial | Add composition pipeline visual and inverse-function matching activity. |
| Class 12 Part 1 | Inverse Trigonometric Functions | Principal values, domains/ranges | Strong | Partial | Strong inverse trig graph concept page | Strong | Strong | Add textbook examples and principal-value decision tree. |
| Class 12 Part 1 | Inverse Trigonometric Functions | Properties of inverse trigonometric functions | Strong formulas | Weak/Partial | Partial | Partial | Partial | Add visual proof cards for identities such as sin^-1 x + cos^-1 x = pi/2. |
| Class 12 Part 1 | Matrices | Matrix notation, order, equality, types | Strong | Partial | Strong matrices lab | Strong | Strong | Add NCERT table-style practice and vocabulary quiz. |
| Class 12 Part 1 | Matrices | Addition, scalar multiplication, multiplication, transpose | Strong | Partial | Strong | Strong | Strong | Add animated row-column multiplication focus mode. |
| Class 12 Part 1 | Matrices | Symmetric, skew-symmetric, invertible matrices | Strong | Weak/Partial | Partial | Partial | Partial | Add decomposition A = symmetric + skew-symmetric and inverse check visual. |
| Class 12 Part 1 | Determinants | Determinant of 2x2/3x3 matrix | Strong | Partial | Strong matrices/determinant tools | Strong | Strong | Add sign-pattern and expansion animation. |
| Class 12 Part 1 | Determinants | Area of triangle by determinant | Strong | Strong coordinate triangle area proof | Strong | Strong | Strong | Add direct NCERT determinant-area route. |
| Class 12 Part 1 | Determinants | Minors, cofactors, adjoint, inverse | Strong formulas | Weak | Partial | Weak/Partial | Partial | Add minors/cofactors/adjoint/inverse stepper. |
| Class 12 Part 1 | Determinants | Applications: solving linear equations | Partial/Strong | Weak | Partial | Partial | Partial | Add Cramer's rule and matrix inverse solver with NCERT examples. |
| Class 12 Part 1 | Continuity and Differentiability | Continuity at a point and on intervals | Strong formulas | Partial | Strong calculus graphing | Partial | Partial | Add continuity classifier for hole/jump/removable/infinite cases. |
| Class 12 Part 1 | Continuity and Differentiability | Differentiability and derivative rules | Strong | Strong for derivative, power/product/chain rules | Strong derivatives tool | Strong | Strong | Add NCERT-specific derivative rule practice and proof links. |
| Class 12 Part 1 | Continuity and Differentiability | Exponential/logarithmic functions and logarithmic differentiation | Strong formulas | Partial | Partial | Weak/Partial | Partial | Add logarithmic differentiation stepper. |
| Class 12 Part 1 | Continuity and Differentiability | Parametric derivatives and second-order derivatives | Partial | Weak | Partial derivatives tool | Weak/Partial | Weak/Partial | Add parametric derivative and second derivative/concavity visual. |
| Class 12 Part 1 | Applications of Derivatives | Rate of change | Strong formulas | Partial | Strong derivatives tool | Partial | Partial | Add contextual rate-of-change templates. |
| Class 12 Part 1 | Applications of Derivatives | Increasing/decreasing functions | Strong | Partial | Partial | Partial | Partial | Add sign-chart and interval classifier. |
| Class 12 Part 1 | Applications of Derivatives | Maxima and minima | Strong | Strong optimization proof | Strong graphing | Partial | Partial/Strong | Add applied optimization problem templates. |
| Class 12 Part 2 | Integrals | Integration as inverse differentiation | Strong | Strong Riemann/integral proofs | Strong integration tool | Strong | Strong | Add NCERT exercise examples. |
| Class 12 Part 2 | Integrals | Substitution, partial fractions, by parts | Strong formulas | Strong for by parts only | Partial | Weak/Partial | Partial | Add method-specific symbolic/visual steppers. |
| Class 12 Part 2 | Integrals | Definite integrals, FTC, properties | Strong | Strong FTC/definite integral proofs | Strong | Partial | Strong/Partial | Add property-by-property visual toggles and symmetry presets. |
| Class 12 Part 2 | Application of Integrals | Area under simple curves | Strong | Strong Riemann/area proof | Strong integration tool | Partial | Partial/Strong | Add shaded-region presets for NCERT curves and area-between-curves mode. |
| Class 12 Part 2 | Differential Equations | Order, degree, general/particular solutions | Strong formulas | Weak/Partial | Partial slope-field | Partial | Partial | Add solution family visualizer with constants and initial condition. |
| Class 12 Part 2 | Differential Equations | First-order first-degree solving methods | Partial | Weak | Strong slope field for behavior | Weak/Partial | Weak/Partial | Add separable and linear DE stepper with verification by differentiation. |
| Class 12 Part 2 | Vector Algebra | Vector types, addition, scalar multiplication | Strong | Partial | Strong linear algebra/vector visualizer | Strong | Strong | Add NCERT vector presets and mobile-friendly controls. |
| Class 12 Part 2 | Vector Algebra | Dot product, cross product, projection | Strong | Partial | Strong 3D vector pane | Strong | Strong | Add geometric proof views for product formulas and projection. |
| Class 12 Part 2 | 3D Geometry | Direction cosines and direction ratios | Strong formulas | Weak | Partial via 3D workspace | Partial | Partial | Add line direction-cosine visual with axes and unit vector controls. |
| Class 12 Part 2 | 3D Geometry | Equation of a line in space | Strong formulas | Weak | Partial via 3D workspace | Partial | Partial | Add 3D line equation builder: vector, Cartesian, two-point forms. |
| Class 12 Part 2 | 3D Geometry | Angle between two lines and shortest distance | Strong formulas | Weak | Partial via 3D workspace | Weak/Partial | Weak/Partial | Add skew-line angle and shortest-distance visualization. |
| Class 12 Part 2 | Linear Programming | LPP formulation, feasible region, objective function | Strong | Partial | Strong feasible region concept page | Partial/Strong | Partial/Strong | Add constraint-entry solver, corner table, and maximize/minimize walkthrough. |
| Class 12 Part 2 | Probability | Conditional probability | Strong | Strong | Strong probability lab | Strong | Strong | Add NCERT data-table examples. |
| Class 12 Part 2 | Probability | Multiplication theorem and independent events | Strong | Strong | Strong | Strong | Strong | Add independence checker with Venn/tree/table modes. |
| Class 12 Part 2 | Probability | Bayes' theorem | Strong formulas | Partial | Partial | Weak/Partial | Partial | Add Bayes tree/table visual with posterior updates and textbook examples. |
| Class 12 Appendices | Proofs and Mathematical Modelling | Proof structure and modelling cycle | Partial | Partial | Partial | Partial | Partial | Reuse Class 10 proof/modelling pages with Class 12 examples and rigor. |

### Class 12 Overall Finding

Class 12 has strong raw capability in graphing, matrices, vectors, calculus, integration, probability, and 3D workspace. The missing layer is NCERT-specific guided pedagogy: theorem-level explanations, example presets, method steppers, and chapter routes that connect formulas to visual actions.

## Cross-App Coverage Matrix

| Curriculum area | Formula library | Theorem library | Visual proofs | Visualization tools | Interactive tools | Overall |
|---|---|---|---|---|---|---|
| Number theory and divisibility | Strong | Strong | Strong | Strong | Partial | Strong |
| Grade 7 arithmetic and decimals | Partial | N/A | Weak | Partial | Partial | Partial |
| Algebraic expressions and identities | Strong | Strong | Strong | Strong | Strong | Strong |
| Linear equations | Strong | Partial | Partial | Strong | Strong | Strong |
| Quadratics and polynomials | Strong | Strong | Strong | Strong | Strong | Strong |
| Geometry basics | Strong | Strong | Strong | Strong | Partial | Strong |
| Circles and tangents | Strong | Strong | Partial | Strong | Partial | Partial/Strong |
| Mensuration and solids | Strong | Partial | Partial | Strong | Partial | Partial/Strong |
| Coordinate geometry | Strong | Strong | Strong | Strong | Strong | Strong |
| Trigonometry | Strong | Strong | Strong | Strong | Strong | Strong |
| Statistics | Strong | Strong | Strong | Strong | Partial | Strong |
| Probability | Strong | Strong | Strong | Strong | Strong | Strong |
| Relations and functions | Partial | Partial | Weak | Partial | Partial | Partial |
| Matrices and determinants | Strong | Strong | Partial | Strong | Strong | Strong/Partial |
| Calculus | Strong | Strong | Strong | Strong | Strong | Strong |
| Differential equations | Partial | Partial | Weak | Strong | Partial | Partial |
| Vector algebra | Strong | Strong | Partial | Strong | Strong | Strong/Partial |
| 3D geometry | Strong | Partial | Weak | Partial | Partial | Partial |
| Linear programming | Strong | Partial | Partial | Strong | Partial | Partial/Strong |

## Concepts Most Clearly Covered

| Rank | Concept | Evidence in app | Notes |
|---:|---|---|---|
| 1 | Algebraic identities | Visual proof index and formula library | Strong visual model coverage. |
| 2 | Trigonometric ratios and identities | Trigonometry tools plus visual proofs | Good interactive and proof coverage. |
| 3 | Coordinate geometry formulas | Visual proofs and formula library | Distance, midpoint, section, slope, line, triangle area are present. |
| 4 | Class 10 real numbers | NCERT concept page plus number theory proofs | Strong for Euclid, HCF, LCM, FTA. |
| 5 | AP sequences | NCERT concept page plus sequence tools | Good visual and formula alignment. |
| 6 | Probability fundamentals | Probability lab plus visual proofs | Good from Class 10 through Class 12 basics. |
| 7 | Calculus basics | Derivatives, integration, visual proof index | Strong general capability. |
| 8 | Matrices | Matrix lab and formula/theorem coverage | Strong, but needs more guided determinant workflow. |
| 9 | 3D graphing and vectors | Linear algebra and workspace tools | Strong technology layer, weaker textbook scaffolding. |
| 10 | Statistics | Statistics formulas and grouped-data pages | Good Class 10 match. |

## Concepts Most Clearly Missing or Underbuilt

| Rank | Concept | Class | Current gap | Recommended page/tool |
|---:|---|---|---|---|
| 1 | Place value for large numbers | Grade 7 | No dedicated new-NCERT page | `/ncert/class-7-large-numbers-around-us` |
| 2 | Arithmetic expression order | Grade 7 | No visual expression evaluator | `/ncert/class-7-arithmetic-expressions` |
| 3 | Decimal operations | Grade 7 | Conceptual decimal page only | Decimal grid operations lab |
| 4 | Tilings and constructions | Grade 7 | Generic geometry only | Guided construction and tessellation page |
| 5 | Relations and functions | Class 12 | No dedicated relation/function classifier | Relation graph/mapping lab |
| 6 | Invertible functions and composition | Class 12 | No guided composition pipeline | Function composition/inverse visualizer |
| 7 | Minors, cofactors, adjoint, inverse | Class 12 | Formulas exist, weak workflow | Determinant/adjoint stepper |
| 8 | Logarithmic differentiation | Class 12 | Formula coverage only | Log differentiation stepper |
| 9 | Differential equation solving | Class 12 | Slope fields but weak solving workflow | DE method stepper |
| 10 | 3D line geometry and shortest distance | Class 12 | Generic workspace only | 3D line equation and skew-line distance lab |

## Recommended Build Roadmap

### Phase 1: Grade 7 New NCERT Alignment

| Build | Covers | Priority |
|---|---|---:|
| Large-number place-value lab | Large Numbers Around Us | High |
| Arithmetic expression tree/evaluator | Arithmetic Expressions | High |
| Decimal operations lab | A Peek Beyond the Point, Another Peek Beyond the Point | High |
| Fraction operations lab | Working with Fractions | Medium |
| Grade 7 angle and triangle explorer | Parallel/Intersecting Lines, Three Intersecting Lines | Medium |
| Guided construction and tiling tool | Constructions and Tilings | Medium |

### Phase 2: Class 12 Relations, Functions, Matrices, Determinants

| Build | Covers | Priority |
|---|---|---:|
| Relation property checker | Relations and Functions | High |
| Function classifier and inverse/composition lab | Relations and Functions | High |
| Matrix row-column multiplication focus mode | Matrices | Medium |
| Minors/cofactors/adjoint/inverse stepper | Determinants | High |
| Cramer's rule and matrix-equation solver | Determinants | Medium |

### Phase 3: Class 12 Calculus and Integration

| Build | Covers | Priority |
|---|---|---:|
| Continuity/differentiability classifier | Continuity and Differentiability | High |
| Logarithmic differentiation stepper | Continuity and Differentiability | High |
| Parametric derivative and second derivative tool | Continuity and Differentiability | Medium |
| Integration methods stepper | Integrals | High |
| Area-between-curves visual presets | Application of Integrals | Medium |

### Phase 4: Class 12 Differential Equations, Vectors, 3D, LPP, Probability

| Build | Covers | Priority |
|---|---|---:|
| Separable/linear DE guided solver | Differential Equations | High |
| Vector product geometric proof mode | Vector Algebra | Medium |
| 3D line equation and shortest-distance lab | 3D Geometry | High |
| LPP constraint-entry corner solver | Linear Programming | Medium |
| Bayes theorem tree/table simulator | Probability | Medium |

### Phase 5: NCERT Practice Layer

| Build | Covers | Priority |
|---|---|---:|
| Chapter-wise NCERT exercise presets | All classes | High |
| Formula-to-tool deep links | All formula-heavy chapters | Medium |
| Theorem-to-proof deep links | Geometry, algebra, calculus, probability | Medium |
| Teacher mode worksheets | All classes | Medium |
| Progress and mastery tracker | All classes | Low/Medium |

## Final Recommendations

1. Treat Class 10 as near classroom-pilot ready after browser QA and exercise presets.
2. Treat Grade 7 as conceptually supported but not yet textbook-aligned. Build the missing chapter-facing pages first.
3. Treat Class 12 as tool-rich but scaffold-light. Build guided steppers for relations/functions, determinants, calculus methods, differential equations, and 3D geometry.
4. Add a unified NCERT index by class and chapter so students can enter from textbook chapter names rather than tool names.
5. Add a coverage dashboard with columns for formula, theorem, proof, visualization, interactive practice, and assessment readiness.

## Audit Limitations

- This was a source-level audit, not a full manual browser QA pass for every route.
- PDF extraction was used to identify chapter structure and topics; scanned/low-text pages may hide some subtopics.
- Coverage status reflects available source modules and routes, not necessarily perfect UI quality.
- Existing uncommitted application changes were not modified during this documentation-only audit.
