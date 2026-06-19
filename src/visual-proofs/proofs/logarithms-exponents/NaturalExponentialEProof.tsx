import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { naturalExponentialPhaseTwentyFiveConfig } from "../phase-twenty-five/phaseTwentyFiveProofConfigs";

export default function NaturalExponentialEProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={naturalExponentialPhaseTwentyFiveConfig} />;
}
