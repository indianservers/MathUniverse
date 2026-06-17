import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { differenceOfSquaresPhaseFourConfig } from "../phase-four/phaseFourProofConfigs";

export default function DifferenceOfSquaresProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={differenceOfSquaresPhaseFourConfig} />;
}
