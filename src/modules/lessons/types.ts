export type LessonAdapter =
  | "calculator"
  | "algebra"
  | "number"
  | "authoring"
  | "learning"
  | "platform"
  | "graph"
  | "algebra-cas"
  | "geometry2d"
  | "vector"
  | "trigonometry"
  | "cas"
  | "calculus"
  | "spreadsheet"
  | "statistics"
  | "probability"
  | "inference"
  | "sequence"
  | "matrix"
  | "complex"
  | "geometry3d"
  | "discrete"
  | "finance";

export type LessonPriority = "P0" | "P1" | "P2";

export type LessonControlKind =
  | "drag"
  | "slider"
  | "input"
  | "toggle"
  | "selection"
  | "tool"
  | "playback"
  | "data-edit"
  | "keyboard";

export type LessonInteractionContract = {
  concept: string;
  requiredControls: LessonControlKind[];
  requiredControlIds: string[];
  observableOutputs: string[];
  requiredRepresentations: string[];
  requiredInteractionVerbs: string[];
  challengeFactory: string;
  workspaceObjects: string[];
  keyboardAlternative: string;
  screenReaderSummary: string;
  resetAssertions: string[];
};

export type LessonPresetResolution = {
  id: string;
  conceptFamily: string;
  adapter: LessonAdapter;
  specificity: "lesson" | "concept" | "family";
};

export type LessonInteractionEvent = {
  controlId: string;
  kind: LessonControlKind;
  timestamp: number;
  before: unknown;
  after: unknown;
  affectedOutputs: string[];
};

export type LessonDefinition = {
  id: number;
  phase: 1 | 2 | 3 | 4;
  slug: string;
  categorySlug: string;
  route: string;
  category: string;
  topic: string;
  title: string;
  purpose: string;
  description: string;
  workspace: string;
  interactions: string;
  outcome: string;
  mode: string;
  level: string;
  feature: string;
  priority: LessonPriority;
  notes: string | null;
  adapter: LessonAdapter;
  preset: LessonPresetResolution;
  contract: LessonInteractionContract;
};

export type LessonSourceDefinition = Omit<LessonDefinition, "preset" | "contract">;

export type LessonStage = "discover" | "explore" | "try" | "check";

export type LessonProgress = {
  stage: LessonStage;
  prediction: string;
  answer: string;
  completed: boolean;
  seed: number;
  interactionHistory: LessonInteractionEvent[];
  updatedAt: number;
};

export type LessonAdapterProps = {
  lesson: LessonDefinition;
  resetToken: number;
  onInteraction: (event?: LessonInteractionEvent) => void;
};
