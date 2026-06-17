import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { midpointFormulaPhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function MidpointFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={midpointFormulaPhaseEightConfig} />;
}
