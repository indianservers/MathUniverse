export type EquationThree113 = { a: number; b: number; c: number; d: number };
export type SystemThree113 = {
  id: string;
  equations: [EquationThree113, EquationThree113, EquationThree113];
};
export type VariableThree113 = "x" | "y" | "z";

export const THREE_VARIABLE_SYSTEMS_113: SystemThree113[] = [
  {
    id: "target-2-1-3",
    equations: [
      { a: 1, b: 1, c: 1, d: 6 },
      { a: 1, b: -1, c: 1, d: 4 },
      { a: 1, b: 1, c: -1, d: 0 },
    ],
  },
  {
    id: "example-2-1-4",
    equations: [
      { a: 2, b: 1, c: 1, d: 9 },
      { a: 1, b: -1, c: 1, d: 5 },
      { a: 1, b: 1, c: -1, d: -1 },
    ],
  },
  {
    id: "example-3-2-1",
    equations: [
      { a: 1, b: 1, c: 1, d: 6 },
      { a: 1, b: -1, c: 1, d: 2 },
      { a: 1, b: 1, c: -1, d: 4 },
    ],
  },
];

export const THREE_VARIABLE_PRACTICES_113: SystemThree113[] = [
  {
    id: "practice-4-2-3",
    equations: [
      { a: 1, b: 1, c: 1, d: 9 },
      { a: 1, b: 1, c: -1, d: 3 },
      { a: 1, b: -1, c: 1, d: 5 },
    ],
  },
  {
    id: "practice-2-3-1",
    equations: [
      { a: 1, b: 1, c: 1, d: 6 },
      { a: 2, b: -1, c: 1, d: 2 },
      { a: 1, b: 1, c: -1, d: 4 },
    ],
  },
];

export const roundThree113 = (value: number) => Math.round(value * 1000) / 1000;

export function determinantThree113(matrix: number[][]) {
  return (
    matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
  );
}

export function solveThreeVariableSystem113(system: SystemThree113) {
  const coefficients = system.equations.map(({ a, b, c }) => [a, b, c]);
  const values = system.equations.map(({ d }) => d);
  const determinant = determinantThree113(coefficients);
  const replace = (column: number) =>
    coefficients.map((row, rowIndex) =>
      row.map((value, columnIndex) =>
        columnIndex === column ? values[rowIndex] : value,
      ),
    );
  const x = roundThree113(determinantThree113(replace(0)) / determinant);
  const y = roundThree113(determinantThree113(replace(1)) / determinant);
  const z = roundThree113(determinantThree113(replace(2)) / determinant);
  const checks = system.equations.map((equation) =>
    evaluateThreeVariableEquation113(equation, { x, y, z }),
  );
  return {
    determinant,
    x,
    y,
    z,
    checks,
    valid:
      determinant !== 0 &&
      checks.every((value, index) => value === system.equations[index].d),
  };
}

export function threeVariableTerm113(
  value: number,
  variable: VariableThree113,
  first = false,
) {
  if (value === 0) return "";
  const magnitude = Math.abs(value) === 1 ? "" : Math.abs(value);
  if (first) return `${value < 0 ? "−" : ""}${magnitude}${variable}`;
  return `${value < 0 ? " − " : " + "}${magnitude}${variable}`;
}

export function threeVariableEquationText113(equation: EquationThree113) {
  return `${threeVariableTerm113(equation.a, "x", true)}${threeVariableTerm113(equation.b, "y", equation.a === 0)}${threeVariableTerm113(equation.c, "z", equation.a === 0 && equation.b === 0)} = ${equation.d}`;
}

const variableIndex = (variable: VariableThree113) =>
  ({ x: 0, y: 1, z: 2 })[variable];
const coefficientsOf = (equation: EquationThree113) => [
  equation.a,
  equation.b,
  equation.c,
];

export function combineToEliminateThree113(
  first: EquationThree113,
  second: EquationThree113,
  variable: VariableThree113,
) {
  const index = variableIndex(variable);
  const firstCoefficient = coefficientsOf(first)[index];
  const secondCoefficient = coefficientsOf(second)[index];
  const firstMultiplier = 1;
  const secondMultiplier = -firstCoefficient / secondCoefficient;
  const combined = {
    a: roundThree113(first.a + second.a * secondMultiplier),
    b: roundThree113(first.b + second.b * secondMultiplier),
    c: roundThree113(first.c + second.c * secondMultiplier),
    d: roundThree113(first.d + second.d * secondMultiplier),
  };
  return { firstMultiplier, secondMultiplier, combined };
}

export function threeVariableOperationText113(
  secondMultiplier: number,
  pair: string,
) {
  const [first, second] = pair.split("/");
  if (secondMultiplier === 1) return `${first} + ${second}`;
  if (secondMultiplier === -1) return `${first} − ${second}`;
  return `${first} ${secondMultiplier > 0 ? "+" : "−"} ${Math.abs(secondMultiplier)}${second}`;
}

export function evaluateThreeVariableEquation113(
  equation: EquationThree113,
  solution: { x: number; y: number; z: number },
) {
  return roundThree113(
    equation.a * solution.x + equation.b * solution.y + equation.c * solution.z,
  );
}

export function threeVariableOperationPayload113(
  system: SystemThree113,
  variable: VariableThree113,
) {
  return `${system.id}:${variable}`;
}

export function isThreeVariableOperationDrop113(
  payload: string,
  system: SystemThree113,
  variable: VariableThree113,
) {
  return (
    payload.trim() !== "" &&
    payload === threeVariableOperationPayload113(system, variable)
  );
}

export function isThreeVariablePracticeCorrect113(
  system: SystemThree113,
  answers: [number, number, number],
) {
  const solution = solveThreeVariableSystem113(system);
  return (
    answers.every(Number.isFinite) &&
    Math.abs(answers[0] - solution.x) < 1e-9 &&
    Math.abs(answers[1] - solution.y) < 1e-9 &&
    Math.abs(answers[2] - solution.z) < 1e-9
  );
}
