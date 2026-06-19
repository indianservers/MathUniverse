import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { amGmInequalityPhaseTwentyFourConfig } from "../phase-twenty-four/phaseTwentyFourProofConfigs";

export default function AmGmInequalityProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={amGmInequalityPhaseTwentyFourConfig} />;
}
