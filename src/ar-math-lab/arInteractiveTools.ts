import type { ARAnimation, ARComparison, ARGeneratedGeometrySolid, ARGeneratedGraphObject, ARLessonCard, ARMeasurement, ARMeasurementType, ARSceneSaveData } from "./types";

export const arLessonCards: ARLessonCard[] = [
  {
    id: "surface-wave",
    objectType: "wave",
    title: "Wave Surface",
    concept: "The height z depends on both x and y.",
    keyObservations: ["Peaks occur when sin(x) and sin(y) have the same sign.", "Valleys occur when one is positive and the other is negative.", "The surface repeats periodically."],
    tryThis: ["Increase amplitude a.", "Increase frequency k.", "Turn on wireframe.", "View from top to see the pattern."],
    questions: ["What changes when frequency increases?"],
  },
  {
    id: "surface-paraboloid",
    objectType: "paraboloid",
    title: "Paraboloid",
    concept: "A bowl-shaped quadratic surface.",
    keyObservations: ["Minimum point is at the origin.", "z increases as distance from origin increases.", "Horizontal cross-sections are circles."],
    tryThis: ["Show horizontal cross-section.", "Change z-scale.", "Compare with z = x^2 - y^2."],
  },
  {
    id: "surface-saddle",
    objectType: "saddle",
    title: "Saddle Surface",
    concept: "The surface curves upward in one direction and downward in another.",
    keyObservations: ["Along x-axis, z increases.", "Along y-axis, z decreases.", "The origin is a saddle point."],
    tryThis: ["Show x and y cross-sections.", "Compare with paraboloid.", "Rotate the object."],
    questions: ["Why is the origin not a maximum or minimum?"],
  },
  {
    id: "solid-cone",
    objectType: "cone",
    title: "Cone",
    concept: "A cone has a circular base and a curved surface meeting at one vertex.",
    keyObservations: ["Slant height depends on radius and height.", "Volume is one-third of a cylinder with the same base and height.", "Horizontal cross-sections are circles."],
    tryThis: ["Animate height.", "Show slant height.", "Compare with cylinder."],
    questions: ["What happens to the volume if height doubles?"],
  },
  {
    id: "solid-cylinder",
    objectType: "cylinder",
    title: "Cylinder",
    concept: "A cylinder has two equal circular bases and one curved surface.",
    keyObservations: ["Volume = base area x height.", "Horizontal cross-section is a circle.", "Vertical cross-section is a rectangle."],
    tryThis: ["Animate radius.", "Show curved surface area.", "Compare with cone of the same radius and height."],
    questions: ["What happens to volume if radius doubles?"],
  },
  {
    id: "solid-sphere",
    objectType: "sphere",
    title: "Sphere",
    concept: "A sphere is the set of all points at the same distance from a center.",
    keyObservations: ["Every radius is equal.", "Central cross-section is a circle.", "Volume grows with radius cubed."],
    tryThis: ["Animate radius.", "Show central cross-section.", "Compare radius and diameter."],
    questions: ["Why does volume increase much faster when radius increases?"],
  },
];

export function createMeasurement(type: ARMeasurementType, objectId?: string, unit = "cm"): ARMeasurement {
  const points = defaultMeasurementPoints(type);
  return {
    id: `ar-measure-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    type,
    objectId,
    points,
    value: measurementValue(type, points),
    unit,
    label: measurementLabel(type, measurementValue(type, points), unit),
    locked: false,
    visible: true,
  };
}

export function createObjectDimensionMeasurement(solid: ARGeneratedGeometrySolid, key: string): ARMeasurement {
  const value = solid.calculatedValues.values[key] ?? solid.dimensions[key]?.value ?? 0;
  const unit = key.toLowerCase().includes("area") ? `${solid.unit}^2` : key.toLowerCase().includes("volume") ? `${solid.unit}^3` : solid.unit;
  return {
    id: `ar-measure-${Date.now()}-${key}`,
    type: key.toLowerCase().includes("slant") ? "slant_height" : key.toLowerCase().includes("diameter") ? "diameter" : key.toLowerCase().includes("radius") ? "radius" : "height",
    objectId: solid.id,
    points: [],
    value,
    unit,
    label: `${readable(key)} = ${format(value)} ${unit}`,
    locked: false,
    visible: true,
  };
}

export function measurementValue(type: ARMeasurementType, points: [number, number, number][]) {
  if ((type === "distance" || type === "height" || type === "radius" || type === "diameter" || type === "edge_length" || type === "slant_height") && points.length >= 2) return distance(points[0], points[1]);
  if (type === "angle" && points.length >= 3) return angle(points[0], points[1], points[2]);
  if (type === "point_coordinate" && points.length >= 1) return points[0][1];
  return 0;
}

export function measurementLabel(type: ARMeasurementType, value: number, unit: string) {
  if (type === "angle") return `Angle = ${format(value)} deg`;
  if (type === "point_coordinate") return `Point coordinate y = ${format(value)}`;
  return `${readable(type)} = ${format(value)} ${unit}`;
}

export function createAnimation(objectId: string, target: ARAnimation["target"], property: string): ARAnimation {
  return {
    id: `ar-animation-${Date.now()}`,
    objectId,
    target,
    property,
    from: target === "rotation" ? 0 : 1,
    to: target === "rotation" ? Math.PI * 2 : 3,
    durationMs: 4000,
    loop: true,
    pingPong: target !== "rotation",
    status: "idle",
  };
}

export function lessonFor(graph?: ARGeneratedGraphObject, solid?: ARGeneratedGeometrySolid) {
  if (solid) return arLessonCards.find((card) => card.objectType === solid.solidType) ?? arLessonCards[0];
  const equation = graph?.equation.toLowerCase() ?? "";
  if (equation.includes("sin(x)") && equation.includes("sin(y)")) return arLessonCards[0];
  if (equation.includes("x^2 + y^2")) return arLessonCards[1];
  if (equation.includes("x^2 - y^2")) return arLessonCards[2];
  return arLessonCards[0];
}

export function feedbackFor(input: string, graph?: ARGeneratedGraphObject, solid?: ARGeneratedGeometrySolid) {
  const feedback: string[] = [];
  const lower = input.toLowerCase();
  if (lower.includes("x^2 + y^2")) feedback.push("This is a paraboloid. Try enabling horizontal cross-section to see circular level curves.");
  if (/sin\s*\(\s*10/.test(lower) || lower.includes("10x") || lower.includes("10*x")) feedback.push("High frequency detected. Increase resolution for better quality, or reduce frequency for smoother mobile performance.");
  if (solid?.solidType === "cone" && Math.abs((solid.calculatedValues.values.slantHeight ?? 0) - 13) < 0.01) feedback.push("Slant height is 13 cm. This forms a 5-12-13 right triangle.");
  if (solid && solid.maxDimensionMeters > 10) feedback.push("This object is very large. Fit to View or Miniature Mode is recommended.");
  if (graph && (graph.settings.resolutionX > 100 || graph.settings.resolutionY > 100)) feedback.push("High resolution may reduce performance on mobile. Recommended resolution: 60.");
  if (!feedback.length) feedback.push("Try measuring, animating, or comparing this object to reveal the underlying math.");
  return feedback;
}

export function comparisonSummary(comparison: ARComparison, graphs: ARGeneratedGraphObject[], solids: ARGeneratedGeometrySolid[]) {
  const objectA = findObject(comparison.objectAId, graphs, solids);
  const objectB = findObject(comparison.objectBId, graphs, solids);
  if (!objectA || !objectB) return "Select two objects to compare.";
  if (objectA.kind === "solid" && objectB.kind === "solid") {
    if (new Set([objectA.solid.solidType, objectB.solid.solidType]).has("cone") && new Set([objectA.solid.solidType, objectB.solid.solidType]).has("cylinder")) return "Both objects can share the same radius and height. The cone occupies one-third of the cylinder's volume.";
    if (new Set([objectA.solid.solidType, objectB.solid.solidType]).has("sphere") && new Set([objectA.solid.solidType, objectB.solid.solidType]).has("hemisphere")) return "The hemisphere has exactly half the volume of a sphere with the same radius.";
    return `${objectA.solid.name} volume is ${firstFormulaResult(objectA.solid)}; ${objectB.solid.name} volume is ${firstFormulaResult(objectB.solid)}.`;
  }
  const eqA = objectA.kind === "graph" ? objectA.graph.equation : objectA.solid.name;
  const eqB = objectB.kind === "graph" ? objectB.graph.equation : objectB.solid.name;
  if (eqA.includes("x^2 + y^2") && eqB.includes("x^2 - y^2")) return "The paraboloid curves upward in all directions, while the saddle curves upward in one direction and downward in another.";
  return `Compare ${eqA} with ${eqB}. Check shape, formula, scale, and cross-sections.`;
}

export function serializeScene(data: Omit<ARSceneSaveData, "version" | "module" | "savedAt">): ARSceneSaveData {
  return { version: "1.0", module: "ARMathLab", savedAt: new Date().toISOString(), ...data };
}

export function parseSceneJson(raw: string): ARSceneSaveData {
  const parsed = JSON.parse(raw) as Partial<ARSceneSaveData>;
  if (parsed.module !== "ARMathLab" || !Array.isArray(parsed.graphs) || !Array.isArray(parsed.solids)) throw new Error("Invalid scene file. Please import a valid AR Math Lab JSON scene.");
  return {
    version: parsed.version ?? "1.0",
    module: "ARMathLab",
    graphs: parsed.graphs,
    solids: parsed.solids,
    measurements: Array.isArray(parsed.measurements) ? parsed.measurements : [],
    animations: Array.isArray(parsed.animations) ? parsed.animations : [],
    comparison: parsed.comparison ?? { enabled: false, mode: "side-by-side", syncScale: true },
    settings: parsed.settings ?? { showGrid: true, showAxes: true, showLabels: true },
    learning: parsed.learning,
    savedAt: parsed.savedAt ?? new Date().toISOString(),
  };
}

function defaultMeasurementPoints(type: ARMeasurementType): [number, number, number][] {
  if (type === "angle") return [[1, 0, 0], [0, 0, 0], [0, 1, 0]];
  if (type === "point_coordinate") return [[0, 0, 0]];
  return [[0, 0, 0], [1, 0, 0]];
}

function distance(a: [number, number, number], b: [number, number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
}

function angle(a: [number, number, number], b: [number, number, number], c: [number, number, number]) {
  const ab = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cb = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  const dot = ab[0] * cb[0] + ab[1] * cb[1] + ab[2] * cb[2];
  const denom = Math.max(1e-9, Math.hypot(...ab) * Math.hypot(...cb));
  return (Math.acos(Math.max(-1, Math.min(1, dot / denom))) * 180) / Math.PI;
}

function findObject(id: string | undefined, graphs: ARGeneratedGraphObject[], solids: ARGeneratedGeometrySolid[]) {
  const graph = graphs.find((item) => item.id === id);
  if (graph) return { kind: "graph" as const, graph };
  const solid = solids.find((item) => item.id === id);
  if (solid) return { kind: "solid" as const, solid };
  return null;
}

function firstFormulaResult(solid: ARGeneratedGeometrySolid) {
  return solid.calculatedValues.formulas.find((formula) => formula.label === "Volume")?.result ?? solid.calculatedValues.formulas[0]?.result ?? "not calculated";
}

function readable(value: string) {
  return value.replace(/_/g, " ").replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
