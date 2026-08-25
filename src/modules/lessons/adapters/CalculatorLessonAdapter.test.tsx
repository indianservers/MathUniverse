import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import CalculatorLessonAdapter from "./CalculatorLessonAdapter";

describe("CalculatorLessonAdapter", () => {
  it("renders lesson 1 as a dedicated BODMAS calculator workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 1)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0001"');
    expect(html).toContain('data-dedicated-lesson="1"');
    expect(html).toContain(
      'data-object-model="editable-arithmetic-expression-bodmas-parse-trace-history-practice-model"',
    );
    expect(html).toContain('data-expression="(12+8)/4"');
    expect(html).toContain('data-result="5"');
    expect(html).toContain('aria-label="Calculator expression"');
    expect(html).toContain('aria-label="Automatic expression trace"');
    expect(html).toContain('aria-label="Basic calculator practice answer"');
    expect(html).toContain("Order of operations (BODMAS)");
  });
  it("renders lesson 2 as a dedicated linked-fraction calculator workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 2)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0002"');
    expect(html).toContain('data-dedicated-lesson="2"');
    expect(html).toContain(
      'data-object-model="linked-two-fraction-lcd-equivalent-bars-exact-mixed-decimal-model"',
    );
    expect(html).toContain('data-lcd="4"');
    expect(html).toContain('data-result="5/4"');
    expect(html).toContain('aria-label="a numerator"');
    expect(html).toContain('aria-label="Fraction key /"');
    expect(html).toContain("Never add denominators directly");
  });
  it("renders lesson 3 as a dedicated mixed-number conversion workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 3)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0003"');
    expect(html).toContain('data-dedicated-lesson="3"');
    expect(html).toContain(
      'data-object-model="dual-mixed-number-whole-block-fraction-strip-improper-lcd-exact-decimal-model"',
    );
    expect(html).toContain('data-improper-first="7/3"');
    expect(html).toContain('data-improper-second="7/4"');
    expect(html).toContain('data-exact="49/12"');
    expect(html).toContain('data-mixed="4 1/12"');
    expect(html).toContain('aria-label="First mixed number whole part"');
    expect(html).toContain('aria-label="Evaluate mixed numbers"');
  });
  it("renders lesson 4 as a dedicated draggable percentage workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 4)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0004"');
    expect(html).toContain(
      'data-object-model="draggable-percent-base-hundred-grid-part-equation-practice-model"',
    );
    expect(html).toContain('data-percent="15"');
    expect(html).toContain('data-base="240"');
    expect(html).toContain('data-part="36"');
    expect(html).toContain('aria-label="Percent drag control"');
    expect(html).toContain('aria-label="Base drag control"');
    expect(html).toContain('aria-label="Percentage practice answer"');
  });
  it("renders calculator lessons 1 through 18 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      1: "Order rule",
      2: "Never add denominators directly",
      3: "Convert before you calculate",
      4: "Visual model: 15% of 240",
      5: "Ratio rule",
      6: "Power-root rule",
      7: "Scientific notation",
      8: "Log rule",
      9: "Exponential rule",
      10: "Trig mode",
      11: "Inverse trig",
      12: "Hyperbolic rule",
      13: "Counting rule",
      14: "Absolute value",
      15: "Precision rule",
      16: "Constant rule",
      17: "History rule",
      18: "Exact mode",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <CalculatorLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Calculator rule");
    }
  });

  it("renders phase 2 concept traces for calculator lessons 1 through 18", () => {
    const expectedTraces: Record<number, string> = {
      1: "Operation order stack",
      2: "Add numerators (denominators stay the same)",
      3: "Convert to improper fractions",
      4: "Part = Percent × Base",
      5: "Ratio simplification trace",
      6: "Power-root inverse pair",
      7: "Scientific notation scale",
      8: "Log as exponent question",
      9: "Exponential repeated factors",
      10: "Trig angle-mode check",
      11: "Ratio to principal angle",
      12: "Hyperbolic exponential formula",
      13: "Counting choices trace",
      14: "Distance from zero",
      15: "Exact value to rounded report",
      16: "Constant insertion check",
      17: "History pairs input with output",
      18: "Exact versus decimal classification",
    };

    for (const [idText, snippet] of Object.entries(expectedTraces)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <CalculatorLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      if (id > 4) expect(html, lesson.title).toContain("Concept trace");
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Calculator concept trace");
    }
  });
});
