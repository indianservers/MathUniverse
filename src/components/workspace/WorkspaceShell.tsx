import { History, Info, Layers3, ListTree, Maximize2, Minimize2, PanelRightClose, PanelRightOpen, Redo2, Undo2 } from "lucide-react";
import { type ComponentType, CSSProperties, KeyboardEvent, ReactNode, type SVGProps, useEffect, useMemo, useRef, useState } from "react";
import type { MathObject, WorkspaceView } from "../../workspace/types";
import { useWorkspaceStore } from "../../workspace/workspaceStore";
import CommandBar from "./CommandBar";
import InspectorPanel from "./InspectorPanel";
import ObjectList, { type ObjectListAction } from "./ObjectList";
import ResultTimeline from "./ResultTimeline";
import ToolRail from "./ToolRail";

type WorkspaceShellProps = {
  title: string;
  subtitle: string;
  views: WorkspaceView[];
  activeView: string;
  commandValue: string;
  onCommandChange: (value: string) => void;
  onCommandRun: () => void;
  onViewChange: (viewId: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onObjectChange?: (object: MathObject, patch: Partial<MathObject>) => void;
  onObjectAction?: (action: ObjectListAction, object: MathObject) => void;
  children: ReactNode;
};

export default function WorkspaceShell({ title, subtitle, views, activeView, commandValue, onCommandChange, onCommandRun, onViewChange, onKeyDown, onObjectChange, onObjectAction, children }: WorkspaceShellProps) {
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorMode, setInspectorMode] = useState<"objects" | "inspector" | "timeline">("objects");
  const [fullscreen, setFullscreen] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const objects = useWorkspaceStore((state) => state.objects);
  const selectedObjectId = useWorkspaceStore((state) => state.selectedObjectId);
  const selectedObjectIds = useWorkspaceStore((state) => state.selectedObjectIds);
  const history = useWorkspaceStore((state) => state.history);
  const redoHistory = useWorkspaceStore((state) => state.redoHistory);
  const undo = useWorkspaceStore((state) => state.undo);
  const redo = useWorkspaceStore((state) => state.redo);
  const project = useWorkspaceStore((state) => state.project);
  const selectedObject = useMemo(() => objects.find((object) => object.id === selectedObjectId) ?? null, [objects, selectedObjectId]);
  const undoableCount = useMemo(() => history.filter((entry) => entry.before && entry.after).length, [history]);
  const redoableCount = useMemo(() => redoHistory.filter((entry) => entry.before && entry.after).length, [redoHistory]);
  const visibleObjects = useMemo(() => objects.filter((object) => object.visible).length, [objects]);
  const geometryObjects = useMemo(() => objects.filter((object) => object.dimension === "2d" || object.id.startsWith("geometry:")).length, [objects]);
  const spaceObjects = useMemo(() => objects.filter((object) => object.dimension === "3d" || object.id.startsWith("space3d:")).length, [objects]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!selectedObjectId) return;
    setInspectorOpen(true);
    setInspectorMode("inspector");
  }, [selectedObjectId]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await shellRef.current?.requestFullscreen?.();
  };

  return (
    <div ref={shellRef} className="workspace-app-shell" onKeyDown={onKeyDown}>
      <div className="workspace-topbar">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-500 dark:text-cyan-300">Interactive math lab</p>
          <h1 className="truncate text-lg font-black text-slate-950 dark:text-white">{title}</h1>
          <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            onClick={undo}
            disabled={undoableCount === 0}
            className="tool-button min-h-9 rounded-full px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            title={undoableCount ? `Undo latest recoverable workspace action (${undoableCount} available)` : "Nothing recoverable to undo"}
            aria-label="Undo workspace action"
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={redoableCount === 0}
            className="tool-button min-h-9 rounded-full px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            title={redoableCount ? `Redo latest recovered workspace action (${redoableCount} available)` : "Nothing to redo"}
            aria-label="Redo workspace action"
          >
            <Redo2 className="h-4 w-4" />
            Redo
          </button>
          <button type="button" onClick={() => void toggleFullscreen()} className="tool-button min-h-9 rounded-full px-3 py-1.5 text-xs" title={fullscreen ? "Exit full screen" : "Open workspace full screen"}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {fullscreen ? "Exit full" : "Full screen"}
          </button>
          <span className="mini-chip">Ctrl+Enter run</span>
          <span className="mini-chip">{selectedObjectIds.length} selected</span>
          <span className="mini-chip">{visibleObjects}/{objects.length} shown</span>
          <span className="mini-chip">{geometryObjects} 2D</span>
          <span className="mini-chip">{spaceObjects} 3D</span>
          <span className="mini-chip">Saved {formatShellTime(project.updatedAt)}</span>
        </div>
      </div>

      <div
        className="workspace-grid"
        style={{ "--workspace-inspector": inspectorOpen ? "320px" : "48px" } as CSSProperties}
      >
        <div className="min-w-0 min-h-0">
          <ToolRail views={views} activeView={activeView} onViewChange={onViewChange} />
        </div>

        <main className="flex min-h-0 min-w-0 flex-col gap-2 overflow-hidden">
          <CommandBar value={commandValue} onChange={onCommandChange} onRun={onCommandRun} />
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </main>

        <aside className={`workspace-inspector thin-scrollbar hidden min-h-0 min-w-0 flex-col gap-2 overflow-auto xl:flex ${inspectorOpen ? "pr-1" : "items-center overflow-hidden pr-0"}`} aria-label="Workspace inspector">
          <button
            type="button"
            onClick={() => setInspectorOpen((value) => !value)}
            className={inspectorOpen ? "workspace-inspector-toggle workspace-inspector-toggle-open" : "workspace-inspector-toggle workspace-inspector-toggle-collapsed"}
            title={inspectorOpen ? "Collapse workspace side panel" : "Expand workspace side panel"}
            aria-label={inspectorOpen ? "Collapse workspace side panel" : "Expand workspace side panel"}
          >
            {inspectorOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            {inspectorOpen && <span>Collapse side panel</span>}
          </button>

          {inspectorOpen ? (
            <>
              <div className="workspace-inspector-tabs">
                <InspectorTab active={inspectorMode === "objects"} icon={ListTree} label="Objects" onClick={() => setInspectorMode("objects")} />
                <InspectorTab active={inspectorMode === "inspector"} icon={Info} label="Inspector" onClick={() => setInspectorMode("inspector")} />
                <InspectorTab active={inspectorMode === "timeline"} icon={History} label="Timeline" onClick={() => setInspectorMode("timeline")} />
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-2 text-xs font-bold text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4" />
                  <span className="truncate">{selectedObject ? `${selectedObject.label} selected` : `${objects.length} workspace objects`}</span>
                </div>
              </div>
              {inspectorMode === "objects" && <ObjectList objects={objects} selectedObjectId={selectedObjectId} selectedObjectIds={selectedObjectIds} onObjectAction={onObjectAction} />}
              {inspectorMode === "inspector" && <InspectorPanel object={selectedObject} onObjectChange={onObjectChange} />}
              {inspectorMode === "timeline" && <ResultTimeline history={history} redoHistory={redoHistory} onUndo={undo} onRedo={redo} />}
            </>
          ) : (
            <div className="workspace-inspector-rail">
              <button type="button" onClick={() => setInspectorOpen(true)} className="workspace-inspector-rail-button" title={`${objects.length} objects`} aria-label="Open objects panel">
                <ListTree className="h-4 w-4" />
                <span>{objects.length}</span>
              </button>
              <button type="button" onClick={() => setInspectorOpen(true)} className="workspace-inspector-rail-button" title="Open inspector" aria-label="Open inspector panel">
                <Info className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setInspectorOpen(true)} className="workspace-inspector-rail-button" title={`${history.length} timeline items`} aria-label="Open timeline panel">
                <History className="h-4 w-4" />
                <span>{history.length}</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function InspectorTab({ active, icon: Icon, label, onClick }: { active: boolean; icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={active ? "workspace-inspector-tab workspace-inspector-tab-active" : "workspace-inspector-tab"}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function formatShellTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
