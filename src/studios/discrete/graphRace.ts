export type WeightedEdge = { a: string; b: string; w: number };
export type RaceStep = { visited: string[]; chosen: string[]; candidates: string[]; cost: number; reason: string };

export const raceEdges: WeightedEdge[] = [
  { a: "A", b: "B", w: 4 }, { a: "A", b: "C", w: 2 }, { a: "B", b: "C", w: 1 },
  { a: "B", b: "D", w: 5 }, { a: "C", b: "D", w: 8 }, { a: "C", b: "E", w: 10 },
  { a: "D", b: "E", w: 2 }, { a: "B", b: "E", w: 9 },
];
export const edgeId = (edge: WeightedEdge) => `${edge.a}${edge.b}`;

export function dijkstraSteps(edges = raceEdges): RaceStep[] {
  const nodes = [...new Set(edges.flatMap((edge) => [edge.a, edge.b]))].sort();
  const distance = Object.fromEntries(nodes.map((node) => [node, node === "A" ? 0 : Infinity]));
  const visited: string[] = [];
  const predecessor: Record<string, string> = {};
  const steps: RaceStep[] = [{ visited: [], chosen: [], candidates: [], cost: 0, reason: "Start at A with distance 0." }];
  while (visited.length < nodes.length) {
    const next = nodes.filter((node) => !visited.includes(node)).sort((a, b) => distance[a] - distance[b])[0];
    if (!next || !Number.isFinite(distance[next])) break;
    visited.push(next);
    const candidates = edges.filter((edge) => (edge.a === next || edge.b === next) && !visited.includes(edge.a === next ? edge.b : edge.a));
    for (const edge of candidates) {
      const other = edge.a === next ? edge.b : edge.a;
      if (distance[next] + edge.w < distance[other]) { distance[other] = distance[next] + edge.w; predecessor[other] = edgeId(edge); }
    }
    steps.push({ visited: [...visited], chosen: Object.values(predecessor), candidates: candidates.map(edgeId), cost: distance[next], reason: `Settle ${next}: its tentative distance ${distance[next]} is smallest. Relax its outgoing edges.` });
  }
  return steps;
}

export function kruskalSteps(edges = raceEdges): RaceStep[] {
  const parent: Record<string, string> = {};
  const find = (node: string): string => parent[node] === node ? node : (parent[node] = find(parent[node]));
  edges.forEach((edge) => { parent[edge.a] = edge.a; parent[edge.b] = edge.b; });
  const ordered = [...edges].sort((a, b) => a.w - b.w || edgeId(a).localeCompare(edgeId(b)));
  const chosen: string[] = [], visited = new Set<string>();
  let cost = 0;
  const steps: RaceStep[] = [{ visited: [], chosen: [], candidates: ordered.map(edgeId), cost, reason: "Sort edges by weight; add one unless it closes a cycle." }];
  for (const edge of ordered) {
    const first = find(edge.a), second = find(edge.b);
    const accepted = first !== second;
    if (accepted) { parent[first] = second; chosen.push(edgeId(edge)); cost += edge.w; visited.add(edge.a); visited.add(edge.b); }
    steps.push({ visited: [...visited], chosen: [...chosen], candidates: ordered.slice(steps.length - 1).map(edgeId), cost, reason: `${edgeId(edge)} (${edge.w}): ${accepted ? "add the cheapest edge joining two components" : "skip because it would form a cycle"}.` });
  }
  return steps;
}
