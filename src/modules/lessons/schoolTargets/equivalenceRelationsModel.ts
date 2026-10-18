export type Node = "a" | "b" | "c" | "d" | "e" | "f";
export type Pair = `${Node},${Node}`;
export const nodes: Node[] = ["a", "b", "c", "d", "e", "f"];
export const k = (a: Node, b: Node): Pair => `${a},${b}`;
export const groups: Node[][] = [["a", "b", "c"], ["d", "e"], ["f"]];
// The reference matrix contains 9 + 4 + 1 = 14 ordered pairs.
export const initial = groups.flatMap((group) =>
  group.flatMap((a) => group.map((b) => k(a, b))),
);
export function diagnose(relation: Set<Pair>) {
  const reflexive = nodes.find((a) => !relation.has(k(a, a)));
  const symmetric = nodes
    .flatMap((a) => nodes.map((b) => [a, b] as const))
    .find(([a, b]) => relation.has(k(a, b)) && !relation.has(k(b, a)));
  const transitive = nodes
    .flatMap((a) => nodes.flatMap((b) => nodes.map((c) => [a, b, c] as const)))
    .find(
      ([a, b, c]) =>
        relation.has(k(a, b)) &&
        relation.has(k(b, c)) &&
        !relation.has(k(a, c)),
    );
  return {
    reflexive,
    symmetric,
    transitive,
    valid: !reflexive && !symmetric && !transitive,
  };
}
export function partition(relation: Set<Pair>) {
  if (!diagnose(relation).valid) return [];
  const unseen = new Set(nodes),
    result: Node[][] = [];
  while (unseen.size) {
    const seed = unseen.values().next().value as Node;
    const group = nodes.filter((n) => relation.has(k(seed, n)));
    group.forEach((n) => unseen.delete(n));
    result.push(group);
  }
  return result;
}

