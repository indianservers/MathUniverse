import { compactConcept } from "./conceptFactory";

export const numberSystemExtendedConcepts = [
  compactConcept({
    id: "number.real-hierarchy",
    domain: "number-systems",
    title: "Natural, whole, integer and real-number hierarchy",
    level: "Foundational",
    precise:
      "Under the stated convention, natural numbers are positive counting numbers, whole numbers add zero, integers add negatives, rationals are integer ratios, and reals combine rationals and irrationals.",
    learner:
      "Number sets nest inside one another; classify a number in the smallest set that contains it.",
    prerequisites: ["counting", "fractions"],
    nextConcepts: ["rational numbers", "real line"],
    grade: "6-9",
    chapter: "Number Systems",
    notation: [{ symbol: "N⊂W⊂Z⊂Q⊂R", meaning: "nested number sets" }],
    assumptions: [
      "This app uses N={1,2,3,…}; some texts include 0 and must state that convention.",
      "Classification asks for the smallest named set.",
    ],
    domainStatement:
      "Real-number classification; complex numbers are outside this Phase 1 hierarchy.",
    formula:
      "\\mathbb N\\subset\\mathbb W\\subset\\mathbb Z\\subset\\mathbb Q\\subset\\mathbb R",
    formulaConditions: ["N excludes zero in the stated app convention"],
    invariants: [
      "Membership propagates to every containing set.",
      "Every real number is rational or irrational, never both.",
    ],
    oracle:
      "Exact predicate classification from integer/fraction/radical representation, with convention recorded.",
    properties: [
      "zero is whole, integer, rational, and real",
      "negative integers are rational",
    ],
    cases: {
      foundational: [
        "Classify -7 in the smallest set.",
        "Integer",
        "It is not natural or whole, but belongs to Z.",
      ],
      visual: [
        "Place 3/4 in nested-set circles.",
        "Inside Q and R only",
        "It is rational but not an integer.",
      ],
      realWorld: [
        "Classify a debt of Rs 20.",
        "Integer -20",
        "A negative whole amount is represented by an integer.",
      ],
      misconception: [
        "Is zero irrational because 0/0 is invalid?",
        "No; zero is rational",
        "0=0/1 has a nonzero denominator.",
      ],
      boundary: [
        "Classify 0 under the app convention.",
        "Whole, integer, rational, real; not natural",
        "The convention explicitly starts N at 1.",
      ],
      challenge: [
        "Smallest set containing sqrt(49)-8.",
        "Integer",
        "sqrt49-8=7-8=-1.",
      ],
      connection: [
        "Connect terminating decimals to Q.",
        "They are integer ratios",
        "A k-place decimal has denominator 10^k.",
      ],
    },
    misconceptions: [
      {
        claim: "Every non-integer is irrational.",
        correction: "Fractions can be rational non-integers.",
        counterexample: "1/2 is rational.",
      },
      {
        claim: "Natural-number convention is universal.",
        correction:
          "Some sources include zero, so the convention must be declared.",
        counterexample:
          "This app uses N={1,2,3,…}, while other texts use {0,1,2,…}.",
      },
    ],
    sourceSection: "Number Systems",
  }),
  compactConcept({
    id: "number.decimals-percentages",
    domain: "number-systems",
    title: "Decimals and percentages",
    level: "Foundational",
    precise:
      "A terminating decimal is a base-ten rational representation; a percentage is a ratio per hundred.",
    learner: "Decimals, fractions, and percentages can name the same quantity.",
    prerequisites: ["place value", "fractions"],
    nextConcepts: ["rates", "financial mathematics"],
    grade: "6-8",
    chapter: "Comparing Quantities",
    notation: [{ symbol: "%", meaning: "per hundred" }],
    assumptions: [
      "Place values are powers of ten.",
      "Percentage change uses the original value as denominator.",
    ],
    domainStatement:
      "Finite decimals represent rationals; percentage bases must be nonzero for percentage change.",
    formula: "p\\%=\\frac{p}{100}",
    formulaConditions: ["p is real"],
    invariants: [
      "Converting forms preserves numeric value.",
      "A p% multiplier is p/100.",
    ],
    oracle: "Convert every representation to an exact reduced fraction.",
    properties: [
      "terminating decimals have denominators with only factors 2 and 5",
      "100%=1",
    ],
    cases: {
      foundational: [
        "Write 0.375 as a fraction and percent.",
        "3/8 and 37.5%",
        "375/1000 reduces to 3/8.",
      ],
      visual: [
        "Shade 25 of 100 cells.",
        "25%=0.25",
        "Each cell is one hundredth.",
      ],
      realWorld: ["Find 18% GST on Rs 500.", "Rs 90", "0.18×500=90."],
      misconception: [
        "Is a 20% rise then 20% fall unchanged?",
        "No; net 4% fall",
        "1.2×0.8=0.96.",
      ],
      boundary: ["What is 0% of 80?", "0", "The multiplier is zero."],
      challenge: [
        "A price after 15% discount is Rs 680.",
        "Original Rs 800",
        "680/0.85=800.",
      ],
      connection: [
        "Connect 12.5% to fractions.",
        "12.5%=1/8",
        "0.125 reduces to 1/8.",
      ],
    },
    misconceptions: [
      {
        claim: "Percent change is divided by the new value.",
        correction: "It is divided by the original value.",
        counterexample: "From 50 to 75 is 25/50=50%, not 25/75.",
      },
      {
        claim: "Every rational has a terminating decimal.",
        correction: "Some repeat forever.",
        counterexample: "1/3=0.333…",
      },
    ],
    sourceSection: "Comparing Quantities",
  }),
  compactConcept({
    id: "number.exponents-logarithms",
    domain: "number-systems",
    title: "Exponents and logarithms",
    precise:
      "Exponentiation records repeated scaling; log_b(x) is the unique exponent y satisfying b^y=x.",
    learner:
      "A logarithm asks which power of the base makes a positive number.",
    prerequisites: ["multiplication", "powers"],
    nextConcepts: ["exponential growth", "calculus"],
    grade: "8-11",
    chapter: "Exponents and Logarithms",
    notation: [
      { symbol: "a^x", meaning: "exponential value" },
      { symbol: "log_b x", meaning: "exponent producing x from base b" },
    ],
    assumptions: [
      "Real logarithms require positive arguments.",
      "The base is positive and not 1.",
    ],
    domainStatement: "For real log_b(x): x>0, b>0, b≠1.",
    formula: "\\log_b x=y\\iff b^y=x",
    formulaConditions: ["x>0", "b>0", "b≠1"],
    invariants: [
      "Exponent and logarithm undo each other on their domains.",
      "a^0=1 for a≠0.",
    ],
    oracle:
      "Evaluate b^y and compare to x; verify log identities numerically within tolerance.",
    tolerance: 1e-10,
    properties: [
      "log_b(xy)=log_b x+log_b y",
      "negative exponents give reciprocals",
    ],
    cases: {
      foundational: ["Evaluate log₂32.", "5", "2⁵=32."],
      visual: [
        "Reflect y=2^x across y=x.",
        "y=log₂x",
        "Inverse functions reflect across y=x.",
      ],
      realWorld: [
        "A population doubles every 3 years; find multiplier after 12 years.",
        "16",
        "There are four doublings: 2⁴.",
      ],
      misconception: [
        "Is log(a+b)=log a+log b?",
        "No",
        "The sum rule applies to products.",
      ],
      boundary: ["What is log_b1?", "0", "b⁰=1."],
      challenge: ["Solve 3^(2x)=27.", "x=3/2", "27=3³, so 2x=3."],
      connection: [
        "Connect logs to digit count.",
        "floor(log₁₀n)+1",
        "Powers of ten mark decimal length.",
      ],
    },
    misconceptions: [
      {
        claim: "log 0 is zero.",
        correction: "No real logarithm of zero exists.",
        counterexample: "No finite power of a positive base equals 0.",
      },
      {
        claim: "a^m+a^n=a^(m+n).",
        correction: "Exponents add under multiplication, not addition.",
        counterexample: "2²+2³=12, but 2⁵=32.",
      },
    ],
    sourceSection: "Exponents and Logarithms",
  }),
  compactConcept({
    id: "number.factors-primes",
    domain: "number-systems",
    title: "Factors, primes, GCD and LCM",
    level: "Foundational",
    precise:
      "A prime integer greater than one has exactly two positive divisors; GCD and LCM summarize common prime exponents.",
    learner:
      "Prime factorization lets us compute greatest shared factors and smallest shared multiples exactly.",
    prerequisites: ["division", "multiplication"],
    nextConcepts: ["fractions", "modular arithmetic"],
    grade: "6-8",
    chapter: "Playing with Numbers",
    notation: [
      { symbol: "gcd(a,b)", meaning: "greatest common divisor" },
      { symbol: "lcm(a,b)", meaning: "least positive common multiple" },
    ],
    assumptions: ["Inputs are integers.", "LCM is taken nonnegative."],
    domainStatement:
      "For standard prime factorization n is an integer greater than 1.",
    formula: "\\gcd(a,b)\\operatorname{lcm}(a,b)=|ab|",
    formulaConditions: ["a and b are nonzero integers"],
    invariants: [
      "GCD divides both inputs.",
      "LCM is divisible by both inputs.",
    ],
    oracle: "Euclidean algorithm plus prime-exponent reconstruction.",
    properties: ["prime factorization is unique up to order", "gcd(a,0)=|a|"],
    cases: {
      foundational: ["Find gcd(18,24).", "6", "Common prime part is 2×3."],
      visual: [
        "Use factor trees for 60.",
        "2²×3×5",
        "Every branch ends at primes.",
      ],
      realWorld: [
        "Lights flash every 6 and 8 seconds.",
        "Together every 24 seconds",
        "Use lcm(6,8).",
      ],
      misconception: [
        "Is 1 prime?",
        "No",
        "It has one positive divisor, not two.",
      ],
      boundary: [
        "Find gcd(15,0).",
        "15",
        "Every divisor of 15 also divides 0.",
      ],
      challenge: [
        "Given gcd=6, lcm=180, a=30, find b.",
        "36",
        "Use gcd×lcm=ab.",
      ],
      connection: [
        "Connect GCD to reducing 42/56.",
        "3/4",
        "Divide numerator and denominator by 14.",
      ],
    },
    misconceptions: [
      {
        claim: "1 is prime.",
        correction: "A prime has exactly two positive divisors.",
        counterexample: "1 has only divisor 1.",
      },
      {
        claim: "GCD is always smaller than both inputs.",
        correction: "It can equal an input.",
        counterexample: "gcd(6,18)=6.",
      },
    ],
    sourceSection: "Playing with Numbers",
  }),
  compactConcept({
    id: "number.modular-arithmetic",
    domain: "number-systems",
    title: "Modular arithmetic",
    precise: "Integers a and b are congruent modulo n when n divides a-b.",
    learner:
      "Modulo arithmetic keeps only the remainder class, like positions on a clock.",
    prerequisites: ["division algorithm", "factors"],
    nextConcepts: ["cryptography", "cyclic groups"],
    grade: "8-12 enrichment",
    chapter: "Number Theory",
    notation: [
      {
        symbol: "a≡b (mod n)",
        meaning: "a and b have the same remainder modulo n",
      },
    ],
    assumptions: [
      "The modulus n is a positive integer.",
      "Canonical remainders lie from 0 to n-1.",
    ],
    domainStatement: "a,b are integers and modulus n≥1.",
    formula: "a\\equiv b\\pmod n\\iff n\\mid(a-b)",
    formulaConditions: ["a,b are integers", "n is positive integer"],
    invariants: [
      "Reducing before or after addition gives the same class.",
      "Congruence is reflexive, symmetric, and transitive.",
    ],
    oracle: "Check (a-b)%n=0 using a nonnegative remainder convention.",
    properties: [
      "congruences add and multiply",
      "division needs an invertible divisor",
    ],
    cases: {
      foundational: ["Find 29 mod 5.", "4", "29=5×5+4."],
      visual: [
        "Locate 17 on a 12-hour clock.",
        "5",
        "Seventeen steps lands at remainder 5.",
      ],
      realWorld: [
        "What weekday is 100 days after Monday?",
        "Wednesday",
        "100 mod 7=2.",
      ],
      misconception: [
        "Can we always divide congruences?",
        "No",
        "The divisor needs an inverse modulo n.",
      ],
      boundary: ["Find a mod 1.", "0", "Every integer is divisible by 1."],
      challenge: ["Solve 3x≡1 mod 7.", "x≡5 mod 7", "3×5=15≡1."],
      connection: [
        "Connect parity to modulo.",
        "Even numbers are 0 mod 2",
        "Odd numbers are 1 mod 2.",
      ],
    },
    misconceptions: [
      {
        claim: "The remainder is always negative when the input is negative.",
        correction: "Canonical remainder is chosen nonnegative.",
        counterexample: "-1≡4 mod 5.",
      },
      {
        claim: "Congruent numbers are equal.",
        correction: "They share a remainder class.",
        counterexample: "2≡7 mod 5 but 2≠7.",
      },
    ],
    sourceSection: "Number Theory and Modular Arithmetic",
  }),
];
