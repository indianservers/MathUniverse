import type { NCERTPracticeQuestion } from "../components/ncert/practice/ncertPracticeTypes";

export type NCERTPracticeDifficulty = "easy" | "medium" | "exam";
export type NCERTPracticeItem = NCERTPracticeQuestion & {
  conceptId: string;
  difficulty: NCERTPracticeDifficulty;
  answerType: "numeric" | "text" | "multiple-choice";
};

type ConceptSeed = {
  conceptId: string;
  title: string;
  classLevel: "Class 7" | "Class 10" | "Class 12";
  minCount: number;
  facts: Array<{
    prompt: string;
    answer: number | string | string[];
    answerType?: "numeric" | "text" | "multiple-choice";
    choices?: string[];
    tolerance?: number;
    hint: string;
    explanation: string;
    commonMistakes?: NCERTPracticeItem["commonMistakes"];
    tags?: string[];
  }>;
};

export const phase11Grade7PriorityConceptIds = [
  "class-7-large-numbers-around-us",
  "class-7-arithmetic-expressions",
  "class-7-decimal-operations",
  "class-7-fraction-operations",
  "class-7-constructions-and-tilings",
  "class-7-lines-and-triangles",
  "class-7-integers",
  "class-7-simple-equations",
  "class-7-rational-numbers",
  "class-7-comparing-quantities",
  "class-7-algebraic-expressions",
  "class-7-data-handling",
] as const;

export const phase11Class10PriorityConceptIds = [
  "class-10-circle-tangent-radius",
  "class-10-two-tangents",
  "class-10-triangle-bpt-converse",
  "class-10-similarity-criteria",
  "class-10-areas-similar-triangles",
  "class-10-linear-substitution-elimination",
  "class-10-linear-consistency",
  "class-10-grouped-mean-methods",
  "class-10-grouped-mode",
  "class-10-grouped-median",
  "class-10-composite-circle-regions",
  "class-10-combination-solids",
  "class-10-recasting-solids",
  "class-10-frustum-cone",
  "class-10-heights-distances",
  "class-10-real-numbers",
  "class-10-polynomials",
  "class-10-pair-linear",
  "class-10-quadratic",
  "class-10-arithmetic-progressions",
  "class-10-section-formula",
  "class-10-special-trig-angles",
] as const;

export const phase11Class12PriorityConceptIds = [
  "class-12-relations-functions",
  "class-12-determinants",
  "class-12-continuity-differentiability",
  "class-12-integration-methods",
  "class-12-differential-equations",
  "class-12-vectors-3d-geometry",
  "class-12-bayes-theorem",
  "class-12-linear-programming",
  "class-12-inverse-trig",
] as const;

const grade7Seeds: ConceptSeed[] = [
  seed("class-7-large-numbers-around-us", "Large Numbers Around Us", "Class 7", [
    q("Write 4,56,78,901 in expanded form using place values. Choose the largest place value term.", "4 crore", "The first group is crores.", "4,56,78,901 has 4 crore as its largest place value.", ["4 crore", "4 lakh", "4 thousand", "4 hundred"]),
    q("Round 45,678 to the nearest thousand.", 46000, "Look at the hundreds digit.", "The hundreds digit is 6, so 45,678 rounds to 46,000.", undefined, 0),
    q("Which is greater: 7,08,120 or 7,80,120?", "7,80,120", "Compare lakh group, then thousand group.", "Both have 7 lakh, but 80 thousand is greater than 8 thousand."),
  ]),
  seed("class-7-arithmetic-expressions", "Arithmetic Expressions", "Class 7", [
    q("Evaluate 8 + 4 x 3.", 20, "Multiply before adding.", "4 x 3 = 12, then 8 + 12 = 20.", undefined, 0, [{ answer: 36, feedback: "That does addition first. Use multiplication before addition." }]),
    q("Evaluate (8 + 4) x 3.", 36, "Brackets first.", "8 + 4 = 12, then 12 x 3 = 36.", undefined, 0),
    q("Which operation is first in 24 / 3 + 5 x 2?", "division", "Division and multiplication happen before addition.", "Division is the first left-to-right high-priority operation.", ["division", "addition", "subtraction", "none"]),
  ]),
  seed("class-7-decimal-operations", "Decimal Operations", "Class 7", [
    q("Find 3.4 + 2.75.", 6.15, "Align decimal points.", "3.40 + 2.75 = 6.15.", undefined, 0.001),
    q("Find 7.5 - 2.35.", 5.15, "Write 7.50 before subtracting.", "7.50 - 2.35 = 5.15.", undefined, 0.001),
    q("Find 1.2 x 0.3.", 0.36, "12 x 3 = 36, then place two decimal digits.", "1.2 x 0.3 = 0.36.", undefined, 0.001),
  ]),
  seed("class-7-fraction-operations", "Fraction Operations", "Class 7", [
    q("Find 1/2 + 1/3.", "5/6", "Use denominator 6.", "1/2 = 3/6 and 1/3 = 2/6, so the sum is 5/6."),
    q("Simplify 18/24.", "3/4", "Divide numerator and denominator by 6.", "18/24 = 3/4."),
    q("Which is larger: 5/8 or 3/4?", "3/4", "Write 3/4 as eighths.", "3/4 = 6/8, which is larger than 5/8.", ["5/8", "3/4", "equal", "cannot compare"]),
  ]),
  seed("class-7-constructions-and-tilings", "Constructions and Tilings", "Class 7", [
    q("A perpendicular bisector makes what angle with the segment?", 90, "Perpendicular means right angle.", "A perpendicular bisector crosses at 90 degrees.", undefined, 0),
    q("Which regular polygon tiles the plane without gaps?", "regular hexagon", "Think of 120 degree angles meeting three at a point.", "Regular hexagons tile the plane exactly.", ["regular pentagon", "regular hexagon", "regular heptagon", "circle"]),
    q("Why do compass arcs help in construction?", "equal distances", "A compass keeps the same radius.", "Equal arcs mark points at equal distances."),
  ]),
  seed("class-7-lines-and-triangles", "Lines and Triangles", "Class 7", [
    q("Find the third angle of a triangle with angles 50 and 60 degrees.", 70, "Triangle angles add to 180 degrees.", "180 - 50 - 60 = 70.", undefined, 0),
    q("An exterior angle equals the sum of which angles?", "two opposite interior angles", "Use the exterior angle property.", "The exterior angle equals the sum of the two remote interior angles."),
    q("If two parallel lines are cut by a transversal, corresponding angles are what?", "equal", "Look for the same relative position.", "Corresponding angles are equal."),
  ]),
  seed("class-7-integers", "Integers", "Class 7", [
    q("Find -3 + 7.", 4, "Move 7 steps right from -3.", "-3 + 7 = 4.", undefined, 0),
    q("Find -4 x 6.", -24, "Different signs give a negative product.", "-4 x 6 = -24.", undefined, 0),
    q("Find -9 - (-5).", -4, "Subtracting a negative means add.", "-9 + 5 = -4.", undefined, 0),
  ]),
  seed("class-7-simple-equations", "Simple Equations", "Class 7", [
    q("Solve 3x + 2 = 11.", 3, "Subtract 2, then divide by 3.", "3x = 9, so x = 3.", undefined, 0),
    q("Solve x - 5 = 12.", 17, "Add 5 to both sides.", "x = 17.", undefined, 0),
    q("To solve 4x = 28, what operation isolates x?", "divide by 4", "Undo multiplication.", "Divide both sides by 4."),
  ]),
  seed("class-7-rational-numbers", "Rational Numbers", "Class 7", [
    q("Which is greater: -1/2 or -3/4?", "-1/2", "On the number line, the number closer to zero is greater.", "-1/2 = -0.5 and -3/4 = -0.75."),
    q("Write an equivalent fraction for -2/3.", "-4/6", "Multiply numerator and denominator by the same number.", "-2/3 = -4/6."),
    q("What is the decimal value of 3/4?", 0.75, "Divide 3 by 4.", "3/4 = 0.75.", undefined, 0.001),
  ]),
  seed("class-7-comparing-quantities", "Comparing Quantities", "Class 7", [
    q("Find 12% of 1000.", 120, "12/100 of 1000.", "1000 x 12/100 = 120.", undefined, 0),
    q("A book marked 500 has 10% discount. Find discount.", 50, "10% means one tenth.", "10% of 500 is 50.", undefined, 0),
    q("Simple interest on 1000 at 10% for 2 years is?", 200, "Use PRT/100.", "1000 x 10 x 2 / 100 = 200.", undefined, 0),
  ]),
  seed("class-7-algebraic-expressions", "Algebraic Expressions", "Class 7", [
    q("Simplify 3x + 2x + 5.", "5x + 5", "Combine only like terms.", "3x + 2x = 5x, constant stays 5."),
    q("Evaluate 3x + 5 when x = 2.", 11, "Substitute 2 for x.", "3 x 2 + 5 = 11.", undefined, 0),
    q("In 7x - 4, what is the coefficient of x?", 7, "Coefficient multiplies the variable.", "The coefficient is 7.", undefined, 0),
  ]),
  seed("class-7-data-handling", "Data Handling", "Class 7", [
    q("Find the mean of 6, 8, 10.", 8, "Add and divide by 3.", "(6+8+10)/3 = 8.", undefined, 0),
    q("Find the median of 3, 5, 7.", 5, "The median is the middle value.", "The middle value is 5.", undefined, 0),
    q("Find the mode of 4, 5, 5, 7.", 5, "Mode appears most often.", "5 appears twice.", undefined, 0),
  ]),
];

const class10Seeds: ConceptSeed[] = [
  seed("class-10-real-numbers", "Real Numbers", "Class 10", [q("Find HCF of 84 and 36.", 12, "Use Euclid's algorithm.", "84 = 36 x 2 + 12, 36 = 12 x 3.", undefined, 0), q("If HCF is 12 and product is 3024, find LCM.", 252, "HCF x LCM = product.", "3024 / 12 = 252.", undefined, 0), q("The remainder r in a=bq+r must satisfy what?", "0 <= r < b", "Remainder is smaller than divisor.", "Euclid's division lemma uses 0 <= r < b.")]),
  seed("class-10-polynomials", "Polynomials", "Class 10", [q("For x^2 - 5x + 6, find sum of zeroes.", 5, "For x^2+bx+c, sum is -b.", "Here b=-5, so sum=5.", undefined, 0), q("For x^2 - 5x + 6, find product of zeroes.", 6, "Product is c.", "c=6.", undefined, 0), q("If a parabola crosses x-axis twice, how many real zeroes?", 2, "Each crossing is a zero.", "Two crossings mean two real zeroes.", undefined, 0)]),
  seed("class-10-pair-linear", "Pair of Linear Equations", "Class 10", [q("Solve x+y=5 and x-y=1. Find x.", 3, "Add equations.", "2x=6, so x=3.", undefined, 0), q("Lines with equal slopes and different intercepts have how many solutions?", "no solution", "Parallel lines do not meet.", "Parallel distinct lines have no common point."), q("A unique solution appears when two lines do what?", "intersect", "Look at the graph.", "Intersecting lines meet at one point.")]),
  seed("class-10-quadratic", "Quadratic Equations", "Class 10", [q("For x^2 - 3x + 2 = 0, find one root.", ["1", "2"], "Factor the quadratic.", "(x-1)(x-2)=0."), q("Find discriminant of x^2 - 4x + 4.", 0, "D=b^2-4ac.", "16-16=0.", undefined, 0), q("D < 0 means roots are what?", "not real", "The graph does not cut x-axis.", "There are no real roots.")]),
  seed("class-10-arithmetic-progressions", "Arithmetic Progressions", "Class 10", [q("Find 5th term of AP 3, 5, 7,...", 11, "a+(n-1)d.", "3+4x2=11.", undefined, 0), q("Find common difference of 10, 7, 4,...", -3, "Subtract previous term.", "7-10=-3.", undefined, 0), q("Sum of first 3 terms 2,4,6 is?", 12, "Add terms.", "2+4+6=12.", undefined, 0)]),
  seed("class-10-section-formula", "Section Formula", "Class 10", [q("Midpoint of (2,4) and (6,8): x-coordinate?", 4, "Average x-coordinates.", "(2+6)/2=4.", undefined, 0), q("Midpoint of (2,4) and (6,8): y-coordinate?", 6, "Average y-coordinates.", "(4+8)/2=6.", undefined, 0), q("A 1:1 internal division point is called what?", "midpoint", "Equal ratio splits the segment equally.", "The point is the midpoint.")]),
  seed("class-10-special-trig-angles", "Special Trig Angles", "Class 10", [q("sin 30 degrees equals?", "1/2", "Use 30-60-90 triangle.", "sin 30 = 1/2.", ["1/2", "sqrt(3)/2", "1", "0"]), q("tan 45 degrees equals?", 1, "45-45-90 triangle has equal legs.", "opposite/adjacent=1.", undefined, 0), q("cos 60 degrees equals?", "1/2", "Use 30-60-90 triangle.", "cos 60 = 1/2.")]),
  seed("class-10-circle-tangent-radius", "Tangent to a Circle", "Class 10", [q("Radius at point of contact makes what angle with tangent?", 90, "Radius is perpendicular to tangent.", "The angle is 90 degrees.", undefined, 0), q("A tangent touches a circle at how many points?", 1, "It just touches.", "A tangent has exactly one point of contact.", undefined, 0), q("A line cutting a circle at two points is called what?", "secant", "It intersects twice.", "That line is a secant.")]),
  seed("class-10-two-tangents", "Two Tangents", "Class 10", [q("From an external point, two tangent lengths are what?", "equal", "Use RHS congruence.", "Tangents from the same external point are equal."), q("If OP=5 and r=3, tangent length is?", 4, "sqrt(OP^2-r^2).", "sqrt(25-9)=4.", undefined, 0), q("Point inside a circle has how many tangents?", 0, "No tangent can be drawn from inside.", "It has zero tangents.", undefined, 0)]),
  seed("class-10-triangle-bpt-converse", "BPT and Converse", "Class 10", [q("If DE || BC in triangle ABC, AD/DB equals what?", "AE/EC", "Use BPT.", "Parallel line divides sides proportionally."), q("If side ratios are equal, what can the converse prove?", "parallel", "Use BPT converse.", "DE is parallel to BC."), q("BPT is mainly about which idea?", "proportion", "Compare side divisions.", "BPT links parallel lines with proportional sides.")]),
  seed("class-10-similarity-criteria", "Similarity Criteria", "Class 10", [q("Which criterion uses two angles?", "AA", "Two equal angles force similarity.", "AA proves similarity.", ["AA", "RHS", "ASA congruence", "none"]), q("SSS similarity needs sides to be what?", "proportional", "Compare ratios.", "All corresponding sides must be proportional."), q("Similar triangles have equal corresponding what?", "angles", "Shape is same.", "Corresponding angles are equal.")]),
  seed("class-10-areas-similar-triangles", "Areas of Similar Triangles", "Class 10", [q("If side ratio is 2, area ratio is?", 4, "Square the side ratio.", "2^2=4.", undefined, 0), q("If area ratio is 9, side ratio is?", 3, "Take square root.", "sqrt(9)=3.", undefined, 0), q("Area ratio equals square of which ratio?", "side ratio", "Area has two dimensions.", "Area ratio is side ratio squared.")]),
  seed("class-10-linear-substitution-elimination", "Substitution and Elimination", "Class 10", [q("Solve x+y=7 and x-y=1. Find y.", 3, "Subtract equations or solve after x=4.", "Adding gives x=4, then y=3.", undefined, 0), q("Elimination works by making one variable do what?", "cancel", "Multiply equations if needed.", "One variable cancels."), q("Substitution replaces one variable with what?", "expression", "Use one equation to express it.", "Substitution replaces a variable by an equivalent expression.")]),
  seed("class-10-linear-consistency", "Linear Consistency", "Class 10", [q("Parallel distinct lines are consistent or inconsistent?", "inconsistent", "No common solution.", "No solution means inconsistent."), q("Coincident lines have how many solutions?", "infinitely many", "Every point on the line works.", "They have infinitely many solutions."), q("Intersecting lines have how many solutions?", 1, "One crossing point.", "A single intersection gives one solution.", undefined, 0)]),
  seed("class-10-grouped-mean-methods", "Grouped Mean", "Class 10", [q("Mean formula for grouped data uses sum of what?", "fi xi", "Multiply frequency and class mark.", "Mean = sum(fi xi)/sum(fi)."), q("If sum(fi xi)=120 and sum(fi)=10, mean is?", 12, "Divide.", "120/10=12.", undefined, 0), q("Step-deviation is useful when class width is what?", "common", "u=(xi-A)/h.", "It needs a common h.")]),
  seed("class-10-grouped-mode", "Grouped Mode", "Class 10", [q("The modal class has the highest what?", "frequency", "Mode means most frequent.", "The modal class has maximum frequency."), q("If frequencies are 5, 9, 6, modal frequency is?", 9, "Pick largest.", "9 is largest.", undefined, 0), q("Grouped mode uses modal class and which classes?", "neighboring classes", "Formula has f0, f1, f2.", "It uses previous and next frequencies.")]),
  seed("class-10-grouped-median", "Grouped Median", "Class 10", [q("Median class is found using which column?", "cumulative frequency", "Find first cf above n/2.", "Median class is located by cumulative frequency."), q("If n=40, n/2 is?", 20, "Half of 40.", "40/2=20.", undefined, 0), q("Grouped median formula uses class width symbol what?", "h", "Standard formula has h.", "h is class width.")]),
  seed("class-10-composite-circle-regions", "Composite Circle Regions", "Class 10", [q("Area of sector with r=7 and theta=90 using pi=22/7 is?", 38.5, "theta/360 x pi r^2.", "90/360 x 22/7 x 49 = 38.5.", undefined, 0.01), q("Segment area equals sector area minus what?", "triangle area", "Segment is curved cap.", "Segment = sector - triangle."), q("Annulus area is pi times what?", "R^2 - r^2", "Subtract inner circle.", "Annulus area = pi(R^2-r^2).")]),
  seed("class-10-combination-solids", "Combined Solids", "Class 10", [q("Combined volume of cylinder 10 and cone 5 is?", 15, "Volumes add.", "10+5=15.", undefined, 0), q("Hidden common faces affect volume or surface area?", "surface area", "Volume still adds.", "Hidden faces are not exposed, so surface area changes."), q("CSA of cylinder uses which dimensions?", "radius and height", "Formula is 2 pi r h.", "It uses radius and height.")]),
  seed("class-10-recasting-solids", "Recasting Solids", "Class 10", [q("In recasting, what quantity stays constant?", "volume", "Material is melted and reshaped.", "Volume before = volume after."), q("If old volume is 60 and new base area is 12, new height is?", 5, "height=volume/base area.", "60/12=5.", undefined, 0), q("Recasting surface area generally stays same: yes or no?", "no", "Shape changes exposed area.", "Volume stays, surface area may change.")]),
  seed("class-10-frustum-cone", "Frustum of a Cone", "Class 10", [q("A frustum has how many circular bases?", 2, "Top and bottom circles.", "A frustum has two circular bases.", undefined, 0), q("If R=4, r=2, h=5, slant height is sqrt of what?", 29, "l^2=(R-r)^2+h^2.", "l^2=2^2+5^2=29.", undefined, 0), q("Frustum volume formula includes R^2 + r^2 plus what?", "Rr", "Remember the mixed product.", "Volume uses R^2+r^2+Rr.")]),
  seed("class-10-heights-distances", "Heights and Distances", "Class 10", [q("For height and ground distance, which trig ratio is usually used?", "tan", "Opposite over adjacent.", "tan theta = height/distance."), q("If distance=10 and tan theta=1, height is?", 10, "height=distance x tan theta.", "10 x 1=10.", undefined, 0), q("Angle of elevation is measured from which line?", "horizontal", "Look from observer's eye line.", "It is measured upward from the horizontal.")]),
];

const class12Seeds: ConceptSeed[] = [
  seed("class-12-relations-functions", "Relations and Functions", "Class 12", [q("A function maps each input to how many outputs?", "one", "Use definition.", "Each input has exactly one image.", ["one", "two", "many", "none"]), q("A one-one and onto function is called what?", "bijective", "Both properties together.", "It is bijective."), q("A relation on A is reflexive if every a is related to what?", "itself", "Pairs (a,a).", "Every element relates to itself.")], 5),
  seed("class-12-determinants", "Determinants", "Class 12", [q("Find det [[2,3],[1,4]].", 5, "ad-bc.", "2x4-3x1=5.", undefined, 0), q("If determinant is 0, inverse exists: yes or no?", "no", "Singular matrix.", "A zero determinant means no inverse."), q("Cramer's rule uses determinants to solve what?", "linear equations", "It solves systems.", "Cramer's rule solves linear systems.")], 5),
  seed("class-12-continuity-differentiability", "Continuity and Differentiability", "Class 12", [q("Differentiability implies continuity: yes or no?", "yes", "A differentiable function cannot jump there.", "Differentiability implies continuity."), q("Continuity always implies differentiability: yes or no?", "no", "Think corner.", "A corner can be continuous but not differentiable."), q("For continuity at a, LHL and RHL must equal what?", "f(a)", "Limit must match value.", "LHL=RHL=f(a).")], 5),
  seed("class-12-integration-methods", "Integration Methods", "Class 12", [q("Integral of 2x is?", "x^2 + C", "Reverse derivative.", "d/dx x^2 = 2x."), q("Integration by parts is often written with which two letters?", "u and v", "Choose u and dv.", "It splits product into u and v."), q("Definite integral gives signed what under curve?", "area", "Geometric meaning.", "It gives signed area.")], 5),
  seed("class-12-differential-equations", "Differential Equations", "Class 12", [q("Order of dy/dx = y is?", 1, "Highest derivative order.", "dy/dx is first order.", undefined, 0), q("A particular solution needs what extra condition?", "initial condition", "Choose one curve from family.", "An initial condition fixes the constant."), q("Degree is defined only when equation is polynomial in what?", "derivatives", "Remove radicals/fractions of derivatives first.", "Degree is power of highest derivative when polynomial.")], 5),
  seed("class-12-vectors-3d-geometry", "Vectors and 3D Geometry", "Class 12", [q("Dot product of perpendicular vectors is?", 0, "cos 90 = 0.", "a dot b = |a||b|cos90 = 0.", undefined, 0), q("Cross product magnitude measures what area?", "parallelogram", "It is |a||b|sin theta.", "It measures parallelogram area."), q("Direction cosines satisfy l^2+m^2+n^2 equals?", 1, "Unit direction vector.", "The sum of squares is 1.", undefined, 0)]),
  seed("class-12-bayes-theorem", "Bayes Theorem", "Class 12", [q("Bayes theorem computes posterior P(A|E) from prior and what?", "evidence", "Condition on observed evidence.", "It updates belief after evidence."), q("If P(A)=0.5 and P(E|A)=0.8 and P(E)=0.4, P(A|E) is?", 1, "Multiply then divide by evidence.", "0.5x0.8/0.4=1.", undefined, 0.001), q("False positives can make posterior lower: yes or no?", "yes", "Evidence may be less reliable.", "A high false-positive rate weakens evidence.")], 5),
  seed("class-12-linear-programming", "Linear Programming", "Class 12", [q("A linear objective over a bounded feasible region is optimized at what?", "corner", "Corner point theorem.", "Check corner points."), q("For Z=3x+2y at (2,5), find Z.", 16, "Substitute.", "6+10=16.", undefined, 0), q("Feasible region is made by intersecting what?", "half-planes", "Each inequality shades a side.", "Linear inequalities form half-planes.")], 5),
  seed("class-12-inverse-trig", "Inverse Trigonometric Functions", "Class 12", [q("sin^-1(1/2) principal value is?", "pi/6", "Use principal range.", "sin(pi/6)=1/2."), q("sin^-1(x)+cos^-1(x) equals?", "pi/2", "Complementary identity.", "The principal values sum to pi/2."), q("Why restrict range for inverse trig?", "to make it a function", "Original trig is many-one.", "Restriction gives one output per input.")], 5),
];

export const ncertPracticeBank: NCERTPracticeItem[] = [
  ...grade7Seeds.flatMap(expandSeed),
  ...class10Seeds.flatMap(expandSeed),
  ...class12Seeds.flatMap(expandSeed),
];

export function getNCERTPracticeItems(conceptId: string): NCERTPracticeItem[] {
  return ncertPracticeBank.filter((item) => item.conceptId === conceptId);
}

export function hasNCERTPracticeBank(conceptId: string) {
  return getNCERTPracticeItems(conceptId).length > 0;
}

function seed(conceptId: string, title: string, classLevel: ConceptSeed["classLevel"], facts: ConceptSeed["facts"], minCount = classLevel === "Class 12" ? 5 : 8): ConceptSeed {
  return { conceptId, title, classLevel, minCount, facts };
}

function q(
  prompt: string,
  answer: number | string | string[],
  hint: string,
  explanation: string,
  choices?: string[],
  tolerance?: number,
  commonMistakes?: NCERTPracticeItem["commonMistakes"],
): ConceptSeed["facts"][number] {
  return {
    prompt,
    answer,
    answerType: choices ? "multiple-choice" : typeof answer === "number" ? "numeric" : "text",
    choices,
    tolerance,
    hint,
    explanation,
    commonMistakes,
  };
}

function expandSeed(seedItem: ConceptSeed): NCERTPracticeItem[] {
  const base = seedItem.facts.map((fact, index): NCERTPracticeItem => ({
    id: `${seedItem.conceptId}-bank-${index + 1}`,
    conceptId: seedItem.conceptId,
    difficulty: index === 0 ? "easy" : index === 1 ? "medium" : "exam",
    prompt: fact.prompt,
    answer: fact.answer,
    answerType: fact.answerType ?? (fact.choices ? "multiple-choice" : typeof fact.answer === "number" ? "numeric" : "text"),
    choices: fact.choices,
    tolerance: fact.tolerance,
    hint: fact.hint,
    explanation: fact.explanation,
    commonMistakes: fact.commonMistakes,
    tags: [seedItem.classLevel, seedItem.title, ...(fact.tags ?? [])],
  }));

  const generated: NCERTPracticeItem[] = [];
  for (let index = base.length; index < seedItem.minCount; index += 1) {
    const source = base[index % base.length];
    generated.push({
      ...source,
      id: `${seedItem.conceptId}-variant-${index + 1}`,
      difficulty: index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "exam",
      prompt: `Variant ${index - base.length + 1}: ${source.prompt}`,
      explanation: `${source.explanation} This variant checks the same NCERT idea with the same validated answer format.`,
      tags: [...(source.tags ?? []), "generated-variant"],
    });
  }
  return [...base, ...generated];
}
