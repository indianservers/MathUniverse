import type { LessonAdapter } from "../types";

export type LessonVisualEngine =
  | "graph-2d"
  | "graph-3d"
  | "geometry-2d"
  | "geometry-3d"
  | "cas-data"
  | "none";

export type LessonVisualPresetStatus =
  | "planned"
  | "drafted"
  | "implemented"
  | "browser-tested"
  | "release-ready";

export type Graph2DVisualPreset = {
  engine: "graph-2d";
  expression: string;
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number };
  draggableParameters: Array<{ id: string; label: string; value: number; min: number; max: number; step: number }>;
  highlights: string[];
  outputs: string[];
};

export type Graph3DVisualPreset = {
  engine: "graph-3d";
  surface: string;
  domain: { uMin: number; uMax: number; vMin: number; vMax: number };
  draggableParameters: Array<{ id: string; label: string; value: number; min: number; max: number; step: number }>;
  highlights: string[];
  outputs: string[];
};

export type Geometry2DVisualPreset = {
  engine: "geometry-2d";
  construction: string;
  movableObjects: string[];
  fixedObjects: string[];
  invariantMeasurements: string[];
  validationRules: string[];
};

export type Geometry3DVisualPreset = {
  engine: "geometry-3d";
  solidOrScene: string;
  movableObjects: string[];
  fixedObjects: string[];
  measurements: string[];
  validationRules: string[];
};

export type CasDataVisualPreset = {
  engine: "cas-data";
  expression: string;
  operation: "simplify" | "expand" | "factor" | "solve" | "differentiate" | "integrate" | "data-analysis";
  assumptions: string[];
  expectedOutputs: string[];
  approximationPolicy: "exact-only" | "label-approximation" | "numeric-experiment";
};

export type LessonVisualPreset =
  | Graph2DVisualPreset
  | Graph3DVisualPreset
  | Geometry2DVisualPreset
  | Geometry3DVisualPreset
  | CasDataVisualPreset;

export type LessonVisualPresetRecord = {
  lessonId: number;
  route: string;
  adapter: LessonAdapter | "school" | "advanced";
  topic: string;
  title: string;
  status: LessonVisualPresetStatus;
  batchId: string;
  conceptId: string;
  visualGoal: string;
  preset: LessonVisualPreset;
  qa: {
    routeSmokeTest: boolean;
    browserVisualCheck: boolean;
    mathReview: boolean;
    accessibilityReview: boolean;
  };
  notes: string[];
};

export const lessonVisualPresets: readonly LessonVisualPresetRecord[] = [];

export function visualPresetForLesson(lessonId: number) {
  return lessonVisualPresets.find((preset) => preset.lessonId === lessonId) ?? null;
}

export function visualPresetsForBatch(batchId: string) {
  return lessonVisualPresets.filter((preset) => preset.batchId === batchId);
}
