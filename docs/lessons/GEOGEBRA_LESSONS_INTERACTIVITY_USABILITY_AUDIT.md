# GeoGebra Lessons Interactivity and Usability Audit

**Application:** Math Universe Visualizations  
**Module:** Interactive Lessons  
**Audit date:** 22 July 2026  
**Catalog audited:** 674 lesson pages, 14 categories, 23 lazy-loaded adapter families  
**Reference product:** GeoGebra Resources, Activities, Books, Classroom, and mathematics apps

## Executive verdict

The lesson module has a strong reusable foundation, consistent navigation, concise page copy, responsive layouts, and broad engine coverage. It is already more structured than a raw GeoGebra applet because every lesson uses the same Predict → Explore → Try → Check learning flow.

It is **not yet correct to certify all 674 pages as interactive, concept-specific, or GeoGebra-equivalent**.

| Gate | Result | Verdict |
|---|---:|---|
| Canonical lesson routes available | 674 / 674 | Pass |
| Page renders a live lesson surface | 674 / 674 | Pass |
| Page contains at least one live control | 669 / 674 | **Fail: 5 static pages** |
| Representative engine responds to input | 23 / 23 adapter families | Pass |
| Representative mobile layout avoids horizontal page overflow | 23 / 23 adapter families | Pass |
| Lesson has a concept-specific activity | Not certifiable | **Fail: confirmed mismatches** |
| Lesson challenge assesses its named concept | Not certifiable | **Fail: adapter-wide generic challenges** |
| GeoGebra-style direct manipulation | Partial | Needs substantial strengthening |
| Representative control labeling | 22 / 23 pages fully labeled | One calculator input needs a programmatic label |

The route-level interactive coverage is **99.26% (669/674)**. That number must not be interpreted as concept-quality coverage: several technically interactive pages show an activity unrelated to the page title.

## Scope and method

This audit combined five kinds of evidence:

1. Catalog and source audit of all 674 definitions, shared lesson flow, challenge runtime, adapter routing, persistence, workspace handoff, and lazy loading.
2. Rendered browser smoke test of all 674 canonical lesson routes.
3. Live control test of one representative page from each of the 23 adapter families.
4. Mobile-width browser test of all 23 adapter families at a requested 390 × 844 viewport; the browser content viewport was 375 pixels wide.
5. Comparison with current official GeoGebra documentation and a current GeoGebra student activity preview.

The full route audit checked that every page loaded the lesson title and live surface, exposed controls, and avoided page-level horizontal overflow. The adapter audit changed a numeric input, text input, or button and checked that the rendered model changed. Mathematical and pedagogical fidelity was then sampled across high-risk topics. A complete mathematics review of 674 concepts still requires subject-expert sign-off.

## What GeoGebra currently establishes as the comparison standard

GeoGebra's official model is broader than placing a graph on a page:

- An Activity can combine a dynamic applet with concise text, images, video, web/PDF content, open questions, and multiple-choice questions.
- A Book organizes related Activities into chapters and a deliberate sequence.
- Mathematics objects can be created and manipulated using view-specific tools for Graphics, 3D, CAS, and Spreadsheet views; commands provide an additional construction path.
- Student activities can be assigned through Classroom, with live progress, started/not-started state, whole-class responses, anonymized display, pausing, and co-teaching.
- Resources expose useful discovery metadata such as grade range, skill, exploration/practice type, verification, translations, prerequisites, and next resources.
- Accessibility guidance explicitly covers long sliders, increment/decrement controls, keyboard focus, arrow-key manipulation, Space activation, touch support, contrast, non-color distinctions, tooltips, and screen-reader descriptions for graphics views.

The current official student preview for “Identifying Angles Around Us” demonstrates a particularly useful pattern: a short purpose statement, a focused GeoGebra task, and a separate open-ended reflection task. Math Universe has a similarly concise structure, but its mathematical surface needs to be as specific to the named concept as the GeoGebra task.

## Strengths of the Math Universe lesson module

### 1. Clear, low-text lesson shell

The header contains the concept, short purpose, reset, share, and workspace handoff without turning the page into a textbook. The side panel reveals only the prompt needed for the current stage.

### 2. Consistent inquiry cycle

Predict → Explore → Try → Check is easier for students to understand than unrelated controls on every page. Prediction persistence and deterministic challenge seeds support returning to a lesson.

### 3. Existing mathematics engines are reused

The adapters call existing calculator, graph, geometry, 3D, CAS, spreadsheet, statistics, probability, inference, sequence, matrix, complex, graph-theory, and finance kernels. This is the right architecture for correctness, performance, and future authoring.

### 4. On-demand loading works

All 23 adapters are lazy-loaded. A concept route does not eagerly mount every workspace. The complete route audit found no persistent loading failures. Ten pages initially appeared blank only during an intentionally aggressive 35 ms navigation test and all ten loaded normally on retry.

### 5. Responsive foundations are good

All 23 representative engine pages fit the mobile viewport without horizontal page overflow. Live surfaces measured approximately 359 pixels within a 375-pixel content viewport.

### 6. Controls generally have usable semantics

The shared slider component provides a labeled range control plus an exact numeric input. Tables use headers; many SVGs use `role="img"` and an accessible label; buttons are keyboard-focusable; status and feedback areas use semantic roles.

### 7. Workspace handoff is always visible

Every representative page included a Workspace link appropriate to the adapter family. This supports a valuable progression from a constrained lesson into a full graph, geometry, 3D, CAS, spreadsheet, analysis, discrete, or teaching workspace.

## Blocking findings

### P0-1: Five pages are not interactive

These pages render a fixed truth table and contain no button, input, select, or editable control inside the live lesson surface:

| ID | Lesson | Current content |
|---:|---|---|
| 582 | Set Builder | Fixed `p → (q ∨ p)` truth table |
| 586 | Subsets and Power Sets | Fixed `p → (q ∨ p)` truth table |
| 587 | Truth Tables | Fixed `p → (q ∨ p)` truth table |
| 588 | Logical Connectives | Fixed `p → (q ∨ p)` truth table |
| 589 | Quantifiers | Fixed `p → (q ∨ p)` truth table |

Required correction:

- Set Builder: editable universe, rule, and roster/set-builder toggle.
- Subsets and Power Sets: selectable elements and generated subset lattice/list.
- Truth Tables: editable proposition or selectable connective with live rows.
- Logical Connectives: toggle `p` and `q`, choose a connective, and compare result.
- Quantifiers: editable finite domain and predicate with `∀`/`∃` evaluation.

### P0-2: Some interactive pages show the wrong concept

Confirmed examples:

| Lesson | Current activity | Required activity |
|---|---|---|
| Differential Equations (#443) | Simplifies `2*x+3*x-x+4-2` | Direction field, initial condition, solution curve, or symbolic ODE solve |
| Graph Colouring (#576) | Dijkstra shortest-path playback | Assign colors to vertices; detect conflicts; track chromatic count |
| Union, Intersection and Difference (#583) | Dijkstra shortest-path playback | Editable sets or Venn regions for `∪`, `∩`, and difference |
| Nets of Solids (#404) | Orbit/size controls on a solid | Animate folding and unfolding with face correspondence |
| Eigenvalues and Eigenvectors (#359) | Determinant and row-reduction view | Eigen directions, scaling, characteristic polynomial, and transformed vectors |
| Box Plot (#480) | Generic sample with regression slope | Quartiles, whiskers, outlier rule, and draggable data/box plot |
| Simple Interest (#591) | Declining-balance payment schedule | Linear `A=P(1+rt)` model with principal, rate, and time |

The Simple Interest page currently recalculates interest from the changing opening balance and subtracts a payment. That is a loan/amortization-style schedule, not the named linear simple-interest model.

### P0-3: Challenges are adapter-wide, not lesson-specific

The challenge runtime selects one generic challenge per adapter. Examples:

- Every Geometry 2D lesson receives a distance-between-two-points question.
- Every 3D lesson receives a cube-volume question.
- Every matrix lesson receives a 2 × 2 determinant question.
- Every complex-number lesson receives the modulus of `3+4i`.
- Every discrete lesson receives a combinations question.
- Every finance lesson receives a one-year simple-interest question.

Consequently, a student can complete a lesson titled Graph Colouring, Quantifiers, Nets of Solids, Eigenvalues, or Compound Interest by answering a challenge about a different concept. The Check stage must derive its question and expected result from the current lesson's model state.

### P0-4: Catalog interaction promises do not always match the UI

The workbook-derived metadata promises interactions such as construct, drag, measure, replay, orbit, slice, unfold, animate, run algorithms, shade sets, inspect residuals, optimise, sort, filter, and trace. Many rendered adapters expose only exact numeric inputs/sliders and a fixed SVG.

An interaction specification should be testable, not descriptive marketing. Each lesson needs an explicit interaction contract that lists the controls and observable changes required for certification.

## Adapter-family assessment

| Adapter | Lessons | Current specialization | Assessment |
|---|---:|---|---|
| Calculator | 18 | Title-aware starting expressions and calculator modes | Good base; add label to expression textarea |
| Algebra | 20 | One linked linear model `y=ax+b` | Too generic for conditional visibility, piecewise definitions, and other workspace concepts |
| Number | 35 | Number-theory or fraction/ratio manipulative | Interactive but too few models for 35 distinct concepts |
| Authoring | 22 | One slider/preview configuration | Useful authoring demo; tables, media, scripting, and question components need their own previews |
| Learning | 17 | One `y=3x` Predict–Test–Explain flow | Flow is user-friendly but repeated across all learning concepts |
| Platform | 18 | Movable point, zoom, contrast, reset | Strong capability demo; specialize save/export/language/screen-reader pages |
| Graph | 56 | Multiple title-aware function/curve presets | One of the strongest families; needs direct point dragging and richer per-concept tools |
| Algebra/CAS | 37 | Solve/factor/expand/substitute/inequality modes | Good engine reuse; expand coverage and concept-specific challenges |
| Geometry 2D | 75 | Two seeded points plus limited transform modes | Major gap versus GeoGebra construction tools and direct object dragging |
| Vector | 15 | Two vectors with magnitude, sum, angle, projection | Good shared model; specialize vector lines/planes/applications |
| Trigonometry | 20 | Linked unit circle and sin/cos/tan graph | Strong visual link; broaden triangle/identity/equation activities |
| CAS | 22 | Several command presets | Good base; Differential Equations demonstrates incorrect fallback behavior |
| Calculus | 57 | A few function presets and derivative/integral mode | Too generic for limits, numerical methods, multivariable, and differential-equation concepts |
| Spreadsheet | 17 | Editable three-column grid and linked chart | Interactive; sort/filter/pivot/import and concept-specific workflows are not represented |
| Statistics | 33 | One sample, outlier control, and regression metrics | Too generic; distributions, box plots, histograms, and categorical data need distinct views |
| Probability | 37 | Several title-aware simulations | Good base; add direct sample-space/event construction and lesson-specific assessment |
| Inference | 19 | Confidence-interval or test mode | Useful base; individual tests and assumptions need distinct models |
| Sequence | 13 | Arithmetic/geometric/Fibonacci/harmonic variants | Good base; add recurrence editing and visible convergence/error behavior |
| Matrix | 18 | Editable 2 × 2 matrix, determinant, row steps, grid transform | Too generic for eigen, rank, systems, and higher-dimensional concepts |
| Complex | 13 | Complex plane with optional multiplication/rotation | Good base; add loci, roots, powers, mappings, and direct point dragging |
| Geometry 3D | 50 | Solid or surface mode with size/section/orbit controls | Good kernel reuse; lacks direct 3D manipulation, actual sections, and unfolding for several titles |
| Discrete | 35 | Counting, one fixed truth table, or one Dijkstra graph | Highest-risk family; five static pages and several incorrect dispatches |
| Finance | 27 | One six-row balance/payment schedule | Highest-risk mathematical mismatch; needs separate financial models |

## User-friendliness comparison

| Dimension | Math Universe | GeoGebra pattern | Recommendation |
|---|---|---|---|
| Page focus | Excellent: one concept and little text | Focused Activity tasks | Keep current compact shell |
| Learning sequence | Strong built-in four-stage flow | Activity/Book tasks vary by author | Keep, but make each stage use the current model state |
| Direct manipulation | Mostly sliders and exact-value fields | Drag mathematical objects directly | Add draggable points, handles, faces, vectors, and regions |
| Tool choice | Fixed per adapter | View-specific toolbars and custom tools | Expose a tiny concept-specific toolbar, not a full workspace toolbar |
| Mathematical feedback | Generic correct/not-yet message | Applet state plus question feedback | Add misconception-specific feedback and a short worked reveal |
| Discovery | Search and 14 categories | Topic/grade/resource filters, metadata, prerequisites | Add phase, grade, level, mode, and completion filters |
| Continuity | Previous/next links and local progress | Books, prerequisites, next resources | Show progress and prerequisite/next-concept relationships on cards |
| Teacher workflow | Workspace handoff | Copy/edit, assign, Classroom monitoring | Add assign/copy and live class progress through existing authoring/assessment engines |
| Mobile | Strong in representative audit | Touch-enabled applets | Preserve layout; add touch-sized direct handles |
| Accessibility | Generally labeled controls and exact inputs | Detailed keyboard/touch/screen-reader guidance | Close labeling gap and add keyboard manipulation/graphic summaries |

## Accessibility and interaction details

### Confirmed strengths

- Shared slider controls provide exact numeric entry, which is valuable for keyboard and motor accessibility.
- Stage buttons, reset, share, workspace, and adjacent lesson links are native interactive elements.
- Tables use semantic table structure.
- Several graphics provide `role="img"` with an accessible name.
- The platform adapter supports arrow-key movement of its draggable point.
- Desktop and mobile layouts preserve the live surface without page-level horizontal overflow.

### Required improvements

1. The calculator expression textarea relies on the placeholder “Enter an expression” and has no `label`, `aria-label`, or `aria-labelledby`. Add a persistent programmatic label.
2. SVG labels are often generic. Provide a concise dynamic summary of the current mathematical state, not only “interactive plot” or “linked diagram.”
3. Most visual objects cannot be selected or manipulated with the keyboard. Pair every draggable object with arrow-key behavior and an exact-value input.
4. Do not rely only on cyan/amber/grey color distinctions. Preserve dashed lines, shapes, labels, and patterns in every comparison state.
5. Add decrement and increment buttons to important sliders, following GeoGebra's own accessibility guidance.
6. Long lesson titles use a truncating heading style. On small screens, allow wrapping so the concept name is never hidden.
7. Locked stages are visually disabled but do not expose a reason in the button's accessible description. Announce the prerequisite: record a prediction or use the model.
8. Share sets an internal feedback message, but during Discover/Explore that message is not rendered by the active panel. Show a toast or persistent live status after copying.

## Recommended remediation plan

### Phase A — correctness and minimum interactivity

1. Replace the five static discrete pages with concept-specific controls.
2. Correct the discrete adapter dispatch so set concepts never receive a graph algorithm and graph-coloring/network-flow concepts never receive Dijkstra by default.
3. Split finance into simple interest, compound growth, annuity, loan/amortization, depreciation, investment comparison, optimisation, and modelling variants.
4. Correct the confirmed mismatches in Differential Equations, Nets of Solids, Eigenvalues, and Box Plot.
5. Add a catalog test asserting at least one certified control for every lesson.

Exit gate: 674/674 pages have a meaningful control and the control changes a value or representation relevant to the title.

### Phase B — lesson-specific assessment

1. Replace adapter-wide challenges with lesson challenge factories.
2. Generate the prompt and expected answer from current adapter state.
3. Require the relevant interaction, not any interaction, before Check.
4. Add misconception-specific feedback and an optional short worked explanation.
5. Persist the adapter state needed to resume a lesson accurately.

Exit gate: every lesson title, model, challenge, expected answer, and feedback target the same concept.

### Phase C — GeoGebra-level interaction depth

1. Add direct dragging to points, vectors, graph parameters, 3D handles, and set regions.
2. Add compact concept toolbars using whitelisted existing geometry/3D/CAS tools.
3. Implement animation/replay only where the catalog promises it.
4. Implement real slicing/unfolding for 3D cross-section and net lessons.
5. Provide simultaneous linked representations where they explain the concept: graph + table + equation, solid + net, matrix + transformation, data + plot.

Exit gate: promised drag, construct, animate, replay, slice, unfold, shade, sort, filter, or optimise operations are visibly available and automated.

### Phase D — user-friendly discovery, accessibility, and classroom workflow

1. Add phase, level/grade, activity type, completion, and priority filters.
2. Show resume/completion status on category cards.
3. Add prerequisites and related/next concepts.
4. Close keyboard, focus, labeling, non-color, and screen-reader gaps.
5. Connect assignment, teacher copy/edit, and live progress to the existing authoring and assessment engines.

Exit gate: keyboard-only, touch, mobile, screen-reader, student, and teacher workflows pass dedicated acceptance tests.

## Required lesson certification contract

Add a machine-readable contract to each lesson definition:

```ts
type LessonInteractionContract = {
  concept: string;
  requiredControls: Array<"drag" | "slider" | "input" | "toggle" | "tool" | "playback">;
  observableOutputs: string[];
  requiredRepresentations: string[];
  challengeFactory: string;
  workspaceObjects: string[];
  keyboardAlternative: string;
  screenReaderSummary: string;
};
```

Automated certification should verify:

- the route and title load;
- the live surface has the required control;
- every required control changes a declared observable output;
- reset restores the seed state;
- the challenge changes with the lesson/model state and can be completed;
- keyboard and exact-value alternatives work;
- no desktop or mobile page overflow occurs;
- the workspace handoff opens the correct engine;
- the promised interaction verbs are present;
- no lesson falls through to an unrelated default activity.

## Final release recommendation

Keep the shared shell, lazy adapter architecture, existing engine reuse, exact-value controls, mobile layout, and four-stage learning flow. These are strong foundations.

Do **not** market the current catalog as “all pages fully interactive and better than GeoGebra” yet. The defensible current statement is:

> 674 focused lesson routes are available; 669 currently expose live controls through 23 reusable mathematics engines. Concept-specific certification and five missing discrete interactions remain in progress.

After Phases A and B, the module can credibly claim complete interactive concept coverage. After Phases C and D, it can be compared with GeoGebra on direct manipulation, accessibility, authoring, and classroom usability.

## Official GeoGebra references

- [Get started with GeoGebra Resources](https://help.geogebra.org/hc/en-us/articles/10449584308125-Get-started-with-GeoGebra-Resources)
- [Create GeoGebra Resources](https://help.geogebra.org/hc/en-us/articles/10828122740765-Create-GeoGebra-Resources)
- [Find GeoGebra Resources](https://help.geogebra.org/hc/en-us/articles/8823429816221-Find-GeoGebra-Resources)
- [Learn GeoGebra Classroom](https://www.geogebra.org/m/hncrgruu)
- [GeoGebra Manual: Tools](https://geogebra.github.io/docs/manual/en/Tools/)
- [GeoGebra Manual: Accessibility](https://geogebra.github.io/docs/manual/en/Accessibility/)
- [GeoGebra example activity: Identifying Angles Around Us](https://www.geogebra.org/m/fqqbfvc9)
- [GeoGebra student preview for the example activity](https://www.geogebra.org/m/fqqbfvc9/preview)
- [GeoGebra example book: 3D Geometry & Cross Sections](https://www.geogebra.org/m/M5dZnUeH)

