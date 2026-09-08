import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import GraphLessonAdapter from "./GraphLessonAdapter";

describe("GraphLessonAdapter", () => {
  it("routes lesson 52 to its dedicated multiple-views surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 52)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0144"');
    expect(html).toContain('data-dedicated-lesson="52"');
    expect(html).toContain(
      "single-shared-function-four-independent-representations",
    );
    expect(html).toContain('aria-label="Drag graph cursor"');
    expect(html).toContain('data-y="1.409297"');
  });

  it("routes lesson 51 to its dedicated grid-controls surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 51)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0143"');
    expect(html).toContain('data-dedicated-lesson="51"');
    expect(html).toContain(
      "major-grid-spacing-minor-subdivision-derived-snap-interval",
    );
    expect(html).toContain('aria-label="Drag grid estimate point"');
    expect(html).toContain('data-minor="0.25"');
  });

  it("routes lesson 50 to its dedicated axis-controls surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 50)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0142"');
    expect(html).toContain('data-dedicated-lesson="50"');
    expect(html).toContain(
      "independent-axis-bounds-tick-spacing-linear-log-transforms",
    );
    expect(html).toContain('aria-label="Drag axis origin"');
    expect(html).toContain('data-x-range="[-4, 4]"');
  });

  it("routes lesson 49 to its dedicated zoom-and-pan surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 49)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0141"');
    expect(html).toContain('data-dedicated-lesson="49"');
    expect(html).toContain("bounded-independent-viewport-center-and-scale");
    expect(html).toContain('aria-label="Drag viewport"');
    expect(html).toContain("Same equation, different view");
  });

  it("routes lesson 48 to its dedicated trace-mode surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 48)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0140"');
    expect(html).toContain('data-dedicated-lesson="48"');
    expect(html).toContain("exact-sine-linear-function-and-derivative");
    expect(html).toContain('aria-label="Drag trace point"');
    expect(html).toContain('data-slope="0.072798"');
  });

  it("routes lesson 47 to its dedicated table-of-values surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 47)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0139"');
    expect(html).toContain('data-dedicated-lesson="47"');
    expect(html).toContain("editable-quadratic-rule-generated-value-rows");
    expect(html).toContain('aria-label="Drag selected table point"');
    expect(html).toContain("All second differences are 2");
  });

  it("routes lesson 46 to its dedicated data plotter", () => {
    const lesson = lessonCatalog.find((item) => item.id === 46)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0138"');
    expect(html).toContain('data-dedicated-lesson="46"');
    expect(html).toContain("editable-addable-deletable-dataset");
    expect(html).toContain('aria-label="Drag data row 5"');
    expect(html).toContain('data-outliers="5"');
  });

  it("routes lesson 45 to its dedicated point plotter", () => {
    const lesson = lessonCatalog.find((item) => item.id === 45)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0137"');
    expect(html).toContain('data-dedicated-lesson="45"');
    expect(html).toContain("editable-reorderable-colored-point-collection");
    expect(html).toContain('aria-label="Drag point C"');
    expect(html).toContain("Add point");
  });

  it("routes lesson 44 to its dedicated polar graph surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 44)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0136"');
    expect(html).toContain('data-dedicated-lesson="44"');
    expect(html).toContain(
      "editable-polar-angle-radius-scale-and-integer-petal-multiplier",
    );
    expect(html).toContain('aria-label="Drag polar angle"');
    expect(html).toContain('data-petals="3"');
  });

  it("routes lesson 43 to its dedicated parametric-curves surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 43)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0135"');
    expect(html).toContain('data-dedicated-lesson="43"');
    expect(html).toContain(
      "editable-parametric-radii-time-and-animation-speed",
    );
    expect(html).toContain('aria-label="Drag parametric particle"');
    expect(html).toContain("Play motion");
  });

  it("routes lesson 42 to its dedicated inequality grapher", () => {
    const lesson = lessonCatalog.find((item) => item.id === 42)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0134"');
    expect(html).toContain('data-dedicated-lesson="42"');
    expect(html).toContain(
      "editable-inclusive-boundaries-and-shade-directions",
    );
    expect(html).toContain('aria-label="Drag inequality test point"');
    expect(html).toContain("Solution (lies in overlap region)");
  });

  it("routes lesson 41 to its dedicated equation grapher", () => {
    const lesson = lessonCatalog.find((item) => item.id === 41)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0133"');
    expect(html).toContain('data-dedicated-lesson="41"');
    expect(html).toContain("three-explicit-solution-set-equations");
    expect(html).toContain('aria-label="Drag equation test point"');
    expect(html).toContain("Every point on the curve makes the equation true");
  });

  it("routes lesson 40 to its dedicated function plotter", () => {
    const lesson = lessonCatalog.find((item) => item.id === 40)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0132"');
    expect(html).toContain('data-dedicated-lesson="40"');
    expect(html).toContain("editable-independent-function-definitions");
    expect(html).toContain('aria-label="Trace x"');
    expect(html).toContain("Outputs at x = 1.5");
  });

  it("routes lesson 39 to its dedicated Cartesian graphing surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 39)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0131"');
    expect(html).toContain('data-dedicated-lesson="39"');
    expect(html).toContain(
      "ordered-pair-x-first-y-second-snapped-pointer-keyboard-draggable-point",
    );
    expect(html).toContain('aria-label="Drag point P"');
    expect(html).toContain("Sample ordered pairs");
  });

  it("routes lesson 166 to its dedicated graph-matching engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 166)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0223"');
    expect(html).toContain('data-dedicated-lesson="166"');
    expect(html).toContain(
      "six-quadratic-equation-cards-native-drag-keyboard-selection",
    );
    expect(html).toContain('draggable="true"');
    expect(html).toContain("Graph target 2, 1, opens up");
  });

  it("routes lesson 165 to its dedicated parent-function library", () => {
    const lesson = lessonCatalog.find((item) => item.id === 165)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0222"');
    expect(html).toContain('data-dedicated-lesson="165"');
    expect(html).toContain(
      "six-explicit-parent-function-definitions-selectable-generated-domain-range",
    );
    expect(html).toContain('aria-label="Drag transformed family anchor"');
    expect(html).toContain("Reciprocal");
  });

  it("routes lesson 164 to its dedicated parameter explorer", () => {
    const lesson = lessonCatalog.find((item) => item.id === 164)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0221"');
    expect(html).toContain('data-dedicated-lesson="164"');
    expect(html).toContain(
      "editable-quadratic-a-h-k-parameters-pointer-keyboard-draggable-vertex",
    );
    expect(html).toContain('aria-label="Drag transformed vertex"');
    expect(html).toContain("Parameter Effects");
  });

  it("routes lesson 163 to its dedicated transformation-order engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 163)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0220"');
    expect(html).toContain('data-dedicated-lesson="163"');
    expect(html).toContain(
      "editable-noncommutative-two-pipeline-input-substitution-steps-pointer-keyboard-draggable-linked-vertices-generated-curves-equations-observation-table-custom-order-practice-notes-and-navigation",
    );
    expect(html).toContain('aria-label="Drag Pipeline A vertex"');
    expect(html).toContain("Compare two orders of the same transformations");
  });

  it("routes lesson 162 to its dedicated combined-transformations engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 162)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0219"');
    expect(html).toContain('data-dedicated-lesson="162"');
    expect(html).toContain(
      "editable-combined-horizontal-shift-vertical-scale-and-shift-reorderable-transformation-pipeline-pointer-keyboard-draggable-vertex-generated-parent-step-final-parabolas-point-trace-tabs-practice-and-navigation",
    );
    expect(html).toContain('aria-label="Drag final vertex"');
    expect(html).toContain("Transformation order (drag to rearrange)");
  });

  it("routes lesson 161 to its dedicated y-axis reflection engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 161)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0218"');
    expect(html).toContain('data-dedicated-lesson="161"');
    expect(html).toContain(
      "editable-y-axis-reflection-pre-shift-horizontal-scale-and-y-level-pointer-keyboard-draggable-same-output-point-generated-cubic-curves-horizontal-pairs-table-step-views-concepts-and-rule",
    );
    expect(html).toContain('aria-label="Drag reflected same-y point"');
    expect(html).toContain("Point pairs (same y-value)");
  });

  it("routes lesson 160 to its dedicated x-axis reflection engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 160)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0217"');
    expect(html).toContain('data-dedicated-lesson="160"');
    expect(html).toContain(
      "editable-x-axis-reflection-scale-shift-and-sample-pointer-keyboard-draggable-reflected-point-generated-parent-and-reflected-parabolas-mirror-lines-point-mapping-rule-cards-and-navigation",
    );
    expect(html).toContain('aria-label="Drag reflected point"');
    expect(html).toContain("Point Mapping");
  });

  it("routes lesson 159 to its dedicated horizontal-scale engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 159)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0216"');
    expect(html).toContain('data-dedicated-lesson="159"');
    expect(html).toContain(
      "editable-inside-horizontal-scale-stretch-compression-mode-and-y-levels-pointer-keyboard-draggable-same-output-point-generated-parent-and-transformed-parabolas-reciprocal-width-rulers-input-table-preview-actions-and-navigation",
    );
    expect(html).toContain('aria-label="Drag horizontal scale point"');
    expect(html).toContain("SAME Y-LEVELS COMPARISON");
  });

  it("routes lesson 158 to its dedicated vertical-scale engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 158)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0215"');
    expect(html).toContain('data-dedicated-lesson="158"');
    expect(html).toContain(
      "editable-vertical-scale-stretch-compression-mode-sample-visibility-pointer-keyboard-draggable-scaled-point-generated-parent-and-transformed-parabolas-fixed-x-arrows-value-table-compression-reference-tabs-language-share-and-workspace",
    );
    expect(html).toContain('aria-label="Drag vertical scale point"');
    expect(html).toContain("Value comparison table");
  });

  it("routes lesson 157 to its dedicated horizontal-translation engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 157)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0214"');
    expect(html).toContain('data-dedicated-lesson="157"');
    expect(html).toContain(
      "editable-horizontal-shift-parent-visibility-and-comparison-level-pointer-keyboard-draggable-vertex-and-level-probe-generated-parabolas-same-height-arrows-input-remapping-table-and-vertex-proof",
    );
    expect(html).toContain('aria-label="Drag horizontal translation vertex"');
    expect(html).toContain("Input changes first");
  });

  it("routes lesson 156 to its dedicated vertical-translation engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 156)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0213"');
    expect(html).toContain('data-dedicated-lesson="156"');
    expect(html).toContain(
      "editable-vertical-shift-parent-and-transformed-visibility-pointer-keyboard-draggable-parabola-and-sample-probe-generated-curves-arrows-vertex-table-and-output-invariance",
    );
    expect(html).toContain('aria-label="Drag translated parabola vertically"');
    expect(html).toContain("Every output");
  });

  it("routes lesson 155 to its dedicated recurrence engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 155)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0212"');
    expect(html).toContain('data-dedicated-lesson="155"');
    expect(html).toContain(
      "editable-affine-recurrence-growth-seed-add-on-steps-pointer-keyboard-draggable-term-probe-generated-sequence-table-graph-next-preview-cobweb-and-exact-fixed-point",
    );
    expect(html).toContain('aria-label="Drag recursive term probe"');
    expect(html).toContain("Next term preview");
  });

  it("routes lesson 154 to its dedicated periodic-wave engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 154)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0211"');
    expect(html).toContain('data-dedicated-lesson="154"');
    expect(html).toContain(
      "editable-sine-amplitude-frequency-midline-pointer-keyboard-draggable-phase-probe-generated-period-ruler-cycle-shading-matching-points-live-periodic-identity-real-tabs-language-bookmark-share-save",
    );
    expect(html).toContain('aria-label="Drag periodic matching point"');
    expect(html).toContain("Match confirmed");
  });

  it("routes lesson 153 to its dedicated monotonicity engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 153)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0210"');
    expect(html).toContain('data-dedicated-lesson="153"');
    expect(html).toContain(
      "editable-cubic-turning-strength-vertical-shift-pointer-keyboard-draggable-x-cursor-generated-extrema-monotonic-regions-derivative-sign-strip-interval-summary-live-slope-classification",
    );
    expect(html).toContain('aria-label="Drag monotonicity x cursor"');
    expect(html).toContain("Derivative sign summary");
  });

  it("routes lesson 152 to its dedicated symmetry-test engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 152)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0209"');
    expect(html).toContain('data-dedicated-lesson="152"');
    expect(html).toContain(
      "selectable-even-odd-neither-polynomial-family-pointer-keyboard-draggable-x-probe-generated-x-negative-x-points-mirror-and-rotation-overlays-live-algebraic-symmetry-verdict",
    );
    expect(html).toContain('aria-label="Drag symmetry test point"');
    expect(html).toContain("Verdict: even");
  });

  it("routes lesson 151 to its dedicated inverse reflection engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 151)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0208"');
    expect(html).toContain('data-dedicated-lesson="151"');
    expect(html).toContain(
      "editable-linear-function-slope-intercept-domain-restriction-pointer-keyboard-draggable-source-point-generated-reflected-inverse-swapped-coordinate-mapping-table-live-composition-horizontal-line-test",
    );
    expect(html).toContain('aria-label="Drag original function point"');
    expect(html).toContain("Composition returns the start");
  });

  it("routes lesson 150 to its dedicated composition-order engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 150)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0207"');
    expect(html).toContain('data-dedicated-lesson="150"');
    expect(html).toContain(
      "editable-composite-input-inner-shift-outer-scale-and-order-pointer-keyboard-draggable-graph-probe-generated-function-machine-three-curves-live-inside-first-evaluation-and-order-comparison",
    );
    expect(html).toContain('aria-label="Drag composite input probe"');
    expect(html).toContain("Evaluate inside first");
  });

  it("routes lesson 149 to its dedicated piecewise rule engine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 149)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0206"');
    expect(html).toContain('data-dedicated-lesson="149"');
    expect(html).toContain(
      "editable-piecewise-probe-switch-points-vertical-shift-and-branch-visibility-pointer-keyboard-draggable-probe-and-boundaries-generated-three-rule-graph-open-closed-endpoint-ownership-condition-first-evaluation-and-boundary-trace",
    );
    expect(html).toContain('aria-label="Drag piecewise x probe"');
    expect(html).toContain("Boundary decides");
  });

  it("routes lesson 148 to its dedicated three-region sign classifier", () => {
    const lesson = lessonCatalog.find((item) => item.id === 148)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0205"');
    expect(html).toContain('data-dedicated-lesson="148"');
    expect(html).toContain(
      "editable-sign-input-threshold-and-domain-scale-pointer-keyboard-draggable-input-and-threshold-generated-negative-zero-positive-rays-live-classifier-selectable-cases-piecewise-definition-magnitude-ignored-direction-model",
    );
    expect(html).toContain('aria-label="Drag sign input cursor"');
    expect(html).toContain("Magnitude ignored");
  });

  it("routes lesson 147 to its dedicated ceiling staircase model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 147)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0204"');
    expect(html).toContain('data-dedicated-lesson="147"');
    expect(html).toContain(
      "editable-ceiling-input-horizontal-and-vertical-shifts-snap-mode-pointer-keyboard-draggable-probe-clickable-generated-evaluation-table-upward-staircase-open-left-closed-right-endpoints-negative-input-correctness-floor-comparison-jump-model",
    );
    expect(html).toContain('aria-label="Drag ceiling input probe"');
    expect(html).toContain("Open left, closed right");
  });

  it("routes lesson 146 to its dedicated floor staircase model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 146)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0203"');
    expect(html).toContain('data-dedicated-lesson="146"');
    expect(html).toContain(
      "editable-floor-input-horizontal-and-vertical-shifts-pointer-keyboard-draggable-probe-generated-staircase-number-line-interval-table-closed-left-open-right-endpoints-negative-input-correctness-real-challenge-discontinuity-diagnostics",
    );
    expect(html).toContain('aria-label="Drag floor input probe"');
    expect(html).toContain("STEP_ENDPOINTS_REQUIRED");
  });

  it("routes lesson 145 to its dedicated unit-hyperbola decomposition model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 145)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0202"');
    expect(html).toContain('data-dedicated-lesson="145"');
    expect(html).toContain(
      "linked-unit-hyperbola-exponential-decomposition-sinh-cosh-tanh-pointer-keyboard-draggable-hyperbola-point-and-graph-probe-generated-five-curves-table-identity-residual-real-challenge-curve-toggles-zoom-fullscreen",
    );
    expect(html).toContain('aria-label="Drag point on unit hyperbola"');
    expect(html).toContain("HYPERBOLA_IDENTITY_REQUIRED");
  });

  it("routes lesson 144 to its dedicated linked unit-circle model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 144)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0201"');
    expect(html).toContain('data-dedicated-lesson="144"');
    expect(html).toContain(
      "linked-unit-circle-sine-cosine-amplitude-period-phase-midline-pointer-keyboard-draggable-circle-angle-graph-trace-amplitude-and-period-generated-curves-live-values-period-detection-identities-real-challenge-animation-export",
    );
    expect(html).toContain('aria-label="Drag unit-circle angle"');
    expect(html).toContain("PERIODICITY_VISIBLE_REQUIRED");
  });

  it("routes lesson 143 to its dedicated logarithmic inverse model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 143)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0200"');
    expect(html).toContain('data-dedicated-lesson="143"');
    expect(html).toContain(
      "editable-logarithmic-scale-base-horizontal-shift-vertical-shift-pointer-keyboard-draggable-asymptote-anchor-and-scale-point-generated-domain-curve-inverse-exponential-reflection-value-table-diagnostics-real-parameter-challenge",
    );
    expect(html).toContain('aria-label="Drag logarithmic vertical asymptote"');
    expect(html).toContain("CONCEPTUAL DIAGNOSTICS");
  });

  it("routes lesson 142 to its dedicated exponential ratio model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 142)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0199"');
    expect(html).toContain('data-dedicated-lesson="142"');
    expect(html).toContain(
      "editable-exponential-initial-base-asymptote-growth-decay-mode-pointer-keyboard-draggable-initial-base-point-and-horizontal-asymptote-generated-dual-curves-samples-ratio-table-repeated-multiplication-concepts-example-model",
    );
    expect(html).toContain('aria-label="Drag exponential base point"');
    expect(html).toContain("Equal x-steps multiply outputs");
  });

  it("routes lesson 141 to its dedicated absolute-value distance model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 141)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0198"');
    expect(html).toContain('data-dedicated-lesson="141"');
    expect(html).toContain(
      "editable-absolute-value-scale-vertex-shift-reflection-pointer-keyboard-draggable-vertex-opening-and-distance-probe-generated-v-graph-parent-axis-piecewise-branches-distance-model-range-model",
    );
    expect(html).toContain('aria-label="Drag absolute-value vertex"');
    expect(html).toContain("Distance model on the number line");
  });

  it("routes lesson 140 to its dedicated cube-root center model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 140)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0197"');
    expect(html).toContain('data-dedicated-lesson="140"');
    expect(html).toContain(
      "editable-shifted-cube-root-scale-center-and-vertical-shift-pointer-keyboard-draggable-center-and-scale-point-generated-all-real-s-curve-symmetric-samples-table-inverse-reasoning-warning-practice-model",
    );
    expect(html).toContain('aria-label="Drag cube-root center"');
    expect(html).toContain("Explore the cube-root center");
  });

  it("routes lesson 139 to its dedicated square-root endpoint model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 139)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0196"');
    expect(html).toContain('data-dedicated-lesson="139"');
    expect(html).toContain(
      "editable-square-root-vertical-scale-and-domain-start-pointer-keyboard-draggable-endpoint-and-scale-point-generated-restricted-domain-curve-samples-table-range-reasoning-warning-practice-model",
    );
    expect(html).toContain('aria-label="Drag square-root endpoint"');
    expect(html).toContain("Square-Root Endpoint Explorer");
  });

  it("routes lesson 138 to its dedicated rational analyzer model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 138)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0195"');
    expect(html).toContain('data-dedicated-lesson="138"');
    expect(html).toContain(
      "editable-equal-degree-rational-numerator-scale-and-restricted-input-pointer-keyboard-draggable-restriction-and-scale-point-generated-branches-vertical-or-removable-hole-long-run-value-samples-reasoning-warning-practice-model",
    );
    expect(html).toContain('aria-label="Drag rational restricted input"');
    expect(html).toContain("Rational function analyzer");
  });

  it("routes lesson 137 to its dedicated reciprocal asymptote model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 137)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0194"');
    expect(html).toContain('data-dedicated-lesson="137"');
    expect(html).toContain(
      "editable-reciprocal-scale-and-excluded-input-pointer-keyboard-draggable-asymptote-and-scale-point-generated-two-branch-graph-working-pan-zoom-linked-samples-domain-range-reasoning-warning-practice-model",
    );
    expect(html).toContain('aria-label="Drag excluded reciprocal input"');
    expect(html).toContain("Asymptote explorer");
  });

  it("routes lesson 136 to its dedicated higher-degree polynomial model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 136)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0193"');
    expect(html).toContain('data-dedicated-lesson="136"');
    expect(html).toContain(
      "editable-factored-higher-degree-polynomial-moving-root-and-vertical-shift-pointer-keyboard-draggable-root-generated-curve-numerical-intercepts-turning-points-multiplicity-sign-intervals-samples-end-behavior-practice-model",
    );
    expect(html).toContain('aria-label="Drag moving polynomial root"');
    expect(html).toContain("ROOT AND TURNING POINT EXPLORER");
  });

  it("routes lesson 135 to its dedicated cubic inflection model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 135)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0192"');
    expect(html).toContain('data-dedicated-lesson="135"');
    expect(html).toContain(
      "editable-cubic-inflection-form-signed-bend-pointer-keyboard-draggable-inflection-and-shape-points-generated-s-curve-opposite-end-behavior-point-symmetry-linked-value-table-reasoning-practice-model",
    );
    expect(html).toContain('aria-label="Drag cubic inflection point"');
    expect(html).toContain("Cubic Shape Explorer");
  });

  it("routes lesson 134 to its dedicated quadratic vertex model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 134)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0191"');
    expect(html).toContain('data-dedicated-lesson="134"');
    expect(html).toContain(
      "editable-quadratic-vertex-form-linked-parameters-pointer-keyboard-draggable-vertex-and-opening-point-generated-parabola-symmetry-axis-mirror-points-value-table-reasoning-practice-model",
    );
    expect(html).toContain('aria-label="Drag quadratic vertex"');
    expect(html).toContain("Vertex and Symmetry Explorer");
  });

  it("routes lesson 133 to its dedicated linked linear-function model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 133)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0190"');
    expect(html).toContain('data-dedicated-lesson="133"');
    expect(html).toContain(
      "editable-linear-slope-intercept-linked-hero-and-cartesian-graphs-pointer-keyboard-draggable-intercept-and-slope-point-generated-rise-run-triangle-equal-step-table-rate-proof-practice-model",
    );
    expect(html).toContain('aria-label="Drag linear intercept"');
    expect(html).toContain("Slope–Intercept Explorer");
  });

  it("routes lesson 132 to its dedicated vertical-line scanner model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 132)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0189"');
    expect(html).toContain('data-dedicated-lesson="132"');
    expect(html).toContain(
      "editable-vertical-line-scanner-circle-parabola-sideways-relation-pointer-keyboard-draggable-test-line-generated-intersections-hit-count-global-function-classification-linked-reasoning-comparison-model",
    );
    expect(html).toContain('aria-label="Drag vertical test line"');
    expect(html).toContain("Vertical-Line Scanner");
  });

  it("routes lesson 131 to its dedicated function-notation decoder model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 131)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0188"');
    expect(html).toContain('data-dedicated-lesson="131"');
    expect(html).toContain(
      "editable-quadratic-function-notation-decoder-coefficient-shift-pointer-keyboard-draggable-chosen-input-linked-substitution-output-parabola-sample-table-ordered-pair-not-multiplication-practice-model",
    );
    expect(html).toContain('aria-label="Drag chosen function input"');
    expect(html).toContain("Notation decoder for");
  });

  it("routes lesson 130 to its dedicated domain-range projector model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 130)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="graph-mockup-0187"');
    expect(html).toContain('data-dedicated-lesson="130"');
    expect(html).toContain(
      "editable-shifted-square-root-domain-range-projector-pointer-keyboard-draggable-closed-start-point-linked-axis-projections-generated-interval-notation-sample-evaluations-grid-practice-model",
    );
    expect(html).toContain('aria-label="Drag square root start point"');
    expect(html).toContain("Domain–Range Projector");
  });

  it("routes lesson 129 to its dedicated linked function-machine model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 129)!;
    const html = renderToStaticMarkup(
      <GraphLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="graph-mockup-0186"');
    expect(html).toContain('data-dedicated-lesson="129"');
    expect(html).toContain(
      "editable-linear-function-machine-linked-input-output-mappings-parameter-sliders-pointer-keyboard-draggable-sample-inputs-generated-value-table-synchronized-cartesian-graph-vertical-slice-function-test-multiple-output-counterexample-live-practice-model",
    );
    expect(html).toContain('aria-label="Drag function input 1"');
    expect(html).toContain("Function machine + graph cross-check");
  });

  it("renders graphing calculator lessons 53 through 56 with tool-specific graph guidance", () => {
    const expectedSnippets: Record<number, string> = {
      53: "satisfy extra conditions",
      54: "reports selected graph facts",
      55: "change a whole graph family",
      56: "axes, labels, and scale",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <GraphLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
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
        <GraphLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
      expect(html, lesson.title).toContain("Drag graph");
      expect(html, lesson.title).not.toContain("Linked graph: the formula");
    }
  });

  it("renders function transformation lessons 153 through 166 with lesson-specific graph guidance", () => {
    const expectedSnippets: Record<number, string> = {};

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <GraphLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
      expect(html, lesson.title).toContain("Drag graph");
      expect(html, lesson.title).not.toContain("Linked graph: the formula");
    }
  });
});
