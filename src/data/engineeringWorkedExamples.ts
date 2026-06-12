import { engineeringMathDomains } from "./engineeringMathBlueprint";

export type EngineeringWorkedExample = {
  id: string;
  domainId: string;
  title: string;
  problem: string;
  steps: string[];
  answerCheck: string;
  application: string;
  route: string;
};

const examples: EngineeringWorkedExample[] = [
  example("engineering-calculus", "cooling-plate-jacobian", "Cooling plate coordinate change", "Convert a plate integral from xy to uv coordinates when x=u+v and y=u-v.", ["Write x_u=1, x_v=1, y_u=1, y_v=-1.", "Compute J=x_u y_v - x_v y_u = -2.", "Use dA=abs(J)dudv=2dudv in the transformed mass or heat integral."], "The transformed integral must include the factor 2.", "Thermal plate modeling with skew coordinate grids.", "/syllabus-lab/jacobian-area-scaling-lab"),
  example("engineering-calculus", "surface-linearization", "Local surface linearization", "Linearize z=x^2+xy+y^2 near (1,2).", ["Compute f(1,2)=7.", "Compute f_x=2x+y, so f_x(1,2)=4.", "Compute f_y=x+2y, so f_y(1,2)=5.", "Write L=7+4(x-1)+5(y-2)."], "At (1,2), the linear model returns 7.", "Sensor calibration around an operating point.", "/syllabus-lab/partial-derivative-slicer"),

  example("engineering-differential-equations", "rc-decay-model", "RC circuit decay", "Solve dy/dt+2y=0 with y(0)=5.", ["Separate or use the linear ODE form.", "Get y=Ce^(-2t).", "Apply y(0)=5 to get C=5."], "y(t)=5e^(-2t), and y(0)=5.", "Voltage decay in a first-order circuit.", "/syllabus-lab/slope-field-generator"),
  example("engineering-differential-equations", "repeated-root-response", "Repeated root response", "Solve y''-4y'+4y=0.", ["Build the auxiliary equation m^2-4m+4=0.", "Factor as (m-2)^2=0.", "Use the repeated-root complementary function."], "y=(C1+C2x)e^(2x).", "Critically damped vibration response.", "/syllabus-lab/higher-order-ode-characteristic-lab"),

  example("engineering-linear-algebra", "rank-consistency-check", "Rank consistency check", "Classify a 3 unknown system with rank(A)=2 and rank([A|b])=3.", ["Compare rank(A) with rank([A|b]).", "Since the ranks differ, the equations are inconsistent.", "No solution exists regardless of number of unknowns."], "Different ranks mean inconsistent system.", "Feasibility check for constrained design equations.", "/syllabus-lab/rank-consistency-row-reduction"),
  example("engineering-linear-algebra", "eigen-scaling-mode", "Eigen scaling mode", "If Av=3v for nonzero v, describe the transform.", ["Recognize v as an eigenvector.", "The direction of v is preserved.", "The vector length is scaled by factor 3, with no direction flip."], "Output stays on the same line as v.", "Principal mode of a transformation or vibration matrix.", "/syllabus-lab/eigenvector-direction-visualizer"),

  example("transforms-signals", "laplace-initial-term", "Laplace initial term", "Transform y'+4y=sin(t), y(0)=2.", ["Use L{y'}=sY-y(0).", "Substitute to get sY-2+4Y=1/(s^2+1).", "Collect terms: (s+4)Y=2+1/(s^2+1)."], "Initial value appears as -2 before rearranging.", "Control system IVP conversion to algebra.", "/syllabus-lab/laplace-transform-workflow"),
  example("transforms-signals", "fourier-dominant-harmonic", "Dominant harmonic readout", "A Fourier display has b1=5, b3=1, and all other visible coefficients below 0.5. Identify the dominant behavior.", ["Compare coefficient magnitudes.", "The first sine harmonic is largest.", "Expect the waveform to look mostly like a sine wave with small distortion."], "Largest coefficient controls the strongest harmonic.", "Signal quality and vibration spectrum interpretation.", "/syllabus-lab/fourier-transform-spectrum-lab"),

  example("partial-differential-equations", "pde-classification-example", "PDE classification", "Classify u_xx+4u_xy+4u_yy=0.", ["Identify A=1, B=4, C=4.", "Compute B^2-4AC=16-16=0.", "Zero discriminant means parabolic."], "Classification is parabolic.", "Choosing a solution strategy before solving a PDE.", "/syllabus-lab/pde-classification-characteristics-lab"),
  example("partial-differential-equations", "explicit-heat-stability", "Explicit heat stability", "Decide if r=0.4 is stable for the explicit heat equation preset.", ["Recall the preset condition 0<r<=0.5.", "Check 0.4 is inside the interval.", "Proceed with grid updates."], "r=0.4 is stable for this explicit scheme.", "Finite difference heat simulation.", "/syllabus-lab/heat-equation-color-map"),

  example("numerical-methods", "newton-first-step", "Newton first step", "For f(x)=x^2-2 from x0=1, compute one Newton step.", ["Compute f(1)=-1.", "Compute f'(x)=2x, so f'(1)=2.", "Use x1=1-(-1)/2=1.5."], "x1=1.5.", "Fast square-root approximation in numerical software.", "/syllabus-lab/newton-raphson-tangent-iteration"),
  example("numerical-methods", "bisection-bracket", "Bisection bracket", "For f(x)=x^3-x-2 on [1,2], find the first midpoint and sign decision.", ["Compute midpoint c=1.5.", "f(1)<0 and f(1.5)<0.", "Keep the sign-changing bracket [1.5,2]."], "The root remains bracketed in [1.5,2].", "Robust root finding when derivatives are unreliable.", "/syllabus-lab/newton-raphson-tangent-iteration"),

  example("probability-statistics-stochastic", "queue-stability", "Queue stability", "For lambda=2.4 and mu=3.6, decide if an M/M/1 queue is stable.", ["Compute rho=lambda/mu.", "rho=2.4/3.6=0.6667.", "Since rho<1, the queue is stable."], "Utilization is about 0.667 and stable.", "Service desk or network packet queue sizing.", "/syllabus-lab/reliability-markov-queueing-lab"),
  example("probability-statistics-stochastic", "markov-two-step", "Markov two-step idea", "Explain how to forecast a state distribution two steps ahead.", ["Start with row vector pi0.", "Compute pi1=pi0 P.", "Compute pi2=pi1 P, equivalently pi0 P^2."], "Two-step forecast is pi0P^2.", "Reliability state prediction over repeated cycles.", "/syllabus-lab/reliability-markov-queueing-lab"),

  example("optimization-operations-research", "lp-corner-check", "LP corner check", "Maximize Z=3x+2y over feasible corner points (0,0), (2,0), (0,3), and (1,2).", ["Evaluate Z at each corner.", "Values are 0, 6, 6, and 7.", "Choose the highest feasible value."], "Maximum is 7 at (1,2).", "Resource allocation with linear constraints.", "/syllabus-lab/operations-research-lp"),
  example("optimization-operations-research", "pert-expected-time", "PERT expected time", "Find expected activity time for a=2, m=5, b=8.", ["Use T_e=(a+4m+b)/6.", "Substitute (2+4(5)+8)/6.", "Compute 30/6=5."], "Expected time is 5.", "Project scheduling under uncertainty.", "/syllabus-lab/network-pert-game-theory-lab"),

  example("vector-calculus-fields", "divergence-linear-field", "Divergence of a linear field", "Find div F for F=<2x-y, 3y+z, x+4z>.", ["Differentiate first component with respect to x: 2.", "Differentiate second with respect to y: 3.", "Differentiate third with respect to z: 4.", "Add them to get 9."], "Divergence is 9.", "Source strength in fluid or electromagnetic fields.", "/syllabus-lab/vector-calculus-field-theorems"),
  example("vector-calculus-fields", "work-integral-setup", "Line integral setup", "Set up work for F=<y,x> along r(t)=<t,t^2>, 0<=t<=1.", ["Compute F(r(t))=<t^2,t>.", "Compute r'(t)=<1,2t>.", "Dot product is t^2+2t^2=3t^2.", "Set up integral from 0 to 1 of 3t^2 dt."], "The setup is integral_0^1 3t^2 dt.", "Work done by a field along a path.", "/syllabus-lab/vector-calculus-field-theorems"),

  example("complex-special-control", "residue-simple-pole", "Simple pole residue", "Find the residue of 1/(z-2) at z=2.", ["Recognize a simple pole.", "For 1/(z-a), the residue at a is 1.", "Here a=2."], "Residue is 1.", "Fast contour integral evaluation.", "/syllabus-lab/complex-line-integral-lab"),
  example("complex-special-control", "stable-control-pole", "Stable control pole", "Decide if a pole at s=-3 is stable for a continuous-time control response.", ["Read the real part of the pole.", "The real part is negative.", "A left-half-plane pole gives decaying response."], "The pole is stable.", "Control response and damping analysis.", "/syllabus-lab/control-system-response-lab"),
];

export const engineeringWorkedExamples = examples;

export function workedExamplesForDomain(domainId: string) {
  return engineeringWorkedExamples.filter((exampleItem) => exampleItem.domainId === domainId);
}

export function workedExampleSummary() {
  const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
  const coveredDomainIds = new Set(engineeringWorkedExamples.map((exampleItem) => exampleItem.domainId));
  return {
    exampleCount: engineeringWorkedExamples.length,
    domainCount: domainIds.size,
    coveredDomainCount: Array.from(domainIds).filter((domainId) => coveredDomainIds.has(domainId)).length,
    routeCount: new Set(engineeringWorkedExamples.map((exampleItem) => exampleItem.route)).size,
    stepCount: engineeringWorkedExamples.reduce((sum, exampleItem) => sum + exampleItem.steps.length, 0),
  };
}

function example(
  domainId: string,
  id: string,
  title: string,
  problem: string,
  steps: string[],
  answerCheck: string,
  application: string,
  route: string,
): EngineeringWorkedExample {
  return { id: `${domainId}-${id}`, domainId, title, problem, steps, answerCheck, application, route };
}
