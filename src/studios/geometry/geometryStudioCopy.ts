import { searchHits } from "../mockup/trigStudioCopy";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";

export type GeoTrack = "2d" | "3d" | "proof" | "ar";

export const GEO_PATH = [
  { id: "construction", label: "Construct" },
  { id: "triangles", label: "Triangles" },
  { id: "circles", label: "Circles" },
  { id: "proofs", label: "Prove" },
] as const;

export const GEO_LAB_META: Record<string, {
  outcome: string;
  minutes: number;
  level: string;
  grade: string;
  board: string;
  track: GeoTrack;
  camera?: boolean;
  leavesStudio?: boolean;
}> = {
  construction: { outcome: "Build a figure that stays consistent when you drag a point.", minutes: 10, level: "Start here", grade: "Class 6–10", board: "NCERT", track: "2d" },
  triangles: { outcome: "Drag a triangle and watch sides, angles, and area stay linked.", minutes: 12, level: "Core", grade: "Class 6–10", board: "NCERT", track: "2d" },
  circles: { outcome: "See inscribed angles and tangents update on a live circle.", minutes: 10, level: "Core", grade: "Class 9–10", board: "NCERT", track: "2d" },
  polygons: { outcome: "Change n and read interior sum, tessellation, and diagonals.", minutes: 10, level: "Core", grade: "Class 8–10", board: "NCERT", track: "2d" },
  transformations: { outcome: "Translate, rotate, reflect, and dilate a shape in the plane.", minutes: 8, level: "Next", grade: "Class 7–10", board: "NCERT", track: "2d" },
  coordinate: { outcome: "Connect distance, midpoint, and slope to a dragged figure.", minutes: 10, level: "Core", grade: "Class 9–10", board: "NCERT", track: "2d" },
  measurement: { outcome: "Measure length, angle, area, and perimeter with live units.", minutes: 8, level: "Next", grade: "Class 6–8", board: "NCERT", track: "2d" },
  proofs: { outcome: "Watch a visual proof and match it to a two-column argument.", minutes: 12, level: "Next", grade: "Class 9–10", board: "NCERT", track: "proof" },
  solids: { outcome: "Rotate a solid, unfold a net, and read surface area and volume.", minutes: 10, level: "Extend", grade: "Class 8–10", board: "NCERT", track: "3d", leavesStudio: true },
  ar: { outcome: "Overlay a construction on a live camera plane.", minutes: 6, level: "Apply", grade: "Class 8+", board: "Extra", track: "ar", camera: true },
};

export const GEO_HOME_LEARNING = {
  observe: "Pick a lab and watch one figure respond when you drag a point.",
  understand: "Read the live measures and name what stays constant.",
  why: "A construction, a measure, and a theorem are the same relationship.",
  try: "Start with Triangles Explorer, then open Circles.",
  challenge: "Prove one claim in Theorems & Proofs after you can measure it.",
};

export const GEO_SEARCH_EXTRA: Array<{ label: string; to: string; detail: string; terms: string }> = [
  { label: "SSS / SAS / ASA", to: "/geometry/triangles?mode=congruence", detail: "Triangles", terms: "sss sas asa aas rhs congruence corresponding" },
  { label: "Similarity scale factor", to: "/geometry/triangles?mode=similarity", detail: "Triangles", terms: "similar aa sas sss scale k area" },
  { label: "Centroid and circumcenter", to: "/geometry/triangles?mode=centers", detail: "Triangles", terms: "centroid incenter orthocenter euler" },
  { label: "Triangle inequality", to: "/geometry/triangles?mode=inequalities", detail: "Triangles", terms: "degenerate hinge a+b>c" },
  { label: "Perpendicular bisector", to: "/geometry/construction", detail: "Construction", terms: "compass straightedge perpendicular bisector" },
  { label: "Thales' theorem", to: "/geometry/circles?mode=Angles", detail: "Circles", terms: "thales semicircle inscribed inscribed-angle" },
  { label: "Pythagoras visual proof", to: "/geometry/proofs?mode=Pythagoras", detail: "Proofs", terms: "pythagoras 3-4-5 hypotenuse" },
  { label: "Angle sum 180°", to: "/geometry/triangles?mode=explorer", detail: "Triangles", terms: "angle sum 180 interior" },
];

export const GEO_SHORTCUTS = [
  { keys: "Ctrl/⌘ K", action: "Search labs, theorems, and constructions" },
  { keys: "1–5", action: "On a lab, switch modes" },
  { keys: "← →", action: "Nudge a selected vertex" },
  { keys: "?", action: "Open this shortcut guide" },
];

export function geometrySearchHits(labs: StudioMockupPage[], query: string) {
  const needle = query.trim().toLowerCase();
  const base = searchHits(labs, query);
  if (!needle) return base;
  const extra = GEO_SEARCH_EXTRA.filter((item) =>
    `${item.label} ${item.terms} ${item.detail}`.toLowerCase().includes(needle),
  ).map((item) => ({ key: item.to, label: item.label, to: item.to, detail: item.detail }));
  const seen = new Set(base.map((item) => item.key));
  return [...base, ...extra.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  })];
}

export function trackLabel(track: GeoTrack) {
  if (track === "2d") return "2D";
  if (track === "3d") return "3D";
  if (track === "proof") return "Proof";
  return "AR";
}
