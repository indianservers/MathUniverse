import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type ComplexAdvancedChallenge = {
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
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  variables: [string, string][];
  misconception: [string, string, string];
  challenge: ComplexAdvancedChallenge;
};

const data: Record<number, Seed> = {
  367: item(367, "Complex Addition", "complex-addition", "Complex addition adds real parts together and imaginary parts together.", "Add component by component.", "Addition", "(a+bi)+(c+di)=(a+c)+(b+d)i", [["a,c", "real parts"], ["b,d", "imaginary coefficients"]], ["MIX_PARTS", "Adding a real part to an imaginary coefficient.", "Add real with real and imaginary with imaginary."], "Find (2+i)+(3+4i).", "5+5i"),
  368: item(368, "Complex Multiplication", "complex-multiplication", "Complex multiplication expands like algebra and uses i^2=-1.", "Multiply terms, then replace i^2 by -1.", "Multiplication", "(a+bi)(c+di)=(ac-bd)+(ad+bc)i", [["a,b,c,d", "real coefficients"], ["i", "square root of -1"]], ["FORGET_I2", "Leaving i^2 unchanged.", "Replace i^2 with -1."], "Find (1+i)(1-i).", "2"),
  369: item(369, "Complex Conjugate", "complex-conjugate", "The conjugate changes the sign of the imaginary part.", "The conjugate of a+bi is a-bi.", "Conjugate", "conj(a+bi)=a-bi", [["a", "real part"], ["b", "imaginary coefficient"]], ["CHANGE_REAL", "Changing the real part sign too.", "Only the imaginary sign changes."], "What is the conjugate of 3+2i?", "3-2i"),
  370: item(370, "Modulus and Argument", "modulus-and-argument", "The modulus is distance from the origin, and the argument is direction angle.", "Use r=sqrt(a^2+b^2) and theta=atan2(b,a).", "Polar measures", "r=|z|, theta=arg z", [["r", "modulus"], ["theta", "argument"]], ["ANGLE_ONLY", "Using the angle as the size.", "Modulus is distance; argument is angle."], "What is |3+4i|?", "5"),
  371: item(371, "Polar Form", "polar-form", "Polar form writes a complex number using size and direction.", "z=r(cos theta+i sin theta).", "Polar form", "z=r(cos theta+i sin theta)", [["r", "modulus"], ["theta", "argument"]], ["R_AS_REAL", "Treating r as the real part.", "r is distance from the origin."], "For r=2 and theta=0, what is z?", "2"),
  372: item(372, "Euler Form", "euler-form", "Euler form writes polar complex numbers using e^(i theta).", "re^(i theta)=r(cos theta+i sin theta).", "Euler form", "z=re^(i theta)", [["r", "modulus"], ["theta", "argument"]], ["DROP_R", "Forgetting the modulus r.", "Keep r when the complex number is not on the unit circle."], "What is e^(i0)?", "1"),
  373: item(373, "Powers", "powers", "Complex powers are easiest in polar form.", "Use De Moivre: [r(cos theta+i sin theta)]^n=r^n(cos ntheta+i sin ntheta).", "De Moivre powers", "z^n=r^n e^(in theta)", [["n", "power"], ["theta", "argument"]], ["POWER_COMPONENTS", "Raising real and imaginary parts separately.", "Use polar form or multiply correctly."], "If z=2e^(i theta), what is the modulus of z^3?", "8"),
  374: item(374, "Roots", "roots", "Complex roots split angle evenly around a circle.", "The n roots have modulus r^(1/n) and angles (theta+2k pi)/n.", "Complex roots", "w_k=r^(1/n)e^((theta+2k pi)i/n)", [["k", "root index"], ["n", "number of roots"]], ["ONE_ROOT", "Giving only one root when n roots exist.", "List all n roots."], "How many cube roots does a non-zero complex number have?", "3"),
  375: item(375, "Polynomial Roots", "polynomial-roots", "Polynomial roots are values that make the polynomial equal zero.", "Non-real complex roots of real-coefficient polynomials occur in conjugate pairs.", "Conjugate root theorem", "a+bi root implies a-bi root", [["a+bi", "complex root"], ["a-bi", "conjugate root"]], ["NO_PAIR", "Listing one non-real root for a real polynomial without its conjugate.", "Include the conjugate root too."], "If 2+3i is a root of a real polynomial, name the paired root.", "2-3i"),
  376: item(376, "Mobius Transformations", "mobius-transformations", "A Mobius transformation maps complex numbers using a fractional linear rule.", "Use w=(az+b)/(cz+d), with cz+d not zero.", "Mobius map", "w=(az+b)/(cz+d)", [["a,b,c,d", "complex constants"], ["z", "input"]], ["ZERO_DENOMINATOR", "Ignoring where cz+d equals zero.", "Exclude values that make the denominator zero."], "In w=1/z, which input is not allowed?", "0"),
  377: item(377, "Complex Functions", "complex-functions", "A complex function sends complex inputs to complex outputs.", "Track both real and imaginary parts of the output.", "Complex function", "w=f(z)", [["z", "complex input"], ["w", "complex output"]], ["REAL_ONLY", "Checking only the real part of the output.", "Complex output has real and imaginary parts."], "For f(z)=z+1 and z=2+i, what is f(z)?", "3+i"),
};

export function seed(id: number) {
  return data[id];
}

export type ComplexAdvancedSeed = Seed;

export function complexAdvancedLesson(item: Seed): StrengthenedLesson {
  const code = item.misconception[0];
  return {
    id: item.id,
    title: item.title,
    route: `/lessons/advanced-mathematics/${item.id}-${item.slug}`,
    category: "Advanced Mathematics",
    topic: "Complex Numbers",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${item.title}.`, `Use the rule: ${item.keyRule}`, `Correct a common ${item.title} mistake.`],
    prerequisites: ["Complex plane", "Real and imaginary parts", "Algebraic expansion"],
    keyVocabulary: [{ term: item.title, meaning: item.definition }, { term: "Argument", meaning: "The direction angle of a complex number from the positive real axis." }],
    introduction: `${item.title} helps us calculate and visualise complex-number behaviour. It matters in rotations, waves, signal work, and polynomial algebra.`,
    basicIdea: `${item.definition} The key rule is: ${item.keyRule} A common mistake is ${item.misconception[1]}`,
    howItWorks: "Write the number in a+bi or polar form. Apply the operation rule. Check the point, size, direction, or output on the complex plane.",
    whyItWorks: "Complex numbers behave like two linked coordinates, with i^2=-1 making multiplication rotate and scale points.",
    definitions: [{ id: `${item.id}-definition`, statement: item.definition }],
    facts: [{ id: `${item.id}-fact`, statement: item.keyRule }],
    formulas: [{ id: `${item.id}-formula`, label: item.formulaLabel, expression: item.formulaExpression, variables: item.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Check whether algebraic or polar form is easier.", "Exclude any value that makes a denominator zero."],
    representations: [{ id: `${item.id}-plane`, type: "coordinate_graph", learningPurpose: `Show ${item.title} on the complex plane.` }],
    workedExamples: [{ id: `${item.id}-worked-1`, prompt: item.challenge.prompt, steps: ["Choose the correct complex-number form.", "Apply the rule.", "Check real and imaginary parts."], answer: item.challenge.expected }],
    realLifeExamples: [{ id: `${item.id}-real-1`, context: "AC electricity", connection: "Complex operations track magnitude and phase." }, { id: `${item.id}-real-2`, context: "Computer graphics", connection: "Complex multiplication can rotate and scale points." }, { id: `${item.id}-real-3`, context: "Polynomial solving", connection: "Complex roots complete many equations." }],
    misconceptions: [{ code, mistake: item.misconception[1], correction: item.misconception[2] }],
    interaction: { id: `${item.id}-interaction`, learningPurpose: `Move real, imaginary, and angle controls to connect ${item.title} with the complex plane.`, parameters: [{ id: "real", label: "Real part", validRange: [-5, 5] }, { id: "imaginary", label: "Imaginary part", validRange: [-3, 3] }, { id: "angle", label: "Rotation angle", validRange: [-180, 180] }], initialState: `Start with ${item.formulaLabel}.`, dynamicFeedback: "The plotted point, product point, modulus, and argument update together.", successCriteria: ["Apply the formula", "Read the plane", "Explain the misconception"], accessibilityAlternative: "Provide complex value, modulus, argument, and product components as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict the output before moving a control." }, { id: "observe", prompt: "Move one control and read the plane." }, { id: "explain", prompt: `Explain using ${item.formulaLabel}.` }],
    practice: [practice(`${item.id}-recognition`, `Name the key rule for ${item.title}.`, item.keyRule, code, "recognition"), practice(`${item.id}-direct`, item.challenge.prompt, item.challenge.expected, code, "direct"), practice(`${item.id}-multi`, `State the correction for ${item.title}.`, item.misconception[2], code, "multi_step"), practice(`${item.id}-error`, `What is wrong with this mistake: ${item.misconception[1]}`, item.misconception[2], code, "error_diagnosis"), practice(`${item.id}-transfer`, `Give one real use of ${item.title}.`, "AC electricity", code, "transfer")],
    challenge: { id: `${item.id}-challenge`, prompt: item.challenge.prompt, successCriteria: ["Uses the accepted rule", "Keeps real and imaginary parts clear", "Avoids the common mistake"], hints: [item.challenge.hint, `Use ${item.formulaLabel}.`] },
    exitCheck: [{ id: `${item.id}-exit`, prompt: `State one exact check for ${item.title}.`, answer: item.misconception[2], criterion: "Names the accepted complex-number rule." }],
    accessibilityNotes: ["Announce real and imaginary coordinates.", "Do not rely only on colour to separate original and transformed points."],
    expertReviewRequired: false,
  };
}

function item(id: number, title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, keyRule, formulaLabel, formulaExpression, variables, misconception, challenge: { prompt, expected, hint: `Use ${formulaLabel}.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `complex.${slug}` } };
}

export function complexAdvancedChallenge(item: Seed) {
  return item.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Write a+bi clearly.", "Use the displayed formula.", "Check real and imaginary parts."], workedSolution: ["Identify the operation.", "Apply the rule.", "Check the complex plane."], misconceptionTag, difficulty, parameterConstraints: ["Use finite complex values."] };
}
