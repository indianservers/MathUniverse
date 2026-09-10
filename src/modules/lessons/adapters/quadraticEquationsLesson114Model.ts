export type Quadratic114 = { a: number; b: number; c: number };
export type QuadraticRoots114 = {
  first: number;
  second: number;
  discriminant: number;
  vertexX: number;
  vertexY: number;
};
export type QuadraticMethod114 =
  "Factoring" | "Quadratic formula" | "Complete the square";

export const QUADRATIC_EXAMPLES_114: Quadratic114[] = [
  { a: 1, b: -5, c: 6 },
  { a: 1, b: -7, c: 12 },
  { a: 1, b: -1, c: -6 },
  { a: 1, b: 2, c: -8 },
];

export function solveQuadratic114({
  a,
  b,
  c,
}: Quadratic114): QuadraticRoots114 {
  const discriminant = b * b - 4 * a * c;
  const vertexX = a === 0 ? Number.NaN : -b / (2 * a);
  const vertexY =
    a === 0 ? Number.NaN : a * vertexX * vertexX + b * vertexX + c;
  if (a === 0 || discriminant < 0)
    return {
      first: Number.NaN,
      second: Number.NaN,
      discriminant,
      vertexX,
      vertexY,
    };
  const root = Math.sqrt(discriminant);
  return {
    first: (-b - root) / (2 * a),
    second: (-b + root) / (2 * a),
    discriminant,
    vertexX,
    vertexY,
  };
}

export function tidyQuadratic114(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.00$/, "");
}

export function quadraticSignedTerm114(value: number, variable = "") {
  return `${value < 0 ? "−" : "+"} ${Math.abs(value)}${variable}`;
}

export function quadraticEquationText114(
  { a, b, c }: Quadratic114,
  variable = "x",
) {
  return `${a === 1 ? "" : a === -1 ? "−" : a}${variable}² ${quadraticSignedTerm114(b, variable)} ${quadraticSignedTerm114(c)} = 0`;
}

export function quadraticExpressionText114(
  { a, b, c }: Quadratic114,
  variable = "x",
) {
  return `${a === 1 ? "" : a === -1 ? "−" : a}${variable}² ${quadraticSignedTerm114(b, variable)} ${quadraticSignedTerm114(c)}`;
}

export function quadraticFactorText114(
  roots: QuadraticRoots114,
  variable = "x",
) {
  return `(${variable} ${roots.first < 0 ? "+" : "−"} ${tidyQuadratic114(Math.abs(roots.first))})(${variable} ${roots.second < 0 ? "+" : "−"} ${tidyQuadratic114(Math.abs(roots.second))}) = 0`;
}

export function isIntegerFactorableQuadratic114(quadratic: Quadratic114) {
  const roots = solveQuadratic114(quadratic);
  return (
    roots.discriminant >= 0 &&
    Number.isInteger(roots.first) &&
    Number.isInteger(roots.second)
  );
}

export function quadraticFromRoots114(
  a: number,
  first: number,
  second: number,
): Quadratic114 {
  return { a, b: -a * (first + second), c: a * first * second };
}

export function evaluateQuadratic114(quadratic: Quadratic114, x: number) {
  return quadratic.a * x * x + quadratic.b * x + quadratic.c;
}

export function isQuadraticPracticeCorrect114(
  quadratic: Quadratic114,
  answers: [number, number],
) {
  const roots = solveQuadratic114(quadratic);
  const expected = [roots.first, roots.second].sort((a, b) => a - b);
  const received = [...answers].sort((a, b) => a - b);
  return (
    received.every(Number.isFinite) &&
    received.every((value, index) => Math.abs(value - expected[index]) < 1e-9)
  );
}

export function quadraticMethodSteps114(
  quadratic: Quadratic114,
  method: QuadraticMethod114,
) {
  const roots = solveQuadratic114(quadratic);
  if (method === "Quadratic formula")
    return `Use x = (-b ± √Δ)/(2a), where Δ = ${roots.discriminant}, to obtain x = ${tidyQuadratic114(roots.first)} or x = ${tidyQuadratic114(roots.second)}.`;
  if (method === "Complete the square")
    return `Rewrite around the vertex x = ${tidyQuadratic114(roots.vertexX)}; the squared form gives x = ${tidyQuadratic114(roots.first)} or x = ${tidyQuadratic114(roots.second)}.`;
  return `Find two numbers with product ${quadratic.c / quadratic.a} and sum ${quadratic.b / quadratic.a}: ${tidyQuadratic114(roots.first)} and ${tidyQuadratic114(roots.second)}. Factor, apply the zero-product rule, then verify both roots.`;
}
