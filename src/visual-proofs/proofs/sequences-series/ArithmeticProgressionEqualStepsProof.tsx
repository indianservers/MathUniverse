import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { arithmeticProgressionPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function ArithmeticProgressionEqualStepsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={arithmeticProgressionPhaseThirteenConfig} />;
}
