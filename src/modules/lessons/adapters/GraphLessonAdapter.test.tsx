import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import GraphLessonAdapter from "./GraphLessonAdapter";

describe("GraphLessonAdapter", () => {
  it("routes lesson 158 to its dedicated vertical-scale engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 158)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0215"');
    expect(html).toContain('data-dedicated-lesson="158"');
    expect(html).toContain("editable-vertical-scale-stretch-compression-mode-sample-visibility-pointer-keyboard-draggable-scaled-point-generated-parent-and-transformed-parabolas-fixed-x-arrows-value-table-compression-reference-tabs-language-share-and-workspace");
    expect(html).toContain('aria-label="Drag vertical scale point"');
    expect(html).toContain("Value comparison table");
  });

  it("routes lesson 157 to its dedicated horizontal-translation engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 157)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0214"');
    expect(html).toContain('data-dedicated-lesson="157"');
    expect(html).toContain("editable-horizontal-shift-parent-visibility-and-comparison-level-pointer-keyboard-draggable-vertex-and-level-probe-generated-parabolas-same-height-arrows-input-remapping-table-and-vertex-proof");
    expect(html).toContain('aria-label="Drag horizontal translation vertex"');
    expect(html).toContain("Input changes first");
  });

  it("routes lesson 156 to its dedicated vertical-translation engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 156)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0213"');
    expect(html).toContain('data-dedicated-lesson="156"');
    expect(html).toContain("editable-vertical-shift-parent-and-transformed-visibility-pointer-keyboard-draggable-parabola-and-sample-probe-generated-curves-arrows-vertex-table-and-output-invariance");
    expect(html).toContain('aria-label="Drag translated parabola vertically"');
    expect(html).toContain("Every output");
  });

  it("routes lesson 155 to its dedicated recurrence engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 155)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0212"');
    expect(html).toContain('data-dedicated-lesson="155"');
    expect(html).toContain("editable-affine-recurrence-growth-seed-add-on-steps-pointer-keyboard-draggable-term-probe-generated-sequence-table-graph-next-preview-cobweb-and-exact-fixed-point");
    expect(html).toContain('aria-label="Drag recursive term probe"');
    expect(html).toContain("Next term preview");
  });

  it("routes lesson 154 to its dedicated periodic-wave engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 154)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0211"');
    expect(html).toContain('data-dedicated-lesson="154"');
    expect(html).toContain("editable-sine-amplitude-frequency-midline-pointer-keyboard-draggable-phase-probe-generated-period-ruler-cycle-shading-matching-points-live-periodic-identity-real-tabs-language-bookmark-share-save");
    expect(html).toContain('aria-label="Drag periodic matching point"');
    expect(html).toContain("Match confirmed");
  });

  it("routes lesson 153 to its dedicated monotonicity engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 153)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0210"');
    expect(html).toContain('data-dedicated-lesson="153"');
    expect(html).toContain("editable-cubic-turning-strength-vertical-shift-pointer-keyboard-draggable-x-cursor-generated-extrema-monotonic-regions-derivative-sign-strip-interval-summary-live-slope-classification");
    expect(html).toContain('aria-label="Drag monotonicity x cursor"');
    expect(html).toContain("Derivative sign summary");
  });

  it("routes lesson 152 to its dedicated symmetry-test engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 152)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0209"');
    expect(html).toContain('data-dedicated-lesson="152"');
    expect(html).toContain("selectable-even-odd-neither-polynomial-family-pointer-keyboard-draggable-x-probe-generated-x-negative-x-points-mirror-and-rotation-overlays-live-algebraic-symmetry-verdict");
    expect(html).toContain('aria-label="Drag symmetry test point"');
    expect(html).toContain("Verdict: even");
  });

  it("routes lesson 151 to its dedicated inverse reflection engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 151)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0208"');
    expect(html).toContain('data-dedicated-lesson="151"');
    expect(html).toContain("editable-linear-function-slope-intercept-domain-restriction-pointer-keyboard-draggable-source-point-generated-reflected-inverse-swapped-coordinate-mapping-table-live-composition-horizontal-line-test");
    expect(html).toContain('aria-label="Drag original function point"');
    expect(html).toContain("Composition returns the start");
  });

  it("routes lesson 150 to its dedicated composition-order engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 150)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0207"');
    expect(html).toContain('data-dedicated-lesson="150"');
    expect(html).toContain("editable-composite-input-inner-shift-outer-scale-and-order-pointer-keyboard-draggable-graph-probe-generated-function-machine-three-curves-live-inside-first-evaluation-and-order-comparison");
    expect(html).toContain('aria-label="Drag composite input probe"');
    expect(html).toContain("Evaluate inside first");
  });

  it("routes lesson 149 to its dedicated piecewise rule engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 149)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0206"');
    expect(html).toContain('data-dedicated-lesson="149"');
    expect(html).toContain("editable-piecewise-probe-switch-points-vertical-shift-and-branch-visibility-pointer-keyboard-draggable-probe-and-boundaries-generated-three-rule-graph-open-closed-endpoint-ownership-condition-first-evaluation-and-boundary-trace");
    expect(html).toContain('aria-label="Drag piecewise x probe"');
    expect(html).toContain("Boundary decides");
  });

  it("routes lesson 148 to its dedicated three-region sign classifier", () => {
    const lesson = lessonCatalog.find((item) => item.id === 148)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0205"');
    expect(html).toContain('data-dedicated-lesson="148"');
    expect(html).toContain("editable-sign-input-threshold-and-domain-scale-pointer-keyboard-draggable-input-and-threshold-generated-negative-zero-positive-rays-live-classifier-selectable-cases-piecewise-definition-magnitude-ignored-direction-model");
    expect(html).toContain('aria-label="Drag sign input cursor"');
    expect(html).toContain("Magnitude ignored");
  });

  it("routes lesson 147 to its dedicated ceiling staircase model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 147)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0204"');
    expect(html).toContain('data-dedicated-lesson="147"');
    expect(html).toContain("editable-ceiling-input-horizontal-and-vertical-shifts-snap-mode-pointer-keyboard-draggable-probe-clickable-generated-evaluation-table-upward-staircase-open-left-closed-right-endpoints-negative-input-correctness-floor-comparison-jump-model");
    expect(html).toContain('aria-label="Drag ceiling input probe"');
    expect(html).toContain("Open left, closed right");
  });

  it("routes lesson 146 to its dedicated floor staircase model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 146)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0203"');
    expect(html).toContain('data-dedicated-lesson="146"');
    expect(html).toContain("editable-floor-input-horizontal-and-vertical-shifts-pointer-keyboard-draggable-probe-generated-staircase-number-line-interval-table-closed-left-open-right-endpoints-negative-input-correctness-real-challenge-discontinuity-diagnostics");
    expect(html).toContain('aria-label="Drag floor input probe"');
    expect(html).toContain("STEP_ENDPOINTS_REQUIRED");
  });

  it("routes lesson 145 to its dedicated unit-hyperbola decomposition model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 145)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0202"');
    expect(html).toContain('data-dedicated-lesson="145"');
    expect(html).toContain("linked-unit-hyperbola-exponential-decomposition-sinh-cosh-tanh-pointer-keyboard-draggable-hyperbola-point-and-graph-probe-generated-five-curves-table-identity-residual-real-challenge-curve-toggles-zoom-fullscreen");
    expect(html).toContain('aria-label="Drag point on unit hyperbola"');
    expect(html).toContain("HYPERBOLA_IDENTITY_REQUIRED");
  });

  it("routes lesson 144 to its dedicated linked unit-circle model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 144)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0201"');
    expect(html).toContain('data-dedicated-lesson="144"');
    expect(html).toContain("linked-unit-circle-sine-cosine-amplitude-period-phase-midline-pointer-keyboard-draggable-circle-angle-graph-trace-amplitude-and-period-generated-curves-live-values-period-detection-identities-real-challenge-animation-export");
    expect(html).toContain('aria-label="Drag unit-circle angle"');
    expect(html).toContain("PERIODICITY_VISIBLE_REQUIRED");
  });

  it("routes lesson 143 to its dedicated logarithmic inverse model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 143)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0200"');
    expect(html).toContain('data-dedicated-lesson="143"');
    expect(html).toContain("editable-logarithmic-scale-base-horizontal-shift-vertical-shift-pointer-keyboard-draggable-asymptote-anchor-and-scale-point-generated-domain-curve-inverse-exponential-reflection-value-table-diagnostics-real-parameter-challenge");
    expect(html).toContain('aria-label="Drag logarithmic vertical asymptote"');
    expect(html).toContain("CONCEPTUAL DIAGNOSTICS");
  });

  it("routes lesson 142 to its dedicated exponential ratio model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 142)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0199"');
    expect(html).toContain('data-dedicated-lesson="142"');
    expect(html).toContain("editable-exponential-initial-base-asymptote-growth-decay-mode-pointer-keyboard-draggable-initial-base-point-and-horizontal-asymptote-generated-dual-curves-samples-ratio-table-repeated-multiplication-concepts-example-model");
    expect(html).toContain('aria-label="Drag exponential base point"');
    expect(html).toContain("Equal x-steps multiply outputs");
  });

  it("routes lesson 141 to its dedicated absolute-value distance model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 141)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0198"');
    expect(html).toContain('data-dedicated-lesson="141"');
    expect(html).toContain("editable-absolute-value-scale-vertex-shift-reflection-pointer-keyboard-draggable-vertex-opening-and-distance-probe-generated-v-graph-parent-axis-piecewise-branches-distance-model-range-model");
    expect(html).toContain('aria-label="Drag absolute-value vertex"');
    expect(html).toContain("Distance model on the number line");
  });

  it("routes lesson 140 to its dedicated cube-root center model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 140)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0197"');
    expect(html).toContain('data-dedicated-lesson="140"');
    expect(html).toContain("editable-shifted-cube-root-scale-center-and-vertical-shift-pointer-keyboard-draggable-center-and-scale-point-generated-all-real-s-curve-symmetric-samples-table-inverse-reasoning-warning-practice-model");
    expect(html).toContain('aria-label="Drag cube-root center"');
    expect(html).toContain("Explore the cube-root center");
  });

  it("routes lesson 139 to its dedicated square-root endpoint model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 139)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0196"');
    expect(html).toContain('data-dedicated-lesson="139"');
    expect(html).toContain("editable-square-root-vertical-scale-and-domain-start-pointer-keyboard-draggable-endpoint-and-scale-point-generated-restricted-domain-curve-samples-table-range-reasoning-warning-practice-model");
    expect(html).toContain('aria-label="Drag square-root endpoint"');
    expect(html).toContain("Square-Root Endpoint Explorer");
  });

  it("routes lesson 138 to its dedicated rational analyzer model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 138)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0195"');
    expect(html).toContain('data-dedicated-lesson="138"');
    expect(html).toContain("editable-equal-degree-rational-numerator-scale-and-restricted-input-pointer-keyboard-draggable-restriction-and-scale-point-generated-branches-vertical-or-removable-hole-long-run-value-samples-reasoning-warning-practice-model");
    expect(html).toContain('aria-label="Drag rational restricted input"');
    expect(html).toContain("Rational function analyzer");
  });

  it("routes lesson 137 to its dedicated reciprocal asymptote model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 137)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0194"');
    expect(html).toContain('data-dedicated-lesson="137"');
    expect(html).toContain("editable-reciprocal-scale-and-excluded-input-pointer-keyboard-draggable-asymptote-and-scale-point-generated-two-branch-graph-working-pan-zoom-linked-samples-domain-range-reasoning-warning-practice-model");
    expect(html).toContain('aria-label="Drag excluded reciprocal input"');
    expect(html).toContain("Asymptote explorer");
  });

  it("routes lesson 136 to its dedicated higher-degree polynomial model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 136)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0193"');
    expect(html).toContain('data-dedicated-lesson="136"');
    expect(html).toContain("editable-factored-higher-degree-polynomial-moving-root-and-vertical-shift-pointer-keyboard-draggable-root-generated-curve-numerical-intercepts-turning-points-multiplicity-sign-intervals-samples-end-behavior-practice-model");
    expect(html).toContain('aria-label="Drag moving polynomial root"');
    expect(html).toContain("ROOT AND TURNING POINT EXPLORER");
  });

  it("routes lesson 135 to its dedicated cubic inflection model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 135)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0192"');
    expect(html).toContain('data-dedicated-lesson="135"');
    expect(html).toContain("editable-cubic-inflection-form-signed-bend-pointer-keyboard-draggable-inflection-and-shape-points-generated-s-curve-opposite-end-behavior-point-symmetry-linked-value-table-reasoning-practice-model");
    expect(html).toContain('aria-label="Drag cubic inflection point"');
    expect(html).toContain("Cubic Shape Explorer");
  });

  it("routes lesson 134 to its dedicated quadratic vertex model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 134)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0191"');
    expect(html).toContain('data-dedicated-lesson="134"');
    expect(html).toContain("editable-quadratic-vertex-form-linked-parameters-pointer-keyboard-draggable-vertex-and-opening-point-generated-parabola-symmetry-axis-mirror-points-value-table-reasoning-practice-model");
    expect(html).toContain('aria-label="Drag quadratic vertex"');
    expect(html).toContain("Vertex and Symmetry Explorer");
  });

  it("routes lesson 133 to its dedicated linked linear-function model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 133)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0190"');
    expect(html).toContain('data-dedicated-lesson="133"');
    expect(html).toContain("editable-linear-slope-intercept-linked-hero-and-cartesian-graphs-pointer-keyboard-draggable-intercept-and-slope-point-generated-rise-run-triangle-equal-step-table-rate-proof-practice-model");
    expect(html).toContain('aria-label="Drag linear intercept"');
    expect(html).toContain("Slope–Intercept Explorer");
  });

  it("routes lesson 132 to its dedicated vertical-line scanner model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 132)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0189"');
    expect(html).toContain('data-dedicated-lesson="132"');
    expect(html).toContain("editable-vertical-line-scanner-circle-parabola-sideways-relation-pointer-keyboard-draggable-test-line-generated-intersections-hit-count-global-function-classification-linked-reasoning-comparison-model");
    expect(html).toContain('aria-label="Drag vertical test line"');
    expect(html).toContain("Vertical-Line Scanner");
  });

  it("routes lesson 131 to its dedicated function-notation decoder model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 131)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0188"');
    expect(html).toContain('data-dedicated-lesson="131"');
    expect(html).toContain("editable-quadratic-function-notation-decoder-coefficient-shift-pointer-keyboard-draggable-chosen-input-linked-substitution-output-parabola-sample-table-ordered-pair-not-multiplication-practice-model");
    expect(html).toContain('aria-label="Drag chosen function input"');
    expect(html).toContain("Notation decoder for");
  });

  it("routes lesson 130 to its dedicated domain-range projector model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 130)!;
    const html = renderToStaticMarkup(<GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="graph-mockup-0187"');
    expect(html).toContain('data-dedicated-lesson="130"');
    expect(html).toContain("editable-shifted-square-root-domain-range-projector-pointer-keyboard-draggable-closed-start-point-linked-axis-projections-generated-interval-notation-sample-evaluations-grid-practice-model");
    expect(html).toContain('aria-label="Drag square root start point"');
    expect(html).toContain("Domain–Range Projector");
  });

  it("routes lesson 129 to its dedicated linked function-machine model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 129)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain('data-testid="graph-mockup-0186"');
    expect(html).toContain('data-dedicated-lesson="129"');
    expect(html).toContain("editable-linear-function-machine-linked-input-output-mappings-parameter-sliders-pointer-keyboard-draggable-sample-inputs-generated-value-table-synchronized-cartesian-graph-vertical-slice-function-test-multiple-output-counterexample-live-practice-model");
    expect(html).toContain('aria-label="Drag function input 1"');
    expect(html).toContain("Function machine + graph cross-check");
  });

  it("renders graphing calculator lessons 39 through 56 with tool-specific graph guidance", () => {
    const expectedSnippets: Record<number, string> = {
      39: "x first and y second",
      40: "each x input makes one y output",
      41: "all solution points",
      42: "shades all points",
      43: "use a third variable",
      44: "angle and radius",
      45: "exact ordered pairs",
      46: "trend, spread, and outliers",
      47: "pairs each input with its output",
      48: "reads coordinates along the graph",
      49: "change the view, not the equation",
      50: "limits and scale",
      51: "guide-line spacing",
      52: "same object at different scales",
      53: "satisfy extra conditions",
      54: "reports selected graph facts",
      55: "change a whole graph family",
      56: "axes, labels, and scale",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain("data-direct-interaction=\"true\"");
      expect(html, lesson.title).toContain("Drag graph");
      expect(html, lesson.title).not.toContain("Linked graph: the formula");
    }
  });

  it("renders function lessons 129 through 152 with lesson-specific graph guidance", () => {
    const expectedSnippets: Record<number, string> = {
      139: "real inputs need x &gt;= 0",
      140: "negative real inputs are allowed",
      141: "distance makes a V-shape",
      142: "equal x-steps multiply outputs",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain("data-direct-interaction=\"true\"");
      expect(html, lesson.title).toContain("Drag graph");
      expect(html, lesson.title).not.toContain("Linked graph: the formula");
    }
  });

  it("renders function transformation lessons 153 through 166 with lesson-specific graph guidance", () => {
    const expectedSnippets: Record<number, string> = {
      159: "inside multiplication changes width",
      160: "changes y to -y",
      161: "changes x to -x",
      162: "inside changes affect x",
      163: "later transformations act",
      164: "sliders change the graph family",
      165: "simplest rule shows",
      166: "shape plus more than one point",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <GraphLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain("data-direct-interaction=\"true\"");
      expect(html, lesson.title).toContain("Drag graph");
      expect(html, lesson.title).not.toContain("Linked graph: the formula");
    }
  });
});
