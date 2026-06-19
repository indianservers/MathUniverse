import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { meanBalancePhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function MeanAsBalancePointProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={meanBalancePhaseEighteenConfig} />;
}
