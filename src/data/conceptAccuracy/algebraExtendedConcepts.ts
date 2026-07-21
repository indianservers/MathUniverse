import { compactConcept } from "./conceptFactory";
import type { CompactConceptSeed } from "./conceptFactory";

const common = (seed: CompactConceptSeed) => compactConcept(seed);

export const algebraExtendedConcepts = [
  common({
    id: "algebra.expressions-identities",
    domain: "algebra",
    title: "Expressions and algebraic identities",
    level: "Foundational",
    precise:
      "An expression denotes a value; an identity is an equality true for every value in its stated domain.",
    learner:
      "Simplify without changing value, and distinguish an always-true identity from an equation to solve.",
    prerequisites: ["arithmetic", "variables"],
    nextConcepts: ["polynomials", "equations"],
    grade: "7-9",
    chapter: "Algebraic Expressions and Identities",
    notation: [
      { symbol: "x", meaning: "variable" },
      { symbol: "≡", meaning: "identity" },
    ],
    assumptions: [
      "Like terms have identical variable parts.",
      "Identity domains exclude undefined expressions.",
    ],
    domainStatement: "All real substitutions for which both sides are defined.",
    formula: "(a+b)^2=a^2+2ab+b^2",
    formulaConditions: ["a and b are real numbers"],
    invariants: [
      "Equivalent expressions agree under every valid substitution.",
      "Combining like terms preserves value.",
    ],
    oracle:
      "Expand both sides to canonical polynomial form and compare coefficients.",
    properties: [
      "addition is commutative",
      "multiplication distributes over addition",
    ],
    cases: {
      foundational: ["Simplify 3x+2x-4.", "5x-4", "Only the x-terms combine."],
      visual: [
        "Interpret (a+b)^2 as area.",
        "a²+2ab+b²",
        "Partition the square into one a², two ab, and one b² regions.",
      ],
      realWorld: [
        "Write the cost of x pens at Rs 12 plus a Rs 30 fee.",
        "12x+30",
        "Variable cost plus fixed cost.",
      ],
      misconception: [
        "Is (a+b)²=a²+b²?",
        "No",
        "The two cross rectangles contribute 2ab.",
      ],
      boundary: [
        "Evaluate the identity when b=0.",
        "a²=a²",
        "The cross and b² terms vanish.",
      ],
      challenge: [
        "Expand (2x-3)².",
        "4x²-12x+9",
        "Apply the identity with a=2x and b=-3.",
      ],
      connection: [
        "Connect expansion to quadratics.",
        "It gives vertex-to-standard form.",
        "Expanding (x-h)²+k produces a quadratic polynomial.",
      ],
    },
    misconceptions: [
      {
        claim: "Unlike terms can be combined.",
        correction: "Only identical variable parts combine by addition.",
        counterexample: "2x+3x² is not 5x³.",
      },
      {
        claim: "An identity has one solution.",
        correction: "It holds for all values in its domain.",
        counterexample: "2(x+1)=2x+2 for every real x.",
      },
    ],
    sourceSection: "Algebraic Expressions and Identities",
  }),
  common({
    id: "algebra.inequalities",
    domain: "algebra",
    title: "Linear inequalities",
    precise:
      "An inequality compares ordered quantities and its solution is a set of values that makes the comparison true.",
    learner:
      "Solve like an equation, but reverse the sign when multiplying or dividing by a negative number.",
    prerequisites: ["signed numbers", "linear equations"],
    nextConcepts: ["intervals", "optimization"],
    grade: "8-11",
    chapter: "Linear Inequalities",
    notation: [{ symbol: "<,≤", meaning: "strict and inclusive order" }],
    assumptions: [
      "Order is over real numbers.",
      "Division by zero is forbidden.",
    ],
    domainStatement: "Real values satisfying every stated inequality.",
    formula: "a<b\\Rightarrow ac>bc\\quad(c<0)",
    formulaConditions: ["a,b,c are real", "c is negative"],
    invariants: [
      "Testing an interior solution returns true.",
      "A strict endpoint is excluded.",
    ],
    oracle:
      "Solve symbolically, then test endpoints and one point from each interval.",
    properties: [
      "adding the same value preserves order",
      "negative scaling reverses order",
    ],
    cases: {
      foundational: [
        "Solve 2x+3≤9.",
        "x≤3",
        "Subtract 3 and divide by positive 2.",
      ],
      visual: [
        "Show x>-1 on a number line.",
        "Open dot at -1, ray right",
        "Strict inequality excludes the endpoint.",
      ],
      realWorld: [
        "A lift holds at most 600 kg; 75 kg riders.",
        "At most 8 riders",
        "75n≤600 and n is a nonnegative integer.",
      ],
      misconception: [
        "Solve -2x<6 without reversing the sign.",
        "x>-3",
        "Division by -2 reverses the order.",
      ],
      boundary: ["Does x<4 include 4?", "No", "The relation is strict."],
      challenge: [
        "Solve -3≤2x+1<7.",
        "-2≤x<3",
        "Apply each operation to all three parts.",
      ],
      connection: [
        "Connect inequalities to feasible regions.",
        "Each inequality selects a half-plane.",
        "Their intersection is the feasible set in linear programming.",
      ],
    },
    misconceptions: [
      {
        claim: "The sign never changes.",
        correction:
          "It reverses under multiplication or division by a negative.",
        counterexample: "1<2 but -1>-2.",
      },
      {
        claim: "Every endpoint is included.",
        correction: "Only ≤ or ≥ includes equality.",
        counterexample: "x<2 rejects x=2.",
      },
    ],
    sourceSection: "Linear Inequalities",
  }),
  common({
    id: "algebra.polynomials",
    domain: "algebra",
    title: "Polynomials and factor theorem",
    precise:
      "A polynomial is a finite sum of nonnegative integer powers; r is a zero exactly when (x-r) is a factor.",
    learner:
      "Coefficients and powers build a polynomial; its zeros are where its graph meets the x-axis.",
    prerequisites: ["expressions", "exponents"],
    nextConcepts: ["rational functions", "calculus"],
    grade: "9-11",
    chapter: "Polynomials",
    notation: [
      { symbol: "P(x)", meaning: "polynomial value" },
      { symbol: "deg P", meaning: "highest nonzero exponent" },
    ],
    assumptions: [
      "Exponents are nonnegative integers.",
      "The leading coefficient is nonzero.",
    ],
    domainStatement: "A real polynomial is defined for every real x.",
    formula: "P(r)=0\\iff(x-r)\\mid P(x)",
    formulaConditions: ["P is a polynomial"],
    invariants: [
      "Division reconstruction is dividend=divisor×quotient+remainder.",
      "Remainder on division by x-r equals P(r).",
    ],
    oracle: "Horner evaluation plus polynomial long-division reconstruction.",
    properties: [
      "degree of a product adds",
      "a degree n polynomial has at most n distinct real zeros",
    ],
    cases: {
      foundational: ["Evaluate x²-3x+2 at x=2.", "0", "4-6+2=0."],
      visual: [
        "What does a zero look like?",
        "An x-axis intersection or touch",
        "There P(x)=0.",
      ],
      realWorld: [
        "Model a box volume x(x+2)(x+4).",
        "x³+6x²+8x",
        "Multiply the three dimensions.",
      ],
      misconception: [
        "Is 1/x a polynomial term?",
        "No",
        "It is x⁻¹, with a negative exponent.",
      ],
      boundary: [
        "What is the degree of nonzero constant 7?",
        "0",
        "Its only power is x⁰.",
      ],
      challenge: [
        "Factor x³-4x²+x+6 given root 2.",
        "(x-2)(x-3)(x+1)",
        "Divide by x-2, then factor the quotient.",
      ],
      connection: [
        "Connect repeated zeros to graphs.",
        "Even multiplicity touches; odd crosses",
        "The sign changes only for odd multiplicity.",
      ],
    },
    misconceptions: [
      {
        claim: "Any expression in x is a polynomial.",
        correction: "Powers must be nonnegative integers.",
        counterexample: "sqrt(x) and 1/x are not polynomials.",
      },
      {
        claim: "Degree counts terms.",
        correction: "Degree is the greatest exponent with nonzero coefficient.",
        counterexample: "x⁷+1 has two terms but degree 7.",
      },
    ],
    sourceSection: "Polynomials",
  }),
  common({
    id: "algebra.sequences-series",
    domain: "algebra",
    title: "Sequences and series",
    precise:
      "A sequence is an ordered function on positive integers; a series is a sum of its terms.",
    learner: "A sequence lists terms by position; a series adds them.",
    prerequisites: ["patterns", "linear expressions"],
    nextConcepts: ["limits", "power series"],
    grade: "10-11",
    chapter: "Sequences and Series",
    notation: [
      { symbol: "a_n", meaning: "nth term" },
      { symbol: "S_n", meaning: "sum of first n terms" },
    ],
    assumptions: [
      "n is a positive integer.",
      "Infinite sums require a convergence statement.",
    ],
    domainStatement: "n∈{1,2,3,…}; parameters must keep denominators defined.",
    formula: "S_n=\\frac n2[2a+(n-1)d]",
    formulaConditions: ["arithmetic progression", "n is positive integer"],
    invariants: ["a_{n+1}-a_n=d for an AP.", "S_n-S_{n-1}=a_n."],
    oracle:
      "Generate terms directly and compare their finite sum with the closed form.",
    properties: ["AP has constant difference", "GP has constant nonzero ratio"],
    cases: {
      foundational: ["Find a₁₀ for 3,7,11,…", "39", "a+9d=3+36."],
      visual: [
        "Plot an AP against n.",
        "Collinear points",
        "a_n is linear in n.",
      ],
      realWorld: [
        "Save Rs 100 more each month starting at Rs 500.",
        "Month n: 500+100(n-1)",
        "Savings deposits form an AP.",
      ],
      misconception: [
        "Are sequence and series synonyms?",
        "No",
        "One lists terms; the other sums them.",
      ],
      boundary: ["Find S₁.", "a", "A one-term sum is its first term."],
      challenge: ["Sum 5+8+…+62.", "703", "There are 20 terms; use n(a+l)/2."],
      connection: [
        "Connect geometric series to compound growth.",
        "Repeated multiplication creates a GP.",
        "Each period scales the prior amount by a fixed ratio.",
      ],
    },
    misconceptions: [
      {
        claim: "A sequence is unordered.",
        correction: "Position is essential.",
        counterexample: "1,2,3 differs from 3,2,1.",
      },
      {
        claim: "Every infinite series has a finite sum.",
        correction: "Only convergent series do.",
        counterexample: "1+1+1+… diverges.",
      },
    ],
    sourceSection: "Sequences and Series",
  }),
  common({
    id: "algebra.structures",
    domain: "algebra",
    title: "Algebraic structures and operations",
    level: "Advanced",
    precise:
      "An algebraic structure is a set equipped with operations satisfying stated axioms such as closure, associativity, identity, and inverses.",
    learner:
      "The rules an operation obeys determine what kind of number system or symmetry system it forms.",
    prerequisites: ["sets", "operations"],
    nextConcepts: ["groups", "linear algebra"],
    grade: "11-12 enrichment",
    chapter: "Sets and Binary Operations",
    notation: [
      { symbol: "(S,*)", meaning: "set with a binary operation" },
      { symbol: "e", meaning: "identity element" },
    ],
    assumptions: [
      "The operation is explicitly defined.",
      "Closure is tested within the named set.",
    ],
    domainStatement: "Inputs and outputs belong to the carrier set S.",
    formula: "a*e=e*a=a",
    formulaConditions: ["e is a two-sided identity", "a belongs to S"],
    invariants: [
      "A valid operation is closed on S.",
      "An identity, if it exists, is unique.",
    ],
    oracle:
      "Enumerate the finite operation table or verify axioms symbolically.",
    properties: [
      "associativity is not commutativity",
      "inverses are relative to the operation",
    ],
    cases: {
      foundational: [
        "Is integer addition closed?",
        "Yes",
        "The sum of two integers is an integer.",
      ],
      visual: [
        "Read an operation table.",
        "Each cell is a*b",
        "Rows and columns encode ordered inputs.",
      ],
      realWorld: [
        "Model clock arithmetic under addition mod 12.",
        "A cyclic group",
        "Adding hours stays among 12 positions.",
      ],
      misconception: [
        "Does closure imply associativity?",
        "No",
        "They are independent properties.",
      ],
      boundary: [
        "Can an empty set have a binary operation?",
        "There is an empty function S×S→S",
        "But group axioms fail because no identity exists.",
      ],
      challenge: [
        "Find the identity for a*b=a+b+1 on reals.",
        "-1",
        "Solve a*e=a, so a+e+1=a.",
      ],
      connection: [
        "Connect groups to symmetry.",
        "Composing symmetries forms a group.",
        "Closure, identity, inverses, and associativity all hold.",
      ],
    },
    misconceptions: [
      {
        claim: "Associative means commutative.",
        correction:
          "Associativity changes grouping; commutativity changes order.",
        counterexample:
          "Matrix multiplication is associative but generally not commutative.",
      },
      {
        claim: "An inverse is always a reciprocal.",
        correction: "It depends on the operation.",
        counterexample: "The additive inverse of 5 is -5.",
      },
    ],
    sourceSection: "Binary Operations",
  }),
  common({
    id: "algebra.boolean",
    domain: "algebra",
    title: "Boolean algebra and logic",
    precise:
      "Boolean algebra operates on truth values with NOT, AND, and OR, governed by logical identities.",
    learner: "Combine true/false conditions and verify them with truth tables.",
    prerequisites: ["sets", "statements"],
    nextConcepts: ["digital logic", "probability events"],
    grade: "9-12 enrichment",
    chapter: "Mathematical Reasoning",
    notation: [
      { symbol: "¬p", meaning: "NOT p" },
      { symbol: "p∧q", meaning: "p AND q" },
      { symbol: "p∨q", meaning: "p OR q" },
    ],
    assumptions: [
      "Each proposition has one of two truth values.",
      "OR is inclusive unless stated otherwise.",
    ],
    domainStatement: "p,q∈{false,true}.",
    formula: "\\neg(p\\land q)=(\\neg p)\\lor(\\neg q)",
    formulaConditions: ["classical two-valued logic"],
    invariants: [
      "Equivalent formulas have identical truth-table columns.",
      "p∨¬p is always true.",
    ],
    oracle: "Enumerate all 2^n truth assignments and compare outputs.",
    properties: [
      "AND and OR are commutative",
      "De Morgan laws swap AND/OR under NOT",
    ],
    cases: {
      foundational: [
        "Evaluate true AND false.",
        "false",
        "AND needs both inputs true.",
      ],
      visual: [
        "Represent p AND q in a Venn diagram.",
        "The intersection",
        "Both conditions hold only in the overlap.",
      ],
      realWorld: [
        "Door opens with card AND PIN.",
        "Both must pass",
        "This is conjunction.",
      ],
      misconception: [
        "Does OR mean exactly one?",
        "Not in inclusive Boolean OR",
        "true OR true is true.",
      ],
      boundary: ["Evaluate NOT true.", "false", "NOT flips the truth value."],
      challenge: ["Simplify p∨(p∧q).", "p", "Absorption law."],
      connection: [
        "Connect Boolean algebra to circuits.",
        "AND/OR/NOT map to logic gates.",
        "Truth tables predict circuit output.",
      ],
    },
    misconceptions: [
      {
        claim: "OR always excludes both.",
        correction: "Standard Boolean OR is inclusive.",
        counterexample: "true∨true=true.",
      },
      {
        claim: "¬(p∧q)=¬p∧¬q.",
        correction: "De Morgan changes AND to OR.",
        counterexample: "For p=true,q=false, the claimed sides differ.",
      },
    ],
    sourceSection: "Mathematical Reasoning",
  }),
];
