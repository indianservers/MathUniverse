import { Eye, EyeOff, Trash2 } from "lucide-react";
import type { MathObject } from "../../workspace/types";
import { useWorkspaceStore } from "../../workspace/workspaceStore";

type ObjectListProps = {
  objects: MathObject[];
  selectedObjectId: string | null;
};

const kindLabel: Record<string, string> = {
  expression: "Expr",
  equation: "Eq",
  function: "Func",
  point: "Point",
  vector: "Vec",
  matrix: "Matrix",
  table: "Table",
  geometry: "Geo",
  space3d: "3D",
  result: "Result",
  slider: "Slider",
  dataset: "Data",
};

export default function ObjectList({ objects, selectedObjectId }: ObjectListProps) {
  const selectObject = useWorkspaceStore((state) => state.selectObject);
  const toggleObjectVisibility = useWorkspaceStore((state) => state.toggleObjectVisibility);
  const removeObject = useWorkspaceStore((state) => state.removeObject);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-900 dark:text-white">Objects</h2>
        <span className="mini-chip">{objects.length}</span>
      </div>
      <div className="thin-scrollbar max-h-[280px] space-y-2 overflow-auto pr-1">
        {objects.length === 0 ? (
          <p className="rounded-xl bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/10 dark:text-slate-400">
            Run a command or create geometry to populate the shared object model.
          </p>
        ) : (
          objects.map((object) => {
            const selected = selectedObjectId === object.id;
            return (
              <div
                key={object.id}
                className={`rounded-xl border p-2 transition ${
                  selected
                    ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/40 dark:bg-cyan-300/10"
                    : "border-slate-200 bg-white/70 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <button type="button" onClick={() => selectObject(object.id)} className="block w-full min-w-0 text-left">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="rounded-lg bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white dark:bg-white dark:text-slate-950">
                      {kindLabel[object.kind] ?? object.kind}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900 dark:text-white">{object.label}</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">{object.value}</p>
                </button>
                <div className="mt-2 flex items-center gap-1">
                  <button type="button" onClick={() => toggleObjectVisibility(object.id)} className="math-tool-button h-8 w-8 rounded-lg" aria-label={object.visible ? "Hide object" : "Show object"}>
                    {object.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" onClick={() => removeObject(object.id)} className="math-tool-button-danger h-8 w-8 rounded-lg" aria-label="Remove object from workspace registry">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

