import type { ReactNode } from "react";
import DedicatedStudioLab from "./labs/DedicatedStudioLabs";
import type { StudioMockupPage } from "./studioMockupCatalog";

export default function MockupInteractiveLab({
  page,
  extra,
}: {
  page: StudioMockupPage;
  extra?: ReactNode;
}) {
  return <DedicatedStudioLab page={page} extra={extra} />;
}
