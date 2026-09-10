export type QuadraticRelation124 = ">" | ">=" | "<" | "<=";

export type QuadraticInequality124 = {
  a: number;
  firstRoot: number;
  secondRoot: number;
  relation: QuadraticRelation124;
};

export function evaluateQuadraticInequality124(
  problem: QuadraticInequality124,
  x: number,
) {
  return problem.a * (x - problem.firstRoot) * (x - problem.secondRoot);
}

export function quadraticRelationPasses124(
  relation: QuadraticRelation124,
  value: number,
) {
  if (relation === ">") return value > 0;
  if (relation === ">=") return value >= 0;
  if (relation === "<") return value < 0;
  return value <= 0;
}

export function solveQuadraticInequality124(problem: QuadraticInequality124) {
  const [left, right] = [problem.firstRoot, problem.secondRoot].sort(
    (first, second) => first - second,
  );
  const b = -problem.a * (left + right);
  const c = problem.a * left * right;
  const include = problem.relation.includes("=");
  const wantsPositive = problem.relation.startsWith(">");
  const outside = wantsPositive === problem.a > 0;
  let text: string;
  let interval: string;
  if (left === right) {
    if (outside) {
      text = include ? "All real numbers" : `x ≠ ${left}`;
      interval = include ? "(−∞, ∞)" : `(−∞, ${left}) ∪ (${left}, ∞)`;
    } else {
      text = include ? `x = ${left}` : "No solution";
      interval = include ? `{${left}}` : "∅";
    }
  } else if (outside) {
    text = `x ${include ? "≤" : "<"} ${left} or x ${include ? "≥" : ">"} ${right}`;
    interval = `(−∞, ${left}${include ? "]" : ")"} ∪ ${include ? "[" : "("}${right}, ∞)`;
  } else {
    text = `${left} ${include ? "≤" : "<"} x ${include ? "≤" : "<"} ${right}`;
    interval = `${include ? "[" : "("}${left}, ${right}${include ? "]" : ")"}`;
  }
  const testValues = [left - 1, left, (left + right) / 2, right, right + 1];
  return {
    roots: [left, right] as const,
    b,
    c,
    include,
    outside,
    text,
    interval,
    tests: testValues.map((x) => {
      const value = evaluateQuadraticInequality124(problem, x);
      return {
        x,
        value,
        qualifies: quadraticRelationPasses124(problem.relation, value),
      };
    }),
  };
}

export function verifyQuadraticPractice124() {
  const solution = solveQuadraticInequality124({
    a: 1,
    firstRoot: -2,
    secondRoot: 2,
    relation: "<=",
  });
  return solution.interval === "[-2, 2]";
}
