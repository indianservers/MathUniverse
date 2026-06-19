import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { exponentsRepeatedMultiplicationPhaseTwentyFiveConfig } from "../phase-twenty-five/phaseTwentyFiveProofConfigs";

export default function ExponentsRepeatedMultiplicationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={exponentsRepeatedMultiplicationPhaseTwentyFiveConfig} />;
}
