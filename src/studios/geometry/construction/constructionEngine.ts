import {
  add,
  angleAt,
  angleBisector as angleBisectorLine,
  areCollinear,
  areEqualLength,
  centroid,
  circleCircleIntersection,
  circumcenter,
  dilate,
  dist,
  incenter,
  isParallel,
  isPerpendicular,
  lineCircleIntersection,
  lineFromPoints,
  lineIntersection,
  midpoint,
  nearly,
  orthocenter,
  parallelLineThrough,
  perpendicularBisector,
  perpendicularLineThrough,
  pointOnCircle,
  pointOnLine,
  polygonArea,
  polygonPerimeter,
  projectPointToLine,
  reflectOverLine,
  rotateAround,
  scale,
  type CircleGeom,
  type LineGeom,
  type Vec,
} from "./constructionMath";

export type ObjKind =
  | "freePoint"
  | "pointOnObject"
  | "intersection"
  | "midpoint"
  | "segment"
  | "line"
  | "ray"
  | "vector"
  | "circleCP"
  | "circleCR"
  | "circle3"
  | "circleDiameter"
  | "perp"
  | "parallel"
  | "perpBisector"
  | "angleBisector"
  | "median"
  | "altitude"
  | "triangle"
  | "polygon"
  | "regularPolygon"
  | "angle"
  | "distance"
  | "text"
  | "reflect"
  | "rotate"
  | "translate"
  | "dilate";

export type GeomObject = {
  id: string;
  kind: ObjKind;
  label: string;
  parents: string[];
  visible: boolean;
  locked: boolean;
  constructed: boolean;
  params?: Record<string, number | string>;
};

export type Evaluated = {
  point: Vec | null;
  line: LineGeom | null;
  circle: CircleGeom | null;
  polygon: Vec[] | null;
  undefinedReason?: string;
};

export type World = Record<string, Evaluated>;

export const POINT_KINDS: ObjKind[] = [
  "freePoint",
  "pointOnObject",
  "intersection",
  "midpoint",
  "reflect",
  "rotate",
  "translate",
  "dilate",
];

export function isPointKind(kind: ObjKind) {
  return POINT_KINDS.includes(kind);
}

export function isFreeDraggable(obj: GeomObject) {
  return obj.kind === "freePoint" && !obj.locked;
}

export function defaultConstruction(): GeomObject[] {
  return [
    { id: "A", kind: "freePoint", label: "A", parents: [], visible: true, locked: false, constructed: true, params: { x: -2, y: 0 } },
    { id: "B", kind: "freePoint", label: "B", parents: [], visible: true, locked: false, constructed: true, params: { x: 2, y: 0 } },
    { id: "AB", kind: "segment", label: "AB", parents: ["A", "B"], visible: true, locked: false, constructed: true },
    { id: "O", kind: "midpoint", label: "O", parents: ["A", "B"], visible: true, locked: false, constructed: true },
    { id: "l1", kind: "perpBisector", label: "l₁", parents: ["A", "B"], visible: true, locked: false, constructed: true },
    { id: "c1", kind: "circleCP", label: "c₁", parents: ["O", "A"], visible: true, locked: false, constructed: true },
    { id: "C", kind: "intersection", label: "C", parents: ["l1", "c1"], visible: true, locked: false, constructed: true, params: { index: 0 } },
    { id: "CA", kind: "segment", label: "CA", parents: ["C", "A"], visible: true, locked: false, constructed: true },
    { id: "CB", kind: "segment", label: "CB", parents: ["C", "B"], visible: true, locked: false, constructed: true },
  ];
}

export function nextLabel(objects: GeomObject[], kind: ObjKind) {
  if (isPointKind(kind)) {
    const used = new Set(objects.filter((o) => isPointKind(o.kind)).map((o) => o.label));
    for (let i = 0; i < 52; i += 1) {
      const letter = String.fromCharCode(65 + (i % 26)) + (i >= 26 ? "′" : "");
      if (!used.has(letter)) return letter;
    }
  }
  const prefix =
    kind === "segment" ? "s" :
    kind === "line" || kind === "perp" || kind === "parallel" || kind === "perpBisector" ? "l" :
    kind.startsWith("circle") ? "c" :
    kind === "angle" ? "∠" :
    kind === "distance" ? "d" : "obj";
  let n = 1;
  while (objects.some((o) => o.label === `${prefix}${n}` || o.label === `${prefix}₁` && n === 1)) n += 1;
  return `${prefix}${n}`;
}

export function nextId(objects: GeomObject[], prefix: string) {
  let n = 1;
  while (objects.some((o) => o.id === `${prefix}${n}`)) n += 1;
  return `${prefix}${n}`;
}

export function childrenOf(objects: GeomObject[], id: string) {
  return objects.filter((o) => o.parents.includes(id)).map((o) => o.id);
}

export function descendantsOf(objects: GeomObject[], id: string) {
  const found = new Set<string>();
  const walk = (cur: string) => {
    for (const child of childrenOf(objects, cur)) {
      if (found.has(child)) continue;
      found.add(child);
      walk(child);
    }
  };
  walk(id);
  return [...found];
}

export function ancestorsOf(objects: GeomObject[], id: string) {
  const map = new Map(objects.map((o) => [o.id, o]));
  const found = new Set<string>();
  const walk = (cur: string) => {
    const obj = map.get(cur);
    if (!obj) return;
    for (const parent of obj.parents) {
      if (found.has(parent)) continue;
      found.add(parent);
      walk(parent);
    }
  };
  walk(id);
  return [...found];
}

function topo(objects: GeomObject[]) {
  const ids = new Set(objects.map((o) => o.id));
  const indeg = new Map(objects.map((o) => [o.id, o.parents.filter((p) => ids.has(p)).length]));
  const byParent = new Map<string, string[]>();
  for (const o of objects) {
    for (const p of o.parents) {
      if (!byParent.has(p)) byParent.set(p, []);
      byParent.get(p)!.push(o.id);
    }
  }
  const queue = objects.filter((o) => (indeg.get(o.id) ?? 0) === 0).map((o) => o.id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const child of byParent.get(id) ?? []) {
      indeg.set(child, (indeg.get(child) ?? 1) - 1);
      if ((indeg.get(child) ?? 0) === 0) queue.push(child);
    }
  }
  return order.length === objects.length ? order : objects.map((o) => o.id);
}

function emptyEval(reason?: string): Evaluated {
  return { point: null, line: null, circle: null, polygon: null, undefinedReason: reason };
}

function asPoint(world: World, id: string) {
  return world[id]?.point ?? null;
}

function asLine(world: World, obj: GeomObject, evaluated: Evaluated): LineGeom | null {
  if (evaluated.line) return evaluated.line;
  if (obj.kind === "segment" || obj.kind === "ray" || obj.kind === "vector" || obj.kind === "median" || obj.kind === "altitude") {
    const a = asPoint(world, obj.parents[0] ?? "");
    const b = asPoint(world, obj.parents[1] ?? "");
    if (a && b) return lineFromPoints(a, b);
  }
  return null;
}

function asCircle(world: World, evaluated: Evaluated) {
  return evaluated.circle;
}

export function evaluate(objects: GeomObject[]): World {
  const map = new Map(objects.map((o) => [o.id, o]));
  const world: World = {};
  for (const id of topo(objects)) {
    const obj = map.get(id);
    if (!obj) continue;
    world[id] = evalOne(obj, world, map);
  }
  return world;
}

function evalOne(obj: GeomObject, world: World, map: Map<string, GeomObject>): Evaluated {
  const p = (...i: number[]) => obj.parents[i[0] ?? 0] ? asPoint(world, obj.parents[i[0]!]!) : null;
  const parentObj = (i: number) => map.get(obj.parents[i] ?? "");
  const parentEval = (i: number) => world[obj.parents[i] ?? ""];

  try {
    switch (obj.kind) {
      case "freePoint": {
        const x = Number(obj.params?.x ?? 0);
        const y = Number(obj.params?.y ?? 0);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return emptyEval("Point coordinates are invalid.");
        return { point: { x, y }, line: null, circle: null, polygon: null };
      }
      case "midpoint": {
        const a = p(0);
        const b = p(1);
        if (!a || !b) return emptyEval("Midpoint needs two defined points.");
        if (dist(a, b) < 1e-10) return emptyEval("Coincident points: midpoint is degenerate.");
        return { point: midpoint(a, b), line: null, circle: null, polygon: null };
      }
      case "pointOnObject": {
        const host = parentEval(0);
        const t = Number(obj.params?.t ?? 0.5);
        if (host?.circle) {
          return {
            point: add(host.circle.center, { x: host.circle.r * Math.cos(t), y: host.circle.r * Math.sin(t) }),
            line: null, circle: null, polygon: null,
          };
        }
        if (host?.line) {
          return { point: add(host.line.origin, scale(host.line.dir, t)), line: null, circle: null, polygon: null };
        }
        const a = p(0);
        const b = p(1);
        if (a && b) return { point: add(a, scale({ x: b.x - a.x, y: b.y - a.y }, t)), line: null, circle: null, polygon: null };
        return emptyEval("Host object is undefined.");
      }
      case "intersection": {
        const a = parentEval(0);
        const b = parentEval(1);
        const index = Number(obj.params?.index ?? 0);
        if (!a || !b) return emptyEval("Intersection parents are missing.");
        const lineA = asLine(world, parentObj(0)!, a);
        const lineB = asLine(world, parentObj(1)!, b);
        const circA = asCircle(world, a);
        const circB = asCircle(world, b);
        let hits: Vec[] = [];
        if (lineA && lineB) {
          const hit = lineIntersection(lineA, lineB);
          hits = hit ? [hit] : [];
          if (!hits.length) return emptyEval("Parent lines do not currently intersect.");
        } else if (lineA && circB) hits = lineCircleIntersection(lineA, circB);
        else if (lineB && circA) hits = lineCircleIntersection(lineB, circA);
        else if (circA && circB) hits = circleCircleIntersection(circA, circB);
        else return emptyEval("Intersection needs two lines or circles.");
        if (!hits.length) return emptyEval("Parent objects do not currently intersect.");
        hits.sort((u, v) => v.y - u.y || u.x - v.x);
        const pick = hits[Math.min(Math.max(0, index), hits.length - 1)] ?? null;
        if (!pick) return emptyEval("Requested intersection index is unavailable.");
        return { point: pick, line: null, circle: null, polygon: null };
      }
      case "segment":
      case "line":
      case "ray":
      case "vector": {
        const a = p(0);
        const b = p(1);
        if (!a || !b) return emptyEval("Needs two defined endpoints.");
        const line = lineFromPoints(a, b);
        if (!line) return emptyEval("Coincident points: line is undefined.");
        return { point: null, line, circle: null, polygon: [a, b] };
      }
      case "circleCP": {
        const c = p(0);
        const q = p(1);
        if (!c || !q) return emptyEval("Circle needs a center and a point.");
        const r = dist(c, q);
        if (r < 1e-10) return emptyEval("Zero radius.");
        return { point: null, line: null, circle: { center: c, r }, polygon: null };
      }
      case "circleCR": {
        const c = p(0);
        const r = Number(obj.params?.r ?? 1);
        if (!c) return emptyEval("Circle needs a center.");
        if (!(r > 1e-10)) return emptyEval("Zero radius.");
        return { point: null, line: null, circle: { center: c, r }, polygon: null };
      }
      case "circle3": {
        const a = p(0);
        const b = p(1);
        const c = p(2);
        if (!a || !b || !c) return emptyEval("Three-point circle needs three points.");
        const center = circumcenter(a, b, c);
        if (!center) return emptyEval("Points are collinear: no unique circle.");
        return { point: null, line: null, circle: { center, r: dist(center, a) }, polygon: null };
      }
      case "circleDiameter": {
        const a = p(0);
        const b = p(1);
        if (!a || !b) return emptyEval("Diameter circle needs two points.");
        const center = midpoint(a, b);
        const r = dist(a, b) / 2;
        if (r < 1e-10) return emptyEval("Zero diameter.");
        return { point: null, line: null, circle: { center, r }, polygon: [a, b] };
      }
      case "perpBisector": {
        const a = p(0);
        const b = p(1);
        if (!a || !b) return emptyEval("Perpendicular bisector needs two points.");
        const line = perpendicularBisector(a, b);
        if (!line) return emptyEval("Coincident points: bisector is undefined.");
        return { point: null, line, circle: null, polygon: null };
      }
      case "perp": {
        const through = p(0);
        const host = parentEval(1);
        const hostObj = parentObj(1);
        const line = host && hostObj ? asLine(world, hostObj, host) : null;
        if (!through || !line) return emptyEval("Perpendicular needs a point and a line.");
        return { point: null, line: perpendicularLineThrough(through, line), circle: null, polygon: null };
      }
      case "parallel": {
        const through = p(0);
        const host = parentEval(1);
        const hostObj = parentObj(1);
        const line = host && hostObj ? asLine(world, hostObj, host) : null;
        if (!through || !line) return emptyEval("Parallel needs a point and a line.");
        return { point: null, line: parallelLineThrough(through, line), circle: null, polygon: null };
      }
      case "angleBisector": {
        const a = p(0);
        const v = p(1);
        const c = p(2);
        if (!a || !v || !c) return emptyEval("Angle bisector needs three points.");
        const line = angleBisectorLine(a, v, c);
        if (!line) return emptyEval("Degenerate angle.");
        return { point: null, line, circle: null, polygon: null };
      }
      case "median": {
        const vertex = p(0);
        const a = p(1);
        const b = p(2);
        if (!vertex || !a || !b) return emptyEval("Median needs a vertex and a side.");
        const m = midpoint(a, b);
        const line = lineFromPoints(vertex, m);
        if (!line) return emptyEval("Degenerate median.");
        return { point: m, line, circle: null, polygon: [vertex, m] };
      }
      case "altitude": {
        const vertex = p(0);
        const a = p(1);
        const b = p(2);
        if (!vertex || !a || !b) return emptyEval("Altitude needs a vertex and a side.");
        const base = lineFromPoints(a, b);
        if (!base) return emptyEval("Degenerate base.");
        const foot = projectPointToLine(vertex, base);
        return { point: foot, line: lineFromPoints(vertex, foot), circle: null, polygon: [vertex, foot] };
      }
      case "triangle":
      case "polygon": {
        const pts = obj.parents.map((id) => asPoint(world, id)).filter(Boolean) as Vec[];
        if (pts.length < 3) return emptyEval("Polygon needs at least three points.");
        return { point: centroid(pts), line: null, circle: null, polygon: pts };
      }
      case "regularPolygon": {
        const c = p(0);
        const q = p(1);
        const n = Math.max(3, Math.round(Number(obj.params?.n ?? 6)));
        if (!c || !q) return emptyEval("Regular polygon needs a center and a vertex.");
        const pts: Vec[] = [];
        const r = dist(c, q);
        const a0 = Math.atan2(q.y - c.y, q.x - c.x);
        for (let i = 0; i < n; i += 1) {
          const a = a0 + (i * 2 * Math.PI) / n;
          pts.push({ x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) });
        }
        return { point: c, line: null, circle: null, polygon: pts };
      }
      case "angle": {
        const a = p(0);
        const v = p(1);
        const c = p(2);
        if (!a || !v || !c) return emptyEval("Angle needs three points.");
        return { point: v, line: null, circle: null, polygon: [a, v, c] };
      }
      case "distance": {
        const a = p(0);
        const b = p(1);
        if (!a || !b) return emptyEval("Distance needs two points.");
        return { point: midpoint(a, b), line: lineFromPoints(a, b), circle: null, polygon: [a, b] };
      }
      case "text": {
        return {
          point: { x: Number(obj.params?.x ?? 0), y: Number(obj.params?.y ?? 0) },
          line: null, circle: null, polygon: null,
        };
      }
      case "reflect": {
        const src = p(0);
        const host = parentEval(1);
        const hostObj = parentObj(1);
        const line = host && hostObj ? asLine(world, hostObj, host) : null;
        if (!src || !line) return emptyEval("Reflection needs a point and a line.");
        return { point: reflectOverLine(src, line), line: null, circle: null, polygon: null };
      }
      case "rotate": {
        const src = p(0);
        const center = p(1);
        const ang = Number(obj.params?.angle ?? 90);
        if (!src || !center) return emptyEval("Rotation needs a point and a center.");
        return { point: rotateAround(src, center, ang), line: null, circle: null, polygon: null };
      }
      case "translate": {
        const src = p(0);
        if (!src) return emptyEval("Translation needs a source point.");
        return {
          point: { x: src.x + Number(obj.params?.dx ?? 1), y: src.y + Number(obj.params?.dy ?? 0) },
          line: null, circle: null, polygon: null,
        };
      }
      case "dilate": {
        const src = p(0);
        const center = p(1);
        if (!src || !center) return emptyEval("Dilation needs a point and a center.");
        return { point: dilate(src, center, Number(obj.params?.k ?? 2)), line: null, circle: null, polygon: null };
      }
      default:
        return emptyEval("Unknown object type.");
    }
  } catch {
    return emptyEval("Could not evaluate this object.");
  }
}

export type Relation = {
  id: string;
  text: string;
  kind: "constructed" | "observed";
  objectIds: string[];
};

export function detectRelations(objects: GeomObject[], world: World): Relation[] {
  const rel: Relation[] = [];
  const pts = objects.filter((o) => isPointKind(o.kind) && world[o.id]?.point);
  for (const obj of objects) {
    const ev = world[obj.id];
    if (!ev) continue;
    if (obj.kind === "perpBisector" && obj.parents.length >= 2) {
      rel.push({
        id: `${obj.id}-def`,
        text: `${obj.label} is the perpendicular bisector of ${labelOf(objects, obj.parents[0]!)}${labelOf(objects, obj.parents[1]!)}`,
        kind: "constructed",
        objectIds: [obj.id, ...obj.parents],
      });
      for (const q of pts) {
        const p = world[q.id]?.point;
        if (!p || !ev.line) continue;
        if (pointOnLine(p, ev.line)) {
          rel.push({
            id: `${q.id}-on-${obj.id}`,
            text: `${q.label} lies on ${obj.label}`,
            kind: "constructed",
            objectIds: [q.id, obj.id],
          });
        }
      }
    }
    if (obj.kind === "midpoint" && ev.point) {
      rel.push({
        id: `${obj.id}-mid`,
        text: `${obj.label} is the midpoint of ${labelOf(objects, obj.parents[0]!)}${labelOf(objects, obj.parents[1]!)}`,
        kind: "constructed",
        objectIds: [obj.id, ...obj.parents],
      });
    }
    if ((obj.kind === "circleCP" || obj.kind === "circleCR" || obj.kind === "circle3" || obj.kind === "circleDiameter") && ev.circle) {
      for (const q of pts) {
        const p = world[q.id]?.point;
        if (p && pointOnCircle(p, ev.circle)) {
          rel.push({
            id: `${q.id}-on-${obj.id}`,
            text: `${q.label} lies on ${obj.label}`,
            kind: obj.constructed ? "constructed" : "observed",
            objectIds: [q.id, obj.id],
          });
        }
      }
    }
    if ((obj.kind === "perp" || obj.kind === "altitude") && ev.line) {
      const host = parentEvalLine(objects, world, obj, 1) ?? parentEvalLine(objects, world, obj, 2);
      if (host && isPerpendicular(ev.line, host)) {
        rel.push({
          id: `${obj.id}-perp`,
          text: `${obj.label} ⟂ base`,
          kind: "constructed",
          objectIds: [obj.id, ...obj.parents],
        });
      }
    }
    if (obj.kind === "parallel" && ev.line) {
      const host = parentEvalLine(objects, world, obj, 1);
      if (host && isParallel(ev.line, host)) {
        rel.push({
          id: `${obj.id}-par`,
          text: `${obj.label} ∥ parent line`,
          kind: "constructed",
          objectIds: [obj.id, ...obj.parents],
        });
      }
    }
  }
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      for (let k = j + 1; k < pts.length; k += 1) {
        const a = world[pts[i]!.id]!.point!;
        const b = world[pts[j]!.id]!.point!;
        const c = world[pts[k]!.id]!.point!;
        if (areCollinear(a, b, c)) {
          rel.push({
            id: `col-${pts[i]!.id}${pts[j]!.id}${pts[k]!.id}`,
            text: `${pts[i]!.label}, ${pts[j]!.label}, ${pts[k]!.label} collinear`,
            kind: "observed",
            objectIds: [pts[i]!.id, pts[j]!.id, pts[k]!.id],
          });
        }
      }
    }
  }
  const segs = objects.filter((o) => o.kind === "segment" && world[o.id]?.polygon?.length === 2);
  for (let i = 0; i < segs.length; i += 1) {
    for (let j = i + 1; j < segs.length; j += 1) {
      const A = world[segs[i]!.id]!.polygon!;
      const B = world[segs[j]!.id]!.polygon!;
      if (areEqualLength(A[0]!, A[1]!, B[0]!, B[1]!)) {
        const constructed = segs[i]!.constructed && segs[j]!.constructed && sharesPerpBisector(objects, world, segs[i]!, segs[j]!);
        rel.push({
          id: `eq-${segs[i]!.id}-${segs[j]!.id}`,
          text: `${segs[i]!.label} = ${segs[j]!.label}`,
          kind: constructed ? "constructed" : "observed",
          objectIds: [segs[i]!.id, segs[j]!.id],
        });
      }
    }
  }
  return rel;
}

function labelOf(objects: GeomObject[], id: string) {
  return objects.find((o) => o.id === id)?.label ?? id;
}

function parentEvalLine(objects: GeomObject[], world: World, obj: GeomObject, index: number) {
  const parent = objects.find((o) => o.id === obj.parents[index]);
  const ev = world[obj.parents[index] ?? ""];
  if (!parent || !ev) return null;
  return ev.line ?? (ev.polygon && ev.polygon.length === 2 ? lineFromPoints(ev.polygon[0]!, ev.polygon[1]!) : null);
}

function sharesPerpBisector(objects: GeomObject[], world: World, s1: GeomObject, s2: GeomObject) {
  const ends = [...s1.parents, ...s2.parents];
  const unique = [...new Set(ends)];
  if (unique.length !== 3) return false;
  const shared = unique.find((id) => s1.parents.includes(id) && s2.parents.includes(id));
  if (!shared) return false;
  const p = world[shared]?.point;
  return objects.some((o) => o.kind === "perpBisector" && world[o.id]?.line && p && pointOnLine(p, world[o.id]!.line!));
}

export type Measurement = {
  group: "distances" | "angles" | "circle" | "polygon" | "point" | "relationships";
  label: string;
  value: number | string;
  numeric?: number;
  objectIds: string[];
  constructed?: boolean;
};

export function collectMeasurements(objects: GeomObject[], world: World, selectedId: string | null): Measurement[] {
  const out: Measurement[] = [];
  for (const obj of objects) {
    const ev = world[obj.id];
    if (!ev) continue;
    if (isPointKind(obj.kind) && ev.point) {
      out.push({ group: "point", label: `${obj.label} x`, value: ev.point.x, numeric: ev.point.x, objectIds: [obj.id] });
      out.push({ group: "point", label: `${obj.label} y`, value: ev.point.y, numeric: ev.point.y, objectIds: [obj.id] });
    }
    if (obj.kind === "segment" && ev.polygon?.length === 2) {
      const d = dist(ev.polygon[0]!, ev.polygon[1]!);
      out.push({ group: "distances", label: obj.label, value: d, numeric: d, objectIds: [obj.id, ...obj.parents], constructed: obj.constructed });
    }
    if (obj.kind === "distance" && ev.polygon?.length === 2) {
      const d = dist(ev.polygon[0]!, ev.polygon[1]!);
      out.push({ group: "distances", label: `d(${obj.label})`, value: d, numeric: d, objectIds: [obj.id, ...obj.parents] });
    }
    if (obj.kind === "angle" && ev.polygon?.length === 3) {
      const ang = angleAt(ev.polygon[0]!, ev.polygon[1]!, ev.polygon[2]!);
      out.push({ group: "angles", label: `∠${obj.label}`, value: ang, numeric: ang, objectIds: [obj.id, ...obj.parents] });
    }
    if (ev.circle) {
      out.push({ group: "circle", label: `${obj.label} radius`, value: ev.circle.r, numeric: ev.circle.r, objectIds: [obj.id] });
      out.push({ group: "circle", label: `${obj.label} circumference`, value: 2 * Math.PI * ev.circle.r, numeric: 2 * Math.PI * ev.circle.r, objectIds: [obj.id] });
      out.push({ group: "circle", label: `${obj.label} area`, value: Math.PI * ev.circle.r * ev.circle.r, numeric: Math.PI * ev.circle.r * ev.circle.r, objectIds: [obj.id] });
    }
    if ((obj.kind === "triangle" || obj.kind === "polygon" || obj.kind === "regularPolygon") && ev.polygon) {
      out.push({ group: "polygon", label: `${obj.label} area`, value: polygonArea(ev.polygon), numeric: polygonArea(ev.polygon), objectIds: [obj.id] });
      out.push({ group: "polygon", label: `${obj.label} perimeter`, value: polygonPerimeter(ev.polygon), numeric: polygonPerimeter(ev.polygon), objectIds: [obj.id] });
    }
  }
  for (const rel of detectRelations(objects, world)) {
    out.push({ group: "relationships", label: rel.text, value: rel.kind === "constructed" ? "constructed" : "observed", objectIds: rel.objectIds, constructed: rel.kind === "constructed" });
  }
  if (selectedId) {
    const focused = out.filter((m) => m.objectIds.includes(selectedId));
    if (focused.length) return [...focused, ...out.filter((m) => !m.objectIds.includes(selectedId))];
  }
  return out;
}

export function moveConstraint(obj: GeomObject, world: World, target: Vec): { x: number; y: number } | null {
  if (obj.kind === "freePoint") return target;
  if (obj.kind === "pointOnObject") {
    const host = world[obj.parents[0] ?? ""];
    if (host?.circle) {
      const ang = Math.atan2(target.y - host.circle.center.y, target.x - host.circle.center.x);
      return add(host.circle.center, { x: host.circle.r * Math.cos(ang), y: host.circle.r * Math.sin(ang) });
    }
    if (host?.line) return projectPointToLine(target, host.line);
  }
  return null;
}

export function serializeScene(objects: GeomObject[], cam: { cx: number; cy: number; zoom: number }) {
  return JSON.stringify({ objects, cam, v: 1 });
}

export function parseScene(raw: string): { objects: GeomObject[]; cam: { cx: number; cy: number; zoom: number } } | null {
  try {
    const data = JSON.parse(raw) as { objects?: GeomObject[]; cam?: { cx: number; cy: number; zoom: number } };
    if (!Array.isArray(data.objects)) return null;
    return { objects: data.objects, cam: data.cam ?? { cx: 0, cy: 0, zoom: 1 } };
  } catch {
    return null;
  }
}
