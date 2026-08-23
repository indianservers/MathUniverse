import type { LessonContent, LessonDefinition, LessonFormula, LessonSourceDefinition } from "../types";
import { getStrengthenedLessonContent } from "../strengthening/foundationNumberContent";

type ContentSource = LessonSourceDefinition & Partial<Pick<LessonDefinition, "contract" | "preset">>;

const adapterFormulas: Record<LessonSourceDefinition["adapter"], LessonFormula[]> = {
  calculator: [
    formula("Order of operations", "a+b\\times c=a+(b\\times c)", "Multiplication and division are evaluated before addition and subtraction unless brackets change the grouping."),
    formula("Percentage", "p\\%\\ of\\ x=\\frac{p}{100}x", "Percent means parts per hundred, so convert it to a fraction or decimal before calculating."),
  ],
  algebra: [
    formula("Linear function", "f(x)=mx+b", "The slope m controls steepness and the intercept b shifts the graph vertically."),
    formula("Solve a linear equation", "ax+b=c\\Rightarrow x=\\frac{c-b}{a}", "Undo addition or subtraction first, then divide by the coefficient of x."),
  ],
  number: [
    formula("Fraction value", "\\frac{a}{b}=a\\div b", "A fraction is division by a non-zero denominator."),
    formula("GCD and LCM", "ab=\\gcd(a,b)\\cdot\\operatorname{lcm}(a,b)", "For positive integers, common factors and common multiples are linked by this product."),
  ],
  authoring: [
    formula("Input-output rule", "output=f(input)", "A lesson control is meaningful when each input has a predictable effect on the preview."),
    formula("Feedback loop", "prediction\\rightarrow action\\rightarrow observation\\rightarrow revision", "Interactive authoring turns a static explanation into a testable learning cycle."),
  ],
  learning: [
    formula("Learning cycle", "predict\\rightarrow test\\rightarrow explain", "State an expectation, change the model, and explain the difference between prediction and observation."),
    formula("Mastery estimate", "mastery=\\frac{correct\\ checks}{total\\ checks}", "Repeated checks give a simple signal of learning progress."),
  ],
  platform: [
    formula("Scale factor", "new\\ size=scale\\times original\\ size", "Zoom and responsive layout preserve relationships by multiplying dimensions by a shared scale."),
    formula("Accessible state", "control\\ state\\leftrightarrow visual\\ state\\leftrightarrow text\\ summary", "A robust interaction exposes the same mathematical state visually and textually."),
  ],
  graph: [
    formula("Function notation", "y=f(x)", "Each input x is mapped to an output y shown on the graph and in the table."),
    formula("Transformation", "y=a f(x)+b", "The multiplier a stretches or reflects the graph; b shifts it up or down."),
  ],
  "algebra-cas": [
    formula("Equivalent expressions", "A=B\\iff A-B=0", "CAS checks symbolic equality by simplifying the difference or applying valid algebraic steps."),
    formula("Substitution", "f(c)=f(x)|_{x=c}", "Replace the variable with the chosen value, then simplify."),
  ],
  geometry2d: [
    formula("Distance", "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", "Point movement changes lengths according to horizontal and vertical differences."),
    formula("Area of triangle", "A=\\frac12 bh", "A triangle occupies half of a rectangle or parallelogram with the same base and height."),
  ],
  vector: [
    formula("Vector magnitude", "\\|v\\|=\\sqrt{x^2+y^2}", "Magnitude is the length of the arrow from its components."),
    formula("Dot product", "u\\cdot v=u_xv_x+u_yv_y", "The dot product measures alignment; it is positive for similar directions and negative for opposite directions."),
  ],
  trigonometry: [
    formula("Unit circle", "(\\cos\\theta,\\sin\\theta)", "The x-coordinate gives cosine and the y-coordinate gives sine."),
    formula("Tangent ratio", "\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}", "Tangent compares the vertical and horizontal coordinates when cosine is not zero."),
  ],
  cas: [
    formula("Symbolic simplification", "simplify(A-B)=0\\Rightarrow A=B", "Exact algebra keeps structure, restrictions, and steps visible."),
    formula("Derivative operator", "\\frac{d}{dx}x^n=nx^{n-1}", "CAS transformations follow algebraic rules instead of decimal approximation."),
  ],
  calculus: [
    formula("Derivative", "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", "The derivative is the limiting slope of secant lines as the two points merge."),
    formula("Definite integral", "\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{i=1}^{n}f(x_i)\\Delta x", "Accumulated area is the limit of many thin rectangle sums."),
  ],
  spreadsheet: [
    formula("Cell formula", "=f(cell\\ values)", "A spreadsheet formula recalculates when referenced cells change."),
    formula("Mean", "\\bar{x}=\\frac{x_1+x_2+\\cdots+x_n}{n}", "The average balances all values into one representative value."),
  ],
  statistics: [
    formula("Mean", "\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i", "Mean measures the center by sharing the total equally."),
    formula("Range", "range=max-min", "Range measures spread by comparing the largest and smallest values."),
  ],
  probability: [
    formula("Classical probability", "P(A)=\\frac{favourable\\ outcomes}{total\\ equally\\ likely\\ outcomes}", "Probability compares the target outcomes with the full sample space."),
    formula("Experimental probability", "\\hat{P}(A)=\\frac{successes}{trials}", "Simulation estimates probability from repeated trials."),
  ],
  inference: [
    formula("Standard error", "SE=\\frac{s}{\\sqrt{n}}", "Larger samples usually reduce sampling variability."),
    formula("Confidence interval", "estimate\\pm critical\\ value\\times SE", "Intervals combine a sample estimate with uncertainty from repeated sampling."),
  ],
  sequence: [
    formula("Arithmetic sequence", "a_n=a_1+(n-1)d", "A constant difference d is added from one term to the next."),
    formula("Geometric sequence", "a_n=a_1r^{n-1}", "A constant ratio r multiplies one term to get the next."),
  ],
  matrix: [
    formula("2 by 2 determinant", "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc", "The determinant measures signed area scaling and invertibility for a 2D transformation."),
    formula("Matrix-vector product", "Av=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}", "A matrix transforms a vector by combining its components into a new vector."),
  ],
  complex: [
    formula("Complex modulus", "|a+bi|=\\sqrt{a^2+b^2}", "The modulus is the distance from the origin in the complex plane."),
    formula("Polar form", "z=r(\\cos\\theta+i\\sin\\theta)", "Polar form separates size r from direction theta."),
  ],
  geometry3d: [
    formula("Volume of prism", "V=Bh", "A prism volume is base area multiplied by perpendicular height."),
    formula("Surface area", "SA=sum\\ of\\ face\\ areas", "Surface area adds all exposed faces of a solid."),
  ],
  discrete: [
    formula("Counting combinations", "\\binom{n}{r}=\\frac{n!}{r!(n-r)!}", "Combinations count selections where order does not matter."),
    formula("Power set size", "|P(S)|=2^{|S|}", "Each element is either included or excluded from a subset."),
  ],
  finance: [
    formula("Simple interest", "I=Prt", "Principal P earns interest at decimal rate r for time t."),
    formula("Amount", "A=P+I=P(1+rt)", "The final amount is the original principal plus interest."),
  ],
};

export function createLessonContent(lesson: ContentSource): LessonContent {
  const strengthened = getStrengthenedLessonContent(lesson);
  if (strengthened) return normalizeStrengthenedContent(lesson, strengthened);
  const titleTopic = `${lesson.title} ${lesson.topic}`.toLowerCase();
  const formulas = formulasFor(titleTopic, lesson.adapter);
  const controlGuide = controlGuideFor(lesson);
  const examples = examplesFor(lesson);
  const detailedExplanation = detailedExplanationFor(lesson, formulas);
  return {
    summary: `${lesson.title} is a ${lesson.topic.toLowerCase()} lesson about ${lesson.purpose.toLowerCase()} The live ${lesson.workspace.toLowerCase()} lets you connect the concept, its representation, and the final answer in one place.`,
    explanation: `Introduction: ${lesson.title} starts from ${lesson.description.toLowerCase()} Detailed explanation: ${detailedExplanation} In the live task, ${lesson.interactions.toLowerCase()}; use that action to connect ${listRepresentations(lesson)} with ${listOutputs(lesson)} before answering.`,
    keyIdeas: [
      lesson.description,
      `Watch how ${listOutputs(lesson)} change together; those linked changes are the main evidence for the concept.`,
      `Read the model in this order: identify the given values, change one control, observe the linked representation, then explain the rule in words.`,
      `Use the lesson challenge after exploring so the formula, visual model, and calculation agree.`,
    ],
    realWorldExamples: examples,
    controlGuide,
    formulas,
    workedConnection: `In this page, begin with a prediction, change ${controlNoun(lesson)}, then compare ${listRepresentations(lesson)}. The formulas below explain why the displayed result changes when the control changes.`,
    knowMore: knowMoreFor(lesson, formulas, examples),
  };
}

function normalizeStrengthenedContent(lesson: ContentSource, content: LessonContent): LessonContent {
  const summary = content.summary.includes(lesson.title) ? content.summary : `${lesson.title}: ${content.summary}`;
  const explanation = content.explanation.includes("Introduction:")
    ? `${content.explanation} In the live task, ${lesson.interactions.toLowerCase()}; use the model to connect ${listRepresentations(lesson)} with ${listOutputs(lesson)}.`
    : `Introduction: ${content.summary} Detailed explanation: ${content.explanation} In the live task, ${lesson.interactions.toLowerCase()}; use the model to connect ${listRepresentations(lesson)} with ${listOutputs(lesson)}.`;
  const formulas = [...content.formulas];
  for (const fallback of adapterFormulas[lesson.adapter]) {
    if (formulas.length >= 2) break;
    if (!formulas.some((item) => item.expression === fallback.expression)) formulas.push(fallback);
  }
  return { ...content, summary, explanation, formulas };
}

function detailedExplanationFor(lesson: ContentSource, formulas: LessonFormula[]) {
  const formula = formulas[0];
  const representation = listRepresentations(lesson);
  const output = listOutputs(lesson);
  const topic = `${lesson.title} ${lesson.topic} ${lesson.workspace}`.toLowerCase();
  const adapterDetail = adapterExplanationFor(lesson.adapter);
  const conceptDetail = conceptExplanationFor(topic);
  return [
    adapterDetail,
    conceptDetail,
    `The main mathematical object is ${lesson.contract?.concept ?? lesson.title}. Treat every label, point, cell, or symbolic step as evidence, not decoration.`,
    formula ? `The key formula here is ${formula.label}: ${formula.expression}. It matters because ${formula.explanation}` : "",
    `A reliable solution should name the input, describe the change in ${representation}, and justify the final ${output}.`,
    commonMistakeFor(topic, lesson.adapter),
  ].filter(Boolean).join(" ");
}

function adapterExplanationFor(adapter: LessonSourceDefinition["adapter"]) {
  const explanations: Record<LessonSourceDefinition["adapter"], string> = {
    calculator: "Calculator lessons are about controlled numerical evaluation: preserve the expression structure, choose the correct mode, and only round when the question asks for an approximate answer.",
    algebra: "Algebra lessons connect symbolic structure to visible change: equivalent expressions keep the same value, equations isolate an unknown, and graph/table views test whether each transformation is valid.",
    number: "Number lessons make quantities concrete: use place value, factors, ratios, and benchmarks so the symbol is tied to a measurable amount.",
    authoring: "Authoring lessons explain how learning controls are built: each input needs a purpose, a visible response, and feedback that helps a learner revise their thinking.",
    learning: "Learning-system lessons focus on the learner journey: prediction, action, feedback, assessment, and revision should form one traceable cycle.",
    platform: "Platform lessons make mathematical tools accessible and reliable: visual state, keyboard state, and text summary must describe the same object.",
    graph: "Graph lessons ask you to read a relationship in three forms: equation, curve, and table. A change is meaningful only when all three update consistently.",
    "algebra-cas": "Algebra CAS lessons keep exact symbolic reasoning visible: the result is important, but the transformation steps and restrictions explain why it is valid.",
    geometry2d: "2D geometry lessons depend on construction constraints: points, lines, circles, angles, and measurements must preserve the stated relationship while you drag.",
    vector: "Vector lessons read arrows as quantities with direction and size. Components, magnitude, angle, sum, and projection are different views of the same vector state.",
    trigonometry: "Trigonometry lessons connect angle, triangle ratio, unit-circle coordinate, and wave graph. The angle unit and quadrant decide the sign and value.",
    cas: "CAS lessons use exact algebraic operations. The correct answer includes the command, transformed expression, restrictions, and at least one reason for the step.",
    calculus: "Calculus lessons study change and accumulation. The graph shows local behaviour, while derivative, integral, or limit notation gives the exact rule behind it.",
    spreadsheet: "Spreadsheet lessons model a grid of dependent values: each formula should point to source cells, recalculate predictably, and support a chart or summary.",
    statistics: "Statistics lessons turn data into evidence. Shape, centre, spread, outliers, and context must be read together before making a claim.",
    probability: "Probability lessons compare theoretical models with repeated trials. Sample space, event, assumptions, and randomness must stay visible.",
    inference: "Inference lessons use samples to reason about a population. The explanation must include uncertainty, sample size, assumptions, and what the interval or test does not prove.",
    sequence: "Sequence lessons study ordered patterns. The rule must explain how each term follows from the previous term or from its position.",
    matrix: "Matrix lessons treat arrays as transformations or systems. Entries are not isolated numbers; together they scale, rotate, solve, or encode relationships.",
    complex: "Complex-number lessons use the plane to connect real part, imaginary part, modulus, argument, and rotation. Algebra and geometry should agree.",
    geometry3d: "3D geometry lessons require spatial reading: identify faces, edges, cross-sections, axes, and measurements before using a formula.",
    discrete: "Discrete lessons work with finite structures. Counting choices, graph edges, sets, and logic statements must be exact because one missed case changes the answer.",
    finance: "Finance lessons are mathematical models with assumptions. Rate, time unit, principal, payment timing, and compounding rules must be stated before interpreting money values.",
  };
  return explanations[adapter];
}

function conceptExplanationFor(topic: string) {
  if (/limit|continuity|discontinuity/.test(topic)) return "Look at what nearby inputs approach, not only the value printed at one point.";
  if (/derivative|tangent|rate|slope/.test(topic)) return "Focus on change per unit input: the steeper the local graph, the larger the rate.";
  if (/integral|area|accumulation|volume/.test(topic)) return "Think of many small pieces being added; labels should clarify bounds, width, height, and sign.";
  if (/triangle|angle|trig|sine|cosine|tangent|bearing/.test(topic)) return "Start by marking the chosen angle, then match opposite, adjacent, hypotenuse, or unit-circle coordinates.";
  if (/circle|arc|sector|ellipse|hyperbola|parabola|locus/.test(topic)) return "The shape is defined by a condition on all points, so test the condition while dragging rather than trusting appearance.";
  if (/matrix|determinant|eigen|linear transformation/.test(topic)) return "Track how basis directions, area scale, and a test vector change under the matrix.";
  if (/complex|imaginary|polar/.test(topic)) return "Read the point as both a coordinate pair and a rotation-scale form.";
  if (/mean|median|quartile|variance|standard deviation|regression|correlation/.test(topic)) return "Inspect the data distribution before summarising; a single statistic can hide shape or outliers.";
  if (/probability|binomial|normal|distribution|random/.test(topic)) return "Separate model probability from simulation results; short simulations vary more than long ones.";
  if (/sequence|series|recursion/.test(topic)) return "Compare consecutive terms and position-based formulas to decide whether the pattern is arithmetic, geometric, recursive, or convergent.";
  if (/set|logic|proof|graph theory|count|permutation|combination/.test(topic)) return "List the allowed cases carefully, then remove duplicates, overlaps, or invalid cases.";
  if (/interest|loan|annuity|tax|discount|inflation|currency/.test(topic)) return "Convert percentages and time units first; then interpret whether the model is linear, compound, or payment-based.";
  if (/3d|solid|surface|sphere|cone|cylinder|prism/.test(topic)) return "Rotate the object mentally and visually; formulas depend on which length is radius, height, base, or slant.";
  if (/equation|expression|factor|solve|algebra/.test(topic)) return "Each algebraic step must preserve equality or equivalence; check by substituting a value or graphing both forms.";
  return "Read the concept as an input-output relationship: the rule explains why changing one input changes the displayed result.";
}

function commonMistakeFor(topic: string, adapter: LessonSourceDefinition["adapter"]) {
  if (/percent|rate|interest|finance/.test(topic)) return "Common mistake: using a percent as a whole number or mixing monthly and yearly rates.";
  if (/area|volume|surface/.test(topic)) return "Common mistake: using a length formula when the question asks for area, volume, or surface area.";
  if (/probability|statistics|inference/.test(topic)) return "Common mistake: making a certainty claim from a sample or simulation without naming uncertainty.";
  if (/trig|angle|bearing/.test(topic)) return "Common mistake: using the wrong angle mode, wrong quadrant, or mismatched opposite/adjacent side.";
  if (/matrix|vector|complex/.test(topic)) return "Common mistake: changing one component while forgetting the linked geometric meaning.";
  if (/proof|logic|set|count|discrete/.test(topic)) return "Common mistake: checking examples but not proving every allowed case.";
  if (adapter === "cas" || adapter === "algebra-cas") return "Common mistake: trusting a symbolic result without checking restrictions or the operation used.";
  return "Common mistake: reading the final answer without explaining which input changed and why the representation changed with it.";
}

function formulasFor(titleTopic: string, adapter: LessonSourceDefinition["adapter"]) {
  const specific: LessonFormula[] = [];
  if (/quadratic|parabola/.test(titleTopic)) specific.push(formula("Quadratic model", "y=ax^2+bx+c", "The squared term creates curvature; changing coefficients moves the vertex and intercepts."));
  if (/circle/.test(titleTopic)) specific.push(formula("Circle equation", "(x-h)^2+(y-k)^2=r^2", "A circle is the set of points a fixed distance r from its center."));
  if (/slope|linear|line/.test(titleTopic)) specific.push(formula("Slope", "m=\\frac{y_2-y_1}{x_2-x_1}", "Slope is the rate of vertical change per unit horizontal change."));
  if (/fraction|ratio|proportion/.test(titleTopic)) specific.push(formula("Equivalent ratios", "\\frac{a}{b}=\\frac{c}{d}\\iff ad=bc", "Cross-products match when two ratios are equal."));
  if (/percent|percentage/.test(titleTopic)) specific.push(formula("Percent change", "\\%\\ change=\\frac{new-old}{old}\\times100", "Percent change measures the relative increase or decrease from the starting value."));
  if (/trig|sine|cosine|tangent/.test(titleTopic)) specific.push(formula("Pythagorean identity", "\\sin^2\\theta+\\cos^2\\theta=1", "Every unit-circle point stays one unit from the origin."));
  if (/derivative|tangent|rate/.test(titleTopic)) specific.push(formula("Tangent slope", "m_{tan}=f'(x)", "The derivative gives the slope of the tangent line at a point."));
  if (/integral|area|riemann|accumulation/.test(titleTopic)) specific.push(formula("Accumulation", "area\\approx\\sum f(x_i)\\Delta x", "More, thinner rectangles improve the approximation to area under a curve."));
  if (/matrix|determinant/.test(titleTopic)) specific.push(formula("Invertibility", "\\det(A)\\ne0\\Rightarrow A^{-1}\\ exists", "A non-zero determinant means the transformation does not collapse the plane."));
  if (/probability|binomial|normal|distribution/.test(titleTopic)) specific.push(formula("Complement rule", "P(A^c)=1-P(A)", "The event and its complement fill the whole sample space."));
  if (/mean|median|quartile|box|variance|standard deviation/.test(titleTopic)) specific.push(formula("Variance", "s^2=\\frac{\\sum(x_i-\\bar{x})^2}{n-1}", "Variance measures spread by averaging squared deviations from the mean."));
  if (/complex|imaginary|euler/.test(titleTopic)) specific.push(formula("Euler form", "re^{i\\theta}=r(\\cos\\theta+i\\sin\\theta)", "Multiplication in polar form combines scaling and rotation."));
  if (/sequence|series/.test(titleTopic)) specific.push(formula("Geometric sum", "S_n=a\\frac{1-r^n}{1-r}", "A finite geometric series adds powers of a common ratio."));
  if (/set|venn/.test(titleTopic)) specific.push(formula("Union cardinality", "|A\\cup B|=|A|+|B|-|A\\cap B|", "Subtract the overlap once because it was counted in both sets."));
  if (/interest|loan|finance|compound/.test(titleTopic)) specific.push(formula("Compound amount", "A=P(1+r)^t", "Compound interest grows by multiplying the previous amount each period."));
  return [...specific, ...adapterFormulas[adapter]].slice(0, 4);
}

function controlGuideFor(lesson: ContentSource) {
  const contract = lesson.contract;
  if (!contract) return [lesson.interactions];
  const primary = contract.requiredControlIds.join(", ");
  const verbs = contract.requiredInteractionVerbs.join(", ");
  return [
    `Use ${primary} to ${verbs} the live model.`,
    contract.keyboardAlternative,
    `After each change, read ${contract.observableOutputs.join(", ")} and check that it matches ${contract.requiredRepresentations.join(", ")}.`,
    `Reset should restore ${contract.resetAssertions.join(", ")} before you try a new prediction.`,
  ];
}

function examplesFor(lesson: ContentSource) {
  const topic = lesson.topic.toLowerCase();
  if (/graph|function|linear|quadratic|slope/.test(topic)) return [
    "A taxi fare changes with distance: fixed start fee plus cost per kilometre.",
    "A shop discount graph shows how final price changes when discount percent changes.",
    "A ball thrown upward follows a curved path, so height can be modelled with a quadratic graph.",
  ];
  if (/geometry|circle|area|volume|3d|triangle/.test(topic)) return [
    "A carpenter checks length, angle, and area before cutting a board.",
    "A water tank estimate uses shape, radius, height, and volume.",
    "A map or floor plan uses scaled geometry so small drawings match real spaces.",
  ];
  if (/trig|sine|cosine|tangent/.test(topic)) return [
    "A ladder against a wall creates a right triangle where angle changes the height reached.",
    "Ferris wheel motion repeats like sine and cosine waves.",
    "Surveyors use angles and distances to estimate building heights.",
  ];
  if (/data|statistics|probability|inference/.test(topic)) return [
    "Weather forecasts use probability to describe chance of rain.",
    "Exam scores use mean, spread, and graphs to compare performance fairly.",
    "Quality checks sample a few products to infer whether a full batch is reliable.",
  ];
  if (/sequence|series|discrete|set|logic|count/.test(topic)) return [
    "A seating plan counts choices without listing every arrangement by hand.",
    "A password rule uses logic: every condition must pass before access is allowed.",
    "Saving a fixed amount every month forms a sequence of growing totals.",
  ];
  if (/finance|interest|loan/.test(topic)) return [
    "A bank deposit grows by interest over time.",
    "Loan payments compare principal, rate, time, and total amount.",
    "A discount or tax bill uses percentages to move from base price to final price.",
  ];
  if (/matrix|vector|complex/.test(topic)) return [
    "A game engine moves objects using vectors for direction and speed.",
    "Image filters use matrix transformations to rotate, stretch, or recolor pixels.",
    "AC electricity and signal processing use complex numbers to track size and phase.",
  ];
  if (/calculus|derivative|integral|limit/.test(topic)) return [
    "A speedometer shows rate of change, which is the idea behind derivatives.",
    "Total distance from changing speed is an accumulation idea like an integral.",
    "Zooming near a curve makes a tiny part look almost straight, which helps explain limits.",
  ];
  if (/spreadsheet|calculator|cas|algebra|number/.test(topic)) return [
    "A grocery bill uses operations, percentages, and totals in one calculation.",
    "A spreadsheet budget updates automatically when one value changes.",
    "Solving for an unknown helps plan how many items fit inside a fixed budget.",
  ];
  return [
    `Use ${lesson.title.toLowerCase()} when a real situation has inputs, rules, and outputs.`,
    `Try changing one value at a time and watch how ${listOutputs(lesson)} responds.`,
    "Check your final answer by comparing the visual pattern with the formula.",
  ];
}

function knowMoreFor(lesson: ContentSource, formulas: LessonFormula[], examples: string[]) {
  const firstFormula = formulas[0];
  return [
    `Why it matters: ${lesson.outcome}`,
    `How to test it: change one control, keep the others steady, and describe what changed in ${listOutputs(lesson)}.`,
    `Formula link: ${firstFormula.label} is useful because ${firstFormula.explanation}`,
    `Real-life check: ${examples[0]}`,
  ];
}

function listOutputs(lesson: ContentSource) {
  return lesson.contract?.observableOutputs.join(", ") ?? lesson.outcome.toLowerCase();
}

function listRepresentations(lesson: ContentSource) {
  return lesson.contract?.requiredRepresentations.join(", ") ?? lesson.interactions.toLowerCase();
}

function controlNoun(lesson: ContentSource) {
  return lesson.contract?.requiredControlIds.join(" or ") ?? lesson.interactions.toLowerCase();
}

function formula(label: string, expression: string, explanation: string): LessonFormula {
  return { label, expression, explanation };
}
