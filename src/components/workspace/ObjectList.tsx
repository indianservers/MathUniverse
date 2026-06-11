import { ClipboardCopy, Eye, EyeOff, RotateCcw, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";
import type { MathObject } from "../../workspace/types";
import { useWorkspaceStore } from "../../workspace/workspaceStore";

export type ObjectListAction = "show" | "hide" | "duplicate" | "restore" | "remove";
type ObjectListFilter = "all" | "algebra" | "geometry" | "space3d" | "measurements" | "visible" | "hidden" | "selected";

type ObjectListProps = {
  objects: MathObject[];
  selectedObjectId: string | null;
  selectedObjectIds: string[];
  onObjectAction?: (action: ObjectListAction, object: MathObject) => void;
};

const kindLabel: Record<string, string> = {
  expression: "Expr",
  equation: "Eq",
  function: "Func",
  point: "Point",
  line: "Line",
  segment: "Seg",
  ray: "Ray",
  polygon: "Poly",
  circle: "Circle",
  arc: "Arc",
  angle: "Angle",
  conic: "Conic",
  vector: "Vec",
  text: "Text",
  matrix: "Matrix",
  table: "Table",
  geometry: "Geo",
  space3d: "3D",
  plane: "Plane",
  surface: "Surf",
  solid: "Solid",
  "transform-helper": "Xform",
  result: "Result",
  slider: "Slider",
  dataset: "Data",
};

export default function ObjectList({ objects, selectedObjectId, selectedObjectIds, onObjectAction }: ObjectListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ObjectListFilter>("all");
  const selectObject = useWorkspaceStore((state) => state.selectObject);
  const selectObjects = useWorkspaceStore((state) => state.selectObjects);
  const updateObject = useWorkspaceStore((state) => state.updateObject);
  const removeObject = useWorkspaceStore((state) => state.removeObject);
  const selectedSet = new Set(selectedObjectIds);
  const selectedObjects = objects.filter((object) => selectedSet.has(object.id));
  const scopeCounts = useMemo(() => countObjectScopes(objects, selectedSet), [objects, selectedObjectIds]);
  const filteredObjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return objects.filter((object) => {
      if (filter === "algebra" && objectScope(object) !== "algebra") return false;
      if (filter === "geometry" && objectScope(object) !== "geometry") return false;
      if (filter === "space3d" && objectScope(object) !== "space3d") return false;
      if (filter === "measurements" && objectScope(object) !== "measurements") return false;
      if (filter === "visible" && !object.visible) return false;
      if (filter === "hidden" && object.visible) return false;
      if (filter === "selected" && !selectedSet.has(object.id)) return false;
      if (!normalizedQuery) return true;
      return [
        object.label,
        object.metadata?.evaluatedLabel ?? "",
        object.metadata?.caption ?? "",
        object.properties?.caption ?? "",
        object.properties?.conditionalVisibility ?? "",
        object.properties?.dynamicColor ? Object.values(object.properties.dynamicColor).join(" ") : "",
        object.value,
        object.kind,
        object.role ?? "",
        object.dimension ?? "",
        object.summary ?? "",
        ...object.linkedViews,
      ].join(" ").toLowerCase().includes(normalizedQuery);
    });
  }, [filter, objects, query, selectedObjectIds]);
  const handleVisibility = (object: MathObject) => {
    const visible = !object.visible;
    updateObject(object.id, { visible, status: visible ? "ready" : "hidden" }, visible ? `Show ${object.label}` : `Hide ${object.label}`);
    onObjectAction?.(visible ? "show" : "hide", object);
  };
  const handleRemove = (object: MathObject) => {
    onObjectAction?.("remove", object);
    removeObject(object.id);
  };
  const handleSelect = (event: MouseEvent, object: MathObject) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      selectObjects([object.id], true);
      return;
    }
    selectObject(object.id);
  };
  const setChecked = (object: MathObject, checked: boolean) => {
    if (checked) {
      selectObjects([object.id], true);
      return;
    }
    selectObjects(selectedObjectIds.filter((id) => id !== object.id));
  };
  const runBulk = (action: ObjectListAction) => {
    selectedObjects.forEach((object) => {
      if (action === "show" || action === "hide") {
        const visible = action === "show";
        updateObject(object.id, { visible, status: visible ? "ready" : "hidden" }, visible ? `Show ${object.label}` : `Hide ${object.label}`);
      }
      onObjectAction?.(action, object);
      if (action === "remove") removeObject(object.id);
    });
    if (action === "remove") selectObjects([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-900 dark:text-white">Objects</h2>
        <span className="mini-chip">{filteredObjects.length}/{objects.length}</span>
      </div>
      <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{selectedObjects.length} selected</span>
          <div className="flex flex-wrap gap-1">
            <button type="button" className="mini-chip" onClick={() => selectObjects(filteredObjects.map((object) => object.id))}>All</button>
            <button type="button" className="mini-chip" onClick={() => selectObjects([])}>Clear</button>
          </div>
        </div>
        {selectedObjects.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <button type="button" className="math-tool-button h-8 w-8 rounded-lg" aria-label="Show selected objects" onClick={() => runBulk("show")}><Eye className="h-3.5 w-3.5" /></button>
            <button type="button" className="math-tool-button h-8 w-8 rounded-lg" aria-label="Hide selected objects" onClick={() => runBulk("hide")}><EyeOff className="h-3.5 w-3.5" /></button>
            <button type="button" className="math-tool-button h-8 w-8 rounded-lg" aria-label="Duplicate selected objects" onClick={() => runBulk("duplicate")}><ClipboardCopy className="h-3.5 w-3.5" /></button>
            <button type="button" className="math-tool-button h-8 w-8 rounded-lg" aria-label="Restore selected objects" onClick={() => runBulk("restore")}><RotateCcw className="h-3.5 w-3.5" /></button>
            <button type="button" className="math-tool-button-danger h-8 w-8 rounded-lg" aria-label="Remove selected objects" onClick={() => runBulk("remove")}><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>
      <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
        <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
          Search objects
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold dark:border-white/10 dark:bg-slate-900"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="label, value, kind, view..."
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-1">
          {objectFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-100" : "mini-chip"}
              onClick={() => setFilter(item.id)}
            >
              {item.label} {scopeCounts[item.id]}
            </button>
          ))}
        </div>
      </div>
      <div className="thin-scrollbar max-h-[280px] space-y-2 overflow-auto pr-1">
        {objects.length === 0 ? (
          <p className="rounded-xl bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/10 dark:text-slate-400">
            Run a command or create geometry to populate the shared object model.
          </p>
        ) : filteredObjects.length === 0 ? (
          <p className="rounded-xl bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-500 dark:bg-white/10 dark:text-slate-400">
            No objects match the current search and layer filter.
          </p>
        ) : (
          filteredObjects.map((object) => {
            const selected = selectedSet.has(object.id);
            const primarySelected = selectedObjectId === object.id;
            return (
              <div
                key={object.id}
                className={`rounded-xl border p-2 transition ${
                  primarySelected
                    ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/40 dark:bg-cyan-300/10"
                    : selected
                    ? "border-sky-200 bg-sky-50/80 dark:border-sky-300/30 dark:bg-sky-300/10"
                    : "border-slate-200 bg-white/70 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="flex min-w-0 items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-cyan-500"
                    checked={selected}
                    onChange={(event) => setChecked(object, event.target.checked)}
                    aria-label={`Select ${object.label}`}
                  />
                  <button type="button" onClick={(event) => handleSelect(event, object)} className="block min-w-0 flex-1 text-left">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="rounded-lg bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white dark:bg-white dark:text-slate-950">
                      {kindLabel[object.kind] ?? object.kind}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900 dark:text-white">{displayObjectLabel(object)}</span>
                  </div>
                  {displayObjectCaption(object) && <p className="mt-1 truncate text-xs font-semibold text-cyan-700 dark:text-cyan-200">{displayObjectCaption(object)}</p>}
                  <p className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">{object.value}</p>
                </button>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <button type="button" onClick={() => handleVisibility(object)} className="math-tool-button h-8 w-8 rounded-lg" aria-label={object.visible ? "Hide object" : "Show object"}>
                    {object.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" onClick={() => onObjectAction?.("duplicate", object)} className="math-tool-button h-8 w-8 rounded-lg" aria-label="Duplicate object">
                    <ClipboardCopy className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => onObjectAction?.("restore", object)} className="math-tool-button h-8 w-8 rounded-lg" aria-label="Restore object defaults">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => handleRemove(object)} className="math-tool-button-danger h-8 w-8 rounded-lg" aria-label="Remove object from workspace registry">
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

const objectFilters: Array<{ id: ObjectListFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "algebra", label: "Algebra" },
  { id: "geometry", label: "2D" },
  { id: "space3d", label: "3D" },
  { id: "measurements", label: "Measure" },
  { id: "visible", label: "Shown" },
  { id: "hidden", label: "Hidden" },
  { id: "selected", label: "Selected" },
];

function objectScope(object: MathObject): "algebra" | "geometry" | "space3d" | "measurements" | "other" {
  if (object.role === "measurement" || object.metadata?.source === "engine-measurement") return "measurements";
  if (object.id.startsWith("algebra:") || object.id.startsWith("plot:") || object.id.startsWith("slider:") || object.id.startsWith("result:") || object.role === "algebra") return "algebra";
  if (object.id.startsWith("geometry:") || object.dimension === "2d") return "geometry";
  if (object.id.startsWith("space3d:") || object.dimension === "3d") return "space3d";
  return "other";
}

function displayObjectLabel(object: MathObject) {
  const evaluated = object.metadata?.evaluatedLabel;
  return typeof evaluated === "string" && evaluated.trim() ? evaluated : object.label;
}

function displayObjectCaption(object: MathObject) {
  const caption = object.metadata?.caption ?? object.properties?.caption;
  return typeof caption === "string" && caption.trim() ? caption : "";
}

function countObjectScopes(objects: MathObject[], selectedSet: Set<string>): Record<ObjectListFilter, number> {
  return objects.reduce<Record<ObjectListFilter, number>>((counts, object) => {
    const scope = objectScope(object);
    counts.all += 1;
    if (scope !== "other") counts[scope] += 1;
    if (object.visible) counts.visible += 1;
    else counts.hidden += 1;
    if (selectedSet.has(object.id)) counts.selected += 1;
    return counts;
  }, { all: 0, algebra: 0, geometry: 0, space3d: 0, measurements: 0, visible: 0, hidden: 0, selected: 0 });
}
