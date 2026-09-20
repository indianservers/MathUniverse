import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useOutsideDismiss } from "./useOutsideDismiss";

export function nextWorkspaceOverlay(
  active: string | null,
  id: string,
): string | null {
  return active === id ? null : id;
}

export const MOBILE_WORKSPACE_QUERY = "(max-width: 1100px)";
export const GEOMETRY_MOBILE_QUERY = "(max-width: 1180px)";

export const WORKSPACE_OVERLAY_KEEP_OPEN =
  '[data-mws-panel], [data-mws-toolbar], [data-mws-menu], .mws-keep-open, .gs3d-left-panel.open, .gs3d-right-panel.open, .gs3d-dock.open, .gs3d-popover, .gs3d-mobile-nav, .gs3d-mobile-menu, .geometry-mobile-tools, .geometry-mobile-drawer, .geometry-modal, .os-view-controls, .gs3d-view-menu > div';

const HISTORY_STATE_KEY = "mwsOverlay";

export function useIsMobileWorkspace(query = MOBILE_WORKSPACE_QUERY) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : Boolean(window.matchMedia?.(query)?.matches),
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return isMobile;
}

export type WorkspaceOverlayApi = {
  active: string | null;
  isMobile: boolean;
  canvasGuarded: boolean;
  rootRef: RefObject<HTMLElement | null>;
  isOpen: (id: string) => boolean;
  open: (id: string) => void;
  close: () => void;
  toggle: (id: string) => void;
  consumeCanvasGuard: () => boolean;
  beginCanvasGuard: () => void;
};

export function guardCanvasPointer(
  overlay: Pick<WorkspaceOverlayApi, "consumeCanvasGuard">,
  event: { preventDefault: () => void; stopPropagation: () => void },
): boolean {
  if (overlay.consumeCanvasGuard()) {
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  const focused = document.activeElement;
  if (
    focused instanceof HTMLElement &&
    focused.matches("input, textarea, [contenteditable='true']")
  ) {
    focused.blur();
  }
  return false;
}

export function useWorkspaceOverlay(options?: {
  query?: string;
  enabled?: boolean;
}): WorkspaceOverlayApi {
  const query = options?.query ?? MOBILE_WORKSPACE_QUERY;
  const enabled = options?.enabled ?? true;
  const isMobile = useIsMobileWorkspace(query);
  const mobileActive = enabled && isMobile;
  const [active, setActive] = useState<string | null>(null);
  const [canvasGuarded, setCanvasGuarded] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const guardRef = useRef(false);
  const historyPushedRef = useRef(false);
  const activeRef = useRef<string | null>(null);
  activeRef.current = active;

  const beginCanvasGuard = useCallback(() => {
    guardRef.current = true;
    setCanvasGuarded(true);
  }, []);

  const consumeCanvasGuard = useCallback(() => {
    if (!guardRef.current) return false;
    guardRef.current = false;
    setCanvasGuarded(false);
    return true;
  }, []);

  const close = useCallback(() => {
    setActive(null);
    if (historyPushedRef.current && typeof window !== "undefined") {
      historyPushedRef.current = false;
      const state = window.history.state as { [HISTORY_STATE_KEY]?: string } | null;
      if (state?.[HISTORY_STATE_KEY]) {
        window.history.back();
      }
    }
  }, []);

  const open = useCallback(
    (id: string) => {
      setActive(id);
      if (
        mobileActive &&
        !historyPushedRef.current &&
        typeof window !== "undefined"
      ) {
        window.history.pushState({ [HISTORY_STATE_KEY]: id }, "");
        historyPushedRef.current = true;
      }
    },
    [mobileActive],
  );

  const toggle = useCallback(
    (id: string) => {
      if (nextWorkspaceOverlay(activeRef.current, id) === null) close();
      else open(id);
    },
    [close, open],
  );

  const isOpen = useCallback((id: string) => active === id, [active]);

  useEffect(() => {
    if (!mobileActive) {
      setActive(null);
      historyPushedRef.current = false;
    }
  }, [mobileActive]);

  useEffect(() => {
    if (!mobileActive) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!activeRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      close();
    };
    const onPop = () => {
      historyPushedRef.current = false;
      if (activeRef.current) setActive(null);
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [close, mobileActive]);

  const dismissOutside = useCallback(() => {
    beginCanvasGuard();
    close();
  }, [beginCanvasGuard, close]);

  useOutsideDismiss({
    enabled: Boolean(mobileActive && active),
    keepOpenSelector: WORKSPACE_OVERLAY_KEEP_OPEN,
    rootRef,
    onDismiss: dismissOutside,
  });

  useEffect(() => {
    if (!mobileActive) return;
    const viewport = window.visualViewport;
    const sync = () => {
      const height = viewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--mws-vvh", `${height}px`);
      document.documentElement.style.setProperty(
        "--mws-keyboard",
        `${Math.max(0, window.innerHeight - height)}px`,
      );
    };
    sync();
    viewport?.addEventListener("resize", sync);
    viewport?.addEventListener("scroll", sync);
    return () => {
      viewport?.removeEventListener("resize", sync);
      viewport?.removeEventListener("scroll", sync);
    };
  }, [mobileActive]);

  return useMemo(
    () => ({
      active,
      isMobile: mobileActive,
      canvasGuarded,
      rootRef,
      isOpen,
      open,
      close,
      toggle,
      consumeCanvasGuard,
      beginCanvasGuard,
    }),
    [
      active,
      beginCanvasGuard,
      canvasGuarded,
      close,
      consumeCanvasGuard,
      isOpen,
      mobileActive,
      open,
      toggle,
    ],
  );
}
