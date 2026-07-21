# Math Universe: Concept Accuracy and Topic-Specific Strengthening Plan

## Purpose

This document is the execution roadmap for strengthening every major concept in Math Universe with:

- mathematically correct definitions, formulas, domains, assumptions, and edge cases;
- topic-specific examples instead of generic placeholder content;
- visualizations whose geometry and numerical output agree with the mathematics;
- grade-, syllabus-, and difficulty-aware explanations;
- deterministic validation, tests, and audit evidence.

The work is complete only when a learner can change inputs, see a correct visual response, understand why it happened, and verify the result independently.

## Two-phase delivery status

### Phase 1 — Core mathematics and shared accuracy foundation

Status: implemented in the application as of 18 July 2026.

- Shared typed concept schema, collection validator, stable IDs, domain/assumption/formula/invariant/oracle fields, sources, and misconception counterexamples.
- Traceability for all 44 planned rows across Algebra, Number Systems, Geometry, Trigonometry, and Calculus.
- 44 reviewed concept contracts, 308 topic-specific examples across seven learning modes, and 88 explicit misconception corrections.
- A collapsible “Accuracy & Examples” interface on every core-domain page.
- Independent executable oracles for lines, quadratics, systems, rational normalization, GCD/LCM/modulo, polynomials, triangle/circle/coordinate/similarity metrics, unit-circle and sinusoid invariants, eclipse disk geometry, derivatives, integration, area between curves, and Euler steps.
- Corrected high-risk visualizers for quadratics, simultaneous equations, Pythagoras, limit types, rational reduction, perfect-square classification, and eclipse angular geometry.
- Automated schema, roadmap, canonical example, invariant, boundary, type, lint, build, and browser checks.

Phase 1 deliberately establishes one accurate example for every required learning mode per concept. The larger example-bank targets in section 1.4 are Phase 2 content-depth work.

### Phase 2 — Whole-app depth, assessment, and certification

Status: not started.

- Expand every concept to the complete example counts in section 1.4 and add hints, worked solutions, scoring rules, and question generators.
- Apply the same contracts and executable oracle coverage to advanced domains, formula atlases, proof libraries, workspaces/tools, AR/XR, and curriculum routes.
- Add unit-aware data, localization review, keyboard and screen-reader equivalence, reduced-motion audits, and mobile visual baselines.
- Add curriculum mapping, reviewer workflow, provenance/edition metadata, analytics for misconception patterns, and release certification evidence.
- Remove or quarantine any advanced lab that cannot pass its mathematical, accessibility, and browser acceptance checks.

---

## 1. Standard required for every concept

Every concept page or lab must contain the following eleven layers.

### 1.1 Concept contract

- Canonical concept name and aliases.
- One precise definition and one learner-friendly definition.
- Prerequisites and concepts unlocked next.
- Target class/grade, board, difficulty, and estimated learning time.
- Symbols, units, notation conventions, and coordinate conventions.
- Domain, range, constraints, assumptions, and excluded cases.

### 1.2 Formula contract

- Canonical formula in structured data and rendered mathematics.
- Meaning and unit of every symbol.
- Equivalent forms and the conditions under which they are equivalent.
- Derivation or proof outline.
- Dimensional/unit check where applicable.
- Counterexample showing when the formula cannot be used.

### 1.3 Interactive model

- Controls must represent meaningful mathematical parameters.
- Valid input ranges must be justified by the concept, not chosen arbitrarily.
- The visual, formula, table, labels, and spoken explanation must update from the same state.
- Important invariants must remain true during animation.
- Degenerate and boundary states must be intentionally rendered.
- Reset, canonical examples, random valid examples, and shareable URL state must work.

### 1.4 Topic-specific examples

Each concept needs at least:

- 3 foundational numeric examples;
- 3 visual or geometric examples;
- 2 real-world examples with realistic values and units;
- 2 common-mistake examples;
- 2 boundary or counterexamples;
- 1 challenge example;
- 1 example connected to another concept.

### 1.5 Explanation layers

- What the learner should look at.
- What changes when each control moves.
- What remains invariant.
- Step-by-step reasoning.
- Real-world meaning.
- Common misconception and correction.
- “Try this” task with an observable success condition.

### 1.6 Assessment

- Recognition question.
- Calculation question.
- Interpretation question.
- Error-analysis question.
- Transfer/application question.
- Worked solution, hint ladder, expected misconception, and scoring rule.

### 1.7 Accuracy validation

- Independent reference implementation for computed results.
- Exact arithmetic where practical; controlled rounding only for display.
- Floating-point tolerance documented per concept.
- Property-based tests for invariants.
- Golden tests for canonical examples.
- Browser tests confirming controls update all dependent outputs.

### 1.8 Accessibility

- Keyboard-operable controls.
- Exact-value input alongside sliders.
- Text alternative for every important visual state.
- Color is never the only carrier of meaning.
- Animation can be paused and reduced motion is respected.
- Tables expose the same essential information as graphs.

### 1.9 Source and review policy

- School content: align terminology and scope with the applicable NCERT/board chapter.
- Advanced content: use a recognized textbook, standard, or primary mathematical reference.
- Store the source title, section, edition/version, and review date in concept metadata.
- A second reviewer must check definitions, examples, answer keys, and edge cases.

### 1.10 Evidence required before release

- Passing unit, property, integration, and route tests.
- Desktop and mobile screenshots for canonical and edge states.
- Formula/table/visual consistency report.
- Accessibility check.
- Content-review sign-off.

### 1.11 Suggested concept data shape

```ts
type StrengthenedConcept = {
  id: string;
  title: string;
  aliases: string[];
  definition: { precise: string; learner: string };
  prerequisites: string[];
  nextConcepts: string[];
  syllabus: { board: string; grade: string; chapter: string }[];
  notation: { symbol: string; meaning: string; unit?: string }[];
  assumptions: string[];
  domain: string;
  formulas: {
    latex: string;
    equivalentForms: string[];
    conditions: string[];
    derivationSteps: string[];
  }[];
  examples: ConceptExample[];
  misconceptions: { claim: string; correction: string; counterexample: string }[];
  controls: { id: string; meaning: string; min?: number; max?: number; step?: number }[];
  invariants: string[];
  validation: { oracle: string; tolerance?: number; properties: string[] };
  sources: { title: string; section: string; reviewedOn: string }[];
};
```

---

## 2. Algebra

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Expressions and identities | Distinguish expression, equation, identity, and polynomial. State commutative, associative, and distributive laws. | Tile/area models; substitution tables; integer, fractional, and symbolic coefficients; false-identity counterexamples. | Symbolic expansion and randomized substitution must agree. |
| Linear equations | Cover slope-intercept, point-slope, standard form, vertical lines, and constant functions. Do not assign a finite slope to a vertical line. | Taxi fare, temperature conversion, constant-speed travel, pricing and break-even datasets with units. | Two-point slope, intercepts, table, and plotted line must agree within `1e-9`. |
| Inequalities | Preserve/reverse the inequality correctly under operations; distinguish open and closed endpoints. | Number-line intervals, compound inequalities, budget constraints, sign-change mistakes. | Sample points from each displayed interval and verify the predicate. |
| Simultaneous equations | Classify unique, none, and infinitely many solutions using determinant/rank logic. | Cost/revenue, mixture, distance-time, and coordinate-intersection examples. | Algebraic solver, graph intersection, and residual substitution must agree. |
| Quadratics | Connect coefficients, axis, vertex, discriminant, factorization, and roots; handle `a = 0` as non-quadratic. | Projectile models with declared assumptions, rectangle-area problems, repeated/no-real-root examples. | Roots must satisfy the polynomial; Vieta relations and vertex formula must hold. |
| Polynomials | Correct degree rules, zero polynomial caveat, remainder/factor theorems, multiplicity, and end behavior. | Factor trees, sign charts, repeated roots, cubic/quartic graph families. | Synthetic division and direct evaluation must return the same remainder. |
| Sequences and series | Separate sequence from series; state indexing; distinguish finite/infinite and convergence conditions. | Arithmetic/geometric patterns, compound growth, bouncing-ball model with limitations. | Closed form and iterative generation must match for canonical terms. |
| Algebraic structures | Define closure, associativity, identity, inverse, commutativity, and operation domain precisely. | Valid/invalid Cayley tables, modular arithmetic groups, non-group monoids and semigroups. | Exhaustively test finite tables and show a concrete witness for every failed axiom. |
| Boolean algebra | Keep Boolean operations distinct from ordinary arithmetic; include duality and De Morgan laws. | Logic-gate tables, set-operation correspondence, simplification tasks. | Truth-table equivalence must validate every simplification. |

### Algebra deliverables

- Replace generic “cost model” text with units and context-specific data cards.
- Add vertical-line and `a = 0` boundary modes.
- Add residual checks beside every solved equation.
- Add identity-versus-equation misconception activities.

---

## 3. Number systems and arithmetic

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Natural, whole, integer, rational, irrational, real | Declare the convention for whether `0` is natural; visualize proper set containment. | Classification cards, number-line placement, ambiguous decimal examples. | Each example must satisfy exactly the intended hierarchy memberships. |
| Fractions and rational numbers | Cover equivalence, sign normalization, denominator nonzero, ordering, and operations. | Fraction strips, recipes, sharing, negative temperatures, unit fractions. | Exact rational arithmetic; never use rounded decimals as the answer oracle. |
| Decimals and percentages | Separate terminating, repeating, and non-terminating non-repeating decimals. | Money, tax, discount, percentage change, marks and population examples. | Fraction-decimal conversions checked with exact numerator/denominator logic. |
| Irrational numbers and surds | Explain why selected roots are irrational; simplify only valid radical expressions. | Spiral-of-Theodorus/number-line constructions, square-area examples, rationalization. | Squared constructed length must match the target integer within geometric tolerance. |
| Exponents and logarithms | State base/domain restrictions and distinguish `log(a+b)` from valid log laws. | Growth/decay, pH/decibel context with scope notes, scientific notation. | Exponential and logarithmic forms must invert each other on valid domains. |
| Factors, primes, HCF/GCD and LCM | Treat units, primes, `gcd(0,0)` convention, and sign normalization correctly. | Factor trees, Euclidean algorithm traces, schedule/cycle and grouping problems. | Prime-factor and Euclidean results must agree. |
| Modular arithmetic | Normalize residues, distinguish congruence from equality, and state modulus constraints. | Clocks, calendars, checksums and repeating cycles. | Congruent values must have difference divisible by the modulus. |

---

## 4. Geometry and mensuration

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Points, lines, rays, segments and angles | Use correct incidence and angle conventions; distinguish line from segment length. | Construction tasks, angle types, intersecting/parallel/perpendicular examples. | Geometry-kernel predicates must confirm displayed relationships. |
| Triangles | Enforce triangle inequality; classify by sides and angles; handle degenerate triangles. | Surveying, roof trusses, coordinate triangles, ambiguous classification cases. | Side lengths, angles, perimeter and area must cross-check. |
| Congruence and similarity | Separate congruence tests from similarity tests; do not present AAA as congruence. | Scale drawings, shadows, indirect height, transformed triangle pairs. | Corresponding angles and side ratios must be verified numerically. |
| Pythagoras theorem | Restrict to right triangles and include converse. | Construction diagonals, navigation distance, coordinate distance, non-right counterexample. | `a²+b²-c²` residual and right-angle predicate must agree. |
| Circles | Define radius, diameter, chord, tangent, secant, arc, sector and segment accurately. | Wheel/gear contexts, arc-length and sector-area datasets, tangent construction. | Point-on-circle and tangent-perpendicular invariants must remain true while dragging. |
| Circle theorems | Preserve hypotheses for inscribed angles, cyclic quadrilaterals, chords and power of a point. | Canonical diagrams plus deliberately invalid configurations. | Angle/product equalities validated after every drag. |
| Coordinate geometry | State coordinate system and distance metric; cover vertical slope. | Midpoint, section formula, polygon area, collinearity and locus tasks. | Analytic results must agree with geometry-kernel measurements. |
| Transformations and symmetry | Distinguish rigid transformations from scaling; preserve orientation rules. | Reflection lines, rotational symmetry, tessellations and matrix links. | Distance/angle/orientation invariants tested by transformation type. |
| 2D mensuration | Make units squared and distinguish perimeter from area. | Flooring, fencing, paint coverage, composite shapes and unit conversions. | Decomposition and closed-form area methods must agree. |
| 3D solids | Distinguish surface area, curved/lateral area and volume; use cubic units. | Packaging, tanks, cones, cylinders, spheres and composite solids. | Mesh-derived estimates and analytic formulas cross-checked at canonical dimensions. |
| Orthographic projections | Explain that different solids can share views and views can be insufficient. | Cube-stack front/top/side datasets, missing-view challenges. | Rendered 3D occupancy must reproduce each declared 2D projection. |
| Fractals | Distinguish finite iteration from mathematical limit; calculate count, scale and dimension correctly. | Sierpiński carpet/triangle iterations and natural-pattern comparisons. | Element count and area fraction checked by recurrence and direct generation. |

---

## 5. Trigonometry and waves

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Right-triangle ratios | Require a right triangle and clearly identify opposite/adjacent relative to the chosen angle. | Surveying, ramps, ladders and height-distance examples with units. | Side ratios and computed angle must reconstruct the triangle. |
| Unit circle | Use consistent radian/degree conversion, signs by quadrant and exact special-angle values. | Special-angle presets, reference-angle tasks and quadrant misconceptions. | Coordinates must satisfy `x²+y²=1`; `x=cos θ`, `y=sin θ`. |
| Trigonometric functions | State domain, range, period, zeros and asymptotes. | Function comparison, reciprocal functions, transformed graphs. | Sampled graph values checked against the numeric function implementation. |
| Identities | Separate identities from conditional equations and state denominator restrictions. | Visual proofs, algebraic proofs and invalid cancellation examples. | Random valid-angle substitution plus symbolic equivalence. |
| Inverse trigonometry | State principal branches and distinguish reciprocal notation from inverse functions. | Angle recovery, navigation bearings and branch-choice examples. | Composition rules checked only on the correct restricted domains. |
| Sine/cosine waves | Define amplitude, period, frequency, angular frequency, phase and offset consistently. | Audio, AC circuits, tides and seasonal cycles using labeled units. | Graph period and extrema measured from generated samples. |
| Eclipse trigonometry | Label the model as an approximation; distinguish physical size, distance and angular diameter. | Sun/Moon angular-size datasets with provenance and scenario ranges. | Angular-diameter computation checked independently; unrealistic scale clearly disclosed. |

---

## 6. Calculus

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Limits | Distinguish value from limit; cover one-sided limits, infinity, holes and nonexistence. | Tables and graphs approaching removable, jump, infinite and oscillatory cases. | Numeric estimates must never override the analytic classification. |
| Continuity | State point and interval conditions; distinguish removable, jump and infinite discontinuities. | Piecewise functions and parameter-selection tasks. | Function value and both one-sided limits checked independently. |
| Derivatives | Define as a limit and rate of change; handle nondifferentiable points and domain endpoints. | Motion, marginal cost, tangent slope and optimization examples. | Symbolic derivative, finite-difference estimate and graph tangent compared with declared tolerance. |
| Derivative rules | Include hypotheses and prevent invalid product/quotient/chain-rule simplifications. | Rule selector, worked derivations and error-analysis cards. | Symbolic differentiation and numeric sampling cross-check. |
| Applications of derivatives | Separate local/global extrema and include endpoint tests and units. | Optimization, related rates, motion and curve sketching. | Candidate points evaluated and classified, not merely found. |
| Integration | Distinguish antiderivative, definite integral and signed area. | Accumulation, velocity-distance, work and probability-density examples. | Symbolic antiderivative derivative-check plus numeric quadrature. |
| Area between curves | Determine intersections and upper/lower function by interval. | Multi-intersection and sign-changing examples. | Partitioned integral and numeric area must agree. |
| Series | Define partial sums and convergence; do not imply finite animation proves convergence. | Geometric, harmonic, alternating and factorial-decay series. | Partial sums checked against closed forms/bounds where available. |
| Differential equations and slope fields | State equation, solution family and initial condition; distinguish field from solution curve. | Growth/decay, cooling and motion models with assumption notes. | Numerical trajectory residual checked against the differential equation. |

---

## 7. Complex numbers

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Complex plane | Correctly map `a+bi` to `(a,b)` and distinguish modulus from components. | Quadrant placement, conjugates, modulus and argument datasets. | `|z|²=a²+b²` and conjugate product invariants. |
| Polar form | Define argument branch convention and behavior at zero. | Rectangular-polar conversions across all quadrants. | Round-trip conversion with angle normalization. |
| Complex multiplication | Show modulus multiplication and argument addition. | Rotations, roots of unity and phasor examples. | Cartesian product and polar product must agree. |
| Euler formula | Connect exponential, trig and geometric rotation; state radians. | Animated unit-circle derivation and special angles. | Magnitude remains one and coordinates match sine/cosine. |
| Powers and roots | Explain all `n` distinct roots and angular spacing. | Roots-of-unity polygons and De Moivre examples. | Raising each generated root to `n` must recover the original value. |

---

## 8. Combinatorics

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Addition and multiplication principles | Make mutually exclusive/sequential conditions explicit. | Outfit, route and code-construction trees. | Enumerated outcomes must match the formula for small cases. |
| Permutations | Distinguish with/without repetition, circular arrangements and identical objects. | Seating, rankings, strings and repeated-letter words. | Brute-force enumeration for small `n`. |
| Combinations | Explain order irrelevance and relationship to permutations. | Teams, selections, committees and subset models. | Pascal recurrence and factorial form must agree. |
| Binomial theorem | Connect coefficients, combinations and expansion terms. | Pascal triangle, coefficient extraction and probability links. | Expanded polynomial coefficients checked symbolically. |
| Inclusion-exclusion | State universe and overlap terms clearly. | Survey/set counts for two and three sets. | Direct finite-set enumeration must match the formula. |

---

## 9. Set theory, relations and functions

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Sets and operations | Define universe; distinguish element from subset; handle empty set correctly. | Roster/set-builder conversions and Venn-operation datasets. | Direct membership enumeration verifies every shaded region. |
| Relations | Test reflexive, symmetric, antisymmetric and transitive independently. | Ordered-pair, matrix and directed-graph representations. | Exhaustive finite-domain property checks with failure witnesses. |
| Equivalence relations | Connect equivalence classes and partitions. | Congruence modulo `n`, same-remainder and grouping examples. | Classes must be disjoint and cover the domain. |
| Partial orders and Hasse diagrams | Separate antisymmetric from asymmetric; remove transitive edges correctly. | Divisibility and subset-poset examples. | Reachability in the Hasse diagram must reproduce the order relation. |
| Functions | Define domain, codomain and range; distinguish injective, surjective and bijective. | Mapping diagrams, formula functions and real datasets. | Every domain element has exactly one image; classification computed from mappings. |

---

## 10. Mathematical logic

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Propositions and connectives | Define precedence and distinguish inclusive OR from XOR. | Natural-language translation and circuit examples. | Generated truth table is the oracle for compound statements. |
| Implication and equivalence | Explain converse, inverse and contrapositive without conflation. | Conditional statement classification and countermodels. | Equivalence checked across all valuations. |
| CNF and DNF | Distinguish canonical and simplified forms. | Truth-table-to-expression transformations. | Original and transformed forms must match every row. |
| Rules of inference | Separate valid form from truth of premises. | Short proof chains and invalid-argument counterexamples. | Model search must find a counterexample for invalid arguments. |
| Predicate logic | State universe, free/bound variables and quantifier scope. | Finite-domain models and quantifier-negation tasks. | Evaluate formulas exhaustively on small finite domains. |

---

## 11. Vectors, matrices and linear algebra

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Vectors | Distinguish vector, point and scalar; define magnitude and zero-vector angle caveat. | Force, velocity, displacement and coordinate examples. | Component and geometric operations must agree. |
| Dot product | Connect algebraic and geometric definitions; handle zero vectors. | Work, projection and angle examples with units. | `u·v = |u||v|cos θ` checked when both vectors are nonzero. |
| Cross product | Restrict standard visualization to 3D; explain orientation/right-hand rule. | Torque, area and normal-vector examples. | Result perpendicularity and magnitude-area invariants. |
| Matrix operations | Enforce dimension compatibility and noncommutativity. | Data transforms, systems and composition examples. | Reference kernel comparison plus dimension-error tests. |
| Determinant | Connect scaling/orientation and singularity; avoid treating it as mere procedure. | 2D area and 3D volume transformations. | Formula, elimination and geometric scale must agree. |
| Inverse and rank | State invertibility conditions and distinguish exact from numerical near-singularity. | Singular, nonsingular and ill-conditioned matrices. | `AA⁻¹` residual and rank comparison with documented tolerance. |
| Linear systems | Classify consistency using rank; expose residuals. | Unique, underdetermined and inconsistent systems. | Substitution residual for every returned solution. |
| Linear transformations | Keep basis and coordinate convention explicit. | Rotation, reflection, shear, projection and scaling. | Linearity tests and expected invariant checks. |
| Eigenvalues/eigenvectors | Explain nonzero eigenvector requirement and complex-eigenvalue cases. | Stretch directions, Markov/PageRank-style and vibration examples. | Residual norm `||Av-λv||` shown and tested. |
| Basis and span | Define independence, spanning and dimension. | 2D/3D vector-set classification and coordinate conversion. | Rank-based oracle and reconstructed-vector check. |

---

## 12. Statistics and probability

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Descriptive statistics | Distinguish population/sample and robust/non-robust measures. | Small transparent datasets plus realistic school, weather and measurement data. | Direct calculation and reference statistics kernel comparison. |
| Variance and standard deviation | Declare population versus sample denominator; keep units clear. | Same-mean/different-spread and outlier datasets. | Sum-of-squares identity and reference calculation. |
| Charts and distributions | Match chart type to data type; prevent misleading axes and bins. | Categorical, discrete and continuous datasets. | Frequencies/proportions must sum correctly. |
| Probability foundations | Define sample space and equally likely assumption when used. | Coins, dice, cards, spinners and non-uniform examples. | Exact enumeration for finite spaces. |
| Conditional probability | Keep conditioning event nonzero and distinguish `P(A|B)` from `P(B|A)`. | Medical-test, manufacturing and selection-tree examples. | Contingency table, tree and formula must agree. |
| Bayes theorem | Include base rates and normalized posterior. | Diagnostic and spam-filter examples using clearly synthetic data unless sourced. | Posterior probabilities sum to one. |
| Random variables and distributions | Declare support and parameters; distinguish PDF, PMF and CDF. | Binomial, normal and uniform datasets with applicability conditions. | Normalization, mean and variance checked numerically/analytically. |
| Regression and correlation | Distinguish association from causation; expose residuals and outliers. | Linear and deliberately nonlinear datasets. | Coefficients and `R²` checked against a reference implementation. |

---

## 13. Graph theory and discrete mathematics

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Graph fundamentals | Distinguish simple, directed, weighted and multigraph models. | Social, road, dependency and communication networks. | Degree sums and adjacency representation cross-check. |
| BFS and DFS | Show queue/stack state and traversal dependence on neighbor order. | Maze, reachability and component examples. | Visited set and parent tree checked against reference algorithms. |
| Shortest paths | Reject invalid algorithm/weight combinations; explain negative weights. | Road and routing networks with disconnected cases. | Path weight and relaxation invariants verified. |
| Minimum spanning trees | Distinguish MST from shortest-path tree and handle disconnected graphs as forests. | Network cabling and connection-cost datasets. | Kruskal and Prim total weights must agree. |
| Euler and Hamilton concepts | Use correct necessary/sufficient conditions and avoid conflating them. | Route-tracing and visiting problems. | Degree-condition check plus explicit path/circuit validation. |
| Coloring and planarity | Distinguish greedy coloring result from chromatic number. | Scheduling and map-coloring datasets. | Edge constraints checked for every coloring. |
| Automata | Define alphabet, states, transitions, start and accept states. | DFA/NFA string-recognition datasets and conversion tasks. | Simulator trace and reference transition function agree. |
| Grammars | State grammar type and derivation direction. | Parse trees, ambiguous grammars and language examples. | Generated strings checked against bounded derivations. |
| Turing machines | Define tape, head, transition and halting behavior; disclose bounded simulation. | Unary arithmetic and recognition examples. | Step trace must follow the transition table exactly. |
| Complexity | Separate empirical runtime from asymptotic class and specify input size. | Sorting/searching operation counts and growth comparison. | Counted operations compared with derived bounds for controlled inputs. |

---

## 14. AI, engineering and real-life mathematics

| Concept | Accuracy work | Topic-specific data and examples | Validation |
|---|---|---|---|
| Gradient descent | Define objective, gradient, learning rate and stopping rule; show divergence cases. | Convex bowl, ill-conditioned valley and simple regression loss. | Loss/gradient checked analytically and by finite differences. |
| Neural networks | Separate inference, activation and training; avoid claiming visual toy models represent full AI systems. | Small transparent networks with inspectable weights. | Forward pass checked layer by layer. |
| Signal processing | State sampling rate, frequency, phase and aliasing limitations. | Audio-like synthetic signals, Fourier components and filters. | Time/frequency reconstruction error measured. |
| Robotics and transformations | Keep frames, units and rotation order explicit. | 2D/3D arm, pose and coordinate-frame scenarios. | Forward transform and inverse reconstruction residual. |
| Engineering simulations | State model assumptions, boundary conditions and approximation method. | Domain-specific scenarios with realistic units and parameter ranges. | Conservation/residual checks appropriate to the model. |
| Cryptography examples | Distinguish educational ciphers from secure modern cryptography. | Modular arithmetic, Caesar/RSA toy examples with explicit security warning. | Encode/decode round trip and modular constraints. |

---

## 15. Formula, theorem and visual-proof libraries

### Formula library

- Deduplicate formulas by canonical concept ID.
- Add symbol definitions, units, assumptions, domain and equivalent forms.
- Connect every formula to at least one visualizer and one worked example.
- Mark school-level versus advanced scope.
- Add invalid-use and limiting-case examples.

### Theorem library

- Store hypotheses separately from conclusion.
- Add prerequisite definitions and named lemmas.
- Provide proof outline, full proof, visual intuition and counterexample when a hypothesis is removed.
- Validate diagrams against theorem hypotheses before displaying “verified.”

### Visual proofs

- Separate illustration from proof: state what the animation demonstrates and what still requires reasoning.
- Lock required invariants while allowing meaningful exploration.
- Add a proof-step state machine with previous/next/reset.
- Add text-only proof and accessible diagram description.
- Test every step against the underlying mathematical model.

---

## 16. Calculators, solvers and workspaces

### Scientific calculator

- Publish operator precedence, angle-mode and domain conventions.
- Add exact versus approximate result labeling.
- Reject undefined expressions with specific explanations.
- Create golden tests for arithmetic, trig, logs, powers and factorials.

### Step-by-step problem solver

- Classify intent before solving and expose the classification.
- Validate the parsed expression and assumptions.
- Verify the final answer by substitution, differentiation, integration or numeric recomputation as appropriate.
- Never fabricate steps when the solver cannot establish a transformation.
- Add domain-specific examples instead of one universal example list.

### Graphing and function tools

- Parse supported syntax consistently across tools.
- Detect discontinuities instead of connecting across asymptotes.
- Show domain restrictions, intercepts, extrema and sampled-table values.
- Add viewport-independent numeric verification.

### Geometry constructor

- Build objects from constraints rather than approximate screen positions.
- Recalculate dependencies after drag.
- Detect invalid/degenerate constructions.
- Verify claimed parallel, perpendicular, tangent, equal-length and incidence relations.

### CAS, tables and data workspace

- Preserve exact forms where possible.
- Attach assumptions and variable domains to symbolic results.
- Validate transformations and expose unsupported operations.
- Keep spreadsheet, plot and CAS values synchronized from one object model.

### AR/XR lab

- Use explicit world units and scale calibration.
- Separate mathematical coordinates from camera/device coordinates.
- Provide non-AR fallback for every activity.
- Label approximate placement and device-sensor limitations.
- Test surface equations and solid measurements independently of rendering.

---

## 17. Practice, quizzes and learning progression

### Question-bank requirements

- Tag every item by concept, subskill, grade, difficulty and misconception.
- Store a deterministic answer, solution path, hints and scoring rubric.
- Parameterized questions must generate only valid, solvable values.
- Distractors must correspond to known mistakes, not random numbers.
- Prevent duplicates across a practice session.

### Difficulty model

- Foundational: identify, represent and perform one-step reasoning.
- Intermediate: connect representations and perform multi-step reasoning.
- Advanced: prove, generalize, analyze errors and solve unfamiliar applications.

### Progress and mastery

- Separate visit, interaction, completion, accuracy and durable mastery.
- Do not award mastery for opening a page.
- Use spaced review based on item-level evidence.
- Explain why an adaptive activity was recommended.

### Olympyard and mock tests

- Validate each item against its topic and intended technique.
- Time limits must not change mathematical scoring.
- Provide post-test concept analysis, not only a total score.
- Audit generated variants for ambiguity and multiple correct answers.

---

## 18. Syllabus and NCERT strengthening

- Map each concept ID to board, class, chapter, exercise and learning outcome.
- Keep textbook terminology while adding a plain-language explanation.
- Separate textbook-required content from enrichment content.
- Add canonical NCERT-style examples without copying protected question text verbatim.
- Verify formula conventions, notation and grade appropriateness.
- Add chapter prerequisites, next steps and board-exam misconception tags.
- Maintain a coverage matrix: `syllabus outcome → explanation → visualizer → example → practice → test`.

---

## 19. Implementation sequence

### Phase 1: Inventory and contracts

- Assign a stable concept ID to every page, lab, formula, theorem, example and question.
- Identify duplicate, orphaned and conflicting concepts.
- Create the shared concept data schema.
- Record sources and reviewers.

### Phase 2: Core correctness

- Prioritize Algebra, Number Systems, Geometry, Trigonometry and Calculus.
- Correct definitions, formulas, domains, edge cases and answer keys.
- Add independent computation oracles and invariant tests.

### Phase 3: Topic-specific content

- Replace generic examples with the required example set for each concept.
- Add realistic units, datasets, labels and context assumptions.
- Add misconceptions and counterexamples.

### Phase 4: Advanced domains

- Strengthen Linear Algebra, Statistics, Probability, Sets, Logic, Graph Theory, Discrete Mathematics and Complex Numbers.
- Add residuals, exact checks and finite-model verification where appropriate.

### Phase 5: Tools and workspaces

- Unify parsing, numeric conventions, domains and error messages.
- Add cross-tool consistency tests.
- Validate sharing, export, offline and mobile behavior.

### Phase 6: Practice and curriculum

- Connect every concept to worked examples and assessed questions.
- Add mastery evidence and adaptive recommendation explanations.
- Complete NCERT/board coverage mapping.

### Phase 7: Certification

- Run mathematical, content, accessibility, browser and visual audits.
- Produce a per-concept evidence report.
- Release only concepts meeting the Definition of Done below.

---

## 20. Definition of Done for one concept

A concept is strengthened only when all boxes are checked.

- [ ] Stable concept ID and aliases exist.
- [ ] Precise and learner-friendly definitions are reviewed.
- [ ] Prerequisites and next concepts are linked.
- [ ] Syllabus/grade metadata is complete.
- [ ] Symbols, units, assumptions, domain and exclusions are explicit.
- [ ] Formulas and equivalent forms are verified.
- [ ] Derivation/proof outline is present.
- [ ] Interactive controls use mathematically meaningful ranges.
- [ ] Visual, formula, table and explanation share one state.
- [ ] Canonical, real-world, misconception, boundary and challenge examples exist.
- [ ] Degenerate and undefined cases are handled intentionally.
- [ ] Independent oracle and invariant tests pass.
- [ ] Worked example and assessed practice exist.
- [ ] Keyboard, screen-reader and reduced-motion behavior is verified.
- [ ] Desktop and mobile visual QA passes.
- [ ] Sources and content-review sign-off are recorded.

---

## 21. Progress tracking table

Use one row per concept ID during implementation.

| Concept ID | Owner | Accuracy review | Topic data | Visualization | Examples | Assessment | Tests | Accessibility | Status |
|---|---|---|---|---|---|---|---|---|---|
| `example.linear-equation` | Unassigned | Not started | Not started | Existing | Partial | Partial | Partial | Partial | Audit required |

Recommended status values: `Inventory`, `Audit required`, `In progress`, `Review`, `Certified`, `Blocked`.
