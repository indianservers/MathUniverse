export type StrengthenedLessonType =
  | "concept"
  | "procedure"
  | "proof"
  | "visual_exploration"
  | "practice"
  | "tool"
  | "modelling"
  | "assessment";

export type RepresentationType =
  | "number_line"
  | "area_model"
  | "bar_model"
  | "algebra_tiles"
  | "balance_model"
  | "table"
  | "coordinate_graph"
  | "function_graph"
  | "unit_circle"
  | "geometric_construction"
  | "vector_diagram"
  | "matrix_grid"
  | "tree_diagram"
  | "venn_diagram"
  | "probability_simulation"
  | "distribution_plot"
  | "sampling_animation"
  | "solid_3d"
  | "cross_section"
  | "surface_plot"
  | "slope_field"
  | "riemann_sum"
  | "transformation_animation"
  | "proof_diagram"
  | "financial_timeline"
  | "symbolic_steps"
  | "spreadsheet_grid"
  | "calculator_trace"
  | "text_table";

export type VocabularyItem = {
  term: string;
  meaning: string;
};

export type DefinitionItem = {
  id: string;
  statement: string;
};

export type FactItem = {
  id: string;
  statement: string;
  conditions?: string[];
};

export type FormulaVariable = {
  symbol: string;
  meaning: string;
  unit?: string;
};

export type FormulaItem = {
  id: string;
  label: string;
  expression: string;
  variables: FormulaVariable[];
  restrictions?: string[];
  exactness?: "exact" | "approximation" | "definition" | "theorem" | "identity";
};

export type RepresentationSpec = {
  id: string;
  type: RepresentationType;
  learningPurpose: string;
  linkedFields?: string[];
  graphDomain?: [number, number];
};

export type WorkedExample = {
  id: string;
  prompt: string;
  steps: string[];
  answer: string;
};

export type RealLifeExample = {
  id: string;
  context: string;
  connection: string;
};

export type MisconceptionItem = {
  code: string;
  mistake: string;
  correction: string;
};

export type InteractionSpec = {
  id: string;
  learningPurpose: string;
  parameters: Array<{
    id: string;
    label: string;
    validRange?: [number, number];
    validValues?: string[];
  }>;
  initialState: string;
  dynamicFeedback: string;
  successCriteria: string[];
  accessibilityAlternative: string;
};

export type GuidedStep = {
  id: string;
  prompt: string;
  expectedObservation?: string;
};

export type PracticeQuestion = {
  id: string;
  prompt: string;
  answer: string;
  hints: string[];
  workedSolution: string[];
  misconceptionTag: string;
  difficulty: "recognition" | "direct" | "multi_step" | "error_diagnosis" | "transfer" | "challenge";
  tolerance?: number;
  parameterConstraints?: string[];
};

export type ChallengeSpec = {
  id: string;
  prompt: string;
  successCriteria: string[];
  hints: string[];
};

export type ExitCheckQuestion = {
  id: string;
  prompt: string;
  answer: string;
  criterion: string;
};

export type StrengthenedLesson = {
  id: number | string;
  title: string;
  route: string;
  category: string;
  topic: string;
  academicLevel?: string;
  lessonType: StrengthenedLessonType;
  learningObjectives: string[];
  prerequisites: string[];
  keyVocabulary: VocabularyItem[];
  introduction: string;
  basicIdea: string;
  howItWorks: string;
  whyItWorks: string;
  definitions: DefinitionItem[];
  facts: FactItem[];
  formulas: FormulaItem[];
  conditionsAndRestrictions: string[];
  representations: RepresentationSpec[];
  workedExamples: WorkedExample[];
  realLifeExamples: RealLifeExample[];
  misconceptions: MisconceptionItem[];
  interaction: InteractionSpec;
  guidedExploration: GuidedStep[];
  practice: PracticeQuestion[];
  challenge: ChallengeSpec;
  exitCheck: ExitCheckQuestion[];
  accessibilityNotes: string[];
  expertReviewRequired: boolean;
  reviewReason?: string;
  sourceNotes?: string[];
};

export const bannedGenericLessonPhrases = [
  "This concept helps us understand mathematics.",
  "Move the controls and observe what happens.",
  "Try different values to explore the idea.",
  "This is useful in real life.",
  "Complete the challenge using the tools.",
  "The visual shows another representation.",
  "Think carefully and find the answer.",
  "fills a Class",
  "syllabus gap",
  "connects it to an interactive representation",
];

const representationTypes = new Set<RepresentationType>([
  "number_line",
  "area_model",
  "bar_model",
  "algebra_tiles",
  "balance_model",
  "table",
  "coordinate_graph",
  "function_graph",
  "unit_circle",
  "geometric_construction",
  "vector_diagram",
  "matrix_grid",
  "tree_diagram",
  "venn_diagram",
  "probability_simulation",
  "distribution_plot",
  "sampling_animation",
  "solid_3d",
  "cross_section",
  "surface_plot",
  "slope_field",
  "riemann_sum",
  "transformation_animation",
  "proof_diagram",
  "financial_timeline",
  "symbolic_steps",
  "spreadsheet_grid",
  "calculator_trace",
  "text_table",
]);

export function validateStrengthenedLesson(lesson: StrengthenedLesson): string[] {
  const errors: string[] = [];
  const requiredText: Array<[string, unknown]> = [
    ["title", lesson.title],
    ["route", lesson.route],
    ["category", lesson.category],
    ["topic", lesson.topic],
    ["introduction", lesson.introduction],
    ["basicIdea", lesson.basicIdea],
    ["howItWorks", lesson.howItWorks],
    ["whyItWorks", lesson.whyItWorks],
  ];
  for (const [field, value] of requiredText) {
    if (typeof value !== "string" || !value.trim()) errors.push(`${field} is missing`);
  }
  if (!lesson.route.startsWith("/lessons/")) errors.push("route must preserve a lesson route");
  if (lesson.learningObjectives.length === 0) errors.push("learningObjectives is empty");
  if (!lesson.interaction.learningPurpose.trim()) errors.push("interaction without learning purpose");
  if (lesson.challenge.successCriteria.length === 0) errors.push("challenge without success criteria");
  const practiceIds = lesson.practice.map((item) => item.id);
  if (new Set(practiceIds).size !== practiceIds.length) errors.push("duplicate practice IDs");
  for (const formula of lesson.formulas) {
    if (!formula.variables.length) errors.push(`formula ${formula.id} has no variables`);
  }
  for (const representation of lesson.representations) {
    if (!representationTypes.has(representation.type)) errors.push(`unsupported representation type ${representation.type}`);
    if (representation.graphDomain && representation.graphDomain[0] >= representation.graphDomain[1]) {
      errors.push(`invalid graph domain for ${representation.id}`);
    }
  }
  const searchableText = [
    lesson.introduction,
    lesson.basicIdea,
    lesson.howItWorks,
    lesson.whyItWorks,
    lesson.challenge.prompt,
    ...lesson.learningObjectives,
    ...lesson.realLifeExamples.flatMap((item) => [item.context, item.connection]),
  ].join("\n");
  for (const phrase of bannedGenericLessonPhrases) {
    if (searchableText.toLowerCase().includes(phrase.toLowerCase())) errors.push(`banned generic phrase: ${phrase}`);
  }
  return errors;
}
