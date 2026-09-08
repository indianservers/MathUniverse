export type PlotterFunction = {
  id: "f" | "g" | "h";
  expression: string;
  color: string;
  visible: boolean;
};

export const DEFAULT_PLOTTER_FUNCTIONS: PlotterFunction[] = [
  { id: "f", expression: "x^2 - 2", color: "#0898b7", visible: true },
  { id: "g", expression: "0.8x + 1", color: "#7c3aed", visible: true },
  { id: "h", expression: "sin(x)", color: "#f97316", visible: true },
];

const coefficient = (value: string) =>
  value === "" || value === "+" ? 1 : value === "-" ? -1 : Number(value);

export function evaluatePlotterExpression(expression: string, x: number) {
  const source = expression
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/²/g, "^2");
  if (source === "sin(x)") return Math.sin(x);
  if (source === "cos(x)") return Math.cos(x);
  if (source === "x") return x;
  const quadratic = source.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)?)x\^2([+-](?:\d+(?:\.\d*)?|\.\d+))?$/,
  );
  if (quadratic)
    return coefficient(quadratic[1]) * x * x + Number(quadratic[2] ?? 0);
  const linear = source.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)?)x([+-](?:\d+(?:\.\d*)?|\.\d+))?$/,
  );
  if (linear) return coefficient(linear[1]) * x + Number(linear[2] ?? 0);
  const constant = Number(source);
  return Number.isFinite(constant) ? constant : Number.NaN;
}

export const formatPlotterValue = (value: number) =>
  Number.isFinite(value) ? value.toFixed(3) : "Invalid";

export function plotterIntersections(functions: PlotterFunction[]) {
  const visible = functions.filter((fn) => fn.visible);
  return visible.flatMap((first, index) =>
    visible.slice(index + 1).flatMap((second) => {
      const roots: { pair: string; x: number; y: number; color: string }[] = [];
      const difference = (x: number) =>
        evaluatePlotterExpression(first.expression, x) -
        evaluatePlotterExpression(second.expression, x);
      for (let step = 0; step < 900; step += 1) {
        let left = -4.5 + step * 0.01;
        let right = left + 0.01;
        const leftValue = difference(left);
        const rightValue = difference(right);
        if (
          !Number.isFinite(leftValue + rightValue) ||
          leftValue * rightValue > 0
        )
          continue;
        for (let pass = 0; pass < 35; pass += 1) {
          const middle = (left + right) / 2;
          if (difference(left) * difference(middle) <= 0) right = middle;
          else left = middle;
        }
        const x = (left + right) / 2;
        if (!roots.some((root) => Math.abs(root.x - x) < 0.015)) {
          roots.push({
            pair: `${first.id} & ${second.id}`,
            x,
            y: evaluatePlotterExpression(first.expression, x),
            color: second.color,
          });
        }
      }
      return roots;
    }),
  );
}

export function plotterPath(expression: string) {
  const points: string[] = [];
  for (let index = 0; index <= 360; index += 1) {
    const x = -4.5 + index * 0.025;
    const y = evaluatePlotterExpression(expression, x);
    if (Number.isFinite(y))
      points.push(`${40 + (x + 4.5) * 73.3},${290 - y * 61}`);
  }
  return points.join(" ");
}

export const PLOTTER_SAMPLE_X = [-3, -2, -1, 0, 1, 1.5, 2, 3] as const;
