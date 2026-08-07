import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type AuthoringContinuationChallenge = {
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
  representation: "text_table" | "function_graph" | "proof_diagram" | "transformation_animation";
  misconception: [string, string, string];
  examples: [string, string][];
  challenge: AuthoringContinuationChallenge;
};

const data: Record<number, Seed> = {
  648: item(648, "Graph Matching", "graph-matching", "Graph matching asks learners to make a graph fit a target graph or situation.", "Show the target, let learners change parameters, and compare important features.", "Matching focuses attention on slope, intercepts, shape, and scale.", "function_graph", ["MATCH_BY_LOOKS", "Matching only by rough appearance.", "Check key features such as intercepts, turning points, and scale."], [["Linear graph", "Adjust slope and intercept to match a line."], ["Quadratic graph", "Move the vertex to a target."], ["Data model", "Fit a curve to measured points."]], "Name one feature used in graph matching.", "intercept"),
  649: item(649, "Error Diagnosis", "error-diagnosis", "Error diagnosis asks learners to find and correct a mistake.", "Show the work, ask where the first wrong step appears, and require a correction.", "Finding an error builds deeper understanding than only giving an answer.", "text_table", ["ONLY_FINAL", "Checking only whether the final answer is wrong.", "Find the first wrong step and explain why it is wrong."], [["Algebra", "Spot a sign error."], ["Geometry", "Find a wrong theorem use."], ["Statistics", "Find a wrong mean calculation."]], "What step should error diagnosis find first?", "wrong"),
  650: item(650, "Multiple Representations", "multiple-representations", "Multiple representations show the same idea in more than one form.", "Link a table, graph, equation, diagram, or words so changes agree.", "Seeing the same idea in different forms helps transfer learning.", "proof_diagram", ["UNLINKED_VIEWS", "Showing forms that do not update together.", "Keep representations linked to the same mathematical object."], [["Function", "Show equation, table, and graph."], ["Fraction", "Show symbol, bar model, and decimal."], ["Vector", "Show components and arrow."]], "Multiple representations should show the same what?", "idea"),
  651: item(651, "Real-World Application", "real-world-application", "A real-world application connects a concept to a realistic situation.", "Define the context, variables, units, and question.", "Applications show why the mathematics is useful outside the lesson.", "text_table", ["FAKE_CONTEXT", "Adding a story that does not affect the mathematics.", "Use a context where variables and units matter."], [["Shopping", "Percent discount changes price."], ["Travel", "Speed links distance and time."], ["Building", "Area estimates materials."]], "What should real-world variables include?", "units"),
  652: item(652, "Open Investigation", "open-investigation", "An open investigation lets learners explore a question with more than one path.", "Give a clear question, useful tools, and criteria for a good explanation.", "Open tasks develop reasoning and communication.", "transformation_animation", ["NO_CRITERIA", "Leaving learners with no way to judge their result.", "Give criteria for evidence and explanation."], [["Patterns", "Find a rule for growing shapes."], ["Geometry", "Investigate when a quadrilateral is a square."], ["Data", "Explore which model fits best."]], "An open investigation needs criteria for what?", "explanation"),
  653: item(653, "Dynamic Question Generator", "dynamic-question-generator", "A dynamic question generator creates varied questions from rules.", "Set allowed values, answer rules, and checks for invalid cases.", "Generated questions give repeated practice without hand-writing every item.", "text_table", ["BAD_RANDOM_VALUES", "Generating values that break the question.", "Use constraints so every generated question is valid."], [["Arithmetic", "Generate addition questions."], ["Graphs", "Generate lines with integer intercepts."], ["Geometry", "Generate triangles with valid side lengths."]], "Dynamic questions need constraints to stay what?", "valid"),
  654: item(654, "Mastery Challenge", "mastery-challenge", "A mastery challenge checks whether learners can use a skill independently.", "Require the key steps, final answer, and explanation.", "Mastery tasks show readiness to move on.", "proof_diagram", ["TOO_EASY", "Testing only recall in a mastery task.", "Include enough steps to show independent understanding."], [["Equation mastery", "Solve and explain a multi-step equation."], ["Graph mastery", "Match a function and justify it."], ["Geometry mastery", "Construct and prove a result."]], "Mastery challenges should show independent what?", "understanding"),
  655: item(655, "Exit Ticket", "exit-ticket", "An exit ticket is a short final check at the end of a lesson.", "Ask one focused question tied to the lesson objective.", "It helps the teacher see who is ready and who needs help.", "text_table", ["TOO_LONG", "Making the exit ticket a full test.", "Use one short focused check."], [["One-minute answer", "Explain why a step is valid."], ["Quick calculation", "Solve one direct problem."], ["Reflection", "Name the common mistake to avoid."]], "An exit ticket should be short and what?", "focused"),
  656: item(656, "Revision Summary", "revision-summary", "A revision summary collects the key ideas, rules, and common mistakes.", "List the main rule, one example, and one warning.", "Summaries help learners review without rereading the whole lesson.", "text_table", ["EVERY_DETAIL", "Putting the whole lesson into the summary.", "Keep only the highest-value ideas and checks."], [["Formula card", "List area formulas with units."], ["Mistake list", "Show signs or restrictions to check."], ["Example card", "Show one solved example."]], "A revision summary should keep only key what?", "ideas"),
};

export function authoringContinuationSeed(id: number) {
  return data[id];
}

export type AuthoringContinuationSeed = Seed;

export function authoringContinuationLesson(seed: Seed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/authoring-and-learning-system/${seed.id}-${seed.slug}`,
    category: "Authoring and Learning System",
    topic: "Lesson and Assessment Pages",
    lessonType: "practice",
    learningObjectives: [`Define ${seed.title}.`, seed.action, `Correct this design mistake: ${seed.misconception[1]}`],
    prerequisites: ["Lesson objective", "Learner feedback", "Basic activity design"],
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Criterion", meaning: "A rule used to judge whether work is successful." }],
    introduction: `${seed.title} is a lesson-page pattern. It helps learners practise, explain, review, or show understanding before moving on.`,
    basicIdea: `${seed.definition} The basic idea is to make the learner action clear and connected to the lesson goal. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then test the learner view and check that feedback matches the goal.`,
    whyItWorks: "Learning pages work best when the task, evidence, and feedback all point to the same concept.",
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.slug}-fact`, statement: seed.reason }],
    formulas: [],
    conditionsAndRestrictions: ["Use one clear lesson goal.", "Keep success criteria visible.", "Do not hide important feedback inside decoration."],
    representations: [{ id: `${seed.slug}-representation`, type: seed.representation, learningPurpose: `Show the learner task structure for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.challenge.prompt, steps: ["Read the page pattern.", seed.action, "Check the success criterion."], answer: seed.challenge.expected }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: { id: `${seed.slug}-interaction`, learningPurpose: `Preview a ${seed.title} page pattern.`, parameters: [{ id: "value", label: "Progress", validRange: [0, 100] }, { id: "enabled", label: "Feedback visible", validValues: ["true", "false"] }], initialState: `Start with a labelled ${seed.title} activity.`, dynamicFeedback: "The preview updates the page label, progress value, and event log.", successCriteria: ["Name the task purpose", "Use the success criterion", "Explain the design mistake"], accessibilityAlternative: "Provide the page goal, learner action, and feedback as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict what learner evidence this page should collect." }, { id: "test", prompt: "Change one setting and read the preview." }, { id: "explain", prompt: "Explain how the page checks understanding." }],
    practice: [practice(`${seed.slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"), practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"), practice(`${seed.slug}-multi`, `How do you set up ${seed.title}?`, seed.action, code, "multi_step"), practice(`${seed.slug}-error`, `What is wrong with this design: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"), practice(`${seed.slug}-transfer`, `Give one classroom use of ${seed.title}.`, seed.examples[0][0], code, "transfer")],
    challenge: { id: `${seed.slug}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Names the design rule", "Connects the rule to learner evidence", "Avoids the common mistake"], hints: [seed.challenge.hint, seed.misconception[2]] },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one design rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer gives a concrete design rule." }],
    accessibilityNotes: ["Feedback must be readable as text.", "Controls must be keyboard reachable."],
    expertReviewRequired: false,
  };
}

export function authoringContinuationChallenge(seed: Seed) {
  return seed.challenge;
}

function item(id: number, title: string, slug: string, definition: string, action: string, reason: string, representation: Seed["representation"], misconception: Seed["misconception"], examples: Seed["examples"], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, action, reason, representation, misconception, examples, challenge: { prompt, expected, hint: `Use the ${title} design rule.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `authoring.${slug}` } };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Name the task.", "Check the evidence.", "Match feedback to the goal."], workedSolution: ["Identify the page pattern.", "Apply the design rule.", "Check the learner-facing result."], misconceptionTag, difficulty, parameterConstraints: ["Use a clear goal and valid success criterion."] };
}
