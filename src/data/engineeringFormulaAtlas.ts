import { engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringFormulaCard = {
  id: string;
  domainId: string;
  title: string;
  formula: string;
  symbols: string[];
  useCase: string;
  route: string;
  prerequisites: string[];
};

const formulaCards: EngineeringFormulaCard[] = [
  card("engineering-calculus", "partial-derivative", "Partial derivative", "f_x = partial f / partial x", ["f_x", "x", "y"], "Measures surface change in one coordinate direction while holding others fixed.", "/formulas?q=partial%20derivative", ["Functions", "Limits"]),
  card("engineering-calculus", "jacobian", "Jacobian determinant", "J = partial(x,y) / partial(u,v)", ["J", "u", "v"], "Converts area or volume elements during engineering coordinate changes.", "/formulas?q=jacobian", ["Partial derivatives", "Determinants"]),
  card("engineering-calculus", "double-integral", "Double integral", "A = integral integral_R f(x,y) dA", ["R", "dA", "f"], "Accumulates mass, area, or field density across a plane region.", "/formulas?q=double%20integral", ["Single integrals", "Regions"]),
  card("engineering-calculus", "taylor-two-var", "Two-variable Taylor model", "f(a+h,b+k) approx f + h f_x + k f_y", ["h", "k", "f_x", "f_y"], "Linearizes nonlinear engineering surfaces near operating points.", "/formulas?q=taylor%20partial", ["Derivatives", "Approximation"]),

  card("engineering-differential-equations", "separable-ode", "Separable equation", "dy/dx = g(x)h(y)", ["x", "y", "g", "h"], "Splits first-order physical models into integrable sides.", "/formulas?q=separable%20ode", ["Integration", "Functions"]),
  card("engineering-differential-equations", "linear-first-order", "Linear first-order ODE", "dy/dx + P(x)y = Q(x)", ["P", "Q", "y"], "Models RC circuits, cooling, mixing, and growth with forcing terms.", "/formulas?q=linear%20ode", ["Integration", "Exponential functions"]),
  card("engineering-differential-equations", "auxiliary-equation", "Auxiliary equation", "a m^2 + b m + c = 0", ["a", "b", "c", "m"], "Classifies second-order constant-coefficient systems.", "/formulas?q=auxiliary%20equation", ["Quadratics", "Exponentials"]),
  card("engineering-differential-equations", "cauchy-euler", "Cauchy-Euler trial", "x^2 y'' + axy' + by = 0, y=x^m", ["x", "m", "a", "b"], "Handles scale-invariant differential equations in engineering models.", "/formulas?q=cauchy%20euler", ["ODEs", "Power laws"]),

  card("engineering-linear-algebra", "rank-nullity", "Rank-nullity theorem", "rank(A) + nullity(A) = n", ["A", "n"], "Connects pivots, free variables, and solution spaces.", "/formulas?q=rank%20nullity", ["Matrices", "Systems"]),
  card("engineering-linear-algebra", "eigen-equation", "Eigen equation", "A v = lambda v", ["A", "v", "lambda"], "Finds invariant directions for transforms, vibrations, and stability.", "/formulas?q=eigenvalue", ["Matrix multiplication", "Vectors"]),
  card("engineering-linear-algebra", "cayley-hamilton", "Cayley-Hamilton theorem", "p_A(A)=0", ["A", "p_A"], "Uses a matrix's own characteristic polynomial for powers and inverses.", "/formulas?q=cayley%20hamilton", ["Determinants", "Polynomials"]),
  card("engineering-linear-algebra", "least-squares", "Normal equations", "A^T A x = A^T b", ["A", "x", "b"], "Fits engineering data when systems are overdetermined.", "/formulas?q=least%20squares", ["Transpose", "Projection"]),

  card("transforms-signals", "laplace-derivative", "Laplace derivative rule", "L{f'(t)} = sF(s)-f(0)", ["s", "F", "f(0)"], "Turns differential equations into algebraic equations.", "/formulas?q=laplace%20derivative", ["ODEs", "Initial values"]),
  card("transforms-signals", "convolution", "Convolution theorem", "L{f*g}=F(s)G(s)", ["f", "g", "F", "G"], "Combines system input and impulse response.", "/formulas?q=convolution", ["Integration", "Transforms"]),
  card("transforms-signals", "fourier-series", "Fourier series", "f(x)=a0/2 + sum(a_n cos nx + b_n sin nx)", ["a_n", "b_n", "n"], "Represents periodic engineering signals by harmonics.", "/formulas?q=fourier%20series", ["Trigonometry", "Integration"]),
  card("transforms-signals", "z-transform", "Z-transform", "X(z)=sum x_n z^-n", ["X", "z", "n"], "Analyzes discrete-time recurrences and digital filters.", "/formulas?q=z%20transform", ["Sequences", "Complex numbers"]),

  card("partial-differential-equations", "pde-discriminant", "PDE classification", "B^2 - 4AC", ["A", "B", "C"], "Classifies second-order PDEs as elliptic, parabolic, or hyperbolic.", "/formulas?q=pde%20classification", ["Partial derivatives", "Quadratics"]),
  card("partial-differential-equations", "heat-equation", "Heat equation", "u_t = alpha u_xx", ["u", "alpha", "t", "x"], "Models diffusion and thermal smoothing.", "/formulas?q=heat%20equation", ["PDEs", "Fourier series"]),
  card("partial-differential-equations", "wave-equation", "Wave equation", "u_tt = c^2 u_xx", ["u", "c", "t", "x"], "Models strings, vibration, acoustics, and transmission effects.", "/formulas?q=wave%20equation", ["ODEs", "Boundary conditions"]),
  card("partial-differential-equations", "laplace-equation", "Laplace equation", "nabla^2 u = 0", ["nabla", "u"], "Describes steady-state potential, heat, and field behavior.", "/formulas?q=laplace%20equation", ["Vector calculus", "Second derivatives"]),

  card("numerical-methods", "bisection", "Bisection method", "c=(a+b)/2, f(a)f(b)<0", ["a", "b", "c"], "Finds robust roots when a sign-changing bracket is known.", "/formulas?q=bisection", ["Functions", "Intermediate value theorem"]),
  card("numerical-methods", "newton-raphson", "Newton-Raphson method", "x_(n+1)=x_n - f(x_n)/f'(x_n)", ["x_n", "f", "f'"], "Uses tangent lines for fast root convergence.", "/formulas?q=newton%20raphson", ["Derivatives", "Root finding"]),
  card("numerical-methods", "simpson-rule", "Simpson rule", "integral_a^b f dx approx h/3 [y0+yn+4 sum y_odd+2 sum y_even]", ["h", "y_i"], "Approximates smooth engineering integrals from tabular values.", "/formulas?q=simpson%20rule", ["Integration", "Tables"]),
  card("numerical-methods", "rk4", "Fourth-order Runge-Kutta", "y_(n+1)=y_n + h(k1+2k2+2k3+k4)/6", ["h", "k1", "k2", "k3", "k4"], "Solves IVPs accurately from stepwise slope samples.", "/formulas?q=rk4", ["ODEs", "Numerical slopes"]),

  card("probability-statistics-stochastic", "expectation", "Expectation", "E[X]=sum x p(x)", ["X", "p"], "Computes long-run weighted average outcome.", "/formulas?q=expectation", ["Probability", "Series"]),
  card("probability-statistics-stochastic", "variance", "Variance", "Var(X)=E[X^2]-(E[X])^2", ["X", "E"], "Measures spread in measurements, noise, and reliability data.", "/formulas?q=variance", ["Expectation", "Algebra"]),
  card("probability-statistics-stochastic", "markov-chain", "Markov update", "pi_(n+1)=pi_n P", ["pi", "P"], "Predicts state probabilities for reliability and stochastic systems.", "/formulas?q=markov%20chain", ["Matrices", "Probability"]),
  card("probability-statistics-stochastic", "queue-utilization", "Queue utilization", "rho=lambda/mu", ["lambda", "mu", "rho"], "Checks stability of M/M/1 service systems.", "/formulas?q=queue%20utilization", ["Rates", "Probability"]),

  card("optimization-operations-research", "lp-objective", "Linear programming objective", "max Z = c1 x1 + c2 x2", ["Z", "c", "x"], "Optimizes resource allocation under linear constraints.", "/formulas?q=linear%20programming", ["Linear equations", "Inequalities"]),
  card("optimization-operations-research", "duality", "Duality relation", "max c^T x subject to Ax<=b", ["A", "b", "c", "x"], "Connects primal resource problems to shadow-price models.", "/formulas?q=duality", ["Matrices", "Inequalities"]),
  card("optimization-operations-research", "pert", "PERT expected time", "T_e=(a+4m+b)/6", ["a", "m", "b"], "Estimates project activity duration from optimistic, likely, and pessimistic times.", "/formulas?q=pert", ["Weighted averages", "Graphs"]),
  card("optimization-operations-research", "euler-lagrange", "Euler-Lagrange equation", "d/dx(F_y') - F_y = 0", ["F", "y", "y'"], "Finds stationary paths for variational optimization.", "/formulas?q=euler%20lagrange", ["Calculus", "ODEs"]),

  card("vector-calculus-fields", "gradient", "Gradient", "grad f = <f_x, f_y, f_z>", ["f_x", "f_y", "f_z"], "Points in the direction of steepest scalar-field increase.", "/formulas?q=gradient", ["Partial derivatives", "Vectors"]),
  card("vector-calculus-fields", "divergence", "Divergence", "div F = partial P/partial x + partial Q/partial y + partial R/partial z", ["P", "Q", "R"], "Measures source or sink behavior in a vector field.", "/formulas?q=divergence", ["Vectors", "Partial derivatives"]),
  card("vector-calculus-fields", "curl", "Curl", "curl F = nabla x F", ["nabla", "F"], "Measures local rotation and circulation tendency.", "/formulas?q=curl", ["Cross product", "Partial derivatives"]),
  card("vector-calculus-fields", "stokes", "Stokes theorem", "integral_S curl F . n dS = integral_C F . dr", ["S", "C", "n"], "Relates surface rotation to boundary circulation.", "/formulas?q=stokes", ["Surface integrals", "Line integrals"]),

  card("complex-special-control", "cauchy-integral", "Cauchy integral formula", "f(a)=1/(2 pi i) integral_C f(z)/(z-a) dz", ["a", "z", "C"], "Evaluates analytic functions from contour values.", "/formulas?q=cauchy%20integral", ["Complex plane", "Analytic functions"]),
  card("complex-special-control", "residue", "Residue theorem", "integral_C f(z) dz = 2 pi i sum Res(f,a_k)", ["C", "Res", "a_k"], "Computes contour integrals from enclosed singularities.", "/formulas?q=residue%20theorem", ["Poles", "Contours"]),
  card("complex-special-control", "bessel", "Bessel equation", "x^2 y'' + x y' + (x^2-n^2)y=0", ["x", "n", "y"], "Models cylindrical vibration, heat, and wave problems.", "/formulas?q=bessel", ["ODEs", "Series"]),
  card("complex-special-control", "transfer-function", "Transfer function", "G(s)=Y(s)/U(s)", ["G", "Y", "U", "s"], "Links system input, output, poles, and stability.", "/formulas?q=transfer%20function", ["Laplace transforms", "Control systems"]),
];

export const engineeringFormulaAtlas = formulaCards;

export function formulasForDomain(domainId: string) {
  return engineeringFormulaAtlas.filter((formula) => formula.domainId === domainId);
}

export function formulaAtlasSummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  const coveredDomainIds = new Set(engineeringFormulaAtlas.map((formula) => formula.domainId));
  return {
    formulaCount: engineeringFormulaAtlas.length,
    domainCount: domainIds.size,
    coveredDomainCount: Array.from(domainIds).filter((domainId) => coveredDomainIds.has(domainId)).length,
    routeCount: new Set(engineeringFormulaAtlas.map((formula) => formula.route)).size,
    prerequisiteCount: new Set(engineeringFormulaAtlas.flatMap((formula) => formula.prerequisites)).size,
  };
}

function card(
  domainId: string,
  id: string,
  title: string,
  formula: string,
  symbols: string[],
  useCase: string,
  route: string,
  prerequisites: string[],
): EngineeringFormulaCard {
  return { id: `${domainId}-${id}`, domainId, title, formula, symbols, useCase, route, prerequisites };
}
