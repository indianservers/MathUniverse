export type FunctionId = "square" | "cube" | "sin" | "cos" | "exp" | "ln" | "reciprocal" | "quadratic" | "sinLinear" | "gaussian";
export type RiemannMethod = "left" | "right" | "midpoint";
export type Point = { x: number; y: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function evaluateFunction(functionId: FunctionId, x: number) {
  if (functionId === "square") return x * x;
  if (functionId === "cube") return x * x * x;
  if (functionId === "sin") return Math.sin(x);
  if (functionId === "cos") return Math.cos(x);
  if (functionId === "exp") return Math.exp(clamp(x, -4, 4));
  if (functionId === "ln") return x > 0 ? Math.log(x) : Number.NaN;
  if (functionId === "reciprocal") return Math.abs(x) > 0.05 ? 1 / x : Number.NaN;
  if (functionId === "quadratic") return x * x - 4 * x + 3;
  if (functionId === "sinLinear") return Math.sin(x) + 0.5 * x;
  return Math.exp(-x * x);
}

export function derivativeExact(functionId: FunctionId, x: number) {
  if (functionId === "square") return 2 * x;
  if (functionId === "cube") return 3 * x * x;
  if (functionId === "sin") return Math.cos(x);
  if (functionId === "cos") return -Math.sin(x);
  if (functionId === "exp") return Math.exp(clamp(x, -4, 4));
  if (functionId === "ln") return x > 0 ? 1 / x : Number.NaN;
  if (functionId === "reciprocal") return Math.abs(x) > 0.05 ? -1 / (x * x) : Number.NaN;
  if (functionId === "quadratic") return 2 * x - 4;
  if (functionId === "sinLinear") return Math.cos(x) + 0.5;
  return -2 * x * Math.exp(-x * x);
}

export function derivativeApprox(functionId: FunctionId, x: number, h: number) {
  return (evaluateFunction(functionId, x + h) - evaluateFunction(functionId, x)) / h;
}

export function secondDerivativeApprox(functionId: FunctionId, x: number, h: number) {
  return (evaluateFunction(functionId, x + h) - 2 * evaluateFunction(functionId, x) + evaluateFunction(functionId, x - h)) / (h * h);
}

export function secantSlope(functionId: FunctionId, x: number, h: number) {
  return derivativeApprox(functionId, x, h);
}

export function tangentLineAt(functionId: FunctionId, x: number) {
  const y = evaluateFunction(functionId, x);
  const m = derivativeExact(functionId, x);
  return { point: { x, y }, slope: m, intercept: y - m * x };
}

export function riemannSum(functionId: FunctionId, a: number, b: number, n: number, method: RiemannMethod) {
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const x = method === "right" ? a + (i + 1) * dx : method === "midpoint" ? a + (i + 0.5) * dx : a + i * dx;
    const y = evaluateFunction(functionId, x);
    if (Number.isFinite(y)) sum += y * dx;
  }
  return sum;
}

export function definiteIntegralApprox(functionId: FunctionId, a: number, b: number, n = 240) {
  return riemannSum(functionId, a, b, n, "midpoint");
}

export function generateFunctionPoints(functionId: FunctionId, xMin: number, xMax: number, samples = 160) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: evaluateFunction(functionId, x) };
  }).filter((point) => Number.isFinite(point.y));
}

export function generateDerivativePoints(functionId: FunctionId, xMin: number, xMax: number, samples = 160) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = xMin + (index / samples) * (xMax - xMin);
    return { x, y: derivativeExact(functionId, x) };
  }).filter((point) => Number.isFinite(point.y));
}

export function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

export function taylorPolynomial(functionId: FunctionId, center: number, order: number, x: number) {
  if (functionId === "exp") return Array.from({ length: order + 1 }, (_, k) => (x - center) ** k / factorial(k)).reduce((a, b) => a + b, 0) * Math.exp(center);
  if (functionId === "sin") return Array.from({ length: order + 1 }, (_, k) => derivativeCycle("sin", k, center) * (x - center) ** k / factorial(k)).reduce((a, b) => a + b, 0);
  if (functionId === "cos") return Array.from({ length: order + 1 }, (_, k) => derivativeCycle("cos", k, center) * (x - center) ** k / factorial(k)).reduce((a, b) => a + b, 0);
  return evaluateFunction(functionId, center) + derivativeExact(functionId, center) * (x - center) + secondDerivativeApprox(functionId, center, 0.01) * (x - center) ** 2 / 2;
}

function derivativeCycle(functionId: "sin" | "cos", order: number, x: number) {
  const cycle = functionId === "sin" ? [Math.sin, Math.cos, (v: number) => -Math.sin(v), (v: number) => -Math.cos(v)] : [Math.cos, (v: number) => -Math.sin(v), (v: number) => -Math.cos(v), Math.sin];
  return cycle[order % 4](x);
}

export function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) < 0.0001) return "0";
  return Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(3);
}

export function formatExpression(functionId: FunctionId) {
  const expressions: Record<FunctionId, string> = {
    square: "f(x) = x^2",
    cube: "f(x) = x^3",
    sin: "f(x) = sin x",
    cos: "f(x) = cos x",
    exp: "f(x) = e^x",
    ln: "f(x) = ln x",
    reciprocal: "f(x) = 1/x",
    quadratic: "f(x) = x^2 - 4x + 3",
    sinLinear: "f(x) = sin x + 0.5x",
    gaussian: "f(x) = e^(-x^2)",
  };
  return expressions[functionId];
}

export function mapMathToSvg(point: Point, origin = { x: 320, y: 285 }, scale = { x: 58, y: 44 }) {
  return { x: origin.x + point.x * scale.x, y: origin.y - point.y * scale.y };
}
