import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { circleEquationPhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function CircleEquationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={circleEquationPhaseEightConfig} />;
}
