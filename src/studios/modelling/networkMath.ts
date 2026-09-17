import { adjacency, dijkstra, sampleGraph, type GraphProject } from "../../modules/graph-theory/graphTheoryEngine";

export function trafficGraph(traffic: number, closed: number): GraphProject {
  const drop = closed >= 0.35 ? "C-E" : closed >= 0.18 ? "B-E" : null;
  return {
    directed: sampleGraph.directed,
    nodes: sampleGraph.nodes,
    edges: sampleGraph.edges
      .filter((edge) => edge.id !== drop)
      .map((edge) => ({ ...edge, weight: Number((edge.weight * (1 + traffic * 1.8)).toFixed(4)) })),
  };
}

export function reconstructPath(project: GraphProject, dist: Record<string, number>, start: string, end: string) {
  if (!Number.isFinite(dist[end])) return [] as string[];
  const adj = adjacency(project);
  const path = [end];
  let cur = end;
  for (let i = 0; i < project.nodes.length + 2 && cur !== start; i += 1) {
    let found = "";
    for (const [from, links] of adj) {
      if (path.includes(from)) continue;
      for (const { to, edge } of links) {
        if (to === cur && Math.abs((dist[from] ?? Infinity) + edge.weight - (dist[cur] ?? Infinity)) < 1e-6) {
          found = from;
          break;
        }
      }
      if (found) break;
    }
    if (!found) break;
    path.unshift(found);
    cur = found;
  }
  return path[0] === start ? path : [];
}

export function shortestRoute(project: GraphProject, start: string, end: string) {
  const { dist, steps } = dijkstra(project, start);
  return { dist: dist[end] ?? Number.POSITIVE_INFINITY, path: reconstructPath(project, dist, start, end), steps };
}

export function astarRoute(project: GraphProject, start: string, end: string) {
  const nodes = Object.fromEntries(project.nodes.map((n) => [n.id, n]));
  const h = (id: string) => {
    const a = nodes[id];
    const b = nodes[end];
    if (!a || !b) return 0;
    return Math.hypot(a.x - b.x, a.y - b.y) / 80;
  };
  const adj = adjacency(project);
  const gScore: Record<string, number> = Object.fromEntries(project.nodes.map((n) => [n.id, Number.POSITIVE_INFINITY]));
  const fScore: Record<string, number> = { ...gScore };
  gScore[start] = 0;
  fScore[start] = h(start);
  const open = new Set([start]);
  const came = new Map<string, string>();
  while (open.size) {
    const current = Array.from(open).sort((a, b) => (fScore[a] ?? Infinity) - (fScore[b] ?? Infinity))[0]!;
    if (current === end) break;
    open.delete(current);
    for (const { to, edge } of adj.get(current) ?? []) {
      const tentative = (gScore[current] ?? Infinity) + edge.weight;
      if (tentative < (gScore[to] ?? Infinity)) {
        came.set(to, current);
        gScore[to] = tentative;
        fScore[to] = tentative + h(to);
        open.add(to);
      }
    }
  }
  const path = [end];
  while (came.has(path[0]!)) path.unshift(came.get(path[0]!)!);
  return { dist: gScore[end] ?? Number.POSITIVE_INFINITY, path: path[0] === start ? path : [] };
}
