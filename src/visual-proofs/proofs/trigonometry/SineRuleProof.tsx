import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import TrigProofTemplate from "./TrigProofTemplate";
import { trigProofConfigs } from "./trigProofConfigs";

export default function SineRuleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <TrigProofTemplate category={category} proof={proof} config={trigProofConfigs.SineRuleProof} />;
}
