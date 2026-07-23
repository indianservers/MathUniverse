export type DiscreteLessonMode =
  | "product" | "factorial" | "permutation" | "repeated-permutation" | "circular-permutation" | "combination" | "pascal" | "inclusion-exclusion" | "pigeonhole"
  | "graph-builder" | "directed" | "weighted" | "degree" | "paths-cycles" | "components" | "euler" | "hamiltonian" | "tree" | "mst" | "shortest-path" | "colouring" | "bipartite" | "planar" | "flow" | "tsp" | "adjacency"
  | "set-builder" | "set-operations" | "complement" | "cartesian-product" | "power-set" | "truth-table" | "connectives" | "quantifiers" | "proof";

export type DiscreteLessonPreset = { lessonId: number; id: string; mode: DiscreteLessonMode };

const modeByLessonId: Record<number, DiscreteLessonMode> = {
  556:"product",557:"factorial",558:"permutation",559:"repeated-permutation",560:"circular-permutation",561:"combination",562:"pascal",563:"inclusion-exclusion",564:"pigeonhole",
  565:"graph-builder",566:"directed",567:"weighted",568:"degree",569:"paths-cycles",570:"components",571:"euler",572:"hamiltonian",573:"tree",574:"mst",575:"shortest-path",576:"colouring",577:"bipartite",578:"planar",579:"flow",580:"tsp",581:"adjacency",
  582:"set-builder",583:"set-operations",584:"complement",585:"cartesian-product",586:"power-set",587:"truth-table",588:"connectives",589:"quantifiers",590:"proof",
};

export const discreteLessonPresets = Object.freeze(Object.entries(modeByLessonId).map(([lessonId, mode]) => ({ lessonId:Number(lessonId), id:`discrete.${mode}`, mode })));
const byId = new Map(discreteLessonPresets.map((preset) => [preset.lessonId,preset]));
export function discreteLessonPreset(lessonId:number) { const preset=byId.get(lessonId); if(!preset) throw new Error(`Missing discrete lesson preset for ${lessonId}`); return preset; }
