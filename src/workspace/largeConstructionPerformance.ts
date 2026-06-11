import { createObjectFromDefinition, evaluateDynamicWorkspace } from "./dynamicWorkspaceEngine";
import { buildConstructionProtocol } from "./constructionProtocol";
import { exportIsmobj } from "./ismobjExchange";
import type { MathObject, WorkspaceProjectMeta, WorkspaceSnapshot } from "./types";

export type LargeConstructionBenchmark = {
  objectCount: number;
  dependencyCount: number;
  timings: {
    generateMs: number;
    evaluateMs: number;
    protocolMs: number;
    exportMs: number;
    totalMs: number;
  };
  passed: boolean;
  budgetMs: number;
};

export function generateLargeConstruction(size: number): MathObject[] {
  const safeSize = Math.max(2, Math.min(10000, Math.round(size)));
  const objects: MathObject[] = [];
  let previousPoint: MathObject | undefined;
  for (let index = 0; index < safeSize; index += 1) {
    const currentPoint = createObjectFromDefinition(`P${index}=(${index % 100}, ${Math.floor(index / 100)})`, objects);
    objects.push(currentPoint);
    if (previousPoint) {
      const segment = createObjectFromDefinition(`s${index}=Segment[P${index - 1},P${index}]`, objects);
      objects.push({
        ...segment,
        dependencies: [previousPoint, currentPoint].map((object) => ({ id: object.id, label: object.label, role: "parent" })),
        definition: {
          ...segment.definition!,
          parentIds: [previousPoint.id, currentPoint.id],
        },
      });
    }
    previousPoint = currentPoint;
  }
  return objects;
}

export function runLargeConstructionBenchmark(size = 1000, budgetMs = 750): LargeConstructionBenchmark {
  const start = now();
  const generated = generateLargeConstruction(size);
  const afterGenerate = now();
  const evaluated = evaluateDynamicWorkspace(generated);
  const afterEvaluate = now();
  const protocol = buildConstructionProtocol(evaluated.objects);
  const afterProtocol = now();
  exportIsmobj(snapshotForBenchmark(evaluated.objects));
  const afterExport = now();
  const totalMs = afterExport - start;
  return {
    objectCount: evaluated.objects.length,
    dependencyCount: evaluated.objects.reduce((sum, object) => sum + (object.dependencies?.length ?? 0), 0),
    timings: {
      generateMs: round(afterGenerate - start),
      evaluateMs: round(afterEvaluate - afterGenerate),
      protocolMs: round(afterProtocol - afterEvaluate),
      exportMs: round(afterExport - afterProtocol),
      totalMs: round(totalMs),
    },
    passed: totalMs <= budgetMs && protocol.steps.length === evaluated.objects.length,
    budgetMs,
  };
}

function snapshotForBenchmark(objects: MathObject[]): WorkspaceSnapshot {
  const project: WorkspaceProjectMeta = {
    id: "large-construction-benchmark",
    title: "Large Construction Benchmark",
    description: "Synthetic construction used to test dynamic object performance.",
    updatedAt: Date.now(),
    schemaVersion: 2,
  };
  return { project, objects, scenes: [], selectedObjectId: null, selectedObjectIds: [] };
}

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
