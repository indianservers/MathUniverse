import { useLocation, useSearchParams } from "react-router-dom";
import { MockupStudioChrome, MockupStudioHome } from "./MockupStudioChrome";
import MockupInteractiveLab from "./MockupInteractiveLab";
import { matchStudioPage, studioMockups, type StudioMockupDefinition } from "./studioMockupCatalog";
import type { ReactNode } from "react";

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
  return (
    <MockupStudioChrome studio={studio} page={page}>
      {page.id === "home" ? <MockupStudioHome studio={studio} /> : <MockupInteractiveLab page={page} extra={extras?.[page.id]} />}
    </MockupStudioChrome>
  );
}

export function studioDefinition(id: keyof typeof studioMockups): StudioMockupDefinition {
  return studioMockups[id];
}
