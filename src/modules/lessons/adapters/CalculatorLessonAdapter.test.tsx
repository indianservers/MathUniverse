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
  it("renders lesson 5 as a dedicated ratio grouping workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 5)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0005"');
    expect(html).toContain(
      'data-object-model="dual-draggable-ratio-gcf-equal-groups-tiles-double-number-line-practice-model"',
    );
    expect(html).toContain('data-a="24"');
    expect(html).toContain('data-b="36"');
    expect(html).toContain('data-gcf="12"');
    expect(html).toContain('data-simple="2:3"');
    expect(html).toContain('aria-label="Part A drag control"');
    expect(html).toContain('aria-label="Ratio practice value 1"');
  });
  it("renders lesson 6 as a dedicated powers and roots workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 6)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0006"');
    expect(html).toContain(
      'data-object-model="linked-square-root-area-grid-repeated-power-cube-combined-expression-practice-model"',
    );
    expect(html).toContain('data-radicand="144"');
    expect(html).toContain('data-root="12"');
    expect(html).toContain('data-power="8"');
    expect(html).toContain('data-total="20"');
    expect(html).toContain('aria-label="Increase Radicand (area)"');
  });
  it("renders lesson 7 as a dedicated scientific notation scale workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 7)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0007"');
    expect(html).toContain(
      'data-object-model="coefficient-power-ten-number-line-decimal-shift-standard-form-ladder-practice-model"',
    );
    expect(html).toContain('data-coefficient="6.02"');
    expect(html).toContain('data-exponent="5"');
    expect(html).toContain('data-standard="602,000"');
    expect(html).toContain('aria-label="Increase Coefficient"');
    expect(html).toContain('aria-label="Decrease Exponent"');
  });
  it("renders lesson 8 as a dedicated inverse logarithm workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 8)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0008"');
    expect(html).toContain(
      'data-object-model="bidirectional-base-exponent-power-logarithm-ladder-drag-practice-model"',
    );
    expect(html).toContain('data-base="10"');
    expect(html).toContain('data-exponent="3"');
    expect(html).toContain('data-target="1000"');
    expect(html).toContain('aria-label="Base drag control"');
    expect(html).toContain('aria-label="Target (power) drag control"');
  });
  it("renders lesson 9 as a dedicated exponential growth workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 9)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0009"');
    expect(html).toContain(
      'data-object-model="base-exponent-factor-chain-draggable-staircase-growth-chart-animation-practice-model"',
    );
    expect(html).toContain('data-base="2"');
    expect(html).toContain('data-exponent="8"');
    expect(html).toContain('data-output="256"');
    expect(html).toContain('aria-label="Exponent drag control"');
    expect(html).toContain('aria-label="Exponential practice answer"');
  });
  it("renders lesson 10 as a dedicated trigonometric geometry workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 10)!;
    const html = renderToStaticMarkup(
      <CalculatorLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );
    expect(html).toContain('data-testid="calculator-mockup-0010"');
    expect(html).toContain('data-dedicated-lesson="10"');
    expect(html).toContain('data-object-model="dual-draggable-unit-circle-special-angle-triangle-mode-trace-practice-model"');
    expect(html).toContain('data-sin-angle="30"');
    expect(html).toContain('data-cos-angle="60"');
    expect(html).toContain('data-mode="DEG"');
    expect(html).toContain('data-output="1"');
    expect(html).toContain('aria-label="Sine angle drag control"');
    expect(html).toContain('aria-label="Trigonometric practice answer"');
  });
  it("renders calculator lessons 1 through 18 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      1: "Order rule",
      2: "Never add denominators directly",
      3: "Convert before you calculate",
      4: "Visual model: 15% of 240",
      5: "Ratio Lab: Simplify and compare 24:36",
      6: "Visual model for",
      7: "Scientific Notation Scale Lab",
      8: "A logarithm asks for an exponent",
      9: "Exponential Growth Lab",
      10: "Special-angle lab",
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
      5: "COMMON FACTOR",
      6: "Roots undo powers",
      7: "Powers of Ten Ladder",
      8: "log reverses exponentiation",
      9: "Repeated multiplication",
      10: "Concept trace",
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

      if (id > 9) expect(html, lesson.title).toContain("Concept trace");
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Calculator concept trace");
    }
  });
});
