import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import ParallelogramCutSlideMobileProof from "./ParallelogramCutSlideMobileProof";

export default function ParallelogramAreaShearingProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <ParallelogramCutSlideMobileProof />;
}
