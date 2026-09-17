# Target Studio Plan — 100% wow on every tab

**Goal.** Every in-scope studio, sub-module, page, and tab becomes better than GeoGebra (construction + 3D), Desmos (graph feel + classroom), and Brilliant (interactive argument + pedagogy) **at the same time**.

**Out of scope (this plan).** Statistics & Probability (`/probability-statistics`, `/statistics`). All AR surfaces (`/geometry/ar`, `/trigonometry/ar`, `/modules/ar-math-lab`, `/ar-math-lab`). Lessons / NCERT.

**In scope.** Geometry (solids via Shapes Explorer), Trigonometry, Algebra, Algebraic Structures, Calculus, Number Systems, Linear Algebra, Complex Numbers, Modelling, Number & Discrete, Set Theory, Graph Theory. Studio homes and advanced workbenches included.

**Success bar (must be true on every tab, not only the studio home).**

| Dimension | 100% means |
|---|---|
| **Tools** | The figure is the argument. Drag-native (not slider-only). Undo/redo. Exact + approximate labels. Live invariant. Challenge that uses *this* figure. |
| **UI** | 60fps canvas, dark/light, large labels, no decorative clutter, no `ModeCanvas` stub art. Tab chrome matches Calculus/Algebra studios. |
| **UX** | Deep link `?mode=`. Resume last figure. Keyboard. Mobile one-hand. Share link copies state. Reduced motion. `aria-live` for measures. |
| **Content** | Unique Observe → Why → Try → Challenge copy (not a generic strip). One misconception. Next-tab gate. Teacher prompt. |

**Beat the peers by combining what they split.** GeoGebra has tools without Brilliant’s teaching loop. Desmos has graph feel without GeoGebra constructions. Brilliant has pedagogy without a construction kernel. We ship **kernel + feel + loop** on every tab.

**Links.** Paths are app routes. Append `?mode=` using the tab id in backticks.

---

## Five phases

| Phase | Name | What “done” looks like | Primary surfaces |
|---|---|---|---|
| **1** | Shared wow kernel + kill stubs | One studio shell, one figure format, no fake labs | Platform + thinnest labs |
| **2** | Geometry, Trig, Number Systems | Shape/angle/number feel beats GeoGebra + Mathigon | Geometry, `/shapes`, Trig, Number Systems |
| **3** | Algebra, Structures, Calculus | Symbolic + visual + proof beats Graspable + Brilliant + Desmos calc | Algebra, Algebraic Structures, Calculus |
| **4** | Linear maps, Complex, Modelling | Maps, \(z\), models you can trust | Linear Algebra, Complex, Modelling |
| **5** | Discrete family + classroom layer | Discrete/set/graph beat VisuAlgo; share beats Desmos Classroom | Discrete, Set Theory, Graph Theory, Project Center |

Each phase includes **Tools, UI, UX, Content** work. Do not skip the shared kernel in Phase 1 — later phases assume it.

---

## Phase 1 — Shared wow kernel (every studio inherits this)

Ship once. Every later tab uses it.

### 1.1 Studio chrome (all studio homes)

| Surface | Link | Add |
|---|---|---|
| Geometry home | [/geometry](/geometry) | Live mini-figure per card (not icon-only). Resume last object tree. Search finds theorems *and* objects. |
| Trig home | [/trigonometry](/trigonometry) | Live unit-circle preview. Continue = last \(\theta\). |
| Algebra home | [/algebra](/algebra) | Concept map nodes open the live tile/graph, not a dead card. |
| Calculus home | [/calculus](/calculus) | Keep journey map; add “last experiment” thumbnail from session JSON. |
| Number Systems home | [/number-systems](/number-systems) | Nested \(\mathbb{N}\subset\mathbb{R}\) that opens the matching lab. |
| Linear Algebra home | [/linear-algebra](/linear-algebra) | Unit square under a shear as the hero, not empty loop copy. |
| Complex home | [/complex-numbers](/complex-numbers) | Drag \(z\) on the home card. |
| Modelling home | [/mathematical-modelling](/mathematical-modelling) | Last SIR/projectile thumbnail + compare CTA. |
| Discrete home | [/discrete-world](/discrete-world) | Sieve + graph + clock as three living cards. Deep-link Sets/Graphs to dedicated modules. |
| Set Theory home | [/set-theory](/set-theory) | Same chrome as Algebra (sidebar, resume, search). |
| Graph Theory | [/graph-theory](/graph-theory) | Studio-grade header (theme, share, shortcuts) around the existing engine. |
| Algebraic Structures | [/algebraic-structures](/algebraic-structures) | Own home (today it dumps into Structure Test). Add launch cards. |
| Project Center | [/studio-projects](/studio-projects) | Cross-studio `.muv` figure: geometry objects, algebra tiles, calc functions, graphs share one file. |

**UI.** One header: theme, large labels, teacher mode, shortcuts, share, export PNG/SVG/JSON.  
**UX.** `?mode=` + `?fig=` hash. Back goes to studio home, not `/`.  
**Content.** Home copy names the next 8-minute win, not a slogan.

### 1.2 Interaction kernel (required on every canvas)

- Constraint-preserving drag (GeoGebra) **and** 60fps traces (Desmos).
- Undo/redo + history strip (Algebra already has `useAlgebraHistory` — promote to shared).
- Exact/approximate toggle on every number.
- Snapshot share URL.
- Challenge box bound to live state (not a hardcoded integer).
- Teacher overlay: pause student figure, push a prompt.

### 1.3 Phase 1 tab work (stubs that must not survive)

These tabs currently teach the wrong lesson (“this product is a mockup”). Rebuild to the 100% bar *in Phase 1* so Phases 2–5 are not decorating empty shells.

#### Geometry — Transformations

Link: [/geometry/transformations](/geometry/transformations)

| Tab | Link | Tools | UI | UX | Content |
|---|---|---|---|---|---|
| Translate | `?mode=Translate` | Drag pre-image; vector \(\overrightarrow{T}\) as a handle; lattice of images | Ghost + image, grid snap | Arrow keys nudge \(T\) | Invariance of distances; map a vertex onto a target |
| Rotate | `?mode=Rotate` | Center + angle handle; 15° snap; trace arc | Center marked; signed angle | Alt-drag copies | Orientation; 180° sends \((1,0)\) to \((-1,0)\) |
| Reflect | `?mode=Reflect` | Drag mirror line; perpendiculars shown | Equal ticks to mirror | Flip with `R` | Distance to line; glide preview |
| Dilate | `?mode=Dilate` | Center + \(k\) handle; \(k<0\) inversion | Rays through center | Wheel on \(k\) | Similarity vs isometry |
| Compose | `?mode=Compose` | Stack of maps; reorder; matrix of composition | Stack UI like LA playground | Undo one map | Non-commutativity challenge |

#### Geometry — Theorems & Proofs

Link: [/geometry/proofs](/geometry/proofs)

| Tab | Link | Tools | UI | UX | Content |
|---|---|---|---|---|---|
| Pythagoras | `?mode=Pythagoras` | Rearrange \(a^2+b^2\) tiles by drag; van Aubel + shear proofs | Two proof styles switch | Step lock / unlock | Write two-column from the figure |
| Angle Sum | `?mode=Angle Sum` | Tear angles onto a line | Tear animation | Reduced-motion stills | Why 180°; spherical contrast (locked, labeled “later”) |
| Circle Theorems | `?mode=Circle Theorems` | Live inscribed vs central; Thales | Shared circle with Circles lab | Jump to `/geometry/circles?mode=Angles` | Prove with measures, then hide measures |
| Similarity | `?mode=Similarity` | AA overlay; scale factor | Dual triangles | Snap corresponding | Area scale \(k^2\) |
| Area Proofs | `?mode=Area Proofs` | Dissection conservation | Tile colors | Replay | Conservation language |

#### Geometry — Solids tile → Shapes Explorer (in-studio quality)

Link: [/shapes](/shapes) (studio tile currently redirects)

| Tab | Tools | UI | UX | Content |
|---|---|---|---|---|
| Cylinders / Cones / Spheres | Rotate solid; live \(A,V\); parameter handles | 3D + formula that highlights the moving dimension | Units; exact \(\pi\) | Cavalieri intuition |
| Nets | Fold/unfold; invalid net rejected | Fold animation | Touch fold | No overlap rule |
| Cross-sections | Cutting plane drag | Slice highlight | Plane keys | Name the conic/polygon |

#### Linear Algebra — Vector Spaces (stub)

Link: [/linear-algebra/vector-spaces](/linear-algebra/vector-spaces)

| Tab | Link | Add |
|---|---|---|
| Span | `?mode=Span` | Drag vectors; fill parallelepiped / plane; dim readout |
| Independence | `?mode=Independence` | Dependence detector; one vector turns grey when in span of others |
| Basis | `?mode=Basis` | Swap basis; coordinate readout of a probe point |
| Subspaces | `?mode=Subspaces` | Line / plane / \(\mathbb{R}^2\) toggles; intersection |
| Coordinates | `?mode=Coordinates` | Change-of-basis matrix live |

#### Complex — Fractals

Link: [/complex-numbers/fractals](/complex-numbers/fractals)

| Tab | Link | Add |
|---|---|---|
| Mandelbrot | `?mode=Mandelbrot Set` | GPU/canvas iteration; drag \(c\); orbit overlay; period coloring |
| Julia | `?mode=Julia Set` | Linked \(c\) from Mandelbrot; connectivity vs \(|c|\); iteration slider that *changes the set* |

#### Discrete — Sets & Graphs (do not rebuild; rewire)

| Surface | Link | Phase 1 action |
|---|---|---|
| Discrete Sets | [/discrete-world/sets](/discrete-world/sets) | Replace stub with iframe-quality embed or redirect to [/set-theory/venn-diagram-engine](/set-theory/venn-diagram-engine) with Discrete chrome |
| Discrete Graphs | [/discrete-world/graphs](/discrete-world/graphs) | Redirect modes to [/graph-theory](/graph-theory) with `?tab=` |

#### Discrete — Number Sense, Logic (minimum viable real labs)

| Surface | Link | Tabs | Phase 1 add |
|---|---|---|---|
| Number Sense | [/discrete-world/number-sense](/discrete-world/number-sense) | Integers, Fractions, Decimals, Ratios, Powers, Scales | Drag hops on a line; equivalent fractions; scientific scale |
| Logic | [/discrete-world/logic](/discrete-world/logic) | Circuit, Truth Table, Equivalence | Gate canvas (AND/OR/NOT/XOR); table highlights the active row; SAT counterexample |

#### Modelling — Comparison

Link: [/mathematical-modelling/comparison](/mathematical-modelling/comparison)

| Tab | Add |
|---|---|
| Compare | Overlay ≥3 models on imported or generated data |
| Residuals | Residual plot + Q-Q |
| Selection | RMSE, MAE, AIC/BIC, train/holdout; pick-and-justify challenge |

### 1.4 Phase 1 UX debt (platform)

- Nav parents `/math-workspaces/{group}` must route or be removed.
- `/workspace/teach` is a redirect — either a teacher pause/push UI or remove from nav (classroom proper is Phase 5).
- Enhancement workbenches (`/algebra/advanced`, `/calculus/advanced`, `/geometry?tab=advanced`, etc.): hide IDs that are checklist-only; each remaining tool must open a real canvas.

**Phase 1 exit.** No `ModeCanvas`-only tab remains in scope. Share URL round-trips on Geometry Construction, Algebra Expressions, Calculus Limits, Graph Theory Build.

---

## Phase 2 — Geometry, Trigonometry, Number Systems

World-class shape, angle, and number. Peers: GeoGebra Classic, Desmos geometry (limited), Mathigon Polypad.

### Geometry Studio

#### Home

[/geometry](/geometry) — Phase 1 chrome + “construct a perpendicular bisector in 60s” hero.

#### Construction — [/geometry/construction](/geometry/construction)

| Tab | Tools | UI | UX | Content |
|---|---|---|---|---|
| Live Object Tree | Full compass-straightedge: point, line, segment, ray, circle, arc, perp, parallel, bisector, polygon, locus | Object tree with hide/lock/color | Keyboard tool keys like GeoGebra | Dependent objects stay linked; delete parent warns |
| Measurements | Length, angle, area, slope attached to objects | Measure badges | Click-to-pin | Exact vs 2 d.p. |
| Dependencies | Directed graph of parents | Mini DAG | Click node selects object | Why the figure cannot break |
| Proof Explanation | Auto-suggest SAS/SSS from measures; proof writer | Two-column + figure highlight | Export proof | Reconstruct perp bisector challenge (already in catalog) |

**Add.** Locus tool. Construction file share. Compass radius lock. Non-Euclidean *preview* off by default (Phase 5+).

#### Triangles — [/geometry/triangles](/geometry/triangles)

| Tab | Link | Add to 100% |
|---|---|---|
| Triangle Explorer | `?mode=Triangle Explorer` | Drag vertices; classify SSS/SAS live; angle marks; inequality warnings |
| Congruence | `?mode=Congruence` | Rigid motion overlay that *tries* to map △ABC onto △DEF; fail reasons |
| Similarity | `?mode=Similarity` | AA/SAS/SSS similarity; \(k\) slider that is a dilation, not a fake scale |
| Centers | `?mode=Centers` | G, I, O, H, nine-point; Euler line; drag and watch collinearity |
| Inequalities | `?mode=Inequalities` | Side-angle coupling; degenerate lock; “make the inequality fail” challenge |

#### Circles — [/geometry/circles](/geometry/circles)

| Tab | Link | Add to 100% |
|---|---|---|
| Chords | `?mode=Chords` | Equal chords ↔ equal arcs; perp from center; live products |
| Tangents | `?mode=Tangents` | Two tangents from a point; alternate segment |
| Angles | `?mode=Angles` | Inscribed = half central; same-arc equality |
| Power of a Point | `?mode=Power of a Point` | Intersecting chords / secant-tangent; product badges |
| Arcs & Sectors | `?mode=Arcs & Sectors` | Arc length, sector area; pie drag |

Keep undo + mobile toggle. Add theorem-to-proof jump into `/geometry/proofs`.

#### Polygons — [/geometry/polygons](/geometry/polygons)

| Tab | Link | Add to 100% |
|---|---|---|
| Regular Polygon | `?mode=Regular Polygon` | \(n\) handle; construction from circle |
| Interior Angles | `?mode=Interior Angles` | Tear to line; exterior 360° |
| Tessellation | `?mode=Tessellation` | Drag tiles; only 3,4,6 succeed regularly; show why 5 fails |
| Area | `?mode=Area` | Triangulation + shoelace; both visible |
| Diagonals | `?mode=Diagonals` | Count \(n(n-3)/2\); draw them without overlap mode |

#### Coordinate — [/geometry/coordinate](/geometry/coordinate)

| Tab | Link | Add to 100% |
|---|---|---|
| Distance | `?mode=Distance` | Drag A,B; 3-4-5 snap; formula highlight |
| Midpoint | `?mode=Midpoint` | Midpoint as average; section formula preview |
| Slope | `?mode=Slope` | Rise/run triangle; parallel/perp lock |
| Section Formula | `?mode=Section Formula` | Internal/external division |
| Locus | `?mode=Locus` | Trace \(|PA|=|PB|\), parabola, circle; equation readout |

Keep undo/redo + coach.

#### Measurement — [/geometry/measurement](/geometry/measurement)

| Tab | Link | Add to 100% |
|---|---|---|
| Length / Angle / Area / Perimeter | Matching modes | Composite decomposition you drag; unit switch |
| Scale | `?mode=Scale` | Scale bar; map vs figure |
| Error | `?mode=Error` | Pixel vs true; significant figures; “same area, min perimeter” challenge |

#### Geometry UX extras (Phase 2)

- Teacher mode already in `geometryStudioSession` — wire pause/push.
- Large labels default on tablets.
- Cross-link `/workspace/geometry` as “pro construction” with a banner, not a second product.

---

### Trigonometry Studio

Skip `/trigonometry/ar`.

#### Home — [/trigonometry](/trigonometry)

Hero: drag \(\theta\), sine/cosine badges, jump to unit circle.

#### Unit Circle — [/trigonometry/unit-circle](/trigonometry/unit-circle)

| Tab | Link | Add to 100% |
|---|---|---|
| Angles | `?mode=Angles` | Degrees/radians/revolutions; wrap |
| Unit Circle | `?mode=Unit Circle` | Drag ray; six functions; 60fps |
| Quadrants | `?mode=Quadrants` | Sign chart lights up |
| Exact Values | `?mode=Exact Values` | Snap 0,30,45,60,90,… ; surd labels |
| Reference Angles | `?mode=Reference Angles` | Acute reference overlay |

**Desmos-beat.** Circle and graph stay locked when you leave to Graphs tab (shared \(\theta\) in `trigStudioSession`).

#### Right Triangle — [/trigonometry/right-triangle](/trigonometry/right-triangle)

| Tab | Add |
|---|---|
| Solve Triangle | SOH-CAH-TOA; given two parts, solve; uncertainty |
| Ratios | Color-coded opposite/adjacent/hyp |
| Pythagoras | Live \(a^2+b^2=c^2\) tiles |
| Similarity | Nested similar right triangles |
| Special Triangles | 30-60-90 and 45-45-90 snap |

#### Functions & Graphs — [/trigonometry/graphs](/trigonometry/graphs)

| Tab | Add |
|---|---|
| Sine / Cosine / Tangent | Linked point on circle + graph |
| Transformations | \(A,B,C,D\) **handles on the graph** (not only sliders) |
| Comparison | Two functions; beat frequency preview → Waves |

#### Identities — [/trigonometry/identities](/trigonometry/identities)

| Tab | Add |
|---|---|
| Pythagorean | \(x^2+y^2=1\) as moving point |
| Angle Sum | Ptolemy / unit-circle derivation you play |
| Double / Half Angle | Animation from sum |
| Product-Sum | Wave view connection |

**Brilliant-beat.** Proof workspace: student orders tiles; figure must stay consistent.

#### Inverse Trig — [/trigonometry/inverse](/trigonometry/inverse)

| Tab | Add |
|---|---|
| Arcsin / Arccos / Arctan | Principal branch highlighted; other branches ghosted |
| Principal Values | Range locks |
| Compositions | \(\sin(\arcsin x)\) vs \(\arcsin(\sin x)\) traps |

#### Oblique — [/trigonometry/oblique](/trigonometry/oblique)

| Tab | Add |
|---|---|
| Sine Law / Cosine Law | Drag triangle; ambiguous SSA as **two overlapping triangles** |
| Area | \(\frac12 ab\sin C\) |
| SSA Ambiguous Case | Toggle acute/obtuse second triangle |
| Solve Triangle | Validated solver; impossible case explained |

#### Waves — [/trigonometry/waves](/trigonometry/waves)

| Tab | Add |
|---|---|
| Simple Wave | \(\theta\) from unit circle |
| Superposition | Two phasors |
| Harmonics | Build a target waveform (already in copy — implement) |
| Beats | \(\lvert f_1-f_2\rvert\) live |
| Phase | Phasor addition |

#### Applications — [/trigonometry/applications](/trigonometry/applications)

| Tab | Add |
|---|---|
| Heights & Distances | Elevation/depression; two-position problems |
| Bearings | Compass rose; north line |
| Navigation | Course + wind vector (light) |
| Surveying | Baseline two-station |
| Periodic Models | Tide / daylight (share engine with Modelling periodic) |

**Trig Phase 2 extras.** `/trigonometry/formula-visualizer` must open the matching lab, not a dead formula page.

---

### Number Systems Studio

#### Home — [/number-systems](/number-systems)

Nested sets hero; progress from `numberSystemsStudioSession`.

#### Rational — [/number-systems/rational](/number-systems/rational)

| Tab | Add |
|---|---|
| Fraction | p/q, reduce, tiles |
| Decimal | Terminating vs repeating; overline |
| Number line | Place and hop |

#### Irrational — [/number-systems/irrational](/number-systems/irrational)

| Tab | Add |
|---|---|
| Surds | \(\sqrt{2}\) vs 9; spiral or square diagonal |
| root 2 vs 9 | Side-by-side classification |
| pi and e | Decimal expand; not a fake “ends” |

#### Real line — [/number-systems/real-line](/number-systems/real-line)

| Tab | Add |
|---|---|
| Density | Insert a number between any two; zoom never runs out |
| Zoom | Infinite zoom with rationals labeled |
| Insert | Student places; coach validates |

#### Hierarchy — [/number-systems/hierarchy](/number-systems/hierarchy)

| Tab | Add |
|---|---|
| Nested sets | \(\mathbb{N}\subset W\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}\) clickable |
| 3D | Optional rail; not required for 100% 2D |

#### Concepts — [/number-systems/concepts](/number-systems/concepts)

Turn glossary cards into **mini canvases** (or deep-link). No dead definitions.

#### Practice — [/number-systems/practice](/number-systems/practice)

| Tab | Add |
|---|---|
| Quiz / Accuracy | Wrong answer opens the lab that shows why; exact definition of repeating 0.999… |

**Phase 2 exit.** Geometry transformations/proofs are real. Trig inverse/applications are drag-native. Number Systems concepts is not a glossary dump.

---

## Phase 3 — Algebra, Algebraic Structures, Calculus

Peers: Graspable Math, Desmos, Brilliant, Wolfram (CAS feel).

### Algebra Studio

#### Home — [/algebra](/algebra)

#### Expressions — [/algebra/expressions](/algebra/expressions)

| Tab | Link | Add to 100% |
|---|---|---|
| Simplify | `?tab=Simplify` | Tiles; zero-pair **animation** at Graspable speed |
| Expand | `?tab=Expand` | Area model of distributivity |
| Factor | `?tab=Factor` | Reverse area; integer factorization modes |
| Combine Terms | `?tab=Combine Terms` | Like-term gravity |

Undo already exists — keep and show history strip.

#### Equations — [/algebra/equations](/algebra/equations)

| Tab | Add |
|---|---|
| Linear | Balance scale; do-unto-both |
| Quadratic | Complete-the-square tiles + graph |
| Absolute Value | Branches; extraneous |
| Inequalities | Sign reversal on multiply-by-negative **as a flip animation** |

#### Functions — [/algebra/functions](/algebra/functions)

| Tab | Add |
|---|---|
| Families | Parent functions library |
| Transformations | Handles on graph (Desmos) |
| Composition | Two machines; numeric + graphic |
| Inverse | Reflection in \(y=x\); domain restrict |
| Piecewise | Domain editor; dots/holes |

#### Polynomials — [/algebra/polynomials](/algebra/polynomials)

| Tab | Add |
|---|---|
| Roots | Drag roots; multiplicity bumps |
| Factors | Factor ↔ graph |
| Division | Synthetic division animation |
| End Behavior | Leading-term overlay |
| Multiplicity | Bounce vs cross |

Complex roots: jump to Complex Argand (Phase 4) with a banner.

#### Systems — [/algebra/systems](/algebra/systems)

| Tab | Add |
|---|---|
| Graphing | Two lines; classify |
| Substitution / Elimination | Step highlight on the graph |
| Matrices | 2×2 / 3×3; jump to LA row-reduction |
| Inequalities | Feasible region (share later with Modelling optimization) |

#### Exponents & Logs — [/algebra/exponents-logs](/algebra/exponents-logs)

| Tab | Add |
|---|---|
| Exponent Laws | Counterexample explorer (already in enhancement list — put it here) |
| Radicals | Extraneous-root check |
| Exponential & Logs | Inverse pair |
| Equations | Change of base visual |

#### Sequences — [/algebra/sequences](/algebra/sequences)

| Tab | Add |
|---|---|
| Arithmetic / Geometric | Dots + closed form |
| Recursive | Recurrence stepper |
| Sigma | Partial sums vs closed form |
| Patterns | Link Discrete number-patterns |

#### Algebraic Proof — [/algebra/proof](/algebra/proof)

| Tab | Add |
|---|---|
| Identities | Tile proof |
| Equation Proof | Step checker |
| Induction | \(n\) slider; base + step |
| Inequality | Number-line proof |
| Counterexample | Student builds a fail |

#### CAS Explorer — [/algebra/cas](/algebra/cas)

**Stop being a gateway.** In-lab CAS: Solve, Simplify, Factor, Expand, Substitute, Differentiate — with **candidate check against the figure**. Workspace CAS remains the power-user.

#### Advanced Workbench — [/algebra/advanced](/algebra/advanced)

Each of the 25 ALG tools must open a canvas (Phase 1 hide-if-fake). Phase 3: remaining tools get the same wow bar (3×3 elimination, piecewise editor, etc.).

---

### Algebraic Structures Studio

Add a real home at [/algebraic-structures](/algebraic-structures) (cards), then labs:

#### Structure Test — [/algebraic-structures/structure-test](/algebraic-structures/structure-test)

| View | Add |
|---|---|
| Operation graph | Cycle graph you drag |
| Cayley table view | Axiom lights: closure, assoc, identity, inverse, commute |
| Structure diagram | Magma → group path |

**Content.** Counterexample finder writes the failing tuple.

#### Cayley Tables — [/algebraic-structures/cayley-tables](/algebraic-structures/cayley-tables)

Editable table; Latin-square coloring; group detection; export.

#### Semigroups & Monoids — [/algebraic-structures/semigroups-monoids](/algebraic-structures/semigroups-monoids)

| View | Add |
|---|---|
| Operation graph / Cayley / Composition | Associativity animation \((ab)c\) vs \(a(bc)\) |

#### Posets & Lattices — [/algebraic-structures/posets-lattices](/algebraic-structures/posets-lattices)

Hasse drag; meet/join highlight; lattice vs poset fail cases.

#### Boolean Algebra — [/algebraic-structures/boolean-algebra](/algebraic-structures/boolean-algebra)

| View | Add |
|---|---|
| Simplification | Law tiles |
| Truth Table | Linked to expression |
| K-map | 2–4 vars; grouping drag |
| Circuits | Toggle gates (share Discrete logic kernel) |

---

### Calculus Studio

Keep session, drawer, reduced-motion. Raise every **mode** to Desmos smoothness + Brilliant “why”.

#### Home — [/calculus](/calculus)

#### Limits — [/calculus/limits](/calculus/limits)

| Tab | Link | Add to 100% |
|---|---|---|
| Limits | `?mode=limits` | \(\varepsilon\)-\(\delta\) **bands on both axes**; drag |
| Continuity | `?mode=continuity` | Hole / jump / infinite classification |
| Discontinuities | `?mode=discontinuities` | Removable vs jump vs essential |
| Asymptotes | `?mode=asymptotes` | Horizontal/vertical/oblique |
| L'Hopital | `?mode=lhopital` | Prerequisite check \(\frac00,\frac\infty\infty\); then slopes |

#### Derivatives — [/calculus/derivatives](/calculus/derivatives)

| Tab | Link | Add |
|---|---|---|
| Tangent | `?mode=tangent` | Secant → tangent filmstrip |
| Rules | `?mode=rules` | Expression tree of the derivative |
| Chain Rule | `?mode=chain` | Linked inner/outer graphs |
| Implicit | `?mode=implicit` | Tangent and normal on F(x,y)=0 |
| Higher Order | `?mode=higher` | Motion: s,v,a |
| Linearization | `?mode=linearization` | Error band |

#### Derivative Applications — [/calculus/derivative-applications](/calculus/derivative-applications)

| Tab | Add |
|---|---|
| Motion | Particle on a line; v/a signs |
| Related Rates | Similar-triangle diagram with labels |
| Curve Analysis | Sign charts generated from the graph |
| Optimization | Constraint picture + calculus |
| Mean Value | Rolle + MVT points you can see |

#### Integration — [/calculus/integration](/calculus/integration)

| Tab | Add |
|---|---|
| Antiderivative | Family +C slider |
| Definite Integral | Signed area |
| FTC | Accumulator graph vs original |
| Riemann Sums | Left/right/mid/trap; n → ∞ |
| Numerical | Error vs method |

#### Integration Techniques — [/calculus/integration-techniques](/calculus/integration-techniques)

| Tab | Add |
|---|---|
| Substitution | Interval mapping animation \(x\to u\) |
| By Parts | Tabular + highlight u/dv |
| Partial Fractions | Cover-up on the graph of the integrand |
| Trig Integrals / Trig Sub | Triangle built from the radical |
| Improper | Convergence explorer |

#### Integral Applications — [/calculus/integral-applications](/calculus/integral-applications)

| Tab | Add |
|---|---|
| Area Between Curves | Split at intersections |
| Volumes | Washer **and** shell on the **same** solid |
| Arc Length / Surface Area | Trace |
| Work / Fluid | Physical diagram + integral |

Volumes 3D must match Graph Studio 3D quality (reuse engine, don’t fork).

#### Differential Equations — [/calculus/differential-equations](/calculus/differential-equations)

| Tab | Add |
|---|---|
| Slope Fields | Click IVP (already) |
| Initial Value | Solution overlay |
| Separable | Separation animation |
| Growth Models | Exponential vs logistic |
| Euler / RK4 | Method comparison + step size error |

#### Series / Parametric / Polar — [/calculus/series-parametric-polar](/calculus/series-parametric-polar)

| Tab | Add |
|---|---|
| Sequences / Convergence | Tests as interactive (nth, ratio, integral) |
| Power Series / Taylor | Remainder slider; interval of convergence |
| Parametric | Point on curve; dy/dx |
| Polar | Fold `/polar-visualizer` into this mode |

#### Multivariable / Vector — [/calculus/multivariable-vector](/calculus/multivariable-vector)

| Tab | Add |
|---|---|
| Partial / Gradient / Tangent Plane | Handles on surface |
| Optimization | Constrained (Lagrange) contour |
| Multiple Integrals | Region builder; order dx dy vs dy dx |
| Vector Fields | Flow particles |
| Theorems | Green/Stokes/Divergence as **moving** regions (wow) |

#### Advanced — [/calculus/advanced](/calculus/advanced)

Same honesty as Algebra advanced. Tools that exist as real canvases stay; others hide until built.

**Calculus aliases.** `/math/limits-continuity`, `/math/derivatives`, `/math/integration`, `/math/slope-fields` should be redirects into these modes (one product).

**Phase 3 exit.** Algebra CAS is in-lab. Structures has a home. Every Calculus `?mode=` has a unique challenge and 60fps traces.

---

## Phase 4 — Linear Algebra, Complex Numbers, Modelling

Peers: 3Blue1Brown Essence (feel), GeoGebra 3D, PhET / Insight Maker.

Always mount existing extras (`VectorVisualizer`, `MatrixTransformationVisualizer`, `EigenvectorVisualizer`, `ComplexPlaneVisualizer`, etc.) as the **default canvas**, never a fallback stub.

### Linear Algebra Studio

#### Home — [/linear-algebra](/linear-algebra)

#### Vectors — [/linear-algebra/vectors](/linear-algebra/vectors)

| Tab | Add |
|---|---|
| Dot | Alignment; \(\cos\theta\) |
| Cross | 3D parallelogram; right-hand |
| Projections | Shadow on a line/plane |
| Add / Subtract / Scale | Parallelogram / ray |

#### Matrices — [/linear-algebra/matrices](/linear-algebra/matrices)

| Tab | Add |
|---|---|
| Add / Multiply | Product = composition of maps **shown** |
| Inverse | Map then inverse; \(AA^{-1}=I\) animation |
| Transpose | Geometric meaning light |
| Block | Block multiply |

Deep-link `/matrices` sandbox as calculator, not a second teacher.

#### Row Reduction — [/linear-algebra/row-reduction](/linear-algebra/row-reduction)

| Tab | Add |
|---|---|
| 3D View / 2D View | Planes vs lines; free variable slider |
| Pivot Map | Highlight pivots; rank |

Row-ops workbench: click operations, figure updates.

#### Linear Transforms — [/linear-algebra/linear-transforms](/linear-algebra/linear-transforms)

| Tab | Add |
|---|---|
| Identity / R90 / Scale X / Shear | Unit square + grid |
| 2D / 3D | Same matrix; two canvases |

Columns of \(A\) = images of \(e_1,e_2\).

#### Determinants — [/linear-algebra/determinants](/linear-algebra/determinants)

| Tab | Add |
|---|---|
| 2D Area / 3D Volume | Signed area you shear to 0 |
| Cofactor | Expansion highlight |
| Orientation / Singularity | Color flip; collapse |

#### Vector Spaces — (built in Phase 1; Phase 4 polish)

Gram–Schmidt preview; \(\mathbb{R}^3\) basis.

#### Eigenvectors — [/linear-algebra/eigenvectors](/linear-algebra/eigenvectors)

| Tab | Add |
|---|---|
| 2D / 3D | Probe vector; glow on eigenline |
| Phase Portrait | Default view; trajectories |

Defective / complex eigenvalues: labeled “stretch-rotate” (link Complex).

#### Orthogonality — [/linear-algebra/orthogonality](/linear-algebra/orthogonality)

| Tab | Add |
|---|---|
| 3D View / Vector Decomp / 2D Projections | Gram–Schmidt you drag; residual ⊥ subspace |

#### Least Squares — [/linear-algebra/least-squares](/linear-algebra/least-squares)

| Tab | Add |
|---|---|
| Fit / Residuals / Column Space | Drag points; residual ⊥ columns; \(R^2\); outlier |

#### Playground — [/linear-algebra/playground](/linear-algebra/playground)

One composition stack shared with Transforms. Reorder = matrix product order.

---

### Complex Numbers Studio

#### Home — [/complex-numbers](/complex-numbers)

#### Argand Plane — [/complex-numbers/argand-plane](/complex-numbers/argand-plane)

| Tab | Add |
|---|---|
| Plot / Modulus / Argument / Conjugate / Distance / Locus | Drag \(z\); \(|z|=r\) circle; \(\arg\) ray; conjugate fold |

Always mount `ComplexPlaneVisualizer`.

#### Arithmetic — [/complex-numbers/arithmetic](/complex-numbers/arithmetic)

| Tab | Add |
|---|---|
| Add / Subtract | Parallelogram |
| Multiply / Divide | Rotate-scale; similar triangles |
| Conjugate | Fold |

#### Polar Forms — [/complex-numbers/polar-forms](/complex-numbers/polar-forms)

Three forms **always in sync** (not separate dead tabs): Rectangular, Polar, Exponential. Branch cut control.

#### Rotation — [/complex-numbers/rotation](/complex-numbers/rotation)

| Tab | Add |
|---|---|
| Rotate / Scale / Sequence | Spiral of powers; multiply by \(i\) = +90° |

#### Roots — [/complex-numbers/roots](/complex-numbers/roots)

| Tab | Add |
|---|---|
| Square / nth / Roots of Unity / Polynomial | Regular n-gon; De Moivre; drag n |

#### Euler — [/complex-numbers/euler](/complex-numbers/euler)

| Tab | Add |
|---|---|
| Unit Circle / Helix / Projections / Taylor | Four **linked** views (already promised); Taylor terms add on the circle |

#### Loci & Transforms — [/complex-numbers/loci](/complex-numbers/loci)

| Tab | Add |
|---|---|
| Circle / Line Loci | Drag; equation |
| Möbius | Before/after planes; grid map; fixed points |
| Inversion | Circle of inversion |
| Affine Map | \(az+b\) |

#### Fractals — (Phase 1 engine; Phase 4 polish)

Period bulbs labeled; Julia connectivity theorem as a challenge.

#### Waves & Circuits — [/complex-numbers/waves-circuits](/complex-numbers/waves-circuits)

| Tab | Add |
|---|---|
| Phasors / AC Circuits / Signal Rotation / Impedance | RLC in the plane; power factor; tune L,C |

Not an XL formula card.

---

### Mathematical Modelling Studio

#### Home — [/mathematical-modelling](/mathematical-modelling)

#### Motion — [/mathematical-modelling/motion](/mathematical-modelling/motion)

| Tab | Add |
|---|---|
| Projectile / Vehicle / Pursuit / Drag | ODE; overlay data; RMSE; units |

#### Population — [/mathematical-modelling/population](/mathematical-modelling/population)

| Tab | Add |
|---|---|
| Exponential / Logistic / Harvesting / Age Structured | \(K\) equilibrium; harvesting keep-near-\(K\) challenge (already in copy) |

#### Epidemics — [/mathematical-modelling/epidemics](/mathematical-modelling/epidemics)

| Tab | Add |
|---|---|
| SIR / SEIR / Vaccination / Interventions | Compartment flow **animation**; \(R_e\); hospital capacity |

#### Finance — [/mathematical-modelling/finance](/mathematical-modelling/finance)

| Tab | Add |
|---|---|
| Savings / Loans / Investments / Inflation / Annuities | Nominal vs real; goal seek |

#### Optimization — [/mathematical-modelling/optimization](/mathematical-modelling/optimization)

| Tab | Add |
|---|---|
| Production / Transport / Design / Allocation / Scheduling | Feasible region drag; objective line; shadow prices |

#### Networks — [/mathematical-modelling/networks](/mathematical-modelling/networks)

| Tab | Add |
|---|---|
| Dijkstra / A* | Traffic sliders; close roads; compare (reuse Graph Theory engine) |

#### Regression — [/mathematical-modelling/regression](/mathematical-modelling/regression)

| Tab | Add |
|---|---|
| Scatter & Fit / Residuals / Diagnostics / Prediction | Degree; outliers; train/holdout; extrapolation warning |

#### Periodic — [/mathematical-modelling/periodic](/mathematical-modelling/periodic)

| Tab | Add |
|---|---|
| Tides / Seasons / Daylight / Sound / Cycles | Harmonic fit; share trig waves engine |

#### Numerical — [/mathematical-modelling/numerical](/mathematical-modelling/numerical)

| Tab | Add |
|---|---|
| Monte Carlo / Iteration / Random Walk / Diff Approx / Sensitivity | Seed; batches; 6-digit \(\pi\) challenge |

#### Comparison — (Phase 1 rebuild; Phase 4: data import + report export)

#### Advanced — [/mathematical-modelling/advanced](/mathematical-modelling/advanced)

Honesty pass; identifiability warnings; AIC already in Comparison.

**Phase 4 exit.** No LA/Complex lab falls back to a static SVG. Modelling comparison is a real selector. Graph algorithms in Modelling call Graph Theory, not a second Dijkstra.

---

## Phase 5 — Discrete family + classroom layer

Peers: VisuAlgo, Set-theory applets, Desmos Classroom, Crypto demo sites.

### Number & Discrete Studio

Skip rebuilding Sets/Graphs (Phase 1 redirects). Polish the rest to 100%.

#### Number Sense — (Phase 1 lab; Phase 5: ratio tables, powers of 10 zoom)

[/discrete-world/number-sense](/discrete-world/number-sense)

#### Primes — [/discrete-world/primes](/discrete-world/primes)

Already the quality bar. Raise tabs:

| Tab | Add |
|---|---|
| Sieve of Eratosthenes | Speed + range; sound optional; reduced motion |
| Factor Tree | Unique factorization visual proof |
| GCD & LCM | Area / number-line proofs |
| Divisibility Rules | Why 3,9,11 work |
| Prime Patterns | Ulam / mod wheels |

Keep `primesSession` + misconceptions.

#### Modular Arithmetic — [/discrete-world/modular-arithmetic](/discrete-world/modular-arithmetic)

| Tab | Add |
|---|---|
| Clock / Congruence / Inverses / Linear Congruences / Cycles | CRT visual; hops animation; \(gcd=1\) inverse existence |

#### Number Patterns — [/discrete-world/number-patterns](/discrete-world/number-patterns)

| Tab | Add |
|---|---|
| Figurate | Grow by tiles |
| Recursive / Sequences | First/second differences |
| Pascal Triangle | Combinatorics jump |
| Fractals | Discrete Sierpinski from Pascal (not Complex Mandelbrot) |

#### Combinatorics — [/discrete-world/combinatorics](/discrete-world/combinatorics)

| Tab | Add |
|---|---|
| Arrangements / Selections / Pigeonhole / Inclusion-Exclusion / Generating Tree | Keep dedicated lab; **canonical counting engine** |

Redirect `/combinatorics` and `/math/permutations-combinations` into these tabs.

#### Logic — (Phase 1 gates; Phase 5: CNF/DNF, SAT, deep-link `/mathematical-logic` and `/truth-table` as the same engine)

[/discrete-world/logic](/discrete-world/logic)

#### Algorithms — [/discrete-world/algorithms](/discrete-world/algorithms)

| Tab | Add |
|---|---|
| Sorting | Step debugger: bubble vs merge; array + pseudocode |
| Searching | Binary vs linear |
| Euclid | Number of steps vs size |
| Graph Traversal | Call Graph Theory BFS/DFS |
| Complexity | Overlay \(n\log n\) vs \(n^2\) curves |

#### Cryptography — [/discrete-world/cryptography](/discrete-world/cryptography)

| Tab | Add |
|---|---|
| Caesar / Affine / Vigenère | Frequency |
| RSA Concept | Educational keys; **animate** \(m^e \bmod n\) |
| Diffie-Hellman | Paint-mix metaphor + numbers |
| Hashing | Avalanche toy |

---

### Set Theory Studio

[/set-theory](/set-theory)

| Page | Link | Add to 100% |
|---|---|---|
| Home | [/set-theory](/set-theory) | Studio chrome (Phase 1) |
| Set Builder | [/set-theory/set-builder](/set-theory/set-builder) | Roster + builder; universe |
| Venn Engine | [/set-theory/venn-diagram-engine](/set-theory/venn-diagram-engine) | Drag circles; expression undo (exists); region click = expression |
| Relations | [/set-theory/relations](/set-theory/relations) | Matrix + digraph; property lights |
| Hasse | [/set-theory/hasse-diagram](/set-theory/hasse-diagram) | Cover relations; drag layout |
| Functions | [/set-theory/functions](/set-theory/functions) | Mapping diagram; in/sur/bijection |
| Representations | [/set-theory/representations](/set-theory/representations) | Cartesian, power set, classes |
| Practice | [/set-theory/practice](/set-theory/practice) | Wrong → Venn region highlight |

Discrete Sets tab is a window into this studio.

---

### Graph Theory Studio

[/graph-theory](/graph-theory)

| Tab | Add to 100% |
|---|---|
| Build | Drag vertices/edges; directed/weighted; snap; undo |
| Representations | Adj list / matrix / incidence **must match** (already claimed — keep honest) |
| Algorithms | BFS, DFS, Dijkstra, FW, MST, coloring, flow — **step + pseudocode + invariant** |
| Properties | Euler/Hamilton checks; degree sum |
| Learn & Validate | Challenges that use the student’s graph |

**VisuAlgo-beat.** Student-built graph, not only presets. Share graph in Project Center.

Discrete Graphs tab = `?tab=algorithms` here.

---

### Phase 5 classroom / wow layer (beats Desmos Classroom)

Applies to **every studio in this document**.

| Feature | Where | What |
|---|---|---|
| Activity link | All labs | Teacher starts a figure; student joins; pause/push |
| Class code | Project Center | Like Desmos; anonymous nicknames |
| Snapshot gallery | Studio homes | Student screens (opt-in) |
| Printable figure | All canvases | SVG + large-label |
| LMS deep link | Same | `?mode=` + `?fig=` |
| Keyboard map | All | Documented; Calculus shortcuts dialog cloned |
| Mobile | All | One-hand tabs; geometry already has mobile toggle — clone |
| Performance | All | Worker for heavy (fractals, 3D, sieve large N) |
| Exact/approx | All | Platform enhancement already listed — enforce in UI |

---

## Cross-studio unification (do inside the phases above, do not spawn new studios)

| Idea | Canonical surface | Others become |
|---|---|---|
| 2D graph | [/math-lab/graphing-calculator](/math-lab/graphing-calculator) | Algebra functions, Trig graphs, Calc plots **embed** it |
| 3D surface | [/math-lab/3d-graphing](/math-lab/3d-graphing) | Calc multivariable volumes, LA 3D |
| CAS | Algebra CAS + [/problem-solver](/problem-solver) | One engine, two skins |
| Counting | [/discrete-world/combinatorics](/discrete-world/combinatorics) | Redirect other combinatorics routes |
| Sets | [/set-theory](/set-theory) | Discrete Sets |
| Graphs | [/graph-theory](/graph-theory) | Discrete Graphs, Modelling networks |
| Polar | Calculus polar mode | `/polar-visualizer` redirect |
| Fourier | Calculus series + Trig waves | One animator |

---

## Phase checklist (execution)

### Phase 1

- [ ] Shared history, share URL, exact/approx, challenge-bound-to-state
- [ ] Studio homes: live cards + resume
- [ ] Algebraic Structures home
- [ ] Geometry Transformations (5 tabs)
- [ ] Geometry Proofs (5 tabs)
- [ ] Shapes Explorer solids tabs at studio quality
- [ ] LA Vector Spaces (5 tabs)
- [ ] Complex Fractals (2 tabs)
- [ ] Discrete Sets/Graphs rewired
- [ ] Discrete Number Sense + Logic real canvases
- [ ] Modelling Comparison (3 tabs)
- [ ] Hide fake enhancement IDs

### Phase 2

- [ ] Geometry Construction, Triangles, Circles, Polygons, Coordinate, Measurement — every listed tab
- [ ] Trig all labs except AR — every listed tab
- [ ] Number Systems all pages/modes including Concepts as mini-labs

### Phase 3

- [ ] Algebra every lab/tab including in-lab CAS
- [ ] Algebraic Structures every page/view
- [ ] Calculus every page `?mode=` including multivariable theorems as motion
- [ ] Calc/algebra/polar aliases redirect in

### Phase 4

- [ ] Linear Algebra every lab/tab; extras always mounted
- [ ] Complex every lab/tab including Möbius grid + phasors
- [ ] Modelling every lab/tab; networks uses Graph Theory

### Phase 5

- [ ] Discrete remaining tabs at primes-level quality
- [ ] Set Theory pages
- [ ] Graph Theory tabs + share
- [ ] Classroom activity links, class codes, print, workers

---

## Definition of 100% for a single tab (QA)

A tab ships only if:

1. **Tools** — A new user can drag something in 3 seconds and see an invariant change. Undo works. Challenge uses live numbers.
2. **UI** — No stub art. Dark/light. 60fps on a mid laptop for default N.
3. **UX** — URL with `?mode=` restores the tab. Mobile usable. Keyboard documented.
4. **Content** — Unique why-copy, one misconception, next-tab suggestion, teacher prompt.
5. **Peer test** — Side-by-side: GeoGebra (construction), Desmos (graph), Brilliant (explanation). This tab must win on *at least two* and not lose badly on the third.

---

## Suggested order inside a phase

1. Kernel / rewire (no new math).
2. Highest-traffic lab (Triangles, Unit Circle, Limits, Vectors, Argand, Epidemics, Primes).
3. Remaining tabs of that lab.
4. Studio home polish.
5. Cross-links and redirects.

Lessons remain a later programme. Statistics and AR remain parked until this programme is done.
