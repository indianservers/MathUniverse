import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { parallelLinesSlopePhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function ParallelLinesSlopeProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={parallelLinesSlopePhaseEightConfig} />;
}
