import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { studioRoutes } from "../../../pages/calculusStudioSession";
import { contact, curve, derivative, gamma, geometricPartialSum, jacobian, mappedArea, mesh, odeSlope, odeSolution, revolutionRadius, surface, surfaceGradient, tangentPlane, taylorSurface, triangularCentroid, warp } from "./math";
import { illustrationRegistry } from "./scenes";

const numericDerivative = (f: (x: number) => number, x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
describe("Calculus thumbnail mathematics", () => {
  it("computes tangents from the actual illustrated parabola", () => {
    for (const x of [-.7, 0, .65]) expect(derivative(x)).toBeCloseTo(numericDerivative(curve, x), 7);
  });
  it("the solution satisfies every sampled slope-field location", () => {
    for (const x of [0, .5, 1, 2, 2.6]) expect(numericDerivative(odeSolution, x)).toBeCloseTo(odeSlope(x, odeSolution(x)), 7);
  });
  it("the displayed surface gradient is correct", () => {
    const [x, y] = [.2, -.35], [dx, dy] = surfaceGradient(x, y);
    expect(dx).toBeCloseTo(numericDerivative(u => surface(u, y), x), 7);
    expect(dy).toBeCloseTo(numericDerivative(v => surface(x, v), y), 7);
  });
  it("the Taylor plane has the right contact value and both partial derivatives", () => {
    expect(tangentPlane(...contact)).toBeCloseTo(taylorSurface(...contact), 12);
    expect(numericDerivative(x => tangentPlane(x, contact[1]), contact[0])).toBeCloseTo(.7 * contact[0], 9);
    expect(numericDerivative(y => tangentPlane(contact[0], y), contact[1])).toBeCloseTo(.7 * contact[1], 9);
  });
  it("Jacobian matches the coordinate map and integrated region area", () => {
    const a = .85, v = .25;
    expect(numericDerivative(u => warp(u, v, a)[0], .5)).toBeCloseTo(jacobian(v, a), 9);
    const integral = .5 * Array.from({ length: 1000 }, (_, i) => jacobian((i + .5) * .5 / 1000, a) * .5 / 1000).reduce((s, v) => s + v, 0);
    expect(mappedArea(0, .5, 0, .5, a)).toBeCloseTo(integral, 7);
    expect(mappedArea(0, .5, 0, .5, 0)).toBe(.25);
  });
  it("uses a convergent geometric series with correct partial sums", () => {
    for (const n of [1, 4, 10]) expect(geometricPartialSum(n)).toBeCloseTo(Array.from({ length: n }, (_, i) => 2 ** -(i + 1)).reduce((s, x) => s + x, 0), 12);
    expect(2 ** -2 / 2 ** -1).toBe(.5);
  });
  it("Gamma agrees with factorial values, recurrence and √π", () => {
    expect(gamma(.5)).toBeCloseTo(Math.sqrt(Math.PI), 10);
    expect(gamma(1)).toBeCloseTo(1, 10); expect(gamma(4)).toBeCloseTo(6, 10);
    expect(gamma(2.7)).toBeCloseTo(1.7 * gamma(1.7), 10);
  });
  it("the lamina marker uses its uniform triangular centroid", () => {
    expect(triangularCentroid).toEqual([1 / 3, 1 / 3]);
  });
  it("generates a genuine closed-radius revolution profile and nondegenerate 3D mesh", () => {
    expect(revolutionRadius(0)).toBeLessThan(revolutionRadius(1));
    const faces = mesh((x, y) => [x, y, surface(x, y)], -1, 1, -1, 1);
    expect(faces).toHaveLength(192);
    faces.forEach(f => expect(Math.hypot(...f.normal)).toBeCloseTo(1, 9));
  });
  it("constrained maximum has parallel gradients", () => {
    const norm = Math.hypot(.2, .65), [x, y] = [.2 / norm, .65 / norm];
    expect(x * x + y * y).toBeCloseTo(1, 12);
    expect(-2 * (x - .2) * (2 * y) + 2 * (y - .65) * (2 * x)).toBeCloseTo(0, 12);
  });
});
describe("Illustration registry and animation frames", () => {
  it("covers all 19 cards and the additional Advanced route without repeating scenes", () => {
    const source = readFileSync(new URL("../../../pages/CalculusStudio.tsx", import.meta.url), "utf8");
    const cards = source.split("const HOME_TOPIC_CARDS = [")[1].split("] as const")[0];
    const keys = [...cards.matchAll(/page: "([^"]+)"/g)].map(m => m[1]);
    expect(keys).toHaveLength(19);
    for (const key of Object.keys(studioRoutes).filter(k => k !== "home")) expect(illustrationRegistry).toHaveProperty(key);
    expect(new Set(Object.values(illustrationRegistry).map(e => e.scene)).size).toBe(20);
    expect(keys.filter(k => illustrationRegistry[k as keyof typeof illustrationRegistry].dimension === 3)).toHaveLength(4);
  });
  it.each(Object.keys(illustrationRegistry) as Array<keyof typeof illustrationRegistry>)("%s has stable nodes, finite geometry and a meaningful static frame", kind => {
    const scene = illustrationRegistry[kind].scene;
    const base = scene(.86, "test"), keys = base.map(m => m.key).sort();
    expect(base.length).toBeGreaterThan(5);
    expect(new Set(keys).size).toBe(keys.length);
    for (const p of [0, .1, .5, .78, .99]) {
      const frame = scene(p, "test");
      expect(frame.map(m => m.key).sort()).toEqual(keys);
      expect(JSON.stringify(frame)).not.toMatch(/NaN|Infinity|undefined/);
    }
    expect(JSON.stringify(scene(.1, "test"))).not.toBe(JSON.stringify(scene(.5, "test")));
  });
});
