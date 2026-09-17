import { useEffect, type ReactNode } from "react";
import { MockupLearningStrip } from "../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { useLabMode } from "../mockup/studioLabKit";
import { useStudioFigure } from "./useStudioFigure";

export function Phase1LabChrome({
  page,
  toolbar,
  children,
}: {
  page: StudioMockupPage;
  toolbar?: ReactNode;
  children: ReactNode | ((mode: string) => ReactNode);
}) {
  const { tabs, mode, setMode } = useLabMode(page);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      const index = tabs.indexOf(mode);
      if (event.key === "ArrowRight" && index >= 0) setMode(tabs[(index + 1) % tabs.length] ?? mode);
      if (event.key === "ArrowLeft" && index >= 0) setMode(tabs[(index - 1 + tabs.length) % tabs.length] ?? mode);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, setMode, tabs]);
  return (
    <>
      <nav className="msk-tabs" aria-label={`${page.title} modes`}>
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-dash-banner" data-lab-mode={mode} data-studio-kernel="1">
        <b>{page.title} · {mode}</b>
        <small>{page.subtitle}</small>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{page.title} mode {mode}</p>
      {toolbar ?? <DefaultKernelBar />}
      <div className="msk-lab" data-mode-canvas={mode}>{typeof children === "function" ? children(mode) : children}</div>
      <MockupLearningStrip page={page} mode={mode} />
    </>
  );
}

function DefaultKernelBar() {
  const fig = useStudioFigure({ k: 1 });
  return (
    <FigureToolbar
      canUndo={fig.canUndo}
      canRedo={fig.canRedo}
      exact={fig.exact}
      onUndo={fig.undo}
      onRedo={fig.redo}
      onReset={fig.reset}
      onShare={() => void fig.share()}
      onExact={fig.setExact}
    />
  );
}

export function FigureToolbar({
  canUndo,
  canRedo,
  exact,
  onUndo,
  onRedo,
  onReset,
  onShare,
  onExact,
}: {
  canUndo: boolean;
  canRedo: boolean;
  exact: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onShare: () => void;
  onExact: (value: boolean) => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo();
        else onUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRedo, onUndo]);
  return (
    <div className="msk-canvas-tools p1-toolbar" role="toolbar" aria-label="Figure tools">
      <button type="button" disabled={!canUndo} onClick={onUndo}>Undo</button>
      <button type="button" disabled={!canRedo} onClick={onRedo}>Redo</button>
      <button type="button" onClick={onReset}>Reset</button>
      <button type="button" onClick={onShare}>Share</button>
      <button type="button" aria-pressed={exact} className={exact ? "active" : ""} onClick={() => onExact(!exact)}>
        {exact ? "Exact" : "Approx"}
      </button>
    </div>
  );
}
