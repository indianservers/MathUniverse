import {
  type HTMLAttributes,
  type ReactNode,
  type Ref,
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
  rootRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      {...rest}
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
