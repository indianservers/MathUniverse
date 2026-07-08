import { convertToMeters, normalizeARUnit } from "./arUnits";
import type { ARCrossSectionMode, ARGeneratedGeometrySolid, ARGeometryQuality, ARScaleMode, ARSolidType, ARUnit } from "./types";

export type GeometryParseResult =
  | { ok: true; solid: ARGeneratedGeometrySolid }
  | { ok: false; solidType?: ARSolidType; message: string; missingInputs: string[]; warnings: string[]; dimensions: GeometryDimensionMap; unit: ARUnit };

export type GeometryDimensionMap = Record<string, { value: number; unit: ARUnit; meters: number }>;

export const solidTypeLabels: Record<ARSolidType, string> = {
  cube: "Cube",
  cuboid: "Cuboid",
  cylinder: "Cylinder",
  cone: "Cone",
  sphere: "Sphere",
  hemisphere: "Hemisphere",
  prism: "Prism",
  pyramid: "Pyramid",
  frustum: "Frustum",
  torus: "Torus",
};

export const solidExplanations: Record<ARSolidType, string> = {
  cube: "A cube has six equal square faces. Its volume is side cubed and its surface area is six square faces.",
  cuboid: "A cuboid has six rectangular faces. Its volume is length multiplied by width multiplied by height.",
  cylinder: "A cylinder has two congruent circular bases and one curved surface. Its volume is base area multiplied by height.",
  cone: "A cone has one circular base and one curved surface that meets at a vertex. Its volume is one-third of a cylinder with the same base radius and height.",
  sphere: "A sphere is the set of all points in 3D space that are the same distance from a center point.",
  hemisphere: "A hemisphere is half of a sphere. It has one curved surface and one circular base.",
  prism: "A prism keeps the same polygonal base shape while extending through a length or height.",
  pyramid: "A pyramid has a polygon base and triangular faces that meet at a vertex.",
  frustum: "A cone frustum is made by slicing the top off a cone, leaving two circular bases with different radii.",
  torus: "A torus is a ring-shaped solid made by rotating a circle around an axis outside the circle.",
};

const defaultUnit: ARUnit = "cm";

export function parseGeometrySolidInput(input: string, fallbackUnit: ARUnit = defaultUnit): GeometryParseResult {
  const normalized = input.trim();
  const lower = normalized.toLowerCase();
  const solidType = detectSolidType(lower);
  if (!solidType) {
    return { ok: false, message: "Choose a geometry solid or type a solid instruction such as Cone radius 5 cm height 12 cm.", missingInputs: ["solid type"], warnings: [], dimensions: {}, unit: fallbackUnit };
  }

  const warnings: string[] = [];
  const unit = detectPreferredUnit(lower) ?? fallbackUnit;
  if (!detectPreferredUnit(lower) && /\d/.test(lower)) warnings.push(`No unit was detected. Using default unit: ${unit}.`);
  const dimensions = normalizeDimensions(solidType, extractDimensionValues(lower, unit), unit, warnings);
  const missingInputs = requiredInputsFor(solidType, dimensions);
  const invalid = Object.entries(dimensions).filter(([, dimension]) => dimension.value <= 0).map(([key]) => key);
  if (invalid.length) {
    return { ok: false, solidType, message: `${sentenceList(invalid)} must be greater than zero.`, missingInputs: invalid, warnings, dimensions, unit };
  }
  if (missingInputs.length) {
    return { ok: false, solidType, message: `${sentenceList(missingInputs)} ${missingInputs.length === 1 ? "is" : "are"} required to create a ${solidTypeLabels[solidType].toLowerCase()}.`, missingInputs, warnings, dimensions, unit };
  }

  const maxDimensionMeters = Math.max(...Object.values(dimensions).map((dimension) => dimension.meters), 0.01);
  if (maxDimensionMeters > 10) warnings.push("This object is very large. Fit to View mode is recommended.");
  if (maxDimensionMeters < 0.001) warnings.push("This object is very small. Classroom Scale or Fit to View is recommended.");
  if (solidType === "frustum" && dimensions.topRadius.value > dimensions.bottomRadius.value) warnings.push("Top radius is larger than bottom radius. The frustum will widen upward.");

  return {
    ok: true,
    solid: createGeometrySolid({
      input: normalized,
      solidType,
      dimensions,
      unit,
      warnings,
      displayScaleMode: recommendedScaleMode(maxDimensionMeters),
    }),
  };
}

export function createGeometrySolid(options: {
  input: string;
  solidType: ARSolidType;
  dimensions: GeometryDimensionMap;
  unit: ARUnit;
  warnings?: string[];
  displayScaleMode?: ARScaleMode;
  customScale?: number;
  settings?: Partial<ARGeneratedGeometrySolid["settings"]>;
  transform?: Partial<ARGeneratedGeometrySolid["transform"]>;
}): ARGeneratedGeometrySolid {
  const maxDimensionMeters = Math.max(...Object.values(options.dimensions).map((dimension) => dimension.meters), 0.01);
  return {
    id: `ar-solid-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    name: solidTypeLabels[options.solidType],
    type: "geometry_solid",
    solidType: options.solidType,
    dimensions: options.dimensions,
    unit: options.unit,
    calculatedValues: calculateSolidValues(options.solidType, options.dimensions, options.unit),
    visible: true,
    locked: false,
    transform: {
      position: options.transform?.position ?? [0, 0.45, 0],
      rotation: options.transform?.rotation ?? [0, 0, 0],
      scale: options.transform?.scale ?? [1, 1, 1],
    },
    displayScaleMode: options.displayScaleMode ?? recommendedScaleMode(maxDimensionMeters),
    customScale: options.customScale ?? 1,
    maxDimensionMeters,
    settings: {
      showLabels: true,
      showFormula: true,
      showWireframe: true,
      transparent: true,
      showCrossSection: false,
      crossSectionMode: "off",
      crossSectionPosition: 0.5,
      showDimensionLines: true,
      quality: "medium",
      ...options.settings,
    },
    warnings: options.warnings ?? [],
    explanation: solidExplanations[options.solidType],
    createdFromInput: options.input,
  };
}

export function updateGeometryDimension(solid: ARGeneratedGeometrySolid, key: string, value: number): ARGeneratedGeometrySolid {
  const current = solid.dimensions[key];
  if (!current || value <= 0 || !Number.isFinite(value)) return solid;
  const dimensions = { ...solid.dimensions, [key]: makeDimension(value, current.unit) };
  return {
    ...solid,
    dimensions,
    calculatedValues: calculateSolidValues(solid.solidType, dimensions, solid.unit),
    maxDimensionMeters: Math.max(...Object.values(dimensions).map((dimension) => dimension.meters), 0.01),
  };
}

export function calculateDisplayScale(solid: ARGeneratedGeometrySolid) {
  const maxDimension = Math.max(solid.maxDimensionMeters, 0.001);
  if (solid.displayScaleMode === "real-scale") return 1;
  if (solid.displayScaleMode === "classroom-scale") return 0.5 / maxDimension;
  if (solid.displayScaleMode === "miniature") return 0.2 / maxDimension;
  if (solid.displayScaleMode === "custom") return solid.customScale;
  return Math.min(4, Math.max(0.08, 1.8 / maxDimension));
}

export function qualitySegments(quality: ARGeometryQuality) {
  if (quality === "low") return { radial: 24, sphereWidth: 32, sphereHeight: 16, torusTube: 10 };
  if (quality === "high") return { radial: 72, sphereWidth: 72, sphereHeight: 36, torusTube: 24 };
  return { radial: 48, sphereWidth: 48, sphereHeight: 24, torusTube: 16 };
}

export function crossSectionLabel(solidType: ARSolidType, mode: ARCrossSectionMode) {
  if (mode === "horizontal") {
    if (solidType === "cone") return "Horizontal cross-section of a cone is a circle.";
    if (solidType === "cylinder") return "Horizontal cross-section of a cylinder is a circle.";
    if (solidType === "sphere" || solidType === "hemisphere") return "Central cross-section of a sphere is a circle.";
  }
  if (mode === "vertical") {
    if (solidType === "cone" || solidType === "pyramid") return `Vertical cross-section of a ${solidType} is a triangle.`;
    if (solidType === "cylinder" || solidType === "cuboid" || solidType === "cube") return `Vertical cross-section of a ${solidType} is a rectangle.`;
  }
  return "Cross-section tool is off.";
}

export function formulaSummary(solid: ARGeneratedGeometrySolid) {
  return solid.calculatedValues.formulas.map((line) => `${line.label}: ${line.result}`).join(" | ");
}

function calculateSolidValues(solidType: ARSolidType, dimensions: GeometryDimensionMap, unit: ARUnit) {
  const v = (key: string) => dimensions[key]?.value ?? 0;
  const radius = v("radius");
  const height = v("height");
  const length = v("length");
  const width = v("width");
  const side = v("side");
  const topRadius = v("topRadius");
  const bottomRadius = v("bottomRadius");
  const majorRadius = v("majorRadius");
  const minorRadius = v("minorRadius");
  const baseSide = v("baseSide") || side;
  const n = prismSides(dimensions.baseType?.value);
  const values: Record<string, number> = {};
  const formulas = [];
  const lengthUnit = unit;
  const areaUnit = `${unit}²`;
  const volumeUnit = `${unit}³`;

  if (solidType === "cube") {
    values.volume = side ** 3;
    values.surfaceArea = 6 * side ** 2;
    values.faceDiagonal = side * Math.sqrt(2);
    values.spaceDiagonal = side * Math.sqrt(3);
    formulas.push(line("Volume", "V = s^3", `V = ${fmt(side)}^3`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Surface Area", "SA = 6s^2", `SA = 6 × ${fmt(side)}^2`, `${fmt(values.surfaceArea)} ${areaUnit}`));
  } else if (solidType === "cuboid") {
    values.volume = length * width * height;
    values.surfaceArea = 2 * (length * width + width * height + length * height);
    values.spaceDiagonal = Math.sqrt(length ** 2 + width ** 2 + height ** 2);
    formulas.push(line("Volume", "V = l × w × h", `V = ${fmt(length)} × ${fmt(width)} × ${fmt(height)}`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Surface Area", "SA = 2(lw + wh + lh)", `SA = 2(${fmt(length * width)} + ${fmt(width * height)} + ${fmt(length * height)})`, `${fmt(values.surfaceArea)} ${areaUnit}`));
  } else if (solidType === "cylinder") {
    values.diameter = 2 * radius;
    values.volume = Math.PI * radius ** 2 * height;
    values.curvedSurfaceArea = 2 * Math.PI * radius * height;
    values.totalSurfaceArea = 2 * Math.PI * radius * (radius + height);
    formulas.push(line("Volume", "V = πr^2h", `V = π × ${fmt(radius)}^2 × ${fmt(height)}`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Curved Surface Area", "CSA = 2πrh", `CSA = 2π × ${fmt(radius)} × ${fmt(height)}`, `${fmt(values.curvedSurfaceArea)} ${areaUnit}`));
    formulas.push(line("Total Surface Area", "TSA = 2πr(r + h)", `TSA = 2π × ${fmt(radius)} × (${fmt(radius)} + ${fmt(height)})`, `${fmt(values.totalSurfaceArea)} ${areaUnit}`));
  } else if (solidType === "cone") {
    values.diameter = 2 * radius;
    values.slantHeight = v("slantHeight") || Math.sqrt(radius ** 2 + height ** 2);
    values.volume = (Math.PI * radius ** 2 * height) / 3;
    values.curvedSurfaceArea = Math.PI * radius * values.slantHeight;
    values.totalSurfaceArea = Math.PI * radius * (radius + values.slantHeight);
    formulas.push(line("Slant Height", "l = sqrt(r^2 + h^2)", `l = sqrt(${fmt(radius)}^2 + ${fmt(height)}^2)`, `${fmt(values.slantHeight)} ${lengthUnit}`));
    formulas.push(line("Volume", "V = 1/3 × πr^2h", `V = 1/3 × π × ${fmt(radius)}^2 × ${fmt(height)}`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Curved Surface Area", "CSA = πrl", `CSA = π × ${fmt(radius)} × ${fmt(values.slantHeight)}`, `${fmt(values.curvedSurfaceArea)} ${areaUnit}`));
    formulas.push(line("Total Surface Area", "TSA = πr(r + l)", `TSA = π × ${fmt(radius)} × (${fmt(radius)} + ${fmt(values.slantHeight)})`, `${fmt(values.totalSurfaceArea)} ${areaUnit}`));
  } else if (solidType === "sphere") {
    values.diameter = 2 * radius;
    values.volume = (4 * Math.PI * radius ** 3) / 3;
    values.surfaceArea = 4 * Math.PI * radius ** 2;
    formulas.push(line("Volume", "V = 4/3 × πr^3", `V = 4/3 × π × ${fmt(radius)}^3`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Surface Area", "SA = 4πr^2", `SA = 4π × ${fmt(radius)}^2`, `${fmt(values.surfaceArea)} ${areaUnit}`));
  } else if (solidType === "hemisphere") {
    values.diameter = 2 * radius;
    values.volume = (2 * Math.PI * radius ** 3) / 3;
    values.curvedSurfaceArea = 2 * Math.PI * radius ** 2;
    values.totalSurfaceArea = 3 * Math.PI * radius ** 2;
    formulas.push(line("Volume", "V = 2/3 × πr^3", `V = 2/3 × π × ${fmt(radius)}^3`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Curved Surface Area", "CSA = 2πr^2", `CSA = 2π × ${fmt(radius)}^2`, `${fmt(values.curvedSurfaceArea)} ${areaUnit}`));
    formulas.push(line("Total Surface Area", "TSA = 3πr^2", `TSA = 3π × ${fmt(radius)}^2`, `${fmt(values.totalSurfaceArea)} ${areaUnit}`));
  } else if (solidType === "prism") {
    values.perimeter = n * baseSide;
    values.baseArea = (n * baseSide ** 2) / (4 * Math.tan(Math.PI / n));
    values.volume = values.baseArea * height;
    values.lateralSurfaceArea = values.perimeter * height;
    values.totalSurfaceArea = values.lateralSurfaceArea + 2 * values.baseArea;
    formulas.push(line("Base Area", "A = ns^2 / (4tan(π/n))", `A = ${n} × ${fmt(baseSide)}^2 / (4tan(π/${n}))`, `${fmt(values.baseArea)} ${areaUnit}`));
    formulas.push(line("Volume", "V = Base Area × height", `V = ${fmt(values.baseArea)} × ${fmt(height)}`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Total Surface Area", "TSA = Ph + 2A", `TSA = ${fmt(values.perimeter)} × ${fmt(height)} + 2 × ${fmt(values.baseArea)}`, `${fmt(values.totalSurfaceArea)} ${areaUnit}`));
  } else if (solidType === "pyramid") {
    values.baseArea = baseSide ** 2;
    values.slantHeight = Math.sqrt((baseSide / 2) ** 2 + height ** 2);
    values.volume = (values.baseArea * height) / 3;
    values.lateralSurfaceArea = 2 * baseSide * values.slantHeight;
    values.totalSurfaceArea = values.baseArea + values.lateralSurfaceArea;
    formulas.push(line("Slant Height", "l = sqrt((s/2)^2 + h^2)", `l = sqrt((${fmt(baseSide)}/2)^2 + ${fmt(height)}^2)`, `${fmt(values.slantHeight)} ${lengthUnit}`));
    formulas.push(line("Volume", "V = 1/3 × s^2 × h", `V = 1/3 × ${fmt(baseSide)}^2 × ${fmt(height)}`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Total Surface Area", "TSA = s^2 + 2sl", `TSA = ${fmt(baseSide)}^2 + 2 × ${fmt(baseSide)} × ${fmt(values.slantHeight)}`, `${fmt(values.totalSurfaceArea)} ${areaUnit}`));
  } else if (solidType === "frustum") {
    values.slantHeight = Math.sqrt((bottomRadius - topRadius) ** 2 + height ** 2);
    values.volume = (Math.PI * height * (bottomRadius ** 2 + bottomRadius * topRadius + topRadius ** 2)) / 3;
    values.curvedSurfaceArea = Math.PI * (bottomRadius + topRadius) * values.slantHeight;
    values.totalSurfaceArea = Math.PI * (bottomRadius ** 2 + topRadius ** 2) + values.curvedSurfaceArea;
    formulas.push(line("Slant Height", "l = sqrt((R-r)^2 + h^2)", `l = sqrt((${fmt(bottomRadius)} - ${fmt(topRadius)})^2 + ${fmt(height)}^2)`, `${fmt(values.slantHeight)} ${lengthUnit}`));
    formulas.push(line("Volume", "V = 1/3 × πh(R^2 + Rr + r^2)", `V = 1/3 × π × ${fmt(height)} × (${fmt(bottomRadius)}^2 + ${fmt(bottomRadius * topRadius)} + ${fmt(topRadius)}^2)`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Total Surface Area", "TSA = π(R^2 + r^2) + π(R+r)l", `TSA = π(${fmt(bottomRadius)}^2 + ${fmt(topRadius)}^2) + π(${fmt(bottomRadius)} + ${fmt(topRadius)})${fmt(values.slantHeight)}`, `${fmt(values.totalSurfaceArea)} ${areaUnit}`));
  } else if (solidType === "torus") {
    values.volume = 2 * Math.PI ** 2 * majorRadius * minorRadius ** 2;
    values.surfaceArea = 4 * Math.PI ** 2 * majorRadius * minorRadius;
    formulas.push(line("Volume", "V = 2π^2Rr^2", `V = 2π^2 × ${fmt(majorRadius)} × ${fmt(minorRadius)}^2`, `${fmt(values.volume)} ${volumeUnit}`));
    formulas.push(line("Surface Area", "SA = 4π^2Rr", `SA = 4π^2 × ${fmt(majorRadius)} × ${fmt(minorRadius)}`, `${fmt(values.surfaceArea)} ${areaUnit}`));
  }

  return { formulas, values, unit, internalMeters: Object.fromEntries(Object.entries(dimensions).map(([key, dimension]) => [key, dimension.meters])) };
}

function detectSolidType(lower: string): ARSolidType | null {
  if (/\bfrustum\b/.test(lower)) return "frustum";
  if (/\bhemisphere\b/.test(lower)) return "hemisphere";
  if (/\btorus\b/.test(lower)) return "torus";
  if (/\bpyramid\b/.test(lower)) return "pyramid";
  if (/\bprism\b/.test(lower)) return "prism";
  if (/\bcuboid\b|\bbox\b|rectangular prism/.test(lower)) return "cuboid";
  if (/\bcube\b/.test(lower)) return "cube";
  if (/\bcylinder\b/.test(lower)) return "cylinder";
  if (/\bcone\b/.test(lower)) return "cone";
  if (/\bsphere\b/.test(lower)) return "sphere";
  return null;
}

function extractDimensionValues(lower: string, fallbackUnit: ARUnit) {
  const dimensions: Record<string, { value: number; unit: ARUnit }> = {};
  const unitPattern = "(mm|millimeters?|cm|centimeters?|m|meters?|metres?|inch(?:es)?|in|ft|feet|foot)?";
  const specs: Array<[string, RegExp]> = [
    ["radius", new RegExp(`(?:radius|\\br\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["diameter", new RegExp(`(?:diameter|\\bd\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["height", new RegExp(`(?:height|\\bh\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["length", new RegExp(`(?:length|\\bl\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["width", new RegExp(`(?:width|\\bw\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["side", new RegExp(`(?:side|\\bs\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["baseSide", new RegExp(`(?:base side|base)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["slantHeight", new RegExp(`(?:slant height|slant|\\bl\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["bottomRadius", new RegExp(`(?:bottom radius|large radius|\\bR\\b)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["topRadius", new RegExp(`(?:top radius|small radius)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["majorRadius", new RegExp(`(?:major radius|major)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
    ["minorRadius", new RegExp(`(?:minor radius|minor|tube radius)\\s*[:=]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*${unitPattern}`, "i")],
  ];
  specs.forEach(([key, regex]) => {
    const match = lower.match(regex);
    if (!match) return;
    dimensions[key] = { value: Number(match[1]), unit: normalizeARUnit(match[2] ?? "") ?? fallbackUnit };
  });
  const box = lower.match(/box\s+(-?\d+(?:\.\d+)?)\s*(mm|cm|m|inch|in|ft)?\s+by\s+(-?\d+(?:\.\d+)?)\s*(mm|cm|m|inch|in|ft)?\s+by\s+(-?\d+(?:\.\d+)?)\s*(mm|cm|m|inch|in|ft)?/i);
  if (box) {
    dimensions.length = { value: Number(box[1]), unit: normalizeARUnit(box[2] ?? "") ?? fallbackUnit };
    dimensions.width = { value: Number(box[3]), unit: normalizeARUnit(box[4] ?? "") ?? dimensions.length.unit };
    dimensions.height = { value: Number(box[5]), unit: normalizeARUnit(box[6] ?? "") ?? dimensions.length.unit };
  }
  if (/triangular\s+prism/.test(lower)) dimensions.baseType = { value: 3, unit: fallbackUnit };
  if (/pentagonal\s+prism/.test(lower)) dimensions.baseType = { value: 5, unit: fallbackUnit };
  if (/hexagonal\s+prism/.test(lower)) dimensions.baseType = { value: 6, unit: fallbackUnit };
  return dimensions;
}

function normalizeDimensions(solidType: ARSolidType, raw: Record<string, { value: number; unit: ARUnit }>, unit: ARUnit, warnings: string[]) {
  const dimensions: GeometryDimensionMap = {};
  Object.entries(raw).forEach(([key, dimension]) => {
    dimensions[key] = makeDimension(dimension.value, dimension.unit);
  });
  if (!dimensions.radius && dimensions.diameter) dimensions.radius = makeDimension(dimensions.diameter.value / 2, dimensions.diameter.unit);
  if (!dimensions.diameter && dimensions.radius && ["sphere", "hemisphere", "cylinder", "cone"].includes(solidType)) dimensions.diameter = makeDimension(dimensions.radius.value * 2, dimensions.radius.unit);
  if (solidType === "cube" && !dimensions.side && dimensions.length) dimensions.side = dimensions.length;
  if (solidType === "prism") {
    if (!dimensions.baseSide && dimensions.side) dimensions.baseSide = dimensions.side;
  }
  if (solidType === "pyramid" && !dimensions.baseSide && dimensions.side) dimensions.baseSide = dimensions.side;
  if (solidType === "prism" && !dimensions.baseType) dimensions.baseType = makeDimension(6, unit);
  if (solidType === "cone" && dimensions.slantHeight && dimensions.height && dimensions.radius && dimensions.slantHeight.value < Math.max(dimensions.radius.value, dimensions.height.value)) warnings.push("Slant height looks too short for the radius and height.");
  return dimensions;
}

function requiredInputsFor(solidType: ARSolidType, d: GeometryDimensionMap) {
  const missing: string[] = [];
  const need = (key: string, label = key) => { if (!d[key]) missing.push(label); };
  if (solidType === "cube") need("side");
  if (solidType === "cuboid") ["length", "width", "height"].forEach((key) => need(key));
  if (solidType === "cylinder" || solidType === "cone") { need("radius", "radius or diameter"); need("height"); }
  if (solidType === "sphere" || solidType === "hemisphere") need("radius", "radius or diameter");
  if (solidType === "prism") { need("baseSide", "base side"); need("height", "height or length"); }
  if (solidType === "pyramid") { need("baseSide", "base side"); need("height"); }
  if (solidType === "frustum") ["bottomRadius", "topRadius", "height"].forEach((key) => need(key));
  if (solidType === "torus") ["majorRadius", "minorRadius"].forEach((key) => need(key));
  return missing;
}

function makeDimension(value: number, unit: ARUnit) {
  return { value, unit, meters: convertToMeters(value, unit) };
}

function detectPreferredUnit(input: string) {
  const match = input.match(/\b(mm|millimeters?|cm|centimeters?|m|meters?|metres?|inch(?:es)?|in|ft|feet|foot)\b/i);
  return match ? normalizeARUnit(match[1]) : null;
}

function recommendedScaleMode(maxDimensionMeters: number): ARScaleMode {
  if (maxDimensionMeters > 0.8 || maxDimensionMeters < 0.02) return "fit-to-view";
  return "classroom-scale";
}

function prismSides(baseTypeValue?: number) {
  if (baseTypeValue && Number.isFinite(baseTypeValue)) return Math.max(3, Math.round(baseTypeValue));
  return 6;
}

function line(label: string, formula: string, substitution: string, result: string) {
  return { label, formula, substitution, result };
}

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function sentenceList(values: string[]) {
  return values.map((value) => value.replace(/([A-Z])/g, " $1").toLowerCase()).join(values.length === 2 ? " and " : ", ");
}
