import type { FinanceLessonMode } from "../presets/financeLessonPresets";

export type FinanceInputs = { a: number; b: number; c: number };
export type FinanceControl = {
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
};
export type FinancePoint = { x: number; y: number; label: string };
export type FinanceConceptModel = {
  label: string;
  value: number;
  display: string;
  secondary: string;
  formula: string;
  summary: string;
  prompt: string;
  expected: string;
  hint: string;
  points: FinancePoint[];
  rows: { label: string; value: string }[];
};
export type FinanceConceptConfig = {
  controls: [FinanceControl, FinanceControl, FinanceControl];
  defaults: FinanceInputs;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
const percent = (value: number) => `${value.toFixed(2)}%`;
const numeric = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);
const row = (label: string, value: string) => ({ label, value });
const point = (x: number, y: number, label = String(x)) => ({ x, y, label });

const moneyControl = (label: string, valueMax = 100_000): FinanceControl => ({
  label,
  min: 100,
  max: valueMax,
  step: 100,
  unit: " ₹",
});
const rateControl = (label = "Annual rate"): FinanceControl => ({
  label,
  min: 0,
  max: 25,
  step: 0.25,
  unit: "%",
});
const periodControl = (label = "Years"): FinanceControl => ({
  label,
  min: 1,
  max: 20,
  step: 1,
});

export const financeConceptConfigs: Record<
  Exclude<FinanceLessonMode, "simple-interest">,
  FinanceConceptConfig
> = {
  "compound-interest": {
    controls: [
      moneyControl("Principal"),
      rateControl(),
      { label: "Compounds / year", min: 1, max: 12, step: 1 },
    ],
    defaults: { a: 10_000, b: 8, c: 4 },
  },
  "effective-rate": {
    controls: [
      rateControl("Nominal annual rate"),
      { label: "Compounds / year", min: 1, max: 365, step: 1 },
      periodControl("Comparison years"),
    ],
    defaults: { a: 12, b: 12, c: 5 },
  },
  "present-value": {
    controls: [moneyControl("Future cash flow"), rateControl("Discount rate"), periodControl()],
    defaults: { a: 25_000, b: 7, c: 5 },
  },
  "future-value": {
    controls: [moneyControl("Present investment"), rateControl(), periodControl()],
    defaults: { a: 15_000, b: 7, c: 8 },
  },
  annuity: {
    controls: [
      moneyControl("Regular yearly payment", 20_000),
      rateControl(),
      periodControl("Number of payments"),
    ],
    defaults: { a: 5_000, b: 6, c: 10 },
  },
  "loan-emi": {
    controls: [moneyControl("Loan principal", 2_000_000), rateControl(), periodControl("Loan term (years)")],
    defaults: { a: 500_000, b: 9, c: 5 },
  },
  amortisation: {
    controls: [moneyControl("Loan principal", 2_000_000), rateControl(), periodControl("Loan term (years)")],
    defaults: { a: 500_000, b: 9, c: 5 },
  },
  depreciation: {
    controls: [moneyControl("Asset cost", 1_000_000), rateControl("Depreciation rate"), periodControl()],
    defaults: { a: 100_000, b: 15, c: 5 },
  },
  inflation: {
    controls: [moneyControl("Price today"), rateControl("Inflation rate"), periodControl()],
    defaults: { a: 2_000, b: 6, c: 8 },
  },
  currency: {
    controls: [
      moneyControl("Source amount"),
      { label: "Exchange rate", min: 0.001, max: 120, step: 0.001 },
      { label: "Conversion fee", min: 0, max: 5, step: 0.1, unit: "%" },
    ],
    defaults: { a: 10_000, b: 0.012, c: 1.5 },
  },
  "profit-margin": {
    controls: [moneyControl("Unit cost", 20_000), moneyControl("Selling price", 30_000), { label: "Units sold", min: 1, max: 100, step: 1 }],
    defaults: { a: 800, b: 1_100, c: 20 },
  },
  "break-even": {
    controls: [moneyControl("Fixed cost", 500_000), moneyControl("Variable cost / unit", 10_000), moneyControl("Price / unit", 20_000)],
    defaults: { a: 50_000, b: 400, c: 900 },
  },
  "tax-discount": {
    controls: [moneyControl("Marked price"), rateControl("Discount"), rateControl("Tax")],
    defaults: { a: 10_000, b: 15, c: 18 },
  },
  "investment-comparison": {
    controls: [moneyControl("Starting amount"), rateControl("Plan A rate"), rateControl("Plan B rate")],
    defaults: { a: 20_000, b: 6, c: 8 },
  },
  "model-builder": {
    controls: [moneyControl("Starting value"), { label: "Change per step", min: -500, max: 2_000, step: 50 }, { label: "Steps", min: 0, max: 20, step: 1 }],
    defaults: { a: 5_000, b: 400, c: 8 },
  },
  linear: {
    controls: [moneyControl("Fixed amount"), { label: "Constant change", min: -1_000, max: 2_000, step: 50 }, { label: "Time", min: 0, max: 20, step: 1 }],
    defaults: { a: 4_000, b: 600, c: 10 },
  },
  quadratic: {
    controls: [
      { label: "Quadratic coefficient a", min: -20, max: 20, step: 1 },
      { label: "Linear coefficient b", min: -100, max: 100, step: 5 },
      { label: "Input x", min: -20, max: 20, step: 1 },
    ],
    defaults: { a: -5, b: 60, c: 6 },
  },
  "exponential-logistic": {
    controls: [moneyControl("Initial value"), rateControl("Growth rate"), moneyControl("Capacity", 500_000)],
    defaults: { a: 10_000, b: 12, c: 100_000 },
  },
  periodic: {
    controls: [moneyControl("Seasonal baseline"), moneyControl("Amplitude", 20_000), { label: "Month", min: 0, max: 12, step: 1 }],
    defaults: { a: 10_000, b: 3_000, c: 3 },
  },
  piecewise: {
    controls: [moneyControl("Base unit rate", 10_000), { label: "Threshold units", min: 1, max: 100, step: 1 }, { label: "Usage", min: 0, max: 150, step: 1 }],
    defaults: { a: 100, b: 50, c: 80 },
  },
  "parameter-estimation": {
    controls: [
      { label: "Intercept estimate", min: -20, max: 40, step: 1 },
      { label: "Slope estimate", min: -5, max: 10, step: 0.25 },
      { label: "Observed y at x=5", min: -20, max: 100, step: 1 },
    ],
    defaults: { a: 10, b: 4, c: 32 },
  },
  "dimensional-analysis": {
    controls: [
      { label: "Rate (₹ / item)", min: 1, max: 1_000, step: 1 },
      { label: "Quantity (items)", min: 1, max: 100, step: 1 },
      { label: "Scale factor", min: 0.1, max: 10, step: 0.1 },
    ],
    defaults: { a: 250, b: 12, c: 1 },
  },
  sensitivity: {
    controls: [moneyControl("Principal"), rateControl("Base rate"), { label: "Rate change", min: -5, max: 5, step: 0.25, unit: "%" }],
    defaults: { a: 20_000, b: 8, c: 1 },
  },
  residual: {
    controls: [
      { label: "Model intercept", min: -20, max: 40, step: 1 },
      { label: "Model slope", min: -5, max: 10, step: 0.25 },
      { label: "Observed value at x=5", min: -20, max: 100, step: 1 },
    ],
    defaults: { a: 8, b: 5, c: 30 },
  },
  scenario: {
    controls: [moneyControl("Starting amount"), rateControl(), periodControl()],
    defaults: { a: 25_000, b: 8, c: 10 },
  },
  "linear-programming": {
    controls: [
      { label: "Profit per X", min: 1, max: 100, step: 1 },
      { label: "Profit per Y", min: 1, max: 100, step: 1 },
      { label: "Resource limit", min: 4, max: 60, step: 1 },
    ],
    defaults: { a: 30, b: 45, c: 20 },
  },
};

export function deriveFinanceConceptModel(
  mode: Exclude<FinanceLessonMode, "simple-interest">,
  input: FinanceInputs,
): FinanceConceptModel {
  const { a, b, c } = input;
  const r = b / 100;
  const make = (
    label: string,
    value: number,
    display: string,
    secondary: string,
    formula: string,
    prompt: string,
    hint: string,
    points: FinancePoint[],
    rows: FinanceConceptModel["rows"],
    summary = `${label} is ${display}. ${secondary}`,
  ): FinanceConceptModel => ({
    label,
    value,
    display,
    secondary,
    formula,
    summary,
    prompt,
    expected: value.toFixed(2),
    hint,
    points,
    rows,
  });

  if (mode === "compound-interest") {
    const years = 5;
    const amount = a * (1 + r / c) ** (c * years);
    const points = timeline(years, (year) => a * (1 + r / c) ** (c * year));
    return make("Balance after 5 years", amount, money(amount), `Interest earned ${money(amount - a)}`, "A = P(1 + r/n)ⁿᵗ", "What is the displayed compound balance after 5 years?", "Use the active compounding frequency.", points, points.map((p) => row(`Year ${p.x}`, money(p.y))));
  }
  if (mode === "effective-rate") {
    const nominal = a / 100;
    const frequency = Math.max(1, Math.round(b));
    const ear = ((1 + nominal / frequency) ** frequency - 1) * 100;
    const points = timeline(Math.round(c), (year) => 100 * (1 + ear / 100) ** year);
    return make("Effective annual rate", ear, percent(ear), `Nominal ${percent(a)} compounded ${frequency}×`, "EAR = (1 + j/m)ᵐ − 1", "What effective annual percentage rate is displayed?", "Convert the nominal rate using the selected frequency.", points, [row("Nominal rate", percent(a)), row("Effective rate", percent(ear))]);
  }
  if (mode === "present-value") {
    const value = a / (1 + r) ** c;
    const points = timeline(Math.round(c), (year) => a / (1 + r) ** (c - year));
    return make("Present value", value, money(value), `Discount ${money(a - value)}`, "PV = FV/(1+r)ᵗ", "What present value is shown?", "Discount the future cash flow back to time zero.", points, [row("Future cash flow", money(a)), row("Present value", money(value))]);
  }
  if (mode === "future-value") {
    const value = a * (1 + r) ** c;
    const points = timeline(Math.round(c), (year) => a * (1 + r) ** year);
    return make("Future value", value, money(value), `Growth ${money(value - a)}`, "FV = PV(1+r)ᵗ", "What future value is shown?", "Accumulate the present value for the selected years.", points, points.map((p) => row(`Year ${p.x}`, money(p.y))));
  }
  if (mode === "annuity") {
    const value = r === 0 ? a * c : a * (((1 + r) ** c - 1) / r);
    const points = timeline(Math.round(c), (period) => r === 0 ? a * period : a * (((1 + r) ** period - 1) / r));
    return make("Annuity future value", value, money(value), `Contributions ${money(a * c)}`, "FV = PMT((1+r)ⁿ−1)/r", "What accumulated annuity value is displayed?", "Use the ordinary-annuity accumulation factor.", points, points.map((p) => row(`Payment ${p.x}`, money(p.y))));
  }
  if (mode === "loan-emi" || mode === "amortisation") {
    const months = Math.max(1, Math.round(c * 12));
    const monthlyRate = r / 12;
    const emi = payment(a, monthlyRate, months);
    const schedule = loanSchedule(a, monthlyRate, months, emi);
    const shown = mode === "loan-emi" ? emi : schedule[Math.min(11, schedule.length - 1)].balance;
    const label = mode === "loan-emi" ? "Monthly EMI" : "Balance after 12 payments";
    const display = money(shown);
    const secondary = mode === "loan-emi"
      ? `Total interest ${money(emi * months - a)}`
      : `Monthly payment ${money(emi)}`;
    const points = schedule.filter((_, index) => index % Math.max(1, Math.floor(months / 12)) === 0).map((item) => point(item.period, item.balance, String(item.period)));
    return make(label, shown, display, secondary, mode === "loan-emi" ? "EMI = Pr(1+r)ⁿ/((1+r)ⁿ−1)" : "Closing = Opening + Interest − Payment", `What ${mode === "loan-emi" ? "monthly EMI" : "remaining balance after 12 payments"} is displayed?`, "Use the active loan schedule.", points, schedule.slice(0, 12).map((item) => row(`Month ${item.period}`, `${money(item.principal)} principal · ${money(item.interest)} interest`)));
  }
  if (mode === "depreciation") {
    const reducing = a * (1 - r) ** c;
    const straight = Math.max(0, a * (1 - r * c));
    const points = timeline(Math.round(c), (year) => a * (1 - r) ** year);
    return make("Reducing-balance value", reducing, money(reducing), `Straight-line comparison ${money(straight)}`, "V = P(1−r)ᵗ", "What reducing-balance asset value is displayed?", "Apply the depreciation factor once per year.", points, points.map((p) => row(`Year ${p.x}`, money(p.y))));
  }
  if (mode === "inflation") {
    const futurePrice = a * (1 + r) ** c;
    const purchasingPower = a / (1 + r) ** c;
    const points = timeline(Math.round(c), (year) => a * (1 + r) ** year);
    return make("Inflated future price", futurePrice, money(futurePrice), `₹${a.toFixed(0)} purchasing power becomes ${money(purchasingPower)}`, "Priceₜ = Price₀(1+i)ᵗ", "What future price is displayed?", "Apply the inflation factor for each year.", points, points.map((p) => row(`Year ${p.x}`, money(p.y))));
  }
  if (mode === "currency") {
    const gross = a * b;
    const converted = gross * (1 - c / 100);
    return make("Converted amount after fee", converted, numeric(converted), `Gross ${numeric(gross)} · fee ${numeric(gross - converted)}`, "Target = Source × rate × (1−fee)", "What converted amount after fees is displayed?", "Multiply by the exchange rate, then subtract the fee.", [point(0, a, "Source"), point(1, converted, "Target")], [row("Gross conversion", numeric(gross)), row("After fee", numeric(converted))]);
  }
  if (mode === "profit-margin") {
    const profit = (b - a) * c;
    const markup = a === 0 ? 0 : ((b - a) / a) * 100;
    const margin = b === 0 ? 0 : ((b - a) / b) * 100;
    return make("Total profit", profit, money(profit), `Markup ${percent(markup)} · margin ${percent(margin)}`, "Profit = (SP−CP)×quantity", "What total profit is displayed?", "Profit per unit is selling price minus cost.", [point(0, a * c, "Cost"), point(1, b * c, "Revenue")], [row("Markup", percent(markup)), row("Margin", percent(margin))]);
  }
  if (mode === "break-even") {
    const contribution = c - b;
    const units = contribution <= 0 ? 0 : Math.ceil(a / contribution);
    const points = [0, units, Math.max(1, units * 2)].map((x) => point(x, a + b * x, String(x)));
    return make("Break-even units", units, numeric(units), contribution <= 0 ? "Price must exceed variable cost" : `Break-even revenue ${money(c * units)}`, "q = Fixed cost/(Price−Variable cost)", "How many whole units are required to break even?", "Divide fixed cost by contribution per unit and round up.", points, [row("Contribution / unit", money(contribution)), row("Break-even quantity", numeric(units))]);
  }
  if (mode === "tax-discount") {
    const discounted = a * (1 - b / 100);
    const finalPrice = discounted * (1 + c / 100);
    return make("Final price", finalPrice, money(finalPrice), `Discounted price ${money(discounted)}`, "Final = Marked(1−d)(1+t)", "What final price after discount then tax is displayed?", "Apply the percentage changes sequentially.", [point(0, a, "Marked"), point(1, discounted, "Discount"), point(2, finalPrice, "Tax")], [row("Discount", money(a - discounted)), row("Tax", money(finalPrice - discounted))]);
  }
  if (mode === "investment-comparison") {
    const planA = a * (1 + b / 100) ** 5;
    const planB = a * (1 + c / 100) ** 5;
    const advantage = planB - planA;
    const points = timeline(5, (year) => a * (1 + b / 100) ** year);
    return make("Plan B advantage after 5 years", advantage, money(advantage), `A ${money(planA)} · B ${money(planB)}`, "Difference = P[(1+rB)ᵗ−(1+rA)ᵗ]", "What is Plan B's displayed advantage after 5 years?", "Compare both balances at the same time.", points, [row("Plan A", money(planA)), row("Plan B", money(planB))]);
  }
  if (mode === "model-builder" || mode === "linear") {
    const value = a + b * c;
    const points = timeline(Math.round(c), (x) => a + b * x);
    const noun = mode === "model-builder" ? "Built-model output" : "Linear-model output";
    return make(noun, value, money(value), `Constant change ${money(b)} per step`, "y = start + change·x", `What ${mode === "model-builder" ? "model output" : "linear output"} is displayed?`, "Substitute the selected step into the visible equation.", points, points.map((p) => row(`x=${p.x}`, money(p.y))));
  }
  if (mode === "quadratic") {
    const value = a * c * c + b * c;
    const vertexX = a === 0 ? 0 : -b / (2 * a);
    const points = Array.from({ length: 11 }, (_, index) => index - 5).map((x) => point(x, a * x * x + b * x, String(x)));
    return make("Quadratic output", value, numeric(value), `Axis of symmetry x=${numeric(vertexX)}`, "y = ax² + bx", "What quadratic output is displayed at the selected x?", "Substitute x into ax²+bx.", points, [row("Selected x", numeric(c)), row("Axis of symmetry", numeric(vertexX))]);
  }
  if (mode === "exponential-logistic") {
    const time = 5;
    const exponential = a * (1 + r) ** time;
    const capacity = Math.max(a + 1, c);
    const logistic = capacity / (1 + ((capacity - a) / a) * Math.exp(-r * time));
    const points = timeline(10, (x) => capacity / (1 + ((capacity - a) / a) * Math.exp(-r * x)));
    return make("Logistic value at t=5", logistic, money(logistic), `Unlimited exponential ${money(exponential)}`, "L(t)=K/[1+((K−P₀)/P₀)e⁻ʳᵗ]", "What constrained logistic value is displayed at t=5?", "Use the capacity-limited growth curve.", points, [row("Logistic", money(logistic)), row("Exponential", money(exponential))]);
  }
  if (mode === "periodic") {
    const value = a + b * Math.sin((2 * Math.PI * c) / 12);
    const points = Array.from({ length: 13 }, (_, month) => point(month, a + b * Math.sin((2 * Math.PI * month) / 12), String(month)));
    return make("Seasonal value", value, money(value), `Baseline ${money(a)} · amplitude ${money(b)}`, "y = baseline + amplitude·sin(2πm/12)", "What seasonal value is displayed for the selected month?", "Read the active point on the periodic curve.", points, points.map((p) => row(`Month ${p.x}`, money(p.y))));
  }
  if (mode === "piecewise") {
    const baseUnits = Math.min(c, b);
    const extraUnits = Math.max(0, c - b);
    const value = a * baseUnits + 1.5 * a * extraUnits;
    const points = [0, b, c].sort((x, y) => x - y).map((x) => point(x, a * Math.min(x, b) + 1.5 * a * Math.max(0, x - b), String(x)));
    return make("Piecewise charge", value, money(value), `${numeric(extraUnits)} units use the higher rate`, "C(x)=ax; then aT+1.5a(x−T)", "What piecewise charge is displayed?", "Split usage at the threshold.", points, [row("Base-rate units", numeric(baseUnits)), row("Higher-rate units", numeric(extraUnits))]);
  }
  if (mode === "parameter-estimation" || mode === "residual") {
    const prediction = a + 5 * b;
    const residual = c - prediction;
    const label = mode === "parameter-estimation" ? "Absolute fit error" : "Residual (observed − predicted)";
    const value = mode === "parameter-estimation" ? Math.abs(residual) : residual;
    return make(label, value, numeric(value), `Prediction ${numeric(prediction)} · observed ${numeric(c)}`, mode === "parameter-estimation" ? "|observed−(a+bx)|" : "e = y−ŷ", `What ${mode === "parameter-estimation" ? "absolute fit error" : "residual"} is displayed?`, "Compare the model prediction at x=5 with the observation.", [point(0, a, "Intercept"), point(5, prediction, "Prediction"), point(5, c, "Observed")], [row("Prediction", numeric(prediction)), row("Observed", numeric(c))]);
  }
  if (mode === "dimensional-analysis") {
    const value = a * b * c;
    return make("Unit-consistent total", value, money(value), `₹/item × items × scale = ₹`, "Total = unit rate × quantity × scale", "What unit-consistent total is displayed?", "Cancel item units before applying the scale.", [point(0, a, "Rate"), point(1, value, "Total")], [row("Units", "₹/item × items = ₹"), row("Scale factor", numeric(c))]);
  }
  if (mode === "sensitivity") {
    const baseline = a * (1 + r) ** 5;
    const changed = a * (1 + (b + c) / 100) ** 5;
    const difference = changed - baseline;
    return make("Output sensitivity", difference, money(difference), `Baseline ${money(baseline)} · changed ${money(changed)}`, "ΔFV = FV(r+Δr)−FV(r)", "What change in five-year output is displayed?", "Compare the baseline and perturbed assumptions.", [point(0, baseline, "Baseline"), point(1, changed, "Changed")], [row("Baseline", money(baseline)), row("Changed", money(changed))]);
  }
  if (mode === "scenario") {
    const simple = a * (1 + r * c);
    const compound = a * (1 + r) ** c;
    const difference = compound - simple;
    const points = timeline(Math.round(c), (year) => a * (1 + r) ** year);
    return make("Compound scenario advantage", difference, money(difference), `Simple ${money(simple)} · compound ${money(compound)}`, "Difference = compound amount − simple amount", "What compound-scenario advantage is displayed?", "Compare scenarios using identical assumptions.", points, [row("Simple scenario", money(simple)), row("Compound scenario", money(compound))]);
  }

  const limit = Math.max(1, Math.round(c));
  let bestX = 0;
  let bestY = 0;
  let bestProfit = 0;
  const feasible: FinancePoint[] = [];
  for (let x = 0; x <= limit; x += 1) {
    for (let y = 0; y <= limit; y += 1) {
      if (x + 2 * y <= limit && 3 * x + y <= 1.5 * limit) {
        feasible.push(point(x, y, `${x},${y}`));
        const profit = a * x + b * y;
        if (profit > bestProfit) {
          bestX = x;
          bestY = y;
          bestProfit = profit;
        }
      }
    }
  }
  return make("Maximum objective value", bestProfit, numeric(bestProfit), `Optimal point (${bestX}, ${bestY})`, "Maximise ax+by over the feasible region", "What maximum objective value is displayed?", "Test the objective at feasible corner points.", feasible, [row("Optimal x", String(bestX)), row("Optimal y", String(bestY))]);
}

function timeline(periods: number, fn: (period: number) => number) {
  return Array.from({ length: Math.max(1, periods) + 1 }, (_, period) =>
    point(period, fn(period), String(period)),
  );
}

function payment(principal: number, rate: number, periods: number) {
  return rate === 0
    ? principal / periods
    : (principal * rate * (1 + rate) ** periods) /
        ((1 + rate) ** periods - 1);
}

function loanSchedule(
  principal: number,
  rate: number,
  periods: number,
  instalment: number,
) {
  let balance = principal;
  return Array.from({ length: periods }, (_, index) => {
    const interest = balance * rate;
    const principalPaid = Math.min(balance, instalment - interest);
    balance = Math.max(0, balance - principalPaid);
    return {
      period: index + 1,
      interest,
      principal: principalPaid,
      balance,
    };
  });
}
