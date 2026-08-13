export type QueryIntent =
  | "plot" | "solve" | "cas" | "differentiate" | "integrate" | "probability" | "statistics"
  | "geometry" | "matrix" | "trigonometry" | "conics" | "threeD" | "complex" | "units"
  | "sequences" | "logic" | "sets" | "graphTheory" | "combinatorics" | "engineering" | "unknown";

export type RoutedQuery = {
  intent: QueryIntent;
  route: string;
  label: string;
  reason: string;
  expression: string;
  originalQuery: string;
  confidence: "high" | "medium" | "low";
  operation?: "simplify" | "factor" | "expand" | "solve" | "differentiate" | "integrate" | "plot" | "simulate";
};

const routes: Record<QueryIntent, Pick<RoutedQuery, "route" | "label">> = {
  plot: { route: "/workspace/graph", label: "2D Graph Workspace" },
  solve: { route: "/problem-solver", label: "Step-by-Step Solver" },
  cas: { route: "/problem-solver", label: "Step-by-Step Solver" },
  differentiate: { route: "/problem-solver", label: "Step-by-Step Solver" },
  integrate: { route: "/problem-solver", label: "Step-by-Step Solver" },
  probability: { route: "/math-lab/probability", label: "Probability Simulator" },
  statistics: { route: "/probability-statistics", label: "Probability & Statistics" },
  geometry: { route: "/workspace/geometry", label: "Geometry Workspace" },
  matrix: { route: "/matrices", label: "Matrix Lab" },
  trigonometry: { route: "/trigonometry", label: "Trigonometry Lab" },
  conics: { route: "/math-lab/conics", label: "Conic Visualizer" },
  threeD: { route: "/workspace/3d", label: "3D Graph Workspace" },
  complex: { route: "/complex-numbers", label: "Complex Plane" },
  units: { route: "/unit-converter", label: "Unit Converter" },
  sequences: { route: "/syllabus-lab/series-partial-sum", label: "Sequences & Series Lab" },
  logic: { route: "/mathematical-logic", label: "Mathematical Logic Lab" },
  sets: { route: "/set-theory", label: "Set Theory Lab" },
  graphTheory: { route: "/graph-theory", label: "Graph Theory Lab" },
  combinatorics: { route: "/combinatorics", label: "Combinatorics Lab" },
  engineering: { route: "/engineering-math", label: "Engineering Mathematics" },
  unknown: { route: "/math-lab", label: "Math Lab" },
};

export function routeQuery(query: string): RoutedQuery {
  const originalQuery = query.trim();
  const normalized = originalQuery.toLowerCase();
  const intent = detectIntent(normalized);
  const expression = extractExpression(originalQuery, intent);
  const target = routes[intent];
  const operation = detectOperation(normalized, intent);
  const confidence = intent === "unknown" ? "low" : expression || !["plot", "solve", "cas", "differentiate", "integrate"].includes(intent) ? "high" : "medium";

  return { intent, route: target.route, label: target.label, expression, originalQuery, confidence, operation, reason: buildReason(intent, expression) };
}

function detectIntent(query: string): QueryIntent {
  if (/\b(coin|dice|card|probability|random|binomial|trial|toss|roll|monte carlo)\b/.test(query)) return "probability";
  if (/\b(mean|median|mode|standard deviation|variance|histogram|z-score|normal distribution|confidence interval|hypothesis test)\b/.test(query)) return "statistics";
  if (/\b(3d|surface|mesh|z\s*=\s*f\s*\(|height map)\b/.test(query)) return "threeD";
  if (/\b(trigonometry|sine|cosine|tangent ratio|unit circle|trig identity)\b/.test(query)) return "trigonometry";
  if (/\b(parabola|ellipse|hyperbola|conic|focus|directrix)\b/.test(query)) return "conics";
  if (/\b(complex|imaginary|argand|roots of unity|polar form)\b/.test(query)) return "complex";
  if (/\b(convert|conversion|units?|kilomet|centimet|fahrenheit|celsius)\b/.test(query)) return "units";
  if (/\b(sequence|series|partial sum|convergence|arithmetic progression|geometric progression)\b/.test(query)) return "sequences";
  if (/\b(truth table|predicate|cnf|dnf|logical|logic gate)\b/.test(query)) return "logic";
  if (/\b(venn|set theory|union|intersection|subset|hasse|relation)\b/.test(query)) return "sets";
  if (/\b(graph theory|dijkstra|bfs|dfs|spanning tree|vertex|vertices|edge coloring)\b/.test(query)) return "graphTheory";
  if (/\b(permutation|combination|counting|pascal|inclusion.exclusion)\b/.test(query)) return "combinatorics";
  if (/\b(fourier|laplace|pde|bode|engineering math|numerical method)\b/.test(query)) return "engineering";
  if (/\b(matrix|determinant|eigen|rank|row reduc|linear algebra|vector|span|basis)\b/.test(query)) return "matrix";
  if (/\b(triangle|circle|angle|line|construct|geometry|perimeter|polygon|surface area|volume|area of)\b/.test(query)) return "geometry";
  if (/\b(plot|graph|draw|visuali[sz]e)\b/.test(query)) return "plot";
  if (/\b(simplify|factor|expand)\b/.test(query)) return "cas";
  if (/\b(differentiate|derivative|diff|slope|tangent line)\b/.test(query)) return "differentiate";
  if (/\b(integrate|integral|area under (the )?curve|riemann|antiderivative)\b/.test(query)) return "integrate";
  if (/\b(solve|equation|roots?|zeroes?)\b/.test(query) || query.includes("=")) return "solve";
  return "unknown";
}

function extractExpression(query: string, intent: QueryIntent) {
  const commandPattern = /^(plot|graph|draw|visuali[sz]e|solve|differentiate|derivative of|diff|integrate|integral of|factor|expand|simplify)\s+/i;
  const withoutCommand = query.replace(commandPattern, "").trim();
  if (["plot", "solve", "cas", "differentiate", "integrate"].includes(intent) && withoutCommand) return withoutCommand;
  const mathLike = query.match(/[a-z0-9+\-*/^().=,[\]\s]+/i)?.[0]?.trim() ?? "";
  return mathLike.length >= 2 ? mathLike : "";
}

function buildReason(intent: QueryIntent, expression: string) {
  if (intent === "unknown") return "No strong math intent was detected, so the complete Math Lab directory is the safest starting point.";
  const target = routes[intent].label;
  return expression ? `Detected a ${intent} request and extracted "${expression}" for ${target}.` : `Detected keywords that match ${target}.`;
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
