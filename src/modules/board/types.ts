import type { BoardIntelligencePersistence } from "./boardIntelligenceTypes";

export type BoardTool = "pen" | "highlighter" | "eraser" | "select" | "lasso" | "pan";
export type BoardBackground = "grid" | "dots" | "plain" | "ruled";

export type BoardPoint = {
  x: number;
  y: number;
  pressure: number;
  time: number;
};

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoardViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type StrokeElement = {
  id: string;
  type: "stroke";
  points: BoardPoint[];
  tool: "pen" | "highlighter";
  width: number;
  opacity: number;
  color: string;
  bounds: BoundingBox;
  createdAt: string;
  groupId?: string;
};

export type MathExpressionElement = {
  id: string;
  type: "math-expression";
  latex: string;
  normalizedExpression?: string;
  sourceStrokeIds: string[];
  recognitionConfidence?: number;
  bounds: BoundingBox;
  createdAt: string;
};

export type TextElement = {
  id: string;
  type: "text";
  text: string;
  bounds: BoundingBox;
  createdAt: string;
};

export type ShapeElement = {
  id: string;
  type: "shape";
  shape: "rectangle" | "ellipse" | "line";
  bounds: BoundingBox;
  createdAt: string;
};

export type BoardMathClassification =
  | "numeric"
  | "arithmetic"
  | "algebraic-expression"
  | "equation"
  | "system-of-equations"
  | "inequality"
  | "function"
  | "derivative"
  | "integral"
  | "limit"
  | "matrix"
  | "vector"
  | "coordinate"
  | "geometry"
  | "data-series"
  | "statistics"
  | "unknown";

export type BoardActionType =
  | "evaluate"
  | "simplify"
  | "factor"
  | "expand"
  | "solve"
  | "solve-system"
  | "solve-inequality"
  | "find-roots"
  | "differentiate"
  | "integrate"
  | "evaluate-limit"
  | "matrix-operation"
  | "plot-2d"
  | "plot-implicit"
  | "plot-3d"
  | "table-of-values"
  | "statistics"
  | "geometry"
  | "verify";

export type BoardMathAmbiguity = {
  id: string;
  type: "character" | "operator" | "variable" | "function" | "grouping" | "bounds" | "matrix-layout" | "dataset-layout" | "coordinate-system";
  description: string;
  candidates: Array<{ label: string; latex?: string; value?: unknown }>;
  requiresResolution: boolean;
};

export type BoardSuggestedAction = {
  id: string;
  type: BoardActionType;
  label: string;
  description?: string;
  priority: number;
  engineAdapter: "cas" | "graph-2d" | "graph-3d" | "geometry" | "statistics" | "verification";
  enabled: boolean;
  disabledReason?: string;
  defaultParameters?: Record<string, unknown>;
};

export type BoardMathAnalysis = {
  rawLatex: string;
  normalizedLatex: string;
  engineExpression: string;
  classification: BoardMathClassification;
  variables: string[];
  dependentVariables?: string[];
  independentVariables?: string[];
  detectedStructures: string[];
  suggestedActions: BoardSuggestedAction[];
  ambiguities: BoardMathAmbiguity[];
  warnings: string[];
  metadata?: {
    degree?: number;
    dimensions?: number[];
    hasBounds?: boolean;
    hasMultipleEquations?: boolean;
    isExplicitFunction?: boolean;
    isImplicitFunction?: boolean;
  };
};

export type BoardSolutionStep = {
  id: string;
  index: number;
  title?: string;
  rule?: string;
  inputLatex?: string;
  outputLatex?: string;
  explanation?: string;
};

export type BoardGraphConfiguration = {
  mode: "explicit" | "implicit" | "surface" | "data";
  expression: string;
  series?: Array<{
    id: string;
    label: string;
    color: string;
    visible: boolean;
    points: Array<{ x: number; y: number | null; valid: boolean }>;
  }>;
  view?: { xMin: number; xMax: number; yMin: number; yMax: number };
  table?: Array<{ x: number; y: number | null; valid: boolean }>;
  workspaceRoute: string;
  accessibilitySummary: string;
};

export type BoardEngineErrorCode =
  | "INVALID_EXPRESSION"
  | "UNSUPPORTED_OPERATION"
  | "ENGINE_UNAVAILABLE"
  | "TIMEOUT"
  | "DOMAIN_ERROR"
  | "DIVISION_BY_ZERO"
  | "NO_SOLUTION"
  | "INFINITE_SOLUTIONS"
  | "NON_CONVERGENT"
  | "SINGULAR_MATRIX"
  | "PARSING_ERROR"
  | "CANCELLED"
  | "UNKNOWN";

export type BoardEngineError = {
  code: BoardEngineErrorCode;
  message: string;
  userMessage: string;
  recoverable: boolean;
  suggestedAction?: string;
};

export type BoardResultElement = {
  id: string;
  type: "math-result";
  actionType: BoardActionType;
  sourceElementIds: string[];
  title: string;
  status: "loading" | "success" | "error" | "cancelled";
  inputLatex: string;
  normalizedInput?: string;
  exactOutputLatex?: string;
  approximateOutput?: string;
  plainTextOutput?: string;
  steps?: BoardSolutionStep[];
  assumptions?: string[];
  warnings?: string[];
  error?: BoardEngineError;
  engine: { adapter: string; underlyingEngine?: string; version?: string };
  parameters?: Record<string, unknown>;
  graph?: BoardGraphConfiguration;
  workspaceRoute?: string;
  collapsed: boolean;
  bounds: BoundingBox;
  createdAt: string;
  updatedAt: string;
};

export type BoardSolutionStepElement = {
  id: string;
  type: "solution-step";
  sequenceId: string;
  order: number;
  latex: string;
  normalizedExpression?: string;
  sourceStrokeIds: string[];
  recognitionConfidence?: number;
  verificationStatus?: "valid" | "invalid" | "ambiguous" | "unverified";
  verificationExplanation?: string;
  bounds: BoundingBox;
  createdAt: string;
};

export type BoardRecognitionRegion = {
  id: string;
  imageElementId: string;
  bounds: BoundingBox;
  regionType: "single-expression" | "solution-sequence" | "system-of-equations" | "matrix" | "dataset" | "table" | "geometry-diagram" | "graph" | "text" | "unknown";
  readingOrder?: number;
  selected: boolean;
  recognitionStatus: "idle" | "processing" | "success" | "error";
  recognizedLatex?: string;
  recognizedText?: string;
  confidence?: number;
  alternatives?: string[];
};

export type BoardImageElement = {
  id: string;
  type: "image";
  source: "upload" | "camera" | "clipboard" | "screenshot";
  localAssetId?: string;
  dataUrl?: string;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  recognitionRegions: BoardRecognitionRegion[];
  bounds: BoundingBox;
  createdAt: string;
};

export type BoardExplanationElement = {
  id: string;
  type: "explanation";
  title: string;
  text: string;
  sourceElementIds: string[];
  verified: boolean;
  bounds: BoundingBox;
  createdAt: string;
};

export type BoardSolutionSequence = {
  id: string;
  sourceStrokeIds: string[];
  orderedStepIds: string[];
  problemElementId?: string;
  finalAnswerElementId?: string;
  orientation: "vertical" | "horizontal" | "mixed";
  recognitionConfidence?: number;
};

export type BoardMisconception = {
  id: string;
  code: string;
  title: string;
  description: string;
  confidence: number;
  evidenceStepIds: string[];
  correctiveHint?: string;
  exampleLatex?: string;
  conceptId?: string;
};

export type BoardWorkVerificationResult = {
  sequenceId: string;
  overallStatus: "correct" | "partially-correct" | "incorrect" | "ambiguous" | "incomplete";
  verifiedSteps: Array<{
    stepId: string;
    status: "valid" | "invalid" | "ambiguous" | "unverified";
    previousStepId?: string;
    ruleApplied?: string;
    explanation?: string;
    conditions?: string[];
    recognitionIssue?: boolean;
  }>;
  firstInvalidStepId?: string;
  finalAnswerStatus: "correct" | "incorrect" | "not-reached" | "not-applicable" | "ambiguous";
  expectedResultLatex?: string;
  misconceptions?: BoardMisconception[];
  warnings?: string[];
};

export type BoardTutorMode = "hint" | "next-step" | "full-solution" | "concept" | "visual" | "check-work" | "find-mistake" | "alternative" | "exam" | "concise" | "detailed" | "similar-problem" | "question";

export type BoardTutorMessage = {
  id: string;
  role: "user" | "tutor";
  mode: BoardTutorMode;
  text: string;
  referencedElementIds: string[];
  verified: boolean;
  verificationMethod?: string;
  createdAt: string;
};

export type BoardAutomaticRecognitionSettings = {
  mode: "manual" | "suggest" | "automatic";
  pauseMs: number;
  minimumStrokeCount: number;
  disabledForSession: boolean;
  lastFingerprint?: string;
};

export type BoardRelationship = {
  id: string;
  type: "recognized-as" | "derived-from" | "solves" | "graphs" | "verifies" | "visualizes" | "uses-result-of" | "explains" | "corrects" | "alternative-to" | "next-step-of" | "part-of-sequence" | "detected-from-image" | "suggested-by-tutor";
  sourceElementId: string;
  targetElementId: string;
  createdAt: string;
};

export type BoardActionHistoryEntry = {
  id: string;
  actionType: BoardActionType;
  sourceElementId: string;
  resultElementId: string;
  inputExpression: string;
  normalizedExpression: string;
  parameters: Record<string, unknown>;
  engineAdapter: string;
  underlyingEngine: string;
  startedAt: string;
  completedAt?: string;
  result?: string;
  warnings?: string[];
  error?: BoardEngineError;
  cancelled: boolean;
};

export type BoardElement = StrokeElement | MathExpressionElement | TextElement | ShapeElement | BoardResultElement | BoardSolutionStepElement | BoardImageElement | BoardExplanationElement;

export type BoardDocument = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  viewport: BoardViewport;
  background: BoardBackground;
  snapToGrid: boolean;
  elements: BoardElement[];
  relationships: BoardRelationship[];
  actionHistory: BoardActionHistoryEntry[];
  solutionSequences: BoardSolutionSequence[];
  tutorMessages: BoardTutorMessage[];
  automaticRecognition: BoardAutomaticRecognitionSettings;
  intelligence: BoardIntelligencePersistence;
};

export type SerializedBoardDocument = {
  schemaVersion: number;
  document: BoardDocument;
};

export type RecognitionAlternative = {
  latex: string;
  confidence?: number;
};

export type MathRecognitionResult = {
  latex: string;
  normalizedExpression?: string;
  plainText?: string;
  confidence?: number;
  alternatives?: RecognitionAlternative[];
  detectedType?:
    | "arithmetic"
    | "algebra"
    | "equation"
    | "inequality"
    | "function"
    | "derivative"
    | "integral"
    | "limit"
    | "matrix"
    | "statistics"
    | "geometry"
    | "unknown";
  warnings?: string[];
};
