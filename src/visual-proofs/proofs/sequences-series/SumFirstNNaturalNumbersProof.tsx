import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import NaturalSumMobileProof from "./NaturalSumMobileProof";

export default function SumFirstNNaturalNumbersProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <NaturalSumMobileProof />;
}
