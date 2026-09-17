import { describe, expect, it } from "vitest";
import { assignGenerations, expectedMeetCount, indexEdges, indexVertices } from "./adjacency";
import { generateHexTiles, generateSquareTiles, generateTriangleTiles, hexCenter, hexMetrics } from "./lattices";
import { dist, regularInteriorAngle, regularTessellationCheck } from "./math";
import { parsePolygonMode } from "../polygonMode";

const nearly = (a: number, b: number, eps = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(eps);

const field = { minX: -220, minY: -220, maxX: 220, maxY: 220 };

describe("regular tessellation arithmetic", () => {
  it("accepts triangle, square, and hexagon and rejects 5, 7, 8", () => {
    const tri = regularTessellationCheck(3);
    nearly(tri.interior, 60);
    expect(tri.meetingCount).toBe(6);
    nearly(6 * 60, 360);
    expect(tri.tessellates).toBe(true);

    const sq = regularTessellationCheck(4);
    nearly(sq.interior, 90);
    expect(sq.meetingCount).toBe(4);
    nearly(4 * 90, 360);
    expect(sq.tessellates).toBe(true);

    const hex = regularTessellationCheck(6);
    nearly(hex.interior, 120);
    expect(hex.meetingCount).toBe(3);
    nearly(3 * 120, 360);
    expect(hex.tessellates).toBe(true);

    const pent = regularTessellationCheck(5);
    nearly(pent.interior, 108);
    nearly(pent.k, 360 / 108);
    expect(pent.tessellates).toBe(false);
    nearly(pent.gapDeg, 36);

    const hept = regularTessellationCheck(7);
    nearly(hept.interior, ((7 - 2) * 180) / 7);
    expect(hept.tessellates).toBe(false);

    const oct = regularTessellationCheck(8);
    nearly(oct.interior, 135);
    nearly(oct.k, 360 / 135);
    expect(oct.tessellates).toBe(false);
  });

  it("matches interior-angle formula for n = 3..12", () => {
    for (let n = 3; n <= 12; n++) {
      nearly(regularInteriorAngle(n), ((n - 2) * 180) / n);
    }
  });
});

describe("triangle lattice", () => {
  it("shares exact edges and meets six triangles at an interior vertex", () => {
    const side = 40;
    const raw = generateTriangleTiles(field, side);
    const tiles = assignGenerations(raw, "triangle", "expand");
    expect(tiles.length).toBeGreaterThan(40);
    const verts = indexVertices(tiles, side);
    const interior = verts.filter((v) => v.tileIds.length === 6);
    expect(interior.length).toBeGreaterThan(0);
    expect(expectedMeetCount("triangle")).toBe(6);

    const edges = indexEdges(tiles, side);
    const shared = edges.filter((e) => e.tileIds.length === 2);
    expect(shared.length).toBeGreaterThan(10);
    for (const edge of shared.slice(0, 8)) {
      nearly(edge.length, side, 1e-6);
    }

    const sample = tiles.find((t) => t.orientation === "up");
    const neighbor = tiles.find((t) => t.row === sample?.row && t.col === (sample?.col ?? 0) + 1);
    expect(sample && neighbor).toBeTruthy();
    const sharedVerts = sample!.vertices.filter((p) =>
      neighbor!.vertices.some((q) => dist(p, q) < 1e-6),
    );
    expect(sharedVerts.length).toBe(2);
  });
});

describe("square lattice", () => {
  it("forms a grid where four squares meet and rings expand by Chebyshev distance", () => {
    const side = 36;
    const raw = generateSquareTiles(field, side);
    const tiles = assignGenerations(raw, "square", "expand");
    const verts = indexVertices(tiles, side);
    expect(verts.some((v) => v.tileIds.length === 4)).toBe(true);
    const origin = tiles.reduce((b, t) => (Math.hypot(t.center.x, t.center.y) < Math.hypot(b.center.x, b.center.y) ? t : b));
    const ring1 = tiles.filter((t) => t.generation === 1);
    expect(ring1.length).toBe(8);
    expect(tiles.some((t) => t.row === origin.row && t.col === origin.col && t.generation === 0)).toBe(true);
  });
});

describe("hex lattice", () => {
  it("places flat-top hexagons with √3 r center spacing and 3-meet vertices", () => {
    const r = 28;
    const raw = generateHexTiles(field, r);
    const tiles = assignGenerations(raw, "hexagon", "expand");
    const origin = tiles.reduce((b, t) => (Math.hypot(t.center.x, t.center.y) < Math.hypot(b.center.x, b.center.y) ? t : b));
    const neighbor = tiles.find((t) => t.col === origin.col + 1 && t.row === origin.row);
    expect(neighbor).toBeTruthy();
    nearly(dist(origin.center, neighbor!.center), Math.sqrt(3) * r, 1e-6);
    nearly(hexMetrics(r).horiz, 1.5 * r);
    const verts = indexVertices(tiles, r);
    expect(verts.some((v) => v.tileIds.length === 3)).toBe(true);
    const c0 = hexCenter(0, 0, r);
    const c1 = hexCenter(1, 0, r);
    nearly(c1.y - c0.y, hexMetrics(r).vert / 2, 1e-6);
  });
});

describe("polygon mode aliases", () => {
  it("maps tessellation query values onto the tessellation tab", () => {
    expect(parsePolygonMode("tessellation")).toBe("tessellation");
    expect(parsePolygonMode("Tessellation")).toBe("tessellation");
    expect(parsePolygonMode("tiling")).toBe("tessellation");
    expect(parsePolygonMode(null)).toBe("regular");
  });
});
