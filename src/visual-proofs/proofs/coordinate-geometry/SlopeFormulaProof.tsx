import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { slopeFormulaPhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function SlopeFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={slopeFormulaPhaseEightConfig} />;
}
