import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { slopeInterceptPhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function SlopeInterceptLineEquationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={slopeInterceptPhaseEightConfig} />;
}
