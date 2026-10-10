import { Matrix4, Vector3 } from "three";

export type Point = [number, number];
export type Point3 = [number, number, number];
export const TAU = 2 * Math.PI;
export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (x: number) => { const p = clamp(x); return p * p * (3 - 2 * p); };
export const curve = (x: number) => 1 - x * x;
export const derivative = (x: number) => -2 * x;
export const limitFunction = (x: number) => .5 + .24 * Math.cos(5 * x) + .1 * x;
export const odeSolution = (x: number) => x - 1 + 1.4 * Math.exp(-x);
export const odeSlope = (x: number, y: number) => x - y;
export const surface = (x: number, y: number) => .6 * Math.sin(1.8 * x) * Math.cos(1.6 * y);
export const surfaceGradient = (x: number, y: number): Point => [1.08 * Math.cos(1.8 * x) * Math.cos(1.6 * y), -.96 * Math.sin(1.8 * x) * Math.sin(1.6 * y)];
export const taylorSurface = (x: number, y: number) => .35 * (x * x + y * y);
export const contact: Point = [.45, .25];
export const tangentPlane = (x: number, y: number) => taylorSurface(...contact) + .7 * contact[0] * (x - contact[0]) + .7 * contact[1] * (y - contact[1]);
// T_a(u,v)=(u(1+a v²/2),v). det DT=1+a v²/2; grid and region use the same map.
export const warp = (u: number, v: number, a: number): Point => [u * (1 + a * v * v / 2), v];
export const jacobian = (v: number, a: number) => 1 + a * v * v / 2;
export const mappedArea = (u0: number, u1: number, v0: number, v1: number, a: number) => (u1 - u0) * ((v1 - v0) + a * (v1 ** 3 - v0 ** 3) / 6);
export const triangularCentroid: Point = [1 / 3, 1 / 3];
export const geometricPartialSum = (n: number) => 1 - 2 ** -n;
// Lanczos approximation, positive real domain used by the illustration.
export function gamma(z: number): number {
  const p = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < .5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  const q = z - 1;
  let x = .9999999999998099;
  p.forEach((v, i) => { x += v / (q + i + 1); });
  const t = q + 7.5;
  return Math.sqrt(2 * Math.PI) * t ** (q + .5) * Math.exp(-t) * x;
}
export function sample(f: (t: number) => Point, from: number, to: number, count = 72): Point[] {
  return Array.from({ length: count + 1 }, (_, i) => f(from + (to - from) * i / count));
}
export const path = (points: Point[], closed = false) => points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") + (closed ? " Z" : "");
export const graph = (x: number, y: number): Point => [82 + 59 * x, 65 - 43 * y];

// Real 3D vertices, normals and a Three.js view transform, rendered as vector facets.
// This is the GPU-independent thumbnail renderer, not a decorative 2D surface path.
export function projector(turn: number) {
  const matrix = new Matrix4().makeRotationZ(turn);
  const tilt = new Matrix4().makeRotationX(-1.02);
  matrix.premultiply(tilt);
  return (p: Point3): Point3 => {
    const v = new Vector3(...p).applyMatrix4(matrix);
    return [90 + v.x * 39, 43 - v.y * 29, v.z];
  };
}
export type Facet = { vertices: Point3[]; normal: Point3; height: number };
export function mesh(f: (u: number, v: number) => Point3, u0: number, u1: number, v0: number, v1: number, nu = 16, nv = 12): Facet[] {
  const faces: Facet[] = [];
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = u0 + (u1 - u0) * i / nu, b = v0 + (v1 - v0) * j / nv;
    const du = (u1 - u0) / nu, dv = (v1 - v0) / nv;
    const vertices = [f(a, b), f(a + du, b), f(a + du, b + dv), f(a, b + dv)];
    const origin = new Vector3(...vertices[0]);
    const normal = new Vector3(...vertices[1]).sub(origin).cross(new Vector3(...vertices[3]).sub(origin)).normalize().toArray() as Point3;
    faces.push({ vertices, normal, height: vertices.reduce((s, p) => s + p[2], 0) / 4 });
  }
  return faces;
}
export const revolutionRadius = (x: number) => .4 + .35 * (1 - Math.cos(Math.PI * x));
