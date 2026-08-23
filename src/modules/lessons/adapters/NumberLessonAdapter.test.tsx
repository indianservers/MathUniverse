import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import NumberLessonAdapter from "./NumberLessonAdapter";

describe("NumberLessonAdapter", () => {
  const lessonSpecificCases = [
    [57, "Natural Numbers", "Natural numbers start at 1"],
    [58, "Whole Numbers", "Whole numbers include zero"],
    [59, "Integers", "Farther right means greater"],
    [60, "Rational Numbers", "Rational numbers can be written as a/b"],
    [61, "Irrational Numbers", "Non-ending, non-repeating decimals are irrational"],
    [62, "Real Numbers", "Real numbers lie on the number line"],
    [63, "Complex Numbers", "real part and an imaginary part"],
    [64, "Place Value", "digit's place changes its value"],
    [65, "Factors", "Factors divide exactly"],
    [66, "Multiples", "Multiples are made by multiplying"],
    [67, "Prime Numbers", "Prime numbers have exactly two positive factors"],
    [68, "Prime Factorisation", "Keep splitting until all factors are prime"],
    [69, "HCF/GCD", "HCF is the greatest shared factor"],
    [70, "LCM", "LCM is the first shared positive multiple"],
    [71, "Divisibility Rules", "Use the rule for the chosen divisor only"],
    [72, "Modular Arithmetic", "Keep the remainder, not the quotient"],
    [73, "Base Systems", "Digits must be allowed in the chosen base"],
    [74, "Continued Fractions", "Evaluate nested fractions from inside outward"],
    [75, "Fraction Models", "Fraction models show selected parts of one whole"],
    [76, "Equivalent Fractions", "Scale numerator and denominator by the same non-zero factor"],
    [77, "Comparing Fractions", "Compare fractions using common units"],
    [78, "Fraction Operations", "Common denominators are needed for addition and subtraction"],
    [79, "Decimal Place Value", "Trailing zeros can help compare decimals"],
    [80, "Decimal Operations", "Line up decimal points for addition and subtraction"],
    [81, "Fraction-Decimal Conversion", "Divide numerator by denominator to get decimal form"],
    [82, "Recurring Decimals", "A repeating remainder creates a recurring decimal"],
    [83, "Ratio Models", "Ratio order matters"],
    [84, "Proportion", "Both ratios must scale by the same factor"],
    [85, "Direct Proportion", "Direct proportion has form y = kx"],
    [86, "Inverse Proportion", "Inverse proportion has constant product"],
    [87, "Unit Rates", "Divide by the number of units to find per one"],
    [88, "Percentages", "Percent means out of 100"],
    [89, "Percentage Change", "Use original amount as the base"],
    [90, "Compound Change", "Apply each percent change to the latest amount"],
    [91, "Scale Drawings", "Scale every length by the same factor"],
  ] as const;

  it.each(lessonSpecificCases)("renders %s with lesson-specific number visuals", (lessonId, title, snippet) => {
    const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
    const html = renderToStaticMarkup(
      <NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    ).replaceAll("&#x27;", "'");

    expect(html).toContain(title);
    expect(html).toContain(snippet);
    expect(html).not.toContain("Use the selected value to inspect number facts.");
  });

  it("renders phase 3 number concept traces for lessons 57 through 91", () => {
    const expectedTraces: Record<number, string> = {
      57: "Counting-number membership",
      58: "Whole-number membership",
      59: "Integer direction from zero",
      60: "Rational as ratio",
      61: "Irrational square-root check",
      62: "Real number-line placement",
      63: "Complex plane coordinates",
      64: "Place-value expansion",
      65: "Factor pair check",
      66: "Multiple skip-count list",
      67: "Prime factor-count test",
      68: "Prime factor tree",
      69: "Shared-factor intersection",
      70: "Shared-multiple ladder",
      71: "Divisibility rule audit",
      72: "Remainder clock",
      73: "Base-place conversion",
      74: "Nested-fraction layers",
      75: "Equal-parts fraction model",
      76: "Equivalent-fraction scaling",
      77: "Common-unit comparison",
      78: "Fraction-operation denominator check",
      79: "Decimal place-value alignment",
      80: "Decimal-operation columns",
      81: "Fraction-decimal bridge",
      82: "Recurring remainder loop",
      83: "Ratio order model",
      84: "Proportion equal-ratio check",
      85: "Direct proportion table",
      86: "Inverse proportion product",
      87: "Unit-rate per-one model",
      88: "Hundred-grid percent model",
      89: "Percentage-change baseline",
      90: "Compound-change stages",
      91: "Scale-factor drawing",
    };

    for (const [idText, snippet] of Object.entries(expectedTraces)) {
      const lesson = lessonCatalog.find((item) => item.id === Number(idText))!;
      const html = renderToStaticMarkup(
        <NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain("Concept trace");
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Number concept trace");
    }
  });
});
