export type LinearInequalityRelation122 = ">" | ">=" | "<" | "<=";

export type LinearInequalityProblem122 = {
  a: number;
  b: number;
  relation: LinearInequalityRelation122;
  c: number;
};

export const LINEAR_INEQUALITY_EXAMPLES_122: LinearInequalityProblem122[] = [
  { a: 2, b: 3, relation: ">", c: 9 },
  { a: -2, b: 0, relation: "<", c: 6 },
  { a: 5, b: -4, relation: "<=", c: 11 },
];

export function flipLinearRelation122(
  relation: LinearInequalityRelation122,
): LinearInequalityRelation122 {
  return ({ ">": "<", ">=": "<=", "<": ">", "<=": ">=" } as const)[relation];
}

export function linearRelationSymbol122(relation: LinearInequalityRelation122) {
  return relation.replace(">=", "≥").replace("<=", "≤");
}

export function evaluateLinearInequality122(
  problem: LinearInequalityProblem122,
  x: number,
) {
  const left = problem.a * x + problem.b;
  if (problem.relation === ">") return left > problem.c;
  if (problem.relation === ">=") return left >= problem.c;
  if (problem.relation === "<") return left < problem.c;
  return left <= problem.c;
}

export function solveLinearInequality122(problem: LinearInequalityProblem122) {
  if (!Number.isFinite(problem.a) || problem.a === 0) {
    return {
      valid: false,
      boundary: Number.NaN,
      solvedRelation: problem.relation,
      flipped: false,
      right: false,
      closed: false,
      passPoint: Number.NaN,
      interval: "undefined",
    };
  }
  const boundary = (problem.c - problem.b) / problem.a;
  const flipped = problem.a < 0;
  const solvedRelation = flipped
    ? flipLinearRelation122(problem.relation)
    : problem.relation;
  const right = solvedRelation.startsWith(">");
  const closed = solvedRelation.includes("=");
  const passPoint = boundary + (right ? 1 : -1);
  const interval = right
    ? `${closed ? "[" : "("}${boundary}, ∞)`
    : `(-∞, ${boundary}${closed ? "]" : ")"}`;
  return {
    valid: true,
    boundary,
    solvedRelation,
    flipped,
    right,
    closed,
    passPoint,
    interval,
  };
}

export function rightSideForBoundary122(
  problem: LinearInequalityProblem122,
  boundary: number,
) {
  return problem.a * boundary + problem.b;
}
