import { clamp, contact, curve, derivative, ease, gamma, geometricPartialSum, graph, jacobian, limitFunction, mappedArea, mesh, odeSlope, odeSolution, path, projector, revolutionRadius, sample, surface, surfaceGradient, tangentPlane, TAU, taylorSurface, triangularCentroid, warp, type Facet, type Point, type Point3 } from "./math";

export type Mark = { tag: "path" | "circle" | "line" | "text" | "polygon" | "ellipse"; key: string; attrs: Record<string, string | number>; text?: string };
export type Scene = (phase: number, id: string) => Mark[];
const cyan = "#05bee9", blue = "#2879ff", purple = "#9945f6", orange = "#ff9b25";
const mark = (tag: Mark["tag"], key: string, attrs: Mark["attrs"], text?: string): Mark => ({ tag, key, attrs, text });
const line = (key: string, a: Point, b: Point, stroke = cyan, width = 1, extra: Mark["attrs"] = {}) => mark("line", key, { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke, strokeWidth: width, ...extra });
const text = (key: string, value: string, x = 122, y = 16, extra: Mark["attrs"] = {}) => mark("text", key, { x, y, className: "cli-label", fontSize: 12, ...extra }, value);
const dot = (key: string, p: Point, id: string, radius = 3.5, warm = false) => mark("circle", key, { cx: p[0], cy: p[1], r: radius, fill: `url(#${id}-${warm ? "sun" : "ball"})`, stroke: "#ffffff", strokeWidth: .65 });
const trace = (key: string, d: string, id: string, width = 2.2, extra: Mark["attrs"] = {}) => mark("path", key, { d, fill: "none", stroke: `url(#${id}-curve)`, strokeWidth: width, strokeLinecap: "round", strokeLinejoin: "round", ...extra });
const area = (key: string, d: string, id: string, extra: Mark["attrs"] = {}) => mark("path", key, { d, fill: `url(#${id}-area)`, stroke: cyan, strokeWidth: .6, ...extra });
const progress = (phase: number) => ease(Math.min(1, phase / .78));
const grid = (): Mark[] => [
  ...Array.from({ length: 6 }, (_, i) => line(`grid-v${i}`, [20 + i * 25, 12], [20 + i * 25, 69], "#77c9f4", .5, { opacity: .16 })),
  ...Array.from({ length: 4 }, (_, i) => line(`grid-h${i}`, [17, 16 + i * 17], [159, 16 + i * 17], "#77c9f4", .5, { opacity: .16 })),
];
const axes = (): Mark[] => [line("axis-x", [17, 65], [160, 65], "#73adf3", .8), line("axis-y", [24, 70], [24, 9], "#73adf3", .8), text("axis-x-label", "x", 160, 73, { fontSize: 7 }), text("axis-y-label", "y", 16, 12, { fontSize: 7 })];
const arrow = (key: string, a: Point, b: Point, color: string, id: string) => line(key, a, b, color, 1.6, { markerEnd: `url(#${id}-arrow)` });

const limits: Scene = (p, id) => {
  const f = (x: number) => graph(x, limitFunction(x));
  const center = f(.3), distance = .78 * (1 - progress(p)) + .02;
  return [...grid(), trace("function", path(sample(f, -1.1, 1.25)), id), line("guide", center, [center[0], 67], purple, .8, { strokeDasharray: "2 2", opacity: .5 }), dot("left", f(.3 - distance), id), dot("right", f(.3 + distance), id), mark("circle", "hole", { cx: center[0], cy: center[1], r: 3.2, fill: "var(--cli-paper)", stroke: blue, strokeWidth: 1.3 }), text("formula", "lim f(x)", 121, 17), text("limit", "x → a", 127, 27, { fontSize: 8 })];
};
const derivatives: Scene = (p, id) => {
  const x = -.7 + 1.35 * (.5 - .5 * Math.cos(TAU * p)), y = curve(x), f = (u: number) => graph(u, curve(u));
  return [...grid(), area("wash", path([...sample(f, -1, 1), graph(1, 0), graph(-1, 0)], true), id, { opacity: .35 }), trace("function", path(sample(f, -1, 1)), id), line("tangent", graph(x - .72, y - .72 * derivative(x)), graph(x + .72, y + .72 * derivative(x)), orange, 1.7), line("slope-rise", graph(x, y), graph(x, y + .2 * derivative(x)), purple, .8, { strokeDasharray: "2 2" }), line("slope-run", graph(x, y + .2 * derivative(x)), graph(x + .2, y + .2 * derivative(x)), purple, .8), dot("contact", graph(x, y), id), text("formula", "f′(x)", 133, 17)];
};
const applications: Scene = (p, id) => {
  const x = -1 + progress(p), point = graph(x, curve(x));
  return [...grid(), trace("function", path(sample(u => graph(u, curve(u)), -1, 1.15)), id), line("guide", graph(0, 1), graph(0, 0), purple, .7, { opacity: .4, strokeDasharray: "2 2" }), mark("circle", "pulse", { cx: point[0], cy: point[1], r: 6 + 2 * Math.sin(p * TAU), fill: orange, opacity: p > .78 ? .14 : 0 }), dot("optimum", point, id, 4.6, true), text("formula", "max f = 1", 113, 17, { opacity: .2 + .8 * ease((p - .55) / .2) })];
};
const integrals: Scene = (p, id) => {
  const q = progress(p), from = -.8, to = .8, end = from + (to - from) * q;
  const f = (x: number) => graph(x, curve(x));
  return [...grid(), ...axes(), area("whole", path([...sample(f, from, to), graph(to, 0), graph(from, 0)], true), id, { opacity: .13 }), area("fill", path([...sample(f, from, end), graph(end, 0), graph(from, 0)], true), id, { opacity: .6 + .15 * q }), ...Array.from({ length: 9 }, (_, i) => { const x = from + (to - from) * i / 8; return line(`strip${i}`, graph(x, 0), f(x), blue, .5, { opacity: q > i / 8 ? .35 : .05 }); }), trace("function", path(sample(f, -1, 1)), id), line("lower", graph(from, 0), f(from), orange, 1.4), line("upper", graph(to, 0), f(to), purple, 1.4), text("formula", "∫", 151, 40, { fontSize: 30 })];
};
const techniques: Scene = (p, id) => {
  const ribbon = (offset: number) => path(sample(t => [24 + 130 * t, 53 - 16 * Math.sin(t * TAU + p * .5 + offset)], 0, 1));
  return [...grid(), trace("ribbon-shadow", ribbon(1.2), id, 12, { opacity: .13 }), trace("ribbon", ribbon(0), id, 6, { opacity: .42 }), trace("ribbon-edge", ribbon(0), id, 1.1), text("source", "∫ 2x cos(x²) dx", 20, 13, { fontSize: 10 }), arrow("sub-arrow", [40, 27], [106, 27], purple, id), line("sub-draw", [40, 27], [106, 27], "var(--cli-paper)", 2, { pathLength: 100, strokeDasharray: "100", strokeDashoffset: 100 * progress(p), opacity: 1 - progress(p) }), text("substitution", "u = x²", 114, 29, { fontSize: 10, opacity: .45 + .55 * progress(p) }), text("result", "∫ cos u du = sin u + C", 42, 75, { fontSize: 9 })];
};
const differentialEquations: Scene = (p, id) => {
  const g = (x: number, y: number): Point => [25 + 48 * x, 62 - 26 * y];
  const q = progress(p), point = g(2.6 * q, odeSolution(2.6 * q));
  return [...grid(), ...Array.from({ length: 8 }, (_, i) => Array.from({ length: 4 }, (_, j) => {
    const x = i * .37 + .012 * Math.sin(TAU * p), y = j * .6, a = g(x, y), m = odeSlope(x, y), dx = 4.1 / Math.sqrt(1 + m * m), dy = -dx * m * 26 / 48;
    return arrow(`field-${i}-${j}`, [a[0] - dx, a[1] - dy], [a[0] + dx, a[1] + dy], j % 2 ? purple : cyan, id);
  })).flat(), trace("solution-base", path(sample(x => g(x, odeSolution(x)), 0, 2.6)), id, 1, { opacity: .18 }), trace("solution", path(sample(x => g(x, odeSolution(x)), 0, 2.6 * q)), id, 2.1, { stroke: orange }), dot("point", point, id, 3, true), text("formula", "y′ = x − y", 110, 13, { fontSize: 9 })];
};
const polarGrid = (): Mark[] => [...Array.from({ length: 4 }, (_, i) => mark("ellipse", `ring${i}`, { cx: 85, cy: 43, rx: 15 * (i + 1), ry: 6.8 * (i + 1), fill: "none", stroke: "#65bbff", strokeWidth: .6, opacity: .28 })), ...Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 8; return line(`ray${i}`, [85 - 60 * Math.cos(a), 43 - 27 * Math.sin(a)], [85 + 60 * Math.cos(a), 43 + 27 * Math.sin(a)], "#65bbff", .5, { opacity: .2 }); })];
const spiral = (a: number): Point => [85 + 3.9 * a * Math.cos(a), 43 - 1.8 * a * Math.sin(a)];
const seriesPolar: Scene = (p, id) => {
  const q = .2 + .8 * progress(p);
  return [...polarGrid(), trace("base", path(sample(spiral, 0, 4 * Math.PI)), id, 1, { opacity: .22 }), trace("spiral", path(sample(spiral, 0, 4 * Math.PI * q)), id, 1.9), ...[0, 1, 2].map(i => dot(`traveler${i}`, spiral(Math.max(0, 4 * Math.PI * q - i * .7)), id, 2.8 - i * .5)), text("formula", "r = θ/4", 123, 12, { fontSize: 9 })];
};
const seriesTests: Scene = (p, id) => {
  const n = Math.min(10, Math.floor(progress(p) * 10) + 1);
  return [...grid(), ...axes(), ...Array.from({ length: 10 }, (_, i) => dot(`term${i}`, [31 + i * 10.3, 65 - 74 * 2 ** -(i + 1)], id, 1.7 + 2.7 * 2 ** -(i / 2))).map((m, i) => ({ ...m, attrs: { ...m.attrs, opacity: i < n ? 1 : .12 } })), text("sum", "∞", 145, 15, { fontSize: 11 }), text("sigma", "Σ 2⁻ⁿ", 136, 35, { fontSize: 18 }), text("start", "n = 1", 142, 44, { fontSize: 7 }), text("partial", `S${n} = ${geometricPartialSum(n).toFixed(3)}`, 58, 76, { fontSize: 8 }), text("test", "ratio = ½ < 1", 100, 55, { fontSize: 7 })];
};
const rose = (a: number): Point => [86 + 57 * Math.cos(3 * a) * Math.cos(a), 44 - 24 * Math.cos(3 * a) * Math.sin(a)];
const curveTracing: Scene = (p, id) => {
  const q = progress(p);
  return [...polarGrid(), trace("base", path(sample(rose, 0, Math.PI, 150)), id, 1, { opacity: .22 }), ...Array.from({ length: 6 }, (_, i) => trace(`segment${i}`, path(sample(rose, i * Math.PI / 6, (i + 1) * Math.PI / 6, 25)), id, 2.2, { stroke: [cyan, blue, purple][i % 3], pathLength: 100, strokeDasharray: "100", strokeDashoffset: 100 * (1 - clamp(6 * q - i)) })), dot("point", rose(Math.PI * q), id), text("formula", "r = cos 3θ", 118, 12, { fontSize: 9 })];
};

// Cached only when a given 3D thumbnail is first rendered. No WebGL contexts.
const meshes = new Map<string, Facet[]>();
const paintedMeshes = new WeakMap<Facet[], { turn: number; spin: number; marks: Mark[] }>();
function cached(key: string, create: () => Facet[]) { if (!meshes.has(key)) meshes.set(key, create()); return meshes.get(key)!; }
function facets(key: string, geometry: Facet[], turn: number, mode: "surface" | "metal", opacity = .83, spin = 0): Mark[] {
  const old = paintedMeshes.get(geometry);
  if (old?.turn === turn && old.spin === spin) return old.marks;
  const project = projector(turn), light = new Vector3Light(turn);
  const rotate = ([x, y, z]: Point3): Point3 => [x * Math.cos(spin) - y * Math.sin(spin), x * Math.sin(spin) + y * Math.cos(spin), z];
  const projected = geometry.map(face => {
    const vertices = face.vertices.map(v => project(rotate(v))), depth = vertices.reduce((s, p) => s + p[2], 0) / 4;
    const brightness = light.shade(rotate(face.normal));
    const hue = mode === "metal" ? 194 + 32 * brightness : 155 + 125 * clamp((face.height + .6) / 1.2);
    return { depth, vertices, brightness, hue };
  }).sort((a, b) => a.depth - b.depth);
  // Batch nearby depth facets into compound vector paths. Same real mesh,
  // ~8x fewer DOM/style mutations and no per-frame DOM reordering.
  const batches: Mark[] = [];
  for (let i = 0; i < projected.length; i += 8) {
    const group = projected.slice(i, i + 8);
    const hue = group.reduce((s, f) => s + f.hue, 0) / group.length;
    const brightness = group.reduce((s, f) => s + f.brightness, 0) / group.length;
    const d = group.map(f => path(f.vertices.map(v => [v[0], v[1]]), true)).join(" ");
    batches.push(mark("path", `${key}${i / 8}`, { d, fill: `hsl(${hue.toFixed(0)} 88% ${(39 + 38 * brightness).toFixed(0)}%)`, fillOpacity: opacity, stroke: mode === "metal" ? "#b4f5ff" : "#e0fbff", strokeOpacity: .44, strokeWidth: .34, strokeLinejoin: "round" }));
  }
  paintedMeshes.set(geometry, { turn, spin, marks: batches });
  return batches;
}
class Vector3Light {
  constructor(private turn: number) {}
  shade(n: Point3) { return .25 + .75 * Math.abs(n[0] * Math.cos(this.turn + .4) * .45 + n[1] * .35 + n[2] * .72); }
}
const projectedLine = (key: string, a: Point3, b: Point3, turn: number, color: string, id: string) => {
  const project = projector(turn), p = project(a), q = project(b);
  return arrow(key, [p[0], p[1]], [q[0], q[1]], color, id);
};
const axes3 = (turn: number, id: string): Mark[] => [projectedLine("3x", [-1.65, 0, 0], [1.8, 0, 0], turn, "#83bff5", id), projectedLine("3y", [0, -1.6, 0], [0, 1.7, 0], turn, "#83bff5", id), projectedLine("3z", [0, 0, -.3], [0, 0, 1.3], turn, "#83bff5", id)];
const volume: Scene = (p, id) => {
  const turn = Math.round((-.28 + .1 * Math.sin(TAU * p)) * 200) / 200, project = projector(turn), x = -1.4 + 2.8 * progress(p), radius = revolutionRadius(x);
  const geometry = cached("volume", () => [
    ...mesh((u, v) => [u, revolutionRadius(u) * Math.cos(v), revolutionRadius(u) * Math.sin(v)], -1.5, 1.5, 0, TAU, 16, 12),
    ...[-1.5, 1.5].flatMap(x => mesh((r, a) => [x, r * Math.cos(a), r * Math.sin(a)], 0, revolutionRadius(x), 0, TAU, 1, 12)),
  ]);
  const ring = sample(a => { const v = project([x, radius * Math.cos(a), radius * Math.sin(a)]); return [v[0], v[1]]; }, 0, TAU);
  return [...axes3(turn, id), ...facets("solid", geometry, turn, "metal", .62), trace("slice", path(ring, true), id, 1.7, { stroke: purple, fill: purple, fillOpacity: .08 }), text("formula", "π ∫ r² dx", 121, 13, { fontSize: 10 })];
};
const multivariable: Scene = (p, id) => {
  const turn = Math.round((-.38 + .12 * Math.sin(TAU * p)) * 200) / 200, a: Point3 = [.2, -.35, surface(.2, -.35)], gradient = surfaceGradient(a[0], a[1]);
  const geometry = cached("surface", () => mesh((x, y) => [x, y, surface(x, y)], -1.4, 1.4, -1.2, 1.2, 12, 8));
  return [...axes3(turn, id), ...facets("mesh", geometry, turn, "surface"), projectedLine("gradient", a, [a[0] + gradient[0] * .55, a[1] + gradient[1] * .55, a[2]], turn, orange, id), text("formula", "∇f", 144, 13, { fontSize: 15, opacity: .7 + .3 * Math.sin(TAU * p) })];
};
const taylor: Scene = (p, id) => {
  const turn = Math.round((-.38 + .08 * Math.sin(TAU * p)) * 200) / 200, project = projector(turn);
  const geometry = cached("taylor", () => mesh((x, y) => [x, y, taylorSurface(x, y)], -1.1, 1.1, -1, 1, 12, 8));
  const plane = [[-.9, -.8], [1.2, -.8], [1.2, .9], [-.9, .9]].map(([u, v]) => {
    const scale = .5 + .5 * progress(p), x = contact[0] + scale * (u - contact[0]), y = contact[1] + scale * (v - contact[1]);
    return project([x, y, tangentPlane(x, y)]);
  });
  const pt = project([contact[0], contact[1], taylorSurface(...contact)]);
  return [...axes3(turn, id), ...facets("mesh", geometry, turn, "surface", .63), mark("polygon", "plane", { points: plane.map(v => `${v[0]},${v[1]}`).join(" "), fill: orange, fillOpacity: .28 + .08 * progress(p), stroke: orange, strokeWidth: 1 }), dot("contact", [pt[0], pt[1]], id, 3, true), mark("circle", "neighborhood", { cx: pt[0], cy: pt[1], r: 7 + 2 * Math.sin(p * TAU), fill: orange, opacity: .13 }), text("formula", "T₁f", 145, 12, { fontSize: 12 })];
};
const lagrange: Scene = (p, id) => {
  // f=−((x−.2)²+(y−.65)²), g=x²+y²=1. Circular contours;
  // closest constraint point to (.2,.65) maximizes f and ∇f=λ∇g.
  const optimum = Math.atan2(.65, .2), angle = -.65 + (optimum + .65) * progress(p), x = Math.cos(angle), y = Math.sin(angle);
  const g = (u: number, v: number): Point => [84 + 43 * u, 45 - 22 * v];
  const pt = g(x, y);
  const ring = (r: number) => path(sample(a => g(.2 + r * Math.cos(a), .65 + r * Math.sin(a)), 0, TAU), true);
  return [...grid(), ...Array.from({ length: 7 }, (_, i) => trace(`contour${i}`, ring(.2 + i * .2), id, .7, { opacity: .25 })), trace("optimal-contour", ring(1 - Math.hypot(.2, .65)), id, 1.5, { stroke: orange, opacity: .2 + .8 * progress(p) }), trace("constraint", path(sample(a => g(Math.cos(a), Math.sin(a)), 0, TAU), true), id, 1.7, { stroke: purple }), arrow("grad-f", pt, g(x - .7 * (x - .2), y - .7 * (y - .65)), orange, id), arrow("grad-g", pt, g(x + .5 * x, y + .5 * y), purple, id), dot("point", pt, id, 3.6, true), text("formula", "∇f = λ∇g", 122, 12, { fontSize: 9 })];
};
const jacobians: Scene = (p, id) => {
  const a = .85 * (.5 - .5 * Math.cos(TAU * p)), g = (u: number, v: number): Point => { const [x, y] = warp(u, v, a); return [82 + x * 35 + y * 12, 44 - y * 22]; };
  const region = [...sample(u => g(u, 0), 0, .5, 12), ...sample(v => g(.5, v), 0, .5, 12), ...sample(u => g(u, .5), .5, 0, 12), ...sample(v => g(0, v), .5, 0, 12)];
  return [...Array.from({ length: 9 }, (_, i) => { const u = -1 + i / 4; return trace(`u${i}`, path(sample(v => g(u, v), -1, 1)), id, .8); }), ...Array.from({ length: 9 }, (_, i) => { const v = -1 + i / 4; return trace(`v${i}`, path(sample(u => g(u, v), -1, 1)), id, .8); }), area("region", path(region, true), id, { fillOpacity: .7, stroke: orange, strokeWidth: 1.2 }), text("determinant", `J = 1 + ${(.5 * a).toFixed(2)}v²`, 107, 12, { fontSize: 8 }), text("area", `A = ${mappedArea(0, .5, 0, .5, a).toFixed(3)}`, 23, 75, { fontSize: 8 }), text("local", `J(¼) = ${jacobian(.25, a).toFixed(2)}`, 97, 75, { fontSize: 8 })];
};
const changeOrder: Scene = (p, id) => {
  const g = (x: number, y: number): Point => [30 + 100 * x, 66 - 48 * y];
  const horizontal = ease((p - .4) / .18);
  return [...grid(), ...axes(), area("region", path([g(0, 0), g(1, 0), g(1, 1)], true), id, { opacity: .25 }), ...Array.from({ length: 9 }, (_, i) => { const x = (i + 1) / 10; return line(`vertical${i}`, g(x, 0), g(x, x), cyan, 5, { opacity: (1 - horizontal) * (.15 + .35 * clamp(p * 12 - i)) }); }), ...Array.from({ length: 9 }, (_, i) => { const y = (i + 1) / 10; return line(`horizontal${i}`, g(y, y), g(1, y), purple, 2.8, { opacity: horizontal * (.15 + .35 * clamp((p - .4) * 20 - i)) }); }), trace("boundary", path([g(0, 0), g(1, 0), g(1, 1)], true), id, 1.5), text("formula", "0 ≤ y ≤ x ≤ 1", 87, 12, { fontSize: 9 })];
};
const integralApplications: Scene = (p, id) => {
  // Region between y=1-x² and y=0, accumulated from -1 to b.
  const b = -1 + 2 * progress(p), f = (x: number) => graph(x, curve(x)), a = b - b ** 3 / 3 + 2 / 3;
  return [...grid(), ...axes(), area("base", path([...sample(f, -1, 1), graph(1, 0), graph(-1, 0)], true), id, { opacity: .14 }), area("fill", path([...sample(f, -1, b), graph(b, 0), graph(-1, 0)], true), id), trace("curve", path(sample(f, -1, 1)), id), line("measure", graph(b, 0), f(b), orange, 1.4), dot("point", f(b), id, 3, true), text("formula", `A = ${a.toFixed(2)}`, 117, 13, { fontSize: 11 }), text("total", "∫₋₁¹ (1 − x²) dx = 4/3", 36, 77, { fontSize: 8 })];
};
const centroid: Scene = (p, id) => {
  const angle = .04 * Math.sin(p * TAU) * (1 - progress(p)), cx = 42 + 94 * triangularCentroid[0], cy = 64 - 45 * triangularCentroid[1];
  const rotate = ([x, y]: Point): Point => [cx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle), cy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle)];
  const point: Point = [cx + 16 * (1 - progress(p)), cy - 9 * (1 - progress(p))];
  return [...grid(), line("axis-x", [36, 64], [144, 64], "#73adf3", .8), line("axis-y", [42, 70], [42, 13], "#73adf3", .8), area("lamina", path([[42, 64], [136, 64], [42, 19]].map(v => rotate(v as Point)), true), id, { fillOpacity: .75, strokeWidth: 1.4 }), line("balance-x", [cx, 64], [cx, cy], purple, .8, { strokeDasharray: "2 2" }), line("balance-y", [42, cy], [cx, cy], orange, .8, { strokeDasharray: "2 2" }), trace("support", path([[cx - 6, 73], [cx, 65], [cx + 6, 73]], true), id, 1), dot("centroid", point, id, 4, true), text("formula", "C = (⅓, ⅓)", 105, 15, { fontSize: 10 })];
};
const inertia: Scene = (p, id) => {
  const turn = -.25 + p * TAU, project = projector(-.2);
  const geometry = cached("inertia", () => [
    ...mesh((r, a) => [r * Math.cos(a), r * Math.sin(a), .16], .48, 1.45, 0, TAU, 3, 24),
    ...mesh((z, a) => [1.45 * Math.cos(a), 1.45 * Math.sin(a), z], -.16, .16, 0, TAU, 1, 24),
    ...mesh((z, a) => [.48 * Math.cos(a), .48 * Math.sin(a), z], -.16, .16, 0, TAU, 1, 24),
  ]);
  const radius = project([1.2 * Math.cos(turn), 1.2 * Math.sin(turn), .2]), center = project([0, 0, .2]);
  return [...axes3(-.2, id), ...facets("annulus", geometry, -.2, "metal", .92, Math.round(turn * 20) / 20), projectedLine("axis", [0, 0, -.6], [0, 0, 1.2], -.2, purple, id), arrow("radius", [center[0], center[1]], [radius[0], radius[1]], orange, id), dot("mass", [radius[0], radius[1]], id, 3, true), trace("rotation", path(sample(a => { const v = project([1.6 * Math.cos(a), 1.6 * Math.sin(a), .2]); return [v[0], v[1]]; }, turn, turn + 1.1, 20)), id, 1, { markerEnd: `url(#${id}-arrow)` }), text("formula", "I = ½M(R² + r²)", 98, 12, { fontSize: 8 })];
};
const gammaGraph = (x: number): Point => [25 + (x - .35) * 34, 67 - gamma(x) * 12];
const betaGamma: Scene = (p, id) => {
  const x = .45 + 3.3 * progress(p), d = path(sample(gammaGraph, .35, 3.8, 100));
  return [...grid(), ...axes(), trace("base", d, id, 1, { opacity: .2 }), trace("gamma", d, id, 2, { pathLength: 100, strokeDasharray: "100", strokeDashoffset: 100 * (1 - progress(p)) }), dot("point", gammaGraph(x), id, 3.3), text("formula", "Γ(x)", 133, 15, { fontSize: 16 }), text("beta", "B(a,b) = Γ(a)Γ(b)/Γ(a+b)", 28, 77, { fontSize: 8 }), text("point-label", `Γ(${x.toFixed(1)}) = ${gamma(x).toFixed(2)}`, 92, 55, { fontSize: 7 })];
};
const advanced: Scene = (p, id) => {
  // A distinct saddle for the configured Advanced workbench (no home card today).
  const turn = -.45 + .1 * Math.sin(TAU * p);
  return [...axes3(turn, id), ...facets("saddle", cached("advanced", () => mesh((x, y) => [x, y, .45 * (x * x - y * y)], -1.2, 1.2, -1, 1)), turn, "surface"), text("formula", "∇ × F", 133, 12, { fontSize: 11 })];
};
export const illustrationRegistry = {
  limits: { scene: limits, label: "Two-sided limit: both points approach the open limit point", dimension: 2 },
  derivatives: { scene: derivatives, label: "Derivative of 1−x²: moving contact point and exact tangent", dimension: 2 },
  "derivative-applications": { scene: applications, label: "Optimization: maximum of 1−x² at x=0", dimension: 2 },
  integration: { scene: integrals, label: "Definite integral: progressively shaded area with boundaries", dimension: 2 },
  "integration-techniques": { scene: techniques, label: "Substitution u=x² transforms the integral of 2x cos(x²)", dimension: 2 },
  "integral-applications": { scene: volume, label: "Three-dimensional solid of revolution with sweeping circular section", dimension: 3 },
  "differential-equations": { scene: differentialEquations, label: "Slope field y′=x−y and its exact solution y=x−1+1.4 exp(−x)", dimension: 2 },
  "series-parametric-polar": { scene: seriesPolar, label: "Archimedean polar spiral with outward tracing points", dimension: 2 },
  "series-tests": { scene: seriesTests, label: "Geometric series: sum of 2 to the power −n, convergent by the ratio test", dimension: 2 },
  "curve-tracing": { scene: curveTracing, label: "Three-petal rose r=cos(3θ) with distinct traced segments", dimension: 2 },
  "multivariable-vector": { scene: multivariable, label: "Three-dimensional sinusoidal function mesh and its gradient", dimension: 3 },
  "taylor-two-variables": { scene: taylor, label: "Three-dimensional paraboloid and exact first-order tangent plane", dimension: 3 },
  "lagrange-multipliers": { scene: lagrange, label: "Circular objective contours and constrained optimum with parallel gradients", dimension: 2 },
  jacobians: { scene: jacobians, label: "Nonlinear coordinate map with determinant and exact mapped region area", dimension: 2 },
  "change-order": { scene: changeOrder, label: "Fixed triangular integration region with vertical and horizontal slices", dimension: 2 },
  "integral-engineering": { scene: integralApplications, label: "Accumulating geometric area between a parabola and the x axis", dimension: 2 },
  centroid: { scene: centroid, label: "Uniform triangular lamina balancing at its computed centroid", dimension: 2 },
  "moments-of-inertia": { scene: inertia, label: "Three-dimensional annulus, rotation axis, radial mass and angular direction", dimension: 3 },
  "beta-gamma": { scene: betaGamma, label: "Correct positive Gamma function curve and Beta–Gamma identity", dimension: 2 },
  advanced: { scene: advanced, label: "Three-dimensional saddle surface for advanced vector calculus", dimension: 3 },
} as const;
export type IllustrationKind = keyof typeof illustrationRegistry;
