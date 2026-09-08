import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import EquationBalanceMobileProof from "./EquationBalanceMobileProof";

export default function EquationAsBalanceProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <EquationBalanceMobileProof />;
}
