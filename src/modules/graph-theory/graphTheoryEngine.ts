import cytoscape from "cytoscape";

export type GraphNode = { id: string; label: string; x: number; y: number };
export type GraphEdge = { id: string; source: string; target: string; weight: number; directed?: boolean };
export type GraphProject = { nodes: GraphNode[]; edges: GraphEdge[]; directed: boolean };
export type AlgorithmStep = { label: string; activeNodes: string[]; activeEdges: string[]; note: string };

export const sampleGraph: GraphProject = {
  directed: false,
  nodes: [
    { id: "A", label: "A", x: 60, y: 80 },
    { id: "B", label: "B", x: 220, y: 40 },
    { id: "C", label: "C", x: 390, y: 90 },
    { id: "D", label: "D", x: 120, y: 230 },
    { id: "E", label: "E", x: 320, y: 245 },
  ],
  edges: [
    { id: "A-B", source: "A", target: "B", weight: 2 },
    { id: "B-C", source: "B", target: "C", weight: 3 },
    { id: "A-D", source: "A", target: "D", weight: 1 },
    { id: "B-D", source: "B", target: "D", weight: 4 },
    { id: "B-E", source: "B", target: "E", weight: 2 },
    { id: "C-E", source: "C", target: "E", weight: 1 },
    { id: "D-E", source: "D", target: "E", weight: 5 },
  ],
};

export function adjacency(project: GraphProject) {
  const map = new Map(project.nodes.map((node) => [node.id, [] as Array<{ to: string; edge: GraphEdge }>]));
  project.edges.forEach((edge) => {
    map.get(edge.source)?.push({ to: edge.target, edge });
    if (!project.directed && !edge.directed) map.get(edge.target)?.push({ to: edge.source, edge });
  });
  return map;
}

export function degreeMap(project: GraphProject) {
  const degree = new Map(project.nodes.map((node) => [node.id, 0]));
  project.edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });
  return degree;
}

export function directedDegreeMap(project: GraphProject) {
  const map = new Map(project.nodes.map((node) => [node.id, { in: 0, out: 0, total: 0 }]));
  project.edges.forEach((edge) => {
    const source = map.get(edge.source);
    const target = map.get(edge.target);
    if (source) {
      source.out += 1;
      source.total += 1;
    }
    if (target) {
      target.in += 1;
      target.total += 1;
    }
    if (!project.directed && !edge.directed) {
      if (source) source.in += 1;
      if (target) target.out += 1;
    }
  });
  return map;
}

export function graphMetrics(project: GraphProject) {
  const n = project.nodes.length;
  const m = project.edges.length;
  const maxEdges = project.directed ? n * Math.max(0, n - 1) : (n * Math.max(0, n - 1)) / 2;
  const degrees = Array.from(degreeMap(project).values());
  const degreeSum = degrees.reduce((sum, value) => sum + value, 0);
  return {
    order: n,
    size: m,
    degreeSum,
    handshakingExpected: project.directed ? m * 2 : m * 2,
    density: maxEdges > 0 ? m / maxEdges : 0,
    isolated: degrees.filter((value) => value === 0).length,
    regular: degrees.length > 0 && degrees.every((value) => value === degrees[0]),
    complete: !project.directed && n > 1 && m === maxEdges,
  };
}

export function adjacencyMatrix(project: GraphProject) {
  const ids = project.nodes.map((node) => node.id);
  const index = new Map(ids.map((id, row) => [id, row]));
  const matrix = ids.map(() => ids.map(() => 0));
  project.edges.forEach((edge) => {
    const row = index.get(edge.source);
    const column = index.get(edge.target);
    if (row === undefined || column === undefined) return;
    matrix[row][column] += edge.weight || 1;
    if (!project.directed && !edge.directed) matrix[column][row] += edge.weight || 1;
  });
  return { ids, matrix };
}

export function adjacencyList(project: GraphProject) {
  const adj = adjacency(project);
  return project.nodes.map((node) => ({
    id: node.id,
    neighbors: (adj.get(node.id) ?? []).map(({ to, edge }) => `${to}${edge.weight !== 1 ? `(${edge.weight})` : ""}`),
  }));
}

export function incidenceMatrix(project: GraphProject) {
  const ids = project.nodes.map((node) => node.id);
  return {
    ids,
    edgeIds: project.edges.map((edge) => edge.id),
    matrix: ids.map((id) =>
      project.edges.map((edge) => {
        if (project.directed || edge.directed) {
          if (edge.source === id) return -1;
          if (edge.target === id) return 1;
          return 0;
        }
        return edge.source === id || edge.target === id ? 1 : 0;
      })
    ),
  };
}

export function connectedComponents(project: GraphProject) {
  const adj = adjacency({ ...project, directed: false });
  const unseen = new Set(project.nodes.map((node) => node.id));
  const components: string[][] = [];
  while (unseen.size) {
    const start = unseen.values().next().value as string;
    const stack = [start];
    const component: string[] = [];
    unseen.delete(start);
    while (stack.length) {
      const node = stack.pop()!;
      component.push(node);
      for (const { to } of adj.get(node) ?? []) {
        if (!unseen.has(to)) continue;
        unseen.delete(to);
        stack.push(to);
      }
    }
    components.push(component);
  }
  return components;
}

export function inducedSubgraph(project: GraphProject, nodeIds: string[]): GraphProject {
  const keep = new Set(nodeIds);
  return {
    directed: project.directed,
    nodes: project.nodes.filter((node) => keep.has(node.id)),
    edges: project.edges.filter((edge) => keep.has(edge.source) && keep.has(edge.target)),
  };
}

export function complementGraph(project: GraphProject): GraphProject {
  const existing = new Set(project.edges.map((edge) => (project.directed || edge.directed ? directedEdgeKey(edge.source, edge.target) : edgeKey(edge.source, edge.target))));
  const edges: GraphEdge[] = [];
  project.nodes.forEach((source) => {
    project.nodes.forEach((target) => {
      if (source.id === target.id) return;
      if (!project.directed && source.id > target.id) return;
      const key = project.directed ? directedEdgeKey(source.id, target.id) : edgeKey(source.id, target.id);
      if (existing.has(key)) return;
      edges.push({ id: `${source.id}-${target.id}`, source: source.id, target: target.id, weight: 1, directed: project.directed });
    });
  });
  return { directed: project.directed, nodes: project.nodes, edges };
}

export function isBipartite(project: GraphProject) {
  const adj = adjacency({ ...project, directed: false });
  const color = new Map<string, 0 | 1>();
  const conflicts: string[] = [];
  for (const node of project.nodes) {
    if (color.has(node.id)) continue;
    color.set(node.id, 0);
    const queue = [node.id];
    while (queue.length) {
      const current = queue.shift()!;
      for (const { to, edge } of adj.get(current) ?? []) {
        if (!color.has(to)) {
          color.set(to, color.get(current) === 0 ? 1 : 0);
          queue.push(to);
        } else if (color.get(to) === color.get(current)) {
          conflicts.push(edge.id);
        }
      }
    }
  }
  return {
    bipartite: conflicts.length === 0,
    left: project.nodes.filter((node) => color.get(node.id) === 0).map((node) => node.id),
    right: project.nodes.filter((node) => color.get(node.id) === 1).map((node) => node.id),
    conflicts: Array.from(new Set(conflicts)),
  };
}

export function bridgesAndCutVertices(project: GraphProject) {
  const baseline = connectedComponents({ ...project, directed: false }).length;
  const bridges = project.edges.filter((edge) => connectedComponents({ ...project, directed: false, edges: project.edges.filter((item) => item.id !== edge.id) }).length > baseline).map((edge) => edge.id);
  const cutVertices = project.nodes.filter((node) => {
    const next = {
      ...project,
      directed: false,
      nodes: project.nodes.filter((item) => item.id !== node.id),
      edges: project.edges.filter((edge) => edge.source !== node.id && edge.target !== node.id),
    };
    return next.nodes.length > 0 && connectedComponents(next).length > baseline;
  }).map((node) => node.id);
  return { bridges, cutVertices };
}

export function cliqueAndIndependentSets(project: GraphProject) {
  const ids = project.nodes.map((node) => node.id);
  const subsets = nonEmptySubsets(ids).filter((subset) => subset.length <= 8);
  const edgeSet = undirectedEdgeSet(project);
  const clique = subsets.filter((subset) => everyPair(subset, (a, b) => edgeSet.has(edgeKey(a, b)))).sort((a, b) => b.length - a.length)[0] ?? [];
  const independent = subsets.filter((subset) => everyPair(subset, (a, b) => !edgeSet.has(edgeKey(a, b)))).sort((a, b) => b.length - a.length)[0] ?? [];
  return { clique, independent };
}

export function maximumMatching(project: GraphProject) {
  const edges = project.edges.slice(0, 14);
  let best: GraphEdge[] = [];
  const search = (index: number, chosen: GraphEdge[], used: Set<string>) => {
    if (index === edges.length) {
      if (chosen.length > best.length) best = [...chosen];
      return;
    }
    search(index + 1, chosen, used);
    const edge = edges[index];
    if (!used.has(edge.source) && !used.has(edge.target)) {
      used.add(edge.source);
      used.add(edge.target);
      chosen.push(edge);
      search(index + 1, chosen, used);
      chosen.pop();
      used.delete(edge.source);
      used.delete(edge.target);
    }
  };
  search(0, [], new Set());
  return best.map((edge) => edge.id);
}

export function floydWarshall(project: GraphProject) {
  const ids = project.nodes.map((node) => node.id);
  const dist = ids.map((from) => ids.map((to) => (from === to ? 0 : Number.POSITIVE_INFINITY)));
  const index = new Map(ids.map((id, row) => [id, row]));
  project.edges.forEach((edge) => {
    const source = index.get(edge.source);
    const target = index.get(edge.target);
    if (source === undefined || target === undefined) return;
    dist[source][target] = Math.min(dist[source][target], edge.weight);
    if (!project.directed && !edge.directed) dist[target][source] = Math.min(dist[target][source], edge.weight);
  });
  for (let k = 0; k < ids.length; k += 1) {
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = 0; j < ids.length; j += 1) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }
  return { ids, dist };
}

export function graphDistanceMetrics(project: GraphProject) {
  const table = floydWarshall({ ...project, directed: false });
  const eccentricity = Object.fromEntries(
    table.ids.map((id, rowIndex) => {
      const reachable = table.dist[rowIndex].filter((value) => Number.isFinite(value));
      return [id, reachable.length ? Math.max(...reachable) : Number.POSITIVE_INFINITY];
    })
  ) as Record<string, number>;
  const finite = Object.values(eccentricity).filter((value) => Number.isFinite(value));
  const radius = finite.length ? Math.min(...finite) : Number.POSITIVE_INFINITY;
  const diameter = finite.length ? Math.max(...finite) : Number.POSITIVE_INFINITY;
  return {
    radius,
    diameter,
    center: Object.entries(eccentricity).filter(([, value]) => value === radius).map(([id]) => id),
    eccentricity,
  };
}

export function clusteringCoefficients(project: GraphProject) {
  const edgeSet = undirectedEdgeSet(project);
  const adj = adjacency({ ...project, directed: false });
  const local = Object.fromEntries(
    project.nodes.map((node) => {
      const neighbors = Array.from(new Set((adj.get(node.id) ?? []).map(({ to }) => to)));
      const possible = (neighbors.length * Math.max(0, neighbors.length - 1)) / 2;
      let links = 0;
      for (let i = 0; i < neighbors.length; i += 1) {
        for (let j = i + 1; j < neighbors.length; j += 1) {
          if (edgeSet.has(edgeKey(neighbors[i], neighbors[j]))) links += 1;
        }
      }
      return [node.id, possible ? links / possible : 0];
    })
  ) as Record<string, number>;
  const values = Object.values(local);
  return {
    local,
    average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
  };
}

export function graphGirth(project: GraphProject) {
  const adj = adjacency({ ...project, directed: false });
  let best = Number.POSITIVE_INFINITY;
  for (const start of project.nodes.map((node) => node.id)) {
    const dist = new Map<string, number>([[start, 0]]);
    const parent = new Map<string, string | null>([[start, null]]);
    const queue = [start];
    while (queue.length) {
      const node = queue.shift()!;
      for (const { to } of adj.get(node) ?? []) {
        if (!dist.has(to)) {
          dist.set(to, (dist.get(node) ?? 0) + 1);
          parent.set(to, node);
          queue.push(to);
        } else if (parent.get(node) !== to && parent.get(to) !== node) {
          best = Math.min(best, (dist.get(node) ?? 0) + (dist.get(to) ?? 0) + 1);
        }
      }
    }
  }
  return Number.isFinite(best) ? best : null;
}

export function maxFlowMinCut(project: GraphProject, source = project.nodes[0]?.id ?? "", sink = project.nodes.at(-1)?.id ?? "") {
  const ids = project.nodes.map((node) => node.id);
  const capacity = new Map<string, Map<string, number>>();
  ids.forEach((id) => capacity.set(id, new Map(ids.map((other) => [other, 0]))));
  project.edges.forEach((edge) => {
    capacity.get(edge.source)?.set(edge.target, (capacity.get(edge.source)?.get(edge.target) ?? 0) + Math.max(0, edge.weight));
    if (!project.directed && !edge.directed) {
      capacity.get(edge.target)?.set(edge.source, (capacity.get(edge.target)?.get(edge.source) ?? 0) + Math.max(0, edge.weight));
    }
  });
  const flow = new Map<string, Map<string, number>>();
  ids.forEach((id) => flow.set(id, new Map(ids.map((other) => [other, 0]))));
  const augmentingPaths: Array<{ path: string[]; bottleneck: number }> = [];

  const residual = (from: string, to: string) => (capacity.get(from)?.get(to) ?? 0) - (flow.get(from)?.get(to) ?? 0);
  const bfsPath = () => {
    const parent = new Map<string, string | null>([[source, null]]);
    const queue = [source];
    while (queue.length && !parent.has(sink)) {
      const node = queue.shift()!;
      ids.forEach((to) => {
        if (parent.has(to) || residual(node, to) <= 0) return;
        parent.set(to, node);
        queue.push(to);
      });
    }
    if (!parent.has(sink)) return null;
    const path = [sink];
    while (path[0] !== source) path.unshift(parent.get(path[0])!);
    const bottleneck = Math.min(...path.slice(1).map((to, index) => residual(path[index], to)));
    return { path, bottleneck };
  };

  for (let guard = 0; guard < 40; guard += 1) {
    const path = bfsPath();
    if (!path) break;
    augmentingPaths.push(path);
    path.path.slice(1).forEach((to, index) => {
      const from = path.path[index];
      flow.get(from)?.set(to, (flow.get(from)?.get(to) ?? 0) + path.bottleneck);
      flow.get(to)?.set(from, (flow.get(to)?.get(from) ?? 0) - path.bottleneck);
    });
  }

  const reachable = new Set<string>([source]);
  const queue = [source];
  while (queue.length) {
    const node = queue.shift()!;
    ids.forEach((to) => {
      if (reachable.has(to) || residual(node, to) <= 0) return;
      reachable.add(to);
      queue.push(to);
    });
  }
  const cutEdges = project.edges
    .filter((edge) => reachable.has(edge.source) && !reachable.has(edge.target))
    .map((edge) => edge.id);
  const value = Array.from(flow.get(source)?.values() ?? []).reduce((sum, amount) => sum + Math.max(0, amount), 0);
  return { source, sink, value, augmentingPaths, cut: Array.from(reachable), cutEdges };
}

export function planarityObstructionHint(project: GraphProject) {
  const n = project.nodes.length;
  const edgeSet = undirectedEdgeSet(project);
  const isComplete = n >= 5 && everyPair(project.nodes.map((node) => node.id), (a, b) => edgeSet.has(edgeKey(a, b)));
  if (isComplete && n === 5) return { obstruction: "K5", note: "K5 is a classic non-planar obstruction." };
  const bipartite = isBipartite(project);
  if (bipartite.left.length === 3 && bipartite.right.length === 3) {
    const completeBipartite = bipartite.left.every((left) => bipartite.right.every((right) => edgeSet.has(edgeKey(left, right))));
    if (completeBipartite) return { obstruction: "K3,3", note: "K3,3 is the utility graph and is non-planar." };
  }
  return { obstruction: "none detected", note: "No direct K5 or K3,3 pattern was detected in this classroom-scale graph." };
}

export function bfs(project: GraphProject, start = project.nodes[0]?.id ?? ""): AlgorithmStep[] {
  const adj = adjacency(project);
  const queue = [start];
  const seen = new Set<string>([start]);
  const steps: AlgorithmStep[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    steps.push({ label: "BFS", activeNodes: [node], activeEdges: [], note: `Visit ${node}; queue = [${queue.join(", ")}]` });
    for (const { to, edge } of adj.get(node) ?? []) {
      if (seen.has(to)) continue;
      seen.add(to);
      queue.push(to);
      steps.push({ label: "BFS discover", activeNodes: [node, to], activeEdges: [edge.id], note: `Discover ${to} from ${node}.` });
    }
  }
  return steps;
}

export function dfs(project: GraphProject, start = project.nodes[0]?.id ?? ""): AlgorithmStep[] {
  const adj = adjacency(project);
  const seen = new Set<string>();
  const steps: AlgorithmStep[] = [];
  const visit = (node: string) => {
    seen.add(node);
    steps.push({ label: "DFS", activeNodes: [node], activeEdges: [], note: `Enter ${node}.` });
    for (const { to, edge } of adj.get(node) ?? []) {
      if (seen.has(to)) continue;
      steps.push({ label: "DFS edge", activeNodes: [node, to], activeEdges: [edge.id], note: `Follow ${node} to ${to}.` });
      visit(to);
    }
  };
  if (start) visit(start);
  return steps;
}

export function dijkstra(project: GraphProject, start = project.nodes[0]?.id ?? "") {
  const adj = adjacency(project);
  const dist = Object.fromEntries(project.nodes.map((node) => [node.id, Number.POSITIVE_INFINITY])) as Record<string, number>;
  const unvisited = new Set(project.nodes.map((node) => node.id));
  const steps: AlgorithmStep[] = [];
  dist[start] = 0;
  while (unvisited.size) {
    const node = Array.from(unvisited).sort((a, b) => dist[a] - dist[b])[0];
    if (!Number.isFinite(dist[node])) break;
    unvisited.delete(node);
    steps.push({ label: "Dijkstra", activeNodes: [node], activeEdges: [], note: `Settle ${node} with distance ${dist[node]}.` });
    for (const { to, edge } of adj.get(node) ?? []) {
      if (!unvisited.has(to)) continue;
      const next = dist[node] + edge.weight;
      if (next < dist[to]) {
        dist[to] = next;
        steps.push({ label: "Relax edge", activeNodes: [node, to], activeEdges: [edge.id], note: `${to} becomes ${next}.` });
      }
    }
  }
  return { dist, steps };
}

export function kruskal(project: GraphProject) {
  const parent = new Map(project.nodes.map((node) => [node.id, node.id]));
  const find = (x: string): string => parent.get(x) === x ? x : find(parent.get(x)!);
  const union = (a: string, b: string) => parent.set(find(a), find(b));
  const steps: AlgorithmStep[] = [];
  const tree: string[] = [];
  [...project.edges].sort((a, b) => a.weight - b.weight).forEach((edge) => {
    if (find(edge.source) !== find(edge.target)) {
      union(edge.source, edge.target);
      tree.push(edge.id);
      steps.push({ label: "Kruskal choose", activeNodes: [edge.source, edge.target], activeEdges: [edge.id], note: `Add ${edge.id} with weight ${edge.weight}.` });
    } else {
      steps.push({ label: "Kruskal skip", activeNodes: [edge.source, edge.target], activeEdges: [edge.id], note: `Skip ${edge.id}; it closes a cycle.` });
    }
  });
  return { tree, steps };
}

export function prim(project: GraphProject, start = project.nodes[0]?.id ?? "") {
  const seen = new Set<string>([start]);
  const tree: string[] = [];
  const steps: AlgorithmStep[] = [];
  while (seen.size < project.nodes.length) {
    const candidates = project.edges.filter((edge) => seen.has(edge.source) !== seen.has(edge.target)).sort((a, b) => a.weight - b.weight);
    const edge = candidates[0];
    if (!edge) break;
    tree.push(edge.id);
    seen.add(seen.has(edge.source) ? edge.target : edge.source);
    steps.push({ label: "Prim choose", activeNodes: [edge.source, edge.target], activeEdges: [edge.id], note: `Add lightest boundary edge ${edge.id}.` });
  }
  return { tree, steps };
}

export function topologicalSort(project: GraphProject) {
  const indegree = Object.fromEntries(project.nodes.map((node) => [node.id, 0])) as Record<string, number>;
  project.edges.forEach((edge) => { indegree[edge.target] += 1; });
  const queue = Object.keys(indegree).filter((node) => indegree[node] === 0);
  const order: string[] = [];
  const steps: AlgorithmStep[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    steps.push({ label: "Topological sort", activeNodes: [node], activeEdges: [], note: `Output ${node}.` });
    project.edges.filter((edge) => edge.source === node).forEach((edge) => {
      indegree[edge.target] -= 1;
      if (indegree[edge.target] === 0) queue.push(edge.target);
    });
  }
  return { order, steps, valid: order.length === project.nodes.length };
}

export function isomorphismSignature(project: GraphProject) {
  const degree = new Map(project.nodes.map((node) => [node.id, 0]));
  project.edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });
  return Array.from(degree.values()).sort((a, b) => a - b).join(",");
}

export function likelyIsomorphic(a: GraphProject, b: GraphProject) {
  return a.nodes.length === b.nodes.length && a.edges.length === b.edges.length && isomorphismSignature(a) === isomorphismSignature(b);
}

export function eulerCircuit(project: GraphProject) {
  const degree = degreeMap(project);
  const nonIsolated = project.nodes.filter((node) => (degree.get(node.id) ?? 0) > 0).map((node) => node.id);
  const components = connectedComponents(inducedSubgraph(project, nonIsolated));
  return nonIsolated.length > 0 && components.length <= 1 && Array.from(degree.values()).every((value) => value === 0 || value % 2 === 0);
}

export function eulerCircuitPath(project: GraphProject) {
  if (!eulerCircuit(project)) return { exists: false, path: [] as string[], steps: [] as AlgorithmStep[] };
  const unused = new Map<string, GraphEdge[]>(project.nodes.map((node) => [node.id, []]));
  project.edges.forEach((edge) => {
    unused.get(edge.source)?.push(edge);
    unused.get(edge.target)?.push(edge);
  });
  const used = new Set<string>();
  const stack = [project.edges[0]?.source ?? project.nodes[0]?.id ?? ""].filter(Boolean);
  const path: string[] = [];
  const steps: AlgorithmStep[] = [];
  while (stack.length) {
    const node = stack[stack.length - 1];
    const edge = (unused.get(node) ?? []).find((candidate) => !used.has(candidate.id));
    if (edge) {
      used.add(edge.id);
      const next = edge.source === node ? edge.target : edge.source;
      stack.push(next);
      steps.push({ label: "Euler trace", activeNodes: [node, next], activeEdges: [edge.id], note: `Traverse ${edge.id}.` });
    } else {
      path.push(stack.pop()!);
    }
  }
  return { exists: true, path: path.reverse(), steps };
}

export function hamiltonianCycle(project: GraphProject) {
  const adj = adjacency({ ...project, directed: false });
  const start = project.nodes[0]?.id;
  if (!start) return { exists: false, path: [] as string[] };
  const path = [start];
  const search = (node: string): boolean => {
    if (path.length === project.nodes.length) return Boolean(adj.get(node)?.some((next) => next.to === start));
    for (const { to } of adj.get(node) ?? []) {
      if (path.includes(to)) continue;
      path.push(to);
      if (search(to)) return true;
      path.pop();
    }
    return false;
  };
  const exists = search(start);
  return { exists, path: exists ? [...path, start] : path };
}

export function graphColorConflicts(project: GraphProject, assignment: Record<string, number>) {
  return project.edges.filter((edge) => assignment[edge.source] !== undefined && assignment[edge.source] === assignment[edge.target]).map((edge) => edge.id);
}

export type TreeKind = "binary" | "avl" | "expression";

export function treeModel(kind: TreeKind) {
  if (kind === "expression") {
    return {
      nodes: [
        { id: "*", x: 260, y: 38 }, { id: "+", x: 170, y: 118 }, { id: "-", x: 350, y: 118 },
        { id: "a", x: 115, y: 205 }, { id: "b", x: 225, y: 205 }, { id: "c", x: 310, y: 205 }, { id: "d", x: 420, y: 205 },
      ],
      edges: [["*", "+"], ["*", "-"], ["+", "a"], ["+", "b"], ["-", "c"], ["-", "d"]],
      traversal: ["a", "b", "+", "c", "d", "-", "*"],
    };
  }
  const avl = kind === "avl";
  return {
    nodes: [
      { id: "8", x: 260, y: 40 }, { id: "4", x: avl ? 165 : 160, y: 120 }, { id: "12", x: avl ? 355 : 360, y: 120 },
      { id: "2", x: 100, y: 205 }, { id: "6", x: 220, y: 205 }, { id: "10", x: 320, y: 205 }, { id: "14", x: 430, y: 205 },
    ],
    edges: [["8", "4"], ["8", "12"], ["4", "2"], ["4", "6"], ["12", "10"], ["12", "14"]],
    traversal: ["2", "4", "6", "8", "10", "12", "14"],
  };
}

export function edgeCrossings(project: GraphProject) {
  const nodeById = new Map(project.nodes.map((node) => [node.id, node]));
  const crossings: Array<[string, string]> = [];
  for (let i = 0; i < project.edges.length; i += 1) {
    for (let j = i + 1; j < project.edges.length; j += 1) {
      const a = project.edges[i];
      const b = project.edges[j];
      if ([a.source, a.target].some((id) => id === b.source || id === b.target)) continue;
      const p1 = nodeById.get(a.source), p2 = nodeById.get(a.target), p3 = nodeById.get(b.source), p4 = nodeById.get(b.target);
      if (p1 && p2 && p3 && p4 && segmentsIntersect(p1, p2, p3, p4)) crossings.push([a.id, b.id]);
    }
  }
  return crossings;
}

function segmentsIntersect(a: GraphNode, b: GraphNode, c: GraphNode, d: GraphNode) {
  const ccw = (p: GraphNode, q: GraphNode, r: GraphNode) => (r.y - p.y) * (q.x - p.x) > (q.y - p.y) * (r.x - p.x);
  return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
}

function edgeKey(a: string, b: string) {
  return [a, b].sort().join("--");
}

function directedEdgeKey(a: string, b: string) {
  return `${a}->${b}`;
}

function undirectedEdgeSet(project: GraphProject) {
  return new Set(project.edges.map((edge) => edgeKey(edge.source, edge.target)));
}

function nonEmptySubsets(values: string[]) {
  const capped = values.slice(0, 10);
  const subsets: string[][] = [];
  for (let mask = 1; mask < 2 ** capped.length; mask += 1) {
    subsets.push(capped.filter((_, index) => Boolean(mask & (1 << index))));
  }
  return subsets;
}

function everyPair(values: string[], predicate: (a: string, b: string) => boolean) {
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (!predicate(values[i], values[j])) return false;
    }
  }
  return true;
}

export function chromaticNumber(project: GraphProject) {
  const nodes = project.nodes.map((node) => node.id);
  const edges = project.edges;
  for (let colors = 1; colors <= Math.min(4, nodes.length); colors += 1) {
    const assignment: Record<string, number> = {};
    const assign = (index: number): boolean => {
      if (index === nodes.length) return true;
      for (let color = 0; color < colors; color += 1) {
        assignment[nodes[index]] = color;
        if (edges.every((edge) => assignment[edge.source] === undefined || assignment[edge.target] === undefined || assignment[edge.source] !== assignment[edge.target]) && assign(index + 1)) return true;
      }
      delete assignment[nodes[index]];
      return false;
    };
    if (assign(0)) return { colors, assignment };
  }
  return { colors: 5, assignment: {} as Record<string, number> };
}

export function cytoscapeMetrics(project: GraphProject) {
  const cy = cytoscape({
    headless: true,
    elements: [
      ...project.nodes.map((node) => ({ data: { id: node.id } })),
      ...project.edges.map((edge) => ({ data: { id: edge.id, source: edge.source, target: edge.target, weight: edge.weight } })),
    ],
  });
  const components = cy.elements().components().length;
  cy.destroy();
  return { components };
}

export function serializeGraph(project: GraphProject) {
  return JSON.stringify(project, null, 2);
}
