import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { arithmeticProgressionSumPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function SumArithmeticProgressionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={arithmeticProgressionSumPhaseThirteenConfig} />;
}
