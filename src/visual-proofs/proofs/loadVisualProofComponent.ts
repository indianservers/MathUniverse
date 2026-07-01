import type { ComponentType } from "react";
import type { VisualProof, VisualProofCategory, VisualProofComponentKey } from "../data/proofTypes";
import { visualProofsIndex } from "../data/visualProofsIndex";

export type VisualProofComponent = ComponentType<{
  category: VisualProofCategory;
  proof: VisualProof;
}>;

export type VisualProofComponentModule = {
  default: VisualProofComponent;
};

export type VisualProofComponentLoader = () => Promise<VisualProofComponentModule>;
export type CategoryProofLoaders = Partial<Record<VisualProofComponentKey, VisualProofComponentLoader>>;
export type VisualProofCategoryLoaderMap = Record<string, CategoryProofLoaders>;

const proofModules = import.meta.glob<VisualProofComponentModule>([
  "./CircleAreaUnrollingProof.tsx",
  "./CircleToTriangleProof.tsx",
  "./algebra/*.tsx",
  "./calculus/*.tsx",
  "./complex-numbers/*.tsx",
  "./conic-sections/*.tsx",
  "./coordinate-geometry/*.tsx",
  "./engineering-mathematics/*.tsx",
  "./geometry/*.tsx",
  "./inequalities/*.tsx",
  "./logarithms-exponents/*.tsx",
  "./matrices-linear-algebra/*.tsx",
  "./mensuration/*.tsx",
  "./number-theory/*.tsx",
  "./probability/*.tsx",
  "./sequences-series/*.tsx",
  "./statistics/*.tsx",
  "./transformations-symmetry/*.tsx",
  "./trigonometry/*.tsx",
  "./vectors/*.tsx",
  "!./**/*Template.tsx",
]);

function getComponentKeyFromPath(path: string): VisualProofComponentKey {
  const fileName = path.split("/").pop() ?? "";
  return fileName.replace(/\.tsx$/, "") as VisualProofComponentKey;
}

const moduleByComponentKey = Object.entries(proofModules).reduce<Partial<Record<VisualProofComponentKey, VisualProofComponentLoader>>>(
  (modules, [path, loader]) => {
    modules[getComponentKeyFromPath(path)] = loader;
    return modules;
  },
  {},
);

export const visualProofCategoryLoaderMap: VisualProofCategoryLoaderMap = visualProofsIndex.reduce<VisualProofCategoryLoaderMap>(
  (categoryMap, proof) => {
    if (proof.proofUpgradeStatus !== "phase-upgraded") return categoryMap;

    const loader = moduleByComponentKey[proof.componentKey];
    if (!loader) return categoryMap;

    categoryMap[proof.categorySlug] ??= {};
    categoryMap[proof.categorySlug][proof.componentKey] = loader;
    return categoryMap;
  },
  {},
);

export function getVisualProofComponentLoader(categorySlug: string, componentKey: VisualProofComponentKey) {
  return visualProofCategoryLoaderMap[categorySlug]?.[componentKey];
}

export function loadVisualProofComponent(categorySlug: string, componentKey: VisualProofComponentKey) {
  return getVisualProofComponentLoader(categorySlug, componentKey)?.();
}
