import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { integrationByPartsPhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function IntegrationByPartsVisualProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={integrationByPartsPhaseFifteenConfig} />;
}
