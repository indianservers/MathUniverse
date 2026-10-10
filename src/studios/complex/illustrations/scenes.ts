import { addC, type C } from "../complexLabMath";
import { affine, helix, path, phasor, plot, polar, rootsOfUnity, sample, smooth, TAU, type Point } from "./geometry";
export type Mark = { tag: "path" | "line" | "circle" | "text"; key: string; attrs: Record<string, string | number>; text?: string };
export type Scene = (phase: number) => Mark[];
const cyan = "#2eeaff", pink = "#ec6dff", blue = "#6574ff";
const node = (tag: Mark["tag"], key: string, attrs: Mark["attrs"], text?: string): Mark => ({ tag, key, attrs, text });
const line = (key: string, a: Point, b: Point, stroke = cyan, extra: Mark["attrs"] = {}) => node("line", key, { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke, strokeWidth: 1.5, ...extra });
const arrow = (key: string, a: Point, b: Point, color = cyan, extra: Mark["attrs"] = {}) => line(key, a, b, color, { "data-arrow": "true", strokeWidth: 2.4, ...extra });
const trace = (key: string, d: string, stroke = cyan, extra: Mark["attrs"] = {}) => node("path", key, { d, fill: "none", stroke, strokeWidth: 1.6, ...extra });
const circle = (key: string, center: Point, r: number, stroke = cyan, extra: Mark["attrs"] = {}) => node("circle", key, { cx: center[0], cy: center[1], r, fill: "none", stroke, strokeWidth: 1.3, ...extra });
const dot = (key: string, point: Point, fill = cyan, r = 3) => circle(key, point, r, "#efffff", { fill, strokeWidth: .6 });
const label = (key: string, value: string, x = 113, y = 28, extra: Mark["attrs"] = {}) => node("text", key, { x, y, fill: "#e5f6ff", fontSize: 12, fontFamily: "Georgia, serif", fontStyle: "italic", ...extra }, value);
const origin: Point = [100, 101];
const axes = (): Mark[] => [arrow("real", [30, 101], [180, 101], "#b8dcff", { strokeWidth: .8 }), arrow("imaginary", [100, 159], [100, 27], "#b8dcff", { strokeWidth: .8 }), label("Re", "Re", 171, 115, { fontSize: 10 }), label("Im", "Im", 105, 31, { fontSize: 10 })];
const grid = (): Mark[] => [...Array.from({ length: 6 }, (_, i) => line(`grid-a${i}`, [30 + i * 14, 117 + i * 3], [99 + i * 14, 94 + i * 3], "#348acc", { strokeWidth: .5, opacity: .25 })), ...Array.from({ length: 5 }, (_, i) => line(`grid-b${i}`, [45 + i * 14, 113 - i * 4], [108 + i * 14, 148 - i * 4], "#348acc", { strokeWidth: .5, opacity: .25 }))];
const argand: Scene = p => {
  const a = .8 + .16 * Math.sin(TAU * p), b = 1 + .24 * Math.sin(TAU * p + .5), growth = .72 + .28 * (.5 - .5 * Math.cos(TAU * p));
  const z = { re: a * growth, im: b * growth }, point = plot(z);
  return [...grid(), ...axes(), line("guide-x", plot({ re: z.re, im: 0 }), point, blue, { strokeDasharray: "3 3", opacity: .7 }), line("guide-y", plot({ re: 0, im: z.im }), point, pink, { strokeDasharray: "3 3", opacity: .7 }), arrow("z", origin, point), dot("point", point), label("formula", "z = a + bi", 120, 54)];
};
const arithmetic: Scene = p => {
  const grow = (start: number) => .1 + .9 * smooth((p - start) / .22);
  const z1 = { re: .55 * grow(0), im: 1.12 * grow(0) }, z2 = { re: .9 * grow(.18), im: .25 * grow(.18) }, sum = addC(z1, z2);
  return [...grid(), ...axes(), arrow("z1", origin, plot(z1), pink), arrow("z2", origin, plot(z2)), line("parallel1", plot(z1), plot(sum), cyan, { strokeDasharray: "3 3", opacity: .15 + .6 * grow(.35) }), line("parallel2", plot(z2), plot(sum), pink, { strokeDasharray: "3 3", opacity: .15 + .6 * grow(.35) }), arrow("sum", origin, plot(sum), cyan, { strokeWidth: 2.8, opacity: grow(.5) }), dot("tip", plot(sum)), label("z1-label", "z₁", 107, 39, { fill: pink }), label("z2-label", "z₂", 148, 95), label("sum-label", "z₁ + z₂", 140, 51)];
};
const polarForms: Scene = p => {
  const angle = .38 + .8 * (.5 - .5 * Math.cos(TAU * p)), z = polar(1.25, angle), point = plot(z);
  return [...axes(), circle("circle", origin, 56, cyan, { opacity: .7 }), trace("arc", path(sample(a => plot(polar(.35, a)), 0, angle)), pink, { strokeWidth: 2.2 }), arrow("radius", origin, point), line("projection", plot({ re: z.re, im: 0 }), point, pink, { strokeDasharray: "2 3", opacity: .65 }), dot("point", point), label("theta", "θ", 117, 96, { fill: pink }), label("radius-label", "r", point[0] - 10, point[1] + 15), label("formula", "r(cos θ + i sin θ)", 47, 171, { fontSize: 10 })];
};
const rotation: Scene = p => {
  const q = .5 - .5 * Math.cos(TAU * p), angle = Math.PI / 2 * smooth(q), point = plot(polar(1, angle), 53);
  return [...axes(), circle("unit", origin, 53, cyan, { opacity: .75 }), arrow("start", origin, plot(polar(1, 0), 53), pink, { opacity: .6 }), trace("rotation-arc", path(sample(a => plot(polar(.72, a), 53), 0, angle)), cyan, { strokeWidth: 2 }), arrow("rotating", origin, point, pink), dot("point", point, pink), label("formula", "iz = +90°", 112, 25), label("angle", `${Math.round(angle * 180 / Math.PI)}°`, 123, 91, { fill: pink })];
};
const roots: Scene = p => {
  // Do not rotate the set away from its actual roots: highlights orbit instead.
  const points = rootsOfUnity(8).map(z => plot(z, 53)), active = Math.floor(p * 8) % 8;
  return [...axes(), circle("unit", origin, 53, cyan, { opacity: .5 }), ...points.map((pt, i) => line(`edge${i}`, pt, points[(i + 1) % 8], i % 2 ? cyan : pink, { opacity: .2 + .7 * smooth((p * 8 - i + 8) % 8), strokeWidth: 1.4 })), ...points.map((pt, i) => circle(`root${i}`, pt, active === i ? 4.6 : 3.1, pink, { fill: active === i ? "#f2baff" : "#a755ee", opacity: .4 + .6 * smooth((p * 8 - i + 8) % 8) })), label("formula", "z⁸ = 1", 127, 25)];
};
const euler: Scene = p => {
  const turn = .12 * Math.sin(TAU * p), t = p * 6 * Math.PI, point = helix(t, turn), projected: Point = [100 + 35 * Math.cos(t + turn), 157 - 10 * Math.sin(t + turn)];
  return [arrow("axis", [100, 163], [100, 16], "#b7ddff", { strokeWidth: .9 }), trace("projection-ring", path(sample(a => [100 + 35 * Math.cos(a), 157 - 10 * Math.sin(a)], 0, TAU)), blue, { opacity: .5 }), trace("helix-base", path(sample(a => helix(a, turn), 0, 6 * Math.PI, 210)), blue, { opacity: .25 }), trace("helix", path(sample(a => helix(a, turn), 0, t, 210)), cyan, { strokeWidth: 2.6, "data-spectrum": "true" }), line("projection", point, projected, pink, { strokeDasharray: "2 3", opacity: .55 }), dot("point", point, pink, 3.4), dot("projection-point", projected), label("formula", "eⁱθ = cos θ + i sin θ", 36, 176, { fontSize: 10 })];
};
const loci: Scene = p => {
  const q = .5 - .5 * Math.cos(TAU * p), a = polar(.6 + .35 * q, .35 + .2 * q), b = { re: .5 * q, im: .6 * q }, center: C = { re: -.5, im: -.3 }, mapped = affine(center, a, b), r = .74;
  const pt = addC(center, polar(r, TAU * p)), image = affine(pt, a, b);
  return [...grid(), ...axes(), circle("original", plot(center), r * 45, cyan, { opacity: .8 }), circle("mapped", plot(mapped), r * Math.hypot(a.re, a.im) * 45, pink), line("radius1", plot(center), plot(pt), cyan, { strokeWidth: .8 }), line("radius2", plot(mapped), plot(image), pink, { strokeWidth: .8 }), line("mapping", plot(pt), plot(image), "#9bbcff", { strokeDasharray: "2 3" }), dot("center", plot(center), cyan), dot("mapped-center", plot(mapped), pink), dot("point", plot(pt)), dot("image", plot(image), pink), label("formula", "w = az + b", 112, 27)];
};
const fractals: Scene = _p => [label("formula", "zₙ₊₁ = zₙ² + c", 55, 170, { fontSize: 11 })];
const waves: Scene = p => {
  const angle = TAU * p, { z, voltage, current } = phasor(angle), origin: Point = [144, 99], point: Point = [144 + 30 * z.re, 99 - 30 * z.im];
  const sine = (offset: number) => path(sample(t => [20 + t * 76, 99 - 23 * Math.sin(angle - t * TAU * 1.35 + offset)], 0, 1));
  return [circle("phasor-circle", origin, 31), arrow("real", [107, 99], [184, 99], "#b8dcff", { strokeWidth: .6 }), arrow("imaginary", [144, 137], [144, 60], "#b8dcff", { strokeWidth: .6 }), trace("wave-v", sine(0), pink, { strokeWidth: 1.8 }), trace("wave-i", sine(-Math.PI / 4), cyan, { strokeWidth: 1.1, opacity: .65 }), arrow("voltage", origin, point, pink), arrow("current", origin, [144 + 23 * Math.cos(angle - Math.PI / 4), 99 - 23 * current]), line("link", [20, 99 - 23 * voltage], [144, 99 - 30 * voltage], pink, { strokeDasharray: "2 3", opacity: .45 }), dot("point", point, pink), label("V", "V", 177, 54, { fill: pink }), label("I", "I", 104, 130, { fill: cyan }), label("formula", "V = sin θ", 43, 163, { fontSize: 11 })];
};
export const complexIllustrationRegistry = {
  "argand-plane": { scene: argand, label: "Argand vector with consistent real and imaginary projection guides" },
  arithmetic: { scene: arithmetic, label: "Complex-vector addition with exact parallelogram construction" },
  "polar-forms": { scene: polarForms, label: "Polar radius, rotating angle and endpoint projections" },
  rotation: { scene: rotation, label: "Multiplication by i rotates a vector exactly 90 degrees counterclockwise" },
  roots: { scene: roots, label: "Eight exact roots of unity with polygon edges and cycling highlights" },
  euler: { scene: euler, label: "Projected exponential helix with synchronized circular motion" },
  loci: { scene: loci, label: "Circle transformed by w=az+b with correct center and radius" },
  fractals: { scene: fractals, label: "Computed Mandelbrot set with cached escape-time colors and gentle boundary zoom" },
  "waves-circuits": { scene: waves, label: "AC voltage and current waves synchronized with complex phasors" },
} as const;
export type ComplexIllustrationKind = keyof typeof complexIllustrationRegistry;
