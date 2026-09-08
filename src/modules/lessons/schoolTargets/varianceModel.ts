export type VarianceMode = "weighted" | "equal" | "point";
export function varianceModel(spread: number, mode: VarianceMode = "weighted") {
  if (!Number.isFinite(spread) || spread < 0 || spread > 100) throw new RangeError("Spread must be in [0,100]");
  const distance = 1 + spread / 100, values = [1 - distance, 1, 1 + distance];
  const probabilities = mode === "equal" ? [1 / 3, 1 / 3, 1 / 3] : mode === "point" ? [0, 1, 0] : [.25, .5, .25];
  const mean = values.reduce((sum, x, i) => sum + x * probabilities[i], 0);
  const rows = values.map((x, i) => ({ x, p: probabilities[i], deviation: x - mean, squared: (x - mean) ** 2, weighted: probabilities[i] * (x - mean) ** 2, signed: probabilities[i] * (x - mean), second: x * x * probabilities[i] }));
  const variance = rows.reduce((sum, row) => sum + row.weighted, 0), secondMoment = rows.reduce((sum, row) => sum + row.second, 0);
  return { values, probabilities, mean, rows, variance, sd: Math.sqrt(variance), secondMoment, shortcut: secondMoment - mean ** 2 };
}
export const spreadFromX = (x: number) => Math.max(0, Math.min(100, Math.round((Math.abs(x - 1) - 1) * 100)));
