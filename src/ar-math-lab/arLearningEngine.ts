import { formulaSummary } from "./arGeometrySolids";
import type { ARComparison, ARGeneratedGeometrySolid, ARGeneratedGraphObject, ARGraphSettings, ARMeasurement } from "./types";

export type ARLearningEventType =
  | "equation_entered"
  | "equation_classified"
  | "graph_generated"
  | "graph_parameter_changed"
  | "graph_range_changed"
  | "geometry_created"
  | "geometry_dimension_changed"
  | "unit_changed"
  | "scale_mode_changed"
  | "measurement_added"
  | "animation_started"
  | "animation_paused"
  | "animation_completed"
  | "cross_section_changed"
  | "object_compared"
  | "object_selected"
  | "object_placed"
  | "mode_changed"
  | "error_occurred";

export type ARLearningEvent = {
  id: string;
  type: ARLearningEventType;
  timestamp: number;
  objectId?: string;
  payload?: Record<string, unknown>;
};

export type ARLearningQuizQuestion = {
  id: string;
  prompt: string;
  type: "multiple_choice" | "true_false" | "numeric";
  options?: string[];
  correctAnswer: string;
  explanation: string;
};

export type ARLearningState = {
  activeConcept: string;
  objectName: string;
  currentExplanation: string;
  whatChanged: string;
  mathematicalMeaning: string;
  liveFormula: string;
  nextSuggestedActions: string[];
  teacherPrompt: string;
  misconceptionWarning?: string;
  formulaExplanation: string;
  learningProgress: number;
  classroomPrompt: string;
  stepCards: string[];
  quiz: ARLearningQuizQuestion;
  comparisonInsight?: string;
};

export type ARLearningSceneState = {
  activeConcept: string;
  completedStepIds: string[];
  quizResults: Record<string, boolean>;
  lastEvent?: ARLearningEvent;
};

type ConceptProfile = {
  concept: string;
  objectName: string;
  explanation: string;
  meaning: string;
  actions: string[];
  teacherPrompt: string;
  steps: string[];
  quiz: ARLearningQuizQuestion;
};

export function createARLearningEvent(type: ARLearningEventType, objectId?: string, payload?: Record<string, unknown>): ARLearningEvent {
  return {
    id: `ar-learn-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    type,
    timestamp: Date.now(),
    objectId,
    payload,
  };
}

export function buildLearningState(input: string, options: {
  selectedGraph?: ARGeneratedGraphObject;
  selectedSolid?: ARGeneratedGeometrySolid;
  graphSettings: ARGraphSettings;
  parameterValues: Record<string, number>;
  measurements: ARMeasurement[];
  comparison: ARComparison;
  graphs: ARGeneratedGraphObject[];
  solids: ARGeneratedGeometrySolid[];
  lastEvent?: ARLearningEvent;
}): ARLearningState {
  const concept = identifyConcept(input, options.selectedGraph, options.selectedSolid);
  const profile = conceptProfiles[concept] ?? conceptProfiles.unknown;
  const changed = describeEvent(options.lastEvent, concept);
  const formula = liveFormulaFor(concept, input, options);
  const warning = misconceptionFor(input, concept, options);
  const comparisonInsight = comparisonLearning(options.comparison, options.graphs, options.solids);

  return {
    activeConcept: profile.concept,
    objectName: options.selectedSolid?.name ?? options.selectedGraph?.name ?? profile.objectName,
    currentExplanation: profile.explanation,
    whatChanged: changed,
    mathematicalMeaning: meaningFor(concept, options),
    liveFormula: formula,
    nextSuggestedActions: profile.actions,
    teacherPrompt: profile.teacherPrompt,
    misconceptionWarning: warning,
    formulaExplanation: formulaExplanationFor(concept, options),
    learningProgress: learningProgressFor(options),
    classroomPrompt: profile.teacherPrompt,
    stepCards: profile.steps,
    quiz: profile.quiz,
    comparisonInsight,
  };
}

export function identifyConcept(input: string, graph?: ARGeneratedGraphObject, solid?: ARGeneratedGeometrySolid) {
  if (solid) return solid.solidType;
  const equation = (graph?.equation || input).toLowerCase().replace(/\s+/g, "");
  if (equation.includes("sin(x)") && equation.includes("sin(y)")) return "wave";
  if (equation.includes("x^2+y^2") && equation.includes("z=")) return "paraboloid";
  if (equation.includes("x^2-y^2")) return "saddle";
  if (equation.includes("x=cos(t)") || equation.includes("z=t")) return "helix";
  if (equation.includes("x^2+y^2=9") && !equation.includes("z^2")) return "cylinder_implicit";
  if (equation.includes("x^2+y^2+z^2")) return "sphere";
  return "unknown";
}

function describeEvent(event: ARLearningEvent | undefined, concept: string) {
  if (!event) return "Start by generating or selecting an object.";
  const variable = String(event.payload?.key ?? event.payload?.parameter ?? "");
  if (event.type === "graph_parameter_changed") return parameterMeaning(variable, concept);
  if (event.type === "graph_range_changed") return "The viewing range changed. This changes what part of the graph is visible, not the equation itself.";
  if (event.type === "geometry_dimension_changed") return dimensionMeaning(String(event.payload?.key ?? ""), concept);
  if (event.type === "scale_mode_changed") return "Display scale changed only. The original mathematical dimensions are preserved.";
  if (event.type === "measurement_added") return "A measurement was added. Use it as evidence for the formula or shape property.";
  if (event.type === "animation_started") return "Animation started. Watch the changing value before deciding what relationship is linear, squared, or cubed.";
  if (event.type === "animation_paused") return "Animation paused. This is a good moment to ask students to describe the current state.";
  if (event.type === "cross_section_changed") return "The cross-section changed. Slices reveal hidden 2D shapes inside the 3D object.";
  if (event.type === "object_compared") return "Comparison mode is active. Look for what stays the same and what changes.";
  if (event.type === "object_placed") return "Object placement changed. The math object is ready to inspect from another viewpoint.";
  if (event.type === "mode_changed") return "The viewing mode changed. The same math can be explored in AR, camera preview, or 3D preview.";
  if (event.type === "error_occurred") return "Something needs attention. Read the warning before continuing the lesson.";
  return "The learning context updated.";
}

function parameterMeaning(variable: string, concept: string) {
  if (variable === "a") return "Amplitude changed. The surface becomes taller or flatter.";
  if (variable === "k") return "Frequency changed. The waves become closer together or farther apart.";
  if (variable === "zScale") return "The visual height scale changed, but the mathematical equation did not change.";
  if (variable === "t") return "The curve parameter changed. Think of t as a time-like value tracing the path.";
  if (variable === "u" || variable === "v") return "A surface parameter changed. Parameters sweep out the surface like coordinates on a flexible grid.";
  if (concept === "wave") return "A wave parameter changed. Watch whether height or spacing changes.";
  return "A parameter changed. Compare the new object with the previous one.";
}

function dimensionMeaning(key: string, concept: string) {
  const lower = key.toLowerCase();
  if (lower.includes("radius") && concept === "cone") return "Increasing radius increases base area. Since volume depends on r^2, volume grows faster than radius.";
  if (lower.includes("radius") && concept === "cylinder") return "Cylinder volume depends on r^2, so doubling radius makes volume four times larger if height stays fixed.";
  if (lower.includes("radius") && concept === "sphere") return "Sphere volume depends on r^3, so small radius changes create large volume changes.";
  if (lower.includes("height") && (concept === "cone" || concept === "cylinder")) return "Increasing height changes volume linearly when the base stays the same.";
  return "A dimension changed. The formulas update because the measured size changed.";
}

function liveFormulaFor(concept: string, input: string, options: Parameters<typeof buildLearningState>[1]) {
  if (options.selectedSolid) return formulaSummary(options.selectedSolid);
  if (concept === "wave") {
    const a = options.parameterValues.a ?? 1;
    const k = options.parameterValues.k ?? 1;
    return `z = ${format(a)} sin(${format(k)}x) sin(${format(k)}y)`;
  }
  if (options.selectedGraph) return options.selectedGraph.equation;
  return input || "Enter an equation or create a solid.";
}

function formulaExplanationFor(concept: string, options: Parameters<typeof buildLearningState>[1]) {
  if (options.selectedSolid?.solidType === "cone") return "Cone volume is one-third of the matching cylinder: V = (1/3) pi r^2 h.";
  if (options.selectedSolid?.solidType === "cylinder") return "Cylinder volume is base area times height: V = pi r^2 h.";
  if (options.selectedSolid?.solidType === "sphere") return "Sphere volume grows cubically with radius: V = (4/3) pi r^3.";
  if (concept === "wave") return "a controls height. k controls how many waves fit in the same space.";
  if (concept === "paraboloid") return "z = x^2 + y^2 grows as distance from the origin grows.";
  if (concept === "saddle") return "z = x^2 - y^2 rises in one direction and falls in the other.";
  return "The formula describes how the object is generated or measured.";
}

function meaningFor(concept: string, options: Parameters<typeof buildLearningState>[1]) {
  if (options.selectedSolid) return options.selectedSolid.explanation;
  return conceptProfiles[concept]?.meaning ?? "Generate an object to reveal the mathematical meaning.";
}

function misconceptionFor(input: string, concept: string, options: Parameters<typeof buildLearningState>[1]) {
  const lower = input.toLowerCase().replace(/\s+/g, "");
  if (lower.includes("sphere") && lower.includes("z=x^2+y^2")) return "This is a paraboloid surface, not a sphere. A sphere satisfies x^2 + y^2 + z^2 = r^2.";
  if (lower.includes("x^2+y^2=9") && !lower.includes("z^2")) return "This equation represents a cylinder in 3D, not a sphere. A sphere needs z^2 also.";
  if (concept === "paraboloid") return "This is not a sphere. A sphere is an implicit or parametric 3D shape, while this is a surface graph.";
  if (options.lastEvent?.type === "scale_mode_changed") return "Display scale changed only. Original mathematical dimensions are preserved.";
  if (options.lastEvent?.type === "mode_changed" && options.lastEvent.payload?.mode === "camera-preview") return "Camera Preview Mode is overlay-based. True spatial anchoring requires WebXR AR.";
  if (options.graphSettings.resolutionX > 100 || options.graphSettings.resolutionY > 100 || options.graphSettings.samples > 700) return "Higher resolution gives smoother visuals but may slow down mobile learning.";
  if (options.selectedSolid?.warnings.length) return options.selectedSolid.warnings.join(" ");
  return undefined;
}

function learningProgressFor(options: Parameters<typeof buildLearningState>[1]) {
  let progress = 15;
  if (options.selectedGraph || options.selectedSolid) progress += 25;
  if (options.measurements.length) progress += 15;
  if (options.comparison.enabled) progress += 15;
  if (options.lastEvent?.type.includes("animation")) progress += 15;
  return Math.min(100, progress);
}

function comparisonLearning(comparison: ARComparison, graphs: ARGeneratedGraphObject[], solids: ARGeneratedGeometrySolid[]) {
  if (!comparison.enabled) return undefined;
  const a = findObject(comparison.objectAId, graphs, solids);
  const b = findObject(comparison.objectBId, graphs, solids);
  if (!a || !b) return "Select two objects. The tutor will explain their relationship.";
  const types = [a.type, b.type].sort().join(":");
  if (types === "cone:cylinder") return "Cone vs cylinder: with the same radius and height, cone volume is one-third of cylinder volume.";
  if (types === "hemisphere:sphere") return "Sphere vs hemisphere: a hemisphere has half the volume of a sphere with the same radius.";
  if (types === "paraboloid:saddle") return "Paraboloid vs saddle: the paraboloid curves upward in every direction; the saddle rises on one axis and falls on the other.";
  return `Compare ${a.name} and ${b.name}: check formula, dimensions, cross-sections, and growth rate.`;
}

function findObject(id: string | undefined, graphs: ARGeneratedGraphObject[], solids: ARGeneratedGeometrySolid[]) {
  const graph = graphs.find((item) => item.id === id);
  if (graph) return { type: identifyConcept(graph.equation, graph), name: graph.name };
  const solid = solids.find((item) => item.id === id);
  if (solid) return { type: solid.solidType, name: solid.name };
  return null;
}

const conceptProfiles: Record<string, ConceptProfile> = {
  wave: profile("Wave surface", "This surface rises and falls because z depends on sine waves in both x and y directions.", "The surface shows periodic height changes in two perpendicular directions.", ["Animate amplitude.", "Turn on wireframe.", "Inspect a peak point.", "Compare with z = 2sin(2x)sin(2y)."], "What happens when frequency increases?", ["Read z = a sin(kx) sin(ky).", "Change a and observe height.", "Change k and observe spacing.", "Find a peak.", "Compare two wave surfaces."], { id: "wave-k", type: "multiple_choice", prompt: "Increasing k makes waves:", options: ["taller", "closer together", "disappear", "flat"], correctAnswer: "closer together", explanation: "k controls frequency, so larger k makes waves repeat more often." }),
  paraboloid: profile("Paraboloid", "This surface curves upward in every direction from the origin.", "As x and y move away from 0, z increases.", ["Show horizontal cross-section.", "Find the minimum.", "Compare with saddle surface.", "Inspect point x=1, y=2."], "Where is the minimum point of this surface?", ["Observe z = x^2 + y^2.", "At origin, z = 0.", "Move away from the origin.", "Horizontal cross-sections are circles.", "The origin is the minimum point."], { id: "paraboloid-min", type: "multiple_choice", prompt: "Where is the minimum of z = x^2 + y^2?", options: ["At the origin", "At x=1", "On the z-axis only", "There is no minimum"], correctAnswer: "At the origin", explanation: "Both squares are nonnegative, so the smallest value is z=0 at (0,0)." }),
  saddle: profile("Saddle surface", "This surface curves upward in one direction and downward in another.", "The origin is not a maximum or minimum; it is a saddle point.", ["Show x-axis and y-axis cross-sections.", "Rotate the graph.", "Explain saddle point.", "Compare with paraboloid."], "Why is the origin not a maximum or minimum?", ["Observe z = x^2 - y^2.", "Along x-axis, z increases.", "Along y-axis, z decreases.", "The origin is a saddle point.", "Compare with the paraboloid."], { id: "saddle-origin", type: "true_false", prompt: "The origin is a maximum point on z = x^2 - y^2.", options: ["True", "False"], correctAnswer: "False", explanation: "The surface rises in one direction and falls in another, so the origin is a saddle point." }),
  cone: profile("Cone", "A cone has one circular base and one vertex.", "Slant height comes from a right triangle using radius and height.", ["Show slant height.", "Compare with cylinder.", "Animate height.", "Show vertical cross-section."], "Why is cone volume one-third of the cylinder?", ["Identify the base radius.", "Identify the height.", "Compute slant height using Pythagoras.", "Compute base area.", "Compute volume.", "Compare with cylinder."], { id: "cone-cylinder", type: "multiple_choice", prompt: "A cone and cylinder have the same radius and height. What is the cone volume compared to the cylinder?", options: ["Same", "Half", "One-third", "Double"], correctAnswer: "One-third", explanation: "Cone volume is (1/3)pi r^2h, while cylinder volume is pi r^2h." }),
  cylinder: profile("Cylinder", "A cylinder has two equal circular bases and one curved surface.", "Volume is base area times height.", ["Show horizontal cross-section.", "Compare with cone.", "Animate radius.", "Show curved surface area."], "What changes more volume: doubling radius or doubling height?", ["Identify radius.", "Identify height.", "Compute base area.", "Multiply base area by height.", "Compare with cone."], { id: "cylinder-radius", type: "multiple_choice", prompt: "If cylinder radius doubles and height stays fixed, volume becomes:", options: ["2 times", "3 times", "4 times", "8 times"], correctAnswer: "4 times", explanation: "Volume depends on r^2, so doubling radius multiplies volume by 4." }),
  sphere: profile("Sphere", "A sphere is all points the same distance from a center.", "Volume grows with the cube of radius.", ["Show central cross-section.", "Animate radius.", "Compare with hemisphere.", "Explain r^3 growth."], "Why does volume grow very fast when radius increases?", ["Identify radius.", "Show diameter.", "Show central cross-section.", "Compute surface area.", "Compute volume.", "Compare with hemisphere."], { id: "sphere-double", type: "multiple_choice", prompt: "If radius doubles, what happens to volume?", options: ["Doubles", "Becomes 4 times", "Becomes 8 times", "No change"], correctAnswer: "Becomes 8 times", explanation: "Sphere volume depends on r^3. Doubling r gives 2^3 = 8 times volume." }),
  cuboid: profile("Cuboid", "A cuboid has length, width, and height.", "Volume multiplies three dimensions.", ["Measure diagonal.", "Change length and observe volume.", "Show surface area breakdown."], "Which dimension changes the volume linearly?", ["Identify length.", "Identify width.", "Identify height.", "Compute volume.", "Compute space diagonal."], { id: "cuboid-volume", type: "numeric", prompt: "For a 10 by 6 by 4 cuboid, what is the volume?", correctAnswer: "240", explanation: "Volume = length x width x height = 10 x 6 x 4 = 240." }),
  hemisphere: profile("Hemisphere", "A hemisphere is half of a sphere.", "Its volume is half the matching sphere volume.", ["Compare with sphere.", "Show central cross-section.", "Animate radius."], "How much of a sphere is a hemisphere?", ["Identify radius.", "Compare with full sphere.", "Compute half volume."], { id: "hemisphere-half", type: "multiple_choice", prompt: "A hemisphere is what fraction of a sphere?", options: ["One-half", "One-third", "One-fourth", "Same"], correctAnswer: "One-half", explanation: "A hemisphere is half of a sphere." }),
  cylinder_implicit: profile("Implicit cylinder", "x^2 + y^2 = 9 represents a cylinder in 3D because z is unrestricted.", "Every horizontal slice is a circle of radius 3.", ["Add z^2 to make a sphere.", "Compare with x^2 + y^2 + z^2 = 9."], "Why does missing z^2 make this a cylinder?", ["Read x^2 + y^2 = 9.", "Notice z is free.", "Imagine stacking circles along z."], { id: "implicit-cylinder", type: "true_false", prompt: "x^2 + y^2 = 9 is a sphere in 3D.", options: ["True", "False"], correctAnswer: "False", explanation: "Without z^2, the equation makes a cylinder." }),
  unknown: profile("Math object", "Generate or select an object to get a live explanation.", "The tutor updates when the object changes.", ["Generate graph.", "Create solid.", "Add measurement."], "What feature should students inspect first?", ["Enter an equation.", "Generate the object.", "Measure or animate it."], { id: "unknown-start", type: "true_false", prompt: "Measurements can help explain formulas.", options: ["True", "False"], correctAnswer: "True", explanation: "Measurements connect the visual object to formula values." }),
};

function profile(concept: string, explanation: string, meaning: string, actions: string[], teacherPrompt: string, steps: string[], quiz: ARLearningQuizQuestion): ConceptProfile {
  return {
    concept,
    objectName: concept,
    explanation,
    meaning,
    actions,
    teacherPrompt,
    steps,
    quiz,
  };
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
