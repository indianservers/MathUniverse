import type { LessonControlKind } from "../types";

export type PrimaryLearningType =
  | "learn"
  | "explore"
  | "practice"
  | "challenge"
  | "investigation"
  | "visual-proof"
  | "assessment"
  | "revision";

export type InteractionFormat =
  | "animation"
  | "simulation"
  | "slider"
  | "drag-and-observe"
  | "construction"
  | "graphing"
  | "cas"
  | "3d"
  | "ar"
  | "data-experiment"
  | "matching"
  | "game"
  | "multiple-choice"
  | "numeric-answer"
  | "algebraic-answer"
  | "open-response";

export type LessonEngineType =
  | "geometry-2d"
  | "geometry-3d"
  | "cas-data"
  | "graph-2d"
  | "graph-3d"
  | "none";

export type CurriculumMapping = {
  board: string;
  classLevel?: string;
  chapter?: string;
  code?: string;
};

export type LessonEnginePresetReference = {
  id: string;
  source: "lesson" | "concept" | "family" | "advanced-tool" | "school-family" | "none";
  version?: string;
};

export type ActivityBlock = {
  id: string;
  type: PrimaryLearningType | InteractionFormat;
  title: string;
  prompt: string;
  expectedAction?: string;
  validationHint?: string;
};

export type ResponseType =
  | "multiple-choice"
  | "numeric"
  | "algebraic"
  | "open-response"
  | "construction"
  | "graph";

export type FeedbackMode = "none" | "immediate" | "after-submit" | "teacher-review";

export type AssessmentConfig = {
  deterministicSeed?: string;
  minimumItems: number;
  attempts: number;
  masteryThreshold: number;
};

export type ThumbnailConfig = {
  mode: "engine-state" | "generated-fallback" | "static";
  description: string;
  sourcePresetId?: string;
};

export type ReviewStatus = "not-started" | "needs-review" | "reviewed" | "approved";

export type ContentQualityStatus =
  | "generated-template"
  | "family-specific"
  | "lesson-specific"
  | "mathematically-reviewed"
  | "release-ready";

export type InteractionSpecificityStatus =
  | "none"
  | "family-preset"
  | "lesson-preset"
  | "theorem-specific";

export type LearningResourceRecord = {
  resourceId: string;
  canonicalLessonId: string;
  conceptId: string;
  slug: string;
  title: string;
  shortTitle?: string;
  summary: string;
  primaryType: PrimaryLearningType;
  interactionFormats: InteractionFormat[];
  mainTopic: string;
  subtopic: string;
  conceptFamily: string;
  skills: string[];
  learningObjectives: string[];
  difficulty: "foundation" | "intermediate" | "advanced" | "rigorous";
  estimatedMinutes: number;
  classLevels: string[];
  curriculumMappings: CurriculumMapping[];
  prerequisites: string[];
  relatedResources: string[];
  nextResources: string[];
  engine: LessonEngineType;
  enginePreset?: LessonEnginePresetReference;
  activityFlow: ActivityBlock[];
  responseTypes: ResponseType[];
  feedbackMode: FeedbackMode;
  assessmentConfig?: AssessmentConfig;
  thumbnail: ThumbnailConfig;
  route: string;
  legacyRoutes: string[];
  contentStatus: ContentQualityStatus;
  interactionSpecificity: InteractionSpecificityStatus;
  review: {
    mathematical: ReviewStatus;
    pedagogical: ReviewStatus;
    visual: ReviewStatus;
    accessibility: ReviewStatus;
  };
};

export type VersionedEngineState = {
  version: number;
  engineType: LessonEngineType;
  payload: unknown;
};

export type EngineLearningEvent = {
  controlId: string;
  kind: LessonControlKind | InteractionFormat;
  before: unknown;
  after: unknown;
  affectedOutputs: string[];
  timestamp: number;
};

export type MountOptions = {
  readOnly?: boolean;
  focusMode?: boolean;
  reducedMotion?: boolean;
  initialStepId?: string;
  ariaLabel?: string;
};

export type LessonEnginePreset = {
  engineType: LessonEngineType;
  presetId: string;
  params?: Record<string, unknown>;
};

export type ConstructionValidationRule = {
  id: string;
  relation: string;
  tolerance?: number;
};

export type GraphValidationRule = {
  id: string;
  target: string;
  tolerance?: number;
};

export type CASEvaluationRequest = {
  expression: string;
  operation: "simplify" | "expand" | "factor" | "solve" | "differentiate" | "integrate";
  assumptions?: string[];
};

export type CASEvaluationResult = {
  exact?: string;
  approximate?: string;
  steps?: string[];
  warnings?: string[];
};

export type ValidationResult = {
  valid: boolean;
  score?: number;
  feedback: string;
};

export type ThumbnailState = {
  engineType: LessonEngineType;
  state: VersionedEngineState;
  description: string;
};

export type LessonEngineAdapter = {
  engineType: LessonEngineType;
  mount(container: HTMLElement, options: MountOptions): Promise<void>;
  loadPreset(preset: LessonEnginePreset): Promise<void>;
  reset(): Promise<void>;
  fitToView?(): Promise<void>;
  getState(): Promise<VersionedEngineState>;
  restoreState(state: VersionedEngineState): Promise<void>;
  subscribeToState?(listener: (event: EngineLearningEvent) => void): () => void;
  startAnimation?(animationId: string): Promise<void>;
  pauseAnimation?(): Promise<void>;
  seekAnimation?(progress: number): Promise<void>;
  validateConstruction?(rule: ConstructionValidationRule): Promise<ValidationResult>;
  validateGraph?(rule: GraphValidationRule): Promise<ValidationResult>;
  evaluateExpression?(request: CASEvaluationRequest): Promise<CASEvaluationResult>;
  captureThumbnailState?(): Promise<ThumbnailState>;
  enterFocusMode?(): Promise<void>;
  exitFocusMode?(): Promise<void>;
  dispose(): Promise<void>;
};

export type SharedLessonStateV1 = {
  version: 1;
  resourceId: string;
  conceptId: string;
  primaryType: PrimaryLearningType;
  currentStep: string;
  engineType: LessonEngineType;
  engineState: unknown;
  responseState?: unknown;
  viewMode: "lesson" | "focus";
};
