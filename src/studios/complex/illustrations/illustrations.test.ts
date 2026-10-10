import { describe, expect, it } from "vitest";
import { studioMockups } from "../../mockup/studioMockupCatalog";
import { addC, modC, mulC } from "../complexLabMath";
import { affine, helix, illustrationSlot, intersects, phasor, polar, rootsOfUnity, rotateI } from "./geometry";
import { mandelbrotSamples } from "./fractal";
import { complexIllustrationRegistry } from "./scenes";

describe("Complex card illustration mathematics", () => {
  it("preserves exact vector addition and parallelogram endpoints throughout animation", () => {
    for (const p of [0, .2, .5, .72, .99]) {
      const marks = complexIllustrationRegistry.arithmetic.scene(p), get = (key: string) => marks.find(m => m.key === key)!.attrs;
      const a = get("z1"), b = get("z2"), c = get("sum");
      expect(Number(c.x2)).toBeCloseTo(Number(a.x2) + Number(b.x2) - 100, 10);
      expect(Number(c.y2)).toBeCloseTo(Number(a.y2) + Number(b.y2) - 101, 10);
      expect(get("parallel1").x2).toBe(c.x2); expect(get("parallel2").y2).toBe(c.y2);
    }
  });
  it("multiplication by i preserves modulus and rotates counterclockwise", () => {
    const z = { re: 3, im: 4 }, rotated = rotateI(z);
    expect(rotated).toEqual({ re: -4, im: 3 }); expect(modC(rotated)).toBe(modC(z));
    const endpoint = complexIllustrationRegistry.rotation.scene(.5).find(m => m.key === "rotating")!.attrs;
    expect(endpoint.x2).toBeCloseTo(100, 10); expect(endpoint.y2).toBeCloseTo(48, 10);
  });
  it("all displayed points are actual eighth roots of unity", () => {
    for (const root of rootsOfUnity(8)) {
      let power = { re: 1, im: 0 }; for (let n = 0; n < 8; n++) power = mulC(power, root);
      expect(power.re).toBeCloseTo(1, 10); expect(power.im).toBeCloseTo(0, 10); expect(modC(root)).toBeCloseTo(1, 10);
    }
  });
  it("affine images have the exact transformed center and scaled radius", () => {
    const center = { re: -.5, im: -.3 }, a = polar(.8, .4), b = { re: .3, im: .5 };
    const mappedCenter = affine(center, a, b);
    for (const angle of [0, 1, 2, 4]) {
      const image = affine(addC(center, polar(.74, angle)), a, b);
      expect(Math.hypot(image.re - mappedCenter.re, image.im - mappedCenter.im)).toBeCloseTo(.74 * modC(a), 10);
    }
  });
  it("wave voltages and phase-shifted currents come directly from phasor projections", () => {
    for (const angle of [0, .5, 1, 3, 5]) {
      const state = phasor(angle); expect(state.voltage).toBe(state.z.im);
      expect(state.current).toBeCloseTo(polar(1, angle - Math.PI / 4).im, 12);
    }
  });
  it("helix and circular projection share the same phase", () => {
    for (const t of [0, Math.PI / 2, 2 * Math.PI, 6 * Math.PI]) {
      const [x, y] = helix(t, .1); expect(x).toBeCloseTo(100 + 35 * Math.cos(t + .1), 10);
      expect(y + 6.5 * t).toBeCloseTo(154 - 10 * Math.sin(t + .1), 10);
    }
  });
  it("computes authentic bounded Mandelbrot escape-time samples", () => {
    const pixels = mandelbrotSamples(); expect(pixels).toHaveLength(192 * 160);
    expect(pixels[79 * 192 + 132]).toBe(112); expect(pixels[0]).toBeLessThan(8);
    expect(Math.max(...pixels)).toBe(112);
  });
  it("places the illustration in empty space without changing text geometry", () => {
    const obstacles = [{ x: 16, y: 34, width: 160, height: 25 }, { x: 16, y: 85, width: 120, height: 70 }, { x: 16, y: 190, width: 280, height: 60 }];
    const slot = illustrationSlot(328, 282, obstacles);
    expect(slot.width).toBeGreaterThan(80); expect(slot.height).toBeGreaterThan(90);
    obstacles.forEach(o => expect(intersects(slot, o)).toBe(false));
  });
  it("covers exactly the nine configured home labs with distinct scene functions", () => {
    const ids = studioMockups["complex-numbers"].pages.filter(p => p.id !== "home").map(p => p.id).sort();
    expect(Object.keys(complexIllustrationRegistry).sort()).toEqual(ids);
    expect(new Set(Object.values(complexIllustrationRegistry).map(v => v.scene)).size).toBe(9);
  });
  it.each(Object.keys(complexIllustrationRegistry) as Array<keyof typeof complexIllustrationRegistry>)("%s generates finite, stable geometry", kind => {
    const scene = complexIllustrationRegistry[kind].scene, base = scene(.72).map(m => m.key).sort();
    expect(new Set(base).size).toBe(base.length);
    for (const phase of [0, .1, .5, .72, .99]) {
      expect(scene(phase).map(m => m.key).sort()).toEqual(base);
      expect(JSON.stringify(scene(phase))).not.toMatch(/NaN|Infinity|undefined/);
    }
  });
});
