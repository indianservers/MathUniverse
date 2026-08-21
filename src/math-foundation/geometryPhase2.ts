import { circle, distanceBetween, intersectObjects, line, point, type KernelCircle, type KernelIntersection, type KernelLinearObject, type KernelObject, type KernelPoint } from "../workspace/geometry2dKernel";
import type { MathDiagnostic } from "./types";

export type GeometryOutcome<T> = { status: "EXACT" | "APPROXIMATE" | "NO_SOLUTION" | "MULTIPLE" | "INFINITE" | "DEGENERATE" | "UNSUPPORTED"; value?: T; diagnostics: MathDiagnostic[]; method: string; tolerance: number; residual?: number };
export type CircumcircleConstruction = { center: KernelPoint; circle: KernelCircle; radius: number; perpendicularBisectors: [KernelLinearObject, KernelLinearObject]; algebraicEquation: string };
export type AffineMatrix = readonly [number, number, number, number, number, number];

const EPS = 1e-9;
export function orientation(a: KernelPoint, b: KernelPoint, c: KernelPoint) { const determinant = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); const scale = Math.max(1, distanceBetween(a, b), distanceBetween(a, c), distanceBetween(b, c)); return { determinant, sign: Math.abs(determinant) <= EPS * scale * scale ? 0 as const : determinant > 0 ? 1 as const : -1 as const, tolerance: EPS * scale * scale }; }

export function constructCircumcircle(a: KernelPoint, b: KernelPoint, c: KernelPoint): GeometryOutcome<CircumcircleConstruction> {
  const predicate = orientation(a, b, c);
  if (distanceBetween(a, b) <= EPS || distanceBetween(b, c) <= EPS || distanceBetween(c, a) <= EPS) return { status: "DEGENERATE", diagnostics: [{ code: "COINCIDENT_POINTS", severity: "ERROR", message: "A circumcircle requires three distinct points." }], method: "EXACT_ORIENTATION_AND_BISECTOR_INTERSECTION", tolerance: predicate.tolerance };
  if (predicate.sign === 0) return { status: "DEGENERATE", diagnostics: [{ code: "COLLINEAR_CIRCUMCIRCLE_INPUT", severity: "ERROR", message: "Three collinear or numerically indistinguishable points do not define a finite circumcircle.", details: { determinant: predicate.determinant, tolerance: predicate.tolerance } }], method: "EXACT_ORIENTATION_AND_BISECTOR_INTERSECTION", tolerance: predicate.tolerance };
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  const ux = ((a.x ** 2 + a.y ** 2) * (b.y - c.y) + (b.x ** 2 + b.y ** 2) * (c.y - a.y) + (c.x ** 2 + c.y ** 2) * (a.y - b.y)) / d;
  const uy = ((a.x ** 2 + a.y ** 2) * (c.x - b.x) + (b.x ** 2 + b.y ** 2) * (a.x - c.x) + (c.x ** 2 + c.y ** 2) * (b.x - a.x)) / d;
  const center = point(ux, uy); const radius = distanceBetween(center, a); const midAB = point((a.x + b.x) / 2, (a.y + b.y) / 2); const midBC = point((b.x + c.x) / 2, (b.y + c.y) / 2);
  const bisectorAB = line(midAB, point(midAB.x - (b.y - a.y), midAB.y + (b.x - a.x))); const bisectorBC = line(midBC, point(midBC.x - (c.y - b.y), midBC.y + (c.x - b.x)));
  const residual = Math.max(Math.abs(distanceBetween(center, b) - radius), Math.abs(distanceBetween(center, c) - radius));
  return { status: residual <= 1e-7 ? "EXACT" : "APPROXIMATE", value: { center, circle: circle(center, radius), radius, perpendicularBisectors: [bisectorAB, bisectorBC], algebraicEquation: `(x-${format(center.x)})^2+(y-${format(center.y)})^2=${format(radius ** 2)}` }, diagnostics: residual > 1e-7 ? [{ code: "CIRCUMCIRCLE_RESIDUAL", severity: "WARNING", message: "Circumcircle was constructed numerically with a measurable residual.", details: { residual } }] : [], method: "DETERMINANT_CIRCUMCENTER", tolerance: 1e-7, residual };
}

export function intersectGeometry(first: KernelObject, second: KernelObject): GeometryOutcome<KernelIntersection[]> {
  const firstDegenerate = degenerate(first); const secondDegenerate = degenerate(second); if (firstDegenerate || secondDegenerate) return { status: "DEGENERATE", diagnostics: [firstDegenerate ?? secondDegenerate as MathDiagnostic], method: "ROBUST_TYPED_INTERSECTION", tolerance: 1e-7 };
  if (isLinear(first) && isLinear(second)) { const a = lineCoefficients(first); const b = lineCoefficients(second); const cross = a.a * b.b - b.a * a.b; if (Math.abs(cross) <= EPS) { const coincident = Math.abs(a.a * b.c - b.a * a.c) <= EPS && Math.abs(a.b * b.c - b.b * a.c) <= EPS; return { status: coincident ? "INFINITE" : "NO_SOLUTION", value: [], diagnostics: [{ code: coincident ? "COINCIDENT_LINES" : "PARALLEL_LINES", severity: "INFO", message: coincident ? "The lines coincide and have infinitely many common points." : "Parallel lines have no finite intersection." }], method: "ORIENTATION_AND_LINEAR_DETERMINANT", tolerance: EPS }; } }
  if (first.kind === "circle" && second.kind === "circle" && distanceBetween(first.center, second.center) <= EPS && Math.abs(first.radius - second.radius) <= EPS) return { status: "INFINITE", value: [], diagnostics: [{ code: "COINCIDENT_CIRCLES", severity: "INFO", message: "Coincident circles have infinitely many intersection points." }], method: "CENTER_RADIUS_PREDICATE", tolerance: EPS };
  const intersections = intersectObjects(first, second); const numeric = first.kind === "conic" && second.kind === "conic";
  return { status: intersections.length === 0 ? "NO_SOLUTION" : intersections.length === 1 ? (numeric ? "APPROXIMATE" : "EXACT") : "MULTIPLE", value: intersections, diagnostics: numeric ? [{ code: "NUMERICAL_CONIC_INTERSECTION", severity: "WARNING", message: "Conic–conic intersections use a declared numerical scan and are approximate." }] : [], method: numeric ? "NUMERICAL_CONIC_SCAN" : "ANALYTIC_INTERSECTION", tolerance: numeric ? 0.15 : 1e-7 };
}

export function applyAffine(matrix: AffineMatrix, p: KernelPoint): KernelPoint { const [a, b, c, d, tx, ty] = matrix; return point(a * p.x + c * p.y + tx, b * p.x + d * p.y + ty); }
export function composeAffine(after: AffineMatrix, before: AffineMatrix): AffineMatrix { const [a2,b2,c2,d2,tx2,ty2]=after; const [a1,b1,c1,d1,tx1,ty1]=before; return [a2*a1+c2*b1,b2*a1+d2*b1,a2*c1+c2*d1,b2*c1+d2*d1,a2*tx1+c2*ty1+tx2,b2*tx1+d2*ty1+ty2]; }
export function inverseAffine(matrix: AffineMatrix): GeometryOutcome<AffineMatrix> { const [a,b,c,d,tx,ty]=matrix; const det=a*d-b*c; if(Math.abs(det)<=EPS) return {status:"DEGENERATE",diagnostics:[{code:"NON_INVERTIBLE_TRANSFORMATION",severity:"ERROR",message:"Transformation matrix has zero determinant and no affine inverse."}],method:"AFFINE_MATRIX_INVERSE",tolerance:EPS}; const inverse:AffineMatrix=[d/det,-b/det,-c/det,a/det,(c*ty-d*tx)/det,(b*tx-a*ty)/det]; return {status:"EXACT",value:inverse,diagnostics:[],method:"AFFINE_MATRIX_INVERSE",tolerance:EPS,residual:Math.abs(det)}; }
export const translationMatrix = (x: number, y: number): AffineMatrix => [1,0,0,1,x,y];
export const rotationMatrix = (angleRadians: number, center: KernelPoint = point(0,0)): AffineMatrix => composeAffine(translationMatrix(center.x,center.y), composeAffine([Math.cos(angleRadians),Math.sin(angleRadians),-Math.sin(angleRadians),Math.cos(angleRadians),0,0],translationMatrix(-center.x,-center.y)));
export const reflectionAcrossLineMatrix = (angleRadians: number, linePoint: KernelPoint = point(0,0)): AffineMatrix => composeAffine(translationMatrix(linePoint.x,linePoint.y), composeAffine(rotationMatrix(angleRadians), composeAffine([1,0,0,-1,0,0], composeAffine(rotationMatrix(-angleRadians),translationMatrix(-linePoint.x,-linePoint.y)))));
export const dilationMatrix = (factor: number, center: KernelPoint = point(0,0)): AffineMatrix => [factor,0,0,factor,center.x*(1-factor),center.y*(1-factor)];

function isLinear(value: KernelObject): value is KernelLinearObject { return value.kind === "line" || value.kind === "segment" || value.kind === "ray"; }
function lineCoefficients(value: KernelLinearObject) { return { a: value.b.y-value.a.y, b: value.a.x-value.b.x, c: -(value.b.y-value.a.y)*value.a.x-(value.a.x-value.b.x)*value.a.y }; }
function degenerate(value: KernelObject): MathDiagnostic | undefined { if (isLinear(value) && distanceBetween(value.a,value.b)<=EPS) return {code:"ZERO_LENGTH_LINEAR_OBJECT",severity:"ERROR",message:"A line, ray, or segment requires two distinct points."}; if(value.kind==="circle"&&value.radius<=EPS) return {code:"ZERO_RADIUS_CIRCLE",severity:"ERROR",message:"A circle requires a positive radius."}; return undefined; }
function format(value:number){return Number(value.toPrecision(10)).toString();}
