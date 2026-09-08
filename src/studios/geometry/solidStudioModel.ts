export type StudioSolid = "cube" | "cuboid" | "sphere" | "cylinder" | "cone" | "prism" | "pyramid" | "tetrahedron";
/** Size is the diameter for round solids and edge length for polyhedra. */
export function solidStudioProperties(solid: StudioSolid, size: number, height: number) {
  const r = size / 2;
  if (solid === "sphere") return { volume: 4 / 3 * Math.PI * r ** 3, surfaceArea: 4 * Math.PI * r ** 2, baseArea: Math.PI * r ** 2, diagonal: size, faces: 1, edges: 0, vertices: 0, formula: "V = 4πr³/3, SA = 4πr²" };
  if (solid === "cylinder") return { volume: Math.PI * r ** 2 * height, surfaceArea: 2 * Math.PI * r * (r + height), baseArea: Math.PI * r ** 2, diagonal: Math.hypot(size, height), faces: 3, edges: 2, vertices: 0, formula: "V = πr²h, SA = 2πr(r+h)" };
  if (solid === "cone") return { volume: Math.PI * r ** 2 * height / 3, surfaceArea: Math.PI * r * (r + Math.hypot(r, height)), baseArea: Math.PI * r ** 2, diagonal: Math.hypot(r, height), faces: 2, edges: 1, vertices: 1, formula: "V = πr²h/3, SA = πr(r+√(r²+h²))" };
  if (solid === "cuboid") return { volume: size * size * 0.72 * height, surfaceArea: 2 * (size * size * 0.72 + size * height + size * 0.72 * height), baseArea: size * size * 0.72, diagonal: Math.hypot(size, size * 0.72, height), faces: 6, edges: 12, vertices: 8, formula: "V = lwh, SA = 2(lw+lh+wh); w=0.72l" };
  if (solid === "prism") { const baseArea = Math.sqrt(3) * size ** 2 / 4; return { volume: baseArea * height, surfaceArea: 2 * baseArea + 3 * size * height, baseArea, diagonal: Math.hypot(size, height), faces: 5, edges: 9, vertices: 6, formula: "Equilateral triangular prism: B=√3s²/4, V=Bh, SA=2B+3sh" }; }
  if (solid === "pyramid") return { volume: size ** 2 * height / 3, surfaceArea: size ** 2 + 2 * size * Math.hypot(size / 2, height), baseArea: size ** 2, diagonal: Math.hypot(size / Math.sqrt(2), height), faces: 5, edges: 8, vertices: 5, formula: "Square pyramid: V=s²h/3, SA=s²+2s√(h²+s²/4)" };
  if (solid === "tetrahedron") return { volume: size ** 3 / (6 * Math.sqrt(2)), surfaceArea: Math.sqrt(3) * size ** 2, baseArea: Math.sqrt(3) * size ** 2 / 4, diagonal: size, faces: 4, edges: 6, vertices: 4, formula: "Regular tetrahedron: V=s³/(6√2), SA=√3s²" };
  return { volume: size ** 3, surfaceArea: 6 * size ** 2, baseArea: size ** 2, diagonal: Math.sqrt(3) * size, faces: 6, edges: 12, vertices: 8, formula: "V=s³, SA=6s²" };
}
