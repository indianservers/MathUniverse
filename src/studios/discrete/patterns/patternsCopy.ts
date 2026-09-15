import type { StudioLearningCopy, StudioMockupPage } from "../../mockup/studioMockupCatalog";

const loop = (observe: string, understand: string, why: string, tryText: string, challenge: string): StudioLearningCopy => ({
  observe, understand, why, try: tryText, challenge,
});

export const PATTERNS_MODES = ["Figurate", "Recursive", "Pascal Triangle", "Fractals"] as const;
export type PatternsMode = (typeof PATTERNS_MODES)[number];

export const TAB_META: Record<PatternsMode, { title: string; subtitle: string }> = {
  Figurate: { title: "Figurate Numbers", subtitle: "Shape numbers in nature" },
  Recursive: { title: "Recursive Sequences", subtitle: "Define and explore sequences" },
  "Pascal Triangle": { title: "Pascal Triangle", subtitle: "Combinations & patterns" },
  Fractals: { title: "Fractals", subtitle: "Self-similarity & infinite patterns" },
};

export function parsePatternsMode(raw: string | null | undefined): PatternsMode {
  const token = (raw ?? "").trim().toLowerCase().replace(/[+_]+/g, " ").replace(/\s+/g, " ");
  if (!token) return "Figurate";
  if (token.startsWith("figurate")) return "Figurate";
  if (token.startsWith("recursive") || token === "sequences") return "Recursive";
  if (token.includes("pascal")) return "Pascal Triangle";
  if (token.startsWith("fractal")) return "Fractals";
  return PATTERNS_MODES.find((item) => item.toLowerCase() === token) ?? "Figurate";
}

export const LEARNING: Record<PatternsMode, StudioLearningCopy> = {
  Figurate: loop(
    "See how each new row adds one more point.",
    "The nth triangular number is the total of the first n positive integers.",
    "Two copies of the triangle form an n × (n+1) rectangle.",
    "Change n and animate the construction.",
    "Find T20 without counting every dot.",
  ),
  Recursive: loop(
    "Watch each new term come from the previous term(s) by a fixed rule.",
    "An explicit formula names a_n directly; a recurrence names it from earlier terms.",
    "Arithmetic adds d; geometric multiplies by r; Fibonacci adds the last two.",
    "Change a₁ and the rule, then predict the hidden term.",
    "If 2, 5, 8, ?, 14, what is the missing term?",
  ),
  "Pascal Triangle": loop(
    "Each interior entry is the sum of the two parents above it.",
    "The entry in row n, position k is C(n,k).",
    "Row n is also the coefficients of (a+b)^n, and the row sums to 2^n.",
    "Click a cell, then colour by mod 2 to see Sierpiński’s triangle.",
    "What is C(10,3)?",
  ),
  Fractals: loop(
    "Each iteration copies a scaled version of the previous figure.",
    "Self-similarity is a recursive rule, not a photographic zoom.",
    "Dimension D = log(copies) / log(1/scale) can be non-integer.",
    "Raise the iteration and count filled pieces as 3^n, 4^n or 2^n.",
    "How many filled triangles at Sierpiński depth 5?",
  ),
};

export function figurateLearning(sides: number): StudioLearningCopy {
  if (sides === 4) {
    return loop(
      "The new L-shaped layer around (n−1)² is the odd number 2n−1.",
      "Square numbers are n × n grids: S_n = n².",
      "n² − (n−1)² = 2n−1, so squares are sums of the first n odd numbers.",
      "Animate n−1 → n and watch the gnomon appear.",
      "Which term of square numbers equals 144?",
    );
  }
  if (sides === 5) {
    return loop(
      "Each pentagonal layer adds 3n−2 new dots.",
      "P_n = n(3n−1)/2.",
      "First differences 4, 7, 10, 13… have constant second difference 3 — a quadratic.",
      "Read the difference table while growing n.",
      "Find the 6th pentagonal number.",
    );
  }
  if (sides === 6) {
    return loop(
      "Hexagonal layers grow around a centre, six sides at a time.",
      "H_n = n(2n−1), and H_n = T_{2n−1}.",
      "Every hexagonal number is an odd-indexed triangular number.",
      "Compare H_4 = 28 with T_7 = 28.",
      "Which number is both triangular and hexagonal?",
    );
  }
  if (sides === 7) {
    return loop(
      "Heptagonal numbers continue the polygonal family with seven sides.",
      "P(7,n) = n(5n−3)/2.",
      "The general formula P(k,n) = ((k−2)n² − (k−4)n)/2 interpolates every type.",
      "Switch k from 3 to 12 and generate the live sequence.",
      "Compute P(7,5).",
    );
  }
  return LEARNING.Figurate;
}

export const MISCONCEPTIONS: Record<PatternsMode, { claim: string; ask: string; reveal: string }> = {
  Figurate: {
    claim: "All quadratic sequences are square numbers.",
    ask: "Is the triangular sequence quadratic? Is every term a perfect square?",
    reveal: "Triangular numbers have constant second difference 1, so they are quadratic, but T_n = n(n+1)/2 is not n² except at n=1.",
  },
  Recursive: {
    claim: "The Fibonacci ratio F_{n+1}/F_n equals the golden ratio at every n.",
    ask: "Compute a few ratios. Are they exactly φ?",
    reveal: "The ratios converge to φ ≈ 1.6180339887. Finite n never equals φ exactly.",
  },
  "Pascal Triangle": {
    claim: "Every number in Pascal’s Triangle is different.",
    ask: "Look at row 5. How many times does 10 appear? What about the 1s?",
    reveal: "Symmetry repeats values: C(n,k)=C(n,n−k). Boundaries are all 1s.",
  },
  Fractals: {
    claim: "A fractal becomes more detailed because the picture is simply zoomed.",
    ask: "At iteration 0 vs 1, did we zoom a photo or apply a replacement rule?",
    reveal: "Detail appears because the construction rule is applied recursively. Zooming a raster image does not create new structure.",
  },
};

export function patternsModeLearning(page: StudioMockupPage, mode?: string): StudioLearningCopy {
  if (page.id !== "number-patterns" || !mode) return page.learning;
  return LEARNING[mode as PatternsMode] ?? page.learning;
}
