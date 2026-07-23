import type { LessonAdapter, LessonPresetResolution, LessonSourceDefinition } from "../types";
import { calculatorLessonPreset, calculatorLessonPresetIds } from "../presets/calculatorLessonPresets";
import { discreteLessonPresets } from "../presets/discreteLessonPresets";
import { financeLessonPresets } from "../presets/financeLessonPresets";
import { sequenceLessonPresets } from "../presets/sequenceLessonPresets";
import { matrixLessonPresets } from "../presets/matrixLessonPresets";

const lessonPresets: Record<number, Omit<LessonPresetResolution, "adapter">> = {
  ...Object.fromEntries(calculatorLessonPresetIds.map((lessonId) => { const preset = calculatorLessonPreset(lessonId); return [lessonId, lesson(preset.id, preset.id.slice("calculator.".length))]; })),
  ...Object.fromEntries(discreteLessonPresets.map((preset) => [preset.lessonId, lesson(preset.id, preset.mode)])),
  ...Object.fromEntries(financeLessonPresets.map((preset) => [preset.lessonId, lesson(preset.id, preset.mode)])),
  ...Object.fromEntries(sequenceLessonPresets.map((preset) => [preset.lessonId, lesson(preset.id, preset.mode)])),
  ...Object.fromEntries(matrixLessonPresets.map((preset) => [preset.lessonId, lesson(preset.id, preset.mode)])),
  404: lesson("geometry3d.solid-net", "solid-nets"),
  443: lesson("cas.first-order-ode", "differential-equations"),
  480: lesson("statistics.box-plot", "box-plots"),
  576: lesson("discrete.graph-colouring", "graph-colouring"),
  582: lesson("discrete.set-builder", "set-builder-notation"),
  583: lesson("discrete.set-operations", "set-operations"),
  586: lesson("discrete.power-set", "subsets-and-power-sets"),
  587: lesson("discrete.truth-table", "truth-tables"),
  588: lesson("discrete.logical-connectives", "logical-connectives"),
  589: lesson("discrete.quantifiers", "quantifiers"),
};

export function resolveLessonPreset(source: LessonSourceDefinition): LessonPresetResolution {
  const exact = lessonPresets[source.id];
  if (exact) return { ...exact, adapter: source.adapter };
  return {
    id: familyPresetId(source.adapter, source.title),
    conceptFamily: adapterConceptFamily(source.adapter),
    adapter: source.adapter,
    specificity: "family",
  };
}

export function validatePresetResolution(source: LessonSourceDefinition, preset: LessonPresetResolution) {
  const errors: string[] = [];
  if (!preset.id.trim()) errors.push("preset id is empty");
  if (!preset.conceptFamily.trim()) errors.push("concept family is empty");
  if (preset.adapter !== source.adapter) errors.push(`preset adapter ${preset.adapter} does not match ${source.adapter}`);
  if (!preset.id.startsWith(`${source.adapter}.`)) errors.push(`preset ${preset.id} is outside adapter family ${source.adapter}`);
  return errors;
}

function lesson(id: string, conceptFamily: string): Omit<LessonPresetResolution, "adapter"> {
  return { id, conceptFamily, specificity: "lesson" };
}

function familyPresetId(adapter: LessonAdapter, title: string) {
  const name = title.toLowerCase();
  if (adapter === "graph") {
    if (/polar/.test(name)) return "graph.polar";
    if (/parametric/.test(name)) return "graph.parametric";
    if (/inequal/.test(name)) return "graph.inequality";
    if (/quadratic|parabola/.test(name)) return "graph.quadratic";
    if (/cubic/.test(name)) return "graph.cubic";
    if (/absolute|modulus/.test(name)) return "graph.absolute-value";
    if (/reciprocal|rational/.test(name)) return "graph.rational";
    if (/exponential/.test(name)) return "graph.exponential";
    if (/logarith/.test(name)) return "graph.logarithmic";
    if (/trig|sine|cosine/.test(name)) return "graph.trigonometric";
    if (/circle|implicit/.test(name)) return "graph.implicit";
  }
  if (adapter === "discrete") {
    if (/permut/.test(name)) return "discrete.permutations";
    if (/combin|count|binomial|pigeon|pascal/.test(name)) return "discrete.combinations";
    if (/truth|logic|boolean|proposition|quantifier|proof/.test(name)) return "discrete.logic-family";
    if (/set|union|intersection|difference|complement|cartesian|subset/.test(name)) return "discrete.set-family";
    return "discrete.graph-family";
  }
  if (adapter === "finance") {
    if (/compound|growth/.test(name)) return "finance.compound-growth";
    if (/loan|mortgage|amorti|payment/.test(name)) return "finance.amortisation";
    if (/annuity|saving|investment/.test(name)) return "finance.investment";
    if (/depreciat/.test(name)) return "finance.depreciation";
  }
  if (adapter === "matrix" && /eigen/.test(name)) return "matrix.eigen-family";
  if (adapter === "geometry3d" && /surface|contour|gradient|tangent plane|partial derivative|multivariable|level curve/.test(name)) return "geometry3d.surface-family";
  return `${adapter}.core-model`;
}

function adapterConceptFamily(adapter: LessonAdapter) {
  const families: Record<LessonAdapter, string> = {
    calculator: "calculator-and-numeric-evaluation",
    algebra: "algebra-and-dynamic-variables",
    number: "numbers-and-proportional-reasoning",
    authoring: "interactive-authoring",
    learning: "lesson-and-assessment-flow",
    platform: "platform-accessibility-capability",
    graph: "graphs-and-functions",
    "algebra-cas": "symbolic-algebra",
    geometry2d: "two-dimensional-geometry",
    vector: "vectors",
    trigonometry: "trigonometry",
    cas: "computer-algebra",
    calculus: "calculus",
    spreadsheet: "spreadsheet-data",
    statistics: "statistics",
    probability: "probability",
    inference: "inferential-statistics",
    sequence: "sequences-and-series",
    matrix: "matrices-and-linear-algebra",
    complex: "complex-numbers",
    geometry3d: "three-dimensional-mathematics",
    discrete: "discrete-mathematics",
    finance: "financial-mathematics",
  };
  return families[adapter];
}
