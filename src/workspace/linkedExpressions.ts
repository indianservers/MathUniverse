const reservedNames = new Set([
  "x",
  "y",
  "pi",
  "e",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "ln",
  "log",
  "exp",
  "sqrt",
  "cbrt",
  "abs",
  "floor",
  "ceil",
]);

export type ParameterValues = Record<string, number>;

export function extractParameterNames(expressions: string[]) {
  const names = new Set<string>();
  expressions.forEach((expression) => {
    const cleaned = expression
      .replace(/\bpi\b/gi, "")
      .replace(/[0-9.]+/g, "")
      .toLowerCase();
    cleaned.match(/[a-z]+/g)?.forEach((name) => {
      if (!reservedNames.has(name)) names.add(name);
    });
  });
  return Array.from(names).sort();
}

export function ensureParameterValues(names: string[], current: ParameterValues) {
  return names.reduce<ParameterValues>((next, name) => {
    next[name] = current[name] ?? defaultParameterValue(name);
    return next;
  }, {});
}

export function substituteParameters(expression: string, values: ParameterValues) {
  return Object.entries(values).reduce((next, [name, value]) => {
    return next.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, "g"), `(${Number(value.toFixed(6))})`);
  }, expression);
}

export function summarizeParameters(values: ParameterValues) {
  const entries = Object.entries(values);
  if (!entries.length) return "No active parameters";
  return entries.map(([name, value]) => `${name}=${Number(value.toFixed(3))}`).join(", ");
}

function defaultParameterValue(name: string) {
  if (name === "a") return 1;
  if (name === "b") return 0;
  return 1;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

