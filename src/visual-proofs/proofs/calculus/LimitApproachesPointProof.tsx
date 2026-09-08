import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import EpsilonDeltaMobileProof from "./EpsilonDeltaMobileProof";

export default function LimitApproachesPointProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <EpsilonDeltaMobileProof />;
}
