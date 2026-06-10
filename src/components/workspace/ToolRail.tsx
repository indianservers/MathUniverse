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
    <nav className="flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white/80 p-1 dark:border-white/10 dark:bg-slate-950/60 xl:h-full xl:flex-col xl:items-center xl:overflow-visible" aria-label="Workspace tools">
      {views.map((view) => {
        const Icon = icons[view.id as keyof typeof icons] ?? (view.id.includes("3") ? Box : Braces);
        const active = activeView === view.id;
        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onViewChange(view.id)}
            className={`tooltip-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
              active
                ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
            }`}
            data-tooltip={view.label}
            aria-label={view.label}
            aria-current={active ? "page" : undefined}
            title={view.summary}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </nav>
  );
}
