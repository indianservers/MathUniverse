export type ThreeValues = [number, number, number];
export function expectedValueModel(values: ThreeValues, probabilities: ThreeValues) {
  if (!values.every(Number.isFinite) || !probabilities.every(p => Number.isFinite(p) && p >= 0) || Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) > 1e-8) throw new RangeError("A normalized finite distribution is required");
  const products = values.map((x, i) => x * probabilities[i]);
  const mean = products.reduce((a, b) => a + b, 0);
  const moments = values.map((x, i) => (x - mean) * probabilities[i]);
  return { mean, products, moments, left: -moments.filter(m => m < 0).reduce((a, b) => a + b, 0), right: moments.filter(m => m > 0).reduce((a, b) => a + b, 0) };
}
export function rebalanceProbability(previous: ThreeValues, index: number, probability: number): ThreeValues {
  if (!Number.isFinite(probability) || index < 0 || index > 2 || !Number.isInteger(index)) throw new RangeError("Invalid probability control");
  const p = Math.max(0, Math.min(1, Math.round(probability * 100) / 100));
  const others = [0, 1, 2].filter(i => i !== index), previousOther = previous[others[0]] + previous[others[1]];
  const result: ThreeValues = [0, 0, 0]; result[index] = p;
  result[others[0]] = (1 - p) * (previousOther ? previous[others[0]] / previousOther : .5);
  result[others[1]] = 1 - p - result[others[0]];
  return result;
}
export function simulateExpectedValue(values: ThreeValues, probabilities: ThreeValues, count: number, rng = Math.random) {
  expectedValueModel(values, probabilities);
  if (!Number.isInteger(count) || count < 1 || count > 10000) throw new RangeError("Invalid trial count");
  let total = 0;
  return Array.from({ length: count }, (_, i) => { const u = rng(); const value = values[u < probabilities[0] ? 0 : u < probabilities[0] + probabilities[1] ? 1 : 2]; total += value; return { value, average: total / (i + 1) }; });
}
