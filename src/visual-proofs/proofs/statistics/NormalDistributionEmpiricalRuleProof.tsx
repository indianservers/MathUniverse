import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { normalEmpiricalRulePhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function NormalDistributionEmpiricalRuleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={normalEmpiricalRulePhaseEighteenConfig} />;
}
