export type CurriculumTag = { board: string; code: string; label: string };

export type DailyChallenge = {
  prompt: string;
  choices: string[];
  expected: string;
  lab: string;
  route: string;
};

export const glossary: Array<{ term: string; meaning: string }> = [
  { term: "multiplicity", meaning: "How many times a root appears. Even multiplicity touches; odd multiplicity crosses." },
  { term: "RREF", meaning: "Reduced row-echelon form of a matrix. Unique, none, or infinite solutions are readable from the rows." },
  { term: "extraneous", meaning: "A candidate that appears while solving but fails the original equation or domain." },
  { term: "identity", meaning: "An equation true for all allowed values, or the group element e with e*a = a." },
  { term: "monoid", meaning: "A closed associative operation that has an identity element." },
  { term: "hole", meaning: "A cancelled factor in a rational function: excluded from the domain but not a vertical asymptote." },
];

export const curriculumByLab: Record<string, CurriculumTag[]> = {
  expressions: [{ board: "NCERT", code: "Class 8", label: "Algebraic expressions" }, { board: "CCSS", code: "A-SSE", label: "See structure in expressions" }],
  equations: [{ board: "NCERT", code: "Class 8–10", label: "Linear and quadratic equations" }, { board: "CCSS", code: "A-REI", label: "Reasoning with equations" }],
  functions: [{ board: "NCERT", code: "Class 11", label: "Relations and functions" }, { board: "CCSS", code: "F-BF", label: "Building functions" }],
  polynomials: [{ board: "NCERT", code: "Class 10", label: "Polynomials" }, { board: "CCSS", code: "A-APR", label: "Polynomials and remainders" }],
  systems: [{ board: "NCERT", code: "Class 10", label: "Pair of linear equations" }, { board: "CCSS", code: "A-REI.C", label: "Systems of equations" }],
  exponents: [{ board: "NCERT", code: "Class 9–11", label: "Exponents, radicals, logs" }, { board: "CCSS", code: "F-LE", label: "Exponential and log models" }],
  sequences: [{ board: "NCERT", code: "Class 11", label: "Sequences and series" }, { board: "CCSS", code: "F-IF", label: "Sequences as functions" }],
  structures: [{ board: "Undergrad", code: "Abstract", label: "Groups, lattices, Boolean algebra" }],
  proof: [{ board: "NCERT", code: "Class 9+", label: "Identities and proof" }, { board: "CCSS", code: "A-APR.C", label: "Prove polynomial identities" }],
  cas: [{ board: "Studio", code: "Check", label: "Candidate verification, not a CAS language" }],
  advanced: [{ board: "Studio", code: "ALG-01–25", label: "Linked algebra tools" }],
};

export const dailyChallenges: DailyChallenge[] = [
  { prompt: "Simplify 2(x + 3) − (x − 1)", choices: ["x + 7", "2x + 5", "3x + 7", "x + 5"], expected: "2*(x+3)-(x-1)", lab: "Expressions", route: "/algebra/expressions" },
  { prompt: "Solve 3x + 5 = 2x − 1", choices: ["x = −6", "x = 6", "x = −4", "no solution"], expected: "-6", lab: "Equations", route: "/algebra/equations" },
  { prompt: "If f(x)=x², what is a, h, k for 2(x−3)²+1?", choices: ["2, 3, 1", "2, −3, 1", "1, 3, 2", "2, 3, −1"], expected: "2, 3, 1", lab: "Functions", route: "/algebra/functions?mode=Transformations" },
  { prompt: "Even degree and positive leading coefficient: ends?", choices: ["both rise", "both fall", "left up right down", "left down right up"], expected: "both rise", lab: "Polynomials", route: "/algebra/polynomials?mode=End+Behavior" },
  { prompt: "Two distinct parallel lines have", choices: ["one solution", "no solution", "infinitely many", "three solutions"], expected: "no solution", lab: "Systems", route: "/algebra/systems" },
  { prompt: "Which is an exponent law?", choices: ["a^m · a^n = a^(m+n)", "a^m + a^n = a^(m+n)", "a^m · a^n = a^(mn)", "a^m + a^n = a^(mn)"], expected: "a^m · a^n = a^(m+n)", lab: "Exponents & Logs", route: "/algebra/exponents-logs" },
  { prompt: "a_n = 3 + (n−1)·4. What is a_20?", choices: ["79", "80", "76", "83"], expected: "79", lab: "Sequences", route: "/algebra/sequences" },
  { prompt: "(a+b)² equals", choices: ["a²+2ab+b²", "a²+b²", "a²−2ab+b²", "2ab"], expected: "a^2+2*a*b+b^2", lab: "Algebraic Proof", route: "/algebra/proof" },
];

export function challengeOfTheDay(now = Date.now()) {
  const day = Math.floor(now / 86_400_000);
  return dailyChallenges[day % dailyChallenges.length] ?? dailyChallenges[0]!;
}

export const navGroups: Array<{ id: string; label: string; ids: string[] }> = [
  { id: "start", label: "Start", ids: ["home"] },
  { id: "build", label: "Build", ids: ["expressions"] },
  { id: "solve", label: "Solve", ids: ["equations", "systems"] },
  { id: "analyze", label: "Analyze", ids: ["functions", "polynomials", "exponents", "sequences"] },
  { id: "prove", label: "Prove", ids: ["proof", "structures"] },
  { id: "check", label: "Check", ids: ["cas", "advanced"] },
];

export const workbenchTools: Array<{ id: string; title: string; lab: string; goal: string; misuse: string }> = [
  { id: "ALG-01", title: "1. Signed algebra tiles", lab: "expressions", goal: "See ax²+bx+c as signed tiles.", misuse: "Color is not the only sign cue." },
  { id: "ALG-02", title: "2. Zero-pair cancellation", lab: "expressions", goal: "Cancel +n with −n.", misuse: "Cancelling unlike terms is not a zero pair." },
  { id: "ALG-03", title: "3. Distributive area model", lab: "expressions", goal: "Four products from a binomial pair.", misuse: "Do not add the binomials instead of multiplying." },
  { id: "ALG-04", title: "4. Integer factorization", lab: "expressions", goal: "Find integer binomials when they exist.", misuse: "Not every quadratic factors over the integers." },
  { id: "ALG-05", title: "5. Arbitrary linear balance", lab: "equations", goal: "Solve ax+b = cx+d including all/none.", misuse: "Dividing by zero is not a legal balance move." },
  { id: "ALG-06", title: "6. Inequality sign reversal", lab: "equations", goal: "Flip the sign when scaling by a negative.", misuse: "Forgetting the flip reverses the solution ray." },
  { id: "ALG-07", title: "7. Absolute-value branches", lab: "equations", goal: "Two linear pieces when the right side is nonnegative.", misuse: "|expr| = negative has no real solution." },
  { id: "ALG-08", title: "8. Complete the square", lab: "equations", goal: "Rewrite as a(x−h)²+k.", misuse: "h is −b/(2a), not b/2." },
  { id: "ALG-09", title: "9. Rational excluded values", lab: "functions", goal: "List holes vs vertical asymptotes.", misuse: "Cancelled factors are holes, not asymptotes." },
  { id: "ALG-10", title: "10. Radical extraneous-root check", lab: "equations", goal: "Substitute candidates back into √t = |a|.", misuse: "Squaring can introduce extra roots." },
  { id: "ALG-11", title: "11. Function composition", lab: "functions", goal: "Compare f∘g and g∘f at x.", misuse: "Order matters; they are not the same map." },
  { id: "ALG-12", title: "12. Inverse linear function", lab: "functions", goal: "Invert y = ax+b when a ≠ 0.", misuse: "A constant function has no inverse." },
  { id: "ALG-13", title: "13. Piecewise domain editor", lab: "functions", goal: "Evaluate the matching piece, including endpoints.", misuse: "A value can miss every piece." },
  { id: "ALG-14", title: "14. Roots ↔ coefficients", lab: "polynomials", goal: "Build the monic polynomial from roots a, b, c.", misuse: "Leading coefficient is not always 1 in the lab scale." },
  { id: "ALG-15", title: "15. Complex polynomial roots", lab: "polynomials", goal: "Show conjugate pairs when D < 0.", misuse: "Complex roots are not x-intercepts of the real graph." },
  { id: "ALG-16", title: "16. Synthetic division", lab: "polynomials", goal: "Divide by (x−x₀) and read the remainder.", misuse: "The divisor root is x₀ in (x−x₀), not −x₀." },
  { id: "ALG-17", title: "17. Holes and asymptotes", lab: "polynomials", goal: "Horizontal asymptote from degree comparison.", misuse: "Equal degree uses the leading-coefficient ratio." },
  { id: "ALG-18", title: "18. 3×3 row elimination", lab: "systems", goal: "Recover the intended solution (a, b, c).", misuse: "A singular system has no unique triple." },
  { id: "ALG-19", title: "19. Nonlinear intersections", lab: "systems", goal: "Intersect the parabola with y = x.", misuse: "Graphing window can miss roots outside [−10, 10]." },
  { id: "ALG-20", title: "20. Exponent-law counterexample", lab: "exponents", goal: "Show a^m + a^n is not a^(m+n).", misuse: "Adding exponents only applies to products of powers." },
  { id: "ALG-21", title: "21. Change of logarithm base", lab: "exponents", goal: "log_b v = log_c v / log_c b.", misuse: "Bases must be positive and not 1; argument positive." },
  { id: "ALG-22", title: "22. Sequence-family comparison", lab: "sequences", goal: "Arithmetic vs geometric vs recursive from the same a, b.", misuse: "The recursive family here is repeated addition, not Fibonacci." },
  { id: "ALG-23", title: "23. Sigma closed form", lab: "sequences", goal: "S_n = n/2 (2a+(n−1)d).", misuse: "n must be a positive integer count." },
  { id: "ALG-24", title: "24. Proof-step counterexample checker", lab: "proof", goal: "Sample two expressions and name a failing x.", misuse: "Agreement on a few samples is not a proof." },
  { id: "ALG-25", title: "25. CAS candidate verification", lab: "cas", goal: "Check real roots of at²+bt+c=0 by residual.", misuse: "Always substitute into the original polynomial." },
];

export const misconceptions: Array<{ id: string; lab: string; mistake: string; repair: string }> = [
  { id: "sign-drop", lab: "expressions", mistake: "Dropping the minus when distributing −(x+3).", repair: "Distribute to both terms: −x − 3." },
  { id: "unlike-terms", lab: "expressions", mistake: "Adding x² to x.", repair: "Only like powers combine." },
  { id: "inequality-flip", lab: "equations", mistake: "Forgetting to flip when multiplying by a negative.", repair: "Multiply 2 > 1 by −1 to see −2 < −1." },
  { id: "extraneous", lab: "equations", mistake: "Keeping a squared extra root.", repair: "Substitute into the original equation or domain." },
  { id: "exponent-add", lab: "exponents", mistake: "Writing a^m + a^n as a^(m+n).", repair: "Addition of exponents is for products of powers." },
];

export const vignettes: Record<string, string> = {
  expressions: "Garden plots: x² is the square bed, x strips are borders, units are leftover pavers.",
  equations: "Break-even: cost ax+b meets revenue cx+d at the same x the scale solves.",
  functions: "Temperature conversion is a linear family y = a(x − h) + k.",
  polynomials: "A profit polynomial is only meaningful on a shaded feasible interval of x.",
  systems: "Two prices / two mixtures: the intersection is the unique mix that fits both totals.",
  exponents: "Cooling and compound interest use the same a^x with 0 < a < 1 or a > 1.",
  sequences: "Stadium seats (arithmetic) and a bouncing ball (geometric |r|<1).",
  structures: "Clock arithmetic (ℤₙ) is the first finite group students can fill in a table.",
  proof: "Area of a square is the visual of (a+b)² before the two-column write-up.",
  cas: "A candidate root is a check against the original polynomial, not a new CAS language.",
  advanced: "Shared a, b, c, x let a class compare twenty-five tools on one parameter pack.",
};

export const firstTryHelp: Record<string, string> = {
  Simplify: "Try first: click +x twice, then Cancel a zero pair. Watch the live polynomial.",
  Expand: "Try first: expand (x-1)*(x+2) and match the four area cells.",
  Factor: "Try first: build x²+x−2, then Factor. Send tiles to Group A and B.",
  "Combine Terms": "Try first: add +2x and −x, then read the combined x coefficient.",
  Linear: "Try first: Subtract 2x from both sides of 3x+5=2x−1, then isolate x.",
  Quadratic: "Try first: switch methods on x²−5x+6 and compare the three writings.",
  "Absolute Value": "Try first: set the right side negative and watch “no solution.”",
  Inequalities: "Try first: multiply by −1 and watch the ray flip.",
  Families: "Try first: change h and watch the graph slide without changing shape.",
  Transformations: "Try first: drag the green (h,k) handle, then the stretch handle.",
  Composition: "Try first: toggle f∘g vs g∘f at the same probe x.",
  Inverse: "Try first: pick x² and read why the inverse needs a restricted domain.",
  Piecewise: "Try first: move the boundary h across the probe x.",
  Roots: "Try first: set two roots equal and watch a bounce.",
  Factors: "Try first: read (x−r) factors next to the graph intercepts.",
  Division: "Try first: divide by a known root and check remainder 0.",
  "End Behavior": "Try first: flip the leading coefficient sign.",
  Multiplicity: "Try first: duplicate a root slot.",
  Graphing: "Try first: Unique, then None, then Infinite presets.",
  Substitution: "Try first: substitute the first y into the second line.",
  Elimination: "Try first: subtract the aligned x−y forms.",
  Matrices: "Try first: Swap rows, then read RREF vs the graph.",
  "Exponent Laws": "Try first: Product, then the sum counterexample.",
  Radicals: "Try first: √72 with index 2 and read the simplified square.",
  "Exponential & Logs": "Try first: base 2 vs 1/2 on the inverse graphs.",
  Equations: "Try first: solve 2^x = 8 and match the log.",
  Arithmetic: "Try first: change the common difference and watch a_20.",
  Geometric: "Try first: |r|<1 and read S∞ vs the finite sum.",
  Recursive: "Try first: switch Fibonacci vs arithmetic recurrence.",
  Sigma: "Try first: compare the table of S_n with the closed form.",
  Patterns: "Try first: read first and second differences.",
  Identities: "Try first: drop Distributive Property on the expanded line.",
  "Equation Proof": "Try first: import the idea “same operation on both sides.”",
  Induction: "Try first: check the base staircase at n=1, then increase n.",
  Inequality: "Try first: set a=b for equality in AM-style rearrangement.",
  Counterexample: "Try first: a=2, b=3 and read 25 ≠ 13.",
  Solve: "Try first: solve 2x^2-8x-10=0, then check a candidate residual.",
  Substitute: "Try first: substitute x=2 into 2x^2-8x-10.",
  Differentiate: "Try first: differentiate x^2 and compare the difference quotient.",
};
