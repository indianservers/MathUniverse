import { pointById, type Construction, type GeoCircle, type GeoLine, type GeoPoint, type SelectedGeometryObject } from "./geometryCommandController";
import { nextGeometryPointLabel, type GeometryConstructionStatus, type GeometryIdFactory } from "./geometryConstructionBuilder";

export type GeometryAdvancedBuildResult = {
  construction: Construction;
  selectedPointIds?: string[];
  status: GeometryConstructionStatus;
};

export type GeometryAdvancedTransformMode = "translate" | "rotate" | "dilate";

type PointLike = { x: number; y: number };

const defaultIdFactory: GeometryIdFactory = () => crypto.randomUUID();

export function buildMidpointConstruction(
  construction: Construction,
  pointIds: string[],
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const selectedPointIds = pointIds.slice(-2);
  if (selectedPointIds.length < 2) return incomplete(construction, selectedPointIds, "Midpoint", 2 - selectedPointIds.length);
  const [aId, bId] = selectedPointIds;
  const a = pointById(construction.points, aId);
  const b = pointById(construction.points, bId);
  if (!a || !b || aId === bId) return warning(construction, selectedPointIds, "Midpoint needs two existing, different points.");
  const idFactory = options.idFactory ?? defaultIdFactory;
  const point: GeoPoint = {
    id: idFactory(),
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    label: nextGeometryPointLabel(construction.points),
  };
  return success({
    ...construction,
    points: [...construction.points, point],
    constraints: [...construction.constraints, { id: idFactory(), type: "midpoint", a: aId, b: bId, point: point.id }],
  }, "Midpoint created.");
}

export function buildParallelConstruction(
  construction: Construction,
  baseObjectId: string,
  throughPointId: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  return buildParallelOrPerpendicularFromLine(construction, "parallel", baseObjectId, throughPointId, options);
}

export function buildPerpendicularConstruction(
  construction: Construction,
  baseObjectId: string,
  throughPointId: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  return buildParallelOrPerpendicularFromLine(construction, "perpendicular", baseObjectId, throughPointId, options);
}

export function buildParallelPerpendicularFromPoints(
  construction: Construction,
  type: "parallel" | "perpendicular",
  pointIds: string[],
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const selectedPointIds = pointIds.slice(-3);
  if (selectedPointIds.length < 3) return incomplete(construction, selectedPointIds, typeLabel(type), 3 - selectedPointIds.length);
  const [aId, bId, throughPointId] = selectedPointIds;
  const a = pointById(construction.points, aId);
  const b = pointById(construction.points, bId);
  const through = pointById(construction.points, throughPointId);
  if (!a || !b || !through || new Set(selectedPointIds).size !== 3) return warning(construction, selectedPointIds, `${typeLabel(type)} needs three existing, different points.`);
  const idFactory = options.idFactory ?? defaultIdFactory;
  const sourceLine: GeoLine = { id: idFactory(), a: aId, b: bId };
  return createConstrainedLine(construction, type, sourceLine, throughPointId, through, a, b, idFactory);
}

export function buildFixedLengthSegmentConstruction(
  construction: Construction,
  startPointId: string,
  pointId: string,
  options: { idFactory?: GeometryIdFactory; length?: number } = {},
): GeometryAdvancedBuildResult {
  const anchor = pointById(construction.points, startPointId);
  const point = pointById(construction.points, pointId);
  if (!anchor || !point || startPointId === pointId) return warning(construction, [startPointId, pointId].filter(Boolean), "Fixed length needs two existing, different points.");
  const length = options.length ?? distance(anchor, point);
  if (!Number.isFinite(length) || length <= 0.001) return warning(construction, [startPointId, pointId], "Fixed length must be greater than zero.");
  return success({
    ...construction,
    constraints: [...construction.constraints, { id: (options.idFactory ?? defaultIdFactory)(), type: "fixed-length", anchor: startPointId, point: pointId, length }],
  }, "Fixed length constraint created.");
}

export function buildPointOnCircleConstraint(
  construction: Construction,
  pointId: string,
  circleId?: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const point = pointById(construction.points, pointId);
  const circle = circleId ? construction.circles.find((item) => item.id === circleId) : construction.circles[0];
  if (!point || !circle) return warning(construction, [pointId], "Point-on-circle needs an existing point and circle.");
  return success({
    ...construction,
    constraints: [...construction.constraints, { id: (options.idFactory ?? defaultIdFactory)(), type: "on-circle", point: pointId, circle: circle.id }],
  }, "Point constrained to circle.");
}

export function buildIntersectionConstruction(
  construction: Construction,
  objectAId?: string,
  objectBId?: string,
  options: { firstType?: "line" | "circle"; secondType?: "line" | "circle"; idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const idFactory = options.idFactory ?? defaultIdFactory;
  const hits = objectAId && objectBId && options.firstType && options.secondType
    ? intersectionsForSelectedObjects(construction, { type: options.firstType, id: objectAId }, { type: options.secondType, id: objectBId })
    : allIntersections(construction);
  const freshHits = hits.filter((hit) => !construction.points.some((point) => distance(point, hit) < 4));
  if (!freshHits.length) return warning(construction, [], "No supported new intersections found.");
  const points = freshHits.slice(0, objectAId && objectBId ? 4 : 12).map((hit, index) => ({
    id: idFactory(),
    x: hit.x,
    y: hit.y,
    label: nextGeometryPointLabel(construction.points, index),
    style: { color: "#f97316" },
  }));
  const constraints = objectAId && objectBId && options.firstType && options.secondType
    ? points.map((point, index) => ({
      id: idFactory(),
      type: "intersection" as const,
      first: objectAId,
      second: objectBId,
      point: point.id,
      firstType: options.firstType,
      secondType: options.secondType,
      index,
    }))
    : [];
  return success({
    ...construction,
    points: [...construction.points, ...points],
    constraints: [...construction.constraints, ...constraints],
  }, "Intersection point created.");
}

export function buildCompassCopyConstruction(
  construction: Construction,
  sourceStartId: string,
  sourceEndId: string,
  targetPointId: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const sourceStart = pointById(construction.points, sourceStartId);
  const sourceEnd = pointById(construction.points, sourceEndId);
  const target = pointById(construction.points, targetPointId);
  if (!sourceStart || !sourceEnd || !target) return warning(construction, [sourceStartId, sourceEndId, targetPointId].filter(Boolean), "Compass copy needs two radius points and a target center.");
  const radius = distance(sourceStart, sourceEnd);
  if (radius <= 0.001) return warning(construction, [sourceStartId, sourceEndId, targetPointId], "Compass radius must be greater than zero.");
  const idFactory = options.idFactory ?? defaultIdFactory;
  const edge: GeoPoint = { id: idFactory(), x: target.x + radius, y: target.y, label: nextGeometryPointLabel(construction.points) };
  return success({
    ...construction,
    points: [...construction.points, edge],
    circles: [...construction.circles, { id: idFactory(), center: targetPointId, edge: edge.id }],
  }, "Compass circle copied.");
}

export function buildRegularPolygonConstruction(
  construction: Construction,
  pointIds: string[],
  sides: number,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const selectedPointIds = pointIds.slice(-2);
  if (selectedPointIds.length < 2) return incomplete(construction, selectedPointIds, "Regular polygon", 2 - selectedPointIds.length);
  const [aId, bId] = selectedPointIds;
  const a = pointById(construction.points, aId);
  const b = pointById(construction.points, bId);
  if (!Number.isInteger(sides) || sides < 3) return warning(construction, selectedPointIds, "Regular polygon needs at least 3 sides.");
  if (!a || !b || aId === bId) return warning(construction, selectedPointIds, "Regular polygon needs two existing, different adjacent vertices.");
  const idFactory = options.idFactory ?? defaultIdFactory;
  const angle0 = Math.atan2(b.y - a.y, b.x - a.x);
  const side = distance(a, b);
  if (side <= 0.001) return warning(construction, selectedPointIds, "Regular polygon side length must be greater than zero.");
  const radius = side / (2 * Math.sin(Math.PI / sides));
  const apothem = side / (2 * Math.tan(Math.PI / sides));
  const normal = { x: -Math.sin(angle0), y: Math.cos(angle0) };
  const center = {
    x: (a.x + b.x) / 2 + normal.x * apothem,
    y: (a.y + b.y) / 2 + normal.y * apothem,
  };
  const startAngle = Math.atan2(a.y - center.y, a.x - center.x);
  const stepAngle = (Math.PI * 2) / sides;
  const extra = Array.from({ length: sides - 2 }, (_, index) => {
    const angle = startAngle + (index + 2) * stepAngle;
    return { id: idFactory(), x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius, label: nextGeometryPointLabel(construction.points, index) };
  });
  return success({
    ...construction,
    points: [...construction.points, ...extra],
    polygons: [...construction.polygons, { id: idFactory(), points: [aId, bId, ...extra.map((point) => point.id)], style: { fill: "rgba(20,184,166,.14)", color: "#14b8a6", label: "regular-polygon" } }],
  }, `${sides}-sided regular polygon created.`);
}

export function buildMirrorTransformPayload(
  construction: Construction,
  pointId: string,
  axisPointAId: string,
  axisPointBId: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const point = pointById(construction.points, pointId);
  const axisA = pointById(construction.points, axisPointAId);
  const axisB = pointById(construction.points, axisPointBId);
  if (!point || !axisA || !axisB || axisPointAId === axisPointBId) return warning(construction, [pointId, axisPointAId, axisPointBId].filter(Boolean), "Mirror needs a point and two different axis points.");
  const projection = projectRawPointToLine(point, axisA, axisB);
  const idFactory = options.idFactory ?? defaultIdFactory;
  const mirrored: GeoPoint = { id: idFactory(), x: 2 * projection.x - point.x, y: 2 * projection.y - point.y, label: nextGeometryPointLabel(construction.points), style: { color: "#ec4899" } };
  return success({
    ...construction,
    points: [...construction.points, mirrored],
    lines: [...construction.lines, { id: idFactory(), a: pointId, b: mirrored.id, style: { color: "#ec4899", strokeWidth: 2 } }],
  }, "Mirror point created.");
}

export function buildRotateTransformPayload(
  construction: Construction,
  pointId: string,
  centerPointId: string,
  angleDegrees: number,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const point = pointById(construction.points, pointId);
  const center = pointById(construction.points, centerPointId);
  if (!point || !center || pointId === centerPointId || !Number.isFinite(angleDegrees)) return warning(construction, [pointId, centerPointId].filter(Boolean), "Rotate needs a point, a different center, and a finite angle.");
  const angle = degreesToRadians(angleDegrees);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const rotated: GeoPoint = {
    id: (options.idFactory ?? defaultIdFactory)(),
    x: center.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: center.y + dx * Math.sin(angle) + dy * Math.cos(angle),
    label: nextGeometryPointLabel(construction.points),
    style: { color: "#8b5cf6" },
  };
  return success({ ...construction, points: [...construction.points, rotated] }, "Rotated point created.");
}

export function buildDilateTransformPayload(
  construction: Construction,
  pointId: string,
  centerPointId: string,
  scale: number,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const point = pointById(construction.points, pointId);
  const center = pointById(construction.points, centerPointId);
  if (!point || !center || pointId === centerPointId || !Number.isFinite(scale) || scale <= 0) return warning(construction, [pointId, centerPointId].filter(Boolean), "Dilate needs a point, a different center, and a positive scale.");
  const dilated: GeoPoint = {
    id: (options.idFactory ?? defaultIdFactory)(),
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
    label: nextGeometryPointLabel(construction.points),
    style: { color: "#10b981" },
  };
  return success({ ...construction, points: [...construction.points, dilated] }, "Dilated point created.");
}

export function buildTranslateTransformPayload(
  construction: Construction,
  pointId: string,
  vectorStartId: string,
  vectorEndId: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const point = pointById(construction.points, pointId);
  const from = pointById(construction.points, vectorStartId);
  const to = pointById(construction.points, vectorEndId);
  if (!point || !from || !to || vectorStartId === vectorEndId) return warning(construction, [pointId, vectorStartId, vectorEndId].filter(Boolean), "Translate needs a point and two different vector points.");
  const translated: GeoPoint = {
    id: (options.idFactory ?? defaultIdFactory)(),
    x: point.x + to.x - from.x,
    y: point.y + to.y - from.y,
    label: nextGeometryPointLabel(construction.points),
    style: { color: "#06b6d4" },
  };
  return success({ ...construction, points: [...construction.points, translated] }, "Translated point created.");
}

export function buildSelectedPointsTransform(
  construction: Construction,
  ids: string[],
  mode: GeometryAdvancedTransformMode,
): GeometryAdvancedBuildResult {
  const uniqueIds = Array.from(new Set(ids));
  const points = construction.points.filter((point) => uniqueIds.includes(point.id));
  if (!points.length) return warning(construction, uniqueIds, "Transform needs at least one selected point.");
  const center = centroid(points);
  const angle = degreesToRadians(20);
  return success({
    ...construction,
    points: construction.points.map((point) => {
      if (!uniqueIds.includes(point.id)) return point;
      if (mode === "translate") return { ...point, x: point.x + 24, y: point.y - 18 };
      if (mode === "dilate") return { ...point, x: center.x + (point.x - center.x) * 1.15, y: center.y + (point.y - center.y) * 1.15 };
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      return { ...point, x: center.x + dx * Math.cos(angle) - dy * Math.sin(angle), y: center.y + dx * Math.sin(angle) + dy * Math.cos(angle) };
    }),
  }, `${mode} applied to selected points.`);
}

export function buildUnsupportedAdvancedConstruction(construction: Construction, actionName: string): GeometryAdvancedBuildResult {
  return {
    construction,
    status: {
      type: "unsupported",
      message: `${actionName} is not supported as an advanced construction builder yet.`,
    },
  };
}

function buildParallelOrPerpendicularFromLine(
  construction: Construction,
  type: "parallel" | "perpendicular",
  sourceLineId: string,
  throughPointId: string,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryAdvancedBuildResult {
  const sourceLine = construction.lines.find((line) => line.id === sourceLineId);
  const through = pointById(construction.points, throughPointId);
  const sourceA = sourceLine ? pointById(construction.points, sourceLine.a) : null;
  const sourceB = sourceLine ? pointById(construction.points, sourceLine.b) : null;
  if (!sourceLine || !through || !sourceA || !sourceB) return warning(construction, [throughPointId].filter(Boolean), `${typeLabel(type)} needs an existing source line and through-point.`);
  return createConstrainedLine(construction, type, sourceLine, throughPointId, through, sourceA, sourceB, options.idFactory ?? defaultIdFactory);
}

function createConstrainedLine(
  construction: Construction,
  type: "parallel" | "perpendicular",
  sourceLine: GeoLine,
  throughPointId: string,
  through: GeoPoint,
  sourceA: GeoPoint,
  sourceB: GeoPoint,
  idFactory: GeometryIdFactory,
) {
  const vector = unitVector(sourceA, sourceB, type === "perpendicular");
  const end: GeoPoint = { id: idFactory(), x: through.x + vector.x * 120, y: through.y + vector.y * 120, label: nextGeometryPointLabel(construction.points, 1) };
  const constrainedLine: GeoLine = { id: idFactory(), a: throughPointId, b: end.id, style: { color: type === "parallel" ? "#10b981" : "#ef4444", label: type } };
  const sourceLineExists = construction.lines.some((line) => line.id === sourceLine.id);
  return success({
    ...construction,
    lines: sourceLineExists ? [...construction.lines, constrainedLine] : [...construction.lines, sourceLine, constrainedLine],
    points: [...construction.points, end],
    constraints: [...construction.constraints, { id: idFactory(), type, sourceLine: sourceLine.id, throughPoint: throughPointId, line: constrainedLine.id }],
  }, `${typeLabel(type)} line created.`);
}

function allIntersections(construction: Construction) {
  const output: PointLike[] = [];
  for (let i = 0; i < construction.lines.length; i += 1) {
    for (let j = i + 1; j < construction.lines.length; j += 1) {
      const hit = lineIntersection(construction.lines[i], construction.lines[j], construction.points);
      if (hit) output.push(hit);
    }
    for (const circle of construction.circles) output.push(...lineCircleIntersections(construction.lines[i], circle, construction.points));
  }
  for (let i = 0; i < construction.circles.length; i += 1) {
    for (let j = i + 1; j < construction.circles.length; j += 1) output.push(...circleCircleIntersections(construction.circles[i], construction.circles[j], construction.points));
  }
  return uniqueBoardPoints(output);
}

function intersectionsForSelectedObjects(construction: Construction, first: SelectedGeometryObject & { type: "line" | "circle" }, second: SelectedGeometryObject & { type: "line" | "circle" }) {
  if (first.type === "line" && second.type === "line") {
    const firstLine = construction.lines.find((line) => line.id === first.id);
    const secondLine = construction.lines.find((line) => line.id === second.id);
    const hit = firstLine && secondLine ? lineIntersection(firstLine, secondLine, construction.points) : null;
    return hit ? [hit] : [];
  }
  if (first.type === "line" && second.type === "circle") {
    const line = construction.lines.find((item) => item.id === first.id);
    const circle = construction.circles.find((item) => item.id === second.id);
    return line && circle ? lineCircleIntersections(line, circle, construction.points) : [];
  }
  if (first.type === "circle" && second.type === "line") return intersectionsForSelectedObjects(construction, second, first);
  const firstCircle = construction.circles.find((item) => item.id === first.id);
  const secondCircle = construction.circles.find((item) => item.id === second.id);
  return firstCircle && secondCircle ? circleCircleIntersections(firstCircle, secondCircle, construction.points) : [];
}

function lineCircleIntersections(line: GeoLine, circle: GeoCircle, points: GeoPoint[]) {
  const a = pointById(points, line.a), b = pointById(points, line.b), center = pointById(points, circle.center), edge = pointById(points, circle.edge);
  if (!a || !b || !center || !edge) return [];
  const dx = b.x - a.x, dy = b.y - a.y;
  const fx = a.x - center.x, fy = a.y - center.y;
  const radius = distance(center, edge);
  const qa = dx * dx + dy * dy;
  const qb = 2 * (fx * dx + fy * dy);
  const qc = fx * fx + fy * fy - radius * radius;
  const disc = qb * qb - 4 * qa * qc;
  if (disc < -0.001) return [];
  const root = Math.sqrt(Math.max(0, disc));
  return [(-qb - root) / (2 * qa), (-qb + root) / (2 * qa)].map((t) => ({ x: a.x + t * dx, y: a.y + t * dy }));
}

function circleCircleIntersections(first: GeoCircle, second: GeoCircle, points: GeoPoint[]) {
  const c1 = pointById(points, first.center), e1 = pointById(points, first.edge), c2 = pointById(points, second.center), e2 = pointById(points, second.edge);
  if (!c1 || !e1 || !c2 || !e2) return [];
  const r1 = distance(c1, e1), r2 = distance(c2, e2), d = distance(c1, c2);
  if (d > r1 + r2 || d < Math.abs(r1 - r2) || d < 0.001) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const x = c1.x + (a * (c2.x - c1.x)) / d;
  const y = c1.y + (a * (c2.y - c1.y)) / d;
  const rx = -(c2.y - c1.y) * (h / d);
  const ry = (c2.x - c1.x) * (h / d);
  return [{ x: x + rx, y: y + ry }, { x: x - rx, y: y - ry }];
}

function lineIntersection(first: GeoLine, second: GeoLine, points: GeoPoint[]) {
  const a = pointById(points, first.a), b = pointById(points, first.b), c = pointById(points, second.a), d = pointById(points, second.b);
  if (!a || !b || !c || !d) return null;
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 0.001) return null;
  const px = ((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / denominator;
  const py = ((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / denominator;
  return { x: px, y: py };
}

function projectRawPointToLine(point: PointLike, a: PointLike, b: PointLike) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length2 = dx * dx + dy * dy || 1;
  const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / length2;
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function centroid(points: GeoPoint[]) {
  const count = points.length || 1;
  return { x: points.reduce((sum, point) => sum + point.x, 0) / count, y: points.reduce((sum, point) => sum + point.y, 0) / count };
}

function uniqueBoardPoints(points: PointLike[]) {
  return points.filter((point, index) => points.findIndex((other) => distance(other, point) < 2) === index);
}

function unitVector(a: PointLike, b: PointLike, perpendicular = false) {
  const vector = normalize(b.x - a.x, b.y - a.y);
  return perpendicular ? { x: -vector.y, y: vector.x } : vector;
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function distance(a: PointLike, b: PointLike) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function typeLabel(type: "parallel" | "perpendicular") {
  return type === "parallel" ? "Parallel" : "Perpendicular";
}

function success(construction: Construction, message: string): GeometryAdvancedBuildResult {
  return { construction, selectedPointIds: [], status: { type: "success", message } };
}

function incomplete(construction: Construction, selectedPointIds: string[], label: string, remaining: number): GeometryAdvancedBuildResult {
  return {
    construction,
    selectedPointIds,
    status: { type: "info", message: `${label}: pick ${remaining} more point${remaining === 1 ? "" : "s"}.` },
  };
}

function warning(construction: Construction, selectedPointIds: string[], message: string): GeometryAdvancedBuildResult {
  return { construction, selectedPointIds, status: { type: "warning", message } };
}
