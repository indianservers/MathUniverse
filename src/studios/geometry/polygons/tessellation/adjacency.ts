import { edgeKey, vertexKey } from "./math";
import { hexNeighbors, hexRingDistance, oddqToCube, squareNeighbors, squareRingDistance, triangleNeighbors } from "./lattices";
import type { EdgeRecord, Tile, VertexRecord } from "./types";

export function assignGenerations(
  tiles: Omit<Tile, "generation">[],
  kind: Tile["kind"],
  mode: "expand" | "sweep",
): Tile[] {
  if (!tiles.length) return [];
  const origin = tiles.reduce((best, tile) => {
    const d = Math.hypot(tile.center.x, tile.center.y);
    const bd = Math.hypot(best.center.x, best.center.y);
    return d < bd ? tile : best;
  });

  if (mode === "sweep") {
    const minX = tiles.reduce((m, t) => Math.min(m, t.center.x), Infinity);
    const span = Math.max(1, tiles.reduce((m, t) => Math.max(m, t.center.x), -Infinity) - minX);
    return tiles.map((tile) => ({
      ...tile,
      generation: Math.floor(((tile.center.x - minX) / span) * 18),
    }));
  }

  if (kind === "square") {
    return tiles.map((tile) => ({
      ...tile,
      generation: Math.max(Math.abs(tile.row - origin.row), Math.abs(tile.col - origin.col)),
    }));
  }

  if (kind === "hexagon") {
    const o = oddqToCube(origin.col, origin.row);
    return tiles.map((tile) => {
      const c = oddqToCube(tile.col, tile.row);
      return {
        ...tile,
        generation: (Math.abs(c.x - o.x) + Math.abs(c.y - o.y) + Math.abs(c.z - o.z)) / 2,
      };
    });
  }

  const byId = new Map(tiles.map((tile) => [coordId(tile.kind, tile.row, tile.col), tile] as const));
  const gen = new Map<string, number>();
  const queue: Array<{ row: number; col: number; g: number }> = [{ row: origin.row, col: origin.col, g: 0 }];
  gen.set(coordId(kind, origin.row, origin.col), 0);

  while (queue.length) {
    const cur = queue.shift();
    if (!cur) break;
    for (const [nrow, ncol] of neighborsOf(kind, cur.row, cur.col)) {
      const id = coordId(kind, nrow, ncol);
      if (!byId.has(id) || gen.has(id)) continue;
      gen.set(id, cur.g + 1);
      queue.push({ row: nrow, col: ncol, g: cur.g + 1 });
    }
  }

  return tiles.map((tile) => ({
    ...tile,
    generation: gen.get(coordId(tile.kind, tile.row, tile.col)) ?? fallbackRing(kind, tile.row, tile.col),
  }));
}

function coordId(kind: Tile["kind"], row: number, col: number) {
  return `${kind}:${row},${col}`;
}

function neighborsOf(kind: Tile["kind"], row: number, col: number) {
  if (kind === "triangle") return triangleNeighbors(row, col);
  if (kind === "square") return squareNeighbors(row, col);
  return hexNeighbors(col, row);
}

function fallbackRing(kind: Tile["kind"], row: number, col: number) {
  if (kind === "square") return squareRingDistance(row, col);
  if (kind === "hexagon") return hexRingDistance(col, row);
  return Math.abs(row) + Math.abs(col);
}

export function indexVertices(tiles: Tile[], unit: number): VertexRecord[] {
  const map = new Map<string, VertexRecord>();
  for (const tile of tiles) {
    for (const point of tile.vertices) {
      const key = vertexKey(point, unit);
      const existing = map.get(key);
      if (existing) {
        if (!existing.tileIds.includes(tile.id)) existing.tileIds.push(tile.id);
      } else {
        map.set(key, { key, point, tileIds: [tile.id] });
      }
    }
  }
  return [...map.values()];
}

export function indexEdges(tiles: Tile[], unit: number): EdgeRecord[] {
  const map = new Map<string, EdgeRecord>();
  for (const tile of tiles) {
    const verts = tile.vertices;
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      if (!a || !b) continue;
      const key = edgeKey(a, b, unit);
      const existing = map.get(key);
      if (existing) {
        if (!existing.tileIds.includes(tile.id)) existing.tileIds.push(tile.id);
      } else {
        map.set(key, { key, a, b, tileIds: [tile.id], length: Math.hypot(a.x - b.x, a.y - b.y) });
      }
    }
  }
  return [...map.values()];
}

export function getTileNeighbors(tile: Tile, tiles: Tile[]): Tile[] {
  const wanted = new Set(neighborsOf(tile.kind, tile.row, tile.col).map(([r, c]) => coordId(tile.kind, r, c)));
  return tiles.filter((other) => wanted.has(coordId(other.kind, other.row, other.col)));
}

export function expectedMeetCount(kind: Tile["kind"]): number {
  if (kind === "triangle") return 6;
  if (kind === "square") return 4;
  return 3;
}

export function latticeVectors(kind: Tile["kind"], size: number) {
  if (kind === "triangle") {
    const h = (size * Math.sqrt(3)) / 2;
    return { ax: size, ay: 0, bx: size / 2, by: h };
  }
  if (kind === "square") {
    return { ax: size, ay: 0, bx: 0, by: size };
  }
  const r = size;
  return { ax: 1.5 * r, ay: 0, bx: 0.75 * r, by: (Math.sqrt(3) * r) / 2 };
}
