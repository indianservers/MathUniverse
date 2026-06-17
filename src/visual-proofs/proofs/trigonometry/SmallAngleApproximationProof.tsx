import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { smallAngleApproximationPhaseSevenConfig } from "../phase-seven/phaseSevenProofConfigs";

export default function SmallAngleApproximationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={smallAngleApproximationPhaseSevenConfig} />;
}
