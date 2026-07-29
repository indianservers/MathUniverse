import { algebraProofDrafts } from "./theorems/algebraProofDrafts";
import { advancedProofDrafts } from "./theorems/advancedProofDrafts";
import { coordinateCalculusProofDrafts } from "./theorems/coordinateCalculusProofDrafts";
import { geometryProofDrafts } from "./theorems/geometryProofDrafts";
import { linearAlgebraProofDrafts } from "./theorems/linearAlgebraProofDrafts";
import { trigonometryProofDrafts } from "./theorems/trigonometryProofDrafts";

export type TheoremLibraryItem = {
  slug: string;
  title: string;
  subtopic: string;
  statement: string;
  purpose: string;
  detailedExplanation: string;
  examples: TheoremExample[];
  whyItMatters: string;
  proofPlan: string;
  proofStatus: "scaffold-ready" | "planned" | "draft-ready" | "visual-ready";
  prerequisites: string[];
  proofIdea?: string;
  proofSteps?: TheoremProofStep[];
  examMemory?: string;
  commonMistakes?: string[];
};

export type TheoremCategory = {
  id: string;
  title: string;
  description: string;
  accent: string;
  theorems: TheoremLibraryItem[];
};

export type TheoremProofStep = {
  title: string;
  explanation: string;
  representation: string;
};

export type TheoremExample = {
  title: string;
  scenario: string;
  takeaway: string;
};

type TheoremSeed = [title: string, subtopic: string, statement: string, prerequisites?: string[]];

type TheoremProofDraft = {
  proofIdea: string;
  proofSteps: TheoremProofStep[];
  examMemory: string;
  commonMistakes: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function theorem(
  [title, subtopic, statement, prerequisites = []]: TheoremSeed,
  categoryTitle: string,
  categoryId: string,
  index: number,
): TheoremLibraryItem {
  const proofDraft = theoremProofDrafts[`${categoryId}:${title}`];
  const proofScaffold = proofDraft ?? buildTheoremScaffold(title, subtopic, statement, prerequisites, categoryTitle);
  return {
    slug: `${slugify(title)}-${index + 1}`,
    title,
    subtopic,
    statement,
    purpose: buildTheoremPurpose(title, subtopic, categoryTitle),
    detailedExplanation: buildDetailedExplanation(title, subtopic, statement, prerequisites, categoryTitle),
    examples: buildTheoremExamples(title, subtopic, statement, categoryTitle, categoryId),
    whyItMatters: `${title} is a reusable result for ${subtopic.toLowerCase()} problems in ${categoryTitle}. It turns a familiar setup into a result students can use without re-proving the same idea each time.`,
    proofPlan: proofDraft
      ? "Step-by-step draft proof is available below. A future visual phase can convert each step into an interactive diagram."
      : "A foundation proof draft is available below. It explains the setup, key idea, conclusion, and checks; a future phase can replace it with a fully specialized visual proof.",
    proofStatus: "draft-ready",
    prerequisites,
    ...proofScaffold,
  };
}

function buildTheoremPurpose(title: string, subtopic: string, categoryTitle: string) {
  return `Use ${title} to recognize when a ${subtopic.toLowerCase()} situation has enough structure to reach a dependable conclusion in ${categoryTitle}. The theorem tells you which conditions matter, what result follows, and why a problem can be solved faster once the setup is verified.`;
}

function buildDetailedExplanation(
  title: string,
  subtopic: string,
  statement: string,
  prerequisites: string[],
  categoryTitle: string,
) {
  const prerequisiteText = prerequisites.length ? prerequisites.join(", ") : "the core definitions";
  return `${title} should be read as an if-then tool, not as an isolated fact. First identify the objects in the ${subtopic.toLowerCase()} setup, then check the hypotheses in the statement: ${statement} The proof uses ${prerequisiteText} to explain why those hypotheses force the conclusion. In practice, this theorem is useful because it separates two jobs: verifying the conditions and applying the result. Once the conditions are true, the conclusion can be used confidently in computations, diagrams, modelling, or proof-writing inside ${categoryTitle}.`;
}

function buildTheoremExamples(title: string, subtopic: string, statement: string, categoryTitle: string, categoryId: string): TheoremExample[] {
  const templates = theoremExampleTemplates[categoryId] ?? theoremExampleTemplates.default;
  return templates.map((template, index) => ({
    title: template.title(title, subtopic, categoryTitle, index),
    scenario: template.scenario(title, subtopic, statement, categoryTitle),
    takeaway: template.takeaway(title, subtopic),
  }));
}

type TheoremExampleTemplate = {
  title: (title: string, subtopic: string, categoryTitle: string, index: number) => string;
  scenario: (title: string, subtopic: string, statement: string, categoryTitle: string) => string;
  takeaway: (title: string, subtopic: string) => string;
};

const theoremExampleTemplates: Record<string, TheoremExampleTemplate[]> = {
  algebra: [
    contextualExample("Equation check", "When solving an equation or identity, verify the algebraic conditions first, then use the theorem to replace a long expansion with the trusted result."),
    contextualExample("Polynomial shortcut", "In a polynomial question, use the theorem to connect roots, factors, coefficients, or remainders without testing every value separately."),
    contextualExample("Exam simplification", "For a board-style simplification, identify the pattern in the statement and apply the theorem before doing routine arithmetic."),
    contextualExample("Model validation", "In a numeric model, use the theorem as a check that the transformed expression still carries the same solution set or structure."),
  ],
  geometry: [
    contextualExample("Diagram proof", "In a geometry proof, mark the given lengths, angles, parallels, or circles, then apply the theorem once its exact diagram conditions are visible."),
    contextualExample("Measurement problem", "When a length or angle is missing, use the theorem to convert known parts of the figure into the unknown target."),
    contextualExample("Construction check", "After drawing a figure, use the theorem to test whether the construction has the required parallel, congruent, similar, or circular relation."),
    contextualExample("Real layout", "In a floor plan, bridge, field, or navigation diagram, use the theorem to compute a distance or angle that cannot be measured directly."),
  ],
  "proportional-reasoning": [
    contextualExample("Recipe scaling", "When ingredients, map distances, or prices scale together, use the theorem to keep the same ratio across old and new quantities."),
    contextualExample("Unit conversion", "Convert all measurements into matching units, then apply the theorem so the proportion compares like with like."),
    contextualExample("Data sharing", "Use the theorem to split a total into fair shares, sector angles, or equivalent ratios without changing the original relationship."),
    contextualExample("Rate comparison", "In speed, work, or density problems, decide whether the situation is direct or inverse before applying the proportional rule."),
  ],
  trigonometry: [
    contextualExample("Triangle solving", "Use the theorem when sides, angles, and trigonometric ratios appear together and a missing side or angle must be found."),
    contextualExample("Wave analysis", "In sound, light, AC circuits, or circular motion, apply the theorem to simplify periodic expressions or compare phase shifts."),
    contextualExample("Identity proof", "Transform one side of a trigonometric identity using the theorem until it matches the other side."),
    contextualExample("Navigation problem", "Use bearings, elevation angles, or rotations with the theorem to turn observed angles into practical distances."),
  ],
  "coordinate-geometry": [
    contextualExample("Map coordinate task", "Plot the given points, translate the theorem into coordinates, and compute the required distance, slope, midpoint, area, or locus."),
    contextualExample("Computer graphics", "Use the theorem to check whether a transformation preserves shape, length, angle, orientation, or scale."),
    contextualExample("Analytic proof", "Replace a geometric claim with coordinate equations, then apply the theorem to prove the relation exactly."),
    contextualExample("Path planning", "In robotics or navigation, use the theorem to identify the shortest distance, line relation, or conic path in coordinate form."),
  ],
  "calculus-analysis": [
    contextualExample("Graph behavior", "Use the theorem to connect limits, derivatives, continuity, or integrals to visible graph behavior."),
    contextualExample("Optimization", "Check differentiability and interval conditions, then apply the theorem to locate guaranteed slopes, extrema, or changes."),
    contextualExample("Approximation", "Use the theorem to replace a difficult function by a controlled local or accumulated estimate."),
    contextualExample("Engineering signal", "In motion, growth, heat, or signal data, apply the theorem to connect a rate of change with total change."),
  ],
  "number-theory": [
    contextualExample("Divisibility check", "Use the theorem to decide divisibility, gcd, prime structure, or modular behavior without brute-force testing every case."),
    contextualExample("Cryptography toy model", "In modular arithmetic examples, apply the theorem to justify inverses, residues, or repeating powers."),
    contextualExample("Olympiad proof", "Translate the problem into integers, remainders, or prime factors, then use the theorem to force a contradiction or classification."),
    contextualExample("Algorithm trace", "Use the theorem to explain why a repeated arithmetic procedure eventually stops and returns the correct integer result."),
  ],
  "probability-statistics": [
    contextualExample("Risk estimate", "Use the theorem to combine probabilities, expectations, variation, or sampling behavior in a real decision."),
    contextualExample("Experiment design", "Check independence, partitions, sample size, or distribution assumptions before applying the probability result."),
    contextualExample("Data interpretation", "Use the theorem to connect sample evidence with a population claim, interval, regression, or distribution pattern."),
    contextualExample("Simulation check", "Run a spreadsheet or code simulation and compare the observed pattern with the theorem's predicted behavior."),
  ],
  "linear-algebra-vectors": [
    contextualExample("System solving", "Use the theorem to decide whether a matrix system has a unique solution, many solutions, or a structural shortcut."),
    contextualExample("Data projection", "Apply the theorem when vectors must be decomposed, projected, transformed, or compared by angle and length."),
    contextualExample("3D modelling", "Use the theorem to compute areas, volumes, rotations, or directions in graphics, mechanics, and geometry."),
    contextualExample("Machine learning", "In feature spaces, apply the theorem to understand dimension, rank, orthogonality, or eigenvector behavior."),
  ],
  "complex-numbers": [
    contextualExample("Complex arithmetic", "Use the theorem to convert a complex-number calculation into modulus, argument, roots, or conjugates."),
    contextualExample("Signal phase", "In waves and circuits, apply the theorem to track amplitude and phase with compact complex notation."),
    contextualExample("Geometry in the plane", "Use complex numbers as points and apply the theorem to reason about rotations, distances, or roots around a circle."),
    contextualExample("Advanced analysis", "For analytic functions or contour integrals, use the theorem to decide which boundary or residue information controls the result."),
  ],
  "discrete-logic": [
    contextualExample("Counting design", "Use the theorem to count choices, prove a recurrence, or avoid overcounting in a discrete structure."),
    contextualExample("Logic check", "Translate the statement into implications, truth tables, relations, or set operations before applying the theorem."),
    contextualExample("Algorithm proof", "Use the theorem to prove a loop invariant, recurrence step, induction claim, or correctness guarantee."),
    contextualExample("Scheduling puzzle", "Model people, tasks, boxes, or cases discretely, then apply the theorem to force an existence or counting result."),
  ],
  "graph-theory": [
    contextualExample("Network route", "Use the theorem to decide whether a graph has a trail, circuit, matching, cut, coloring, or shortest path property."),
    contextualExample("Infrastructure model", "Represent roads, pipes, circuits, or dependencies as vertices and edges, then apply the theorem to test feasibility."),
    contextualExample("Algorithm guarantee", "Use the theorem to explain why a graph algorithm returns the right answer under its required conditions."),
    contextualExample("Puzzle verification", "In map coloring, tree, or matching puzzles, apply the theorem as a quick structural check before searching."),
  ],
  "optimization-engineering": [
    contextualExample("Design optimization", "Use the theorem to turn a design constraint into a condition for minimum cost, maximum strength, or best performance."),
    contextualExample("Numerical method", "Check smoothness, signs, or convergence assumptions before trusting the computed approximation."),
    contextualExample("Signal or field model", "Apply the theorem to transform derivatives, integrals, flux, energy, or frequency-domain information."),
    contextualExample("Engineering safety check", "Use the theorem to confirm whether an equilibrium, bound, or conservation principle supports the model result."),
  ],
  default: [
    contextualExample("Concept check", "Use the theorem after the conditions are verified, then compare the result with the original statement."),
    contextualExample("Worked problem", "In a standard exercise, identify the given structure, apply the theorem, and simplify the conclusion."),
    contextualExample("Proof step", "Use the theorem as a bridge between a known setup and the result that must be proved."),
    contextualExample("Real context", "Translate a measurement, model, or data situation into the theorem's language before using the result."),
  ],
};

function contextualExample(title: string, scenarioTemplate: string): TheoremExampleTemplate {
  return {
    title: (_theoremTitle, subtopic) => `${title}: ${subtopic}`,
    scenario: (theoremTitle, _subtopic, statement, _categoryTitle) =>
      `${scenarioTemplate} Here the active theorem is ${theoremTitle}; its statement says: ${statement}`,
    takeaway: (theoremTitle) => `The useful move is to check the hypotheses of ${theoremTitle} first, then apply the conclusion directly.`,
  };
}

function buildTheoremScaffold(
  title: string,
  subtopic: string,
  statement: string,
  prerequisites: string[],
  categoryTitle: string,
): TheoremProofDraft {
  const prerequisiteText = prerequisites.length ? prerequisites.join(", ") : "the core definitions";
  return draft(
    `${title} connects the definitions in ${subtopic.toLowerCase()} to a reusable result. This foundation draft gives students a reliable route through the proof idea before a custom visual proof is built.`,
    [
      ["Read the claim", `State the theorem in your own words: ${statement}`, "The statement is split into givens, conditions, and target result."],
      ["List the needed ideas", `Use ${prerequisiteText} as the toolkit for the argument.`, "Prerequisite ideas are shown as small cards feeding into the proof."],
      ["Build the setup", `Introduce the objects from the theorem and mark what belongs to ${subtopic.toLowerCase()}.`, "A labeled setup diagram or symbolic workspace is prepared."],
      ["Use the key relation", `Apply the defining relation or standard identity behind ${title.toLowerCase()} until the target statement appears.`, "The central equality, inclusion, counting step, or transformation is highlighted."],
      ["Check the conditions", "Verify that the hypotheses were used and that no extra assumption was introduced.", "A checklist confirms domain, dimension, non-zero, continuity, or independence conditions as needed."],
      ["State the conclusion", `Conclude the result exactly as required for ${categoryTitle}.`, "The final theorem statement is boxed and matched back to the starting claim."],
    ],
    `For ${title}, always identify the hypotheses first, then show how they force the conclusion.`,
    ["Memorizing the statement without checking its hypotheses.", "Using a theorem outside its valid conditions.", "Skipping the step that connects the setup to the final claim."],
  );
}

function category(id: string, title: string, description: string, accent: string, seeds: TheoremSeed[]): TheoremCategory {
  return {
    id,
    title,
    description,
    accent,
    theorems: seeds.map((seed, index) => theorem(seed, title, id, index)),
  };
}

const theoremProofDrafts: Record<string, TheoremProofDraft> = {
  ...advancedProofDrafts,
  ...algebraProofDrafts,
  ...coordinateCalculusProofDrafts,
  ...geometryProofDrafts,
  ...linearAlgebraProofDrafts,
  ...trigonometryProofDrafts,
  "proportional-reasoning:Cross multiplication principle": draft(
    "Equal ratios can be turned into equal cross-products by multiplying both sides by the two denominators.",
    [
      ["Start with equal ratios", "Assume a/b = c/d with b and d non-zero.", "Two fraction cards are placed side by side."],
      ["Clear both denominators", "Multiply both sides by bd so both denominators are removed using the same non-zero factor.", "The same rectangle scale is applied to both ratios."],
      ["Cancel matching factors", "bd(a/b) becomes ad and bd(c/d) becomes bc.", "The denominator labels cancel cleanly."],
      ["Compare products", "The result is ad = bc, so the two diagonal products give the exact equality test for the ratios.", "Cross-products are highlighted as equal areas."],
      ["Reverse the reasoning", "If ad = bc, divide by bd to get a/b = c/d.", "The equality returns to ratio form."],
    ],
    "Equal ratios mean equal cross-products, and equal cross-products mean equal ratios.",
    ["Using zero denominators.", "Multiplying only one side.", "Forgetting that the reverse direction also matters."],
  ),
  "proportional-reasoning:Representative fraction principle": draft(
    "A map scale is a ratio between map distance and actual distance after both are written in the same unit.",
    [
      ["Name the two distances", "Identify the distance on the map and the real distance.", "A map segment is paired with a real-world segment."],
      ["Convert units", "Write both lengths in the same unit.", "Different unit labels become matching unit labels."],
      ["Form the ratio", "RF = map distance / actual distance.", "The shorter map segment sits over the longer actual segment."],
      ["Reduce to 1:n", "Divide both terms by the map distance.", "The ratio becomes one map unit to n real units."],
      ["Use the scale", "Multiply map distance by n for actual distance, or divide actual distance by n for map distance.", "The same scale bar works both ways."],
    ],
    "Representative fraction always needs same units first.",
    ["Mixing centimetres and kilometres in one ratio.", "Treating 1:50000 as 50000 cm only after conversion is ignored."],
  ),
  "proportional-reasoning:Multi-term ratio division principle": draft(
    "A whole split in a:b:c gives each part its fraction of the total ratio sum.",
    [
      ["Add ratio parts", "Find r1+r2+...+rk so the total number of equal ratio units in the whole is known.", "All ratio blocks line up to show the full whole."],
      ["Find one unit", "One ratio unit is total divided by the sum of parts.", "The whole bar is chopped into equal units."],
      ["Scale each part", "Multiply each ratio part by the value of one unit.", "Each coloured section receives its share."],
      ["Check total", "Add all shares back together to confirm the split has used the whole amount and nothing has been lost.", "The shares refill the original whole exactly."],
    ],
    "Part share = part/sum of parts x total.",
    ["Dividing the total by each part separately.", "Forgetting to check that all shares add back to the original total."],
  ),
  "proportional-reasoning:Pie-angle proportionality principle": draft(
    "Pie chart sector angles share 360 degrees in the same ratio as the data parts.",
    [
      ["Start with a ratio", "Write the parts r1:r2:...:rk so each sector can be linked to one named part of the data.", "Ratio blocks sit beside a blank circle."],
      ["Add the parts", "Find the total ratio units because the full 360 degrees must be shared across all parts together.", "The full circle is labelled as all units together."],
      ["Compute each angle", "angle_i = part_i / total_parts x 360 degrees.", "Each sector grows by its proportional share."],
      ["Check the circle", "All sector angles must add to 360 degrees.", "The circle closes with no gap or overlap."],
    ],
    "Pie angles are ratio shares of 360 degrees.",
    ["Using 100 instead of 360 for angles.", "Rounding early so the final sectors do not add to 360."],
  ),
  "proportional-reasoning:Direct proportion constant-ratio principle": draft(
    "In direct proportion, equal multiplication of x causes equal multiplication of y, so y/x stays constant.",
    [
      ["Write the model", "Use y = kx to show that y is always made by multiplying x by one fixed constant.", "A straight line through the origin is shown."],
      ["Divide by x", "For x non-zero, y/x = k, so every valid pair keeps the same ratio of output to input.", "Every point has the same ratio label."],
      ["Test two points", "Compare y1/x1 and y2/x2; equal ratios mean the two points follow the same direct proportion.", "Two points project to matching ratio cards."],
      ["Predict a new value", "Use y2 = kx2 so the new input is scaled by the same constant as every earlier input.", "A new point lands on the same line."],
    ],
    "Direct proportion keeps y/x constant.",
    ["Checking difference instead of ratio.", "Using direct proportion when doubling one value halves the other."],
  ),
  "proportional-reasoning:Inverse proportion constant-product principle": draft(
    "In inverse proportion, one quantity grows while the other shrinks so their product stays fixed.",
    [
      ["Write the model", "Use xy = k or y = k/x to show that the product stays fixed while the factors trade size.", "A rectangle with fixed area k is shown."],
      ["Test two pairs", "Compare x1y1 and x2y2; equal products show the pairs belong to the same inverse proportion.", "Both rectangles have the same area."],
      ["Predict a new value", "Use y2 = k/x2 so the fixed product is preserved after choosing the new x value.", "Changing width forces height to adjust."],
      ["Interpret the context", "More workers need fewer days; faster speed needs less time.", "Real examples sit beside the rectangle model."],
    ],
    "Inverse proportion keeps xy constant.",
    ["Checking ratio instead of product.", "Assuming every decreasing relationship is inverse proportion."],
  ),
  "number-theory:Euclid division lemma": draft(
    "Place multiples of the positive divisor on the number line; every integer lands between two neighboring multiples, and the leftover distance is the remainder.",
    [
      ["Choose the divisor", "Let b be a positive integer. Mark ..., -2b, -b, 0, b, 2b, ... on the number line.", "Equally spaced ticks of length b."],
      ["Trap the dividend", "For any integer a, choose the greatest multiple qb that is not greater than a.", "a sits at or to the right of qb."],
      ["Name the leftover", "Define r = a - qb. Since qb <= a, r is not negative.", "A short segment from qb to a."],
      ["Bound the leftover", "The next multiple is (q+1)b. Because qb is the greatest allowed multiple, a is less than (q+1)b, so r < b.", "The leftover segment is shorter than one full divisor step."],
      ["Prove uniqueness", "If a = bq + r = bq' + r' with 0 <= r,r' < b, then b(q-q') = r'-r. The right side has size less than b, so it must be 0.", "Two different slots cannot hold the same integer with valid remainders."],
    ],
    "Division always means dividend = divisor x quotient + remainder, with 0 <= remainder < divisor.",
    ["Forgetting the remainder bound.", "Using a negative divisor without first converting to a positive divisor.", "Thinking quotient and remainder are not unique."],
  ),
  "number-theory:Euclidean algorithm theorem": draft(
    "Repeated division keeps the same common divisors while making the remainder smaller, so the last non-zero remainder is the gcd.",
    [
      ["Start with division", "Write a = bq + r with 0 <= r < b.", "A large bar a split into q bars of length b plus leftover r."],
      ["Common divisors transfer", "Any number dividing both a and b also divides r = a - bq.", "The same divisor marks fit a, b, and the leftover."],
      ["Reverse the transfer", "Any number dividing both b and r also divides a = bq + r.", "Rebuilding a from b-blocks and r preserves divisibility."],
      ["Repeat with smaller pair", "So gcd(a,b)=gcd(b,r). Since remainders shrink, the process must stop.", "Pairs step downward: (a,b) -> (b,r)."],
      ["Read the last non-zero remainder", "When the remainder becomes 0, the previous divisor divides everything and is greatest.", "Final exact division reveals the gcd."],
    ],
    "Euclid's algorithm works because gcd(a,b) = gcd(b, remainder).",
    ["Stopping at the zero remainder instead of the previous non-zero remainder.", "Not showing why common divisors are preserved both ways."],
  ),
  "number-theory:Bezout identity": draft(
    "Run the Euclidean algorithm, then substitute backward until the gcd is written as ax + by.",
    [
      ["Compute the gcd", "Use repeated division until the last non-zero remainder d appears.", "Euclidean remainder ladder."],
      ["Write each remainder equation", "Each step has the form r = previous number - quotient x current number.", "A chain of linear equations."],
      ["Start from the gcd equation", "The last non-zero remainder d is already a difference of two earlier remainders.", "d appears at the bottom of the ladder."],
      ["Substitute backward", "Replace every intermediate remainder by its earlier expression.", "The ladder folds upward one rung at a time."],
      ["Collect coefficients", "After substitution, d = ax + by for some integers x and y.", "Only the original two integers remain."],
    ],
    "Euclid gives the gcd; back-substitution gives the coefficients.",
    ["Assuming x and y are positive.", "Forgetting that Bezout coefficients are usually not unique."],
  ),
  "number-theory:Fundamental theorem of arithmetic": draft(
    "Existence comes from factoring composites until primes appear; uniqueness comes from Euclid's lemma for primes dividing products.",
    [
      ["Show existence", "If n is prime, it is already factored. If composite, split it into smaller factors and continue.", "A factor tree whose leaves get smaller."],
      ["Stop the factor tree", "Positive factors greater than 1 cannot decrease forever, so the leaves must eventually be primes.", "Finite descent down the tree."],
      ["Compare two factorizations", "Suppose n has two prime factorizations.", "Two rows of prime factors multiply to the same n."],
      ["Use prime divisibility", "A prime on one side divides the product on the other, so it must match one prime factor there.", "One prime is paired across the rows."],
      ["Cancel and repeat", "Cancel the matched prime and repeat until all primes match up to order.", "The two rows become identical after reordering."],
    ],
    "Every integer has one prime-factor fingerprint.",
    ["Forgetting that order does not matter.", "Using uniqueness without justifying why a prime dividing a product divides one factor."],
  ),
  "number-theory:Euclid infinitude of primes": draft(
    "Assume a finite prime list, multiply them all and add 1; the new number avoids divisibility by every listed prime.",
    [
      ["Assume finite primes", "Suppose p1, p2, ..., pk are all primes.", "A closed list of primes."],
      ["Build the challenger", "Let N = p1p2...pk + 1, one more than the product of every prime on the assumed list.", "A product block plus one extra unit."],
      ["Test listed primes", "Dividing N by any listed prime leaves remainder 1.", "Each prime divides the product part but not the extra 1."],
      ["Find a prime divisor", "Every integer greater than 1 has some prime divisor.", "N must have at least one prime leaf in its factor tree."],
      ["Contradict the list", "That prime divisor is not on the finite list, so the list was incomplete.", "The closed list breaks open."],
    ],
    "Product of all known primes plus 1 forces a new prime divisor.",
    ["Claiming N itself must be prime; it only needs a prime divisor not on the list.", "Forgetting the contradiction assumption."],
  ),
  "number-theory:Divisibility by 3 theorem": draft(
    "In base ten, 10 leaves remainder 1 modulo 3, so every power of 10 behaves like 1.",
    [
      ["Write the number by place value", "Write N = d0 + 10d1 + 100d2 + ..., separating each digit with its power-of-ten weight.", "Digits sitting in ones, tens, hundreds, and so on."],
      ["Reduce powers of ten", "Since 10 = 1 mod 3, every 10^k = 1 mod 3.", "Each place-value weight collapses to 1."],
      ["Collapse to digit sum", "Therefore N has the same remainder as d0+d1+d2+... modulo 3.", "The weighted digit row becomes a simple sum."],
      ["Compare divisibility", "N is divisible by 3 exactly when its digit sum is divisible by 3.", "Same remainder means same divisibility result."],
    ],
    "Modulo 3, every decimal place is worth 1.",
    ["Testing only one example as a proof.", "Adding digits repeatedly without explaining why it preserves divisibility."],
  ),
  "number-theory:Divisibility by 9 theorem": draft(
    "In base ten, 10 leaves remainder 1 modulo 9, so the number and its digit sum have the same remainder modulo 9.",
    [
      ["Expand by decimal places", "Write N = d0 + 10d1 + 100d2 + ..., so each digit is attached to a decimal place value.", "A decimal place-value expansion."],
      ["Use the key congruence", "Because 10 = 1 mod 9, every 10^k = 1 mod 9.", "All place weights become 1."],
      ["Replace weighted places", "So N has the same remainder as d0+d1+d2+... modulo 9.", "The number reduces to its digit sum."],
      ["Finish the test", "A number is divisible by 9 exactly when that digit sum is divisible by 9.", "Equal remainders decide divisibility."],
    ],
    "Modulo 9, every decimal place is also worth 1.",
    ["Mixing up divisibility by 9 with divisibility by 3.", "Forgetting the proof depends on base ten."],
  ),
  "number-theory:Chinese remainder theorem": draft(
    "For coprime moduli, build switch numbers that are 1 in one modulus and 0 in all the others, then add the requested residues.",
    [
      ["Set up coprime moduli", "Let m1, m2, ..., mk be pairwise coprime.", "Separate clocks whose cycle lengths do not share factors."],
      ["Build one switch", "For modulus mi, let Mi be the product of all other moduli. Since gcd(Mi,mi)=1, Mi has an inverse modulo mi.", "A switch that is off on other clocks and adjustable on clock i."],
      ["Match each residue", "The term ai Mi yi is congruent to ai modulo mi and 0 modulo the other moduli.", "One switch controls one congruence."],
      ["Add all switches", "x = sum ai Mi yi satisfies all congruences at once.", "The switches combine into one number."],
      ["Show uniqueness modulo product", "If two solutions satisfy all congruences, their difference is divisible by every mi, hence by the product.", "One solution class modulo M."],
    ],
    "CRT works by making one modular switch for each condition.",
    ["Forgetting pairwise coprime is required.", "Thinking the solution is unique as an integer instead of modulo the product."],
  ),
  "number-theory:Fermat little theorem": draft(
    "Multiplication by a nonzero residue permutes the nonzero classes modulo a prime.",
    [
      ["List nonzero residues", "Modulo prime p, the nonzero residues are 1,2,...,p-1.", "A row of p-1 nonzero slots."],
      ["Multiply by a", "If p does not divide a, then a,2a,...,(p-1)a are also nonzero modulo p.", "The row is shuffled by multiplication."],
      ["Show no collisions", "If ia = ja mod p, then p divides a(i-j). Since p does not divide a, p divides i-j, so i=j.", "No two slots merge."],
      ["Compare products", "The shuffled row has the same product as the original row modulo p.", "(a)(2a)...((p-1)a) equals 1.2...(p-1) mod p."],
      ["Cancel the common product", "Cancel (p-1)! modulo p to get a^(p-1)=1 mod p.", "The shared factorial drops out."],
    ],
    "A nonzero multiplier only shuffles prime-mod residues.",
    ["Using cancellation modulo a composite without checking invertibility.", "Forgetting the condition p does not divide a."],
  ),
  "number-theory:Euler theorem": draft(
    "Euler's theorem repeats Fermat's permutation idea on the reduced residue system modulo n.",
    [
      ["Take reduced residues", "List all residues less than n and coprime to n. There are phi(n) of them.", "Only invertible clock positions are kept."],
      ["Multiply by a coprime number", "If gcd(a,n)=1, multiplication by a keeps residues coprime to n.", "The reduced residue list is shuffled."],
      ["Prove the shuffle has no repeats", "If ar_i = ar_j mod n, the inverse of a modulo n gives r_i = r_j.", "Invertibility prevents collisions."],
      ["Compare products", "The product after multiplying by a equals the original product modulo n.", "a^phi(n) times the old product equals the old product."],
      ["Cancel the invertible product", "Each reduced residue is invertible, so the product can be cancelled, giving a^phi(n)=1 mod n.", "Only the power of a remains."],
    ],
    "Coprime multiplication shuffles all invertible residues modulo n.",
    ["Applying the theorem when gcd(a,n) is not 1.", "Using phi(n) without identifying the reduced residues."],
  ),
  "number-theory:Wilson theorem": draft(
    "Modulo a prime, every nonzero residue pairs with its inverse, except 1 and -1.",
    [
      ["Assume p is prime", "The nonzero residues modulo p all have multiplicative inverses.", "A complete invertible set."],
      ["Pair inverse partners", "Most residues pair with a different inverse, and each pair multiplies to 1.", "Two-by-two inverse pairs vanish into 1."],
      ["Identify fixed inverses", "The only residues equal to their own inverse solve x^2=1, so x=1 or x=-1 modulo p.", "Only 1 and p-1 stand alone."],
      ["Multiply all residues", "(p-1)! is the product of all nonzero residues, so it is 1 x (-1) x paired 1s = -1 mod p.", "All pairs collapse to -1."],
      ["Converse idea", "If (n-1)! = -1 mod n, then n cannot be composite because a proper factor would divide the factorial and n.", "Composite numbers cannot leave remainder -1."],
    ],
    "In prime modulus, inverse pairs leave only 1 and -1.",
    ["Forgetting the special case p=2.", "Not proving why only 1 and -1 are self-inverse for primes."],
  ),
  "number-theory:Euler phi product theorem": draft(
    "For coprime moduli, CRT pairs each reduced residue modulo mn with one reduced residue modulo m and one modulo n.",
    [
      ["Use coprime moduli", "Let gcd(m,n)=1, so the two moduli behave as independent clocks under CRT.", "Two independent clocks."],
      ["Map residues by remainders", "Each residue modulo mn corresponds to a pair of residues modulo m and modulo n.", "CRT creates a two-coordinate address."],
      ["Track coprimality", "A number is coprime to mn exactly when it is coprime to both m and n.", "Good addresses are good in both coordinates."],
      ["Count good pairs", "There are phi(m) choices in the first coordinate and phi(n) in the second.", "A rectangle of valid pairs."],
      ["Conclude multiplicativity", "Therefore phi(mn)=phi(m)phi(n) when gcd(m,n)=1.", "Counts multiply across independent clocks."],
    ],
    "For coprime moduli, reduced residue choices multiply.",
    ["Applying phi(mn)=phi(m)phi(n) when m and n are not coprime.", "Counting all residues instead of only coprime residues."],
  ),
  "number-theory:Quadratic residue theorem": draft(
    "A quadratic residue is any remainder produced by a square; the proof draft compares square pairs x and -x modulo p.",
    [
      ["Define residues", "Modulo an odd prime p, a is a quadratic residue if x^2 = a mod p has a solution.", "A square machine on a p-hour clock."],
      ["Pair opposite inputs", "x and -x give the same square modulo p.", "Two mirror inputs land on one output."],
      ["Count square outputs", "Among nonzero residues, the p-1 inputs form (p-1)/2 opposite pairs, so there are at most (p-1)/2 nonzero square outputs.", "Pairs of inputs merge."],
      ["Show pair outputs are distinct", "If x^2=y^2, then (x-y)(x+y)=0 mod p, so y equals x or -x.", "No unexpected collisions."],
      ["Use the residue set", "This classifies which congruences x^2=a mod p are solvable by membership in the square-output set.", "Residues are exactly the square outputs."],
    ],
    "Squares modulo an odd prime come in x and -x input pairs.",
    ["Confusing the definition with the deeper quadratic reciprocity theorem.", "Forgetting zero is a special square residue."],
  ),
  "number-theory:Pigeonhole divisibility theorem": draft(
    "Long enough integer sequences force two partial sums to have the same remainder; their difference is divisible by the modulus.",
    [
      ["Create partial sums", "From a sequence, form S1, S2, ..., Sn.", "Cumulative sum markers."],
      ["Look at remainders", "Each partial sum has one of n possible remainders modulo n.", "n remainder boxes."],
      ["Handle zero remainder", "If some Sk has remainder 0, that block is already divisible by n.", "A marker lands in the zero box."],
      ["Use repeated remainders", "Otherwise n sums land in only n-1 nonzero boxes, so two have the same remainder.", "Two markers share a box."],
      ["Subtract partial sums", "Their difference is a consecutive block sum divisible by n.", "Same remainder cancels to 0."],
    ],
    "Same remainder means the difference is divisible.",
    ["Forgetting the zero-remainder case.", "Subtracting in the wrong order but not taking the corresponding block."],
  ),
  "number-theory:LCM-GCD product theorem": draft(
    "Prime exponents split into minimums for gcd and maximums for lcm; min plus max equals the sum of the two original exponents.",
    [
      ["Prime factor both numbers", "Write a and b using the same prime list with exponents alpha_i and beta_i.", "Two exponent rows under the same primes."],
      ["Read the gcd", "The gcd uses min(alpha_i,beta_i) for each prime.", "Shared overlap of prime powers."],
      ["Read the lcm", "The lcm uses max(alpha_i,beta_i) for each prime.", "Combined coverage of prime powers."],
      ["Add exponents", "For each prime, min(alpha,beta)+max(alpha,beta)=alpha+beta.", "Overlap plus coverage equals both rows together."],
      ["Multiply back", "Thus gcd(a,b) x lcm(a,b) has the same prime exponents as ab.", "Prime fingerprints match."],
    ],
    "GCD takes overlap, LCM takes coverage; together they equal the product.",
    ["Using the theorem with negative numbers without taking positive gcd/lcm conventions.", "Forgetting it is simplest for positive integers."],
  ),
  "number-theory:Modular inverse theorem": draft(
    "A modular inverse exists exactly when Bezout can make ax + ny = 1.",
    [
      ["Assume inverse exists", "If ax = 1 mod n, then ax - 1 is divisible by n.", "ax differs from 1 by a multiple of n."],
      ["Convert to Bezout form", "So ax + ny = 1 for some integer y.", "A linear combination equals 1."],
      ["Infer gcd condition", "Any common divisor of a and n divides the left side, hence divides 1, so gcd(a,n)=1.", "Only common divisor is 1."],
      ["Reverse with Bezout", "If gcd(a,n)=1, Bezout gives ax + ny = 1.", "Euclid's back-substitution creates coefficients."],
      ["Reduce modulo n", "The equation becomes ax = 1 mod n, so x is the modular inverse.", "The n-term disappears on the clock."],
    ],
    "Inverse modulo n is Bezout's coefficient of a when gcd(a,n)=1.",
    ["Trying to invert a number not coprime to the modulus.", "Forgetting inverses are unique only modulo n."],
  ),
  "number-theory:Prime divisor theorem": draft(
    "If a composite number has no factor at or below its square root, then both factors would be larger than the square root, making their product too large.",
    [
      ["Assume n is composite", "Write n = ab with 1 < a <= b < n.", "A rectangle with side lengths a and b."],
      ["Compare to square root", "If a were greater than sqrt(n), then b is also greater than sqrt(n).", "Both rectangle sides exceed the square side."],
      ["Contradict the product", "Then ab would be greater than n, impossible because ab = n.", "The rectangle area would be too large."],
      ["Find a small factor", "So a <= sqrt(n), meaning every composite number has at least one factor no larger than its square root.", "At least one side is no longer than the square-root side."],
      ["Descend to a prime divisor", "If a is not prime, factor it until a prime divisor appears; that prime is also <= sqrt(n).", "A factor tree under the small factor."],
    ],
    "A composite number must reveal a prime factor by sqrt(n).",
    ["Testing divisibility past sqrt(n) unnecessarily.", "Saying the factor itself must be prime before factoring it."],
  ),
  "number-theory:Order theorem": draft(
    "The powers of a modulo n form a cycle inside the reduced residue group, and the cycle length divides the group size.",
    [
      ["Define the order", "The order d of a modulo n is the smallest positive d with a^d = 1 mod n.", "A repeated multiplication cycle returning to 1."],
      ["List the generated cycle", "1, a, a^2, ..., a^(d-1) are distinct modulo n.", "d distinct positions around a cycle."],
      ["Use coprime condition", "When gcd(a,n)=1, these powers live inside the phi(n) reduced residues.", "The cycle sits inside the invertible clock positions."],
      ["Partition by cosets", "Multiplying the cycle by any reduced residue creates a same-size block, and blocks are either disjoint or identical.", "Equal-sized tiles cover the reduced residue set."],
      ["Conclude divisibility", "Since the phi(n) reduced residues are tiled by blocks of size d, d divides phi(n).", "Cycle length divides total invertible positions."],
    ],
    "The order is a cycle length, and cycles tile the reduced residue set.",
    ["Forgetting gcd(a,n)=1.", "Confusing order with phi(n) itself; order only divides phi(n)."],
  ),
};

function draft(proofIdea: string, rawSteps: Array<[string, string, string]>, examMemory: string, commonMistakes: string[]): TheoremProofDraft {
  return {
    proofIdea,
    proofSteps: rawSteps.map(([title, explanation, representation]) => ({ title, explanation, representation })),
    examMemory,
    commonMistakes,
  };
}

export const theoremCategories: TheoremCategory[] = [
  category("algebra", "Algebra", "Identities, equations, roots, inequalities, functions, and polynomial structure.", "cyan", [
    ["Factor theorem", "Polynomials", "If p(a)=0, then x-a is a factor of p(x).", ["Polynomial division"]],
    ["Remainder theorem", "Polynomials", "The remainder when p(x) is divided by x-a is p(a).", ["Substitution"]],
    ["Fundamental theorem of algebra", "Polynomials", "Every non-constant complex polynomial has at least one complex root.", ["Complex numbers"]],
    ["Polynomial root-factor theorem", "Polynomials", "A degree n polynomial has at most n roots unless it is the zero polynomial.", ["Factor theorem"]],
    ["Vieta theorem", "Equations", "The sums and products of polynomial roots are controlled by its coefficients.", ["Polynomial roots"]],
    ["Quadratic discriminant theorem", "Equations", "The sign of b^2-4ac classifies real roots of ax^2+bx+c=0.", ["Quadratics"]],
    ["Completing square theorem", "Quadratics", "Every quadratic can be rewritten in vertex form by completing a square.", ["Expansion"]],
    ["AM-GM inequality", "Inequalities", "For non-negative numbers, the arithmetic mean is at least the geometric mean.", ["Averages"]],
    ["Cauchy-Schwarz inequality", "Inequalities", "The square of a dot product is bounded by the product of squared lengths.", ["Vectors"]],
    ["Triangle inequality for real numbers", "Inequalities", "For real numbers a and b, the distance of a+b from zero is at most the two separate distances |a| and |b| added together.", ["Absolute value"]],
    ["Binomial theorem", "Expansions", "(a+b)^n expands using binomial coefficients.", ["Combinations"]],
    ["Pascal identity", "Combinatorics", "Each inner Pascal entry is the sum of the two entries above it.", ["Binomial coefficients"]],
    ["Rational root theorem", "Equations", "Rational roots of an integer polynomial must divide the constant over the leading coefficient.", ["Divisibility"]],
    ["Synthetic division theorem", "Polynomials", "Synthetic division gives the quotient and remainder for linear divisors.", ["Polynomial division"]],
    ["Polynomial division algorithm", "Polynomials", "For polynomials f and non-zero g, there are unique q and r with f=gq+r and degree r less than degree g.", ["Polynomial degree"]],
    ["Gauss lemma for polynomials", "Polynomials", "A primitive polynomial over the integers remains primitive under multiplication and factors over rationals only through integer primitive factors.", ["Integer polynomials"]],
    ["Eisenstein criterion", "Polynomials", "A polynomial satisfying Eisenstein's prime divisibility conditions is irreducible over the rationals.", ["Divisibility", "Prime numbers"]],
    ["Descartes rule of signs", "Polynomials", "The number of positive real roots is at most the number of sign changes in the coefficient sequence and differs from it by an even number.", ["Polynomial roots"]],
    ["Fundamental theorem of symmetric polynomials", "Polynomials", "Every symmetric polynomial can be written as a polynomial in the elementary symmetric polynomials.", ["Vieta theorem"]],
    ["Logarithm product theorem", "Logarithms", "The logarithm of a product is the sum of logarithms.", ["Exponents"]],
    ["Exponent laws theorem", "Exponents", "Multiplication, division, and powers of equal bases follow additive exponent rules.", ["Indices"]],
    ["Inverse function theorem for algebra", "Functions", "A one-to-one function has an inverse that reverses its input-output pairs.", ["Functions"]],
    ["Composition associativity theorem", "Functions", "Function composition is associative whenever the compositions are defined.", ["Mappings"]],
  ]),
  category("geometry", "Geometry", "Euclidean triangle, circle, quadrilateral, similarity, congruence, and area theorems.", "emerald", [
    ["Pythagorean theorem", "Right triangles", "In a right triangle, the square on the hypotenuse equals the sum of squares on the legs.", ["Squares"]],
    ["Converse of Pythagoras", "Right triangles", "If a^2+b^2=c^2, then the triangle is right-angled.", ["Triangle sides"]],
    ["Triangle angle sum theorem", "Triangles", "The interior angles of a triangle add to 180 degrees.", ["Parallel lines"]],
    ["Exterior angle theorem", "Triangles", "A triangle exterior angle equals the sum of the two remote interior angles.", ["Angle sum"]],
    ["Base angle theorem", "Isosceles triangles", "Equal sides in a triangle have equal opposite angles.", ["Congruence"]],
    ["SSS congruence theorem", "Congruence", "Three equal corresponding sides force two triangles to be congruent.", ["Triangles"]],
    ["SAS congruence theorem", "Congruence", "Two equal sides and the included angle force triangle congruence.", ["Triangles"]],
    ["ASA congruence theorem", "Congruence", "Two equal angles and the included side force triangle congruence.", ["Triangles"]],
    ["AA similarity theorem", "Similarity", "Two equal angles force two triangles to be similar.", ["Angles"]],
    ["Basic proportionality theorem", "Similarity", "A line parallel to one triangle side divides the other two sides proportionally.", ["Parallel lines"]],
    ["Angle bisector theorem", "Triangles", "An angle bisector divides the opposite side in the ratio of adjacent sides.", ["Ratios"]],
    ["Perpendicular bisector theorem", "Loci", "Points on a perpendicular bisector are equidistant from segment endpoints.", ["Distance"]],
    ["Median centroid theorem", "Triangles", "The centroid divides every median in a 2:1 ratio.", ["Medians"]],
    ["Cyclic quadrilateral theorem", "Circles", "Opposite angles of a cyclic quadrilateral sum to 180 degrees.", ["Circle angles"]],
    ["Tangent radius theorem", "Circles", "A tangent to a circle is perpendicular to the radius at the point of contact.", ["Tangents"]],
    ["Alternate segment theorem", "Circles", "The angle between a tangent and chord equals the angle in the alternate segment.", ["Circle angles"]],
    ["Intersecting chords theorem", "Circles", "Products of the two chord segments are equal for intersecting chords.", ["Similarity"]],
    ["Power of a point theorem", "Circles", "Secant and tangent products from one external point are equal.", ["Similar triangles"]],
    ["Ceva theorem", "Triangle concurrency", "Cevians AD, BE, and CF in a triangle are concurrent exactly when (BD/DC)(CE/EA)(AF/FB)=1.", ["Ratios", "Triangles"]],
    ["Menelaus theorem", "Triangle transversals", "A transversal meeting the sides of a triangle gives a signed product of ratios equal to -1.", ["Ratios", "Collinearity"]],
    ["Ptolemy theorem", "Cyclic quadrilaterals", "In a cyclic quadrilateral, the product of diagonals equals the sum of products of opposite sides.", ["Cyclic quadrilaterals"]],
    ["Stewart theorem", "Triangle lengths", "A cevian length in a triangle is controlled by the two side lengths and the division of the opposite side.", ["Triangles", "Algebra"]],
    ["Heron theorem", "Triangle area", "A triangle with side lengths a, b, and c has area sqrt(s(s-a)(s-b)(s-c)), where s is the semiperimeter.", ["Area", "Triangle sides"]],
    ["Euler line theorem", "Triangle centers", "In a non-equilateral triangle, the circumcenter, centroid, and orthocenter are collinear.", ["Triangle centers"]],
    ["Sierpinski retained area principle", "Fractals", "After n Sierpinski carpet iterations, the retained area fraction is (8/9)^n.", ["Fractions", "Area of a square", "Powers"]],
    ["Sierpinski removed-square sum principle", "Fractals", "The total number of removed squares after n iterations is 1+8+...+8^(n-1)=(8^n-1)/7.", ["Geometric sequences", "Finite sums"]],
    ["Orthographic projection maximum principle", "Solid views", "Top views record occupied footprint cells, while front and side views record maximum visible stack heights.", ["Cube stacks", "Maximum", "Projection"]],
    ["Projection non-uniqueness principle", "Solid views", "The same top, front, and side projections can describe more than one cube-stack solid unless extra constraints are given.", ["Orthographic projections", "Cube count"]],
  ]),
  category("proportional-reasoning", "Proportional Reasoning", "Ratio, map-scale, sharing, pie-chart, direct proportion, and inverse proportion principles.", "cyan", [
    ["Cross multiplication principle", "Equivalent ratios", "For non-zero b and d, a/b=c/d exactly when ad=bc.", ["Fractions", "Multiplication"]],
    ["Representative fraction principle", "Map scale", "A representative fraction is the ratio of map distance to actual distance after both are measured in the same unit.", ["Ratios", "Unit conversion"]],
    ["Multi-term ratio division principle", "Ratio sharing", "If a total T is divided in ratio r1:r2:...:rk, then share i equals (ri/(r1+r2+...+rk))T.", ["Fractions", "Addition"]],
    ["Pie-angle proportionality principle", "Pie charts", "Pie chart sector angles divide 360 degrees in the same ratio as the data parts.", ["Angles", "Ratios"]],
    ["Direct proportion constant-ratio principle", "Direct proportion", "In direct proportion, y/x remains constant and y=kx.", ["Ratio tables", "Graphs"]],
    ["Inverse proportion constant-product principle", "Inverse proportion", "In inverse proportion, xy remains constant and y=k/x.", ["Multiplication", "Graphs"]],
    ["Unit rate theorem", "Rates", "A proportional relationship can be represented by a single unit rate k so that output equals k times input.", ["Ratios", "Division"]],
    ["Scale factor area theorem", "Similarity scale", "When lengths are scaled by k, corresponding areas are scaled by k squared.", ["Similarity", "Area"]],
    ["Scale factor volume theorem", "Similarity scale", "When lengths are scaled by k, corresponding volumes are scaled by k cubed.", ["Similarity", "Volume"]],
    ["Compound percent multiplier theorem", "Percent change", "Successive percentage changes multiply their decimal multipliers rather than adding their percentages.", ["Percentages", "Multiplication"]],
  ]),
  category("trigonometry", "Trigonometry", "Unit circle, triangle laws, identities, periodicity, and inverse trigonometric facts.", "sky", [
    ["Sine rule", "Triangle solving", "In any triangle, a/sin A=b/sin B=c/sin C.", ["Triangle angles"]],
    ["Cosine rule", "Triangle solving", "In any triangle, c^2=a^2+b^2-2ab cos C.", ["Pythagoras"]],
    ["Area sine theorem", "Triangle area", "The area of a triangle is 1/2 ab sin C.", ["Area"]],
    ["Unit circle coordinate theorem", "Unit circle", "A unit circle point at angle theta has coordinates (cos theta, sin theta).", ["Coordinates"]],
    ["Pythagorean identity theorem", "Identities", "sin^2 theta+cos^2 theta=1 for every angle theta.", ["Unit circle"]],
    ["Tangent quotient theorem", "Identities", "tan theta equals sin theta divided by cos theta wherever cos theta is non-zero.", ["Ratios"]],
    ["Reciprocal identity theorem", "Identities", "sec, cosec, and cot are reciprocals of cos, sin, and tan.", ["Ratios"]],
    ["Sine addition theorem", "Angle addition", "sin(a+b)=sin a cos b+cos a sin b.", ["Rotations"]],
    ["Cosine addition theorem", "Angle addition", "cos(a+b)=cos a cos b-sin a sin b.", ["Rotations"]],
    ["Tangent addition theorem", "Angle addition", "tan(a+b)=(tan a+tan b)/(1-tan a tan b).", ["Quotient identity"]],
    ["Double angle theorem", "Angle multiples", "sin 2x and cos 2x can be written using single-angle functions.", ["Angle addition"]],
    ["Half angle theorem", "Angle halves", "sin^2(x/2) and cos^2(x/2) are controlled by cos x.", ["Double angle"]],
    ["Product-to-sum theorem", "Transformations", "Products of sine and cosine can be rewritten as sums.", ["Angle addition"]],
    ["Sum-to-product theorem", "Transformations", "Sums of trigonometric functions can be rewritten as products.", ["Angle addition"]],
    ["Even-odd trig theorem", "Symmetry", "Cosine is even while sine and tangent are odd.", ["Unit circle symmetry"]],
    ["Complementary angle theorem", "Cofunctions", "sin(90 degrees-theta)=cos theta and related cofunction identities hold.", ["Right triangles"]],
    ["Periodicity theorem", "Graphs", "Sine and cosine repeat every 360 degrees or 2 pi radians.", ["Circular motion"]],
    ["Inverse trig range theorem", "Inverse functions", "Inverse trigonometric functions use restricted ranges to become one-to-one.", ["Functions"]],
    ["Law of tangents", "Triangle solving", "In any triangle, (a-b)/(a+b)=tan((A-B)/2)/tan((A+B)/2).", ["Sine rule", "Sum-to-product theorem"]],
    ["Mollweide theorem", "Triangle solving", "Mollweide's equations relate sums and differences of two sides to half-sums and half-differences of opposite angles.", ["Sine rule", "Cosine rule"]],
    ["Triple angle theorem", "Angle multiples", "sin 3x and cos 3x can be expressed using powers of sin x or cos x.", ["Angle addition", "Double angle"]],
    ["Weierstrass substitution theorem", "Trig transformations", "The substitution t=tan(x/2) converts rational trigonometric expressions into rational functions of t.", ["Half angle theorem"]],
  ]),
  category("coordinate-geometry", "Coordinate Geometry", "Distance, slope, lines, conics, transformations, and analytic geometry theorems.", "violet", [
    ["Distance formula theorem", "Points", "Distance between two plane points follows the Pythagorean formula.", ["Pythagoras"]],
    ["Midpoint theorem", "Points", "The midpoint coordinates are the averages of endpoint coordinates.", ["Averages"]],
    ["Section formula theorem", "Points", "A point dividing a segment in a ratio has weighted-average coordinates.", ["Ratios"]],
    ["Slope criterion for parallel lines", "Lines", "Non-vertical parallel lines have equal slopes.", ["Slope"]],
    ["Slope criterion for perpendicular lines", "Lines", "Perpendicular non-vertical slopes multiply to -1.", ["Slope"]],
    ["Two-point line theorem", "Lines", "Two distinct points determine exactly one line.", ["Coordinates"]],
    ["Point-line distance theorem", "Lines", "Distance from a point to Ax+By+C=0 is absolute substitution over sqrt(A^2+B^2).", ["Perpendicular distance"]],
    ["Area shoelace theorem", "Polygons", "Polygon area can be computed from cross-products of successive coordinates.", ["Determinants"]],
    ["Collinearity determinant theorem", "Lines", "Three points are collinear exactly when their coordinate area determinant is zero.", ["Area"]],
    ["Circle center-radius theorem", "Circles", "(x-h)^2+(y-k)^2=r^2 describes all points at distance r from (h,k).", ["Distance formula"]],
    ["Parabola focus-directrix theorem", "Conics", "A parabola is the locus of points equidistant from a focus and a directrix.", ["Distance"]],
    ["Ellipse focal sum theorem", "Conics", "An ellipse is the locus with constant sum of distances from two foci.", ["Distance"]],
    ["Hyperbola focal difference theorem", "Conics", "A hyperbola is the locus with constant absolute difference of focal distances.", ["Distance"]],
    ["Conic eccentricity theorem", "Conics", "Eccentricity classifies conics as circle, ellipse, parabola, or hyperbola.", ["Conics"]],
    ["Rotation matrix theorem", "Transformations", "A rotation preserves lengths and angles in the coordinate plane.", ["Matrices"]],
    ["Reflection transformation theorem", "Transformations", "Reflection preserves distance and reverses orientation.", ["Symmetry"]],
    ["Translation invariance theorem", "Transformations", "Translation preserves distances, angles, and areas.", ["Vectors"]],
    ["Homothety scale theorem", "Transformations", "A scale factor k multiplies lengths by k and areas by k squared.", ["Similarity"]],
    ["Angle between two lines theorem", "Lines", "The tangent of the angle between two non-vertical lines is the absolute difference of slopes over one plus their product.", ["Slope"]],
    ["Line intercept theorem", "Lines", "A non-vertical non-horizontal line with intercepts a and b can be written as x/a+y/b=1.", ["Line equations"]],
    ["Tangent to circle theorem", "Circles", "The tangent at a point on a circle is perpendicular to the radius through that point and has an equation from the point-radius condition.", ["Circle equation", "Perpendicular lines"]],
    ["Pair of straight lines theorem", "Second-degree equations", "A homogeneous second-degree equation in x and y represents a pair of lines through the origin.", ["Quadratic forms"]],
    ["Conic tangent theorem", "Conics", "For a standard conic, the tangent at a known point is obtained by replacing squared terms with products of variable and point coordinates.", ["Conics", "Differentiation"]],
  ]),
  category("calculus-analysis", "Calculus & Analysis", "Limits, continuity, derivatives, integrals, series, and multivariable results.", "rose", [
    ["Squeeze theorem", "Limits", "A function trapped between two functions with the same limit has that limit.", ["Inequalities"]],
    ["Intermediate value theorem", "Continuity", "A continuous function takes every value between two endpoint values.", ["Continuity"]],
    ["Extreme value theorem", "Continuity", "A continuous function on a closed interval attains a maximum and minimum.", ["Closed intervals"]],
    ["Rolle theorem", "Derivatives", "If endpoint values match, some interior derivative is zero.", ["Differentiability"]],
    ["Mean value theorem", "Derivatives", "Some tangent slope equals the secant slope over a differentiable interval.", ["Rolle theorem"]],
    ["Taylor theorem", "Approximation", "A smooth function equals its Taylor polynomial plus a controlled remainder.", ["Derivatives"]],
    ["L'Hopital theorem", "Limits", "Certain indeterminate quotient limits can use derivative quotients.", ["Derivatives"]],
    ["Fundamental theorem of calculus I", "Integration", "Accumulated area functions have derivative equal to the integrand.", ["Definite integrals"]],
    ["Fundamental theorem of calculus II", "Integration", "A definite integral equals antiderivative value difference.", ["Antiderivatives"]],
    ["Integration by parts theorem", "Integration", "The product rule rearranges into an integral identity.", ["Product rule"]],
    ["Change of variables theorem", "Integration", "Substitution transforms an integral by changing variables and differentials.", ["Chain rule"]],
    ["Monotonicity theorem", "Derivatives", "A positive derivative implies increasing behavior on an interval.", ["Derivatives"]],
    ["Concavity theorem", "Derivatives", "The sign of the second derivative controls concavity.", ["Second derivative"]],
    ["Uniform convergence theorem", "Series", "Uniform limits of continuous functions remain continuous.", ["Sequences of functions"]],
    ["Ratio test theorem", "Series", "A series converges absolutely when the ratio limit is less than one.", ["Series"]],
    ["Green theorem", "Vector calculus", "A planar line integral equals a double integral of circulation over the region.", ["Line integrals"]],
    ["Divergence theorem", "Vector calculus", "Flux through a closed surface equals volume integral of divergence.", ["Surface integrals"]],
    ["Stokes theorem", "Vector calculus", "Boundary circulation equals surface integral of curl.", ["Curl"]],
    ["Bolzano-Weierstrass theorem", "Sequences", "Every bounded sequence in real numbers has a convergent subsequence.", ["Bounded sequences"]],
    ["Heine-Borel theorem", "Real analysis", "In real coordinate space, a set is compact exactly when it is closed and bounded.", ["Open covers", "Closed sets"]],
    ["Darboux theorem", "Derivatives", "Derivatives have the intermediate value property even when they are not continuous.", ["Derivatives", "Intermediate value theorem"]],
    ["Inverse function theorem", "Differential calculus", "A differentiable map with invertible derivative is locally invertible with differentiable inverse.", ["Derivatives", "Linear maps"]],
    ["Implicit function theorem", "Differential calculus", "Under a non-zero partial derivative condition, an equation F(x,y)=0 locally defines one variable as a differentiable function of the other.", ["Partial derivatives"]],
    ["Fubini theorem", "Multiple integration", "Under standard integrability conditions, an iterated integral can be evaluated by integrating in either order.", ["Double integrals"]],
    ["Dominated convergence theorem", "Measure and integration", "Pointwise limits can pass through integrals when dominated by an integrable bounding function.", ["Integration", "Limits"]],
  ]),
  category("number-theory", "Number Theory", "Divisibility, primes, modular arithmetic, congruences, and classical integer theorems.", "amber", [
    ["Euclid division lemma", "Divisibility", "Every integer division gives a unique quotient and remainder.", ["Integers"]],
    ["Euclidean algorithm theorem", "GCD", "Repeated remainders compute the greatest common divisor.", ["Division lemma"]],
    ["Bezout identity", "GCD", "The gcd of two integers is an integer linear combination of them.", ["Euclidean algorithm"]],
    ["Fundamental theorem of arithmetic", "Primes", "Every integer greater than one has a unique prime factorization.", ["Primes"]],
    ["Euclid infinitude of primes", "Primes", "There are infinitely many prime numbers.", ["Contradiction"]],
    ["Divisibility by 3 theorem", "Divisibility tests", "An integer is divisible by 3 exactly when its digit sum is divisible by 3.", ["Base ten"]],
    ["Divisibility by 9 theorem", "Divisibility tests", "An integer is divisible by 9 exactly when its digit sum is divisible by 9.", ["Base ten"]],
    ["Chinese remainder theorem", "Congruences", "Compatible coprime congruences have a unique solution modulo the product.", ["Modular arithmetic"]],
    ["Fermat little theorem", "Congruences", "If p is prime and p does not divide a, then a^(p-1)=1 mod p.", ["Prime modulus"]],
    ["Euler theorem", "Congruences", "For gcd(a,n)=1, a^phi(n)=1 mod n.", ["Euler phi"]],
    ["Wilson theorem", "Primes", "An integer p is prime exactly when (p-1)! is -1 modulo p.", ["Factorials"]],
    ["Euler phi product theorem", "Arithmetic functions", "The phi function is multiplicative on coprime inputs.", ["Coprime numbers"]],
    ["Quadratic residue theorem", "Residues", "Quadratic residues describe which congruences x^2=a mod p are solvable.", ["Modular squares"]],
    ["Pigeonhole divisibility theorem", "Divisibility", "Finite remainder classes force repeated remainders in long integer sequences.", ["Pigeonhole principle"]],
    ["LCM-GCD product theorem", "GCD and LCM", "For positive integers a and b, gcd(a,b) times lcm(a,b) equals ab.", ["Prime factors"]],
    ["Modular inverse theorem", "Congruences", "A modular inverse of a modulo n exists exactly when gcd(a,n)=1.", ["Bezout identity"]],
    ["Prime divisor theorem", "Primes", "Every composite integer has a prime divisor at most its square root.", ["Factors"]],
    ["Order theorem", "Modular arithmetic", "The order of an element modulo n divides phi(n) when gcd(a,n)=1.", ["Euler theorem"]],
    ["Euclid lemma", "Primes", "If a prime divides a product, then it divides at least one factor.", ["Prime numbers", "Divisibility"]],
    ["Euler criterion", "Quadratic residues", "For odd prime p, a^((p-1)/2) determines whether a is a quadratic residue modulo p.", ["Fermat little theorem"]],
    ["Quadratic reciprocity theorem", "Quadratic residues", "For distinct odd primes, solvability of x^2=p mod q and x^2=q mod p is linked by a precise sign rule.", ["Euler criterion"]],
    ["Mobius inversion theorem", "Arithmetic functions", "If one arithmetic function is a divisor-sum of another, Mobius inversion recovers the original function.", ["Divisor sums"]],
    ["Primitive root theorem", "Modular arithmetic", "For prime moduli, there exists an element whose powers generate every non-zero residue class.", ["Order theorem"]],
  ]),
  category("probability-statistics", "Probability & Statistics", "Counting probability, random variables, expectation, distributions, and inference.", "orange", [
    ["Addition rule theorem", "Probability rules", "P(A union B)=P(A)+P(B)-P(A intersection B).", ["Sets"]],
    ["Multiplication rule theorem", "Probability rules", "The probability that both A and B occur equals the probability of A times the probability of B after A is known.", ["Conditional probability"]],
    ["Bayes theorem", "Conditional probability", "Posterior probability is proportional to likelihood times prior.", ["Conditional probability"]],
    ["Law of total probability", "Conditional probability", "A probability can be split across a partition of cases.", ["Partitions"]],
    ["Independence theorem", "Events", "Independent events satisfy P(A and B)=P(A)P(B).", ["Multiplication rule"]],
    ["Expected value linearity theorem", "Expectation", "Expectation of a sum equals the sum of expectations.", ["Random variables"]],
    ["Variance shift theorem", "Variance", "Adding a constant changes the mean but not the variance.", ["Variance"]],
    ["Variance scale theorem", "Variance", "Multiplying by c multiplies variance by c squared.", ["Variance"]],
    ["Binomial theorem for probability", "Distributions", "Binomial probabilities count successes in independent Bernoulli trials.", ["Combinations"]],
    ["Poisson approximation theorem", "Distributions", "Rare binomial events with fixed np are approximated by a Poisson distribution.", ["Limits"]],
    ["Central limit theorem", "Sampling", "Standardized sums of many independent variables tend toward normal behavior.", ["Mean and variance"]],
    ["Law of large numbers", "Sampling", "Sample averages approach expected value as sample size grows.", ["Expectation"]],
    ["Chebyshev inequality", "Inequalities", "Most probability mass lies within a few standard deviations of the mean.", ["Variance"]],
    ["Markov inequality", "Inequalities", "A non-negative random variable rarely greatly exceeds its mean.", ["Expectation"]],
    ["Normal symmetry theorem", "Normal distribution", "A normal distribution is symmetric about its mean.", ["Density curves"]],
    ["Regression least squares theorem", "Regression", "The least-squares line minimizes the sum of squared residuals.", ["Algebra"]],
    ["Correlation bound theorem", "Correlation", "Correlation always lies between -1 and 1.", ["Cauchy-Schwarz"]],
    ["Sampling distribution theorem", "Inference", "Sample statistics have distributions that guide confidence intervals and tests.", ["Sampling"]],
    ["Law of the unconscious statistician", "Expectation", "The expected value of a function of a random variable can be computed by summing or integrating that function against the distribution of the variable.", ["Expected value"]],
    ["Conditional expectation tower theorem", "Conditional expectation", "Taking expectation after conditioning and then averaging returns the original expectation.", ["Conditional probability", "Expectation"]],
    ["Jensen inequality", "Expectation", "For a convex function, the function of an expectation is at most the expectation of the function.", ["Convexity", "Expected value"]],
    ["Slutsky theorem", "Asymptotic inference", "If one statistic converges in distribution and another converges in probability to a constant, their sums and products have predictable limiting distributions.", ["Convergence in distribution"]],
    ["Continuous mapping theorem", "Asymptotic inference", "Continuous transformations preserve convergence in distribution or probability.", ["Limits", "Random variables"]],
    ["Neyman-Pearson lemma", "Hypothesis testing", "For simple hypotheses, the likelihood-ratio test is the most powerful test at a fixed significance level.", ["Likelihood", "Hypothesis tests"]],
    ["Cramer-Rao lower bound", "Estimation", "The variance of an unbiased estimator is bounded below by the reciprocal of Fisher information under regularity conditions.", ["Estimators", "Fisher information"]],
  ]),
  category("linear-algebra-vectors", "Linear Algebra & Vectors", "Matrices, vector spaces, determinants, transformations, eigenvalues, and projections.", "indigo", [
    ["Matrix associativity theorem", "Matrices", "Matrix multiplication is associative wherever products are defined.", ["Matrix product"]],
    ["Matrix distributive theorem", "Matrices", "Matrix multiplication distributes over matrix addition.", ["Matrix addition"]],
    ["Invertible matrix theorem", "Matrices", "A square matrix is invertible exactly when its determinant is non-zero.", ["Determinants"]],
    ["Rank-nullity theorem", "Vector spaces", "The dimension of the domain equals rank plus nullity.", ["Linear maps"]],
    ["Basis uniqueness theorem", "Vector spaces", "Every basis of a finite-dimensional vector space has the same number of vectors.", ["Span and independence"]],
    ["Dimension theorem", "Vector spaces", "A linearly independent spanning set is a basis.", ["Linear independence"]],
    ["Determinant area theorem", "Determinants", "The absolute determinant gives area or volume scaling.", ["Transformations"]],
    ["Cramer theorem", "Linear systems", "Certain square linear systems can be solved using determinant ratios.", ["Determinants"]],
    ["Eigenvalue equation theorem", "Eigenvectors", "Eigenvectors keep their direction under a linear transformation.", ["Linear maps"]],
    ["Diagonalization theorem", "Eigenvectors", "A matrix with enough independent eigenvectors can be diagonalized.", ["Eigenvalues"]],
    ["Cayley-Hamilton theorem", "Matrices", "Every square matrix satisfies its own characteristic polynomial.", ["Characteristic polynomial"]],
    ["Orthogonal projection theorem", "Projections", "The closest point in a subspace is obtained by perpendicular projection.", ["Dot product"]],
    ["Gram-Schmidt theorem", "Orthogonality", "Independent vectors can be converted into an orthogonal basis.", ["Inner products"]],
    ["Dot product angle theorem", "Vectors", "The dot product determines the angle between non-zero vectors.", ["Cosine"]],
    ["Cross product area theorem", "Vectors", "The cross product magnitude equals parallelogram area.", ["Sine area"]],
    ["Scalar triple product theorem", "Vectors", "The scalar triple product gives signed parallelepiped volume.", ["Cross product"]],
    ["Linear transformation theorem", "Transformations", "A matrix represents a linear transformation after choosing bases.", ["Matrices"]],
    ["Spectral theorem", "Matrices", "Real symmetric matrices have orthogonal eigenvectors and real eigenvalues.", ["Symmetric matrices"]],
    ["Fundamental theorem of linear algebra", "Vector spaces", "The four fundamental subspaces of a matrix organize its column space, row space, null space, and left null space by orthogonality and dimension.", ["Rank-nullity theorem"]],
    ["LU decomposition theorem", "Matrix factorization", "Under suitable pivot conditions, a square matrix can be factored into lower and upper triangular matrices.", ["Gaussian elimination"]],
    ["Singular value decomposition theorem", "Matrix factorization", "Every real matrix can be decomposed into orthogonal factors and a diagonal matrix of singular values.", ["Orthogonal matrices", "Eigenvalues"]],
    ["Jordan canonical form theorem", "Linear maps", "Every complex square matrix is similar to a block diagonal Jordan matrix.", ["Eigenvalues", "Generalized eigenvectors"]],
    ["Schur decomposition theorem", "Matrix factorization", "Every complex square matrix is unitarily similar to an upper triangular matrix.", ["Unitary matrices", "Eigenvalues"]],
    ["Perron-Frobenius theorem", "Non-negative matrices", "A positive square matrix has a dominant positive eigenvalue with a positive eigenvector.", ["Eigenvalues", "Matrices"]],
  ]),
  category("complex-numbers", "Complex Numbers", "Complex plane, polar form, roots, analytic functions, residues, and contour results.", "fuchsia", [
    ["Complex conjugate theorem", "Algebra", "Multiplying a complex number by its conjugate gives the squared modulus.", ["Complex arithmetic"]],
    ["Modulus product theorem", "Modulus", "The modulus of a product equals the product of moduli.", ["Complex multiplication"]],
    ["Argument addition theorem", "Polar form", "Arguments add when complex numbers multiply.", ["Polar coordinates"]],
    ["De Moivre theorem", "Powers", "Powers of complex numbers in polar form multiply the argument.", ["Trigonometry"]],
    ["nth roots theorem", "Roots", "A non-zero complex number has n equally spaced nth roots.", ["Polar form"]],
    ["Euler formula theorem", "Exponential form", "e^(i theta)=cos theta+i sin theta.", ["Power series"]],
    ["Triangle inequality complex theorem", "Modulus", "For complex numbers z and w, the distance from 0 to z+w is at most the distance to z plus the distance to w.", ["Distance"]],
    ["Cauchy-Riemann theorem", "Analytic functions", "Differentiability of complex functions is linked to Cauchy-Riemann equations.", ["Partial derivatives"]],
    ["Cauchy integral theorem", "Contour integration", "The contour integral of an analytic function over a closed curve is zero.", ["Analyticity"]],
    ["Cauchy integral formula", "Contour integration", "Values of analytic functions are determined by boundary integrals.", ["Cauchy theorem"]],
    ["Liouville theorem", "Entire functions", "A bounded entire function must be constant.", ["Cauchy estimates"]],
    ["Maximum modulus theorem", "Analytic functions", "A non-constant analytic function cannot attain an interior maximum modulus.", ["Analyticity"]],
    ["Residue theorem", "Contour integration", "A contour integral equals 2 pi i times the sum of enclosed residues.", ["Laurent series"]],
    ["Argument principle", "Zeros and poles", "Change in argument counts zeros minus poles inside a contour.", ["Residues"]],
    ["Open mapping theorem", "Analytic functions", "A non-constant analytic function maps open sets to open sets.", ["Complex differentiability"]],
    ["Morera theorem", "Analytic functions", "Zero contour integrals imply analyticity under continuity assumptions.", ["Contour integrals"]],
    ["Laurent theorem", "Series", "Functions analytic on annuli have Laurent series expansions.", ["Power series"]],
    ["Rouche theorem", "Zeros", "A dominant perturbation preserves the number of zeros inside a contour.", ["Complex analysis"]],
    ["Identity theorem", "Analytic functions", "If two analytic functions agree on a set with a limit point inside a domain, they agree everywhere on the connected domain.", ["Analytic functions"]],
    ["Cauchy estimates theorem", "Analytic functions", "Bounds on an analytic function over a circle give bounds on all derivatives at the center.", ["Cauchy integral formula"]],
    ["Schwarz lemma", "Analytic functions", "A holomorphic self-map of the unit disk fixing zero has modulus and derivative bounded by one.", ["Holomorphic functions"]],
    ["Analytic continuation theorem", "Analytic functions", "An analytic function extended along overlapping domains is uniquely determined when extensions agree on overlaps.", ["Identity theorem"]],
    ["Casorati-Weierstrass theorem", "Singularities", "Near an essential singularity, an analytic function comes arbitrarily close to every complex value.", ["Essential singularities"]],
    ["Riemann mapping theorem", "Conformal maps", "Every simply connected proper plane domain is conformally equivalent to the unit disk.", ["Holomorphic functions"]],
  ]),
  category("discrete-logic", "Discrete Math & Logic", "Sets, relations, induction, counting, recurrence, Boolean algebra, and proof methods.", "lime", [
    ["Principle of mathematical induction", "Proof methods", "A base case plus a valid successor step proves all natural-number cases.", ["Natural numbers"]],
    ["Strong induction theorem", "Proof methods", "Assuming all earlier cases can prove the next case.", ["Induction"]],
    ["Pigeonhole principle", "Counting", "More objects than boxes forces at least one box to contain multiple objects.", ["Counting"]],
    ["Inclusion-exclusion theorem", "Counting", "Union size is found by adding singles and correcting overlaps.", ["Sets"]],
    ["Multiplication principle", "Counting", "Sequential independent choices multiply their counts.", ["Counting"]],
    ["Addition principle", "Counting", "Disjoint alternatives add their counts.", ["Counting"]],
    ["Recurrence solution theorem", "Sequences", "Linear recurrences can be solved through characteristic equations.", ["Sequences"]],
    ["Boolean De Morgan theorem", "Logic", "Negation swaps AND with OR and complements each statement.", ["Boolean algebra"]],
    ["Contrapositive theorem", "Logic", "An implication is logically equivalent to its contrapositive.", ["Implication"]],
    ["Equivalence relation theorem", "Relations", "Reflexive, symmetric, and transitive relations partition a set.", ["Relations"]],
    ["Partial order theorem", "Relations", "Reflexive, antisymmetric, and transitive relations define ordered structure.", ["Relations"]],
    ["Cantor theorem", "Sets", "The power set of a set is strictly larger than the set.", ["Functions"]],
    ["Cartesian product count theorem", "Sets", "The size of A cross B equals size(A) times size(B).", ["Ordered pairs"]],
    ["Binomial counting theorem", "Counting", "n choose r counts r-element subsets of an n-element set.", ["Combinations"]],
    ["Handshake lemma", "Counting", "The sum of graph degrees equals twice the number of edges.", ["Graphs"]],
    ["Recursive definition theorem", "Sequences", "A valid initial condition and recurrence determine a sequence uniquely.", ["Functions"]],
    ["Truth table completeness theorem", "Logic", "A finite propositional formula is determined by its truth table.", ["Propositions"]],
    ["CNF-DNF theorem", "Logic", "Every finite truth table can be represented in normal form.", ["Boolean algebra"]],
    ["Well-ordering principle", "Proof methods", "Every non-empty set of positive integers has a least element.", ["Natural numbers"]],
    ["Master theorem", "Recurrences", "Many divide-and-conquer recurrences have asymptotic solutions determined by comparing work at the root with work across recursive levels.", ["Recurrences", "Asymptotic notation"]],
    ["Burnside lemma", "Counting symmetry", "The number of orbits of a finite group action equals the average number of fixed points.", ["Group actions", "Counting"]],
    ["Ramsey theorem", "Combinatorics", "Large enough structures force an ordered monochromatic substructure no matter how they are colored.", ["Pigeonhole principle"]],
    ["Dilworth theorem", "Partially ordered sets", "In a finite poset, the maximum antichain size equals the minimum number of chains needed to cover the set.", ["Partial orders"]],
    ["Sperner theorem", "Set systems", "The largest family of subsets with no set containing another has size equal to the largest binomial coefficient.", ["Subsets", "Antichains"]],
  ]),
  category("graph-theory", "Graph Theory", "Paths, trees, planarity, coloring, connectivity, matching, and network theorems.", "teal", [
    ["Euler trail theorem", "Paths", "A connected graph has an Euler trail exactly when zero or two vertices have odd degree.", ["Degree"]],
    ["Euler circuit theorem", "Paths", "A connected graph has an Euler circuit exactly when every vertex has even degree.", ["Euler trails"]],
    ["Tree edge theorem", "Trees", "A tree with n vertices has n-1 edges.", ["Connected graphs"]],
    ["Tree path uniqueness theorem", "Trees", "Exactly one simple path connects any two vertices of a tree.", ["Trees"]],
    ["Cycle-edge theorem", "Trees", "Adding one edge to a tree creates exactly one cycle.", ["Trees"]],
    ["Bipartite cycle theorem", "Bipartite graphs", "A graph is bipartite exactly when it has no odd cycle.", ["Cycles"]],
    ["Planar Euler formula", "Planarity", "For connected planar graphs, V-E+F=2.", ["Plane graphs"]],
    ["Kuratowski theorem", "Planarity", "A graph is non-planar exactly when it contains a subdivision of K5 or K3,3.", ["Planarity"]],
    ["Four color theorem", "Coloring", "Every planar map can be colored with at most four colors.", ["Planarity"]],
    ["Brooks theorem", "Coloring", "Most connected graphs need at most maximum degree colors.", ["Graph coloring"]],
    ["Hall marriage theorem", "Matching", "A bipartite matching covering one side exists exactly under Hall's condition.", ["Bipartite graphs"]],
    ["Konig theorem", "Matching", "In bipartite graphs, maximum matching size equals minimum vertex cover size.", ["Matching"]],
    ["Menger theorem", "Connectivity", "Connectivity can be measured by disjoint paths and separating sets.", ["Paths"]],
    ["Max-flow min-cut theorem", "Networks", "Maximum flow equals minimum cut capacity.", ["Network flow"]],
    ["Dijkstra correctness theorem", "Shortest paths", "Dijkstra's algorithm returns shortest paths for non-negative edge weights.", ["Weighted graphs"]],
    ["Bellman-Ford theorem", "Shortest paths", "Relaxing edges detects shortest paths and negative cycles.", ["Weighted graphs"]],
    ["Minimum spanning tree cut theorem", "Spanning trees", "The lightest edge crossing any cut is safe for some MST.", ["Weighted graphs"]],
    ["Cayley theorem for trees", "Counting trees", "There are n^(n-2) labeled trees on n vertices.", ["Combinatorics"]],
    ["Turan theorem", "Extremal graphs", "The maximum number of edges in a graph with no complete subgraph K_(r+1) is achieved by the balanced complete r-partite graph.", ["Complete graphs"]],
    ["Dirac theorem", "Hamiltonian graphs", "A simple graph with n at least 3 and minimum degree at least n/2 has a Hamiltonian cycle.", ["Graph degree"]],
    ["Ore theorem", "Hamiltonian graphs", "If every non-adjacent pair of vertices has degree sum at least n, then the graph has a Hamiltonian cycle.", ["Hamiltonian cycles"]],
    ["Matrix tree theorem", "Counting trees", "The number of spanning trees of a graph equals any cofactor of its Laplacian matrix.", ["Laplacian matrix", "Spanning trees"]],
    ["Euler planar inequality", "Planar graphs", "A simple connected planar graph with at least three vertices satisfies E <= 3V-6.", ["Planar Euler formula"]],
    ["Whitney theorem", "Connectivity", "For a graph, vertex connectivity is at most edge connectivity, which is at most minimum degree.", ["Connectivity"]],
  ]),
  category("optimization-engineering", "Optimization & Engineering Math", "Optimization, numerical methods, transforms, PDEs, mechanics, and engineering analysis.", "slate", [
    ["First derivative test theorem", "Optimization", "Critical points are classified by derivative sign changes.", ["Derivatives"]],
    ["Second derivative test theorem", "Optimization", "A positive or negative second derivative identifies local minima or maxima.", ["Second derivatives"]],
    ["Lagrange multiplier theorem", "Constrained optimization", "At constrained extrema, gradients are parallel under regularity conditions.", ["Gradients"]],
    ["KKT theorem", "Optimization", "Karush-Kuhn-Tucker conditions characterize many constrained optima.", ["Inequalities"]],
    ["Convex minimum theorem", "Convexity", "Any local minimum of a convex function is global.", ["Convex functions"]],
    ["Newton convergence theorem", "Numerical methods", "Newton iteration converges rapidly near simple roots under smoothness assumptions.", ["Derivatives"]],
    ["Bisection convergence theorem", "Numerical methods", "Bisection converges to a root inside a sign-changing interval.", ["Intermediate value theorem"]],
    ["Fixed point theorem", "Numerical methods", "A contraction mapping has a unique fixed point reached by iteration.", ["Metric distance"]],
    ["Simpson rule accuracy theorem", "Numerical integration", "Simpson's rule is exact for polynomials up to degree three.", ["Interpolation"]],
    ["Runge-Kutta consistency theorem", "Numerical ODEs", "RK methods approximate differential equations through weighted slope samples.", ["Differential equations"]],
    ["Laplace derivative theorem", "Transforms", "The Laplace transform turns derivatives into algebraic expressions with initial values.", ["Integration"]],
    ["Convolution theorem", "Transforms", "Transforming a convolution gives a product of transforms.", ["Integrals"]],
    ["Fourier transform shift theorem", "Transforms", "Shifting a function changes the phase of its Fourier transform.", ["Complex exponentials"]],
    ["Parseval theorem", "Transforms", "Signal energy can be measured equivalently in time or frequency domain.", ["Fourier series"]],
    ["Heat equation maximum principle", "PDE", "Heat solutions cannot create new interior maxima under standard conditions.", ["PDEs"]],
    ["Wave equation energy theorem", "PDE", "Wave motion preserves energy in ideal closed systems.", ["Differential equations"]],
    ["Gauss law theorem", "Vector fields", "Total flux through a closed surface equals enclosed source strength.", ["Divergence theorem"]],
    ["Virtual work theorem", "Mechanics", "Equilibrium occurs when total virtual work is zero for allowed displacements.", ["Forces"]],
    ["Weierstrass extreme value theorem", "Optimization", "A continuous function on a compact feasible set attains a global minimum and maximum.", ["Continuity", "Compactness"]],
    ["Weak duality theorem", "Optimization duality", "Every feasible dual solution bounds the value of every feasible primal solution in the correct direction.", ["Linear programming"]],
    ["Strong duality theorem", "Optimization duality", "Under standard convex or linear programming conditions, the optimal primal and dual values are equal.", ["Convexity", "Duality"]],
    ["Complementary slackness theorem", "Linear programming", "At optimal primal-dual solutions, each inequality slack pairs with a zero dual multiplier.", ["Linear programming", "KKT theorem"]],
    ["Envelope theorem", "Parametric optimization", "The derivative of an optimized value with respect to a parameter can be found from the partial derivative of the objective at the optimizer.", ["Derivatives", "Optimization"]],
    ["Pontryagin maximum principle", "Optimal control", "Optimal controls satisfy a Hamiltonian maximization condition together with state and costate equations.", ["Differential equations", "Optimization"]],
  ]),
];

export const theoremCategoryCount = theoremCategories.length;
export const theoremCount = theoremCategories.reduce((sum, categoryItem) => sum + categoryItem.theorems.length, 0);
