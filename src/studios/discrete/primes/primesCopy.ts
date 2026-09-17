import type { StudioLearningCopy, StudioMockupPage } from "../../mockup/studioMockupCatalog";

const loop = (observe: string, understand: string, why: string, tryText: string, challenge: string): StudioLearningCopy => ({
  observe, understand, why, try: tryText, challenge,
});

export const PRIMES_MODES = [
  "Sieve of Eratosthenes",
  "Factor Tree",
  "GCD & LCM",
  "Divisibility Rules",
  "Prime Patterns",
] as const;

export type PrimesMode = (typeof PRIMES_MODES)[number];

export const LEARNING: Record<PrimesMode, StudioLearningCopy> = {
  "Sieve of Eratosthenes": loop(
    "Watch each prime strike out its multiples, starting at p².",
    "A number survives only if no smaller prime divided it.",
    "Every composite has a prime factor ≤ √n, so the sieve can stop when p² > n.",
    "Pause after 5 and predict which cell is next.",
    "How many primes are ≤ 50?",
  ),
  "Factor Tree": loop(
    "Watch each composite number split into factor pairs.",
    "A branch is finished only when its endpoint is prime.",
    "The Fundamental Theorem of Arithmetic guarantees that every integer greater than 1 has one unique prime factorization, apart from factor order.",
    "Factor 84 starting with 7 × 12 instead of 2 × 42.",
    "Find a number with exactly 18 positive divisors.",
  ),
  "GCD & LCM": loop(
    "Compare the shared prime powers with the lists of factors and multiples.",
    "GCD keeps the minimum exponents; LCM keeps the maximum exponents.",
    "Euclid’s algorithm replaces (a, b) with (b, a mod b) until the remainder is 0.",
    "Run Euclid on 84 and 60, then check 12 × 420 = 84 × 60.",
    "If gcd(a,b)=8, lcm(a,b)=240 and a=48, find b.",
  ),
  "Divisibility Rules": loop(
    "See which digits the live rule highlights on the number you typed.",
    "Each rule inspects a remainder that the place values force.",
    "A rule works because 10 ≡ something small modulo the divisor.",
    "Change one digit of 3428 so the number becomes divisible by 3.",
    "Create a 4-digit number divisible by 3 and 5 but not by 2.",
  ),
  "Prime Patterns": loop(
    "Change the grid width and watch how primes line up — or fail to.",
    "Visual clusters are clues, not proofs.",
    "Primes > 3 sit in 1 or 5 mod 6, but the converse is false: 25 = 6×4+1 is composite.",
    "Open the Ulam spiral and hover a diagonal.",
    "What is π(100)?",
  ),
};

export const MISCONCEPTIONS: Record<PrimesMode, { claim: string; ask: string; reveal: string }> = {
  "Sieve of Eratosthenes": {
    claim: "1 is the first prime because it is only divisible by 1.",
    ask: "How many distinct positive divisors does a prime need?",
    reveal: "A prime has exactly two distinct positive divisors: 1 and itself. 1 has only one divisor, so it is not prime.",
  },
  "Factor Tree": {
    claim: "Different factor trees mean different prime factorizations.",
    ask: "Do both trees for 60 end at the same primes?",
    reveal: "The shapes differ, but both yield 2² × 3 × 5. Uniqueness is about the primes, not the tree drawing.",
  },
  "GCD & LCM": {
    claim: "The LCM of 8 and 12 is 96 because 8 × 12 = 96.",
    ask: "Did we already count the shared factor 4 twice?",
    reveal: "lcm(a,b) = ab / gcd(a,b). Here gcd=4, so lcm=24, the first common multiple.",
  },
  "Divisibility Rules": {
    claim: "91 must be prime because it is not divisible by 2, 3 or 5.",
    ask: "Is checking 2, 3 and 5 enough?",
    reveal: "No. √91 ≈ 9.5, so we must also test 7. 91 = 7 × 13.",
  },
  "Prime Patterns": {
    claim: "Every number on that Ulam diagonal is prime.",
    ask: "Can you find a composite on the same diagonal?",
    reveal: "Diagonals can look rich in primes, but they are not theorems. Check a few cells — composites appear.",
  },
};

export function primesModeLearning(page: StudioMockupPage, mode?: string): StudioLearningCopy {
  if (page.id !== "primes" || !mode) return page.learning;
  return LEARNING[mode as PrimesMode] ?? page.learning;
}
