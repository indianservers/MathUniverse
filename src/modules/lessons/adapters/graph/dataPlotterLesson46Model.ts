export type DataPlotterPoint = { id: number; x: number; y: number };
export type RegressionKind = "linear" | "quadratic" | "none";

export const DEFAULT_DATA_PLOTTER_POINTS: DataPlotterPoint[] = [
  { id: 1, x: 1, y: 32 },
  { id: 2, x: 2, y: 41 },
  { id: 3, x: 3, y: 55 },
  { id: 4, x: 4, y: 60 },
  { id: 5, x: 5, y: 20 },
  { id: 6, x: 6, y: 66 },
  { id: 7, x: 7, y: 72 },
  { id: 8, x: 8, y: 85 },
  { id: 9, x: 9, y: 92 },
  { id: 10, x: 10, y: 95 },
];

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

export function linearRegression(points: DataPlotterPoint[]) {
  const mx = mean(points.map((point) => point.x));
  const my = mean(points.map((point) => point.y));
  const denominator = points.reduce(
    (sum, point) => sum + (point.x - mx) ** 2,
    0,
  );
  const slope =
    denominator === 0
      ? 0
      : points.reduce(
          (sum, point) => sum + (point.x - mx) * (point.y - my),
          0,
        ) / denominator;
  const intercept = my - slope * mx;
  return {
    coefficients: [intercept, slope, 0] as const,
    predict: (x: number) => intercept + slope * x,
    equation: `ŷ = ${slope.toFixed(2)}x ${intercept < 0 ? "−" : "+"} ${Math.abs(intercept).toFixed(2)}`,
  };
}

function solve3(matrix: number[][]) {
  const rows = matrix.map((row) => [...row]);
  for (let column = 0; column < 3; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 3; row += 1)
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column]))
        pivot = row;
    [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
    const divisor = rows[column][column] || 1;
    rows[column] = rows[column].map((value) => value / divisor);
    for (let row = 0; row < 3; row += 1)
      if (row !== column) {
        const factor = rows[row][column];
        rows[row] = rows[row].map(
          (value, index) => value - factor * rows[column][index],
        );
      }
  }
  return [rows[0][3], rows[1][3], rows[2][3]] as const;
}

export function quadraticRegression(points: DataPlotterPoint[]) {
  const sums = (power: number) =>
    points.reduce((sum, point) => sum + point.x ** power, 0);
  const ySums = (power: number) =>
    points.reduce((sum, point) => sum + point.y * point.x ** power, 0);
  const [c, b, a] = solve3([
    [points.length, sums(1), sums(2), ySums(0)],
    [sums(1), sums(2), sums(3), ySums(1)],
    [sums(2), sums(3), sums(4), ySums(2)],
  ]);
  return {
    coefficients: [c, b, a] as const,
    predict: (x: number) => a * x * x + b * x + c,
    equation: `ŷ = ${a.toFixed(2)}x² ${b < 0 ? "−" : "+"} ${Math.abs(b).toFixed(2)}x ${c < 0 ? "−" : "+"} ${Math.abs(c).toFixed(2)}`,
  };
}

export function dataOutlierIds(points: DataPlotterPoint[]) {
  if (points.length < 5) return new Set<number>();
  const candidates = points
    .map((point) => {
      const others = points.filter((item) => item.id !== point.id);
      const fit = linearRegression(others);
      return {
        id: point.id,
        residual: Math.abs(point.y - fit.predict(point.x)),
      };
    })
    .sort((a, b) => a.residual - b.residual);
  const median = candidates[Math.floor(candidates.length / 2)].residual;
  return new Set(
    candidates
      .filter((item) => item.residual > Math.max(12, median * 3))
      .map((item) => item.id),
  );
}

export function dataPlotterAnalysis(
  points: DataPlotterPoint[],
  kind: RegressionKind,
  excludeOutliers: boolean,
) {
  const outlierIds = dataOutlierIds(points);
  const included = excludeOutliers
    ? points.filter((point) => !outlierIds.has(point.id))
    : points;
  const fit =
    kind === "quadratic"
      ? quadraticRegression(included)
      : linearRegression(included);
  const mx = mean(included.map((point) => point.x));
  const my = mean(included.map((point) => point.y));
  const covariance = included.reduce(
    (sum, point) => sum + (point.x - mx) * (point.y - my),
    0,
  );
  const spread = Math.sqrt(
    included.reduce((sum, point) => sum + (point.x - mx) ** 2, 0) *
      included.reduce((sum, point) => sum + (point.y - my) ** 2, 0),
  );
  return {
    outlierIds,
    included,
    fit,
    correlation: spread === 0 ? 0 : covariance / spread,
    residuals: points.map((point) => ({
      ...point,
      residual: point.y - fit.predict(point.x),
    })),
  };
}

export const dataPlotPosition = (point: Pick<DataPlotterPoint, "x" | "y">) => ({
  x: 58 + point.x * 58,
  y: 510 - point.y * 4.6,
});
export const dataPointFromPixels = (pixelX: number, pixelY: number) => ({
  x: Math.max(0, Math.min(10, Math.round((pixelX - 58) / 58))),
  y: Math.max(0, Math.min(100, Math.round((510 - pixelY) / 4.6))),
});
