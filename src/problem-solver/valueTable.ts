export type ValueTableRow = {
  x: number;
  y: number | null;
};

export function generateValueTable(evaluate: (x: number) => number | null, xValues = [-3, -2, -1, 0, 1, 2, 3]): ValueTableRow[] {
  return xValues.map((x) => {
    const y = evaluate(x);
    return { x, y: y === null || !Number.isFinite(y) ? null : roundNumber(y) };
  });
}

export function roundNumber(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Object.is(rounded, -0) ? 0 : rounded;
}
