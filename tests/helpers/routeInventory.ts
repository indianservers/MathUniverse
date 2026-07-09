import { formulaCategories } from "../../src/data/formulaLibrary";
import { mathLabTools } from "../../src/data/mathLabTools";
import { ncertConcepts, ncertRoute } from "../../src/data/ncertConcepts";
import { internalSiteLinks } from "../../src/data/siteLinks";
import { theoremCategories } from "../../src/data/theoremLibrary";
import { visualProofsIndex } from "../../src/visual-proofs/data/visualProofsIndex";

export type RouteFeatureType =
  | "home"
  | "NCERT"
  | "Math Lab"
  | "Visual Proof"
  | "Formula"
  | "Theorem"
  | "AR/XR"
  | "Workspace"
  | "Search/Menu"
  | "Other";

export type RouteInventoryItem = {
  route: string;
  source: string;
  featureType: RouteFeatureType;
  expectedPageType: string;
  needsBrowserSmoke: boolean;
  priority?: boolean;
  classLevel?: string;
};

const appRouteItems: RouteInventoryItem[] = [
  { route: "/", source: "src/App.tsx", featureType: "home", expectedPageType: "Home dashboard", needsBrowserSmoke: true, priority: true },
  { route: "/ncert", source: "src/App.tsx, src/data/siteLinks.ts", featureType: "NCERT", expectedPageType: "NCERT dashboard", needsBrowserSmoke: true, priority: true },
  { route: "/math-lab", source: "src/App.tsx, src/data/siteLinks.ts", featureType: "Math Lab", expectedPageType: "Math Lab hub", needsBrowserSmoke: true, priority: true },
  { route: "/visual-proofs", source: "src/App.tsx, src/visual-proofs/data/visualProofsIndex.ts", featureType: "Visual Proof", expectedPageType: "Visual Proofs hub", needsBrowserSmoke: true, priority: true },
  { route: "/formulas", source: "src/App.tsx, src/data/formulaLibrary.ts", featureType: "Formula", expectedPageType: "Formula library", needsBrowserSmoke: true, priority: true },
  { route: "/theorems", source: "src/App.tsx, src/data/theoremLibrary.ts", featureType: "Theorem", expectedPageType: "Theorem library", needsBrowserSmoke: true, priority: true },
  { route: "/modules/ar-math-lab", source: "src/App.tsx, src/data/siteLinks.ts", featureType: "AR/XR", expectedPageType: "AR Math Lab", needsBrowserSmoke: true, priority: true },
  { route: "/workspace", source: "src/App.tsx, src/data/siteLinks.ts", featureType: "Workspace", expectedPageType: "Math workspace", needsBrowserSmoke: true, priority: true },
  { route: "/workspace/graph", source: "src/App.tsx", featureType: "Workspace", expectedPageType: "Graph workspace", needsBrowserSmoke: true },
  { route: "/workspace/3d", source: "src/App.tsx", featureType: "Workspace", expectedPageType: "3D workspace", needsBrowserSmoke: true },
  { route: "/workspace/data", source: "src/App.tsx", featureType: "Workspace", expectedPageType: "Data workspace", needsBrowserSmoke: true },
];

const ncertRouteItems: RouteInventoryItem[] = ncertConcepts.map((concept) => ({
  route: ncertRoute(concept.id),
  source: "src/data/ncertConcepts.ts",
  featureType: "NCERT",
  expectedPageType: `${concept.classLevel} visual concept route`,
  needsBrowserSmoke: ["Class 7", "Class 10", "Class 12"].includes(concept.classLevel),
  priority: ["Class 7", "Class 10", "Class 12"].includes(concept.classLevel),
  classLevel: concept.classLevel,
}));

const mathLabRouteItems: RouteInventoryItem[] = Array.from(
  new Map(mathLabTools.map((tool) => [tool.route, tool])).values(),
).map((tool) => ({
  route: tool.route,
  source: "src/data/mathLabTools.ts",
  featureType: "Math Lab",
  expectedPageType: `${tool.title} tool`,
  needsBrowserSmoke: false,
}));

const visualProofRouteItems: RouteInventoryItem[] = visualProofsIndex.map((proof) => ({
  route: proof.route,
  source: "src/visual-proofs/data/visualProofsIndex.ts",
  featureType: "Visual Proof",
  expectedPageType: proof.status === "available" ? "Interactive visual proof" : "Deferred visual proof route",
  needsBrowserSmoke: proof.status === "available",
  priority: proof.status === "available",
}));

const formulaRouteItems: RouteInventoryItem[] = formulaCategories.map((category) => ({
  route: `/formulas/${category.id}`,
  source: "src/data/formulaLibrary.ts",
  featureType: "Formula",
  expectedPageType: `${category.title} formula category`,
  needsBrowserSmoke: false,
}));

const theoremRouteItems: RouteInventoryItem[] = theoremCategories.flatMap((category) => [
  {
    route: `/theorems/${category.id}`,
    source: "src/data/theoremLibrary.ts",
    featureType: "Theorem" as const,
    expectedPageType: `${category.title} theorem category`,
    needsBrowserSmoke: false,
  },
  ...category.theorems.map((theorem) => ({
    route: `/theorems/${category.id}/${theorem.slug}`,
    source: "src/data/theoremLibrary.ts",
    featureType: "Theorem" as const,
    expectedPageType: "Theorem detail page",
    needsBrowserSmoke: false,
  })),
]);

export function buildRouteInventory(): RouteInventoryItem[] {
  const siteLinkItems: RouteInventoryItem[] = internalSiteLinks.map((link) => ({
    route: link.path,
    source: "src/data/siteLinks.ts",
    featureType: classifySiteLink(link.path),
    expectedPageType: link.category,
    needsBrowserSmoke: false,
  }));

  const inventory = [
    ...appRouteItems,
    ...siteLinkItems,
    ...ncertRouteItems,
    ...mathLabRouteItems,
    ...visualProofRouteItems,
    ...formulaRouteItems,
    ...theoremRouteItems,
  ];

  return Array.from(new Map(inventory.map((item) => [item.route, item])).values()).sort((a, b) => a.route.localeCompare(b.route));
}

export function ncertSmokeRoutes(): RouteInventoryItem[] {
  return [
    appRouteItems[0],
    appRouteItems[1],
    ...ncertRouteItems.filter((item) => item.needsBrowserSmoke),
  ];
}

export function appSmokeRoutes(): RouteInventoryItem[] {
  return appRouteItems.filter((item) => item.needsBrowserSmoke);
}

function classifySiteLink(path: string): RouteFeatureType {
  if (path === "/") return "home";
  if (path.startsWith("/ncert")) return "NCERT";
  if (path.startsWith("/math-lab")) return "Math Lab";
  if (path.startsWith("/visual-proofs")) return "Visual Proof";
  if (path.startsWith("/formulas")) return "Formula";
  if (path.startsWith("/theorems")) return "Theorem";
  if (path.startsWith("/modules/ar-math-lab")) return "AR/XR";
  if (path.startsWith("/workspace")) return "Workspace";
  if (path === "/sitemap" || path === "/documentation") return "Search/Menu";
  return "Other";
}
