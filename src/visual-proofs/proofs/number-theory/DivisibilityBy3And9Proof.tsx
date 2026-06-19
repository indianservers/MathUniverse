import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { digitSumPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function DivisibilityBy3And9Proof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={digitSumPhaseSixteenConfig} />;
}
