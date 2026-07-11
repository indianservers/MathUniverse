export type TrigFormulaId =
  | "sin"
  | "cos"
  | "tan"
  | "cot"
  | "sec"
  | "cosec"
  | "reciprocal-sin-cosec"
  | "reciprocal-cos-sec"
  | "reciprocal-tan-cot"
  | "tan-ratio"
  | "cot-ratio"
  | "sin-square"
  | "cos-square"
  | "pythagorean"
  | "pythagorean-tan"
  | "pythagorean-cot"
  | "even-sin"
  | "even-cos"
  | "even-tan"
  | "comp-sin"
  | "comp-cos"
  | "comp-tan"
  | "comp-sec"
  | "comp-cosec"
  | "comp-cot"
  | "periodic-sin"
  | "periodic-cos"
  | "periodic-tan"
  | "angle-sum-sin"
  | "angle-sum-cos"
  | "angle-diff-sin"
  | "angle-diff-cos"
  | "double-sin"
  | "double-cos"
  | "basic-sin-from-cosec"
  | "basic-cos-from-sec"
  | "basic-tan-from-cot"
  | "basic-cosec-from-sin"
  | "basic-sec-from-cos"
  | "basic-cot-from-tan";

export type ExplanationLevel = "simple" | "detailed" | "memory";

export type TrigFormulaGroupId =
  | "basic-ratios"
  | "quotient-identities"
  | "pythagorean-identities"
  | "reciprocal-identities"
  | "even-odd-identities"
  | "complementary-angle-identities"
  | "periodic-identities"
  | "sum-difference-identities"
  | "double-angle-identities"
  | "phase-one-squares"
  | "basic-flip-formulas";

export type TrigFormulaDefinition = {
  id: TrigFormulaId;
  groupId: TrigFormulaGroupId;
  label: string;
  formula: string;
  meaning: string;
  visualExplanation: string;
  explanations: Record<ExplanationLevel, string>;
};

export type TrigFormulaGroup = {
  id: TrigFormulaGroupId;
  title: string;
  description: string;
  formulaIds: TrigFormulaId[];
};

export type TrigFormulaValues = {
  degrees: number;
  radians: number;
  sin: number;
  cos: number;
  tan: number | null;
  cot: number | null;
  sec: number | null;
  cosec: number | null;
  sinSquare: number;
  cosSquare: number;
  tanSquare: number | null;
  cotSquare: number | null;
  secSquare: number | null;
  cosecSquare: number | null;
  identitySum: number;
  tanIdentitySum: number | null;
  cotIdentitySum: number | null;
  coordinate: { x: number; y: number };
  radiansLabel: string;
};

export type AngleUnit = "degrees" | "radians";

export const specialAngleMarkers = [0, 30, 45, 60, 90, 180, 270, 360] as const;

export const trigFormulaGroups: TrigFormulaGroup[] = [
  {
    id: "basic-ratios",
    title: "Basic ratios",
    description: "Read sine, cosine, tangent, and reciprocal ratios from the same moving angle.",
    formulaIds: ["sin", "cos", "tan", "cot", "sec", "cosec"],
  },
  {
    id: "reciprocal-identities",
    title: "Reciprocal identities",
    description: "Pair each trig function with the ratio that flips it to one.",
    formulaIds: ["reciprocal-sin-cosec", "reciprocal-cos-sec", "reciprocal-tan-cot"],
  },
  {
    id: "quotient-identities",
    title: "Quotient identities",
    description: "See tangent and cotangent as direct side comparisons.",
    formulaIds: ["tan-ratio", "cot-ratio"],
  },
  {
    id: "pythagorean-identities",
    title: "Pythagorean identities",
    description: "Connect unit-circle geometry to the three major square identities.",
    formulaIds: ["sin-square", "cos-square", "pythagorean", "pythagorean-tan", "pythagorean-cot"],
  },
  {
    id: "even-odd-identities",
    title: "Even/odd identities",
    description: "Mirror theta across the x-axis and watch signs change.",
    formulaIds: ["even-sin", "even-cos", "even-tan"],
  },
  {
    id: "complementary-angle-identities",
    title: "Complementary angle identities",
    description: "Swap the acute angles in a right triangle and watch opposite become adjacent.",
    formulaIds: ["comp-sin", "comp-cos", "comp-tan", "comp-sec", "comp-cosec", "comp-cot"],
  },
  {
    id: "periodic-identities",
    title: "Periodicity",
    description: "Add a full turn, or half a tangent turn, and see the same ratio return.",
    formulaIds: ["periodic-sin", "periodic-cos", "periodic-tan"],
  },
  {
    id: "sum-difference-identities",
    title: "Angle sum and difference",
    description: "Combine theta with a fixed helper angle to see compound-angle formulas update.",
    formulaIds: ["angle-sum-sin", "angle-sum-cos", "angle-diff-sin", "angle-diff-cos"],
  },
  {
    id: "double-angle-identities",
    title: "Double angle",
    description: "Double theta and compare the result with products and squares from the same circle.",
    formulaIds: ["double-sin", "double-cos"],
  },
  {
    id: "basic-flip-formulas",
    title: "Basic flip formulas",
    description: "Keep the six direct reciprocal formulas together for quick revision.",
    formulaIds: ["basic-sin-from-cosec", "basic-cos-from-sec", "basic-tan-from-cot", "basic-cosec-from-sin", "basic-sec-from-cos", "basic-cot-from-tan"],
  },
];

export const trigFormulaDefinitions: TrigFormulaDefinition[] = [
  formula("sin", "basic-ratios", "sin theta", "\\sin\\theta", "Vertical height", "sin theta is the vertical height of the point on the unit circle.", {
    simple: "sin theta is the height of the point on the unit circle.",
    detailed: "The unit-circle point has coordinates (cos theta, sin theta), so sine is the y-coordinate.",
    memory: "Sine goes up and down, so remember it as vertical height.",
  }),
  formula("cos", "basic-ratios", "cos theta", "\\cos\\theta", "Horizontal distance", "cos theta is the horizontal distance of the point from the origin.", {
    simple: "cos theta is the horizontal distance from the origin.",
    detailed: "The unit-circle point has x-coordinate cos theta, so cosine is the base of the right triangle.",
    memory: "Cosine is the across-the-floor distance.",
  }),
  formula("tan", "basic-ratios", "tan theta", "\\tan\\theta", "Tangent length", "tan theta is the signed height where the angle ray meets the tangent line x = 1.", {
    simple: "tan theta is the tangent-line height made by extending the angle ray.",
    detailed: "On the line x = 1, the same angle gives height tan theta, matching sin theta divided by cos theta.",
    memory: "Tangent is the tall outside line.",
  }),
  formula("cot", "basic-ratios", "cot theta", "\\cot\\theta", "Base compared to height", "cot theta compares cosine to sine, so it is the reciprocal of tangent.", {
    simple: "cot theta compares the base to the height.",
    detailed: "cot theta equals cos theta divided by sin theta whenever sin theta is not zero.",
    memory: "Cotangent flips tangent.",
  }),
  formula("sec", "basic-ratios", "sec theta", "\\sec\\theta", "Reciprocal cosine", "sec theta is the reciprocal of the horizontal cosine distance.", {
    simple: "sec theta is 1 divided by cos theta.",
    detailed: "As cos theta gets small near 90 degrees, sec theta grows because it is the reciprocal of cosine.",
    memory: "Secant sees cosine and flips it.",
  }),
  formula("cosec", "basic-ratios", "cosec theta", "\\csc\\theta", "Reciprocal sine", "cosec theta is the reciprocal of the vertical sine height.", {
    simple: "cosec theta is 1 divided by sin theta.",
    detailed: "As sin theta gets small near 0 degrees, cosec theta grows because it is the reciprocal of sine.",
    memory: "Cosecant sees sine and flips it.",
  }),
  formula("reciprocal-sin-cosec", "reciprocal-identities", "sin theta cosec theta", "\\sin\\theta\\cdot\\csc\\theta=1", "Sine reciprocal pair", "Sine and cosecant multiply to one whenever sine is not zero.", {
    simple: "cosec theta is 1 / sin theta, so multiplying them gives 1.",
    detailed: "The reciprocal relationship means sin theta · (1 / sin theta) = 1 for angles where sin theta is defined and non-zero.",
    memory: "Sine pairs with cosecant.",
  }),
  formula("reciprocal-cos-sec", "reciprocal-identities", "cos theta sec theta", "\\cos\\theta\\cdot\\sec\\theta=1", "Cosine reciprocal pair", "Cosine and secant multiply to one whenever cosine is not zero.", {
    simple: "sec theta is 1 / cos theta, so multiplying them gives 1.",
    detailed: "The reciprocal relationship means cos theta · (1 / cos theta) = 1 for angles where cos theta is defined and non-zero.",
    memory: "Cosine pairs with secant.",
  }),
  formula("reciprocal-tan-cot", "reciprocal-identities", "tan theta cot theta", "\\tan\\theta\\cdot\\cot\\theta=1", "Tangent reciprocal pair", "Tangent and cotangent multiply to one when both are defined.", {
    simple: "cot theta is 1 / tan theta, so their product is 1.",
    detailed: "Since tan theta = sin theta / cos theta and cot theta = cos theta / sin theta, the factors cancel to 1 when both ratios are defined.",
    memory: "Tangent pairs with cotangent.",
  }),
  formula("tan-ratio", "quotient-identities", "sin theta / cos theta", "\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}", "Height compared with base", "tan theta compares height to base: sin theta divided by cos theta.", {
    simple: "tan theta is height divided by base.",
    detailed: "In the unit-circle triangle, opposite = sin theta and adjacent = cos theta, so opposite / adjacent = tan theta.",
    memory: "Tangent is sine over cosine.",
  }),
  formula("cot-ratio", "quotient-identities", "cos theta / sin theta", "\\cot\\theta=\\frac{\\cos\\theta}{\\sin\\theta}", "Base compared with height", "cot theta compares base to height: cos theta divided by sin theta.", {
    simple: "cot theta is base divided by height.",
    detailed: "In the same triangle, adjacent = cos theta and opposite = sin theta, so adjacent / opposite = cot theta.",
    memory: "Cotangent is cosine over sine.",
  }),
  formula("sin-square", "phase-one-squares", "sin^2 theta", "\\sin^2\\theta", "Square on sine", "sin^2 theta is the area of a square whose side length is the sine height.", {
    simple: "sin squared is a square built on the sine height.",
    detailed: "Its area is side times side, so the side sin theta produces area sin^2 theta.",
    memory: "Square the height to get sin squared.",
  }),
  formula("cos-square", "phase-one-squares", "cos^2 theta", "\\cos^2\\theta", "Square on cosine", "cos^2 theta is the area of a square whose side length is the cosine width.", {
    simple: "cos squared is a square built on the cosine base.",
    detailed: "Its area is side times side, so the side cos theta produces area cos^2 theta.",
    memory: "Square the base to get cos squared.",
  }),
  formula("pythagorean", "pythagorean-identities", "sin^2 theta + cos^2 theta", "\\sin^2\\theta+\\cos^2\\theta=1", "Always one", "The sine square and cosine square always combine to the unit circle radius squared.", {
    simple: "On the unit circle, the triangle always has hypotenuse 1. So base^2 + height^2 is always 1.",
    detailed: "Since cos theta is the x-coordinate and sin theta is the y-coordinate, the point lies on x^2 + y^2 = 1. Therefore cos^2 theta + sin^2 theta = 1.",
    memory: "sin^2 + cos^2 is always 1 because both are sides inside the same unit circle triangle.",
  }),
  formula("pythagorean-tan", "pythagorean-identities", "1 + tan^2 theta", "1+\\tan^2\\theta=\\sec^2\\theta", "Tangent square identity", "Divide sin^2 theta + cos^2 theta = 1 by cos^2 theta to get 1 + tan^2 theta = sec^2 theta.", {
    simple: "The tangent version comes from dividing the unit-circle identity by cos^2 theta.",
    detailed: "sin^2/cos^2 becomes tan^2, cos^2/cos^2 becomes 1, and 1/cos^2 becomes sec^2.",
    memory: "One plus tan squared goes with sec squared.",
  }),
  formula("pythagorean-cot", "pythagorean-identities", "1 + cot^2 theta", "1+\\cot^2\\theta=\\csc^2\\theta", "Cotangent square identity", "Divide sin^2 theta + cos^2 theta = 1 by sin^2 theta to get 1 + cot^2 theta = cosec^2 theta.", {
    simple: "The cotangent version comes from dividing the unit-circle identity by sin^2 theta.",
    detailed: "cos^2/sin^2 becomes cot^2, sin^2/sin^2 becomes 1, and 1/sin^2 becomes cosec^2.",
    memory: "One plus cot squared goes with cosec squared.",
  }),
  formula("even-sin", "even-odd-identities", "sin(-theta)", "\\sin(-\\theta)=-\\sin\\theta", "Sine changes sign", "Mirroring theta across the x-axis flips the vertical height, so sine changes sign.", {
    simple: "Negative theta reflects the point below the x-axis, so sine becomes negative.",
    detailed: "The x-coordinate stays the same under reflection across the x-axis, but the y-coordinate changes sign. Since sine is y, sin(-theta) = -sin theta.",
    memory: "Sine is odd: the sign flips.",
  }),
  formula("even-cos", "even-odd-identities", "cos(-theta)", "\\cos(-\\theta)=\\cos\\theta", "Cosine stays same", "Mirroring theta across the x-axis keeps the horizontal distance the same.", {
    simple: "Negative theta keeps the same horizontal distance.",
    detailed: "Reflection across the x-axis does not change x-coordinate. Since cosine is x, cos(-theta) = cos theta.",
    memory: "Cosine is even: it keeps its sign.",
  }),
  formula("even-tan", "even-odd-identities", "tan(-theta)", "\\tan(-\\theta)=-\\tan\\theta", "Tangent changes sign", "Because tangent is sine divided by cosine, changing sine's sign changes tangent's sign.", {
    simple: "tan(-theta) changes sign because the height changes sign.",
    detailed: "sin(-theta) is negative while cos(-theta) is unchanged, so sin(-theta)/cos(-theta) = -tan theta.",
    memory: "Tangent is odd: the sign flips.",
  }),
  formula("comp-sin", "complementary-angle-identities", "sin(90 deg - theta)", "\\sin(90^{\\circ}-\\theta)=\\cos\\theta", "Opposite becomes adjacent", "In a right triangle, the opposite side for 90 deg - theta is the adjacent side for theta.", {
    simple: "The sine of the complementary angle equals the cosine of the original angle.",
    detailed: "The two acute angles in a right triangle add to 90 degrees, so switching angles swaps opposite and adjacent sides.",
    memory: "Co-functions come from complementary angles: sine becomes cosine.",
  }),
  formula("comp-cos", "complementary-angle-identities", "cos(90 deg - theta)", "\\cos(90^{\\circ}-\\theta)=\\sin\\theta", "Adjacent becomes opposite", "In a right triangle, the adjacent side for 90 deg - theta is the opposite side for theta.", {
    simple: "The cosine of the complementary angle equals the sine of the original angle.",
    detailed: "Switching to the other acute angle swaps adjacent and opposite sides, so cosine becomes sine.",
    memory: "Cosine becomes sine for 90 deg minus theta.",
  }),
  formula("comp-tan", "complementary-angle-identities", "tan(90 deg - theta)", "\\tan(90^{\\circ}-\\theta)=\\cot\\theta", "Ratio flips", "Changing to the complementary angle swaps opposite and adjacent, so tangent becomes cotangent.", {
    simple: "The tangent of the complementary angle is cotangent.",
    detailed: "For the other acute angle, opposite and adjacent switch places, so opposite / adjacent becomes adjacent / opposite.",
    memory: "Complementary tangent flips to cotangent.",
  }),
  formula("comp-sec", "complementary-angle-identities", "sec(90 deg - theta)", "\\sec(90^{\\circ}-\\theta)=\\csc\\theta", "Secant becomes cosecant", "Complementary angles swap cosine with sine, so secant swaps with cosecant.", {
    simple: "Secant of the complementary angle equals cosecant of the original angle.",
    detailed: "sec(90 deg - theta) = 1 / cos(90 deg - theta) = 1 / sin theta = cosec theta.",
    memory: "Co-functions swap: sec goes to cosec.",
  }),
  formula("comp-cosec", "complementary-angle-identities", "cosec(90 deg - theta)", "\\csc(90^{\\circ}-\\theta)=\\sec\\theta", "Cosecant becomes secant", "Complementary angles swap sine with cosine, so cosecant swaps with secant.", {
    simple: "Cosecant of the complementary angle equals secant of the original angle.",
    detailed: "cosec(90 deg - theta) = 1 / sin(90 deg - theta) = 1 / cos theta = sec theta.",
    memory: "Co-functions swap: cosec goes to sec.",
  }),
  formula("comp-cot", "complementary-angle-identities", "cot(90 deg - theta)", "\\cot(90^{\\circ}-\\theta)=\\tan\\theta", "Cotangent becomes tangent", "Complementary angles swap opposite and adjacent, so cotangent becomes tangent.", {
    simple: "Cotangent of the complementary angle equals tangent of the original angle.",
    detailed: "cot(90 deg - theta) flips the complementary tangent ratio, which returns tan theta.",
    memory: "Cotangent complements back to tangent.",
  }),
  formula("periodic-sin", "periodic-identities", "sin(theta + 360 deg)", "\\sin(\\theta+360^{\\circ})=\\sin\\theta", "Sine repeats every full turn", "After one full rotation, the unit-circle point returns to the same height.", {
    simple: "Adding 360 degrees returns to the same sine height.",
    detailed: "A full turn brings the terminal ray back to the same point on the unit circle, so the y-coordinate is unchanged.",
    memory: "Sine has period 360 degrees.",
  }),
  formula("periodic-cos", "periodic-identities", "cos(theta + 360 deg)", "\\cos(\\theta+360^{\\circ})=\\cos\\theta", "Cosine repeats every full turn", "After one full rotation, the unit-circle point returns to the same horizontal position.", {
    simple: "Adding 360 degrees returns to the same cosine width.",
    detailed: "A full turn brings the terminal ray back to the same point on the unit circle, so the x-coordinate is unchanged.",
    memory: "Cosine has period 360 degrees.",
  }),
  formula("periodic-tan", "periodic-identities", "tan(theta + 180 deg)", "\\tan(\\theta+180^{\\circ})=\\tan\\theta", "Tangent repeats every half turn", "After 180 degrees, sine and cosine both change sign, so their quotient stays the same.", {
    simple: "Tangent repeats after 180 degrees.",
    detailed: "Adding 180 degrees changes both sine and cosine signs; the sign changes cancel in sin theta / cos theta.",
    memory: "Tangent period is 180 degrees.",
  }),
  formula("angle-sum-sin", "sum-difference-identities", "sin(theta + beta)", "\\sin(\\theta+\\beta)=\\sin\\theta\\cos\\beta+\\cos\\theta\\sin\\beta", "Sine of a combined angle", "Split a rotation into theta and beta; the final height comes from two projected pieces.", {
    simple: "Sine of a sum combines sine and cosine pieces.",
    detailed: "Rotating by beta after theta mixes the old height and width, creating sin theta cos beta + cos theta sin beta.",
    memory: "Sine sum keeps the plus sign.",
  }),
  formula("angle-sum-cos", "sum-difference-identities", "cos(theta + beta)", "\\cos(\\theta+\\beta)=\\cos\\theta\\cos\\beta-\\sin\\theta\\sin\\beta", "Cosine of a combined angle", "The horizontal projection after two rotations subtracts the cross-height term.", {
    simple: "Cosine of a sum uses cosine-cosine minus sine-sine.",
    detailed: "The second rotation mixes horizontal and vertical components; the vertical contribution points left, so it subtracts.",
    memory: "Cosine sum has the minus sign.",
  }),
  formula("angle-diff-sin", "sum-difference-identities", "sin(theta - beta)", "\\sin(\\theta-\\beta)=\\sin\\theta\\cos\\beta-\\cos\\theta\\sin\\beta", "Sine of a difference", "Subtracting beta reverses the second rotation, so the cross term changes sign.", {
    simple: "Sine of a difference changes the middle sign to minus.",
    detailed: "Using beta in the opposite direction flips the sine-beta contribution, producing sin theta cos beta - cos theta sin beta.",
    memory: "Sine follows the operation sign.",
  }),
  formula("angle-diff-cos", "sum-difference-identities", "cos(theta - beta)", "\\cos(\\theta-\\beta)=\\cos\\theta\\cos\\beta+\\sin\\theta\\sin\\beta", "Cosine of a difference", "Subtracting beta makes the vertical cross term add instead of subtract.", {
    simple: "Cosine of a difference uses cosine-cosine plus sine-sine.",
    detailed: "The opposite second rotation changes the sign of the vertical contribution, so the cosine formula adds.",
    memory: "Cosine uses the opposite sign.",
  }),
  formula("double-sin", "double-angle-identities", "sin 2theta", "\\sin 2\\theta=2\\sin\\theta\\cos\\theta", "Sine double angle", "Doubling the angle is the angle-sum formula with beta equal to theta.", {
    simple: "sin 2theta equals twice sine times cosine.",
    detailed: "Put beta = theta in sin(theta + beta): sin theta cos theta + cos theta sin theta = 2 sin theta cos theta.",
    memory: "Double sine is two sin cos.",
  }),
  formula("double-cos", "double-angle-identities", "cos 2theta", "\\cos 2\\theta=\\cos^2\\theta-\\sin^2\\theta", "Cosine double angle", "Doubling the angle compares the cosine square with the sine square.", {
    simple: "cos 2theta equals cos squared minus sin squared.",
    detailed: "Put beta = theta in cos(theta + beta): cos theta cos theta - sin theta sin theta = cos^2 theta - sin^2 theta.",
    memory: "Double cosine is cos square minus sin square.",
  }),
  formula("basic-sin-from-cosec", "basic-flip-formulas", "sin theta from cosec theta", "\\sin\\theta=\\frac{1}{\\csc\\theta}", "Sine is flipped cosecant", "Sine is the reciprocal of cosecant whenever cosecant is defined.", {
    simple: "If you know cosec theta, flip it to get sin theta.",
    detailed: "Because csc theta = 1 / sin theta, flipping both sides gives sin theta = 1 / csc theta, where sin theta is not zero.",
    memory: "Sine and cosecant are flip partners.",
  }),
  formula("basic-cos-from-sec", "basic-flip-formulas", "cos theta from sec theta", "\\cos\\theta=\\frac{1}{\\sec\\theta}", "Cosine is flipped secant", "Cosine is the reciprocal of secant whenever secant is defined.", {
    simple: "If you know sec theta, flip it to get cos theta.",
    detailed: "Because sec theta = 1 / cos theta, flipping both sides gives cos theta = 1 / sec theta, where cos theta is not zero.",
    memory: "Cosine and secant are flip partners.",
  }),
  formula("basic-tan-from-cot", "basic-flip-formulas", "tan theta from cot theta", "\\tan\\theta=\\frac{1}{\\cot\\theta}", "Tangent is flipped cotangent", "Tangent is the reciprocal of cotangent whenever both are defined.", {
    simple: "If you know cot theta, flip it to get tan theta.",
    detailed: "Because cot theta = 1 / tan theta, flipping both sides gives tan theta = 1 / cot theta, where tangent and cotangent are defined.",
    memory: "Tangent and cotangent are flip partners.",
  }),
  formula("basic-cosec-from-sin", "basic-flip-formulas", "cosec theta from sin theta", "\\csc\\theta=\\frac{1}{\\sin\\theta}", "Cosecant is flipped sine", "Cosecant is the reciprocal of sine whenever sine is not zero.", {
    simple: "If you know sin theta, flip it to get cosec theta.",
    detailed: "Cosecant is defined as the reciprocal of sine, so csc theta = 1 / sin theta whenever sin theta is not zero.",
    memory: "Cosecant flips sine.",
  }),
  formula("basic-sec-from-cos", "basic-flip-formulas", "sec theta from cos theta", "\\sec\\theta=\\frac{1}{\\cos\\theta}", "Secant is flipped cosine", "Secant is the reciprocal of cosine whenever cosine is not zero.", {
    simple: "If you know cos theta, flip it to get sec theta.",
    detailed: "Secant is defined as the reciprocal of cosine, so sec theta = 1 / cos theta whenever cos theta is not zero.",
    memory: "Secant flips cosine.",
  }),
  formula("basic-cot-from-tan", "basic-flip-formulas", "cot theta from tan theta", "\\cot\\theta=\\frac{1}{\\tan\\theta}", "Cotangent is flipped tangent", "Cotangent is the reciprocal of tangent whenever tangent is not zero.", {
    simple: "If you know tan theta, flip it to get cot theta.",
    detailed: "Cotangent is defined as the reciprocal of tangent, so cot theta = 1 / tan theta whenever tangent is not zero.",
    memory: "Cotangent flips tangent.",
  }),
];

export const formulaDefinitionById = new Map(trigFormulaDefinitions.map((definition) => [definition.id, definition]));

export const formulaGroupsWithDefinitions = trigFormulaGroups.map((group) => ({
  ...group,
  formulas: group.formulaIds.map((id) => getFormulaDefinition(id)),
}));

export function clampDegrees(degrees: number) {
  if (!Number.isFinite(degrees)) return 0;
  return Math.min(360, Math.max(0, degrees));
}

export function normalizeDegrees(degrees: number) {
  const clamped = clampDegrees(degrees);
  return Number(clamped.toFixed(3));
}

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function snapToSpecialAngle(degrees: number, threshold = 4) {
  const normalized = normalizeDegrees(degrees);
  const nearest = specialAngleMarkers.reduce((best, angle) => {
    return Math.abs(angle - normalized) < Math.abs(best - normalized) ? angle : best;
  }, specialAngleMarkers[0]);

  return Math.abs(nearest - normalized) <= threshold ? nearest : normalized;
}

export function computeTrigFormulaValues(degrees: number): TrigFormulaValues {
  const normalizedDegrees = normalizeDegrees(degrees);
  const radians = degreesToRadians(normalizedDegrees);
  const sin = cleanTrigValue(Math.sin(radians));
  const cos = cleanTrigValue(Math.cos(radians));
  const tan = safeDivide(sin, cos);
  const cot = safeDivide(cos, sin);
  const sec = safeDivide(1, cos);
  const cosec = safeDivide(1, sin);
  const sinSquare = cleanTrigValue(sin * sin);
  const cosSquare = cleanTrigValue(cos * cos);
  const tanSquare = squareNullable(tan);
  const cotSquare = squareNullable(cot);
  const secSquare = squareNullable(sec);
  const cosecSquare = squareNullable(cosec);

  return {
    degrees: normalizedDegrees,
    radians,
    sin,
    cos,
    tan,
    cot,
    sec,
    cosec,
    sinSquare,
    cosSquare,
    tanSquare,
    cotSquare,
    secSquare,
    cosecSquare,
    identitySum: cleanTrigValue(sinSquare + cosSquare),
    tanIdentitySum: tanSquare === null ? null : cleanTrigValue(1 + tanSquare),
    cotIdentitySum: cotSquare === null ? null : cleanTrigValue(1 + cotSquare),
    coordinate: { x: cos, y: sin },
    radiansLabel: radiansToPiLabel(normalizedDegrees),
  };
}

export function getFormulaLiveValue(id: TrigFormulaId, values: TrigFormulaValues) {
  switch (id) {
    case "sin":
      return formatTrigNumber(values.sin);
    case "cos":
      return formatTrigNumber(values.cos);
    case "tan":
    case "tan-ratio":
      return formatNullable(values.tan);
    case "cot":
    case "cot-ratio":
    case "comp-tan":
      return formatNullable(values.cot);
    case "sec":
      return formatNullable(values.sec);
    case "cosec":
      return formatNullable(values.cosec);
    case "reciprocal-sin-cosec":
      return values.cosec === null ? "undefined" : formatTrigNumber(values.sin * values.cosec);
    case "reciprocal-cos-sec":
      return values.sec === null ? "undefined" : formatTrigNumber(values.cos * values.sec);
    case "reciprocal-tan-cot":
      return values.tan === null || values.cot === null ? "undefined" : formatTrigNumber(values.tan * values.cot);
    case "sin-square":
      return formatTrigNumber(values.sinSquare);
    case "cos-square":
      return formatTrigNumber(values.cosSquare);
    case "pythagorean":
      return formatTrigNumber(values.identitySum);
    case "pythagorean-tan":
      return `${formatNullable(values.tanIdentitySum)} = ${formatNullable(values.secSquare)}`;
    case "pythagorean-cot":
      return `${formatNullable(values.cotIdentitySum)} = ${formatNullable(values.cosecSquare)}`;
    case "even-sin":
      return `${formatTrigNumber(-values.sin)} = -${formatTrigNumber(values.sin)}`;
    case "even-cos":
      return `${formatTrigNumber(values.cos)} = ${formatTrigNumber(values.cos)}`;
    case "even-tan":
      return values.tan === null ? "undefined" : `${formatTrigNumber(-values.tan)} = -${formatTrigNumber(values.tan)}`;
    case "comp-sin":
      return formatTrigNumber(values.cos);
    case "comp-cos":
      return formatTrigNumber(values.sin);
    case "comp-sec":
      return formatNullable(values.cosec);
    case "comp-cosec":
      return formatNullable(values.sec);
    case "comp-cot":
      return formatNullable(values.tan);
    case "periodic-sin":
      return `${formatTrigNumber(values.sin)} = ${formatTrigNumber(cleanTrigValue(Math.sin(degreesToRadians(values.degrees + 360))))}`;
    case "periodic-cos":
      return `${formatTrigNumber(values.cos)} = ${formatTrigNumber(cleanTrigValue(Math.cos(degreesToRadians(values.degrees + 360))))}`;
    case "periodic-tan":
      return `${formatNullable(values.tan)} = ${formatNullable(safeDivide(cleanTrigValue(Math.sin(degreesToRadians(values.degrees + 180))), cleanTrigValue(Math.cos(degreesToRadians(values.degrees + 180)))))} `;
    case "angle-sum-sin":
      return compoundValue(values.degrees, 30, "sin", "sum");
    case "angle-sum-cos":
      return compoundValue(values.degrees, 30, "cos", "sum");
    case "angle-diff-sin":
      return compoundValue(values.degrees, 30, "sin", "diff");
    case "angle-diff-cos":
      return compoundValue(values.degrees, 30, "cos", "diff");
    case "double-sin":
      return `${formatTrigNumber(cleanTrigValue(Math.sin(degreesToRadians(values.degrees * 2))))} = ${formatTrigNumber(cleanTrigValue(2 * values.sin * values.cos))}`;
    case "double-cos":
      return `${formatTrigNumber(cleanTrigValue(Math.cos(degreesToRadians(values.degrees * 2))))} = ${formatTrigNumber(cleanTrigValue(values.cosSquare - values.sinSquare))}`;
    case "basic-sin-from-cosec":
      return `${formatTrigNumber(values.sin)} = ${formatNullable(values.cosec === null ? null : safeDivide(1, values.cosec))}`;
    case "basic-cos-from-sec":
      return `${formatTrigNumber(values.cos)} = ${formatNullable(values.sec === null ? null : safeDivide(1, values.sec))}`;
    case "basic-tan-from-cot":
      return `${formatNullable(values.tan)} = ${formatNullable(values.cot === null ? null : safeDivide(1, values.cot))}`;
    case "basic-cosec-from-sin":
      return formatNullable(values.cosec);
    case "basic-sec-from-cos":
      return formatNullable(values.sec);
    case "basic-cot-from-tan":
      return formatNullable(values.cot);
    default:
      return "";
  }
}

export function getFormulaDefinition(id: TrigFormulaId) {
  return formulaDefinitionById.get(id) ?? trigFormulaDefinitions[0];
}

export function formatTrigNumber(value: number) {
  if (Math.abs(value) < 0.0005) return "0";
  if (Math.abs(value - 1) < 0.0005) return "1";
  if (Math.abs(value + 1) < 0.0005) return "-1";
  return value.toFixed(3).replace(/\.?0+$/, "");
}

export function formatAngle(values: TrigFormulaValues, unit: AngleUnit) {
  return unit === "degrees" ? `${values.degrees.toFixed(0)} deg` : `${values.radians.toFixed(3)} rad`;
}

function formula(
  id: TrigFormulaId,
  groupId: TrigFormulaGroupId,
  label: string,
  formulaText: string,
  meaning: string,
  visualExplanation: string,
  explanations: Record<ExplanationLevel, string>,
): TrigFormulaDefinition {
  return { id, groupId, label, formula: formulaText, meaning, visualExplanation, explanations };
}

function cleanTrigValue(value: number) {
  return Math.abs(value) < 0.0000001 ? 0 : Number(value.toFixed(12));
}

function safeDivide(numerator: number, denominator: number) {
  return Math.abs(denominator) < 0.000001 ? null : cleanTrigValue(numerator / denominator);
}

function squareNullable(value: number | null) {
  return value === null ? null : cleanTrigValue(value * value);
}

function formatNullable(value: number | null) {
  return value === null ? "undefined" : formatTrigNumber(value);
}

function compoundValue(degrees: number, betaDegrees: number, kind: "sin" | "cos", operation: "sum" | "diff") {
  const beta = degreesToRadians(betaDegrees);
  const theta = degreesToRadians(degrees);
  const targetDegrees = operation === "sum" ? degrees + betaDegrees : degrees - betaDegrees;
  const lhs = kind === "sin" ? Math.sin(degreesToRadians(targetDegrees)) : Math.cos(degreesToRadians(targetDegrees));
  const rhs =
    kind === "sin"
      ? Math.sin(theta) * Math.cos(beta) + (operation === "sum" ? 1 : -1) * Math.cos(theta) * Math.sin(beta)
      : Math.cos(theta) * Math.cos(beta) + (operation === "sum" ? -1 : 1) * Math.sin(theta) * Math.sin(beta);

  return `${formatTrigNumber(cleanTrigValue(lhs))} = ${formatTrigNumber(cleanTrigValue(rhs))} (beta = 30 deg)`;
}

function radiansToPiLabel(degrees: number) {
  const rounded = Math.round(degrees);
  const labels: Record<number, string> = {
    0: "0",
    30: "pi / 6",
    45: "pi / 4",
    60: "pi / 3",
    90: "pi / 2",
    180: "pi",
    270: "3pi / 2",
    360: "2pi",
  };

  return labels[rounded] ?? `${formatTrigNumber(degrees / 180)}pi`;
}
