export type GraphDataRow = { id: string; x: string; y: string };
export type NumericGraphDataPoint = { x: number; y: number };

export type LinearRegressionResult = {
  slope: number;
  intercept: number;
  rSquared: number;
  line: NumericGraphDataPoint[];
  residuals: Array<{ x: number; observedY: number; predictedY: number }>;
};

export function numericGraphData(rows: GraphDataRow[]): NumericGraphDataPoint[] {
  return rows.filter((row) => row.x.trim() !== "" && row.y.trim() !== "").map((row) => ({ x: Number(row.x), y: Number(row.y) })).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

export function linearRegression(points: NumericGraphDataPoint[]): LinearRegressionResult | null {
  if (points.length < 2) return null;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const denominator = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  if (Math.abs(denominator) < 1e-12) return null;
  const slope = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0) / denominator;
  const intercept = meanY - slope * meanX;
  const residuals = points.map((point) => ({ x: point.x, observedY: point.y, predictedY: slope * point.x + intercept }));
  const totalVariation = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const unexplained = residuals.reduce((sum, point) => sum + (point.observedY - point.predictedY) ** 2, 0);
  const rSquared = totalVariation < 1e-12 ? 1 : 1 - unexplained / totalVariation;
  const xs = points.map((point) => point.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return {
    slope,
    intercept,
    rSquared,
    line: [{ x: minX, y: slope * minX + intercept }, { x: maxX, y: slope * maxX + intercept }],
    residuals,
  };
}

export function parseGraphData(text: string): GraphDataRow[] {
  return text.trim().split(/\r?\n/).map((line, index) => {
    const [x = "", y = ""] = line.trim().split(/[\t,; ]+/);
    return { id: `data-${Date.now()}-${index}`, x, y };
  }).filter((row) => row.x || row.y);
}

export function createBlankGraphDataRows(count = 6): GraphDataRow[] {
  return Array.from({ length: count }, (_, index) => ({ id: `data-row-${Date.now()}-${index}`, x: "", y: "" }));
}
