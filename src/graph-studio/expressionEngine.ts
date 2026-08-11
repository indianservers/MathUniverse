import type { GraphStudioVariable } from "./types";

const BUILT_INS = new Set([
  "x", "y", "z", "t", "theta", "pi", "e", "sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh",
  "sqrt", "cbrt", "abs", "ln", "log", "exp", "floor", "ceil", "round", "min", "max", "sum", "product",
]);

export function detectGraphVariables(expressions: string[]) {
  const names = new Set<string>();
  expressions.forEach((expression) => {
    const rightSide = expression.includes("=") ? expression.slice(expression.indexOf("=") + 1) : expression;
    rightSide.match(/[A-Za-z][A-Za-z0-9_]*/g)?.forEach((token) => {
      const normalized = token.toLowerCase();
      if (!BUILT_INS.has(normalized)) names.add(token);
    });
  });
  return [...names].filter((name) => name.length <= 12).sort();
}

export function createGraphVariable(name: string, value = 1): GraphStudioVariable {
  return {
    id: `variable-${name}`,
    name,
    value,
    min: -10,
    max: 10,
    step: 0.1,
    playing: false,
    direction: 1,
    playback: "loop",
    speed: 1,
  };
}

export function reconcileGraphVariables(expressions: string[], current: GraphStudioVariable[]) {
  const detected = detectGraphVariables(expressions);
  return detected.map((name) => current.find((item) => item.name === name) ?? createGraphVariable(name));
}

export function substituteGraphVariables(expression: string, variables: GraphStudioVariable[]) {
  return variables.reduce((result, variable) => {
    const escaped = variable.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return result.replace(new RegExp(`\\b${escaped}\\b`, "g"), `(${Number(variable.value.toFixed(10))})`);
  }, expression);
}

export function explainExpressionError(expression: string, message?: string) {
  if (!expression.trim()) return { message: "Enter an expression to draw.", suggestion: "Try y = x^2 or z = sin(x)cos(y)." };
  const opens = (expression.match(/\(/g) ?? []).length;
  const closes = (expression.match(/\)/g) ?? []).length;
  if (opens !== closes) return { message: "Brackets are not balanced.", suggestion: opens > closes ? "Add a closing bracket )." : "Remove the extra closing bracket )." };
  if (/\/\s*0(?:\D|$)/.test(expression)) return { message: "Division by zero is undefined.", suggestion: "Use a variable denominator and inspect values away from zero." };
  return { message: message ?? "This notation is not supported yet.", suggestion: "Check function names, multiplication signs, and variable definitions." };
}
