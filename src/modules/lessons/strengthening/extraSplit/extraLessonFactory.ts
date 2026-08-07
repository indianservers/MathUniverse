import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type ExtraChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type ExtraSeed = {
  id: number;
  title: string;
  route: string;
  category: string;
  topic: string;
  representation: StrengthenedLesson["representations"][number]["type"];
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
  challenge: ExtraChallenge;
};

export function extraLesson(seed: ExtraSeed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: seed.category,
    topic: seed.topic,
    lessonType: "concept",
    learningObjectives: [`Define ${seed.title}.`, "Use the linked visual model to check the idea.", `Correct a common ${seed.title} mistake.`],
    prerequisites: seed.category === "Geometry" ? ["Points", "Lines", "Circle and polygon basics"] : ["Real numbers", "Coordinate plane", "Basic algebra"],
    keyVocabulary: seed.vocabulary.map(([term, meaning]) => ({ term, meaning })),
    introduction: seed.intro,
    basicIdea: seed.basicIdea,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${seed.id}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.id}-fact`, statement: "The construction or number model must satisfy its defining condition exactly." }],
    formulas: [seed.formula],
    conditionsAndRestrictions: seed.formula.restrictions ?? ["Use the stated definition before applying a formula."],
    representations: [{ id: `${seed.id}-representation`, type: seed.representation, learningPurpose: `Show the defining structure of ${seed.title}.` }],
    workedExamples: [{ id: `${seed.id}-worked-1`, prompt: seed.worked[0], steps: seed.worked[1], answer: seed.worked[2] }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${seed.id}-interaction`,
      learningPurpose: `Use the visual model to test ${seed.title}.`,
      parameters: [{ id: "control", label: "Model control", validRange: [-10, 10] }],
      initialState: `Start from: ${seed.worked[0]}`,
      dynamicFeedback: "The display updates the defining measurement or relationship.",
      successCriteria: ["Identify the defining condition", "Check one example", "Explain the misconception"],
      accessibilityAlternative: "Provide the same relationship as text and a table of values.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict what must stay true." }, { id: "observe", prompt: "Move the model and read the measured result." }, { id: "explain", prompt: `Explain using ${seed.formula.label}.` }],
    practice: [
      practice(`${seed.id}-recognition`, `Name the key rule for ${seed.title}.`, seed.formula.label, code, "recognition"),
      practice(`${seed.id}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"),
      practice(`${seed.id}-multi`, seed.worked[0], seed.worked[2], code, "multi_step"),
      practice(`${seed.id}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${seed.id}-transfer`, `Give one real use of ${seed.title}.`, seed.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seed.id}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses the definition", "Gives the correct value or condition", "Avoids the named mistake"], hints: [seed.challenge.hint, `Use ${seed.formula.label}.`] },
    exitCheck: [{ id: `${seed.id}-exit`, prompt: `State one exact check for ${seed.title}.`, answer: seed.misconception[2], criterion: "Names the defining condition." }],
    accessibilityNotes: ["Announce measured values.", "Keep controls keyboard-operable."],
    expertReviewRequired: false,
  };
}

export function formula(label: string, expression: string, variables: [string, string][], restrictions?: string[]): StrengthenedLesson["formulas"][number] {
  return { id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), label, expression, variables: variables.map(([symbol, meaning]) => ({ symbol, meaning })), restrictions, exactness: "definition" };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Start with the definition.", "Use the visual or formula.", "Check the condition."], workedSolution: ["Identify the object.", "Apply the definition.", "Check the result."], misconceptionTag, difficulty, parameterConstraints: ["Use values that keep the model visible."] };
}
