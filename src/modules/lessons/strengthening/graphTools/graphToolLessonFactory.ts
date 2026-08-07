import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type GraphToolChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type GraphToolSeed = {
  id: number;
  title: string;
  slug: string;
  definition: string;
  vocabulary: [string, string][];
  formula: StrengthenedLesson["formulas"][number];
  intro: string;
  basicIdea: string;
  how: string;
  why: string;
  examples: [string, string][];
  misconception: [string, string, string];
  worked: [string, string[], string];
  challenge: GraphToolChallenge;
};

export function graphToolLesson(seed: GraphToolSeed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/graphs-and-functions/${seed.id}-${seed.slug}`,
    category: "Graphs and Functions",
    topic: "2D Graphing Calculator",
    lessonType: "tool",
    learningObjectives: [`Define ${seed.title}.`, "Connect graph input, visual output, and table checks.", `Avoid a common ${seed.title} error.`],
    prerequisites: ["Coordinate plane", "Function notation", "Reading x and y values"],
    keyVocabulary: seed.vocabulary.map(([term, meaning]) => ({ term, meaning })),
    introduction: seed.intro,
    basicIdea: seed.basicIdea,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.slug}-fact-1`, statement: "A graph is reliable only when its rule, axes, and scale are interpreted together." }],
    formulas: [seed.formula],
    conditionsAndRestrictions: seed.formula.restrictions ?? ["Check domain restrictions before reading graph points."],
    representations: [{ id: `${seed.slug}-graph`, type: "function_graph", learningPurpose: `Show the key visual feature of ${seed.title}.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.worked[0], steps: seed.worked[1], answer: seed.worked[2] }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${seed.slug}-interaction`,
      learningPurpose: `Use ${seed.title} to compare the rule, graph, and table.`,
      parameters: [{ id: "a", label: "Graph parameter a", validRange: [-5, 5] }, { id: "b", label: "Graph parameter b", validRange: [-5, 5] }],
      initialState: `Start from: ${seed.worked[0]}`,
      dynamicFeedback: "The graph, expression, and table update from the same rule.",
      successCriteria: ["Read one graph point", "Connect it to the expression", "Explain the misconception"],
      accessibilityAlternative: "Read a text table of x-values and y-values.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict one point before changing the graph." }, { id: "observe", prompt: "Move one parameter and read the table." }, { id: "explain", prompt: `Explain the result using ${seed.formula.label}.` }],
    practice: [
      practice(`${seed.slug}-recognition`, `Name the key rule in ${seed.title}.`, seed.formula.label, code, "recognition"),
      practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"),
      practice(`${seed.slug}-multi`, seed.worked[0], seed.worked[2], code, "multi_step"),
      practice(`${seed.slug}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${seed.slug}-transfer`, `Give one real use of ${seed.title}.`, seed.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seed.slug}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses the graph rule", "Reads the correct feature", "Avoids the named mistake"], hints: [seed.challenge.hint, `Use ${seed.formula.label}.`] },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one check for ${seed.title}.`, answer: seed.misconception[2], criterion: "Names the correct graph interpretation." }],
    accessibilityNotes: ["Expose graph points in the table.", "Do not rely on colour alone for graph comparisons."],
    expertReviewRequired: false,
  };
}

export function seed(id: number, title: string, slug: string, definition: string, vocabulary: [string, string][], formulaItem: StrengthenedLesson["formulas"][number], intro: string, basicIdea: string, how: string, why: string, examples: [string, string][], misconception: [string, string, string], worked: [string, string[], string], challenge: GraphToolChallenge): GraphToolSeed {
  return { id, title, slug, definition, vocabulary, formula: formulaItem, intro, basicIdea, how, why, examples, misconception, worked, challenge };
}

export function formula(label: string, expression: string, variables: [string, string][], restrictions?: string[]): StrengthenedLesson["formulas"][number] {
  return { id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), label, expression, variables: variables.map(([symbol, meaning]) => ({ symbol, meaning })), restrictions, exactness: "definition" };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Read the graph rule.", "Check the table.", "Match the visual feature."], workedSolution: ["Identify the graph object.", "Apply the displayed rule.", "Check the table or feature."], misconceptionTag, difficulty, parameterConstraints: ["Use graph values visible in the lesson table."] };
}
