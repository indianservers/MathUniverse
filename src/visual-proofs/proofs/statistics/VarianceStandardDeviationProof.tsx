import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { varianceStandardDeviationPhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function VarianceStandardDeviationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={varianceStandardDeviationPhaseEighteenConfig} />;
}
