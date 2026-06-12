import { engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringPracticeLevel = "foundation" | "exam" | "challenge";

export type EngineeringPracticePrompt = {
  id: string;
  title: string;
  level: EngineeringPracticeLevel;
  prompt: string;
  expected: string;
  route: string;
};

export type EngineeringPracticePack = {
  id: string;
  domainId: string;
  title: string;
  examFocus: string[];
  skills: string[];
  commonMistakes: string[];
  prompts: EngineeringPracticePrompt[];
};

export const engineeringPracticePacks: EngineeringPracticePack[] = [
  pack("engineering-calculus", "Engineering Calculus Mastery", ["Jacobians and coordinate transforms", "Stationary points with Hessian tests", "Double and triple integral limits"], ["Differentiate multivariable functions", "Sketch level curves", "Choose integration order", "Interpret beta-gamma reductions"], ["Treating partial derivatives like total derivatives", "Dropping Jacobian factors", "Using rectangular limits for curved regions"], [
    prompt("partial-gradient-check", "Gradient and tangent plane check", "foundation", "Given z=x^2+xy+y^2 at (1,2), identify fx, fy, and the tangent plane coefficients.", "Correct partials and local linearization coefficients.", "/syllabus-lab/partial-derivative-slicer"),
    prompt("region-order-switch", "Switch integral order", "exam", "Convert a triangular xy-region double integral from dx dy to dy dx and state the new bounds.", "Equivalent bounds with unchanged integrand.", "/syllabus-lab/double-integral-region"),
    prompt("jacobian-application", "Jacobian engineering transform", "challenge", "Map a non-rectangular plate into uv-coordinates and decide whether density changes the mass integral.", "Mass integral includes the absolute Jacobian and density term.", "/formulas?q=jacobian%20double%20integral"),
  ]),
  pack("engineering-differential-equations", "Differential Equations Mastery", ["First-order method selection", "Auxiliary equation root cases", "IVP verification and engineering response"], ["Classify ODE type", "Solve linear first-order equations", "Read slope fields", "Verify candidate solutions"], ["Choosing separable form for nonseparable equations", "Forgetting complementary plus particular solution", "Not applying initial conditions after integration"], [
    prompt("slope-field-ivp", "Slope field IVP trace", "foundation", "Use the direction field for y'=x-y to predict the sign of solution curvature near (0,1).", "Qualitative trajectory reasoning tied to local slopes.", "/syllabus-lab/slope-field-generator"),
    prompt("repeated-root-cf", "Repeated root complementary function", "exam", "Solve the complementary function when the auxiliary equation has a repeated real root.", "CF contains (C1+C2x)e^(mx).", "/syllabus-lab/higher-order-ode-characteristic-lab"),
    prompt("rk4-compare", "Euler and RK4 validation", "challenge", "Compare one Euler step and one RK4 step for a growth model and explain the error gap.", "RK4 uses weighted slopes and gives smaller local error.", "/syllabus-lab/euler-vs-rk4-solution-comparison"),
  ]),
  pack("engineering-linear-algebra", "Linear Algebra Mastery", ["Rank consistency", "Eigenvalue interpretation", "Diagonalization and quadratic forms"], ["Row-reduce matrices", "Classify systems", "Compute eigenpairs", "Connect transformations to geometry"], ["Confusing row rank with determinant alone", "Ignoring augmented rank", "Using eigenvectors before checking independence"], [
    prompt("rank-system", "Rank consistency decision", "foundation", "Decide whether a 3x3 linear system has no solution, one solution, or infinitely many solutions from ranks.", "Use rank(A), rank([A|b]), and number of unknowns.", "/syllabus-lab/rank-consistency-row-reduction"),
    prompt("eigen-transform", "Eigenvector transform meaning", "exam", "Find the eigen directions of a 2D scaling-shear matrix and describe what stays on the same line.", "Eigenvectors keep direction and scale by eigenvalues.", "/syllabus-lab/eigenvector-direction-visualizer"),
    prompt("least-squares-orthogonal", "Least-squares projection", "challenge", "Use Gram-Schmidt reasoning to explain why residuals are orthogonal to the column space.", "Residual orthogonality and normal equations are connected.", "/syllabus-lab/gram-schmidt-orthogonalization"),
  ]),
  pack("transforms-signals", "Transforms and Signals Mastery", ["Laplace IVP workflow", "Fourier coefficient interpretation", "Pole location and discrete stability"], ["Use transform tables", "Apply shifting properties", "Read spectra", "Link convolution to multiplication"], ["Missing initial-condition terms", "Confusing omega-domain and s-domain variables", "Declaring stability without checking pole location"], [
    prompt("laplace-ivp", "Laplace IVP setup", "foundation", "Transform y''+3y'+2y=f(t) with given y(0), y'(0) terms visible.", "Algebraic equation for Y(s) includes initial conditions.", "/syllabus-lab/laplace-transform-workflow"),
    prompt("fourier-spectrum", "Fourier spectrum reading", "exam", "Identify which harmonics dominate a periodic signal from its coefficient bars.", "Dominant coefficients map to dominant frequencies.", "/syllabus-lab/fourier-transform-spectrum-lab"),
    prompt("z-stability", "Z-transform stability", "challenge", "Judge stability of a recurrence from pole radius and explain the unit-circle test.", "Stable when poles lie inside the unit circle for this causal preset.", "/syllabus-lab/z-transform-difference-equations"),
  ]),
  pack("partial-differential-equations", "PDE Mastery", ["PDE classification", "Separation of variables", "Finite-difference stability"], ["Classify second-order PDEs", "Choose boundary conditions", "Track heat diffusion", "Read solution surfaces"], ["Using the wrong classification discriminant sign", "Mixing boundary and initial conditions", "Choosing unstable explicit time steps"], [
    prompt("pde-classify", "Classify a second-order PDE", "foundation", "Use B^2-4AC to classify a PDE and choose the expected behavior type.", "Elliptic, parabolic, or hyperbolic classification with reason.", "/syllabus-lab/pde-classification-characteristics-lab"),
    prompt("heat-step", "Heat-grid stability check", "exam", "For an explicit heat scheme, decide whether r=0.6 is allowed and predict the visual issue.", "Unstable for the preset because r must be <= 0.5.", "/syllabus-lab/heat-equation-color-map"),
    prompt("boundary-surface", "Boundary-driven surface", "challenge", "Relate a boundary profile to the shape of a Laplace-equation solution surface.", "Boundary values constrain the steady-state surface interior.", "/syllabus-lab/laplace-equation-potential-surface"),
  ]),
  pack("numerical-methods", "Numerical Methods Mastery", ["Root-finding convergence", "Interpolation and quadrature error", "Iterative linear solvers"], ["Build iteration tables", "Estimate error", "Compare algorithms", "Detect convergence failure"], ["Stopping from small x-change while residual is large", "Using Newton method near zero derivative", "Applying Simpson rule to an invalid interval count"], [
    prompt("newton-table", "Newton iteration protocol", "foundation", "Run two Newton steps for a cubic and record x_n, f(x_n), and tangent update.", "Iteration table uses x_(n+1)=x_n-f/f'.", "/syllabus-lab/newton-raphson-tangent-iteration"),
    prompt("quadrature-choice", "Quadrature method choice", "exam", "Compare trapezoidal, Simpson, and Gaussian quadrature for a curved smooth integrand.", "Gaussian nodes often improve accuracy for smooth integrands.", "/syllabus-lab/gaussian-quadrature-lab"),
    prompt("linear-iteration", "Gauss-Seidel convergence", "challenge", "Use row dominance or observed residual trend to judge iterative linear-system convergence.", "Convergence is supported by dominance or decreasing residuals.", "/syllabus-lab/numerical-linear-algebra-iteration-lab"),
  ]),
  pack("probability-statistics-stochastic", "Probability and Stochastic Mastery", ["Distribution model selection", "Inference and regression", "Markov chains, reliability, and queues"], ["Compute expectation and variance", "Choose distributions", "Interpret confidence intervals", "Analyze transition matrices"], ["Using binomial when trials are not fixed", "Confusing probability with probability density", "Reading Markov steady state as one-step probability"], [
    prompt("distribution-choice", "Distribution selection", "foundation", "Choose between binomial, Poisson, exponential, and normal models for engineering events.", "Model choice matches event count, waiting time, or measurement assumptions.", "/syllabus-lab/probability-distribution-expectation-lab"),
    prompt("queue-utilization", "Queue stability check", "exam", "For lambda=2.4 and mu=3.6, compute utilization and decide if the M/M/1 queue is stable.", "rho=2/3 and stable because rho<1.", "/syllabus-lab/reliability-markov-queueing-lab"),
    prompt("time-series-stationarity", "Time-series stationarity", "challenge", "Inspect a sample path and autocorrelation trend to decide if a process looks stationary.", "Stationarity claim uses mean/variance behavior and autocorrelation structure.", "/syllabus-lab/stochastic-process-time-series-lab"),
  ]),
  pack("optimization-operations-research", "Optimization and OR Mastery", ["Linear programming geometry", "Transportation and assignment models", "PERT/CPM and game theory"], ["Form objective functions", "Graph feasible regions", "Use simplex tables", "Read critical paths"], ["Maximizing with a minimization sign convention", "Ignoring non-negativity constraints", "Choosing a non-corner point for linear objective optimum"], [
    prompt("lp-corners", "LP feasible region corners", "foundation", "Graph two constraints, list feasible corner points, and evaluate the objective at each.", "Optimum occurs at a feasible corner for linear programming.", "/syllabus-lab/operations-research-lp"),
    prompt("critical-path", "PERT critical path", "exam", "Find the path controlling project duration and identify slack on noncritical activities.", "Critical path has zero slack and longest expected duration.", "/syllabus-lab/network-pert-game-theory-lab"),
    prompt("variational-path", "Euler-Lagrange bridge", "challenge", "Explain why an optimal curve problem turns into a differential equation.", "Stationary functional satisfies the Euler-Lagrange equation.", "/syllabus-lab/variational-calculus-lab"),
  ]),
  pack("vector-calculus-fields", "Vector Calculus and Fields Mastery", ["Gradient, divergence, and curl", "Line and surface integrals", "Green, Gauss, and Stokes theorem matching"], ["Read vector fields", "Compute field operators", "Choose orientation", "Match theorem to region"], ["Confusing curl with divergence", "Losing orientation sign", "Applying Stokes to a nonmatching boundary"], [
    prompt("operator-meaning", "Operator meaning check", "foundation", "For a 2D linear vector field, decide what divergence and curl tell you physically.", "Divergence measures source strength; curl measures local rotation.", "/syllabus-lab/vector-calculus-field-theorems"),
    prompt("line-integral-route", "Line integral setup", "exam", "Parameterize a curve and set up the work integral for a vector field.", "Integral uses F(r(t)) dot r'(t) dt with correct bounds.", "/syllabus-lab/vector-calculus-field-theorems"),
    prompt("theorem-match", "Theorem selection", "challenge", "Choose Green, Gauss, or Stokes theorem for a flux/circulation problem and justify the boundary.", "Theorem choice matches dimension, surface/region, and boundary orientation.", "/formulas?q=green%20gauss%20stokes"),
  ]),
  pack("complex-special-control", "Complex, Special Functions, and Control Mastery", ["Analytic functions and residues", "Special-function model recognition", "Transfer function response"], ["Plot complex mappings", "Locate poles and zeros", "Use residue theorem", "Read control response curves"], ["Treating nonanalytic functions as analytic", "Ignoring contour orientation", "Confusing pole location with zero location"], [
    prompt("mobius-map", "Complex mapping behavior", "foundation", "Predict how a Mobius transformation maps a line or circle in the complex plane.", "Generalized circles map to generalized circles when defined.", "/syllabus-lab/mobius-transformation-lab"),
    prompt("residue-contour", "Residue theorem setup", "exam", "Identify poles inside a contour and write the residue-sum structure for the integral.", "Integral equals 2*pi*i times the sum of enclosed residues.", "/syllabus-lab/complex-line-integral-lab"),
    prompt("control-poles", "Control response from poles", "challenge", "Use pole locations to decide whether a second-order response is stable and oscillatory.", "Left-half-plane poles are stable; complex pairs create oscillation.", "/syllabus-lab/control-system-response-lab"),
  ]),
];

export function practicePackForDomain(domainId: string) {
  return engineeringPracticePacks.find((packItem) => packItem.domainId === domainId);
}

export function practiceCoverageSummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  const coveredDomainIds = new Set(engineeringPracticePacks.map((packItem) => packItem.domainId));
  const prompts = engineeringPracticePacks.flatMap((packItem) => packItem.prompts);
  return {
    packCount: engineeringPracticePacks.length,
    domainCount: domainIds.size,
    coveredDomainCount: Array.from(domainIds).filter((domainId) => coveredDomainIds.has(domainId)).length,
    promptCount: prompts.length,
    examPromptCount: prompts.filter((promptItem) => promptItem.level === "exam").length,
  };
}

function pack(
  domainId: string,
  title: string,
  examFocus: string[],
  skills: string[],
  commonMistakes: string[],
  prompts: EngineeringPracticePrompt[],
): EngineeringPracticePack {
  return { id: `${domainId}-practice-pack`, domainId, title, examFocus, skills, commonMistakes, prompts };
}

function prompt(id: string, title: string, level: EngineeringPracticeLevel, promptText: string, expected: string, route: string): EngineeringPracticePrompt {
  return { id, title, level, prompt: promptText, expected, route };
}
