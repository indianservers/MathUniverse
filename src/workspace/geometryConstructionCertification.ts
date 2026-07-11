import { pointById, type Construction, type GeoCircle, type GeoPoint } from "./geometryCommandController";

export type GeometryCertificationSeverity = "pass" | "warn" | "fail";

export type GeometryCertificationCheck = {
  id: string;
  label: string;
  kind:
    | "reference"
    | "midpoint"
    | "parallel"
    | "perpendicular"
    | "fixed-length"
    | "on-circle"
    | "intersection"
    | "regular-polygon"
    | "visual-qa-contract";
  severity: GeometryCertificationSeverity;
  residual: number;
  tolerance: number;
  detail: string;
};

export type GeometryCertificationReport = {
  passed: boolean;
  score: number;
  maxResidual: number;
  checks: GeometryCertificationCheck[];
  summary: string;
};

export type GeometryCertificationOptions = {
  distanceTolerance?: number;
  angularTolerance?: number;
  regularPolygonIds?: string[];
};

export type GeometryVisualQaContract = {
  route: "/workspace/geometry";
  selectors: string[];
  pixelChecks: string[];
  interactions: string[];
  accuracyChecks: string[];
};

const DEFAULT_DISTANCE_TOLERANCE = 1e-6;
const DEFAULT_ANGULAR_TOLERANCE = 1e-8;

export function certifyGeometryConstruction(
  construction: Construction,
  options: GeometryCertificationOptions = {},
): GeometryCertificationReport {
  const distanceTolerance = options.distanceTolerance ?? DEFAULT_DISTANCE_TOLERANCE;
  const angularTolerance = options.angularTolerance ?? DEFAULT_ANGULAR_TOLERANCE;
  const checks: GeometryCertificationCheck[] = [];

  for (const constraint of construction.constraints) {
    if (constraint.type === "midpoint") {
      const a = getPoint(construction, constraint.a);
      const b = getPoint(construction, constraint.b);
      const mid = getPoint(construction, constraint.point);
      if (!a || !b || !mid) {
        checks.push(missingReference(`midpoint:${constraint.id}`, "midpoint", "Midpoint references must resolve."));
        continue;
      }
      const expected = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      checks.push(checkDistance(`midpoint:${constraint.id}`, "midpoint", `Midpoint ${mid.label} stays halfway between ${a.label} and ${b.label}.`, distance(mid, expected), distanceTolerance));
    }

    if (constraint.type === "parallel" || constraint.type === "perpendicular") {
      const source = getLinePoints(construction, constraint.sourceLine);
      const created = getLinePoints(construction, constraint.line);
      const through = getPoint(construction, constraint.throughPoint);
      if (!source || !created || !through) {
        checks.push(missingReference(`${constraint.type}:${constraint.id}`, constraint.type, `${constraint.type} line references must resolve.`));
        continue;
      }
      const sourceVector = vector(source.a, source.b);
      const createdVector = vector(created.a, created.b);
      const relationResidual = constraint.type === "parallel"
        ? Math.abs(cross(normalize(sourceVector), normalize(createdVector)))
        : Math.abs(dot(normalize(sourceVector), normalize(createdVector)));
      const incidenceResidual = distancePointToLine(through, created.a, created.b);
      checks.push(checkAngular(`${constraint.type}:${constraint.id}`, constraint.type, `${capitalize(constraint.type)} line keeps the requested angle relation.`, relationResidual, angularTolerance));
      checks.push(checkDistance(`${constraint.type}:through:${constraint.id}`, "reference", "Constructed line still passes through its selected point.", incidenceResidual, distanceTolerance));
    }

    if (constraint.type === "fixed-length") {
      const anchor = getPoint(construction, constraint.anchor);
      const point = getPoint(construction, constraint.point);
      if (!anchor || !point) {
        checks.push(missingReference(`fixed-length:${constraint.id}`, "fixed-length", "Fixed-length references must resolve."));
        continue;
      }
      checks.push(checkDistance(`fixed-length:${constraint.id}`, "fixed-length", `Distance ${anchor.label}${point.label} stays fixed.`, Math.abs(distance(anchor, point) - constraint.length), distanceTolerance));
    }

    if (constraint.type === "on-circle") {
      const point = getPoint(construction, constraint.point);
      const circle = getCircleGeometry(construction, constraint.circle);
      if (!point || !circle) {
        checks.push(missingReference(`on-circle:${constraint.id}`, "on-circle", "Point-on-circle references must resolve."));
        continue;
      }
      checks.push(checkDistance(`on-circle:${constraint.id}`, "on-circle", `${point.label} remains on the circle.`, Math.abs(distance(point, circle.center) - circle.radius), distanceTolerance));
    }

    if (constraint.type === "intersection") {
      const point = getPoint(construction, constraint.point);
      const firstResidual = objectResidual(construction, constraint.first, constraint.firstType, point);
      const secondResidual = objectResidual(construction, constraint.second, constraint.secondType, point);
      if (!point || firstResidual == null || secondResidual == null) {
        checks.push(missingReference(`intersection:${constraint.id}`, "intersection", "Intersection references must resolve."));
        continue;
      }
      checks.push(checkDistance(`intersection:first:${constraint.id}`, "intersection", `${point.label} lies on the first selected object.`, firstResidual, distanceTolerance));
      checks.push(checkDistance(`intersection:second:${constraint.id}`, "intersection", `${point.label} lies on the second selected object.`, secondResidual, distanceTolerance));
    }
  }

  for (const polygonId of options.regularPolygonIds ?? []) {
    checks.push(...certifyRegularPolygon(construction, polygonId, distanceTolerance, angularTolerance));
  }

  if (!checks.length) {
    checks.push({
      id: "construction-certification-empty",
      label: "Ready for accurate construction",
      kind: "reference",
      severity: "pass",
      residual: 0,
      tolerance: 0,
      detail: "No measured constraints are present yet. Create midpoint, parallel, perpendicular, compass, intersection, or regular-polygon objects to certify live residuals.",
    });
  }

  return summarizeChecks(checks);
}

export function buildGeometryVisualQaContract(): GeometryVisualQaContract {
  return {
    route: "/workspace/geometry",
    selectors: [
      "workspace-geometry-board",
      "workspace-geometry-measurements",
      "workspace-geometry-tool-point",
      "workspace-geometry-tool-line",
      "workspace-geometry-tool-circle",
    ],
    pixelChecks: [
      "Board SVG is nonblank after first paint.",
      "Created point adds at least one visible mark.",
      "Constructed line/circle changes non-background pixels.",
      "Drag interaction changes geometry pixels without console errors.",
    ],
    interactions: [
      "Point creation",
      "Point drag",
      "Midpoint",
      "Parallel line",
      "Perpendicular line",
      "Regular polygon",
      "Compass copy",
      "Intersection creation",
    ],
    accuracyChecks: [
      "Run certifyGeometryConstruction after scripted construction.",
      "Fail visual QA if any construction certification check fails.",
      "Record max residual with screenshot metadata.",
    ],
  };
}

function certifyRegularPolygon(construction: Construction, polygonId: string, distanceTolerance: number, angularTolerance: number): GeometryCertificationCheck[] {
  const polygon = construction.polygons.find((item) => item.id === polygonId);
  if (!polygon) return [missingReference(`regular-polygon:${polygonId}`, "regular-polygon", "Regular polygon must exist.")];
  const points = polygon.points.map((id) => getPoint(construction, id));
  if (points.some((point) => !point)) return [missingReference(`regular-polygon:${polygonId}`, "regular-polygon", "Regular polygon vertices must resolve.")];
  const vertices = points as GeoPoint[];
  if (vertices.length < 3) return [checkDistance(`regular-polygon:${polygonId}:count`, "regular-polygon", "Regular polygon needs at least three vertices.", 1, 0)];
  const sideLengths = vertices.map((point, index) => distance(point, vertices[(index + 1) % vertices.length]));
  const meanSide = average(sideLengths);
  const sideResidual = Math.max(...sideLengths.map((side) => Math.abs(side - meanSide)));
  const angleResidual = regularPolygonAngleResidual(vertices);
  return [
    checkDistance(`regular-polygon:${polygonId}:sides`, "regular-polygon", "Regular polygon side lengths are equal.", sideResidual, distanceTolerance),
    checkAngular(`regular-polygon:${polygonId}:angles`, "regular-polygon", "Regular polygon turn angles are equal.", angleResidual, angularTolerance),
  ];
}

function objectResidual(construction: Construction, objectId: string, type: "line" | "circle" | undefined, point: GeoPoint | undefined) {
  if (!point || !type) return null;
  if (type === "line") {
    const line = getLinePoints(construction, objectId);
    return line ? distancePointToLine(point, line.a, line.b) : null;
  }
  const circle = getCircleGeometry(construction, objectId);
  return circle ? Math.abs(distance(point, circle.center) - circle.radius) : null;
}

function getPoint(construction: Construction, id: string) {
  return pointById(construction.points, id);
}

function getLinePoints(construction: Construction, id: string) {
  const line = construction.lines.find((item) => item.id === id);
  if (!line) return null;
  const a = getPoint(construction, line.a);
  const b = getPoint(construction, line.b);
  return a && b ? { line, a, b } : null;
}

function getCircleGeometry(construction: Construction, id: string) {
  const circle = construction.circles.find((item) => item.id === id);
  return circle ? circleGeometry(construction, circle) : null;
}

function circleGeometry(construction: Construction, circle: GeoCircle) {
  const center = getPoint(construction, circle.center);
  const edge = getPoint(construction, circle.edge);
  return center && edge ? { circle, center, radius: distance(center, edge) } : null;
}

function summarizeChecks(checks: GeometryCertificationCheck[]): GeometryCertificationReport {
  const failed = checks.filter((check) => check.severity === "fail").length;
  const warned = checks.filter((check) => check.severity === "warn").length;
  const maxResidual = Math.max(...checks.map((check) => check.residual), 0);
  const score = Math.max(0, Math.round(((checks.length - failed - warned * 0.35) / checks.length) * 100));
  return {
    passed: failed === 0,
    score,
    maxResidual,
    checks,
    summary: failed
      ? `${failed} geometry accuracy check${failed === 1 ? "" : "s"} failed.`
      : warned
        ? `Geometry accuracy passed with ${warned} warning${warned === 1 ? "" : "s"}.`
        : "Geometry accuracy certified.",
  };
}

function checkDistance(id: string, kind: GeometryCertificationCheck["kind"], label: string, residual: number, tolerance: number): GeometryCertificationCheck {
  return makeCheck(id, kind, label, residual, tolerance);
}

function checkAngular(id: string, kind: GeometryCertificationCheck["kind"], label: string, residual: number, tolerance: number): GeometryCertificationCheck {
  return makeCheck(id, kind, label, residual, tolerance);
}

function makeCheck(id: string, kind: GeometryCertificationCheck["kind"], label: string, residual: number, tolerance: number): GeometryCertificationCheck {
  const severity: GeometryCertificationSeverity = residual <= tolerance ? "pass" : residual <= tolerance * 100 ? "warn" : "fail";
  return {
    id,
    kind,
    label,
    severity,
    residual,
    tolerance,
    detail: `${label} Residual ${format(residual)}; tolerance ${format(tolerance)}.`,
  };
}

function missingReference(id: string, kind: GeometryCertificationCheck["kind"], detail: string): GeometryCertificationCheck {
  return { id, kind, label: detail, severity: "fail", residual: Number.POSITIVE_INFINITY, tolerance: 0, detail };
}

function vector(a: GeoPoint, b: GeoPoint) {
  return { x: b.x - a.x, y: b.y - a.y };
}

function normalize(value: { x: number; y: number }) {
  const length = Math.hypot(value.x, value.y);
  return length <= 0 ? { x: 0, y: 0 } : { x: value.x / length, y: value.y / length };
}

function dot(a: { x: number; y: number }, b: { x: number; y: number }) {
  return a.x * b.x + a.y * b.y;
}

function cross(a: { x: number; y: number }, b: { x: number; y: number }) {
  return a.x * b.y - a.y * b.x;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distancePointToLine(point: GeoPoint, a: GeoPoint, b: GeoPoint) {
  const base = distance(a, b);
  if (base <= 0) return Number.POSITIVE_INFINITY;
  return Math.abs(cross(vector(a, b), vector(a, point))) / base;
}

function regularPolygonAngleResidual(points: GeoPoint[]) {
  const turns = points.map((point, index) => {
    const prev = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const first = normalize(vector(point, prev));
    const second = normalize(vector(point, next));
    return Math.acos(Math.max(-1, Math.min(1, dot(first, second))));
  });
  const mean = average(turns);
  return Math.max(...turns.map((turn) => Math.abs(turn - mean)));
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function format(value: number) {
  if (!Number.isFinite(value)) return "unbounded";
  if (value === 0) return "0";
  if (Math.abs(value) < 0.000001) return value.toExponential(2);
  return String(Math.round(value * 1_000_000) / 1_000_000);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
