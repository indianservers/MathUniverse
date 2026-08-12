import { useEffect, type RefObject } from "react";

const FOCUSABLE = "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";

export function useDialogFocus(open: boolean, dialogRef: RefObject<HTMLElement | null>, restoreRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const previous = restoreRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((element) => !element.hidden && element.offsetParent !== null);
    window.requestAnimationFrame(() => (focusable()[0] ?? dialog)?.focus({ preventScroll: true }));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => previous?.focus({ preventScroll: true }));
    };
  }, [dialogRef, open, restoreRef]);
}
