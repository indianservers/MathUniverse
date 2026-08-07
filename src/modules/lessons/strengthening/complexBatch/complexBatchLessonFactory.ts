import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type ComplexBatchChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type Seed = {
  id: 365 | 366;
  title: string;
  slug: string;
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  variables: [string, string][];
  misconception: [string, string, string];
  challenge: ComplexBatchChallenge;
};

const data: Record<365 | 366, Seed> = {
  365: { id: 365, title: "Complex Plane", slug: "complex-plane", definition: "The complex plane shows a complex number as a point with real and imaginary coordinates.", keyRule: "a+bi is plotted at (a,b).", formulaLabel: "Plane point", formulaExpression: "z=a+bi -> (a,b)", variables: [["a", "real coordinate"], ["b", "imaginary coordinate"]], misconception: ["IMAGINARY_AS_X", "Plotting the imaginary part on the horizontal axis.", "Real is horizontal; imaginary is vertical."], challenge: { prompt: "Where is z=3+2i plotted?", expected: "(3,2)", hint: "Use real part as x and imaginary part as y.", kind: "keywords", factoryId: "complex.plane" } },
  366: { id: 366, title: "Real and Imaginary Parts", slug: "real-and-imaginary-parts", definition: "The real part is the a in a+bi, and the imaginary part is the coefficient b.", keyRule: "For z=a+bi, Re(z)=a and Im(z)=b.", formulaLabel: "Parts of z", formulaExpression: "Re(a+bi)=a, Im(a+bi)=b", variables: [["a", "real part"], ["b", "imaginary part"]], misconception: ["INCLUDE_I", "Saying the imaginary part of 3+2i is 2i.", "The imaginary part is the real coefficient 2."], challenge: { prompt: "For z=3+2i, what is Im(z)?", expected: "2", hint: "Im(z) is the coefficient of i.", kind: "numeric", factoryId: "complex.parts" } },
};

export function seed(id: 365 | 366) {
  return data[id];
}

export function complexBatchLesson(item: Seed): StrengthenedLesson {
  const code = item.misconception[0];
  return {
    id: item.id,
    title: item.title,
    route: `/lessons/advanced-mathematics/${item.id}-${item.slug}`,
    category: "Advanced Mathematics",
    topic: "Complex Numbers",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${item.title}.`, `Use the rule: ${item.keyRule}`, `Correct a common ${item.title} mistake.`],
    prerequisites: ["Coordinate plane", "Negative numbers", "Algebraic notation"],
    keyVocabulary: [{ term: item.title, meaning: item.definition }, { term: "Complex number", meaning: "A number written as a+bi, where i^2=-1." }],
    introduction: `${item.title} helps us see complex numbers on a coordinate plane. It matters in rotations, waves, electrical signals, and advanced algebra.`,
    basicIdea: `${item.definition} The key rule is: ${item.keyRule} A common mistake is ${item.misconception[1]}`,
    howItWorks: "Read the real part and imaginary coefficient. Plot or report them in the correct order. Use the plane to compare size and direction.",
    whyItWorks: "The complex plane uses two perpendicular axes, so one number can carry both horizontal and vertical information.",
    definitions: [{ id: `${item.id}-definition`, statement: item.definition }],
    facts: [{ id: `${item.id}-fact`, statement: item.keyRule }],
    formulas: [{ id: `${item.id}-formula`, label: item.formulaLabel, expression: item.formulaExpression, variables: item.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Use a+bi form before reading parts.", "The imaginary part is b, not bi, in standard notation."],
    representations: [{ id: `${item.id}-plane`, type: "coordinate_graph", learningPurpose: `Show ${item.title} on the complex plane.` }],
    workedExamples: [{ id: `${item.id}-worked-1`, prompt: item.challenge.prompt, steps: ["Write z in a+bi form.", "Read a and b.", "Apply the plane or part rule."], answer: item.challenge.expected }],
    realLifeExamples: [{ id: `${item.id}-real-1`, context: "AC electricity", connection: "Complex numbers track size and phase." }, { id: `${item.id}-real-2`, context: "Rotations", connection: "Complex multiplication can rotate points." }, { id: `${item.id}-real-3`, context: "Signals", connection: "Real and imaginary parts store two linked components." }],
    misconceptions: [{ code, mistake: item.misconception[1], correction: item.misconception[2] }],
    interaction: { id: `${item.id}-interaction`, learningPurpose: `Move real and imaginary sliders to connect ${item.title} with the complex plane.`, parameters: [{ id: "real", label: "Real part", validRange: [-5, 5] }, { id: "imaginary", label: "Imaginary part", validRange: [-3, 3] }], initialState: `Start with ${item.formulaLabel}.`, dynamicFeedback: "The point, modulus, argument, and displayed complex value update together.", successCriteria: ["Read real and imaginary parts", "Plot the point", "Explain the misconception"], accessibilityAlternative: "Provide coordinates, modulus, and argument as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict where the point will move." }, { id: "observe", prompt: "Move one slider and read the coordinate." }, { id: "explain", prompt: `Explain using ${item.formulaLabel}.` }],
    practice: [practice(`${item.id}-recognition`, `Name the key rule for ${item.title}.`, item.keyRule, code, "recognition"), practice(`${item.id}-direct`, item.challenge.prompt, item.challenge.expected, code, "direct"), practice(`${item.id}-multi`, `State the correction for ${item.title}.`, item.misconception[2], code, "multi_step"), practice(`${item.id}-error`, `What is wrong with this mistake: ${item.misconception[1]}`, item.misconception[2], code, "error_diagnosis"), practice(`${item.id}-transfer`, `Give one real use of ${item.title}.`, "AC electricity", code, "transfer")],
    challenge: { id: `${item.id}-challenge`, prompt: item.challenge.prompt, successCriteria: ["Reads a+bi correctly", "Uses the plane or part rule", "Avoids the common mistake"], hints: [item.challenge.hint, `Use ${item.formulaLabel}.`] },
    exitCheck: [{ id: `${item.id}-exit`, prompt: `State one exact check for ${item.title}.`, answer: item.misconception[2], criterion: "Names the accepted complex-number rule." }],
    accessibilityNotes: ["Announce the point coordinates and parts.", "Do not rely only on point colour."],
    expertReviewRequired: false,
  };
}

export function complexBatchChallenge(item: Seed) {
  return item.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Write a+bi first.", "Read real and imaginary parts carefully.", "Check the plane axes."], workedSolution: ["Identify a and b.", "Apply the rule.", "Check the common mistake."], misconceptionTag, difficulty, parameterConstraints: ["Use finite real and imaginary values."] };
}
