export type QuadraticRule = { a: number; b: number; c: number };
export type ValueRow = { id: number; x: number; y: number };
export type TableView = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const DEFAULT_TABLE_EXPRESSION = "x^2 - 2x - 3";
export const DEFAULT_TABLE_VIEW: TableView = {
  xMin: -4.5,
  xMax: 4.5,
  yMin: -6,
  yMax: 7,
};

const termCoefficient = (value: string) =>
  value === "" || value === "+" ? 1 : value === "-" ? -1 : Number(value);

export function parseQuadraticRule(expression: string): QuadraticRule | null {
  const source = expression
    .toLowerCase()
    .replace(/^f\(x\)=/, "")
    .replace(/\s+/g, "")
    .replace(/²/g, "^2");
  const terms = source.replace(/-/g, "+-").split("+").filter(Boolean);
  let a = 0,
    b = 0,
    c = 0;
  for (const term of terms) {
    if (term.endsWith("x^2")) a += termCoefficient(term.slice(0, -3));
    else if (term.endsWith("x")) b += termCoefficient(term.slice(0, -1));
    else if (Number.isFinite(Number(term))) c += Number(term);
    else return null;
  }
  return { a, b, c };
}

export const evaluateQuadraticRule = (rule: QuadraticRule, x: number) =>
  rule.a * x * x + rule.b * x + rule.c;

export function buildValueRows(rule: QuadraticRule, step: number) {
  return [-2, -1, 0, 1, 2, 3, 4].map((multiple, id) => {
    const x = multiple * step;
    return { id, x, y: evaluateQuadraticRule(rule, x) };
  });
}

export function valueDifferences(rows: ValueRow[]) {
  const first = rows.map((row, index) =>
    index === 0 ? null : row.y - rows[index - 1].y,
  );
  const second = first.map((difference, index) =>
    index < 2 || difference === null || first[index - 1] === null
      ? null
      : difference - first[index - 1]!,
  );
  return {
    first,
    second,
    constantSecond: second
      .slice(2)
      .every((value) => Math.abs((value ?? 0) - (second[2] ?? 0)) < 0.000001)
      ? second[2]
      : null,
  };
}

export function fitTableView(rows: ValueRow[]): TableView {
  const xValues = rows.map((row) => row.x),
    yValues = rows.map((row) => row.y);
  const xMin = Math.min(...xValues),
    xMax = Math.max(...xValues),
    yMin = Math.min(...yValues),
    yMax = Math.max(...yValues);
  return { xMin: xMin - 1, xMax: xMax + 1, yMin: yMin - 2, yMax: yMax + 2 };
}

export function tableGraphPosition(x: number, y: number, view: TableView) {
  return {
    x: 30 + ((x - view.xMin) / (view.xMax - view.xMin)) * 520,
    y: 30 + ((view.yMax - y) / (view.yMax - view.yMin)) * 520,
  };
}

export function tableCurvePath(rule: QuadraticRule, view: TableView) {
  return Array.from({ length: 301 }, (_, index) => {
    const x = view.xMin + ((view.xMax - view.xMin) * index) / 300;
    const point = tableGraphPosition(x, evaluateQuadraticRule(rule, x), view);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export const tableXFromPixel = (pixelX: number, view: TableView) =>
  Math.round(
    (view.xMin + ((pixelX - 30) / 520) * (view.xMax - view.xMin)) * 2,
  ) / 2;
