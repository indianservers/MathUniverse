import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import TriangleAngleSumMobileProof from "./TriangleAngleSumMobileProof";

export default function TriangleAngleSumProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <TriangleAngleSumMobileProof />;
}
