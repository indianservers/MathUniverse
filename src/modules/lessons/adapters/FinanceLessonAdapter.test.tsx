import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import FinanceLessonAdapter from "./FinanceLessonAdapter";

describe("FinanceLessonAdapter", () => {
  it("uses the dedicated simple-interest surface for lesson 591", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 591)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0648"');
    expect(html).toContain("dedicated-linear-simple-interest-model");
    expect(html).toContain('data-interest="3000"');
    expect(html).toContain('data-amount="13000"');
  });

  it("uses the dedicated compound-interest surface for lesson 592", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 592)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0649"');
    expect(html).toContain("dedicated-periodic-compound-growth-model");
    expect(html).toContain('data-amount="14693.28"');
  });

  it("uses the dedicated effective-rate surface for lesson 593", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 593)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0650"');
    expect(html).toContain("dedicated-effective-annual-rate-comparator");
    expect(html).toContain('data-ear="12.6825"');
  });

  it("renders all 27 finance routes with explicit controls and no legacy fallback", () => {
    const lessons = lessonCatalog.filter(
      (lesson) => lesson.adapter === "finance",
    );
    expect(lessons).toHaveLength(27);
    for (const lesson of lessons) {
      const html = renderToStaticMarkup(
        <FinanceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, String(lesson.id)).toContain(lesson.title);
      expect(html, String(lesson.id)).toMatch(
        /finance and modelling lab|simple-interest model|finance-mockup-0648|finance-mockup-0649|finance-mockup-0650/,
      );
      expect(html, String(lesson.id)).not.toContain("Legacy");
      expect(html, String(lesson.id)).toContain('type="range"');
    }
  });

  it("does not substitute an amortisation schedule for unrelated concepts", () => {
    for (const lessonId of [592, 593, 599, 601, 603, 610, 617]) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <FinanceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html).not.toContain("Annual payment");
      expect(html).not.toContain("Opening");
      expect(html).not.toContain("Closing");
    }
  });

  it("renders strengthened finance lessons with lesson-specific guidance", () => {
    const expected = new Map([
      [592, "Compound Interest"],
      [593, "Effective Interest Rate"],
      [594, "Present Value"],
      [595, "Future Value"],
      [596, "Annuities"],
      [597, "Loans and EMIs"],
      [598, "Amortisation Table"],
      [599, "Depreciation"],
      [600, "Inflation"],
      [601, "Currency Conversion"],
      [602, "Profit, Loss, Markup and Margin"],
      [603, "Break-Even Analysis"],
      [604, "Tax and Discounts"],
      [605, "Investment Comparison"],
      [606, "Model Builder"],
      [607, "Linear Models"],
      [608, "Quadratic Models"],
      [609, "Exponential and Logistic Models"],
      [610, "Periodic Models"],
      [611, "Piecewise Models"],
      [612, "Parameter Estimation"],
      [613, "Dimensional Analysis"],
      [614, "Sensitivity Analysis"],
      [615, "Residual and Error Analysis"],
      [616, "Scenario Comparison"],
      [617, "Linear Programming"],
    ]);
    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <FinanceLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, `lesson ${lessonId}`).toContain(snippet);
      expect(html, `lesson ${lessonId}`).toMatch(
        /finance-result|finance-mockup-0649|finance-mockup-0650/,
      );
    }
  });
});
