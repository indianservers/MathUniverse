import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type IntegralChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type Entry = {
  title: string;
  slug: string;
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  variables: [string, string][];
  misconception: [string, string, string];
  examples: [string, string][];
};

const entries: Record<number, Entry> = {
  306: entry("Area by Rectangles", "area-by-rectangles", "Area by rectangles estimates area under a graph using thin rectangles.", "More, thinner rectangles usually give a better area estimate.", "Rectangle sum", "A approx sum f(x_i) Delta x", [["f(x_i)", "sample height"], ["Delta x", "rectangle width"]], ["ONE_RECTANGLE", "Using one wide rectangle as exact area.", "Use many thin rectangles, then compare the trend."], [["Road distance", "Speed rectangles estimate distance travelled."], ["Floor tiling", "Small tiles estimate curved floor area."], ["Rainfall total", "Rates over short times build a total."]]),
  307: entry("Riemann Sums", "riemann-sums", "A Riemann sum adds many sample-height rectangles over an interval.", "The definite integral is the limit of Riemann sums as widths approach zero.", "Riemann sum", "sum f(x_i*) Delta x_i", [["x_i*", "sample point"], ["Delta x_i", "subinterval width"]], ["SAMPLE_POINT", "Thinking left, right, and midpoint sums must match for few rectangles.", "They can differ, but approach the same value for nice functions as widths shrink."], [["Distance from speed", "Small time strips estimate total distance."], ["Electric use", "Power readings add into energy used."], ["Water flow", "Flow rate strips estimate volume."]]),
  308: entry("Definite Integral", "definite-integral", "A definite integral gives signed accumulation from a to b.", "Area above the x-axis counts positive; area below counts negative.", "Definite integral", "int_a^b f(x) dx", [["a,b", "endpoints"], ["f(x)", "rate or height"]], ["AREA_ONLY", "Calling every definite integral ordinary area.", "It is signed accumulation unless the function is non-negative."], [["Net distance", "Velocity above and below zero gives displacement."], ["Bank balance", "Cash flow accumulates over time."], ["Water tank", "Inflow rate accumulates volume."]]),
  309: entry("Indefinite Integral", "indefinite-integral", "An indefinite integral is a family of antiderivatives.", "Always include the constant C because many functions share one derivative.", "Antiderivative family", "int f(x) dx = F(x)+C", [["F", "antiderivative"], ["C", "constant"]], ["MISSING_C", "Forgetting the plus C.", "Add C for an indefinite integral."], [["Position from velocity", "Many starting positions can share one velocity rule."], ["Cost from marginal cost", "A fixed fee changes the constant."], ["Growth model", "Initial amount sets C."]]),
  310: entry("Fundamental Theorem", "fundamental-theorem", "The Fundamental Theorem links derivatives and definite integrals.", "If F'=f, then int_a^b f(x) dx = F(b)-F(a).", "FTC evaluation", "int_a^b f(x) dx = F(b)-F(a)", [["F", "antiderivative of f"], ["a,b", "limits"]], ["NO_ANTIDERIVATIVE", "Substituting into f instead of an antiderivative F.", "Find F first, then compute F(b)-F(a)."], [["Trip distance", "Velocity accumulation equals position change."], ["Savings", "Net deposit rate gives balance change."], ["Heating", "Power over time gives energy change."]]),
  311: entry("Area Between Curves", "area-between-curves", "Area between curves measures vertical gap over an interval.", "Use top minus bottom, then integrate.", "Between curves", "A=int_a^b (top-bottom) dx", [["top", "upper function"], ["bottom", "lower function"]], ["ORDER_SWAP", "Subtracting bottom minus top and getting negative area.", "Use upper function minus lower function for area."], [["River cross-section", "Gap between boundary curves gives area."], ["Profit bands", "Revenue minus cost accumulates profit."], ["Design clearance", "Space between two curves is measured by gaps."]]),
  312: entry("Substitution", "substitution", "Substitution reverses the chain rule in integration.", "Replace an inside expression and its derivative with u and du.", "u-substitution", "int f(g(x))g'(x) dx = int f(u) du", [["u", "inside expression"], ["du", "derivative part"]], ["DU_MISSING", "Changing u but not changing dx into du.", "Transform the matching derivative part too."], [["Scaled growth", "A nested rate needs an inside change."], ["Motion", "Changing variables can simplify time formulas."], ["Physics", "Energy integrals often use substitution."]]),
  313: entry("Integration by Parts", "integration-by-parts", "Integration by parts reverses the product rule.", "Choose u and dv, then use uv minus integral v du.", "Parts formula", "int u dv = uv - int v du", [["u", "chosen factor"], ["dv", "remaining differential"]], ["SIGN_ERROR", "Forgetting the minus sign in the formula.", "Use uv minus the new integral."], [["Work problems", "Products of distance and force can appear."], ["Probability", "Expected values may use products."], ["Signals", "Damping times waves often need parts."]]),
  314: entry("Partial Fractions", "partial-fractions", "Partial fractions split a rational function into simpler fractions.", "Factor the denominator, then match simpler fraction forms.", "Partial fractions", "P(x)/Q(x)=A/(x-a)+B/(x-b)", [["P,Q", "polynomials"], ["A,B", "constants"]], ["NO_FACTOR", "Splitting before factoring the denominator.", "Factor first, then choose the fraction pattern."], [["Circuit response", "Rational functions split into simpler signals."], ["Control systems", "Transfer functions use partial fractions."], ["Algebra checks", "Combined fractions can be reversed."]]),
  315: entry("Improper Integrals", "improper-integrals", "An improper integral has an infinite limit or an unbounded function.", "Replace the improper part with a limit.", "Improper integral", "int_a^infty f(x) dx = lim_{b->infty} int_a^b f(x) dx", [["b", "moving endpoint"], ["f(x)", "integrand"]], ["IGNORE_LIMIT", "Treating infinity like an ordinary endpoint.", "Use a limit and check convergence."], [["Long-tail probability", "Density can extend forever."], ["Gravity models", "Effects may continue over large distances."], ["Cooling", "A process may approach a limit over time."]]),
  316: entry("Numerical Integration", "numerical-integration", "Numerical integration estimates integrals when exact work is hard.", "Use a rule such as trapezoids or Simpson's rule with small steps.", "Trapezoid rule", "A approx (Delta x/2)(y_0+2y_1+...+y_n)", [["Delta x", "step width"], ["y_i", "sample values"]], ["EXACT_CLAIM", "Calling a numerical estimate exact.", "State the method, step size, and approximation."], [["Sensor data", "Samples estimate total energy."], ["Medicine", "Drug concentration over time gives exposure."], ["Travel", "Speed samples estimate distance."]]),
  317: entry("Volume by Slicing", "volume-by-slicing", "Volume by slicing adds thin cross-section areas.", "Integrate cross-section area A(x) along the object.", "Slicing volume", "V=int_a^b A(x) dx", [["A(x)", "cross-section area"], ["x", "slice position"]], ["HEIGHT_ONLY", "Integrating a length when area is required.", "Use cross-section area, not just height."], [["Loaf slices", "Slice areas add into loaf volume."], ["Medical scans", "Image slices estimate organ volume."], ["Reservoirs", "Cross-sections estimate stored water."]]),
  318: entry("Disc and Washer Methods", "disc-and-washer-methods", "Disc and washer methods find volumes of revolution.", "Square radii and multiply by pi before integrating.", "Washer volume", "V=pi int_a^b (R^2-r^2) dx", [["R", "outer radius"], ["r", "inner radius"]], ["NO_SQUARE", "Using radius difference without squaring.", "Subtract squared radii: R^2-r^2."], [["Vases", "Rotated curves model round containers."], ["Pipes", "Washers describe hollow solids."], ["Machine parts", "Turned shapes have revolution volume."]]),
  319: entry("Shell Method", "shell-method", "The shell method adds thin cylindrical shells.", "Use circumference times height times thickness.", "Shell volume", "V=2pi int radius height dx", [["radius", "distance to axis"], ["height", "shell height"]], ["WRONG_RADIUS", "Using the curve height as the shell radius.", "Radius is distance from the rotation axis."], [["Cans", "Thin metal shells build a cylinder."], ["Lathe work", "Shells model turned solids."], ["Tank design", "Cylindrical layers estimate volume."]]),
  320: entry("Arc Length", "arc-length", "Arc length measures the length of a curved graph.", "Add tiny straight pieces and take the limiting sum.", "Arc length", "L=int_a^b sqrt(1+(dy/dx)^2) dx", [["dy/dx", "slope"], ["a,b", "endpoints"]], ["X_DISTANCE", "Using only b-a as curved length.", "Include slope using the arc length formula."], [["Road design", "Curved roads need true length."], ["Cable length", "Sagging cable length exceeds horizontal span."], ["3D printing", "Tool paths follow curves."]]),
  321: entry("Surface Area of Revolution", "surface-area-of-revolution", "Surface area of revolution measures the skin made by rotating a curve.", "Use circumference times tiny arc length.", "Surface area", "S=2pi int_a^b radius sqrt(1+(dy/dx)^2) dx", [["radius", "distance to axis"], ["dy/dx", "slope"]], ["VOLUME_CONFUSION", "Using a volume formula for surface area.", "Surface area uses circumference times arc length."], [["Bottle labels", "Outer surface area matters for wrapping."], ["Domes", "Rotated curves model shells."], ["Manufacturing", "Coating area uses surface area."]]),
  322: entry("Accumulation Functions", "accumulation-functions", "An accumulation function stores area from a fixed start to x.", "Changing x changes the upper limit of the integral.", "Accumulation function", "A(x)=int_a^x f(t) dt", [["a", "start"], ["x", "moving endpoint"]], ["FIXED_OUTPUT", "Thinking the accumulated value is constant.", "It changes as the upper limit x moves."], [["Water tank", "Accumulated inflow changes with time."], ["Battery charge", "Current accumulates into charge."], ["Distance", "Velocity accumulates into position change."]]),
  323: entry("Direction Fields", "direction-fields", "A direction field shows tiny slope marks for a differential equation.", "At each point, draw the slope given by dy/dx.", "Differential equation", "dy/dx=f(x,y)", [["x,y", "point"], ["f", "slope rule"]], ["SOLUTIONS_ONLY", "Thinking a field is one solution curve.", "The field shows slopes for many possible solutions."], [["Wind maps", "Arrows show local direction."], ["Population models", "Slope marks show growth trends."], ["Cooling", "Temperature change depends on current state."]]),
  324: entry("Euler's Method", "euler-s-method", "Euler's method estimates a solution using short tangent steps.", "Start at a known point and step using y_new=y+h f(x,y).", "Euler step", "y_{n+1}=y_n+h f(x_n,y_n)", [["h", "step size"], ["f", "slope rule"]], ["BIG_STEP", "Trusting large steps as accurate.", "Smaller steps usually reduce error."], [["Motion simulation", "Small time steps update position."], ["Cooling estimate", "Temperature changes step by step."], ["Finance", "Balances can update in short steps."]]),
  325: entry("Separable Equations", "separable-equations", "A separable equation can put y terms on one side and x terms on the other.", "Separate variables, then integrate both sides.", "Separable form", "g(y) dy = f(x) dx", [["g(y)", "y-side"], ["f(x)", "x-side"]], ["MIXED_VARIABLES", "Integrating before separating variables.", "Separate x and y parts first."], [["Population growth", "Rate can depend on current population."], ["Cooling", "Temperature difference can be separated."], ["Chemistry", "Reaction rates may be separable."]]),
  326: entry("First-Order Linear Equations", "first-order-linear-equations", "A first-order linear equation has y' plus a function times y.", "Use an integrating factor to make the left side a product derivative.", "Linear ODE", "y'+p(x)y=q(x)", [["p(x)", "coefficient"], ["q(x)", "source term"]], ["NO_FACTOR", "Solving as if p(x)y were absent.", "Use the integrating factor when p(x) is present."], [["Mixing tanks", "Input and output create linear models."], ["Circuits", "RC circuits follow first-order equations."], ["Cooling with forcing", "Outside temperature can act as q(x)."]]),
  327: entry("Logistic Growth", "logistic-growth", "Logistic growth rises fast, then slows near a carrying capacity.", "Growth rate is proportional to population and remaining capacity.", "Logistic equation", "dP/dt=rP(1-P/K)", [["r", "growth rate"], ["K", "carrying capacity"]], ["EXP_FOREVER", "Thinking logistic growth keeps increasing exponentially forever.", "It levels off near K."], [["Populations", "Food limits growth."], ["Rumour spread", "Fewer new people remain later."], ["Product adoption", "Markets can saturate."]]),
  328: entry("Second-Order Equations", "second-order-equations", "A second-order equation involves a second derivative.", "It models how a rate of change itself changes.", "Second-order ODE", "y''+ay'+by=g(x)", [["y''", "second derivative"], ["g(x)", "forcing term"]], ["ONE_INITIAL", "Using only one starting condition.", "Second-order equations usually need two initial conditions."], [["Springs", "Acceleration depends on position and damping."], ["Circuits", "RLC circuits use second derivatives."], ["Bridges", "Vibration models use acceleration."]]),
  329: entry("Phase Plane", "phase-plane", "A phase plane plots two state variables against each other.", "Trajectories show how a system moves through states.", "System form", "dx/dt=f(x,y), dy/dt=g(x,y)", [["x,y", "state variables"], ["f,g", "rate rules"]], ["TIME_AXIS", "Reading the phase plane as time on the horizontal axis.", "Axes are state variables; time is traced along curves."], [["Predator-prey", "Two populations form state points."], ["Pendulum", "Position and velocity make a phase path."], ["Epidemics", "Susceptible and infected counts move together."]]),
  330: entry("Equilibrium and Stability", "equilibrium-and-stability", "An equilibrium is a state where change is zero.", "Stability tells whether nearby states move back or away.", "Equilibrium", "f(x*)=0", [["x*", "equilibrium state"], ["f", "rate rule"]], ["ZERO_VALUE", "Thinking equilibrium means the state value must be zero.", "The rate is zero; the state may be nonzero."], [["Thermostat", "Temperature can settle near a target."], ["Population", "Birth and death can balance."], ["Markets", "Supply and demand can balance."]]),
  331: entry("Discrete Dynamical Systems", "discrete-dynamical-systems", "A discrete dynamical system updates in steps.", "Use a rule to get the next state from the current state.", "Iteration", "x_{n+1}=f(x_n)", [["x_n", "current state"], ["f", "update rule"]], ["CONTINUOUS_TIME", "Treating step updates like smooth time.", "Discrete systems jump from one step to the next."], [["Savings", "Monthly interest updates a balance."], ["Games", "A score changes turn by turn."], ["Population", "Yearly counts update in steps."]]),
  332: entry("Cobweb Diagrams", "cobweb-diagrams", "A cobweb diagram visualises iteration of x_{n+1}=f(x_n).", "Move up to the curve, then across to y=x, and repeat.", "Cobweb iteration", "x_{n+1}=f(x_n)", [["x_n", "current value"], ["f", "update function"]], ["SKIP_DIAGONAL", "Jumping curve to curve without using y=x.", "Use the diagonal to feed output back as input."], [["Population maps", "Generations update one by one."], ["Loan recurrence", "Balances feed into next month."], ["Algorithms", "Repeated estimates can converge."]]),
  333: entry("Chaos and Bifurcation", "chaos-and-bifurcation", "Chaos means tiny input changes can cause very different long-term behaviour.", "A bifurcation diagram shows how outcomes change as a parameter changes.", "Logistic map", "x_{n+1}=r x_n(1-x_n)", [["r", "parameter"], ["x_n", "current state"]], ["RANDOM", "Thinking chaos means no rule exists.", "Chaotic systems follow rules but are very sensitive."], [["Weather", "Small changes can affect forecasts."], ["Population maps", "A parameter can create cycles or chaos."], ["Engineering", "Nonlinear systems can become unstable."]]),
};

export function seed(id: keyof typeof entries) {
  return { id, ...entries[id] };
}

export type IntegralSeed = ReturnType<typeof seed>;

export function integralLesson(seedData: IntegralSeed): StrengthenedLesson {
  const code = seedData.misconception[0];
  return {
    id: seedData.id,
    title: seedData.title,
    route: `/lessons/calculus/${seedData.id}-${seedData.slug}`,
    category: "Calculus",
    topic: "Integral Calculus and Differential Equations",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${seedData.title}.`, `Use the accepted rule: ${seedData.keyRule}`, `Correct a common ${seedData.title} mistake.`],
    prerequisites: ["Functions", "Graphs", "Algebra", "Limits"],
    keyVocabulary: [{ term: seedData.title, meaning: seedData.definition }, { term: "Accumulation", meaning: "A total built from many small changes." }],
    introduction: `${seedData.title} studies totals, change, or system motion. It matters in distance, area, growth, design, and science models.`,
    basicIdea: `${seedData.definition} The key rule is: ${seedData.keyRule} A common mistake is ${seedData.misconception[1]}`,
    howItWorks: "Choose the interval or starting state. Build the small pieces or local steps. Add, integrate, or iterate them according to the lesson rule.",
    whyItWorks: "Calculus replaces a hard curved or changing process with many tiny simple pieces, then takes the limiting or repeated result.",
    definitions: [{ id: `${seedData.id}-definition`, statement: seedData.definition }],
    facts: [{ id: `${seedData.id}-fact`, statement: seedData.keyRule }],
    formulas: [{ id: `${seedData.id}-formula`, label: seedData.formulaLabel, expression: seedData.formulaExpression, variables: seedData.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Check endpoints, domain, and units.", "For infinite or repeated processes, check convergence or long-term behaviour."],
    representations: [{ id: `${seedData.id}-graph`, type: "function_graph", learningPurpose: `Show the visual behaviour for ${seedData.title}.` }],
    workedExamples: [{ id: `${seedData.id}-worked-1`, prompt: `State the core check for ${seedData.title}.`, steps: ["Identify the quantities.", `Apply: ${seedData.keyRule}`, "Check the common mistake."], answer: seedData.misconception[2] }],
    realLifeExamples: seedData.examples.map(([context, connection], index) => ({ id: `${seedData.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seedData.misconception[1], correction: seedData.misconception[2] }],
    interaction: {
      id: `${seedData.id}-interaction`,
      learningPurpose: `Use sliders and the graph to connect ${seedData.title} with its formula.`,
      parameters: [{ id: "x", label: "Input or endpoint", validRange: [-4, 4] }, { id: "h", label: "Step or partition size", validRange: [0.05, 2] }],
      initialState: `Start by reading ${seedData.formulaLabel}.`,
      dynamicFeedback: "The graph, rectangle or secant display, and symbolic result update together.",
      successCriteria: ["Read the visual model", "Connect it to the formula", "Explain the misconception"],
      accessibilityAlternative: "Provide formula, graph value, and computed result as text.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict what changes when the step size changes." }, { id: "observe", prompt: "Move the control and read the updated value." }, { id: "explain", prompt: `Explain using ${seedData.formulaLabel}.` }],
    practice: [
      practice(`${seedData.id}-recognition`, `Name the key rule for ${seedData.title}.`, seedData.keyRule, code, "recognition"),
      practice(`${seedData.id}-direct`, `What common mistake should you avoid in ${seedData.title}?`, seedData.misconception[1], code, "direct"),
      practice(`${seedData.id}-multi`, `State the correction for ${seedData.title}.`, seedData.misconception[2], code, "multi_step"),
      practice(`${seedData.id}-error`, `What is wrong with this mistake: ${seedData.misconception[1]}`, seedData.misconception[2], code, "error_diagnosis"),
      practice(`${seedData.id}-transfer`, `Give one real use of ${seedData.title}.`, seedData.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seedData.id}-challenge`, prompt: `Explain ${seedData.title} using the displayed formula.`, successCriteria: ["Names the rule", "Uses the formula meaning", "Avoids the common mistake"], hints: [`Use ${seedData.formulaLabel}.`, seedData.misconception[2]] },
    exitCheck: [{ id: `${seedData.id}-exit`, prompt: `State one exact check for ${seedData.title}.`, answer: seedData.misconception[2], criterion: "Names the accepted calculus rule." }],
    accessibilityNotes: ["Announce graph values and symbolic results.", "Do not rely only on colour to show area or direction."],
    expertReviewRequired: false,
  };
}

export function integralChallenge(seedData: IntegralSeed): IntegralChallenge {
  return { prompt: `State the key rule for ${seedData.title}.`, expected: seedData.keyRule, hint: `Use ${seedData.formulaLabel}.`, kind: "keywords", factoryId: `integral.${seedData.slug}` };
}

function entry(title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], examples: [string, string][]): Entry {
  return { title, slug, definition, keyRule, formulaLabel, formulaExpression, variables, misconception, examples };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check the quantities.", "Use the displayed formula.", "Avoid the named mistake."], workedSolution: ["Identify the lesson idea.", "Apply the rule.", "Check the units or state."], misconceptionTag, difficulty, parameterConstraints: ["Use values where the graph and formula are defined."] };
}
