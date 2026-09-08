export type DicePair = readonly [number, number];
export type EventAKind = "sum7" | "evenSum" | "doubles";
export type EventBKind = "first1" | "second6" | "atLeastOne6";

export const dicePairs: DicePair[] = Array.from({ length: 6 }, (_, first) =>
  Array.from({ length: 6 }, (_, second) => [first + 1, second + 1] as const),
).flat();

export const eventALabels: Record<EventAKind, string> = {
  sum7: "Sum is 7",
  evenSum: "Sum is even",
  doubles: "Both dice match",
};

export const eventBLabels: Record<EventBKind, string> = {
  first1: "First die is 1",
  second6: "Second die is 6",
  atLeastOne6: "At least one die is 6",
};

export function matchesA([first, second]: DicePair, kind: EventAKind) {
  if (kind === "sum7") return first + second === 7;
  if (kind === "evenSum") return (first + second) % 2 === 0;
  return first === second;
}

export function matchesB([first, second]: DicePair, kind: EventBKind) {
  if (kind === "first1") return first === 1;
  if (kind === "second6") return second === 6;
  return first === 6 || second === 6;
}

export function conditionalSummary(aKind: EventAKind, bKind: EventBKind) {
  const a = dicePairs.filter((pair) => matchesA(pair, aKind));
  const b = dicePairs.filter((pair) => matchesB(pair, bKind));
  const intersection = b.filter((pair) => matchesA(pair, aKind));
  const aOutsideB = a.length - intersection.length;
  const neitherAWithinB = b.length - intersection.length;
  return {
    total: dicePairs.length,
    a,
    b,
    intersection,
    aOutsideB,
    neitherAWithinB,
    outsideBoth:
      dicePairs.length - intersection.length - aOutsideB - neitherAWithinB,
    probability: b.length === 0 ? 0 : intersection.length / b.length,
  };
}

export function cellRegion(
  pair: DicePair,
  aKind: EventAKind,
  bKind: EventBKind,
) {
  const a = matchesA(pair, aKind);
  const b = matchesB(pair, bKind);
  return a && b ? "both" : a ? "a" : b ? "b" : "neither";
}

export function formatSet(pairs: DicePair[]) {
  return `{${pairs.map(([first, second]) => `(${first},${second})`).join(", ")}}`;
}
