import type { MathObject } from "./types";

export type DependencyGraphNode = {
  id: string;
  label: string;
  parents: string[];
  children: string[];
};

export function buildDependencyGraph(objects: MathObject[]): DependencyGraphNode[] {
  const nodes = new Map<string, DependencyGraphNode>();

  objects.forEach((object) => {
    nodes.set(object.id, { id: object.id, label: object.label, parents: [], children: [] });
  });

  objects.forEach((object) => {
    object.dependencies?.forEach((dependency) => {
      if (!nodes.has(dependency.id)) {
        nodes.set(dependency.id, { id: dependency.id, label: dependency.label, parents: [], children: [] });
      }
      nodes.get(object.id)?.parents.push(dependency.id);
      nodes.get(dependency.id)?.children.push(object.id);
    });
  });

  return Array.from(nodes.values());
}

export function objectDependencyCount(object: MathObject) {
  return object.dependencies?.length ?? 0;
}

