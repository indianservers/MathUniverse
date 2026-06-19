import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { exponentialGrowthDecayPhaseTwentyFiveConfig } from "../phase-twenty-five/phaseTwentyFiveProofConfigs";

export default function ExponentialGrowthDecayProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={exponentialGrowthDecayPhaseTwentyFiveConfig} />;
}
