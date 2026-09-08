import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import SlopeTrianglesMobileProof from "./SlopeTrianglesMobileProof";

export default function SlopeFormulaProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <SlopeTrianglesMobileProof />;
}
