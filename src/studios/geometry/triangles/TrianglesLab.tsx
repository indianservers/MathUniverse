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
  return (
    <>
      <TriangleModeTabs modes={modes} mode={mode} onChange={setMode} />
      {mode === "explorer" ? <TriangleExplorerLab /> : null}
      {mode === "congruence" ? <CongruenceLab /> : null}
      {mode === "similarity" ? <SimilarityLab /> : null}
      {mode === "centers" ? <TriangleCentersLab /> : null}
      {mode === "inequalities" ? <TriangleInequalitiesLab /> : null}
      <MockupLearningStrip page={page} />
    </>
  );
}
