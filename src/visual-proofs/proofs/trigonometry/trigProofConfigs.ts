import type { ProofStep, VisualProofComponentKey } from "../../data/proofTypes";

export type TrigProofKind = Extract<
  VisualProofComponentKey,
  | "RightTriangleTrigRatiosProof"
  | "UnitCircleSineCosineProof"
  | "PythagoreanTrigIdentityProof"
  | "TangentRatioIdentityProof"
  | "RadiansArcRadiusProof"
  | "ArcLengthFormulaProof"
  | "TrigGraphsFromUnitCircleProof"
  | "CosineAngleAdditionProof"
  | "SineAngleAdditionProof"
  | "DoubleAngleIdentitiesProof"
  | "SineRuleProof"
  | "CosineRuleProof"
  | "ComplementaryAngleIdentitiesProof"
  | "TriangleAreaSineFormulaProof"
  | "SmallAngleApproximationProof"
>;

export type TrigParameterKey = "theta" | "alpha" | "beta" | "radius" | "scale" | "a" | "b" | "c";

export type TrigParameter = {
  key: TrigParameterKey;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
};

export type TrigProofVisual = "right-triangle" | "unit-circle" | "arc" | "graphs" | "rotation" | "triangle-law" | "small-angle";

export type TrigProofConfig = {
  kind: TrigProofKind;
  visual: TrigProofVisual;
  parameters: TrigParameter[];
  steps: ProofStep[];
  formulas: string[];
  notes: string;
  questions: string[];
  toggles?: string[];
  degreeRadianToggle?: boolean;
};

const thetaSlider: TrigParameter = { key: "theta", label: "theta angle", min: 0, max: 360, defaultValue: 40, step: 1 };
const acuteThetaSlider: TrigParameter = { key: "theta", label: "theta angle", min: 5, max: 85, defaultValue: 35, step: 1 };
const radiusSlider: TrigParameter = { key: "radius", label: "radius r", min: 1, max: 6, defaultValue: 3, step: 0.5 };
const triangleQuestions = ["Which segment matches the formula term?", "What changes when the angle changes?", "Which quantity stays invariant during the proof?"];

const steps = (items: string[]): ProofStep[] => items.map((item, index) => ({
  id: `step-${index + 1}`,
  title: item,
  description: item,
  focusLabel: item.toLowerCase(),
}));

export const trigProofConfigs: Record<TrigProofKind, TrigProofConfig> = {
  RightTriangleTrigRatiosProof: {
    kind: "RightTriangleTrigRatiosProof",
    visual: "right-triangle",
    parameters: [acuteThetaSlider, { key: "scale", label: "triangle scale", min: 2, max: 7, defaultValue: 4, step: 0.5 }],
    steps: steps(["Show right triangle", "Highlight angle theta", "Highlight opposite side", "Highlight adjacent side", "Highlight hypotenuse", "Show sine ratio", "Show cosine ratio", "Show tangent ratio"]),
    formulas: ["sin theta = opposite / hypotenuse", "cos theta = adjacent / hypotenuse", "tan theta = opposite / adjacent"],
    notes: "Changing the size of a similar right triangle does not change sine, cosine, or tangent if theta stays fixed.",
    questions: triangleQuestions,
    toggles: ["Show similar triangle overlay", "Show ratio values"],
  },
  UnitCircleSineCosineProof: {
    kind: "UnitCircleSineCosineProof",
    visual: "unit-circle",
    parameters: [thetaSlider],
    steps: steps(["Show unit circle", "Show radius at theta", "Drop perpendicular projection", "Highlight x-coordinate as cos theta", "Highlight y-coordinate as sin theta", "Move through quadrants", "Show P(theta) = (cos theta, sin theta)"]),
    formulas: ["x = cos theta", "y = sin theta", "P(theta) = (cos theta, sin theta)"],
    notes: "The signs of sine and cosine come directly from the quadrant of the moving point.",
    questions: ["Which coordinate is cosine?", "Which coordinate is sine?", "How do signs change by quadrant?"],
    toggles: ["Show projections", "Show quadrant labels", "Show coordinate values"],
    degreeRadianToggle: true,
  },
  PythagoreanTrigIdentityProof: {
    kind: "PythagoreanTrigIdentityProof",
    visual: "unit-circle",
    parameters: [thetaSlider],
    steps: steps(["Show radius 1", "Show projection triangle", "Label horizontal leg cos theta", "Label vertical leg sin theta", "Apply Pythagorean theorem", "Show identity", "Animate theta while identity remains true"]),
    formulas: ["cos^2 theta + sin^2 theta = 1^2", "sin^2 theta + cos^2 theta = 1"],
    notes: "The identity is just Pythagoras applied to the unit-circle projection triangle.",
    questions: ["Why is the hypotenuse 1?", "What are the two legs?", "Why does the sum stay fixed?"],
    toggles: ["Show projection triangle", "Show squared-area hint"],
    degreeRadianToggle: true,
  },
  TangentRatioIdentityProof: {
    kind: "TangentRatioIdentityProof",
    visual: "unit-circle",
    parameters: [{ key: "theta", label: "theta angle", min: -80, max: 80, defaultValue: 35, step: 1 }],
    steps: steps(["Show right triangle", "Highlight opposite as sin theta", "Highlight adjacent as cos theta", "Show tangent as opposite over adjacent", "Substitute sine and cosine", "Show tangent line interpretation"]),
    formulas: ["tan theta = opposite / adjacent", "opposite = sin theta", "adjacent = cos theta", "tan theta = sin theta / cos theta"],
    notes: "Tangent is undefined when cos theta = 0 because the adjacent side is zero.",
    questions: ["Where is the rise?", "Where is the run?", "What happens near 90 degrees?"],
    toggles: ["Show tangent line", "Show ratio calculation"],
    degreeRadianToggle: true,
  },
  RadiansArcRadiusProof: {
    kind: "RadiansArcRadiusProof",
    visual: "arc",
    parameters: [radiusSlider, { key: "theta", label: "theta angle", min: 15, max: 270, defaultValue: 115, step: 1 }],
    steps: steps(["Show circle and radius r", "Highlight central angle theta", "Highlight arc length s", "Lay radius length along arc", "Count radius lengths on the arc", "Show theta = s/r"]),
    formulas: ["theta radians = s / r", "For unit circle r = 1: theta = s"],
    notes: "Radians measure angles by comparing arc length with radius length.",
    questions: ["How many radii fit on the arc?", "Why does the unit circle make theta equal arc length?", "What changes when r changes?"],
    toggles: ["Show radius copies", "Show arc labels"],
    degreeRadianToggle: true,
  },
  ArcLengthFormulaProof: {
    kind: "ArcLengthFormulaProof",
    visual: "arc",
    parameters: [radiusSlider, { key: "theta", label: "theta angle", min: 6, max: 360, defaultValue: 120, step: 1 }],
    steps: steps(["Show radius r", "Show angle theta in radians", "Highlight arc length s", "Use theta = s/r", "Rearrange to s = r theta", "Compare with full circumference"]),
    formulas: ["theta = s / r", "s = r theta", "If theta = 2pi, then s = 2pi r"],
    notes: "The formula s = r theta works when theta is measured in radians.",
    questions: ["Why must theta be in radians?", "How does s change if r doubles?", "What happens at theta = 2pi?"],
    toggles: ["Show circumference comparison"],
    degreeRadianToggle: true,
  },
  TrigGraphsFromUnitCircleProof: {
    kind: "TrigGraphsFromUnitCircleProof",
    visual: "graphs",
    parameters: [thetaSlider],
    steps: steps(["Show unit circle", "Move point around circle", "Trace y-coordinate to sine graph", "Trace x-coordinate to cosine graph", "Show one full cycle", "Highlight amplitude and period"]),
    formulas: ["sin theta = y-coordinate on unit circle", "cos theta = x-coordinate on unit circle", "Period = 2pi", "Amplitude = 1"],
    notes: "Sine and cosine graphs are coordinate traces of circular motion.",
    questions: ["Where does the sine wave reach 1?", "Where does cosine start?", "Why is the period 2pi?"],
    toggles: ["Show sine graph", "Show cosine graph", "Show key points"],
    degreeRadianToggle: true,
  },
  CosineAngleAdditionProof: {
    kind: "CosineAngleAdditionProof",
    visual: "rotation",
    parameters: [{ key: "alpha", label: "alpha", min: 0, max: 160, defaultValue: 35, step: 1 }, { key: "beta", label: "beta", min: 0, max: 160, defaultValue: 40, step: 1 }],
    steps: steps(["Show vector at alpha", "Show rotation by beta", "Show resulting alpha plus beta", "Show rotation transformation", "Highlight final x-coordinate", "Derive cosine addition"]),
    formulas: ["Initial vector: (cos alpha, sin alpha)", "x' = cos alpha cos beta - sin alpha sin beta", "x' = cos(alpha + beta)", "cos(alpha + beta) = cos alpha cos beta - sin alpha sin beta"],
    notes: "Cosine of the sum is the x-projection of a rotated unit vector.",
    questions: ["Which coordinate gives cosine?", "What does beta rotate?", "Where does the minus term enter?"],
    toggles: ["Show coordinate projections", "Show rotation matrix helper"],
    degreeRadianToggle: true,
  },
  SineAngleAdditionProof: {
    kind: "SineAngleAdditionProof",
    visual: "rotation",
    parameters: [{ key: "alpha", label: "alpha", min: 0, max: 160, defaultValue: 35, step: 1 }, { key: "beta", label: "beta", min: 0, max: 160, defaultValue: 40, step: 1 }],
    steps: steps(["Show vector at alpha", "Rotate by beta", "Show final vector", "Highlight final y-coordinate", "Show y-coordinate expression", "Derive sine addition"]),
    formulas: ["Initial vector: (cos alpha, sin alpha)", "y' = sin alpha cos beta + cos alpha sin beta", "y' = sin(alpha + beta)", "sin(alpha + beta) = sin alpha cos beta + cos alpha sin beta"],
    notes: "Sine of the sum is the y-projection of a rotated unit vector.",
    questions: ["Which coordinate gives sine?", "What happens to the y-projection?", "Why are both terms positive?"],
    toggles: ["Show coordinate projections", "Show rotation matrix helper"],
    degreeRadianToggle: true,
  },
  DoubleAngleIdentitiesProof: {
    kind: "DoubleAngleIdentitiesProof",
    visual: "rotation",
    parameters: [thetaSlider],
    steps: steps(["Show angle theta", "Duplicate theta", "Show combined angle 2theta", "Substitute in sine addition", "Substitute in cosine addition", "Derive equivalent cosine forms"]),
    formulas: ["sin(theta + theta) = sin theta cos theta + cos theta sin theta", "sin 2theta = 2 sin theta cos theta", "cos 2theta = cos^2 theta - sin^2 theta", "cos 2theta = 1 - 2sin^2 theta = 2cos^2 theta - 1"],
    notes: "Double-angle identities are angle-addition identities with alpha and beta both equal to theta.",
    questions: ["Where do the two theta arcs appear?", "How do like terms combine?", "Which identity creates equivalent cosine forms?"],
    toggles: ["Show sine identity", "Show cosine identity", "Show equivalent forms"],
    degreeRadianToggle: true,
  },
  SineRuleProof: {
    kind: "SineRuleProof",
    visual: "triangle-law",
    parameters: [{ key: "a", label: "triangle shape", min: 25, max: 65, defaultValue: 42, step: 1 }],
    steps: steps(["Show triangle ABC", "Show circumcircle radius R", "Highlight side a opposite angle A", "Use chord relation a = 2R sin A", "Repeat for b and c", "Show all ratios equal 2R"]),
    formulas: ["a = 2R sin A", "b = 2R sin B", "c = 2R sin C", "a/sin A = b/sin B = c/sin C = 2R"],
    notes: "Each side of the triangle is a chord of the circumcircle.",
    questions: ["Which angle faces side a?", "Where is the shared radius R?", "Why do all ratios equal 2R?"],
    toggles: ["Show circumcircle", "Show chord relation"],
  },
  CosineRuleProof: {
    kind: "CosineRuleProof",
    visual: "triangle-law",
    parameters: [{ key: "a", label: "side a", min: 3, max: 8, defaultValue: 6, step: 0.5 }, { key: "b", label: "side b", min: 3, max: 8, defaultValue: 5, step: 0.5 }, { key: "theta", label: "included angle C", min: 25, max: 140, defaultValue: 65, step: 1 }],
    steps: steps(["Show triangle with sides a, b, c", "Place side a on x-axis", "Show included angle C", "Resolve side b into projections", "Show distance a - b cos C", "Apply Pythagoras", "Simplify using sin^2 C + cos^2 C = 1"]),
    formulas: ["c^2 = (a - b cos C)^2 + (b sin C)^2", "c^2 = a^2 - 2ab cos C + b^2cos^2 C + b^2sin^2 C", "c^2 = a^2 + b^2 - 2ab cos C"],
    notes: "When C = 90 degrees, cos C = 0 and the cosine rule becomes Pythagoras.",
    questions: ["Which segment is b cos C?", "Which segment is b sin C?", "What happens at C = 90 degrees?"],
    toggles: ["Show projections", "Show coordinate proof"],
    degreeRadianToggle: true,
  },
  ComplementaryAngleIdentitiesProof: {
    kind: "ComplementaryAngleIdentitiesProof",
    visual: "right-triangle",
    parameters: [acuteThetaSlider, { key: "scale", label: "triangle scale", min: 2, max: 7, defaultValue: 4, step: 0.5 }],
    steps: steps(["Show right triangle", "Highlight theta", "Highlight 90 degrees minus theta", "Highlight side opposite theta", "Show same side adjacent to complement", "Derive cofunction identities"]),
    formulas: ["sin theta = opposite to theta / hypotenuse", "cos(90deg - theta) = adjacent to complement / hypotenuse", "sin theta = cos(90deg - theta)", "cos theta = sin(90deg - theta)"],
    notes: "The two acute angles in a right triangle are complementary and share the same side roles in opposite ways.",
    questions: triangleQuestions,
    toggles: ["Show ratio comparison"],
  },
  TriangleAreaSineFormulaProof: {
    kind: "TriangleAreaSineFormulaProof",
    visual: "triangle-law",
    parameters: [{ key: "a", label: "side a", min: 3, max: 8, defaultValue: 6, step: 0.5 }, { key: "b", label: "side b", min: 3, max: 8, defaultValue: 5, step: 0.5 }, { key: "theta", label: "included angle C", min: 20, max: 140, defaultValue: 55, step: 1 }],
    steps: steps(["Show triangle with sides a and b", "Highlight included angle C", "Drop perpendicular height", "Show height = b sin C", "Substitute into area formula", "Show A = 1/2 ab sin C"]),
    formulas: ["Area = 1/2 x base x height", "base = a", "height = b sin C", "Area = 1/2 ab sin C"],
    notes: "The sine formula is the ordinary triangle area formula with height written using trigonometry.",
    questions: ["Where is the altitude?", "Why is height b sin C?", "Which two sides surround angle C?"],
    toggles: ["Show altitude", "Show right-triangle helper"],
    degreeRadianToggle: true,
  },
  SmallAngleApproximationProof: {
    kind: "SmallAngleApproximationProof",
    visual: "small-angle",
    parameters: [{ key: "theta", label: "theta angle", min: 0.5, max: 45, defaultValue: 12, step: 0.5 }],
    steps: steps(["Show unit circle", "Show small angle theta", "Highlight sin theta", "Highlight arc length theta", "Highlight tan theta", "Compare lengths", "Zoom near zero"]),
    formulas: ["For 0 < theta < pi/2:", "sin theta < theta < tan theta", "For small theta in radians: sin theta is approximately theta", "tan theta is approximately theta"],
    notes: "The approximation only works when theta is measured in radians.",
    questions: ["Which length is smallest?", "Why must theta be in radians?", "How does the error shrink near zero?"],
    toggles: ["Zoom near origin", "Show comparison table", "Show inequality"],
    degreeRadianToggle: true,
  },
};
