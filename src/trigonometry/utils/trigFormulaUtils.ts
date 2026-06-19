export type TrigFormulaId =
  | "sin"
  | "cos"
  | "tan"
  | "cot"
  | "sec"
  | "cosec"
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
  | "comp-tan";

export type ExplanationLevel = "simple" | "detailed" | "memory";

export type TrigFormulaGroupId =
  | "basic-ratios"
  | "quotient-identities"
  | "pythagorean-identities"
  | "even-odd-identities"
  | "complementary-angle-identities"
  | "phase-one-squares";

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
    formulaIds: ["comp-sin", "comp-cos", "comp-tan"],
  },
];

export const trigFormulaDefinitions: TrigFormulaDefinition[] = [
  formula("sin", "basic-ratios", "sin theta", "sin theta", "Vertical height", "sin theta is the vertical height of the point on the unit circle.", {
    simple: "sin theta is the height of the point on the unit circle.",
    detailed: "The unit-circle point has coordinates (cos theta, sin theta), so sine is the y-coordinate.",
    memory: "Sine goes up and down, so remember it as vertical height.",
  }),
  formula("cos", "basic-ratios", "cos theta", "cos theta", "Horizontal distance", "cos theta is the horizontal distance of the point from the origin.", {
    simple: "cos theta is the horizontal distance from the origin.",
    detailed: "The unit-circle point has x-coordinate cos theta, so cosine is the base of the right triangle.",
    memory: "Cosine is the across-the-floor distance.",
  }),
  formula("tan", "basic-ratios", "tan theta", "tan theta", "Tangent length", "tan theta is the signed height where the angle ray meets the tangent line x = 1.", {
    simple: "tan theta is the tangent-line height made by extending the angle ray.",
    detailed: "On the line x = 1, the same angle gives height tan theta, matching sin theta divided by cos theta.",
    memory: "Tangent is the tall outside line.",
  }),
  formula("cot", "basic-ratios", "cot theta", "cot theta", "Base compared to height", "cot theta compares cosine to sine, so it is the reciprocal of tangent.", {
    simple: "cot theta compares the base to the height.",
    detailed: "cot theta equals cos theta divided by sin theta whenever sin theta is not zero.",
    memory: "Cotangent flips tangent.",
  }),
  formula("sec", "basic-ratios", "sec theta", "sec theta", "Reciprocal cosine", "sec theta is the reciprocal of the horizontal cosine distance.", {
    simple: "sec theta is 1 divided by cos theta.",
    detailed: "As cos theta gets small near 90 degrees, sec theta grows because it is the reciprocal of cosine.",
    memory: "Secant sees cosine and flips it.",
  }),
  formula("cosec", "basic-ratios", "cosec theta", "cosec theta", "Reciprocal sine", "cosec theta is the reciprocal of the vertical sine height.", {
    simple: "cosec theta is 1 divided by sin theta.",
    detailed: "As sin theta gets small near 0 degrees, cosec theta grows because it is the reciprocal of sine.",
    memory: "Cosecant sees sine and flips it.",
  }),
  formula("tan-ratio", "quotient-identities", "sin theta / cos theta", "tan theta = sin theta / cos theta", "Height compared with base", "tan theta compares height to base: sin theta divided by cos theta.", {
    simple: "tan theta is height divided by base.",
    detailed: "In the unit-circle triangle, opposite = sin theta and adjacent = cos theta, so opposite / adjacent = tan theta.",
    memory: "Tangent is sine over cosine.",
  }),
  formula("cot-ratio", "quotient-identities", "cos theta / sin theta", "cot theta = cos theta / sin theta", "Base compared with height", "cot theta compares base to height: cos theta divided by sin theta.", {
    simple: "cot theta is base divided by height.",
    detailed: "In the same triangle, adjacent = cos theta and opposite = sin theta, so adjacent / opposite = cot theta.",
    memory: "Cotangent is cosine over sine.",
  }),
  formula("sin-square", "phase-one-squares", "sin^2 theta", "sin^2 theta", "Square on sine", "sin^2 theta is the area of a square whose side length is the sine height.", {
    simple: "sin squared is a square built on the sine height.",
    detailed: "Its area is side times side, so the side sin theta produces area sin^2 theta.",
    memory: "Square the height to get sin squared.",
  }),
  formula("cos-square", "phase-one-squares", "cos^2 theta", "cos^2 theta", "Square on cosine", "cos^2 theta is the area of a square whose side length is the cosine width.", {
    simple: "cos squared is a square built on the cosine base.",
    detailed: "Its area is side times side, so the side cos theta produces area cos^2 theta.",
    memory: "Square the base to get cos squared.",
  }),
  formula("pythagorean", "pythagorean-identities", "sin^2 theta + cos^2 theta", "sin^2 theta + cos^2 theta = 1", "Always one", "The sine square and cosine square always combine to the unit circle radius squared.", {
    simple: "On the unit circle, the triangle always has hypotenuse 1. So base^2 + height^2 is always 1.",
    detailed: "Since cos theta is the x-coordinate and sin theta is the y-coordinate, the point lies on x^2 + y^2 = 1. Therefore cos^2 theta + sin^2 theta = 1.",
    memory: "sin^2 + cos^2 is always 1 because both are sides inside the same unit circle triangle.",
  }),
  formula("pythagorean-tan", "pythagorean-identities", "1 + tan^2 theta", "1 + tan^2 theta = sec^2 theta", "Tangent square identity", "Divide sin^2 theta + cos^2 theta = 1 by cos^2 theta to get 1 + tan^2 theta = sec^2 theta.", {
    simple: "The tangent version comes from dividing the unit-circle identity by cos^2 theta.",
    detailed: "sin^2/cos^2 becomes tan^2, cos^2/cos^2 becomes 1, and 1/cos^2 becomes sec^2.",
    memory: "One plus tan squared goes with sec squared.",
  }),
  formula("pythagorean-cot", "pythagorean-identities", "1 + cot^2 theta", "1 + cot^2 theta = cosec^2 theta", "Cotangent square identity", "Divide sin^2 theta + cos^2 theta = 1 by sin^2 theta to get 1 + cot^2 theta = cosec^2 theta.", {
    simple: "The cotangent version comes from dividing the unit-circle identity by sin^2 theta.",
    detailed: "cos^2/sin^2 becomes cot^2, sin^2/sin^2 becomes 1, and 1/sin^2 becomes cosec^2.",
    memory: "One plus cot squared goes with cosec squared.",
  }),
  formula("even-sin", "even-odd-identities", "sin(-theta)", "sin(-theta) = -sin theta", "Sine changes sign", "Mirroring theta across the x-axis flips the vertical height, so sine changes sign.", {
    simple: "Negative theta reflects the point below the x-axis, so sine becomes negative.",
    detailed: "The x-coordinate stays the same under reflection across the x-axis, but the y-coordinate changes sign. Since sine is y, sin(-theta) = -sin theta.",
    memory: "Sine is odd: the sign flips.",
  }),
  formula("even-cos", "even-odd-identities", "cos(-theta)", "cos(-theta) = cos theta", "Cosine stays same", "Mirroring theta across the x-axis keeps the horizontal distance the same.", {
    simple: "Negative theta keeps the same horizontal distance.",
    detailed: "Reflection across the x-axis does not change x-coordinate. Since cosine is x, cos(-theta) = cos theta.",
    memory: "Cosine is even: it keeps its sign.",
  }),
  formula("even-tan", "even-odd-identities", "tan(-theta)", "tan(-theta) = -tan theta", "Tangent changes sign", "Because tangent is sine divided by cosine, changing sine's sign changes tangent's sign.", {
    simple: "tan(-theta) changes sign because the height changes sign.",
    detailed: "sin(-theta) is negative while cos(-theta) is unchanged, so sin(-theta)/cos(-theta) = -tan theta.",
    memory: "Tangent is odd: the sign flips.",
  }),
  formula("comp-sin", "complementary-angle-identities", "sin(90 deg - theta)", "sin(90 deg - theta) = cos theta", "Opposite becomes adjacent", "In a right triangle, the opposite side for 90 deg - theta is the adjacent side for theta.", {
    simple: "The sine of the complementary angle equals the cosine of the original angle.",
    detailed: "The two acute angles in a right triangle add to 90 degrees, so switching angles swaps opposite and adjacent sides.",
    memory: "Co-functions come from complementary angles: sine becomes cosine.",
  }),
  formula("comp-cos", "complementary-angle-identities", "cos(90 deg - theta)", "cos(90 deg - theta) = sin theta", "Adjacent becomes opposite", "In a right triangle, the adjacent side for 90 deg - theta is the opposite side for theta.", {
    simple: "The cosine of the complementary angle equals the sine of the original angle.",
    detailed: "Switching to the other acute angle swaps adjacent and opposite sides, so cosine becomes sine.",
    memory: "Cosine becomes sine for 90 deg minus theta.",
  }),
  formula("comp-tan", "complementary-angle-identities", "tan(90 deg - theta)", "tan(90 deg - theta) = cot theta", "Ratio flips", "Changing to the complementary angle swaps opposite and adjacent, so tangent becomes cotangent.", {
    simple: "The tangent of the complementary angle is cotangent.",
    detailed: "For the other acute angle, opposite and adjacent switch places, so opposite / adjacent becomes adjacent / opposite.",
    memory: "Complementary tangent flips to cotangent.",
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
