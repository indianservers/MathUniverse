import {
  symbolicDerivative,
  symbolicExpand,
  symbolicFactor,
  symbolicIntegral,
  symbolicSimplify,
  symbolicSolve,
  trySymbolic,
  type SymbolicResult,
} from "../utils/symbolic";

export type WorkspaceCasIntent =
  | "plot"
  | "solve"
  | "simplify"
  | "factor"
  | "expand"
  | "differentiate"
  | "integrate"
  | "table"
  | "geometry"
  | "matrix"
  | "unknown"
  | "external-data-tool";

export type WorkspaceCasQuery = {
  intent: WorkspaceCasIntent;
  expression: string;
  confidence: "high" | "medium" | "low";
  reason: string;
  blocked?: boolean;
};

export type WorkspaceCasResult = {
  query: WorkspaceCasQuery;
  symbolic?: SymbolicResult;
  result?: string;
  detail: string;
  steps: string[];
  related: string[];
};

export function routeWorkspaceCasQuery(input: string): WorkspaceCasQuery {
  const raw = input.trim();
  const query = raw.toLowerCase();
  const dataTool = /\b(probability|statistics|spreadsheet|csv|histogram|mean|median|standard deviation|regression|distribution|dice|coin|card)\b/.test(query);
  if (dataTool) {
    return {
      intent: "external-data-tool",
      expression: raw,
      confidence: "high",
      blocked: true,
      reason: "This request belongs to the separate probability, statistics, and spreadsheet tool.",
    };
  }

  const intent = detectIntent(query);
  const expression = extractExpression(raw, intent);
  return {
    intent,
    expression,
    confidence: intent === "unknown" ? "low" : expression ? "high" : "medium",
    reason: buildReason(intent, expression),
  };
}

export function runWorkspaceCasQuery(input: string): WorkspaceCasResult | null {
  const query = routeWorkspaceCasQuery(input);
  if (query.intent === "unknown") return null;
  if (query.intent === "external-data-tool") {
    return {
      query,
      result: "Use the dedicated data tool",
      detail: query.reason,
      steps: [
        "Detected probability, statistics, or spreadsheet intent.",
        "Math Universe will not duplicate that separate tool.",
        "Use the external data workflow for this request, then return to Math Universe for symbolic, graphing, geometry, and 3D work.",
      ],
      related: ["Open the dedicated probability/statistics/spreadsheet tool"],
    };
  }

  const expression = query.expression;
  if (!expression && !["geometry", "matrix"].includes(query.intent)) return null;

  const symbolic = runSymbolicIntent(query.intent, expression);
  if (symbolic) {
    return {
      query,
      symbolic,
      result: symbolic.result,
      detail: `${query.reason} ${symbolic.detail}`,
      steps: [
        `Intent: ${query.intent}.`,
        `Expression: ${expression}.`,
        ...symbolic.steps,
        "Result can be linked to graph, table, or follow-up commands when available.",
      ],
      related: relatedForIntent(query.intent, expression, symbolic.result),
    };
  }

  return {
    query,
    result: expression,
    detail: query.reason,
    steps: [
      `Intent: ${query.intent}.`,
      expression ? `Extracted expression: ${expression}.` : "No standalone expression was extracted.",
      "Use a precise command if you want a direct symbolic result.",
    ],
    related: relatedForIntent(query.intent, expression),
  };
}

function detectIntent(query: string): WorkspaceCasIntent {
  if (/\b(plot|graph|draw|visuali[sz]e)\b/.test(query)) return "plot";
  if (/\b(table|values)\b/.test(query)) return "table";
  if (/\b(simplify|reduce)\b/.test(query)) return "simplify";
  if (/\bfactor\b/.test(query)) return "factor";
  if (/\bexpand\b/.test(query)) return "expand";
  if (/\b(differentiate|derivative|diff|slope|tangent)\b/.test(query)) return "differentiate";
  if (/\b(integrate|integral|antiderivative)\b/.test(query)) return "integrate";
  if (/\b(solve|roots?|zeroes?|equation)\b/.test(query) || query.includes("=")) return "solve";
  if (/\b(matrix|vector|determinant|eigen|rank|span|basis)\b/.test(query)) return "matrix";
  if (/\b(triangle|circle|angle|line|construct|geometry|perimeter|area)\b/.test(query)) return "geometry";
  return "unknown";
}

function extractExpression(input: string, intent: WorkspaceCasIntent) {
  const commandPattern =
    /^(please\s+)?(plot|graph|draw|visuali[sz]e|solve|find|calculate|compute|differentiate|derivative of|diff|integrate|integral of|antiderivative of|factor|expand|simplify|table of|values of)\s+/i;
  const withoutCommand = input.replace(commandPattern, "").trim();

  if (intent === "differentiate") return withoutCommand.replace(/^of\s+/i, "");
  if (intent === "integrate") return withoutCommand.replace(/^of\s+/i, "");
  if (["plot", "solve", "simplify", "factor", "expand", "table"].includes(intent)) return withoutCommand;

  const mathLike = input.match(/[a-z0-9+\-*/^().=\s]+/i)?.[0]?.trim() ?? "";
  return mathLike.length > 1 ? mathLike : "";
}

function runSymbolicIntent(intent: WorkspaceCasIntent, expression: string) {
  if (intent === "simplify") return trySymbolic(() => symbolicSimplify(expression));
  if (intent === "factor") return trySymbolic(() => symbolicFactor(expression));
  if (intent === "expand") return trySymbolic(() => symbolicExpand(expression));
  if (intent === "differentiate") return trySymbolic(() => symbolicDerivative(expression));
  if (intent === "integrate") return trySymbolic(() => symbolicIntegral(expression));
  if (intent === "solve") return trySymbolic(() => symbolicSolve(expression.includes("=") ? expression : `${expression}=0`));
  return null;
}

function buildReason(intent: WorkspaceCasIntent, expression: string) {
  if (intent === "unknown") return "No strong workspace math intent was detected.";
  if (expression) return `Detected ${intent} intent and extracted "${expression}".`;
  return `Detected ${intent} intent.`;
}

function relatedForIntent(intent: WorkspaceCasIntent, expression: string, result?: string) {
  if (!expression) return [];
  if (intent === "solve") return [`plot ${expression.replace(/=.+$/, "")}`, `roots ${expression.replace(/=.+$/, "")}`];
  if (intent === "differentiate") return [`plot ${expression}`, result ? `plot ${result}` : `table ${expression}`];
  if (intent === "integrate") return [result ? `derivative ${result.replace(/\+C$/, "")}` : `derivative ${expression}`, `plot ${expression}`];
  if (intent === "factor") return [result ? `expand ${result}` : `expand ${expression}`, `solve ${expression}=0`];
  if (intent === "expand") return [result ? `factor ${result}` : `factor ${expression}`];
  if (intent === "simplify") return [`plot ${expression}`, `table ${expression}`];
  if (intent === "plot") return [`table ${expression}`, `derivative ${expression}`];
  if (intent === "table") return [`plot ${expression}`];
  return [];
}

