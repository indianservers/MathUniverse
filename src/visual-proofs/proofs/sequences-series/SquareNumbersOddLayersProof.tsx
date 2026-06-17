import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { squareNumbersOddLayersPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function SquareNumbersOddLayersProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={squareNumbersOddLayersPhaseThirteenConfig} />;
}
