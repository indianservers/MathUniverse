import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  boardToScreen,
  boxesIntersect,
  calculateBounds,
  screenToBoard,
  strokeHitTest,
  unionBounds,
} from "./boardGeometry";
import type { BoardDocument, BoardElement, BoardPoint, BoardTool, BoundingBox, StrokeElement } from "./types";

type BoardCanvasProps = {
  document: BoardDocument;
  tool: BoardTool;
  color: string;
  width: number;
  selectedIds: string[];
  onAddStroke: (stroke: StrokeElement) => void;
  onDeleteElements: (elements: BoardElement[]) => void;
  onSelectionChange: (ids: string[]) => void;
  onMoveSelection: (ids: string[], dx: number, dy: number) => void;
  onViewportChange: (viewport: BoardDocument["viewport"]) => void;
  overlay?: ReactNode;
};

type Gesture =
  | { kind: "draw"; points: BoardPoint[]; pointerId: number }
  | { kind: "select"; start: BoardPoint; current: BoardPoint; points?: BoardPoint[]; pointerId: number }
  | { kind: "move"; start: BoardPoint; current: BoardPoint; ids: string[]; pointerId: number }
  | { kind: "pan"; start: { x: number; y: number }; viewport: BoardDocument["viewport"]; pointerId: number };

export default function BoardCanvas({
  document,
  tool,
  color,
  width,
  selectedIds,
  onAddStroke,
  onDeleteElements,
  onSelectionChange,
  onMoveSelection,
  onViewportChange,
  overlay,
}: BoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const animationRef = useRef<number | null>(null);
  const [size, setSize] = useState({ width: 900, height: 620 });

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.max(1, globalThis.devicePixelRatio || 1);
    const context = canvas.getContext("2d");
    if (!context) return;
    if (canvas.width !== Math.round(size.width * ratio) || canvas.height !== Math.round(size.height * ratio)) {
      canvas.width = Math.round(size.width * ratio);
      canvas.height = Math.round(size.height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size.width, size.height);
    drawBackground(context, size.width, size.height, document);
    for (const element of document.elements) drawElement(context, element, document.viewport, selectedIds.includes(element.id));

    const gesture = gestureRef.current;
    if (gesture?.kind === "draw") {
      drawStroke(context, {
        id: "active",
        type: "stroke",
        points: gesture.points,
        tool: tool === "highlighter" ? "highlighter" : "pen",
        width,
        opacity: tool === "highlighter" ? 0.32 : 1,
        color,
        bounds: calculateBounds(gesture.points),
        createdAt: "",
      }, document.viewport, false);
    }
    if (gesture?.kind === "select") {
      if (gesture.points?.length) drawLasso(context, gesture.points, document.viewport);
      else drawSelectionBox(context, boxFromPoints(gesture.start, gesture.current), document.viewport, false);
    }
    if (gesture?.kind === "move") {
      const dx = gesture.current.x - gesture.start.x;
      const dy = gesture.current.y - gesture.start.y;
      const bounds = unionBounds(document.elements.filter((item) => gesture.ids.includes(item.id)).map((item) => ({
        ...item.bounds,
        x: item.bounds.x + dx,
        y: item.bounds.y + dy,
      })));
      drawSelectionBox(context, bounds, document.viewport, false);
    }
  }, [color, document, selectedIds, size.height, size.width, tool, width]);

  const scheduleRedraw = useCallback(() => {
    if (animationRef.current !== null) return;
    animationRef.current = requestAnimationFrame(() => {
      animationRef.current = null;
      redraw();
    });
  }, [redraw]);

  useLayoutEffect(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    redraw();
  }, [redraw]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.max(280, Math.floor(entry.contentRect.width)),
        height: Math.max(420, Math.floor(entry.contentRect.height)),
      });
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
  }, []);

  const localPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const boardPoint = (event: React.PointerEvent<HTMLCanvasElement>): BoardPoint => {
    const point = screenToBoard(localPoint(event), document.viewport);
    return {
      ...point,
      pressure: event.pressure > 0 ? event.pressure : 0.5,
      time: event.timeStamp,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const screen = localPoint(event);
    const point = boardPoint(event);
    if (tool === "pen" || tool === "highlighter") {
      gestureRef.current = { kind: "draw", points: [point], pointerId: event.pointerId };
    } else if (tool === "eraser") {
      eraseAt(point);
    } else if (tool === "pan") {
      gestureRef.current = { kind: "pan", start: screen, viewport: document.viewport, pointerId: event.pointerId };
    } else {
      const hit = [...document.elements].reverse().find((element) => hitElement(element, point));
      if (hit && selectedIds.includes(hit.id)) {
        gestureRef.current = { kind: "move", start: point, current: point, ids: selectedIds, pointerId: event.pointerId };
      } else {
        gestureRef.current = {
          kind: "select",
          start: point,
          current: point,
          points: tool === "lasso" ? [point] : undefined,
          pointerId: event.pointerId,
        };
        if (!event.shiftKey) onSelectionChange([]);
      }
    }
    scheduleRedraw();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.kind === "draw") gesture.points.push(boardPoint(event));
    if (gesture.kind === "select" || gesture.kind === "move") {
      gesture.current = boardPoint(event);
      if (gesture.kind === "select" && gesture.points) gesture.points.push(gesture.current);
    }
    if (gesture.kind === "pan") {
      const current = localPoint(event);
      onViewportChange({
        ...gesture.viewport,
        x: gesture.viewport.x + current.x - gesture.start.x,
        y: gesture.viewport.y + current.y - gesture.start.y,
      });
    }
    if (tool === "eraser") eraseAt(boardPoint(event));
    scheduleRedraw();
  };

  const finishGesture = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.kind === "draw" && gesture.points.length) {
      const points = gesture.points;
      onAddStroke({
        id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "stroke",
        points,
        tool: tool === "highlighter" ? "highlighter" : "pen",
        width,
        opacity: tool === "highlighter" ? 0.32 : 1,
        color,
        bounds: calculateBounds(points),
        createdAt: new Date().toISOString(),
      });
    } else if (gesture.kind === "select") {
      const box = boxFromPoints(gesture.start, gesture.current);
      const ids = document.elements.filter((element) => {
        if (!gesture.points?.length) return boxesIntersect(element.bounds, box);
        const center = { x: element.bounds.x + element.bounds.width / 2, y: element.bounds.y + element.bounds.height / 2 };
        return pointInPolygon(center, gesture.points);
      }).map((element) => element.id);
      onSelectionChange(ids);
    } else if (gesture.kind === "move") {
      const dx = gesture.current.x - gesture.start.x;
      const dy = gesture.current.y - gesture.start.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) onMoveSelection(gesture.ids, dx, dy);
    }
    gestureRef.current = null;
    scheduleRedraw();
  };

  const eraseAt = (point: BoardPoint) => {
    const hit = document.elements.filter((element) => hitElement(element, point, 12 / document.viewport.zoom));
    if (hit.length) onDeleteElements(hit);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const screen = localPoint(event as unknown as React.PointerEvent<HTMLCanvasElement>);
    const before = screenToBoard(screen, document.viewport);
    const zoom = Math.max(0.25, Math.min(4, document.viewport.zoom * (event.deltaY < 0 ? 1.12 : 0.89)));
    onViewportChange({
      zoom,
      x: screen.x - before.x * zoom,
      y: screen.y - before.y * zoom,
    });
  };

  return (
    <div ref={hostRef} className="relative h-[62vh] min-h-[420px] w-full overflow-hidden rounded-xl bg-white shadow-inner dark:bg-slate-950">
      <canvas
        ref={canvasRef}
        className={`block h-full w-full touch-none ${tool === "pan" ? "cursor-grab active:cursor-grabbing" : tool === "eraser" ? "cursor-cell" : "cursor-crosshair"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
        onWheel={handleWheel}
        aria-label={`Intelligent Board canvas. Active tool: ${tool}. ${document.elements.length} elements.`}
        role="img"
        data-testid="board-canvas"
        data-active-tool={tool}
        data-ink-color={color}
        data-element-count={document.elements.length}
        data-stroke-count={document.elements.filter((element) => element.type === "stroke").length}
      />
      <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-slate-950/75 px-2 py-1 text-xs text-white">
        {Math.round(document.viewport.zoom * 100)}% · {selectedIds.length} selected
      </span>
      {overlay}
    </div>
  );
}

function hitElement(element: BoardElement, point: Pick<BoardPoint, "x" | "y">, radius = 8) {
  return element.type === "stroke" ? strokeHitTest(element, point, radius) : (
    point.x >= element.bounds.x - radius
    && point.x <= element.bounds.x + element.bounds.width + radius
    && point.y >= element.bounds.y - radius
    && point.y <= element.bounds.y + element.bounds.height + radius
  );
}

function boxFromPoints(start: Pick<BoardPoint, "x" | "y">, end: Pick<BoardPoint, "x" | "y">): BoundingBox {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

function drawBackground(context: CanvasRenderingContext2D, width: number, height: number, document: BoardDocument) {
  const dark = globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches;
  context.fillStyle = dark ? "#07111f" : "#ffffff";
  context.fillRect(0, 0, width, height);
  if (document.background === "plain") return;
  const spacing = 24 * document.viewport.zoom;
  const offsetX = ((document.viewport.x % spacing) + spacing) % spacing;
  const offsetY = ((document.viewport.y % spacing) + spacing) % spacing;
  context.strokeStyle = dark ? "rgba(148,163,184,.15)" : "rgba(100,116,139,.16)";
  context.fillStyle = dark ? "rgba(148,163,184,.28)" : "rgba(71,85,105,.3)";
  context.lineWidth = 1;
  if (document.background === "dots") {
    for (let x = offsetX; x < width; x += spacing) for (let y = offsetY; y < height; y += spacing) {
      context.beginPath();
      context.arc(x, y, 1.2, 0, Math.PI * 2);
      context.fill();
    }
    return;
  }
  context.beginPath();
  for (let y = offsetY; y < height; y += spacing) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  if (document.background === "grid") for (let x = offsetX; x < width; x += spacing) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  context.stroke();
}

function drawElement(context: CanvasRenderingContext2D, element: BoardElement, viewport: BoardDocument["viewport"], selected: boolean) {
  if (element.type === "stroke") {
    drawStroke(context, element, viewport, selected);
    return;
  }
  const start = boardToScreen({ x: element.bounds.x, y: element.bounds.y }, viewport);
  const width = element.bounds.width * viewport.zoom;
  const height = element.bounds.height * viewport.zoom;
  context.save();
  context.fillStyle = "rgba(8,145,178,.12)";
  context.strokeStyle = selected ? "#06b6d4" : "rgba(8,145,178,.5)";
  context.lineWidth = selected ? 2 : 1;
  context.fillRect(start.x, start.y, width, height);
  context.strokeRect(start.x, start.y, width, height);
  context.fillStyle = globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "#e2e8f0" : "#0f172a";
  context.font = `${Math.max(14, 20 * viewport.zoom)}px ui-monospace, monospace`;
  const label = element.type === "math-expression"
    ? element.latex
    : element.type === "text"
      ? element.text
      : element.type === "shape"
        ? element.shape
        : element.type === "solution-step"
          ? element.latex
          : element.type === "image"
            ? `Imported image · ${element.recognitionRegions.length} regions`
            : element.type === "explanation"
              ? `${element.title}: ${element.text}`
        : element.status === "loading"
          ? `${element.title}…`
          : element.exactOutputLatex ?? element.plainTextOutput ?? element.title;
  context.fillText(label, start.x + 10, start.y + height / 2 + 6);
  context.restore();
}

function drawStroke(context: CanvasRenderingContext2D, stroke: StrokeElement, viewport: BoardDocument["viewport"], selected: boolean) {
  if (!stroke.points.length) return;
  context.save();
  context.globalAlpha = stroke.opacity;
  context.strokeStyle = stroke.color;
  context.lineCap = "round";
  context.lineJoin = "round";
  if (stroke.points.length === 1) {
    const point = boardToScreen(stroke.points[0], viewport);
    context.fillStyle = stroke.color;
    context.beginPath();
    context.arc(point.x, point.y, stroke.width * viewport.zoom / 2, 0, Math.PI * 2);
    context.fill();
  }
  stroke.points.slice(1).forEach((point, index) => {
    const previous = boardToScreen(stroke.points[index], viewport);
    const screen = boardToScreen(point, viewport);
    context.lineWidth = stroke.width * viewport.zoom * (0.55 + point.pressure * 0.9);
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(screen.x, screen.y);
    context.stroke();
  });
  context.restore();
  if (selected) drawSelectionBox(context, stroke.bounds, viewport, false);
}

function drawSelectionBox(context: CanvasRenderingContext2D, bounds: BoundingBox, viewport: BoardDocument["viewport"], lasso: boolean) {
  const start = boardToScreen({ x: bounds.x, y: bounds.y }, viewport);
  context.save();
  context.strokeStyle = "#06b6d4";
  context.fillStyle = "rgba(6,182,212,.08)";
  context.lineWidth = 1.5;
  context.setLineDash(lasso ? [3, 4] : [7, 5]);
  context.fillRect(start.x, start.y, bounds.width * viewport.zoom, bounds.height * viewport.zoom);
  context.strokeRect(start.x, start.y, bounds.width * viewport.zoom, bounds.height * viewport.zoom);
  context.restore();
}

function drawLasso(context: CanvasRenderingContext2D, points: BoardPoint[], viewport: BoardDocument["viewport"]) {
  if (!points.length) return;
  context.save();
  context.strokeStyle = "#06b6d4";
  context.fillStyle = "rgba(6,182,212,.08)";
  context.lineWidth = 1.5;
  context.setLineDash([3, 4]);
  const first = boardToScreen(points[0], viewport);
  context.beginPath();
  context.moveTo(first.x, first.y);
  points.slice(1).forEach((point) => {
    const screen = boardToScreen(point, viewport);
    context.lineTo(screen.x, screen.y);
  });
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}

function pointInPolygon(point: Pick<BoardPoint, "x" | "y">, polygon: BoardPoint[]) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previous];
    const crosses = (currentPoint.y > point.y) !== (previousPoint.y > point.y)
      && point.x < ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) / (previousPoint.y - currentPoint.y || Number.EPSILON) + currentPoint.x;
    if (crosses) inside = !inside;
  }
  return inside;
}
