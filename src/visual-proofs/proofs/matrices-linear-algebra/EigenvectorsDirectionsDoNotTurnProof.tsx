import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import EigenvectorDirectionMobileProof from "./EigenvectorDirectionMobileProof";

export default function EigenvectorsDirectionsDoNotTurnProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <EigenvectorDirectionMobileProof />;
}
