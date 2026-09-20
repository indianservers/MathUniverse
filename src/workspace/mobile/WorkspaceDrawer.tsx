import { useRef, type ReactNode } from "react";
import { useMobileWorkspaceGestures } from "./useMobileWorkspaceGestures";

export default function WorkspaceDrawer({
  open,
  edge,
  title,
  onClose,
  children,
}: {
  open: boolean;
  edge: "left" | "right" | "bottom";
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useMobileWorkspaceGestures(ref, {
    enabled: open,
    edge,
    onClose,
  });
  return (
    <aside
      ref={ref}
      className={`mws-drawer mws-drawer-${edge} ${open ? "open" : ""}`}
      data-mws-panel={open ? title : undefined}
      aria-hidden={!open}
      aria-label={title}
    >
      <div className="mws-sheet-handle" data-mws-handle="true" />
      {children}
    </aside>
  );
}
