import { engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringSimulationScenario = {
  id: string;
  domainId: string;
  title: string;
  model: string;
  metricLabel: string;
  metricValue: number;
  metricUnit: string;
  route: string;
  variables: string[];
  exportArtifacts: string[];
  samples: number[];
};

const scenarioSeeds = [
  scenario("engineering-calculus", "surface-sensitivity-sweep", "Surface sensitivity sweep", "z=a*x^2+b*y^2 with moving cross-section", "peak slope", 3.42, "units/m", "/workspace/3d?v_surface_scale=1&v_cross_section_z=0", ["surface scale", "cross-section", "gradient"], ["surface snapshot", "slope table", "design note"], [0.18, 0.34, 0.62, 0.78, 0.66, 0.49, 0.72, 0.91]),
  scenario("engineering-differential-equations", "damped-response-sweep", "Damped response sweep", "m*x''+c*x'+kx=F(t)", "settling time", 4.18, "s", "/syllabus-lab/higher-order-ode-characteristic-lab", ["damping ratio", "forcing", "initial displacement"], ["response curve", "root table", "classification"], [0.94, 0.62, 0.31, 0.48, 0.22, 0.15, 0.09, 0.05]),
  scenario("engineering-linear-algebra", "eigen-stability-sweep", "Eigen stability sweep", "x_(k+1)=A*x_k", "spectral radius", 0.82, "", "/linear-algebra", ["trace", "determinant", "basis vector"], ["matrix snapshot", "eigen table", "stability verdict"], [0.28, 0.46, 0.68, 0.82, 0.64, 0.52, 0.41, 0.33]),
  scenario("transforms-signals", "harmonic-filter-sweep", "Harmonic filter sweep", "input spectrum through transfer response", "dominant harmonic", 5, "n", "/syllabus-lab/fourier-transform-spectrum-lab", ["harmonics", "cutoff", "phase"], ["spectrum bars", "filtered signal", "frequency note"], [0.24, 0.74, 0.92, 0.58, 0.31, 0.18, 0.1, 0.06]),
  scenario("partial-differential-equations", "heat-grid-sweep", "Heat grid sweep", "explicit heat update with boundary controls", "stability ratio", 0.38, "r", "/syllabus-lab/heat-equation-color-map", ["mesh size", "time step", "boundary temperature"], ["heat map", "centerline table", "stability note"], [0.98, 0.78, 0.59, 0.45, 0.34, 0.27, 0.21, 0.17]),
  scenario("numerical-methods", "iteration-error-sweep", "Iteration error sweep", "root and quadrature methods compared by residual", "final residual", 0.00042, "", "/syllabus-lab/newton-raphson-tangent-iteration", ["method", "tolerance", "step count"], ["iteration log", "error plot", "method comparison"], [0.92, 0.44, 0.18, 0.07, 0.023, 0.008, 0.002, 0.0004]),
  scenario("probability-statistics-stochastic", "queue-risk-sweep", "Queue risk sweep", "M/M/1 utilization and waiting risk", "utilization", 0.67, "rho", "/syllabus-lab/reliability-markov-queueing-lab", ["arrival rate", "service rate", "state probability"], ["rate table", "risk chart", "staffing note"], [0.22, 0.31, 0.48, 0.63, 0.7, 0.66, 0.59, 0.54]),
  scenario("optimization-operations-research", "resource-frontier-sweep", "Resource frontier sweep", "LP objective over feasible corner points", "best objective", 2280, "Z", "/syllabus-lab/operations-research-lp", ["constraint A", "constraint B", "objective vector"], ["corner table", "feasible region", "decision memo"], [0.15, 0.28, 0.5, 0.76, 0.95, 0.84, 0.67, 0.4]),
  scenario("vector-calculus-fields", "field-flux-sweep", "Field flux sweep", "linear vector field over a circular region", "flux", 20.11, "", "/syllabus-lab/vector-calculus-field-theorems", ["divergence", "curl", "radius"], ["field arrows", "operator table", "theorem choice"], [0.35, 0.48, 0.62, 0.8, 0.73, 0.59, 0.66, 0.88]),
  scenario("complex-special-control", "pole-response-sweep", "Pole response sweep", "second-order transfer function response", "overshoot", 23.3, "%", "/syllabus-lab/control-system-response-lab", ["damping", "natural frequency", "pole location"], ["pole-zero sketch", "response curve", "stability verdict"], [0.08, 0.44, 0.82, 0.66, 0.38, 0.19, 0.11, 0.07]),
];

export const engineeringSimulationScenarios = scenarioSeeds;

export function simulationsForDomain(domainId: string) {
  return engineeringSimulationScenarios.filter((item) => item.domainId === domainId);
}

export function simulationCoverageSummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  const coveredDomainIds = new Set(engineeringSimulationScenarios.map((item) => item.domainId));
  return {
    scenarioCount: engineeringSimulationScenarios.length,
    domainCount: domainIds.size,
    coveredDomainCount: Array.from(domainIds).filter((domainId) => coveredDomainIds.has(domainId)).length,
    exportArtifactCount: new Set(engineeringSimulationScenarios.flatMap((item) => item.exportArtifacts)).size,
  };
}

export function adjustedSimulationSamples(samples: number[], controls: { shape: number; forcing: number; time: number }) {
  return samples.map((sample, index) => {
    const wave = Math.sin(index * controls.shape + controls.time * Math.PI * 2) * 0.08;
    const adjusted = sample * (0.78 + controls.forcing * 0.14) + wave;
    return Math.max(0, Math.min(1, Math.round(adjusted * 1000) / 1000));
  });
}

function scenario(
  domainId: string,
  id: string,
  title: string,
  model: string,
  metricLabel: string,
  metricValue: number,
  metricUnit: string,
  route: string,
  variables: string[],
  exportArtifacts: string[],
  samples: number[],
): EngineeringSimulationScenario {
  return { id, domainId, title, model, metricLabel, metricValue, metricUnit, route, variables, exportArtifacts, samples };
}
