export type QueryIntent =
  | "plot"
  | "solve"
  | "cas"
  | "differentiate"
  | "integrate"
  | "probability"
  | "geometry"
  | "matrix"
  | "statistics"
  | "unknown";

export type RoutedQuery = {
  intent: QueryIntent;
  route: string;
  label: string;
  reason: string;
  expression: string;
  confidence: "high" | "medium" | "low";
  operation?: "simplify" | "factor" | "expand" | "solve" | "differentiate" | "integrate" | "plot" | "simulate";
};

const routes: Record<QueryIntent, Pick<RoutedQuery, "route" | "label">> = {
  plot: { route: "/math-lab/graphing-calculator", label: "Graphing Calculator" },
  solve: { route: "/math-lab/equation-solver", label: "Equation Solver" },
  cas: { route: "/math-lab/cas-solver", label: "CAS Notebook" },
  differentiate: { route: "/math-lab/cas-solver", label: "CAS Notebook" },
  integrate: { route: "/math-lab/cas-solver", label: "CAS Notebook" },
  probability: { route: "/math-lab/probability", label: "Probability Simulator" },
  geometry: { route: "/math-lab/geometry", label: "Geometry Lab" },
  matrix: { route: "/math-lab/linear-algebra", label: "Linear Algebra Lab" },
  statistics: { route: "/probability-statistics", label: "Probability & Statistics" },
  unknown: { route: "/math-lab", label: "Math Lab" },
};

export function routeQuery(query: string): RoutedQuery {
  const normalized = query.trim().toLowerCase();
  const intent = detectIntent(normalized);
  const expression = extractExpression(query, intent);
  const route = routes[intent];
  const operation = detectOperation(normalized, intent);
  const confidence = intent === "unknown" ? "low" : expression || intent === "probability" || intent === "geometry" ? "high" : "medium";

  return {
    intent,
    route: route.route,
    label: route.label,
    expression,
    confidence,
    operation,
    reason: buildReason(intent, expression),
  };
}

function detectIntent(query: string): QueryIntent {
  if (/\b(coin|dice|card|probability|random|binomial|trial|toss|roll)\b/.test(query)) return "probability";
  if (/\b(plot|graph|draw|visuali[sz]e)\b/.test(query)) return "plot";
  if (/\b(simplify|factor|expand)\b/.test(query)) return "cas";
  if (/\b(differentiate|derivative|diff|slope|tangent)\b/.test(query)) return "differentiate";
  if (/\b(integrate|integral|area|antiderivative)\b/.test(query)) return "integrate";
  if (/\b(solve|equation|roots?|zeroes?|factor)\b/.test(query) || query.includes("=")) return "solve";
  if (/\b(matrix|vector|determinant|eigen|rank|span|basis)\b/.test(query)) return "matrix";
  if (/\b(triangle|circle|angle|line|construct|geometry|perimeter|area)\b/.test(query)) return "geometry";
  if (/\b(mean|median|standard deviation|histogram|z-score|normal distribution)\b/.test(query)) return "statistics";
  return "unknown";
}

function extractExpression(query: string, intent: QueryIntent) {
  const trimmed = query.trim();
  const commandPattern = /^(plot|graph|draw|visuali[sz]e|solve|differentiate|derivative of|diff|integrate|integral of|factor|expand|simplify)\s+/i;
  const withoutCommand = trimmed.replace(commandPattern, "").trim();
  if (["plot", "solve", "cas", "differentiate", "integrate"].includes(intent) && withoutCommand) return withoutCommand;
  const mathLike = trimmed.match(/[a-z0-9+\-*/^().=\s]+/i)?.[0]?.trim() ?? "";
  return mathLike.length >= 2 ? mathLike : "";
}

function buildReason(intent: QueryIntent, expression: string) {
  if (intent === "unknown") return "No strong math intent was detected, so the Math Lab hub is the safest starting point.";
  const target = routes[intent].label;
  if (expression) return `Detected a ${intent} request and extracted "${expression}" for ${target}.`;
  return `Detected keywords that match ${target}.`;
}

function detectOperation(query: string, intent: QueryIntent): RoutedQuery["operation"] {
  if (intent === "plot") return "plot";
  if (intent === "probability") return "simulate";
  if (intent === "solve") return "solve";
  if (intent === "differentiate") return "differentiate";
  if (intent === "integrate") return "integrate";
  if (/\bfactor\b/.test(query)) return "factor";
  if (/\bexpand\b/.test(query)) return "expand";
  if (/\bsimplify\b/.test(query)) return "simplify";
  return undefined;
}
