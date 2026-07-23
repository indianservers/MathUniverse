import {
  arithmeticSum,
  arithmeticTerm,
  finiteGeometricSum,
  formatNumber,
  geometricTerm,
} from "../../../visual-proofs/utils/sequenceSeriesMath";
import type { SequenceLessonMode } from "../presets/sequenceLessonPresets";

export type SequenceInputs = { a: number; b: number; n: number };
export type SequenceControl = {
  label: string;
  min: number;
  max: number;
  step: number;
};
export type SequenceConceptConfig = {
  controls: [SequenceControl, SequenceControl, SequenceControl];
  defaults: SequenceInputs;
};
export type SequenceConceptModel = {
  label: string;
  value: number | string;
  display: string;
  formula: string;
  summary: string;
  prompt: string;
  expected: string;
  hint: string;
  challengeKind: "numeric" | "keywords";
  terms: number[];
  partialSums: number[];
  insight: string;
};

const control = (
  label: string,
  min: number,
  max: number,
  step = 1,
): SequenceControl => ({ label, min, max, step });

export const sequenceConceptConfigs: Record<
  SequenceLessonMode,
  SequenceConceptConfig
> = {
  generator: {
    controls: [
      control("Constant a", -10, 10),
      control("Quadratic coefficient b", -5, 5, 0.5),
      control("Visible terms", 3, 15),
    ],
    defaults: { a: 1, b: 1, n: 8 },
  },
  "arithmetic-sequence": {
    controls: [
      control("First term", -10, 20),
      control("Common difference", -10, 15),
      control("Term n", 2, 15),
    ],
    defaults: { a: 2, b: 3, n: 8 },
  },
  "geometric-sequence": {
    controls: [
      control("First term", -8, 12),
      control("Common ratio", -2, 2, 0.25),
      control("Term n", 2, 15),
    ],
    defaults: { a: 3, b: 0.5, n: 8 },
  },
  "recursive-sequence": {
    controls: [
      control("Initial term", -10, 20),
      control("Recurrence multiplier", -2, 2, 0.25),
      control("Visible terms", 3, 15),
    ],
    defaults: { a: 2, b: 1.5, n: 8 },
  },
  fibonacci: {
    controls: [
      control("First seed", 0, 10),
      control("Second seed", 0, 10),
      control("Term n", 3, 15),
    ],
    defaults: { a: 1, b: 1, n: 10 },
  },
  sigma: {
    controls: [
      control("Lower index", 1, 10),
      control("Coefficient", -5, 10, 0.5),
      control("Upper index", 2, 20),
    ],
    defaults: { a: 1, b: 2, n: 8 },
  },
  "arithmetic-series": {
    controls: [
      control("First term", -10, 20),
      control("Common difference", -10, 15),
      control("Number of terms", 2, 20),
    ],
    defaults: { a: 2, b: 3, n: 10 },
  },
  "geometric-series": {
    controls: [
      control("First term", -8, 12),
      control("Common ratio", -1.5, 1.5, 0.1),
      control("Number of terms", 2, 20),
    ],
    defaults: { a: 4, b: 0.5, n: 10 },
  },
  convergence: {
    controls: [
      control("Initial value", -8, 12),
      control("Ratio", -2, 2, 0.1),
      control("Terms inspected", 3, 20),
    ],
    defaults: { a: 4, b: 0.5, n: 12 },
  },
  "power-series": {
    controls: [
      control("Coefficient", -5, 10, 0.5),
      control("Input x", -1.5, 1.5, 0.1),
      control("Truncation degree", 1, 15),
    ],
    defaults: { a: 1, b: 0.5, n: 8 },
  },
  "taylor-maclaurin": {
    controls: [
      control("Evaluation x", -3, 3, 0.1),
      control("Expansion centre", -2, 2, 0.1),
      control("Polynomial degree", 1, 12),
    ],
    defaults: { a: 1, b: 0, n: 6 },
  },
  "binomial-series": {
    controls: [
      control("Exponent α", -3, 5, 0.5),
      control("Input x", -0.9, 0.9, 0.1),
      control("Truncation degree", 1, 12),
    ],
    defaults: { a: 0.5, b: 0.4, n: 6 },
  },
  "recurrence-model": {
    controls: [
      control("Initial population", 100, 2_000, 50),
      control("Growth multiplier", 0.5, 1.5, 0.05),
      control("Steps", 2, 15),
    ],
    defaults: { a: 500, b: 1.05, n: 8 },
  },
};

export function deriveSequenceConceptModel(
  mode: SequenceLessonMode,
  input: SequenceInputs,
): SequenceConceptModel {
  const count = Math.max(1, Math.round(input.n));
  const base = (
    label: string,
    value: number | string,
    formula: string,
    prompt: string,
    hint: string,
    terms: number[],
    insight: string,
    challengeKind: SequenceConceptModel["challengeKind"] = "numeric",
  ): SequenceConceptModel => {
    const partialSums = cumulative(terms);
    const display =
      typeof value === "number" ? formatNumber(value) : String(value);
    return {
      label,
      value,
      display,
      formula,
      prompt,
      expected:
        typeof value === "number" ? value.toFixed(3) : value.toLowerCase(),
      hint,
      challengeKind,
      terms,
      partialSums,
      insight,
      summary: `${label} is ${display}. ${insight}`,
    };
  };

  if (mode === "generator") {
    const terms = Array.from(
      { length: count },
      (_, index) => input.a + input.b * (index + 1) ** 2,
    );
    return base(
      `Term ${count}`,
      terms.at(-1) ?? 0,
      "aₙ = a + bn²",
      `What is generated term ${count}?`,
      "Substitute the visible term number into the explicit rule.",
      terms,
      "The second differences are constant for this quadratic generator.",
    );
  }
  if (mode === "arithmetic-sequence") {
    const terms = Array.from({ length: count }, (_, index) =>
      arithmeticTerm(input.a, input.b, index + 1),
    );
    return base(
      `Arithmetic term a${count}`,
      arithmeticTerm(input.a, input.b, count),
      "aₙ = a₁ + (n−1)d",
      `What is arithmetic term ${count}?`,
      "Add the common difference n−1 times.",
      terms,
      `Every consecutive difference equals ${formatNumber(input.b)}.`,
    );
  }
  if (mode === "geometric-sequence") {
    const terms = Array.from({ length: count }, (_, index) =>
      geometricTerm(input.a, input.b, index + 1),
    );
    return base(
      `Geometric term a${count}`,
      geometricTerm(input.a, input.b, count),
      "aₙ = a₁rⁿ⁻¹",
      `What is geometric term ${count}?`,
      "Multiply by the common ratio n−1 times.",
      terms,
      `Each term is the previous term multiplied by ${formatNumber(input.b)}.`,
    );
  }
  if (mode === "recursive-sequence") {
    const terms = recurrence(input.a, count, (previous) => input.b * previous + 1);
    return base(
      `Recursive term a${count}`,
      terms.at(-1) ?? input.a,
      "aₙ₊₁ = r·aₙ + 1",
      `What is recursive term ${count}?`,
      "Apply the displayed recurrence to each preceding term.",
      terms,
      "Each new term depends on the immediately preceding term.",
    );
  }
  if (mode === "fibonacci") {
    const terms = seededFibonacci(input.a, input.b, count);
    const ratio =
      terms.length > 1 && terms.at(-2) !== 0
        ? (terms.at(-1) ?? 0) / (terms.at(-2) ?? 1)
        : 0;
    return base(
      `Fibonacci-type term F${count}`,
      terms.at(-1) ?? 0,
      "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      `What is term ${count} for the active seeds?`,
      "Add the two preceding terms.",
      terms,
      `Latest consecutive-term ratio ${formatNumber(ratio)}.`,
    );
  }
  if (mode === "sigma") {
    const lower = Math.min(Math.round(input.a), count);
    const terms = Array.from(
      { length: Math.max(1, count - lower + 1) },
      (_, index) => input.b * (lower + index),
    );
    const value = terms.reduce((sum, term) => sum + term, 0);
    return base(
      "Expanded sigma sum",
      value,
      `Σ(k=${lower}…${count}) ${formatNumber(input.b)}k`,
      "What value does the displayed sigma expression have?",
      "Expand the indexed terms, then add them.",
      terms,
      `${terms.length} indexed terms are included.`,
    );
  }
  if (mode === "arithmetic-series") {
    const terms = Array.from({ length: count }, (_, index) =>
      arithmeticTerm(input.a, input.b, index + 1),
    );
    const value = arithmeticSum(input.a, input.b, count);
    return base(
      `Arithmetic sum S${count}`,
      value,
      "Sₙ = n[2a₁+(n−1)d]/2",
      `What is the arithmetic-series sum S${count}?`,
      "Use the first term, common difference, and number of terms.",
      terms,
      `First plus last equals ${formatNumber(terms[0] + (terms.at(-1) ?? 0))}.`,
    );
  }
  if (mode === "geometric-series") {
    const terms = Array.from({ length: count }, (_, index) =>
      geometricTerm(input.a, input.b, index + 1),
    );
    const finite = finiteGeometricSum(input.a, input.b, count);
    const convergent = Math.abs(input.b) < 1;
    return base(
      `Geometric partial sum S${count}`,
      finite,
      "Sₙ = a(1−rⁿ)/(1−r)",
      `What is the displayed geometric partial sum S${count}?`,
      "Add the generated geometric terms or use the finite-sum formula.",
      terms,
      convergent
        ? `Infinite limit ${formatNumber(input.a / (1 - input.b))}.`
        : "No finite infinite-series limit is claimed because |r| ≥ 1.",
    );
  }
  if (mode === "convergence") {
    const terms = Array.from({ length: count }, (_, index) =>
      geometricTerm(input.a, input.b, index + 1),
    );
    const classification =
      input.a === 0 || Math.abs(input.b) < 1 || input.b === 1
        ? "convergent"
        : "divergent";
    const limit =
      input.a === 0 || Math.abs(input.b) < 1
        ? 0
        : input.b === 1
          ? input.a
          : null;
    return base(
      "Sequence classification",
      classification,
      "aₙ = a₁rⁿ⁻¹",
      "Is the active sequence convergent or divergent?",
      "Inspect |r| and whether the terms approach one finite value.",
      terms,
      limit === null
        ? "The terms do not approach one finite limit."
        : `The terms approach ${formatNumber(limit)}.`,
      "keywords",
    );
  }
  if (mode === "power-series") {
    const degree = count;
    const terms = Array.from(
      { length: degree + 1 },
      (_, exponent) => input.a * input.b ** exponent,
    );
    const value = terms.reduce((sum, term) => sum + term, 0);
    return base(
      `Power-series approximation P${degree}`,
      value,
      "Pₙ(x) = Σ axᵏ",
      `What truncated power-series value is displayed at degree ${degree}?`,
      "Add the powers from k=0 through the selected degree.",
      terms,
      Math.abs(input.b) < 1
        ? "The input lies inside the geometric radius |x|<1."
        : "The input lies outside the geometric radius |x|<1.",
    );
  }
  if (mode === "taylor-maclaurin") {
    const degree = count;
    const delta = input.a - input.b;
    const terms = Array.from(
      { length: degree + 1 },
      (_, exponent) =>
        (Math.exp(input.b) * delta ** exponent) / factorial(exponent),
    );
    const approximation = terms.reduce((sum, term) => sum + term, 0);
    const error = Math.abs(Math.exp(input.a) - approximation);
    return base(
      `Taylor approximation of eˣ`,
      approximation,
      "eˣ ≈ eᶜΣ(x−c)ᵏ/k!",
      `What degree-${degree} Taylor approximation is displayed?`,
      "Add the Taylor terms about the selected centre.",
      terms,
      `Absolute error ${formatError(error)} at x=${formatNumber(input.a)}.`,
    );
  }
  if (mode === "binomial-series") {
    const degree = count;
    const terms = Array.from(
      { length: degree + 1 },
      (_, exponent) =>
        generalizedBinomial(input.a, exponent) * input.b ** exponent,
    );
    const approximation = terms.reduce((sum, term) => sum + term, 0);
    const exact = (1 + input.b) ** input.a;
    return base(
      `Binomial-series approximation`,
      approximation,
      "(1+x)ᵅ = Σ C(α,k)xᵏ",
      `What degree-${degree} binomial-series approximation is displayed?`,
      "Use generalized binomial coefficients for each power of x.",
      terms,
      `Exact value ${formatNumber(exact)}; |x|<1 satisfies the convergence restriction.`,
    );
  }

  const terms = recurrence(
    input.a,
    count,
    (previous) => input.b * previous + 100,
  );
  return base(
    `Model value after ${count - 1} steps`,
    terms.at(-1) ?? input.a,
    "Pₙ₊₁ = growth·Pₙ + 100",
    `What model value is displayed after ${count - 1} steps?`,
    "Apply growth, then add the fixed inflow at each step.",
    terms,
    "The graph links the recurrence rule to its step-by-step model values.",
  );
}

function cumulative(values: number[]) {
  let sum = 0;
  return values.map((value) => {
    sum += value;
    return sum;
  });
}

function recurrence(
  first: number,
  length: number,
  next: (previous: number) => number,
) {
  const values = [first];
  while (values.length < length) values.push(next(values.at(-1) ?? first));
  return values;
}

function seededFibonacci(first: number, second: number, length: number) {
  if (length === 1) return [first];
  const values = [first, second];
  while (values.length < length) {
    values.push((values.at(-1) ?? 0) + (values.at(-2) ?? 0));
  }
  return values;
}

function factorial(value: number) {
  let result = 1;
  for (let index = 2; index <= value; index += 1) result *= index;
  return result;
}

function generalizedBinomial(alpha: number, k: number) {
  let result = 1;
  for (let index = 0; index < k; index += 1) {
    result *= (alpha - index) / (index + 1);
  }
  return result;
}

function formatError(value: number) {
  return value > 0 && value < 0.001
    ? value.toExponential(2)
    : formatNumber(value);
}
