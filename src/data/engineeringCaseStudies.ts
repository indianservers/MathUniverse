import { engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringCaseStudy = {
  id: string;
  domainId: string;
  title: string;
  industry: string;
  scenario: string;
  mathFocus: string[];
  labRoutes: string[];
  formulaQueries: string[];
  portfolioEvidence: string[];
  successCriteria: string[];
  estimatedMinutes: number;
};

export const engineeringCaseStudies: EngineeringCaseStudy[] = [
  study("engineering-calculus", "heat-sink-surface-sensitivity", "Heat-sink surface sensitivity", "Thermal design", "A cooling fin profile must be tuned without exceeding material volume, so learners compare surface slope, cross-sections, and local sensitivity.", ["partial derivatives", "surface plots", "constrained optimization"], ["/syllabus-lab/partial-derivative-slicer", "/syllabus-lab/double-integral-region"], ["partial derivative", "double integral", "Jacobian"], ["surface screenshot", "sensitivity note", "volume constraint"], ["Explains why one variable is held fixed", "connects slope to heat-transfer area", "states the engineering tradeoff"], 55),
  study("engineering-calculus", "robot-arm-jacobian-check", "Robot arm Jacobian check", "Robotics", "A two-joint arm needs a quick workspace conversion from joint motion to endpoint motion before path planning.", ["Jacobian", "coordinate transforms", "local linearization"], ["/syllabus-lab/jacobian-area-scaling-lab", "/syllabus-lab/matrix-transformation-grid"], ["Jacobian", "Taylor expansion", "determinant"], ["joint-variable table", "Jacobian matrix", "singularity warning"], ["Identifies input and output coordinates", "checks determinant behavior", "reports a path-planning risk"], 50),

  study("engineering-differential-equations", "rc-filter-startup-response", "RC filter startup response", "Electronics", "A sensor circuit must be ready within a time limit after power-on, so learners estimate transient response and steady state.", ["first-order ODE", "time constant", "initial values"], ["/syllabus-lab/slope-field-generator", "/syllabus-lab/laplace-transform-workflow"], ["linear first-order ODE", "Laplace derivative rule"], ["ODE setup", "response curve", "settling-time note"], ["Uses the initial condition", "finds steady state", "compares visual and analytic response"], 45),
  study("engineering-differential-equations", "vehicle-suspension-damping", "Vehicle suspension damping", "Mechanical systems", "A suspension model needs damping classification so overshoot and return time can be explained from equation roots.", ["second-order ODE", "auxiliary equation", "damping cases"], ["/syllabus-lab/higher-order-ode-characteristic-lab", "/syllabus-lab/spring-mass-ode-simulation"], ["auxiliary equation", "Cauchy-Euler trial"], ["root table", "damping classification", "motion sketch"], ["Classifies roots correctly", "connects roots to motion", "states a comfort or safety implication"], 60),

  study("engineering-linear-algebra", "camera-transform-pipeline", "Camera transform pipeline", "Computer graphics", "A 3D point cloud must be transformed through rotation, scale, and projection while preserving the meaning of basis vectors.", ["matrix multiplication", "eigen directions", "basis transforms"], ["/syllabus-lab/matrix-transformation-grid", "/syllabus-lab/eigenvector-direction-visualizer"], ["eigen equation", "normal equations"], ["transform matrix", "before-after vector view", "basis explanation"], ["Labels each transformation stage", "checks matrix dimensions", "explains preserved directions"], 55),
  study("engineering-linear-algebra", "sensor-calibration-least-squares", "Sensor calibration least-squares", "Instrumentation", "Noisy calibration readings produce an overdetermined system, so learners fit coefficients and interpret residual error.", ["least squares", "rank", "projection"], ["/syllabus-lab/rank-consistency-row-reduction", "/syllabus-lab/gram-schmidt-orthogonalization"], ["normal equations", "rank-nullity theorem"], ["data table", "normal equation setup", "residual note"], ["Explains why exact solution is unlikely", "checks rank", "interprets residual size"], 50),

  study("transforms-signals", "motor-drive-frequency-signature", "Motor-drive frequency signature", "Signal processing", "A motor current trace contains harmonics, and learners identify dominant components before diagnosing vibration risk.", ["Fourier series", "spectrum", "harmonic approximation"], ["/syllabus-lab/fourier-transform-spectrum-lab", "/syllabus-lab/z-transform-difference-equations"], ["Fourier series", "convolution theorem"], ["signal sketch", "harmonic table", "diagnostic note"], ["Connects peaks to harmonics", "mentions approximation error", "states an engineering interpretation"], 50),
  study("transforms-signals", "control-input-convolution", "Control input convolution", "Control systems", "A system response must be predicted from a known impulse response and a shaped input command.", ["convolution", "Laplace transform", "impulse response"], ["/syllabus-lab/laplace-transform-workflow", "/syllabus-lab/convolution-integral-lab"], ["convolution theorem", "transfer function"], ["input response setup", "transform-domain product", "time-response note"], ["Defines input and impulse response", "uses transform pairing", "checks initial behavior"], 55),

  study("partial-differential-equations", "battery-plate-heat-diffusion", "Battery plate heat diffusion", "Energy systems", "A battery plate experiences uneven heating, and learners classify the heat model and inspect stable diffusion behavior.", ["heat equation", "boundary conditions", "finite differences"], ["/syllabus-lab/heat-equation-color-map", "/syllabus-lab/pde-classification-characteristics-lab"], ["heat equation", "PDE classification"], ["boundary sketch", "stability ratio", "temperature map"], ["States boundary conditions", "checks the update ratio", "links color change to diffusion"], 60),
  study("partial-differential-equations", "membrane-wave-response", "Membrane wave response", "Acoustics", "A vibrating membrane model must distinguish wave behavior from steady or diffusive behavior before choosing a solver.", ["wave equation", "PDE type", "separation of variables"], ["/syllabus-lab/pde-classification-characteristics-lab", "/syllabus-lab/fourier-transform-spectrum-lab"], ["wave equation", "Laplace equation"], ["type classification", "mode sketch", "solver choice"], ["Uses the discriminant correctly", "explains wave behavior", "states the needed boundary data"], 55),

  study("numerical-methods", "pump-efficiency-root-find", "Pump efficiency root find", "Fluid systems", "A pump performance equation must be solved for an operating point where analytic solving is inconvenient.", ["Newton-Raphson", "bracketing", "error analysis"], ["/syllabus-lab/newton-raphson-tangent-iteration", "/syllabus-lab/error-convergence-graph"], ["Newton-Raphson method", "bisection method"], ["iteration log", "residual check", "method comparison"], ["Uses stopping tolerance", "tracks convergence", "mentions failure conditions"], 45),
  study("numerical-methods", "tabulated-load-integration", "Tabulated load integration", "Structural analysis", "Measured load data must be integrated to estimate total force or work from sampled points.", ["Simpson rule", "quadrature", "tabular data"], ["/syllabus-lab/gaussian-quadrature-lab", "/syllabus-lab/numerical-integration-area-comparison"], ["Simpson rule", "trapezoidal rule"], ["data table", "quadrature estimate", "error comment"], ["Uses consistent spacing or explains correction", "compares methods", "states units of accumulated quantity"], 50),

  study("probability-statistics-stochastic", "manufacturing-defect-risk", "Manufacturing defect risk", "Quality control", "A production line needs a defect probability estimate and a decision rule for inspection sampling.", ["binomial model", "expectation", "variance"], ["/syllabus-lab/probability-distribution-expectation-lab", "/syllabus-lab/statistical-inference-regression-lab"], ["expectation", "variance"], ["assumption list", "probability calculation", "inspection recommendation"], ["Chooses a distribution from assumptions", "reports parameter meaning", "connects result to inspection action"], 45),
  study("probability-statistics-stochastic", "service-desk-queue-risk", "Service desk queue risk", "Operations", "Arrival and service rates must be checked before using a queueing estimate for staffing decisions.", ["queue utilization", "Markov update", "stability"], ["/syllabus-lab/reliability-markov-queueing-lab", "/syllabus-lab/probability-distribution-expectation-lab"], ["queue utilization", "Markov update"], ["rate table", "stability check", "staffing note"], ["Checks rho before waiting formulas", "states assumptions", "translates probability into capacity action"], 60),

  study("optimization-operations-research", "warehouse-shift-lp", "Warehouse shift LP", "Supply chain", "A warehouse manager allocates labor across shifts while meeting demand and minimizing overtime cost.", ["linear programming", "constraints", "duality"], ["/syllabus-lab/operations-research-lp", "/syllabus-lab/optimization-gradient-constraints-lab"], ["linear programming objective", "duality relation"], ["decision variables", "constraint table", "optimal shift plan"], ["Defines variables clearly", "keeps constraints linear", "interprets the optimum operationally"], 55),
  study("optimization-operations-research", "construction-critical-path", "Construction critical path", "Project management", "A construction plan has dependent activities, and learners identify the path that controls the completion date.", ["PERT", "critical path", "slack"], ["/syllabus-lab/network-pert-game-theory-lab", "/syllabus-lab/graph-theory-basics"], ["PERT expected time", "duality relation"], ["activity network", "critical path", "slack summary"], ["Computes expected times", "finds controlling activities", "uses slack to prioritize management"], 65),

  study("vector-calculus-fields", "airflow-divergence-curl-audit", "Airflow divergence-curl audit", "Fluid mechanics", "A velocity field around a vent must be inspected for source behavior and local rotation.", ["divergence", "curl", "field visualization"], ["/syllabus-lab/vector-calculus-field-theorems", "/syllabus-lab/partial-derivative-slicer"], ["divergence", "curl", "Stokes theorem"], ["field definition", "divergence-curl table", "flow interpretation"], ["Distinguishes source and rotation behavior", "states units or physical meaning", "connects local values to the visual field"], 55),
  study("vector-calculus-fields", "electromagnetic-flux-loop", "Electromagnetic flux loop", "Electromagnetics", "A loop boundary and surface must be oriented before applying a field theorem to compare circulation and flux.", ["Stokes theorem", "surface orientation", "line integrals"], ["/syllabus-lab/vector-calculus-field-theorems", "/syllabus-lab/complex-line-integral-lab"], ["Stokes theorem", "line integrals"], ["oriented boundary", "surface normal note", "theorem equation"], ["Uses compatible orientation", "sets up the boundary integral", "states the physical quantity measured"], 60),

  study("complex-special-control", "antenna-contour-residue", "Antenna contour residue", "Communications", "A complex response integral has poles, and learners compute a contour result from enclosed singularities.", ["residue theorem", "poles", "complex contours"], ["/syllabus-lab/complex-line-integral-lab", "/syllabus-lab/residue-pole-animation"], ["residue theorem", "Cauchy integral formula"], ["pole map", "residue table", "integral value"], ["Separates enclosed poles", "computes residues consistently", "uses the contour orientation"], 55),
  study("complex-special-control", "closed-loop-pole-diagnosis", "Closed-loop pole diagnosis", "Control systems", "A controller response is judged from pole locations, damping, and dominant transient behavior.", ["transfer function", "poles and zeros", "stability"], ["/syllabus-lab/control-system-response-lab", "/syllabus-lab/laplace-transform-workflow"], ["transfer function", "Laplace derivative rule"], ["pole-zero sketch", "stability verdict", "transient response note"], ["Identifies stable pole regions", "connects pole position to transient response", "states a control design action"], 65),
];

export function caseStudiesForDomain(domainId: string) {
  return engineeringCaseStudies.filter((studyItem) => studyItem.domainId === domainId);
}

export function caseStudySummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  const coveredDomainIds = new Set(engineeringCaseStudies.map((studyItem) => studyItem.domainId));
  return {
    caseStudyCount: engineeringCaseStudies.length,
    domainCount: domainIds.size,
    coveredDomainCount: Array.from(domainIds).filter((domainId) => coveredDomainIds.has(domainId)).length,
    industryCount: new Set(engineeringCaseStudies.map((studyItem) => studyItem.industry)).size,
    routeCount: new Set(engineeringCaseStudies.flatMap((studyItem) => studyItem.labRoutes)).size,
    evidenceCount: engineeringCaseStudies.reduce((sum, studyItem) => sum + studyItem.portfolioEvidence.length, 0),
    totalMinutes: engineeringCaseStudies.reduce((sum, studyItem) => sum + studyItem.estimatedMinutes, 0),
  };
}

function study(
  domainId: string,
  id: string,
  title: string,
  industry: string,
  scenario: string,
  mathFocus: string[],
  labRoutes: string[],
  formulaQueries: string[],
  portfolioEvidence: string[],
  successCriteria: string[],
  estimatedMinutes: number,
): EngineeringCaseStudy {
  return {
    id,
    domainId,
    title,
    industry,
    scenario,
    mathFocus,
    labRoutes,
    formulaQueries,
    portfolioEvidence,
    successCriteria,
    estimatedMinutes,
  };
}
