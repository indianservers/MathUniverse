export type QueryRoute = {
  label: string;
  route: string;
  reason: string;
};

const routes: Array<{ match: RegExp; route: QueryRoute }> = [
  { match: /\b(graph|plot|function|intercept|root)\b/i, route: { label: "Graphing Calculator", route: "/math-lab/graphing-calculator", reason: "The query asks for plotting or function behavior." } },
  { match: /\b(solve|equation|system|quadratic|linear)\b/i, route: { label: "Equation Solver", route: "/math-lab/equation-solver", reason: "The query asks for solving an equation or system." } },
  { match: /\b(simplify|factor|expand|differentiate|integrate|derivative|integral)\b/i, route: { label: "CAS Solver", route: "/math-lab/cas-solver", reason: "The query asks for symbolic manipulation." } },
  { match: /\b(matrix|determinant|inverse|eigen|rank)\b/i, route: { label: "Linear Algebra Lab", route: "/math-lab/linear-algebra", reason: "The query references matrix or vector algebra." } },
  { match: /\b(stat|mean|median|histogram|regression|standard deviation)\b/i, route: { label: "Statistics Lab", route: "/math-lab/statistics", reason: "The query asks about data analysis." } },
  { match: /\b(probability|dice|coin|card|distribution)\b/i, route: { label: "Probability Simulator", route: "/math-lab/probability", reason: "The query asks about random events." } },
  { match: /\b(geometry|triangle|circle|line|distance|angle)\b/i, route: { label: "Geometry Lab", route: "/math-lab/geometry", reason: "The query asks about geometric objects." } },
  { match: /\b(surface|3d|z\s*=|mesh)\b/i, route: { label: "3D Graphing Lab", route: "/math-lab/3d-graphing", reason: "The query asks about a 3D graph or surface." } },
];

export function routeQuery(query: string): QueryRoute {
  return routes.find((item) => item.match.test(query))?.route ?? {
    label: "Smart Math Query",
    route: "/math-lab/query",
    reason: "No specific tool matched yet. Ask with graph, solve, matrix, statistics, probability, or geometry keywords.",
  };
}
