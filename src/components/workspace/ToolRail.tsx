import { Box, Braces, Calculator, Cuboid, MousePointer2, Wrench } from "lucide-react";
import type { WorkspaceView } from "../../workspace/types";

type ToolRailProps = {
  views: WorkspaceView[];
  activeView: string;
  onViewChange: (viewId: string) => void;
};

const icons = {
  solve: Calculator,
  geometry: MousePointer2,
  space3d: Cuboid,
  tools: Wrench,
};

export default function ToolRail({ views, activeView, onViewChange }: ToolRailProps) {
  return (
    <nav className="workspace-view-tabs" aria-label="Workspace tools">
      {views.map((view) => {
        const Icon = icons[view.id as keyof typeof icons] ?? (view.id.includes("3") ? Box : Braces);
        const active = activeView === view.id;
        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onViewChange(view.id)}
            className={`tooltip-icon workspace-view-tab ${
              active
                ? "workspace-view-tab-active"
                : "workspace-view-tab-idle"
            }`}
            data-tooltip={view.label}
            aria-label={view.label}
            aria-current={active ? "page" : undefined}
            title={view.summary}
          >
            <Icon className="h-5 w-5" />
            <span className="workspace-view-tab-label">{view.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
