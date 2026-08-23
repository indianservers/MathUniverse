import type { GraphViewport } from "../../../components/workspace/panels/graphPanelUtils";

export type CalculusVisualMode =
  | "limit"
  | "one-sided-limit"
  | "asymptote"
  | "end-behavior"
  | "continuity"
  | "discontinuity"
  | "epsilon-delta"
  | "secant"
  | "tangent"
  | "normal"
  | "derivative-graph"
  | "higher-derivative"
  | "rule"
  | "implicit"
  | "parametric"
  | "critical"
  | "monotonicity"
  | "extrema"
  | "concavity"
  | "inflection"
  | "optimization"
  | "related-rates"
  | "motion"
  | "newton"
  | "taylor"
  | "accumulation";

export type CalculusVisualPreset = {
  lessonId: number;
  expression: string;
  title: string;
  mode: CalculusVisualMode;
  viewport: Omit<GraphViewport, "width" | "height">;
  x: number;
  h: number;
  partitions?: number;
  highlightX?: number[];
  verticalLines?: number[];
  horizontalLines?: number[];
  guide: [string, string, string];
  pointLabels: [string, string];
  outputLabels: [string, string, string, string];
  visualSummary: string;
};

const viewport = (xMin: number, xMax: number, yMin: number, yMax: number) => ({ xMin, xMax, yMin, yMax });

export const calculusVisualPresets: readonly CalculusVisualPreset[] = [
  preset(277, "sin(x)/x", "Informal Limits", "limit", viewport(-6, 6, -1.2, 1.4), -1.2, 0.35, ["approach x=0", "nearby sample"], ["f(x)", "sample slope", "limit target", "CAS derivative"], "A removable-looking limit model approaches y=1 near x=0 even though nearby values change."),
  preset(278, "abs(x)/x", "One-Sided Limits", "one-sided-limit", viewport(-4, 4, -1.4, 1.4), -1.5, 0.5, ["left side", "right side"], ["f(x)", "side gap", "left/right", "CAS derivative"], "The graph stays near -1 from the left and +1 from the right, so the two-sided limit does not exist."),
  preset(279, "1/(x-1)^2", "Infinite Limits", "asymptote", viewport(-3, 5, -1, 14), 0.35, 0.35, ["near asymptote", "comparison point"], ["f(x)", "blow-up rate", "x=1 asymptote", "CAS derivative"], "A positive reciprocal-square curve shoots upward on both sides of the vertical asymptote x=1."),
  preset(280, "(2*x^2+1)/(x^2+1)", "Limits at Infinity", "end-behavior", viewport(-8, 8, -0.5, 3.2), 4, 1, ["far x", "farther x"], ["f(x)", "end gap", "horizontal asymptote", "CAS derivative"], "A rational function flattens toward the horizontal asymptote y=2 as x moves far left or right."),
  preset(281, "x^2+1", "Continuity at a Point", "continuity", viewport(-4, 4, -1, 8), 1, 0.5, ["point value", "nearby value"], ["f(x)", "local change", "continuous point", "CAS derivative"], "A smooth parabola has matching left approach, right approach, and function value at the highlighted point."),
  preset(282, "1/(x-1)", "Types of Discontinuity", "discontinuity", viewport(-4, 5, -8, 8), 0.35, 0.3, ["break point", "nearby sample"], ["f(x)", "jump/blow-up", "x=1 break", "CAS derivative"], "A reciprocal curve separates into two branches around the vertical discontinuity x=1."),
  preset(283, "2*x+1", "Epsilon-Delta Visualiser", "epsilon-delta", viewport(-4, 4, -4, 8), 1, 0.5, ["input band", "output band"], ["f(x)", "delta band", "epsilon band", "CAS derivative"], "A linear function turns an input band around x=1 into a proportional output band around y=3."),
  preset(284, "0.5*x^2+x", "Average Rate of Change", "secant", viewport(-5, 5, -5, 12), -3, 2, ["start point", "end point"], ["f(x)", "secant slope", "interval", "CAS derivative"], "Two selected points form a secant line whose slope measures average change over the interval."),
  preset(285, "0.5*x^2+x", "Instantaneous Rate of Change", "tangent", viewport(-5, 5, -5, 12), 1, 0.35, ["base point", "near point"], ["f(x)", "near secant", "instant slope", "CAS derivative"], "As the second point moves close to the first, the secant slope approaches the tangent slope."),
  preset(286, "x^2+2*x", "Derivative from First Principles", "tangent", viewport(-5, 5, -5, 16), 1, 1, ["x", "x+h"], ["f(x)", "difference quotient", "h", "CAS derivative"], "The highlighted pair visualizes the difference quotient before taking the limit as h approaches zero."),
  preset(287, "x^2-2*x+1", "Tangent Line", "tangent", viewport(-4, 5, -2, 12), 2, 0.5, ["tangent point", "near point"], ["f(x)", "tangent slope", "contact point", "CAS derivative"], "A tangent line follows the local direction of the curve at the selected point."),
  preset(288, "x^2-2*x+1", "Normal Line", "normal", viewport(-4, 5, -2, 12), 2, 0.5, ["tangent point", "normal direction"], ["f(x)", "normal slope", "perpendicular check", "CAS derivative"], "The normal line is perpendicular to the tangent at the same selected point."),
  preset(289, "x^3-3*x", "Derivative Graph", "derivative-graph", viewport(-4, 4, -8, 8), -1.2, 1, ["slope sample", "derivative value"], ["f(x)", "f'(x)", "slope sign", "CAS derivative"], "A cubic curve is paired with slope information that becomes the derivative graph."),
  preset(290, "x^4-4*x^2", "Higher Derivatives", "higher-derivative", viewport(-3.5, 3.5, -8, 12), -1.5, 0.75, ["first derivative", "second derivative"], ["f(x)", "f'(x)", "f''(x)", "CAS derivative"], "A quartic curve shows how first and second derivatives describe slope and bending separately."),
  preset(291, "x^2*sin(x)", "Product Rule", "rule", viewport(-5, 5, -8, 8), 1.2, 0.7, ["factor product", "slope contribution"], ["f(x)", "local product", "rule terms", "CAS derivative"], "The product curve changes because both the x^2 factor and the sine factor change."),
  preset(292, "(x^2+1)/(x+2)", "Quotient Rule", "rule", viewport(-5, 5, -8, 8), 1, 0.7, ["quotient point", "denominator effect"], ["f(x)", "quotient slope", "domain restriction", "CAS derivative"], "A rational quotient highlights numerator change, denominator change, and the excluded denominator value."),
  preset(293, "sin(x^2)", "Chain Rule", "rule", viewport(-4, 4, -1.4, 1.4), 1.1, 0.5, ["inner x^2", "outer sine"], ["f(x)", "nested change", "chain factor", "CAS derivative"], "A nested sine curve changes through both the outside sine rule and the inside x^2 rule."),
  preset(294, "sqrt(9-x^2)", "Implicit Differentiation", "implicit", viewport(-4, 4, -1, 4), 1.5, 0.45, ["circle branch", "implicit slope"], ["y", "dy/dx", "constraint", "CAS derivative"], "The upper semicircle represents x^2+y^2=9, where y changes implicitly with x."),
  preset(295, "sin(x)+0.25*x", "Parametric Differentiation", "parametric", viewport(-6, 6, -2, 2), 1, 0.5, ["parameter t", "near t+h"], ["x(t)", "dy/dx", "parameter step", "CAS derivative"], "The curve stands in for a parametric path where both coordinates change with a parameter."),
  preset(296, "x^3-3*x", "Critical Points", "critical", viewport(-4, 4, -8, 8), -1, 0.5, ["f'(x)=0", "test point"], ["f(x)", "slope", "critical x", "CAS derivative"], "The cubic has flat tangent candidates where the derivative is zero."),
  preset(297, "x^3-3*x", "Increasing / Decreasing", "monotonicity", viewport(-4, 4, -8, 8), -2, 0.8, ["increasing interval", "decreasing interval"], ["f(x)", "slope sign", "interval", "CAS derivative"], "Derivative sign partitions the cubic into increasing and decreasing intervals."),
  preset(298, "4-x^2", "Local and Global Extrema", "extrema", viewport(-5, 5, -8, 6), -2.08, 1, ["global maximum", "comparison point"], ["f(x)", "secant slope", "maximum value", "CAS derivative"], "A downward parabola has a global maximum at its vertex and lower values away from it."),
  preset(299, "x^4-4*x^2", "Concavity", "concavity", viewport(-3.5, 3.5, -8, 12), -1.5, 0.75, ["concave up", "concave down"], ["f(x)", "f'' sign", "bending", "CAS derivative"], "The quartic bends up and down in different regions, so second derivative sign matters."),
  preset(300, "x^3-3*x", "Inflection Points", "inflection", viewport(-4, 4, -8, 8), 0, 0.7, ["concavity switch", "test point"], ["f(x)", "f'' sign", "inflection x", "CAS derivative"], "The cubic changes concavity at the central inflection point."),
  preset(301, "6*x-x^2", "Optimisation", "optimization", viewport(-1, 7, -2, 12), 2, 1, ["candidate maximum", "domain endpoint"], ["quantity", "slope", "best value", "CAS derivative"], "A concave-down model lets students compare interior critical value and domain endpoints."),
  preset(302, "sqrt(x^2+4)", "Related Rates", "related-rates", viewport(-5, 5, 0, 7), 2, 0.5, ["changing distance", "rate link"], ["distance", "rate", "linked variables", "CAS derivative"], "A distance curve links horizontal motion to changing diagonal distance."),
  preset(303, "-0.5*x^2+3*x", "Motion Analysis", "motion", viewport(-1, 7, -3, 8), 1, 0.8, ["position", "velocity sign"], ["position", "velocity", "acceleration", "CAS derivative"], "A projectile-style position curve connects slope to velocity and curvature to acceleration."),
  preset(304, "x^2-2", "Newton's Method", "newton", viewport(-3, 3, -3, 7), 1.8, 0.5, ["current guess", "tangent root"], ["f(x)", "Newton step", "root target", "CAS derivative"], "A tangent from the current guess points toward the next Newton approximation for sqrt(2)."),
  preset(305, "sin(x)", "Taylor Polynomial", "taylor", viewport(-6, 6, -2, 2), 1, 0.5, ["center", "nearby approximation"], ["f(x)", "polynomial", "error", "CAS derivative"], "A sine curve near the center is approximated by a polynomial built from derivatives."),
  preset(310, "x^2", "Fundamental Theorem", "accumulation", viewport(-1, 5, -1, 18), 3, 1, ["area endpoint", "accumulation"], ["f(x)", "area", "F(b)-F(a)", "CAS derivative"], "Changing the upper endpoint changes accumulated area, linking derivative and integral."),
  preset(306, "0.25*x^2+1", "Area by Rectangles", "accumulation", viewport(-1, 6, -1, 12), 4, 1, ["left endpoint", "rectangle height"], ["f(x)", "slice width", "rectangle sum", "CAS integral"], "Rectangles approximate the area under a positive curve, and thinner widths improve the estimate."),
  preset(307, "sin(x)+2", "Riemann Sums", "accumulation", viewport(-1, 7, -1, 4), 5, 1, ["sample height", "partition"], ["f(x)", "delta x", "Riemann sum", "CAS integral"], "A shifted sine curve makes left, right, and midpoint rectangle choices visibly different."),
  preset(308, "3-x^2/4", "Definite Integral", "accumulation", viewport(-4, 4, -2, 4), 3, 1, ["lower bound", "upper bound"], ["f(x)", "dx", "signed area", "CAS integral"], "A definite integral accumulates signed area across fixed bounds."),
  preset(309, "3*x^2+2", "Indefinite Integral", "rule", viewport(-3, 3, -2, 30), 1, 0.5, ["antiderivative family", "slope check"], ["f(x)", "local change", "F(x)+C", "CAS integral"], "The antiderivative family has the same derivative even after adding any constant C."),
  preset(311, "4-x^2", "Area Between Curves", "accumulation", viewport(-4, 4, -4, 6), 2, 1, ["top curve", "bottom curve"], ["top-bottom", "dx", "between area", "CAS integral"], "The highlighted accumulation represents top minus bottom, not just area under one curve."),
  preset(312, "2*x*cos(x^2)", "Substitution", "rule", viewport(-4, 4, -8, 8), 1, 0.4, ["inner u=x^2", "matching du"], ["f(x)", "u-change", "substitution", "CAS integral"], "The factor 2x matches the derivative of the inside expression x^2."),
  preset(313, "x*exp(x)", "Integration by Parts", "rule", viewport(-3, 3, -4, 30), 1, 0.5, ["u=x", "dv=e^x dx"], ["f(x)", "product area", "uv-int vdu", "CAS integral"], "A product integrand is split into u and dv before applying integration by parts."),
  preset(314, "1/((x+1)*(x+3))", "Partial Fractions", "rule", viewport(-6, 4, -8, 8), 0, 0.5, ["factor x+1", "factor x+3"], ["f(x)", "branch gap", "split terms", "CAS integral"], "Factored denominators reveal simple reciprocal pieces with excluded x-values."),
  preset(315, "1/(x^2+1)", "Improper Integrals", "accumulation", viewport(-8, 8, -1, 2), 6, 1, ["long tail", "limit bound"], ["f(x)", "tail width", "converges?", "CAS integral"], "A decaying tail asks whether the accumulated area approaches a finite limit."),
  preset(316, "cos(x)+2", "Numerical Integration", "accumulation", viewport(-1, 7, -1, 4), 4, 1, ["sample rule", "error band"], ["f(x)", "step size", "approx area", "CAS integral"], "Numerical integration compares sampled rectangle area with the exact symbolic integral."),
  preset(317, "sqrt(9-x^2)", "Volume by Slicing", "accumulation", viewport(-4, 4, -1, 4), 3, 1, ["slice radius", "cross-section"], ["radius", "slice width", "volume slice", "CAS integral"], "Each vertical slice becomes a cross-section area before volume is accumulated."),
  preset(318, "3-sqrt(abs(x))", "Disc and Washer Methods", "accumulation", viewport(-1, 7, -1, 5), 4, 1, ["outer radius", "inner radius"], ["radius", "dx", "washer area", "CAS integral"], "Washer volume squares radii before subtracting inner area from outer area."),
  preset(319, "4-x", "Shell Method", "accumulation", viewport(-1, 5, -1, 5), 3, 1, ["shell radius", "shell height"], ["height", "thickness", "shell area", "CAS integral"], "A shell uses radius times height times thickness rather than washer radii."),
  preset(320, "0.25*x^2", "Arc Length", "tangent", viewport(-5, 5, -1, 8), 2, 0.5, ["tiny segment", "curve length"], ["f(x)", "slope", "ds segment", "CAS derivative"], "Arc length adds tiny slanted pieces, so slope affects distance traveled along the curve."),
  preset(321, "sqrt(x)+1", "Surface Area of Revolution", "tangent", viewport(0, 8, -1, 5), 3, 0.5, ["radius", "arc strip"], ["radius", "slope", "surface strip", "CAS derivative"], "A rotating arc strip creates surface area from circumference times slanted length."),
  preset(322, "sin(x)+2", "Accumulation Functions", "accumulation", viewport(-1, 8, -1, 4), 5, 1, ["moving upper limit", "total so far"], ["f(x)", "dx", "A(x)", "CAS integral"], "Moving the upper limit turns area into a new function of x."),
  preset(323, "0.5*x+1", "Direction Fields", "related-rates", viewport(-6, 6, -4, 6), 1, 0.7, ["slope sample", "solution trace"], ["dy/dx", "step", "field cue", "CAS derivative"], "A slope field gives a local direction at many points before a solution curve is chosen."),
  preset(324, "1+0.5*x", "Euler's Method", "related-rates", viewport(-1, 8, -1, 8), 1, 0.75, ["current point", "Euler step"], ["slope", "step h", "next estimate", "CAS derivative"], "Euler's method walks forward by using the current slope over a small step."),
  preset(325, "x*exp(-0.5*x^2)", "Separable Equations", "related-rates", viewport(-1, 7, -1, 3), 2, 0.5, ["x part", "y part"], ["rate", "separated dx", "integrated form", "CAS integral"], "Separable equations isolate x and y factors before integrating both sides."),
  preset(326, "exp(-x)+x", "First-Order Linear Equations", "related-rates", viewport(-1, 6, -1, 7), 2, 0.5, ["integrating factor", "solution curve"], ["y", "rate", "linear form", "CAS derivative"], "A first-order linear solution combines transient decay with a forcing term."),
  preset(327, "8/(1+3*exp(-x))", "Logistic Growth", "related-rates", viewport(-4, 8, -1, 10), 1, 0.5, ["rapid growth", "carrying capacity"], ["population", "growth rate", "capacity 8", "CAS derivative"], "Logistic growth rises fastest in the middle and levels near a carrying capacity."),
  preset(328, "exp(-0.2*x)*cos(2*x)", "Second-Order Equations", "motion", viewport(0, 10, -2, 2), 2, 0.5, ["oscillation", "damping"], ["position", "velocity", "acceleration", "CAS derivative"], "A damped oscillator models a second-order equation with position, velocity, and acceleration."),
  preset(329, "x-x^3/3", "Phase Plane", "motion", viewport(-4, 4, -4, 4), 1, 0.5, ["state x", "state y"], ["state", "velocity", "trajectory", "CAS derivative"], "A phase-plane trace treats axes as state variables rather than time and output."),
  preset(330, "x-x^3", "Equilibrium and Stability", "critical", viewport(-3, 3, -4, 4), -1, 0.5, ["stable equilibrium", "unstable equilibrium"], ["rate", "sign", "equilibrium", "CAS derivative"], "Equilibria occur where the rate is zero; nearby arrows decide stability."),
  preset(331, "0.6*x*(1-x/5)", "Discrete Dynamical Systems", "related-rates", viewport(-1, 8, -1, 3), 2, 0.5, ["current state", "next state"], ["x_n", "update", "x_{n+1}", "CAS derivative"], "A discrete rule updates state step by step instead of flowing continuously."),
  preset(332, "3.2*x*(1-x)", "Cobweb Diagrams", "related-rates", viewport(-0.2, 1.2, -0.2, 1.2), 0.4, 0.1, ["curve", "y=x feedback"], ["x_n", "next", "feedback", "CAS derivative"], "A cobweb alternates from the update curve to y=x to feed output back as input."),
  preset(333, "3.8*x*(1-x)", "Chaos and Bifurcation", "related-rates", viewport(-0.2, 1.2, -0.2, 1.2), 0.3, 0.1, ["sensitive start", "branching outcomes"], ["x_n", "next", "parameter r", "CAS derivative"], "A logistic-map parameter near chaos makes nearby starts separate quickly."),
];

const byLessonId = new Map(calculusVisualPresets.map((preset) => [preset.lessonId, preset]));

export function calculusVisualPresetForLesson(lessonId: number) {
  return byLessonId.get(lessonId) ?? null;
}

function preset(
  lessonId: number,
  expression: string,
  title: string,
  mode: CalculusVisualMode,
  viewportValue: Omit<GraphViewport, "width" | "height">,
  x: number,
  h: number,
  pointLabels: [string, string],
  outputLabels: [string, string, string, string],
  visualSummary: string,
): CalculusVisualPreset {
  return {
    lessonId,
    expression,
    title,
    mode,
    viewport: viewportValue,
    x,
    h,
    partitions: mode === "accumulation" ? 12 : 8,
    highlightX: mode === "extrema" ? [0] : mode === "critical" ? [-1, 1] : mode === "inflection" ? [0] : undefined,
    verticalLines: mode === "asymptote" || mode === "discontinuity" ? [1] : undefined,
    horizontalLines: mode === "end-behavior" ? [2] : undefined,
    guide: [guideTitleFor(lessonId, title), visualSummary, "Use the highlighted points and labels; the symbolic overlay verifies the exact calculus rule."],
    pointLabels,
    outputLabels,
    visualSummary,
  };
}

function guideTitleFor(lessonId: number, title: string) {
  const testStableTitles: Record<number, string> = {
    277: "Informal limits",
    278: "One-sided limits",
    279: "Infinite limits",
    280: "Limits at infinity",
    281: "Continuity at a point",
    282: "Types of discontinuity",
    283: "Epsilon-delta visualiser",
    284: "Average rate of change",
    285: "Instantaneous rate of change",
    286: "First principles",
    287: "Tangent line",
    288: "Normal line",
    289: "Derivative graph",
    290: "Higher derivatives",
    291: "Product rule",
    292: "Quotient rule",
    293: "Chain rule",
    294: "Implicit differentiation",
    295: "Parametric differentiation",
    296: "Critical points",
    297: "Increasing or decreasing",
    298: "Local and global extrema",
    299: "Concavity",
    300: "Inflection points",
    301: "Optimisation",
    302: "Related rates",
    303: "Motion analysis",
    304: "Newton's method",
    305: "Taylor polynomial",
    310: "Fundamental theorem",
    306: "Area by rectangles",
    307: "Riemann sums",
    308: "Definite integral",
    309: "Indefinite integral",
    311: "Area between curves",
    312: "Substitution",
    313: "Integration by parts",
    314: "Partial fractions",
    315: "Improper integrals",
    316: "Numerical integration",
    317: "Volume by slicing",
    318: "Disc and washer methods",
    319: "Shell method",
    320: "Arc length",
    321: "Surface area of revolution",
    322: "Accumulation functions",
    323: "Direction fields",
    324: "Euler's method",
    325: "Separable equations",
    326: "First-order linear equations",
    327: "Logistic growth",
    328: "Second-order equations",
    329: "Phase plane",
    330: "Equilibrium and stability",
    331: "Discrete dynamical systems",
    332: "Cobweb diagrams",
    333: "Chaos and bifurcation",
  };
  return testStableTitles[lessonId] ?? title;
}
