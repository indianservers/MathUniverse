import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type GeometryBatchChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type GeometryBatchSeed = {
  id: number;
  title: string;
  route: string;
  topic: "Dynamic Geometry Constructions" | "Transformations and Loci";
  representation: "geometric_construction" | "transformation_animation" | "coordinate_graph" | "proof_diagram";
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
  challenge: GeometryBatchChallenge;
};

export function geometryBatchLesson(seed: GeometryBatchSeed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: "Geometry",
    topic: seed.topic,
    lessonType: seed.topic === "Transformations and Loci" ? "visual_exploration" : "tool",
    learningObjectives: [`Define ${seed.title}.`, `Use the construction to test: ${seed.keyRule}`, `Correct a common ${seed.title} mistake.`],
    prerequisites: ["Coordinate points", "Lines and angles", "Basic geometric construction tools"],
    keyVocabulary: [
      { term: seed.title, meaning: seed.definition },
      { term: "Invariant", meaning: "A property that stays unchanged during a construction or transformation." },
    ],
    introduction: `${seed.title} is a geometry lesson about an exact construction or transformation. It matters in drawings, maps, design, and checking shapes.`,
    basicIdea: `${seed.definition} The key rule is: ${seed.keyRule} A common mistake is ${seed.misconception[1]}`,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${seed.id}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.id}-fact`, statement: seed.keyRule }],
    formulas: [{ id: `${seed.id}-formula`, label: seed.formulaLabel, expression: seed.formulaExpression, variables: seed.formulaVariables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Use exact construction relationships, not visual guessing.", "Check any stated equality, angle, distance, or invariant after dragging."],
    representations: [{ id: `${seed.id}-representation`, type: seed.representation, learningPurpose: `Show the exact rule for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.id}-worked-1`, prompt: seed.worked[0], steps: seed.worked[1], answer: seed.worked[2] }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${seed.id}-interaction`,
      learningPurpose: `Drag the model and verify the exact rule for ${seed.title}.`,
      parameters: [{ id: "point", label: "Movable point", validRange: [-10, 10] }],
      initialState: `Start from: ${seed.worked[0]}`,
      dynamicFeedback: "The diagram reports the defining relation, distance, angle, or invariant.",
      successCriteria: ["Name the exact rule", "Check it after dragging", "Explain the misconception"],
      accessibilityAlternative: "Provide the same construction check as text measurements.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict what should stay true." }, { id: "observe", prompt: "Drag one point and read the check." }, { id: "explain", prompt: `Explain using ${seed.formulaLabel}.` }],
    practice: [
      practice(`${seed.id}-recognition`, `Name the exact rule for ${seed.title}.`, seed.keyRule, code, "recognition"),
      practice(`${seed.id}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"),
      practice(`${seed.id}-multi`, seed.worked[0], seed.worked[2], code, "multi_step"),
      practice(`${seed.id}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${seed.id}-transfer`, `Give one real use of ${seed.title}.`, seed.examples[0][0], code, "transfer"),
    ],
    challenge: { id: `${seed.id}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses the definition", "Checks the exact property", "Avoids the named mistake"], hints: [seed.challenge.hint, `Use ${seed.formulaLabel}.`] },
    exitCheck: [{ id: `${seed.id}-exit`, prompt: `State one exact check for ${seed.title}.`, answer: seed.misconception[2], criterion: "Names the defining property." }],
    accessibilityNotes: ["Announce key measurements and relations.", "Do not use colour as the only sign of correctness."],
    expertReviewRequired: false,
  };
}

export function seed(input: GeometryBatchSeed) {
  return input;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Start with the definition.", "Check the measurement or invariant.", "Drag-test the construction."], workedSolution: ["Identify the objects.", "Apply the exact construction rule.", "Verify the result after movement."], misconceptionTag, difficulty, parameterConstraints: ["Use non-degenerate positions where the object is visible."] };
}
