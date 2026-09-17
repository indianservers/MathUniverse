import type { GeomObject } from "./constructionEngine";
import { defaultConstruction } from "./constructionEngine";

export type ConstructionPreset = {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  objects: GeomObject[];
  guided?: string[];
  challenge?: string;
};

const pt = (id: string, label: string, x: number, y: number): GeomObject => ({
  id, kind: "freePoint", label, parents: [], visible: true, locked: false, constructed: true, params: { x, y },
});

export const CONSTRUCTION_PRESETS: ConstructionPreset[] = [
  {
    id: "perp-bisector",
    name: "Perpendicular Bisector Theorem",
    level: "beginner",
    objects: defaultConstruction(),
    guided: [
      "Place A.",
      "Place B.",
      "Create equal-radius circles centered at A and B, or use the perpendicular bisector tool.",
      "Mark an intersection C.",
      "CD (or the bisector through the midpoint) is the perpendicular bisector of AB.",
    ],
    challenge: "Construct the perpendicular bisector of AB.",
  },
  {
    id: "midpoint",
    name: "Midpoint of AB",
    level: "beginner",
    objects: [
      pt("A", "A", -2, 0),
      pt("B", "B", 2, 1),
      { id: "AB", kind: "segment", label: "AB", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "M", kind: "midpoint", label: "M", parents: ["A", "B"], visible: true, locked: false, constructed: true },
    ],
    challenge: "Construct the midpoint of AB.",
  },
  {
    id: "angle-bisector",
    name: "Angle Bisector",
    level: "intermediate",
    objects: [
      pt("A", "A", -2, 0),
      pt("B", "B", 0, 0),
      pt("C", "C", 1.5, 2),
      { id: "BA", kind: "segment", label: "BA", parents: ["B", "A"], visible: true, locked: false, constructed: true },
      { id: "BC", kind: "segment", label: "BC", parents: ["B", "C"], visible: true, locked: false, constructed: true },
      { id: "l", kind: "angleBisector", label: "l₁", parents: ["A", "B", "C"], visible: true, locked: false, constructed: true },
    ],
    challenge: "Construct the angle bisector of ∠ABC.",
  },
  {
    id: "circumcenter",
    name: "Circumcenter of △ABC",
    level: "advanced",
    objects: [
      pt("A", "A", -2, -1),
      pt("B", "B", 3, -1),
      pt("C", "C", 0, 2.4),
      { id: "AB", kind: "segment", label: "AB", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "BC", kind: "segment", label: "BC", parents: ["B", "C"], visible: true, locked: false, constructed: true },
      { id: "CA", kind: "segment", label: "CA", parents: ["C", "A"], visible: true, locked: false, constructed: true },
      { id: "l1", kind: "perpBisector", label: "l₁", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "l2", kind: "perpBisector", label: "l₂", parents: ["B", "C"], visible: true, locked: false, constructed: true },
      { id: "O", kind: "intersection", label: "O", parents: ["l1", "l2"], visible: true, locked: false, constructed: true, params: { index: 0 } },
      { id: "c", kind: "circleCP", label: "c₁", parents: ["O", "A"], visible: true, locked: false, constructed: true },
    ],
    challenge: "Construct the circumcenter of △ABC.",
  },
  {
    id: "centroid",
    name: "Centroid",
    level: "intermediate",
    objects: [
      pt("A", "A", -2, -1),
      pt("B", "B", 3, -1),
      pt("C", "C", 0, 2.2),
      { id: "AB", kind: "segment", label: "AB", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "BC", kind: "segment", label: "BC", parents: ["B", "C"], visible: true, locked: false, constructed: true },
      { id: "CA", kind: "segment", label: "CA", parents: ["C", "A"], visible: true, locked: false, constructed: true },
      { id: "Ma", kind: "midpoint", label: "Ma", parents: ["B", "C"], visible: true, locked: false, constructed: true },
      { id: "Mb", kind: "midpoint", label: "Mb", parents: ["A", "C"], visible: true, locked: false, constructed: true },
      { id: "medA", kind: "median", label: "mₐ", parents: ["A", "B", "C"], visible: true, locked: false, constructed: true },
      { id: "medB", kind: "median", label: "mᵦ", parents: ["B", "A", "C"], visible: true, locked: false, constructed: true },
    ],
  },
  {
    id: "equilateral",
    name: "Equilateral Triangle on AB",
    level: "intermediate",
    objects: [
      pt("A", "A", -2, 0),
      pt("B", "B", 2, 0),
      { id: "AB", kind: "segment", label: "AB", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "cA", kind: "circleCP", label: "cA", parents: ["A", "B"], visible: true, locked: false, constructed: true },
      { id: "cB", kind: "circleCP", label: "cB", parents: ["B", "A"], visible: true, locked: false, constructed: true },
      { id: "C", kind: "intersection", label: "C", parents: ["cA", "cB"], visible: true, locked: false, constructed: true, params: { index: 0 } },
      { id: "AC", kind: "segment", label: "AC", parents: ["A", "C"], visible: true, locked: false, constructed: true },
      { id: "BC", kind: "segment", label: "BC", parents: ["B", "C"], visible: true, locked: false, constructed: true },
    ],
    challenge: "Construct an equilateral triangle on AB.",
  },
];
