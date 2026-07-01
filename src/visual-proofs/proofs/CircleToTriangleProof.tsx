import { PhaseTwoProofExperience } from "../components/PhaseTwoProofExperience";
import { circleAreaUnrollingPhaseElevenConfig } from "./phase-eleven/phaseElevenProofConfigs";
import type { VisualProof, VisualProofCategory } from "../data/proofTypes";

export default function CircleToTriangleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={circleAreaUnrollingPhaseElevenConfig} />;
}
