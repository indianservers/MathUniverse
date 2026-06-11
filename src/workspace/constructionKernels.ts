import { circle, distanceBetween, intersectObjects, line, midpoint, point, type KernelCircle, type KernelLine, type KernelObject, type KernelPoint } from "./geometry2dKernel";
import { intersect3, line3, plane3, point3, sphere3, vector3, type Object3, type Point3, type Vector3 } from "./geometry3dKernel";

export type Exact2DConstraint =
  | { id: string; type: "coincident"; target: string; source: string }
  | { id: string; type: "midpoint"; target: string; a: string; b: string }
  | { id: string; type: "on-circle"; target: string; circle: string }
  | { id: string; type: "on-line"; target: string; line: string }
  | { id: string; type: "intersection"; target: string; first: string; second: string }
  | { id: string; type: "fixed-distance"; target: string; anchor: string; distance: number };

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

export function solveExact2D(state: Exact2DState, movingPointId?: string): Exact2DState {
  let points = { ...state.points };
  for (let pass = 0; pass < 8; pass += 1) {
    for (const constraint of state.constraints) {
      if (constraint.type === "coincident" && points[constraint.source]) points[constraint.target] = points[constraint.source];
      if (constraint.type === "midpoint" && points[constraint.a] && points[constraint.b]) points[constraint.target] = midpoint(points[constraint.a], points[constraint.b]);
      if (constraint.type === "on-circle") {
        const target = points[constraint.target];
        const object = state.objects[constraint.circle];
        if (target && object?.kind === "circle") points[constraint.target] = projectPointToCircle(target, object);
      }
      if (constraint.type === "on-line") {
        const target = points[constraint.target];
        const object = state.objects[constraint.line];
        if (target && isLineObject(object)) points[constraint.target] = projectPointToLine(target, object);
      }
      if (constraint.type === "intersection") {
        const first = state.objects[constraint.first];
        const second = state.objects[constraint.second];
        if (first && second) {
          const [hit] = intersectObjects(first, second);
          if (hit) points[constraint.target] = point(hit.x, hit.y);
        }
      }
      if (constraint.type === "fixed-distance" && (!movingPointId || movingPointId === constraint.target)) {
        const target = points[constraint.target];
        const anchor = points[constraint.anchor];
        if (target && anchor) points[constraint.target] = pointAtDistance(anchor, target, constraint.distance);
      }
    }
  }
  return { ...state, points, objects: rebuild2DObjects(state.objects, points) };
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
  Object.entries(objects).forEach(([id, object]) => {
    const parents = id.split(":");
    if (parents[0] === "line" && points[parents[1]] && points[parents[2]]) rebuilt[id] = line(points[parents[1]], points[parents[2]]);
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

function projectPointToLine(target: KernelPoint, item: KernelLine) {
  const dx = item.b.x - item.a.x;
  const dy = item.b.y - item.a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = ((target.x - item.a.x) * dx + (target.y - item.a.y) * dy) / lengthSquared;
  return point(item.a.x + t * dx, item.a.y + t * dy);
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

function isLineObject(object: KernelObject | undefined): object is KernelLine {
  return object?.kind === "line";
}
