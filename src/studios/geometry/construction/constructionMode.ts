import { useSearchParams } from "react-router-dom";

export const CONSTRUCTION_PANELS = [
  { id: "objects", label: "Live Object Tree", aliases: ["objects", "tree", "live object tree"] },
  { id: "measurements", label: "Measurements", aliases: ["measurements", "measure"] },
  { id: "dependencies", label: "Dependencies", aliases: ["dependencies", "deps", "dependency"] },
  { id: "proof", label: "Proof Explanation", aliases: ["proof", "proof explanation", "proofs"] },
] as const;

export type ConstructionPanelId = (typeof CONSTRUCTION_PANELS)[number]["id"];

function normalize(raw: string) {
  return decodeURIComponent(raw).trim().toLowerCase().replace(/[_+]+/g, " ").replace(/\s+/g, " ");
}

export function parseConstructionPanel(raw: string | null | undefined): ConstructionPanelId {
  if (!raw) return "objects";
  const token = normalize(raw);
  const match = CONSTRUCTION_PANELS.find(
    (item) => item.id === token || item.label.toLowerCase() === token || item.aliases.includes(token),
  );
  return match?.id ?? "objects";
}

export function useConstructionPanel() {
  const [params, setParams] = useSearchParams();
  const panel = parseConstructionPanel(params.get("panel") ?? params.get("mode"));
  const setPanel = (next: ConstructionPanelId) => {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.delete("mode");
      if (next === "objects") updated.delete("panel");
      else updated.set("panel", next);
      return updated;
    }, { replace: true });
  };
  return { panel, setPanel };
}
