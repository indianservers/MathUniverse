export type AlgebraTileKind92 =
  "x" | "negative-x" | "unit" | "negative-unit" | "x-squared";

export type AlgebraTileProblem92 = {
  firstX: number;
  secondX: number;
  negativeX: number;
  units: number;
  negativeUnits: number;
  xSquared: number;
};

export const ALGEBRA_TILE_PROBLEMS_92: AlgebraTileProblem92[] = [
  {
    firstX: 2,
    secondX: 3,
    negativeX: 0,
    units: 0,
    negativeUnits: 1,
    xSquared: 0,
  },
  {
    firstX: 3,
    secondX: 2,
    negativeX: 0,
    units: 1,
    negativeUnits: 0,
    xSquared: 0,
  },
  {
    firstX: 4,
    secondX: 0,
    negativeX: 2,
    units: 0,
    negativeUnits: 2,
    xSquared: 0,
  },
];

function tileTerm92(coefficient: number, symbol: string) {
  if (!coefficient) return "";
  const magnitude = Math.abs(coefficient);
  return `${coefficient < 0 ? "−" : ""}${magnitude === 1 ? "" : magnitude}${symbol}`;
}

export function algebraTileCoefficients92(problem: AlgebraTileProblem92) {
  return {
    xSquared: problem.xSquared,
    x: problem.firstX + problem.secondX - problem.negativeX,
    constant: problem.units - problem.negativeUnits,
  };
}

export function algebraTileExpression92(problem: AlgebraTileProblem92) {
  const coefficients = algebraTileCoefficients92(problem);
  const terms = [
    tileTerm92(coefficients.xSquared, "x²"),
    tileTerm92(coefficients.x, "x"),
  ].filter(Boolean);
  if (coefficients.constant) {
    terms.push(
      `${coefficients.constant < 0 ? "−" : "+"} ${Math.abs(coefficients.constant)}`,
    );
  }
  return terms.join(" ") || "0";
}

export function algebraTileStartingExpression92(problem: AlgebraTileProblem92) {
  const groups = [`${problem.firstX}x`, `${problem.secondX}x`];
  if (problem.negativeX) groups.push(`− ${problem.negativeX}x`);
  if (problem.units) groups.push(`+ ${problem.units}`);
  if (problem.negativeUnits) groups.push(`− ${problem.negativeUnits}`);
  return groups.join(" + ").replace("+ −", "−");
}

export function addAlgebraTile92(
  problem: AlgebraTileProblem92,
  kind: AlgebraTileKind92,
) {
  if (kind === "x") return { ...problem, secondX: problem.secondX + 1 };
  if (kind === "negative-x")
    return { ...problem, negativeX: problem.negativeX + 1 };
  if (kind === "unit") return { ...problem, units: problem.units + 1 };
  if (kind === "negative-unit")
    return { ...problem, negativeUnits: problem.negativeUnits + 1 };
  return { ...problem, xSquared: problem.xSquared + 1 };
}

export function evaluateAlgebraTiles92(
  problem: AlgebraTileProblem92,
  x: number,
) {
  const coefficients = algebraTileCoefficients92(problem);
  return (
    coefficients.xSquared * x * x + coefficients.x * x + coefficients.constant
  );
}
