import type { ProofStep } from "../../data/proofTypes";

export type GeometryProofKind =
  | "PythagoreanAreaRearrangementProof"
  | "TriangleAreaHalfRectangleProof"
  | "TriangleAngleSumProof"
  | "ExteriorAngleTheoremProof"
  | "SimilarTrianglesProof"
  | "CircleCircumferenceUnwrappingProof"
  | "SectorAreaFormulaProof"
  | "ParallelogramAreaShearingProof"
  | "TrapezoidAreaDuplicationProof"
  | "PolygonInteriorAngleSumProof";

export type GeometryParameterKey = "a" | "b" | "base" | "height" | "offset" | "scale" | "radius" | "angle" | "sides";

export type GeometryParameter = {
  key: GeometryParameterKey;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  unit?: string;
};

export type GeometryProofConfig = {
  kind: GeometryProofKind;
  steps: ProofStep[];
  parameters: GeometryParameter[];
  formulas: string[];
  notes: string;
  questions: string[];
  toggles: {
    labels: string;
    formula: string;
    secondary?: string;
  };
};

const commonQuestions = [
  "Which measurement stays unchanged during the visual transformation?",
  "What part of the diagram represents the final formula?",
  "How would the picture change if the sliders used larger values?",
];

export const geometryProofConfigs: Record<GeometryProofKind, GeometryProofConfig> = {
  PythagoreanAreaRearrangementProof: {
    kind: "PythagoreanAreaRearrangementProof",
    parameters: [
      { key: "a", label: "Leg a", min: 3, max: 8, defaultValue: 3, step: 1 },
      { key: "b", label: "Leg b", min: 4, max: 10, defaultValue: 4, step: 1 },
    ],
    steps: [
      { id: "triangle", title: "One right triangle", description: "Start with legs a and b and hypotenuse c.", focusLabel: "a, b, c" },
      { id: "four", title: "Use four copies", description: "Four identical triangles can fit inside a square of side a + b.", focusLabel: "4 equal triangles" },
      { id: "c-square", title: "Leave c squared", description: "One arrangement leaves a central tilted square with side c.", focusLabel: "c^2" },
      { id: "ab-squares", title: "Rearrange leftovers", description: "The same four triangles can leave two squares of areas a^2 and b^2.", focusLabel: "a^2 + b^2" },
      { id: "equal", title: "Compare equal leftovers", description: "Outer square and triangles are unchanged, so the leftover areas are equal.", focusLabel: "same area" },
      { id: "formula", title: "Conclude the theorem", description: "Therefore c^2 = a^2 + b^2.", focusLabel: "a^2 + b^2 = c^2" },
    ],
    formulas: ["(a + b)^2 - 4 x (1/2 ab) = c^2", "a^2 + 2ab + b^2 - 2ab = c^2", "a^2 + b^2 = c^2"],
    notes: "The proof compares two arrangements built from the same outer square and the same four right triangles. Because the unchanged pieces occupy equal area, the remaining area must also be equal.",
    questions: ["Why does rearranging the four triangles preserve area?", "Where do you see c^2 in the first arrangement?", "Where do you see a^2 and b^2 in the second arrangement?"],
    toggles: { labels: "Show side labels", formula: "Show formula", secondary: "Toggle arrangement" },
  },
  TriangleAreaHalfRectangleProof: {
    kind: "TriangleAreaHalfRectangleProof",
    parameters: [
      { key: "base", label: "Base b", min: 140, max: 260, defaultValue: 210, step: 10 },
      { key: "height", label: "Height h", min: 100, max: 190, defaultValue: 150, step: 10 },
      { key: "offset", label: "Top vertex", min: 80, max: 250, defaultValue: 160, step: 10 },
    ],
    steps: [
      { id: "base-height", title: "Choose base and height", description: "The triangle sits on base b and reaches perpendicular height h.", focusLabel: "b and h" },
      { id: "rectangle", title: "Enclose in rectangle", description: "Draw the rectangle with the same base and height.", focusLabel: "b x h" },
      { id: "duplicate", title: "Duplicate triangle", description: "A congruent copy can fill the missing half.", focusLabel: "two equal triangles" },
      { id: "complete", title: "Complete rectangle", description: "The two equal triangles together make the rectangle.", focusLabel: "rectangle" },
      { id: "half", title: "Take half", description: "One triangle is half of b x h.", focusLabel: "1/2 bh" },
    ],
    formulas: ["Rectangle Area = b x h", "Two equal triangles = b x h", "One triangle = 1/2 x b x h"],
    notes: "The top vertex can slide left or right. The triangle shape changes, but the base and perpendicular height determine the same enclosing rectangle.",
    questions: commonQuestions,
    toggles: { labels: "Show altitude", formula: "Show formula", secondary: "Show duplicate" },
  },
  TriangleAngleSumProof: {
    kind: "TriangleAngleSumProof",
    parameters: [
      { key: "a", label: "Left vertex", min: 80, max: 160, defaultValue: 110, step: 10 },
      { key: "b", label: "Top vertex", min: 210, max: 310, defaultValue: 260, step: 10 },
      { key: "height", label: "Triangle height", min: 110, max: 190, defaultValue: 150, step: 10 },
    ],
    steps: [
      { id: "triangle", title: "Show triangle", description: "Every triangle has three interior angles.", focusLabel: "A, B, C" },
      { id: "a", title: "Highlight A", description: "Copy angle A from the left base.", focusLabel: "A" },
      { id: "b", title: "Highlight B", description: "Copy angle B from the top vertex.", focusLabel: "B" },
      { id: "c", title: "Highlight C", description: "Copy angle C from the right base.", focusLabel: "C" },
      { id: "line", title: "Place on a line", description: "The three copied angles form a straight line.", focusLabel: "180 degrees" },
      { id: "formula", title: "State the sum", description: "A + B + C = 180 degrees.", focusLabel: "angle sum" },
    ],
    formulas: ["A + B + C = 180 degrees"],
    notes: "A line through one vertex parallel to the opposite side gives the same result through alternate interior angles.",
    questions: ["How do the copied arcs form a straight angle?", "What does the parallel-line overlay explain?", "Can you make a very thin triangle and keep the sum?"],
    toggles: { labels: "Show angle values", formula: "Show formula", secondary: "Parallel-line overlay" },
  },
  ExteriorAngleTheoremProof: {
    kind: "ExteriorAngleTheoremProof",
    parameters: [
      { key: "a", label: "Left vertex", min: 90, max: 170, defaultValue: 120, step: 10 },
      { key: "b", label: "Top vertex", min: 220, max: 310, defaultValue: 260, step: 10 },
      { key: "height", label: "Triangle height", min: 110, max: 190, defaultValue: 150, step: 10 },
    ],
    steps: [
      { id: "triangle", title: "Show triangle", description: "Begin with the triangle and its interior angles.", focusLabel: "triangle" },
      { id: "extend", title: "Extend a side", description: "Extend one side past the base to create an exterior angle.", focusLabel: "exterior angle" },
      { id: "exterior", title: "Highlight exterior", description: "The exterior angle is supplementary to the adjacent interior angle.", focusLabel: "outside angle" },
      { id: "remote", title: "Highlight remote angles", description: "The two non-adjacent interior angles are the remote angles.", focusLabel: "A and B" },
      { id: "transfer", title: "Transfer angles", description: "Copies of the remote angles fill the exterior angle.", focusLabel: "A + B" },
      { id: "formula", title: "Conclude theorem", description: "Exterior angle = A + B.", focusLabel: "exterior = A + B" },
    ],
    formulas: ["A + B + C = 180 degrees", "Exterior angle + C = 180 degrees", "Exterior angle = A + B"],
    notes: "The exterior angle and the adjacent interior angle make a straight line. Subtracting the adjacent angle from 180 degrees leaves the two remote angles.",
    questions: commonQuestions,
    toggles: { labels: "Show angle measures", formula: "Show formula", secondary: "Animate transfer" },
  },
  SimilarTrianglesProof: {
    kind: "SimilarTrianglesProof",
    parameters: [
      { key: "scale", label: "Scale factor k", min: 1.2, max: 2.4, defaultValue: 1.7, step: 0.1 },
      { key: "offset", label: "Separation", min: 120, max: 260, defaultValue: 200, step: 10 },
    ],
    steps: [
      { id: "first", title: "Show triangle ABC", description: "Start with one triangle.", focusLabel: "ABC" },
      { id: "scaled", title: "Show scaled copy", description: "Create A'B'C' by scaling every side by k.", focusLabel: "scaled copy" },
      { id: "angles", title: "Equal angles", description: "Corresponding angles remain equal.", focusLabel: "equal angles" },
      { id: "sides", title: "Corresponding sides", description: "Match each side with its scaled partner.", focusLabel: "matching sides" },
      { id: "ratios", title: "Constant ratios", description: "Every corresponding side ratio equals k.", focusLabel: "same ratio" },
      { id: "formula", title: "Write proportion", description: "A'B'/AB = B'C'/BC = C'A'/CA = k.", focusLabel: "proportional sides" },
    ],
    formulas: ["A'B' / AB = B'C' / BC = C'A' / CA = k"],
    notes: "Similar triangles preserve shape. Equal angles force every side to stretch by one shared scale factor.",
    questions: ["What changes when k changes?", "Which side pairs correspond?", "Why do equal angles preserve shape?"],
    toggles: { labels: "Show side lengths", formula: "Show ratios", secondary: "Overlay mode" },
  },
  CircleCircumferenceUnwrappingProof: {
    kind: "CircleCircumferenceUnwrappingProof",
    parameters: [{ key: "radius", label: "Radius r", min: 55, max: 105, defaultValue: 75, step: 5 }],
    steps: [
      { id: "circle", title: "Show circle", description: "Start with a circle of radius r.", focusLabel: "r" },
      { id: "mark", title: "Mark a point", description: "Track one point on the circumference.", focusLabel: "rotation marker" },
      { id: "roll", title: "Roll one turn", description: "One full rotation travels one circumference.", focusLabel: "one turn" },
      { id: "distance", title: "Mark distance", description: "The travel distance equals the boundary length.", focusLabel: "C" },
      { id: "unwrap", title: "Unwrap boundary", description: "The circle boundary becomes a straight segment.", focusLabel: "straight circumference" },
      { id: "formula", title: "Derive formula", description: "C = pi x diameter = 2 pi r.", focusLabel: "2 pi r" },
    ],
    formulas: ["Diameter = 2r", "Circumference = pi x diameter", "C = pi x 2r", "C = 2 pi r"],
    notes: "A rolling circle advances by exactly the length of its boundary during one complete rotation.",
    questions: commonQuestions,
    toggles: { labels: "Show trail", formula: "Show formula", secondary: "Show unwrapped line" },
  },
  SectorAreaFormulaProof: {
    kind: "SectorAreaFormulaProof",
    parameters: [
      { key: "radius", label: "Radius r", min: 70, max: 120, defaultValue: 90, step: 5 },
      { key: "angle", label: "Angle theta", min: 10, max: 360, defaultValue: 120, step: 5, unit: "deg" },
    ],
    steps: [
      { id: "circle", title: "Full circle", description: "The full circle has area pi r^2.", focusLabel: "pi r^2" },
      { id: "angle", title: "Select angle", description: "Choose a central angle theta.", focusLabel: "theta" },
      { id: "sector", title: "Highlight sector", description: "The sector is part of the full circle.", focusLabel: "sector" },
      { id: "fraction", title: "Compare angle fraction", description: "The fraction of turn is theta / 360.", focusLabel: "theta / 360" },
      { id: "area", title: "Use area fraction", description: "The area fraction matches the angle fraction.", focusLabel: "sector area" },
      { id: "formula", title: "Derive formula", description: "Sector Area = theta / 360 x pi r^2.", focusLabel: "formula" },
    ],
    formulas: ["Sector fraction = theta / 360", "Sector Area = theta / 360 x pi r^2", "Radians: Sector Area = 1/2 r^2 theta"],
    notes: "A sector is the same fraction of area as its central angle is of a full turn.",
    questions: commonQuestions,
    toggles: { labels: "Show comparison", formula: "Show formula", secondary: "Radians view" },
  },
  ParallelogramAreaShearingProof: {
    kind: "ParallelogramAreaShearingProof",
    parameters: [
      { key: "base", label: "Base b", min: 160, max: 280, defaultValue: 220, step: 10 },
      { key: "height", label: "Height h", min: 100, max: 180, defaultValue: 140, step: 10 },
      { key: "offset", label: "Slant", min: 30, max: 110, defaultValue: 70, step: 10 },
    ],
    steps: [
      { id: "shape", title: "Show parallelogram", description: "Start with a slanted parallelogram.", focusLabel: "parallelogram" },
      { id: "base", title: "Highlight base", description: "The bottom side is base b.", focusLabel: "b" },
      { id: "height", title: "Highlight height", description: "The perpendicular height is h.", focusLabel: "h" },
      { id: "cut", title: "Cut side triangle", description: "Cut the slanted triangle from one side.", focusLabel: "cut" },
      { id: "move", title: "Move triangle", description: "Translate it to the other side.", focusLabel: "same area" },
      { id: "rectangle", title: "Form rectangle", description: "The result is a rectangle of area b x h.", focusLabel: "b x h" },
    ],
    formulas: ["Rectangle Area = b x h", "Parallelogram has same area as rectangle", "Parallelogram Area = b x h"],
    notes: "Shearing changes the slant but not the base-height product. The cut-and-move picture preserves area.",
    questions: commonQuestions,
    toggles: { labels: "Show altitude", formula: "Show formula", secondary: "Show rectangle outline" },
  },
  TrapezoidAreaDuplicationProof: {
    kind: "TrapezoidAreaDuplicationProof",
    parameters: [
      { key: "a", label: "Top base a", min: 90, max: 170, defaultValue: 120, step: 10 },
      { key: "b", label: "Bottom base b", min: 170, max: 280, defaultValue: 230, step: 10 },
      { key: "height", label: "Height h", min: 100, max: 170, defaultValue: 130, step: 10 },
      { key: "offset", label: "Offset", min: 20, max: 90, defaultValue: 50, step: 10 },
    ],
    steps: [
      { id: "one", title: "Show one trapezoid", description: "The parallel sides are a and b.", focusLabel: "a and b" },
      { id: "height", title: "Show height", description: "The perpendicular distance is h.", focusLabel: "h" },
      { id: "copy", title: "Duplicate", description: "Make a congruent copy.", focusLabel: "two trapezoids" },
      { id: "rotate", title: "Rotate and translate", description: "Move the copy beside the original.", focusLabel: "duplication" },
      { id: "parallelogram", title: "Form parallelogram", description: "Together they form a parallelogram of base a + b.", focusLabel: "a + b" },
      { id: "formula", title: "Take half", description: "One trapezoid is half of (a + b)h.", focusLabel: "1/2(a + b)h" },
    ],
    formulas: ["Two trapezoids = parallelogram", "Parallelogram base = a + b", "Parallelogram area = (a + b)h", "One trapezoid area = 1/2(a + b)h"],
    notes: "This covers both names: trapezoid and trapezium. The duplicated pair makes a parallelogram, so one original shape is half.",
    questions: commonQuestions,
    toggles: { labels: "Show labels", formula: "Show formula", secondary: "Animate duplication" },
  },
  PolygonInteriorAngleSumProof: {
    kind: "PolygonInteriorAngleSumProof",
    parameters: [{ key: "sides", label: "Number of sides n", min: 3, max: 12, defaultValue: 5, step: 1 }],
    steps: [
      { id: "polygon", title: "Show polygon", description: "Begin with an n-sided polygon.", focusLabel: "n sides" },
      { id: "vertex", title: "Pick one vertex", description: "Choose a single vertex as the triangulation anchor.", focusLabel: "anchor" },
      { id: "diagonals", title: "Draw diagonals", description: "Draw diagonals to every non-adjacent vertex.", focusLabel: "diagonals" },
      { id: "count", title: "Count triangles", description: "The polygon splits into n - 2 triangles.", focusLabel: "n - 2" },
      { id: "sum", title: "Use triangle sums", description: "Each triangle contributes 180 degrees.", focusLabel: "180 degrees each" },
      { id: "formula", title: "State formula", description: "Interior angle sum = (n - 2) x 180 degrees.", focusLabel: "formula" },
    ],
    formulas: ["Number of sides = n", "Number of triangles = n - 2", "Each triangle angle sum = 180 degrees", "Polygon interior angle sum = (n - 2) x 180 degrees"],
    notes: "Triangulation turns the polygon angle problem into repeated triangle angle sums.",
    questions: ["What happens when n = 3?", "How many triangles do you see for a hexagon?", "Why do all triangles share the same anchor vertex?"],
    toggles: { labels: "Show angle sum", formula: "Show formula", secondary: "Irregular preview" },
  },
};
