export const timeSeriesDefault = [45, 52, 48, 60, 55, 65, 62, 70, 68, 64, 72];
export function movingAverage(values: number[], window = 3) { return values.map((_, index) => index < window - 1 ? null : values.slice(index - window + 1, index + 1).reduce((s, v) => s + v, 0) / window); }
export function trend(values: number[]) { const n = values.length, xMean = (n - 1) / 2, yMean = values.reduce((s, v) => s + v, 0) / n, slope = values.reduce((s, y, x) => s + (x - xMean) * (y - yMean), 0) / values.reduce((s, _, x) => s + (x - xMean) ** 2, 0); return { slope, intercept: yMean - slope * xMean }; }
