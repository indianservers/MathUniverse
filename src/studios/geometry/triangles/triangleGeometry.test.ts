import { describe, expect, it } from "vitest";
import {
  centroid,
  circumcenter,
  classifyByAngles,
  classifyBySides,
  constructRHS,
  constructSAS,
  constructASAc,
  constructAAS,
  constructSSS,
  dist,
  EXPLORER_PRESETS,
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
  it("preserves the supplied side and both angles for ASA and AAS", () => {
    const asa = constructASAc(52, 5.2, 58, { x: 0, y: 0 });
    const am = measureTriangle(asa.A, asa.B, asa.C);
    nearly(am.sides.AB, 5.2); nearly(am.angles.A, 52); nearly(am.angles.B, 58);
    const aas = constructAAS(52, 58, 4.4, { x: 0, y: 0 });
    const bm = measureTriangle(aas.A, aas.B, aas.C);
    nearly(bm.sides.BC, 4.4); nearly(bm.angles.A, 52); nearly(bm.angles.B, 58);
  });
  it("makes each named preset match its mathematical classification", () => {
    for (const name of ['scalene', 'isosceles', 'equilateral']) {
      const t = EXPLORER_PRESETS[name];
      expect(measureTriangle(t.A, t.B, t.C).bySides.toLowerCase()).toBe(name);
    }
    for (const name of ['right', 'acute', 'obtuse']) {
      const t = EXPLORER_PRESETS[name];
      expect(measureTriangle(t.A, t.B, t.C).byAngles.toLowerCase()).toBe(name);
    }
  });
  it("does not classify nearly equal sides or nearly right angles as exact cases", () => {
    const near = measureTriangle({ x: 0, y: 0 }, { x: 3, y: 0 }, { x: .01, y: 3.01 });
    expect(near.bySides).toBe("Scalene");
    expect(near.byAngles).toBe("Acute");
    nearly(near.angleSum, 180);
  });
  it("keeps a screenshot-shaped scalene construction mathematically consistent", () => {
    const t = constructSSS(8.21, 8.76, 7.88, { x: 0, y: 0 });
    const m = measureTriangle(t.A, t.B, t.C);
    nearly(m.sides.AB, 7.88); nearly(m.sides.BC, 8.21); nearly(m.sides.CA, 8.76);
    nearly(m.perimeter, 24.85); nearly(m.angleSum, 180);
    expect(m.bySides).toBe("Scalene"); expect(m.byAngles).toBe("Acute");
  });
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
