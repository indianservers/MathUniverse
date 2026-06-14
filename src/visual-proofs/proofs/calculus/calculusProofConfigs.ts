import type { ProofStep, VisualProofComponentKey } from "../../data/proofTypes";
import type { FunctionId, RiemannMethod } from "../../utils/calculusMath";

export type CalculusProofKind = Extract<
  VisualProofComponentKey,
  | "LimitApproachesPointProof"
  | "DerivativeSlopeOfTangentProof"
  | "SecantBecomesTangentProof"
  | "DerivativePowerRuleProof"
  | "ProductRuleVisualProof"
  | "ChainRuleVisualProof"
  | "MeanValueTheoremProof"
  | "RiemannSumsAreaUnderCurveProof"
  | "DefiniteIntegralAccumulatedAreaProof"
  | "FundamentalTheoremCalculusProof"
  | "IntegrationByPartsVisualProof"
  | "DerivativeOfSineProof"
  | "DerivativeOfExponentialProof"
  | "TaylorSeriesApproximationProof"
  | "OptimizationDerivativeMaxMinProof"
>;

export type CalculusParameterKey = "x" | "a" | "b" | "h" | "n" | "order" | "u" | "v" | "du" | "dv";

export type CalculusVisual = "limit" | "derivative" | "rule" | "mvt" | "riemann" | "accumulation" | "parts" | "taylor" | "optimization";

export type CalculusProofConfig = {
  kind: CalculusProofKind;
  visual: CalculusVisual;
  defaultFunction: FunctionId;
  functionOptions?: FunctionId[];
  riemannMethod?: RiemannMethod;
  parameters: { key: CalculusParameterKey; label: string; min: number; max: number; defaultValue: number; step?: number }[];
  steps: ProofStep[];
  formulas: string[];
  notes: string;
  questions: string[];
  toggles?: string[];
};

const functionOptions: FunctionId[] = ["square", "cube", "sin", "cos", "exp", "ln", "reciprocal", "quadratic", "sinLinear", "gaussian"];
const xSlider = { key: "x" as const, label: "x", min: -3, max: 3, defaultValue: 1, step: 0.1 };
const aSlider = { key: "a" as const, label: "a", min: -3, max: 2, defaultValue: -1, step: 0.1 };
const bSlider = { key: "b" as const, label: "b", min: -2, max: 4, defaultValue: 2, step: 0.1 };
const hSlider = { key: "h" as const, label: "h or delta x", min: 0.05, max: 2, defaultValue: 1, step: 0.05 };

const steps = (items: string[]): ProofStep[] => items.map((item, index) => ({ id: `step-${index + 1}`, title: item, description: item, focusLabel: item.toLowerCase() }));

export const calculusProofConfigs: Record<CalculusProofKind, CalculusProofConfig> = {
  LimitApproachesPointProof: {
    kind: "LimitApproachesPointProof", visual: "limit", defaultFunction: "quadratic", functionOptions, parameters: [xSlider, hSlider],
    steps: steps(["Show function graph", "Mark x = a", "Move from the left", "Move from the right", "Show y-values approaching L", "Show limit notation", "Discuss removable behavior"]),
    formulas: ["As x approaches a, f(x) approaches L", "lim x->a f(x) = L"],
    notes: "A limit is about approaching behavior, not necessarily the value at the point.", questions: ["What do both sides approach?", "Does f(a) need to equal L?", "What happens as h gets smaller?"], toggles: ["Show grid", "Show approach points", "Show value table"],
  },
  DerivativeSlopeOfTangentProof: {
    kind: "DerivativeSlopeOfTangentProof", visual: "derivative", defaultFunction: "square", functionOptions, parameters: [xSlider, hSlider],
    steps: steps(["Show graph and point A", "Add point B at a+h", "Draw secant line", "Show slope triangle", "Shrink h", "Secant approaches tangent", "Show derivative formula"]),
    formulas: ["Secant slope = [f(a+h)-f(a)] / h", "f'(a) = lim h->0 [f(a+h)-f(a)] / h"],
    notes: "The derivative is the limiting slope of secants through nearby points.", questions: ["What is changing as h shrinks?", "Which line is the tangent?", "How close is the secant slope?"], toggles: ["Show grid", "Show slope triangle", "Show tangent"],
  },
  SecantBecomesTangentProof: {
    kind: "SecantBecomesTangentProof", visual: "derivative", defaultFunction: "cube", functionOptions, parameters: [xSlider, hSlider],
    steps: steps(["Show curve", "Show wide secant", "Reduce h", "Show sequence of secants", "Highlight limiting tangent", "Show slope convergence"]),
    formulas: ["m_h = [f(a+h)-f(a)] / h", "As h -> 0, m_h -> f'(a)"],
    notes: "A tangent line is the limiting position of secant lines.", questions: ["Which secant is closest?", "What happens to slope values?", "Why is the tangent a limit?"], toggles: ["Show grid", "Show secant trail", "Show tangent"],
  },
  DerivativePowerRuleProof: {
    kind: "DerivativePowerRuleProof", visual: "rule", defaultFunction: "square", parameters: [{ key: "n", label: "power n", min: 1, max: 6, defaultValue: 3, step: 1 }, xSlider, hSlider],
    steps: steps(["Select power n", "Show graph y = x^n", "Show difference quotient", "Expand first-order term", "Cancel h", "Let h approach 0", "Show nx^(n-1)"]),
    formulas: ["f'(x) = lim h->0 [(x+h)^n - x^n] / h", "Only first-order h survives", "d/dx[x^n] = nx^(n-1)"],
    notes: "After dividing by h, terms still containing h vanish in the limit.", questions: ["Which term survives?", "What does n become?", "How does h disappear?"], toggles: ["Show grid", "Show tangent", "Show expansion"],
  },
  ProductRuleVisualProof: {
    kind: "ProductRuleVisualProof", visual: "rule", defaultFunction: "square", parameters: [{ key: "u", label: "u", min: 1, max: 6, defaultValue: 4, step: 0.5 }, { key: "v", label: "v", min: 1, max: 5, defaultValue: 3, step: 0.5 }, { key: "du", label: "delta u", min: 0.1, max: 2, defaultValue: 0.8, step: 0.1 }, { key: "dv", label: "delta v", min: 0.1, max: 2, defaultValue: 0.6, step: 0.1 }],
    steps: steps(["Show rectangle area uv", "Increase width by du", "Increase height by dv", "Highlight added strips", "Highlight tiny corner", "Shrink changes", "Show product rule"]),
    formulas: ["Delta(uv) = v Delta u + u Delta v + Delta u Delta v", "d(uv) = vdu + udv", "(uv)' = u'v + uv'"],
    notes: "The tiny corner is second order, so it disappears in the differential limit.", questions: ["Which strip is vdu?", "Which strip is udv?", "Why does the corner vanish?"], toggles: ["Show tiny corner", "Show labels"],
  },
  ChainRuleVisualProof: {
    kind: "ChainRuleVisualProof", visual: "rule", defaultFunction: "sin", parameters: [xSlider, { key: "h", label: "dx", min: 0.02, max: 1, defaultValue: 0.3, step: 0.02 }],
    steps: steps(["Show input x", "Apply u = g(x)", "Apply y = f(u)", "Show dx causing du", "Show du causing dy", "Combine rates", "Show chain rule"]),
    formulas: ["dy/dx = dy/du x du/dx", "If y = sin(x^2), dy/dx = 2x cos(x^2)"],
    notes: "A composite function changes through two linked stages.", questions: ["What is the middle variable?", "Which rate comes first?", "Why multiply rates?"], toggles: ["Show rate arrows", "Show graph view"],
  },
  MeanValueTheoremProof: {
    kind: "MeanValueTheoremProof", visual: "mvt", defaultFunction: "quadratic", functionOptions, parameters: [aSlider, bSlider, xSlider],
    steps: steps(["Show curve on interval", "Mark endpoints", "Draw secant line", "Slide tangent", "Find parallel tangent", "Show equal slopes"]),
    formulas: ["Average rate = [f(b)-f(a)]/(b-a)", "There exists c with f'(c) = [f(b)-f(a)]/(b-a)"],
    notes: "The theorem links average change over an interval to instantaneous change inside it.", questions: ["Where is the secant slope?", "Where is tangent parallel?", "Why need continuity?"], toggles: ["Show grid", "Show secant", "Show tangent"],
  },
  RiemannSumsAreaUnderCurveProof: {
    kind: "RiemannSumsAreaUnderCurveProof", visual: "riemann", defaultFunction: "square", functionOptions, parameters: [aSlider, bSlider, { key: "n", label: "rectangles n", min: 2, max: 30, defaultValue: 8, step: 1 }],
    steps: steps(["Show curve and interval", "Divide interval", "Show rectangles", "Increase n", "Approximation improves", "Show limit as n grows", "Show integral notation"]),
    formulas: ["Delta x = (b-a)/n", "Approx area = sum f(x_i*) Delta x", "Integral = lim n->infinity sum f(x_i*) Delta x"],
    notes: "Riemann sums approximate area by many thin rectangles.", questions: ["What happens when n increases?", "What is Delta x?", "Which height is sampled?"], toggles: ["Show grid", "Show rectangles", "Show approximate area"],
  },
  DefiniteIntegralAccumulatedAreaProof: {
    kind: "DefiniteIntegralAccumulatedAreaProof", visual: "accumulation", defaultFunction: "sinLinear", functionOptions, parameters: [aSlider, { key: "x", label: "endpoint x", min: -2, max: 4, defaultValue: 2, step: 0.1 }],
    steps: steps(["Show curve", "Fix starting point a", "Move endpoint x", "Shade area", "Show accumulated A(x)", "Show signed areas", "Connect to integral"]),
    formulas: ["A(x) = integral from a to x of f(t) dt", "Positive area adds; negative area subtracts."],
    notes: "A definite integral is signed accumulated area.", questions: ["Where does area start?", "What if curve is below the axis?", "How does A(x) change?"], toggles: ["Show grid", "Show signed area", "Show value table"],
  },
  FundamentalTheoremCalculusProof: {
    kind: "FundamentalTheoremCalculusProof", visual: "accumulation", defaultFunction: "quadratic", functionOptions, parameters: [aSlider, xSlider, hSlider],
    steps: steps(["Show f(x)", "Define area function A(x)", "Move x and accumulate area", "Trace A(x)", "Show small added area", "Divide by delta x", "Show A'(x)=f(x)"]),
    formulas: ["A(x+h)-A(x) approx f(x)h", "[A(x+h)-A(x)]/h approx f(x)", "As h -> 0: A'(x)=f(x)"],
    notes: "The slope of the accumulation function equals the original function height.", questions: ["What is the small added rectangle?", "Why divide by h?", "What happens as h shrinks?"], toggles: ["Show grid", "Show A(x) graph", "Show small rectangle"],
  },
  IntegrationByPartsVisualProof: {
    kind: "IntegrationByPartsVisualProof", visual: "parts", defaultFunction: "exp", parameters: [{ key: "u", label: "u", min: 1, max: 6, defaultValue: 4, step: 0.5 }, { key: "v", label: "v", min: 1, max: 5, defaultValue: 3, step: 0.5 }, { key: "du", label: "du", min: 0.1, max: 2, defaultValue: 0.8, step: 0.1 }, { key: "dv", label: "dv", min: 0.1, max: 2, defaultValue: 0.6, step: 0.1 }],
    steps: steps(["Show product rectangle uv", "Show product rule", "Integrate both sides", "Rearrange", "Show balance", "Show formula"]),
    formulas: ["d(uv)=u dv + v du", "uv = integral u dv + integral v du", "integral u dv = uv - integral v du"],
    notes: "Integration by parts is the product rule rearranged.", questions: ["Which area is uv?", "Which integral is subtracted?", "How does product rule appear?"], toggles: ["Show product rule derivation", "Show area balance"],
  },
  DerivativeOfSineProof: {
    kind: "DerivativeOfSineProof", visual: "derivative", defaultFunction: "sin", parameters: [xSlider, hSlider],
    steps: steps(["Show sine graph", "Mark point x", "Draw tangent", "Show tangent slope", "Show cos x value", "Move x and compare", "Show derivative identity"]),
    formulas: ["d/dx[sin x] = cos x", "Tangent slope at x equals cos x"],
    notes: "The instantaneous rate of vertical coordinate on the unit circle is cos x.", questions: ["Where is slope zero?", "Where is cos x zero?", "How do signs match?"], toggles: ["Show grid", "Show tangent", "Show cosine comparison"],
  },
  DerivativeOfExponentialProof: {
    kind: "DerivativeOfExponentialProof", visual: "derivative", defaultFunction: "exp", parameters: [xSlider, hSlider],
    steps: steps(["Show graph e^x", "Pick point x", "Show y-value", "Draw tangent", "Show tangent slope", "Compare slope and value", "Show derivative identity"]),
    formulas: ["For f(x)=e^x, f'(x)=e^x", "Value = slope"],
    notes: "The natural exponential is its own derivative.", questions: ["How does slope compare to height?", "What happens for negative x?", "Why is e special?"], toggles: ["Show grid", "Show tangent", "Show slope triangle"],
  },
  TaylorSeriesApproximationProof: {
    kind: "TaylorSeriesApproximationProof", visual: "taylor", defaultFunction: "sin", functionOptions: ["sin", "cos", "exp"], parameters: [{ key: "order", label: "Taylor order", min: 0, max: 8, defaultValue: 3, step: 1 }, xSlider],
    steps: steps(["Show original function", "Show constant approximation", "Show tangent approximation", "Show quadratic approximation", "Add higher-order terms", "Compare error", "Show local accuracy"]),
    formulas: ["f(x) approx sum k=0..n f^(k)(a)(x-a)^k/k!", "sin x approx x - x^3/3! + x^5/5! - ...", "e^x approx 1 + x + x^2/2! + ..."],
    notes: "Taylor polynomials match more derivatives at the center as order increases.", questions: ["Where is approximation best?", "What changes with order?", "How does error behave?"], toggles: ["Show grid", "Show error graph", "Show term list"],
  },
  OptimizationDerivativeMaxMinProof: {
    kind: "OptimizationDerivativeMaxMinProof", visual: "optimization", defaultFunction: "quadratic", functionOptions: ["quadratic", "cube", "sin"], parameters: [xSlider],
    steps: steps(["Show function graph", "Move point along curve", "Show tangent slope", "Find where slope is zero", "Mark local maximum", "Mark local minimum", "Show derivative sign changes"]),
    formulas: ["Critical point condition: f'(x)=0", "Maximum: slope changes positive to negative", "Minimum: slope changes negative to positive"],
    notes: "Extrema occur where the tangent is horizontal or the derivative is undefined.", questions: ["Where is slope zero?", "Is it max or min?", "How does derivative sign change?"], toggles: ["Show grid", "Show derivative graph", "Show critical markers"],
  },
};
