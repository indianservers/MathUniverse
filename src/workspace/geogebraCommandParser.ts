import { workspaceCommandCatalog, type CommandGroup } from "./commandRegistry";

export type CommandCategory = "graph" | "geometry2d" | "geometry3d" | "cas" | "spreadsheet" | "statistics" | "scripting" | "teaching" | "unknown";

export type ParsedCommandArgument =
  | { type: "number"; value: number; raw: string }
  | { type: "point2"; value: [number, number]; raw: string }
  | { type: "point3"; value: [number, number, number]; raw: string }
  | { type: "range"; value: string; raw: string }
  | { type: "identifier"; value: string; raw: string }
  | { type: "expression"; value: string; raw: string };

export type ParsedWorkspaceCommand = {
  raw: string;
  assignment?: string;
  name: string;
  normalizedName: string;
  category: CommandCategory;
  group?: CommandGroup;
  args: ParsedCommandArgument[];
  parentIds: string[];
};

const categoryByGroup: Record<CommandGroup, CommandCategory> = {
  Algebra: "graph",
  "Geometry 2D": "geometry2d",
  "Geometry 3D": "geometry3d",
  Calculus: "cas",
  "Lists And Tables": "spreadsheet",
  Matrices: "cas",
  Spreadsheet: "spreadsheet",
  Transformations: "geometry2d",
  Scripting: "scripting",
  Teaching: "teaching",
};

const commandByName = new Map(
  workspaceCommandCatalog.flatMap((spec) => [[spec.name.toLowerCase(), spec], ...spec.aliases.map((alias) => [alias.toLowerCase(), spec] as const)])
);

export function parseGeoGebraCommand(input: string): ParsedWorkspaceCommand {
  const raw = input.trim();
  if (!raw) throw new Error("Enter a command or definition.");
  const { assignment, expression } = splitAssignment(raw);
  const command = parseCommandExpression(expression, assignment);
  return command;
}

export function parseCommandList(input: string) {
  return splitTopLevel(input, ";").map(parseGeoGebraCommand);
}

function parseCommandExpression(expression: string, assignment?: string): ParsedWorkspaceCommand {
  const commandMatch = expression.match(/^([A-Za-z][A-Za-z0-9_]*)\s*\[(.*)\]$/);
  const functionMatch = expression.match(/^([a-zA-Z]\w*)\s*\(([^)]*)\)\s*=\s*(.+)$/);

  if (functionMatch) {
    const name = "Function";
    const args = [{ type: "expression" as const, value: functionMatch[3].trim(), raw: functionMatch[3].trim() }];
    return buildParsed(expression, assignment ?? functionMatch[1], name, args);
  }

  if (!commandMatch) {
    const point = parsePoint(expression);
    if (point?.type === "point2" || point?.type === "point3") {
      return buildParsed(expression, assignment, point.type === "point3" ? "Point3D" : "Point", [point]);
    }
    return buildParsed(expression, assignment, "Plot", [{ type: "expression", value: expression.trim(), raw: expression.trim() }]);
  }

  const name = commandMatch[1];
  const args = splitTopLevel(commandMatch[2], ",").map(parseArgument);
  return buildParsed(expression, assignment, name, args);
}

function buildParsed(rawExpression: string, assignment: string | undefined, name: string, args: ParsedCommandArgument[]): ParsedWorkspaceCommand {
  const spec = commandByName.get(name.toLowerCase());
  const normalizedName = spec?.name ?? name;
  const category = spec ? categoryByGroup[spec.group] : inferCategory(normalizedName, args);
  return {
    raw: assignment ? `${assignment}=${rawExpression}` : rawExpression,
    assignment,
    name,
    normalizedName,
    category,
    group: spec?.group,
    args,
    parentIds: parentIdsFromArgs(args),
  };
}

function parseArgument(rawInput: string): ParsedCommandArgument {
  const raw = rawInput.trim();
  const point = parsePoint(raw);
  if (point) return point;
  if (/^[A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?$/i.test(raw)) return { type: "range", value: raw.toUpperCase(), raw };
  const numeric = Number(raw);
  if (raw && Number.isFinite(numeric)) return { type: "number", value: numeric, raw };
  if (/^[A-Za-z]\w*$/.test(raw)) return { type: "identifier", value: raw, raw };
  return { type: "expression", value: raw, raw };
}

function parsePoint(raw: string): ParsedCommandArgument | null {
  const match = raw.match(/^\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,\s*(-?\d+(?:\.\d+)?))?\s*\)?$/);
  if (!match) return null;
  if (match[3] !== undefined) return { type: "point3", value: [Number(match[1]), Number(match[2]), Number(match[3])], raw };
  return { type: "point2", value: [Number(match[1]), Number(match[2])], raw };
}

function splitAssignment(raw: string) {
  const parts = splitTopLevel(raw, "=");
  if (parts.length >= 2 && /^[A-Za-z]\w*(?:\([A-Za-z]\w*\))?$/.test(parts[0].trim())) {
    return { assignment: parts[0].replace(/\(.+\)$/, "").trim(), expression: parts.slice(1).join("=").trim() };
  }
  return { expression: raw };
}

function splitTopLevel(input: string, delimiter: string) {
  const output: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of input) {
    if (char === "[" || char === "(" || char === "{") depth += 1;
    if (char === "]" || char === ")" || char === "}") depth -= 1;
    if (char === delimiter && depth === 0) {
      output.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) output.push(current.trim());
  return output;
}

function parentIdsFromArgs(args: ParsedCommandArgument[]) {
  return Array.from(new Set(args.filter((arg) => arg.type === "identifier").map((arg) => arg.value)));
}

function inferCategory(name: string, args: ParsedCommandArgument[]): CommandCategory {
  if (/plane|sphere|cone|cylinder|prism|pyramid|surface|3d/i.test(name) || args.some((arg) => arg.type === "point3")) return "geometry3d";
  if (/point|line|segment|ray|circle|polygon|conic|tangent|locus|angle|distance|area|mirror|rotate|translate|dilate/i.test(name)) return "geometry2d";
  if (/spreadsheet|regression|range|fill|table|list/i.test(name)) return "spreadsheet";
  if (/derivative|integral|solve|factor|expand|simplify|limit|series|cas/i.test(name)) return "cas";
  if (/slider|set|animation/i.test(name)) return "scripting";
  return "graph";
}
