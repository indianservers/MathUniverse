import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import CalculusProofTemplate from "./CalculusProofTemplate";
import { calculusProofConfigs } from "./calculusProofConfigs";

export default function IntegrationByPartsVisualProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <CalculusProofTemplate category={category} proof={proof} config={calculusProofConfigs.IntegrationByPartsVisualProof} />;
}
