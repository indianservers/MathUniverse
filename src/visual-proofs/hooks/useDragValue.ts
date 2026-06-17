import { KeyboardEvent, PointerEvent, useCallback, useState } from "react";

export type DragPoint = { x: number; y: number };
export type DragAxis = "x" | "y" | "xy";

type UseDragValueOptions = {
  position: DragPoint;
  axis?: DragAxis;
  bounds?: { x?: [number, number]; y?: [number, number] };
  step?: number;
  keyboardStep?: number;
  snapToGrid?: number;
  disabled?: boolean;
  onChange: (position: DragPoint) => void;
};

const clamp = (value: number, range?: [number, number]) => {
  if (!range) return value;
  return Math.max(range[0], Math.min(range[1], value));
};

const snap = (value: number, grid?: number) => {
  if (!grid || grid <= 0) return value;
  return Math.round(value / grid) * grid;
};

export function useDragValue({
  position,
  axis = "xy",
  bounds,
  step = 1,
  keyboardStep,
  snapToGrid,
  disabled = false,
  onChange,
}: UseDragValueOptions) {
  const [dragging, setDragging] = useState(false);
  const commit = useCallback((next: DragPoint) => {
    if (disabled) return;
    const safe = {
      x: axis === "y" ? position.x : clamp(snap(next.x, snapToGrid), bounds?.x),
      y: axis === "x" ? position.y : clamp(snap(next.y, snapToGrid), bounds?.y),
    };
    onChange(safe);
  }, [axis, bounds?.x, bounds?.y, disabled, onChange, position.x, position.y, snapToGrid]);

  const pointFromEvent = (event: PointerEvent<SVGElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const transformed = point.matrixTransform(matrix.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const onPointerDown = useCallback((event: PointerEvent<SVGElement>) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    const point = pointFromEvent(event);
    if (point) commit(point);
  }, [commit, disabled]);

  const onPointerMove = useCallback((event: PointerEvent<SVGElement>) => {
    if (!dragging || disabled) return;
    const point = pointFromEvent(event);
    if (point) commit(point);
  }, [commit, disabled, dragging]);

  const onPointerUp = useCallback((event: PointerEvent<SVGElement>) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(false);
  }, []);

  const onKeyDown = useCallback((event: KeyboardEvent<SVGElement>) => {
    if (disabled) return;
    const delta = keyboardStep ?? step;
    const next = { ...position };
    if ((axis === "x" || axis === "xy") && event.key === "ArrowLeft") next.x -= delta;
    else if ((axis === "x" || axis === "xy") && event.key === "ArrowRight") next.x += delta;
    else if ((axis === "y" || axis === "xy") && event.key === "ArrowUp") next.y -= delta;
    else if ((axis === "y" || axis === "xy") && event.key === "ArrowDown") next.y += delta;
    else return;
    event.preventDefault();
    commit(next);
  }, [axis, commit, disabled, keyboardStep, position, step]);

  return {
    dragging,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onKeyDown,
    },
  };
}
