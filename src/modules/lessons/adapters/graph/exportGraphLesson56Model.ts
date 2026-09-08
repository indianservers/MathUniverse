export type ExportBounds56 = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};
export const EXPORT_BOUNDS_56: ExportBounds56 = {
  xMin: -7,
  xMax: 7,
  yMin: -0.75,
  yMax: 1.75,
};
export const EXPORT_FIT_BOUNDS_56: ExportBounds56 = {
  xMin: -5,
  xMax: 5,
  yMin: -0.2,
  yMax: 1.2,
};

export function logisticValue56(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function exportPoint56(
  x: number,
  y: number,
  bounds: ExportBounds56,
  width: number,
  height: number,
) {
  return {
    x: ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    y: ((bounds.yMax - y) / (bounds.yMax - bounds.yMin)) * height,
  };
}

export function logisticPath56(
  bounds: ExportBounds56,
  width: number,
  height: number,
) {
  const points: string[] = [];
  for (let pixel = 0; pixel <= width; pixel += 3) {
    const x = bounds.xMin + (pixel / width) * (bounds.xMax - bounds.xMin);
    const point = exportPoint56(x, logisticValue56(x), bounds, width, height);
    points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }
  return points.join(" ");
}

export function exportXFromPixel56(
  pixel: number,
  bounds: ExportBounds56,
  width: number,
) {
  const x = bounds.xMin + (pixel / width) * (bounds.xMax - bounds.xMin);
  return Math.max(bounds.xMin, Math.min(bounds.xMax, Math.round(x * 10) / 10));
}

export function exportFilename56(value: string) {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "export-graph-logistic";
}

export function formatExportValue56(value: number) {
  return (Math.round(value * 1000) / 1000).toString();
}
