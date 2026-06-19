import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { lcmPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function LcmGridAlignmentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={lcmPhaseSixteenConfig} />;
}
