import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  CongruenceRigidMotionsVisual,
  DilationSimilarityVisual,
  LineRotationalSymmetryVisual,
  ReflectionMirrorLineVisual,
  RotationAboutPointVisual,
  TessellationsRepeatedTransformationsVisual,
  TransformationMatrices2DVisual,
  TranslationSlidingVectorVisual,
} from "./PhaseTwentySixTransformationVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const transformationsRoute = "/olympyard/practice/transformations-symmetry-foundations";

export const translationSlidingVectorPhaseTwentySixConfig = makeConfig({
  modelKey: "translation-same-vector-rigid-slide",
  steps: ["Draw preimage shape", "Choose translation vector", "Move every point", "Compare side lengths", "Compare orientation", "Conclude translation preserves shape"],
  parameters: [param("originX", "preimage x", -4, 2, -2, 0.25), param("originY", "preimage y", -3, 2, -1, 0.25), param("a", "vector a", -4, 4, 3, 0.25), param("b", "vector b", -3, 3, 2, 0.25)],
  prediction: ["What changes under a translation?", "Position changes; size, shape, and orientation stay the same."],
  misconception: ["Translation changes the size of the shape.", "Translation only slides every point by the same vector."],
  tokens: ["xy", "x-plus-a-y-plus-b", "translation-vector", "same-vector"],
  formula: ({ originX, originY, a, b }) => `(x,y)->(x+a,y+b); ${pt(originX, originY)} -> ${pt(originX + a, originY + b)} using vector (${fmt(a)},${fmt(b)})`,
  liveValues: ({ originX, originY, a, b }) => [value("translation-vector", "translation vector", `(${fmt(a)}, ${fmt(b)})`), value("original-coordinates", "original coordinates", shapeText(originX, originY)), value("image-coordinates", "image coordinates", shapeText(originX + a, originY + b)), value("side-lengths-before-after", "side lengths before/after", "2.00, 1.57, 1.32, 1.22 -> same"), value("orientation-before-after", "orientation before/after", "clockwise -> clockwise"), value("translation-invariant", "invariant", "size, shape, and orientation are preserved")],
  invariant: () => "Every point moves by the same translation vector, so all distances and orientation stay unchanged.",
  renderVisual: TranslationSlidingVectorVisual,
});

export const reflectionMirrorLinePhaseTwentySixConfig = makeConfig({
  modelKey: "reflection-equal-distance-mirror-line",
  steps: ["Draw preimage shape", "Choose mirror line", "Drop perpendicular distances", "Place image on the other side", "Compare distances and orientation", "Conclude reflection rule"],
  parameters: [param("originX", "preimage x", 0.5, 4, 2, 0.25), param("originY", "preimage y", 0.5, 3, 1, 0.25), param("mode", "mirror 0=x-axis 1=y-axis", 0, 1, 1, 1)],
  prediction: ["When reflecting over the y-axis, which coordinate changes sign?", "The x-coordinate."],
  misconception: ["Reflection always keeps orientation the same.", "Reflection preserves size and distance, but reverses orientation."],
  tokens: ["mirror-line", "equal-distance", "x-neg-y", "neg-x-y"],
  formula: ({ originX, originY, mode }) => `${Math.round(mode) === 0 ? "x-axis: (x,y)->(x,-y)" : "y-axis: (x,y)->(-x,y)"}; first point ${pt(originX - 1, originY)} reflects to ${Math.round(mode) === 0 ? pt(originX - 1, -originY) : pt(1 - originX, originY)}`,
  liveValues: ({ originX, originY, mode }) => [value("selected-mirror-line", "selected mirror line", Math.round(mode) === 0 ? "x-axis" : "y-axis"), value("original-coordinates", "original coordinates", shapeText(originX, originY)), value("reflected-coordinates", "reflected coordinates", reflectedShapeText(originX, originY, mode)), value("distance-to-mirror-before-after", "distance to mirror before/after", "equal perpendicular distances"), value("orientation-status", "orientation status", "reversed"), value("reflection-invariant", "invariant", "corresponding points are equally far from the mirror line")],
  invariant: () => "A reflection places each image point the same perpendicular distance on the opposite side of the mirror line.",
  renderVisual: ReflectionMirrorLineVisual,
});

export const rotationAboutPointPhaseTwentySixConfig = makeConfig({
  modelKey: "rotation-center-angle-radius-preserved",
  steps: ["Choose center", "Draw preimage shape", "Choose angle", "Rotate every point", "Compare distances from center", "Conclude rotation rule"],
  parameters: [param("originX", "preimage x", -3, 2, 2, 0.25), param("originY", "preimage y", -2, 2, 0, 0.25), param("centerX", "center x", -2, 2, 0, 0.25), param("centerY", "center y", -2, 2, 0, 0.25), param("angle", "angle", 90, 270, 90, 90)],
  prediction: ["What stays constant during rotation?", "Distance from the center of rotation."],
  misconception: ["Rotation changes the shape's size.", "Rotation is rigid; it changes position/orientation but preserves distances and angles."],
  tokens: ["center", "angle", "neg-y-x", "distance-preserved"],
  formula: ({ angle }) => `${fmt(angle)} deg rotation about O; origin rules include 90 deg CCW: (x,y)->(-y,x), 180 deg: (x,y)->(-x,-y), 270 deg: (x,y)->(y,-x)`,
  liveValues: ({ originX, originY, centerX, centerY, angle }) => [value("center", "center", pt(centerX, centerY)), value("angle", "angle", `${fmt(angle)} deg`), value("original-coordinates", "original coordinates", shapeText(originX, originY)), value("rotated-coordinates", "rotated coordinates", `computed by ${fmt(angle)} deg turn`), value("distances-from-center-before-after", "distances from center before/after", "same radius for each corresponding point"), value("orientation-status", "orientation status", "preserved"), value("rotation-invariant", "invariant", "distance from center is preserved")],
  invariant: () => "Every point turns through the same angle while keeping its distance from the center of rotation.",
  renderVisual: RotationAboutPointVisual,
});

export const dilationSimilarityScaleFactorPhaseTwentySixConfig = makeConfig({
  modelKey: "dilation-scale-factor-similar-shapes",
  steps: ["Choose center", "Draw preimage shape", "Choose scale factor k", "Send points along rays", "Compare side ratios", "Conclude similarity by dilation"],
  parameters: [param("originX", "preimage x", -3, 2, 1.5, 0.25), param("originY", "preimage y", -2, 2, 0.5, 0.25), param("centerX", "center x", -2, 2, -1, 0.25), param("centerY", "center y", -2, 2, -1, 0.25), param("k", "scale factor k", -2, 3, 1.5, 0.25)],
  prediction: ["If k = 2, what happens to all side lengths?", "They double."],
  misconception: ["Dilation adds k to every coordinate.", "Dilation multiplies distances from the center by k."],
  tokens: ["k", "kx-ky", "center", "similar"],
  formula: ({ k }) => `from origin: (x,y)->(kx,ky); side lengths scale by |k| = ${fmt(Math.abs(k))}`,
  liveValues: ({ centerX, centerY, k }) => [value("center", "center", pt(centerX, centerY)), value("scale-factor-k", "scale factor k", fmt(k)), value("original-side-lengths", "original side lengths", "2.00, 1.57, 1.32, 1.22"), value("image-side-lengths", "image side lengths", `each x ${fmt(Math.abs(k))}`), value("side-ratios", "side ratios", `image/original = ${fmt(Math.abs(k))}`), value("angle-preservation", "angle preservation", "all angles preserved"), value("dilation-invariant", "invariant", "image side lengths = |k| x original side lengths")],
  invariant: ({ k }) => `Dilation multiplies every distance from the center by ${fmt(k)}, creating a similar image.`,
  renderVisual: DilationSimilarityVisual,
});

export const congruenceRigidMotionsPhaseTwentySixConfig = makeConfig({
  modelKey: "congruence-rigid-motion-sequence",
  steps: ["Draw original shape", "Draw target shape", "Apply translation", "Apply rotation or reflection", "Match the shapes", "Conclude congruence"],
  parameters: [param("step", "sequence step", 0, 3, 1, 1)],
  prediction: ["What do rigid motions preserve?", "Distances and angles."],
  misconception: ["Congruent shapes must start in the same position.", "Congruent shapes may be translated, rotated, or reflected; they only need same size and shape."],
  tokens: ["translation", "rotation", "reflection", "same-size", "same-shape", "congruent"],
  formula: ({ step }) => `rigid motion sequence step ${fmt(step)}: translation, rotation, and reflection preserve same size and same shape`,
  liveValues: ({ step }) => [value("side-lengths-original", "side lengths original", "2.00, 1.57, 1.32, 1.22"), value("side-lengths-image", "side lengths image", "2.00, 1.57, 1.32, 1.22"), value("angles-original", "angles original", "preserved angle set"), value("angles-image", "angles image", "same angle set"), value("transformation-sequence", "transformation sequence", sequenceName(step)), value("congruence-status", "congruence status", "congruent"), value("rigid-motion-invariant", "invariant", "rigid motions preserve distances and angles")],
  invariant: () => "Translations, rotations, and reflections are rigid motions, so they preserve all distances and angles.",
  renderVisual: CongruenceRigidMotionsVisual,
});

export const lineRotationalSymmetryPhaseTwentySixConfig = makeConfig({
  modelKey: "line-rotational-symmetry-maps-to-itself",
  steps: ["Choose shape", "Test mirror lines", "Count line symmetries", "Rotate shape", "Count rotations that match", "Conclude symmetry type and order"],
  parameters: [param("shape", "shape 0=triangle 1=square 2=pentagon 3=rectangle", 0, 3, 1, 1), param("angle", "rotation angle", 0, 360, 90, 15)],
  prediction: ["What is the rotational symmetry order of a square?", "4."],
  misconception: ["Every shape has the same number of line and rotational symmetries.", "Different shapes have different symmetry counts."],
  tokens: ["line-symmetry", "rotation-angle", "order", "maps-to-itself"],
  formula: ({ shape, angle }) => `${shapeName(shape)}: line symmetry count ${lineCount(shape)}, rotational order ${rotationalOrder(shape)}, tested angle ${fmt(angle)} deg`,
  liveValues: ({ shape, angle }) => [value("selected-shape", "selected shape", shapeName(shape)), value("line-symmetry-count", "line symmetry count", lineCount(shape)), value("rotational-symmetry-order", "rotational symmetry order", rotationalOrder(shape)), value("selected-angle", "selected angle", `${fmt(angle)} deg`), value("maps-to-itself-status", "maps-to-itself status", mapsToSelf(shape, angle) ? "yes" : "not at this angle"), value("symmetry-invariant", "invariant", "symmetry transformation leaves the figure unchanged")],
  invariant: ({ shape }) => `${shapeName(shape)} maps to itself under its symmetry reflections and rotations.`,
  renderVisual: LineRotationalSymmetryVisual,
});

export const tessellationsRepeatedTransformationsPhaseTwentySixConfig = makeConfig({
  modelKey: "tessellation-repeated-transforms-no-gaps-overlaps",
  steps: ["Choose base tile", "Repeat by translation", "Check gaps", "Check overlaps", "Try rotations/reflections", "Conclude tessellation condition"],
  parameters: [param("tile", "tile 0=square 1=triangle 2=hexagon 3=rectangle", 0, 3, 0, 1), param("mode", "mode 0=translation 1=rotation 2=reflection", 0, 2, 0, 1), param("spacing", "repeat spacing", 1.2, 2.8, 2, 0.1)],
  prediction: ["What two problems must a tessellation avoid?", "Gaps and overlaps."],
  misconception: ["Any shape can tile the plane by just repeating it.", "A tile must fit with copies without gaps or overlaps."],
  tokens: ["translation", "rotation-reflection", "no-gaps", "no-overlaps", "angle-fit"],
  formula: ({ tile, mode, spacing }) => `${tileName(tile)} repeated by ${tessellationMode(mode)} with spacing ${fmt(spacing)}; angle fit around vertex = ${angleFit(tile)}`,
  liveValues: ({ tile, mode, spacing }) => [value("tile-type", "tile type", tileName(tile)), value("transformation-mode", "transformation mode", tessellationMode(mode)), value("repeat-spacing", "repeat spacing", fmt(spacing)), value("gap-overlap-status", "gap/overlap status", spacing > 2.2 ? "gaps visible" : spacing < 1.6 ? "overlap risk" : "fits"), value("angle-fit-around-vertex", "angle fit around vertex", angleFit(tile)), value("tessellation-status", "tessellation status", "standard tile can tessellate"), value("tessellation-invariant", "invariant", "copies cover the plane only when gaps and overlaps are avoided")],
  invariant: () => "A tessellation uses repeated transformations to cover the plane with no gaps and no overlaps.",
  renderVisual: TessellationsRepeatedTransformationsVisual,
});

export const transformationMatrices2dPhaseTwentySixConfig = makeConfig({
  modelKey: "matrix-2d-basis-vectors-determinant",
  steps: ["Choose transformation", "Show matrix", "Transform basis vectors", "Transform shape", "Compare determinant, area, and orientation", "Conclude matrix transformation meaning"],
  parameters: [param("mode", "matrix 0=reflect 1=rotate 2=scale 3=shear", 0, 3, 1, 1), param("k", "scale/shear k", -2, 3, 1.5, 0.25)],
  prediction: ["What do the columns of a transformation matrix show?", "Where the basis vectors land."],
  misconception: ["A transformation matrix only changes one point.", "A matrix defines a rule that transforms every point/vector consistently."],
  tokens: ["matrix-entries", "basis-vectors", "transformed-shape", "coordinate-rule"],
  formula: ({ mode, k }) => `${matrixName(mode)} matrix ${matrixText(mode, k)} maps every point by the same linear rule; determinant = ${fmt(determinant(mode, k))}`,
  liveValues: ({ mode, k }) => [value("selected-matrix", "selected matrix", `${matrixName(mode)} ${matrixText(mode, k)}`), value("input-point-vector", "input point/vector", "(2, 1)"), value("output-point-vector", "output point/vector", matrixOutput(mode, k, 2, 1)), value("determinant", "determinant", fmt(determinant(mode, k))), value("area-scale", "area scale", fmt(Math.abs(determinant(mode, k)))), value("orientation-status", "orientation status", determinant(mode, k) < 0 ? "reversed" : "preserved"), value("matrix-rule-invariant", "invariant", "matrix maps every point by the same linear rule")],
  invariant: () => "The same matrix rule maps basis vectors, shapes, and every point in the plane consistently.",
  renderVisual: TransformationMatrices2DVisual,
});

export const phaseTwentySixRouteSlugs = [
  ["transformations-symmetry", "translation-sliding-vector"],
  ["transformations-symmetry", "reflection-mirror-line"],
  ["transformations-symmetry", "rotation-about-point"],
  ["transformations-symmetry", "dilation-similarity-scale-factor"],
  ["transformations-symmetry", "congruence-rigid-motions"],
  ["transformations-symmetry", "line-rotational-symmetry"],
  ["transformations-symmetry", "tessellations-repeated-transformations"],
  ["transformations-symmetry", "transformation-matrices-2d"],
] as const;

export const phaseTwentySixConfigs = [
  translationSlidingVectorPhaseTwentySixConfig,
  reflectionMirrorLinePhaseTwentySixConfig,
  rotationAboutPointPhaseTwentySixConfig,
  dilationSimilarityScaleFactorPhaseTwentySixConfig,
  congruenceRigidMotionsPhaseTwentySixConfig,
  lineRotationalSymmetryPhaseTwentySixConfig,
  tessellationsRepeatedTransformationsPhaseTwentySixConfig,
  transformationMatrices2dPhaseTwentySixConfig,
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentySixModelKey: string } {
  return {
    phaseTwentySixModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: transformationsRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `transform-${input.modelKey}-invariant`, label: "transformation-grid invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG transformation-grid model.", "Values are bounded to keep labels and handles readable on mobile.", "Keyboard fallback controls are available in the shared parameter panel."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) { return { id, label, min, max, defaultValue, step }; }
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p26-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "transformation-grid visual" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the transformation-grid visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "changes-everything", label: "The whole figure changes size and shape.", feedback: "Check the invariant: some transformations are rigid, and dilations preserve shape by scaling." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the vector, mirror line, rotation center, scale factor, symmetry axis, tile repeat, or matrix columns.", options: [{ id: "invariant", label: "Use the invariant shown in the grid.", correct: true, feedback: "Correct." }, { id: "memorize-rule", label: "Memorize the coordinate rule only.", feedback: "The rule is easier to trust when the grid shows why it works." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    xy: "(x,y)", "x-plus-a-y-plus-b": "(x+a,y+b)", "translation-vector": "(a,b)", "same-vector": "same vector",
    "mirror-line": "mirror line", "equal-distance": "equal distance", "x-neg-y": "(x,-y)", "neg-x-y": "(-x,y)",
    center: "center", angle: "angle", "neg-y-x": "(-y,x)", "distance-preserved": "distance preserved",
    k: "k", "kx-ky": "(kx,ky)", similar: "similar",
    translation: "translation", rotation: "rotation", reflection: "reflection", "same-size": "same size", "same-shape": "same shape", congruent: "congruent",
    "line-symmetry": "line of symmetry", "rotation-angle": "rotation angle", order: "order", "maps-to-itself": "maps to itself",
    "rotation-reflection": "rotation/reflection", "no-gaps": "no gaps", "no-overlaps": "no overlaps", "angle-fit": "360 around point",
    "matrix-entries": "matrix entries", "basis-vectors": "basis vectors", "transformed-shape": "transformed shape", "coordinate-rule": "coordinate rule",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}
function tokenVisualLabel(token: string) {
  if (["xy", "x-plus-a-y-plus-b", "translation-vector", "same-vector"].includes(token)) return "preimage, image, translation vector, and equal move arrows";
  if (["mirror-line", "equal-distance", "x-neg-y", "neg-x-y"].includes(token)) return "mirror axis, equal perpendicular distances, and reflected coordinates";
  if (["center", "angle", "neg-y-x", "distance-preserved"].includes(token)) return "rotation center, angle arcs, and preserved radii";
  if (["k", "kx-ky", "similar"].includes(token)) return "dilation center, scale factor rays, and similar side ratios";
  if (["translation", "rotation", "reflection", "same-size", "same-shape", "congruent"].includes(token)) return "rigid-motion sequence and congruent overlay";
  if (["line-symmetry", "rotation-angle", "order", "maps-to-itself"].includes(token)) return "symmetry axes and rotations that map the shape to itself";
  if (["rotation-reflection", "no-gaps", "no-overlaps", "angle-fit"].includes(token)) return "repeated transformed tiles and vertex angle fit";
  if (["matrix-entries", "basis-vectors", "transformed-shape", "coordinate-rule"].includes(token)) return "matrix entries, transformed basis vectors, determinant, and output shape";
  return "transformation-grid visual feature";
}

function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
function pt(x: number, y: number) { return `(${fmt(x)}, ${fmt(y)})`; }
function shapeText(originX: number, originY: number) { return `${pt(originX - 1, originY)}, ${pt(originX + 1, originY)}, ${pt(originX + 0.5, originY + 1.4)}, ${pt(originX - 0.8, originY + 1)}`; }
function reflectedShapeText(originX: number, originY: number, mode: number) { return Math.round(mode) === 0 ? shapeText(originX, -originY) : shapeText(-originX, originY); }
function sequenceName(stepValue: number) { return ["preimage", "translate", "rotate", "reflect/overlay"][Math.round(stepValue)] ?? "overlay"; }
function shapeName(shape: number) { return ["equilateral triangle", "square", "regular pentagon", "rectangle"][Math.round(shape)] ?? "square"; }
function lineCount(shape: number) { return [3, 4, 5, 2][Math.round(shape)] ?? 4; }
function rotationalOrder(shape: number) { return [3, 4, 5, 2][Math.round(shape)] ?? 4; }
function mapsToSelf(shape: number, angle: number) { const order = rotationalOrder(shape); return Math.round(angle) % Math.round(360 / order) === 0; }
function tileName(tile: number) { return ["square", "equilateral triangle", "regular hexagon", "rectangle"][Math.round(tile)] ?? "square"; }
function tessellationMode(mode: number) { return ["translation", "rotation", "reflection"][Math.round(mode)] ?? "translation"; }
function angleFit(tile: number) { return ["4 x 90 = 360", "6 x 60 = 360", "3 x 120 = 360", "4 x 90 = 360"][Math.round(tile)] ?? "fits 360"; }
function matrixName(mode: number) { return ["reflection across x-axis", "rotation by 90 deg", "scaling by k", "shear by k"][Math.round(mode)] ?? "rotation by 90 deg"; }
function matrixText(mode: number, k: number) {
  if (Math.round(mode) === 0) return "[[1,0],[0,-1]]";
  if (Math.round(mode) === 1) return "[[0,-1],[1,0]]";
  if (Math.round(mode) === 2) return `[[${fmt(k)},0],[0,${fmt(k)}]]`;
  return `[[1,${fmt(k)}],[0,1]]`;
}
function determinant(mode: number, k: number) {
  if (Math.round(mode) === 0) return -1;
  if (Math.round(mode) === 1) return 1;
  if (Math.round(mode) === 2) return k * k;
  return 1;
}
function matrixOutput(mode: number, k: number, x: number, y: number) {
  if (Math.round(mode) === 0) return pt(x, -y);
  if (Math.round(mode) === 1) return pt(-y, x);
  if (Math.round(mode) === 2) return pt(k * x, k * y);
  return pt(x + k * y, y);
}
