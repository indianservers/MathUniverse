export type PolynomialRoots115 = [number, number, number];
export type CubicCoefficients115 = {
  cubic: number;
  square: number;
  linear: number;
  constant: number;
};

export const POLYNOMIAL_EXAMPLES_115: PolynomialRoots115[] = [
  [1, 2, 3],
  [-2, 1, 3],
  [0, 2, 4],
  [-1, 3, 5],
];
export const POLYNOMIAL_PRACTICES_115: PolynomialRoots115[] = [
  [-1, 2, 4],
  [-2, 1, 5],
  [1, 3, 6],
];

export function coefficientsFromRoots115([
  r1,
  r2,
  r3,
]: PolynomialRoots115): CubicCoefficients115 {
  return {
    cubic: 1,
    square: -(r1 + r2 + r3),
    linear: r1 * r2 + r1 * r3 + r2 * r3,
    constant: -r1 * r2 * r3,
  };
}

export function evaluatePolynomialRoots115(
  roots: PolynomialRoots115,
  x: number,
) {
  const result = roots.reduce((value, root) => value * (x - root), 1);
  return Object.is(result, -0) ? 0 : result;
}

export function polynomialSignTerm115(value: number, term: string) {
  return `${value < 0 ? "−" : "+"} ${Math.abs(value) === 1 && term ? "" : Math.abs(value)}${term}`;
}

export function polynomialExpandedText115(
  roots: PolynomialRoots115,
  variable = "x",
) {
  const coefficients = coefficientsFromRoots115(roots);
  return `${variable}³ ${polynomialSignTerm115(coefficients.square, `${variable}²`)} ${polynomialSignTerm115(coefficients.linear, variable)} ${polynomialSignTerm115(coefficients.constant, "")} = 0`;
}

export function polynomialFactor115(root: number, variable = "x") {
  return `(${variable} ${root < 0 ? "+" : "−"} ${Math.abs(root)})`;
}

export function polynomialFactoredText115(
  roots: PolynomialRoots115,
  variable = "x",
) {
  return `${roots.map((root) => polynomialFactor115(root, variable)).join("")} = 0`;
}

export function polynomialFromRootMove115(
  roots: PolynomialRoots115,
  index: number,
  value: number,
): PolynomialRoots115 {
  const next = [...roots] as PolynomialRoots115;
  next[index] = value;
  return next;
}

export function polynomialRootChecks115(roots: PolynomialRoots115) {
  return roots.map((root) => evaluatePolynomialRoots115(roots, root));
}

export function isPolynomialPracticeCorrect115(
  expected: PolynomialRoots115,
  answers: [number, number, number],
) {
  const sortedExpected = [...expected].sort((a, b) => a - b);
  const sortedAnswers = [...answers].sort((a, b) => a - b);
  return (
    sortedAnswers.every(Number.isFinite) &&
    sortedAnswers.every((value, index) => value === sortedExpected[index])
  );
}
