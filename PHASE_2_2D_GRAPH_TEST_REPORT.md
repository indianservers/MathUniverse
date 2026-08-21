# Phase 2 — 2D Graph Test Report

Tested 2026-08-20 through the actual browser UI after the required clean restart and completed 3D checkpoint. Build 1.0.1, commit `2662c27`. All 65 mandatory operations were attempted. Status totals: **Pass 7, Fail 7, Partial 41, Blocked 0, Not Implemented 10**.

| ID | Operation | Variations Tested | Expected Result | Actual Result | Status | Defect ID | Evidence |
| -- | --------- | ----------------- | --------------- | ------------- | ------ | --------- | -------- |
| 2DG-001 | Open module | Clean restart, desktop launch | Complete comprehensible canvas | Opened without crash with SVG axes/grid, editor, list, viewport, sliders and table | Pass | — | `test-evidence/phase-2/2d-graph/EVIDENCE_LOG.md` |
| 2DG-002 | Pan/zoom graph | Extreme/unequal numeric bounds; looked for mouse/touch/keyboard controls | Accurate multi-input pan/zoom with limits | Bounds can be typed, but no pan/zoom gestures/buttons, reset, or published limits | Partial | BUG-P2-021 | Evidence log |
| 2DG-003 | Configure axes/grid | Bounds; searched axes/grid/ticks/equal scale/reset | Toggle/configure accurately | Only bounds exist; no toggles/ticks/reset/equal-scale control | Partial | BUG-P2-021, BUG-P2-013 | Evidence log |
| 2DG-004 | Individual points | Point notation/quadrant/on-axis intent; style/drag search | Plot, label, style, drag points | No direct point-object input/drag/coordinate update workflow in Graph panel | Partial | BUG-P2-018 | Evidence log |
| 2DG-005 | Table of points | Table tab, -10..10 samples, blanks/text/edit/delete intent | Editable 20-pair table | Read-only generated function table; only first 3 visible plots; no coordinate-pair editing | Partial | BUG-P2-018 | Evidence log |
| 2DG-006 | Expression entry | Powers, roots, pi, e, abs, malformed, NaN/infinity | Rich entry with clear validation | Broad syntax works and malformed parentheses are explained; absolute-bar notation, `exp`, and some valid names are inconsistently rejected | Partial | BUG-P2-024 | Evidence log |
| 2DG-007 | Implicit multiplication | `2x`, `2*x`, `xy`, `3(x+1)`, adjacent parentheses, `X^2` | Consistent unambiguous parsing | Most variants work; `xy` rejected as unsupported y and notation meaning is not explained | Partial | BUG-P2-024 | Evidence log |
| 2DG-008 | Rename/style graph | Name, colour, hide/show, lock, duplicate; refresh | Full styling and persistence | Name/colour/visibility/lock work; no thickness/opacity/line style/labels; refresh loses graph | Partial | BUG-P2-022, BUG-P2-012 | Evidence log |
| 2DG-009 | Horizontal line | `y=3`; related constant plots | Correct zero-slope horizontal line | Rendered correctly as implicit contour; table consistent; no slope/intercept readout | Pass | — | Evidence log |
| 2DG-010 | Vertical line | `x=4`, axis-line intent | Correct vertical lines/undefined slope | `x=4` blocked as `Unsupported expression` | Fail | BUG-P2-014 | Evidence log |
| 2DG-011 | Slope-intercept | `y=2*x+3`, fractional/negative intent | Correct slope/intercept and dynamic parameters | Curve/table consistent, but classified implicit and no slope/intercept analysis; slider creation path broken | Partial | BUG-P2-015, BUG-P2-017 | Evidence log |
| 2DG-012 | Standard/point-slope | `2x+3y=6`, equivalent-form attempts | Equivalent overlap and clear parsing | General implicit equalities render, but no equivalence check, form interpretation, or point-slope assistance | Partial | BUG-P2-017 | Evidence log |
| 2DG-013 | Parallel/perpendicular lines | Multiple line expressions; parameter editing | Relationship/angle and dependencies | Curves coexist, but no relationship, angle, or parent dependency tool | Partial | BUG-P2-017 | Evidence log |
| 2DG-014 | Intersect two lines | one/parallel/coincident intent; searched controls | Dynamic classified intersection coordinates | No intersection tool/readout | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-015 | School word problem | Linear cost/distance expression; labels/units search | Labelled axes/units and interpretation | Model expression can plot/name, but axes cannot be labelled with units and slope meaning is absent | Partial | BUG-P2-021 | Evidence log |
| 2DG-016 | Quadratic | `x^2`, viewport near vertex, table | Vertex, symmetry, roots/domain/range/trace | Correct curve/table, but no analysis, trace, or domain/range output | Partial | BUG-P2-017 | Evidence log |
| 2DG-017 | Transform quadratic | `(x-2)^2+1`; coefficient variants/sliders | Dynamic a,h,k and verified vertex | Explicit forms plot; fixed sliders are only a/b and advertised parameter creation is blocked | Partial | BUG-P2-015 | Evidence log |
| 2DG-018 | Two-root quadratic | `x^2-5*x+6` | Roots 2,3 plus vertex/intercept | Curve plots; no root/vertex/intercept markers or values | Partial | BUG-P2-017 | Evidence log |
| 2DG-019 | One/no-real-root quadratics | `x^2+1`, repeated-root examples | Correct crossing/touching and root report | Visual curves plot; no root report or complex/non-real classification | Partial | BUG-P2-017 | Evidence log |
| 2DG-020 | Cubic | `x^3`, shifted intent, wide viewport | Correct symmetry/inflection/trace | Curve plots; no inflection or trace tools | Partial | BUG-P2-017 | Evidence log |
| 2DG-021 | Higher polynomials | degree 10 and repeated products | Correct roots/end behavior and performance | Curves render responsively; no high-degree analysis, degree limit, or root list | Partial | BUG-P2-017 | Evidence log |
| 2DG-022 | Factored/expanded equivalents | `(x+1)(x-1)` and equivalent expanded form | Exact overlap | Both accepted and render consistently; editing separates them | Pass | — | Evidence log |
| 2DG-023 | Repeated roots | `(x-2)^2*(x+1)` | Touch/cross semantics and precision | Curve plots, but no root markers/multiplicity/precision or trace | Partial | BUG-P2-017 | Evidence log |
| 2DG-024 | Reciprocal | `1/x`, zoom bounds | Separate branches/asymptotes | Multiple path segments avoid a single join; no excluded-value/asymptote display | Partial | BUG-P2-023 | Evidence log |
| 2DG-025 | Transformed rational | `2/(x-3)+1` | Correct branch/asymptote transforms | Curve plots in separate segments; asymptotes and h/k values are not displayed | Partial | BUG-P2-023 | Evidence log |
| 2DG-026 | Rational holes | `(x^2-1)/(x-1)` | Visible open hole at x=1 | Curve has no open-circle hole marker | Fail | BUG-P2-020 | Evidence log |
| 2DG-027 | Square root | `sqrt(x)`, table across negative/positive x | Domain x≥0 and correct endpoint | Negative samples omitted and table starts at 0; curve/endpoint correct | Pass | — | Evidence log |
| 2DG-028 | Cube/nth roots | `x^(1/3)`, fractional/even-root intent | Correct signed-domain behavior | Expressions plot, but notation/domain feedback and root-family controls are absent | Partial | BUG-P2-024 | Evidence log |
| 2DG-029 | Absolute value | `abs(x)`, absolute bars, transformations | Consistent absolute notation and correct V | `abs(x)` works; standard absolute-bar notation is rejected; no vertex/slope analysis | Partial | BUG-P2-024 | Evidence log |
| 2DG-030 | Piecewise | `if(x<0,-x,x)`, gap/jump/boundary intent | 3+ branches and open/closed endpoints | Piecewise samples render, but endpoints are not semantically marked and interval editing is text-only | Partial | BUG-P2-020 | Evidence log |
| 2DG-031 | Floor/ceiling/sign | `floor`, `ceil`, `sign`; negative inputs | Steps with correct endpoint inclusion and no joins | Floor/ceil paths connect sampled jumps and lack endpoint markers; `sign(x)` rejected | Fail | BUG-P2-019 | Evidence log |
| 2DG-032 | Domain restrictions | Piecewise/brace intent for line/parabola/trig | Inclusive/exclusive restricted curves | Text restrictions are partially parsed via piecewise syntax, but no endpoint semantics or dedicated domain UI | Partial | BUG-P2-020 | Evidence log |
| 2DG-033 | Exponential | `2^x`, `e^x`, `exp(x)` | Bases, intercept 1, asymptote, invalid-base validation | Power forms render; `exp(x)` incorrectly rejected; no base/asymptote output | Partial | BUG-P2-024 | Evidence log |
| 2DG-034 | Transform exponential | translated/reflected expressions; extreme bounds | Correct transforms/asymptote and stability | Expressions render without freeze; no asymptote analysis and dynamic add-with-slider path fails | Partial | BUG-P2-015, BUG-P2-023 | Evidence log |
| 2DG-035 | Logarithmic | `ln(x)`, log variants intent | Correct domain/intercept/asymptote for bases | `ln` renders real-domain branch; no base selector or domain/asymptote output | Partial | BUG-P2-023 | Evidence log |
| 2DG-036 | Exp/log inverses | `e^x`, `ln(x)`, `y=x` intent | Reflection and inverse-point verification | Curves can coexist, but no inverse/reflection analysis and vertical `x=y` notation is inconsistent | Partial | BUG-P2-014, BUG-P2-017 | Evidence log |
| 2DG-037 | Sine | `sin(x)`, table standard values | Amplitude/period/zeros; degree/radian; pi ticks | Radian sine renders correctly; no degree mode, pi ticks, or analysis | Partial | BUG-P2-023 | Evidence log |
| 2DG-038 | Cosine | `cos(x)`, phase comparison | Correct key points/phase/trace | Curve/table correct including cos(0)=1; no trace or extrema labels | Partial | BUG-P2-017 | Evidence log |
| 2DG-039 | Tangent | `tan(x)`, near-asymptote viewport intent | Separate branches, asymptotes, degree/radian | Segmented rendering observed; no asymptote markers or degree mode | Partial | BUG-P2-023 | Evidence log |
| 2DG-040 | Sec/csc/cot | reciprocal cosine/sine/tangent | Correct disconnected branches/domains/ranges | Reciprocal curves render in segments; no named functions, domain/range/asymptote output | Partial | BUG-P2-023 | Evidence log |
| 2DG-041 | Transform trig | `a*sin(x)+b`, negative a/b | Dynamic A/B/C/D with verified parameters | Fixed a/b sliders work only by editing an existing plot; Add rejects advertised expression; no B/C sliders | Partial | BUG-P2-015 | Evidence log |
| 2DG-042 | Combined trig | `sin+cos`, `sin(2x)`, `sin(x)^2`, identities | Equivalent accurate curves | Expressions accepted and sampled without visible failure | Pass | — | Evidence log |
| 2DG-043 | Inverse trig | `asin`, `acos`, `atan`; endpoint intent | Correct real domains/ranges/asymptotes | Curves render, but no domain/range/degree convention or endpoint analysis | Partial | BUG-P2-023 | Evidence log |
| 2DG-044 | Trig investigation | sine/cosine, phase slider, marks, save/reopen | Complete persistent investigation | Curves coexist; no marks/analysis, slider creation is broken, and refresh loses work | Partial | BUG-P2-012, BUG-P2-015, BUG-P2-017 | Evidence log |
| 2DG-045 | Circle | `x^2+y^2=25` | True radius-5 circle at equal scale | Parsed implicit contour is horizontally stretched because x/y pixel scales differ; no center/radius analysis | Fail | BUG-P2-013 | Evidence log |
| 2DG-046 | Ellipse | `x^2/25+y^2/9=1` | Correct semi-axes/foci/eccentricity | Parsed but further distorted by unequal scale; no conic analysis | Fail | BUG-P2-013 | Evidence log |
| 2DG-047 | Parabola orientations | `x^2`, `y^2=x` | Vertical/horizontal conics plus focus/directrix | Both orientations parse, but unequal scale distorts geometry and no focus/directrix analysis | Partial | BUG-P2-013, BUG-P2-017 | Evidence log |
| 2DG-048 | Hyperbola | `x^2/9-y^2/4=1` | Correct branches, foci/asymptotes | Implicit branches render, but scale is unequal and conic features are absent | Partial | BUG-P2-013, BUG-P2-023 | Evidence log |
| 2DG-049 | Implicit relation | circle, ellipse, lemniscate, inequality | Accurate branches/equality/inequality | All parse; equality contours include shaded contour cells and geometry is scale-distorted; no high-zoom accuracy control | Partial | BUG-P2-013 | Evidence log |
| 2DG-050 | Parametric curve | circle with `t=0..2*pi`; ranges | Correct direction/endpoints and range handling | Parametric syntax/range works, but circle is visually distorted and direction/endpoints are not shown | Partial | BUG-P2-013 | Evidence log |
| 2DG-051 | Lissajous | `sin(3t),sin(2t)` and preset | Correct symmetry/closure/performance | Parametric Lissajous accepted and rendered responsively | Pass | — | Evidence log |
| 2DG-052 | Polar circle/spiral | `r=2`, `r=theta`; ranges | Correct polar curves/range/origin | Polar syntax and ranges work; output remains affected by unequal axis scale | Pass | BUG-P2-013 | Evidence log |
| 2DG-053 | Roses/cardioids | `sin(3theta)`, `1+cos(theta)` | Correct petals/symmetry/negative r | Both accepted and rendered; no petal count/symmetry analysis and visual scale is unequal | Partial | BUG-P2-013 | Evidence log |
| 2DG-054 | Find roots | exact/repeated/irrational/no-real intent | Markers and verified values | No root-finding UI | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-055 | Find intersections | line/curve/conic/trig intent | Complete coordinate results | No graph-intersection UI | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-056 | Trace curve | continuous/discontinuous intent | Movable trace with values | No trace UI | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-057 | Tangent/normal | regular/extrema/inflection/vertical intent | Dynamic lines and slopes | No tangent/normal UI | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-058 | Maxima/minima | polynomial/trig/constant intent | Local/global extrema results | No extrema UI | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-059 | Inflection points | cubic/higher-degree/false-positive intent | Concavity-change classification | No inflection UI | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-060 | Derivative | polynomial/trig/exp/abs/discontinuous intent | Function/derivative with nondifferentiable handling | No derivative UI in Graph module | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-061 | Definite integral/area | under/between, signed/reversed intent | Shading and numerical area | No integral/area UI in Graph module | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-062 | Sliders | a,b exact/range; `a*x+b`; rapid values | Creatable configurable linked sliders | Two fixed sliders exist and update edited plots; Add rejects `a`; no slider creation/range configuration | Partial | BUG-P2-015 | Evidence log |
| 2DG-063 | Animate parameter | play/pause/speed/loop/reset search | Smooth persistent animation | No graph animation controls | Not Implemented | BUG-P2-017 | Evidence log |
| 2DG-064 | 50 expressions | Added >50 mixed attempts; hide/edit/delete/duplicate | 50 simultaneous manageable plots | Hard cap 10; each additional accepted graph silently evicts an older plot, making test impossible and losing work | Fail | BUG-P2-016 | Evidence log |
| 2DG-065 | Save/reopen/export complex graph | 10 mixed plots, style, viewport, sliders, refresh; control inventory | Complete persistence and every export format | No Save/Export; refresh reduced 10 plots to default 1 and reset viewport; only slider query values survived | Fail | BUG-P2-012 | Evidence log |

## Exploratory, accessibility, and usability notes

- Repeated Add, malformed/very large input, duplicate plots/names, hide selected, lock/edit, delete, unusual viewport bounds, step 0, tool switching, refresh, crowded list, and rapid parameter changes were attempted.
- Most controls have accessible names and validation uses a live status. The SVG itself has no accessible graph description or keyboard trace; the graph is largely visual, and no non-colour curve-style differentiation exists.
- Tablet/mobile viewport emulation retained the editor and surface without document-level horizontal overflow. Physical touch and screen-reader speech were unavailable.
- No theme switch was exposed in the module, although dark-theme CSS exists. No Undo/Redo makes accidental changes or silent eviction unrecoverable.

## Module verdict

**NOT READY FOR RELEASE.** The sampler covers many expression families, but graph data is lost on refresh, the 10-plot cap silently evicts work, circles/conics are geometrically distorted by unequal axis scaling, vertical lines fail, and school analysis/persistence/export workflows are missing.
