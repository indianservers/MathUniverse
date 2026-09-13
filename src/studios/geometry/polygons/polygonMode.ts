import { useSearchParams } from "react-router-dom";

export const POLYGON_MODE_IDS = ["regular", "angles", "tessellation", "area", "diagonals"] as const;
export type PolygonModeId = (typeof POLYGON_MODE_IDS)[number];

export type PolygonModeDef = {
  id: PolygonModeId;
  label: string;
  subtitle: string;
  url: string;
  aliases: string[];
};

export const POLYGON_MODES: PolygonModeDef[] = [
  {
    id: "regular",
    label: "Regular Polygon",
    subtitle: "Build & explore regular n-gons",
    url: "regular",
    aliases: ["regular", "regular polygon", "explore", "ngon", "n"],
  },
  {
    id: "angles",
    label: "Interior Angles",
    subtitle: "Angle sums, exterior angles & relationships",
    url: "angles",
    aliases: ["angles", "angle", "interior", "interior angles", "interior-angles", "exterior"],
  },
  {
    id: "tessellation",
    label: "Tessellation",
    subtitle: "Tile the plane with polygons",
    url: "tessellation",
    aliases: ["tessellation", "tessellate", "tiling", "tiles"],
  },
  {
    id: "area",
    label: "Area",
    subtitle: "Decompose, measure & compare area",
    url: "area",
    aliases: ["area", "areas"],
  },
  {
    id: "diagonals",
    label: "Diagonals",
    subtitle: "Explore connections between vertices",
    url: "diagonals",
    aliases: ["diagonals", "diagonal"],
  },
];

function normalizeModeToken(raw: string) {
  return decodeURIComponent(raw).trim().toLowerCase().replace(/[_+]+/g, " ").replace(/\s+/g, " ");
}

export function parsePolygonMode(raw: string | null | undefined): PolygonModeId {
  if (!raw) return "regular";
  const token = normalizeModeToken(raw);
  const match = POLYGON_MODES.find(
    (mode) => mode.aliases.includes(token) || mode.id === token || mode.label.toLowerCase() === token || mode.url === token,
  );
  return match?.id ?? "regular";
}

export function polygonModeUrl(id: PolygonModeId): string {
  return POLYGON_MODES.find((mode) => mode.id === id)?.url ?? "regular";
}

export function polygonModeMeta(id: PolygonModeId) {
  return POLYGON_MODES.find((mode) => mode.id === id) ?? POLYGON_MODES[0]!;
}

export function usePolygonLabMode() {
  const [params, setParams] = useSearchParams();
  const mode = parsePolygonMode(params.get("mode"));
  const setMode = (next: PolygonModeId) => {
    const updated = new URLSearchParams(params);
    updated.set("mode", polygonModeUrl(next));
    setParams(updated);
  };
  return { mode, setMode, modes: POLYGON_MODES };
}
