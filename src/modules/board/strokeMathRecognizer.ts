import { calculateBounds, unionBounds } from "./boardGeometry";
import type {
  BoundingBox,
  MathRecognitionResult,
  RecognitionAlternative,
  StrokeElement,
} from "./types";

type Point = { x: number; y: number };

export type ClassifiedGlyph = {
  symbol: string;
  confidence: number;
  alternatives: Array<{ symbol: string; confidence: number }>;
  bounds: BoundingBox;
};

const CONFUSED_DIGITS: Record<string, string[]> = {
  "3": ["6", "8", "5"],
  "6": ["0", "8", "5"],
  "0": ["6", "8", "O"],
  "8": ["3", "6", "0"],
  "5": ["3", "S", "6"],
  "1": ["7", "l", "I"],
  "7": ["1", "2"],
  "2": ["7", "Z"],
  "4": ["9", "A"],
  "9": ["4", "g", "0"],
};

export function resamplePoints(points: Point[], count = 64): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: count }, () => ({ ...points[0] }));
  const distances = [0];
  for (let index = 1; index < points.length; index += 1) {
    distances.push(
      distances[index - 1] +
        Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y),
    );
  }
  const length = distances[distances.length - 1];
  if (length < 1e-6) return Array.from({ length: count }, () => ({ ...points[0] }));
  const step = length / (count - 1);
  const sampled: Point[] = [points[0]];
  let cursor = 1;
  for (let index = 1; index < count - 1; index += 1) {
    const target = step * index;
    while (cursor < distances.length && distances[cursor] < target) cursor += 1;
    const previous = points[cursor - 1];
    const current = points[Math.min(cursor, points.length - 1)];
    const span = distances[cursor] - distances[cursor - 1] || 1;
    const t = (target - distances[cursor - 1]) / span;
    sampled.push({
      x: previous.x + (current.x - previous.x) * t,
      y: previous.y + (current.y - previous.y) * t,
    });
  }
  sampled.push(points[points.length - 1]);
  return sampled;
}

function occupancy(points: Point[], columns = 10, rows = 14) {
  const grid = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
  for (const point of points) {
    const column = Math.min(columns - 1, Math.max(0, Math.floor(point.x * (columns - 1e-6))));
    const row = Math.min(rows - 1, Math.max(0, Math.floor(point.y * (rows - 1e-6))));
    grid[row][column] = 1;
  }
  return grid;
}

function floodFromBorder(grid: number[][]) {
  const rows = grid.length;
  const columns = grid[0]?.length ?? 0;
  const seen = grid.map((row) => row.map((cell) => cell === 1));
  const queue: Array<[number, number]> = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if ((row === 0 || column === 0 || row === rows - 1 || column === columns - 1) && grid[row][column] === 0) {
        seen[row][column] = true;
        queue.push([row, column]);
      }
    }
  }
  while (queue.length) {
    const [row, column] = queue.pop()!;
    for (const [nextRow, nextColumn] of [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ] as const) {
      if (
        nextRow < 0 ||
        nextColumn < 0 ||
        nextRow >= rows ||
        nextColumn >= columns ||
        seen[nextRow][nextColumn]
      ) {
        continue;
      }
      seen[nextRow][nextColumn] = true;
      queue.push([nextRow, nextColumn]);
    }
  }
  return seen;
}

function holeRatio(grid: number[][], rowStart: number, rowEnd: number) {
  const seen = floodFromBorder(grid);
  let empty = 0;
  let enclosed = 0;
  for (let row = rowStart; row < rowEnd; row += 1) {
    for (let column = 0; column < (grid[row]?.length ?? 0); column += 1) {
      if (grid[row][column] === 1) continue;
      empty += 1;
      if (!seen[row][column]) enclosed += 1;
    }
  }
  return empty ? enclosed / empty : 0;
}

function leftOpenness(grid: number[][]) {
  const columns = grid[0]?.length ?? 0;
  if (!columns) return 0;
  const leftSpan = Math.max(2, Math.round(columns * 0.35));
  let open = 0;
  for (const row of grid) {
    const filled = row.slice(0, leftSpan).reduce((sum, cell) => sum + cell, 0);
    if (filled <= 1) open += 1;
  }
  return open / grid.length;
}

function rightLobes(points: Point[]) {
  let lobes = 0;
  for (let index = 2; index < points.length - 2; index += 1) {
    if (
      points[index].x > 0.62 &&
      points[index].x >= points[index - 1].x &&
      points[index].x >= points[index + 1].x &&
      points[index].x > points[index - 2].x &&
      points[index].x > points[index + 2].x
    ) {
      lobes += 1;
    }
  }
  return lobes;
}

function normalizeGlyph(points: Point[]) {
  const bounds = calculateBounds(points);
  const width = Math.max(bounds.width, 1);
  const height = Math.max(bounds.height, 1);
  return points.map((point) => ({
    x: (point.x - bounds.x) / width,
    y: (point.y - bounds.y) / height,
  }));
}

export function classifyDigit(points: Point[]): ClassifiedGlyph["alternatives"] {
  const sampled = resamplePoints(normalizeGlyph(points), 72);
  if (sampled.length < 8) return [{ symbol: "?", confidence: 0 }];
  const start = sampled[0];
  const end = sampled[sampled.length - 1];
  const closed = Math.hypot(start.x - end.x, start.y - end.y) < 0.28;
  const bothEndsLeft = start.x < 0.42 && end.x < 0.42;
  const startTop = start.y < 0.28;
  const grid = occupancy(sampled);
  const fullHole = holeRatio(grid, 0, grid.length);
  const topHole = holeRatio(grid, 0, Math.floor(grid.length * 0.55));
  const bottomHole = holeRatio(grid, Math.floor(grid.length * 0.4), grid.length);
  const openLeft = leftOpenness(grid);
  const lobes = rightLobes(sampled);
  const aspect = calculateBounds(points).height / Math.max(calculateBounds(points).width, 1);

  const scores: Record<string, number> = {
    "0": (closed ? 1.4 : 0) + fullHole * 2.4 + (aspect < 1.7 ? 0.3 : 0) - (bothEndsLeft ? 0.8 : 0),
    "1": (aspect > 2.2 ? 1.6 : 0) + (calculateBounds(points).width < 18 ? 0.6 : 0),
    "3": bothEndsLeft
      ? openLeft * 2.2 +
        Math.min(2, lobes) * 0.7 +
        (bottomHole < 0.08 ? 1.4 : 0) +
        (fullHole < 0.08 ? 0.6 : 0) -
        (closed ? 1.1 : 0) -
        bottomHole * 2.6 +
        1.8
      : -2,
    "6":
      bottomHole * 3.2 +
      (startTop ? 0.7 : 0) +
      (closed || bottomHole > 0.12 ? 0.8 : 0) -
      (bothEndsLeft ? 1.6 : 0) -
      openLeft * 1.1,
    "8": (fullHole > 0.08 ? 0.6 : 0) + topHole * 1.4 + bottomHole * 1.4 - (bothEndsLeft ? 0.7 : 0),
    "9": topHole * 2.6 + (end.y > 0.7 ? 0.5 : 0) - bottomHole * 1.2,
    "5": (openLeft > 0.4 && startTop ? 0.8 : 0) + (lobes === 1 ? 0.4 : 0),
  };

  return Object.entries(scores)
    .sort((left, right) => right[1] - left[1])
    .map(([symbol, score]) => ({
      symbol,
      confidence: Math.max(0.05, Math.min(0.96, 0.28 + score / 4.2)),
    }));
}

function classifyLetter(points: Point[]): ClassifiedGlyph["alternatives"] {
  const sampled = resamplePoints(normalizeGlyph(points), 64);
  const start = sampled[0];
  const end = sampled[sampled.length - 1];
  const bounds = calculateBounds(points);
  const aspect = bounds.height / Math.max(bounds.width, 1);
  const openLeft = leftOpenness(occupancy(sampled));
  const openRight = leftOpenness(
    occupancy(sampled.map((point) => ({ x: 1 - point.x, y: point.y }))),
  );
  const closed = Math.hypot(start.x - end.x, start.y - end.y) < 0.3;
  const inflections = sampled.filter((point, index) => {
    if (index < 2 || index > sampled.length - 3) return false;
    const prev = sampled[index - 1].x - sampled[index - 2].x;
    const next = sampled[index + 1].x - point.x;
    return prev * next < 0 && Math.abs(prev) + Math.abs(next) > 0.04;
  }).length;

  const scores: Record<string, number> = {
    s: inflections >= 2 && openLeft > 0.25 && openRight > 0.2 ? 1.8 : 0.2,
    i: aspect > 2.1 && bounds.width < bounds.height * 0.45 ? 1.6 : 0.1,
    n: aspect > 1.1 && inflections >= 1 && !closed ? 0.9 : 0.2,
    "(": openRight > 0.45 && openLeft < 0.35 ? 1.5 : 0.1,
    ")": openLeft > 0.45 && openRight < 0.35 ? 1.5 : 0.1,
    o: closed ? 1.2 : 0.1,
    c: openRight > 0.4 && !closed ? 1.1 : 0.1,
  };

  return Object.entries(scores)
    .sort((left, right) => right[1] - left[1])
    .map(([symbol, score]) => ({
      symbol,
      confidence: Math.max(0.05, Math.min(0.9, 0.2 + score / 2.4)),
    }));
}

function clusterStrokes(strokes: StrokeElement[]): StrokeElement[][] {
  const ordered = [...strokes].sort(
    (left, right) => left.bounds.x - right.bounds.x || left.bounds.y - right.bounds.y,
  );
  const clusters: StrokeElement[][] = [];
  for (const stroke of ordered) {
    const previous = clusters[clusters.length - 1];
    if (!previous) {
      clusters.push([stroke]);
      continue;
    }
    const prevBounds = unionBounds(previous.map((item) => item.bounds));
    const overlap =
      Math.min(prevBounds.x + prevBounds.width, stroke.bounds.x + stroke.bounds.width) -
      Math.max(prevBounds.x, stroke.bounds.x);
    const minWidth = Math.min(prevBounds.width, stroke.bounds.width) || 1;
    const sameColumn = overlap > minWidth * 0.42;
    if (sameColumn) previous.push(stroke);
    else clusters.push([stroke]);
  }
  return clusters;
}

function classifyCluster(cluster: StrokeElement[]): ClassifiedGlyph {
  const points = cluster.flatMap((stroke) => stroke.points);
  const bounds = unionBounds(cluster.map((stroke) => stroke.bounds));
  const thin = bounds.width < bounds.height * 0.27;
  const digits = classifyDigit(points);
  const letters = classifyLetter(points);
  const digitLead = digits[0];
  const letterLead = letters[0];
  const strongDigit = Boolean(
    digitLead &&
      "03689".includes(digitLead.symbol) &&
      digitLead.confidence >= 0.32 &&
      !thin,
  );
  const symbol = thin
    ? (letterLead && "()i1".includes(letterLead.symbol) ? letterLead.symbol : letterLead?.symbol ?? "i")
    : strongDigit
      ? digitLead!.symbol
      : (letterLead && letterLead.confidence > (digitLead?.confidence ?? 0)
          ? letterLead.symbol
          : digitLead?.symbol) ?? "?";
  const unique = [...digits, ...letters].filter(
    (item, index, list) => list.findIndex((other) => other.symbol === item.symbol) === index,
  );
  const ordered = unique.sort((left, right) => {
    if (left.symbol === symbol) return -1;
    if (right.symbol === symbol) return 1;
    return right.confidence - left.confidence;
  });
  return {
    symbol,
    confidence: ordered[0]?.confidence ?? 0.2,
    alternatives: ordered.slice(0, 4),
    bounds,
  };
}

function bestDigitSymbol(glyph: ClassifiedGlyph) {
  const thin = glyph.bounds.width < glyph.bounds.height * 0.27;
  if (thin) return "";
  const three = glyph.alternatives.find((item) => item.symbol === "3");
  const six = glyph.alternatives.find((item) => item.symbol === "6");
  if (
    three &&
    !["0", "6", "8", "9"].includes(glyph.symbol) &&
    three.confidence >= 0.45 &&
    (!six || three.confidence >= six.confidence)
  ) {
    return "3";
  }
  if (/^\d$/.test(glyph.symbol)) return glyph.symbol;
  const alternative = glyph.alternatives.find(
    (item) => /^\d$/.test(item.symbol) && item.confidence >= 0.45,
  );
  return alternative?.symbol ?? "";
}

function inferTrigName(glyphs: ClassifiedGlyph[], digitStart: number) {
  const leading = glyphs.slice(0, digitStart);
  const letters = leading.map((glyph) => glyph.symbol).join("");
  if (/sin|sen/.test(letters)) return "sin";
  if (/cos/.test(letters)) return "cos";
  if (/tan/.test(letters)) return "tan";
  if (leading.some((glyph) => glyph.symbol === "s" || glyph.alternatives.some((item) => item.symbol === "s" && item.confidence > 0.5))) {
    return "sin";
  }
  if (leading.some((glyph) => glyph.symbol === "c")) return "cos";
  if (leading.length >= 2 && leading.length <= 4) return "sin";
  return "";
}

function extractDigits(glyphs: ClassifiedGlyph[]) {
  const open = glyphs.findIndex((glyph) => glyph.symbol === "(");
  const close = glyphs.findIndex((glyph) => glyph.symbol === ")");
  if (open >= 0 && close > open) {
    const inside = glyphs
      .slice(open + 1, close)
      .map(bestDigitSymbol)
      .filter(Boolean)
      .join("");
    if (inside) return inside;
  }
  const collected = glyphs.map(bestDigitSymbol).filter(Boolean);
  if (collected.length >= 2) return collected.slice(-2).join("");
  return collected.join("");
}

function looksLikeTrigName(symbols: string[]) {
  const compact = symbols.join("").replace(/[^a-z]/g, "");
  return /^(sin|sen|sìn|cos|tan|cot|sec|csc)/.test(compact);
}

function formatTrigLatex(name: string, argument: string, hasParens: boolean) {
  const command = `\\${name}`;
  if (hasParens) return `${command}(${argument})`;
  if (/^\d+(\.\d+)?$/.test(argument)) return `${command} ${argument}^\\circ`;
  return `${command} ${argument}`;
}

export function glyphsToExpression(glyphs: ClassifiedGlyph[]) {
  const symbols = glyphs.map((glyph) => glyph.symbol);
  const letters = symbols.filter((symbol) => /[a-z]/i.test(symbol)).join("");
  const digits = extractDigits(glyphs);
  const hasParens = symbols.includes("(") || symbols.includes(")");
  const digitStart = glyphs.findIndex((glyph) => bestDigitSymbol(glyph) !== "");
  const inferred =
    letters.match(/sin|cos|tan|cot|sec|csc/)?.[0] ??
    (looksLikeTrigName(symbols) ? "sin" : inferTrigName(glyphs, digitStart));
  const name = inferred || (digits.length >= 2 && glyphs.length >= 4 ? "sin" : "");
  if (name && digits) {
    const latex = formatTrigLatex(name, digits, hasParens);
    const confused = digits
      .split("")
      .map((digit) => CONFUSED_DIGITS[digit]?.[0] ?? digit)
      .join("");
    const alternatives: RecognitionAlternative[] = [
      { latex, confidence: 0.72 },
    ];
    if (confused !== digits) {
      alternatives.push({
        latex: formatTrigLatex(name, confused, hasParens),
        confidence: 0.22,
      });
    }
    return {
      latex,
      digits,
      alternatives,
      detectedType: "function" as const,
      plainText: `${name} ${digits}${/^\d+$/.test(digits) ? " degrees" : ""}`,
      normalizedExpression: hasParens ? `${name}(${digits})` : `${name}(${digits} deg)`,
      confidence: glyphs.reduce((sum, glyph) => sum + glyph.confidence, 0) / Math.max(glyphs.length, 1),
    };
  }
  if (digits) {
    return {
      latex: digits,
      digits,
      alternatives: [{ latex: digits, confidence: 0.6 }],
      detectedType: "unknown" as const,
      plainText: digits,
      normalizedExpression: digits,
      confidence: 0.55,
    };
  }
  return {
    latex: "",
    digits: "",
    alternatives: [] as RecognitionAlternative[],
    detectedType: "unknown" as const,
    plainText: "Manual review required",
    normalizedExpression: undefined,
    confidence: 0,
  };
}

export function recognizeHandwrittenMath(strokes: StrokeElement[]): MathRecognitionResult & { digits: string; glyphs: ClassifiedGlyph[] } {
  const glyphs = clusterStrokes(strokes).map(classifyCluster);
  const assembled = glyphsToExpression(glyphs);
  return {
    ...assembled,
    glyphs,
    warnings: [],
  };
}

export function replaceConfusedAngle(latex: string, localDigits: string) {
  if (!localDigits) return latex;
  const remoteNumbers = latex.match(/\d+/g);
  if (!remoteNumbers?.length) return latex;
  const remote = remoteNumbers[remoteNumbers.length - 1];
  if (remote === localDigits) return latex;
  if (remote.length !== localDigits.length) {
    if (remote === "60" && localDigits === "30") return latex.replace(/60/g, "30");
    if (remote === "30" && localDigits === "60") return latex;
  }
  const confused = [...remote].every((digit, index) => {
    const local = localDigits[index];
    return digit === local || CONFUSED_DIGITS[local]?.includes(digit) || CONFUSED_DIGITS[digit]?.includes(local);
  });
  if (!confused) return latex;
  return latex.replace(remote, localDigits);
}

export function reconcileRecognition(
  remote: MathRecognitionResult,
  strokes: StrokeElement[],
): MathRecognitionResult {
  const local = recognizeHandwrittenMath(strokes);
  if (!local.digits) return remote;
  const latex = replaceConfusedAngle(remote.latex || local.latex, local.digits);
  if (!latex) return remote;
  const alternatives = [
    { latex, confidence: Math.max(remote.confidence ?? 0.5, local.confidence) },
    ...(remote.alternatives ?? [])
      .map((alternative) => ({
        ...alternative,
        latex: replaceConfusedAngle(alternative.latex, local.digits),
      }))
      .filter((alternative, index, list) => list.findIndex((item) => item.latex === alternative.latex) === index)
      .filter((alternative) => alternative.latex !== latex),
    ...local.alternatives.filter((alternative) => alternative.latex !== latex),
  ];
  return {
    ...remote,
    latex,
    alternatives,
    normalizedExpression: remote.normalizedExpression?.includes("60") && local.digits === "30"
      ? remote.normalizedExpression.replace(/60/g, "30")
      : remote.normalizedExpression ?? local.normalizedExpression,
    plainText: remote.plainText?.includes("sixty") && local.digits === "30"
      ? remote.plainText.replace(/sixty/gi, "thirty")
      : remote.plainText ?? local.plainText,
    detectedType: remote.detectedType ?? local.detectedType,
  };
}
