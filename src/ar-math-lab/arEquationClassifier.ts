import { convertToMeters, normalizeARUnit } from "./arUnits";
import { parseGeometrySolidInput } from "./arGeometrySolids";
import type { ARDimension, ARObjectType, ARRenderMode, EquationClassificationResult } from "./types";

const geometrySolids = ["cone", "cylinder", "cuboid", "sphere", "prism", "cube", "box", "hemisphere", "frustum", "torus", "pyramid"] as const;
const dimensionPattern = /\b(radius|diameter|height|length|width|depth|side)\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*(mm|millimeters?|cm|centimeters?|m|meters?|metres?|inch(?:es)?|in|ft|feet|foot)\b/gi;

export function classifyEquationInput(input: string): EquationClassificationResult {
  const normalizedInput = input.trim().replace(/\s+/g, " ");
  const lower = normalizedInput.toLowerCase();
  const variables = collectVariables(normalizedInput);
  const parameters = collectParameters(normalizedInput, variables);

  if (!normalizedInput) {
    return result("unknown", normalizedInput, "low", [], [], "3d-preview", "Please enter an equation. Example: z = sin(x) * sin(y).", { errors: ["Please enter an equation. Example: z = sin(x) * sin(y)."] });
  }

  const solid = geometrySolids.find((candidate) => new RegExp(`\\b${candidate}\\b`, "i").test(normalizedInput));
  if (solid) {
    const geometry = parseGeometrySolidInput(normalizedInput);
    const flatDimensions = geometry.ok ? Object.entries(geometry.solid.dimensions).map(([name, dimension]) => ({ name, ...dimension })) : Object.entries(geometry.dimensions).map(([name, dimension]) => ({ name, ...dimension }));
    return {
      ...result("geometry_solid", normalizedInput, geometry.ok ? "high" : "medium", variables, flatDimensions, "ar", geometry.ok
        ? `Detected a ${geometry.solid.solidType} with real-world dimensions ready for AR placement.`
        : geometry.message, {
        suggestedRenderer: "unsupported",
        solidType: geometry.ok ? geometry.solid.solidType : geometry.solidType,
        solidDimensions: geometry.ok ? geometry.solid.dimensions : geometry.dimensions,
        missingInputs: geometry.ok ? [] : geometry.missingInputs,
        suggestedScaleMode: geometry.ok ? geometry.solid.displayScaleMode : "fit-to-view",
        warnings: geometry.ok ? geometry.solid.warnings : geometry.warnings,
        errors: geometry.ok ? [] : [geometry.message],
        educationalHint: geometry.ok ? geometry.solid.explanation : undefined,
      }),
      objectName: geometry.ok ? geometry.solid.solidType : solid === "box" ? "cuboid" : solid,
    };
  }

  if (/\b(coordinate|xyz|axes?|axis|grid)\b/i.test(normalizedInput)) {
    return result("coordinate_axes", normalizedInput, "high", variables, extractDimensions(normalizedInput), "ar", "Detected a coordinate system for placing axes or a grid in real space.", { suggestedRenderer: "unsupported" });
  }

  if (/\b(measure|measurement|distance|room|table|desk|wall|height)\b/i.test(normalizedInput) && extractDimensions(normalizedInput).length > 0) {
    return result("measurement_demo", normalizedInput, "medium", variables, extractDimensions(normalizedInput), "camera-preview", "Detected a measurement-based visualization. Camera preview is the best fallback.", { suggestedRenderer: "unsupported" });
  }

  if (looksLikeParametricSurface(lower)) {
    return result("parametric_surface", normalizedInput, "high", variables, [], "3d-preview", "Detected a parametric surface x(u,v), y(u,v), z(u,v).", {
      independentVariables: ["u", "v"],
      dependentVariables: ["x", "y", "z"],
      parameters,
      suggestedRenderer: "parametric_surface_mesh",
      suggestedRanges: inferParametricSurfaceRanges(lower),
      suggestedResolution: { u: 64, v: 32 },
      suggestedParameters: suggestedParameterValues(parameters),
      educationalHint: "A parametric surface uses two inputs, u and v, to draw a sheet in 3D space.",
    });
  }

  if (looksLikeParametricCurve(lower)) {
    return result("parametric_curve", normalizedInput, "high", variables, [], "3d-preview", "Detected a 3D parametric curve x(t), y(t), z(t).", {
      independentVariables: ["t"],
      dependentVariables: ["x", "y", "z"],
      parameters,
      suggestedRenderer: "curve_3d",
      suggestedRanges: { t: inferCurveRange(lower) },
      suggestedResolution: { t: lower.includes("sin(2t)") || lower.includes("sin(2*t)") ? 500 : 300 },
      suggestedParameters: suggestedParameterValues(parameters),
      educationalHint: "A parametric curve traces one moving point through 3D space as t changes.",
    });
  }

  if (looksLikeExplicitSurface(lower)) {
    const ranges = inferExplicitRanges(lower);
    return result("explicit_surface", normalizedInput, "high", variables, [], "3d-preview", "Detected an explicit surface z = f(x,y). Generate Graph will create a mesh.", {
      independentVariables: variables.includes("y") ? ["x", "y"] : ["x"],
      dependentVariables: ["z"],
      parameters,
      suggestedRenderer: "surface_mesh",
      suggestedRanges: ranges,
      suggestedResolution: { x: lower.includes("sqrt") ? 80 : lower.includes("^2") ? 50 : 60, y: lower.includes("sqrt") ? 80 : lower.includes("^2") ? 50 : 60 },
      suggestedParameters: suggestedParameterValues(parameters),
      educationalHint: explicitHint(lower),
      warnings: variables.includes("x") || variables.includes("y") ? [] : ["For a 3D surface, use x and/or y as input variables, or define sliders for parameters."],
    });
  }

  if (looksLikeImplicitSurface(lower)) {
    const implicit = classifyRecognizedImplicit(lower);
    if (implicit) {
      return result("recognized_implicit_shape", normalizedInput, "high", variables, [], "3d-preview", implicit.message, {
        independentVariables: ["u", "v"],
        dependentVariables: ["x", "y", "z"],
        parameters: implicit.parameters,
        suggestedRenderer: implicit.renderer,
        suggestedRanges: implicit.ranges,
        suggestedResolution: { u: 64, v: 32 },
        suggestedParameters: implicit.parameterValues,
        educationalHint: implicit.hint,
      });
    }
    return result("implicit_surface_unsupported", normalizedInput, "medium", variables, [], "3d-preview", "This implicit equation is not yet supported in AR rendering. Try z = f(x, y), a parametric equation, or a standard shape such as x^2 + y^2 + z^2 = 9.", {
      suggestedRenderer: "unsupported",
      errors: ["This implicit equation is not yet supported in AR rendering."],
    });
  }

  return result("unknown", normalizedInput, "low", variables, extractDimensions(normalizedInput), "3d-preview", "This equation type is not supported yet. Try z = f(x, y) or a parametric equation.", { parameters, suggestedRenderer: "unsupported", errors: ["Unsupported equation type."] });
}

function result(
  type: ARObjectType,
  normalizedInput: string,
  confidence: EquationClassificationResult["confidence"],
  variables: string[],
  dimensions: ARDimension[],
  recommendedMode: ARRenderMode,
  message: string,
  extra: Partial<EquationClassificationResult> = {},
): EquationClassificationResult {
  return {
    type,
    originalInput: normalizedInput,
    normalizedInput,
    confidence,
    solidType: extra.solidType,
    solidDimensions: extra.solidDimensions,
    missingInputs: extra.missingInputs ?? [],
    suggestedScaleMode: extra.suggestedScaleMode,
    variables,
    independentVariables: extra.independentVariables ?? [],
    dependentVariables: extra.dependentVariables ?? [],
    parameters: extra.parameters ?? [],
    dimensions,
    suggestedRenderer: extra.suggestedRenderer ?? "unsupported",
    suggestedRanges: extra.suggestedRanges ?? {},
    suggestedResolution: extra.suggestedResolution ?? {},
    suggestedParameters: extra.suggestedParameters ?? {},
    warnings: extra.warnings ?? [],
    errors: extra.errors ?? [],
    educationalHint: extra.educationalHint,
    recommendedMode,
    message,
  };
}

function looksLikeExplicitSurface(lower: string) {
  return /^z\s*=/.test(lower) && /\bx\b/.test(lower) && /\by\b/.test(lower);
}

function looksLikeParametricCurve(lower: string) {
  return /\bx\s*=/.test(lower) && /\by\s*=/.test(lower) && /\bz\s*=/.test(lower) && /\bt\b/.test(lower) && !/\bu\b|\bv\b/.test(lower);
}

function looksLikeParametricSurface(lower: string) {
  return /\bx\s*=/.test(lower) && /\by\s*=/.test(lower) && /\bz\s*=/.test(lower) && (/\bu\b/.test(lower) || /\bv\b/.test(lower));
}

function looksLikeImplicitSurface(lower: string) {
  return /\bx\b/.test(lower) && /\by\b/.test(lower) && /=/.test(lower) && !/^z\s*=/.test(lower);
}

function collectParameters(input: string, variables: string[]) {
  const knownFunctions = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "abs", "log", "ln", "exp", "pow", "min", "max", "floor", "ceil", "round", "pi", "e"]);
  const variableSet = new Set([...variables, "x", "y", "z", "t", "u", "v"]);
  return Array.from(new Set(Array.from(input.matchAll(/\b[A-Za-z]\b/g)).map((match) => match[0]).filter((name) => !variableSet.has(name.toLowerCase()) && !knownFunctions.has(name.toLowerCase())))).sort();
}

function suggestedParameterValues(parameters: string[]) {
  const defaults: Record<string, number> = {};
  parameters.forEach((parameter) => {
    if (parameter === "R") defaults[parameter] = 2;
    else if (parameter === "r") defaults[parameter] = 0.5;
    else if (parameter === "h") defaults[parameter] = 2;
    else defaults[parameter] = 1;
  });
  return defaults;
}

function inferExplicitRanges(lower: string): EquationClassificationResult["suggestedRanges"] {
  if (lower.includes("sqrt")) return { x: [-8, 8], y: [-8, 8] };
  if (lower.includes("^2")) return { x: [-3, 3], y: [-3, 3] };
  return { x: [-5, 5], y: [-5, 5] };
}

function inferCurveRange(lower: string): [number, number] {
  if (lower.includes("x = t") || lower.includes("x=t")) return [-10, 10];
  if (lower.includes("sin(2t)") || lower.includes("sin(2*t)")) return [0, Math.PI * 2];
  return [0, Math.PI * 6];
}

function inferParametricSurfaceRanges(lower: string): EquationClassificationResult["suggestedRanges"] {
  if (lower.includes("r * sin(u)") || lower.includes("r*sin(u)")) return { u: [0, Math.PI], v: [0, Math.PI * 2] };
  if (lower.includes("z = v") || lower.includes("z=v")) return { u: [0, Math.PI * 2], v: [-2, 2] };
  return { u: [0, Math.PI * 2], v: [0, Math.PI * 2] };
}

function explicitHint(lower: string) {
  if (lower.includes("sin(x") && lower.includes("sin(y")) return "This is a wave surface. The height z changes based on both x and y.";
  if (lower.includes("x^2 + y^2")) return "This is a paraboloid. As x and y move away from zero, z increases, creating a bowl shape.";
  if (lower.includes("x^2 - y^2")) return "This is a saddle surface. The surface curves upward in one direction and downward in another.";
  return "This surface turns every x-y point into a height z.";
}

function classifyRecognizedImplicit(lower: string): {
  message: string;
  renderer: "predefined_sphere" | "predefined_cylinder" | "predefined_cone";
  parameters: string[];
  parameterValues: Record<string, number>;
  ranges: Partial<Record<"u" | "v", [number, number]>>;
  hint: string;
} | null {
  const right = Number(lower.split("=").at(1)?.trim());
  const radius = Number.isFinite(right) && right > 0 ? Math.sqrt(right) : 2;
  if (/x\^2\s*\+\s*y\^2\s*\+\s*z\^2\s*=/.test(lower)) {
    return {
      message: "Recognized a sphere from x^2 + y^2 + z^2 = r^2.",
      renderer: "predefined_sphere" as const,
      parameters: ["r"],
      parameterValues: { r: radius },
      ranges: { u: [0, Math.PI], v: [0, Math.PI * 2] },
      hint: "A sphere is all points the same distance from the origin.",
    };
  }
  if (/x\^2\s*\+\s*y\^2\s*=/.test(lower) && !/\bz\b/.test(lower.split("=")[0])) {
    return {
      message: "Recognized a cylinder from x^2 + y^2 = r^2.",
      renderer: "predefined_cylinder" as const,
      parameters: ["r"],
      parameterValues: { r: radius },
      ranges: { u: [0, Math.PI * 2], v: [-2, 2] },
      hint: "A cylinder keeps the same circular cross-section while z changes.",
    };
  }
  if (/x\^2\s*\+\s*y\^2\s*=.*z\^2/.test(lower)) {
    return {
      message: "Recognized a cone from x^2 + y^2 = k z^2.",
      renderer: "predefined_cone" as const,
      parameters: ["h"],
      parameterValues: { h: 2 },
      ranges: { u: [0, Math.PI * 2], v: [0, 2] },
      hint: "A cone's circular radius changes with height.",
    };
  }
  return null;
}

function extractDimensions(input: string): ARDimension[] {
  return Array.from(input.matchAll(dimensionPattern)).flatMap((match) => {
    const unit = normalizeARUnit(match[3]);
    const value = Number(match[2]);
    if (!unit || !Number.isFinite(value)) return [];
    return [{ name: match[1].toLowerCase(), value, unit, meters: convertToMeters(value, unit) }];
  });
}

function collectVariables(input: string) {
  const candidates = new Set(Array.from(input.matchAll(/\b[xytzuv]\b/gi)).map((match) => match[0].toLowerCase()));
  return Array.from(candidates).sort();
}
