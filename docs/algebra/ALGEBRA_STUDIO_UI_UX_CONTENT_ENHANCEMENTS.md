# Algebra Studio — UI, UX, and Content Enhancements

Catalog of proposed improvements for Algebra Studio (`/algebra` and related labs). Suggestions are grounded in the current product: topic labs in `AlgebraStudio.tsx` / `AlgebraInteractiveLabs.tsx`, Equations in `EquationsLab.tsx`, proof in `AlgebraProofLab.tsx`, Candidate checker (`CasGateway`), Advanced Workbench (`AlgebraEnhancementWorkbench.tsx`), and Algebraic Structures (`/algebraic-structures`).

Each item is tagged **UI**, **UX**, or **Content**. Priority: **P0** (clarity/correctness/access), **P1** (learning loop), **P2** (polish/scale).

---

## Overall Algebra Studio (50)

1. **P0 · UX** Unify the two Algebra surfaces. `/algebra` currently hosts the full studio, while `Algebra.tsx` still describes a tabbed Linear/Quadratic/Systems page. One entry, one mental model, with the older visualizers linked as “classic models” if they stay.
2. **P0 · UI** Add visible labels (or tooltips) when the sidebar collapses to icons below 1250px. Icon-only uppercase nav is hard to scan for first-time students.
3. **P0 · UX** Keep Algebraic Structures inside the same chrome as other labs. Its page omits Algebraic Proof from the sidebar and regroups “SYSTEMS,” which makes navigation feel like a different product.
4. **P0 · UX** Put Advanced Workbench on the home launch grid. Search currently filters it out (`id !== "advanced"`), so the 25-tool lab is sidebar-only.
5. **P0 · Content** Replace decorative journey stats. “Skills in motion 68 / 68” and “Challenges 0 / 32” are not driven by lab completions. Count real visits, challenges checked, and modes used.
6. **P0 · UX** Persist lab state in the URL (`a`, `b`, `mode`, expression). Resume already stores last route; sharing a specific graph or tile board is still missing.
7. **P0 · UI** Render algebra with a shared math typesetter (KaTeX/MathLive) instead of mixed Unicode/`x^2`/JSON. Live expressions, banners, proofs, and CAS results should look like the same language.
8. **P0 · UX** Collapse dual graphs. `Plot` draws `StudioGraphWidget` and a second SVG overlay with a different y-scale. One interactive graph with traces, handles, and a live readout.
9. **P0 · UI** Keyboard-complete every drag. Tile grouping trays, polynomial “drag roots,” transformation handles, and structure graphs need steppers that match pointer tasks (audit already flags this for Algebraic Structures).
10. **P0 · UX** Name Candidate checker consistently. Sidebar says “Candidate checker”; the lab heading says “CAS Step Explorer”; copy says it is not Wolfram. One name, one job statement on every surface.
11. **P1 · UI** Sticky lab chrome. Mode tabs, undo/redo, and the live expression banner should stay visible while the stage scrolls.
12. **P1 · UX** Contextual help, not one paragraph. Help currently dumps a mode string. Add “What to try first,” domain warnings, and a link to the matching visual proof.
13. **P1 · Content** Curriculum tags on every lab (NCERT class, Common Core, exam board). Home search should match “class 10 polynomials” as well as lab titles.
14. **P1 · UX** Guided first 60 seconds on Studio Home: a 3-step “build → see → check” using tiles or the daily challenge, then a suggested next lab from progress.
15. **P1 · UI** Dark and high-contrast completeness. Partial `.dark` rules leave graphs, mini-previews, and gradient buttons on light palettes.
16. **P1 · UX** Per-lab progress, not one `algebra` topic percent. Show which of 11 labs are started, which modes are unused, and which challenges passed.
17. **P1 · Content** Rotate Challenge of the day from a bank that spans labs, with a “Open the lab that teaches this” link. Today it is a single static multiple-choice.
18. **P1 · UI** Skip-to-lab and skip-to-graph landmarks. Long pages bury the interactive surface under headings, strips, and cards.
19. **P1 · UX** Teacher mode: large-text projection, hide challenges, freeze parameters, and a “reset all devices” code for classroom sets.
20. **P1 · Content** Misconception library wired into Concept Accuracy. Surface the same mistakes (sign errors, exponent-add vs multiply, extraneous roots) inside each lab’s validation row.
21. **P1 · UI** Number cards in visual order. Expressions cards are titled 1, 2, 6, 3, 5, 7, 4, 8 in DOM order, which fights reading order.
22. **P1 · UX** Shared `Numeric` control. Equations and interactive labs duplicate number fields; empty, NaN, and min/max behavior should be one component with units and “exact vs decimal” toggle.
23. **P1 · Content** Exact/approximate badges on every numeric result (already a platform enhancement). Roots, logs, and sums currently look equally exact.
24. **P1 · UI** Print and PDF “worksheet from this lab” — current parameters, graph snapshot, and one blank challenge. Useful for classrooms without devices for every student.
25. **P1 · UX** Announce live math to screen readers with a throttled, human sentence (“left side 2x+3, right side 7, not yet balanced”), not only `aria-live` dumps of formulas.
26. **P1 · Content** Cross-studio jumps with a reason. Polynomials already links Complex Numbers; add “why you are leaving Algebra” chips to Linear Algebra, Discrete patterns, and Formula Atlas.
27. **P1 · UI** Mobile: mode tabs as a swipeable chip row with the active mode name always visible. Header modes wrap and steal vertical space at 390px.
28. **P1 · UX** Undo that explains itself. History exists; show a one-line “undid stretch a=1.5 → 1” so students trust Ctrl/Cmd+Z.
29. **P1 · Content** Learning-strip actions that change the model, not only `setFocus` copy. Several “Try” items already commit presets; make Observe/Understand/Why similarly load a canonical example.
30. **P2 · UI** Concept-map nodes should show a 1-line status (visited, challenge passed) instead of only a decorative mini-preview.
31. **P2 · UX** Command palette beyond Ctrl+K search: jump to mode, paste expression, toggle exact, export.
32. **P2 · Content** Glossary drawer for words the labs already use (multiplicity, RREF, extraneous, identity, monoid) with a 10-second visual.
33. **P2 · UI** Consistent card elevation, radius, and heading size across Expressions (custom dash) and the `alg-dash-*` labs.
34. **P2 · UX** Reduced-motion: disable handle animation and auto-balance beam tilt; keep instant state changes.
35. **P2 · Content** Real-world vignette per lab (pricing, cooling, loan, projectile) using the same parameters as the math, not a separate Applications tab disconnected from the studio.
36. **P2 · UI** Focus rings that meet contrast on gradient nav and cyan buttons.
37. **P2 · UX** Autosave named experiments (“period 3 warm-up”) in Studio Projects, restore from Home.
38. **P2 · Content** Worked example replay: step timestamps a student can pause, with the lab controls locked to each step.
39. **P2 · UI** Empty and error illustrations that are algebraic (broken scale, hole in a graph), not generic “no results.”
40. **P2 · UX** Offline-friendly tile/equation labs if the CAS worker is unavailable: show “numeric check only” instead of a failed compute.
41. **P2 · Content** Language toggle for UI chrome (keep math notation stable) for bilingual classrooms.
42. **P2 · UI** Sidebar group headings that match pedagogy: Build, Solve, Analyze, Prove, Check — not a stray SYSTEMS label only on Structures.
43. **P2 · UX** Time-on-task is listed on cards (8–12 min) but never measured. Optional gentle “you’ve been on Inverse for a while — try Piecewise?”
44. **P2 · Content** Formula Atlas deep links that open the lab with the formula’s coefficients preloaded.
45. **P2 · UI** Graph axis ticks, units, and equal-aspect toggle on every Plot, including sequences.
46. **P2 · UX** Challenge answers that accept equivalent forms via the same `expressionsEquivalent` engine, with “show acceptable forms” after two misses.
47. **P2 · Content** Parent/teacher note: what the student practiced, common wrong answer, next recommended lab.
48. **P2 · UI** Loading skeletons for CAS and graph sample so the layout does not jump.
49. **P2 · UX** Confirm reset when the board is far from the default, with a snapshot to undo the reset.
50. **P2 · Content** Studio-wide “I notice / I wonder” prompt that stores a sentence with the current figure for later proof or discussion.

---

## Expressions (22)

Current: Simplify / Expand / Factor / Combine Terms with algebra tiles, grouping trays, area model, and CAS simplify.

1. **P0 · UI** Reorder the eight cards into a left-to-right story: tiles → builder → trays → area → factor rectangle → equivalent forms → validation → explanation.
2. **P0 · UX** Keyboard add/remove tiles and move them between Group A/B. Drag-only trays fail the same access bar as Structures.
3. **P0 · Content** Support more than `ax²+bx+c`. Cubic and linear-only boards, plus a typed expression that syncs tiles when the degree allows.
4. **P0 · UI** Make zero-pair cancellation visible: animate +1 and −1 leaving the board, not only a status string.
5. **P1 · UX** Click-to-select a tile and show its contribution in the area model (highlight the matching rectangle).
6. **P1 · Content** Expand mode should parse `(x+2)(x+3)` and `(2x-1)^2`, then paint the four (or three) area cells from `distributeBinomials`.
7. **P1 · UI** Distinguish positive/negative/selected/zero in the legend with the same colors as tiles; the legend is currently unlabeled color theory.
8. **P1 · UX** Factor-by-grouping should require a common factor in each tray and refuse a “success” check when trays are just coefficient sums.
9. **P1 · Content** Substitution card for more variables and for evaluating both factored and expanded forms at the same `x` to prove equivalence.
10. **P1 · UI** MathLive (or structured) input instead of a raw `(x-1)*(x+2)` string field.
11. **P1 · UX** Show like-term combining as a two-column “before / after” rather than a single live polynomial.
12. **P1 · Content** Common errors: dropping the sign when distributing a minus; combining `x²` with `x`. Flag them in step validation.
13. **P1 · UI** Tile counts as numerals on each tile (`3x²` as three stacked tiles or a badge), so large coefficients stay readable.
14. **P2 · UX** Random generator with constraints (must be factorable over integers, must need a zero pair, must be a perfect square).
15. **P2 · Content** Link each equivalent form to the identity it used (distributive, commutative).
16. **P2 · UI** Area model that scales cell size with coefficient magnitude instead of equal quadrants.
17. **P2 · UX** “Why these trays?” coaching when Group A and Group B cannot form a rectangle.
18. **P2 · Content** Algebraic fractions preview (already a lesson adapter) as a fifth mode: combine `1/x` style terms with explicit excluded values.
19. **P2 · UI** High-contrast tile outlines for color-blind sign coding (shape + sign, not color alone).
20. **P2 · UX** Challenge that asks for an equivalent form and grades with CAS, then offers “show next equivalent” instead of yes/no only.
21. **P2 · Content** Word-problem stem: “tiles as garden plots / money” that still uses the same `a,b,c`.
22. **P2 · UI** Compact mobile: tiles in a 2×5 picker, area model full width, validation collapsed until after first edit.

---

## Equations (22)

Current: Linear balance scale, quadratic methods, absolute value, inequalities.

1. **P0 · UX** Keep original and current equation on screen. Auto-balance can jump to the solution and leave no trace of the start.
2. **P0 · Content** Explicit “all real numbers” vs “no solution” vs “one solution” badges, including `0x=0` and `0x=5`, matching help text.
3. **P0 · UI** Number-line solutions for linear, absolute, and inequalities with open/closed dots and a drag-to-test point.
4. **P0 · UX** Keyboard the balance operations: type the operand, Tab to side, Enter applies to both sides — already the rule; make it the default path, not only buttons.
5. **P1 · Content** Show why multiplying/dividing by a negative flips an inequality, with a numeric counterexample baked into the lab.
6. **P1 · UI** Scale pans that use visual weight proportional to evaluated sides when “show values” is on, and stay level only when sides are equal.
7. **P1 · UX** Quadratic method switcher (formula, factor, complete square, graph) that keeps `a,b,c` and compares the three written forms.
8. **P1 · Content** Complex roots: one tap to Argand, plus “no real x-intercept” on the parabola — do not print complex roots on a real number line.
9. **P1 · UI** Vertex, axis of symmetry, and discriminant as callouts on the same figure as the equation.
10. **P1 · UX** Absolute value as two branches with a domain gate `c≥0`; animate the fold of the V.
11. **P1 · Content** Parse typed equations such as `3x+5=2x-1` into `a,b,c,d` with a clear error if the form is not linear.
12. **P1 · UI** Step list as a proof-like two-column (statement | operation), exportable to Algebraic Proof.
13. **P1 · UX** Goal selector that actually changes UI: “solve,” “check a candidate,” “model a word problem.”
14. **P2 · Content** Extraneous-root checklist when students square both sides (preview of radical equations).
15. **P2 · UI** Color-blind safe left/right pans (pattern, not only cyan/violet).
16. **P2 · UX** Undo per operation on the scale, not only full history snapshots.
17. **P2 · Content** Inequality compound statements (`AND`/`OR`) and interval notation next to the ray.
18. **P2 · UI** Mobile: stack scale above operations; keep operand field above the fold.
19. **P2 · UX** “Check my candidate x” that substitutes into original, not the last simplified line.
20. **P2 · Content** Applications: break-even and motion with the same linear/quadratic solvers.
21. **P2 · UI** Discriminant dashboard: D>0 / =0 / <0 with matching graph sketches.
22. **P2 · UX** Challenge variety: solve, classify, or “which operation next?” instead of a single numeric expected value.

---

## Functions (22)

Current: Families, Transformations, Composition, Inverse, Piecewise with `a,h,k` and a function machine.

1. **P0 · Content** Domain/range strings must follow the transformation. `sqrt`/`log`/`1/x` currently mix parent domain with `h` in ways that can disagree with the plotted expression.
2. **P0 · UI** Drag handles on the graph for `h` and `k` in Families, not only Transformations.
3. **P0 · UX** Function machine that matches the mode: two boxes for composition, a flip for inverse, a gate for piecewise.
4. **P0 · Content** Inverse: show the restricted domain for quadratics and refuse to plot `f⁻¹` as a full parabola when it is not a function.
5. **P1 · UI** Table of values that uses the probe plus student-editable x-rows, highlighting undefined cells.
6. **P1 · UX** Composition order as a mapping diagram (finite set) plus the continuous graph, so `f∘g` vs `g∘f` is not only a segmented control.
7. **P1 · Content** Horizontal line test overlay in Inverse and Families.
8. **P1 · UI** Parent graph always dashed, transformed solid, with a legend that names `f` and the rule.
9. **P1 · UX** Piecewise editor: add/remove branches, inclusive/exclusive endpoints, and a hole marker — not a hardcoded `x<h` vs family.
10. **P1 · Content** List domain restrictions for `1/x` and `log` at the transformed argument, including vertical asymptote `x=h`.
11. **P1 · UI** Trace mode: drag `x` on the graph and see `(x, f(x))` on both parent and image.
12. **P1 · UX** “Match this target graph” challenge that grades `a,h,k` with a tolerance and a screenshot of the target.
13. **P2 · Content** More families: `floor`, exponential already present — add `1/x²` and a custom typed `f(x)`.
14. **P2 · UI** Equal-aspect option so inverse reflection across `y=x` is geometrically honest.
15. **P2 · UX** Keyboard nudge for handles (arrow keys, Shift for coarse).
16. **P2 · Content** Verbal transformation script that stays in sync: “shift right 2, reflect, stretch 1.5, shift down 1.”
17. **P2 · UI** Color the machine stages to match graph colors.
18. **P2 · UX** Warn when `a=0` (constant function) and disable inverse.
19. **P2 · Content** Link to lesson adapters for one-one / onto / invertible as “finite set lab.”
20. **P2 · UI** Mobile: parameters in a bottom sheet; graph uses remaining viewport height.
21. **P2 · UX** Probe evaluation shows the substitution steps `x → x−h → f → ×a → +k`.
22. **P2 · Content** Real mapping story (temperature conversion, currency) for linear families.

---

## Polynomials (22)

Current: roots, factors, synthetic division, end behavior, multiplicity.

1. **P0 · UI** Actually drag roots on the graph. Copy promises it; root editing is numeric only.
2. **P0 · Content** Multiplicity from typed polynomials, not only from duplicate root slots. `extra` parsing should update the multiplicity table.
3. **P0 · UX** End-behavior arrows on the graph, not only a sentence in the analysis card.
4. **P0 · Content** Complex roots: show conjugate pairs and a “real graph vs complex roots” note instead of a bare CAS dump plus a link.
5. **P1 · UI** Factor list `(x−r)^m` with multiplicity badges that highlight the corresponding intercept.
6. **P1 · UX** Synthetic division tableau (boxed coefficients, brought-down leading, remainder) instead of a coefficient list.
7. **P1 · Content** Remainder theorem check: `p(divisor)` vs remainder, live.
8. **P1 · UI** Leading-coefficient slider with a preview of both-ends-up vs down.
9. **P1 · UX** Degree buttons should add/remove root slots with animation and keep existing roots.
10. **P1 · Content** Distinguish typed `extra` plot vs builder plot; mixing them in one banner is easy to misread.
11. **P1 · UI** Sign chart (intervals between roots) for the current polynomial.
12. **P1 · UX** Challenge that asks “cross or touch at this root?” from a graph, not even/odd degree of the whole polynomial.
13. **P2 · Content** Rational root theorem candidates, then synthetic test — bridge to Candidate checker.
14. **P2 · UI** Zoom/pan that does not clip high-degree wiggle.
15. **P2 · UX** Compare two polynomials (sum/product already in Factors copy) on one pair of graphs.
16. **P2 · Content** Pascal/binomial expansion for `(x+1)^n` as a preset.
17. **P2 · UI** Coefficient polynomial written highest-degree-first and in `a_n x^n + …` form.
18. **P2 · UX** Keyboard root nudging with snap-to-integer.
19. **P2 · Content** Application: volume or profit polynomial with a feasible x-interval shaded.
20. **P2 · UI** Mobile: root list as chips; graph full width.
21. **P2 · UX** Warn when scale is 0 (“zero polynomial”) in the banner, not only end-behavior text.
22. **P2 · Content** Link Descartes’ rule of signs as an optional inspector.

---

## Systems (22)

Current: 2×2 slope-intercept, Unique/None/Infinite, substitution, elimination, matrices, inequalities.

1. **P0 · UI** Draw the intersection point (or “parallel” / “same line” stamp) on the graph.
2. **P0 · Content** Allow general `ax+by=c` form, not only `y=mx+b`. Vertical lines are currently impossible.
3. **P0 · UX** Matrix row ops should stay synced with the graphed lines after swap/scale/add — or clearly mark the matrix as a separate representation.
4. **P0 · Content** Inequalities: feasible region as a true intersection polygon, not two independent shades.
5. **P1 · UI** Click-to-test a point on the graph for inequalities (in addition to numeric probes).
6. **P1 · UX** Substitution and elimination as stepped animations that highlight the substituted expression.
7. **P1 · Content** 3×3 teaser that opens the workbench 3×3 tool or Linear Algebra, with a consistent solution.
8. **P1 · UI** Residual readout: plug `(x,y)` into both originals after a unique solve.
9. **P1 · UX** Classify from slopes *and* from RREF so students see the same Unique/None/Infinite in both languages.
10. **P1 · Content** Nonlinear systems mode using `numericIntersections` already in the enhancement engine.
11. **P1 · UI** Dashed/solid legend for inequality boundaries that matches the test `≥` vs `<`.
12. **P1 · UX** Presets labeled with the story (“parallel never meet”) not only Unique/None/Infinite.
13. **P2 · Content** Word problem: two prices / two mixtures, generating the same `m,b`.
14. **P2 · UI** Color-blind line styles (dash, dot, thickness) plus color.
15. **P2 · UX** Drag a line by intercept and slope handles.
16. **P2 · Content** Dependent vs inconsistent row language next to “infinite” / “none.”
17. **P2 · UI** Augmented matrix rendered as a proper table, not `JSON.stringify`.
18. **P2 · UX** Challenge: “build no solution” should verify slopes equal and intercepts different.
19. **P2 · Content** Link Cramer’s rule lesson as an optional path.
20. **P2 · UI** Mobile: one equation editor at a time with a toggle Line 1 / Line 2.
21. **P2 · UX** Show substitution into y after x is found, as a second highlighted step.
22. **P2 · Content** Integer vs decimal solutions with exact fractions (`x=3/2`).

---

## Exponents & Logs (22)

Current: laws, radicals, inverse graphs, exponential equations.

1. **P0 · Content** Guard `a=1` and `a≤0` everywhere: no log graph, no `a^0` slogan without the `a≠0` note, no quiet `NaN`.
2. **P0 · UI** Plot `y=a^x` and `y=log_a x` with the reflection `y=x` in Equal aspect.
3. **P0 · UX** Laws should show a counterexample path (product vs sum) using `exponentLawCounterexample`, not only matching numeric sides.
4. **P0 · Content** Change-of-base identity with bases other than `e`/`10`, matching workbench tool 21.
5. **P1 · UI** Repeated-multiplication bars for integer exponents (visual proofs already exist — embed or deep-link them).
6. **P1 · UX** Radical index, radicand sign, and principal root vs real even-root undefined, in one status line.
7. **P1 · Content** Exponential equation solver that shows `x = log_a (target)` and substitutes back.
8. **P1 · UI** Slider for growth vs decay (`0<a<1`) with a half-life annotation.
9. **P1 · UX** Domain shading for `log` (`x>0`) on the graph.
10. **P1 · Content** Properties: `log(xy)`, `log(x/y)`, `log(x^k)` as interactive tiles, each with a numeric check.
11. **P1 · UI** Simplify-square-radical as a prime-factor tree, not only `simplifySquareRadical` text.
12. **P1 · UX** Challenge for laws should ask which identity, not only “enter n.”
13. **P2 · Content** Compound interest / cooling vignette with the same `a` and `x`.
14. **P2 · UI** Log scale toggle for the exponential graph.
15. **P2 · UX** Keyboard-friendly law grid (roving tabindex).
16. **P2 · Content** Extraneous roots when solving logs (argument and base constraints).
17. **P2 · UI** Mobile: law buttons as a wrapping chip group; graph below.
18. **P2 · UX** Compare two bases on the same axes.
19. **P2 · Content** Link NCERT “exponents and powers” practice bank.
20. **P2 · UI** Exact values (`2^5=32`, `log_2 8=3`) preferred over long decimals.
21. **P2 · UX** Warn on overflow for large exponents instead of `Infinity` in the result card.
22. **P2 · Content** Historical note (Napier / slide rule) as optional flavor, not in the critical path.

---

## Sequences (22)

Current: arithmetic, geometric, recursive Fibonacci-like, sigma, quadratic patterns.

1. **P0 · UI** Sequence plot with n on the x-axis, labeled points, and optional polyline — not an unlabeled scatter in a 600×260 viewBox.
2. **P0 · Content** Index convention: UI says `aₙ = first + (n−1)d` but `term(i)` uses `i` from 0. Show n starting at 1 everywhere.
3. **P0 · UX** Recursive mode should let students choose the recurrence (`a_n = a_{n-1}+d` vs Fibonacci), not only one hidden rule.
4. **P0 · Content** Geometric `|r|<1` infinite sum with a clear “diverges” state; do not sit next to a finite `S_n` without contrast.
5. **P1 · UI** Sigma notation builder: explicit ∑ with start/end indices that match `count`.
6. **P1 · UX** Closed form vs table vs graph linked highlighting (tap n=4, all three respond).
7. **P1 · Content** Partial-sum graph for Sigma mode, not only running totals in cells.
8. **P1 · UI** Term table as a real `<table>` with `n`, `a_n`, `S_n` headers (accessibility).
9. **P1 · UX** Patterns mode: show first differences and second differences to justify the quadratic rule.
10. **P1 · Content** Separate factorial/combination extras — they confuse sequence pedagogy unless the mode is counting.
11. **P1 · UI** Color geometric growth vs decay (`r` sign and `|r|>1`).
12. **P1 · UX** Challenge: find `d` or `r` from three terms, not only the 20th term.
13. **P2 · Content** Arithmetic/geometric series word problems (stadium seats, bouncing ball).
14. **P2 · UI** Mobile: horizontal scroll for many terms with sticky first column `n`.
15. **P2 · UX** Generate from a verbal rule (“starts at 3, add 4 each time”).
16. **P2 · Content** Explicit vs recursive conversion exercises.
17. **P2 · UI** Animation of adding the next term (reduced-motion: instant).
18. **P2 · UX** Overflow/precision warning for `r^n` on large n.
19. **P2 · Content** Link Discrete World number patterns with a “same sequence” payload.
20. **P2 · UI** Formula cards `S_n = n/2 (2a+(n-1)d)` with live substitution.
21. **P2 · UX** Empty state when count is 1 (no line, still one point).
22. **P2 · Content** Optional integer-sequence “guess the rule” bank (OEIS-style, small and classroom-safe).

---

## Algebraic Structures (22)

Current: structure test, Cayley tables, semigroups/monoids, posets/lattices, Boolean algebra. Keyboard gaps called out in module audit.

1. **P0 · UX** Restore Algebraic Proof in this studio’s sidebar so the map of Algebra is complete.
2. **P0 · UI** Keyboard Cayley cell editing and arrow-key cell movement; pointer-only tables fail access.
3. **P0 · Content** Axiom checklist that updates live: closure, associativity, identity, inverses, commutativity — with a failing triple highlighted.
4. **P0 · UX** Same Algebra Studio heading component (undo, help, settings) as other labs; Structures currently uses a different toolbar mix.
5. **P1 · UI** Hasse diagram drag with snap, plus a list of covering relations for screen readers.
6. **P1 · Content** Tiny finite examples first (ℤ₂, Klein four, S₃ size warning) before abstract names.
7. **P1 · UX** “Why did associativity fail?” shows the concrete `(a*b)*c` vs `a*(b*c)` values.
8. **P1 · UI** Boolean K-map grouping that is keyboard-selectable, not only painted.
9. **P1 · Content** Homomorphism preview: two tables and a mapping that preserves or breaks the operation.
10. **P1 · UX** Launch Algebraic Structures from Home search and the concept map with a visited state.
11. **P1 · UI** Color-blind-safe operation-table encoding (symbols, not hue only).
12. **P1 · Content** Lattice meet/join computed from the diagram, with a counterexample when the poset is not a lattice.
13. **P2 · UX** Guided tour: “build a magma → test semigroup → add identity → group.”
14. **P2 · Content** Link Discrete World logic labs instead of duplicating Boolean without a bridge.
15. **P2 · UI** Mobile: table cells at 44px min; pinch-zoom the Hasse SVG.
16. **P2 · UX** Shareable Cayley table in the URL.
17. **P2 · Content** “Not a group because…” sentence generator for common student tables.
18. **P2 · UI** Identity/inverse highlighting in the table (row/column of e).
19. **P2 · UX** Reset that restores a known-good cyclic group, not an empty table.
20. **P2 · Content** Optional: rings/fields as a locked “next” with ℤ/nℤ examples.
21. **P2 · UI** Consistent card language with other labs (Observe/Understand strip).
22. **P2 · Content** Proof export: “associativity holds on this 3-element table” as a filled Algebraic Proof template.

---

## Algebraic Proof (22)

Current: Identities, Equation Proof, Induction, Inequality, Counterexample with reasons and templates.

1. **P0 · UX** Grade reasons against the actual rewrite (`reasonMatchesStep`), and show why a reason is rejected, not only a color chip.
2. **P0 · Content** Induction: make `P(n)`, base, hypothesis, and inductive step visually distinct regions, not one undifferentiated step list.
3. **P0 · UI** Two-column proof layout (statement | reason) that prints cleanly.
4. **P0 · Content** Counterexample mode should sample and **display** the failing `x` from `validateEquivalentExpressions`, not only a boolean.
5. **P1 · UX** Drag-reorder steps with keyboard alternatives; lock “Given” as first.
6. **P1 · Content** Bank of identities `(a+b)²`, difference of squares, AM-GM sketch, with templates that are not all the same square expansion.
7. **P1 · UI** Numeric check panel with `a,b,n` that cannot silently succeed when the identity is false.
8. **P1 · UX** Import the Equations lab step list as an Equation Proof starter.
9. **P1 · Content** Inequality proofs: show the reversible vs irreversible steps (squaring, multiplying by negatives).
10. **P1 · UI** Goal statement always sticky: “Show … for all real a,b.”
11. **P1 · UX** Hint that names the next legal identity without pasting the answer.
12. **P1 · Content** “All steps equivalent” vs “forward implication only” badges for equation vs inequality.
13. **P2 · UI** Math typesetting in statements; keep a raw-edit toggle for CAS.
14. **P2 · UX** Share proof URL; teacher view of incomplete reasons.
15. **P2 · Content** Connect to visual proofs category Algebra (phase-twelve models).
16. **P2 · UI** Mobile: reason picker as a bottom sheet.
17. **P2 · UX** Challenge: find a counterexample to a plausible false identity.
18. **P2 · Content** Language of proof: therefore, without loss of generality, for all — as optional sentence starters.
19. **P2 · UI** Validity traffic light per step (equivalent / follows / does not follow).
20. **P2 · UX** Reset template vs clear all, two different actions.
21. **P2 · Content** Induction inequalities (`2^n vs n!`) as a second template.
22. **P2 · UI** Fullscreen proof canvas (icon already imported in the lab) actually expanding the workspace.

---

## Candidate checker (22)

Current: `CasGateway` — Solve/Simplify/Factor/Expand/Substitute/Differentiate, history, candidate field, graph of left-hand side.

1. **P0 · UX** Rename and restate: this checks a candidate against the live expression/graph; it does not invent Wolfram-style steps. Put that in the H1, not only a notice.
2. **P0 · Content** Candidate check must use substitution residuals (`verifyEquationCandidates`) for Solve, and `expressionsEquivalent` for Simplify/Factor/Expand — not one equivalence test for every mode.
3. **P0 · UI** Graph the original, the candidate, and their difference. “Matches the figure” needs a visible figure of both.
4. **P0 · UX** Parse history restore without `split(" → ")` string surgery; structured history objects.
5. **P1 · Content** Domain flags: rejected candidates that fail radicand, denominator, or log argument even if they algebraically cancel.
6. **P1 · UI** Operation-specific input examples and placeholders (`2x+3=7` for Solve, `d/dx` for Differentiate).
7. **P1 · UX** Differentiate should show the derivative graph plus a numeric difference quotient at `x`.
8. **P1 · Content** Substitute multiple variables; current path is x-only.
9. **P1 · UI** Error messages that quote the bad token, not only “Check input.”
10. **P1 · UX** Deep link to `/workspace/data/cas` with the expression prefilled (notice already links the workspace).
11. **P1 · Content** Step explorer: show CAS rewrite rules used, even at a coarse level (expand, collect, cancel).
12. **P1 · UI** Candidate field grades on Enter; announce pass/fail to `role="status"`.
13. **P2 · UX** Limit history to structured items with mode, input, output, timestamp; click fills all three.
14. **P2 · Content** Challenge bank per operation, not a single factor prompt.
15. **P2 · UI** Mobile: compute button sticky; history in a disclosure.
16. **P2 · UX** Warn when plotting `draft.split("=")[0]` is not the equation being solved.
17. **P2 · Content** Exact vs numeric toggle on outputs.
18. **P2 · UI** Color residual: green below tolerance, amber near, red fail.
19. **P2 · UX** Disable Compute when the expression is empty; don’t append blank history.
20. **P2 · Content** Link Advanced Workbench tool 25 (CAS candidate verification) with the same example.
21. **P2 · UI** Syntax cheatsheet (`*` for multiply, `^` for powers) next to the input.
22. **P2 · UX** Offline: if the CAS worker fails, still allow numeric candidate checks.

---

## Advanced Workbench (22)

Current: 25 JSON tools sharing `a,b,c,x` — mathematically useful, visually raw.

1. **P0 · UI** Replace `JSON.stringify` outputs with human cards: tiles graphic, interval on a line, factor pairs, matrices as tables.
2. **P0 · UX** Filter/group the 25 tools by lab (Expressions, Equations, …) and jump to the matching `/algebra/...` route with parameters copied.
3. **P0 · Content** Tool 10 (radical check) currently validates a candidate against a tautology built from `sqrt(x)`; use a real radical equation residual.
4. **P0 · UI** Shared `a,b,c,x` bar sticky, with a live “now used as…” legend per selected tool.
5. **P1 · UX** Click a tool to expand a mini-visual (graph, tiles, Cayley-sized table) instead of a 150px JSON block.
6. **P1 · Content** Empty-field rules are documented in help; surface them inline (“blank ignored, last number kept”).
7. **P1 · UI** Search the 25 titles; keyboard focus order through the grid.
8. **P1 · UX** 3×3 system (tool 18) should show the intended solution `(a,b,c)` and the residual of each equation.
9. **P1 · Content** Proof checker (24) should let students type two expressions, not only `(t+b)²` vs `t²+b²`.
10. **P1 · UI** Complex roots as Argand points, not `{real, imaginary}` JSON.
11. **P1 · UX** Home card for Advanced: tabs/minutes like other topics (currently `tabs: []`).
12. **P1 · Content** Each tool: one-sentence pedagogical goal and a “common misuse.”
13. **P2 · UI** Three-column grid collapsing cleanly; tool IDs `ALG-01` visible for teacher scripts.
14. **P2 · UX** Snapshot export of all 25 results as a classroom “parameter pack.”
15. **P2 · Content** Nonlinear intersections (19) plotted, not only a list of x-values.
16. **P2 · UI** Sequence comparison (22) as three small plots: arithmetic / geometric / recursive.
17. **P2 · UX** Undo already exists; add “what changed” for a,b,c,x.
18. **P2 · Content** Inequality tool shows the reversed relation when `a<0`.
19. **P2 · UI** Mobile: one tool visible, swipe to next, parameters in a sticky footer.
20. **P2 · UX** Deep-link `?tool=ALG-16&a=1&b=-3&c=2&x=1`.
21. **P2 · Content** Align titles with `studioEnhancementManifest.ts` so coverage dashboards and the UI cannot drift.
22. **P2 · UI** Status: implemented vs “visual pending” so JSON tools are honest about fidelity.

---

## Suggested implementation order

1. Naming, navigation, and honesty (overall 1–5, 10; Candidate checker 1; Structures 1; Workbench 11).
2. Access and math-correctness gates (overall 8–9; Expressions 2–3; Polynomials 1; Systems 2; Exponents 1; Sequences 2; Structures 2–3).
3. Representation upgrade (typeset math, tables not JSON, one graph).
4. Learning loop (progress, challenges, URL state, help).
5. Polish (dark mode, print, teacher freeze, vignettes).

Primary files: `src/pages/AlgebraStudio.tsx`, `src/pages/AlgebraStudio.css`, `src/studios/algebra/*`, `src/pages/AlgebraicStructuresStudio.tsx`, `src/studios/algebraic-structures/*`, `src/studios/studioEnhancementManifest.ts`.
