import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import NumberTheoryProofTemplate from "./NumberTheoryProofTemplate";
import { numberTheoryProofConfigs } from "./numberTheoryProofConfigs";

export default function LcmGridAlignmentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <NumberTheoryProofTemplate category={category} proof={proof} config={numberTheoryProofConfigs.LcmGridAlignmentProof} />;
}
