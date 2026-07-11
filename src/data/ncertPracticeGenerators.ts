import type { NCERTPracticeItem } from "./ncertPracticeBank";

type GeneratorName =
  | "grade7-integers"
  | "grade7-fractions"
  | "grade7-decimals"
  | "grade7-percent"
  | "grade7-simple-equations"
  | "class10-linear"
  | "class10-statistics"
  | "class10-heights"
  | "class12-determinants"
  | "class12-bayes"
  | "class12-lpp";

export function generateNCERTPracticeVariant(name: GeneratorName, seed = 1): NCERTPracticeItem {
  const s = Math.max(1, Math.round(seed));
  if (name === "grade7-integers") {
    const a = -2 - s;
    const b = 3 + s;
    return item("class-7-integers", `Find ${a} + ${b}.`, a + b, "Move right for a positive addend.", `${a} + ${b} = ${a + b}.`, s);
  }
  if (name === "grade7-fractions") {
    const denominator = 2 + s;
    return textItem("class-7-fraction-operations", `Simplify ${denominator}/${denominator * 2}.`, "1/2", "Divide numerator and denominator by the same number.", `${denominator}/${denominator * 2} = 1/2.`, s);
  }
  if (name === "grade7-decimals") {
    const a = 1.2 + s / 10;
    const b = 0.3;
    return item("class-7-decimal-operations", `Find ${a.toFixed(1)} x ${b}.`, Number((a * b).toFixed(2)), "Multiply as whole numbers, then place decimals.", `${a.toFixed(1)} x ${b} = ${(a * b).toFixed(2)}.`, s, 0.001);
  }
  if (name === "grade7-percent") {
    const base = 100 * (s + 4);
    return item("class-7-comparing-quantities", `Find ${s * 5}% of ${base}.`, (s * 5 * base) / 100, "Use percent/100 times base.", `${s * 5}% of ${base} = ${(s * 5 * base) / 100}.`, s);
  }
  if (name === "grade7-simple-equations") {
    const x = s + 2;
    const a = 2;
    const b = 3;
    return item("class-7-simple-equations", `Solve ${a}x + ${b} = ${a * x + b}.`, x, "Subtract 3, then divide by 2.", `x = ${x}.`, s);
  }
  if (name === "class10-linear") {
    const x = s + 1;
    return item("class-10-linear-substitution-elimination", `Solve x + y = ${x + 3}, x - y = ${x - 3}. Find x.`, x, "Add the equations.", `2x = ${2 * x}, so x = ${x}.`, s);
  }
  if (name === "class10-statistics") {
    const values = [s, s + 2, s + 4];
    return item("class-10-grouped-mean-methods", `Find mean of ${values.join(", ")}.`, s + 2, "Add values and divide by 3.", `Mean = ${(values[0] + values[1] + values[2]) / 3}.`, s);
  }
  if (name === "class10-heights") {
    const distance = 10 * s;
    return item("class-10-heights-distances", `If tan(theta)=1 and distance=${distance}, find height.`, distance, "height = distance x tan(theta).", `Height = ${distance}.`, s);
  }
  if (name === "class12-determinants") {
    const a = s + 1;
    return item("class-12-determinants", `Find det [[${a},1],[2,3]].`, 3 * a - 2, "Use ad-bc.", `det = ${a}x3 - 1x2 = ${3 * a - 2}.`, s);
  }
  if (name === "class12-bayes") {
    return item("class-12-bayes-theorem", "If P(A)=0.2, P(E|A)=0.5 and P(E)=0.1, find P(A|E).", 1, "Use P(A)P(E|A)/P(E).", "0.2 x 0.5 / 0.1 = 1.", s, 0.001);
  }
  return item("class-12-linear-programming", `For Z=${s}x+2y at (2,3), find Z.`, 2 * s + 6, "Substitute x=2,y=3.", `Z=${s}x2+2x3=${2 * s + 6}.`, s);
}

function item(conceptId: string, prompt: string, answer: number, hint: string, explanation: string, seed: number, tolerance = 0): NCERTPracticeItem {
  return {
    id: `${conceptId}-generated-${seed}`,
    conceptId,
    difficulty: seed % 3 === 0 ? "exam" : seed % 2 === 0 ? "medium" : "easy",
    prompt,
    answer,
    answerType: "numeric",
    tolerance,
    hint,
    explanation,
    tags: ["deterministic-generator"],
  };
}

function textItem(conceptId: string, prompt: string, answer: string, hint: string, explanation: string, seed: number): NCERTPracticeItem {
  return {
    id: `${conceptId}-generated-${seed}`,
    conceptId,
    difficulty: seed % 3 === 0 ? "exam" : seed % 2 === 0 ? "medium" : "easy",
    prompt,
    answer,
    answerType: "text",
    hint,
    explanation,
    tags: ["deterministic-generator"],
  };
}
