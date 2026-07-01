import type { PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import {
  CircleAreaUnrollGuide,
  ExteriorAngleGuide,
  PolygonTriangulationGuide,
  SectorCircleGuide,
  SimilarTriangleGuide,
  TrapezoidDuplicationGuide,
} from "./PhaseElevenGeometryVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const geometryRoute = "/olympyard/practice/geometry-angles";
const areaRoute = "/olympyard/practice/area-perimeter";
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const toRad = (degrees: number) => (degrees * Math.PI) / 180;

export const exteriorAnglePhaseElevenConfig: PhaseTwoProofConfig = {
  steps: ["Draw a triangle", "Extend one side", "Mark the exterior angle", "Mark the two remote interior angles", "Rearrange/copy the remote angles", "Conclude exterior = remote angle sum"].map(step),
  parameters: [
    { id: "ax", label: "A x", min: 150, max: 360, defaultValue: 210, step: 1 },
    { id: "ay", label: "A y", min: 220, max: 420, defaultValue: 370, step: 1 },
    { id: "bx", label: "B x", min: 470, max: 680, defaultValue: 550, step: 1 },
    { id: "by", label: "B y", min: 220, max: 420, defaultValue: 365, step: 1 },
    { id: "cx", label: "C x", min: 260, max: 560, defaultValue: 370, step: 1 },
    { id: "cy", label: "C y", min: 95, max: 260, defaultValue: 165, step: 1 },
  ],
  toggles: [labelsToggle],
  olympyardRoute: geometryRoute,
  prediction: prompt("If the two remote interior angles are 45 deg and 65 deg, what is the exterior angle?", "110 deg"),
  misconception: misconception("Does the exterior angle equal the adjacent interior angle?", "No. The exterior angle forms a straight line with the adjacent interior angle, and it equals the sum of the two remote interior angles."),
  formulaTokens: () => [
    { id: "exterior", label: "exterior angle", visualLabel: "outside angle" },
    { id: "remote1", label: "remote interior angle 1", visualLabel: "first non-adjacent angle" },
    { id: "remote2", label: "remote interior angle 2", visualLabel: "second non-adjacent angle" },
    { id: "sum", label: "sum", visualLabel: "copied remote angles" },
  ],
  formula: () => "Exterior angle = remote interior angle 1 + remote interior angle 2",
  explanation: () => "The adjacent interior angle and exterior angle make 180 deg, while the triangle angles also sum to 180 deg. Removing the adjacent angle leaves the two remote angles.",
  liveValues: ({ ax, ay, bx, by, cx, cy }) => {
    const angles = triangleAngles({ x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy });
    const exterior = 180 - angles.B;
    return [
      { id: "A", label: "angle A", value: round(angles.A), unit: "deg" },
      { id: "B", label: "angle B", value: round(angles.B), unit: "deg" },
      { id: "C", label: "angle C", value: round(angles.C), unit: "deg" },
      { id: "exterior", label: "exterior angle", value: round(exterior), unit: "deg" },
      { id: "remote-sum", label: "remote angle sum", value: round(angles.A + angles.C), unit: "deg" },
    ];
  },
  invariants: ({ ax, ay, bx, by, cx, cy }) => {
    const angles = triangleAngles({ x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy });
    const exterior = 180 - angles.B;
    return [{ id: "exterior-sum", label: "exterior angle = remote interior angle sum", holds: Math.abs(exterior - (angles.A + angles.C)) < 0.1, explanation: `${round(exterior)} deg = ${round(angles.A)} deg + ${round(angles.C)} deg.` }];
  },
  assumptions: ["The triangle is non-degenerate.", "The exterior angle is formed by extending one side.", "Angles are shown rounded in the inspector."],
  renderVisual: ExteriorAngleGuide,
};

export const similarTrianglesPhaseElevenConfig: PhaseTwoProofConfig = {
  steps: ["Draw the first triangle", "Create a scaled copy", "Match corresponding angles", "Match corresponding sides", "Compare side ratios", "Conclude proportional sides"].map(step),
  parameters: [{ id: "scale", label: "Scale factor", min: 1, max: 2, defaultValue: 1.6, step: 0.1 }],
  toggles: [labelsToggle],
  olympyardRoute: geometryRoute,
  prediction: prompt("If the scale factor is 2, what happens to every side length?", "Every corresponding side becomes twice as long."),
  misconception: misconception("Must similar triangles be the same size?", "No. Similar triangles have the same shape and equal corresponding angles; side lengths are proportional, not necessarily equal."),
  formulaTokens: () => [
    { id: "ratio1", label: "AB/DE", visualLabel: "first corresponding side pair" },
    { id: "ratio2", label: "BC/EF", visualLabel: "second corresponding side pair" },
    { id: "ratio3", label: "AC/DF", visualLabel: "third corresponding side pair" },
    { id: "scale", label: "scale factor", visualLabel: "size change" },
  ],
  formula: () => "AB/DE = BC/EF = AC/DF",
  explanation: ({ scale }) => `Every side in the scaled copy is ${scale} times the matching side in the original triangle.`,
  liveValues: ({ scale }) => [
    { id: "scale", label: "scale factor", value: scale },
    { id: "AB", label: "triangle 1 AB", value: 150 },
    { id: "DE", label: "triangle 2 DE", value: round(150 * scale) },
    { id: "ratio1", label: "DE/AB", value: round(scale) },
    { id: "ratio2", label: "EF/BC", value: round(scale) },
    { id: "ratio3", label: "DF/AC", value: round(scale) },
  ],
  invariants: ({ scale }) => [{ id: "ratios", label: "corresponding side ratios are equal", holds: true, explanation: `Each corresponding ratio equals the scale factor ${scale}.` }],
  assumptions: ["The second triangle is a scaled copy of the first.", "Corresponding angles stay equal during scaling."],
  renderVisual: SimilarTriangleGuide,
};

export const sectorAreaPhaseElevenConfig: PhaseTwoProofConfig = {
  steps: ["Draw a circle", "Mark radius r", "Choose central angle theta", "Highlight sector fraction", "Multiply by circle area", "Conclude sector area formula"].map(step),
  parameters: [{ id: "radius", label: "Radius r", min: 3, max: 8, defaultValue: 5, step: 1 }, { id: "theta", label: "Central angle theta", min: 20, max: 330, defaultValue: 90, step: 5, unit: "deg" }],
  toggles: [labelsToggle],
  olympyardRoute: areaRoute,
  prediction: prompt("If theta is 90 deg, what fraction of the circle is the sector?", "One fourth."),
  misconception: misconception("Does sector area depend only on arc length?", "No. Sector area depends on both radius and central angle; it is a fraction of the whole circle area."),
  formulaTokens: () => [
    { id: "theta", label: "theta", visualLabel: "central angle" },
    { id: "full", label: "360 deg", visualLabel: "full circle" },
    { id: "area", label: "pi r^2", visualLabel: "full circle area" },
    { id: "sector", label: "sector area", visualLabel: "filled sector" },
  ],
  formula: ({ radius, theta }) => `sector area = (${theta}/360) pi ${radius}^2 = ${round((theta / 360) * Math.PI * radius * radius)}`,
  explanation: ({ theta }) => `The sector is ${round(theta / 360)} of the full circle, so its area is the same fraction of pi r^2.`,
  liveValues: ({ radius, theta }) => [
    { id: "radius", label: "radius", value: radius },
    { id: "theta-deg", label: "angle degrees", value: theta, unit: "deg" },
    { id: "theta-rad", label: "angle radians", value: round(toRad(theta)) },
    { id: "fraction", label: "fraction of circle", value: round(theta / 360) },
    { id: "circle-area", label: "full circle area", value: round(Math.PI * radius * radius), exactValue: `pi(${radius})^2` },
    { id: "sector-area", label: "sector area rounded", value: round((theta / 360) * Math.PI * radius * radius) },
  ],
  invariants: ({ radius, theta }) => [{ id: "sector-fraction", label: "sector area = angle fraction x circle area", holds: true, explanation: `${round((theta / 360) * Math.PI * radius * radius)} = ${round(theta / 360)} x ${round(Math.PI * radius * radius)}.` }],
  assumptions: ["Degrees are the default view.", "Radians are shown as an insight value.", "The sector has central angle theta."],
  renderVisual: SectorCircleGuide,
};

export const trapezoidAreaPhaseElevenConfig: PhaseTwoProofConfig = {
  steps: ["Draw one trapezoid", "Mark parallel bases and height", "Duplicate the trapezoid", "Rotate/fit the duplicate", "Form a parallelogram", "Conclude area = 1/2(a+b)h"].map(step),
  parameters: [{ id: "a", label: "Base a", min: 2, max: 8, defaultValue: 4, step: 1 }, { id: "b", label: "Base b", min: 4, max: 10, defaultValue: 7, step: 1 }, { id: "h", label: "Perpendicular height h", min: 3, max: 7, defaultValue: 5, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: areaRoute,
  prediction: prompt("Why do we divide by 2?", "Because the parallelogram contains two identical trapezoids."),
  misconception: misconception("Is the height the slanted side?", "No. The height is the perpendicular distance between the parallel bases."),
  formulaTokens: () => [
    { id: "a", label: "a", visualLabel: "top/base 1" },
    { id: "b", label: "b", visualLabel: "bottom/base 2" },
    { id: "h", label: "h", visualLabel: "perpendicular height" },
    { id: "combined", label: "a + b", visualLabel: "combined base" },
    { id: "half", label: "1/2", visualLabel: "one of two identical trapezoids" },
  ],
  formula: ({ a, b, h }) => `Area = 1/2(${a} + ${b})${h} = ${round(((a + b) * h) / 2)}`,
  explanation: () => "A duplicate trapezoid fits with the original to make a parallelogram of base a + b and perpendicular height h.",
  liveValues: ({ a, b, h }) => [
    { id: "a", label: "base a", value: a },
    { id: "b", label: "base b", value: b },
    { id: "h", label: "perpendicular height h", value: h },
    { id: "parallelogram-area", label: "combined parallelogram area", value: (a + b) * h },
    { id: "trapezoid-area", label: "trapezoid area", value: round(((a + b) * h) / 2) },
  ],
  invariants: ({ a, b, h }) => [{ id: "two-trapezoids", label: "two trapezoids form parallelogram", holds: true, explanation: `2 x ${round(((a + b) * h) / 2)} = (${a} + ${b}) x ${h}.` }],
  assumptions: ["The two bases are parallel.", "The duplicate is identical to the original trapezoid.", "Height means perpendicular height."],
  renderVisual: TrapezoidDuplicationGuide,
};

export const polygonInteriorAnglePhaseElevenConfig: PhaseTwoProofConfig = {
  steps: ["Draw an n-sided polygon", "Pick one vertex", "Draw diagonals to non-adjacent vertices", "Count the triangles", "Multiply by 180 deg", "Conclude the formula"].map(step),
  parameters: [{ id: "n", label: "Number of sides n", min: 3, max: 10, defaultValue: 6, step: 1 }, { id: "radius", label: "Polygon radius", min: 4, max: 8, defaultValue: 6, step: 1 }, { id: "rotation", label: "Rotation", min: 0, max: 45, defaultValue: 0, step: 5, unit: "deg" }],
  toggles: [labelsToggle],
  olympyardRoute: geometryRoute,
  prediction: prompt("How many triangles are formed inside a 6-sided polygon from one vertex?", "4."),
  misconception: misconception("Does an n-sided polygon split into n triangles from one vertex?", "No. The two adjacent sides do not create diagonals; the polygon splits into n - 2 triangles."),
  formulaTokens: () => [
    { id: "n", label: "n", visualLabel: "number of sides" },
    { id: "triangles", label: "n - 2", visualLabel: "number of triangles" },
    { id: "triangle-sum", label: "180 deg", visualLabel: "triangle angle sum" },
    { id: "total", label: "(n - 2) x 180 deg", visualLabel: "total sum" },
  ],
  formula: ({ n }) => `Interior angle sum = (${Math.round(n)} - 2) x 180 deg = ${(Math.round(n) - 2) * 180} deg`,
  explanation: ({ n }) => `Drawing diagonals from one vertex divides the polygon into ${Math.round(n) - 2} triangles.`,
  liveValues: ({ n }) => [
    { id: "n", label: "n", value: Math.round(n) },
    { id: "diagonals", label: "diagonals from vertex", value: Math.max(0, Math.round(n) - 3) },
    { id: "triangles", label: "triangles formed", value: Math.round(n) - 2 },
    { id: "sum", label: "angle sum", value: (Math.round(n) - 2) * 180, unit: "deg" },
  ],
  invariants: ({ n }) => [{ id: "n-minus-2", label: "polygon split into n - 2 triangles", holds: true, explanation: `${Math.round(n)} sides form ${Math.round(n) - 2} triangles from one vertex.` }],
  assumptions: ["The polygon is convex.", "Diagonals are drawn from one vertex to non-adjacent vertices."],
  renderVisual: PolygonTriangulationGuide,
};

export const circleAreaUnrollingPhaseElevenConfig: PhaseTwoProofConfig = {
  steps: [
    "Show the circle and its radius",
    "Cut the circle into many thin rings",
    "Unroll each ring into a straight strip",
    "The outside strip has length 2*pi*r, the circumference",
    "Stack the strips from shortest to longest",
    "The stack acts like a triangle with base 2*pi*r and height r",
  ].map(step),
  parameters: [
    { id: "radius", label: "Radius r", min: 3, max: 5, defaultValue: 5, step: 1 },
    { id: "sectors", label: "Ring samples", min: 12, max: 60, defaultValue: 40, step: 4 },
  ],
  toggles: [labelsToggle],
  olympyardRoute: areaRoute,
  prediction: prompt("When the circle boundary is cut and straightened, how long is the outside strip?", "2*pi*r, the circumference."),
  misconception: misconception("Is the circle boundary length the same as the diameter?", "No. The circumference is 2*pi*r, which is pi times the diameter 2r."),
  formulaTokens: () => [
    { id: "r", label: "r", visualLabel: "radius" },
    { id: "circumference", label: "2*pi*r", visualLabel: "outside strip" },
    { id: "half", label: "1/2", visualLabel: "triangle area factor" },
    { id: "pi-r", label: "pi*r", visualLabel: "half of the outside strip" },
    { id: "area", label: "pi*r^2", visualLabel: "circle area" },
  ],
  formula: ({ radius }) => `area = 1/2 x 2*pi*${radius} x ${radius} = pi*${radius}^2 = ${round(Math.PI * radius * radius)}`,
  explanation: ({ radius }) =>
    `The outside ring unrolls to circumference 2*pi*r = ${round(2 * Math.PI * radius)}. When all rings are stacked, the triangle-style area is 1/2 x base x height = 1/2 x 2*pi*r x r = pi*r^2, so the circle area is ${round(Math.PI * radius * radius)}.`,
  liveValues: ({ radius }) => [
    { id: "radius", label: "radius r", value: radius },
    { id: "diameter", label: "diameter 2r", value: 2 * radius },
    { id: "circumference", label: "circumference 2*pi*r", value: round(2 * Math.PI * radius), exactValue: `2*pi(${radius})` },
    { id: "half-circumference", label: "half circumference pi*r", value: round(Math.PI * radius), exactValue: `pi(${radius})` },
    { id: "area", label: "area pi*r^2", value: round(Math.PI * radius * radius), exactValue: `pi(${radius})^2` },
    { id: "smoothness", label: "uncurling smoothness", value: "smooth with more sectors" },
  ],
  invariants: ({ radius }) => [
    { id: "circumference", label: "C = 2*pi*r", holds: true, explanation: `The outside strip has length 2*pi*${radius} = ${round(2 * Math.PI * radius)}.` },
    { id: "area", label: "area = pi*r^2", holds: true, explanation: `1/2 x 2*pi*${radius} x ${radius} = ${round(Math.PI * radius * radius)}.` },
  ],
  assumptions: [
    "Cutting the circle at one point and straightening preserves the total length.",
    "The ring strips approximate the circle more closely as the sample count increases.",
    "pi is irrational; decimal values shown are rounded.",
  ],
  renderVisual: CircleAreaUnrollGuide,
};

export const phaseElevenRouteSlugs = [
  ["geometry", "exterior-angle-theorem"],
  ["geometry", "similar-triangles-proportional-sides"],
  ["geometry", "sector-area-formula"],
  ["geometry", "trapezoid-area-duplication"],
  ["geometry", "polygon-interior-angle-sum"],
  ["geometry", "area-of-circle-by-unrolling"],
  ["geometry", "circle-to-triangle"],
] as const;

export const phaseElevenConfigs = [
  exteriorAnglePhaseElevenConfig,
  similarTrianglesPhaseElevenConfig,
  sectorAreaPhaseElevenConfig,
  trapezoidAreaPhaseElevenConfig,
  polygonInteriorAnglePhaseElevenConfig,
  circleAreaUnrollingPhaseElevenConfig,
  circleAreaUnrollingPhaseElevenConfig,
];

function prompt(question: string, answer: string) {
  return {
    question,
    correctFeedback: `Yes. ${answer}`,
    incorrectFeedback: "Use the visual relationship before applying the formula.",
    revealAfterAnswer: true,
    options: [
      { id: "correct", label: answer, correct: true, feedback: "Correct." },
      { id: "distractor", label: "A nearby-looking but different relationship.", feedback: "That misses the visual invariant in the diagram." },
    ],
  };
}

function misconception(question: string, explanation: string) {
  return {
    question,
    explanation,
    visualHint: "Highlight the linked geometry feature.",
    options: [
      { id: "reasoning", label: "Use the visual invariant.", correct: true, feedback: "Correct." },
      { id: "memorized", label: "Use only the memorized formula.", feedback: "The formula is the result of the visual relationship." },
    ],
  };
}

function step(title: string, index: number) {
  return { id: `p11-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "visual link" : "formula" };
}

function triangleAngles(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  const angle = (p: typeof a, q: typeof a, r: typeof a) => {
    const v1 = { x: p.x - q.x, y: p.y - q.y };
    const v2 = { x: r.x - q.x, y: r.y - q.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag = Math.max(0.001, Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
    return (Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180) / Math.PI;
  };
  return { A: angle(b, a, c), B: angle(a, b, c), C: angle(a, c, b) };
}
