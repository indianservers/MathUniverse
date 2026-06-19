import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  digitSum,
  factorPairs,
  factorsOf,
  firstPrimes,
  formatFactorization,
  gcd,
  gcdSteps,
  isPrime,
  lcm,
  mod,
  primeFactorization,
  remainderCycle,
} from "../../utils/numberTheoryMath";
import {
  CompositeArrayModel,
  DigitSumModel,
  DivisibilityGroupingModel,
  EuclideanAlgorithmModel,
  EuclidPrimeListModel,
  EvenOddNumberModel,
  FactorTreeModel,
  ModularClockModel,
  MultipleAlignmentModel,
  PrimeArrayModel,
  RemainderCycleModel,
  SqrtTwoContradictionModel,
} from "./PhaseSixteenNumberTheoryVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const numberTheoryRoute = "/olympyard/practice/number-theory-foundations";

export const evenOddPhaseSixteenConfig = makeConfig({
  modelKey: "parity",
  steps: ["Choose n counters", "Pair counters", "Check if any counter remains", "Write even or odd form", "Compare 2k and 2k+1", "Conclude the parity rule"],
  parameters: [param("n", "Number n", 1, 49, 17, 1)],
  prediction: ["If n has one counter left after pairing, is it even or odd?", "Odd."],
  misconception: ["Odd means a number cannot be grouped at all.", "Odd numbers can form pairs, but one item remains unpaired."],
  tokens: ["2k", "2k-plus-1", "leftover"],
  formula: ({ n }) => {
    const whole = Math.floor(n / 2);
    return n % 2 === 0 ? `${n} = 2k = 2 x ${whole}` : `${n} = 2k + 1 = 2 x ${whole} + 1`;
  },
  liveValues: ({ n }) => [value("n", "n", n), value("k", "k = floor(n/2)", Math.floor(n / 2)), value("remainder", "remainder", n % 2), value("parity", "parity", n % 2 === 0 ? "even" : "odd"), value("invariant", "invariant", n % 2 === 0 ? "n = 2k" : "n = 2k+1")],
  invariant: ({ n }) => `${n} is ${n % 2 === 0 ? "even because all counters pair" : "odd because exactly one counter remains"}.`,
  renderVisual: EvenOddNumberModel,
});

export const divisibilityPhaseSixteenConfig = makeConfig({
  modelKey: "quotient-remainder",
  steps: ["Choose total a", "Choose group size b", "Make equal groups", "Count quotient q", "Check remainder", "Conclude divisibility"],
  parameters: [param("a", "Total a", 2, 120, 42, 1), param("b", "Group size b", 2, 20, 6, 1)],
  prediction: ["When is a divisible by b?", "When the remainder is 0."],
  misconception: ["If a is bigger than b, then b divides a.", "b divides a only if equal grouping leaves no remainder."],
  tokens: ["a", "b", "q", "remainder-0"],
  formula: ({ a, b }) => `${a} = ${b} x ${Math.floor(a / b)} + ${a % b}`,
  liveValues: ({ a, b }) => [value("a", "a", a), value("b", "b", b), value("q", "quotient q", Math.floor(a / b)), value("remainder", "remainder r", a % b), value("divisible", "divisible status", a % b === 0 ? "yes" : "no"), value("invariant", "invariant", "a = bq + r")],
  invariant: ({ a, b }) => `Equal groups preserve a = bq + r; divisibility occurs exactly when r = 0. Here r = ${a % b}.`,
  renderVisual: DivisibilityGroupingModel,
});

export const primesPhaseSixteenConfig = makeConfig({
  modelKey: "factor-pair-prime",
  steps: ["Choose n", "Try 1-row array", "Try other row counts", "Check factor pairs", "Count divisors", "Conclude prime if only 1 and n divide"],
  parameters: [param("n", "Number n", 2, 97, 13, 1)],
  prediction: ["If 13 can only make 1x13 and 13x1 arrays, what is it?", "Prime."],
  misconception: ["Prime numbers cannot be arranged in any rectangle.", "They can form 1xn rectangles, but no nontrivial rectangle."],
  tokens: ["one-by-n", "n-by-one", "no-other-rectangle", "two-divisors"],
  formula: ({ n }) => `${n} has divisors ${factorsOf(n).join(", ")}: ${isPrime(n) ? "prime" : "not prime"}`,
  liveValues: ({ n }) => [value("n", "n", n), value("divisors", "divisors", factorsOf(n).join(", ")), value("factor-pairs", "candidate factor pairs", pairText(n)), value("prime-status", "prime/composite status", isPrime(n) ? "prime" : "composite"), value("invariant", "invariant", "prime has exactly two divisors")],
  invariant: ({ n }) => `A prime has exactly two positive divisors. ${n} has ${factorsOf(n).length}.`,
  renderVisual: PrimeArrayModel,
});

export const compositesPhaseSixteenConfig = makeConfig({
  modelKey: "factor-pair-composite",
  steps: ["Choose n", "Search for factor pairs", "Build a nontrivial rectangle", "Label factors", "Count divisors", "Conclude composite"],
  parameters: [param("n", "Number n", 4, 100, 36, 1), param("pairIndex", "Factor-pair selector", 0, 4, 0, 1)],
  prediction: ["If n can form a 3x4 rectangle, what can we say about n?", "It is composite."],
  misconception: ["Composite just means even.", "Composite means having nontrivial factors; many odd numbers are composite too, like 9 or 15."],
  tokens: ["a-by-b", "factors", "composite"],
  formula: ({ n }) => `${n} ${isPrime(n) ? "has no nontrivial factor pair" : `= ${firstNontrivialPair(n).join(" x ")}`}`,
  liveValues: ({ n, pairIndex }) => [value("n", "n", n), value("divisors", "divisors", factorsOf(n).join(", ")), value("factor-pairs", "factor pairs", pairText(n)), value("selected-pair", "selected pair", selectedPairText(n, pairIndex)), value("composite-status", "composite/prime status", isPrime(n) ? "prime" : "composite"), value("invariant", "invariant", "composite has nontrivial factor pair")],
  invariant: ({ n }) => `${n} is composite exactly when a factor pair a x b exists with both factors greater than 1.`,
  renderVisual: CompositeArrayModel,
});

export const factorTreePhaseSixteenConfig = makeConfig({
  modelKey: "prime-factorization",
  steps: ["Choose n", "Split into factors", "Continue splitting composites", "Stop at primes", "Sort prime leaves", "Conclude unique prime factorization"],
  parameters: [param("n", "Number n", 2, 360, 180, 1)],
  prediction: ["Do different factor-tree paths change the final prime factors?", "No, only the order may change."],
  misconception: ["A number can have different prime factorizations depending on the tree.", "Different trees lead to the same prime factors up to order."],
  tokens: ["n", "prime-leaves", "product-expression", "unique"],
  formula: ({ n }) => `${n} = ${formatFactorization(primeFactorization(n))}`,
  liveValues: ({ n }) => [value("n", "n", n), value("current-factor-tree", "current factor tree", "split composites until leaves are prime"), value("prime-factors", "prime factors", formatFactorization(primeFactorization(n))), value("exponent-form", "exponent form", formatFactorization(primeFactorization(n))), value("invariant", "invariant", "product of prime leaves equals n")],
  invariant: ({ n }) => `The prime leaves multiply back to ${n}, and the sorted prime multiset is unique.`,
  renderVisual: FactorTreeModel,
});

export const euclidPhaseSixteenConfig = makeConfig({
  modelKey: "product-plus-one",
  steps: ["Start with a finite prime list", "Multiply all listed primes", "Add 1", "Divide by each listed prime", "Observe remainder 1", "Conclude there must be another prime"],
  parameters: [param("primeCount", "Listed primes", 2, 6, 4, 1)],
  prediction: ["Why does adding 1 matter?", "It makes the new number leave remainder 1 when divided by every listed prime."],
  misconception: ["Euclid's proof says P+1 is always prime.", "P+1 may be composite, but its prime factors are not in the original finite list."],
  tokens: ["p-product", "plus-one", "remainder-1", "new-prime"],
  formula: ({ primeCount }) => {
    const primes = firstPrimes(primeCount);
    const product = primes.reduce((acc, item) => acc * item, 1);
    return `N = ${primes.join(" x ")} + 1 = ${product + 1}`;
  },
  liveValues: ({ primeCount }) => {
    const primes = firstPrimes(primeCount);
    const product = primes.reduce((acc, item) => acc * item, 1);
    const next = product + 1;
    return [value("selected-primes", "selected primes", primes.join(", ")), value("product-P", "product P", product), value("N", "N = P+1", next), value("remainders", "remainders modulo listed primes", primes.map((p) => `${next} mod ${p} = ${next % p}`).join("; ")), value("conclusion", "conclusion status", "prime or has a new prime factor")];
  },
  invariant: () => "For each listed prime p_i, N mod p_i = 1 after multiplying the list and adding 1.",
  renderVisual: EuclidPrimeListModel,
});

export const gcdPhaseSixteenConfig = makeConfig({
  modelKey: "euclidean-algorithm",
  steps: ["Choose a and b", "Divide a by b", "Keep the remainder", "Replace pair by b and r", "Repeat until remainder 0", "Conclude final GCD"],
  parameters: [param("a", "Length a", 2, 120, 84, 1), param("b", "Length b", 2, 120, 30, 1)],
  prediction: ["What is the GCD when the remainder becomes 0?", "The previous nonzero divisor."],
  misconception: ["The Euclidean algorithm changes the GCD at every step.", "Each remainder step preserves the GCD while making the numbers smaller."],
  tokens: ["a-bq-r", "r", "gcd-b-r", "final-gcd"],
  formula: ({ a, b }) => `gcd(${a},${b}) = ${gcd(a, b)}`,
  liveValues: ({ a, b }) => [value("a", "a", a), value("b", "b", b), value("quotient-remainder-steps", "quotient/remainder steps", gcdSteps(a, b).map((step) => `${step.a}=${step.b}x${step.q}+${step.r}`).join("; ")), value("current-pair", "current pair", `${Math.max(a, b)}, ${Math.min(a, b)}`), value("final-gcd", "final gcd", gcd(a, b)), value("invariant", "invariant", "gcd is preserved after replacing (a,b) by (b,r)")],
  invariant: ({ a, b }) => `Every step gcd(a,b)=gcd(b,r) preserves the final gcd ${gcd(a, b)}.`,
  renderVisual: EuclideanAlgorithmModel,
});

export const lcmPhaseSixteenConfig = makeConfig({
  modelKey: "multiple-alignment",
  steps: ["Choose a and b", "Mark multiples of a", "Mark multiples of b", "Find first alignment", "Compare with axb if useful", "Conclude LCM"],
  parameters: [param("a", "Step a", 2, 20, 6, 1), param("b", "Step b", 2, 20, 8, 1)],
  prediction: ["What does LCM mean visually?", "The first place where both multiple patterns align."],
  misconception: ["LCM is always a x b.", "a x b is a common multiple, but it may not be the least common multiple."],
  tokens: ["multiples-of-a", "multiples-of-b", "first-common"],
  formula: ({ a, b }) => `lcm(${a},${b}) = ${lcm(a, b)}`,
  liveValues: ({ a, b }) => [value("a", "a", a), value("b", "b", b), value("multiples-of-a", "multiples of a", multiples(a, lcm(a, b)).join(", ")), value("multiples-of-b", "multiples of b", multiples(b, lcm(a, b)).join(", ")), value("first-common-multiple", "first common multiple", lcm(a, b)), value("gcd", "gcd if used", gcd(a, b)), value("invariant", "invariant", "lcm is smallest positive common multiple")],
  invariant: ({ a, b }) => `The first common alignment of skip-counting rows is ${lcm(a, b)}.`,
  renderVisual: MultipleAlignmentModel,
});

export const modularClockPhaseSixteenConfig = makeConfig({
  modelKey: "clock-mod",
  steps: ["Choose modulus m", "Build m-position clock", "Move a steps", "Count full wraps", "Land on remainder", "Conclude a mod m"],
  parameters: [param("a", "Steps a", 0, 120, 37, 1), param("m", "Modulus m", 2, 24, 12, 1)],
  prediction: ["On a mod 5 clock, where does 12 land?", "2."],
  misconception: ["Modulo means the same thing as division result.", "Modulo gives the remainder/final position after wrapping, not the quotient."],
  tokens: ["a", "mod-m", "remainder"],
  formula: ({ a, m }) => `${a} mod ${m} = ${mod(a, m)}`,
  liveValues: ({ a, m }) => [value("a", "a", a), value("m", "m", m), value("quotient", "quotient", Math.floor(a / m)), value("remainder", "remainder", mod(a, m)), value("final-position", "final position", mod(a, m)), value("invariant", "invariant", "a = mq + r")],
  invariant: ({ a, m }) => `${a} wraps around a ${m}-clock and lands at ${mod(a, m)}.`,
  renderVisual: ModularClockModel,
});

export const remainderCyclePhaseSixteenConfig = makeConfig({
  modelKey: "cycle",
  steps: ["Choose base and modulus", "Compute first powers", "Plot residues on clock", "Detect repetition", "Identify cycle length", "Use cycle to predict large powers"],
  parameters: [param("base", "Base", 2, 10, 2, 1), param("m", "Modulus m", 2, 20, 5, 1), param("n", "Exponent n", 1, 16, 8, 1)],
  prediction: ["If a remainder pattern has cycle length 4, how can we simplify a large exponent?", "Use the exponent modulo 4 to find its place in the cycle."],
  misconception: ["Powers modulo m keep growing forever.", "There are only finitely many remainders, so patterns eventually repeat."],
  tokens: ["base-power-n", "mod-m", "cycle"],
  formula: ({ base, m, n }) => `${base}^${n} mod ${m} = ${mod(base ** n, m)}`,
  liveValues: ({ base, m, n }) => {
    const residues = remainderCycle(base, m, n);
    return [value("base", "base", base), value("modulus", "modulus", m), value("n", "n", n), value("residues", "residues", residues.join(", ")), value("cycle-length", "cycle length", detectCycle(residues)), value("current-residue", "current residue", residues[n - 1] ?? 0), value("insight", "insight", "residues repeat after cycle length")];
  },
  invariant: ({ base, m }) => `Modulo ${m} has finitely many residues, so powers of ${base} eventually repeat.`,
  renderVisual: RemainderCycleModel,
});

export const digitSumPhaseSixteenConfig = makeConfig({
  modelKey: "digit-sum-modulo",
  steps: ["Choose a number", "Split into digits and place values", "Replace powers of 10 by remainder 1", "Add digits", "Test digit sum", "Conclude divisibility by 3 or 9"],
  parameters: [param("number", "Number", 10, 99999, 5382, 1), param("divisor", "Divisor 3 or 9", 3, 9, 9, 6)],
  prediction: ["If a digit sum is 27, is the number divisible by 9?", "Yes."],
  misconception: ["Digit-sum divisibility is just a shortcut without reason.", "It works because powers of 10 leave remainder 1 modulo 3 and 9."],
  tokens: ["digit-sum", "ten-equiv-one", "mod-3", "mod-9"],
  formula: ({ number, divisor }) => `${number} and digit sum ${digitSum(number)} have the same remainder mod ${divisor >= 6 ? 9 : 3}`,
  liveValues: ({ number, divisor }) => {
    const d = divisor >= 6 ? 9 : 3;
    return [value("number", "number", number), value("digits", "digits", String(Math.abs(number)).split("").join(", ")), value("digit-sum", "digit sum", digitSum(number)), value("digit-sum-mod", `digit sum mod ${d}`, mod(digitSum(number), d)), value("number-mod", `number mod ${d}`, mod(number, d)), value("invariant", "invariant", `number and digit sum have same remainder mod ${d}`)];
  },
  invariant: ({ number, divisor }) => {
    const d = divisor >= 6 ? 9 : 3;
    return `Because 10 == 1 mod ${d}, ${number} and its digit sum ${digitSum(number)} share remainder ${mod(number, d)}.`;
  },
  renderVisual: DigitSumModel,
});

export const sqrtTwoPhaseSixteenConfig = makeConfig({
  modelKey: "contradiction-parity",
  steps: ["Assume sqrt(2) is rational", "Write p/q in lowest terms", "Square both sides", "Show p must be even", "Show q must also be even", "Contradict lowest terms and conclude irrational"],
  parameters: [param("proofStep", "Proof-step focus", 0, 5, 0, 1)],
  prediction: ["What contradicts the 'lowest terms' assumption?", "Both p and q turn out to be even."],
  misconception: ["sqrt(2) is irrational because its decimal never ends.", "The proof shows no fraction p/q can equal sqrt(2); decimal behavior is a consequence, not the core proof."],
  tokens: ["sqrt2-p-over-q", "p-squared-2q-squared", "p-even", "q-even", "contradiction"],
  formula: () => "Assume sqrt(2)=p/q, so p^2=2q^2; parity forces p and q both even, contradiction.",
  liveValues: () => [value("assumption-status", "assumption status", "sqrt(2)=p/q in lowest terms"), value("p-squared-even", "p^2 even", "true under assumption"), value("p-even", "p even", "forced"), value("q-squared-even", "q^2 even", "forced after p=2k"), value("q-even", "q even", "forced"), value("contradiction-status", "contradiction status", "both p and q even"), value("invariant", "logic invariant", "lowest terms cannot have both p and q even")],
  invariant: () => "Lowest terms cannot have p and q both even, so the rational assumption fails.",
  renderVisual: SqrtTwoContradictionModel,
});

export const phaseSixteenRouteSlugs = [
  ["number-theory", "even-odd-pairing"],
  ["number-theory", "divisibility-equal-grouping"],
  ["number-theory", "primes-non-rectangular-arrays"],
  ["number-theory", "composites-rectangular-arrays"],
  ["number-theory", "fundamental-theorem-arithmetic-factor-trees"],
  ["number-theory", "euclid-infinitely-many-primes"],
  ["number-theory", "gcd-euclidean-algorithm"],
  ["number-theory", "lcm-grid-alignment"],
  ["number-theory", "modular-arithmetic-clock"],
  ["number-theory", "remainder-pattern-cycles"],
  ["number-theory", "divisibility-by-3-and-9-digit-sum"],
  ["number-theory", "irrationality-of-square-root-2"],
] as const;

export const phaseSixteenConfigs = [
  evenOddPhaseSixteenConfig,
  divisibilityPhaseSixteenConfig,
  primesPhaseSixteenConfig,
  compositesPhaseSixteenConfig,
  factorTreePhaseSixteenConfig,
  euclidPhaseSixteenConfig,
  gcdPhaseSixteenConfig,
  lcmPhaseSixteenConfig,
  modularClockPhaseSixteenConfig,
  remainderCyclePhaseSixteenConfig,
  digitSumPhaseSixteenConfig,
  sqrtTwoPhaseSixteenConfig,
];

type ConfigInput = {
  modelKey: string;
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseSixteenModelKey: string } {
  return {
    phaseSixteenModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: numberTheoryRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `number-theory-${input.modelKey}-invariant`, label: "number-model invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only schematic number model.", "Counters, arrays, clocks, and proof flows use bounded classroom-safe values.", "Exact proof logic is in the formula panel; diagrams support intuition."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}

function value(id: string, label: string, item: number | string) {
  return { id, label, value: item };
}

function step(title: string, index: number) {
  return { id: `p16-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "number model" : "conclusion" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the counter, array, clock, or proof-flow model before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use a memorized rule without the model.", feedback: "The number-model picture explains why the rule is true." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected number-model feature.", options: [{ id: "visual", label: "Use the number-model structure.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore the grouping, array, or remainder.", feedback: "The visual structure is what justifies the symbolic statement." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "2k": "2k",
    "2k-plus-1": "2k + 1",
    leftover: "leftover",
    a: "a",
    b: "b",
    q: "q",
    "remainder-0": "remainder 0",
    "one-by-n": "1 x n",
    "n-by-one": "n x 1",
    "no-other-rectangle": "no other rectangle",
    "two-divisors": "two divisors",
    "a-by-b": "a x b",
    factors: "factors",
    composite: "composite",
    n: "n",
    "prime-leaves": "prime leaves",
    "product-expression": "product expression",
    unique: "unique",
    "p-product": "p1p2...pk",
    "plus-one": "+1",
    "remainder-1": "remainder 1",
    "new-prime": "new prime",
    "a-bq-r": "a = bq + r",
    r: "r",
    "gcd-b-r": "gcd(b,r)",
    "final-gcd": "final gcd",
    "multiples-of-a": "multiples of a",
    "multiples-of-b": "multiples of b",
    "first-common": "first common",
    "mod-m": "mod m",
    remainder: "remainder",
    "base-power-n": "base^n",
    cycle: "cycle",
    "digit-sum": "digit sum",
    "ten-equiv-one": "10 == 1",
    "mod-3": "mod 3",
    "mod-9": "mod 9",
    "sqrt2-p-over-q": "sqrt(2) = p/q",
    "p-squared-2q-squared": "p^2 = 2q^2",
    "p-even": "p even",
    "q-even": "q even",
    contradiction: "contradiction",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("2k") || token === "leftover") return "pairing counters";
  if (["a", "b", "q", "remainder-0"].includes(token)) return "equal grouping";
  if (token.includes("rectangle") || token.includes("divisor") || token.includes("factor") || token === "composite") return "rectangular arrays";
  if (token.includes("prime") || token.includes("product") || token.includes("unique")) return "prime factor structure";
  if (token.includes("gcd") || token === "r" || token.includes("a-bq")) return "Euclidean remainder steps";
  if (token.includes("multiple") || token.includes("common")) return "multiple alignment";
  if (token.includes("mod") || token === "remainder" || token.includes("cycle")) return "clock and residues";
  if (token.includes("digit") || token.includes("ten")) return "digit sum decomposition";
  if (token.includes("even") || token.includes("contradiction") || token.includes("sqrt")) return "contradiction flow";
  return "number-model feature";
}

function pairText(n: number) {
  return factorPairs(n).map(([a, b]) => `${a}x${b}`).join(", ");
}

function firstNontrivialPair(n: number) {
  return factorPairs(n).find(([a, b]) => a > 1 && b > 1) ?? [1, n];
}

function selectedPairText(n: number, pairIndex: number) {
  const pairs = factorPairs(n).filter(([a, b]) => a > 1 && b > 1);
  return (pairs[Math.min(pairs.length - 1, Math.max(0, Math.round(pairIndex)))] ?? [1, n]).join(" x ");
}

function multiples(stepSize: number, until: number) {
  return Array.from({ length: Math.floor(until / stepSize) + 1 }, (_, index) => index * stepSize).slice(1);
}

function detectCycle(residues: number[]) {
  const first = residues[0];
  const next = residues.findIndex((value, index) => index > 0 && value === first);
  return next > 0 ? next : residues.length;
}
