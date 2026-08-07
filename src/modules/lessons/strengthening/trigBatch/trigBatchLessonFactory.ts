import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type TrigChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type TrigSeed = {
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
  challenge: TrigChallenge;
};

export function trigLesson(seed: TrigSeed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/trigonometry/${seed.id}-${seed.slug}`,
    category: "Trigonometry",
    topic: "Trigonometry",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${seed.title}.`, `Use the unit circle or triangle to test: ${seed.keyRule}`, `Correct a common ${seed.title} mistake.`],
    prerequisites: ["Angles", "Right triangles", "Coordinate plane"],
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Angle", meaning: "A measure of turn." }],
    introduction: `${seed.title} connects angles with lengths, coordinates, or graphs. It matters in heights, waves, navigation, design, and motion.`,
    basicIdea: `${seed.definition} The key rule is: ${seed.keyRule} A common mistake is ${seed.misconception[1]}`,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${seed.id}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.id}-fact`, statement: seed.keyRule }],
    formulas: [{ id: `${seed.id}-formula`, label: seed.formulaLabel, expression: seed.formulaExpression, variables: seed.formulaVariables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Check whether the angle is in degrees or radians.", "Watch for undefined tangent or reciprocal values."],
    representations: [{ id: `${seed.id}-unit-circle`, type: "unit_circle", learningPurpose: `Show the angle relationship for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.id}-worked-1`, prompt: seed.worked[0], steps: seed.worked[1], answer: seed.worked[2] }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${seed.id}-interaction`,
      learningPurpose: `Move the angle and connect ${seed.title} to the unit circle and graph.`,
      parameters: [{ id: "angle", label: "Angle", validRange: [-360, 360] }],
      initialState: `Start from: ${seed.worked[0]}`,
      dynamicFeedback: "The unit circle, ratio values, and graph marker update together.",
      successCriteria: ["Read the angle", "Connect the formula to the display", "Explain the misconception"],
      accessibilityAlternative: "Provide sine, cosine, tangent, and angle values as text.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict the trig value before moving the angle." }, { id: "observe", prompt: "Move the angle and read the linked value." }, { id: "explain", prompt: `Explain using ${seed.formulaLabel}.` }],
    practice: [
      practice(`${seed.id}-recognition`, `Name the key rule for ${seed.title}.`, seed.keyRule, code, "recognition"),
      practice(`${seed.id}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"),
      practice(`${seed.id}-multi`, seed.worked[0], seed.worked[2], code, "multi_step"),
      practice(`${seed.id}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${seed.id}-transfer`, `Give one real use of ${seed.title}.`, seed.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seed.id}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses the trig rule", "Gives the correct value or statement", "Avoids the named mistake"], hints: [seed.challenge.hint, `Use ${seed.formulaLabel}.`] },
    exitCheck: [{ id: `${seed.id}-exit`, prompt: `State one exact check for ${seed.title}.`, answer: seed.misconception[2], criterion: "Names the accepted trig rule." }],
    accessibilityNotes: ["Announce angle values and trig outputs.", "Do not rely only on graph colour."],
    expertReviewRequired: false,
  };
}

export function seed(input: TrigSeed) {
  return input;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check the angle unit.", "Use the unit circle or triangle ratio.", "Watch for undefined values."], workedSolution: ["Identify the angle or triangle.", "Apply the trig definition.", "Check the value against the visual model."], misconceptionTag, difficulty, parameterConstraints: ["Use standard angles or visible graph values."] };
}
