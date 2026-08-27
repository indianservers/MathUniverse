import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import GraphLessonAdapter from "./GraphLessonAdapter";

describe("GraphLessonAdapter", () => {
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
      132: "Vertical-line test",
      133: "equal x-steps make equal y-changes",
      134: "turns at a vertex",
      135: "origin symmetry",
      136: "degree limits roots",
      137: "x=0 is excluded",
      138: "denominator zeros are excluded",
      139: "real inputs need x &gt;= 0",
      140: "negative real inputs are allowed",
      141: "distance makes a V-shape",
      142: "equal x-steps multiply outputs",
      143: "inputs must be positive",
      144: "repeats with a period",
      145: "not periodic like cosine",
      146: "outputs step down to integers",
      147: "outputs step up to integers",
      148: "outputs are -1, 0, or 1",
      149: "choose only the rule",
      150: "inner output becomes the outer input",
      151: "inputs and outputs reverse",
      152: "f(-x)=f(x)",
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
      153: "read increasing or decreasing",
      154: "repeats after a fixed period",
      155: "depends on an earlier value",
      156: "outside addition moves",
      157: "inside subtraction moves",
      158: "outside multiplication changes height",
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
