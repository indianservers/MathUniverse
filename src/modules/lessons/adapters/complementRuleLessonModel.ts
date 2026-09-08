export const twelveSidedDie = Array.from(
  { length: 12 },
  (_, index) => index + 1,
);
export type ComplementEvent = "even" | "prime" | "greater6";
export function eventMembers(kind: ComplementEvent) {
  return twelveSidedDie.filter((value) =>
    kind === "even"
      ? value % 2 === 0
      : kind === "prime"
        ? [2, 3, 5, 7, 11].includes(value)
        : value > 6,
  );
}
export function complementSummary(inEvent: number, total: number) {
  const safe = Math.max(1, total),
    complement = Math.max(0, safe - inEvent);
  return {
    inEvent,
    complement,
    total: safe,
    p: inEvent / safe,
    pc: complement / safe,
  };
}
