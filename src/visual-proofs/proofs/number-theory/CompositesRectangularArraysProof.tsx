import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { compositesPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function CompositesRectangularArraysProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={compositesPhaseSixteenConfig} />;
}
