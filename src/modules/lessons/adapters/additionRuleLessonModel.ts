export type DiceOutcome = readonly [first: number, second: number];
export type AdditionRegion = "a" | "intersection" | "b" | "union" | "neither";

export const twoDiceOutcomes: DiceOutcome[] = Array.from({ length: 6 }, (_, first) =>
  Array.from({ length: 6 }, (_, second) => [first + 1, second + 1] as const),
).flat();

export function inEventA([first, second]: DiceOutcome) {
  return first + second === 7;
}

export function inEventB([first, second]: DiceOutcome, mutuallyExclusive: boolean) {
  return mutuallyExclusive ? first + second === 2 : first === 4;
}

export function outcomeRegion(outcome: DiceOutcome, mutuallyExclusive: boolean): AdditionRegion {
  const a = inEventA(outcome);
  const b = inEventB(outcome, mutuallyExclusive);
  if (a && b) return "intersection";
  if (a) return "a";
  if (b) return "b";
  return "neither";
}

export function additionRuleSummary(mutuallyExclusive: boolean) {
  const a = twoDiceOutcomes.filter(inEventA);
  const b = twoDiceOutcomes.filter((outcome) => inEventB(outcome, mutuallyExclusive));
  const intersection = a.filter((outcome) => inEventB(outcome, mutuallyExclusive));
  const union = twoDiceOutcomes.filter(
    (outcome) => inEventA(outcome) || inEventB(outcome, mutuallyExclusive),
  );

  return {
    total: twoDiceOutcomes.length,
    a,
    b,
    intersection,
    union,
    neither: twoDiceOutcomes.length - union.length,
    probability: union.length / twoDiceOutcomes.length,
  };
}

export function regionIsHighlighted(
  region: AdditionRegion,
  selected: AdditionRegion,
) {
  if (selected === "union") return region !== "neither";
  return region === selected;
}
