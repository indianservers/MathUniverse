import { Expand, Focus, Grid3X3, Home, Keyboard, Maximize2, Minimize2, MonitorUp, MoreHorizontal, PanelsTopLeft, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { MathWorkspaceDefinition } from "../../workspace/mathWorkspaces";
import { useDialogFocus } from "../../hooks/useDialogFocus";
import { classifyWorkspaceViewport, type WorkspaceViewportMode } from "../../workspace/workspaceViewport";
import { nextDirectionalFocus, type FocusDirection } from "../../workspace/directionalFocus";
import { MathWorkspaceChrome } from "./MathWorkspaceNavigation";

type WorkspaceSheet = "more" | "help" | null;

export default function MathWorkspaceLayout({ workspace, children }: { workspace: MathWorkspaceDefinition; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLElement | null>(null);
  const sheetTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [sheet, setSheet] = useState<WorkspaceSheet>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [viewportMode, setViewportMode] = useState<WorkspaceViewportMode>("desktop");
  useDialogFocus(Boolean(sheet), sheetRef, sheetTriggerRef);

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: coarse)");
    const hover = window.matchMedia("(hover: hover)");
    const sync = () => {
      setCoarsePointer(pointer.matches);
      setViewportMode(classifyWorkspaceViewport(window.innerWidth, window.innerHeight, pointer.matches, hover.matches));
    };
    sync();
    pointer.addEventListener("change", sync);
    hover.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => { pointer.removeEventListener("change", sync); hover.removeEventListener("change", sync); window.removeEventListener("resize", sync); };
  }, []);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === rootRef.current);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheet(null);
      if (event.key.toLowerCase() === "f" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void toggleFullscreen(rootRef.current);
      }
      if (event.key === "?" && !isTextInput(event.target)) setSheet("help");
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => setSheet(null), [workspace.id]);

  useEffect(() => {
    if (viewportMode !== "tv") return;
    const root = rootRef.current;
    const onRemoteKey = (event: KeyboardEvent) => {
      if (!event.key.startsWith("Arrow") || isTextInput(event.target)) return;
      const current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!root || !current || !root.contains(current)) return;
      const elements = Array.from(root.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex='0']")).filter((element) => element.offsetParent !== null);
      const rectFor = (element: HTMLElement) => { const rect = element.getBoundingClientRect(); return { id: String(elements.indexOf(element)), left: rect.left, top: rect.top, width: rect.width, height: rect.height }; };
      const next = nextDirectionalFocus(rectFor(current), elements.map(rectFor), event.key as FocusDirection);
      if (!next) return;
      event.preventDefault();
      elements[Number(next.id)]?.focus({ preventScroll: true });
    };
    root?.addEventListener("keydown", onRemoteKey);
    return () => root?.removeEventListener("keydown", onRemoteKey);
  }, [viewportMode]);

  const focusPrimary = () => {
    const target = rootRef.current?.querySelector<HTMLElement>("canvas, [role='grid'], [role='application'], textarea, main button, main input");
    target?.focus({ preventScroll: true });
  };

  const fitWorkspace = () => {
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new CustomEvent("math-workspace:fit", { detail: { workspace: workspace.id } }));
    setSheet(null);
  };

  return (
    <div
      ref={rootRef}
      className={`math-workspace-layout ${focusMode ? "is-focus-mode" : ""} ${presentationMode ? "is-presentation-mode" : ""}`}
      data-workspace={workspace.id}
      data-input={coarsePointer ? "coarse" : "fine"}
      data-viewport={viewportMode}
    >
      <MathWorkspaceChrome compact />
      <div
        className="math-workspace-stage"
        tabIndex={workspace.id === "graphs" ? 0 : undefined}
        role={workspace.id === "graphs" ? "region" : undefined}
        aria-label={workspace.id === "graphs" ? "Scrollable graph workspace" : undefined}
        onKeyDown={(event) => {
          if (workspace.id !== "graphs" || event.target !== event.currentTarget) return;
          const page = Math.max(240, event.currentTarget.clientHeight * 0.82);
          const offsets: Partial<Record<string, number>> = {
            ArrowDown: 72,
            ArrowUp: -72,
            PageDown: page,
            PageUp: -page,
          };
          if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            event.currentTarget.scrollTo({ top: event.key === "Home" ? 0 : event.currentTarget.scrollHeight, behavior: "smooth" });
          } else if (offsets[event.key] !== undefined) {
            event.preventDefault();
            event.currentTarget.scrollBy({ top: offsets[event.key], behavior: "smooth" });
          }
        }}
      >
        {children}
      </div>

      <nav className="math-workspace-mobile-dock" aria-label={`${workspace.name} workspace controls`}>
        <Link to="/" aria-label="Home"><Home /><span>Home</span></Link>
        <button type="button" onClick={focusPrimary}><Focus /><span>Main</span></button>
        <button type="button" className={focusMode ? "is-active" : ""} onClick={() => setFocusMode((value) => !value)} aria-pressed={focusMode}><PanelsTopLeft /><span>Panels</span></button>
        <button ref={sheetTriggerRef} type="button" onClick={() => setSheet("more")} aria-expanded={sheet === "more"}><MoreHorizontal /><span>More</span></button>
        <button type="button" onClick={() => void toggleFullscreen(rootRef.current)}><Expand /><span>{fullscreen ? "Exit" : "Full"}</span></button>
      </nav>

      {sheet && (
        <div className="math-workspace-sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSheet(null)}>
          <section ref={sheetRef} tabIndex={-1} className="math-workspace-sheet" role="dialog" aria-modal="true" aria-label={sheet === "help" ? "Workspace keyboard help" : "More workspace controls"}>
            <div className="math-workspace-sheet-handle" aria-hidden />
            <header><div><strong>{sheet === "help" ? "Keyboard help" : `${workspace.name} controls`}</strong><span>{sheet === "help" ? "Keyboard and remote shortcuts" : "View and presentation options"}</span></div><button type="button" onClick={() => setSheet(null)} aria-label="Close workspace controls"><X /></button></header>
            {sheet === "help" ? (
              <dl className="math-workspace-shortcuts">
                <div><dt><kbd>Tab</kbd></dt><dd>Move between workspace controls</dd></div>
                <div><dt><kbd>Enter</kbd></dt><dd>Activate the focused control</dd></div>
                <div><dt><kbd>Esc</kbd></dt><dd>Close the current panel or sheet</dd></div>
                <div><dt><kbd>Ctrl</kbd> + <kbd>F</kbd></dt><dd>Toggle workspace fullscreen</dd></div>
                <div><dt><kbd>?</kbd></dt><dd>Open this shortcut guide</dd></div>
              </dl>
            ) : (
              <div className="math-workspace-sheet-actions">
                <button type="button" onClick={fitWorkspace}><RotateCcw /><span><strong>Fit workspace</strong><small>Recalculate the available canvas size</small></span></button>
                <button type="button" onClick={() => { setFocusMode((value) => !value); setSheet(null); }}><Maximize2 /><span><strong>{focusMode ? "Show panels" : "Focus on main view"}</strong><small>Keep the mathematical activity unobstructed</small></span></button>
                <button type="button" onClick={() => { setPresentationMode((value) => !value); setSheet(null); }}><MonitorUp /><span><strong>{presentationMode ? "Exit presentation" : "Presentation mode"}</strong><small>Increase labels and simplify surrounding controls</small></span></button>
                <button type="button" onClick={() => void toggleFullscreen(rootRef.current)}>{fullscreen ? <Minimize2 /> : <Maximize2 />}<span><strong>{fullscreen ? "Exit fullscreen" : "Enter fullscreen"}</strong><small>Use the complete display for this workspace</small></span></button>
                <button type="button" onClick={() => setSheet("help")}><Keyboard /><span><strong>Keyboard and remote help</strong><small>Review focus and navigation shortcuts</small></span></button>
                <Link to="/?section=math-workspaces"><Grid3X3 /><span><strong>All Math Workspaces</strong><small>Switch to another connected studio</small></span></Link>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

async function toggleFullscreen(element: HTMLElement | null) {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await element?.requestFullscreen?.();
}

function isTextInput(target: EventTarget | null) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable);
}
