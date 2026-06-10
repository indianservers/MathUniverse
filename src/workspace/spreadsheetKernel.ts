export type SpreadsheetGrid = string[][];
export type SpreadsheetEvalResult = {
  values: string[][];
  errors: { cell: string; message: string }[];
};

export function cellName(row: number, column: number) {
  return `${columnName(column)}${row + 1}`;
}

export function parseCellName(name: string) {
  const match = name.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return { row: Number(match[2]) - 1, column: columnIndex(match[1]) };
}

export function evaluateSpreadsheetGrid(grid: SpreadsheetGrid): SpreadsheetEvalResult {
  const values = grid.map((row) => row.map((cell) => cell));
  const errors: SpreadsheetEvalResult["errors"] = [];
  const resolving = new Set<string>();
  const cache = new Map<string, string>();

  const resolve = (row: number, column: number): string => {
    const key = cellName(row, column);
    if (cache.has(key)) return cache.get(key) ?? "";
    const raw = grid[row]?.[column] ?? "";
    if (!raw.startsWith("=")) {
      cache.set(key, raw);
      return raw;
    }
    if (resolving.has(key)) {
      errors.push({ cell: key, message: "Circular spreadsheet reference" });
      return "#CYCLE";
    }
    resolving.add(key);
    try {
      const expression = raw.slice(1).replace(/\b[A-Z]+\d+\b/gi, (token) => {
        const ref = parseCellName(token);
        if (!ref) return "0";
        const value = Number(resolve(ref.row, ref.column));
        return Number.isFinite(value) ? String(value) : "0";
      });
      const value = safeEvaluate(expression);
      const result = String(round(value));
      cache.set(key, result);
      values[row][column] = result;
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Formula error";
      errors.push({ cell: key, message });
      values[row][column] = "#ERR";
      return "#ERR";
    } finally {
      resolving.delete(key);
    }
  };

  for (let row = 0; row < grid.length; row += 1) {
    for (let column = 0; column < (grid[row]?.length ?? 0); column += 1) resolve(row, column);
  }

  return { values, errors };
}

export function fillDownFormula(grid: SpreadsheetGrid, sourceCell: string, targetRange: string): SpreadsheetGrid {
  const source = parseCellName(sourceCell);
  const range = parseRange(targetRange);
  if (!source || !range) return grid;
  const formula = grid[source.row]?.[source.column] ?? "";
  const next = grid.map((row) => [...row]);
  for (let row = range.start.row; row <= range.end.row; row += 1) {
    for (let column = range.start.column; column <= range.end.column; column += 1) {
      ensureCell(next, row, column);
      next[row][column] = shiftFormula(formula, row - source.row, column - source.column);
    }
  }
  return next;
}

export function parseRange(value: string) {
  const [startRaw, endRaw] = value.split(":");
  const start = parseCellName(startRaw ?? "");
  const end = parseCellName(endRaw ?? startRaw ?? "");
  return start && end ? {
    start: { row: Math.min(start.row, end.row), column: Math.min(start.column, end.column) },
    end: { row: Math.max(start.row, end.row), column: Math.max(start.column, end.column) },
  } : null;
}

export function rangeToCsv(grid: SpreadsheetGrid, rangeText: string) {
  const range = parseRange(rangeText);
  if (!range) return "";
  return grid.slice(range.start.row, range.end.row + 1).map((row) => row.slice(range.start.column, range.end.column + 1).map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function shiftFormula(formula: string, rowOffset: number, columnOffset: number) {
  if (!formula.startsWith("=")) return formula;
  return formula.replace(/\b([A-Z]+)(\d+)\b/gi, (token) => {
    const ref = parseCellName(token);
    if (!ref) return token;
    return cellName(Math.max(0, ref.row + rowOffset), Math.max(0, ref.column + columnOffset));
  });
}

function ensureCell(grid: SpreadsheetGrid, row: number, column: number) {
  while (grid.length <= row) grid.push([]);
  while (grid[row].length <= column) grid[row].push("");
}

function safeEvaluate(expression: string) {
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) throw new Error("Unsupported spreadsheet formula");
  return Function(`"use strict"; return (${expression});`)() as number;
}

function columnName(index: number) {
  let name = "";
  let value = index + 1;
  while (value > 0) {
    const rem = (value - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function columnIndex(name: string) {
  return name.split("").reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
