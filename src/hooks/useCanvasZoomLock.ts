import { useEffect, type RefObject } from "react";

export function lockCanvasWheel(event: WheelEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function useCanvasZoomLock(
  ref: RefObject<HTMLElement | SVGElement | null>,
  onWheel?: (event: WheelEvent) => void,
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      lockCanvasWheel(event);
      onWheel?.(event);
    };
    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    node.addEventListener("gesturestart", preventGesture, { passive: false });
    node.addEventListener("gesturechange", preventGesture, { passive: false });
    return () => {
      node.removeEventListener("wheel", handleWheel);
      node.removeEventListener("gesturestart", preventGesture);
      node.removeEventListener("gesturechange", preventGesture);
    };
  }, [onWheel, ref]);
}
