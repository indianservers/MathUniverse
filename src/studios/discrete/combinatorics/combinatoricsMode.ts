import { useSearchParams } from "react-router-dom";

export const COMBO_MODES = [
  { id: "arrangements", label: "Arrangements", subtitle: "Order matters", aliases: ["arrangements", "arrangement", "permutations", "permutation"] },
  { id: "selections", label: "Selections", subtitle: "Choose without ordering", aliases: ["selections", "selection", "combinations", "combination"] },
  { id: "pigeonhole", label: "Pigeonhole", subtitle: "Objects into containers", aliases: ["pigeonhole", "pigeon hole", "pigeon-hole"] },
  { id: "inclusion-exclusion", label: "Inclusion–Exclusion", subtitle: "Count overlapping sets", aliases: ["inclusion-exclusion", "inclusion exclusion", "inclusionexclusion", "venn"] },
  { id: "generating-tree", label: "Generating Tree", subtitle: "Build possibilities step by step", aliases: ["generating-tree", "generating tree", "tree", "counting tree"] },
] as const;

export type ComboModeId = (typeof COMBO_MODES)[number]["id"];

export const ARR_KINDS = ["all", "npr", "repetition", "circular", "repeated"] as const;
export const SEL_KINDS = ["ncr", "compare", "pascal", "repetition", "subsets"] as const;
export const PIG_KINDS = ["basic", "generalized", "examples", "challenge"] as const;
export const IE_KINDS = ["two", "three", "survey", "complement", "regions"] as const;
export const TREE_KINDS = ["binary", "permutation", "selection", "restricted", "dice", "paths"] as const;

export type ArrKind = (typeof ARR_KINDS)[number];
export type SelKind = (typeof SEL_KINDS)[number];
export type PigKind = (typeof PIG_KINDS)[number];
export type IeKind = (typeof IE_KINDS)[number];
export type TreeKind = (typeof TREE_KINDS)[number];

function normalize(raw: string): string {
  return decodeURIComponent(raw)
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[_+]+/g, " ")
    .replace(/\s+/g, " ");
}

export function parseComboMode(raw: string | null | undefined): ComboModeId {
  if (!raw) return "arrangements";
  const token = normalize(raw);
  const match = COMBO_MODES.find(
    (mode) => mode.id === token || mode.label.toLowerCase() === token || mode.aliases.includes(token) || mode.aliases.includes(token.replace(/ /g, "-")),
  );
  return match?.id ?? "arrangements";
}

export function comboModeMeta(id: ComboModeId) {
  return COMBO_MODES.find((mode) => mode.id === id) ?? COMBO_MODES[0];
}

function pick<T extends string>(raw: string | null | undefined, allowed: readonly T[], fallback: T): T {
  if (!raw) return fallback;
  const token = normalize(raw).replace(/ /g, "-");
  return (allowed as readonly string[]).includes(token) ? (token as T) : fallback;
}

export function parseArrKind(raw: string | null | undefined): ArrKind {
  const token = normalize(raw ?? "all").replace(/ /g, "-");
  if (token === "arrange-all" || token === "factorial") return "all";
  if (token === "p(n,r)" || token === "npr" || token === "k-from-n") return "npr";
  if (token === "repeats" || token === "with-repetition") return "repetition";
  if (token === "circle" || token === "circular-arrangements") return "circular";
  if (token === "multiset" || token === "banana") return "repeated";
  return pick(raw, ARR_KINDS, "all");
}

export function parseSelKind(raw: string | null | undefined): SelKind {
  const token = normalize(raw ?? "ncr").replace(/ /g, "-");
  if (token === "choose" || token === "c(n,r)" || token === "grid" || token === "selection-grid") return "ncr";
  if (token === "order" || token === "vs") return "compare";
  if (token === "pascal-connection" || token === "triangle") return "pascal";
  if (token === "stars" || token === "stars-and-bars") return "repetition";
  if (token === "power-set" || token === "subset") return "subsets";
  return pick(raw, SEL_KINDS, "ncr");
}

export function parsePigKind(raw: string | null | undefined): PigKind {
  const token = normalize(raw ?? "basic").replace(/ /g, "-");
  if (token === "demo") return "basic";
  if (token === "ceil" || token === "general") return "generalized";
  if (token === "presets" || token === "real") return "examples";
  return pick(raw, PIG_KINDS, "basic");
}

export function parseIeKind(raw: string | null | undefined): IeKind {
  const token = normalize(raw ?? "two").replace(/ /g, "-");
  if (token === "2" || token === "two-sets") return "two";
  if (token === "3" || token === "three-sets") return "three";
  if (token === "students") return "survey";
  if (token === "none" || token === "complement-counting") return "complement";
  if (token === "region" || token === "region-first") return "regions";
  return pick(raw, IE_KINDS, "two");
}

export function parseTreeKind(raw: string | null | undefined): TreeKind {
  const token = normalize(raw ?? "binary").replace(/ /g, "-");
  if (token === "bits" || token === "binary-strings") return "binary";
  if (token === "perms") return "permutation";
  if (token === "combos" || token === "include-exclude") return "selection";
  if (token === "no-consecutive" || token === "constraint") return "restricted";
  if (token === "die" || token === "dice-outcomes") return "dice";
  if (token === "grid-paths") return "paths";
  return pick(raw, TREE_KINDS, "binary");
}

export function useComboLabMode() {
  const [params, setParams] = useSearchParams();
  const mode = parseComboMode(params.get("mode"));
  const kind = params.get("kind");
  const setMode = (next: ComboModeId) => {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (next === "arrangements") updated.delete("mode");
      else updated.set("mode", next);
      updated.delete("kind");
      return updated;
    });
  };
  const setKind = (next: string) => {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      const current = parseComboMode(updated.get("mode"));
      if (current !== "arrangements") updated.set("mode", current);
      if (!next || next === defaultKind(current)) updated.delete("kind");
      else updated.set("kind", next);
      return updated;
    });
  };
  return { mode, kind, setMode, setKind };
}

export function defaultKind(mode: ComboModeId): string {
  if (mode === "arrangements") return "all";
  if (mode === "selections") return "ncr";
  if (mode === "pigeonhole") return "basic";
  if (mode === "inclusion-exclusion") return "two";
  return "binary";
}
