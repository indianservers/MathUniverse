export type DynamicObjectKind =
  | "function"
  | "point"
  | "line"
  | "segment"
  | "ray"
  | "vector"
  | "circle"
  | "conic"
  | "polygon"
  | "arc"
  | "locus"
  | "slider"
  | "surface"
  | "solid"
  | "plane3d"
  | "measurement"
  | "text"
  | "image"
  | "matrix"
  | "table";

export type DynamicObjectDefinition = {
  id: string;
  name: string;
  kind: DynamicObjectKind;
  definition: string;
  visible?: boolean;
  locked?: boolean;
  trace?: boolean;
  dependencies?: string[];
  value?: unknown;
};

export type DynamicObjectNode = DynamicObjectDefinition & {
  dependencies: string[];
  dependents: string[];
  dirty: boolean;
  valid: boolean;
  error?: string;
  order: number;
};

export type DynamicObjectGraph = {
  nodes: DynamicObjectNode[];
  order: string[];
  cycles: string[][];
  missingDependencies: { object: string; dependency: string }[];
  dirty: string[];
};

const reservedSymbols = new Set([
  "x",
  "y",
  "z",
  "n",
  "pi",
  "e",
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "log",
  "ln",
  "abs",
  "min",
  "max",
  "round",
  "floor",
  "ceil",
  "if",
  "true",
  "false",
  "slider",
  "point",
  "line",
  "segment",
  "ray",
  "vector",
  "circle",
  "polygon",
  "surface",
  "sphere",
  "cone",
  "cylinder",
  "matrix",
]);

export function buildDynamicObjectGraph(objects: DynamicObjectDefinition[], changedNames: string[] = []): DynamicObjectGraph {
  const nameToObject = new Map(objects.map((object) => [normalizeName(object.name), object]));
  const changed = new Set(changedNames.map(normalizeName));
  const normalizedObjects: DynamicObjectNode[] = objects.map((object) => {
    const dependencies = object.dependencies !== undefined ? object.dependencies : extractDefinitionDependencies(object.definition);
    return {
      ...object,
      dependencies: dependencies.map(normalizeName).filter((name) => name && name !== normalizeName(object.name)),
      dependents: [] as string[],
      dirty: changed.has(normalizeName(object.name)),
      valid: true,
      order: 0,
    };
  });

  const nodeByName = new Map(normalizedObjects.map((node) => [normalizeName(node.name), node]));
  const missingDependencies: DynamicObjectGraph["missingDependencies"] = [];

  for (const node of normalizedObjects) {
    for (const dependency of node.dependencies) {
      const parent = nodeByName.get(dependency);
      if (parent) parent.dependents.push(normalizeName(node.name));
      else if (!nameToObject.has(dependency)) missingDependencies.push({ object: node.name, dependency });
    }
  }

  for (const name of changed) markDependentsDirty(name, nodeByName);

  const cycles = findCycles(normalizedObjects);
  const cycleNames = new Set(cycles.flat());
  const sortedNames = topologicalSort(normalizedObjects, cycleNames);

  sortedNames.forEach((name, index) => {
    const node = nodeByName.get(name);
    if (node) node.order = index + 1;
  });

  for (const node of normalizedObjects) {
    if (cycleNames.has(normalizeName(node.name))) {
      node.valid = false;
      node.error = "Circular dependency";
    } else if (missingDependencies.some((item) => item.object === node.name)) {
      node.valid = false;
      node.error = "Missing dependency";
    }
  }

  return {
    nodes: [...normalizedObjects].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    order: sortedNames,
    cycles,
    missingDependencies,
    dirty: normalizedObjects.filter((node) => node.dirty).map((node) => node.name),
  };
}

export function extractDefinitionDependencies(definition: string) {
  const withoutStrings = definition.replace(/"[^"]*"|'[^']*'/g, " ");
  const rhs = withoutStrings.includes("=") ? withoutStrings.slice(withoutStrings.indexOf("=") + 1) : withoutStrings;
  const tokens = Array.from(withoutStrings.matchAll(/\b[A-Za-z]\w*\b/g)).map((match) => normalizeName(match[0]));
  const rhsTokens = Array.from(rhs.matchAll(/\b[A-Za-z]\w*\b/g)).map((match) => normalizeName(match[0]));
  return Array.from(new Set(rhsTokens.length ? rhsTokens.filter((token) => !reservedSymbols.has(token)) : tokens.filter((token) => !reservedSymbols.has(token))));
}

export function graphHealthSummary(graph: DynamicObjectGraph) {
  const invalid = graph.nodes.filter((node) => !node.valid).length;
  const dynamic = graph.nodes.filter((node) => node.dependencies.length > 0).length;
  return {
    total: graph.nodes.length,
    dynamic,
    dirty: graph.dirty.length,
    invalid,
    ready: invalid === 0 && graph.cycles.length === 0,
    text: invalid || graph.cycles.length
      ? `${invalid} object issue${invalid === 1 ? "" : "s"} need attention.`
      : `${dynamic} dynamic object${dynamic === 1 ? "" : "s"} linked across the workspace.`,
  };
}

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function markDependentsDirty(name: string, nodes: Map<string, DynamicObjectNode>) {
  const queue = [name];
  const visited = new Set<string>();
  while (queue.length) {
    const current = queue.shift() ?? "";
    if (visited.has(current)) continue;
    visited.add(current);
    const node = nodes.get(current);
    if (!node) continue;
    node.dirty = true;
    queue.push(...node.dependents);
  }
}

function findCycles(nodes: DynamicObjectNode[]) {
  const nodeByName = new Map(nodes.map((node) => [normalizeName(node.name), node]));
  const visited = new Set<string>();
  const active = new Set<string>();
  const path: string[] = [];
  const cycles: string[][] = [];

  const visit = (name: string) => {
    if (active.has(name)) {
      const start = path.indexOf(name);
      if (start >= 0) cycles.push(path.slice(start));
      return;
    }
    if (visited.has(name)) return;
    visited.add(name);
    active.add(name);
    path.push(name);
    for (const dependency of nodeByName.get(name)?.dependencies ?? []) {
      if (nodeByName.has(dependency)) visit(dependency);
    }
    path.pop();
    active.delete(name);
  };

  for (const node of nodes) visit(normalizeName(node.name));
  return dedupeCycles(cycles);
}

function topologicalSort(nodes: DynamicObjectNode[], cycleNames: Set<string>) {
  const nodeByName = new Map(nodes.map((node) => [normalizeName(node.name), node]));
  const visited = new Set<string>();
  const output: string[] = [];

  const visit = (name: string) => {
    if (visited.has(name) || cycleNames.has(name)) return;
    visited.add(name);
    for (const dependency of nodeByName.get(name)?.dependencies ?? []) visit(dependency);
    output.push(name);
  };

  for (const node of nodes) visit(normalizeName(node.name));
  for (const name of cycleNames) output.push(name);
  return output;
}

function dedupeCycles(cycles: string[][]) {
  const seen = new Set<string>();
  return cycles.filter((cycle) => {
    const key = [...cycle].sort().join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
