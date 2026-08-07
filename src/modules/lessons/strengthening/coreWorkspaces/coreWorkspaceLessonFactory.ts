import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type CoreWorkspaceChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type CoreWorkspaceSeed = {
  id: number;
  title: string;
  slug: string;
  topic: string;
  adapter: "calculator" | "algebra";
  representation: "calculator_trace" | "symbolic_steps" | "text_table";
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
  challenge: CoreWorkspaceChallenge;
};

export function coreWorkspaceLesson(seed: CoreWorkspaceSeed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/core-workspaces/${seed.id}-${seed.slug}`,
    category: "Core Workspaces",
    topic: seed.topic,
    lessonType: "tool",
    learningObjectives: [
      `Define the purpose of ${seed.title}.`,
      `Use the live ${seed.adapter === "calculator" ? "calculator" : "algebra"} tool with correct input rules.`,
      `Check the result and avoid a common ${seed.title} mistake.`,
    ],
    prerequisites: seed.adapter === "calculator" ? ["Whole-number operations", "Fractions and decimals", "Reading calculator notation"] : ["Variables", "Expressions", "Equality"],
    keyVocabulary: seed.vocabulary.map(([term, meaning]) => ({ term, meaning })),
    introduction: seed.intro,
    basicIdea: seed.basicIdea,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [
      { id: `${seed.slug}-fact-1`, statement: seed.adapter === "calculator" ? "Calculator results are reliable only when the expression and mode are correct." : "Linked algebra objects update when their defining values change." },
      { id: `${seed.slug}-fact-2`, statement: "A visible trace helps connect input, rule, and output." },
    ],
    formulas: [seed.formula],
    conditionsAndRestrictions: seed.formula.restrictions ?? ["Use valid mathematical input syntax.", "Check units and modes before interpreting the answer."],
    representations: [{ id: `${seed.slug}-trace`, type: seed.representation, learningPurpose: `Show how ${seed.title} connects input to output.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.worked[0], steps: seed.worked[1], answer: seed.worked[2] }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${seed.slug}-interaction`,
      learningPurpose: `Use ${seed.title} to connect a precise input with a checked output.`,
      parameters: [{ id: seed.adapter === "calculator" ? "expression" : "coefficient", label: seed.adapter === "calculator" ? "Expression" : "Algebra value", validValues: [seed.worked[0]] }],
      initialState: `Start from: ${seed.worked[0]}`,
      dynamicFeedback: `The display should show the input, the computed result, and the key ${seed.title} check.`,
      successCriteria: ["Use the correct input form", "Read the displayed result", "Explain the common mistake"],
      accessibilityAlternative: "Read the input, rule, and output as a short text trace.",
    },
    guidedExploration: [
      { id: "predict", prompt: "Predict the result before pressing evaluate or reveal." },
      { id: "observe", prompt: "Run the tool and compare the displayed output with your prediction." },
      { id: "explain", prompt: `Explain the result using the ${seed.formula.label} rule.` },
    ],
    practice: [
      practice(`${seed.slug}-recognition`, `Name the main rule used in ${seed.title}.`, seed.formula.label, code, "recognition"),
      practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"),
      practice(`${seed.slug}-multi`, `Use the worked example for ${seed.title} and explain the answer.`, seed.worked[2], code, "multi_step"),
      practice(`${seed.slug}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${seed.slug}-transfer`, `Give one real situation where ${seed.title} helps.`, seed.examples[0][0], code, "transfer"),
    ],
    challenge: {
      id: `${seed.slug}-challenge`,
      prompt: seed.challenge.prompt,
      successCriteria: ["Uses the exact lesson rule", "Matches the checked output", "Avoids the named mistake"],
      hints: [seed.challenge.hint, `Use ${seed.formula.label}.`],
    },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one input rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "The answer must name the correct input or checking rule." }],
    accessibilityNotes: ["Announce the input and output text.", "Keep calculator and reveal controls keyboard-operable."],
    expertReviewRequired: false,
  };
}

export function seed(
  id: number,
  title: string,
  slug: string,
  topic: string,
  adapter: CoreWorkspaceSeed["adapter"],
  representation: CoreWorkspaceSeed["representation"],
  definition: string,
  vocabulary: [string, string][],
  formulaItem: StrengthenedLesson["formulas"][number],
  intro: string,
  basicIdea: string,
  how: string,
  why: string,
  examples: [string, string][],
  misconception: [string, string, string],
  worked: [string, string[], string],
  challenge: CoreWorkspaceChallenge,
): CoreWorkspaceSeed {
  return { id, title, slug, topic, adapter, representation, definition, vocabulary, formula: formulaItem, intro, basicIdea, how, why, examples, misconception, worked, challenge };
}

export function formula(
  label: string,
  expression: string,
  variables: [string, string][],
  restrictions?: string[],
): StrengthenedLesson["formulas"][number] {
  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    label,
    expression,
    variables: variables.map(([symbol, meaning]) => ({ symbol, meaning })),
    restrictions,
    exactness: "definition",
  };
}

function practice(
  id: string,
  prompt: string,
  answer: string,
  misconceptionTag: string,
  difficulty: StrengthenedLesson["practice"][number]["difficulty"],
): StrengthenedLesson["practice"][number] {
  return {
    id,
    prompt,
    answer,
    hints: ["Read the input carefully.", "Use the lesson rule.", "Compare with the displayed output."],
    workedSolution: ["Identify the input.", "Apply the correct rule.", "Check that the output matches the rule."],
    misconceptionTag,
    difficulty,
    parameterConstraints: ["Use valid syntax and the lesson's stated mode."],
  };
}
