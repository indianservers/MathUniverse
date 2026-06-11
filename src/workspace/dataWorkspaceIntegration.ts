import { createMathObject } from "./coreObjects";
import { createCasCard } from "./casTableKernel";
import { evaluateSpreadsheetGrid, parseRange, rangeToCsv, type SpreadsheetGrid } from "./spreadsheetKernel";
import { mean, median, mode, range } from "../utils/mathEngine/statisticsUtils";
import { binomialDistribution, diceProbability, simulateDice } from "../utils/mathEngine/probabilityUtils";
import type { MathObject } from "./types";

export type WorkspaceDataObjectBundle = {
  objects: MathObject[];
  diagnostics: string[];
};

export function createSpreadsheetWorkspaceObjects(grid: SpreadsheetGrid, options: { id?: string; range?: string } = {}): WorkspaceDataObjectBundle {
  const id = options.id ?? "spreadsheet";
  const evaluated = evaluateSpreadsheetGrid(grid);
  const rangeText = options.range ?? `A1:${columnName(Math.max(0, Math.max(...grid.map((row) => row.length), 1) - 1))}${grid.length}`;
  const csv = rangeToCsv(evaluated.values, rangeText);
  const numeric = numericValuesFromGrid(evaluated.values, options.range);
  const sheet = createMathObject({
    id,
    kind: "table",
    label: "Spreadsheet",
    value: `${grid.length} rows, ${grid[0]?.length ?? 0} columns`,
    summary: `${evaluated.errors.length} formula issue(s); ${numeric.length} numeric value(s).`,
    linkedViews: ["Spreadsheet", "Data", "Graph", "Algebra"],
    metadata: { source: "data-integration", rows: grid.length, columns: grid[0]?.length ?? 0, csvLength: csv.length },
    definition: { source: `Spreadsheet[${rangeText}]`, command: "Spreadsheet", category: "spreadsheet", parentIds: [] },
  });
  const dataset = createStatisticsWorkspaceObject(numeric, { id: `${id}:stats`, parent: sheet });
  return { objects: [sheet, dataset], diagnostics: evaluated.errors.map((error) => `${error.cell}: ${error.message}`) };
}

export function createCasWorkspaceObject(command: string, expression: string, options: { id?: string; parentIds?: string[] } = {}): MathObject {
  const card = createCasCard(command, expression);
  return createMathObject({
    id: options.id ?? `cas:${hash(`${command}:${expression}`)}`,
    kind: "equation",
    label: `${command} result`,
    value: card.result,
    summary: card.detail,
    linkedViews: ["CAS", "Graph", "Table", "Algebra"],
    dependencies: (options.parentIds ?? []).map((id) => ({ id, label: id, role: "source" })),
    metadata: { source: "cas-integration", command, linkedGraphs: card.linkedGraphExpressions.join("|"), stepCount: card.steps.length },
    definition: { source: `CAS[${command}, ${expression}]`, command: "CAS", category: "cas", parentIds: options.parentIds ?? [] },
  });
}

export function createStatisticsWorkspaceObject(values: number[], options: { id?: string; parent?: MathObject } = {}): MathObject {
  const numeric = values.filter(Number.isFinite);
  return createMathObject({
    id: options.id ?? `statistics:${hash(numeric.join(","))}`,
    kind: "dataset",
    label: "Statistics summary",
    value: `n=${numeric.length}, mean=${round(mean(numeric))}, median=${round(median(numeric))}`,
    summary: `mode ${round(mode(numeric))}; range ${round(range(numeric))}.`,
    linkedViews: ["Spreadsheet", "Statistics", "Graph", "Algebra"],
    dependencies: options.parent ? [{ id: options.parent.id, label: options.parent.label, role: "source" }] : [],
    metadata: { source: "statistics-integration", count: numeric.length, mean: round(mean(numeric)), median: round(median(numeric)), mode: round(mode(numeric)), range: round(range(numeric)) },
    definition: { source: `Statistics[${numeric.join(", ")}]`, command: "Statistics", category: "statistics", parentIds: options.parent ? [options.parent.id] : [] },
  });
}

export function createProbabilityWorkspaceObject(kind: "dice" | "binomial" | "dice-probability", options: { trials?: number; diceCount?: 1 | 2; n?: number; p?: number; outcome?: number; id?: string } = {}): MathObject {
  if (kind === "binomial") {
    const distribution = binomialDistribution(options.n ?? 10, options.p ?? 0.5);
    const expected = distribution.reduce((sum, item) => sum + Number(item.label) * item.count, 0);
    return probabilityObject(options.id ?? "probability:binomial", `Binomial[n=${options.n ?? 10}, p=${options.p ?? 0.5}]`, `E[X]=${round(expected)}`, `${distribution.length} probability mass point(s).`, { kind, expected: round(expected), points: distribution.length });
  }
  if (kind === "dice-probability") {
    const probability = diceProbability(options.outcome ?? 7, options.diceCount ?? 2);
    return probabilityObject(options.id ?? "probability:dice-outcome", `DiceProbability[${options.outcome ?? 7}, ${options.diceCount ?? 2}]`, `P=${round(probability)}`, "Exact dice outcome probability.", { kind, probability: round(probability) });
  }
  const simulation = simulateDice(options.trials ?? 120, options.diceCount ?? 2);
  return probabilityObject(options.id ?? "probability:dice-simulation", `DiceSimulation[${options.trials ?? 120}, ${options.diceCount ?? 2}]`, `${simulation.rolls.length} rolls`, `${simulation.frequencies.length} frequency bin(s).`, { kind, trials: simulation.rolls.length });
}

function probabilityObject(id: string, source: string, value: string, summary: string, metadata: Record<string, string | number | boolean>) {
  return createMathObject({
    id,
    kind: "dataset",
    label: "Probability model",
    value,
    summary,
    linkedViews: ["Probability", "Statistics", "Graph", "Algebra"],
    metadata: { source: "probability-integration", ...metadata },
    definition: { source, command: source.split("[")[0], category: "statistics", parentIds: [] },
  });
}

function numericValuesFromGrid(grid: SpreadsheetGrid, rangeText?: string) {
  const range = rangeText ? parseRange(rangeText) : null;
  const rows = range ? grid.slice(range.start.row, range.end.row + 1).map((row) => row.slice(range.start.column, range.end.column + 1)) : grid;
  return rows.flat().map((cell) => Number(cell)).filter(Number.isFinite);
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

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function hash(value: string) {
  let output = 0;
  for (let index = 0; index < value.length; index += 1) output = (output * 31 + value.charCodeAt(index)) | 0;
  return Math.abs(output);
}
