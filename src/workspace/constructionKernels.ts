import { circle, distanceBetween, intersectObjects, line, midpoint, point, ray, segment, type KernelCircle, type KernelLinearObject, type KernelObject, type KernelPoint } from "./geometry2dKernel";
import { intersect3, line3, plane3, point3, sphere3, vector3, type Object3, type Point3, type Vector3 } from "./geometry3dKernel";

export type Exact2DConstraint =
  | { id: string; type: "fixed" | "locked"; target: string; point?: KernelPoint }
  | { id: string; type: "coincident"; target: string; source: string }
  | { id: string; type: "midpoint"; target: string; a: string; b: string }
  | { id: string; type: "on-circle"; target: string; circle: string }
  | { id: string; type: "on-line"; target: string; line: string }
  | { id: string; type: "on-object"; target: string; object: string }
  | { id: string; type: "intersection"; target: string; first: string; second: string }
  | { id: string; type: "fixed-distance"; target: string; anchor: string; distance: number }
  | { id: string; type: "equal-length"; target: string; anchor: string; a: string; b: string }
  | { id: string; type: "parallel"; target: string; reference: string; through: string }
  | { id: string; type: "perpendicular"; target: string; reference: string; through: string }
  | { id: string; type: "tangent"; target: string; circle: string; at: string }
  | { id: string; type: "angle"; target: string; vertex: string; reference: string; degrees: number };

export type Exact3DConstraint =
  | { id: string; type: "line-plane-intersection"; target: string; line: string; plane: string }
  | { id: string; type: "sphere-plane-section-center"; target: string; sphere: string; plane: string }
  | { id: string; type: "point-on-plane"; target: string; plane: string };

export type Exact2DState = {
  points: Record<string, KernelPoint>;
  objects: Record<string, KernelObject>;
  constraints: Exact2DConstraint[];
};

export type Exact3DState = {
  points: Record<string, Point3>;
  objects: Record<string, Object3>;
  constraints: Exact3DConstraint[];
};

export type ExactConstraintDiagnostic = {
  constraintId: string;
  severity: "warning" | "error";
  message: string;
};

export type Exact2DSolveResult = Exact2DState & {
  diagnostics: ExactConstraintDiagnostic[];
  valid: boolean;
};

export function solveExact2D(state: Exact2DState, movingPointId?: string): Exact2DState {
  const { diagnostics: _diagnostics, valid: _valid, ...solved } = solveExact2DWithDiagnostics(state, movingPointId);
  return solved;
}

export function solveExact2DWithDiagnostics(state: Exact2DState, movingPointId?: string): Exact2DSolveResult {
  const points = { ...state.points };
  let objects = { ...state.objects };
  const diagnostics: ExactConstraintDiagnostic[] = [];
  for (let pass = 0; pass < 8; pass += 1) {
    for (const constraint of state.constraints) {
      if ((constraint.type === "fixed" || constraint.type === "locked") && constraint.point) {
        points[constraint.target] = constraint.point;
      }
      if (constraint.type === "coincident") {
        if (points[constraint.source]) points[constraint.target] = points[constraint.source];
        else pushDiagnostic(diagnostics, constraint.id, "error", `Missing source point ${constraint.source}.`);
      }
      if (constraint.type === "midpoint") {
        if (points[constraint.a] && points[constraint.b]) points[constraint.target] = midpoint(points[constraint.a], points[constraint.b]);
        else pushDiagnostic(diagnostics, constraint.id, "error", "Midpoint constraint is missing one or both endpoints.");
      }
      if (constraint.type === "on-circle") {
        const target = points[constraint.target];
        const object = objects[constraint.circle];
        if (target && object?.kind === "circle") points[constraint.target] = projectPointToCircle(target, object);
        else pushDiagnostic(diagnostics, constraint.id, "error", `Cannot project ${constraint.target} onto circle ${constraint.circle}.`);
      }
      if (constraint.type === "on-line" || constraint.type === "on-object") {
        const target = points[constraint.target];
        const objectId = constraint.type === "on-line" ? constraint.line : constraint.object;
        const object = objects[objectId];
        if (target && isLinearObject(object)) points[constraint.target] = projectPointToLine(target, object);
        else if (target && object?.kind === "circle") points[constraint.target] = projectPointToCircle(target, object);
        else pushDiagnostic(diagnostics, constraint.id, "error", `Cannot project ${constraint.target} onto ${objectId}.`);
      }
      if (constraint.type === "intersection") {
        const first = objects[constraint.first];
        const second = objects[constraint.second];
        if (first && second) {
          const [hit] = intersectObjects(first, second);
          if (hit) points[constraint.target] = point(hit.x, hit.y);
          else pushDiagnostic(diagnostics, constraint.id, "warning", "Intersection is currently undefined.");
        } else {
          pushDiagnostic(diagnostics, constraint.id, "error", "Intersection constraint is missing one or both objects.");
        }
      }
      if (constraint.type === "fixed-distance" && (!movingPointId || movingPointId === constraint.target)) {
        const target = points[constraint.target];
        const anchor = points[constraint.anchor];
        if (target && anchor) points[constraint.target] = pointAtDistance(anchor, target, constraint.distance);
        else pushDiagnostic(diagnostics, constraint.id, "error", "Fixed-distance constraint is missing target or anchor.");
      }
      if (constraint.type === "equal-length" && (!movingPointId || movingPointId === constraint.target)) {
        const target = points[constraint.target];
        const anchor = points[constraint.anchor];
        const a = points[constraint.a];
        const b = points[constraint.b];
        if (target && anchor && a && b) points[constraint.target] = pointAtDistance(anchor, target, distanceBetween(a, b));
        else pushDiagnostic(diagnostics, constraint.id, "error", "Equal-length constraint is missing target, anchor, or reference segment.");
      }
      if (constraint.type === "parallel" || constraint.type === "perpendicular") {
        const reference = objects[constraint.reference];
        const through = points[constraint.through];
        if (isLinearObject(reference) && through) objects[constraint.target] = lineFromDirection(through, reference, constraint.type === "perpendicular");
        else pushDiagnostic(diagnostics, constraint.id, "error", `${constraint.type} constraint is missing a reference line or through-point.`);
      }
      if (constraint.type === "tangent") {
        const circleObject = objects[constraint.circle];
        const at = points[constraint.at];
        if (circleObject?.kind === "circle" && at) {
          const tangentDirection = point(-(at.y - circleObject.center.y), at.x - circleObject.center.x);
          objects[constraint.target] = line(at, point(at.x + tangentDirection.x, at.y + tangentDirection.y));
        } else pushDiagnostic(diagnostics, constraint.id, "error", "Tangent constraint is missing circle or tangent point.");
      }
      if (constraint.type === "angle" && (!movingPointId || movingPointId === constraint.target)) {
        const target = points[constraint.target];
        const vertex = points[constraint.vertex];
        const reference = points[constraint.reference];
        if (target && vertex && reference) points[constraint.target] = pointAtAngle(vertex, reference, target, constraint.degrees);
        else pushDiagnostic(diagnostics, constraint.id, "error", "Angle constraint is missing target, vertex, or reference point.");
      }
    }
    objects = rebuild2DObjects(objects, points);
  }
  return { ...state, points, objects, diagnostics, valid: diagnostics.every((item) => item.severity !== "error") };
}

export function solveExact3D(state: Exact3DState): Exact3DState {
  const points = { ...state.points };
  for (const constraint of state.constraints) {
    if (constraint.type === "line-plane-intersection") {
      const lineObject = state.objects[constraint.line];
      const planeObject = state.objects[constraint.plane];
      const [hit] = lineObject?.kind === "line3" && planeObject?.kind === "plane3" ? intersect3(lineObject, planeObject) : [];
      if (hit?.kind === "point") points[constraint.target] = hit.point;
    }
    if (constraint.type === "sphere-plane-section-center") {
      const sphereObject = state.objects[constraint.sphere];
      const planeObject = state.objects[constraint.plane];
      const [hit] = sphereObject?.kind === "sphere3" && planeObject?.kind === "plane3" ? intersect3(sphereObject, planeObject) : [];
      if (hit?.kind === "circle") points[constraint.target] = hit.center;
    }
    if (constraint.type === "point-on-plane") {
      const target = points[constraint.target];
      const planeObject = state.objects[constraint.plane];
      if (target && planeObject?.kind === "plane3") points[constraint.target] = projectPointToPlane(target, planeObject.point, planeObject.normal);
    }
  }
  return { ...state, points, objects: rebuild3DObjects(state.objects, points) };
}

export function makeLineThroughPoints(id: string, aId: string, bId: string, points: Record<string, KernelPoint>) {
  const a = points[aId] ?? point(0, 0);
  const b = points[bId] ?? point(1, 0);
  return { id, object: line(a, b), parentIds: [aId, bId] };
}

export function makeCircleThroughPoints(id: string, centerId: string, edgeId: string, points: Record<string, KernelPoint>) {
  const center = points[centerId] ?? point(0, 0);
  const edge = points[edgeId] ?? point(1, 0);
  return { id, object: circle(center, distanceBetween(center, edge)), parentIds: [centerId, edgeId] };
}

export function make3DLineThroughPoints(id: string, aId: string, bId: string, points: Record<string, Point3>) {
  const a = points[aId] ?? point3(0, 0, 0);
  const b = points[bId] ?? point3(1, 0, 0);
  return { id, object: line3(a, vector3(b.x - a.x, b.y - a.y, b.z - a.z)), parentIds: [aId, bId] };
}

export function make3DPlaneThroughPointNormal(id: string, pointId: string, normal: Vector3, points: Record<string, Point3>) {
  const p = points[pointId] ?? point3(0, 0, 0);
  return { id, object: plane3(p, normal), parentIds: [pointId] };
}

export function make3DSphere(id: string, centerId: string, radius: number, points: Record<string, Point3>) {
  const center = points[centerId] ?? point3(0, 0, 0);
  return { id, object: sphere3(center, radius), parentIds: [centerId] };
}

function rebuild2DObjects(objects: Record<string, KernelObject>, points: Record<string, KernelPoint>) {
  const rebuilt = { ...objects };
  Object.entries(objects).forEach(([id]) => {
    const parents = id.split(":");
    if (parents[0] === "line" && points[parents[1]] && points[parents[2]]) rebuilt[id] = line(points[parents[1]], points[parents[2]]);
    if (parents[0] === "segment" && points[parents[1]] && points[parents[2]]) rebuilt[id] = segment(points[parents[1]], points[parents[2]]);
    if (parents[0] === "ray" && points[parents[1]] && points[parents[2]]) rebuilt[id] = ray(points[parents[1]], points[parents[2]]);
    if (parents[0] === "circle" && points[parents[1]] && points[parents[2]]) rebuilt[id] = circle(points[parents[1]], distanceBetween(points[parents[1]], points[parents[2]]));
  });
  return rebuilt;
}

function rebuild3DObjects(objects: Record<string, Object3>, points: Record<string, Point3>) {
  const rebuilt = { ...objects };
  Object.entries(objects).forEach(([id, object]) => {
    const parents = id.split(":");
    if (object.kind === "line3" && parents[0] === "line3" && points[parents[1]] && points[parents[2]]) {
      const a = points[parents[1]];
      const b = points[parents[2]];
      rebuilt[id] = line3(a, vector3(b.x - a.x, b.y - a.y, b.z - a.z));
    }
  });
  return rebuilt;
}

function projectPointToCircle(target: KernelPoint, item: KernelCircle) {
  const dx = target.x - item.center.x;
  const dy = target.y - item.center.y;
  const length = Math.hypot(dx, dy) || 1;
  return point(item.center.x + (dx / length) * item.radius, item.center.y + (dy / length) * item.radius);
}

function projectPointToLine(target: KernelPoint, item: KernelLinearObject) {
  const dx = item.b.x - item.a.x;
  const dy = item.b.y - item.a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = ((target.x - item.a.x) * dx + (target.y - item.a.y) * dy) / lengthSquared;
  const clamped = item.kind === "segment" ? Math.max(0, Math.min(1, t)) : item.kind === "ray" ? Math.max(0, t) : t;
  return point(item.a.x + clamped * dx, item.a.y + clamped * dy);
}

function pointAtDistance(anchor: KernelPoint, target: KernelPoint, fixedDistance: number) {
  const dx = target.x - anchor.x;
  const dy = target.y - anchor.y;
  const length = Math.hypot(dx, dy) || 1;
  return point(anchor.x + (dx / length) * fixedDistance, anchor.y + (dy / length) * fixedDistance);
}

function projectPointToPlane(target: Point3, planePoint: Point3, normal: Vector3) {
  const dx = target.x - planePoint.x;
  const dy = target.y - planePoint.y;
  const dz = target.z - planePoint.z;
  const signed = dx * normal.x + dy * normal.y + dz * normal.z;
  return point3(target.x - signed * normal.x, target.y - signed * normal.y, target.z - signed * normal.z);
}

function isLinearObject(object: KernelObject | undefined): object is KernelLinearObject {
  return object?.kind === "line" || object?.kind === "segment" || object?.kind === "ray";
}

function lineFromDirection(through: KernelPoint, reference: KernelLinearObject, perpendicular: boolean) {
  const dx = reference.b.x - reference.a.x;
  const dy = reference.b.y - reference.a.y;
  const direction = perpendicular ? point(-dy, dx) : point(dx, dy);
  return line(through, point(through.x + direction.x, through.y + direction.y));
}

function pointAtAngle(vertex: KernelPoint, reference: KernelPoint, target: KernelPoint, degrees: number) {
  const referenceAngle = Math.atan2(reference.y - vertex.y, reference.x - vertex.x);
  const radius = distanceBetween(vertex, target) || distanceBetween(vertex, reference) || 1;
  const theta = referenceAngle + (degrees * Math.PI) / 180;
  return point(vertex.x + Math.cos(theta) * radius, vertex.y + Math.sin(theta) * radius);
}

function pushDiagnostic(diagnostics: ExactConstraintDiagnostic[], constraintId: string, severity: ExactConstraintDiagnostic["severity"], message: string) {
  if (diagnostics.some((item) => item.constraintId === constraintId && item.message === message)) return;
  diagnostics.push({ constraintId, severity, message });
}
