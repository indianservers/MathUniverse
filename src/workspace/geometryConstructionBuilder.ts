import { pointById, type Construction, type GeoArc, type GeoCircle, type GeoLine, type GeoPoint, type GeoPolygon, type GeoStyle } from "./geometryCommandController";

export type GeometryConstructionStatus = {
  type: "success" | "info" | "warning" | "unsupported" | "error";
  message: string;
};

export type GeometryConstructionBuildResult = {
  construction: Construction;
  createdPointId?: string;
  selectedPointIds?: string[];
  polygonDraft?: string[];
  status?: GeometryConstructionStatus;
};

export type GeometryLineTool = "line" | "segment" | "ray" | "vector";
export type GeometryCircleTool = "circle" | "circle-radius";
export type GeometryMeasurementType = "angle" | "distance" | "area" | "perimeter";

export type GeometryIdFactory = () => string;

const defaultIdFactory: GeometryIdFactory = () => crypto.randomUUID();

export function nextGeometryPointLabel(points: GeoPoint[], offset = 0) {
  return String.fromCharCode(65 + points.length + offset);
}

export function buildPointCreation(
  construction: Construction,
  boardPoint: { x: number; y: number },
  options: { idFactory?: GeometryIdFactory; label?: string; style?: GeoStyle; round?: (value: number) => number } = {},
): GeometryConstructionBuildResult {
  const idFactory = options.idFactory ?? defaultIdFactory;
  const round = options.round ?? ((value) => value);
  const point: GeoPoint = {
    id: idFactory(),
    x: round(boardPoint.x),
    y: round(boardPoint.y),
    label: options.label ?? nextGeometryPointLabel(construction.points),
    style: options.style,
  };
  return {
    construction: { ...construction, points: [...construction.points, point] },
    createdPointId: point.id,
    selectedPointIds: [],
    status: { type: "success", message: `${point.label} created.` },
  };
}

export function buildLineFromPoints(
  construction: Construction,
  pointIds: string[],
  options: { tool?: GeometryLineTool; idFactory?: GeometryIdFactory } = {},
): GeometryConstructionBuildResult {
  const tool = options.tool ?? "line";
  const selectedPointIds = pointIds.slice(-2);
  if (selectedPointIds.length < 2) {
    return {
      construction,
      selectedPointIds,
      status: { type: "info", message: `${lineToolLabel(tool)}: pick one more point.` },
    };
  }
  if (selectedPointIds[0] === selectedPointIds[1]) {
    return {
      construction,
      selectedPointIds,
      status: { type: "warning", message: `${lineToolLabel(tool)} needs two different points.` },
    };
  }
  const style = lineToolStyle(tool);
  const line: GeoLine = { id: (options.idFactory ?? defaultIdFactory)(), a: selectedPointIds[0], b: selectedPointIds[1], style };
  return {
    construction: { ...construction, lines: [...construction.lines, line] },
    selectedPointIds: [],
    status: { type: "success", message: `${lineToolLabel(tool)} created.` },
  };
}

export function buildSegmentFromPoints(construction: Construction, pointIds: string[], options: { idFactory?: GeometryIdFactory } = {}) {
  return buildLineFromPoints(construction, pointIds, { ...options, tool: "segment" });
}

export function buildRayFromPoints(construction: Construction, pointIds: string[], options: { idFactory?: GeometryIdFactory } = {}) {
  return buildLineFromPoints(construction, pointIds, { ...options, tool: "ray" });
}

export function buildCircleFromPoints(
  construction: Construction,
  pointIds: string[],
  options: { tool?: GeometryCircleTool; idFactory?: GeometryIdFactory } = {},
): GeometryConstructionBuildResult {
  const selectedPointIds = pointIds.slice(-2);
  if (selectedPointIds.length < 2) {
    return {
      construction,
      selectedPointIds,
      status: { type: "info", message: `${options.tool === "circle-radius" ? "Circle by radius" : "Circle"}: pick one more point.` },
    };
  }
  if (selectedPointIds[0] === selectedPointIds[1]) {
    return {
      construction,
      selectedPointIds,
      status: { type: "warning", message: "Circle needs two different points." },
    };
  }
  const circle: GeoCircle = { id: (options.idFactory ?? defaultIdFactory)(), center: selectedPointIds[0], edge: selectedPointIds[1] };
  return {
    construction: { ...construction, circles: [...construction.circles, circle] },
    selectedPointIds: [],
    status: { type: "success", message: "Circle created." },
  };
}

export function buildPolygonDraftUpdate(construction: Construction, currentDraft: string[], selectedPointId: string): GeometryConstructionBuildResult {
  if (currentDraft.includes(selectedPointId)) {
    return {
      construction,
      polygonDraft: currentDraft,
      status: { type: "info", message: "Point already exists in this polygon draft." },
    };
  }
  const polygonDraft = [...currentDraft, selectedPointId];
  return {
    construction,
    polygonDraft,
    status: { type: "info", message: polygonDraft.length < 3 ? `Polygon: pick ${3 - polygonDraft.length} more point${3 - polygonDraft.length === 1 ? "" : "s"}.` : "Pick the first point again to close the polygon." },
  };
}

export function buildPolygonCompletion(
  construction: Construction,
  draftPointIds: string[],
  options: { idFactory?: GeometryIdFactory; style?: GeoStyle } = {},
): GeometryConstructionBuildResult {
  const uniqueIds = Array.from(new Set(draftPointIds));
  if (uniqueIds.length < 3) {
    return {
      construction,
      polygonDraft: draftPointIds,
      status: { type: "info", message: "Polygon needs at least three different points." },
    };
  }
  const polygon: GeoPolygon = { id: (options.idFactory ?? defaultIdFactory)(), points: uniqueIds, style: options.style };
  return {
    construction: { ...construction, polygons: [...construction.polygons, polygon] },
    polygonDraft: [],
    selectedPointIds: [],
    status: { type: "success", message: `${uniqueIds.length}-vertex polygon created.` },
  };
}

export function buildTriangleCompletion(
  construction: Construction,
  pointIds: string[],
  options: { idFactory?: GeometryIdFactory; style?: GeoStyle } = {},
): GeometryConstructionBuildResult {
  return buildPolygonCompletion(construction, pointIds.slice(0, 3), options);
}

export function buildAngleFromPoints(
  construction: Construction,
  pointIds: string[],
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryConstructionBuildResult {
  const selectedPointIds = pointIds.slice(-3);
  if (selectedPointIds.length < 3) {
    return {
      construction,
      selectedPointIds,
      status: { type: "info", message: `Angle: pick ${3 - selectedPointIds.length} more point${3 - selectedPointIds.length === 1 ? "" : "s"}.` },
    };
  }
  if (new Set(selectedPointIds).size !== 3) {
    return {
      construction,
      selectedPointIds,
      status: { type: "warning", message: "Angle needs three different points." },
    };
  }
  const [start, center, end] = selectedPointIds;
  const arc: GeoArc = {
    id: (options.idFactory ?? defaultIdFactory)(),
    center,
    start,
    end,
    sector: false,
    kind: "angle",
    style: { color: "#14b8a6", strokeWidth: 6, fill: "none", labelMode: "both" },
  };
  return {
    construction: { ...construction, arcs: [...construction.arcs, arc] },
    selectedPointIds: [],
    status: { type: "success", message: "Angle measured." },
  };
}

export function buildMeasurementFromSelection(
  construction: Construction,
  pointIds: string[],
  measurementType: GeometryMeasurementType,
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryConstructionBuildResult {
  if (measurementType === "angle") return buildAngleFromPoints(construction, pointIds, options);
  return {
    construction,
    selectedPointIds: pointIds,
    status: {
      type: "unsupported",
      message: `${measurementType} measurement is not a manual construction command in this workspace yet.`,
    },
  };
}

export function buildCircleThroughThreePoints(
  construction: Construction,
  pointIds: string[],
  options: { idFactory?: GeometryIdFactory } = {},
): GeometryConstructionBuildResult {
  const selectedPointIds = pointIds.slice(-3);
  if (selectedPointIds.length < 3) {
    return {
      construction,
      selectedPointIds,
      status: { type: "info", message: `Circle through 3 points: pick ${3 - selectedPointIds.length} more point${3 - selectedPointIds.length === 1 ? "" : "s"}.` },
    };
  }
  const [aId, bId, cId] = selectedPointIds;
  const a = pointById(construction.points, aId), b = pointById(construction.points, bId), c = pointById(construction.points, cId);
  if (!a || !b || !c || new Set(selectedPointIds).size !== 3) {
    return {
      construction,
      selectedPointIds,
      status: { type: "warning", message: "Circle through 3 points needs three existing, different points." },
    };
  }
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 0.001) {
    return {
      construction,
      selectedPointIds,
      status: { type: "warning", message: "The three points are nearly collinear, so no circle was created." },
    };
  }
  const idFactory = options.idFactory ?? defaultIdFactory;
  const ux = ((a.x ** 2 + a.y ** 2) * (b.y - c.y) + (b.x ** 2 + b.y ** 2) * (c.y - a.y) + (c.x ** 2 + c.y ** 2) * (a.y - b.y)) / d;
  const uy = ((a.x ** 2 + a.y ** 2) * (c.x - b.x) + (b.x ** 2 + b.y ** 2) * (a.x - c.x) + (c.x ** 2 + c.y ** 2) * (b.x - a.x)) / d;
  const center: GeoPoint = { id: idFactory(), x: ux, y: uy, label: nextGeometryPointLabel(construction.points), style: { color: "#f97316" } };
  return {
    construction: {
      ...construction,
      points: [...construction.points, center],
      circles: [...construction.circles, { id: idFactory(), center: center.id, edge: aId, style: { color: "#f97316" } }],
    },
    selectedPointIds: [],
    status: { type: "success", message: "Circle through 3 points created." },
  };
}

function lineToolStyle(tool: GeometryLineTool): GeoStyle {
  if (tool === "segment") return { label: "segment", color: "#22d3ee" };
  if (tool === "ray") return { label: "ray", color: "#a78bfa" };
  if (tool === "vector") return { label: "vector", color: "#10b981", strokeWidth: 5 };
  return { label: "line", color: "#8b5cf6" };
}

function lineToolLabel(tool: GeometryLineTool) {
  if (tool === "segment") return "Segment";
  if (tool === "ray") return "Ray";
  if (tool === "vector") return "Vector";
  return "Line";
}
