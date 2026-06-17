import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { perpendicularLinesSlopePhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function PerpendicularLinesSlopeProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={perpendicularLinesSlopePhaseEightConfig} />;
}
