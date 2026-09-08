export type ComplexValue = { real: number; imaginary: number };

export type AlgebraTileInventory = {
  positiveX2: number;
  negativeX2: number;
  positiveX: number;
  negativeX: number;
  positiveUnit: number;
  negativeUnit: number;
};

export function algebraTiles(a: number, b: number, c: number): AlgebraTileInventory {
  const count = (value: number, positive: boolean) => Math.max(0, Math.trunc(positive ? value : -value));
  return {
    positiveX2: count(a, true), negativeX2: count(a, false),
    positiveX: count(b, true), negativeX: count(b, false),
    positiveUnit: count(c, true), negativeUnit: count(c, false),
  };
}

export function cancelZeroPairs(positive: number, negative: number) {
  const cancelled = Math.min(Math.max(0, positive), Math.max(0, negative));
  return { positive: positive - cancelled, negative: negative - cancelled, cancelled };
}

export function distributeBinomials(a: number, b: number, c: number, d: number) {
  return { quadratic: a * c, linear: a * d + b * c, constant: b * d };
}

export function factorIntegerQuadratic(a: number, b: number, c: number) {
  if (![a, b, c].every(Number.isInteger) || a === 0) return null;
  const limit = Math.max(24, Math.abs(a), Math.abs(c));
  for (let p = -limit; p <= limit; p++) for (let r = -limit; r <= limit; r++) {
    if (p * r !== a) continue;
    for (let q = -limit; q <= limit; q++) for (let s = -limit; s <= limit; s++) {
      if (q * s === c && p * s + q * r === b) return { left: [p, q] as const, right: [r, s] as const };
    }
  }
  return null;
}

export function solveLinearEquation(a: number, b: number, c: number, d: number) {
  const coefficient = a - c;
  const constant = d - b;
  if (Math.abs(coefficient) < 1e-12) return { kind: Math.abs(constant) < 1e-12 ? "all" : "none" } as const;
  return { kind: "one", value: constant / coefficient } as const;
}

export function solveLinearInequality(a: number, b: number, relation: "<" | "<=" | ">" | ">=", c: number) {
  if (Math.abs(a) < 1e-12) return { kind: "constant", truth: compare(b, relation, c) } as const;
  const boundary = (c - b) / a;
  return { kind: "interval", boundary, relation: a < 0 ? flipRelation(relation) : relation, reversed: a < 0 } as const;
}

export function solveAbsoluteValue(a: number, b: number, c: number) {
  if (c < 0 || Math.abs(a) < 1e-12) return [];
  return [(-b - c) / a, (-b + c) / a].sort((x, y) => x - y);
}

export function completeSquare(a: number, b: number, c: number) {
  if (Math.abs(a) < 1e-12) return null;
  const h = -b / (2 * a);
  return { a, h, k: c - a * h * h };
}

export function rationalRestrictions(denominatorRoots: number[], numeratorRoots: number[] = []) {
  const excluded = [...new Set(denominatorRoots)].sort((a, b) => a - b);
  const holes = excluded.filter((root) => numeratorRoots.some((candidate) => nearly(candidate, root)));
  return { excluded, holes, verticalAsymptotes: excluded.filter((root) => !holes.includes(root)) };
}

export function validateRadicalCandidate(candidate: number, original: (x: number) => number, tolerance = 1e-9) {
  const residual = Math.abs(original(candidate));
  return { candidate, residual, valid: Number.isFinite(residual) && residual <= tolerance };
}

export function composeFunctions(f: (x: number) => number, g: (x: number) => number, x: number) {
  return { fog: f(g(x)), gof: g(f(x)) };
}

export function inverseLinear(a: number, b: number) {
  if (Math.abs(a) < 1e-12) return null;
  return { slope: 1 / a, intercept: -b / a, evaluate: (x: number) => (x - b) / a };
}

export function evaluatePiecewise<T>(x: number, pieces: Array<{ from: number; to: number; includeFrom?: boolean; includeTo?: boolean; value: (x: number) => T }>) {
  const piece = pieces.find((candidate) => (x > candidate.from || (candidate.includeFrom && x === candidate.from)) && (x < candidate.to || (candidate.includeTo && x === candidate.to)));
  return piece ? { matched: true as const, value: piece.value(x) } : { matched: false as const };
}

export function polynomialFromRoots(roots: number[]) {
  return roots.reduce((coefficients, root) => {
    const next = Array(coefficients.length + 1).fill(0) as number[];
    coefficients.forEach((coefficient, index) => { next[index] += coefficient; next[index + 1] -= coefficient * root; });
    return next;
  }, [1]);
}

export function quadraticRoots(a: number, b: number, c: number): ComplexValue[] {
  if (Math.abs(a) < 1e-12) return Math.abs(b) < 1e-12 ? [] : [{ real: -c / b, imaginary: 0 }];
  const discriminant = b * b - 4 * a * c;
  if (discriminant >= 0) return [
    { real: (-b - Math.sqrt(discriminant)) / (2 * a), imaginary: 0 },
    { real: (-b + Math.sqrt(discriminant)) / (2 * a), imaginary: 0 },
  ];
  const imaginary = Math.sqrt(-discriminant) / Math.abs(2 * a);
  return [{ real: -b / (2 * a), imaginary: -imaginary }, { real: -b / (2 * a), imaginary }];
}

export function syntheticDivide(coefficients: number[], root: number) {
  if (coefficients.length < 2) return { quotient: [], remainder: coefficients[0] ?? 0 };
  const quotient = [coefficients[0]];
  for (let index = 1; index < coefficients.length - 1; index++) quotient.push(coefficients[index] + quotient[index - 1] * root);
  return { quotient, remainder: coefficients.at(-1)! + quotient.at(-1)! * root };
}

export function rationalFunctionAnalysis(numeratorRoots: number[], denominatorRoots: number[], numeratorDegree: number, denominatorDegree: number, leadingRatio = 1) {
  const restrictions = rationalRestrictions(denominatorRoots, numeratorRoots);
  return { ...restrictions, horizontalAsymptote: numeratorDegree < denominatorDegree ? 0 : numeratorDegree === denominatorDegree ? leadingRatio : null };
}

export function solveThreeByThree(matrix: number[][], constants: number[]) {
  if (matrix.length !== 3 || matrix.some((row) => row.length !== 3) || constants.length !== 3) return null;
  const augmented = matrix.map((row, index) => [...row, constants[index]]);
  for (let column = 0; column < 3; column++) {
    let pivot = column;
    for (let row = column + 1; row < 3; row++) if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    if (Math.abs(augmented[pivot][column]) < 1e-12) return null;
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    augmented[column] = augmented[column].map((value) => value / divisor);
    for (let row = 0; row < 3; row++) if (row !== column) {
      const scale = augmented[row][column];
      augmented[row] = augmented[row].map((value, index) => value - scale * augmented[column][index]);
    }
  }
  return augmented.map((row) => row[3]);
}

export function numericIntersections(f: (x: number) => number, g: (x: number) => number, min: number, max: number, steps = 1000) {
  const roots: number[] = [];
  let previousX = min, previous = f(min) - g(min);
  for (let index = 1; index <= steps; index++) {
    const x = min + (index / steps) * (max - min), value = f(x) - g(x);
    if (Number.isFinite(value) && (value === 0 || previous * value < 0)) {
      let left = previousX, right = x;
      for (let iteration = 0; iteration < 50; iteration++) {
        const mid = (left + right) / 2, midValue = f(mid) - g(mid);
        if ((f(left) - g(left)) * midValue <= 0) right = mid; else left = mid;
      }
      const root = (left + right) / 2;
      if (!roots.some((candidate) => nearly(candidate, root, 1e-6))) roots.push(root);
    }
    previousX = x; previous = value;
  }
  return roots;
}

export function exponentLawCounterexample(base: number, m: number, n: number, claimed: "product" | "sum") {
  const left = claimed === "product" ? base ** m * base ** n : base ** m + base ** n;
  const right = base ** (m + n);
  return { left, right, valid: nearly(left, right), explanation: claimed === "product" ? "a^m · a^n = a^(m+n)" : "Addition does not generally combine exponents." };
}

export function changeLogBase(value: number, fromBase: number, toBase: number) {
  if (value <= 0 || fromBase <= 0 || toBase <= 0 || fromBase === 1 || toBase === 1) return null;
  return { inFromBase: Math.log(value) / Math.log(fromBase), inToBase: Math.log(value) / Math.log(toBase) };
}

export function generateSequences(first: number, parameter: number, count: number) {
  const recursive: number[] = [];
  for (let index = 0; index < count; index++) recursive.push(index === 0 ? first : recursive[index - 1] + parameter);
  return {
    arithmetic: Array.from({ length: count }, (_, index) => first + index * parameter),
    geometric: Array.from({ length: count }, (_, index) => first * parameter ** index),
    recursive,
  };
}

export function arithmeticSeries(first: number, difference: number, count: number) {
  const last = first + (count - 1) * difference;
  return { last, sum: count * (first + last) / 2, sigma: `${count}/2(2·${first}+(${count}−1)·${difference})` };
}

export function validateEquivalentExpressions(left: (x: number) => number, right: (x: number) => number, samples = [-3, -1, 0, 1, 2, 4]) {
  const counterexample = samples.find((x) => !nearly(left(x), right(x), 1e-8));
  return counterexample === undefined ? { equivalentOnSamples: true as const, samples } : { equivalentOnSamples: false as const, counterexample };
}

export function verifyEquationCandidates(candidates: number[], residual: (x: number) => number, domain: (x: number) => boolean = () => true) {
  return candidates.map((candidate) => ({ candidate, inDomain: domain(candidate), residual: Math.abs(residual(candidate)), valid: domain(candidate) && Math.abs(residual(candidate)) <= 1e-8 }));
}

function nearly(a: number, b: number, tolerance = 1e-10) { return Math.abs(a - b) <= tolerance; }
function flipRelation(relation: "<" | "<=" | ">" | ">=") { return ({ "<": ">", "<=": ">=", ">": "<", ">=": "<=" } as const)[relation]; }
function compare(a: number, relation: "<" | "<=" | ">" | ">=", b: number) { return relation === "<" ? a < b : relation === "<=" ? a <= b : relation === ">" ? a > b : a >= b; }
