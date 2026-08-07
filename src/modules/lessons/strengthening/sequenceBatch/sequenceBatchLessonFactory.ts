import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SequenceChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type SequenceSeed = {
  id: 334 | 335;
  title: string;
  slug: string;
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  variables: [string, string][];
  examples: [string, string][];
  misconception: [string, string, string];
  challenge: SequenceChallenge;
};

const entries: Record<334 | 335, SequenceSeed> = {
  334: {
    id: 334,
    title: "Sequence Generator",
    slug: "sequence-generator",
    definition: "A sequence generator creates ordered terms from a rule.",
    keyRule: "Each term is found by using the rule with its position number or previous terms.",
    formulaLabel: "Explicit rule",
    formulaExpression: "a_n=f(n)",
    variables: [["n", "term position"], ["a_n", "term at position n"]],
    examples: [["Saving plan", "Monthly totals form a sequence."], ["Calendar dates", "Every 7th day forms a sequence."], ["Computer loops", "A loop can generate ordered values."]],
    misconception: ["UNORDERED_LIST", "Treating a sequence as an unordered set.", "Order matters: a_1, a_2, and a_3 have positions."],
    challenge: { prompt: "For a_n=2n+1, find a_4.", expected: "9", hint: "Substitute n=4.", kind: "numeric", factoryId: "sequence.generator" },
  },
  335: {
    id: 335,
    title: "Arithmetic Sequences",
    slug: "arithmetic-sequences",
    definition: "An arithmetic sequence has a constant difference between consecutive terms.",
    keyRule: "Add the same difference d each time.",
    formulaLabel: "Arithmetic term",
    formulaExpression: "a_n=a_1+(n-1)d",
    variables: [["a_1", "first term"], ["d", "common difference"], ["n", "term position"]],
    examples: [["Pocket money", "Adding the same amount each week forms an arithmetic sequence."], ["Stair heights", "Each step rises by the same height."], ["Taxi meter", "A fixed cost added per kilometre can form a sequence."]],
    misconception: ["VARIABLE_DIFFERENCE", "Calling any increasing list arithmetic.", "The difference between neighbouring terms must stay constant."],
    challenge: { prompt: "For a_1=3 and d=5, find a_4.", expected: "18", hint: "Use a_n=a_1+(n-1)d.", kind: "numeric", factoryId: "sequence.arithmetic" },
  },
};

export function seed(id: 334 | 335) {
  return entries[id];
}

export function sequenceLesson(seedData: SequenceSeed): StrengthenedLesson {
  const code = seedData.misconception[0];
  return {
    id: seedData.id,
    title: seedData.title,
    route: `/lessons/advanced-mathematics/${seedData.id}-${seedData.slug}`,
    category: "Advanced Mathematics",
    topic: "Sequences and Series",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${seedData.title}.`, `Use the rule: ${seedData.keyRule}`, `Correct a common ${seedData.title} mistake.`],
    prerequisites: ["Counting", "Substitution", "Tables of values"],
    keyVocabulary: [{ term: seedData.title, meaning: seedData.definition }, { term: "Term", meaning: "One value in a sequence." }],
    introduction: `${seedData.title} studies ordered lists of numbers. It matters in saving money, patterns, computer loops, and repeated measurements.`,
    basicIdea: `${seedData.definition} The key rule is: ${seedData.keyRule} A common mistake is ${seedData.misconception[1]}`,
    howItWorks: "Choose the starting values. Use the formula or rule. Write each term in order and compare the pattern.",
    whyItWorks: "A sequence rule gives one clear output for each position, so the table, graph, and formula can be checked together.",
    definitions: [{ id: `${seedData.id}-definition`, statement: seedData.definition }],
    facts: [{ id: `${seedData.id}-fact`, statement: seedData.keyRule }],
    formulas: [{ id: `${seedData.id}-formula`, label: seedData.formulaLabel, expression: seedData.formulaExpression, variables: seedData.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Use positive integer positions unless a lesson states otherwise.", "Keep term order visible."],
    representations: [{ id: `${seedData.id}-table`, type: "table", learningPurpose: `Show ordered terms for ${seedData.title}.` }],
    workedExamples: [{ id: `${seedData.id}-worked-1`, prompt: seedData.challenge.prompt, steps: ["Identify the rule.", "Substitute the position or step count.", "Compute the term."], answer: seedData.challenge.expected }],
    realLifeExamples: seedData.examples.map(([context, connection], index) => ({ id: `${seedData.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seedData.misconception[1], correction: seedData.misconception[2] }],
    interaction: {
      id: `${seedData.id}-interaction`,
      learningPurpose: `Move sequence controls to connect ${seedData.title} with its table, partial sums, and formula.`,
      parameters: [{ id: "a", label: "First value", validRange: [-10, 20] }, { id: "b", label: "Rule parameter", validRange: [-10, 20] }, { id: "n", label: "Number of terms", validRange: [1, 20] }],
      initialState: `Start with ${seedData.formulaLabel}.`,
      dynamicFeedback: "Terms, partial sums, graph bars, and challenge values update together.",
      successCriteria: ["Read ordered terms", "Use the formula", "Explain the misconception"],
      accessibilityAlternative: "Provide the generated terms and partial sums as a table.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict the next term before moving the slider." }, { id: "observe", prompt: "Change the rule parameter and read the table." }, { id: "explain", prompt: `Explain using ${seedData.formulaLabel}.` }],
    practice: [
      practice(`${seedData.id}-recognition`, `Name the key rule for ${seedData.title}.`, seedData.keyRule, code, "recognition"),
      practice(`${seedData.id}-direct`, seedData.challenge.prompt, seedData.challenge.expected, code, "direct"),
      practice(`${seedData.id}-multi`, `Explain why order matters in ${seedData.title}.`, seedData.misconception[2], code, "multi_step"),
      practice(`${seedData.id}-error`, `What is wrong with this mistake: ${seedData.misconception[1]}`, seedData.misconception[2], code, "error_diagnosis"),
      practice(`${seedData.id}-transfer`, `Give one real use of ${seedData.title}.`, seedData.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seedData.id}-challenge`, prompt: seedData.challenge.prompt, successCriteria: ["Uses the rule", "Finds the correct term", "Keeps order clear"], hints: [seedData.challenge.hint, `Use ${seedData.formulaLabel}.`] },
    exitCheck: [{ id: `${seedData.id}-exit`, prompt: `State one exact check for ${seedData.title}.`, answer: seedData.misconception[2], criterion: "Names the accepted sequence rule." }],
    accessibilityNotes: ["Announce terms and partial sums.", "Do not rely only on bar height."],
    expertReviewRequired: false,
  };
}

export function sequenceChallenge(seedData: SequenceSeed) {
  return seedData.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check the term position.", "Use the displayed rule.", "Keep the order of terms."], workedSolution: ["Identify the rule.", "Substitute the values.", "Check the term order."], misconceptionTag, difficulty, parameterConstraints: ["Use integer term positions."] };
}
