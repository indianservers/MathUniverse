import { syllabusWorkspaceTemplates, type GuidedActivityPhase, type SyllabusWorkspaceTemplate } from "./syllabusWorkspaceTemplates";

export type UnitLabPackage = {
  id: string;
  unit: string;
  title: string;
  templateId: string;
  interactiveLab: string;
  formulas: string[];
  examples: string[];
  misconceptions: string[];
  guidedTasks: GuidedTask[];
  assessment: AssessmentSpec;
  teacherPresentation: TeacherPresentationSpec;
  tutorPrompts: TutorPrompt[];
  recommendedTools: string[];
};

export type GuidedTask = {
  phase: GuidedActivityPhase;
  goal: string;
  validation: string;
  hint: string;
  reveal: string;
};

export type AssessmentSpec = {
  constructionGoal: string;
  autoChecks: string[];
  misconceptionSignals: string[];
  rubric: { criterion: string; points: number }[];
  exportFields: string[];
};

export type TeacherPresentationSpec = {
  lockWorkspace: boolean;
  revealObjects: string[];
  spotlightObject: string;
  hideAlgebraDefault: boolean;
  studentPrompt: string;
  shareModes: string[];
};

export type TutorPrompt = {
  trigger: string;
  explanation: string;
  nextChallenge: string;
};

export type ProductionReadinessPlan = {
  performance: string[];
  accessibility: string[];
  testing: string[];
  uiPolish: string[];
  discoverability: string[];
};

const formulasByUnit: Record<string, string[]> = {
  "Number Systems": ["Real = rational + irrational", "sqrt(n) on number line", "decimal expansion: terminating/repeating/non-repeating"],
  Polynomials: ["p(x)=a_n x^n+...", "factor theorem: p(a)=0", "remainder theorem"],
  "Linear Equations": ["ax+by+c=0", "slope-intercept: y=mx+b", "solution = intersection"],
  "Coordinate Geometry": ["distance = sqrt((x2-x1)^2+(y2-y1)^2)", "midpoint = ((x1+x2)/2,(y1+y2)/2)", "slope = rise/run"],
  "Euclid Geometry": ["axiom -> postulate -> theorem", "equal things remain equal", "whole is greater than part"],
  Triangles: ["angle sum = 180", "Pythagoras: a^2+b^2=c^2", "congruence: SSS/SAS/ASA/RHS"],
  Quadrilaterals: ["area parallelogram = base*height", "opposite sides parallel/equal", "diagonals classify families"],
  Circles: ["C=2*pi*r", "A=pi*r^2", "radius perpendicular to tangent"],
  Trigonometry: ["sin=opp/hyp", "cos=adj/hyp", "x=r cos(theta), y=r sin(theta)"],
  Statistics: ["mean=sum/n", "median=middle value", "range=max-min"],
  "3D Geometry": ["V_prism=base area*height", "sphere: V=4/3*pi*r^3", "cross-section = plane intersection"],
};

const commandByUnit: Record<string, string> = {
  "Number Systems": "DynamicTable[x, sqrt(x), 1, 16, 1]",
  Polynomials: "CAS[Factor, x^2-5*x+6]",
  "Linear Equations": "Intersect[2*x+3, -x+6]",
  "Coordinate Geometry": "Distance[(0,0), (3,4)]",
  "Euclid Geometry": "Relation[Line[(0,0),(1,0)], Line[(0,1),(1,1)]]",
  Triangles: "Angle[(1,0), (0,0), (0,1)]",
  Quadrilaterals: "Area[polygon]",
  Circles: "Circle[(0,0), 4]",
  Trigonometry: "DynamicTable[sin(x), cos(x), -3, 3, 0.5]",
  Statistics: "List[2, 4, 4, 5, 9]",
  "3D Geometry": "Slice[Sphere[(0,0,0), 3], z=1]",
};

export function buildBeyondGeoGebraUnitPackages(templates: SyllabusWorkspaceTemplate[] = syllabusWorkspaceTemplates): UnitLabPackage[] {
  const templateByUnit = new Map(templates.map((template) => [normalizeUnit(template.unit), template]));
  return Object.keys(formulasByUnit).map((unit) => {
    const template = templateByUnit.get(normalizeUnit(unit)) ?? bestTemplateForUnit(unit, templates);
    return createUnitPackage(unit, template);
  });
}

export function createUnitPackage(unit: string, template: SyllabusWorkspaceTemplate): UnitLabPackage {
  const formulas = formulasByUnit[unit] ?? template.outcomes;
  const command = commandByUnit[unit] ?? template.command;
  return {
    id: normalizeUnit(unit),
    unit,
    title: `${unit} Interactive Lab`,
    templateId: template.id,
    interactiveLab: command,
    formulas,
    examples: formulas.map((formula, index) => `${unit} example ${index + 1}: use ${formula} inside ${command}.`),
    misconceptions: misconceptionsForUnit(unit),
    guidedTasks: template.steps.map((step) => ({
      phase: step.phase,
      goal: step.prompt,
      validation: validationForPhase(unit, step.phase),
      hint: hintForUnit(unit, step.phase),
      reveal: step.reveal,
    })),
    assessment: assessmentForUnit(unit),
    teacherPresentation: teacherSpecForUnit(unit, template),
    tutorPrompts: tutorPromptsForUnit(unit),
    recommendedTools: toolsForUnit(unit),
  };
}

export function validateGuidedTaskResponse(task: GuidedTask, response: string) {
  const text = response.toLowerCase();
  const keywords = task.validation.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const hits = keywords.filter((keyword) => text.includes(keyword)).length;
  return {
    passed: hits >= Math.min(2, keywords.length),
    score: keywords.length ? Math.round((hits / keywords.length) * 100) : 0,
    feedback: hits ? "Evidence found in the response." : `Hint: ${task.hint}`,
  };
}

export function assessConstruction(packageSpec: UnitLabPackage, objects: { kind: string; definition: string; visible?: boolean }[]) {
  const visibleObjects = objects.filter((object) => object.visible !== false);
  const requiredTools = packageSpec.recommendedTools.slice(0, 3);
  const toolHits = requiredTools.filter((tool) => visibleObjects.some((object) => `${object.kind} ${object.definition}`.toLowerCase().includes(tool.toLowerCase().split(" ")[0])));
  const misconceptionHits = packageSpec.assessment.misconceptionSignals.filter((signal) => visibleObjects.some((object) => object.definition.toLowerCase().includes(signal.toLowerCase())));
  return {
    score: Math.min(100, Math.round((toolHits.length / Math.max(1, requiredTools.length)) * 70 + (misconceptionHits.length ? 0 : 30))),
    passed: toolHits.length >= Math.min(2, requiredTools.length) && misconceptionHits.length === 0,
    toolHits,
    misconceptionHits,
    rubricRows: packageSpec.assessment.rubric.map((row) => ({ ...row, earned: misconceptionHits.length ? Math.floor(row.points / 2) : row.points })),
  };
}

export function objectAwareTutorResponse(packageSpec: UnitLabPackage, question: string, objectDefinition: string) {
  const lower = question.toLowerCase();
  const prompt = packageSpec.tutorPrompts.find((item) => lower.includes(item.trigger)) ?? packageSpec.tutorPrompts[0];
  return {
    unit: packageSpec.unit,
    objectDefinition,
    explanation: prompt.explanation.replace("{object}", objectDefinition),
    theorem: packageSpec.formulas[0],
    nextChallenge: prompt.nextChallenge,
  };
}

export function productionReadinessPlan(): ProductionReadinessPlan {
  return {
    performance: ["Virtualize large object lists", "Throttle drag recomputation with requestAnimationFrame", "Move CAS/geometry stress work to a Web Worker", "Run 5k object scene benchmarks"],
    accessibility: ["ARIA labels for toolbars and panels", "Keyboard construction for every 2D tool", "Screen-reader summaries for graph/geometry/3D state", "Reduced-motion animation mode", "High-contrast graph palette"],
    testing: ["Every construction tool has unit tests", "Every command parser route has tests", "Dependency invalidation tests", "Export and persistence round trips", "3D transform and snapping tests"],
    uiPolish: ["Dockable panels", "Collapsible algebra/protocol/inspector", "Command palette with fuzzy search", "Contextual toolbar", "Persistent workspace layout"],
    discoverability: ["Searchable command docs", "Tooltips with examples", "Show-me-how mini tours", "Unit-specific tool recommendations", "Teacher quick-start cards"],
  };
}

export function commandDocsForPackages(packages: UnitLabPackage[]) {
  return packages.flatMap((item) => item.recommendedTools.map((tool) => ({
    unit: item.unit,
    tool,
    example: item.interactiveLab,
    tooltip: `${tool} is recommended for ${item.unit}. Try: ${item.interactiveLab}`,
  })));
}

function bestTemplateForUnit(unit: string, templates: SyllabusWorkspaceTemplate[]) {
  if (/circle|trig/i.test(unit)) return templates.find((template) => template.id === "circles") ?? templates[0];
  if (/coordinate|linear/i.test(unit)) return templates.find((template) => template.id === "coordinate-geometry") ?? templates[0];
  if (/triangle|quadrilateral|euclid/i.test(unit)) return templates.find((template) => template.id === "quadrilaterals") ?? templates[0];
  if (/3d|solid/i.test(unit)) return templates.find((template) => template.id === "3d-solids") ?? templates[0];
  return templates.find((template) => template.id === "polynomials") ?? templates[0];
}

function misconceptionsForUnit(unit: string) {
  if (unit === "Circles") return ["Confusing radius and diameter", "Thinking area grows linearly with radius", "Forgetting tangent radius is perpendicular"];
  if (unit === "Coordinate Geometry") return ["Reversing x and y", "Using screen y-direction as mathematical y", "Confusing slope with distance"];
  if (unit === "Polynomials") return ["Treating zeros and factors as unrelated", "Missing multiplicity", "Reading y-intercept as root"];
  if (unit === "Statistics") return ["Mean must be an existing data value", "Median equals average of extremes", "Range measures center"];
  return ["Relying on memorized formula only", "Not checking constraints", "Ignoring units or definitions"];
}

function validationForPhase(unit: string, phase: GuidedActivityPhase) {
  const formula = formulasByUnit[unit]?.[0] ?? "definition";
  const base = {
    predict: `Prediction mentions ${formula} or a visible invariant.`,
    manipulate: "Response names what changed and what stayed invariant.",
    check: "Response compares visual evidence with symbolic or numeric output.",
    reflect: "Response explains the concept in words and connects at least two representations.",
  };
  return base[phase];
}

function hintForUnit(unit: string, phase: GuidedActivityPhase) {
  return `${unit}: focus on the ${phase} step, then name the object, measurement, and formula you used.`;
}

function assessmentForUnit(unit: string): AssessmentSpec {
  return {
    constructionGoal: `Build and explain a correct ${unit} model with linked visual, formula, and check evidence.`,
    autoChecks: ["Required objects are visible", "A formula/result is attached", "At least one manipulation is recorded", "Reflection references evidence"],
    misconceptionSignals: misconceptionsForUnit(unit).map((item) => item.split(" ")[0].toLowerCase()),
    rubric: [
      { criterion: "Correct construction", points: 4 },
      { criterion: "Dynamic manipulation evidence", points: 3 },
      { criterion: "Formula/check connection", points: 2 },
      { criterion: "Clear reflection", points: 1 },
    ],
    exportFields: ["student", "unit", "constructionGoal", "score", "misconceptions", "rubric", "timestamp"],
  };
}

function teacherSpecForUnit(unit: string, template: SyllabusWorkspaceTemplate): TeacherPresentationSpec {
  return {
    lockWorkspace: true,
    revealObjects: template.steps.map((step) => `${step.phase}: ${step.title}`),
    spotlightObject: unit === "3D Geometry" ? "slice plane" : unit === "Circles" ? "radius" : "active construction",
    hideAlgebraDefault: false,
    studentPrompt: `Scan this QR/share activity and complete the ${unit} predict-manipulate-check-reflect cycle.`,
    shareModes: ["URL", "QR-ready link", "lesson pack", "worksheet"],
  };
}

function tutorPromptsForUnit(unit: string): TutorPrompt[] {
  return [
    { trigger: "why", explanation: "{object} changed because one of its parent definitions or slider values changed.", nextChallenge: `Create a second ${unit} object and compare invariants.` },
    { trigger: "theorem", explanation: `The likely theorem or formula is ${formulasByUnit[unit]?.[0] ?? "the defining relation"}.`, nextChallenge: "Use a measurement to verify the theorem." },
    { trigger: "challenge", explanation: "I can generate a harder task from the selected object and current unit.", nextChallenge: `Hide the formula and reconstruct the ${unit} result from the visual evidence.` },
  ];
}

function toolsForUnit(unit: string) {
  if (unit === "Circles") return ["Circle", "Tangent", "Radius measurement", "SetTrace"];
  if (unit === "Coordinate Geometry") return ["Point", "Line", "Distance", "Slope"];
  if (unit === "Polynomials") return ["Plot", "Root", "CAS", "DynamicTable"];
  if (unit === "3D Geometry") return ["Sphere", "Plane", "Slice", "Measure3D"];
  if (unit === "Statistics") return ["List", "Spreadsheet", "Regression", "DynamicTable"];
  return ["Point", "Measure", "CAS", "Guided Activity"];
}

function normalizeUnit(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
