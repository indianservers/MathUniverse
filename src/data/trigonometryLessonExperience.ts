import { trigonometryConcepts, type TrigonometryConcept, type TrigonometryVisualType } from "./trigonometryConcepts";

export type TrigLessonCategory =
  | "foundation"
  | "unit-circle"
  | "triangle-ratios"
  | "identities"
  | "angle-formulas"
  | "graphs"
  | "inverse"
  | "applications"
  | "advanced";

export type TrigLessonDifficulty = "beginner" | "intermediate" | "advanced";

export type TrigVisualModel =
  | "unit-circle"
  | "right-triangle"
  | "triangle-circle"
  | "graph"
  | "identity-proof"
  | "angle-composition"
  | "reflection"
  | "wave"
  | "application"
  | "fallback";

export type TrigInteractionModel =
  | "slider"
  | "drag-point"
  | "snap-buttons"
  | "toggle-layers"
  | "step-reveal"
  | "live-values"
  | "formula-highlight"
  | "quiz"
  | "challenge";

export type TrigPhaseOwner =
  | "phase-01"
  | "phase-02"
  | "phase-03"
  | "phase-04"
  | "phase-05"
  | "phase-06"
  | "phase-07"
  | "phase-08"
  | "phase-09"
  | "phase-10";

export type TrigLessonExperience = {
  id: string;
  conceptId: string;
  title: string;
  category: TrigLessonCategory;
  difficulty: TrigLessonDifficulty;
  visualModel: TrigVisualModel;
  interactionModel: TrigInteractionModel[];
  formulas: string[];
  learningSequence: {
    visualIntuition: string;
    formulaMeaning: string;
    numericalCheck: string;
    misconception: string;
    tryItYourself: string;
    realLifeMeaning: string;
    visualMemoryTrick: string;
  };
  mathSafety: {
    domain?: string;
    range?: string;
    undefinedWhen?: string[];
    angleMode?: "degrees" | "radians" | "both";
    tolerance?: number;
    edgeCases?: string[];
  };
  phaseOwner: TrigPhaseOwner;
};

const phaseByConceptId: Record<string, TrigPhaseOwner> = {
  "unit-circle": "phase-02",
  "degree-radian": "phase-02",
  "special-angles": "phase-02",
  "quadrant-signs": "phase-02",
  "right-triangle-ratios": "phase-03",
  "reciprocal-ratios": "phase-03",
  "trigonometric-functions": "phase-03",
  "pythagorean-identity": "phase-04",
  "tangent-graph": "phase-07",
  "reciprocal-graphs": "phase-07",
  "sum-difference": "phase-05",
  "double-angle": "phase-06",
  "half-angle": "phase-06",
  "product-to-sum": "phase-06",
  "triple-angle": "phase-06",
  "inverse-trig": "phase-08",
  "inverse-principal-values": "phase-08",
  "trig-equations": "phase-08",
  "general-solutions": "phase-08",
  "trig-inequalities": "phase-08",
  "inquiry-experiments": "phase-09",
};

const graphConceptIds = new Set([
  "sine-graph",
  "cosine-graph",
  "tangent-graph",
  "reciprocal-graphs",
  "wave-amplitude",
  "wave-period-frequency",
  "phase-shift",
  "trig-limits",
  "trig-derivatives",
  "trig-integrals",
  "orthogonality",
  "fourier-trig-series",
  "hyperbolic-functions",
]);

const advancedCategories = new Set(["Advanced", "Calculus", "Degree", "PG"]);
const applicationCategories = new Set(["Applications", "Triangle Solving"]);

function phaseForConcept(concept: TrigonometryConcept): TrigPhaseOwner {
  if (phaseByConceptId[concept.id]) return phaseByConceptId[concept.id];
  if (graphConceptIds.has(concept.id)) return "phase-07";
  if (applicationCategories.has(concept.category)) return "phase-03";
  if (advancedCategories.has(concept.category)) return "phase-10";
  return "phase-01";
}

function categoryForConcept(concept: TrigonometryConcept): TrigLessonCategory {
  if (concept.id === "unit-circle" || concept.id === "degree-radian" || concept.id === "special-angles" || concept.id === "quadrant-signs") return "unit-circle";
  if (concept.category === "Foundations") return "foundation";
  if (concept.category === "Ratios") return "triangle-ratios";
  if (concept.category === "Graphs" || concept.category === "Wave Parameters") return "graphs";
  if (concept.category === "Identities") return concept.id.includes("angle") || concept.id.includes("sum") || concept.id.includes("difference") ? "angle-formulas" : "identities";
  if (concept.category === "Equations") return "inverse";
  if (applicationCategories.has(concept.category)) return "applications";
  return "advanced";
}

function difficultyForConcept(concept: TrigonometryConcept): TrigLessonDifficulty {
  if (advancedCategories.has(concept.category) || concept.id.includes("triple") || concept.id.includes("fourier") || concept.id.includes("spherical")) return "advanced";
  if (concept.category === "Foundations" || concept.id === "pythagorean-identity" || concept.id === "complementary-angles") return "beginner";
  return "intermediate";
}

function visualModelForConcept(visual: TrigonometryVisualType, conceptId: string): TrigVisualModel {
  if (visual === "unit-circle" || visual === "angle-measure" || visual === "polar") return "unit-circle";
  if (visual === "right-triangle" || visual === "ratio" || visual === "height-distance") return "right-triangle";
  if (visual === "identity") return conceptId.includes("sum") || conceptId.includes("double") || conceptId.includes("half") ? "angle-composition" : "identity-proof";
  if (visual === "graph-transform" || visual === "sine-cosine-wave") return "graph";
  if (visual === "inverse") return "reflection";
  if (visual === "law") return "triangle-circle";
  if (visual === "bearing" || visual === "eclipse" || visual === "wave-applications") return "application";
  if (visual === "trig-functions") return "unit-circle";
  return "fallback";
}

function interactionsForConcept(concept: TrigonometryConcept): TrigInteractionModel[] {
  const interactions: TrigInteractionModel[] = ["slider", "live-values", "step-reveal"];
  if (concept.visual === "unit-circle" || concept.visual === "identity" || concept.visual === "trig-functions") interactions.push("formula-highlight", "toggle-layers");
  if (concept.visual === "right-triangle" || concept.visual === "ratio" || concept.visual === "height-distance") interactions.push("drag-point", "snap-buttons");
  if (concept.category === "Equations" || concept.id === "inquiry-experiments") interactions.push("quiz", "challenge");
  return Array.from(new Set(interactions));
}

function safetyForConcept(concept: TrigonometryConcept): TrigLessonExperience["mathSafety"] {
  const edgeCases = ["0 degrees", "30 degrees", "45 degrees", "60 degrees", "90 degrees", "180 degrees", "270 degrees", "360 degrees"];
  if (concept.id.includes("inverse")) {
    return {
      domain: "Inputs must respect the selected inverse function domain.",
      range: "Principal-value range must be declared before solving.",
      angleMode: "both",
      tolerance: 0.001,
      edgeCases: ["-1", "0", "1", ...edgeCases],
    };
  }
  if (concept.formula.includes("tan") || concept.formula.includes("sec") || concept.formula.includes("cot") || concept.formula.includes("csc") || concept.formula.includes("cosec")) {
    return {
      undefinedWhen: ["cos(theta)=0 for tan/sec", "sin(theta)=0 for cot/csc/cosec"],
      angleMode: "both",
      tolerance: 0.001,
      edgeCases,
    };
  }
  if (concept.visual === "graph-transform" || concept.visual === "sine-cosine-wave") {
    return {
      domain: "Graph domain depends on visible window and transformation settings.",
      range: "Range depends on amplitude, reciprocal restrictions, and vertical scaling.",
      angleMode: "both",
      tolerance: 0.001,
      edgeCases,
    };
  }
  return {
    angleMode: "both",
    tolerance: 0.001,
    edgeCases,
  };
}

function formulasForConcept(concept: TrigonometryConcept) {
  return concept.formula.split(/,\s+|;\s+/).map((formula) => formula.trim()).filter(Boolean);
}

function visualMemoryTrick(concept: TrigonometryConcept) {
  if (concept.visual === "unit-circle" || concept.visual === "identity") return "Cosine is the horizontal shadow; sine is the vertical shadow.";
  if (concept.visual === "right-triangle" || concept.visual === "ratio") return "Name the angle first, then label opposite, adjacent, and hypotenuse.";
  if (concept.visual === "graph-transform" || concept.visual === "sine-cosine-wave") return "A rotating point unfolded over time becomes a wave.";
  if (concept.visual === "inverse") return "Inverse trig is a restricted doorway back from ratio to angle.";
  return "Tie every symbol to a visible point, side, angle, or measurement.";
}

export const trigonometryLessonExperiences: TrigLessonExperience[] = trigonometryConcepts.map((concept) => ({
  id: `${concept.id}-experience`,
  conceptId: concept.id,
  title: concept.title,
  category: categoryForConcept(concept),
  difficulty: difficultyForConcept(concept),
  visualModel: visualModelForConcept(concept.visual, concept.id),
  interactionModel: interactionsForConcept(concept),
  formulas: formulasForConcept(concept),
  learningSequence: {
    visualIntuition: concept.summary,
    formulaMeaning: `Connect ${concept.formula} to the visible ${visualModelForConcept(concept.visual, concept.id).replace("-", " ")} model.`,
    numericalCheck: `Move ${concept.sliderA} and compare the live values before trusting the formula.`,
    misconception: safetyForConcept(concept).undefinedWhen?.join("; ") ?? "Do not memorize the formula without identifying the angle and visible measurement first.",
    tryItYourself: concept.tasks[0] ?? "Move the controls and explain what stayed constant.",
    realLifeMeaning: concept.use,
    visualMemoryTrick: visualMemoryTrick(concept),
  },
  mathSafety: safetyForConcept(concept),
  phaseOwner: phaseForConcept(concept),
}));

export function getTrigonometryLessonExperience(conceptId?: string) {
  return trigonometryLessonExperiences.find((experience) => experience.conceptId === conceptId);
}

export function getTrigonometryExperiencesByPhase(phaseOwner: TrigPhaseOwner) {
  return trigonometryLessonExperiences.filter((experience) => experience.phaseOwner === phaseOwner);
}

export function validateTrigonometryLessonExperienceMetadata() {
  const conceptIds = new Set(trigonometryConcepts.map((concept) => concept.id));
  const duplicateConceptIds = trigonometryConcepts
    .map((concept) => concept.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  const duplicateExperienceIds = trigonometryLessonExperiences
    .map((experience) => experience.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  const orphanedExperienceIds = trigonometryLessonExperiences
    .filter((experience) => !conceptIds.has(experience.conceptId))
    .map((experience) => experience.id);
  const missingTitles = trigonometryConcepts.filter((concept) => !concept.title.trim()).map((concept) => concept.id);
  const missingCategories = trigonometryConcepts.filter((concept) => !concept.category.trim()).map((concept) => concept.id);
  const missingExperienceConceptIds = trigonometryConcepts
    .filter((concept) => !trigonometryLessonExperiences.some((experience) => experience.conceptId === concept.id))
    .map((concept) => concept.id);

  return {
    valid:
      duplicateConceptIds.length === 0 &&
      duplicateExperienceIds.length === 0 &&
      orphanedExperienceIds.length === 0 &&
      missingTitles.length === 0 &&
      missingCategories.length === 0 &&
      missingExperienceConceptIds.length === 0,
    duplicateConceptIds,
    duplicateExperienceIds,
    orphanedExperienceIds,
    missingTitles,
    missingCategories,
    missingExperienceConceptIds,
    conceptCount: trigonometryConcepts.length,
    experienceCount: trigonometryLessonExperiences.length,
  };
}
