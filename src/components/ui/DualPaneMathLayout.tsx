import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import SectionCard from "./SectionCard";

type Pane = {
  id: "2d" | "3d";
  label: string;
  title: string;
  description?: string;
  content: ReactNode;
};

type DualPaneMathLayoutProps = {
  title: string;
  subtitle: string;
  meta?: ReactNode;
  controls: ReactNode;
  panes: [Pane, Pane];
  insights?: ReactNode;
};

export default function DualPaneMathLayout({ title, subtitle, meta, controls, panes, insights }: DualPaneMathLayoutProps) {
  const [activePane, setActivePane] = useState<"2d" | "3d">("2d");
  const [zoomByPane, setZoomByPane] = useState<Record<"2d" | "3d", number>>({ "2d": 1, "3d": 1 });
  const [leftWidth, setLeftWidth] = useState(340);
  const [rightWidth, setRightWidth] = useState(360);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [focusPane, setFocusPane] = useState(false);
  const pane = panes.find((item) => item.id === activePane) ?? panes[0];
  const zoom = zoomByPane[activePane];
  const rightColumn = insights ? (rightCollapsed ? "58px" : `${rightWidth}px`) : "0px";
  const gridStyle = {
    "--math-grid-cols": focusPane ? "0px 0px minmax(520px, 1fr) 0px 0px" : `${leftWidth}px 12px minmax(520px, 1fr) ${insights ? "12px" : "0px"} ${rightColumn}`,
  } as CSSProperties;

  const startResize = (side: "left" | "right", startX: number) => {
    const initialLeft = leftWidth;
    const initialRight = rightWidth;
    const onPointerMove = (event: PointerEvent) => {
      const delta = event.clientX - startX;
      if (side === "left") {
        setLeftWidth(Math.min(500, Math.max(260, initialLeft + delta)));
      } else {
        setRightWidth(Math.min(520, Math.max(280, initialRight - delta)));
      }
    };
    const stopResize = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopResize, { once: true });
  };

  const updateZoom = (nextZoom: number) => {
    setZoomByPane((current) => ({
      ...current,
      [activePane]: Math.min(2.5, Math.max(0.6, Math.round(nextZoom * 100) / 100)),
    }));
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-cyan-200/70 bg-white/82 p-4 shadow-xl shadow-cyan-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/72">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Interactive math lab</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
          {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
        </div>
      </section>

      <div className="grid min-h-[calc(100vh-210px)] gap-0 xl:[grid-template-columns:var(--math-grid-cols)]" style={gridStyle}>
        <aside className={focusPane ? "hidden" : "xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto xl:pr-1"}>
          <SectionCard title="Controls">{controls}</SectionCard>
        </aside>

        <ResizeHandle label="Resize controls" onPointerDown={(event) => startResize("left", event.clientX)} disabled={focusPane} />

        <main className="min-w-0 px-0 xl:px-1">
          <SectionCard title={pane.title} description={pane.description} tone="spotlight">
            <div className="mb-4 flex rounded-2xl border border-cyan-200 bg-white/80 p-1 dark:border-white/10 dark:bg-slate-950/60">
              {panes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePane(item.id)}
                  className={`min-h-11 flex-1 rounded-xl px-4 text-sm font-black transition ${activePane === item.id ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25" : "text-slate-600 hover:bg-cyan-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <PaneToolbar activePane={activePane} paneLabel={pane.label} zoom={zoom} focusPane={focusPane} onZoom={updateZoom} onFocusToggle={() => setFocusPane((value) => !value)} />
            <ZoomablePane zoom={zoom} label={pane.title}>
              {pane.content}
            </ZoomablePane>
          </SectionCard>
        </main>

        {insights ? <ResizeHandle label="Resize explanation" onPointerDown={(event) => startResize("right", event.clientX)} disabled={rightCollapsed || focusPane} /> : null}

        {insights && !focusPane ? (
          <aside className="relative xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto xl:pl-1">
            {rightCollapsed ? (
              <button
                type="button"
                onClick={() => setRightCollapsed(false)}
                className="sticky top-3 flex min-h-14 w-full items-center justify-center rounded-2xl border border-cyan-200 bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-800 shadow-lg shadow-cyan-500/10 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/90 dark:text-cyan-200 dark:hover:bg-white/10 xl:min-h-[220px] xl:px-2 xl:[writing-mode:vertical-rl]"
                aria-label="Open values and explanation panel"
              >
                Open panel
              </button>
            ) : (
              <SectionCard title="Values and Explanation">
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setRightCollapsed(true)}
                    aria-label="Collapse values and explanation panel"
                    className="rounded-full border border-cyan-200 px-3 py-1 text-xs font-black text-cyan-800 hover:bg-cyan-50 dark:border-white/10 dark:text-cyan-200 dark:hover:bg-white/10"
                  >
                    Collapse
                  </button>
                </div>
                {insights}
              </SectionCard>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function PaneToolbar({ activePane, paneLabel, zoom, focusPane, onZoom, onFocusToggle }: { activePane: "2d" | "3d"; paneLabel: string; zoom: number; focusPane: boolean; onZoom: (value: number) => void; onFocusToggle: () => void }) {
  const presets = activePane === "2d" ? [0.75, 1, 1.5, 2] : [0.8, 1, 1.25, 1.5];
  return (
    <div className="mb-3 space-y-2 rounded-2xl border border-cyan-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-950/55">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{paneLabel} controls · Zoom {Math.round(zoom * 100)}%</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onZoom(zoom - 0.15)} aria-label={`Zoom out ${paneLabel}`} className="math-pane-tool-button">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onZoom(1)} aria-label={`Reset zoom ${paneLabel}`} className="math-pane-tool-button">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onZoom(zoom + 0.15)} aria-label={`Zoom in ${paneLabel}`} className="math-pane-tool-button">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button type="button" onClick={onFocusToggle} aria-label={focusPane ? `Exit focus mode ${paneLabel}` : `Focus ${paneLabel}`} className="math-pane-tool-button">
            {focusPane ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <label className="flex min-w-0 items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Scale</span>
          <input
            type="range"
            min="60"
            max="250"
            step="5"
            value={Math.round(zoom * 100)}
            onChange={(event) => onZoom(Number(event.target.value) / 100)}
            aria-label={`Zoom slider ${paneLabel}`}
            className="min-w-0 flex-1"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onZoom(preset)}
              aria-label={`Set ${paneLabel} zoom to ${Math.round(preset * 100)} percent`}
              className={Math.abs(zoom - preset) < 0.01 ? "math-pane-preset-button math-pane-preset-button-active" : "math-pane-preset-button"}
            >
              {Math.round(preset * 100)}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ZoomablePane({ zoom, label, children }: { zoom: number; label: string; children: ReactNode }) {
  const paneRef = useRef<HTMLDivElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const frameStyle = {
    width: zoom >= 1 ? `${zoom * 100}%` : "100%",
    minHeight: fullscreen ? "100%" : `${Math.max(430, 430 * zoom)}px`,
  } as CSSProperties;
  const contentStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: "top left",
    width: zoom >= 1 ? `${100 / zoom}%` : "100%",
  } as CSSProperties;

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === paneRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === paneRef.current) {
      await document.exitFullscreen();
      return;
    }
    await paneRef.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={paneRef}
      className="math-pane-fullscreen-target relative min-h-[430px] overflow-auto rounded-2xl border border-cyan-200/70 bg-slate-950/5 dark:border-white/10 dark:bg-slate-950/40"
      aria-label={`${label} zoomable workspace`}
    >
      <div className="sticky right-3 top-3 z-20 ml-auto flex w-fit rounded-full border border-cyan-200/70 bg-white/92 p-1 shadow-lg shadow-cyan-500/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/88">
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="math-pane-tool-button"
          title={fullscreen ? `Exit full screen ${label}` : `Full screen ${label}`}
          aria-label={fullscreen ? `Exit full screen ${label}` : `Full screen ${label}`}
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
      <div style={frameStyle}>
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}

function ResizeHandle({ label, disabled, onPointerDown }: { label: string; disabled?: boolean; onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onPointerDown={disabled ? undefined : onPointerDown}
      className={`hidden h-full min-h-[320px] cursor-col-resize items-center justify-center rounded-full transition xl:flex ${disabled ? "cursor-default opacity-0" : "opacity-45 hover:bg-cyan-100 hover:opacity-100 dark:hover:bg-white/10"}`}
    >
      <span className="h-20 w-1 rounded-full bg-cyan-400/70" />
    </button>
  );
}
