import { normalizeCasCommandName, resolveCasCommandSpec, suggestCasCommands, validateCasCommandArguments } from "./casCommandRegistry";

export type ParsedCasInput = {
  raw: string;
  syntax: "command" | "natural" | "assignment" | "expression" | "empty";
  commandName: string;
  normalizedName: string | null;
  args: string[];
  expression: string;
  errors: string[];
  warnings: string[];
};

const naturalCommandAliases: Record<string, string> = {
  solve: "Solve",
  factor: "Factor",
  expand: "Expand",
  simplify: "Simplify",
  derivative: "Derivative",
  differentiate: "Derivative",
  diff: "Derivative",
  integral: "Integral",
  integrate: "Integral",
  limit: "Limit",
  substitute: "Substitute",
  replace: "Substitute",
  numeric: "Numeric",
  approximate: "Numeric",
  assume: "Assume",
};

export function parseCasInput(input: string): ParsedCasInput {
  const raw = input.trim();
  if (!raw) return emptyParsed(input);

  const assignment = parseAssignment(raw);
  if (assignment) {
    return {
      raw,
      syntax: "assignment",
      commandName: "Assume",
      normalizedName: "Assume",
      args: [assignment.name, assignment.value],
      expression: `${assignment.name} := ${assignment.value}`,
      errors: [],
      warnings: [],
    };
  }

  const bracket = parseBracketCommand(raw);
  if (bracket) return withResolvedCommand(raw, "command", bracket.name, bracket.args);

  const natural = parseNaturalCommand(raw);
  if (natural) return withResolvedCommand(raw, "natural", natural.name, natural.args);

  return withResolvedCommand(raw, "expression", "Evaluate", [raw]);
}

export function splitCasArguments(value: string) {
  const args: string[] = [];
  let current = "";
  let roundDepth = 0;
  let squareDepth = 0;
  let curlyDepth = 0;
  let quote: string | null = null;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      current += char;
      if (char === quote && value[index - 1] !== "\\") quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === "(") roundDepth += 1;
    if (char === ")") roundDepth -= 1;
    if (char === "[") squareDepth += 1;
    if (char === "]") squareDepth -= 1;
    if (char === "{") curlyDepth += 1;
    if (char === "}") curlyDepth -= 1;

    if ((char === "," || char === ";") && roundDepth === 0 && squareDepth === 0 && curlyDepth === 0) {
      if (current.trim()) args.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) args.push(current.trim());
  return args;
}

export function hasBalancedCasDelimiters(value: string) {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  let quote: string | null = null;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === quote && value[index - 1] !== "\\") quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if ("([{".includes(char)) stack.push(char);
    if (")]}".includes(char) && stack.pop() !== pairs[char]) return false;
  }
  return stack.length === 0 && !quote;
}

function parseBracketCommand(raw: string) {
  const match = raw.match(/^([A-Za-z][A-Za-z0-9_]*)\s*([\[(])(.*)$/);
  if (!match) return null;
  const opener = match[2];
  const closer = opener === "[" ? "]" : ")";
  if (!raw.endsWith(closer)) return null;
  const body = raw.slice(match[0].length - match[3].length, -1);
  return { name: match[1], args: splitCasArguments(body) };
}

function parseNaturalCommand(raw: string) {
  const match = raw.match(/^([A-Za-z][A-Za-z0-9_-]*)\s+(.+)$/);
  if (!match) return null;
  const commandName = naturalCommandAliases[match[1].toLowerCase()] ?? match[1];
  if (!resolveCasCommandSpec(commandName)) return null;
  return { name: commandName, args: splitCasArguments(match[2]) };
}

function parseAssignment(raw: string) {
  const match = raw.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:=\s*(.+)$/);
  if (!match) return null;
  return { name: match[1], value: match[2].trim() };
}

function withResolvedCommand(raw: string, syntax: ParsedCasInput["syntax"], commandName: string, args: string[]): ParsedCasInput {
  const normalizedName = normalizeCasCommandName(commandName);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!normalizedName) errors.push(`Unknown CAS command "${commandName}".`);
  if (!hasBalancedCasDelimiters(raw)) errors.push("Unbalanced parentheses, brackets, or braces.");
  if (!normalizedName) {
    const suggestions = suggestCasCommands(commandName).map((command) => command.name);
    if (suggestions.length) warnings.push(`Did you mean ${suggestions.join(", ")}?`);
  }
  if (normalizedName) {
    const validation = validateCasCommandArguments(normalizedName, args);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
  }
  if (normalizedName && resolveCasCommandSpec(normalizedName)?.support === "planned") warnings.push(`${normalizedName} is registered but not implemented yet.`);

  return {
    raw,
    syntax,
    commandName,
    normalizedName,
    args,
    expression: args[0] ?? "",
    errors,
    warnings,
  };
}

function emptyParsed(raw: string): ParsedCasInput {
  return {
    raw,
    syntax: "empty",
    commandName: "",
    normalizedName: null,
    args: [],
    expression: "",
    errors: ["Enter a CAS command or expression."],
    warnings: [],
  };
}
