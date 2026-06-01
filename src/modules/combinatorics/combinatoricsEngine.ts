export type CountingNode = {
  id: string;
  label: string;
  depth: number;
  children: CountingNode[];
};

export function factorial(n: number): bigint {
  if (!Number.isInteger(n) || n < 0) throw new Error("Factorial requires a nonnegative integer.");
  let result = 1n;
  for (let value = 2n; value <= BigInt(n); value += 1n) result *= value;
  return result;
}

export function permutations(n: number, r: number, repetition = false): bigint {
  if (r < 0 || n < 0) throw new Error("Permutation inputs must be nonnegative.");
  if (repetition) return BigInt(n) ** BigInt(r);
  if (r > n) return 0n;
  return factorial(n) / factorial(n - r);
}

export function combinations(n: number, r: number, repetition = false): bigint {
  if (r < 0 || n < 0) throw new Error("Combination inputs must be nonnegative.");
  if (repetition) return combinations(n + r - 1, r);
  if (r > n) return 0n;
  const k = Math.min(r, n - r);
  let numerator = 1n;
  let denominator = 1n;
  for (let index = 1; index <= k; index += 1) {
    numerator *= BigInt(n - k + index);
    denominator *= BigInt(index);
  }
  return numerator / denominator;
}

export function constrainedRepetitions(total: number, slots: number, maxPerSlot: number) {
  if (total < 0 || slots < 0 || maxPerSlot < 0) return 0n;
  const memo = new Map<string, bigint>();
  const count = (remaining: number, slot: number): bigint => {
    const key = `${remaining}:${slot}`;
    if (memo.has(key)) return memo.get(key)!;
    if (slot === slots) return remaining === 0 ? 1n : 0n;
    let ways = 0n;
    for (let value = 0; value <= Math.min(maxPerSlot, remaining); value += 1) ways += count(remaining - value, slot + 1);
    memo.set(key, ways);
    return ways;
  };
  return count(total, 0);
}

export function buildCountingTree(items: string[], depth: number, allowRepeat: boolean): CountingNode {
  const source = items.slice(0, 5);
  const build = (prefix: string[], available: string[]): CountingNode => ({
    id: prefix.join("") || "root",
    label: prefix.length ? prefix.join("") : "start",
    depth: prefix.length,
    children: prefix.length >= depth
      ? []
      : (allowRepeat ? source : available).map((item) => build([...prefix, item], allowRepeat ? source : available.filter((next) => next !== item))),
  });
  return build([], source);
}

export function enumeratePermutations(items: string[], r: number, allowRepeat: boolean, constraint?: string) {
  const root = buildCountingTree(items, r, allowRepeat);
  const results: string[][] = [];
  const visit = (node: CountingNode, path: string[]) => {
    if (!node.children.length && path.length === r) {
      if (!constraint || path.join("").includes(constraint)) results.push(path);
      return;
    }
    node.children.forEach((child) => visit(child, child.label === "start" ? path : [...path, child.label.slice(-1)]));
  };
  root.children.forEach((child) => visit(child, [child.label]));
  return results.slice(0, 240);
}

export function enumerateCombinations(items: string[], r: number) {
  const result: string[][] = [];
  const visit = (start: number, picked: string[]) => {
    if (picked.length === r) {
      result.push(picked);
      return;
    }
    for (let index = start; index < items.length; index += 1) visit(index + 1, [...picked, items[index]]);
  };
  visit(0, []);
  return result.slice(0, 240);
}

export function pascalRow(n: number) {
  return Array.from({ length: n + 1 }, (_, k) => combinations(n, k));
}

export function pascalTriangle(rows: number) {
  return Array.from({ length: rows + 1 }, (_, row) => pascalRow(row));
}

export function binomialExpansion(a: string, b: string, n: number) {
  return pascalRow(n).map((coefficient, k) => ({
    coefficient,
    k,
    term: `${coefficient}${a}^${n - k}${b}^${k}`,
    explanation: `Choose ${k} copies of ${b}; coefficient C(${n},${k}) = ${coefficient}.`,
  }));
}

export function multinomialTerms(variables: string[], n: number) {
  const vars = variables.slice(0, 4);
  const terms: Array<{ powers: number[]; coefficient: bigint; term: string }> = [];
  const visit = (remaining: number, index: number, powers: number[]) => {
    if (index === vars.length - 1) {
      const complete = [...powers, remaining];
      const coefficient = factorial(n) / complete.reduce((acc, power) => acc * factorial(power), 1n);
      terms.push({
        powers: complete,
        coefficient,
        term: `${coefficient}${complete.map((power, powerIndex) => `${vars[powerIndex]}^${power}`).join("")}`,
      });
      return;
    }
    for (let value = 0; value <= remaining; value += 1) visit(remaining - value, index + 1, [...powers, value]);
  };
  visit(n, 0, []);
  return terms;
}

export function inclusionExclusion(a: number, b: number, c: number, ab: number, ac: number, bc: number, abc: number) {
  return {
    union: a + b + c - ab - ac - bc + abc,
    steps: [
      `Start with |A| + |B| + |C| = ${a + b + c}.`,
      `Subtract pair overlaps: ${ab} + ${ac} + ${bc}.`,
      `Add triple overlap once: ${abc}.`,
      `Union size = ${a + b + c - ab - ac - bc + abc}.`,
    ],
  };
}

export function worksheetSummary(n: number, r: number) {
  return [
    `Permutation without repetition: P(${n},${r}) = ${permutations(n, r).toString()}`,
    `Permutation with repetition: ${n}^${r} = ${permutations(n, r, true).toString()}`,
    `Combination without repetition: C(${n},${r}) = ${combinations(n, r).toString()}`,
    `Combination with repetition: C(${n + r - 1},${r}) = ${combinations(n, r, true).toString()}`,
  ].join("\n");
}
