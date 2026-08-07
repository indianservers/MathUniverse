import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SequenceSeriesChallenge = {
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
  examples: [string, string][];
  misconception: [string, string, string];
  challenge: SequenceSeriesChallenge;
};

const data: Record<number, Seed> = {
  336: seedData(336, "Geometric Sequences", "geometric-sequences", "A geometric sequence multiplies by the same non-zero ratio each step.", "Use a_n=a_1 r^(n-1).", "Geometric term", "a_n=a_1 r^(n-1)", [["a_1", "first term"], ["r", "common ratio"]], ["ADD_RATIO", "Adding the ratio instead of multiplying.", "Multiply by r each step."], "For a_1=3 and r=2, find a_4.", "24"),
  337: seedData(337, "Recursive Sequences", "recursive-sequences", "A recursive sequence defines later terms from earlier terms.", "State the starting term and the recurrence rule.", "Recurrence", "a_{n+1}=f(a_n)", [["a_n", "current term"], ["a_{n+1}", "next term"]], ["NO_START", "Giving a recurrence without a starting value.", "A recursive sequence needs initial information."], "If a_1=2 and a_{n+1}=a_n+3, find a_3.", "8"),
  338: seedData(338, "Fibonacci Sequence", "fibonacci-sequence", "The Fibonacci sequence adds the two previous terms.", "After 1,1 each term is the sum of the two before it.", "Fibonacci rule", "F_n=F_{n-1}+F_{n-2}", [["F_n", "current term"], ["F_{n-1}", "previous term"]], ["ONE_PREVIOUS", "Using only one previous term.", "Use the two previous terms."], "After 1,1,2,3, what comes next?", "5"),
  339: seedData(339, "Sigma Notation", "sigma-notation", "Sigma notation is a compact way to write a sum.", "Add the expression for each integer index in the stated range.", "Sigma sum", "sum_{k=m}^{n} f(k)", [["k", "index"], ["m,n", "start and end"]], ["ENDPOINT_SKIP", "Skipping the last index value.", "Include both endpoints unless told otherwise."], "Find sum k from 1 to 3.", "6"),
  340: seedData(340, "Arithmetic Series", "arithmetic-series", "An arithmetic series adds terms of an arithmetic sequence.", "Use average of first and last term times number of terms.", "Arithmetic series", "S_n=n(a_1+a_n)/2", [["n", "number of terms"], ["a_n", "last term"]], ["TERM_VS_SUM", "Confusing the nth term with the sum.", "A series is the total of terms."], "Find 2+4+6.", "12"),
  341: seedData(341, "Geometric Series", "geometric-series", "A geometric series adds terms of a geometric sequence.", "For r not equal 1, use S_n=a(1-r^n)/(1-r).", "Geometric series", "S_n=a(1-r^n)/(1-r)", [["a", "first term"], ["r", "common ratio"]], ["USE_TERM", "Using only the last term as the sum.", "Add all terms or use the series formula."], "Find 3+6+12.", "21"),
  342: seedData(342, "Convergence and Divergence", "convergence-and-divergence", "Convergence means terms or sums approach a finite limit.", "A geometric series converges when |r|<1.", "Geometric convergence", "|r|<1", [["r", "common ratio"], ["S", "limiting sum"]], ["SMALL_TERMS_ONLY", "Thinking small terms always guarantee convergence.", "Check the accepted convergence test."], "Does r=1/2 give a convergent geometric series? yes or no.", "yes"),
  343: seedData(343, "Power Series", "power-series", "A power series adds powers of a variable.", "It behaves like a polynomial inside its interval of convergence.", "Power series", "sum c_n(x-a)^n", [["c_n", "coefficient"], ["a", "center"]], ["ALL_X", "Assuming a power series works for every x.", "Check the interval of convergence."], "In sum c_n(x-2)^n, what is the center?", "2"),
  344: seedData(344, "Taylor and Maclaurin Series", "taylor-and-maclaurin-series", "A Taylor series uses derivatives at one center to represent a function.", "Maclaurin series are Taylor series centered at 0.", "Taylor series", "sum f^(n)(a)(x-a)^n/n!", [["a", "center"], ["f^(n)(a)", "nth derivative at center"]], ["CENTER_MIX", "Calling every Taylor series Maclaurin.", "Maclaurin means center 0."], "What is the Maclaurin center?", "0"),
  345: seedData(345, "Binomial Series", "binomial-series", "The binomial series expands powers like (1+x)^p.", "For non-integer powers, check the convergence condition.", "Binomial series", "(1+x)^p=sum binom(p,n)x^n", [["p", "power"], ["x", "variable"]], ["FINITE_ALWAYS", "Thinking every binomial expansion is finite.", "It is finite only for non-negative integer powers."], "Is (1+x)^3 a finite binomial expansion? yes or no.", "yes"),
  346: seedData(346, "Recurrence Modelling", "recurrence-modelling", "Recurrence modelling describes a process that updates step by step.", "Define the next state from the present state and starting value.", "Model recurrence", "x_{n+1}=f(x_n)", [["x_n", "current state"], ["f", "update rule"]], ["NO_UNITS", "Writing a recurrence without saying what the state means.", "Define the state and its units."], "If x_0=5 and x_{n+1}=x_n+2, find x_2.", "9"),
};

export function seed(id: number) {
  return data[id];
}

export type SequenceSeriesSeed = Seed;

export function sequenceSeriesLesson(item: Seed): StrengthenedLesson {
  const code = item.misconception[0];
  return {
    id: item.id,
    title: item.title,
    route: `/lessons/advanced-mathematics/${item.id}-${item.slug}`,
    category: "Advanced Mathematics",
    topic: "Sequences and Series",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${item.title}.`, `Use the rule: ${item.keyRule}`, `Correct a common ${item.title} mistake.`],
    prerequisites: ["Sequences", "Algebraic substitution", "Function notation"],
    keyVocabulary: [{ term: item.title, meaning: item.definition }, { term: "Series", meaning: "A sum of sequence terms." }],
    introduction: `${item.title} studies ordered terms or sums. It matters in savings, patterns, algorithms, physics, and approximations.`,
    basicIdea: `${item.definition} The key rule is: ${item.keyRule} A common mistake is ${item.misconception[1]}`,
    howItWorks: "Choose the starting value, index, or ratio. Generate terms in order. Use the formula to find a term, sum, or limit.",
    whyItWorks: "A sequence rule links each position with a value, so tables, graphs, sums, and formulas can be checked together.",
    definitions: [{ id: `${item.id}-definition`, statement: item.definition }],
    facts: [{ id: `${item.id}-fact`, statement: item.keyRule }],
    formulas: [{ id: `${item.id}-formula`, label: item.formulaLabel, expression: item.formulaExpression, variables: item.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Keep index order clear.", "Check convergence before using an infinite sum."],
    representations: [{ id: `${item.id}-table`, type: "table", learningPurpose: `Show terms and partial sums for ${item.title}.` }],
    workedExamples: [{ id: `${item.id}-worked-1`, prompt: item.challenge.prompt, steps: ["Identify the sequence or series rule.", "Substitute the values.", "Compute and check order."], answer: item.challenge.expected }],
    realLifeExamples: item.examples.map(([context, connection], index) => ({ id: `${item.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: item.misconception[1], correction: item.misconception[2] }],
    interaction: { id: `${item.id}-interaction`, learningPurpose: `Use the sequence lab to connect ${item.title} with terms, partial sums, and formula text.`, parameters: [{ id: "a", label: "Start value", validRange: [-10, 20] }, { id: "b", label: "Rule parameter", validRange: [-10, 20] }, { id: "n", label: "Term count", validRange: [1, 20] }], initialState: `Start with ${item.formulaLabel}.`, dynamicFeedback: "Terms, partial sums, graph bars, formula, and challenge values update together.", successCriteria: ["Read ordered terms", "Use the formula", "Explain the misconception"], accessibilityAlternative: "Provide generated terms and partial sums as a table." },
    guidedExploration: [{ id: "predict", prompt: "Predict the next term before moving a control." }, { id: "observe", prompt: "Move the rule parameter and read the table." }, { id: "explain", prompt: `Explain using ${item.formulaLabel}.` }],
    practice: [practice(`${item.id}-recognition`, `Name the key rule for ${item.title}.`, item.keyRule, code, "recognition"), practice(`${item.id}-direct`, item.challenge.prompt, item.challenge.expected, code, "direct"), practice(`${item.id}-multi`, `State the correction for ${item.title}.`, item.misconception[2], code, "multi_step"), practice(`${item.id}-error`, `What is wrong with this mistake: ${item.misconception[1]}`, item.misconception[2], code, "error_diagnosis"), practice(`${item.id}-transfer`, `Give one real use of ${item.title}.`, item.examples[0][0], code, "transfer")],
    challenge: { id: `${item.id}-challenge`, prompt: item.challenge.prompt, successCriteria: ["Uses the rule", "Keeps order clear", "Gives the correct result"], hints: [item.challenge.hint, `Use ${item.formulaLabel}.`] },
    exitCheck: [{ id: `${item.id}-exit`, prompt: `State one exact check for ${item.title}.`, answer: item.misconception[2], criterion: "Names the accepted sequence or series rule." }],
    accessibilityNotes: ["Announce terms and partial sums.", "Do not rely only on graph height."],
    expertReviewRequired: false,
  };
}

function seedData(id: number, title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, keyRule, formulaLabel, formulaExpression, variables, misconception, examples: [["Saving money", "Regular deposits can create a sequence or series."], ["Computer loops", "Repeated rules generate ordered values."], ["Physics approximation", "Series can approximate changing quantities."]], challenge: { prompt, expected, hint: `Use ${formulaLabel}.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `sequence.${slug}` } };
}

export function sequenceSeriesChallenge(item: Seed): SequenceSeriesChallenge {
  return item.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check the index.", "Use the displayed formula.", "Keep term order clear."], workedSolution: ["Identify the rule.", "Substitute values.", "Check the result."], misconceptionTag, difficulty, parameterConstraints: ["Use integer positions unless stated otherwise."] };
}
