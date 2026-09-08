export function collatzTrace(start: number, limit = 10000) {
  if (!Number.isInteger(start) || start < 1 || start > 100000 || !Number.isInteger(limit) || limit < 0 || limit > 10000) throw new Error("Start must be 1 to 100,000; step limit 0 to 10,000.");
  const values = [BigInt(start)];
  let peak = values[0];
  while (values.at(-1) !== 1n && values.length - 1 < limit) {
    const current = values.at(-1)!, next = current % 2n === 0n ? current / 2n : 3n * current + 1n;
    values.push(next); if (next > peak) peak = next;
  }
  const reachedOne = values.at(-1) === 1n;
  return { start, values, peak, reachedOne, stopping: reachedOne ? values.length - 1 : null, transitions: values.length - 1 };
}
export type CollatzParity = "all" | "even" | "odd";
export function collatzRange(from: number, to: number, parity: CollatzParity, limit = 10000) {
  if (![from, to].every(v => Number.isInteger(v) && v >= 1 && v <= 100000) || from > to) throw new Error("Enter a range within 1 to 100,000, with start ≤ end.");
  let checked = 0, reached = 0; const unresolved: number[] = [];
  for (let n = from; n <= to; n++) {
    if (parity !== "all" && n % 2 !== (parity === "even" ? 0 : 1)) continue;
    const result = collatzTrace(n, limit); checked++; if (result.reachedOne) reached++; else unresolved.push(n);
  }
  return { checked, reached, unresolved };
}
