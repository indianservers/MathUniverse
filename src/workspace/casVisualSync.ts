export type CasVisualSyncLink = {
  id: string;
  label: string;
  kind: "plot" | "table" | "command";
  expression?: string;
  command?: string;
  auto?: boolean;
};

type CasVisualResult = {
  input: string;
  interpretation: string;
  result: string;
  related?: string[];
};

export function createCasVisualSyncLinks(result: CasVisualResult): CasVisualSyncLink[] {
  const links = new Map<string, CasVisualSyncLink>();
  const add = (link: Omit<CasVisualSyncLink, "id">) => {
    const key = `${link.kind}:${link.expression ?? link.command ?? link.label}`;
    if (!links.has(key)) links.set(key, { ...link, id: key });
  };

  for (const command of result.related ?? []) {
    const parsed = parseVisualCommand(command);
    if (parsed) add(parsed);
    else add({ kind: "command", command, label: command });
  }

  const expression = expressionFromInput(result.input);
  const cleanResult = cleanGraphExpression(result.result);
  const interpretation = result.interpretation.toLowerCase();

  if (interpretation.includes("derivative")) {
    if (isGraphableExpression(expression)) add({ kind: "plot", expression, label: "Plot original", auto: true });
    if (isGraphableExpression(cleanResult)) add({ kind: "plot", expression: cleanResult, label: "Plot derivative", auto: true });
  } else if (interpretation.includes("integral")) {
    if (isGraphableExpression(expression)) add({ kind: "plot", expression, label: "Plot integrand", auto: true });
    if (isGraphableExpression(cleanResult)) add({ kind: "plot", expression: cleanResult, label: "Plot antiderivative" });
  } else if (/(simplify|factor|expand)/i.test(result.interpretation)) {
    if (isGraphableExpression(expression)) add({ kind: "plot", expression, label: "Plot input", auto: true });
    if (isGraphableExpression(cleanResult)) add({ kind: "plot", expression: cleanResult, label: "Plot result", auto: true });
  } else if (interpretation.includes("solve") || interpretation.includes("roots")) {
    const residual = residualExpression(expression);
    if (isGraphableExpression(residual)) add({ kind: "plot", expression: residual, label: "Plot residual", auto: true });
  } else if (interpretation.includes("table")) {
    if (isGraphableExpression(expression)) add({ kind: "plot", expression, label: "Plot table expression", auto: true });
  }

  return Array.from(links.values()).slice(0, 6);
}

export function autoPlotExpressions(links: CasVisualSyncLink[]) {
  return links.filter((link) => link.kind === "plot" && link.auto && link.expression).map((link) => link.expression as string);
}

function parseVisualCommand(command: string): Omit<CasVisualSyncLink, "id"> | null {
  const trimmed = command.trim();
  const plot = trimmed.match(/^plot\s+(.+)/i);
  if (plot) return { kind: "plot", expression: cleanGraphExpression(plot[1]), label: trimmed };
  const table = trimmed.match(/^table\s+(.+)/i);
  if (table) return { kind: "table", expression: cleanGraphExpression(table[1]), command: trimmed, label: trimmed };
  return { kind: "command", command: trimmed, label: trimmed };
}

function expressionFromInput(input: string) {
  return input
    .replace(/^(please\s+)?(plot|graph|draw|visuali[sz]e|solve|find|calculate|compute|differentiate|derivative of|derivative|diff|integrate|integral of|integral|antiderivative of|factor|expand|simplify|table of|table|values of|roots?)\s+/i, "")
    .trim();
}

function cleanGraphExpression(expression: string) {
  return expression
    .replace(/\s*\+\s*C\s*$/i, "")
    .replace(/^y\s*=\s*/i, "")
    .trim();
}

function residualExpression(expression: string) {
  const [left, ...rightParts] = expression.split("=");
  if (!rightParts.length) return cleanGraphExpression(expression);
  return `${left.trim()}-(${rightParts.join("=").trim()})`;
}

function isGraphableExpression(expression: string) {
  const clean = cleanGraphExpression(expression);
  if (!clean || clean.length > 90) return false;
  if (/[{}[\]|;]/.test(clean)) return false;
  if (!/[xyt0-9]/i.test(clean)) return false;
  if (/^(x\s*=|use\s|no\s|generated\s|area\s*=)/i.test(clean)) return false;
  return /^[a-z0-9+\-*/^().,\s=<>&!]+$/i.test(clean);
}
