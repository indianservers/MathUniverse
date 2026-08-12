import { cellName, parseCellName } from "./spreadsheetKernel";

export type SpreadsheetCellStyle = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  textColor?: string;
  fillColor?: string;
  numberFormat?: "general" | "number" | "percent" | "currency" | "scientific" | "text";
  decimals?: number;
  wrap?: boolean;
  border?: "all" | "bottom" | "none";
  merged?: boolean;
};

export type SpreadsheetValidationRule = {
  type: "number" | "text" | "list";
  values?: string[];
};

export type SpreadsheetStudioSheet = {
  id: string;
  name: string;
  cells: string[][];
  styles: Record<string, SpreadsheetCellStyle>;
  comments: Record<string, string>;
  validations?: Record<string, SpreadsheetValidationRule>;
  mergedRanges?: string[];
  hidden?: boolean;
  protected?: boolean;
  tabColor?: string;
};

export type SpreadsheetStudioWorkbook = {
  id: string;
  name: string;
  sheets: SpreadsheetStudioSheet[];
  activeSheetId: string;
  namedRanges: Record<string, string>;
  updatedAt: number;
};

export type SpreadsheetStudioEvaluation = {
  values: Record<string, string[][]>;
  errors: Record<string, string>;
  dependencies: Record<string, string[]>;
  dependents: Record<string, string[]>;
};

export type SpreadsheetRegression = {
  count: number;
  slope: number;
  intercept: number;
  r2: number;
  adjustedR2: number;
  correlation: number;
  covariance: number;
  residualStandardError: number;
  equation: string;
  points: Array<{ row: number; x: number; y: number; predicted: number; residual: number }>;
};

export type SpreadsheetStatistics = {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
  q1: number;
  q3: number;
  iqr: number;
  missing: number;
};

const DEFAULT_ROWS = 24;
const DEFAULT_COLUMNS = 8;

export function createDefaultSpreadsheetWorkbook(): SpreadsheetStudioWorkbook {
  const dataset = emptySheet("dataset-1", "Dataset 1", DEFAULT_ROWS, DEFAULT_COLUMNS);
  dataset.cells[0] = ["x", "y", "prediction", "residual", "note", "", "", ""];
  const points = [[-4, -5.6], [-2, -2.2], [0, 0.7], [2, 4.1], [4, 7.4]];
  points.forEach(([x, y], index) => {
    const row = index + 1;
    dataset.cells[row][0] = String(x);
    dataset.cells[row][1] = String(y);
    dataset.cells[row][2] = `=FORECAST(A${row + 1},$B$2:$B$6,$A$2:$A$6)`;
    dataset.cells[row][3] = `=B${row + 1}-C${row + 1}`;
    dataset.cells[row][4] = `sample ${x}`;
  });
  dataset.styles.A1 = { bold: true, fillColor: "#e0f2fe", align: "center" };
  dataset.styles.B1 = { bold: true, fillColor: "#e0f2fe", align: "center" };
  dataset.styles.C1 = { bold: true, fillColor: "#ede9fe", align: "center" };
  dataset.styles.D1 = { bold: true, fillColor: "#ede9fe", align: "center" };
  dataset.styles.E1 = { bold: true, fillColor: "#f1f5f9" };

  const regression = emptySheet("regression", "Regression", 18, 8);
  regression.cells[0] = ["Linear Regression", "Value", "", "", "", "", "", ""];
  regression.cells[1][0] = "Source";
  regression.cells[1][1] = "'Dataset 1'!A2:B6";
  regression.cells[2][0] = "Slope";
  regression.cells[2][1] = "=SLOPE('Dataset 1'!B2:B6,'Dataset 1'!A2:A6)";
  regression.cells[3][0] = "Intercept";
  regression.cells[3][1] = "=INTERCEPT('Dataset 1'!B2:B6,'Dataset 1'!A2:A6)";
  regression.cells[4][0] = "R squared";
  regression.cells[4][1] = "=RSQ('Dataset 1'!B2:B6,'Dataset 1'!A2:A6)";
  regression.cells[5][0] = "Correlation";
  regression.cells[5][1] = "=CORREL('Dataset 1'!A2:A6,'Dataset 1'!B2:B6)";

  const residuals = emptySheet("residuals", "Residuals", 18, 8);
  residuals.cells[0] = ["observed", "predicted", "residual", "standardized", "outlier", "", "", ""];
  points.forEach((_, index) => {
    const row = index + 2;
    residuals.cells[index + 1][0] = `='Dataset 1'!B${row}`;
    residuals.cells[index + 1][1] = `='Dataset 1'!C${row}`;
    residuals.cells[index + 1][2] = `=A${index + 2}-B${index + 2}`;
    residuals.cells[index + 1][3] = `=C${index + 2}/STDEV(C2:C6)`;
    residuals.cells[index + 1][4] = `=IF(ABS(D${index + 2})>2,"Yes","No")`;
  });

  return {
    id: "cas-spreadsheet-workbook",
    name: "Polynomial Analysis",
    sheets: [dataset, regression, residuals],
    activeSheetId: dataset.id,
    namedRanges: { X_VALUES: "'Dataset 1'!A2:A6", Y_VALUES: "'Dataset 1'!B2:B6" },
    updatedAt: Date.now(),
  };
}

export function emptySheet(id: string, name: string, rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS): SpreadsheetStudioSheet {
  return {
    id,
    name,
    cells: Array.from({ length: rows }, () => Array.from({ length: columns }, () => "")),
    styles: {},
    comments: {},
    validations: {},
    mergedRanges: [],
    tabColor: "#6366f1",
  };
}

export function evaluateSpreadsheetWorkbook(workbook: SpreadsheetStudioWorkbook): SpreadsheetStudioEvaluation {
  const values: Record<string, string[][]> = Object.fromEntries(workbook.sheets.map((sheet) => [sheet.id, sheet.cells.map((row) => row.map(() => ""))]));
  const errors: Record<string, string> = {};
  const dependencies: Record<string, string[]> = {};
  const dependents: Record<string, string[]> = {};
  const cache = new Map<string, string>();
  const resolving = new Set<string>();

  const resolve = (sheetId: string, row: number, column: number): string => {
    const key = `${sheetId}!${cellName(row, column)}`;
    if (cache.has(key)) return cache.get(key) ?? "";
    const sheet = workbook.sheets.find((candidate) => candidate.id === sheetId);
    const raw = sheet?.cells[row]?.[column] ?? "";
    if (!raw.startsWith("=")) {
      cache.set(key, raw);
      if (values[sheetId]?.[row]) values[sheetId][row][column] = raw;
      return raw;
    }
    if (resolving.has(key)) {
      errors[key] = "#CYCLE! Circular reference detected.";
      return "#CYCLE!";
    }

    resolving.add(key);
    const refs = extractFormulaReferences(raw, sheetId, workbook);
    dependencies[key] = refs;
    refs.forEach((ref) => { dependents[ref] = Array.from(new Set([...(dependents[ref] ?? []), key])); });
    try {
      const result = evaluateFormula(raw.slice(1), sheetId, workbook, resolve);
      const formatted = formatValue(result);
      cache.set(key, formatted);
      if (values[sheetId]?.[row]) values[sheetId][row][column] = formatted;
      return formatted;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid formula";
      const code = message.includes("Circular") ? "#CYCLE!" : message.includes("reference") ? "#REF!" : message.includes("zero") ? "#DIV/0!" : message.includes("function") ? "#NAME?" : "#VALUE!";
      errors[key] = `${code} ${message}`;
      cache.set(key, code);
      if (values[sheetId]?.[row]) values[sheetId][row][column] = code;
      return code;
    } finally {
      resolving.delete(key);
    }
  };

  workbook.sheets.forEach((sheet) => sheet.cells.forEach((row, rowIndex) => row.forEach((_, columnIndex) => resolve(sheet.id, rowIndex, columnIndex))));
  return { values, errors, dependencies, dependents };
}

export function extractFormulaReferences(formula: string, currentSheetId: string, workbook: SpreadsheetStudioWorkbook) {
  const refs = new Set<string>();
  const normalized = replaceNamedRanges(formula, workbook.namedRanges);
  const refPattern = /(?:(?:'([^']+)'|([A-Za-z][\w ]*))!)?\$?([A-Z]+)\$?(\d+)/g;
  for (const match of normalized.matchAll(refPattern)) {
    const sheetName = match[1] ?? match[2];
    const sheet = sheetName ? workbook.sheets.find((candidate) => candidate.name.toLowerCase() === sheetName.trim().toLowerCase()) : workbook.sheets.find((candidate) => candidate.id === currentSheetId);
    if (sheet) refs.add(`${sheet.id}!${match[3]}${match[4]}`);
  }
  return [...refs];
}

export function calculateLinearRegression(points: Array<{ row: number; x: number; y: number }>): SpreadsheetRegression {
  const clean = points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  const count = clean.length;
  if (count < 2) return { count, slope: 0, intercept: 0, r2: 0, adjustedR2: 0, correlation: 0, covariance: 0, residualStandardError: 0, equation: "Insufficient data", points: [] };
  const xs = clean.map((point) => point.x);
  const ys = clean.map((point) => point.y);
  const meanX = average(xs);
  const meanY = average(ys);
  const ssX = xs.reduce((sum, value) => sum + (value - meanX) ** 2, 0);
  const ssY = ys.reduce((sum, value) => sum + (value - meanY) ** 2, 0);
  const cross = clean.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const slope = ssX ? cross / ssX : 0;
  const intercept = meanY - slope * meanX;
  const fitted = clean.map((point) => ({ ...point, predicted: slope * point.x + intercept, residual: point.y - (slope * point.x + intercept) }));
  const residualSumSquares = fitted.reduce((sum, point) => sum + point.residual ** 2, 0);
  const r2 = ssY ? 1 - residualSumSquares / ssY : 1;
  const correlation = ssX && ssY ? cross / Math.sqrt(ssX * ssY) : 0;
  const covariance = count > 1 ? cross / (count - 1) : 0;
  const adjustedR2 = count > 2 ? 1 - (1 - r2) * (count - 1) / (count - 2) : r2;
  const residualStandardError = count > 2 ? Math.sqrt(residualSumSquares / (count - 2)) : Math.sqrt(residualSumSquares / count);
  return {
    count,
    slope: round(slope),
    intercept: round(intercept),
    r2: round(r2),
    adjustedR2: round(adjustedR2),
    correlation: round(correlation),
    covariance: round(covariance),
    residualStandardError: round(residualStandardError),
    equation: `y = ${round(slope)}x ${intercept < 0 ? "-" : "+"} ${Math.abs(round(intercept))}`,
    points: fitted.map((point) => ({ ...point, predicted: round(point.predicted), residual: round(point.residual) })),
  };
}

export function calculateSpreadsheetStatistics(values: Array<string | number>): SpreadsheetStatistics {
  const numeric = values.map(Number).filter(Number.isFinite);
  const missing = values.filter((value) => value === "" || value === null || value === undefined || !Number.isFinite(Number(value))).length;
  if (!numeric.length) return { count: 0, sum: 0, mean: 0, median: 0, mode: 0, min: 0, max: 0, range: 0, variance: 0, standardDeviation: 0, q1: 0, q3: 0, iqr: 0, missing };
  const sorted = [...numeric].sort((a, b) => a - b);
  const sum = numeric.reduce((total, value) => total + value, 0);
  const mean = sum / numeric.length;
  const variance = numeric.length > 1 ? numeric.reduce((total, value) => total + (value - mean) ** 2, 0) / (numeric.length - 1) : 0;
  const counts = new Map<number, number>();
  numeric.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  const mode = [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? 0;
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  return { count: numeric.length, sum: round(sum), mean: round(mean), median: round(percentile(sorted, 0.5)), mode, min: sorted[0], max: sorted.at(-1) ?? sorted[0], range: round((sorted.at(-1) ?? 0) - sorted[0]), variance: round(variance), standardDeviation: round(Math.sqrt(variance)), q1: round(q1), q3: round(q3), iqr: round(q3 - q1), missing };
}

export function parseDelimitedText(text: string, delimiter?: string) {
  const detected = delimiter ?? (text.includes("\t") ? "\t" : text.includes(";") && !text.includes(",") ? ";" : ",");
  return text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim().length).map((line) => parseDelimitedLine(line, detected));
}

export function serializeWorkbook(workbook: SpreadsheetStudioWorkbook) {
  return JSON.stringify({ ...workbook, updatedAt: Date.now() }, null, 2);
}

function evaluateFormula(expression: string, sheetId: string, workbook: SpreadsheetStudioWorkbook, resolve: (sheetId: string, row: number, column: number) => string): string | number | boolean {
  let source = replaceNamedRanges(expression.trim(), workbook.namedRanges);
  let nestedFunction = source.match(/([A-Z][A-Z0-9.]*)\(([^()]*)\)/i);
  while (nestedFunction && nestedFunction[0] !== source) {
    const nestedValue = evaluateFormula(nestedFunction[0], sheetId, workbook, resolve);
    const start = nestedFunction.index ?? 0;
    source = `${source.slice(0, start)}${typeof nestedValue === "string" ? JSON.stringify(nestedValue) : nestedValue}${source.slice(start + nestedFunction[0].length)}`;
    nestedFunction = source.match(/([A-Z][A-Z0-9.]*)\(([^()]*)\)/i);
  }
  const functionMatch = source.match(/^([A-Z][A-Z0-9.]*)\((.*)\)$/is);
  if (functionMatch && balanced(functionMatch[2])) {
    const name = functionMatch[1].toUpperCase();
    const args = splitArguments(functionMatch[2]).map((arg) => evaluateArgument(arg, sheetId, workbook, resolve));
    return applyFunction(name, args);
  }
  if (/^".*"$/s.test(source)) return source.slice(1, -1).replace(/""/g, '"');
  if (/^(TRUE|FALSE)$/i.test(source)) return source.toUpperCase() === "TRUE";

  const replaced = source.replace(/(?:(?:'([^']+)'|([A-Za-z][\w ]*))!)?\$?([A-Z]+)\$?(\d+)/g, (_token, quotedSheet, plainSheet, column, row) => {
    const targetSheetName = quotedSheet ?? plainSheet;
    const targetSheet = targetSheetName ? workbook.sheets.find((sheet) => sheet.name.toLowerCase() === String(targetSheetName).trim().toLowerCase()) : workbook.sheets.find((sheet) => sheet.id === sheetId);
    const ref = parseCellName(`${column}${row}`);
    if (!targetSheet || !ref) throw new Error("Broken reference");
    const value = resolve(targetSheet.id, ref.row, ref.column);
    if (value.startsWith("#")) throw new Error(value.includes("CYCLE") ? "Circular reference detected" : `Broken reference value ${value}`);
    const numeric = Number(value);
    return Number.isFinite(numeric) ? `(${numeric})` : JSON.stringify(value);
  }).replace(/\^/g, "**");

  if (!/^[0-9eE+\-*/().,\s"'<>!=&|]+$/.test(replaced)) throw new Error("Unsupported function or value");
  const result = Function(`"use strict"; return (${replaced});`)() as number | string | boolean;
  if (typeof result === "number" && !Number.isFinite(result)) throw new Error("Division by zero");
  return result;
}

function evaluateArgument(argument: string, sheetId: string, workbook: SpreadsheetStudioWorkbook, resolve: (sheetId: string, row: number, column: number) => string): unknown {
  const range = parseWorkbookRange(argument.trim(), sheetId, workbook);
  if (range) {
    const output: Array<string | number> = [];
    for (let row = range.start.row; row <= range.end.row; row += 1) for (let column = range.start.column; column <= range.end.column; column += 1) {
      const value = resolve(range.sheet.id, row, column);
      const numeric = Number(value);
      output.push(Number.isFinite(numeric) && value !== "" ? numeric : value);
    }
    return output;
  }
  return evaluateFormula(argument, sheetId, workbook, resolve);
}

function applyFunction(name: string, args: unknown[]): string | number | boolean {
  const flattened = args.flatMap((arg) => Array.isArray(arg) ? arg : [arg]);
  const numbers = flattened.map(Number).filter(Number.isFinite);
  const unary = Number(Array.isArray(args[0]) ? args[0][0] : args[0]);
  switch (name) {
    case "SUM": return numbers.reduce((sum, value) => sum + value, 0);
    case "AVERAGE": return average(numbers);
    case "MIN": return numbers.length ? Math.min(...numbers) : 0;
    case "MAX": return numbers.length ? Math.max(...numbers) : 0;
    case "COUNT": return numbers.length;
    case "COUNTA": return flattened.filter((value) => value !== "").length;
    case "MEDIAN": return percentile([...numbers].sort((a, b) => a - b), 0.5);
    case "MODE": return calculateSpreadsheetStatistics(numbers).mode;
    case "STDEV": return calculateSpreadsheetStatistics(numbers).standardDeviation;
    case "VAR": return calculateSpreadsheetStatistics(numbers).variance;
    case "ROUND": return roundToDigits(unary, Number(args[1] ?? 0));
    case "ABS": return Math.abs(unary);
    case "SQRT": return Math.sqrt(unary);
    case "POWER": return unary ** Number(args[1] ?? 1);
    case "LOG": return Math.log10(unary);
    case "EXP": return Math.exp(unary);
    case "SIN": return Math.sin(unary);
    case "COS": return Math.cos(unary);
    case "TAN": return Math.tan(unary);
    case "AND": return flattened.every(Boolean);
    case "OR": return flattened.some(Boolean);
    case "NOT": return !args[0];
    case "IF": return args[0] ? (args[1] as string | number | boolean) : (args[2] as string | number | boolean);
    case "CORREL": return regressionFromArgs(args).correlation;
    case "COVARIANCE":
    case "COVARIANCE.S": return regressionFromArgs(args).covariance;
    case "SLOPE": return regressionFromArgs(args, true).slope;
    case "INTERCEPT": return regressionFromArgs(args, true).intercept;
    case "RSQ": return regressionFromArgs(args).r2;
    case "FORECAST": {
      const knownY = Array.isArray(args[1]) ? args[1].map(Number) : [];
      const knownX = Array.isArray(args[2]) ? args[2].map(Number) : [];
      const fit = calculateLinearRegression(knownX.map((x, index) => ({ row: index, x, y: knownY[index] })));
      return fit.slope * unary + fit.intercept;
    }
    default: throw new Error(`Unsupported function ${name}`);
  }
}

function regressionFromArgs(args: unknown[], yFirst = false) {
  const first = Array.isArray(args[0]) ? args[0].map(Number) : [];
  const second = Array.isArray(args[1]) ? args[1].map(Number) : [];
  const xs = yFirst ? second : first;
  const ys = yFirst ? first : second;
  return calculateLinearRegression(xs.map((x, index) => ({ row: index, x, y: ys[index] })));
}

function parseWorkbookRange(value: string, currentSheetId: string, workbook: SpreadsheetStudioWorkbook) {
  const match = value.match(/^(?:(?:'([^']+)'|([A-Za-z][\w ]*))!)?\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)$/i);
  if (!match) return null;
  const sheetName = match[1] ?? match[2];
  const sheet = sheetName ? workbook.sheets.find((candidate) => candidate.name.toLowerCase() === sheetName.trim().toLowerCase()) : workbook.sheets.find((candidate) => candidate.id === currentSheetId);
  const start = parseCellName(`${match[3]}${match[4]}`);
  const end = parseCellName(`${match[5]}${match[6]}`);
  if (!sheet || !start || !end) return null;
  return { sheet, start: { row: Math.min(start.row, end.row), column: Math.min(start.column, end.column) }, end: { row: Math.max(start.row, end.row), column: Math.max(start.column, end.column) } };
}

function replaceNamedRanges(expression: string, namedRanges: Record<string, string>) {
  return Object.entries(namedRanges).reduce((output, [name, range]) => output.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, "gi"), range), expression);
}

function splitArguments(value: string) {
  const parts: string[] = [];
  let depth = 0;
  let quote = false;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === '"') quote = !quote;
    if (!quote && char === "(") depth += 1;
    if (!quote && char === ")") depth -= 1;
    if (!quote && char === "," && depth === 0) { parts.push(value.slice(start, index).trim()); start = index + 1; }
  }
  parts.push(value.slice(start).trim());
  return parts;
}

function balanced(value: string) {
  let depth = 0;
  let quote = false;
  for (const char of value) {
    if (char === '"') quote = !quote;
    if (!quote && char === "(") depth += 1;
    if (!quote && char === ")") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0 && !quote;
}

function parseDelimitedLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let value = "";
  let quote = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') { value += '"'; index += 1; continue; }
    if (char === '"') { quote = !quote; continue; }
    if (char === delimiter && !quote) { cells.push(value); value = ""; continue; }
    value += char;
  }
  cells.push(value);
  return cells;
}

function percentile(sorted: number[], fraction: number) {
  if (!sorted.length) return 0;
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function average(values: number[]) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
function round(value: number) { return Math.round(value * 1_000_000) / 1_000_000; }
function roundToDigits(value: number, digits: number) { const factor = 10 ** digits; return Math.round(value * factor) / factor; }
function formatValue(value: unknown) { return typeof value === "number" ? String(round(value)) : typeof value === "boolean" ? (value ? "TRUE" : "FALSE") : String(value ?? ""); }
function escapeRegExp(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
