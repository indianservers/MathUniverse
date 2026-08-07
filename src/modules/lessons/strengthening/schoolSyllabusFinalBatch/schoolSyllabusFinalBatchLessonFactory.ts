import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SchoolSyllabusFinalChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type SchoolSyllabusFinalSeed = {
  id: number;
  title: string;
  route: string;
  topic: string;
  academicLevel: string;
  lessonType: StrengthenedLesson["lessonType"];
  definition: string;
  action: string;
  reason: string;
  representation: StrengthenedLesson["representations"][number]["type"];
  vocabulary: StrengthenedLesson["keyVocabulary"];
  facts: StrengthenedLesson["facts"];
  restrictions: string[];
  workedPrompt: string;
  workedSteps: string[];
  workedAnswer: string;
  prompt: string;
  expected: string;
  formula: StrengthenedLesson["formulas"][number];
  misconception: [string, string, string];
  expertReviewRequired: boolean;
};

type Source = Pick<SchoolSyllabusFinalSeed, "title" | "route" | "topic">;
type Detail = Omit<SchoolSyllabusFinalSeed, keyof Source | "id" | "academicLevel" | "expertReviewRequired">;

const sources: Record<number, Source> = {
  10204: source("Unbounded Feasible Region", "/lessons/school/class-12/class-12-linear-programming-unbounded-feasible-region", "Linear Programming"),
  10205: source("Multiple Optimal Solutions", "/lessons/school/class-12/class-12-linear-programming-multiple-optimal-solutions", "Linear Programming"),
  10206: source("Infeasible Problems", "/lessons/school/class-12/class-12-linear-programming-infeasible-problems", "Linear Programming"),
  10207: source("Diet Problem", "/lessons/school/class-12/class-12-linear-programming-diet-problem", "Linear Programming"),
  10208: source("Production Planning Problem", "/lessons/school/class-12/class-12-linear-programming-production-planning-problem", "Linear Programming"),
  10209: source("Transportation-Style LPP Introduction", "/lessons/school/class-12/class-12-linear-programming-transportation-style-lpp-introduction", "Linear Programming"),
  10210: source("Conditional Probability", "/lessons/school/class-12/class-12-probability-conditional-probability", "Probability"),
  10211: source("Multiplication Rule", "/lessons/school/class-12/class-12-probability-multiplication-rule", "Probability"),
  10212: source("Independent Events", "/lessons/school/class-12/class-12-probability-independent-events", "Probability"),
  10213: source("Total Probability Theorem", "/lessons/school/class-12/class-12-probability-total-probability-theorem", "Probability"),
  10214: source("Bayes' Theorem", "/lessons/school/class-12/class-12-probability-bayes-theorem", "Probability"),
  10215: source("Random Variables", "/lessons/school/class-12/class-12-probability-random-variables", "Probability"),
  10216: source("Probability Distribution of a Random Variable", "/lessons/school/class-12/class-12-probability-probability-distribution-of-a-random-variable", "Probability"),
  10217: source("Expected Value", "/lessons/school/class-12/class-12-probability-expected-value", "Probability"),
  10218: source("Variance", "/lessons/school/class-12/class-12-probability-variance", "Probability"),
  10219: source("Bernoulli Trials", "/lessons/school/class-12/class-12-probability-bernoulli-trials", "Probability"),
  10220: source("Binomial Distribution", "/lessons/school/class-12/class-12-probability-binomial-distribution", "Probability"),
};

const expertReviewIds = new Set([10213, 10214, 10216, 10220]);

const details: Record<number, Detail> = {
  10204: lppDetail("Unbounded Feasible Region", "An unbounded feasible region is a set of allowed points that extends without end in at least one direction.", "Draw all constraints, shade their common overlap, and check whether the overlap continues forever.", "Linear inequalities can leave one side open, so the feasible set need not be closed inside a box.", "coordinate_graph", "For x >= 0 and y >= 0, is the feasible region unbounded?", "yes", "Feasible set", "unbounded region", "allowed points continue forever", ["UNBOUNDED_NO_OPTIMUM_ALWAYS", "Thinking unbounded always means there is no optimum.", "An unbounded region may still have a finite optimum. Test the objective direction."]),
  10205: lppDetail("Multiple Optimal Solutions", "Multiple optimal solutions happen when more than one feasible point gives the same best objective value.", "Graph the objective line, slide it until it last touches the region, and check if it lies along an edge.", "A linear objective has equal value on parallel lines, so a whole boundary segment can share one value.", "coordinate_graph", "When an objective line overlaps a feasible edge, how many optimal points are there?", "many", "Objective line", "parallel edge", "same best value", ["ONE_OPTIMUM_ONLY", "Assuming every linear programming problem has only one optimal point.", "If the objective is parallel to a feasible edge, every point on that edge can be optimal."]),
  10206: lppDetail("Infeasible Problems", "An infeasible linear programming problem has no point that satisfies all constraints at the same time.", "Graph each inequality, shade each allowed side, and look for a common overlap.", "Opposite or conflicting constraints can make the shared feasible region empty.", "coordinate_graph", "Can x >= 5 and x <= 2 be satisfied together?", "no", "Feasibility", "no common overlap", "all constraints must meet", ["FORCED_INTERSECTION", "Solving the objective even when the constraints have no common point.", "First prove the feasible region exists. Without it, no optimum can be found."]),
  10207: lppDetail("Diet Problem", "A diet problem is a linear programming model that chooses food amounts while meeting nutrition limits, often at least cost.", "Let variables represent food amounts, write nutrition constraints, write cost, and optimize the cost.", "Food totals add linearly when each serving contributes fixed nutrients and fixed cost.", "text_table", "If one meal needs at least 20 g protein, is protein a constraint?", "yes", "Diet model", "nutrient constraint", "minimum cost", ["NUTRIENTS_AS_OBJECTIVE", "Treating every nutrient as the objective instead of a constraint.", "Usually cost is optimized while nutrients become minimum or maximum constraints."]),
  10208: lppDetail("Production Planning Problem", "A production planning problem chooses how many items to make under resource limits, usually to maximize profit.", "Define item variables, write resource inequalities, write profit, and compare feasible corner points.", "Each item uses fixed resources, so total use and total profit are linear sums.", "text_table", "If each chair uses 2 wood units, how much wood do x chairs use?", "2x", "Production model", "resource constraint", "best feasible output", ["IGNORED_RESOURCE_LIMIT", "Maximizing profit without checking resource limits.", "Profit must be tested only for production plans that satisfy every resource constraint."]),
  10209: lppDetail("Transportation-Style LPP Introduction", "A transportation-style LPP sends goods from sources to destinations while respecting supply, demand, and cost.", "Make a shipment table, match row supplies and column demands, then minimize total shipping cost.", "Shipment amounts add across rows and columns, so supply, demand, and cost can be written linearly.", "table", "In a transport table, what do row totals usually represent?", "supply", "Transport model", "shipment table", "minimum shipping cost", ["MISREAD_ROWS_COLUMNS", "Mixing up source supply rows and destination demand columns.", "Label sources, destinations, supplies, and demands before writing equations."]),
  10210: probabilityDetail("Conditional Probability", "Conditional probability is the probability of event A when event B is already known to have happened.", "Keep only the outcomes inside B, then count how many of those also belong to A.", "Knowing B changes the sample space from all outcomes to the outcomes in B.", "tree_diagram", "P(A|B)=P(A and B)/P(B) needs P(B) greater than what?", "0", "Conditional probability", "P(A|B)=P(A and B)/P(B)", ["CONDITION_IGNORED", "Using P(A) when the question asks for P(A given B).", "Restrict the sample space to B before finding the probability."]),
  10211: probabilityDetail("Multiplication Rule", "The multiplication rule finds the probability that two events happen together.", "Find the probability of the first event, then multiply by the probability of the second event after the first.", "The second probability may change after the first event is known.", "tree_diagram", "Complete: P(A and B)=P(A) times what?", "P(B|A)", "Multiplication rule", "P(A and B)=P(A)P(B|A)", ["USED_INDEPENDENCE_TOO_SOON", "Multiplying P(A) and P(B) without checking dependence.", "Use P(B|A) unless the events are known to be independent."]),
  10212: probabilityDetail("Independent Events", "Independent events are events where knowing one event happened does not change the probability of the other.", "Check whether P(A and B) equals P(A) times P(B), or whether P(A|B) equals P(A).", "Independence means the information about one event gives no extra probability information about the other.", "venn_diagram", "If events are independent, P(A and B)=P(A) times what?", "P(B)", "Independence test", "P(A and B)=P(A)P(B)", ["DISJOINT_MEANS_INDEPENDENT", "Thinking mutually exclusive events are usually independent.", "If two non-empty events cannot both happen, knowing one happened changes the other probability."]),
  10213: probabilityDetail("Total Probability Theorem", "The total probability theorem finds P(A) by splitting the sample space into separate cases.", "Choose cases that cover all outcomes without overlap, find P(A) in each case, and add the weighted parts.", "The separate cases form a full partition, so their contributions combine to the total probability.", "tree_diagram", "What must the cases in total probability do to the sample space?", "partition it", "Total probability", "P(A)=sum P(B_i)P(A|B_i)", ["CASES_OVERLAP", "Adding case probabilities that overlap or miss outcomes.", "Use cases that are disjoint and together cover the whole sample space."]),
  10214: probabilityDetail("Bayes' Theorem", "Bayes' theorem reverses conditional probability using prior probabilities and observed evidence.", "Multiply each prior by its likelihood, then divide the chosen case by the total probability of the evidence.", "The denominator counts all ways the observed evidence can happen.", "tree_diagram", "In Bayes' theorem, what denominator combines all cases for the evidence?", "total probability", "Bayes theorem", "P(B_j|A)=P(B_j)P(A|B_j)/sum P(B_i)P(A|B_i)", ["DENOMINATOR_FORGOTTEN", "Using only the chosen case and forgetting other possible cases.", "Use the total probability denominator before reversing the conditional probability."]),
  10215: probabilityDetail("Random Variables", "A random variable is a rule that assigns a real number to each outcome of a random experiment.", "List the outcomes, choose the number each outcome receives, and name the possible values.", "The rule turns random outcomes into numbers that can be counted, averaged, and compared.", "text_table", "A coin gives H=1 and T=0. Is this a random variable rule?", "yes", "Random variable", "X: outcomes -> real numbers", ["OUTCOME_IS_VARIABLE", "Thinking the random variable is the outcome itself.", "The random variable is the number-valued rule applied to outcomes."]),
  10216: probabilityDetail("Probability Distribution of a Random Variable", "A probability distribution lists each possible value of a random variable and its probability.", "List all values, assign non-negative probabilities, and check that the probabilities add to 1.", "One of the listed values must occur, so the full set of probabilities totals 1.", "table", "What must all probabilities in a distribution add to?", "1", "Probability distribution", "sum P(X=x)=1", ["SUM_NOT_ONE", "Accepting a distribution whose probabilities do not add to 1.", "Check every probability is non-negative and the total is exactly 1."]),
  10217: probabilityDetail("Expected Value", "Expected value is the long-run average value of a random variable over many repeated trials.", "Multiply each value by its probability, then add all products.", "Repeated trials balance around the weighted average when the same experiment is repeated many times.", "text_table", "For X values 0 and 1 with probabilities 0.7 and 0.3, what is E(X)?", "0.3", "Expected value", "E(X)=sum xP(X=x)", ["MOST_LIKELY_EQUALS_EXPECTED", "Thinking expected value must be the most likely single value.", "Expected value is a weighted average and may not be one possible outcome."]),
  10218: probabilityDetail("Variance", "Variance measures how far a random variable usually spreads from its mean.", "Find the mean, subtract it from each value, square each difference, multiply by probability, and add.", "Squaring makes distances positive and gives more weight to values far from the mean.", "text_table", "Variance can be found by E(X^2) minus what?", "mean squared", "Variance", "Var(X)=E[(X-mu)^2]=E(X^2)-mu^2", ["SPREAD_AS_MEAN", "Confusing average value with spread around the average.", "Mean tells the center. Variance tells how spread out the values are."]),
  10219: probabilityDetail("Bernoulli Trials", "Bernoulli trials are repeated independent trials with exactly two outcomes and the same success probability each time.", "Check two outcomes, check independence, and check that success probability stays the same for every trial.", "The same two-outcome experiment repeats without one trial changing the next.", "tree_diagram", "How many outcomes does each Bernoulli trial have?", "2", "Bernoulli trials", "success probability = p on each independent trial", ["CHANGING_PROBABILITY", "Calling trials Bernoulli when success probability changes.", "Bernoulli trials need independence and the same success probability p each time."]),
  10220: probabilityDetail("Binomial Distribution", "A binomial distribution counts the number of successes in a fixed number of independent Bernoulli trials.", "Choose n, r, and p, then use combinations times success powers times failure powers.", "The combination counts which trials are successes, and the powers count their probabilities.", "distribution_plot", "For n=3, p=0.5, what is P(X=2)?", "0.375", "Binomial distribution", "P(X=r)=nCr p^r(1-p)^(n-r)", ["DEPENDENCE_IGNORED", "Using the binomial formula when trials are not independent.", "Use the binomial formula only for fixed independent Bernoulli trials with the same p."]),
};

export function schoolSyllabusFinalSeed(id: number): SchoolSyllabusFinalSeed {
  const item = sources[id];
  const detail = details[id];
  if (!item || !detail) throw new Error(`Missing school syllabus final lesson seed for ${id}`);
  return { id, academicLevel: "CLASS_12", expertReviewRequired: expertReviewIds.has(id), ...item, ...detail };
}

export function schoolSyllabusFinalLesson(seed: SchoolSyllabusFinalSeed): StrengthenedLesson {
  const slug = seed.route.split("/").pop() ?? String(seed.id);
  const introUse = seed.topic === "Probability" ? "risk, games, weather, medicine, and data decisions" : "planning food, factory work, transport, money, and resources";
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: "School Syllabus",
    topic: seed.topic,
    academicLevel: seed.academicLevel,
    lessonType: seed.lessonType,
    learningObjectives: [`Define ${seed.title} accurately.`, seed.action, `Correct this mistake: ${seed.misconception[1]}`],
    prerequisites: prerequisitesFor(seed.topic),
    keyVocabulary: seed.vocabulary,
    introduction: `${seed.title} is a Class 12 idea in ${seed.topic}. It gives a careful way to model choices or chance. We use it in ${introUse}.`,
    basicIdea: `${seed.definition} The basic idea is to name the given information first. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then check the final answer against the original conditions.`,
    whyItWorks: seed.reason,
    definitions: [{ id: `${slug}-definition`, statement: seed.definition }],
    facts: seed.facts,
    formulas: [seed.formula],
    conditionsAndRestrictions: seed.restrictions,
    representations: [{ id: `${slug}-representation`, type: seed.representation, learningPurpose: `Show the exact structure of ${seed.title}.` }],
    workedExamples: [{ id: `${slug}-worked-1`, prompt: seed.workedPrompt, steps: seed.workedSteps, answer: seed.workedAnswer }],
    realLifeExamples: examplesFor(seed.topic, slug),
    misconceptions: [{ code: seed.misconception[0], mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${slug}-interaction`,
      learningPurpose: `Explore ${seed.title} by changing one model value and checking the rule.`,
      parameters: [{ id: "value", label: seed.topic === "Probability" ? "Probability value" : "Model value", validRange: seed.topic === "Probability" ? [0, 1] : [0, 50] }],
      initialState: `Start with the worked example for ${seed.title}.`,
      dynamicFeedback: seed.topic === "Probability" ? "Changing a probability updates the table, tree, or distribution check." : "Changing a constraint updates the feasible region, table, or objective check.",
      successCriteria: ["Name the condition", "Use the correct rule", "Explain the common mistake"],
      accessibilityAlternative: "Provide the same model, steps, and result as labelled text.",
    },
    guidedExploration: [
      { id: "predict", prompt: "Predict what should happen before changing the model." },
      { id: "test", prompt: "Change one value and read the updated result." },
      { id: "explain", prompt: "Explain why the rule still works." },
    ],
    practice: [
      practice(`${slug}-recognition`, `What is ${seed.title}?`, seed.definition, seed.misconception[0], "recognition"),
      practice(`${slug}-direct`, seed.prompt, seed.expected, seed.misconception[0], "direct"),
      practice(`${slug}-multi`, `How do you use ${seed.title}?`, seed.action, seed.misconception[0], "multi_step"),
      practice(`${slug}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], seed.misconception[0], "error_diagnosis"),
      practice(`${slug}-transfer`, `Give one daily use of ${seed.title}.`, examplesFor(seed.topic, slug)[0].context, seed.misconception[0], "transfer"),
    ],
    challenge: { id: `${slug}-challenge`, prompt: seed.prompt, successCriteria: ["Uses the exact rule", "Checks the required condition", "Avoids the named mistake"], hints: [`Use ${seed.formula.label}.`, seed.misconception[2]] },
    exitCheck: [{ id: `${slug}-exit`, prompt: `State the key condition for ${seed.title}.`, answer: seed.restrictions[0], criterion: "Answer names a correct condition or restriction." }],
    accessibilityNotes: ["Announce table values, graph labels, probabilities, and algebra steps as text.", "Do not rely only on colour."],
    expertReviewRequired: seed.expertReviewRequired,
    reviewReason: seed.expertReviewRequired ? "This theorem or distribution lesson has expert-review math conditions." : undefined,
  };
}

export function schoolSyllabusFinalChallenge(seed: SchoolSyllabusFinalSeed): SchoolSyllabusFinalChallenge {
  return {
    prompt: seed.prompt,
    expected: seed.expected,
    hint: `Use ${seed.formula.label}.`,
    kind: Number.isFinite(Number(seed.expected)) ? "numeric" : "keywords",
    factoryId: `school.final.${seed.id}`,
  };
}

function source(title: string, route: string, topic: string): Source {
  return { title, route, topic };
}

function lppDetail(title: string, definition: string, action: string, reason: string, representation: Detail["representation"], prompt: string, expected: string, label: string, term: string, meaning: string, misconception: [string, string, string]): Detail {
  return {
    lessonType: "modelling",
    definition,
    action,
    reason,
    representation,
    vocabulary: [{ term: title, meaning: definition }, { term, meaning }],
    facts: [{ id: `${slugify(title)}-fact`, statement: reason }],
    restrictions: ["Define decision variables before writing constraints.", "Use only points that satisfy every constraint.", "Check whether the feasible region exists and whether the objective has a finite optimum."],
    workedPrompt: prompt,
    workedSteps: ["Read the constraints or model table.", action, "Check the answer against all constraints."],
    workedAnswer: expected,
    prompt,
    expected,
    formula: { id: `${slugify(label)}-formula`, label, expression: "objective = ax + by, with linear constraints", variables: [{ symbol: "x,y", meaning: "decision variables" }, { symbol: "a,b", meaning: "objective coefficients" }], restrictions: ["Constraints must be linear."], exactness: "definition" },
    misconception,
  };
}

function probabilityDetail(title: string, definition: string, action: string, reason: string, representation: Detail["representation"], prompt: string, expected: string, label: string, expression: string, misconception: [string, string, string]): Detail {
  return {
    lessonType: /Theorem|Distribution/.test(title) ? "proof" : "concept",
    definition,
    action,
    reason,
    representation,
    vocabulary: [{ term: title, meaning: definition }, { term: "Sample space", meaning: "The set of all possible outcomes." }],
    facts: [{ id: `${slugify(title)}-fact`, statement: reason }],
    restrictions: ["Probabilities must be between 0 and 1.", "Use only events with positive probability in denominators.", "Check independence before using independent-event formulas."],
    workedPrompt: prompt,
    workedSteps: ["Name the events and given probabilities.", action, "Check that probabilities and conditions are valid."],
    workedAnswer: expected,
    prompt,
    expected,
    formula: { id: `${slugify(label)}-formula`, label, expression, variables: [{ symbol: "A,B", meaning: "events" }, { symbol: "X", meaning: "random variable when used" }, { symbol: "p", meaning: "success probability when used" }], restrictions: ["Denominators must be positive where division is used."], exactness: /Theorem|rule|distribution/i.test(label) ? "theorem" : "definition" },
    misconception,
  };
}

function examplesFor(topic: string, slug: string) {
  const examples: [string, string][] = topic === "Probability"
    ? [["Weather forecast", "A rain chance is a probability about tomorrow."], ["Game spinner", "A spinner gives possible outcomes and probabilities."], ["Quality check", "A factory estimates the chance that an item has a defect."]]
    : [["Factory planning", "Machines and material limits become constraints."], ["Diet planning", "Food choices must meet nutrition limits."], ["Delivery planning", "Shipments must meet supply, demand, and cost limits."]];
  return examples.map(([context, connection], index) => ({ id: `${slug}-real-${index + 1}`, context, connection }));
}

function prerequisitesFor(topic: string) {
  return topic === "Probability"
    ? ["Fractions and decimals", "Sample space", "Basic probability rules"]
    : ["Linear equations", "Linear inequalities", "Coordinate graphing"];
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Read the definition.", "Check the conditions.", "Use the matching formula or model."], workedSolution: ["Identify the given information.", "Apply the lesson rule.", "Check the result in context."], misconceptionTag, difficulty, parameterConstraints: ["Use Class 12 level values and exact stated conditions."] };
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
