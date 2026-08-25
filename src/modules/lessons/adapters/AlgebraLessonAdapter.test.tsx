import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import AlgebraLessonAdapter from "./AlgebraLessonAdapter";

describe("AlgebraLessonAdapter", () => {
  it("renders algebra workspace lessons 19 through 30 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      19: "Build, link, substitute, and check",
      20: "Changing x updates",
      21: "Linked outputs update live",
      22: "Discrete integer slider",
      23: "Control rotations and periodic models",
      24: "Observe continuous mathematical change",
      25: "Teach construction hierarchy",
      26: "Create responsive interactive lessons",
      27: "Track changing mathematical information",
      28: "Construct objects from notation",
      29: "Modify constructions without rebuilding",
      30: "Create multiple equation types",
      31: "Explore solution regions",
      32: "Work with ordered collections",
      33: "Support linear algebra calculations",
      34: "Generate ordered mathematical patterns",
      35: "Piecewise rule",
      36: "Boolean rule",
      37: "Dynamic text",
      38: "LaTeX display",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Algebra rule");
    }
  });

  it("renders lesson 19 as a dedicated linked algebra workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 19)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0019"');
    expect(html).toContain('data-dedicated-lesson="19"');
    expect(html).toContain('data-object-model="editable-affine-rule-draggable-variable-substitution-output-dependency-equivalence-table-practice-model"');
    expect(html).toContain('data-x="5"');
    expect(html).toContain('data-output="13"');
    expect(html).toContain('aria-label="Variable x drag control"');
    expect(html).toContain("Preserve equivalence");
    expect(html).toContain("TEST VALUES TABLE");
  });

  it("renders lesson 20 as a dedicated variable dependency explorer", () => {
    const lesson = lessonCatalog.find((item) => item.id === 20)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0020"');
    expect(html).toContain('data-dedicated-lesson="20"');
    expect(html).toContain('data-object-model="single-source-variable-linked-rule-substitution-output-dependency-graph-table-verification-model"');
    expect(html).toContain('data-x="1"');
    expect(html).toContain('data-y="5"');
    expect(html).toContain('aria-label="Active variable x drag control"');
    expect(html).toContain("Dependency Graph");
    expect(html).toContain("Verify dependency");
  });

  it("renders lesson 21 as a dedicated continuous numeric slider lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 21)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0021"');
    expect(html).toContain('data-dedicated-lesson="21"');
    expect(html).toContain('data-object-model="continuous-bounded-precision-slider-linked-substitution-pattern-coordinate-graph-model"');
    expect(html).toContain('data-x="2"');
    expect(html).toContain('data-y="7"');
    expect(html).toContain('aria-label="Numeric slider x drag control"');
    expect(html).toContain("See the pattern");
    expect(html).toContain("Visual on the graph");
  });

  it("renders lesson 22 as a dedicated discrete integer slider lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 22)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0022"');
    expect(html).toContain('data-dedicated-lesson="22"');
    expect(html).toContain('data-object-model="discrete-integer-snap-iteration-table-staircase-plot-linked-affine-calculation-model"');
    expect(html).toContain('data-x="3"');
    expect(html).toContain('data-y="9"');
    expect(html).toContain('aria-label="Integer slider x drag control"');
    expect(html).toContain("Iteration table");
    expect(html).toContain("Step plot");
  });

  it("renders lesson 23 as a dedicated linked angle slider lab", () => {
    const lesson = lessonCatalog.find((item) => item.id === 23)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0023"');
    expect(html).toContain('data-dedicated-lesson="23"');
    expect(html).toContain('data-object-model="draggable-unit-circle-linked-sine-wave-trig-values-degree-radian-common-angle-model"');
    expect(html).toContain('data-angle="60"');
    expect(html).toContain('data-sin="0.866"');
    expect(html).toContain('aria-label="Draggable angle unit circle"');
    expect(html).toContain('aria-label="Angle slider drag control"');
    expect(html).toContain("Angle Conversion");
  });

  it("renders lesson 24 as a dedicated timed animation workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 24)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0024"');
    expect(html).toContain('data-dedicated-lesson="24"');
    expect(html).toContain('data-object-model="timed-six-frame-affine-parameter-trace-playback-speed-loop-seek-output-model"');
    expect(html).toContain('data-frame="3"');
    expect(html).toContain('data-a="1.5"');
    expect(html).toContain('data-output="4"');
    expect(html).toContain('aria-label="Seek frame 3"');
    expect(html).toContain("Frame table");
  });

  it("renders lesson 25 as a dedicated parent-child dependency workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 25)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0025"');
    expect(html).toContain('data-dedicated-lesson="25"');
    expect(html).toContain('data-object-model="two-draggable-parent-points-derived-segment-midpoint-length-label-hierarchy-model"');
    expect(html).toContain('data-ax="1"');
    expect(html).toContain('data-bx="5"');
    expect(html).toContain('data-mx="3"');
    expect(html).toContain('data-length="4"');
    expect(html).toContain('aria-label="Draggable independent points A and B with dependent midpoint"');
    expect(html).toContain("Dependency hierarchy");
  });

  it("renders lesson 26 as a dedicated conditional visibility workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 26)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0026"');
    expect(html).toContain('data-dedicated-lesson="26"');
    expect(html).toContain('data-object-model="editable-boolean-boundary-number-line-region-object-visibility-before-after-model"');
    expect(html).toContain('data-x="2.5"');
    expect(html).toContain('data-operator="&gt;="');
    expect(html).toContain('data-boundary="2"');
    expect(html).toContain('data-visible="true"');
    expect(html).toContain('aria-label="Visibility number line drag control"');
    expect(html).toContain("TRUTH EVALUATION");
  });

  it("renders lesson 27 as a dedicated token-linked dynamic label workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 27)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0027"');
    expect(html).toContain('data-dedicated-lesson="27"');
    expect(html).toContain('data-object-model="draggable-point-token-template-coordinate-distance-projection-live-label-model"');
    expect(html).toContain('data-x="3"');
    expect(html).toContain('data-y="2"');
    expect(html).toContain('data-distance="3.61"');
    expect(html).toContain('aria-label="Draggable point P with dynamic label"');
    expect(html).toContain("Labels should read linked values, not fixed text");
  });

  it("renders lesson 28 as a dedicated parsed algebraic input workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 28)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0028"');
    expect(html).toContain('data-dedicated-lesson="28"');
    expect(html).toContain('data-object-model="parsed-function-syntax-validation-sampled-graph-root-vertex-key-point-model"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-name="f"');
    expect(html).toContain('data-variable="x"');
    expect(html).toContain('aria-label="Algebra function input"');
    expect(html).toContain("Validation checklist");
  });

  it("renders lesson 29 as a dedicated object redefinition workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 29)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0029"');
    expect(html).toContain('data-dedicated-lesson="29"');
    expect(html).toContain('data-object-model="preserved-object-identity-executable-old-new-rule-dependent-output-dual-graph-dependency-tree-model"');
    expect(html).toContain('data-old-rule="x + 1"');
    expect(html).toContain('data-rule="x^2 - 1"');
    expect(html).toContain('data-a="3"');
    expect(html).toContain('aria-label="New object definition"');
    expect(html).toContain("Updated dependents");
  });

  it("renders lesson 30 as a dedicated solvable equation workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 30)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0030"');
    expect(html).toContain('data-dedicated-lesson="30"');
    expect(html).toContain('data-object-model="parsed-two-sided-linear-equation-balance-generated-steps-dual-line-intersection-substitution-proof-model"');
    expect(html).toContain('data-solution="4"');
    expect(html).toContain('data-solved-y="11"');
    expect(html).toContain('aria-label="Equation input"');
    expect(html).toContain("SOLUTION CHECKER");
  });

  it("renders lesson 31 as a dedicated inequality solution workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 31)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0031"');
    expect(html).toContain('data-dedicated-lesson="31"');
    expect(html).toContain('data-object-model="parsed-affine-inequality-sign-reversal-open-closed-boundary-number-line-graph-region-test-point-model"');
    expect(html).toContain('data-solution-operator="&lt;"');
    expect(html).toContain('data-boundary="4"');
    expect(html).toContain('data-inclusive="false"');
    expect(html).toContain('aria-label="Inequality input"');
    expect(html).toContain("TEST POINTS");
  });

  it("renders lesson 32 as a dedicated ordered-list operation workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 32)!;
    const html = renderToStaticMarkup(
      <AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain('data-testid="algebra-mockup-0032"');
    expect(html).toContain('data-dedicated-lesson="32"');
    expect(html).toContain('data-object-model="editable-draggable-ordered-list-index-selection-operation-pipeline-statistics-bar-dot-result-model"');
    expect(html).toContain('data-list="2,4,6,8"');
    expect(html).toContain('data-selected-index="2"');
    expect(html).toContain('data-final-list="4,12,16,20"');
    expect(html).toContain('data-final-sum="52"');
    expect(html).toContain('aria-label="List value 3"');
    expect(html).toContain("Operation pipeline");
  });

  it("renders lesson 33 as a dedicated editable matrix workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 33)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0033"');
    expect(html).toContain('data-dedicated-lesson="33"');
    expect(html).toContain('data-object-model="editable-resizable-matrix-selected-cell-row-column-determinant-trace-vector-action-geometric-transform-model"');
    expect(html).toContain('data-matrix="1,2,3,4"');
    expect(html).toContain('data-determinant="-2"');
    expect(html).toContain('data-trace="5"');
    expect(html).toContain('data-vector="3,7"');
    expect(html).toContain('aria-label="Selected matrix cell value"');
  });

  it("renders lesson 34 as a dedicated arithmetic sequence workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 34)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0034"');
    expect(html).toContain('data-dedicated-lesson="34"');
    expect(html).toContain('data-object-model="arithmetic-sequence-first-term-common-difference-index-explicit-rule-jump-table-prediction-model"');
    expect(html).toContain('data-terms="2,5,8,11,14,17"');
    expect(html).toContain('data-selected="5"');
    expect(html).toContain('data-selected-value="14"');
    expect(html).toContain('aria-label="Common difference stepper"');
    expect(html).toContain("Number-line jump model");
  });

  it("renders lesson 35 as a dedicated piecewise-definition workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 35)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0035"');
    expect(html).toContain('data-dedicated-lesson="35"');
    expect(html).toContain('data-object-model="two-branch-piecewise-condition-endpoint-inclusion-evaluation-draggable-graph-probe-boundary-check-model"');
    expect(html).toContain('data-x="1"');
    expect(html).toContain('data-value="2"');
    expect(html).toContain('data-branch="right"');
    expect(html).toContain('aria-label="Piecewise x value"');
    expect(html).toContain("CHECK THE BOUNDARIES");
  });

  it("renders lesson 36 as a dedicated Boolean logic workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 36)!;
    const html = renderToStaticMarkup(<AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="algebra-mockup-0036"');
    expect(html).toContain('data-object-model="dual-boolean-switch-logic-gates-truth-table-operation-focus-conditional-visibility-model"');
    expect(html).toContain('data-a="true"');
    expect(html).toContain('data-b="false"');
    expect(html).toContain('data-and="false"');
    expect(html).toContain('data-or="true"');
    expect(html).toContain('aria-label="Toggle A"');
    expect(html).toContain("TRUTH TABLE");
  });

  it("renders phase 4 algebra lessons 92 through 128 with lesson-specific structure labs", () => {
    const expectedFamilies: Record<number, string> = {
      92: "Tile/area model",
      93: "Symbolic-step model",
      94: "Symbolic-step model",
      95: "Symbolic-step model",
      96: "Tile/area model",
      97: "Symbolic-step model",
      98: "Symbolic-step model",
      99: "Symbolic-step model",
      100: "Symbolic-step model",
      101: "Symbolic-step model",
      102: "Symbolic-step model",
      103: "Table/check model",
      104: "Symbolic-step model",
      105: "Symbolic-step model",
      106: "Symbolic-step model",
      107: "Symbolic-step model",
      108: "Symbolic-step model",
      109: "Symbolic-step model",
      110: "Symbolic-step model",
      111: "Symbolic-step model",
      112: "Coordinate-region model",
      113: "Table/check model",
      114: "Graph sign structure",
      115: "Graph sign structure",
      116: "Symbolic-step model",
      117: "Symbolic-step model",
      118: "Graph sign structure",
      119: "Symbolic-step model",
      120: "Unit-circle equation",
      121: "Number-line solution set",
      122: "Number-line solution set",
      123: "Number-line solution set",
      124: "Graph sign structure",
      125: "Graph sign structure",
      126: "Coordinate-region model",
      127: "Coordinate-region model",
      128: "Table/check model",
    };

    for (const [idText, family] of Object.entries(expectedFamilies)) {
      const lesson = lessonCatalog.find((item) => item.id === Number(idText))!;
      const html = renderToStaticMarkup(
        <AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(`${lesson.title} structure lab`);
      expect(html, lesson.title).toContain(`${lesson.title} concept trace`);
      expect(html, lesson.title).toContain(family);
      expect(html, lesson.title).toContain("This algebra page uses a lesson-specific symbolic workspace instead of a default line graph.");
      expect(html, lesson.title).not.toContain("Graph of y equals");
    }
  });
});
