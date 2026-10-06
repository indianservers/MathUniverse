import { useLocation, useSearchParams } from "react-router-dom";
import { MockupStudioChrome, MockupStudioHome } from "./MockupStudioChrome";
import MockupInteractiveLab from "./MockupInteractiveLab";
import { matchStudioPage, studioMockups, type StudioMockupDefinition } from "./studioMockupCatalog";
import type { ReactNode } from "react";
import LinearAlgebraEnhancementWorkbench from "../linear-algebra/LinearAlgebraEnhancementWorkbench";
import GeometryEnhancementWorkbench from "../geometry/GeometryEnhancementWorkbench";
import TrigonometryEnhancementWorkbench from "../trigonometry/TrigonometryEnhancementWorkbench";
import StatisticsEnhancementWorkbench from "../statistics/StatisticsEnhancementWorkbench";
import ModellingEnhancementWorkbench from "../modelling/ModellingEnhancementWorkbench";
const advancedWorkbenches: Record<string, () => ReactNode> = {
  "linear-algebra": LinearAlgebraEnhancementWorkbench,
  geometry: GeometryEnhancementWorkbench,
  trigonometry: TrigonometryEnhancementWorkbench,
  statistics: StatisticsEnhancementWorkbench,
  modelling: ModellingEnhancementWorkbench,
};

export default function MockupStudioApp({
  studioId,
  extras,
}: {
  studioId: keyof typeof studioMockups;
  extras?: Record<string, ReactNode>;
}) {
  const studio = studioMockups[studioId];
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const page = matchStudioPage(studio, pathname, params.get("mode"));
  const Advanced = advancedWorkbenches[studioId];
  const advanced = !!Advanced && [params.get("mode"), params.get("tab"), params.get("workbench")].includes("advanced");
  return (
    <MockupStudioChrome studio={studio} page={page}>
      {advanced ? <Advanced /> : page.id === "home" ? <MockupStudioHome studio={studio} /> : <MockupInteractiveLab page={page} extra={extras?.[page.id]} />}
    </MockupStudioChrome>
  );
}

export function studioDefinition(id: keyof typeof studioMockups): StudioMockupDefinition {
  return studioMockups[id];
}
