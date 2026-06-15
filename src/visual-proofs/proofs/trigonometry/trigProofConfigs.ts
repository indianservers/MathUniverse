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

export type TrigProofMethod = {
  id: string;
  title: string;
  summary: string;
  steps: ProofStep[];
  formulas: string[];
  check: string;
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

const method = (id: string, title: string, summary: string, items: string[], formulas: string[], check: string): TrigProofMethod => ({
  id,
  title,
  summary,
  steps: items.map((item, index) => ({
    id: `${id}-step-${index + 1}`,
    title: item,
    description: item,
    focusLabel: item.toLowerCase(),
  })),
  formulas,
  check,
});

export function trigProofMethods(kind: TrigProofKind): TrigProofMethod[] {
  const methods: Record<TrigProofKind, TrigProofMethod[]> = {
    RightTriangleTrigRatiosProof: [
      method("side-ratio", "Side-ratio proof", "Start from one right triangle and name the side opposite, adjacent, and hypotenuse for theta.", ["Choose angle theta", "Mark opposite, adjacent, and hypotenuse", "Measure the three side lengths", "Form each ratio", "Change scale and notice ratios stay fixed"], ["sin theta = opposite / hypotenuse", "cos theta = adjacent / hypotenuse", "tan theta = opposite / adjacent"], "If the angle is fixed, similar triangles keep the same ratios."),
      method("similarity", "Similarity proof", "Overlay a smaller similar triangle to prove size changes do not change the trigonometric ratios.", ["Draw a second similar triangle", "Match corresponding angles", "Scale every side by the same factor", "Cancel the shared scale factor in each ratio", "Conclude the ratio depends only on theta"], ["k opposite / k hypotenuse = opposite / hypotenuse", "k adjacent / k hypotenuse = adjacent / hypotenuse"], "The common scale factor cancels."),
    ],
    UnitCircleSineCosineProof: [
      method("coordinate", "Coordinate proof", "Move a radius of length 1 around the circle and read its x and y coordinates.", ["Put point P on the unit circle", "Drop P to the x-axis", "Read horizontal coordinate as cos theta", "Read vertical coordinate as sin theta", "Track signs by quadrant"], ["P(theta) = (cos theta, sin theta)", "x = cos theta", "y = sin theta"], "Coordinates carry the signs automatically."),
      method("right-triangle", "Right-triangle proof", "Use the projection triangle inside the circle: hypotenuse is 1, so each side equals its ratio.", ["Draw the projection triangle", "Use hypotenuse = 1", "cos theta = adjacent / 1", "sin theta = opposite / 1", "So adjacent = cos theta and opposite = sin theta"], ["adjacent = cos theta", "opposite = sin theta"], "The unit radius turns ratios into actual lengths."),
    ],
    PythagoreanTrigIdentityProof: [
      method("unit-circle", "Unit-circle proof", "Apply Pythagoras to the projection triangle with hypotenuse 1.", ["Show radius 1", "Show legs cos theta and sin theta", "Apply a^2 + b^2 = c^2", "Substitute c = 1", "Get sin^2 theta + cos^2 theta = 1"], ["cos^2 theta + sin^2 theta = 1^2", "sin^2 theta + cos^2 theta = 1"], "The radius length never changes."),
      method("right-triangle", "Right-triangle normalization", "Divide every side of any right triangle by its hypotenuse.", ["Start with any right triangle", "Apply adjacent^2 + opposite^2 = hypotenuse^2", "Divide by hypotenuse^2", "Recognize adjacent/hypotenuse as cos theta", "Recognize opposite/hypotenuse as sin theta"], ["(adj/hyp)^2 + (opp/hyp)^2 = 1", "cos^2 theta + sin^2 theta = 1"], "The identity is Pythagoras after scaling the hypotenuse to 1."),
    ],
    TangentRatioIdentityProof: [
      method("ratio", "Projection-ratio proof", "Tangent is opposite over adjacent; on the unit circle those are sin theta and cos theta.", ["Build the projection triangle", "Opposite side is sin theta", "Adjacent side is cos theta", "tan theta = opposite / adjacent", "Substitute to get sin theta / cos theta"], ["tan theta = opposite / adjacent", "tan theta = sin theta / cos theta"], "Tangent fails exactly when the adjacent length is 0."),
      method("slope", "Slope proof", "Treat tangent as the slope of the radius line through the unit-circle point.", ["Point P is (cos theta, sin theta)", "Slope from origin to P is y / x", "Substitute y = sin theta and x = cos theta", "Slope = tan theta"], ["slope = y / x", "tan theta = sin theta / cos theta"], "Tangent is rise over run."),
    ],
    RadiansArcRadiusProof: [
      method("arc-over-radius", "Arc-over-radius proof", "Radians count how many radius lengths fit along the arc.", ["Highlight the radius", "Wrap copies of radius along the arc", "Count arc length s in radius units", "The count is s / r", "That count is theta radians"], ["theta = s / r"], "Radian measure is dimensionless because length divides length."),
      method("unit-circle", "Unit-circle proof", "On a unit circle, radius is 1, so the angle in radians equals the arc length.", ["Set r = 1", "Measure arc length s", "Use theta = s / 1", "So theta = s", "Scale up to any radius by dividing by r"], ["r = 1 implies theta = s"], "The unit circle is the measuring template."),
    ],
    ArcLengthFormulaProof: [
      method("rearrange", "Definition rearrangement", "Start with theta = s/r and multiply by r.", ["Use radian definition theta = s / r", "Multiply both sides by r", "Get r theta = s", "Rewrite as s = r theta", "Check full turn theta = 2pi"], ["theta = s / r", "s = r theta"], "The formula is just the radian definition solved for s."),
      method("proportion", "Circumference proportion", "Arc length is the same fraction of circumference as theta is of a full turn.", ["Full turn is 2pi radians", "Full circumference is 2pi r", "Arc fraction is theta / 2pi", "Arc length = fraction x circumference", "Simplify to r theta"], ["s = (theta / 2pi)(2pi r)", "s = r theta"], "The 2pi cancels."),
    ],
    TrigGraphsFromUnitCircleProof: [
      method("sine-trace", "Sine trace", "Track the y-coordinate of the rotating point as the angle increases.", ["Rotate point around unit circle", "Copy its height to the graph", "Mark max, zero, and min heights", "One full turn repeats the pattern", "Read amplitude 1 and period 2pi"], ["sin theta = y-coordinate", "amplitude = 1", "period = 2pi"], "The sine wave is circular height over time."),
      method("cosine-trace", "Cosine trace", "Track the x-coordinate of the same point to get the cosine graph.", ["Rotate point around unit circle", "Copy horizontal coordinate to the graph", "Cosine starts at 1", "One full turn repeats", "Compare phase with sine"], ["cos theta = x-coordinate", "cos theta = sin(theta + 90deg)"], "Cosine is the horizontal trace."),
    ],
    CosineAngleAdditionProof: [
      method("rotation-matrix", "Rotation-coordinate proof", "Rotate vector (cos alpha, sin alpha) by beta and read the x-coordinate.", ["Start with vector at alpha", "Apply a beta rotation", "Compute new x-coordinate", "Read x-coordinate as cos(alpha + beta)", "Equate the two x expressions"], ["x' = cos alpha cos beta - sin alpha sin beta", "x' = cos(alpha + beta)"], "The x-coordinate gives cosine."),
      method("dot-product", "Dot-product proof", "Compare the angle between two unit vectors using their dot product.", ["Use unit vectors at alpha and -beta", "Their angle gap is alpha + beta", "Dot product equals cosine of angle gap", "Expand coordinate dot product", "Match the cosine formula"], ["u dot v = cos(alpha + beta)", "u dot v = cos alpha cos beta - sin alpha sin beta"], "The same dot product has two names."),
    ],
    SineAngleAdditionProof: [
      method("rotation-matrix", "Rotation-coordinate proof", "Rotate vector (cos alpha, sin alpha) by beta and read the y-coordinate.", ["Start with vector at alpha", "Apply a beta rotation", "Compute new y-coordinate", "Read y-coordinate as sin(alpha + beta)", "Equate the two y expressions"], ["y' = sin alpha cos beta + cos alpha sin beta", "y' = sin(alpha + beta)"], "The y-coordinate gives sine."),
      method("cofunction", "From cosine addition", "Use sin x = cos(90deg - x) and the cosine addition formula.", ["Rewrite sin(alpha + beta) as cos(90deg - alpha - beta)", "Group as (90deg - alpha) - beta", "Apply cosine subtraction", "Convert cofunctions back to sine/cosine", "Get the sine addition formula"], ["sin x = cos(90deg - x)", "sin(alpha + beta) = sin alpha cos beta + cos alpha sin beta"], "Cofunction identities transfer the cosine formula to sine."),
    ],
    DoubleAngleIdentitiesProof: [
      method("substitution", "Angle-addition substitution", "Put alpha = beta = theta in the addition formulas.", ["Start with sine and cosine addition", "Set alpha = theta and beta = theta", "Combine identical sine terms", "Get sin 2theta", "Use Pythagorean identity for alternate cos 2theta forms"], ["sin 2theta = 2sin theta cos theta", "cos 2theta = cos^2 theta - sin^2 theta"], "Double angle is addition with equal angles."),
      method("geometry", "Unit-circle geometry check", "Watch the vector rotate twice as far and compare coordinates numerically.", ["Show theta radius", "Show 2theta radius", "Read sin 2theta and cos 2theta", "Compute right side formulas", "Confirm both readings match"], ["sin 2theta = 2sin theta cos theta", "cos 2theta = 1 - 2sin^2 theta"], "The numeric check moves with theta."),
    ],
    SineRuleProof: [
      method("circumcircle", "Circumcircle chord proof", "Every side is a chord, and a chord has length 2R times the sine of the opposite angle.", ["Draw circumcircle", "Pick side a as a chord", "Drop the radius helper", "Show a = 2R sin A", "Repeat for b and c", "Divide by sine"], ["a = 2R sin A", "a / sin A = 2R"], "All three ratios equal the same diameter 2R."),
      method("area", "Equal-area proof", "Compute the same triangle area using different side-angle pairs.", ["Area = 1/2 bc sin A", "Area = 1/2 ca sin B", "Area = 1/2 ab sin C", "Divide the equal area formulas by abc/2", "Get sine rule"], ["sin A / a = sin B / b = sin C / c"], "One area has three matching forms."),
    ],
    CosineRuleProof: [
      method("projection", "Projection proof", "Resolve side b into horizontal and vertical components, then apply Pythagoras.", ["Place side a on the x-axis", "Resolve b into b cos C and b sin C", "Horizontal gap is a - b cos C", "Apply Pythagoras to c", "Simplify using sin^2 C + cos^2 C = 1"], ["c^2 = (a - b cos C)^2 + (b sin C)^2", "c^2 = a^2 + b^2 - 2ab cos C"], "The cross term comes from the horizontal gap."),
      method("pythagoras-special", "Pythagoras connection", "Let C become 90 degrees and the formula collapses to the Pythagorean theorem.", ["Set C = 90deg", "cos 90deg = 0", "The middle term disappears", "Get c^2 = a^2 + b^2", "Move C away from 90deg to see correction term"], ["c^2 = a^2 + b^2 - 2ab cos C"], "Cosine rule is Pythagoras plus an angle correction."),
    ],
    ComplementaryAngleIdentitiesProof: [
      method("side-role", "Side-role proof", "The same side has two names when viewed from complementary angles.", ["Mark theta", "Mark 90deg - theta", "Find side opposite theta", "Notice it is adjacent to 90deg - theta", "Write the two ratios"], ["sin theta = cos(90deg - theta)", "cos theta = sin(90deg - theta)"], "The side does not move; only the viewpoint changes."),
      method("unit-circle", "Unit-circle symmetry", "Complementary angles swap x and y coordinates across the line y = x.", ["Show angle theta", "Show complementary angle", "Reflect across y = x", "x and y coordinates swap", "Convert x/y to cos/sin"], ["sin theta = cos(90deg - theta)"], "The reflection swaps sine and cosine."),
    ],
    TriangleAreaSineFormulaProof: [
      method("altitude", "Altitude proof", "Drop the height from side b; that height is b sin C.", ["Use base a", "Drop altitude from the opposite vertex", "In the right triangle, height / b = sin C", "So height = b sin C", "Substitute into area = 1/2 base height"], ["height = b sin C", "Area = 1/2 ab sin C"], "It is the ordinary area formula with trig height."),
      method("two-sides-angle", "Included-angle check", "Rotate side b while side a stays fixed and watch only sin C control height.", ["Keep side a as base", "Rotate side b", "Observe height changes as sin C", "Area follows the height", "Area is largest when C = 90deg"], ["Area proportional to sin C", "Area = 1/2 ab sin C"], "Same two sides can make different areas depending on included angle."),
    ],
    SmallAngleApproximationProof: [
      method("squeeze", "Squeeze proof", "On the unit circle, sin theta is below the arc, and the arc is below tan theta.", ["Show sin theta segment", "Show arc length theta", "Show tangent segment", "Compare lengths", "As theta approaches 0, all three meet"], ["sin theta < theta < tan theta", "sin theta approx theta"], "The three lengths squeeze together near zero."),
      method("error", "Error comparison", "Numerically compare theta, sin theta, and tan theta as theta gets small.", ["Measure theta in radians", "Compute sin theta", "Compute tan theta", "Show absolute errors", "Move theta toward zero"], ["error = |theta - sin theta|", "error shrinks near 0"], "Radians are required because theta is an arc length."),
    ],
  };
  return methods[kind];
}

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
