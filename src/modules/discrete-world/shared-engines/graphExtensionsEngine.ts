export type GraphNode = { id: string; label: string; x: number; y: number };
export type GraphEdge = { id: string; source: string; target: string; weight: number; directed?: boolean };
export type GraphProject = { nodes: GraphNode[]; edges: GraphEdge[]; directed: boolean };

export function eulerPath(project: GraphProject) {
  const degree = new Map(project.nodes.map((node) => [node.id, 0]));
  project.edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });
  const odd = Array.from(degree.entries()).filter(([, value]) => value % 2 === 1).map(([node]) => node);
  return {
    exists: odd.length === 0 || odd.length === 2,
    kind: odd.length === 0 ? "Euler circuit" : odd.length === 2 ? "Open Euler path" : "No Euler path",
    odd,
  };
}

export function bellmanFord(project: GraphProject, start = project.nodes[0]?.id ?? "") {
  const dist = Object.fromEntries(project.nodes.map((node) => [node.id, Number.POSITIVE_INFINITY])) as Record<string, number>;
  const previous = {} as Record<string, string>;
  const steps: string[] = [];
  dist[start] = 0;
  for (let pass = 1; pass < project.nodes.length; pass += 1) {
    let changed = false;
    project.edges.forEach((edge) => {
      if (!Number.isFinite(dist[edge.source])) return;
      const candidate = dist[edge.source] + edge.weight;
      if (candidate < dist[edge.target]) {
        dist[edge.target] = candidate;
        previous[edge.target] = edge.source;
        changed = true;
        steps.push(`Pass ${pass}: ${edge.target} becomes ${candidate} through ${edge.source}.`);
      }
    });
    if (!changed) break;
  }
  const negativeCycle = project.edges.some((edge) => Number.isFinite(dist[edge.source]) && dist[edge.source] + edge.weight < dist[edge.target]);
  return { dist, previous, negativeCycle, steps };
}

export function floydWarshall(project: GraphProject) {
  const ids = project.nodes.map((node) => node.id);
  const dist = ids.map((row) => ids.map((column) => row === column ? 0 : Number.POSITIVE_INFINITY));
  const index = new Map(ids.map((id, i) => [id, i]));
  project.edges.forEach((edge) => {
    dist[index.get(edge.source)!][index.get(edge.target)!] = Math.min(dist[index.get(edge.source)!][index.get(edge.target)!], edge.weight);
    if (!project.directed && !edge.directed) dist[index.get(edge.target)!][index.get(edge.source)!] = Math.min(dist[index.get(edge.target)!][index.get(edge.source)!], edge.weight);
  });
  ids.forEach((_, k) => ids.forEach((__, i) => ids.forEach((___, j) => {
    if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
  })));
  return { ids, dist };
}

export function stronglyConnectedComponents(project: GraphProject) {
  let time = 0;
  const stack: string[] = [];
  const onStack = new Set<string>();
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const components: string[][] = [];
  const outgoing = new Map(project.nodes.map((node) => [node.id, [] as string[]]));
  project.edges.forEach((edge) => {
    outgoing.get(edge.source)?.push(edge.target);
    if (!project.directed && !edge.directed) outgoing.get(edge.target)?.push(edge.source);
  });
  const visit = (node: string) => {
    index.set(node, time);
    low.set(node, time);
    time += 1;
    stack.push(node);
    onStack.add(node);
    for (const next of outgoing.get(node) ?? []) {
      if (!index.has(next)) {
        visit(next);
        low.set(node, Math.min(low.get(node)!, low.get(next)!));
      } else if (onStack.has(next)) {
        low.set(node, Math.min(low.get(node)!, index.get(next)!));
      }
    }
    if (low.get(node) !== index.get(node)) return;
    const component: string[] = [];
    let popped = "";
    do {
      popped = stack.pop()!;
      onStack.delete(popped);
      component.push(popped);
    } while (popped !== node);
    components.push(component);
  };
  project.nodes.forEach((node) => {
    if (!index.has(node.id)) visit(node.id);
  });
  return components;
}
