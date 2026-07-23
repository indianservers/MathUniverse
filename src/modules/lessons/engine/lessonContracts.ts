import { resolveLessonPreset, validatePresetResolution } from "./lessonPresets";
import type { LessonAdapter, LessonDefinition, LessonInteractionContract, LessonSourceDefinition } from "../types";

type ContractTemplate = Omit<LessonInteractionContract, "concept" | "challengeFactory">;

const templates: Record<LessonAdapter, ContractTemplate> = {
  calculator: template(["input", "selection"], ["calculator-expression"], ["calculator-result"], ["expression", "numeric result"], ["enter", "evaluate"], ["calculation"], "Type an expression and activate Evaluate.", "The entered expression and computed result update together.", ["expression", "angle mode", "history"]),
  algebra: template(["slider", "input"], ["primary-control"], ["linked-equation", "linked-graph"], ["equation", "graph", "table"], ["edit", "inspect"], ["function", "parameter"], "Use the exact-value inputs for every slider.", "The equation, graph, and table reflect the current parameters.", ["parameters", "equation"]),
  number: template(["slider", "input"], ["primary-control"], ["number-model"], ["manipulative", "notation"], ["change", "compare"], ["number"], "Use the exact-value inputs paired with the model controls.", "The number model and symbolic value describe the same quantity.", ["number values"]),
  authoring: template(["input", "toggle"], ["primary-control"], ["authoring-preview"], ["control configuration", "preview"], ["configure", "preview"], ["authored control"], "Tab to each control and edit its value or state.", "The configured control and its preview remain linked.", ["control value", "preview"]),
  learning: template(["selection", "slider"], ["primary-control"], ["learning-step"], ["prediction", "model", "explanation"], ["predict", "test", "explain"], ["lesson response"], "Use the choice buttons and the keyboard-operable test slider.", "The current learning step, input, and output are announced.", ["step", "test value"]),
  platform: template(["drag", "keyboard"], ["primary-control"], ["capability-state"], ["interactive object", "state summary"], ["move", "access"], ["platform state"], "Focus the movable point and use Left or Right Arrow.", "The movable point position and display state are announced.", ["position", "zoom", "contrast"]),
  graph: template(["slider", "input"], ["primary-control"], ["graph-layer", "value-table"], ["equation", "graph", "table"], ["plot", "change", "inspect"], ["function"], "Use exact coefficient inputs to change the graph.", "The active equation, graph, and sample table use the same parameters.", ["coefficients", "viewport"]),
  "algebra-cas": template(["slider", "input", "playback"], ["primary-control"], ["symbolic-result"], ["expression", "symbolic steps"], ["edit", "solve", "reveal"], ["expression", "symbolic result"], "Edit the exact coefficient input and advance steps with Enter or Space.", "The current expression, exact result, and symbolic step are announced.", ["coefficient", "step"]),
  geometry2d: template(["slider", "input"], ["primary-control"], ["geometry-measurement"], ["construction", "measurement"], ["construct", "move", "measure"], ["geometry object", "measurement"], "Use the exact coordinate inputs as the keyboard alternative.", "Point coordinates and the resulting measurements update together.", ["seeded points", "transform amount"]),
  vector: template(["slider", "input"], ["primary-control"], ["vector-result"], ["vector diagram", "components"], ["move", "resolve", "compare"], ["vectors"], "Use component exact-value inputs to position vectors.", "Vector components, magnitude, angle, sum, and projection are announced.", ["vector components"]),
  trigonometry: template(["slider", "input"], ["primary-control"], ["trig-values"], ["unit circle", "graph", "ratios"], ["rotate", "compare"], ["angle", "trig function"], "Use the exact angle input or arrow keys on the slider.", "The angle, circle point, trig values, and graph marker update together.", ["angle"]),
  cas: template(["input", "playback"], ["primary-control"], ["cas-result"], ["expression", "exact result", "steps"], ["enter", "apply", "inspect"], ["expression", "CAS result"], "Type in the labeled CAS field and use the step button by keyboard.", "The expression, exact result, restrictions, and current step are announced.", ["expression", "step"]),
  calculus: template(["slider", "input"], ["primary-control"], ["calculus-result"], ["function graph", "numeric approximation", "exact result"], ["approach", "change", "compare"], ["function", "calculus object"], "Use exact-value inputs for the approach point or partition controls.", "The active function, graph, approximation, and exact result are announced.", ["parameters", "approach or partition"]),
  spreadsheet: template(["data-edit"], ["primary-control"], ["spreadsheet-result"], ["grid", "chart"], ["enter", "fill", "plot"], ["cell range", "formula", "chart"], "Navigate labeled cells and edit with the keyboard.", "The active range, formula results, and linked chart values are available as text.", ["grid cells"]),
  statistics: template(["data-edit", "input"], ["primary-control"], ["statistics-result"], ["dataset", "statistical plot", "summary"], ["edit", "compare", "inspect"], ["dataset", "statistics model"], "Edit the labeled data or exact-value inputs.", "The current dataset, summary statistics, and plot state are announced.", ["dataset", "parameters"]),
  probability: template(["slider", "input"], ["primary-control"], ["probability-result"], ["simulation", "distribution"], ["simulate", "shade", "compare"], ["probability model"], "Use exact trial and parameter inputs.", "The seed, parameters, simulation result, and theoretical model are announced.", ["trials", "parameter", "seed"]),
  inference: template(["slider", "input"], ["primary-control"], ["inference-result"], ["samples", "interval or test", "summary"], ["sample", "test", "compare"], ["sample", "inference result"], "Use exact sample-size and parameter inputs.", "The sample, interval or test result, and repeated-sampling summary are announced.", ["sample size", "seed"]),
  sequence: template(["slider", "input"], ["primary-control"], ["sequence-result"], ["terms", "partial sums"], ["generate", "compare"], ["sequence", "partial sum"], "Use exact-value inputs for terms and parameters.", "The generated terms, partial sum, and convergence status are announced.", ["first term", "step or ratio", "term count"]),
  matrix: template(["input", "playback"], ["primary-control"], ["matrix-result"], ["matrix", "transformation", "calculation"], ["edit", "transform", "inspect"], ["matrix", "transformed object"], "Edit labeled matrix entries and activate playback controls by keyboard.", "The matrix entries, calculation, and transformed object are announced.", ["matrix entries", "step"]),
  complex: template(["slider", "input"], ["primary-control"], ["complex-result"], ["complex expression", "complex plane"], ["move", "rotate", "map"], ["complex number"], "Use exact real and imaginary inputs.", "The complex value, modulus, argument, and plotted point are announced.", ["real part", "imaginary part"]),
  geometry3d: template(["slider", "input"], ["primary-control"], ["geometry3d-result"], ["3D scene", "measurement"], ["orbit", "change", "inspect"], ["3D object", "measurement"], "Use exact scene inputs and keyboard-operable playback controls.", "The object, orientation, section, and measurements are announced.", ["scene size", "section", "orbit"]),
  discrete: template(["selection", "input"], ["primary-control"], ["discrete-result"], ["discrete model", "computed state"], ["select", "run", "compare"], ["discrete object"], "Use labeled buttons, fields, and selectors for every primary action.", "The active discrete structure and computed result are announced.", ["discrete model state"]),
  finance: template(["slider", "input"], ["primary-control"], ["finance-result"], ["assumptions", "table", "chart"], ["adjust", "compare"], ["financial assumptions", "schedule"], "Use exact-value inputs for all financial assumptions.", "The assumptions, derived values, table, and chart summary are announced.", ["financial assumptions"]),
};

const contractOverrides: Record<number, Partial<LessonInteractionContract>> = {
  359: override(["input", "slider"], ["matrix-entry", "vector-angle"], ["eigenvalues", "eigenvector-status", "transformed-vector"], ["matrix", "vector plane", "characteristic polynomial"], ["edit", "test direction"], "matrix.eigen-directions", "Edit the matrix entries and use the exact vector-angle input.", "The matrix, vector v, transformed vector Av, eigenvalues, alignment status, and scale factor update together."),
  404: override(["slider", "selection", "playback"], ["net-fold", "net-face"], ["fold-progress", "face-correspondence"], ["3D solid", "2D net"], ["fold", "unfold", "select", "replay"], "geometry3d.solid-net", "Use the fold slider, face buttons, and play/pause controls.", "The cube and its six-face net share fold progress and selected-face correspondence."),
  443: override(["selection", "slider", "input"], ["ode-rule", "ode-initial-condition"], ["slope-field", "solution-curve", "euler-next-point"], ["differential equation", "slope field", "solution curve"], ["choose", "move", "trace"], "cas.first-order-ode", "Use the equation selector and exact initial-condition and step-size inputs.", "The ODE, initial condition, local slope, Euler next point, slope field, and solution curve update together."),
  480: override(["data-edit", "selection"], ["box-data", "box-rule"], ["quartiles", "iqr", "outliers", "box-plot"], ["sorted data", "five-number summary", "box plot"], ["edit", "sort", "inspect"], "statistics.box-plot", "Edit the labeled data field and select the outlier rule.", "The sorted data, quartiles, IQR, whiskers, outliers, and box plot update together."),
  576: override(["selection", "keyboard"], ["graph-colour-vertex"], ["colour-conflicts", "colour-count", "valid-colouring"], ["graph", "colour assignment", "conflict summary"], ["select colour", "colour vertex", "check"], "discrete.graph-colouring", "Choose a palette color, focus a vertex button, and press Enter or Space.", "Each vertex color, conflicting edge, number of colors, and validity status are announced."),
  582: override(["input", "selection", "toggle"], ["set-rule", "set-membership"], ["computed-set", "membership-result"], ["set-builder notation", "roster notation", "number line"], ["edit", "toggle", "test membership"], "discrete.set-builder", "Edit the labeled universe and membership value; choose the predicate with the selector.", "The finite universe, predicate, computed set, notation, and membership result update together."),
  583: override(["input", "selection"], ["set-operation"], ["set-result", "set-cardinality"], ["set notation", "roster result", "Venn diagram"], ["edit", "select operation", "compare"], "discrete.set-operations", "Edit the labeled set fields and select an operation.", "Sets A and B, the selected operation, roster result, cardinality, and Venn regions update together."),
  586: override(["toggle", "selection"], ["power-source", "power-candidate"], ["power-set", "power-cardinality", "subset-status"], ["source set", "power-set list", "subset check"], ["select", "generate", "check subset"], "discrete.power-set", "Toggle source and candidate elements with the labeled buttons.", "The source set, candidate subset, power set, containment status, and two-to-the-n count update together."),
  587: override(["input", "selection"], ["truth-expression", "truth-row"], ["truth-table", "truth-classification"], ["logical formula", "truth table", "classification"], ["edit", "generate", "highlight row"], "discrete.truth-table", "Type in the labeled proposition field and select a truth-table row.", "The proposition, detected variables, truth rows, highlighted valuation, and classification update together."),
  588: override(["toggle", "selection"], ["connective-values", "connective-kind"], ["connective-result", "connective-row"], ["symbolic statement", "plain-language result", "truth table"], ["toggle", "select", "compare"], "discrete.logical-connectives", "Toggle p and q and select a connective using labeled controls.", "The p and q values, connective, symbolic statement, result, and highlighted truth row update together."),
  589: override(["input", "selection"], ["quantifier-domain", "quantifier-kind"], ["quantifier-evaluation", "quantifier-evidence"], ["quantified statement", "domain evaluation", "witness or counterexample"], ["edit", "select", "find evidence"], "discrete.quantifiers", "Edit the finite domain and select the quantifier and predicate.", "The quantified statement, value for each domain member, truth result, and witness or counterexample update together."),
  591: override(["slider", "input"], ["simple-interest-assumptions"], ["simple-interest", "simple-amount", "simple-table", "simple-graph"], ["formula", "table", "linear graph"], ["adjust", "compare"], "finance.simple-interest", "Use exact principal, annual rate, and time inputs.", "Principal, simple-interest rate, time, interest, final amount, table, and linear graph update together."),
};

export function enrichLessonDefinition(source: LessonSourceDefinition): LessonDefinition {
  const preset = resolveLessonPreset(source);
  const base = templates[source.adapter];
  const overrideContract = contractOverrides[source.id];
  const contract: LessonInteractionContract = {
    ...base,
    ...overrideContract,
    concept: source.title,
    challengeFactory: overrideContract?.challengeFactory ?? preset.id,
  };
  const lesson = { ...source, preset, contract };
  const errors = validateLessonDefinition(lesson);
  if (errors.length) throw new Error(`Lesson ${source.id} certification schema: ${errors.join("; ")}`);
  return lesson;
}

export function validateLessonDefinition(lesson: LessonDefinition) {
  const errors = validatePresetResolution(lesson, lesson.preset);
  const contract = lesson.contract;
  if (contract.concept !== lesson.title) errors.push("contract concept must match lesson title");
  for (const [key, value] of Object.entries(contract)) {
    if (typeof value === "string" && !value.trim()) errors.push(`${key} is empty`);
    if (Array.isArray(value) && value.length === 0) errors.push(`${key} is empty`);
    if (Array.isArray(value) && value.some((item) => typeof item !== "string" || !item.trim())) errors.push(`${key} contains an empty value`);
  }
  if (contract.challengeFactory !== lesson.preset.id) errors.push("challenge factory must resolve through the selected preset");
  return errors;
}

function template(requiredControls: ContractTemplate["requiredControls"], requiredControlIds: string[], observableOutputs: string[], requiredRepresentations: string[], requiredInteractionVerbs: string[], workspaceObjects: string[], keyboardAlternative: string, screenReaderSummary: string, resetAssertions: string[]): ContractTemplate {
  return { requiredControls, requiredControlIds, observableOutputs, requiredRepresentations, requiredInteractionVerbs, workspaceObjects, keyboardAlternative, screenReaderSummary, resetAssertions };
}

function override(requiredControls: LessonInteractionContract["requiredControls"], requiredControlIds: string[], observableOutputs: string[], requiredRepresentations: string[], requiredInteractionVerbs: string[], challengeFactory: string, keyboardAlternative: string, screenReaderSummary: string): Partial<LessonInteractionContract> {
  return { requiredControls, requiredControlIds, observableOutputs, requiredRepresentations, requiredInteractionVerbs, challengeFactory, keyboardAlternative, screenReaderSummary };
}

