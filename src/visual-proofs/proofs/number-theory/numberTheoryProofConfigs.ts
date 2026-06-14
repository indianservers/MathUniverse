import type { ProofStep } from "../../data/proofTypes";

export type NumberTheoryProofKind =
  | "evenOdd"
  | "divisibility"
  | "primeArrays"
  | "compositeArrays"
  | "factorTree"
  | "euclidPrimes"
  | "gcd"
  | "lcm"
  | "modClock"
  | "remainderCycle"
  | "digitSum"
  | "sqrt2";

export type NumberTheoryParameterKey = "n" | "a" | "b" | "modulus" | "base" | "exponent" | "primeCount" | "number" | "divisor";

export type NumberTheoryProofConfig = {
  kind: NumberTheoryProofKind;
  parameters: Partial<Record<NumberTheoryParameterKey, { label: string; min: number; max: number; step?: number; defaultValue: number }>>;
  toggles: string[];
  steps: ProofStep[];
  formulas: string[];
  notes: string[];
  questions: string[];
};

const commonQuestions = ["Which part of the picture represents the main condition?", "How does changing the slider change the algebraic statement?"];

export const numberTheoryProofConfigs: Record<string, NumberTheoryProofConfig> = {
  EvenOddPairingProof: {
    kind: "evenOdd",
    parameters: { n: { label: "Number of dots n", min: 1, max: 50, defaultValue: 17 } },
    toggles: ["Show pair brackets"],
    steps: [
      { id: "dots", title: "Start with n objects", description: "The objects are arranged in a line so pairing is easy to inspect.", focusLabel: "objects" },
      { id: "pairs", title: "Make pairs", description: "Pair the objects two at a time.", focusLabel: "pairs of 2" },
      { id: "remainder", title: "Check what remains", description: "No leftover means even. One leftover means odd.", focusLabel: "leftover" },
    ],
    formulas: ["n is even if n = 2k", "n is odd if n = 2k + 1"],
    notes: ["Pairing gives a visual definition of parity.", "The leftover object is the +1 in 2k + 1."],
    questions: commonQuestions,
  },
  DivisibilityEqualGroupingProof: {
    kind: "divisibility",
    parameters: { a: { label: "Objects a", min: 2, max: 120, defaultValue: 42 }, b: { label: "Group size b", min: 2, max: 20, defaultValue: 6 } },
    toggles: ["Show remainder"],
    steps: [
      { id: "objects", title: "Count the objects", description: "Begin with a total number of objects.", focusLabel: "a objects" },
      { id: "groups", title: "Split into equal groups", description: "Make groups of size b.", focusLabel: "groups of b" },
      { id: "divides", title: "Inspect the remainder", description: "If the remainder is zero, b divides a.", focusLabel: "remainder" },
    ],
    formulas: ["a = bq + r", "If r = 0, then b divides a"],
    notes: ["Divisibility means equal grouping without leftover.", "The quotient counts full groups."],
    questions: commonQuestions,
  },
  PrimesNonRectangularArraysProof: {
    kind: "primeArrays",
    parameters: { n: { label: "Test number n", min: 2, max: 100, defaultValue: 29 } },
    toggles: ["Show factor pairs"],
    steps: [
      { id: "try", title: "Try rectangles", description: "A factor pair is a rectangle using all dots.", focusLabel: "rectangles" },
      { id: "only", title: "Ignore 1 x n", description: "The trivial row always exists.", focusLabel: "trivial pair" },
      { id: "prime", title: "Decide prime", description: "If no non-trivial rectangle exists, the number is prime.", focusLabel: "prime test" },
    ],
    formulas: ["Prime p has factors only 1 and p"],
    notes: ["Prime numbers resist rectangular arrangement except a single row.", "The visual test is limited safely to n <= 100."],
    questions: commonQuestions,
  },
  CompositesRectangularArraysProof: {
    kind: "compositeArrays",
    parameters: { n: { label: "Composite candidate n", min: 4, max: 100, defaultValue: 36 } },
    toggles: ["Show factor pairs"],
    steps: [
      { id: "dots", title: "Use all dots", description: "Every dot must appear in the rectangle.", focusLabel: "n dots" },
      { id: "rectangle", title: "Find a non-trivial rectangle", description: "Both side lengths must be greater than 1.", focusLabel: "a by b" },
      { id: "composite", title: "Read the factorization", description: "A non-trivial rectangle proves n is composite.", focusLabel: "n = ab" },
    ],
    formulas: ["If n = ab where a > 1 and b > 1, then n is composite"],
    notes: ["Composite numbers have a rectangular array beyond 1 x n."],
    questions: commonQuestions,
  },
  FundamentalTheoremArithmeticProof: {
    kind: "factorTree",
    parameters: { n: { label: "Number n", min: 2, max: 360, defaultValue: 180 } },
    toggles: ["Show exponent form"],
    steps: [
      { id: "split", title: "Split composites", description: "Break composite numbers into factor pairs.", focusLabel: "factor split" },
      { id: "leaves", title: "Stop at primes", description: "Prime leaves cannot split further.", focusLabel: "prime leaves" },
      { id: "unique", title: "Collect primes", description: "The same prime multiset appears no matter the split order.", focusLabel: "unique factorization" },
    ],
    formulas: ["n = p1^a x p2^b x ..."],
    notes: ["The order of factors can change, but the prime factorization is unique."],
    questions: commonQuestions,
  },
  EuclidInfinitelyManyPrimesProof: {
    kind: "euclidPrimes",
    parameters: { primeCount: { label: "First k primes", min: 2, max: 7, defaultValue: 4 } },
    toggles: ["Show remainder checks"],
    steps: [
      { id: "assume", title: "Assume a finite list", description: "Start with a list of known primes.", focusLabel: "finite list" },
      { id: "construct", title: "Multiply and add one", description: "Build N = p1p2...pk + 1.", focusLabel: "N" },
      { id: "remainder", title: "Check division", description: "Every listed prime leaves remainder 1.", focusLabel: "new prime factor" },
    ],
    formulas: ["N = p1p2...pk + 1", "N mod pi = 1 for each listed prime"],
    notes: ["Either N is prime, or it has a prime factor missing from the list."],
    questions: commonQuestions,
  },
  GcdEuclideanAlgorithmProof: {
    kind: "gcd",
    parameters: { a: { label: "Length a", min: 2, max: 120, defaultValue: 84 }, b: { label: "Length b", min: 2, max: 120, defaultValue: 30 } },
    toggles: ["Show division table"],
    steps: [
      { id: "divide", title: "Divide larger by smaller", description: "Record quotient and remainder.", focusLabel: "a = bq + r" },
      { id: "replace", title: "Replace the pair", description: "Use gcd(a,b) = gcd(b,r).", focusLabel: "same gcd" },
      { id: "finish", title: "Stop at zero remainder", description: "The last non-zero remainder is the GCD.", focusLabel: "GCD" },
    ],
    formulas: ["a = bq + r", "gcd(a,b) = gcd(b,r)"],
    notes: ["Euclid's algorithm preserves the common divisor at every step."],
    questions: commonQuestions,
  },
  LcmGridAlignmentProof: {
    kind: "lcm",
    parameters: { a: { label: "Step a", min: 2, max: 20, defaultValue: 6 }, b: { label: "Step b", min: 2, max: 20, defaultValue: 8 } },
    toggles: ["Show prime factor method"],
    steps: [
      { id: "multiples", title: "Mark multiples", description: "Place multiples of a and b on aligned number lines.", focusLabel: "multiples" },
      { id: "first", title: "Find first meeting point", description: "The first shared mark is the LCM.", focusLabel: "first common multiple" },
      { id: "identity", title: "Connect with GCD", description: "LCM times GCD equals the product ab.", focusLabel: "LCM x GCD = ab" },
    ],
    formulas: ["LCM(a,b) x GCD(a,b) = ab"],
    notes: ["LCM is the first time two repeated step patterns align."],
    questions: commonQuestions,
  },
  ModularArithmeticClockProof: {
    kind: "modClock",
    parameters: { modulus: { label: "Modulus m", min: 2, max: 24, defaultValue: 12 }, n: { label: "Number of steps n", min: -30, max: 120, defaultValue: 37 } },
    toggles: ["Show movement arc"],
    steps: [
      { id: "clock", title: "Build a modulo clock", description: "The residues are clock positions.", focusLabel: "mod m" },
      { id: "steps", title: "Move n steps", description: "Wrapping shows repeated remainders.", focusLabel: "wrap" },
      { id: "remainder", title: "Read the landing point", description: "The landing residue is n mod m.", focusLabel: "remainder" },
    ],
    formulas: ["n == r (mod m) means n and r leave the same remainder"],
    notes: ["Modulo arithmetic turns a number line into a loop."],
    questions: commonQuestions,
  },
  RemainderPatternCyclesProof: {
    kind: "remainderCycle",
    parameters: { base: { label: "Base", min: 2, max: 10, defaultValue: 2 }, modulus: { label: "Modulus", min: 2, max: 20, defaultValue: 7 }, exponent: { label: "Terms", min: 1, max: 16, defaultValue: 8 } },
    toggles: ["Show table"],
    steps: [
      { id: "powers", title: "Compute powers", description: "Use powers of the base.", focusLabel: "base^n" },
      { id: "remainders", title: "Take remainders", description: "Only finitely many residues are possible.", focusLabel: "remainders" },
      { id: "cycle", title: "See the cycle", description: "Repeated residues create a pattern.", focusLabel: "cycle" },
    ],
    formulas: ["Remainders repeat because only finitely many residues exist modulo m"],
    notes: ["Cycle length depends on both base and modulus."],
    questions: commonQuestions,
  },
  DivisibilityBy3And9Proof: {
    kind: "digitSum",
    parameters: { number: { label: "Number N", min: 10, max: 99999, defaultValue: 5382 }, divisor: { label: "Divisor", min: 3, max: 9, step: 6, defaultValue: 9 } },
    toggles: ["Show place values"],
    steps: [
      { id: "digits", title: "Split into digits", description: "Write the number by place value.", focusLabel: "digits" },
      { id: "powers", title: "Replace powers of 10", description: "For 3 and 9, every 10^k leaves remainder 1.", focusLabel: "10^k == 1" },
      { id: "sum", title: "Use the digit sum", description: "The original number and digit sum have the same remainder.", focusLabel: "digit sum" },
    ],
    formulas: ["Since 10^k == 1 mod 3 and mod 9, N == sum of digits"],
    notes: ["This is why digit-sum divisibility tests work."],
    questions: commonQuestions,
  },
  IrrationalitySqrt2Proof: {
    kind: "sqrt2",
    parameters: {},
    toggles: ["Show unit square diagonal"],
    steps: [
      { id: "assume", title: "Assume rational", description: "Suppose sqrt(2)=p/q in lowest terms.", focusLabel: "assumption" },
      { id: "evenp", title: "Prove p is even", description: "p^2=2q^2, so p^2 and p are even.", focusLabel: "p even" },
      { id: "evenq", title: "Prove q is even", description: "Substitute p=2k to show q is also even.", focusLabel: "q even" },
      { id: "contradiction", title: "Contradiction", description: "Both even contradicts lowest terms.", focusLabel: "contradiction" },
    ],
    formulas: ["sqrt(2)=p/q", "p^2=2q^2", "p even => p=2k", "q^2=2k^2", "q even"],
    notes: ["A unit square gives the geometric source of sqrt(2).", "The algebra proves that no reduced fraction can equal it."],
    questions: commonQuestions,
  },
};
