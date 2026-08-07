import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SchoolSyllabusClass12Challenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type SchoolSyllabusClass12Seed = {
  id: number;
  title: string;
  route: string;
  topic: string;
  academicLevel: string;
  lessonType: StrengthenedLesson["lessonType"];
  definition: string;
  action: string;
  reason: string;
  representation: StrengthenedLesson["representations"][number]["type"];
  misconception: [string, string, string];
  prompt: string;
  expected: string;
  formula: StrengthenedLesson["formulas"][number];
  expertReviewRequired: boolean;
};

type Source = Pick<SchoolSyllabusClass12Seed, "title" | "route" | "topic">;

const sources: Record<number, Source> = {
  10154: source("Line Through Two Points in 3D", "/lessons/school/class-12/class-12-three-dimensional-geometry-line-through-two-points-in-3d", "Three-Dimensional Geometry"),
  10155: source("Vector Equation of a Line", "/lessons/school/class-12/class-12-three-dimensional-geometry-vector-equation-of-a-line", "Three-Dimensional Geometry"),
  10156: source("Cartesian Equation of a Line", "/lessons/school/class-12/class-12-three-dimensional-geometry-cartesian-equation-of-a-line", "Three-Dimensional Geometry"),
  10157: source("Skew Lines", "/lessons/school/class-12/class-12-three-dimensional-geometry-skew-lines", "Three-Dimensional Geometry"),
  10158: source("Shortest Distance Between Lines", "/lessons/school/class-12/class-12-three-dimensional-geometry-shortest-distance-between-lines", "Three-Dimensional Geometry"),
  10159: source("Plane Equation", "/lessons/school/class-12/class-12-three-dimensional-geometry-plane-equation", "Three-Dimensional Geometry"),
  10160: source("Point-Normal Form", "/lessons/school/class-12/class-12-three-dimensional-geometry-point-normal-form", "Three-Dimensional Geometry"),
  10161: source("Intercept Form of a Plane", "/lessons/school/class-12/class-12-three-dimensional-geometry-intercept-form-of-a-plane", "Three-Dimensional Geometry"),
  10162: source("Distance from Point to Plane", "/lessons/school/class-12/class-12-three-dimensional-geometry-distance-from-point-to-plane", "Three-Dimensional Geometry"),
  10163: source("Angle Between Two Planes", "/lessons/school/class-12/class-12-three-dimensional-geometry-angle-between-two-planes", "Three-Dimensional Geometry"),
  10164: source("Angle Between Line and Plane", "/lessons/school/class-12/class-12-three-dimensional-geometry-angle-between-line-and-plane", "Three-Dimensional Geometry"),
  10165: source("Left-Hand and Right-Hand Limits", "/lessons/school/class-12/class-12-formal-calculus-left-hand-and-right-hand-limits", "Formal Calculus"),
  10166: source("Continuity at a Point", "/lessons/school/class-12/class-12-formal-calculus-continuity-at-a-point", "Formal Calculus"),
  10167: source("Continuity on an Interval", "/lessons/school/class-12/class-12-formal-calculus-continuity-on-an-interval", "Formal Calculus"),
  10168: source("Removable Discontinuity", "/lessons/school/class-12/class-12-formal-calculus-removable-discontinuity", "Formal Calculus"),
  10169: source("Jump Discontinuity", "/lessons/school/class-12/class-12-formal-calculus-jump-discontinuity", "Formal Calculus"),
  10170: source("Infinite Discontinuity", "/lessons/school/class-12/class-12-formal-calculus-infinite-discontinuity", "Formal Calculus"),
  10171: source("Differentiability versus Continuity", "/lessons/school/class-12/class-12-formal-calculus-differentiability-versus-continuity", "Formal Calculus"),
  10172: source("Rolle's Theorem", "/lessons/school/class-12/class-12-formal-calculus-rolle-s-theorem", "Formal Calculus"),
  10173: source("Lagrange Mean Value Theorem", "/lessons/school/class-12/class-12-formal-calculus-lagrange-mean-value-theorem", "Formal Calculus"),
  10174: source("Rate of Change", "/lessons/school/class-12/class-12-formal-calculus-rate-of-change", "Formal Calculus"),
  10175: source("Tangents and Normals", "/lessons/school/class-12/class-12-formal-calculus-tangents-and-normals", "Formal Calculus"),
  10176: source("Increasing and Decreasing Functions", "/lessons/school/class-12/class-12-formal-calculus-increasing-and-decreasing-functions", "Formal Calculus"),
  10177: source("Local Maxima and Minima", "/lessons/school/class-12/class-12-formal-calculus-local-maxima-and-minima", "Formal Calculus"),
  10178: source("Absolute Maxima and Minima", "/lessons/school/class-12/class-12-formal-calculus-absolute-maxima-and-minima", "Formal Calculus"),
  10179: source("Approximation Using Differentials", "/lessons/school/class-12/class-12-formal-calculus-approximation-using-differentials", "Formal Calculus"),
  10180: source("Integration by Substitution", "/lessons/school/class-12/class-12-formal-calculus-integration-by-substitution", "Formal Calculus"),
  10181: source("Integration by Parts", "/lessons/school/class-12/class-12-formal-calculus-integration-by-parts", "Formal Calculus"),
  10182: source("Integration by Partial Fractions", "/lessons/school/class-12/class-12-formal-calculus-integration-by-partial-fractions", "Formal Calculus"),
  10183: source("Definite Integral Properties", "/lessons/school/class-12/class-12-formal-calculus-definite-integral-properties", "Formal Calculus"),
  10184: source("Area Under a Curve", "/lessons/school/class-12/class-12-formal-calculus-area-under-a-curve", "Formal Calculus"),
  10185: source("Area Between Curves", "/lessons/school/class-12/class-12-formal-calculus-area-between-curves", "Formal Calculus"),
  10186: source("Formation of Differential Equations", "/lessons/school/class-12/class-12-differential-equations-formation-of-differential-equations", "Differential Equations"),
  10187: source("Order and Degree", "/lessons/school/class-12/class-12-differential-equations-order-and-degree", "Differential Equations"),
  10188: source("Variable-Separable Equations", "/lessons/school/class-12/class-12-differential-equations-variable-separable-equations", "Differential Equations"),
  10189: source("Homogeneous First-Order Equations", "/lessons/school/class-12/class-12-differential-equations-homogeneous-first-order-equations", "Differential Equations"),
  10190: source("Linear First-Order Equations", "/lessons/school/class-12/class-12-differential-equations-linear-first-order-equations", "Differential Equations"),
  10191: source("General and Particular Solutions", "/lessons/school/class-12/class-12-differential-equations-general-and-particular-solutions", "Differential Equations"),
  10192: source("Direction Fields", "/lessons/school/class-12/class-12-differential-equations-direction-fields", "Differential Equations"),
  10193: source("Minors and Cofactors", "/lessons/school/class-12/class-12-matrices-and-determinants-minors-and-cofactors", "Matrices and Determinants"),
  10194: source("Adjoint of a Matrix", "/lessons/school/class-12/class-12-matrices-and-determinants-adjoint-of-a-matrix", "Matrices and Determinants"),
  10195: source("Inverse by Adjoint", "/lessons/school/class-12/class-12-matrices-and-determinants-inverse-by-adjoint", "Matrices and Determinants"),
  10196: source("Determinants and Geometric Area", "/lessons/school/class-12/class-12-matrices-and-determinants-determinants-and-geometric-area", "Matrices and Determinants"),
  10197: source("Solving Linear Equations by Matrices", "/lessons/school/class-12/class-12-matrices-and-determinants-solving-linear-equations-by-matrices", "Matrices and Determinants"),
  10198: source("Cramer's Rule", "/lessons/school/class-12/class-12-matrices-and-determinants-cramer-s-rule", "Matrices and Determinants"),
  10199: source("Consistency of Linear Systems", "/lessons/school/class-12/class-12-matrices-and-determinants-consistency-of-linear-systems", "Matrices and Determinants"),
  10200: source("Formulating Linear Programming Problems", "/lessons/school/class-12/class-12-linear-programming-formulating-linear-programming-problems", "Linear Programming"),
  10201: source("Feasible Region", "/lessons/school/class-12/class-12-linear-programming-feasible-region", "Linear Programming"),
  10202: source("Corner-Point Method", "/lessons/school/class-12/class-12-linear-programming-corner-point-method", "Linear Programming"),
  10203: source("Bounded Feasible Region", "/lessons/school/class-12/class-12-linear-programming-bounded-feasible-region", "Linear Programming"),
};

const expertReviewIds = new Set([10154, 10155, ...Array.from({ length: 28 }, (_, index) => index + 10165), 10194]);

export function schoolSyllabusClass12Seed(id: number): SchoolSyllabusClass12Seed {
  const item = sources[id];
  if (!item) throw new Error(`Missing school syllabus Class 12 lesson seed for ${id}`);
  const details = detailFor(id, item);
  return { id, academicLevel: "CLASS_12", expertReviewRequired: expertReviewIds.has(id), ...item, ...details };
}

export function schoolSyllabusClass12Lesson(seed: SchoolSyllabusClass12Seed): StrengthenedLesson {
  const slug = seed.route.split("/").pop() ?? String(seed.id);
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: "School Syllabus",
    topic: seed.topic,
    academicLevel: seed.academicLevel,
    lessonType: seed.lessonType,
    learningObjectives: [`Define ${seed.title} correctly.`, seed.action, `Avoid this mistake: ${seed.misconception[1]}`],
    prerequisites: prerequisitesFor(seed.topic),
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, vocabularyFor(seed.topic)],
    introduction: `${seed.title} is a Class 12 idea in ${seed.topic}. It helps students model space, change, equations, matrices, and optimisation. These ideas appear in engineering, economics, motion, and data decisions.`,
    basicIdea: `${seed.definition} The basic idea is to check the exact condition before applying a formula. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then check that the result satisfies the original condition.`,
    whyItWorks: whyFor(seed.topic),
    definitions: [{ id: `${slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${slug}-fact`, statement: seed.reason }],
    formulas: [seed.formula],
    conditionsAndRestrictions: restrictionsFor(seed.topic),
    representations: [{ id: `${slug}-representation`, type: seed.representation, learningPurpose: `Show the exact structure of ${seed.title}.` }],
    workedExamples: [{ id: `${slug}-worked-1`, prompt: seed.prompt, steps: ["Read the given information.", seed.action, "Check the result against the lesson condition."], answer: seed.expected }],
    realLifeExamples: examplesFor(seed.topic, slug),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${slug}-interaction`,
      learningPurpose: `Explore ${seed.title} with a linked graph, table, formula, vector, or proof check.`,
      parameters: [{ id: "value", label: "Value", validRange: [1, 30] }],
      initialState: `Start with the worked example for ${seed.title}.`,
      dynamicFeedback: "Changing one input updates the diagram, graph, slope, matrix, region, or formula check.",
      successCriteria: ["Use the exact condition", "Read the representation", "Explain the common mistake"],
      accessibilityAlternative: "Provide the same steps and result as labelled text.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict the result before changing the model." }, { id: "test", prompt: "Change one input and read the new result." }, { id: "explain", prompt: "Explain why the rule still works." }],
    practice: [
      practice(`${slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"),
      practice(`${slug}-direct`, seed.prompt, seed.expected, code, "direct"),
      practice(`${slug}-multi`, `How do you use ${seed.title}?`, seed.action, code, "multi_step"),
      practice(`${slug}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${slug}-transfer`, `Give one daily use of ${seed.title}.`, examplesFor(seed.topic, slug)[0].context, code, "transfer"),
    ],
    challenge: { id: `${slug}-challenge`, prompt: seed.prompt, successCriteria: ["Uses the exact rule", "Checks conditions", "Avoids the named mistake"], hints: [`Use the rule for ${seed.title}.`, seed.misconception[2]] },
    exitCheck: [{ id: `${slug}-exit`, prompt: `State one rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names a correct rule or condition." }],
    accessibilityNotes: ["Announce values, labels, graph coordinates, and algebra steps as text.", "Do not rely only on colour."],
    expertReviewRequired: seed.expertReviewRequired,
    reviewReason: seed.expertReviewRequired ? "This proof-heavy or calculus-based school lesson needs expert review." : undefined,
  };
}

export function schoolSyllabusClass12Challenge(seed: SchoolSyllabusClass12Seed): SchoolSyllabusClass12Challenge {
  return { prompt: seed.prompt, expected: seed.expected, hint: `Use the rule for ${seed.title}.`, kind: Number.isFinite(Number(seed.expected)) ? "numeric" : "keywords", factoryId: `school.class12.${seed.id}` };
}

function detailFor(id: number, source: Source): Omit<SchoolSyllabusClass12Seed, keyof Source | "id" | "academicLevel" | "expertReviewRequired"> {
  const formula = formulaFor(id, source.title);
  const code = formula.label.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  if (source.topic === "Three-Dimensional Geometry") {
    return {
      lessonType: "procedure",
      definition: `${source.title} describes an exact line, plane, distance, or angle using coordinates and vectors in three-dimensional space.`,
      action: "Identify points, direction vectors, or normal vectors, then substitute them into the matching 3D geometry formula.",
      reason: "Vectors give direction, dot products measure angles, and normal vectors describe planes.",
      representation: "coordinate_graph",
      misconception: [code, "Using coordinates as direction data without subtracting or checking the vector meaning.", "Use coordinate differences for directions and normal vectors for planes."],
      prompt: promptFor(id),
      expected: expectedFor(id),
      formula,
    };
  }
  if (source.topic === "Formal Calculus") {
    return {
      lessonType: id === 10172 || id === 10173 ? "proof" : "procedure",
      definition: `${source.title} studies limits, derivatives, integrals, or theorem conditions for functions.`,
      action: "Check the required hypotheses, apply the correct limit, derivative, or integral rule, and interpret the result on the graph.",
      reason: "Calculus connects local change, accumulated area, and limiting behaviour with exact symbolic rules.",
      representation: id <= 10171 ? "coordinate_graph" : "symbolic_steps",
      misconception: [code, "Applying a calculus rule without checking its conditions.", "Check continuity, differentiability, interval, and sign conditions first."],
      prompt: promptFor(id),
      expected: expectedFor(id),
      formula,
    };
  }
  if (source.topic === "Differential Equations") {
    return {
      lessonType: "procedure",
      definition: `${source.title} describes how a function is connected to one or more of its derivatives.`,
      action: "Classify the equation, choose the matching method, solve step by step, and check whether constants or conditions are handled.",
      reason: "Differential equations model quantities by relating their current value to their rate of change.",
      representation: id === 10192 ? "coordinate_graph" : "symbolic_steps",
      misconception: [code, "Using a solving method before classifying the differential equation.", "Classify the equation first, then choose the matching method."],
      prompt: promptFor(id),
      expected: expectedFor(id),
      formula,
    };
  }
  if (source.topic === "Matrices and Determinants") {
    return {
      lessonType: "procedure",
      definition: `${source.title} uses square matrices, determinants, adjoints, inverses, or matrix equations to solve linear problems.`,
      action: "Set up the matrix or determinant carefully, check any non-zero determinant condition, then compute in the correct order.",
      reason: "Rows, columns, and determinants organise many linear relationships at the same time.",
      representation: "text_table",
      misconception: [code, "Using determinant or inverse rules without checking the square-matrix and non-zero determinant conditions.", "Check matrix size and determinant conditions before applying the formula."],
      prompt: promptFor(id),
      expected: expectedFor(id),
      formula,
    };
  }
  return {
    lessonType: "modelling",
    definition: `${source.title} is a linear programming idea about variables, constraints, feasible regions, and objective values.`,
    action: "Define decision variables, write linear inequalities, graph the feasible region, and test the objective as required.",
    reason: "A linear objective reaches its best value by comparing allowed points in the feasible region.",
    representation: "coordinate_graph",
    misconception: [code, "Solving the objective before finding the feasible region.", "Find the feasible region first, then evaluate the objective."],
    prompt: promptFor(id),
    expected: expectedFor(id),
    formula,
  };
}

function promptFor(id: number) {
  const prompts: Record<number, string> = {
    10154: "For (1,2,3) and (4,6,8), give direction ratios.",
    10155: "What is the vector equation form of a line?",
    10162: "Can point-to-plane distance be negative?",
    10165: "When does a two-sided limit exist?",
    10166: "Continuity at a needs f(a) equal to what?",
    10172: "What derivative value appears in Rolle's theorem?",
    10173: "What line is parallel to the tangent in the mean value theorem?",
    10180: "Integration by substitution reverses which rule?",
    10181: "Integration by parts reverses which rule?",
    10188: "What do you do after separating variables?",
    10190: "What is the standard linear differential equation form?",
    10193: "What sign factor makes a cofactor?",
    10194: "What is the adjoint of a matrix?",
    10195: "When does inverse by adjoint exist?",
    10198: "What condition does Cramer's rule need?",
    10201: "What does a feasible region satisfy?",
    10202: "Where does a bounded linear optimum occur?",
  };
  return prompts[id] ?? "Name the key condition used in this lesson.";
}

function expectedFor(id: number) {
  const answers: Record<number, string> = {
    10154: "3,4,5",
    10155: "r=a+lambda b",
    10162: "no",
    10165: "both sides equal",
    10166: "limit",
    10172: "0",
    10173: "secant line",
    10180: "chain rule",
    10181: "product rule",
    10188: "integrate both sides",
    10190: "dy/dx+Py=Q",
    10193: "(-1)^(i+j)",
    10194: "transpose of cofactor matrix",
    10195: "determinant non-zero",
    10198: "determinant non-zero",
    10201: "all constraints",
    10202: "corner point",
  };
  return answers[id] ?? "the stated condition";
}

function formulaFor(id: number, title: string): StrengthenedLesson["formulas"][number] {
  const forms: Record<number, [string, string, StrengthenedLesson["formulas"][number]["exactness"]]> = {
    10154: ["3D direction", "direction = (x2-x1, y2-y1, z2-z1)", "definition"],
    10155: ["Vector line", "r = a + lambda b", "definition"],
    10156: ["Cartesian line", "(x-x1)/a = (y-y1)/b = (z-z1)/c", "definition"],
    10158: ["Skew distance", "distance = |(a2-a1).(b1 x b2)| / |b1 x b2|", "theorem"],
    10159: ["Plane equation", "ax + by + cz + d = 0", "definition"],
    10160: ["Point-normal", "n.(r-a)=0", "definition"],
    10161: ["Intercept plane", "x/a + y/b + z/c = 1", "definition"],
    10162: ["Point-plane distance", "|ax1+by1+cz1+d|/sqrt(a^2+b^2+c^2)", "theorem"],
    10172: ["Rolle theorem", "f'(c)=0", "theorem"],
    10173: ["Mean value theorem", "f'(c)=(f(b)-f(a))/(b-a)", "theorem"],
    10179: ["Differential approximation", "dy = f'(x) dx", "definition"],
    10180: ["Substitution", "integral f(g(x))g'(x) dx = integral f(u) du", "identity"],
    10181: ["Parts", "integral u dv = uv - integral v du", "identity"],
    10188: ["Separable form", "g(y)dy = f(x)dx", "definition"],
    10190: ["Linear DE", "dy/dx + Py = Q", "definition"],
    10193: ["Cofactor", "Cij = (-1)^(i+j) Mij", "definition"],
    10194: ["Adjoint", "adj(A) = transpose(cofactor matrix)", "definition"],
    10195: ["Inverse by adjoint", "A^-1 = adj(A)/det(A)", "theorem"],
    10198: ["Cramer rule", "xi = Di/D", "theorem"],
    10202: ["Corner point method", "optimum occurs at a feasible vertex", "theorem"],
  };
  const [label, expression, exactness] = forms[id] ?? [title, "use the stated definition and conditions", "definition"];
  return { id: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-formula`, label, expression, variables: [{ symbol: "given values", meaning: "the values named in the lesson question" }], exactness };
}

function source(title: string, route: string, topic: string): Source {
  return { title, route, topic };
}

function examplesFor(topic: string, slug: string) {
  const examples: [string, string][] = /Three-Dimensional/.test(topic)
    ? [["Flight path", "A 3D line describes motion through space."], ["Architecture", "Planes model walls, roofs, and floors."], ["Computer graphics", "Vectors and planes place objects in scenes."]]
    : /Calculus/.test(topic)
      ? [["Speed", "Derivatives model changing position."], ["Design curves", "Tangents show local direction."], ["Area estimate", "Integrals measure accumulated quantity."]]
      : /Differential/.test(topic)
        ? [["Population model", "A differential equation can describe growth."], ["Cooling tea", "Rate depends on current temperature."], ["Slope field", "Small marks show possible solution paths."]]
        : /Matrices/.test(topic)
          ? [["Balancing equations", "Matrices solve several equations at once."], ["Area scaling", "Determinants measure transformed area."], ["Computer graphics", "Matrices move and transform points."]]
          : [["Factory planning", "Constraints limit production choices."], ["Diet planning", "Linear inequalities model nutrition limits."], ["Budgeting", "Optimisation chooses a best feasible plan."]];
  return examples.map(([context, connection], index) => ({ id: `${slug}-real-${index + 1}`, context, connection }));
}

function vocabularyFor(topic: string) {
  if (/Three-Dimensional/.test(topic)) return { term: "Vector", meaning: "A quantity with direction and size." };
  if (/Calculus/.test(topic)) return { term: "Derivative", meaning: "Instant rate of change." };
  if (/Differential/.test(topic)) return { term: "Solution curve", meaning: "A function that satisfies a differential equation." };
  if (/Matrices/.test(topic)) return { term: "Determinant", meaning: "A number linked to a square matrix." };
  return { term: "Constraint", meaning: "A rule that limits allowed values." };
}

function prerequisitesFor(topic: string) {
  if (/Three-Dimensional/.test(topic)) return ["3D coordinates", "Vectors", "Dot product"];
  if (/Calculus/.test(topic)) return ["Functions", "Limits", "Derivatives and integrals"];
  if (/Differential/.test(topic)) return ["Derivatives", "Integration", "Algebraic rearrangement"];
  if (/Matrices/.test(topic)) return ["Matrices", "Determinants", "Linear equations"];
  return ["Linear inequalities", "Coordinate graphing", "Objective functions"];
}

function restrictionsFor(topic: string) {
  if (/Three-Dimensional/.test(topic)) return ["Check vector direction and normal direction carefully.", "Use absolute value for distances."];
  if (/Calculus/.test(topic)) return ["Check hypotheses before applying theorems.", "Use intervals and endpoints exactly as stated."];
  if (/Differential/.test(topic)) return ["State arbitrary constants for general solutions.", "Separate variables only when separation is valid."];
  if (/Matrices/.test(topic)) return ["Use square matrices where determinants or adjoints are required.", "Check determinant conditions before using inverse formulas."];
  return ["Define decision variables first.", "Use the common overlap of all constraints."];
}

function whyFor(topic: string) {
  if (/Three-Dimensional/.test(topic)) return "3D geometry works because vectors describe direction and dot products measure perpendicularity and angles.";
  if (/Calculus/.test(topic)) return "Calculus works because limits, derivatives, and integrals describe change and accumulation exactly.";
  if (/Differential/.test(topic)) return "Differential equations work because they connect a quantity with its rate of change.";
  if (/Matrices/.test(topic)) return "Matrix methods work because rows and columns organise many linear relationships at once.";
  return "Linear programming works because a linear objective reaches its best value on the feasible region under stated constraints.";
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Read the condition.", "Choose the matching rule.", "Check the final answer."], workedSolution: ["Identify the given information.", "Apply the lesson rule.", "Check the answer in context."], misconceptionTag, difficulty, parameterConstraints: ["Use class-level coordinates, functions, matrices, equations, or linear constraints."] };
}
