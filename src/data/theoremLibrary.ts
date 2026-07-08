import { algebraProofDrafts } from "./theorems/algebraProofDrafts";
import { coordinateCalculusProofDrafts } from "./theorems/coordinateCalculusProofDrafts";
import { geometryProofDrafts } from "./theorems/geometryProofDrafts";
import { linearAlgebraProofDrafts } from "./theorems/linearAlgebraProofDrafts";
import { trigonometryProofDrafts } from "./theorems/trigonometryProofDrafts";

export type TheoremLibraryItem = {
  slug: string;
  title: string;
  subtopic: string;
  statement: string;
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
    whyItMatters: `${title} is a reusable result for ${subtopic.toLowerCase()} problems in ${categoryTitle}.`,
    proofPlan: proofDraft
      ? "Step-by-step draft proof is available below. A future visual phase can convert each step into an interactive diagram."
      : "A guided proof scaffold is available below. It explains the setup, key idea, conclusion, and checks; a future phase can replace it with a fully specialized visual proof.",
    proofStatus: proofDraft ? "draft-ready" : "scaffold-ready",
    prerequisites,
    ...proofScaffold,
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
    `${title} connects the definitions in ${subtopic.toLowerCase()} to a reusable result. This scaffold gives students a reliable route through the proof idea before a custom visual proof is built.`,
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
  ...algebraProofDrafts,
  ...coordinateCalculusProofDrafts,
  ...geometryProofDrafts,
  ...linearAlgebraProofDrafts,
  ...trigonometryProofDrafts,
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
    "A quadratic residue is any remainder produced by a square; the proof scaffold compares square pairs x and -x modulo p.",
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
  ]),
];

export const theoremCategoryCount = theoremCategories.length;
export const theoremCount = theoremCategories.reduce((sum, categoryItem) => sum + categoryItem.theorems.length, 0);
