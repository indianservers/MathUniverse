export type VennRegion = "aOnly" | "intersection" | "bOnly" | "outside";
export type VennPlacements = Record<number, VennRegion>;
export type VennShade = "a" | "b" | "union" | "intersection" | "none";

export const universe = Array.from({ length: 20 }, (_, index) => index + 1);
export const expectedPlacements: VennPlacements = Object.fromEntries(
  universe.map((value) => [value, value <= 7 ? "aOnly" : value <= 12 ? "intersection" : value <= 17 ? "bOnly" : "outside"]),
) as VennPlacements;

export function regionValues(placements: VennPlacements, region: VennRegion) {
  return universe.filter((value) => placements[value] === region);
}

export function vennSummary(placements: VennPlacements) {
  const aOnly = regionValues(placements, "aOnly");
  const intersection = regionValues(placements, "intersection");
  const bOnly = regionValues(placements, "bOnly");
  const outside = regionValues(placements, "outside");
  const a = [...aOnly, ...intersection].sort((left, right) => left - right);
  const b = [...intersection, ...bOnly].sort((left, right) => left - right);
  const union = [...aOnly, ...intersection, ...bOnly].sort((left, right) => left - right);
  const correct = universe.filter((value) => placements[value] === expectedPlacements[value]).length;
  return { aOnly, intersection, bOnly, outside, a, b, union, notA: universe.filter((value) => !a.includes(value)), notB: universe.filter((value) => !b.includes(value)), correct };
}

export function shadeIncludes(region: VennRegion, shade: VennShade) {
  return shade === "a" ? region === "aOnly" || region === "intersection" : shade === "b" ? region === "bOnly" || region === "intersection" : shade === "union" ? region !== "outside" : shade === "intersection" ? region === "intersection" : false;
}
