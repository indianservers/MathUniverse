import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import DerivativeSlopeMobileProof from "./DerivativeSlopeMobileProof";

export default function DerivativeSlopeOfTangentProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <DerivativeSlopeMobileProof />;
}
