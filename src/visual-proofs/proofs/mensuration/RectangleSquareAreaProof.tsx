import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { rectangleSquareAreaPhaseTwentyTwoConfig } from "../phase-twenty-two/phaseTwentyTwoProofConfigs";

export default function RectangleSquareAreaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={rectangleSquareAreaPhaseTwentyTwoConfig} />;
}
