import { engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringLauncherKind = "concept-lab" | "workspace" | "formula-map" | "practice";

export type EngineeringLabLauncher = {
  id: string;
  domainId: string;
  title: string;
  kind: EngineeringLauncherKind;
  route: string;
  preset: string;
  outcome: string;
  formulas: string[];
};

const launchers: EngineeringLabLauncher[] = [
  launcher("engineering-calculus", "partial-slicer", "Partial Derivative Slicer", "concept-lab", "/syllabus-lab/partial-derivative-slicer", "z=f(x,y), contour slices, gradient direction", "Connect partial derivative signs to local surface change.", ["f_x", "f_y", "grad f"]),
  launcher("engineering-calculus", "double-integrals", "Multiple Integral Regions", "concept-lab", "/syllabus-lab/double-integral-region", "double and triple integral region controls", "Read area/volume from bounded regions before calculating.", ["dA", "dV", "Jacobian"]),
  launcher("engineering-calculus", "surface-workspace", "Surface Sensitivity Lab", "concept-lab", "/syllabus-lab/partial-derivative-slicer", "surface scale, cross-section, 2D/3D panes", "Inspect engineering surfaces with live derivative slices.", ["z=f(x,y)", "level curves"]),
  launcher("engineering-calculus", "formula-map", "Calculus Formula Map", "formula-map", "/formulas?q=jacobian%20partial%20integral", "partial derivatives, Jacobian, multiple integrals", "Jump into the formula atlas with the correct engineering search.", ["Jacobian", "Beta", "Gamma"]),

  launcher("engineering-differential-equations", "slope-fields", "Slope Field Lab", "concept-lab", "/syllabus-lab/slope-field-generator", "first-order ODE direction field", "Compare local slopes, IVPs, and solution curves.", ["dy/dx=f(x,y)", "y(x0)=y0"]),
  launcher("engineering-differential-equations", "higher-order", "Higher-Order ODE Lab", "concept-lab", "/syllabus-lab/higher-order-ode-characteristic-lab", "auxiliary equation and root cases", "Classify complementary functions from characteristic roots.", ["ay''+by'+cy=0", "m^2+pm+q=0"]),
  launcher("engineering-differential-equations", "cauchy-euler", "Cauchy-Euler Workflow", "concept-lab", "/syllabus-lab/cauchy-euler-ode-lab", "power-law trial solutions", "See why x^m substitutions linearize the pattern.", ["x^2y''+axy'+by=0"]),
  launcher("engineering-differential-equations", "cas-ode", "Solution Curve Lab", "concept-lab", "/syllabus-lab/solution-curve-animation", "symbolic solve plus verification", "Use solution curves beside visual ODE intuition.", ["solve", "differentiate"]),

  launcher("engineering-linear-algebra", "rank-consistency", "Rank and Consistency Lab", "concept-lab", "/syllabus-lab/rank-consistency-row-reduction", "RREF, pivots, augmented matrix", "Classify systems using rank(A) and rank([A|b]).", ["rank(A)", "rank([A|b])"]),
  launcher("engineering-linear-algebra", "matrix-sandbox", "Gaussian Elimination Lab", "concept-lab", "/syllabus-lab/gaussian-elimination-steps", "row operations and matrix experiments", "Test matrix workflows through visible elimination steps.", ["Ax=b", "RREF"]),
  launcher("engineering-linear-algebra", "linear-algebra-3d", "Vector and Eigen Lab", "concept-lab", "/syllabus-lab/eigenvector-direction-visualizer", "3D vector pane, projections, eigenvectors", "Connect matrices to geometry, span, basis, and projections.", ["A v=lambda v", "proj_u v"]),
  launcher("engineering-linear-algebra", "gram-schmidt", "Gram-Schmidt Lab", "concept-lab", "/syllabus-lab/gram-schmidt-orthogonalization", "orthogonal basis and least squares", "Build QR intuition from projection subtraction.", ["proj_u v", "A^T A x=A^T b"]),

  launcher("transforms-signals", "laplace", "Laplace Transform Workflow", "concept-lab", "/syllabus-lab/laplace-transform-workflow", "time-domain to s-domain IVP", "Solve engineering IVPs with transform-domain algebra.", ["L{f(t)}", "sY-y(0)"]),
  launcher("transforms-signals", "fourier-spectrum", "Fourier Spectrum Lab", "concept-lab", "/syllabus-lab/fourier-transform-spectrum-lab", "periodic synthesis and spectrum", "Link signals, coefficients, and frequency peaks.", ["a_n", "b_n", "F(omega)"]),
  launcher("transforms-signals", "z-transform", "Z-Transform Lab", "concept-lab", "/syllabus-lab/z-transform-difference-equations", "unit circle, pole radius, recurrence", "Classify discrete-time stability from pole location.", ["Z{x_n}", "X(z)"]),
  launcher("transforms-signals", "fourier-animator", "Fourier Animator", "concept-lab", "/syllabus-lab/fourier-transform-spectrum-lab", "harmonic animation", "Show signal reconstruction before formal transform work.", ["harmonics", "series"]),

  launcher("partial-differential-equations", "heat", "Heat Equation Color Map", "concept-lab", "/syllabus-lab/heat-equation-color-map", "diffusion, time, boundary profile", "Watch smoothing and stability in parabolic PDEs.", ["u_t=alpha u_xx"]),
  launcher("partial-differential-equations", "classification", "PDE Classification", "concept-lab", "/syllabus-lab/pde-classification-characteristics-lab", "elliptic/parabolic/hyperbolic discriminant", "Classify PDE type before selecting a method.", ["B^2-4AC"]),
  launcher("partial-differential-equations", "finite-difference", "Finite Difference PDE Grid", "concept-lab", "/syllabus-lab/finite-difference-method-lab", "mesh size, stability, grid updates", "Connect derivatives to grid stencils.", ["u_xx approx stencil"]),
  launcher("partial-differential-equations", "surface-plotter", "Laplace Potential Surface", "concept-lab", "/syllabus-lab/laplace-equation-potential-surface", "surface and level behavior", "Inspect PDE solution surfaces and boundary shapes.", ["u(x,y)", "nabla^2u"]),

  launcher("numerical-methods", "root-finding", "Newton-Raphson Iteration", "concept-lab", "/syllabus-lab/newton-raphson-tangent-iteration", "root, tangent, iteration table", "Compare convergence speed and failure cases.", ["x_(n+1)=x_n-f/f'"]),
  launcher("numerical-methods", "linear-iteration", "Numerical Linear Algebra", "concept-lab", "/syllabus-lab/numerical-linear-algebra-iteration-lab", "Jacobi, Gauss-Seidel, relaxation", "Study iterative solvers with error readouts.", ["x^(k+1)=Bx^(k)+c"]),
  launcher("numerical-methods", "quadrature", "Gaussian Quadrature Lab", "concept-lab", "/syllabus-lab/gaussian-quadrature-lab", "nodes, weights, curve bending", "Compare quadrature nodes to equal spacing.", ["integral f dx approx sum w_i f(x_i)"]),
  launcher("numerical-methods", "data-workspace", "Interpolation Data Lab", "concept-lab", "/syllabus-lab/interpolation-curve-builder", "tables, regression, export", "Keep iteration tables and datasets connected to a live curve.", ["error", "iteration"]),

  launcher("probability-statistics-stochastic", "probability", "Probability Simulator", "concept-lab", "/syllabus-lab/probability-distribution-expectation-lab", "seeded simulations and distributions", "Connect theory with empirical engineering trials.", ["P(A)", "E[X]", "Var(X)"]),
  launcher("probability-statistics-stochastic", "reliability", "Reliability and Queueing Lab", "concept-lab", "/syllabus-lab/reliability-markov-queueing-lab", "Markov chain, queue intensity, reliability curve", "Model reliability and queues with reproducible parameters.", ["P^n", "rho=lambda/mu", "R(t)"]),
  launcher("probability-statistics-stochastic", "time-series", "Time Series Lab", "concept-lab", "/syllabus-lab/stochastic-process-time-series-lab", "sample path and autocorrelation", "Inspect stationarity and signal noise visually.", ["Cov(X_t,X_(t+k))"]),
  launcher("probability-statistics-stochastic", "stats-dashboard", "Regression Inference Lab", "concept-lab", "/syllabus-lab/statistical-inference-regression-lab", "histograms, z-scores, distributions", "Analyze engineering datasets through native charts.", ["z", "sigma", "mu"]),

  launcher("optimization-operations-research", "lp", "Operations Research LP", "concept-lab", "/syllabus-lab/operations-research-lp", "feasible region and corner points", "Solve optimization scenarios by geometry first.", ["max Z=cx"]),
  launcher("optimization-operations-research", "network", "PERT/CPM and Game Theory", "concept-lab", "/syllabus-lab/network-pert-game-theory-lab", "network, critical path, minimax", "Map operations problems to graph and matrix models.", ["E=(a+4m+b)/6", "minimax"]),
  launcher("optimization-operations-research", "variational", "Calculus of Variations", "concept-lab", "/syllabus-lab/variational-calculus-lab", "functional and Euler-Lagrange path", "Connect optimal paths to differential equations.", ["d/dx(F_y')-F_y=0"]),
  launcher("optimization-operations-research", "graph-theory", "Graph Theory Lab", "concept-lab", "/syllabus-lab/graph-theory-basics", "networks, traversal, shortest path", "Use graph algorithms for OR network models.", ["paths", "trees"]),

  launcher("vector-calculus-fields", "field-theorems", "Vector Field Theorems", "concept-lab", "/syllabus-lab/vector-calculus-field-theorems", "divergence, curl, flux, circulation", "Connect field operators to integral theorems.", ["grad f", "div F", "curl F"]),
  launcher("vector-calculus-fields", "3d-workspace", "3D Field Workspace", "concept-lab", "/syllabus-lab/vector-calculus-field-theorems", "3D scene plus 2D panes", "Use live field geometry for flux and circulation context.", ["surface", "normal"]),
  launcher("vector-calculus-fields", "parametric", "Parametric Curves", "concept-lab", "/syllabus-lab/vector-calculus-field-theorems", "curve tracing and parameter motion", "Prepare line integral intuition with moving paths.", ["r(t)", "dr"]),
  launcher("vector-calculus-fields", "formula-map", "Vector Calculus Formula Map", "formula-map", "/formulas?q=gradient%20divergence%20curl%20stokes", "gradient/divergence/curl/Stokes", "Open theorem formulas from the selected field domain.", ["Gauss", "Green", "Stokes"]),

  launcher("complex-special-control", "mobius", "Mobius Transformation Lab", "concept-lab", "/syllabus-lab/mobius-transformation-lab", "complex map and branch structure", "Visualize analytic function mapping before residue work.", ["w=(az+b)/(cz+d)"]),
  launcher("complex-special-control", "contour", "Complex Line Integral", "concept-lab", "/syllabus-lab/complex-line-integral-lab", "contour, singularity, residue cue", "Connect contour geometry to integration results.", ["integral_C f(z) dz"]),
  launcher("complex-special-control", "control", "Control System Response", "concept-lab", "/syllabus-lab/control-system-response-lab", "poles, zeros, impulse, step response", "Bridge transforms to stability and response shape.", ["G(s)=Y(s)/U(s)"]),
  launcher("complex-special-control", "complex-plane", "Complex Plane", "concept-lab", "/syllabus-lab/argand-plane-plot", "Argand plane and Euler form", "Keep complex arithmetic grounded in geometry.", ["z=re^(i theta)"]),
];

export const engineeringLabLaunchers = [
  ...launchers,
  ...engineeringMathDomains.map((domain) =>
    launcher(
      domain.id,
      "practice",
      `${domain.title} Practice`,
      "practice",
      `/quiz?topic=${slug(domain.title)}`,
      `${domain.semesterBand} review and checkpoint questions`,
      "Practice the selected engineering domain after opening its labs.",
      domain.formulaFamilies.slice(0, 3),
    ),
  ),
];

export function launchersForDomain(domainId: string) {
  return engineeringLabLaunchers.filter((launcher) => launcher.domainId === domainId);
}

export function launcherCoverageSummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  return {
    launcherCount: engineeringLabLaunchers.length,
    domainCount: domainIds.size,
    coveredDomainCount: Array.from(domainIds).filter((domainId) => launchersForDomain(domainId).length > 0).length,
    conceptLabLauncherCount: engineeringLabLaunchers.filter((launcher) => launcher.kind === "concept-lab").length,
    workspaceLauncherCount: engineeringLabLaunchers.filter((launcher) => launcher.kind === "workspace").length,
    formulaMapLauncherCount: engineeringLabLaunchers.filter((launcher) => launcher.kind === "formula-map").length,
  };
}

function launcher(
  domainId: string,
  id: string,
  title: string,
  kind: EngineeringLauncherKind,
  route: string,
  preset: string,
  outcome: string,
  formulas: string[],
): EngineeringLabLauncher {
  return { id: `${domainId}-${id}`, domainId, title, kind, route, preset, outcome, formulas };
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
