import { useSearchParams } from "react-router-dom";

export const TRIANGLE_MODE_IDS = ["explorer", "congruence", "similarity", "centers", "inequalities"] as const;
export type TriangleModeId = (typeof TRIANGLE_MODE_IDS)[number];

export type TriangleModeDef = {
  id: TriangleModeId;
  label: string;
  subtitle: string;
  aliases: string[];
};

export const TRIANGLE_MODES: TriangleModeDef[] = [
  {
    id: "explorer",
    label: "Triangle Explorer",
    subtitle: "Sides, angles, area & classification",
    aliases: ["explorer", "triangle explorer", "explore"],
  },
  {
    id: "congruence",
    label: "Congruence",
    subtitle: "SSS, SAS, ASA, AAS & RHS",
    aliases: ["congruence", "congruent"],
  },
  {
    id: "similarity",
    label: "Similarity",
    subtitle: "Scale factors & proportional sides",
    aliases: ["similarity", "similar"],
  },
  {
    id: "centers",
    label: "Centers",
    subtitle: "Centroid, circumcenter, incenter & orthocenter",
    aliases: ["centers", "center", "centre", "centres"],
  },
  {
    id: "inequalities",
    label: "Inequalities",
    subtitle: "Triangle inequality & side-angle relations",
    aliases: ["inequalities", "inequality", "triangle inequality"],
  },
];

function normalizeModeToken(raw: string) {
  return raw.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

export function parseTriangleMode(raw: string | null | undefined): TriangleModeId {
  if (!raw) return "explorer";
  const token = normalizeModeToken(raw);
  const match = TRIANGLE_MODES.find((mode) => mode.aliases.includes(token) || mode.id === token || mode.label.toLowerCase() === token);
  return match?.id ?? "explorer";
}

export function useTriangleLabMode() {
  const [params, setParams] = useSearchParams();
  const mode = parseTriangleMode(params.get("mode"));
  const setMode = (next: TriangleModeId) => {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (next === "explorer") updated.delete("mode");
      else updated.set("mode", next);
      return updated;
    });
  };
  return { mode, setMode, modes: TRIANGLE_MODES };
}
