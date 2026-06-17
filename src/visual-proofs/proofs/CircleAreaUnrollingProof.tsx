import { PhaseTwoProofExperience } from "../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../data/proofTypes";
import { circleAreaUnrollingPhaseElevenConfig } from "./phase-eleven/phaseElevenProofConfigs";

export default function CircleAreaUnrollingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={circleAreaUnrollingPhaseElevenConfig} />;
}
