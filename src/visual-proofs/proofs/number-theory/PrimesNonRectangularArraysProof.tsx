import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { primesPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function PrimesNonRectangularArraysProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={primesPhaseSixteenConfig} />;
}
