import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  CompositeSolidsUnitsVisual,
  ConeVolumeSurfaceAreaVisual,
  CuboidCubeSurfaceAreaVisual,
  CuboidCubeVolumeVisual,
  CylinderVolumeSurfaceAreaVisual,
  PerimeterCircumferenceVisual,
  RectangleSquareAreaVisual,
  SphereSurfaceAreaVolumeVisual,
} from "./PhaseTwentyTwoMensurationVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const mensurationRoute = "/olympyard/practice/mensuration-foundations";
const prismParams = [param("length", "length", 2, 10, 6, 1), param("width", "width", 2, 8, 4, 1), param("height", "height", 2, 8, 5, 1)];
const roundSolidParams = [param("radius", "radius", 2, 7, 3, 0.25), param("height", "height", 2, 9, 5, 0.25)];

export const rectangleSquareAreaPhaseTwentyTwoConfig = makeConfig({
  modelKey: "area-unit-square-grid",
  steps: ["Draw rectangle", "Mark length", "Mark width", "Fill with unit squares", "Count rows and columns", "Conclude area formula"],
  parameters: [param("length", "length", 2, 10, 6, 1), param("width", "width", 2, 8, 4, 1)],
  prediction: ["If length = 6 and width = 4, how many unit squares fill the rectangle?", "24."],
  misconception: ["Area is found by adding length and width.", "Adding sides gives part of perimeter; area counts unit squares in rows and columns."],
  tokens: ["length", "width", "length-x-width", "side-squared"],
  formula: ({ length, width }) => whole(length) === whole(width) ? `Area of square = side^2 = ${whole(length)}^2 = ${whole(length) ** 2}` : `Area of rectangle = length x width = ${whole(length)} x ${whole(width)} = ${whole(length) * whole(width)}`,
  liveValues: ({ length, width }) => {
    const l = whole(length);
    const w = whole(width);
    return [value("length", "length", l), value("width", "width", w), value("unit-square-count", "unit-square count", l * w), value("area", "area", l * w, "square units"), value("square-mode", "square-mode status", l === w ? "on" : "off"), value("area-grid-invariant", "invariant", "area equals number of unit squares")];
  },
  invariant: () => "Area equals the number of unit squares covering the rectangle.",
  renderVisual: RectangleSquareAreaVisual,
});

export const perimeterCircumferencePhaseTwentyTwoConfig = makeConfig({
  modelKey: "boundary-length-unwrapped",
  steps: ["Choose shape", "Trace outside boundary", "Measure sides or radius", "Add or unwrap boundary", "Compare with area", "Conclude boundary formula"],
  parameters: [param("shapeMode", "shape mode 0=rectangle 1=circle", 0, 1, 0, 1), param("length", "length", 2, 10, 6, 1), param("width", "width", 2, 8, 4, 1), param("radius", "radius", 2, 7, 3, 0.25)],
  prediction: ["What does perimeter measure?", "The distance around the outside boundary."],
  misconception: ["Perimeter and area measure the same thing.", "Perimeter measures boundary length; area measures covered surface."],
  tokens: ["perimeter", "two-l-plus-w", "two-pi-r", "pi-d"],
  formula: ({ shapeMode, length, width, radius }) => shapeMode >= 0.5 ? `Circumference = 2 pi r = pi d ~= ${fmt(2 * Math.PI * radius)}` : `Perimeter = 2(l+w) = 2(${whole(length)}+${whole(width)}) = ${2 * (whole(length) + whole(width))}`,
  liveValues: ({ shapeMode, length, width, radius }) => shapeMode >= 0.5
    ? [value("shape-type", "shape type", "circle"), value("radius", "radius", fmt(radius)), value("diameter", "diameter", fmt(2 * radius)), value("boundary-length", "boundary length", fmt(2 * Math.PI * radius)), value("rounded-circumference", "rounded circumference", fmt(2 * Math.PI * radius)), value("pi-warning", "pi approximation warning", "pi values are rounded"), value("boundary-invariant", "invariant", "circumference measures around, not inside")]
    : [value("shape-type", "shape type", "rectangle"), value("length", "length", whole(length)), value("width", "width", whole(width)), value("boundary-length", "boundary length", 2 * (whole(length) + whole(width))), value("rounded-circumference", "rounded circumference", "not circle mode"), value("pi-warning", "pi approximation warning", "not used"), value("boundary-invariant", "invariant", "perimeter measures around, not inside")],
  invariant: () => "Perimeter and circumference measure boundary length, not covered area.",
  renderVisual: PerimeterCircumferenceVisual,
});

export const cuboidCubeSurfaceAreaPhaseTwentyTwoConfig = makeConfig({
  modelKey: "cuboid-face-pair-net",
  steps: ["Build cuboid", "Identify face pairs", "Calculate each face area", "Add paired faces", "Show cube special case", "Conclude surface area formula"],
  parameters: prismParams,
  prediction: ["Why do we multiply by 2 in 2(lw+lh+wh)?", "Because each face type appears in an opposite pair."],
  misconception: ["Surface area is the same as volume.", "Surface area counts outer faces; volume counts space inside."],
  tokens: ["lw", "lh", "wh", "two-face-pairs", "six-s-squared"],
  formula: ({ length, width, height }) => whole(length) === whole(width) && whole(width) === whole(height) ? `Cube surface area = 6s^2 = 6(${whole(length)}^2) = ${6 * whole(length) ** 2}` : `Cuboid surface area = 2(lw+lh+wh) = ${2 * (whole(length) * whole(width) + whole(length) * whole(height) + whole(width) * whole(height))}`,
  liveValues: ({ length, width, height }) => {
    const l = whole(length);
    const w = whole(width);
    const h = whole(height);
    return [value("length", "l", l), value("width", "w", w), value("height", "h", h), value("face-area-lw", "lw face area", l * w), value("face-area-lh", "lh face area", l * h), value("face-area-wh", "wh face area", w * h), value("total-surface-area", "total surface area", 2 * (l * w + l * h + w * h)), value("cube-mode", "cube-mode status", l === w && w === h ? "on" : "off"), value("face-sum-invariant", "invariant", "surface area equals sum of all exposed faces")];
  },
  invariant: () => "Total surface area is the sum of all exposed faces.",
  renderVisual: CuboidCubeSurfaceAreaVisual,
});

export const cuboidCubeVolumePhaseTwentyTwoConfig = makeConfig({
  modelKey: "unit-cube-layer-stack",
  steps: ["Build base rectangle", "Count base unit squares", "Add height layers", "Count unit cubes", "Compare cube special case", "Conclude volume formula"],
  parameters: prismParams,
  prediction: ["If base area is 12 and height is 5, what is the volume?", "60."],
  misconception: ["Volume is found by adding three dimensions.", "Volume counts unit cubes in length, width, and height directions."],
  tokens: ["length-width", "height", "lwh", "side-cubed"],
  formula: ({ length, width, height }) => whole(length) === whole(width) && whole(width) === whole(height) ? `Cube volume = side^3 = ${whole(length)}^3 = ${whole(length) ** 3}` : `Cuboid volume = length x width x height = ${whole(length)} x ${whole(width)} x ${whole(height)} = ${whole(length) * whole(width) * whole(height)}`,
  liveValues: ({ length, width, height }) => {
    const l = whole(length);
    const w = whole(width);
    const h = whole(height);
    return [value("length", "length", l), value("width", "width", w), value("height", "height", h), value("base-area", "base area", l * w), value("layers", "layers", h), value("volume", "volume", l * w * h, "cubic units"), value("cube-mode", "cube-mode status", l === w && w === h ? "on" : "off"), value("unit-cube-invariant", "invariant", "volume equals number of unit cubes")];
  },
  invariant: () => "Volume equals the number of unit cubes inside the solid.",
  renderVisual: CuboidCubeVolumeVisual,
});

export const cylinderVolumeSurfaceAreaPhaseTwentyTwoConfig = makeConfig({
  modelKey: "cylinder-disk-stack-unroll",
  steps: ["Draw cylinder", "Identify circular base", "Stack base through height", "Unroll curved side", "Add bases for total surface area", "Conclude cylinder formulas"],
  parameters: roundSolidParams,
  prediction: ["What shape does the curved surface become when unrolled?", "A rectangle."],
  misconception: ["Cylinder surface area is only the two circles.", "The curved side also contributes a rectangle of area circumference x height."],
  tokens: ["pi-r-squared", "height", "two-pi-r", "two-pi-r-h", "two-pi-r-squared"],
  formula: ({ radius, height }) => `Volume = pi r^2 h ~= ${fmt(Math.PI * radius ** 2 * height)}; curved area = 2 pi r h ~= ${fmt(2 * Math.PI * radius * height)}; total area ~= ${fmt(2 * Math.PI * radius * (height + radius))}`,
  liveValues: ({ radius, height }) => [value("radius", "radius", fmt(radius)), value("height", "height", fmt(height)), value("base-area", "base area", fmt(Math.PI * radius ** 2)), value("circumference", "circumference", fmt(2 * Math.PI * radius)), value("volume", "volume", fmt(Math.PI * radius ** 2 * height)), value("curved-surface-area", "curved surface area", fmt(2 * Math.PI * radius * height)), value("total-surface-area", "total surface area", fmt(2 * Math.PI * radius * (height + radius))), value("pi-warning", "pi approximation warning", "pi values are rounded")],
  invariant: () => "Cylinder volume stacks circular bases; curved surface unrolls to circumference x height.",
  renderVisual: CylinderVolumeSurfaceAreaVisual,
});

export const coneVolumeSurfaceAreaPhaseTwentyTwoConfig = makeConfig({
  modelKey: "cone-cylinder-third-sector",
  steps: ["Draw cone", "Mark radius and height", "Compare with cylinder", "Apply one-third volume", "Unwrap curved surface as sector", "Conclude cone formulas"],
  parameters: roundSolidParams,
  prediction: ["What fraction of the matching cylinder's volume is the cone?", "One third."],
  misconception: ["The slant height is the same as vertical height.", "Vertical height is perpendicular to the base; slant height runs along the side."],
  tokens: ["one-third", "pi-r-squared-h", "slant-height", "pi-r-l", "pi-r-squared"],
  formula: ({ radius, height }) => {
    const slant = Math.hypot(radius, height);
    return `Volume = 1/3 pi r^2 h ~= ${fmt(Math.PI * radius ** 2 * height / 3)}; curved area = pi r l ~= ${fmt(Math.PI * radius * slant)}; total area ~= ${fmt(Math.PI * radius * (slant + radius))}`;
  },
  liveValues: ({ radius, height }) => {
    const slant = Math.hypot(radius, height);
    return [value("radius", "radius", fmt(radius)), value("height", "height", fmt(height)), value("slant-height", "slant height", fmt(slant)), value("cylinder-comparison-volume", "cylinder comparison volume", fmt(Math.PI * radius ** 2 * height)), value("cone-volume", "cone volume", fmt(Math.PI * radius ** 2 * height / 3)), value("curved-surface-area", "curved surface area", fmt(Math.PI * radius * slant)), value("total-surface-area", "total surface area", fmt(Math.PI * radius * (slant + radius))), value("slant-invariant", "invariant", "l^2 = r^2 + h^2")];
  },
  invariant: ({ radius, height }) => `Slant height follows l^2 = r^2 + h^2, so l ~= ${fmt(Math.hypot(radius, height))}.`,
  renderVisual: ConeVolumeSurfaceAreaVisual,
});

export const sphereSurfaceAreaVolumePhaseTwentyTwoConfig = makeConfig({
  modelKey: "sphere-r-square-r-cube-scaling",
  steps: ["Draw sphere", "Mark radius", "Compare with great circle area", "Show surface area scaling", "Show volume scaling", "Conclude sphere formulas"],
  parameters: [param("radius", "radius", 2, 6, 3, 0.25)],
  prediction: ["If radius doubles, what happens to volume?", "It becomes 8 times as large."],
  misconception: ["Surface area and volume grow at the same rate.", "Surface area scales with r^2, while volume scales with r^3."],
  tokens: ["radius", "pi-r-squared", "four-pi-r-squared", "four-thirds-pi-r-cubed"],
  formula: ({ radius }) => `Surface area = 4 pi r^2 ~= ${fmt(4 * Math.PI * radius ** 2)}; volume = 4/3 pi r^3 ~= ${fmt((4 / 3) * Math.PI * radius ** 3)}`,
  liveValues: ({ radius }) => [value("radius", "radius", fmt(radius)), value("great-circle-area", "great circle area", fmt(Math.PI * radius ** 2)), value("surface-area", "surface area", fmt(4 * Math.PI * radius ** 2)), value("volume", "volume", fmt((4 / 3) * Math.PI * radius ** 3)), value("scaling-insight", "scaling insight", "area grows with r^2; volume grows with r^3"), value("schematic-warning", "approximation warning", "schematic model")],
  invariant: () => "Sphere surface area scales with r^2, while sphere volume scales with r^3.",
  renderVisual: SphereSurfaceAreaVolumeVisual,
});

export const compositeSolidsUnitsPhaseTwentyTwoConfig = makeConfig({
  modelKey: "composite-decomposition-units",
  steps: ["Show composite shape", "Split into known shapes", "Calculate each part", "Subtract holes if present", "Check units", "Conclude composite measurement"],
  parameters: [param("mode", "mode 0=area 1=volume", 0, 1, 0, 1), param("length", "main length", 3, 8, 5, 1), param("width", "main width", 3, 6, 4, 1), param("height", "height for volume", 2, 6, 3, 1), param("includeCutout", "subtract cutout 0=no 1=yes", 0, 1, 1, 1)],
  prediction: ["What unit should volume use?", "Cubic units, such as cm^3."],
  misconception: ["You can add areas and volumes together.", "Only like quantities with compatible units can be added."],
  tokens: ["add-parts", "subtract-holes", "cm-squared", "cm-cubed"],
  formula: ({ mode, length, width, height, includeCutout }) => mode >= 0.5
    ? `Composite volume = add parts - subtract holes = ${compositeVolume(length, width, height, includeCutout)} cm^3`
    : `Composite area = add parts - subtract holes = ${compositeArea(length, width, includeCutout)} cm^2`,
  liveValues: ({ mode, length, width, height, includeCutout }) => mode >= 0.5
    ? [value("selected-mode", "selected mode", "volume"), value("part-dimensions", "part dimensions", `${whole(length)} x ${whole(width)} x ${whole(height)}`), value("part-areas-volumes", "part volumes", `${whole(length) * whole(width) * whole(height)} and ${2 * whole(width) * whole(height)}`), value("subtracted-parts", "subtracted parts", includeCutout >= 0.5 ? `${2 * whole(height)}` : "none"), value("total", "total", compositeVolume(length, width, height, includeCutout), "cm^3"), value("unit-type", "unit type", "cubic units"), value("unit-invariant", "invariant", "units must match the measured quantity")]
    : [value("selected-mode", "selected mode", "area"), value("part-dimensions", "part dimensions", `${whole(length)} x ${whole(width)}`), value("part-areas-volumes", "part areas", `${whole(length) * whole(width)} and ${3 * whole(width)}`), value("subtracted-parts", "subtracted parts", includeCutout >= 0.5 ? "4" : "none"), value("total", "total", compositeArea(length, width, includeCutout), "cm^2"), value("unit-type", "unit type", "square units"), value("unit-invariant", "invariant", "units must match the measured quantity")],
  invariant: () => "Composite measurement adds and subtracts only compatible units.",
  renderVisual: CompositeSolidsUnitsVisual,
});

export const phaseTwentyTwoRouteSlugs = [
  ["mensuration", "rectangle-square-area"],
  ["mensuration", "perimeter-and-circumference"],
  ["mensuration", "cuboid-cube-surface-area"],
  ["mensuration", "cuboid-cube-volume"],
  ["mensuration", "cylinder-volume-surface-area"],
  ["mensuration", "cone-volume-surface-area"],
  ["mensuration", "sphere-surface-area-volume"],
  ["mensuration", "composite-solids-and-units"],
] as const;

export const phaseTwentyTwoConfigs = [
  rectangleSquareAreaPhaseTwentyTwoConfig,
  perimeterCircumferencePhaseTwentyTwoConfig,
  cuboidCubeSurfaceAreaPhaseTwentyTwoConfig,
  cuboidCubeVolumePhaseTwentyTwoConfig,
  cylinderVolumeSurfaceAreaPhaseTwentyTwoConfig,
  coneVolumeSurfaceAreaPhaseTwentyTwoConfig,
  sphereSurfaceAreaVolumePhaseTwentyTwoConfig,
  compositeSolidsUnitsPhaseTwentyTwoConfig,
];

type ConfigInput = {
  modelKey: string;
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentyTwoModelKey: string } {
  return {
    phaseTwentyTwoModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: mensurationRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `mensuration-${input.modelKey}-invariant`, label: "measurement invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG measurement scene.", "Dimensions are bounded to keep mobile labels and unit marks readable.", "Rounded pi values support classroom intuition while formulas preserve exact structure."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}

function value(id: string, label: string, item: number | string, unit?: string) {
  return { id, label, value: item, unit };
}

function step(title: string, index: number) {
  return { id: `p22-${index}`, title, description: title, focusLabel: index < 2 ? "measure setup" : index < 5 ? "formula structure" : "conclusion" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the measurement scene before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "formula-only", label: "Use a memorized formula without units.", feedback: "The visual and unit labels explain why the formula works." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the measured side, face, unit grid, unwrapped surface, or unit badge.", options: [{ id: "visual-units", label: "Use the measurement model and units.", correct: true, feedback: "Correct." }, { id: "same-quantity", label: "Treat every measurement as the same type.", feedback: "Area, perimeter, surface area, and volume measure different quantities." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    length: "length",
    width: "width",
    "length-x-width": "length x width",
    "side-squared": "side^2",
    perimeter: "perimeter",
    "two-l-plus-w": "2(l+w)",
    "two-pi-r": "2 pi r",
    "pi-d": "pi d",
    lw: "lw",
    lh: "lh",
    wh: "wh",
    "two-face-pairs": "2(...)",
    "six-s-squared": "6s^2",
    height: "height",
    lwh: "lwh",
    "side-cubed": "s^3",
    "pi-r-squared": "pi r^2",
    "two-pi-r-h": "2 pi r h",
    "two-pi-r-squared": "2 pi r^2",
    "one-third": "1/3",
    "pi-r-squared-h": "pi r^2 h",
    "slant-height": "slant height",
    "pi-r-l": "pi r l",
    radius: "r",
    "four-pi-r-squared": "4 pi r^2",
    "four-thirds-pi-r-cubed": "4/3 pi r^3",
    "add-parts": "add parts",
    "subtract-holes": "subtract holes",
    "cm-squared": "cm^2",
    "cm-cubed": "cm^3",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (["length", "width", "length-x-width", "side-squared"].includes(token)) return "unit-square grid";
  if (["perimeter", "two-l-plus-w", "two-pi-r", "pi-d"].includes(token)) return "outside boundary or unwrapped circumference";
  if (["lw", "lh", "wh", "two-face-pairs", "six-s-squared"].includes(token)) return "cuboid net face pair";
  if (["height", "lwh", "side-cubed"].includes(token)) return "unit-cube layers";
  if (["pi-r-squared", "two-pi-r-h", "two-pi-r-squared"].includes(token)) return "cylinder base or unrolled curved surface";
  if (["one-third", "pi-r-squared-h", "slant-height", "pi-r-l"].includes(token)) return "cone-cylinder comparison or sector";
  if (["radius", "four-pi-r-squared", "four-thirds-pi-r-cubed"].includes(token)) return "sphere radius and scaling guide";
  if (["add-parts", "subtract-holes", "cm-squared", "cm-cubed"].includes(token)) return "composite decomposition and unit badge";
  return "mensuration visual feature";
}

function compositeArea(length: number, width: number, includeCutout: number) {
  return whole(length) * whole(width) + 3 * whole(width) - (includeCutout >= 0.5 ? 4 : 0);
}

function compositeVolume(length: number, width: number, height: number, includeCutout: number) {
  return whole(length) * whole(width) * whole(height) + 2 * whole(width) * whole(height) - (includeCutout >= 0.5 ? 2 * whole(height) : 0);
}

function whole(value: number) {
  return Math.max(1, Math.round(value));
}

function fmt(item: number) {
  return Number.isFinite(item) ? item.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
