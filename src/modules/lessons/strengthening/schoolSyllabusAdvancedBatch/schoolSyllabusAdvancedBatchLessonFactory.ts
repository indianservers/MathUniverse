import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SchoolSyllabusAdvancedChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type SchoolSyllabusAdvancedSeed = {
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
  misconception: [string, string, string];
  prompt: string;
  expected: string;
  formula: { label: string; expression: string; exactness: StrengthenedLesson["formulas"][number]["exactness"] };
  expertReviewRequired: boolean;
};

type Source = Pick<SchoolSyllabusAdvancedSeed, "title" | "route" | "topic" | "academicLevel">;
type Specifics = Omit<SchoolSyllabusAdvancedSeed, keyof Source | "id" | "expertReviewRequired">;

const sources: Record<number, Source> = {
  10104: source("Grouped Mean by Step Deviation", "/lessons/school/class-10/class-10-statistics-grouped-mean-by-step-deviation", "Statistics", "CLASS_10"),
  10105: source("Less-Than Cumulative Frequency", "/lessons/school/class-10/class-10-statistics-less-than-cumulative-frequency", "Statistics", "CLASS_10"),
  10106: source("More-Than Cumulative Frequency", "/lessons/school/class-10/class-10-statistics-more-than-cumulative-frequency", "Statistics", "CLASS_10"),
  10107: source("Less-Than Ogive", "/lessons/school/class-10/class-10-statistics-less-than-ogive", "Statistics", "CLASS_10"),
  10108: source("More-Than Ogive", "/lessons/school/class-10/class-10-statistics-more-than-ogive", "Statistics", "CLASS_10"),
  10109: source("Median from an Ogive", "/lessons/school/class-10/class-10-statistics-median-from-an-ogive", "Statistics", "CLASS_10"),
  10110: source("Frustum of a Cone", "/lessons/school/class-10/class-10-mensuration-frustum-of-a-cone", "Mensuration", "CLASS_10"),
  10111: source("Combined Solids", "/lessons/school/class-10/class-10-mensuration-combined-solids", "Mensuration", "CLASS_10"),
  10112: source("Types of Relations", "/lessons/school/class-11/class-11-relations-and-functions-types-of-relations", "Relations and Functions", "CLASS_11"),
  10113: source("Reflexive Relations", "/lessons/school/class-11/class-11-relations-and-functions-reflexive-relations", "Relations and Functions", "CLASS_11"),
  10114: source("Symmetric Relations", "/lessons/school/class-11/class-11-relations-and-functions-symmetric-relations", "Relations and Functions", "CLASS_11"),
  10115: source("Transitive Relations", "/lessons/school/class-11/class-11-relations-and-functions-transitive-relations", "Relations and Functions", "CLASS_11"),
  10116: source("Equivalence Relations", "/lessons/school/class-11/class-11-relations-and-functions-equivalence-relations", "Relations and Functions", "CLASS_11"),
  10117: source("One-One Functions", "/lessons/school/class-11/class-11-relations-and-functions-one-one-functions", "Relations and Functions", "CLASS_11"),
  10118: source("Many-One Functions", "/lessons/school/class-11/class-11-relations-and-functions-many-one-functions", "Relations and Functions", "CLASS_11"),
  10119: source("Into Functions", "/lessons/school/class-11/class-11-relations-and-functions-into-functions", "Relations and Functions", "CLASS_11"),
  10120: source("Onto Functions", "/lessons/school/class-11/class-11-relations-and-functions-onto-functions", "Relations and Functions", "CLASS_11"),
  10121: source("Composition of Functions", "/lessons/school/class-11/class-11-relations-and-functions-composition-of-functions", "Relations and Functions", "CLASS_11"),
  10122: source("Invertible Functions", "/lessons/school/class-11/class-11-relations-and-functions-invertible-functions", "Relations and Functions", "CLASS_11"),
  10123: source("Binary Operations", "/lessons/school/class-11/class-11-relations-and-functions-binary-operations", "Relations and Functions", "CLASS_11"),
  10124: source("Domain and Range of Trigonometric Functions", "/lessons/school/class-11/class-11-trigonometry-domain-and-range-of-trigonometric-functions", "Trigonometry", "CLASS_11"),
  10125: source("Transformation of Trigonometric Graphs", "/lessons/school/class-11/class-11-trigonometry-transformation-of-trigonometric-graphs", "Trigonometry", "CLASS_11"),
  10126: source("General Solutions of Trigonometric Equations", "/lessons/school/class-11/class-11-trigonometry-general-solutions-of-trigonometric-equations", "Trigonometry", "CLASS_11"),
  10127: source("Principal Solutions", "/lessons/school/class-11/class-11-trigonometry-principal-solutions", "Trigonometry", "CLASS_11"),
  10128: source("Logic of Mathematical Induction", "/lessons/school/class-11/class-11-mathematical-induction-logic-of-mathematical-induction", "Mathematical Induction", "CLASS_11"),
  10129: source("Base Case and Inductive Step", "/lessons/school/class-11/class-11-mathematical-induction-base-case-and-inductive-step", "Mathematical Induction", "CLASS_11"),
  10130: source("Sum Formula by Induction", "/lessons/school/class-11/class-11-mathematical-induction-sum-formula-by-induction", "Mathematical Induction", "CLASS_11"),
  10131: source("Divisibility by Induction", "/lessons/school/class-11/class-11-mathematical-induction-divisibility-by-induction", "Mathematical Induction", "CLASS_11"),
  10132: source("Inequality by Induction", "/lessons/school/class-11/class-11-mathematical-induction-inequality-by-induction", "Mathematical Induction", "CLASS_11"),
  10133: source("Strong Induction Introduction", "/lessons/school/class-11/class-11-mathematical-induction-strong-induction-introduction", "Mathematical Induction", "CLASS_11"),
  10134: source("Binomial Expansion", "/lessons/school/class-11/class-11-binomial-theorem-binomial-expansion", "Binomial Theorem", "CLASS_11"),
  10135: source("General Term", "/lessons/school/class-11/class-11-binomial-theorem-general-term", "Binomial Theorem", "CLASS_11"),
  10136: source("Middle Term", "/lessons/school/class-11/class-11-binomial-theorem-middle-term", "Binomial Theorem", "CLASS_11"),
  10137: source("Independent Term", "/lessons/school/class-11/class-11-binomial-theorem-independent-term", "Binomial Theorem", "CLASS_11"),
  10138: source("Binomial Approximation", "/lessons/school/class-11/class-11-binomial-theorem-binomial-approximation", "Binomial Theorem", "CLASS_11"),
  10139: source("Pascal Identity", "/lessons/school/class-11/class-11-binomial-theorem-pascal-identity", "Binomial Theorem", "CLASS_11"),
  10140: source("Combinatorial Interpretation", "/lessons/school/class-11/class-11-binomial-theorem-combinatorial-interpretation", "Binomial Theorem", "CLASS_11"),
  10141: source("Parabola Standard Forms", "/lessons/school/class-11/class-11-conic-sections-parabola-standard-forms", "Conic Sections", "CLASS_11"),
  10142: source("Focus-Directrix Definition", "/lessons/school/class-11/class-11-conic-sections-focus-directrix-definition", "Conic Sections", "CLASS_11"),
  10143: source("Ellipse Standard Forms", "/lessons/school/class-11/class-11-conic-sections-ellipse-standard-forms", "Conic Sections", "CLASS_11"),
  10144: source("Hyperbola Standard Forms", "/lessons/school/class-11/class-11-conic-sections-hyperbola-standard-forms", "Conic Sections", "CLASS_11"),
  10145: source("Eccentricity", "/lessons/school/class-11/class-11-conic-sections-eccentricity", "Conic Sections", "CLASS_11"),
  10146: source("Parametric Coordinates", "/lessons/school/class-11/class-11-conic-sections-parametric-coordinates", "Conic Sections", "CLASS_11"),
  10147: source("Tangent to a Parabola", "/lessons/school/class-11/class-11-conic-sections-tangent-to-a-parabola", "Conic Sections", "CLASS_11"),
  10148: source("Normal to a Parabola", "/lessons/school/class-11/class-11-conic-sections-normal-to-a-parabola", "Conic Sections", "CLASS_11"),
  10149: source("Tangent to an Ellipse", "/lessons/school/class-11/class-11-conic-sections-tangent-to-an-ellipse", "Conic Sections", "CLASS_11"),
  10150: source("Tangent to a Hyperbola", "/lessons/school/class-11/class-11-conic-sections-tangent-to-a-hyperbola", "Conic Sections", "CLASS_11"),
  10151: source("Conic Identification from General Equation", "/lessons/school/class-11/class-11-conic-sections-conic-identification-from-general-equation", "Conic Sections", "CLASS_11"),
  10152: source("Direction Ratios", "/lessons/school/class-12/class-12-three-dimensional-geometry-direction-ratios", "Three-Dimensional Geometry", "CLASS_12"),
  10153: source("Direction Cosines", "/lessons/school/class-12/class-12-three-dimensional-geometry-direction-cosines", "Three-Dimensional Geometry", "CLASS_12"),
};

const specifics: Record<number, Specifics> = {
  10104: procedure("The step deviation method finds grouped mean using u = (x-A)/h for equal class width h.", "Choose A and h, find u, compute fu, add fu, then use A + h sum(fu)/sum(f).", "Scaling deviations by h makes arithmetic smaller while preserving the weighted average.", "Forgetting to multiply the final correction by h.", "Use A + h sum(fu)/sum(f), not just A + sum(fu)/sum(f).", "What is the final multiplier in step deviation?", "h", "Step deviation mean", "mean = A + h sum(fu)/sum(f)", "table"),
  10105: procedure("Less-than cumulative frequency counts observations below each upper class boundary.", "Start from the lowest class and keep adding frequencies as the upper boundary increases.", "Each new total includes all previous classes plus the current class.", "Resetting the count at each class.", "Cumulative frequency must keep a running total.", "Frequencies are 3, 5, 2. What is the last less-than cumulative frequency?", "10", "Less-than CF", "running total from lowest class", "table"),
  10106: procedure("More-than cumulative frequency counts observations at or above each lower class boundary.", "Start with the total frequency, then subtract classes as the lower boundary rises.", "Higher lower boundaries remove observations from earlier classes.", "Adding upward as in a less-than table.", "More-than cumulative frequency usually starts with the total and decreases.", "If total frequency is 40, what is the first more-than cumulative frequency?", "40", "More-than CF", "running total from total downward", "table"),
  10107: tool("A less-than ogive is a graph of upper class boundaries against less-than cumulative frequencies.", "Make a less-than cumulative frequency table, plot upper boundaries, then join the points smoothly.", "The graph rises because more observations are included as the boundary increases.", "Plotting class marks instead of upper boundaries.", "Use upper class boundaries for a less-than ogive.", "Which boundary is plotted on a less-than ogive?", "upper boundary", "Less-than ogive", "upper boundary vs less-than CF", "coordinate_graph"),
  10108: tool("A more-than ogive is a graph of lower class boundaries against more-than cumulative frequencies.", "Make a more-than cumulative frequency table, plot lower boundaries, then join the points smoothly.", "The graph falls because fewer observations remain as the boundary increases.", "Plotting upper boundaries for a more-than ogive.", "Use lower class boundaries for a more-than ogive.", "Which boundary is plotted on a more-than ogive?", "lower boundary", "More-than ogive", "lower boundary vs more-than CF", "coordinate_graph"),
  10109: procedure("The median from an ogive is read by locating N/2 on the cumulative frequency axis.", "Find N/2, draw across to the ogive, then drop to the value axis.", "The median is the middle value, and N/2 marks the middle position in ordered data.", "Using N instead of N/2.", "Use half the total frequency to locate the median.", "If N = 60, what cumulative frequency locates the median?", "30", "Ogive median", "median position = N/2", "coordinate_graph"),
  10110: procedure("A frustum of a cone is the part left when a smaller cone is cut off parallel to the base.", "Identify both radii and slant height, then use the frustum surface area or volume formula.", "Parallel cutting leaves two similar circular faces connected by a slant surface.", "Using the cone formula without the two radii.", "A frustum needs both circular radii.", "How many circular radii does a frustum formula use?", "2", "Frustum volume", "V = (1/3) pi h (R^2 + r^2 + Rr)", "geometric_construction"),
  10111: modelling("A combined solid joins or removes simple solids such as cones, cylinders, spheres, and frustums.", "Split the shape into simple parts, calculate each needed measure, then add or subtract correctly.", "Volume and exposed surface area can be built from non-overlapping pieces.", "Counting hidden joined faces as exposed area.", "Exclude faces that are inside the joined solid.", "Are hidden joined faces counted in exposed surface area?", "no", "Combined solids", "total measure = add or subtract simple parts", "geometric_construction"),
  10112: concept("A relation from A to B is any set of ordered pairs with first element in A and second element in B.", "List the ordered pairs, then check which property or type each pair set has.", "Relations work by connecting elements of sets in allowed ordered pairs.", "Calling every relation a function.", "A function is a special relation with exactly one output for each input.", "Is every relation a function?", "no", "Relation", "R is a subset of A x B", "text_table"),
  10113: concept("A relation on a set is reflexive when every element is related to itself.", "Check each element a and confirm that (a,a) is in the relation.", "Reflexivity means every point has its own self-loop.", "Checking only one self-pair.", "Every element in the set must have its self-pair.", "On {1,2}, which self-pairs are needed?", "(1,1) and (2,2)", "Reflexive relation", "for every a in A, (a,a) in R", "text_table"),
  10114: concept("A relation is symmetric when aRb always implies bRa.", "For each ordered pair, reverse it and check that the reversed pair is also present.", "Symmetry means every arrow has a matching arrow back.", "Thinking one pair alone proves symmetry.", "Every pair must have its reverse pair.", "If (2,3) is present, what pair is also needed?", "(3,2)", "Symmetric relation", "aRb implies bRa", "text_table"),
  10115: concept("A relation is transitive when aRb and bRc together imply aRc.", "Find two linked pairs, then check whether the shortcut pair is also present.", "Transitivity means a chain of two related steps forces the direct relation.", "Checking reversed pairs instead of chained pairs.", "Transitivity checks chains, not symmetry.", "If aRb and bRc, what must follow?", "aRc", "Transitive relation", "aRb and bRc imply aRc", "text_table"),
  10116: concept("An equivalence relation is reflexive, symmetric, and transitive.", "Check all three properties separately, then conclude equivalence only if all pass.", "These three properties group elements into non-overlapping equivalence classes.", "Checking only symmetry and transitivity.", "Equivalence also needs reflexivity.", "Name the three properties of an equivalence relation.", "reflexive symmetric transitive", "Equivalence relation", "reflexive + symmetric + transitive", "text_table"),
  10117: concept("A one-one function gives different outputs for different inputs.", "Compare outputs of distinct inputs and check that no two inputs share one output.", "No output is reused, so each output points back to at most one input.", "Thinking increasing graphs are the only one-one functions.", "Use the definition: distinct inputs have distinct outputs.", "Is f(x)=2x one-one on real numbers?", "yes", "One-one function", "x1 != x2 implies f(x1) != f(x2)", "text_table"),
  10118: concept("A many-one function sends at least two different inputs to the same output.", "Look for two distinct inputs with equal function values.", "The output is reused, so the mapping is still a function but not one-one.", "Calling it not a function because outputs repeat.", "Repeated outputs are allowed in a function.", "Can two inputs share one output in a many-one function?", "yes", "Many-one function", "x1 != x2 and f(x1)=f(x2)", "text_table"),
  10119: concept("An into function has at least one element of the codomain that is not used as an output.", "Find the range, compare it with the codomain, then look for unused codomain elements.", "The function maps into only part of the codomain.", "Confusing codomain with range.", "Range is used outputs; codomain is the target set.", "If one codomain element is unused, is the function into?", "yes", "Into function", "range is a proper subset of codomain", "text_table"),
  10120: concept("An onto function uses every element of the codomain as an output.", "Find the range and check whether it equals the codomain.", "Onto means no target element is missed.", "Checking only that every input has an output.", "A function already has outputs; onto checks every codomain element is hit.", "For onto, range must equal what?", "codomain", "Onto function", "range = codomain", "text_table"),
  10121: procedure("Composition of functions means applying one function after another, such as (f o g)(x)=f(g(x)).", "Apply the inside function first, then put that result into the outside function.", "The output of the first function becomes the input of the next function.", "Applying f before g in f(g(x)).", "In f(g(x)), g acts first.", "If f(x)=x+1 and g(x)=2x, what is f(g(3))?", "7", "Composition", "(f o g)(x)=f(g(x))", "symbolic_steps"),
  10122: concept("An invertible function has an inverse function that reverses its input-output pairs.", "Check that the function is one-one and onto, then swap x and y to find the inverse when possible.", "A function can be reversed only when each output comes from exactly one input and all targets are used.", "Trying to invert a many-one function.", "A many-one function cannot have a function inverse.", "What two properties make a function invertible?", "one-one and onto", "Invertible function", "f inverse undoes f", "text_table"),
  10123: concept("A binary operation on a set combines two elements of the set to give one element of the same set.", "Take any ordered pair from the set, apply the rule, and check closure.", "Closure keeps the operation inside the set.", "Ignoring closure.", "A binary operation on a set must always give an element of that set.", "Is addition a binary operation on whole numbers?", "yes", "Binary operation", "*: A x A -> A", "text_table"),
  10124: concept("Domain is the allowed input set and range is the possible output set for a trigonometric function.", "Use the unit circle or graph to read allowed x-values and possible y-values.", "Trigonometric ratios repeat and have fixed output limits or exclusions.", "Giving the same range for all trig functions.", "Each trigonometric function has its own range.", "What is the range of sin x?", "[-1,1]", "Sine range", "-1 <= sin x <= 1", "coordinate_graph"),
  10125: tool("Transforming trigonometric graphs changes amplitude, period, phase shift, or vertical shift.", "Identify the coefficient changes, then move or stretch the parent graph in order.", "Graph transformations change coordinates while preserving the basic periodic wave shape.", "Changing period when only vertical shift is present.", "Match each parameter to its specific graph effect.", "In y=2 sin x, what is the amplitude?", "2", "Amplitude", "amplitude = |a| for y=a sin x", "coordinate_graph"),
  10126: procedure("A general solution lists all angles that satisfy a trigonometric equation.", "Find principal solutions, then add the correct period pattern.", "Trig functions repeat, so one solution creates infinitely many by periodicity.", "Listing only one angle.", "A general solution must include all periodic solutions.", "For sin x = 0, name a general solution.", "x = n pi", "General solution", "sin x=0 gives x=n pi", "unit_circle"),
  10127: procedure("A principal solution is a selected solution in the principal interval for a trigonometric equation.", "Solve the equation, then keep only values in the stated principal interval.", "Principal intervals give one standard set of answers before adding periods.", "Giving all periodic solutions.", "Principal solutions are not the full general solution.", "For sin x = 0 in [0,2pi), what are principal solutions?", "0 and pi", "Principal solution", "solutions inside the principal interval", "unit_circle"),
  10128: proof("Mathematical induction proves statements for all natural numbers from a starting case and a repeating step.", "Prove the base case, assume the statement for k, then prove it for k+1.", "The proof works like a chain where each true case forces the next case.", "Skipping the base case.", "Without a true starting case, the chain never begins.", "What are the two main parts of induction?", "base case and inductive step", "Induction", "P(1) and P(k)=>P(k+1)", "proof_diagram"),
  10129: proof("The base case starts an induction proof, and the inductive step moves truth from k to k+1.", "Verify the first case, assume P(k), then use that assumption to prove P(k+1).", "Together they create an unbroken chain of true statements.", "Proving only P(k+1).", "You must connect P(k) to P(k+1).", "Which part proves the first case?", "base case", "Induction structure", "base case + inductive step", "proof_diagram"),
  10130: proof("A sum formula by induction proves a pattern for a finite sum such as 1+2+...+n.", "Check n=1, assume the formula for k, add the next term, and simplify to the k+1 formula.", "The next sum equals the old sum plus one new term.", "Forgetting to add the k+1 term.", "Move from k to k+1 by adding the next term.", "What is 1+2+...+n?", "n(n+1)/2", "Natural sum", "1+2+...+n = n(n+1)/2", "symbolic_steps"),
  10131: proof("Divisibility by induction proves that an expression is divisible by a fixed number for all natural numbers.", "Check the first case, assume divisibility for k, then rewrite the k+1 case using the assumption.", "Algebra separates the known divisible part from a new divisible part.", "Testing a few values as proof.", "Examples suggest a pattern but do not prove all cases.", "What does divisible by m mean?", "remainder 0", "Divisibility", "expression = m times an integer", "symbolic_steps"),
  10132: proof("Inequality by induction proves an inequality is true for all natural numbers in a stated range.", "Check the starting value, assume the inequality for k, then prove the stronger or next statement.", "Order is preserved when valid positive quantities are added or multiplied.", "Multiplying by a negative without reversing the inequality.", "Watch signs when multiplying inequalities.", "When multiplying by a negative, what happens to an inequality sign?", "it reverses", "Inequality rule", "negative multiplication reverses inequality", "symbolic_steps"),
  10133: proof("Strong induction assumes all earlier true cases up to k to prove the next case.", "Prove starting cases, assume P(1) through P(k), then prove P(k+1).", "Some problems need more than the immediately previous case.", "Assuming only P(k) when earlier cases are needed.", "Strong induction may use all earlier cases.", "What can strong induction assume?", "all earlier cases", "Strong induction", "P(1)..P(k) imply P(k+1)", "proof_diagram"),
  10134: proof("The binomial expansion gives a formula for expanding (a+b)^n using binomial coefficients.", "Write terms with powers of a decreasing and powers of b increasing, using coefficients nCr.", "Coefficients count the ways to choose which factors contribute b.", "Writing all coefficients as 1.", "Use binomial coefficients, not all ones.", "What is the coefficient of a^(n-r)b^r?", "nCr", "Binomial theorem", "(a+b)^n = sum nCr a^(n-r)b^r", "symbolic_steps"),
  10135: procedure("The general term of a binomial expansion gives the r-th pattern term without writing every term.", "Use T_(r+1)=nCr a^(n-r)b^r, then substitute r.", "Each term chooses r copies of b and n-r copies of a.", "Confusing r with r+1 in the term number.", "T_(r+1) uses r in the formula.", "What is T_(r+1) in (a+b)^n?", "nCr a^(n-r)b^r", "General term", "T_(r+1)=nCr a^(n-r)b^r", "symbolic_steps"),
  10136: procedure("The middle term is the central term or central pair in a binomial expansion.", "Count n+1 terms; if n is even choose one middle term, and if n is odd choose two middle terms.", "The number of terms decides whether one or two terms sit in the centre.", "Always choosing only one middle term.", "Odd n gives an even number of terms and two middle terms.", "How many terms are in (a+b)^n?", "n+1", "Term count", "number of terms = n+1", "symbolic_steps"),
  10137: procedure("An independent term in an expansion is the term whose variable power is zero.", "Write the general term, set the variable exponent to 0, solve for r, then substitute.", "A variable to power zero equals 1, so that term has no variable factor.", "Choosing the constant-looking coefficient before checking powers.", "Set the variable exponent to zero.", "What power makes a variable independent?", "0", "Independent term", "variable exponent = 0", "symbolic_steps"),
  10138: procedure("Binomial approximation uses early terms of (1+x)^n when x is small.", "Keep the needed first terms, usually 1+nx for a first approximation, then estimate.", "Small powers of x become very small, so later terms may be ignored for an approximation.", "Using it for large x without checking accuracy.", "Binomial approximation is reliable only when x is small enough.", "First approximation for (1+x)^n is what?", "1+nx", "Binomial approximation", "(1+x)^n approx 1+nx", "symbolic_steps"),
  10139: proof("Pascal identity says nCr = (n-1)C(r-1) + (n-1)Cr.", "Read the two parent entries above a Pascal triangle entry, then add them.", "A choice of r objects either includes a fixed object or does not include it.", "Adding entries from the wrong row.", "Use the two adjacent entries directly above.", "What two entries add to nCr?", "(n-1)C(r-1) and (n-1)Cr", "Pascal identity", "nCr=(n-1)C(r-1)+(n-1)Cr", "text_table"),
  10140: proof("The combinatorial interpretation explains binomial coefficients as counts of choices.", "Connect nCr to choosing r objects from n objects, then use counting to explain the formula.", "The coefficient counts how many ways a term can be formed from n factors.", "Treating nCr as only a symbol.", "nCr counts selections when order does not matter.", "What does nCr count?", "ways to choose r from n", "Combinations", "nCr counts r selections from n", "text_table"),
  10141: concept("Parabola standard forms describe parabolas with vertex at the origin and axes along coordinate axes.", "Identify whether x or y is squared, then choose the matching form and focus direction.", "A parabola is the set of points equally distant from a focus and directrix.", "Mixing up x^2=4ay and y^2=4ax.", "The squared variable tells the axis direction.", "Which form opens along the positive x-axis?", "y^2=4ax", "Parabola forms", "y^2=4ax or x^2=4ay", "coordinate_graph"),
  10142: concept("The focus-directrix definition says a conic is the set of points whose distance from a focus has a fixed ratio to distance from a directrix.", "Measure distance to the focus and to the directrix, then compare the ratio.", "The fixed ratio controls whether the conic is a parabola, ellipse, or hyperbola.", "Measuring distance to a random line.", "Use the stated directrix line.", "For a parabola, what is eccentricity?", "1", "Focus-directrix", "PF/PM = e", "coordinate_graph"),
  10143: concept("Ellipse standard forms describe ellipses centred at the origin with major axis along x or y.", "Compare denominators under x^2 and y^2, then identify the major axis and vertices.", "The larger denominator gives the longer semi-axis.", "Calling the smaller denominator the major axis.", "The major axis uses the larger denominator.", "For x^2/25 + y^2/9 = 1, which axis is major?", "x-axis", "Ellipse form", "x^2/a^2 + y^2/b^2 = 1", "coordinate_graph"),
  10144: concept("Hyperbola standard forms describe two-branched conics with a difference of squared terms.", "Check which squared term is positive, then identify the transverse axis.", "The sign pattern decides the direction in which the branches open.", "Treating the plus form as a hyperbola.", "A standard hyperbola has one squared term subtracted.", "Which sign appears between squared terms in a hyperbola?", "minus", "Hyperbola form", "x^2/a^2 - y^2/b^2 = 1", "coordinate_graph"),
  10145: concept("Eccentricity measures how much a conic differs from a circle using a fixed distance ratio.", "Identify the conic and compute the focus-directrix distance ratio e.", "The value of e classifies the shape: parabola 1, ellipse less than 1, hyperbola greater than 1.", "Thinking every conic has e less than 1.", "Only ellipses have eccentricity less than 1.", "What is e for a parabola?", "1", "Eccentricity", "e = distance to focus / distance to directrix", "coordinate_graph"),
  10146: procedure("Parametric coordinates describe points on a curve using a parameter instead of one direct equation.", "Choose a parameter value, substitute into x and y formulas, then plot the point.", "A changing parameter traces the curve point by point.", "Treating the parameter as a fixed constant for the whole curve.", "The parameter changes to generate different points.", "For parabola y^2=4ax, what is a standard point?", "(at^2,2at)", "Parabola parameter", "(at^2, 2at)", "coordinate_graph"),
  10147: procedure("The tangent to a parabola touches the parabola at one point and has a standard equation at a parameter value.", "Identify the point parameter t, then substitute into the tangent formula.", "The tangent shares the curve's direction at the point of contact.", "Using the normal formula instead.", "A tangent follows the curve direction; a normal is perpendicular to it.", "For y^2=4ax, tangent at t is what?", "ty=x+at^2", "Parabola tangent", "ty = x + at^2", "coordinate_graph"),
  10148: procedure("The normal to a parabola is the line perpendicular to the tangent at the point of contact.", "Identify parameter t, then substitute into the normal equation.", "Perpendicular slopes connect the tangent and normal at the same point.", "Using a different parameter for tangent and normal.", "Both lines must use the same point of contact.", "For y^2=4ax, normal at t is what?", "y=-tx+2at+at^3", "Parabola normal", "y = -tx + 2at + at^3", "coordinate_graph"),
  10149: procedure("The tangent to an ellipse touches the ellipse at one point and can be written from the point of contact.", "Use the contact point or parameter, then substitute in the ellipse tangent formula.", "The tangent gives the single straight-line direction at that ellipse point.", "Using circle tangent formulas for every ellipse.", "Ellipse tangents depend on both semi-axes.", "For x^2/a^2+y^2/b^2=1, tangent at (x1,y1) is what?", "xx1/a^2 + yy1/b^2 = 1", "Ellipse tangent", "xx1/a^2 + yy1/b^2 = 1", "coordinate_graph"),
  10150: procedure("The tangent to a hyperbola touches one branch at one point and follows a standard point form.", "Use the point of contact, then substitute into the hyperbola tangent formula.", "The tangent has exactly one contact point with the conic at that location.", "Using the ellipse plus-sign tangent formula.", "Keep the minus sign for a standard hyperbola.", "For x^2/a^2-y^2/b^2=1, tangent at (x1,y1) is what?", "xx1/a^2 - yy1/b^2 = 1", "Hyperbola tangent", "xx1/a^2 - yy1/b^2 = 1", "coordinate_graph"),
  10151: procedure("Conic identification classifies a second-degree equation as circle, parabola, ellipse, or hyperbola.", "Inspect the x^2 and y^2 coefficients and signs, then complete squares when needed.", "The squared-term pattern controls the conic shape.", "Classifying before checking signs and coefficients.", "Use the second-degree terms first, then simplify.", "If x^2 and y^2 have opposite signs, what conic is suggested?", "hyperbola", "Conic classifier", "Ax^2 + Cy^2 + Dx + Ey + F = 0", "coordinate_graph"),
  10152: concept("Direction ratios are any three numbers proportional to the direction components of a line in 3D.", "Find changes in x, y, and z, then write a proportional triple.", "A 3D line direction is fixed by how coordinates change together.", "Thinking direction ratios must be unit length.", "Direction ratios can be any non-zero proportional triple.", "For points (1,2,3) and (4,6,8), give direction ratios.", "3,4,5", "Direction ratios", "a:b:c = delta x : delta y : delta z", "coordinate_graph"),
  10153: concept("Direction cosines are the cosines of the angles a line makes with the positive coordinate axes.", "Divide each direction component by the vector length to get l, m, and n.", "Normalising direction ratios gives a unit direction vector.", "Forgetting that l^2+m^2+n^2=1.", "Direction cosines satisfy l^2+m^2+n^2=1.", "What is l^2+m^2+n^2 for direction cosines?", "1", "Direction cosines", "l^2 + m^2 + n^2 = 1", "coordinate_graph"),
};

const expertReviewIds = new Set([10134, 10135, 10136, 10137, 10138, 10139, 10140]);

export function schoolSyllabusAdvancedSeed(id: number): SchoolSyllabusAdvancedSeed {
  const source = sources[id];
  const detail = specifics[id];
  if (!source || !detail) throw new Error(`Missing school syllabus advanced lesson seed for ${id}`);
  return { id, expertReviewRequired: expertReviewIds.has(id), ...source, ...detail };
}

export function schoolSyllabusAdvancedLesson(seed: SchoolSyllabusAdvancedSeed): StrengthenedLesson {
  const slug = seed.route.split("/").pop() ?? String(seed.id);
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: "School Syllabus",
    topic: seed.topic,
    academicLevel: seed.academicLevel,
    lessonType: seed.lessonType,
    learningObjectives: [`Define ${seed.title} correctly.`, seed.action, `Avoid this mistake: ${seed.misconception[1]}`],
    prerequisites: prerequisitesFor(seed.topic),
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, vocabularyFor(seed.topic)],
    introduction: `${seed.title} is a school mathematics idea in ${seed.topic}. It helps students model data, functions, curves, proofs, and 3D directions. We use related ideas in graphs, design, surveys, navigation, and measurement.`,
    basicIdea: `${seed.definition} The basic idea is to check the exact condition before using a formula. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then check that the answer matches the stated condition.`,
    whyItWorks: whyFor(seed.topic),
    definitions: [{ id: `${slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${slug}-fact`, statement: seed.reason }],
    formulas: [formula(seed.formula.label, seed.formula.expression, seed.formula.exactness)],
    conditionsAndRestrictions: restrictionsFor(seed.topic),
    representations: [{ id: `${slug}-representation`, type: seed.representation, learningPurpose: `Show the exact structure of ${seed.title}.` }],
    workedExamples: [{ id: `${slug}-worked-1`, prompt: seed.prompt, steps: ["Read the given information.", seed.action, "Check the answer against the lesson condition."], answer: seed.expected }],
    realLifeExamples: examplesFor(seed.topic, slug),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${slug}-interaction`,
      learningPurpose: `Explore ${seed.title} with a linked school-style diagram, table, graph, or proof check.`,
      parameters: [{ id: "value", label: "Value", validRange: [1, 30] }],
      initialState: `Start with the worked example for ${seed.title}.`,
      dynamicFeedback: "Changing one input updates the diagram, table, graph, formula, or proof check.",
      successCriteria: ["Use the exact condition", "Read the representation", "Explain the common mistake"],
      accessibilityAlternative: "Provide the same steps and result as labelled text.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict the result before changing the model." }, { id: "test", prompt: "Change one input and read the new result." }, { id: "explain", prompt: "Explain why the rule still works." }],
    practice: [
      practice(`${slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"),
      practice(`${slug}-direct`, seed.prompt, seed.expected, code, "direct"),
      practice(`${slug}-multi`, `How do you use ${seed.title}?`, seed.action, code, "multi_step"),
      practice(`${slug}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${slug}-transfer`, `Give one daily use of ${seed.title}.`, examplesFor(seed.topic, slug)[0].context, code, "transfer"),
    ],
    challenge: { id: `${slug}-challenge`, prompt: seed.prompt, successCriteria: ["Uses the exact rule", "Checks conditions", "Avoids the named mistake"], hints: [`Use the rule for ${seed.title}.`, seed.misconception[2]] },
    exitCheck: [{ id: `${slug}-exit`, prompt: `State one rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names a correct rule or condition." }],
    accessibilityNotes: ["Announce values, labels, graph coordinates, and proof steps as text.", "Do not rely only on colour."],
    expertReviewRequired: seed.expertReviewRequired,
    reviewReason: seed.expertReviewRequired ? "This binomial theorem lesson needs expert review for formula coverage." : undefined,
  };
}

export function schoolSyllabusAdvancedChallenge(seed: SchoolSyllabusAdvancedSeed): SchoolSyllabusAdvancedChallenge {
  return { prompt: seed.prompt, expected: seed.expected, hint: `Use the rule for ${seed.title}.`, kind: Number.isFinite(Number(seed.expected)) ? "numeric" : "keywords", factoryId: `school.advanced.${seed.id}` };
}

function source(title: string, route: string, topic: string, academicLevel: string): Source {
  return { title, route, topic, academicLevel };
}

function concept(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusAdvancedSeed["representation"]): Specifics {
  return base("concept", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "definition");
}

function procedure(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusAdvancedSeed["representation"]): Specifics {
  return base("procedure", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "definition");
}

function proof(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusAdvancedSeed["representation"]): Specifics {
  return base("proof", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "theorem");
}

function tool(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusAdvancedSeed["representation"]): Specifics {
  return base("tool", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "definition");
}

function modelling(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusAdvancedSeed["representation"]): Specifics {
  return base("modelling", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "definition");
}

function base(lessonType: SchoolSyllabusAdvancedSeed["lessonType"], definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusAdvancedSeed["representation"], exactness: SchoolSyllabusAdvancedSeed["formula"]["exactness"]): Specifics {
  return { lessonType, definition, action, reason, representation, misconception: [label.toUpperCase().replace(/[^A-Z0-9]+/g, "_"), mistake, correction], prompt, expected, formula: { label, expression, exactness } };
}

function formula(label: string, expression: string, exactness: StrengthenedLesson["formulas"][number]["exactness"]): StrengthenedLesson["formulas"][number] {
  return { id: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-formula`, label, expression, variables: [{ symbol: "given values", meaning: "the values named in the lesson question" }], exactness };
}

function examplesFor(topic: string, slug: string) {
  const examples: [string, string][] = /Statistics/.test(topic)
    ? [["Class marks", "Data tables and ogives summarise many scores."], ["Shop bills", "Grouped values can show average spending."], ["Sports scores", "Frequencies reveal repeated results."]]
    : /Mensuration/.test(topic)
      ? [["Water tanks", "Joined solids model containers."], ["Packaging", "Surface area counts exposed material."], ["Building parts", "Volumes add when pieces join."]]
      : /Relations/.test(topic)
        ? [["Student roll numbers", "A relation can connect people to groups."], ["Phone contacts", "Mappings connect names to numbers."], ["Login systems", "Functions connect users to accounts."]]
        : /Trigonometry/.test(topic)
          ? [["Sound waves", "Trig graphs model repeating waves."], ["Ferris wheel motion", "Sine and cosine repeat positions."], ["Navigation", "Angles repeat by full turns."]]
          : /Induction/.test(topic)
            ? [["Stacked blocks", "One stable step supports the next."], ["Savings pattern", "A repeated rule proves every week."], ["Number patterns", "Induction proves formulas for all n."]]
            : /Binomial/.test(topic)
              ? [["Mental calculation", "Binomial expansion estimates powers."], ["Counting choices", "Coefficients count selections."], ["Algebra checking", "Terms reveal exact powers."]]
              : /Conic/.test(topic)
                ? [["Satellite dishes", "Parabolas focus signals."], ["Planet paths", "Ellipses model orbits."], ["Engineering curves", "Conics guide reflectors and paths."]]
                : [["Flight paths", "3D direction describes movement."], ["Computer graphics", "Lines in space need direction triples."], ["Navigation", "Direction cosines describe orientation."]];
  return examples.map(([context, connection], index) => ({ id: `${slug}-real-${index + 1}`, context, connection }));
}

function vocabularyFor(topic: string) {
  if (/Statistics/.test(topic)) return { term: "Frequency", meaning: "How many observations are in a class." };
  if (/Relations/.test(topic)) return { term: "Ordered pair", meaning: "A pair where order matters, such as (a,b)." };
  if (/Conic/.test(topic)) return { term: "Conic", meaning: "A curve made by slicing a cone." };
  if (/Three-Dimensional/.test(topic)) return { term: "Direction", meaning: "The way a line points in space." };
  return { term: "Formula", meaning: "A rule written with symbols." };
}

function prerequisitesFor(topic: string) {
  if (/Statistics/.test(topic)) return ["Frequency tables", "Arithmetic mean", "Coordinate graphs"];
  if (/Relations/.test(topic)) return ["Sets", "Ordered pairs", "Functions"];
  if (/Trigonometry/.test(topic)) return ["Unit circle", "Trig ratios", "Graphs"];
  if (/Induction/.test(topic)) return ["Natural numbers", "Algebra", "Logical implication"];
  if (/Binomial/.test(topic)) return ["Combinations", "Exponents", "Algebraic expansion"];
  if (/Conic/.test(topic)) return ["Coordinate axes", "Squares", "Distance formula"];
  if (/Three-Dimensional/.test(topic)) return ["3D coordinates", "Vectors", "Square roots"];
  return ["Measurement", "Area", "Volume"];
}

function restrictionsFor(topic: string) {
  if (/Statistics/.test(topic)) return ["Use class boundaries consistently.", "Use frequencies as weights."];
  if (/Relations/.test(topic)) return ["Check every element or ordered pair required by the definition.", "Do not confuse range with codomain."];
  if (/Trigonometry/.test(topic)) return ["Use the stated interval.", "Add periods only for general solutions."];
  if (/Induction/.test(topic)) return ["Prove the base case.", "Use the inductive assumption only after stating it."];
  if (/Binomial/.test(topic)) return ["Track term number and r carefully.", "Check powers of each variable."];
  if (/Conic/.test(topic)) return ["Keep signs and denominators in the standard form.", "Use the correct axis direction."];
  if (/Three-Dimensional/.test(topic)) return ["Direction ratios are proportional.", "Direction cosines must satisfy l^2+m^2+n^2=1."];
  return ["Split solids before adding or subtracting.", "Do not count hidden faces as exposed area."];
}

function whyFor(topic: string) {
  if (/Statistics/.test(topic)) return "Statistics works because frequencies count how many data values each class represents.";
  if (/Relations/.test(topic)) return "Relations and functions work because ordered pairs give exact input-output connections.";
  if (/Trigonometry/.test(topic)) return "Trigonometry works because unit-circle positions and right-triangle ratios repeat in fixed ways.";
  if (/Induction/.test(topic)) return "Induction works because one true starting case and one true step create a chain for all natural numbers.";
  if (/Binomial/.test(topic)) return "The binomial theorem works because each term counts choices from repeated factors.";
  if (/Conic/.test(topic)) return "Conic formulas work because distance conditions create fixed coordinate equations.";
  if (/Three-Dimensional/.test(topic)) return "3D geometry works because coordinate changes describe direction and position in space.";
  return "Mensuration works because area and volume can be split into simple non-overlapping parts.";
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Read the condition.", "Choose the matching rule.", "Check the final answer."], workedSolution: ["Identify the given information.", "Apply the lesson rule.", "Check the answer in context."], misconceptionTag, difficulty, parameterConstraints: ["Use school-level data, simple sets, exact angles, or standard equations."] };
}
