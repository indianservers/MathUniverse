import { describe, expect, it } from "vitest";
import {
  centroid,
  circumcenter,
  classifyByAngles,
  classifyBySides,
  constructRHS,
  constructSAS,
  constructSSS,
  dist,
  incenter,
  inradius,
  measureTriangle,
  orthocenter,
  perpDistance,
  ranking,
  sideRatios,
  ssaSolutions,
  triangleAngles,
  triangleArea,
  triangleInequality,
  trianglePerimeter,
} from "./triangleGeometry";

const nearly = (a: number, b: number, eps = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(eps);

describe("triangleGeometry", () => {
  const eq = { A: { x: 0, y: 0 }, B: { x: 2, y: 0 }, C: { x: 1, y: Math.sqrt(3) } };
  const right = { A: { x: 0, y: 0 }, B: { x: 3, y: 0 }, C: { x: 0, y: 4 } };

  it("keeps angle sum at 180° and classifies equilateral/right triangles", () => {
    const eqM = measureTriangle(eq.A, eq.B, eq.C);
    nearly(eqM.angleSum, 180, 1e-6);
    nearly(eqM.angles.A, 60, 1e-6);
    expect(eqM.bySides).toBe("Equilateral");
    expect(eqM.byAngles).toBe("Acute");
    const rt = measureTriangle(right.A, right.B, right.C);
    expect(classifyByAngles(rt.angles.A, rt.angles.B, rt.angles.C)).toBe("Right");
    nearly(rt.angles.A, 90, 1e-6);
    nearly(trianglePerimeter(right.A, right.B, right.C), 12);
    nearly(triangleArea(right.A, right.B, right.C), 6);
  });

  it("places centroid, circumcenter, incenter, and orthocenter correctly", () => {
    const G = centroid(eq.A, eq.B, eq.C);
    const M = { x: (eq.B.x + eq.C.x) / 2, y: (eq.B.y + eq.C.y) / 2 };
    nearly(dist(eq.A, G) / dist(G, M), 2, 1e-6);

    const O = circumcenter(right.A, right.B, right.C)!;
    nearly(O.x, 1.5);
    nearly(O.y, 2);
    nearly(dist(O, right.A), dist(O, right.B));
    nearly(dist(O, right.A), dist(O, right.C));

    const I = incenter(right.A, right.B, right.C);
    const r = inradius(right.A, right.B, right.C);
    nearly(perpDistance(I, right.A, right.B), r, 1e-6);
    nearly(perpDistance(I, right.B, right.C), r, 1e-6);
    nearly(perpDistance(I, right.C, right.A), r, 1e-6);

    const H = orthocenter(right.A, right.B, right.C)!;
    nearly(H.x, 0, 1e-6);
    nearly(H.y, 0, 1e-6);
  });

  it("constructs SSS/SAS/RHS and detects SSA ambiguity", () => {
    const sss = constructSSS(5, 5, 6, { x: 0, y: 0 });
    expect(sss.ok).toBe(true);
    nearly(dist(sss.B, sss.C), 5, 1e-6);
    const sas = constructSAS(4, 60, 4, { x: 0, y: 0 });
    nearly(triangleAngles(sas.A, sas.B, sas.C).A, 60, 1e-6);
    const rhs = constructRHS(5, 3, { x: 0, y: 0 });
    nearly(dist(rhs.A, rhs.B), 5, 1e-6);
    const amb = ssaSolutions(40, 3, 4.2, { x: 0, y: 0 });
    expect(amb.length).toBe(2);
  });

  it("checks triangle inequality, similarity ratios, and side-angle ranking", () => {
    expect(triangleInequality(3, 4, 5).valid).toBe(true);
    expect(triangleInequality(1, 2, 3).degenerate).toBe(true);
    expect(triangleInequality(1, 2, 4).valid).toBe(false);
    const p = { A: { x: 0, y: 0 }, B: { x: 2, y: 0 }, C: { x: 0, y: 2 } };
    const q = { A: { x: 0, y: 0 }, B: { x: 3, y: 0 }, C: { x: 0, y: 3 } };
    const r = sideRatios(p, q);
    nearly(r.DE_AB, 1.5);
    nearly(r.EF_BC, 1.5);
    nearly(r.DF_AC, 1.5);
    const rank = ranking(right.A, right.B, right.C);
    expect(rank.longest.name).toBe("BC");
    expect(rank.longest.angle).toBe("A");
    expect(classifyBySides(3, 4, 5)).toBe("Scalene");
  });
});
