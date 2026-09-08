import type { VisualProof, VisualProofCategory } from "../data/proofTypes";
import CircleSectorsMobileProof from "./geometry/CircleSectorsMobileProof";

export default function CircleAreaUnrollingProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <CircleSectorsMobileProof />;
}
