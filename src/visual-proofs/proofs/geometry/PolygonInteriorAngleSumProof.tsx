import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import PolygonTriangulationMobileProof from "./PolygonTriangulationMobileProof";

export default function PolygonInteriorAngleSumProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PolygonTriangulationMobileProof />;
}
