export type StageOneKind = "die" | "coin";
export type StageTwoKind = "fair" | "biased";

export type TreePath = {
  first: string;
  second: "H" | "T";
  firstProbability: number;
  conditionalProbability: number;
  probability: number;
};

export function firstOutcomes(kind: StageOneKind) {
  return kind === "die" ? ["1", "2", "3", "4", "5", "6"] : ["H", "T"];
}

export function conditionalHeads(
  first: string,
  secondKind: StageTwoKind,
  dependent: boolean,
) {
  if (dependent) {
    const numeric = Number(first);
    return Number.isFinite(numeric) ? numeric / 7 : first === "H" ? 0.7 : 0.3;
  }
  return secondKind === "fair" ? 0.5 : 0.7;
}

export function multiplicationTree(
  firstKind: StageOneKind,
  secondKind: StageTwoKind,
  dependent: boolean,
) {
  const outcomes = firstOutcomes(firstKind);
  const firstProbability = 1 / outcomes.length;
  return outcomes.flatMap((first): TreePath[] => {
    const heads = conditionalHeads(first, secondKind, dependent);
    return [
      {
        first,
        second: "H",
        firstProbability,
        conditionalProbability: heads,
        probability: firstProbability * heads,
      },
      {
        first,
        second: "T",
        firstProbability,
        conditionalProbability: 1 - heads,
        probability: firstProbability * (1 - heads),
      },
    ];
  });
}

export function probabilityFraction(value: number) {
  const denominators = [2, 3, 4, 5, 6, 7, 10, 12, 14, 20, 30, 36, 42];
  const denominator = denominators.find((candidate) =>
    Math.abs(value * candidate - Math.round(value * candidate)) < 1e-8,
  );
  return denominator ? `${Math.round(value * denominator)}/${denominator}` : value.toFixed(3);
}
