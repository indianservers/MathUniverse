import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SymbolicBatchChallenge = {
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
  challenge: SymbolicBatchChallenge;
};

const data: Record<number, Seed> = {
  428: item(428, "Symbolic Evaluation", "symbolic-evaluation", "Symbolic evaluation finds an exact value or form using symbols.", "Enter the expression, choose exact mode, and check restrictions.", "Exact symbolic work preserves forms such as fractions, radicals, and pi.", "evaluate(expression)", ["DECIMAL_ONLY", "Using a decimal when an exact symbolic form is needed.", "Keep exact form unless the task asks for an approximation."], [["Fractions", "1/3 stays exact."], ["Radicals", "sqrt(8) can simplify to 2sqrt(2)."], ["Pi", "pi can remain symbolic."]], "Symbolic evaluation should preserve exact what?", "form"),
  429: item(429, "Simplify", "simplify", "Simplify rewrites an expression into an equivalent cleaner form.", "Combine like terms, reduce common factors, and preserve restrictions.", "Simplification keeps the same value wherever the original expression is defined.", "same value on allowed domain", ["CHANGED_VALUE", "Changing the expression's value while making it look shorter.", "Only use equivalent steps and keep restrictions."], [["Like terms", "2x+3x simplifies to 5x."], ["Fractions", "2/4 simplifies to 1/2."], ["Radicals", "sqrt(12) simplifies to 2sqrt(3)."]], "Simplify must keep the same what?", "value"),
  430: item(430, "Expand", "expand", "Expand rewrites products or powers as sums of terms.", "Multiply each required term and combine like terms after expansion.", "Expansion is useful for comparing coefficients and solving equations.", "a(b+c)=ab+ac", ["MISSED_TERM", "Multiplying only one term inside a bracket.", "Multiply the outside factor by every term inside."], [["Distributive law", "3(x+2)=3x+6."], ["Double brackets", "(x+1)(x+2)=x^2+3x+2."], ["Area model", "A rectangle can show all products."]], "When expanding, multiply every inside what?", "term"),
};

export function symbolicSeed(id: number) {
  return data[id];
}

export type SymbolicBatchSeed = Seed;

export function symbolicBatchLesson(seed: Seed): StrengthenedLesson {
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
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Equivalent", meaning: "Having the same value for every allowed input." }],
    introduction: `${seed.title} is a symbolic mathematics command. It helps us work with exact expressions instead of only decimal answers.`,
    basicIdea: `${seed.definition} The basic idea is to transform symbols using valid algebra rules. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then compare the result with the original expression on allowed values.`,
    whyItWorks: "Symbolic commands use algebraic rules that preserve meaning, so restrictions and exact forms must be tracked.",
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.slug}-fact`, statement: seed.reason }],
    formulas: [{ id: `${seed.slug}-rule`, label: `${seed.title} rule`, expression: seed.formula, variables: [{ symbol: "expression", meaning: "the symbolic input" }], exactness: "definition" }],
    conditionsAndRestrictions: ["Keep denominator restrictions.", "Use exact form unless approximation is requested.", "Check that the transformed expression is equivalent."],
    representations: [{ id: `${seed.slug}-representation`, type: "symbolic_steps", learningPurpose: `Show exact CAS steps for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.challenge.prompt, steps: ["Read the symbolic command.", seed.action, "Check exactness and restrictions."], answer: seed.challenge.expected }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: { id: `${seed.slug}-interaction`, learningPurpose: `Run ${seed.title} in a CAS workspace.`, parameters: [{ id: "expression", label: "Expression", validValues: ["2*x+3*x", "(x+2)*(x-3)", "sqrt(8)"] }], initialState: `Start with a ${seed.title} command and a simple expression.`, dynamicFeedback: "The exact result, step explanation, and restrictions update together.", successCriteria: ["Enter a valid expression", "Read the exact result", "Explain the common mistake"], accessibilityAlternative: "Provide the input expression, command name, result, and steps as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict the symbolic result before running the command." }, { id: "test", prompt: "Run the command and read each step." }, { id: "explain", prompt: "Explain why the result is equivalent." }],
    practice: [practice(`${seed.slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"), practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"), practice(`${seed.slug}-multi`, `How should ${seed.title} be checked?`, seed.action, code, "multi_step"), practice(`${seed.slug}-error`, `What is wrong with this symbolic mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"), practice(`${seed.slug}-transfer`, `Give one use of ${seed.title}.`, seed.examples[0][0], code, "transfer")],
    challenge: { id: `${seed.slug}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses exact symbolic meaning", "Preserves equivalence", "Avoids the common mistake"], hints: [seed.challenge.hint, seed.misconception[2]] },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one exact rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names exactness or equivalence." }],
    accessibilityNotes: ["Read symbolic output as text.", "Expose restrictions separately from the result."],
    expertReviewRequired: false,
  };
}

export function symbolicBatchChallenge(seed: Seed) {
  return seed.challenge;
}

function item(id: number, title: string, slug: string, definition: string, action: string, reason: string, formula: string, misconception: Seed["misconception"], examples: Seed["examples"], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, action, reason, formula, misconception, examples, challenge: { prompt, expected, hint: `Use the ${title} rule.`, kind: "keywords", factoryId: `symbolic.${slug}` } };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Use exact algebra rules.", "Check equivalence.", "Keep restrictions."], workedSolution: ["Identify the symbolic command.", "Apply the rule.", "Check the result."], misconceptionTag, difficulty, parameterConstraints: ["Use valid symbolic expressions."] };
}
