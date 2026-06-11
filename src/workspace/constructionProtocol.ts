import { buildDependencyGraph } from "./dependencyGraph";
import type { MathObject, WorkspaceSnapshot } from "./types";

export type ProtocolAction = "create" | "update" | "delete" | "measure" | "style" | "transform" | "command" | "import";

export type ConstructionProtocolStep = {
  id: string;
  index: number;
  objectId: string;
  objectLabel: string;
  action: ProtocolAction;
  command?: string;
  definition?: string;
  dependencies: string[];
  dependents: string[];
  visible: boolean;
  pinned: boolean;
  timestamp: number;
  snapshot?: Pick<WorkspaceSnapshot, "objects" | "scenes" | "selectedObjectId" | "selectedObjectIds">;
};

export type ConstructionProtocol = {
  schema: "math-universe.construction-protocol";
  version: 1;
  steps: ConstructionProtocolStep[];
  cursor: number;
};

export function buildConstructionProtocol(objects: MathObject[], options: { includeSnapshots?: boolean; previous?: ConstructionProtocol } = {}): ConstructionProtocol {
  const graph = new Map(buildDependencyGraph(objects).map((node) => [node.id, node]));
  const previousByObject = new Map(options.previous?.steps.map((step) => [step.objectId, step]));
  const ordered = dependencyOrder(objects);
  const steps = ordered.map((object, index) => {
    const previous = previousByObject.get(object.id);
    return {
      id: previous?.id ?? `protocol-${object.id}`,
      index,
      objectId: object.id,
      objectLabel: object.label,
      action: previous?.action ?? (object.definition?.command ? "command" : "create"),
      command: object.definition?.command,
      definition: object.definition?.source ?? object.value,
      dependencies: graph.get(object.id)?.parents ?? [],
      dependents: graph.get(object.id)?.children ?? [],
      visible: previous?.visible ?? object.visible,
      pinned: previous?.pinned ?? false,
      timestamp: previous?.timestamp ?? object.createdAt,
      snapshot: options.includeSnapshots ? previous?.snapshot : undefined,
    } satisfies ConstructionProtocolStep;
  });
  return {
    schema: "math-universe.construction-protocol",
    version: 1,
    steps,
    cursor: Math.max(0, steps.length - 1),
  };
}

export function replayProtocol(protocol: ConstructionProtocol, cursor = protocol.cursor) {
  const visibleIds = new Set(protocol.steps.filter((step) => step.index <= cursor && step.visible).map((step) => step.objectId));
  const hiddenIds = new Set(protocol.steps.filter((step) => step.index > cursor || !step.visible).map((step) => step.objectId));
  return { visibleIds, hiddenIds, replayLabels: protocol.steps.filter((step) => step.index <= cursor).map((step) => `${step.index + 1}. ${step.objectLabel}`) };
}

export function setProtocolStepVisibility(protocol: ConstructionProtocol, stepId: string, visible: boolean): ConstructionProtocol {
  return { ...protocol, steps: protocol.steps.map((step) => step.id === stepId ? { ...step, visible } : step) };
}

export function pinProtocolStep(protocol: ConstructionProtocol, stepId: string, pinned: boolean): ConstructionProtocol {
  return { ...protocol, steps: protocol.steps.map((step) => step.id === stepId ? { ...step, pinned } : step) };
}

export function reorderProtocolStep(protocol: ConstructionProtocol, stepId: string, targetIndex: number): ConstructionProtocol {
  const steps = [...protocol.steps].sort((a, b) => a.index - b.index);
  const currentIndex = steps.findIndex((step) => step.id === stepId);
  if (currentIndex < 0) return protocol;
  const [step] = steps.splice(currentIndex, 1);
  steps.splice(Math.max(0, Math.min(targetIndex, steps.length)), 0, step);
  const indexed = steps.map((item, index) => ({ ...item, index }));
  const invalid = invalidProtocolReorders(indexed);
  if (invalid.length) return protocol;
  return { ...protocol, steps: indexed, cursor: Math.min(protocol.cursor, indexed.length - 1) };
}

export function invalidProtocolReorders(steps: ConstructionProtocolStep[]) {
  const indexByObject = new Map(steps.map((step) => [step.objectId, step.index]));
  return steps.flatMap((step) => step.dependencies
    .filter((dependency) => (indexByObject.get(dependency) ?? -1) > step.index)
    .map((dependency) => `${step.objectLabel} appears before dependency ${dependency}.`));
}

export function serializeProtocol(protocol: ConstructionProtocol) {
  return JSON.stringify(protocol, null, 2);
}

export function parseConstructionProtocol(json: string): ConstructionProtocol {
  const parsed = JSON.parse(json) as ConstructionProtocol;
  if (parsed.schema !== "math-universe.construction-protocol" || parsed.version !== 1 || !Array.isArray(parsed.steps)) {
    throw new Error("Unsupported construction protocol file.");
  }
  return { ...parsed, cursor: Math.max(0, Math.min(parsed.cursor ?? parsed.steps.length - 1, parsed.steps.length - 1)) };
}

function dependencyOrder(objects: MathObject[]) {
  const byId = new Map(objects.map((object) => [object.id, object]));
  const visited = new Set<string>();
  const output: MathObject[] = [];
  const visit = (object: MathObject) => {
    if (visited.has(object.id)) return;
    visited.add(object.id);
    object.dependencies?.forEach((dependency) => {
      const parent = byId.get(dependency.id);
      if (parent) visit(parent);
    });
    output.push(object);
  };
  objects.forEach(visit);
  return output;
}
