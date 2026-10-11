import {
  type HTMLAttributes,
  type ReactNode,
  type MutableRefObject,
} from "react";
import type { WorkspaceOverlayApi } from "./useWorkspaceOverlay";

export default function MobileWorkspaceShell({
  overlay,
  className,
  children,
  rootRef,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  overlay: WorkspaceOverlayApi;
  children: ReactNode;
  rootRef?: ((node: HTMLDivElement | null) => void) | MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      {...rest}
      onPointerDownCapture={event=>{
        rest.onPointerDownCapture?.(event);
        if(!overlay.isMobile)return;
        const button=(event.target as Element).closest("button");if(!button?.disabled)return;
        const label=button.getAttribute("aria-label") || button.textContent || "this action";
        const reason=button.closest("fieldset:disabled") ? "Unlock the selected object to edit it." : /undo/i.test(label) ? "There are no changes to undo." : /redo/i.test(label) ? "There are no changes to redo." : "Select or mark an object to enable this action.";
        window.dispatchEvent(new CustomEvent("mws-unavailable",{detail:reason}));
      }}
      ref={(node) => {
        overlay.rootRef.current = node;
        if (typeof rootRef === "function") rootRef(node);
        else if (rootRef && "current" in rootRef) {
          rootRef.current = node;
        }
      }}
      className={["mws-root", className].filter(Boolean).join(" ")}
      data-mws-mobile={overlay.isMobile ? "true" : "false"}
      data-mws-overlay={overlay.active ?? ""}
    >
      {children}
    </div>
  );
}
