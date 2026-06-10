import { symbolicDerivative, symbolicExpand, symbolicFactor, symbolicIntegral, symbolicSimplify, symbolicSolve, trySymbolic, type SymbolicResult } from "../utils/symbolic";

export type DynamicTableRow = {
  x: number;
  values: Record<string, number>;
  highlight?: boolean;
};

export type DynamicTable = {
  id: string;
  expressions: string[];
  start: number;
  end: number;
  step: number;
  rows: DynamicTableRow[];
  exportCsv: string;
  classroomTasks: string[];
};

export type CasCard = {
  command: string;
  result: string;
  exact?: string;
  detail: string;
  steps: string[];
  linkedGraphExpressions: string[];
  verificationPrompts: string[];
};

export function createDynamicTable(expressions: string[], start: number, end: number, step: number, evaluator: (expression: string, x: number) => number): DynamicTable {
  const safeStep = Math.abs(step) || 1;
  const rows: DynamicTableRow[] = [];
  for (let x = start; x <= end + 1e-9 && rows.length < 240; x += safeStep) {
    const values = Object.fromEntries(expressions.map((expression) => [expression, round(evaluator(expression, x))]));
    rows.push({ x: round(x), values, highlight: Math.abs(x) < safeStep / 2 || Object.values(values).some((value) => Math.abs(value) < 1e-6) });
  }
  return {
    id: `table-${expressions.join("|")}-${start}-${end}-${safeStep}`,
    expressions,
    start,
    end,
    step: safeStep,
    rows,
    exportCsv: tableToCsv(expressions, rows),
    classroomTasks: [
      "Find rows where y is 0 and connect them to graph roots.",
      "Compare how fast each expression changes between consecutive rows.",
      "Use highlighted rows to explain intercepts or symmetry.",
    ],
  };
}

export function createCasCard(command: string, expression: string): CasCard {
  const lower = command.toLowerCase();
  const symbolic = runSymbolicCommand(lower, expression);
  return {
    command,
    result: symbolic?.result ?? "No exact symbolic result available",
    exact: symbolic?.exact,
    detail: symbolic?.detail ?? "CAS command registered; numeric verification can still be done through graph and table views.",
    steps: symbolic?.steps ?? [`Read ${expression}.`, "Try exact symbolic transformation.", "Use graph/table verification if exact form is unavailable."],
    linkedGraphExpressions: linkedExpressionsFor(lower, expression, symbolic?.result),
    verificationPrompts: [
      "Graph the original and transformed expressions together.",
      "Create a value table and check matching rows.",
      "Use a special input such as x=0, x=1, or a root to verify the result.",
    ],
  };
}

export function createListObject(values: string[]) {
  const numeric = values.map((value) => Number(value.trim())).filter((value) => Number.isFinite(value));
  return {
    values: numeric,
    length: numeric.length,
    sum: numeric.reduce((total, value) => total + value, 0),
    mean: numeric.length ? numeric.reduce((total, value) => total + value, 0) / numeric.length : 0,
    min: numeric.length ? Math.min(...numeric) : 0,
    max: numeric.length ? Math.max(...numeric) : 0,
  };
}

function runSymbolicCommand(command: string, expression: string): SymbolicResult | null {
  if (command.includes("solve")) return trySymbolic(() => symbolicSolve(expression));
  if (command.includes("factor")) return trySymbolic(() => symbolicFactor(expression));
  if (command.includes("expand")) return trySymbolic(() => symbolicExpand(expression));
  if (command.includes("derivative") || command.includes("diff")) return trySymbolic(() => symbolicDerivative(expression));
  if (command.includes("integral")) return trySymbolic(() => symbolicIntegral(expression));
  if (command.includes("simplify")) return trySymbolic(() => symbolicSimplify(expression));
  return null;
}

function linkedExpressionsFor(command: string, expression: string, result?: string) {
  if (command.includes("derivative") || command.includes("integral")) return [expression, result?.replace(/\+C$/, "") ?? ""].filter(Boolean);
  if (command.includes("factor") || command.includes("expand") || command.includes("simplify")) return [expression, result ?? ""].filter(Boolean);
  if (command.includes("solve")) return [expression.includes("=") ? expression.split("=")[0] : expression];
  return [expression];
}

function tableToCsv(expressions: string[], rows: DynamicTableRow[]) {
  const headers = ["x", ...expressions, "highlight"];
  const data = rows.map((row) => [row.x, ...expressions.map((expression) => row.values[expression]), row.highlight ? "yes" : ""]);
  return [headers, ...data].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
