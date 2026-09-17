import { useSearchParams } from "react-router-dom";

export const COORD_MODE_IDS = ["distance", "midpoint", "slope", "section", "locus"] as const;
export type CoordModeId = (typeof COORD_MODE_IDS)[number];

export type CoordModeDef = {
  id: CoordModeId;
  label: string;
  aliases: string[];
};

export const COORD_MODES: CoordModeDef[] = [
  { id: "distance", label: "Distance", aliases: ["distance", "d"] },
  { id: "midpoint", label: "Midpoint", aliases: ["midpoint", "mid", "mid-point"] },
  { id: "slope", label: "Slope", aliases: ["slope", "gradient"] },
  { id: "section", label: "Section Formula", aliases: ["section", "section formula", "section-formula", "ratio"] },
  { id: "locus", label: "Locus", aliases: ["locus", "loci"] },
];

function normalize(raw: string) {
  return decodeURIComponent(raw).trim().toLowerCase().replace(/[_+]+/g, " ").replace(/\s+/g, " ");
}

export function parseCoordMode(raw: string | null | undefined): CoordModeId {
  if (!raw) return "distance";
  const token = normalize(raw);
  const match = COORD_MODES.find(
    (mode) => mode.id === token || mode.label.toLowerCase() === token || mode.aliases.includes(token),
  );
  return match?.id ?? "distance";
}

export function useCoordLabMode() {
  const [params, setParams] = useSearchParams();
  const mode = parseCoordMode(params.get("mode"));
  const setMode = (next: CoordModeId) => {
    const updated = new URLSearchParams(params);
    updated.set("mode", next);
    setParams(updated);
  };
  return { mode, setMode };
}
