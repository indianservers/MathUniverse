import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import TrapezoidDoublingMobileProof from "./TrapezoidDoublingMobileProof";

export default function TrapezoidAreaDuplicationProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <TrapezoidDoublingMobileProof />;
}
