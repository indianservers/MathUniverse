export type CompoundMode123 = "AND" | "OR";
export type CompoundBoundary123 = "lower" | "upper";

export type CompoundInequality123 = {
  mode: CompoundMode123;
  lower: number;
  upper: number;
  lowerClosed: boolean;
  upperClosed: boolean;
};

export const COMPOUND_INEQUALITY_EXAMPLES_123: CompoundInequality123[] = [
  { mode: "AND", lower: 2, upper: 6, lowerClosed: false, upperClosed: true },
  { mode: "OR", lower: -1, upper: 3, lowerClosed: false, upperClosed: true },
];

export function compoundRelationText123(
  mode: CompoundMode123,
  side: CompoundBoundary123,
  closed: boolean,
) {
  if (mode === "AND") {
    if (side === "lower") return closed ? "≥" : ">";
    return closed ? "≤" : "<";
  }
  if (side === "lower") return closed ? "≤" : "<";
  return closed ? "≥" : ">";
}

export function compoundConditionPass123(
  mode: CompoundMode123,
  side: CompoundBoundary123,
  value: number,
  boundary: number,
  closed: boolean,
) {
  if (mode === "AND") {
    if (side === "lower") return closed ? value >= boundary : value > boundary;
    return closed ? value <= boundary : value < boundary;
  }
  if (side === "lower") return closed ? value <= boundary : value < boundary;
  return closed ? value >= boundary : value > boundary;
}

export function compoundPointPasses123(
  problem: CompoundInequality123,
  value: number,
) {
  const lowerPass = compoundConditionPass123(
    problem.mode,
    "lower",
    value,
    problem.lower,
    problem.lowerClosed,
  );
  const upperPass = compoundConditionPass123(
    problem.mode,
    "upper",
    value,
    problem.upper,
    problem.upperClosed,
  );
  return problem.mode === "AND"
    ? lowerPass && upperPass
    : lowerPass || upperPass;
}

export function solveCompoundInequality123(problem: CompoundInequality123) {
  const empty =
    problem.mode === "AND" &&
    (problem.lower > problem.upper ||
      (problem.lower === problem.upper &&
        (!problem.lowerClosed || !problem.upperClosed)));
  const interval = empty
    ? "∅"
    : problem.mode === "AND"
      ? `${problem.lowerClosed ? "[" : "("}${problem.lower}, ${problem.upper}${problem.upperClosed ? "]" : ")"}`
      : `(-∞, ${problem.lower}${problem.lowerClosed ? "]" : ")"} ∪ ${problem.upperClosed ? "[" : "("}${problem.upper}, ∞)`;
  const midpoint = Math.round((problem.lower + problem.upper) / 2);
  const testPoints =
    problem.mode === "AND"
      ? [midpoint, problem.lower, problem.upper + 1]
      : [problem.lower - 1, midpoint, problem.upper + 1];
  return {
    empty,
    interval,
    midpoint,
    testPoints: testPoints.map((value) => ({
      value,
      passes: compoundPointPasses123(problem, value),
    })),
  };
}
