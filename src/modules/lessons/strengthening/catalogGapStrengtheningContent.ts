import type { FormulaItem, RepresentationType, StrengthenedLesson } from "./strengthenedLessonSchema";

type GapSeed = {
  id: number;
  title: string;
  route: string;
  category: string;
  topic: string;
  academicLevel: string;
  lessonType: StrengthenedLesson["lessonType"];
  definition: string;
  introduction: string;
  how: string;
  why: string;
  vocabulary: Array<[string, string]>;
  facts: string[];
  formulas: FormulaItem[];
  restrictions: string[];
  representation: RepresentationType;
  worked: { prompt: string; steps: string[]; answer: string };
  examples: Array<[string, string]>;
  misconception: [string, string, string];
  controls: string[];
  feedback: string;
  directPractice: [string, string];
  transferPractice: [string, string];
};

const seeds: GapSeed[] = [
  {
    id: 359, title: "Eigenvalues and Eigenvectors", route: "/lessons/advanced-mathematics/359-eigenvalues-and-eigenvectors", category: "Advanced Mathematics", topic: "Matrices and Linear Algebra", academicLevel: "Advanced", lessonType: "concept",
    definition: "An eigenvector is a non-zero vector whose direction is unchanged by a linear transformation; its eigenvalue is the scale factor.",
    introduction: "Eigenvalues and eigenvectors reveal the directions a matrix stretches, reverses, or leaves fixed. They turn repeated matrix action into a small set of invariant directions and scale factors.",
    how: "Solve det(A - lambda I) = 0 for each eigenvalue, then solve (A - lambda I)v = 0 for a corresponding non-zero eigenvector.",
    why: "The equation Av = lambda v says that applying A changes only the vector's length or orientation along the same line, so powers of A act predictably on that direction.",
    vocabulary: [["Eigenvalue", "The scalar lambda in Av = lambda v."], ["Eigenvector", "A non-zero invariant-direction vector for a transformation."], ["Eigenspace", "All eigenvectors for one eigenvalue together with the zero vector."]],
    facts: ["Eigenvalues are roots of the characteristic polynomial det(A - lambda I).", "The zero vector is never an eigenvector."],
    formulas: [formula("characteristic-equation", "Characteristic equation", "det(A-lambda I)=0", [["A", "square matrix"], ["lambda", "eigenvalue"]]), formula("eigenvector-equation", "Eigenvector equation", "Av=lambda v", [["v", "non-zero eigenvector"], ["lambda", "eigenvalue"]], ["v != 0"])],
    restrictions: ["A must be square for the characteristic equation.", "An eigenvector must be non-zero."], representation: "vector_diagram",
    worked: { prompt: "Find the eigenvalues of diag(3, 2).", steps: ["Compute det(A-lambda I)=(3-lambda)(2-lambda).", "Set the determinant to zero.", "The roots are lambda=3 and lambda=2."], answer: "3 and 2" },
    examples: [["Population projection", "A dominant eigenvalue describes long-run growth."], ["Image transformation", "Eigenvectors mark directions that are not rotated by a matrix."], ["Page ranking", "A principal eigenvector represents a stable importance distribution."]],
    misconception: ["ZERO_EIGENVECTOR", "Treating the zero vector as an eigenvector because A0=lambda0.", "Eigenvectors must be non-zero; otherwise every lambda would qualify."], controls: ["matrix-entry", "vector-angle"], feedback: "Update the characteristic polynomial, candidate eigenvalues, and whether the test vector keeps its direction.",
    directPractice: ["For A=diag(5,-1), name both eigenvalues.", "5 and -1"], transferPractice: ["Why are eigenvectors useful for repeated transformations?", "Each repetition scales the same invariant direction by another factor of lambda."],
  },
  {
    id: 404, title: "Nets of Solids", route: "/lessons/3d-mathematics/404-nets-of-solids", category: "3D Mathematics", topic: "3D Geometry and Solids", academicLevel: "Intermediate-Advanced", lessonType: "visual_exploration",
    definition: "A net is a connected two-dimensional arrangement of faces that folds without overlap to form a three-dimensional solid.",
    introduction: "Nets of solids connect flat face layouts with cubes, prisms, pyramids, and other spatial objects. Folding a valid net shows which edges meet and which faces become opposite.",
    how: "Match every polygon in the net to one face, fold along shared edges, and check that no faces overlap or leave a required face missing.",
    why: "Folding preserves each face's shape and edge length, while shared edges act as hinges that determine the final adjacency of faces.",
    vocabulary: [["Net", "A flat arrangement of all faces of a solid."], ["Face", "A flat surface of a solid."], ["Shared edge", "An edge where two faces meet and fold."]],
    facts: ["A cube net contains six congruent squares.", "Not every connected arrangement of six squares is a valid cube net."],
    formulas: [formula("surface-area", "Surface area from a net", "SA=sum(area of each exposed face)", [["SA", "total surface area"]])],
    restrictions: ["Include every face exactly once.", "Faces may meet at edges but cannot overlap after folding."], representation: "solid_3d",
    worked: { prompt: "Find the surface area of a 3 by 2 by 1 cuboid from its net.", steps: ["Pair the congruent faces: 3x2, 3x1, and 2x1.", "Double their areas: 2(6+3+2).", "Add to obtain 22 square units."], answer: "22 square units" },
    examples: [["Packaging", "A carton template is a net with tabs added for joining."], ["Dice design", "Opposite faces can be checked before the cube is folded."], ["Sheet-metal work", "A flat pattern is cut before being bent into a solid."]],
    misconception: ["FACE_OVERLAP", "Calling any six-square arrangement a cube net.", "Fold mentally or interactively and reject arrangements whose faces overlap."], controls: ["net-fold", "net-face"], feedback: "Show fold angle, matching edges, face adjacency, and any collision between faces.",
    directPractice: ["How many square faces must a cube net contain?", "6"], transferPractice: ["Why does a cereal-box template need matching rectangles?", "Opposite faces of the cuboid have equal dimensions."],
  },
  {
    id: 443, title: "Differential Equations", route: "/lessons/symbolic-mathematics/443-differential-equations", category: "Symbolic Mathematics", topic: "CAS Workspace", academicLevel: "Intermediate-Advanced", lessonType: "procedure",
    definition: "A differential equation relates an unknown function to one or more of its derivatives.",
    introduction: "Differential equations model quantities through their rates of change. A symbolic solution is a function or family of functions that satisfies the equation when substituted back.",
    how: "Classify the equation, choose a valid method such as separation or an integrating factor, solve for the function, and substitute the result back into the original equation.",
    why: "Differentiating the proposed solution reproduces the required rate relationship; an initial condition then selects one member of the solution family.",
    vocabulary: [["Order", "The highest derivative appearing in the equation."], ["General solution", "A family of solutions containing arbitrary constants."], ["Initial condition", "A value that selects a particular solution."]],
    facts: ["A first-order equation contains no derivative higher than y'.", "A valid solution must satisfy both the equation and any supplied conditions."],
    formulas: [formula("separable", "Separable form", "dy/g(y)=f(x)dx", [["f", "function of x"], ["g", "function of y"]]), formula("euler-step", "Euler step", "y_(n+1)=y_n+h f(x_n,y_n)", [["h", "step size"], ["f", "slope function"]])],
    restrictions: ["Division during separation can exclude equilibrium solutions.", "State the interval on which the solution is valid."], representation: "slope_field",
    worked: { prompt: "Solve y'=2x with y(0)=3.", steps: ["Integrate: y=x^2+C.", "Use y(0)=3 to obtain C=3.", "Differentiate y=x^2+3 to check y'=2x."], answer: "y=x^2+3" },
    examples: [["Cooling", "Temperature change can be proportional to the difference from room temperature."], ["Population growth", "A rate can depend on the current population."], ["Motion", "Acceleration, velocity, and position are linked by derivatives."]],
    misconception: ["LOST_EQUILIBRIUM", "Dividing by a function of y without checking when it is zero.", "Test zero factors separately so constant equilibrium solutions are not lost."], controls: ["ode-rule", "ode-initial-condition"], feedback: "Update the slope field, symbolic solution family, selected initial-value curve, and substitution check.",
    directPractice: ["What is the order of y''+y=0?", "2"], transferPractice: ["What does an initial condition do?", "It selects a particular solution from the general family."],
  },
  {
    id: 480, title: "Box Plot", route: "/lessons/data-and-probability/480-box-plot", category: "Data and Probability", topic: "Statistics and Regression", academicLevel: "Intermediate-Advanced", lessonType: "procedure",
    definition: "A box plot displays the minimum, first quartile, median, third quartile, and maximum on one number scale.",
    introduction: "A box plot compresses an ordered data set into its five-number summary. The box shows the middle half, the median marks the centre, and whiskers show the outer spread under the chosen convention.",
    how: "Sort the data, find Q1, the median, and Q3, compute the IQR, apply the stated whisker rule, and plot every summary value on one consistent scale.",
    why: "Quartiles divide ordered data by position, so the box from Q1 to Q3 contains the central 50 percent and its length measures middle spread.",
    vocabulary: [["Quartile", "A cut point that divides ordered data into quarters."], ["Interquartile range", "Q3 minus Q1."], ["Outlier", "A value beyond a stated outlier fence."]],
    facts: ["The line inside the box marks the median.", "A longer box means a larger interquartile range."],
    formulas: [formula("iqr", "Interquartile range", "IQR=Q3-Q1", [["Q1", "lower quartile"], ["Q3", "upper quartile"]]), formula("outlier-fences", "1.5 IQR fences", "[Q1-1.5IQR, Q3+1.5IQR]", [["IQR", "interquartile range"]])],
    restrictions: ["State the quartile convention when it affects the result.", "Do not compare box lengths drawn on different scales."], representation: "distribution_plot",
    worked: { prompt: "Find the five-number summary of 1, 2, 4, 7, 9.", steps: ["The data are already sorted.", "Median=4; lower-half median Q1=1.5; upper-half median Q3=8.", "Minimum=1 and maximum=9."], answer: "(1, 1.5, 4, 8, 9)" },
    examples: [["Exam scores", "Parallel box plots compare centre and spread between classes."], ["Delivery times", "The median and IQR summarise typical service time."], ["Quality control", "Extreme measurements can be flagged by outlier fences."]],
    misconception: ["UNSORTED_QUARTILES", "Finding quartiles before ordering the data.", "Sort values first because quartiles are based on position."], controls: ["box-data", "box-rule"], feedback: "Update the sorted data, five-number summary, IQR, outlier fences, and plotted box.",
    directPractice: ["If Q1=12 and Q3=20, find the IQR.", "8"], transferPractice: ["What does a longer box indicate?", "Greater spread in the middle 50 percent of the data."],
  },
  {
    id: 576, title: "Graph Colouring", route: "/lessons/discrete-and-applied-mathematics/576-graph-colouring", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "visual_exploration",
    definition: "A proper vertex colouring assigns colours to vertices so adjacent vertices always receive different colours.",
    introduction: "Graph colouring models conflict: an edge means two items cannot share a colour, time slot, channel, or resource. The chromatic number is the fewest colours that satisfy every edge.",
    how: "Colour high-conflict vertices first, check every edge after each choice, reuse a colour only on non-adjacent vertices, and prove minimality with a lower bound.",
    why: "Each edge encodes one incompatibility constraint, so a colouring is valid exactly when no edge has equal colours at both endpoints.",
    vocabulary: [["Proper colouring", "A colouring with no same-colour adjacent vertices."], ["Chromatic number", "The minimum number of colours needed."], ["Clique", "A set of pairwise adjacent vertices."]],
    facts: ["A graph containing a triangle needs at least three colours.", "Every bipartite graph with at least one edge is 2-colourable."],
    formulas: [formula("proper-colouring", "Edge constraint", "uv in E => c(u) != c(v)", [["E", "edge set"], ["c", "vertex-colour assignment"]]), formula("chromatic-number", "Chromatic number", "chi(G)=minimum number of colours in a proper colouring", [["G", "graph"]])],
    restrictions: ["Only adjacent vertices must differ in vertex colouring.", "A displayed colouring gives an upper bound, not automatically the minimum."], representation: "proof_diagram",
    worked: { prompt: "How many colours does a triangle K3 require?", steps: ["Every pair of its three vertices is adjacent.", "No two vertices can reuse a colour.", "Three colours work and fewer cannot."], answer: "3" },
    examples: [["Exam timetabling", "Courses sharing students are adjacent and need different slots."], ["Map colouring", "Regions sharing a boundary need different colours."], ["Radio channels", "Nearby transmitters that interfere must use different channels."]],
    misconception: ["COLOUR_COUNT_NOT_MINIMUM", "Calling the number of colours in one valid attempt the chromatic number.", "Also prove that no colouring with fewer colours is possible."], controls: ["graph-colour-vertex"], feedback: "Highlight conflicting edges, count colours used, and distinguish validity from minimality.",
    directPractice: ["What is the chromatic number of a path with at least one edge?", "2"], transferPractice: ["What does an edge represent in a timetable graph?", "A conflict that prevents the two courses sharing a time slot."],
  },
  {
    id: 582, title: "Set Builder", route: "/lessons/discrete-and-applied-mathematics/582-set-builder", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "procedure",
    definition: "Set-builder notation describes a set by a variable, its domain, and a condition that every member satisfies.",
    introduction: "Set Builder translates a verbal rule into precise membership notation. It is useful when listing every element would be long, impossible, or less informative than the defining condition.",
    how: "Choose a variable, state its universe or number set, write the membership bar, add the exact condition, and test boundary values against the rule.",
    why: "The predicate after the bar acts as a membership test, so the notation includes exactly the domain elements for which that predicate is true.",
    vocabulary: [["Predicate", "A condition that is true or false for each candidate."], ["Universe", "The collection from which candidates are taken."], ["Roster form", "A set written by listing its elements."]],
    facts: ["{x in Z | 0<x<4}={1,2,3}.", "Changing the domain can change the set even when the condition stays the same."],
    formulas: [formula("set-builder", "Set-builder form", "{x in U | P(x)}", [["U", "universe"], ["P(x)", "membership condition"]])],
    restrictions: ["State the domain when the condition alone is ambiguous.", "A set does not repeat elements."], representation: "text_table",
    worked: { prompt: "Write {2,4,6,8} in set-builder notation.", steps: ["Use natural numbers as the domain.", "Require x to be even.", "Restrict x between 2 and 8 inclusive."], answer: "{x in N | x is even and 2<=x<=8}" },
    examples: [["Database filter", "A predicate selects records satisfying a rule."], ["Even seat numbers", "A rule describes all seats divisible by two."], ["Solution set", "An equation's solutions are values satisfying its condition."]],
    misconception: ["DOMAIN_OMITTED", "Writing a condition without stating whether x is integer, real, or another type.", "Include the universe whenever it changes which values qualify."], controls: ["set-rule", "set-membership"], feedback: "Update the roster, number-line region, and membership result for each tested value.",
    directPractice: ["List {x in Z | -1<x<=2}.", "{0,1,2}"], transferPractice: ["Why is the domain important in x^2<5?", "Integer and real domains produce different sets."],
  },
  {
    id: 583, title: "Union, Intersection and Difference", route: "/lessons/discrete-and-applied-mathematics/583-union-intersection-and-difference", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "concept",
    definition: "Union collects elements in either set, intersection keeps elements in both, and difference keeps elements in the first set but not the second.",
    introduction: "Union, intersection, and difference answer three distinct membership questions. Linked roster and Venn views make overlap and one-sided regions explicit.",
    how: "Check each candidate element against both sets, then apply OR for union, AND for intersection, or first-set AND NOT second-set for difference.",
    why: "Set operations are logical rules applied element by element, which is why Venn shading and roster results agree.",
    vocabulary: [["Union", "Elements in A or B or both."], ["Intersection", "Elements common to A and B."], ["Difference", "Elements in one named set but not the other."]],
    facts: ["A union B is commutative.", "A minus B is generally not equal to B minus A."],
    formulas: [formula("set-operations", "Membership rules", "x in A union B iff x in A or x in B", [["A,B", "sets"], ["x", "candidate element"]]), formula("union-cardinality", "Two-set union", "|A union B|=|A|+|B|-|A intersection B|", [["A,B", "finite sets"]])],
    restrictions: ["Subtract the intersection once in the union count.", "Keep the order of set difference."], representation: "venn_diagram",
    worked: { prompt: "Let A={1,2,3} and B={3,4}. Find A union B, A intersection B, and A-B.", steps: ["Collect each distinct element for the union.", "Keep 3 for the intersection.", "Remove B's elements from A for the difference."], answer: "A union B={1,2,3,4}; A intersection B={3}; A-B={1,2}" },
    examples: [["Sports clubs", "Intersection identifies students in both clubs."], ["Search filters", "Union combines matches from either criterion."], ["Inventory", "Difference finds stocked items not yet sold."]],
    misconception: ["DIFFERENCE_COMMUTATIVE", "Assuming A-B equals B-A.", "Difference is directional; start with the set named first."], controls: ["set-operation"], feedback: "Synchronise Venn shading, roster output, membership statements, and cardinality.",
    directPractice: ["If A={1,2} and B={2,3}, find A intersection B.", "{2}"], transferPractice: ["Which operation finds people in both groups?", "Intersection"],
  },
  {
    id: 586, title: "Subsets and Power Sets", route: "/lessons/discrete-and-applied-mathematics/586-subsets-and-power-sets", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "concept",
    definition: "A is a subset of B when every element of A is in B; the power set of B is the set of all subsets of B.",
    introduction: "Subsets express containment between sets, while a power set lists every possible include-or-exclude choice. Even the empty set and the original set must be included.",
    how: "Test each candidate element for subset status; to build a power set, enumerate choices systematically by subset size or binary include/exclude patterns.",
    why: "Each of n elements has two independent choices, included or excluded, producing 2^n distinct subsets.",
    vocabulary: [["Subset", "A set whose every element belongs to another set."], ["Proper subset", "A subset not equal to the containing set."], ["Power set", "The set of all subsets."]],
    facts: ["The empty set is a subset of every set.", "Every set is a subset of itself."],
    formulas: [formula("power-cardinality", "Power-set size", "|P(A)|=2^|A|", [["A", "finite set"]])],
    restrictions: ["Subset does not mean proper subset unless inequality is required.", "Count the empty set and the full set in a power set."], representation: "text_table",
    worked: { prompt: "Find the power set of {a,b}.", steps: ["Include the empty choice.", "Include each one-element subset.", "Include the full set."], answer: "{empty set,{a},{b},{a,b}}" },
    examples: [["Feature selection", "Each subset is one possible group of enabled features."], ["Menu choices", "A power set represents every combination of optional toppings."], ["Access roles", "A permission set can be contained in a larger role's permissions."]],
    misconception: ["EMPTY_SET_MISSING", "Leaving the empty set out of a power set.", "The empty set is always a subset and must appear in every power set."], controls: ["power-source", "power-candidate"], feedback: "Generate every subset, report 2^n, and explain any failed subset test with a missing element.",
    directPractice: ["How many subsets does a 4-element set have?", "16"], transferPractice: ["Why is every set a subset of itself?", "Every one of its elements is in itself."],
  },
  {
    id: 587, title: "Truth Tables", route: "/lessons/discrete-and-applied-mathematics/587-truth-tables", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "procedure",
    definition: "A truth table lists every truth-value assignment to propositions and evaluates a logical expression on each row.",
    introduction: "Truth tables test a logical claim exhaustively. They expose whether an expression is always true, always false, or contingent on its inputs.",
    how: "Create 2^n rows for n propositions, fill atomic truth values in a regular pattern, evaluate inner connectives first, and classify the final column.",
    why: "Every possible assignment appears once, so the final column proves the expression's behaviour over the complete finite domain.",
    vocabulary: [["Proposition", "A statement that is either true or false."], ["Tautology", "An expression true on every row."], ["Contradiction", "An expression false on every row."]],
    facts: ["Two propositions require four truth-table rows.", "Equivalent expressions have identical final columns."],
    formulas: [formula("truth-row-count", "Truth-table rows", "rows=2^n", [["n", "number of independent propositions"]])],
    restrictions: ["Include every truth-value assignment exactly once.", "Follow parentheses and connective precedence."], representation: "text_table",
    worked: { prompt: "Classify p OR NOT p.", steps: ["Use rows p=T and p=F.", "When p=T the disjunction is true.", "When p=F, NOT p is true, so the disjunction is still true."], answer: "Tautology" },
    examples: [["Digital circuits", "Truth tables specify gate outputs."], ["Program conditions", "Rows test every Boolean input combination."], ["Rule checking", "A tautology confirms a logical rule has no counterexample."]],
    misconception: ["MISSING_TRUTH_ROWS", "Checking only one convenient assignment.", "A truth table must include all 2^n assignments."], controls: ["truth-expression", "truth-row"], feedback: "Rebuild all rows, highlight the selected row, and classify the completed final column.",
    directPractice: ["How many rows are needed for three propositions?", "8"], transferPractice: ["How do truth tables show two expressions are equivalent?", "Their final truth-value columns match on every row."],
  },
  {
    id: 588, title: "Logical Connectives", route: "/lessons/discrete-and-applied-mathematics/588-logical-connectives", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "concept",
    definition: "Logical connectives combine or modify propositions: NOT negates, AND requires both, OR requires at least one, and implication fails only when its premise is true and conclusion false.",
    introduction: "Logical connectives give precise meanings to words such as not, and, or, and if-then. Their truth rules prevent everyday language ambiguity from entering a proof or program condition.",
    how: "Identify the main connective, evaluate any negations and grouped subexpressions, then apply that connective's truth rule to the resulting values.",
    why: "Each connective is defined by a fixed truth function, so the same input truth values always produce the same output.",
    vocabulary: [["Conjunction", "p AND q; true only when both are true."], ["Disjunction", "p OR q; true when at least one is true."], ["Implication", "p implies q; false only for true p and false q."]],
    facts: ["NOT reverses a truth value.", "p implies q is equivalent to NOT p OR q."],
    formulas: [formula("implication", "Implication equivalence", "p -> q iff NOT p OR q", [["p", "premise"], ["q", "conclusion"]])],
    restrictions: ["Mathematical OR is inclusive unless stated otherwise.", "Do not reverse an implication without proving its converse."], representation: "text_table",
    worked: { prompt: "Evaluate p implies q when p is true and q is false.", steps: ["The premise p is true.", "The conclusion q is false.", "This is the one assignment that makes implication false."], answer: "False" },
    examples: [["Search queries", "AND narrows results while OR broadens them."], ["Computer programs", "Boolean connectives combine conditions."], ["Theorems", "Implication separates a hypothesis from its conclusion."]],
    misconception: ["OR_EXCLUSIVE", "Reading mathematical OR as exactly one of the statements.", "Inclusive OR is true when one or both statements are true."], controls: ["connective-values", "connective-kind"], feedback: "Translate symbols into words, show the matching truth-table row, and explain the output truth value.",
    directPractice: ["Evaluate true AND false.", "False"], transferPractice: ["When is p implies q false?", "Only when p is true and q is false."],
  },
  {
    id: 589, title: "Quantifiers", route: "/lessons/discrete-and-applied-mathematics/589-quantifiers", category: "Discrete and Applied Mathematics", topic: "Combinatorics, Graph Theory and Logic", academicLevel: "Intermediate-Advanced", lessonType: "concept",
    definition: "The universal quantifier claims a predicate holds for every domain element; the existential quantifier claims it holds for at least one.",
    introduction: "Quantifiers state how broadly a mathematical claim applies. A universal claim needs all cases, while an existential claim needs one valid witness.",
    how: "State the domain, evaluate the predicate, search for a counterexample to test a universal claim, or provide one explicit witness to establish an existential claim.",
    why: "The domain fixes the cases being discussed, and the quantifier determines whether all cases or at least one case must satisfy the predicate.",
    vocabulary: [["Universal quantifier", "For every; written for all."], ["Existential quantifier", "There exists at least one."], ["Counterexample", "One case that disproves a universal claim."]],
    facts: ["One counterexample disproves a universal statement.", "Negating for-all produces an exists-not statement."],
    formulas: [formula("quantifier-negation", "Quantifier negation", "NOT(for all x P(x)) iff there exists x NOT P(x)", [["x", "domain element"], ["P", "predicate"]])],
    restrictions: ["Always identify the domain.", "A collection of examples does not prove a universal claim."], representation: "text_table",
    worked: { prompt: "Over the integers, is every x such that x^2>=0?", steps: ["The domain is all integers.", "The square of every real number is non-negative.", "Therefore every integer satisfies the predicate."], answer: "True" },
    examples: [["Software tests", "One failing input is a counterexample to an all-input claim."], ["Number theory", "Existence statements ask for a witness integer."], ["Policies", "Words such as every and some change a rule's scope."]],
    misconception: ["EXAMPLES_PROVE_ALL", "Using several successful examples as proof of a universal statement.", "Give a general proof; examples can test but cannot cover an infinite domain."], controls: ["quantifier-domain", "quantifier-kind"], feedback: "Show the chosen domain, each predicate result, and either a witness, a counterexample, or a completed universal check.",
    directPractice: ["What disproves a universal statement?", "One counterexample"], transferPractice: ["Negate: every student passed.", "At least one student did not pass."],
  },
  {
    id: 591, title: "Simple Interest", route: "/lessons/discrete-and-applied-mathematics/591-simple-interest", category: "Discrete and Applied Mathematics", topic: "Financial Mathematics and Modelling", academicLevel: "Intermediate-Advanced", lessonType: "modelling",
    definition: "Simple interest is calculated only on the original principal, so equal time periods add equal interest amounts.",
    introduction: "Simple Interest models linear accumulation of money. Principal, decimal rate, and time must use compatible units before the interest and final amount are calculated.",
    how: "Convert the percentage rate to a decimal, match the rate period to the time unit, compute I=Prt, and add the principal to obtain A=P+I.",
    why: "Because every period uses the same original principal rather than an updated balance, the interest grows by the constant amount Pr per period.",
    vocabulary: [["Principal", "The original amount invested or borrowed."], ["Rate", "Interest per time period, written as a decimal in formulas."], ["Amount", "Principal plus accumulated interest."]],
    facts: ["A simple-interest amount is linear in time.", "Simple interest does not earn interest on earlier interest."],
    formulas: [formula("simple-interest", "Simple interest", "I=Prt", [["P", "principal"], ["r", "decimal rate per period"], ["t", "number of matching periods"]]), formula("simple-amount", "Simple-interest amount", "A=P(1+rt)", [["A", "final amount"], ["P", "principal"]])],
    restrictions: ["Convert percentages to decimals.", "Use matching time units for r and t.", "This model does not compound."], representation: "financial_timeline",
    worked: { prompt: "Find the simple interest on 5000 rupees at 6% per year for 3 years.", steps: ["Convert 6% to 0.06.", "Compute I=5000(0.06)(3).", "Add only if the final amount is requested."], answer: "900 rupees interest; 5900 rupees amount" },
    examples: [["Short-term loan", "A flat annual rate can be modelled with simple interest when stated."], ["Savings comparison", "The linear balance can be compared with a compound account."], ["Invoice penalty", "A fixed percentage of the original balance per period grows linearly."]],
    misconception: ["COMPOUND_FORMULA_USED", "Using P(1+r)^t for a simple-interest question.", "Use I=Prt because every period is based on the original principal."], controls: ["simple-interest-assumptions"], feedback: "Update interest per period, total interest, amount table, and the straight-line balance graph.",
    directPractice: ["Find simple interest on 1000 at 5% for 2 years.", "100"], transferPractice: ["Why is the simple-interest graph a straight line?", "The same interest amount is added in every equal time period."],
  },
];

export const catalogGapStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  seeds.map((seed) => [seed.id, buildLesson(seed)]),
);

export const catalogGapStrengthenedChallenges: Record<number, { prompt: string; expected: string; hint: string; kind: "numeric" | "keywords"; factoryId: string }> = Object.fromEntries(seeds.map((seed) => [seed.id, {
  prompt: seed.directPractice[0], expected: seed.directPractice[1], hint: seed.how,
  kind: Number.isFinite(Number(seed.directPractice[1])) ? "numeric" : "keywords",
  factoryId: `catalog-gap.${seed.id}`,
}]));

function buildLesson(seed: GapSeed): StrengthenedLesson {
  const slug = seed.route.split("/").at(-1) ?? String(seed.id);
  const [mistakeCode, mistake, correction] = seed.misconception;
  return {
    id: seed.id, title: seed.title, route: seed.route, category: seed.category, topic: seed.topic, academicLevel: seed.academicLevel, lessonType: seed.lessonType,
    learningObjectives: [`Explain ${seed.definition}`, seed.how, `Correct the misconception: ${mistake}`],
    prerequisites: prerequisites(seed.id),
    keyVocabulary: seed.vocabulary.map(([term, meaning]) => ({ term, meaning })),
    introduction: seed.introduction,
    basicIdea: `${seed.definition} ${seed.facts[0]} ${correction}`,
    howItWorks: seed.how,
    whyItWorks: seed.why,
    definitions: [{ id: `${slug}-definition`, statement: seed.definition }],
    facts: seed.facts.map((statement, index) => ({ id: `${slug}-fact-${index + 1}`, statement })),
    formulas: seed.formulas,
    conditionsAndRestrictions: seed.restrictions,
    representations: [{ id: `${slug}-representation`, type: seed.representation, learningPurpose: `Make the defining structure of ${seed.title} visible and testable.` }],
    workedExamples: [{ id: `${slug}-worked`, ...seed.worked }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code: mistakeCode, mistake, correction }],
    interaction: {
      id: `${slug}-interaction`, learningPurpose: `Test ${seed.title} by changing its mathematical inputs and reading linked evidence.`,
      parameters: seed.controls.map((id) => ({ id, label: labelFromId(id) })),
      initialState: `Start with: ${seed.worked.prompt}`,
      dynamicFeedback: seed.feedback,
      successCriteria: [`State the defining rule for ${seed.title}.`, "Use the linked representation as evidence.", correction],
      accessibilityAlternative: `Provide labelled text for every input and computed result in the ${seed.title} model.`,
    },
    guidedExploration: [
      { id: "predict", prompt: `Predict the ${seed.title} result before changing a control.` },
      { id: "test", prompt: `Change one ${seed.title} input and compare the linked representations.` },
      { id: "explain", prompt: `Explain the update using this fact: ${seed.facts[0]}` },
    ],
    practice: [
      practice(`${slug}-recognition`, `State the defining condition for ${seed.title}.`, seed.definition, mistakeCode, "recognition", seed.definition),
      practice(`${slug}-direct`, seed.directPractice[0], seed.directPractice[1], mistakeCode, "direct", seed.how),
      practice(`${slug}-multi`, seed.worked.prompt, seed.worked.answer, mistakeCode, "multi_step", seed.worked.steps.join(" ")),
      practice(`${slug}-error`, `Correct this claim about ${seed.title}: ${mistake}`, correction, mistakeCode, "error_diagnosis", correction),
      practice(`${slug}-transfer`, seed.transferPractice[0], seed.transferPractice[1], mistakeCode, "transfer", seed.transferPractice[1]),
    ],
    challenge: { id: `${slug}-challenge`, prompt: seed.transferPractice[0], successCriteria: [seed.transferPractice[1], `Uses ${seed.title} vocabulary accurately.`], hints: [seed.how, correction] },
    exitCheck: [{ id: `${slug}-exit`, prompt: seed.directPractice[0], answer: seed.directPractice[1], criterion: `Applies the defining rule for ${seed.title}.` }],
    accessibilityNotes: ["Announce every changed value and result as text.", "Do not use colour or spatial position as the only evidence."],
    expertReviewRequired: [359, 443].includes(seed.id),
    reviewReason: [359, 443].includes(seed.id) ? "Advanced algebra or differential-equation notation should receive expert review." : undefined,
  };
}

function formula(id: string, label: string, expression: string, variables: Array<[string, string]>, restrictions?: string[]): FormulaItem {
  return { id, label, expression, variables: variables.map(([symbol, meaning]) => ({ symbol, meaning })), restrictions, exactness: "definition" };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"], solution: string): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Name the relevant definition or condition.", solution], workedSolution: [solution, `Check against the expected result: ${answer}`], misconceptionTag, difficulty };
}

function labelFromId(id: string) {
  return id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function prerequisites(id: number): string[] {
  if (id === 359) return ["Matrix multiplication", "Determinants", "Solving polynomial equations"];
  if (id === 404) return ["Faces, edges, and vertices", "Area of polygons", "Spatial visualisation"];
  if (id === 443) return ["Derivatives", "Antiderivatives", "Functions and graphs"];
  if (id === 480) return ["Ordering data", "Median", "Quartiles"];
  if (id === 591) return ["Percentages", "Decimal rates", "Linear relationships"];
  return ["Sets and membership", "Logical statements", "Finite systematic cases"];
}
