import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import CalculatorLessonAdapter from "./CalculatorLessonAdapter";

describe("CalculatorLessonAdapter", () => {
  it("renders calculator lessons 1 through 18 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      1: "Order rule",
      2: "Fraction rule",
      3: "Mixed-number rule",
      4: "Percent rule",
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
        <CalculatorLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Calculator rule");
    }
  });

  it("renders phase 2 concept traces for calculator lessons 1 through 18", () => {
    const expectedTraces: Record<number, string> = {
      1: "Operation order stack",
      2: "Fraction common-parts trace",
      3: "Mixed to improper fraction",
      4: "Percent of base amount",
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
        <CalculatorLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain("Concept trace");
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Calculator concept trace");
    }
  });
});
