import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { squareOfDifferencePhaseFourConfig } from "../phase-four/phaseFourProofConfigs";

export default function SquareOfDifferenceProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={squareOfDifferencePhaseFourConfig} />;
}
