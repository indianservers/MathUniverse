export type StudentRegion = "a" | "both" | "b" | "neither";
export const STUDENT_REGIONS: StudentRegion[] = ["a", "both", "b", "neither"];
export const REGION_NAMES = { a: "A only", both: "A ∩ B", b: "B only", neither: "Neither" };
export const REGION_COLORS = { a: "#1687e8", both: "#079fa9", b: "#8845ed", neither: "#aeb7c6" };
export const INITIAL_STUDENTS: StudentRegion[] = [...Array<StudentRegion>(10).fill("a"), ...Array<StudentRegion>(8).fill("both"), ...Array<StudentRegion>(8).fill("b"), ...Array<StudentRegion>(14).fill("neither")];

export function studentRegionAt(x: number, y: number): StudentRegion {
  const a = Math.hypot(x - 130, y - 140) <= 90, b = Math.hypot(x - 220, y - 140) <= 90;
  return a && b ? "both" : a ? "a" : b ? "b" : "neither";
}
export function conditionalCounts(students: StudentRegion[]) {
  const counts = { a: 0, both: 0, b: 0, neither: 0 };
  students.forEach(region => { counts[region]++; });
  const A = counts.a + counts.both, B = counts.b + counts.both;
  return { ...counts, A, B, total: students.length, givenB: B ? counts.both / B : null, givenA: A ? counts.both / A : null };
}
export function studentPositions(students: StudentRegion[]) {
  const slots: Record<StudentRegion, { x: number; y: number }[]> = { a: [], both: [], b: [], neither: [] };
  // Keep dot centers away from both boundaries so membership is visually unambiguous.
  for (let y = 39; y <= 253; y += 12) for (let x = 27; x <= 333; x += 12) {
    if (Math.abs(Math.hypot(x - 130, y - 140) - 90) < 6 || Math.abs(Math.hypot(x - 220, y - 140) - 90) < 6) continue;
    slots[studentRegionAt(x, y)].push({ x, y });
  }
  const used = { a: 0, both: 0, b: 0, neither: 0 };
  return students.map((region, id) => ({ id, region, ...slots[region][used[region]++] }));
}
export function probabilityFraction(numerator: number, denominator: number) {
  if (!denominator) return "Undefined";
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}
