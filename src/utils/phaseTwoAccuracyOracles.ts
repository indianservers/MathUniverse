export type ComplexValue = { re: number; im: number };

export function complexMultiply(a: ComplexValue, b: ComplexValue): ComplexValue {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function complexPower(value: ComplexValue, exponent: number): ComplexValue {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("Complex power oracle needs a nonnegative integer exponent.");
  let result = { re: 1, im: 0 };
  let factor = value;
  let power = exponent;
  while (power > 0) {
    if (power % 2 === 1) result = complexMultiply(result, factor);
    factor = complexMultiply(factor, factor);
    power = Math.floor(power / 2);
  }
  return result;
}

export function complexRoots(value: ComplexValue, degree: number): ComplexValue[] {
  if (!Number.isInteger(degree) || degree <= 0) throw new Error("Root degree must be a positive integer.");
  const radius = Math.hypot(value.re, value.im) ** (1 / degree);
  const angle = Math.atan2(value.im, value.re);
  return Array.from({ length: degree }, (_, index) => {
    const rootAngle = (angle + 2 * Math.PI * index) / degree;
    return { re: radius * Math.cos(rootAngle), im: radius * Math.sin(rootAngle) };
  });
}

export function factorial(value: number): bigint {
  if (!Number.isInteger(value) || value < 0) throw new Error("Factorial needs a nonnegative integer.");
  let result = 1n;
  for (let n = 2n; n <= BigInt(value); n += 1n) result *= n;
  return result;
}

export function combination(n: number, r: number): bigint {
  if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || r > n) throw new Error("Combination requires integers with 0 <= r <= n.");
  const k = Math.min(r, n - r);
  let result = 1n;
  for (let index = 1; index <= k; index += 1) result = (result * BigInt(n - k + index)) / BigInt(index);
  return result;
}

export type RelationProperties = { reflexive: boolean; symmetric: boolean; antisymmetric: boolean; transitive: boolean; witnesses: Partial<Record<"reflexive" | "symmetric" | "antisymmetric" | "transitive", string>> };

export function analyzeFiniteRelation(elements: readonly string[], pairs: readonly (readonly [string, string])[]): RelationProperties {
  const relation = new Set(pairs.map(([a, b]) => `${a}\u0000${b}`));
  const has = (a: string, b: string) => relation.has(`${a}\u0000${b}`);
  const result: RelationProperties = { reflexive: true, symmetric: true, antisymmetric: true, transitive: true, witnesses: {} };
  for (const a of elements) if (!has(a, a) && result.reflexive) { result.reflexive = false; result.witnesses.reflexive = `(${a},${a}) is missing`; }
  for (const [a, b] of pairs) {
    if (!has(b, a) && result.symmetric) { result.symmetric = false; result.witnesses.symmetric = `(${a},${b}) exists but (${b},${a}) does not`; }
    if (a !== b && has(b, a) && result.antisymmetric) { result.antisymmetric = false; result.witnesses.antisymmetric = `(${a},${b}) and (${b},${a}) both exist`; }
    for (const c of elements) if (has(b, c) && !has(a, c) && result.transitive) { result.transitive = false; result.witnesses.transitive = `(${a},${b}) and (${b},${c}) exist but (${a},${c}) does not`; }
  }
  return result;
}

export function truthFunctionsEquivalent(variableCount: number, left: (values: boolean[]) => boolean, right: (values: boolean[]) => boolean) {
  if (!Number.isInteger(variableCount) || variableCount < 0 || variableCount > 20) throw new Error("Truth-table variable count must be between 0 and 20.");
  for (let mask = 0; mask < 2 ** variableCount; mask += 1) {
    const values = Array.from({ length: variableCount }, (_, index) => Boolean(mask & (1 << index)));
    if (left(values) !== right(values)) return { equivalent: false as const, counterexample: values };
  }
  return { equivalent: true as const, counterexample: null };
}

export function dotProduct(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length) throw new Error("Dot-product dimensions must match.");
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

export function crossProduct3(a: readonly [number, number, number], b: readonly [number, number, number]): [number, number, number] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

export function matrixMultiply(a: readonly (readonly number[])[], b: readonly (readonly number[])[]) {
  if (!a.length || !b.length || !a[0].length || a.some((row) => row.length !== a[0].length) || b.some((row) => row.length !== b[0].length) || a[0].length !== b.length) throw new Error("Matrix dimensions are incompatible.");
  return a.map((row) => b[0].map((_, column) => row.reduce((sum, value, index) => sum + value * b[index][column], 0)));
}

export function determinant2(matrix: readonly [readonly [number, number], readonly [number, number]]) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

export function descriptiveStatistics(values: readonly number[], sample = false) {
  if (!values.length || (sample && values.length < 2)) throw new Error("Dataset is too small for the requested statistic.");
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - (sample ? 1 : 0));
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return { mean, median, variance, standardDeviation: Math.sqrt(variance) };
}

export function bayesPosterior(priors: readonly number[], likelihoods: readonly number[]) {
  if (!priors.length || priors.length !== likelihoods.length || priors.some((p) => p < 0) || likelihoods.some((p) => p < 0 || p > 1)) throw new Error("Bayes inputs are invalid.");
  const weights = priors.map((prior, index) => prior * likelihoods[index]);
  const evidence = weights.reduce((sum, value) => sum + value, 0);
  if (!(evidence > 0)) throw new Error("Evidence probability must be positive.");
  return weights.map((value) => value / evidence);
}

export type WeightedEdge = { from: string; to: string; weight: number };

export function breadthFirstSearch(vertices: readonly string[], edges: readonly WeightedEdge[], start: string) {
  if (!vertices.includes(start)) throw new Error("Start vertex is missing.");
  const adjacency = new Map(vertices.map((vertex) => [vertex, [] as string[]]));
  for (const edge of edges) { adjacency.get(edge.from)?.push(edge.to); adjacency.get(edge.to)?.push(edge.from); }
  const queue = [start];
  const visited = new Set([start]);
  const order: string[] = [];
  while (queue.length) {
    const vertex = queue.shift()!;
    order.push(vertex);
    for (const neighbor of adjacency.get(vertex) ?? []) if (!visited.has(neighbor)) { visited.add(neighbor); queue.push(neighbor); }
  }
  return order;
}

export function dijkstra(vertices: readonly string[], edges: readonly WeightedEdge[], start: string) {
  if (edges.some((edge) => edge.weight < 0)) throw new Error("Dijkstra requires nonnegative weights.");
  const distance = new Map(vertices.map((vertex) => [vertex, vertex === start ? 0 : Infinity]));
  const unvisited = new Set(vertices);
  while (unvisited.size) {
    const current = [...unvisited].reduce((best, vertex) => (distance.get(vertex)! < distance.get(best)! ? vertex : best));
    unvisited.delete(current);
    for (const edge of edges.filter((item) => item.from === current || item.to === current)) {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!unvisited.has(neighbor)) continue;
      distance.set(neighbor, Math.min(distance.get(neighbor)!, distance.get(current)! + edge.weight));
    }
  }
  return Object.fromEntries(distance);
}

export function finiteDifferenceGradient(fn: (point: number[]) => number, point: readonly number[], h = 1e-5) {
  if (!(h > 0)) throw new Error("Gradient step must be positive.");
  return point.map((_, index) => {
    const plus = [...point]; const minus = [...point];
    plus[index] += h; minus[index] -= h;
    return (fn(plus) - fn(minus)) / (2 * h);
  });
}

export function modularPower(base: bigint, exponent: bigint, modulus: bigint) {
  if (exponent < 0n || modulus <= 0n) throw new Error("Modular power needs nonnegative exponent and positive modulus.");
  let result = 1n % modulus;
  let factor = ((base % modulus) + modulus) % modulus;
  let power = exponent;
  while (power > 0n) { if (power & 1n) result = (result * factor) % modulus; factor = (factor * factor) % modulus; power >>= 1n; }
  return result;
}
