import { useRef, type ReactNode } from "react";
import { useMobileWorkspaceGestures } from "./useMobileWorkspaceGestures";

export default function WorkspaceBottomSheet({
  open,
  title,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useMobileWorkspaceGestures(ref, {
    enabled: open,
    edge: "bottom",
    onClose,
  });
  if (!open) return null;
  return (
    <aside
      ref={ref}
      className="mws-sheet"
      data-mws-panel="sheet"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-labelledby={labelledBy}
    >
      <div className="mws-sheet-handle" data-mws-handle="true" />
      {title ? (
        <header className="mws-sheet-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close panel">
            Close
          </button>
        </header>
      ) : null}
      <div className="mws-sheet-body">{children}</div>
    </aside>
  );
}
