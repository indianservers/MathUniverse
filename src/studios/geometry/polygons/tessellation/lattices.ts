import { SQRT3, centroid } from "./math";
import type { Bounds, Point, Tile } from "./types";

const MAX_TILES = 900;

function capNearest(tiles: Omit<Tile, "generation">[], bounds: Bounds): Omit<Tile, "generation">[] {
  if (tiles.length <= MAX_TILES) return tiles;
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  return [...tiles]
    .sort((a, b) => Math.hypot(a.center.x - cx, a.center.y - cy) - Math.hypot(b.center.x - cx, b.center.y - cy))
    .slice(0, MAX_TILES);
}

function triangleHeight(side: number) {
  return (side * SQRT3) / 2;
}

export function triangleVertices(row: number, col: number, side: number): Point[] {
  const h = triangleHeight(side);
  const x = col * (side / 2);
  const y = row * h;
  const up = (row + col) % 2 === 0;
  const raw = up
    ? [
        { x, y: y + h },
        { x: x + side / 2, y },
        { x: x + side, y: y + h },
      ]
    : [
        { x, y },
        { x: x + side / 2, y: y + h },
        { x: x + side, y },
      ];
  const origin = centroid(triangleSeed(side));
  return raw.map((p) => ({ x: p.x - origin.x, y: p.y - origin.y }));
}

function triangleSeed(side: number): Point[] {
  const h = triangleHeight(side);
  return [
    { x: 0, y: h },
    { x: side / 2, y: 0 },
    { x: side, y: h },
  ];
}

export function generateTriangleTiles(bounds: Bounds, side: number): Omit<Tile, "generation">[] {
  const h = triangleHeight(side);
  const colMin = Math.floor((bounds.minX - side) / (side / 2)) - 2;
  const colMax = Math.ceil((bounds.maxX + side) / (side / 2)) + 2;
  const rowMin = Math.floor((bounds.minY - h) / h) - 2;
  const rowMax = Math.ceil((bounds.maxY + h) / h) + 2;
  const tiles: Omit<Tile, "generation">[] = [];
  for (let row = rowMin; row <= rowMax; row++) {
    for (let col = colMin; col <= colMax; col++) {
      const vertices = triangleVertices(row, col, side);
      const center = centroid(vertices);
      const up = (row + col) % 2 === 0;
      tiles.push({
        id: `t:${row},${col}`,
        kind: "triangle",
        row,
        col,
        orientation: up ? "up" : "down",
        vertices,
        center,
        side,
        colorIndex: up ? 0 : 1,
      });
    }
  }
  return capNearest(tiles, bounds);
}

export function triangleNeighbors(row: number, col: number): Array<[number, number]> {
  const up = (row + col) % 2 === 0;
  return [
    [row, col - 1],
    [row, col + 1],
    up ? [row + 1, col] : [row - 1, col],
  ];
}

export function generateSquareTiles(bounds: Bounds, side: number): Omit<Tile, "generation">[] {
  const colMin = Math.floor(bounds.minX / side) - 2;
  const colMax = Math.ceil(bounds.maxX / side) + 1;
  const rowMin = Math.floor(bounds.minY / side) - 2;
  const rowMax = Math.ceil(bounds.maxY / side) + 1;
  const tiles: Omit<Tile, "generation">[] = [];
  for (let row = rowMin; row <= rowMax; row++) {
    for (let col = colMin; col <= colMax; col++) {
      const x = col * side - side / 2;
      const y = row * side - side / 2;
      const vertices = [
        { x, y },
        { x: x + side, y },
        { x: x + side, y: y + side },
        { x, y: y + side },
      ];
      const center = { x: x + side / 2, y: y + side / 2 };
      tiles.push({
        id: `s:${row},${col}`,
        kind: "square",
        row,
        col,
        orientation: "none",
        vertices,
        center,
        side,
        colorIndex: (row + col) & 1,
      });
    }
  }
  return capNearest(tiles, bounds);
}

export function squareNeighbors(row: number, col: number): Array<[number, number]> {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
}

export function squareRingDistance(row: number, col: number): number {
  return Math.max(Math.abs(row), Math.abs(col));
}

export function hexMetrics(radius: number) {
  return {
    width: 2 * radius,
    height: SQRT3 * radius,
    horiz: 1.5 * radius,
    vert: SQRT3 * radius,
  };
}

export function hexCenter(col: number, row: number, radius: number): Point {
  const { horiz, vert } = hexMetrics(radius);
  return {
    x: col * horiz,
    y: row * vert + (col % 2 !== 0 ? vert / 2 : 0),
  };
}

export function hexVertices(center: Point, radius: number): Point[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * 60 * i;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
}

export function generateHexTiles(bounds: Bounds, radius: number): Omit<Tile, "generation">[] {
  const { horiz, vert } = hexMetrics(radius);
  const colMin = Math.floor((bounds.minX - radius) / horiz) - 2;
  const colMax = Math.ceil((bounds.maxX + radius) / horiz) + 2;
  const rowMin = Math.floor((bounds.minY - vert) / vert) - 2;
  const rowMax = Math.ceil((bounds.maxY + vert) / vert) + 2;
  const tiles: Omit<Tile, "generation">[] = [];
  for (let col = colMin; col <= colMax; col++) {
    for (let row = rowMin; row <= rowMax; row++) {
      const center = hexCenter(col, row, radius);
      tiles.push({
        id: `h:${row},${col}`,
        kind: "hexagon",
        row,
        col,
        orientation: "none",
        vertices: hexVertices(center, radius),
        center,
        side: radius,
        colorIndex: ((col + 2 * row) % 3 + 3) % 3,
      });
    }
  }
  return capNearest(tiles, bounds);
}

/** Odd-q (flat-top) axial neighbors. */
export function hexNeighbors(col: number, row: number): Array<[number, number]> {
  const odd = col & 1;
  const deltas = odd
    ? [
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1],
        [-1, 0],
        [-1, 1],
      ]
    : [
        [1, -1],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
      ];
  return deltas.map(([dc, dr]) => [row + dr, col + dc]);
}

export function oddqToCube(col: number, row: number) {
  const x = col;
  const z = row - (col - (col & 1)) / 2;
  const y = -x - z;
  return { x, y, z };
}

export function hexRingDistance(col: number, row: number): number {
  const a = oddqToCube(col, row);
  return (Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z)) / 2;
}
