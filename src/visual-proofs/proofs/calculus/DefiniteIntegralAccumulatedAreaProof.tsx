import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import IntegralAccumulatedAreaMobileProof from "./IntegralAccumulatedAreaMobileProof";

export default function DefiniteIntegralAccumulatedAreaProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <IntegralAccumulatedAreaMobileProof />;
}
