import type { BoardElement, BoardPoint, BoardViewport, BoundingBox, StrokeElement } from "./types";

export function screenToBoard(
  point: Pick<BoardPoint, "x" | "y">,
  viewport: BoardViewport,
): Pick<BoardPoint, "x" | "y"> {
  return {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };
}

export function boardToScreen(
  point: Pick<BoardPoint, "x" | "y">,
  viewport: BoardViewport,
): Pick<BoardPoint, "x" | "y"> {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

export function calculateBounds(points: Array<Pick<BoardPoint, "x" | "y">>): BoundingBox {
  if (!points.length) return { x: 0, y: 0, width: 0, height: 0 };
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

export function expandBounds(bounds: BoundingBox, padding: number): BoundingBox {
  return {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2,
  };
}

export function unionBounds(bounds: BoundingBox[]): BoundingBox {
  if (!bounds.length) return { x: 0, y: 0, width: 0, height: 0 };
  const x = Math.min(...bounds.map((item) => item.x));
  const y = Math.min(...bounds.map((item) => item.y));
  const right = Math.max(...bounds.map((item) => item.x + item.width));
  const bottom = Math.max(...bounds.map((item) => item.y + item.height));
  return { x, y, width: right - x, height: bottom - y };
}

export function boxesIntersect(left: BoundingBox, right: BoundingBox) {
  return left.x <= right.x + right.width
    && left.x + left.width >= right.x
    && left.y <= right.y + right.height
    && left.y + left.height >= right.y;
}

export function pointInBounds(point: Pick<BoardPoint, "x" | "y">, bounds: BoundingBox, padding = 0) {
  return point.x >= bounds.x - padding
    && point.x <= bounds.x + bounds.width + padding
    && point.y >= bounds.y - padding
    && point.y <= bounds.y + bounds.height + padding;
}

export function distanceToSegment(
  point: Pick<BoardPoint, "x" | "y">,
  start: Pick<BoardPoint, "x" | "y">,
  end: Pick<BoardPoint, "x" | "y">,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
}

export function strokeHitTest(stroke: StrokeElement, point: Pick<BoardPoint, "x" | "y">, radius = 10) {
  if (!pointInBounds(point, stroke.bounds, radius)) return false;
  if (stroke.points.length === 1) return distanceToSegment(point, stroke.points[0], stroke.points[0]) <= radius;
  return stroke.points.some((current, index) => index > 0
    && distanceToSegment(point, stroke.points[index - 1], current) <= radius + stroke.width / 2);
}

export function simplifyPoints(points: BoardPoint[], tolerance = 0.8): BoardPoint[] {
  if (points.length < 3) return points;
  const simplified = [points[0]];
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = simplified[simplified.length - 1];
    if (Math.hypot(points[index].x - previous.x, points[index].y - previous.y) >= tolerance) {
      simplified.push(points[index]);
    }
  }
  simplified.push(points[points.length - 1]);
  return simplified;
}

export function smoothPoints(points: BoardPoint[]): BoardPoint[] {
  if (points.length < 3) return points;
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return point;
    const previous = points[index - 1];
    const next = points[index + 1];
    return {
      x: (previous.x + point.x * 2 + next.x) / 4,
      y: (previous.y + point.y * 2 + next.y) / 4,
      pressure: (previous.pressure + point.pressure * 2 + next.pressure) / 4,
      time: point.time,
    };
  });
}

export function moveElement(element: BoardElement, dx: number, dy: number): BoardElement {
  const bounds = { ...element.bounds, x: element.bounds.x + dx, y: element.bounds.y + dy };
  if (element.type !== "stroke") return { ...element, bounds };
  return {
    ...element,
    bounds,
    points: element.points.map((point) => ({ ...point, x: point.x + dx, y: point.y + dy })),
  };
}

export function snapValue(value: number, size = 20) {
  return Math.round(value / size) * size;
}

