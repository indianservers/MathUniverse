export type LiteralArrangement110 = {
  result: string;
  divisor: string | null;
  compute: (values: Record<string, number>) => number;
};

export type LiteralFormula110 = {
  id: string;
  formula: string;
  variables: string[];
  defaultSubject: string;
  defaults: Record<string, number>;
  arrangements: Record<string, LiteralArrangement110>;
  evaluate: (values: Record<string, number>) => { left: number; right: number };
};

export const LITERAL_FORMULAS_110: LiteralFormula110[] = [
  {
    id: "rectangle-area",
    formula: "A = l w",
    variables: ["A", "l", "w"],
    defaultSubject: "w",
    defaults: { A: 24, l: 6, w: 4 },
    arrangements: {
      A: { result: "A = l w", divisor: null, compute: (v) => v.l * v.w },
      l: { result: "l = A / w", divisor: "w", compute: (v) => v.A / v.w },
      w: { result: "w = A / l", divisor: "l", compute: (v) => v.A / v.l },
    },
    evaluate: (v) => ({ left: v.A, right: v.l * v.w }),
  },
  {
    id: "distance-rate-time",
    formula: "d = r t",
    variables: ["d", "r", "t"],
    defaultSubject: "t",
    defaults: { d: 120, r: 60, t: 2 },
    arrangements: {
      d: { result: "d = r t", divisor: null, compute: (v) => v.r * v.t },
      r: { result: "r = d / t", divisor: "t", compute: (v) => v.d / v.t },
      t: { result: "t = d / r", divisor: "r", compute: (v) => v.d / v.r },
    },
    evaluate: (v) => ({ left: v.d, right: v.r * v.t }),
  },
  {
    id: "simple-interest",
    formula: "I = P r t",
    variables: ["I", "P", "r", "t"],
    defaultSubject: "r",
    defaults: { I: 120, P: 100, r: 0.6, t: 2 },
    arrangements: {
      I: {
        result: "I = P r t",
        divisor: null,
        compute: (v) => v.P * v.r * v.t,
      },
      P: {
        result: "P = I / (r t)",
        divisor: "r t",
        compute: (v) => v.I / (v.r * v.t),
      },
      r: {
        result: "r = I / (P t)",
        divisor: "P t",
        compute: (v) => v.I / (v.P * v.t),
      },
      t: {
        result: "t = I / (P r)",
        divisor: "P r",
        compute: (v) => v.I / (v.P * v.r),
      },
    },
    evaluate: (v) => ({ left: v.I, right: v.P * v.r * v.t }),
  },
  {
    id: "circumference",
    formula: "C = 2π r",
    variables: ["C", "r"],
    defaultSubject: "r",
    defaults: { C: 10 * Math.PI, r: 5 },
    arrangements: {
      C: {
        result: "C = 2π r",
        divisor: null,
        compute: (v) => 2 * Math.PI * v.r,
      },
      r: {
        result: "r = C / (2π)",
        divisor: "2π",
        compute: (v) => v.C / (2 * Math.PI),
      },
    },
    evaluate: (v) => ({ left: v.C, right: 2 * Math.PI * v.r }),
  },
];

export const LITERAL_PRACTICES_110: LiteralFormula110[] = [
  LITERAL_FORMULAS_110[3],
  {
    id: "rectangular-volume",
    formula: "V = l w h",
    variables: ["V", "l", "w", "h"],
    defaultSubject: "h",
    defaults: { V: 120, l: 5, w: 4, h: 6 },
    arrangements: {
      h: {
        result: "h = V / (l w)",
        divisor: "l w",
        compute: (v) => v.V / (v.l * v.w),
      },
    },
    evaluate: (v) => ({ left: v.V, right: v.l * v.w * v.h }),
  },
];

export function solveLiteralFormula110(
  formula: LiteralFormula110,
  subject: string,
  values: Record<string, number>,
) {
  const arrangement =
    formula.arrangements[subject] ??
    formula.arrangements[formula.defaultSubject];
  const numericResult = arrangement.compute(values);
  const check = formula.evaluate({ ...values, [subject]: numericResult });
  return {
    arrangement,
    numericResult,
    check,
    checkCorrect:
      Number.isFinite(check.left) &&
      Number.isFinite(check.right) &&
      Math.abs(check.left - check.right) < 1e-8,
  };
}

export function literalOperationPayload110(
  formula: LiteralFormula110,
  subject: string,
) {
  const arrangement =
    formula.arrangements[subject] ??
    formula.arrangements[formula.defaultSubject];
  return `${formula.id}:${subject}:${arrangement.divisor ?? "none"}`;
}

export function isLiteralOperationDrop110(
  payload: string,
  formula: LiteralFormula110,
  subject: string,
) {
  return (
    payload.trim() !== "" &&
    payload === literalOperationPayload110(formula, subject)
  );
}
