import type { ProblemClassification, ProblemConfidence, ProblemIntentKind } from "./problemTypes";

const excludedWords = new Set([
  "add",
  "and",
  "average",
  "cos",
  "det",
  "determinant",
  "differentiate",
  "difference",
  "divide",
  "divided",
  "expand",
  "factor",
  "factorial",
  "factorise",
  "factorize",
  "integral",
  "integrate",
  "inverse",
  "lim",
  "limit",
  "ln",
  "log",
  "matrix",
  "maximum",
  "mean",
  "median",
  "minimum",
  "minus",
  "mode",
  "mul",
  "multiplication",
  "multiply",
  "of",
  "pi",
  "plus",
  "percent",
  "percentage",
  "product",
  "quartiles",
  "range",
  "reduce",
  "remainder",
  "simplify",
  "sin",
  "solve",
  "sqrt",
  "stats",
  "standard",
  "subtract",
  "sum",
  "summary",
  "statistics",
  "tan",
  "times",
  "transpose",
  "variance",
  "weighted",
  "weights",
]);

const supportedFunctions = [
  "sin", "cos", "tan", "log", "log10", "log2", "ln", "sqrt", "abs", "exp",
  "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "cosh", "cot", "coth", "csc", "csch", "sec", "sech", "sinh", "tanh",
  "sum", "product", "average", "mean", "median", "mode", "min", "max", "count", "counta", "countblank",
  "averagea", "maxa", "mina", "mode.sngl", "mode.mult",
  "stdev", "stdev.s", "stdev.p", "stdeva", "stdevpa", "var", "var.s", "var.p", "vara", "varpa", "variance",
  "round", "roundup", "rounddown", "int", "trunc", "ceiling", "ceiling.math", "ceiling.precise", "iso.ceiling", "floor", "floor.math", "floor.precise", "mround", "mod", "quotient", "power", "sign",
  "sqrtpi", "degrees", "radians", "fact", "factdouble", "gcd", "hcf", "lcm", "percent", "pi", "rand", "randbetween",
  "geomean", "harmean", "sumsq", "sumproduct", "sumx2my2", "sumx2py2", "sumxmy2", "large", "small",
  "quartile", "quartile.inc", "quartile.exc", "percentile", "percentile.inc", "percentile.exc", "percentrank.inc",
  "combin", "combina", "permut", "permutationa", "multinomial",
  "avedev", "devsq", "skew", "kurt", "standardize", "rank.eq", "rank.avg",
  "correl", "pearson", "covariance.p", "covariance.s", "slope", "intercept", "rsq", "forecast.linear", "steyx",
  "norm.dist", "norm.s.dist", "binom.dist", "poisson.dist", "expon.dist", "weibull.dist", "lognorm.dist",
];

const statisticsFormulaNames = new Set([
  "average", "mean", "median", "mode", "mode.sngl", "range", "variance", "var", "var.p", "var.s",
  "stdev", "stdev.p", "stdev.s", "standarddeviation", "quartiles",
  "five-number-summary", "frequency", "frequency.table", "stats", "statistics", "summary",
]);

export function classifyProblem(input: string): ProblemClassification {
  const rawInput = input;
  const trimmed = input.trim();
  if (!trimmed) return unsupported(rawInput, "No input was provided.", "low", ["Enter a math expression or equation."]);

  const normalizedText = stripPromptPrefix(normalizeText(trimmed));

  if (isMatrixLike(normalizedText)) {
    return classification("matrix", rawInput, normalizeExpression(normalizedText), {
      confidence: "high",
      expression: stripMatrixCommand(normalizedText),
      reason: "Detected matrix notation or a matrix operation keyword.",
      assumptions: ["Matrix operations are detected but not solved in Phase 2."],
    });
  }

  const system = parseSystem(normalizedText);
  if (system) {
    return classification("system", rawInput, system.normalizedInput, {
      confidence: "high",
      expression: system.equations.join("; "),
      variables: system.variables,
      reason: "Detected multiple equations joined by and, semicolon, or newline.",
      assumptions: ["Equations are treated as a simultaneous system."],
    });
  }

  if (isPercentChangePrompt(normalizedText)) {
    return classification("word-problem", rawInput, normalizedText, {
      confidence: "high",
      expression: normalizedText,
      reason: "Detected a percent-change word problem with old and new values.",
      assumptions: ["Percent change is computed as (new value - original value) / original value x 100."],
    });
  }

  const command = parseCommandIntent(normalizedText);
  if (command) return commandResult(rawInput, command.kind, command.expression, command.variable, command.reason);

  const stats = parseStatistics(normalizedText);
  if (stats) {
    return classification("statistics", rawInput, stats.expression, {
      confidence: "high",
      expression: stats.expression,
      reason: stats.reason,
      assumptions: ["Statistics operations are detected but not solved in Phase 2."],
    });
  }

  if (normalizedText.includes("=")) return classifyEquation(rawInput, normalizedText);

  if (isEvaluateExpression(normalizedText)) {
    return classification("evaluate", rawInput, normalizeExpression(normalizedText), {
      confidence: "high",
      expression: normalizeExpression(normalizedText),
      reason: "Detected a numeric or function expression with no equation.",
      assumptions: trigAssumptions(normalizedText),
    });
  }

  if (looksLikeWordProblem(normalizedText)) {
    return classification("word-problem", rawInput, normalizedText, {
      confidence: "medium",
      expression: normalizedText,
      reason: "Detected a word-problem style prompt with measurable quantities.",
      assumptions: ["A deterministic word-problem parser will try common classroom patterns before giving up."],
    });
  }

  return unsupported(rawInput, "Input did not match a supported Phase 2 intent.", "low", ["Try an equation, explicit command, number list, or matrix expression."]);
}

function classifyEquation(rawInput: string, equation: string): ProblemClassification {
  const normalizedInput = normalizeExpression(equation);
  const variables = extractVariables(normalizedInput);
  if (variables.length !== 1) {
    return unsupported(rawInput, "Equation does not contain exactly one supported variable.", "medium", ["Use system syntax for multiple equations or a one-variable equation for this solver."]);
  }

  const variable = variables[0];
  const degree = polynomialDegree(normalizedInput, variable);
  const kind: ProblemIntentKind = degree <= 1 ? "linear-equation" : degree === 2 ? "quadratic-equation" : "polynomial-equation";
  return classification(kind, rawInput, normalizedInput, {
    confidence: "high",
    expression: normalizedInput,
    variable,
    variables,
    reason: `Detected a one-variable equation in ${variable} with degree ${degree}.`,
    assumptions: [`Solve for ${variable}.`],
  });
}

function commandResult(rawInput: string, kind: ProblemIntentKind, expression: string, variable: string | undefined, reason: string): ProblemClassification {
  const normalizedExpression = normalizeExpression(expression);
  return classification(kind, rawInput, normalizedExpression, {
    confidence: "high",
    expression: normalizedExpression,
    variable,
    variables: variable ? [variable] : extractVariables(normalizedExpression),
    reason,
    assumptions: operationAssumptions(kind, variable),
  });
}

function classification(kind: ProblemIntentKind, rawInput: string, normalizedInput: string, options: {
  assumptions?: string[];
  confidence?: ProblemConfidence;
  expression?: string;
  reason: string;
  variable?: string;
  variables?: string[];
  warnings?: string[];
}): ProblemClassification {
  return {
    kind,
    rawInput,
    normalizedInput,
    expression: options.expression,
    variable: options.variable,
    variables: options.variables,
    confidence: options.confidence ?? "medium",
    assumptions: options.assumptions ?? [],
    warnings: options.warnings ?? [],
    reason: options.reason,
  };
}

function unsupported(rawInput: string, reason: string, confidence: ProblemConfidence, warnings: string[] = []): ProblemClassification {
  return classification("unsupported", rawInput, normalizeText(rawInput), {
    confidence,
    reason,
    warnings,
  });
}

function parseCommandIntent(value: string): { kind: ProblemIntentKind; expression: string; reason: string; variable?: string } | null {
  const arithmetic = arithmeticCommandExpression(value);
  if (arithmetic) return { kind: "evaluate", expression: arithmetic.expression, reason: arithmetic.reason };

  const simplify = commandExpression(value, ["simplify", "reduce"]);
  if (simplify) return { kind: "simplify", expression: simplify, reason: "Detected simplify/reduce command." };

  const factor = commandExpression(value, ["factor", "factorise", "factorize"]);
  if (factor) return { kind: "factor", expression: factor, reason: "Detected factor/factorise/factorize command." };

  const expand = commandExpression(value, ["expand"]);
  if (expand) return { kind: "expand", expression: expand, reason: "Detected expand command." };

  const derivativeByOperator = value.match(/^d\/d([a-zA-Z])\s+(.+)$/i) ?? value.match(/^dy\/d([a-zA-Z])\s+(.+)$/i);
  if (derivativeByOperator) return { kind: "derivative", expression: derivativeByOperator[2], variable: derivativeByOperator[1], reason: "Detected derivative operator notation." };
  const derivative = value.match(/^(?:derivative\s+of|differentiate)\s+(.+)$/i);
  if (derivative) return { kind: "derivative", expression: derivative[1], variable: "x", reason: "Detected derivative command." };

  const integral = value.match(/^(?:integrate|integral\s+of|∫|âˆ«)\s+(.+)$/i);
  if (integral) return { kind: "integral", expression: integral[1], variable: "x", reason: "Detected integral command." };

  const limit = value.match(/^(?:limit|lim)\s+([a-zA-Z])\s*(?:->|→|â†’)\s*([^\s]+)\s+(.+)$/i);
  if (limit) return { kind: "limit", expression: limit[3], variable: limit[1], reason: `Detected limit as ${limit[1]} approaches ${limit[2]}.` };
  const looseLimit = value.match(/^(?:limit|lim)\s+(.+)$/i);
  if (looseLimit) return { kind: "limit", expression: looseLimit[1], variable: "x", reason: "Detected limit command." };

  return null;
}

function parseStatistics(value: string): { expression: string; reason: string } | null {
  const weighted = value.match(/^weighted\s+(?:mean|average)\s+values\s+(.+?)\s+weights\s+(.+)$/i);
  if (weighted) return { expression: value, reason: "Detected weighted mean statistics command." };

  const excel = parseFunctionCall(value);
  if (excel && statisticsFormulaNames.has(excel.name)) {
    return { expression: normalizeNumberList(excel.args), reason: `Detected Excel-style ${excel.name.toUpperCase()} statistics formula.` };
  }

  const colon = value.match(/^(mean|average|median|mode|range|variance|sample\s+variance|standard\s+deviation|sample\s+standard\s+deviation|quartiles|five\s+number\s+summary|frequency\s+table|stats|statistics)\s*:\s*(.+)$/i);
  if (colon) return { expression: normalizeNumberList(colon[2]), reason: `Detected ${colon[1].toLowerCase()} statistics command.` };

  const stats = value.match(/^(mean|average|median|mode|range|variance|sample\s+variance|standard\s+deviation|sample\s+standard\s+deviation|quartiles|five\s+number\s+summary|frequency\s+table)\s+of\s+(.+)$/i);
  if (stats) return { expression: normalizeNumberList(stats[2]), reason: `Detected ${stats[1].toLowerCase()} statistics command.` };
  if (/^statistics\s+/.test(value.toLowerCase())) return { expression: normalizeNumberList(value.replace(/^statistics\s+/i, "")), reason: "Detected statistics keyword." };
  return null;
}

function parseSystem(value: string) {
  const withoutSolve = value.replace(/^solve\s+/i, "");
  const pieces = withoutSolve.split(/\s+and\s+|;|\n/).map((piece) => piece.trim()).filter(Boolean);
  if (pieces.length < 2 || pieces.filter((piece) => piece.includes("=")).length < 2) return null;
  const equations = pieces.map(normalizeExpression);
  const variables = Array.from(new Set(equations.flatMap(extractVariables)));
  return { equations, normalizedInput: equations.join("; "), variables };
}

function isMatrixLike(value: string) {
  return /^\s*\[\s*\[/.test(value) || /^[-+]?\d+(?:\.\d+)?\s*\*\s*\[\s*\[/.test(value) || /^(matrix|determinant|inverse|transpose|rref|solve\s+matrix)\b/i.test(value);
}

function stripMatrixCommand(value: string) {
  return value.replace(/^(matrix|determinant|inverse|transpose|rref|solve\s+matrix)\s+/i, "").trim();
}

function isEvaluateExpression(value: string) {
  if (arithmeticCommandExpression(value)) return true;
  if (/^[\d+\-*/%^!().,\s]+$/.test(value)) return true;
  const functionCall = parseFunctionCall(value);
  if (functionCall && supportedFunctions.includes(functionCall.name)) return true;
  if (new RegExp(`^(?:${supportedFunctions.map(escapeRegExp).join("|")})\\s+-?\\d+(?:\\.\\d+)?$`, "i").test(value)) return true;
  if (/^1\s*\/\s*\(.+\)$/i.test(value)) return true;
  if (/^[\dx+\-*/^().,\s]+$/i.test(value) && /x/i.test(value)) return true;
  return false;
}

function looksLikeWordProblem(value: string) {
  const words = value.match(/[a-zA-Z]{2,}/g) ?? [];
  const numbers = extractNumbers(value);
  const mathSignals = /[=^*/+\-()[\],]/.test(value);
  const supportedWordSignals = /(train|leaves|station|speed|distance|time|age|cost|work|mixture|rectangle|rectangular|length|width|breadth|perimeter|area|circle|radius|diameter|circumference|ratio|principal|interest|rate|unit|price|for|per)/i;
  return supportedWordSignals.test(value) || (numbers.length >= 2 && /\b(for|per|to|ratio|from)\b/i.test(value)) || (words.length >= 3 && !mathSignals);
}

function isPercentChangePrompt(value: string) {
  const hasPercentChangeWords = /\b(?:percent|percentage)?\s*(?:increase|decrease|change)\b/i.test(value);
  const hasOldToNewValues = /\b(?:from|old|original|initial)\s+-?\d+(?:\.\d+)?\s+\b(?:to|new|final)\s+-?\d+(?:\.\d+)?\b/i.test(value);
  return hasPercentChangeWords && hasOldToNewValues;
}

function commandExpression(value: string, commands: string[]) {
  const trimmed = value.trim();
  for (const command of commands) {
    const lower = trimmed.toLowerCase();
    if (lower.startsWith(`${command} `)) return trimmed.slice(command.length).trim();
    if (lower.startsWith(`${command}(`) && trimmed.endsWith(")")) return trimmed.slice(command.length + 1, -1).trim();
  }
  return null;
}

function parseFunctionCall(value: string) {
  const match = value.trim().match(/^=?\s*([a-z][a-z0-9.]*)\s*\((.*)\)\s*$/i);
  if (!match) return null;
  return { name: match[1].toLowerCase(), args: match[2].trim() };
}

function stripPromptPrefix(value: string) {
  let current = value.trim().replace(/\?+$/g, "").trim();
  const prefixPattern = /^(?:please\s+|can you\s+|could you\s+|would you\s+)?(?:what is|what's|calculate|compute|evaluate|find|solve)\s+(?:for\s+)?/i;
  while (prefixPattern.test(current)) current = current.replace(prefixPattern, "").trim();
  return current.replace(/^the\s+value\s+of\s+/i, "").trim();
}

function arithmeticCommandExpression(value: string): { expression: string; reason: string } | null {
  const lower = value.trim().toLowerCase();
  const percent = value.trim().match(/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*(?:percent|%)\s+of\s+(.+)$/i);
  if (percent) {
    const base = extractNumbers(percent[2]);
    if (base.length) return { expression: `percent(${percent[1]},${base[0]})`, reason: "Detected percent-of command and converted it to a percentage operation." };
  }

  const command = lower.match(/^(sum|add|plus|total|subtract|minus|difference|multiply|multiplication|mul|times|product|divide|divided|quotient|power|square|cube|reciprocal|mod|modulo|remainder|gcd|hcf|lcm|min|minimum|smallest|max|maximum|largest|absolute|abs|factorial|percent|percentage)\b/);
  if (!command) return null;

  const subtractFrom = value.trim().match(/^subtract\s+(.+?)\s+from\s+(.+)$/i);
  if (subtractFrom) {
    const subtrahend = extractNumbers(subtractFrom[1]);
    const minuend = extractNumbers(subtractFrom[2]);
    if (subtrahend.length && minuend.length) {
      return { expression: `${minuend[0]}-${subtrahend[0]}`, reason: "Detected subtract-from command and converted it to subtraction." };
    }
  }

  const rest = value.trim().slice(command[0].length).replace(/^(of|by)\b/i, "").trim();
  const numbers = extractNumbers(rest);
  const op = command[1];
  if (!numbers.length) return null;

  if (["sum", "add", "plus", "total"].includes(op)) {
    return { expression: numbers.join("+"), reason: `Detected ${op} command and converted it to addition.` };
  }
  if (["multiply", "multiplication", "mul", "times", "product"].includes(op)) {
    return { expression: numbers.join("*"), reason: `Detected ${op} command and converted it to multiplication.` };
  }
  if (["subtract", "minus", "difference"].includes(op)) {
    if (numbers.length < 2) return null;
    return { expression: numbers.join("-"), reason: `Detected ${op} command and converted it to subtraction.` };
  }
  if (["divide", "divided", "quotient"].includes(op)) {
    if (numbers.length < 2) return null;
    return { expression: numbers.join("/"), reason: `Detected ${op} command and converted it to division.` };
  }
  if (op === "power") {
    if (numbers.length < 2) return null;
    return { expression: `${numbers[0]}^${numbers[1]}`, reason: "Detected power command and converted it to exponentiation." };
  }
  if (op === "square") {
    return { expression: `${numbers[0]}^2`, reason: "Detected square command and converted it to exponentiation." };
  }
  if (op === "cube") {
    return { expression: `${numbers[0]}^3`, reason: "Detected cube command and converted it to exponentiation." };
  }
  if (op === "reciprocal") {
    return { expression: `1/${numbers[0]}`, reason: "Detected reciprocal command and converted it to division." };
  }
  if (["mod", "modulo", "remainder"].includes(op)) {
    if (numbers.length < 2) return null;
    return { expression: `${numbers[0]}%${numbers[1]}`, reason: `Detected ${op} command and converted it to modulo arithmetic.` };
  }
  if (["gcd", "hcf"].includes(op)) {
    if (numbers.length < 2) return null;
    return { expression: `gcd(${numbers.join(",")})`, reason: `Detected ${op} command and converted it to greatest common divisor.` };
  }
  if (op === "lcm") {
    if (numbers.length < 2) return null;
    return { expression: `lcm(${numbers.join(",")})`, reason: "Detected lcm command and converted it to least common multiple." };
  }
  if (["min", "minimum", "smallest"].includes(op)) {
    return { expression: `min(${numbers.join(",")})`, reason: `Detected ${op} command and converted it to a minimum operation.` };
  }
  if (["max", "maximum", "largest"].includes(op)) {
    return { expression: `max(${numbers.join(",")})`, reason: `Detected ${op} command and converted it to a maximum operation.` };
  }
  if (["absolute", "abs"].includes(op)) {
    return { expression: `abs(${numbers[0]})`, reason: "Detected absolute value command." };
  }
  if (op === "factorial") {
    return { expression: `${numbers[0]}!`, reason: "Detected factorial command." };
  }
  if (["percent", "percentage"].includes(op)) {
    if (numbers.length < 2) return null;
    return { expression: `percent(${numbers[0]},${numbers[1]})`, reason: "Detected percent command and converted it to a percentage operation." };
  }
  return null;
}

function extractNumbers(value: string) {
  return (value
    .replace(/\b(and|by|from|of|with|to|plus|minus|times|multiplied|multiply|divided|divide)\b/gi, " ")
    .match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [])
    .map((number) => number.replace(/^\+/, ""));
}

function normalizeText(value: string) {
  return normalizeUnicodeMath(value).trim().replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ");
}

function normalizeExpression(value: string) {
  const functionTokens = new Map<string, string>();
  let normalized = normalizeText(value)
    .replace(/→|â†’/g, "->")
    .replace(new RegExp(`^(${supportedFunctions.map(escapeRegExp).join("|")})\\s+(-?\\d+(?:\\.\\d+)?)$`, "i"), "$1($2)");

  for (const functionName of [...supportedFunctions].sort((a, b) => b.length - a.length)) {
    normalized = normalized.replace(new RegExp(`\\b${escapeRegExp(functionName)}\\s*\\(`, "gi"), (match) => {
      const token = `@#${functionTokens.size}#@`;
      functionTokens.set(token, match.replace(/\s+/g, ""));
      return token;
    });
  }

  normalized = normalized
    .replace(/\s+/g, "")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/([a-zA-Z)])(\d)/g, "$1*$2")
    .replace(/\)([a-zA-Z(])/g, ")*$1");

  for (const [token, functionCall] of functionTokens) {
    normalized = normalized.replace(token, functionCall);
  }

  return normalized;
}

function normalizeUnicodeMath(value: string) {
  const unicodeNormalized = value
    .replace(/→/g, "->")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≠/g, "!=")
    .replace(/×|·/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/∞/g, "infinity")
    .replace(/−/g, "-")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√\s*\(?\s*([^)\s]+)\s*\)?/g, (_, radicand: string) => `sqrt(${radicand})`);
  return unicodeNormalized
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00a0\u00e2\u20ac\u2122|\u00e2\u2020\u2019/g, "->")
    .replace(/â‰¤|≤/g, "<=")
    .replace(/â‰¥|≥/g, ">=")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u00b0\u00c2\u00a0|\u00e2\u2030\u00a0/g, "!=")
    .replace(/Ã—|×|·/g, "*")
    .replace(/Ã·|÷/g, "/")
    .replace(/Ï€|π/g, "pi")
    .replace(/âˆž|∞/g, "infinity")
    .replace(/âˆ’|−/g, "-")
    .replace(/Â²|²/g, "^2")
    .replace(/Â³|³/g, "^3")
    .replace(/âˆš\s*\(?\s*([^)\s]+)\s*\)?|√\s*\(?\s*([^)\s]+)\s*\)?/g, (_, mojibakeRadicand: string | undefined, radicand: string | undefined) => `sqrt(${mojibakeRadicand ?? radicand})`);
}

function normalizeNumberList(value: string) {
  return value.split(/,|\s+/).map((item) => item.trim()).filter(Boolean).join(", ");
}

function extractVariables(value: string) {
  const normalized = normalizeExpression(value);
  const words = normalized.match(/[a-zA-Z]+/g) ?? [];
  return Array.from(new Set(words.filter((word) => word.length === 1 && !excludedWords.has(word.toLowerCase()))));
}

function polynomialDegree(value: string, variable: string) {
  const escaped = escapeRegExp(variable);
  const powers = Array.from(value.matchAll(new RegExp(`${escaped}\\^(\\d+)`, "g"))).map((match) => Number(match[1]));
  const hasBareVariable = new RegExp(`(^|[^a-zA-Z])${escaped}([^a-zA-Z^]|$)`).test(value);
  return Math.max(hasBareVariable ? 1 : 0, ...powers, 0);
}

function operationAssumptions(kind: ProblemIntentKind, variable?: string) {
  if (kind === "derivative" || kind === "integral" || kind === "limit") return [`Use ${variable ?? "x"} as the variable unless the input states otherwise.`];
  if (kind === "evaluate") return ["Evaluate the expression without solving for a variable."];
  return [`${labelForKind(kind)} is detected but full solving is deferred to a later phase.`];
}

function trigAssumptions(value: string) {
  return /^(sin|cos|tan)\s*\(/i.test(value) ? ["Trigonometric angle mode is not evaluated in Phase 2."] : ["Evaluate the expression directly; no variable solving is assumed."];
}

function labelForKind(kind: ProblemIntentKind) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
