import { evaluateDynamicWorkspace, type DynamicDiagnostic } from "./dynamicWorkspaceEngine";
import { objectsWithEngineMeasurements } from "./workspaceEngineBridge";
import type { MathObject } from "./types";

export function buildRuntimeWorkspaceObjects(objects: MathObject[]): MathObject[] {
  return buildRuntimeWorkspace(objects).objects;
}

export type RuntimeWorkspaceBuild = {
  objects: MathObject[];
  diagnostics: DynamicDiagnostic[];
  stats: {
    inputObjects: number;
    runtimeObjects: number;
    derivedMeasurements: number;
    errors: number;
    warnings: number;
  };
};

/** Builds one validated model for CAS, graphing, tables, Geometry, 3D, and exports. */
export function buildRuntimeWorkspace(objects: MathObject[]): RuntimeWorkspaceBuild {
  const evaluated = evaluateDynamicWorkspace(objects);
  const runtimeObjects = sortRuntimeObjects(objectsWithEngineMeasurements(evaluated.objects));
  return {
    objects: runtimeObjects,
    diagnostics: evaluated.diagnostics,
    stats: {
      inputObjects: objects.length,
      runtimeObjects: runtimeObjects.length,
      derivedMeasurements: runtimeObjects.filter((object) => object.metadata?.source === "engine-measurement").length,
      errors: evaluated.diagnostics.filter((diagnostic) => diagnostic.severity === "error").length,
      warnings: evaluated.diagnostics.filter((diagnostic) => diagnostic.severity === "warning").length,
    },
  };
}

function sortRuntimeObjects(objects: MathObject[]) {
  return [...objects].sort((first, second) => {
    const firstDerived = first.metadata?.source === "engine-measurement" ? 1 : 0;
    const secondDerived = second.metadata?.source === "engine-measurement" ? 1 : 0;
    if (firstDerived !== secondDerived) return firstDerived - secondDerived;
    return second.updatedAt - first.updatedAt || first.label.localeCompare(second.label);
  });
}
