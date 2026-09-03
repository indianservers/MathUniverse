import AdapterFrame from "../components/AdapterFrame";
import {
  financeLessonPreset,
  type FinanceLessonMode,
} from "../presets/financeLessonPresets";
import type { LessonAdapterProps } from "../types";
import { FinanceConceptActivity } from "./finance/FinanceConceptActivity";
import AnnuitiesTargetLesson596 from "./finance/AnnuitiesTargetLesson596";
import CompoundInterestTargetLesson592 from "./finance/CompoundInterestTargetLesson592";
import EffectiveInterestRateTargetLesson593 from "./finance/EffectiveInterestRateTargetLesson593";
import FutureValueTargetLesson595 from "./finance/FutureValueTargetLesson595";
import PresentValueTargetLesson594 from "./finance/PresentValueTargetLesson594";
import SimpleInterestTargetLesson591 from "./finance/SimpleInterestTargetLesson591";
import { SimpleInterestActivity } from "./p0/PriorityConceptActivities";

function financeGuidanceFor(mode: FinanceLessonMode) {
  const guidance: Record<FinanceLessonMode, [string, string, string]> = {
    "simple-interest": [
      "Simple Interest",
      "Use I = Prt with r as a decimal.",
      "Interest is not added back to the principal.",
    ],
    "compound-interest": [
      "Compound Interest",
      "Use A = P(1 + r/n)^(nt).",
      "Interest can earn more interest.",
    ],
    "effective-rate": [
      "Effective Interest Rate",
      "Convert nominal rate to the true annual growth rate.",
      "Include compounding frequency.",
    ],
    "present-value": [
      "Present Value",
      "Discount a future cash flow back to today.",
      "Positive discount rates make future money worth less today.",
    ],
    "future-value": [
      "Future Value",
      "Move today's amount forward with a growth factor.",
      "Use the same time unit as the rate.",
    ],
    annuity: [
      "Annuities",
      "Add the value of regular equal payments.",
      "Payments happen across many periods.",
    ],
    "loan-emi": [
      "Loans and EMIs",
      "Convert annual rate to a monthly rate for monthly payments.",
      "Each EMI includes interest and principal.",
    ],
    amortisation: [
      "Amortisation Table",
      "Interest is based on the opening balance each period.",
      "The principal part changes as the balance changes.",
    ],
    depreciation: [
      "Depreciation",
      "Model value falling over time.",
      "Reducing-balance depreciation multiplies by 1 - r.",
    ],
    inflation: [
      "Inflation",
      "Model price rise over time.",
      "Nominal prices rise while purchasing power falls.",
    ],
    currency: [
      "Currency Conversion",
      "Check the exchange-rate direction before multiplying.",
      "Fees reduce the received amount.",
    ],
    "profit-margin": [
      "Profit, Loss, Markup and Margin",
      "Profit is selling price minus cost.",
      "Markup divides by cost; margin divides by selling price.",
    ],
    "break-even": [
      "Break-Even Analysis",
      "Set total revenue equal to total cost.",
      "Fixed cost must be recovered before profit begins.",
    ],
    "tax-discount": [
      "Tax and Discounts",
      "Apply each percent to the current base price.",
      "Discount lowers first when the problem states it first.",
    ],
    "investment-comparison": [
      "Investment Comparison",
      "Compare options under the same time and starting assumptions.",
      "A fair comparison uses like with like.",
    ],
    "model-builder": [
      "Model Builder",
      "Name variables, assumptions, and the rule.",
      "A model is a simplification, not the whole real world.",
    ],
    linear: [
      "Linear Models",
      "Use a constant rate of change.",
      "The graph is straight when the rate stays fixed.",
    ],
    quadratic: [
      "Quadratic Models",
      "Use a squared term for curved change.",
      "The graph is a parabola.",
    ],
    "exponential-logistic": [
      "Exponential and Logistic Models",
      "Exponential grows by a factor; logistic levels near a capacity.",
      "Check whether a real limit exists.",
    ],
    periodic: [
      "Periodic Models",
      "Use a repeating cycle with a fixed period.",
      "Do not treat cycles as only a trend.",
    ],
    piecewise: [
      "Piecewise Models",
      "Choose the rule after checking the input interval.",
      "Different intervals can use different formulas.",
    ],
    "parameter-estimation": [
      "Parameter Estimation",
      "Choose model parameters that fit observed data.",
      "Estimated models can still have residual error.",
    ],
    "dimensional-analysis": [
      "Dimensional Analysis",
      "Keep units attached and cancel them correctly.",
      "The final unit must match the question.",
    ],
    sensitivity: [
      "Sensitivity Analysis",
      "Change one assumption at a time.",
      "This shows which input affects the output most.",
    ],
    residual: [
      "Residual and Error Analysis",
      "Residual equals observed minus predicted.",
      "The sign shows overestimate or underestimate.",
    ],
    scenario: [
      "Scenario Comparison",
      "Compare base, best, and worst assumptions clearly.",
      "Keep shared assumptions visible.",
    ],
    "linear-programming": [
      "Linear Programming",
      "Optimise a linear objective over feasible points.",
      "Only points satisfying all constraints count.",
    ],
  };
  return guidance[mode];
}

export default function FinanceLessonAdapter(props: LessonAdapterProps) {
  const mode = financeLessonPreset(props.lesson.id).mode;
  const guidance = financeGuidanceFor(mode);
  if (props.lesson.id === 591)
    return <SimpleInterestTargetLesson591 {...props} />;
  if (props.lesson.id === 592)
    return <CompoundInterestTargetLesson592 {...props} />;
  if (props.lesson.id === 593)
    return <EffectiveInterestRateTargetLesson593 {...props} />;
  if (props.lesson.id === 594)
    return <PresentValueTargetLesson594 {...props} />;
  if (props.lesson.id === 595) return <FutureValueTargetLesson595 {...props} />;
  if (props.lesson.id === 596) return <AnnuitiesTargetLesson596 {...props} />;
  if (mode === "simple-interest") {
    return (
      <AdapterFrame
        title={`${props.lesson.title} · simple-interest model`}
        footer="The table and graph use I = P × r × t; no amortisation model is substituted."
      >
        <GuidancePanel guidance={guidance} />
        <SimpleInterestActivity {...props} />
      </AdapterFrame>
    );
  }
  return (
    <AdapterFrame
      title={`${props.lesson.title} · finance and modelling lab`}
      footer="The controls, linked chart, derived values, and Check challenge use this lesson's explicit finance preset."
    >
      <GuidancePanel guidance={guidance} />
      <FinanceConceptActivity mode={mode} {...props} />
    </AdapterFrame>
  );
}

function GuidancePanel({ guidance }: { guidance: [string, string, string] }) {
  return (
    <div className="mb-3 rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
      <p>{guidance[0]}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
        {guidance[1]}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
        {guidance[2]}
      </p>
    </div>
  );
}
