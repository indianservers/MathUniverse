import type { ProofStep, VisualProofComponentKey } from "../../data/proofTypes";

export type CoordinateProofKind = Extract<
  VisualProofComponentKey,
  | "DistanceFormulaProof"
  | "MidpointFormulaProof"
  | "SectionFormulaProof"
  | "SlopeFormulaProof"
  | "SlopeInterceptLineEquationProof"
  | "PointSlopeLineEquationProof"
  | "ParallelLinesSlopeProof"
  | "PerpendicularLinesSlopeProof"
  | "TriangleAreaCoordinatesProof"
  | "CircleEquationProof"
  | "TranslationOfPointsProof"
  | "ReflectionAcrossAxesProof"
  | "RotationAboutOriginProof"
  | "ScalingDilationOriginProof"
  | "CoordinateProofPythagoreanProof"
>;

export type CoordinateParameterKey = "x1" | "y1" | "x2" | "y2" | "x3" | "y3" | "m" | "n" | "c" | "dx" | "dy" | "radius" | "theta" | "scale";

export type CoordinateParameter = {
  key: CoordinateParameterKey;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
};

export type CoordinateVisual = "segment" | "line" | "two-lines" | "triangle" | "circle" | "transform" | "pythagorean";

export type CoordinateProofConfig = {
  kind: CoordinateProofKind;
  visual: CoordinateVisual;
  parameters: CoordinateParameter[];
  steps: ProofStep[];
  formulas: string[];
  notes: string;
  questions: string[];
  toggles?: string[];
};

const pointAB = [
  { key: "x1", label: "A x1", min: -8, max: 8, defaultValue: -4, step: 1 },
  { key: "y1", label: "A y1", min: -6, max: 6, defaultValue: -2, step: 1 },
  { key: "x2", label: "B x2", min: -8, max: 8, defaultValue: 5, step: 1 },
  { key: "y2", label: "B y2", min: -6, max: 6, defaultValue: 4, step: 1 },
] satisfies CoordinateParameter[];

const steps = (items: string[]): ProofStep[] => items.map((item, index) => ({
  id: `step-${index + 1}`,
  title: item,
  description: item,
  focusLabel: item.toLowerCase(),
}));

const gridQuestions = ["Which coordinate difference matches the highlighted segment?", "How does the formula change when a point moves?", "Which geometric object explains the algebra?"];

export const coordinateProofConfigs: Record<CoordinateProofKind, CoordinateProofConfig> = {
  DistanceFormulaProof: {
    kind: "DistanceFormulaProof",
    visual: "segment",
    parameters: pointAB,
    steps: steps(["Show coordinate plane with A and B", "Draw segment AB", "Draw horizontal difference delta x", "Draw vertical difference delta y", "Show right triangle", "Apply Pythagorean theorem", "Show distance formula"]),
    formulas: ["AB^2 = (x2 - x1)^2 + (y2 - y1)^2", "AB = sqrt((x2 - x1)^2 + (y2 - y1)^2)"],
    notes: "The distance formula is the Pythagorean theorem applied to horizontal and vertical coordinate differences.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show projection triangle", "Show numeric substitution"],
  },
  MidpointFormulaProof: {
    kind: "MidpointFormulaProof",
    visual: "segment",
    parameters: pointAB,
    steps: steps(["Show A and B", "Draw segment AB", "Mark halfway horizontally", "Mark halfway vertically", "Locate midpoint M", "Show coordinate averages"]),
    formulas: ["Mx = (x1 + x2) / 2", "My = (y1 + y2) / 2", "M = ((x1 + x2)/2, (y1 + y2)/2)"],
    notes: "The midpoint averages x-coordinates and y-coordinates separately.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show midpoint construction", "Show coordinate averages"],
  },
  SectionFormulaProof: {
    kind: "SectionFormulaProof",
    visual: "segment",
    parameters: [...pointAB, { key: "m", label: "ratio m", min: 1, max: 6, defaultValue: 2, step: 1 }, { key: "n", label: "ratio n", min: 1, max: 6, defaultValue: 3, step: 1 }],
    steps: steps(["Show A and B", "Show segment AB", "Select ratio AP:PB = m:n", "Move P to divide the segment", "Show weighted coordinate average", "Show section formula"]),
    formulas: ["AP:PB = m:n", "P = ((mx2 + nx1)/(m+n), (my2 + ny1)/(m+n))"],
    notes: "A section point is a weighted average. A larger m pulls the point toward B because AP is m parts.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show ratio labels", "Show numeric substitution"],
  },
  SlopeFormulaProof: {
    kind: "SlopeFormulaProof",
    visual: "segment",
    parameters: pointAB,
    steps: steps(["Show points A and B", "Draw line through A and B", "Draw horizontal run", "Draw vertical rise", "Show slope triangle", "Derive slope formula", "Show special cases"]),
    formulas: ["slope = rise / run", "m = (y2 - y1) / (x2 - x1)"],
    notes: "Slope measures vertical change per horizontal change. Vertical lines have undefined slope.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show slope triangle", "Show slope value"],
  },
  SlopeInterceptLineEquationProof: {
    kind: "SlopeInterceptLineEquationProof",
    visual: "line",
    parameters: [{ key: "m", label: "slope m", min: -4, max: 4, defaultValue: 1.5, step: 0.5 }, { key: "c", label: "intercept c", min: -6, max: 6, defaultValue: 2, step: 1 }],
    steps: steps(["Show y-intercept c", "Plot point (0,c)", "Use slope as rise/run", "Generate another point", "Draw the line", "Show y = mx + c"]),
    formulas: ["y = mx + c", "m = slope", "c = y-intercept"],
    notes: "The intercept anchors the line; the slope controls the tilt.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show rise/run triangle", "Show intercept"],
  },
  PointSlopeLineEquationProof: {
    kind: "PointSlopeLineEquationProof",
    visual: "line",
    parameters: [{ key: "x1", label: "point x1", min: -6, max: 6, defaultValue: -2, step: 1 }, { key: "y1", label: "point y1", min: -5, max: 5, defaultValue: 1, step: 1 }, { key: "m", label: "slope m", min: -4, max: 4, defaultValue: 1, step: 0.5 }, { key: "x2", label: "moving x", min: -8, max: 8, defaultValue: 4, step: 1 }],
    steps: steps(["Show point P", "Draw line with slope m through P", "Pick moving point Q", "Show rise y-y1", "Show run x-x1", "Use slope = rise/run", "Rearrange to point-slope form"]),
    formulas: ["m = (y - y1) / (x - x1)", "y - y1 = m(x - x1)"],
    notes: "Point-slope form records one known point and the constant slope to every other point on the line.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show slope triangle", "Show equation"],
  },
  ParallelLinesSlopeProof: {
    kind: "ParallelLinesSlopeProof",
    visual: "two-lines",
    parameters: [{ key: "m", label: "slope m1", min: -3, max: 3, defaultValue: 1, step: 0.5 }, { key: "n", label: "slope m2", min: -3, max: 3, defaultValue: 1, step: 0.5 }, { key: "c", label: "intercept gap", min: 1, max: 6, defaultValue: 3, step: 1 }],
    steps: steps(["Show first line with slope m1", "Show second line with slope m2", "Match slopes", "Show equal rise/run triangles", "Show constant separation", "Conclude equal slopes imply parallel lines"]),
    formulas: ["Line 1: y = m1x + c1", "Line 2: y = m2x + c2", "If m1 = m2 and c1 != c2, the lines are parallel."],
    notes: "Parallel non-vertical lines have the same rise/run pattern everywhere.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show slope triangles", "Show slope comparison"],
  },
  PerpendicularLinesSlopeProof: {
    kind: "PerpendicularLinesSlopeProof",
    visual: "two-lines",
    parameters: [{ key: "m", label: "slope m1", min: -4, max: 4, defaultValue: 1, step: 0.5 }],
    steps: steps(["Show line with slope m", "Show slope triangle", "Rotate line by 90 degrees", "New slope is negative reciprocal", "Show m2 = -1/m1", "Show product equals -1"]),
    formulas: ["m2 = -1/m1", "m1 x m2 = -1", "Horizontal lines are perpendicular to vertical lines."],
    notes: "A 90 degree rotation swaps rise and run and changes one sign.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show right angle marker", "Show product calculation"],
  },
  TriangleAreaCoordinatesProof: {
    kind: "TriangleAreaCoordinatesProof",
    visual: "triangle",
    parameters: [{ key: "x1", label: "A x", min: -7, max: 7, defaultValue: -4, step: 1 }, { key: "y1", label: "A y", min: -6, max: 6, defaultValue: -2, step: 1 }, { key: "x2", label: "B x", min: -7, max: 7, defaultValue: 4, step: 1 }, { key: "y2", label: "B y", min: -6, max: 6, defaultValue: -1, step: 1 }, { key: "x3", label: "C x", min: -7, max: 7, defaultValue: 1, step: 1 }, { key: "y3", label: "C y", min: -6, max: 6, defaultValue: 5, step: 1 }],
    steps: steps(["Show triangle ABC", "Show coordinate table", "Show shoelace pattern", "Highlight positive products", "Highlight negative products", "Take half of absolute difference", "Show final area"]),
    formulas: ["Area = 1/2 |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|"],
    notes: "The coordinate area formula is the determinant/shoelace area of the polygon.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show shoelace table", "Show area fill"],
  },
  CircleEquationProof: {
    kind: "CircleEquationProof",
    visual: "circle",
    parameters: [{ key: "x1", label: "center h", min: -5, max: 5, defaultValue: 1, step: 1 }, { key: "y1", label: "center k", min: -5, max: 5, defaultValue: -1, step: 1 }, { key: "radius", label: "radius r", min: 1, max: 5, defaultValue: 4, step: 0.5 }, { key: "theta", label: "point angle", min: 0, max: 360, defaultValue: 40, step: 1 }],
    steps: steps(["Show center", "Show radius r", "Show point P on circle", "Draw right triangle from center to P", "Apply distance formula", "Set distance equal to radius", "Show circle equation"]),
    formulas: ["CP^2 = (x - h)^2 + (y - k)^2", "Since CP = r: (x - h)^2 + (y - k)^2 = r^2"],
    notes: "A circle equation is the distance formula with distance fixed at r.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show radius triangle", "Show equation substitution"],
  },
  TranslationOfPointsProof: {
    kind: "TranslationOfPointsProof",
    visual: "transform",
    parameters: [{ key: "x1", label: "P x", min: -6, max: 6, defaultValue: -2, step: 1 }, { key: "y1", label: "P y", min: -5, max: 5, defaultValue: 1, step: 1 }, { key: "dx", label: "translation a", min: -6, max: 6, defaultValue: 4, step: 1 }, { key: "dy", label: "translation b", min: -6, max: 6, defaultValue: 3, step: 1 }],
    steps: steps(["Show original point", "Show translation vector", "Move every point by same vector", "Show new coordinates", "Show size and orientation unchanged"]),
    formulas: ["P(x, y) -> P'(x + a, y + b)"],
    notes: "Translation changes position but preserves shape, size, and orientation.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show vector arrows", "Show triangle mode"],
  },
  ReflectionAcrossAxesProof: {
    kind: "ReflectionAcrossAxesProof",
    visual: "transform",
    parameters: [{ key: "x1", label: "P x", min: -7, max: 7, defaultValue: 4, step: 1 }, { key: "y1", label: "P y", min: -6, max: 6, defaultValue: 3, step: 1 }, { key: "n", label: "mode 1 x-axis, 2 y-axis, 3 origin", min: 1, max: 3, defaultValue: 1, step: 1 }],
    steps: steps(["Show original point", "Select reflection axis", "Draw perpendicular distance", "Animate reflection", "Show new coordinates", "Show sign-change rule"]),
    formulas: ["Across x-axis: (x,y) -> (x,-y)", "Across y-axis: (x,y) -> (-x,y)", "Across origin: (x,y) -> (-x,-y)"],
    notes: "Reflection keeps distance to the mirror line equal and changes coordinate signs predictably.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show mirror construction", "Show coordinates"],
  },
  RotationAboutOriginProof: {
    kind: "RotationAboutOriginProof",
    visual: "transform",
    parameters: [{ key: "x1", label: "P x", min: -6, max: 6, defaultValue: 4, step: 1 }, { key: "y1", label: "P y", min: -5, max: 5, defaultValue: 2, step: 1 }, { key: "theta", label: "rotation angle", min: 0, max: 360, defaultValue: 90, step: 15 }],
    steps: steps(["Show point P and origin", "Draw radius OP", "Rotate by theta", "Show P prime", "Show special-case formulas", "Show general rotation formula"]),
    formulas: ["x' = x cos theta - y sin theta", "y' = x sin theta + y cos theta", "90 deg: (x,y) -> (-y,x)", "180 deg: (x,y) -> (-x,-y)", "270 deg: (x,y) -> (y,-x)"],
    notes: "Rotation about the origin preserves distance from the origin while changing direction.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show circular path", "Show formula"],
  },
  ScalingDilationOriginProof: {
    kind: "ScalingDilationOriginProof",
    visual: "transform",
    parameters: [{ key: "x1", label: "P x", min: -5, max: 5, defaultValue: 3, step: 1 }, { key: "y1", label: "P y", min: -5, max: 5, defaultValue: 2, step: 1 }, { key: "scale", label: "scale factor k", min: -2, max: 3, defaultValue: 1.5, step: 0.25 }],
    steps: steps(["Show original point", "Show scale factor k", "Draw ray from origin", "Move point along ray", "Show new coordinates", "Show distances multiplied by k"]),
    formulas: ["P(x, y) -> P'(kx, ky)", "k > 1 enlargement", "0 < k < 1 reduction", "k < 0 reversal through origin"],
    notes: "Dilation from the origin multiplies every coordinate by the same scale factor.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show rays from origin", "Show triangle mode"],
  },
  CoordinateProofPythagoreanProof: {
    kind: "CoordinateProofPythagoreanProof",
    visual: "pythagorean",
    parameters: [{ key: "x2", label: "leg a", min: 2, max: 8, defaultValue: 5, step: 1 }, { key: "y3", label: "leg b", min: 2, max: 7, defaultValue: 4, step: 1 }],
    steps: steps(["Place A at origin", "Place B at (a,0)", "Place C at (0,b)", "Label legs a and b", "Draw hypotenuse c", "Apply distance formula to BC", "Derive c^2 = a^2 + b^2"]),
    formulas: ["B(a,0), C(0,b)", "c^2 = (a - 0)^2 + (0 - b)^2", "c^2 = a^2 + b^2"],
    notes: "The coordinate proof places the right triangle on axes so the distance formula becomes Pythagoras.",
    questions: gridQuestions,
    toggles: ["Show grid", "Show distance formula", "Show squares on sides"],
  },
};
