# 2ndPart PDF Curriculum Coverage Gap Audit

Audit date: 2026-07-11  
PDF source folder: `C:\Users\saisa\Downloads\2ndPart`  
App audited: Math Universe Visualizations  
Audit output: `audit/ncert-upgrade/SECOND_PART_PDF_APP_COVERAGE_GAP_AUDIT.md`

## Scope

This audit checks the 17 PDFs in `2ndPart` against the app's current coverage across:

- Math concepts / NCERT pages
- Visual formula pages
- Formula library
- Theorem library
- Visual theorem / visual proof pages
- Solvers / step-by-step tools
- Interactive tools / labs

The folder appears to contain:

- NCERT `Ganita Prakash` Grade 8 Part II chapters and prelims.
- NCERT `Ganita Manjari` Grade 9 Part I chapters and prelims.

## Method

PDF text was extracted locally with `pypdf` into:

`audit/pdf-extracts/2ndPart/`

The app inventory was checked from these main files and folders:

- `src/data/ncertConcepts.ts`
- `src/data/ncertGapAnalysis.ts`
- `src/data/ncertResourceLinks.ts`
- `src/data/formulaLibrary.ts`
- `src/data/formulaVisualizerRoutes.ts`
- `src/data/mathLabTools.ts`
- `src/data/topics.ts`
- `src/data/theoremLibrary.ts`
- `src/visual-proofs/data/visualProofsIndex.ts`
- `src/visual-proofs/proofs/**`
- `src/problem-solver/**`
- `src/components/layout/navItems.ts`

Coverage labels:

- **Strong**: the app has a relevant dedicated route/tool/proof and the topic can be taught with it.
- **Partial**: related material exists, but the PDF's exact concept sequence, grade-level activity, or visual model is missing.
- **Missing**: no clear dedicated coverage found.
- **N/A**: prelims / non-chapter matter.

## PDF Inventory

| PDF | Book / Chapter inferred from text | Pages | Audit use |
|---|---:|---:|---|
| `hegp2ps.pdf` | Grade 8 Part II prelims, teacher notes, chapter list | 16 | N/A content source |
| `hegp201.pdf` | Grade 8 Ch. 1: Fractions in Disguise | 32 | Audited |
| `hegp202.pdf` | Grade 8 Ch. 2: The Baudhāyana-Pythagoras Theorem | 22 | Audited |
| `hegp203.pdf` | Grade 8 Ch. 3: Proportional Reasoning-2 | 15 | Audited |
| `hegp204.pdf` | Grade 8 Ch. 4: Exploring Some Geometric Themes | 33 | Audited |
| `hegp205.pdf` | Grade 8 Ch. 5: Tales by Dots and Lines | 32 | Audited |
| `hegp206.pdf` | Grade 8 Ch. 6: Algebra Play | 13 | Audited |
| `hegp207.pdf` | Grade 8 Ch. 7: Area | 29 | Audited |
| `iemh1ps.pdf` | Grade 9 Part I prelims, chapter list | 20 | N/A content source |
| `iemh101.pdf` | Grade 9 Ch. 1: Orienting Yourself: The Use of Coordinates | 15 | Audited |
| `iemh102.pdf` | Grade 9 Ch. 2: Introduction to Linear Polynomials | 25 | Audited |
| `iemh103.pdf` | Grade 9 Ch. 3: The World of Numbers | 27 | Audited |
| `iemh104.pdf` | Grade 9 Ch. 4: Exploring Algebraic Identities | 24 | Audited |
| `iemh105.pdf` | Grade 9 Ch. 5: I'm Up and Down, and Round and Round | 26 | Audited |
| `iemh106.pdf` | Grade 9 Ch. 6: Measuring Space: Perimeter and Area | 37 | Audited |
| `iemh107.pdf` | Grade 9 Ch. 7: The Mathematics of Maybe: Introduction to Probability | 19 | Audited |
| `iemh108.pdf` | Grade 9 Ch. 8: Predicting What Comes Next: Exploring Sequences and Progressions | 27 | Audited |

## Executive Coverage Summary

| Status | Count | Notes |
|---|---:|---|
| Strong coverage | 5 | Coordinate geometry, algebraic identities, parts of mensuration, probability basics, sequences/AP/GP have useful existing tools or proofs. |
| Partial coverage | 9 | Most Grade 8 Part II chapters have adjacent app modules but not exact NCERT activity flows. |
| Missing / high-priority gap | 1 | Fractals as a Grade 8 visual lab are effectively missing. |
| N/A prelims | 2 | Prelims contain teacher notes and chapter lists, not direct concept pages. |

Top gaps:

1. Grade 8 fractals: Sierpinski carpet, self-similarity, remaining-square/hole pattern counts.
2. Grade 8 map scale / representative fraction lab.
3. Grade 8 multi-term ratio and dividing a whole in a given ratio.
4. Grade 8 algebra play: number pyramids, calendar-grid tricks, largest-product puzzles.
5. Grade 8 statistics as dot plots: mean as balance point and median interpretation in the exact chapter style.
6. Grade 9 circle chord/arcs/concyclicity theorem suite.
7. Grade 9 linear polynomials as a dedicated Grade 9 route.
8. Grade 9 rational expressions simplification/factorisation visualizer.
9. Grade 9 perimeter puzzles/paradoxes and squaring-a-rectangle activity.
10. Grade 9 probability fairness/sampling bias activities.

## Detailed Coverage Table

| PDF | Chapter / concept cluster | Key PDF content found | Math concept page | Visual formula page | Formula library | Theorem library | Visual theorem / proof | Solver support | Interactive tool / lab | Coverage verdict | Priority fix |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `hegp201.pdf` | Grade 8 Ch. 1: Fractions in Disguise | Percent as fraction out of 100; fraction-to-percent conversion; percent of quantity; bar-model and decimal-percent links; real-life percent use. | Partial: `class-7-comparing-quantities`, `class-8-comparing-quantities` exist, but not the exact Grade 8 chapter route. | Partial: formula visualizer types include fraction-percent/commercial math, but no dedicated "Fractions in Disguise" page found. | Strong for percent formulas generally. | Missing: no theorem needed, but percent equivalence rule is not packaged as a theorem/reference card. | Missing: no visual proof for "percent is equivalent fraction with denominator 100". | Partial: problem solver can handle arithmetic/percent-like calculations, but not chapter-specific guided steps. | Partial: comparing quantities sliders exist. Needs percent bar, double number line, and fraction-to-percent activity. | Partial | Add `/ncert/class-8-fractions-in-disguise` with percent bar models, fraction-decimal-percent conversion cards, and percent-of-quantity slider. |
| `hegp202.pdf` | Grade 8 Ch. 2: The Baudhāyana-Pythagoras Theorem | Doubling/halving a square; square on diagonal; isosceles right triangle hypotenuse; integer right-triangle triples; applications; mention of long-standing open problem. | Partial: roots, Pythagoras, irrational proof, geometry concepts exist. | Partial: geometry/number-system visualizers cover Pythagoras and roots, but not Baudhāyana construction. | Strong for Pythagoras and square-root formulas. | Partial: theorem library likely has Pythagoras-related entries, but no named Baudhāyana construction card. | Strong for Pythagorean area rearrangement; missing exact square-on-diagonal construction and halving-square proof. | Partial: can compute sides/roots; not construction-guided. | Partial: geometry constructor and visual proofs exist. | Partial | Add "Baudhāyana square doubling" visual theorem with draggable original square, diagonal square, triangle counting, and `sqrt(2)` approximation. |
| `hegp203.pdf` | Grade 8 Ch. 3: Proportional Reasoning-2 | Cross multiplication recap; map scale / representative fraction; ratios with more than two terms; dividing a whole in a given ratio; pie chart slices; inverse proportion. | Partial: `class-8-proportion`, comparing quantities exist. | Partial: algebra/proportion graph visualizer exists, but not map-scale and multi-ratio split. | Strong for direct/inverse proportion formulas. | Missing: proportionality/cross-multiplication theorem card not explicit. | Missing: no visual proof for representative fraction or inverse proportional rectangle/hyperbola in this NCERT style. | Partial: solver can calculate ratios but not multi-step map-scale workflow. | Partial: proportion graph exists. | Partial | Add Grade 8 proportional reasoning lab with tabs: cross multiplication, map scale, 3-term ratio splitter, pie slices, inverse proportion. |
| `hegp204.pdf` | Grade 8 Ch. 4: Exploring Some Geometric Themes | Fractals and self-similarity; Sierpinski carpet sequence; pattern counts for remaining squares/holes; visualising solids with front/top/side views. | Partial: shapes/3D geometry exist; no fractal concept page found. | Missing for fractal formulas/counting. | Partial: sequence/geometric progression formulas can express Sierpinski counts, but not connected. | Missing. | Missing for Sierpinski carpet / fractal self-similarity. | Missing: solver not relevant except sequence count. | Partial: 3D solids viewer exists for visualising solids; fractal builder missing. | Missing / Partial | Highest priority: add `/ncert/class-8-fractals-and-solids` with Sierpinski carpet, square-hole count table, self-similarity zoom, front/top/side solid views. |
| `hegp205.pdf` | Grade 8 Ch. 5: Tales by Dots and Lines | Mean as balance; median; dot plots; interpreting data visually; centre of data; data displays. | Partial: Grade 7 data handling and statistics pages exist; no exact Grade 8 dot-plot route. | Partial: statistics visualizer likely has mean/median, but no Grade 8 dot plot balance mode. | Strong for mean/median formulas. | Partial: mean-as-balance visual proof exists. | Strong for `MeanAsBalancePointProof`; partial for median/dot-plot chapter flow. | Partial: statistics solver exists for mean/median. | Partial: probability/statistics tools exist, but dot plot balance and line interpretation need dedicated tab. | Partial | Add Grade 8 dot-and-line data lab with draggable dot plot, live mean balance point, median marker, and interpretation prompts. |
| `hegp206.pdf` | Grade 8 Ch. 6: Algebra Play | Think-of-a-number tricks; date trick algebra; number pyramids; grids/calendar tricks; largest product; divisibility tricks. | Partial: algebraic expressions and magic maths exist. | Missing for algebra trick formulas as visual formulas. | Partial: algebra simplification formulas exist. | Missing: no theorem needed, but "invariant trick" reference card absent. | Partial: divisibility by 3/9 proof exists; broader algebra play proofs missing. | Partial: problem solver can simplify expressions; not a trick explainer. | Partial: Magic Maths has some related concepts, but exact number pyramid/calendar/largest product activities missing. | Partial | Add "Algebra Play" magic lab with expression-trace table, number pyramid builder, calendar grid algebra, largest-product explorer, divisibility decoder. |
| `hegp207.pdf` | Grade 8 Ch. 7: Area | Rectangle/square area; equal-area decomposition; triangle area; parallelogram/trapezium/compound area; unit square measurement. | Partial: mensuration and geometry pages exist. | Strong for geometry/mensuration area formulas generally. | Strong for area formulas. | Partial: area theorem entries likely exist. | Strong for triangle/parallelogram/trapezoid/circle area visual proofs; missing exact Grade 8 rectangle-square equal-area deformation. | Partial: solver can compute areas; no guided decomposition solver. | Strong for shapes/measurement lab, partial for equal-area creative decomposition. | Partial / Strong | Add Grade 8 area workspace with tabs: unit-square count, equal-area transformations, rectangle/triangle/parallelogram/trapezium decomposition. |
| `iemh101.pdf` | Grade 9 Ch. 1: Orienting Yourself: Coordinates | 2D Cartesian coordinate system; axes/quadrants; plotting points; distance between two points in plane. | Strong: coordinate geometry concepts and graph workspace exist; Class 9 number/coordinate coverage present in app ecosystem. | Strong: coordinate geometry formula visualizer exists. | Strong for distance formula. | Strong/Partial: distance theorem available as visual proof; formal route should be linked from Grade 9. | Strong: Distance Formula Proof, Midpoint/Slope/Coordinate proofs exist. | Strong: graph workspace and solver can compute distance. | Strong: graph workspace supports plotting. | Strong | Add exact Grade 9 route metadata and NCERT links if not already exposed: `/ncert/class-9-coordinates`. |
| `iemh102.pdf` | Grade 9 Ch. 2: Introduction to Linear Polynomials | Algebraic expressions; terms, coefficients, constants, variables; linear polynomial; linear patterns; linear relationships; visualising linear relationships. | Partial: algebra concepts and graph workspace exist; no explicit Grade 9 linear-polynomial NCERT concept found. | Partial: algebra formula visualizer has linear equation, but not linear polynomial as a Grade 9 sequence. | Strong for `y=mx+c`, polynomial basics. | Missing/Partial: no "linear polynomial" theorem/reference page. | Partial: line/slope/intercept proofs exist, but linear polynomial visual sequence missing. | Strong: solver can simplify/evaluate linear expressions/equations. | Strong for graphing; partial for pattern-to-polynomial table. | Partial | Add `/ncert/class-9-linear-polynomials` with term/coefficient inspector, expression builder, linear pattern table, and graph tab. |
| `iemh103.pdf` | Grade 9 Ch. 3: The World of Numbers | Natural/whole/integers/rationals; fractions/rational numbers; irrational numbers; real numbers; decimals and cyclic/repeating patterns. | Strong: Class 9 Number Systems exists. | Strong/Partial: number-system formula visualizer exists, but cyclic decimal pattern visualizer may be missing. | Strong for number classification, rational/irrational formulas. | Partial: irrationality proofs exist. | Strong for `IrrationalitySqrt2Proof`; partial for decimal cyclic patterns. | Partial: solver can classify/compute roots, not cyclic decimal explanation. | Partial: number systems page exists; needs repeating decimal machine. | Partial / Strong | Add repeating/cyclic decimal explorer: fraction to decimal long division, remainder cycle, terminating vs repeating rule. |
| `iemh104.pdf` | Grade 9 Ch. 4: Exploring Algebraic Identities | Visualising identities; square/rectangle area models; factorisation with algebra tiles; factorisation without tiles; finding new identities; simplifying rational expressions. | Strong for algebraic identities; partial for rational expressions. | Strong: algebra formula visualizer and visual formulas. | Strong for identities and factorisation formulas. | Partial: theorem/reference entries exist but rational expressions need more. | Strong: square of sum/difference, difference of squares, product binomials, factorisation area models exist. | Strong for expand/factor/simplify; partial for rational expression restrictions. | Strong for identity tiles; missing rational expression simplification visual tab. | Strong / Partial | Add rational-expression simplifier visual: domain restrictions, factor-cancel only common factors, before/after expression cards. |
| `iemh105.pdf` | Grade 9 Ch. 5: Circles: I'm Up and Down, and Round and Round | Circle definition as locus; centre/radius/chord; symmetry of circle; how many circles; chord angle relations; perpendicular bisectors of chords; equal chords/equal distances; arcs; concyclicity. | Partial: circles exist, but mostly circumference/area/tangents; Grade 9 circle theorem sequence missing. | Partial: geometry formula visualizer has circle area/circumference/arc, not chord theorem formulas. | Strong for basic circle formulas; weak for chord theorems. | Partial/Missing: circle chord theorem library coverage unclear/incomplete. | Missing/Partial: many chord/arc/concyclicity visual theorems absent; tangent proofs are Class 10-oriented. | Partial: solver can compute circle equations/areas but not theorem reasoning. | Partial: circle explorer exists; needs chord/arc/concyclicity interactive modes. | Partial | Add `/ncert/class-9-circles` with theorem tabs: chord midpoint perpendicular, equal chords equal distances, same-segment angles, cyclic quadrilateral, concyclicity test. |
| `iemh106.pdf` | Grade 9 Ch. 6: Measuring Space: Perimeter and Area | Perimeter; circumference as C/D ratio; pi approximation and irrationality; arc length; perimeter puzzles/paradoxes; rectangle/parallelogram/triangle area; squaring rectangle; circle area. | Strong for many area/circle concepts; partial for perimeter paradox and squaring rectangle. | Strong: geometry/mensuration formula visualizers cover perimeter/area/circle/arc. | Strong for formulas: perimeter, circumference, arc length, area. | Partial: circle area/circumference proofs exist; pi irrational and paradoxes not full. | Strong for circle area/circumference, triangle/parallelogram area; missing squaring rectangle and perimeter paradox. | Strong for numerical formulas; partial for proof/explanation. | Strong for shapes/measurement; partial for track-stagger and C/D measurement experiment. | Strong / Partial | Add "C/D and pi measurement lab" plus perimeter paradox/squaring-rectangle activities. |
| `iemh107.pdf` | Grade 9 Ch. 7: Introduction to Probability | Subjective probability; objective measurement; random events; sample spaces/events; tree diagrams; fair/unbiased sampling. | Partial/Strong: probability-statistics exists; no exact Grade 9 probability route visible. | Partial: probability visual formula pages exist if generic route is used. | Strong for probability formulas. | Partial: probability theorem cards exist for addition/multiplication/complement/conditional. | Strong for several probability visual proofs; partial for subjective/objective/fairness. | Partial: probability solver support exists but may not cover fairness/sampling bias. | Strong for experiments; missing fairness/unbiased sampling classroom activity. | Partial / Strong | Add Grade 9 probability lab with subjective vs objective mode, sample-space builder, event set highlighter, tree diagram builder, fair/unbiased sampler. |
| `iemh108.pdf` | Grade 9 Ch. 8: Sequences and Progressions | Sequences; finite/infinite; explicit rule; recursive rule; arithmetic progressions; sum first n natural numbers; geometric progressions. | Partial/Strong: sequences-series tools/proofs exist; no exact Grade 9 sequence route found. | Strong: sequence formula visualizer route/category exists. | Strong for AP, GP, sum formulas. | Strong/Partial: AP/GP/sum proofs exist. | Strong: AP equal steps, GP scaling, sum first n natural numbers, triangular numbers, Fibonacci proofs exist. | Partial: solver can compute terms/sums but may not classify explicit vs recursive forms. | Strong for sequences/series lab; missing Grade 9 explicit-vs-recursive comparison tab. | Strong / Partial | Add `/ncert/class-9-sequences-progressions` with explicit/recursive tabs, AP/GP term generator, sum visual blocks, and pattern prediction practice. |

## Cross-App Coverage by Resource Type

| Resource type | Existing strength | Main misses from PDFs | Recommended action |
|---|---|---|---|
| Math concept / NCERT pages | Strong Class 7/10/12; some Class 8/9 already present in `ncertConcepts.ts`. | Exact Grade 8 Part II and Grade 9 Part I chapter routes are uneven. | Add exact chapter routes for all 15 audited chapters, even when they wrap existing tools. |
| Visual formulas | Good generic formula visualizer framework and visual formula hub. | Percent/fraction conversions, map scale, multi-term ratio, fractal counts, linear polynomials, cyclic decimals, chord theorem formulas. | Add "Grade 8/9 visual formula packs" and link them from `/visual-formulas`. |
| Formula library | Very broad; core formulas largely present. | Missing or weak formulas: representative fraction, ratio division, Sierpinski count, mean balance distance equality, chord-distance theorem statements, cyclic decimal tests. | Add tagged formulas with grade/chapter metadata and exact NCERT resource links. |
| Theorem library | Broad but not always exact to the PDFs. | Baudhāyana named theorem, chord/arc/concyclicity theorem sequence, pi irrationality, perimeter paradox explanation, equal-area transformations. | Add reference/theorem cards; use "reference" status where proof is exploratory rather than formal. |
| Visual proofs / visual theorems | Very strong for algebra identities, Pythagoras, coordinate geometry, area, probability, sequences. | Fractals, map scale, multi-ratio split, circle chord theorem suite, rational expression cancellation, dot-plot median/mean chapter sequence. | Build missing visual proofs as compact tabbed routes, not long pages. |
| Solvers | Good algebra, equation, matrix, calculus, statistics base. | Chapter-guided solvers missing for percent conversion, multi-ratio division, map-scale units, cyclic decimal remainders, probability sample spaces. | Add problem-type recognizers and short student-friendly step templates. |
| Interactive tools | Good graphing, geometry, 3D, probability/statistics, visual proof shells. | Fractal generator, front/top/side solid view task, Grade 8 ratio lab, Grade 9 circles theorem lab, probability fairness sampler. | Add these as tabs in existing modules where possible to avoid page sprawl. |

## Missing or Partial Concepts Needing New Routes

| Proposed route | Source PDF(s) | Why needed | Suggested tabs |
|---|---|---|---|
| `/ncert/class-8-fractions-in-disguise` | `hegp201.pdf` | Exact percent chapter is not represented as a Grade 8 chapter route. | Fraction to percent, percent of quantity, bar model, real-life percent. |
| `/ncert/class-8-baudhayana-pythagoras` | `hegp202.pdf` | Existing Pythagoras content does not foreground Baudhāyana square-doubling construction. | Double square, halve square, isosceles right triangle, triples, applications. |
| `/ncert/class-8-proportional-reasoning-2` | `hegp203.pdf` | Map scale and multi-term ratio are not exposed as exact tools. | Cross multiply, map scale, 3-term ratio, divide whole, pie slices, inverse proportion. |
| `/ncert/class-8-fractals-and-solid-views` | `hegp204.pdf` | Fractals are the largest missing visual topic. | Sierpinski carpet, self-similarity zoom, count table, front/top/side solid views. |
| `/ncert/class-8-tales-by-dots-and-lines` | `hegp205.pdf` | Mean/median exists generally, but not as dot-plot balance learning path. | Dot plot, mean balance, median, data interpretation. |
| `/ncert/class-8-algebra-play` | `hegp206.pdf` | Magic-maths adjacent content exists, but exact algebra-play activities are missing. | Number tricks, date trick, number pyramid, grid/calendar trick, largest product, divisibility. |
| `/ncert/class-8-area` | `hegp207.pdf` | Existing mensuration should be wrapped into exact chapter route with equal-area decomposition. | Unit squares, rectangles, triangles, parallelograms, trapezium, compound area. |
| `/ncert/class-9-coordinates` | `iemh101.pdf` | Strong content exists; needs exact chapter landing route and resource mapping. | Plot points, quadrants, distance formula, practice. |
| `/ncert/class-9-linear-polynomials` | `iemh102.pdf` | Dedicated linear-polynomial route missing. | Terms/coefficient inspector, linear polynomial, pattern table, graph. |
| `/ncert/class-9-world-of-numbers` | `iemh103.pdf` | Class 9 number systems exists, but cyclic decimal treatment needs strengthening. | Number hierarchy, rational fractions, irrational roots, decimal expansion, cyclic patterns. |
| `/ncert/class-9-algebraic-identities` | `iemh104.pdf` | Strong proof coverage exists; route should include factorisation and rational expressions. | Identity tiles, factorisation tiles, no-tile factoring, rational expressions. |
| `/ncert/class-9-circles` | `iemh105.pdf` | Circle theorem suite is a major partial gap. | Locus/definition, symmetries, chords, perpendicular bisectors, arcs, cyclic points. |
| `/ncert/class-9-perimeter-area` | `iemh106.pdf` | Strong area/circle content exists, but exact chapter activities missing. | Perimeter, C/D ratio, pi, arc length, puzzles/paradoxes, area proofs. |
| `/ncert/class-9-probability-introduction` | `iemh107.pdf` | Probability exists, but subjective/objective/fairness sequence should be explicit. | Likelihood language, objective probability, sample spaces, tree diagrams, fairness. |
| `/ncert/class-9-sequences-progressions` | `iemh108.pdf` | Strong sequence proofs exist, but Grade 9 chapter route is missing. | Explicit rule, recursive rule, AP, sum n natural numbers, GP. |

## High-Priority Build Roadmap

### Priority 0 — Missing core content

1. Build Grade 8 fractals and solid views route.
2. Build Grade 9 circle theorem suite.
3. Build Grade 8 proportional reasoning route with map scale and ratio splitter.

### Priority 1 — Strong partial coverage needing exact NCERT wrappers

1. Grade 9 coordinates route wrapping graph workspace and distance proof.
2. Grade 9 algebraic identities route wrapping existing visual proofs and formula visualizers.
3. Grade 9 perimeter/area route wrapping mensuration and circle area proofs.
4. Grade 9 sequences route wrapping AP/GP/sum visual proofs.

### Priority 2 — Solver upgrades

1. Add percent/fraction conversion solver templates.
2. Add map-scale unit conversion solver.
3. Add ratio division solver for 2-term and 3-term ratios.
4. Add linear-polynomial pattern-to-rule solver.
5. Add sample-space/tree-diagram solver.

### Priority 3 — Visual formulas / formula library metadata

1. Tag formulas by `Grade 8 Part II` and `Grade 9 Part I`.
2. Add visual formula cards for representative fraction, Sierpinski counts, chord theorems, cyclic decimals, mean balance, ratio division.
3. Link each new route to exact formula/theorem/visual proof resources through `ncertResourceLinks.ts`.

## Specific Formula / Theorem Additions Suggested

| Concept | Formula / theorem card to add | Type |
|---|---|---|
| Percent as fraction | `p% = p/100`, `p% of Q = (p/100)Q` | Formula + visual formula |
| Representative fraction | `map distance : actual distance = 1 : n` | Formula + interactive tool |
| Multi-term ratio division | If ratio is `a:b:c`, shares are `a/(a+b+c)`, `b/(a+b+c)`, `c/(a+b+c)` | Formula + solver |
| Sierpinski carpet | remaining squares `R_n = 8^n`; side scale `1/3^n`; area fraction `(8/9)^n` | Visual formula |
| Mean as balance | total signed distance from mean balances to zero | Visual theorem |
| Number trick invariant | algebraic expression simplifies to constant | Solver + visual proof |
| Chord midpoint theorem | perpendicular from centre to chord bisects chord | Theorem + visual proof |
| Equal chords theorem | equal chords are equidistant from centre, and converse | Theorem + visual proof |
| Same segment theorem | angles in same segment are equal | Theorem + visual proof |
| Cyclic quadrilateral | opposite angles sum to 180 degrees | Theorem + visual proof |
| Rational expression cancellation | cancel common factors, not terms; preserve domain restrictions | Formula + solver |
| Cyclic decimal | repeating decimals arise from repeated remainders in long division | Interactive tool |
| Probability objective model | `P(E) = favourable outcomes / total equally likely outcomes` | Formula + solver |

## Limitations

- PDF extraction used embedded text from `pypdf`; diagrams were not OCR-interpreted. Diagram-only exercises may contain additional fine-grained concepts not captured in text.
- This audit checks app coverage from source files and route/data indexes, not a full browser QA pass of every route.
- Some app coverage may be present inside broad modules but not discoverable from exact NCERT links; those are marked Partial rather than Missing.
- Prelims PDFs were used only to confirm book/chapter structure.

## Final Recommendation

The app has strong broad coverage, but not enough exact coverage for Grade 8 Part II and Grade 9 Part I. The next practical step is to create exact NCERT chapter wrapper routes for all 15 audited chapters, reusing existing visualizers wherever coverage is already strong, and building new focused tools for the missing areas: fractals, map-scale ratio reasoning, Grade 9 circle theorem sequence, cyclic decimal patterns, and dot-plot mean/median interpretation.
