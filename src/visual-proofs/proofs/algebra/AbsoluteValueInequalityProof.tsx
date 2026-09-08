import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import AbsoluteValueInequalityMobileProof from "./AbsoluteValueInequalityMobileProof";

export default function AbsoluteValueInequalityProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <AbsoluteValueInequalityMobileProof />;
}
