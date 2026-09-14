import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Solve";
import { compileFunctionExpression } from "../../utils/functionParser";
import { rref, solveAugmentedRref } from "../../utils/mathEngine/linearAlgebraUtils";
import { runCasOperation } from "../../utils/mathEngine/casUtils";
import {
  factorIntegerQuadratic,
  quadraticRoots,
  solveLinearEquation,
  solveLinearInequality,
} from "./algebraEnhancementEngine";

export const ALGEBRA_EPSILON = 1e-12;

type NerdamerEngine = {
  (value: string): {
    toString(): string;
    text(): string;
    evaluate(values?: Record<string, number>): { text(): string; toString(): string };
    expand(): { toString(): string };
    factor(): { toString(): string };
  };
};

const engine = nerdamer as unknown as NerdamerEngine;

export function snapNearZero(value: number, epsilon = ALGEBRA_EPSILON) {
  if (!Number.isFinite(value)) return value;
  return Math.abs(value) < epsilon ? 0 : value;
}

export function formatAlgebraNumber(value: number) {
  if (!Number.isFinite(value)) return "Undefined";
  const snapped = snapNearZero(value);
  return String(Math.round(snapped * 1e6) / 1e6);
}

export function normalizeAlgebraText(input: string) {
  return input
    .trim()
    .replace(/π/gi, "pi")
    .replace(/−/g, "-")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√\s*\(/g, "sqrt(")
    .replace(/√\s*([0-9a-z.]+)/gi, "sqrt($1)")
    .replace(/\s+/g, "")
    .replace(/(\d|\)|x|pi|e)(?=(x|pi|e|sin|cos|tan|ln|log|exp|sqrt|abs|\())/gi, "$1*");
}

export function parseAlgebraNumber(input: string) {
  const normalized = normalizeAlgebraText(input);
  if (!normalized) return { ok: false as const, error: "Enter a number." };
  try {
    const value = Number(engine(normalized).evaluate().text());
    if (!Number.isFinite(value)) return { ok: false as const, error: "Not a finite number." };
    return { ok: true as const, value: snapNearZero(value) };
  } catch {
    return { ok: false as const, error: "Could not parse this number." };
  }
}

export function evaluateAlgebraExpression(input: string, variables: Record<string, number> = {}) {
  const normalized = normalizeAlgebraText(input);
  if (!normalized) return { ok: false as const, error: "Enter an expression." };
  try {
    let parsed = engine(normalized);
    if (Object.keys(variables).length) parsed = parsed.evaluate(variables) as typeof parsed;
    const value = Number(parsed.evaluate().text());
    if (!Number.isFinite(value)) return { ok: false as const, error: "Undefined at this input." };
    return { ok: true as const, value: snapNearZero(value) };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Invalid expression." };
  }
}

export function compileSafeFunction(input: string) {
  try {
    return compileFunctionExpression(normalizeAlgebraText(input).replace(/^y=/i, ""));
  } catch {
    return null;
  }
}

function zeroLike(value: string) {
  const trimmed = value.replace(/\s+/g, "");
  if (trimmed === "0" || trimmed === "0.0") return true;
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) && Math.abs(numeric) < 1e-8;
}

export function expressionsEquivalent(left: string, right: string) {
  const a = normalizeAlgebraText(left);
  const b = normalizeAlgebraText(right);
  if (!a || !b) return false;
  try {
    const difference = engine(`(${a})-(${b})`);
    if (zeroLike(difference.expand().toString()) || zeroLike(difference.toString())) return true;
  } catch {
    /* fall through to numeric sampling */
  }
  const samples = [-3, -1, 0, 1, 2, 4, 0.5, -2.5];
  const fnA = compileSafeFunction(a);
  const fnB = compileSafeFunction(b);
  if (fnA && fnB) {
    return samples.every((x) => {
      try {
        const leftValue = fnA(x);
        const rightValue = fnB(x);
        if (!Number.isFinite(leftValue) && !Number.isFinite(rightValue)) return true;
        return Number.isFinite(leftValue) && Number.isFinite(rightValue) && Math.abs(leftValue - rightValue) < 1e-6;
      } catch {
        return false;
      }
    });
  }
  const numeric = evaluateAlgebraExpression(`(${a})-(${b})`);
  return numeric.ok && Math.abs(numeric.value) < 1e-8;
}

export function answersMatchChallenge(answer: string, expected: string | number) {
  const trimmed = answer.trim();
  if (!trimmed) return false;
  if (typeof expected === "number") {
    const parsed = parseAlgebraNumber(trimmed);
    if (parsed.ok && Math.abs(parsed.value - expected) < 1e-6) return true;
    const evaluated = evaluateAlgebraExpression(trimmed);
    return evaluated.ok && Math.abs(evaluated.value - expected) < 1e-6;
  }
  if (expressionsEquivalent(trimmed, expected)) return true;
  const expectedNumber = parseAlgebraNumber(expected);
  const answerNumber = parseAlgebraNumber(trimmed);
  return expectedNumber.ok && answerNumber.ok && Math.abs(expectedNumber.value - answerNumber.value) < 1e-6;
}

export function factorial(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 170) return null;
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

export function combination(n: number, k: number) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return null;
  const top = factorial(n);
  const bottomLeft = factorial(k);
  const bottomRight = factorial(n - k);
  if (top === null || bottomLeft === null || bottomRight === null) return null;
  return top / (bottomLeft * bottomRight);
}

export function nthRoot(value: number, index: number) {
  if (!Number.isFinite(value) || !Number.isFinite(index) || snapNearZero(index) === 0) {
    return { ok: false as const, error: "Root index cannot be 0." };
  }
  if (value < 0 && Math.abs(index % 2) < 1e-12) return { ok: false as const, error: "Even root of a negative number is not real." };
  if (value < 0) return { ok: true as const, value: -((-value) ** (1 / index)) };
  return { ok: true as const, value: value ** (1 / index) };
}

export function logWithBase(value: number, base: number) {
  if (value <= 0 || base <= 0 || snapNearZero(base - 1) === 0) return null;
  return Math.log(value) / Math.log(base);
}

export function solveExponentialEquation(base: number, target: number) {
  if (snapNearZero(base) === 0) {
    if (snapNearZero(target) === 0) return { kind: "all" as const };
    return { kind: "none" as const };
  }
  if (snapNearZero(base - 1) === 0) return snapNearZero(target - 1) === 0 ? { kind: "all" as const } : { kind: "none" as const };
  if (base < 0) return { kind: "none" as const };
  if (target <= 0) return { kind: "none" as const };
  return { kind: "one" as const, value: logWithBase(target, base) ?? Number.NaN };
}

export function solveLogEquation(base: number, argument: number) {
  const value = logWithBase(argument, base);
  return value === null ? { kind: "none" as const } : { kind: "one" as const, value };
}

export function geometricSeriesSum(first: number, ratio: number, count: number) {
  if (count <= 0) return 0;
  if (snapNearZero(ratio - 1) === 0) return first * count;
  return first * (1 - ratio ** count) / (1 - ratio);
}

export type BalanceTerm = { x: number; n: number };

export function parseBalanceOperand(input: number | string): { ok: true; term: BalanceTerm } | { ok: false; error: string } {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return { ok: false, error: "Operand must be a finite number." };
    return { ok: true, term: { x: 0, n: input } };
  }
  const text = normalizeAlgebraText(input);
  if (!text) return { ok: false, error: "Enter an operand such as 5 or 2x." };
  try {
    const at0 = Number(engine(text).evaluate({ x: 0 }).text());
    const at1 = Number(engine(text).evaluate({ x: 1 }).text());
    if (!Number.isFinite(at0) || !Number.isFinite(at1)) return { ok: false, error: "Operand must be linear." };
    const x = snapNearZero(at1 - at0);
    const n = snapNearZero(at0);
    const at2 = Number(engine(text).evaluate({ x: 2 }).text());
    if (Number.isFinite(at2) && Math.abs(at2 - (2 * x + n)) > 1e-8) {
      return { ok: false, error: "Use a constant or a multiple of x." };
    }
    return { ok: true, term: { x, n } };
  } catch {
    return { ok: false, error: "Could not parse this operand." };
  }
}

export function parseLinearEquation(input: string) {
  const parts = input.split("=");
  if (parts.length !== 2) return { ok: false as const, error: "Enter an equation with one equals sign." };
  const left = parseBalanceOperand(parts[0] ?? "");
  const right = parseBalanceOperand(parts[1] ?? "");
  if (!left.ok) return { ok: false as const, error: left.error };
  if (!right.ok) return { ok: false as const, error: right.error };
  return { ok: true as const, state: { a: left.term.x, b: left.term.n, c: right.term.x, d: right.term.n } };
}

export function formatLinearSide(a: number, b: number) {
  const x = snapNearZero(a);
  const n = snapNearZero(b);
  const xPart = x === 0 ? "" : x === 1 ? "x" : x === -1 ? "−x" : `${formatAlgebraNumber(x)}x`;
  if (!xPart) return n === 0 ? "0" : formatAlgebraNumber(n);
  if (n === 0) return xPart;
  return `${xPart} ${n > 0 ? "+" : "−"} ${formatAlgebraNumber(Math.abs(n))}`;
}

export function formatBalanceTerm(term: BalanceTerm) {
  return formatLinearSide(term.x, term.n);
}

/** Operand shown as a signed chip (e.g. −2x) is the delta to apply; Subtract 2x still removes 2x. */
export function signedBalanceDelta(operation: "Add" | "Subtract", term: BalanceTerm): BalanceTerm {
  if (operation === "Add") return term;
  const alreadySigned = term.x <= 0 && term.n <= 0 && (term.x < 0 || term.n < 0);
  return alreadySigned ? term : { x: -term.x, n: -term.n };
}

export function applyBalanceOperation(
  state: { a: number; b: number; c: number; d: number },
  operation: "Add" | "Subtract" | "Multiply" | "Divide",
  operand: number | string,
  relation: "<" | "<=" | ">" | ">=" = "<",
) {
  const parsed = parseBalanceOperand(operand);
  if (!parsed.ok) return parsed;
  const { x, n } = parsed.term;
  if (operation === "Add" || operation === "Subtract") {
    const delta = signedBalanceDelta(operation, parsed.term);
    return {
      ok: true as const,
      state: {
        a: state.a + delta.x,
        b: state.b + delta.n,
        c: state.c + delta.x,
        d: state.d + delta.n,
      },
      relation,
      flipped: false,
      term: parsed.term,
      delta,
    };
  }
  if (snapNearZero(x) !== 0) {
    return { ok: false as const, error: "Multiply and divide use a nonzero constant, not an x term." };
  }
  if (snapNearZero(n) === 0) {
    return { ok: false as const, error: "Use a nonzero operand to preserve the solution set." };
  }
  const scale = operation === "Multiply" ? n : 1 / n;
  const flipped = scale < 0;
  return {
    ok: true as const,
    state: { a: state.a * scale, b: state.b * scale, c: state.c * scale, d: state.d * scale },
    relation: flipped ? flipRelation(relation) : relation,
    flipped,
    term: parsed.term,
  };
}

export function autoBalanceLinear(state: { a: number; b: number; c: number; d: number }) {
  const solution = solveLinearEquation(state.a, state.b, state.c, state.d);
  if (solution.kind === "one") return { a: 1, b: 0, c: 0, d: solution.value };
  if (solution.kind === "all") return { a: 0, b: 0, c: 0, d: 0 };
  return { a: 0, b: 0, c: 0, d: 1 };
}

export function describeLinearSolution(a: number, b: number, c: number, d: number) {
  const solution = solveLinearEquation(a, b, c, d);
  if (solution.kind === "one") return { kind: "one" as const, value: solution.value, text: `x = ${formatAlgebraNumber(solution.value)}` };
  if (solution.kind === "all") return { kind: "all" as const, text: "All real values (0x = 0)" };
  return { kind: "none" as const, text: "No solution (0x = nonzero)" };
}

export function solveAbsoluteEquation(a: number, b: number, c: number) {
  if (c < 0) return { kind: "none" as const, values: [] as number[], text: "No solution" };
  if (Math.abs(a) < ALGEBRA_EPSILON) {
    if (Math.abs(Math.abs(b) - c) < ALGEBRA_EPSILON) return { kind: "all" as const, values: [] as number[], text: "All real values" };
    return { kind: "none" as const, values: [] as number[], text: "No solution" };
  }
  const values = [...new Set([(-b - c) / a, (-b + c) / a])].map((value) => snapNearZero(value)).sort((left, right) => left - right);
  return { kind: "finite" as const, values, text: values.map((value) => `x = ${formatAlgebraNumber(value)}`).join("; ") };
}

export function solveQuadraticEquation(a: number, b: number, c: number) {
  if (Math.abs(a) < ALGEBRA_EPSILON && Math.abs(b) < ALGEBRA_EPSILON) {
    return { text: Math.abs(c) < ALGEBRA_EPSILON ? "All real values" : "No solution", roots: quadraticRoots(a, b, c) };
  }
  const roots = quadraticRoots(a, b, c);
  return {
    roots,
    text: roots.map((root) => `x = ${formatAlgebraNumber(root.real)}${root.imaginary ? ` + (${formatAlgebraNumber(root.imaginary)})i` : ""}`).join("; "),
  };
}

export function formatInequalitySolution(a: number, b: number, relation: "<" | "<=" | ">" | ">=", c: number) {
  const solution = solveLinearInequality(a, b, relation, c);
  if (solution.kind === "constant") return { ...solution, text: solution.truth ? "All real values" : "No solution" };
  return { ...solution, text: `x ${solution.relation} ${formatAlgebraNumber(solution.boundary)}${solution.reversed ? " (sign reversed)" : ""}` };
}

export function solveTwoByTwo(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) {
  const reduced = solveAugmentedRref([
    [a1, b1, c1],
    [a2, b2, c2],
  ]);
  if (reduced.status === "unique solution" && reduced.solution) {
    return { kind: "one" as const, x: reduced.solution[0] ?? 0, y: reduced.solution[1] ?? 0, rref: reduced.result };
  }
  if (reduced.status === "infinitely many solutions") return { kind: "all" as const, rref: reduced.result };
  return { kind: "none" as const, rref: reduced.result };
}

export function slopeInterceptSystem(m1: number, b1: number, m2: number, b2: number) {
  const linear = solveLinearEquation(m1, b1, m2, b2);
  const matrix = solveTwoByTwo(m1, -1, -b1, m2, -1, -b2);
  if (linear.kind === "one" && matrix.kind === "one") {
    return { kind: "one" as const, x: linear.value, y: m1 * linear.value + b1, rref: matrix.rref };
  }
  if (linear.kind === "all") return { kind: "all" as const, rref: matrix.rref };
  return { kind: "none" as const, rref: matrix.rref };
}

export function reduceMatrix(matrix: number[][]) {
  return rref(matrix);
}

export function addPolynomials(left: number[], right: number[]) {
  const length = Math.max(left.length, right.length);
  const pad = (poly: number[]) => [...Array(length - poly.length).fill(0), ...poly];
  const a = pad(left);
  const b = pad(right);
  return a.map((value, index) => value + (b[index] ?? 0));
}

export function multiplyPolynomials(left: number[], right: number[]) {
  const product = Array(left.length + right.length - 1).fill(0) as number[];
  left.forEach((a, i) => right.forEach((b, j) => { product[i + j] += a * b; }));
  return product;
}

export function classifyProofReason(statement: string, goal = "(a+b)^2") {
  const normalized = normalizeAlgebraText(statement);
  const expandedGoal = runCasOperation(goal, "expand");
  const equivalentToGoal = expressionsEquivalent(normalized, goal) || (expandedGoal.ok && expressionsEquivalent(normalized, expandedGoal.output));
  const expanded = runCasOperation(normalized, "expand");
  const simplified = runCasOperation(normalized, "simplify");
  if (!equivalentToGoal) return { valid: false as const, suggested: "", reason: "not-equivalent" as const };
  if (normalizeAlgebraText(statement).includes("^2") && expressionsEquivalent(normalized, expanded.ok ? expanded.output : normalized)) {
    return { valid: true as const, suggested: "Definition of square", reason: "square" as const };
  }
  if (expanded.ok && expressionsEquivalent(expanded.output, expandedGoal.ok ? expandedGoal.output : "a^2+2*a*b+b^2")) {
    return { valid: true as const, suggested: "Distributive property", reason: "distribute" as const };
  }
  if (simplified.ok) return { valid: true as const, suggested: "Combine like terms", reason: "combine" as const };
  return { valid: true as const, suggested: "Distributive property", reason: "identity" as const };
}

export function reasonMatchesStep(reason: string, classification: ReturnType<typeof classifyProofReason>) {
  const text = reason.toLowerCase();
  if (!classification.valid) return false;
  if (classification.reason === "square") return text.includes("square");
  if (classification.reason === "distribute") return text.includes("distribut");
  if (classification.reason === "combine") return text.includes("like") || text.includes("combin");
  return true;
}

export function factorQuadraticFromTiles(a: number, b: number, c: number) {
  const factored = factorIntegerQuadratic(a, b, c);
  if (!factored) return runCasOperation(`${a}*x^2+(${b})*x+(${c})`, "factor");
  const left = `${formatFactor(factored.left[0], factored.left[1])}`;
  const right = `${formatFactor(factored.right[0], factored.right[1])}`;
  return { ok: true as const, output: `${left}${right}` };
}

function formatFactor(coef: number, constant: number) {
  const x = coef === 1 ? "x" : coef === -1 ? "−x" : `${coef}x`;
  if (constant === 0) return `(${x})`;
  return `(${x} ${constant >= 0 ? "+" : "−"} ${Math.abs(constant)})`;
}

function flipRelation(relation: "<" | "<=" | ">" | ">=") {
  return ({ "<": ">", "<=": ">=", ">": "<", ">=": "<=" } as const)[relation];
}

export function simplifySquareRadical(n: number) {
  if (!Number.isFinite(n)) return { ok: false as const, error: "Enter a finite radicand." };
  if (n < 0) return { ok: false as const, error: "Square root of a negative number is not real." };
  if (snapNearZero(n) === 0) return { ok: true as const, coeff: 0, rest: 1, text: "0" };
  let value = Math.round(n);
  if (Math.abs(value - n) > 1e-9) {
    return { ok: true as const, coeff: 1, rest: n, text: `√${formatAlgebraNumber(n)}` };
  }
  let coeff = 1;
  for (let p = 2; p * p <= value; p += 1) {
    while (value % (p * p) === 0) {
      value /= p * p;
      coeff *= p;
    }
  }
  if (value === 1) return { ok: true as const, coeff, rest: 1, text: formatAlgebraNumber(coeff) };
  if (coeff === 1) return { ok: true as const, coeff: 1, rest: value, text: `√${value}` };
  return { ok: true as const, coeff, rest: value, text: `${coeff}√${value}` };
}

export function geometricInfiniteSum(first: number, ratio: number) {
  if (Math.abs(ratio) >= 1 - 1e-12) return { ok: false as const, text: "does not converge" };
  return { ok: true as const, value: first / (1 - ratio), text: formatAlgebraNumber(first / (1 - ratio)) };
}

export function polynomialCoefficients(input: string) {
  const normalized = normalizeAlgebraText(input.replace(/^y=/i, ""));
  if (!normalized) return { ok: false as const, error: "Enter a polynomial in x." };
  try {
    const expanded = engine(normalized).expand().toString();
    const xs = [0, 1, 2, 3, 4, 5, 6];
    const values = xs.map((x) => Number(engine(expanded).evaluate({ x }).text()));
    if (values.some((value) => !Number.isFinite(value))) return { ok: false as const, error: "Not a polynomial in x." };
    let degree = 0;
    for (let d = 6; d >= 1; d -= 1) {
      const diffs = [...values];
      for (let pass = 0; pass < d; pass += 1) {
        for (let j = diffs.length - 1; j > pass; j -= 1) diffs[j] = (diffs[j] ?? 0) - (diffs[j - 1] ?? 0);
      }
      if (Math.abs(diffs[d] ?? 0) > 1e-6) {
        degree = d;
        break;
      }
    }
    const rows = xs.slice(0, degree + 1).map((x, i) => [
      ...Array.from({ length: degree + 1 }, (_, p) => x ** (degree - p)),
      values[i] ?? 0,
    ]);
    const solved = solveAugmentedRref(rows);
    if (solved.status !== "unique solution" || !solved.solution) return { ok: false as const, error: "Could not read coefficients." };
    const coeffs = solved.solution.map((value) => snapNearZero(value));
    return { ok: true as const, coeffs, degree, constant: coeffs[coeffs.length - 1] ?? 0, leading: coeffs[0] ?? 0 };
  } catch {
    return { ok: false as const, error: "Could not parse this polynomial." };
  }
}

export function quadraticVertex(a: number, b: number, c: number) {
  if (Math.abs(a) < ALGEBRA_EPSILON) return null;
  const x = -b / (2 * a);
  return { x: snapNearZero(x), y: snapNearZero(a * x * x + b * x + c) };
}

export function completeSquareText(a: number, b: number, c: number) {
  if (Math.abs(a) < ALGEBRA_EPSILON) return "Not quadratic.";
  const h = -b / (2 * a);
  const k = c - a * h * h;
  return `${formatAlgebraNumber(a)}(x ${h >= 0 ? "−" : "+"} ${formatAlgebraNumber(Math.abs(h))})² ${k >= 0 ? "+" : "−"} ${formatAlgebraNumber(Math.abs(k))}`;
}

export function inverseFamilyStatus(family: string, a: number) {
  if (snapNearZero(a) === 0) {
    return { invertible: false as const, restricted: false, note: "No inverse: a constant function is not one-to-one." };
  }
  if (family === "sin(x)" || family === "abs(x)") {
    return { invertible: false as const, restricted: true, note: "Not one-to-one on the full real domain, so the inverse is not a function without a restriction." };
  }
  if (family === "x^2") {
    return { invertible: true as const, restricted: true, note: "Restricted inverse uses the principal square root (right branch)." };
  }
  return { invertible: true as const, restricted: false, note: "" };
}

export function inverseExpression(family: string, a: number, h: number, k: number) {
  const inner = `((x-(${k}))/(${a}))`;
  if (family === "x") return `${inner}+(${h})`;
  if (family === "x^2") return `(${h})+sqrt(${inner})`;
  if (family === "sqrt(x)") return `(${h})+(${inner})^2`;
  if (family === "1/x") return `(${h})+1/(${inner})`;
  if (family === "log(x)") return `(${h})+10^(${inner})`;
  if (family === "2^x") return `(${h})+log(${inner})/log(2)`;
  return `${inner}+(${h})`;
}

export function inverseOfTransformedFamily(family: string, a: number, h: number, k: number, y: number) {
  const status = inverseFamilyStatus(family, a);
  if (!status.invertible || !Number.isFinite(y)) return Number.NaN;
  const inner = (y - k) / a;
  let u = Number.NaN;
  if (family === "x") u = inner;
  else if (family === "x^2") u = inner < 0 ? Number.NaN : Math.sqrt(inner);
  else if (family === "sqrt(x)") u = inner < 0 ? Number.NaN : inner * inner;
  else if (family === "1/x") u = snapNearZero(inner) === 0 ? Number.NaN : 1 / inner;
  else if (family === "log(x)") u = 10 ** inner;
  else if (family === "2^x") u = inner <= 0 ? Number.NaN : Math.log2(inner);
  return u + h;
}

export function dividePolynomialStrings(numerator: string, denominator: string) {
  const left = normalizeAlgebraText(numerator);
  const right = normalizeAlgebraText(denominator);
  if (!left || !right) return { ok: false as const, output: "Enter two polynomials." };
  return runCasOperation(`(${left})/(${right})`, "simplify");
}
