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
      24: "Animation rule",
      25: "Dependency rule",
      26: "Visibility rule",
      27: "Dynamic label",
      28: "Input syntax",
      29: "Redefinition rule",
      30: "Equation input",
      31: "Inequality input",
      32: "List rule",
      33: "Matrix size",
      34: "Sequence rule",
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

  it("renders Lists as an ordered table workspace instead of a generic line graph", () => {
    const lesson = lessonCatalog.find((item) => item.id === 32)!;
    const html = renderToStaticMarkup(
      <AlgebraLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("List entries, positions, and operations");
    expect(html).toContain("[2, 4, 6, 8]");
    expect(html).toContain("No graph needed");
    expect(html).toContain("Why this visual is valid");
    expect(html).toContain("A list is an ordered collection");
    expect(html).not.toContain("Graph of y equals");
    expect(html).not.toContain("y=1x+1");
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
