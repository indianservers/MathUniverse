import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SymbolicContinuationChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type Seed = {
  id: number;
  title: string;
  slug: string;
  definition: string;
  action: string;
  reason: string;
  formula: string;
  misconception: [string, string, string];
  examples: [string, string][];
  challenge: SymbolicContinuationChallenge;
};

const data: Record<number, Seed> = {
  431: item(431, "Factor", "factor", "Factor rewrites an expression as a product of simpler factors.", "Find common factors or patterns, then multiply back to check.", "Factoring helps solve equations because a product is zero when one factor is zero.", "sum -> product", ["NOT_CHECKED", "Accepting factors without expanding back.", "Multiply factors back to verify the original expression."], [["Quadratics", "x^2+5x+6 factors to (x+2)(x+3)."], ["Common factor", "6x+9 factors to 3(2x+3)."], ["Equation solving", "Factored form shows roots."]], "How can you check a factorisation?", "expand"),
  432: item(432, "Substitute", "substitute", "Substitute means replace a variable with a chosen value or expression.", "Replace every matching variable, then follow order of operations.", "Substitution connects formulas to specific values.", "x -> a", ["MISSED_VARIABLE", "Replacing only one occurrence of the variable.", "Replace every matching variable before simplifying."], [["Formula", "Use r=3 in A=pi r^2."], ["Expression", "Use x=2 in x^2+1."], ["Function", "Find f(4)."]], "When substituting, replace how many matching variables?", "every"),
  433: item(433, "Solve", "solve", "Solve finds values that make an equation true.", "Use valid inverse steps and check candidate answers.", "Solving preserves equality while isolating the unknown.", "left side = right side", ["NO_CHECK", "Giving a solution without checking it.", "Substitute the answer back into the original equation."], [["Linear equation", "2x+1=7 gives x=3."], ["Quadratic equation", "x^2=9 gives x=3 or -3."], ["Formula", "Solve for one variable."]], "A solution should make the equation what?", "true"),
  434: item(434, "Numerical Solve", "numerical-solve", "Numerical solve finds an approximate solution when exact solving is hard.", "Choose a starting range or guess and check the residual.", "Approximate roots are useful, but their accuracy must be stated.", "f(x) approx 0", ["EXACT_CLAIM", "Calling a rounded numerical answer exact.", "Label numerical answers as approximate and check the residual."], [["Cubic root", "x^3-x-1=0 has an approximate root."], ["Intersection", "Find where two graphs meet."], ["Model", "Solve a real equation from data."]], "Numerical solve gives exact or approximate answers?", "approximate"),
  435: item(435, "Solve Systems", "solve-systems", "Solve systems finds values satisfying several equations at once.", "Use substitution, elimination, or matrices, then check every equation.", "A system solution must work in all equations, not just one.", "all equations true", ["ONE_EQUATION_ONLY", "Checking the answer in only one equation.", "Test the solution in every equation."], [["Two lines", "Their intersection solves both equations."], ["Budget model", "Two conditions determine prices."], ["3D planes", "Several equations can meet at a point."]], "A system solution must satisfy how many equations?", "all"),
  436: item(436, "Eliminate Variables", "eliminate-variables", "Eliminate variables removes one variable to make a smaller system.", "Combine equations so one variable cancels.", "Elimination works because equal operations preserve the solution set.", "combine equations", ["BAD_MULTIPLIER", "Combining equations before matching coefficients.", "Match coefficients or opposites before adding or subtracting."], [["Linear system", "Add equations to remove y."], ["Physics", "Remove time from two formulas."], ["Algebra", "Reduce three variables to two."]], "Before elimination, coefficients should be matched or what?", "opposites"),
  437: item(437, "Partial Fractions", "partial-fractions", "Partial fractions split a rational expression into simpler fractions.", "Factor the denominator, set unknown constants, and solve for them.", "The split form makes integration and algebra easier.", "rational expression -> simpler fractions", ["UNFACTORED_DENOMINATOR", "Splitting before factoring the denominator.", "Factor the denominator first."], [["Integration", "Split before integrating."], ["Algebra", "Compare coefficients."], ["Signals", "Break a complex fraction into parts."]], "Partial fractions starts by factoring what?", "denominator"),
  438: item(438, "Polynomial Division", "polynomial-division", "Polynomial division divides one polynomial by another.", "Divide leading terms, multiply back, subtract, and repeat.", "It works like long division because powers are ordered by degree.", "dividend = divisor x quotient + remainder", ["ORDER_ERROR", "Skipping powers or writing terms out of order.", "Order terms by descending powers before dividing."], [["Long division", "Divide x^2+3x+2 by x+1."], ["Remainder", "Find what is left after division."], ["Factor check", "Remainder zero means exact division."]], "Polynomial division orders terms by descending what?", "powers"),
  439: item(439, "Derivatives", "derivatives", "A derivative measures the instantaneous rate of change of a function.", "Apply derivative rules and state the variable of differentiation.", "Derivatives describe slope, velocity, and local change.", "d/dx f(x)", ["WRONG_VARIABLE", "Differentiating with respect to the wrong variable.", "State the variable before applying rules."], [["Slope", "Derivative gives tangent slope."], ["Motion", "Velocity is derivative of position."], ["Optimisation", "Critical points use derivatives."]], "A derivative measures rate of what?", "change"),
  440: item(440, "Integrals", "integrals", "An integral accumulates quantities over an interval or region.", "Find an antiderivative or add tiny pieces, then apply limits if given.", "Integrals measure area, total change, and accumulation.", "int f(x) dx", ["MISSING_CONSTANT", "Leaving out +C for an indefinite integral.", "Add +C when no limits are given."], [["Area", "Integral gives area under a curve."], ["Distance", "Integrate velocity over time."], ["Mass", "Integrate density over length."]], "An indefinite integral needs what constant?", "C"),
  441: item(441, "Limits", "limits", "A limit describes the value a function approaches near an input.", "Check behaviour from the needed side or sides.", "Limits support continuity, derivatives, and infinite processes.", "lim x->a f(x)", ["SUBSTITUTE_ONLY", "Substituting without checking behaviour near the point.", "Use nearby values or algebra when direct substitution is unclear."], [["Continuity", "Check if graph approaches same value."], ["Derivative", "Derivative starts from a limit."], ["Sequences", "Long-run value is a limit."]], "A limit describes what a function approaches?", "value"),
  442: item(442, "Series Expansions", "series-expansions", "A series expansion writes a function as an infinite or finite sum of powers.", "Choose the centre and number of terms.", "Series approximate functions near a centre.", "f(x)=sum terms", ["NO_CENTER", "Using a series without naming its centre.", "State the expansion centre and valid region."], [["Taylor series", "Approximate sin x near 0."], ["Calculator", "Use terms for approximation."], ["Physics", "Approximate small motions."]], "A series expansion should state its what?", "centre"),
  444: item(444, "Matrix Operations", "matrix-operations", "Matrix operations use arrays of numbers or symbols.", "Check dimensions before adding, multiplying, or inverting.", "Dimensions decide which matrix operations are valid.", "rows x columns", ["DIMENSION_SKIP", "Multiplying matrices without checking sizes.", "Check row and column dimensions first."], [["Linear systems", "Matrices store coefficients."], ["Transformations", "Matrices move points."], ["Data", "Tables can become matrices."]], "Matrix operations must check what first?", "dimensions"),
  445: item(445, "Complex Calculations", "complex-calculations", "Complex calculations use numbers with real and imaginary parts.", "Handle i using i^2=-1 and keep real and imaginary parts clear.", "Complex arithmetic extends algebra to solve more equations.", "i^2=-1", ["I_AS_ONE", "Treating i like the number 1.", "Use i^2=-1 and combine matching parts."], [["Quadratics", "x^2+1=0 uses i."], ["Electrical models", "Complex numbers model phase."], ["Vectors", "Complex numbers can represent plane points."]], "What is i squared?", "-1"),
  446: item(446, "Assumptions", "assumptions", "Assumptions tell a CAS what values variables may have.", "State domains such as real, positive, integer, or nonzero.", "Assumptions make simplification and solving mathematically correct.", "x in domain", ["NO_DOMAIN", "Simplifying without needed domain information.", "State assumptions when domain affects the result."], [["Square roots", "sqrt(x^2)=x only if x is nonnegative."], ["Logs", "Inputs must be positive."], ["Fractions", "Denominators must be nonzero."]], "Assumptions describe a variable's what?", "domain"),
  447: item(447, "Exact / Numeric Toggle", "exact-numeric-toggle", "Exact/numeric toggle switches between symbolic form and decimal approximation.", "Show the active mode and keep rounded answers labelled.", "The toggle helps compare exact meaning with practical decimals.", "exact <-> numeric", ["MODE_CONFUSION", "Reading a rounded decimal as exact.", "Label exact and numeric modes clearly."], [["One third", "Exact 1/3 versus decimal 0.333..."], ["Pi", "Exact pi versus 3.14159."], ["Radicals", "sqrt(2) versus 1.414..."]], "Numeric mode usually gives an what?", "approximation"),
  448: item(448, "Step-by-Step Algebra", "step-by-step-algebra", "Step-by-step algebra shows each valid transformation in a solution.", "Reveal one algebra step with its reason.", "Step display helps learners connect rules to results.", "line by line transformations", ["STEPS_WITHOUT_REASONS", "Showing steps without explaining why they are valid.", "Give a reason for each important transformation."], [["Equation solving", "Subtract from both sides."], ["Factoring", "Use a common factor."], ["Expansion", "Use distributive law."]], "Step-by-step algebra should include steps and what?", "reasons"),
  449: item(449, "CAS-to-Graph Link", "cas-to-graph-link", "CAS-to-graph link connects symbolic expressions to their graph.", "Update the graph from the exact expression and show restrictions.", "The link helps learners see algebraic form and visual behaviour together.", "expression -> graph", ["GRAPH_ONLY", "Graphing without preserving symbolic restrictions.", "Carry restrictions from CAS to the graph."], [["Rational graph", "Show vertical asymptote from denominator."], ["Derivative graph", "Graph f and f' together."], ["Equation roots", "CAS roots match graph intercepts."]], "CAS-to-graph should carry symbolic what?", "restrictions"),
};

export function symbolicContinuationSeed(id: number) {
  return data[id];
}

export type SymbolicContinuationSeed = Seed;

export function symbolicContinuationLesson(seed: Seed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/symbolic-mathematics/${seed.id}-${seed.slug}`,
    category: "Symbolic Mathematics",
    topic: "CAS Workspace",
    lessonType: "tool",
    learningObjectives: [`Define ${seed.title}.`, seed.action, `Avoid this symbolic mistake: ${seed.misconception[1]}`],
    prerequisites: ["Algebraic expressions", "Variables", "Equivalent forms"],
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Restriction", meaning: "A value or domain condition needed for a symbolic result." }],
    introduction: `${seed.title} is a CAS workspace command. It helps learners work with exact symbolic objects and see why each result is valid.`,
    basicIdea: `${seed.definition} The basic idea is to transform expressions by accepted algebra rules. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then check the result against the original expression, equation, or domain.`,
    whyItWorks: "Symbolic commands are reliable only when each transformation preserves meaning and respects restrictions.",
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.slug}-fact`, statement: seed.reason }],
    formulas: [{ id: `${seed.slug}-rule`, label: `${seed.title} rule`, expression: seed.formula, variables: [{ symbol: "expression", meaning: "the symbolic input or equation" }], exactness: "definition" }],
    conditionsAndRestrictions: ["State variable domains when needed.", "Keep denominator restrictions.", "Label approximations when numeric solving is used."],
    representations: [{ id: `${seed.slug}-representation`, type: "symbolic_steps", learningPurpose: `Show exact CAS steps for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.challenge.prompt, steps: ["Choose the CAS command.", seed.action, "Check restrictions or equivalence."], answer: seed.challenge.expected }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: { id: `${seed.slug}-interaction`, learningPurpose: `Run ${seed.title} in a CAS workspace and read exact steps.`, parameters: [{ id: "expression", label: "Expression", validValues: ["x^2+5*x+6", "2*x+1=7", "1/((x+1)*(x+2))"] }], initialState: `Start with the ${seed.title} command.`, dynamicFeedback: "The command, exact result, steps, and restrictions update together.", successCriteria: ["Use the correct command", "Read the exact result", "Explain the common mistake"], accessibilityAlternative: "Provide the input, command, result, restrictions, and steps as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict the symbolic result before running the command." }, { id: "test", prompt: "Run the command and inspect each step." }, { id: "explain", prompt: "Explain why the result follows from accepted rules." }],
    practice: [practice(`${seed.slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"), practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"), practice(`${seed.slug}-multi`, `How should ${seed.title} be checked?`, seed.action, code, "multi_step"), practice(`${seed.slug}-error`, `What is wrong with this symbolic mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"), practice(`${seed.slug}-transfer`, `Give one use of ${seed.title}.`, seed.examples[0][0], code, "transfer")],
    challenge: { id: `${seed.slug}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses exact symbolic meaning", "Preserves equivalence or checks approximation", "Avoids the common mistake"], hints: [seed.challenge.hint, seed.misconception[2]] },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one exact rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names an exact symbolic check." }],
    accessibilityNotes: ["Read symbolic output as text.", "Expose restrictions separately from the result."],
    expertReviewRequired: false,
  };
}

export function symbolicContinuationChallenge(seed: Seed) {
  return seed.challenge;
}

function item(id: number, title: string, slug: string, definition: string, action: string, reason: string, formula: string, misconception: Seed["misconception"], examples: Seed["examples"], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, action, reason, formula, misconception, examples, challenge: { prompt, expected, hint: `Use the ${title} rule.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `symbolic.${slug}` } };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Use exact algebra rules.", "Check equivalence.", "Keep restrictions."], workedSolution: ["Identify the symbolic command.", "Apply the rule.", "Check the result."], misconceptionTag, difficulty, parameterConstraints: ["Use valid symbolic expressions."] };
}
