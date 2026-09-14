import { GeometryLabShell } from "../geometryLabUx";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import CongruenceLab from "./CongruenceLab";
import SimilarityLab from "./SimilarityLab";
import TriangleCentersLab from "./TriangleCentersLab";
import TriangleExplorerLab from "./TriangleExplorerLab";
import TriangleInequalitiesLab from "./TriangleInequalitiesLab";
import TriangleModeTabs from "./TriangleModeTabs";
import "./TrianglesLab.css";
import { useTriangleLabMode } from "./useTriangleLabMode";

export default function TrianglesLab({ page }: { page: StudioMockupPage }) {
  const { mode, setMode, modes } = useTriangleLabMode();
  const current = modes.find((item) => item.id === mode) ?? modes[0]!;
  return (
    <GeometryLabShell
      lab="triangles"
      modes={modes}
      mode={mode}
      onChange={(id) => setMode(id as typeof mode)}
      liveSummary={`${current.label}: ${current.subtitle}. Drag a vertex, read live sides and angles, then check the challenge.`}
    >
      <TriangleModeTabs modes={modes} mode={mode} onChange={setMode} />
      {mode === "explorer" ? <TriangleExplorerLab /> : null}
      {mode === "congruence" ? <CongruenceLab /> : null}
      {mode === "similarity" ? <SimilarityLab /> : null}
      {mode === "centers" ? <TriangleCentersLab /> : null}
      {mode === "inequalities" ? <TriangleInequalitiesLab /> : null}
      <MockupLearningStrip page={page} />
    </GeometryLabShell>
  );
}
