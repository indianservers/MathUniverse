import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import type { LessonAdapter, LessonAdapterProps } from "../types";

const adapters: Record<LessonAdapter, LazyExoticComponent<ComponentType<LessonAdapterProps>>> = {
  calculator: lazy(() => import("../adapters/CalculatorLessonAdapter")),
  algebra: lazy(() => import("../adapters/AlgebraLessonAdapter")),
  number: lazy(() => import("../adapters/NumberLessonAdapter")),
  authoring: lazy(() => import("../adapters/AuthoringLessonAdapter")),
  learning: lazy(() => import("../adapters/LearningLessonAdapter")),
  platform: lazy(() => import("../adapters/PlatformLessonAdapter")),
  graph: lazy(() => import("../adapters/GraphLessonAdapter")),
  "algebra-cas": lazy(() => import("../adapters/AlgebraCasLessonAdapter")),
  geometry2d: lazy(() => import("../adapters/Geometry2DLessonAdapter")),
  vector: lazy(() => import("../adapters/VectorLessonAdapter")),
  trigonometry: lazy(() => import("../adapters/TrigonometryLessonAdapter")),
  cas: lazy(() => import("../adapters/CasLessonAdapter")),
  calculus: lazy(() => import("../adapters/CalculusLessonAdapter")),
  spreadsheet: lazy(() => import("../adapters/SpreadsheetLessonAdapter")),
  statistics: lazy(() => import("../adapters/StatisticsLessonAdapter")),
  probability: lazy(() => import("../adapters/ProbabilityLessonAdapter")),
  inference: lazy(() => import("../adapters/InferenceLessonAdapter")),
  sequence: lazy(() => import("../adapters/SequenceLessonAdapter")),
  matrix: lazy(() => import("../adapters/MatrixLessonAdapter")),
  complex: lazy(() => import("../adapters/ComplexLessonAdapter")),
  geometry3d: lazy(() => import("../adapters/Geometry3DLessonAdapter")),
  discrete: lazy(() => import("../adapters/DiscreteLessonAdapter")),
  finance: lazy(() => import("../adapters/FinanceLessonAdapter")),
};

export default function LessonSurface(props: LessonAdapterProps) {
  const Adapter = adapters[props.lesson.adapter];
  return (
    <Suspense fallback={<div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950"><div className="h-9 w-9 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" aria-label="Loading lesson interaction" /></div>}>
      <Adapter {...props} />
    </Suspense>
  );
}
