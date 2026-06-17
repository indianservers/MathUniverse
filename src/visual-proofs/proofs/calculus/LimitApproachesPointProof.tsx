import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { limitApproachesPointPhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function LimitApproachesPointProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={limitApproachesPointPhaseFourteenConfig} />;
}
