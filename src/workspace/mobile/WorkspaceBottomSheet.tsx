import { useRef, useState, type ReactNode } from "react";

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
  const [expanded,setExpanded]=useState(false);
  const dragStart=useRef<number|null>(null);
  if (!open) return null;
  return (
    <aside
      ref={ref}
      className="mws-sheet"
      data-expanded={expanded}
      data-mws-panel="sheet"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-labelledby={labelledBy}
    >
      <div className="mws-sheet-handle" data-mws-handle="true" role="button" tabIndex={0} aria-label={expanded ? "Make panel compact" : "Expand panel"}
        onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setExpanded(!expanded);}}}
        onPointerDown={event=>{dragStart.current=event.clientY;event.currentTarget.setPointerCapture(event.pointerId);}}
        onPointerUp={event=>{if(dragStart.current===null)return;const delta=event.clientY-dragStart.current;dragStart.current=null;if(delta < -30)setExpanded(true);else if(delta>30){if(expanded)setExpanded(false);else onClose();}else setExpanded(!expanded);}}
        onPointerCancel={()=>{dragStart.current=null;}} />
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
