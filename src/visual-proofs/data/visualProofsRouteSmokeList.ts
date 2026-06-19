import { visualProofCategories } from "./visualProofCategories";
import { visualProofsIndex } from "./visualProofsIndex";

export type VisualProofSmokeRouteGroup = {
  id: string;
  label: string;
  routes: string[];
};

export const visualProofsCategorySmokeRoutes = visualProofCategories.map((category) => `/visual-proofs/${category.slug}`);

export const visualProofsPhaseUpgradedSmokeRoutes = visualProofsIndex
  .filter((proof) => proof.proofUpgradeStatus === "phase-upgraded")
  .map((proof) => proof.route);

export const visualProofsRepresentativeSmokeRoutes = visualProofCategories
  .map((category) => visualProofsIndex.find((proof) => proof.categorySlug === category.slug && proof.proofUpgradeStatus === "phase-upgraded")?.route)
  .filter((route): route is string => Boolean(route));

export const visualProofsRouteSmokeGroups: VisualProofSmokeRouteGroup[] = [
  {
    id: "hub",
    label: "Visual Proofs hub",
    routes: ["/visual-proofs"],
  },
  {
    id: "categories",
    label: "All Visual Proofs category pages",
    routes: visualProofsCategorySmokeRoutes,
  },
  {
    id: "phase-upgraded-proofs",
    label: "All phase-upgraded proof routes",
    routes: visualProofsPhaseUpgradedSmokeRoutes,
  },
  {
    id: "representatives",
    label: "One representative route per category",
    routes: visualProofsRepresentativeSmokeRoutes,
  },
];

export const visualProofsAllSmokeRoutes = Array.from(new Set(visualProofsRouteSmokeGroups.flatMap((group) => group.routes)));
