export function mean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(values: number[]) {
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  let best = values[0] ?? 0;
  let bestCount = 0;
  counts.forEach((count, value) => {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  });
  return best;
}

export function range(values: number[]) {
  return values.length ? Math.max(...values) - Math.min(...values) : 0;
}

export function variance(values: number[], sample = false) {
  if (!values.length || (sample && values.length < 2)) return 0;
  const average = mean(values);
  return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - (sample ? 1 : 0));
}

export function standardDeviation(values: number[], sample = false) {
  return Math.sqrt(variance(values, sample));
}

export function quartiles(values: number[]) {
  if (!values.length) return { q1: 0, q2: 0, q3: 0, iqr: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const lower = sorted.slice(0, middle);
  const upper = sorted.slice(sorted.length % 2 ? middle + 1 : middle);
  const q1 = median(lower.length ? lower : sorted);
  const q2 = median(sorted);
  const q3 = median(upper.length ? upper : sorted);
  return { q1, q2, q3, iqr: q3 - q1 };
}

export function describe(values: number[], sample = false) {
  const finite = values.filter(Number.isFinite);
  const spread = quartiles(finite);
  return {
    count: finite.length,
    mean: mean(finite),
    median: median(finite),
    mode: mode(finite),
    range: range(finite),
    variance: variance(finite, sample),
    standardDeviation: standardDeviation(finite, sample),
    minimum: finite.length ? Math.min(...finite) : 0,
    maximum: finite.length ? Math.max(...finite) : 0,
    ...spread,
  };
}
