import { useEffect, type RefObject } from "react";

export function isOutsideDismissTarget(
  target: EventTarget | null,
  keepOpenSelector: string,
  root?: HTMLElement | null,
): boolean {
  if (!target || typeof (target as Element).closest !== "function") {
    return false;
  }
  const element = target as Element;
  if (element.closest(keepOpenSelector)) return false;
  if (root && !root.contains(element)) return false;
  return true;
}

export function useOutsideDismiss(options: {
  enabled: boolean;
  keepOpenSelector: string;
  rootRef?: RefObject<HTMLElement | null>;
  onDismiss: () => void;
}): void {
  const { enabled, keepOpenSelector, rootRef, onDismiss } = options;

  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      if (
        !isOutsideDismissTarget(
          event.target,
          keepOpenSelector,
          rootRef?.current,
        )
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [enabled, keepOpenSelector, onDismiss, rootRef]);
}
