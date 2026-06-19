import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { logarithmInverseExponentialPhaseTwentyFiveConfig } from "../phase-twenty-five/phaseTwentyFiveProofConfigs";

export default function LogarithmInverseExponentialProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={logarithmInverseExponentialPhaseTwentyFiveConfig} />;
}
