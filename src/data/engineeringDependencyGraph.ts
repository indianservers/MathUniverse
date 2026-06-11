import { engineeringDomainById, engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringDependencyEdge = {
  from: string;
  to: string;
  reason: string;
};

export type EngineeringLearningPath = {
  id: string;
  title: string;
  domainIds: string[];
  outcome: string;
};

export const engineeringDependencyEdges: EngineeringDependencyEdge[] = [
  edge("engineering-calculus", "engineering-differential-equations", "ODE models depend on derivatives, integrals, and local rate interpretation."),
  edge("engineering-calculus", "vector-calculus-fields", "Vector operators extend partial derivatives into fields."),
  edge("engineering-calculus", "partial-differential-equations", "PDEs need multivariable derivatives and integration over regions."),
  edge("engineering-calculus", "optimization-operations-research", "Optimization uses gradients, constrained extrema, and variational reasoning."),
  edge("engineering-linear-algebra", "partial-differential-equations", "Separation, finite differences, and eigen modes rely on matrix structure."),
  edge("engineering-linear-algebra", "numerical-methods", "Iterative solvers, interpolation systems, and error models use matrices."),
  edge("engineering-linear-algebra", "optimization-operations-research", "Linear programming, simplex, and least-squares models are matrix workflows."),
  edge("engineering-differential-equations", "transforms-signals", "Laplace and Fourier workflows solve and interpret differential systems."),
  edge("engineering-differential-equations", "partial-differential-equations", "PDE separation reduces boundary problems to ODE families."),
  edge("transforms-signals", "partial-differential-equations", "Fourier methods solve heat, wave, and Laplace boundary-value problems."),
  edge("transforms-signals", "complex-special-control", "Control response, poles, and residues build on transform-domain thinking."),
  edge("vector-calculus-fields", "partial-differential-equations", "Field operators and Laplacians connect to PDE models."),
  edge("probability-statistics-stochastic", "optimization-operations-research", "Operations decisions use uncertainty, queues, and reliability models."),
  edge("numerical-methods", "partial-differential-equations", "Finite-difference and stability workflows are numerical PDE methods."),
  edge("numerical-methods", "probability-statistics-stochastic", "Simulation and estimation rely on deterministic numerical procedures."),
];

export const engineeringLearningPaths: EngineeringLearningPath[] = [
  {
    id: "m1-foundation-path",
    title: "M1 Foundation Path",
    domainIds: ["engineering-calculus", "engineering-linear-algebra", "engineering-differential-equations"],
    outcome: "Build the core calculus, matrix, and ODE language used by every later engineering unit.",
  },
  {
    id: "signals-control-path",
    title: "Signals and Control Path",
    domainIds: ["engineering-differential-equations", "transforms-signals", "complex-special-control"],
    outcome: "Move from physical differential equations to transform-domain response and pole behavior.",
  },
  {
    id: "simulation-path",
    title: "Simulation Path",
    domainIds: ["engineering-linear-algebra", "numerical-methods", "partial-differential-equations"],
    outcome: "Turn equations into stable, testable numerical models and grid simulations.",
  },
  {
    id: "decision-systems-path",
    title: "Decision Systems Path",
    domainIds: ["probability-statistics-stochastic", "engineering-linear-algebra", "optimization-operations-research"],
    outcome: "Connect data uncertainty, matrix models, and resource optimization.",
  },
  {
    id: "field-theory-path",
    title: "Field Theory Path",
    domainIds: ["engineering-calculus", "vector-calculus-fields", "partial-differential-equations"],
    outcome: "Study gradients, flux, circulation, and boundary-value fields as one continuous chain.",
  },
];

export function dependenciesForDomain(domainId: string) {
  return engineeringDependencyEdges.filter((edgeItem) => edgeItem.to === domainId).map(enrichEdge);
}

export function unlocksForDomain(domainId: string) {
  return engineeringDependencyEdges.filter((edgeItem) => edgeItem.from === domainId).map(enrichEdge);
}

export function learningPathsForDomain(domainId: string) {
  return engineeringLearningPaths.filter((path) => path.domainIds.includes(domainId));
}

export function dependencyGraphSummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  const connectedDomainIds = new Set(engineeringDependencyEdges.flatMap((edgeItem) => [edgeItem.from, edgeItem.to]));
  return {
    domainCount: domainIds.size,
    edgeCount: engineeringDependencyEdges.length,
    connectedDomainCount: Array.from(domainIds).filter((domainId) => connectedDomainIds.has(domainId)).length,
    pathCount: engineeringLearningPaths.length,
    longestPathLength: Math.max(...engineeringLearningPaths.map((path) => path.domainIds.length)),
  };
}

function enrichEdge(edgeItem: EngineeringDependencyEdge) {
  return {
    ...edgeItem,
    fromTitle: engineeringDomainById(edgeItem.from)?.title ?? edgeItem.from,
    toTitle: engineeringDomainById(edgeItem.to)?.title ?? edgeItem.to,
  };
}

function edge(from: string, to: string, reason: string): EngineeringDependencyEdge {
  return { from, to, reason };
}
