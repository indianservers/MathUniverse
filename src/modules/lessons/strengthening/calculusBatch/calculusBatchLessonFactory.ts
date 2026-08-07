import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type CalculusChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type CalculusSeed = {
  id: number;
  title: string;
  slug: string;
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  formulaVariables: [string, string][];
  how: string;
  why: string;
  examples: [string, string][];
  misconception: [string, string, string];
  worked: [string, string[], string];
  challenge: CalculusChallenge;
};

export function calculusLesson(seed: CalculusSeed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/calculus/${seed.id}-${seed.slug}`,
    category: "Calculus",
    topic: "Limits and Differential Calculus",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${seed.title}.`, `Use the graph and symbolic rule to test: ${seed.keyRule}`, `Correct a common ${seed.title} mistake.`],
    prerequisites: ["Functions", "Graphs", "Algebraic substitution"],
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Limit", meaning: "The value a function approaches as input gets close to a point." }],
    introduction: `${seed.title} studies change, closeness, or local graph behaviour. It matters in speed, growth, optimisation, physics, and engineering.`,
    basicIdea: `${seed.definition} The key rule is: ${seed.keyRule} A common mistake is ${seed.misconception[1]}`,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${seed.id}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.id}-fact`, statement: seed.keyRule }],
    formulas: [{ id: `${seed.id}-formula`, label: seed.formulaLabel, expression: seed.formulaExpression, variables: seed.formulaVariables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Check the domain near the point.", "Do not replace a limiting process with one distant graph reading."],
    representations: [{ id: `${seed.id}-graph`, type: "function_graph", learningPurpose: `Show the local behaviour for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.id}-worked-1`, prompt: seed.worked[0], steps: seed.worked[1], answer: seed.worked[2] }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${seed.id}-interaction`,
      learningPurpose: `Move x and h to connect ${seed.title} with the graph and exact symbolic rule.`,
      parameters: [{ id: "x", label: "Input x", validRange: [-4, 4] }, { id: "h", label: "Change h", validRange: [0.05, 2] }],
      initialState: `Start from: ${seed.worked[0]}`,
      dynamicFeedback: "The graph marker, secant slope, derivative, and symbolic result update together.",
      successCriteria: ["Read the local graph behaviour", "Connect it to the formula", "Explain the misconception"],
      accessibilityAlternative: "Provide f(x), secant slope, derivative, and formula as text.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict the local behaviour before moving h." }, { id: "observe", prompt: "Move h smaller and read the trend." }, { id: "explain", prompt: `Explain using ${seed.formulaLabel}.` }],
    practice: [
      practice(`${seed.id}-recognition`, `Name the key rule for ${seed.title}.`, seed.keyRule, code, "recognition"),
      practice(`${seed.id}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"),
      practice(`${seed.id}-multi`, seed.worked[0], seed.worked[2], code, "multi_step"),
      practice(`${seed.id}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${seed.id}-transfer`, `Give one real use of ${seed.title}.`, seed.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seed.id}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses the calculus definition", "Gives the correct value or statement", "Avoids the named mistake"], hints: [seed.challenge.hint, `Use ${seed.formulaLabel}.`] },
    exitCheck: [{ id: `${seed.id}-exit`, prompt: `State one exact check for ${seed.title}.`, answer: seed.misconception[2], criterion: "Names the accepted calculus rule." }],
    accessibilityNotes: ["Announce graph values and symbolic results.", "Do not rely only on curve colour."],
    expertReviewRequired: false,
  };
}

export function seed(input: CalculusSeed) {
  return input;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check the function and domain.", "Use the local graph behaviour.", "Apply the formula exactly."], workedSolution: ["Identify the calculus object.", "Apply the definition or rule.", "Check the result on the graph."], misconceptionTag, difficulty, parameterConstraints: ["Use values where the graph is visible and defined."] };
}
