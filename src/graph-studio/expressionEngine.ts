import type { GraphStudioVariable } from "./types";

const BUILT_INS = new Set([
  "x",
  "y",
  "z",
  "theta",
  "pi",
  "e",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "sqrt",
  "cbrt",
  "abs",
  "ln",
  "log",
  "exp",
  "floor",
  "ceil",
  "round",
  "min",
  "max",
  "sum",
  "product",
  "n",
  "prev",
  "seq",
  "recur",
  "cobweb",
  "param",
  "contour",
  "vector",
  "slope",
]);

export function detectGraphVariables(expressions: string[]) {
  const names = new Set<string>();
  expressions.forEach((expression) => {
    const rightSide = expression.replace(/^\s*[xyzr]\s*=\s*/i, "");
    rightSide.match(/[A-Za-z][A-Za-z0-9_]*/g)?.forEach((token) => {
      const normalized = token.toLowerCase();
      if (normalized === "t" && /^\s*param\s*\(/i.test(expression)) return;
      if (!BUILT_INS.has(normalized)) names.add(token);
    });
  });
  return [...names].filter((name) => name.length <= 12).sort();
}

export function createGraphVariable(
  name: string,
  value = 1,
): GraphStudioVariable {
  const safeValue = Number.isFinite(value) ? value : 1;
  return {
    id: `variable-${name}`,
    name,
    value: safeValue,
    min: -10,
    max: 10,
    step: 0.1,
    playing: false,
    direction: 1,
    playback: "loop",
    speed: 1,
  };
}

export function reconcileGraphVariables(
  expressions: string[],
  current: GraphStudioVariable[],
) {
  const detected = detectGraphVariables(expressions);
  return detected.map(
    (name) =>
      current.find((item) => item.name === name) ?? createGraphVariable(name),
  );
}

export function substituteGraphVariables(
  expression: string,
  variables: GraphStudioVariable[],
) {
  return variables.reduce((result, variable) => {
    const escaped = variable.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeValue = Number.isFinite(variable.value) ? variable.value : 0;
    return result.replace(
      new RegExp(`\\b${escaped}\\b`, "g"),
      `(${Number(safeValue.toFixed(10))})`,
    );
  }, expression);
}

export function advanceGraphVariable(
  variable: GraphStudioVariable,
  dtMs = 60,
): GraphStudioVariable {
  if (!variable.playing || variable.max <= variable.min) return variable;
  const frames = Math.max(0.25, dtMs / 16.666);
  const increment =
    Math.max(0.001, variable.step) * variable.speed * variable.direction * frames;
  let value = variable.value + increment;
  let direction = variable.direction;
  if (variable.playback === "ping-pong") {
    if (value >= variable.max) {
      value = variable.max;
      direction = -1;
    }
    if (value <= variable.min) {
      value = variable.min;
      direction = 1;
    }
  } else {
    const span = variable.max - variable.min;
    if (value > variable.max) value = variable.min + ((value - variable.max) % span);
    if (value < variable.min) value = variable.max - ((variable.min - value) % span);
  }
  return { ...variable, value: Number(value.toFixed(10)), direction };
}

export function explainExpressionError(expression: string, message?: string) {
  if (!expression.trim())
    return {
      message: "Enter an expression to draw.",
      suggestion: "Try y = x^2 or z = sin(x)cos(y).",
    };
  const opens = (expression.match(/\(/g) ?? []).length;
  const closes = (expression.match(/\)/g) ?? []).length;
  if (opens !== closes)
    return {
      message: "Brackets are not balanced.",
      suggestion:
        opens > closes
          ? "Add a closing bracket )."
          : "Remove the extra closing bracket ).",
    };
  if (/\/\s*0(?:\D|$)/.test(expression))
    return {
      message: "Division by zero is undefined.",
      suggestion:
        "Use a variable denominator and inspect values away from zero.",
    };
  return {
    message: message ?? "This notation is not supported yet.",
    suggestion:
      "Check function names, multiplication signs, and variable definitions.",
  };
}
