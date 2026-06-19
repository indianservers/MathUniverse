import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { inequalityNumberLinePhaseTwentyFourConfig } from "../phase-twenty-four/phaseTwentyFourProofConfigs";

export default function InequalityNumberLineProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={inequalityNumberLinePhaseTwentyFourConfig} />;
}
