export const ENUM_PERM_LIMIT = 7;
export const ENUM_DISPLAY_CAP = 24;
export const TREE_NODE_CAP = 96;

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) return 0;
  if (n > 18) return Number.POSITIVE_INFINITY;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

export function permutation(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i += 1) result *= n - i;
  return result;
}

export function combination(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return 0;
  const k = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = (result * (n - k + i)) / i;
  return Math.round(result);
}

export function combinationWithRepetition(n: number, r: number): number {
  if (n <= 0) return r === 0 ? 1 : 0;
  return combination(n + r - 1, r);
}

export function power(base: number, exp: number): number {
  if (exp < 0) return 0;
  return base ** exp;
}

export function ceilDivision(n: number, m: number): number {
  if (m <= 0) return 0;
  return Math.ceil(n / m);
}

export function multisetPermutationCount(counts: number[]): number {
  const n = counts.reduce((sum, value) => sum + value, 0);
  let denom = 1;
  for (const count of counts) denom *= factorial(count);
  return factorial(n) / denom;
}

export function letterCounts(word: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;
  return counts;
}

export function uniqueArrangementCount(word: string): number {
  return multisetPermutationCount(Object.values(letterCounts(word)));
}

export function twoSetUnion(a: number, b: number, intersection: number): number {
  return a + b - intersection;
}

export function threeSetUnion(
  a: number,
  b: number,
  c: number,
  ab: number,
  ac: number,
  bc: number,
  abc: number,
): number {
  return a + b + c - ab - ac - bc + abc;
}

export function pascalTriangle(rows: number): number[][] {
  const cells: number[][] = [];
  for (let n = 0; n < rows; n += 1) {
    cells.push(Array.from({ length: n + 1 }, (_, k) => combination(n, k)));
  }
  return cells;
}

export function generatePermutations(items: string[], r = items.length, cap = 720): string[][] {
  const result: string[][] = [];
  const visit = (used: boolean[], picked: string[]) => {
    if (result.length >= cap) return;
    if (picked.length === r) {
      result.push([...picked]);
      return;
    }
    for (let i = 0; i < items.length; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      picked.push(items[i]!);
      visit(used, picked);
      picked.pop();
      used[i] = false;
    }
  };
  visit(items.map(() => false), []);
  return result;
}

export function generatePermutationsWithRep(alphabet: string[], length: number, cap = 243): string[][] {
  const result: string[][] = [];
  const visit = (picked: string[]) => {
    if (result.length >= cap) return;
    if (picked.length === length) {
      result.push([...picked]);
      return;
    }
    for (const symbol of alphabet) {
      picked.push(symbol);
      visit(picked);
      picked.pop();
    }
  };
  visit([]);
  return result;
}

export function generateCombinations(items: string[], r: number, cap = 220): string[][] {
  const result: string[][] = [];
  const visit = (start: number, picked: string[]) => {
    if (result.length >= cap) return;
    if (picked.length === r) {
      result.push([...picked]);
      return;
    }
    for (let i = start; i < items.length; i += 1) {
      picked.push(items[i]!);
      visit(i + 1, picked);
      picked.pop();
    }
  };
  visit(0, []);
  return result;
}

export function generateSubsets(items: string[]): string[][] {
  const result: string[][] = [[]];
  for (const item of items) {
    const extra = result.map((subset) => [...subset, item]);
    result.push(...extra);
  }
  return result;
}

export function nextPermutation(values: string[]): boolean {
  let i = values.length - 2;
  while (i >= 0 && values[i]! >= values[i + 1]!) i -= 1;
  if (i < 0) return false;
  let j = values.length - 1;
  while (values[j]! <= values[i]!) j -= 1;
  [values[i], values[j]] = [values[j]!, values[i]!];
  const tail = values.splice(i + 1).reverse();
  values.push(...tail);
  return true;
}

export function prevPermutation(values: string[]): boolean {
  let i = values.length - 2;
  while (i >= 0 && values[i]! <= values[i + 1]!) i -= 1;
  if (i < 0) return false;
  let j = values.length - 1;
  while (values[j]! >= values[i]!) j -= 1;
  [values[i], values[j]] = [values[j]!, values[i]!];
  const tail = values.splice(i + 1).reverse();
  values.push(...tail);
  return true;
}

export function evenOccupancy(objects: number, boxes: number): number[] {
  if (boxes <= 0) return [];
  const base = Math.floor(objects / boxes);
  const rem = objects % boxes;
  return Array.from({ length: boxes }, (_, i) => base + (i < rem ? 1 : 0));
}

export function worstOccupancy(objects: number, boxes: number): number[] {
  if (boxes <= 0) return [];
  if (objects <= boxes) return Array.from({ length: boxes }, (_, i) => (i < objects ? 1 : 0));
  const dist = Array.from({ length: boxes }, (_, i) => (i === 0 ? 0 : 1));
  dist[0] = objects - (boxes - 1);
  return dist;
}

export function randomOccupancy(objects: number, boxes: number, seed = Date.now()): number[] {
  if (boxes <= 0) return [];
  const dist = Array.from({ length: boxes }, () => 0);
  let s = seed % 2147483647;
  for (let i = 0; i < objects; i += 1) {
    s = (s * 48271) % 2147483647;
    dist[s % boxes] += 1;
  }
  return dist;
}

export type TreeNode = {
  id: string;
  label: string;
  path: string;
  valid: boolean;
  blocked: boolean;
  children: TreeNode[];
};

function makeNode(id: string, label: string, path: string, valid: boolean, blocked = false): TreeNode {
  return { id, label, path, valid, blocked, children: [] };
}

export function generateBinaryTree(length: number, noConsecutiveOnes = false): TreeNode {
  const root = makeNode("root", "Start", "", true);
  const walk = (node: TreeNode) => {
    if (node.path.length >= length || node.blocked) return;
    for (const bit of ["0", "1"]) {
      const path = `${node.path}${bit}`;
      const blocked = noConsecutiveOnes && node.path.endsWith("1") && bit === "1";
      const child = makeNode(path || bit, bit, path, !blocked, blocked);
      node.children.push(child);
      if (!blocked) walk(child);
    }
  };
  walk(root);
  return root;
}

export function generatePermutationTree(items: string[]): TreeNode {
  const root = makeNode("root", "Start", "", true);
  const walk = (node: TreeNode, remaining: string[]) => {
    if (!remaining.length) return;
    for (const item of remaining) {
      const path = `${node.path}${item}`;
      const child = makeNode(path, item, path, true);
      node.children.push(child);
      walk(child, remaining.filter((next) => next !== item));
    }
  };
  walk(root, items);
  return root;
}

export function generateCombinationTree(items: string[], r: number): TreeNode {
  const root = makeNode("root", "Start", "", true);
  const walk = (node: TreeNode, start: number, picked: string[]) => {
    if (picked.length === r) return;
    for (let i = start; i < items.length; i += 1) {
      const next = [...picked, items[i]!];
      const path = next.join("");
      const child = makeNode(path, items[i]!, path, next.length === r);
      node.children.push(child);
      walk(child, i + 1, next);
    }
  };
  walk(root, 0, []);
  return root;
}

export function generateDiceTree(dice: number, faces: number): TreeNode {
  const root = makeNode("root", "Start", "", true);
  const walk = (node: TreeNode) => {
    if (node.path.length >= dice) return;
    for (let face = 1; face <= faces; face += 1) {
      const path = `${node.path}${face}`;
      const child = makeNode(path, String(face), path, path.length === dice);
      node.children.push(child);
      walk(child);
    }
  };
  walk(root);
  return root;
}

export function generatePathTree(rows: number, cols: number): TreeNode {
  const root = makeNode("root", "S", "", true);
  const walk = (node: TreeNode, r: number, c: number) => {
    if (r === rows && c === cols) {
      node.valid = true;
      return;
    }
    if (c < cols) {
      const path = `${node.path}R`;
      const child = makeNode(path, "R", path, false);
      node.children.push(child);
      walk(child, r, c + 1);
    }
    if (r < rows) {
      const path = `${node.path}D`;
      const child = makeNode(path, "D", path, false);
      node.children.push(child);
      walk(child, r + 1, c);
    }
  };
  walk(root, 0, 0);
  return root;
}

export function countLeaves(node: TreeNode, onlyValid = true): number {
  if (!node.children.length) return onlyValid ? (node.valid && !node.blocked ? 1 : 0) : 1;
  return node.children.reduce((sum, child) => sum + countLeaves(child, onlyValid), 0);
}

export function countNodes(node: TreeNode): number {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
}

export function treeDepth(node: TreeNode): number {
  if (!node.children.length) return 0;
  return 1 + Math.max(...node.children.map(treeDepth));
}

export type LaidOutNode = TreeNode & { x: number; y: number };

export function layoutTree(root: TreeNode, width: number, height: number): LaidOutNode[] {
  const depth = Math.max(1, treeDepth(root));
  const leaves: TreeNode[] = [];
  const collect = (node: TreeNode) => {
    if (!node.children.length) leaves.push(node);
    node.children.forEach(collect);
  };
  collect(root);
  const index = new Map<TreeNode, number>();
  leaves.forEach((leaf, i) => index.set(leaf, i));
  const placed: LaidOutNode[] = [];
  const visit = (node: TreeNode, d: number): number => {
    const x = node.children.length
      ? node.children.reduce((sum, child) => sum + visit(child, d + 1), 0) / node.children.length
      : ((index.get(node) ?? 0) + 0.5) / Math.max(1, leaves.length);
    const y = d / depth;
    placed.push({ ...node, x: 28 + x * (width - 56), y: 28 + y * (height - 56) });
    return x;
  };
  visit(root, 0);
  return placed;
}

export function starsAndBars(counts: number[]): string {
  return counts.map((count) => "★".repeat(count)).join("|");
}

export function letters(n: number): string[] {
  return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
}

export function occupancyMax(dist: number[]): number {
  return dist.reduce((max, value) => Math.max(max, value), 0);
}

export function regionTotals(regions: {
  a: number;
  b: number;
  c: number;
  ab: number;
  ac: number;
  bc: number;
  abc: number;
}) {
  const A = regions.a + regions.ab + regions.ac + regions.abc;
  const B = regions.b + regions.ab + regions.bc + regions.abc;
  const C = regions.c + regions.ac + regions.bc + regions.abc;
  const AB = regions.ab + regions.abc;
  const AC = regions.ac + regions.abc;
  const BC = regions.bc + regions.abc;
  const union = regions.a + regions.b + regions.c + regions.ab + regions.ac + regions.bc + regions.abc;
  return { A, B, C, AB, AC, BC, union, abc: regions.abc };
}

export function surveyToRegions(input: {
  math: number;
  physics: number;
  cs: number;
  mp: number;
  mc: number;
  pc: number;
  all: number;
}) {
  const abc = input.all;
  const ab = input.mp - abc;
  const ac = input.mc - abc;
  const bc = input.pc - abc;
  const a = input.math - ab - ac - abc;
  const b = input.physics - ab - bc - abc;
  const c = input.cs - ac - bc - abc;
  return { a, b, c, ab, ac, bc, abc };
}
