import { History, Info, ListTree, PanelRightClose, PanelRightOpen } from "lucide-react";
import { CSSProperties, KeyboardEvent, ReactNode, useMemo, useState } from "react";
import type { WorkspaceView } from "../../workspace/types";
import { useWorkspaceStore } from "../../workspace/workspaceStore";
import CommandBar from "./CommandBar";
import InspectorPanel from "./InspectorPanel";
import ObjectList from "./ObjectList";
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
  children: ReactNode;
};

export default function WorkspaceShell({ title, subtitle, views, activeView, commandValue, onCommandChange, onCommandRun, onViewChange, onKeyDown, children }: WorkspaceShellProps) {
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const objects = useWorkspaceStore((state) => state.objects);
  const selectedObjectId = useWorkspaceStore((state) => state.selectedObjectId);
  const history = useWorkspaceStore((state) => state.history);
  const selectedObject = useMemo(() => objects.find((object) => object.id === selectedObjectId) ?? null, [objects, selectedObjectId]);

  return (
    <div className="workspace-app-shell" onKeyDown={onKeyDown}>
      <div className="workspace-topbar">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-500 dark:text-cyan-300">Interactive math lab</p>
          <h1 className="truncate text-lg font-black text-slate-950 dark:text-white">{title}</h1>
          <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <span className="mini-chip">Ctrl+Enter run</span>
          <span className="mini-chip">{objects.length} objects</span>
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
              <ObjectList objects={objects} selectedObjectId={selectedObjectId} />
              <InspectorPanel object={selectedObject} />
              <ResultTimeline history={history} />
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
