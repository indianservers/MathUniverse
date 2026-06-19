import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { divisibilityPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function DivisibilityEqualGroupingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={divisibilityPhaseSixteenConfig} />;
}
