import { Link2, Lock, RotateCcw, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import type { MathObject, MathObjectInteractivity, MathObjectStyle, MathTransform, MathVec3 } from "../../workspace/types";
import { objectDependencyCount } from "../../workspace/dependencyGraph";
import { useWorkspaceStore } from "../../workspace/workspaceStore";

type InspectorPanelProps = {
  object: MathObject | null;
  onObjectChange?: (object: MathObject, patch: Partial<MathObject>) => void;
};

type PropertyDraft = {
  caption: string;
  conditionalVisibility: string;
  dynamicOpacity: string;
  dynamicRgb: string;
};

export default function InspectorPanel({ object, onObjectChange }: InspectorPanelProps) {
  const updateObject = useWorkspaceStore((state) => state.updateObject);
  const [propertyDraft, setPropertyDraft] = useState(() => propertyDraftForObject(object));

  useEffect(() => {
    setPropertyDraft(propertyDraftForObject(object));
  }, [
    object?.id,
    object?.properties?.caption,
    object?.properties?.conditionalVisibility,
    object?.properties?.dynamicStyle?.opacity,
    object?.properties?.dynamicColor?.red,
    object?.properties?.dynamicColor?.green,
    object?.properties?.dynamicColor?.blue,
  ]);

  if (!object) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-black text-slate-900 dark:text-white">Inspector</h2>
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
          Select a workspace object to inspect its value, linked views, dependencies, and metadata.
        </p>
      </section>
    );
  }

  const applyPatch = (patch: Partial<MathObject>, label = "Edited workspace object") => {
    onObjectChange?.(object, patch);
    updateObject(object.id, patch, label);
  };
  const updateTransform = (section: keyof MathTransform, axis: keyof MathVec3, value: number) => {
    if (!object.transform || section === "origin") return;
    applyPatch({
      transform: {
        ...object.transform,
        [section]: { ...(object.transform[section] as MathVec3), [axis]: finiteOrZero(value) },
      },
    }, `Edited ${object.label} transform`);
  };
  const updateStyle = (patch: Partial<MathObjectStyle>) => {
    applyPatch({ style: { ...object.style, ...patch } }, `Edited ${object.label} style`);
  };
  const updateProperties = (patch: NonNullable<MathObject["properties"]>) => {
    applyPatch({ properties: { ...object.properties, ...patch } }, `Edited ${object.label} properties`);
  };
  const commitCaption = (caption: string) => {
    setPropertyDraft((current) => ({ ...current, caption }));
    updateProperties({ caption });
  };
  const commitConditionalVisibility = (conditionalVisibility: string) => {
    setPropertyDraft((current) => ({ ...current, conditionalVisibility }));
    updateProperties({ conditionalVisibility });
  };
  const commitDynamicRgb = (dynamicRgb: string) => {
    setPropertyDraft((current) => ({ ...current, dynamicRgb }));
    updateProperties({ dynamicColor: parseDynamicColor(dynamicRgb) });
  };
  const commitDynamicOpacity = (dynamicOpacity: string) => {
    setPropertyDraft((current) => ({ ...current, dynamicOpacity }));
    updateProperties({ dynamicStyle: { ...object.properties?.dynamicStyle, opacity: dynamicOpacity } });
  };
  const updateInteractivity = (patch: Partial<MathObjectInteractivity>) => {
    if (!object.interactivity) return;
    applyPatch({ interactivity: { ...object.interactivity, ...patch } }, `Edited ${object.label} interaction`);
  };
  const resetTransform = () => {
    applyPatch({
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    }, `Reset ${object.label} transform`);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5" data-testid="workspace-inspector">
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{object.kind}</p>
          <h2 className="mt-1 break-words text-sm font-black text-slate-950 dark:text-white">{object.label}</h2>
        </div>
        <span className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-white/10 dark:text-slate-200" title={object.locked ? "Locked" : "Editable"}>
          {object.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-950/70" data-testid="object-properties-panel">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Value</p>
        {object.metadata?.source === "engine-measurement" && (
          <p className="mt-2 rounded-lg bg-cyan-100 px-2 py-1 text-[11px] font-bold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">
            Derived by the shared Graph/2D/3D engine bridge.
          </p>
        )}
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs font-semibold text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-cyan-50"
          value={object.value}
          disabled={object.locked}
          onChange={(event) => applyPatch({ value: event.target.value }, `Edited ${object.label} value`)}
        />
      </div>

      <div className="mt-3 grid gap-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
          Label
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-900"
            value={object.label}
            disabled={object.locked}
            onChange={(event) => applyPatch({ label: event.target.value || object.label }, `Renamed ${object.label}`)}
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <ToggleEdit label="Visible" checked={object.visible} onChange={(checked) => applyPatch({ visible: checked, status: checked ? "ready" : "hidden" }, checked ? `Show ${object.label}` : `Hide ${object.label}`)} />
          <ToggleEdit label="Locked" checked={Boolean(object.locked)} onChange={(checked) => applyPatch({ locked: checked }, checked ? `Locked ${object.label}` : `Unlocked ${object.label}`)} />
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-950/70">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Object Properties</p>
        <label className="mt-2 block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
          Caption
          <input
            data-testid="object-property-caption"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold dark:border-white/10 dark:bg-slate-900"
            value={propertyDraft.caption}
            disabled={object.locked}
            onInput={(event) => commitCaption(event.currentTarget.value)}
            onBlur={(event) => commitCaption(event.currentTarget.value)}
          />
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <NumberEdit label="Layer" value={object.properties?.layer ?? 0} min={0} max={99} step={1} disabled={Boolean(object.locked)} onChange={(value) => updateProperties({ layer: value })} />
          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            Label mode
            <select
              data-testid="object-property-label-mode"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold dark:border-white/10 dark:bg-slate-900"
              value={object.properties?.labelMode ?? "name"}
              disabled={object.locked}
              onChange={(event) => updateProperties({ labelMode: event.target.value as NonNullable<MathObject["properties"]>["labelMode"] })}
            >
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="caption">Caption</option>
              <option value="name-value">Name + value</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
        </div>
        <label className="mt-2 block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
          Conditional visibility
          <input
            data-testid="object-property-conditional-visibility"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs font-bold dark:border-white/10 dark:bg-slate-900"
            placeholder="a > 0"
            value={propertyDraft.conditionalVisibility}
            disabled={object.locked}
            onInput={(event) => commitConditionalVisibility(event.currentTarget.value)}
            onBlur={(event) => commitConditionalVisibility(event.currentTarget.value)}
          />
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            Dynamic RGB
            <input
              data-testid="object-property-dynamic-rgb"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs font-bold dark:border-white/10 dark:bg-slate-900"
              placeholder="255,0,0"
              value={propertyDraft.dynamicRgb}
              disabled={object.locked}
              onInput={(event) => commitDynamicRgb(event.currentTarget.value)}
              onBlur={(event) => commitDynamicRgb(event.currentTarget.value)}
            />
          </label>
          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            Dynamic opacity
            <input
              data-testid="object-property-dynamic-opacity"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs font-bold dark:border-white/10 dark:bg-slate-900"
              placeholder="0.75"
              value={propertyDraft.dynamicOpacity}
              disabled={object.locked}
              onInput={(event) => commitDynamicOpacity(event.currentTarget.value)}
              onBlur={(event) => commitDynamicOpacity(event.currentTarget.value)}
            />
          </label>
        </div>
      </div>

      {object.summary && <p className="mt-3 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{object.summary}</p>}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Info label="Status" value={object.status} />
        <Info label="Deps" value={`${objectDependencyCount(object)}`} />
        <Info label="Dimension" value={object.dimension ?? "abstract"} />
        <Info label="Role" value={object.role ?? "construction"} />
      </div>

      {object.transform && (
        <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-950/70">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Transform</p>
            <button type="button" onClick={resetTransform} className="mini-chip" disabled={object.locked}>
              <RotateCcw className="h-3 w-3" />Reset
            </button>
          </div>
          <TransformEditor title="Position" values={object.transform.position} disabled={Boolean(object.locked)} onChange={(axis, value) => updateTransform("position", axis, value)} />
          <TransformEditor title="Rotation" values={object.transform.rotation} disabled={Boolean(object.locked)} onChange={(axis, value) => updateTransform("rotation", axis, value)} />
          <TransformEditor title="Scale" values={object.transform.scale} disabled={Boolean(object.locked)} min={0.05} onChange={(axis, value) => updateTransform("scale", axis, value)} />
        </div>
      )}

      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-950/70">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Style</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            Color
            <input
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900"
              type="color"
              value={object.style?.color ?? object.style?.stroke ?? "#06b6d4"}
              disabled={object.locked}
              onChange={(event) => updateStyle({ color: event.target.value, stroke: event.target.value })}
            />
          </label>
          <NumberEdit label="Opacity" value={object.style?.opacity ?? 1} min={0.05} max={1} step={0.05} disabled={Boolean(object.locked)} onChange={(value) => updateStyle({ opacity: value })} />
          <NumberEdit label="Stroke" value={object.style?.strokeWidth ?? 2} min={0.5} max={12} step={0.5} disabled={Boolean(object.locked)} onChange={(value) => updateStyle({ strokeWidth: value })} />
          <ToggleEdit label="Labels" checked={object.style?.labelVisible ?? true} disabled={Boolean(object.locked)} onChange={(checked) => updateStyle({ labelVisible: checked })} />
        </div>
        {object.dimension === "3d" && (
          <label className="mt-2 block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
            Material
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold dark:border-white/10 dark:bg-slate-900"
              value={object.style?.material ?? "matte"}
              disabled={object.locked}
              onChange={(event) => updateStyle({ material: event.target.value as MathObjectStyle["material"] })}
            >
              <option value="matte">Matte</option>
              <option value="glossy">Glossy</option>
              <option value="glass">Glass</option>
              <option value="wireframe">Wireframe</option>
            </select>
          </label>
        )}
      </div>

      {object.dependencies && object.dependencies.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Dependencies</p>
          <div className="mt-2 grid gap-1">
            {object.dependencies.slice(0, 8).map((dependency) => (
              <div key={`${dependency.id}-${dependency.role}`} className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-white/10">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{dependency.label}</p>
                <p className="truncate text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">{dependency.role ?? "dependency"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {object.interactivity && (
        <div className="mt-3">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Interaction</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <ToggleEdit label="Selectable" checked={object.interactivity.selectable} disabled={Boolean(object.locked)} onChange={(checked) => updateInteractivity({ selectable: checked })} compact />
            <ToggleEdit label="Draggable" checked={object.interactivity.draggable} disabled={Boolean(object.locked)} onChange={(checked) => updateInteractivity({ draggable: checked })} compact />
            <ToggleEdit label="Editable" checked={object.interactivity.editable} disabled={Boolean(object.locked)} onChange={(checked) => updateInteractivity({ editable: checked })} compact />
            <ToggleEdit label="Resizable" checked={object.interactivity.resizable} disabled={Boolean(object.locked)} onChange={(checked) => updateInteractivity({ resizable: checked })} compact />
            <ToggleEdit label="Rotatable" checked={object.interactivity.rotatable} disabled={Boolean(object.locked)} onChange={(checked) => updateInteractivity({ rotatable: checked })} compact />
          </div>
        </div>
      )}

      <div className="mt-3">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <Link2 className="h-3.5 w-3.5 text-cyan-500" />
          Linked views
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {object.linkedViews.map((view) => (
            <span key={view} className="mini-chip">
              {view}
            </span>
          ))}
        </div>
      </div>

      {object.metadata && (
        <div className="mt-3">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Metadata</p>
          <dl className="mt-2 space-y-1">
            {Object.entries(object.metadata).map(([key, value]) => (
              <div key={key} className="flex min-w-0 justify-between gap-2 rounded-lg bg-slate-100 px-2 py-1 dark:bg-white/10">
                <dt className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{key}</dt>
                <dd className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function TransformEditor({
  disabled,
  min = -999,
  onChange,
  title,
  values,
}: {
  disabled: boolean;
  min?: number;
  onChange: (axis: keyof MathVec3, value: number) => void;
  title: string;
  values: MathVec3;
}) {
  return (
    <div className="mt-2">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-1 grid grid-cols-3 gap-1.5">
        {(["x", "y", "z"] as const).map((axis) => (
          <NumberEdit key={axis} label={axis} value={values[axis]} min={min} max={999} step={0.1} disabled={disabled} onChange={(value) => onChange(axis, value)} />
        ))}
      </div>
    </div>
  );
}

function NumberEdit({ disabled = false, label, max, min, onChange, step, value }: { disabled?: boolean; label: string; max: number; min: number; onChange: (value: number) => void; step: number; value: number }) {
  return (
    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-xs font-bold text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-white"
        type="number"
        value={formatNumber(value)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function ToggleEdit({ checked, compact = false, disabled = false, label, onChange }: { checked: boolean; compact?: boolean; disabled?: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className={compact ? "mini-chip cursor-pointer" : "flex items-center gap-2 rounded-lg bg-slate-100 px-2 py-2 text-xs font-bold dark:bg-white/10"}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function finiteOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function formatDynamicColor(object: MathObject) {
  const color = object.properties?.dynamicColor;
  return color ? [color.red, color.green, color.blue].join(",") : "";
}

function propertyDraftForObject(object: MathObject | null): PropertyDraft {
  return {
    caption: object?.properties?.caption ?? "",
    conditionalVisibility: object?.properties?.conditionalVisibility ?? "",
    dynamicOpacity: object?.properties?.dynamicStyle?.opacity ?? "",
    dynamicRgb: object ? formatDynamicColor(object) : "",
  };
}

function parseDynamicColor(value: string) {
  const [red, green, blue, alpha] = value.split(",").map((part) => part.trim());
  if (!red && !green && !blue) return undefined;
  return { red: red || "0", green: green || "0", blue: blue || "0", alpha };
}
