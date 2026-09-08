import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import UnitCircleIdentityMobileProof from "./UnitCircleIdentityMobileProof";

export default function PythagoreanTrigIdentityProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <UnitCircleIdentityMobileProof />;
}
