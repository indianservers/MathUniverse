import { useEffect, type RefObject } from "react";

const CLOSE_DISTANCE = 72;
const CLOSE_VELOCITY = 0.55;

export function useMobileWorkspaceGestures(
  ref: RefObject<HTMLElement | null>,
  options: {
    enabled: boolean;
    edge: "left" | "right" | "bottom";
    onClose: () => void;
  },
) {
  const { enabled, edge, onClose } = options;

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;

    const resolvedEdge = (): "left" | "right" | "bottom" => {
      if (edge === "bottom") return "bottom";
      const landscape = window.matchMedia(
        "(orientation: landscape) and (max-height: 700px)",
      ).matches;
      return landscape ? edge : "bottom";
    };

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let dragging = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const resetTransform = () => {
      node.style.transition = reduced
        ? "none"
        : "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      node.style.transform = "";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      const handle = (event.target as HTMLElement | null)?.closest(
        "[data-mws-handle], .geometry-drawer-handle, .mws-sheet-handle",
      );
      const fromHandle = Boolean(handle);
      const swipeEdge = resolvedEdge();
      const fromEdge =
        swipeEdge === "bottom"
          ? event.clientY - node.getBoundingClientRect().top < 48
          : swipeEdge === "left"
            ? event.clientX - node.getBoundingClientRect().left < 28
            : node.getBoundingClientRect().right - event.clientX < 28;
      if (!fromHandle && !fromEdge) return;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
      lastTime = event.timeStamp;
      dragging = true;
      node.setPointerCapture(event.pointerId);
      node.style.transition = "none";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = event.timeStamp;
      const dx = lastX - startX;
      const dy = lastY - startY;
      const swipeEdge = resolvedEdge();
      if (swipeEdge === "bottom") {
        node.style.transform = `translateY(${Math.max(0, dy)}px)`;
      } else if (swipeEdge === "left") {
        node.style.transform = `translateX(${Math.min(0, dx)}px)`;
      } else {
        node.style.transform = `translateX(${Math.max(0, dx)}px)`;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      const dt = Math.max(16, event.timeStamp - lastTime);
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const vx = dx / dt;
      const vy = dy / dt;
      const swipeEdge = resolvedEdge();
      const shouldClose =
        swipeEdge === "bottom"
          ? dy > CLOSE_DISTANCE || vy > CLOSE_VELOCITY
          : swipeEdge === "left"
            ? dx < -CLOSE_DISTANCE || vx < -CLOSE_VELOCITY
            : dx > CLOSE_DISTANCE || vx > CLOSE_VELOCITY;
      if (shouldClose) {
        onClose();
        node.style.transform = "";
      } else {
        resetTransform();
      }
      pointerId = null;
    };

    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", onPointerUp);
    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
    };
  }, [edge, enabled, onClose, ref]);
}
