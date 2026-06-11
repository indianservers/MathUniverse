import { evaluateDynamicWorkspace } from "./dynamicWorkspaceEngine";
import { objectsWithEngineMeasurements } from "./workspaceEngineBridge";
import type { MathObject } from "./types";

export function buildRuntimeWorkspaceObjects(objects: MathObject[]): MathObject[] {
  const evaluated = evaluateDynamicWorkspace(objects).objects;
  return sortRuntimeObjects(objectsWithEngineMeasurements(evaluated));
}

function sortRuntimeObjects(objects: MathObject[]) {
  return [...objects].sort((first, second) => {
    const firstDerived = first.metadata?.source === "engine-measurement" ? 1 : 0;
    const secondDerived = second.metadata?.source === "engine-measurement" ? 1 : 0;
    if (firstDerived !== secondDerived) return firstDerived - secondDerived;
    return second.updatedAt - first.updatedAt || first.label.localeCompare(second.label);
  });
}
