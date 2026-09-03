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

  it("uses the dedicated present-value surface for lesson 594", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 594)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0651"');
    expect(html).toContain("dedicated-discounted-cash-flow-model");
    expect(html).toContain('data-present="17824.65"');
  });

  it("uses the dedicated future-value surface for lesson 595", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 595)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0652"');
    expect(html).toContain("dedicated-compounded-future-value-goal-model");
    expect(html).toContain('data-future="25772.79"');
  });

  it("uses the dedicated annuities surface for lesson 596", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 596)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0653"');
    expect(html).toContain("dedicated-annuity-cash-flow-timeline-model");
    expect(html).toContain('data-fv="65903.97"');
    expect(html).toContain('data-pv="36800.44"');
  });

  it("uses the dedicated loans-and-EMIs surface for lesson 597", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 597)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0654"');
    expect(html).toContain("dedicated-monthly-amortizing-loan-model");
    expect(html).toContain('data-emi="10379.18"');
    expect(html).toContain('data-months="60"');
  });

  it("uses the dedicated amortisation-table surface for lesson 598", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 598)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0655"');
    expect(html).toContain(
      "dedicated-extra-payment-amortisation-schedule-model",
    );
    expect(html).toContain('data-emi="10379.18"');
    expect(html).toContain('data-payoff="60"');
    expect(html).toContain('data-month="12"');
  });

  it("uses the dedicated depreciation surface for lesson 599", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 599)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0656"');
    expect(html).toContain(
      "dedicated-straight-line-reducing-balance-depreciation-model",
    );
    expect(html).toContain('data-sl-end="0.00"');
    expect(html).toContain('data-rb-end="44370.53"');
  });

  it("uses the dedicated inflation surface for lesson 600", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 600)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0657"');
    expect(html).toContain(
      "dedicated-compound-inflation-purchasing-power-model",
    );
    expect(html).toContain('data-future="3187.70"');
  });

  it("uses the dedicated currency-conversion surface for lesson 601", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 601)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0658"');
    expect(html).toContain("dedicated-reciprocal-currency-rate-fee-model");
    expect(html).toContain('data-result="10010.40"');
  });

  it("uses the dedicated profit-markup-margin surface for lesson 602", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 602)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0659"');
    expect(html).toContain("dedicated-profit-markup-margin-pricing-model");
    expect(html).toContain('data-profit="300"');
    expect(html).toContain('data-markup="37.50"');
    expect(html).toContain('data-margin="27.27"');
  });

  it("uses the dedicated break-even surface for lesson 603", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 603)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0660"');
    expect(html).toContain(
      "dedicated-cost-revenue-break-even-intersection-model",
    );
    expect(html).toContain('data-revenue="90000"');
    expect(html).toContain('data-cost="90000"');
    expect(html).toContain('data-be="100.00"');
  });

  it("uses the dedicated tax-and-discount surface for lesson 604", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 604)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0661"');
    expect(html).toContain(
      "dedicated-sequential-discount-coupon-tax-receipt-model",
    );
    expect(html).toContain('data-subtotal="3450.00"');
    expect(html).toContain('data-final="3114.32"');
  });

  it("uses the dedicated investment-comparison surface for lesson 605", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 605)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0662"');
    expect(html).toContain(
      "dedicated-fee-adjusted-two-plan-compound-growth-model",
    );
    expect(html).toContain('data-final-a="25452.78"');
    expect(html).toContain('data-final-b="27946.33"');
    expect(html).toContain('data-points="6"');
  });

  it("uses the dedicated model-builder surface for lesson 606", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 606)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0663"');
    expect(html).toContain(
      "dedicated-editable-data-regression-prediction-model",
    );
    expect(html).toContain('data-a="800.0000"');
    expect(html).toContain('data-b="1000.0000"');
    expect(html).toContain('data-r2="1.0000"');
    expect(html).toContain('data-prediction="6600.00"');
  });

  it("uses the dedicated linear-model surface for lesson 607", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 607)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0664"');
    expect(html).toContain("dedicated-draggable-slope-intercept-linear-model");
    expect(html).toContain('data-slope="800"');
    expect(html).toContain('data-intercept="1000"');
    expect(html).toContain('data-output="9000"');
  });

  it("uses the dedicated quadratic-model surface for lesson 608", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 608)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0665"');
    expect(html).toContain(
      "dedicated-draggable-coefficient-vertex-roots-quadratic-model",
    );
    expect(html).toContain('data-a="-2"');
    expect(html).toContain('data-vertex-x="1.00"');
    expect(html).toContain('data-vertex-y="1.00"');
    expect(html).toContain('data-roots="0.29,1.71"');
  });

  it("uses the dedicated exponential-logistic surface for lesson 609", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 609)!;
    const html = renderToStaticMarkup(
      <FinanceLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="finance-mockup-0666"');
    expect(html).toContain(
      "dedicated-exponential-decay-logistic-saturation-model",
    );
    expect(html).toContain('data-kind="logistic"');
    expect(html).toContain('data-inflection="4.9937"');
    expect(html).toContain('data-rows="11"');
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
        /finance and modelling lab|simple-interest model|finance-mockup-0648|finance-mockup-0649|finance-mockup-0650|finance-mockup-0651|finance-mockup-0652|finance-mockup-0653|finance-mockup-0654|finance-mockup-0655|finance-mockup-0656|finance-mockup-0657|finance-mockup-0658|finance-mockup-0659|finance-mockup-0660|finance-mockup-0661|finance-mockup-0662|finance-mockup-0663|finance-mockup-0664|finance-mockup-0665|finance-mockup-0666/,
      );
      expect(html, String(lesson.id)).not.toContain("Legacy");
      expect(html, String(lesson.id)).toMatch(
        /type="range"|dedicated-editable-data-regression-prediction-model/,
      );
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
        /finance-result|finance-mockup-0649|finance-mockup-0650|finance-mockup-0651|finance-mockup-0652|finance-mockup-0653|finance-mockup-0654|finance-mockup-0655|finance-mockup-0656|finance-mockup-0657|finance-mockup-0658|finance-mockup-0659|finance-mockup-0660|finance-mockup-0661|finance-mockup-0662|finance-mockup-0663|finance-mockup-0664|finance-mockup-0665|finance-mockup-0666/,
      );
    }
  });
});
