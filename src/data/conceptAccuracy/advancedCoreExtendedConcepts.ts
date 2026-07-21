import { compactConcept } from "./conceptFactory";

export const advancedCoreExtendedConcepts = [
  compactConcept({
    id: "trigonometry.eclipse-model",
    domain: "trigonometry",
    title: "Eclipse geometry and angular size",
    level: "Advanced",
    precise:
      "An eclipse model compares the angular radii and center separation of apparent disks; similar triangles relate physical size and distance.",
    learner:
      "An eclipse occurs when one apparent disk overlaps another along the observer's line of sight.",
    prerequisites: ["similar triangles", "inverse tangent", "circles"],
    nextConcepts: ["astronomy", "spherical geometry"],
    grade: "10-12 enrichment",
    chapter: "Applications of Trigonometry",
    notation: [
      { symbol: "α", meaning: "angular radius" },
      { symbol: "R", meaning: "physical radius" },
      { symbol: "d", meaning: "observer distance" },
    ],
    assumptions: [
      "Bodies are modeled as circular disks in the sky plane.",
      "Distances are from observer to body center.",
      "Atmospheric refraction is ignored.",
    ],
    domainStatement: "R≥0 and d>R for an external observer; separation δ≥0.",
    formula: "\\alpha=\\arcsin(R/d)",
    formulaConditions: [
      "spherical body",
      "observer outside body",
      "radians unless converted",
    ],
    invariants: [
      "No overlap when δ≥α₁+α₂.",
      "Full containment when δ≤|α₁-α₂|.",
    ],
    oracle:
      "Compute angular radii, then use two-circle overlap classification in angular coordinates.",
    tolerance: 1e-9,
    properties: [
      "apparent size decreases with distance",
      "equal angular radii at zero separation give total coincidence",
    ],
    cases: {
      foundational: [
        "If R/d=0.01, estimate angular radius.",
        "About 0.01 rad",
        "For small angles, arcsin u≈u.",
      ],
      visual: [
        "Centers coincide and Moon angular radius exceeds Sun's.",
        "Total solar eclipse",
        "The foreground disk fully covers the background disk.",
      ],
      realWorld: [
        "Why can Moon and Sun appear similar in size?",
        "Their radius-to-distance ratios are similar",
        "Angular size depends on R/d, not physical radius alone.",
      ],
      misconception: [
        "Is every alignment a total eclipse?",
        "No",
        "Disk size and center separation determine partial, annular, or total overlap.",
      ],
      boundary: [
        "δ=α₁+α₂.",
        "External tangency",
        "The disks touch at one point with zero overlap area.",
      ],
      challenge: [
        "Foreground α=0.25°, background α=0.27°, δ=0.",
        "Annular eclipse",
        "The smaller foreground disk is centered inside the larger disk.",
      ],
      connection: [
        "Connect angular size to similarity.",
        "For small α, R/d≈α",
        "The tangent/sine geometry becomes a similar-triangle ratio.",
      ],
    },
    misconceptions: [
      {
        claim: "The physically larger object always looks larger.",
        correction:
          "Apparent angular size depends on size divided by distance.",
        counterexample:
          "The Sun is far larger than the Moon but their apparent sizes are close.",
      },
      {
        claim: "Perfect center alignment guarantees totality.",
        correction:
          "The foreground angular radius must also be at least as large.",
        counterexample:
          "A smaller centered foreground disk produces an annular ring.",
      },
    ],
    sourceSection: "Applications of Trigonometry",
  }),
  compactConcept({
    id: "calculus.derivative-rules",
    domain: "calculus",
    title: "Derivative rules",
    level: "Advanced",
    precise:
      "Linearity, product, quotient, and chain rules derive new derivatives from differentiable component functions.",
    learner:
      "Differentiate combinations by respecting how sums, products, quotients, and nested functions change.",
    prerequisites: ["derivative definition", "functions"],
    nextConcepts: ["implicit differentiation", "differential equations"],
    grade: "11-12",
    chapter: "Continuity and Differentiability",
    notation: [
      { symbol: "f'(x)", meaning: "derivative" },
      { symbol: "d/dx", meaning: "differentiation operator" },
    ],
    assumptions: [
      "Component derivatives exist at the point.",
      "Quotient denominator is nonzero.",
    ],
    domainStatement:
      "Use each rule only where all component functions and required derivatives are defined.",
    formula: "(f\\circ g)'(x)=f'(g(x))g'(x)",
    formulaConditions: ["g differentiable at x", "f differentiable at g(x)"],
    invariants: [
      "Derivative units are output units per input unit.",
      "Equivalent expressions yield equal derivatives on shared domains.",
    ],
    oracle:
      "Compare symbolic rule result with high-accuracy central differences away from singularities.",
    tolerance: 1e-5,
    properties: ["derivative is linear", "product derivative has two terms"],
    cases: {
      foundational: [
        "Differentiate 3x⁴-2x.",
        "12x³-2",
        "Use linearity and power rule.",
      ],
      visual: [
        "How does derivative of x² shift under x→x-2?",
        "2(x-2)",
        "The slope field shifts horizontally with the graph.",
      ],
      realWorld: [
        "Area A=πr² and r changes with time.",
        "dA/dt=2πr dr/dt",
        "Apply the chain rule.",
      ],
      misconception: ["Is (fg)'=f'g'?", "No", "Product rule is f'g+fg'."],
      boundary: ["Differentiate a constant.", "0", "It has no change."],
      challenge: [
        "Differentiate sin(x²).",
        "2x cos(x²)",
        "Outer cosine times inner derivative 2x.",
      ],
      connection: [
        "Connect chain rule to units.",
        "dy/dt=(dy/du)(du/dt)",
        "Intermediate units cancel.",
      ],
    },
    misconceptions: [
      {
        claim: "The derivative of a product is the product of derivatives.",
        correction: "Use f'g+fg'.",
        counterexample:
          "For x·x, the false rule gives 1 but the derivative is 2x.",
      },
      {
        claim: "Chain rule only differentiates the outside.",
        correction: "Multiply by the inner derivative.",
        counterexample: "d/dx (3x+1)²=6(3x+1), not 2(3x+1).",
      },
    ],
    sourceSection: "Continuity and Differentiability",
  }),
  compactConcept({
    id: "calculus.derivative-applications",
    domain: "calculus",
    title: "Applications of derivatives and optimization",
    level: "Advanced",
    precise:
      "Derivative sign classifies local change; extrema candidates occur at critical points and constrained boundaries.",
    learner:
      "Use slope to find where a quantity rises, falls, or reaches a best feasible value.",
    prerequisites: ["derivatives", "inequalities"],
    nextConcepts: ["optimization", "curve sketching"],
    grade: "12",
    chapter: "Applications of Derivatives",
    notation: [
      { symbol: "f'(x)", meaning: "rate and monotonicity" },
      { symbol: "f''(x)", meaning: "concavity test" },
    ],
    assumptions: [
      "The feasible domain is stated.",
      "All critical points and relevant boundaries are tested.",
    ],
    domainStatement:
      "Optimization occurs over a specified feasible subset of the function domain.",
    formula: "f'(c)=0",
    formulaConditions: [
      "necessary for an interior differentiable local extremum, not sufficient",
    ],
    invariants: [
      "Global candidate list includes feasible endpoints.",
      "f'>0 means locally increasing.",
    ],
    oracle:
      "Find derivative zeros/undefined points, include boundaries, and compare objective values.",
    tolerance: 1e-8,
    properties: [
      "sign change + to - gives local maximum",
      "second derivative test is inconclusive when f''=0",
    ],
    cases: {
      foundational: [
        "Find vertex minimum of x²-4x+7.",
        "3 at x=2",
        "f'=2x-4=0 and parabola opens up.",
      ],
      visual: [
        "Where f' changes - to +.",
        "Local minimum",
        "Graph switches from falling to rising.",
      ],
      realWorld: [
        "Maximize rectangle area with perimeter 20.",
        "Square 5×5, area 25",
        "A=x(10-x) peaks at x=5.",
      ],
      misconception: [
        "Does f'=0 always mean extremum?",
        "No",
        "x³ has f'(0)=0 but no extremum.",
      ],
      boundary: [
        "Maximize f(x)=x on [0,1].",
        "1 at endpoint x=1",
        "Endpoints must be checked.",
      ],
      challenge: [
        "Minimize x+9/x for x>0.",
        "6 at x=3",
        "Derivative 1-9/x²=0 and sign changes.",
      ],
      connection: [
        "Connect second derivative to curvature.",
        "f''>0 means concave up",
        "Slopes are increasing.",
      ],
    },
    misconceptions: [
      {
        claim: "Every critical point is a maximum or minimum.",
        correction: "It is only a candidate.",
        counterexample: "x³ has a stationary inflection at 0.",
      },
      {
        claim: "Endpoints never matter.",
        correction: "They can be global extrema on closed intervals.",
        counterexample: "f(x)=x on [0,1] is maximized at 1.",
      },
    ],
    sourceSection: "Applications of Derivatives",
  }),
  compactConcept({
    id: "calculus.area-between-curves",
    domain: "calculus",
    title: "Area between curves",
    level: "Advanced",
    precise:
      "Signed vertical separation integrates as top minus bottom; geometric area requires splitting where the order changes or using absolute difference.",
    learner:
      "Find where curves meet, then add nonnegative strips between the upper and lower graph.",
    prerequisites: ["definite integration", "intersections"],
    nextConcepts: ["volumes", "double integrals"],
    grade: "12",
    chapter: "Applications of Integrals",
    notation: [
      { symbol: "A", meaning: "geometric area", unit: "square units" },
    ],
    assumptions: [
      "Curves are integrable on the interval.",
      "Intersection points partition changes in ordering.",
    ],
    domainStatement: "Both functions are real and integrable on [a,b].",
    formula: "A=\\int_a^b|f(x)-g(x)|\\,dx",
    formulaConditions: ["f and g integrable on [a,b]"],
    invariants: [
      "Geometric area is nonnegative.",
      "Swapping curve names does not change area.",
    ],
    oracle:
      "Locate intersections, partition interval, and compare adaptive quadrature of absolute difference.",
    tolerance: 1e-7,
    properties: ["signed cancellations are removed", "units are squared"],
    cases: {
      foundational: [
        "Area between y=x and y=x² on [0,1].",
        "1/6",
        "x≥x² there; integrate x-x².",
      ],
      visual: [
        "Curves cross inside interval.",
        "Split at each crossing",
        "The upper curve changes.",
      ],
      realWorld: [
        "Compare two velocity graphs.",
        "Area of absolute difference is accumulated distance discrepancy",
        "Each strip is velocity difference times time.",
      ],
      misconception: [
        "Can signed integral always be called area?",
        "No",
        "Positive and negative regions may cancel.",
      ],
      boundary: [
        "Identical curves.",
        "Area 0",
        "Their separation is zero everywhere.",
      ],
      challenge: [
        "Area between y=x and y=x³ on [-1,1].",
        "1/2",
        "Use symmetry and split at -1,0,1.",
      ],
      connection: [
        "Connect to average separation.",
        "A/(b-a)",
        "Area divided by interval length is mean absolute vertical gap.",
      ],
    },
    misconceptions: [
      {
        claim: "Always integrate f-g without checking order.",
        correction: "Use top-bottom on partitions or absolute difference.",
        counterexample: "x and x³ swap order across 0 on [-1,1].",
      },
      {
        claim: "Intersection points do not matter.",
        correction: "They mark possible order changes.",
        counterexample: "Ignoring a crossing can cancel positive area.",
      },
    ],
    sourceSection: "Applications of Integrals",
  }),
  compactConcept({
    id: "calculus.differential-equations",
    domain: "calculus",
    title: "Differential equations and slope fields",
    level: "Advanced",
    precise:
      "A differential equation constrains a function through its derivatives; a solution function satisfies the relation throughout an interval.",
    learner:
      "A slope field assigns a direction at each point, and solution curves follow those directions.",
    prerequisites: ["derivatives", "integration"],
    nextConcepts: ["dynamical systems", "numerical methods"],
    grade: "12 enrichment",
    chapter: "Differential Equations",
    notation: [
      { symbol: "dy/dx", meaning: "solution slope" },
      { symbol: "y(x)", meaning: "unknown function" },
    ],
    assumptions: [
      "The differential equation and initial condition are defined locally.",
      "Numerical step size is stated.",
    ],
    domainStatement:
      "A solution interval excludes singularities and must contain the initial point for an IVP.",
    formula: "y_{n+1}=y_n+h f(x_n,y_n)",
    formulaConditions: ["Euler approximation to y'=f(x,y)", "step h"],
    invariants: [
      "Exact solutions satisfy residual y'-f(x,y)=0.",
      "A numerical path uses the displayed local slope.",
    ],
    oracle:
      "Differentiate candidate solutions for residual; compare Euler refinements against exact or high-order reference.",
    tolerance: 1e-5,
    properties: [
      "smaller Euler steps usually reduce global error in smooth problems",
      "initial conditions select a particular solution",
    ],
    cases: {
      foundational: [
        "Solve y'=2x with y(0)=1.",
        "y=x²+1",
        "Integrate 2x and use the initial value.",
      ],
      visual: [
        "Slope field for y'=y along y=0.",
        "Horizontal segments",
        "The assigned slope is zero.",
      ],
      realWorld: [
        "Population y'=ky.",
        "y=y₀e^(kt)",
        "Growth rate proportional to current population yields exponential growth.",
      ],
      misconception: [
        "Is a slope-field segment a solution curve?",
        "No",
        "It only shows a local direction.",
      ],
      boundary: [
        "For y'=y and y(0)=0.",
        "y=0",
        "The zero solution satisfies both equation and initial value.",
      ],
      challenge: [
        "Euler y'=y, y(0)=1, h=0.5 for two steps.",
        "y₂=2.25",
        "1→1.5→2.25.",
      ],
      connection: [
        "Connect equilibrium to algebra.",
        "Solve f(x,y)=0 for zero slopes",
        "Equilibria remain constant in autonomous systems.",
      ],
    },
    misconceptions: [
      {
        claim: "Any antiderivative solves an initial-value problem.",
        correction: "The initial condition fixes the integration constant.",
        counterexample: "y=x²+C solves y'=2x, but y(0)=1 requires C=1.",
      },
      {
        claim: "Euler's method is exact.",
        correction: "It is generally an approximation with step-size error.",
        counterexample: "For y'=y, one step h=1 gives 2 instead of e.",
      },
    ],
    sourceSection: "Differential Equations",
  }),
];
