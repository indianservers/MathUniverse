import type { BoardActionType } from "./types";

export type SmartBoardSubject =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "english"
  | "biology"
  | "mixed"
  | "unknown";

export type SmartBoardConfidenceLevel =
  | "high"
  | "review-recommended"
  | "needs-confirmation"
  | "unresolved";

export type SmartBoardIntelligenceMode =
  | "manual"
  | "assistive"
  | "guided-learning"
  | "fast-solve"
  | "exploration";

export type SmartBoardGoalType =
  | "recognize"
  | "understand"
  | "solve"
  | "simplify"
  | "verify"
  | "learn"
  | "practice"
  | "visualize"
  | "graph"
  | "compare"
  | "derive"
  | "explain"
  | "correct"
  | "complete-work"
  | "analyze-data"
  | "convert-units"
  | "check-dimensions"
  | "balance-equation"
  | "check-grammar"
  | "review-labels"
  | "create-example"
  | "prepare-exam-answer"
  | "unknown";

export type SmartBoardGoal = {
  type: SmartBoardGoalType;
  primarySubject?: SmartBoardSubject;
  supportingSubjects: SmartBoardSubject[];
  targetElementIds: string[];
  confidence: SmartBoardConfidenceLevel;
  evidence: Array<{ source: "command" | "selection" | "content" | "history"; detail: string }>;
  missingInformation: Array<{ field: string; reason: string }>;
  userConfirmed: boolean;
};

export type SmartBoardCapability =
  | BoardActionType
  | "inspect-selection"
  | "inspect-problem"
  | "inspect-relationships"
  | "insert-explanation"
  | "create-relationship"
  | "request-clarification"
  | "open-unit-converter"
  | "check-grammar"
  | "balance-equation"
  | "review-labels"
  | "create-practice";

export type SmartBoardContextElement = {
  id: string;
  type: string;
  content: string;
  subject: SmartBoardSubject;
  order: number;
  recognitionConfidence?: number;
  recognitionStatus?: "confirmed" | "recognized" | "unrecognized";
  verificationStatus?: string;
  sourceElementIds: string[];
  untrusted: true;
};

export type SmartBoardContextMetrics = {
  elementCount: number;
  relationshipCount: number;
  estimatedTokens: number;
  croppedVisualCount: number;
  omittedElementCount: number;
  buildDurationMs: number;
};

export type SmartBoardAmbiguity = {
  id: string;
  subject?: SmartBoardSubject;
  type:
    | "character"
    | "operator"
    | "variable"
    | "unit"
    | "formula"
    | "subject"
    | "concept"
    | "grouping"
    | "diagram"
    | "label"
    | "text-recognition"
    | "ownership";
  description: string;
  candidates: Array<{ label: string; value: unknown }>;
  requiresResolution: boolean;
  sourceElementIds: string[];
  resolvedValue?: unknown;
  resolvedByUser: boolean;
};

export type SmartBoardServiceAvailability = {
  ai: boolean;
  recognition: boolean;
  cas: boolean;
  graph2d: boolean;
  graph3d: boolean;
  geometry: boolean;
  statistics: boolean;
  physicsUnits: boolean;
  chemistry: boolean;
  english: boolean;
  biology: boolean;
};

export type SmartBoardIntelligenceContext = {
  boardId: string;
  boardSubjectMode: SmartBoardSubject;
  primarySubject?: SmartBoardSubject;
  supportingSubjects: SmartBoardSubject[];
  selectedElementIds: string[];
  activeProblemId?: string;
  activeWorkflowId?: string;
  currentGoal?: SmartBoardGoal;
  elements: SmartBoardContextElement[];
  relationships: Array<{ id: string; type: string; sourceElementId: string; targetElementId: string }>;
  recentActions: Array<{ id: string; actionType: string; sourceElementId: string; resultElementId: string; cancelled: boolean }>;
  pendingAmbiguities: SmartBoardAmbiguity[];
  availableCapabilities: SmartBoardCapability[];
  serviceAvailability: SmartBoardServiceAvailability;
  clientCapabilities: { online: boolean; pointer: boolean; touch: boolean; camera: boolean };
  contextVersion: number;
  metrics: SmartBoardContextMetrics;
  omittedElementIds: string[];
};

export type SmartBoardProblemStage =
  | "capturing"
  | "recognizing"
  | "understanding"
  | "planning"
  | "solving"
  | "verifying"
  | "visualizing"
  | "explaining"
  | "completed"
  | "blocked";

export type SmartBoardProblemState = {
  id: string;
  primarySubject: SmartBoardSubject;
  supportingSubjects: SmartBoardSubject[];
  problemElementIds: string[];
  goal?: SmartBoardGoal;
  knownFacts: Array<{ label: string; value: string; sourceElementId?: string }>;
  unknownFacts: Array<{ label: string; reason: string }>;
  attemptedStepIds: string[];
  verifiedStepIds: string[];
  firstInvalidStepId?: string;
  currentStage: SmartBoardProblemStage;
  selectedMethod?: string;
  assumptions: string[];
  warnings: string[];
  completionStatus: "not-started" | "in-progress" | "blocked" | "partially-complete" | "complete";
};

export type SmartBoardRecommendation = {
  id: string;
  action: SmartBoardCapability;
  boardActionType?: BoardActionType;
  category: "continue" | "solve" | "verify" | "learn" | "visualize" | "explore" | "correct" | "practice" | "convert" | "compare";
  title: string;
  reason: string;
  subject: SmartBoardSubject;
  priority: number;
  confidence: SmartBoardConfidenceLevel;
  score: {
    goalMatch: number;
    subjectMatch: number;
    conceptMatch: number;
    prerequisiteFit: number;
    learningValue: number;
    engineAvailability: number;
    duplicatePenalty: number;
    ambiguityPenalty: number;
    userPreferenceFit: number;
    total: number;
  };
  sourceElementIds: string[];
  requiredConfirmation: boolean;
  expectedOutcome?: string;
  engine?: { id: string; label: string; localOrRemote: "local" | "remote" | "hybrid" };
  enabled: boolean;
  disabledReason?: string;
};

export type SmartBoardUnderstandingResult = {
  primarySubject?: SmartBoardSubject;
  supportingSubjects: SmartBoardSubject[];
  subjectConfidence: SmartBoardConfidenceLevel;
  detectedConcepts: Array<{ id: string; label: string; confidence: SmartBoardConfidenceLevel }>;
  activeProblem?: SmartBoardProblemState;
  inferredGoal?: SmartBoardGoal;
  knownFacts: Array<{ label: string; value: string; sourceElementId?: string }>;
  unknownFacts: Array<{ label: string; reason: string }>;
  ambiguities: SmartBoardAmbiguity[];
  recommendations: SmartBoardRecommendation[];
  warnings: string[];
  contextMetrics: SmartBoardContextMetrics;
  intelligenceMode: "full" | "deterministic" | "partial" | "basic";
};

export type SmartBoardWorkflowStep = {
  id: string;
  order: number;
  type: "confirm" | "analyze" | "calculate" | "verify" | "visualize" | "explain" | "open-module";
  title: string;
  description?: string;
  toolId?: string;
  boardActionType?: BoardActionType;
  inputElementIds: string[];
  dependsOnStepIds: string[];
  status: "pending" | "approved" | "running" | "success" | "failed" | "cancelled" | "skipped";
  requiresConfirmation: boolean;
  permissionClass: "read-only" | "reversible-write" | "sensitive";
  canRetry: boolean;
  canSkip: boolean;
  parameters?: Record<string, unknown>;
  error?: string;
};

export type SmartBoardWorkflowPlan = {
  id: string;
  title: string;
  goal: SmartBoardGoal;
  primarySubject: SmartBoardSubject;
  supportingSubjects: SmartBoardSubject[];
  steps: SmartBoardWorkflowStep[];
  requiresUserApproval: boolean;
  requiredCapabilities: SmartBoardCapability[];
  warnings: string[];
  createdAt: string;
  status: "draft" | "approved" | "running" | "paused" | "completed" | "cancelled" | "failed";
};

export type SmartBoardSessionMemory = {
  boardId: string;
  activeProblemId?: string;
  activeWorkflowId?: string;
  resolvedAmbiguities: Record<string, unknown>;
  completedActionIds: string[];
  dismissedRecommendationIds: string[];
  snoozedRecommendationIds: string[];
  hiddenRecommendationCategories: string[];
  shownHintLevels: Record<string, number>;
  selectedMethods: Record<string, string>;
  recentGraphSettings?: { xMin: number; xMax: number; yMin: number; yMax: number };
  userPreferences: {
    intelligenceMode: SmartBoardIntelligenceMode;
    explanationMode: "one-line" | "brief" | "standard" | "detailed" | "visual-first" | "formula-first" | "exam-style" | "conceptual" | "step-by-step";
    proactiveRecommendations: boolean;
    stablePauseMs: number;
  };
  updatedAt: string;
};

export type BoardIntelligencePersistence = {
  sessionMemory: SmartBoardSessionMemory;
  activeProblem?: SmartBoardProblemState;
  activeWorkflow?: SmartBoardWorkflowPlan;
  recommendationsDisabled: boolean;
};

export type SmartBoardToolDefinition = {
  id: string;
  subject?: SmartBoardSubject;
  capability: SmartBoardCapability;
  description: string;
  inputSchema: { required: string[]; maxExpressionLength?: number };
  outputSchema: { type: "object" };
  permissionClass: "read-only" | "reversible-write" | "sensitive";
  requiresUserConfirmation: boolean;
  availableOffline: boolean;
};

export type SmartBoardToolCall = {
  id: string;
  toolId: string;
  arguments: Record<string, unknown>;
  sourceElementIds: string[];
  userConfirmed: boolean;
};

export type SmartBoardToolResult = {
  callId: string;
  status: "success" | "failed" | "cancelled" | "unsupported";
  output?: unknown;
  verificationStatus?: SmartBoardVerificationStatus;
  error?: SmartBoardIntelligenceError;
};

export type SmartBoardVerificationStatus =
  | "verified"
  | "verified-with-conditions"
  | "numerically-verified"
  | "rule-verified"
  | "model-reference-verified"
  | "partially-verified"
  | "ai-only"
  | "inconclusive"
  | "unsupported"
  | "failed";

export type SmartBoardIntelligenceErrorCode =
  | "CONTEXT_BUILD_FAILED"
  | "AMBIGUOUS_SELECTION"
  | "SUBJECT_UNRESOLVED"
  | "CONCEPT_UNRESOLVED"
  | "CAPABILITY_UNAVAILABLE"
  | "ENGINE_UNAVAILABLE"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "INVALID_TOOL_CALL"
  | "TOOL_PERMISSION_DENIED"
  | "VERIFICATION_INCONCLUSIVE"
  | "WORKFLOW_DEPENDENCY_FAILED"
  | "WORKFLOW_CANCELLED"
  | "CONTEXT_LIMIT_EXCEEDED"
  | "PROMPT_INJECTION_DETECTED"
  | "CANCELLED"
  | "UNKNOWN";

export type SmartBoardIntelligenceError = {
  code: SmartBoardIntelligenceErrorCode;
  userMessage: string;
  recoverable: boolean;
  retryable: boolean;
  suggestedAction?: string;
  details?: Record<string, unknown>;
};
