import { useSearchParams } from "react-router-dom";

export const MEASURE_MODES = [
  { id: "length", label: "Length", hint: "Linear dimensions" },
  { id: "angle", label: "Angle", hint: "Interior and turning angles" },
  { id: "area", label: "Area", hint: "Region measures" },
  { id: "perimeter", label: "Perimeter", hint: "Outer boundary" },
  { id: "scale", label: "Scale", hint: "Similarity factor" },
  { id: "error", label: "Error", hint: "Uncertainty" },
] as const;

export type MeasureModeId = (typeof MEASURE_MODES)[number]["id"];

export const MEASURE_PANELS = [
  { id: "objects", label: "Live Object Tree" },
  { id: "measurements", label: "Measurements" },
  { id: "dependencies", label: "Dependencies" },
  { id: "proof", label: "Proof Explanation" },
] as const;

export type MeasurePanelId = (typeof MEASURE_PANELS)[number]["id"];

function token(raw: string) {
  return decodeURIComponent(raw).trim().toLowerCase().replace(/[_+]+/g, " ");
}

export function parseMeasureMode(raw: string | null): MeasureModeId {
  const t = token(raw ?? "length");
  return MEASURE_MODES.find((m) => m.id === t || m.label.toLowerCase() === t)?.id ?? "length";
}

export function parseMeasurePanel(raw: string | null): MeasurePanelId {
  const t = token(raw ?? "measurements");
  return MEASURE_PANELS.find((m) => m.id === t || m.label.toLowerCase() === t)?.id ?? "measurements";
}

export function useMeasurementWorkspace() {
  const [params, setParams] = useSearchParams();
  const mode = parseMeasureMode(params.get("mode"));
  const panel = parseMeasurePanel(params.get("panel"));
  const update = (patch: { mode?: MeasureModeId; panel?: MeasurePanelId }) => {
    const next = new URLSearchParams(params);
    if (patch.mode) {
      if (patch.mode === "length") next.delete("mode");
      else next.set("mode", patch.mode);
    }
    if (patch.panel) {
      if (patch.panel === "measurements") next.delete("panel");
      else next.set("panel", patch.panel);
    }
    setParams(next);
  };
  return {
    mode,
    panel,
    setMode: (id: MeasureModeId) => update({ mode: id }),
    setPanel: (id: MeasurePanelId) => update({ panel: id }),
  };
}
