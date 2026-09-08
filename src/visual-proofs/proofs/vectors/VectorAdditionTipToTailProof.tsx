import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import VectorAdditionMobileProof from "./VectorAdditionMobileProof";

export default function VectorAdditionTipToTailProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <VectorAdditionMobileProof />;
}
