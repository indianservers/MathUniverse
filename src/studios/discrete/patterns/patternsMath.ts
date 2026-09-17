export function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function polygonalNumber(sides: number, n: number) {
  if (!Number.isInteger(sides) || !Number.isInteger(n) || sides < 3 || n < 1) return NaN;
  return ((sides - 2) * n * n - (sides - 4) * n) / 2;
}

export function triangularNumber(n: number) {
  return polygonalNumber(3, n);
}

export function squareNumber(n: number) {
  return polygonalNumber(4, n);
}

export function pentagonalNumber(n: number) {
  return polygonalNumber(5, n);
}

export function hexagonalNumber(n: number) {
  return polygonalNumber(6, n);
}

export function heptagonalNumber(n: number) {
  return polygonalNumber(7, n);
}

export function polygonalSequence(sides: number, terms: number) {
  return Array.from({ length: Math.max(0, terms) }, (_, i) => polygonalNumber(sides, i + 1));
}

export function firstDifferences(values: number[]) {
  const out: number[] = [];
  for (let i = 1; i < values.length; i += 1) out.push(values[i]! - values[i - 1]!);
  return out;
}

export function differenceTable(sequence: number[]) {
  const rows: number[][] = [sequence.slice()];
  while (rows[rows.length - 1]!.length > 1) {
    const prev = rows[rows.length - 1]!;
    const next = firstDifferences(prev);
    if (next.length === 0) break;
    rows.push(next);
    if (next.every((v) => v === next[0])) break;
  }
  return rows;
}

export function constantDifferenceDepth(sequence: number[]) {
  const table = differenceTable(sequence);
  for (let i = 1; i < table.length; i += 1) {
    const row = table[i]!;
    if (row.length && row.every((v) => v === row[0])) return i;
  }
  return null;
}

export function inverseTriangularIndex(value: number) {
  if (!Number.isInteger(value) || value < 1) return null;
  const n = (-1 + Math.sqrt(1 + 8 * value)) / 2;
  return Number.isInteger(n) ? n : null;
}

export function inverseSquareIndex(value: number) {
  if (!Number.isInteger(value) || value < 1) return null;
  const n = Math.sqrt(value);
  return Number.isInteger(n) ? n : null;
}

export function inversePolygonalIndex(sides: number, value: number) {
  if (sides === 3) return inverseTriangularIndex(value);
  if (sides === 4) return inverseSquareIndex(value);
  if (!Number.isInteger(sides) || sides < 3 || !Number.isInteger(value) || value < 1) return null;
  const a = sides - 2;
  const b = 4 - sides;
  const disc = b * b + 8 * a * value;
  const root = Math.sqrt(disc);
  if (!Number.isInteger(root)) return null;
  const n = (root - b) / (2 * a);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export function isTriangular(value: number) {
  return inverseTriangularIndex(value) != null;
}

export function squareTriangularNumbers(limit = 20000) {
  const found: number[] = [];
  for (let n = 1; n < 200; n += 1) {
    const s = squareNumber(n);
    if (s > limit) break;
    if (isTriangular(s)) found.push(s);
  }
  return found;
}

export function generateArithmeticSequence(a1: number, d: number, terms: number) {
  const n = Math.max(0, Math.trunc(terms));
  return Array.from({ length: n }, (_, i) => a1 + i * d);
}

export function arithmeticTerm(a1: number, d: number, n: number) {
  return a1 + (n - 1) * d;
}

export function generateGeometricSequence(a1: number, r: number, terms: number) {
  const n = Math.max(0, Math.trunc(terms));
  return Array.from({ length: n }, (_, i) => a1 * r ** i);
}

export function geometricTerm(a1: number, r: number, n: number) {
  return a1 * r ** (n - 1);
}

export function generateFibonacci(terms: number): bigint[] {
  const n = Math.max(0, Math.min(120, Math.trunc(terms)));
  const out: bigint[] = [];
  for (let i = 0; i < n; i += 1) {
    if (i === 0) out.push(0n);
    else if (i === 1) out.push(1n);
    else out.push(out[i - 1]! + out[i - 2]!);
  }
  return out;
}

export const PHI = (1 + Math.sqrt(5)) / 2;

export function fibonacciRatios(terms: number) {
  const fib = generateFibonacci(terms);
  const ratios: number[] = [];
  for (let i = 2; i < fib.length; i += 1) {
    const prev = fib[i - 1]!;
    if (prev === 0n) continue;
    ratios.push(Number(fib[i]!) / Number(prev));
  }
  return ratios;
}

export function combination(n: number, k: number) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= r; i += 1) result = (result * (n - r + i)) / i;
  return Math.round(result);
}

export function pascalRow(n: number) {
  if (!Number.isInteger(n) || n < 0) return [] as number[];
  return Array.from({ length: n + 1 }, (_, k) => combination(n, k));
}

export function pascalTriangle(rows: number) {
  const count = Math.max(0, Math.trunc(rows));
  return Array.from({ length: count }, (_, n) => pascalRow(n));
}

export function rowSum(n: number) {
  return 2 ** n;
}

export function hockeyStick(n: number, r: number) {
  let sum = 0;
  for (let i = r; i <= n; i += 1) sum += combination(i, r);
  return { sum, result: combination(n + 1, r + 1) };
}

export function fibonacciDiagonals(rows: number) {
  const tri = pascalTriangle(rows);
  const sums: number[] = [];
  for (let s = 0; s <= (rows - 1) * 2; s += 1) {
    let total = 0;
    for (let n = 0; n < rows; n += 1) {
      const k = s - n;
      if (k >= 0 && k <= n) total += tri[n]![k]!;
    }
    if (total) sums.push(total);
  }
  return sums;
}

export function binomialExpansion(n: number) {
  return pascalRow(n).map((c, k) => ({ coef: c, a: n - k, b: k }));
}

type Tok =
  | { t: "num"; v: number }
  | { t: "op"; v: string }
  | { t: "ref"; lag: number }
  | { t: "n" }
  | { t: "(" }
  | { t: ")" };

export function tokenizeRecurrence(src: string): Tok[] | null {
  const tokens: Tok[] = [];
  const text = src.replace(/\s+/g, "");
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    if (/^a\[n-(\d+)\]/.test(rest)) {
      const m = rest.match(/^a\[n-(\d+)\]/)!;
      tokens.push({ t: "ref", lag: Number(m[1]) });
      i += m[0].length;
      continue;
    }
    if (rest.startsWith("a(n-1)") || rest.startsWith("a_{n-1}")) {
      tokens.push({ t: "ref", lag: 1 });
      i += rest.startsWith("a(n-1)") ? 6 : 8;
      continue;
    }
    if (rest.startsWith("a(n-2)") || rest.startsWith("a_{n-2}")) {
      tokens.push({ t: "ref", lag: 2 });
      i += rest.startsWith("a(n-2)") ? 6 : 8;
      continue;
    }
    if (rest[0] === "n" && !/[a-z]/i.test(rest[1] ?? "")) {
      tokens.push({ t: "n" });
      i += 1;
      continue;
    }
    if (rest[0] === "(") { tokens.push({ t: "(" }); i += 1; continue; }
    if (rest[0] === ")") { tokens.push({ t: ")" }); i += 1; continue; }
    if ("+-*/".includes(rest[0]!)) { tokens.push({ t: "op", v: rest[0]! }); i += 1; continue; }
    const num = rest.match(/^\d+(\.\d+)?/);
    if (num) {
      tokens.push({ t: "num", v: Number(num[0]) });
      i += num[0].length;
      continue;
    }
    return null;
  }
  return tokens;
}

function parseExpr(tokens: Tok[], pos: { i: number }, env: { n: number; prev: number[] }): number | null {
  const parseFactor = (): number | null => {
    const tok = tokens[pos.i];
    if (!tok) return null;
    if (tok.t === "num") { pos.i += 1; return tok.v; }
    if (tok.t === "n") { pos.i += 1; return env.n; }
    if (tok.t === "ref") {
      pos.i += 1;
      const idx = env.prev.length - tok.lag;
      if (idx < 0) return null;
      return env.prev[idx]!;
    }
    if (tok.t === "op" && (tok.v === "+" || tok.v === "-")) {
      pos.i += 1;
      const v = parseFactor();
      return v == null ? null : tok.v === "-" ? -v : v;
    }
    if (tok.t === "(") {
      pos.i += 1;
      const inner = parseExpr(tokens, pos, env);
      if (tokens[pos.i]?.t !== ")") return null;
      pos.i += 1;
      return inner;
    }
    return null;
  };
  const parseTerm = (): number | null => {
    let v = parseFactor();
    if (v == null) return null;
    while (tokens[pos.i]?.t === "op" && ((tokens[pos.i] as { v: string }).v === "*" || (tokens[pos.i] as { v: string }).v === "/")) {
      const op = (tokens[pos.i] as { v: string }).v;
      pos.i += 1;
      const r = parseFactor();
      if (r == null) return null;
      v = op === "*" ? v * r : r === 0 ? null : v / r;
      if (v == null || !Number.isFinite(v)) return null;
    }
    return v;
  };
  let v = parseTerm();
  if (v == null) return null;
  while (tokens[pos.i]?.t === "op" && ((tokens[pos.i] as { v: string }).v === "+" || (tokens[pos.i] as { v: string }).v === "-")) {
    const op = (tokens[pos.i] as { v: string }).v;
    pos.i += 1;
    const r = parseTerm();
    if (r == null) return null;
    v = op === "+" ? v + r : v - r;
  }
  return v;
}

export function safeEvaluateRecurrence(rule: string, n: number, previous: number[]) {
  const tokens = tokenizeRecurrence(rule);
  if (!tokens) return { ok: false as const, error: "Use only a[n-1], a[n-2], n, and + − × ÷." };
  const pos = { i: 0 };
  const value = parseExpr(tokens, pos, { n, prev: previous });
  if (value == null || pos.i !== tokens.length || !Number.isFinite(value)) {
    return { ok: false as const, error: "Could not evaluate that recurrence." };
  }
  if (Math.abs(value) > 1e12) return { ok: false as const, error: "Value grew too large." };
  return { ok: true as const, value };
}

export function generateCustomRecurrence(a1: number, a2: number | undefined, rule: string, terms: number) {
  const out: number[] = [];
  const count = clampInt(terms, 1, 80);
  for (let i = 1; i <= count; i += 1) {
    if (i === 1) { out.push(a1); continue; }
    if (i === 2 && a2 != null && /a\[n-2\]/.test(rule.replace(/\s+/g, ""))) {
      out.push(a2);
      continue;
    }
    const step = safeEvaluateRecurrence(rule, i, out);
    if (!step.ok) return { ok: false as const, error: step.error, values: out };
    out.push(step.value);
  }
  return { ok: true as const, values: out };
}

export type Point = { x: number; y: number };

export function polygonRing(sides: number, ring: number, radius: number): Point[] {
  if (ring <= 0) return [{ x: 0, y: 0 }];
  const pts: Point[] = [];
  for (let s = 0; s < sides; s += 1) {
    const a0 = (Math.PI * 2 * s) / sides - Math.PI / 2;
    const a1 = (Math.PI * 2 * (s + 1)) / sides - Math.PI / 2;
    for (let t = 0; t < ring; t += 1) {
      const u = t / ring;
      pts.push({
        x: (Math.cos(a0) * (1 - u) + Math.cos(a1) * u) * radius * ring,
        y: (Math.sin(a0) * (1 - u) + Math.sin(a1) * u) * radius * ring,
      });
    }
  }
  return pts;
}

export function figuratePoints(sides: number, n: number, spacing = 18): Point[] {
  if (sides === 3) {
    const pts: Point[] = [];
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c <= r; c += 1) {
        pts.push({ x: (c - r / 2) * spacing, y: r * spacing * 0.9 });
      }
    }
    return pts;
  }
  if (sides === 4) {
    const pts: Point[] = [];
    for (let r = 0; r < n; r += 1) {
      for (let c = 0; c < n; c += 1) pts.push({ x: c * spacing, y: r * spacing });
    }
    return pts;
  }
  const pts: Point[] = [{ x: 0, y: 0 }];
  for (let ring = 1; ring < n; ring += 1) pts.push(...polygonRing(sides, ring, spacing * 0.55));
  return pts;
}

export function squareGnomon(n: number) {
  return 2 * n - 1;
}

export function sierpinskiCount(depth: number) {
  return 3 ** depth;
}

export function kochSegmentCount(iteration: number) {
  return 3 * 4 ** iteration;
}

export function kochPerimeter(iteration: number, p0 = 3) {
  return p0 * (4 / 3) ** iteration;
}

export function cantorSegmentCount(depth: number) {
  return 2 ** depth;
}

export function cantorRemainingLength(depth: number) {
  return (2 / 3) ** depth;
}

export function fractalDimension(copies: number, scale: number) {
  return Math.log(copies) / Math.log(1 / scale);
}

export type KochSeg = { x1: number; y1: number; x2: number; y2: number };

export function kochSegments(iteration: number): KochSeg[] {
  const start: KochSeg[] = [
    { x1: 0, y1: 0, x2: 1, y2: 0 },
    { x1: 1, y1: 0, x2: 0.5, y2: Math.sqrt(3) / 2 },
    { x1: 0.5, y1: Math.sqrt(3) / 2, x2: 0, y2: 0 },
  ];
  let segs = start;
  for (let i = 0; i < iteration; i += 1) {
    const next: KochSeg[] = [];
    for (const s of segs) {
      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;
      const ax = s.x1 + dx / 3;
      const ay = s.y1 + dy / 3;
      const bx = s.x1 + (2 * dx) / 3;
      const by = s.y1 + (2 * dy) / 3;
      const px = ax + dx / 6 - (dy * Math.sqrt(3)) / 6;
      const py = ay + dy / 6 + (dx * Math.sqrt(3)) / 6;
      next.push({ x1: s.x1, y1: s.y1, x2: ax, y2: ay });
      next.push({ x1: ax, y1: ay, x2: px, y2: py });
      next.push({ x1: px, y1: py, x2: bx, y2: by });
      next.push({ x1: bx, y1: by, x2: s.x2, y2: s.y2 });
    }
    segs = next;
  }
  return segs;
}

export function cantorSegments(depth: number): Array<{ left: number; right: number }> {
  let segs = [{ left: 0, right: 1 }];
  for (let i = 0; i < depth; i += 1) {
    segs = segs.flatMap((s) => {
      const w = s.right - s.left;
      return [
        { left: s.left, right: s.left + w / 3 },
        { left: s.right - w / 3, right: s.right },
      ];
    });
  }
  return segs;
}

export type SierpinskiTri = { x: number; y: number; s: number };

export function sierpinskiTriangles(depth: number): SierpinskiTri[] {
  const out: SierpinskiTri[] = [];
  const walk = (x: number, y: number, s: number, d: number) => {
    if (d === 0) {
      out.push({ x, y, s });
      return;
    }
    const h = s / 2;
    walk(x, y, h, d - 1);
    walk(x - h / 2, y + h * Math.sqrt(3) / 2, h, d - 1);
    walk(x + h / 2, y + h * Math.sqrt(3) / 2, h, d - 1);
  };
  walk(0, 0, 1, depth);
  return out;
}

export function parseSequenceInput(raw: string) {
  const parts = raw.split(/[,\s]+/).filter(Boolean);
  if (!parts.length) return { ok: false as const, error: "Enter at least two numbers." };
  const values: number[] = [];
  for (const p of parts) {
    if (!/^-?\d+(\/\d+)?$/.test(p) && !/^-?\d+\.\d+$/.test(p)) {
      return { ok: false as const, error: "Use numbers separated by commas." };
    }
    if (p.includes("/")) {
      const [a, b] = p.split("/").map(Number);
      if (!b) return { ok: false as const, error: "Invalid fraction." };
      values.push(a! / b);
    } else values.push(Number(p));
  }
  return { ok: true as const, values };
}

export function parseRatio(raw: string) {
  const text = raw.trim();
  if (!text) return { ok: false as const, error: "Ratio is empty." };
  if (text.includes("/")) {
    const [a, b] = text.split("/").map((s) => Number(s.trim()));
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return { ok: false as const, error: "Invalid ratio." };
    return { ok: true as const, value: a! / b! };
  }
  const n = Number(text);
  if (!Number.isFinite(n)) return { ok: false as const, error: "Ratio must be a number." };
  return { ok: true as const, value: n };
}
