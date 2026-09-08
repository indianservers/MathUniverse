export type GraphDataRow = { id: string; x: string; y: string };
export type NumericGraphDataPoint = { x: number; y: number };

export type LinearRegressionResult = {
  kind?: RegressionKind;
  slope: number;
  intercept: number;
  coefficients?: number[];
  equation?: string;
  rSquared: number;
  rmse?: number;
  mae?: number;
  line: NumericGraphDataPoint[];
  residuals: Array<{ x: number; observedY: number; predictedY: number }>;
};

export type RegressionKind = "linear" | "quadratic" | "exponential";

export function numericGraphData(
  rows: GraphDataRow[],
): NumericGraphDataPoint[] {
  return rows
    .filter((row) => row.x.trim() !== "" && row.y.trim() !== "")
    .map((row) => ({ x: Number(row.x), y: Number(row.y) }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

export function linearRegression(
  points: NumericGraphDataPoint[],
): LinearRegressionResult | null {
  if (points.length < 2) return null;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const denominator = points.reduce(
    (sum, point) => sum + (point.x - meanX) ** 2,
    0,
  );
  if (Math.abs(denominator) < 1e-12) return null;
  const slope =
    points.reduce(
      (sum, point) => sum + (point.x - meanX) * (point.y - meanY),
      0,
    ) / denominator;
  const intercept = meanY - slope * meanX;
  const residuals = points.map((point) => ({
    x: point.x,
    observedY: point.y,
    predictedY: slope * point.x + intercept,
  }));
  const totalVariation = points.reduce(
    (sum, point) => sum + (point.y - meanY) ** 2,
    0,
  );
  const unexplained = residuals.reduce(
    (sum, point) => sum + (point.observedY - point.predictedY) ** 2,
    0,
  );
  const rSquared =
    totalVariation < 1e-12 ? 1 : 1 - unexplained / totalVariation;
  const xs = points.map((point) => point.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return {
    kind: "linear",
    slope,
    intercept,
    coefficients: [intercept, slope],
    equation: `y = ${formatCoefficient(slope)}x ${intercept < 0 ? "-" : "+"} ${formatCoefficient(Math.abs(intercept))}`,
    rSquared,
    rmse: Math.sqrt(unexplained / points.length),
    mae:
      residuals.reduce(
        (sum, point) => sum + Math.abs(point.observedY - point.predictedY),
        0,
      ) / points.length,
    line: [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept },
    ],
    residuals,
  };
}

export function regressionModel(
  points: NumericGraphDataPoint[],
  kind: RegressionKind,
): LinearRegressionResult | null {
  if (kind === "linear") return linearRegression(points);
  if (kind === "exponential") {
    const positive = points.filter((point) => point.y > 0);
    const transformed = linearRegression(
      positive.map((point) => ({ x: point.x, y: Math.log(point.y) })),
    );
    if (!transformed || positive.length !== points.length) return null;
    const a = Math.exp(transformed.intercept);
    const b = transformed.slope;
    return buildRegressionResult(
      points,
      kind,
      [a, b],
      (x) => a * Math.exp(b * x),
      `y = ${formatCoefficient(a)}e^(${formatCoefficient(b)}x)`,
    );
  }
  if (points.length < 3) return null;
  const sums = (power: number) =>
    points.reduce((sum, point) => sum + point.x ** power, 0);
  const rhs = (power: number) =>
    points.reduce((sum, point) => sum + point.y * point.x ** power, 0);
  const coefficients = solve3([
    [points.length, sums(1), sums(2), rhs(0)],
    [sums(1), sums(2), sums(3), rhs(1)],
    [sums(2), sums(3), sums(4), rhs(2)],
  ]);
  if (!coefficients) return null;
  const [a, b, c] = coefficients;
  return buildRegressionResult(
    points,
    kind,
    coefficients,
    (x) => a + b * x + c * x * x,
    `y = ${formatCoefficient(c)}x² ${signed(b)}x ${signed(a)}`,
  );
}

function buildRegressionResult(
  points: NumericGraphDataPoint[],
  kind: RegressionKind,
  coefficients: number[],
  predict: (x: number) => number,
  equation: string,
): LinearRegressionResult {
  const residuals = points.map((point) => ({
    x: point.x,
    observedY: point.y,
    predictedY: predict(point.x),
  }));
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const total = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const unexplained = residuals.reduce(
    (sum, point) => sum + (point.observedY - point.predictedY) ** 2,
    0,
  );
  const xs = points.map((point) => point.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const line = Array.from({ length: 180 }, (_, index) => {
    const x = minX + (index / 179) * (maxX - minX);
    return { x, y: predict(x) };
  });
  return {
    kind,
    slope: coefficients[1] ?? 0,
    intercept: coefficients[0] ?? 0,
    coefficients,
    equation,
    rSquared: total < 1e-12 ? 1 : 1 - unexplained / total,
    rmse: Math.sqrt(unexplained / points.length),
    mae:
      residuals.reduce(
        (sum, point) => sum + Math.abs(point.observedY - point.predictedY),
        0,
      ) / points.length,
    line,
    residuals,
  };
}

function solve3(matrix: number[][]) {
  const next = matrix.map((row) => [...row]);
  for (let column = 0; column < 3; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 3; row += 1)
      if (Math.abs(next[row][column]) > Math.abs(next[pivot][column]))
        pivot = row;
    if (Math.abs(next[pivot][column]) < 1e-12) return null;
    [next[column], next[pivot]] = [next[pivot], next[column]];
    const divisor = next[column][column];
    for (let index = column; index < 4; index += 1)
      next[column][index] /= divisor;
    for (let row = 0; row < 3; row += 1)
      if (row !== column) {
        const factor = next[row][column];
        for (let index = column; index < 4; index += 1)
          next[row][index] -= factor * next[column][index];
      }
  }
  return next.map((row) => row[3]);
}

function formatCoefficient(value: number) {
  return Number(value.toPrecision(6)).toString();
}
function signed(value: number) {
  return `${value < 0 ? "-" : "+"} ${formatCoefficient(Math.abs(value))}`;
}

export function parseGraphData(text: string): GraphDataRow[] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line, index) => {
      const [x = "", y = ""] = line.trim().split(/[\t,; ]+/);
      return { id: `data-${Date.now()}-${index}`, x, y };
    })
    .filter((row) => row.x || row.y);
}

export function createBlankGraphDataRows(count = 6): GraphDataRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `data-row-${Date.now()}-${index}`,
    x: "",
    y: "",
  }));
}
